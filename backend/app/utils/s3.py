import io
from typing import BinaryIO

import boto3
from botocore.exceptions import ClientError

from app.core.config import settings


class ObjectStorageClient:
    def __init__(self):
        session = boto3.session.Session(
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
            region_name=settings.s3_region,
        )
        self.client = session.client(
            "s3",
        )
        self.bucket = settings.s3_bucket

    def upload_file(self, file_obj: BinaryIO, key: str, content_type: str | None = None):
        extra = {"ContentType": content_type or "application/octet-stream"}
        file_obj.seek(0)
        self.client.upload_fileobj(file_obj, self.bucket, key, ExtraArgs=extra)

    def download_file(self, key: str) -> bytes:
        stream = io.BytesIO()
        self.client.download_fileobj(self.bucket, key, stream)
        return stream.getvalue()

    def ensure_bucket(self):
        try:
            self.client.head_bucket(Bucket=self.bucket)
        except ClientError:
            self.client.create_bucket(Bucket=self.bucket)
