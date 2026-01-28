<template>
  <div class="tab-pane fade show active">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">{{ t('admissions.wizard.sections.finalAssignment') }}</h3>
      </div>
      <div class="card-body">
        <div class="row g-5">
          <div class="col-md-6">
            <label class="form-label required">{{ t('admissions.wizard.fields.penitentiaryCenter') }}</label>
            <Multiselect
              v-model="finalAssignment.center_id"
              :options="centerOptions"
              :searchable="true"
              :placeholder="t('admissions.wizard.fields.selectCenter')"
              :noOptionsText="t('admissions.wizard.fields.noOptionsAvailable')"
              :noResultsText="t('admissions.wizard.fields.noResultsFound')"
              label="label"
              valueProp="value"
              :canClear="false"
              @select="onCenterChange"
            />
          </div>

          <div class="col-md-6">
            <label class="form-label required">{{ t('admissions.wizard.fields.sector') }}</label>
            <Multiselect
              v-model="finalAssignment.sector_id"
              :options="sectorOptions"
              :searchable="true"
              :placeholder="finalAssignment.center_id ? t('admissions.wizard.fields.selectSector') : t('admissions.wizard.fields.selectFirstCenter')"
              :noOptionsText="t('admissions.wizard.fields.noOptionsAvailable')"
              :noResultsText="t('admissions.wizard.fields.noResultsFound')"
              label="label"
              valueProp="value"
              :disabled="!finalAssignment.center_id"
            />
          </div>

          <div class="col-md-6">
            <label class="form-label">{{ t('admissions.wizard.fields.cellNumber') }}</label>
            <input
              type="text"
              v-model="finalAssignment.cell_number"
              class="form-control"
              :placeholder="t('admissions.wizard.fields.cellPlaceholder')"
            />
          </div>

          <div class="col-12">
            <label class="form-label">{{ t('admissions.wizard.fields.finalNotes') }}</label>
            <textarea
              v-model="finalAssignment.notes"
              class="form-control"
              rows="3"
              :placeholder="t('admissions.wizard.messages.admissionNotesPlaceholder')"
            ></textarea>
          </div>

          <div class="col-12">
            <div class="alert alert-info">
              <h5 class="alert-heading">{{ t('admissions.wizard.sections.processSummary') }}</h5>
              <p>{{ t('admissions.wizard.fields.processSummaryText') }}</p>
              <ul>
                <li><strong>{{ t('admissions.wizard.fields.document') }}:</strong> {{ inmateData.identification_number || t('admissions.wizard.fields.notEntered') }}</li>
                <li><strong>{{ t('admissions.wizard.fields.name') }}:</strong> {{ inmateData.first_name }} {{ inmateData.first_surname }}</li>
                <li><strong>{{ t('admissions.wizard.fields.securityLevel') }}:</strong> {{ getSecurityLevelLabel(riskAssessment.recommended_security_level) }}</li>
                <li><strong>{{ t('admissions.wizard.fields.center') }}:</strong> {{ getCenterName(finalAssignment.center_id) }}</li>
                <li><strong>{{ t('admissions.wizard.fields.sector') }}:</strong> {{ getSectorName(finalAssignment.sector_id) }}</li>
                <li><strong>{{ t('admissions.wizard.fields.cell') }}:</strong> {{ finalAssignment.cell_number || t('admissions.wizard.fields.notAssigned') }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Multiselect from '@vueform/multiselect';
import { useAdmissionWizard } from '@/modules/operations/composables/useAdmissionWizard';

const { t } = useI18n();

const {
  inmateData,
  riskAssessment,
  finalAssignment,
  centers,
  filteredSectors,
  onCenterChange
} = useAdmissionWizard();

// Convert catalogs to options format for Multiselect
const centerOptions = computed(() =>
  centers.value.map((center: any) => ({
    value: center.id,
    label: center.name
  }))
);

const sectorOptions = computed(() =>
  filteredSectors.value.map((sector: any) => ({
    value: sector.id,
    label: sector.name
  }))
);

const getSecurityLevelLabel = (level: string): string => {
  const labels: Record<string, string> = {
    'minimum': t('admissions.wizard.fields.securityMinimum'),
    'medium': t('admissions.wizard.fields.securityMedium'),
    'maximum': t('admissions.wizard.fields.securityMaximum'),
    'super_maximum': t('admissions.wizard.fields.securitySuperMax')
  };
  return labels[level] || level;
};

const getCenterName = (centerId: number | null): string => {
  if (!centerId) return t('admissions.wizard.fields.notAssigned');
  const center = centers.value.find((c: any) => c.id === centerId);
  return center?.name || t('admissions.wizard.fields.notAssigned');
};

const getSectorName = (sectorId: number | null): string => {
  if (!sectorId) return t('admissions.wizard.fields.notAssigned');
  const sector = filteredSectors.value.find((s: any) => s.id === sectorId);
  return sector?.name || t('admissions.wizard.fields.notAssigned');
};
</script>
