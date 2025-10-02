import { ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import ApiService from '@/core/services/ApiService'

export function useJavaBiometric() {
  const isServiceAvailable = ref(false)
  const isCapturing = ref(false)
  const captureSessionId = ref('')
  const pollingInterval = ref<number | null>(null)

  /**
   * Verificar el estado del servicio Java
   * Nota: El servicio Java es una aplicación de escritorio, no un servidor HTTP
   */
  const checkServiceStatus = async (): Promise<boolean> => {
    try {
      // Verificar si el proceso del servicio está corriendo
      const response = await ApiService.get('biometric-service/status')
      const isRunning = response.data.process?.running || false
      isServiceAvailable.value = isRunning

      if (!isServiceAvailable.value) {
        console.info('Servicio Java BiometricService no está ejecutándose. Se puede iniciar cuando sea necesario.')
      }

      return isServiceAvailable.value
    } catch (error: any) {
      console.debug('Estado del servicio:', error.message)
      isServiceAvailable.value = false
      return false
    }
  }
  
  /**
   * Generar ID de sesión único
   */
  const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  /**
   * Lanzar el servicio Java de captura biométrica usando protocolo personalizado
   */
  const launchBiometricCapture = async (inmateId: number, captureType: string = 'enrollment'): Promise<any> => {
    try {
      isCapturing.value = true

      // Lanzar el servicio Java apropiado según el tipo
      const endpoint = captureType === 'verification'
        ? 'biometric-service/launch-verification'
        : 'biometric-service/launch-enrollment'

      const response = await ApiService.post(endpoint, {
        inmate_id: inmateId,
        capture_type: captureType
      })

      if (response.data.success) {
        // Si es verificación, NO hacer polling porque es una app independiente
        if (captureType === 'verification') {
          isCapturing.value = false
          return {
            success: true,
            message: 'Aplicación de verificación lanzada exitosamente'
          }
        }

        // Para enrollment, mostrar mensaje y abrir protocolo
        const confirmResult = await Swal.fire({
          icon: 'info',
          title: 'Abrir Servicio Biométrico',
          html: `
            <div class="text-center">
              <p>Se abrirá la aplicación de captura de huellas dactilares.</p>
              <p class="text-muted mt-2"><strong>Instrucciones:</strong></p>
              <ol class="text-start">
                <li>El navegador solicitará permiso para abrir GP360 Biometric Service</li>
                <li>Haga clic en "Abrir" o "Permitir"</li>
                <li>Complete la captura de las 10 huellas dactilares</li>
                <li>Espere a que termine el proceso</li>
              </ol>
              <p class="text-muted small mt-3">Si no se abre automáticamente, asegúrese de que el servicio esté instalado en su equipo.</p>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: 'Abrir Servicio',
          cancelButtonText: 'Cancelar'
        })

        if (!confirmResult.isConfirmed) {
          isCapturing.value = false
          return { success: false, message: 'Cancelado por el usuario' }
        }

        // Abrir protocolo personalizado (lanzará la aplicación Java)
        if (response.data.data?.protocol_url) {
          // Crear un enlace temporal y hacer click programático
          const link = document.createElement('a')
          link.href = response.data.data.protocol_url
          link.target = '_blank'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          // Fallback: también intentar con window.location
          setTimeout(() => {
            window.location.href = response.data.data.protocol_url
          }, 100)
        }

        // Mostrar mensaje de monitoreo
        Swal.fire({
          icon: 'info',
          title: 'Servicio Biométrico Activo',
          html: `
            <div class="text-center">
              <div class="spinner-border text-primary mb-3" role="status">
                <span class="visually-hidden">Esperando...</span>
              </div>
              <p>La aplicación de captura debería haberse abierto.</p>
              <p class="text-muted">Esta ventana se cerrará automáticamente cuando complete la captura.</p>
            </div>
          `,
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          }
        })

        // Iniciar polling para detectar cuando termine
        return await pollForCaptureCompletion(inmateId)

      } else {
        throw new Error(response.data.message || 'Error al lanzar servicio')
      }
    } catch (error: any) {
      isCapturing.value = false

      const errorMessage = error.response?.data?.message || error.message || 'Error al lanzar servicio de captura'

      // Solo mostrar error si no es verificación
      if (captureType !== 'verification') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage
        })
      }

      throw error
    }
  }

  /**
   * Polling para verificar cuando se complete la captura
   */
  const pollForCaptureCompletion = async (inmateId: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      let attempts = 0
      const maxAttempts = 120 // 2 minutos máximo

      // Mostrar diálogo de espera
      Swal.fire({
        title: 'Esperando Captura',
        html: `
          <div class="text-center">
            <div class="spinner-border text-primary mb-3" role="status">
              <span class="visually-hidden">Esperando...</span>
            </div>
            <p>Esperando que complete la captura en la aplicación Java</p>
            <p class="text-muted">Este diálogo se cerrará automáticamente al finalizar</p>
          </div>
        `,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          // Iniciar polling
          pollingInterval.value = window.setInterval(async () => {
            attempts++

            try {
              const response = await ApiService.get('biometric-service/check-capture-status', '', {
                params: { inmate_id: inmateId }
              })

              if (response.data.capture_completed) {
                // Captura completada
                clearInterval(pollingInterval.value!)
                pollingInterval.value = null
                isCapturing.value = false
                Swal.close()

                await Swal.fire({
                  icon: 'success',
                  title: '¡Captura Completada!',
                  text: 'Las huellas dactilares se capturaron exitosamente'
                })

                resolve({
                  success: true,
                  data: response.data.data
                })
              } else if (attempts >= maxAttempts) {
                // Timeout
                clearInterval(pollingInterval.value!)
                pollingInterval.value = null
                isCapturing.value = false
                Swal.close()

                reject(new Error('Tiempo de espera agotado'))
              }
            } catch (error) {
              console.error('Error en polling:', error)
              // Continuar polling si hay error de red
            }
          }, 1000) // Verificar cada segundo
        },
        willClose: () => {
          // Limpiar interval si se cierra el diálogo
          if (pollingInterval.value) {
            clearInterval(pollingInterval.value)
            pollingInterval.value = null
          }
        }
      })
    })
  }

  /**
   * Iniciar captura de huella dactilar (método legacy para compatibilidad)
   */
  const startFingerprintCapture = async (fingerType: string = 'right_index', inmateId?: number): Promise<any> => {
    // Si se proporciona inmateId, usar el nuevo método
    if (inmateId) {
      return await launchBiometricCapture(inmateId, 'enrollment')
    }

    // Método legacy - intentar captura directa si el servicio responde como HTTP
    throw new Error('El servicio requiere un ID de interno para la captura')
  }
  
  /**
   * Lanzar aplicación de verificación biométrica 1:N usando protocolo personalizado
   * No requiere ID de interno ya que busca en toda la base de datos
   */
  const launchBiometricVerification = async (): Promise<any> => {
    try {
      const response = await ApiService.post('biometric-service/launch-verification')

      if (response.data.success) {
        const confirmResult = await Swal.fire({
          icon: 'info',
          title: 'Abrir Verificación Biométrica',
          html: `
            <div class="text-center">
              <p>Se abrirá la aplicación de verificación biométrica 1:N.</p>
              <p class="text-muted mt-2"><strong>Instrucciones:</strong></p>
              <ol class="text-start">
                <li>El navegador solicitará permiso para abrir GP360 Biometric Service</li>
                <li>Haga clic en "Abrir" o "Permitir"</li>
                <li>Coloque el dedo en el lector cuando se le indique</li>
                <li>La aplicación buscará coincidencias en toda la base de datos</li>
              </ol>
              <p class="text-muted small mt-3">Si no se abre automáticamente, asegúrese de que el servicio esté instalado en su equipo.</p>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: 'Abrir Servicio',
          cancelButtonText: 'Cancelar'
        })

        if (!confirmResult.isConfirmed) {
          return { success: false, message: 'Cancelado por el usuario' }
        }

        // Abrir protocolo personalizado (lanzará la aplicación Java)
        if (response.data.data?.protocol_url) {
          // Crear un enlace temporal y hacer click programático
          const link = document.createElement('a')
          link.href = response.data.data.protocol_url
          link.target = '_blank'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          // Fallback: también intentar con window.location
          setTimeout(() => {
            window.location.href = response.data.data.protocol_url
          }, 100)
        }

        return {
          success: true,
          message: 'Aplicación de verificación lanzada exitosamente'
        }
      } else {
        throw new Error(response.data.message || 'Error al lanzar servicio de verificación')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al lanzar servicio de verificación'

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage
      })

      throw error
    }
  }
  
  /**
   * Registrar huella dactilar
   */
  const enrollFingerprint = async (inmateId: number, sessionId: string, fingerType: string): Promise<any> => {
    try {
      const response = await axios.post('/java-biometric/enroll', {
        inmate_id: inmateId,
        session_id: sessionId,
        finger_type: fingerType
      })
      
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Huella Registrada',
          text: 'La huella dactilar se registró exitosamente'
        })
      }
      
      return response.data
    } catch (error: any) {
      console.error('Error al registrar huella:', error)
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al registrar huella dactilar'
      })
      
      throw error
    }
  }
  
  /**
   * Obtener estadísticas del servicio
   */
  const getStatistics = async (): Promise<any> => {
    try {
      // Solo intentar obtener estadísticas si el servicio está disponible
      if (!isServiceAvailable.value) {
        return null
      }
      
      const response = await axios.get('/java-biometric/statistics')
      return response.data.statistics
    } catch (error: any) {
      // Solo registrar error si no es 404/400 (servicio no disponible)
      if (error.response?.status !== 404 && error.response?.status !== 400) {
        console.warn('Error al obtener estadísticas:', error.message)
      }
      return null
    }
  }
  
  /**
   * Inicializar dispositivo biométrico
   */
  const initializeDevice = async (): Promise<boolean> => {
    try {
      const response = await axios.post('/java-biometric/device/initialize')
      
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Dispositivo Listo',
          text: 'El lector biométrico está listo para usar',
          timer: 2000,
          showConfirmButton: false
        })
        return true
      }
      
      return false
    } catch (error: any) {
      console.error('Error al inicializar dispositivo:', error)
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo inicializar el lector biométrico'
      })
      
      return false
    }
  }
  
  return {
    isServiceAvailable,
    isCapturing,
    captureSessionId,
    checkServiceStatus,
    launchBiometricCapture,
    launchBiometricVerification,
    startFingerprintCapture,
    enrollFingerprint,
    getStatistics,
    initializeDevice
  }
}