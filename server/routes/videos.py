import time
import os

from fastapi import APIRouter, Depends, HTTPException
import boto3

from settings import settings
from dependencies import get_current_cpf

router = APIRouter(tags=["videos"])

s3 = boto3.client(
    "s3",
    region_name=settings.aws_region,
    aws_access_key_id=settings.aws_access_key_id,
    aws_secret_access_key=settings.aws_secret_access_key,
)

@router.post("/upload-url")
def get_upload_url(
    filename: str,
    cpf: str = Depends(get_current_cpf),
):
    admin_cpf = os.getenv("ADMIN_CPF")
    if cpf != admin_cpf:
        raise HTTPException(status_code=403, detail="Somente administrador pode gerar URLs de upload")

    key = f"videos/{cpf}/{int(time.time())}-{filename}"
    upload_url = s3.generate_presigned_url(
        ClientMethod="put_object",
        Params={
            "Bucket": settings.videos_bucket,
            "Key": key,
            "ContentType": "video/mp4",
        },
        ExpiresIn=600,
    )
    return {"uploadUrl": upload_url, "key": key}
