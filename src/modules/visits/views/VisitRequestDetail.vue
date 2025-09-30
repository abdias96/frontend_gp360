<template>
  <div>
    <!-- begin::page-header -->
    <div class="row gy-5 g-xl-10 mb-5 mb-xl-10">
      <div class="col-md-12">
        <div class="d-flex flex-column flex-md-row align-items-center justify-content-between">
          <h1 class="fs-2x fw-bold text-gray-900 mb-4 mb-md-0">
            {{ $t('visits.visitRequestDetail.title') }} #{{ request.id }}
          </h1>
          <div class="d-flex gap-2">
            <router-link to="/visits/requests" class="btn btn-light-primary">
              <i class="fas fa-arrow-left"></i>
              {{ $t('common.back') }}
            </router-link>
            <button 
              v-if="request.status === 'pending'"
              class="btn btn-success" 
              @click="handleApprove"
            >
              <i class="fas fa-check"></i>
              {{ $t('visits.visitRequestDetail.approve') }}
            </button>
            <button 
              v-if="request.status === 'pending'"
              class="btn btn-danger" 
              @click="handleReject"
            >
              <i class="fas fa-times"></i>
              {{ $t('visits.visitRequestDetail.reject') }}
            </button>
            <button 
              v-if="request.status === 'approved'"
              class="btn btn-primary" 
              @click="handleSchedule"
            >
              <i class="fas fa-calendar"></i>
              {{ $t('visits.visitRequestDetail.schedule') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- end::page-header -->

    <!-- begin::status alert -->
    <div v-if="request.status !== 'pending'" class="alert alert-dismissible bg-light-primary d-flex flex-column flex-sm-row p-5 mb-5">
      <i :class="getStatusIcon(request.status)" class="fs-2hx text-primary me-4"></i>
      <div class="d-flex flex-column text-primary pe-0 pe-sm-10">
        <h4 class="mb-2 text-primary">{{ $t(`visits.requestStatus.${request.status}`) }}</h4>
        <span>{{ getStatusMessage() }}</span>
      </div>
    </div>
    <!-- end::status alert -->

    <!-- begin::content -->
    <div class="row gy-5 g-xl-10">
      <!-- Request Information -->
      <div class="col-xl-8">
        <div class="card mb-5">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitRequestDetail.requestInfo') }}</h3>
            <div class="card-toolbar">
              <span :class="getStatusBadgeClass(request.status)" class="fs-6">
                {{ $t(`visits.requestStatus.${request.status}`) }}
              </span>
            </div>
          </div>
          <div class="card-body">
            <div class="row mb-5">
              <div class="col-md-6">
                <label class="form-label text-muted">{{ $t('visits.visitRequestDetail.requestNumber') }}</label>
                <p class="text-gray-900 fw-bold">#{{ request.id }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label text-muted">{{ $t('visits.visitRequestDetail.requestDate') }}</label>
                <p class="text-gray-900">{{ formatDateTime(request.requestDate) }}</p>
              </div>
            </div>
            <div class="row mb-5">
              <div class="col-md-6">
                <label class="form-label text-muted">{{ $t('visits.visitRequestDetail.visitType') }}</label>
                <p>
                  <span class="badge badge-light-info fs-7">{{ $t(`visits.types.${request.visitType}`) }}</span>
                </p>
              </div>
              <div class="col-md-6">
                <label class="form-label text-muted">{{ $t('visits.visitRequestDetail.priority') }}</label>
                <p>
                  <span :class="getPriorityBadgeClass(request.priority)">
                    {{ $t(`visits.priority.${request.priority}`) }}
                  </span>
                  <span v-if="request.urgent" class="ms-2">
                    <i class="fas fa-exclamation-triangle text-danger"></i>
                    {{ $t('visits.visitRequestDetail.urgent') }}
                  </span>
                </p>
              </div>
            </div>
            <div class="row mb-5">
              <div class="col-md-6">
                <label class="form-label text-muted">{{ $t('visits.visitRequestDetail.requestedDate') }}</label>
                <p class="text-gray-900 fw-bold">{{ formatDate(request.requestedDate) }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label text-muted">{{ $t('visits.visitRequestDetail.requestedTime') }}</label>
                <p class="text-gray-900 fw-bold">{{ request.requestedTime }}</p>
              </div>
            </div>
            <div class="row mb-5">
              <div class="col-md-6">
                <label class="form-label text-muted">{{ $t('visits.visitRequestDetail.duration') }}</label>
                <p class="text-gray-900">{{ request.duration }} {{ $t('common.minutes') }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label text-muted">{{ $t('visits.visitRequestDetail.location') }}</label>
                <p class="text-gray-900">{{ request.location || $t('visits.visitRequestDetail.toBeAssigned') }}</p>
              </div>
            </div>
            <div class="mb-5">
              <label class="form-label text-muted">{{ $t('visits.visitRequestDetail.purpose') }}</label>
              <p class="text-gray-900">{{ request.purpose }}</p>
            </div>
            <div v-if="request.specialRequirements">
              <label class="form-label text-muted">{{ $t('visits.visitRequestDetail.specialRequirements') }}</label>
              <p class="text-gray-900">{{ request.specialRequirements }}</p>
            </div>
          </div>
        </div>

        <!-- Visitor & Inmate Information -->
        <div class="row">
          <div class="col-md-6">
            <div class="card h-100">
              <div class="card-header">
                <h3 class="card-title">{{ $t('visits.visitRequestDetail.visitorInfo') }}</h3>
              </div>
              <div class="card-body">
                <div class="text-center mb-5">
                  <div class="symbol symbol-100px mb-3">
                    <img :src="request.visitor.photo || '/media/avatars/blank.png'" alt="Visitor" />
                  </div>
                  <h5 class="text-gray-900 fw-bold mb-1">{{ request.visitor.name }}</h5>
                  <p class="text-muted">{{ request.visitor.documentType }}: {{ request.visitor.documentNumber }}</p>
                </div>
                <div class="mb-3">
                  <label class="form-label text-muted">{{ $t('visits.visitRequestDetail.relationship') }}</label>
                  <p class="text-gray-900 fw-bold">{{ request.visitor.relationship }}</p>
                </div>
                <div class="mb-3">
                  <label class="form-label text-muted">{{ $t('visits.visitRequestDetail.phone') }}</label>
                  <p class="text-gray-900">{{ request.visitor.phone }}</p>
                </div>
                <div class="mb-3">
                  <label class="form-label text-muted">{{ $t('visits.visitRequestDetail.biometricStatus') }}</label>
                  <p>
                    <span v-if="request.visitor.biometricRegistered" class="badge badge-success">
                      <i class="fas fa-fingerprint me-1"></i>
                      {{ $t('visits.visitRequestDetail.biometricRegistered') }}
                    </span>
                    <span v-else class="badge badge-warning">
                      <i class="fas fa-exclamation-triangle me-1"></i>
                      {{ $t('visits.visitRequestDetail.biometricPending') }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card h-100">
              <div class="card-header">
                <h3 class="card-title">{{ $t('visits.visitRequestDetail.inmateInfo') }}</h3>
              </div>
              <div class="card-body">
                <div class="text-center mb-5">
                  <div class="symbol symbol-100px mb-3">
                    <img :src="request.inmate.photo || '/media/avatars/blank.png'" alt="Inmate" />
                  </div>
                  <h5 class="text-gray-900 fw-bold mb-1">{{ request.inmate.name }}</h5>
                  <p>
                    <span class="badge badge-light-primary">{{ request.inmate.code }}</span>
                  </p>
                </div>
                <div class="mb-3">
                  <label class="form-label text-muted">{{ $t('visits.visitRequestDetail.location') }}</label>
                  <p class="text-gray-900">{{ request.inmate.location }}</p>
                </div>
                <div class="mb-3">
                  <label class="form-label text-muted">{{ $t('visits.visitRequestDetail.securityLevel') }}</label>
                  <p>
                    <span :class="getSecurityBadgeClass(request.inmate.securityLevel)">
                      {{ $t(`visits.securityLevel.${request.inmate.securityLevel}`) }}
                    </span>
                  </p>
                </div>
                <div class="mb-3">
                  <label class="form-label text-muted">{{ $t('visits.visitRequestDetail.visitRestrictions') }}</label>
                  <p v-if="request.inmate.restrictions.length > 0">
                    <span v-for="restriction in request.inmate.restrictions" :key="restriction" class="badge badge-light-danger me-1">
                      {{ restriction }}
                    </span>
                  </p>
                  <p v-else class="text-muted">{{ $t('visits.visitRequestDetail.noRestrictions') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="col-xl-4">
        <!-- Approval History -->
        <div class="card mb-5">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitRequestDetail.approvalHistory') }}</h3>
          </div>
          <div class="card-body">
            <div class="timeline">
              <div v-for="event in approvalHistory" :key="event.id" class="timeline-item">
                <div class="timeline-line"></div>
                <div class="timeline-icon">
                  <i :class="getEventIcon(event.type)" class="text-gray-600 fs-3"></i>
                </div>
                <div class="timeline-content mb-5">
                  <div class="fw-bold text-gray-800 ps-3">{{ event.action }}</div>
                  <div class="text-muted ps-3">
                    {{ event.user }} - {{ formatDateTime(event.date) }}
                  </div>
                  <div v-if="event.notes" class="text-gray-600 ps-3 mt-1">
                    {{ event.notes }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card mb-5">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitRequestDetail.quickActions') }}</h3>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <button class="btn btn-light-primary" @click="handlePrint">
                <i class="fas fa-print me-2"></i>
                {{ $t('visits.visitRequestDetail.printRequest') }}
              </button>
              <button class="btn btn-light-info" @click="handleViewVisitorHistory">
                <i class="fas fa-history me-2"></i>
                {{ $t('visits.visitRequestDetail.viewVisitorHistory') }}
              </button>
              <button class="btn btn-light-warning" @click="handleContactVisitor">
                <i class="fas fa-phone me-2"></i>
                {{ $t('visits.visitRequestDetail.contactVisitor') }}
              </button>
              <button v-if="request.status === 'scheduled'" class="btn btn-light-danger" @click="handleCancel">
                <i class="fas fa-ban me-2"></i>
                {{ $t('visits.visitRequestDetail.cancelVisit') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitRequestDetail.notes') }}</h3>
          </div>
          <div class="card-body">
            <div v-if="notes.length > 0" class="mb-5">
              <div v-for="note in notes" :key="note.id" class="mb-3 p-3 bg-light rounded">
                <div class="d-flex justify-content-between mb-1">
                  <span class="fw-bold text-gray-800">{{ note.user }}</span>
                  <span class="text-muted fs-7">{{ formatDateTime(note.date) }}</span>
                </div>
                <p class="text-gray-600 mb-0">{{ note.text }}</p>
              </div>
            </div>
            <div class="mb-3">
              <textarea 
                v-model="newNote"
                class="form-control" 
                rows="3" 
                :placeholder="$t('visits.visitRequestDetail.addNotePlaceholder')"
              ></textarea>
            </div>
            <button class="btn btn-primary btn-sm" @click="handleAddNote">
              <i class="fas fa-plus me-1"></i>
              {{ $t('visits.visitRequestDetail.addNote') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- end::content -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

// Composables
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// Refs
const request = ref({
  id: 1,
  requestDate: '2024-03-15T10:30:00',
  status: 'pending',
  visitType: 'family',
  priority: 'normal',
  urgent: false,
  requestedDate: '2024-03-20',
  requestedTime: '14:00 - 15:00',
  duration: 60,
  location: null,
  purpose: 'Visita familiar regular para mantener vínculos familiares',
  specialRequirements: 'Visitante requiere acceso para silla de ruedas',
  visitor: {
    id: 1,
    name: 'María García López',
    documentType: 'DPI',
    documentNumber: '2547896321234',
    phone: '+502 5555-1234',
    relationship: 'Hermana',
    photo: null,
    biometricRegistered: true
  },
  inmate: {
    id: 1,
    name: 'Juan García López',
    code: 'REC-2024-001',
    location: 'Sector A - Celda 15',
    securityLevel: 'medium',
    photo: null,
    restrictions: []
  }
})

const approvalHistory = ref([
  {
    id: 1,
    type: 'created',
    action: 'Solicitud creada',
    user: 'María García López',
    date: '2024-03-15T10:30:00',
    notes: null
  },
  {
    id: 2,
    type: 'review',
    action: 'En revisión',
    user: 'Oficial Juan Pérez',
    date: '2024-03-15T11:00:00',
    notes: 'Verificando documentación'
  }
])

const notes = ref([
  {
    id: 1,
    user: 'Oficial Juan Pérez',
    date: '2024-03-15T11:00:00',
    text: 'Documentación en orden. Verificar disponibilidad de sala para personas con movilidad reducida.'
  }
])

const newNote = ref('')

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-GT')
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('es-GT')
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'badge badge-warning',
    approved: 'badge badge-success',
    rejected: 'badge badge-danger',
    scheduled: 'badge badge-primary',
    completed: 'badge badge-light-success',
    cancelled: 'badge badge-light-danger'
  }
  return classes[status] || 'badge badge-secondary'
}

const getPriorityBadgeClass = (priority: string) => {
  const classes: Record<string, string> = {
    low: 'badge badge-light-info',
    normal: 'badge badge-light-primary',
    high: 'badge badge-light-warning'
  }
  return classes[priority] || 'badge badge-secondary'
}

const getSecurityBadgeClass = (level: string) => {
  const classes: Record<string, string> = {
    minimum: 'badge badge-light-success',
    medium: 'badge badge-light-warning',
    maximum: 'badge badge-light-danger'
  }
  return classes[level] || 'badge badge-secondary'
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    pending: 'fas fa-clock',
    approved: 'fas fa-check-circle',
    rejected: 'fas fa-times-circle',
    scheduled: 'fas fa-calendar-check',
    completed: 'fas fa-check-double',
    cancelled: 'fas fa-ban'
  }
  return icons[status] || 'fas fa-question-circle'
}

const getEventIcon = (type: string) => {
  const icons: Record<string, string> = {
    created: 'fas fa-plus-circle',
    review: 'fas fa-eye',
    approved: 'fas fa-check',
    rejected: 'fas fa-times',
    scheduled: 'fas fa-calendar',
    completed: 'fas fa-flag-checkered',
    cancelled: 'fas fa-ban'
  }
  return icons[type] || 'fas fa-circle'
}

const getStatusMessage = () => {
  const messages: Record<string, string> = {
    approved: t('visits.visitRequestDetail.approvedMessage'),
    rejected: t('visits.visitRequestDetail.rejectedMessage'),
    scheduled: t('visits.visitRequestDetail.scheduledMessage'),
    completed: t('visits.visitRequestDetail.completedMessage'),
    cancelled: t('visits.visitRequestDetail.cancelledMessage')
  }
  return messages[request.value.status] || ''
}

const handleApprove = async () => {
  const result = await Swal.fire({
    title: t('visits.visitRequestDetail.approveTitle'),
    text: t('visits.visitRequestDetail.approveText'),
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: t('common.approve'),
    cancelButtonText: t('common.cancel')
  })

  if (result.isConfirmed) {
    request.value.status = 'approved'
    approvalHistory.value.push({
      id: approvalHistory.value.length + 1,
      type: 'approved',
      action: 'Solicitud aprobada',
      user: 'Oficial Juan Pérez',
      date: new Date().toISOString(),
      notes: null
    })
    
    Swal.fire({
      title: t('common.success'),
      text: t('visits.visitRequestDetail.approveSuccess'),
      icon: 'success'
    })
  }
}

const handleReject = async () => {
  const result = await Swal.fire({
    title: t('visits.visitRequestDetail.rejectTitle'),
    input: 'textarea',
    inputLabel: t('visits.visitRequestDetail.rejectReason'),
    inputPlaceholder: t('visits.visitRequestDetail.rejectReasonPlaceholder'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('common.reject'),
    cancelButtonText: t('common.cancel'),
    inputValidator: (value) => {
      if (!value) {
        return t('visits.visitRequestDetail.rejectReasonRequired')
      }
    }
  })

  if (result.isConfirmed) {
    request.value.status = 'rejected'
    approvalHistory.value.push({
      id: approvalHistory.value.length + 1,
      type: 'rejected',
      action: 'Solicitud rechazada',
      user: 'Oficial Juan Pérez',
      date: new Date().toISOString(),
      notes: result.value
    })
    
    Swal.fire({
      title: t('common.success'),
      text: t('visits.visitRequestDetail.rejectSuccess'),
      icon: 'success'
    })
  }
}

const handleSchedule = () => {
  router.push(`/visits/scheduling?request=${request.value.id}`)
}

const handleCancel = async () => {
  const result = await Swal.fire({
    title: t('visits.visitRequestDetail.cancelTitle'),
    text: t('visits.visitRequestDetail.cancelText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel')
  })

  if (result.isConfirmed) {
    request.value.status = 'cancelled'
    Swal.fire({
      title: t('common.success'),
      text: t('visits.visitRequestDetail.cancelSuccess'),
      icon: 'success'
    })
  }
}

const handleAddNote = () => {
  if (!newNote.value.trim()) return
  
  notes.value.push({
    id: notes.value.length + 1,
    user: 'Oficial Juan Pérez',
    date: new Date().toISOString(),
    text: newNote.value
  })
  
  newNote.value = ''
}

const handlePrint = () => {
  window.print()
}

const handleViewVisitorHistory = () => {
  router.push(`/visits/visitors/${request.value.visitor.id}`)
}

const handleContactVisitor = () => {
  console.log('Contact visitor:', request.value.visitor.phone)
}

// Lifecycle
onMounted(() => {
  // Load request data based on route.params.id
  console.log('Loading request:', route.params.id)
})
</script>

<style scoped>
.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline-item {
  position: relative;
}

.timeline-line {
  position: absolute;
  left: 9px;
  top: 20px;
  width: 2px;
  height: calc(100% + 10px);
  background-color: #e4e6ef;
}

.timeline-item:last-child .timeline-line {
  display: none;
}

.timeline-icon {
  position: absolute;
  left: 0;
  top: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #f3f6f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-content {
  padding-left: 20px;
}
</style>