<template>
  <div>
    <!-- begin::page-header -->
    <div class="row gy-5 g-xl-10 mb-5 mb-xl-10">
      <div class="col-md-12">
        <div class="d-flex flex-column flex-md-row align-items-center justify-content-between">
          <h1 class="fs-2x fw-bold text-gray-900 mb-4 mb-md-0">
            {{ $t('visits.visitorDetail.title') }}
          </h1>
          <div class="d-flex gap-2">
            <router-link to="/visits/visitor-management" class="btn btn-light-primary">
              <i class="fas fa-arrow-left"></i>
              {{ $t('common.back') }}
            </router-link>
            <button class="btn btn-primary" @click="handleEdit">
              <i class="fas fa-edit"></i>
              {{ $t('common.edit') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- end::page-header -->

    <!-- begin::content -->
    <div class="row gy-5 g-xl-10">
      <!-- Visitor Information Card -->
      <div class="col-xl-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitorDetail.personalInfo') }}</h3>
          </div>
          <div class="card-body">
            <div class="row mb-5">
              <div class="col-md-4 text-center">
                <div class="symbol symbol-150px">
                  <img :src="visitor.photo || '/media/avatars/blank.png'" alt="Visitor photo" />
                </div>
              </div>
              <div class="col-md-8">
                <div class="mb-3">
                  <label class="form-label text-muted">{{ $t('visits.visitorDetail.fullName') }}</label>
                  <p class="text-gray-900 fw-bold">{{ visitor.fullName }}</p>
                </div>
                <div class="mb-3">
                  <label class="form-label text-muted">{{ $t('visits.visitorDetail.documentType') }}</label>
                  <p class="text-gray-900">{{ visitor.documentType }}</p>
                </div>
                <div class="mb-3">
                  <label class="form-label text-muted">{{ $t('visits.visitorDetail.documentNumber') }}</label>
                  <p class="text-gray-900">{{ visitor.documentNumber }}</p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label text-muted">{{ $t('visits.visitorDetail.birthDate') }}</label>
                <p class="text-gray-900">{{ formatDate(visitor.birthDate) }}</p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label text-muted">{{ $t('visits.visitorDetail.age') }}</label>
                <p class="text-gray-900">{{ calculateAge(visitor.birthDate) }} {{ $t('common.years') }}</p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label text-muted">{{ $t('visits.visitorDetail.phone') }}</label>
                <p class="text-gray-900">{{ visitor.phone }}</p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label text-muted">{{ $t('visits.visitorDetail.email') }}</label>
                <p class="text-gray-900">{{ visitor.email || '-' }}</p>
              </div>
              <div class="col-12 mb-3">
                <label class="form-label text-muted">{{ $t('visits.visitorDetail.address') }}</label>
                <p class="text-gray-900">{{ visitor.address }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Information Card -->
      <div class="col-xl-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitorDetail.securityInfo') }}</h3>
          </div>
          <div class="card-body">
            <div class="mb-5">
              <label class="form-label text-muted">{{ $t('visits.visitorDetail.status') }}</label>
              <span :class="getStatusBadgeClass(visitor.status)">
                {{ $t(`visits.status.${visitor.status}`) }}
              </span>
            </div>
            <div class="mb-5">
              <label class="form-label text-muted">{{ $t('visits.visitorDetail.biometricStatus') }}</label>
              <div class="d-flex align-items-center">
                <span v-if="visitor.biometricRegistered" class="badge badge-success">
                  <i class="fas fa-fingerprint me-1"></i>
                  {{ $t('visits.visitorDetail.biometricRegistered') }}
                </span>
                <span v-else class="badge badge-warning">
                  <i class="fas fa-exclamation-triangle me-1"></i>
                  {{ $t('visits.visitorDetail.biometricPending') }}
                </span>
              </div>
            </div>
            <div class="mb-5">
              <label class="form-label text-muted">{{ $t('visits.visitorDetail.registrationDate') }}</label>
              <p class="text-gray-900">{{ formatDate(visitor.registrationDate) }}</p>
            </div>
            <div class="mb-5">
              <label class="form-label text-muted">{{ $t('visits.visitorDetail.lastVisit') }}</label>
              <p class="text-gray-900">{{ formatDate(visitor.lastVisit) || '-' }}</p>
            </div>
            <div class="mb-5">
              <label class="form-label text-muted">{{ $t('visits.visitorDetail.totalVisits') }}</label>
              <p class="text-gray-900 fw-bold fs-4">{{ visitor.totalVisits }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Inmates Card -->
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitorDetail.relatedInmates') }}</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th>{{ $t('visits.visitorDetail.inmateName') }}</th>
                    <th>{{ $t('visits.visitorDetail.inmateCode') }}</th>
                    <th>{{ $t('visits.visitorDetail.relationship') }}</th>
                    <th>{{ $t('visits.visitorDetail.visitPermission') }}</th>
                    <th>{{ $t('visits.visitorDetail.lastInmateVisit') }}</th>
                    <th class="text-end">{{ $t('common.actions.title') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="relation in relatedInmates" :key="relation.id">
                    <td>{{ relation.inmateName }}</td>
                    <td>
                      <span class="badge badge-light-primary">{{ relation.inmateCode }}</span>
                    </td>
                    <td>{{ relation.relationship }}</td>
                    <td>
                      <span :class="relation.hasPermission ? 'badge badge-success' : 'badge badge-danger'">
                        {{ relation.hasPermission ? $t('common.yes') : $t('common.no') }}
                      </span>
                    </td>
                    <td>{{ formatDate(relation.lastVisit) || '-' }}</td>
                    <td class="text-end">
                      <router-link 
                        :to="`/visits/relationships/${relation.id}`"
                        class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                      >
                        <i class="fas fa-eye"></i>
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Visit History Card -->
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitorDetail.visitHistory') }}</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th>{{ $t('visits.visitorDetail.visitDate') }}</th>
                    <th>{{ $t('visits.visitorDetail.visitTime') }}</th>
                    <th>{{ $t('visits.visitorDetail.inmateName') }}</th>
                    <th>{{ $t('visits.visitorDetail.visitType') }}</th>
                    <th>{{ $t('visits.visitorDetail.duration') }}</th>
                    <th>{{ $t('visits.visitorDetail.observations') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="visit in visitHistory" :key="visit.id">
                    <td>{{ formatDate(visit.date) }}</td>
                    <td>{{ visit.time }}</td>
                    <td>{{ visit.inmateName }}</td>
                    <td>
                      <span class="badge badge-light-info">{{ visit.type }}</span>
                    </td>
                    <td>{{ visit.duration }} {{ $t('common.minutes') }}</td>
                    <td>{{ visit.observations || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
const visitor = ref({
  id: 1,
  fullName: 'María García López',
  documentType: 'DPI',
  documentNumber: '2547896321234',
  birthDate: '1985-06-15',
  phone: '+502 5555-1234',
  email: 'maria.garcia@email.com',
  address: 'Zona 10, Ciudad de Guatemala',
  photo: null,
  status: 'active',
  biometricRegistered: true,
  registrationDate: '2024-01-15',
  lastVisit: '2024-03-10',
  totalVisits: 12
})

const relatedInmates = ref([
  {
    id: 1,
    inmateName: 'Juan García López',
    inmateCode: 'REC-2024-001',
    relationship: 'Hermano',
    hasPermission: true,
    lastVisit: '2024-03-10'
  },
  {
    id: 2,
    inmateName: 'Pedro García López',
    inmateCode: 'REC-2024-025',
    relationship: 'Hijo',
    hasPermission: true,
    lastVisit: '2024-02-28'
  }
])

const visitHistory = ref([
  {
    id: 1,
    date: '2024-03-10',
    time: '14:30',
    inmateName: 'Juan García López',
    type: 'Familiar',
    duration: 45,
    observations: 'Visita sin novedades'
  },
  {
    id: 2,
    date: '2024-02-28',
    time: '10:00',
    inmateName: 'Pedro García López',
    type: 'Familiar',
    duration: 60,
    observations: null
  }
])

// Methods
const formatDate = (dateString: string | null) => {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString('es-GT')
}

const calculateAge = (birthDate: string) => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'badge badge-success',
    inactive: 'badge badge-danger',
    suspended: 'badge badge-warning'
  }
  return classes[status] || 'badge badge-secondary'
}

const handleEdit = () => {
  router.push(`/visits/visitors/${route.params.id}/edit`)
}

// Lifecycle
onMounted(() => {
  // Load visitor data based on route.params.id
  console.log('Loading visitor:', route.params.id)
})
</script>