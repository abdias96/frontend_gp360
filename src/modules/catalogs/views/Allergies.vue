<template>
  <div>
    <div
      class="page-title d-flex flex-column justify-content-center flex-wrap me-3"
    >
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        Alergias
      </h1>
    </div>

    <CatalogList
      catalog-name="Alergia"
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
    placeholder: "Ingrese el nombre de la alergia",
  },
  {
    key: "code",
    label: "Código",
    type: "text",
    required: true,
    placeholder: "Código único de la alergia",
  },
  {
    key: "type",
    label: "Tipo",
    type: "select",
    required: true,
    options: [
      { value: "alimento", label: "Alimentaria" },
      { value: "medicamento", label: "Medicamentos" },
      { value: "ambiental", label: "Ambiental" },
      { value: "contacto", label: "Contacto" },
      { value: "otro", label: "Otros" },
    ],
  },
  {
    key: "severity",
    label: "Severidad",
    type: "select",
    required: true,
    options: [
      { value: "leve", label: "Leve" },
      { value: "moderada", label: "Moderada" },
      { value: "severa", label: "Severa" },
    ],
  },
  {
    key: "symptoms",
    label: "Síntomas",
    type: "textarea",
    required: false,
    placeholder: "Síntomas de la alergia",
  },
  {
    key: "treatment",
    label: "Tratamiento",
    type: "textarea",
    required: false,
    placeholder: "Tratamiento recomendado",
  },
  {
    key: "description",
    label: "Descripción",
    type: "textarea",
    required: false,
    placeholder: "Descripción de la alergia",
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

    const response = await ApiService.query("/catalogs/allergies", params);

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
    console.error("Error loading allergies:", error);
  } finally {
    loading.value = false;
  }
};

const createItem = async (formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.post("/catalogs/allergies", formData);

    if (response.data.success) {
      await loadItems(currentPage.value, searchTerm.value);
      modalSuccess.value = true;

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error creating allergy:", error);
  }
};

const editItem = async (id: number, formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.put(
      `/catalogs/allergies/${id}`,
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
    console.error("Error updating allergy:", error);
  }
};

const deleteItem = async (id: number) => {
  try {
    const response = await ApiService.delete(`/catalogs/allergies/${id}`);

    if (response.data.success) {
      await loadItems(currentPage.value, searchTerm.value);
    }
  } catch (error) {
    console.error("Error deleting allergy:", error);
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
