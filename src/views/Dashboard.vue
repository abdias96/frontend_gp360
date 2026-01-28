<template>
  <!--begin::Dashboard Penitenciario-->
  <div class="dashboard-container">
    <!-- Título del Dashboard -->
    <div class="row mb-5">
      <div class="col-12">
        <h1 class="page-heading d-flex text-gray-900 fw-bold fs-3 flex-column justify-content-center my-0">
          Panel de Control - Sistema Penitenciario
          <span class="page-desc text-muted fs-7 fw-semibold pt-1">
            Monitoreo en tiempo real del sistema GP360
          </span>
        </h1>
      </div>
    </div>

    <!-- Row 1: Estadísticas Principales -->
    <div class="row g-5 g-xl-8 mb-5">
      <!-- Población Total -->
      <div class="col-xl-3">
        <StatWidget
          title="Población Total"
          value="5,847"
          description="PPL activos en el sistema"
          icon="profile-user"
          color="primary"
          :percentage="2.3"
          trend="up"
        />
      </div>

      <!-- Capacidad del Sistema -->
      <div class="col-xl-3">
        <StatWidget
          title="Capacidad Total"
          value="6,500"
          description="89.95% de ocupación"
          icon="home-2"
          color="warning"
          :percentage="89.95"
          :showProgressBar="true"
        />
      </div>

      <!-- Ingresos del Día -->
      <div class="col-xl-3">
        <StatWidget
          title="Ingresos Hoy"
          value="12"
          description="Nuevos PPL ingresados"
          icon="entrance-right"
          color="success"
          :badge="'+3 vs ayer'"
        />
      </div>

      <!-- Alertas Activas -->
      <div class="col-xl-3">
        <StatWidget
          title="Alertas Activas"
          value="7"
          description="Requieren atención inmediata"
          icon="notification-status"
          color="danger"
          :pulse="true"
        />
      </div>
    </div>

    <!-- Row 2: Gráficas y Distribuciones -->
    <div class="row g-5 g-xl-8 mb-5">
      <!-- Gráfica de Población por Centro -->
      <div class="col-xl-8">
        <div class="card card-flush h-xl-100">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">Distribución de Población por Centro Penitenciario</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">Actualizado en tiempo real</span>
            </h3>
            <div class="card-toolbar">
              <button class="btn btn-sm btn-light-primary">
                <KTIcon icon-name="download" icon-class="fs-3" />
                Exportar
              </button>
            </div>
          </div>
          <div class="card-body pt-5">
            <apexchart
              type="bar"
              :options="populationChartOptions"
              :series="populationChartSeries"
              height="350"
            />
          </div>
        </div>
      </div>

      <!-- Clasificación de Seguridad -->
      <div class="col-xl-4">
        <div class="card card-flush h-xl-100">
          <div class="card-header pt-7">
            <h3 class="card-title fw-bold text-gray-900">Clasificación de Seguridad</h3>
          </div>
          <div class="card-body d-flex justify-content-center">
            <apexchart
              type="donut"
              :options="securityChartOptions"
              :series="securityChartSeries"
              height="300"
            />
          </div>
          <div class="card-footer">
            <div class="d-flex justify-content-between">
              <span class="text-muted">Máxima: <span class="text-danger fw-bold">1,234</span></span>
              <span class="text-muted">Media: <span class="text-warning fw-bold">2,456</span></span>
              <span class="text-muted">Mínima: <span class="text-success fw-bold">2,157</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 3: Tablas y Listas -->
    <div class="row g-5 g-xl-8 mb-5">
      <!-- Audiencias Programadas -->
      <div class="col-xl-6">
        <div class="card card-flush h-xl-100">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">Audiencias Programadas Hoy</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">15 audiencias pendientes</span>
            </h3>
          </div>
          <div class="card-body pt-2">
            <div class="table-responsive">
              <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th class="min-w-150px">PPL</th>
                    <th class="min-w-100px">Hora</th>
                    <th class="min-w-150px">Tipo</th>
                    <th class="min-w-100px">Juzgado</th>
                    <th class="text-end min-w-100px">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="symbol symbol-45px me-3">
                          <img src="/media/avatars/300-1.jpg" alt="" />
                        </div>
                        <div class="d-flex justify-content-start flex-column">
                          <span class="text-gray-900 fw-bold fs-6">Juan Pérez García</span>
                          <span class="text-muted fw-semibold fs-7">Exp. #2024-1234</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="text-gray-900 fw-bold d-block fs-6">09:00 AM</span>
                    </td>
                    <td>
                      <span class="badge badge-light-primary">Primera Declaración</span>
                    </td>
                    <td>
                      <span class="text-gray-900 fw-semibold">Juzgado 3ro</span>
                    </td>
                    <td class="text-end">
                      <span class="badge badge-light-warning">En Traslado</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="symbol symbol-45px me-3">
                          <img src="/media/avatars/300-2.jpg" alt="" />
                        </div>
                        <div class="d-flex justify-content-start flex-column">
                          <span class="text-gray-900 fw-bold fs-6">María López</span>
                          <span class="text-muted fw-semibold fs-7">Exp. #2024-1235</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="text-gray-900 fw-bold d-block fs-6">10:30 AM</span>
                    </td>
                    <td>
                      <span class="badge badge-light-success">Revisión</span>
                    </td>
                    <td>
                      <span class="text-gray-900 fw-semibold">Juzgado 1ro</span>
                    </td>
                    <td class="text-end">
                      <span class="badge badge-light-info">Programado</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="symbol symbol-45px me-3">
                          <img src="/media/avatars/300-3.jpg" alt="" />
                        </div>
                        <div class="d-flex justify-content-start flex-column">
                          <span class="text-gray-900 fw-bold fs-6">Carlos Ramírez</span>
                          <span class="text-muted fw-semibold fs-7">Exp. #2024-1236</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="text-gray-900 fw-bold d-block fs-6">02:00 PM</span>
                    </td>
                    <td>
                      <span class="badge badge-light-danger">Sentencia</span>
                    </td>
                    <td>
                      <span class="text-gray-900 fw-semibold">Juzgado 5to</span>
                    </td>
                    <td class="text-end">
                      <span class="badge badge-light-info">Programado</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="card-footer">
            <a href="/legal/hearings" class="btn btn-sm btn-light-primary">Ver todas las audiencias</a>
          </div>
        </div>
      </div>

      <!-- Incidentes Recientes -->
      <div class="col-xl-6">
        <div class="card card-flush h-xl-100">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">Incidentes de Seguridad (Últimas 24h)</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">7 incidentes registrados</span>
            </h3>
          </div>
          <div class="card-body pt-2">
            <div class="timeline-label">
              <!-- Incidente 1 -->
              <div class="timeline-item">
                <div class="timeline-label fw-bold text-gray-800 fs-6">08:00</div>
                <div class="timeline-badge">
                  <i class="fa fa-genderless text-danger fs-1"></i>
                </div>
                <div class="timeline-content fw-bold text-gray-800 ps-3">
                  Altercado en Sector B
                  <div class="text-muted fs-7">2 PPL involucrados - Controlado</div>
                </div>
              </div>

              <!-- Incidente 2 -->
              <div class="timeline-item">
                <div class="timeline-label fw-bold text-gray-800 fs-6">11:30</div>
                <div class="timeline-badge">
                  <i class="fa fa-genderless text-warning fs-1"></i>
                </div>
                <div class="timeline-content fw-bold text-gray-800 ps-3">
                  Intento de introducción de objetos prohibidos
                  <div class="text-muted fs-7">Detectado en requisas - En investigación</div>
                </div>
              </div>

              <!-- Incidente 3 -->
              <div class="timeline-item">
                <div class="timeline-label fw-bold text-gray-800 fs-6">14:15</div>
                <div class="timeline-badge">
                  <i class="fa fa-genderless text-success fs-1"></i>
                </div>
                <div class="timeline-content fw-bold text-gray-800 ps-3">
                  Emergencia médica
                  <div class="text-muted fs-7">PPL trasladado al hospital - Estable</div>
                </div>
              </div>

              <!-- Incidente 4 -->
              <div class="timeline-item">
                <div class="timeline-label fw-bold text-gray-800 fs-6">16:45</div>
                <div class="timeline-badge">
                  <i class="fa fa-genderless text-info fs-1"></i>
                </div>
                <div class="timeline-content fw-bold text-gray-800 ps-3">
                  Requisa extraordinaria Sector D
                  <div class="text-muted fs-7">Sin novedades - Completado</div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <a href="/security/incidents" class="btn btn-sm btn-light-danger">Ver todos los incidentes</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 4: Métricas Adicionales -->
    <div class="row g-5 g-xl-8 mb-5">
      <!-- Traslados del Día -->
      <div class="col-xl-4">
        <div class="card bg-primary hoverable">
          <div class="card-body">
            <KTIcon icon-name="bus" icon-class="text-white fs-3x ms-n1" />
            <div class="text-white fw-bold fs-2 mb-2 mt-5">28 Traslados</div>
            <div class="fw-semibold text-white">Programados para hoy</div>
            <div class="mt-3">
              <span class="badge badge-light-primary me-2">12 Audiencias</span>
              <span class="badge badge-light-warning me-2">8 Médicos</span>
              <span class="badge badge-light-info">8 Otros</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Visitas del Día -->
      <div class="col-xl-4">
        <div class="card bg-success hoverable">
          <div class="card-body">
            <KTIcon icon-name="people" icon-class="text-white fs-3x ms-n1" />
            <div class="text-white fw-bold fs-2 mb-2 mt-5">156 Visitas</div>
            <div class="fw-semibold text-white">Registradas hoy</div>
            <div class="mt-3">
              <span class="badge badge-light-success me-2">120 Familiares</span>
              <span class="badge badge-light-warning">36 Abogados</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Personal en Servicio -->
      <div class="col-xl-4">
        <div class="card bg-info hoverable">
          <div class="card-body">
            <KTIcon icon-name="shield-tick" icon-class="text-white fs-3x ms-n1" />
            <div class="text-white fw-bold fs-2 mb-2 mt-5">84 Agentes</div>
            <div class="fw-semibold text-white">En servicio actualmente</div>
            <div class="mt-3">
              <span class="badge badge-light-info me-2">Turno: 06:00 - 14:00</span>
              <span class="badge badge-light-warning">2 Supervisores</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 5: Gráficas de Tendencias -->
    <div class="row g-5 g-xl-8">
      <!-- Evolución de Población -->
      <div class="col-xl-6">
        <div class="card card-flush">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">Evolución de Población (30 días)</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">Tendencia mensual</span>
            </h3>
            <div class="card-toolbar">
              <button class="btn btn-sm btn-icon btn-light-primary">
                <KTIcon icon-name="arrows-circle" icon-class="fs-3" />
              </button>
            </div>
          </div>
          <div class="card-body">
            <apexchart
              type="area"
              :options="trendChartOptions"
              :series="trendChartSeries"
              height="300"
            />
          </div>
        </div>
      </div>

      <!-- Estadísticas por Género y Edad -->
      <div class="col-xl-6">
        <div class="card card-flush">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">Distribución Demográfica</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">Por género y grupo etario</span>
            </h3>
          </div>
          <div class="card-body">
            <div class="row">
              <!-- Género -->
              <div class="col-6">
                <div class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold fs-6 mb-3">Por Género</span>
                  <div class="d-flex align-items-center mb-2">
                    <span class="bullet bullet-dot bg-primary me-2"></span>
                    <span class="text-gray-600 flex-grow-1 me-4">Masculino</span>
                    <span class="text-gray-900 fw-bold">5,241 (89.6%)</span>
                  </div>
                  <div class="d-flex align-items-center">
                    <span class="bullet bullet-dot bg-danger me-2"></span>
                    <span class="text-gray-600 flex-grow-1 me-4">Femenino</span>
                    <span class="text-gray-900 fw-bold">606 (10.4%)</span>
                  </div>
                </div>
              </div>
              <!-- Edad -->
              <div class="col-6">
                <div class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold fs-6 mb-3">Por Edad</span>
                  <div class="d-flex align-items-center mb-2">
                    <span class="bullet bullet-dot bg-success me-2"></span>
                    <span class="text-gray-600 flex-grow-1 me-4">18-25 años</span>
                    <span class="text-gray-900 fw-bold">1,462 (25%)</span>
                  </div>
                  <div class="d-flex align-items-center mb-2">
                    <span class="bullet bullet-dot bg-warning me-2"></span>
                    <span class="text-gray-600 flex-grow-1 me-4">26-40 años</span>
                    <span class="text-gray-900 fw-bold">2,923 (50%)</span>
                  </div>
                  <div class="d-flex align-items-center">
                    <span class="bullet bullet-dot bg-info me-2"></span>
                    <span class="text-gray-600 flex-grow-1 me-4">40+ años</span>
                    <span class="text-gray-900 fw-bold">1,462 (25%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end::Dashboard Penitenciario-->
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getCSSVariableValue } from "@/assets/ts/_utils";

// Componente de estadísticas personalizado
import StatWidget from '@/components/widgets/StatWidget.vue';

// Datos para la gráfica de población por centro
const populationChartSeries = ref([{
  name: 'Población Actual',
  data: [1234, 987, 756, 654, 543, 432, 321, 298, 276, 254]
}]);

const populationChartOptions = ref({
  chart: {
    type: 'bar',
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 5
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: ['Pavón', 'Cantel', 'El Boquerón', 'Fraijanes I', 'Fraijanes II', 'Preventivo Z18', 'Puerto Barrios', 'Escuintla', 'Quetzaltenango', 'Santa Teresa'],
    labels: {
      rotate: -45,
      style: {
        fontSize: '11px'
      }
    }
  },
  yaxis: {
    title: {
      text: 'Número de PPL'
    }
  },
  fill: {
    opacity: 1,
    colors: [getCSSVariableValue('--bs-primary')]
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return val + " PPL"
      }
    }
  },
  colors: [getCSSVariableValue('--bs-primary')]
});

// Datos para la gráfica de clasificación de seguridad
const securityChartSeries = ref([1234, 2456, 2157]);

const securityChartOptions = ref({
  chart: {
    type: 'donut'
  },
  labels: ['Máxima', 'Media', 'Mínima'],
  colors: [
    getCSSVariableValue('--bs-danger'),
    getCSSVariableValue('--bs-warning'),
    getCSSVariableValue('--bs-success')
  ],
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total PPL',
            formatter: function () {
              return '5,847'
            }
          }
        }
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      }
    }
  }]
});

// Datos para la gráfica de tendencias
const trendChartSeries = ref([{
  name: 'Población',
  data: [5720, 5735, 5748, 5756, 5765, 5772, 5780, 5788, 5795, 5802, 5810, 5818, 5825, 5832, 5838, 5845, 5840, 5835, 5830, 5825, 5820, 5815, 5810, 5815, 5820, 5825, 5830, 5835, 5842, 5847]
}]);

const trendChartOptions = ref({
  chart: {
    type: 'area',
    toolbar: {
      show: false
    },
    sparkline: {
      enabled: true
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 3,
    colors: [getCSSVariableValue('--bs-info')]
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.2,
      stops: [0, 90, 100]
    },
    colors: [getCSSVariableValue('--bs-info')]
  },
  xaxis: {
    type: 'datetime',
    categories: Array.from({length: 30}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString();
    })
  },
  tooltip: {
    x: {
      format: 'dd/MM/yy'
    }
  }
});

// Simulación de actualización en tiempo real
onMounted(() => {
  // Aquí se pueden agregar llamadas a APIs para obtener datos reales
  setInterval(() => {
    // Actualizar datos cada 30 segundos
    updateDashboardData();
  }, 30000);
});

const updateDashboardData = () => {
  // Función para actualizar datos del dashboard
};
</script>

<style scoped>
.dashboard-container {
  padding: 0;
}

.hoverable {
  transition: transform 0.2s;
  cursor: pointer;
}

.hoverable:hover {
  transform: translateY(-5px);
}

.timeline-label {
  position: relative;
  padding-left: 3rem;
}

.timeline-item {
  position: relative;
  padding-bottom: 2rem;
}

.timeline-item:before {
  content: '';
  position: absolute;
  left: 1.5rem;
  top: 2rem;
  bottom: 0;
  width: 1px;
  background: #e4e6ef;
}

.timeline-item:last-child:before {
  display: none;
}

.timeline-badge {
  position: absolute;
  left: 1rem;
  top: 0;
}

.timeline-label {
  position: absolute;
  left: 3rem;
  top: 0;
  min-width: 60px;
}

.timeline-content {
  margin-left: 100px;
}
</style>