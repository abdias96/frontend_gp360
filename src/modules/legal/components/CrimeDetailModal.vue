<template>
  <div class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ t('legal.crimes.detail.title') }}</h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>
        <div class="modal-body">
          <div v-if="crime">
            <!-- Crime Information -->
            <div class="card mb-5">
              <div class="card-header">
                <h3 class="card-title">{{ t('legal.crimes.detail.crimeInfo') }}</h3>
              </div>
              <div class="card-body">
                <div class="row mb-5">
                  <div class="col-md-4">
                    <label class="form-label fw-bold">{{ t('legal.crimes.detail.crimeName') }}:</label>
                    <p class="text-gray-800">{{ crime.crime?.name || '-' }}</p>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-bold">{{ t('legal.crimes.detail.crimeCode') }}:</label>
                    <p class="text-gray-800">{{ crime.crime?.code || '-' }}</p>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-bold">{{ t('legal.crimes.detail.classification') }}:</label>
                    <span 
                      class="badge badge-light-warning"
                    >
                      {{ getClassificationLabel(crime.crime_classification) }}
                    </span>
                  </div>
                </div>
                <div class="row mb-5">
                  <div class="col-md-4">
                    <label class="form-label fw-bold">{{ t('legal.crimes.detail.crimeDate') }}:</label>
                    <p class="text-gray-800">{{ formatDate(crime.crime_date) }}</p>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-bold">{{ t('legal.crimes.detail.crimeLocation') }}:</label>
                    <p class="text-gray-800">{{ crime.crime_location || '-' }}</p>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-bold">{{ t('legal.crimes.detail.violenceLevel') }}:</label>
                    <span 
                      class="badge"
                      :class="getViolenceLevelBadgeClass(crime.violence_level)"
                    >
                      {{ getViolenceLevelLabel(crime.violence_level) }}
                    </span>
                  </div>
                </div>
                <div class="row mb-5">
                  <div class="col-12">
                    <label class="form-label fw-bold">{{ t('legal.crimes.detail.description') }}:</label>
                    <p class="text-gray-800">{{ crime.crime_description || '-' }}</p>
                  </div>
                </div>
                <div class="row mb-5" v-if="crime.modus_operandi">
                  <div class="col-12">
                    <label class="form-label fw-bold">{{ t('legal.crimes.detail.modusOperandi') }}:</label>
                    <p class="text-gray-800">{{ crime.modus_operandi }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Inmate Information -->
            <div class="card mb-5">
              <div class="card-header">
                <h3 class="card-title">{{ t('legal.crimes.detail.inmateInfo') }}</h3>
              </div>
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-50px me-5">
                    <img
                      :src="crime.inmate?.photo_url || getAssetPath('media/avatars/blank.png')"
                      :alt="getInmateName(crime.inmate)"
                    />
                  </div>
                  <div class="flex-grow-1">
                    <h4 class="text-gray-800 fw-bold">{{ getInmateName(crime.inmate) }}</h4>
                    <span class="text-muted">{{ crime.inmate?.inmate_number || '-' }}</span>
                  </div>
                  <div>
                    <span v-if="crime.is_main || crime.is_primary_crime" class="badge badge-light-primary">
                      {{ t('legal.crimes.primaryCrime') }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sentence Information -->
            <div class="card mb-5">
              <div class="card-header">
                <h3 class="card-title">{{ t('legal.crimes.detail.sentenceInfo') }}</h3>
              </div>
              <div class="card-body">
                <div class="row mb-5">
                  <div class="col-md-4">
                    <label class="form-label fw-bold">{{ t('legal.crimes.detail.sentenceType') }}:</label>
                    <p class="text-gray-800">{{ getSentenceTypeLabel(crime.sentence_type) || '-' }}</p>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-bold">{{ t('legal.crimes.detail.sentenceCategory') }}:</label>
                    <p class="text-gray-800">{{ getSentenceCategoryLabel(crime.sentence_category) || '-' }}</p>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-bold">{{ t('legal.crimes.detail.totalSentence') }}:</label>
                    <p class="text-gray-800 fw-bold">{{ getSentenceSummary(crime) }}</p>
                  </div>
                </div>
                <div class="row mb-5" v-if="crime.fine_amount || crime.civil_reparation_amount">
                  <div class="col-md-6">
                    <label class="form-label fw-bold">{{ t('legal.crimes.detail.fineAmount') }}:</label>
                    <p class="text-gray-800">Q{{ formatCurrency(crime.fine_amount || 0) }}</p>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold">{{ t('legal.crimes.detail.civilReparation') }}:</label>
                    <p class="text-gray-800">Q{{ formatCurrency(crime.civil_reparation_amount || 0) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Victim Information -->
            <div class="card mb-5" v-if="crime.victim_count">
              <div class="card-header">
                <h3 class="card-title">{{ t('legal.crimes.detail.victimInfo') }}</h3>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-4">
                    <label class="form-label fw-bold">{{ t('legal.crimes.detail.victimCount') }}:</label>
                    <p class="text-gray-800">{{ crime.victim_count }}</p>
                  </div>
                  <div class="col-md-8">
                    <label class="form-label fw-bold">{{ t('legal.crimes.detail.victimDetails') }}:</label>
                    <p class="text-gray-800">{{ crime.victim_details || '-' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional Information -->
            <div class="card mb-5">
              <div class="card-header">
                <h3 class="card-title">{{ t('legal.crimes.detail.additionalInfo') }}</h3>
              </div>
              <div class="card-body">
                <div class="row mb-5">
                  <div class="col-md-3">
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        :checked="crime.criminal_organization_involved"
                        disabled
                      />
                      <label class="form-check-label">
                        {{ t('legal.crimes.detail.organizedCrime') }}
                      </label>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        :checked="crime.reoffense_indicator"
                        disabled
                      />
                      <label class="form-check-label">
                        {{ t('legal.crimes.detail.reoffender') }}
                      </label>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <label class="form-label fw-bold">{{ t('legal.crimes.detail.caseComplexity') }}:</label>
                    <p class="text-gray-800">{{ getCaseComplexityLabel(crime.case_complexity_level) || '-' }}</p>
                  </div>
                  <div class="col-md-3">
                    <label class="form-label fw-bold">{{ t('legal.crimes.detail.mediaAttention') }}:</label>
                    <p class="text-gray-800">{{ getMediaAttentionLabel(crime.media_attention_level) || '-' }}</p>
                  </div>
                </div>
                <div class="row" v-if="crime.notes">
                  <div class="col-12">
                    <label class="form-label fw-bold">{{ t('legal.crimes.detail.notes') }}:</label>
                    <p class="text-gray-800">{{ crime.notes }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Evidence -->
            <div class="card" v-if="crime.evidence_description">
              <div class="card-header">
                <h3 class="card-title">{{ t('legal.crimes.detail.evidence') }}</h3>
              </div>
              <div class="card-body">
                <p class="text-gray-800">{{ crime.evidence_description }}</p>
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
            {{ t('common.actions.close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getAssetPath } from '@/core/helpers/assets';
import { useCatalogs } from '@/composables/useCatalogs';

const { t } = useI18n();
const { crimeClassificationsOptions } = useCatalogs();

// Props
defineProps<{
  crime: any;
}>();

// Emits
defineEmits<{
  close: [];
}>();

// Methods
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const getInmateName = (inmate: any) => {
  if (!inmate) return 'Sin asignar';
  return [inmate.first_name, inmate.middle_name, inmate.last_name, inmate.second_last_name].filter(Boolean).join(' ') || 'Sin nombre';
};

const getClassificationName = (classificationId: number) => {
  const classification = crimeClassificationsOptions.value.find(c => c.value === classificationId);
  return classification?.label || 'Sin clasificar';
};

const getClassificationLabel = (classification: string) => {
  if (!classification) return '-';
  const validClassifications = ['felony', 'misdemeanor', 'infraction'];
  if (validClassifications.includes(classification)) {
    return t(`legal.crimes.classifications.${classification}`);
  }
  return classification;
};

const getClassificationBadgeClass = (classificationId: number) => {
  return 'badge-light-warning';
};

const getViolenceLevelLabel = (level: string) => {
  if (!level) return '-';
  const validLevels = ['none', 'low', 'medium', 'high', 'extreme'];
  if (validLevels.includes(level)) {
    return t(`legal.crimes.violenceLevels.${level}`);
  }
  return level;
};

const getViolenceLevelBadgeClass = (level: string) => {
  const classes: Record<string, string> = {
    'none': 'badge-light-success',
    'low': 'badge-light-info',
    'medium': 'badge-light-warning',
    'high': 'badge-light-danger',
    'extreme': 'badge-light-dark'
  };
  return classes[level] || 'badge-light-secondary';
};

const getSentenceSummary = (crime: any) => {
  if (!crime.sentence_years && !crime.sentence_months && !crime.sentence_days) {
    return t('legal.crimes.noSentence');
  }
  
  const parts = [];
  if (crime.sentence_years) parts.push(`${crime.sentence_years} ${t('legal.crimes.years')}`);
  if (crime.sentence_months) parts.push(`${crime.sentence_months} ${t('legal.crimes.months')}`);
  if (crime.sentence_days) parts.push(`${crime.sentence_days} ${t('legal.crimes.days')}`);
  
  return parts.join(', ');
};

const getSentenceTypeLabel = (type: string) => {
  if (!type) return null;
  return t(`legal.crimes.sentenceTypes.${type}`);
};

const getSentenceCategoryLabel = (category: string) => {
  if (!category) return null;
  return t(`legal.crimes.sentenceCategories.${category}`);
};

const getCaseComplexityLabel = (level: string) => {
  if (!level) return null;
  return t(`legal.crimes.complexityLevels.${level}`);
};

const getMediaAttentionLabel = (level: string) => {
  if (!level) return null;
  return t(`legal.crimes.mediaLevels.${level}`);
};
</script>