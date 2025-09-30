/**
 * Fingerprint Port Fix
 * This script MUST run BEFORE the SDK loads
 * It intercepts network calls and redirects to working ports
 */

(function() {
  console.log('[PortFix] Initializing port fix...');
  
  const workingPorts = ['52181', '59885', '52080'];
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalFetch = window.fetch;
  
  // Intercept XHR
  XMLHttpRequest.prototype.open = function(method, url) {
    if (typeof url === 'string' && url.includes('127.0.0.1')) {
      // Check if it's trying wrong ports
      if (url.includes(':65453') || url.includes(':65454') || url.includes(':65455')) {
        // Try first working port and change to HTTP
        let newUrl = url.replace(/:\d+/, ':' + workingPorts[0]);
        newUrl = newUrl.replace('https://', 'http://');
        console.log('[PortFix] Redirecting XHR from', url, 'to', newUrl);
        return originalXHROpen.apply(this, arguments[0] = method, arguments[1] = newUrl, ...Array.from(arguments).slice(2));
      }
    }
    return originalXHROpen.apply(this, arguments);
  };
  
  // Intercept fetch
  window.fetch = function(url) {
    if (typeof url === 'string' && url.includes('127.0.0.1')) {
      // Check if it's trying wrong ports
      if (url.includes(':65453') || url.includes(':65454') || url.includes(':65455')) {
        // Try first working port and change to HTTP
        let newUrl = url.replace(/:\d+/, ':' + workingPorts[0]);
        newUrl = newUrl.replace('https://', 'http://');
        console.log('[PortFix] Redirecting fetch from', url, 'to', newUrl);
        return originalFetch.apply(this, [newUrl, ...Array.from(arguments).slice(1)]);
      }
    }
    return originalFetch.apply(this, arguments);
  };
  
  // Also intercept WebSocket if needed
  const OriginalWebSocket = window.WebSocket;
  window.WebSocket = function(url) {
    if (url.includes('65453') || url.includes('65454') || url.includes('65455')) {
      let newUrl = url.replace(/:\d+/, ':' + workingPorts[0]);
      // WebSocket should use ws:// not wss:// for local
      newUrl = newUrl.replace('wss://', 'ws://');
      newUrl = newUrl.replace('https://', 'http://');
      console.log('[PortFix] Redirecting WebSocket from', url, 'to', newUrl);
      return new OriginalWebSocket(newUrl, ...Array.from(arguments).slice(1));
    }
    return new OriginalWebSocket(...arguments);
  };
  
  console.log('[PortFix] Port fix initialized');
})();