from pydantic import BaseModel, EmailStr

class User(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    cargo: str

class UserLogin(BaseModel):
    email: str
    senha: str

class UserInDB(BaseModel):
    nome: str
    email: str
    hashed_password: str
    cargo: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: str | None = None
