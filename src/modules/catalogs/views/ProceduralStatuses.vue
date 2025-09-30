<template>
  <div>
    <div
      class="page-title d-flex flex-column justify-content-center flex-wrap me-3"
    >
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        Estados Procesales
      </h1>
    </div>

    <CatalogList
      catalog-name="Estado Procesal"
      :items="items"
      :loading="loading"
      :modal-fields="modalFields"
      :additional-columns="additionalColumns"
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
  AdditionalColumn,
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
// Note: 'stage' column temporarily removed until migration is executed
const additionalColumns: AdditionalColumn[] = [
  // Uncomment after running migration:
  {
    key: "stage",
    label: "Etapa",
    class: "min-w-120px",
    type: "badge",
    badgeMapping: {
      investigacion: "badge-light-info",
      instruccion: "badge-light-warning",
      juicio: "badge-light-primary",
      sentencia: "badge-light-success",
      apelacion: "badge-light-secondary",
      casacion: "badge-light-dark",
    },
    displayMapping: {
      investigacion: "Investigación",
      instruccion: "Instrucción",
      juicio: "Juicio",
      sentencia: "Sentencia",
      apelacion: "Apelación",
      casacion: "Casación",
    },
  },
];

const modalFields: ModalField[] = [
  {
    key: "name",
    label: "Nombre",
    type: "text",
    required: true,
    placeholder: "Ingrese el nombre del estado procesal",
  },
  {
    key: "code",
    label: "Código",
    type: "text",
    required: true,
    placeholder: "Código único del estado procesal",
  },
  // Note: 'stage' field temporarily removed until migration is executed
  // Uncomment after running migration:
  {
    key: "stage",
    label: "Etapa Procesal",
    type: "select",
    required: true,
    options: [
      { value: "investigacion", label: "Investigación" },
      { value: "instruccion", label: "Instrucción" },
      { value: "juicio", label: "Juicio" },
      { value: "sentencia", label: "Sentencia" },
      { value: "apelacion", label: "Apelación" },
      { value: "casacion", label: "Casación" },
    ],
  },
  {
    key: "description",
    label: "Descripción",
    type: "textarea",
    required: false,
    placeholder: "Descripción del estado procesal",
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

    const response = await ApiService.query(
      "/catalogs/procedural-statuses",
      params,
    );

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
    console.error("Error loading procedural statuses:", error);
  } finally {
    loading.value = false;
  }
};

const createItem = async (formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.post(
      "/catalogs/procedural-statuses",
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
    console.error("Error creating procedural status:", error);
  }
};

const editItem = async (id: number, formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.put(
      `/catalogs/procedural-statuses/${id}`,
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
    console.error("Error updating procedural status:", error);
  }
};

const deleteItem = async (id: number) => {
  try {
    const response = await ApiService.delete(
      `/catalogs/procedural-statuses/${id}`,
    );

    if (response.data.success) {
      await loadItems(currentPage.value, searchTerm.value);
    }
  } catch (error) {
    console.error("Error deleting procedural status:", error);
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
