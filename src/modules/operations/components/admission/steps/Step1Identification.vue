<template>
  <div class="tab-pane fade show active">
    <div class="w-100">
      <div class="pb-10 pb-lg-15">
        <h2 class="fw-bold d-flex align-items-center text-gray-900">
          {{ t('admissions.wizard.sections.personalIdentification') }}
          <span class="ms-1" data-bs-toggle="tooltip" :title="t('admissions.wizard.messages.enterInmateData')">
            <i class="ki-duotone ki-information fs-6">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
          </span>
        </h2>
        <div class="text-muted fw-semibold fs-6">
          {{ t('admissions.wizard.messages.enterInmateData') }}
        </div>
      </div>

      <!-- Duplicate Warning -->
      <div v-if="duplicateCheckResult" class="alert alert-warning mb-5">
        <div class="d-flex align-items-center">
          <i class="ki-duotone ki-shield-cross fs-2x me-4 text-warning">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <div>
            <h4 class="mb-1 text-warning">{{ t('admissions.wizard.messages.duplicateFound') }}</h4>
            <p class="mb-0">
              {{ t('admissions.wizard.messages.duplicateInfo') }}
              <strong>{{ duplicateCheckResult.full_name }}</strong> -
              {{ duplicateCheckResult.identification_number }}
              <button type="button" class="btn btn-sm btn-warning ms-3" @click="viewDuplicate">
                {{ t('admissions.wizard.messages.viewExisting') }}
              </button>
            </p>
          </div>
        </div>
      </div>

      <!-- Document Section -->
      <div class="card mb-5">
        <div class="card-header">
          <h5 class="card-title">{{ t('admissions.wizard.sections.documentSection') }}</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label required">{{ t('admissions.wizard.fields.documentType') }}</label>
              <select v-model="inmateData.document_type_id" class="form-select" required>
                <option value="">{{ t('admissions.wizard.fields.select') }}</option>
                <option v-for="type in documentTypes" :key="type.id" :value="type.id">
                  {{ type.name }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label required">{{ t('admissions.wizard.fields.documentNumber') }}</label>
              <input
                v-model="inmateData.identification_number"
                type="text"
                class="form-control"
                :placeholder="t('admissions.wizard.fields.documentNumber')"
                @blur="checkForDuplicates"
                required
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">{{ t('admissions.wizard.fields.alias') }}</label>
              <input
                v-model="inmateData.alias"
                type="text"
                class="form-control"
                :placeholder="t('admissions.wizard.fields.alias')"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Names Section -->
      <div class="card mb-5">
        <div class="card-header">
          <h5 class="card-title">{{ t('admissions.wizard.sections.namesSection') }}</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label required">{{ t('admissions.wizard.fields.firstName') }}</label>
              <input
                v-model="inmateData.first_name"
                type="text"
                class="form-control"
                :placeholder="t('admissions.wizard.fields.firstName')"
                @blur="checkForDuplicates"
                required
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">{{ t('admissions.wizard.fields.secondName') }}</label>
              <input
                v-model="inmateData.second_name"
                type="text"
                class="form-control"
                :placeholder="t('admissions.wizard.fields.secondName')"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">{{ t('admissions.wizard.fields.thirdName') }}</label>
              <input
                v-model="inmateData.third_name"
                type="text"
                class="form-control"
                :placeholder="t('admissions.wizard.fields.thirdName')"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label required">{{ t('admissions.wizard.fields.firstSurname') }}</label>
              <input
                v-model="inmateData.first_surname"
                type="text"
                class="form-control"
                :placeholder="t('admissions.wizard.fields.firstSurname')"
                @blur="checkForDuplicates"
                required
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">{{ t('admissions.wizard.fields.secondSurname') }}</label>
              <input
                v-model="inmateData.second_surname"
                type="text"
                class="form-control"
                :placeholder="t('admissions.wizard.fields.secondSurname')"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">{{ t('admissions.wizard.fields.marriedSurname') }}</label>
              <input
                v-model="inmateData.married_surname"
                type="text"
                class="form-control"
                :placeholder="t('admissions.wizard.fields.marriedSurname')"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Personal Information Section -->
      <div class="card mb-5">
        <div class="card-header">
          <h5 class="card-title">{{ t('admissions.wizard.sections.personalInfo') }}</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label required">{{ t('admissions.wizard.fields.birthDate') }}</label>
              <input v-model="inmateData.birth_date" type="date" class="form-control" required />
            </div>
            <div class="col-md-3">
              <label class="form-label required">{{ t('admissions.wizard.fields.gender') }}</label>
              <select v-model="inmateData.gender" class="form-select" required>
                <option value="">{{ t('admissions.wizard.fields.select') }}</option>
                <option value="M">{{ t('admissions.wizard.fields.male') }}</option>
                <option value="F">{{ t('admissions.wizard.fields.female') }}</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">{{ t('admissions.wizard.fields.civilStatus') }}</label>
              <select v-model="inmateData.civil_status_id" class="form-select">
                <option value="">{{ t('admissions.wizard.fields.select') }}</option>
                <option v-for="status in civilStatuses" :key="status.id" :value="status.id">
                  {{ status.name }}
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">{{ t('admissions.wizard.fields.nationality') }}</label>
              <Multiselect
                v-model="inmateData.nationality_id"
                :options="nationalityOptions"
                :searchable="true"
                :placeholder="t('admissions.wizard.fields.selectNationality')"
                :noOptionsText="t('admissions.wizard.fields.noOptionsAvailable')"
                :noResultsText="t('admissions.wizard.fields.noResultsFound')"
                label="label"
                valueProp="value"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">{{ t('admissions.wizard.fields.ethnicGroup') }}</label>
              <select v-model="inmateData.ethnic_group_id" class="form-select">
                <option value="">{{ t('admissions.wizard.fields.select') }}</option>
                <option v-for="group in ethnicGroups" :key="group.id" :value="group.id">
                  {{ group.name }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">{{ t('admissions.wizard.fields.academicDegree') }}</label>
              <select v-model="inmateData.academic_degree_id" class="form-select">
                <option value="">{{ t('admissions.wizard.fields.select') }}</option>
                <option v-for="degree in academicDegrees" :key="degree.id" :value="degree.id">
                  {{ degree.name }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">{{ t('admissions.wizard.fields.occupation') }}</label>
              <Multiselect
                v-model="inmateData.occupation_id"
                :options="occupationOptions"
                :searchable="true"
                :placeholder="t('admissions.wizard.fields.selectOccupation')"
                :noOptionsText="t('admissions.wizard.fields.noOptionsAvailable')"
                :noResultsText="t('admissions.wizard.fields.noResultsFound')"
                label="label"
                valueProp="value"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Birth Place Section -->
      <div class="card mb-5">
        <div class="card-header">
          <h5 class="card-title">{{ t('admissions.wizard.sections.birthPlace') }}</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">{{ t('admissions.wizard.fields.birthCountry') }}</label>
              <Multiselect
                v-model="inmateData.birth_country_id"
                :options="countryOptions"
                :searchable="true"
                :placeholder="t('admissions.wizard.fields.selectCountry')"
                :noOptionsText="t('admissions.wizard.fields.noOptionsAvailable')"
                :noResultsText="t('admissions.wizard.fields.noResultsFound')"
                label="label"
                valueProp="value"
                @select="loadBirthDepartments"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">{{ t('admissions.wizard.fields.birthDepartment') }}</label>
              <Multiselect
                v-model="inmateData.birth_department_id"
                :options="departmentOptions"
                :searchable="true"
                :placeholder="birthDepartments.length === 0 ? t('admissions.wizard.fields.selectFirstCountry') : t('admissions.wizard.fields.selectDepartment')"
                :noOptionsText="t('admissions.wizard.fields.noOptionsAvailable')"
                :noResultsText="t('admissions.wizard.fields.noResultsFound')"
                label="label"
                valueProp="value"
                :disabled="birthDepartments.length === 0"
                @select="loadBirthMunicipalities"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">{{ t('admissions.wizard.fields.birthMunicipality') }}</label>
              <Multiselect
                v-model="inmateData.birth_municipality_id"
                :options="municipalityOptions"
                :searchable="true"
                :placeholder="birthMunicipalities.length === 0 ? t('admissions.wizard.fields.selectFirstDepartment') : t('admissions.wizard.fields.selectMunicipality')"
                :noOptionsText="t('admissions.wizard.fields.noOptionsAvailable')"
                :noResultsText="t('admissions.wizard.fields.noResultsFound')"
                label="label"
                valueProp="value"
                :disabled="birthMunicipalities.length === 0"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="card mb-5">
        <div class="card-header">
          <h5 class="card-title">{{ t('admissions.wizard.sections.contactInfo') }}</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">{{ t('admissions.wizard.fields.address') }}</label>
              <textarea
                v-model="inmateData.address"
                class="form-control"
                rows="2"
                :placeholder="t('admissions.wizard.messages.addressPlaceholder')"
              ></textarea>
            </div>
            <div class="col-md-3">
              <label class="form-label">{{ t('admissions.wizard.fields.phone') }}</label>
              <input
                v-model="inmateData.phone"
                type="text"
                class="form-control"
                :placeholder="t('admissions.wizard.messages.phonePlaceholder')"
              />
            </div>
            <div class="col-md-3">
              <label class="form-label">{{ t('admissions.wizard.fields.email') }}</label>
              <input
                v-model="inmateData.email"
                type="email"
                class="form-control"
                :placeholder="t('admissions.wizard.messages.emailPlaceholder')"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Emergency Contact -->
      <div class="card mb-5">
        <div class="card-header">
          <h5 class="card-title">{{ t('admissions.wizard.sections.emergencyContact') }}</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">{{ t('admissions.wizard.fields.contactFullName') }}</label>
              <input
                v-model="inmateData.emergency_contact_name"
                type="text"
                class="form-control"
                :placeholder="t('admissions.wizard.fields.contactFullName')"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">{{ t('admissions.wizard.fields.phone') }}</label>
              <input
                v-model="inmateData.emergency_contact_phone"
                type="text"
                class="form-control"
                :placeholder="t('admissions.wizard.messages.phonePlaceholder')"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">{{ t('admissions.wizard.fields.relationship') }}</label>
              <select v-model="inmateData.emergency_contact_relationship_id" class="form-select">
                <option value="">{{ t('admissions.wizard.fields.select') }}</option>
                <option v-for="rel in relationshipTypes" :key="rel.id" :value="rel.id">
                  {{ rel.name }}
                </option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label">{{ t('admissions.wizard.fields.contactAddress') }}</label>
              <textarea
                v-model="inmateData.emergency_contact_address"
                class="form-control"
                rows="2"
                :placeholder="t('admissions.wizard.fields.contactAddress')"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Biometric Section -->
      <div class="card">
        <div class="card-header">
          <h5 class="card-title">
            {{ t('admissions.wizard.fields.biometricTitle') }}
            <span class="badge badge-light-info ms-2">{{ t('admissions.wizard.fields.biometricOptional') }}</span>
          </h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-12">
              <div class="alert alert-info py-3">
                <i class="ki-duotone ki-information fs-2 me-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
                {{ t('admissions.wizard.fields.biometricOptionalInfo') }}
              </div>
            </div>

            <div class="col-md-6">
              <button
                type="button"
                class="btn btn-primary w-100"
                @click="startBiometricCapture"
              >
                <i class="ki-duotone ki-fingerprint-scanning fs-2 me-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                  <span class="path4"></span>
                  <span class="path5"></span>
                </i>
                {{ t('admissions.wizard.fields.startBiometric') }}
              </button>
            </div>
            <div class="col-md-6">
              <button
                type="button"
                class="btn btn-secondary w-100"
                :disabled="!inmateId"
                @click="checkBiometricStatus"
              >
                <i class="ki-duotone ki-verify fs-2 me-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                {{ t('admissions.wizard.fields.verifyStatus') }}
              </button>
              <small class="text-muted d-block mt-1" v-if="!inmateId">
                {{ t('admissions.wizard.fields.availableAfterSave') }}
              </small>
            </div>

            <div class="col-12" v-if="biometricData.enrolled">
              <div class="alert alert-success">
                <i class="ki-duotone ki-check-circle fs-2 me-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                {{ t('admissions.wizard.fields.biometricCompleted') }}. {{ biometricData.fingerprints.length || 0 }} {{ t('admissions.wizard.fields.fingerprintsCaptured') }}.
              </div>
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
  inmateId,
  duplicateCheckResult,
  inmateData,
  biometricData,
  documentTypes,
  civilStatuses,
  nationalities,
  ethnicGroups,
  academicDegrees,
  occupations,
  countries,
  birthDepartments,
  birthMunicipalities,
  relationshipTypes,
  checkForDuplicates,
  viewDuplicate,
  loadBirthDepartments,
  loadBirthMunicipalities,
  startBiometricCapture,
  checkBiometricStatus
} = useAdmissionWizard();

// Convert catalogs to options format for Multiselect
const nationalityOptions = computed(() =>
  nationalities.value.map((nat: any) => ({
    value: nat.id,
    label: nat.name
  }))
);

const occupationOptions = computed(() =>
  occupations.value.map((occ: any) => ({
    value: occ.id,
    label: occ.name
  }))
);

const countryOptions = computed(() =>
  countries.value.map((country: any) => ({
    value: country.id,
    label: country.name
  }))
);

const departmentOptions = computed(() =>
  birthDepartments.value.map((dept: any) => ({
    value: dept.id,
    label: dept.name
  }))
);

const municipalityOptions = computed(() =>
  birthMunicipalities.value.map((mun: any) => ({
    value: mun.id,
    label: mun.name
  }))
);
</script>
