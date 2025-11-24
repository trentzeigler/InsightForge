from datetime import datetime
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel


class DatasetItem(BaseModel):
    id: UUID
    name: str
    size_bytes: int
    uploaded_at: datetime
    row_count: Optional[int]
    column_count: Optional[int]

    class Config:
        orm_mode = True


class DatasetListResponse(BaseModel):
    __root__: List[DatasetItem]


class DatasetDetailResponse(BaseModel):
    metadata: Any
    analysis: Any
    insights: Any


class DatasetUploadResponse(BaseModel):
    dataset_id: UUID
