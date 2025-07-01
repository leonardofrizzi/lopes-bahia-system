# routes/empreendimentos.py
import uuid
import os
from decimal import Decimal
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from schemas import EmpreendimentoCreate, EmpreendimentoOut
from dependencies import get_current_cpf
from database import dynamodb_table_empreendimentos as empreendimentos_table

router = APIRouter(tags=["empreendimentos"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def criar_empreendimento(
    data: EmpreendimentoCreate,
    cpf: str = Depends(get_current_cpf),
):
    if cpf != os.getenv("ADMIN_CPF"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Somente administrador pode criar empreendimentos"
        )
    item = data.dict(exclude_unset=True)
    item["id"] = str(uuid.uuid4())
    if item.get("area_m2") is not None:
        item["area_m2"] = Decimal(str(item["area_m2"]))
    empreendimentos_table.put_item(Item=item)
    return {"id": item["id"]}

@router.get("/", response_model=List[EmpreendimentoOut])
def listar_empreendimentos(
    nome: Optional[str] = Query(None),
    bairro: Optional[str] = Query(None),
    tipo_imovel: Optional[str] = Query(None, alias="tipo_imovel"),
    estagio: Optional[str] = Query(None),
    cpf: str = Depends(get_current_cpf),
):
    filter_expressions = []
    expr_values = {}
    expr_names = {}

    if nome:
        filter_expressions.append("contains(#nome, :nome)")
        expr_names["#nome"] = "nome"
        expr_values[":nome"] = nome
    if bairro:
        filter_expressions.append("contains(bairro, :bairro)")
        expr_values[":bairro"] = bairro
    if tipo_imovel:
        filter_expressions.append("tipo_imovel = :tipo_imovel")
        expr_values[":tipo_imovel"] = tipo_imovel
    if estagio:
        filter_expressions.append("estagio = :estagio")
        expr_values[":estagio"] = estagio

    scan_kwargs = {}
    if filter_expressions:
        scan_kwargs["FilterExpression"] = " AND ".join(filter_expressions)
        scan_kwargs["ExpressionAttributeValues"] = expr_values
        if expr_names:
            scan_kwargs["ExpressionAttributeNames"] = expr_names

    resp = empreendimentos_table.scan(**scan_kwargs)
    items = resp.get("Items", [])
    for itm in items:
        if isinstance(itm.get("area_m2"), Decimal):
            itm["area_m2"] = float(itm["area_m2"])
    return items
