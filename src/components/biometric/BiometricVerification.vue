<template>
  <div class="biometric-verification">
    <!-- Header -->
    <div class="card mb-5">
      <div class="card-body">
        <h3 class="card-title">
          <i class="bi bi-shield-check fs-1 me-2"></i>
          Verificación Biométrica 1:1
        </h3>
        <p class="text-muted">
          Verificar la identidad de un interno comparando su huella con las registradas
        </p>
        
        <!-- Estado del servicio -->
        <div class="alert" :class="serviceAvailable ? 'alert-success' : 'alert-warning'">
          <div class="d-flex align-items-center">
            <i class="bi" :class="serviceAvailable ? 'bi-check-circle' : 'bi-exclamation-triangle'" class="fs-4 me-2"></i>
            <div>
              <strong>Modo:</strong>
              {{ serviceAvailable ? 'Matching DPFP Activo' : 'Comparación Básica' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Panel Izquierdo: Selección de Interno -->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h4 class="card-title">1. Seleccionar Interno</h4>
          </div>
          <div class="card-body">
            <!-- Búsqueda -->
            <div class="mb-4">
              <label class="form-label">Buscar interno</label>
              <input 
                v-model="searchQuery"
                @input="searchInmates"
                type="text"
                class="form-control"
                placeholder="Código o nombre..."
              />
            </div>
            
            <!-- Lista de resultados -->
            <div v-if="searchResults.length > 0" class="mb-4">
              <label class="form-label">Resultados</label>
              <div class="list-group">
                <button
                  v-for="inmate in searchResults"
                  :key="inmate.id"
                  @click="selectInmate(inmate)"
                  class="list-group-item list-group-item-action"
                  :class="{ 'active': selectedInmate?.id === inmate.id }"
                >
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-40px me-3">
                      <img :src="inmate.photo || '/media/avatars/blank.png'" alt="" />
                    </div>
                    <div>
                      <div class="fw-bold">{{ inmate.full_name }}</div>
                      <div class="text-muted small">{{ inmate.inmate_code }}</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            
            <!-- Interno seleccionado -->
            <div v-if="selectedInmate" class="border rounded p-3">
              <h5>Interno Seleccionado</h5>
              <div class="d-flex align-items-center mt-3">
                <div class="symbol symbol-60px me-3">
                  <img :src="selectedInmate.photo || '/media/avatars/blank.png'" alt="" />
                </div>
                <div>
                  <div class="fw-bold">{{ selectedInmate.full_name }}</div>
                  <div class="badge badge-light-primary">{{ selectedInmate.inmate_code }}</div>
                  <div class="text-muted small mt-1">
                    <i class="bi bi-fingerprint"></i>
                    {{ registeredCount }} huella(s) registrada(s)
                  </div>
                </div>
              </div>
              
              <!-- Huellas registradas -->
              <div v-if="registeredFingerprints.length > 0" class="mt-3">
                <label class="form-label">Huellas disponibles:</label>
                <div class="d-flex flex-wrap gap-1">
                  <span
                    v-for="fp in registeredFingerprints"
                    :key="fp.id"
                    class="badge badge-light-success"
                  >
                    {{ getFingerName(fp.finger_type) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel Derecho: Captura y Verificación -->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h4 class="card-title">2. Capturar y Verificar</h4>
          </div>
          <div class="card-body">
            <!-- Área de captura -->
            <div class="text-center mb-4">
              <div class="border rounded p-4" style="min-height: 250px;">
                <div v-if="!capturedFingerprint">
                  <i class="bi bi-fingerprint fs-1 text-muted"></i>
                  <p class="text-muted mt-2">Coloque el dedo en el lector</p>
                </div>
                <div v-else>
                  <img 
                    :src="capturedFingerprint"
                    alt="Huella capturada"
                    style="max-height: 200px;"
                    class="mb-2"
                  />
                  <div>
                    <span class="badge badge-info">Huella Capturada</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Botones de captura -->
            <div class="d-flex gap-2 mb-4">
              <button
                @click="captureFingerprint"
                :disabled="!selectedInmate || isProcessing"
                class="btn btn-primary flex-fill"
              >
                <i class="bi bi-camera"></i>
                {{ capturedFingerprint ? 'Recapturar' : 'Capturar' }}
              </button>
              
              <button
                @click="loadFromFile"
                :disabled="!selectedInmate || isProcessing"
                class="btn btn-light"
              >
                <i class="bi bi-upload"></i>
              </button>
            </div>
            
            <!-- Botón de verificación -->
            <button
              @click="performVerification"
              :disabled="!capturedFingerprint || !selectedInmate || isProcessing"
              class="btn btn-success btn-lg w-100"
            >
              <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-shield-check me-2"></i>
              Verificar Identidad
            </button>
            
            <!-- Resultado de verificación -->
            <div v-if="lastVerificationResult" class="mt-4">
              <div 
                class="alert"
                :class="lastVerificationResult.verified ? 'alert-success' : 'alert-danger'"
              >
                <h5 class="alert-heading">
                  <i class="bi" :class="lastVerificationResult.verified ? 'bi-check-circle' : 'bi-x-circle'"></i>
                  {{ lastVerificationResult.verified ? 'Verificación Exitosa' : 'Verificación Fallida' }}
                </h5>
                
                <div v-if="lastVerificationResult.verified">
                  <p class="mb-1">✅ La huella coincide con el registro</p>
                  <div class="small">
                    <div>Dedo: {{ lastVerificationResult.finger_type }}</div>
                    <div>Score: {{ (lastVerificationResult.score * 100).toFixed(2) }}%</div>
                    <div>Método: {{ lastVerificationResult.method }}</div>
                  </div>
                </div>
                <div v-else>
                  <p>❌ {{ lastVerificationResult.message || 'La huella no coincide' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input oculto para archivos -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileUpload"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBiometricMatching } from '@/composables/useBiometricMatching'
import axios from 'axios'

const {
  isProcessing,
  serviceAvailable,
  checkServiceStatus,
  verifyFingerprint,
  getInmateBiometrics,
  simulateFingerCapture
} = useBiometricMatching()

// Estado
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const selectedInmate = ref<any>(null)
const registeredFingerprints = ref<any[]>([])
const capturedFingerprint = ref('')
const lastVerificationResult = ref<any>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Computed
const registeredCount = computed(() => registeredFingerprints.value.length)

// Métodos
const searchInmates = async () => {
  if (searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }
  
  try {
    const response = await axios.get('/api/inmates/search', {
      params: { q: searchQuery.value, limit: 10 }
    })
    searchResults.value = response.data.data
  } catch (error) {
    console.error('Error buscando internos:', error)
  }
}

const selectInmate = async (inmate: any) => {
  selectedInmate.value = inmate
  lastVerificationResult.value = null
  
  // Cargar huellas registradas
  const biometrics = await getInmateBiometrics(inmate.id)
  if (biometrics) {
    registeredFingerprints.value = biometrics.biometrics.filter((b: any) => b.is_active)
  }
}

const captureFingerprint = () => {
  // En producción, integrar con SDK del lector
  capturedFingerprint.value = simulateFingerCapture()
  lastVerificationResult.value = null
}

const loadFromFile = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    capturedFingerprint.value = e.target?.result as string
    lastVerificationResult.value = null
  }
  reader.readAsDataURL(file)
}

const performVerification = async () => {
  if (!selectedInmate.value || !capturedFingerprint.value) return
  
  const result = await verifyFingerprint(
    selectedInmate.value.id,
    capturedFingerprint.value
  )
  
  lastVerificationResult.value = result
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

onMounted(async () => {
  await checkServiceStatus()
})
</script>

<style scoped>
.biometric-verification {
  max-width: 1400px;
  margin: 0 auto;
}

.symbol {
  display: inline-block;
  flex-shrink: 0;
  position: relative;
  border-radius: 0.475rem;
  overflow: hidden;
}

.symbol img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.symbol-40px {
  width: 40px;
  height: 40px;
}

.symbol-60px {
  width: 60px;
  height: 60px;
}
</style>