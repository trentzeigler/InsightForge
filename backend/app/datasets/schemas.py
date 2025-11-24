from datetime import datetime
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, RootModel


class DatasetItem(BaseModel):
    id: UUID
    name: str
    size_bytes: int
    uploaded_at: datetime
    row_count: Optional[int]
    column_count: Optional[int]

    model_config = ConfigDict(from_attributes=True)


class DatasetListResponse(RootModel[List[DatasetItem]]):
    pass


class DatasetDetailResponse(BaseModel):
    metadata: Any
    analysis: Any
    insights: Any


class DatasetUploadResponse(BaseModel):
    dataset_id: UUID
