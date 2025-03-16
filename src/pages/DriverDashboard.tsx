
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, LogOut, Map, Route as RouteIcon } from 'lucide-react';

const DriverDashboard = () => {
  const [isTracking, setIsTracking] = useState(false);
  
  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Driver Dashboard</h1>
          </div>
          <Link to="/login">
            <Button variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </Link>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Driver Info Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Driver Information</CardTitle>
              <CardDescription>Your profile and bus details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Personal Information</h3>
                <p className="text-base font-medium">John Doe</p>
                <p className="text-sm text-gray-500">driver@busberry.com</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Bus Information</h3>
                <div className="flex items-center space-x-2">
                  <Bus className="h-4 w-4 text-gray-500" />
                  <span className="text-base font-medium">BUS-12345</span>
                </div>
                <p className="text-sm text-gray-500">City Express X2</p>
                <div className="flex items-center space-x-2">
                  <RouteIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Route: 42A</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tracking Control Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Location Tracking</CardTitle>
              <CardDescription>Control your real-time location sharing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-6">
                <div className="text-center">
                  <div className={`h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-4 ${isTracking ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Map className={`h-12 w-12 ${isTracking ? 'text-green-500' : 'text-gray-400'}`} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    {isTracking ? 'Location Tracking Active' : 'Location Tracking Inactive'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {isTracking 
                      ? 'Your bus location is being shared in real-time.' 
                      : 'Enable tracking to share your bus location with passengers.'}
                  </p>
                  <Button 
                    onClick={toggleTracking}
                    variant={isTracking ? "destructive" : "default"}
                    className="min-w-[150px]"
                  >
                    {isTracking ? 'Stop Tracking' : 'Start Tracking'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Route Information Card */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Today's Route</CardTitle>
              <CardDescription>Your scheduled route and stops</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Route</h3>
                    <p className="text-lg font-medium">Route 42A</p>
                    <p className="text-sm text-gray-500">Downtown - Uptown Express</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Start</h3>
                    <p className="text-lg font-medium">Central Station</p>
                    <p className="text-sm text-gray-500">Departure: 7:30 AM</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">End</h3>
                    <p className="text-lg font-medium">Uptown Terminal</p>
                    <p className="text-sm text-gray-500">Arrival: 8:45 AM</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Major Stops</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-blue-600">1</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">Central Station</p>
                        <p className="text-xs text-gray-500">7:30 AM</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-blue-600">2</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">Market Street</p>
                        <p className="text-xs text-gray-500">7:45 AM</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-blue-600">3</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">City Hospital</p>
                        <p className="text-xs text-gray-500">8:00 AM</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-blue-600">4</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">Plaza Mall</p>
                        <p className="text-xs text-gray-500">8:20 AM</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-blue-600">5</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">Uptown Terminal</p>
                        <p className="text-xs text-gray-500">8:45 AM</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DriverDashboard;
