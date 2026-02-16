<template>
  <div>
    <div
      class="page-title d-flex flex-column justify-content-center flex-wrap me-3"
    >
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        Tipos de Emergencia
      </h1>
    </div>

    <CatalogList
      catalog-name="Tipo de Emergencia"
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
const additionalColumns: AdditionalColumn[] = [
  {
    key: "category",
    label: "Categoría",
    class: "min-w-120px",
    type: "badge",
    badgeMapping: {
      security: "badge-light-danger",
      medical: "badge-light-info",
      natural_disaster: "badge-light-warning",
      fire: "badge-light-danger",
      structural: "badge-light-secondary",
      utility_failure: "badge-light-dark",
      riot_disturbance: "badge-light-danger",
      escape: "badge-light-danger",
      hostage: "badge-light-danger",
      external_threat: "badge-light-warning",
      chemical_hazard: "badge-light-warning",
      other: "badge-light-secondary",
    },
    displayMapping: {
      security: "Seguridad",
      medical: "Médica",
      natural_disaster: "Desastre Natural",
      fire: "Incendio",
      structural: "Estructural",
      utility_failure: "Falla de Servicios",
      riot_disturbance: "Motín/Disturbio",
      escape: "Fuga",
      hostage: "Rehenes",
      external_threat: "Amenaza Externa",
      chemical_hazard: "Riesgo Químico",
      other: "Otro",
    },
  },
  {
    key: "severity_level",
    label: "Severidad",
    class: "min-w-100px",
    type: "badge",
    badgeMapping: {
      minor: "badge-light-success",
      moderate: "badge-light-info",
      major: "badge-light-warning",
      critical: "badge-light-danger",
      catastrophic: "badge-danger",
    },
    displayMapping: {
      minor: "Menor",
      moderate: "Moderada",
      major: "Mayor",
      critical: "Crítica",
      catastrophic: "Catastrófica",
    },
  },
];

const modalFields: ModalField[] = [
  {
    key: "name",
    label: "Nombre",
    type: "text",
    required: true,
    placeholder: "Ingrese el nombre del tipo de emergencia",
  },
  {
    key: "code",
    label: "Código",
    type: "text",
    required: true,
    placeholder: "Código único del tipo de emergencia",
  },
  {
    key: "category",
    label: "Categoría",
    type: "select",
    required: true,
    options: [
      { value: "security", label: "Seguridad" },
      { value: "medical", label: "Médica" },
      { value: "natural_disaster", label: "Desastre Natural" },
      { value: "fire", label: "Incendio" },
      { value: "structural", label: "Estructural" },
      { value: "utility_failure", label: "Falla de Servicios" },
      { value: "riot_disturbance", label: "Motín/Disturbio" },
      { value: "escape", label: "Fuga" },
      { value: "hostage", label: "Rehenes" },
      { value: "external_threat", label: "Amenaza Externa" },
      { value: "chemical_hazard", label: "Riesgo Químico" },
      { value: "other", label: "Otro" },
    ],
  },
  {
    key: "severity_level",
    label: "Severidad",
    type: "select",
    required: false,
    options: [
      { value: "minor", label: "Menor" },
      { value: "moderate", label: "Moderada" },
      { value: "major", label: "Mayor" },
      { value: "critical", label: "Crítica" },
      { value: "catastrophic", label: "Catastrófica" },
    ],
  },
  {
    key: "description",
    label: "Descripción",
    type: "textarea",
    required: false,
    placeholder: "Descripción del tipo de emergencia",
  },
  {
    key: "active",
    label: "Activo",
    type: "checkbox",
    required: true,
  },
];

// Transform API data (is_active boolean → active Y/N for CatalogList)
const transformFromApi = (data: any[]): CatalogItem[] => {
  return data.map((item: any) => ({
    ...item,
    active: item.is_active ? "Y" : "N",
  }));
};

// Transform form data (active Y/N → is_active boolean for API)
const prepareData = (formData: any) => {
  const { active, ...rest } = formData;
  return {
    ...rest,
    is_active: active === "Y",
  };
};

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
      "/catalogs/emergency-types",
      params,
    );

    if (response.data.success) {
      items.value = transformFromApi(response.data.data.data || []);
      pagination.value = {
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        from: response.data.data.from,
        to: response.data.data.to,
        total: response.data.data.total,
      };
    }
  } catch (error) {
    console.error("Error loading emergency types:", error);
  } finally {
    loading.value = false;
  }
};

const createItem = async (formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.post(
      "/catalogs/emergency-types",
      prepareData(formData),
    );

    if (response.data.success) {
      await loadItems(currentPage.value, searchTerm.value);
      modalSuccess.value = true;

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error creating emergency type:", error);
  }
};

const editItem = async (id: number, formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.put(
      `/catalogs/emergency-types/${id}`,
      prepareData(formData),
    );

    if (response.data.success) {
      await loadItems(currentPage.value, searchTerm.value);
      modalSuccess.value = true;

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error updating emergency type:", error);
  }
};

const deleteItem = async (id: number) => {
  try {
    const response = await ApiService.delete(
      `/catalogs/emergency-types/${id}`,
    );

    if (response.data.success) {
      await loadItems(currentPage.value, searchTerm.value);
    }
  } catch (error) {
    console.error("Error deleting emergency type:", error);
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
