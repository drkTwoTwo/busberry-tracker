
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BusMap from '@/components/BusMap';
import BusList from '@/components/BusList';
import ConnectionStatus from '@/components/ConnectionStatus';
import { useWebSocketBuses } from '@/hooks/useWebSocketBuses';
import { BusData } from '@/services/websocketService';
import { toast } from 'sonner';
import { Info, Search, MapPin, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Index = () => {
  const { buses, status, error, connect, disconnect } = useWebSocketBuses();
  const [selectedBus, setSelectedBus] = useState<BusData | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (status === 'connected') {
      toast.success('Connected to the bus tracking server', {
        description: 'You are now receiving real-time bus updates',
        icon: <Info className="h-4 w-4" />,
      });
    } else if (status === 'disconnected' && error) {
      toast.error('Connection lost', {
        description: error.message,
        icon: <Info className="h-4 w-4" />,
      });
    }
  }, [status, error]);

  const handleSelectBus = (bus: BusData) => {
    setSelectedBus(bus);
    
    // On mobile, close the sidebar when a bus is selected
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleRouteSearch = () => {
    if (from && to) {
      toast.success('Route search', {
        description: `Searching for buses from ${from} to ${to}`,
        icon: <Search className="h-4 w-4" />,
      });
      
      // In a real application, this would filter buses by route
      setSearchOpen(false);
    } else {
      toast.error('Please specify both locations', {
        icon: <Info className="h-4 w-4" />,
      });
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900">BusBerry Tracker</h1>
            <div className="ml-3 text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
              Live
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Search className="h-4 w-4 mr-2" />
                  Find Route
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Find a Route</DialogTitle>
                  <DialogDescription>
                    Enter your starting point and destination to find buses on this route.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From</label>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        placeholder="Starting point" 
                        value={from} 
                        onChange={(e) => setFrom(e.target.value)} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">To</label>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        placeholder="Destination" 
                        value={to} 
                        onChange={(e) => setTo(e.target.value)} 
                      />
                    </div>
                  </div>
                  <Button onClick={handleRouteSearch} className="w-full mt-2">
                    <Search className="h-4 w-4 mr-2" />
                    Search Routes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Link to="/login">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <LogIn className="h-4 w-4 mr-2" />
                Driver Login
              </Button>
            </Link>
            
            <Link to="/register">
              <Button size="sm" className="hidden sm:flex">
                <UserPlus className="h-4 w-4 mr-2" />
                Register
              </Button>
            </Link>
            
            <button 
              className="md:hidden rounded-lg bg-primary px-3 py-2 text-white text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? 'Close' : 'Show Buses'}
            </button>
          </div>
        </div>
        
        <div className="mt-4">
          <ConnectionStatus 
            status={status} 
            onReconnect={connect} 
            error={error}
          />
        </div>
        
        {/* Mobile route search bar */}
        <div className="mt-4 md:hidden">
          <div className="flex items-center gap-2">
            <Input 
              placeholder="From..." 
              value={from} 
              onChange={(e) => setFrom(e.target.value)} 
              className="flex-grow"
            />
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <Input 
              placeholder="To..." 
              value={to} 
              onChange={(e) => setTo(e.target.value)} 
              className="flex-grow"
            />
            <Button onClick={handleRouteSearch} size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden p-4 sm:p-6">
        {/* Sidebar (desktop) or modal (mobile) */}
        <div className={`
          md:w-80 md:mr-6 md:flex-shrink-0 md:block
          fixed md:relative inset-0 z-20 bg-white/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none
          ${isMobileMenuOpen ? 'block' : 'hidden'}
          transition-all duration-300 ease-in-out
        `}>
          <div className="h-full md:h-auto p-4 md:p-0">
            <BusList 
              buses={buses} 
              className="h-full md:h-auto" 
              onSelectBus={handleSelectBus}
            />
            
            {/* Mobile login/register buttons */}
            <div className="mt-4 flex flex-col space-y-2 md:hidden">
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full">
                  <LogIn className="h-4 w-4 mr-2" />
                  Driver Login
                </Button>
              </Link>
              <Link to="/register" className="w-full">
                <Button className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <div className="absolute inset-0">
            <BusMap buses={buses} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-xl border-t border-gray-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500">
          <p>BusBerry Tracker • {buses.length} buses online</p>
        </div>
      </footer>
      
      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black/20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Index;
