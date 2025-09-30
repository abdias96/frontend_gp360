<template>
  <div>
    <!-- Page Header -->
    <div class="row mb-6">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="page-heading d-flex text-dark fw-bold fs-2 flex-column justify-content-center my-0">
              {{ $t('operations.kpi.title') }}
              <span class="page-desc text-muted fs-6 fw-semibold pt-1">
                {{ $t('operations.kpi.subtitle') }}
              </span>
            </h1>
          </div>
          <div>
            <select v-model="selectedPeriod" class="form-select">
              <option value="today">Hoy</option>
              <option value="week">Esta Semana</option>
              <option value="month">Este Mes</option>
              <option value="quarter">Este Trimestre</option>
              <option value="year">Este Año</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Main KPI Cards -->
    <div class="row g-5 g-xl-8 mb-5">
      <div 
        v-for="kpi in mainKPIs" 
        :key="kpi.id"
        class="col-xl-3"
      >
        <div class="card card-xl-stretch">
          <div class="card-body">
            <div class="d-flex flex-stack mb-5">
              <div class="d-flex align-items-center">
                <div class="symbol symbol-50px me-5">
                  <span 
                    class="symbol-label"
                    :class="`bg-light-${kpi.color}`"
                  >
                    <i :class="[kpi.icon, 'fa-2x', `text-${kpi.color}`]"></i>
                  </span>
                </div>
                <div>
                  <div class="fs-2 fw-bold">{{ kpi.value }}</div>
                  <div class="fs-7 text-muted">{{ kpi.name }}</div>
                </div>
              </div>
              <div class="d-flex flex-column text-end">
                <span 
                  class="badge fs-base"
                  :class="kpi.trend > 0 ? 'badge-light-success' : 'badge-light-danger'"
                >
                  <i :class="kpi.trend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                  {{ Math.abs(kpi.trend) }}%
                </span>
                <span class="text-muted fs-7 mt-1">vs período anterior</span>
              </div>
            </div>
            <div class="progress h-7px">
              <div 
                class="progress-bar"
                :class="`bg-${kpi.color}`"
                :style="`width: ${kpi.progress}%`"
              ></div>
            </div>
            <div class="d-flex justify-content-between mt-2">
              <span class="text-muted fs-7">Meta: {{ kpi.target }}</span>
              <span class="text-muted fs-7">{{ kpi.progress }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Charts -->
    <div class="row g-5 g-xl-8 mb-5">
      <!-- Efficiency Metrics -->
      <div class="col-xl-6">
        <div class="card card-xl-stretch mb-xl-8">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">Métricas de Eficiencia</span>
              <span class="text-muted fw-semibold fs-7">Indicadores de rendimiento operacional</span>
            </h3>
          </div>
          <div class="card-body">
            <div ref="efficiencyChart" style="height: 350px"></div>
          </div>
        </div>
      </div>

      <!-- Process Time Analysis -->
      <div class="col-xl-6">
        <div class="card card-xl-stretch mb-xl-8">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">Análisis de Tiempos</span>
              <span class="text-muted fw-semibold fs-7">Duración promedio de procesos</span>
            </h3>
          </div>
          <div class="card-body">
            <div ref="processTimeChart" style="height: 350px"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed KPI Tables -->
    <div class="row g-5 g-xl-8">
      <!-- Operational Efficiency -->
      <div class="col-xl-6">
        <div class="card card-xl-stretch mb-5 mb-xl-8">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">Eficiencia Operacional</span>
              <span class="text-muted mt-1 fw-semibold fs-7">Detalle por proceso</span>
            </h3>
          </div>
          <div class="card-body py-3">
            <div class="table-responsive">
              <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th>Proceso</th>
                    <th>Tiempo Promedio</th>
                    <th>Meta</th>
                    <th>Eficiencia</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="process in processEfficiency" :key="process.id">
                    <td>
                      <span class="text-gray-800 fw-bold">{{ process.name }}</span>
                    </td>
                    <td>{{ process.average_time }}</td>
                    <td class="text-muted">{{ process.target_time }}</td>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="progress flex-grow-1" style="height: 8px;">
                          <div 
                            class="progress-bar"
                            :class="getEfficiencyClass(process.efficiency)"
                            :style="`width: ${process.efficiency}%`"
                          ></div>
                        </div>
                        <span class="ms-2 fw-bold">{{ process.efficiency }}%</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Center Performance -->
      <div class="col-xl-6">
        <div class="card card-xl-stretch mb-5 mb-xl-8">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">Rendimiento por Centro</span>
              <span class="text-muted mt-1 fw-semibold fs-7">Comparativa de indicadores</span>
            </h3>
          </div>
          <div class="card-body py-3">
            <div class="table-responsive">
              <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th>Centro</th>
                    <th>Ocupación</th>
                    <th>Incidentes</th>
                    <th>Puntuación</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="center in centerPerformance" :key="center.id">
                    <td>
                      <span class="text-gray-800 fw-bold">{{ center.name }}</span>
                    </td>
                    <td>
                      <span 
                        class="badge"
                        :class="getOccupancyBadgeClass(center.occupancy_rate)"
                      >
                        {{ center.occupancy_rate }}%
                      </span>
                    </td>
                    <td>{{ center.incidents }}</td>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="rating">
                          <div 
                            v-for="i in 5" 
                            :key="i"
                            class="rating-label me-1"
                          >
                            <i 
                              class="fas fa-star"
                              :class="i <= center.score ? 'text-warning' : 'text-gray-300'"
                            ></i>
                          </div>
                        </div>
                        <span class="ms-2 text-muted">{{ center.score }}/5</span>
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

    <!-- Goal Progress -->
    <div class="row g-5 g-xl-8 mt-5">
      <div class="col-12">
        <div class="card">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">Progreso de Objetivos</span>
              <span class="text-muted mt-1 fw-semibold fs-7">Metas institucionales {{ new Date().getFullYear() }}</span>
            </h3>
          </div>
          <div class="card-body py-3">
            <div class="row">
              <div 
                v-for="goal in institutionalGoals" 
                :key="goal.id"
                class="col-md-6 mb-5"
              >
                <div class="d-flex align-items-center mb-2">
                  <span class="bullet bullet-vertical h-40px bg-primary me-5"></span>
                  <div class="flex-grow-1">
                    <h6 class="mb-1">{{ goal.name }}</h6>
                    <span class="text-muted fs-7 fw-semibold">{{ goal.description }}</span>
                  </div>
                  <span class="badge badge-light-primary">{{ goal.progress }}%</span>
                </div>
                <div class="progress h-8px">
                  <div 
                    class="progress-bar bg-primary"
                    :style="`width: ${goal.progress}%`"
                  ></div>
                </div>
                <div class="d-flex justify-content-between mt-2">
                  <span class="text-muted fs-7">Actual: {{ goal.current }}</span>
                  <span class="text-muted fs-7">Meta: {{ goal.target }}</span>
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
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ApexCharts from 'apexcharts'

const { t } = useI18n()

// Chart refs
const efficiencyChart = ref<HTMLElement>()
const processTimeChart = ref<HTMLElement>()
let efficiencyChartInstance: ApexCharts | null = null
let processTimeChartInstance: ApexCharts | null = null

// Data
const selectedPeriod = ref('month')

const mainKPIs = ref([
  {
    id: 1,
    name: 'Eficiencia Operacional',
    value: '87.5%',
    target: '90%',
    progress: 87.5,
    trend: 3.2,
    icon: 'fas fa-chart-line',
    color: 'primary'
  },
  {
    id: 2,
    name: 'Tiempo de Respuesta',
    value: '2.4h',
    target: '2h',
    progress: 80,
    trend: -5.1,
    icon: 'fas fa-clock',
    color: 'warning'
  },
  {
    id: 3,
    name: 'Tasa de Cumplimiento',
    value: '94.2%',
    target: '95%',
    progress: 94.2,
    trend: 1.8,
    icon: 'fas fa-check-circle',
    color: 'success'
  },
  {
    id: 4,
    name: 'Satisfacción Proceso',
    value: '4.2/5',
    target: '4.5/5',
    progress: 84,
    trend: 2.5,
    icon: 'fas fa-smile',
    color: 'info'
  }
])

const processEfficiency = ref([
  {
    id: 1,
    name: 'Proceso de Admisión',
    average_time: '3.5 horas',
    target_time: '3 horas',
    efficiency: 85
  },
  {
    id: 2,
    name: 'Conteo Diario',
    average_time: '45 min',
    target_time: '30 min',
    efficiency: 67
  },
  {
    id: 3,
    name: 'Proceso de Liberación',
    average_time: '2 días',
    target_time: '2 días',
    efficiency: 95
  },
  {
    id: 4,
    name: 'Traslados',
    average_time: '4 horas',
    target_time: '3.5 horas',
    efficiency: 88
  }
])

const centerPerformance = ref([
  {
    id: 1,
    name: 'Centro Zona 18',
    occupancy_rate: 92,
    incidents: 3,
    score: 4
  },
  {
    id: 2,
    name: 'Granja Canadá',
    occupancy_rate: 85,
    incidents: 1,
    score: 5
  },
  {
    id: 3,
    name: 'Centro Mujeres',
    occupancy_rate: 78,
    incidents: 0,
    score: 5
  }
])

const institutionalGoals = ref([
  {
    id: 1,
    name: 'Reducción de Sobrepoblación',
    description: 'Mantener ocupación bajo 90%',
    current: 87,
    target: 90,
    progress: 96
  },
  {
    id: 2,
    name: 'Cero Fugas',
    description: 'Prevención total de escapes',
    current: 365,
    target: 365,
    progress: 100
  },
  {
    id: 3,
    name: 'Reinserción Social',
    description: 'PPL en programas educativos',
    current: 1250,
    target: 1500,
    progress: 83
  },
  {
    id: 4,
    name: 'Digitalización de Procesos',
    description: 'Procesos digitalizados',
    current: 28,
    target: 35,
    progress: 80
  }
])

// Methods
const initCharts = () => {
  // Efficiency Metrics Chart
  const efficiencyOptions = {
    series: [{
      name: 'Eficiencia',
      data: [87, 85, 89, 88, 87.5]
    }, {
      name: 'Meta',
      data: [90, 90, 90, 90, 90]
    }],
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: [3, 2],
      dashArray: [0, 5]
    },
    colors: ['#009ef7', '#E4E6EF'],
    xaxis: {
      categories: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Actual']
    },
    yaxis: {
      min: 80,
      max: 95,
      labels: {
        formatter: (val: number) => val + '%'
      }
    },
    tooltip: {
      y: {
        formatter: (val: number) => val + '%'
      }
    }
  }

  if (efficiencyChart.value) {
    efficiencyChartInstance = new ApexCharts(efficiencyChart.value, efficiencyOptions)
    efficiencyChartInstance.render()
  }

  // Process Time Chart
  const processTimeOptions = {
    series: [{
      name: 'Tiempo Actual',
      data: [3.5, 0.75, 48, 4]
    }, {
      name: 'Tiempo Meta',
      data: [3, 0.5, 48, 3.5]
    }],
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: 'top'
        }
      }
    },
    colors: ['#F1416C', '#50CD89'],
    xaxis: {
      categories: ['Admisión', 'Conteo', 'Liberación', 'Traslado']
    },
    yaxis: {
      labels: {
        style: {
          fontWeight: 600
        }
      }
    },
    tooltip: {
      y: {
        formatter: (val: number, opts: any) => {
          if (opts.seriesIndex === 0 && opts.dataPointIndex < 2) {
            return val + ' horas'
          } else if (opts.seriesIndex === 0 && opts.dataPointIndex === 2) {
            return val + ' horas'
          }
          return val + ' horas'
        }
      }
    }
  }

  if (processTimeChart.value) {
    processTimeChartInstance = new ApexCharts(processTimeChart.value, processTimeOptions)
    processTimeChartInstance.render()
  }
}

const updateData = () => {
  // TODO: Update data based on selected period
  console.log('Updating data for period:', selectedPeriod.value)
}

const getEfficiencyClass = (efficiency: number) => {
  if (efficiency >= 90) return 'bg-success'
  if (efficiency >= 70) return 'bg-warning'
  return 'bg-danger'
}

const getOccupancyBadgeClass = (rate: number) => {
  if (rate >= 95) return 'badge-light-danger'
  if (rate >= 85) return 'badge-light-warning'
  return 'badge-light-success'
}

// Watchers
watch(selectedPeriod, () => {
  updateData()
})

// Lifecycle
onMounted(() => {
  initCharts()
})

onUnmounted(() => {
  if (efficiencyChartInstance) {
    efficiencyChartInstance.destroy()
  }
  if (processTimeChartInstance) {
    processTimeChartInstance.destroy()
  }
})
</script>