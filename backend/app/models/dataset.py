import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    storage_path = Column(Text, nullable=False)
    size_bytes = Column(Integer, nullable=False)
    status = Column(String(50), default="uploaded")
    row_count = Column(Integer)
    column_count = Column(Integer)
    schema = Column(JSON)
    preview_rows = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
