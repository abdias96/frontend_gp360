<template>
  <div>
    <!-- begin::page-header -->
    <div class="row gy-5 g-xl-10 mb-5 mb-xl-10">
      <div class="col-md-12">
        <div class="d-flex flex-column flex-md-row align-items-center justify-content-between">
          <h1 class="fs-2x fw-bold text-gray-900 mb-4 mb-md-0">
            {{ $t('visits.visitMonitoring.title') }}
          </h1>
          <div class="d-flex gap-2">
            <button class="btn btn-light-danger" @click="handleEndAllVisits">
              <i class="fas fa-stop"></i>
              {{ $t('visits.visitMonitoring.endAllVisits') }}
            </button>
            <button class="btn btn-light-primary" @click="handleFullScreen">
              <i class="fas fa-expand"></i>
              {{ $t('visits.visitMonitoring.fullScreen') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- end::page-header -->

    <!-- begin::monitoring grid -->
    <div class="row g-5">
      <!-- Camera Grid -->
      <div class="col-xl-9">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitMonitoring.liveMonitoring') }}</h3>
            <div class="card-toolbar">
              <div class="btn-group" role="group">
                <button 
                  type="button" 
                  class="btn btn-sm"
                  :class="gridLayout === '1x1' ? 'btn-primary' : 'btn-light'"
                  @click="gridLayout = '1x1'"
                >
                  1x1
                </button>
                <button 
                  type="button" 
                  class="btn btn-sm"
                  :class="gridLayout === '2x2' ? 'btn-primary' : 'btn-light'"
                  @click="gridLayout = '2x2'"
                >
                  2x2
                </button>
                <button 
                  type="button" 
                  class="btn btn-sm"
                  :class="gridLayout === '3x3' ? 'btn-primary' : 'btn-light'"
                  @click="gridLayout = '3x3'"
                >
                  3x3
                </button>
              </div>
            </div>
          </div>
          <div class="card-body p-3">
            <div class="row g-3">
              <div 
                v-for="camera in visibleCameras" 
                :key="camera.id"
                :class="getCameraGridClass()"
              >
                <div class="position-relative bg-dark rounded overflow-hidden h-100">
                  <!-- Camera Feed Placeholder -->
                  <div class="d-flex align-items-center justify-content-center" style="min-height: 300px;">
                    <div v-if="camera.status === 'active'" class="text-center text-white">
                      <i class="fas fa-video fs-3x mb-3"></i>
                      <p class="mb-0">{{ camera.name }}</p>
                      <small class="text-muted">{{ camera.location }}</small>
                    </div>
                    <div v-else class="text-center text-muted">
                      <i class="fas fa-video-slash fs-3x mb-3"></i>
                      <p class="mb-0">{{ $t('visits.visitMonitoring.cameraOffline') }}</p>
                    </div>
                  </div>
                  
                  <!-- Camera Controls Overlay -->
                  <div class="position-absolute top-0 start-0 p-2 w-100 bg-gradient-dark">
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="text-white fw-bold">{{ camera.name }}</span>
                      <div class="d-flex gap-1">
                        <button 
                          class="btn btn-sm btn-icon btn-light-primary"
                          @click="handleZoomIn(camera.id)"
                          :title="$t('visits.visitMonitoring.zoomIn')"
                        >
                          <i class="fas fa-search-plus"></i>
                        </button>
                        <button 
                          class="btn btn-sm btn-icon btn-light-primary"
                          @click="handleZoomOut(camera.id)"
                          :title="$t('visits.visitMonitoring.zoomOut')"
                        >
                          <i class="fas fa-search-minus"></i>
                        </button>
                        <button 
                          class="btn btn-sm btn-icon btn-light-warning"
                          @click="handleSnapshot(camera.id)"
                          :title="$t('visits.visitMonitoring.snapshot')"
                        >
                          <i class="fas fa-camera"></i>
                        </button>
                        <button 
                          class="btn btn-sm btn-icon btn-light-danger"
                          @click="handleRecord(camera.id)"
                          :title="$t('visits.visitMonitoring.record')"
                        >
                          <i class="fas fa-circle"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Visit Info Overlay -->
                  <div v-if="camera.currentVisit" class="position-absolute bottom-0 start-0 p-2 w-100 bg-gradient-dark">
                    <div class="text-white small">
                      <div class="mb-1">
                        <strong>{{ $t('visits.visitMonitoring.visitor') }}:</strong> 
                        {{ camera.currentVisit.visitorName }}
                      </div>
                      <div class="mb-1">
                        <strong>{{ $t('visits.visitMonitoring.inmate') }}:</strong> 
                        {{ camera.currentVisit.inmateName }}
                      </div>
                      <div class="d-flex justify-content-between">
                        <span>
                          <strong>{{ $t('visits.visitMonitoring.started') }}:</strong> 
                          {{ camera.currentVisit.startTime }}
                        </span>
                        <span class="text-warning">
                          <i class="fas fa-clock me-1"></i>
                          {{ camera.currentVisit.elapsed }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Control Panel -->
      <div class="col-xl-3">
        <!-- Active Visits List -->
        <div class="card mb-5">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitMonitoring.activeVisits') }}</h3>
          </div>
          <div class="card-body p-3">
            <div 
              v-for="visit in activeVisits" 
              :key="visit.id"
              class="d-flex align-items-center p-3 mb-3 bg-light rounded cursor-pointer"
              :class="{ 'bg-light-primary': selectedVisit?.id === visit.id }"
              @click="selectVisit(visit)"
            >
              <div class="symbol symbol-50px me-3">
                <img :src="visit.visitorPhoto || '/media/avatars/blank.png'" alt="" />
              </div>
              <div class="flex-grow-1">
                <div class="fw-bold text-gray-900">{{ visit.room }}</div>
                <div class="text-muted fs-7">{{ visit.visitorName }}</div>
                <div class="d-flex align-items-center mt-1">
                  <span class="badge badge-light-success me-2">{{ visit.elapsed }}</span>
                  <span v-if="visit.alerts > 0" class="badge badge-light-danger">
                    <i class="fas fa-exclamation-triangle me-1"></i>
                    {{ visit.alerts }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Monitoring Alerts -->
        <div class="card mb-5">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitMonitoring.alerts') }}</h3>
            <div class="card-toolbar">
              <span class="badge badge-danger">{{ alerts.length }}</span>
            </div>
          </div>
          <div class="card-body p-3">
            <div v-if="alerts.length > 0">
              <div v-for="alert in alerts" :key="alert.id" class="mb-3">
                <div class="d-flex align-items-start">
                  <div class="symbol symbol-30px me-3">
                    <span :class="`symbol-label bg-light-${alert.type}`">
                      <i :class="`fas ${getAlertIcon(alert.type)} text-${alert.type}`"></i>
                    </span>
                  </div>
                  <div class="flex-grow-1">
                    <div class="text-gray-900 fs-7 fw-bold">{{ alert.message }}</div>
                    <div class="text-muted fs-8">
                      {{ alert.location }} - {{ alert.time }}
                    </div>
                  </div>
                  <button 
                    class="btn btn-sm btn-icon btn-light"
                    @click="dismissAlert(alert.id)"
                  >
                    <i class="fas fa-times fs-7"></i>
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <p class="text-muted mb-0">{{ $t('visits.visitMonitoring.noAlerts') }}</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitMonitoring.quickActions') }}</h3>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <button 
                class="btn btn-light-primary"
                @click="handleSendMessage"
                :disabled="!selectedVisit"
              >
                <i class="fas fa-comment me-2"></i>
                {{ $t('visits.visitMonitoring.sendMessage') }}
              </button>
              <button 
                class="btn btn-light-warning"
                @click="handleCallGuard"
              >
                <i class="fas fa-phone me-2"></i>
                {{ $t('visits.visitMonitoring.callGuard') }}
              </button>
              <button 
                class="btn btn-light-danger"
                @click="handleEmergency"
              >
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ $t('visits.visitMonitoring.emergency') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end::monitoring grid -->

    <!-- begin::recording status -->
    <div class="card mt-5">
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <span class="bullet bullet-dot bg-danger animation-blink me-3"></span>
            <span class="text-gray-900 fw-bold">{{ $t('visits.visitMonitoring.recording') }}</span>
            <span class="text-muted ms-2">{{ recordingDuration }}</span>
          </div>
          <div>
            <span class="text-muted me-3">{{ $t('visits.visitMonitoring.storageUsed') }}: </span>
            <span class="text-gray-900 fw-bold">{{ storageUsed }}</span>
            <span class="text-muted"> / {{ totalStorage }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- end::recording status -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

// Composables
const route = useRoute()
const { t } = useI18n()

// Types
interface Camera {
  id: number
  name: string
  location: string
  status: 'active' | 'inactive'
  currentVisit?: {
    visitorName: string
    inmateName: string
    startTime: string
    elapsed: string
  }
}

interface ActiveVisit {
  id: number
  room: string
  visitorName: string
  visitorPhoto: string | null
  inmateName: string
  elapsed: string
  alerts: number
}

interface Alert {
  id: number
  type: 'warning' | 'danger' | 'info'
  message: string
  location: string
  time: string
}

// Refs
const gridLayout = ref('2x2')
const selectedVisit = ref<ActiveVisit | null>(null)
const recordingDuration = ref('02:34:15')
const storageUsed = ref('125 GB')
const totalStorage = ref('500 GB')

const cameras = ref<Camera[]>([
  {
    id: 1,
    name: 'Cámara 1',
    location: 'Sala de Visitas 1',
    status: 'active',
    currentVisit: {
      visitorName: 'María García',
      inmateName: 'Juan García',
      startTime: '14:00',
      elapsed: '25 min'
    }
  },
  {
    id: 2,
    name: 'Cámara 2',
    location: 'Sala de Visitas 1',
    status: 'active',
    currentVisit: {
      visitorName: 'Ana Martinez',
      inmateName: 'Luis Hernandez',
      startTime: '13:45',
      elapsed: '40 min'
    }
  },
  {
    id: 3,
    name: 'Cámara 3',
    location: 'Sala de Visitas 2',
    status: 'active'
  },
  {
    id: 4,
    name: 'Cámara 4',
    location: 'Sala de Visitas 2',
    status: 'inactive'
  },
  {
    id: 5,
    name: 'Cámara 5',
    location: 'Sala Especial',
    status: 'active',
    currentVisit: {
      visitorName: 'Lic. Roberto Silva',
      inmateName: 'Miguel Cruz',
      startTime: '13:00',
      elapsed: '85 min'
    }
  },
  {
    id: 6,
    name: 'Cámara 6',
    location: 'Sala Especial',
    status: 'active'
  }
])

const activeVisits = ref<ActiveVisit[]>([
  {
    id: 1,
    room: 'Sala 1 - Cam 1',
    visitorName: 'María García',
    visitorPhoto: null,
    inmateName: 'Juan García',
    elapsed: '25 min',
    alerts: 0
  },
  {
    id: 2,
    room: 'Sala 1 - Cam 2',
    visitorName: 'Ana Martinez',
    visitorPhoto: null,
    inmateName: 'Luis Hernandez',
    elapsed: '40 min',
    alerts: 0
  },
  {
    id: 3,
    room: 'Sala Especial',
    visitorName: 'Lic. Roberto Silva',
    visitorPhoto: null,
    inmateName: 'Miguel Cruz',
    elapsed: '85 min',
    alerts: 2
  }
])

const alerts = ref<Alert[]>([
  {
    id: 1,
    type: 'warning',
    message: 'Tiempo de visita excedido',
    location: 'Sala Especial',
    time: '14:25'
  },
  {
    id: 2,
    type: 'danger',
    message: 'Movimiento sospechoso detectado',
    location: 'Sala Especial',
    time: '14:20'
  }
])

let updateInterval: number | null = null

// Computed
const visibleCameras = computed(() => {
  const layoutMap: Record<string, number> = {
    '1x1': 1,
    '2x2': 4,
    '3x3': 9
  }
  return cameras.value.slice(0, layoutMap[gridLayout.value] || 4)
})

const getCameraGridClass = () => {
  const classMap: Record<string, string> = {
    '1x1': 'col-12',
    '2x2': 'col-6',
    '3x3': 'col-4'
  }
  return classMap[gridLayout.value] || 'col-6'
}

// Methods
const getAlertIcon = (type: string) => {
  const icons: Record<string, string> = {
    warning: 'fa-exclamation-triangle',
    danger: 'fa-times-circle',
    info: 'fa-info-circle'
  }
  return icons[type] || 'fa-circle'
}

const selectVisit = (visit: ActiveVisit) => {
  selectedVisit.value = visit
  // Focus camera on selected visit
  console.log('Selected visit:', visit)
}

const dismissAlert = (alertId: number) => {
  const index = alerts.value.findIndex(a => a.id === alertId)
  if (index > -1) {
    alerts.value.splice(index, 1)
  }
}

const handleFullScreen = () => {
  const elem = document.documentElement
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  }
}

const handleEndAllVisits = async () => {
  const result = await Swal.fire({
    title: t('visits.visitMonitoring.endAllVisitsTitle'),
    text: t('visits.visitMonitoring.endAllVisitsText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel'),
    confirmButtonColor: '#d33'
  })

  if (result.isConfirmed) {
    Swal.fire({
      title: t('common.success'),
      text: t('visits.visitMonitoring.endAllVisitsSuccess'),
      icon: 'success'
    })
  }
}

const handleZoomIn = (cameraId: number) => {
  console.log('Zoom in camera:', cameraId)
}

const handleZoomOut = (cameraId: number) => {
  console.log('Zoom out camera:', cameraId)
}

const handleSnapshot = (cameraId: number) => {
  console.log('Take snapshot from camera:', cameraId)
  Swal.fire({
    title: t('visits.visitMonitoring.snapshotSaved'),
    icon: 'success',
    timer: 1500,
    showConfirmButton: false
  })
}

const handleRecord = (cameraId: number) => {
  console.log('Toggle recording for camera:', cameraId)
}

const handleSendMessage = () => {
  if (!selectedVisit.value) return
  
  Swal.fire({
    title: t('visits.visitMonitoring.sendMessageTitle'),
    input: 'textarea',
    inputLabel: t('visits.visitMonitoring.messageLabel'),
    inputPlaceholder: t('visits.visitMonitoring.messagePlaceholder'),
    showCancelButton: true,
    confirmButtonText: t('common.send'),
    cancelButtonText: t('common.cancel')
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: t('common.success'),
        text: t('visits.visitMonitoring.messageSent'),
        icon: 'success'
      })
    }
  })
}

const handleCallGuard = () => {
  console.log('Call guard')
  Swal.fire({
    title: t('visits.visitMonitoring.callingGuard'),
    text: t('visits.visitMonitoring.callingGuardText'),
    icon: 'info'
  })
}

const handleEmergency = async () => {
  const result = await Swal.fire({
    title: t('visits.visitMonitoring.emergencyTitle'),
    text: t('visits.visitMonitoring.emergencyText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel'),
    confirmButtonColor: '#d33'
  })

  if (result.isConfirmed) {
    alerts.value.unshift({
      id: alerts.value.length + 1,
      type: 'danger',
      message: 'Emergencia activada por operador',
      location: 'Centro de Monitoreo',
      time: new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })
    })
    
    Swal.fire({
      title: t('visits.visitMonitoring.emergencyActivated'),
      text: t('visits.visitMonitoring.emergencyActivatedText'),
      icon: 'info'
    })
  }
}

// Update elapsed times
const updateElapsedTimes = () => {
  // Simulate time updates
  activeVisits.value.forEach(visit => {
    const minutes = parseInt(visit.elapsed)
    visit.elapsed = `${minutes + 1} min`
  })
}

// Lifecycle
onMounted(() => {
  // Start auto-update
  updateInterval = window.setInterval(updateElapsedTimes, 60000) // Update every minute
  
  // Check if specific visit ID in route
  if (route.params.id) {
    const visitId = parseInt(route.params.id as string)
    const visit = activeVisits.value.find(v => v.id === visitId)
    if (visit) {
      selectVisit(visit)
    }
  }
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.bg-gradient-dark {
  background: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent);
}

.animation-blink {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50%, 100% {
    opacity: 1;
  }
  25%, 75% {
    opacity: 0;
  }
}

.symbol-30px {
  width: 30px;
  height: 30px;
}

.symbol-30px .symbol-label {
  width: 30px;
  height: 30px;
}
</style>