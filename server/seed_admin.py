from settings import settings
import sys
print("[DEBUG] sys.path =", sys.path)

import boto3
from botocore.exceptions import ClientError
from auth import hash_password

ADMIN_CPF      = settings.admin_cpf
ADMIN_NOME     = settings.admin_nome
ADMIN_PASSWORD = settings.admin_password

dynamodb = boto3.resource(
    "dynamodb",
    region_name=settings.aws_region,
    aws_access_key_id=settings.aws_access_key_id,
    aws_secret_access_key=settings.aws_secret_access_key,
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
            "cargo": "Administrador",
            "hashed_password": hashed,
        }
    )
    print(f"[seed_admin] Administrador criado: {ADMIN_NOME} ({ADMIN_CPF})")

if __name__ == "__main__":
    seed_admin()
