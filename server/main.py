from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.protected import router as protected_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # para dev, depois restrinja
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(protected_router, prefix="/area-segura")

@app.get("/")
def root():
    return {"message": "Backend do Sistema Lopes Bahia online"}
