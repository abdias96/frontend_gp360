<template>
  <div 
    id="relationshipDetailModal" 
    class="modal fade" 
    tabindex="-1" 
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">{{ $t('visits.relationships.relationship_details') }}</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" @click="close">
            <i class="ki-duotone ki-cross fs-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
        </div>

        <div class="modal-body py-10 px-lg-17">
          <div v-if="loading" class="text-center py-10">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          <div v-else-if="relationship" class="row g-7">
            <!-- Header Info -->
            <div class="col-12">
              <div class="card border border-dashed border-primary">
                <div class="card-body p-6">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="d-flex align-items-center">
                        <div class="symbol symbol-60px me-4">
                          <img v-if="relationship.visitor?.photo_url" 
                               :src="relationship.visitor.photo_url" 
                               alt="Visitor photo" 
                               class="symbol-label">
                          <div v-else class="symbol-label bg-light-primary">
                            <i class="fas fa-user fs-2x text-primary"></i>
                          </div>
                        </div>
                        <div>
                          <div class="fw-bold fs-5">{{ relationship.visitor?.full_name }}</div>
                          <div class="text-muted">{{ relationship.visitor?.document_number }}</div>
                          <div class="badge badge-light-primary mt-1">{{ $t('visits.common.visitor') }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="d-flex align-items-center">
                        <div class="symbol symbol-60px me-4">
                          <img v-if="relationship.inmate?.photo_url" 
                               :src="relationship.inmate.photo_url" 
                               alt="Inmate photo" 
                               class="symbol-label">
                          <div v-else class="symbol-label bg-light-warning">
                            <i class="fas fa-user fs-2x text-warning"></i>
                          </div>
                        </div>
                        <div>
                          <div class="fw-bold fs-5">{{ relationship.inmate?.full_name }}</div>
                          <div class="text-muted">{{ relationship.inmate?.document_number }}</div>
                          <div class="badge badge-light-warning mt-1">{{ $t('visits.common.inmate') }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Relationship Information -->
            <div class="col-md-6">
              <div class="card h-100">
                <div class="card-header">
                  <h3 class="card-title">{{ $t('visits.relationships.relationship_information') }}</h3>
                </div>
                <div class="card-body">
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">{{ $t('visits.relationships.relationship_type') }}:</div>
                    <div class="fs-6">{{ relationship.relationship_type?.name || 'N/A' }}</div>
                  </div>
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">{{ $t('visits.relationships.verification_document') }}:</div>
                    <div class="fs-6">{{ relationship.verification_document || 'N/A' }}</div>
                  </div>
                  <div class="mb-4">
                    <div class="d-flex align-items-center">
                      <div class="form-check form-switch me-5">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          :checked="relationship.is_consanguineous"
                          disabled
                        >
                        <label class="form-check-label">
                          {{ $t('visits.relationships.is_consanguineous') }}
                        </label>
                      </div>
                      <div class="form-check form-switch me-5">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          :checked="relationship.requires_supervision"
                          disabled
                        >
                        <label class="form-check-label">
                          {{ $t('visits.relationships.requires_supervision') }}
                        </label>
                      </div>
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          :checked="relationship.is_legal_representative"
                          disabled
                        >
                        <label class="form-check-label">
                          {{ $t('visits.relationships.is_legal_representative') }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Authorization Status -->
            <div class="col-md-6">
              <div class="card h-100">
                <div class="card-header">
                  <h3 class="card-title">{{ $t('visits.relationships.authorization_status_title') }}</h3>
                </div>
                <div class="card-body">
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">{{ $t('visits.relationships.current_status') }}:</div>
                    <span class="badge" :class="getAuthorizationStatusBadgeClass(relationship.authorization_status)">
                      {{ formatAuthorizationStatus(relationship.authorization_status) }}
                    </span>
                  </div>
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">{{ $t('visits.relationships.authorization_date') }}:</div>
                    <div class="fs-6">{{ formatDate(relationship.authorization_date) || 'N/A' }}</div>
                  </div>
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">{{ $t('visits.relationships.expiry_date') }}:</div>
                    <div class="fs-6">
                      {{ formatDate(relationship.authorization_expiry_date) || 'N/A' }}
                      <span v-if="relationship.days_until_expiry !== null" 
                            class="ms-2"
                            :class="relationship.days_until_expiry > 0 ? 'text-success' : 'text-danger'">
                        ({{ relationship.days_until_expiry > 0 ? 
                             $t('visits.relationships.days_remaining', { days: relationship.days_until_expiry }) : 
                             $t('visits.relationships.expired') }})
                      </span>
                    </div>
                  </div>
                  <div class="mb-4" v-if="relationship.authorized_by">
                    <div class="fw-semibold text-gray-600 mb-1">{{ $t('visits.relationships.authorized_by') }}:</div>
                    <div class="fs-6">{{ relationship.authorized_by.full_name }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Visit Restrictions -->
            <div class="col-md-6">
              <div class="card h-100">
                <div class="card-header">
                  <h3 class="card-title">{{ $t('visits.relationships.visit_restrictions') }}</h3>
                </div>
                <div class="card-body">
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">{{ $t('visits.relationships.visit_frequency_limit') }}:</div>
                    <div class="fs-6">
                      <span class="badge badge-light-info">
                        {{ relationship.visit_frequency_limit || $t('visits.relationships.no_limit') }}
                      </span>
                    </div>
                  </div>
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">{{ $t('visits.relationships.visit_duration_limit') }}:</div>
                    <div class="fs-6">
                      <span class="badge badge-light-info">
                        {{ relationship.visit_duration_limit ? 
                           `${relationship.visit_duration_limit} ${$t('common.minutes')}` : 
                           $t('visits.relationships.standard_duration') }}
                      </span>
                    </div>
                  </div>
                  <div class="mb-4" v-if="relationship.last_visit_date">
                    <div class="fw-semibold text-gray-600 mb-1">{{ $t('visits.relationships.last_visit') }}:</div>
                    <div class="fs-6">
                      {{ formatDate(relationship.last_visit_date) }}
                      <span class="text-muted ms-2">
                        ({{ $t('visits.relationships.days_ago', { days: relationship.last_visit_days_ago }) }})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Visit Statistics -->
            <div class="col-md-6">
              <div class="card h-100">
                <div class="card-header">
                  <h3 class="card-title">{{ $t('visits.relationships.visit_statistics') }}</h3>
                </div>
                <div class="card-body">
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">{{ $t('visits.relationships.total_visits') }}:</div>
                    <div class="fs-3 fw-bold text-primary">{{ relationship.visit_statistics?.total_visits || 0 }}</div>
                  </div>
                  <div class="row">
                    <div class="col-6">
                      <div class="mb-4">
                        <div class="fw-semibold text-gray-600 mb-1">{{ $t('visits.relationships.completed_visits') }}:</div>
                        <div class="fs-6 fw-bold text-success">{{ relationship.visit_statistics?.completed_visits || 0 }}</div>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="mb-4">
                        <div class="fw-semibold text-gray-600 mb-1">{{ $t('visits.relationships.cancelled_visits') }}:</div>
                        <div class="fs-6 fw-bold text-danger">{{ relationship.visit_statistics?.cancelled_visits || 0 }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">{{ $t('visits.relationships.success_rate') }}:</div>
                    <div class="d-flex align-items-center">
                      <div class="progress h-8px w-100px me-3">
                        <div 
                          class="progress-bar" 
                          :class="getSuccessRateClass(relationship.visit_success_rate)"
                          :style="`width: ${relationship.visit_success_rate || 0}%`"
                        ></div>
                      </div>
                      <span class="fw-bold">{{ relationship.visit_success_rate || 0 }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="col-12" v-if="recentActivities.length > 0">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">{{ $t('visits.relationships.recent_activity') }}</h3>
                  <div class="card-toolbar">
                    <button
                      @click="viewFullHistory"
                      class="btn btn-sm btn-light-primary"
                    >
                      {{ $t('visits.relationships.view_full_history') }}
                    </button>
                  </div>
                </div>
                <div class="card-body">
                  <div class="timeline">
                    <div v-for="activity in recentActivities" :key="activity.id" class="timeline-item">
                      <div class="timeline-line w-40px"></div>
                      <div class="timeline-icon" :class="getActivityIconClass(activity.type)">
                        <i class="fas" :class="getActivityIcon(activity.type)"></i>
                      </div>
                      <div class="timeline-content mb-10 mt-n1">
                        <div class="pe-3 mb-3">
                          <div class="fs-5 fw-semibold mb-2">{{ activity.description }}</div>
                          <div class="d-flex align-items-center mt-1 fs-6">
                            <div class="text-muted me-2 fs-7">{{ formatDateTime(activity.created_at) }}</div>
                            <div class="symbol symbol-circle symbol-25px ms-4">
                              <span class="symbol-label bg-light-primary text-primary fs-8">
                                {{ activity.causer?.initials }}
                              </span>
                            </div>
                            <div class="text-gray-600 fs-7 ms-2">{{ activity.causer?.full_name }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div class="col-12" v-if="relationship.notes">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">{{ $t('visits.relationships.notes') }}</h3>
                </div>
                <div class="card-body">
                  <div class="bg-light p-4 rounded">{{ relationship.notes }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="close">
            {{ $t('common.close') }}
          </button>
          <button 
            v-if="canEdit"
            type="button" 
            class="btn btn-primary"
            @click="editRelationship"
          >
            <i class="fas fa-edit me-2"></i>
            {{ $t('common.edit') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, computed } from 'vue'
import { Modal } from 'bootstrap'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { visitorRelationshipsApi } from '@/services/api/visits'
import type { VisitorRelationship } from '@/types/visits'

// Props
interface Props {
  relationship?: VisitorRelationship | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  edit: [relationship: VisitorRelationship]
  updated: [relationship: VisitorRelationship]
}>()

// Composables
const { t } = useI18n()
const authStore = useAuthStore()
const { user } = authStore
const { showToast } = useToast()

// State
const modalRef = ref<HTMLElement>()
const modal = ref<Modal>()
const recentActivities = ref([])
const relationshipData = ref<VisitorRelationship | null>(null)
const loading = ref(false)

// Computed
const canEdit = computed(() => {
  return user.permissions?.includes('visits.relationships_edit')
})

const relationship = computed(() => {
  return relationshipData.value || props.relationship
})

// Methods
const initializeModal = async () => {
  await nextTick()
  if (modalRef.value) {
    modal.value = new Modal(modalRef.value)
    modal.value.show()
  }
}

const loadRelationshipDetails = async () => {
  if (!props.relationship?.id) return

  try {
    loading.value = true
    const response = await visitorRelationshipsApi.getById(props.relationship.id)
    const data = response.data.data || response.data

    relationshipData.value = data
  } catch (error) {
    console.error('Error loading relationship details:', error)
    showToast('Error al cargar detalles de la relación', 'error')
  } finally {
    loading.value = false
  }
}

const loadRecentActivities = async () => {
  if (!props.relationship) return

  try {
    const response = await visitorRelationshipsApi.getActivities(props.relationship.id, { limit: 5 })
    recentActivities.value = response.data.data || response.data || []
  } catch (error) {
    // Endpoint not implemented yet, silently fail
    if (error.response?.status !== 404) {
      console.error('Error loading activities:', error)
    }
    recentActivities.value = []
  }
}

const close = () => {
  modal.value?.hide()
  emit('close')
}

const editRelationship = () => {
  emit('edit', relationshipData.value || props.relationship!)
  close()
}

const viewFullHistory = () => {
  // TODO: Navigate to full history view
  console.log('View full history for relationship:', props.relationship?.id)
}

// Utility functions
const formatDate = (date: string) => {
  if (!date) return null
  return new Date(date).toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (date: string) => {
  if (!date) return null
  return new Date(date).toLocaleString('es-GT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatAuthorizationStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: t('visits.relationships.authorization_status.pending'),
    approved: t('visits.relationships.authorization_status.approved'),
    rejected: t('visits.relationships.authorization_status.rejected'),
    suspended: t('visits.relationships.authorization_status.suspended'),
    expired: t('visits.relationships.authorization_status.expired')
  }
  return statusMap[status] || status
}

const getAuthorizationStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'badge-light-warning',
    approved: 'badge-light-success',
    rejected: 'badge-light-danger',
    suspended: 'badge-light-dark',
    expired: 'badge-light-secondary'
  }
  return classes[status] || 'badge-light-secondary'
}

const getSuccessRateClass = (rate: number) => {
  if (rate >= 90) return 'bg-success'
  if (rate >= 70) return 'bg-warning'
  return 'bg-danger'
}

const getActivityIconClass = (type: string) => {
  const classes: Record<string, string> = {
    created: 'bg-light-success',
    updated: 'bg-light-primary',
    authorized: 'bg-light-success',
    rejected: 'bg-light-danger',
    suspended: 'bg-light-warning',
    visit_completed: 'bg-light-info'
  }
  return `symbol symbol-circle ${classes[type] || 'bg-light'}`
}

const getActivityIcon = (type: string) => {
  const icons: Record<string, string> = {
    created: 'fa-plus',
    updated: 'fa-edit',
    authorized: 'fa-check',
    rejected: 'fa-times',
    suspended: 'fa-ban',
    visit_completed: 'fa-user-check'
  }
  return icons[type] || 'fa-circle'
}

// Watch for relationship changes
watch(() => props.relationship, async () => {
  if (props.relationship) {
    await loadRelationshipDetails()
    await loadRecentActivities()
  }
}, { immediate: true })

// Lifecycle
onMounted(async () => {
  await initializeModal()
  
  modalRef.value?.addEventListener('hidden.bs.modal', () => {
    emit('close')
  })
})
</script>