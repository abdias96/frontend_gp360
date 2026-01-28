<template>
  <div class="physical-profile-edit-page">
    <!-- Page header -->
    <div class="row g-5 g-xl-10 mb-5">
      <div class="col-12">
        <div class="card">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">Editar Perfil Físico</span>
              <span class="text-muted mt-1 fw-semibold fs-7">
                PPL: {{ inmateData?.first_name }} {{ inmateData?.last_name }} - {{ inmateData?.identification_number }}
              </span>
            </h3>
            <div class="card-toolbar">
              <button
                type="button"
                class="btn btn-light-primary me-3"
                @click="router.back()"
              >
                <KTIcon icon-name="arrow-left" icon-class="fs-3" />
                Regresar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="row g-5 g-xl-10">
      <!-- Physical Characteristics Form -->
      <div class="col-xl-8">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Características Físicas</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="savePhysicalProfile">
              <div class="row">
                <!-- Height and Weight -->
                <div class="col-md-6 mb-5">
                  <label class="form-label required">Altura (cm)</label>
                  <input
                    v-model.number="formData.height"
                    type="number"
                    class="form-control"
                    min="100"
                    max="250"
                    step="1"
                    required
                  />
                </div>
                <div class="col-md-6 mb-5">
                  <label class="form-label required">Peso (kg)</label>
                  <input
                    v-model.number="formData.weight"
                    type="number"
                    class="form-control"
                    min="30"
                    max="300"
                    step="0.1"
                    required
                  />
                </div>

                <!-- Eye and Hair Color -->
                <div class="col-md-6 mb-5">
                  <label class="form-label required">Color de Ojos</label>
                  <select v-model="formData.eye_color" class="form-select" required>
                    <option value="">Seleccionar</option>
                    <option value="black">Negro</option>
                    <option value="brown">Café</option>
                    <option value="blue">Azul</option>
                    <option value="green">Verde</option>
                    <option value="hazel">Avellana</option>
                    <option value="gray">Gris</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                <div class="col-md-6 mb-5">
                  <label class="form-label required">Color de Cabello</label>
                  <select v-model="formData.hair_color" class="form-select" required>
                    <option value="">Seleccionar</option>
                    <option value="black">Negro</option>
                    <option value="brown">Café</option>
                    <option value="blonde">Rubio</option>
                    <option value="red">Rojo</option>
                    <option value="gray">Gris</option>
                    <option value="white">Blanco</option>
                    <option value="bald">Calvo</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <!-- Hair Type and Skin Color -->
                <div class="col-md-6 mb-5">
                  <label class="form-label">Tipo de Cabello</label>
                  <select v-model="formData.hair_type" class="form-select">
                    <option value="">Seleccionar</option>
                    <option value="straight">Liso</option>
                    <option value="wavy">Ondulado</option>
                    <option value="curly">Rizado</option>
                    <option value="kinky">Muy Rizado</option>
                    <option value="bald">Calvo</option>
                  </select>
                </div>
                <div class="col-md-6 mb-5">
                  <label class="form-label required">Tono de Piel</label>
                  <select v-model="formData.skin_tone" class="form-select" required>
                    <option value="">Seleccionar</option>
                    <option value="very_light">Muy Claro</option>
                    <option value="light">Claro</option>
                    <option value="medium">Medio</option>
                    <option value="olive">Oliva</option>
                    <option value="brown">Moreno</option>
                    <option value="dark">Oscuro</option>
                    <option value="very_dark">Muy Oscuro</option>
                  </select>
                </div>

                <!-- Build and Facial Hair -->
                <div class="col-md-6 mb-5">
                  <label class="form-label">Complexión</label>
                  <select v-model="formData.build_type" class="form-select">
                    <option value="">Seleccionar</option>
                    <option value="thin">Delgado</option>
                    <option value="athletic">Atlético</option>
                    <option value="average">Promedio</option>
                    <option value="heavy">Robusto</option>
                    <option value="obese">Obeso</option>
                  </select>
                </div>
                <div class="col-md-3 mb-5">
                  <label class="form-label">Tiene Barba</label>
                  <select v-model="formData.has_beard" class="form-select">
                    <option :value="false">No</option>
                    <option :value="true">Sí</option>
                  </select>
                </div>
                <div class="col-md-3 mb-5">
                  <label class="form-label">Tiene Bigote</label>
                  <select v-model="formData.has_mustache" class="form-select">
                    <option :value="false">No</option>
                    <option :value="true">Sí</option>
                  </select>
                </div>
              </div>

              <!-- Distinctive Marks Section -->
              <div class="separator my-10"></div>
              <h4 class="mb-5">Marcas Distintivas</h4>
              
              <div class="row">
                <div class="col-md-6 mb-5">
                  <label class="form-label">Tatuajes</label>
                  <textarea
                    v-model="formData.tattoos_description"
                    class="form-control"
                    rows="3"
                    placeholder="Describa ubicación y diseño de tatuajes"
                  ></textarea>
                </div>
                <div class="col-md-6 mb-5">
                  <label class="form-label">Cicatrices</label>
                  <textarea
                    v-model="formData.scars_description"
                    class="form-control"
                    rows="3"
                    placeholder="Describa ubicación y características de cicatrices"
                  ></textarea>
                </div>
                <div class="col-md-6 mb-5">
                  <label class="form-label">Marcas de Nacimiento</label>
                  <textarea
                    v-model="formData.birthmarks"
                    class="form-control"
                    rows="3"
                    placeholder="Describa ubicación de marcas de nacimiento"
                  ></textarea>
                </div>
                <div class="col-md-6 mb-5">
                  <label class="form-label">Otras Marcas</label>
                  <textarea
                    v-model="formData.other_distinguishing_marks"
                    class="form-control"
                    rows="3"
                    placeholder="Otras marcas distintivas (piercings, amputaciones, etc.)"
                  ></textarea>
                </div>
              </div>

              <!-- Physical Disabilities -->
              <div class="separator my-10"></div>
              <h4 class="mb-5">Discapacidades Físicas</h4>
              
              <div class="row">
                <div class="col-md-6 mb-5">
                  <label class="form-label">Usa Anteojos</label>
                  <select v-model="formData.wears_glasses" class="form-select">
                    <option :value="null">No especificado</option>
                    <option :value="true">Sí</option>
                    <option :value="false">No</option>
                  </select>
                </div>
                <div class="col-md-6 mb-5">
                  <label class="form-label">Usa Prótesis Dental</label>
                  <select v-model="formData.dental_prosthesis" class="form-select">
                    <option :value="null">No especificado</option>
                    <option :value="true">Sí</option>
                    <option :value="false">No</option>
                  </select>
                </div>
                <div class="col-md-12 mb-5">
                  <label class="form-label">Discapacidades</label>
                  <textarea
                    v-model="formData.physical_disabilities"
                    class="form-control"
                    rows="3"
                    placeholder="Describa cualquier discapacidad física"
                  ></textarea>
                </div>
              </div>

              <!-- Notes -->
              <div class="row">
                <div class="col-md-12 mb-5">
                  <label class="form-label">Notas Adicionales</label>
                  <textarea
                    v-model="formData.notes"
                    class="form-control"
                    rows="4"
                    placeholder="Información adicional relevante"
                  ></textarea>
                </div>
              </div>

              <!-- Submit Buttons -->
              <div class="d-flex justify-content-end">
                <button
                  type="button"
                  class="btn btn-light me-3"
                  @click="router.back()"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="loading"
                >
                  <span v-if="!loading">
                    <KTIcon icon-name="check" icon-class="fs-3" />
                    Guardar Cambios
                  </span>
                  <span v-else>
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Guardando...
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Quick Actions Sidebar -->
      <div class="col-xl-4">
        <!-- Photos Card -->
        <div class="card mb-5">
          <div class="card-header">
            <h3 class="card-title">Fotografías</h3>
          </div>
          <div class="card-body">
            <div v-if="photos.length > 0" class="mb-5">
              <div class="d-flex flex-wrap gap-3">
                <div v-for="photo in photos" :key="photo.id" class="position-relative">
                  <img 
                    :src="photo.photo_data || photo.photo_url" 
                    :alt="photo.photo_type"
                    class="rounded"
                    style="width: 100px; height: 100px; object-fit: cover;"
                  />
                  <span 
                    v-if="photo.is_current"
                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success"
                  >
                    Principal
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="fas fa-camera fs-3x text-muted mb-3"></i>
              <p class="text-muted">No hay fotografías disponibles</p>
            </div>
            <button
              type="button"
              class="btn btn-primary w-100"
              @click="goToPhotoCapture"
            >
              <KTIcon icon-name="camera" icon-class="fs-3" />
              Capturar Fotografías
            </button>
          </div>
        </div>

        <!-- Biometric Status Card -->
        <div class="card mb-5">
          <div class="card-header">
            <h3 class="card-title">Estado Biométrico</h3>
          </div>
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div class="flex-grow-1">
                <span class="text-muted">Huellas Capturadas</span>
              </div>
              <div>
                <span class="badge" :class="{
                  'badge-success': biometricStatus.enrollment_complete,
                  'badge-warning': biometricStatus.fingerprints_captured > 0 && !biometricStatus.enrollment_complete,
                  'badge-danger': biometricStatus.fingerprints_captured === 0
                }">
                  {{ biometricStatus.fingerprints_captured || 0 }} / {{ biometricStatus.fingerprints_required || 10 }}
                </span>
              </div>
            </div>
            <div class="progress mb-3" style="height: 20px;">
              <div 
                class="progress-bar"
                :class="{
                  'bg-success': biometricStatus.enrollment_complete,
                  'bg-warning': biometricStatus.fingerprints_captured > 0 && !biometricStatus.enrollment_complete,
                  'bg-danger': biometricStatus.fingerprints_captured === 0
                }"
                role="progressbar"
                :style="`width: ${((biometricStatus.fingerprints_captured || 0) / (biometricStatus.fingerprints_required || 10)) * 100}%`"
              ></div>
            </div>
            <button
              type="button"
              class="btn btn-primary w-100"
              @click="goToBiometricCapture"
            >
              <KTIcon icon-name="fingerprint" icon-class="fs-3" />
              Captura Biométrica
            </button>
          </div>
        </div>

        <!-- Weight History Card -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Historial de Peso</h3>
          </div>
          <div class="card-body">
            <div v-if="weightHistory.length > 0">
              <div class="timeline">
                <div v-for="weight in weightHistory" :key="weight.id" class="timeline-item">
                  <div class="timeline-line"></div>
                  <div class="timeline-icon">
                    <i class="fas fa-weight text-primary fs-4"></i>
                  </div>
                  <div class="timeline-content">
                    <div class="d-flex align-items-center justify-content-between">
                      <span class="fw-bold">{{ weight.weight }} kg</span>
                      <span class="text-muted fs-7">{{ formatDate(weight.measurement_date) }}</span>
                    </div>
                    <div v-if="weight.notes" class="text-muted fs-7">
                      {{ weight.notes }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <p class="text-muted">No hay historial de peso</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import { formatDate } from '@/core/helpers/formatters';

const route = useRoute();
const router = useRouter();

// State
const inmateId = ref(route.params.inmateId as string);
const inmateData = ref<any>(null);
const loading = ref(false);
const photos = ref<any[]>([]);
const biometricStatus = ref<any>({});
const weightHistory = ref<any[]>([]);

// Form Data
const formData = ref({
  height: null as number | null,
  weight: null as number | null,
  build_type: '',
  blood_type_id: null as number | null,
  eye_color: '',
  eye_shape: '',
  hair_color: '',
  hair_type: '',
  skin_tone: '',
  face_shape: '',
  nose_type: '',
  mouth_type: '',
  lips_type: '',
  eyebrows_type: '',
  chin_type: '',
  forehead_type: '',
  tattoos_description: '',
  tattoos_locations: [] as string[],
  scars_description: '',
  scars_locations: [] as string[],
  birthmarks: '',
  other_distinguishing_marks: '',
  has_beard: false,
  has_mustache: false,
  wears_glasses: false,
  has_dental_work: false,
  dental_characteristics: '',
  has_prosthetics: false,
  prosthetics_description: '',
  can_read: true,
  can_write: true,
  mobility_status: 'normal',
  mobility_notes: ''
});

// Methods
const loadInmateData = async () => {
  try {
    const response = await ApiService.get(`/inmates/${inmateId.value}`);
    inmateData.value = response.data.data;
  } catch (error) {
    console.error('Error loading inmate data:', error);
  }
};

const loadPhysicalProfile = async () => {
  try {
    const response = await ApiService.get(`/inmates/${inmateId.value}/physical-profile`);
    const profile = response.data.data;
    
    if (profile) {
      // Map the response data to form fields
      Object.keys(formData.value).forEach(key => {
        if (profile[key] !== undefined) {
          (formData.value as any)[key] = profile[key];
        }
      });
      
      // Load photos from profile
      photos.value = profile.photos || [];
      
      // Load weight history from profile if available
      if (profile.weightHistory) {
        weightHistory.value = profile.weightHistory;
      }
    }
  } catch (error) {
    console.error('Error loading physical profile:', error);
  }
};

const loadPhotos = async () => {
  // Photos are loaded with the profile, no separate endpoint needed
  // This function is kept for compatibility
};

const loadBiometricStatus = async () => {
  try {
    const response = await ApiService.get(`/inmates/${inmateId.value}/biometric-status`);
    biometricStatus.value = response.data;
  } catch (error) {
    console.error('Error loading biometric status:', error);
  }
};

const loadWeightHistory = async () => {
  // Weight history is loaded with the profile, but we can still call the endpoint if needed
  try {
    const response = await ApiService.get(`/inmates/${inmateId.value}/weight-history`);
    weightHistory.value = response.data.data || [];
  } catch (error) {
    // Silently fail, weight history might not be available
    weightHistory.value = [];
  }
};

const savePhysicalProfile = async () => {
  loading.value = true;
  
  try {
    const response = await ApiService.post(`/inmates/physical-profile`, {
      ...formData.value,
      inmate_id: inmateId.value
    });
    
    if (response.data.success) {
      await Swal.fire({
        icon: 'success',
        title: 'Perfil Actualizado',
        text: 'El perfil físico se ha actualizado correctamente',
        timer: 2000,
        showConfirmButton: false
      });
      
      // Reload data to show updates
      await loadPhysicalProfile();
      
      // If weight changed, reload weight history
      if (formData.value.weight) {
        await loadWeightHistory();
      }
    }
  } catch (error: any) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'No se pudo guardar el perfil físico'
    });
  } finally {
    loading.value = false;
  }
};

const goToPhotoCapture = () => {
  router.push({
    name: 'security-physical-profile-photo',
    params: { inmateId: inmateId.value }
  });
};

const goToBiometricCapture = () => {
  router.push({
    name: 'security-biometric-capture',
    params: { inmateId: inmateId.value }
  });
};

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadInmateData(),
    loadPhysicalProfile(),
    loadBiometricStatus()
  ]);
  // Weight history is optional, load it separately
  loadWeightHistory();
});
</script>

<style scoped>
.timeline {
  position: relative;
  padding-left: 40px;
}

.timeline-item {
  position: relative;
  padding-bottom: 20px;
}

.timeline-line {
  position: absolute;
  left: -25px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #e9ecef;
}

.timeline-icon {
  position: absolute;
  left: -35px;
  top: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #fff;
  border: 2px solid #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-icon i {
  font-size: 10px;
}

.timeline-content {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
}

.timeline-item:last-child .timeline-line {
  display: none;
}
</style>