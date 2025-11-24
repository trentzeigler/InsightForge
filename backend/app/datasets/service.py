from fastapi import BackgroundTasks, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from pathlib import Path

from app.core.database import SessionLocal
from app.datasets.analyzer import run_analysis
from app.datasets.parser import dataframe_from_bytes, infer_schema, preview_rows, read_upload_to_df
from app.models import AnalysisResult, Dataset, Insight
from app.utils.decorators import traced
from app.utils.file import dataset_storage_key, file_size
from app.utils.s3 import ObjectStorageClient

storage_client = ObjectStorageClient()
try:
    storage_client.ensure_bucket()
except Exception:
    # Bucket creation might fail on read-only credentials; ignore in local dev.
    pass


def list_datasets(db: Session, user_id):
    return (
        db.query(Dataset)
        .filter(Dataset.user_id == user_id)
        .order_by(Dataset.created_at.desc())
        .all()
    )


@traced("dataset_upload")
def create_dataset(db: Session, user_id, upload: UploadFile, dataset_name: str):
    df = read_upload_to_df(upload)
    storage_key = dataset_storage_key(user_id, upload.filename or "dataset.csv")
    storage_client.upload_file(upload.file, storage_key, upload.content_type)

    dataset = Dataset(
        user_id=user_id,
        name=dataset_name or upload.filename or "Untitled dataset",
        original_filename=upload.filename or "upload.csv",
        storage_path=storage_key,
        size_bytes=file_size(upload),
        row_count=len(df),
        column_count=len(df.columns),
        schema=infer_schema(df),
        preview_rows=preview_rows(df, limit=100),
    )
    db.add(dataset)
    db.commit()
    db.refresh(dataset)
    return dataset


def serialize_dataset(dataset: Dataset, analysis: AnalysisResult | None, insight: Insight | None):
    return {
        "metadata": {
            "id": str(dataset.id),
            "name": dataset.name,
            "size_bytes": dataset.size_bytes,
            "uploaded_at": dataset.created_at.isoformat(),
            "row_count": dataset.row_count,
            "column_count": dataset.column_count,
            "schema": dataset.schema,
            "preview_rows": dataset.preview_rows,
        },
        "analysis": {
            "summary": analysis.summary if analysis else None,
            "columns": analysis.columns if analysis else None,
            "correlations": analysis.correlations if analysis else None,
            "outliers": analysis.outliers if analysis else None,
            "distributions": analysis.distributions if analysis else None,
            "data_quality": analysis.data_quality if analysis else None,
        }
        if analysis
        else {},
        "insights": insight.payload if insight else {},
    }


def fetch_dataset(db: Session, user_id, dataset_id):
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id, Dataset.user_id == user_id).first()
    if not dataset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")

    analysis = db.query(AnalysisResult).filter(AnalysisResult.dataset_id == dataset.id).first()
    insight = (
        db.query(Insight)
        .filter(Insight.dataset_id == dataset.id)
        .order_by(Insight.created_at.desc())
        .first()
    )
    return serialize_dataset(dataset, analysis, insight)


def _persist_analysis(db: Session, dataset_id, payload: dict):
    existing = db.query(AnalysisResult).filter(AnalysisResult.dataset_id == dataset_id).first()
    if existing:
        for field, value in payload.items():
            setattr(existing, field, value)
        db.commit()
        db.refresh(existing)
        return existing

    result = AnalysisResult(dataset_id=dataset_id, **payload)
    db.add(result)
    db.commit()
    db.refresh(result)
    return result


def _run_analysis_sync(dataset_id):
    db = SessionLocal()
    try:
        dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
        if not dataset:
            return
        raw_bytes = storage_client.download_file(dataset.storage_path)
        suffix = Path(dataset.original_filename or "dataset.csv").suffix or ".csv"
        df = dataframe_from_bytes(raw_bytes, suffix=suffix)
        profile = run_analysis(df)
        _persist_analysis(
            db,
            dataset.id,
            {
                "summary": profile["summary"],
                "columns": profile["columns"],
                "correlations": profile["correlations"],
                "outliers": profile["outliers"],
                "distributions": profile["distributions"],
                "data_quality": profile["data_quality"],
            },
        )
    finally:
        db.close()


def request_analysis(background: BackgroundTasks, dataset: Dataset):
    background.add_task(_run_analysis_sync, dataset.id)


def get_dataset_owned(db: Session, user_id, dataset_id) -> Dataset:
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id, Dataset.user_id == user_id).first()
    if not dataset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")
    return dataset
