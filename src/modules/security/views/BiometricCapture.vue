<template>
  <div class="biometric-capture-page">
    <!-- Page header -->
    <div class="row g-5 g-xl-10 mb-5">
      <div class="col-12">
        <div class="card">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">Captura Biométrica</span>
              <span class="text-muted mt-1 fw-semibold fs-7">
                PPL: {{ inmateData?.first_name }} {{ inmateData?.last_name }} - {{ inmateData?.identification_number }}
              </span>
            </h3>
            <div class="card-toolbar">
              <button
                type="button"
                class="btn btn-light-primary me-3"
                @click="router.back()"
              >
                <KTIcon icon-name="arrow-left" icon-class="fs-3" />
                Regresar
              </button>
            </div>
          </div>
          
          <div class="card-body">
            <!-- Service Status and Quality -->
            <div class="row mb-5">
              <div class="col-md-6">
                <label class="form-label">Estado del Servicio</label>
                <div class="alert" :class="serviceAvailable ? 'alert-success' : 'alert-warning'">
                  <i class="fas me-2" :class="serviceAvailable ? 'fa-check-circle' : 'fa-exclamation-triangle'"></i>
                  {{ serviceAvailable ? 'BiometricService Activo' : 'Modo Simulación' }}
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Calidad de Captura</label>
                <input
                  type="text"
                  v-model="captureQuality"
                  class="form-control"
                  readonly
                  :class="getQualityClass()"
                  placeholder="Sin captura"
                />
              </div>
            </div>

            <!-- Status Messages -->
            <div v-if="statusMessage" class="alert" :class="statusClass" role="alert">
              {{ statusMessage }}
            </div>

            <!-- Instructions -->
            <div class="alert alert-info mb-5">
              <h5 class="alert-heading">
                <i class="fas fa-info-circle me-2"></i>
                Instrucciones
              </h5>
              <ol class="mb-0">
                <li>Haga clic en "Capturar TODAS las Huellas" para lanzar el BiometricService</li>
                <li>El sistema abrirá la aplicación de captura biométrica</li>
                <li>Siga las instrucciones en pantalla para capturar las 10 huellas dactilares</li>
                <li>Una vez completado, los datos se sincronizarán automáticamente</li>
              </ol>
            </div>

            <!-- Fingerprint Status Display -->
            <div class="row">
              <!-- Left Hand -->
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header">
                    <h4 class="card-title">Mano Izquierda</h4>
                  </div>
                  <div class="card-body">
                    <div class="fingerprint-grid">
                      <div
                        v-for="finger in leftHandFingers"
                        :key="finger.type"
                        class="finger-box"
                        :class="{
                          'captured': capturedFingers[finger.type]
                        }"
                      >
                        <div class="finger-icon">
                          <i class="fas fa-fingerprint fs-2x"></i>
                        </div>
                        <div class="finger-label">{{ finger.label }}</div>
                        <div v-if="capturedFingers[finger.type]" class="captured-indicator">
                          <i class="fas fa-check-circle text-success"></i>
                        </div>
                        <button
                          v-if="capturedFingers[finger.type]"
                          type="button"
                          class="btn btn-sm btn-light-info view-btn"
                          @click.stop="viewCapturedFinger(finger.type)"
                          title="Ver huella capturada"
                        >
                          <i class="fas fa-eye"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Hand -->
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header">
                    <h4 class="card-title">Mano Derecha</h4>
                  </div>
                  <div class="card-body">
                    <div class="fingerprint-grid">
                      <div
                        v-for="finger in rightHandFingers"
                        :key="finger.type"
                        class="finger-box"
                        :class="{
                          'captured': capturedFingers[finger.type]
                        }"
                      >
                        <div class="finger-icon">
                          <i class="fas fa-fingerprint fs-2x"></i>
                        </div>
                        <div class="finger-label">{{ finger.label }}</div>
                        <div v-if="capturedFingers[finger.type]" class="captured-indicator">
                          <i class="fas fa-check-circle text-success"></i>
                        </div>
                        <button
                          v-if="capturedFingers[finger.type]"
                          type="button"
                          class="btn btn-sm btn-light-info view-btn"
                          @click.stop="viewCapturedFinger(finger.type)"
                          title="Ver huella capturada"
                        >
                          <i class="fas fa-eye"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <!-- Control Buttons -->
            <div class="row mt-5">
              <div class="col-md-12 text-center">
                <button
                  type="button"
                  class="btn btn-success btn-lg me-3"
                  :disabled="isCapturing || isProcessing"
                  @click="startCapture"
                >
                  <span v-if="isCapturing" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="fas fa-fingerprint me-2"></i>
                  {{ isCapturing ? 'Lanzando BiometricService...' : 'Capturar TODAS las Huellas' }}
                </button>

                <button
                  type="button"
                  class="btn btn-info btn-lg me-3"
                  :disabled="isCapturing || isProcessing"
                  @click="simulateAllFingerprints"
                >
                  <i class="fas fa-robot me-2"></i>
                  Simular Captura (Pruebas)
                </button>

                <button
                  type="button"
                  class="btn btn-secondary btn-lg"
                  @click="refreshStatus"
                  :disabled="isProcessing"
                >
                  <i class="fas fa-sync-alt me-2"></i>
                  Actualizar Estado
                </button>
              </div>
            </div>

            <!-- Progress Summary -->
            <div class="row mt-5">
              <div class="col-md-12">
                <div class="progress" style="height: 30px;">
                  <div 
                    class="progress-bar bg-success" 
                    role="progressbar" 
                    :style="`width: ${captureProgress}%`"
                    :aria-valuenow="captureProgress" 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  >
                    {{ capturedCount }} / 10 Huellas Capturadas
                  </div>
                </div>
                <div class="mt-3 text-center">
                  <span v-if="capturedCount >= 4" class="badge badge-success fs-6">
                    ✓ Mínimo requerido alcanzado (4 huellas)
                  </span>
                  <span v-else class="badge badge-warning fs-6">
                    Faltan {{ 4 - capturedCount }} huellas para el mínimo requerido
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal para visualizar huella capturada -->
    <div v-if="showCapturedModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedCapturedFinger?.label }}</h5>
            <button type="button" class="btn-close" @click="showCapturedModal = false"></button>
          </div>
          <div class="modal-body text-center">
            <div v-if="selectedCapturedFinger">
              <img 
                v-if="selectedCapturedFinger.fingerprint_template?.startsWith('data:image')"
                :src="selectedCapturedFinger.fingerprint_template" 
                alt="Huella capturada" 
                class="fingerprint-preview mb-3"
              />
              <div v-else class="template-indicator mb-3">
                <i class="fas fa-fingerprint fs-1 text-success"></i>
                <p>Plantilla biométrica almacenada</p>
              </div>
              
              <div class="text-start">
                <p><strong>Calidad:</strong> {{ selectedCapturedFinger.fingerprint_quality || 'No especificada' }}</p>
                <p><strong>Fecha de captura:</strong> {{ selectedCapturedFinger.capture_date ? new Date(selectedCapturedFinger.capture_date).toLocaleString() : 'No disponible' }}</p>
                <p><strong>Dispositivo:</strong> {{ selectedCapturedFinger.capture_device || 'No especificado' }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showCapturedModal = false">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ApiService from '@/core/services/ApiService';
import { useBiometricMatching } from '@/composables/useBiometricMatching';
import Swal from 'sweetalert2';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

// Composable de biometría
const {
  isProcessing,
  serviceAvailable,
  checkServiceStatus,
  registerFingerprint,
  simulateFingerCapture,
  captureFromReader
} = useBiometricMatching();

// State
const inmateId = ref(route.params.inmateId as string);
const inmateData = ref<any>(null);
const selectedFinger = ref('');
const isCapturing = ref(false);
const currentCapture = ref<any>(null);
const capturedFingers = ref<Record<string, boolean>>({});
const capturedFingerData = ref<Record<string, any>>({});
const captureQuality = ref('');
const statusMessage = ref('');
const statusClass = ref('alert-info');
const showCapturedModal = ref(false);
const selectedCapturedFinger = ref<any>(null);
const pollingInterval = ref<any>(null);

// Finger definitions
const leftHandFingers = [
  { type: 'left_thumb', label: 'Pulgar' },
  { type: 'left_index', label: 'Índice' },
  { type: 'left_middle', label: 'Medio' },
  { type: 'left_ring', label: 'Anular' },
  { type: 'left_pinky', label: 'Meñique' }
];

const rightHandFingers = [
  { type: 'right_thumb', label: 'Pulgar' },
  { type: 'right_index', label: 'Índice' },
  { type: 'right_middle', label: 'Medio' },
  { type: 'right_ring', label: 'Anular' },
  { type: 'right_pinky', label: 'Meñique' }
];

// Computed
const capturedCount = computed(() => {
  return Object.values(capturedFingers.value).filter(v => v).length;
});

const captureProgress = computed(() => {
  return (capturedCount.value / 10) * 100;
});

// Methods
const loadInmateData = async () => {
  try {
    const response = await ApiService.get(`/inmates/${inmateId.value}`);
    inmateData.value = response.data.data;
  } catch (error) {
    console.error('Error loading inmate data:', error);
  }
};

const loadBiometricStatus = async () => {
  try {
    const response = await ApiService.get(`/inmates/${inmateId.value}/biometric-status`);
    const status = response.data;
    
    // Mark already captured fingers
    if (status.captured_fingers) {
      status.captured_fingers.forEach((finger: string) => {
        capturedFingers.value[finger] = true;
      });
    }
  } catch (error) {
    console.error('Error loading biometric status:', error);
  }
};

const loadBiometricData = async () => {
  try {
    const response = await ApiService.get(`/inmates/${inmateId.value}/biometric-data`);
    if (response.data.success && response.data.data) {
      response.data.data.forEach((biometric: any) => {
        capturedFingerData.value[biometric.finger_type] = biometric;
      });
    }
  } catch (error) {
    console.error('Error loading biometric data:', error);
  }
};

const viewCapturedFinger = (fingerType: string) => {
  const fingerData = capturedFingerData.value[fingerType];
  if (fingerData) {
    selectedCapturedFinger.value = {
      ...fingerData,
      label: getCurrentFingerLabel(fingerType)
    };
    showCapturedModal.value = true;
  }
};

const initializeService = async () => {
  try {
    showStatus('Verificando servicio biométrico...', 'info');

    const available = await checkServiceStatus();

    if (available) {
      showStatus('Servicio biométrico disponible', 'success');
    } else {
      showStatus('Servicio biométrico no disponible. Puede usar el modo simulación.', 'warning');
    }
  } catch (error) {
    console.error('Error verificando servicio:', error);
    showStatus('Error al verificar el servicio de huellas', 'danger');
  }
};


const selectFinger = (fingerType: string) => {
  selectedFinger.value = fingerType;
  currentCapture.value = null;
  showStatus(`Dedo seleccionado: ${getCurrentFingerLabel()}`, 'info');
};

const getCurrentFingerLabel = (fingerType?: string) => {
  const targetFinger = fingerType || selectedFinger.value;
  const allFingers = [...leftHandFingers, ...rightHandFingers];
  const finger = allFingers.find(f => f.type === targetFinger);
  const hand = targetFinger.startsWith('left') ? 'Izquierda' : 'Derecha';
  return finger ? `${finger.label} - Mano ${hand}` : '';
};


const startCapture = async () => {
  try {
    isCapturing.value = true;
    showStatus('Lanzando servicio biométrico...', 'info');

    // Obtener la URL del protocolo desde el backend
    const response = await ApiService.get(`/inmates/${inmateId.value}/biometric/protocol-url`);

    if (response.data.success) {
      const protocolUrl = response.data.data.protocol_url;

      // Abrir el protocolo URL que lanzará el BiometricService
      window.location.href = protocolUrl;

      showStatus('BiometricService lanzado. Complete el proceso de captura.', 'success');

      // Iniciar polling para verificar cuando se completa el enrollment
      startEnrollmentPolling();
    } else {
      throw new Error('No se pudo generar la URL del protocolo');
    }
  } catch (error: any) {
    console.error('Error iniciando captura:', error);
    showStatus(`Error: ${error.message}`, 'danger');

    // Fallback a simulación
    await Swal.fire({
      title: 'BiometricService no disponible',
      text: '¿Desea usar el modo simulación?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, simular',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        simulateCaptureData();
      }
    });
  } finally {
    isCapturing.value = false;
  }
};

const simulateAllFingerprints = async () => {
  try {
    isProcessing.value = true;
    showStatus('Simulando captura de todas las huellas...', 'info');

    const allFingers = [...rightHandFingers, ...leftHandFingers];

    for (const finger of allFingers) {
      const simulatedTemplate = simulateFingerCapture();
      const quality = Math.floor(Math.random() * 30) + 70;

      // Registrar cada huella simulada
      await registerFingerprint(
        parseInt(inmateId.value),
        finger.type,
        simulatedTemplate,
        quality
      );

      capturedFingers.value[finger.type] = true;

      // Pequeña pausa entre cada huella
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    showStatus('Todas las huellas simuladas han sido capturadas', 'success');
    await loadBiometricData();

    await Swal.fire({
      icon: 'success',
      title: 'Simulación Completada',
      text: 'Se han registrado las 10 huellas dactilares en modo simulación.'
    });
  } catch (error) {
    console.error('Error en simulación:', error);
    showStatus('Error durante la simulación', 'danger');
  } finally {
    isProcessing.value = false;
  }
};

const refreshStatus = async () => {
  try {
    isProcessing.value = true;
    showStatus('Actualizando estado...', 'info');

    await loadBiometricStatus();
    await loadBiometricData();

    showStatus('Estado actualizado', 'success');
  } catch (error) {
    console.error('Error actualizando estado:', error);
    showStatus('Error al actualizar estado', 'danger');
  } finally {
    isProcessing.value = false;
  }
};

const stopCapture = () => {
  isCapturing.value = false;
};

const saveFingerprint = async () => {
  if (!currentCapture.value) {
    showStatus('No hay huella para guardar', 'warning');
    return;
  }

  try {
    // Registrar la huella usando el composable
    const fingerprintData = currentCapture.value.fingerprint_template;
    const quality = parseInt(captureQuality.value) || currentCapture.value.quality || 80;

    const success = await registerFingerprint(
      parseInt(inmateId.value),
      selectedFinger.value,
      fingerprintData,
      quality
    );

    if (success) {
      capturedFingers.value[selectedFinger.value] = true;
      capturedFingerData.value[selectedFinger.value] = {
        ...currentCapture.value,
        capture_date: new Date().toISOString(),
        capture_device: serviceAvailable.value ? 'DigitalPersona' : 'Simulado'
      };
      currentCapture.value = null;
      captureQuality.value = '';
      selectedFinger.value = '';

      // Auto-seleccionar el siguiente dedo no capturado
      selectNextFinger();

      // Recargar datos biométricos
      await loadBiometricData();
    }
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo guardar la huella dactilar'
    });
  }
};

const selectNextFinger = () => {
  const allFingers = [...rightHandFingers, ...leftHandFingers];
  const nextFinger = allFingers.find(f => !capturedFingers.value[f.type]);
  
  if (nextFinger) {
    selectFinger(nextFinger.type);
  } else {
    showStatus('Todas las huellas han sido capturadas', 'success');
  }
};

const clearCapture = () => {
  currentCapture.value = null;
  captureQuality.value = '';
  showStatus('Captura limpiada', 'info');
};

const showStatus = (message: string, type: 'info' | 'success' | 'warning' | 'danger') => {
  statusMessage.value = message;
  statusClass.value = `alert-${type}`;
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (statusMessage.value === message) {
      statusMessage.value = '';
    }
  }, 5000);
};

const getQualityClass = () => {
  const quality = captureQuality.value.toLowerCase();
  if (quality.includes('good') || quality.includes('excellent')) {
    return 'bg-success text-white';
  } else if (quality.includes('fair')) {
    return 'bg-warning';
  } else if (quality.includes('poor')) {
    return 'bg-danger text-white';
  }
  return '';
};

const startEnrollmentPolling = () => {
  // Poll every 3 seconds to check if enrollment is complete
  pollingInterval.value = setInterval(async () => {
    try {
      const response = await ApiService.get(`/inmates/${inmateId.value}/biometric/enrollment-status`);

      if (response.data.success) {
        const status = response.data.data;

        // Update captured fingers based on enrollment status
        status.enrolled_fingers.forEach((finger: string) => {
          capturedFingers.value[finger] = true;
        });

        // Check if there are new enrollments since last check
        const previousCount = Object.keys(capturedFingers.value).length;
        if (status.total_enrolled > previousCount) {
          showStatus(`${status.total_enrolled} huellas capturadas`, 'success');
          await loadBiometricData(); // Reload biometric data
        }

        // Stop polling if complete or after 5 minutes
        if (status.is_complete) {
          stopEnrollmentPolling();
          showStatus('¡Enrollment completo! Todas las huellas han sido capturadas.', 'success');
          await Swal.fire({
            icon: 'success',
            title: 'Proceso Completado',
            text: 'El enrolamiento biométrico se ha completado exitosamente.'
          });
        }
      }
    } catch (error) {
      console.error('Error checking enrollment status:', error);
    }
  }, 3000); // Check every 3 seconds

  // Auto-stop after 5 minutes
  setTimeout(() => {
    stopEnrollmentPolling();
  }, 300000);
};

const stopEnrollmentPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
    pollingInterval.value = null;
  }
};

// Lifecycle
onMounted(async () => {
  await loadInmateData();
  await loadBiometricStatus();
  await loadBiometricData();
  await initializeService();

  // Check if returning from BiometricService
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('enrollment') === 'complete') {
    showStatus('Enrollment completado, verificando datos...', 'info');
    await loadBiometricData();
  }
});

onUnmounted(() => {
  stopEnrollmentPolling();
});
</script>

<style scoped>
.fingerprint-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 15px;
  padding: 20px;
}

.finger-box {
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: white;
}

.finger-box:hover {
  border-color: #007bff;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.finger-box.selected {
  border-color: #007bff;
  background: #e3f2fd;
}

.finger-box.captured {
  border-color: #28a745;
  background: #d4edda;
}

.finger-icon {
  font-size: 2rem;
  color: #6c757d;
  margin-bottom: 5px;
}

.finger-box.captured .finger-icon {
  color: #28a745;
}

.finger-label {
  font-size: 0.9rem;
  font-weight: 500;
}

.captured-indicator {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 1.2rem;
}

.view-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  padding: 2px 6px;
  font-size: 0.75rem;
  z-index: 10;
}

.fingerprint-preview {
  max-width: 300px;
  max-height: 400px;
  border: 2px solid #dee2e6;
  border-radius: 10px;
  padding: 10px;
  background: white;
}

.template-indicator {
  padding: 40px;
  color: #28a745;
}

.progress {
  background-color: #e9ecef;
}
</style>