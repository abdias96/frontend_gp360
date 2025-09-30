<template>
  <div>
    <!-- begin::page-header -->
    <div class="row gy-5 g-xl-10 mb-5 mb-xl-10">
      <div class="col-md-12">
        <div class="d-flex flex-column flex-md-row align-items-center justify-content-between">
          <h1 class="fs-2x fw-bold text-gray-900 mb-4 mb-md-0">
            {{ $t('visits.visitStatistics.title') }}
          </h1>
          <div class="d-flex gap-2">
            <button class="btn btn-light-primary" @click="handleExportData">
              <i class="fas fa-download"></i>
              {{ $t('visits.visitStatistics.exportData') }}
            </button>
            <button class="btn btn-primary" @click="handleRefresh">
              <i class="fas fa-sync"></i>
              {{ $t('common.refresh') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- end::page-header -->

    <!-- begin::date range selector -->
    <div class="card mb-5">
      <div class="card-body">
        <div class="row align-items-end g-3">
          <div class="col-md-3">
            <label class="form-label">{{ $t('visits.visitStatistics.dateRange') }}</label>
            <select v-model="dateRange" class="form-select" @change="handleDateRangeChange">
              <option value="today">{{ $t('visits.visitStatistics.today') }}</option>
              <option value="week">{{ $t('visits.visitStatistics.thisWeek') }}</option>
              <option value="month">{{ $t('visits.visitStatistics.thisMonth') }}</option>
              <option value="quarter">{{ $t('visits.visitStatistics.thisQuarter') }}</option>
              <option value="year">{{ $t('visits.visitStatistics.thisYear') }}</option>
              <option value="custom">{{ $t('visits.visitStatistics.custom') }}</option>
            </select>
          </div>
          <div v-if="dateRange === 'custom'" class="col-md-3">
            <label class="form-label">{{ $t('visits.visitStatistics.startDate') }}</label>
            <input type="date" v-model="customStartDate" class="form-control" />
          </div>
          <div v-if="dateRange === 'custom'" class="col-md-3">
            <label class="form-label">{{ $t('visits.visitStatistics.endDate') }}</label>
            <input type="date" v-model="customEndDate" class="form-control" />
          </div>
          <div class="col-md-3">
            <button class="btn btn-primary w-100" @click="loadStatistics">
              <i class="fas fa-chart-bar me-2"></i>
              {{ $t('visits.visitStatistics.generateStatistics') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- end::date range selector -->

    <!-- begin::key metrics -->
    <div class="row g-5 mb-5">
      <div class="col-xl-3">
        <div class="card">
          <div class="card-body">
            <div class="d-flex align-items-center mb-5">
              <span class="svg-icon svg-icon-3x svg-icon-primary me-5">
                <i class="fas fa-users fa-2x text-primary"></i>
              </span>
              <div class="flex-grow-1">
                <div class="text-muted fw-semibold">{{ $t('visits.visitStatistics.totalVisits') }}</div>
                <div class="text-gray-900 fw-bold fs-2">{{ metrics.totalVisits.toLocaleString() }}</div>
              </div>
            </div>
            <div class="d-flex align-items-center">
              <span :class="getChangeClass(metrics.totalVisitsChange)">
                <i :class="getChangeIcon(metrics.totalVisitsChange)"></i>
                {{ Math.abs(metrics.totalVisitsChange) }}%
              </span>
              <span class="text-muted ms-2">{{ $t('visits.visitStatistics.vsLastPeriod') }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card">
          <div class="card-body">
            <div class="d-flex align-items-center mb-5">
              <span class="svg-icon svg-icon-3x svg-icon-success me-5">
                <i class="fas fa-user-check fa-2x text-success"></i>
              </span>
              <div class="flex-grow-1">
                <div class="text-muted fw-semibold">{{ $t('visits.visitStatistics.uniqueVisitors') }}</div>
                <div class="text-gray-900 fw-bold fs-2">{{ metrics.uniqueVisitors.toLocaleString() }}</div>
              </div>
            </div>
            <div class="d-flex align-items-center">
              <span :class="getChangeClass(metrics.uniqueVisitorsChange)">
                <i :class="getChangeIcon(metrics.uniqueVisitorsChange)"></i>
                {{ Math.abs(metrics.uniqueVisitorsChange) }}%
              </span>
              <span class="text-muted ms-2">{{ $t('visits.visitStatistics.vsLastPeriod') }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card">
          <div class="card-body">
            <div class="d-flex align-items-center mb-5">
              <span class="svg-icon svg-icon-3x svg-icon-warning me-5">
                <i class="fas fa-clock fa-2x text-warning"></i>
              </span>
              <div class="flex-grow-1">
                <div class="text-muted fw-semibold">{{ $t('visits.visitStatistics.avgDuration') }}</div>
                <div class="text-gray-900 fw-bold fs-2">{{ metrics.avgDuration }}</div>
              </div>
            </div>
            <div class="d-flex align-items-center">
              <span :class="getChangeClass(metrics.avgDurationChange)">
                <i :class="getChangeIcon(metrics.avgDurationChange)"></i>
                {{ Math.abs(metrics.avgDurationChange) }}%
              </span>
              <span class="text-muted ms-2">{{ $t('visits.visitStatistics.vsLastPeriod') }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card">
          <div class="card-body">
            <div class="d-flex align-items-center mb-5">
              <span class="svg-icon svg-icon-3x svg-icon-info me-5">
                <i class="fas fa-percentage fa-2x text-info"></i>
              </span>
              <div class="flex-grow-1">
                <div class="text-muted fw-semibold">{{ $t('visits.visitStatistics.completionRate') }}</div>
                <div class="text-gray-900 fw-bold fs-2">{{ metrics.completionRate }}%</div>
              </div>
            </div>
            <div class="d-flex align-items-center">
              <span :class="getChangeClass(metrics.completionRateChange)">
                <i :class="getChangeIcon(metrics.completionRateChange)"></i>
                {{ Math.abs(metrics.completionRateChange) }}%
              </span>
              <span class="text-muted ms-2">{{ $t('visits.visitStatistics.vsLastPeriod') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end::key metrics -->

    <!-- begin::charts row -->
    <div class="row g-5 mb-5">
      <!-- Visit Trends Chart -->
      <div class="col-xl-8">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitStatistics.visitTrends') }}</h3>
            <div class="card-toolbar">
              <div class="btn-group btn-group-sm" role="group">
                <button 
                  type="button" 
                  class="btn"
                  :class="trendView === 'daily' ? 'btn-primary' : 'btn-light'"
                  @click="trendView = 'daily'"
                >
                  {{ $t('visits.visitStatistics.daily') }}
                </button>
                <button 
                  type="button" 
                  class="btn"
                  :class="trendView === 'weekly' ? 'btn-primary' : 'btn-light'"
                  @click="trendView = 'weekly'"
                >
                  {{ $t('visits.visitStatistics.weekly') }}
                </button>
                <button 
                  type="button" 
                  class="btn"
                  :class="trendView === 'monthly' ? 'btn-primary' : 'btn-light'"
                  @click="trendView = 'monthly'"
                >
                  {{ $t('visits.visitStatistics.monthly') }}
                </button>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div id="visitTrendsChart" style="height: 350px;"></div>
          </div>
        </div>
      </div>

      <!-- Visit Types Distribution -->
      <div class="col-xl-4">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitStatistics.visitTypes') }}</h3>
          </div>
          <div class="card-body">
            <div id="visitTypesChart" style="height: 350px;"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- end::charts row -->

    <!-- begin::detailed stats -->
    <div class="row g-5">
      <!-- Peak Hours -->
      <div class="col-xl-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitStatistics.peakHours') }}</h3>
          </div>
          <div class="card-body">
            <div id="peakHoursChart" style="height: 300px;"></div>
          </div>
        </div>
      </div>

      <!-- Day of Week Distribution -->
      <div class="col-xl-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitStatistics.dayDistribution') }}</h3>
          </div>
          <div class="card-body">
            <div id="dayDistributionChart" style="height: 300px;"></div>
          </div>
        </div>
      </div>

      <!-- Top Visitors -->
      <div class="col-xl-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitStatistics.topVisitors') }}</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th>{{ $t('visits.visitStatistics.rank') }}</th>
                    <th>{{ $t('visits.visitStatistics.visitor') }}</th>
                    <th>{{ $t('visits.visitStatistics.visits') }}</th>
                    <th>{{ $t('visits.visitStatistics.totalDuration') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(visitor, index) in topVisitors" :key="visitor.id">
                    <td>
                      <span class="badge badge-light-primary">{{ index + 1 }}</span>
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="symbol symbol-40px me-3">
                          <img :src="visitor.photo || '/media/avatars/blank.png'" alt="" />
                        </div>
                        <div>
                          <span class="text-gray-900 fw-bold">{{ visitor.name }}</span>
                          <br>
                          <span class="text-muted fs-7">{{ visitor.document }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="text-gray-900 fw-bold">{{ visitor.visits }}</span>
                    </td>
                    <td>{{ visitor.totalDuration }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Most Visited Inmates -->
      <div class="col-xl-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitStatistics.mostVisitedInmates') }}</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th>{{ $t('visits.visitStatistics.rank') }}</th>
                    <th>{{ $t('visits.visitStatistics.inmate') }}</th>
                    <th>{{ $t('visits.visitStatistics.visits') }}</th>
                    <th>{{ $t('visits.visitStatistics.uniqueVisitors') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(inmate, index) in mostVisitedInmates" :key="inmate.id">
                    <td>
                      <span class="badge badge-light-success">{{ index + 1 }}</span>
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="symbol symbol-40px me-3">
                          <img :src="inmate.photo || '/media/avatars/blank.png'" alt="" />
                        </div>
                        <div>
                          <span class="text-gray-900 fw-bold">{{ inmate.name }}</span>
                          <br>
                          <span class="badge badge-light">{{ inmate.code }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="text-gray-900 fw-bold">{{ inmate.visits }}</span>
                    </td>
                    <td>{{ inmate.uniqueVisitors }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Room Utilization -->
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitStatistics.roomUtilization') }}</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th>{{ $t('visits.visitStatistics.room') }}</th>
                    <th>{{ $t('visits.visitStatistics.capacity') }}</th>
                    <th>{{ $t('visits.visitStatistics.totalVisits') }}</th>
                    <th>{{ $t('visits.visitStatistics.avgOccupancy') }}</th>
                    <th>{{ $t('visits.visitStatistics.peakOccupancy') }}</th>
                    <th>{{ $t('visits.visitStatistics.utilizationRate') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="room in roomUtilization" :key="room.id">
                    <td>
                      <span class="text-gray-900 fw-bold">{{ room.name }}</span>
                    </td>
                    <td>{{ room.capacity }}</td>
                    <td>{{ room.totalVisits }}</td>
                    <td>{{ room.avgOccupancy }}</td>
                    <td>{{ room.peakOccupancy }}</td>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="progress h-6px w-100px me-2">
                          <div 
                            class="progress-bar" 
                            :class="getUtilizationClass(room.utilizationRate)"
                            :style="`width: ${room.utilizationRate}%`"
                          ></div>
                        </div>
                        <span class="text-gray-900">{{ room.utilizationRate }}%</span>
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
    <!-- end::detailed stats -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import ApexCharts from 'apexcharts'
import Swal from 'sweetalert2'

// Composables
const { t } = useI18n()

// Refs
const dateRange = ref('month')
const customStartDate = ref('')
const customEndDate = ref('')
const trendView = ref('daily')

const metrics = ref({
  totalVisits: 1234,
  totalVisitsChange: 12.5,
  uniqueVisitors: 456,
  uniqueVisitorsChange: 8.3,
  avgDuration: '52 min',
  avgDurationChange: -2.1,
  completionRate: 96.5,
  completionRateChange: 1.2
})

const topVisitors = ref([
  {
    id: 1,
    name: 'María García López',
    document: 'DPI: 2547896321234',
    photo: null,
    visits: 24,
    totalDuration: '20h 15m'
  },
  {
    id: 2,
    name: 'Ana Martinez Rodriguez',
    document: 'DPI: 9876543210987',
    photo: null,
    visits: 18,
    totalDuration: '15h 30m'
  },
  {
    id: 3,
    name: 'Carlos Mendez',
    document: 'DPI: 1234567890123',
    photo: null,
    visits: 16,
    totalDuration: '14h 45m'
  }
])

const mostVisitedInmates = ref([
  {
    id: 1,
    name: 'Juan García López',
    code: 'REC-2024-001',
    photo: null,
    visits: 45,
    uniqueVisitors: 12
  },
  {
    id: 2,
    name: 'Pedro Ramirez',
    code: 'REC-2024-025',
    photo: null,
    visits: 38,
    uniqueVisitors: 8
  },
  {
    id: 3,
    name: 'Luis Hernandez',
    code: 'REC-2024-010',
    photo: null,
    visits: 32,
    uniqueVisitors: 15
  }
])

const roomUtilization = ref([
  {
    id: 1,
    name: 'Sala de Visitas 1',
    capacity: 20,
    totalVisits: 342,
    avgOccupancy: 12.5,
    peakOccupancy: 18,
    utilizationRate: 75
  },
  {
    id: 2,
    name: 'Sala de Visitas 2',
    capacity: 20,
    totalVisits: 298,
    avgOccupancy: 10.2,
    peakOccupancy: 16,
    utilizationRate: 65
  },
  {
    id: 3,
    name: 'Sala de Visitas 3',
    capacity: 15,
    totalVisits: 215,
    avgOccupancy: 8.7,
    peakOccupancy: 14,
    utilizationRate: 58
  },
  {
    id: 4,
    name: 'Sala Especial',
    capacity: 10,
    totalVisits: 89,
    avgOccupancy: 3.2,
    peakOccupancy: 8,
    utilizationRate: 32
  }
])

// Chart instances
let visitTrendsChart: ApexCharts | null = null
let visitTypesChart: ApexCharts | null = null
let peakHoursChart: ApexCharts | null = null
let dayDistributionChart: ApexCharts | null = null

// Methods
const getChangeClass = (change: number) => {
  if (change > 0) return 'text-success'
  if (change < 0) return 'text-danger'
  return 'text-muted'
}

const getChangeIcon = (change: number) => {
  if (change > 0) return 'fas fa-arrow-up me-1'
  if (change < 0) return 'fas fa-arrow-down me-1'
  return 'fas fa-minus me-1'
}

const getUtilizationClass = (rate: number) => {
  if (rate >= 80) return 'bg-danger'
  if (rate >= 60) return 'bg-warning'
  return 'bg-success'
}

const handleDateRangeChange = () => {
  if (dateRange.value !== 'custom') {
    loadStatistics()
  }
}

const loadStatistics = () => {
  console.log('Loading statistics for:', dateRange.value)
  // Load statistics data
  
  // Update charts
  nextTick(() => {
    initCharts()
  })
}

const handleRefresh = () => {
  loadStatistics()
}

const handleExportData = () => {
  Swal.fire({
    title: t('visits.visitStatistics.exportData'),
    text: t('visits.visitStatistics.selectExportFormat'),
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Excel',
    cancelButtonText: 'CSV',
    showDenyButton: true,
    denyButtonText: 'PDF'
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('Export as Excel')
    } else if (result.isDenied) {
      console.log('Export as PDF')
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      console.log('Export as CSV')
    }
  })
}

const initCharts = () => {
  // Visit Trends Chart
  const visitTrendsOptions = {
    series: [{
      name: t('visits.visitStatistics.visits'),
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 69, 72, 75]
    }],
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    },
    colors: ['#009ef7'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3
      }
    }
  }

  if (visitTrendsChart) {
    visitTrendsChart.destroy()
  }
  visitTrendsChart = new ApexCharts(document.querySelector("#visitTrendsChart"), visitTrendsOptions)
  visitTrendsChart.render()

  // Visit Types Chart
  const visitTypesOptions = {
    series: [45, 30, 15, 10],
    chart: {
      type: 'donut',
      height: 350
    },
    labels: [
      t('visits.types.family'),
      t('visits.types.legal'),
      t('visits.types.religious'),
      t('visits.types.social')
    ],
    colors: ['#009ef7', '#50cd89', '#ffc700', '#f1416c'],
    legend: {
      position: 'bottom'
    }
  }

  if (visitTypesChart) {
    visitTypesChart.destroy()
  }
  visitTypesChart = new ApexCharts(document.querySelector("#visitTypesChart"), visitTypesOptions)
  visitTypesChart.render()

  // Peak Hours Chart
  const peakHoursOptions = {
    series: [{
      name: t('visits.visitStatistics.visits'),
      data: [5, 8, 15, 22, 18, 12, 25, 30, 28, 20, 15, 10]
    }],
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        columnWidth: '50%'
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']
    },
    colors: ['#50cd89']
  }

  if (peakHoursChart) {
    peakHoursChart.destroy()
  }
  peakHoursChart = new ApexCharts(document.querySelector("#peakHoursChart"), peakHoursOptions)
  peakHoursChart.render()

  // Day Distribution Chart
  const dayDistributionOptions = {
    series: [{
      name: t('visits.visitStatistics.visits'),
      data: [65, 70, 68, 72, 78, 145, 180]
    }],
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        horizontal: true
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
    },
    colors: ['#ffc700']
  }

  if (dayDistributionChart) {
    dayDistributionChart.destroy()
  }
  dayDistributionChart = new ApexCharts(document.querySelector("#dayDistributionChart"), dayDistributionOptions)
  dayDistributionChart.render()
}

// Lifecycle
onMounted(() => {
  loadStatistics()
})
</script>

<style scoped>
.h-6px {
  height: 6px !important;
}

.w-100px {
  width: 100px !important;
}
</style>