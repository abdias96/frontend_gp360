<template>
  <div
    v-if="show && file"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
    @click.self="close"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">{{ $t('documents.digitalFiles.verifyModal.title') }}</h2>
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
        <div class="modal-body">
          <!-- Document Summary -->
          <div class="d-flex align-items-center mb-5 p-4 bg-light rounded">
            <FileTypeIcon
              :file-type="file.file_type"
              :mime-type="file.mime_type"
              size="lg"
              class="me-4"
            />
            <div>
              <h5 class="mb-1">{{ file.document_title }}</h5>
              <div class="text-muted fs-7">{{ file.original_filename }}</div>
              <div class="mt-2">
                <span class="badge" :class="getTypeBadgeClass(file.file_type)">
                  {{ $t(`documents.digitalFiles.fileTypes.${file.file_type}`) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Verification Notes -->
          <div class="mb-5">
            <label class="form-label">{{ $t('documents.digitalFiles.verifyModal.notes') }}</label>
            <textarea
              v-model="verificationNotes"
              class="form-control form-control-solid"
              rows="4"
              :placeholder="$t('documents.digitalFiles.verifyModal.notesPlaceholder')"
            ></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="d-flex gap-3">
            <button
              type="button"
              class="btn btn-success flex-fill"
              :disabled="processing"
              @click="verify('verified')"
            >
              <span v-if="processing && currentAction === 'verified'" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="ki-duotone ki-check-circle fs-4 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ processing && currentAction === 'verified' ? $t('documents.digitalFiles.verifyModal.approving') : $t('documents.digitalFiles.verifyModal.approve') }}
            </button>
            <button
              type="button"
              class="btn btn-danger flex-fill"
              :disabled="processing"
              @click="verify('rejected')"
            >
              <span v-if="processing && currentAction === 'rejected'" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="ki-duotone ki-cross-circle fs-4 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ processing && currentAction === 'rejected' ? $t('documents.digitalFiles.verifyModal.rejecting') : $t('documents.digitalFiles.verifyModal.reject') }}
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-light"
            @click="close"
            :disabled="processing"
          >
            {{ $t('documents.digitalFiles.verifyModal.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { DigitalFile, FileType, VerificationStatus } from '@/types/documents';
import DigitalFileService from '@/core/services/DigitalFileService';
import FileTypeIcon from './FileTypeIcon.vue';

const props = defineProps<{
  show: boolean;
  file: DigitalFile | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'verified', file: DigitalFile, status: VerificationStatus): void;
}>();

const verificationNotes = ref('');
const processing = ref(false);
const currentAction = ref<VerificationStatus | null>(null);

// Reset notes when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    verificationNotes.value = '';
    processing.value = false;
    currentAction.value = null;
  }
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

const close = () => {
  if (!processing.value) {
    emit('close');
  }
};

const verify = async (status: 'verified' | 'rejected') => {
  if (!props.file) return;

  processing.value = true;
  currentAction.value = status;

  try {
    const response = await DigitalFileService.verifyFile(props.file.id, {
      verification_status: status,
      verification_notes: verificationNotes.value || undefined
    });

    emit('verified', response.data, status);
    emit('close');
  } catch (error) {
    console.error('Error verifying file:', error);
  } finally {
    processing.value = false;
    currentAction.value = null;
  }
};
</script>
