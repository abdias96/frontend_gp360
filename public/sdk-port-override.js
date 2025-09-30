/**
 * SDK Port Override
 * This script overrides the SDK's default port configuration
 * Must run AFTER SDK loads but BEFORE it's used
 */

(function() {
  console.log('[SDKOverride] Waiting for SDK...');
  
  // Function to override SDK settings
  function overrideSDK() {
    if (typeof window.Fingerprint !== 'undefined' && window.Fingerprint.WebApi) {
      console.log('[SDKOverride] SDK found, patching...');
      
      // Store original constructor
      const OriginalWebApi = window.Fingerprint.WebApi;
      
      // Override constructor
      window.Fingerprint.WebApi = function() {
        console.log('[SDKOverride] Creating patched WebApi instance');
        
        // Create instance with original constructor
        const instance = new OriginalWebApi();
        
        // Store original methods
        const originalEnumerateDevices = instance.enumerateDevices;
        const originalStartAcquisition = instance.startAcquisition;
        
        // Override enumerateDevices to try multiple ports
        instance.enumerateDevices = function() {
          console.log('[SDKOverride] enumerateDevices called');
          
          // Try to call with modified internal settings
          if (instance.webChannel && instance.webChannel.port) {
            console.log('[SDKOverride] Changing port from', instance.webChannel.port, 'to 52181');
            instance.webChannel.port = 52181;
          }
          
          // If there's a configuration object
          if (instance.config) {
            instance.config.port = 52181;
          }
          
          // Call original
          return originalEnumerateDevices.apply(this, arguments);
        };
        
        // Override startAcquisition
        instance.startAcquisition = function() {
          console.log('[SDKOverride] startAcquisition called');
          
          // Try to modify port
          if (instance.webChannel && instance.webChannel.port) {
            instance.webChannel.port = 52181;
          }
          
          return originalStartAcquisition.apply(this, arguments);
        };
        
        // Try to find and override the port in the instance
        for (let prop in instance) {
          if (prop.toLowerCase().includes('port') || prop.toLowerCase().includes('url')) {
            console.log('[SDKOverride] Found property:', prop, '=', instance[prop]);
            if (instance[prop] === 65453 || instance[prop] === '65453') {
              instance[prop] = 52181;
              console.log('[SDKOverride] Changed', prop, 'to 52181');
            }
          }
        }
        
        return instance;
      };
      
      // Copy static properties
      for (let prop in OriginalWebApi) {
        window.Fingerprint.WebApi[prop] = OriginalWebApi[prop];
      }
      
      console.log('[SDKOverride] SDK patched successfully');
      return true;
    }
    return false;
  }
  
  // Try immediately
  if (!overrideSDK()) {
    // If SDK not loaded, wait for it
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (overrideSDK() || attempts > 100) {
        clearInterval(interval);
        if (attempts > 100) {
          console.log('[SDKOverride] Timeout waiting for SDK');
        }
      }
    }, 50);
  }
})();