<template>
  <div class="d-flex flex-column gap-7">
    <!--begin::Physical Characteristics Card-->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label fw-bold text-gray-900">Características Físicas</span>
          <span class="text-muted mt-1 fw-semibold fs-7">Información física y biométrica</span>
        </h3>
        <div class="card-toolbar">
          <button
            v-if="canEdit"
            type="button"
            class="btn btn-sm btn-light-primary"
            @click="openPhysicalModal"
          >
            <i class="ki-duotone ki-pencil fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Actualizar
          </button>
        </div>
      </div>
      <div class="card-body">
        <div v-if="loadingPhysical" class="d-flex justify-content-center py-10">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
        
        <div v-else-if="physicalProfile" class="row g-6">
          <!--begin::Col-->
          <div class="col-md-4">
            <div class="d-flex flex-column mb-5">
              <span class="text-muted fw-semibold mb-1">Altura</span>
              <span class="text-gray-900 fw-bold">
                {{ physicalProfile.height ? `${physicalProfile.height} cm` : 'No registrado' }}
              </span>
            </div>
            <div class="d-flex flex-column mb-5">
              <span class="text-muted fw-semibold mb-1">Peso</span>
              <span class="text-gray-900 fw-bold">
                {{ physicalProfile.weight ? `${physicalProfile.weight} kg` : 'No registrado' }}
              </span>
            </div>
            <div class="d-flex flex-column mb-5">
              <span class="text-muted fw-semibold mb-1">IMC</span>
              <span class="text-gray-900 fw-bold">
                <span v-if="bmi">
                  {{ bmi.value.toFixed(2) }}
                  <span :class="bmi.colorClass">({{ bmi.category }})</span>
                </span>
                <span v-else>No calculado</span>
              </span>
            </div>
          </div>
          <!--end::Col-->
          
          <!--begin::Col-->
          <div class="col-md-4">
            <div class="d-flex flex-column mb-5">
              <span class="text-muted fw-semibold mb-1">Color de Ojos</span>
              <span class="text-gray-900 fw-bold">
                {{ physicalProfile.eye_color || 'No registrado' }}
              </span>
            </div>
            <div class="d-flex flex-column mb-5">
              <span class="text-muted fw-semibold mb-1">Color de Cabello</span>
              <span class="text-gray-900 fw-bold">
                {{ physicalProfile.hair_color || 'No registrado' }}
              </span>
            </div>
            <div class="d-flex flex-column mb-5">
              <span class="text-muted fw-semibold mb-1">Color de Piel</span>
              <span class="text-gray-900 fw-bold">
                {{ physicalProfile.skin_color || 'No registrado' }}
              </span>
            </div>
          </div>
          <!--end::Col-->
          
          <!--begin::Col-->
          <div class="col-md-4">
            <div class="d-flex flex-column mb-5">
              <span class="text-muted fw-semibold mb-1">Complexión</span>
              <span class="text-gray-900 fw-bold">
                {{ getComplexionLabel(physicalProfile.build_type) }}
              </span>
            </div>
            <div class="d-flex flex-column mb-5">
              <span class="text-muted fw-semibold mb-1">Lateralidad</span>
              <span class="text-gray-900 fw-bold">
                {{ getHandednessLabel(physicalProfile.handedness) }}
              </span>
            </div>
            <div class="d-flex flex-column mb-5">
              <span class="text-muted fw-semibold mb-1">Última Actualización</span>
              <span class="text-gray-900 fw-bold">
                {{ formatDate(physicalProfile.updated_at) }}
              </span>
            </div>
          </div>
          <!--end::Col-->
        </div>
        
        <div v-else class="alert alert-secondary">
          <i class="ki-duotone ki-information-5 fs-2 me-2">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          No hay información física registrada
        </div>
      </div>
    </div>
    <!--end::Physical Characteristics Card-->
    
    <!--begin::Distinguishing Marks Card-->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label fw-bold text-gray-900">Señas Particulares</span>
          <span class="text-muted mt-1 fw-semibold fs-7">Tatuajes, cicatrices y otras marcas distintivas</span>
        </h3>
        <div class="card-toolbar">
          <button
            v-if="canEdit"
            type="button"
            class="btn btn-sm btn-light-primary"
            @click="openMarksModal"
          >
            <i class="ki-duotone ki-plus fs-2"></i>
            Agregar
          </button>
        </div>
      </div>
      <div class="card-body">
        <div v-if="physicalProfile?.distinguishing_marks" class="mb-5">
          <h6 class="text-muted mb-3">Marcas Distintivas</h6>
          <p class="text-gray-900">{{ physicalProfile.distinguishing_marks }}</p>
        </div>
        
        <div v-if="physicalProfile?.tattoos" class="mb-5">
          <h6 class="text-muted mb-3">Tatuajes</h6>
          <p class="text-gray-900">{{ physicalProfile.tattoos }}</p>
        </div>
        
        <div v-if="physicalProfile?.scars" class="mb-5">
          <h6 class="text-muted mb-3">Cicatrices</h6>
          <p class="text-gray-900">{{ physicalProfile.scars }}</p>
        </div>
        
        <div v-if="!physicalProfile?.distinguishing_marks && !physicalProfile?.tattoos && !physicalProfile?.scars" 
             class="alert alert-secondary">
          <i class="ki-duotone ki-information-5 fs-2 me-2">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          No hay señas particulares registradas
        </div>
      </div>
    </div>
    <!--end::Distinguishing Marks Card-->
    
    <!--begin::Biometric Data Card-->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label fw-bold text-gray-900">Datos Biométricos</span>
          <span class="text-muted mt-1 fw-semibold fs-7">Huellas dactilares y reconocimiento facial</span>
        </h3>
      </div>
      <div class="card-body">
        <div class="row g-6">
          <div class="col-md-6">
            <div class="d-flex align-items-center mb-5">
              <div class="symbol symbol-50px me-3">
                <div class="symbol-label bg-light-primary">
                  <i class="ki-duotone ki-fingerprint-scanning fs-2x text-primary">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                    <span class="path4"></span>
                  </i>
                </div>
              </div>
              <div class="d-flex flex-column">
                <span class="text-gray-900 fw-bold">Huellas Dactilares</span>
                <span :class="physicalProfile?.has_fingerprints ? 'text-success' : 'text-muted'">
                  {{ physicalProfile?.has_fingerprints ? 'Registradas' : 'No registradas' }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="d-flex align-items-center mb-5">
              <div class="symbol symbol-50px me-3">
                <div class="symbol-label bg-light-info">
                  <i class="ki-duotone ki-face-id fs-2x text-info">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                    <span class="path4"></span>
                  </i>
                </div>
              </div>
              <div class="d-flex flex-column">
                <span class="text-gray-900 fw-bold">Reconocimiento Facial</span>
                <span :class="physicalProfile?.has_facial_recognition ? 'text-success' : 'text-muted'">
                  {{ physicalProfile?.has_facial_recognition ? 'Registrado' : 'No registrado' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--end::Biometric Data Card-->
    
    <!--begin::Photos Card-->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label fw-bold text-gray-900">Fotografías</span>
          <span class="text-muted mt-1 fw-semibold fs-7">Registro fotográfico del interno</span>
        </h3>
        <div class="card-toolbar">
          <button
            v-if="canEdit"
            type="button"
            class="btn btn-sm btn-light-primary"
            @click="uploadPhoto"
          >
            <i class="ki-duotone ki-picture fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Subir Foto
          </button>
        </div>
      </div>
      <div class="card-body">
        <div v-if="photos && photos.length > 0" class="row g-6">
          <div v-for="photo in photos" :key="photo.id" class="col-md-3">
            <div class="card overlay overflow-hidden">
              <div class="card-body p-0">
                <img :src="photo.url" :alt="photo.type" class="w-100" />
                <div class="overlay-layer bg-dark bg-opacity-50">
                  <div class="d-flex flex-column text-center p-4">
                    <span class="text-white fw-bold mb-2">{{ getPhotoTypeLabel(photo.type) }}</span>
                    <span class="text-gray-300 fs-7">{{ formatDate(photo.created_at) }}</span>
                    <div class="mt-3">
                      <button class="btn btn-sm btn-light-primary me-2" @click="viewPhoto(photo)">
                        <i class="ki-duotone ki-eye fs-5"></i>
                      </button>
                      <button v-if="canEdit" class="btn btn-sm btn-light-danger" @click="deletePhoto(photo)">
                        <i class="ki-duotone ki-trash fs-5"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="alert alert-secondary">
          <i class="ki-duotone ki-information-5 fs-2 me-2">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          No hay fotografías registradas
        </div>
      </div>
    </div>
    <!--end::Photos Card-->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import { formatDate } from '@/core/helpers/formatters';

// Props
interface Props {
  inmate: any;
}

const props = defineProps<Props>();

// Stores
const authStore = useAuthStore();

// State
const physicalProfile = ref<any>(null);
const photos = ref<any[]>([]);
const loadingPhysical = ref(false);

// Computed
const canEdit = computed(() => authStore.hasPermission('inmates.edit'));

const bmi = computed(() => {
  if (!physicalProfile.value?.height || !physicalProfile.value?.weight) return null;
  
  const heightInMeters = physicalProfile.value.height / 100;
  const bmiValue = physicalProfile.value.weight / (heightInMeters * heightInMeters);
  
  let category = '';
  let colorClass = '';
  
  if (bmiValue < 18.5) {
    category = 'Bajo peso';
    colorClass = 'text-warning';
  } else if (bmiValue < 25) {
    category = 'Normal';
    colorClass = 'text-success';
  } else if (bmiValue < 30) {
    category = 'Sobrepeso';
    colorClass = 'text-warning';
  } else {
    category = 'Obesidad';
    colorClass = 'text-danger';
  }
  
  return {
    value: bmiValue,
    category,
    colorClass
  };
});

// Methods
const getComplexionLabel = (type: string) => {
  const types: Record<string, string> = {
    'thin': 'Delgado',
    'athletic': 'Atlético',
    'average': 'Promedio',
    'heavy': 'Robusto',
    'obese': 'Obeso'
  };
  return types[type] || 'No registrado';
};

const getHandednessLabel = (hand: string) => {
  const hands: Record<string, string> = {
    'right': 'Diestro',
    'left': 'Zurdo',
    'ambidextrous': 'Ambidiestro'
  };
  return hands[hand] || 'No registrado';
};

const getPhotoTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    'front': 'Frontal',
    'left': 'Perfil Izquierdo',
    'right': 'Perfil Derecho',
    'full': 'Cuerpo Completo'
  };
  return types[type] || type;
};

const fetchPhysicalProfile = async () => {
  loadingPhysical.value = true;
  try {
    // TODO: Uncomment when API endpoint is ready
    // const response = await ApiService.get(`/inmates/${props.inmate.id}/physical-profile`);
    // physicalProfile.value = response.data.data;
    
    // Temporary mock data
    physicalProfile.value = {
      height: null,
      weight: null,
      eye_color: null,
      hair_color: null,
      skin_color: null,
      build_type: null,
      handedness: null,
      distinguishing_marks: null,
      tattoos: null,
      scars: null,
      has_fingerprints: false,
      has_facial_recognition: false,
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching physical profile:', error);
  } finally {
    loadingPhysical.value = false;
  }
};

const fetchPhotos = async () => {
  try {
    // TODO: Uncomment when API endpoint is ready
    // const response = await ApiService.get(`/inmates/${props.inmate.id}/photos`);
    // photos.value = response.data.data || [];
    
    // Temporary empty data
    photos.value = [];
  } catch (error) {
    console.error('Error fetching photos:', error);
  }
};

const openPhysicalModal = async () => {
  const currentProfile = physicalProfile.value || {};
  
  const result = await Swal.fire({
    title: 'Actualizar Características Físicas',
    html: `
      <form id="physicalForm" class="text-start">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Altura (cm)</label>
            <input type="number" id="height" class="form-control" value="${currentProfile.height || ''}" min="100" max="250">
          </div>
          <div class="col-md-6">
            <label class="form-label">Peso (kg)</label>
            <input type="number" id="weight" class="form-control" value="${currentProfile.weight || ''}" min="30" max="300">
          </div>
          <div class="col-md-6">
            <label class="form-label">Color de Ojos</label>
            <select id="eyeColor" class="form-select">
              <option value="">Seleccionar...</option>
              <option value="brown" ${currentProfile.eye_color === 'brown' ? 'selected' : ''}>Café</option>
              <option value="blue" ${currentProfile.eye_color === 'blue' ? 'selected' : ''}>Azul</option>
              <option value="green" ${currentProfile.eye_color === 'green' ? 'selected' : ''}>Verde</option>
              <option value="hazel" ${currentProfile.eye_color === 'hazel' ? 'selected' : ''}>Avellana</option>
              <option value="gray" ${currentProfile.eye_color === 'gray' ? 'selected' : ''}>Gris</option>
              <option value="black" ${currentProfile.eye_color === 'black' ? 'selected' : ''}>Negro</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label">Color de Cabello</label>
            <select id="hairColor" class="form-select">
              <option value="">Seleccionar...</option>
              <option value="black" ${currentProfile.hair_color === 'black' ? 'selected' : ''}>Negro</option>
              <option value="brown" ${currentProfile.hair_color === 'brown' ? 'selected' : ''}>Café</option>
              <option value="blonde" ${currentProfile.hair_color === 'blonde' ? 'selected' : ''}>Rubio</option>
              <option value="red" ${currentProfile.hair_color === 'red' ? 'selected' : ''}>Rojo</option>
              <option value="gray" ${currentProfile.hair_color === 'gray' ? 'selected' : ''}>Gris</option>
              <option value="white" ${currentProfile.hair_color === 'white' ? 'selected' : ''}>Blanco</option>
              <option value="bald" ${currentProfile.hair_color === 'bald' ? 'selected' : ''}>Calvo</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label">Color de Piel</label>
            <select id="skinColor" class="form-select">
              <option value="">Seleccionar...</option>
              <option value="fair" ${currentProfile.skin_color === 'fair' ? 'selected' : ''}>Clara</option>
              <option value="medium" ${currentProfile.skin_color === 'medium' ? 'selected' : ''}>Media</option>
              <option value="olive" ${currentProfile.skin_color === 'olive' ? 'selected' : ''}>Oliva</option>
              <option value="brown" ${currentProfile.skin_color === 'brown' ? 'selected' : ''}>Morena</option>
              <option value="dark" ${currentProfile.skin_color === 'dark' ? 'selected' : ''}>Oscura</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label">Complexión</label>
            <select id="buildType" class="form-select">
              <option value="">Seleccionar...</option>
              <option value="thin" ${currentProfile.build_type === 'thin' ? 'selected' : ''}>Delgado</option>
              <option value="athletic" ${currentProfile.build_type === 'athletic' ? 'selected' : ''}>Atlético</option>
              <option value="average" ${currentProfile.build_type === 'average' ? 'selected' : ''}>Promedio</option>
              <option value="heavy" ${currentProfile.build_type === 'heavy' ? 'selected' : ''}>Robusto</option>
              <option value="obese" ${currentProfile.build_type === 'obese' ? 'selected' : ''}>Obeso</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label">Lateralidad</label>
            <select id="handedness" class="form-select">
              <option value="">Seleccionar...</option>
              <option value="right" ${currentProfile.handedness === 'right' ? 'selected' : ''}>Diestro</option>
              <option value="left" ${currentProfile.handedness === 'left' ? 'selected' : ''}>Zurdo</option>
              <option value="ambidextrous" ${currentProfile.handedness === 'ambidextrous' ? 'selected' : ''}>Ambidiestro</option>
            </select>
          </div>
        </div>
      </form>
    `,
    showCancelButton: true,
    confirmButtonText: 'Actualizar',
    cancelButtonText: 'Cancelar',
    width: '600px',
    preConfirm: () => {
      const height = (document.getElementById('height') as HTMLInputElement).value;
      const weight = (document.getElementById('weight') as HTMLInputElement).value;
      const eyeColor = (document.getElementById('eyeColor') as HTMLSelectElement).value;
      const hairColor = (document.getElementById('hairColor') as HTMLSelectElement).value;
      const skinColor = (document.getElementById('skinColor') as HTMLSelectElement).value;
      const buildType = (document.getElementById('buildType') as HTMLSelectElement).value;
      const handedness = (document.getElementById('handedness') as HTMLSelectElement).value;
      
      return {
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null,
        eye_color: eyeColor || null,
        hair_color: hairColor || null,
        skin_color: skinColor || null,
        build_type: buildType || null,
        handedness: handedness || null
      };
    }
  });
  
  if (result.isConfirmed && result.value) {
    await updatePhysicalProfile(result.value);
  }
};

const openMarksModal = async () => {
  const currentProfile = physicalProfile.value || {};
  
  const result = await Swal.fire({
    title: 'Actualizar Señas Particulares',
    html: `
      <form id="marksForm" class="text-start">
        <div class="row g-3">
          <div class="col-12">
            <label class="form-label">Marcas Distintivas</label>
            <textarea id="marks" class="form-control" rows="3" placeholder="Describa marcas distintivas generales">${currentProfile.distinguishing_marks || ''}</textarea>
          </div>
          <div class="col-12">
            <label class="form-label">Tatuajes</label>
            <textarea id="tattoos" class="form-control" rows="3" placeholder="Describa ubicación y diseño de tatuajes">${currentProfile.tattoos || ''}</textarea>
          </div>
          <div class="col-12">
            <label class="form-label">Cicatrices</label>
            <textarea id="scars" class="form-control" rows="3" placeholder="Describa ubicación y tipo de cicatrices">${currentProfile.scars || ''}</textarea>
          </div>
        </div>
      </form>
    `,
    showCancelButton: true,
    confirmButtonText: 'Actualizar',
    cancelButtonText: 'Cancelar',
    width: '600px',
    preConfirm: () => {
      const marks = (document.getElementById('marks') as HTMLTextAreaElement).value;
      const tattoos = (document.getElementById('tattoos') as HTMLTextAreaElement).value;
      const scars = (document.getElementById('scars') as HTMLTextAreaElement).value;
      
      return {
        distinguishing_marks: marks || null,
        tattoos: tattoos || null,
        scars: scars || null
      };
    }
  });
  
  if (result.isConfirmed && result.value) {
    await updatePhysicalProfile(result.value);
  }
};

const updatePhysicalProfile = async (data: any) => {
  try {
    // TODO: Uncomment when API endpoint is ready
    // await ApiService.put(`/inmates/${props.inmate.id}/physical-profile`, data);
    
    await Swal.fire({
      title: '¡Actualizado!',
      text: 'La información física ha sido actualizada correctamente',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
    
    await fetchPhysicalProfile();
  } catch (error) {
    console.error('Error updating physical profile:', error);
    await Swal.fire({
      title: 'Error',
      text: 'No se pudo actualizar la información física',
      icon: 'error'
    });
  }
};

const uploadPhoto = async () => {
  // Implementation for photo upload
  await Swal.fire({
    title: 'Subir Fotografía',
    text: 'Esta funcionalidad estará disponible próximamente',
    icon: 'info'
  });
};

const viewPhoto = (photo: any) => {
  // Implementation for viewing photo
  window.open(photo.url, '_blank');
};

const deletePhoto = async (photo: any) => {
  const result = await Swal.fire({
    title: '¿Eliminar fotografía?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33'
  });
  
  if (result.isConfirmed) {
    try {
      // TODO: Uncomment when API endpoint is ready
      // await ApiService.delete(`/inmates/${props.inmate.id}/photos/${photo.id}`);
      
      await Swal.fire({
        title: '¡Eliminada!',
        text: 'La fotografía ha sido eliminada',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      
      await fetchPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar la fotografía',
        icon: 'error'
      });
    }
  }
};

// Lifecycle
onMounted(() => {
  fetchPhysicalProfile();
  fetchPhotos();
});
</script>