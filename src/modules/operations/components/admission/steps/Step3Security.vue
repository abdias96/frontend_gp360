<template>
  <div class="tab-pane fade show active">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">{{ t('admissions.wizard.sections.securityEvaluation') }}</h3>
      </div>
      <div class="card-body">
        <div class="row g-5">
          <!-- Risk Factors -->
          <div class="col-12">
            <h5 class="mb-4">{{ t('admissions.wizard.sections.riskFactors') }}</h5>
          </div>

          <div class="col-md-6">
            <label class="form-label">{{ t('admissions.wizard.fields.violenceRisk') }}</label>
            <input
              v-model.number="riskAssessment.violence_risk_score"
              type="range"
              class="form-range"
              min="0"
              max="10"
            />
            <div class="text-center">{{ riskAssessment.violence_risk_score }}</div>
          </div>

          <div class="col-md-6">
            <label class="form-label">{{ t('admissions.wizard.fields.escapeRisk') }}</label>
            <input
              v-model.number="riskAssessment.escape_risk_score"
              type="range"
              class="form-range"
              min="0"
              max="10"
            />
            <div class="text-center">{{ riskAssessment.escape_risk_score }}</div>
          </div>

          <div class="col-md-6">
            <label class="form-label">{{ t('admissions.wizard.fields.gangRisk') }}</label>
            <input
              v-model.number="riskAssessment.gang_risk_score"
              type="range"
              class="form-range"
              min="0"
              max="10"
            />
            <div class="text-center">{{ riskAssessment.gang_risk_score }}</div>
          </div>

          <div class="col-md-6">
            <label class="form-label">{{ t('admissions.wizard.fields.selfHarmRisk') }}</label>
            <input
              v-model.number="riskAssessment.self_harm_risk_score"
              type="range"
              class="form-range"
              min="0"
              max="10"
            />
            <div class="text-center">{{ riskAssessment.self_harm_risk_score }}</div>
          </div>

          <div class="col-md-6">
            <label class="form-label">{{ t('admissions.wizard.fields.vulnerabilityLevel') }}</label>
            <input
              v-model.number="riskAssessment.vulnerability_score"
              type="range"
              class="form-range"
              min="0"
              max="10"
            />
            <div class="text-center">{{ riskAssessment.vulnerability_score }}</div>
            <small class="text-muted">{{ t('admissions.wizard.fields.vulnerabilityHelp') }}</small>
          </div>

          <!-- Gang Affiliation -->
          <div class="col-12">
            <div class="separator my-5"></div>
            <h5 class="mb-4">{{ t('admissions.wizard.sections.gangAffiliation') }}</h5>
          </div>

          <div class="col-md-6">
            <label class="form-label required">{{ t('admissions.wizard.fields.affiliationStatus') }}</label>
            <select v-model="inmateData.gang_affiliation_status" class="form-select" required>
              <option value="">{{ t('admissions.wizard.fields.select') }}</option>
              <option value="none">{{ t('admissions.wizard.fields.noAffiliation') }}</option>
              <option value="suspected_ms13">{{ t('admissions.wizard.fields.suspectedMS13') }}</option>
              <option value="confirmed_ms13">{{ t('admissions.wizard.fields.confirmedMS13') }}</option>
              <option value="suspected_barrio18">{{ t('admissions.wizard.fields.suspectedBarrio18') }}</option>
              <option value="confirmed_barrio18">{{ t('admissions.wizard.fields.confirmedBarrio18') }}</option>
              <option value="other_gang">{{ t('admissions.wizard.fields.otherGang') }}</option>
              <option value="gang_leader">{{ t('admissions.wizard.fields.gangLeader') }}</option>
              <option value="protected_witness">{{ t('admissions.wizard.fields.protectedWitness') }}</option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label">{{ t('admissions.wizard.fields.intelligenceNotes') }}</label>
            <textarea
              v-model="inmateData.gang_intelligence_notes"
              class="form-control"
              rows="3"
            ></textarea>
          </div>

          <!-- Special Conditions -->
          <div class="col-12">
            <div class="separator my-5"></div>
            <h5 class="mb-4">{{ t('admissions.wizard.sections.specialConditions') }}</h5>
          </div>

          <div class="col-md-4">
            <div class="form-check">
              <input
                v-model="riskAssessment.is_protected_witness"
                class="form-check-input"
                type="checkbox"
                id="protectedWitness"
              />
              <label class="form-check-label" for="protectedWitness">
                {{ t('admissions.wizard.fields.isProtectedWitness') }}
              </label>
            </div>
          </div>

          <div class="col-md-4">
            <div class="form-check">
              <input
                v-model="riskAssessment.is_ex_law_enforcement"
                class="form-check-input"
                type="checkbox"
                id="exLaw"
              />
              <label class="form-check-label" for="exLaw">
                {{ t('admissions.wizard.fields.exLawEnforcement') }}
              </label>
            </div>
          </div>

          <div class="col-md-4">
            <div class="form-check">
              <input
                v-model="riskAssessment.is_high_profile"
                class="form-check-input"
                type="checkbox"
                id="highProfile"
              />
              <label class="form-check-label" for="highProfile">
                {{ t('admissions.wizard.fields.highProfileCase') }}
              </label>
            </div>
          </div>

          <div class="col-md-4">
            <div class="form-check">
              <input
                v-model="riskAssessment.has_media_attention"
                class="form-check-input"
                type="checkbox"
                id="mediaAttention"
              />
              <label class="form-check-label" for="mediaAttention">
                {{ t('admissions.wizard.fields.mediaAttention') }}
              </label>
            </div>
          </div>

          <div class="col-md-4">
            <div class="form-check">
              <input
                v-model="riskAssessment.requires_isolation"
                class="form-check-input"
                type="checkbox"
                id="requiresIsolation"
              />
              <label class="form-check-label" for="requiresIsolation">
                {{ t('admissions.wizard.fields.requiresIsolation') }}
              </label>
            </div>
          </div>

          <div class="col-md-4">
            <div class="form-check">
              <input
                v-model="riskAssessment.requires_special_monitoring"
                class="form-check-input"
                type="checkbox"
                id="specialMonitoring"
              />
              <label class="form-check-label" for="specialMonitoring">
                {{ t('admissions.wizard.fields.requiresSpecialMonitoring') }}
              </label>
            </div>
          </div>

          <!-- Security Level Recommendation -->
          <div class="col-12">
            <div class="separator my-5"></div>
            <h5 class="mb-4">{{ t('admissions.wizard.sections.securityRecommendation') }}</h5>
          </div>

          <div class="col-md-6">
            <label class="form-label required">{{ t('admissions.wizard.fields.recommendedSecurityLevel') }}</label>
            <select v-model="riskAssessment.recommended_security_level" class="form-select" required>
              <option value="minimum">{{ t('admissions.wizard.fields.securityMinimum') }}</option>
              <option value="medium">{{ t('admissions.wizard.fields.securityMedium') }}</option>
              <option value="maximum">{{ t('admissions.wizard.fields.securityMaximum') }}</option>
              <option value="super_maximum">{{ t('admissions.wizard.fields.securitySuperMax') }}</option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label">{{ t('admissions.wizard.fields.specialRecommendations') }}</label>
            <textarea
              v-model="riskAssessment.special_recommendations"
              class="form-control"
              rows="3"
            ></textarea>
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
  inmateData,
  riskAssessment
} = useAdmissionWizard();
</script>

<style scoped>
.form-range {
  width: 100%;
}
</style>
