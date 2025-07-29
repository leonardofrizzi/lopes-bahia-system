import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    def __init__(self):
        self.secret_key                  = os.getenv("SECRET_KEY")
        self.algorithm                   = os.getenv("ALGORITHM")
        self.access_token_expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
        self.aws_access_key_id           = os.getenv("AWS_ACCESS_KEY_ID")
        self.aws_secret_access_key       = os.getenv("AWS_SECRET_ACCESS_KEY")
        self.aws_region                  = os.getenv("AWS_REGION")
        self.videos_bucket               = os.getenv("VIDEOS_BUCKET")
        self.admin_cpf                   = os.getenv("ADMIN_CPF")
        self.admin_nome                  = os.getenv("ADMIN_NOME")
        self.admin_password              = os.getenv("ADMIN_PASSWORD")
        self.admin_role                  = os.getenv("ADMIN_ROLE") 

settings = Settings()