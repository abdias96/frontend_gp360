<template>
  <div class="card card-flush mb-5" v-if="expanded">
    <div class="card-header min-h-50px">
      <h5 class="card-title fw-bold">{{ $t('documents.digitalFiles.filters.title') }}</h5>
      <div class="card-toolbar">
        <button
          type="button"
          class="btn btn-sm btn-icon btn-active-light-primary"
          @click="$emit('toggle')"
        >
          <i class="ki-duotone ki-cross fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
        </button>
      </div>
    </div>
    <div class="card-body pt-0">
      <div class="row g-4">
        <!-- File Type Filter -->
        <div class="col-md-3" v-if="showTypeFilter">
          <label class="form-label">{{ $t('documents.digitalFiles.filters.fileType') }}</label>
          <select
            v-model="localFilters.file_type"
            class="form-select form-select-solid"
            @change="emitChange"
          >
            <option value="">{{ $t('documents.digitalFiles.fileTypes.all') }}</option>
            <option v-for="type in availableTypes" :key="type" :value="type">
              {{ $t(`documents.digitalFiles.fileTypes.${type}`) }}
            </option>
          </select>
        </div>

        <!-- Verification Status Filter -->
        <div class="col-md-3">
          <label class="form-label">{{ $t('documents.digitalFiles.filters.status') }}</label>
          <select
            v-model="localFilters.verification_status"
            class="form-select form-select-solid"
            @change="emitChange"
          >
            <option value="">{{ $t('documents.digitalFiles.verificationStatus.all') }}</option>
            <option value="pending">{{ $t('documents.digitalFiles.verificationStatus.pending') }}</option>
            <option value="verified">{{ $t('documents.digitalFiles.verificationStatus.verified') }}</option>
            <option value="rejected">{{ $t('documents.digitalFiles.verificationStatus.rejected') }}</option>
          </select>
        </div>

        <!-- Date From -->
        <div class="col-md-3">
          <label class="form-label">{{ $t('documents.digitalFiles.filters.dateFrom') }}</label>
          <input
            type="date"
            v-model="localFilters.date_from"
            class="form-control form-control-solid"
            @change="emitChange"
          />
        </div>

        <!-- Date To -->
        <div class="col-md-3">
          <label class="form-label">{{ $t('documents.digitalFiles.filters.dateTo') }}</label>
          <input
            type="date"
            v-model="localFilters.date_to"
            class="form-control form-control-solid"
            @change="emitChange"
          />
        </div>

        <!-- Confidential Only Checkbox -->
        <div class="col-md-3">
          <div class="form-check form-check-custom form-check-solid mt-8">
            <input
              type="checkbox"
              class="form-check-input"
              id="confidentialOnly"
              v-model="localFilters.confidential_only"
              @change="emitChange"
            />
            <label class="form-check-label" for="confidentialOnly">
              {{ $t('documents.digitalFiles.filters.confidentialOnly') }}
            </label>
          </div>
        </div>

        <!-- Verified Only Checkbox -->
        <div class="col-md-3">
          <div class="form-check form-check-custom form-check-solid mt-8">
            <input
              type="checkbox"
              class="form-check-input"
              id="verifiedOnly"
              v-model="localFilters.verified_only"
              @change="emitChange"
            />
            <label class="form-check-label" for="verifiedOnly">
              {{ $t('documents.digitalFiles.filters.verifiedOnly') }}
            </label>
          </div>
        </div>

        <!-- Clear Filters Button -->
        <div class="col-md-6 d-flex align-items-end justify-content-end">
          <button
            type="button"
            class="btn btn-sm btn-light-danger"
            @click="clearFilters"
          >
            <i class="ki-duotone ki-trash fs-5 me-1">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
              <span class="path4"></span>
              <span class="path5"></span>
            </i>
            {{ $t('documents.digitalFiles.filters.clearFilters') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { FileType, VerificationStatus } from '@/types/documents';

interface FilterValues {
  file_type?: FileType | '';
  verification_status?: VerificationStatus | '';
  date_from?: string;
  date_to?: string;
  confidential_only?: boolean;
  verified_only?: boolean;
}

const props = withDefaults(defineProps<{
  expanded?: boolean;
  showTypeFilter?: boolean;
  defaultTypes?: FileType[];
  filters?: FilterValues;
}>(), {
  expanded: false,
  showTypeFilter: true,
  defaultTypes: () => ['legal', 'medical', 'administrative', 'identification', 'judicial']
});

const emit = defineEmits<{
  (e: 'toggle'): void;
  (e: 'change', filters: FilterValues): void;
  (e: 'clear'): void;
}>();

const availableTypes = ref<FileType[]>(props.defaultTypes);

const localFilters = ref<FilterValues>({
  file_type: props.filters?.file_type || '',
  verification_status: props.filters?.verification_status || '',
  date_from: props.filters?.date_from || '',
  date_to: props.filters?.date_to || '',
  confidential_only: props.filters?.confidential_only || false,
  verified_only: props.filters?.verified_only || false
});

watch(() => props.filters, (newFilters) => {
  if (newFilters) {
    localFilters.value = {
      file_type: newFilters.file_type || '',
      verification_status: newFilters.verification_status || '',
      date_from: newFilters.date_from || '',
      date_to: newFilters.date_to || '',
      confidential_only: newFilters.confidential_only || false,
      verified_only: newFilters.verified_only || false
    };
  }
}, { deep: true });

const emitChange = () => {
  emit('change', { ...localFilters.value });
};

const clearFilters = () => {
  localFilters.value = {
    file_type: '',
    verification_status: '',
    date_from: '',
    date_to: '',
    confidential_only: false,
    verified_only: false
  };
  emit('clear');
};
</script>
