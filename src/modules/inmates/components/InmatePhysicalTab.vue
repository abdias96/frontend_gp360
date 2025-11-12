<template>
  <div class="row g-6 g-xl-9">
    <!-- Biometric Enrollment Section -->
    <div class="col-12 mb-5" v-if="showBiometricInfo">
      <div class="card card-flush">
        <div class="card-header">
          <h3 class="card-title">Información de Captura Biométrica</h3>
          <div class="card-toolbar">
            <button
              @click="showBiometricInfo = false"
              class="btn btn-sm btn-light"
            >
              <i class="bi bi-x"></i> Cerrar
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="alert alert-info">
            <div class="d-flex align-items-center">
              <i class="bi bi-info-circle fs-2 me-3"></i>
              <div>
                <h5 class="mb-1">Aplicación de Captura Biométrica</h5>
                <p class="mb-0">La captura de huellas dactilares se realiza mediante una aplicación de escritorio dedicada.</p>
                <p class="mb-0 mt-2">Esta aplicación capturará las 10 huellas digitales del PPL y las almacenará de forma segura.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Physical Characteristics Overview -->
    <div class="col-md-6 col-xl-4">
      <div class="card card-flush h-100">
        <div class="card-header pt-7">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-gray-800"
              >Características Físicas</span
            >
            <span class="text-gray-600 mt-1 fw-semibold fs-6"
              >Descripción física general</span
            >
          </h3>
          <div class="card-toolbar">
            <button
              v-if="canEditPhysical"
              @click="openEditPhysicalModal"
              class="btn btn-sm btn-light-primary"
            >
              <KTIcon icon-name="pencil" icon-class="fs-2" />
              Actualizar
            </button>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.physical" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          <div v-else>
            <!-- Height and Weight -->
            <div class="row mb-4">
              <div class="col-6">
                <span class="fw-bold text-gray-600 d-block mb-2">Estatura</span>
                <span class="text-gray-800">
                  {{
                    physicalProfile?.height_cm
                      ? `${physicalProfile.height_cm} cm`
                      : "No registrado"
                  }}
                </span>
              </div>
              <div class="col-6">
                <span class="fw-bold text-gray-600 d-block mb-2">Peso</span>
                <span class="text-gray-800">
                  {{
                    physicalProfile?.weight_kg
                      ? `${physicalProfile.weight_kg} kg`
                      : "No registrado"
                  }}
                </span>
              </div>
            </div>

            <!-- BMI Calculation -->
            <div v-if="bmiValue" class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2"
                >Índice de Masa Corporal</span
              >
              <div class="d-flex align-items-center">
                <span class="text-gray-800 me-2">{{ bmiValue }}</span>
                <span class="badge" :class="getBMIClass(bmiValue)">
                  {{ getBMICategory(bmiValue) }}
                </span>
              </div>
            </div>

            <!-- Build Type -->
            <div v-if="physicalProfile?.build" class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2">Complexión</span>
              <span class="text-gray-800">{{ physicalProfile.build }}</span>
            </div>

            <!-- Physical Features -->
            <div class="row mb-4">
              <div class="col-6">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Color de Ojos</span
                >
                <span class="text-gray-800">
                  {{ physicalProfile?.eye_color || "No especificado" }}
                </span>
              </div>
              <div class="col-6">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Color de Cabello</span
                >
                <span class="text-gray-800">
                  {{ physicalProfile?.hair_color || "No especificado" }}
                </span>
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-6">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Tipo de Cabello</span
                >
                <span class="text-gray-800">
                  {{ physicalProfile?.hair_type || "No especificado" }}
                </span>
              </div>
              <div class="col-6">
                <span class="fw-bold text-gray-600 d-block mb-2"
                  >Color de Piel</span
                >
                <span class="text-gray-800">
                  {{ physicalProfile?.skin_color || "No especificado" }}
                </span>
              </div>
            </div>

            <!-- Face Shape -->
            <div v-if="physicalProfile?.face_shape" class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2"
                >Forma del Rostro</span
              >
              <span class="text-gray-800">{{
                physicalProfile.face_shape
              }}</span>
            </div>

            <!-- Last Update -->
            <div class="text-gray-600 fs-8">
              <KTIcon icon-name="calendar" icon-class="fs-7 me-1" />
              Última actualización:
              {{ formatDate(physicalProfile?.updated_at || "") }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Distinctive Marks & Features -->
    <div class="col-md-6 col-xl-4">
      <div class="card card-flush h-100">
        <div class="card-header pt-7">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-gray-800"
              >Marcas Distintivas</span
            >
            <span class="text-gray-600 mt-1 fw-semibold fs-6"
              >Tatuajes, cicatrices y marcas</span
            >
          </h3>
          <div class="card-toolbar">
            <button
              v-if="canEditPhysical"
              @click="openManageMarksModal"
              class="btn btn-sm btn-light-warning"
            >
              <KTIcon icon-name="picture" icon-class="fs-2" />
              Gestionar
            </button>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.marks" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          <div v-else>
            <!-- Tattoos -->
            <div class="mb-4">
              <div class="d-flex align-items-center mb-2">
                <KTIcon
                  icon-name="picture"
                  icon-class="fs-3 text-primary me-2"
                />
                <span class="fw-bold text-gray-600">Tatuajes</span>
              </div>
              <div
                v-if="physicalProfile?.tattoos_description"
                class="p-3 border border-dashed border-primary rounded bg-light-primary"
              >
                <span class="text-gray-800 fs-7">{{
                  physicalProfile.tattoos_description
                }}</span>
              </div>
              <div v-else class="text-gray-500 fs-7">
                No se han registrado tatuajes
              </div>
            </div>

            <!-- Scars -->
            <div class="mb-4">
              <div class="d-flex align-items-center mb-2">
                <KTIcon
                  icon-name="information"
                  icon-class="fs-3 text-warning me-2"
                />
                <span class="fw-bold text-gray-600">Cicatrices</span>
              </div>
              <div
                v-if="physicalProfile?.scars_description"
                class="p-3 border border-dashed border-warning rounded bg-light-warning"
              >
                <span class="text-gray-800 fs-7">{{
                  physicalProfile.scars_description
                }}</span>
              </div>
              <div v-else class="text-gray-500 fs-7">
                No se han registrado cicatrices
              </div>
            </div>

            <!-- Other Distinctive Marks -->
            <div class="mb-4">
              <div class="d-flex align-items-center mb-2">
                <KTIcon
                  icon-name="notepad-edit"
                  icon-class="fs-3 text-info me-2"
                />
                <span class="fw-bold text-gray-600">Otras Características</span>
              </div>
              <div
                v-if="physicalProfile?.other_characteristics"
                class="p-3 border border-dashed border-info rounded bg-light-info"
              >
                <span class="text-gray-800 fs-7">{{
                  physicalProfile.other_characteristics
                }}</span>
              </div>
              <div v-else class="text-gray-500 fs-7">
                No se han registrado otras características
              </div>
            </div>

            <!-- Distinctive Marks Summary -->
            <div v-if="physicalProfile?.distinctive_marks" class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2"
                >Resumen de Marcas</span
              >
              <div class="scroll-y" style="max-height: 150px">
                <div
                  v-for="(mark, index) in getDistinctiveMarks()"
                  :key="index"
                  class="border border-gray-300 border-dashed rounded p-2 mb-2"
                >
                  <div class="fw-bold text-gray-800 fs-7">{{ mark.type }}</div>
                  <div class="text-gray-600 fs-8">{{ mark.description }}</div>
                  <div v-if="mark.location" class="text-gray-500 fs-8">
                    Ubicación: {{ mark.location }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Biometric Data & Photos -->
    <div class="col-md-6 col-xl-4">
      <div class="card card-flush h-100">
        <div class="card-header pt-7">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-gray-800"
              >Datos Biométricos</span
            >
            <span class="text-gray-600 mt-1 fw-semibold fs-6"
              >Huellas y fotografías</span
            >
          </h3>
          <div class="card-toolbar">
            <button
              v-if="canEditPhysical"
              @click="launchJavaBiometricService"
              class="btn btn-sm btn-primary"
              :disabled="loading.biometrics || isServiceRunning"
              title="Captura completa de 10 huellas dactilares"
            >
              <KTIcon icon-name="fingerprint-scanning" icon-class="fs-2 me-1" />
              {{ isServiceRunning ? 'Capturando...' : 'Capturar Huellas' }}
            </button>
              <div
                class="dropdown-menu menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-200px py-4"
              >
                <div v-if="canManageBiometrics" class="menu-item px-3">
                  <a
                    @click.prevent="captureFingerprints"
                    class="menu-link px-3"
                  >
                    <KTIcon
                      icon-name="fingerprint-scanning"
                      icon-class="fs-6 me-2"
                    />
                    Capturar Huellas
                  </a>
                </div>
                <div v-if="canManageBiometrics" class="menu-item px-3">
                  <a @click.prevent="capturePhoto" class="menu-link px-3">
                    <KTIcon icon-name="camera" icon-class="fs-6 me-2" />
                    Tomar Fotografía
                  </a>
                </div>
                <div class="menu-separator"></div>
                <div class="menu-item px-3">
                  <a
                    @click.prevent="viewBiometricHistory"
                    class="menu-link px-3"
                  >
                    <KTIcon icon-name="time" icon-class="fs-6 me-2" />
                    Historial
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.biometrics" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          <div v-else>
            <!-- Biometric Status Overview -->
            <div class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2"
                >Estado General</span
              >
              <span
                class="badge badge-lg"
                :class="
                  inmate.has_biometric_data
                    ? 'badge-light-success'
                    : 'badge-light-warning'
                "
              >
                <KTIcon
                  :icon-name="
                    inmate.has_biometric_data ? 'shield-check' : 'warning-2'
                  "
                  icon-class="fs-6 me-1"
                />
                {{
                  inmate.has_biometric_data
                    ? "Datos Completos"
                    : "Datos Pendientes"
                }}
              </span>
            </div>

            <!-- Fingerprint Data -->
            <div class="mb-4">
              <div
                class="d-flex align-items-center p-3 border border-gray-300 border-dashed rounded"
              >
                <div class="symbol symbol-40px me-3">
                  <div
                    class="symbol-label"
                    :class="
                      biometricData?.fingerprint_template
                        ? 'bg-light-success'
                        : 'bg-light-warning'
                    "
                  >
                    <KTIcon
                      icon-name="fingerprint-scanning"
                      :icon-class="`fs-2 ${biometricData?.fingerprint_template ? 'text-success' : 'text-warning'}`"
                    />
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-800 fs-6">
                    Huellas Dactilares
                  </div>
                  <div class="text-gray-600 fs-7">
                    {{
                      biometricData?.fingerprint_template
                        ? "Registradas"
                        : "Pendientes de captura"
                    }}
                  </div>
                  <div
                    v-if="biometricData?.fingerprint_quality"
                    class="text-gray-600 fs-8"
                  >
                    Calidad: {{ biometricData.fingerprint_quality }}%
                  </div>
                </div>
                <span
                  class="badge"
                  :class="
                    biometricData?.fingerprint_template
                      ? 'badge-light-success'
                      : 'badge-light-warning'
                  "
                >
                  {{
                    biometricData?.fingerprint_template
                      ? "Completo"
                      : "Pendiente"
                  }}
                </span>
              </div>
            </div>

            <!-- Facial Recognition -->
            <div class="mb-4">
              <div
                class="d-flex align-items-center p-3 border border-gray-300 border-dashed rounded"
              >
                <div class="symbol symbol-40px me-3">
                  <div
                    class="symbol-label"
                    :class="
                      biometricData?.facial_template
                        ? 'bg-light-success'
                        : 'bg-light-warning'
                    "
                  >
                    <KTIcon
                      icon-name="scan-barcode"
                      :icon-class="`fs-2 ${biometricData?.facial_template ? 'text-success' : 'text-warning'}`"
                    />
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-800 fs-6">
                    Reconocimiento Facial
                  </div>
                  <div class="text-gray-600 fs-7">
                    {{
                      biometricData?.facial_template
                        ? "Registrado"
                        : "Pendiente de captura"
                    }}
                  </div>
                </div>
                <span
                  class="badge"
                  :class="
                    biometricData?.facial_template
                      ? 'badge-light-success'
                      : 'badge-light-warning'
                  "
                >
                  {{
                    biometricData?.facial_template ? "Completo" : "Pendiente"
                  }}
                </span>
              </div>
            </div>

            <!-- Current Photos -->
            <div class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-3"
                >Fotografías Actuales</span
              >
              <div v-if="currentPhotos.length > 0" class="row g-2">
                <div
                  v-for="photo in currentPhotos"
                  :key="photo.id"
                  class="col-6"
                >
                  <div class="card card-flush">
                    <div class="card-body p-2">
                      <img
                        :src="photo.photo_url"
                        :alt="photo.description || 'Foto del interno'"
                        class="w-100 rounded"
                        style="height: 120px; object-fit: cover"
                        @click="viewPhotoDetail(photo)"
                      />
                      <div class="text-center mt-2">
                        <span class="badge badge-sm badge-light-primary">
                          {{ getPhotoTypeText(photo.photo_type) }}
                        </span>
                      </div>
                      <div class="text-center text-gray-600 fs-8">
                        {{ formatDate(photo.capture_date) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-3">
                <KTIcon
                  icon-name="camera"
                  icon-class="fs-5x text-gray-400 mb-2"
                />
                <div class="text-gray-600">No hay fotografías registradas</div>
              </div>
            </div>

            <!-- Biometric Quality Score -->
            <div v-if="biometricData?.biometric_quality_score" class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2"
                >Puntuación de Calidad</span
              >
              <div class="progress progress-sm">
                <div
                  class="progress-bar"
                  :class="
                    getQualityClass(biometricData.biometric_quality_score)
                  "
                  :style="`width: ${biometricData.biometric_quality_score}%`"
                ></div>
              </div>
              <div class="text-gray-600 fs-8 mt-1">
                {{ biometricData.biometric_quality_score }}% -
                {{ getQualityText(biometricData.biometric_quality_score) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Physical Profile History -->
    <div class="col-12">
      <div class="card card-flush">
        <div class="card-header pt-7">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-gray-800"
              >Historial de Cambios Físicos</span
            >
            <span class="text-gray-600 mt-1 fw-semibold fs-6"
              >Registro de modificaciones en el perfil físico</span
            >
          </h3>
          <div class="card-toolbar">
            <button
              @click="refreshPhysicalHistory"
              class="btn btn-sm btn-light"
            >
              <KTIcon icon-name="arrows-circle" icon-class="fs-2" />
              Actualizar
            </button>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.history" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          <div
            v-else-if="physicalHistory.length === 0"
            class="text-center py-5"
          >
            <KTIcon icon-name="time" icon-class="fs-5x text-gray-400 mb-4" />
            <div class="text-gray-600">
              No hay cambios registrados en el perfil físico
            </div>
          </div>
          <div v-else>
            <div class="timeline timeline-3">
              <div
                v-for="change in physicalHistory"
                :key="change.id"
                class="timeline-item"
              >
                <div class="timeline-line w-40px"></div>
                <div class="timeline-icon symbol symbol-circle symbol-40px">
                  <div class="symbol-label bg-light-primary">
                    <KTIcon
                      :icon-name="getChangeIcon(change.change_type)"
                      icon-class="fs-2 text-primary"
                    />
                  </div>
                </div>
                <div class="timeline-content mb-10 mt-n1">
                  <div class="mb-5 pe-3">
                    <div class="fs-5 fw-semibold text-gray-800 mb-2">
                      {{ getChangeTitle(change.change_type) }}
                    </div>
                    <div class="text-gray-600 fw-semibold mb-2">
                      {{ change.description }}
                    </div>
                    <div
                      v-if="change.old_value || change.new_value"
                      class="text-gray-500 fs-7"
                    >
                      <span v-if="change.old_value"
                        >Anterior: {{ change.old_value }}</span
                      >
                      <span v-if="change.old_value && change.new_value">
                        →
                      </span>
                      <span v-if="change.new_value"
                        >Nuevo: {{ change.new_value }}</span
                      >
                    </div>
                  </div>
                  <div class="overflow-auto pb-5">
                    <div class="d-flex align-items-center text-gray-600 fs-8">
                      <KTIcon icon-name="calendar" icon-class="fs-7 me-1" />
                      {{ formatDateTime(change.change_date) }}
                      <span class="mx-2">•</span>
                      <KTIcon icon-name="user" icon-class="fs-7 me-1" />
                      {{ change.changed_by_name }}
                    </div>
                  </div>
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
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import ApiService from "@/core/services/ApiService";
import type {
  InmateDetail,
  InmatePhysicalProfile,
  InmateBiometricData,
  InmatePhoto,
} from "@/types/inmates";
import Swal from "sweetalert2";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";

interface Props {
  inmate: InmateDetail;
}

// Physical profile specific interfaces
interface PhysicalChange {
  id: number;
  change_date: string;
  change_type:
    | "measurement"
    | "appearance"
    | "mark_added"
    | "mark_removed"
    | "photo_added";
  description: string;
  old_value?: string;
  new_value?: string;
  changed_by_name: string;
}

const props = defineProps<Props>();
const authStore = useAuthStore();

// Reactive data
const physicalProfile = ref<InmatePhysicalProfile | null>(null);
const biometricData = ref<InmateBiometricData | null>(null);
const currentPhotos = ref<InmatePhoto[]>([]);
const physicalHistory = ref<PhysicalChange[]>([]);
const showBiometricInfo = ref(false);
const inmateId = computed(() => props.inmate?.id || 0);
const isServiceRunning = ref(false);
const pollingInterval = ref<any>(null);

const loading = ref({
  physical: false,
  marks: false,
  biometrics: false,
  history: false,
});

// Computed properties
const canEditPhysical = computed(() =>
  authStore.hasPermission("inmates.edit_physical"),
);
const canManageBiometrics = computed(() =>
  authStore.hasPermission("biometrics.manage"),
);

const bmiValue = computed(() => {
  if (!physicalProfile.value?.height_cm || !physicalProfile.value?.weight_kg)
    return null;
  const heightM = physicalProfile.value.height_cm / 100;
  const bmi = physicalProfile.value.weight_kg / (heightM * heightM);
  return bmi.toFixed(1);
});

// Methods
const loadPhysicalData = async () => {
  try {
    loading.value.physical = true;

    console.log('Inmate data in physical tab:', props.inmate);
    console.log('Physical profile from inmate (snake_case):', props.inmate.physical_profile);

    // Use data already loaded from InmateController show() method
    // Backend returns snake_case keys
    if (props.inmate.physical_profile) {
      physicalProfile.value = props.inmate.physical_profile;
    } else {
      // No physical profile exists yet
      physicalProfile.value = null;
    }
  } catch (error) {
    console.error("Error processing physical data:", error);
    physicalProfile.value = null;
  } finally {
    loading.value.physical = false;
  }
};

const loadBiometricData = async () => {
  try {
    loading.value.biometrics = true;

    console.log('Photos from inmate:', props.inmate.photos);

    // Use photos already loaded from InmateController show() method
    if (props.inmate.photos) {
      currentPhotos.value = props.inmate.photos.filter((p) => p.is_current);
    } else {
      currentPhotos.value = [];
    }

    // For biometric data, we still need to make API call as it's not loaded by default
    // This is because biometric templates are BLOB data and shouldn't be loaded unless needed
    try {
      const biometricResponse = await ApiService.get(`/inmates/${props.inmate.id}/biometric-data`);
      if (biometricResponse.data.data) {
        biometricData.value = biometricResponse.data.data;
      } else {
        biometricData.value = null;
      }
    } catch (bioError) {
      console.error("Error loading biometric data:", bioError);
      biometricData.value = null;
    }
  } catch (error) {
    console.error("Error processing biometric data:", error);
    currentPhotos.value = [];
    biometricData.value = null;
  } finally {
    loading.value.biometrics = false;
  }
};

const loadPhysicalHistory = async () => {
  try {
    loading.value.history = true;

    console.log('Weight history from inmate (snake_case):', props.inmate.weight_history);

    // Use weight history already loaded from InmateController show() method
    // Backend returns snake_case keys
    if (props.inmate.weight_history && props.inmate.weight_history.length > 0) {
      // Transform weight history into physical history format
      physicalHistory.value = props.inmate.weight_history.map((item: any) => ({
        id: item.id,
        change_date: item.measurement_date,
        change_type: 'measurement',
        description: 'Actualización de peso',
        old_value: item.previous_weight ? `${item.previous_weight} kg` : null,
        new_value: `${item.weight_kg || item.weight} kg`,
        changed_by_name: item.recorded_by?.first_name + ' ' + item.recorded_by?.last_name || 'Sistema'
      }));
    } else {
      physicalHistory.value = [];
    }
  } catch (error) {
    console.error("Error processing physical history:", error);
    physicalHistory.value = [];
  } finally {
    loading.value.history = false;
  }
};

// Physical profile methods
const openEditPhysicalModal = () => {
  Swal.fire({
    title: "Actualizar Perfil Físico",
    text: "Funcionalidad de actualización de características físicas en desarrollo.",
    icon: "info",
    confirmButtonText: "OK",
  });
};

const openManageMarksModal = () => {
  Swal.fire({
    title: "Gestionar Marcas Distintivas",
    text: "Funcionalidad de gestión de tatuajes, cicatrices y marcas en desarrollo.",
    icon: "info",
    confirmButtonText: "OK",
  });
};

// Biometric methods - Same approach as BiometricCapture.vue which works correctly
const launchJavaBiometricService = async () => {
  if (isServiceRunning.value) {
    Swal.fire({
      title: 'Servicio en ejecución',
      text: 'El servicio biométrico ya está en ejecución',
      icon: 'warning'
    });
    return;
  }

  try {
    isServiceRunning.value = true;

    // Show loading message
    Swal.fire({
      title: 'Preparando servicio biométrico',
      text: 'Generando enlace seguro...',
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Get protocol URL from backend - Same endpoint as BiometricCapture.vue
    const response = await ApiService.get(`/inmates/${props.inmate.id}/biometric/protocol-url`);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al generar URL del servicio biométrico');
    }

    // Close loading and show instructions
    Swal.close();

    const confirmResult = await Swal.fire({
      title: 'Abrir Servicio Biométrico',
      html: `
        <div style="text-align: left;">
          <p>Se abrirá la aplicación de captura de huellas dactilares.</p>
          <p><strong>Instrucciones:</strong></p>
          <ol>
            <li>El navegador solicitará permiso para abrir GP360 Biometric Service</li>
            <li>Haga clic en "Abrir" o "Permitir"</li>
            <li>Complete la captura de las 10 huellas dactilares</li>
            <li>Espere a que termine el proceso</li>
          </ol>
          <p class="text-muted small mt-3">Si no se abre automáticamente, asegúrese de que el servicio esté instalado en su equipo.</p>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Abrir Servicio',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmResult.isConfirmed) {
      isServiceRunning.value = false;
      return;
    }

    // Open protocol URL (will launch Java app) - Same as BiometricCapture.vue
    window.location.href = response.data.data.protocol_url;

    // Show monitoring message
    Swal.fire({
      title: 'Servicio Biométrico Activo',
      html: `
        <div style="text-align: left;">
          <p>La aplicación de captura debería haberse abierto.</p>
          <p><strong>Monitoreo en curso...</strong></p>
          <p class="text-muted">Esta ventana se cerrará automáticamente cuando complete la captura.</p>
        </div>
      `,
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Start polling for completion - Same as BiometricCapture.vue
    startEnrollmentPolling();

  } catch (error: any) {
    console.error('Error launching biometric service:', error);
    isServiceRunning.value = false;

    Swal.fire({
      title: 'Error',
      text: error.message || 'No se pudo iniciar el servicio biométrico',
      icon: 'error'
    });
  }
};

const startEnrollmentPolling = () => {
  // Poll every 3 seconds to check if enrollment is complete - Same as BiometricCapture.vue
  pollingInterval.value = setInterval(async () => {
    try {
      const response = await ApiService.get(`/inmates/${props.inmate.id}/biometric/enrollment-status`);

      if (response.data.success) {
        const status = response.data.data;

        // Check if enrollment is complete
        if (status.is_complete || status.total_enrolled >= 10) {
          stopEnrollmentPolling();
          isServiceRunning.value = false;

          // Reload biometric data
          await loadBiometricData();

          Swal.fire({
            title: '¡Éxito!',
            text: `Se han registrado ${status.total_enrolled} huellas dactilares correctamente`,
            icon: 'success',
            timer: 3000,
            showConfirmButton: false
          });
        }
      }
    } catch (error) {
      console.error('Error checking enrollment status:', error);
    }
  }, 3000); // Check every 3 seconds

  // Auto-stop after 5 minutes
  setTimeout(() => {
    if (pollingInterval.value) {
      stopEnrollmentPolling();
      isServiceRunning.value = false;

      Swal.fire({
        title: 'Tiempo agotado',
        text: 'No se detectó la finalización del servicio biométrico. Puede verificar manualmente.',
        icon: 'warning'
      });
    }
  }, 300000); // 5 minutes
};

const stopEnrollmentPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
    pollingInterval.value = null;
  }
};

const capturePhoto = () => {
  Swal.fire({
    title: "Tomar Fotografía",
    text: "Funcionalidad de captura de fotografías en desarrollo.",
    icon: "info",
    confirmButtonText: "OK",
  });
};

const viewBiometricHistory = () => {
  Swal.fire({
    title: "Historial Biométrico",
    text: "Funcionalidad de historial de datos biométricos en desarrollo.",
    icon: "info",
    confirmButtonText: "OK",
  });
};

const viewPhotoDetail = (photo: InmatePhoto) => {
  console.log("Viewing photo detail:", photo.id);
};

const refreshPhysicalHistory = async () => {
  await loadPhysicalHistory();
};

// Helper methods
const getBMIClass = (bmi: string): string => {
  const bmiNum = parseFloat(bmi);
  if (bmiNum < 18.5) return "badge-light-warning";
  if (bmiNum < 25) return "badge-light-success";
  if (bmiNum < 30) return "badge-light-warning";
  return "badge-light-danger";
};

const getBMICategory = (bmi: string): string => {
  const bmiNum = parseFloat(bmi);
  if (bmiNum < 18.5) return "Bajo peso";
  if (bmiNum < 25) return "Normal";
  if (bmiNum < 30) return "Sobrepeso";
  return "Obesidad";
};

const getDistinctiveMarks = (): Array<{
  type: string;
  description: string;
  location?: string;
}> => {
  if (!physicalProfile.value?.distinctive_marks) return [];

  // Parse distinctive marks JSON data
  try {
    return JSON.parse(physicalProfile.value.distinctive_marks);
  } catch {
    return [];
  }
};

const getPhotoTypeText = (type: string): string => {
  const types: Record<string, string> = {
    mugshot: "Ficha",
    profile: "Perfil",
    identification: "Identificación",
    other: "Otra",
  };
  return types[type] || type;
};

const getQualityClass = (score: number): string => {
  if (score >= 90) return "bg-success";
  if (score >= 70) return "bg-warning";
  return "bg-danger";
};

const getQualityText = (score: number): string => {
  if (score >= 90) return "Excelente";
  if (score >= 70) return "Buena";
  if (score >= 50) return "Regular";
  return "Baja";
};

const getChangeIcon = (changeType: string): string => {
  const icons: Record<string, string> = {
    measurement: "ruler",
    appearance: "eye",
    mark_added: "plus",
    mark_removed: "minus",
    photo_added: "camera",
  };
  return icons[changeType] || "information";
};

const getChangeTitle = (changeType: string): string => {
  const titles: Record<string, string> = {
    measurement: "Actualización de Medidas",
    appearance: "Cambio de Apariencia",
    mark_added: "Marca Distintiva Agregada",
    mark_removed: "Marca Distintiva Eliminada",
    photo_added: "Fotografía Agregada",
  };
  return titles[changeType] || changeType;
};

const formatDate = (date: string): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("es-GT");
};

const formatDateTime = (datetime: string): string => {
  if (!datetime) return "N/A";
  return new Date(datetime).toLocaleString("es-GT");
};

// Lifecycle
onMounted(() => {
  loadPhysicalData();
  loadBiometricData();
  loadPhysicalHistory();
});

onUnmounted(() => {
  stopEnrollmentPolling();
});
</script>

<style scoped>
.scroll-y {
  overflow-y: auto;
}

.symbol-40px {
  width: 40px;
  height: 40px;
}

.badge-lg {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.timeline-3 .timeline-item {
  display: flex;
  margin-bottom: 1rem;
}

.timeline-line {
  background-color: #e1e3ea;
  border-radius: 0.475rem;
  flex-shrink: 0;
}

.timeline-icon {
  flex-shrink: 0;
  margin: 0 1rem;
}

.timeline-content {
  flex-grow: 1;
}

.progress-sm {
  height: 6px;
}
</style>
