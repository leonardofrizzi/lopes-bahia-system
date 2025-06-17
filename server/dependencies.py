import os
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from database import usuarios_table
from schemas import UserOut

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM  = os.getenv("ALGORITHM")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_cpf(token: str = Depends(oauth2_scheme)) -> str:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        cpf = payload.get("sub")
        if not cpf:
            raise credentials_exception
        return cpf
    except JWTError:
        raise credentials_exception


def get_current_user(cpf: str = Depends(get_current_cpf)) -> UserOut:
    resp = usuarios_table.get_item(Key={"cpf": cpf})
    item = resp.get("Item")
    if not item:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não encontrado"
        )
    return UserOut(nome=item["nome"], cpf=item["cpf"], cargo=item.get("cargo", ""))
