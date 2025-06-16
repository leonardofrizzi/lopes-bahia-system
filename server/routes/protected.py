from fastapi import APIRouter, Depends
from dependencies import get_current_user

router = APIRouter()

@router.get("/protegido")
def rota_protegida(user = Depends(get_current_user)):
    return {"mensagem": f"Olá, {user['nome']}! Esta é uma rota protegida."}
