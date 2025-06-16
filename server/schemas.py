from pydantic import BaseModel

class UserCreate(BaseModel):
    nome: str
    cpf: str
    senha: str
    cargo: str

class UserLogin(BaseModel):
    cpf: str
    senha: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    cpf: str | None = None

class UserOut(BaseModel):
    nome: str
    cpf: str
    cargo: str

class TokenWithUser(Token):
    usuario: UserOut
