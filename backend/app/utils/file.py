import os
import uuid
from pathlib import Path
from typing import BinaryIO


def dataset_storage_key(user_id: str, filename: str) -> str:
    ext = Path(filename).suffix or ".csv"
    return f"datasets/{user_id}/{uuid.uuid4()}{ext}"


def file_size(upload_file) -> int:
    position = upload_file.file.tell()
    upload_file.file.seek(0, os.SEEK_END)
    size = upload_file.file.tell()
    upload_file.file.seek(position)
    return size


def to_file_like(data: bytes) -> BinaryIO:
    import io

    buffer = io.BytesIO(data)
    buffer.seek(0)
    return buffer
