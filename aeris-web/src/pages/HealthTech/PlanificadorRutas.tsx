import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Bookmark, Cloud, Navigation, Car, Bike, Footprints } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import polyline from "polyline";
import SecondHeader from "../../components/Header/SecondHeader";


import "leaflet/dist/leaflet.css";

// Mock components - replace with your actual imports
const HeatmapLayer = ({ points, options }: any) => null;
const MapControls = () => null;

// Componente para centrar el mapa en la ubicación del usuario
function LocationMarker({ position }: any) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.flyTo(position, 13);
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Tu ubicación actual</Popup>
    </Marker>
  );
}

export default function AerisRoutePlanner() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [transportMode, setTransportMode] = useState('walking');
  const [data, setData] = useState({ ozone: [], no2: [], hcho: [] });
  const [temperature, setTemperature] = useState<number | null>(null);
  const [weatherCondition, setWeatherCondition] = useState('Cargando...');
  const [maxTemp, setMaxTemp] = useState<number | null>(null);
  const [minTemp, setMinTemp] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [locationName, setLocationName] = useState('Lima, PE');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const [route, setRoute] = useState<any>(null);
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([]);
  const mapRef = useRef<any>(null);

  const [arrivalTime, setArrivalTime] = useState<string | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(false);

  // Geolocalización al cargar
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Función para obtener el clima basado en ubicación
  const getWeatherData = async (lat: number, lng: number) => {
    try {
      // Usando Open-Meteo API (gratuita y sin necesidad de API key)
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      const data = await res.json();

      if (data.current) {
        setTemperature(Math.round(data.current.temperature_2m));
        setHumidity(data.current.relative_humidity_2m);
        
        // Mapeo de códigos de clima a descripciones
        const weatherCode = data.current.weather_code;
        const weatherDescriptions: { [key: number]: string } = {
          0: 'Despejado',
          1: 'Mayormente despejado',
          2: 'Parcialmente nublado',
          3: 'Nublado',
          45: 'Neblina',
          48: 'Neblina con escarcha',
          51: 'Llovizna ligera',
          53: 'Llovizna moderada',
          55: 'Llovizna densa',
          61: 'Lluvia ligera',
          63: 'Lluvia moderada',
          65: 'Lluvia intensa',
          71: 'Nevada ligera',
          73: 'Nevada moderada',
          75: 'Nevada intensa',
          80: 'Chubascos ligeros',
          81: 'Chubascos moderados',
          82: 'Chubascos intensos',
          95: 'Tormenta',
          96: 'Tormenta con granizo ligero',
          99: 'Tormenta con granizo intenso'
        };
        
        setWeatherCondition(weatherDescriptions[weatherCode] || 'Desconocido');
      }

      if (data.daily) {
        setMaxTemp(Math.round(data.daily.temperature_2m_max[0]));
        setMinTemp(Math.round(data.daily.temperature_2m_min[0]));
      }
    } catch (error) {
      console.error("Error obteniendo datos del clima:", error);
      setWeatherCondition('No disponible');
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
          
          // Obtener datos del clima para la ubicación actual
          await getWeatherData(lat, lng);
          
          // Reverse geocoding para obtener la dirección
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await res.json();
            setOrigin(data.display_name || `${lat}, ${lng}`);
            
            // Extraer nombre de la ciudad para el widget del clima
            const city = data.address?.city || data.address?.town || data.address?.village || 'Tu ubicación';
            const country = data.address?.country_code?.toUpperCase() || '';
            setLocationName(`${city}${country ? ', ' + country : ''}`);
          } catch (error) {
            console.error("Error en reverse geocoding:", error);
            setOrigin(`${lat}, ${lng}`);
          }
          setIsGeolocating(false);
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
          setIsGeolocating(false);
          // Ubicación por defecto (Lima)
          const defaultLat = -12.0464;
          const defaultLng = -77.0428;
          setUserLocation([defaultLat, defaultLng]);
          getWeatherData(defaultLat, defaultLng);
        }
      );
    } else {
      setIsGeolocating(false);
      const defaultLat = -12.0464;
      const defaultLng = -77.0428;
      setUserLocation([defaultLat, defaultLng]);
      getWeatherData(defaultLat, defaultLng);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resOzone = await fetch("http://localhost:8000/heatmap/ozone");
        const resNo2 = await fetch("http://localhost:8000/heatmap/no2");
        const resHcho = await fetch("http://localhost:8000/heatmap/hcho");

        const ozone = await resOzone.json();
        const no2 = await resNo2.json();
        const hcho = await resHcho.json();

        setData({
          ozone: ozone.points || [],
          no2: no2.points || [],
          hcho: hcho.points || []
        });
      } catch (error) {
        console.error("Error al obtener datos del backend:", error);
      }
    };

    fetchData();
  }, []);

  const fetchRoute = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/route?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${transportMode}&optimize=true`
      );
      const data = await res.json();

      if (data.error) {
        console.error("Error:", data.error);
        return;
      }

      setRoute(data);

      if (data.duration_value) {
        const arrival = new Date(Date.now() + data.duration_value * 1000);
        const timeString = arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setArrivalTime(timeString);
      }

      console.log("Ruta optimizada", data);
    } catch (error) {
      console.error("Error al obtener la ruta:", error);
    }
  };

  const handleOriginChange = async (value: string) => {
    setOrigin(value);
    if (value.length > 3) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&addressdetails=1&limit=5`
        );
        const data = await res.json();
        setOriginSuggestions(data);
      } catch (error) {
        console.error("Error obteniendo sugerencias de origen:", error);
      }
    } else {
      setOriginSuggestions([]);
    }
  };

  const handleDestinationChange = async (value: string) => {
    setDestination(value);
    if (value.length > 3) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&addressdetails=1&limit=5`
        );
        const data = await res.json();
        setDestinationSuggestions(data);
      } catch (error) {
        console.error("Error obteniendo sugerencias de destino:", error);
      }
    } else {
      setDestinationSuggestions([]);
    }
  };

  const getTransportIcon = (mode: string) => {
    switch(mode) {
      case 'car': return <Car className="w-5 h-5" />;
      case 'bicycle': return <Bike className="w-5 h-5" />;
      default: return <Footprints className="w-5 h-5" />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <SecondHeader/>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 bg-slate-800/90 backdrop-blur-sm border-r border-slate-700/50 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <h2 className="text-2xl font-bold text-white">Planificador de Rutas</h2>

            {/* Botón de Geolocalización */}
            <button
              onClick={getCurrentLocation}
              disabled={isGeolocating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Navigation className={`w-4 h-4 ${isGeolocating ? 'animate-spin' : ''}`} />
              {isGeolocating ? 'Localizando...' : 'Usar mi ubicación'}
            </button>

            {/* Origen */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                <label className="text-gray-400 text-sm">Origen</label>
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => handleOriginChange(e.target.value)}
                  placeholder="Ingresa tu punto de partida"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-teal-500 transition-colors"
                />

                {originSuggestions.length > 0 && (
                  <ul className="absolute z-50 bg-slate-800 border border-slate-700 rounded-lg mt-1 w-full max-h-48 overflow-y-auto">
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

            {/* Destino */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <label className="text-gray-400 text-sm">Destino</label>
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  placeholder="¿A dónde quieres ir?"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-teal-500 transition-colors"
                />
                
                {destinationSuggestions.length > 0 && (
                  <ul className="absolute z-50 bg-slate-800 border border-slate-700 rounded-lg mt-1 w-full max-h-48 overflow-y-auto">
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

            {/* Opciones de Transporte - Estilo Google */}
            <div>
              <label className="text-white font-semibold mb-3 block">Modo de transporte</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTransportMode('car')}
                  className={`flex flex-col items-center justify-center py-4 rounded-lg font-medium text-sm transition-all ${
                    transportMode === 'car'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <Car className="w-6 h-6 mb-1" />
                  <span className="text-xs">Auto</span>
                </button>
                <button
                  onClick={() => setTransportMode('bicycle')}
                  className={`flex flex-col items-center justify-center py-4 rounded-lg font-medium text-sm transition-all ${
                    transportMode === 'bicycle'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <Bike className="w-6 h-6 mb-1" />
                  <span className="text-xs">Bici</span>
                </button>
                <button
                  onClick={() => setTransportMode('walking')}
                  className={`flex flex-col items-center justify-center py-4 rounded-lg font-medium text-sm transition-all ${
                    transportMode === 'walking'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <Footprints className="w-6 h-6 mb-1" />
                  <span className="text-xs">Caminar</span>
                </button>
              </div>
            </div>

            {/* Widget de Temperatura - Estilo Google */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Cloud className="w-5 h-5 text-white" />
                    <span className="text-white text-sm font-medium">{locationName}</span>
                  </div>
                  <p className="text-blue-100 text-xs">{weatherCondition}</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-light text-white">
                    {temperature !== null ? `${temperature}°` : '--'}
                  </div>
                  <div className="text-blue-100 text-xs mt-1">Celsius</div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-blue-100 pt-4 border-t border-blue-400/30">
                <div className="text-center">
                  <div className="font-medium">Máx</div>
                  <div className="mt-1">{maxTemp !== null ? `${maxTemp}°` : '--'}</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">Mín</div>
                  <div className="mt-1">{minTemp !== null ? `${minTemp}°` : '--'}</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">Humedad</div>
                  <div className="mt-1">{humidity !== null ? `${humidity}%` : '--'}</div>
                </div>
              </div>
            </div>

            {/* Información de optimización */}
            <div className="bg-teal-900/30 border border-teal-700/50 rounded-lg p-3">
              <p className="text-teal-300 text-xs leading-relaxed">
                <span className="font-semibold">Algoritmo de Dijkstra:</span> Calcula la ruta más óptima considerando distancia, tiempo y exposición a contaminantes.
              </p>
            </div>
          </div>

          {/* Search Button */}
          <div className="p-6 border-t border-slate-700/50">
            <button 
              onClick={fetchRoute} 
              className="w-full bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-900 font-semibold py-3 rounded-lg hover:from-cyan-500 hover:to-teal-500 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Buscar Ruta Óptima
            </button>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          {/* Información de ruta - Estilo Google Maps */}
          {route && (
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-2xl px-6 py-4 z-[1000] min-w-[320px]">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                  {getTransportIcon(transportMode)}
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-900">{route.duration || '-- min'}</div>
                  <div className="text-sm text-gray-600">{route.distance || '-- km'}</div>
                </div>
                {arrivalTime && (
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Llegada</div>
                    <div className="text-lg font-semibold text-blue-600">{arrivalTime}</div>
                  </div>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  🎯 Ruta optimizada · Menor exposición a contaminantes
                </p>
              </div>
            </div>
          )}

          {/* Leyenda de Contaminantes - Esquina superior derecha transparente */}
          <div className="absolute top-6 right-6 bg-slate-900/60 backdrop-blur-sm rounded-lg shadow-xl p-3 z-[1000] border border-slate-700/30">
            <h3 className="text-white font-semibold mb-2 text-xs">Contaminantes</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-white"></div>
                <span className="text-gray-200 text-xs">O₃</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500"></div>
                <span className="text-gray-200 text-xs">NO₂</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 via-lime-400 to-white"></div>
                <span className="text-gray-200 text-xs">HCHO</span>
              </div>
            </div>
          </div>

          <MapContainer
            center={userLocation || [-12.0464, -77.0428]}
            zoom={13}
            className="h-full w-full z-0"
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapControls />
            
            {userLocation && <LocationMarker position={userLocation} />}

            {/* Heatmaps para los tres contaminantes */}
            {data.ozone && data.ozone.length > 0 && (
              <HeatmapLayer
                points={data.ozone.map((p: any) => [p.lat, p.lng, p.intensity || 0.5])}
                options={{
                  radius: 30,
                  blur: 20,
                  max: 1.0,
                  gradient: { 0.4: "blue", 0.65: "cyan", 1: "white" },
                }}
              />
            )}

            {data.no2 && data.no2.length > 0 && (
              <HeatmapLayer
                points={data.no2.map((p: any) => [p.lat, p.lng, p.intensity || 0.5])}
                options={{
                  radius: 30,
                  blur: 20,
                  max: 1.0,
                  gradient: { 0.4: "yellow", 0.65: "orange", 1: "red" },
                }}
              />
            )}

            {data.hcho && data.hcho.length > 0 && (
              <HeatmapLayer
                points={data.hcho.map((p: any) => [p.lat, p.lng, p.intensity || 0.5])}
                options={{
                  radius: 30,
                  blur: 20,
                  max: 1.0,
                  gradient: { 0.4: "green", 0.65: "lime", 1: "white" },
                }}
              />
            )}

            {/* Polyline de la ruta */}
            {route && route.overview_polyline && (
              <Polyline
                positions={polyline.decode(route.overview_polyline.points)}
                pathOptions={{ color: "#2563eb", weight: 6, opacity: 0.8 }}
              />
            )}
          </MapContainer>

          {/* Guardar Ruta */}
          <div className="absolute bottom-6 right-6 z-[1000]">
            <button className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg">
              <Bookmark className="w-5 h-5" />
              Guardar Ruta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}