/**
 * Smart Port Fix - Tries multiple port/protocol combinations
 */

(function() {
  console.log('[SmartPortFix] Initializing...');
  
  // Known working combinations from test pages
  const portConfigs = [
    { port: '52181', protocol: 'http' },
    { port: '52181', protocol: 'https' },
    { port: '59885', protocol: 'http' },
    { port: '59885', protocol: 'https' },
    { port: '52080', protocol: 'http' }
  ];
  
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;
  
  // Track which config works
  let workingConfig = null;
  
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    // Store original URL for later
    this._originalUrl = url;
    this._method = method;
    this._args = args;
    
    if (typeof url === 'string' && url.includes('127.0.0.1')) {
      // If it's trying the wrong port
      if (url.includes(':65453') || url.includes(':65454') || url.includes(':65455')) {
        // If we know what works, use it
        if (workingConfig) {
          const newUrl = `${workingConfig.protocol}://127.0.0.1:${workingConfig.port}${url.substring(url.indexOf('/', 8))}`;
          console.log('[SmartPortFix] Using known working config:', newUrl);
          return originalXHROpen.apply(this, [method, newUrl, ...args]);
        }
        
        // Otherwise use first config
        const config = portConfigs[0];
        const newUrl = `${config.protocol}://127.0.0.1:${config.port}${url.substring(url.indexOf('/', 8))}`;
        console.log('[SmartPortFix] Trying:', newUrl);
        this._currentConfig = config;
        this._configIndex = 0;
        return originalXHROpen.apply(this, [method, newUrl, ...args]);
      }
    }
    
    return originalXHROpen.apply(this, [method, url, ...args]);
  };
  
  XMLHttpRequest.prototype.send = function(data) {
    const xhr = this;
    
    // If this is a redirected request
    if (xhr._currentConfig) {
      // Set up retry logic
      const originalOnError = xhr.onerror;
      const originalOnLoad = xhr.onload;
      const originalOnReadyStateChange = xhr.onreadystatechange;
      
      let hasRetried = false;
      
      const retryNext = () => {
        if (hasRetried) return;
        hasRetried = true;
        
        xhr._configIndex++;
        if (xhr._configIndex < portConfigs.length) {
          const config = portConfigs[xhr._configIndex];
          const newUrl = `${config.protocol}://127.0.0.1:${config.port}${xhr._originalUrl.substring(xhr._originalUrl.indexOf('/', 8))}`;
          console.log('[SmartPortFix] Retrying with:', newUrl);
          
          // Create new XHR for retry
          const retryXhr = new XMLHttpRequest();
          retryXhr.open(xhr._method, newUrl, ...xhr._args);
          
          // Copy headers if any
          if (xhr._headers) {
            xhr._headers.forEach(h => retryXhr.setRequestHeader(h.name, h.value));
          }
          
          // Copy handlers
          retryXhr.onload = originalOnLoad;
          retryXhr.onerror = originalOnError;
          retryXhr.onreadystatechange = originalOnReadyStateChange;
          
          // Mark config if successful
          retryXhr.addEventListener('load', function() {
            if (this.status >= 200 && this.status < 300) {
              workingConfig = config;
              console.log('[SmartPortFix] Found working config:', config);
            }
          });
          
          retryXhr.send(data);
        }
      };
      
      // Intercept error to retry
      xhr.onerror = function() {
        console.log('[SmartPortFix] Request failed, trying next config...');
        retryNext();
        if (originalOnError) originalOnError.apply(this, arguments);
      };
      
      // Check status on load
      xhr.onload = function() {
        if (this.status === 0 || this.status >= 400) {
          console.log('[SmartPortFix] Bad status:', this.status, ', trying next config...');
          retryNext();
        } else {
          // Success! Remember this config
          if (xhr._currentConfig) {
            workingConfig = xhr._currentConfig;
            console.log('[SmartPortFix] Success with config:', workingConfig);
          }
        }
        if (originalOnLoad) originalOnLoad.apply(this, arguments);
      };
    }
    
    return originalXHRSend.apply(this, [data]);
  };
  
  // Store setRequestHeader calls
  const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
  XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
    if (!this._headers) this._headers = [];
    this._headers.push({ name, value });
    return originalSetRequestHeader.apply(this, arguments);
  };
  
  console.log('[SmartPortFix] Ready');
})();