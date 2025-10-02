import { ref } from 'vue';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/auth';

export interface BiometricServiceOptions {
  enrollableId: number;
  enrollableType?: string;
  onComplete?: (success: boolean) => void;
  onError?: (error: Error) => void;
}

export function useBiometricService() {
  const isServiceRunning = ref(false);
  const authStore = useAuthStore();

  /**
   * Launch the Java biometric service for fingerprint capture using protocol handler
   */
  const launchBiometricService = async (options: BiometricServiceOptions) => {
    if (isServiceRunning.value) {
      Swal.fire({
        title: 'Servicio en ejecución',
        text: 'El servicio biométrico ya está en ejecución',
        icon: 'warning'
      });
      return;
    }

    try {
      // Show loading message
      Swal.fire({
        title: 'Preparando servicio biométrico',
        text: 'Generando enlace seguro...',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      isServiceRunning.value = true;

      // Call backend to get protocol URL
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/biometric-service/launch-enrollment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          inmate_id: options.enrollableId,
          capture_type: 'enrollment'
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Error al generar URL del servicio biométrico');
      }

      // Close loading and show instructions
      Swal.close();

      const confirmResult = await Swal.fire({
        title: 'Abrir Servicio Biométrico',
        html: `
          <div style="text-align: left;">
            <p>Se abrirá la aplicación de captura de huellas dactilares.</p>
            <p><strong>Instrucciones:</strong></p>
            <ol>
              <li>El navegador solicitará permiso para abrir GP360 Biometric Service</li>
              <li>Haga clic en "Abrir" o "Permitir"</li>
              <li>Complete la captura de las 10 huellas dactilares</li>
              <li>Espere a que termine el proceso</li>
            </ol>
            <p class="text-muted small mt-3">Si no se abre automáticamente, asegúrese de que el servicio esté instalado en su equipo.</p>
          </div>
        `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Abrir Servicio',
        cancelButtonText: 'Cancelar'
      });

      if (!confirmResult.isConfirmed) {
        isServiceRunning.value = false;
        return;
      }

      // Open protocol URL (will launch Java app)
      window.location.href = result.data.protocol_url;

      // Show monitoring message
      Swal.fire({
        title: 'Servicio Biométrico Activo',
        html: `
          <div style="text-align: left;">
            <p>La aplicación de captura debería haberse abierto.</p>
            <p><strong>Monitoreo en curso...</strong></p>
            <p class="text-muted">Esta ventana se cerrará automáticamente cuando complete la captura.</p>
          </div>
        `,
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Start polling for completion
      pollForCompletion(options.enrollableId, options);

    } catch (error) {
      console.error('Error launching biometric service:', error);
      isServiceRunning.value = false;

      Swal.fire({
        title: 'Error',
        text: error instanceof Error ? error.message : 'No se pudo iniciar el servicio biométrico',
        icon: 'error'
      });

      if (options.onError) {
        options.onError(error as Error);
      }
    }
  };

  /**
   * Launch service via WebSocket for web environment
   */
  const launchViaWebSocket = (params: any, options: BiometricServiceOptions) => {
    // Connect to local service launcher
    const ws = new WebSocket('ws://localhost:8765/biometric');
    
    ws.onopen = () => {
      ws.send(JSON.stringify({
        action: 'launch',
        params: params
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.status === 'started') {
        Swal.close();
        
        // Show info about the service
        Swal.fire({
          title: 'Servicio Biométrico Activo',
          html: `
            <div style="text-align: left;">
              <p>El servicio de captura biométrica está en ejecución.</p>
              <p><strong>Instrucciones:</strong></p>
              <ul>
                <li>Complete la captura de las 10 huellas dactilares</li>
                <li>Verifique la calidad de cada captura</li>
                <li>Presione "Guardar" cuando todas las huellas estén capturadas</li>
              </ul>
            </div>
          `,
          icon: 'info',
          confirmButtonText: 'Entendido'
        });
      } else if (data.status === 'completed') {
        handleServiceResult({ success: true }, options);
      } else if (data.status === 'error') {
        handleServiceResult({ success: false, error: data.error }, options);
      }
    };

    ws.onerror = () => {
      // Fallback to direct execution
      launchDirectExecution(params, options);
    };
  };

  /**
   * Direct execution fallback (requires local setup)
   */
  const launchDirectExecution = async (params: any, options: BiometricServiceOptions) => {
    Swal.close();
    
    // Show manual instructions
    const result = await Swal.fire({
      title: 'Iniciar Servicio Biométrico',
      html: `
        <div style="text-align: left;">
          <p>Para capturar las huellas dactilares, ejecute el siguiente comando en una terminal:</p>
          <div style="background: #f0f0f0; padding: 10px; border-radius: 5px; margin: 10px 0;">
            <code style="font-family: monospace;">
              cd BiometricService<br>
              run.bat ${params.enrollableId} "${params.enrollableType || 'App\\Models\\Inmate'}" "${params.apiToken}"
            </code>
          </div>
          <p>O haga doble clic en <strong>BiometricService/run.bat</strong></p>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Ya ejecuté el servicio',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      // Wait for service completion (poll the API)
      pollForCompletion(params.enrollableId, options);
    } else {
      isServiceRunning.value = false;
      if (options.onError) {
        options.onError(new Error('Cancelled by user'));
      }
    }
  };

  /**
   * Poll API to check if biometric data was saved
   */
  const pollForCompletion = async (enrollableId: number, options: BiometricServiceOptions) => {
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max

    const checkInterval = setInterval(async () => {
      attempts++;
      
      try {
        // Check inmate_biometric_data table for fingerprints
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/inmate-biometric-data?inmate_id=${enrollableId}&active_only=true`, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          
          // Check if we have 10 active fingerprints
          if (result.data && result.data.length >= 10) {
            clearInterval(checkInterval);
            handleServiceResult({ success: true }, options);
          }
        }
      } catch (error) {
        console.error('Error checking biometric status:', error);
      }

      if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        isServiceRunning.value = false;
        
        Swal.fire({
          title: 'Tiempo agotado',
          text: 'No se detectó la finalización del servicio biométrico',
          icon: 'warning'
        });
      }
    }, 5000); // Check every 5 seconds
  };

  /**
   * Handle service completion result
   */
  const handleServiceResult = (result: any, options: BiometricServiceOptions) => {
    isServiceRunning.value = false;

    if (result.success) {
      Swal.fire({
        title: '¡Éxito!',
        text: 'Las huellas dactilares se han guardado correctamente',
        icon: 'success'
      });

      if (options.onComplete) {
        options.onComplete(true);
      }
    } else {
      Swal.fire({
        title: 'Error',
        text: result.error || 'No se pudieron guardar las huellas dactilares',
        icon: 'error'
      });

      if (options.onComplete) {
        options.onComplete(false);
      }
    }
  };

  /**
   * Check if biometric service is available
   */
  const checkServiceAvailability = async (): Promise<boolean> => {
    try {
      // Check if Java is installed
      if (window.electronAPI) {
        return await window.electronAPI.checkJavaInstalled();
      }
      
      // Check WebSocket availability
      return new Promise((resolve) => {
        const ws = new WebSocket('ws://localhost:8765/biometric');
        ws.onopen = () => {
          ws.close();
          resolve(true);
        };
        ws.onerror = () => {
          resolve(false);
        };
        setTimeout(() => resolve(false), 2000);
      });
    } catch {
      return false;
    }
  };

  return {
    isServiceRunning,
    launchBiometricService,
    checkServiceAvailability
  };
}

// Type declaration for Electron API
declare global {
  interface Window {
    electronAPI?: {
      launchBiometricService: (params: any) => Promise<any>;
      checkJavaInstalled: () => Promise<boolean>;
    }
  }
}