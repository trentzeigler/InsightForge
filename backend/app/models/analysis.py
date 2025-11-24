import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    dataset_id = Column(UUID(as_uuid=True), ForeignKey("datasets.id", ondelete="CASCADE"), unique=True)
    summary = Column(JSON)
    columns = Column(JSON)
    outliers = Column(JSON)
    correlations = Column(JSON)
    distributions = Column(JSON)
    data_quality = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
