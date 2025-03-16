
type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

export interface BusData {
  id: string;
  lat: number;
  lng: number;
  route?: string;
  speed?: number;
  heading?: number;
  lastUpdate?: string;
}

interface WebSocketServiceState {
  buses: Map<string, BusData>;
  status: ConnectionStatus;
  lastMessage: string | null;
  error: Error | null;
}

type Listener = (state: WebSocketServiceState) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectTimeout: number | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: Set<Listener> = new Set();
  
  private state: WebSocketServiceState = {
    buses: new Map<string, BusData>(),
    status: 'disconnected',
    lastMessage: null,
    error: null
  };

  constructor(private url: string) {}

  public connect(): void {
    if (this.socket) {
      this.disconnect();
    }

    this.setState({ status: 'connecting' });
    
    try {
      this.socket = new WebSocket(this.url);
      
      this.socket.onopen = this.handleOpen;
      this.socket.onmessage = this.handleMessage;
      this.socket.onclose = this.handleClose;
      this.socket.onerror = this.handleError;
      
      this.reconnectAttempts = 0;
    } catch (error) {
      this.setState({ 
        status: 'disconnected', 
        error: error instanceof Error ? error : new Error('Unknown error occurred') 
      });
      this.scheduleReconnect();
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      
      if (this.socket.readyState === WebSocket.OPEN || 
          this.socket.readyState === WebSocket.CONNECTING) {
        this.socket.close();
      }
      
      this.socket = null;
    }
    
    if (this.reconnectTimeout) {
      window.clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    this.setState({ status: 'disconnected' });
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    // Immediately call the listener with the current state
    listener(this.state);
    
    // Return an unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): WebSocketServiceState {
    return { ...this.state };
  }

  private setState(newState: Partial<WebSocketServiceState>): void {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  private handleOpen = (): void => {
    this.setState({ 
      status: 'connected', 
      error: null 
    });
    this.reconnectAttempts = 0;
  };

  private handleMessage = (event: MessageEvent): void => {
    try {
      const message = event.data;
      this.setState({ lastMessage: message });
      
      // Parse bus data and update the buses map
      const busData = JSON.parse(message) as BusData | BusData[];
      
      if (Array.isArray(busData)) {
        // If we get an array of buses, update all of them
        const newBuses = new Map(this.state.buses);
        for (const bus of busData) {
          newBuses.set(bus.id, {
            ...bus,
            lastUpdate: new Date().toISOString()
          });
        }
        this.setState({ buses: newBuses });
      } else {
        // If we get a single bus, update just that one
        const newBuses = new Map(this.state.buses);
        newBuses.set(busData.id, {
          ...busData,
          lastUpdate: new Date().toISOString()
        });
        this.setState({ buses: newBuses });
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  private handleClose = (event: CloseEvent): void => {
    if (!event.wasClean) {
      this.setState({ 
        status: 'disconnected',
        error: new Error(`Connection closed abnormally. Code: ${event.code}`) 
      });
      this.scheduleReconnect();
    } else {
      this.setState({ status: 'disconnected', error: null });
    }
  };

  private handleError = (event: Event): void => {
    this.setState({ 
      status: 'disconnected',
      error: new Error('WebSocket error occurred') 
    });
    // The socket will also emit a close event after an error
  };

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      window.clearTimeout(this.reconnectTimeout);
    }
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      this.reconnectTimeout = window.setTimeout(() => {
        this.reconnectTimeout = null;
        this.connect();
      }, delay);
    }
  }
}

// Create and export a singleton instance
export const busWebSocketService = new WebSocketService('ws://localhost:8000/ws/bus/');

export default busWebSocketService;
