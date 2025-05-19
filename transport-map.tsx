import { useRef, useEffect } from 'react';
import L from 'leaflet';

interface MapMarker {
  position: [number, number];
  popup?: string;
}

interface TransportMapProps {
  center: [number, number];
  zoom: number;
  markers?: MapMarker[];
}

export default function TransportMap({ center, zoom, markers = [] }: TransportMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView(center, zoom);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);

      // Handle resize for better mobile experience
      const handleResize = () => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      };

      window.addEventListener('resize', handleResize);

      // Clean up on unmount
      return () => {
        window.removeEventListener('resize', handleResize);
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }

    // Update map center and zoom
    mapRef.current.setView(center, zoom);

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers
    markers.forEach(marker => {
      const mapMarker = L.marker(marker.position);
      mapMarker.addTo(mapRef.current!);

      if (marker.popup) {
        mapMarker.bindPopup(marker.popup);
      }

      markersRef.current.push(mapMarker);
    });
  }, [center, zoom, markers]);

  return <div ref={containerRef} className="h-full min-h-[250px] w-full rounded-md" />;
}