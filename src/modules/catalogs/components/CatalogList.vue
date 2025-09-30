<template>
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title">
        <!--begin::Search-->
        <div class="d-flex align-items-center position-relative my-1">
          <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <input
            type="text"
            v-model="searchTerm"
            class="form-control form-control-solid w-250px ps-13"
            :placeholder="`Buscar ${catalogName.toLowerCase()}...`"
          />
        </div>
        <!--end::Search-->
      </div>
      <!--begin::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div class="d-flex justify-content-end">
          <!--begin::Add button-->
          <button
            type="button"
            class="btn btn-primary"
            @click="showCreateModal = true"
          >
            <i class="ki-duotone ki-plus fs-2"></i>
            Agregar {{ catalogName }}
          </button>
          <!--end::Add button-->
        </div>
        <!--end::Toolbar-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body py-4">
      <!--begin::Loading-->
      <div v-if="loading" class="d-flex justify-content-center py-10">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>
      <!--end::Loading-->

      <!--begin::Table-->
      <div v-else class="table-responsive">
        <table class="table align-middle table-row-dashed fs-6 gy-5">
          <!--begin::Table head-->
          <thead>
            <tr class="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
              <th class="min-w-125px">Nombre</th>
              <th v-if="showDescription" class="min-w-200px">Descripción</th>
              <th
                v-for="column in additionalColumns"
                :key="column.key"
                :class="column.class"
              >
                {{ column.label }}
              </th>
              <th class="min-w-100px">Estado</th>
              <th class="text-end min-w-100px">Acciones</th>
            </tr>
          </thead>
          <!--end::Table head-->

          <!--begin::Table body-->
          <tbody class="text-gray-600 fw-semibold">
            <tr v-for="item in filteredItems" :key="item.id">
              <!--begin::Name-->
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800 text-hover-primary mb-1">
                    {{ item.name }}
                  </span>
                </div>
              </td>
              <!--end::Name-->

              <!--begin::Description-->
              <td v-if="showDescription">
                <span class="text-muted">
                  {{ item.description || "Sin descripción" }}
                </span>
              </td>
              <!--end::Description-->

              <!--begin::Additional columns-->
              <td v-for="column in additionalColumns" :key="column.key">
                <span
                  v-if="column.type === 'badge'"
                  class="badge"
                  :class="getBadgeClass(item[column.key], column.badgeMapping)"
                >
                  {{ getDisplayValue(item[column.key], column) }}
                </span>
                <span v-else>
                  {{ getDisplayValue(item[column.key], column) }}
                </span>
              </td>
              <!--end::Additional columns-->

              <!--begin::Status-->
              <td>
                <div class="badge" :class="getStatusClass(item.active)">
                  {{ item.active === "Y" ? "Activo" : "Inactivo" }}
                </div>
              </td>
              <!--end::Status-->

              <!--begin::Action-->
              <td class="text-end">
                <div class="d-flex justify-content-end flex-shrink-0">
                  <button
                    class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                    @click="editItem(item)"
                    title="Editar"
                  >
                    <i class="ki-duotone ki-pencil fs-5">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </button>
                  <button
                    class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                    @click="deleteItem(item)"
                    title="Eliminar"
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
              <!--end::Action-->
            </tr>
          </tbody>
          <!--end::Table body-->
        </table>
      </div>
      <!--end::Table-->

      <!--begin::Pagination-->
      <div
        v-if="pagination && pagination.last_page > 1"
        class="d-flex justify-content-between align-items-center mt-5"
      >
        <div class="text-muted">
          Mostrando {{ pagination.from }} a {{ pagination.to }} de
          {{ pagination.total }} resultados
        </div>
        <nav>
          <ul class="pagination">
            <li
              class="page-item"
              :class="{ disabled: pagination.current_page === 1 }"
            >
              <button
                class="page-link"
                @click="changePage(pagination.current_page - 1)"
              >
                Anterior
              </button>
            </li>
            <li
              v-for="page in visiblePages"
              :key="page"
              class="page-item"
              :class="{ active: page === pagination.current_page }"
            >
              <button class="page-link" @click="changePage(page)">
                {{ page }}
              </button>
            </li>
            <li
              class="page-item"
              :class="{
                disabled: pagination.current_page === pagination.last_page,
              }"
            >
              <button
                class="page-link"
                @click="changePage(pagination.current_page + 1)"
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <!--end::Pagination-->
    </div>
    <!--end::Card body-->
  </div>

  <!-- Create/Edit Modal -->
  <CatalogModal
    v-if="showCreateModal || showEditModal"
    :show="showCreateModal || showEditModal"
    :title="modalTitle"
    :item="selectedItem"
    :fields="modalFields"
    :loading="modalLoading"
    @close="closeModal"
    @submit="submitForm"
    @fieldChange="handleFieldChange"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import CatalogModal from "./CatalogModal.vue";

export interface CatalogItem {
  id: number;
  name: string;
  description?: string;
  active: "Y" | "N";
  [key: string]: any;
}

export interface AdditionalColumn {
  key: string;
  label: string;
  class?: string;
  type?: "text" | "badge";
  badgeMapping?: Record<string, string>;
  displayMapping?: Record<string, string>;
}

export interface ModalField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "checkbox" | "number" | "email";
  required?: boolean;
  options?: Array<{ value: any; label: string }>;
  placeholder?: string;
}

export interface PaginationInfo {
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
}

interface Props {
  catalogName: string;
  items?: CatalogItem[];
  loading?: boolean;
  showDescription?: boolean;
  additionalColumns?: AdditionalColumn[];
  modalFields: ModalField[];
  pagination?: PaginationInfo | null;
  modalSuccess?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  loading: false,
  showDescription: true,
  additionalColumns: () => [],
  pagination: null,
  modalSuccess: false,
});

const emit = defineEmits<{
  create: [formData: any];
  edit: [id: number, formData: any];
  delete: [id: number];
  "page-change": [page: number];
  search: [searchTerm: string];
  "field-change": [fieldKey: string, value: any];
}>();

// Reactive state
const searchTerm = ref("");
const showCreateModal = ref(false);
const showEditModal = ref(false);
const selectedItem = ref<CatalogItem | null>(null);
const modalLoading = ref(false);

// Computed properties
const filteredItems = computed(() => {
  return props.items;
});

const modalTitle = computed(() => {
  return showCreateModal.value
    ? `Agregar ${props.catalogName}`
    : `Editar ${props.catalogName}`;
});

const visiblePages = computed(() => {
  if (!props.pagination) return [];
  const current = props.pagination.current_page;
  const last = props.pagination.last_page;
  const delta = 2;
  const range = [];
  const rangeWithDots = [];

  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(last - 1, current + delta);
    i++
  ) {
    range.push(i);
  }

  if (current - delta > 2) {
    rangeWithDots.push(1, "...");
  } else {
    rangeWithDots.push(1);
  }

  rangeWithDots.push(...range);

  if (current + delta < last - 1) {
    rangeWithDots.push("...", last);
  } else if (last > 1) {
    rangeWithDots.push(last);
  }

  return rangeWithDots;
});

// Methods
const getStatusClass = (status: string) => {
  return status === "Y" ? "badge-light-success" : "badge-light-danger";
};

const getBadgeClass = (value: any, mapping?: Record<string, string>) => {
  if (!mapping) return "badge-light-secondary";
  return mapping[value] || "badge-light-secondary";
};

const getDisplayValue = (value: any, column: AdditionalColumn) => {
  if (column.displayMapping && column.displayMapping[value]) {
    return column.displayMapping[value];
  }
  return value;
};

const editItem = (item: CatalogItem) => {
  selectedItem.value = { ...item };
  showEditModal.value = true;
};

const deleteItem = (item: CatalogItem) => {
  if (confirm(`¿Está seguro de que desea eliminar "${item.name}"?`)) {
    emit("delete", item.id);
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  selectedItem.value = null;
  modalLoading.value = false;
};

const submitForm = (formData: any) => {
  modalLoading.value = true;
  if (showEditModal.value) {
    emit("edit", selectedItem.value!.id, formData);
  } else {
    emit("create", formData);
  }
};

const handleFieldChange = (fieldKey: string, value: any) => {
  emit("field-change", fieldKey, value);
};

const changePage = (page: number) => {
  if (props.pagination && page >= 1 && page <= props.pagination.last_page) {
    emit("page-change", page);
  }
};

// Watchers
let searchTimeout: NodeJS.Timeout;
watch(searchTerm, (newValue) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    emit("search", newValue);
  }, 300);
});

watch(
  () => props.modalSuccess,
  (success) => {
    if (success && modalLoading.value) {
      closeModal();
    }
  },
);
</script>
