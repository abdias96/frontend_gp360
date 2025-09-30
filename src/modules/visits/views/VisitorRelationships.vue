<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <h3>{{ $t('visits.relationships.title') }}</h3>
        <p class="text-muted">{{ $t('visits.relationships.subtitle') }}</p>
      </div>
      <div class="card-toolbar">
        <button 
          @click="showNewRelationshipModal = true"
          class="btn btn-primary btn-sm"
          v-if="canCreate"
        >
          <i class="fas fa-plus"></i>
          {{ $t('visits.relationships.new_relationship') }}
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- Summary Cards -->
      <div class="row mb-6">
        <div class="col-md-3">
          <div class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-xl-100"
               style="background-color: #50CD89; background-image: url('/assets/media/patterns/vector-1.png')">
            <div class="card-header pt-5">
              <div class="card-title d-flex flex-column">
                <div class="d-flex align-items-center">
                  <span class="fs-4 fw-semibold text-white me-1 align-self-start">{{ summary.approved }}</span>
                </div>
                <span class="text-white opacity-75 pt-1 fw-semibold fs-6">{{ $t('visits.relationships.authorization_status.approved') }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-xl-100"
               style="background-color: #FFC700; background-image: url('/assets/media/patterns/vector-1.png')">
            <div class="card-header pt-5">
              <div class="card-title d-flex flex-column">
                <div class="d-flex align-items-center">
                  <span class="fs-4 fw-semibold text-white me-1 align-self-start">{{ summary.pending }}</span>
                </div>
                <span class="text-white opacity-75 pt-1 fw-semibold fs-6">{{ $t('visits.relationships.authorization_status.pending') }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-xl-100"
               style="background-color: #7239EA; background-image: url('/assets/media/patterns/vector-1.png')">
            <div class="card-header pt-5">
              <div class="card-title d-flex flex-column">
                <div class="d-flex align-items-center">
                  <span class="fs-4 fw-semibold text-white me-1 align-self-start">{{ summary.consanguineous }}</span>
                </div>
                <span class="text-white opacity-75 pt-1 fw-semibold fs-6">Consanguíneas</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-xl-100"
               style="background-color: #F1416C; background-image: url('/assets/media/patterns/vector-1.png')">
            <div class="card-header pt-5">
              <div class="card-title d-flex flex-column">
                <div class="d-flex align-items-center">
                  <span class="fs-4 fw-semibold text-white me-1 align-self-start">{{ summary.requiring_supervision }}</span>
                </div>
                <span class="text-white opacity-75 pt-1 fw-semibold fs-6">Requieren Supervisión</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="row mb-6">
        <div class="col-md-3">
          <label class="form-label">PPL</label>
          <select v-model="filters.inmate_id" class="form-select">
            <option value="">Todos</option>
            <option v-for="inmate in inmates" :key="inmate.id" :value="inmate.id">
              {{ inmate.full_name }} ({{ inmate.document_number }})
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">{{ $t('visits.common.status') }}</label>
          <select v-model="filters.authorization_status" class="form-select">
            <option value="">Todos</option>
            <option value="pending">{{ $t('visits.relationships.authorization_status.pending') }}</option>
            <option value="approved">{{ $t('visits.relationships.authorization_status.approved') }}</option>
            <option value="rejected">{{ $t('visits.relationships.authorization_status.rejected') }}</option>
            <option value="suspended">{{ $t('visits.relationships.authorization_status.suspended') }}</option>
            <option value="expired">{{ $t('visits.relationships.authorization_status.expired') }}</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Tipo de Relación</label>
          <select v-model="filters.relationship_type_id" class="form-select">
            <option value="">Todos</option>
            <option v-for="type in relationshipTypes" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">{{ $t('visits.common.search') }}</label>
          <input 
            type="text" 
            v-model="filters.search"
            class="form-control"
            placeholder="Nombre visitante, DPI..."
          >
        </div>
      </div>

      <!-- Quick Filters -->
      <div class="mb-6">
        <button 
          @click="applyQuickFilter('pending_approval')"
          class="btn btn-sm btn-light me-2"
          :class="{ active: quickFilter === 'pending_approval' }"
        >
          <i class="fas fa-clock text-warning"></i>
          Pendientes de Aprobación
        </button>
        <button 
          @click="applyQuickFilter('consanguineous')"
          class="btn btn-sm btn-light me-2"
          :class="{ active: quickFilter === 'consanguineous' }"
        >
          <i class="fas fa-heart text-danger"></i>
          Relaciones Consanguíneas
        </button>
        <button 
          @click="applyQuickFilter('requiring_supervision')"
          class="btn btn-sm btn-light me-2"
          :class="{ active: quickFilter === 'requiring_supervision' }"
        >
          <i class="fas fa-eye text-info"></i>
          Requieren Supervisión
        </button>
        <button 
          @click="applyQuickFilter('expired')"
          class="btn btn-sm btn-light me-2"
          :class="{ active: quickFilter === 'expired' }"
        >
          <i class="fas fa-calendar-times text-danger"></i>
          Expiradas
        </button>
        <button 
          @click="clearFilters"
          class="btn btn-sm btn-secondary"
        >
          Limpiar Filtros
        </button>
      </div>

      <!-- Relationships Table -->
      <div class="table-responsive">
        <table class="table table-rounded table-striped border gy-7 gs-7">
          <thead>
            <tr class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              <th>Visitante</th>
              <th>PPL</th>
              <th>Relación</th>
              <th>Estado de Autorización</th>
              <th>Vigencia</th>
              <th>Límite Visitas</th>
              <th>Última Visita</th>
              <th>Tasa de Éxito</th>
              <th>{{ $t('visits.common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="relationship in relationships.data" :key="relationship.id">
              <td>
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-45px me-3">
                    <img v-if="relationship.visitor_photo_url" 
                         :src="relationship.visitor_photo_url" 
                         alt="Foto" 
                         class="symbol-label">
                    <div v-else class="symbol-label bg-light-primary">
                      <i class="fas fa-user text-primary"></i>
                    </div>
                  </div>
                  <div class="d-flex flex-column">
                    <span class="text-gray-800 fw-bold">{{ relationship.visitor_full_name }}</span>
                    <span class="text-muted fs-7">{{ relationship.visitor_document_number }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold">{{ relationship.inmate?.full_name }}</span>
                  <span class="text-muted fs-7">{{ relationship.inmate?.document_number }}</span>
                </div>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800">{{ relationship.relationship_type?.name }}</span>
                  <div class="mt-1">
                    <span v-if="relationship.is_consanguineous" 
                          class="badge badge-light-danger me-1"
                          title="Relación consanguínea">
                      <i class="fas fa-heart"></i>
                    </span>
                    <span v-if="relationship.requires_supervision" 
                          class="badge badge-light-warning"
                          title="Requiere supervisión">
                      <i class="fas fa-eye"></i>
                    </span>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge" :class="getAuthorizationStatusBadgeClass(relationship.authorization_status)">
                  {{ formatAuthorizationStatus(relationship.authorization_status) }}
                </span>
                <div v-if="relationship.is_authorization_expired" class="mt-1">
                  <small class="text-danger">
                    <i class="fas fa-exclamation-triangle"></i>
                    Expirada
                  </small>
                </div>
              </td>
              <td>
                <div v-if="relationship.authorization_date" class="d-flex flex-column">
                  <span class="text-gray-800 fs-7">{{ formatDate(relationship.authorization_expiry_date) }}</span>
                  <span class="text-muted fs-8">
                    {{ relationship.days_until_expiry > 0 ? `${relationship.days_until_expiry} días` : 'Expirada' }}
                  </span>
                </div>
                <span v-else class="text-muted">-</span>
              </td>
              <td>
                <div class="text-center">
                  <span class="badge badge-light-info">
                    {{ relationship.visit_frequency_limit || 'Sin límite' }}
                  </span>
                </div>
              </td>
              <td>
                <span v-if="relationship.last_visit_date" class="text-gray-800">
                  {{ formatDate(relationship.last_visit_date) }}
                  <small class="text-muted d-block">
                    ({{ relationship.last_visit_days_ago }} días atrás)
                  </small>
                </span>
                <span v-else class="text-muted">Sin visitas</span>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="progress h-6px w-60px me-2">
                    <div 
                      class="progress-bar" 
                      :class="getSuccessRateClass(relationship.visit_success_rate)"
                      :style="`width: ${relationship.visit_success_rate || 0}%`"
                    ></div>
                  </div>
                  <span class="fs-7 text-muted">{{ relationship.visit_success_rate || 0 }}%</span>
                </div>
              </td>
              <td>
                <div class="btn-group">
                  <button 
                    @click="viewRelationship(relationship)"
                    class="btn btn-light btn-sm"
                    title="Ver detalles"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    @click="authorizeRelationship(relationship)"
                    class="btn btn-success btn-sm"
                    v-if="relationship.authorization_status === 'pending' && canAuthorize"
                    title="Autorizar"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button 
                    @click="rejectRelationship(relationship)"
                    class="btn btn-danger btn-sm"
                    v-if="relationship.authorization_status === 'pending' && canAuthorize"
                    title="Rechazar"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                  <button 
                    @click="editRelationship(relationship)"
                    class="btn btn-primary btn-sm"
                    v-if="canEdit"
                    title="Editar"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <div class="btn-group">
                    <button 
                      class="btn btn-secondary btn-sm dropdown-toggle" 
                      data-bs-toggle="dropdown"
                      title="Más acciones"
                    >
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <ul class="dropdown-menu">
                      <li v-if="relationship.authorization_status !== 'suspended'">
                        <a class="dropdown-item" @click="suspendRelationship(relationship)">
                          <i class="fas fa-ban text-warning me-2"></i>
                          Suspender
                        </a>
                      </li>
                      <li v-if="relationship.authorization_status === 'suspended'">
                        <a class="dropdown-item" @click="reactivateRelationship(relationship)">
                          <i class="fas fa-check text-success me-2"></i>
                          Reactivar
                        </a>
                      </li>
                      <li v-if="relationship.is_eligible_for_renewal">
                        <a class="dropdown-item" @click="renewRelationship(relationship)">
                          <i class="fas fa-redo text-info me-2"></i>
                          Renovar Autorización
                        </a>
                      </li>
                      <li><hr class="dropdown-divider"></li>
                      <li>
                        <a class="dropdown-item" @click="viewVisitHistory(relationship)">
                          <i class="fas fa-history text-info me-2"></i>
                          Historial de Visitas
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item text-danger" @click="deleteRelationship(relationship)">
                          <i class="fas fa-trash text-danger me-2"></i>
                          Eliminar Relación
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="d-flex justify-content-between align-items-center mt-6">
        <div class="text-muted">
          Mostrando {{ relationships.from }} - {{ relationships.to }} de {{ relationships.total }} registros
        </div>
        <nav>
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: !relationships.prev_page_url }">
              <button class="page-link" @click="loadPage(relationships.current_page - 1)">Anterior</button>
            </li>
            <li 
              v-for="page in visiblePages" 
              :key="page"
              class="page-item" 
              :class="{ active: page === relationships.current_page }"
            >
              <button class="page-link" @click="loadPage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: !relationships.next_page_url }">
              <button class="page-link" @click="loadPage(relationships.current_page + 1)">Siguiente</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- New Relationship Modal -->
    <RelationshipModal 
      v-if="showNewRelationshipModal"
      @close="showNewRelationshipModal = false"
      @saved="handleRelationshipSaved"
    />

    <!-- Edit Relationship Modal -->
    <RelationshipModal 
      v-if="showEditModal"
      :relationship="selectedRelationship"
      @close="showEditModal = false"
      @saved="handleRelationshipUpdated"
    />

    <!-- Relationship Detail Modal -->
    <RelationshipDetailModal 
      v-if="showDetailModal"
      :relationship="selectedRelationship"
      @close="showDetailModal = false"
      @updated="handleRelationshipUpdated"
    />

    <!-- Authorization Modal -->
    <AuthorizationModal 
      v-if="showAuthorizationModal"
      :relationship="selectedRelationship"
      :action="authorizationAction"
      @close="showAuthorizationModal = false"
      @processed="handleAuthorizationProcessed"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import { visitorRelationshipsApi } from '@/services/api/visits'
import { catalogsApi } from '@/services/api/catalogs'
import RelationshipModal from '../components/RelationshipModal.vue'
import RelationshipDetailModal from '../components/RelationshipDetailModal.vue'
import AuthorizationModal from '../components/AuthorizationModal.vue'

const { showToast, showConfirm, showPrompt } = useToast()
const authStore = useAuthStore()
const { user } = authStore

// Data
const loading = ref(false)
const showNewRelationshipModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const showAuthorizationModal = ref(false)
const selectedRelationship = ref(null)
const authorizationAction = ref('')
const quickFilter = ref('')

const relationships = ref({
  data: [],
  current_page: 1,
  last_page: 1,
  per_page: 20,
  total: 0,
  from: 0,
  to: 0,
  prev_page_url: null,
  next_page_url: null
})

const summary = ref({
  approved: 0,
  pending: 0,
  consanguineous: 0,
  requiring_supervision: 0
})

const inmates = ref([])
const relationshipTypes = ref([])

const filters = reactive({
  inmate_id: '',
  authorization_status: '',
  relationship_type_id: '',
  search: ''
})

// Computed
const canCreate = computed(() => {
  return user.permissions?.includes('visits.relationships.create')
})

const canEdit = computed(() => {
  return user.permissions?.includes('visits.relationships.edit')
})

const canAuthorize = computed(() => {
  return user.permissions?.includes('visits.relationships.authorize')
})

const visiblePages = computed(() => {
  const pages = []
  const current = relationships.value.current_page
  const last = relationships.value.last_page
  
  let start = Math.max(1, current - 2)
  let end = Math.min(last, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const loadRelationships = async (page = 1) => {
  try {
    loading.value = true
    const params = {
      page,
      per_page: 20,
      ...filters
    }
    
    const response = await visitorRelationshipsApi.getList(params)
    relationships.value = response.data.relationships
    summary.value = response.data.summary
  } catch (error) {
    showToast('Error al cargar relaciones', 'error')
    console.error('Error loading relationships:', error)
  } finally {
    loading.value = false
  }
}

const loadCatalogs = async () => {
  try {
    const [inmatesRes, relationshipTypesRes] = await Promise.all([
      catalogsApi.inmates.getActive(),
      catalogsApi.relationshipTypes.getAll()
    ])
    
    inmates.value = inmatesRes.data
    relationshipTypes.value = relationshipTypesRes.data
  } catch (error) {
    console.error('Error loading catalogs:', error)
  }
}

const loadPage = (page) => {
  if (page >= 1 && page <= relationships.value.last_page) {
    loadRelationships(page)
  }
}

const applyQuickFilter = (filter) => {
  quickFilter.value = filter
  
  // Reset filters first
  Object.keys(filters).forEach(key => {
    filters[key] = ''
  })

  // Apply specific filter
  switch (filter) {
    case 'pending_approval':
      filters.authorization_status = 'pending'
      break
    case 'consanguineous':
      filters.is_consanguineous = 'true'
      break
    case 'requiring_supervision':
      filters.requires_supervision = 'true'
      break
    case 'expired':
      filters.authorization_status = 'expired'
      break
  }
  
  loadRelationships(1)
}

const clearFilters = () => {
  quickFilter.value = ''
  Object.keys(filters).forEach(key => {
    filters[key] = ''
  })
  loadRelationships(1)
}

const viewRelationship = (relationship) => {
  selectedRelationship.value = relationship
  showDetailModal.value = true
}

const editRelationship = (relationship) => {
  selectedRelationship.value = relationship
  showEditModal.value = true
}

const authorizeRelationship = (relationship) => {
  selectedRelationship.value = relationship
  authorizationAction.value = 'authorize'
  showAuthorizationModal.value = true
}

const rejectRelationship = (relationship) => {
  selectedRelationship.value = relationship
  authorizationAction.value = 'reject'
  showAuthorizationModal.value = true
}

const suspendRelationship = async (relationship) => {
  const reason = await showPrompt('Ingrese la razón de suspensión:')
  if (reason) {
    try {
      await visitorRelationshipsApi.suspend(relationship.id, { reason })
      showToast('Relación suspendida exitosamente', 'success')
      loadRelationships(relationships.value.current_page)
    } catch (error) {
      showToast('Error al suspender relación', 'error')
    }
  }
}

const reactivateRelationship = async (relationship) => {
  if (await showConfirm('¿Está seguro de reactivar esta relación?')) {
    try {
      await visitorRelationshipsApi.reactivate(relationship.id)
      showToast('Relación reactivada exitosamente', 'success')
      loadRelationships(relationships.value.current_page)
    } catch (error) {
      showToast('Error al reactivar relación', 'error')
    }
  }
}

const renewRelationship = async (relationship) => {
  if (await showConfirm('¿Está seguro de renovar la autorización de esta relación?')) {
    try {
      await visitorRelationshipsApi.renew(relationship.id)
      showToast('Autorización renovada exitosamente', 'success')
      loadRelationships(relationships.value.current_page)
    } catch (error) {
      showToast('Error al renovar autorización', 'error')
    }
  }
}

const deleteRelationship = async (relationship) => {
  if (await showConfirm('¿Está seguro de eliminar esta relación? Esta acción no se puede deshacer.')) {
    try {
      await visitorRelationshipsApi.delete(relationship.id)
      showToast('Relación eliminada exitosamente', 'success')
      loadRelationships(relationships.value.current_page)
    } catch (error) {
      if (error.response?.status === 422) {
        showToast('No se puede eliminar - existen visitas pendientes o activas', 'error')
      } else {
        showToast('Error al eliminar relación', 'error')
      }
    }
  }
}

const viewVisitHistory = (relationship) => {
  // Implementation for visit history modal
  console.log('View visit history for relationship:', relationship)
}

const handleRelationshipSaved = () => {
  showNewRelationshipModal.value = false
  loadRelationships(1)
}

const handleRelationshipUpdated = () => {
  showEditModal.value = false
  showDetailModal.value = false
  loadRelationships(relationships.value.current_page)
}

const handleAuthorizationProcessed = () => {
  showAuthorizationModal.value = false
  loadRelationships(relationships.value.current_page)
}

// Formatting methods
const formatDate = (date) => {
  return date ? new Date(date).toLocaleDateString('es-GT') : ''
}

const formatAuthorizationStatus = (status) => {
  const statuses = {
    'pending': 'Pendiente',
    'approved': 'Aprobada',
    'rejected': 'Rechazada',
    'suspended': 'Suspendida',
    'expired': 'Expirada'
  }
  return statuses[status] || status
}

const getAuthorizationStatusBadgeClass = (status) => {
  const classes = {
    'pending': 'badge-light-warning',
    'approved': 'badge-light-success',
    'rejected': 'badge-light-danger',
    'suspended': 'badge-light-secondary',
    'expired': 'badge-light-dark'
  }
  return classes[status] || 'badge-light-secondary'
}

const getSuccessRateClass = (rate) => {
  if (rate >= 80) return 'bg-success'
  if (rate >= 60) return 'bg-warning'
  return 'bg-danger'
}

// Watchers
watch(filters, () => {
  if (quickFilter.value === '') {
    loadRelationships(1)
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadRelationships()
  loadCatalogs()
})
</script>