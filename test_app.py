
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_home():
    response = client.get("/")
    assert response.status_code == 200

def test_predict():
    car = {
        "name": "Maruti Swift Dzire VDI",
        "year": 2014,
        "km_driven": 145500,
        "fuel": "Diesel",
        "seller_type": "Individual",
        "transmission": "Manual",
        "owner": "First Owner",
        "mileage": "23.4 kmpl",
        "engine": "1248 CC",
        "max_power": "74 bhp",
        "torque": "190Nm@ 2000rpm",
        "seats": 5
    }

    response = client.post("/predict", json=car)

    assert response.status_code == 200
    assert "predicted_price" in response.json()
    assert response.json()["currency"] == "INR"
