<template>
  <div class="row g-6">
    <!-- Personal Information -->
    <div class="col-lg-6">
      <div class="card h-100">
        <div class="card-header">
          <h3 class="card-title">Información Personal</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label fw-bold">Nombre Completo:</label>
              <div class="form-control-plaintext">{{ getInmateFullName }}</div>
            </div>
            
            <div class="col-md-6">
              <label class="form-label fw-bold">Alias:</label>
              <div class="form-control-plaintext">{{ inmate?.alias || "N/A" }}</div>
            </div>
            
            <div class="col-md-6">
              <label class="form-label fw-bold">Apellido de Casada:</label>
              <div class="form-control-plaintext">{{ inmate?.married_surname || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Documento:</label>
              <div class="form-control-plaintext">
                {{ inmate?.document_number || "N/A" }}
                <span v-if="inmate?.documentType?.name || inmate?.document_type?.name" class="text-muted">
                  ({{ inmate?.documentType?.name || inmate?.document_type?.name }})
                </span>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Fecha de Nacimiento:</label>
              <div class="form-control-plaintext">
                {{ inmate?.birth_date ? formatDate(inmate.birth_date) : "N/A" }}
                <span v-if="inmate?.age" class="text-muted">({{ inmate.age }} años)</span>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Género:</label>
              <div class="form-control-plaintext">
                {{
                  inmate?.gender === "M"
                    ? "Masculino"
                    : inmate?.gender === "F"
                      ? "Femenino"
                      : "N/A"
                }}
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Identidad de Género:</label>
              <div class="form-control-plaintext">{{ inmate?.genderIdentity?.name || inmate?.gender_identity?.name || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Orientación Sexual:</label>
              <div class="form-control-plaintext">{{ inmate?.sexualOrientation?.name || inmate?.sexual_orientation?.name || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Estado Civil:</label>
              <div class="form-control-plaintext">{{ inmate?.civilStatus?.name || inmate?.civil_status?.name || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Nacionalidad:</label>
              <div class="form-control-plaintext">{{ inmate?.nationality?.name || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Grupo Étnico:</label>
              <div class="form-control-plaintext">{{ inmate?.ethnicGroup?.name || inmate?.ethnic_group?.name || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Religión:</label>
              <div class="form-control-plaintext">{{ inmate?.religion?.name || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Idioma Principal:</label>
              <div class="form-control-plaintext">{{ inmate?.primaryLanguage?.name || inmate?.primary_language?.name || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Requiere Intérprete:</label>
              <div class="form-control-plaintext">
                <span :class="inmate?.requires_interpreter ? 'badge badge-light-warning' : 'badge badge-light-success'">
                  {{ inmate?.requires_interpreter ? "Sí" : "No" }}
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
          <h3 class="card-title">Información Profesional y Social</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label fw-bold">Grado Académico:</label>
              <div class="form-control-plaintext">{{ inmate?.academicDegree?.name || inmate?.academic_degree?.name || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Ocupación:</label>
              <div class="form-control-plaintext">{{ inmate?.occupation?.name || "N/A" }}</div>
            </div>

            <div class="col-12" v-if="inmate?.occupation_details">
              <label class="form-label fw-bold">Detalles de Ocupación:</label>
              <div class="form-control-plaintext">{{ inmate.occupation_details }}</div>
            </div>

            <div class="col-12" v-if="inmate?.previous_occupation">
              <label class="form-label fw-bold">Ocupación Anterior:</label>
              <div class="form-control-plaintext">{{ inmate.previous_occupation }}</div>
            </div>

            <div class="col-12" v-if="inmate?.work_experience">
              <label class="form-label fw-bold">Experiencia Laboral:</label>
              <div class="form-control-plaintext">{{ inmate.work_experience }}</div>
            </div>

            <div class="col-12" v-if="inmate?.skills_and_abilities">
              <label class="form-label fw-bold">Habilidades y Destrezas:</label>
              <div class="form-control-plaintext">{{ inmate.skills_and_abilities }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Nivel Socioeconómico:</label>
              <div class="form-control-plaintext">{{ inmate?.socioeconomicLevel?.name || inmate?.socioeconomic_level?.name || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Tipo de Sangre:</label>
              <div class="form-control-plaintext">{{ inmate?.bloodType?.name || inmate?.blood_type?.name || "N/A" }}</div>
            </div>

            <div class="col-12" v-if="inmate?.cultural_practices">
              <label class="form-label fw-bold">Prácticas Culturales:</label>
              <div class="form-control-plaintext">{{ getCulturalPracticesLabel(inmate.cultural_practices) }}</div>
            </div>

            <div class="col-12" v-if="inmate?.special_cultural_needs">
              <label class="form-label fw-bold">Necesidades Culturales Especiales:</label>
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
          <h3 class="card-title">Ubicación y Contacto</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label fw-bold">Lugar de Nacimiento:</label>
              <div class="form-control-plaintext">
                <span v-if="inmate?.birth_country || inmate?.birth_department || inmate?.birth_municipality">
                  {{ getBirthPlaceLabel() }}
                </span>
                <span v-else>N/A</span>
              </div>
            </div>

            <div class="col-12">
              <label class="form-label fw-bold">Dirección de Residencia:</label>
              <div class="form-control-plaintext">{{ inmate?.address || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Municipio:</label>
              <div class="form-control-plaintext">{{ inmate?.municipality?.name || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Departamento:</label>
              <div class="form-control-plaintext">{{ inmate?.department?.name || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">País:</label>
              <div class="form-control-plaintext">{{ inmate?.country?.name || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Teléfono:</label>
              <div class="form-control-plaintext">{{ inmate?.phone || "N/A" }}</div>
            </div>

            <div class="col-12">
              <label class="form-label fw-bold">Email:</label>
              <div class="form-control-plaintext">{{ inmate?.email || "N/A" }}</div>
            </div>

            <div class="col-12">
              <h5 class="fw-bold text-gray-800 mt-4">Contacto de Emergencia</h5>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Nombre:</label>
              <div class="form-control-plaintext">{{ inmate?.emergency_contact_name || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Teléfono:</label>
              <div class="form-control-plaintext">{{ inmate?.emergency_contact_phone || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Relación:</label>
              <div class="form-control-plaintext">{{ inmate?.emergencyContactRelationship?.name || inmate?.emergency_contact_relationship?.name || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Idioma del Contacto:</label>
              <div class="form-control-plaintext">{{ inmate?.emergencyContactLanguage?.name || inmate?.emergency_contact_language?.name || "N/A" }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Institutional Information -->
    <div class="col-lg-6">
      <div class="card h-100">
        <div class="card-header">
          <h3 class="card-title">Información Institucional</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label fw-bold">Número Interno:</label>
              <div class="form-control-plaintext">{{ inmate?.inmate_number || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Número de Caso:</label>
              <div class="form-control-plaintext">{{ inmate?.case_number || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Centro Actual:</label>
              <div class="form-control-plaintext">{{ inmate?.currentCenter?.name || inmate?.current_center?.name || "Sin centro asignado" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Sector:</label>
              <div class="form-control-plaintext">{{ inmate?.currentSector?.name || inmate?.current_sector?.name || "Sin sector asignado" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Número de Celda:</label>
              <div class="form-control-plaintext">{{ inmate?.current_cell_number || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Estado:</label>
              <div class="form-control-plaintext">
                <span class="badge" :class="getStatusBadgeClass(inmate?.status)">
                  {{ getStatusLabel(inmate?.status) }}
                </span>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Fecha de Ingreso:</label>
              <div class="form-control-plaintext">
                {{
                  inmate?.admission_date
                    ? formatDate(inmate.admission_date)
                    : "N/A"
                }}
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Hora de Ingreso:</label>
              <div class="form-control-plaintext">
                {{
                  inmate?.admission_datetime
                    ? new Date(inmate.admission_datetime).toLocaleTimeString("es-GT", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"
                }}
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Tipo de Admisión:</label>
              <div class="form-control-plaintext">
                {{ getAdmissionTypeLabel(inmate?.admission_type) }}
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">No. Orden de Ingreso:</label>
              <div class="form-control-plaintext">{{ inmate?.admission_order_number || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Documento de Remisión:</label>
              <div class="form-control-plaintext">{{ inmate?.remission_document_number || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Juzgado Remitente:</label>
              <div class="form-control-plaintext">{{ inmate?.remittingCourt?.name || inmate?.remitting_court?.name || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Expediente Judicial:</label>
              <div class="form-control-plaintext">
                <span :class="inmate?.has_judicial_file ? 'badge badge-light-success' : 'badge badge-light-danger'">
                  {{ inmate?.has_judicial_file ? "Disponible" : "No disponible" }}
                </span>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Motivo de Ingreso:</label>
              <div class="form-control-plaintext">{{ inmate?.admission_reason || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Estado Legal:</label>
              <div class="form-control-plaintext">
                <span class="badge badge-light-info">
                  {{ getLegalStatusLabel(inmate?.legal_status) }}
                </span>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Estado Procesal:</label>
              <div class="form-control-plaintext">{{ inmate?.proceduralStatus?.name || inmate?.procedural_status?.name || "N/A" }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Clasificación de Riesgo:</label>
              <div class="form-control-plaintext">
                <span
                  v-if="inmate?.riskClassification || inmate?.risk_classification"
                  class="badge"
                  :class="getRiskBadgeClass((inmate?.riskClassification || inmate?.risk_classification)?.level)"
                >
                  {{ (inmate?.riskClassification || inmate?.risk_classification)?.name }}
                </span>
                <span v-else class="text-muted">No asignada</span>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Nivel de Seguridad:</label>
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
          <h3 class="card-title">Notas y Acomodaciones Especiales</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6" v-if="inmate?.requires_lgbtiq_accommodations">
              <label class="form-label fw-bold">Requiere Acomodaciones LGBTIQ+:</label>
              <div class="form-control-plaintext">
                <span class="badge badge-light-primary">Sí</span>
              </div>
            </div>

            <div class="col-12" v-if="inmate?.lgbtiq_accommodation_notes">
              <label class="form-label fw-bold">Notas de Acomodación LGBTIQ+:</label>
              <div class="form-control-plaintext">{{ inmate.lgbtiq_accommodation_notes }}</div>
            </div>

            <div class="col-md-6" v-if="inmate?.requires_special_protection">
              <label class="form-label fw-bold">Requiere Protección Especial:</label>
              <div class="form-control-plaintext">
                <span class="badge badge-light-danger">Sí</span>
              </div>
            </div>

            <div class="col-12" v-if="inmate?.protection_reasons">
              <label class="form-label fw-bold">Razones de Protección:</label>
              <div class="form-control-plaintext">{{ inmate.protection_reasons }}</div>
            </div>

            <div class="col-12" v-if="inmate?.medical_observations">
              <label class="form-label fw-bold">Observaciones Médicas:</label>
              <div class="form-control-plaintext">{{ inmate.medical_observations }}</div>
            </div>

            <div class="col-12" v-if="inmate?.general_notes">
              <label class="form-label fw-bold">Notas Generales:</label>
              <div class="form-control-plaintext">{{ inmate.general_notes }}</div>
            </div>

            <div class="col-12" v-if="inmate?.observations">
              <label class="form-label fw-bold">Observaciones:</label>
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

interface Props {
  inmate: any;
}

const props = defineProps<Props>();
const { t } = useI18n();

const getInmateFullName = computed(() => {
  if (!props.inmate) return "Sin nombre";

  const parts = [
    props.inmate.first_name,
    props.inmate.middle_name,
    props.inmate.third_name,
    props.inmate.last_name,
    props.inmate.second_last_name,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" ") : "Sin nombre";
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("es-GT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getAdmissionTypeLabel = (type: string | null | undefined): string => {
  if (!type) {
    return t("common.admissionType.notAvailable");
  }

  const typeKey = `common.admissionType.${type}`;
  return t(typeKey);
};

const getStatusLabel = (status: string) => {
  const statusMap: { [key: string]: string } = {
    active: "Activo",
    released: "Liberado",
    transferred: "Transferido",
    deceased: "Fallecido",
    court_hearing: "En audiencia",
    hospital_external: "Hospital externo",
    hospital_internal: "Enfermería",
    isolation: "Aislamiento",
    escaped: "Fugado",
  };
  return statusMap[status] || status || "N/A";
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
  const statusMap: { [key: string]: string } = {
    preventive_detention: "Prisión Preventiva",
    sentenced: "Sentenciado",
    conditional_release: "Libertad Condicional",
    provisional_release: "Libertad Provisional",
    house_arrest: "Arresto Domiciliario",
  };
  return statusMap[status] || status || "N/A";
};

const getSecurityLevelLabel = (level: string) => {
  const levelMap: { [key: string]: string } = {
    minimum: "Mínimo",
    medium: "Medio",
    maximum: "Máximo",
    super_maximum: "Súper Máximo",
  };
  return levelMap[level] || level || "N/A";
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
  const practiceMap: { [key: string]: string } = {
    maya_traditional: "Tradiciones Mayas",
    garifuna_traditional: "Tradiciones Garífunas",
    xinca_traditional: "Tradiciones Xincas",
    ladino_traditional: "Tradiciones Ladinas",
    other: "Otras Prácticas",
    none: "Ninguna",
  };
  return practiceMap[practice] || practice || "N/A";
};

const getBirthPlaceLabel = () => {
  if (!props.inmate) return "N/A";

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

  return parts.length > 0 ? parts.join(", ") : "N/A";
};
</script>
