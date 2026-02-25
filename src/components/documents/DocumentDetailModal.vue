<template>
  <div
    v-if="show && file"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
    @click.self="$emit('close')"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">{{ $t('documents.digitalFiles.detailModal.title') }}</h2>
          <div
            class="btn btn-icon btn-sm btn-active-icon-primary"
            @click="$emit('close')"
          >
            <i class="ki-duotone ki-cross fs-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
        </div>
        <div class="modal-body">
          <div class="row">
            <!-- Left Column - File Info -->
            <div class="col-lg-6">
              <!-- Document Header -->
              <div class="d-flex align-items-center mb-5">
                <FileTypeIcon
                  :file-type="file.file_type"
                  :mime-type="file.mime_type"
                  size="lg"
                  class="me-4"
                />
                <div>
                  <h4 class="mb-1">{{ file.document_title }}</h4>
                  <div class="text-muted">{{ file.original_filename }}</div>
                  <div class="mt-2">
                    <span class="badge me-2" :class="getTypeBadgeClass(file.file_type)">
                      {{ $t(`documents.digitalFiles.fileTypes.${file.file_type}`) }}
                    </span>
                    <span class="badge" :class="getStatusBadgeClass(file.verification_status)">
                      {{ $t(`documents.digitalFiles.verificationStatus.${file.verification_status}`) }}
                    </span>
                    <span v-if="file.is_confidential" class="badge badge-light-danger ms-2">
                      <i class="ki-duotone ki-lock fs-7 me-1">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                      </i>
                      {{ $t('documents.digitalFiles.badges.confidential') }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- File Metadata -->
              <div class="card card-flush mb-5">
                <div class="card-header min-h-50px">
                  <h5 class="card-title">{{ $t('documents.digitalFiles.detailModal.metadata') }}</h5>
                </div>
                <div class="card-body pt-0">
                  <table class="table table-row-dashed table-row-gray-300 fs-7">
                    <tbody>
                      <tr>
                        <td class="text-gray-600 fw-bold">{{ $t('documents.digitalFiles.detailModal.originalFilename') }}</td>
                        <td>{{ file.original_filename }}</td>
                      </tr>
                      <tr>
                        <td class="text-gray-600 fw-bold">{{ $t('documents.digitalFiles.detailModal.fileSize') }}</td>
                        <td>{{ file.file_size_human || formatFileSize(file.file_size) }}</td>
                      </tr>
                      <tr>
                        <td class="text-gray-600 fw-bold">{{ $t('documents.digitalFiles.detailModal.mimeType') }}</td>
                        <td>{{ file.mime_type }}</td>
                      </tr>
                      <tr>
                        <td class="text-gray-600 fw-bold">{{ $t('documents.digitalFiles.detailModal.uploadDate') }}</td>
                        <td>{{ formatDateTime(file.upload_date) }}</td>
                      </tr>
                      <tr v-if="file.uploadedBy">
                        <td class="text-gray-600 fw-bold">{{ $t('documents.digitalFiles.table.uploadedBy') }}</td>
                        <td>{{ file.uploadedBy.first_name }} {{ file.uploadedBy.last_name }}</td>
                      </tr>
                      <tr>
                        <td class="text-gray-600 fw-bold">{{ $t('documents.digitalFiles.detailModal.confidential') }}</td>
                        <td>
                          <span :class="file.is_confidential ? 'text-danger' : 'text-success'">
                            {{ file.is_confidential ? $t('documents.digitalFiles.detailModal.yes') : $t('documents.digitalFiles.detailModal.no') }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Inmate Info -->
              <div v-if="file.inmate" class="card card-flush mb-5">
                <div class="card-header min-h-50px">
                  <h5 class="card-title">{{ $t('documents.digitalFiles.table.inmate') }}</h5>
                </div>
                <div class="card-body pt-0">
                  <div class="d-flex align-items-center">
                    <i class="ki-duotone ki-profile-user fs-2 me-3 text-primary">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                    </i>
                    <div>
                      <div class="fw-bold">{{ [file.inmate.first_name, file.inmate.middle_name, file.inmate.last_name, file.inmate.second_last_name].filter(Boolean).join(' ') }}</div>
                      <div class="text-muted fs-7">DPI: {{ file.inmate.document_number }}</div>
                      <div v-if="file.inmate.inmate_number" class="text-muted fs-7">
                        No. Interno: {{ file.inmate.inmate_number }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Verification Info -->
              <div v-if="file.verification_status !== 'pending'" class="card card-flush mb-5">
                <div class="card-header min-h-50px">
                  <h5 class="card-title">{{ $t('documents.digitalFiles.detailModal.verificationInfo') }}</h5>
                </div>
                <div class="card-body pt-0">
                  <table class="table table-row-dashed table-row-gray-300 fs-7">
                    <tbody>
                      <tr>
                        <td class="text-gray-600 fw-bold">{{ $t('documents.digitalFiles.filters.status') }}</td>
                        <td>
                          <span class="badge" :class="getStatusBadgeClass(file.verification_status)">
                            {{ $t(`documents.digitalFiles.verificationStatus.${file.verification_status}`) }}
                          </span>
                        </td>
                      </tr>
                      <tr v-if="file.verification_date">
                        <td class="text-gray-600 fw-bold">{{ $t('documents.digitalFiles.detailModal.verificationDate') }}</td>
                        <td>{{ formatDateTime(file.verification_date) }}</td>
                      </tr>
                      <tr v-if="file.verifiedBy">
                        <td class="text-gray-600 fw-bold">{{ $t('documents.digitalFiles.table.verifiedBy') }}</td>
                        <td>{{ file.verifiedBy.first_name }} {{ file.verifiedBy.last_name }}</td>
                      </tr>
                      <tr v-if="file.verification_notes">
                        <td class="text-gray-600 fw-bold">{{ $t('documents.digitalFiles.detailModal.verificationNotes') }}</td>
                        <td>{{ file.verification_notes }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- AI Processing Info -->
              <div v-if="file.ai_processing_status" class="card card-flush">
                <div class="card-header min-h-50px">
                  <h5 class="card-title">{{ $t('documents.digitalFiles.detailModal.aiInfo') }}</h5>
                </div>
                <div class="card-body pt-0">
                  <div class="mb-3">
                    <span class="text-gray-600 fw-bold me-2">{{ $t('documents.digitalFiles.detailModal.aiStatus') }}:</span>
                    <span class="badge" :class="getAIStatusBadgeClass(file.ai_processing_status)">
                      {{ $t(`documents.digitalFiles.aiStatus.${file.ai_processing_status}`) }}
                    </span>
                  </div>
                  <div v-if="file.ai_extracted_text" class="mt-3">
                    <div class="text-gray-600 fw-bold mb-2">{{ $t('documents.digitalFiles.detailModal.extractedText') }}:</div>
                    <div class="bg-light p-3 rounded fs-7" style="max-height: 200px; overflow-y: auto;">
                      {{ file.ai_extracted_text }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column - Preview & Description -->
            <div class="col-lg-6">
              <!-- Description -->
              <div v-if="file.description" class="card card-flush mb-5">
                <div class="card-header min-h-50px">
                  <h5 class="card-title">{{ $t('documents.digitalFiles.uploadModal.description') }}</h5>
                </div>
                <div class="card-body pt-0">
                  <p class="text-gray-700">{{ file.description }}</p>
                </div>
              </div>

              <!-- Preview Area -->
              <div class="card card-flush">
                <div class="card-header min-h-50px">
                  <h5 class="card-title">{{ $t('documents.digitalFiles.detailModal.preview') }}</h5>
                </div>
                <div class="card-body pt-0">
                  <div v-if="isImageFile" class="text-center">
                    <img
                      :src="previewUrl"
                      :alt="file.document_title"
                      class="img-fluid rounded"
                      style="max-height: 400px;"
                      @error="previewError = true"
                    />
                  </div>
                  <div v-else-if="isPdfFile" class="text-center">
                    <iframe
                      v-if="previewUrl"
                      :src="previewUrl"
                      class="w-100 rounded"
                      style="height: 400px; border: none;"
                    ></iframe>
                    <div v-else class="py-10 text-muted">
                      <i class="ki-duotone ki-file-pdf fs-3x mb-3">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <p>{{ $t('documents.digitalFiles.detailModal.noPreview') }}</p>
                    </div>
                  </div>
                  <div v-else class="text-center py-10">
                    <FileTypeIcon
                      :file-type="file.file_type"
                      :mime-type="file.mime_type"
                      size="lg"
                      class="mb-3"
                    />
                    <p class="text-muted">{{ $t('documents.digitalFiles.detailModal.noPreview') }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-light"
            @click="$emit('close')"
          >
            {{ $t('documents.digitalFiles.detailModal.close') }}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="$emit('download', file)"
          >
            <i class="ki-duotone ki-file-down fs-4 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            {{ $t('documents.digitalFiles.detailModal.download') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { DigitalFile, FileType, VerificationStatus, AIProcessingStatus } from '@/types/documents';
import { formatFileSize, isImageFile as checkIsImage, isPdfFile as checkIsPdf } from '@/types/documents';
import DigitalFileService from '@/core/services/DigitalFileService';
import FileTypeIcon from './FileTypeIcon.vue';

const props = defineProps<{
  show: boolean;
  file: DigitalFile | null;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'download', file: DigitalFile): void;
}>();

const previewError = ref(false);

const isImageFile = computed(() => {
  if (!props.file) return false;
  return checkIsImage(props.file.mime_type);
});

const isPdfFile = computed(() => {
  if (!props.file) return false;
  return checkIsPdf(props.file.mime_type);
});

const previewUrl = computed(() => {
  if (!props.file) return '';
  // For images and PDFs, we can try to generate a preview URL
  // This requires the backend to support streaming files
  return DigitalFileService.getDownloadUrl(props.file.id);
});

const getTypeBadgeClass = (type: FileType): string => {
  switch (type) {
    case 'legal':
      return 'badge-light-primary';
    case 'judicial':
      return 'badge-light-info';
    case 'medical':
      return 'badge-light-success';
    case 'identification':
      return 'badge-light-warning';
    case 'administrative':
      return 'badge-light-secondary';
    default:
      return 'badge-light-dark';
  }
};

const getStatusBadgeClass = (status: VerificationStatus): string => {
  switch (status) {
    case 'verified':
      return 'badge-light-success';
    case 'rejected':
      return 'badge-light-danger';
    case 'pending':
    default:
      return 'badge-light-warning';
  }
};

const getAIStatusBadgeClass = (status: AIProcessingStatus): string => {
  switch (status) {
    case 'completed':
      return 'badge-light-success';
    case 'failed':
      return 'badge-light-danger';
    case 'processing':
      return 'badge-light-info';
    case 'pending':
    default:
      return 'badge-light-warning';
  }
};

const formatDateTime = (dateString: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
.modal-dialog-scrollable .modal-body {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
</style>
