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

    <!-- Loading State -->
    <div v-if="loading" class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- begin::content -->
    <div v-else-if="visitor" class="row gy-5 g-xl-10">
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
                  <tr v-if="relatedInmates.length === 0">
                    <td colspan="6" class="text-center text-muted py-10">
                      No hay relaciones con PPL registradas para este visitante
                    </td>
                  </tr>
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
                  <tr v-if="visitHistory.length === 0">
                    <td colspan="6" class="text-center text-muted py-10">
                      No hay visitas registradas para este visitante
                    </td>
                  </tr>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ApiService from '@/core/services/ApiService'
import Swal from 'sweetalert2'

// Composables
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// Refs
const loading = ref(true)
const visitorData = ref<any>(null)

// Computed properties para mapear los datos correctamente
const visitor = computed(() => {
  if (!visitorData.value) return null

  const v = visitorData.value
  const fullName = [
    v.first_name,
    v.second_name,
    v.third_name,
    v.first_surname,
    v.second_surname,
    v.married_surname
  ].filter(Boolean).join(' ')

  return {
    id: v.id,
    fullName: fullName,
    documentType: v.document_type || 'N/A',
    documentNumber: v.document_number || 'N/A',
    birthDate: v.birth_date,
    phone: v.phone_number || v.phone || 'N/A',
    email: v.email,
    address: v.address || 'N/A',
    photo: v.photo_path ? `/storage/${v.photo_path}` : null,
    status: v.status || 'active',
    biometricRegistered: v.has_biometric_data || false,
    registrationDate: v.created_at,
    lastVisit: v.last_visit_date,
    totalVisits: v.total_visits || 0
  }
})

const relatedInmates = computed(() => {
  if (!visitorData.value?.relationships) return []

  return visitorData.value.relationships.map((rel: any) => ({
    id: rel.id,
    inmateName: rel.inmate ?
      [rel.inmate.first_name, rel.inmate.middle_name, rel.inmate.last_name, rel.inmate.second_last_name].filter(Boolean).join(' ') :
      'N/A',
    inmateCode: rel.inmate?.inmate_number || rel.inmate?.inmate_code || 'N/A',
    relationship: rel.relationship_type?.name || 'N/A',
    hasPermission: rel.authorization_status === 'approved',
    lastVisit: rel.last_visit_date
  }))
})

const visitHistory = computed(() => {
  if (!visitorData.value?.visit_logs) return []

  return visitorData.value.visit_logs.map((visit: any) => {
    // Determinar la fecha de la visita
    // Prioridad: actual_entry_datetime > requested_visit_date > created_at
    let dateOnly = ''
    let timeOnly = ''

    if (visit.actual_entry_datetime) {
      // Visita con entrada registrada - usar fecha y hora de entrada
      const entryDate = visit.actual_entry_datetime
      if (entryDate.includes('T')) {
        const parts = entryDate.split('T')
        dateOnly = parts[0]
        timeOnly = parts[1]?.substring(0, 5) || ''
      } else if (entryDate.includes(' ')) {
        const parts = entryDate.split(' ')
        dateOnly = parts[0]
        timeOnly = parts[1]?.substring(0, 5) || ''
      }
    } else {
      // Visita programada - usar requested_visit_date para fecha y requested_start_time para hora
      if (visit.requested_visit_date) {
        const reqDate = visit.requested_visit_date
        if (reqDate.includes('T')) {
          dateOnly = reqDate.split('T')[0]
        } else if (reqDate.includes(' ')) {
          dateOnly = reqDate.split(' ')[0]
        } else {
          dateOnly = reqDate.substring(0, 10)
        }
      } else if (visit.created_at) {
        const createdDate = visit.created_at
        if (createdDate.includes('T')) {
          dateOnly = createdDate.split('T')[0]
        } else if (createdDate.includes(' ')) {
          dateOnly = createdDate.split(' ')[0]
        }
      }

      // Obtener hora de requested_start_time
      if (visit.requested_start_time) {
        const startTime = visit.requested_start_time
        if (startTime.includes('T')) {
          timeOnly = startTime.split('T')[1]?.substring(0, 5) || ''
        } else if (startTime.includes(' ')) {
          timeOnly = startTime.split(' ')[1]?.substring(0, 5) || ''
        } else if (startTime.includes(':')) {
          // Solo hora: "09:00:00" o "09:00"
          timeOnly = startTime.substring(0, 5)
        }
      }
    }

    // Fallback si no hay hora
    if (!timeOnly && visit.created_at) {
      const created = new Date(visit.created_at)
      timeOnly = created.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })
    }

    return {
      id: visit.id,
      date: dateOnly,
      time: timeOnly || '-',
      inmateName: visit.inmate ?
        [visit.inmate.first_name, visit.inmate.middle_name, visit.inmate.last_name, visit.inmate.second_last_name].filter(Boolean).join(' ') :
        'N/A',
      type: visit.visit_type?.name || 'N/A',
      duration: visit.actual_duration_minutes || visit.requested_duration_minutes || visit.duration_minutes || 0,
      observations: visit.visit_purpose || visit.entry_notes || visit.exit_notes || visit.decision_notes || '-'
    }
  })
})

// Methods
const loadVisitorData = async () => {
  try {
    loading.value = true
    const response = await ApiService.get(`/visitors/${route.params.id}`)
    visitorData.value = response.data
  } catch (error: any) {
    console.error('Error loading visitor data:', error)
    Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'No se pudo cargar la información del visitante',
      icon: 'error',
      confirmButtonText: 'OK'
    }).then(() => {
      router.push('/visits/visitor-management')
    })
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString('es-GT')
}

const calculateAge = (birthDate: string) => {
  if (!birthDate) return 0
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
    suspended: 'badge badge-warning',
    pending_documentation: 'badge badge-warning',
    documentation_review: 'badge badge-info',
    background_check: 'badge badge-info',
    biometric_enrollment: 'badge badge-primary',
    approved: 'badge badge-success',
    rejected: 'badge badge-danger',
    revoked: 'badge badge-dark',
    expired: 'badge badge-secondary'
  }
  return classes[status] || 'badge badge-secondary'
}

const handleEdit = () => {
  router.push(`/visits/visitors/${route.params.id}/edit`)
}

// Lifecycle
onMounted(() => {
  loadVisitorData()
})
</script>