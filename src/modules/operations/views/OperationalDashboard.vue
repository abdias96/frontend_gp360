<template>
  <div>
    <!-- Page Header -->
    <div class="row mb-6">
      <div class="col-12">
        <h1 class="page-heading d-flex text-dark fw-bold fs-2 flex-column justify-content-center my-0">
          {{ $t('operations.dashboard.title') }}
          <span class="page-desc text-muted fs-6 fw-semibold pt-1">
            {{ $t('operations.dashboard.subtitle') }}
          </span>
        </h1>
      </div>
    </div>

    <!-- Summary Cards Row 1 -->
    <div class="row g-5 g-xl-8 mb-5">
      <div class="col-xl-3">
        <div class="card card-xl-stretch">
          <div class="card-body d-flex flex-column">
            <div class="d-flex flex-stack">
              <div class="d-flex align-items-center">
                <div class="symbol symbol-50px me-5">
                  <span class="symbol-label bg-light-primary">
                    <i class="fas fa-users fa-2x text-primary"></i>
                  </span>
                </div>
                <div>
                  <div class="fs-2 fw-bold">{{ statistics.total_population }}</div>
                  <div class="fs-7 text-muted">Población Total</div>
                </div>
              </div>
              <div class="d-flex flex-column text-end">
                <span class="badge badge-light-success fs-base">
                  <i class="fas fa-arrow-up"></i> +2.4%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3">
        <div class="card card-xl-stretch">
          <div class="card-body d-flex flex-column">
            <div class="d-flex flex-stack">
              <div class="d-flex align-items-center">
                <div class="symbol symbol-50px me-5">
                  <span class="symbol-label bg-light-warning">
                    <i class="fas fa-percentage fa-2x text-warning"></i>
                  </span>
                </div>
                <div>
                  <div class="fs-2 fw-bold">{{ statistics.occupancy_rate }}%</div>
                  <div class="fs-7 text-muted">Tasa de Ocupación</div>
                </div>
              </div>
              <div class="d-flex flex-column text-end">
                <span class="badge badge-light-warning fs-base">
                  <i class="fas fa-exclamation"></i> Alta
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3">
        <div class="card card-xl-stretch">
          <div class="card-body d-flex flex-column">
            <div class="d-flex flex-stack">
              <div class="d-flex align-items-center">
                <div class="symbol symbol-50px me-5">
                  <span class="symbol-label bg-light-success">
                    <i class="fas fa-sign-in-alt fa-2x text-success"></i>
                  </span>
                </div>
                <div>
                  <div class="fs-2 fw-bold">{{ statistics.daily_admissions }}</div>
                  <div class="fs-7 text-muted">Admisiones Hoy</div>
                </div>
              </div>
              <div class="d-flex flex-column text-end">
                <span class="text-muted fs-7">Promedio: 12</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3">
        <div class="card card-xl-stretch">
          <div class="card-body d-flex flex-column">
            <div class="d-flex flex-stack">
              <div class="d-flex align-items-center">
                <div class="symbol symbol-50px me-5">
                  <span class="symbol-label bg-light-info">
                    <i class="fas fa-sign-out-alt fa-2x text-info"></i>
                  </span>
                </div>
                <div>
                  <div class="fs-2 fw-bold">{{ statistics.daily_releases }}</div>
                  <div class="fs-7 text-muted">Liberaciones Hoy</div>
                </div>
              </div>
              <div class="d-flex flex-column text-end">
                <span class="text-muted fs-7">Promedio: 8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="row g-5 g-xl-8 mb-5">
      <!-- Population Trend Chart -->
      <div class="col-xl-8">
        <div class="card card-xl-stretch mb-xl-8">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">Tendencia Poblacional</span>
              <span class="text-muted fw-semibold fs-7">Últimos 30 días</span>
            </h3>
            <div class="card-toolbar">
              <button type="button" class="btn btn-sm btn-icon btn-color-primary btn-active-light-primary">
                <i class="fas fa-download"></i>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div ref="populationChart" style="height: 350px"></div>
          </div>
        </div>
      </div>

      <!-- Center Distribution -->
      <div class="col-xl-4">
        <div class="card card-xl-stretch mb-5 mb-xl-8">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">Distribución por Centro</span>
              <span class="text-muted fw-semibold fs-7">Ocupación actual</span>
            </h3>
          </div>
          <div class="card-body d-flex flex-column">
            <div ref="centerChart" style="height: 300px"></div>
            
            <div class="pt-5">
              <div 
                v-for="center in centerDistribution" 
                :key="center.id"
                class="d-flex align-items-center mb-3"
              >
                <div class="symbol symbol-30px me-3">
                  <span 
                    class="symbol-label"
                    :style="`background-color: ${center.color}`"
                  ></span>
                </div>
                <div class="flex-grow-1">
                  <span class="text-gray-800 fw-bold">{{ center.name }}</span>
                  <span class="text-muted d-block fs-7">
                    {{ center.current }}/{{ center.capacity }} ({{ center.percentage }}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Tables Row -->
    <div class="row g-5 g-xl-8">
      <!-- Recent Movements -->
      <div class="col-xl-6">
        <div class="card card-xl-stretch mb-xl-8">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">Movimientos Recientes</span>
              <span class="text-muted mt-1 fw-semibold fs-7">Últimas 24 horas</span>
            </h3>
            <div class="card-toolbar">
              <router-link 
                :to="{ name: 'operations-movements' }"
                class="btn btn-sm btn-light-primary"
              >
                Ver todos
              </router-link>
            </div>
          </div>
          <div class="card-body py-3">
            <div class="table-responsive">
              <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th>PPL</th>
                    <th>Tipo</th>
                    <th>Origen → Destino</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="movement in recentMovements" :key="movement.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="d-flex flex-column">
                          <span class="text-gray-800 fw-bold">{{ movement.inmate_name }}</span>
                          <span class="text-muted fs-7">{{ movement.inmate_code }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="badge badge-light-primary">{{ movement.type }}</span>
                    </td>
                    <td class="text-muted fs-7">
                      {{ movement.origin }} → {{ movement.destination }}
                    </td>
                    <td>
                      <span 
                        class="badge"
                        :class="movement.status === 'completed' ? 'badge-light-success' : 'badge-light-warning'"
                      >
                        {{ movement.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Releases -->
      <div class="col-xl-6">
        <div class="card card-xl-stretch mb-5 mb-xl-8">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">Próximas Liberaciones</span>
              <span class="text-muted mt-1 fw-semibold fs-7">Próximos 7 días</span>
            </h3>
            <div class="card-toolbar">
              <router-link 
                :to="{ name: 'operations-releases' }"
                class="btn btn-sm btn-light-primary"
              >
                Ver todas
              </router-link>
            </div>
          </div>
          <div class="card-body py-3">
            <div class="table-responsive">
              <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th>PPL</th>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Progreso</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="release in upcomingReleases" :key="release.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="d-flex flex-column">
                          <span class="text-gray-800 fw-bold">{{ release.inmate_name }}</span>
                          <span class="text-muted fs-7">{{ release.inmate_code }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="text-gray-800 fw-bold">{{ formatDate(release.date) }}</span>
                    </td>
                    <td>
                      <span class="badge badge-light-success">{{ release.type }}</span>
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="progress h-6px w-100px">
                          <div 
                            class="progress-bar bg-primary"
                            :style="`width: ${release.progress}%`"
                          ></div>
                        </div>
                        <span class="text-muted fs-7 ms-2">{{ release.progress }}%</span>
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

    <!-- Critical Alerts -->
    <div class="row g-5 g-xl-8 mt-5">
      <div class="col-12">
        <div class="card">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">Alertas Críticas</span>
              <span class="text-muted mt-1 fw-semibold fs-7">Requieren atención inmediata</span>
            </h3>
          </div>
          <div class="card-body py-3">
            <div v-if="criticalAlerts.length > 0">
              <div 
                v-for="alert in criticalAlerts" 
                :key="alert.id"
                class="alert alert-dismissible bg-light-danger d-flex flex-column flex-sm-row p-5 mb-3"
              >
                <i class="fas fa-exclamation-circle fs-2hx text-danger me-4 mb-5 mb-sm-0"></i>
                <div class="d-flex flex-column pe-0 pe-sm-10">
                  <h5 class="mb-1">{{ alert.title }}</h5>
                  <span>{{ alert.description }}</span>
                </div>
                <button 
                  @click="resolveAlert(alert)"
                  class="btn btn-sm btn-danger ms-auto"
                >
                  Resolver
                </button>
              </div>
            </div>
            <div v-else class="text-center py-10">
              <i class="fas fa-check-circle fa-3x text-success mb-3"></i>
              <h4 class="text-muted">No hay alertas críticas</h4>
              <p class="text-muted">Todos los sistemas operan normalmente.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import ApexCharts from 'apexcharts'
import Swal from 'sweetalert2'

const { t } = useI18n()
const router = useRouter()

// Chart refs
const populationChart = ref<HTMLElement>()
const centerChart = ref<HTMLElement>()
let populationChartInstance: ApexCharts | null = null
let centerChartInstance: ApexCharts | null = null

// Data
const statistics = ref({
  total_population: 4567,
  occupancy_rate: 92.5,
  daily_admissions: 15,
  daily_releases: 8
})

const centerDistribution = ref([
  {
    id: 1,
    name: 'Centro Preventivo Zona 18',
    current: 1850,
    capacity: 2000,
    percentage: 92.5,
    color: '#009ef7'
  },
  {
    id: 2,
    name: 'Granja Penal Canadá',
    current: 1200,
    capacity: 1500,
    percentage: 80,
    color: '#50CD89'
  },
  {
    id: 3,
    name: 'Centro de Mujeres',
    current: 450,
    capacity: 500,
    percentage: 90,
    color: '#F1416C'
  },
  {
    id: 4,
    name: 'Otros Centros',
    current: 1067,
    capacity: 1200,
    percentage: 88.9,
    color: '#FFC700'
  }
])

const recentMovements = ref([
  {
    id: 1,
    inmate_name: 'Juan Pérez',
    inmate_code: 'PPL-2024-001',
    type: 'Traslado',
    origin: 'Zona 18',
    destination: 'Canadá',
    status: 'completed'
  },
  {
    id: 2,
    inmate_name: 'María García',
    inmate_code: 'PPL-2024-002',
    type: 'Audiencia',
    origin: 'Centro Mujeres',
    destination: 'Tribunales',
    status: 'in_transit'
  }
])

const upcomingReleases = ref([
  {
    id: 1,
    inmate_name: 'Carlos López',
    inmate_code: 'PPL-2022-123',
    date: '2024-01-18',
    type: 'Cumplimiento',
    progress: 85
  },
  {
    id: 2,
    inmate_name: 'Ana Martínez',
    inmate_code: 'PPL-2023-456',
    date: '2024-01-20',
    type: 'Condicional',
    progress: 60
  }
])

const criticalAlerts = ref([
  {
    id: 1,
    title: 'Sobrepoblación Crítica - Zona 18',
    description: 'El centro ha alcanzado el 98% de su capacidad máxima. Se requiere acción inmediata.'
  },
  {
    id: 2,
    title: 'Discrepancia en Conteo - Sector B',
    description: '2 PPL no ubicados durante el conteo matutino. Investigación en curso.'
  }
])

// Methods
const initCharts = () => {
  // Population Trend Chart
  const populationOptions = {
    series: [{
      name: 'Población Total',
      data: generateRandomData(30, 4400, 4600)
    }],
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    colors: ['#009ef7'],
    xaxis: {
      categories: generateDateLabels(30),
      labels: {
        rotate: -45
      }
    },
    yaxis: {
      min: 4300,
      max: 4700
    },
    tooltip: {
      y: {
        formatter: (val: number) => val + ' PPL'
      }
    }
  }

  if (populationChart.value) {
    populationChartInstance = new ApexCharts(populationChart.value, populationOptions)
    populationChartInstance.render()
  }

  // Center Distribution Chart
  const centerOptions = {
    series: centerDistribution.value.map(c => c.current),
    chart: {
      type: 'donut',
      height: 300
    },
    labels: centerDistribution.value.map(c => c.name),
    colors: centerDistribution.value.map(c => c.color),
    legend: {
      show: false
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toFixed(1) + '%'
    },
    tooltip: {
      y: {
        formatter: (val: number) => val + ' PPL'
      }
    }
  }

  if (centerChart.value) {
    centerChartInstance = new ApexCharts(centerChart.value, centerOptions)
    centerChartInstance.render()
  }
}

const generateRandomData = (count: number, min: number, max: number) => {
  const data = []
  for (let i = 0; i < count; i++) {
    data.push(Math.floor(Math.random() * (max - min + 1)) + min)
  }
  return data
}

const generateDateLabels = (days: number) => {
  const labels = []
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    labels.push(date.toLocaleDateString('es-GT', { month: 'short', day: 'numeric' }))
  }
  return labels
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-GT', {
    month: 'short',
    day: 'numeric'
  })
}

const resolveAlert = async (alert: any) => {
  const result = await Swal.fire({
    title: 'Resolver Alerta',
    text: '¿Confirma que desea marcar esta alerta como resuelta?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, resolver',
    cancelButtonText: 'Cancelar'
  })
  
  if (result.isConfirmed) {
    // Remove alert from list
    criticalAlerts.value = criticalAlerts.value.filter(a => a.id !== alert.id)
    
    await Swal.fire({
      icon: 'success',
      title: 'Alerta resuelta',
      text: 'La alerta ha sido marcada como resuelta'
    })
  }
}

// Lifecycle
onMounted(() => {
  initCharts()
})

onUnmounted(() => {
  if (populationChartInstance) {
    populationChartInstance.destroy()
  }
  if (centerChartInstance) {
    centerChartInstance.destroy()
  }
})
</script>