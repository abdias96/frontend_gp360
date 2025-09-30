<template>
  <div class="photo-capture-page">
    <!-- Page header -->
    <div class="row g-5 g-xl-10 mb-5">
      <div class="col-12">
        <div class="card">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">Captura de Fotografías</span>
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
      <!-- Camera/Upload Section -->
      <div class="col-xl-8">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Capturar Nueva Fotografía</h3>
            <div class="card-toolbar">
              <div class="btn-group" role="group">
                <button
                  type="button"
                  class="btn"
                  :class="captureMode === 'camera' ? 'btn-primary' : 'btn-light'"
                  @click="captureMode = 'camera'"
                >
                  <i class="fas fa-camera me-2"></i>
                  Cámara
                </button>
                <button
                  type="button"
                  class="btn"
                  :class="captureMode === 'upload' ? 'btn-primary' : 'btn-light'"
                  @click="captureMode = 'upload'"
                >
                  <i class="fas fa-upload me-2"></i>
                  Subir Archivo
                </button>
              </div>
            </div>
          </div>
          <div class="card-body">
            <!-- Camera Mode -->
            <div v-if="captureMode === 'camera'" class="text-center">
              <div v-if="!cameraActive && !capturedImage" class="py-10">
                <i class="fas fa-camera fs-5x text-muted mb-5"></i>
                <h4 class="text-muted">Cámara Web</h4>
                <p class="text-muted mb-5">Haga clic en "Activar Cámara" para comenzar</p>
                <button
                  type="button"
                  class="btn btn-primary btn-lg"
                  @click="startCamera"
                >
                  <i class="fas fa-video me-2"></i>
                  Activar Cámara
                </button>
              </div>

              <div v-if="cameraActive" class="position-relative">
                <video
                  ref="videoElement"
                  class="w-100 rounded"
                  style="max-width: 640px;"
                  autoplay
                ></video>
                <canvas
                  ref="canvasElement"
                  style="display: none;"
                ></canvas>
                
                <div class="mt-3">
                  <button
                    type="button"
                    class="btn btn-success btn-lg me-3"
                    @click="capturePhoto"
                  >
                    <i class="fas fa-camera me-2"></i>
                    Capturar
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger btn-lg"
                    @click="stopCamera"
                  >
                    <i class="fas fa-stop me-2"></i>
                    Detener Cámara
                  </button>
                </div>
              </div>

              <div v-if="capturedImage && !cameraActive" class="position-relative">
                <img
                  :src="capturedImage"
                  class="img-fluid rounded"
                  style="max-width: 640px;"
                />
                <div class="mt-3">
                  <button
                    type="button"
                    class="btn btn-warning btn-lg me-3"
                    @click="retakePhoto"
                  >
                    <i class="fas fa-redo me-2"></i>
                    Tomar Otra
                  </button>
                  <button
                    type="button"
                    class="btn btn-success btn-lg"
                    @click="showSaveDialog"
                  >
                    <i class="fas fa-save me-2"></i>
                    Guardar Fotografía
                  </button>
                </div>
              </div>
            </div>

            <!-- Upload Mode -->
            <div v-else-if="captureMode === 'upload'" class="text-center">
              <div v-if="!uploadedImage" class="py-10">
                <i class="fas fa-cloud-upload-alt fs-5x text-muted mb-5"></i>
                <h4 class="text-muted">Subir Fotografía</h4>
                <p class="text-muted mb-5">Seleccione una imagen desde su dispositivo</p>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  style="display: none;"
                  @change="handleFileUpload"
                />
                <button
                  type="button"
                  class="btn btn-primary btn-lg"
                  @click="$refs.fileInput.click()"
                >
                  <i class="fas fa-folder-open me-2"></i>
                  Seleccionar Archivo
                </button>
                <div class="mt-3 text-muted">
                  <small>Formatos soportados: JPG, PNG, GIF (Max. 5MB)</small>
                </div>
              </div>

              <div v-if="uploadedImage" class="position-relative">
                <img
                  :src="uploadedImage"
                  class="img-fluid rounded"
                  style="max-width: 640px;"
                />
                <div class="mt-3">
                  <button
                    type="button"
                    class="btn btn-warning btn-lg me-3"
                    @click="clearUpload"
                  >
                    <i class="fas fa-times me-2"></i>
                    Cambiar Imagen
                  </button>
                  <button
                    type="button"
                    class="btn btn-success btn-lg"
                    @click="showSaveDialog"
                  >
                    <i class="fas fa-save me-2"></i>
                    Guardar Fotografía
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Existing Photos -->
      <div class="col-xl-4">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Fotografías Existentes</h3>
          </div>
          <div class="card-body">
            <div v-if="photos.length > 0">
              <div class="row g-3">
                <div
                  v-for="photo in photos"
                  :key="photo.id"
                  class="col-6"
                >
                  <div class="position-relative">
                    <img
                      :src="photo.photo_data || photo.photo_url"
                      :alt="photo.photo_type"
                      class="img-fluid rounded"
                      style="cursor: pointer;"
                      @click="viewPhoto(photo)"
                    />
                    <div class="position-absolute top-0 end-0 p-1">
                      <span
                        v-if="photo.is_current"
                        class="badge badge-success"
                      >
                        Principal
                      </span>
                    </div>
                    <div class="mt-2">
                      <small class="text-muted">{{ getPhotoTypeLabel(photo.photo_type) }}</small>
                      <br>
                      <small class="text-muted">{{ formatDate(photo.created_at) }}</small>
                    </div>
                    <div class="mt-2">
                      <button
                        type="button"
                        class="btn btn-sm me-2"
                        :class="photo.is_current ? 'btn-warning' : 'btn-light-primary'"
                        @click="setPrimaryPhoto(photo.id)"
                        :title="photo.is_current ? 'Quitar como principal' : 'Establecer como principal'"
                      >
                        <i class="fas fa-star"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-light-danger"
                        @click="deletePhoto(photo.id)"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-10">
              <i class="fas fa-images fs-3x text-muted mb-3"></i>
              <p class="text-muted">No hay fotografías disponibles</p>
            </div>

            <!-- Photo Requirements -->
            <div class="alert alert-info mt-5">
              <h5 class="alert-heading">Requisitos de Fotografía</h5>
              <ul class="mb-0">
                <li>Foto frontal clara del rostro</li>
                <li>Fondo uniforme y claro</li>
                <li>Sin gafas de sol o gorros</li>
                <li>Expresión neutral</li>
                <li>Buena iluminación</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import { formatDate } from '@/core/helpers/formatters';
import KTIcon from '@/core/helpers/kt-icon/KTIcon.vue';

const route = useRoute();
const router = useRouter();

// State
const inmateId = ref(route.params.inmateId as string);
const inmateData = ref<any>(null);
const photos = ref<any[]>([]);
const captureMode = ref<'camera' | 'upload'>('camera');
const cameraActive = ref(false);
const capturedImage = ref('');
const uploadedImage = ref('');
const videoElement = ref<HTMLVideoElement>();
const canvasElement = ref<HTMLCanvasElement>();
const fileInput = ref<HTMLInputElement>();
let stream: MediaStream | null = null;

// Methods
const loadInmateData = async () => {
  try {
    const response = await ApiService.get(`/inmates/${inmateId.value}`);
    inmateData.value = response.data.data;
  } catch (error) {
    console.error('Error loading inmate data:', error);
  }
};

const loadPhotos = async () => {
  try {
    const response = await ApiService.get(`/inmates/${inmateId.value}/photos`);
    photos.value = response.data.data || [];
  } catch (error) {
    console.error('Error loading photos:', error);
  }
};

const startCamera = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      }
    });
    
    cameraActive.value = true;
    
    // Wait for next tick to ensure video element is rendered
    await nextTick();
    
    if (videoElement.value) {
      videoElement.value.srcObject = stream;
      // Ensure video plays
      videoElement.value.play().catch(err => {
        console.error('Error playing video:', err);
      });
    }
  } catch (error) {
    console.error('Error accessing camera:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo acceder a la cámara. Verifique los permisos.'
    });
  }
};

const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  cameraActive.value = false;
};

const capturePhoto = () => {
  if (videoElement.value && canvasElement.value) {
    const video = videoElement.value;
    const canvas = canvasElement.value;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0);
      capturedImage.value = canvas.toDataURL('image/jpeg', 0.95);
      stopCamera();
    }
  }
};

const retakePhoto = () => {
  capturedImage.value = '';
  startCamera();
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    Swal.fire({
      icon: 'error',
      title: 'Archivo muy grande',
      text: 'El archivo no debe superar los 5MB'
    });
    return;
  }
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    Swal.fire({
      icon: 'error',
      title: 'Tipo de archivo inválido',
      text: 'Por favor seleccione una imagen'
    });
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImage.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const clearUpload = () => {
  uploadedImage.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const showSaveDialog = async () => {
  const imageData = captureMode.value === 'camera' ? capturedImage.value : uploadedImage.value;
  
  if (!imageData) {
    await Swal.fire({
      icon: 'warning',
      title: 'Sin imagen',
      text: 'No hay imagen para guardar'
    });
    return;
  }
  
  const { value: photoType } = await Swal.fire({
    title: 'Tipo de Fotografía',
    input: 'select',
    inputOptions: {
      'frontal_mugshot': 'Foto Frontal',
      'profile_left': 'Perfil Izquierdo',
      'profile_right': 'Perfil Derecho',
      'full_body': 'Cuerpo Completo',
      'identifying_marks': 'Señas Particulares',
      'tattoos': 'Tatuajes',
      'scars': 'Cicatrices',
      'updated_appearance': 'Apariencia Actualizada'
    },
    inputPlaceholder: 'Seleccione el tipo de fotografía',
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar'
  });
  
  if (photoType) {
    await savePhoto(imageData, photoType);
  }
};

const savePhoto = async (imageData: string, photoType: string) => {
  try {
    // Convert base64 to blob
    const response = await fetch(imageData);
    const blob = await response.blob();
    
    // Create FormData
    const formData = new FormData();
    formData.append('inmate_id', inmateId.value);
    formData.append('photo', blob, 'photo.jpg');
    formData.append('photo_type', photoType);
    formData.append('description', `Fotografía ${photoType} capturada`);
    
    const uploadResponse = await ApiService.post('/inmates/physical-profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (uploadResponse.data.success) {
      await Swal.fire({
        icon: 'success',
        title: 'Fotografía Guardada',
        text: 'La fotografía se ha guardado correctamente',
        timer: 2000,
        showConfirmButton: false
      });
      
      // Reset capture states
      capturedImage.value = '';
      uploadedImage.value = '';
      
      // Reload photos
      await loadPhotos();
    }
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo guardar la fotografía'
    });
  }
};

const setPrimaryPhoto = async (photoId: number) => {
  try {
    const response = await ApiService.patch(`/inmates/photos/${photoId}/set-primary`);
    
    if (response.data.success) {
      const message = response.data.message.includes('unset') 
        ? 'Se ha quitado como fotografía principal'
        : 'Se ha establecido como fotografía principal';
        
      await Swal.fire({
        icon: 'success',
        title: 'Actualizado',
        text: message,
        timer: 2000,
        showConfirmButton: false
      });
      
      await loadPhotos();
    }
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo actualizar el estado de la fotografía'
    });
  }
};

const deletePhoto = async (photoId: number) => {
  const result = await Swal.fire({
    icon: 'warning',
    title: '¿Eliminar Fotografía?',
    text: 'Esta acción no se puede deshacer',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc3545'
  });
  
  if (result.isConfirmed) {
    try {
      const response = await ApiService.delete(`/inmates/photos/${photoId}`);
      
      if (response.data.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Fotografía Eliminada',
          text: 'La fotografía se ha eliminado correctamente',
          timer: 2000,
          showConfirmButton: false
        });
        
        await loadPhotos();
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la fotografía'
      });
    }
  }
};

const viewPhoto = (photo: any) => {
  Swal.fire({
    title: getPhotoTypeLabel(photo.photo_type),
    imageUrl: photo.photo_data || photo.photo_url,
    imageAlt: photo.photo_type,
    showCloseButton: true,
    showConfirmButton: false
  });
};

const getPhotoTypeLabel = (type: string) => {
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
  return labels[type] || type;
};

// Lifecycle
onMounted(async () => {
  await loadInmateData();
  await loadPhotos();
});

onUnmounted(() => {
  stopCamera();
});
</script>

<style scoped>
video {
  transform: scaleX(-1);
}
</style>