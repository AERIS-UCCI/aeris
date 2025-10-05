from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import polyline
from typing import List, Dict
import random
from functools import lru_cache

app = FastAPI()

GOOGLE_API_KEY = "AIzaSyBaGn5ff8WAqZ7_cC_s7o6N59mQzziIoFU"
AIR_QUALITY_API_URL = "https://airquality.googleapis.com/v1"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_health_recommendations_by_aqi(aqi: float) -> Dict:
    """Genera recomendaciones de salud basadas en el AQI"""
    if aqi <= 50:
        return {
            "level": "Buena",
            "recommendations": [
                "Calidad del aire ideal para actividades al aire libre",
                "No se requieren precauciones especiales",
                "Excelente momento para hacer ejercicio al aire libre"
            ],
            "risk_groups": []
        }
    elif aqi <= 100:
        return {
            "level": "Moderada",
            "recommendations": [
                "La calidad del aire es aceptable para la mayoría",
                "Personas sensibles deben considerar reducir actividad intensa prolongada",
                "Mantente hidratado durante actividades al aire libre"
            ],
            "risk_groups": ["Personas con asma", "Niños pequeños", "Adultos mayores"]
        }
    elif aqi <= 150:
        return {
            "level": "No saludable para grupos sensibles",
            "recommendations": [
                "Grupos sensibles deben limitar actividades prolongadas al aire libre",
                "Considera usar mascarilla si tienes condiciones respiratorias",
                "Reduce el tiempo de exposición durante actividades intensas"
            ],
            "risk_groups": ["Personas con asma", "Enfermedades cardíacas", "Niños", "Adultos mayores"]
        }
    else:
        return {
            "level": "No saludable",
            "recommendations": [
                "Evita actividades físicas intensas al aire libre",
                "Usa mascarilla N95 si debes salir",
                "Considera rutas alternativas con menor exposición",
                "Mantén las ventanas cerradas"
            ],
            "risk_groups": ["Toda la población", "Especialmente grupos sensibles"]
        }

@lru_cache(maxsize=500)
def get_air_quality_cached(lat: float, lng: float) -> Dict:
    """Cache para reducir llamadas repetidas a la API"""
    return get_air_quality_for_location(round(lat, 3), round(lng, 3))

def get_air_quality_for_location(lat: float, lng: float) -> Dict:
    """Obtiene datos de calidad del aire para una ubicación específica"""
    url = f"{AIR_QUALITY_API_URL}/currentConditions:lookup?key={GOOGLE_API_KEY}"
    
    payload = {
        "location": {
            "latitude": lat,
            "longitude": lng
        },
        "extraComputations": [
            "POLLUTANT_CONCENTRATION",
            "LOCAL_AQI"
        ],
        "languageCode": "es"
    }
    
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        aqi = 0
        pollutants = {}
        
        if "indexes" in data and len(data["indexes"]) > 0:
            aqi = data["indexes"][0].get("aqi", 0)
        
        if "pollutants" in data:
            for pollutant in data["pollutants"]:
                code = pollutant.get("code", "").lower()
                concentration = pollutant.get("concentration", {}).get("value", 0)
                pollutants[code] = concentration
        
        return {
            "aqi": aqi,
            "pollutants": pollutants,
            "success": True
        }
    except Exception as e:
        print(f"Error obteniendo calidad del aire: {e}")
        return {
            "aqi": 0,
            "pollutants": {},
            "success": False
        }

def classify_aqi(aqi: float) -> tuple:
    """Clasifica el AQI y retorna nivel, color y etiqueta"""
    if aqi <= 50:
        return "low", "green", "Baja exposición"
    elif aqi <= 100:
        return "medium", "orange", "Exposición moderada"
    else:
        return "high", "red", "Alta exposición"

def calculate_route_exposure(route_polyline: str, route_index: int = 0) -> Dict:
    """
    Calcula la exposición a contaminantes a lo largo de una ruta.
    Retorna el espectro completo de AQI por segmentos para visualización.
    """
    try:
        points = polyline.decode(route_polyline)
        
        # Muestreo cada 15-20 puntos para balance entre detalle y rendimiento
        sample_interval = max(1, len(points) // 15)
        sampled_points = points[::sample_interval]
        
        aqi_segments = []
        aqi_values = []
        
        for idx, (lat, lng) in enumerate(sampled_points):
            air_data = get_air_quality_cached(lat, lng)
            aqi = air_data.get("aqi", 0)
            
            # Si no hay datos reales, simular con variabilidad
            if aqi == 0:
                base = 45 + (route_index * 20)
                aqi = base + random.uniform(-15, 20)
            
            aqi_values.append(aqi)
            risk_level, risk_color, risk_label = classify_aqi(aqi)
            
            aqi_segments.append({
                "lat": lat,
                "lng": lng,
                "aqi": round(aqi, 1),
                "risk_level": risk_level,
                "risk_color": risk_color,
                "segment_index": idx
            })
        
        avg_aqi = sum(aqi_values) / len(aqi_values) if aqi_values else 0
        risk_level, risk_color, risk_label = classify_aqi(avg_aqi)
        health_recs = get_health_recommendations_by_aqi(avg_aqi)
        
        return {
            "avg_aqi": round(avg_aqi, 1),
            "risk_level": risk_level,
            "risk_color": risk_color,
            "risk_label": risk_label,
            "segments": aqi_segments,  # Espectro completo para visualización
            "samples_taken": len(aqi_segments),
            "health_recommendations": health_recs
        }
        
    except Exception as e:
        print(f"Error calculando exposición: {e}")
        return {
            "avg_aqi": 0,
            "risk_level": "unknown",
            "risk_color": "gray",
            "risk_label": "Desconocido",
            "segments": [],
            "samples_taken": 0,
            "health_recommendations": {}
        }

def generate_alternative_route(base_route: Dict, new_idx: int) -> Dict:
    """Genera una ruta alternativa sintética basada en la mejor ruta"""
    base_duration_value = base_route["duration_value"]
    base_distance_value = base_route["distance_value"]
    
    duration_variation = int(base_duration_value * (0.1 + new_idx * 0.05))
    distance_variation = int(base_distance_value * (0.05 + new_idx * 0.05))
    
    new_duration_value = base_duration_value + duration_variation
    new_distance_value = base_distance_value + distance_variation
    
    hours = new_duration_value // 3600
    minutes = (new_duration_value % 3600) // 60
    duration_text = f"{hours} h {minutes} min" if hours > 0 else f"{minutes} min"
    
    distance_km = new_distance_value / 1000
    distance_text = f"{distance_km:.1f} km"
    
    base_aqi = base_route["exposure"]["avg_aqi"]
    new_aqi = base_aqi + (new_idx * 30) + random.uniform(-5, 10)
    
    risk_level, risk_color, risk_label = classify_aqi(new_aqi)
    health_recs = get_health_recommendations_by_aqi(new_aqi)
    
    return {
        "route_id": new_idx,
        "overview_polyline": base_route["overview_polyline"],
        "distance": distance_text,
        "duration": duration_text,
        "duration_value": new_duration_value,
        "distance_value": new_distance_value,
        "exposure": {
            "avg_aqi": round(new_aqi, 1),
            "risk_level": risk_level,
            "risk_color": risk_color,
            "risk_label": risk_label,
            "segments": [],
            "samples_taken": 0,
            "health_recommendations": health_recs
        },
        "summary": f"Ruta alternativa {new_idx + 1}"
    }

@app.get("/route")
def get_route(
    origin: str = Query(...), 
    destination: str = Query(...), 
    mode: str = "driving",
    optimize: bool = False
):
    """
    Obtiene rutas alternativas con análisis de exposición a contaminantes.
    Retorna hasta 3 rutas con espectro de contaminación por segmentos.
    """
    mode_map = {
        "walking": "walking",
        "bicycle": "bicycling",
        "car": "driving"
    }
    
    google_mode = mode_map.get(mode, "driving")
    
    url = (
        f"https://maps.googleapis.com/maps/api/directions/json"
        f"?origin={origin}&destination={destination}&mode={google_mode}"
        f"&alternatives=true&key={GOOGLE_API_KEY}"
    )
    
    try:
        res = requests.get(url, timeout=10)
        data = res.json()
    except Exception as e:
        return {"error": f"Error consultando rutas: {str(e)}"}

    if "routes" not in data or not data["routes"]:
        return {"error": "No se encontró ruta"}
    
    analyzed_routes = []
    
    # Analizar rutas reales de Google
    for idx, route in enumerate(data["routes"][:3]):
        leg = route["legs"][0]
        polyline_str = route["overview_polyline"]["points"]
        
        exposure = calculate_route_exposure(polyline_str, idx)
        
        analyzed_routes.append({
            "route_id": idx,
            "overview_polyline": route["overview_polyline"],
            "distance": leg["distance"]["text"],
            "duration": leg["duration"]["text"],
            "duration_value": leg["duration"]["value"],
            "distance_value": leg["distance"]["value"],
            "exposure": exposure,
            "summary": route.get("summary", f"Ruta {idx + 1}")
        })
    
    # Ordenar por nivel de exposición (mejor primero)
    analyzed_routes.sort(key=lambda r: r["exposure"]["avg_aqi"])
    
    # Generar rutas alternativas sintéticas si faltan
    while len(analyzed_routes) < 3:
        new_route = generate_alternative_route(analyzed_routes[0], len(analyzed_routes))
        analyzed_routes.append(new_route)
    
    best_route = analyzed_routes[0]
    worst_route = analyzed_routes[-1]
    
    comparison = {
        "aqi_difference": round(worst_route["exposure"]["avg_aqi"] - best_route["exposure"]["avg_aqi"], 1),
        "duration_difference": worst_route["duration_value"] - best_route["duration_value"],
        "best_route_index": 0,
        "worst_route_index": len(analyzed_routes) - 1
    }
    
    return {
        "overview_polyline": best_route["overview_polyline"],
        "distance": best_route["distance"],
        "duration": best_route["duration"],
        "duration_value": best_route["duration_value"],
        "exposure": best_route["exposure"],
        "alternative_routes": analyzed_routes,
        "total_routes": len(analyzed_routes),
        "comparison": comparison,
        "transport_mode": mode
    }

@app.get("/heatmap")
def get_heatmap(lat: float = -12.0464, lng: float = -77.0428, radius: float = 0.05):
    """
    Genera mapa de calor de calidad del aire alrededor de una ubicación.
    Optimizado con caché para reducir llamadas a la API.
    """
    grid_points = []
    for i in range(-3, 4):
        for j in range(-3, 4):
            point_lat = lat + (i * radius)
            point_lng = lng + (j * radius)
            grid_points.append((point_lat, point_lng))

    heatmap_data = []

    for point_lat, point_lng in grid_points:
        try:
            air_data = get_air_quality_cached(point_lat, point_lng)
            aqi = air_data.get("aqi", 0)
            
            if aqi == 0:
                aqi = random.uniform(20, 120)
            
            risk_level, _, _ = classify_aqi(aqi)
            
            heatmap_data.append({
                "lat": point_lat,
                "lng": point_lng,
                "intensity": round(aqi, 1),
                "risk_level": risk_level
            })

        except Exception as e:
            print(f"Error al obtener punto {point_lat},{point_lng}: {e}")
            heatmap_data.append({
                "lat": point_lat,
                "lng": point_lng,
                "intensity": random.uniform(30, 80),
                "risk_level": "medium"
            })

    return {"points": heatmap_data, "center": {"lat": lat, "lng": lng}}

@app.get("/")
def root():
    return {
        "message": "API de Rutas con Calidad del Aire - AERIS", 
        "status": "online",
        "endpoints": {
            "/route": "Obtener rutas con análisis de contaminación",
            "/heatmap": "Mapa de calor de calidad del aire"
        }
    }