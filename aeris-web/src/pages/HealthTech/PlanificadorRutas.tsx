import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Bookmark } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, useMap  } from "react-leaflet";
import polyline from "polyline";

import "leaflet/dist/leaflet.css";

import HeatmapLayer from "../../components/UI/Heatmap"; 
import SecondHeader from "../../components/Header/SecondHeader";
import MapControls from "../../components/UI/Mapcontrols";

export default function AerisRoutePlanner() {
  const [origin, setOrigin] = useState('123 Main St, Springfield');
  const [destination, setDestination] = useState('456 Oak Ave, Springfield');
  const [transportMode, setTransportMode] = useState('walking');
  const [pollutionExposure, setPollutionExposure] = useState(50);
  const [data, setData] = useState({ ozone: [], no2: [], hcho: [] });
  const [selected, setSelected] = useState("ozone");

  const [route, setRoute] = useState<any>(null);
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([]);
  const mapRef = useRef<any>(null);

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
        `http://localhost:8000/route?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${transportMode}`
      );
      const data = await res.json();
      setRoute(data);
      console.log("Ruta recibida:", data);
    } catch (error) {
      console.error("Error al obtener la ruta:", error);
    }
  };

  // Buscar sugerencias para origen
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

// Buscar sugerencias para destino
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


  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Header */}
      <SecondHeader/>

      {/* Contenido izquierdo - controles */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 bg-slate-800/90 backdrop-blur-sm border-r border-slate-700/50 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <h2 className="text-2xl font-bold text-white">Planificador de Rutas</h2>

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

            {/* Opciones de Transporte */}
            <div>
              <label className="text-white font-semibold mb-3 block">Opciones de transporte</label>
              <div className="flex gap-2">
                {["walking", "bicycle", "car"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTransportMode(mode)}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                      transportMode === mode
                        ? 'bg-teal-500 text-white'
                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    {mode === "walking" ? "Caminando" : mode === "bicycle" ? "Bicicleta" : "Coche"}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtros */}
            <div>
              <label className="text-white font-semibold mb-4 block">Filtros</label>
              <div className="mb-2">
                <span className="text-gray-400 text-sm">Exposición a contaminantes</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={pollutionExposure}
                  onChange={(e) => setPollutionExposure(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${pollutionExposure}%, #334155 ${pollutionExposure}%, #334155 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Baja</span>
                  <span>Alta</span>
                </div>
              </div>
            </div>

            {/* Contaminantes */}
            <div>
              <label className="text-white font-semibold mb-4 block">Contaminantes</label>
              <div className="flex flex-col gap-2">
                <button onClick={() => setSelected("ozone")} className={`px-4 py-2 rounded text-sm font-medium ${selected==="ozone"?"bg-cyan-500 text-white":"bg-gray-700 text-gray-300"}`}>Ozono (O₃)</button>
                <button onClick={() => setSelected("no2")} className={`px-4 py-2 rounded text-sm font-medium ${selected==="no2"?"bg-red-500 text-white":"bg-gray-700 text-gray-300"}`}>Dióxido de Nitrógeno (NO₂)</button>
                <button onClick={() => setSelected("hcho")} className={`px-4 py-2 rounded text-sm font-medium ${selected==="hcho"?"bg-green-500 text-white":"bg-gray-700 text-gray-300"}`}>Formaldehído (HCHO)</button>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="p-6 border-t border-slate-700/50">
            <button 
              onClick={fetchRoute} 
              className="w-full bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-900 font-semibold py-3 rounded-lg hover:from-cyan-500 hover:to-teal-500 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Buscar Rutas
            </button>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          <MapContainer
            center={[-12.0464, -77.0428]}
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

            {/* Heatmap dinámico */}
            {data[selected] && data[selected].length > 0 && (
              <HeatmapLayer
                points={data[selected]}
                options={{
                  radius: 30,
                  blur: 20,
                  max: 1.0,
                  gradient:
                    selected === "ozone"
                      ? { 0.4: "blue", 0.65: "cyan", 1: "white" }
                      : selected === "no2"
                      ? { 0.4: "yellow", 0.65: "orange", 1: "red" }
                      : { 0.4: "green", 0.65: "lime", 1: "white" },
                }}
              />
            )}

            {/* Polyline dinámico */}
            {route && route.routes && route.routes[0] && (
              <Polyline
                positions={polyline.decode(route.routes[0].overview_polyline.points)}
                pathOptions={{ color: "#14b8a6", weight: 5 }}
              />
            )}

          </MapContainer>

          {/* Controles */}


          {/* Guardar Ruta */}
          <div className="absolute bottom-6 right-24 z-50">
            <button className="bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-900 font-semibold px-6 py-3 rounded-lg hover:from-cyan-500 hover:to-teal-500 transition-all flex items-center gap-2 shadow-lg">
              <Bookmark className="w-5 h-5" />
              Guardar Ruta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
