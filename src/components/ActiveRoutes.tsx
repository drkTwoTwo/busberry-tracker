
import React from 'react';
import { Route } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActiveRoutesProps {
  className?: string;
}

// Sample routes data - in a real app this would come from an API
const routes = [
  { id: '101', name: 'Downtown Express', from: 'Central Station', to: 'Business District', status: 'on-time' },
  { id: '203', name: 'Airport Shuttle', from: 'Terminal 1', to: 'City Center', status: 'delayed' },
  { id: '305', name: 'Campus Loop', from: 'North Campus', to: 'South Campus', status: 'on-time' },
  { id: '418', name: 'Waterfront Line', from: 'Harbor View', to: 'Beach Boulevard', status: 'on-time' },
];

const ActiveRoutes: React.FC<ActiveRoutesProps> = ({ className }) => {
  return (
    <div className={cn("overflow-hidden rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200 shadow-lg", className)}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Active Routes</h2>
        <p className="text-sm text-gray-500 mt-1">{routes.length} routes available</p>
      </div>
      
      <div className="overflow-y-auto max-h-[calc(100%-4rem)]">
        {routes.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No active routes available</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {routes.map(route => (
              <li 
                key={route.id}
                className="p-4 transition-all duration-200 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">Route {route.id}: {route.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                      <p className="text-sm text-gray-500">From: {route.from}</p>
                      <span className="hidden sm:inline text-gray-300">•</span>
                      <p className="text-sm text-gray-500">To: {route.to}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "text-xs px-2 py-1 rounded-full font-medium",
                    route.status === 'on-time' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  )}>
                    {route.status === 'on-time' ? 'On Time' : 'Delayed'}
                  </div>
                </div>
                
                <div className="mt-2 flex items-center text-primary">
                  <Route className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs font-medium">View on map</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ActiveRoutes;
