import io
import shutil
from pathlib import Path
from typing import BinaryIO

import boto3
from botocore.exceptions import ClientError

from app.core.config import settings


class ObjectStorageClient:
    def __init__(self):
        self.bucket = settings.s3_bucket
        self._use_local = not (settings.aws_access_key_id and settings.aws_secret_access_key)
        self._local_root = Path(settings.local_storage_path).resolve()
        self.client = None

        if not self._use_local:
            session = boto3.session.Session(
                aws_access_key_id=settings.aws_access_key_id,
                aws_secret_access_key=settings.aws_secret_access_key,
                region_name=settings.s3_region,
            )
            self.client = session.client("s3")
        else:
            self._local_root.mkdir(parents=True, exist_ok=True)

    def _local_path(self, key: str) -> Path:
        safe_key = key.lstrip("/")
        return self._local_root.joinpath(safe_key)

    def upload_file(self, file_obj: BinaryIO, key: str, content_type: str | None = None):
        file_obj.seek(0)
        if self._use_local:
            destination = self._local_path(key)
            destination.parent.mkdir(parents=True, exist_ok=True)
            with open(destination, "wb") as handle:
                shutil.copyfileobj(file_obj, handle)
            return

        extra = {"ContentType": content_type or "application/octet-stream"}
        assert self.client is not None
        self.client.upload_fileobj(file_obj, self.bucket, key, ExtraArgs=extra)

    def download_file(self, key: str) -> bytes:
        if self._use_local:
            path = self._local_path(key)
            with open(path, "rb") as handle:
                return handle.read()

        assert self.client is not None
        stream = io.BytesIO()
        self.client.download_fileobj(self.bucket, key, stream)
        return stream.getvalue()

    def ensure_bucket(self):
        if self._use_local:
            self._local_root.mkdir(parents=True, exist_ok=True)
            return

        assert self.client is not None
        try:
            self.client.head_bucket(Bucket=self.bucket)
        except ClientError:
            self.client.create_bucket(Bucket=self.bucket)
