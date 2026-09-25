# Cardio Risk API (FastAPI backend)

Serves the trained `cardio_randomforest_best_model_1_.pkl` RandomForest model
behind a single `/predict` endpoint.

## Folder contents

```
backend/
├── main.py            # FastAPI app + /predict route
├── requirements.txt
├── model/
│   └── cardio_model.pkl
└── .gitignore
```

## Run locally

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # optional
pip install -r requirements.txt
uvicorn main:app --reload
```

Visit `http://127.0.0.1:8000/docs` for the interactive Swagger UI.

## Environment variables

| Variable          | Purpose                                              | Example                                      |
|--------------------|-------------------------------------------------------|-----------------------------------------------|
| `ALLOWED_ORIGINS`  | Comma-separated list of frontends allowed to call the API | `https://your-frontend.vercel.app,http://localhost:5173` |

## Deploy on Render

1. Push this `backend/` folder to GitHub.
2. On [render.com](https://render.com) → **New → Web Service** → connect the repo.
3. Settings:
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add an `ALLOWED_ORIGINS` environment variable once you know your Vercel URL.
5. Deploy, then copy the live URL (`https://your-service.onrender.com`) — the
   frontend needs it.

## API reference

`POST /predict`

```json
{
  "age_years": 52,
  "gender": 2,
  "height_cm": 172,
  "weight_kg": 78,
  "ap_hi": 130,
  "ap_lo": 85,
  "cholesterol": 1,
  "gluc": 1,
  "smoke": 0,
  "alco": 0,
  "active": 1
}
```

`gender`: `1` = female, `2` = male.
`cholesterol` / `gluc`: `1` normal, `2` above normal, `3` well above normal.

Response:

```json
{
  "prediction": 0,
  "label": "Not at risk",
  "probability": 0.23,
  "risk_band": "low"
}
```
