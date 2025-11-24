import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, JSON, Text
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class Insight(Base):
    __tablename__ = "ai_insights"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    dataset_id = Column(UUID(as_uuid=True), ForeignKey("datasets.id", ondelete="CASCADE"), index=True)
    summary = Column(Text)
    payload = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
