<template>
  <div>
    <div
      class="page-title d-flex flex-column justify-content-center flex-wrap me-3"
    >
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        Sectores
      </h1>
    </div>

    <CatalogList
      catalog-name="Sector"
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
    key: "code",
    label: "Código",
    class: "min-w-100px",
  },
  {
    key: "center.name",
    label: "Centro",
    class: "min-w-150px",
  },
  {
    key: "type",
    label: "Tipo",
    class: "min-w-120px",
    type: "badge",
    badgeMapping: {
      celda: "badge-light-primary",
      dormitorio: "badge-light-info",
      area_comun: "badge-light-warning",
      taller: "badge-light-success",
      educativo: "badge-light-primary",
      medico: "badge-light-danger",
      administrativo: "badge-light-secondary",
      otro: "badge-light-dark",
    },
    displayMapping: {
      celda: "Celda",
      dormitorio: "Dormitorio",
      area_comun: "Área Común",
      taller: "Taller",
      educativo: "Educativo",
      medico: "Médico",
      administrativo: "Administrativo",
      otro: "Otro",
    },
  },
  {
    key: "capacity",
    label: "Capacidad",
    class: "min-w-100px text-center",
  },
  {
    key: "current_population",
    label: "Población",
    class: "min-w-100px text-center",
  },
];

const modalFields: ModalField[] = [
  {
    key: "center_id",
    label: "Centro Penitenciario",
    type: "select",
    required: true,
    options: [],
  },
  {
    key: "name",
    label: "Nombre",
    type: "text",
    required: true,
    placeholder: "Ingrese el nombre del sector",
  },
  {
    key: "code",
    label: "Código",
    type: "text",
    required: true,
    placeholder: "Código único del sector",
  },
  {
    key: "type",
    label: "Tipo",
    type: "select",
    required: true,
    options: [
      { value: "celda", label: "Celda" },
      { value: "dormitorio", label: "Dormitorio" },
      { value: "area_comun", label: "Área Común" },
      { value: "taller", label: "Taller" },
      { value: "educativo", label: "Educativo" },
      { value: "medico", label: "Médico" },
      { value: "administrativo", label: "Administrativo" },
      { value: "otro", label: "Otro" },
    ],
  },
  {
    key: "capacity",
    label: "Capacidad Máxima",
    type: "number",
    required: true,
    placeholder: "0",
  },
  {
    key: "current_population",
    label: "Población Actual",
    type: "number",
    required: true,
    placeholder: "0",
  },
  {
    key: "description",
    label: "Descripción",
    type: "textarea",
    required: false,
    placeholder: "Descripción opcional del sector",
  },
  {
    key: "active",
    label: "Activo",
    type: "checkbox",
    required: true,
  },
];

// Methods
const loadSectors = async (page = 1, search = "") => {
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

    const response = await ApiService.query("/catalogs/sectors", params);

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
    console.error("Error loading sectors:", error);
  } finally {
    loading.value = false;
  }
};

const createItem = async (formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.post("/catalogs/sectors", formData);

    if (response.data.success) {
      await loadSectors(currentPage.value, searchTerm.value);
      modalSuccess.value = true;

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error creating sector:", error);
  }
};

const editItem = async (id: number, formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.put(`/catalogs/sectors/${id}`, formData);

    if (response.data.success) {
      await loadSectors(currentPage.value, searchTerm.value);
      modalSuccess.value = true;

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error updating sector:", error);
  }
};

const deleteItem = async (id: number) => {
  try {
    const response = await ApiService.delete(`/catalogs/sectors/${id}`);

    if (response.data.success) {
      await loadSectors(currentPage.value, searchTerm.value);
    }
  } catch (error) {
    console.error("Error deleting sector:", error);
  }
};

const changePage = (page: number) => {
  currentPage.value = page;
  loadSectors(page, searchTerm.value);
};

const handleSearch = (search: string) => {
  searchTerm.value = search;
  currentPage.value = 1;
  loadSectors(1, search);
};

// Lifecycle
onMounted(async () => {
  // Load centers for select dropdown
  try {
    const response = await ApiService.query("/catalogs/centers", {
      per_page: 1000,
    });
    if (response.data.success) {
      const centerOptions = response.data.data.data.map((center: any) => ({
        value: center.id,
        label: center.name,
      }));
      // Find center field and update options
      const centerField = modalFields.find((f) => f.key === "center_id");
      if (centerField) {
        centerField.options = centerOptions;
      }
    }
  } catch (error) {
    console.error("Error loading centers:", error);
  }

  loadSectors();
});
</script>
