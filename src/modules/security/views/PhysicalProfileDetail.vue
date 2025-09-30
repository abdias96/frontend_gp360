<template>
  <div class="physical-profile-detail-page">
    <!-- Page header -->
    <div class="row g-5 g-xl-10 mb-5">
      <div class="col-12">
        <div class="card">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">Perfil Físico</span>
              <span class="text-muted mt-1 fw-semibold fs-7">
                PPL: {{ inmateData?.full_name }} - {{ inmateData?.document_number }}
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
              <button
                type="button"
                class="btn btn-primary"
                @click="editProfile"
              >
                <KTIcon icon-name="pencil" icon-class="fs-3" />
                Editar Perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="d-flex justify-content-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="row g-5 g-xl-10">
      <!-- Left Column - Physical Data -->
      <div class="col-xl-8">
        <!-- Basic Physical Characteristics -->
        <div class="card mb-5">
          <div class="card-header">
            <h3 class="card-title">Características Físicas Básicas</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-3 mb-4">
                <label class="form-label text-muted">Altura</label>
                <p class="fs-5 fw-bold">{{ profile?.height || '---' }} cm</p>
              </div>
              <div class="col-md-3 mb-4">
                <label class="form-label text-muted">Peso</label>
                <p class="fs-5 fw-bold">{{ profile?.weight || '---' }} kg</p>
              </div>
              <div class="col-md-3 mb-4">
                <label class="form-label text-muted">IMC</label>
                <p class="fs-5 fw-bold">{{ profile?.bmi || '---' }}</p>
              </div>
              <div class="col-md-3 mb-4">
                <label class="form-label text-muted">Categoría IMC</label>
                <p class="fs-5 fw-bold">{{ profile?.bmi_category || '---' }}</p>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-3 mb-4">
                <label class="form-label text-muted">Tipo de Sangre</label>
                <p class="fs-5 fw-bold">{{ profile?.blood_type?.name || '---' }}</p>
              </div>
              <div class="col-md-3 mb-4">
                <label class="form-label text-muted">Complexión</label>
                <p class="fs-5 fw-bold">{{ profile?.build_type || '---' }}</p>
              </div>
              <div class="col-md-3 mb-4">
                <label class="form-label text-muted">Color de Ojos</label>
                <p class="fs-5 fw-bold">{{ profile?.eye_color || '---' }}</p>
              </div>
              <div class="col-md-3 mb-4">
                <label class="form-label text-muted">Color de Cabello</label>
                <p class="fs-5 fw-bold">{{ profile?.hair_color || '---' }}</p>
              </div>
            </div>

            <div class="row">
              <div class="col-md-3 mb-4">
                <label class="form-label text-muted">Tono de Piel</label>
                <p class="fs-5 fw-bold">{{ profile?.skin_tone || '---' }}</p>
              </div>
              <div class="col-md-3 mb-4">
                <label class="form-label text-muted">Usa Lentes</label>
                <p class="fs-5 fw-bold">{{ profile?.wears_glasses ? 'Sí' : 'No' }}</p>
              </div>
              <div class="col-md-3 mb-4">
                <label class="form-label text-muted">Tiene Barba</label>
                <p class="fs-5 fw-bold">{{ profile?.has_beard ? 'Sí' : 'No' }}</p>
              </div>
              <div class="col-md-3 mb-4">
                <label class="form-label text-muted">Tiene Bigote</label>
                <p class="fs-5 fw-bold">{{ profile?.has_mustache ? 'Sí' : 'No' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Distinguishing Marks -->
        <div class="card mb-5">
          <div class="card-header">
            <h3 class="card-title">Señas Particulares</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 mb-4">
                <label class="form-label text-muted">Tatuajes</label>
                <p class="fs-6">{{ profile?.tattoos_description || 'No tiene tatuajes' }}</p>
              </div>
              <div class="col-md-6 mb-4">
                <label class="form-label text-muted">Cicatrices</label>
                <p class="fs-6">{{ profile?.scars_description || 'No tiene cicatrices' }}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-4">
                <label class="form-label text-muted">Lunares</label>
                <p class="fs-6">{{ profile?.birthmarks || 'No especificado' }}</p>
              </div>
              <div class="col-md-6 mb-4">
                <label class="form-label text-muted">Otras Señas</label>
                <p class="fs-6">{{ profile?.other_distinguishing_marks || 'No especificado' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Biometric Data -->
        <div class="card mb-5">
          <div class="card-header">
            <h3 class="card-title">Datos Biométricos</h3>
          </div>
          <div class="card-body">
            <div class="mb-4">
              <label class="form-label text-muted">Estado de Registro Biométrico</label>
              <div class="d-flex align-items-center gap-3">
                <span 
                  class="badge fs-6"
                  :class="{
                    'badge-success': biometricStatus?.enrollment_complete,
                    'badge-warning': biometricStatus?.fingerprints_captured > 0 && !biometricStatus?.enrollment_complete,
                    'badge-danger': biometricStatus?.fingerprints_captured === 0
                  }"
                >
                  {{ biometricStatus?.fingerprints_captured || 0 }} / {{ biometricStatus?.fingerprints_required || 10 }} Huellas
                </span>
                <button
                  type="button"
                  class="btn btn-sm btn-light-info"
                  @click="goBiometric"
                >
                  <i class="fas fa-fingerprint me-2"></i>
                  Gestionar Biometría
                </button>
              </div>
            </div>
            
            <div v-if="biometricData && biometricData.length > 0">
              <label class="form-label text-muted">Huellas Capturadas</label>
              <div class="row">
                <div v-for="biometric in biometricData" :key="biometric.id" class="col-md-3 mb-3">
                  <div class="border rounded p-2 text-center">
                    <i class="fas fa-fingerprint fs-2x text-success mb-2"></i>
                    <p class="mb-0 small">{{ getFingerLabel(biometric.finger_type) }}</p>
                    <p class="mb-0 text-muted" style="font-size: 0.75rem;">
                      {{ formatDate(biometric.capture_date) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Photos -->
      <div class="col-xl-4">
        <!-- Photo Gallery -->
        <div class="card mb-5">
          <div class="card-header">
            <h3 class="card-title">Fotografías</h3>
            <div class="card-toolbar">
              <button
                type="button"
                class="btn btn-sm btn-light-primary"
                @click="goPhotoCapture"
              >
                <KTIcon icon-name="camera" icon-class="fs-3" />
                Capturar Foto
              </button>
            </div>
          </div>
          <div class="card-body">
            <div v-if="photos && photos.length > 0">
              <div v-for="photo in photos" :key="photo.id" class="mb-3">
                <img 
                  :src="photo.photo_data || photo.photo_url" 
                  :alt="photo.photo_type"
                  class="img-fluid rounded"
                />
                <p class="text-center mt-2 text-muted small">
                  {{ getPhotoTypeLabel(photo.photo_type) }}
                  <br>
                  {{ formatDate(photo.photo_date) }}
                </p>
              </div>
            </div>
            <div v-else class="text-center text-muted">
              <i class="fas fa-camera fs-3x mb-3"></i>
              <p>No hay fotografías disponibles</p>
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
import { formatDate } from '@/core/helpers/formatters';
import Swal from 'sweetalert2';
import KTIcon from '@/core/helpers/kt-icon/KTIcon.vue';

const route = useRoute();
const router = useRouter();

// State
const inmateId = ref(route.params.inmateId as string);
const inmateData = ref<any>(null);
const profile = ref<any>(null);
const photos = ref<any[]>([]);
const biometricStatus = ref<any>(null);
const biometricData = ref<any[]>([]);
const loading = ref(true);

// Methods
const loadProfile = async () => {
  try {
    loading.value = true;
    
    // Load inmate data
    const inmateResponse = await ApiService.get(`/inmates/${inmateId.value}`);
    inmateData.value = inmateResponse.data.data;
    
    // Load physical profile
    const profileResponse = await ApiService.get(`/inmates/${inmateId.value}/physical-profile`);
    profile.value = profileResponse.data.data;
    photos.value = profileResponse.data.data.photos || [];
    
    // Load biometric status
    const biometricStatusResponse = await ApiService.get(`/inmates/${inmateId.value}/biometric-status`);
    biometricStatus.value = biometricStatusResponse.data;
    
    // Load biometric data
    const biometricDataResponse = await ApiService.get(`/inmates/${inmateId.value}/biometric-data`);
    if (biometricDataResponse.data.success) {
      biometricData.value = biometricDataResponse.data.data;
    }
  } catch (error) {
    console.error('Error loading profile:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar el perfil físico'
    });
  } finally {
    loading.value = false;
  }
};

const getFingerLabel = (fingerType: string) => {
  const labels: Record<string, string> = {
    'right_thumb': 'Pulgar Derecho',
    'right_index': 'Índice Derecho',
    'right_middle': 'Medio Derecho',
    'right_ring': 'Anular Derecho',
    'right_pinky': 'Meñique Derecho',
    'left_thumb': 'Pulgar Izquierdo',
    'left_index': 'Índice Izquierdo',
    'left_middle': 'Medio Izquierdo',
    'left_ring': 'Anular Izquierdo',
    'left_pinky': 'Meñique Izquierdo'
  };
  return labels[fingerType] || fingerType;
};

const getPhotoTypeLabel = (photoType: string) => {
  const labels: Record<string, string> = {
    'frontal_mugshot': 'Foto Frontal',
    'profile_left': 'Perfil Izquierdo',
    'profile_right': 'Perfil Derecho',
    'full_body': 'Cuerpo Completo',
    'identifying_marks': 'Señas Particulares',
    'tattoos': 'Tatuajes',
    'scars': 'Cicatrices',
    'updated_appearance': 'Apariencia Actualizada'
  };
  return labels[photoType] || photoType;
};

const editProfile = () => {
  router.push({
    name: 'security-physical-profile-edit',
    params: { inmateId: inmateId.value }
  });
};

const goBiometric = () => {
  router.push({
    name: 'security-biometric-capture',
    params: { inmateId: inmateId.value }
  });
};

const goPhotoCapture = () => {
  router.push({
    name: 'security-physical-profile-photo',
    params: { inmateId: inmateId.value }
  });
};

// Lifecycle
onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
.img-fluid {
  max-width: 100%;
  height: auto;
}
</style>