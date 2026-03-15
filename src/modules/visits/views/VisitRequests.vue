<template>
  <div>
    <!-- begin::page-header -->
    <div class="row gy-5 g-xl-10 mb-5 mb-xl-10">
      <div class="col-md-12">
        <div class="d-flex flex-column flex-md-row align-items-center justify-content-between">
          <h1 class="fs-2x fw-bold text-gray-900 mb-4 mb-md-0">
            {{ $t('visits.visitRequests.title') }}
          </h1>
          <button v-if="canCreate" class="btn btn-primary" @click="handleNewRequest">
            <i class="fas fa-plus"></i>
            {{ $t('visits.visitRequests.newRequest') }}
          </button>
        </div>
      </div>
    </div>
    <!-- end::page-header -->

    <!-- begin::filters -->
    <div class="card mb-5">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">{{ $t('visits.visitRequests.filterByStatus') }}</label>
            <select v-model="filters.status" class="form-select">
              <option value="">{{ $t('common.all') }}</option>
              <option value="pending">{{ $t('visits.requestStatus.pending') }}</option>
              <option value="approved">{{ $t('visits.requestStatus.approved') }}</option>
              <option value="rejected">{{ $t('visits.requestStatus.rejected') }}</option>
              <option value="scheduled">{{ $t('visits.requestStatus.scheduled') }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">{{ $t('visits.visitRequests.filterByDate') }}</label>
            <input type="date" v-model="filters.date" class="form-control" />
          </div>
          <div class="col-md-3">
            <label class="form-label">{{ $t('visits.visitRequests.filterByType') }}</label>
            <select v-model="filters.type" class="form-select">
              <option value="">{{ $t('common.all') }}</option>
              <option value="family">{{ $t('visits.types.family') }}</option>
              <option value="legal">{{ $t('visits.types.legal') }}</option>
              <option value="religious">{{ $t('visits.types.religious') }}</option>
              <option value="social">{{ $t('visits.types.social') }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">{{ $t('common.search') }}</label>
            <input 
              type="text" 
              v-model="filters.search" 
              class="form-control" 
              :placeholder="$t('visits.visitRequests.searchPlaceholder')"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- end::filters -->

    <!-- begin::stats -->
    <div class="row g-5 mb-5">
      <div class="col-xl-3">
        <div class="card bg-light-warning">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="svg-icon svg-icon-3x svg-icon-warning me-5">
                <i class="fas fa-clock fa-2x text-warning"></i>
              </span>
              <div>
                <div class="text-warning fw-bold fs-2">{{ stats.pending }}</div>
                <div class="text-muted fw-semibold">{{ $t('visits.visitRequests.pendingRequests') }}</div>
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
                <div class="text-success fw-bold fs-2">{{ stats.approved }}</div>
                <div class="text-muted fw-semibold">{{ $t('visits.visitRequests.approvedToday') }}</div>
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
                <i class="fas fa-times-circle fa-2x text-danger"></i>
              </span>
              <div>
                <div class="text-danger fw-bold fs-2">{{ stats.rejected }}</div>
                <div class="text-muted fw-semibold">{{ $t('visits.visitRequests.rejectedToday') }}</div>
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
                <i class="fas fa-calendar-check fa-2x text-primary"></i>
              </span>
              <div>
                <div class="text-primary fw-bold fs-2">{{ stats.scheduled }}</div>
                <div class="text-muted fw-semibold">{{ $t('visits.visitRequests.scheduledToday') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end::stats -->

    <!-- begin::requests list -->
    <div class="card">
      <div class="card-header border-0">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label fw-bold fs-3 mb-1">{{ $t('visits.visitRequests.requestsList') }}</span>
          <span class="text-muted mt-1 fw-semibold fs-7">{{ visitRequests.length }} {{ $t('visits.visitRequests.totalRequests') }}</span>
        </h3>
        <div class="card-toolbar">
          <button class="btn btn-sm btn-light-primary" @click="handleExport">
            <i class="fas fa-download"></i>
            {{ $t('common.export') }}
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
            <thead>
              <tr class="fw-bold text-muted">
                <th class="min-w-50px">#</th>
                <th class="min-w-150px">{{ $t('visits.visitRequests.requestDate') }}</th>
                <th class="min-w-200px">{{ $t('visits.visitRequests.visitor') }}</th>
                <th class="min-w-200px">{{ $t('visits.visitRequests.inmate') }}</th>
                <th class="min-w-120px">{{ $t('visits.visitRequests.visitType') }}</th>
                <th class="min-w-150px">{{ $t('visits.visitRequests.requestedDate') }}</th>
                <th class="min-w-120px">{{ $t('visits.visitRequests.status') }}</th>
                <th class="min-w-150px">{{ $t('visits.visitRequests.priority') }}</th>
                <th class="text-end min-w-100px">{{ $t('common.actions.title') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in paginatedRequests" :key="request.id">
                <td>
                  <span class="text-gray-900 fw-bold">{{ request.id }}</span>
                </td>
                <td>
                  <span class="text-gray-900">{{ formatDate(request.requestDate) }}</span>
                  <br>
                  <span class="text-muted fs-7">{{ formatTime(request.requestDate) }}</span>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-40px me-3">
                      <img :src="request.visitorPhoto || '/media/avatars/blank.png'" alt="" />
                    </div>
                    <div>
                      <span class="text-gray-900 fw-bold">{{ request.visitorName }}</span>
                      <span v-if="request.visitorSource === 'public_website'" class="badge badge-light-info ms-2 fs-8">Web</span>
                      <br>
                      <span class="text-muted fs-7">{{ request.visitorDocument }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-40px me-3">
                      <img :src="request.inmatePhoto || '/media/avatars/blank.png'" alt="" />
                    </div>
                    <div>
                      <span class="text-gray-900 fw-bold">{{ request.inmateName }}</span>
                      <br>
                      <span class="badge badge-light-primary">{{ request.inmateCode }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge badge-light-info">{{ $t(`visits.types.${request.visitType}`) }}</span>
                </td>
                <td>
                  <span class="text-gray-900 fw-bold">{{ formatDate(request.requestedDate) }}</span>
                  <br>
                  <span class="text-muted fs-7">{{ request.requestedTime }}</span>
                </td>
                <td>
                  <span :class="getStatusBadgeClass(request.status)">
                    {{ $t(`visits.requestStatus.${request.status}`) }}
                  </span>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <span :class="getPriorityBadgeClass(request.priority)">
                      {{ $t(`visits.priority.${request.priority}`) }}
                    </span>
                    <span v-if="request.urgent" class="ms-2">
                      <i class="fas fa-exclamation-triangle text-danger" :title="$t('visits.visitRequests.urgent')"></i>
                    </span>
                  </div>
                </td>
                <td class="text-end">
                  <router-link 
                    :to="`/visits/requests/${request.id}`"
                    class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                    :title="$t('common.view')"
                  >
                    <i class="fas fa-eye"></i>
                  </router-link>
                  <button
                    v-if="request.status === 'pending' && canApprove"
                    @click="handleApprove(request.id)"
                    class="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1"
                    :title="$t('visits.visitRequests.approve')"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button
                    v-if="request.status === 'pending' && canApprove"
                    @click="handleReject(request.id)"
                    class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                    :title="$t('visits.visitRequests.reject')"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="d-flex justify-content-between align-items-center mt-5">
          <div>
            <span class="text-muted">
              {{ $t('common.showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }} - 
              {{ Math.min(currentPage * itemsPerPage, visitRequests.length) }} 
              {{ $t('common.of') }} {{ visitRequests.length }} {{ $t('common.entries') }}
            </span>
          </div>
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" @click="currentPage--" href="javascript:void(0)">
                <i class="fas fa-chevron-left"></i>
              </a>
            </li>
            <li 
              v-for="page in totalPages" 
              :key="page"
              class="page-item" 
              :class="{ active: currentPage === page }"
            >
              <a class="page-link" @click="currentPage = page" href="javascript:void(0)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" @click="currentPage++" href="javascript:void(0)">
                <i class="fas fa-chevron-right"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- end::requests list -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'
import ApiService from '@/core/services/ApiService'

// Composables
const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()

// Permission checks
const canCreate = computed(() => authStore.isSuperAdmin || authStore.hasPermission('visits.requests_create'))
const canEdit = computed(() => authStore.isSuperAdmin || authStore.hasPermission('visits.requests_edit'))
const canDelete = computed(() => authStore.isSuperAdmin || authStore.hasPermission('visits.requests_delete'))
const canApprove = computed(() => authStore.isSuperAdmin || authStore.hasPermission('visits.requests_approve'))

// Refs
const loading = ref(false)
const filters = ref({
  status: '',
  date: '',
  type: '',
  search: ''
})

const stats = ref({
  pending: 0,
  approved: 0,
  rejected: 0,
  scheduled: 0
})

const visitRequests = ref<any[]>([])
const pagination = ref({ current_page: 1, last_page: 1, total: 0 })

const currentPage = ref(1)
const itemsPerPage = 15

// Load data from API
const loadRequests = async () => {
  loading.value = true
  try {
    const params: any = { per_page: itemsPerPage, page: currentPage.value }
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.date) params.date_from = filters.value.date
    if (filters.value.search) params.search = filters.value.search

    const { data } = await ApiService.get('/visit-requests', params)
    if (data.success) {
      const apiData = data.data
      visitRequests.value = (apiData.data || []).map((r: any) => ({
        id: r.id,
        requestDate: r.created_at,
        requestNumber: r.request_number,
        visitorName: r.visitor ? `${r.visitor.first_name || ''} ${r.visitor.first_surname || ''}`.trim() : '-',
        visitorDocument: r.visitor?.document_number ? `DPI: ${r.visitor.document_number}` : '',
        visitorPhoto: null,
        visitorSource: r.visitor?.source || 'internal',
        inmateName: r.inmate ? `${r.inmate.first_name || ''} ${r.inmate.last_name || ''}`.trim() : 'Sin asignar',
        inmateCode: r.inmate?.id ? `ID-${r.inmate.id}` : '',
        inmatePhoto: null,
        visitType: r.visit_type?.name || 'general',
        requestedDate: r.requested_visit_date,
        requestedTime: r.start_time && r.end_time ? `${r.start_time} - ${r.end_time}` : '',
        status: r.status,
        priority: 'normal',
        urgent: false
      }))
      pagination.value = {
        current_page: apiData.current_page || 1,
        last_page: apiData.last_page || 1,
        total: apiData.total || 0
      }
    }
  } catch (err) {
    console.error('Error loading visit requests:', err)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const { data } = await ApiService.get('/visit-requests/statistics')
    if (data.success) {
      stats.value = {
        pending: data.data.pending || 0,
        approved: data.data.today_approved || data.data.approved || 0,
        rejected: data.data.rejected || 0,
        scheduled: data.data.from_public_website || 0
      }
    }
  } catch (err) {
    console.error('Error loading stats:', err)
  }
}

onMounted(() => {
  loadRequests()
  loadStats()
})

// Watch filters and reload
let filterTimeout: any = null
watch(filters, () => {
  clearTimeout(filterTimeout)
  filterTimeout = setTimeout(() => {
    currentPage.value = 1
    loadRequests()
  }, 500)
}, { deep: true })

watch(currentPage, () => loadRequests())

// Computed
const paginatedRequests = computed(() => visitRequests.value)
const totalPages = computed(() => pagination.value.last_page)

// Methods
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('es-GT')
}

const formatTime = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleTimeString('es-GT', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'badge badge-warning',
    approved: 'badge badge-success',
    rejected: 'badge badge-danger',
    scheduled: 'badge badge-primary',
    cancelled: 'badge badge-secondary'
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

const handleNewRequest = () => {
  router.push('/visits/requests/new')
}

const handleApprove = async (id: number) => {
  const result = await Swal.fire({
    title: 'Aprobar Solicitud',
    text: '¿Está seguro de aprobar esta solicitud de visita?',
    input: 'textarea',
    inputLabel: 'Notas de aprobación (opcional)',
    inputPlaceholder: 'Agregar notas...',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Aprobar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      const { data } = await ApiService.post(`/visit-requests/${id}/approve`, {
        approval_notes: result.value || ''
      })
      if (data.success) {
        Swal.fire({ title: '¡Éxito!', text: 'Solicitud aprobada exitosamente', icon: 'success' })
        loadRequests()
        loadStats()
      }
    } catch (err) {
      Swal.fire({ title: 'Error', text: 'No se pudo aprobar la solicitud', icon: 'error' })
    }
  }
}

const handleReject = async (id: number) => {
  const result = await Swal.fire({
    title: 'Rechazar Solicitud',
    input: 'textarea',
    inputLabel: 'Motivo de rechazo',
    inputPlaceholder: 'Ingrese el motivo del rechazo...',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Rechazar',
    cancelButtonText: 'Cancelar',
    inputValidator: (value) => {
      if (!value) return 'Debe ingresar un motivo de rechazo'
    }
  })

  if (result.isConfirmed) {
    try {
      const { data } = await ApiService.post(`/visit-requests/${id}/reject`, {
        rejection_reason: result.value
      })
      if (data.success) {
        Swal.fire({ title: '¡Éxito!', text: 'Solicitud rechazada', icon: 'success' })
        loadRequests()
        loadStats()
      }
    } catch (err) {
      Swal.fire({ title: 'Error', text: 'No se pudo rechazar la solicitud', icon: 'error' })
    }
  }
}

const handleExport = () => {
}
</script>