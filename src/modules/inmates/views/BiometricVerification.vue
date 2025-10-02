<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-5">
      <div>
        <h1 class="fs-2 fw-bold text-gray-900">Verificación Biométrica 1:N</h1>
        <p class="text-gray-600 fs-6 mt-1">
          Detectar reincidentes mediante verificación biométrica antes del ingreso
        </p>
      </div>
      
      <div class="d-flex gap-3">
        <button 
          class="btn btn-sm btn-light-primary"
          @click="showStats = true"
        >
          <i class="ki-outline ki-chart-simple fs-4 me-2"></i>
          Estadísticas
        </button>
        
        <button 
          class="btn btn-sm btn-primary"
          @click="startNewVerification"
        >
          <i class="ki-outline ki-fingerprint-scanning fs-4 me-2"></i>
          Nueva Verificación
        </button>
      </div>
    </div>


    <!-- Verification Options -->
    <div v-if="!verificationInProgress">
      <!-- Search Methods Tabs -->
      <ul class="nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-5 fs-6">
        <li class="nav-item">
          <a 
            class="nav-link active" 
            data-bs-toggle="tab" 
            href="#biometric-search"
          >
            <i class="ki-outline ki-fingerprint-scanning fs-4 me-2"></i>
            Búsqueda Biométrica
          </a>
        </li>
        <li class="nav-item">
          <a 
            class="nav-link" 
            data-bs-toggle="tab" 
            href="#document-search"
          >
            <i class="ki-outline ki-profile-user fs-4 me-2"></i>
            Búsqueda por Documento
          </a>
        </li>
        <li class="nav-item">
          <a 
            class="nav-link" 
            data-bs-toggle="tab" 
            href="#name-search"
          >
            <i class="ki-outline ki-user-search fs-4 me-2"></i>
            Búsqueda por Nombres
          </a>
        </li>
      </ul>

      <!-- Tab Content -->
      <div class="tab-content" id="verificationsTabContent">
        <!-- Biometric Search Tab -->
        <div class="tab-pane fade show active" id="biometric-search">
          <!-- Nota para ambiente de producción -->
          <div v-if="!isLocalDevelopment && !javaServiceAvailable" class="alert alert-info mb-5">
            <div class="d-flex align-items-start">
              <i class="ki-duotone ki-information fs-2x text-info me-4">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
              <div>
                <h4 class="mb-2">Servicio Biométrico Local Requerido</h4>
                <p class="mb-2">
                  Para utilizar la verificación biométrica, necesita ejecutar el servicio Java localmente en su computadora.
                </p>
                <ol class="mb-2">
                  <li>Descargue e instale el BiometricService en su computadora</li>
                  <li>Conecte el lector de huellas DigitalPersona</li>
                  <li>Ejecute el servicio con: <code>java -jar BiometricService.jar</code></li>
                  <li>El servicio se conectará automáticamente en el puerto 8080</li>
                </ol>
                <p class="mb-0 text-muted">
                  <small>Nota: El servicio debe ejecutarse en la misma computadora donde está el lector de huellas.</small>
                </p>
              </div>
            </div>
          </div>
          
          <div class="row g-5">
            <!-- Fingerprint Verification -->
            <div class="col-md-6">
              <div class="card h-100 border-hover">
                <div class="card-body p-7">
                  <div class="text-center mb-5">
                    <i class="ki-duotone ki-fingerprint-scanning text-primary fs-3x mb-4">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                    </i>
                    <h3 class="fw-bold">Verificación Dactilar</h3>
                    <p class="text-gray-600">
                      Búsqueda rápida mediante huella dactilar en toda la base de datos
                    </p>
                    <div class="badge badge-light-warning">
                      Sistema Java BiometricService
                    </div>
                  </div>
                  
                  <button
                    class="btn btn-primary w-100"
                    @click="startFingerprintVerification"
                    :disabled="verificationInProgress || isServiceLoading"
                  >
                    <span v-if="verificationInProgress" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="ki-outline ki-fingerprint-scanning fs-4 me-2"></i>
                    {{ verificationInProgress ? 'Verificando...' : 'Iniciar Escaneo Dactilar' }}
                  </button>
                  
                  <div class="text-center mt-3 text-muted fs-7">
                    Requiere BiometricService.jar ejecutándose
                  </div>
                </div>
              </div>
            </div>

            <!-- Facial Recognition -->
            <div class="col-md-6">
              <div class="card h-100 border-hover opacity-50">
                <div class="card-body p-7">
                  <div class="text-center mb-5">
                    <i class="ki-duotone ki-face-id text-gray-400 fs-3x mb-4">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                    </i>
                    <h3 class="fw-bold">Reconocimiento Facial</h3>
                    <p class="text-gray-600">
                      No disponible - Calidad de fotos insuficiente
                    </p>
                    <div class="badge badge-light-danger">
                      En desarrollo
                    </div>
                  </div>
                  
                  <button 
                    class="btn btn-secondary w-100"
                    disabled
                  >
                    <i class="ki-outline ki-camera fs-4 me-2"></i>
                    No Disponible
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Document Search Tab -->
        <div class="tab-pane fade" id="document-search">
          <div class="card">
            <div class="card-body p-7">
              <h3 class="fw-bold mb-5">Búsqueda por Documento de Identificación</h3>
              
              <div class="row g-5">
                <div class="col-md-6">
                  <label class="form-label required">Tipo de Documento</label>
                  <select 
                    v-model="searchData.documentType" 
                    class="form-select"
                  >
                    <option value="">Seleccione tipo de documento</option>
                    <option value="DPI">DPI - Documento Personal de Identificación</option>
                    <option value="PASSPORT">Pasaporte</option>
                    <option value="BIRTH_CERTIFICATE">Partida de Nacimiento</option>
                    <option value="OTHER">Otro</option>
                  </select>
                </div>
                
                <div class="col-md-6">
                  <label class="form-label required">Número de Documento</label>
                  <input 
                    v-model="searchData.documentNumber"
                    type="text" 
                    class="form-control" 
                    placeholder="Ingrese el número de documento"
                  />
                </div>
              </div>
              
              <div class="d-flex justify-content-end mt-5">
                <button 
                  class="btn btn-primary"
                  @click="searchByDocument"
                  :disabled="!searchData.documentType || !searchData.documentNumber"
                >
                  <i class="ki-outline ki-search-list fs-4 me-2"></i>
                  Buscar PPL
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Name Search Tab -->
        <div class="tab-pane fade" id="name-search">
          <div class="card">
            <div class="card-body p-7">
              <h3 class="fw-bold mb-5">Búsqueda por Nombres y Apellidos</h3>
              
              <div class="row g-5">
                <div class="col-md-6">
                  <label class="form-label">Primer Nombre</label>
                  <input 
                    v-model="searchData.firstName"
                    type="text" 
                    class="form-control" 
                    placeholder="Ingrese el primer nombre"
                  />
                </div>
                
                <div class="col-md-6">
                  <label class="form-label">Segundo Nombre</label>
                  <input 
                    v-model="searchData.secondName"
                    type="text" 
                    class="form-control" 
                    placeholder="Ingrese el segundo nombre (opcional)"
                  />
                </div>
                
                <div class="col-md-6">
                  <label class="form-label">Primer Apellido</label>
                  <input 
                    v-model="searchData.firstSurname"
                    type="text" 
                    class="form-control" 
                    placeholder="Ingrese el primer apellido"
                  />
                </div>
                
                <div class="col-md-6">
                  <label class="form-label">Segundo Apellido</label>
                  <input 
                    v-model="searchData.secondSurname"
                    type="text" 
                    class="form-control" 
                    placeholder="Ingrese el segundo apellido (opcional)"
                  />
                </div>
                
                <div class="col-md-6">
                  <label class="form-label">Apellido de Casada</label>
                  <input 
                    v-model="searchData.marriedSurname"
                    type="text" 
                    class="form-control" 
                    placeholder="Ingrese el apellido de casada (opcional)"
                  />
                </div>
                
                <div class="col-md-6">
                  <label class="form-label">Fecha de Nacimiento</label>
                  <input 
                    v-model="searchData.birthDate"
                    type="date" 
                    class="form-control"
                  />
                </div>
              </div>
              
              <div class="separator separator-dashed my-5"></div>
              
              <div class="alert alert-light-primary d-flex align-items-center p-3">
                <i class="ki-outline ki-information-5 fs-2 text-primary me-3"></i>
                <div class="fs-7">
                  Puede buscar ingresando cualquier combinación de nombres. Se requiere al menos un nombre o apellido.
                </div>
              </div>
              
              <div class="d-flex justify-content-end mt-5">
                <button 
                  class="btn btn-primary"
                  @click="searchByName"
                  :disabled="!canSearchByName"
                >
                  <i class="ki-outline ki-search-list fs-4 me-2"></i>
                  Buscar PPL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Verification Process -->
    <div v-if="verificationInProgress" class="card">
      <div class="card-body p-7">
        <!-- Progress Steps -->
        <div class="stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid">
          <!-- Step 1: Capture -->
          <div class="d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px">
            <div class="stepper-nav ps-lg-10">
              <div class="stepper-item" :class="{ current: currentStep === 1, completed: currentStep > 1 }">
                <div class="stepper-wrapper">
                  <div class="stepper-icon w-40px h-40px">
                    <i class="stepper-check fas fa-check"></i>
                    <span class="stepper-number">1</span>
                  </div>
                  <div class="stepper-label">
                    <h3 class="stepper-title">Captura</h3>
                    <div class="stepper-desc">Capturar biometría</div>
                  </div>
                </div>
                <div class="stepper-line h-40px"></div>
              </div>

              <div class="stepper-item" :class="{ current: currentStep === 2, completed: currentStep > 2 }">
                <div class="stepper-wrapper">
                  <div class="stepper-icon w-40px h-40px">
                    <i class="stepper-check fas fa-check"></i>
                    <span class="stepper-number">2</span>
                  </div>
                  <div class="stepper-label">
                    <h3 class="stepper-title">Búsqueda</h3>
                    <div class="stepper-desc">Verificar en BD</div>
                  </div>
                </div>
                <div class="stepper-line h-40px"></div>
              </div>

              <div class="stepper-item" :class="{ current: currentStep === 3, completed: currentStep > 3 }">
                <div class="stepper-wrapper">
                  <div class="stepper-icon w-40px h-40px">
                    <i class="stepper-check fas fa-check"></i>
                    <span class="stepper-number">3</span>
                  </div>
                  <div class="stepper-label">
                    <h3 class="stepper-title">Resultado</h3>
                    <div class="stepper-desc">Mostrar coincidencias</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Content Area -->
          <div class="flex-row-fluid">
            <!-- Step 1: Capture -->
            <div v-if="currentStep === 1" class="current">
              <div class="w-100">
                <h4 class="fw-bold mb-5">Capturar Huella Dactilar</h4>
                
                <div class="text-center py-10">
                  <i class="ki-duotone ki-fingerprint-scanning text-primary fs-5x mb-5">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                  </i>
                  
                  <p class="fs-5 text-gray-700 mb-5">
                    El sistema Java abrirá una ventana de captura
                  </p>
                  
                  <p class="text-muted mb-5">
                    Coloque el dedo en el lector cuando se le indique
                  </p>
                  
                  <div class="alert alert-light-primary d-inline-flex align-items-center p-3">
                    <i class="ki-outline ki-information-5 fs-4 text-primary me-3"></i>
                    <span class="fs-7">La captura se realiza mediante BiometricService.jar con el lector DigitalPersona</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Searching -->
            <div v-if="currentStep === 2" class="current">
              <div class="w-100 text-center">
                <h4 class="fw-bold mb-5">Buscando Coincidencias</h4>
                
                <div class="py-10">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Buscando...</span>
                  </div>
                  <div class="mt-5">
                    <p class="text-gray-600">Verificando en base de datos...</p>
                    <p class="text-muted fs-7">
                      Comparando con {{ stats.totalTemplates }} huellas registradas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: Results -->
            <div v-if="currentStep === 3" class="current">
              <div class="w-100">
                <h4 class="fw-bold mb-5">Resultados de Verificación</h4>
                
                <!-- Match Found -->
                <div v-if="verificationResult && verificationResult.found" class="alert alert-danger d-flex align-items-start">
                  <i class="ki-outline ki-shield-cross fs-2x text-danger me-4"></i>
                  <div class="flex-grow-1">
                    <h4 class="alert-heading">¡Reincidente Detectado!</h4>
                    <p>Se encontró una coincidencia en la base de datos del sistema.</p>
                    
                    <div class="separator separator-dashed my-5"></div>
                    
                    <div class="d-flex align-items-center mb-5">
                      <div class="symbol symbol-100px symbol-circle me-5">
                        <img :src="verificationResult.photo || '/media/avatars/blank.png'" alt="Foto"/>
                      </div>
                      <div class="flex-grow-1">
                        <a href="#" class="text-gray-800 text-hover-primary fs-5 fw-bold">
                          {{ verificationResult.inmate_name }}
                        </a>
                        <span class="badge badge-light-danger ms-2">{{ verificationResult.inmate_code }}</span>
                        <div class="text-muted fs-7 fw-semibold mt-1">
                          <i class="ki-outline ki-fingerprint-scanning fs-6 me-1"></i>
                          Coincidencia: {{ (verificationResult.score * 100).toFixed(2) }}%
                        </div>
                        <div class="text-muted fs-7 fw-semibold">
                          <i class="ki-outline ki-technology fs-6 me-1"></i>
                          Método: {{ verificationResult.method }}
                        </div>
                      </div>
                    </div>
                    
                    <div class="d-flex">
                      <a :href="`/inmates/${verificationResult.inmate_id}`" class="btn btn-danger me-3">
                        <i class="ki-outline ki-user fs-4 me-2"></i>
                        Ver Perfil Completo
                      </a>
                      <button @click="startNewVerification" class="btn btn-light-danger">
                        <i class="ki-outline ki-arrows-circle fs-4 me-2"></i>
                        Nueva Verificación
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- No Match -->
                <div v-else-if="verificationResult && !verificationResult.found" class="alert alert-success d-flex align-items-start">
                  <i class="ki-outline ki-shield-tick fs-2x text-success me-4"></i>
                  <div class="flex-grow-1">
                    <h4 class="alert-heading">Sin Coincidencias</h4>
                    <p>No se encontraron registros previos de esta persona en el sistema.</p>
                    <p class="text-muted fs-7 mb-0">
                      {{ verificationResult.message || 'La persona puede proceder con el proceso de ingreso.' }}
                    </p>
                    
                    <div class="separator separator-dashed my-5"></div>
                    
                    <div class="d-flex">
                      <button @click="proceedToAdmission" class="btn btn-success me-3">
                        <i class="ki-outline ki-user-tick fs-4 me-2"></i>
                        Proceder con Ingreso
                      </button>
                      <button @click="startNewVerification" class="btn btn-light-success">
                        <i class="ki-outline ki-arrows-circle fs-4 me-2"></i>
                        Nueva Verificación
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Error -->
                <div v-else-if="verificationError" class="alert alert-warning">
                  <h4 class="alert-heading">Error en Verificación</h4>
                  <p>{{ verificationError }}</p>
                  <button @click="retryVerification" class="btn btn-warning mt-3">
                    <i class="ki-outline ki-arrows-circle fs-4 me-2"></i>
                    Reintentar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Modal -->
    <div class="modal fade" :class="{ show: showStats }" :style="{ display: showStats ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Estadísticas del Sistema</h3>
            <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" @click="showStats = false">
              <i class="ki-outline ki-cross fs-1"></i>
            </div>
          </div>
          <div class="modal-body">
            <div class="row g-5">
              <div class="col-6">
                <div class="bg-light rounded p-4">
                  <div class="fs-7 text-muted">Total Internos</div>
                  <div class="fs-3 fw-bold">{{ stats.totalInmates }}</div>
                </div>
              </div>
              <div class="col-6">
                <div class="bg-light rounded p-4">
                  <div class="fs-7 text-muted">Con Biométricos</div>
                  <div class="fs-3 fw-bold text-primary">{{ stats.withBiometrics }}</div>
                </div>
              </div>
              <div class="col-6">
                <div class="bg-light rounded p-4">
                  <div class="fs-7 text-muted">Total Huellas</div>
                  <div class="fs-3 fw-bold text-success">{{ stats.totalTemplates }}</div>
                </div>
              </div>
              <div class="col-6">
                <div class="bg-light rounded p-4">
                  <div class="fs-7 text-muted">Verificaciones Hoy</div>
                  <div class="fs-3 fw-bold text-info">{{ stats.verificationsToday }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="showStats = false">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useJavaBiometric } from '@/composables/useJavaBiometric'
import Swal from 'sweetalert2'
import axios from 'axios'

// Configurar axios con la URL base de la API
axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:8000/api'

// Agregar el token de autenticación si existe
const token = localStorage.getItem('access_token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

const router = useRouter()

// Composables
const {
  isServiceAvailable: javaServiceAvailable,
  isCapturing,
  checkServiceStatus: checkJavaStatus,
  launchBiometricCapture,
  launchBiometricVerification,
  startFingerprintCapture,
  verifyOneToMany,
  initializeDevice,
  getStatistics
} = useJavaBiometric()

// State
const verificationInProgress = ref(false)
const verificationType = ref<'fingerprint' | 'facial' | 'document' | 'name'>('fingerprint')
const currentStep = ref(1)
const isBiometricReady = ref(false)
const showStats = ref(false)
const verificationResult = ref<any>(null)
const verificationError = ref('')
const capturedFingerprint = ref('') // Variable para almacenar la huella capturada
const searchResults = ref<any[]>([])
const isSearching = ref(false)
const isServiceLoading = ref(false)
const isBuildingService = ref(false)
const serviceStatus = ref<any>(null)
const isLocalDevelopment = ref(import.meta.env.DEV || window.location.hostname === 'localhost')
const searchData = ref({
  // Document search
  documentType: '',
  documentNumber: '',
  // Name search
  firstName: '',
  secondName: '',
  firstSurname: '',
  secondSurname: '',
  marriedSurname: '',
  birthDate: ''
})
const stats = ref({
  totalInmates: 0,
  withBiometrics: 0,
  totalTemplates: 0,
  verificationsToday: 0
})

// Methods
const startNewVerification = () => {
  verificationInProgress.value = false // Corregido: .value en lugar de .ref
  currentStep.value = 1
  verificationResult.value = null
  verificationError.value = ''
  capturedFingerprint.value = ''
}

const startFingerprintVerification = async () => {
  verificationType.value = 'fingerprint'
  verificationInProgress.value = true
  currentStep.value = 1
  verificationResult.value = null
  verificationError.value = ''

  try {
    // Lanzar el servicio de verificación biométrica 1:N
    const result = await launchBiometricVerification()

    if (result.success) {
      // Resetear el estado ya que la verificación ocurre en la app Java
      verificationInProgress.value = false
      currentStep.value = 1
    } else {
      throw new Error(result.message || 'No se pudo lanzar la aplicación de verificación')
    }
  } catch (error: any) {
    verificationError.value = error.message || 'Error al lanzar la aplicación de verificación'
    currentStep.value = 3
    verificationInProgress.value = false

    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: verificationError.value
    })
  }
}

const startFacialVerification = () => {
  verificationType.value = 'facial'
  verificationInProgress.value = true
  currentStep.value = 1
  verificationResult.value = null
  verificationError.value = ''
  
  Swal.fire({
    icon: 'info',
    title: 'Próximamente',
    text: 'El reconocimiento facial estará disponible en la próxima versión'
  })
  verificationInProgress.value = false
}


const retryVerification = () => {
  currentStep.value = 1
  verificationError.value = ''
  verificationResult.value = null
}

const proceedToAdmission = () => {
  router.push('/operations/admission/new')
}

// Computed
const canSearchByName = computed(() => {
  return searchData.value.firstName || searchData.value.firstSurname || 
         searchData.value.secondName || searchData.value.secondSurname
})

// Search Methods
const searchByDocument = async () => {
  isSearching.value = true
  searchResults.value = []
  
  try {
    const response = await axios.post('/inmates/search-by-document', {
      document_type: searchData.value.documentType,
      document_number: searchData.value.documentNumber
    })
    
    if (response.data.success) {
      if (response.data.inmates && response.data.inmates.length > 0) {
        // Mostrar resultados
        showSearchResults(response.data.inmates)
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Sin Coincidencias',
          text: 'No se encontraron PPL con ese documento. Puede proceder con el registro.',
          confirmButtonText: 'Proceder con Ingreso'
        }).then((result) => {
          if (result.isConfirmed) {
            proceedToAdmission()
          }
        })
      }
    }
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Error al buscar PPL'
    })
  } finally {
    isSearching.value = false
  }
}

const searchByName = async () => {
  isSearching.value = true
  searchResults.value = []
  
  try {
    const searchParams: any = {}
    if (searchData.value.firstName) searchParams.first_name = searchData.value.firstName
    if (searchData.value.secondName) searchParams.second_name = searchData.value.secondName
    if (searchData.value.firstSurname) searchParams.first_surname = searchData.value.firstSurname
    if (searchData.value.secondSurname) searchParams.second_surname = searchData.value.secondSurname
    if (searchData.value.marriedSurname) searchParams.married_surname = searchData.value.marriedSurname
    if (searchData.value.birthDate) searchParams.birth_date = searchData.value.birthDate
    
    const response = await axios.post('/inmates/search-by-name', searchParams)
    
    if (response.data.success) {
      if (response.data.inmates && response.data.inmates.length > 0) {
        // Mostrar resultados
        showSearchResults(response.data.inmates)
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Sin Coincidencias',
          text: 'No se encontraron PPL con esos datos. Puede proceder con el registro.',
          confirmButtonText: 'Proceder con Ingreso'
        }).then((result) => {
          if (result.isConfirmed) {
            proceedToAdmission()
          }
        })
      }
    }
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Error al buscar PPL'
    })
  } finally {
    isSearching.value = false
  }
}

const showSearchResults = (inmates: any[]) => {
  searchResults.value = inmates
  
  // Crear HTML para mostrar los resultados
  let resultsHtml = '<div class="text-start">'
  resultsHtml += `<p class="mb-3">Se encontraron <strong>${inmates.length}</strong> coincidencias:</p>`
  resultsHtml += '<div class="mh-300px overflow-auto">'
  
  inmates.forEach((inmate: any) => {
    resultsHtml += `
      <div class="d-flex align-items-center p-3 border rounded mb-2">
        <div class="symbol symbol-50px me-3">
          <img src="${inmate.photo_url || '/media/avatars/blank.png'}" alt="Foto"/>
        </div>
        <div class="flex-grow-1">
          <div class="fw-bold">${inmate.full_name}</div>
          <div class="text-muted fs-7">
            ${inmate.identification_number} | ${inmate.internal_number}
          </div>
          <div class="text-muted fs-7">
            ${inmate.current_center} - ${inmate.status}
          </div>
        </div>
        <a href="/inmates/${inmate.id}" class="btn btn-sm btn-light-primary" target="_blank">
          Ver Perfil
        </a>
      </div>
    `
  })
  
  resultsHtml += '</div></div>'
  
  Swal.fire({
    icon: 'warning',
    title: '¡Posibles Coincidencias Encontradas!',
    html: resultsHtml,
    width: '600px',
    showCancelButton: true,
    confirmButtonText: 'Proceder de Todos Modos',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        text: '¿Está seguro que desea proceder con un nuevo ingreso a pesar de las coincidencias encontradas?',
        showCancelButton: true,
        confirmButtonText: 'Sí, Proceder',
        cancelButtonText: 'No, Revisar'
      }).then((confirmResult) => {
        if (confirmResult.isConfirmed) {
          proceedToAdmission()
        }
      })
    }
  })
}

const loadStats = async () => {
  // Obtener estadísticas del servicio Java solo si está disponible
  if (javaServiceAvailable.value) {
    const javaStats = await getStatistics()
    if (javaStats) {
      stats.value.totalTemplates = javaStats.total_templates || 0
      stats.value.withBiometrics = javaStats.inmates_with_biometrics || 0
      stats.value.verificationsToday = javaStats.verifications_today || 0
    }
  }
  
  // Obtener total de internos de la API
  try {
    const response = await axios.get('/inmates/count')
    if (response.data.success) {
      stats.value.totalInmates = response.data.count || 0
      // Si el servicio Java no está disponible, usar datos de la BD
      if (!javaServiceAvailable.value && response.data.breakdown) {
        stats.value.withBiometrics = response.data.breakdown.active || 0
      }
    }
  } catch (error: any) {
    // Solo mostrar error si no es un problema de conexión esperado
    if (error.response?.status !== 404) {
      console.error('Error al obtener conteo de internos:', error.message)
    }
    stats.value.totalInmates = 0
  }
}

// Service Control Methods
const checkServiceFullStatus = async () => {
  isServiceLoading.value = true
  try {
    const response = await axios.get('biometric-service/status')
    if (response.data.success) {
      serviceStatus.value = response.data
      javaServiceAvailable.value = response.data.operational || false
    }
  } catch (error) {
    console.error('Error al verificar estado del servicio:', error)
  } finally {
    isServiceLoading.value = false
  }
}

// Método obsoleto - el servicio ya no es HTTP, es una aplicación standalone
const startService = async () => {
  // Este método ya no se usa, ahora lanzamos directamente la aplicación Java
  // mediante startFingerprintVerification
  await startFingerprintVerification()
}

const buildService = async () => {
  const result = await Swal.fire({
    icon: 'question',
    title: '¿Compilar servicio?',
    text: 'Se ejecutará Build.ps1 para compilar el proyecto Java. El servicio se detendrá si está en ejecución.',
    showCancelButton: true,
    confirmButtonText: 'Sí, compilar',
    cancelButtonText: 'Cancelar'
  })
  
  if (!result.isConfirmed) return
  
  isBuildingService.value = true
  
  try {
    const response = await axios.post('biometric-service/build')
    
    if (response.data.success) {
      await Swal.fire({
        icon: 'success',
        title: '¡Compilación exitosa!',
        html: `
          <div class="text-start">
            <p><strong>JAR compilado:</strong> ${response.data.data?.jar_path || 'BiometricService.jar'}</p>
            ${response.data.data?.jar_size ? `<p><strong>Tamaño:</strong> ${(response.data.data.jar_size / 1024).toFixed(2)} KB</p>` : ''}
          </div>
        `,
        confirmButtonText: 'Aceptar'
      })
      
      // Actualizar estado del servicio
      await checkServiceFullStatus()
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Error en compilación',
        html: `
          <div class="text-start">
            <p>${response.data.message}</p>
            ${response.data.output ? `<pre class="mt-3" style="max-height: 300px; overflow-y: auto;">${response.data.output}</pre>` : ''}
          </div>
        `,
        confirmButtonText: 'Aceptar'
      })
    }
  } catch (error: any) {
    console.error('Error al compilar servicio:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'No se pudo compilar el servicio',
      confirmButtonText: 'Aceptar'
    })
  } finally {
    isBuildingService.value = false
  }
}

const stopService = async () => {
  const result = await Swal.fire({
    icon: 'warning',
    title: '¿Detener servicio?',
    text: 'Esto deshabilitará la verificación biométrica',
    showCancelButton: true,
    confirmButtonText: 'Sí, detener',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33'
  })
  
  if (!result.isConfirmed) return
  
  isServiceLoading.value = true
  
  try {
    const response = await axios.post('biometric-service/stop')
    
    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: 'Servicio Detenido',
        text: 'BiometricService se ha detenido correctamente',
        timer: 2000,
        showConfirmButton: false
      })
      
      // Actualizar estado
      javaServiceAvailable.value = false
      checkServiceFullStatus()
    }
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Error al detener el servicio'
    })
  } finally {
    isServiceLoading.value = false
  }
}

const showServiceLogs = async () => {
  try {
    const response = await axios.get('biometric-service/logs', {
      params: { lines: 30 }
    })
    
    if (response.data.success && response.data.logs) {
      const logsHtml = response.data.logs
        .map((line: string) => `<div class="text-start font-monospace small">${line}</div>`)
        .join('')
      
      Swal.fire({
        title: 'Logs del Servicio',
        html: `<div class="mh-400px overflow-auto">${logsHtml}</div>`,
        width: '800px',
        confirmButtonText: 'Cerrar'
      })
    }
  } catch (error) {
    console.error('Error al obtener logs:', error)
  }
}

// Lifecycle
onMounted(async () => {
  // Verificar estado completo del servicio
  await checkServiceFullStatus()
  
  // Verificar estado del servicio Java
  await checkJavaStatus()
  
  // Cargar estadísticas
  await loadStats()
  
  // Marcar como listo
  isBiometricReady.value = true
  
  console.log('BiometricVerification: Vista cargada, servicio Java:', javaServiceAvailable.value)
})
</script>

<style scoped>
.border-hover {
  transition: all 0.3s ease;
  cursor: pointer;
}

.border-hover:hover {
  border-color: var(--bs-primary) !important;
  box-shadow: 0 0 20px rgba(0, 123, 255, 0.1);
}

.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}

.stepper-item.current .stepper-wrapper {
  position: relative;
}

.stepper-item.completed .stepper-icon {
  background-color: var(--bs-success);
  color: white;
}

.stepper-item.current .stepper-icon {
  background-color: var(--bs-primary);
  color: white;
}
</style>