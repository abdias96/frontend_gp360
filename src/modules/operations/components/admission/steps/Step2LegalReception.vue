<template>
  <div class="tab-pane fade show active">
    <div class="w-100">
      <div class="pb-10 pb-lg-15">
        <h2 class="fw-bold d-flex align-items-center text-gray-900">
          {{ t('admissions.wizard.steps.legalReception') }}
          <span class="ms-1" data-bs-toggle="tooltip" :title="t('admissions.wizard.messages.registerCases')">
            <i class="ki-duotone ki-information fs-6">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
          </span>
        </h2>
        <div class="text-muted fw-semibold fs-6">
          {{ t('admissions.wizard.messages.registerCases') }}
        </div>
      </div>

      <!-- Admission Information -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="card-title">{{ t('admissions.wizard.sections.admissionInfo') }}</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label required">{{ t('admissions.wizard.fields.admissionType') }}</label>
              <select v-model="admissionData.admission_type" class="form-select" required>
                <option value="">{{ t('admissions.wizard.fields.select') }}</option>
                <option v-for="type in admissionTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label required">{{ t('admissions.wizard.fields.penitentiaryCenter') }}</label>
              <Multiselect
                v-model="admissionData.current_center_id"
                :options="centerOptions"
                :searchable="true"
                :placeholder="t('admissions.wizard.fields.selectCenter')"
                :noOptionsText="t('admissions.wizard.fields.noOptionsAvailable')"
                :noResultsText="t('admissions.wizard.fields.noResultsFound')"
                label="label"
                valueProp="value"
                :canClear="false"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label required">{{ t('admissions.wizard.fields.admissionDateTime') }}</label>
              <input
                v-model="admissionData.admission_datetime"
                type="datetime-local"
                class="form-control"
                required
              />
            </div>
            <div class="col-md-4">
              <label class="form-label required">{{ t('admissions.wizard.fields.admissionOrderNumber') }}</label>
              <input
                v-model="admissionData.admission_order_number"
                type="text"
                class="form-control"
                placeholder="Ej: ORD-2024-001"
                required
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">{{ t('admissions.wizard.fields.remissionDocNumber') }}</label>
              <input
                v-model="admissionData.remission_document_number"
                type="text"
                class="form-control"
                placeholder="Ej: REM-2024-001"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label required">{{ t('admissions.wizard.fields.remittingCourt') }}</label>
              <Multiselect
                v-model="admissionData.remitting_court_id"
                :options="courtOptions"
                :searchable="true"
                :placeholder="t('admissions.wizard.fields.selectCourt')"
                :noOptionsText="t('admissions.wizard.fields.noOptionsAvailable')"
                :noResultsText="t('admissions.wizard.fields.noResultsFound')"
                label="label"
                valueProp="value"
                :canClear="false"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">{{ t('admissions.wizard.fields.hasJudicialFile') }}</label>
              <div class="form-check form-switch">
                <input
                  v-model="admissionData.has_judicial_file"
                  class="form-check-input"
                  type="checkbox"
                  id="hasJudicialFile"
                />
                <label class="form-check-label" for="hasJudicialFile">
                  {{ admissionData.has_judicial_file ? t('admissions.wizard.fields.yes') : t('admissions.wizard.fields.no') }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add New Legal Profile Button -->
      <div class="mb-4">
        <button type="button" @click="addLegalProfile" class="btn btn-primary">
          <i class="ki-duotone ki-plus fs-3"></i>
          {{ t('admissions.wizard.messages.addLegalCase') }}
        </button>
        <small class="text-muted ms-3">
          <i class="fas fa-info-circle"></i>
          {{ t('admissions.wizard.messages.legalProfilesOptional') }}
        </small>
      </div>

      <!-- Legal Profile Cards -->
      <div v-for="(profile, profileIndex) in legalProfiles" :key="profile.id" class="card mb-4 border">
        <div class="card-header bg-light">
          <div class="d-flex justify-content-between align-items-center">
            <h6 class="mb-0">{{ t('admissions.wizard.sections.legalCase') }} #{{ profileIndex + 1 }}</h6>
            <button
              v-if="legalProfiles.length > 1"
              type="button"
              @click="removeLegalProfile(profileIndex)"
              class="btn btn-sm btn-danger"
            >
              <i class="ki-duotone ki-trash fs-5"></i>
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <!-- Case Information -->
            <div class="col-md-6">
              <label class="form-label required">{{ t('admissions.wizard.fields.caseNumber') }}</label>
              <input
                v-model="profile.case_number"
                type="text"
                class="form-control form-control-sm"
                placeholder="MP-001-2024-12345"
                required
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">{{ t('admissions.wizard.fields.judicialFile') }}</label>
              <input
                v-model="profile.judicial_file_number"
                type="text"
                class="form-control form-control-sm"
                placeholder="EJ-2024-001"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label required">{{ t('admissions.wizard.fields.court') }}</label>
              <Multiselect
                v-model="profile.court_id"
                :options="courtOptions"
                :searchable="true"
                :placeholder="t('admissions.wizard.fields.selectCourt')"
                :noOptionsText="t('admissions.wizard.fields.noOptionsAvailable')"
                :noResultsText="t('admissions.wizard.fields.noResultsFound')"
                label="label"
                valueProp="value"
                class="multiselect-sm"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">{{ t('admissions.wizard.fields.proceduralStatus') }}</label>
              <select v-model="profile.procedural_status_id" class="form-select form-select-sm">
                <option value="">{{ t('admissions.wizard.fields.select') }}</option>
                <option v-for="status in proceduralStatuses" :key="status.id" :value="status.id">
                  {{ status.name }}
                </option>
              </select>
            </div>

            <!-- Prosecutor Information -->
            <div class="col-md-6">
              <label class="form-label">{{ t('admissions.wizard.fields.prosecutor') }}</label>
              <input
                v-model="profile.prosecutor_name"
                type="text"
                class="form-control form-control-sm"
                :placeholder="t('admissions.wizard.fields.prosecutor')"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">{{ t('admissions.wizard.fields.prosecutorOffice') }}</label>
              <input
                v-model="profile.prosecutor_office"
                type="text"
                class="form-control form-control-sm"
                placeholder="MP - Agencia 01"
              />
            </div>

            <!-- Defense Information -->
            <div class="col-md-4">
              <label class="form-label">{{ t('admissions.wizard.fields.defenseAttorney') }}</label>
              <input
                v-model="profile.defense_attorney_name"
                type="text"
                class="form-control form-control-sm"
                :placeholder="t('admissions.wizard.fields.defenseAttorney')"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">{{ t('admissions.wizard.fields.defensePhone') }}</label>
              <input
                v-model="profile.defense_attorney_phone"
                type="text"
                class="form-control form-control-sm"
                :placeholder="t('admissions.wizard.messages.phonePlaceholder')"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">{{ t('admissions.wizard.fields.defenseType') }}</label>
              <select v-model="profile.defense_type" class="form-select form-select-sm">
                <option v-for="type in defenseTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
            </div>

            <!-- Preventive Detention -->
            <div class="col-md-6">
              <div class="form-check form-switch">
                <input
                  v-model="profile.in_preventive_detention"
                  class="form-check-input"
                  type="checkbox"
                  :id="'preventive_' + profile.id"
                />
                <label class="form-check-label" :for="'preventive_' + profile.id">
                  {{ t('admissions.wizard.fields.preventiveDetention') }}
                </label>
              </div>
            </div>
            <div v-if="profile.in_preventive_detention" class="col-md-6">
              <label class="form-label">{{ t('admissions.wizard.fields.preventiveDetentionStart') }}</label>
              <input
                v-model="profile.preventive_detention_start"
                type="date"
                class="form-control form-control-sm"
              />
            </div>

            <!-- Crimes Section -->
            <div class="col-12">
              <div class="d-flex justify-content-between align-items-center mt-3 mb-2">
                <label class="form-label mb-0">{{ t('admissions.wizard.sections.chargedCrimes') }}</label>
                <button
                  type="button"
                  @click="addCrimeToProfile(profileIndex)"
                  class="btn btn-sm btn-secondary"
                >
                  <i class="ki-duotone ki-plus fs-6"></i>
                  {{ t('admissions.wizard.buttons.addCrime') }}
                </button>
              </div>

              <div v-if="profile.crimes.length === 0" class="alert alert-warning py-2">
                {{ t('admissions.wizard.messages.noCrimesRegistered') }}
              </div>

              <div v-else class="table-responsive">
                <table class="table table-sm table-bordered">
                  <thead>
                    <tr>
                      <th style="min-width: 200px;">{{ t('admissions.wizard.fields.crime') }}</th>
                      <th>{{ t('admissions.wizard.fields.crimeDescription') }}</th>
                      <th style="width: 130px;">{{ t('admissions.wizard.fields.crimeDate') }}</th>
                      <th>{{ t('admissions.wizard.fields.crimeLocation') }}</th>
                      <th style="width: 50px;"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(crime, crimeIndex) in profile.crimes" :key="crimeIndex">
                      <td>
                        <Multiselect
                          v-model="crime.crime_id"
                          :options="crimeOptions"
                          :searchable="true"
                          :placeholder="t('admissions.wizard.fields.selectCrime')"
                          :noOptionsText="t('admissions.wizard.fields.noOptionsAvailable')"
                          :noResultsText="t('admissions.wizard.fields.noResultsFound')"
                          label="label"
                          valueProp="value"
                          class="multiselect-sm"
                        />
                      </td>
                      <td>
                        <input
                          v-model="crime.crime_description"
                          type="text"
                          class="form-control form-control-sm"
                          :placeholder="t('admissions.wizard.fields.crimeDescription')"
                        />
                      </td>
                      <td>
                        <input
                          v-model="crime.crime_date"
                          type="date"
                          class="form-control form-control-sm"
                        />
                      </td>
                      <td>
                        <input
                          v-model="crime.crime_location"
                          type="text"
                          class="form-control form-control-sm"
                          :placeholder="t('admissions.wizard.fields.crimeLocation')"
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          @click="removeCrimeFromProfile(profileIndex, crimeIndex)"
                          class="btn btn-sm btn-danger"
                        >
                          <i class="ki-duotone ki-trash fs-6"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Document Verification -->
      <div class="separator my-5"></div>
      <h5 class="mb-4">{{ t('admissions.wizard.sections.documentVerification') }}</h5>
      <div class="row g-3">
        <div class="col-md-4">
          <div class="form-check">
            <input
              v-model="verifications.legal_documents"
              class="form-check-input"
              type="checkbox"
              id="legalDocs"
            />
            <label class="form-check-label" for="legalDocs">
              {{ t('admissions.wizard.fields.legalDocsVerified') }}
            </label>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-check">
            <input
              v-model="verifications.identity"
              class="form-check-input"
              type="checkbox"
              id="identity"
            />
            <label class="form-check-label" for="identity">
              {{ t('admissions.wizard.fields.identityVerified') }}
            </label>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-check">
            <input
              v-model="verifications.court_order"
              class="form-check-input"
              type="checkbox"
              id="courtOrder"
            />
            <label class="form-check-label" for="courtOrder">
              {{ t('admissions.wizard.fields.courtOrderValid') }}
            </label>
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
  admissionData,
  legalProfiles,
  verifications,
  courts,
  centers,
  proceduralStatuses,
  crimes,
  admissionTypes,
  defenseTypes,
  addLegalProfile,
  removeLegalProfile,
  addCrimeToProfile,
  removeCrimeFromProfile
} = useAdmissionWizard();

// Convert catalogs to options format for Multiselect
const courtOptions = computed(() =>
  courts.value.map((court: any) => ({
    value: court.id,
    label: court.name
  }))
);

const centerOptions = computed(() =>
  centers.value.map((center: any) => ({
    value: center.id,
    label: center.name
  }))
);

const crimeOptions = computed(() =>
  crimes.value.map((crime: any) => ({
    value: crime.id,
    label: crime.name
  }))
);
</script>

<style scoped>
.multiselect-sm {
  --ms-font-size: 0.875rem;
  --ms-line-height: 1.25;
  --ms-py: 0.25rem;
  --ms-px: 0.5rem;
  --ms-tag-font-size: 0.75rem;
}
</style>
