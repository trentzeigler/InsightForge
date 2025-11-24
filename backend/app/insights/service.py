import json
from typing import Any, Dict, Optional

from openai import OpenAI
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models import AnalysisResult, Dataset, Insight

client = OpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None

INSIGHT_TEMPLATE = """
You are InsightForge, a data analyst. Provide:
- Executive summary (2 sentences)
- Top 5 trends
- Data quality notes
- Anomalies worth investigating
- Suggested charts
- Follow-up questions

Respond as JSON with keys: summary, top_trends, data_quality_notes, anomalies, suggested_charts, follow_up_questions.
Dataset: {dataset_name}
Columns: {columns}
Summary stats: {summary}
Outliers: {outliers}
Correlations: {correlations}
User question: {question}
"""


def _fallback_payload(question: Optional[str] = None) -> Dict[str, Any]:
    return {
        "latest": {
            "summary": "Automated insights placeholder (set OPENAI_API_KEY to enable).",
            "top_trends": [
                "Revenue is trending upward quarter-over-quarter.",
                "Customer churn stabilized across regions.",
            ],
            "data_quality_notes": ["Minimal missingness detected."],
            "anomalies": ["Spike detected in APAC marketing spend."],
            "suggested_charts": ["Stacked bar of revenue by region"],
            "follow_up_questions": [question or "What drives gross margin variance?"],
        }
    }


def generate_insight(
    db: Session,
    dataset: Dataset,
    analysis: AnalysisResult | None,
    question: Optional[str] = None,
) -> Insight:
    columns = analysis.columns if analysis and analysis.columns else []
    prompt = INSIGHT_TEMPLATE.format(
        dataset_name=dataset.name,
        columns=[col.get("name") for col in columns] if columns else [],
        summary=analysis.summary if analysis and analysis.summary else {},
        outliers=analysis.outliers if analysis and analysis.outliers else [],
        correlations=analysis.correlations if analysis and analysis.correlations else [],
        question=question or "N/A",
    )

    payload = _fallback_payload(question)
    if client:
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": "You are InsightForge analyst."},
                    {"role": "user", "content": prompt},
                ],
            )
            content = response.choices[0].message.content or "{}"
            payload = {"latest": json.loads(content)}
            payload["latest"]["question"] = question
        except Exception:
            payload = _fallback_payload(question)

    insight = Insight(dataset_id=dataset.id, summary=payload["latest"].get("summary", ""), payload=payload)
    db.add(insight)
    db.commit()
    db.refresh(insight)
    return insight
