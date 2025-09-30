<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <h3>{{ $t('operations.reports.title') }}</h3>
        <p class="text-muted">{{ $t('operations.reports.subtitle') }}</p>
      </div>
    </div>

    <div class="card-body">
      <!-- Report Type Selection -->
      <div class="row mb-8">
        <div class="col-12">
          <h5 class="mb-4">Seleccionar Tipo de Reporte</h5>
          <div class="row">
            <div 
              v-for="report in reportTypes" 
              :key="report.id"
              class="col-md-4 mb-4"
            >
              <div 
                class="card border-2 cursor-pointer h-100"
                :class="{ 
                  'border-primary': selectedReport?.id === report.id,
                  'border-gray-300': selectedReport?.id !== report.id
                }"
                @click="selectReport(report)"
              >
                <div class="card-body">
                  <div class="d-flex align-items-center mb-3">
                    <div class="symbol symbol-50px me-3">
                      <span class="symbol-label bg-light-primary">
                        <i :class="report.icon" class="fa-2x text-primary"></i>
                      </span>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-1">{{ report.name }}</h6>
                      <span class="text-muted fs-7">{{ report.description }}</span>
                    </div>
                  </div>
                  <div class="d-flex flex-wrap">
                    <span 
                      v-for="format in report.formats" 
                      :key="format"
                      class="badge badge-light-primary me-1 mb-1"
                    >
                      {{ format.toUpperCase() }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Parameters -->
      <div v-if="selectedReport" class="separator my-8"></div>
      <div v-if="selectedReport" class="row mb-8">
        <div class="col-12">
          <h5 class="mb-4">Parámetros del Reporte</h5>
          
          <!-- Date Range -->
          <div class="row mb-6">
            <div class="col-md-4">
              <label class="form-label required">Período</label>
              <select v-model="parameters.period" class="form-select">
                <option value="custom">Personalizado</option>
                <option value="today">Hoy</option>
                <option value="yesterday">Ayer</option>
                <option value="this_week">Esta Semana</option>
                <option value="last_week">Semana Pasada</option>
                <option value="this_month">Este Mes</option>
                <option value="last_month">Mes Pasado</option>
                <option value="this_quarter">Este Trimestre</option>
                <option value="this_year">Este Año</option>
              </select>
            </div>
            <div v-if="parameters.period === 'custom'" class="col-md-4">
              <label class="form-label required">Fecha Desde</label>
              <input 
                type="date" 
                v-model="parameters.date_from"
                class="form-control"
              >
            </div>
            <div v-if="parameters.period === 'custom'" class="col-md-4">
              <label class="form-label required">Fecha Hasta</label>
              <input 
                type="date" 
                v-model="parameters.date_to"
                class="form-control"
              >
            </div>
          </div>

          <!-- Additional Filters -->
          <div class="row mb-6">
            <div class="col-md-4">
              <label class="form-label">Centro</label>
              <select v-model="parameters.center_id" class="form-select">
                <option value="">Todos los centros</option>
                <option v-for="center in centers" :key="center.id" :value="center.id">
                  {{ center.name }}
                </option>
              </select>
            </div>
            <div v-if="selectedReport.filters?.includes('sector')" class="col-md-4">
              <label class="form-label">Sector</label>
              <select 
                v-model="parameters.sector_id" 
                class="form-select"
                :disabled="!parameters.center_id"
              >
                <option value="">Todos los sectores</option>
                <option v-for="sector in sectors" :key="sector.id" :value="sector.id">
                  {{ sector.name }}
                </option>
              </select>
            </div>
            <div v-if="selectedReport.filters?.includes('status')" class="col-md-4">
              <label class="form-label">Estado</label>
              <select v-model="parameters.status" class="form-select">
                <option value="">Todos</option>
                <option value="active">Activo</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>

          <!-- Format Selection -->
          <div class="row mb-6">
            <div class="col-md-4">
              <label class="form-label required">Formato de Salida</label>
              <select v-model="parameters.format" class="form-select">
                <option 
                  v-for="format in selectedReport.formats" 
                  :key="format"
                  :value="format"
                >
                  {{ getFormatLabel(format) }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Incluir Gráficos</label>
              <select v-model="parameters.include_charts" class="form-select">
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Nivel de Detalle</label>
              <select v-model="parameters.detail_level" class="form-select">
                <option value="summary">Resumen</option>
                <option value="detailed">Detallado</option>
                <option value="complete">Completo</option>
              </select>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="d-flex justify-content-end">
            <button 
              @click="previewReport"
              class="btn btn-light-primary me-2"
              :disabled="!isFormValid"
            >
              <i class="fas fa-eye me-2"></i>
              Vista Previa
            </button>
            <button 
              @click="generateReport"
              class="btn btn-primary"
              :disabled="!isFormValid"
            >
              <i class="fas fa-download me-2"></i>
              Generar Reporte
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Reports -->
      <div class="separator my-8"></div>
      <div class="row">
        <div class="col-12">
          <h5 class="mb-4">Reportes Recientes</h5>
          <div class="table-responsive">
            <table class="table table-rounded table-striped border gy-7 gs-7">
              <thead>
                <tr class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200">
                  <th>Reporte</th>
                  <th>Período</th>
                  <th>Formato</th>
                  <th>Generado</th>
                  <th>Usuario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="report in recentReports" :key="report.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <i :class="getReportIcon(report.type)" class="fa-lg me-3"></i>
                      <span class="fw-bold">{{ report.name }}</span>
                    </div>
                  </td>
                  <td>{{ report.period }}</td>
                  <td>
                    <span class="badge badge-light-primary">
                      {{ report.format.toUpperCase() }}
                    </span>
                  </td>
                  <td>{{ formatDateTime(report.generated_at) }}</td>
                  <td>{{ report.generated_by }}</td>
                  <td>
                    <div class="btn-group">
                      <button 
                        @click="downloadReport(report)"
                        class="btn btn-light btn-sm"
                        title="Descargar"
                      >
                        <i class="fas fa-download"></i>
                      </button>
                      <button 
                        @click="viewReport(report)"
                        class="btn btn-light btn-sm"
                        title="Ver"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        @click="shareReport(report)"
                        class="btn btn-light btn-sm"
                        title="Compartir"
                      >
                        <i class="fas fa-share"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

const { t } = useI18n()

// Data
const selectedReport = ref<any>(null)
const centers = ref<any[]>([])
const sectors = ref<any[]>([])

const parameters = reactive({
  period: 'this_month',
  date_from: '',
  date_to: '',
  center_id: '',
  sector_id: '',
  status: '',
  format: 'pdf',
  include_charts: 'true',
  detail_level: 'detailed'
})

const reportTypes = ref([
  {
    id: 'population_summary',
    name: 'Resumen Poblacional',
    description: 'Estado actual de la población penitenciaria',
    icon: 'fas fa-users',
    formats: ['pdf', 'excel', 'csv'],
    filters: ['sector']
  },
  {
    id: 'admissions_report',
    name: 'Reporte de Admisiones',
    description: 'Detalle de admisiones por período',
    icon: 'fas fa-sign-in-alt',
    formats: ['pdf', 'excel'],
    filters: ['status']
  },
  {
    id: 'releases_report',
    name: 'Reporte de Liberaciones',
    description: 'Liberaciones procesadas y programadas',
    icon: 'fas fa-sign-out-alt',
    formats: ['pdf', 'excel'],
    filters: ['status']
  },
  {
    id: 'movements_report',
    name: 'Reporte de Movimientos',
    description: 'Traslados y movimientos internos',
    icon: 'fas fa-exchange-alt',
    formats: ['pdf', 'excel', 'csv'],
    filters: ['status']
  },
  {
    id: 'daily_count_report',
    name: 'Reporte de Conteos',
    description: 'Resultados de conteos diarios',
    icon: 'fas fa-clipboard-check',
    formats: ['pdf', 'excel'],
    filters: []
  },
  {
    id: 'occupancy_report',
    name: 'Reporte de Ocupación',
    description: 'Análisis de ocupación por centro',
    icon: 'fas fa-chart-pie',
    formats: ['pdf', 'excel'],
    filters: ['sector']
  }
])

const recentReports = ref([
  {
    id: 1,
    type: 'population_summary',
    name: 'Resumen Poblacional - Enero 2024',
    period: 'Enero 2024',
    format: 'pdf',
    generated_at: '2024-01-15 10:30:00',
    generated_by: 'María López'
  },
  {
    id: 2,
    type: 'admissions_report',
    name: 'Admisiones - Semana 2',
    period: '08-14 Enero 2024',
    format: 'excel',
    generated_at: '2024-01-14 16:45:00',
    generated_by: 'Juan Martínez'
  },
  {
    id: 3,
    type: 'daily_count_report',
    name: 'Conteo Diario - 13/01/2024',
    period: '13 Enero 2024',
    format: 'pdf',
    generated_at: '2024-01-13 07:15:00',
    generated_by: 'Carlos Rodríguez'
  }
])

// Computed
const isFormValid = computed(() => {
  if (!selectedReport.value) return false
  if (parameters.period === 'custom' && (!parameters.date_from || !parameters.date_to)) return false
  return true
})

// Methods
const selectReport = (report: any) => {
  selectedReport.value = report
  parameters.format = report.formats[0]
}

const loadCenters = async () => {
  try {
    // TODO: Implement API call
    centers.value = [
      { id: 1, name: 'Centro Preventivo Zona 18' },
      { id: 2, name: 'Granja Penal Canadá' },
      { id: 3, name: 'Centro de Detención Preventiva para Mujeres' }
    ]
  } catch (error) {
    console.error('Error loading centers:', error)
  }
}

const loadSectors = async (centerId: string) => {
  try {
    // TODO: Implement API call
    sectors.value = [
      { id: 1, name: 'Sector A' },
      { id: 2, name: 'Sector B' },
      { id: 3, name: 'Sector C' }
    ]
  } catch (error) {
    console.error('Error loading sectors:', error)
  }
}

const previewReport = async () => {
  try {
    await Swal.fire({
      title: 'Generando Vista Previa',
      text: 'Por favor espere...',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
      }
    })
    
    // TODO: Open preview in modal or new window
    await Swal.fire({
      icon: 'info',
      title: 'Vista Previa',
      text: 'La vista previa se abrirá en una nueva ventana'
    })
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo generar la vista previa'
    })
  }
}

const generateReport = async () => {
  const result = await Swal.fire({
    title: 'Generar Reporte',
    text: '¿Desea generar el reporte con los parámetros seleccionados?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, generar',
    cancelButtonText: 'Cancelar'
  })
  
  if (result.isConfirmed) {
    try {
      await Swal.fire({
        title: 'Generando Reporte',
        text: 'Por favor espere...',
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
        }
      })
      
      await Swal.fire({
        icon: 'success',
        title: 'Reporte Generado',
        text: 'El reporte ha sido generado y descargado exitosamente'
      })
      
      // Reload recent reports
      // TODO: Implement reload
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo generar el reporte'
      })
    }
  }
}

const downloadReport = async (report: any) => {
  try {
    // TODO: Implement download
    await Swal.fire({
      icon: 'success',
      title: 'Descargando',
      text: 'El reporte se está descargando...'
    })
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo descargar el reporte'
    })
  }
}

const viewReport = async (report: any) => {
  // TODO: Implement view
  window.open(`/reports/${report.id}`, '_blank')
}

const shareReport = async (report: any) => {
  const { value: email } = await Swal.fire({
    title: 'Compartir Reporte',
    input: 'email',
    inputLabel: 'Correo electrónico del destinatario',
    inputPlaceholder: 'correo@ejemplo.com',
    showCancelButton: true,
    confirmButtonText: 'Enviar',
    cancelButtonText: 'Cancelar'
  })
  
  if (email) {
    await Swal.fire({
      icon: 'success',
      title: 'Reporte Compartido',
      text: `El reporte ha sido enviado a ${email}`
    })
  }
}

// Formatting methods
const getFormatLabel = (format: string) => {
  const labels: Record<string, string> = {
    'pdf': 'PDF - Documento Portable',
    'excel': 'Excel - Hoja de Cálculo',
    'csv': 'CSV - Valores Separados'
  }
  return labels[format] || format.toUpperCase()
}

const getReportIcon = (type: string) => {
  const report = reportTypes.value.find(r => r.id === type)
  return report?.icon || 'fas fa-file'
}

const formatDateTime = (datetime: string) => {
  return new Date(datetime).toLocaleString('es-GT')
}

// Watchers
watch(() => parameters.center_id, (newValue) => {
  if (newValue) {
    loadSectors(newValue)
  } else {
    sectors.value = []
    parameters.sector_id = ''
  }
})

// Lifecycle
onMounted(() => {
  loadCenters()
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>