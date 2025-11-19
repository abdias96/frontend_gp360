<template>
  <div class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <form @submit.prevent="handleSubmit">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ mode === 'create' ? t('legal.crimes.form.createTitle') : t('legal.crimes.form.editTitle') }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="$emit('close')"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Basic Information -->
            <div class="card mb-5">
              <div class="card-header">
                <h3 class="card-title">{{ t('legal.crimes.form.basicInfo') }}</h3>
              </div>
              <div class="card-body">
                <div class="row mb-5">
                  <div class="col-md-12">
                    <label class="form-label required">{{ t('legal.crimes.form.inmate') }}</label>
                    <Multiselect
                      v-model="formData.inmate_id"
                      :options="inmatesOptions"
                      :searchable="true"
                      :placeholder="t('common.select')"
                      :noOptionsText="t('common.noOptions')"
                      :noResultsText="t('common.noResults')"
                      label="label"
                      valueProp="value"
                      :class="{ 'is-invalid': errors.inmate_id }"
                      @change="onInmateChange"
                      required
                    />
                    <div v-if="errors.inmate_id" class="invalid-feedback d-block">
                      {{ errors.inmate_id }}
                    </div>
                  </div>
                </div>
                <div class="row mb-5">
                  <div class="col-md-6">
                    <label class="form-label required">{{ t('legal.crimes.form.legalProfile') }}</label>
                    <select
                      v-model="formData.legal_profile_id"
                      class="form-select"
                      :class="{ 'is-invalid': errors.legal_profile_id }"
                      :disabled="!formData.inmate_id || legalProfilesOptions.length === 0"
                      required
                    >
                      <option value="">{{ formData.inmate_id ? t('common.select') : t('legal.crimes.form.selectInmateFirst') }}</option>
                      <option
                        v-for="profile in legalProfilesOptions"
                        :key="profile.value"
                        :value="profile.value"
                      >
                        {{ profile.label }}
                      </option>
                    </select>
                    <div v-if="errors.legal_profile_id" class="invalid-feedback">
                      {{ errors.legal_profile_id }}
                    </div>
                    <div v-if="formData.inmate_id && legalProfilesOptions.length === 0" class="form-text text-warning">
                      Este interno no tiene perfiles legales activos. Debe crear un perfil legal primero.
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label required">{{ t('legal.crimes.form.crime') }}</label>
                    <select
                      v-model="formData.crime_id"
                      class="form-select"
                      :class="{ 'is-invalid': errors.crime_id }"
                      required
                    >
                      <option value="">{{ t('common.select') }}</option>
                      <option
                        v-for="crime in crimesOptions"
                        :key="crime.value"
                        :value="crime.value"
                      >
                        {{ crime.label }}
                      </option>
                    </select>
                    <div v-if="errors.crime_id" class="invalid-feedback">
                      {{ errors.crime_id }}
                    </div>
                  </div>
                </div>
                <div class="row mb-5">
                  <div class="col-md-4">
                    <label class="form-label required">{{ t('legal.crimes.form.classification') }}</label>
                    <select
                      v-model="formData.crime_classification"
                      class="form-select"
                      :class="{ 'is-invalid': errors.crime_classification }"
                      required
                    >
                      <option value="">{{ t('common.select') }}</option>
                      <option value="felony">{{ t('legal.crimes.classifications.felony') }}</option>
                      <option value="misdemeanor">{{ t('legal.crimes.classifications.misdemeanor') }}</option>
                      <option value="infraction">{{ t('legal.crimes.classifications.infraction') }}</option>
                    </select>
                    <div v-if="errors.crime_classification" class="invalid-feedback">
                      {{ errors.crime_classification }}
                    </div>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label required">{{ t('legal.crimes.form.violenceLevel') }}</label>
                    <select
                      v-model="formData.violence_level"
                      class="form-select"
                      :class="{ 'is-invalid': errors.violence_level }"
                      required
                    >
                      <option value="">{{ t('common.select') }}</option>
                      <option value="none">{{ t('legal.crimes.violenceLevels.none') }}</option>
                      <option value="low">{{ t('legal.crimes.violenceLevels.low') }}</option>
                      <option value="medium">{{ t('legal.crimes.violenceLevels.medium') }}</option>
                      <option value="high">{{ t('legal.crimes.violenceLevels.high') }}</option>
                      <option value="extreme">{{ t('legal.crimes.violenceLevels.extreme') }}</option>
                    </select>
                    <div v-if="errors.violence_level" class="invalid-feedback">
                      {{ errors.violence_level }}
                    </div>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">{{ t('legal.crimes.form.status') }}</label>
                    <select
                      v-model="formData.status"
                      class="form-select"
                    >
                      <option value="active">{{ t('legal.crimes.statuses.active') }}</option>
                      <option value="pending">{{ t('legal.crimes.statuses.pending') }}</option>
                      <option value="resolved">{{ t('legal.crimes.statuses.resolved') }}</option>
                      <option value="dismissed">{{ t('legal.crimes.statuses.dismissed') }}</option>
                    </select>
                  </div>
                </div>
                <div class="row mb-5">
                  <div class="col-md-4">
                    <label class="form-label required">{{ t('legal.crimes.form.crimeDate') }}</label>
                    <input
                      type="date"
                      v-model="formData.crime_date"
                      class="form-control"
                      :class="{ 'is-invalid': errors.crime_date }"
                      required
                    />
                    <div v-if="errors.crime_date" class="invalid-feedback">
                      {{ errors.crime_date }}
                    </div>
                  </div>
                  <div class="col-md-8">
                    <label class="form-label">{{ t('legal.crimes.form.crimeLocation') }}</label>
                    <input
                      type="text"
                      v-model="formData.crime_location"
                      class="form-control"
                      :placeholder="t('legal.crimes.form.locationPlaceholder')"
                    />
                  </div>
                </div>
                <div class="row mb-5">
                  <div class="col-12">
                    <label class="form-label required">{{ t('legal.crimes.form.description') }}</label>
                    <textarea
                      v-model="formData.crime_description"
                      class="form-control"
                      :class="{ 'is-invalid': errors.crime_description }"
                      rows="3"
                      :placeholder="t('legal.crimes.form.descriptionPlaceholder')"
                      required
                    ></textarea>
                    <div v-if="errors.crime_description" class="invalid-feedback">
                      {{ errors.crime_description }}
                    </div>
                  </div>
                </div>
                <div class="row mb-5">
                  <div class="col-12">
                    <label class="form-label">{{ t('legal.crimes.form.modusOperandi') }}</label>
                    <textarea
                      v-model="formData.modus_operandi"
                      class="form-control"
                      rows="2"
                      :placeholder="t('legal.crimes.form.modusOperandiPlaceholder')"
                    ></textarea>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-3">
                    <div class="form-check">
                      <input
                        v-model="formData.is_primary_crime"
                        class="form-check-input"
                        type="checkbox"
                        id="is_primary_crime"
                      />
                      <label class="form-check-label" for="is_primary_crime">
                        {{ t('legal.crimes.form.isPrimaryCrime') }}
                      </label>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-check">
                      <input
                        v-model="formData.criminal_organization_involved"
                        class="form-check-input"
                        type="checkbox"
                        id="criminal_organization_involved"
                      />
                      <label class="form-check-label" for="criminal_organization_involved">
                        {{ t('legal.crimes.form.organizedCrime') }}
                      </label>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-check">
                      <input
                        v-model="formData.reoffense_indicator"
                        class="form-check-input"
                        type="checkbox"
                        id="reoffense_indicator"
                      />
                      <label class="form-check-label" for="reoffense_indicator">
                        {{ t('legal.crimes.form.reoffender') }}
                      </label>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-check">
                      <input
                        v-model="formData.admits_guilt"
                        class="form-check-input"
                        type="checkbox"
                        id="admits_guilt"
                      />
                      <label class="form-check-label" for="admits_guilt">
                        {{ t('legal.crimes.form.admitsGuilt') }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sentence Information -->
            <div class="card mb-5">
              <div class="card-header">
                <h3 class="card-title">{{ t('legal.crimes.form.sentenceInfo') }}</h3>
              </div>
              <div class="card-body">
                <div class="row mb-5">
                  <div class="col-md-4">
                    <label class="form-label">{{ t('legal.crimes.form.sentenceType') }}</label>
                    <select
                      v-model="formData.sentence_type"
                      class="form-select"
                    >
                      <option value="">{{ t('common.select') }}</option>
                      <option value="definitive">{{ t('legal.crimes.sentenceTypes.definitive') }}</option>
                      <option value="conditional">{{ t('legal.crimes.sentenceTypes.conditional') }}</option>
                      <option value="suspended">{{ t('legal.crimes.sentenceTypes.suspended') }}</option>
                      <option value="alternative">{{ t('legal.crimes.sentenceTypes.alternative') }}</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">{{ t('legal.crimes.form.sentenceCategory') }}</label>
                    <select
                      v-model="formData.sentence_category"
                      class="form-select"
                    >
                      <option value="">{{ t('common.select') }}</option>
                      <option value="minimum">{{ t('legal.crimes.sentenceCategories.minimum') }}</option>
                      <option value="medium">{{ t('legal.crimes.sentenceCategories.medium') }}</option>
                      <option value="maximum">{{ t('legal.crimes.sentenceCategories.maximum') }}</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">{{ t('legal.crimes.form.crimeRole') }}</label>
                    <input
                      type="text"
                      v-model="formData.crime_role"
                      class="form-control"
                      :placeholder="t('legal.crimes.form.crimeRolePlaceholder')"
                    />
                  </div>
                </div>
                <div class="row mb-5">
                  <div class="col-md-4">
                    <label class="form-label">{{ t('legal.crimes.form.sentenceYears') }}</label>
                    <input
                      type="number"
                      v-model.number="formData.sentence_years"
                      class="form-control"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">{{ t('legal.crimes.form.sentenceMonths') }}</label>
                    <input
                      type="number"
                      v-model.number="formData.sentence_months"
                      class="form-control"
                      min="0"
                      max="11"
                    />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">{{ t('legal.crimes.form.sentenceDays') }}</label>
                    <input
                      type="number"
                      v-model.number="formData.sentence_days"
                      class="form-control"
                      min="0"
                      max="364"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <label class="form-label">{{ t('legal.crimes.form.fineAmount') }}</label>
                    <div class="input-group">
                      <span class="input-group-text">Q</span>
                      <input
                        type="number"
                        v-model.number="formData.fine_amount"
                        class="form-control"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">{{ t('legal.crimes.form.civilReparation') }}</label>
                    <div class="input-group">
                      <span class="input-group-text">Q</span>
                      <input
                        type="number"
                        v-model.number="formData.civil_reparation_amount"
                        class="form-control"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Victim Information -->
            <div class="card mb-5">
              <div class="card-header">
                <h3 class="card-title">{{ t('legal.crimes.form.victimInfo') }}</h3>
              </div>
              <div class="card-body">
                <div class="row mb-5">
                  <div class="col-md-4">
                    <label class="form-label">{{ t('legal.crimes.form.victimCount') }}</label>
                    <input
                      type="number"
                      v-model.number="formData.victim_count"
                      class="form-control"
                      min="0"
                    />
                  </div>
                  <div class="col-md-8">
                    <label class="form-label">{{ t('legal.crimes.form.damageAmount') }}</label>
                    <div class="input-group">
                      <span class="input-group-text">Q</span>
                      <input
                        type="number"
                        v-model.number="formData.damage_amount"
                        class="form-control"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <label class="form-label">{{ t('legal.crimes.form.victimDetails') }}</label>
                    <textarea
                      v-model="formData.victim_details"
                      class="form-control"
                      rows="2"
                      :placeholder="t('legal.crimes.form.victimDetailsPlaceholder')"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- Evidence -->
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">{{ t('legal.crimes.form.evidence') }}</h3>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-12">
                    <label class="form-label">{{ t('legal.crimes.form.evidenceDescription') }}</label>
                    <textarea
                      v-model="formData.evidence_description"
                      class="form-control"
                      rows="3"
                      :placeholder="t('legal.crimes.form.evidencePlaceholder')"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-light"
              @click="$emit('close')"
            >
              {{ t('common.actions.cancel') }}
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ mode === 'create' ? t('common.actions.create') : t('common.actions.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCatalogs } from '@/composables/useCatalogs';
import { useCatalogsStore } from '@/stores/catalogs';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import { formatDateForInput } from '@/core/helpers/date-formatters';
import Multiselect from '@vueform/multiselect';

const { t } = useI18n();
const catalogsStore = useCatalogsStore();
const { crimesOptions, crimeClassificationsOptions } = useCatalogs();

// Props
const props = defineProps<{
  crime?: any;
  mode: 'create' | 'edit';
}>();

// Emits
const emit = defineEmits<{
  close: [];
  saved: [];
}>();

// State
const loading = ref(false);
const errors = reactive<any>({});
const inmatesOptions = ref<any[]>([]);
const legalProfilesOptions = ref<any[]>([]);

const formData = reactive({
  inmate_id: '',
  legal_profile_id: '',
  crime_id: '',
  crime_classification: 'felony', // Changed from crime_classification_id to match backend
  crime_role: '',
  crime_description: '',
  crime_date: '',
  crime_location: '',
  damage_amount: null,
  evidence_description: '',
  admits_guilt: false,
  is_primary_crime: false, // Changed from is_main to match backend
  violence_level: 'none',
  sentence_years: null,
  sentence_months: null,
  sentence_days: null,
  sentence_type: '',
  sentence_category: '',
  fine_amount: null,
  civil_reparation_amount: null,
  victim_count: null,
  victim_details: '',
  modus_operandi: '',
  criminal_organization_involved: false,
  reoffense_indicator: false,
  status: 'active'
});

// Load inmates
const loadInmates = async () => {
  try {
    const response = await ApiService.query('/inmates', { per_page: 1000 });
    // Handle paginated response structure
    let inmates = [];
    if (response.data && response.data.data) {
      // Check if it's a paginated response
      if (Array.isArray(response.data.data)) {
        inmates = response.data.data;
      } else if (response.data.data.data && Array.isArray(response.data.data.data)) {
        inmates = response.data.data.data;
      }
    } else if (response.data && Array.isArray(response.data)) {
      inmates = response.data;
    }

    inmatesOptions.value = inmates.map((inmate: any) => ({
      value: inmate.id,
      label: `${inmate.first_name} ${inmate.last_name} (${inmate.inmate_number})`
    }));
  } catch (error) {
    console.error('Error loading inmates:', error);
    // Continue without inmates list
    inmatesOptions.value = [];
  }
};

// Load legal profiles for selected inmate
const loadLegalProfiles = async (inmateId: string | number) => {
  if (!inmateId) {
    legalProfilesOptions.value = [];
    return;
  }

  try {
    const response = await ApiService.query('/inmate-legal-profiles', {
      inmate_id: inmateId,
      per_page: 100
    });

    let profiles = [];
    if (response.data && response.data.data) {
      if (Array.isArray(response.data.data)) {
        profiles = response.data.data;
      } else if (response.data.data.data && Array.isArray(response.data.data.data)) {
        profiles = response.data.data.data;
      }
    } else if (response.data && Array.isArray(response.data)) {
      profiles = response.data;
    }

    // Filter for active profiles and sort by admission number
    const activeProfiles = profiles
      .filter((profile: any) => profile.profile_status === 'active')
      .sort((a: any, b: any) => b.admission_number - a.admission_number);

    legalProfilesOptions.value = activeProfiles.map((profile: any) => ({
      value: profile.id,
      label: `#${profile.admission_number} - ${profile.case_number || 'Sin caso'} (${profile.court?.name || 'Sin juzgado'})`
    }));

    // If there's only one active profile, auto-select it
    if (activeProfiles.length === 1) {
      formData.legal_profile_id = activeProfiles[0].id;
    }
  } catch (error) {
    console.error('Error loading legal profiles:', error);
    legalProfilesOptions.value = [];
  }
};

// Handle inmate change
const onInmateChange = async () => {
  formData.legal_profile_id = ''; // Reset legal profile selection
  await loadLegalProfiles(formData.inmate_id);
};

// Initialize form data
const initializeForm = async () => {
  if (props.mode === 'edit' && props.crime) {
    Object.assign(formData, {
      inmate_id: props.crime.inmate_id,
      legal_profile_id: props.crime.legal_profile_id || '',
      crime_id: props.crime.crime_id,
      crime_classification: props.crime.crime_classification || 'felony',
      crime_role: props.crime.crime_role || '',
      crime_description: props.crime.crime_description || '',
      crime_date: formatDateForInput(props.crime.crime_date),
      crime_location: props.crime.crime_location || '',
      damage_amount: props.crime.damage_amount,
      evidence_description: props.crime.evidence_description || '',
      admits_guilt: props.crime.admits_guilt || false,
      is_primary_crime: props.crime.is_primary_crime || props.crime.is_main || false, // Handle both field names
      violence_level: props.crime.violence_level || 'none',
      sentence_years: props.crime.sentence_years,
      sentence_months: props.crime.sentence_months,
      sentence_days: props.crime.sentence_days,
      sentence_type: props.crime.sentence_type || '',
      sentence_category: props.crime.sentence_category || '',
      fine_amount: props.crime.fine_amount,
      civil_reparation_amount: props.crime.civil_reparation_amount,
      victim_count: props.crime.victim_count,
      victim_details: props.crime.victim_details || '',
      modus_operandi: props.crime.modus_operandi || '',
      criminal_organization_involved: props.crime.criminal_organization_involved || false,
      reoffense_indicator: props.crime.reoffense_indicator || false,
      status: props.crime.status || 'active'
    });

    // Load legal profiles for the selected inmate
    if (props.crime.inmate_id) {
      await loadLegalProfiles(props.crime.inmate_id);
    }
  }
};

// Handle form submission
const handleSubmit = async () => {
  loading.value = true;
  Object.keys(errors).forEach(key => delete errors[key]);
  
  try {
    const url = props.mode === 'create' 
      ? '/inmate-crimes' 
      : `/inmate-crimes/${props.crime.id}`;
    
    const method = props.mode === 'create' ? 'post' : 'put';
    
    await ApiService[method](url, formData);
    
    emit('saved');
  } catch (error: any) {
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors);
    } else {
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: error.response?.data?.message || t('common.saveError')
      });
    }
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  await catalogsStore.fetchMultipleCatalogs(['crimes', 'crime-classifications']);
  await loadInmates();
  await initializeForm();
});
</script>