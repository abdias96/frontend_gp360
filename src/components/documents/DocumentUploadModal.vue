<template>
  <div
    v-if="show"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
    @click.self="close"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">{{ $t('documents.digitalFiles.uploadModal.title') }}</h2>
          <div
            class="btn btn-icon btn-sm btn-active-icon-primary"
            @click="close"
          >
            <i class="ki-duotone ki-cross fs-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
        </div>
        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <!-- Inmate Selection -->
            <div class="mb-5" v-if="!preselectedInmateId">
              <label class="form-label required">{{ $t('documents.digitalFiles.uploadModal.selectInmate') }}</label>
              <div class="position-relative">
                <input
                  type="text"
                  v-model="inmateSearch"
                  class="form-control form-control-solid"
                  :placeholder="$t('documents.digitalFiles.uploadModal.searchInmate')"
                  @input="searchInmates"
                />
                <div v-if="searchingInmates" class="position-absolute end-0 top-50 translate-middle-y me-3">
                  <span class="spinner-border spinner-border-sm text-primary"></span>
                </div>
              </div>
              <!-- Search Results Dropdown -->
              <div v-if="inmateResults.length > 0" class="mt-2 border rounded p-2 bg-light-primary">
                <div
                  v-for="inmate in inmateResults"
                  :key="inmate.id"
                  class="p-2 cursor-pointer hover-bg-light rounded"
                  @click="selectInmate(inmate)"
                >
                  <span class="fw-bold">{{ [inmate.first_name, inmate.middle_name, inmate.last_name, inmate.second_last_name].filter(Boolean).join(' ') }}</span>
                  <span class="text-muted ms-2">{{ inmate.document_number }}</span>
                </div>
              </div>
              <!-- Selected Inmate Display -->
              <div v-if="selectedInmate" class="mt-2 d-flex align-items-center bg-light-success p-3 rounded">
                <i class="ki-duotone ki-profile-user fs-2 me-3 text-success">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                  <span class="path4"></span>
                </i>
                <div>
                  <div class="fw-bold">{{ [selectedInmate.first_name, selectedInmate.middle_name, selectedInmate.last_name, selectedInmate.second_last_name].filter(Boolean).join(' ') }}</div>
                  <div class="text-muted fs-7">{{ selectedInmate.document_number }}</div>
                </div>
                <button type="button" class="btn btn-sm btn-icon btn-light-danger ms-auto" @click="clearInmate">
                  <i class="ki-duotone ki-cross fs-5">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </button>
              </div>
              <div v-if="errors.inmate_id" class="text-danger mt-1 fs-7">{{ errors.inmate_id }}</div>
            </div>

            <!-- File Drop Zone -->
            <div class="mb-5">
              <label class="form-label required">{{ $t('documents.digitalFiles.uploadModal.selectFile') }}</label>
              <div
                class="dropzone p-5 border-dashed border-2 rounded text-center cursor-pointer"
                :class="{ 'border-primary bg-light-primary': dragOver, 'border-gray-300': !dragOver }"
                @dragover.prevent="dragOver = true"
                @dragleave="dragOver = false"
                @drop.prevent="handleDrop"
                @click="triggerFileInput"
              >
                <input
                  type="file"
                  ref="fileInput"
                  class="d-none"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tiff"
                  @change="handleFileSelect"
                />
                <div v-if="!selectedFile">
                  <i class="ki-duotone ki-file-up fs-3x text-gray-500 mb-3">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  <p class="text-gray-600 mb-1">{{ $t('documents.digitalFiles.uploadModal.dragDrop') }}</p>
                  <p class="text-muted fs-7">{{ $t('documents.digitalFiles.uploadModal.allowedFormats') }}</p>
                  <p class="text-muted fs-7">{{ $t('documents.digitalFiles.uploadModal.maxSize') }}</p>
                </div>
                <div v-else class="d-flex align-items-center justify-content-center">
                  <FileTypeIcon :mime-type="selectedFile.type" size="lg" class="me-3" />
                  <div class="text-start">
                    <div class="fw-bold">{{ selectedFile.name }}</div>
                    <div class="text-muted fs-7">{{ formatFileSize(selectedFile.size) }}</div>
                  </div>
                  <button type="button" class="btn btn-sm btn-icon btn-light-danger ms-3" @click.stop="clearFile">
                    <i class="ki-duotone ki-cross fs-5">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </button>
                </div>
              </div>
              <div v-if="errors.file" class="text-danger mt-1 fs-7">{{ errors.file }}</div>
            </div>

            <!-- Document Title -->
            <div class="mb-5">
              <label class="form-label required">{{ $t('documents.digitalFiles.uploadModal.documentTitle') }}</label>
              <input
                type="text"
                v-model="form.document_title"
                class="form-control form-control-solid"
                :class="{ 'is-invalid': errors.document_title }"
                :placeholder="$t('documents.digitalFiles.uploadModal.documentTitlePlaceholder')"
              />
              <div v-if="errors.document_title" class="invalid-feedback">{{ errors.document_title }}</div>
            </div>

            <!-- File Type -->
            <div class="mb-5">
              <label class="form-label required">{{ $t('documents.digitalFiles.uploadModal.fileType') }}</label>
              <select
                v-model="form.file_type"
                class="form-select form-select-solid"
                :class="{ 'is-invalid': errors.file_type }"
              >
                <option value="">{{ $t('documents.digitalFiles.uploadModal.selectFileType') }}</option>
                <option v-for="type in availableFileTypes" :key="type" :value="type">
                  {{ $t(`documents.digitalFiles.fileTypes.${type}`) }}
                </option>
              </select>
              <div v-if="errors.file_type" class="invalid-feedback">{{ errors.file_type }}</div>
            </div>

            <!-- Description -->
            <div class="mb-5">
              <label class="form-label">{{ $t('documents.digitalFiles.uploadModal.description') }}</label>
              <textarea
                v-model="form.description"
                class="form-control form-control-solid"
                rows="3"
                :placeholder="$t('documents.digitalFiles.uploadModal.descriptionPlaceholder')"
              ></textarea>
            </div>

            <!-- Options Row -->
            <div class="row">
              <!-- Confidential -->
              <div class="col-md-6">
                <div class="form-check form-switch form-check-custom form-check-solid">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="isConfidential"
                    v-model="form.is_confidential"
                  />
                  <label class="form-check-label" for="isConfidential">
                    {{ $t('documents.digitalFiles.uploadModal.isConfidential') }}
                  </label>
                </div>
                <div class="text-muted fs-7 mt-1">{{ $t('documents.digitalFiles.uploadModal.confidentialHint') }}</div>
              </div>
              <!-- Process with AI -->
              <div class="col-md-6">
                <div class="form-check form-switch form-check-custom form-check-solid">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="processWithAI"
                    v-model="form.process_with_ai"
                  />
                  <label class="form-check-label" for="processWithAI">
                    {{ $t('documents.digitalFiles.uploadModal.processWithAI') }}
                  </label>
                </div>
                <div class="text-muted fs-7 mt-1">{{ $t('documents.digitalFiles.uploadModal.processWithAIHint') }}</div>
              </div>
            </div>

            <!-- Upload Progress -->
            <div v-if="uploading" class="mt-5">
              <div class="progress" style="height: 10px;">
                <div
                  class="progress-bar bg-primary"
                  role="progressbar"
                  :style="{ width: uploadProgress + '%' }"
                ></div>
              </div>
              <p class="text-center text-muted mt-2">{{ $t('documents.digitalFiles.uploadModal.uploading') }} {{ uploadProgress }}%</p>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-light"
              @click="close"
              :disabled="uploading"
            >
              {{ $t('documents.digitalFiles.uploadModal.cancel') }}
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="uploading || !isFormValid"
            >
              <span v-if="uploading" class="spinner-border spinner-border-sm me-2"></span>
              {{ uploading ? $t('documents.digitalFiles.uploadModal.uploading') : $t('documents.digitalFiles.uploadModal.upload') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { FileType } from '@/types/documents';
import { formatFileSize, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/types/documents';
import DigitalFileService from '@/core/services/DigitalFileService';
import ApiService from '@/core/services/ApiService';
import FileTypeIcon from './FileTypeIcon.vue';

const props = withDefaults(defineProps<{
  show: boolean;
  preselectedInmateId?: number;
  defaultFileType?: FileType;
  allowedFileTypes?: FileType[];
}>(), {
  allowedFileTypes: () => ['legal', 'medical', 'administrative', 'identification', 'judicial']
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'uploaded', file: any): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const dragOver = ref(false);
const uploading = ref(false);
const uploadProgress = ref(0);
const searchingInmates = ref(false);

// Inmate search
const inmateSearch = ref('');
const inmateResults = ref<any[]>([]);
const selectedInmate = ref<any>(null);

// Form data
const form = ref({
  document_title: '',
  file_type: props.defaultFileType || '' as FileType | '',
  description: '',
  is_confidential: false,
  process_with_ai: false
});

const selectedFile = ref<File | null>(null);
const errors = ref<Record<string, string>>({});

const availableFileTypes = computed(() => props.allowedFileTypes);

const isFormValid = computed(() => {
  return (
    (props.preselectedInmateId || selectedInmate.value) &&
    selectedFile.value &&
    form.value.document_title.trim() &&
    form.value.file_type
  );
});

// Watch for show prop to reset form
watch(() => props.show, (newVal) => {
  if (newVal) {
    resetForm();
  }
});

// Inmate search with debounce
let searchTimeout: any = null;
const searchInmates = () => {
  if (searchTimeout) clearTimeout(searchTimeout);

  if (inmateSearch.value.length < 2) {
    inmateResults.value = [];
    return;
  }

  searchTimeout = setTimeout(async () => {
    searchingInmates.value = true;
    try {
      const response = await ApiService.get(`/inmates?search=${encodeURIComponent(inmateSearch.value)}&per_page=5`);
      if (response.data.success) {
        inmateResults.value = response.data.data.data || response.data.data;
      }
    } catch (error) {
      console.error('Error searching inmates:', error);
    } finally {
      searchingInmates.value = false;
    }
  }, 300);
};

const selectInmate = (inmate: any) => {
  selectedInmate.value = inmate;
  inmateSearch.value = '';
  inmateResults.value = [];
  errors.value.inmate_id = '';
};

const clearInmate = () => {
  selectedInmate.value = null;
};

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    validateAndSetFile(input.files[0]);
  }
};

const handleDrop = (event: DragEvent) => {
  dragOver.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    validateAndSetFile(event.dataTransfer.files[0]);
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const validateAndSetFile = (file: File) => {
  const validation = DigitalFileService.validateFile(file, MAX_FILE_SIZE);
  if (!validation.valid) {
    errors.value.file = validation.error || 'Invalid file';
    return;
  }
  selectedFile.value = file;
  errors.value.file = '';

  // Auto-fill title from filename if empty
  if (!form.value.document_title) {
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    form.value.document_title = nameWithoutExt;
  }
};

const clearFile = () => {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const resetForm = () => {
  form.value = {
    document_title: '',
    file_type: props.defaultFileType || '',
    description: '',
    is_confidential: false,
    process_with_ai: false
  };
  selectedFile.value = null;
  selectedInmate.value = null;
  inmateSearch.value = '';
  inmateResults.value = [];
  errors.value = {};
  uploadProgress.value = 0;
};

const close = () => {
  if (!uploading.value) {
    emit('close');
  }
};

const handleSubmit = async () => {
  errors.value = {};

  // Validate
  const inmateId = props.preselectedInmateId || selectedInmate.value?.id;
  if (!inmateId) {
    errors.value.inmate_id = 'Debe seleccionar un interno';
    return;
  }

  if (!selectedFile.value) {
    errors.value.file = 'Debe seleccionar un archivo';
    return;
  }

  if (!form.value.document_title.trim()) {
    errors.value.document_title = 'El titulo es requerido';
    return;
  }

  if (!form.value.file_type) {
    errors.value.file_type = 'Debe seleccionar un tipo de documento';
    return;
  }

  uploading.value = true;
  uploadProgress.value = 0;

  try {
    // Simulate progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10;
      }
    }, 200);

    const response = await DigitalFileService.uploadFile({
      inmate_id: inmateId,
      file: selectedFile.value,
      file_type: form.value.file_type as FileType,
      document_title: form.value.document_title,
      description: form.value.description,
      is_confidential: form.value.is_confidential,
      process_with_ai: form.value.process_with_ai
    });

    clearInterval(progressInterval);
    uploadProgress.value = 100;

    setTimeout(() => {
      emit('uploaded', response.data);
      emit('close');
    }, 500);
  } catch (error: any) {
    console.error('Upload error:', error);
    errors.value.file = error.message || 'Error al subir el archivo';
  } finally {
    uploading.value = false;
  }
};
</script>

<style scoped>
.dropzone {
  transition: all 0.3s ease;
}

.dropzone:hover {
  border-color: var(--bs-primary) !important;
  background-color: var(--bs-light-primary);
}

.cursor-pointer {
  cursor: pointer;
}

.hover-bg-light:hover {
  background-color: var(--bs-gray-200);
}

.form-label.required::after {
  content: " *";
  color: #dc3545;
}

.invalid-feedback {
  display: block;
}
</style>
