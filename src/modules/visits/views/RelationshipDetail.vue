<template>
  <div>
    <!-- begin::page-header -->
    <div class="row gy-5 g-xl-10 mb-5 mb-xl-10">
      <div class="col-md-12">
        <div class="d-flex flex-column flex-md-row align-items-center justify-content-between">
          <h1 class="fs-2x fw-bold text-gray-900 mb-4 mb-md-0">
            {{ $t('visits.relationshipDetail.title') }}
          </h1>
          <div class="d-flex gap-2">
            <router-link to="/visits/relationships" class="btn btn-light-primary">
              <i class="fas fa-arrow-left"></i>
              {{ $t('common.back') }}
            </router-link>
            <button class="btn btn-warning" @click="handleSuspend" v-if="relationship.status === 'active'">
              <i class="fas fa-pause"></i>
              {{ $t('visits.relationshipDetail.suspend') }}
            </button>
            <button class="btn btn-success" @click="handleActivate" v-else>
              <i class="fas fa-play"></i>
              {{ $t('visits.relationshipDetail.activate') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- end::page-header -->

    <!-- begin::content -->
    <div class="row gy-5 g-xl-10">
      <!-- Relationship Summary Card -->
      <div class="col-xl-12">
        <div class="card">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-3 text-center">
                <div class="mb-4">
                  <div class="symbol symbol-100px mb-3">
                    <img :src="relationship.visitorPhoto || '/media/avatars/blank.png'" alt="Visitor" />
                  </div>
                  <h5 class="text-gray-900 fw-bold">{{ relationship.visitorName }}</h5>
                  <p class="text-muted">{{ $t('visits.relationshipDetail.visitor') }}</p>
                </div>
              </div>
              <div class="col-md-6 text-center">
                <div class="d-flex align-items-center justify-content-center mb-4">
                  <div class="border-2 border-gray-300 border-dashed rounded p-4">
                    <i class="fas fa-link fs-2x text-primary mb-2"></i>
                    <h4 class="text-gray-900 fw-bold mb-0">{{ relationship.relationshipType }}</h4>
                    <p class="text-muted mb-0">{{ $t('visits.relationshipDetail.relationshipType') }}</p>
                  </div>
                </div>
                <div>
                  <span :class="getStatusBadgeClass(relationship.status)" class="fs-6">
                    {{ $t(`visits.relationshipStatus.${relationship.status}`) }}
                  </span>
                </div>
              </div>
              <div class="col-md-3 text-center">
                <div class="mb-4">
                  <div class="symbol symbol-100px mb-3">
                    <img :src="relationship.inmatePhoto || '/media/avatars/blank.png'" alt="Inmate" />
                  </div>
                  <h5 class="text-gray-900 fw-bold">{{ relationship.inmateName }}</h5>
                  <p class="text-muted">{{ $t('visits.relationshipDetail.inmate') }}</p>
                  <span class="badge badge-light-primary">{{ relationship.inmateCode }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Relationship Details -->
      <div class="col-xl-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.relationshipDetail.details') }}</h3>
          </div>
          <div class="card-body">
            <div class="mb-5">
              <label class="form-label text-muted">{{ $t('visits.relationshipDetail.registrationDate') }}</label>
              <p class="text-gray-900 fw-bold">{{ formatDate(relationship.registrationDate) }}</p>
            </div>
            <div class="mb-5">
              <label class="form-label text-muted">{{ $t('visits.relationshipDetail.verificationStatus') }}</label>
              <div class="d-flex align-items-center">
                <span v-if="relationship.verified" class="badge badge-success">
                  <i class="fas fa-check-circle me-1"></i>
                  {{ $t('visits.relationshipDetail.verified') }}
                </span>
                <span v-else class="badge badge-warning">
                  <i class="fas fa-clock me-1"></i>
                  {{ $t('visits.relationshipDetail.pendingVerification') }}
                </span>
              </div>
            </div>
            <div class="mb-5">
              <label class="form-label text-muted">{{ $t('visits.relationshipDetail.verificationMethod') }}</label>
              <p class="text-gray-900">{{ relationship.verificationMethod || '-' }}</p>
            </div>
            <div class="mb-5">
              <label class="form-label text-muted">{{ $t('visits.relationshipDetail.supportingDocuments') }}</label>
              <div v-if="relationship.documents.length > 0">
                <div v-for="doc in relationship.documents" :key="doc.id" class="d-flex align-items-center mb-2">
                  <i class="fas fa-file-pdf text-danger me-2"></i>
                  <a href="#" class="text-hover-primary">{{ doc.name }}</a>
                </div>
              </div>
              <p v-else class="text-muted">{{ $t('common.noData') }}</p>
            </div>
            <div class="mb-5">
              <label class="form-label text-muted">{{ $t('visits.relationshipDetail.notes') }}</label>
              <p class="text-gray-900">{{ relationship.notes || '-' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Visit Statistics -->
      <div class="col-xl-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.relationshipDetail.visitStatistics') }}</h3>
          </div>
          <div class="card-body">
            <div class="row mb-5">
              <div class="col-6">
                <div class="border border-gray-300 border-dashed rounded p-4 text-center">
                  <h2 class="text-primary fw-bold mb-0">{{ statistics.totalVisits }}</h2>
                  <p class="text-muted mb-0">{{ $t('visits.relationshipDetail.totalVisits') }}</p>
                </div>
              </div>
              <div class="col-6">
                <div class="border border-gray-300 border-dashed rounded p-4 text-center">
                  <h2 class="text-success fw-bold mb-0">{{ statistics.averageDuration }}</h2>
                  <p class="text-muted mb-0">{{ $t('visits.relationshipDetail.avgDuration') }}</p>
                </div>
              </div>
            </div>
            <div class="mb-5">
              <label class="form-label text-muted">{{ $t('visits.relationshipDetail.lastVisit') }}</label>
              <p class="text-gray-900 fw-bold">{{ formatDate(statistics.lastVisit) || '-' }}</p>
            </div>
            <div class="mb-5">
              <label class="form-label text-muted">{{ $t('visits.relationshipDetail.visitFrequency') }}</label>
              <p class="text-gray-900">{{ statistics.visitFrequency }}</p>
            </div>
            <div class="mb-5">
              <label class="form-label text-muted">{{ $t('visits.relationshipDetail.preferredVisitDay') }}</label>
              <p class="text-gray-900">{{ statistics.preferredDay }}</p>
            </div>
            <div class="mb-5">
              <label class="form-label text-muted">{{ $t('visits.relationshipDetail.preferredVisitTime') }}</label>
              <p class="text-gray-900">{{ statistics.preferredTime }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Visits -->
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.relationshipDetail.recentVisits') }}</h3>
            <div class="card-toolbar">
              <router-link :to="`/visits/requests/new?visitor=${relationship.visitorId}&inmate=${relationship.inmateId}`" class="btn btn-sm btn-primary">
                <i class="fas fa-plus"></i>
                {{ $t('visits.relationshipDetail.scheduleVisit') }}
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th>{{ $t('visits.relationshipDetail.visitDate') }}</th>
                    <th>{{ $t('visits.relationshipDetail.visitTime') }}</th>
                    <th>{{ $t('visits.relationshipDetail.visitType') }}</th>
                    <th>{{ $t('visits.relationshipDetail.duration') }}</th>
                    <th>{{ $t('visits.relationshipDetail.status') }}</th>
                    <th>{{ $t('visits.relationshipDetail.observations') }}</th>
                    <th class="text-end">{{ $t('common.actions.title') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="visit in recentVisits" :key="visit.id">
                    <td>{{ formatDate(visit.date) }}</td>
                    <td>{{ visit.time }}</td>
                    <td>
                      <span class="badge badge-light-info">{{ visit.type }}</span>
                    </td>
                    <td>{{ visit.duration }} {{ $t('common.minutes') }}</td>
                    <td>
                      <span :class="getVisitStatusBadgeClass(visit.status)">
                        {{ $t(`visits.visitStatus.${visit.status}`) }}
                      </span>
                    </td>
                    <td>{{ visit.observations || '-' }}</td>
                    <td class="text-end">
                      <button class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm">
                        <i class="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Restrictions -->
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header border-0">
            <h3 class="card-title">{{ $t('visits.relationshipDetail.restrictions') }}</h3>
            <div class="card-toolbar">
              <button class="btn btn-sm btn-light-danger" @click="handleAddRestriction">
                <i class="fas fa-ban"></i>
                {{ $t('visits.relationshipDetail.addRestriction') }}
              </button>
            </div>
          </div>
          <div class="card-body">
            <div v-if="restrictions.length > 0" class="table-responsive">
              <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th>{{ $t('visits.relationshipDetail.restrictionType') }}</th>
                    <th>{{ $t('visits.relationshipDetail.reason') }}</th>
                    <th>{{ $t('visits.relationshipDetail.startDate') }}</th>
                    <th>{{ $t('visits.relationshipDetail.endDate') }}</th>
                    <th>{{ $t('visits.relationshipDetail.status') }}</th>
                    <th class="text-end">{{ $t('common.actions.title') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="restriction in restrictions" :key="restriction.id">
                    <td>
                      <span class="badge badge-light-danger">{{ restriction.type }}</span>
                    </td>
                    <td>{{ restriction.reason }}</td>
                    <td>{{ formatDate(restriction.startDate) }}</td>
                    <td>{{ formatDate(restriction.endDate) || '-' }}</td>
                    <td>
                      <span :class="restriction.active ? 'badge badge-danger' : 'badge badge-secondary'">
                        {{ restriction.active ? $t('common.active') : $t('common.inactive') }}
                      </span>
                    </td>
                    <td class="text-end">
                      <button 
                        v-if="restriction.active"
                        @click="handleRemoveRestriction(restriction.id)"
                        class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center py-10">
              <p class="text-muted">{{ $t('visits.relationshipDetail.noRestrictions') }}</p>
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
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

// Composables
const route = useRoute()
const { t } = useI18n()

// Refs
const relationship = ref({
  id: 1,
  visitorId: 1,
  visitorName: 'María García López',
  visitorPhoto: null,
  inmateId: 1,
  inmateName: 'Juan García López',
  inmateCode: 'REC-2024-001',
  inmatePhoto: null,
  relationshipType: 'Hermano',
  status: 'active',
  registrationDate: '2024-01-15',
  verified: true,
  verificationMethod: 'Documentación presentada',
  documents: [
    { id: 1, name: 'Certificado de Nacimiento.pdf' },
    { id: 2, name: 'DPI del visitante.pdf' }
  ],
  notes: 'Relación verificada mediante certificados de nacimiento'
})

const statistics = ref({
  totalVisits: 15,
  averageDuration: '52 min',
  lastVisit: '2024-03-10',
  visitFrequency: 'Quincenal',
  preferredDay: 'Domingo',
  preferredTime: '14:00 - 16:00'
})

const recentVisits = ref([
  {
    id: 1,
    date: '2024-03-10',
    time: '14:30',
    type: 'Familiar',
    duration: 45,
    status: 'completed',
    observations: 'Visita sin novedades'
  },
  {
    id: 2,
    date: '2024-02-25',
    time: '14:00',
    type: 'Familiar',
    duration: 60,
    status: 'completed',
    observations: null
  },
  {
    id: 3,
    date: '2024-03-24',
    time: '14:00',
    type: 'Familiar',
    duration: 0,
    status: 'scheduled',
    observations: null
  }
])

const restrictions = ref([])

// Methods
const formatDate = (dateString: string | null) => {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString('es-GT')
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'badge badge-success',
    suspended: 'badge badge-warning',
    blocked: 'badge badge-danger'
  }
  return classes[status] || 'badge badge-secondary'
}

const getVisitStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    scheduled: 'badge badge-light-primary',
    inProgress: 'badge badge-light-warning',
    completed: 'badge badge-light-success',
    cancelled: 'badge badge-light-danger'
  }
  return classes[status] || 'badge badge-secondary'
}

const handleSuspend = async () => {
  const result = await Swal.fire({
    title: t('visits.relationshipDetail.suspendTitle'),
    text: t('visits.relationshipDetail.suspendText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel')
  })

  if (result.isConfirmed) {
    relationship.value.status = 'suspended'
    Swal.fire({
      title: t('common.success'),
      text: t('visits.relationshipDetail.suspendSuccess'),
      icon: 'success'
    })
  }
}

const handleActivate = async () => {
  relationship.value.status = 'active'
  Swal.fire({
    title: t('common.success'),
    text: t('visits.relationshipDetail.activateSuccess'),
    icon: 'success'
  })
}

const handleAddRestriction = () => {
  // Open modal to add restriction
  console.log('Add restriction')
}

const handleRemoveRestriction = async (id: number) => {
  const result = await Swal.fire({
    title: t('visits.relationshipDetail.removeRestrictionTitle'),
    text: t('visits.relationshipDetail.removeRestrictionText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel')
  })

  if (result.isConfirmed) {
    // Remove restriction
    console.log('Remove restriction:', id)
  }
}

// Lifecycle
onMounted(() => {
  // Load relationship data based on route.params.id
  console.log('Loading relationship:', route.params.id)
})
</script>