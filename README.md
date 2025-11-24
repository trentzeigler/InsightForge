# InsightForge

Upload data. Get smart insights instantly.

InsightForge is a full-stack data intelligence platform that lets teams upload CSV/XLSX files, profile them automatically, and receive AI-generated narratives plus ready-to-share dashboards. It is built as two deployable services:

- `frontend/` – Next.js 15 (App Router, TypeScript, Tailwind) consuming backend APIs via server actions, rendering dashboards, upload flow, and AI follow-ups.
- `backend/` – FastAPI service providing auth, dataset ingestion, statistical analysis (pandas/scikit-learn), object storage integration, and OpenAI-powered insight generation persisted in PostgreSQL.

## Feature Highlights

- Email/password authentication with HttpOnly session cookies, logout, and profile endpoints (OAuth-ready).
- Secure dataset uploads (CSV/XLSX) with metadata capture, object storage persistence, schema inference, and preview rows.
- Automated analysis pipeline: summary stats, correlations, outlier detection, categorical frequencies, numeric distributions, and data quality scoring saved as JSON blobs for fast retrieval.
- Dynamic dashboards: dataset overview, tabular preview, auto-selected charts, correlation callouts, AI-generated narratives, and follow-up questions.
- AI insights: Prompt orchestration (OpenAI GPT-4o mini by default) that ingests stats/outliers/correlations and returns structured sections (summary, trends, red flags, suggested charts, follow-ups).
- Background re-analysis endpoint so users can retrigger profiling on demand.

## Tech Stack

| Layer     | Technology                                                                 |
|-----------|-----------------------------------------------------------------------------|
| Frontend  | Next.js 15 App Router · React 18 · TypeScript · Tailwind · Chart.js         |
| Backend   | FastAPI · SQLAlchemy 2.0 · PostgreSQL · Pandas · NumPy · SciPy · OpenAI     |
| Storage   | S3-compatible (AWS S3, Supabase, MinIO) for raw files                       |
| Auth      | HttpOnly cookie sessions stored in PostgreSQL `sessions` table              |
| AI        | OpenAI GPT-4o mini (falls back to deterministic copy when no API key set)   |

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Python 3.11+
- PostgreSQL 14+ (local or managed)
- S3-compatible bucket (AWS S3, Supabase, MinIO, etc.)
- OpenAI API key (optional but required for real AI narratives)

### 1. Configure environment

```bash
cp .env.example .env
```

Fill in:

- `DATABASE_URL` – SQLAlchemy connection string (e.g., `postgresql+psycopg2://user:pass@localhost:5432/insightforge`)
- `NEXT_PUBLIC_API_URL` (frontend) and `API_BASE_URL` (backend)
- `AWS_*` or Supabase storage credentials
- `OPENAI_API_KEY` (optional)

### 2. Run PostgreSQL (example Docker)

```bash
docker run --name insightforge-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
```

### 3. Backend service

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Key endpoints:

- `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- `POST /datasets/upload` (multipart CSV/XLSX), `POST /datasets/{id}/analyze`, `GET /datasets`, `GET /datasets/{id}`
- `POST /insights/{id}/generate`

### 4. Frontend app

```bash
cd frontend
npm install
npm run dev -- --port 3000
```

Visit `http://localhost:3000`, register/login, upload a dataset, and watch the dashboard populate as the background analysis completes.

## Data & AI Pipeline

1. **Upload** – Files stream to object storage with generated keys per user. Metadata (size, columns, preview rows) persists in `datasets`.
2. **Analysis job** – Background task downloads the file, runs pandas + SciPy profiling (`run_analysis`), and stores outputs (summary, per-column stats, distributions, correlations, outliers, data quality indicators) in `analysis_results`.
3. **AI generation** – `insights/service.py` composes a structured prompt from dataset metadata, stats, correlations, outliers, and optional follow-up question. Results are saved to `ai_insights` and surfaced in the dashboard.


Happy hacking! 🎉
