<template>
  <div>
    <!-- Quick Summary Strip -->
    <div class="row g-4 mb-6">
      <div class="col-6 col-md-3">
        <div class="border border-dashed border-gray-300 rounded p-4 text-center">
          <div class="fs-4 fw-bold" :class="getStatusTextClass(inmate?.status)">
            {{ t(`inmates.tabs.overview.statuses.${inmate?.status}`) || inmate?.status || t('inmates.tabs.overview.na') }}
          </div>
          <div class="text-gray-500 fw-semibold fs-7">{{ t('inmates.tabs.overview.summaryStrip.status') }}</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="border border-dashed border-gray-300 rounded p-4 text-center">
          <div class="fs-4 fw-bold text-gray-800">
            {{ inmate?.currentCenter?.name || inmate?.current_center?.name || t('inmates.tabs.overview.summaryStrip.noCenter') }}
          </div>
          <div class="text-gray-500 fw-semibold fs-7">{{ t('inmates.tabs.overview.summaryStrip.center') }}</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="border border-dashed border-gray-300 rounded p-4 text-center">
          <div class="fs-4 fw-bold">
            <span v-if="currentSecurityLevel" class="badge" :class="getSecurityLevelBadgeClass(currentSecurityLevel)">
              {{ t(`inmates.tabs.overview.securityLevels.${currentSecurityLevel}`) }}
            </span>
            <span v-else class="text-gray-400">{{ t('inmates.tabs.overview.summaryStrip.noClassification') }}</span>
          </div>
          <div class="text-gray-500 fw-semibold fs-7">{{ t('inmates.tabs.overview.summaryStrip.securityLevel') }}</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="border border-dashed border-gray-300 rounded p-4 text-center">
          <div class="fs-4 fw-bold text-gray-800">
            {{ daysSinceAdmission }}
          </div>
          <div class="text-gray-500 fw-semibold fs-7">{{ t('inmates.tabs.overview.summaryStrip.daysIncarcerated') }}</div>
        </div>
      </div>
    </div>

    <div class="row g-6">
      <!-- Personal Information -->
      <div class="col-lg-6">
        <div class="card card-flush h-100">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-800">{{ t('inmates.tabs.overview.personalInfo.title') }}</span>
            </h3>
          </div>
          <div class="card-body pt-3">
            <table class="table table-row-dashed table-row-gray-300 gy-4">
              <tbody>
                <tr>
                  <td class="fw-semibold text-gray-600 w-175px">{{ t('inmates.tabs.overview.personalInfo.fullName') }}</td>
                  <td class="text-gray-800 fw-bold">{{ getInmateFullName }}</td>
                </tr>
                <tr v-if="inmate?.alias">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.personalInfo.alias') }}</td>
                  <td class="text-gray-800">{{ inmate.alias }}</td>
                </tr>
                <tr>
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.personalInfo.document') }}</td>
                  <td class="text-gray-800">
                    {{ inmate?.document_number || t('inmates.tabs.overview.na') }}
                    <span v-if="inmate?.documentType?.name || inmate?.document_type?.name" class="text-muted fs-7">
                      ({{ inmate?.documentType?.name || inmate?.document_type?.name }})
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.personalInfo.birthDate') }}</td>
                  <td class="text-gray-800">
                    {{ inmate?.birth_date ? formatDate(inmate.birth_date) : t('inmates.tabs.overview.na') }}
                    <span v-if="inmate?.age" class="text-muted fs-7">({{ inmate.age }} {{ t('inmates.tabs.overview.personalInfo.years') }})</span>
                  </td>
                </tr>
                <tr>
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.personalInfo.gender') }}</td>
                  <td class="text-gray-800">
                    {{ inmate?.gender === 'M' ? t('inmates.tabs.overview.personalInfo.male') : inmate?.gender === 'F' ? t('inmates.tabs.overview.personalInfo.female') : t('inmates.tabs.overview.na') }}
                  </td>
                </tr>
                <tr>
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.personalInfo.nationality') }}</td>
                  <td class="text-gray-800">{{ inmate?.nationality?.name || t('inmates.tabs.overview.na') }}</td>
                </tr>
                <tr v-if="inmate?.civilStatus?.name || inmate?.civil_status?.name">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.personalInfo.civilStatus') }}</td>
                  <td class="text-gray-800">{{ inmate?.civilStatus?.name || inmate?.civil_status?.name }}</td>
                </tr>
                <tr v-if="inmate?.ethnicGroup?.name || inmate?.ethnic_group?.name">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.personalInfo.ethnicGroup') }}</td>
                  <td class="text-gray-800">{{ inmate?.ethnicGroup?.name || inmate?.ethnic_group?.name }}</td>
                </tr>
                <tr>
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.personalInfo.primaryLanguage') }}</td>
                  <td class="text-gray-800">
                    {{ inmate?.primaryLanguage?.name || inmate?.primary_language?.name || t('inmates.tabs.overview.na') }}
                    <span v-if="inmate?.requires_interpreter" class="badge badge-light-warning ms-2">{{ t('inmates.tabs.overview.personalInfo.requiresInterpreter') }}</span>
                  </td>
                </tr>
                <tr v-if="inmate?.religion?.name">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.personalInfo.religion') }}</td>
                  <td class="text-gray-800">{{ inmate.religion.name }}</td>
                </tr>
                <tr v-if="birthPlace">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.locationInfo.birthPlace') }}</td>
                  <td class="text-gray-800">{{ birthPlace }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Institutional Information -->
      <div class="col-lg-6">
        <div class="card card-flush h-100">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-800">{{ t('inmates.tabs.overview.institutionalInfo.title') }}</span>
            </h3>
          </div>
          <div class="card-body pt-3">
            <table class="table table-row-dashed table-row-gray-300 gy-4">
              <tbody>
                <tr>
                  <td class="fw-semibold text-gray-600 w-175px">{{ t('inmates.tabs.overview.institutionalInfo.inmateNumber') }}</td>
                  <td class="text-gray-800 fw-bold">{{ inmate?.inmate_number || t('inmates.tabs.overview.na') }}</td>
                </tr>
                <tr v-if="inmate?.case_number">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.institutionalInfo.caseNumber') }}</td>
                  <td class="text-gray-800">{{ inmate.case_number }}</td>
                </tr>
                <tr>
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.institutionalInfo.currentCenter') }}</td>
                  <td class="text-gray-800">{{ inmate?.currentCenter?.name || inmate?.current_center?.name || t('inmates.tabs.overview.na') }}</td>
                </tr>
                <tr>
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.sectorCell') }}</td>
                  <td class="text-gray-800">
                    {{ inmate?.currentSector?.name || inmate?.current_sector?.name || t('inmates.tabs.overview.na') }}
                    <span v-if="inmate?.current_cell_number" class="text-muted"> / {{ inmate.current_cell_number }}</span>
                  </td>
                </tr>
                <tr>
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.institutionalInfo.admissionDate') }}</td>
                  <td class="text-gray-800">
                    {{ inmate?.admission_date ? formatDate(inmate.admission_date) : t('inmates.tabs.overview.na') }}
                    <span v-if="inmate?.admission_datetime" class="text-muted fs-7">
                      {{ formatTime(inmate.admission_datetime) }}
                    </span>
                  </td>
                </tr>
                <tr v-if="inmate?.admission_type">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.institutionalInfo.admissionType') }}</td>
                  <td class="text-gray-800">{{ t(`common.admissionType.${inmate.admission_type}`) }}</td>
                </tr>
                <tr>
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.institutionalInfo.legalStatus') }}</td>
                  <td class="text-gray-800">
                    <span class="badge badge-light-info">{{ t(`inmates.tabs.overview.legalStatuses.${inmate?.legal_status}`) || t('inmates.tabs.overview.na') }}</span>
                  </td>
                </tr>
                <tr v-if="inmate?.proceduralStatus?.name || inmate?.procedural_status?.name">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.institutionalInfo.proceduralStatus') }}</td>
                  <td class="text-gray-800">{{ inmate?.proceduralStatus?.name || inmate?.procedural_status?.name }}</td>
                </tr>
                <tr v-if="inmate?.remittingCourt?.name || inmate?.remitting_court?.name">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.institutionalInfo.remittingCourt') }}</td>
                  <td class="text-gray-800">{{ inmate?.remittingCourt?.name || inmate?.remitting_court?.name }}</td>
                </tr>
                <tr v-if="inmate?.admission_order_number">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.institutionalInfo.admissionOrderNumber') }}</td>
                  <td class="text-gray-800">{{ inmate.admission_order_number }}</td>
                </tr>
                <tr v-if="inmate?.remission_document_number">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.institutionalInfo.remissionDocument') }}</td>
                  <td class="text-gray-800">{{ inmate.remission_document_number }}</td>
                </tr>
                <tr>
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.institutionalInfo.judicialFile') }}</td>
                  <td>
                    <span :class="inmate?.has_judicial_file ? 'badge badge-light-success' : 'badge badge-light-danger'">
                      {{ inmate?.has_judicial_file ? t('inmates.tabs.overview.institutionalInfo.available') : t('inmates.tabs.overview.institutionalInfo.notAvailable') }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Security & Risk Summary -->
      <div class="col-lg-6">
        <div class="card card-flush h-100">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-800">{{ t('inmates.tabs.overview.securitySummary.title') }}</span>
            </h3>
          </div>
          <div class="card-body pt-3">
            <table class="table table-row-dashed table-row-gray-300 gy-4">
              <tbody>
                <tr>
                  <td class="fw-semibold text-gray-600 w-175px">{{ t('inmates.tabs.overview.securitySummary.classification') }}</td>
                  <td>
                    <span v-if="currentSecurityLevel" class="badge" :class="getSecurityLevelBadgeClass(currentSecurityLevel)">
                      {{ t(`inmates.tabs.overview.securityLevels.${currentSecurityLevel}`) }}
                    </span>
                    <span v-else class="text-gray-400">{{ t('inmates.tabs.overview.summaryStrip.noClassification') }}</span>
                  </td>
                </tr>
                <tr v-if="currentClassification">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.securitySummary.overallRisk') }}</td>
                  <td>
                    <span class="badge" :class="getOverallRiskBadge(currentClassification.overall_risk_score)">
                      {{ currentClassification.overall_risk_score ?? 0 }}/50
                    </span>
                    <span v-if="currentClassification.overall_risk_level" class="text-muted fs-7 ms-2">
                      ({{ t(`inmates.tabs.overview.overallRiskLevels.${currentClassification.overall_risk_level}`) }})
                    </span>
                  </td>
                </tr>
                <tr v-if="inmate?.riskClassification || inmate?.risk_classification">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.securitySummary.riskClassification') }}</td>
                  <td>
                    <span class="badge" :class="getRiskBadgeClass((inmate?.riskClassification || inmate?.risk_classification)?.code)">
                      {{ (inmate?.riskClassification || inmate?.risk_classification)?.name }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.securitySummary.gangAffiliation') }}</td>
                  <td>
                    <span class="badge" :class="getGangBadgeClass(inmate?.gang_affiliation_status)">
                      {{ t(`inmates.tabs.overview.gangStatuses.${inmate?.gang_affiliation_status || 'none'}`) }}
                    </span>
                  </td>
                </tr>
                <tr v-if="currentClassification?.next_review_date">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.securitySummary.nextReview') }}</td>
                  <td class="text-gray-800">
                    {{ formatDate(currentClassification.next_review_date) }}
                    <span v-if="isReviewOverdue" class="badge badge-light-danger ms-2">{{ t('inmates.tabs.overview.securitySummary.overdue') }}</span>
                  </td>
                </tr>
                <tr>
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.securitySummary.biometrics') }}</td>
                  <td>
                    <span :class="inmate?.has_biometric_data ? 'badge badge-light-success' : 'badge badge-light-warning'">
                      {{ inmate?.has_biometric_data ? t('inmates.tabs.overview.securitySummary.registered') : t('inmates.tabs.overview.securitySummary.pending') }}
                    </span>
                  </td>
                </tr>
                <tr v-if="inmate?.requires_special_protection">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.securitySummary.specialProtection') }}</td>
                  <td>
                    <span class="badge badge-light-danger">{{ t('inmates.tabs.overview.securitySummary.required') }}</span>
                    <span v-if="inmate.protection_reasons" class="text-muted fs-7 ms-2">{{ inmate.protection_reasons }}</span>
                  </td>
                </tr>
                <tr v-if="inmate?.high_profile_case">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.securitySummary.highProfile') }}</td>
                  <td><span class="badge badge-light-danger">{{ t('inmates.tabs.overview.personalInfo.yes') }}</span></td>
                </tr>
                <tr v-if="inmate?.communication_monitoring">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.securitySummary.communicationMonitoring') }}</td>
                  <td><span class="badge badge-light-warning">{{ t('inmates.tabs.overview.securitySummary.active') }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Socioeconomic & Education -->
      <div class="col-lg-6">
        <div class="card card-flush h-100">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-800">{{ t('inmates.tabs.overview.socioeconomicProfile.title') }}</span>
            </h3>
          </div>
          <div class="card-body pt-3">
            <table class="table table-row-dashed table-row-gray-300 gy-4">
              <tbody>
                <tr>
                  <td class="fw-semibold text-gray-600 w-175px">{{ t('inmates.tabs.overview.professionalInfo.academicDegree') }}</td>
                  <td class="text-gray-800">{{ inmate?.academicDegree?.name || inmate?.academic_degree?.name || t('inmates.tabs.overview.na') }}</td>
                </tr>
                <tr>
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.professionalInfo.occupation') }}</td>
                  <td class="text-gray-800">
                    {{ inmate?.occupation?.name || t('inmates.tabs.overview.na') }}
                    <span v-if="inmate?.occupation_details" class="text-muted fs-7 d-block">{{ inmate.occupation_details }}</span>
                  </td>
                </tr>
                <tr v-if="inmate?.previous_occupation">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.professionalInfo.previousOccupation') }}</td>
                  <td class="text-gray-800">{{ inmate.previous_occupation }}</td>
                </tr>
                <tr v-if="inmate?.work_experience">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.professionalInfo.workExperience') }}</td>
                  <td class="text-gray-800">{{ inmate.work_experience }}</td>
                </tr>
                <tr v-if="inmate?.skills_and_abilities">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.professionalInfo.skillsAndAbilities') }}</td>
                  <td class="text-gray-800">{{ inmate.skills_and_abilities }}</td>
                </tr>
                <tr v-if="inmate?.socioeconomicLevel?.name || inmate?.socioeconomic_level?.name">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.professionalInfo.socioeconomicLevel') }}</td>
                  <td class="text-gray-800">{{ inmate?.socioeconomicLevel?.name || inmate?.socioeconomic_level?.name }}</td>
                </tr>
                <tr v-if="inmate?.cultural_practices">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.professionalInfo.culturalPractices') }}</td>
                  <td class="text-gray-800">{{ t(`inmates.tabs.overview.culturalPractices.${inmate.cultural_practices}`) }}</td>
                </tr>
                <tr v-if="inmate?.special_cultural_needs">
                  <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.professionalInfo.specialCulturalNeeds') }}</td>
                  <td class="text-gray-800">{{ inmate.special_cultural_needs }}</td>
                </tr>
              </tbody>
            </table>

            <!-- Emergency Contact -->
            <div v-if="inmate?.emergency_contact_name" class="mt-6 pt-4 border-top">
              <h5 class="fw-bold text-gray-800 mb-4">{{ t('inmates.tabs.overview.socioeconomicProfile.emergencyContact') }}</h5>
              <table class="table table-row-dashed table-row-gray-300 gy-4">
                <tbody>
                  <tr>
                    <td class="fw-semibold text-gray-600 w-175px">{{ t('inmates.tabs.overview.locationInfo.name') }}</td>
                    <td class="text-gray-800">{{ inmate.emergency_contact_name }}</td>
                  </tr>
                  <tr v-if="inmate?.emergency_contact_phone">
                    <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.locationInfo.phone') }}</td>
                    <td class="text-gray-800">{{ inmate.emergency_contact_phone }}</td>
                  </tr>
                  <tr v-if="inmate?.emergencyContactRelationship?.name || inmate?.emergency_contact_relationship?.name">
                    <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.locationInfo.relationship') }}</td>
                    <td class="text-gray-800">{{ inmate?.emergencyContactRelationship?.name || inmate?.emergency_contact_relationship?.name }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Residence -->
            <div v-if="inmate?.address || inmate?.municipality?.name" class="mt-6 pt-4 border-top">
              <h5 class="fw-bold text-gray-800 mb-4">{{ t('inmates.tabs.overview.socioeconomicProfile.residenceAddress') }}</h5>
              <table class="table table-row-dashed table-row-gray-300 gy-4">
                <tbody>
                  <tr v-if="inmate?.address">
                    <td class="fw-semibold text-gray-600 w-175px">{{ t('inmates.tabs.overview.locationInfo.residenceAddress') }}</td>
                    <td class="text-gray-800">{{ inmate.address }}</td>
                  </tr>
                  <tr v-if="inmate?.municipality?.name">
                    <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.locationInfo.municipality') }}</td>
                    <td class="text-gray-800">
                      {{ inmate.municipality.name }}
                      <span v-if="inmate?.department?.name" class="text-muted">, {{ inmate.department.name }}</span>
                    </td>
                  </tr>
                  <tr v-if="inmate?.phone">
                    <td class="fw-semibold text-gray-600">{{ t('inmates.tabs.overview.locationInfo.phone') }}</td>
                    <td class="text-gray-800">{{ inmate.phone }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes & Observations (only if any content exists) -->
      <div
        v-if="inmate?.general_notes || inmate?.observations || inmate?.medical_observations || inmate?.admission_reason || inmate?.requires_lgbtiq_accommodations"
        class="col-12"
      >
        <div class="card card-flush">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-800">{{ t('inmates.tabs.overview.notesAndObservations.title') }}</span>
            </h3>
          </div>
          <div class="card-body pt-3">
            <div class="row g-4">
              <div v-if="inmate?.admission_reason" class="col-12">
                <div class="fw-semibold text-gray-600 mb-1">{{ t('inmates.tabs.overview.notesAndObservations.admissionReason') }}</div>
                <div class="text-gray-800 bg-light rounded p-3">{{ inmate.admission_reason }}</div>
              </div>
              <div v-if="inmate?.general_notes" class="col-12">
                <div class="fw-semibold text-gray-600 mb-1">{{ t('inmates.tabs.overview.specialAccommodations.generalNotes') }}</div>
                <div class="text-gray-800 bg-light rounded p-3">{{ inmate.general_notes }}</div>
              </div>
              <div v-if="inmate?.observations" class="col-12">
                <div class="fw-semibold text-gray-600 mb-1">{{ t('inmates.tabs.overview.specialAccommodations.observations') }}</div>
                <div class="text-gray-800 bg-light rounded p-3">{{ inmate.observations }}</div>
              </div>
              <div v-if="inmate?.medical_observations" class="col-12">
                <div class="fw-semibold text-gray-600 mb-1">{{ t('inmates.tabs.overview.specialAccommodations.medicalObservations') }}</div>
                <div class="text-gray-800 bg-light-warning rounded p-3">{{ inmate.medical_observations }}</div>
              </div>
              <div v-if="inmate?.requires_lgbtiq_accommodations" class="col-md-6">
                <div class="fw-semibold text-gray-600 mb-1">{{ t('inmates.tabs.overview.specialAccommodations.lgbtiqAccommodations') }}</div>
                <div class="text-gray-800 bg-light-primary rounded p-3">
                  <span class="badge badge-light-primary me-2">{{ t('inmates.tabs.overview.securitySummary.required') }}</span>
                  {{ inmate?.lgbtiq_accommodation_notes || '' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { formatDate as formatDateHelper } from "@/core/helpers/formatters";

interface Props {
  inmate: any;
}

const props = defineProps<Props>();
const { t } = useI18n();

// ── Computed: Security Classification ──
const currentClassification = computed(() => {
  return props.inmate?.current_security_classification
    || props.inmate?.currentSecurityClassification
    || null;
});

const currentSecurityLevel = computed(() => {
  return currentClassification.value?.security_level
    || props.inmate?.security_level
    || null;
});

const isReviewOverdue = computed(() => {
  const d = currentClassification.value?.next_review_date;
  if (!d) return false;
  return new Date(d) < new Date();
});

const daysSinceAdmission = computed(() => {
  if (!props.inmate?.admission_date) return t('inmates.tabs.overview.na');
  const diff = Math.floor((Date.now() - new Date(props.inmate.admission_date).getTime()) / 86400000);
  return diff >= 0 ? diff : 0;
});

const getInmateFullName = computed(() => {
  if (!props.inmate) return t('inmates.tabs.overview.noName');
  const parts = [
    props.inmate.first_name,
    props.inmate.middle_name,
    props.inmate.third_name,
    props.inmate.last_name,
    props.inmate.second_last_name,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : t('inmates.tabs.overview.noName');
});

const birthPlace = computed(() => {
  if (!props.inmate) return null;
  const parts: string[] = [];
  const municipality = props.inmate.birthMunicipality || props.inmate.birth_municipality;
  const department = props.inmate.birthDepartment || props.inmate.birth_department;
  const country = props.inmate.birthCountry || props.inmate.birth_country;
  if (municipality?.name) parts.push(municipality.name);
  if (department?.name) parts.push(department.name);
  if (country?.name) parts.push(country.name);
  return parts.length > 0 ? parts.join(", ") : null;
});

// ── Formatters ──
const formatDate = (date: string) => {
  return formatDateHelper(date, "d 'de' MMMM 'de' yyyy");
};

const formatTime = (datetime: string) => {
  if (!datetime) return '';
  try {
    return new Date(datetime).toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" });
  } catch { return ''; }
};

// ── Status helpers ──
const getStatusTextClass = (status: string) => ({
  active: 'text-success', released: 'text-info', transferred: 'text-warning',
  deceased: 'text-dark', court_hearing: 'text-primary', escaped: 'text-danger',
  hospital_external: 'text-danger', hospital_internal: 'text-warning', isolation: 'text-warning',
}[status] || 'text-gray-600');

// ── Security helpers ──
const getSecurityLevelBadgeClass = (level: string) => ({
  minimum: 'badge-light-success', medium: 'badge-light-warning',
  maximum: 'badge-danger', super_maximum: 'badge-dark',
}[level] || 'badge-light-secondary');

const getOverallRiskBadge = (score: number | null) => {
  if (score === null || score === undefined) return 'badge-light-secondary';
  if (score >= 40) return 'badge-danger';
  if (score >= 30) return 'badge-light-danger';
  if (score >= 20) return 'badge-light-warning';
  return 'badge-light-success';
};

const getRiskBadgeClass = (code: string) => {
  const classMap: Record<string, string> = {
    low: 'badge-light-success', medium: 'badge-light-warning',
    high: 'badge-light-danger', very_high: 'badge-dark',
    MIN: 'badge-light-success', MOD: 'badge-light-warning',
    ALT: 'badge-light-danger', CRI: 'badge-danger',
  };
  return classMap[code] || 'badge-light-secondary';
};

const getGangBadgeClass = (status: string) => ({
  none: 'badge-light-success',
  suspected_ms13: 'badge-light-warning', confirmed_ms13: 'badge-danger',
  suspected_barrio18: 'badge-light-warning', confirmed_barrio18: 'badge-danger',
  other_gang: 'badge-light-danger', gang_leader: 'badge-dark',
  protected_witness: 'badge-light-info',
}[status] || 'badge-light-success');
</script>
