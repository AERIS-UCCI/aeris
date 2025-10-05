from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
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
        {"lat": -12.055, "lng": -77.045, "intensity": 0.7},
        {"lat": -12.048, "lng": -77.038, "intensity": 0.5},
    ],
    "no2": [
        {"lat": -12.07, "lng": -77.06, "intensity": 0.9},
        {"lat": -12.05, "lng": -77.07, "intensity": 0.7},
        {"lat": -12.08, "lng": -77.04, "intensity": 0.5},
        {"lat": -12.065, "lng": -77.055, "intensity": 0.8},
        {"lat": -12.075, "lng": -77.065, "intensity": 0.6},
    ],
    "hcho": [
        {"lat": -12.045, "lng": -77.042, "intensity": 0.3},
        {"lat": -12.048, "lng": -77.046, "intensity": 0.6},
        {"lat": -12.052, "lng": -77.05, "intensity": 0.9},
        {"lat": -12.049, "lng": -77.044, "intensity": 0.4},
        {"lat": -12.051, "lng": -77.048, "intensity": 0.7},
    ]
}

@app.get("/heatmap/{contaminant}")
def get_heatmap(contaminant: str):
    """Devuelve datos del contaminante elegido"""
    if contaminant not in fake_data:
        return {"error": "Contaminante no disponible"}
    return {"points": fake_data[contaminant]}

@app.get("/route")
def get_route(
    origin: str = Query(...), 
    destination: str = Query(...), 
    mode: str = "driving",
    optimize: bool = False
):
    """
    Obtiene la ruta óptima usando Google Directions API.
    Si optimize=True, se puede agregar lógica de Dijkstra aquí.
    """
    # Mapeo de modos de transporte
    mode_map = {
        "walking": "walking",
        "bicycle": "bicycling",
        "car": "driving"
    }
    
    google_mode = mode_map.get(mode, "driving")
    
    url = (
        f"https://maps.googleapis.com/maps/api/directions/json"
        f"?origin={origin}&destination={destination}&mode={google_mode}&key={GOOGLE_API_KEY}"
    )
    
    # Agregar alternativas si se quiere optimizar
    if optimize:
        url += "&alternatives=true"
    
    res = requests.get(url)
    data = res.json()

    if "routes" in data and data["routes"]:
        # Si optimize=True, aquí podrías implementar Dijkstra
        # para elegir la mejor ruta considerando contaminantes
        
        best_route = data["routes"][0]  # Por ahora tomamos la primera
        
        if optimize and len(data["routes"]) > 1:
            # Aquí implementarías la lógica de Dijkstra
            # considerando los datos de contaminantes
            best_route = select_best_route(data["routes"])
        
        leg = best_route["legs"][0]
        return {
            "overview_polyline": best_route["overview_polyline"],
            "distance": leg["distance"]["text"],
            "duration": leg["duration"]["text"],
            "duration_value": leg["duration"]["value"],
            "routes": data["routes"]
        }

    return {"error": "No se encontró ruta"}

def select_best_route(routes):
    """
    Implementación simple de selección de ruta óptima.
    En una implementación real, usarías Dijkstra con los datos de contaminantes.
    """
    # Por ahora retorna la ruta más corta en tiempo
    return min(routes, key=lambda r: r["legs"][0]["duration"]["value"])

@app.get("/autocomplete")
def autocomplete(input: str = Query(...)):
    """Autocompletado de lugares usando Google Places API"""
    url = (
        f"https://maps.googleapis.com/maps/api/place/autocomplete/json"
        f"?input={input}&types=geocode&key={GOOGLE_API_KEY}"
    )
    res = requests.get(url)
    return res.json()

@app.get("/weather")
def get_weather(lat: float = Query(...), lng: float = Query(...)):
    """
    Devuelve el clima actual usando Open-Meteo API (gratuita).
    """
    try:
        # Usar Open-Meteo en lugar de Google (que no tiene weather API)
        url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={lat}&longitude={lng}"
            f"&current=temperature_2m,relative_humidity_2m,weather_code"
            f"&daily=temperature_2m_max,temperature_2m_min"
            f"&timezone=auto"
        )
        
        res = requests.get(url)
        data = res.json()
        
        if "current" not in data:
            return {"error": "No se pudo obtener el clima"}
        
        current = data["current"]
        daily = data.get("daily", {})
        
        # Mapeo de códigos de clima
        weather_codes = {
            0: "Despejado",
            1: "Mayormente despejado",
            2: "Parcialmente nublado",
            3: "Nublado",
            45: "Neblina",
            48: "Neblina con escarcha",
            51: "Llovizna ligera",
            53: "Llovizna moderada",
            55: "Llovizna densa",
            61: "Lluvia ligera",
            63: "Lluvia moderada",
            65: "Lluvia intensa",
            71: "Nevada ligera",
            73: "Nevada moderada",
            75: "Nevada intensa",
            80: "Chubascos ligeros",
            81: "Chubascos moderados",
            82: "Chubascos intensos",
            95: "Tormenta",
            96: "Tormenta con granizo ligero",
            99: "Tormenta con granizo intenso"
        }
        
        weather_code = current.get("weather_code", 0)
        condition = weather_codes.get(weather_code, "Desconocido")
        
        return {
            "temperature": round(current.get("temperature_2m", 0)),
            "humidity": current.get("relative_humidity_2m", 0),
            "condition": condition,
            "max_temp": round(daily.get("temperature_2m_max", [0])[0]) if daily else None,
            "min_temp": round(daily.get("temperature_2m_min", [0])[0]) if daily else None
        }
        
    except Exception as e:
        return {"error": f"Error obteniendo clima: {str(e)}"}

def get_air_quality_data(lat: float, lng: float):
    """
    Obtiene datos de calidad del aire usando Google Air Quality API
    """
    url = f"{AIR_QUALITY_API_URL}/currentConditions:lookup?key={GOOGLE_API_KEY}"
    
    payload = {
        "location": {
            "latitude": lat,
            "longitude": lng
        },
        "extraComputations": [
            "HEALTH_RECOMMENDATIONS",
            "DOMINANT_POLLUTANT_CONCENTRATION",
            "POLLUTANT_CONCENTRATION",
            "LOCAL_AQI",
            "POLLUTANT_ADDITIONAL_INFO"
        ],
        "languageCode": "es"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error obteniendo datos de Air Quality: {e}")
        return None

def get_heatmap_tiles(pollutant: str, zoom: int, x: int, y: int):
    """
    Obtiene tiles de heatmap para un contaminante específico
    """
    # Mapeo de nombres de contaminantes
    pollutant_map = {
        "ozone": "OZONE",
        "no2": "NITROGEN_DIOXIDE",
        "hcho": "FORMALDEHYDE",
        "pm25": "PM25",
        "pm10": "PM10",
        "so2": "SULFUR_DIOXIDE",
        "co": "CARBON_MONOXIDE"
    }
    
    google_pollutant = pollutant_map.get(pollutant.lower(), "OZONE")
    
    url = (
        f"{AIR_QUALITY_API_URL}/mapTypes/{google_pollutant}/heatmapTiles/"
        f"{zoom}/{x}/{y}?key={GOOGLE_API_KEY}"
    )
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.content
    except requests.exceptions.RequestException as e:
        print(f"Error obteniendo heatmap tile: {e}")
        return None

@app.get("/air-quality/current")
def get_current_air_quality(
    lat: float = Query(..., description="Latitud"),
    lng: float = Query(..., description="Longitud")
):
    """
    Obtiene la calidad del aire actual para una ubicación específica
    """
    data = get_air_quality_data(lat, lng)
    
    if not data:
        raise HTTPException(status_code=500, detail="Error obteniendo datos de calidad del aire")
    
    # Extraer información relevante
    result = {
        "indexes": data.get("indexes", []),
        "pollutants": data.get("pollutants", []),
        "healthRecommendations": data.get("healthRecommendations", {}),
        "dateTime": data.get("dateTime", "")
    }
    
    return result

@app.get("/air-quality/grid")
def get_air_quality_grid(
    lat: float = Query(..., description="Latitud central"),
    lng: float = Query(..., description="Longitud central"),
    radius: float = Query(0.05, description="Radio en grados")
):
    """
    Obtiene datos de calidad del aire en una cuadrícula alrededor de un punto central.
    Útil para crear heatmaps personalizados.
    """
    points = []
    
    # Crear una cuadrícula de 5x5 puntos
    for i in range(-2, 3):
        for j in range(-2, 3):
            point_lat = lat + (i * radius / 2)
            point_lng = lng + (j * radius / 2)
            
            data = get_air_quality_data(point_lat, point_lng)
            
            if data and "pollutants" in data:
                pollutants_dict = {}
                
                for pollutant in data["pollutants"]:
                    code = pollutant.get("code", "")
                    concentration = pollutant.get("concentration", {}).get("value", 0)
                    pollutants_dict[code.lower()] = concentration
                
                points.append({
                    "lat": point_lat,
                    "lng": point_lng,
                    "pollutants": pollutants_dict,
                    "aqi": data.get("indexes", [{}])[0].get("aqi", 0) if data.get("indexes") else 0
                })
    
    return {"points": points}

@app.get("/heatmap/{contaminant}")
def get_heatmap(
    contaminant: str,
    lat: float = Query(-12.0464, description="Latitud central"),
    lng: float = Query(-77.0428, description="Longitud central")
):
    """
    Devuelve datos del contaminante elegido usando Air Quality API
    """
    valid_contaminants = ["ozone", "no2", "hcho", "pm25", "pm10", "so2", "co"]
    
    if contaminant.lower() not in valid_contaminants:
        raise HTTPException(status_code=400, detail="Contaminante no válido")
    
    # Mapeo de códigos
    contaminant_codes = {
        "ozone": "o3",
        "no2": "no2",
        "hcho": "hcho",
        "pm25": "pm25",
        "pm10": "pm10",
        "so2": "so2",
        "co": "co"
    }
    
    code = contaminant_codes.get(contaminant.lower())
    
    # Obtener datos en cuadrícula
    grid_data = get_air_quality_grid(lat, lng, radius=0.08)
    
    # Filtrar y formatear puntos para el contaminante específico
    points = []
    for point in grid_data["points"]:
        pollutants = point.get("pollutants", {})
        
        if code in pollutants:
            concentration = pollutants[code]
            # Normalizar intensidad (0-1) basado en rangos típicos
            intensity = normalize_concentration(code, concentration)
            
            points.append({
                "lat": point["lat"],
                "lng": point["lng"],
                "intensity": intensity,
                "concentration": concentration
            })
    
    return {"points": points}

def normalize_concentration(pollutant: str, concentration: float) -> float:
    """
    Normaliza la concentración a un valor entre 0 y 1 para el heatmap
    """
    # Rangos típicos para normalización (valores en µg/m³)
    ranges = {
        "o3": (0, 200),      # Ozono
        "no2": (0, 200),     # Dióxido de nitrógeno
        "hcho": (0, 100),    # Formaldehído
        "pm25": (0, 100),    # PM2.5
        "pm10": (0, 200),    # PM10
        "so2": (0, 100),     # Dióxido de azufre
        "co": (0, 10000)     # Monóxido de carbono
    }
    
    min_val, max_val = ranges.get(pollutant, (0, 100))
    normalized = (concentration - min_val) / (max_val - min_val)
    return max(0, min(1, normalized))  # Clamp entre 0 y 1

@app.get("/health-recommendations")
def get_health_recommendations(
    lat: float = Query(..., description="Latitud"),
    lng: float = Query(..., description="Longitud")
):
    data = get_air_quality_data(lat, lng)
    
    if not data:
        raise HTTPException(status_code=500, detail="Error obteniendo datos")
    
    return {
        "healthRecommendations": data.get("healthRecommendations", {}),
        "dominantPollutant": data.get("dominantPollutant", ""),
        "indexes": data.get("indexes", [])
    }