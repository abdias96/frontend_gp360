<template>
  <div>
    <!-- begin::page-header -->
    <div class="row gy-5 g-xl-10 mb-5 mb-xl-10">
      <div class="col-md-12">
        <div class="d-flex flex-column flex-md-row align-items-center justify-content-between">
          <h1 class="fs-2x fw-bold text-gray-900 mb-4 mb-md-0">
            {{ $t('visits.visitScheduling.title') }}
          </h1>
          <div class="d-flex gap-2">
            <button class="btn btn-light-primary" @click="handleViewCalendar">
              <i class="fas fa-calendar"></i>
              {{ $t('visits.visitScheduling.viewCalendar') }}
            </button>
            <button v-if="canCreate" class="btn btn-primary" @click="handleNewSchedule">
              <i class="fas fa-plus"></i>
              {{ $t('visits.visitScheduling.newSchedule') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- end::page-header -->

    <!-- begin::date selector -->
    <div class="card mb-5">
      <div class="card-body">
        <div class="row align-items-end g-3">
          <div class="col-md-3">
            <label class="form-label">{{ $t('visits.visitScheduling.selectDate') }}</label>
            <input 
              type="date" 
              v-model="selectedDate" 
              class="form-control" 
              :min="minDate"
            />
          </div>
          <div class="col-md-3">
            <label class="form-label">{{ $t('visits.visitScheduling.visitType') }}</label>
            <select v-model="filters.visitType" class="form-select">
              <option value="">{{ $t('common.all') }}</option>
              <option value="family">{{ $t('visits.types.family') }}</option>
              <option value="legal">{{ $t('visits.types.legal') }}</option>
              <option value="religious">{{ $t('visits.types.religious') }}</option>
              <option value="social">{{ $t('visits.types.social') }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">{{ $t('visits.visitScheduling.location') }}</label>
            <select v-model="filters.location" class="form-select">
              <option value="">{{ $t('common.all') }}</option>
              <option value="room1">{{ $t('visits.visitScheduling.visitRoom') }} 1</option>
              <option value="room2">{{ $t('visits.visitScheduling.visitRoom') }} 2</option>
              <option value="room3">{{ $t('visits.visitScheduling.visitRoom') }} 3</option>
              <option value="special">{{ $t('visits.visitScheduling.specialRoom') }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <button class="btn btn-primary w-100" @click="loadSchedule">
              <i class="fas fa-search me-2"></i>
              {{ $t('visits.visitScheduling.loadSchedule') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- end::date selector -->

    <!-- begin::capacity overview -->
    <div class="row g-5 mb-5">
      <div class="col-xl-3">
        <div class="card bg-light-primary">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="svg-icon svg-icon-3x svg-icon-primary me-5">
                <i class="fas fa-calendar-day fa-2x text-primary"></i>
              </span>
              <div>
                <div class="text-primary fw-bold fs-2">{{ capacity.total }}</div>
                <div class="text-muted fw-semibold">{{ $t('visits.visitScheduling.totalCapacity') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-light-success">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="svg-icon svg-icon-3x svg-icon-success me-5">
                <i class="fas fa-check-circle fa-2x text-success"></i>
              </span>
              <div>
                <div class="text-success fw-bold fs-2">{{ capacity.scheduled }}</div>
                <div class="text-muted fw-semibold">{{ $t('visits.visitScheduling.scheduled') }}</div>
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
                <div class="text-warning fw-bold fs-2">{{ capacity.pending }}</div>
                <div class="text-muted fw-semibold">{{ $t('visits.visitScheduling.pendingApproval') }}</div>
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
                <div class="text-info fw-bold fs-2">{{ capacity.available }}</div>
                <div class="text-muted fw-semibold">{{ $t('visits.visitScheduling.available') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end::capacity overview -->

    <!-- begin::schedule grid -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          {{ $t('visits.visitScheduling.scheduleFor') }} {{ formatDate(selectedDate) }}
        </h3>
        <div class="card-toolbar">
          <button class="btn btn-sm btn-light-primary me-2" @click="handlePrintSchedule">
            <i class="fas fa-print"></i>
            {{ $t('common.print') }}
          </button>
          <button class="btn btn-sm btn-light-success" @click="handleExportSchedule">
            <i class="fas fa-download"></i>
            {{ $t('common.export') }}
          </button>
        </div>
      </div>
      <div class="card-body">
        <!-- Time slots grid -->
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr class="bg-light">
                <th class="text-center" style="width: 100px;">{{ $t('visits.visitScheduling.time') }}</th>
                <th v-for="room in visitRooms" :key="room.id" class="text-center">
                  {{ room.name }}
                  <br>
                  <small class="text-muted">{{ $t('visits.visitScheduling.capacity') }}: {{ room.capacity }}</small>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="slot in timeSlots" :key="slot.time">
                <td class="text-center fw-bold bg-light">{{ slot.time }}</td>
                <td v-for="room in visitRooms" :key="room.id" class="p-2">
                  <div v-if="getScheduledVisits(slot.time, room.id).length > 0">
                    <div 
                      v-for="visit in getScheduledVisits(slot.time, room.id)" 
                      :key="visit.id"
                      class="mb-2 p-2 rounded cursor-pointer"
                      :class="getVisitCardClass(visit)"
                      @click="handleViewVisit(visit)"
                    >
                      <div class="d-flex align-items-center mb-1">
                        <span class="badge me-2" :class="getVisitTypeBadgeClass(visit.type)">
                          {{ $t(`visits.types.${visit.type}`) }}
                        </span>
                        <span v-if="visit.priority === 'high'" class="text-danger">
                          <i class="fas fa-exclamation-triangle"></i>
                        </span>
                      </div>
                      <div class="small">
                        <strong>{{ $t('visits.visitScheduling.visitor') }}:</strong> {{ visit.visitorName }}
                        <br>
                        <strong>{{ $t('visits.visitScheduling.inmate') }}:</strong> {{ visit.inmateName }}
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center p-3">
                    <button
                      v-if="canCreate"
                      class="btn btn-sm btn-light-primary"
                      @click="handleAddVisit(slot.time, room.id)"
                    >
                      <i class="fas fa-plus"></i>
                      {{ $t('visits.visitScheduling.addVisit') }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Legend -->
        <div class="mt-5">
          <h5 class="mb-3">{{ $t('visits.visitScheduling.legend') }}</h5>
          <div class="d-flex flex-wrap gap-3">
            <div class="d-flex align-items-center">
              <div class="w-20px h-20px bg-light-primary rounded me-2"></div>
              <span class="text-muted">{{ $t('visits.visitScheduling.scheduled') }}</span>
            </div>
            <div class="d-flex align-items-center">
              <div class="w-20px h-20px bg-light-warning rounded me-2"></div>
              <span class="text-muted">{{ $t('visits.visitScheduling.pending') }}</span>
            </div>
            <div class="d-flex align-items-center">
              <div class="w-20px h-20px bg-light-success rounded me-2"></div>
              <span class="text-muted">{{ $t('visits.visitScheduling.inProgress') }}</span>
            </div>
            <div class="d-flex align-items-center">
              <div class="w-20px h-20px bg-light-secondary rounded me-2"></div>
              <span class="text-muted">{{ $t('visits.visitScheduling.completed') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end::schedule grid -->

    <!-- Visit Detail Modal -->
    <div class="modal fade" id="visitDetailModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" v-if="selectedVisit">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t('visits.visitScheduling.visitDetails') }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label text-muted">{{ $t('visits.visitScheduling.visitor') }}</label>
              <p class="text-gray-900 fw-bold mb-0">{{ selectedVisit.visitorName }}</p>
              <p class="text-muted">{{ selectedVisit.visitorDocument }}</p>
            </div>
            <div class="mb-3">
              <label class="form-label text-muted">{{ $t('visits.visitScheduling.inmate') }}</label>
              <p class="text-gray-900 fw-bold mb-0">{{ selectedVisit.inmateName }}</p>
              <p class="text-muted">{{ selectedVisit.inmateCode }}</p>
            </div>
            <div class="row mb-3">
              <div class="col-6">
                <label class="form-label text-muted">{{ $t('visits.visitScheduling.time') }}</label>
                <p class="text-gray-900">{{ selectedVisit.time }}</p>
              </div>
              <div class="col-6">
                <label class="form-label text-muted">{{ $t('visits.visitScheduling.duration') }}</label>
                <p class="text-gray-900">{{ selectedVisit.duration }} {{ $t('common.minutes') }}</p>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label text-muted">{{ $t('visits.visitScheduling.status') }}</label>
              <p>
                <span :class="getStatusBadgeClass(selectedVisit.status)">
                  {{ $t(`visits.visitStatus.${selectedVisit.status}`) }}
                </span>
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              {{ $t('common.close') }}
            </button>
            <button 
              v-if="selectedVisit.status === 'pending'"
              type="button" 
              class="btn btn-primary"
              @click="handleConfirmVisit"
            >
              {{ $t('visits.visitScheduling.confirm') }}
            </button>
            <button 
              v-if="selectedVisit.status === 'scheduled'"
              type="button" 
              class="btn btn-danger"
              @click="handleCancelVisit"
            >
              {{ $t('visits.visitScheduling.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Modal } from 'bootstrap'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'

// Composables
const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()

// Permission checks
const canCreate = computed(() => authStore.isSuperAdmin || authStore.hasPermission('visits.scheduling_create'))
const canEdit = computed(() => authStore.isSuperAdmin || authStore.hasPermission('visits.scheduling_edit'))

// Types
interface Visit {
  id: number
  visitorName: string
  visitorDocument: string
  inmateName: string
  inmateCode: string
  type: string
  time: string
  duration: number
  roomId: string
  status: string
  priority: string
}

// Refs
const selectedDate = ref(new Date().toISOString().split('T')[0])
const minDate = ref(new Date().toISOString().split('T')[0])
const filters = ref({
  visitType: '',
  location: ''
})

const capacity = ref({
  total: 120,
  scheduled: 45,
  pending: 12,
  available: 63
})

const visitRooms = ref([
  { id: 'room1', name: 'Sala de Visitas 1', capacity: 20 },
  { id: 'room2', name: 'Sala de Visitas 2', capacity: 20 },
  { id: 'room3', name: 'Sala de Visitas 3', capacity: 15 },
  { id: 'special', name: 'Sala Especial', capacity: 10 }
])

const timeSlots = ref([
  { time: '08:00' },
  { time: '09:00' },
  { time: '10:00' },
  { time: '11:00' },
  { time: '14:00' },
  { time: '15:00' },
  { time: '16:00' }
])

const scheduledVisits = ref<Visit[]>([
  {
    id: 1,
    visitorName: 'María García',
    visitorDocument: 'DPI: 2547896321234',
    inmateName: 'Juan García',
    inmateCode: 'REC-2024-001',
    type: 'family',
    time: '09:00',
    duration: 60,
    roomId: 'room1',
    status: 'scheduled',
    priority: 'normal'
  },
  {
    id: 2,
    visitorName: 'Lic. Carlos Mendez',
    visitorDocument: 'DPI: 1234567890123',
    inmateName: 'Pedro Ramirez',
    inmateCode: 'REC-2024-025',
    type: 'legal',
    time: '10:00',
    duration: 60,
    roomId: 'room2',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 3,
    visitorName: 'Ana Martinez',
    visitorDocument: 'DPI: 9876543210987',
    inmateName: 'Luis Hernandez',
    inmateCode: 'REC-2024-010',
    type: 'family',
    time: '14:00',
    duration: 60,
    roomId: 'room1',
    status: 'inProgress',
    priority: 'normal'
  }
])

const selectedVisit = ref<Visit | null>(null)
let visitDetailModal: Modal | null = null

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-GT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getScheduledVisits = (time: string, roomId: string) => {
  return scheduledVisits.value.filter(visit => 
    visit.time === time && 
    visit.roomId === roomId &&
    (!filters.value.visitType || visit.type === filters.value.visitType)
  )
}

const getVisitCardClass = (visit: Visit) => {
  const statusClasses: Record<string, string> = {
    scheduled: 'bg-light-primary',
    pending: 'bg-light-warning',
    inProgress: 'bg-light-success',
    completed: 'bg-light-secondary'
  }
  return statusClasses[visit.status] || 'bg-light'
}

const getVisitTypeBadgeClass = (type: string) => {
  const typeClasses: Record<string, string> = {
    family: 'badge-light-info',
    legal: 'badge-light-danger',
    religious: 'badge-light-primary',
    social: 'badge-light-warning'
  }
  return typeClasses[type] || 'badge-light'
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    scheduled: 'badge badge-primary',
    pending: 'badge badge-warning',
    inProgress: 'badge badge-success',
    completed: 'badge badge-secondary',
    cancelled: 'badge badge-danger'
  }
  return classes[status] || 'badge badge-secondary'
}

const loadSchedule = () => {
  console.log('Loading schedule for:', selectedDate.value)
  // Load schedule data
}

const handleViewCalendar = () => {
  // Show calendar view
  console.log('View calendar')
}

const handleNewSchedule = () => {
  router.push('/visits/requests/new')
}

const handleAddVisit = (time: string, roomId: string) => {
  router.push(`/visits/requests/new?time=${time}&room=${roomId}&date=${selectedDate.value}`)
}

const handleViewVisit = (visit: Visit) => {
  selectedVisit.value = visit
  visitDetailModal?.show()
}

const handleConfirmVisit = async () => {
  if (!selectedVisit.value) return

  const result = await Swal.fire({
    title: t('visits.visitScheduling.confirmTitle'),
    text: t('visits.visitScheduling.confirmText'),
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel')
  })

  if (result.isConfirmed) {
    selectedVisit.value.status = 'scheduled'
    visitDetailModal?.hide()
    
    Swal.fire({
      title: t('common.success'),
      text: t('visits.visitScheduling.confirmSuccess'),
      icon: 'success'
    })
  }
}

const handleCancelVisit = async () => {
  if (!selectedVisit.value) return

  const result = await Swal.fire({
    title: t('visits.visitScheduling.cancelTitle'),
    text: t('visits.visitScheduling.cancelText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel')
  })

  if (result.isConfirmed) {
    // Remove visit from schedule
    const index = scheduledVisits.value.findIndex(v => v.id === selectedVisit.value?.id)
    if (index > -1) {
      scheduledVisits.value.splice(index, 1)
    }
    
    visitDetailModal?.hide()
    
    Swal.fire({
      title: t('common.success'),
      text: t('visits.visitScheduling.cancelSuccess'),
      icon: 'success'
    })
  }
}

const handlePrintSchedule = () => {
  window.print()
}

const handleExportSchedule = () => {
  console.log('Export schedule')
}

// Lifecycle
onMounted(() => {
  const modalElement = document.getElementById('visitDetailModal')
  if (modalElement) {
    visitDetailModal = new Modal(modalElement)
  }
  
  loadSchedule()
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  opacity: 0.8;
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #e4e6ef;
}

@media print {
  .btn,
  .card-toolbar,
  .page-header {
    display: none !important;
  }
}
</style>