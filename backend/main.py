"""
Cardio Risk API
----------------
A small FastAPI service that wraps the trained RandomForestClassifier
(cardio_randomforest_best_model_1_.pkl) and exposes a single /predict
endpoint the React frontend calls.

Run locally:
    uvicorn main:app --reload

Deploy on Render:
    Build command : pip install -r requirements.txt
    Start command : uvicorn main:app --host 0.0.0.0 --port $PORT
"""

import os
from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Cardio Risk API",
    description="Predicts cardiovascular disease risk from a RandomForest model.",
    version="1.0.0",
)

# Comma separated list of allowed origins, e.g.
#   ALLOWED_ORIGINS="https://your-frontend.vercel.app,http://localhost:5173"
raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
ALLOWED_ORIGINS = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Model loading
# ---------------------------------------------------------------------------

MODEL_PATH = Path(__file__).parent / "model" / "cardio_model.pkl"
FEATURE_ORDER = [
    "age", "gender", "height", "weight",
    "ap_hi", "ap_lo", "cholesterol", "gluc",
    "smoke", "alco", "active",
]

model = None


@app.on_event("startup")
def load_model() -> None:
    global model
    if not MODEL_PATH.exists():
        raise RuntimeError(f"Model file not found at {MODEL_PATH}")
    model = joblib.load(MODEL_PATH)


# ---------------------------------------------------------------------------
# Request / response schemas
# ---------------------------------------------------------------------------

class PatientInput(BaseModel):
    age_years: float = Field(..., gt=0, lt=120, description="Age in years")
    gender: int = Field(..., ge=1, le=2, description="1 = female, 2 = male")
    height_cm: float = Field(..., gt=100, lt=250, description="Height in centimetres")
    weight_kg: float = Field(..., gt=20, lt=300, description="Weight in kilograms")
    ap_hi: int = Field(..., gt=0, lt=300, description="Systolic blood pressure")
    ap_lo: int = Field(..., gt=0, lt=250, description="Diastolic blood pressure")
    cholesterol: int = Field(..., ge=1, le=3, description="1 normal, 2 above normal, 3 well above normal")
    gluc: int = Field(..., ge=1, le=3, description="1 normal, 2 above normal, 3 well above normal")
    smoke: int = Field(..., ge=0, le=1)
    alco: int = Field(..., ge=0, le=1)
    active: int = Field(..., ge=0, le=1)

    class Config:
        json_schema_extra = {
            "example": {
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
                "active": 1,
            }
        }


class PredictionOutput(BaseModel):
    prediction: int
    label: str
    probability: float
    risk_band: str


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/")
def root():
    return {"status": "ok", "service": "cardio-risk-api"}


@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": model is not None}


@app.post("/predict", response_model=PredictionOutput)
def predict(payload: PatientInput):
    if model is None:
        raise HTTPException(status_code=503, detail="Model is not loaded yet")

    # The model was trained on age expressed in days, not years.
    age_days = round(payload.age_years * 365.25)

    row = pd.DataFrame(
        [[
            age_days,
            payload.gender,
            payload.height_cm,
            payload.weight_kg,
            payload.ap_hi,
            payload.ap_lo,
            payload.cholesterol,
            payload.gluc,
            payload.smoke,
            payload.alco,
            payload.active,
        ]],
        columns=FEATURE_ORDER,
    )

    try:
        proba = float(model.predict_proba(row)[0][1])
        pred = int(model.predict(row)[0])
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc

    if proba < 0.33:
        risk_band = "low"
    elif proba < 0.66:
        risk_band = "moderate"
    else:
        risk_band = "high"

    return PredictionOutput(
        prediction=pred,
        label="At risk" if pred == 1 else "Not at risk",
        probability=round(proba, 4),
        risk_band=risk_band,
    )
