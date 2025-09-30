/**
 * Fingerprint Port Interceptor
 * Intercepts WebSocket and XHR calls to redirect to working ports
 */

export class FingerprintPortInterceptor {
  private static instance: FingerprintPortInterceptor;
  private originalWebSocket: any;
  private originalXHROpen: any;
  private workingPorts = ['52181', '59885', '52080'];
  private initialized = false;
  
  private constructor() {}
  
  public static getInstance(): FingerprintPortInterceptor {
    if (!FingerprintPortInterceptor.instance) {
      FingerprintPortInterceptor.instance = new FingerprintPortInterceptor();
    }
    return FingerprintPortInterceptor.instance;
  }
  
  public initialize() {
    if (this.initialized) {
      console.log('[PortInterceptor] Already initialized');
      return;
    }
    
    console.log('[PortInterceptor] Initializing port interceptor...');
    
    // Store originals
    this.originalWebSocket = window.WebSocket;
    this.originalXHROpen = XMLHttpRequest.prototype.open;
    
    // Intercept WebSocket
    const self = this;
    window.WebSocket = function(url: string, ...args: any[]) {
      console.log('[PortInterceptor] WebSocket attempting:', url);
      
      // Check if it's trying to connect to wrong port
      if (url.includes('65453') || url.includes('65454')) {
        // Try working ports
        for (const port of self.workingPorts) {
          const newUrl = url.replace(/:\d+/, ':' + port);
          console.log('[PortInterceptor] Redirecting WebSocket to:', newUrl);
          try {
            return new self.originalWebSocket(newUrl, ...args);
          } catch (e) {
            console.log('[PortInterceptor] Failed on port', port);
          }
        }
      }
      
      return new self.originalWebSocket(url, ...args);
    };
    
    // Intercept XHR
    XMLHttpRequest.prototype.open = function(method: string, url: string, ...args: any[]) {
      if (typeof url === 'string' && (url.includes('127.0.0.1') || url.includes('localhost'))) {
        console.log('[PortInterceptor] XHR attempting:', method, url);
        
        // Check if it's trying wrong port
        if (url.includes(':65453') || url.includes(':65454')) {
          // Replace with first working port AND change to HTTP
          let newUrl = url.replace(/:\d+/, ':' + self.workingPorts[0]);
          // Change HTTPS to HTTP
          newUrl = newUrl.replace('https://', 'http://');
          console.log('[PortInterceptor] Redirecting XHR to:', newUrl);
          return self.originalXHROpen.apply(this, [method, newUrl, ...args]);
        }
      }
      
      return self.originalXHROpen.apply(this, [method, url, ...args]);
    };
    
    this.initialized = true;
    console.log('[PortInterceptor] Port interceptor initialized');
  }
  
  public restore() {
    if (!this.initialized) return;
    
    console.log('[PortInterceptor] Restoring original functions');
    window.WebSocket = this.originalWebSocket;
    XMLHttpRequest.prototype.open = this.originalXHROpen;
    this.initialized = false;
  }
}

// Export singleton
export const portInterceptor = FingerprintPortInterceptor.getInstance();