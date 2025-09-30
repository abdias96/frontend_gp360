<template>
  <!--begin::Dashboard Penitenciario GP360-->
  <div class="dashboard-container">
    <!-- Título del Dashboard -->
    <div class="row mb-5">
      <div class="col-12">
        <h1 class="page-heading d-flex text-gray-900 fw-bold fs-3 flex-column justify-content-center my-0">
          Panel de Control - Sistema Penitenciario GP360
          <span class="page-desc text-muted fs-7 fw-semibold pt-1">
            Monitoreo en tiempo real del sistema penitenciario
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
          :value="stats.totalInmates"
          description="PPL activos en el sistema"
          icon="profile-user"
          color="primary"
          :percentage="stats.populationChange"
          :trend="stats.populationTrend"
        />
      </div>

      <!-- Capacidad del Sistema -->
      <div class="col-xl-3">
        <StatWidget
          title="Capacidad Total"
          :value="stats.totalCapacity"
          :description="`${stats.occupancyRate}% de ocupación`"
          icon="home-2"
          color="warning"
          :percentage="stats.occupancyRate"
          :showProgressBar="true"
        />
      </div>

      <!-- Ingresos del Día -->
      <div class="col-xl-3">
        <StatWidget
          title="Ingresos Hoy"
          :value="stats.todayAdmissions"
          description="Nuevos PPL ingresados"
          icon="entrance-right"
          color="success"
          :badge="stats.admissionsBadge"
        />
      </div>

      <!-- Alertas Activas -->
      <div class="col-xl-3">
        <StatWidget
          title="Alertas Activas"
          :value="stats.activeAlerts"
          description="Requieren atención inmediata"
          icon="notification-status"
          color="danger"
          :pulse="stats.activeAlerts > 0"
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
              <button class="btn btn-sm btn-light-primary" @click="exportData">
                <KTIcon icon-name="download" icon-class="fs-3" />
                Exportar
              </button>
            </div>
          </div>
          <div class="card-body pt-5">
            <apexchart
              v-if="populationChartSeries.length"
              type="bar"
              :options="populationChartOptions"
              :series="populationChartSeries"
              height="350"
            />
            <div v-else class="d-flex align-items-center justify-content-center h-300px">
              <span class="spinner-border text-primary"></span>
            </div>
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
              v-if="securityChartSeries.length"
              type="donut"
              :options="securityChartOptions"
              :series="securityChartSeries"
              height="300"
            />
            <div v-else class="d-flex align-items-center justify-content-center h-300px">
              <span class="spinner-border text-primary"></span>
            </div>
          </div>
          <div class="card-footer">
            <div class="d-flex justify-content-between">
              <span class="text-muted">Máxima: <span class="text-danger fw-bold">{{ stats.securityMax }}</span></span>
              <span class="text-muted">Media: <span class="text-warning fw-bold">{{ stats.securityMed }}</span></span>
              <span class="text-muted">Mínima: <span class="text-success fw-bold">{{ stats.securityMin }}</span></span>
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
              <span class="text-gray-500 mt-1 fw-semibold fs-6">{{ stats.todayHearings || todayHearings.length }} audiencias pendientes</span>
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
                  <tr v-for="hearing in todayHearings.slice(0, 5)" :key="hearing.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="symbol symbol-45px me-3">
                          <span class="symbol-label bg-light-primary">
                            {{ getInitials(hearing.inmate_name) }}
                          </span>
                        </div>
                        <div class="d-flex justify-content-start flex-column">
                          <span class="text-gray-900 fw-bold fs-6">{{ hearing.inmate_name }}</span>
                          <span class="text-muted fw-semibold fs-7">Exp. #{{ hearing.case_number }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="text-gray-900 fw-bold d-block fs-6">{{ formatTime(hearing.time) }}</span>
                    </td>
                    <td>
                      <span :class="getHearingTypeBadge(hearing.type)">{{ hearing.type_name }}</span>
                    </td>
                    <td>
                      <span class="text-gray-900 fw-semibold">{{ hearing.court_name }}</span>
                    </td>
                    <td class="text-end">
                      <span :class="getStatusBadge(hearing.status)">{{ hearing.status_name }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="!todayHearings.length" class="text-center py-5">
                <span class="text-muted">No hay audiencias programadas para hoy</span>
              </div>
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
              <span class="text-gray-500 mt-1 fw-semibold fs-6">{{ recentIncidents.length }} incidentes registrados</span>
            </h3>
          </div>
          <div class="card-body pt-2">
            <div v-if="recentIncidents.length > 0" class="timeline">
              <div
                v-for="incident in recentIncidents.slice(0, 5)"
                :key="incident.id"
                class="timeline-item"
              >
                <div class="timeline-label fw-bold text-gray-800 fs-7">
                  {{ formatTime(incident.time) }}
                </div>
                <div class="timeline-badge">
                  <i :class="`fa fa-circle text-${getIncidentColor(incident.severity)} fs-6`"></i>
                </div>
                <div class="timeline-content">
                  <div class="fw-bold text-gray-800">{{ incident.title }}</div>
                  <div class="text-muted fs-7 mt-1">{{ incident.description }}</div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <span class="text-muted">No hay incidentes registrados en las últimas 24 horas</span>
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
            <div class="text-white fw-bold fs-2 mb-2 mt-5">{{ stats.todayTransfers }} Traslados</div>
            <div class="fw-semibold text-white">Programados para hoy</div>
            <div class="mt-3">
              <span class="badge badge-light-primary me-2">{{ stats.transfersHearings }} Audiencias</span>
              <span class="badge badge-light-warning me-2">{{ stats.transfersMedical }} Médicos</span>
              <span class="badge badge-light-info">{{ stats.transfersOther }} Otros</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Visitas del Día -->
      <div class="col-xl-4">
        <div class="card bg-success hoverable">
          <div class="card-body">
            <KTIcon icon-name="people" icon-class="text-white fs-3x ms-n1" />
            <div class="text-white fw-bold fs-2 mb-2 mt-5">{{ stats.todayVisits }} Visitas</div>
            <div class="fw-semibold text-white">Registradas hoy</div>
            <div class="mt-3">
              <span class="badge badge-light-success me-2">{{ stats.visitsFamily }} Familiares</span>
              <span class="badge badge-light-warning">{{ stats.visitsLawyers }} Abogados</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Personal en Servicio -->
      <div class="col-xl-4">
        <div class="card bg-info hoverable">
          <div class="card-body">
            <KTIcon icon-name="shield-tick" icon-class="text-white fs-3x ms-n1" />
            <div class="text-white fw-bold fs-2 mb-2 mt-5">{{ stats.activePersonnel }} Agentes</div>
            <div class="fw-semibold text-white">En servicio actualmente</div>
            <div class="mt-3">
              <span class="badge badge-light-info me-2">Turno: {{ currentShift }}</span>
              <span class="badge badge-light-warning">{{ stats.supervisors }} Supervisores</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 5: Gráficas de Tendencias -->
    <div class="row g-5 g-xl-8 mb-5">
      <!-- Evolución de Población -->
      <div class="col-xl-6">
        <div class="card card-flush">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">Evolución de Población (30 días)</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">Tendencia mensual</span>
            </h3>
            <div class="card-toolbar">
              <button class="btn btn-sm btn-icon btn-light-primary" @click="refreshTrend">
                <KTIcon icon-name="arrows-circle" icon-class="fs-3" />
              </button>
            </div>
          </div>
          <div class="card-body">
            <apexchart
              v-if="trendChartSeries.length"
              type="area"
              :options="trendChartOptions"
              :series="trendChartSeries"
              height="300"
            />
            <div v-else class="d-flex align-items-center justify-content-center h-300px">
              <span class="spinner-border text-primary"></span>
            </div>
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
                    <span class="text-gray-900 fw-bold">{{ stats.genderMale }} ({{ stats.genderMalePercent }}%)</span>
                  </div>
                  <div class="d-flex align-items-center">
                    <span class="bullet bullet-dot bg-danger me-2"></span>
                    <span class="text-gray-600 flex-grow-1 me-4">Femenino</span>
                    <span class="text-gray-900 fw-bold">{{ stats.genderFemale }} ({{ stats.genderFemalePercent }}%)</span>
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
                    <span class="text-gray-900 fw-bold">{{ stats.age18to25 }} ({{ stats.age18to25Percent }}%)</span>
                  </div>
                  <div class="d-flex align-items-center mb-2">
                    <span class="bullet bullet-dot bg-warning me-2"></span>
                    <span class="text-gray-600 flex-grow-1 me-4">26-40 años</span>
                    <span class="text-gray-900 fw-bold">{{ stats.age26to40 }} ({{ stats.age26to40Percent }}%)</span>
                  </div>
                  <div class="d-flex align-items-center">
                    <span class="bullet bullet-dot bg-info me-2"></span>
                    <span class="text-gray-600 flex-grow-1 me-4">40+ años</span>
                    <span class="text-gray-900 fw-bold">{{ stats.age40plus }} ({{ stats.age40plusPercent }}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 6: Gráficas Adicionales del Sistema Penitenciario -->
    <div class="row g-5 g-xl-8 mb-5">
      <!-- Tendencia de Incidentes -->
      <div class="col-xl-6">
        <div class="card card-flush">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">Tendencia de Incidentes (14 días)</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">Incidentes de seguridad por día</span>
            </h3>
          </div>
          <div class="card-body">
            <apexchart
              v-if="incidentTrendSeries.length"
              type="line"
              :options="incidentTrendOptions"
              :series="incidentTrendSeries"
              height="300"
            />
            <div v-else class="d-flex align-items-center justify-content-center h-300px">
              <span class="text-muted">Sin datos de incidentes</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Tipos de Incidentes -->
      <div class="col-xl-6">
        <div class="card card-flush">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">Tipos de Incidentes Más Frecuentes</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">Últimos 30 días</span>
            </h3>
          </div>
          <div class="card-body">
            <apexchart
              v-if="incidentTypesSeries.length"
              type="bar"
              :options="incidentTypesOptions"
              :series="incidentTypesSeries"
              height="300"
            />
            <div v-else class="d-flex align-items-center justify-content-center h-300px">
              <span class="text-muted">Sin datos de tipos de incidentes</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 7: Estadísticas de Audiencias y Operaciones -->
    <div class="row g-5 g-xl-8">
      <!-- Audiencias por Mes -->
      <div class="col-xl-6">
        <div class="card card-flush">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">Audiencias por Mes</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">Últimos 6 meses</span>
            </h3>
          </div>
          <div class="card-body">
            <apexchart
              v-if="hearingsTrendSeries.length"
              type="bar"
              :options="hearingsTrendOptions"
              :series="hearingsTrendSeries"
              height="300"
            />
            <div v-else class="d-flex align-items-center justify-content-center h-300px">
              <span class="text-muted">Sin datos de audiencias</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Distribución de Visitas -->
      <div class="col-xl-6">
        <div class="card card-flush">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">Flujo de Visitas (30 días)</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">Visitantes registrados por día</span>
            </h3>
          </div>
          <div class="card-body">
            <apexchart
              v-if="visitorTrendSeries.length"
              type="area"
              :options="visitorTrendOptions"
              :series="visitorTrendSeries"
              height="300"
            />
            <div v-else class="d-flex align-items-center justify-content-center h-300px">
              <span class="text-muted">Sin datos de visitas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end::Dashboard Penitenciario GP360-->
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { getCSSVariableValue } from "@/assets/ts/_utils";
import ApiService from "@/core/services/ApiService";
import Swal from 'sweetalert2';

// Componente de estadísticas personalizado
import StatWidget from '@/components/widgets/StatWidget.vue';

// Estado reactivo
const stats = ref<any>({
  totalInmates: 0,
  totalCapacity: 0,
  occupancyRate: 0,
  populationChange: 0,
  populationTrend: 'up' as 'up' | 'down',
  todayAdmissions: 0,
  admissionsBadge: '',
  activeAlerts: 0,
  securityMax: 0,
  securityMed: 0,
  securityMin: 0,
  todayTransfers: 0,
  transfersHearings: 0,
  transfersMedical: 0,
  transfersOther: 0,
  todayVisits: 0,
  visitsFamily: 0,
  visitsLawyers: 0,
  activePersonnel: 0,
  supervisors: 0,
  genderMale: 0,
  genderMalePercent: 0,
  genderFemale: 0,
  genderFemalePercent: 0,
  age18to25: 0,
  age18to25Percent: 0,
  age26to40: 0,
  age26to40Percent: 0,
  age40plus: 0,
  age40plusPercent: 0,
  todayHearings: 0
});

const todayHearings = ref<any[]>([]);
const recentIncidents = ref<any[]>([]);

// Datos para gráficas
const populationChartSeries = ref<any[]>([]);
const populationChartOptions = ref({});

const securityChartSeries = ref<number[]>([]);
const securityChartOptions = ref({});

const trendChartSeries = ref<any[]>([]);
const trendChartOptions = ref({});

// Nuevas series de gráficas para el sistema penitenciario
const incidentTrendSeries = ref<any[]>([]);
const incidentTrendOptions = ref({});

const incidentTypesSeries = ref<any[]>([]);
const incidentTypesOptions = ref({});

const hearingsTrendSeries = ref<any[]>([]);
const hearingsTrendOptions = ref({});

const visitorTrendSeries = ref<any[]>([]);
const visitorTrendOptions = ref({});

// Computed
const currentShift = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 14) return '06:00 - 14:00';
  if (hour >= 14 && hour < 22) return '14:00 - 22:00';
  return '22:00 - 06:00';
});

// Métodos
const loadDashboardData = async () => {
  try {
    // Cargar datos del nuevo endpoint unificado
    const response = await ApiService.get('/dashboard/prison-stats');

    if (response?.data?.success) {
      const data = response.data.data;

      // Actualizar estadísticas principales
      stats.value.totalInmates = data.summary?.total_inmates || 0;
      stats.value.totalCapacity = data.summary?.total_capacity || 0;
      stats.value.occupancyRate = data.summary?.occupancy_rate || 0;
      stats.value.todayAdmissions = 0; // Por ahora
      stats.value.activeAlerts = data.summary?.critical_alerts || 0;

      // Traslados, visitas y audiencias
      stats.value.todayTransfers = data.summary?.active_transfers || 0;
      stats.value.todayVisits = data.summary?.today_visitors || 0;
      // Note: todayHearings es un ref array, no un valor simple
      // Este valor se usa para mostrar el contador en el encabezado

      // Actualizar clasificaciones de seguridad
      if (data.security?.classification_distribution) {
        stats.value.securityMax = data.security.classification_distribution['maximum'] || 0;
        stats.value.securityMed = data.security.classification_distribution['medium'] || 0;
        stats.value.securityMin = data.security.classification_distribution['minimum'] || 0;
      }

      // Actualizar audiencias próximas
      if (data.legal?.upcoming_hearings) {
        todayHearings.value = data.legal.upcoming_hearings.map((hearing: any) => ({
          id: Math.random(),
          inmate_name: `${hearing.first_name} ${hearing.last_name}`,
          case_number: hearing.inmate_number,
          time: new Date(hearing.hearing_date).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }),
          type: hearing.hearing_type,
          type_name: getHearingTypeName(hearing.hearing_type),
          court_name: 'Juzgado Penal',
          status: 'scheduled',
          status_name: 'Programada'
        }));
      }

      // Actualizar incidentes recientes
      if (data.security?.incidents_by_type) {
        recentIncidents.value = data.security.incidents_by_type.map((inc: any, index: number) => ({
          id: index,
          time: new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }),
          severity: index === 0 ? 'high' : (index === 1 ? 'medium' : 'low'),
          title: getIncidentTypeName(inc.incident_type),
          description: `${inc.count} incidentes de este tipo en los últimos 30 días`
        }));
      }

      // Actualizar datos de gráficas
      await loadChartData(data.charts);

      // Actualizar las alertas del sistema
      if (data.alerts) {
        updateAlerts(data.alerts);
      }
    }

  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
};

const getHearingTypeName = (type: string): string => {
  const types: Record<string, string> = {
    'first_declaration': 'Primera Declaración',
    'review': 'Revisión',
    'sentence': 'Sentencia',
    'appeal': 'Apelación',
    'hearing': 'Audiencia General'
  };
  return types[type] || type;
};

const getIncidentTypeName = (type: string): string => {
  const types: Record<string, string> = {
    'violence_against_inmate': 'Violencia contra interno',
    'violence_against_staff': 'Violencia contra personal',
    'gang_activity': 'Actividad de pandillas',
    'contraband_possession': 'Posesión de contrabando',
    'escape_attempt': 'Intento de fuga',
    'drug_possession': 'Posesión de drogas',
    'weapon_possession': 'Posesión de armas',
    'property_damage': 'Daño a propiedad',
    'rule_violation': 'Violación de reglas'
  };
  return types[type] || type;
};

const updateAlerts = (alerts: any[]) => {
  // Procesar alertas del sistema
  stats.value.activeAlerts = alerts.filter(a => a.requires_action).length;
};

const updateInmateStats = (data: any) => {
  stats.value.totalInmates = data.total || 0;
  stats.value.genderMale = data.by_gender?.M || 0;
  stats.value.genderFemale = data.by_gender?.F || 0;

  const total = stats.value.totalInmates;
  if (total > 0) {
    stats.value.genderMalePercent = Math.round((stats.value.genderMale / total) * 100);
    stats.value.genderFemalePercent = Math.round((stats.value.genderFemale / total) * 100);
  }

  // Actualizar estadísticas por edad si están disponibles
  if (data.by_age) {
    stats.value.age18to25 = data.by_age['18-25'] || 0;
    stats.value.age26to40 = data.by_age['26-40'] || 0;
    stats.value.age40plus = data.by_age['40+'] || 0;

    if (total > 0) {
      stats.value.age18to25Percent = Math.round((stats.value.age18to25 / total) * 100);
      stats.value.age26to40Percent = Math.round((stats.value.age26to40 / total) * 100);
      stats.value.age40plusPercent = Math.round((stats.value.age40plus / total) * 100);
    }
  }

  // Actualizar clasificación de seguridad si está disponible
  if (data.by_security_level) {
    stats.value.securityMax = data.by_security_level.max || 0;
    stats.value.securityMed = data.by_security_level.medium || 0;
    stats.value.securityMin = data.by_security_level.min || 0;
  }
};

const loadChartData = async (chartsData: any) => {
  try {
    // Usar datos de gráficas del servidor

    // Configurar gráfica de población por centro
    populationChartOptions.value = {
      chart: {
        type: 'bar',
        toolbar: { show: false },
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 5
        }
      },
      dataLabels: { enabled: false },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: [],
        labels: {
          rotate: -45,
          style: { fontSize: '11px' }
        }
      },
      yaxis: {
        title: { text: 'Número de PPL' }
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
    };

    // Datos de población por centro - usar datos reales del servidor
    if (chartsData?.security_classification && Array.isArray(chartsData.security_classification)) {
      // Actualizar gráfica de distribución por centros (si hay datos)
      const centerOccupancy = chartsData.center_occupancy || [];
      if (centerOccupancy.length > 0) {
        const categories = centerOccupancy.map((c: any) => c.name || c.code);
        const populations = centerOccupancy.map((c: any) => c.current_population || 0);
        const capacities = centerOccupancy.map((c: any) => c.capacity || 0);

        populationChartOptions.value.xaxis.categories = categories;
        populationChartSeries.value = [
          {
            name: 'Población Actual',
            data: populations
          },
          {
            name: 'Capacidad',
            data: capacities
          }
        ];
      }
    }
  } catch (error) {
    console.error('Error loading chart data:', error);
    populationChartSeries.value = [];
  }

  // Configurar gráfica de clasificación de seguridad
  securityChartOptions.value = {
    chart: {
      type: 'donut',
      height: 300
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
                return stats.value.totalInmates.toString();
              }
            }
          }
        }
      }
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { width: 200 }
      }
    }]
  };

  // Datos de clasificación de seguridad - usar datos reales del servidor
  if (chartsData?.security_classification && Array.isArray(chartsData.security_classification)) {
    const securityData = chartsData.security_classification;
    if (securityData.length > 0) {
      // Actualizar labels y colores según los datos reales
      const labels = securityData.map((item: any) => item.level);
      const values = securityData.map((item: any) => item.count);
      const colors = securityData.map((item: any) => item.color);

      securityChartOptions.value.labels = labels;
      securityChartOptions.value.colors = colors;
      securityChartSeries.value = values;

      // Actualizar estadísticas manuales
      securityData.forEach((item: any) => {
        if (item.level.toLowerCase().includes('máxima')) {
          stats.value.securityMax = item.count;
        } else if (item.level.toLowerCase().includes('media')) {
          stats.value.securityMed = item.count;
        } else if (item.level.toLowerCase().includes('mínima')) {
          stats.value.securityMin = item.count;
        }
      });
    }
  } else {
    // Si no hay datos en el nuevo formato, intentar usar los stats directos
    const hasSecurityData = stats.value.securityMax > 0 || stats.value.securityMed > 0 || stats.value.securityMin > 0;
    if (hasSecurityData) {
      securityChartSeries.value = [
        stats.value.securityMax,
        stats.value.securityMed,
        stats.value.securityMin
      ];
    } else {
      securityChartSeries.value = [];
    }
  }

  // Configurar gráfica de tendencias
  trendChartOptions.value = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      height: 300,
      sparkline: { enabled: false }
    },
    dataLabels: { enabled: false },
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
    yaxis: {
      title: { text: 'PPL' }
    },
    tooltip: {
      x: { format: 'dd/MM/yy' }
    }
  };

  // Cargar datos de tendencia del servidor
  if (chartsData?.population_trend && Array.isArray(chartsData.population_trend)) {
    const trendData = chartsData.population_trend;
    if (trendData.length > 0) {
      const dates = trendData.map((item: any) => item.date);
      const counts = trendData.map((item: any) => item.count);

      trendChartOptions.value.xaxis.categories = dates;
      trendChartSeries.value = [{
        name: 'Población',
        data: counts
      }];
    }
  } else {
    // Si no hay datos de tendencia, usar solo el valor actual
    const currentTotal = stats.value.totalInmates || 0;
    trendChartSeries.value = currentTotal > 0 ? [{
      name: 'Población',
      data: Array(30).fill(currentTotal)
    }] : [];
  }

  // Actualizar datos de género si están disponibles
  if (chartsData?.gender_distribution) {
    const genderData = chartsData.gender_distribution;
    genderData.forEach((item: any) => {
      if (item.gender === 'M') {
        stats.value.genderMale = item.count;
      } else if (item.gender === 'F') {
        stats.value.genderFemale = item.count;
      }
    });

    const total = stats.value.genderMale + stats.value.genderFemale;
    if (total > 0) {
      stats.value.genderMalePercent = Math.round((stats.value.genderMale / total) * 100);
      stats.value.genderFemalePercent = Math.round((stats.value.genderFemale / total) * 100);
    }
  }

  // Configurar gráfica de tendencia de incidentes
  if (chartsData?.incidents_by_day && Array.isArray(chartsData.incidents_by_day)) {
    const incidentData = chartsData.incidents_by_day;
    if (incidentData.length > 0) {
      incidentTrendOptions.value = {
        chart: {
          type: 'line',
          toolbar: { show: false },
          height: 300
        },
        stroke: {
          curve: 'smooth',
          width: 3,
          colors: [getCSSVariableValue('--bs-danger')]
        },
        markers: {
          size: 4,
          colors: [getCSSVariableValue('--bs-danger')],
          strokeColors: '#fff',
          strokeWidth: 2,
          hover: { size: 7 }
        },
        dataLabels: { enabled: false },
        xaxis: {
          type: 'datetime',
          categories: incidentData.map((item: any) => item.date)
        },
        yaxis: {
          title: { text: 'Número de Incidentes' }
        },
        tooltip: {
          x: { format: 'dd/MM/yyyy' }
        }
      };

      incidentTrendSeries.value = [{
        name: 'Incidentes',
        data: incidentData.map((item: any) => item.count)
      }];
    }
  }

  // Configurar gráfica de tipos de incidentes
  if (chartsData?.top_incident_types && Array.isArray(chartsData.top_incident_types)) {
    const typesData = chartsData.top_incident_types;
    if (typesData.length > 0) {
      incidentTypesOptions.value = {
        chart: {
          type: 'bar',
          toolbar: { show: false },
          height: 300
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 5,
            dataLabels: {
              position: 'top'
            }
          }
        },
        dataLabels: {
          enabled: true,
          offsetX: -6,
          style: {
            fontSize: '12px',
            colors: ['#fff']
          }
        },
        xaxis: {
          categories: typesData.map((item: any) => item.type)
        },
        yaxis: {
          title: { text: 'Tipo de Incidente' }
        },
        colors: [
          getCSSVariableValue('--bs-danger'),
          getCSSVariableValue('--bs-warning'),
          getCSSVariableValue('--bs-info'),
          getCSSVariableValue('--bs-success'),
          getCSSVariableValue('--bs-primary')
        ],
        tooltip: {
          y: {
            formatter: function (val: number) {
              return val + " incidentes"
            }
          }
        }
      };

      incidentTypesSeries.value = [{
        name: 'Incidentes',
        data: typesData.map((item: any) => item.count)
      }];
    }
  }

  // Configurar gráfica de audiencias por mes
  if (chartsData?.hearings_by_month && Array.isArray(chartsData.hearings_by_month)) {
    const hearingsData = chartsData.hearings_by_month;
    if (hearingsData.length > 0) {
      hearingsTrendOptions.value = {
        chart: {
          type: 'bar',
          toolbar: { show: false },
          height: 300
        },
        plotOptions: {
          bar: {
            borderRadius: 5,
            dataLabels: {
              position: 'top'
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val: number) {
            return val;
          },
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: [getCSSVariableValue('--bs-gray-700')]
          }
        },
        xaxis: {
          categories: hearingsData.map((item: any) => item.month),
          position: 'bottom',
          axisBorder: { show: false },
          axisTicks: { show: false },
          crosshairs: {
            fill: {
              type: 'gradient',
              gradient: {
                colorFrom: '#D8E3F0',
                colorTo: '#BED1E6',
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5
              }
            }
          }
        },
        yaxis: {
          title: { text: 'Número de Audiencias' }
        },
        fill: {
          gradient: {
            shade: 'light',
            type: 'horizontal',
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100]
          }
        },
        colors: [getCSSVariableValue('--bs-primary')],
        tooltip: {
          y: {
            formatter: function (val: number) {
              return val + " audiencias"
            }
          }
        }
      };

      hearingsTrendSeries.value = [{
        name: 'Audiencias',
        data: hearingsData.map((item: any) => item.count)
      }];
    }
  }

  // Configurar gráfica de flujo de visitas
  if (chartsData?.visitor_trend) {
    // Este dato vendría de operations.visitor_trend del controlador
    const visitorData = chartsData.visitor_trend || [];
    if (visitorData.length > 0) {
      visitorTrendOptions.value = {
        chart: {
          type: 'area',
          toolbar: { show: false },
          height: 300,
          stacked: false
        },
        dataLabels: { enabled: false },
        stroke: {
          curve: 'smooth',
          width: 2,
          colors: [getCSSVariableValue('--bs-success')]
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100]
          },
          colors: [getCSSVariableValue('--bs-success')]
        },
        xaxis: {
          type: 'datetime',
          categories: visitorData.map((item: any) => item.date)
        },
        yaxis: {
          title: { text: 'Número de Visitantes' }
        },
        tooltip: {
          x: { format: 'dd/MM/yyyy' },
          y: {
            formatter: function (val: number) {
              return val + " visitantes"
            }
          }
        }
      };

      visitorTrendSeries.value = [{
        name: 'Visitantes',
        data: visitorData.map((item: any) => item.count)
      }];
    }
  }
};


// Métodos auxiliares
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatTime = (time: string) => {
  return time;
};

const getHearingTypeBadge = (type: string) => {
  const badges: Record<string, string> = {
    'first_declaration': 'badge badge-light-primary',
    'review': 'badge badge-light-success',
    'sentence': 'badge badge-light-danger'
  };
  return badges[type] || 'badge badge-light-secondary';
};

const getStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    'in_transfer': 'badge badge-light-warning',
    'scheduled': 'badge badge-light-info',
    'completed': 'badge badge-light-success'
  };
  return badges[status] || 'badge badge-light-secondary';
};

const getIncidentColor = (severity: string) => {
  const colors: Record<string, string> = {
    'high': 'danger',
    'medium': 'warning',
    'low': 'success'
  };
  return colors[severity] || 'info';
};

const exportData = () => {
  Swal.fire({
    title: 'Exportar Datos',
    text: 'Seleccione el formato de exportación',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Excel',
    cancelButtonText: 'PDF'
  }).then((result) => {
    if (result.isConfirmed) {
      // Exportar a Excel
      console.log('Exportando a Excel...');
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // Exportar a PDF
      console.log('Exportando a PDF...');
    }
  });
};

const refreshTrend = () => {
  loadChartData();
};

// Lifecycle
let refreshInterval: NodeJS.Timeout | null = null;

onMounted(() => {
  loadDashboardData();

  // Actualizar datos cada 30 segundos
  refreshInterval = setInterval(() => {
    loadDashboardData();
  }, 30000);
});

// Limpiar el intervalo cuando se desmonte el componente
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
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

.timeline {
  position: relative;
  padding: 0;
}

.timeline-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding-bottom: 1.5rem;
  margin-left: 15px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 20px;
  bottom: 0;
  width: 1px;
  background: #e4e6ef;
}

.timeline-item:last-child::before {
  display: none;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-badge {
  position: absolute;
  left: 0;
  top: 2px;
  width: 15px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  background: white;
}

.timeline-badge i {
  font-size: 10px !important;
}

.timeline-label {
  min-width: 65px;
  margin-left: 25px;
  margin-right: 15px;
  flex-shrink: 0;
  color: #7e8299;
}

.timeline-content {
  flex-grow: 1;
  padding-right: 10px;
}

.h-300px {
  height: 300px;
}
</style>