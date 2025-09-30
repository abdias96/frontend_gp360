import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useAuthStore } from '@/stores/auth';

declare global {
  interface Window {
    Echo: Echo;
    Pusher: typeof Pusher;
  }
}

class WebSocketService {
  private echo: Echo | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 5000;

  constructor() {
    // Make Pusher available globally for Laravel Echo
    window.Pusher = Pusher;
  }

  /**
   * Initialize WebSocket connection
   */
  public connect(): void {
    // Check if WebSocket is enabled in environment
    const isWebSocketEnabled = import.meta.env.VITE_ENABLE_WEBSOCKET !== 'false';
    
    if (!isWebSocketEnabled) {
      console.info('WebSocket is disabled in environment configuration');
      return;
    }

    if (this.isConnected) {
      console.log('WebSocket already connected');
      return;
    }

    const authStore = useAuthStore();
    const token = authStore.token;

    if (!token) {
      console.info('WebSocket: Waiting for authentication token');
      return;
    }

    try {
      this.echo = new Echo({
        broadcaster: 'pusher',
        key: import.meta.env.VITE_REVERB_APP_KEY || import.meta.env.VITE_PUSHER_APP_KEY || 'y54e3y8mvarcykw1l7rx',
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
        wsHost: import.meta.env.VITE_REVERB_HOST || import.meta.env.VITE_PUSHER_HOST || 'localhost',
        wsPort: import.meta.env.VITE_REVERB_PORT || import.meta.env.VITE_PUSHER_PORT || 8080,
        wssPort: import.meta.env.VITE_REVERB_PORT || import.meta.env.VITE_PUSHER_PORT || 8080,
        forceTLS: false,
        encrypted: false,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
        auth: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        authEndpoint: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/broadcasting/auth`,
      });

      // Store Echo instance globally
      window.Echo = this.echo;
      this.isConnected = true;
      this.reconnectAttempts = 0;

      console.log('WebSocket connected successfully');

      // Set up connection event listeners
      this.setupConnectionListeners();
    } catch (error) {
      console.warn('WebSocket connection not available:', error);
      // Don't retry if it's an authorization error
      if (error && typeof error === 'object' && 'message' in error && error.message?.includes('unauthorized')) {
        console.info('WebSocket: Authorization failed, disabling auto-reconnect');
        return;
      }
      this.handleReconnect();
    }
  }

  /**
   * Disconnect WebSocket connection
   */
  public disconnect(): void {
    if (this.echo) {
      this.echo.disconnect();
      this.echo = null;
      this.isConnected = false;
      console.log('WebSocket disconnected');
    }
  }

  /**
   * Get Echo instance
   */
  public getEcho(): Echo | null {
    return this.echo;
  }

  /**
   * Check if connected
   */
  public isWebSocketConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Listen to a private channel
   */
  public listenToPrivateChannel(channelName: string, eventName: string, callback: (data: any) => void): void {
    if (!this.echo) {
      console.error('WebSocket not connected');
      return;
    }

    this.echo
      .private(channelName)
      .listen(eventName, (data: any) => {
        callback(data);
      });
  }

  /**
   * Listen to a presence channel
   */
  public joinPresenceChannel(channelName: string): any {
    if (!this.echo) {
      console.error('WebSocket not connected');
      return null;
    }

    return this.echo.join(channelName);
  }

  /**
   * Listen to a public channel
   */
  public listenToChannel(channelName: string, eventName: string, callback: (data: any) => void): void {
    if (!this.echo) {
      console.error('WebSocket not connected');
      return;
    }

    this.echo
      .channel(channelName)
      .listen(eventName, (data: any) => {
        callback(data);
      });
  }

  /**
   * Leave a channel
   */
  public leaveChannel(channelName: string): void {
    if (!this.echo) {
      console.error('WebSocket not connected');
      return;
    }

    this.echo.leave(channelName);
  }

  /**
   * Setup connection event listeners
   */
  private setupConnectionListeners(): void {
    if (!this.echo) return;

    // Listen for connection state changes
    this.echo.connector.pusher.connection.bind('state_change', (states: any) => {
      console.log('WebSocket state changed:', states.current);

      if (states.current === 'disconnected' || states.current === 'failed') {
        this.isConnected = false;
        this.handleReconnect();
      } else if (states.current === 'connected') {
        this.isConnected = true;
        this.reconnectAttempts = 0;
      }
    });

    // Listen for errors
    this.echo.connector.pusher.connection.bind('error', (error: any) => {
      // Check if it's an authorization error
      if (error?.data?.code === 4009 || error?.data?.message?.includes('unauthorized')) {
        console.info('WebSocket: Authorization not configured, disabling real-time features');
        this.disconnect();
        return;
      }
      console.warn('WebSocket error:', error?.data?.message || 'Connection error');
      this.handleReconnect();
    });
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.info('WebSocket: Max reconnection attempts reached, disabling real-time features');
      return;
    }

    this.reconnectAttempts++;
    console.info(`WebSocket: Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    setTimeout(() => {
      this.disconnect();
      this.connect();
    }, this.reconnectInterval * this.reconnectAttempts);
  }

  /**
   * Subscribe to user notifications channel
   */
  public subscribeToUserNotifications(userId: number, callback: (notification: any) => void): void {
    this.listenToPrivateChannel(`user.${userId}`, '.notification.created', callback);
  }

  /**
   * Subscribe to chat channel
   */
  public subscribeToChatChannel(): any {
    if (!this.echo) {
      console.error('WebSocket not connected');
      return null;
    }

    return this.echo.join('chat.general')
      .here((users: any[]) => {
        console.log('Users in chat:', users);
      })
      .joining((user: any) => {
        console.log('User joined chat:', user);
      })
      .leaving((user: any) => {
        console.log('User left chat:', user);
      })
      .error((error: any) => {
        console.error('Chat channel error:', error);
      });
  }

  /**
   * Send message to chat
   */
  public listenForChatMessages(callback: (message: any) => void): void {
    if (!this.echo) {
      console.error('WebSocket not connected');
      return;
    }

    this.echo
      .join('chat.general')
      .listen('.message.sent', (data: any) => {
        callback(data);
      });
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();

// Export the class for type information
export default WebSocketService;