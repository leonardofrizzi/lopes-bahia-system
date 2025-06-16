import os
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from schemas import TokenData, UserOut
from database import usuarios_table

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme)) -> UserOut:
    """
    Decodifica o JWT recebido no header Authorization e retorna o usuário logado.
    Se inválido ou não existir, lança HTTP 401.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais inválidas.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token,
            os.getenv("SECRET_KEY"),
            algorithms=[os.getenv("ALGORITHM")]
        )
        cpf: str = payload.get("sub")
        if cpf is None:
            raise credentials_exception
        token_data = TokenData(cpf=cpf)
    except JWTError:
        raise credentials_exception

    resp = usuarios_table.get_item(Key={"cpf": token_data.cpf})
    item = resp.get("Item")
    if not item:
        raise credentials_exception

    return UserOut(nome=item["nome"], cpf=item["cpf"], cargo=item.get("cargo", ""))
