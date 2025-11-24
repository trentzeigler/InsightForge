import os
import tempfile
from pathlib import Path
from typing import Any, Dict, List

import pandas as pd


def _load_dataframe(upload_path: str, suffix: str) -> pd.DataFrame:
    if suffix in {".xlsx", ".xls"}:
        return pd.read_excel(upload_path)
    return pd.read_csv(upload_path)


def _read_tempfile(contents: bytes, suffix: str) -> pd.DataFrame:
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        temp_file.write(contents)
        temp_path = temp_file.name

    try:
        df = _load_dataframe(temp_path, suffix)
    finally:
        os.unlink(temp_path)
    return df


def read_upload_to_df(upload_file) -> pd.DataFrame:
    suffix = Path(upload_file.filename or ".csv").suffix.lower()
    contents = upload_file.file.read()
    df = _read_tempfile(contents, suffix)
    upload_file.file.seek(0)
    return df


def dataframe_from_bytes(data: bytes, suffix: str = ".csv") -> pd.DataFrame:
    return _read_tempfile(data, suffix)


def infer_schema(df: pd.DataFrame) -> List[Dict[str, Any]]:
    schema = []
    for column in df.columns:
        series = df[column]
        dtype = "categorical"
        if pd.api.types.is_numeric_dtype(series):
            dtype = "numeric"
        elif pd.api.types.is_datetime64_any_dtype(series):
            dtype = "datetime"
        elif pd.api.types.is_bool_dtype(series):
            dtype = "boolean"

        schema.append(
            {
                "name": column,
                "type": dtype,
                "null_pct": float(series.isna().mean() * 100),
                "unique": int(series.nunique(dropna=True)),
            }
        )
    return schema


def preview_rows(df: pd.DataFrame, limit: int = 100):
    records = df.head(limit).where(pd.notnull(df), None).to_dict(orient="records")
    normalized = []
    for row in records:
        normalized.append(
            {
                key: (value.item() if hasattr(value, "item") else value)
                for key, value in row.items()
            }
        )
    return normalized
