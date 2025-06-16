import os 
from dotenv import load_dotenv
import boto3
from botocore.exceptions import ClientError

load_dotenv()

dynamodb = boto3.client(
    "dynamodb",
    region_name=os.getenv("AWS_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

def create_table_usuarios():
    """
    Cria a tabela 'usuarios' com:
     - chave de partição (partition key) 'cpf' (string)
     - modo de cobrança on-demand (PAY_PER_REQUEST)
    """
    params = {
        "TableName": "usuarios",
        "KeySchema": [
            {"AttributeName": "cpf", "KeyType": "HASH"}, 
        ],
        "AttributeDefinitions": [
            {"AttributeName": "cpf", "AttributeType": "S"},
        ],
        "BillingMode": "PAY_PER_REQUEST",
    }

    try:
        resp = dynamodb.create_table(**params)
        print(f"Tabela criada: {resp['TableDescription']['TableName']}")
    except ClientError as e:
        code = e.response["Error"]["Code"]
        if code == "ResourceInUseException":
            print("Tabela 'usuarios' já existe.")
        else:
            print("Erro ao criar tabela:", e)
            raise

if __name__ == "__main__":
    create_table_usuarios()