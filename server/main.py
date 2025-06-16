import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
if not SECRET_KEY or not ALGORITHM:
    raise RuntimeError("SECRET_KEY e ALGORITHM devem estar definidos no .env")
print(f"[*] JWT settings -> SECRET_KEY: {'*' * 8} (hidden), ALGORITHM: {ALGORITHM}")

title = "Sistema Lopes Bahia Backend"
app = FastAPI(title=title)

title
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Para dev, depois restringir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routes.auth import router as auth_router
from routes.protected import router as protected_router

app.include_router(auth_router, prefix="/auth")
app.include_router(protected_router, prefix="/area-segura")

@app.get("/", tags=["status"])
def root():
    return {"message": "Backend do Sistema Lopes Bahia online"}
