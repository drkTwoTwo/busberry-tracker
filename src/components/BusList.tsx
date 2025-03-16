
import React, { useState } from 'react';
import { BusData } from '../services/websocketService';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { MapPin, Clock, Navigation } from 'lucide-react';

interface BusListProps {
  buses: BusData[];
  className?: string;
  onSelectBus?: (bus: BusData) => void;
}

const BusList: React.FC<BusListProps> = ({ buses, className, onSelectBus }) => {
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  
  const handleBusClick = (bus: BusData) => {
    setSelectedBusId(bus.id);
    onSelectBus?.(bus);
  };
  
  const sortedBuses = [...buses].sort((a, b) => a.id.localeCompare(b.id));

  return (
    <div className={cn("overflow-hidden rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200 shadow-lg", className)}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Active Buses</h2>
        <p className="text-sm text-gray-500 mt-1">{buses.length} buses online</p>
      </div>
      
      <div className="overflow-y-auto max-h-[calc(100%-4rem)]">
        {sortedBuses.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No buses available</p>
            <p className="text-sm mt-2">Waiting for data...</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {sortedBuses.map(bus => {
              const isSelected = selectedBusId === bus.id;
              const lastUpdateText = bus.lastUpdate 
                ? formatDistanceToNow(new Date(bus.lastUpdate), { addSuffix: true })
                : 'Unknown';
                
              return (
                <li 
                  key={bus.id}
                  onClick={() => handleBusClick(bus)}
                  className={cn(
                    "p-4 transition-all duration-200 hover:bg-gray-50 cursor-pointer",
                    isSelected && "bg-blue-50 border-l-4 border-bus-blue"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">Bus {bus.id}</h3>
                      {bus.route && (
                        <p className="text-sm text-gray-500 mt-1">Route: {bus.route}</p>
                      )}
                    </div>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                      ID: {bus.id}
                    </span>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-1 gap-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      <span>
                        {bus.lat.toFixed(6)}, {bus.lng.toFixed(6)}
                      </span>
                    </div>
                    
                    {bus.heading !== undefined && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Navigation className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        <span>Heading: {bus.heading}°</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="h-3 w-3 mr-1 text-gray-400" />
                      <span>Updated {lastUpdateText}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BusList;
