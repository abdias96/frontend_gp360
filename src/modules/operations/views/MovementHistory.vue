<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <h3>{{ $t('operations.movements.history.title') }}</h3>
        <p class="text-muted">{{ $t('operations.movements.history.subtitle') }}</p>
      </div>
      <div class="card-toolbar">
        <router-link
          :to="{ name: 'operations-movements' }"
          class="btn btn-light-primary btn-sm me-2"
        >
          <i class="fas fa-arrow-left me-2"></i>
          Volver
        </router-link>
        <button
          @click="exportHistory"
          class="btn btn-light-success btn-sm"
          :disabled="!movements.length"
        >
          <i class="fas fa-file-excel me-2"></i>
          Exportar
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- Filters -->
      <div class="row mb-6">
        <div class="col-md-3">
          <label for="hist-type" class="form-label">Tipo de Movimiento</label>
          <select id="hist-type" v-model="filters.movement_type" class="form-select">
            <option value="">Todos</option>
            <option value="medical">Médico</option>
            <option value="education">Educación</option>
            <option value="work">Trabajo</option>
            <option value="visit">Visita</option>
            <option value="court">Tribunal</option>
            <option value="administrative">Administrativo</option>
            <option value="religious">Religioso</option>
            <option value="sports">Deportes</option>
            <option value="emergency">Emergencia</option>
            <option value="transfer">Traslado</option>
          </select>
        </div>
        <div class="col-md-3">
          <label for="hist-status" class="form-label">Estado</label>
          <select id="hist-status" v-model="filters.status" class="form-select">
            <option value="">Todos</option>
            <option value="active">Activos</option>
            <option value="scheduled">Programados</option>
            <option value="in_transit">En Tránsito</option>
            <option value="at_destination">En Destino</option>
            <option value="returning">Regresando</option>
            <option value="completed">Completados</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
        <div class="col-md-3">
          <label for="hist-date" class="form-label">Fecha</label>
          <input
            id="hist-date"
            type="date"
            v-model="filters.date"
            class="form-control"
          >
        </div>
        <div class="col-md-3">
          <label class="form-label">&nbsp;</label>
          <button
            @click="clearFilters"
            class="btn btn-light-primary w-100"
          >
            <i class="fas fa-redo me-2"></i>
            Limpiar Filtros
          </button>
        </div>
      </div>

      <div class="row mb-6">
        <div class="col-md-6">
          <InmateSearchField
            v-model="selectedInmate"
            label="Historial por PPL (opcional)"
          />
        </div>
      </div>

      <!-- Statistics -->
      <div class="row mb-6">
        <div class="col-md-3">
          <div class="card bg-light-primary">
            <div class="card-body p-5">
              <div class="d-flex align-items-center">
                <i class="fas fa-exchange-alt fa-2x text-primary me-3"></i>
                <div>
                  <div class="fs-4 fw-bold">{{ statistics.total }}</div>
                  <div class="fs-7 text-muted">Total Movimientos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-info">
            <div class="card-body p-5">
              <div class="d-flex align-items-center">
                <i class="fas fa-truck fa-2x text-info me-3"></i>
                <div>
                  <div class="fs-4 fw-bold">{{ statistics.active }}</div>
                  <div class="fs-7 text-muted">Activos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-success">
            <div class="card-body p-5">
              <div class="d-flex align-items-center">
                <i class="fas fa-check-circle fa-2x text-success me-3"></i>
                <div>
                  <div class="fs-4 fw-bold">{{ statistics.completed }}</div>
                  <div class="fs-7 text-muted">Completados</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-danger">
            <div class="card-body p-5">
              <div class="d-flex align-items-center">
                <i class="fas fa-times-circle fa-2x text-danger me-3"></i>
                <div>
                  <div class="fs-4 fw-bold">{{ statistics.cancelled }}</div>
                  <div class="fs-7 text-muted">Cancelados</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-10">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <!-- Movement History Table -->
      <div v-else class="table-responsive">
        <table class="table table-rounded table-striped border gy-7 gs-7">
          <thead>
            <tr class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              <th>ID</th>
              <th>PPL</th>
              <th>Tipo</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Salida</th>
              <th>Retorno</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movement in movements" :key="movement.id">
              <td class="fw-bold">#{{ movement.id }}</td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold">{{ inmateName(movement) }}</span>
                  <span class="text-muted fs-7">{{ inmateDocument(movement) }}</span>
                </div>
              </td>
              <td>
                <span class="badge" :class="getMovementTypeBadgeClass(movement.movement_type)">
                  {{ formatMovementType(movement.movement_type) }}
                </span>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800">{{ movement.from_location || '-' }}</span>
                  <span v-if="movement.from_sector" class="text-muted fs-7">{{ movement.from_sector.name }}</span>
                </div>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800">{{ movement.to_location || '-' }}</span>
                  <span v-if="movement.to_sector" class="text-muted fs-7">{{ movement.to_sector.name }}</span>
                </div>
              </td>
              <td>{{ formatDateTime(movement.departure_time) || '-' }}</td>
              <td>{{ formatDateTime(movement.actual_return_time) || formatDateTime(movement.expected_return_time) || '-' }}</td>
              <td>
                <span class="badge" :class="getStatusBadgeClass(movement.status)">
                  {{ formatStatus(movement.status) }}
                </span>
              </td>
              <td>
                <button
                  @click="viewDetails(movement)"
                  class="btn btn-light btn-sm"
                  title="Ver detalles"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
            <tr v-if="!movements.length">
              <td colspan="9" class="text-center text-muted py-10">
                No se encontraron movimientos con los criterios seleccionados.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="d-flex justify-content-between align-items-center mt-6">
        <div class="text-muted">
          Mostrando {{ pagination.from || 0 }} - {{ pagination.to || 0 }} de {{ pagination.total }} registros
        </div>
        <nav>
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: !pagination.prev_page_url }">
              <button class="page-link" @click="loadPage(pagination.current_page - 1)">
                Anterior
              </button>
            </li>
            <li
              v-for="page in visiblePages"
              :key="page"
              class="page-item"
              :class="{ active: page === pagination.current_page }"
            >
              <button class="page-link" @click="loadPage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: !pagination.next_page_url }">
              <button class="page-link" @click="loadPage(pagination.current_page + 1)">
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'
import { movementsApi } from '@/services/api/operations'
import InmateSearchField from '../components/InmateSearchField.vue'

const { t } = useI18n()
const router = useRouter()

// Data
const loading = ref(false)
const movements = ref<any[]>([])
const selectedInmate = ref<any>(null)

const filters = reactive({
  movement_type: '',
  status: '',
  date: ''
})

const statistics = ref({
  total: 0,
  active: 0,
  completed: 0,
  cancelled: 0
})

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 20,
  total: 0,
  from: 0,
  to: 0,
  prev_page_url: null,
  next_page_url: null
})

// Computed
const visiblePages = computed(() => {
  const pages = []
  const current = pagination.value.current_page
  const last = pagination.value.last_page

  let start = Math.max(1, current - 2)
  let end = Math.min(last, current + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
// Se omiten filtros vacíos: Laravel interpreta el parámetro presente aunque sea ''
const cleanParams = (obj: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) =>
      value !== '' && value !== null && value !== undefined && value !== false
    )
  )
}

const setPagination = (paginator: any) => {
  pagination.value = {
    current_page: paginator.current_page,
    last_page: paginator.last_page,
    per_page: paginator.per_page,
    total: paginator.total,
    from: paginator.from,
    to: paginator.to,
    prev_page_url: paginator.prev_page_url,
    next_page_url: paginator.next_page_url
  }
}

const countByStatus = (items: any[], statuses: string[]) => {
  return items.filter((m) => statuses.includes(m.status)).length
}

const loadMovementHistory = async (page = 1) => {
  loading.value = true
  try {
    if (selectedInmate.value) {
      // Historial específico del PPL seleccionado
      const response = await movementsApi.getInmateHistory(selectedInmate.value.id, { page })
      const payload = response.data?.data ?? response.data
      const paginator = payload.movements
      movements.value = paginator.data || []
      setPagination(paginator)
      statistics.value = {
        total: payload.statistics?.total_movements ?? paginator.total,
        active: countByStatus(movements.value, ['scheduled', 'in_transit', 'at_destination', 'returning']),
        completed: countByStatus(movements.value, ['completed']),
        cancelled: countByStatus(movements.value, ['cancelled'])
      }
    } else {
      // Listado general con filtros del backend
      const response = await movementsApi.getList(cleanParams({ page, ...filters }))
      const payload = response.data?.data ?? response.data
      const paginator = payload.movements
      movements.value = paginator.data || []
      setPagination(paginator)
      const summary = payload.summary || {}
      statistics.value = {
        total: paginator.total ?? summary.total ?? 0,
        active: summary.active ?? 0,
        completed: summary.completed ?? 0,
        cancelled: summary.cancelled ?? 0
      }
    }
  } catch (error) {
    console.error('Error loading movement history:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar el historial de movimientos'
    })
  } finally {
    loading.value = false
  }
}

const loadPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    loadMovementHistory(page)
  }
}

const clearFilters = () => {
  filters.movement_type = ''
  filters.status = ''
  filters.date = ''
  selectedInmate.value = null
}

const viewDetails = (movement: any) => {
  router.push({
    name: 'operations-movements-detail',
    params: { id: movement.id }
  })
}

const exportHistory = () => {
  try {
    const headers = [
      'ID',
      'PPL',
      'Documento',
      'Tipo',
      'Origen',
      'Destino',
      'Salida',
      'Retorno Esperado',
      'Retorno Real',
      'Estado',
      'Motivo'
    ]

    const escapeCsv = (value: any) => {
      const text = value === null || value === undefined ? '' : String(value)
      return `"${text.replace(/"/g, '""')}"`
    }

    const rows = movements.value.map((m) => [
      m.id,
      inmateName(m),
      inmateDocument(m),
      formatMovementType(m.movement_type),
      m.from_location || '',
      m.to_location || '',
      formatDateTime(m.departure_time) || '',
      formatDateTime(m.expected_return_time) || '',
      formatDateTime(m.actual_return_time) || '',
      formatStatus(m.status),
      m.reason || ''
    ].map(escapeCsv).join(','))

    // BOM UTF-8 para que Excel reconozca acentos
    const csv = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const today = new Date().toISOString().slice(0, 10)
    link.href = url
    link.download = `historial_movimientos_${today}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting history:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo exportar el historial'
    })
  }
}

// Helpers
const inmateName = (movement: any) => {
  return movement.inmate?.full_name || selectedInmate.value?.full_name || '-'
}

const inmateDocument = (movement: any) => {
  return movement.inmate?.document_number || selectedInmate.value?.document_number || ''
}

// Formatting methods
const formatMovementType = (type: string) => {
  const types: Record<string, string> = {
    medical: 'Médico',
    education: 'Educación',
    work: 'Trabajo',
    visit: 'Visita',
    court: 'Tribunal',
    administrative: 'Administrativo',
    religious: 'Religioso',
    sports: 'Deportes',
    emergency: 'Emergencia',
    transfer: 'Traslado'
  }
  return types[type] || type
}

const formatStatus = (status: string) => {
  const statuses: Record<string, string> = {
    scheduled: 'Programado',
    in_transit: 'En Tránsito',
    at_destination: 'En Destino',
    returning: 'Regresando',
    completed: 'Completado',
    cancelled: 'Cancelado'
  }
  return statuses[status] || status
}

const formatDateTime = (datetime: string) => {
  if (!datetime) return null
  const date = new Date(datetime)
  return `${date.toLocaleDateString('es-GT')} ${date.toLocaleTimeString('es-GT', {
    hour: '2-digit',
    minute: '2-digit'
  })}`
}

const getMovementTypeBadgeClass = (type: string) => {
  const classes: Record<string, string> = {
    medical: 'badge-light-success',
    education: 'badge-light-info',
    work: 'badge-light-warning',
    visit: 'badge-light-primary',
    court: 'badge-light-dark',
    administrative: 'badge-light-secondary',
    religious: 'badge-light-primary',
    sports: 'badge-light-success',
    emergency: 'badge-light-danger',
    transfer: 'badge-light-info'
  }
  return classes[type] || 'badge-light-secondary'
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    scheduled: 'badge-light-secondary',
    in_transit: 'badge-light-primary',
    at_destination: 'badge-light-warning',
    returning: 'badge-light-info',
    completed: 'badge-light-success',
    cancelled: 'badge-light-danger'
  }
  return classes[status] || 'badge-light-secondary'
}

// Watchers
watch(filters, () => {
  loadMovementHistory(1)
}, { deep: true })

watch(selectedInmate, () => {
  loadMovementHistory(1)
})

// Lifecycle
onMounted(() => {
  loadMovementHistory()
})
</script>
