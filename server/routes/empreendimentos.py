# server/routes/empreendimentos.py
from fastapi import APIRouter, Depends, HTTPException, Response
from typing import List
import uuid
from decimal import Decimal

from schemas import (
    EmpreendimentoCreate,
    EmpreendimentoOut,
    EmpreendimentoUpdate,
    EmpreendimentosResponse,
)
from routes.auth import get_current_cpf
from database import empreendimentos_table

router = APIRouter(
    prefix="/empreendimentos",
    tags=["empreendimentos"],
)

def _convert_floats_to_decimal(item: dict) -> dict:
    """
    Converte quaisquer valores float em Decimal, para o boto3 aceitar no DynamoDB.
    """
    for key, value in list(item.items()):
        if isinstance(value, float):
            item[key] = Decimal(str(value))
    return item

@router.post("/", response_model=EmpreendimentoOut)
def create_empreendimento(
    emp: EmpreendimentoCreate,
    cpf_atual: str = Depends(get_current_cpf),
):
    # gera um id único
    new_id = str(uuid.uuid4())
    item = emp.dict()
    item["id"] = new_id

    # converte floats para Decimal
    item = _convert_floats_to_decimal(item)

    # salva na tabela
    empreendimentos_table.put_item(Item=item)
    return EmpreendimentoOut(**item)

@router.get("/", response_model=EmpreendimentosResponse)
def list_empreendimentos(
    cpf_atual: str = Depends(get_current_cpf),
):
    resp = empreendimentos_table.scan()
    items = resp.get("Items", [])
    emps: List[EmpreendimentoOut] = [EmpreendimentoOut(**i) for i in items]
    return EmpreendimentosResponse(empreendimentos=emps)

@router.get("/{id}", response_model=EmpreendimentoOut)
def get_empreendimento(
    id: str,
    cpf_atual: str = Depends(get_current_cpf),
):
    resp = empreendimentos_table.get_item(Key={"id": id})
    item = resp.get("Item")
    if not item:
        raise HTTPException(status_code=404, detail="Empreendimento não encontrado")
    return EmpreendimentoOut(**item)

@router.patch("/{id}", response_model=EmpreendimentoOut)
def update_empreendimento(
    id: str,
    emp: EmpreendimentoUpdate,
    cpf_atual: str = Depends(get_current_cpf),
):
    resp = empreendimentos_table.get_item(Key={"id": id})
    item = resp.get("Item")
    if not item:
        raise HTTPException(status_code=404, detail="Empreendimento não encontrado")

    # aplica apenas os campos enviados
    update_data = emp.dict(exclude_unset=True)

    # converte floats para Decimal
    update_data = _convert_floats_to_decimal(update_data)

    item.update(update_data)
    empreendimentos_table.put_item(Item=item)
    return EmpreendimentoOut(**item)

@router.delete("/{id}", status_code=204)
def delete_empreendimento(
    id: str,
    cpf_atual: str = Depends(get_current_cpf),
):
    empreendimentos_table.delete_item(Key={"id": id})
    return Response(status_code=204)