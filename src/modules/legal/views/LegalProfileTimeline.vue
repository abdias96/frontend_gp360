<template>
  <div class="legal-profile-timeline">
    <!-- Loading state -->
    <div v-if="loading" class="d-flex justify-content-center py-10">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ t('common.loading') }}...</span>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="profile">
      <!-- Header with back button -->
      <div class="d-flex align-items-center mb-5">
        <button @click="goBack" class="btn btn-light btn-sm me-3">
          <KTIcon icon-name="arrow-left" icon-class="fs-3" />
          {{ t('common.actions.back') }}
        </button>
        <h1 class="flex-grow-1 fs-3 fw-bold my-0">
          {{ t('legal.profiles.timeline.title') }}
        </h1>
      </div>

      <!-- Inmate Info Bar -->
      <div class="card mb-5">
        <div class="card-body py-3">
          <div class="d-flex align-items-center">
            <div class="symbol symbol-50px symbol-circle me-5">
              <img 
                :src="profile.inmate?.photo_url || getAssetPath('media/avatars/blank.png')" 
                :alt="inmateName"
              />
            </div>
            <div class="flex-grow-1">
              <h3 class="fs-4 text-gray-800 fw-bold mb-0">{{ inmateName }}</h3>
              <span class="text-muted fs-6">
                {{ profile.inmate?.inmate_number }} | {{ profile.case_number }}
              </span>
            </div>
            <div>
              <span 
                class="badge fs-7"
                :class="getStatusBadgeClass(profile.procedural_status?.code)"
              >
                {{ profile.procedural_status?.name || '-' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline Filters -->
      <div class="card mb-5">
        <div class="card-body">
          <div class="row">
            <div class="col-md-3">
              <label class="form-label">{{ t('legal.profiles.timeline.filterByType') }}</label>
              <select v-model="filterType" class="form-select form-select-sm">
                <option value="">{{ t('legal.profiles.timeline.allEvents') }}</option>
                <option value="hearing">{{ t('legal.profiles.timeline.hearings') }}</option>
                <option value="resolution">{{ t('legal.profiles.timeline.resolutions') }}</option>
                <option value="appeal">{{ t('legal.profiles.timeline.appeals') }}</option>
                <option value="deadline">{{ t('legal.profiles.timeline.deadlines') }}</option>
                <option value="crime">{{ t('legal.profiles.timeline.crimes') }}</option>
                <option value="benefit">{{ t('legal.profiles.timeline.benefits') }}</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">{{ t('legal.profiles.timeline.dateFrom') }}</label>
              <input type="date" v-model="dateFrom" class="form-control form-control-sm" />
            </div>
            <div class="col-md-3">
              <label class="form-label">{{ t('legal.profiles.timeline.dateTo') }}</label>
              <input type="date" v-model="dateTo" class="form-control form-control-sm" />
            </div>
            <div class="col-md-3 d-flex align-items-end">
              <button @click="applyFilters" class="btn btn-sm btn-primary me-2">
                {{ t('common.actions.filter') }}
              </button>
              <button @click="clearFilters" class="btn btn-sm btn-light">
                {{ t('common.actions.clear') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="timeline" v-if="timelineEvents.length > 0">
        <div 
          v-for="event in filteredEvents" 
          :key="`${event.type}-${event.id}`"
          class="timeline-item"
        >
          <div class="timeline-line"></div>
          
          <div class="timeline-icon" :class="getEventIconClass(event.type)">
            <KTIcon :icon-name="getEventIcon(event.type)" icon-class="fs-2 text-white" />
          </div>

          <div class="timeline-content mb-10 mt-n1">
            <div class="pe-3 mb-5">
              <div class="fs-5 fw-semibold mb-2">
                {{ getEventTitle(event) }}
              </div>
              
              <div class="d-flex align-items-center mt-1 fs-6">
                <div class="text-muted me-2 fs-7">
                  {{ formatDate(event.date) }}
                </div>
                <span 
                  class="badge badge-light-primary fs-8"
                >
                  {{ getEventTypeLabel(event.type) }}
                </span>
              </div>
            </div>

            <div class="overflow-auto pb-5">
              <div 
                class="d-flex align-items-center border border-dashed border-gray-300 rounded min-w-750px px-7 py-3 mb-0"
              >
                <div class="min-w-175px">
                  <span class="fs-6 text-gray-800">
                    {{ getEventDescription(event) }}
                  </span>
                </div>

                <div class="ms-auto">
                  <button 
                    v-if="event.hasDetails"
                    @click="viewEventDetails(event)"
                    class="btn btn-sm btn-light-primary"
                  >
                    {{ t('common.actions.viewDetails') }}
                  </button>
                </div>
              </div>

              <div v-if="event.notes" class="mt-3 p-3 bg-light-warning rounded">
                <span class="fs-7 text-gray-700">
                  <strong>{{ t('legal.profiles.timeline.notes') }}:</strong> {{ event.notes }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="card">
        <div class="card-body text-center py-10">
          <img
            :src="getAssetPath('media/illustrations/sketchy-1/16.png')"
            class="mw-200px mb-5"
            alt=""
          />
          <div class="fw-semibold fs-6 text-gray-500">
            {{ t('legal.profiles.timeline.noEvents') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else class="text-center py-10">
      <span class="text-muted">{{ t('legal.profiles.timeline.notFound') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getAssetPath } from '@/core/helpers/assets';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

// State
const loading = ref(false);
const profile = ref<any>(null);
const timelineEvents = ref<any[]>([]);
const filterType = ref('');
const dateFrom = ref('');
const dateTo = ref('');

// Computed
const inmateName = computed(() => {
  if (!profile.value?.inmate) return 'Sin nombre';
  return profile.value.inmate.name || 
         `${profile.value.inmate.first_name} ${profile.value.inmate.last_name}`.trim() ||
         'Sin nombre';
});

const filteredEvents = computed(() => {
  let events = [...timelineEvents.value];
  
  // Filter by type
  if (filterType.value) {
    events = events.filter(e => e.type === filterType.value);
  }
  
  // Filter by date range
  if (dateFrom.value) {
    const fromDate = new Date(dateFrom.value);
    events = events.filter(e => new Date(e.date) >= fromDate);
  }
  
  if (dateTo.value) {
    const toDate = new Date(dateTo.value);
    events = events.filter(e => new Date(e.date) <= toDate);
  }
  
  // Sort by date descending
  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

// Methods
const loadProfile = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get(`/inmate-legal-profiles/${route.params.id}`);
    profile.value = response.data.data || response.data;
    
    // Build timeline events from profile data
    buildTimelineEvents();
  } catch (error) {
    console.error('Error loading legal profile:', error);
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: t('legal.profiles.timeline.loadError'),
    });
  } finally {
    loading.value = false;
  }
};

const buildTimelineEvents = () => {
  const events: any[] = [];
  
  // Add arrest event
  if (profile.value.arrest_date) {
    events.push({
      id: 'arrest',
      type: 'arrest',
      date: profile.value.arrest_date,
      title: t('legal.profiles.timeline.arrestEvent'),
      description: profile.value.arrest_location || 'Ubicación no especificada',
      notes: profile.value.arrest_details,
      hasDetails: false
    });
  }
  
  // Add crimes
  if (profile.value.crimes) {
    profile.value.crimes.forEach((crime: any) => {
      events.push({
        id: crime.id,
        type: 'crime',
        date: crime.crime_date || profile.value.arrest_date,
        title: crime.name || crime.crime?.name,
        description: crime.is_main ? 'Delito principal' : 'Delito secundario',
        notes: crime.details,
        hasDetails: true
      });
    });
  }
  
  // Add hearings
  if (profile.value.hearings) {
    profile.value.hearings.forEach((hearing: any) => {
      events.push({
        id: hearing.id,
        type: 'hearing',
        date: hearing.hearing_date,
        title: hearing.hearing_type || 'Audiencia',
        description: `${hearing.court?.name || 'Juzgado'} - ${hearing.judge || 'Juez no especificado'}`,
        notes: hearing.notes || hearing.result,
        hasDetails: true
      });
    });
  }
  
  // Add judicial resolutions
  if (profile.value.judicialResolutions) {
    profile.value.judicialResolutions.forEach((resolution: any) => {
      events.push({
        id: resolution.id,
        type: 'resolution',
        date: resolution.resolution_date,
        title: resolution.resolution_type || 'Resolución Judicial',
        description: `Resolución #${resolution.resolution_number || 'S/N'}`,
        notes: resolution.details,
        hasDetails: true
      });
    });
  }
  
  // Add appeals
  if (profile.value.appeals) {
    profile.value.appeals.forEach((appeal: any) => {
      events.push({
        id: appeal.id,
        type: 'appeal',
        date: appeal.appeal_date,
        title: appeal.appeal_type || 'Apelación',
        description: `Estado: ${getAppealStatus(appeal.status)}`,
        notes: appeal.notes,
        hasDetails: true
      });
    });
  }
  
  // Add procedural deadlines
  if (profile.value.proceduralDeadlines) {
    profile.value.proceduralDeadlines.forEach((deadline: any) => {
      events.push({
        id: deadline.id,
        type: 'deadline',
        date: deadline.deadline_date,
        title: deadline.deadline_type || 'Plazo Procesal',
        description: deadline.description,
        notes: deadline.is_completed ? 'Completado' : 'Pendiente',
        hasDetails: false
      });
    });
  }
  
  // Add sentence event
  if (profile.value.sentence_start_date) {
    events.push({
      id: 'sentence-start',
      type: 'sentence',
      date: profile.value.sentence_start_date,
      title: t('legal.profiles.timeline.sentenceStartEvent'),
      description: `${profile.value.total_sentence || 'Duración de sentencia no especificada'}`,
      notes: profile.value.sentence_details,
      hasDetails: false
    });
  }
  
  // Add preventive detention events
  if (profile.value.preventive_detention_start) {
    events.push({
      id: 'preventive-start',
      type: 'preventive',
      date: profile.value.preventive_detention_start,
      title: t('legal.profiles.timeline.preventiveDetentionStart'),
      description: `Máximo 164 días (hasta ${formatDate(profile.value.preventive_detention_max_end)})`,
      notes: profile.value.preventive_detention_expired ? 'EXPIRADO' : null,
      hasDetails: false
    });
  }
  
  timelineEvents.value = events;
};

const formatDate = (date: string) => {
  if (!date) return '-';
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    return dateObj.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return '-';
  }
};

const getStatusBadgeClass = (statusCode: string) => {
  const badgeClasses: Record<string, string> = {
    'PENDING': 'badge-light-warning',
    'PREVENTIVE': 'badge-light-info',
    'SENTENCED': 'badge-light-primary',
    'RELEASED': 'badge-light-success',
    'TRANSFERRED': 'badge-light-secondary',
  };
  
  return badgeClasses[statusCode] || 'badge-light-secondary';
};

const getEventIcon = (type: string) => {
  const icons: Record<string, string> = {
    arrest: 'handcuffs',
    crime: 'shield-cross',
    hearing: 'calendar',
    resolution: 'document',
    appeal: 'send',
    deadline: 'time',
    sentence: 'abstract-26',
    preventive: 'information',
    benefit: 'gift'
  };
  
  return icons[type] || 'information';
};

const getEventIconClass = (type: string) => {
  const classes: Record<string, string> = {
    arrest: 'bg-danger',
    crime: 'bg-warning',
    hearing: 'bg-info',
    resolution: 'bg-primary',
    appeal: 'bg-secondary',
    deadline: 'bg-warning',
    sentence: 'bg-dark',
    preventive: 'bg-info',
    benefit: 'bg-success'
  };
  
  return classes[type] || 'bg-light';
};

const getEventTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    arrest: t('legal.profiles.timeline.typeArrest'),
    crime: t('legal.profiles.timeline.typeCrime'),
    hearing: t('legal.profiles.timeline.typeHearing'),
    resolution: t('legal.profiles.timeline.typeResolution'),
    appeal: t('legal.profiles.timeline.typeAppeal'),
    deadline: t('legal.profiles.timeline.typeDeadline'),
    sentence: t('legal.profiles.timeline.typeSentence'),
    preventive: t('legal.profiles.timeline.typePreventive'),
    benefit: t('legal.profiles.timeline.typeBenefit')
  };
  
  return labels[type] || type;
};

const getEventTitle = (event: any) => {
  return event.title || 'Evento';
};

const getEventDescription = (event: any) => {
  return event.description || '-';
};

const getAppealStatus = (status: string) => {
  if (!status) return 'Pendiente';
  
  const statusMap: Record<string, string> = {
    'pending': 'Pendiente',
    'in_progress': 'En progreso',
    'approved': 'Aprobado',
    'rejected': 'Rechazado',
    'resolved': 'Resuelto',
    'appealed': 'Apelado'
  };
  
  return statusMap[status.toLowerCase()] || status;
};

const viewEventDetails = (event: any) => {
  // Navigate to specific detail view based on event type
  switch(event.type) {
    case 'hearing':
      // router.push({ name: 'legal-hearing-detail', params: { id: event.id } });
      Swal.fire({
        title: t('legal.profiles.timeline.hearingDetails'),
        html: `
          <div class="text-start">
            <p><strong>Fecha:</strong> ${formatDate(event.date)}</p>
            <p><strong>Tipo:</strong> ${event.title}</p>
            <p><strong>Juzgado:</strong> ${event.description}</p>
            ${event.notes ? `<p><strong>Resultado:</strong> ${event.notes}</p>` : ''}
          </div>
        `,
        icon: 'info'
      });
      break;
    case 'resolution':
      // router.push({ name: 'legal-resolution-detail', params: { id: event.id } });
      Swal.fire({
        title: t('legal.profiles.timeline.resolutionDetails'),
        html: `
          <div class="text-start">
            <p><strong>Fecha:</strong> ${formatDate(event.date)}</p>
            <p><strong>Tipo:</strong> ${event.title}</p>
            <p><strong>Número:</strong> ${event.description}</p>
            ${event.notes ? `<p><strong>Detalles:</strong> ${event.notes}</p>` : ''}
          </div>
        `,
        icon: 'info'
      });
      break;
    default:
      Swal.fire({
        title: event.title,
        text: event.description,
        icon: 'info'
      });
  }
};

const applyFilters = () => {
  // Filters are applied via computed property
};

const clearFilters = () => {
  filterType.value = '';
  dateFrom.value = '';
  dateTo.value = '';
};

const goBack = () => {
  router.push({ name: 'legal-profiles' });
};

// Lifecycle
onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
.timeline {
  position: relative;
  padding-left: 40px;
}

.timeline:before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e4e6ef;
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
}

.timeline-icon {
  position: absolute;
  left: -25px;
  top: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.timeline-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-left: 20px;
  box-shadow: 0 0 20px rgba(0,0,0,0.05);
}
</style>