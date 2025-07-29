from pydantic import BaseModel
from typing import Optional

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
    role: str

class TokenWithUser(Token):
    usuario: UserOut

class EmpreendimentoCreate(BaseModel):
    id: Optional[str] = None
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
    incorporador: Optional[str] = None
    coordenador: Optional[str] = None
    link_book: Optional[str] = None
    link_tabela: Optional[str] = None

class EmpreendimentoOut(BaseModel):
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
    incorporador: Optional[str] = None
    coordenador: Optional[str] = None
    link_book: Optional[str] = None
    link_tabela: Optional[str] = None