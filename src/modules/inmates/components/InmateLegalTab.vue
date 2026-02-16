<template>
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <h3 class="fw-bold m-0">Información Legal</h3>
      </div>
      <div class="card-toolbar">
        <button
          v-if="canEdit"
          type="button"
          class="btn btn-sm btn-primary"
          @click="editLegalProfile"
        >
          <i class="ki-duotone ki-pencil fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          Editar Perfil Legal
        </button>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body pt-0">
      <div v-if="!legalProfile" class="text-center py-10">
        <div class="mx-auto mb-4">
          <i class="ki-duotone ki-security-user fs-5x text-gray-400">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
        </div>
        <div class="fs-6 text-gray-600 mb-4">
          No hay información legal registrada para este interno.
        </div>
        <button
          v-if="canEdit"
          type="button"
          class="btn btn-light-primary"
          @click="createLegalProfile"
        >
          Crear Perfil Legal
        </button>
      </div>

      <div v-else class="row g-6 g-xl-9">
        <!--begin::Case Information-->
        <div class="col-md-6">
          <div class="card card-flush h-100">
            <div class="card-header pt-7">
              <h3 class="card-title align-items-start flex-column">
                <span class="card-label fw-bold text-gray-800"
                  >Información del Caso</span
                >
              </h3>
            </div>
            <div class="card-body pt-0">
              <div v-if="legalProfile.case_number" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Número de Caso</span
                >
                <span class="text-gray-800">{{
                  legalProfile.case_number
                }}</span>
              </div>

              <div v-if="legalProfile.court?.name" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2">Juzgado</span>
                <span class="text-gray-800">{{ legalProfile.court.name }}</span>
              </div>

              <div v-if="legalProfile.procedural_status?.name" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Estado Procesal</span
                >
                <span class="text-gray-800">{{
                  legalProfile.procedural_status.name
                }}</span>
              </div>

              <div v-if="legalProfile.sentence_type?.name" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Tipo de Sentencia</span
                >
                <span class="text-gray-800">{{
                  legalProfile.sentence_type.name
                }}</span>
              </div>

              <div v-if="legalProfile.legal_notes" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Notas Legales</span
                >
                <span class="text-gray-800">{{
                  legalProfile.legal_notes
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <!--end::Case Information-->

        <!--begin::Sentence Information-->
        <div class="col-md-6">
          <div class="card card-flush h-100">
            <div class="card-header pt-7">
              <h3 class="card-title align-items-start flex-column">
                <span class="card-label fw-bold text-gray-800"
                  >Información de Sentencia</span
                >
              </h3>
            </div>
            <div class="card-body pt-0">
              <div v-if="hasSentenceTime" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Duración de Sentencia</span
                >
                <span class="text-gray-800">{{
                  formatSentenceDuration()
                }}</span>
              </div>

              <div v-if="legalProfile.sentence_start_date" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Inicio de Sentencia</span
                >
                <span class="text-gray-800">{{
                  formatDate(legalProfile.sentence_start_date)
                }}</span>
              </div>

              <div v-if="legalProfile.estimated_release_date" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Fecha Estimada de Liberación</span
                >
                <span class="text-gray-800">{{
                  formatDate(legalProfile.estimated_release_date)
                }}</span>
              </div>

              <div v-if="legalProfile.preventive_detention_start" class="mb-4">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Inicio Prisión Preventiva</span
                >
                <span class="text-gray-800">{{
                  formatDate(legalProfile.preventive_detention_start)
                }}</span>
              </div>

              <!-- No time limit on preventive detention -->
            </div>
          </div>
        </div>
        <!--end::Sentence Information-->

        <!--begin::Primary Crime-->
        <div class="col-12">
          <div class="card card-flush">
            <div class="card-header pt-7">
              <h3 class="card-title align-items-start flex-column">
                <span class="card-label fw-bold text-gray-800"
                  >Delito Principal</span
                >
              </h3>
            </div>
            <div class="card-body pt-0">
              <div
                v-if="!primaryCrimeName"
                class="text-center py-5"
              >
                <div class="text-gray-600">
                  No hay delito principal registrado
                </div>
              </div>
              <div v-else class="row">
                <div class="col-md-6">
                  <div class="mb-4">
                    <span class="fw-bold text-gray-600 d-block mb-2"
                      >Delito</span
                    >
                    <span class="text-gray-800">{{
                      primaryCrimeName
                    }}</span>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-4">
                    <span class="fw-bold text-gray-600 d-block mb-2">Tipo</span>
                    <span class="badge badge-light-danger">Principal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--end::Primary Crime-->

        <!--begin::Secondary Crimes-->
        <div
          v-if="secondaryCrimes && secondaryCrimes.length > 0"
          class="col-12"
        >
          <div class="card card-flush">
            <div class="card-header pt-7">
              <h3 class="card-title align-items-start flex-column">
                <span class="card-label fw-bold text-gray-800"
                  >Delitos Secundarios</span
                >
              </h3>
            </div>
            <div class="card-body pt-0">
              <div class="table-responsive">
                <table class="table table-row-dashed table-row-gray-300 gy-7">
                  <thead>
                    <tr
                      class="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200"
                    >
                      <th>Delito</th>
                      <th>Descripción</th>
                      <th>Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(crime, index) in secondaryCrimes"
                      :key="index"
                    >
                      <td>{{ crime.crime?.name || crime.crime_description || "N/A" }}</td>
                      <td>{{ crime.crime_location || "N/A" }}</td>
                      <td>
                        <span class="badge badge-light-warning"
                          >Secundario</span
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <!--end::Secondary Crimes-->

        <!--begin::All Crimes List-->
        <div v-if="legalProfile && legalProfile.crimes && legalProfile.crimes.length > 0" class="col-12">
          <div class="card card-flush">
            <div class="card-header pt-7">
              <h3 class="card-title align-items-start flex-column">
                <span class="card-label fw-bold text-gray-800"
                  >Todos los Delitos</span
                >
                <span class="card-label text-muted mt-1 fw-semibold fs-7">
                  {{ legalProfile.crimes.length }} delito(s) registrado(s)
                </span>
              </h3>
            </div>
            <div class="card-body pt-0">
              <div class="table-responsive">
                <table class="table table-row-dashed table-row-gray-300 gy-7">
                  <thead>
                    <tr
                      class="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200"
                    >
                      <th>Delito</th>
                      <th>Clasificación</th>
                      <th>Fecha</th>
                      <th>Ubicación</th>
                      <th>Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="crime in legalProfile.crimes" :key="crime.id">
                      <td>
                        <div class="d-flex flex-column">
                          <span class="text-gray-800 fw-bold">{{
                            crime.crime?.name || crime.crime_description || "N/A"
                          }}</span>
                          <span
                            v-if="crime.crime_description"
                            class="text-muted fs-7"
                          >
                            {{ crime.crime_description }}
                          </span>
                        </div>
                      </td>
                      <td>{{ crime.crime_classification?.name || "N/A" }}</td>
                      <td>
                        <div class="d-flex flex-column">
                          <span v-if="crime.crime_date">{{
                            formatDate(crime.crime_date)
                          }}</span>
                          <span v-else class="text-muted">N/A</span>
                        </div>
                      </td>
                      <td>
                        {{ crime.crime_location || "N/A" }}
                      </td>
                      <td>
                        <span
                          class="badge"
                          :class="
                            crime.is_primary
                              ? 'badge-light-danger'
                              : 'badge-light-warning'
                          "
                        >
                          {{ crime.is_primary ? "Principal" : "Secundario" }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <!--end::All Crimes List-->
      </div>
    </div>
    <!--end::Card body-->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import type { InmateDetail, InmateCrime } from "@/types/inmates";
import Swal from "sweetalert2";

interface Props {
  inmate: InmateDetail;
}

const props = defineProps<Props>();
const authStore = useAuthStore();

// Debug logging on mount
onMounted(() => {
});

// Computed properties
// Try legalProfiles first (camelCase from backend), then fall back to legal_profiles (snake_case)
const legalProfile = computed(() => {
  // Try camelCase first (legalProfiles)
  const profiles = props.inmate.legalProfiles || props.inmate.legal_profiles;

  // If we have multiple legal profiles, get the active one
  if (profiles && profiles.length > 0) {
    // Find active profile or return the first one
    const activeProfile = profiles.find((profile: any) => profile.profile_status === 'active');
    return activeProfile || profiles[0];
  }

  // Fall back to singular legalProfile (camelCase) or legal_profile (snake_case)
  return props.inmate.legalProfile || props.inmate.legal_profile || null;
});

const canEdit = computed(() => authStore.hasPermission("inmates.legal"));

const hasSentenceTime = computed(() => {
  if (!legalProfile.value) return false;
  return !!(
    legalProfile.value.sentence_years ||
    legalProfile.value.sentence_months ||
    legalProfile.value.sentence_days
  );
});

// Computed property for primary crime
const primaryCrime = computed(() => {
  if (!legalProfile.value || !legalProfile.value.crimes || legalProfile.value.crimes.length === 0) {
    return null;
  }
  // Return the first crime or the one marked as primary
  const primaryFound = legalProfile.value.crimes.find((c: any) => c.is_primary);
  return primaryFound || legalProfile.value.crimes[0];
});

// Computed property for primary crime name
const primaryCrimeName = computed(() => {
  if (!primaryCrime.value) return null;
  // Try to get from the crime relation first, then from crime_description
  return primaryCrime.value.crime?.name || primaryCrime.value.crime_description || 'N/A';
});

// Computed property for secondary crimes
const secondaryCrimes = computed(() => {
  if (!legalProfile.value || !legalProfile.value.crimes || legalProfile.value.crimes.length === 0) {
    return [];
  }
  // Return all crimes except the primary one
  if (primaryCrime.value) {
    return legalProfile.value.crimes.filter((c: any) => c.id !== primaryCrime.value.id);
  }
  return legalProfile.value.crimes.slice(1); // Skip first if no primary is marked
});

// Methods
const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("es-GT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatSentenceDuration = (): string => {
  if (!legalProfile.value) return "";

  const parts: string[] = [];

  if (legalProfile.value.sentence_years) {
    parts.push(
      `${legalProfile.value.sentence_years} año${legalProfile.value.sentence_years > 1 ? "s" : ""}`,
    );
  }

  if (legalProfile.value.sentence_months) {
    parts.push(
      `${legalProfile.value.sentence_months} mes${legalProfile.value.sentence_months > 1 ? "es" : ""}`,
    );
  }

  if (legalProfile.value.sentence_days) {
    parts.push(
      `${legalProfile.value.sentence_days} día${legalProfile.value.sentence_days > 1 ? "s" : ""}`,
    );
  }

  return parts.join(", ");
};

const formatCrimeSentence = (crime: InmateCrime): string => {
  const parts: string[] = [];

  if (crime.sentence_years) {
    parts.push(`${crime.sentence_years}a`);
  }

  if (crime.sentence_months) {
    parts.push(`${crime.sentence_months}m`);
  }

  if (crime.sentence_days) {
    parts.push(`${crime.sentence_days}d`);
  }

  return parts.join(" ");
};

const editLegalProfile = () => {
  // Navigate to legal profile edit
  Swal.fire({
    title: "Función en Desarrollo",
    text: "La edición del perfil legal estará disponible próximamente.",
    icon: "info",
    confirmButtonText: "OK",
  });
};

const createLegalProfile = () => {
  // Navigate to legal profile creation
  Swal.fire({
    title: "Función en Desarrollo",
    text: "La creación del perfil legal estará disponible próximamente.",
    icon: "info",
    confirmButtonText: "OK",
  });
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

.table th {
  font-weight: 600;
  color: var(--kt-gray-800);
}
</style>
