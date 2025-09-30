<template>
  <div class="d-flex flex-column gap-7">
    <!--begin::Legal Overview Card-->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label fw-bold text-gray-900">Resumen Legal</span>
          <span class="text-muted mt-1 fw-semibold fs-7">Situación jurídica actual y plazos importantes</span>
        </h3>
        <div class="card-toolbar">
          <button
            v-if="canEdit"
            type="button"
            class="btn btn-sm btn-light-primary"
            @click="openLegalSummaryModal"
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
          <!--begin::Legal Status-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Situación Jurídica</span>
              <span class="fs-5 fw-bold" :class="getLegalStatusClass(legalProfile?.legal_status)">
                {{ getLegalStatusLabel(legalProfile?.legal_status) || 'Sin definir' }}
              </span>
            </div>
          </div>
          <!--end::Legal Status-->
          
          <!--begin::Sentence-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Condena Total</span>
              <span class="fs-5 fw-bold text-gray-900">
                {{ legalProfile?.total_sentence ? formatSentence(legalProfile.total_sentence) : 'No aplica' }}
              </span>
            </div>
          </div>
          <!--end::Sentence-->
          
          <!--begin::Time Served-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Tiempo Cumplido</span>
              <span class="fs-5 fw-bold text-primary">
                {{ calculateTimeServed() }}
              </span>
            </div>
          </div>
          <!--end::Time Served-->
          
          <!--begin::Release Date-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Fecha Probable Libertad</span>
              <span class="fs-5 fw-bold text-success">
                {{ legalProfile?.projected_release_date ? formatDate(legalProfile.projected_release_date) : 'Por determinar' }}
              </span>
            </div>
          </div>
          <!--end::Release Date-->
        </div>
        
        <!--begin::Legal Alerts-->
        <div v-if="legalAlerts.length > 0" class="mt-6">
          <h6 class="text-danger fw-bold mb-3">
            <i class="ki-duotone ki-shield-cross fs-2 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Alertas y Plazos Críticos
          </h6>
          <div class="row g-3">
            <div v-for="alert in legalAlerts" :key="alert.id" class="col-md-6">
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
                    <div v-if="alert.deadline" class="text-danger fs-7 mt-1">
                      Vence: {{ formatDate(alert.deadline) }} ({{ getDaysRemaining(alert.deadline) }} días)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--end::Legal Alerts-->
      </div>
    </div>
    <!--end::Legal Overview Card-->
    
    <!--begin::Legal Modules Grid-->
    <div class="row g-5">
      <!--begin::Active Crimes-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Delitos</h3>
            <div class="card-toolbar">
              <router-link 
                :to="{ path: '/legal/crimes', query: { inmate_id: inmateId } }"
                class="btn btn-sm btn-light-primary"
              >
                Ver Todos
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="activeCrimes.length > 0">
              <div v-for="crime in activeCrimes.slice(0, 3)" :key="crime.id" class="d-flex align-items-center mb-4">
                <div class="symbol symbol-40px me-3">
                  <div class="symbol-label bg-light-danger">
                    <i class="ki-duotone ki-shield-cross fs-2 text-danger">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ crime.name }}</div>
                  <div class="text-muted fs-7">{{ crime.article }} - {{ crime.classification }}</div>
                </div>
                <span :class="`badge badge-light-${crime.severity === 'grave' ? 'danger' : 'warning'}`">
                  {{ crime.severity }}
                </span>
              </div>
              <div v-if="activeCrimes.length > 3" class="text-center mt-3">
                <span class="text-muted fs-7">+{{ activeCrimes.length - 3 }} más</span>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-shield-tick fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="text-muted mt-3">Sin delitos registrados</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Active Crimes-->
      
      <!--begin::Upcoming Hearings-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Audiencias Próximas</h3>
            <div class="card-toolbar">
              <router-link 
                :to="{ path: '/legal/hearings', query: { inmate_id: inmateId } }"
                class="btn btn-sm btn-light-success"
              >
                <i class="ki-duotone ki-plus fs-2"></i>
                Programar
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="upcomingHearings.length > 0">
              <div v-for="hearing in upcomingHearings.slice(0, 3)" :key="hearing.id" class="d-flex align-items-center mb-4">
                <div class="symbol symbol-40px me-3">
                  <div class="symbol-label bg-light-info">
                    <i class="ki-duotone ki-calendar fs-2 text-info">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ getHearingTypeLabel(hearing.hearing_type || hearing.type) }}</div>
                  <div class="text-muted fs-7">{{ formatDateTime(hearing.scheduled_at) }}</div>
                  <div class="text-muted fs-8">{{ hearing.court }}</div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-calendar-tick fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
              <div class="text-muted mt-3">Sin audiencias programadas</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Upcoming Hearings-->
      
      <!--begin::Active Appeals-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Recursos y Apelaciones</h3>
            <div class="card-toolbar">
              <router-link 
                :to="{ path: '/legal/appeals', query: { inmate_id: inmateId } }"
                class="btn btn-sm btn-light-primary"
              >
                Ver Detalles
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="activeAppeals.length > 0">
              <div v-for="appeal in activeAppeals.slice(0, 2)" :key="appeal.id" class="d-flex align-items-center mb-4">
                <div class="symbol symbol-40px me-3">
                  <div class="symbol-label bg-light-warning">
                    <i class="ki-duotone ki-document fs-2 text-warning">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ getAppealTypeLabel(appeal.appeal_type || appeal.type) }}</div>
                  <div class="text-muted fs-7">Estado: {{ appeal.status }}</div>
                  <div class="text-muted fs-8">Presentado: {{ formatDate(appeal.filed_date) }}</div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-document fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="text-muted mt-3">Sin recursos activos</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Active Appeals-->
      
      <!--begin::Benefits-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Beneficios Penitenciarios</h3>
            <div class="card-toolbar">
              <router-link 
                :to="{ path: '/legal/benefits', query: { inmate_id: inmateId } }"
                class="btn btn-sm btn-light-primary"
              >
                Solicitar
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="benefits.length > 0">
              <div v-for="benefit in benefits.slice(0, 2)" :key="benefit.id" class="mb-4">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <div class="fw-bold text-gray-900">{{ benefit.type }}</div>
                    <div class="text-muted fs-7">{{ benefit.status }}</div>
                  </div>
                  <span :class="`badge badge-light-${getBenefitStatusColor(benefit.status)}`">
                    {{ benefit.progress }}%
                  </span>
                </div>
                <div class="progress mt-2" style="height: 6px">
                  <div 
                    class="progress-bar" 
                    :class="`bg-${getBenefitStatusColor(benefit.status)}`"
                    :style="`width: ${benefit.progress}%`"
                  ></div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-gift fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="text-muted mt-3">Sin beneficios solicitados</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Benefits-->
    </div>
    <!--end::Legal Modules Grid-->

    <!--begin::Resolutions Section-->
    <div class="card">
      <div class="card-body">
        <ResolutionList :inmate-id="inmateId" />
      </div>
    </div>
    <!--end::Resolutions Section-->

    <!--begin::Quick Actions-->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Acciones Rápidas</h3>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <router-link 
              :to="{ path: '/legal/resolutions', query: { inmate_id: inmateId } }"
              class="btn btn-flex btn-light-primary w-100 py-4"
            >
              <i class="ki-duotone ki-judge fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Resoluciones</span>
            </router-link>
          </div>
          <div class="col-md-3">
            <router-link 
              :to="{ path: '/legal/deadlines', query: { inmate_id: inmateId } }"
              class="btn btn-flex btn-light-warning w-100 py-4"
            >
              <i class="ki-duotone ki-time fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Plazos Procesales</span>
            </router-link>
          </div>
          <div class="col-md-3">
            <router-link 
              :to="{ path: '/legal/measures', query: { inmate_id: inmateId } }"
              class="btn btn-flex btn-light-info w-100 py-4"
            >
              <i class="ki-duotone ki-shield-tick fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Medidas Cautelares</span>
            </router-link>
          </div>
          <div class="col-md-3">
            <button 
              @click="openReleaseProcess"
              class="btn btn-flex btn-light-success w-100 py-4"
            >
              <i class="ki-duotone ki-exit-right fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Proceso Libertad</span>
            </button>
          </div>
        </div>
        
        <div class="separator my-5"></div>
        
        <div class="row g-3">
          <div class="col-md-4">
            <router-link 
              :to="`/inmates/${inmateId}/legal/lawyers`"
              class="btn btn-flex btn-light w-100 py-3"
            >
              <i class="ki-duotone ki-briefcase fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span>Defensa Legal</span>
            </router-link>
          </div>
          <div class="col-md-4">
            <router-link 
              :to="`/inmates/${inmateId}/legal/documents`"
              class="btn btn-flex btn-light w-100 py-3"
            >
              <i class="ki-duotone ki-folder-open fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span>Expediente Judicial</span>
            </router-link>
          </div>
          <div class="col-md-4">
            <router-link 
              :to="`/inmates/${inmateId}/legal/reports`"
              class="btn btn-flex btn-light w-100 py-3"
            >
              <i class="ki-duotone ki-document fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span>Reportes Legales</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!--end::Quick Actions-->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import { formatDate, formatDateTime } from '@/core/helpers/formatters';
import ResolutionList from '@/components/legal/ResolutionList.vue';

// Props
interface Props {
  inmateId: number;
}

const props = defineProps<Props>();

// Stores and composables
const authStore = useAuthStore();
const { t } = useI18n();

// State
const legalProfile = ref<any>(null);
const activeCrimes = ref<any[]>([]);
const upcomingHearings = ref<any[]>([]);
const activeAppeals = ref<any[]>([]);
const benefits = ref<any[]>([]);
const loadingProfile = ref(false);

// State for alerts (now reactive instead of computed)
const legalAlerts = ref<any[]>([]);

// Computed
const canEdit = computed(() => authStore.hasPermission('legal.profiles') || authStore.hasPermission('legal.manage'));

const canScheduleHearings = computed(() => authStore.hasPermission('legal.hearings'));
const canManageResolutions = computed(() => authStore.hasPermission('legal.resolutions'));
const canManageAppeals = computed(() => authStore.hasPermission('legal.appeals'));
const canManageDeadlines = computed(() => authStore.hasPermission('legal.deadlines'));

// Method to update alerts based on current data
const updateLegalAlerts = () => {
  const alerts = [];
  
  // Check for preventive detention limit (164 days in Guatemala)
  if (legalProfile.value?.in_preventive_detention) {
    const detentionDays = calculateDaysInDetention();
    if (detentionDays > 140) {
      alerts.push({
        id: 'detention_limit',
        severity: detentionDays > 164 ? 'danger' : 'warning',
        icon: 'time',
        title: 'Límite de Prisión Preventiva',
        description: `${detentionDays} días en prisión preventiva`,
        deadline: calculateDeadline(164 - detentionDays)
      });
    }
  }
  
  // Check for upcoming hearings
  const nextHearing = upcomingHearings.value[0];
  if (nextHearing && getDaysRemaining(nextHearing.scheduled_at) <= 7) {
    alerts.push({
      id: 'upcoming_hearing',
      severity: getDaysRemaining(nextHearing.scheduled_at) <= 2 ? 'danger' : 'warning',
      icon: 'calendar',
      title: 'Audiencia Próxima',
      description: nextHearing.type,
      deadline: nextHearing.scheduled_at
    });
  }
  
  // Check for appeal deadlines
  activeAppeals.value.forEach(appeal => {
    if (appeal.deadline && getDaysRemaining(appeal.deadline) <= 15) {
      alerts.push({
        id: `appeal_${appeal.id}`,
        severity: getDaysRemaining(appeal.deadline) <= 5 ? 'danger' : 'info',
        icon: 'document',
        title: 'Plazo de Recurso',
        description: appeal.type,
        deadline: appeal.deadline
      });
    }
  });
  
  legalAlerts.value = alerts;
};

// Methods
const getLegalStatusLabel = (status: string) => {
  const statuses: Record<string, string> = {
    'preventive_detention': 'Prisión Preventiva',
    'sentenced': 'Condenado',
    'appealing': 'En Apelación',
    'conditional_release': 'Libertad Condicional',
    'pending_trial': 'Pendiente de Juicio'
  };
  return statuses[status] || status;
};

const getLegalStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'preventive_detention': 'text-warning',
    'sentenced': 'text-danger',
    'appealing': 'text-info',
    'conditional_release': 'text-success',
    'pending_trial': 'text-warning'
  };
  return classes[status] || 'text-muted';
};

const formatSentence = (months: number) => {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years > 0 && remainingMonths > 0) {
    return `${years} años, ${remainingMonths} meses`;
  } else if (years > 0) {
    return `${years} años`;
  } else {
    return `${remainingMonths} meses`;
  }
};

const calculateTimeServed = () => {
  if (!legalProfile.value?.admission_date) return 'N/A';
  
  const admission = new Date(legalProfile.value.admission_date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - admission.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  const days = diffDays % 30;
  
  const parts = [];
  if (years > 0) parts.push(`${years}a`);
  if (months > 0) parts.push(`${months}m`);
  if (days > 0) parts.push(`${days}d`);
  
  return parts.join(' ') || '0d';
};

const calculateDaysInDetention = () => {
  if (!legalProfile.value?.admission_date) return 0;
  
  const admission = new Date(legalProfile.value.admission_date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - admission.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const calculateDeadline = (daysRemaining: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysRemaining);
  return date.toISOString();
};

const getDaysRemaining = (date: string) => {
  const targetDate = new Date(date);
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getBenefitStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'approved': 'success',
    'pending': 'warning',
    'rejected': 'danger',
    'in_process': 'info'
  };
  return colors[status] || 'secondary';
};

const fetchLegalData = async () => {
  loadingProfile.value = true;
  try {
    // Fetch complete legal information
    const legalResponse = await ApiService.get(`/inmates/${props.inmateId}/legal`);
    const legalData = legalResponse.data.data;
    
    console.log('Legal data received:', legalData);
    
    // Set legal profile with proper defaults
    if (legalData.legal_profile) {
      legalProfile.value = {
        ...legalData.legal_profile,
        legal_status: legalData.legal_profile.procedural_status?.slug || 
                     legalData.legal_profile.in_preventive_detention ? 'preventive_detention' : 'pending_trial',
        total_sentence: calculateTotalSentence(legalData.legal_profile),
        admission_date: legalData.inmate?.admission_date || legalData.legal_profile.preventive_detention_start,
        projected_release_date: legalData.legal_profile.sentence_end_date
      };
    } else {
      // Create default profile if not exists
      legalProfile.value = {
        legal_status: 'pending_trial',
        total_sentence: null,
        admission_date: legalData.inmate?.admission_date || new Date().toISOString(),
        projected_release_date: null,
        in_preventive_detention: false
      };
    }
    
    // Set crimes with proper mapping
    activeCrimes.value = (legalData.crimes || []).map((crime: any) => ({
      id: crime.id,
      name: crime.crime?.name || 'Delito sin especificar',
      article: crime.crime?.article || 'Art. N/A',
      classification: crime.crime_classification?.name || 'Sin clasificación',
      severity: mapCrimeSeverity(crime.crime?.max_penalty_years)
    }));
    
    // Filter upcoming hearings (future dates)
    const now = new Date();
    upcomingHearings.value = (legalData.hearings || [])
      .filter((hearing: any) => hearing.hearing_date && new Date(hearing.hearing_date) > now)
      .sort((a: any, b: any) => new Date(a.hearing_date).getTime() - new Date(b.hearing_date).getTime())
      .map((hearing: any) => ({
        id: hearing.id,
        hearing_type: hearing.hearing_type,
        type: hearing.hearing_type,
        scheduled_at: hearing.hearing_date,
        court: hearing.court?.name || 'Tribunal por definir'
      }))
      .slice(0, 3);
    
    // Filter active appeals with proper mapping
    activeAppeals.value = (legalData.appeals || [])
      .filter((appeal: any) => !['resolved', 'rejected', 'withdrawn'].includes(appeal.status))
      .map((appeal: any) => ({
        id: appeal.id,
        appeal_type: appeal.appeal_type,
        type: appeal.appeal_type,
        status: mapAppealStatus(appeal.status),
        filed_date: appeal.appeal_filed_date,
        deadline: appeal.response_deadline
      }));
    
    // Process deadlines if present
    if (legalData.deadlines && legalData.deadlines.length > 0) {
      processDeadlines(legalData.deadlines);
    }
    
    // Process preventive detention status if applicable
    if (legalData.preventive_detention_status) {
      updatePreventiveDetentionAlerts(legalData.preventive_detention_status);
    }
    
    // Load resolutions if available
    if (legalData.resolutions) {
      // Process resolutions for display
      processResolutions(legalData.resolutions);
    }
    
    // Load measures if available
    if (legalData.measures) {
      // Process legal measures
      processLegalMeasures(legalData.measures);
    }
    
    // Load benefits if available
    benefits.value = (legalData.benefit_applications || [])
      .filter((benefit: any) => ['pending', 'under_review', 'approved', 'granted'].includes(benefit.status))
      .map((benefit: any) => ({
        id: benefit.id,
        type: benefit.benefit_type?.name || 'Beneficio',
        status: mapBenefitStatus(benefit.status),
        progress: calculateBenefitProgress(benefit),
        application_date: benefit.application_date
      }));
    
  } catch (error: any) {
    console.error('Error fetching legal data:', error);
    
    // Show user-friendly error message
    await Swal.fire({
      title: 'Error',
      text: 'No se pudo cargar la información legal completa. Mostrando datos disponibles.',
      icon: 'warning',
      timer: 3000,
      showConfirmButton: false
    });
    
    // Initialize with empty data
    legalProfile.value = {
      legal_status: 'pending_trial',
      total_sentence: null,
      admission_date: new Date().toISOString(),
      projected_release_date: null
    };
    activeCrimes.value = [];
    upcomingHearings.value = [];
    activeAppeals.value = [];
    benefits.value = [];
  } finally {
    loadingProfile.value = false;
  }
};

// Helper function to calculate total sentence
const calculateTotalSentence = (profile: any) => {
  if (!profile) return null;
  const years = profile.sentence_years || 0;
  const months = profile.sentence_months || 0;
  const days = profile.sentence_days || 0;
  return (years * 12) + months + (days > 0 ? 1 : 0); // Convert to total months
};

// Helper function to map crime severity based on max penalty
const mapCrimeSeverity = (maxPenaltyYears: number | null) => {
  if (!maxPenaltyYears) return 'menor';
  if (maxPenaltyYears >= 20) return 'grave';
  if (maxPenaltyYears >= 10) return 'media';
  return 'menor';
};

// Helper function to map appeal status
const mapAppealStatus = (status: string) => {
  if (!status) return t('common.appealStatus.pending');

  const statusKey = `common.appealStatus.${status}`;
  return t(statusKey);
};

// Helper function to get hearing type label
const getHearingTypeLabel = (type: string | null | undefined): string => {
  if (!type) return t('common.hearingType.notAvailable');

  const typeKey = `common.hearingType.${type}`;
  return t(typeKey);
};

// Helper function to get appeal type label
const getAppealTypeLabel = (type: string | null | undefined): string => {
  if (!type) return t('common.appealType.notAvailable');

  const typeKey = `common.appealType.${type}`;
  return t(typeKey);
};

// Process procedural deadlines
const processDeadlines = (deadlines: any[]) => {
  // This will be used to generate alerts
  const criticalDeadlines = deadlines.filter(d => {
    const daysRemaining = getDaysRemaining(d.deadline_date);
    return daysRemaining <= 30 && daysRemaining >= 0;
  });
  
  // Add to alerts if needed
  criticalDeadlines.forEach(deadline => {
    legalAlerts.value.push({
      id: `deadline_${deadline.id}`,
      severity: getDaysRemaining(deadline.deadline_date) <= 7 ? 'danger' : 'warning',
      icon: 'time',
      title: deadline.deadline_type || 'Plazo Procesal',
      description: deadline.description || 'Vencimiento próximo',
      deadline: deadline.deadline_date
    });
  });
};

// Update preventive detention alerts
const updatePreventiveDetentionAlerts = (status: any) => {
  if (status.status === 'expired' || status.status === 'critical' || status.status === 'warning') {
    const severity = status.status === 'expired' ? 'danger' : 
                     status.status === 'critical' ? 'danger' : 'warning';
    
    legalAlerts.value.push({
      id: 'preventive_detention',
      severity,
      icon: 'time',
      title: 'Prisión Preventiva',
      description: `${status.days_elapsed} días cumplidos de 164 días máximo`,
      deadline: status.max_end_date
    });
  }
};

// Process resolutions for display
const processResolutions = (resolutions: any[]) => {
  // Process judicial resolutions data
  // This can be expanded to show recent resolutions in the UI
  console.log('Processing resolutions:', resolutions.length);
};

// Process legal measures
const processLegalMeasures = (measures: any[]) => {
  // Process active legal measures
  // This can be expanded to show active measures in the UI
  console.log('Processing legal measures:', measures.length);
};

// Map benefit status to Spanish
const mapBenefitStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': 'Pendiente',
    'under_review': 'En Revisión',
    'approved': 'Aprobado',
    'denied': 'Denegado',
    'granted': 'Otorgado',
    'revoked': 'Revocado'
  };
  return statusMap[status] || status;
};

// Calculate benefit progress percentage
const calculateBenefitProgress = (benefit: any) => {
  if (benefit.status === 'granted') return 100;
  if (benefit.status === 'approved') return 75;
  if (benefit.status === 'under_review') return 50;
  if (benefit.status === 'pending') return 25;
  return 0;
};

const openLegalSummaryModal = async () => {
  // Show loading while fetching profile
  const loadingAlert = Swal.fire({
    title: 'Cargando...',
    text: 'Obteniendo información del perfil legal',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    // Get legal profile data
    const response = await ApiService.get(`/inmate-legal-profiles/${props.inmateId}`);
    const profile = response.data.data || {};
    
    await loadingAlert.close();

    // Show update form
    const { value: formValues } = await Swal.fire({
      title: 'Actualizar Perfil Legal',
      html: `
        <div class="text-start">
          <div class="mb-3">
            <label class="form-label">Estado Procesal</label>
            <select id="legal-status" class="form-select">
              <option value="preventive_detention" ${profile.in_preventive_detention ? 'selected' : ''}>Prisión Preventiva</option>
              <option value="sentenced" ${profile.sentence_final ? 'selected' : ''}>Condenado</option>
              <option value="pending_trial" ${!profile.in_preventive_detention && !profile.sentence_final ? 'selected' : ''}>Pendiente de Juicio</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Número de Caso</label>
            <input id="case-number" class="form-control" value="${profile.case_number || ''}" placeholder="Ej: MP001-2024">
          </div>
          <div class="mb-3">
            <label class="form-label">Notas Legales</label>
            <textarea id="legal-notes" class="form-control" rows="3">${profile.legal_notes || ''}</textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          legal_status: (document.getElementById('legal-status') as HTMLSelectElement).value,
          case_number: (document.getElementById('case-number') as HTMLInputElement).value,
          legal_notes: (document.getElementById('legal-notes') as HTMLTextAreaElement).value
        };
      }
    });

    if (formValues) {
      // Update profile
      const updateData = {
        ...profile,
        case_number: formValues.case_number,
        legal_notes: formValues.legal_notes,
        in_preventive_detention: formValues.legal_status === 'preventive_detention',
        sentence_final: formValues.legal_status === 'sentenced'
      };

      await ApiService.put(`/inmates/${props.inmateId}/legal-profile`, updateData);
      
      await Swal.fire({
        title: 'Actualizado',
        text: 'El perfil legal ha sido actualizado correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      // Reload data
      await fetchLegalData();
    }
  } catch (error: any) {
    await loadingAlert.close();
    console.error('Error updating legal profile:', error);
    await Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'No se pudo actualizar el perfil legal',
      icon: 'error'
    });
  }
};

// Open release process modal
const openReleaseProcess = async () => {
  await Swal.fire({
    title: 'Proceso de Libertad',
    html: `
      <div class="text-start">
        <p>Para iniciar un proceso de libertad, debe dirigirse al módulo de Operaciones > Liberaciones</p>
        <p class="text-muted fs-7 mt-3">Requiere autorización judicial y cumplimiento de requisitos establecidos.</p>
      </div>
    `,
    icon: 'info',
    confirmButtonText: 'Entendido'
  });
};

// Watch for data changes to update alerts
watch([legalProfile, upcomingHearings, activeAppeals], () => {
  updateLegalAlerts();
}, { deep: true });

// Lifecycle
onMounted(() => {
  fetchLegalData();
});
</script>