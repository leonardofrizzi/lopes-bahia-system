import os
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
load_dotenv()

AWS_REGION = os.getenv('AWS_REGION')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
TABLE_NAME = 'Empreendimentos'

dynamodb = boto3.client(
    'dynamodb',
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

def create_table():
    try:
        existing = dynamodb.describe_table(TableName=TABLE_NAME)
        print(f"Tabela '{TABLE_NAME}' já existe. Status: {existing['Table']['TableStatus']}")
        return
    except ClientError as e:
        if e.response['Error']['Code'] != 'ResourceNotFoundException':
            raise

    params = {
        'TableName': TABLE_NAME,
        'AttributeDefinitions': [
            {'AttributeName': 'id', 'AttributeType': 'S'},
        ],
        'KeySchema': [
            {'AttributeName': 'id', 'KeyType': 'HASH'}, 
        ],
        'BillingMode': 'PAY_PER_REQUEST',
    }

    response = dynamodb.create_table(**params)
    print(f"Criando tabela '{TABLE_NAME}'... Status: {response['TableDescription']['TableStatus']}")

if __name__ == '__main__':
    create_table()
