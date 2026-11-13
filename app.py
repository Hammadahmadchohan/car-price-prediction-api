
from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib

from features import convert_features

app = FastAPI(title="Car Price Prediction API")

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

    return {
        "predicted_price": round(float(prediction), 2),
        "currency": "INR"
    }
