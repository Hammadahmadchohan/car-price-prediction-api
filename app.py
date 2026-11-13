
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib

from features import convert_features

app = FastAPI(title="Car Price Prediction API")

# Allow React frontend to access FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

model = joblib.load("car_price_model.pkl")


class CarInput(BaseModel):
    name: str
    year: int
    km_driven: int
    fuel: str
    seller_type: str
    transmission: str
    owner: str
    mileage: str
    engine: str
    max_power: str
    torque: str
    seats: float


@app.get("/")
def home():
    return {"message": "Car Price Prediction API is running"}


@app.post("/predict")
def predict(car: CarInput):
    data = pd.DataFrame([car.model_dump()])
    data = convert_features(data)

    prediction = model.predict(data)[0]

    
    # INR to PKR conversion
    INR_TO_PKR = 2.94  # Approximate rate, 13 Nov 2026

    price_inr = float(prediction)
    price_pkr = round(price_inr * INR_TO_PKR, 2)

    return {
        "predicted_price": price_pkr,
        "currency": "PKR"
    }

