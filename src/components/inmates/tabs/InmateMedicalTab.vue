<template>
  <div class="d-flex flex-column gap-7">
    <!--begin::Health Overview Card-->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label fw-bold text-gray-900">Resumen de Salud</span>
          <span class="text-muted mt-1 fw-semibold fs-7">Estado de salud actual y alertas médicas</span>
        </h3>
        <div class="card-toolbar">
          <button
            v-if="canEdit"
            type="button"
            class="btn btn-sm btn-light-primary"
            @click="openHealthSummaryModal"
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
          <!--begin::Health Status-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Estado de Salud</span>
              <span class="fs-5 fw-bold" :class="getHealthStatusClass(medicalProfile?.health_status)">
                {{ getHealthStatusLabel(medicalProfile?.health_status) || 'No evaluado' }}
              </span>
            </div>
          </div>
          <!--end::Health Status-->
          
          <!--begin::Blood Type-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Tipo de Sangre</span>
              <span class="fs-5 fw-bold text-gray-900">
                {{ medicalProfile?.blood_type?.name || 'No registrado' }}
              </span>
            </div>
          </div>
          <!--end::Blood Type-->
          
          <!--begin::Mental Health-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Salud Mental</span>
              <span class="fs-5 fw-bold" :class="getMentalHealthClass(medicalProfile?.mental_health_status)">
                {{ medicalProfile?.mental_health_status?.name || 'No evaluado' }}
              </span>
            </div>
          </div>
          <!--end::Mental Health-->
          
          <!--begin::Mobility-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Movilidad</span>
              <span class="fs-5 fw-bold text-gray-900">
                {{ getMobilityLabel(medicalProfile?.mobility_status) || 'Normal' }}
              </span>
            </div>
          </div>
          <!--end::Mobility-->
        </div>
        
        <!--begin::Medical Alerts-->
        <div v-if="medicalAlerts.length > 0" class="mt-6">
          <h6 class="text-danger fw-bold mb-3">
            <i class="ki-duotone ki-shield-cross fs-2 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Alertas Médicas Activas
          </h6>
          <div class="row g-3">
            <div v-for="alert in medicalAlerts" :key="alert.type" class="col-md-6">
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
        <!--end::Medical Alerts-->
      </div>
    </div>
    <!--end::Health Overview Card-->
    
    <!--begin::Health Modules Grid-->
    <div class="row g-5">
      <!--begin::Chronic Diseases-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Enfermedades Crónicas</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/medical/chronic-diseases`"
                class="btn btn-sm btn-light-primary"
              >
                Ver Detalles
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="chronicDiseases.length > 0">
              <div v-for="disease in chronicDiseases.slice(0, 3)" :key="disease.id" class="d-flex align-items-center mb-4">
                <div class="symbol symbol-40px me-3">
                  <div class="symbol-label bg-light-danger">
                    <i class="ki-duotone ki-pulse fs-2 text-danger">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ disease.name }}</div>
                  <div class="text-muted fs-7">Diagnosticado: {{ formatDate(disease.diagnosed_date) }}</div>
                </div>
                <span :class="`badge badge-light-${disease.controlled ? 'success' : 'warning'}`">
                  {{ disease.controlled ? 'Controlado' : 'En tratamiento' }}
                </span>
              </div>
              <div v-if="chronicDiseases.length > 3" class="text-center mt-3">
                <span class="text-muted fs-7">+{{ chronicDiseases.length - 3 }} más</span>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-heart fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="text-muted mt-3">Sin enfermedades crónicas registradas</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Chronic Diseases-->
      
      <!--begin::Active Treatments-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Tratamientos Activos</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/medical/treatments`"
                class="btn btn-sm btn-light-primary"
              >
                Ver Todos
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="activeTreatments.length > 0">
              <div v-for="treatment in activeTreatments.slice(0, 3)" :key="treatment.id" class="d-flex align-items-center mb-4">
                <div class="symbol symbol-40px me-3">
                  <div class="symbol-label bg-light-primary">
                    <i class="ki-duotone ki-medicine fs-2 text-primary">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ treatment.name }}</div>
                  <div class="text-muted fs-7">{{ treatment.frequency }}</div>
                </div>
                <span class="badge badge-light-primary">{{ treatment.type }}</span>
              </div>
              <div v-if="activeTreatments.length > 3" class="text-center mt-3">
                <span class="text-muted fs-7">+{{ activeTreatments.length - 3 }} más</span>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-medicine fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="text-muted mt-3">Sin tratamientos activos</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Active Treatments-->
      
      <!--begin::Medical Consultations-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Consultas Médicas</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/medical/consultations`"
                class="btn btn-sm btn-light-success"
              >
                <i class="ki-duotone ki-plus fs-2"></i>
                Programar
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="upcomingConsultations.length > 0">
              <h6 class="text-muted mb-3">Próximas Consultas</h6>
              <div v-for="consultation in upcomingConsultations.slice(0, 2)" :key="consultation.id" class="d-flex align-items-center mb-4">
                <div class="symbol symbol-40px me-3">
                  <div class="symbol-label bg-light-info">
                    <i class="ki-duotone ki-calendar fs-2 text-info">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ consultation.specialty }}</div>
                  <div class="text-muted fs-7">{{ formatDateTime(consultation.scheduled_at) }}</div>
                </div>
              </div>
            </div>
            
            <div class="separator my-4"></div>
            
            <div class="d-flex justify-content-between align-items-center">
              <span class="text-muted">Última consulta:</span>
              <span class="fw-bold">{{ lastConsultation ? formatDate(lastConsultation.date) : 'Sin registro' }}</span>
            </div>
          </div>
        </div>
      </div>
      <!--end::Medical Consultations-->
      
      <!--begin::Medications-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Medicamentos</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/medical/prescriptions`"
                class="btn btn-sm btn-light-primary"
              >
                Ver Recetas
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="activeMedications.length > 0">
              <div v-for="medication in activeMedications.slice(0, 3)" :key="medication.id" class="d-flex align-items-center mb-4">
                <div class="symbol symbol-40px me-3">
                  <div class="symbol-label bg-light-warning">
                    <i class="ki-duotone ki-pill fs-2 text-warning">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ medication.name }}</div>
                  <div class="text-muted fs-7">{{ medication.dosage }} - {{ medication.frequency }}</div>
                </div>
                <span v-if="medication.is_controlled" class="badge badge-light-danger">Controlado</span>
              </div>
              <div v-if="activeMedications.length > 3" class="text-center mt-3">
                <span class="text-muted fs-7">+{{ activeMedications.length - 3 }} más</span>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-pill fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="text-muted mt-3">Sin medicamentos activos</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Medications-->
    </div>
    <!--end::Health Modules Grid-->
    
    <!--begin::Quick Actions-->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Acciones Rápidas</h3>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/medical/vital-signs`"
              class="btn btn-flex btn-light-primary w-100 py-4"
            >
              <i class="ki-duotone ki-heart-circle fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Signos Vitales</span>
            </router-link>
          </div>
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/medical/vaccinations`"
              class="btn btn-flex btn-light-info w-100 py-4"
            >
              <i class="ki-duotone ki-syringe fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Vacunación</span>
            </router-link>
          </div>
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/medical/allergies`"
              class="btn btn-flex btn-light-warning w-100 py-4"
            >
              <i class="ki-duotone ki-shield-cross fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Alergias</span>
            </router-link>
          </div>
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/medical/emergency`"
              class="btn btn-flex btn-light-danger w-100 py-4"
            >
              <i class="ki-duotone ki-rescue fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Emergencias</span>
            </router-link>
          </div>
        </div>
        
        <div class="separator my-5"></div>
        
        <div class="row g-3">
          <div class="col-md-4">
            <router-link 
              :to="`/inmates/${inmate.id}/medical/disabilities`"
              class="btn btn-flex btn-light w-100 py-3"
            >
              <i class="ki-duotone ki-wheelchair fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span>Discapacidades</span>
            </router-link>
          </div>
          <div class="col-md-4">
            <router-link 
              :to="`/inmates/${inmate.id}/medical/mental-health`"
              class="btn btn-flex btn-light w-100 py-3"
            >
              <i class="ki-duotone ki-user-tick fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span>Salud Mental</span>
            </router-link>
          </div>
          <div class="col-md-4">
            <router-link 
              :to="`/inmates/${inmate.id}/medical/reports`"
              class="btn btn-flex btn-light w-100 py-3"
            >
              <i class="ki-duotone ki-document fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span>Reportes Médicos</span>
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
const medicalProfile = ref<any>(null);
const chronicDiseases = ref<any[]>([]);
const activeTreatments = ref<any[]>([]);
const upcomingConsultations = ref<any[]>([]);
const activeMedications = ref<any[]>([]);
const lastConsultation = ref<any>(null);
const loadingProfile = ref(false);

// Computed
const canEdit = computed(() => authStore.hasPermission('medical.profiles'));

const medicalAlerts = computed(() => {
  const alerts = [];
  
  if (medicalProfile.value?.requires_special_medical_attention) {
    alerts.push({
      type: 'special_attention',
      severity: 'danger',
      icon: 'shield-cross',
      title: 'Requiere Atención Especial',
      description: 'Este interno requiere supervisión médica especial'
    });
  }
  
  if (medicalProfile.value?.suicide_risk) {
    alerts.push({
      type: 'suicide_risk',
      severity: 'danger',
      icon: 'ghost',
      title: 'Riesgo de Suicidio',
      description: 'Evaluación y monitoreo psiquiátrico requerido'
    });
  }
  
  if (medicalProfile.value?.has_infectious_disease) {
    alerts.push({
      type: 'infectious',
      severity: 'warning',
      icon: 'virus',
      title: 'Enfermedad Infecciosa',
      description: 'Requiere medidas de aislamiento y bioseguridad'
    });
  }
  
  if (medicalProfile.value?.requires_psychiatric_medication) {
    alerts.push({
      type: 'psychiatric',
      severity: 'info',
      icon: 'capsule',
      title: 'Medicación Psiquiátrica',
      description: 'Administración supervisada de medicamentos'
    });
  }
  
  return alerts;
});

// Methods
const getHealthStatusLabel = (status: string) => {
  const statuses: Record<string, string> = {
    'excellent': 'Excelente',
    'good': 'Bueno',
    'fair': 'Regular',
    'poor': 'Malo',
    'critical': 'Crítico'
  };
  return statuses[status] || status;
};

const getHealthStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'excellent': 'text-success',
    'good': 'text-primary',
    'fair': 'text-warning',
    'poor': 'text-danger',
    'critical': 'text-danger fw-bold'
  };
  return classes[status] || 'text-muted';
};

const getMentalHealthClass = (status: any) => {
  if (!status) return 'text-muted';
  if (status.name?.includes('Estable')) return 'text-success';
  if (status.name?.includes('Tratamiento')) return 'text-warning';
  if (status.name?.includes('Crisis')) return 'text-danger';
  return 'text-primary';
};

const getMobilityLabel = (status: string) => {
  const statuses: Record<string, string> = {
    'normal': 'Normal',
    'limited': 'Limitada',
    'wheelchair': 'Silla de ruedas',
    'crutches': 'Muletas',
    'immobile': 'Inmóvil'
  };
  return statuses[status] || status;
};

const fetchMedicalData = async () => {
  loadingProfile.value = true;
  try {
    console.log('Inmate data in medical tab:', props.inmate);

    // Fetch medical data from organized endpoint
    const medicalResponse = await ApiService.get(`/inmates/${props.inmate.id}/data/medical`);
    const medicalData = medicalResponse.data.data;

    // Set medical profile
    if (medicalData.medical_profile) {
      medicalProfile.value = medicalData.medical_profile;
    } else {
      // Set default values if no profile exists
      medicalProfile.value = {
        health_status: 'unknown',
        blood_type: null,
        mental_health_status: null,
        mobility_status: 'normal',
        medical_alerts: null,
        requires_special_medical_attention: false,
        suicide_risk: false,
        has_infectious_disease: false,
        requires_psychiatric_medication: false
      };
    }

    // Set recent consultations if available
    if (medicalData.recent_consultations && medicalData.recent_consultations.length > 0) {
      upcomingConsultations.value = medicalData.recent_consultations;
      lastConsultation.value = {
        date: medicalData.recent_consultations[0].consultation_date,
        doctor: medicalData.recent_consultations[0].doctor?.name
      };
    } else {
      upcomingConsultations.value = [];
      lastConsultation.value = null;
    }

    // For now, set empty arrays for data that doesn't have endpoints yet
    chronicDiseases.value = [];
    activeTreatments.value = [];
    activeMedications.value = [];

  } catch (error) {
    console.error('Error fetching medical data:', error);
    // Set default empty values on error
    medicalProfile.value = {
      health_status: 'unknown',
      blood_type: null,
      mental_health_status: null,
      mobility_status: 'normal'
    };
    chronicDiseases.value = [];
    activeTreatments.value = [];
    upcomingConsultations.value = [];
    activeMedications.value = [];
    lastConsultation.value = null;
  } finally {
    loadingProfile.value = false;
  }
};

const openHealthSummaryModal = async () => {
  try {
    // Load catalogs for dropdowns
    const [bloodTypesResponse, mentalHealthResponse] = await Promise.all([
      ApiService.get('/catalogs/blood-types?simple=true'),
      ApiService.get('/catalogs/mental-health-statuses?simple=true')
    ]);
    
    const bloodTypes = Array.isArray(bloodTypesResponse.data?.data) 
      ? bloodTypesResponse.data.data 
      : (Array.isArray(bloodTypesResponse.data) ? bloodTypesResponse.data : []);
    
    const mentalHealthStatuses = Array.isArray(mentalHealthResponse.data?.data)
      ? mentalHealthResponse.data.data
      : (Array.isArray(mentalHealthResponse.data) ? mentalHealthResponse.data : []);
    
    const currentProfile = medicalProfile.value || {};
    
    // Generate options for blood types
    const bloodTypeOptions = bloodTypes.map((type: any) => 
      `<option value="${type.id}" ${currentProfile.blood_type_id === type.id ? 'selected' : ''}>${type.name}</option>`
    ).join('');
    
    // Generate options for mental health statuses
    const mentalHealthOptions = mentalHealthStatuses.map((status: any) => 
      `<option value="${status.id}" ${currentProfile.mental_health_status_id === status.id ? 'selected' : ''}>${status.name}</option>`
    ).join('');
    
    const result = await Swal.fire({
      title: 'Actualizar Resumen de Salud',
      html: `
        <form id="healthForm" class="text-start">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Tipo de Sangre</label>
              <select id="bloodType" class="form-select">
                <option value="">Seleccionar...</option>
                ${bloodTypeOptions}
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Estado de Salud Mental</label>
              <select id="mentalHealth" class="form-select">
                <option value="">Seleccionar...</option>
                ${mentalHealthOptions}
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Estado de Salud</label>
              <select id="healthStatus" class="form-select">
                <option value="">Seleccionar...</option>
                <option value="excellent" ${currentProfile.health_status === 'excellent' ? 'selected' : ''}>Excelente</option>
                <option value="good" ${currentProfile.health_status === 'good' ? 'selected' : ''}>Bueno</option>
                <option value="fair" ${currentProfile.health_status === 'fair' ? 'selected' : ''}>Regular</option>
                <option value="poor" ${currentProfile.health_status === 'poor' ? 'selected' : ''}>Malo</option>
                <option value="critical" ${currentProfile.health_status === 'critical' ? 'selected' : ''}>Crítico</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Estado de Movilidad</label>
              <select id="mobilityStatus" class="form-select">
                <option value="">Seleccionar...</option>
                <option value="normal" ${currentProfile.mobility_status === 'normal' ? 'selected' : ''}>Normal</option>
                <option value="limited" ${currentProfile.mobility_status === 'limited' ? 'selected' : ''}>Limitada</option>
                <option value="wheelchair" ${currentProfile.mobility_status === 'wheelchair' ? 'selected' : ''}>Silla de ruedas</option>
                <option value="crutches" ${currentProfile.mobility_status === 'crutches' ? 'selected' : ''}>Muletas</option>
                <option value="immobile" ${currentProfile.mobility_status === 'immobile' ? 'selected' : ''}>Inmóvil</option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label">Alertas Médicas</label>
              <textarea id="medicalAlerts" class="form-control" rows="3" placeholder="Alertas y condiciones importantes">${currentProfile.medical_alerts || ''}</textarea>
            </div>
            <div class="col-md-6">
              <label class="form-label">
                <input type="checkbox" id="requiresSpecialAttention" ${currentProfile.requires_special_medical_attention ? 'checked' : ''}>
                Requiere Atención Médica Especial
              </label>
            </div>
            <div class="col-md-6">
              <label class="form-label">
                <input type="checkbox" id="requiresIsolation" ${currentProfile.requires_isolation ? 'checked' : ''}>
                Requiere Aislamiento
              </label>
            </div>
            <div class="col-md-6">
              <label class="form-label">
                <input type="checkbox" id="hasInfectiousDisease" ${currentProfile.has_infectious_disease ? 'checked' : ''}>
                Tiene Enfermedad Infecciosa
              </label>
            </div>
            <div class="col-md-6">
              <label class="form-label">
                <input type="checkbox" id="suicideRisk" ${currentProfile.suicide_risk ? 'checked' : ''}>
                Riesgo de Suicidio
              </label>
            </div>
            <div class="col-md-6">
              <label class="form-label">
                <input type="checkbox" id="selfHarmRisk" ${currentProfile.self_harm_risk ? 'checked' : ''}>
                Riesgo de Autolesión
              </label>
            </div>
            <div class="col-md-6">
              <label class="form-label">
                <input type="checkbox" id="requiresPsychiatricMedication" ${currentProfile.requires_psychiatric_medication ? 'checked' : ''}>
                Requiere Medicación Psiquiátrica
              </label>
            </div>
          </div>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      width: '700px',
      preConfirm: () => {
        const bloodType = (document.getElementById('bloodType') as HTMLSelectElement).value;
        const mentalHealth = (document.getElementById('mentalHealth') as HTMLSelectElement).value;
        const healthStatus = (document.getElementById('healthStatus') as HTMLSelectElement).value;
        const mobilityStatus = (document.getElementById('mobilityStatus') as HTMLSelectElement).value;
        const medicalAlerts = (document.getElementById('medicalAlerts') as HTMLTextAreaElement).value;
        const requiresSpecialAttention = (document.getElementById('requiresSpecialAttention') as HTMLInputElement).checked;
        const requiresIsolation = (document.getElementById('requiresIsolation') as HTMLInputElement).checked;
        const hasInfectiousDisease = (document.getElementById('hasInfectiousDisease') as HTMLInputElement).checked;
        const suicideRisk = (document.getElementById('suicideRisk') as HTMLInputElement).checked;
        const selfHarmRisk = (document.getElementById('selfHarmRisk') as HTMLInputElement).checked;
        const requiresPsychiatricMedication = (document.getElementById('requiresPsychiatricMedication') as HTMLInputElement).checked;
        
        return {
          blood_type_id: bloodType || null,
          mental_health_status_id: mentalHealth || null,
          health_status: healthStatus || null,
          mobility_status: mobilityStatus || null,
          medical_alerts: medicalAlerts || null,
          requires_special_medical_attention: requiresSpecialAttention,
          requires_isolation: requiresIsolation,
          has_infectious_disease: hasInfectiousDisease,
          suicide_risk: suicideRisk,
          self_harm_risk: selfHarmRisk,
          requires_psychiatric_medication: requiresPsychiatricMedication
        };
      }
    });
    
    if (result.isConfirmed && result.value) {
      await updateMedicalProfile(result.value);
    }
  } catch (error) {
    console.error('Error opening health summary modal:', error);
    await Swal.fire({
      title: 'Error',
      text: 'No se pudo cargar la información necesaria',
      icon: 'error'
    });
  }
};

const updateMedicalProfile = async (data: any) => {
  try {
    await ApiService.put(`/inmates/${props.inmate.id}/medical-profile`, data);
    
    await Swal.fire({
      title: '¡Actualizado!',
      text: 'El resumen de salud ha sido actualizado correctamente',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
    
    await fetchMedicalData();
  } catch (error) {
    console.error('Error updating medical profile:', error);
    await Swal.fire({
      title: 'Error',
      text: 'No se pudo actualizar el resumen de salud',
      icon: 'error'
    });
  }
};

// Lifecycle
onMounted(() => {
  fetchMedicalData();
});
</script>