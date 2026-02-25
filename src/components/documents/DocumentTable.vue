<template>
  <div class="table-responsive">
    <table class="table align-middle table-row-dashed fs-6 gy-5">
      <thead>
        <tr class="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
          <th class="min-w-200px">{{ $t('documents.digitalFiles.table.filename') }}</th>
          <th class="min-w-100px">{{ $t('documents.digitalFiles.table.type') }}</th>
          <th class="min-w-150px" v-if="showInmateColumn">{{ $t('documents.digitalFiles.table.inmate') }}</th>
          <th class="min-w-100px">{{ $t('documents.digitalFiles.table.uploadDate') }}</th>
          <th class="min-w-100px">{{ $t('documents.digitalFiles.table.status') }}</th>
          <th class="min-w-80px">{{ $t('documents.digitalFiles.table.size') }}</th>
          <th class="text-end min-w-120px">{{ $t('documents.digitalFiles.table.actions') }}</th>
        </tr>
      </thead>
      <tbody class="text-gray-600 fw-semibold">
        <!-- Loading state -->
        <tr v-if="loading">
          <td :colspan="showInmateColumn ? 7 : 6" class="text-center py-10">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{ $t('documents.digitalFiles.loading') }}</span>
            </div>
            <p class="text-muted mt-3">{{ $t('documents.digitalFiles.loading') }}</p>
          </td>
        </tr>
        <!-- Empty state -->
        <tr v-else-if="files.length === 0">
          <td :colspan="showInmateColumn ? 7 : 6" class="text-center py-10">
            <div class="text-muted">
              <i class="ki-duotone ki-file fs-3x mb-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <p>{{ $t('documents.digitalFiles.noFilesFound') }}</p>
            </div>
          </td>
        </tr>
        <!-- Files list -->
        <tr v-else v-for="file in files" :key="file.id">
          <!-- Filename with icon -->
          <td>
            <div class="d-flex align-items-center">
              <FileTypeIcon
                :file-type="file.file_type"
                :mime-type="file.mime_type"
                size="md"
                class="me-3"
              />
              <div class="d-flex flex-column">
                <span class="text-gray-800 text-hover-primary fw-bold">
                  {{ file.document_title }}
                </span>
                <span class="text-muted fs-7">{{ file.original_filename }}</span>
                <div class="mt-1" v-if="file.is_confidential">
                  <span class="badge badge-light-danger badge-sm">
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
          </td>
          <!-- File Type -->
          <td>
            <span class="badge" :class="getTypeBadgeClass(file.file_type)">
              {{ $t(`documents.digitalFiles.fileTypes.${file.file_type}`) }}
            </span>
          </td>
          <!-- Inmate -->
          <td v-if="showInmateColumn">
            <div v-if="file.inmate" class="d-flex flex-column">
              <span class="text-gray-800">
                {{ [file.inmate.first_name, file.inmate.middle_name, file.inmate.last_name, file.inmate.second_last_name].filter(Boolean).join(' ') }}
              </span>
              <span class="text-muted fs-7">{{ file.inmate.document_number }}</span>
            </div>
            <span v-else class="text-muted">-</span>
          </td>
          <!-- Upload Date -->
          <td>
            <span class="text-gray-600">{{ formatDate(file.upload_date) }}</span>
            <div v-if="file.uploadedBy" class="text-muted fs-7">
              {{ file.uploadedBy.first_name }} {{ file.uploadedBy.last_name }}
            </div>
          </td>
          <!-- Verification Status -->
          <td>
            <span class="badge" :class="getStatusBadgeClass(file.verification_status)">
              {{ $t(`documents.digitalFiles.verificationStatus.${file.verification_status}`) }}
            </span>
            <div v-if="file.is_ai_processed" class="mt-1">
              <span class="badge badge-light-info badge-sm">
                <i class="ki-duotone ki-technology-2 fs-7 me-1">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                IA
              </span>
            </div>
          </td>
          <!-- File Size -->
          <td>
            <span class="text-gray-600">{{ file.file_size_human || formatFileSize(file.file_size) }}</span>
          </td>
          <!-- Actions -->
          <td class="text-end">
            <div class="d-flex justify-content-end flex-shrink-0">
              <!-- View Details -->
              <button
                class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                :title="$t('documents.digitalFiles.actions.view')"
                @click="$emit('view', file)"
              >
                <i class="ki-duotone ki-eye fs-5">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
              </button>
              <!-- Download -->
              <button
                class="btn btn-icon btn-bg-light btn-active-color-info btn-sm me-1"
                :title="$t('documents.digitalFiles.actions.download')"
                @click="$emit('download', file)"
              >
                <i class="ki-duotone ki-file-down fs-5">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </button>
              <!-- Verify (only for pending) -->
              <button
                v-if="file.verification_status === 'pending' && canVerify"
                class="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1"
                :title="$t('documents.digitalFiles.actions.verify')"
                @click="$emit('verify', file)"
              >
                <i class="ki-duotone ki-check-circle fs-5">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </button>
              <!-- Delete -->
              <button
                v-if="canDelete"
                class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                :title="$t('documents.digitalFiles.actions.delete')"
                @click="$emit('delete', file)"
              >
                <i class="ki-duotone ki-trash fs-5">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                  <span class="path4"></span>
                  <span class="path5"></span>
                </i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Pagination -->
  <div v-if="!loading && files.length > 0" class="d-flex justify-content-between align-items-center pt-5">
    <div class="d-flex align-items-center gap-3">
      <div class="text-muted">
        {{ $t('documents.digitalFiles.pagination.showing', { from: pagination.from, to: pagination.to, total: pagination.total }) }}
      </div>
      <div class="d-flex align-items-center gap-2">
        <label class="form-label mb-0 me-2">{{ $t('documents.digitalFiles.pagination.perPage') }}</label>
        <select
          :value="pagination.perPage"
          class="form-select form-select-sm"
          style="width: 80px;"
          @change="$emit('changePerPage', Number(($event.target as HTMLSelectElement).value))"
        >
          <option :value="10">10</option>
          <option :value="15">15</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>
    </div>

    <div class="d-flex align-items-center gap-2">
      <!-- Previous Button -->
      <button
        type="button"
        class="btn btn-sm btn-light"
        :disabled="pagination.currentPage === 1"
        @click="$emit('changePage', pagination.currentPage - 1)"
      >
        <i class="fas fa-chevron-left"></i>
      </button>

      <!-- Page Numbers -->
      <div class="d-flex gap-1">
        <!-- First Page -->
        <button
          v-if="pagination.currentPage > 3"
          type="button"
          class="btn btn-sm btn-light"
          @click="$emit('changePage', 1)"
        >
          1
        </button>
        <span v-if="pagination.currentPage > 4" class="align-self-center">...</span>

        <!-- Pages around current -->
        <button
          v-for="page in visiblePages"
          :key="page"
          type="button"
          class="btn btn-sm"
          :class="page === pagination.currentPage ? 'btn-primary' : 'btn-light'"
          @click="$emit('changePage', page)"
        >
          {{ page }}
        </button>

        <!-- Last Page -->
        <span v-if="pagination.currentPage < pagination.lastPage - 3" class="align-self-center">...</span>
        <button
          v-if="pagination.currentPage < pagination.lastPage - 2"
          type="button"
          class="btn btn-sm btn-light"
          @click="$emit('changePage', pagination.lastPage)"
        >
          {{ pagination.lastPage }}
        </button>
      </div>

      <!-- Next Button -->
      <button
        type="button"
        class="btn btn-sm btn-light"
        :disabled="pagination.currentPage === pagination.lastPage"
        @click="$emit('changePage', pagination.currentPage + 1)"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DigitalFile, FileType, VerificationStatus } from '@/types/documents';
import { formatFileSize } from '@/types/documents';
import FileTypeIcon from './FileTypeIcon.vue';

const props = withDefaults(defineProps<{
  files: DigitalFile[];
  loading?: boolean;
  showInmateColumn?: boolean;
  canVerify?: boolean;
  canDelete?: boolean;
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
    from: number;
    to: number;
  };
}>(), {
  loading: false,
  showInmateColumn: true,
  canVerify: true,
  canDelete: true
});

defineEmits<{
  (e: 'view', file: DigitalFile): void;
  (e: 'download', file: DigitalFile): void;
  (e: 'verify', file: DigitalFile): void;
  (e: 'delete', file: DigitalFile): void;
  (e: 'changePage', page: number): void;
  (e: 'changePerPage', perPage: number): void;
}>();

const visiblePages = computed(() => {
  const pages: number[] = [];
  const current = props.pagination.currentPage;
  const last = props.pagination.lastPage;

  let start = Math.max(1, current - 2);
  let end = Math.min(last, current + 2);

  if (current <= 3) {
    end = Math.min(5, last);
  }
  if (current >= last - 2) {
    start = Math.max(1, last - 4);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
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

const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>
