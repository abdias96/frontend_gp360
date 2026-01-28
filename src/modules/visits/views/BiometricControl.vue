<template>
  <div>
    <!-- begin::page-header -->
    <div class="row gy-5 g-xl-10 mb-5 mb-xl-10">
      <div class="col-md-12">
        <div class="d-flex flex-column flex-md-row align-items-center justify-content-between">
          <h1 class="fs-2x fw-bold text-gray-900 mb-4 mb-md-0">
            {{ $t('visits.biometricControl.title') }}
          </h1>
          <div class="d-flex gap-2">
            <button class="btn btn-light-primary" @click="handleDeviceStatus">
              <i class="fas fa-fingerprint"></i>
              {{ $t('visits.biometricControl.deviceStatusLabel') }}
            </button>
            <button v-if="canEnroll" class="btn btn-primary" @click="handleNewRegistration">
              <i class="fas fa-user-plus"></i>
              {{ $t('visits.biometricControl.newRegistration') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- end::page-header -->

    <!-- begin::device status -->
    <div class="row g-5 mb-5">
      <div class="col-xl-3">
        <div class="card bg-light-success">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="svg-icon svg-icon-3x svg-icon-success me-5">
                <i class="fas fa-plug fa-2x text-success"></i>
              </span>
              <div>
                <div class="text-success fw-bold fs-2">{{ devices.connected }}</div>
                <div class="text-muted fw-semibold">{{ $t('visits.biometricControl.connectedDevices') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-light-danger">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="svg-icon svg-icon-3x svg-icon-danger me-5">
                <i class="fas fa-unlink fa-2x text-danger"></i>
              </span>
              <div>
                <div class="text-danger fw-bold fs-2">{{ devices.disconnected }}</div>
                <div class="text-muted fw-semibold">{{ $t('visits.biometricControl.disconnectedDevices') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-light-primary">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="svg-icon svg-icon-3x svg-icon-primary me-5">
                <i class="fas fa-fingerprint fa-2x text-primary"></i>
              </span>
              <div>
                <div class="text-primary fw-bold fs-2">{{ stats.todayScans }}</div>
                <div class="text-muted fw-semibold">{{ $t('visits.biometricControl.todayScans') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-light-warning">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="svg-icon svg-icon-3x svg-icon-warning me-5">
                <i class="fas fa-exclamation-triangle fa-2x text-warning"></i>
              </span>
              <div>
                <div class="text-warning fw-bold fs-2">{{ stats.failedScans }}</div>
                <div class="text-muted fw-semibold">{{ $t('visits.biometricControl.failedScans') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end::device status -->

    <!-- begin::biometric control panel -->
    <div class="row g-5">
      <!-- Scanner Section -->
      <div class="col-xl-4">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.biometricControl.scanner') }}</h3>
          </div>
          <div class="card-body">
            <!-- Manual Search Section -->
            <div class="mb-7">
              <label class="form-label">{{ $t('visits.biometricControl.manualSearch') }}</label>
              <div class="position-relative">
                <input
                  type="text"
                  v-model="visitorSearch"
                  class="form-control"
                  :placeholder="$t('visits.biometricControl.searchPlaceholder')"
                  @input="handleVisitorSearch"
                  @focus="showSearchResults = true"
                  @blur="handleSearchBlur"
                  autocomplete="off"
                />

                <!-- Search Results Dropdown -->
                <div
                  v-if="showSearchResults && searchResults.length > 0"
                  class="position-absolute w-100 mt-1 bg-white border rounded shadow-sm"
                  style="max-height: 300px; overflow-y: auto; z-index: 1050;"
                >
                  <div
                    v-for="visitor in searchResults"
                    :key="visitor.id"
                    class="dropdown-item cursor-pointer"
                    @mousedown.prevent="selectVisitor(visitor)"
                  >
                    <div class="d-flex align-items-center">
                      <div class="symbol symbol-40px me-3">
                        <img :src="visitor.photo || '/media/avatars/blank.png'" alt="" />
                      </div>
                      <div class="flex-grow-1">
                        <div class="fw-bold">{{ visitor.full_name }}</div>
                        <div class="text-muted fs-7">{{ visitor.document_number }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- No Results Message -->
                <div
                  v-if="showSearchResults && visitorSearch.length >= 4 && searchResults.length === 0 && !searchLoading"
                  class="position-absolute w-100 mt-1 bg-white border rounded shadow-sm p-3"
                  style="z-index: 1050;"
                >
                  <div class="text-center text-muted">
                    <i class="fas fa-search fs-2 mb-2"></i>
                    <div>{{ $t('visits.biometricControl.noResults') }}</div>
                  </div>
                </div>

                <!-- Loading indicator -->
                <div
                  v-if="searchLoading"
                  class="position-absolute w-100 mt-1 bg-white border rounded shadow-sm p-3"
                  style="z-index: 1050;"
                >
                  <div class="text-center">
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    {{ $t('common.searching') }}
                  </div>
                </div>
              </div>
              <div class="form-text">
                {{ $t('visits.biometricControl.searchHelp') }}
              </div>
            </div>

            <!-- OR Divider -->
            <div class="separator separator-content my-7">
              <span class="w-50px text-gray-500 fw-semibold fs-7">O</span>
            </div>

            <!-- Scanner Section -->
            <div class="mb-5 text-center">
              <div class="symbol symbol-150px mx-auto mb-5">
                <div class="symbol-label bg-light-primary">
                  <i class="fas fa-fingerprint fs-1 text-primary"></i>
                </div>
              </div>
              <h4 class="text-gray-900 mb-2">{{ scannerStatus.message }}</h4>
              <span :class="getScannerStatusClass(scannerStatus.status)">
                {{ $t(`visits.biometricControl.scannerStatus.${scannerStatus.status}`) }}
              </span>
            </div>
            
            <div v-if="currentScan" class="border border-dashed border-gray-300 rounded p-5 mb-5">
              <div class="mb-3">
                <h5 class="text-gray-900">{{ $t('visits.biometricControl.scanResult') }}</h5>
              </div>
              <div class="mb-3">
                <div class="symbol symbol-75px mx-auto mb-3">
                  <img :src="currentScan.photo || '/media/avatars/blank.png'" alt="" />
                </div>
                <h6 class="text-gray-900 fw-bold">{{ currentScan.name }}</h6>
                <p class="text-muted mb-0">{{ currentScan.document }}</p>
              </div>
              <div class="d-flex justify-content-center gap-2">
                <button class="btn btn-sm btn-success" @click="handleApproveAccess">
                  <i class="fas fa-check"></i>
                  {{ $t('visits.biometricControl.approve') }}
                </button>
                <button class="btn btn-sm btn-danger" @click="handleDenyAccess">
                  <i class="fas fa-times"></i>
                  {{ $t('visits.biometricControl.deny') }}
                </button>
              </div>
            </div>

            <button
              v-if="canVerify"
              class="btn btn-primary w-100"
              @click="handleStartScan"
              :disabled="scannerStatus.status !== 'ready'"
            >
              <i class="fas fa-fingerprint me-2"></i>
              {{ $t('visits.biometricControl.startScan') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Access Log -->
      <div class="col-xl-8">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.biometricControl.accessLog') }}</h3>
            <div class="card-toolbar">
              <ul class="nav nav-tabs nav-line-tabs nav-stretch fs-6 border-0">
                <li class="nav-item">
                  <a 
                    class="nav-link active" 
                    data-bs-toggle="tab" 
                    href="#access_log_tab"
                  >
                    {{ $t('visits.biometricControl.accessLog') }}
                  </a>
                </li>
                <li class="nav-item">
                  <a 
                    class="nav-link" 
                    data-bs-toggle="tab" 
                    href="#pending_registrations_tab"
                  >
                    {{ $t('visits.biometricControl.pendingRegistrations') }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="card-body">
            <div class="tab-content">
              <!-- Access Log Tab -->
              <div class="tab-pane fade show active" id="access_log_tab">
                <div class="table-responsive">
                  <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                    <thead>
                      <tr class="fw-bold text-muted">
                        <th>{{ $t('visits.biometricControl.time') }}</th>
                        <th>{{ $t('visits.biometricControl.visitor') }}</th>
                        <th>{{ $t('visits.biometricControl.type') }}</th>
                        <th>{{ $t('visits.biometricControl.location') }}</th>
                        <th>{{ $t('visits.biometricControl.result') }}</th>
                        <th>{{ $t('visits.biometricControl.device') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="log in accessLogs" :key="log.id">
                        <td>{{ log.time }}</td>
                        <td>
                          <div class="d-flex align-items-center">
                            <div class="symbol symbol-40px me-3">
                              <img :src="log.photo || '/media/avatars/blank.png'" alt="" />
                            </div>
                            <div>
                              <span class="text-gray-900 fw-bold">{{ log.name }}</span>
                              <br>
                              <span class="text-muted fs-7">{{ log.document }}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span class="badge badge-light-info">{{ log.type }}</span>
                        </td>
                        <td>{{ log.location }}</td>
                        <td>
                          <span :class="getAccessResultClass(log.result)">
                            {{ $t(`visits.biometricControl.result.${log.result}`) }}
                          </span>
                        </td>
                        <td>
                          <span class="text-muted">{{ log.device }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Pending Registrations Tab -->
              <div class="tab-pane fade" id="pending_registrations_tab">
                <div class="table-responsive">
                  <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                    <thead>
                      <tr class="fw-bold text-muted">
                        <th>{{ $t('visits.biometricControl.visitor') }}</th>
                        <th>{{ $t('visits.biometricControl.registrationDate') }}</th>
                        <th>{{ $t('visits.biometricControl.status') }}</th>
                        <th class="text-end">{{ $t('common.actions.title') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="pending in pendingRegistrations" :key="pending.id">
                        <td>
                          <div class="d-flex align-items-center">
                            <div class="symbol symbol-40px me-3">
                              <img :src="pending.photo || '/media/avatars/blank.png'" alt="" />
                            </div>
                            <div>
                              <span class="text-gray-900 fw-bold">{{ pending.name }}</span>
                              <br>
                              <span class="text-muted fs-7">{{ pending.document }}</span>
                            </div>
                          </div>
                        </td>
                        <td>{{ formatDate(pending.registrationDate) }}</td>
                        <td>
                          <span class="badge badge-warning">
                            {{ $t('visits.biometricControl.pendingBiometric') }}
                          </span>
                        </td>
                        <td class="text-end">
                          <button
                            v-if="canEnroll"
                            @click="handleRegisterBiometric(pending.id)"
                            class="btn btn-sm btn-primary"
                          >
                            <i class="fas fa-fingerprint me-1"></i>
                            {{ $t('visits.biometricControl.register') }}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end::biometric control panel -->

    <!-- begin::device management -->
    <div class="card mt-5">
      <div class="card-header">
        <h3 class="card-title">{{ $t('visits.biometricControl.deviceManagement') }}</h3>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
            <thead>
              <tr class="fw-bold text-muted">
                <th>{{ $t('visits.biometricControl.deviceName') }}</th>
                <th>{{ $t('visits.biometricControl.location') }}</th>
                <th>{{ $t('visits.biometricControl.status') }}</th>
                <th>{{ $t('visits.biometricControl.lastActivity') }}</th>
                <th>{{ $t('visits.biometricControl.totalScans') }}</th>
                <th class="text-end">{{ $t('common.actions.title') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="device in deviceList" :key="device.id">
                <td>
                  <span class="text-gray-900 fw-bold">{{ device.name }}</span>
                  <br>
                  <span class="text-muted fs-7">{{ device.model }}</span>
                </td>
                <td>{{ device.location }}</td>
                <td>
                  <span :class="getDeviceStatusClass(device.status)">
                    {{ $t(`visits.biometricControl.deviceStatus.${device.status}`) }}
                  </span>
                </td>
                <td>{{ formatDateTime(device.lastActivity) }}</td>
                <td>
                  <span class="text-gray-900 fw-bold">{{ device.totalScans }}</span>
                </td>
                <td class="text-end">
                  <button 
                    class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                    @click="handleConfigureDevice(device.id)"
                    :title="$t('common.settings')"
                  >
                    <i class="fas fa-cog"></i>
                  </button>
                  <button 
                    v-if="device.status === 'online'"
                    class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1"
                    @click="handleRestartDevice(device.id)"
                    :title="$t('visits.biometricControl.restart')"
                  >
                    <i class="fas fa-sync"></i>
                  </button>
                  <button 
                    v-if="device.status === 'offline'"
                    class="btn btn-icon btn-bg-light btn-active-color-success btn-sm"
                    @click="handleConnectDevice(device.id)"
                    :title="$t('visits.biometricControl.connect')"
                  >
                    <i class="fas fa-plug"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- end::device management -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'
import ApiService from '@/core/services/ApiService'
import { useAuthStore } from '@/stores/auth'

// Composables
const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()

// Permission checks
const canEnroll = computed(() => authStore.isSuperAdmin || authStore.hasPermission('visits.biometric_enroll'))
const canVerify = computed(() => authStore.isSuperAdmin || authStore.hasPermission('visits.biometric_verify'))

// Types
interface Visitor {
  id: number
  full_name: string
  document_number: string
  photo_url?: string | null
}

interface ScanResult {
  id: number
  name: string
  document: string
  photo: string | null
  authorized: boolean
}

interface AccessLog {
  id: number
  time: string
  name: string
  document: string
  photo: string | null
  type: string
  location: string
  result: 'granted' | 'denied' | 'failed'
  device: string
}

interface PendingRegistration {
  id: number
  name: string
  document: string
  photo: string | null
  registrationDate: string
}

interface Device {
  id: number
  name: string
  model: string
  location: string
  status: 'online' | 'offline' | 'error'
  lastActivity: string
  totalScans: number
}

// Refs
const devices = ref({
  connected: 3,
  disconnected: 1
})

const stats = ref({
  todayScans: 145,
  failedScans: 8
})

const scannerStatus = ref({
  status: 'ready', // ready, scanning, processing, error
  message: 'Escáner listo para captura'
})

const currentScan = ref<ScanResult | null>(null)

// Manual search refs
const visitorSearch = ref('')
const searchResults = ref<Visitor[]>([])
const showSearchResults = ref(false)
const searchLoading = ref(false)
let searchTimeout: number | null = null

const accessLogs = ref<AccessLog[]>([
  {
    id: 1,
    time: '15:45',
    name: 'María García López',
    document: 'DPI: 2547896321234',
    photo: null,
    type: 'Entrada',
    location: 'Entrada Principal',
    result: 'granted',
    device: 'Scanner-01'
  },
  {
    id: 2,
    time: '15:30',
    name: 'Carlos Rodriguez',
    document: 'DPI: 1234567890123',
    photo: null,
    type: 'Entrada',
    location: 'Entrada Principal',
    result: 'denied',
    device: 'Scanner-01'
  },
  {
    id: 3,
    time: '15:15',
    name: 'Ana Martinez',
    document: 'DPI: 9876543210987',
    photo: null,
    type: 'Salida',
    location: 'Salida Principal',
    result: 'granted',
    device: 'Scanner-02'
  }
])

const pendingRegistrations = ref<PendingRegistration[]>([
  {
    id: 1,
    name: 'Pedro Gonzalez',
    document: 'DPI: 1111111111111',
    photo: null,
    registrationDate: '2024-03-15'
  },
  {
    id: 2,
    name: 'Laura Mendez',
    document: 'DPI: 2222222222222',
    photo: null,
    registrationDate: '2024-03-14'
  }
])

const deviceList = ref<Device[]>([
  {
    id: 1,
    name: 'Scanner-01',
    model: 'ZKTeco ZK9500',
    location: 'Entrada Principal',
    status: 'online',
    lastActivity: '2024-03-15T15:45:00',
    totalScans: 523
  },
  {
    id: 2,
    name: 'Scanner-02',
    model: 'ZKTeco ZK9500',
    location: 'Salida Principal',
    status: 'online',
    lastActivity: '2024-03-15T15:30:00',
    totalScans: 412
  },
  {
    id: 3,
    name: 'Scanner-03',
    model: 'ZKTeco ZK9500',
    location: 'Entrada Administrativa',
    status: 'offline',
    lastActivity: '2024-03-15T10:00:00',
    totalScans: 156
  },
  {
    id: 4,
    name: 'Scanner-04',
    model: 'ZKTeco ZK9500',
    location: 'Sala de Visitas',
    status: 'online',
    lastActivity: '2024-03-15T15:40:00',
    totalScans: 89
  }
])

let scanInterval: number | null = null

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-GT')
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('es-GT')
}

const getScannerStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    ready: 'badge badge-success',
    scanning: 'badge badge-warning',
    processing: 'badge badge-info',
    error: 'badge badge-danger'
  }
  return classes[status] || 'badge badge-secondary'
}

const getAccessResultClass = (result: string) => {
  const classes: Record<string, string> = {
    granted: 'badge badge-success',
    denied: 'badge badge-danger',
    failed: 'badge badge-warning'
  }
  return classes[result] || 'badge badge-secondary'
}

const getDeviceStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    online: 'badge badge-success',
    offline: 'badge badge-danger',
    error: 'badge badge-warning'
  }
  return classes[status] || 'badge badge-secondary'
}

const handleDeviceStatus = () => {
}

const handleNewRegistration = () => {
  router.push('/visits/visitor-management')
}

const handleStartScan = () => {
  scannerStatus.value = {
    status: 'scanning',
    message: 'Coloque el dedo en el escáner...'
  }

  // Simulate scanning process
  setTimeout(() => {
    scannerStatus.value = {
      status: 'processing',
      message: 'Procesando huella dactilar...'
    }

    setTimeout(() => {
      // Simulate scan result
      currentScan.value = {
        id: 1,
        name: 'María García López',
        document: 'DPI: 2547896321234',
        photo: null,
        authorized: true
      }

      scannerStatus.value = {
        status: 'ready',
        message: 'Escáner listo para captura'
      }
    }, 2000)
  }, 3000)
}

const handleApproveAccess = () => {
  if (!currentScan.value) return

  // Add to access log
  accessLogs.value.unshift({
    id: accessLogs.value.length + 1,
    time: new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }),
    name: currentScan.value.name,
    document: currentScan.value.document,
    photo: currentScan.value.photo,
    type: 'Entrada',
    location: 'Entrada Principal',
    result: 'granted',
    device: 'Scanner-01'
  })

  Swal.fire({
    title: t('visits.biometricControl.accessGranted'),
    text: t('visits.biometricControl.accessGrantedText'),
    icon: 'success',
    timer: 2000,
    showConfirmButton: false
  })

  currentScan.value = null
}

const handleDenyAccess = () => {
  if (!currentScan.value) return

  // Add to access log
  accessLogs.value.unshift({
    id: accessLogs.value.length + 1,
    time: new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }),
    name: currentScan.value.name,
    document: currentScan.value.document,
    photo: currentScan.value.photo,
    type: 'Entrada',
    location: 'Entrada Principal',
    result: 'denied',
    device: 'Scanner-01'
  })

  Swal.fire({
    title: t('visits.biometricControl.accessDenied'),
    text: t('visits.biometricControl.accessDeniedText'),
    icon: 'error',
    timer: 2000,
    showConfirmButton: false
  })

  currentScan.value = null
}

const handleRegisterBiometric = (visitorId: number) => {
  // Open biometric registration modal
}

const handleConfigureDevice = (deviceId: number) => {
}

const handleRestartDevice = async (deviceId: number) => {
  const result = await Swal.fire({
    title: t('visits.biometricControl.restartDeviceTitle'),
    text: t('visits.biometricControl.restartDeviceText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel')
  })

  if (result.isConfirmed) {
    const device = deviceList.value.find(d => d.id === deviceId)
    if (device) {
      device.status = 'offline'
      
      setTimeout(() => {
        device.status = 'online'
        device.lastActivity = new Date().toISOString()
        
        Swal.fire({
          title: t('common.success'),
          text: t('visits.biometricControl.restartSuccess'),
          icon: 'success'
        })
      }, 3000)
    }
  }
}

const handleConnectDevice = (deviceId: number) => {
  const device = deviceList.value.find(d => d.id === deviceId)
  if (device) {
    device.status = 'online'
    device.lastActivity = new Date().toISOString()
    devices.value.connected++
    devices.value.disconnected--
  }
}

// Manual visitor search methods
const handleVisitorSearch = async () => {
  const searchTerm = visitorSearch.value.trim()

  // Clear timeout if exists
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  // Minimum 4 characters to search
  if (searchTerm.length < 4) {
    searchResults.value = []
    showSearchResults.value = false
    return
  }

  // Debounce search
  searchTimeout = window.setTimeout(async () => {
    try {
      searchLoading.value = true
      showSearchResults.value = true

      const response = await ApiService.get('/visitors', {
        params: {
          search: searchTerm,
          per_page: 10
        }
      })

      // Handle different response structures
      const visitorData = response.data.visitors || response.data.data || response.data
      searchResults.value = Array.isArray(visitorData)
        ? visitorData
        : (visitorData.data || [])

    } catch (error) {
      console.error('Error searching visitors:', error)
      searchResults.value = []
    } finally {
      searchLoading.value = false
    }
  }, 500) // 500ms debounce
}

const selectVisitor = (visitor: Visitor) => {

  // Set as current scan
  currentScan.value = {
    id: visitor.id,
    name: visitor.full_name,
    document: visitor.document_number,
    photo: visitor.photo_url || null,
    authorized: true // Check authorization status in real implementation
  }

  // Clear search
  visitorSearch.value = ''
  searchResults.value = []
  showSearchResults.value = false

  Swal.fire({
    title: t('visits.biometricControl.visitorFound'),
    text: `${visitor.full_name} - ${visitor.document_number}`,
    icon: 'success',
    timer: 2000,
    showConfirmButton: false
  })
}

const handleSearchBlur = () => {
  setTimeout(() => {
    showSearchResults.value = false
  }, 200)
}

// Lifecycle
onMounted(() => {
  // Simulate periodic scans
  scanInterval = window.setInterval(() => {
    stats.value.todayScans += Math.floor(Math.random() * 3)
  }, 10000)
})

onUnmounted(() => {
  if (scanInterval) {
    clearInterval(scanInterval)
  }
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  transition: background-color 0.15s ease-in-out;
}

.dropdown-item:hover {
  background-color: #f5f8fa;
}

.dropdown-item:active {
  background-color: #e4e6ef;
}
</style>