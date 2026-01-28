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
            <template v-if="relationship">
              <button class="btn btn-warning" @click="handleSuspend" v-if="relationship.status === 'approved'">
                <i class="fas fa-pause"></i>
                {{ $t('visits.relationships.suspend') }}
              </button>
              <button class="btn btn-success" @click="handleActivate" v-if="relationship.status === 'suspended'">
                <i class="fas fa-play"></i>
                {{ $t('visits.relationships.reactivate') }}
              </button>
            </template>
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
    <div v-else-if="relationship" class="row gy-5 g-xl-10">
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
              <div class="col-md-6 mb-3">
                <div class="border border-gray-300 border-dashed rounded p-4 text-center">
                  <h2 class="text-primary fw-bold mb-0">{{ statistics.totalVisits }}</h2>
                  <p class="text-muted mb-0">{{ $t('visits.relationships.total_visits') }}</p>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="border border-gray-300 border-dashed rounded p-4 text-center">
                  <h2 class="text-success fw-bold mb-0">{{ statistics.completedVisits }}</h2>
                  <p class="text-muted mb-0">{{ $t('visits.relationships.completed_visits') }}</p>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="border border-gray-300 border-dashed rounded p-4 text-center">
                  <h2 class="text-danger fw-bold mb-0">{{ statistics.cancelledVisits }}</h2>
                  <p class="text-muted mb-0">{{ $t('visits.relationships.cancelled_visits') }}</p>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="border border-gray-300 border-dashed rounded p-4 text-center">
                  <h2 class="text-info fw-bold mb-0">{{ statistics.successRate }}%</h2>
                  <p class="text-muted mb-0">{{ $t('visits.relationships.success_rate') }}</p>
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
                  <tr v-if="recentVisits.length === 0">
                    <td colspan="7" class="text-center text-muted py-10">
                      {{ $t('visits.relationshipDetail.noVisits') }}
                    </td>
                  </tr>
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
                      <button
                        class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                        @click="handleViewVisit(visit.id)"
                        :title="$t('common.actions.viewDetails')"
                      >
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'
import { visitorRelationshipsApi } from '@/services/api/visits'
import ApiService from '@/core/services/ApiService'

// Composables
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// Refs
const loading = ref(true)
const relationshipData = ref<any>(null)

// Computed
const relationship = computed(() => {
  if (!relationshipData.value) return null

  const rel = relationshipData.value
  return {
    id: rel.id,
    visitorId: rel.visitor_id,
    visitorName: rel.visitor?.full_name || 'N/A',
    visitorPhoto: rel.visitor?.photo_url || null,
    inmateId: rel.inmate_id,
    inmateName: rel.inmate?.full_name || 'N/A',
    inmateCode: rel.inmate?.inmate_number || 'N/A',
    inmatePhoto: rel.inmate?.photo_url || null,
    relationshipType: rel.relationship_type?.name || 'N/A',
    status: rel.authorization_status || 'pending',
    registrationDate: rel.created_at,
    verified: rel.relationship_verified || false,
    verificationMethod: rel.relationship_description || null,
    documents: rel.supporting_documents || [],
    notes: rel.special_conditions || null
  }
})

const statistics = computed(() => {
  if (!relationshipData.value) return null

  const stats = relationshipData.value.visit_statistics
  if (!stats) {
    return {
      totalVisits: 0,
      completedVisits: 0,
      cancelledVisits: 0,
      successRate: 0,
      averageDuration: '-',
      lastVisit: null,
      visitFrequency: '-',
      preferredDay: '-',
      preferredTime: '-'
    }
  }

  return {
    totalVisits: stats.total_visits || 0,
    completedVisits: stats.completed_visits || 0,
    cancelledVisits: stats.cancelled_visits || 0,
    noShowVisits: stats.no_show_visits || 0,
    successRate: stats.success_rate || 0,
    averageDuration: '-', // TODO: Calculate from visit logs
    lastVisit: relationshipData.value.last_visit_date || null,
    visitFrequency: stats.visit_frequency || '-',
    preferredDay: stats.preferred_day || '-',
    preferredTime: stats.preferred_time || '-'
  }
})

const recentVisits = ref([])
const restrictions = ref([])

// Methods
const loadRelationshipData = async () => {
  try {
    loading.value = true
    const response = await visitorRelationshipsApi.getById(route.params.id)
    relationshipData.value = response.data.data

    // Load visit logs for this relationship
    await loadRecentVisits()
  } catch (error: any) {
    console.error('Error loading relationship:', error)
    Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'No se pudo cargar la relación',
      icon: 'error'
    }).then(() => {
      router.push('/visits/relationships')
    })
  } finally {
    loading.value = false
  }
}

const loadRecentVisits = async () => {
  try {
    // Load visit logs for this visitor-inmate pair
    const response = await ApiService.get('/visit-logs', {
      params: {
        visitor_id: relationshipData.value.visitor_id,
        inmate_id: relationshipData.value.inmate_id,
        per_page: 10
      }
    })

    // Handle both paginated and direct array responses
    let visits = null
    if (response.data?.data) {
      // Paginated response
      if (Array.isArray(response.data.data)) {
        visits = response.data.data
      } else if (response.data.data.data && Array.isArray(response.data.data.data)) {
        // Nested paginated response
        visits = response.data.data.data
      }
    } else if (Array.isArray(response.data)) {
      // Direct array response
      visits = response.data
    }

    if (visits && Array.isArray(visits)) {
      recentVisits.value = visits.map((visit: any) => ({
        id: visit.id,
        date: visit.actual_entry_datetime?.split('T')[0] || visit.requested_visit_date,
        time: visit.actual_entry_datetime?.split('T')[1]?.substring(0, 5) || visit.requested_start_time,
        type: visit.visit_type?.name || 'N/A',
        duration: visit.actual_duration_minutes || visit.requested_duration_minutes || 0,
        status: visit.status,
        observations: visit.visit_purpose || visit.entry_notes || visit.exit_notes || null
      }))
    } else {
      recentVisits.value = []
    }
  } catch (error) {
    console.error('Error loading recent visits:', error)
    recentVisits.value = []
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString('es-GT')
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    approved: 'badge badge-success',
    pending: 'badge badge-warning',
    rejected: 'badge badge-danger',
    suspended: 'badge badge-secondary',
    expired: 'badge badge-dark'
  }
  return classes[status] || 'badge badge-secondary'
}

const getVisitStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    scheduled: 'badge badge-light-primary',
    approved: 'badge badge-light-info',
    in_progress: 'badge badge-light-warning',
    completed: 'badge badge-light-success',
    cancelled: 'badge badge-light-danger',
    no_show: 'badge badge-light-secondary'
  }
  return classes[status] || 'badge badge-secondary'
}

const handleSuspend = async () => {
  const result = await Swal.fire({
    title: 'Suspender Relación',
    html: `
      <div class="text-start">
        <p class="mb-3">¿Está seguro que desea suspender esta relación de visitante?</p>
        <label class="form-label fw-bold">Motivo de la suspensión *</label>
        <textarea id="suspend-reason" class="form-control" rows="3" placeholder="Ingrese el motivo de la suspensión"></textarea>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Suspender',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const reason = (document.getElementById('suspend-reason') as HTMLTextAreaElement).value
      if (!reason || reason.trim() === '') {
        Swal.showValidationMessage('Por favor ingrese el motivo de la suspensión')
        return false
      }
      return reason
    }
  })

  if (result.isConfirmed && result.value) {
    try {
      await visitorRelationshipsApi.suspend(relationship.value.id, {
        reason: result.value
      })
      await loadRelationshipData()
      Swal.fire({
        title: '¡Éxito!',
        text: 'Relación de visitante suspendida exitosamente',
        icon: 'success'
      })
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo suspender la relación',
        icon: 'error'
      })
    }
  }
}

const handleActivate = async () => {
  const result = await Swal.fire({
    title: 'Reactivar Relación',
    text: '¿Está seguro que desea reactivar esta relación de visitante?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Reactivar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      await visitorRelationshipsApi.reactivate(relationship.value.id)
      await loadRelationshipData()
      Swal.fire({
        title: '¡Éxito!',
        text: 'Relación de visitante reactivada exitosamente',
        icon: 'success'
      })
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo reactivar la relación',
        icon: 'error'
      })
    }
  }
}

const handleViewVisit = (visitId: number) => {
  const visit = recentVisits.value.find(v => v.id === visitId)
  if (!visit) return

  Swal.fire({
    title: 'Detalles de la Visita',
    html: `
      <div class="text-start">
        <div class="mb-3">
          <label class="form-label fw-bold">Fecha:</label>
          <p class="mb-0">${formatDate(visit.date) || '-'}</p>
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Hora:</label>
          <p class="mb-0">${visit.time || '-'}</p>
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Tipo de Visita:</label>
          <p class="mb-0">${visit.type}</p>
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Duración:</label>
          <p class="mb-0">${visit.duration} minutos</p>
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Estado:</label>
          <p class="mb-0"><span class="${getVisitStatusBadgeClass(visit.status)}">${t(`visits.visitStatus.${visit.status}`)}</span></p>
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Observaciones:</label>
          <p class="mb-0">${visit.observations || '-'}</p>
        </div>
      </div>
    `,
    icon: 'info',
    confirmButtonText: 'Cerrar',
    width: '600px'
  })
}

const handleAddRestriction = () => {
  Swal.fire({
    title: 'Agregar Restricción',
    html: `
      <div class="text-start">
        <div class="mb-3">
          <label class="form-label">Tipo de Restricción</label>
          <select id="restrictionType" class="form-select">
            <option value="visit_frequency">Frecuencia de Visitas</option>
            <option value="visit_duration">Duración de Visita</option>
            <option value="contact_type">Tipo de Contacto</option>
            <option value="prohibited_items">Artículos Prohibidos</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Motivo</label>
          <textarea id="restrictionReason" class="form-control" rows="3"></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Fecha de Inicio</label>
          <input type="date" id="restrictionStartDate" class="form-control">
        </div>
        <div class="mb-3">
          <label class="form-label">Fecha de Fin (opcional)</label>
          <input type="date" id="restrictionEndDate" class="form-control">
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Agregar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const type = (document.getElementById('restrictionType') as HTMLSelectElement).value
      const reason = (document.getElementById('restrictionReason') as HTMLTextAreaElement).value
      const startDate = (document.getElementById('restrictionStartDate') as HTMLInputElement).value
      const endDate = (document.getElementById('restrictionEndDate') as HTMLInputElement).value

      if (!reason || !startDate) {
        Swal.showValidationMessage('Por favor complete todos los campos requeridos')
        return false
      }

      return { type, reason, startDate, endDate }
    }
  }).then(async (result) => {
    if (result.isConfirmed && result.value) {
      // TODO: Call API to add restriction when endpoint is ready
      Swal.fire({
        title: 'Pendiente',
        text: 'La funcionalidad de agregar restricciones estará disponible próximamente',
        icon: 'info'
      })
    }
  })
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
  }
}

// Lifecycle
onMounted(() => {
  loadRelationshipData()
})
</script>