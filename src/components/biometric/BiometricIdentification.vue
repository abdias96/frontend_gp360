<template>
  <div class="biometric-identification">
    <!-- Header -->
    <div class="card mb-5">
      <div class="card-body">
        <h3 class="card-title">
          <i class="bi bi-search fs-1 me-2"></i>
          Identificación Biométrica 1:N
        </h3>
        <p class="text-muted">
          Buscar en toda la base de datos de internos usando huella dactilar
        </p>
        
        <!-- Estado del servicio -->
        <div class="alert" :class="serviceAvailable ? 'alert-success' : 'alert-warning'">
          <div class="d-flex align-items-center">
            <i class="bi fs-4 me-2" :class="serviceAvailable ? 'bi-check-circle' : 'bi-exclamation-triangle'"></i>
            <div>
              <strong>Estado del servicio:</strong>
              {{ serviceAvailable ? 'Activo - Comparación de imágenes' : 'No disponible' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Panel de Captura -->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h4 class="card-title">Capturar Huella</h4>
          </div>
          <div class="card-body">
            <!-- Área de captura -->
            <div class="text-center mb-4">
              <div class="border rounded p-4" style="min-height: 300px;">
                <div v-if="!capturedFingerprint">
                  <i class="bi bi-fingerprint fs-1 text-muted"></i>
                  <p class="text-muted mt-2">Esperando captura...</p>
                </div>
                <div v-else>
                  <img 
                    v-if="capturedFingerprint.startsWith('data:image')"
                    :src="capturedFingerprint"
                    alt="Huella capturada"
                    style="max-height: 250px;"
                    class="mb-2"
                  />
                  <div v-else>
                    <i class="bi bi-fingerprint fs-1 text-success"></i>
                    <p>Template capturado</p>
                  </div>
                  <div>
                    <span class="badge badge-success">Huella Lista</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Botones de captura -->
            <div class="d-flex gap-2 mb-4">
              <button
                @click="captureFingerprint"
                :disabled="isProcessing"
                class="btn btn-primary flex-fill"
              >
                <i class="bi bi-camera"></i>
                {{ capturedFingerprint ? 'Recapturar' : 'Capturar' }}
              </button>
              
              <button
                @click="simulateCapture"
                :disabled="isProcessing"
                class="btn btn-light"
                title="Usar huella de prueba"
              >
                <i class="bi bi-cpu"></i>
                Simular
              </button>
            </div>
            
            <!-- Botón de búsqueda -->
            <button
              @click="performIdentification"
              :disabled="!capturedFingerprint || isProcessing"
              class="btn btn-success btn-lg w-100"
            >
              <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-search me-2"></i>
              Buscar en Base de Datos
            </button>
          </div>
        </div>
      </div>

      <!-- Panel de Resultados -->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h4 class="card-title">Resultado de Búsqueda</h4>
          </div>
          <div class="card-body">
            <!-- Sin resultados -->
            <div v-if="!lastResult" class="text-center text-muted py-5">
              <i class="bi bi-person-x fs-1"></i>
              <p class="mt-2">Capture una huella para buscar</p>
            </div>
            
            <!-- Resultado encontrado -->
            <div v-else-if="lastResult.found" class="alert alert-success">
              <h5 class="alert-heading">
                <i class="bi bi-check-circle"></i>
                ¡Interno Identificado!
              </h5>
              
              <div class="mt-3">
                <div class="d-flex align-items-center mb-3">
                  <div class="symbol symbol-60px me-3">
                    <img :src="'/media/avatars/blank.png'" alt="" />
                  </div>
                  <div>
                    <div class="fw-bold fs-4">{{ lastResult.inmate_name }}</div>
                    <div class="badge badge-light-primary">
                      ID: {{ lastResult.inmate_id }}
                    </div>
                    <div v-if="lastResult.inmate_code" class="text-muted">
                      Código: {{ lastResult.inmate_code }}
                    </div>
                  </div>
                </div>
                
                <div class="row text-muted">
                  <div class="col-6">
                    <small>Dedo:</small>
                    <div>{{ getFingerName(lastResult.finger_type) }}</div>
                  </div>
                  <div class="col-6">
                    <small>Coincidencia:</small>
                    <div>{{ (lastResult.score * 100).toFixed(1) }}%</div>
                  </div>
                </div>
                
                <div class="mt-3">
                  <small class="text-muted">Método: {{ lastResult.method }}</small>
                </div>
                
                <!-- Acciones -->
                <div class="mt-4">
                  <router-link 
                    :to="`/inmates/${lastResult.inmate_id}`"
                    class="btn btn-primary"
                  >
                    <i class="bi bi-person"></i>
                    Ver Perfil
                  </router-link>
                </div>
              </div>
            </div>
            
            <!-- No encontrado -->
            <div v-else class="alert alert-warning">
              <h5 class="alert-heading">
                <i class="bi bi-exclamation-triangle"></i>
                No se encontraron coincidencias
              </h5>
              <p class="mb-0 mt-2">
                {{ lastResult.message || 'La huella no coincide con ningún registro en la base de datos' }}
              </p>
            </div>
            
            <!-- Estadísticas de búsqueda -->
            <div v-if="searchStats" class="mt-4 pt-4 border-top">
              <h6>Estadísticas de búsqueda</h6>
              <div class="row text-muted small">
                <div class="col-6">
                  <i class="bi bi-database"></i>
                  Registros revisados: {{ searchStats.total || 0 }}
                </div>
                <div class="col-6">
                  <i class="bi bi-clock"></i>
                  Tiempo: {{ searchStats.time || 0 }}ms
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBiometricMatching } from '@/composables/useBiometricMatching'
// @ts-ignore - TODO: Create SimpleFingerprintService if needed
// import { simpleFingerprintService } from '@/core/services/SimpleFingerprintService'

const {
  isProcessing,
  serviceAvailable,
  checkServiceStatus,
  identifyFingerprint,
  simulateFingerCapture
} = useBiometricMatching()

// Estado
const capturedFingerprint = ref('')
const lastResult = ref<any>(null)
const searchStats = ref<any>(null)

// Métodos
const captureFingerprint = async () => {
  try {
    // Aquí iría la captura real del SDK
    console.log('Capturando huella...')
    
    // Por ahora simular
    capturedFingerprint.value = simulateFingerCapture()
    lastResult.value = null
  } catch (error) {
    console.error('Error capturando huella:', error)
  }
}

const simulateCapture = () => {
  capturedFingerprint.value = simulateFingerCapture()
  lastResult.value = null
}

const performIdentification = async () => {
  if (!capturedFingerprint.value) return
  
  const startTime = Date.now()
  
  // Llamar a identificación 1:N
  const result = await identifyFingerprint(capturedFingerprint.value)
  
  lastResult.value = result
  searchStats.value = {
    total: result.total_checked || 86, // Total de huellas en la BD
    time: Date.now() - startTime
  }
}

const getFingerName = (fingerType: string): string => {
  const names: Record<string, string> = {
    'right_thumb': 'Pulgar Derecho',
    'right_index': 'Índice Derecho',
    'right_middle': 'Medio Derecho',
    'right_ring': 'Anular Derecho',
    'right_pinky': 'Meñique Derecho',
    'left_thumb': 'Pulgar Izquierdo',
    'left_index': 'Índice Izquierdo',
    'left_middle': 'Medio Izquierdo',
    'left_ring': 'Anular Izquierdo',
    'left_pinky': 'Meñique Izquierdo'
  }
  return names[fingerType] || fingerType
}

// Lifecycle
onMounted(async () => {
  await checkServiceStatus()
})
</script>

<style scoped>
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

.symbol-60px {
  width: 60px;
  height: 60px;
}
</style>