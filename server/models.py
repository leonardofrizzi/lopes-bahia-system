from pydantic import BaseModel, EmailStr, Field
from enum import Enum
from typing import Optional

class RoleEnum(str, Enum):
    superadmin       = "SuperAdmin"
    diretor          = "Diretor"
    gerente          = "Gerente"
    corretor         = "Corretor de imóveis"
    operacional      = "Operacional"

class User(BaseModel):
    cpf: str = Field(..., description="CPF do usuário, usado para login")
    nome: str
    email: EmailStr
    senha: str  = Field(..., min_length=8, description="Senha em texto plano (será hash-ada no servidor)")
    role: RoleEnum = Field(RoleEnum.operacional, description="Perfil de acesso do usuário")

class UserLogin(BaseModel):
    cpf: str = Field(..., description="CPF cadastrado do usuário")
    senha: str = Field(..., min_length=8)