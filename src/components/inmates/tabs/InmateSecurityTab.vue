<template>
  <div class="d-flex flex-column gap-7">
    <!--begin::Security Overview Card-->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label fw-bold text-gray-900">Resumen de Seguridad</span>
          <span class="text-muted mt-1 fw-semibold fs-7">Clasificación de riesgo y alertas de seguridad</span>
        </h3>
        <div class="card-toolbar">
          <button
            v-if="canEdit"
            type="button"
            class="btn btn-sm btn-light-primary"
            @click="openSecurityModal"
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
          <!--begin::Risk Level-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Nivel de Riesgo</span>
              <span class="fs-5 fw-bold" :class="getRiskLevelClass(securityProfile?.risk_level)">
                {{ getRiskLevelLabel(securityProfile?.risk_level) || 'No evaluado' }}
              </span>
            </div>
          </div>
          <!--end::Risk Level-->
          
          <!--begin::Security Phase-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Fase de Seguridad</span>
              <span class="fs-5 fw-bold text-gray-900">
                {{ securityProfile?.security_phase || 'No asignada' }}
              </span>
            </div>
          </div>
          <!--end::Security Phase-->
          
          <!--begin::Gang Affiliation-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Afiliación Pandilleril</span>
              <span class="fs-5 fw-bold" :class="securityProfile?.gang_affiliation ? 'text-danger' : 'text-success'">
                {{ securityProfile?.gang_affiliation || 'Ninguna' }}
              </span>
            </div>
          </div>
          <!--end::Gang Affiliation-->
          
          <!--begin::Last Incident-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Último Incidente</span>
              <span class="fs-5 fw-bold text-gray-900">
                {{ lastIncident ? formatDate(lastIncident.date) : 'Sin incidentes' }}
              </span>
            </div>
          </div>
          <!--end::Last Incident-->
        </div>
        
        <!--begin::Security Alerts-->
        <div v-if="securityAlerts.length > 0" class="mt-6">
          <h6 class="text-danger fw-bold mb-3">
            <i class="ki-duotone ki-shield-cross fs-2 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Alertas de Seguridad Activas
          </h6>
          <div class="row g-3">
            <div v-for="alert in securityAlerts" :key="alert.id" class="col-md-6">
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
        <!--end::Security Alerts-->
      </div>
    </div>
    <!--end::Security Overview Card-->
    
    <!--begin::Security Modules Grid-->
    <div class="row g-5">
      <!--begin::Recent Incidents-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Incidentes Recientes</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/security/incidents`"
                class="btn btn-sm btn-light-primary"
              >
                Ver Todos
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="recentIncidents.length > 0">
              <div v-for="incident in recentIncidents.slice(0, 3)" :key="incident.id" class="d-flex align-items-center mb-4">
                <div class="symbol symbol-40px me-3">
                  <div class="symbol-label" :class="`bg-light-${getIncidentSeverityColor(incident.severity)}`">
                    <i :class="`ki-duotone ki-warning fs-2 text-${getIncidentSeverityColor(incident.severity)}`">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ incident.type }}</div>
                  <div class="text-muted fs-7">{{ formatDate(incident.date) }} - {{ incident.location }}</div>
                </div>
                <span :class="`badge badge-light-${getIncidentSeverityColor(incident.severity)}`">
                  {{ incident.severity }}
                </span>
              </div>
              <div v-if="recentIncidents.length > 3" class="text-center mt-3">
                <span class="text-muted fs-7">+{{ recentIncidents.length - 3 }} más</span>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-shield-tick fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="text-muted mt-3">Sin incidentes registrados</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Recent Incidents-->
      
      <!--begin::Gang Information-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Información Pandilleril</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/security/gangs`"
                class="btn btn-sm btn-light-danger"
              >
                Gestionar
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="gangInfo">
              <div class="d-flex align-items-center mb-4">
                <div class="symbol symbol-50px me-3">
                  <div class="symbol-label bg-light-danger">
                    <i class="ki-duotone ki-user-tick fs-2 text-danger">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ gangInfo.name }}</div>
                  <div class="text-muted fs-7">Rol: {{ gangInfo.role || 'Miembro' }}</div>
                  <div class="text-muted fs-8">Desde: {{ formatDate(gangInfo.since) }}</div>
                </div>
                <span class="badge badge-light-danger">Activo</span>
              </div>
              
              <div class="separator my-4"></div>
              
              <div class="row g-3">
                <div class="col-6">
                  <span class="text-muted d-block mb-2">Nivel de Amenaza</span>
                  <span class="badge badge-light-danger">{{ gangInfo.threat_level || 'Alto' }}</span>
                </div>
                <div class="col-6">
                  <span class="text-muted d-block mb-2">Enemigos Conocidos</span>
                  <span class="fw-bold">{{ gangInfo.known_enemies || 0 }}</span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-user fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="text-muted mt-3">Sin afiliación pandilleril</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Gang Information-->
      
      <!--begin::Communication Monitoring-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Monitoreo de Comunicaciones</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/security/communications`"
                class="btn btn-sm btn-light-primary"
              >
                Ver Detalles
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div class="row g-4">
              <div class="col-6">
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-40px me-3">
                    <div class="symbol-label bg-light-info">
                      <i class="ki-duotone ki-phone fs-2 text-info">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </div>
                  </div>
                  <div>
                    <div class="fw-bold text-gray-900">{{ communicationStats.calls || 0 }}</div>
                    <div class="text-muted fs-7">Llamadas/mes</div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-40px me-3">
                    <div class="symbol-label bg-light-warning">
                      <i class="ki-duotone ki-message-text fs-2 text-warning">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </div>
                  </div>
                  <div>
                    <div class="fw-bold text-gray-900">{{ communicationStats.visits || 0 }}</div>
                    <div class="text-muted fs-7">Visitas/mes</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="separator my-4"></div>
            
            <div class="d-flex justify-content-between align-items-center">
              <span class="text-muted">Restricciones:</span>
              <span class="fw-bold" :class="communicationRestrictions ? 'text-danger' : 'text-success'">
                {{ communicationRestrictions || 'Ninguna' }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <!--end::Communication Monitoring-->
      
      <!--begin::Disciplinary Actions-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Sanciones Disciplinarias</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/security/sanctions`"
                class="btn btn-sm btn-light-primary"
              >
                Ver Historial
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="activeSanctions.length > 0">
              <div v-for="sanction in activeSanctions.slice(0, 2)" :key="sanction.id" class="mb-4">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <div class="fw-bold text-gray-900">{{ sanction.type }}</div>
                    <div class="text-muted fs-7">{{ sanction.reason }}</div>
                    <div class="text-muted fs-8">Hasta: {{ formatDate(sanction.end_date) }}</div>
                  </div>
                  <span class="badge badge-light-danger">Activa</span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-award fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="text-muted mt-3">Sin sanciones activas</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Disciplinary Actions-->
    </div>
    <!--end::Security Modules Grid-->
    
    <!--begin::Quick Actions-->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Acciones Rápidas</h3>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/security/classification`"
              class="btn btn-flex btn-light-danger w-100 py-4"
            >
              <i class="ki-duotone ki-security-user fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Clasificación</span>
            </router-link>
          </div>
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/security/report-incident`"
              class="btn btn-flex btn-light-warning w-100 py-4"
            >
              <i class="ki-duotone ki-warning-2 fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Reportar Incidente</span>
            </router-link>
          </div>
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/security/monitoring`"
              class="btn btn-flex btn-light-info w-100 py-4"
            >
              <i class="ki-duotone ki-eye fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Monitoreo</span>
            </router-link>
          </div>
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/security/alerts`"
              class="btn btn-flex btn-light-primary w-100 py-4"
            >
              <i class="ki-duotone ki-notification fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Alertas</span>
            </router-link>
          </div>
        </div>
        
        <div class="separator my-5"></div>
        
        <div class="row g-3">
          <div class="col-md-4">
            <router-link 
              :to="`/inmates/${inmate.id}/security/cell-searches`"
              class="btn btn-flex btn-light w-100 py-3"
            >
              <i class="ki-duotone ki-search-list fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span>Requisas</span>
            </router-link>
          </div>
          <div class="col-md-4">
            <router-link 
              :to="`/inmates/${inmate.id}/security/behavior`"
              class="btn btn-flex btn-light w-100 py-3"
            >
              <i class="ki-duotone ki-user-tick fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span>Comportamiento</span>
            </router-link>
          </div>
          <div class="col-md-4">
            <router-link 
              :to="`/inmates/${inmate.id}/security/reports`"
              class="btn btn-flex btn-light w-100 py-3"
            >
              <i class="ki-duotone ki-document fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span>Reportes de Seguridad</span>
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
import { formatDate } from '@/core/helpers/formatters';

// Props
interface Props {
  inmate: any;
}

const props = defineProps<Props>();

// Stores
const authStore = useAuthStore();

// State
const securityProfile = ref<any>(null);
const recentIncidents = ref<any[]>([]);
const gangInfo = ref<any>(null);
const activeSanctions = ref<any[]>([]);
const communicationStats = ref<any>({});
const communicationRestrictions = ref<string>('');
const lastIncident = ref<any>(null);
const loadingProfile = ref(false);

// Computed
const canEdit = computed(() => authStore.hasPermission('security.classifications'));

const securityAlerts = computed(() => {
  const alerts = [];
  
  // High risk level alert
  if (securityProfile.value?.risk_level === 'high' || securityProfile.value?.risk_level === 'maximum') {
    alerts.push({
      id: 'high_risk',
      severity: 'danger',
      icon: 'shield-cross',
      title: 'Alto Riesgo de Seguridad',
      description: 'Requiere supervisión constante y medidas especiales'
    });
  }
  
  // Gang affiliation alert
  if (gangInfo.value) {
    alerts.push({
      id: 'gang_member',
      severity: 'warning',
      icon: 'user-tick',
      title: 'Miembro de Pandilla',
      description: `Afiliado a ${gangInfo.value.name} - Monitoreo de enemigos activo`
    });
  }
  
  // Recent incident alert
  if (recentIncidents.value.length > 0) {
    const lastWeekIncidents = recentIncidents.value.filter(incident => {
      const incidentDate = new Date(incident.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return incidentDate > weekAgo;
    });
    
    if (lastWeekIncidents.length > 0) {
      alerts.push({
        id: 'recent_incidents',
        severity: 'info',
        icon: 'warning',
        title: 'Incidentes Recientes',
        description: `${lastWeekIncidents.length} incidente(s) en los últimos 7 días`
      });
    }
  }
  
  // Escape risk alert
  if (securityProfile.value?.escape_risk) {
    alerts.push({
      id: 'escape_risk',
      severity: 'danger',
      icon: 'exit-right',
      title: 'Riesgo de Fuga',
      description: 'Historial o indicadores de intento de fuga'
    });
  }
  
  return alerts;
});

// Methods
const getRiskLevelLabel = (level: string) => {
  const levels: Record<string, string> = {
    'low': 'Bajo',
    'medium': 'Medio',
    'high': 'Alto',
    'maximum': 'Máximo'
  };
  return levels[level] || level;
};

const getRiskLevelClass = (level: string) => {
  const classes: Record<string, string> = {
    'minimum': 'text-success',
    'low': 'text-primary',
    'medium': 'text-warning',
    'high': 'text-danger',
    'maximum': 'text-danger fw-bold'
  };
  return classes[level] || 'text-muted';
};

const getIncidentSeverityColor = (severity: string) => {
  const colors: Record<string, string> = {
    'minor': 'info',
    'moderate': 'warning',
    'serious': 'danger',
    'critical': 'danger'
  };
  return colors[severity] || 'secondary';
};

const fetchSecurityData = async () => {
  loadingProfile.value = true;
  try {

    // Use data already loaded from InmateController show() method
    // Backend returns snake_case keys
    // Set security classification from loaded data
    if (props.inmate.current_security_classification) {
      const classification = props.inmate.current_security_classification.classification || props.inmate.current_security_classification;
      securityProfile.value = {
        risk_level: classification.risk_level || props.inmate.risk_classification?.name?.toLowerCase() || props.inmate.security_level || 'low',
        security_phase: classification.security_phase || 'Fase 1',
        gang_affiliation: props.inmate.current_gang_affiliation?.gang?.name || props.inmate.current_gang_affiliation?.gang_name || null,
        escape_risk: classification.escape_risk || false,
        communication_restrictions: classification.communication_restrictions || null,
        violence_risk_score: classification.violence_risk_score || 0,
        escape_risk_score: classification.escape_risk_score || 0,
        corruption_risk_score: classification.corruption_risk_score || 0,
        overall_risk_score: classification.overall_risk_score || 0
      };
    } else {
      securityProfile.value = {
        risk_level: props.inmate.risk_classification?.name?.toLowerCase() || props.inmate.security_level || 'low',
        security_phase: 'Fase 1',
        gang_affiliation: props.inmate.current_gang_affiliation?.gang?.name || props.inmate.current_gang_affiliation?.gang_name || null,
        escape_risk: false,
        communication_restrictions: null
      };
    }

    // Set gang information from loaded data (using snake_case)
    if (props.inmate.current_gang_affiliation) {
      const affiliation = props.inmate.current_gang_affiliation;
      gangInfo.value = {
        name: affiliation.gang?.name || affiliation.gang_name || 'Desconocido',
        role: affiliation.role || affiliation.affiliation_level || 'Miembro',
        since: affiliation.affiliation_date || affiliation.start_date,
        threat_level: affiliation.threat_level || 'Alto',
        known_enemies: affiliation.known_enemies_count || 0
      };
    } else {
      gangInfo.value = null;
    }

    // Set recent incidents from loaded data (using snake_case)
    if (props.inmate.security_incidents && props.inmate.security_incidents.length > 0) {
      recentIncidents.value = props.inmate.security_incidents
        .sort((a: any, b: any) => new Date(b.incident_date).getTime() - new Date(a.incident_date).getTime())
        .map((item: any) => ({
          id: item.id,
          type: item.incidentType?.name || item.incident_type || 'Incidente',
          description: item.description,
          date: item.incident_date,
          location: item.location,
          severity: item.severity
        }));

      lastIncident.value = {
        date: recentIncidents.value[0].date,
        type: recentIncidents.value[0].type
      };
    } else {
      recentIncidents.value = [];
      lastIncident.value = null;
    }

    // Set active sanctions from loaded data (using snake_case)
    if (props.inmate.disciplinary_sanctions && props.inmate.disciplinary_sanctions.length > 0) {
      activeSanctions.value = props.inmate.disciplinary_sanctions
        .filter((sanction: any) => sanction.is_active || sanction.status === 'active')
        .map((sanction: any) => ({
          id: sanction.id,
          type: sanction.sanctionType?.name || sanction.sanction_type || 'Sanción',
          reason: sanction.reason || 'N/A',
          end_date: sanction.end_date
        }));
    } else {
      activeSanctions.value = [];
    }

    // Communication stats and restrictions
    communicationStats.value = { calls: 0, visits: 0 };
    communicationRestrictions.value = securityProfile.value.communication_restrictions || '';

  } catch (error) {
    console.error('Error processing security data:', error);
    // Set default values on error
    securityProfile.value = {
      risk_level: 'unknown',
      security_phase: 'No asignado',
      gang_affiliation: null,
      escape_risk: false,
      communication_restrictions: null
    };
    recentIncidents.value = [];
    gangInfo.value = null;
    activeSanctions.value = [];
    communicationStats.value = { calls: 0, visits: 0 };
    lastIncident.value = null;
    communicationRestrictions.value = '';
  } finally {
    loadingProfile.value = false;
  }
};

const openSecurityModal = async () => {
  // Implementation for updating security profile
  await Swal.fire({
    title: 'Actualizar Clasificación de Seguridad',
    text: 'Esta funcionalidad estará disponible próximamente',
    icon: 'info'
  });
};

// Lifecycle
onMounted(() => {
  fetchSecurityData();
});
</script>