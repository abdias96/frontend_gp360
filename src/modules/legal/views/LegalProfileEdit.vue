<template>
  <div class="legal-profile-edit">
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
          {{ t('legal.profiles.edit.title') }}
        </h1>
      </div>

      <!-- Edit Form -->
      <form @submit.prevent="handleSubmit">
        <div class="row g-5 g-xl-10">
          <!-- Basic Information Card -->
          <div class="col-xl-6">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">{{ t('legal.profiles.edit.basicInfo') }}</h3>
              </div>
              <div class="card-body">
                <!-- Case Number -->
                <div class="mb-5">
                  <label class="form-label required">{{ t('legal.profiles.edit.caseNumber') }}</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.case_number"
                    :class="{ 'is-invalid': errors.case_number }"
                    required
                  />
                  <div v-if="errors.case_number" class="invalid-feedback">
                    {{ errors.case_number }}
                  </div>
                </div>

                <!-- File Number -->
                <div class="mb-5">
                  <label class="form-label required">{{ t('legal.profiles.edit.fileNumber') }}</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.judicial_file_number"
                    :class="{ 'is-invalid': errors.judicial_file_number }"
                    required
                  />
                  <div v-if="errors.judicial_file_number" class="invalid-feedback">
                    {{ errors.judicial_file_number }}
                  </div>
                </div>

                <!-- Procedural Status -->
                <div class="mb-5">
                  <label class="form-label required">{{ t('legal.profiles.edit.proceduralStatus') }}</label>
                  <select
                    class="form-select"
                    v-model="formData.procedural_status_id"
                    :class="{ 'is-invalid': errors.procedural_status_id }"
                    required
                  >
                    <option value="">{{ t('common.select') }}</option>
                    <option
                      v-for="status in proceduralStatusesOptions"
                      :key="status.value"
                      :value="status.value"
                    >
                      {{ status.label }}
                    </option>
                  </select>
                  <div v-if="errors.procedural_status_id" class="invalid-feedback">
                    {{ errors.procedural_status_id }}
                  </div>
                </div>

                <!-- Procedural Stage -->
                <div class="mb-5">
                  <label class="form-label">{{ t('legal.profiles.edit.proceduralStage') }}</label>
                  <select
                    class="form-select"
                    v-model="formData.procedural_stage"
                  >
                    <option value="">{{ t('common.select') }}</option>
                    <option value="investigation">{{ t('legal.profiles.proceduralStages.investigation') }}</option>
                    <option value="intermediate_phase">{{ t('legal.profiles.proceduralStages.intermediate') }}</option>
                    <option value="trial">{{ t('legal.profiles.proceduralStages.trial') }}</option>
                    <option value="sentence_execution">{{ t('legal.profiles.proceduralStages.sentenceExecution') }}</option>
                    <option value="appeal_process">{{ t('legal.profiles.proceduralStages.appeal') }}</option>
                    <option value="cassation">{{ t('legal.profiles.proceduralStages.cassation') }}</option>
                    <option value="amparo_process">{{ t('legal.profiles.proceduralStages.amparo') }}</option>
                  </select>
                </div>

                <!-- Court -->
                <div class="mb-5">
                  <label class="form-label required">{{ t('legal.profiles.edit.court') }}</label>
                  <select
                    class="form-select"
                    v-model="formData.court_id"
                    :class="{ 'is-invalid': errors.court_id }"
                    required
                  >
                    <option value="">{{ t('common.select') }}</option>
                    <option
                      v-for="court in courtsOptions"
                      :key="court.value"
                      :value="court.value"
                    >
                      {{ court.label }}
                    </option>
                  </select>
                  <div v-if="errors.court_id" class="invalid-feedback">
                    {{ errors.court_id }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Legal Representatives Card -->
          <div class="col-xl-6">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">{{ t('legal.profiles.edit.legalReps') }}</h3>
              </div>
              <div class="card-body">
                <!-- Prosecutor Name -->
                <div class="mb-5">
                  <label class="form-label">{{ t('legal.profiles.edit.prosecutorName') }}</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.prosecutor_name"
                  />
                </div>

                <!-- Prosecutor Office -->
                <div class="mb-5">
                  <label class="form-label">{{ t('legal.profiles.edit.prosecutorOffice') }}</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.prosecutor_office"
                  />
                </div>

                <!-- Defense Type -->
                <div class="mb-5">
                  <label class="form-label required">{{ t('legal.profiles.edit.defenseType') }}</label>
                  <select
                    class="form-select"
                    v-model="formData.defense_type"
                    required
                  >
                    <option value="public">{{ t('legal.profiles.edit.publicDefense') }}</option>
                    <option value="private">{{ t('legal.profiles.edit.privateDefense') }}</option>
                    <option value="none">{{ t('legal.profiles.edit.noDefense') }}</option>
                  </select>
                </div>

                <!-- Defense Attorney Name -->
                <div class="mb-5">
                  <label class="form-label">{{ t('legal.profiles.edit.defenseAttorneyName') }}</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.defense_attorney_name"
                  />
                </div>

                <!-- Defense Attorney Phone -->
                <div class="mb-5">
                  <label class="form-label">{{ t('legal.profiles.edit.defenseAttorneyPhone') }}</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.defense_attorney_phone"
                  />
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
                <h3 class="card-title">{{ t('legal.profiles.edit.sentenceInfo') }}</h3>
              </div>
              <div class="card-body">
                <!-- Sentence Type -->
                <div class="mb-5">
                  <label class="form-label">{{ t('legal.profiles.edit.sentenceType') }}</label>
                  <select
                    class="form-select"
                    v-model="formData.sentence_type_id"
                  >
                    <option value="">{{ t('common.select') }}</option>
                    <option
                      v-for="type in sentenceTypesOptions"
                      :key="type.value"
                      :value="type.value"
                    >
                      {{ type.label }}
                    </option>
                  </select>
                </div>

                <!-- Sentence Duration -->
                <div class="row">
                  <div class="col-md-4 mb-5">
                    <label class="form-label">{{ t('legal.profiles.edit.years') }}</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model.number="formData.sentence_years"
                      min="0"
                    />
                  </div>
                  <div class="col-md-4 mb-5">
                    <label class="form-label">{{ t('legal.profiles.edit.months') }}</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model.number="formData.sentence_months"
                      min="0"
                      max="11"
                    />
                  </div>
                  <div class="col-md-4 mb-5">
                    <label class="form-label">{{ t('legal.profiles.edit.days') }}</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model.number="formData.sentence_days"
                      min="0"
                      max="364"
                    />
                  </div>
                </div>

                <!-- Sentence Start Date -->
                <div class="mb-5">
                  <label class="form-label">{{ t('legal.profiles.edit.sentenceStartDate') }}</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="formData.sentence_start_date"
                  />
                </div>

                <!-- Sentence End Date -->
                <div class="mb-5">
                  <label class="form-label">{{ t('legal.profiles.edit.sentenceEndDate') }}</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="formData.sentence_end_date"
                  />
                </div>

                <!-- Sentence Details -->
                <div class="mb-5">
                  <label class="form-label">{{ t('legal.profiles.edit.sentenceDetails') }}</label>
                  <textarea
                    class="form-control"
                    v-model="formData.sentence_details"
                    rows="3"
                  ></textarea>
                </div>

                <!-- Benefits Eligibility -->
                <div class="mb-5">
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="formData.eligible_for_benefits"
                      id="eligibleForBenefits"
                    />
                    <label class="form-check-label" for="eligibleForBenefits">
                      {{ t('legal.profiles.edit.eligibleForBenefits') }}
                    </label>
                  </div>
                </div>

                <!-- Sentence Final -->
                <div class="mb-5">
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="formData.sentence_final"
                      id="sentenceFinal"
                    />
                    <label class="form-check-label" for="sentenceFinal">
                      {{ t('legal.profiles.edit.sentenceFinal') }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Preventive Detention -->
          <div class="col-xl-6">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">{{ t('legal.profiles.edit.preventiveDetention') }}</h3>
              </div>
              <div class="card-body">
                <!-- In Preventive Detention -->
                <div class="mb-5">
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="formData.in_preventive_detention"
                      id="inPreventiveDetention"
                      @change="handlePreventiveDetentionChange"
                    />
                    <label class="form-check-label" for="inPreventiveDetention">
                      {{ t('legal.profiles.edit.inPreventiveDetention') }}
                    </label>
                  </div>
                </div>

                <div v-if="formData.in_preventive_detention">
                  <!-- Preventive Detention Start -->
                  <div class="mb-5">
                    <label class="form-label required">{{ t('legal.profiles.edit.preventiveDetentionStart') }}</label>
                    <input
                      type="date"
                      class="form-control"
                      v-model="formData.preventive_detention_start"
                      :class="{ 'is-invalid': errors.preventive_detention_start }"
                      required
                    />
                    <div v-if="errors.preventive_detention_start" class="invalid-feedback">
                      {{ errors.preventive_detention_start }}
                    </div>
                  </div>

                  <!-- Preventive Detention Max End -->
                  <div class="mb-5">
                    <label class="form-label">{{ t('legal.profiles.edit.preventiveDetentionMaxEnd') }}</label>
                    <input
                      type="date"
                      class="form-control"
                      v-model="formData.preventive_detention_max_end"
                      readonly
                    />
                    <div class="form-text">
                      {{ t('legal.profiles.edit.maxDetentionNote') }}
                    </div>
                  </div>

                  <!-- Days Elapsed -->
                  <div class="mb-5">
                    <label class="form-label">{{ t('legal.profiles.edit.daysElapsed') }}</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="preventiveDetentionDaysElapsed + ' días'"
                      readonly
                    />
                  </div>

                  <!-- Days Remaining -->
                  <div class="mb-5">
                    <label class="form-label">{{ t('legal.profiles.edit.daysRemaining') }}</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="preventiveDetentionDaysRemaining + ' días'"
                      :class="{ 'text-danger': preventiveDetentionExpired }"
                      readonly
                    />
                  </div>

                  <div v-if="preventiveDetentionExpired" class="alert alert-danger">
                    <div class="alert-text">
                      {{ t('legal.profiles.edit.preventiveDetentionExpired') }}
                    </div>
                  </div>
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
                <h3 class="card-title">{{ t('legal.profiles.edit.legalNotes') }}</h3>
              </div>
              <div class="card-body">
                <textarea
                  class="form-control"
                  v-model="formData.legal_notes"
                  rows="5"
                  :placeholder="t('legal.profiles.edit.legalNotesPlaceholder')"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="row mt-5">
          <div class="col-12">
            <div class="d-flex justify-content-end gap-3">
              <button
                type="button"
                @click="goBack"
                class="btn btn-light"
                :disabled="submitting"
              >
                {{ t('common.actions.cancel') }}
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="submitting"
              >
                <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                {{ t('common.actions.save') }}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Error state -->
    <div v-else class="text-center py-10">
      <span class="text-muted">{{ t('legal.profiles.edit.notFound') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useCatalogs } from '@/composables/useCatalogs';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import { formatDateForInput } from '@/core/helpers/date-formatters';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { 
  proceduralStatusesOptions, 
  courtsOptions,
  sentenceTypesOptions,
  loadLegalCatalogs 
} = useCatalogs();

// State
const loading = ref(false);
const submitting = ref(false);
const profile = ref<any>(null);
const formData = ref<any>({
  case_number: '',
  judicial_file_number: '',
  procedural_status_id: '',
  procedural_stage: '',
  court_id: '',
  prosecutor_name: '',
  prosecutor_office: '',
  defense_type: 'public',
  defense_attorney_name: '',
  defense_attorney_phone: '',
  sentence_type_id: '',
  sentence_years: 0,
  sentence_months: 0,
  sentence_days: 0,
  sentence_start_date: '',
  sentence_end_date: '',
  sentence_details: '',
  eligible_for_benefits: false,
  sentence_final: false,
  in_preventive_detention: false,
  preventive_detention_start: '',
  preventive_detention_max_end: '',
  legal_notes: ''
});
const errors = ref<any>({});

// Computed
const preventiveDetentionDaysElapsed = computed(() => {
  if (!formData.value.preventive_detention_start) return 0;
  const start = new Date(formData.value.preventive_detention_start);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const preventiveDetentionDaysRemaining = computed(() => {
  return Math.max(0, 164 - preventiveDetentionDaysElapsed.value);
});

const preventiveDetentionExpired = computed(() => {
  return preventiveDetentionDaysElapsed.value > 164;
});

// Watchers
watch(() => formData.value.preventive_detention_start, (newVal) => {
  if (newVal && formData.value.in_preventive_detention) {
    const start = new Date(newVal);
    const maxEnd = new Date(start);
    maxEnd.setDate(maxEnd.getDate() + 164);
    formData.value.preventive_detention_max_end = maxEnd.toISOString().split('T')[0];
  }
});

// Methods
const loadProfile = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get(`/inmate-legal-profiles/${route.params.id}`);
    profile.value = response.data.data || response.data;
    
    // Populate form data
    formData.value = {
      case_number: profile.value.case_number || '',
      judicial_file_number: profile.value.judicial_file_number || '',
      procedural_status_id: profile.value.procedural_status_id || '',
      procedural_stage: profile.value.procedural_stage || '',
      court_id: profile.value.court_id || '',
      prosecutor_name: profile.value.prosecutor_name || '',
      prosecutor_office: profile.value.prosecutor_office || '',
      defense_type: profile.value.defense_type || 'public',
      defense_attorney_name: profile.value.defense_attorney_name || '',
      defense_attorney_phone: profile.value.defense_attorney_phone || '',
      sentence_type_id: profile.value.sentence_type_id || '',
      sentence_years: profile.value.sentence_years || 0,
      sentence_months: profile.value.sentence_months || 0,
      sentence_days: profile.value.sentence_days || 0,
      sentence_start_date: formatDateForInput(profile.value.sentence_start_date),
      sentence_end_date: formatDateForInput(profile.value.sentence_end_date),
      sentence_details: profile.value.sentence_details || '',
      eligible_for_benefits: profile.value.eligible_for_benefits || false,
      sentence_final: profile.value.sentence_final || false,
      in_preventive_detention: profile.value.in_preventive_detention || false,
      preventive_detention_start: formatDateForInput(profile.value.preventive_detention_start),
      preventive_detention_max_end: formatDateForInput(profile.value.preventive_detention_max_end),
      legal_notes: profile.value.legal_notes || ''
    };
  } catch (error) {
    console.error('Error loading legal profile:', error);
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: t('legal.profiles.edit.loadError'),
    });
  } finally {
    loading.value = false;
  }
};

const handlePreventiveDetentionChange = () => {
  if (!formData.value.in_preventive_detention) {
    formData.value.preventive_detention_start = '';
    formData.value.preventive_detention_max_end = '';
  }
};

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!formData.value.case_number) {
    errors.value.case_number = t('common.validation.required');
    isValid = false;
  }

  if (!formData.value.judicial_file_number) {
    errors.value.judicial_file_number = t('common.validation.required');
    isValid = false;
  }

  if (!formData.value.procedural_status_id) {
    errors.value.procedural_status_id = t('common.validation.required');
    isValid = false;
  }

  if (!formData.value.court_id) {
    errors.value.court_id = t('common.validation.required');
    isValid = false;
  }

  if (formData.value.in_preventive_detention && !formData.value.preventive_detention_start) {
    errors.value.preventive_detention_start = t('common.validation.required');
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  submitting.value = true;
  try {
    await ApiService.put(`/inmate-legal-profiles/${route.params.id}`, formData.value);
    
    Swal.fire({
      icon: 'success',
      title: t('common.success'),
      text: t('legal.profiles.edit.saveSuccess'),
      timer: 2000,
      showConfirmButton: false
    });

    setTimeout(() => {
      router.push({ name: 'legal-profile-detail', params: { id: route.params.id } });
    }, 2000);
  } catch (error: any) {
    console.error('Error saving legal profile:', error);
    
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    }
    
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: error.response?.data?.message || t('legal.profiles.edit.saveError'),
    });
  } finally {
    submitting.value = false;
  }
};

const goBack = () => {
  router.push({ name: 'legal-profile-detail', params: { id: route.params.id } });
};

// Lifecycle
onMounted(async () => {
  // Load catalogs first
  await loadLegalCatalogs();
  // Then load profile
  await loadProfile();
});
</script>