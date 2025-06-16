import os
from dotenv import load_dotenv
import boto3
from botocore.exceptions import ClientError
from auth import hash_password

load_dotenv()

ADMIN_CPF      = os.getenv("ADMIN_CPF")
ADMIN_NOME     = os.getenv("ADMIN_NOME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

dynamodb = boto3.resource(
    "dynamodb",
    region_name=os.getenv("AWS_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
)
table = dynamodb.Table("usuarios")

def seed_admin():
    resp = table.get_item(Key={"cpf": ADMIN_CPF})
    if "Item" in resp:
        print(f"[seed_admin] Administrador já existe (CPF={ADMIN_CPF}).")
        return

    hashed = hash_password(ADMIN_PASSWORD)
    table.put_item(
        Item={
            "cpf": ADMIN_CPF,
            "nome": ADMIN_NOME,
            "cargo": "Administrador",      # valor fixo
            "hashed_password": hashed,
        }
    )
    print(f"[seed_admin] Administrador criado: {ADMIN_NOME} ({ADMIN_CPF})")

if __name__ == "__main__":
    seed_admin()
