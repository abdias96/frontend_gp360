<template>
  <div class="tab-pane fade show active">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">{{ t('admissions.wizard.sections.medicalEvaluation') }}</h3>
      </div>
      <div class="card-body">
        <div class="row g-5">
          <!-- Vital Signs -->
          <div class="col-12">
            <h5 class="mb-4">{{ t('admissions.wizard.sections.vitalSigns') }}</h5>
          </div>

          <div class="col-md-3">
            <label class="form-label">{{ t('admissions.wizard.fields.bloodPressure') }}</label>
            <input
              v-model="medicalEvaluation.vital_signs.blood_pressure"
              type="text"
              class="form-control"
              placeholder="120/80"
            />
          </div>

          <div class="col-md-3">
            <label class="form-label">{{ t('admissions.wizard.fields.heartRate') }}</label>
            <input
              v-model="medicalEvaluation.vital_signs.heart_rate"
              type="text"
              class="form-control"
              placeholder="70 bpm"
            />
          </div>

          <div class="col-md-3">
            <label class="form-label">{{ t('admissions.wizard.fields.temperature') }}</label>
            <input
              v-model="medicalEvaluation.vital_signs.temperature"
              type="text"
              class="form-control"
              placeholder="36.5C"
            />
          </div>

          <div class="col-md-3">
            <label class="form-label">{{ t('admissions.wizard.fields.respiratoryRate') }}</label>
            <input
              v-model="medicalEvaluation.vital_signs.respiratory_rate"
              type="text"
              class="form-control"
              placeholder="16 rpm"
            />
          </div>

          <!-- Medical Conditions -->
          <div class="col-12">
            <div class="separator my-5"></div>
            <h5 class="mb-4">{{ t('admissions.wizard.sections.medicalConditions') }}</h5>
          </div>

          <div class="col-md-6">
            <div class="form-check form-switch mb-3">
              <input
                v-model="medicalEvaluation.has_chronic_diseases"
                class="form-check-input"
                type="checkbox"
                id="hasChronicDiseases"
              />
              <label class="form-check-label" for="hasChronicDiseases">
                {{ t('admissions.wizard.fields.hasChronicDiseases') }}
              </label>
            </div>
            <textarea
              v-if="medicalEvaluation.has_chronic_diseases"
              v-model="medicalEvaluation.chronic_diseases"
              class="form-control"
              rows="2"
              :placeholder="t('admissions.wizard.fields.chronicDiseases')"
            ></textarea>
          </div>

          <div class="col-md-6">
            <div class="form-check form-switch mb-3">
              <input
                v-model="medicalEvaluation.has_medications"
                class="form-check-input"
                type="checkbox"
                id="hasMedications"
              />
              <label class="form-check-label" for="hasMedications">
                {{ t('admissions.wizard.fields.hasMedications') }}
              </label>
            </div>
            <textarea
              v-if="medicalEvaluation.has_medications"
              v-model="medicalEvaluation.current_medications"
              class="form-control"
              rows="2"
              :placeholder="t('admissions.wizard.fields.currentMedications')"
            ></textarea>
          </div>

          <div class="col-md-6">
            <div class="form-check form-switch mb-3">
              <input
                v-model="medicalEvaluation.has_allergies"
                class="form-check-input"
                type="checkbox"
                id="hasAllergies"
              />
              <label class="form-check-label" for="hasAllergies">
                {{ t('admissions.wizard.fields.hasAllergies') }}
              </label>
            </div>
            <textarea
              v-if="medicalEvaluation.has_allergies"
              v-model="medicalEvaluation.allergies"
              class="form-control"
              rows="2"
              :placeholder="t('admissions.wizard.fields.allergies')"
            ></textarea>
          </div>

          <div class="col-md-6">
            <div class="form-check form-switch mb-3">
              <input
                v-model="medicalEvaluation.has_disabilities"
                class="form-check-input"
                type="checkbox"
                id="hasDisabilities"
              />
              <label class="form-check-label" for="hasDisabilities">
                {{ t('admissions.wizard.fields.hasDisabilities') }}
              </label>
            </div>
            <textarea
              v-if="medicalEvaluation.has_disabilities"
              v-model="medicalEvaluation.disabilities"
              class="form-control"
              rows="2"
              :placeholder="t('admissions.wizard.fields.disabilities')"
            ></textarea>
          </div>

          <!-- Mental Health -->
          <div class="col-12">
            <div class="separator my-5"></div>
            <h5 class="mb-4">{{ t('admissions.wizard.sections.mentalHealth') }}</h5>
          </div>

          <div class="col-md-6">
            <label class="form-label">{{ t('admissions.wizard.fields.mentalHealthStatus') }}</label>
            <select v-model="medicalEvaluation.mental_health_status" class="form-select">
              <option value="stable">{{ t('admissions.wizard.fields.mentalStable') }}</option>
              <option value="anxious">{{ t('admissions.wizard.fields.mentalAnxious') }}</option>
              <option value="depressed">{{ t('admissions.wizard.fields.mentalDepressed') }}</option>
              <option value="aggressive">{{ t('admissions.wizard.fields.mentalAggressive') }}</option>
              <option value="confused">{{ t('admissions.wizard.fields.mentalConfused') }}</option>
              <option value="psychotic">{{ t('admissions.wizard.fields.mentalPsychotic') }}</option>
              <option value="suicidal">{{ t('admissions.wizard.fields.mentalSuicidal') }}</option>
            </select>
          </div>

          <div class="col-md-6">
            <div class="form-check form-switch">
              <input
                v-model="medicalEvaluation.requires_immediate_attention"
                class="form-check-input"
                type="checkbox"
                id="requiresAttention"
              />
              <label class="form-check-label text-danger fw-bold" for="requiresAttention">
                {{ t('admissions.wizard.fields.requiresImmediateAttention') }}
              </label>
            </div>
          </div>

          <!-- Medical Notes -->
          <div class="col-12">
            <label class="form-label">{{ t('admissions.wizard.fields.medicalObservations') }}</label>
            <textarea
              v-model="medicalEvaluation.medical_notes"
              class="form-control"
              rows="3"
              :placeholder="t('admissions.wizard.fields.medicalObservations')"
            ></textarea>
          </div>

          <!-- Warning -->
          <div v-if="medicalEvaluation.requires_immediate_attention" class="col-12">
            <div class="alert alert-danger">
              <i class="ki-duotone ki-shield-cross fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <strong>{{ t('admissions.wizard.fields.immediateAttentionWarning') }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAdmissionWizard } from '@/modules/operations/composables/useAdmissionWizard';

const { t } = useI18n();

const {
  medicalEvaluation
} = useAdmissionWizard();
</script>
