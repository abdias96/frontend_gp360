<template>
  <div class="position-relative">
    <label :for="inputId" class="form-label" :class="{ required: required }">{{ label }}</label>

    <!-- Selected inmate -->
    <div v-if="modelValue" class="alert alert-light-primary d-flex align-items-center mb-0 py-3">
      <i class="fas fa-user-check text-primary fs-2 me-3"></i>
      <div class="flex-grow-1">
        <div class="fw-bold">{{ modelValue.full_name }}</div>
        <div class="text-muted fs-7">
          DPI: {{ modelValue.document_number || 'Sin documento' }}
          <span v-if="modelValue.inmate_number"> | Registro: {{ modelValue.inmate_number }}</span>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-sm btn-light-danger"
        aria-label="Quitar selección"
        @click="clearSelection"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>

    <!-- Search input -->
    <template v-else>
      <div class="input-group">
        <span class="input-group-text"><i class="fas fa-search"></i></span>
        <input
          :id="inputId"
          v-model="searchQuery"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': !!error }"
          placeholder="DPI, nombre o número de registro..."
          autocomplete="off"
          @input="onInput"
        >
        <span v-if="searching" class="input-group-text">
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        </span>
      </div>
      <div v-if="error" class="invalid-feedback d-block">{{ error }}</div>

      <!-- Results dropdown -->
      <div
        v-if="results.length"
        class="list-group position-absolute w-100 shadow-sm mt-1"
        style="z-index: 1060; max-height: 260px; overflow-y: auto;"
      >
        <button
          v-for="inmate in results"
          :key="inmate.id"
          type="button"
          class="list-group-item list-group-item-action"
          @click="selectInmate(inmate)"
        >
          <div class="fw-bold">{{ inmate.full_name }}</div>
          <div class="text-muted fs-7">
            DPI: {{ inmate.document_number || 'Sin documento' }}
            <span v-if="inmate.inmate_number"> | Registro: {{ inmate.inmate_number }}</span>
          </div>
        </button>
      </div>
      <div
        v-else-if="searched && !searching && searchQuery.length >= 2"
        class="form-text text-muted"
      >
        No se encontraron PPL con ese criterio.
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import apiClient from '@/services/api/apiClient'

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
  label: {
    type: String,
    default: 'Buscar PPL'
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const inputId = `inmate-search-${Math.random().toString(36).slice(2, 9)}`
const searchQuery = ref('')
const results = ref([])
const searching = ref(false)
const searched = ref(false)

let searchTimeout = null

const onInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searched.value = false

  if (searchQuery.value.trim().length < 2) {
    results.value = []
    return
  }

  searchTimeout = setTimeout(async () => {
    searching.value = true
    try {
      const response = await apiClient.get('/inmates', {
        params: {
          simple: true,
          search: searchQuery.value.trim(),
          per_page: 8
        }
      })
      results.value = response.data?.data || []
    } catch (e) {
      console.error('Error buscando PPL:', e)
      results.value = []
    } finally {
      searching.value = false
      searched.value = true
    }
  }, 300)
}

const selectInmate = (inmate) => {
  emit('update:modelValue', inmate)
  searchQuery.value = ''
  results.value = []
  searched.value = false
}

const clearSelection = () => {
  emit('update:modelValue', null)
}
</script>
