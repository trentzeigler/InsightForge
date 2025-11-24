from __future__ import annotations

from typing import Any, Dict, List

import numpy as np
import pandas as pd
from scipy import stats


def _numeric_summary(series: pd.Series) -> Dict[str, Any]:
    clean = series.dropna().astype(float)
    if clean.empty:
        return {}
    return {
        "mean": float(clean.mean()),
        "median": float(clean.median()),
        "std": float(clean.std()),
        "min": float(clean.min()),
        "max": float(clean.max()),
    }


def _categorical_summary(series: pd.Series) -> Dict[str, Any]:
    counts = series.fillna("<missing>").value_counts().head(5)
    return {str(index): int(value) for index, value in counts.to_dict().items()}


def _correlation_matrix(df: pd.DataFrame) -> List[Dict[str, Any]]:
    correlations: List[Dict[str, Any]] = []
    numeric_cols = df.select_dtypes(include=["number"]).columns
    corr_matrix = df[numeric_cols].corr(method="pearson") if len(numeric_cols) >= 2 else None
    if corr_matrix is not None:
        for i, col in enumerate(numeric_cols):
            for j in range(i + 1, len(numeric_cols)):
                other = numeric_cols[j]
                value = corr_matrix.loc[col, other]
                if pd.notna(value) and abs(value) > 0.4:
                    correlations.append(
                        {
                            "source": col,
                            "target": other,
                            "coefficient": round(float(value), 4),
                            "method": "pearson",
                        }
                    )
    return correlations


def _outliers(df: pd.DataFrame) -> List[Dict[str, Any]]:
    findings: List[Dict[str, Any]] = []
    for column in df.select_dtypes(include=["number"]).columns:
        series = df[column].dropna()
        if series.empty:
            continue
        z_scores = np.abs(stats.zscore(series))
        mask = z_scores > 3
        if mask.any():
            findings.append(
                {
                    "column": column,
                    "count": int(mask.sum()),
                    "max_z": float(z_scores[mask].max()),
                }
            )
    return findings


def _distributions(df: pd.DataFrame) -> Dict[str, Any]:
    numeric = []
    categorical = []

    for column in df.columns:
        if pd.api.types.is_numeric_dtype(df[column]):
            bucket_counts, bin_edges = np.histogram(df[column].dropna(), bins=10)
            numeric.append(
                {
                    "column": column,
                    "bins": [round(float(edge), 2) for edge in bin_edges[:-1]],
                    "counts": [int(count) for count in bucket_counts],
                }
            )
        else:
            values = (
                df[column]
                .fillna("<missing>")
                .value_counts()
                .head(8)
                .reset_index()
                .rename(columns={"index": "label", column: "value"})
            )
            categorical.append(
                {
                    "column": column,
                    "values": values.to_dict(orient="records"),
                }
            )
    return {"numeric": numeric, "categorical": categorical}


def _data_quality(df: pd.DataFrame) -> List[Dict[str, str]]:
    metrics = []
    missing_pct = round(float(df.isna().mean().mean() * 100), 2)
    metrics.append({"label": "Missingness", "value": f"{missing_pct}%"})

    mixed_types = [col for col in df.columns if df[col].apply(type).nunique() > 3]
    if mixed_types:
        metrics.append({"label": "Mixed types", "value": ", ".join(mixed_types[:3])})

    return metrics


def run_analysis(df: pd.DataFrame) -> Dict[str, Any]:
    summary = {
        "rows": int(len(df)),
        "columns": int(len(df.columns)),
        "missing_cells_pct": round(float(df.isna().mean().mean() * 100), 2),
    }

    column_profiles = []
    for column in df.columns:
        series = df[column]
        column_type = "numeric" if pd.api.types.is_numeric_dtype(series) else "categorical"
        column_profiles.append(
            {
                "name": column,
                "type": column_type,
                "stats": _numeric_summary(series) if column_type == "numeric" else _categorical_summary(series),
            }
        )

    return {
        "summary": summary,
        "columns": column_profiles,
        "correlations": _correlation_matrix(df),
        "outliers": _outliers(df),
        "distributions": _distributions(df),
        "data_quality": _data_quality(df),
    }
