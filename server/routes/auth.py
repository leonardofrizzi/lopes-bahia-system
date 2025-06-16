from fastapi import APIRouter, HTTPException
from models import User, UserLogin
from schemas import Token, UserInDB
from auth import hash_password, verify_password, create_access_token
from database import db

router = APIRouter()

@router.post("/register", response_model=Token)
def register(user: User):
    users_collection = db["usuarios"]
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email já registrado.")

    hashed_pwd = hash_password(user.senha)
    user_db = UserInDB(
        nome=user.nome,
        email=user.email,
        hashed_password=hashed_pwd,
        cargo=user.cargo
    )
    users_collection.insert_one(user_db.dict())

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/login")
def login(user: UserLogin):
    users_collection = db["usuarios"]
    user_found = users_collection.find_one({"email": user.email})
    if not user_found:
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")

    if not verify_password(user.senha, user_found["hashed_password"]):
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")

    token = create_access_token({"sub": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "nome": user_found["nome"],
        "cargo": user_found["cargo"]
    }
