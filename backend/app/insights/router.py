from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.auth.service import get_current_user
from app.core.database import get_db
from app.datasets.service import get_dataset_owned
from app.insights.service import generate_insight
from app.models import AnalysisResult

router = APIRouter()


class InsightRequest(BaseModel):
    question: Optional[str] = None


class InsightResponse(BaseModel):
    insight_id: UUID
    summary: str
    payload: dict


@router.post("/{dataset_id}/generate", response_model=InsightResponse)
def create_insight(
    dataset_id: str,
    payload: InsightRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    dataset = get_dataset_owned(db, current_user.id, dataset_id)
    analysis = db.query(AnalysisResult).filter(AnalysisResult.dataset_id == dataset.id).first()
    insight = generate_insight(db, dataset, analysis, question=payload.question)
    return {"insight_id": insight.id, "summary": insight.summary, "payload": insight.payload}
