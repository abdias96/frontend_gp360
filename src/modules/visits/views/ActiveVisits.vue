<template>
  <div>
    <!-- begin::page-header -->
    <div class="row gy-5 g-xl-10 mb-5 mb-xl-10">
      <div class="col-md-12">
        <div class="d-flex flex-column flex-md-row align-items-center justify-content-between">
          <h1 class="fs-2x fw-bold text-gray-900 mb-4 mb-md-0">
            {{ $t('visits.activeVisits.title') }}
          </h1>
          <div class="d-flex gap-2">
            <button class="btn btn-light-danger" @click="handleEmergency">
              <i class="fas fa-exclamation-triangle"></i>
              {{ $t('visits.activeVisits.emergency') }}
            </button>
            <button class="btn btn-light-primary" @click="handleRefresh">
              <i class="fas fa-sync"></i>
              {{ $t('common.refresh') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- end::page-header -->

    <!-- begin::stats -->
    <div class="row g-5 mb-5">
      <div class="col-xl-3">
        <div class="card bg-light-success">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="svg-icon svg-icon-3x svg-icon-success me-5">
                <i class="fas fa-users fa-2x text-success"></i>
              </span>
              <div>
                <div class="text-success fw-bold fs-2">{{ stats.active }}</div>
                <div class="text-muted fw-semibold">{{ $t('visits.activeVisits.currentlyActive') }}</div>
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
                <i class="fas fa-clock fa-2x text-warning"></i>
              </span>
              <div>
                <div class="text-warning fw-bold fs-2">{{ stats.aboutToEnd }}</div>
                <div class="text-muted fw-semibold">{{ $t('visits.activeVisits.aboutToEnd') }}</div>
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
                <i class="fas fa-exclamation-circle fa-2x text-danger"></i>
              </span>
              <div>
                <div class="text-danger fw-bold fs-2">{{ stats.overtime }}</div>
                <div class="text-muted fw-semibold">{{ $t('visits.activeVisits.overtime') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-light-info">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="svg-icon svg-icon-3x svg-icon-info me-5">
                <i class="fas fa-door-open fa-2x text-info"></i>
              </span>
              <div>
                <div class="text-info fw-bold fs-2">{{ stats.availableRooms }}</div>
                <div class="text-muted fw-semibold">{{ $t('visits.activeVisits.availableRooms') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end::stats -->

    <!-- begin::active visits list -->
    <div class="card">
      <div class="card-header border-0">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label fw-bold fs-3 mb-1">{{ $t('visits.activeVisits.monitoringPanel') }}</span>
          <span class="text-muted mt-1 fw-semibold fs-7">
            {{ $t('visits.activeVisits.lastUpdate') }}: {{ lastUpdate }}
          </span>
        </h3>
        <div class="card-toolbar">
          <div class="me-3">
            <select v-model="filterRoom" class="form-select form-select-sm">
              <option value="">{{ $t('visits.activeVisits.allRooms') }}</option>
              <option value="room1">{{ $t('visits.activeVisits.room') }} 1</option>
              <option value="room2">{{ $t('visits.activeVisits.room') }} 2</option>
              <option value="room3">{{ $t('visits.activeVisits.room') }} 3</option>
              <option value="special">{{ $t('visits.activeVisits.specialRoom') }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
            <thead>
              <tr class="fw-bold text-muted">
                <th class="min-w-50px">#</th>
                <th class="min-w-100px">{{ $t('visits.activeVisits.room') }}</th>
                <th class="min-w-200px">{{ $t('visits.activeVisits.visitor') }}</th>
                <th class="min-w-200px">{{ $t('visits.activeVisits.inmate') }}</th>
                <th class="min-w-120px">{{ $t('visits.activeVisits.startTime') }}</th>
                <th class="min-w-100px">{{ $t('visits.activeVisits.elapsed') }}</th>
                <th class="min-w-100px">{{ $t('visits.activeVisits.remaining') }}</th>
                <th class="min-w-120px">{{ $t('visits.activeVisits.status') }}</th>
                <th class="text-end min-w-150px">{{ $t('common.actions.title') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="visit in filteredVisits" :key="visit.id">
                <td>
                  <span class="text-gray-900 fw-bold">{{ visit.id }}</span>
                </td>
                <td>
                  <span class="badge badge-light-primary">{{ visit.room }}</span>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-40px me-3">
                      <img :src="visit.visitorPhoto || '/media/avatars/blank.png'" alt="" />
                    </div>
                    <div>
                      <span class="text-gray-900 fw-bold">{{ visit.visitorName }}</span>
                      <br>
                      <span class="text-muted fs-7">{{ visit.visitorDocument }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-40px me-3">
                      <img :src="visit.inmatePhoto || '/media/avatars/blank.png'" alt="" />
                    </div>
                    <div>
                      <span class="text-gray-900 fw-bold">{{ visit.inmateName }}</span>
                      <br>
                      <span class="badge badge-light">{{ visit.inmateCode }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="text-gray-900">{{ visit.startTime }}</span>
                </td>
                <td>
                  <span class="text-gray-900 fw-bold">{{ visit.elapsed }}</span>
                </td>
                <td>
                  <span :class="getRemainingTimeClass(visit.remainingMinutes)">
                    {{ visit.remaining }}
                  </span>
                </td>
                <td>
                  <span :class="getStatusBadgeClass(visit.status)">
                    {{ $t(`visits.activeVisits.status.${visit.status}`) }}
                  </span>
                </td>
                <td class="text-end">
                  <button 
                    @click="handleViewMonitoring(visit.id)"
                    class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                    :title="$t('visits.activeVisits.monitor')"
                  >
                    <i class="fas fa-video"></i>
                  </button>
                  <button 
                    @click="handleExtendTime(visit.id)"
                    class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1"
                    :title="$t('visits.activeVisits.extendTime')"
                    :disabled="visit.status === 'overtime'"
                  >
                    <i class="fas fa-clock"></i>
                  </button>
                  <button 
                    @click="handleEndVisit(visit.id)"
                    class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                    :title="$t('visits.activeVisits.endVisit')"
                  >
                    <i class="fas fa-stop"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="filteredVisits.length === 0" class="text-center py-10">
          <p class="text-muted">{{ $t('visits.activeVisits.noActiveVisits') }}</p>
        </div>
      </div>
    </div>
    <!-- end::active visits list -->

    <!-- begin::alerts section -->
    <div class="row g-5 mt-5">
      <div class="col-xl-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.activeVisits.recentAlerts') }}</h3>
            <div class="card-toolbar">
              <button class="btn btn-sm btn-light-primary" @click="handleViewAllAlerts">
                {{ $t('common.viewAll') }}
              </button>
            </div>
          </div>
          <div class="card-body">
            <div v-for="alert in recentAlerts" :key="alert.id" class="d-flex align-items-center mb-5">
              <div class="symbol symbol-40px me-4">
                <span :class="`symbol-label bg-light-${alert.type}`">
                  <i :class="`fas ${getAlertIcon(alert.type)} text-${alert.type} fs-5`"></i>
                </span>
              </div>
              <div class="flex-grow-1">
                <div class="fw-bold text-gray-900">{{ alert.message }}</div>
                <div class="text-muted fs-7">{{ alert.time }} - {{ alert.location }}</div>
              </div>
              <button class="btn btn-sm btn-light" @click="handleDismissAlert(alert.id)">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-xl-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.activeVisits.roomOccupancy') }}</h3>
          </div>
          <div class="card-body">
            <div v-for="room in roomOccupancy" :key="room.id" class="mb-5">
              <div class="d-flex justify-content-between mb-2">
                <span class="fw-bold text-gray-800">{{ room.name }}</span>
                <span class="text-muted">{{ room.occupied }}/{{ room.capacity }}</span>
              </div>
              <div class="progress h-8px">
                <div 
                  class="progress-bar" 
                  :class="getOccupancyClass(room.occupancyRate)"
                  :style="`width: ${room.occupancyRate}%`"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end::alerts section -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

// Composables
const router = useRouter()
const { t } = useI18n()

// Types
interface ActiveVisit {
  id: number
  room: string
  visitorName: string
  visitorDocument: string
  visitorPhoto: string | null
  inmateName: string
  inmateCode: string
  inmatePhoto: string | null
  startTime: string
  elapsed: string
  remaining: string
  remainingMinutes: number
  status: 'normal' | 'warning' | 'overtime'
}

interface Alert {
  id: number
  type: 'warning' | 'danger' | 'info'
  message: string
  time: string
  location: string
}

// Refs
const stats = ref({
  active: 15,
  aboutToEnd: 3,
  overtime: 1,
  availableRooms: 2
})

const lastUpdate = ref(new Date().toLocaleTimeString('es-GT'))
const filterRoom = ref('')
const refreshInterval = ref<number | null>(null)

const activeVisits = ref<ActiveVisit[]>([
  {
    id: 1,
    room: 'Sala 1',
    visitorName: 'María García López',
    visitorDocument: 'DPI: 2547896321234',
    visitorPhoto: null,
    inmateName: 'Juan García López',
    inmateCode: 'REC-2024-001',
    inmatePhoto: null,
    startTime: '14:00',
    elapsed: '25 min',
    remaining: '35 min',
    remainingMinutes: 35,
    status: 'normal'
  },
  {
    id: 2,
    room: 'Sala 2',
    visitorName: 'Ana Martinez',
    visitorDocument: 'DPI: 9876543210987',
    visitorPhoto: null,
    inmateName: 'Luis Hernandez',
    inmateCode: 'REC-2024-010',
    inmatePhoto: null,
    startTime: '13:45',
    elapsed: '40 min',
    remaining: '20 min',
    remainingMinutes: 20,
    status: 'normal'
  },
  {
    id: 3,
    room: 'Sala 1',
    visitorName: 'Carlos Rodriguez',
    visitorDocument: 'DPI: 1234567890123',
    visitorPhoto: null,
    inmateName: 'Pedro Ramirez',
    inmateCode: 'REC-2024-025',
    inmatePhoto: null,
    startTime: '13:30',
    elapsed: '55 min',
    remaining: '5 min',
    remainingMinutes: 5,
    status: 'warning'
  },
  {
    id: 4,
    room: 'Sala Especial',
    visitorName: 'Lic. Roberto Silva',
    visitorDocument: 'DPI: 5555555555555',
    visitorPhoto: null,
    inmateName: 'Miguel Angel Cruz',
    inmateCode: 'REC-2024-032',
    inmatePhoto: null,
    startTime: '13:00',
    elapsed: '85 min',
    remaining: '-25 min',
    remainingMinutes: -25,
    status: 'overtime'
  }
])

const recentAlerts = ref<Alert[]>([
  {
    id: 1,
    type: 'warning',
    message: 'Visita próxima a finalizar',
    time: '14:50',
    location: 'Sala 1'
  },
  {
    id: 2,
    type: 'danger',
    message: 'Visita excedió tiempo permitido',
    time: '14:25',
    location: 'Sala Especial'
  },
  {
    id: 3,
    type: 'info',
    message: 'Nueva visita iniciada',
    time: '14:00',
    location: 'Sala 1'
  }
])

const roomOccupancy = ref([
  { id: 'room1', name: 'Sala 1', occupied: 8, capacity: 10, occupancyRate: 80 },
  { id: 'room2', name: 'Sala 2', occupied: 5, capacity: 10, occupancyRate: 50 },
  { id: 'room3', name: 'Sala 3', occupied: 0, capacity: 8, occupancyRate: 0 },
  { id: 'special', name: 'Sala Especial', occupied: 2, capacity: 5, occupancyRate: 40 }
])

// Computed
const filteredVisits = computed(() => {
  if (!filterRoom.value) return activeVisits.value
  return activeVisits.value.filter(visit => visit.room.toLowerCase().includes(filterRoom.value.toLowerCase()))
})

// Methods
const getRemainingTimeClass = (minutes: number) => {
  if (minutes < 0) return 'text-danger fw-bold'
  if (minutes <= 10) return 'text-warning fw-bold'
  return 'text-success'
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    normal: 'badge badge-success',
    warning: 'badge badge-warning',
    overtime: 'badge badge-danger'
  }
  return classes[status] || 'badge badge-secondary'
}

const getAlertIcon = (type: string) => {
  const icons: Record<string, string> = {
    warning: 'fa-exclamation-triangle',
    danger: 'fa-times-circle',
    info: 'fa-info-circle'
  }
  return icons[type] || 'fa-circle'
}

const getOccupancyClass = (rate: number) => {
  if (rate >= 80) return 'bg-danger'
  if (rate >= 60) return 'bg-warning'
  return 'bg-success'
}

const handleRefresh = () => {
  lastUpdate.value = new Date().toLocaleTimeString('es-GT')
  // Refresh data
  console.log('Refreshing active visits')
}

const handleEmergency = async () => {
  const result = await Swal.fire({
    title: t('visits.activeVisits.emergencyTitle'),
    text: t('visits.activeVisits.emergencyText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel'),
    confirmButtonColor: '#d33'
  })

  if (result.isConfirmed) {
    Swal.fire({
      title: t('visits.activeVisits.emergencyActivated'),
      text: t('visits.activeVisits.emergencyActivatedText'),
      icon: 'info'
    })
  }
}

const handleViewMonitoring = (visitId: number) => {
  router.push(`/visits/monitoring/${visitId}`)
}

const handleExtendTime = async (visitId: number) => {
  const result = await Swal.fire({
    title: t('visits.activeVisits.extendTimeTitle'),
    input: 'number',
    inputLabel: t('visits.activeVisits.extendTimeLabel'),
    inputValue: 15,
    showCancelButton: true,
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel'),
    inputValidator: (value) => {
      if (!value || Number(value) <= 0) {
        return t('visits.activeVisits.extendTimeError')
      }
    }
  })

  if (result.isConfirmed) {
    console.log('Extend visit', visitId, 'by', result.value, 'minutes')
    Swal.fire({
      title: t('common.success'),
      text: t('visits.activeVisits.extendTimeSuccess'),
      icon: 'success'
    })
  }
}

const handleEndVisit = async (visitId: number) => {
  const result = await Swal.fire({
    title: t('visits.activeVisits.endVisitTitle'),
    text: t('visits.activeVisits.endVisitText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel')
  })

  if (result.isConfirmed) {
    // Remove visit from active list
    const index = activeVisits.value.findIndex(v => v.id === visitId)
    if (index > -1) {
      activeVisits.value.splice(index, 1)
    }
    
    Swal.fire({
      title: t('common.success'),
      text: t('visits.activeVisits.endVisitSuccess'),
      icon: 'success'
    })
  }
}

const handleViewAllAlerts = () => {
  console.log('View all alerts')
}

const handleDismissAlert = (alertId: number) => {
  const index = recentAlerts.value.findIndex(a => a.id === alertId)
  if (index > -1) {
    recentAlerts.value.splice(index, 1)
  }
}

// Auto-refresh
const startAutoRefresh = () => {
  refreshInterval.value = window.setInterval(() => {
    handleRefresh()
  }, 30000) // Refresh every 30 seconds
}

const stopAutoRefresh = () => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
    refreshInterval.value = null
  }
}

// Lifecycle
onMounted(() => {
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
.progress {
  background-color: #f3f6f9;
}

.h-8px {
  height: 8px !important;
}
</style>