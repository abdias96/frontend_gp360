<template>
  <div>
    <!-- Header -->
    <div class="card mb-5">
      <div class="card-body py-4">
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <i class="ki-duotone ki-pulse fs-2x text-success me-4">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            <div>
              <h2 class="mb-1">{{ $t('documents.medicalDocuments.title') }}</h2>
              <p class="text-muted mb-0">{{ $t('documents.medicalDocuments.subtitle') }}</p>
            </div>
          </div>
          <!-- Confidentiality Notice -->
          <div class="d-flex align-items-center bg-light-danger rounded px-4 py-2">
            <i class="ki-duotone ki-shield-tick fs-2 text-danger me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            <span class="text-danger fw-semibold fs-7">
              {{ $t('documents.digitalFiles.badges.confidential') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Card -->
    <div class="card">
      <!-- Card Header -->
      <div class="card-header border-0 pt-6">
        <div class="card-title">
          <!-- Search -->
          <div class="d-flex align-items-center position-relative my-1">
            <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-5">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            <input
              type="text"
              v-model="searchTerm"
              class="form-control form-control-solid w-250px ps-13"
              :placeholder="$t('documents.digitalFiles.searchPlaceholder')"
              @input="handleSearchInput"
            />
          </div>
        </div>

        <div class="card-toolbar">
          <div class="d-flex gap-3">
            <!-- Filter Toggle Button -->
            <button
              type="button"
              class="btn btn-light-success btn-sm"
              @click="showFilters = !showFilters"
            >
              <i class="ki-duotone ki-filter fs-5 me-1">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ showFilters ? $t('documents.digitalFiles.filters.hideFilters') : $t('documents.digitalFiles.filters.showFilters') }}
            </button>
            <!-- Upload Button -->
            <button
              type="button"
              class="btn btn-success"
              @click="showUploadModal = true"
            >
              <i class="ki-duotone ki-file-up fs-2 me-1">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ $t('documents.digitalFiles.uploadDocument') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Filters Panel (without type filter since it's predefined) -->
      <DocumentFilters
        :expanded="showFilters"
        :show-type-filter="false"
        :filters="filters"
        @toggle="showFilters = false"
        @change="handleFilterChange"
        @clear="clearFilters"
      />

      <!-- Card Body -->
      <div class="card-body py-4">
        <DocumentTable
          :files="files"
          :loading="loading"
          :show-inmate-column="true"
          :can-verify="true"
          :can-delete="true"
          :pagination="pagination"
          @view="viewFile"
          @download="downloadFile"
          @verify="openVerifyModal"
          @delete="deleteFile"
          @change-page="changePage"
          @change-per-page="changePerPage"
        />
      </div>
    </div>

    <!-- Upload Modal (with medical type only) -->
    <DocumentUploadModal
      :show="showUploadModal"
      :allowed-file-types="['medical']"
      default-file-type="medical"
      @close="showUploadModal = false"
      @uploaded="handleFileUploaded"
    />

    <!-- Detail Modal -->
    <DocumentDetailModal
      :show="showDetailModal"
      :file="selectedFile"
      @close="showDetailModal = false"
      @download="downloadFile"
    />

    <!-- Verify Modal -->
    <DocumentVerifyModal
      :show="showVerifyModal"
      :file="selectedFile"
      @close="showVerifyModal = false"
      @verified="handleFileVerified"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Swal from 'sweetalert2';
import type { DigitalFile, FileQueryParams, VerificationStatus } from '@/types/documents';
import DigitalFileService from '@/core/services/DigitalFileService';
import DocumentFilters from '@/components/documents/DocumentFilters.vue';
import DocumentTable from '@/components/documents/DocumentTable.vue';
import DocumentUploadModal from '@/components/documents/DocumentUploadModal.vue';
import DocumentDetailModal from '@/components/documents/DocumentDetailModal.vue';
import DocumentVerifyModal from '@/components/documents/DocumentVerifyModal.vue';

const { t } = useI18n();

// Medical document type filter (predefined)
const MEDICAL_FILE_TYPE = 'medical' as const;

// State
const loading = ref(false);
const files = ref<DigitalFile[]>([]);
const searchTerm = ref('');
const showFilters = ref(false);

// Modals
const showUploadModal = ref(false);
const showDetailModal = ref(false);
const showVerifyModal = ref(false);
const selectedFile = ref<DigitalFile | null>(null);

// Filters (without file_type since it's predefined)
const filters = reactive<Omit<FileQueryParams, 'file_type'>>({
  verification_status: undefined,
  date_from: undefined,
  date_to: undefined,
  confidential_only: undefined,
  verified_only: undefined
});

// Pagination
const pagination = reactive({
  currentPage: 1,
  perPage: 15,
  total: 0,
  lastPage: 1,
  from: 0,
  to: 0
});

// Load files with medical type filter
const loadFiles = async () => {
  loading.value = true;
  try {
    const params: FileQueryParams = {
      page: pagination.currentPage,
      per_page: pagination.perPage,
      search: searchTerm.value || undefined,
      file_type: MEDICAL_FILE_TYPE,
      ...filters
    };

    // Clean undefined values
    Object.keys(params).forEach(key => {
      if (params[key as keyof FileQueryParams] === undefined ||
          params[key as keyof FileQueryParams] === '' ||
          params[key as keyof FileQueryParams] === false) {
        delete params[key as keyof FileQueryParams];
      }
    });

    const response = await DigitalFileService.getFiles(params);

    if (response.success) {
      files.value = response.data.data;
      pagination.currentPage = response.data.current_page;
      pagination.total = response.data.total;
      pagination.lastPage = response.data.last_page;
      pagination.from = response.data.from || 0;
      pagination.to = response.data.to || 0;
      pagination.perPage = response.data.per_page;
    }
  } catch (error) {
    console.error('Error loading files:', error);
    Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.error'),
      text: t('documents.digitalFiles.swal.uploadError')
    });
  } finally {
    loading.value = false;
  }
};

// Search with debounce
let searchTimeout: any = null;
const handleSearchInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.currentPage = 1;
    loadFiles();
  }, 500);
};

// Filter handling
const handleFilterChange = (newFilters: any) => {
  Object.assign(filters, newFilters);
  pagination.currentPage = 1;
  loadFiles();
};

const clearFilters = () => {
  Object.assign(filters, {
    verification_status: undefined,
    date_from: undefined,
    date_to: undefined,
    confidential_only: undefined,
    verified_only: undefined
  });
  pagination.currentPage = 1;
  loadFiles();
};

// Pagination
const changePage = (page: number) => {
  pagination.currentPage = page;
  loadFiles();
};

const changePerPage = (perPage: number) => {
  pagination.perPage = perPage;
  pagination.currentPage = 1;
  loadFiles();
};

// File actions
const viewFile = (file: DigitalFile) => {
  selectedFile.value = file;
  showDetailModal.value = true;
};

const downloadFile = async (file: DigitalFile) => {
  try {
    await DigitalFileService.downloadFile(file.id, file.original_filename);
  } catch (error) {
    console.error('Error downloading file:', error);
    Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.error'),
      text: t('documents.digitalFiles.swal.downloadError')
    });
  }
};

const openVerifyModal = (file: DigitalFile) => {
  selectedFile.value = file;
  showVerifyModal.value = true;
};

const deleteFile = async (file: DigitalFile) => {
  const result = await Swal.fire({
    title: t('documents.digitalFiles.swal.deleteConfirm'),
    text: t('documents.digitalFiles.swal.deleteConfirmText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: t('common.swal.buttons.yesDelete'),
    cancelButtonText: t('common.swal.buttons.cancel')
  });

  if (result.isConfirmed) {
    try {
      await DigitalFileService.deleteFile(file.id);
      await loadFiles();
      Swal.fire({
        icon: 'success',
        title: t('documents.digitalFiles.swal.deleteSuccess'),
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.swal.titles.error'),
        text: t('documents.digitalFiles.swal.deleteError')
      });
    }
  }
};

// Upload handler
const handleFileUploaded = () => {
  Swal.fire({
    icon: 'success',
    title: t('documents.digitalFiles.swal.uploadSuccess'),
    timer: 2000,
    showConfirmButton: false
  });
  loadFiles();
};

// Verify handler
const handleFileVerified = (file: DigitalFile, status: VerificationStatus) => {
  Swal.fire({
    icon: 'success',
    title: t('documents.digitalFiles.swal.verifySuccess'),
    timer: 2000,
    showConfirmButton: false
  });
  loadFiles();
};

// Initialize
onMounted(() => {
  loadFiles();
});
</script>
