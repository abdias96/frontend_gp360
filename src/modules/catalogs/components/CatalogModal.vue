<template>
  <div
    v-if="show"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">{{ title }}</h2>
          <div
            class="btn btn-icon btn-sm btn-active-icon-primary"
            @click="closeModal"
          >
            <i class="ki-duotone ki-cross fs-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
        </div>

        <form @submit.prevent="submitForm">
          <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
            <div v-for="field in fields" :key="field.key" class="mb-7">
              <!-- Text Input -->
              <div v-if="field.type === 'text'" class="fv-row">
                <label :for="field.key" class="required fw-semibold fs-6 mb-2">
                  {{ field.label }}
                </label>
                <input
                  :id="field.key"
                  v-model="formData[field.key]"
                  type="text"
                  class="form-control form-control-solid mb-3 mb-lg-0"
                  :placeholder="field.placeholder || field.label"
                  :required="field.required"
                />
              </div>

              <!-- Number Input -->
              <div v-else-if="field.type === 'number'" class="fv-row">
                <label :for="field.key" class="required fw-semibold fs-6 mb-2">
                  {{ field.label }}
                </label>
                <input
                  :id="field.key"
                  v-model.number="formData[field.key]"
                  type="number"
                  class="form-control form-control-solid mb-3 mb-lg-0"
                  :placeholder="field.placeholder || field.label"
                  :required="field.required"
                  min="0"
                />
              </div>

              <!-- Email Input -->
              <div v-else-if="field.type === 'email'" class="fv-row">
                <label :for="field.key" class="fw-semibold fs-6 mb-2">
                  {{ field.label }}
                </label>
                <input
                  :id="field.key"
                  v-model="formData[field.key]"
                  type="email"
                  class="form-control form-control-solid mb-3 mb-lg-0"
                  :placeholder="field.placeholder || field.label"
                  :required="field.required"
                />
              </div>

              <!-- Textarea -->
              <div v-else-if="field.type === 'textarea'" class="fv-row">
                <label :for="field.key" class="fw-semibold fs-6 mb-2">
                  {{ field.label }}
                </label>
                <textarea
                  :id="field.key"
                  v-model="formData[field.key]"
                  class="form-control form-control-solid"
                  rows="3"
                  :placeholder="field.placeholder || field.label"
                  :required="field.required"
                ></textarea>
              </div>

              <!-- Select -->
              <div v-else-if="field.type === 'select'" class="fv-row">
                <label :for="field.key" class="required fw-semibold fs-6 mb-2">
                  {{ field.label }}
                </label>
                <select
                  :id="field.key"
                  v-model="formData[field.key]"
                  class="form-select form-select-solid"
                  :required="field.required"
                  @change="handleSelectChange(field.key, $event)"
                >
                  <option value="">
                    Seleccione {{ field.label.toLowerCase() }}
                  </option>
                  <option
                    v-for="option in field.options"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <!-- Checkbox -->
              <div v-else-if="field.type === 'checkbox'" class="fv-row">
                <div
                  class="form-check form-switch form-check-custom form-check-solid"
                >
                  <input
                    :id="field.key"
                    :checked="formData[field.key] === 'Y'"
                    @change="handleCheckboxChange(field.key, $event)"
                    class="form-check-input"
                    type="checkbox"
                  />
                  <label
                    :for="field.key"
                    class="form-check-label fw-semibold fs-6 ms-1"
                  >
                    {{ field.label }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-light me-3"
              @click="closeModal"
              :disabled="loading"
            >
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{ loading ? "Guardando..." : "Guardar" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { ModalField, CatalogItem } from "./CatalogList.vue";

interface Props {
  show?: boolean;
  title: string;
  item?: CatalogItem | null;
  fields: ModalField[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  item: null,
  loading: false,
});

const emit = defineEmits<{
  close: [];
  submit: [formData: Record<string, any>];
  fieldChange: [fieldKey: string, value: any];
}>();

// Reactive state
const formData = ref<Record<string, any>>({});

// Methods
const initializeFormData = () => {
  const data: Record<string, any> = {};

  props.fields.forEach((field) => {
    if (props.item && props.item[field.key] !== undefined) {
      data[field.key] = props.item[field.key];
    } else {
      // Set default values based on field type
      switch (field.type) {
        case "checkbox":
          data[field.key] = "Y"; // Default to active
          break;
        case "select":
          data[field.key] = "";
          break;
        case "number":
          data[field.key] = 0;
          break;
        default:
          data[field.key] = "";
      }
    }
  });

  formData.value = data;
};

const handleCheckboxChange = (fieldKey: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  formData.value[fieldKey] = target.checked ? "Y" : "N";
};

const handleSelectChange = (fieldKey: string, event: Event) => {
  const target = event.target as HTMLSelectElement;
  formData.value[fieldKey] = target.value;
  emit("fieldChange", fieldKey, target.value);
};

const closeModal = () => {
  emit("close");
};

const submitForm = () => {
  emit("submit", { ...formData.value });
};

// Watchers
watch(
  () => props.item,
  () => {
    initializeFormData();
  },
  { immediate: true },
);

watch(
  () => props.show,
  (newShow) => {
    if (newShow) {
      initializeFormData();
    }
  },
);

// Watch for form data changes and emit field change events
watch(
  formData,
  (newData, oldData) => {
    if (oldData) {
      // Find which field changed
      for (const key in newData) {
        if (newData[key] !== oldData[key]) {
          emit("fieldChange", key, newData[key]);
        }
      }
    }
  },
  { deep: true },
);
</script>
