<template>
  <div class="d-flex flex-column gap-7">
    <!--begin::Operations Overview Card-->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label fw-bold text-gray-900">Resumen de Operaciones</span>
          <span class="text-muted mt-1 fw-semibold fs-7">Traslados, conteos diarios y operaciones especiales</span>
        </h3>
        <div class="card-toolbar">
          <button
            v-if="canEdit"
            type="button"
            class="btn btn-sm btn-light-primary"
            @click="openOperationsSummaryModal"
          >
            <i class="ki-duotone ki-pencil fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Actualizar
          </button>
        </div>
      </div>
      <div class="card-body">
        <div v-if="loadingProfile" class="d-flex justify-content-center py-10">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
        
        <div v-else class="row g-6">
          <!--begin::Total Transfers-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Total Traslados</span>
              <span class="fs-5 fw-bold text-primary">
                {{ operationsStats.total_transfers || 0 }}
              </span>
            </div>
          </div>
          <!--end::Total Transfers-->
          
          <!--begin::Current Location Days-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Días en Ubicación</span>
              <span class="fs-5 fw-bold text-info">
                {{ operationsStats.days_in_current_location || 0 }}
              </span>
            </div>
          </div>
          <!--end::Current Location Days-->
          
          <!--begin::Daily Counts Status-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Conteo Diario</span>
              <span class="fs-5 fw-bold" :class="operationsStats.daily_count_status === 'complete' ? 'text-success' : 'text-warning'">
                {{ getDailyCountStatusLabel(operationsStats.daily_count_status) }}
              </span>
            </div>
          </div>
          <!--end::Daily Counts Status-->
          
          <!--begin::Work Assignment-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Asignación Laboral</span>
              <span class="fs-5 fw-bold" :class="operationsStats.has_work_assignment ? 'text-success' : 'text-muted'">
                {{ operationsStats.has_work_assignment ? 'Asignado' : 'Sin asignar' }}
              </span>
            </div>
          </div>
          <!--end::Work Assignment-->
        </div>
        
        <!--begin::Operations Alerts-->
        <div v-if="operationAlerts.length > 0" class="mt-6">
          <h6 class="text-danger fw-bold mb-3">
            <i class="ki-duotone ki-notification-status fs-2 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
              <span class="path4"></span>
            </i>
            Alertas Operacionales
          </h6>
          <div class="row g-3">
            <div v-for="alert in operationAlerts" :key="alert.id" class="col-md-6">
              <div class="alert" :class="`alert-${alert.severity}`" role="alert">
                <div class="d-flex align-items-center">
                  <i :class="`ki-duotone ki-${alert.icon} fs-2 me-3`">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                  </i>
                  <div>
                    <div class="fw-bold">{{ alert.title }}</div>
                    <div class="fs-7">{{ alert.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--end::Operations Alerts-->
      </div>
    </div>
    <!--end::Operations Overview Card-->
    
    <!--begin::Operations Modules Grid-->
    <div class="row g-5">
      <!--begin::Transfer History-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Historial de Traslados</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/operations/transfers`"
                class="btn btn-sm btn-light-primary"
              >
                Ver Historial
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="transferHistory.length > 0">
              <div v-for="transfer in transferHistory.slice(0, 3)" :key="transfer.id" class="d-flex align-items-center mb-4">
                <div class="symbol symbol-40px me-3">
                  <div class="symbol-label" :class="getTransferTypeColor(transfer.type)">
                    <i :class="`ki-duotone ki-${getTransferIcon(transfer.type)} fs-2 ${getTransferIconColor(transfer.type)}`">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ transfer.destination_center }}</div>
                  <div class="text-muted fs-7">{{ transfer.reason || 'Traslado rutinario' }}</div>
                  <div class="text-muted fs-8">{{ formatDateTime(transfer.transfer_date) }}</div>
                </div>
                <span :class="`badge badge-light-${getTransferStatusColor(transfer.status)}`">
                  {{ transfer.status }}
                </span>
              </div>
              <div v-if="transferHistory.length > 3" class="text-center mt-3">
                <span class="text-muted fs-7">+{{ transferHistory.length - 3 }} más</span>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-geolocation fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="text-muted mt-3">Sin traslados registrados</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Transfer History-->
      
      <!--begin::Daily Counts-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Conteos Diarios</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/operations/counts`"
                class="btn btn-sm btn-light-success"
              >
                <i class="ki-duotone ki-plus fs-2"></i>
                Registrar Conteo
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="dailyCounts.length > 0">
              <h6 class="text-muted mb-3">Conteos de Hoy</h6>
              <div v-for="count in dailyCounts.slice(0, 4)" :key="count.id" class="d-flex align-items-center mb-3">
                <div class="symbol symbol-35px me-3">
                  <div class="symbol-label" :class="getCountStatusColor(count.status)">
                    <i :class="`ki-duotone ki-${getCountIcon(count.status)} fs-3 ${getCountIconColor(count.status)}`">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ count.time_slot }}</div>
                  <div class="text-muted fs-7">{{ count.location }}</div>
                </div>
                <span :class="`badge badge-light-${getCountStatusColor(count.status)}`">
                  {{ getCountStatusLabel(count.status) }}
                </span>
              </div>
              
              <div class="separator my-3"></div>
              
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-muted">Próximo conteo:</span>
                <span class="fw-bold">{{ getNextCountTime() }}</span>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-category fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
              </i>
              <div class="text-muted mt-3">Sin conteos registrados hoy</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Daily Counts-->
      
      <!--begin::Work Assignments-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Asignaciones de Trabajo</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/operations/work`"
                class="btn btn-sm btn-light-info"
              >
                Ver Detalles
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="workAssignments.length > 0">
              <div v-for="assignment in workAssignments.slice(0, 2)" :key="assignment.id" class="mb-4">
                <div class="d-flex align-items-center mb-2">
                  <div class="symbol symbol-40px me-3">
                    <div class="symbol-label bg-light-info">
                      <i class="ki-duotone ki-questionnaire-tablet fs-2 text-info">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <div class="fw-bold text-gray-900">{{ assignment.job_title }}</div>
                    <div class="text-muted fs-7">{{ assignment.department }}</div>
                    <div class="text-muted fs-8">{{ assignment.schedule }}</div>
                  </div>
                  <span :class="`badge badge-light-${getWorkStatusColor(assignment.status)}`">
                    {{ assignment.status }}
                  </span>
                </div>
                
                <div class="progress mt-2" style="height: 6px">
                  <div 
                    class="progress-bar bg-info" 
                    :style="`width: ${assignment.attendance_rate || 0}%`"
                  ></div>
                </div>
                <div class="text-muted fs-8 mt-1">Asistencia: {{ assignment.attendance_rate || 0 }}%</div>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-questionnaire-tablet fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="text-muted mt-3">Sin asignaciones de trabajo</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Work Assignments-->
      
      <!--begin::Special Operations-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Operaciones Especiales</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/operations/special`"
                class="btn btn-sm btn-light-warning"
              >
                Ver Todas
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="specialOperations.length > 0">
              <div v-for="operation in specialOperations.slice(0, 3)" :key="operation.id" class="d-flex align-items-center mb-4">
                <div class="symbol symbol-40px me-3">
                  <div class="symbol-label" :class="getOperationTypeColor(operation.type)">
                    <i :class="`ki-duotone ki-${getOperationIcon(operation.type)} fs-2 ${getOperationIconColor(operation.type)}`">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ operation.title }}</div>
                  <div class="text-muted fs-7">{{ operation.description }}</div>
                  <div class="text-muted fs-8">{{ formatDateTime(operation.scheduled_date) }}</div>
                </div>
                <span :class="`badge badge-light-${getOperationStatusColor(operation.status)}`">
                  {{ operation.status }}
                </span>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-notification-status fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
              </i>
              <div class="text-muted mt-3">Sin operaciones especiales</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Special Operations-->
    </div>
    <!--end::Operations Modules Grid-->
    
    <!--begin::Quick Actions-->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Acciones Rápidas</h3>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/operations/transfer-request`"
              class="btn btn-flex btn-light-primary w-100 py-4"
            >
              <i class="ki-duotone ki-delivery fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Solicitar Traslado</span>
            </router-link>
          </div>
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/operations/daily-count`"
              class="btn btn-flex btn-light-success w-100 py-4"
            >
              <i class="ki-duotone ki-category fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
              </i>
              <span class="fw-bold">Conteo Diario</span>
            </router-link>
          </div>
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/operations/work-assignment`"
              class="btn btn-flex btn-light-info w-100 py-4"
            >
              <i class="ki-duotone ki-questionnaire-tablet fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Asignar Trabajo</span>
            </router-link>
          </div>
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/operations/emergency`"
              class="btn btn-flex btn-light-danger w-100 py-4"
            >
              <i class="ki-duotone ki-security-check fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
              <span class="fw-bold">Procedimientos Emergencia</span>
            </router-link>
          </div>
        </div>
        
        <div class="separator my-5"></div>
        
        <div class="row g-3">
          <div class="col-md-4">
            <router-link 
              :to="`/inmates/${inmate.id}/operations/logistics`"
              class="btn btn-flex btn-light w-100 py-3"
            >
              <i class="ki-duotone ki-truck fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
              <span>Logística</span>
            </router-link>
          </div>
          <div class="col-md-4">
            <router-link 
              :to="`/inmates/${inmate.id}/operations/security`"
              class="btn btn-flex btn-light w-100 py-3"
            >
              <i class="ki-duotone ki-shield-tick fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span>Seguridad</span>
            </router-link>
          </div>
          <div class="col-md-4">
            <router-link 
              :to="`/inmates/${inmate.id}/operations/reports`"
              class="btn btn-flex btn-light w-100 py-3"
            >
              <i class="ki-duotone ki-chart-simple fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
              <span>Reportes</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!--end::Quick Actions-->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import { formatDate, formatDateTime } from '@/core/helpers/formatters';

// Props
interface Props {
  inmate: any;
}

const props = defineProps<Props>();

// Stores
const authStore = useAuthStore();

// State
const operationsStats = ref<any>({});
const transferHistory = ref<any[]>([]);
const dailyCounts = ref<any[]>([]);
const workAssignments = ref<any[]>([]);
const specialOperations = ref<any[]>([]);
const loadingProfile = ref(false);

// Computed
const canEdit = computed(() => authStore.hasPermission('operations.manage'));

const operationAlerts = computed(() => {
  const alerts = [];
  
  if (operationsStats.value?.pending_transfer) {
    alerts.push({
      id: 'pending_transfer',
      severity: 'warning',
      icon: 'delivery',
      title: 'Traslado Pendiente',
      description: 'Este interno tiene un traslado programado pendiente de ejecución'
    });
  }
  
  if (operationsStats.value?.missing_daily_count) {
    alerts.push({
      id: 'missing_count',
      severity: 'danger',
      icon: 'category',
      title: 'Conteo Diario Faltante',
      description: 'Faltan conteos diarios requeridos'
    });
  }
  
  if (operationsStats.value?.work_attendance_low) {
    alerts.push({
      id: 'low_attendance',
      severity: 'info',
      icon: 'questionnaire-tablet',
      title: 'Baja Asistencia Laboral',
      description: 'La asistencia a trabajos asignados está por debajo del 70%'
    });
  }
  
  return alerts;
});

// Methods
const getDailyCountStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'complete': 'Completo',
    'partial': 'Parcial',
    'missing': 'Faltante',
    'pending': 'Pendiente'
  };
  return labels[status] || 'Sin datos';
};

const getTransferTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'routine': 'bg-light-primary',
    'medical': 'bg-light-info',
    'legal': 'bg-light-warning',
    'emergency': 'bg-light-danger',
    'security': 'bg-light-dark'
  };
  return colors[type] || 'bg-light-primary';
};

const getTransferIcon = (type: string) => {
  const icons: Record<string, string> = {
    'routine': 'geolocation',
    'medical': 'medicine',
    'legal': 'judge',
    'emergency': 'security-check',
    'security': 'shield-tick'
  };
  return icons[type] || 'geolocation';
};

const getTransferIconColor = (type: string) => {
  const colors: Record<string, string> = {
    'routine': 'text-primary',
    'medical': 'text-info',
    'legal': 'text-warning',
    'emergency': 'text-danger',
    'security': 'text-dark'
  };
  return colors[type] || 'text-primary';
};

const getTransferStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'completed': 'success',
    'pending': 'warning',
    'cancelled': 'danger',
    'in_progress': 'info'
  };
  return colors[status] || 'secondary';
};

const getCountStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'present': 'bg-light-success',
    'absent': 'bg-light-danger',
    'pending': 'bg-light-warning',
    'excused': 'bg-light-info'
  };
  return colors[status] || 'bg-light-secondary';
};

const getCountIcon = (status: string) => {
  const icons: Record<string, string> = {
    'present': 'check',
    'absent': 'cross',
    'pending': 'time',
    'excused': 'information'
  };
  return icons[status] || 'category';
};

const getCountIconColor = (status: string) => {
  const colors: Record<string, string> = {
    'present': 'text-success',
    'absent': 'text-danger',
    'pending': 'text-warning',
    'excused': 'text-info'
  };
  return colors[status] || 'text-secondary';
};

const getCountStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'present': 'Presente',
    'absent': 'Ausente',
    'pending': 'Pendiente',
    'excused': 'Justificado'
  };
  return labels[status] || status;
};

const getWorkStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'active': 'success',
    'inactive': 'secondary',
    'suspended': 'warning',
    'terminated': 'danger'
  };
  return colors[status] || 'secondary';
};

const getOperationTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'lockdown': 'bg-light-danger',
    'evacuation': 'bg-light-warning',
    'transport': 'bg-light-info',
    'search': 'bg-light-primary',
    'medical_emergency': 'bg-light-danger'
  };
  return colors[type] || 'bg-light-warning';
};

const getOperationIcon = (type: string) => {
  const icons: Record<string, string> = {
    'lockdown': 'security-check',
    'evacuation': 'exit-right',
    'transport': 'truck',
    'search': 'magnifier',
    'medical_emergency': 'rescue'
  };
  return icons[type] || 'notification-status';
};

const getOperationIconColor = (type: string) => {
  const colors: Record<string, string> = {
    'lockdown': 'text-danger',
    'evacuation': 'text-warning',
    'transport': 'text-info',
    'search': 'text-primary',
    'medical_emergency': 'text-danger'
  };
  return colors[type] || 'text-warning';
};

const getOperationStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'scheduled': 'info',
    'active': 'warning',
    'completed': 'success',
    'cancelled': 'danger'
  };
  return colors[status] || 'secondary';
};

const getNextCountTime = () => {
  const now = new Date();
  const hour = now.getHours();
  
  if (hour < 6) return '06:00';
  if (hour < 12) return '12:00';
  if (hour < 18) return '18:00';
  if (hour < 21) return '21:00';
  return '06:00 (mañana)';
};

const fetchOperationsData = async () => {
  loadingProfile.value = true;
  try {
    // TODO: Uncomment when API endpoints are ready
    // const statsResponse = await ApiService.get(`/inmates/${props.inmate.id}/operations-stats`);
    // operationsStats.value = statsResponse.data.data || {};
    
    // TODO: Fetch different operations data when endpoints are ready
    // const [transfersRes, countsRes, workRes, operationsRes] = await Promise.all([
    //   ApiService.get(`/inmates/${props.inmate.id}/transfers?recent=true&limit=5`),
    //   ApiService.get(`/inmates/${props.inmate.id}/daily-counts?today=true`),
    //   ApiService.get(`/inmates/${props.inmate.id}/work-assignments?active=true&limit=3`),
    //   ApiService.get(`/inmates/${props.inmate.id}/special-operations?recent=true&limit=5`)
    // ]);
    
    // Temporary mock data
    operationsStats.value = {
      total_transfers: 0,
      days_in_location: 0,
      daily_count_status: 'presente',
      work_assignment: null,
      pending_transfers: 0,
      special_ops_active: 0
    };
    
    transferHistory.value = [];
    dailyCounts.value = [];
    workAssignments.value = [];
    specialOperations.value = [];
    
  } catch (error) {
    console.error('Error fetching operations data:', error);
    // Set default values in case of error
    operationsStats.value = {
      total_transfers: 0,
      days_in_current_location: 0,
      daily_count_status: 'pending',
      has_work_assignment: false,
      pending_transfer: false,
      missing_daily_count: false,
      work_attendance_low: false
    };
  } finally {
    loadingProfile.value = false;
  }
};

const openOperationsSummaryModal = async () => {
  await Swal.fire({
    title: 'Actualizar Resumen de Operaciones',
    text: 'Esta funcionalidad estará disponible próximamente',
    icon: 'info'
  });
};

// Lifecycle
onMounted(() => {
  fetchOperationsData();
});
</script>