<template>
  <div>
    <div
      class="page-title d-flex flex-column justify-content-center flex-wrap me-3"
    >
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        Tipos de Beneficio
      </h1>
    </div>

    <CatalogList
      catalog-name="Tipo de Beneficio"
      :items="items"
      :loading="loading"
      :modal-fields="modalFields"
      :pagination="pagination"
      :modal-success="modalSuccess"
      @create="createItem"
      @edit="editItem"
      @delete="deleteItem"
      @page-change="changePage"
      @search="handleSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import CatalogList from "../components/CatalogList.vue";
import type {
  CatalogItem,
  ModalField,
  PaginationInfo,
} from "../components/CatalogList.vue";
import ApiService from "../../../core/services/ApiService";

// Reactive state
const items = ref<CatalogItem[]>([]);
const loading = ref(false);
const pagination = ref<PaginationInfo | null>(null);
const currentPage = ref(1);
const searchTerm = ref("");
const modalSuccess = ref(false);

// Configuration
const modalFields: ModalField[] = [
  {
    key: "name",
    label: "Nombre",
    type: "text",
    required: true,
    placeholder: "Ingrese el nombre del tipo de beneficio",
  },
  {
    key: "code",
    label: "Código",
    type: "text",
    required: true,
    placeholder: "Código único del tipo de beneficio",
  },
  {
    key: "category",
    label: "Categoría",
    type: "select",
    required: true,
    options: [
      { value: "libertad_condicional", label: "Libertad Condicional" },
      { value: "libertad_anticipada", label: "Libertad Anticipada" },
      { value: "prelibertad", label: "Prelibertad" },
      { value: "reduccion_pena", label: "Reducción de Pena" },
      { value: "trabajo_extramuros", label: "Trabajo Extramuros" },
      { value: "estudio_extramuros", label: "Estudio Extramuros" },
      { value: "permisos_especiales", label: "Permisos Especiales" },
      { value: "otros", label: "Otros" },
    ],
  },
  {
    key: "description",
    label: "Descripción",
    type: "textarea",
    required: false,
    placeholder: "Descripción del tipo de beneficio",
  },
  {
    key: "active",
    label: "Activo",
    type: "checkbox",
    required: true,
  },
];

// Methods
const loadItems = async (page = 1, search = "") => {
  loading.value = true;
  try {
    const params: any = {
      page,
      per_page: 15,
      sort_by: "name",
      sort_direction: "asc",
    };

    if (search) {
      params.search = search;
    }

    const response = await ApiService.query("/catalogs/benefit-types", params);

    if (response.data.success) {
      items.value = response.data.data.data || [];
      pagination.value = {
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        from: response.data.data.from,
        to: response.data.data.to,
        total: response.data.data.total,
      };
    }
  } catch (error) {
    console.error("Error loading benefit types:", error);
  } finally {
    loading.value = false;
  }
};

const createItem = async (formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.post("/catalogs/benefit-types", formData);

    if (response.data.success) {
      await loadItems(currentPage.value, searchTerm.value);
      modalSuccess.value = true;

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error creating benefit type:", error);
  }
};

const editItem = async (id: number, formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.put(
      `/catalogs/benefit-types/${id}`,
      formData,
    );

    if (response.data.success) {
      await loadItems(currentPage.value, searchTerm.value);
      modalSuccess.value = true;

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error updating benefit type:", error);
  }
};

const deleteItem = async (id: number) => {
  try {
    const response = await ApiService.delete(`/catalogs/benefit-types/${id}`);

    if (response.data.success) {
      await loadItems(currentPage.value, searchTerm.value);
    }
  } catch (error) {
    console.error("Error deleting benefit type:", error);
  }
};

const changePage = (page: number) => {
  currentPage.value = page;
  loadItems(page, searchTerm.value);
};

const handleSearch = (search: string) => {
  searchTerm.value = search;
  currentPage.value = 1;
  loadItems(1, search);
};

// Lifecycle
onMounted(() => {
  loadItems();
});
</script>
