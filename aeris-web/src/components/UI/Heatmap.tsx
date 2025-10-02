import { useEffect } from "react";
import { useMap } from "react-leaflet";
import "leaflet.heat";

interface HeatmapProps {
  points: [number, number, number?][];
  options?: any;
}

export default function HeatmapLayer({ points, options }: HeatmapProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    // @ts-ignore
    const heatLayer = (window as any).L.heatLayer(points, options).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, options]);

  return null;
}
