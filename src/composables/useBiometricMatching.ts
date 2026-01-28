import { ref, computed } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'

// Configuración de servicios
const LARAVEL_API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const MATCHER_SERVICE = 'http://localhost:5000'

// Configurar axios con el token
const authStore = useAuthStore()
if (authStore.token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`
}

interface BiometricTemplate {
  template: string
  format: 'DPFP_TEMPLATE' | 'IMAGE_BASE64'
  quality?: number
}

interface VerificationResult {
  verified: boolean
  finger_type?: string
  score?: number
  quality?: number
  method?: string
  message?: string
}

interface IdentificationResult {
  found: boolean
  inmate_id?: number
  inmate_name?: string
  inmate_code?: string
  finger_type?: string
  score?: number
  method?: string
  message?: string
  total_checked?: number
}

interface ServiceStats {
  service_available: boolean
  matcher_url: string
  total_templates: number
  active_templates: number
  matcher_health?: any
}

export function useBiometricMatching() {
  const isProcessing = ref(false)
  const serviceAvailable = ref(false)
  const lastResult = ref<any>(null)
  const errorMessage = ref('')

  /**
   * Verificar estado del servicio de matching
   */
  const checkServiceStatus = async (): Promise<boolean> => {
    try {
      // Primero verificar servicio C#
      const matcherResponse = await axios.get(`${MATCHER_SERVICE}/api/health`, {
        timeout: 2000
      })
      
      if (matcherResponse.data.status === 'healthy') {
        serviceAvailable.value = true
        return true
      }
    } catch (error) {
      console.warn('⚠️ Servicio de matching C# no disponible, usando fallback de Laravel')
    }

    // Verificar servicio Laravel
    try {
      const laravelResponse = await axios.get(`${LARAVEL_API}/biometric/service-stats`)
      serviceAvailable.value = laravelResponse.data.data.service_available || false
      return serviceAvailable.value
    } catch (error) {
      console.error('❌ Error verificando servicios:', error)
      serviceAvailable.value = false
      return false
    }
  }

  /**
   * Convertir imagen base64 a template DPFP
   */
  const convertToTemplate = async (imageBase64: string): Promise<BiometricTemplate | null> => {
    try {
      isProcessing.value = true
      
      // Intentar conversión directa con servicio C#
      if (serviceAvailable.value) {
        try {
          const response = await axios.post(`${MATCHER_SERVICE}/api/convert-to-template`, {
            imageBase64: cleanBase64(imageBase64)
          })
          
          if (response.data.success) {
            return {
              template: response.data.template,
              format: 'DPFP_TEMPLATE',
              quality: response.data.quality
            }
          }
        } catch (error) {
          console.warn('Error convirtiendo con C#, intentando con Laravel:', error)
        }
      }
      
      // Fallback: mantener como imagen
      return {
        template: imageBase64,
        format: 'IMAGE_BASE64',
        quality: undefined
      }
    } catch (error) {
      console.error('Error convirtiendo template:', error)
      errorMessage.value = 'Error al procesar la huella dactilar'
      return null
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Registrar nueva huella dactilar
   */
  const registerFingerprint = async (
    inmateId: number,
    fingerType: string,
    fingerprintData: string,
    quality?: number
  ): Promise<boolean> => {
    try {
      isProcessing.value = true
      
      // Convertir a template si es posible
      const template = await convertToTemplate(fingerprintData)
      if (!template) {
        throw new Error('No se pudo procesar la huella')
      }
      
      // Registrar en Laravel
      const response = await axios.post(`${LARAVEL_API}/biometric/register`, {
        inmate_id: inmateId,
        finger_type: fingerType,
        fingerprint_data: template.template,
        quality: template.quality || quality
      })
      
      if (response.data.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Huella Registrada',
          text: `${fingerType} registrado exitosamente`,
          html: template.format === 'DPFP_TEMPLATE' 
            ? `<div>
                <p>✅ Template DPFP creado</p>
                <p>Calidad: ${template.quality || 'N/A'}</p>
              </div>`
            : '<p>⚠️ Almacenado como imagen (actualizar servicio para templates)</p>'
        })
        
        lastResult.value = response.data.data
        return true
      }
      
      throw new Error(response.data.message || 'Error al registrar')
    } catch (error: any) {
      console.error('Error registrando huella:', error)
      
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo registrar la huella'
      })
      
      return false
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Verificar huella 1:1 (comparar con huellas de un interno específico)
   */
  const verifyFingerprint = async (
    inmateId: number,
    capturedFingerprint: string,
    fingerType?: string
  ): Promise<VerificationResult> => {
    try {
      isProcessing.value = true
      
      // IMPORTANTE: Convertir imagen a template DPFP antes de enviar
      let templateToSend = cleanBase64(capturedFingerprint)
      
      // Verificar si el servicio C# está disponible para conversión
      const serviceOk = await checkServiceStatus()
      if (serviceOk) {
        try {
          const template = await convertToTemplate(capturedFingerprint)
          if (template && template.format === 'DPFP_TEMPLATE') {
            templateToSend = template.template
          } else {
            console.warn('Could not convert to DPFP template, using image')
          }
        } catch (error) {
          console.error('Error converting to template:', error)
        }
      }
      
      const response = await axios.post(`${LARAVEL_API}/biometric/verify`, {
        inmate_id: inmateId,
        fingerprint_data: templateToSend,
        finger_type: fingerType
      })
      
      const result = response.data.data
      lastResult.value = result
      
      if (result.verified) {
        await Swal.fire({
          icon: 'success',
          title: 'Verificación Exitosa',
          html: `
            <div class="text-left">
              <p><strong>✅ Huella verificada</strong></p>
              <p>Dedo: ${result.finger_type || 'N/A'}</p>
              <p>Score: ${(result.score * 100).toFixed(2)}%</p>
              <p>Método: ${result.method || 'N/A'}</p>
              ${result.quality ? `<p>Calidad: ${result.quality}</p>` : ''}
            </div>
          `
        })
      } else {
        await Swal.fire({
          icon: 'warning',
          title: 'Verificación Fallida',
          text: result.message || 'La huella no coincide con las registradas'
        })
      }
      
      return result
    } catch (error: any) {
      console.error('Error verificando huella:', error)
      
      const errorMsg = error.response?.data?.message || 'Error al verificar la huella'
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMsg
      })
      
      return {
        verified: false,
        message: errorMsg
      }
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Identificar huella 1:N (buscar en toda la base de datos)
   */
  const identifyFingerprint = async (
    capturedFingerprint: string,
    centerId?: number
  ): Promise<IdentificationResult> => {
    try {
      isProcessing.value = true
      
      // Mostrar progreso
      Swal.fire({
        title: 'Procesando huella...',
        html: 'Buscando coincidencias en la base de datos',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })
      
      // Limpiar el template/imagen antes de enviar
      let templateToSend = cleanBase64(capturedFingerprint)
      
      const response = await axios.post(`${LARAVEL_API}/biometric/identify`, {
        template: templateToSend,
        center_id: centerId
      })
      
      const result = response.data.data
      lastResult.value = result
      
      if (result.found) {
        await Swal.fire({
          icon: 'success',
          title: 'Persona Identificada',
          html: `
            <div class="text-left">
              <h4 class="font-bold">${result.inmate_name || 'Desconocido'}</h4>
              <p>Código: ${result.inmate_code || 'N/A'}</p>
              <p>ID: ${result.inmate_id}</p>
              <p>Dedo: ${result.finger_type || 'N/A'}</p>
              <p>Score: ${(result.score * 100).toFixed(2)}%</p>
              <p>Método: ${result.method || 'N/A'}</p>
            </div>
          `,
          confirmButtonText: 'Ver Perfil',
          showCancelButton: true,
          cancelButtonText: 'Cerrar'
        }).then((swalResult) => {
          if (swalResult.isConfirmed && result.inmate_id) {
            // Navegar al perfil del interno
            window.location.href = `/inmates/${result.inmate_id}`
          }
        })
      } else {
        await Swal.fire({
          icon: 'info',
          title: 'No Identificado',
          text: result.message || 'No se encontró coincidencia en la base de datos'
        })
      }
      
      return result
    } catch (error: any) {
      console.error('Error identificando huella:', error)
      
      Swal.close()
      
      const errorMsg = error.response?.data?.message || 'Error al identificar la huella'
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMsg
      })
      
      return {
        found: false,
        message: errorMsg
      }
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Obtener huellas registradas de un interno
   */
  const getInmateBiometrics = async (inmateId: number) => {
    try {
      const response = await axios.get(`${LARAVEL_API}/biometric/inmates/${inmateId}/biometrics`)
      return response.data.data
    } catch (error) {
      console.error('Error obteniendo biométricos:', error)
      return null
    }
  }

  /**
   * Obtener estadísticas del servicio
   */
  const getServiceStats = async (): Promise<ServiceStats | null> => {
    try {
      const response = await axios.get(`${LARAVEL_API}/biometric/service-stats`)
      return response.data.data
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      return null
    }
  }

  /**
   * Limpiar string base64
   */
  const cleanBase64 = (base64: string): string => {
    // Remover prefijo data:image si existe
    if (base64.includes(',')) {
      return base64.split(',')[1]
    }
    return base64
  }

  /**
   * Capturar huella directamente desde el lector (FMD real)
   */
  const captureFromReader = async (): Promise<{ template: string; format: string; quality: number } | null> => {
    try {
      isProcessing.value = true
      
      // Llamar al servicio C# para captura directa
      const response = await axios.post(`${MATCHER_SERVICE}/api/capture-from-reader`)
      
      if (response.data.success) {
        return {
          template: response.data.template,
          format: response.data.format,
          quality: response.data.quality
        }
      }
      
      throw new Error(response.data.error || 'Error capturando desde lector')
    } catch (error: any) {
      console.error('Error capturando desde lector:', error)
      errorMessage.value = error.response?.data?.error || 'No se pudo capturar desde el lector'
      
      await Swal.fire({
        icon: 'error',
        title: 'Error de Captura',
        text: errorMessage.value,
        footer: 'Asegúrese de que el lector esté conectado y funcionando'
      })
      
      return null
    } finally {
      isProcessing.value = false
    }
  }
  
  /**
   * Simular captura de huella (para desarrollo)
   */
  const simulateFingerCapture = (): string => {
    // Para simulación, generar un FMD fake pero con formato correcto
    // Un FMD real tiene típicamente 400-600 bytes
    // Generamos datos aleatorios del tamaño correcto
    
    const fmdSize = 512 // Tamaño típico de un FMD
    const bytes = new Uint8Array(fmdSize)
    
    // Simular header ANSI 378 (FMR)
    bytes[0] = 0x46 // F
    bytes[1] = 0x4D // M
    bytes[2] = 0x52 // R
    bytes[3] = 0x00
    
    // Llenar el resto con datos pseudo-aleatorios pero consistentes
    // Usar un seed fijo para que siempre genere el mismo "template"
    let seed = 12345
    for (let i = 4; i < fmdSize; i++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff
      bytes[i] = seed & 0xff
    }
    
    // Convertir a base64
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    
    const base64 = btoa(binary)
    
    return base64
  }

  return {
    // Estado
    isProcessing,
    serviceAvailable,
    lastResult,
    errorMessage,
    
    // Métodos
    checkServiceStatus,
    convertToTemplate,
    registerFingerprint,
    verifyFingerprint,
    identifyFingerprint,
    getInmateBiometrics,
    getServiceStats,
    captureFromReader,
    simulateFingerCapture,
    
    // Computed
    isReady: computed(() => !isProcessing.value && serviceAvailable.value)
  }
}