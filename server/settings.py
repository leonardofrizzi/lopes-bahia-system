from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    aws_region: str
    aws_access_key_id: str
    aws_secret_access_key: str
    videos_bucket: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"  
    )

settings = Settings()
