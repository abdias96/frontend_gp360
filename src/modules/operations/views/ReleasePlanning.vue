<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <h3>{{ $t('operations.releases.planning.title') }}</h3>
        <p class="text-muted">{{ $t('operations.releases.planning.subtitle') }}</p>
      </div>
      <div class="card-toolbar">
        <router-link 
          :to="{ name: 'operations-releases' }"
          class="btn btn-light-primary btn-sm me-2"
        >
          <i class="fas fa-arrow-left me-2"></i>
          Volver
        </router-link>
        <button 
          @click="generateReport"
          class="btn btn-light-success btn-sm"
        >
          <i class="fas fa-file-excel me-2"></i>
          Generar Reporte
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- Planning Period -->
      <div class="row mb-6">
        <div class="col-md-4">
          <label class="form-label">Período de Planificación</label>
          <select v-model="planningPeriod" class="form-select">
            <option value="week">Esta Semana</option>
            <option value="month">Este Mes</option>
            <option value="quarter">Este Trimestre</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>
        <div v-if="planningPeriod === 'custom'" class="col-md-4">
          <label class="form-label">Fecha Desde</label>
          <input type="date" v-model="customDateFrom" class="form-control">
        </div>
        <div v-if="planningPeriod === 'custom'" class="col-md-4">
          <label class="form-label">Fecha Hasta</label>
          <input type="date" v-model="customDateTo" class="form-control">
        </div>
      </div>

      <!-- Summary Statistics -->
      <div class="row mb-6">
        <div class="col-md-12">
          <div class="card bg-light-primary">
            <div class="card-body">
              <h5 class="mb-4">Resumen del Período</h5>
              <div class="row">
                <div class="col-md-3 text-center border-end">
                  <div class="fs-2 fw-bold text-primary">{{ summary.total }}</div>
                  <div class="text-muted">Total Liberaciones</div>
                </div>
                <div class="col-md-3 text-center border-end">
                  <div class="fs-2 fw-bold text-success">{{ summary.sentence_completion }}</div>
                  <div class="text-muted">Por Cumplimiento</div>
                </div>
                <div class="col-md-3 text-center border-end">
                  <div class="fs-2 fw-bold text-warning">{{ summary.parole }}</div>
                  <div class="text-muted">Condicionales</div>
                </div>
                <div class="col-md-3 text-center">
                  <div class="fs-2 fw-bold text-info">{{ summary.other }}</div>
                  <div class="text-muted">Otros Tipos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar View -->
      <div class="mb-6">
        <h5 class="mb-4">Vista de Calendario</h5>
        <div class="calendar-container">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th class="text-center">Domingo</th>
                <th class="text-center">Lunes</th>
                <th class="text-center">Martes</th>
                <th class="text-center">Miércoles</th>
                <th class="text-center">Jueves</th>
                <th class="text-center">Viernes</th>
                <th class="text-center">Sábado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="week in calendarWeeks" :key="week[0].date">
                <td 
                  v-for="day in week" 
                  :key="day.date"
                  class="calendar-day"
                  :class="{ 
                    'bg-light': !day.isCurrentMonth,
                    'bg-light-warning': day.releases > 0
                  }"
                >
                  <div class="p-3">
                    <div class="fw-bold mb-2">{{ day.day }}</div>
                    <div v-if="day.releases > 0" class="text-center">
                      <span class="badge badge-warning">{{ day.releases }} liberaciones</span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Detailed List -->
      <h5 class="mb-4">Lista Detallada de Liberaciones Programadas</h5>
      <div class="table-responsive">
        <table class="table table-rounded table-striped border gy-7 gs-7">
          <thead>
            <tr class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              <th>Fecha</th>
              <th>PPL</th>
              <th>Centro</th>
              <th>Tipo de Liberación</th>
              <th>Documentos</th>
              <th>Alertas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="plan in releasePlans" :key="plan.id">
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold">{{ formatDate(plan.release_date) }}</span>
                  <span class="text-muted fs-7">{{ getDayOfWeek(plan.release_date) }}</span>
                </div>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold">{{ plan.inmate.full_name }}</span>
                  <span class="text-muted fs-7">{{ plan.inmate.document_number }}</span>
                </div>
              </td>
              <td>{{ plan.center.name }}</td>
              <td>
                <span class="badge" :class="getReleaseTypeBadgeClass(plan.release_type)">
                  {{ formatReleaseType(plan.release_type) }}
                </span>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="progress flex-grow-1" style="height: 8px;">
                    <div 
                      class="progress-bar"
                      :class="getDocumentProgressClass(plan.document_completion)"
                      :style="`width: ${plan.document_completion}%`"
                    ></div>
                  </div>
                  <span class="ms-2 fs-7">{{ plan.document_completion }}%</span>
                </div>
              </td>
              <td>
                <div v-if="plan.alerts.length > 0">
                  <span 
                    v-for="alert in plan.alerts" 
                    :key="alert"
                    class="badge badge-light-danger me-1"
                  >
                    {{ alert }}
                  </span>
                </div>
                <span v-else class="text-muted">-</span>
              </td>
              <td>
                <div class="btn-group">
                  <button 
                    @click="viewPlanDetails(plan)"
                    class="btn btn-light btn-sm"
                    title="Ver detalles"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    @click="editPlan(plan)"
                    class="btn btn-light btn-sm"
                    title="Editar"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Requirements Checklist -->
      <div class="mt-8">
        <h5 class="mb-4">Lista de Verificación de Requisitos</h5>
        <div class="row">
          <div class="col-md-6">
            <div class="card bg-light">
              <div class="card-body">
                <h6 class="mb-3">Documentos Requeridos</h6>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" disabled checked>
                  <label class="form-check-label">
                    Orden de liberación judicial
                  </label>
                </div>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" disabled checked>
                  <label class="form-check-label">
                    Certificado de conducta
                  </label>
                </div>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" disabled>
                  <label class="form-check-label">
                    Constancia de no deudas
                  </label>
                </div>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" disabled>
                  <label class="form-check-label">
                    Evaluación psicológica final
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card bg-light">
              <div class="card-body">
                <h6 class="mb-3">Procesos Pendientes</h6>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" disabled checked>
                  <label class="form-check-label">
                    Notificación a familiares
                  </label>
                </div>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" disabled>
                  <label class="form-check-label">
                    Coordinación con transporte
                  </label>
                </div>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" disabled>
                  <label class="form-check-label">
                    Devolución de pertenencias
                  </label>
                </div>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" disabled>
                  <label class="form-check-label">
                    Cierre de expediente
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

const { t } = useI18n()
const router = useRouter()

// Data
const planningPeriod = ref('month')
const customDateFrom = ref('')
const customDateTo = ref('')
const releasePlans = ref<any[]>([])
const calendarWeeks = ref<any[]>([])

const summary = ref({
  total: 0,
  sentence_completion: 0,
  parole: 0,
  other: 0
})

// Methods
const loadReleasePlans = async () => {
  try {
    // TODO: Implement API call
    // Mock data for now
    releasePlans.value = [
      {
        id: 1,
        release_date: '2024-01-20',
        inmate: {
          full_name: 'Juan Pérez García',
          document_number: '1234567890101'
        },
        center: { name: 'Centro Preventivo Zona 18' },
        release_type: 'sentence_completion',
        document_completion: 75,
        alerts: ['Falta evaluación psicológica']
      },
      {
        id: 2,
        release_date: '2024-01-22',
        inmate: {
          full_name: 'María González',
          document_number: '9876543210101'
        },
        center: { name: 'Centro de Mujeres' },
        release_type: 'parole',
        document_completion: 100,
        alerts: []
      },
      {
        id: 3,
        release_date: '2024-01-25',
        inmate: {
          full_name: 'Carlos López',
          document_number: '5555555555555'
        },
        center: { name: 'Granja Penal Canadá' },
        release_type: 'court_order',
        document_completion: 50,
        alerts: ['Documentos incompletos', 'Pendiente notificación']
      }
    ]
    
    summary.value = {
      total: 15,
      sentence_completion: 8,
      parole: 5,
      other: 2
    }
    
    // Generate calendar data
    generateCalendarData()
  } catch (error) {
    console.error('Error loading release plans:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los planes de liberación'
    })
  }
}

const generateCalendarData = () => {
  // Mock calendar data generation
  const weeks = []
  const currentDate = new Date()
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  
  // Generate weeks
  let currentWeek = []
  for (let day = 1; day <= endOfMonth.getDate(); day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dayOfWeek = date.getDay()
    
    currentWeek[dayOfWeek] = {
      date: date.toISOString().split('T')[0],
      day: day,
      isCurrentMonth: true,
      releases: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0
    }
    
    if (dayOfWeek === 6 || day === endOfMonth.getDate()) {
      // Fill empty days
      for (let i = 0; i < 7; i++) {
        if (!currentWeek[i]) {
          currentWeek[i] = {
            date: '',
            day: '',
            isCurrentMonth: false,
            releases: 0
          }
        }
      }
      weeks.push([...currentWeek])
      currentWeek = []
    }
  }
  
  calendarWeeks.value = weeks
}

const viewPlanDetails = (plan: any) => {
  router.push({ 
    name: 'operations-release-plan-detail', 
    params: { id: plan.id } 
  })
}

const editPlan = async (plan: any) => {
  // TODO: Implement edit functionality
  await Swal.fire({
    icon: 'info',
    title: 'Editar Plan',
    text: 'Funcionalidad en desarrollo'
  })
}

const generateReport = async () => {
  try {
    // TODO: Implement report generation
    await Swal.fire({
      icon: 'success',
      title: 'Generando Reporte',
      text: 'El reporte se está generando y será descargado automáticamente'
    })
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo generar el reporte'
    })
  }
}

// Formatting methods
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getDayOfWeek = (date: string) => {
  return new Date(date).toLocaleDateString('es-GT', {
    weekday: 'long'
  })
}

const formatReleaseType = (type: string) => {
  const types: Record<string, string> = {
    'sentence_completion': 'Cumplimiento',
    'parole': 'Condicional',
    'bail': 'Fianza',
    'court_order': 'Orden Judicial',
    'amnesty': 'Amnistía',
    'transfer': 'Traslado'
  }
  return types[type] || type
}

const getReleaseTypeBadgeClass = (type: string) => {
  const classes: Record<string, string> = {
    'sentence_completion': 'badge-light-success',
    'parole': 'badge-light-warning',
    'bail': 'badge-light-info',
    'court_order': 'badge-light-primary',
    'amnesty': 'badge-light-secondary',
    'transfer': 'badge-light-dark'
  }
  return classes[type] || 'badge-light-secondary'
}

const getDocumentProgressClass = (percentage: number) => {
  if (percentage >= 80) return 'bg-success'
  if (percentage >= 50) return 'bg-warning'
  return 'bg-danger'
}

// Lifecycle
onMounted(() => {
  loadReleasePlans()
})
</script>

<style scoped>
.calendar-day {
  height: 100px;
  vertical-align: top;
}

.calendar-container {
  overflow-x: auto;
}
</style>