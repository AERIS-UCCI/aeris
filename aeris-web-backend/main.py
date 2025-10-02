from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import requests
import os
from fastapi import Query

app = FastAPI()

GOOGLE_API_KEY = "AIzaSyBaGn5ff8WAqZ7_cC_s7o6N59mQzziIoFU"

# Permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ en producción usar solo tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Datos de simulación (en un caso real vendrían de sensores o DB)
fake_data = {
    "ozone": [
        {"lat": -12.05, "lng": -77.04, "intensity": 0.6},
        {"lat": -12.06, "lng": -77.05, "intensity": 0.8},
        {"lat": -12.04, "lng": -77.03, "intensity": 0.4},
    ],
    "no2": [
        {"lat": -12.07, "lng": -77.06, "intensity": 0.9},
        {"lat": -12.05, "lng": -77.07, "intensity": 0.7},
        {"lat": -12.08, "lng": -77.04, "intensity": 0.5},
    ],
    "hcho": [
        {"lat": -12.045, "lng": -77.042, "intensity": 0.3},
        {"lat": -12.048, "lng": -77.046, "intensity": 0.6},
        {"lat": -12.052, "lng": -77.05, "intensity": 0.9},
    ]
}

@app.get("/heatmap/{contaminant}")
def get_heatmap(contaminant: str):
    """ Devuelve datos del contaminante elegido """
    if contaminant not in fake_data:
        return {"error": "Contaminante no disponible"}
    return {"points": fake_data[contaminant]}

@app.get("/route")
def get_route(origin: str = Query(...), destination: str = Query(...), mode: str = "driving"):
    url = (
        f"https://maps.googleapis.com/maps/api/directions/json"
        f"?origin={origin}&destination={destination}&mode={mode}&key={GOOGLE_API_KEY}"
    )
    res = requests.get(url)
    return res.json()

@app.get("/autocomplete")
def autocomplete(input: str = Query(...)):
    url = f"https://maps.googleapis.com/maps/api/place/autocomplete/json?input={input}&types=geocode&key={GOOGLE_API_KEY}"
    res = requests.get(url)
    return res.json()