<template>
  <div 
    id="physicalProfileDetailModal" 
    class="modal fade" 
    tabindex="-1" 
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">
            Detalles del Perfil Físico
            <span v-if="profile?.inmate" class="text-muted fs-6 ms-2">
              - {{ getInmateName(profile.inmate) }}
            </span>
          </h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" @click="close">
            <i class="ki-duotone ki-cross fs-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
        </div>

        <div class="modal-body py-10 px-lg-17">
          <!-- Loading -->
          <div v-if="loading" class="text-center py-10">
            <div class="spinner-border spinner-border-lg text-primary" role="status">
              <span class="visually-hidden">Cargando detalles...</span>
            </div>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="alert alert-danger">
            <div class="d-flex">
              <i class="ki-duotone ki-cross-circle fs-2tx text-danger me-4">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="d-flex flex-column">
                <h4 class="mb-1 text-danger">Error al cargar detalles</h4>
                <span>{{ error }}</span>
              </div>
            </div>
          </div>

          <!-- Profile Details -->
          <div v-else-if="profile" class="row">
            <!-- Left Column -->
            <div class="col-lg-6">
              <!-- Basic Information -->
              <div class="card card-flush mb-6">
                <div class="card-header">
                  <div class="card-title">
                    <h3 class="fw-bold m-0">Información Básica</h3>
                  </div>
                </div>
                <div class="card-body pt-6">
                  <div class="table-responsive">
                    <table class="table table-row-dashed table-row-gray-200">
                      <tbody>
                        <tr>
                          <td class="fw-bold text-muted">Interno:</td>
                          <td class="fw-semibold">{{ getInmateName(profile.inmate) }}</td>
                        </tr>
                        <tr>
                          <td class="fw-bold text-muted">Número:</td>
                          <td>{{ profile.inmate?.inmate_number }}</td>
                        </tr>
                        <tr>
                          <td class="fw-bold text-muted">Estatura:</td>
                          <td>{{ profile.height }} cm</td>
                        </tr>
                        <tr>
                          <td class="fw-bold text-muted">Peso:</td>
                          <td>{{ profile.weight }} kg</td>
                        </tr>
                        <tr>
                          <td class="fw-bold text-muted">Tipo Físico:</td>
                          <td>
                            <span 
                              class="badge"
                              :class="getBuildTypeBadgeClass(profile.build_type)"
                            >
                              {{ getBuildTypeLabel(profile.build_type) }}
                            </span>
                          </td>
                        </tr>
                        <tr v-if="profile.bmi">
                          <td class="fw-bold text-muted">IMC:</td>
                          <td>
                            <span class="fw-semibold">{{ profile.bmi }}</span>
                            <span v-if="profile.bmi_category" class="text-muted ms-2">
                              ({{ getBMICategoryLabel(profile.bmi_category) }})
                            </span>
                          </td>
                        </tr>
                        <tr v-if="profile.blood_type">
                          <td class="fw-bold text-muted">Tipo de Sangre:</td>
                          <td>{{ profile.blood_type.name }} ({{ profile.blood_type.code }})</td>
                        </tr>
                        <tr v-if="profile.mobility_status">
                          <td class="fw-bold text-muted">Movilidad:</td>
                          <td>
                            <span 
                              class="badge"
                              :class="getMobilityBadgeClass(profile.mobility_status)"
                            >
                              {{ getMobilityLabel(profile.mobility_status) }}
                            </span>
                          </td>
                        </tr>
                        <tr v-if="profile.mobility_notes">
                          <td class="fw-bold text-muted">Notas de Movilidad:</td>
                          <td>{{ profile.mobility_notes }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Physical Characteristics -->
              <div class="card card-flush mb-6">
                <div class="card-header">
                  <div class="card-title">
                    <h3 class="fw-bold m-0">Características Físicas</h3>
                  </div>
                </div>
                <div class="card-body pt-6">
                  <div class="row g-6">
                    <!-- Eyes -->
                    <div class="col-md-6" v-if="profile.eye_color || profile.eye_shape">
                      <div class="d-flex align-items-center">
                        <i class="ki-duotone ki-eye fs-2x text-primary me-4">
                          <span class="path1"></span>
                          <span class="path2"></span>
                          <span class="path3"></span>
                        </i>
                        <div>
                          <div class="fw-bold text-gray-800">Ojos</div>
                          <div class="text-muted fs-7">
                            {{ getEyeColorLabel(profile.eye_color) }}
                            <span v-if="profile.eye_shape">
                              - {{ getEyeShapeLabel(profile.eye_shape) }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Hair -->
                    <div class="col-md-6" v-if="profile.hair_color || profile.hair_type">
                      <div class="d-flex align-items-center">
                        <i class="ki-duotone ki-brush fs-2x text-info me-4">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        <div>
                          <div class="fw-bold text-gray-800">Cabello</div>
                          <div class="text-muted fs-7">
                            {{ getHairColorLabel(profile.hair_color) }}
                            <span v-if="profile.hair_type">
                              - {{ getHairTypeLabel(profile.hair_type) }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Skin -->
                    <div class="col-md-6" v-if="profile.skin_tone">
                      <div class="d-flex align-items-center">
                        <i class="ki-duotone ki-color-swatch fs-2x text-warning me-4">
                          <span class="path1"></span>
                          <span class="path2"></span>
                          <span class="path3"></span>
                        </i>
                        <div>
                          <div class="fw-bold text-gray-800">Piel</div>
                          <div class="text-muted fs-7">
                            {{ getSkinToneLabel(profile.skin_tone) }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Face -->
                    <div class="col-md-6" v-if="profile.face_shape">
                      <div class="d-flex align-items-center">
                        <i class="ki-duotone ki-profile-circle fs-2x text-success me-4">
                          <span class="path1"></span>
                          <span class="path2"></span>
                          <span class="path3"></span>
                        </i>
                        <div>
                          <div class="fw-bold text-gray-800">Rostro</div>
                          <div class="text-muted fs-7">
                            {{ getFaceShapeLabel(profile.face_shape) }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Nose -->
                    <div class="col-md-6" v-if="profile.nose_type">
                      <div class="d-flex align-items-center">
                        <i class="ki-duotone ki-element-7 fs-2x text-dark me-4">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        <div>
                          <div class="fw-bold text-gray-800">Nariz</div>
                          <div class="text-muted fs-7">
                            {{ getNoseTypeLabel(profile.nose_type) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Distinguishing Marks -->
              <div class="card card-flush mb-6">
                <div class="card-header">
                  <div class="card-title">
                    <h3 class="fw-bold m-0">Marcas Distintivas</h3>
                  </div>
                </div>
                <div class="card-body pt-6">
                  <!-- Tattoos -->
                  <div v-if="profile.tattoos_description" class="mb-6">
                    <div class="d-flex align-items-start mb-2">
                      <i class="ki-duotone ki-brush fs-2x text-primary me-4 mt-1">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <div class="flex-grow-1">
                        <div class="fw-bold text-gray-800 mb-2">Tatuajes</div>
                        <p class="text-gray-700 mb-3">{{ profile.tattoos_description }}</p>
                        <div v-if="profile.tattoos_locations?.length" class="d-flex flex-wrap gap-2">
                          <span 
                            v-for="location in profile.tattoos_locations" 
                            :key="location"
                            class="badge badge-light-primary fs-8"
                          >
                            {{ getLocationLabel(location) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Scars -->
                  <div v-if="profile.scars_description" class="mb-6">
                    <div class="d-flex align-items-start mb-2">
                      <i class="ki-duotone ki-pencil fs-2x text-warning me-4 mt-1">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <div class="flex-grow-1">
                        <div class="fw-bold text-gray-800 mb-2">Cicatrices</div>
                        <p class="text-gray-700 mb-3">{{ profile.scars_description }}</p>
                        <div v-if="profile.scars_locations?.length" class="d-flex flex-wrap gap-2">
                          <span 
                            v-for="location in profile.scars_locations" 
                            :key="location"
                            class="badge badge-light-warning fs-8"
                          >
                            {{ getLocationLabel(location) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Birthmarks -->
                  <div v-if="profile.birthmarks" class="mb-6">
                    <div class="d-flex align-items-start mb-2">
                      <i class="ki-duotone ki-geolocation fs-2x text-success me-4 mt-1">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <div class="flex-grow-1">
                        <div class="fw-bold text-gray-800 mb-2">Lunares y Marcas de Nacimiento</div>
                        <p class="text-gray-700">{{ profile.birthmarks }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Other marks -->
                  <div v-if="profile.other_distinguishing_marks" class="mb-6">
                    <div class="d-flex align-items-start mb-2">
                      <i class="ki-duotone ki-star fs-2x text-info me-4 mt-1">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                      </i>
                      <div class="flex-grow-1">
                        <div class="fw-bold text-gray-800 mb-2">Otras Marcas Distintivas</div>
                        <p class="text-gray-700">{{ profile.other_distinguishing_marks }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- No distinguishing marks -->
                  <div v-if="!hasAnyMarks" class="text-center py-6">
                    <i class="ki-duotone ki-information fs-3x text-muted mb-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                    </i>
                    <div class="text-muted">No se han registrado marcas distintivas</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="col-lg-6">
              <!-- Additional Characteristics -->
              <div class="card card-flush mb-6">
                <div class="card-header">
                  <div class="card-title">
                    <h3 class="fw-bold m-0">Características Adicionales</h3>
                  </div>
                </div>
                <div class="card-body pt-6">
                  <div class="row g-6">
                    <!-- Facial Features -->
                    <div class="col-12">
                      <div class="fw-bold text-gray-800 mb-3">Características Faciales</div>
                      <div class="d-flex flex-wrap gap-3">
                        <span 
                          v-if="profile.has_beard"
                          class="badge badge-light-primary fs-8"
                        >
                          <i class="ki-duotone ki-user fs-8 me-1">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                          Tiene Barba
                        </span>
                        <span 
                          v-if="profile.has_mustache"
                          class="badge badge-light-info fs-8"
                        >
                          <i class="ki-duotone ki-user fs-8 me-1">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                          Tiene Bigote
                        </span>
                        <span 
                          v-if="profile.wears_glasses"
                          class="badge badge-light-success fs-8"
                        >
                          <i class="ki-duotone ki-eye fs-8 me-1">
                            <span class="path1"></span>
                            <span class="path2"></span>
                            <span class="path3"></span>
                          </i>
                          Usa Anteojos
                        </span>
                      </div>
                    </div>

                    <!-- Abilities -->
                    <div class="col-12">
                      <div class="fw-bold text-gray-800 mb-3">Habilidades</div>
                      <div class="d-flex flex-wrap gap-3">
                        <span 
                          v-if="profile.can_read"
                          class="badge badge-light-warning fs-8"
                        >
                          <i class="ki-duotone ki-book fs-8 me-1">
                            <span class="path1"></span>
                            <span class="path2"></span>
                            <span class="path3"></span>
                            <span class="path4"></span>
                          </i>
                          Sabe Leer
                        </span>
                        <span 
                          v-if="profile.can_write"
                          class="badge badge-light-dark fs-8"
                        >
                          <i class="ki-duotone ki-pencil fs-8 me-1">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                          Sabe Escribir
                        </span>
                        <span 
                          v-if="!profile.can_read && !profile.can_write"
                          class="text-muted fs-8"
                        >
                          No se han registrado habilidades específicas
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Medical/Dental Information -->
              <div class="card card-flush mb-6">
                <div class="card-header">
                  <div class="card-title">
                    <h3 class="fw-bold m-0">Información Médica/Dental</h3>
                  </div>
                </div>
                <div class="card-body pt-6">
                  <!-- Dental Work -->
                  <div v-if="profile.has_dental_work || profile.dental_characteristics" class="mb-6">
                    <div class="d-flex align-items-start mb-2">
                      <i class="ki-duotone ki-hospital fs-2x text-primary me-4 mt-1">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <div class="flex-grow-1">
                        <div class="fw-bold text-gray-800 mb-2">Trabajo Dental</div>
                        <div v-if="profile.has_dental_work" class="mb-2">
                          <span class="badge badge-light-primary">Tiene trabajo dental</span>
                        </div>
                        <p v-if="profile.dental_characteristics" class="text-gray-700 mb-0">
                          {{ profile.dental_characteristics }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Prosthetics -->
                  <div v-if="profile.has_prosthetics || profile.prosthetics_description" class="mb-6">
                    <div class="d-flex align-items-start mb-2">
                      <i class="ki-duotone ki-technology-4 fs-2x text-info me-4 mt-1">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                      </i>
                      <div class="flex-grow-1">
                        <div class="fw-bold text-gray-800 mb-2">Prótesis</div>
                        <div v-if="profile.has_prosthetics" class="mb-2">
                          <span class="badge badge-light-info">Tiene prótesis</span>
                        </div>
                        <p v-if="profile.prosthetics_description" class="text-gray-700 mb-0">
                          {{ profile.prosthetics_description }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- No medical info -->
                  <div v-if="!hasMedicalInfo" class="text-center py-6">
                    <i class="ki-duotone ki-cross-circle fs-3x text-muted mb-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                    <div class="text-muted">No se ha registrado información médica/dental</div>
                  </div>
                </div>
              </div>

              <!-- Profile Metadata -->
              <div class="card card-flush">
                <div class="card-header">
                  <div class="card-title">
                    <h3 class="fw-bold m-0">Información del Registro</h3>
                  </div>
                </div>
                <div class="card-body pt-6">
                  <div class="table-responsive">
                    <table class="table table-row-dashed table-row-gray-200">
                      <tbody>
                        <tr v-if="profile.created_by">
                          <td class="fw-bold text-muted">Creado por:</td>
                          <td>{{ profile.created_by.first_name }} {{ profile.created_by.last_name }}</td>
                        </tr>
                        <tr>
                          <td class="fw-bold text-muted">Fecha de creación:</td>
                          <td>{{ formatDateTime(profile.created_at) }}</td>
                        </tr>
                        <tr v-if="profile.updated_by">
                          <td class="fw-bold text-muted">Actualizado por:</td>
                          <td>{{ profile.updated_by.first_name }} {{ profile.updated_by.last_name }}</td>
                        </tr>
                        <tr v-if="profile.updated_at !== profile.created_at">
                          <td class="fw-bold text-muted">Última actualización:</td>
                          <td>{{ formatDateTime(profile.updated_at) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="close">
            Cerrar
          </button>
          <button 
            v-if="profile"
            type="button" 
            class="btn btn-info"
            @click="exportProfile"
          >
            <i class="ki-duotone ki-file-down fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Exportar Perfil
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { Modal } from 'bootstrap';
import ApiService from '@/core/services/ApiService';

// Props
interface Props {
  profile?: any;
  show: boolean;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  close: [];
}>();

// State
const modalRef = ref<HTMLElement>();
const modal = ref<Modal>();
const loading = ref(false);
const error = ref<string | null>(null);

// Computed
const hasAnyMarks = computed(() => {
  return props.profile?.tattoos_description ||
         props.profile?.scars_description ||
         props.profile?.birthmarks ||
         props.profile?.other_distinguishing_marks;
});

const hasMedicalInfo = computed(() => {
  return props.profile?.has_dental_work ||
         props.profile?.dental_characteristics ||
         props.profile?.has_prosthetics ||
         props.profile?.prosthetics_description;
});

// Watchers
watch(() => props.show, async (show) => {
  if (show) {
    await nextTick();
    if (modalRef.value) {
      modal.value = new Modal(modalRef.value);
      modal.value.show();
    }
  } else {
    modal.value?.hide();
  }
});

// Methods
const close = () => {
  modal.value?.hide();
  emit('close');
};

const exportProfile = () => {
  // TODO: Implement export functionality
};

// Utility functions
const formatDateTime = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('es-GT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getInmateName = (inmate: any) => {
  if (!inmate) return 'N/A';
  return `${inmate.first_name} ${inmate.last_name}`;
};

const getBuildTypeBadgeClass = (buildType: string) => {
  const classes: { [key: string]: string } = {
    slim: 'badge-light-info',
    athletic: 'badge-light-success',
    average: 'badge-light-primary',
    heavy: 'badge-light-warning',
    muscular: 'badge-light-dark'
  };
  return classes[buildType] || 'badge-light-secondary';
};

const getBuildTypeLabel = (buildType: string) => {
  const labels: { [key: string]: string } = {
    slim: 'Delgado',
    athletic: 'Atlético',
    average: 'Promedio',
    heavy: 'Pesado',
    muscular: 'Musculoso'
  };
  return labels[buildType] || buildType;
};

const getBMICategoryLabel = (category: string) => {
  const labels: { [key: string]: string } = {
    underweight: 'Bajo peso',
    normal: 'Normal',
    overweight: 'Sobrepeso',
    obese: 'Obesidad'
  };
  return labels[category] || category;
};

const getMobilityBadgeClass = (mobility: string) => {
  const classes: { [key: string]: string } = {
    normal: 'badge-light-success',
    impaired: 'badge-light-warning',
    wheelchair: 'badge-light-info',
    walker: 'badge-light-primary',
    crutches: 'badge-light-secondary'
  };
  return classes[mobility] || 'badge-light-success';
};

const getMobilityLabel = (mobility: string) => {
  const labels: { [key: string]: string } = {
    normal: 'Normal',
    impaired: 'Limitada',
    wheelchair: 'Silla de Ruedas',
    walker: 'Andadera',
    crutches: 'Muletas'
  };
  return labels[mobility] || 'Normal';
};

const getEyeColorLabel = (color: string) => {
  const labels: { [key: string]: string } = {
    brown: 'Café',
    black: 'Negro',
    blue: 'Azul',
    green: 'Verde',
    hazel: 'Avellana',
    gray: 'Gris'
  };
  return labels[color] || color;
};

const getEyeShapeLabel = (shape: string) => {
  const labels: { [key: string]: string } = {
    round: 'Redondos',
    almond: 'Almendrados',
    hooded: 'Encapuchados',
    upturned: 'Levantados',
    downturned: 'Caídos'
  };
  return labels[shape] || shape;
};

const getHairColorLabel = (color: string) => {
  const labels: { [key: string]: string } = {
    black: 'Negro',
    brown: 'Café',
    blonde: 'Rubio',
    red: 'Rojo',
    gray: 'Gris',
    white: 'Blanco',
    bald: 'Calvo'
  };
  return labels[color] || color;
};

const getHairTypeLabel = (type: string) => {
  const labels: { [key: string]: string } = {
    straight: 'Liso',
    wavy: 'Ondulado',
    curly: 'Rizado',
    kinky: 'Muy Rizado',
    bald: 'Calvo'
  };
  return labels[type] || type;
};

const getSkinToneLabel = (tone: string) => {
  const labels: { [key: string]: string } = {
    very_light: 'Muy Claro',
    light: 'Claro',
    medium: 'Medio',
    olive: 'Oliva',
    tan: 'Moreno',
    dark: 'Oscuro',
    very_dark: 'Muy Oscuro'
  };
  return labels[tone] || tone;
};

const getFaceShapeLabel = (shape: string) => {
  const labels: { [key: string]: string } = {
    oval: 'Ovalada',
    round: 'Redonda',
    square: 'Cuadrada',
    heart: 'Corazón',
    diamond: 'Diamante',
    long: 'Alargada'
  };
  return labels[shape] || shape;
};

const getNoseTypeLabel = (type: string) => {
  const labels: { [key: string]: string } = {
    straight: 'Recta',
    aquiline: 'Aguileña',
    snub: 'Chata',
    roman: 'Romana',
    button: 'Respingona',
    crooked: 'Torcida'
  };
  return labels[type] || type;
};

const getLocationLabel = (location: string) => {
  const labels: { [key: string]: string } = {
    face: 'Cara',
    neck: 'Cuello',
    arms: 'Brazos',
    hands: 'Manos',
    chest: 'Pecho',
    back: 'Espalda',
    legs: 'Piernas'
  };
  return labels[location] || location;
};

// Setup modal event listeners
onMounted(() => {
  if (modalRef.value) {
    modalRef.value.addEventListener('hidden.bs.modal', () => {
      emit('close');
    });
  }
});
</script>