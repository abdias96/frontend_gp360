<template>
  <div>
    <div
      class="page-title d-flex flex-column justify-content-center flex-wrap me-3"
    >
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        Grados Académicos
      </h1>
    </div>

    <CatalogList
      catalog-name="Grado Académico"
      :items="academicDegrees"
      :loading="loading"
      :modal-fields="modalFields"
      :pagination="pagination"
      :modal-success="modalSuccess"
      @create="createAcademicDegree"
      @edit="editAcademicDegree"
      @delete="deleteAcademicDegree"
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
const academicDegrees = ref<CatalogItem[]>([]);
const loading = ref(false);
const pagination = ref<PaginationInfo | null>(null);
const currentPage = ref(1);
const searchTerm = ref("");
const modalSuccess = ref(false);

// Modal configuration
const modalFields: ModalField[] = [
  {
    key: "name",
    label: "Nombre",
    type: "text",
    required: true,
    placeholder: "Ingrese el nombre del grado académico",
  },
  {
    key: "code",
    label: "Código",
    type: "text",
    required: true,
    placeholder: "Ingrese el código del grado académico",
  },
  {
    key: "description",
    label: "Descripción",
    type: "textarea",
    required: false,
    placeholder: "Descripción opcional del grado académico",
  },
  {
    key: "active",
    label: "Activo",
    type: "checkbox",
    required: true,
  },
];

// Methods
const loadAcademicDegrees = async (page = 1, search = "") => {
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
      "/catalogs/academic-degrees",
      params,
    );

    if (response.data.success) {
      academicDegrees.value = response.data.data.data || [];
      pagination.value = {
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        from: response.data.data.from,
        to: response.data.data.to,
        total: response.data.data.total,
      };
    }
  } catch (error) {
    console.error("Error loading academic degrees:", error);
  } finally {
    loading.value = false;
  }
};

const createAcademicDegree = async (formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.post(
      "/catalogs/academic-degrees",
      formData,
    );

    if (response.data.success) {
      await loadAcademicDegrees(currentPage.value, searchTerm.value);
      modalSuccess.value = true;

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error creating academic degree:", error);
  }
};

const editAcademicDegree = async (id: number, formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.put(
      `/catalogs/academic-degrees/${id}`,
      formData,
    );

    if (response.data.success) {
      await loadAcademicDegrees(currentPage.value, searchTerm.value);
      modalSuccess.value = true;

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error updating academic degree:", error);
  }
};

const deleteAcademicDegree = async (id: number) => {
  try {
    const response = await ApiService.delete(
      `/catalogs/academic-degrees/${id}`,
    );

    if (response.data.success) {
      await loadAcademicDegrees(currentPage.value, searchTerm.value);
    }
  } catch (error) {
    console.error("Error deleting academic degree:", error);
  }
};

const changePage = (page: number) => {
  currentPage.value = page;
  loadAcademicDegrees(page, searchTerm.value);
};

const handleSearch = (search: string) => {
  searchTerm.value = search;
  currentPage.value = 1;
  loadAcademicDegrees(1, search);
};

// Lifecycle
onMounted(() => {
  loadAcademicDegrees();
});
</script>
