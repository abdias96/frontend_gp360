<template>
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <h3 class="fw-bold m-0">Información General</h3>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body pt-0">
      <div class="row g-6 g-xl-9">
        <!--begin::Personal Information-->
        <div class="col-md-6 col-xl-4">
          <div class="card card-flush h-100">
            <div class="card-header pt-7">
              <h3 class="card-title align-items-start flex-column">
                <span class="card-label fw-bold text-gray-800"
                  >Información Personal</span
                >
              </h3>
            </div>
            <div class="card-body pt-0">
              <div class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Nombre Completo</span
                >
                <span class="text-gray-800">{{ inmate.full_name }}</span>
                <span v-if="inmate.alias" class="text-muted ms-2"
                  >({{ inmate.alias }})</span
                >
              </div>

              <div class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Documento de Identidad</span
                >
                <span class="text-gray-800">{{
                  inmate.document_number || "N/A"
                }}</span>
                <span v-if="inmate.documentType?.name || inmate.document_type?.name" class="text-muted ms-2"
                  >({{ inmate.documentType?.name || inmate.document_type?.name }})</span
                >
              </div>

              <div class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Fecha de Nacimiento</span
                >
                <span class="text-gray-800"
                  >{{ formatDate(inmate.birth_date) }} ({{
                    inmate.age
                  }}
                  años)</span
                >
              </div>

              <div class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2">Género</span>
                <span class="text-gray-800">{{
                  inmate.gender === "M" ? "Masculino" : "Femenino"
                }}</span>
              </div>

              <div v-if="inmate.civilStatus?.name || inmate.civil_status?.name" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Estado Civil</span
                >
                <span class="text-gray-800">{{
                  inmate.civilStatus?.name || inmate.civil_status?.name
                }}</span>
              </div>

              <div v-if="inmate.nationality?.name" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Nacionalidad</span
                >
                <span class="text-gray-800">{{ inmate.nationality?.name }}</span>
              </div>
            </div>
          </div>
        </div>
        <!--end::Personal Information-->

        <!--begin::Cultural Information-->
        <div class="col-md-6 col-xl-4">
          <div class="card card-flush h-100">
            <div class="card-header pt-7">
              <h3 class="card-title align-items-start flex-column">
                <span class="card-label fw-bold text-gray-800"
                  >Información Cultural</span
                >
              </h3>
            </div>
            <div class="card-body pt-0">
              <div v-if="inmate.ethnicGroup?.name || inmate.ethnic_group?.name" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Grupo Étnico</span
                >
                <span class="text-gray-800">{{
                  inmate.ethnicGroup?.name || inmate.ethnic_group?.name
                }}</span>
              </div>

              <div v-if="inmate.primaryLanguage?.name || inmate.primary_language?.name" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Idioma Principal</span
                >
                <span class="text-gray-800">{{
                  inmate.primaryLanguage?.name || inmate.primary_language?.name
                }}</span>
              </div>

              <div
                v-if="
                  inmate.additional_languages &&
                  inmate.additional_languages.length > 0
                "
                class="mb-4"
              >
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Idiomas Adicionales</span
                >
                <span class="text-gray-800">{{
                  inmate.additional_languages.join(", ")
                }}</span>
              </div>

              <div class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Requiere Intérprete</span
                >
                <span
                  class="badge"
                  :class="
                    inmate.requires_interpreter
                      ? 'badge-light-warning'
                      : 'badge-light-success'
                  "
                >
                  {{ inmate.requires_interpreter ? "Sí" : "No" }}
                </span>
              </div>

              <div v-if="inmate.religion?.name" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2">Religión</span>
                <span class="text-gray-800">{{ inmate.religion?.name }}</span>
              </div>

              <div v-if="inmate.cultural_practices" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Prácticas Culturales</span
                >
                <span class="text-gray-800">{{
                  inmate.cultural_practices
                }}</span>
              </div>

              <div v-if="inmate.special_cultural_needs" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Necesidades Culturales Especiales</span
                >
                <span class="text-gray-800">{{
                  inmate.special_cultural_needs
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <!--end::Cultural Information-->

        <!--begin::Socioeconomic Information-->
        <div class="col-md-6 col-xl-4">
          <div class="card card-flush h-100">
            <div class="card-header pt-7">
              <h3 class="card-title align-items-start flex-column">
                <span class="card-label fw-bold text-gray-800"
                  >Información Socioeconómica</span
                >
              </h3>
            </div>
            <div class="card-body pt-0">
              <div v-if="inmate.academicDegree?.name || inmate.academic_degree?.name" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Nivel Educativo</span
                >
                <span class="text-gray-800">{{
                  inmate.academicDegree?.name || inmate.academic_degree?.name
                }}</span>
              </div>

              <div v-if="inmate.occupation?.name" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Ocupación</span
                >
                <span class="text-gray-800">{{ inmate.occupation?.name }}</span>
              </div>

              <div v-if="inmate.occupation_details" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Detalles de Ocupación</span
                >
                <span class="text-gray-800">{{
                  inmate.occupation_details
                }}</span>
              </div>

              <div v-if="inmate.previous_occupation" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Ocupación Anterior</span
                >
                <span class="text-gray-800">{{
                  inmate.previous_occupation
                }}</span>
              </div>

              <div v-if="inmate.work_experience" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Experiencia Laboral</span
                >
                <span class="text-gray-800">{{ inmate.work_experience }}</span>
              </div>

              <div v-if="inmate.skills_and_abilities" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Habilidades y Capacidades</span
                >
                <span class="text-gray-800">{{
                  inmate.skills_and_abilities
                }}</span>
              </div>

              <div v-if="inmate.socioeconomicLevel?.name || inmate.socioeconomic_level?.name" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Nivel Socioeconómico</span
                >
                <span class="text-gray-800">{{
                  inmate.socioeconomicLevel?.name || inmate.socioeconomic_level?.name
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <!--end::Socioeconomic Information-->

        <!--begin::Contact Information-->
        <div class="col-md-6 col-xl-4">
          <div class="card card-flush h-100">
            <div class="card-header pt-7">
              <h3 class="card-title align-items-start flex-column">
                <span class="card-label fw-bold text-gray-800"
                  >Información de Contacto</span
                >
              </h3>
            </div>
            <div class="card-body pt-0">
              <div v-if="inmate.address" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Dirección</span
                >
                <span class="text-gray-800">{{ inmate.address }}</span>
              </div>

              <div v-if="inmate.municipality?.name" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Municipio</span
                >
                <span class="text-gray-800">
                  {{ inmate.municipality?.name }}
                  <span v-if="inmate.department?.name" class="text-muted"
                    >, {{ inmate.department?.name }}</span
                  >
                </span>
              </div>

              <div v-if="inmate.phone" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2">Teléfono</span>
                <span class="text-gray-800">{{ inmate.phone }}</span>
              </div>

              <div v-if="inmate.emergency_contact_name" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Contacto de Emergencia</span
                >
                <div class="text-gray-800">
                  <div>{{ inmate.emergency_contact_name }}</div>
                  <div v-if="inmate.emergency_contact_phone" class="text-muted">
                    {{ inmate.emergency_contact_phone }}
                  </div>
                  <div
                    v-if="inmate.emergencyContactLanguage?.name || inmate.emergency_contact_language?.name"
                    class="text-muted"
                  >
                    Idioma: {{ inmate.emergencyContactLanguage?.name || inmate.emergency_contact_language?.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--end::Contact Information-->

        <!--begin::Institutional Information-->
        <div class="col-md-6 col-xl-4">
          <div class="card card-flush h-100">
            <div class="card-header pt-7">
              <h3 class="card-title align-items-start flex-column">
                <span class="card-label fw-bold text-gray-800"
                  >Información Institucional</span
                >
              </h3>
            </div>
            <div class="card-body pt-0">
              <div class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Número Interno</span
                >
                <span class="text-gray-800">{{ inmate.inmate_number || "N/A" }}</span>
              </div>

              <div v-if="inmate.case_number" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Número de Caso</span
                >
                <span class="text-gray-800">{{ inmate.case_number }}</span>
              </div>

              <div class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Centro Actual</span
                >
                <span class="text-gray-800">{{ inmate.currentCenter?.name || inmate.current_center?.name || "N/A" }}</span>
              </div>

              <div v-if="inmate.currentSector?.name || inmate.current_sector?.name" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2">Sector</span>
                <span class="text-gray-800">{{ inmate.currentSector?.name || inmate.current_sector?.name }}</span>
              </div>

              <div v-if="inmate.current_cell_number" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2">Celda</span>
                <span class="text-gray-800">{{
                  inmate.current_cell_number
                }}</span>
              </div>

              <div class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Fecha de Ingreso</span
                >
                <span class="text-gray-800">{{
                  formatDate(inmate.admission_date)
                }}</span>
              </div>

              <div class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2">Estado</span>
                <span class="badge" :class="getStatusClass(inmate.status)">
                  {{ getStatusText(inmate.status) }}
                </span>
              </div>

              <div class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Estado Legal</span
                >
                <span class="text-gray-800">{{ getLegalStatusText(inmate.legal_status) }}</span>
              </div>
            </div>
          </div>
        </div>
        <!--end::Institutional Information-->

        <!--begin::Additional Information-->
        <div class="col-md-6 col-xl-4">
          <div class="card card-flush h-100">
            <div class="card-header pt-7">
              <h3 class="card-title align-items-start flex-column">
                <span class="card-label fw-bold text-gray-800"
                  >Información Adicional</span
                >
              </h3>
            </div>
            <div class="card-body pt-0">
              <div class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Datos Biométricos</span
                >
                <span
                  class="badge"
                  :class="
                    inmate.has_biometric_data
                      ? 'badge-light-success'
                      : 'badge-light-warning'
                  "
                >
                  {{ inmate.has_biometric_data ? "Registrados" : "Pendientes" }}
                </span>
              </div>

              <div v-if="inmate.discipline_points" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Puntos Disciplinarios</span
                >
                <span class="text-gray-800">{{
                  inmate.discipline_points
                }}</span>
              </div>

              <div
                v-if="inmate.active_alerts && inmate.active_alerts.length > 0"
                class="mb-4"
              >
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Alertas Activas</span
                >
                <div class="d-flex flex-wrap gap-2">
                  <span
                    v-for="alert in inmate.active_alerts"
                    :key="alert"
                    class="badge badge-light-danger"
                  >
                    {{ alert }}
                  </span>
                </div>
              </div>

              <div v-if="inmate.general_notes" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Observaciones Generales</span
                >
                <span class="text-gray-800">{{ inmate.general_notes }}</span>
              </div>

              <div class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Registro Creado</span
                >
                <span class="text-gray-800">{{
                  formatDateTime(inmate.created_at)
                }}</span>
              </div>

              <div class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Última Actualización</span
                >
                <span class="text-gray-800">{{
                  formatDateTime(inmate.updated_at)
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <!--end::Additional Information-->
      </div>
    </div>
    <!--end::Card body-->
  </div>
</template>

<script setup lang="ts">
import type { InmateDetail } from "@/types/inmates";

interface Props {
  inmate: InmateDetail;
}

defineProps<Props>();

// Methods
const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("es-GT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleDateString("es-GT", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    active: "badge-light-success",
    transferred: "badge-light-info",
    released: "badge-light-primary",
    deceased: "badge-light-dark",
  };
  return classes[status] || "badge-light-secondary";
};

const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    active: "Activo",
    transferred: "Trasladado",
    released: "Liberado",
    deceased: "Fallecido",
  };
  return texts[status] || status;
};

const getLegalStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    preventive_detention: "Prisión Preventiva",
    sentenced: "Sentenciado",
    conditional_release: "Libertad Condicional",
    provisional_release: "Libertad Provisional",
    house_arrest: "Arresto Domiciliario",
  };
  return texts[status] || status;
};
</script>

<style scoped>
.card-flush {
  box-shadow: 0 0 50px 0 rgba(82, 63, 105, 0.15);
  border: 1px solid #eff2f5;
}

.badge {
  font-size: 0.75rem;
}
</style>
