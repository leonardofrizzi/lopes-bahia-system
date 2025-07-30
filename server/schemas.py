# server/schemas.py

from pydantic import BaseModel
from typing import Optional, List

# —————— Usuários ——————

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
    cpf: Optional[str] = None

class UserOut(BaseModel):
    nome: str
    cpf: str
    cargo: str
    role: Optional[str] = None

class TokenWithUser(Token):
    usuario: UserOut

class UserUpdate(BaseModel):
    nome: Optional[str] = None
    cargo: Optional[str] = None
    role: Optional[str] = None

class UsersResponse(BaseModel):
    users: List[UserOut]


# —————— Empreendimentos ——————

class EmpreendimentoCreate(BaseModel):
    # ao criar, o cliente não envia o id
    nome: str
    tipo_imovel: str
    dormitorios: Optional[int] = None
    suites: Optional[int] = None
    vagas: Optional[int] = None
    area_m2: Optional[float] = None
    data_entrega: Optional[str] = None
    estagio: Optional[str] = None
    endereco: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    incorporador: Optional[str] = None
    coordenador: Optional[str] = None
    link_book: Optional[str] = None
    link_tabela: Optional[str] = None
    ngc: Optional[int] = None

class EmpreendimentoOut(BaseModel):
    # ao devolver, sempre há um id
    id: str
    nome: str
    tipo_imovel: str
    dormitorios: Optional[int] = None
    suites: Optional[int] = None
    vagas: Optional[int] = None
    area_m2: Optional[float] = None
    data_entrega: Optional[str] = None
    estagio: Optional[str] = None
    endereco: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    incorporador: Optional[str] = None
    coordenador: Optional[str] = None
    link_book: Optional[str] = None
    link_tabela: Optional[str] = None
    ngc: Optional[int] = None

class EmpreendimentoUpdate(BaseModel):
    nome: Optional[str] = None
    tipo_imovel: Optional[str] = None
    dormitorios: Optional[int] = None
    suites: Optional[int] = None
    vagas: Optional[int] = None
    area_m2: Optional[float] = None
    data_entrega: Optional[str] = None
    estagio: Optional[str] = None
    endereco: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    incorporador: Optional[str] = None
    coordenador: Optional[str] = None
    link_book: Optional[str] = None
    link_tabela: Optional[str] = None
    ngc: Optional[int] = None

class EmpreendimentosResponse(BaseModel):
    empreendimentos: List[EmpreendimentoOut]