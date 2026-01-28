<template>
  <div class="row g-6">
    <!-- Personal Information -->
    <div class="col-lg-6">
      <div class="card h-100">
        <div class="card-header">
          <h3 class="card-title">{{ $t('inmates.tabs.overview.personalInfo.title') }}</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.personalInfo.fullName') }}:</label>
              <div class="form-control-plaintext">{{ getInmateFullName }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.personalInfo.alias') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.alias || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.personalInfo.marriedSurname') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.married_surname || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.personalInfo.document') }}:</label>
              <div class="form-control-plaintext">
                {{ inmate?.document_number || $t('inmates.tabs.overview.na') }}
                <span v-if="inmate?.documentType?.name || inmate?.document_type?.name" class="text-muted">
                  ({{ inmate?.documentType?.name || inmate?.document_type?.name }})
                </span>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.personalInfo.birthDate') }}:</label>
              <div class="form-control-plaintext">
                {{ inmate?.birth_date ? formatDate(inmate.birth_date) : $t('inmates.tabs.overview.na') }}
                <span v-if="inmate?.age" class="text-muted">({{ inmate.age }} {{ $t('inmates.tabs.overview.personalInfo.years') }})</span>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.personalInfo.gender') }}:</label>
              <div class="form-control-plaintext">
                {{
                  inmate?.gender === "M"
                    ? $t('inmates.tabs.overview.personalInfo.male')
                    : inmate?.gender === "F"
                      ? $t('inmates.tabs.overview.personalInfo.female')
                      : $t('inmates.tabs.overview.na')
                }}
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.personalInfo.genderIdentity') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.genderIdentity?.name || inmate?.gender_identity?.name || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.personalInfo.sexualOrientation') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.sexualOrientation?.name || inmate?.sexual_orientation?.name || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.personalInfo.civilStatus') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.civilStatus?.name || inmate?.civil_status?.name || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.personalInfo.nationality') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.nationality?.name || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.personalInfo.ethnicGroup') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.ethnicGroup?.name || inmate?.ethnic_group?.name || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.personalInfo.religion') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.religion?.name || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.personalInfo.primaryLanguage') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.primaryLanguage?.name || inmate?.primary_language?.name || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.personalInfo.requiresInterpreter') }}:</label>
              <div class="form-control-plaintext">
                <span :class="inmate?.requires_interpreter ? 'badge badge-light-warning' : 'badge badge-light-success'">
                  {{ inmate?.requires_interpreter ? $t('inmates.tabs.overview.personalInfo.yes') : $t('inmates.tabs.overview.personalInfo.no') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Professional and Social Information -->
    <div class="col-lg-6">
      <div class="card h-100">
        <div class="card-header">
          <h3 class="card-title">{{ $t('inmates.tabs.overview.professionalInfo.title') }}</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.professionalInfo.academicDegree') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.academicDegree?.name || inmate?.academic_degree?.name || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.professionalInfo.occupation') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.occupation?.name || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-12" v-if="inmate?.occupation_details">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.professionalInfo.occupationDetails') }}:</label>
              <div class="form-control-plaintext">{{ inmate.occupation_details }}</div>
            </div>

            <div class="col-12" v-if="inmate?.previous_occupation">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.professionalInfo.previousOccupation') }}:</label>
              <div class="form-control-plaintext">{{ inmate.previous_occupation }}</div>
            </div>

            <div class="col-12" v-if="inmate?.work_experience">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.professionalInfo.workExperience') }}:</label>
              <div class="form-control-plaintext">{{ inmate.work_experience }}</div>
            </div>

            <div class="col-12" v-if="inmate?.skills_and_abilities">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.professionalInfo.skillsAndAbilities') }}:</label>
              <div class="form-control-plaintext">{{ inmate.skills_and_abilities }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.professionalInfo.socioeconomicLevel') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.socioeconomicLevel?.name || inmate?.socioeconomic_level?.name || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.professionalInfo.bloodType') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.bloodType?.name || inmate?.blood_type?.name || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-12" v-if="inmate?.cultural_practices">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.professionalInfo.culturalPractices') }}:</label>
              <div class="form-control-plaintext">{{ getCulturalPracticesLabel(inmate.cultural_practices) }}</div>
            </div>

            <div class="col-12" v-if="inmate?.special_cultural_needs">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.professionalInfo.specialCulturalNeeds') }}:</label>
              <div class="form-control-plaintext">{{ inmate.special_cultural_needs }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Location and Contact Information -->
    <div class="col-lg-6">
      <div class="card h-100">
        <div class="card-header">
          <h3 class="card-title">{{ $t('inmates.tabs.overview.locationInfo.title') }}</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.locationInfo.birthPlace') }}:</label>
              <div class="form-control-plaintext">
                <span v-if="inmate?.birth_country || inmate?.birth_department || inmate?.birth_municipality">
                  {{ getBirthPlaceLabel() }}
                </span>
                <span v-else>{{ $t('inmates.tabs.overview.na') }}</span>
              </div>
            </div>

            <div class="col-12">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.locationInfo.residenceAddress') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.address || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.locationInfo.municipality') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.municipality?.name || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.locationInfo.department') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.department?.name || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.locationInfo.country') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.country?.name || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.locationInfo.phone') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.phone || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-12">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.locationInfo.email') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.email || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-12">
              <h5 class="fw-bold text-gray-800 mt-4">{{ $t('inmates.tabs.overview.locationInfo.emergencyContact') }}</h5>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.locationInfo.name') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.emergency_contact_name || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.locationInfo.phone') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.emergency_contact_phone || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.locationInfo.relationship') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.emergencyContactRelationship?.name || inmate?.emergency_contact_relationship?.name || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.locationInfo.contactLanguage') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.emergencyContactLanguage?.name || inmate?.emergency_contact_language?.name || $t('inmates.tabs.overview.na') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Institutional Information -->
    <div class="col-lg-6">
      <div class="card h-100">
        <div class="card-header">
          <h3 class="card-title">{{ $t('inmates.tabs.overview.institutionalInfo.title') }}</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.institutionalInfo.inmateNumber') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.inmate_number || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.institutionalInfo.caseNumber') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.case_number || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.institutionalInfo.currentCenter') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.currentCenter?.name || inmate?.current_center?.name || $t('inmates.tabs.overview.institutionalInfo.noCenter') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.institutionalInfo.sector') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.currentSector?.name || inmate?.current_sector?.name || $t('inmates.tabs.overview.institutionalInfo.noSector') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.institutionalInfo.cellNumber') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.current_cell_number || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.institutionalInfo.status') }}:</label>
              <div class="form-control-plaintext">
                <span class="badge" :class="getStatusBadgeClass(inmate?.status)">
                  {{ getStatusLabel(inmate?.status) }}
                </span>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.institutionalInfo.admissionDate') }}:</label>
              <div class="form-control-plaintext">
                {{
                  inmate?.admission_date
                    ? formatDate(inmate.admission_date)
                    : $t('inmates.tabs.overview.na')
                }}
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.institutionalInfo.admissionTime') }}:</label>
              <div class="form-control-plaintext">
                {{
                  inmate?.admission_datetime
                    ? new Date(inmate.admission_datetime).toLocaleTimeString("es-GT", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : $t('inmates.tabs.overview.na')
                }}
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.institutionalInfo.admissionType') }}:</label>
              <div class="form-control-plaintext">
                {{ getAdmissionTypeLabel(inmate?.admission_type) }}
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.institutionalInfo.admissionOrderNumber') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.admission_order_number || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.institutionalInfo.remissionDocument') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.remission_document_number || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.institutionalInfo.remittingCourt') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.remittingCourt?.name || inmate?.remitting_court?.name || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.institutionalInfo.judicialFile') }}:</label>
              <div class="form-control-plaintext">
                <span :class="inmate?.has_judicial_file ? 'badge badge-light-success' : 'badge badge-light-danger'">
                  {{ inmate?.has_judicial_file ? $t('inmates.tabs.overview.institutionalInfo.available') : $t('inmates.tabs.overview.institutionalInfo.notAvailable') }}
                </span>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.institutionalInfo.admissionReason') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.admission_reason || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.institutionalInfo.legalStatus') }}:</label>
              <div class="form-control-plaintext">
                <span class="badge badge-light-info">
                  {{ getLegalStatusLabel(inmate?.legal_status) }}
                </span>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.institutionalInfo.proceduralStatus') }}:</label>
              <div class="form-control-plaintext">{{ inmate?.proceduralStatus?.name || inmate?.procedural_status?.name || $t('inmates.tabs.overview.na') }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.institutionalInfo.riskClassification') }}:</label>
              <div class="form-control-plaintext">
                <span
                  v-if="inmate?.riskClassification || inmate?.risk_classification"
                  class="badge"
                  :class="getRiskBadgeClass((inmate?.riskClassification || inmate?.risk_classification)?.level)"
                >
                  {{ (inmate?.riskClassification || inmate?.risk_classification)?.name }}
                </span>
                <span v-else class="text-muted">{{ $t('inmates.tabs.overview.institutionalInfo.notAssigned') }}</span>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.institutionalInfo.securityLevel') }}:</label>
              <div class="form-control-plaintext">
                <span class="badge badge-light-warning">
                  {{ getSecurityLevelLabel(inmate?.security_level) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Special Accommodations and Notes -->
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ $t('inmates.tabs.overview.specialAccommodations.title') }}</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6" v-if="inmate?.requires_lgbtiq_accommodations">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.specialAccommodations.lgbtiqAccommodations') }}:</label>
              <div class="form-control-plaintext">
                <span class="badge badge-light-primary">{{ $t('inmates.tabs.overview.personalInfo.yes') }}</span>
              </div>
            </div>

            <div class="col-12" v-if="inmate?.lgbtiq_accommodation_notes">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.specialAccommodations.lgbtiqNotes') }}:</label>
              <div class="form-control-plaintext">{{ inmate.lgbtiq_accommodation_notes }}</div>
            </div>

            <div class="col-md-6" v-if="inmate?.requires_special_protection">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.specialAccommodations.specialProtection') }}:</label>
              <div class="form-control-plaintext">
                <span class="badge badge-light-danger">{{ $t('inmates.tabs.overview.personalInfo.yes') }}</span>
              </div>
            </div>

            <div class="col-12" v-if="inmate?.protection_reasons">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.specialAccommodations.protectionReasons') }}:</label>
              <div class="form-control-plaintext">{{ inmate.protection_reasons }}</div>
            </div>

            <div class="col-12" v-if="inmate?.medical_observations">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.specialAccommodations.medicalObservations') }}:</label>
              <div class="form-control-plaintext">{{ inmate.medical_observations }}</div>
            </div>

            <div class="col-12" v-if="inmate?.general_notes">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.specialAccommodations.generalNotes') }}:</label>
              <div class="form-control-plaintext">{{ inmate.general_notes }}</div>
            </div>

            <div class="col-12" v-if="inmate?.observations">
              <label class="form-label fw-bold">{{ $t('inmates.tabs.overview.specialAccommodations.observations') }}:</label>
              <div class="form-control-plaintext">{{ inmate.observations }}</div>
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

const formatDate = (date: string) => {
  return formatDateHelper(date, 'd \'de\' MMMM \'de\' yyyy');
};

const getAdmissionTypeLabel = (type: string | null | undefined): string => {
  if (!type) {
    return t("common.admissionType.notAvailable");
  }

  const typeKey = `common.admissionType.${type}`;
  return t(typeKey);
};

const getStatusLabel = (status: string) => {
  if (!status) return t('inmates.tabs.overview.na');

  const statusKey = `inmates.tabs.overview.statuses.${status}`;
  const translated = t(statusKey);
  // If the key doesn't exist, return the status or N/A
  return translated !== statusKey ? translated : status || t('inmates.tabs.overview.na');
};

const getStatusBadgeClass = (status: string) => {
  const classMap: { [key: string]: string } = {
    active: "badge-light-success",
    released: "badge-light-info",
    transferred: "badge-light-warning",
    deceased: "badge-light-dark",
    court_hearing: "badge-light-primary",
    hospital_external: "badge-light-danger",
    hospital_internal: "badge-light-warning",
    isolation: "badge-light-warning",
    escaped: "badge-light-danger",
  };
  return classMap[status] || "badge-light-secondary";
};

const getLegalStatusLabel = (status: string) => {
  if (!status) return t('inmates.tabs.overview.na');

  const statusKey = `inmates.tabs.overview.legalStatuses.${status}`;
  const translated = t(statusKey);
  return translated !== statusKey ? translated : status || t('inmates.tabs.overview.na');
};

const getSecurityLevelLabel = (level: string) => {
  if (!level) return t('inmates.tabs.overview.na');

  const levelKey = `inmates.tabs.overview.securityLevels.${level}`;
  const translated = t(levelKey);
  return translated !== levelKey ? translated : level || t('inmates.tabs.overview.na');
};

const getRiskBadgeClass = (level: string) => {
  const classMap: { [key: string]: string } = {
    low: "badge-light-success",
    medium: "badge-light-warning",
    high: "badge-light-danger",
    very_high: "badge-light-dark",
  };
  return classMap[level] || "badge-light-secondary";
};

const getCulturalPracticesLabel = (practice: string) => {
  if (!practice) return t('inmates.tabs.overview.na');

  const practiceKey = `inmates.tabs.overview.culturalPractices.${practice}`;
  const translated = t(practiceKey);
  return translated !== practiceKey ? translated : practice || t('inmates.tabs.overview.na');
};

const getBirthPlaceLabel = () => {
  if (!props.inmate) return t('inmates.tabs.overview.na');

  const parts = [];

  // Support both camelCase (from backend) and snake_case (legacy)
  const municipality = props.inmate.birthMunicipality || props.inmate.birth_municipality;
  const department = props.inmate.birthDepartment || props.inmate.birth_department;
  const country = props.inmate.birthCountry || props.inmate.birth_country;

  if (municipality?.name) {
    parts.push(municipality.name);
  }

  if (department?.name) {
    parts.push(department.name);
  }

  if (country?.name) {
    parts.push(country.name);
  }

  return parts.length > 0 ? parts.join(", ") : t('inmates.tabs.overview.na');
};
</script>
