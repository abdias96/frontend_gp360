<template>
  <div>
    <!-- begin::page-header -->
    <div class="row gy-5 g-xl-10 mb-5 mb-xl-10">
      <div class="col-md-12">
        <div class="d-flex flex-column flex-md-row align-items-center justify-content-between">
          <h1 class="fs-2x fw-bold text-gray-900 mb-4 mb-md-0">
            {{ $t('visits.visitReports.title') }}
          </h1>
          <button class="btn btn-primary" @click="handleGenerateReport">
            <i class="fas fa-file-pdf"></i>
            {{ $t('visits.visitReports.generateReport') }}
          </button>
        </div>
      </div>
    </div>
    <!-- end::page-header -->

    <!-- begin::report types -->
    <div class="row g-5 mb-5">
      <div class="col-xl-3">
        <div class="card card-hover-shadow cursor-pointer" @click="selectReportType('daily')">
          <div class="card-body text-center">
            <div class="symbol symbol-50px mx-auto mb-5">
              <span class="symbol-label bg-light-primary">
                <i class="fas fa-calendar-day fs-2x text-primary"></i>
              </span>
            </div>
            <h5 class="text-gray-900 mb-2">{{ $t('visits.visitReports.dailyReport') }}</h5>
            <p class="text-muted mb-0">{{ $t('visits.visitReports.dailyReportDesc') }}</p>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card card-hover-shadow cursor-pointer" @click="selectReportType('weekly')">
          <div class="card-body text-center">
            <div class="symbol symbol-50px mx-auto mb-5">
              <span class="symbol-label bg-light-success">
                <i class="fas fa-calendar-week fs-2x text-success"></i>
              </span>
            </div>
            <h5 class="text-gray-900 mb-2">{{ $t('visits.visitReports.weeklyReport') }}</h5>
            <p class="text-muted mb-0">{{ $t('visits.visitReports.weeklyReportDesc') }}</p>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card card-hover-shadow cursor-pointer" @click="selectReportType('monthly')">
          <div class="card-body text-center">
            <div class="symbol symbol-50px mx-auto mb-5">
              <span class="symbol-label bg-light-warning">
                <i class="fas fa-calendar-alt fs-2x text-warning"></i>
              </span>
            </div>
            <h5 class="text-gray-900 mb-2">{{ $t('visits.visitReports.monthlyReport') }}</h5>
            <p class="text-muted mb-0">{{ $t('visits.visitReports.monthlyReportDesc') }}</p>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card card-hover-shadow cursor-pointer" @click="selectReportType('custom')">
          <div class="card-body text-center">
            <div class="symbol symbol-50px mx-auto mb-5">
              <span class="symbol-label bg-light-info">
                <i class="fas fa-cog fs-2x text-info"></i>
              </span>
            </div>
            <h5 class="text-gray-900 mb-2">{{ $t('visits.visitReports.customReport') }}</h5>
            <p class="text-muted mb-0">{{ $t('visits.visitReports.customReportDesc') }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- end::report types -->

    <!-- begin::report configuration -->
    <div v-if="selectedReportType" class="card mb-5">
      <div class="card-header">
        <h3 class="card-title">{{ $t('visits.visitReports.reportConfiguration') }}</h3>
      </div>
      <div class="card-body">
        <div class="row g-5">
          <!-- Date Range -->
          <div class="col-md-6">
            <h5 class="mb-4">{{ $t('visits.visitReports.dateRange') }}</h5>
            <div v-if="selectedReportType === 'custom'" class="row g-3">
              <div class="col-6">
                <label class="form-label">{{ $t('visits.visitReports.startDate') }}</label>
                <input type="date" v-model="reportConfig.startDate" class="form-control" />
              </div>
              <div class="col-6">
                <label class="form-label">{{ $t('visits.visitReports.endDate') }}</label>
                <input type="date" v-model="reportConfig.endDate" class="form-control" />
              </div>
            </div>
            <div v-else>
              <p class="text-muted">
                {{ getDateRangeText() }}
              </p>
            </div>
          </div>

          <!-- Report Options -->
          <div class="col-md-6">
            <h5 class="mb-4">{{ $t('visits.visitReports.reportOptions') }}</h5>
            <div class="form-check mb-3">
              <input 
                class="form-check-input" 
                type="checkbox" 
                v-model="reportConfig.includeStatistics"
                id="includeStatistics"
              >
              <label class="form-check-label" for="includeStatistics">
                {{ $t('visits.visitReports.includeStatistics') }}
              </label>
            </div>
            <div class="form-check mb-3">
              <input 
                class="form-check-input" 
                type="checkbox" 
                v-model="reportConfig.includeCharts"
                id="includeCharts"
              >
              <label class="form-check-label" for="includeCharts">
                {{ $t('visits.visitReports.includeCharts') }}
              </label>
            </div>
            <div class="form-check mb-3">
              <input 
                class="form-check-input" 
                type="checkbox" 
                v-model="reportConfig.includeDetails"
                id="includeDetails"
              >
              <label class="form-check-label" for="includeDetails">
                {{ $t('visits.visitReports.includeDetails') }}
              </label>
            </div>
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                v-model="reportConfig.includeIncidents"
                id="includeIncidents"
              >
              <label class="form-check-label" for="includeIncidents">
                {{ $t('visits.visitReports.includeIncidents') }}
              </label>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="row g-5 mt-2">
          <div class="col-12">
            <h5 class="mb-4">{{ $t('visits.visitReports.filters') }}</h5>
            <div class="row g-3">
              <div class="col-md-3">
                <label class="form-label">{{ $t('visits.visitReports.visitType') }}</label>
                <select v-model="reportConfig.visitType" class="form-select">
                  <option value="">{{ $t('common.all') }}</option>
                  <option value="family">{{ $t('visits.types.family') }}</option>
                  <option value="legal">{{ $t('visits.types.legal') }}</option>
                  <option value="religious">{{ $t('visits.types.religious') }}</option>
                  <option value="social">{{ $t('visits.types.social') }}</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">{{ $t('visits.visitReports.location') }}</label>
                <select v-model="reportConfig.location" class="form-select">
                  <option value="">{{ $t('common.all') }}</option>
                  <option value="room1">{{ $t('visits.visitReports.room') }} 1</option>
                  <option value="room2">{{ $t('visits.visitReports.room') }} 2</option>
                  <option value="room3">{{ $t('visits.visitReports.room') }} 3</option>
                  <option value="special">{{ $t('visits.visitReports.specialRoom') }}</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">{{ $t('visits.visitReports.status') }}</label>
                <select v-model="reportConfig.status" class="form-select">
                  <option value="">{{ $t('common.all') }}</option>
                  <option value="completed">{{ $t('visits.visitStatus.completed') }}</option>
                  <option value="cancelled">{{ $t('visits.visitStatus.cancelled') }}</option>
                  <option value="noShow">{{ $t('visits.visitStatus.noShow') }}</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">{{ $t('visits.visitReports.groupBy') }}</label>
                <select v-model="reportConfig.groupBy" class="form-select">
                  <option value="none">{{ $t('common.none') }}</option>
                  <option value="day">{{ $t('visits.visitReports.byDay') }}</option>
                  <option value="visitor">{{ $t('visits.visitReports.byVisitor') }}</option>
                  <option value="inmate">{{ $t('visits.visitReports.byInmate') }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end::report configuration -->

    <!-- begin::report preview -->
    <div v-if="selectedReportType" class="card">
      <div class="card-header">
        <h3 class="card-title">{{ $t('visits.visitReports.reportPreview') }}</h3>
        <div class="card-toolbar">
          <button class="btn btn-sm btn-light-primary me-2" @click="handleRefreshPreview">
            <i class="fas fa-sync"></i>
            {{ $t('common.refresh') }}
          </button>
          <button class="btn btn-sm btn-primary" @click="handleDownloadReport">
            <i class="fas fa-download"></i>
            {{ $t('common.download') }}
          </button>
        </div>
      </div>
      <div class="card-body">
        <!-- Report Header -->
        <div class="text-center mb-5">
          <h2 class="mb-3">{{ getReportTitle() }}</h2>
          <p class="text-muted">{{ getReportSubtitle() }}</p>
        </div>

        <!-- Statistics Summary -->
        <div v-if="reportConfig.includeStatistics" class="row g-5 mb-10">
          <div class="col-md-3">
            <div class="border border-dashed border-gray-300 rounded p-5 text-center">
              <h3 class="text-primary mb-2">{{ previewData.totalVisits }}</h3>
              <p class="text-muted mb-0">{{ $t('visits.visitReports.totalVisits') }}</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="border border-dashed border-gray-300 rounded p-5 text-center">
              <h3 class="text-success mb-2">{{ previewData.completedVisits }}</h3>
              <p class="text-muted mb-0">{{ $t('visits.visitReports.completedVisits') }}</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="border border-dashed border-gray-300 rounded p-5 text-center">
              <h3 class="text-danger mb-2">{{ previewData.cancelledVisits }}</h3>
              <p class="text-muted mb-0">{{ $t('visits.visitReports.cancelledVisits') }}</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="border border-dashed border-gray-300 rounded p-5 text-center">
              <h3 class="text-info mb-2">{{ previewData.avgDuration }}</h3>
              <p class="text-muted mb-0">{{ $t('visits.visitReports.avgDuration') }}</p>
            </div>
          </div>
        </div>

        <!-- Charts -->
        <div v-if="reportConfig.includeCharts" class="row g-5 mb-10">
          <div class="col-md-6">
            <div class="card card-bordered">
              <div class="card-header">
                <h4 class="card-title">{{ $t('visits.visitReports.visitsByType') }}</h4>
              </div>
              <div class="card-body">
                <div class="text-center py-10">
                  <i class="fas fa-chart-pie fs-3x text-muted"></i>
                  <p class="text-muted mt-3">{{ $t('visits.visitReports.chartPlaceholder') }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card card-bordered">
              <div class="card-header">
                <h4 class="card-title">{{ $t('visits.visitReports.visitsTrend') }}</h4>
              </div>
              <div class="card-body">
                <div class="text-center py-10">
                  <i class="fas fa-chart-line fs-3x text-muted"></i>
                  <p class="text-muted mt-3">{{ $t('visits.visitReports.chartPlaceholder') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Details Table -->
        <div v-if="reportConfig.includeDetails">
          <h4 class="mb-5">{{ $t('visits.visitReports.visitDetails') }}</h4>
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr class="bg-light">
                  <th>{{ $t('visits.visitReports.date') }}</th>
                  <th>{{ $t('visits.visitReports.visitor') }}</th>
                  <th>{{ $t('visits.visitReports.inmate') }}</th>
                  <th>{{ $t('visits.visitReports.type') }}</th>
                  <th>{{ $t('visits.visitReports.duration') }}</th>
                  <th>{{ $t('visits.visitReports.status') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="visit in previewData.visits" :key="visit.id">
                  <td>{{ formatDate(visit.date) }}</td>
                  <td>{{ visit.visitorName }}</td>
                  <td>{{ visit.inmateName }}</td>
                  <td>
                    <span class="badge badge-light-info">{{ visit.type }}</span>
                  </td>
                  <td>{{ visit.duration }} min</td>
                  <td>
                    <span :class="getStatusBadgeClass(visit.status)">
                      {{ $t(`visits.visitStatus.${visit.status}`) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- end::report preview -->

    <!-- begin::saved reports -->
    <div class="card mt-5">
      <div class="card-header">
        <h3 class="card-title">{{ $t('visits.visitReports.savedReports') }}</h3>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
            <thead>
              <tr class="fw-bold text-muted">
                <th>{{ $t('visits.visitReports.reportName') }}</th>
                <th>{{ $t('visits.visitReports.type') }}</th>
                <th>{{ $t('visits.visitReports.dateRange') }}</th>
                <th>{{ $t('visits.visitReports.generatedOn') }}</th>
                <th>{{ $t('visits.visitReports.generatedBy') }}</th>
                <th class="text-end">{{ $t('common.actions.title') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in savedReports" :key="report.id">
                <td>
                  <i class="fas fa-file-pdf text-danger me-2"></i>
                  <span class="text-gray-900 fw-bold">{{ report.name }}</span>
                </td>
                <td>
                  <span class="badge badge-light-primary">{{ report.type }}</span>
                </td>
                <td>{{ report.dateRange }}</td>
                <td>{{ formatDate(report.generatedOn) }}</td>
                <td>{{ report.generatedBy }}</td>
                <td class="text-end">
                  <button 
                    class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                    @click="handleViewReport(report.id)"
                    :title="$t('common.view')"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                    @click="handleDownloadSavedReport(report.id)"
                    :title="$t('common.download')"
                  >
                    <i class="fas fa-download"></i>
                  </button>
                  <button 
                    class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                    @click="handleDeleteReport(report.id)"
                    :title="$t('common.delete')"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- end::saved reports -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

// Composables
const { t } = useI18n()

// Types
interface ReportConfig {
  startDate: string
  endDate: string
  includeStatistics: boolean
  includeCharts: boolean
  includeDetails: boolean
  includeIncidents: boolean
  visitType: string
  location: string
  status: string
  groupBy: string
}

interface PreviewData {
  totalVisits: number
  completedVisits: number
  cancelledVisits: number
  avgDuration: string
  visits: Array<{
    id: number
    date: string
    visitorName: string
    inmateName: string
    type: string
    duration: number
    status: string
  }>
}

interface SavedReport {
  id: number
  name: string
  type: string
  dateRange: string
  generatedOn: string
  generatedBy: string
}

// Refs
const selectedReportType = ref<string | null>(null)
const reportConfig = ref<ReportConfig>({
  startDate: '',
  endDate: '',
  includeStatistics: true,
  includeCharts: true,
  includeDetails: true,
  includeIncidents: false,
  visitType: '',
  location: '',
  status: '',
  groupBy: 'none'
})

const previewData = ref<PreviewData>({
  totalVisits: 245,
  completedVisits: 238,
  cancelledVisits: 7,
  avgDuration: '52 min',
  visits: [
    {
      id: 1,
      date: '2024-03-15',
      visitorName: 'María García',
      inmateName: 'Juan García',
      type: 'Familiar',
      duration: 60,
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-03-15',
      visitorName: 'Ana Martinez',
      inmateName: 'Luis Hernandez',
      type: 'Familiar',
      duration: 45,
      status: 'completed'
    },
    {
      id: 3,
      date: '2024-03-14',
      visitorName: 'Lic. Carlos Mendez',
      inmateName: 'Pedro Ramirez',
      type: 'Legal',
      duration: 90,
      status: 'completed'
    }
  ]
})

const savedReports = ref<SavedReport[]>([
  {
    id: 1,
    name: 'Reporte Semanal - Semana 11',
    type: 'Semanal',
    dateRange: '11/03/2024 - 17/03/2024',
    generatedOn: '2024-03-18',
    generatedBy: 'Juan Pérez'
  },
  {
    id: 2,
    name: 'Reporte Mensual - Febrero 2024',
    type: 'Mensual',
    dateRange: '01/02/2024 - 29/02/2024',
    generatedOn: '2024-03-01',
    generatedBy: 'María González'
  },
  {
    id: 3,
    name: 'Reporte Diario - 14/03/2024',
    type: 'Diario',
    dateRange: '14/03/2024',
    generatedOn: '2024-03-15',
    generatedBy: 'Juan Pérez'
  }
])

// Methods
const selectReportType = (type: string) => {
  selectedReportType.value = type
  
  // Set default date ranges based on type
  const today = new Date()
  if (type === 'daily') {
    reportConfig.value.startDate = today.toISOString().split('T')[0]
    reportConfig.value.endDate = today.toISOString().split('T')[0]
  } else if (type === 'weekly') {
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    reportConfig.value.startDate = weekStart.toISOString().split('T')[0]
    reportConfig.value.endDate = weekEnd.toISOString().split('T')[0]
  } else if (type === 'monthly') {
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    reportConfig.value.startDate = monthStart.toISOString().split('T')[0]
    reportConfig.value.endDate = monthEnd.toISOString().split('T')[0]
  }
}

const getDateRangeText = () => {
  if (!reportConfig.value.startDate) return ''
  
  const start = new Date(reportConfig.value.startDate)
  const end = new Date(reportConfig.value.endDate)
  
  if (selectedReportType.value === 'daily') {
    return start.toLocaleDateString('es-GT', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  } else {
    return `${start.toLocaleDateString('es-GT')} - ${end.toLocaleDateString('es-GT')}`
  }
}

const getReportTitle = () => {
  const titles: Record<string, string> = {
    daily: t('visits.visitReports.dailyReportTitle'),
    weekly: t('visits.visitReports.weeklyReportTitle'),
    monthly: t('visits.visitReports.monthlyReportTitle'),
    custom: t('visits.visitReports.customReportTitle')
  }
  return titles[selectedReportType.value || ''] || ''
}

const getReportSubtitle = () => {
  return `${t('visits.visitReports.period')}: ${getDateRangeText()}`
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-GT')
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    completed: 'badge badge-light-success',
    cancelled: 'badge badge-light-danger',
    noShow: 'badge badge-light-warning'
  }
  return classes[status] || 'badge badge-light'
}

const handleGenerateReport = () => {
  if (!selectedReportType.value) {
    Swal.fire({
      title: t('visits.visitReports.selectReportType'),
      text: t('visits.visitReports.selectReportTypeText'),
      icon: 'info'
    })
    return
  }
  
  handleRefreshPreview()
}

const handleRefreshPreview = () => {
  // Refresh preview data
}

const handleDownloadReport = async () => {
  const result = await Swal.fire({
    title: t('visits.visitReports.downloadReport'),
    input: 'text',
    inputLabel: t('visits.visitReports.reportNameLabel'),
    inputValue: getReportTitle(),
    showCancelButton: true,
    confirmButtonText: t('common.download'),
    cancelButtonText: t('common.cancel'),
    inputValidator: (value) => {
      if (!value) {
        return t('visits.visitReports.reportNameRequired')
      }
    }
  })

  if (result.isConfirmed) {
    
    Swal.fire({
      title: t('common.success'),
      text: t('visits.visitReports.reportGenerated'),
      icon: 'success'
    })
  }
}

const handleViewReport = (reportId: number) => {
}

const handleDownloadSavedReport = (reportId: number) => {
}

const handleDeleteReport = async (reportId: number) => {
  const result = await Swal.fire({
    title: t('visits.visitReports.deleteReportTitle'),
    text: t('visits.visitReports.deleteReportText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('common.delete'),
    cancelButtonText: t('common.cancel'),
    confirmButtonColor: '#d33'
  })

  if (result.isConfirmed) {
    const index = savedReports.value.findIndex(r => r.id === reportId)
    if (index > -1) {
      savedReports.value.splice(index, 1)
    }
    
    Swal.fire({
      title: t('common.deleted'),
      text: t('visits.visitReports.reportDeleted'),
      icon: 'success'
    })
  }
}
</script>

<style scoped>
.card-hover-shadow {
  transition: all 0.3s ease;
}

.card-hover-shadow:hover {
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.cursor-pointer {
  cursor: pointer;
}
</style>