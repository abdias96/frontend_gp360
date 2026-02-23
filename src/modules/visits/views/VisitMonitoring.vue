<template>
  <div>
    <!-- begin::page-header -->
    <div class="row gy-5 g-xl-10 mb-5 mb-xl-10">
      <div class="col-md-12">
        <div class="d-flex flex-column flex-md-row align-items-center justify-content-between">
          <div>
            <h1 class="fs-2x fw-bold text-gray-900 mb-2">
              {{ isVisitorHistoryMode ? 'Historial de Visitas' : 'Control de Entradas y Salidas' }}
            </h1>
            <p v-if="isVisitorHistoryMode && visitorNameFromQuery" class="text-muted fs-5 mb-0">
              Visitante: {{ visitorNameFromQuery }}
            </p>
          </div>
          <div class="d-flex gap-2">
            <router-link
              v-if="isVisitorHistoryMode"
              to="/visits/visitor-management"
              class="btn btn-light-secondary"
            >
              <i class="fas fa-arrow-left"></i>
              Volver
            </router-link>
            <button
              v-else
              class="btn btn-light-success"
              @click="refreshActiveVisits"
            >
              <i class="fas fa-sync"></i>
              Actualizar
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- end::page-header -->

    <!-- begin::visitor history -->
    <div v-if="isVisitorHistoryMode" class="row g-5">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-history me-2"></i>
              Registros de Visitas
            </h3>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-10">
              <span class="spinner-border spinner-border-lg"></span>
              <p class="mt-3">Cargando historial...</p>
            </div>
            <div v-else-if="visitorHistory.length === 0" class="text-center py-10">
              <i class="fas fa-inbox fs-3x text-muted mb-4"></i>
              <p class="text-muted">No hay registros de visitas para este visitante</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-row-bordered table-hover align-middle gs-7">
                <thead>
                  <tr class="fw-bold fs-6 text-gray-800">
                    <th>Fecha</th>
                    <th>Interno Visitado</th>
                    <th>Tipo de Visita</th>
                    <th>Hora Entrada</th>
                    <th>Hora Salida</th>
                    <th>Duración</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="visit in visitorHistory" :key="visit.id">
                    <td>{{ formatDate(visit.requested_visit_date) }}</td>
                    <td>
                      <div class="d-flex flex-column">
                        <span class="fw-bold">{{ visit.inmate?.first_name }} {{ visit.inmate?.last_name }}</span>
                        <span class="text-muted fs-7">{{ visit.inmate?.document_number }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="badge badge-light-primary">{{ visit.visitType?.name || 'N/A' }}</span>
                    </td>
                    <td>{{ visit.actual_entry_datetime ? formatTime(visit.actual_entry_datetime) : '-' }}</td>
                    <td>{{ visit.actual_exit_datetime ? formatTime(visit.actual_exit_datetime) : '-' }}</td>
                    <td>{{ visit.duration_formatted || '-' }}</td>
                    <td>
                      <span
                        class="badge"
                        :class="{
                          'badge-light-success': visit.status === 'completed',
                          'badge-light-primary': visit.status === 'in_progress',
                          'badge-light-warning': visit.status === 'approved',
                          'badge-light-danger': visit.status === 'rejected',
                          'badge-light-secondary': visit.status === 'cancelled'
                        }"
                      >
                        {{ getStatusLabel(visit.status) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end::visitor history -->

    <!-- begin::visit control -->
    <div v-else class="row g-5">
      <!-- Visit Registration Form -->
      <div class="col-xl-5" v-if="canRegister">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-sign-in-alt me-2"></i>
              Registrar Nueva Visita
            </h3>
          </div>
          <div class="card-body">
            <!-- Step 1: Search Visitor -->
            <div class="mb-6">
              <label class="form-label fw-bold required">Buscar Visitante por DPI</label>
              <div class="position-relative">
                <input
                  v-model="visitorDpi"
                  type="text"
                  class="form-control"
                  placeholder="Ingrese al menos 4 dígitos del DPI..."
                  @input="handleVisitorSearch"
                  @focus="showSearchResults = true"
                  @blur="handleSearchBlur"
                  :disabled="loading"
                  autocomplete="off"
                />
                <small class="text-muted">Ingrese al menos 4 dígitos para buscar</small>

                <!-- Search Results Dropdown -->
                <div
                  v-if="showSearchResults && searchResults.length > 0"
                  class="position-absolute w-100 mt-1 bg-white border rounded shadow-sm"
                  style="max-height: 300px; overflow-y: auto; z-index: 1050;"
                >
                  <div
                    v-for="visitor in searchResults"
                    :key="visitor.id"
                    class="p-3 border-bottom cursor-pointer hover-bg-light-primary"
                    @mousedown.prevent="selectVisitor(visitor)"
                  >
                    <div class="d-flex align-items-center">
                      <div class="symbol symbol-40px me-3">
                        <img
                          :src="visitor.front_photo_path
                            ? `${apiUrl}/storage/${visitor.front_photo_path}`
                            : '/media/avatars/blank.png'"
                          alt=""
                          class="rounded"
                        />
                      </div>
                      <div class="flex-grow-1">
                        <div class="fw-bold">{{ visitor.full_name }}</div>
                        <div class="text-muted fs-7">DPI: {{ visitor.document_number }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- No Results Message -->
                <div
                  v-if="showSearchResults && searchResults.length === 0 && visitorDpi.length >= 4"
                  class="position-absolute w-100 mt-1 bg-white border rounded shadow-sm p-3"
                  style="z-index: 1050;"
                >
                  <div class="text-muted text-center">
                    <i class="fas fa-search me-2"></i>
                    No se encontraron visitantes
                  </div>
                </div>
              </div>
            </div>

            <!-- Visitor Info (if found) -->
            <div v-if="selectedVisitor" class="mb-6">
              <div class="alert alert-success d-flex align-items-center">
                <div class="symbol symbol-50px me-3">
                  <img
                    :src="selectedVisitor.front_photo_path
                      ? `${apiUrl}/storage/${selectedVisitor.front_photo_path}`
                      : '/media/avatars/blank.png'"
                    alt="Visitante"
                    class="rounded"
                  />
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ selectedVisitor.full_name }}</div>
                  <div class="text-muted fs-7">DPI: {{ selectedVisitor.document_number }}</div>
                  <div class="text-muted fs-7">
                    <span class="badge badge-light-success">{{ selectedVisitor.status }}</span>
                  </div>
                </div>
                <button
                  class="btn btn-sm btn-icon btn-light"
                  @click="clearVisitor"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>

              <!-- Step 2: Select Inmate -->
              <div v-if="approvedRelationships.length > 0" class="mb-6">
                <label class="form-label fw-bold required">Seleccionar PPL a Visitar</label>
                <select
                  v-model="selectedRelationship"
                  class="form-select"
                  @change="onRelationshipChange"
                >
                  <option :value="null">Seleccione un interno</option>
                  <option
                    v-for="rel in approvedRelationships"
                    :key="rel.id"
                    :value="rel"
                  >
                    {{ rel.inmate?.first_name }} {{ rel.inmate?.last_name }}
                    ({{ rel.inmate?.document_number || 'Sin DPI' }}) -
                    {{ rel.inmate?.current_center?.name || rel.inmate?.currentCenter?.name || 'Sin centro asignado' }}
                  </option>
                </select>
              </div>
              <div v-else class="alert alert-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Este visitante no tiene PPL autorizados para visitar.
              </div>

              <!-- Step 3: Visit Details -->
              <div v-if="selectedRelationship">
                <div class="mb-4">
                  <label class="form-label fw-bold required">Tipo de Visita</label>
                  <select v-model="visitForm.visit_type_id" class="form-select">
                    <option :value="null">Seleccione tipo de visita</option>
                    <option
                      v-for="type in visitTypes.filter(t => t && t.id)"
                      :key="type.id"
                      :value="type.id"
                    >
                      {{ type.name }}
                    </option>
                  </select>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-bold">Motivo de la Visita</label>
                  <textarea
                    v-model="visitForm.visit_purpose"
                    class="form-control"
                    rows="2"
                    placeholder="Opcional"
                  ></textarea>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-bold">Observaciones de Entrada</label>
                  <textarea
                    v-model="visitForm.entry_notes"
                    class="form-control"
                    rows="2"
                    placeholder="Alguna nota especial sobre el ingreso"
                  ></textarea>
                </div>

                <button
                  class="btn btn-success w-100"
                  @click="registerEntry"
                  :disabled="!visitForm.visit_type_id || loading"
                >
                  <i class="fas fa-sign-in-alt me-2"></i>
                  Registrar Entrada
                </button>
              </div>
            </div>

            <div v-else-if="!loading && visitorSearched" class="alert alert-info">
              <i class="fas fa-info-circle me-2"></i>
              Busque un visitante por DPI para comenzar
            </div>
          </div>
        </div>
      </div>

      <!-- Active Visits Panel -->
      <div :class="canRegister ? 'col-xl-7' : 'col-xl-12'">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-users me-2"></i>
              Visitas en Curso
              <span class="badge badge-light-primary ms-2">{{ activeVisits.length }}</span>
            </h3>
            <div class="card-toolbar d-flex align-items-center gap-3">
              <div style="min-width: 250px;">
                <Multiselect
                  v-model="filterCenter"
                  :options="centersOptions"
                  :searchable="true"
                  placeholder="Todos los centros"
                  noOptionsText="No hay opciones disponibles"
                  noResultsText="Sin resultados"
                  :canClear="true"
                  :canDeselect="true"
                />
              </div>
              <span v-if="overdueVisitsCount > 0" class="badge badge-light-danger">
                <i class="fas fa-exclamation-triangle me-1"></i>
                {{ overdueVisitsCount }} fuera de tiempo
              </span>
            </div>
          </div>
          <div class="card-body p-0">
            <div v-if="activeVisits.length > 0" class="table-responsive">
              <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th class="ps-4">Visitante</th>
                    <th>PPL</th>
                    <th>Tipo</th>
                    <th>Hora Entrada</th>
                    <th>Tiempo Transcurrido</th>
                    <th class="text-end pe-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="visit in activeVisits"
                    :key="visit.id"
                    :class="{ 'bg-light-danger': visit.is_overdue }"
                  >
                    <td class="ps-4">
                      <div class="d-flex align-items-center">
                        <div class="symbol symbol-45px me-3">
                          <img
                            :src="getVisitorPhotoUrl(visit.visitor)"
                            alt="Visitante"
                            class="rounded"
                          />
                        </div>
                        <div>
                          <div class="fw-bold text-gray-900">
                            {{ visit.visitor?.full_name || 'N/A' }}
                          </div>
                          <div class="text-muted fs-7">
                            DPI: {{ visit.visitor?.document_number || 'N/A' }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="fw-bold">
                        {{ visit.inmate?.first_name }} {{ visit.inmate?.last_name }}
                      </div>
                      <div class="text-muted fs-7">
                        {{ visit.inmate?.document_number }}
                      </div>
                    </td>
                    <td>
                      <span class="badge badge-light-info">
                        {{ visit.visit_type?.name || 'N/A' }}
                      </span>
                    </td>
                    <td>
                      <div class="fw-bold">
                        {{ formatTime(visit.actual_entry_datetime) }}
                      </div>
                      <div class="text-muted fs-7">
                        {{ formatDate(visit.actual_entry_datetime) }}
                      </div>
                    </td>
                    <td>
                      <div
                        class="fw-bold"
                        :class="visit.is_overdue ? 'text-danger' : 'text-success'"
                      >
                        <i class="fas fa-clock me-1"></i>
                        {{ visit.elapsed_time_formatted || calculateElapsedTime(visit.actual_entry_datetime) }}
                      </div>
                      <div v-if="visit.is_overdue" class="text-danger fs-7">
                        <i class="fas fa-exclamation-triangle me-1"></i>
                        Excedido
                      </div>
                    </td>
                    <td class="text-end pe-4">
                      <button
                        v-if="canRegister"
                        class="btn btn-sm btn-danger"
                        @click="showExitModal(visit)"
                      >
                        <i class="fas fa-sign-out-alt me-1"></i>
                        Finalizar Visita
                      </button>
                      <span v-else class="badge badge-light-secondary">
                        Vista solo lectura
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center py-10">
              <i class="fas fa-users fs-3x text-muted mb-3"></i>
              <p class="text-muted fw-bold mb-0">No hay visitas activas en este momento</p>
            </div>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div class="row g-5 mt-1">
          <div class="col-md-4">
            <div class="card bg-light-primary">
              <div class="card-body p-5">
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-50px me-3">
                    <span class="symbol-label bg-primary">
                      <i class="fas fa-users text-white fs-2x"></i>
                    </span>
                  </div>
                  <div>
                    <div class="fs-2x fw-bold text-primary">{{ activeVisits.length }}</div>
                    <div class="text-muted fw-bold">Visitas Activas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card bg-light-success">
              <div class="card-body p-5">
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-50px me-3">
                    <span class="symbol-label bg-success">
                      <i class="fas fa-check-circle text-white fs-2x"></i>
                    </span>
                  </div>
                  <div>
                    <div class="fs-2x fw-bold text-success">{{ statistics.completed_today || 0 }}</div>
                    <div class="text-muted fw-bold">Completadas Hoy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card bg-light-warning">
              <div class="card-body p-5">
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-50px me-3">
                    <span class="symbol-label bg-warning">
                      <i class="fas fa-clock text-white fs-2x"></i>
                    </span>
                  </div>
                  <div>
                    <div class="fs-2x fw-bold text-warning">{{ formatDuration(statistics.average_duration_minutes) }}</div>
                    <div class="text-muted fw-bold">Duración Promedio</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end::visit control -->

    <!-- Exit Visit Modal -->
    <div
      class="modal fade"
      id="exitVisitModal"
      tabindex="-1"
      aria-hidden="true"
      ref="exitModalRef"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Finalizar Visita</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div v-if="visitToExit" class="modal-body">
            <div class="mb-4">
              <div class="d-flex align-items-center mb-3">
                <div class="symbol symbol-50px me-3">
                  <img
                    :src="getVisitorPhotoUrl(visitToExit.visitor)"
                    alt="Visitante"
                    class="rounded"
                  />
                </div>
                <div>
                  <div class="fw-bold">{{ visitToExit.visitor?.full_name }}</div>
                  <div class="text-muted fs-7">
                    Visitando a: {{ visitToExit.inmate?.first_name }} {{ visitToExit.inmate?.last_name }}
                  </div>
                </div>
              </div>
              <div class="separator my-3"></div>
              <div class="row">
                <div class="col-6">
                  <div class="text-muted">Hora Entrada:</div>
                  <div class="fw-bold">{{ formatTime(visitToExit.actual_entry_datetime) }}</div>
                </div>
                <div class="col-6">
                  <div class="text-muted">Tiempo Transcurrido:</div>
                  <div class="fw-bold text-primary">
                    {{ calculateElapsedTime(visitToExit.actual_entry_datetime) }}
                  </div>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label fw-bold">Observaciones de Salida</label>
              <textarea
                v-model="exitForm.exit_notes"
                class="form-control"
                rows="3"
                placeholder="Alguna observación sobre la salida"
              ></textarea>
            </div>

            <div class="mb-4">
              <label class="form-label fw-bold">Calificación de la Visita (Opcional)</label>
              <div class="rating">
                <div class="rating-label me-2 fs-5">
                  <i
                    v-for="star in 5"
                    :key="star"
                    class="fas fa-star"
                    :class="star <= (exitForm.visit_rating || 0) ? 'text-warning' : 'text-muted'"
                    @click="exitForm.visit_rating = star"
                    style="cursor: pointer;"
                  ></i>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-light"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="registerExit"
              :disabled="loading"
            >
              <i class="fas fa-sign-out-alt me-2"></i>
              Finalizar Visita
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import ApiService from '@/core/services/ApiService'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'
import { useCatalogs } from '@/composables/useCatalogs'
import Multiselect from '@vueform/multiselect'

// Route
const route = useRoute()

// Auth Store
const authStore = useAuthStore()

// Catalogs
const { centersOptions, loadCatalogs } = useCatalogs()

// Permissions
const canView = computed(() => authStore.isSuperAdmin || authStore.hasPermission('visits.control_view'))
const canRegister = computed(() => authStore.isSuperAdmin || authStore.hasPermission('visits.control_register'))

// Check if viewing specific visitor history
const isVisitorHistoryMode = computed(() => !!route.query.visitor_id)
const visitorIdFromQuery = computed(() => route.query.visitor_id ? Number(route.query.visitor_id) : null)
const visitorNameFromQuery = computed(() => route.query.visitor_name as string || '')

// API URL
const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Refs
const filterCenter = ref<number | null>(null)
const loading = ref(false)
const visitorDpi = ref('')
const visitorSearched = ref(false)
const selectedVisitor = ref<any>(null)
const approvedRelationships = ref<any[]>([])
const selectedRelationship = ref<any>(null)
const visitTypes = ref<any[]>([])
const activeVisits = ref<any[]>([])
const visitToExit = ref<any>(null)
const exitModalRef = ref<HTMLElement | null>(null)
const statistics = ref<any>({})
const visitorHistory = ref<any[]>([])

// Search refs
const searchResults = ref<any[]>([])
const showSearchResults = ref(false)
const searchLoading = ref(false)
let searchTimeout: number | null = null

const visitForm = ref({
  visitor_id: null as number | null,
  inmate_id: null as number | null,
  relationship_id: null as number | null,
  visit_type_id: null as number | null,
  visit_purpose: '',
  entry_notes: ''
})

const exitForm = ref({
  exit_notes: '',
  visit_rating: null as number | null
})

let updateInterval: number | null = null
let exitModal: any = null

// Computed
const overdueVisitsCount = computed(() => {
  return activeVisits.value.filter(v => v.is_overdue).length
})

// Watch center filter - refetch when changed
watch(filterCenter, () => {
  refreshActiveVisits()
})

// Methods
const handleVisitorSearch = async () => {
  const searchTerm = visitorDpi.value.trim()

  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (searchTerm.length < 4) {
    searchResults.value = []
    showSearchResults.value = false
    return
  }

  searchTimeout = window.setTimeout(async () => {
    try {
      searchLoading.value = true
      showSearchResults.value = true

      const response = await ApiService.get('/visitors', {
        params: {
          search: searchTerm,
          per_page: 10
        }
      })

      const visitorData = response.data.visitors || response.data.data || response.data
      searchResults.value = Array.isArray(visitorData)
        ? visitorData
        : (Array.isArray(visitorData?.data) ? visitorData.data : [])
    } catch (error) {
      console.error('Error searching visitors:', error)
      searchResults.value = []
    } finally {
      searchLoading.value = false
    }
  }, 500)
}

const handleSearchBlur = () => {
  setTimeout(() => {
    showSearchResults.value = false
  }, 200)
}

const selectVisitor = async (visitor: any) => {
  visitorDpi.value = visitor.document_number
  searchResults.value = []
  showSearchResults.value = false
  await loadVisitorRelationships(visitor)
}

const loadVisitorRelationships = async (visitor: any) => {
  try {
    loading.value = true
    visitorSearched.value = true

    const response = await ApiService.get(`/visit-logs/search-visitor?dpi=${visitor.document_number}`)

    if (response.data.success) {
      selectedVisitor.value = response.data.data.visitor
      approvedRelationships.value = response.data.data.can_visit_today || []


      if (approvedRelationships.value.length === 0) {
        Swal.fire({
          title: 'Información',
          text: 'Este visitante no tiene internos autorizados para visitar hoy.',
          icon: 'info'
        })
      }
    }
  } catch (error: any) {
    console.error('Error loading visitor relationships:', error)
    selectedVisitor.value = null
    approvedRelationships.value = []

    if (error.response?.status === 404) {
      Swal.fire({
        title: 'Visitante No Encontrado',
        text: 'No se encontró un visitante con este DPI en el sistema. Por favor, registre al visitante primero.',
        icon: 'warning'
      })
    } else if (error.response?.status === 403) {
      Swal.fire({
        title: 'Acceso Denegado',
        text: error.response.data.message || 'Este visitante no puede ingresar.',
        icon: 'error'
      })
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Error al buscar el visitante. Por favor, intente de nuevo.',
        icon: 'error'
      })
    }
  } finally {
    loading.value = false
  }
}

const clearVisitor = () => {
  selectedVisitor.value = null
  approvedRelationships.value = []
  selectedRelationship.value = null
  visitorDpi.value = ''
  searchResults.value = []
  showSearchResults.value = false
  visitorSearched.value = false
  resetVisitForm()
}

const onRelationshipChange = () => {
  if (selectedRelationship.value) {
    visitForm.value.visitor_id = selectedVisitor.value.id
    visitForm.value.inmate_id = selectedRelationship.value.inmate_id
    visitForm.value.relationship_id = selectedRelationship.value.id
  }
}

const resetVisitForm = () => {
  visitForm.value = {
    visitor_id: null,
    inmate_id: null,
    relationship_id: null,
    visit_type_id: null,
    visit_purpose: '',
    entry_notes: ''
  }
}

const registerEntry = async () => {
  try {
    loading.value = true
    const response = await ApiService.post('/visit-logs/register-entry', visitForm.value)

    if (response.data.success) {
      Swal.fire({
        title: '¡Entrada Registrada!',
        text: 'La visita ha sido registrada exitosamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })

      // Refresh active visits
      await refreshActiveVisits()

      // Clear form
      clearVisitor()
    }
  } catch (error: any) {
    console.error('Error registering entry:', error)
    Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'Error al registrar la entrada.',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}

const refreshActiveVisits = async () => {
  try {
    const params: Record<string, any> = {}
    if (filterCenter.value) {
      params.center_id = filterCenter.value
    }
    const response = await ApiService.query('/visit-logs/active', params)

    if (response.data.success) {
      activeVisits.value = response.data.data.active_visits || []
    }
  } catch (error) {
    console.error('Error fetching active visits:', error)
  }
}

const showExitModal = (visit: any) => {
  visitToExit.value = visit
  exitForm.value = {
    exit_notes: '',
    visit_rating: null
  }

  if (exitModal) {
    exitModal.show()
  }
}

const registerExit = async () => {
  if (!visitToExit.value) return

  try {
    loading.value = true
    const response = await ApiService.post(
      `/visit-logs/${visitToExit.value.id}/register-exit`,
      exitForm.value
    )

    if (response.data.success) {
      if (exitModal) {
        exitModal.hide()
      }

      Swal.fire({
        title: '¡Salida Registrada!',
        text: 'La visita ha finalizado exitosamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })

      // Refresh active visits
      await refreshActiveVisits()
      await fetchStatistics()

      visitToExit.value = null
    }
  } catch (error: any) {
    console.error('Error registering exit:', error)
    Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'Error al registrar la salida.',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}

const fetchVisitTypes = async () => {
  try {
    const response = await ApiService.get('/catalogs/visit-types', {
      params: { simple: true } // Get simple list without pagination
    })


    const data = response.data.data || []
    visitTypes.value = Array.isArray(data) ? data.filter(t => t && t.id) : []
  } catch (error) {
    console.error('Error fetching visit types:', error)
    visitTypes.value = []
  }
}

const fetchStatistics = async () => {
  try {
    const response = await ApiService.get('/visit-logs/statistics')
    if (response.data.success) {
      statistics.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching statistics:', error)
  }
}

const fetchVisitorHistory = async (visitorId: number) => {
  try {
    loading.value = true
    const response = await ApiService.get('/visit-logs', {
      params: {
        visitor_id: visitorId,
        per_page: 50
      }
    })

    if (response.data.success) {
      visitorHistory.value = response.data.data.data || []
    }
  } catch (error: any) {
    console.error('Error fetching visitor history:', error)
    Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'Error al cargar el historial de visitas.',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}

const getVisitorPhotoUrl = (visitor: any) => {
  if (visitor?.front_photo_path) {
    return `${apiUrl}/storage/${visitor.front_photo_path}`
  }
  return '/media/avatars/blank.png'
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('es-GT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatTime = (datetime: string) => {
  if (!datetime) return 'N/A'
  const date = new Date(datetime)
  return date.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'pending': 'Pendiente',
    'approved': 'Aprobada',
    'rejected': 'Rechazada',
    'in_progress': 'En Curso',
    'completed': 'Completada',
    'cancelled': 'Cancelada',
    'no_show': 'No Asistió'
  }
  return labels[status] || status
}

const calculateElapsedTime = (entryTime: string) => {
  if (!entryTime) return '0 min'

  const entry = new Date(entryTime)
  const now = new Date()
  const diffMs = now.getTime() - entry.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  const hours = Math.floor(diffMins / 60)
  const mins = diffMins % 60

  if (hours > 0) {
    return `${hours}h ${mins}min`
  }
  return `${mins}min`
}

const formatDuration = (minutes: number | null | undefined) => {
  if (!minutes) return '0 min'

  const hours = Math.floor(minutes / 60)
  const mins = Math.floor(minutes % 60)

  if (hours > 0) {
    return `${hours}h ${mins}min`
  }
  return `${mins}min`
}

const updateElapsedTimes = () => {
  // Force re-render by updating a reactive property
  activeVisits.value = [...activeVisits.value]
}

// Lifecycle
onMounted(async () => {
  // Initialize Bootstrap modal
  const { Modal } = await import('bootstrap')
  if (exitModalRef.value) {
    exitModal = new Modal(exitModalRef.value)
  }

  // Check if we're viewing a specific visitor's history
  if (isVisitorHistoryMode.value && visitorIdFromQuery.value) {
    // Load visitor history mode
    await Promise.all([
      fetchVisitTypes(),
      fetchVisitorHistory(visitorIdFromQuery.value)
    ])
  } else {
    // Load normal visit control mode
    await Promise.all([
      loadCatalogs(['centers']),
      fetchVisitTypes(),
      refreshActiveVisits(),
      fetchStatistics()
    ])

    // Start auto-update for active visits
    updateInterval = window.setInterval(() => {
      updateElapsedTimes()
      refreshActiveVisits()
    }, 30000) // Update every 30 seconds
  }
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
  if (exitModal) {
    exitModal.dispose()
  }
})
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.hover-bg-light-primary:hover {
  background-color: #f1faff;
  transition: background-color 0.2s;
}

.rating .fa-star {
  font-size: 1.5rem;
  margin: 0 0.2rem;
}
</style>

<style>
/* Dark mode support for Multiselect in VisitMonitoring */
html[data-bs-theme="dark"] .multiselect {
  --ms-bg: #1e1e2d;
  --ms-border-color: #2b2b40;
  --ms-ring-color: rgba(62, 151, 255, 0.3);
  --ms-placeholder-color: #565674;
  --ms-spinner-color: #3e97ff;
  --ms-caret-color: #565674;
  --ms-clear-color: #565674;
  --ms-clear-color-hover: #f1416c;
  --ms-tag-bg: #212e48;
  --ms-tag-color: #3e97ff;
  --ms-tag-remove-bg: transparent;
  --ms-tag-remove-color: #3e97ff;
  --ms-tag-remove-color-hover: #f1416c;
  --ms-dropdown-bg: #1e1e2d;
  --ms-dropdown-border-color: #2b2b40;
  --ms-group-label-bg: #1b1b29;
  --ms-group-label-color: #92929f;
  --ms-option-bg-pointed: #212e48;
  --ms-option-color-pointed: #cdcdde;
  --ms-option-bg-selected: #212e48;
  --ms-option-color-selected: #3e97ff;
  --ms-option-bg-selected-pointed: #1b2838;
  --ms-option-color-selected-pointed: #3e97ff;
  --ms-empty-color: #565674;
  color: #cdcdde;
}

html[data-bs-theme="dark"] .multiselect-input {
  background-color: #1e1e2d;
  color: #cdcdde;
}

html[data-bs-theme="dark"] .multiselect-search input {
  background-color: transparent;
  color: #cdcdde;
}

html[data-bs-theme="dark"] .multiselect-single-label {
  color: #cdcdde;
}
</style>
