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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'

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
const filters = ref({
  status: '',
  date: '',
  type: '',
  search: ''
})

const stats = ref({
  pending: 12,
  approved: 8,
  rejected: 2,
  scheduled: 15
})

const visitRequests = ref([
  {
    id: 1,
    requestDate: '2024-03-15T10:30:00',
    visitorName: 'María García López',
    visitorDocument: 'DPI: 2547896321234',
    visitorPhoto: null,
    inmateName: 'Juan García López',
    inmateCode: 'REC-2024-001',
    inmatePhoto: null,
    visitType: 'family',
    requestedDate: '2024-03-20',
    requestedTime: '14:00 - 15:00',
    status: 'pending',
    priority: 'normal',
    urgent: false
  },
  {
    id: 2,
    requestDate: '2024-03-15T11:45:00',
    visitorName: 'Lic. Carlos Mendez',
    visitorDocument: 'DPI: 1234567890123',
    visitorPhoto: null,
    inmateName: 'Pedro Ramirez',
    inmateCode: 'REC-2024-025',
    inmatePhoto: null,
    visitType: 'legal',
    requestedDate: '2024-03-16',
    requestedTime: '10:00 - 11:00',
    status: 'pending',
    priority: 'high',
    urgent: true
  },
  {
    id: 3,
    requestDate: '2024-03-14T09:00:00',
    visitorName: 'Ana Martinez',
    visitorDocument: 'DPI: 9876543210987',
    visitorPhoto: null,
    inmateName: 'Luis Hernandez',
    inmateCode: 'REC-2024-010',
    inmatePhoto: null,
    visitType: 'family',
    requestedDate: '2024-03-18',
    requestedTime: '14:00 - 15:00',
    status: 'approved',
    priority: 'normal',
    urgent: false
  },
  {
    id: 4,
    requestDate: '2024-03-14T15:20:00',
    visitorName: 'Padre Miguel Angel',
    visitorDocument: 'DPI: 5555555555555',
    visitorPhoto: null,
    inmateName: 'Roberto Silva',
    inmateCode: 'REC-2024-032',
    inmatePhoto: null,
    visitType: 'religious',
    requestedDate: '2024-03-19',
    requestedTime: '09:00 - 10:00',
    status: 'scheduled',
    priority: 'normal',
    urgent: false
  }
])

const currentPage = ref(1)
const itemsPerPage = 10

// Computed
const filteredRequests = computed(() => {
  return visitRequests.value.filter(request => {
    if (filters.value.status && request.status !== filters.value.status) return false
    if (filters.value.type && request.visitType !== filters.value.type) return false
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      return request.visitorName.toLowerCase().includes(search) ||
             request.inmateName.toLowerCase().includes(search) ||
             request.inmateCode.toLowerCase().includes(search)
    }
    return true
  })
})

const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredRequests.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredRequests.value.length / itemsPerPage)
})

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-GT')
}

const formatTime = (dateString: string) => {
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
    scheduled: 'badge badge-primary'
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
    title: t('visits.visitRequests.approveTitle'),
    text: t('visits.visitRequests.approveText'),
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: t('common.approve'),
    cancelButtonText: t('common.cancel')
  })

  if (result.isConfirmed) {
    // Update request status
    const request = visitRequests.value.find(r => r.id === id)
    if (request) {
      request.status = 'approved'
    }
    
    Swal.fire({
      title: t('common.success'),
      text: t('visits.visitRequests.approveSuccess'),
      icon: 'success'
    })
  }
}

const handleReject = async (id: number) => {
  const result = await Swal.fire({
    title: t('visits.visitRequests.rejectTitle'),
    input: 'textarea',
    inputLabel: t('visits.visitRequests.rejectReason'),
    inputPlaceholder: t('visits.visitRequests.rejectReasonPlaceholder'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('common.reject'),
    cancelButtonText: t('common.cancel'),
    inputValidator: (value) => {
      if (!value) {
        return t('visits.visitRequests.rejectReasonRequired')
      }
    }
  })

  if (result.isConfirmed) {
    // Update request status
    const request = visitRequests.value.find(r => r.id === id)
    if (request) {
      request.status = 'rejected'
    }
    
    Swal.fire({
      title: t('common.success'),
      text: t('visits.visitRequests.rejectSuccess'),
      icon: 'success'
    })
  }
}

const handleExport = () => {
}
</script>