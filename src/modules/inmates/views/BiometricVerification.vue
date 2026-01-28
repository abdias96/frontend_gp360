<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-5">
      <div>
        <h1 class="fs-2 fw-bold text-gray-900">{{ t('biometric.verification.title') }}</h1>
        <p class="text-gray-600 fs-6 mt-1">
          {{ t('biometric.verification.subtitle') }}
        </p>
      </div>

      <div>
        <button
          class="btn btn-sm btn-primary"
          @click="resetView"
        >
          <i class="ki-outline ki-arrow-circle-left fs-4 me-2"></i>
          {{ t('biometric.verification.clearForm') }}
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
            {{ t('biometric.verification.tabs.biometric') }}
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            data-bs-toggle="tab"
            href="#document-search"
          >
            <i class="ki-outline ki-profile-user fs-4 me-2"></i>
            {{ t('biometric.verification.tabs.document') }}
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            data-bs-toggle="tab"
            href="#name-search"
          >
            <i class="ki-outline ki-user-search fs-4 me-2"></i>
            {{ t('biometric.verification.tabs.name') }}
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
                <h4 class="mb-2">{{ t('biometric.verification.service.localRequired') }}</h4>
                <p class="mb-2">
                  {{ t('biometric.verification.service.localRequiredDesc') }}
                </p>
                <ol class="mb-2">
                  <li>{{ t('biometric.verification.service.steps.download') }}</li>
                  <li>{{ t('biometric.verification.service.steps.connect') }}</li>
                  <li>{{ t('biometric.verification.service.steps.run') }} <code>java -jar BiometricService.jar</code></li>
                  <li>{{ t('biometric.verification.service.steps.autoConnect') }}</li>
                </ol>
                <p class="mb-0 text-muted">
                  <small>{{ t('biometric.verification.service.note') }}</small>
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
                    <h3 class="fw-bold">{{ t('biometric.verification.fingerprint.title') }}</h3>
                    <p class="text-gray-600">
                      {{ t('biometric.verification.fingerprint.description') }}
                    </p>
                    <div class="badge badge-light-warning">
                      {{ t('biometric.verification.service.javaSystem') }}
                    </div>
                  </div>

                  <button
                    class="btn btn-primary w-100"
                    @click="startFingerprintVerification"
                    :disabled="verificationInProgress || isServiceLoading"
                  >
                    <span v-if="verificationInProgress" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="ki-outline ki-fingerprint-scanning fs-4 me-2"></i>
                    {{ verificationInProgress ? t('biometric.verification.fingerprint.verifying') : t('biometric.verification.fingerprint.startScan') }}
                  </button>

                  <div class="text-center mt-3 text-muted fs-7">
                    {{ t('biometric.verification.service.requiresJar') }}
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
                    <h3 class="fw-bold">{{ t('biometric.verification.facial.title') }}</h3>
                    <p class="text-gray-600">
                      {{ t('biometric.verification.facial.notAvailable') }}
                    </p>
                    <div class="badge badge-light-danger">
                      {{ t('biometric.verification.facial.inDevelopment') }}
                    </div>
                  </div>

                  <button
                    class="btn btn-secondary w-100"
                    disabled
                  >
                    <i class="ki-outline ki-camera fs-4 me-2"></i>
                    {{ t('biometric.identification.serviceUnavailable') }}
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
              <h3 class="fw-bold mb-5">{{ t('biometric.verification.document.title') }}</h3>

              <div class="row g-5">
                <div class="col-md-12">
                  <label class="form-label required">{{ t('biometric.verification.document.label') }}</label>
                  <input
                    v-model="searchData.documentNumber"
                    type="text"
                    class="form-control form-control-lg"
                    :placeholder="t('biometric.verification.document.placeholder')"
                    @keyup.enter="searchByDocument"
                  />
                  <div class="form-text">
                    {{ t('biometric.verification.document.hint') }}
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-end mt-5">
                <button
                  class="btn btn-primary btn-lg"
                  @click="searchByDocument"
                  :disabled="!searchData.documentNumber || searchData.documentNumber.length < 3"
                >
                  <i class="ki-outline ki-search-list fs-4 me-2"></i>
                  {{ t('biometric.verification.document.searchPpl') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Name Search Tab -->
        <div class="tab-pane fade" id="name-search">
          <div class="card">
            <div class="card-body p-7">
              <h3 class="fw-bold mb-5">{{ t('biometric.verification.name.title') }}</h3>

              <div class="row g-5">
                <div class="col-md-6">
                  <label class="form-label">{{ t('biometric.verification.name.firstName') }}</label>
                  <input
                    v-model="searchData.firstName"
                    type="text"
                    class="form-control"
                    :placeholder="t('biometric.verification.name.firstNamePlaceholder')"
                    @keyup.enter="searchByName"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">{{ t('biometric.verification.name.middleName') }}</label>
                  <input
                    v-model="searchData.middleName"
                    type="text"
                    class="form-control"
                    :placeholder="t('biometric.verification.name.middleNamePlaceholder')"
                    @keyup.enter="searchByName"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">{{ t('biometric.verification.name.lastName') }}</label>
                  <input
                    v-model="searchData.lastName"
                    type="text"
                    class="form-control"
                    :placeholder="t('biometric.verification.name.lastNamePlaceholder')"
                    @keyup.enter="searchByName"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">{{ t('biometric.verification.name.secondLastName') }}</label>
                  <input
                    v-model="searchData.secondLastName"
                    type="text"
                    class="form-control"
                    :placeholder="t('biometric.verification.name.secondLastNamePlaceholder')"
                    @keyup.enter="searchByName"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">{{ t('biometric.verification.name.marriedSurname') }}</label>
                  <input
                    v-model="searchData.marriedSurname"
                    type="text"
                    class="form-control"
                    :placeholder="t('biometric.verification.name.marriedSurnamePlaceholder')"
                    @keyup.enter="searchByName"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">{{ t('biometric.verification.name.birthDate') }}</label>
                  <input
                    v-model="searchData.birthDate"
                    type="date"
                    class="form-control"
                  />
                </div>
              </div>

              <div class="separator separator-dashed my-5"></div>

              <div class="alert alert-light-info d-flex align-items-center p-3 mb-3">
                <i class="ki-outline ki-information-5 fs-2 text-info me-3"></i>
                <div class="fs-7">
                  <strong>{{ t('biometric.verification.name.flexibleSearch') }}</strong> {{ t('biometric.verification.name.flexibleSearchDesc') }}
                </div>
              </div>

              <div class="alert alert-light-primary d-flex align-items-center p-3">
                <i class="ki-outline ki-check-circle fs-2 text-primary me-3"></i>
                <div class="fs-7">
                  {{ t('biometric.verification.name.anyCombo') }}
                </div>
              </div>

              <div class="d-flex justify-content-end mt-5">
                <button
                  class="btn btn-primary btn-lg"
                  @click="searchByName"
                  :disabled="!canSearchByName"
                >
                  <i class="ki-outline ki-search-list fs-4 me-2"></i>
                  {{ t('biometric.verification.name.searchPpl') }}
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
                    <h3 class="stepper-title">{{ t('biometric.verification.process.step1') }}</h3>
                    <div class="stepper-desc">{{ t('biometric.verification.process.step1Desc') }}</div>
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
                    <h3 class="stepper-title">{{ t('biometric.verification.process.step2') }}</h3>
                    <div class="stepper-desc">{{ t('biometric.verification.process.step2Desc') }}</div>
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
                    <h3 class="stepper-title">{{ t('biometric.verification.process.step3') }}</h3>
                    <div class="stepper-desc">{{ t('biometric.verification.process.step3Desc') }}</div>
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
                <h4 class="fw-bold mb-5">{{ t('biometric.verification.process.captureFingerprint') }}</h4>

                <div class="text-center py-10">
                  <i class="ki-duotone ki-fingerprint-scanning text-primary fs-5x mb-5">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                  </i>

                  <p class="fs-5 text-gray-700 mb-5">
                    {{ t('biometric.verification.process.javaWindowInfo') }}
                  </p>

                  <p class="text-muted mb-5">
                    {{ t('biometric.verification.process.placeFingerInfo') }}
                  </p>

                  <div class="alert alert-light-primary d-inline-flex align-items-center p-3">
                    <i class="ki-outline ki-information-5 fs-4 text-primary me-3"></i>
                    <span class="fs-7">{{ t('biometric.verification.process.captureViaJava') }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Searching -->
            <div v-if="currentStep === 2" class="current">
              <div class="w-100 text-center">
                <h4 class="fw-bold mb-5">{{ t('biometric.verification.process.searchingMatches') }}</h4>

                <div class="py-10">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">{{ t('biometric.verification.process.searching') }}</span>
                  </div>
                  <div class="mt-5">
                    <p class="text-gray-600">{{ t('biometric.verification.process.verifyingInDb') }}</p>
                    <p class="text-muted fs-7">
                      {{ t('biometric.verification.process.comparingWith', { count: stats.totalTemplates }) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: Results -->
            <div v-if="currentStep === 3" class="current">
              <div class="w-100">
                <h4 class="fw-bold mb-5">{{ t('biometric.verification.process.verificationResults') }}</h4>
                
                <!-- Match Found -->
                <div v-if="verificationResult && verificationResult.found" class="alert alert-danger d-flex align-items-start">
                  <i class="ki-outline ki-shield-cross fs-2x text-danger me-4"></i>
                  <div class="flex-grow-1">
                    <h4 class="alert-heading">{{ t('biometric.verification.matchFound.title') }}</h4>
                    <p>{{ t('biometric.verification.matchFound.description') }}</p>

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
                          {{ t('biometric.verification.matchFound.matchScore', { score: (verificationResult.score * 100).toFixed(2) }) }}
                        </div>
                        <div class="text-muted fs-7 fw-semibold">
                          <i class="ki-outline ki-technology fs-6 me-1"></i>
                          {{ t('biometric.verification.matchFound.method') }} {{ verificationResult.method }}
                        </div>
                      </div>
                    </div>

                    <div class="d-flex">
                      <a :href="`/inmates/${verificationResult.inmate_id}`" class="btn btn-danger me-3">
                        <i class="ki-outline ki-user fs-4 me-2"></i>
                        {{ t('biometric.verification.matchFound.viewFullProfile') }}
                      </a>
                      <button @click="resetView" class="btn btn-light-danger">
                        <i class="ki-outline ki-arrows-circle fs-4 me-2"></i>
                        {{ t('biometric.verification.matchFound.newVerification') }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- No Match -->
                <div v-else-if="verificationResult && !verificationResult.found" class="alert alert-success d-flex align-items-start">
                  <i class="ki-outline ki-shield-tick fs-2x text-success me-4"></i>
                  <div class="flex-grow-1">
                    <h4 class="alert-heading">{{ t('biometric.verification.noMatch.title') }}</h4>
                    <p>{{ t('biometric.verification.noMatch.description') }}</p>
                    <p class="text-muted fs-7 mb-0">
                      {{ verificationResult.message || t('biometric.verification.noMatch.canProceed') }}
                    </p>

                    <div class="separator separator-dashed my-5"></div>

                    <div class="d-flex">
                      <button @click="proceedToAdmission" class="btn btn-success me-3">
                        <i class="ki-outline ki-user-tick fs-4 me-2"></i>
                        {{ t('biometric.verification.noMatch.proceedWithAdmission') }}
                      </button>
                      <button @click="resetView" class="btn btn-light-success">
                        <i class="ki-outline ki-arrows-circle fs-4 me-2"></i>
                        {{ t('biometric.verification.noMatch.newVerification') }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Error -->
                <div v-else-if="verificationError" class="alert alert-warning">
                  <h4 class="alert-heading">{{ t('biometric.verification.error.title') }}</h4>
                  <p>{{ verificationError }}</p>
                  <button @click="retryVerification" class="btn btn-warning mt-3">
                    <i class="ki-outline ki-arrows-circle fs-4 me-2"></i>
                    {{ t('biometric.verification.error.retry') }}
                  </button>
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
import { ref, onMounted, onActivated, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useJavaBiometric } from '@/composables/useJavaBiometric'
import Swal from 'sweetalert2'
import axios from 'axios'

const { t } = useI18n()

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
  initializeDevice
} = useJavaBiometric()

// State
const verificationInProgress = ref(false)
const verificationType = ref<'fingerprint' | 'facial' | 'document' | 'name'>('fingerprint')
const currentStep = ref(1)
const isBiometricReady = ref(false)
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
  documentNumber: '',
  // Name search
  firstName: '',
  middleName: '',
  lastName: '',
  secondLastName: '',
  marriedSurname: '',
  birthDate: ''
})

// Methods
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
      throw new Error(result.message || t('biometric.swal.couldNotLaunchApp'))
    }
  } catch (error: any) {
    verificationError.value = error.message || t('biometric.swal.couldNotLaunchApp')
    currentStep.value = 3
    verificationInProgress.value = false

    await Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.error'),
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
    title: t('common.swal.titles.comingSoon'),
    text: t('biometric.swal.facialComingSoonText')
  })
  verificationInProgress.value = false
}


const retryVerification = () => {
  currentStep.value = 1
  verificationError.value = ''
  verificationResult.value = null
}

const proceedToAdmission = () => {
  router.push('/inmates/create')
}

const resetView = () => {
  // Resetear estado de verificación
  verificationInProgress.value = false
  verificationType.value = 'fingerprint'
  currentStep.value = 1
  verificationResult.value = null
  verificationError.value = ''
  capturedFingerprint.value = ''
  searchResults.value = []
  isSearching.value = false

  // Resetear datos de búsqueda
  searchData.value = {
    documentNumber: '',
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    marriedSurname: '',
    birthDate: ''
  }

  // Activar el primer tab (búsqueda biométrica)
  setTimeout(() => {
    const biometricTab = document.querySelector('a[href="#biometric-search"]')
    if (biometricTab) {
      const tab = new (window as any).bootstrap.Tab(biometricTab)
      tab.show()
    }
  }, 100)
}

// Computed
const canSearchByName = computed(() => {
  return searchData.value.firstName || searchData.value.lastName ||
         searchData.value.middleName || searchData.value.secondLastName
})

// Search Methods
const searchByDocument = async () => {
  // Validar mínimo 3 caracteres
  if (!searchData.value.documentNumber || searchData.value.documentNumber.trim().length < 3) {
    Swal.fire({
      icon: 'warning',
      title: t('biometric.swal.searchTooShort'),
      text: t('biometric.swal.minCharsDocument')
    })
    return
  }

  isSearching.value = true
  searchResults.value = []

  try {
    const response = await axios.post('/inmates/search-by-document', {
      document_number: searchData.value.documentNumber.trim()
    })
    
    if (response.data.success) {
      if (response.data.inmates && response.data.inmates.length > 0) {
        // Mostrar resultados
        showSearchResults(response.data.inmates)
      } else {
        Swal.fire({
          icon: 'success',
          title: t('biometric.swal.noMatches'),
          text: t('biometric.swal.noMatchesDocumentText'),
          confirmButtonText: t('biometric.swal.proceedWithAdmission')
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
      title: t('common.swal.titles.error'),
      text: error.response?.data?.message || t('biometric.errors.searchError')
    })
  } finally {
    isSearching.value = false
  }
}

const searchByName = async () => {
  // Validar que al menos un campo tenga mínimo 2 caracteres
  const hasValidField =
    (searchData.value.firstName && searchData.value.firstName.trim().length >= 2) ||
    (searchData.value.middleName && searchData.value.middleName.trim().length >= 2) ||
    (searchData.value.lastName && searchData.value.lastName.trim().length >= 2) ||
    (searchData.value.secondLastName && searchData.value.secondLastName.trim().length >= 2) ||
    (searchData.value.marriedSurname && searchData.value.marriedSurname.trim().length >= 2)

  if (!hasValidField) {
    Swal.fire({
      icon: 'warning',
      title: t('biometric.swal.searchTooShort'),
      text: t('biometric.swal.minCharsName')
    })
    return
  }

  isSearching.value = true
  searchResults.value = []

  try {
    const searchParams: any = {}
    if (searchData.value.firstName && searchData.value.firstName.trim().length >= 2) {
      searchParams.first_name = searchData.value.firstName.trim()
    }
    if (searchData.value.middleName && searchData.value.middleName.trim().length >= 2) {
      searchParams.middle_name = searchData.value.middleName.trim()
    }
    if (searchData.value.lastName && searchData.value.lastName.trim().length >= 2) {
      searchParams.last_name = searchData.value.lastName.trim()
    }
    if (searchData.value.secondLastName && searchData.value.secondLastName.trim().length >= 2) {
      searchParams.second_last_name = searchData.value.secondLastName.trim()
    }
    if (searchData.value.marriedSurname && searchData.value.marriedSurname.trim().length >= 2) {
      searchParams.married_surname = searchData.value.marriedSurname.trim()
    }
    if (searchData.value.birthDate) searchParams.birth_date = searchData.value.birthDate

    const response = await axios.post('/inmates/search-by-name', searchParams)

    if (response.data.success) {
      if (response.data.inmates && response.data.inmates.length > 0) {
        // Mostrar resultados
        showSearchResults(response.data.inmates)
      } else {
        Swal.fire({
          icon: 'success',
          title: t('biometric.swal.noMatches'),
          text: t('biometric.swal.noMatchesNameText'),
          confirmButtonText: t('biometric.swal.proceedWithAdmission')
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
      title: t('common.swal.titles.error'),
      text: error.response?.data?.message || t('biometric.errors.searchError')
    })
  } finally {
    isSearching.value = false
  }
}

const showSearchResults = (inmates: any[]) => {
  searchResults.value = inmates

  // Crear HTML para mostrar los resultados
  const matchesText = t('biometric.swal.matchesFoundCount', { count: inmates.length })
  let resultsHtml = '<div class="text-start">'
  resultsHtml += `<p class="mb-3">${matchesText}</p>`
  resultsHtml += '<div class="mh-300px overflow-auto">'

  const viewProfileText = t('biometric.swal.viewProfile')
  inmates.forEach((inmate: any) => {
    resultsHtml += `
      <div class="d-flex align-items-center p-3 border rounded mb-2">
        <div class="symbol symbol-50px me-3">
          <img src="${inmate.photo_url || '/media/avatars/blank.png'}" alt=""/>
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
          ${viewProfileText}
        </a>
      </div>
    `
  })

  resultsHtml += '</div></div>'

  Swal.fire({
    icon: 'warning',
    title: t('biometric.swal.matchesFoundTitle'),
    html: resultsHtml,
    width: '600px',
    showCancelButton: true,
    confirmButtonText: t('biometric.swal.proceedAnyway'),
    cancelButtonText: t('common.swal.buttons.cancel'),
    confirmButtonColor: '#d33'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: 'question',
        title: t('common.swal.titles.confirm'),
        text: t('biometric.swal.confirmProceedText'),
        showCancelButton: true,
        confirmButtonText: t('common.swal.buttons.yesProceed'),
        cancelButtonText: t('common.swal.buttons.noReview')
      }).then((confirmResult) => {
        if (confirmResult.isConfirmed) {
          proceedToAdmission()
        }
      })
    }
  })
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
    title: t('biometric.swal.buildService'),
    text: t('biometric.swal.buildServiceText'),
    showCancelButton: true,
    confirmButtonText: t('biometric.swal.yesBuild'),
    cancelButtonText: t('common.swal.buttons.cancel')
  })
  
  if (!result.isConfirmed) return
  
  isBuildingService.value = true
  
  try {
    const response = await axios.post('biometric-service/build')
    
    if (response.data.success) {
      const jarCompiledText = t('biometric.swal.jarCompiled')
      const jarSizeText = t('biometric.swal.jarSize')
      await Swal.fire({
        icon: 'success',
        title: t('biometric.swal.buildSuccess'),
        html: `
          <div class="text-start">
            <p><strong>${jarCompiledText}</strong> ${response.data.data?.jar_path || 'BiometricService.jar'}</p>
            ${response.data.data?.jar_size ? `<p><strong>${jarSizeText}</strong> ${(response.data.data.jar_size / 1024).toFixed(2)} KB</p>` : ''}
          </div>
        `,
        confirmButtonText: t('common.swal.buttons.accept')
      })
      
      // Actualizar estado del servicio
      await checkServiceFullStatus()
    } else {
      await Swal.fire({
        icon: 'error',
        title: t('biometric.swal.buildError'),
        html: `
          <div class="text-start">
            <p>${response.data.message}</p>
            ${response.data.output ? `<pre class="mt-3" style="max-height: 300px; overflow-y: auto;">${response.data.output}</pre>` : ''}
          </div>
        `,
        confirmButtonText: t('common.swal.buttons.accept')
      })
    }
  } catch (error: any) {
    console.error('Error al compilar servicio:', error)
    await Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.error'),
      text: error.response?.data?.message || t('biometric.swal.buildError'),
      confirmButtonText: t('common.swal.buttons.accept')
    })
  } finally {
    isBuildingService.value = false
  }
}

const stopService = async () => {
  const result = await Swal.fire({
    icon: 'warning',
    title: t('biometric.swal.stopService'),
    text: t('biometric.swal.stopServiceText'),
    showCancelButton: true,
    confirmButtonText: t('biometric.swal.yesStop'),
    cancelButtonText: t('common.swal.buttons.cancel'),
    confirmButtonColor: '#d33'
  })
  
  if (!result.isConfirmed) return
  
  isServiceLoading.value = true
  
  try {
    const response = await axios.post('biometric-service/stop')
    
    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: t('biometric.swal.serviceStopped'),
        text: t('biometric.swal.serviceStoppedText'),
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
      title: t('common.swal.titles.error'),
      text: error.response?.data?.message || t('biometric.swal.stopServiceError')
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
        title: t('biometric.swal.serviceLogs'),
        html: `<div class="mh-400px overflow-auto">${logsHtml}</div>`,
        width: '800px',
        confirmButtonText: t('common.swal.buttons.close')
      })
    }
  } catch (error) {
    console.error('Error al obtener logs:', error)
  }
}

// Lifecycle
onMounted(async () => {
  // Resetear la vista al estado inicial
  resetView()

  // Verificar estado completo del servicio
  await checkServiceFullStatus()

  // Verificar estado del servicio Java
  await checkJavaStatus()

  // Marcar como listo
  isBiometricReady.value = true

})

// Resetear cuando el componente se reactive (al volver de otra ruta)
onActivated(() => {
  resetView()
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