<template>
  <div>
    <div
      class="page-title d-flex flex-column justify-content-center flex-wrap me-3"
    >
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        Delitos
      </h1>
    </div>

    <CatalogList
      catalog-name="Delito"
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

// Modal configuration
const modalFields = ref<ModalField[]>([
  {
    key: "name",
    label: "Nombre",
    type: "text",
    required: true,
    placeholder: "Ingrese el nombre del delito",
  },
  {
    key: "code",
    label: "Código",
    type: "text",
    required: true,
    placeholder: "Ingrese el código del delito",
  },
  {
    key: "article",
    label: "Artículo",
    type: "text",
    required: false,
    placeholder: "Artículo del código penal (ej: Art. 123)",
  },
  {
    key: "classification_id",
    label: "Clasificación",
    type: "select",
    required: false,
    options: [],
  },
  {
    key: "min_penalty",
    label: "Pena Mínima (meses)",
    type: "number",
    required: false,
    placeholder: "0",
  },
  {
    key: "max_penalty",
    label: "Pena Máxima (meses)",
    type: "number",
    required: false,
    placeholder: "0",
  },
  {
    key: "description",
    label: "Descripción",
    type: "textarea",
    required: false,
    placeholder: "Descripción opcional del delito",
  },
  {
    key: "active",
    label: "Activo",
    type: "checkbox",
    required: true,
  },
]);

// Methods
const loadCrimes = async (page = 1, search = "") => {
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

    const response = await ApiService.query("/catalogs/crimes", params);

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
    console.error("Error loading crimes:", error);
  } finally {
    loading.value = false;
  }
};

const createItem = async (formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.post("/catalogs/crimes", formData);

    if (response.data.success) {
      await loadCrimes(currentPage.value, searchTerm.value);
      modalSuccess.value = true;

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error creating crime:", error);
  }
};

const editItem = async (id: number, formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.put(`/catalogs/crimes/${id}`, formData);

    if (response.data.success) {
      await loadCrimes(currentPage.value, searchTerm.value);
      modalSuccess.value = true;

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error updating crime:", error);
  }
};

const deleteItem = async (id: number) => {
  try {
    const response = await ApiService.delete(`/catalogs/crimes/${id}`);

    if (response.data.success) {
      await loadCrimes(currentPage.value, searchTerm.value);
    }
  } catch (error) {
    console.error("Error deleting crime:", error);
  }
};

const changePage = (page: number) => {
  currentPage.value = page;
  loadCrimes(page, searchTerm.value);
};

const handleSearch = (search: string) => {
  searchTerm.value = search;
  currentPage.value = 1;
  loadCrimes(1, search);
};

// Load crime classifications for dropdown
const loadClassifications = async () => {
  try {
    const response = await ApiService.query("/catalogs/crime-classifications", {
      active: "Y",
      per_page: 1000,
    });

    if (response.data.success) {
      const classificationOptions = response.data.data.data.map(
        (classification: any) => ({
          value: classification.id,
          label: classification.name,
        }),
      );

      const classificationField = modalFields.value.find(
        (field) => field.key === "classification_id",
      );
      if (classificationField) {
        classificationField.options = classificationOptions;
      }
    }
  } catch (error) {
    console.error("Error loading crime classifications:", error);
  }
};

// Lifecycle
onMounted(async () => {
  await loadClassifications();
  loadCrimes();
});
</script>
