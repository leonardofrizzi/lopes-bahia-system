from settings import settings
import boto3
from botocore.exceptions import ClientError
from auth import hash_password

ADMIN_CPF      = settings.admin_cpf
ADMIN_NOME     = settings.admin_nome
ADMIN_PASSWORD = settings.admin_password
ADMIN_ROLE     = settings.admin_role  # já vindo do .env

dynamodb = boto3.resource(
    "dynamodb",
    region_name=settings.aws_region,
    aws_access_key_id=settings.aws_access_key_id,
    aws_secret_access_key=settings.aws_secret_access_key,
)
table = dynamodb.Table("usuarios")

def seed_admin():
    try:
        resp = table.get_item(Key={"cpf": ADMIN_CPF})
    except ClientError as e:
        print("[seed_admin] erro ao buscar item:", e)
        return

    if "Item" in resp:
        item = resp["Item"]
        # se o role for diferente ou não existir, atualiza:
        if item.get("role") != ADMIN_ROLE:
            table.update_item(
                Key={"cpf": ADMIN_CPF},
                UpdateExpression="SET #r = :r",
                ExpressionAttributeNames={"#r": "role"},
                ExpressionAttributeValues={":r": ADMIN_ROLE},
            )
            print(f"[seed_admin] Atualizei o role do admin para '{ADMIN_ROLE}'.")
        else:
            print(f"[seed_admin] Administrador já existe com o role correto (CPF={ADMIN_CPF}).")
    else:
        # insere o admin pela primeira vez
        hashed = hash_password(ADMIN_PASSWORD)
        table.put_item(
            Item={
                "cpf": ADMIN_CPF,
                "nome": ADMIN_NOME,
                "role": ADMIN_ROLE,
                "hashed_password": hashed,
            }
        )
        print(f"[seed_admin] Administrador criado: {ADMIN_NOME} ({ADMIN_CPF}) com role '{ADMIN_ROLE}'.")

if __name__ == "__main__":
    seed_admin()