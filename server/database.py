import os
from dotenv import load_dotenv
import boto3

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

_dynamodb_resource = boto3.resource(
    "dynamodb",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

usuarios_table = _dynamodb_resource.Table("usuarios")
dynamodb_table_usuarios = usuarios_table

empreendimentos_table = _dynamodb_resource.Table("empreendimentos")
dynamodb_table_empreendimentos = empreendimentos_table
