<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <h2>{{ $t('operations.admissions.title') }}</h2>
      </div>
      <div class="card-toolbar">
        <router-link
          to="/operations/admissions/new"
          class="btn btn-primary"
        >
          <KTIcon icon-name="plus" icon-class="fs-2" />
          {{ $t('operations.admissions.new_admission') }}
        </router-link>
      </div>
    </div>
    
    <div class="card-body py-4">
      <!-- Quick Stats -->
      <div class="row g-5 g-xl-8 mb-5">
        <div class="col-xl-3">
          <div class="card card-xl-stretch mb-xl-8">
            <div class="card-body d-flex align-items-center">
              <div class="d-flex flex-column flex-grow-1">
                <span class="text-muted fw-semibold fs-6">{{ $t('operations.admissions.today') }}</span>
                <span class="fw-bold fs-2">{{ todayAdmissions }}</span>
              </div>
              <KTIcon icon-name="entrance" icon-class="fs-2hx text-primary" />
            </div>
          </div>
        </div>
        
        <div class="col-xl-3">
          <div class="card card-xl-stretch mb-xl-8">
            <div class="card-body d-flex align-items-center">
              <div class="d-flex flex-column flex-grow-1">
                <span class="text-muted fw-semibold fs-6">{{ $t('operations.admissions.in_progress') }}</span>
                <span class="fw-bold fs-2">{{ inProgressAdmissions }}</span>
              </div>
              <KTIcon icon-name="timer" icon-class="fs-2hx text-warning" />
            </div>
          </div>
        </div>
        
        <div class="col-xl-3">
          <div class="card card-xl-stretch mb-xl-8">
            <div class="card-body d-flex align-items-center">
              <div class="d-flex flex-column flex-grow-1">
                <span class="text-muted fw-semibold fs-6">{{ $t('operations.admissions.pending_documents') }}</span>
                <span class="fw-bold fs-2">{{ pendingDocuments }}</span>
              </div>
              <KTIcon icon-name="document-code" icon-class="fs-2hx text-danger" />
            </div>
          </div>
        </div>
        
        <div class="col-xl-3">
          <div class="card card-xl-stretch mb-xl-8">
            <div class="card-body d-flex align-items-center">
              <div class="d-flex flex-column flex-grow-1">
                <span class="text-muted fw-semibold fs-6">{{ $t('operations.admissions.completed_this_week') }}</span>
                <span class="fw-bold fs-2">{{ weekCompleted }}</span>
              </div>
              <KTIcon icon-name="check-circle" icon-class="fs-2hx text-success" />
            </div>
          </div>
        </div>
      </div>

      <!-- Active Admissions Table -->
      <div class="table-responsive">
        <table class="table align-middle table-row-dashed fs-6 gy-5">
          <thead>
            <tr class="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
              <th class="min-w-50px">{{ $t('operations.admissions.admission_number') }}</th>
              <th class="min-w-150px">{{ $t('operations.admissions.inmate_name') }}</th>
              <th class="min-w-100px">{{ $t('operations.admissions.document') }}</th>
              <th class="min-w-125px">{{ $t('operations.admissions.arrival_date') }}</th>
              <th class="min-w-100px">{{ $t('operations.admissions.status') }}</th>
              <th class="min-w-150px">{{ $t('operations.admissions.current_stage') }}</th>
              <th class="text-end min-w-100px">{{ $t('common.actions.title') }}</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 fw-semibold">
            <tr v-for="admission in admissions" :key="admission.id">
              <td>{{ admission.admission_number }}</td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="d-flex flex-column">
                    <span class="text-dark fw-bold">{{ admission.inmate_name }}</span>
                    <span class="text-muted fs-7">{{ admission.inmate_alias }}</span>
                  </div>
                </div>
              </td>
              <td>{{ admission.document_number }}</td>
              <td>{{ formatDate(admission.arrival_date) }}</td>
              <td>
                <span :class="getStatusClass(admission.status)">
                  {{ $t(`operations.admissions.status_${admission.status}`) }}
                </span>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="progress h-6px w-100px me-2">
                    <div 
                      class="progress-bar bg-primary" 
                      role="progressbar" 
                      :style="{width: admission.progress + '%'}"
                    ></div>
                  </div>
                  <span class="text-muted fs-7">{{ admission.current_stage }}</span>
                </div>
              </td>
              <td class="text-end">
                <router-link
                  :to="`/operations/admissions/${admission.id}`"
                  class="btn btn-sm btn-light-primary"
                >
                  {{ $t('common.continue') }}
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import KTIcon from '@/core/helpers/kt-icon/KTIcon.vue'
// Helper function to format dates
const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-GT')
}

const { t } = useI18n()

// Stats
const todayAdmissions = ref(5)
const inProgressAdmissions = ref(3)
const pendingDocuments = ref(2)
const weekCompleted = ref(12)

// Sample data
const admissions = ref([
  {
    id: 1,
    admission_number: 'ADM-2024-001',
    inmate_name: 'Juan Carlos Pérez',
    inmate_alias: 'El Chino',
    document_number: 'DPI-123456789',
    arrival_date: new Date(),
    status: 'in_progress',
    current_stage: 'Examen Médico',
    progress: 60
  },
  {
    id: 2,
    admission_number: 'ADM-2024-002',
    inmate_name: 'María González',
    inmate_alias: null,
    document_number: 'DPI-987654321',
    arrival_date: new Date(Date.now() - 86400000),
    status: 'pending_documents',
    current_stage: 'Verificación Legal',
    progress: 30
  }
])

const getStatusClass = (status: string) => {
  const classes = {
    'in_progress': 'badge badge-light-warning',
    'pending_documents': 'badge badge-light-danger',
    'completed': 'badge badge-light-success',
    'pending': 'badge badge-light-info'
  }
  return classes[status] || 'badge badge-light-secondary'
}

onMounted(() => {
  // Load admissions data
})
</script>