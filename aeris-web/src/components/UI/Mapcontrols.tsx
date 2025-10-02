import { Plus, Minus, Navigation } from 'lucide-react';
import { useMap } from "react-leaflet";

const MapControls = () => {
  const map = useMap();

  const zoomIn = () => map.setZoom(map.getZoom() + 1);
  const zoomOut = () => map.setZoom(map.getZoom() - 1);
  const goToOrigin = () => map.setView([-12.0464, -77.0428], 13);

  return (
    <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-[1000] pointer-events-auto">
      <button onClick={zoomIn} className="w-10 h-10 bg-slate-800/90 border border-slate-700 rounded-lg flex items-center justify-center shadow-lg hover:bg-slate-700">
        <Plus className="w-5 h-5 text-white" />
      </button>
      <button onClick={zoomOut} className="w-10 h-10 bg-slate-800/90 border border-slate-700 rounded-lg flex items-center justify-center shadow-lg hover:bg-slate-700">
        <Minus className="w-5 h-5 text-white" />
      </button>
      <button onClick={goToOrigin} className="w-10 h-10 bg-slate-800/90 border border-slate-700 rounded-lg flex items-center justify-center shadow-lg hover:bg-slate-700">
        <Navigation className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default MapControls;