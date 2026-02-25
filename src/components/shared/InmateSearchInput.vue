<template>
  <div>
    <label v-if="label" class="fs-6 fw-semibold mb-2" :class="{ required: required }">{{ label }}</label>
    <div v-if="!modelValue" class="position-relative">
      <input
        type="text"
        v-model="searchQuery"
        class="form-control"
        :class="{ 'is-invalid': error }"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="onSearch"
      />
      <div v-if="searching" class="position-absolute end-0 top-50 translate-middle-y me-3">
        <span class="spinner-border spinner-border-sm text-primary"></span>
      </div>
      <!-- Search Results Dropdown -->
      <div v-if="results.length > 0" class="mt-2 border rounded p-2 bg-light-primary" style="max-height: 200px; overflow-y: auto;">
        <div
          v-for="inmate in results"
          :key="inmate.id"
          class="p-2 cursor-pointer hover-bg-light rounded"
          @click="selectInmate(inmate)"
        >
          <span class="text-primary fw-semibold">{{ inmate.inmate_number }}</span>
          <span class="fw-bold ms-2">{{ formatName(inmate) }}</span>
        </div>
      </div>
      <div v-if="error" class="invalid-feedback">{{ error }}</div>
    </div>
    <!-- Selected Inmate Display -->
    <div v-else class="d-flex align-items-center bg-light-success p-3 rounded">
      <i class="ki-duotone ki-profile-user fs-2 me-3 text-success">
        <span class="path1"></span><span class="path2"></span>
        <span class="path3"></span><span class="path4"></span>
      </i>
      <div>
        <div class="fw-bold">{{ modelValue.inmate_number }} - {{ formatName(modelValue) }}</div>
      </div>
      <button
        v-if="!disabled"
        type="button"
        class="btn btn-sm btn-icon btn-light-danger ms-auto"
        @click="clearInmate"
      >
        <i class="ki-duotone ki-cross fs-5">
          <span class="path1"></span><span class="path2"></span>
        </i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ApiService from '@/core/services/ApiService';

interface Props {
  modelValue: any;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Buscar por nombre, DPI o número...',
  disabled: false,
  required: false,
  label: '',
  error: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

const searchQuery = ref('');
const results = ref<any[]>([]);
const searching = ref(false);
let searchTimeout: any = null;

const formatName = (inmate: any) => {
  if (!inmate) return 'N/A';
  // API simple=true returns full_name; detail API returns individual fields
  if (inmate.full_name) return inmate.full_name;
  return [inmate.first_name, inmate.middle_name, inmate.last_name, inmate.second_last_name]
    .filter(Boolean)
    .join(' ');
};

const onSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);

  if (searchQuery.value.length < 2) {
    results.value = [];
    return;
  }

  searchTimeout = setTimeout(async () => {
    searching.value = true;
    try {
      const response = await ApiService.get(
        `/inmates?simple=true&search=${encodeURIComponent(searchQuery.value)}&per_page=20&status=active`
      );
      if (response.data.success) {
        results.value = response.data.data.data || response.data.data;
      }
    } catch (error) {
      console.error('Error searching inmates:', error);
    } finally {
      searching.value = false;
    }
  }, 300);
};

const selectInmate = (inmate: any) => {
  emit('update:modelValue', inmate);
  searchQuery.value = '';
  results.value = [];
};

const clearInmate = () => {
  emit('update:modelValue', null);
};
</script>

<style scoped>
.cursor-pointer { cursor: pointer; }
.hover-bg-light:hover { background-color: var(--bs-gray-200); }
.form-label.required::after { content: " *"; color: #dc3545; }
.invalid-feedback { display: block; }
</style>
