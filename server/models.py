from pydantic import BaseModel, EmailStr
from enum import Enum

class CargoEnum(str, Enum):
    diretor = "Diretor"
    gerente = "Gerente"
    corretor = "Corretor de imóveis"
    operacional = "Operacional"

class User(BaseModel):
    nome: str
    email: str
    senha: str
    cargo: CargoEnum

class UserLogin(BaseModel):
    email: str
    senha: str
