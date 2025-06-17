import uuid
import os
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from schemas import EmpreendimentoCreate
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

    if "area_m2" in item and item["area_m2"] is not None:
        item["area_m2"] = Decimal(str(item["area_m2"]))

    empreendimentos_table.put_item(Item=item)
    return {"id": item["id"]}

