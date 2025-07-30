# server/routes/auth.py
import os
from fastapi import APIRouter, HTTPException, Depends, Response
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from schemas import (
    UserCreate,
    UserLogin,
    TokenWithUser,
    UserOut,
    UsersResponse,
    UserUpdate,
)
from auth import hash_password, verify_password, create_access_token
from database import usuarios_table

router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM  = os.getenv("ALGORITHM")
ADMIN_CPF  = os.getenv("ADMIN_CPF")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_cpf(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        cpf = payload.get("sub")
        if not cpf:
            raise HTTPException(status_code=401, detail="Token inválido")
        return cpf
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")


@router.post("/register", response_model=UserOut)
def register(
    user: UserCreate,
    current_cpf: str = Depends(get_current_cpf)
):
    if current_cpf != ADMIN_CPF:
        raise HTTPException(status_code=403, detail="Somente administrador pode registrar usuários")
    resp = usuarios_table.get_item(Key={"cpf": user.cpf})
    if "Item" in resp:
        raise HTTPException(status_code=400, detail="CPF já cadastrado")
    hashed = hash_password(user.senha)
    item = {
        "cpf":             user.cpf,
        "nome":            user.nome,
        "cargo":           user.cargo,
        "hashed_password": hashed,
        "role":            user.cargo  # ou outro valor se preferir
    }
    usuarios_table.put_item(Item=item)
    return UserOut(
        nome=item["nome"],
        cpf=item["cpf"],
        cargo=item["cargo"],
        role=item.get("role")
    )


@router.post("/login", response_model=TokenWithUser)
def login(user: UserLogin):
    resp = usuarios_table.get_item(Key={"cpf": user.cpf})
    item = resp.get("Item")
    if not item or not verify_password(user.senha, item["hashed_password"]):
        raise HTTPException(status_code=401, detail="CPF ou senha inválidos")
    token = create_access_token({"sub": user.cpf})
    usuario_out = UserOut(
        nome=item["nome"],
        cpf=item["cpf"],
        cargo=item.get("cargo", ""),
        role=item.get("role")
    )
    return {
        "access_token": token,
        "token_type":   "bearer",
        "usuario":      usuario_out
    }


@router.get("/users", response_model=UsersResponse)
def list_users(current_cpf: str = Depends(get_current_cpf)):
    if current_cpf != ADMIN_CPF:
        raise HTTPException(status_code=403, detail="Acesso negado")
    resp  = usuarios_table.scan()
    items = resp.get("Items", [])
    users = [
        UserOut(
            nome=item["nome"],
            cpf=item["cpf"],
            cargo=item.get("cargo", ""),
            role=item.get("role")
        )
        for item in items
    ]
    return UsersResponse(users=users)


@router.get("/users/{cpf}", response_model=UserOut)
def get_user(
    cpf: str,
    current_cpf: str = Depends(get_current_cpf)
):
    if current_cpf != ADMIN_CPF:
        raise HTTPException(status_code=403, detail="Acesso negado")
    resp = usuarios_table.get_item(Key={"cpf": cpf})
    item = resp.get("Item")
    if not item:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return UserOut(
        nome=item["nome"],
        cpf=item["cpf"],
        cargo=item.get("cargo", ""),
        role=item.get("role")
    )


@router.patch("/users/{cpf}", response_model=UserOut)
def update_user(
    cpf: str,
    user: UserUpdate,
    current_cpf: str = Depends(get_current_cpf)
):
    if current_cpf != ADMIN_CPF:
        raise HTTPException(status_code=403, detail="Acesso negado")
    resp = usuarios_table.get_item(Key={"cpf": cpf})
    item = resp.get("Item")
    if not item:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    # aplica updates parciais
    if user.nome is not None:
        item["nome"] = user.nome
    if user.cargo is not None:
        item["cargo"] = user.cargo
    if user.role is not None:
        item["role"]  = user.role
    usuarios_table.put_item(Item=item)
    return UserOut(**item)


@router.delete("/users/{cpf}", status_code=204)
def delete_user(
    cpf: str,
    current_cpf: str = Depends(get_current_cpf)
):
    if current_cpf != ADMIN_CPF:
        raise HTTPException(status_code=403, detail="Acesso negado")
    usuarios_table.delete_item(Key={"cpf": cpf})
    return Response(status_code=204)