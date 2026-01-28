<template>
  <div class="biometric-registration">
    <!-- Header -->
    <div class="card mb-5">
      <div class="card-body">
        <h3 class="card-title">
          <i class="bi bi-fingerprint fs-1 me-2"></i>
          Registro de Huellas Dactilares
        </h3>
        <p class="text-muted">
          Sistema de captura y registro de huellas dactilares con conversión a templates DPFP
        </p>
        
        <!-- Estado del servicio -->
        <div class="alert" :class="serviceAvailable ? 'alert-success' : 'alert-warning'">
          <div class="d-flex align-items-center">
            <i class="bi" :class="serviceAvailable ? 'bi-check-circle' : 'bi-exclamation-triangle'" class="fs-4 me-2"></i>
            <div>
              <strong>Estado del servicio:</strong>
              {{ serviceAvailable ? 'Servicio de matching activo (Templates DPFP)' : 'Modo básico (Imágenes Base64)' }}
            </div>
            <button @click="checkService" class="btn btn-sm btn-light ms-auto">
              <i class="bi bi-arrow-clockwise"></i> Verificar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Selección de interno -->
    <div class="card mb-5" v-if="!selectedInmate">
      <div class="card-header">
        <h4 class="card-title">Seleccionar Interno</h4>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <label class="form-label">Buscar por código o nombre</label>
            <input 
              v-model="searchQuery"
              @input="searchInmates"
              type="text" 
              class="form-control"
              placeholder="Ingrese código o nombre..."
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">O seleccione de la lista</label>
            <select v-model="selectedInmateId" class="form-select">
              <option value="">-- Seleccione --</option>
              <option v-for="inmate in inmates" :key="inmate.id" :value="inmate.id">
                {{ inmate.inmate_code }} - {{ inmate.full_name }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="mt-3">
          <button 
            @click="selectInmate"
            :disabled="!selectedInmateId"
            class="btn btn-primary"
          >
            <i class="bi bi-person-check"></i> Seleccionar Interno
          </button>
        </div>
      </div>
    </div>

    <!-- Información del interno seleccionado -->
    <div class="card mb-5" v-if="selectedInmate">
      <div class="card-body">
        <div class="d-flex align-items-center">
          <div class="symbol symbol-50px me-3">
            <img :src="selectedInmate.photo || '/media/avatars/blank.png'" alt="Foto" />
          </div>
          <div class="flex-grow-1">
            <h5 class="mb-1">{{ selectedInmate.full_name }}</h5>
            <span class="badge badge-light-primary">{{ selectedInmate.inmate_code }}</span>
          </div>
          <button @click="selectedInmate = null" class="btn btn-sm btn-light">
            <i class="bi bi-x"></i> Cambiar
          </button>
        </div>
        
        <!-- Huellas registradas -->
        <div class="mt-4" v-if="registeredFingerprints.length > 0">
          <h6>Huellas Registradas:</h6>
          <div class="d-flex flex-wrap gap-2">
            <span 
              v-for="fp in registeredFingerprints" 
              :key="fp.id"
              class="badge"
              :class="fp.is_active ? 'badge-success' : 'badge-secondary'"
            >
              {{ getFingerName(fp.finger_type) }}
              <span v-if="fp.quality">(Q: {{ fp.quality }})</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Registro de nueva huella -->
    <div class="card" v-if="selectedInmate">
      <div class="card-header">
        <h4 class="card-title">Capturar Nueva Huella</h4>
      </div>
      <div class="card-body">
        <div class="row">
          <!-- Selección de dedo -->
          <div class="col-md-6">
            <label class="form-label required">Seleccione el dedo</label>
            <select v-model="selectedFinger" class="form-select">
              <option value="">-- Seleccione --</option>
              <optgroup label="Mano Derecha">
                <option value="pulgar_derecho">Pulgar Derecho</option>
                <option value="indice_derecho">Índice Derecho</option>
                <option value="medio_derecho">Medio Derecho</option>
                <option value="anular_derecho">Anular Derecho</option>
                <option value="menique_derecho">Meñique Derecho</option>
              </optgroup>
              <optgroup label="Mano Izquierda">
                <option value="pulgar_izquierdo">Pulgar Izquierdo</option>
                <option value="indice_izquierdo">Índice Izquierdo</option>
                <option value="medio_izquierdo">Medio Izquierdo</option>
                <option value="anular_izquierdo">Anular Izquierdo</option>
                <option value="menique_izquierdo">Meñique Izquierdo</option>
              </optgroup>
            </select>
          </div>
          
          <!-- Área de captura FMD -->
          <div class="col-md-6">
            <label class="form-label">Captura de Huella</label>
            <DirectFMDCapture 
              v-if="selectedFinger"
              mode="registration"
              @captured="onFMDCaptured"
              @error="onCaptureError"
            />
            <div v-else class="border rounded p-3 text-center" style="min-height: 300px;">
              <i class="bi bi-fingerprint fs-1 text-muted"></i>
              <p class="text-muted">Seleccione un dedo para capturar</p>
            </div>
          </div>
        </div>
        
        <!-- Botones de acción -->
        <div class="mt-5 d-flex gap-2">
          <button 
            @click="captureFromFile"
            :disabled="!selectedFinger || isProcessing"
            class="btn btn-light"
          >
            <i class="bi bi-upload"></i> Cargar Imagen (No recomendado)
          </button>
          
          <button 
            @click="saveFingerprint"
            :disabled="!capturedFingerprint || !selectedFinger || isProcessing"
            class="btn btn-success ms-auto"
          >
            <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-save"></i>
            Guardar Huella
          </button>
          
          <button 
            @click="clearCapture"
            :disabled="!capturedFingerprint"
            class="btn btn-light"
          >
            <i class="bi bi-trash"></i> Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- Input oculto para carga de archivos -->
    <input 
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none;"
      @change="handleFileUpload"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useBiometricMatching } from '@/composables/useBiometricMatching'
// @ts-ignore - DirectFMDCapture component is in development
import DirectFMDCapture from '@/components/biometric/DirectFMDCapture.vue'
import axios from 'axios'
import Swal from 'sweetalert2'

// Props
interface Props {
  inmateId?: number
}

const props = defineProps<Props>()

// Composable
const {
  isProcessing,
  serviceAvailable,
  checkServiceStatus,
  registerFingerprint,
  getInmateBiometrics,
  captureFromReader,
  simulateFingerCapture,
  convertToTemplate
} = useBiometricMatching()

// Estado
const selectedInmate = ref<any>(null)
const selectedInmateId = ref<number | null>(props.inmateId || null)
const searchQuery = ref('')
const inmates = ref<any[]>([])
const registeredFingerprints = ref<any[]>([])
const selectedFinger = ref('')
const capturedFingerprint = ref('')
const templateFormat = ref<'DPFP_TEMPLATE' | 'IMAGE_BASE64'>('IMAGE_BASE64')
const captureQuality = ref<number | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Métodos
const checkService = async () => {
  await checkServiceStatus()
}

const searchInmates = async () => {
  if (searchQuery.value.length < 2) return
  
  try {
    const response = await axios.get('/api/inmates/search', {
      params: { q: searchQuery.value }
    })
    inmates.value = response.data.data
  } catch (error) {
    console.error('Error buscando internos:', error)
  }
}

const selectInmate = async () => {
  if (!selectedInmateId.value) return
  
  try {
    const response = await axios.get(`/api/inmates/${selectedInmateId.value}`)
    selectedInmate.value = response.data.data
    
    // Cargar huellas registradas
    const biometrics = await getInmateBiometrics(selectedInmateId.value)
    if (biometrics) {
      registeredFingerprints.value = biometrics.biometrics
    }
  } catch (error) {
    console.error('Error seleccionando interno:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar la información del interno'
    })
  }
}

const onFMDCaptured = async (data: any) => {
  
  capturedFingerprint.value = data.template
  templateFormat.value = data.format
  captureQuality.value = data.quality
  
  // Auto-guardar si está habilitado
  // await saveFingerprint()
}

const onCaptureError = (error: string) => {
  console.error('FMD capture error:', error)
  Swal.fire({
    icon: 'error',
    title: 'Error de Captura',
    text: error
  })
}

const captureFromFile = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = async (e) => {
    capturedFingerprint.value = e.target?.result as string
    
    // Intentar convertir a template
    const template = await convertToTemplate(capturedFingerprint.value)
    if (template) {
      templateFormat.value = template.format
      captureQuality.value = template.quality || null
      
      if (template.format === 'DPFP_TEMPLATE') {
        capturedFingerprint.value = template.template
      }
    }
  }
  reader.readAsDataURL(file)
}

const saveFingerprint = async () => {
  if (!selectedInmate.value || !selectedFinger.value || !capturedFingerprint.value) {
    return
  }
  
  const success = await registerFingerprint(
    selectedInmate.value.id,
    selectedFinger.value,
    capturedFingerprint.value,
    captureQuality.value || undefined
  )
  
  if (success) {
    // Recargar huellas registradas
    const biometrics = await getInmateBiometrics(selectedInmate.value.id)
    if (biometrics) {
      registeredFingerprints.value = biometrics.biometrics
    }
    
    // Limpiar captura
    clearCapture()
  }
}

const clearCapture = () => {
  capturedFingerprint.value = ''
  templateFormat.value = 'IMAGE_BASE64'
  captureQuality.value = null
  selectedFinger.value = ''
}

const getFingerName = (fingerType: string): string => {
  const names: Record<string, string> = {
    'pulgar_derecho': 'Pulgar D',
    'indice_derecho': 'Índice D',
    'medio_derecho': 'Medio D',
    'anular_derecho': 'Anular D',
    'menique_derecho': 'Meñique D',
    'pulgar_izquierdo': 'Pulgar I',
    'indice_izquierdo': 'Índice I',
    'medio_izquierdo': 'Medio I',
    'anular_izquierdo': 'Anular I',
    'menique_izquierdo': 'Meñique I'
  }
  return names[fingerType] || fingerType
}

// Lifecycle
onMounted(async () => {
  await checkServiceStatus()
  
  // Si hay un interno preseleccionado
  if (props.inmateId) {
    selectedInmateId.value = props.inmateId
    await selectInmate()
  } else {
    // Cargar lista de internos
    try {
      const response = await axios.get('/api/inmates/simple-list')
      inmates.value = response.data.data
    } catch (error) {
      console.error('Error cargando internos:', error)
    }
  }
})
</script>

<style scoped>
.biometric-registration {
  max-width: 1200px;
  margin: 0 auto;
}
</style>