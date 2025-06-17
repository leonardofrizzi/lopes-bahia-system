import os
from dotenv import load_dotenv
import boto3
from botocore.exceptions import ClientError

load_dotenv()

client = boto3.client(
    "dynamodb",
    region_name=os.getenv("AWS_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

def create_table_usuarios():
    try:
        client.describe_table(TableName="usuarios")
    except ClientError as e:
        if e.response["Error"]["Code"] == "ResourceNotFoundException":
            client.create_table(
                TableName="usuarios",
                KeySchema=[{"AttributeName": "cpf", "KeyType": "HASH"}],
                AttributeDefinitions=[{"AttributeName": "cpf", "AttributeType": "S"}],
                BillingMode="PAY_PER_REQUEST"
            )

def create_table_empreendimentos():
    try:
        client.describe_table(TableName="empreendimentos")
    except ClientError as e:
        if e.response["Error"]["Code"] == "ResourceNotFoundException":
            client.create_table(
                TableName="empreendimentos",
                AttributeDefinitions=[{"AttributeName": "id", "AttributeType": "S"}],
                KeySchema=[{"AttributeName": "id", "KeyType": "HASH"}],
                BillingMode="PAY_PER_REQUEST"
            )

if __name__ == "__main__":
    create_table_usuarios()
    create_table_empreendimentos()
