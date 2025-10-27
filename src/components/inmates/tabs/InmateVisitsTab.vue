<template>
  <div class="d-flex flex-column gap-7">
    <!--begin::Visits Overview Card-->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label fw-bold text-gray-900">Resumen de Visitas</span>
          <span class="text-muted mt-1 fw-semibold fs-7">Control de visitantes y registro biométrico</span>
        </h3>
        <div class="card-toolbar">
          <button
            v-if="canEdit"
            type="button"
            class="btn btn-sm btn-light-primary"
            @click="openVisitSummaryModal"
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
          <!--begin::Total Visits-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Total Visitas</span>
              <span class="fs-5 fw-bold text-primary">
                {{ visitStats.total_visits || 0 }}
              </span>
            </div>
          </div>
          <!--end::Total Visits-->
          
          <!--begin::Last Visit-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Última Visita</span>
              <span class="fs-5 fw-bold text-gray-900">
                {{ visitStats.last_visit ? formatDate(visitStats.last_visit) : 'Sin visitas' }}
              </span>
            </div>
          </div>
          <!--end::Last Visit-->
          
          <!--begin::Authorized Visitors-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Visitantes Autorizados</span>
              <span class="fs-5 fw-bold text-success">
                {{ visitStats.authorized_visitors || 0 }}
              </span>
            </div>
          </div>
          <!--end::Authorized Visitors-->
          
          <!--begin::Visit Restrictions-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Restricciones</span>
              <span class="fs-5 fw-bold" :class="visitStats.has_restrictions ? 'text-warning' : 'text-success'">
                {{ visitStats.has_restrictions ? 'Con restricciones' : 'Sin restricciones' }}
              </span>
            </div>
          </div>
          <!--end::Visit Restrictions-->
        </div>
        
        <!--begin::Visit Alerts-->
        <div v-if="visitAlerts.length > 0" class="mt-6">
          <h6 class="text-warning fw-bold mb-3">
            <i class="ki-duotone ki-security-user fs-2 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Alertas de Visitas
          </h6>
          <div class="row g-3">
            <div v-for="alert in visitAlerts" :key="alert.id" class="col-md-6">
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
        <!--end::Visit Alerts-->
      </div>
    </div>
    <!--end::Visits Overview Card-->
    
    <!--begin::Visits Modules Grid-->
    <div class="row g-5">
      <!--begin::Recent Visits-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Visitas Recientes</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/visits/history`"
                class="btn btn-sm btn-light-primary"
              >
                Ver Todas
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="recentVisits.length > 0">
              <div v-for="visit in recentVisits.slice(0, 3)" :key="visit.id" class="d-flex align-items-center mb-4">
                <div class="symbol symbol-40px me-3">
                  <div class="symbol-label bg-light-primary">
                    <i class="ki-duotone ki-user fs-2 text-primary">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ visit.visitor_name }}</div>
                  <div class="text-muted fs-7">{{ visit.relationship }}</div>
                  <div class="text-muted fs-8">{{ formatDateTime(visit.visit_date) }}</div>
                </div>
                <span class="badge badge-light-success">{{ visit.duration }}min</span>
              </div>
              <div v-if="recentVisits.length > 3" class="text-center mt-3">
                <span class="text-muted fs-7">+{{ recentVisits.length - 3 }} más</span>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-user-tick fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
              <div class="text-muted mt-3">Sin visitas registradas</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Recent Visits-->
      
      <!--begin::Authorized Visitors-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Visitantes Autorizados</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/visits/visitors`"
                class="btn btn-sm btn-light-success"
              >
                <i class="ki-duotone ki-plus fs-2"></i>
                Registrar
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="authorizedVisitors.length > 0">
              <div v-for="visitor in authorizedVisitors.slice(0, 3)" :key="visitor.id" class="d-flex align-items-center mb-4">
                <div class="symbol symbol-40px me-3">
                  <div class="symbol-label bg-light-success">
                    <i class="ki-duotone ki-people fs-2 text-success">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                      <span class="path5"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ visitor.name }}</div>
                  <div class="text-muted fs-7">{{ visitor.relationship }}</div>
                  <div class="text-muted fs-8">{{ visitor.document_number }}</div>
                </div>
                <span v-if="visitor.has_biometric" class="badge badge-light-info">
                  <i class="ki-duotone ki-fingerprint fs-6 me-1">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                    <span class="path4"></span>
                    <span class="path5"></span>
                  </i>
                  Biométrico
                </span>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-people fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
                <span class="path5"></span>
              </i>
              <div class="text-muted mt-3">Sin visitantes autorizados</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Authorized Visitors-->
      
      <!--begin::Visit Requests-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Solicitudes de Visita</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/visits/requests`"
                class="btn btn-sm btn-light-warning"
              >
                Ver Pendientes
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="visitRequests.length > 0">
              <div v-for="request in visitRequests.slice(0, 2)" :key="request.id" class="d-flex align-items-center mb-4">
                <div class="symbol symbol-40px me-3">
                  <div class="symbol-label bg-light-warning">
                    <i class="ki-duotone ki-calendar-add fs-2 text-warning">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                      <span class="path5"></span>
                      <span class="path6"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ request.visitor_name }}</div>
                  <div class="text-muted fs-7">Solicitado: {{ formatDate(request.request_date) }}</div>
                  <div class="text-muted fs-8">{{ request.visit_type }}</div>
                </div>
                <span :class="`badge badge-light-${getRequestStatusColor(request.status)}`">
                  {{ request.status }}
                </span>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-calendar-search fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
                <span class="path5"></span>
                <span class="path6"></span>
              </i>
              <div class="text-muted mt-3">Sin solicitudes pendientes</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Visit Requests-->
      
      <!--begin::Visit Statistics-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Estadísticas de Visitas</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/visits/statistics`"
                class="btn btn-sm btn-light-info"
              >
                Ver Reportes
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-6">
                <div class="border border-gray-300 border-dashed rounded p-3 mb-3">
                  <div class="fs-2hx fw-bold text-primary">{{ visitStats.monthly_visits || 0 }}</div>
                  <div class="fs-7 fw-semibold text-muted">Este Mes</div>
                </div>
              </div>
              <div class="col-6">
                <div class="border border-gray-300 border-dashed rounded p-3 mb-3">
                  <div class="fs-2hx fw-bold text-success">{{ visitStats.family_visits || 0 }}</div>
                  <div class="fs-7 fw-semibold text-muted">Familiares</div>
                </div>
              </div>
              <div class="col-6">
                <div class="border border-gray-300 border-dashed rounded p-3 mb-3">
                  <div class="fs-2hx fw-bold text-info">{{ visitStats.legal_visits || 0 }}</div>
                  <div class="fs-7 fw-semibold text-muted">Legales</div>
                </div>
              </div>
              <div class="col-6">
                <div class="border border-gray-300 border-dashed rounded p-3 mb-3">
                  <div class="fs-2hx fw-bold text-warning">{{ visitStats.average_duration || 0 }}</div>
                  <div class="fs-7 fw-semibold text-muted">Min Promedio</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Visit Statistics-->
    </div>
    <!--end::Visits Modules Grid-->
    
    <!--begin::Quick Actions-->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Acciones Rápidas</h3>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/visits/schedule`"
              class="btn btn-flex btn-light-primary w-100 py-4"
            >
              <i class="ki-duotone ki-calendar-add fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
                <span class="path5"></span>
                <span class="path6"></span>
              </i>
              <span class="fw-bold">Programar Visita</span>
            </router-link>
          </div>
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/visits/visitor-registry`"
              class="btn btn-flex btn-light-success w-100 py-4"
            >
              <i class="ki-duotone ki-address-book fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
              <span class="fw-bold">Registro Visitantes</span>
            </router-link>
          </div>
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/visits/biometric`"
              class="btn btn-flex btn-light-info w-100 py-4"
            >
              <i class="ki-duotone ki-fingerprint fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
                <span class="path5"></span>
              </i>
              <span class="fw-bold">Acceso Biométrico</span>
            </router-link>
          </div>
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/visits/reports`"
              class="btn btn-flex btn-light-warning w-100 py-4"
            >
              <i class="ki-duotone ki-chart-simple fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
              <span class="fw-bold">Reportes</span>
            </router-link>
          </div>
        </div>
        
        <div class="separator my-5"></div>
        
        <div class="row g-3">
          <div class="col-md-4">
            <router-link 
              :to="`/inmates/${inmate.id}/visits/restrictions`"
              class="btn btn-flex btn-light w-100 py-3"
            >
              <i class="ki-duotone ki-security-user fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span>Restricciones</span>
            </router-link>
          </div>
          <div class="col-md-4">
            <router-link 
              :to="`/inmates/${inmate.id}/visits/correspondence`"
              class="btn btn-flex btn-light w-100 py-3"
            >
              <i class="ki-duotone ki-sms fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span>Correspondencia</span>
            </router-link>
          </div>
          <div class="col-md-4">
            <router-link 
              :to="`/inmates/${inmate.id}/visits/monitoring`"
              class="btn btn-flex btn-light w-100 py-3"
            >
              <i class="ki-duotone ki-security-check fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
              <span>Monitoreo</span>
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
const visitStats = ref<any>({});
const recentVisits = ref<any[]>([]);
const authorizedVisitors = ref<any[]>([]);
const visitRequests = ref<any[]>([]);
const loadingProfile = ref(false);

// Computed
const canEdit = computed(() => authStore.hasPermission('visits.manage'));

const visitAlerts = computed(() => {
  const alerts = [];
  
  if (visitStats.value?.has_restrictions) {
    alerts.push({
      id: 'visit_restrictions',
      severity: 'warning',
      icon: 'security-user',
      title: 'Restricciones de Visita',
      description: 'Este interno tiene restricciones especiales para visitas'
    });
  }
  
  if (visitStats.value?.pending_requests > 5) {
    alerts.push({
      id: 'many_requests',
      severity: 'info',
      icon: 'calendar-search',
      title: 'Muchas Solicitudes Pendientes',
      description: `${visitStats.value.pending_requests} solicitudes requieren atención`
    });
  }
  
  return alerts;
});

// Methods
const getRequestStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'pendiente': 'warning',
    'aprobada': 'success',
    'rechazada': 'danger',
    'programada': 'info'
  };
  return colors[status] || 'secondary';
};

const fetchVisitData = async () => {
  loadingProfile.value = true;
  try {
    // Fetch visit data from organized endpoint
    const visitsResponse = await ApiService.get(`/inmates/${props.inmate.id}/data/visits`);
    const visitsData = visitsResponse.data.data;

    // Set visitor relationships
    if (visitsData.visitor_relationships && visitsData.visitor_relationships.length > 0) {
      authorizedVisitors.value = visitsData.visitor_relationships.map((rel: any) => ({
        id: rel.id,
        name: rel.visitor_full_name || `${rel.visitor_first_name} ${rel.visitor_first_surname}`,
        relationship: rel.relationship_type?.name || 'No especificado',
        document_number: rel.visitor_document_number,
        has_biometric: rel.visitor_biometric_status === 'enrolled'
      }));
    } else {
      authorizedVisitors.value = [];
    }

    // Set recent visits
    if (visitsData.recent_visits && visitsData.recent_visits.length > 0) {
      recentVisits.value = visitsData.recent_visits.map((visit: any) => ({
        id: visit.id,
        visitor_name: 'Visitante',  // TODO: Need to join with visitor_relationship to get name
        relationship: visit.visit_type?.name || 'No especificado',
        visit_date: visit.requested_visit_date,
        duration: visit.duration_minutes || 0
      }));
    } else {
      recentVisits.value = [];
    }

    // Set upcoming visits as pending requests
    if (visitsData.upcoming_visits && visitsData.upcoming_visits.length > 0) {
      visitRequests.value = visitsData.upcoming_visits.map((visit: any) => ({
        id: visit.id,
        visitor_name: 'Visitante',  // TODO: Need to join with visitor_relationship to get name
        request_date: visit.created_at,
        visit_type: visit.visit_type?.name || 'Visita familiar',
        status: 'aprobada'
      }));
    } else {
      visitRequests.value = [];
    }

    // Calculate visit statistics
    visitStats.value = {
      total_visits: recentVisits.value.length,
      authorized_visitors: authorizedVisitors.value.length,
      monthly_visits: recentVisits.value.length,
      family_visits: recentVisits.value.filter(v => v.relationship?.includes('Familia')).length,
      legal_visits: recentVisits.value.filter(v => v.relationship?.includes('Legal')).length,
      average_duration: recentVisits.value.length > 0
        ? Math.round(recentVisits.value.reduce((sum, v) => sum + v.duration, 0) / recentVisits.value.length)
        : 0,
      has_restrictions: false,
      pending_requests: visitRequests.value.length,
      last_visit: recentVisits.value.length > 0 ? recentVisits.value[0].visit_date : null
    };

  } catch (error) {
    console.error('Error fetching visit data:', error);
    // Set default empty values on error
    visitStats.value = {
      total_visits: 0,
      authorized_visitors: 0,
      monthly_visits: 0,
      family_visits: 0,
      legal_visits: 0,
      average_duration: 0,
      has_restrictions: false,
      pending_requests: 0
    };
    recentVisits.value = [];
    authorizedVisitors.value = [];
    visitRequests.value = [];
  } finally {
    loadingProfile.value = false;
  }
};

const openVisitSummaryModal = async () => {
  await Swal.fire({
    title: 'Actualizar Resumen de Visitas',
    text: 'Esta funcionalidad estará disponible próximamente',
    icon: 'info'
  });
};

// Lifecycle
onMounted(() => {
  fetchVisitData();
});
</script>