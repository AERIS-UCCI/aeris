import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Cloud, Navigation, Car, Bike, Footprints, AlertCircle, CheckCircle, AlertTriangle, Wind, TrendingUp, TrendingDown, Layers } from 'lucide-react';

function decodePolyline(encoded) {
  const poly = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    poly.push([lat / 1e5, lng / 1e5]);
  }
  return poly;
}

export default function AerisRoutePlanner() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [transportMode, setTransportMode] = useState('walking');
  const [temperature, setTemperature] = useState(null);
  const [weatherCondition, setWeatherCondition] = useState('Cargando...');
  const [maxTemp, setMaxTemp] = useState(null);
  const [minTemp, setMinTemp] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [locationName, setLocationName] = useState('Lima, PE');
  const [userLocation, setUserLocation] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [arrivalTime, setArrivalTime] = useState(null);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heatmapData, setHeatmapData] = useState(null);

  const API_URL = 'http://localhost:8000';

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (origin && destination && routes.length > 0) {
      fetchRoute();
    }
  }, [transportMode]);

  const getWeatherData = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      const data = await res.json();

      if (data.current) {
        setTemperature(Math.round(data.current.temperature_2m));
        setHumidity(data.current.relative_humidity_2m);
        
        const weatherDescriptions = {
          0: 'Despejado', 1: 'Mayormente despejado', 2: 'Parcialmente nublado',
          3: 'Nublado', 45: 'Neblina', 61: 'Lluvia ligera', 63: 'Lluvia moderada'
        };
        
        setWeatherCondition(weatherDescriptions[data.current.weather_code] || 'Desconocido');
      }

      if (data.daily) {
        setMaxTemp(Math.round(data.daily.temperature_2m_max[0]));
        setMinTemp(Math.round(data.daily.temperature_2m_min[0]));
      }
    } catch (error) {
      console.error("Error obteniendo datos del clima:", error);
    }
  };

  const getCurrentLocation = () => {
    setIsGeolocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation([lat, lng]);
          
          await getWeatherData(lat, lng);
          
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await res.json();
            setOrigin(data.display_name || `${lat}, ${lng}`);
            
            const city = data.address?.city || data.address?.town || 'Tu ubicación';
            setLocationName(city);
          } catch (error) {
            setOrigin(`${lat}, ${lng}`);
          }
          setIsGeolocating(false);
        },
        () => {
          setIsGeolocating(false);
          setUserLocation([-12.0464, -77.0428]);
          getWeatherData(-12.0464, -77.0428);
        }
      );
    }
  };

  const fetchHeatmap = async () => {
    if (!userLocation) return;
    
    try {
      const res = await fetch(
        `${API_URL}/heatmap?lat=${userLocation[0]}&lng=${userLocation[1]}&radius=0.05`
      );
      const data = await res.json();
      setHeatmapData(data);
    } catch (error) {
      console.error('Error obteniendo mapa de calor:', error);
    }
  };

  const fetchRoute = async () => {
    if (!origin || !destination) {
      setError('Por favor ingresa origen y destino');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch(
        `${API_URL}/route?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${transportMode}&optimize=true`
      );
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setRoutes(data.alternative_routes || []);
      setSelectedRoute(0);
      setComparison(data.comparison);

      if (data.duration_value) {
        const arrival = new Date(Date.now() + data.duration_value * 1000);
        setArrivalTime(arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (error) {
      setError('Error conectando con el servidor. Verifica que el backend esté corriendo en http://localhost:8000');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOriginChange = async (value) => {
    setOrigin(value);
    if (value.length > 3) {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5`
      );
      const data = await res.json();
      setOriginSuggestions(data);
    } else {
      setOriginSuggestions([]);
    }
  };

  const handleDestinationChange = async (value) => {
    setDestination(value);
    if (value.length > 3) {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5`
      );
      const data = await res.json();
      setDestinationSuggestions(data);
    } else {
      setDestinationSuggestions([]);
    }
  };

  const getTransportIcon = (mode) => {
    switch(mode) {
      case 'car': return <Car className="w-5 h-5" />;
      case 'bicycle': return <Bike className="w-5 h-5" />;
      default: return <Footprints className="w-5 h-5" />;
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch(riskLevel) {
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRouteColor = (riskColor) => {
    switch(riskColor) {
      case 'green': return '#10b981';
      case 'orange': return '#f59e0b';
      case 'red': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getHeatmapColor = (intensity) => {
    if (intensity <= 50) return '#10b981';
    if (intensity <= 100) return '#f59e0b';
    return '#ef4444';
  };

  const MapView = () => {
    const mapContainerRef = useRef(null);
    const leafletMapRef = useRef(null);
    const markersRef = useRef([]);
    const polylinesRef = useRef([]);
    const leafletLoadedRef = useRef(false);

    useEffect(() => {
      if (leafletLoadedRef.current) return;

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        document.head.appendChild(link);
      }

      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => {
          leafletLoadedRef.current = true;
          initializeMap();
        };
        document.head.appendChild(script);
      } else {
        leafletLoadedRef.current = true;
        initializeMap();
      }
    }, []);

    const initializeMap = () => {
      if (!mapContainerRef.current || leafletMapRef.current) return;

      const L = window.L;
      const center = userLocation || [-12.0464, -77.0428];
      
      leafletMapRef.current = L.map(mapContainerRef.current, {
        center: center,
        zoom: 13
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(leafletMapRef.current);

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    };

    useEffect(() => {
      if (!leafletMapRef.current || !window.L || !userLocation) return;

      const L = window.L;
      const map = leafletMapRef.current;

      // Limpiar solo los marcadores que no son del heatmap
      const regularMarkers = markersRef.current.filter(m => !m.options || !m.options.isHeatmap);
      regularMarkers.forEach(m => map.removeLayer(m));
      markersRef.current = markersRef.current.filter(m => m.options && m.options.isHeatmap);

      // Marcador de ubicación actual (azul)
      const userMarker = L.marker(userLocation, {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }).addTo(map);
      userMarker.bindPopup('<strong>Tu ubicación actual</strong>');
      markersRef.current.push(userMarker);
      
      map.setView(userLocation, 13);
    }, [userLocation]);

    useEffect(() => {
      if (!leafletMapRef.current || !window.L) return;

      const L = window.L;
      const map = leafletMapRef.current;

      // Limpiar círculos del heatmap anteriores
      const heatmapMarkers = markersRef.current.filter(m => m.options && m.options.isHeatmap);
      heatmapMarkers.forEach(m => map.removeLayer(m));
      markersRef.current = markersRef.current.filter(m => !m.options || !m.options.isHeatmap);

      if (showHeatmap && heatmapData) {
        heatmapData.points.forEach(point => {
          const circle = L.circle([point.lat, point.lng], {
            color: getHeatmapColor(point.intensity),
            fillColor: getHeatmapColor(point.intensity),
            fillOpacity: 0.6,
            opacity: 0.8,
            radius: 800,
            weight: 2,
            isHeatmap: true
          }).addTo(map);

          const riskText = point.risk_level === 'low' ? 'Baja exposición' : 
                          point.risk_level === 'medium' ? 'Exposición moderada' : 'Alta exposición';

          circle.bindPopup(`
            <div style="font-family: sans-serif; padding: 4px;">
              <strong style="font-size: 14px;">AQI: ${point.intensity.toFixed(1)}</strong><br/>
              <span style="color: ${getHeatmapColor(point.intensity)}; font-weight: 600;">
                ${riskText}
              </span><br/>
              <span style="font-size: 11px; color: #666;">
                ${point.risk_level === 'low' ? '✓ Seguro para todos' : 
                  point.risk_level === 'medium' ? '⚠️ Precaución para sensibles' : '⛔ Evitar esta zona'}
              </span>
            </div>
          `);

          markersRef.current.push(circle);
        });

        console.log(`Mapa de calor: ${heatmapData.points.length} puntos agregados`);
      }
    }, [showHeatmap, heatmapData]);

    useEffect(() => {
      if (!leafletMapRef.current || !window.L || routes.length === 0) return;

      const L = window.L;
      const map = leafletMapRef.current;

      // Limpiar polylines y segmentos anteriores
      polylinesRef.current.forEach(p => map.removeLayer(p));
      polylinesRef.current = [];

      // Limpiar marcadores de origen/destino anteriores
      const routeMarkers = markersRef.current.filter(m => m.options && (m.options.isOrigin || m.options.isDestination || m.options.isSegment));
      routeMarkers.forEach(m => map.removeLayer(m));
      markersRef.current = markersRef.current.filter(m => !m.options || (!m.options.isOrigin && !m.options.isDestination && !m.options.isSegment));

      routes.forEach((route, idx) => {
        const decodedPath = decodePolyline(route.overview_polyline.points);
        
        if (decodedPath.length === 0) return;

        const color = getRouteColor(route.exposure?.risk_color);
        const weight = selectedRoute === idx ? 6 : 4;
        const opacity = selectedRoute === idx ? 0.9 : 0.5;

        // Dibujar la ruta base
        const polyline = L.polyline(decodedPath, {
          color: color,
          weight: weight,
          opacity: opacity
        }).addTo(map);

        const popupContent = `
          <div style="font-family: sans-serif; min-width: 200px;">
            <strong style="color: ${color}; font-size: 14px;">
              Ruta ${idx + 1} ${idx === 0 ? '⭐ (Mejor)' : ''}
            </strong>
            <div style="margin-top: 8px; font-size: 12px;">
              <div><strong>Duración:</strong> ${route.duration}</div>
              <div><strong>Distancia:</strong> ${route.distance}</div>
              <div><strong>Exposición:</strong> <span style="color: ${color};">${route.exposure?.risk_label}</span></div>
              <div><strong>AQI Promedio:</strong> ${route.exposure?.avg_aqi}</div>
            </div>
          </div>
        `;
        
        polyline.bindPopup(popupContent);
        polylinesRef.current.push(polyline);

        // ESPECTRO: Dibujar segmentos de contaminación sobre la ruta seleccionada
        if (idx === selectedRoute && route.exposure?.segments && route.exposure.segments.length > 0) {
          route.exposure.segments.forEach((segment, segIdx) => {
            const segColor = getRouteColor(segment.risk_color);
            
            // Círculo pequeño en cada punto de muestreo
            const circle = L.circleMarker([segment.lat, segment.lng], {
              radius: 6,
              fillColor: segColor,
              color: '#fff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8,
              isSegment: true
            }).addTo(map);

            circle.bindPopup(`
              <div style="font-family: sans-serif; padding: 2px;">
                <strong>Segmento ${segIdx + 1}</strong><br/>
                <span style="color: ${segColor}; font-weight: 600;">AQI: ${segment.aqi}</span><br/>
                <span style="font-size: 11px;">${segment.risk_level === 'low' ? '✓ Zona segura' : 
                  segment.risk_level === 'medium' ? '⚠️ Zona moderada' : '⛔ Zona de riesgo'}</span>
              </div>
            `);

            markersRef.current.push(circle);
          });

          console.log(`Espectro: ${route.exposure.segments.length} segmentos visualizados para ruta ${idx + 1}`);
        }

        // Solo agregar marcadores de origen y destino para la ruta seleccionada
        if (idx === selectedRoute && decodedPath.length > 0) {
          const originPoint = decodedPath[0];
          const destinationPoint = decodedPath[decodedPath.length - 1];

          // Marcador de ORIGEN (verde)
          const originMarker = L.marker(originPoint, {
            icon: L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
              shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            }),
            isOrigin: true
          }).addTo(map);
          originMarker.bindPopup('<strong>📍 Origen</strong>');
          markersRef.current.push(originMarker);

          // Marcador de DESTINO (rojo)
          const destinationMarker = L.marker(destinationPoint, {
            icon: L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            }),
            isDestination: true
          }).addTo(map);
          destinationMarker.bindPopup('<strong>🎯 Destino</strong>');
          markersRef.current.push(destinationMarker);

          // Ajustar vista para mostrar toda la ruta
          setTimeout(() => {
            map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
          }, 100);
        }
      });
    }, [routes, selectedRoute]);

    return <div ref={mapContainerRef} className="h-full w-full" />;
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wind className="w-8 h-8 text-teal-400" />
            <h1 className="text-2xl font-bold text-white">Aeris Route Planner</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="w-4 h-4" />
            {locationName}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 bg-slate-800/90 border-r border-slate-700/50 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">Planificador</h2>

            <button
              onClick={getCurrentLocation}
              disabled={isGeolocating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            >
              <Navigation className="w-4 h-4" />
              {isGeolocating ? 'Localizando...' : 'Mi ubicación'}
            </button>

            {error && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Origen</label>
              <div className="relative">
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => handleOriginChange(e.target.value)}
                  placeholder="Punto de partida"
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-teal-500"
                />
                {originSuggestions.length > 0 && (
                  <ul className="absolute z-50 bg-slate-800 border border-slate-700 rounded-lg mt-1 w-full max-h-40 overflow-y-auto">
                    {originSuggestions.map((sug, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setOrigin(sug.display_name);
                          setOriginSuggestions([]);
                        }}
                        className="px-3 py-2 text-sm text-gray-200 hover:bg-slate-700 cursor-pointer"
                      >
                        {sug.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Destino</label>
              <div className="relative">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  placeholder="¿A dónde vas?"
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-teal-500"
                />
                {destinationSuggestions.length > 0 && (
                  <ul className="absolute z-50 bg-slate-800 border border-slate-700 rounded-lg mt-1 w-full max-h-40 overflow-y-auto">
                    {destinationSuggestions.map((sug, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setDestination(sug.display_name);
                          setDestinationSuggestions([]);
                        }}
                        className="px-3 py-2 text-sm text-gray-200 hover:bg-slate-700 cursor-pointer"
                      >
                        {sug.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <label className="text-white font-semibold text-sm mb-2 block">Transporte</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTransportMode('car')}
                  className={`flex flex-col items-center justify-center py-3 rounded-lg text-xs transition-all ${
                    transportMode === 'car' ? 'bg-blue-600 text-white' : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <Car className="w-5 h-5 mb-1" />
                  Auto
                </button>
                <button
                  onClick={() => setTransportMode('bicycle')}
                  className={`flex flex-col items-center justify-center py-3 rounded-lg text-xs transition-all ${
                    transportMode === 'bicycle' ? 'bg-blue-600 text-white' : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <Bike className="w-5 h-5 mb-1" />
                  Bici
                </button>
                <button
                  onClick={() => setTransportMode('walking')}
                  className={`flex flex-col items-center justify-center py-3 rounded-lg text-xs transition-all ${
                    transportMode === 'walking' ? 'bg-blue-600 text-white' : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <Footprints className="w-5 h-5 mb-1" />
                  Caminar
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Cloud className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">{locationName}</span>
                  </div>
                  <p className="text-blue-100 text-xs">{weatherCondition}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-light text-white">
                    {temperature !== null ? `${temperature}°` : '--'}
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-blue-100 pt-3 border-t border-blue-400/30 mt-3">
                <div>Máx {maxTemp !== null ? `${maxTemp}°` : '--'}</div>
                <div>Mín {minTemp !== null ? `${minTemp}°` : '--'}</div>
                <div>Humedad {humidity !== null ? `${humidity}%` : '--'}</div>
              </div>
            </div>

            <button
              onClick={async () => {
                setShowHeatmap(!showHeatmap);
                if (!showHeatmap && !heatmapData) {
                  await fetchHeatmap();
                }
              }}
              className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                showHeatmap 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              {showHeatmap ? 'Ocultar Mapa de Calor' : 'Mostrar Mapa de Calor'}
            </button>

            {routes.length > 0 && (
              <div>
                <label className="text-white font-semibold text-sm mb-2 block">
                  Rutas encontradas ({routes.length})
                </label>
                <div className="space-y-2">
                  {routes.map((route, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedRoute(idx);
                        if (route.duration_value) {
                          const arrival = new Date(Date.now() + route.duration_value * 1000);
                          setArrivalTime(arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                        }
                      }}
                      className={`w-full p-3 rounded-lg border-2 transition-all ${
                        selectedRoute === idx 
                          ? 'border-cyan-400 bg-slate-700/50' 
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getRouteColor(route.exposure?.risk_color) }}
                          ></div>
                          <span className="text-white text-sm font-medium">
                            Ruta {idx + 1} {idx === 0 && '⭐'}
                          </span>
                        </div>
                        {getRiskIcon(route.exposure?.risk_level)}
                      </div>
                      
                      <div className="text-left space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Duración:</span>
                          <span className="text-white font-medium">{route.duration}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Distancia:</span>
                          <span className="text-white font-medium">{route.distance}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Exposición:</span>
                          <span 
                            className="font-semibold"
                            style={{ color: getRouteColor(route.exposure?.risk_color) }}
                          >
                            {route.exposure?.risk_label}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">AQI:</span>
                          <span className="text-white font-medium">{route.exposure?.avg_aqi}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {comparison && routes.length > 0 && (
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-3">
                <h3 className="text-white font-semibold text-sm mb-2">Comparativa</h3>
                <div className="space-y-2 text-xs text-gray-300">
                  <div className="flex items-center justify-between">
                    <span>Diferencia AQI:</span>
                    <span className="font-semibold text-white">{comparison.aqi_difference}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {comparison.aqi_difference > 20 ? (
                      <>
                        <TrendingUp className="w-4 h-4 text-red-400" />
                        <span>La ruta 3 tiene {comparison.aqi_difference} puntos más de AQI</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-4 h-4 text-green-400" />
                        <span>Todas las rutas tienen exposición similar</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {routes.length > 0 && routes[selectedRoute]?.exposure?.health_recommendations && (
              <div className="bg-teal-900/30 border border-teal-700/50 rounded-lg p-3">
                <h3 className="text-teal-300 font-semibold text-sm mb-2">
                  Recomendaciones - {routes[selectedRoute].exposure.health_recommendations.level}
                </h3>
                <ul className="space-y-1">
                  {routes[selectedRoute].exposure.health_recommendations.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-teal-200 text-xs leading-relaxed">• {rec}</li>
                  ))}
                </ul>
                {routes[selectedRoute].exposure.health_recommendations.risk_groups.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-teal-700/30">
                    <p className="text-teal-300 text-xs font-semibold mb-1">Grupos de riesgo:</p>
                    <p className="text-teal-200 text-xs">
                      {routes[selectedRoute].exposure.health_recommendations.risk_groups.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-700/50">
            <button 
              onClick={fetchRoute}
              disabled={isLoading || !origin || !destination}
              className="w-full bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-900 font-semibold py-2.5 rounded-lg hover:from-cyan-500 hover:to-teal-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Search className="w-5 h-5" />
              {isLoading ? 'Buscando...' : 'Buscar Rutas'}
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          {routes.length > 0 && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl px-4 py-3 z-[1000] min-w-[280px]">
              <div className="flex items-center gap-3">
                <div 
                  className="flex items-center justify-center w-10 h-10 rounded-full"
                  style={{ 
                    backgroundColor: `${getRouteColor(routes[selectedRoute]?.exposure?.risk_color)}20`,
                    color: getRouteColor(routes[selectedRoute]?.exposure?.risk_color)
                  }}
                >
                  {getTransportIcon(transportMode)}
                </div>
                <div className="flex-1">
                  <div className="text-xl font-bold text-gray-900">{routes[selectedRoute]?.duration}</div>
                  <div className="text-xs text-gray-600">{routes[selectedRoute]?.distance}</div>
                </div>
                {arrivalTime && (
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Llegada</div>
                    <div className="text-sm font-semibold text-blue-600">{arrivalTime}</div>
                  </div>
                )}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">
                    Ruta {selectedRoute + 1} · {routes[selectedRoute]?.exposure?.risk_label}
                  </p>
                  <span 
                    className="text-xs font-semibold px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: `${getRouteColor(routes[selectedRoute]?.exposure?.risk_color)}20`,
                      color: getRouteColor(routes[selectedRoute]?.exposure?.risk_color)
                    }}
                  >
                    AQI: {routes[selectedRoute]?.exposure?.avg_aqi}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm rounded-lg shadow-xl p-3 z-[1000] border border-slate-700/30">
            <h3 className="text-white font-semibold mb-2 text-xs">Leyenda</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-1 bg-green-500 rounded"></div>
                <span className="text-gray-300 text-xs">Baja (0-50)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-1 bg-orange-500 rounded"></div>
                <span className="text-gray-300 text-xs">Moderada (51-100)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-1 bg-red-500 rounded"></div>
                <span className="text-gray-300 text-xs">Alta (101+)</span>
              </div>
            </div>
          </div>

          <MapView />
        </div>
      </div>
    </div>
  );
}