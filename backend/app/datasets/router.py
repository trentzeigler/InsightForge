from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from app.auth.service import get_current_user
from app.core.database import get_db
from app.datasets import service
from app.datasets.schemas import DatasetDetailResponse, DatasetItem, DatasetUploadResponse

router = APIRouter()


@router.get("", response_model=list[DatasetItem])
def list_user_datasets(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    datasets = service.list_datasets(db, current_user.id)
    return [
        {
            "id": dataset.id,
            "name": dataset.name,
            "size_bytes": dataset.size_bytes,
            "uploaded_at": dataset.created_at,
            "row_count": dataset.row_count,
            "column_count": dataset.column_count,
        }
        for dataset in datasets
    ]


@router.post("/upload", response_model=DatasetUploadResponse)
async def upload_dataset(
    background: BackgroundTasks,
    file: UploadFile = File(...),
    dataset_name: str = Form(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    dataset = service.create_dataset(db, current_user.id, file, dataset_name)
    service.request_analysis(background, dataset)
    return {"dataset_id": dataset.id}


@router.get("/{dataset_id}", response_model=DatasetDetailResponse)
def fetch_dataset(dataset_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return service.fetch_dataset(db, current_user.id, dataset_id)


@router.post("/{dataset_id}/analyze")
def analyze_dataset(
    dataset_id: str,
    background: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    dataset = service.get_dataset_owned(db, current_user.id, dataset_id)
    service.request_analysis(background, dataset)
    return {"status": "queued"}
