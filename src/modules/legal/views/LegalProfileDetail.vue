<template>
  <div class="legal-profile-detail">
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
          {{ t('legal.profiles.detail.title') }}
        </h1>
      </div>

      <!-- Profile Cards -->
      <div class="row g-5 g-xl-10">
        <!-- Inmate Information Card -->
        <div class="col-xl-4">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">{{ t('legal.profiles.detail.inmateInfo') }}</h3>
            </div>
            <div class="card-body">
              <div class="d-flex flex-center flex-column py-5">
                <div class="symbol symbol-100px symbol-circle mb-7">
                  <img 
                    :src="profile.inmate?.photo_url || getAssetPath('media/avatars/blank.png')" 
                    :alt="inmateName"
                  />
                </div>
                <h3 class="fs-3 text-gray-800 fw-bold mb-3">{{ inmateName }}</h3>
                <div class="fs-5 fw-semibold text-muted mb-6">
                  {{ profile.inmate?.inmate_number }}
                </div>
              </div>

              <div class="d-flex flex-stack fs-4 py-3">
                <div class="fw-bold">{{ t('legal.profiles.detail.documentNumber') }}</div>
                <div class="text-gray-700">{{ profile.inmate?.document_number || '-' }}</div>
              </div>

              <div class="separator my-3"></div>

              <div class="d-flex flex-stack fs-4 py-3">
                <div class="fw-bold">{{ t('legal.profiles.detail.caseNumber') }}</div>
                <div class="text-gray-700">{{ profile.case_number }}</div>
              </div>

              <div class="d-flex flex-stack fs-4 py-3">
                <div class="fw-bold">{{ t('legal.profiles.detail.fileNumber') }}</div>
                <div class="text-gray-700">{{ profile.judicial_file_number }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Legal Status Card -->
        <div class="col-xl-8">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">{{ t('legal.profiles.detail.legalStatus') }}</h3>
              <div class="card-toolbar">
                <button @click="editProfile" class="btn btn-sm btn-light-primary">
                  <KTIcon icon-name="pencil" icon-class="fs-3" />
                  {{ t('common.actions.edit') }}
                </button>
              </div>
            </div>
            <div class="card-body">
              <div class="row mb-7">
                <label class="col-lg-4 fw-semibold text-muted">
                  {{ t('legal.profiles.detail.proceduralStatus') }}
                </label>
                <div class="col-lg-8">
                  <span 
                    class="badge badge-lg"
                    :class="getStatusBadgeClass(profile.procedural_status?.code)"
                  >
                    {{ profile.procedural_status?.name || '-' }}
                  </span>
                </div>
              </div>

              <div class="row mb-7">
                <label class="col-lg-4 fw-semibold text-muted">
                  {{ t('legal.profiles.detail.proceduralStage') }}
                </label>
                <div class="col-lg-8">
                  <span 
                    class="badge badge-lg"
                    :class="getProceduralStageBadgeClass(profile.procedural_stage)"
                  >
                    {{ getProceduralStageLabel(profile.procedural_stage) }}
                  </span>
                </div>
              </div>

              <div class="row mb-7">
                <label class="col-lg-4 fw-semibold text-muted">
                  {{ t('legal.profiles.detail.court') }}
                </label>
                <div class="col-lg-8">
                  <div class="d-flex align-items-center">
                    <span class="svg-icon svg-icon-2 svg-icon-primary me-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 14H18V10H20C20.6 10 21 10.4 21 11V13C21 13.6 20.6 14 20 14ZM21 19V17C21 16.4 20.6 16 20 16H18V20H20C20.6 20 21 19.6 21 19ZM21 7V5C21 4.4 20.6 4 20 4H18V8H20C20.6 8 21 7.6 21 7Z" fill="currentColor"/>
                        <path opacity="0.3" d="M17 22H3C2.4 22 2 21.6 2 21V3C2 2.4 2.4 2 3 2H17C17.6 2 18 2.4 18 3V21C18 21.6 17.6 22 17 22ZM10 7C8.9 7 8 7.9 8 9C8 10.1 8.9 11 10 11C11.1 11 12 10.1 12 9C12 7.9 11.1 7 10 7ZM13.3 16C14 16 14.5 15.3 14.3 14.7C13.7 13.2 12 12 10.1 12C8.10001 12 6.49999 13.1 5.89999 14.7C5.59999 15.3 6.19999 16 7.39999 16H13.3Z" fill="currentColor"/>
                      </svg>
                    </span>
                    <span class="fw-bold fs-6 text-gray-800">{{ profile.court?.name || '-' }}</span>
                  </div>
                </div>
              </div>

              <div class="row mb-7">
                <label class="col-lg-4 fw-semibold text-muted">
                  {{ t('legal.profiles.detail.prosecutor') }}
                </label>
                <div class="col-lg-8">
                  <div class="d-flex align-items-start">
                    <span class="svg-icon svg-icon-2 svg-icon-danger me-2 mt-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.0173 9H15.3945C14.2833 9 13.263 9.61425 12.7431 10.5963L12.154 11.7091C12.0645 11.8781 12.1072 12.0868 12.2559 12.2071L12.6402 12.5183C13.2631 13.0225 13.7556 13.6691 14.0764 14.4035L14.2321 14.7601C14.2957 14.9058 14.4396 15 14.5987 15H18.6747C19.7297 15 20.4057 13.8774 19.912 12.945L18.6686 10.5963C18.1487 9.61425 17.1285 9 16.0173 9Z" fill="currentColor"/>
                        <rect opacity="0.3" x="14" y="4" width="4" height="4" rx="2" fill="currentColor"/>
                        <path d="M4.65486 14.8559C5.40389 13.1224 7.11161 12 9 12C10.8884 12 12.5961 13.1224 13.3451 14.8559L14.793 18.2067C15.3636 19.5271 14.3955 21 12.9571 21H5.04292C3.60453 21 2.63644 19.5271 3.20698 18.2067L4.65486 14.8559Z" fill="currentColor"/>
                        <rect opacity="0.3" x="6" y="5" width="6" height="6" rx="3" fill="currentColor"/>
                      </svg>
                    </span>
                    <div>
                      <div class="fw-bold fs-6 text-gray-800">{{ profile.prosecutor_name || '-' }}</div>
                      <div class="text-muted fs-7">{{ profile.prosecutor_office || '-' }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row mb-7">
                <label class="col-lg-4 fw-semibold text-muted">
                  {{ t('legal.profiles.detail.defenseAttorney') }}
                </label>
                <div class="col-lg-8">
                  <div class="d-flex align-items-start">
                    <span class="svg-icon svg-icon-2 svg-icon-success me-2 mt-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.0173 9H15.3945C14.2833 9 13.263 9.61425 12.7431 10.5963L12.154 11.7091C12.0645 11.8781 12.1072 12.0868 12.2559 12.2071L12.6402 12.5183C13.2631 13.0225 13.7556 13.6691 14.0764 14.4035L14.2321 14.7601C14.2957 14.9058 14.4396 15 14.5987 15H18.6747C19.7297 15 20.4057 13.8774 19.912 12.945L18.6686 10.5963C18.1487 9.61425 17.1285 9 16.0173 9Z" fill="currentColor"/>
                        <rect opacity="0.3" x="14" y="4" width="4" height="4" rx="2" fill="currentColor"/>
                        <path d="M4.65486 14.8559C5.40389 13.1224 7.11161 12 9 12C10.8884 12 12.5961 13.1224 13.3451 14.8559L14.793 18.2067C15.3636 19.5271 14.3955 21 12.9571 21H5.04292C3.60453 21 2.63644 19.5271 3.20698 18.2067L4.65486 14.8559Z" fill="currentColor"/>
                        <rect opacity="0.3" x="6" y="5" width="6" height="6" rx="3" fill="currentColor"/>
                      </svg>
                    </span>
                    <div>
                      <div class="fw-bold fs-6 text-gray-800">{{ profile.defense_attorney_name || '-' }}</div>
                      <span 
                        class="badge me-2"
                        :class="profile.defense_type === 'public' ? 'badge-light-info' : 'badge-light-primary'"
                      >
                        {{ profile.defense_type === 'public' ? 'Defensa Pública' : profile.defense_type === 'private' ? 'Defensa Privada' : 'Sin Defensa' }}
                      </span>
                      <div class="text-muted fs-7 mt-1">
                        <i class="bi bi-telephone fs-6 me-1"></i>
                        {{ profile.defense_attorney_phone || '-' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sentence Information -->
      <div class="row g-5 g-xl-10 mt-1">
        <div class="col-xl-6">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">{{ t('legal.profiles.detail.sentenceInfo') }}</h3>
            </div>
            <div class="card-body">
              <div v-if="profile.sentence_type_id">
                <div class="d-flex align-items-center mb-5">
                  <div class="flex-grow-1">
                    <span class="text-gray-800 fs-5 fw-bold">
                      {{ t('legal.profiles.detail.totalSentence') }}
                    </span>
                  </div>
                  <div>
                    <span class="badge badge-lg badge-light-primary">
                      <span class="fs-3 fw-bold">{{ profile.total_sentence || '-' }}</span>
                    </span>
                  </div>
                </div>

                <div class="separator my-4"></div>

                <div class="row mb-5">
                  <div class="col-6">
                    <div class="text-gray-600 fs-7 fw-semibold mb-2">
                      <i class="bi bi-calendar-check fs-6 me-1"></i>
                      {{ t('legal.profiles.detail.startDate') }}
                    </div>
                    <div class="text-gray-800 fw-bold fs-6">
                      {{ formatDate(profile.sentence_start_date) }}
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="text-gray-600 fs-7 fw-semibold mb-2">
                      <i class="bi bi-calendar-x fs-6 me-1"></i>
                      {{ t('legal.profiles.detail.endDate') }}
                    </div>
                    <div class="text-gray-800 fw-bold fs-6">
                      {{ formatDate(profile.sentence_end_date) }}
                    </div>
                  </div>
                </div>

                <div class="row mb-5">
                  <div class="col-12">
                    <div class="text-gray-600 fs-7 fw-semibold mb-2">
                      <i class="bi bi-file-text fs-6 me-1"></i>
                      {{ t('legal.profiles.detail.sentenceDetails') }}
                    </div>
                    <div class="text-gray-800 bg-light rounded p-3">
                      {{ profile.sentence_details || '-' }}
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-6">
                    <div class="text-gray-600 fs-7 fw-semibold mb-2">
                      <i class="bi bi-gift fs-6 me-1"></i>
                      {{ t('legal.profiles.detail.eligibleForBenefits') }}
                    </div>
                    <span 
                      class="badge badge-lg"
                      :class="profile.eligible_for_benefits ? 'badge-light-success' : 'badge-light-danger'"
                    >
                      <i class="bi" :class="profile.eligible_for_benefits ? 'bi-check-circle' : 'bi-x-circle'" ></i>
                      {{ profile.eligible_for_benefits ? 'Sí' : 'No' }}
                    </span>
                  </div>
                  <div class="col-6">
                    <div class="text-gray-600 fs-7 fw-semibold mb-2">
                      <i class="bi bi-shield-check fs-6 me-1"></i>
                      {{ t('legal.profiles.detail.sentenceFinal') }}
                    </div>
                    <span 
                      class="badge badge-lg"
                      :class="profile.sentence_final ? 'badge-light-success' : 'badge-light-warning'"
                    >
                      <i class="bi" :class="profile.sentence_final ? 'bi-check-circle' : 'bi-clock'" ></i>
                      {{ profile.sentence_final ? 'Firme' : 'En proceso' }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-10">
                <span class="text-muted">{{ t('legal.profiles.detail.noSentence') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Preventive Detention -->
        <div class="col-xl-6">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">{{ t('legal.profiles.detail.preventiveDetention') }}</h3>
            </div>
            <div class="card-body">
              <div v-if="profile.in_preventive_detention">
                <div class="d-flex align-items-center mb-5">
                  <div class="flex-grow-1">
                    <span class="text-gray-800 fs-5 fw-bold">
                      {{ t('legal.profiles.detail.status') }}
                    </span>
                  </div>
                  <span class="badge badge-lg badge-light-warning">
                    <i class="bi bi-exclamation-triangle me-1"></i>
                    {{ t('legal.profiles.detail.inPreventiveDetention') }}
                  </span>
                </div>

                <div class="separator my-4"></div>

                <div class="row mb-5">
                  <div class="col-6">
                    <div class="text-gray-600 fs-7 fw-semibold mb-2">
                      <i class="bi bi-calendar-event fs-6 me-1"></i>
                      {{ t('legal.profiles.detail.startDate') }}
                    </div>
                    <div class="text-gray-800 fw-bold fs-6">
                      {{ formatDate(profile.preventive_detention_start) }}
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="text-gray-600 fs-7 fw-semibold mb-2">
                      <i class="bi bi-calendar-range fs-6 me-1"></i>
                      {{ t('legal.profiles.detail.maxEndDate') }}
                    </div>
                    <div class="text-gray-800 fw-bold fs-6">
                      {{ formatDate(profile.preventive_detention_max_end) }}
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-6">
                    <div class="text-gray-600 fs-7 fw-semibold mb-2">
                      <i class="bi bi-hourglass-split fs-6 me-1"></i>
                      {{ t('legal.profiles.detail.daysElapsed') }}
                    </div>
                    <span class="badge badge-lg badge-light-info">
                      <span class="fs-6 fw-bold">{{ profile.preventive_detention_days_elapsed || 0 }}</span> días
                    </span>
                  </div>
                  <div class="col-6">
                    <div class="text-gray-600 fs-7 fw-semibold mb-2">
                      <i class="bi bi-clock-history fs-6 me-1"></i>
                      {{ t('legal.profiles.detail.daysRemaining') }}
                    </div>
                    <span class="badge badge-lg" :class="profile.preventive_detention_expired ? 'badge-light-danger' : 'badge-light-success'">
                      <span class="fs-6 fw-bold">{{ profile.preventive_detention_days_remaining || 0 }}</span> días
                    </span>
                  </div>
                </div>

                <div v-if="profile.preventive_detention_expired" class="alert alert-danger d-flex align-items-center mt-5">
                  <span class="svg-icon svg-icon-2hx svg-icon-danger me-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path opacity="0.3" d="M12 22C13.6569 22 15 20.6569 15 19C15 17.3431 13.6569 16 12 16C10.3431 16 9 17.3431 9 19C9 20.6569 10.3431 22 12 22Z" fill="currentColor"/>
                      <path d="M19 15V18C19 18.6 18.6 19 18 19H6C5.4 19 5 18.6 5 18V15C6.1 15 7 14.1 7 13V10C7 7.6 8.7 5.6 11 5.1V3C11 2.4 11.4 2 12 2C12.6 2 13 2.4 13 3V5.1C15.3 5.6 17 7.6 17 10V13C17 14.1 17.9 15 19 15ZM11 10C11 9.4 11.4 9 12 9C12.6 9 13 8.6 13 8C13 7.4 12.6 7 12 7C10.3 7 9 8.3 9 10C9 10.6 9.4 11 10 11C10.6 11 11 10.6 11 10Z" fill="currentColor"/>
                    </svg>
                  </span>
                  <div class="d-flex flex-column">
                    <h4 class="mb-1 text-danger">Atención</h4>
                    <span>{{ t('legal.profiles.detail.preventiveDetentionExpired') }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-10">
                <span class="text-muted">{{ t('legal.profiles.detail.notInPreventiveDetention') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Crimes List -->
      <div class="row g-5 g-xl-10 mt-1">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">{{ t('legal.profiles.detail.crimes') }}</h3>
            </div>
            <div class="card-body">
              <div v-if="profile.crimes && profile.crimes.length > 0" class="table-responsive">
                <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                  <thead>
                    <tr class="fw-bold text-muted">
                      <th class="min-w-150px">{{ t('legal.profiles.detail.crimeName') }}</th>
                      <th class="min-w-100px">{{ t('legal.profiles.detail.crimeDate') }}</th>
                      <th class="min-w-100px">{{ t('legal.profiles.detail.isMainCrime') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="crime in profile.crimes" :key="crime.id">
                      <td class="text-gray-900 fw-bold">{{ crime.name }}</td>
                      <td>{{ formatDate(crime.crime_date) }}</td>
                      <td>
                        <span 
                          class="badge"
                          :class="crime.is_main ? 'badge-light-primary' : 'badge-light-secondary'"
                        >
                          {{ crime.is_main ? 'Principal' : 'Secundario' }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="text-center py-10">
                <span class="text-muted">{{ t('legal.profiles.detail.noCrimes') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Legal Notes -->
      <div class="row g-5 g-xl-10 mt-1">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">{{ t('legal.profiles.detail.legalNotes') }}</h3>
            </div>
            <div class="card-body">
              <div v-if="profile.legal_notes" class="text-gray-800">
                {{ profile.legal_notes }}
              </div>
              <div v-else class="text-center py-5">
                <span class="text-muted">{{ t('legal.profiles.detail.noNotes') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else class="text-center py-10">
      <span class="text-muted">{{ t('legal.profiles.detail.notFound') }}</span>
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

// Computed
const inmateName = computed(() => {
  if (!profile.value?.inmate) return 'Sin nombre';
  return profile.value.inmate.name || 
         `${profile.value.inmate.first_name} ${profile.value.inmate.last_name}`.trim() ||
         'Sin nombre';
});

// Methods
const loadProfile = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get(`/inmate-legal-profiles/${route.params.id}`);
    profile.value = response.data.data || response.data;
  } catch (error) {
    console.error('Error loading legal profile:', error);
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: t('legal.profiles.detail.loadError'),
    });
  } finally {
    loading.value = false;
  }
};

const formatDate = (date: string) => {
  if (!date) return '-';
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    return dateObj.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
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

const getProceduralStageLabel = (stage: string) => {
  if (!stage) return '-';
  
  const stageMap: Record<string, string> = {
    'investigation': t('legal.profiles.proceduralStages.investigation'),
    'intermediate_phase': t('legal.profiles.proceduralStages.intermediate'),
    'trial': t('legal.profiles.proceduralStages.trial'),
    'sentence_execution': t('legal.profiles.proceduralStages.sentenceExecution'),
    'appeal_process': t('legal.profiles.proceduralStages.appeal'),
    'cassation': t('legal.profiles.proceduralStages.cassation'),
    'amparo_process': t('legal.profiles.proceduralStages.amparo')
  };
  
  return stageMap[stage] || stage;
};

const getProceduralStageBadgeClass = (stage: string) => {
  const badgeClasses: Record<string, string> = {
    'investigation': 'badge-light-warning',
    'intermediate_phase': 'badge-light-info',
    'trial': 'badge-light-primary',
    'sentence_execution': 'badge-light-success',
    'appeal_process': 'badge-light-danger',
    'cassation': 'badge-light-dark',
    'amparo_process': 'badge-light-secondary'
  };
  
  return badgeClasses[stage] || 'badge-light-secondary';
};

const goBack = () => {
  router.push({ name: 'legal-profiles' });
};

const editProfile = () => {
  router.push({ name: 'legal-profile-edit', params: { id: route.params.id } });
};

// Lifecycle
onMounted(() => {
  loadProfile();
});
</script>