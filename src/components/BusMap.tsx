
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { BusData } from '../services/websocketService';
import BusMarker from './BusMarker';
import { cn } from '@/lib/utils';

// Fix for default marker icons in React Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface BusMapProps {
  buses: BusData[];
  className?: string;
}

// Auto center map when buses are available
function AutoCenter({ buses }: { buses: BusData[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (buses.length > 0) {
      const bounds = L.latLngBounds(buses.map(bus => [bus.lat, bus.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, buses]);
  
  return null;
}

// Component to assign colors to buses
const BusMap: React.FC<BusMapProps> = ({ buses, className }) => {
  const [busColors, setBusColors] = useState<Record<string, string>>({});
  
  // Assign consistent colors to buses
  useEffect(() => {
    const colors = ['blue', 'red', 'green', 'yellow', 'orange', 'purple', 'teal'];
    
    const newColors: Record<string, string> = {};
    buses.forEach((bus, index) => {
      if (!busColors[bus.id]) {
        // Assign a color from our palette, cycling through the options
        newColors[bus.id] = colors[index % colors.length];
      }
    });
    
    if (Object.keys(newColors).length > 0) {
      setBusColors(prev => ({ ...prev, ...newColors }));
    }
  }, [buses, busColors]);

  return (
    <div className={cn("w-full h-full rounded-2xl overflow-hidden shadow-lg", className)}>
      <MapContainer
        center={[51.505, -0.09]} // Default center
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        className="z-10" // Ensure map is below the overlay elements
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        
        {buses.map(bus => (
          <BusMarker 
            key={bus.id} 
            bus={bus} 
            color={`var(--bus-${busColors[bus.id] || 'blue'})`}
          />
        ))}
        
        {buses.length > 0 && <AutoCenter buses={buses} />}
      </MapContainer>
    </div>
  );
};

export default BusMap;
