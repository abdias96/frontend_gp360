<template>
  <div>
    <div
      class="page-title d-flex flex-column justify-content-center flex-wrap me-3"
    >
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        Centros Penitenciarios
      </h1>
    </div>

    <CatalogList
      catalog-name="Centro Penitenciario"
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
    key: "type",
    label: "Tipo",
    class: "min-w-120px",
    type: "badge",
    badgeMapping: {
      preventivo: "badge-light-warning",
      cumplimiento: "badge-light-primary",
      mixto: "badge-light-info",
    },
    displayMapping: {
      preventivo: "Preventivo",
      cumplimiento: "Cumplimiento",
      mixto: "Mixto",
    },
  },
  {
    key: "gender",
    label: "Género",
    class: "min-w-100px",
    type: "badge",
    badgeMapping: {
      M: "badge-light-primary",
      F: "badge-light-danger",
      mixto: "badge-light-secondary",
    },
    displayMapping: {
      M: "Masculino",
      F: "Femenino",
      mixto: "Mixto",
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
    key: "name",
    label: "Nombre",
    type: "text",
    required: true,
    placeholder: "Ingrese el nombre del centro",
  },
  {
    key: "code",
    label: "Código",
    type: "text",
    required: true,
    placeholder: "Código único del centro",
  },
  {
    key: "municipality_id",
    label: "Municipio",
    type: "select",
    required: true,
    options: [],
  },
  {
    key: "address",
    label: "Dirección",
    type: "textarea",
    required: false,
    placeholder: "Dirección del centro",
  },
  {
    key: "phone",
    label: "Teléfono",
    type: "text",
    required: false,
    placeholder: "Teléfono de contacto",
  },
  {
    key: "email",
    label: "Correo Electrónico",
    type: "email",
    required: false,
    placeholder: "correo" + "@" + "ejemplo.com",
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
    key: "type",
    label: "Tipo",
    type: "select",
    required: true,
    options: [
      { value: "preventivo", label: "Preventivo" },
      { value: "cumplimiento", label: "Cumplimiento" },
      { value: "mixto", label: "Mixto" },
    ],
  },
  {
    key: "gender",
    label: "Género Permitido",
    type: "select",
    required: true,
    options: [
      { value: "M", label: "Masculino" },
      { value: "F", label: "Femenino" },
      { value: "mixto", label: "Mixto" },
    ],
  },
  {
    key: "description",
    label: "Descripción",
    type: "textarea",
    required: false,
    placeholder: "Descripción adicional del centro",
  },
  {
    key: "active",
    label: "Activo",
    type: "checkbox",
    required: true,
  },
];

// Methods
const loadCenters = async (page = 1, search = "") => {
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

    const response = await ApiService.query("/catalogs/centers", params);

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
    console.error("Error loading centers:", error);
  } finally {
    loading.value = false;
  }
};

const createItem = async (formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.post("/catalogs/centers", formData);

    if (response.data.success) {
      await loadCenters(currentPage.value, searchTerm.value);
      modalSuccess.value = true;

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error creating center:", error);
  }
};

const editItem = async (id: number, formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.put(`/catalogs/centers/${id}`, formData);

    if (response.data.success) {
      await loadCenters(currentPage.value, searchTerm.value);
      modalSuccess.value = true;

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error updating center:", error);
  }
};

const deleteItem = async (id: number) => {
  try {
    const response = await ApiService.delete(`/catalogs/centers/${id}`);

    if (response.data.success) {
      await loadCenters(currentPage.value, searchTerm.value);
    }
  } catch (error) {
    console.error("Error deleting center:", error);
  }
};

const changePage = (page: number) => {
  currentPage.value = page;
  loadCenters(page, searchTerm.value);
};

const handleSearch = (search: string) => {
  searchTerm.value = search;
  currentPage.value = 1;
  loadCenters(1, search);
};

// Lifecycle
onMounted(async () => {
  // Load municipalities for select dropdown
  try {
    const response = await ApiService.query("/catalogs/municipalities", {
      per_page: 1000,
    });
    if (response.data.success) {
      const municipalityOptions = response.data.data.data.map((mun: any) => ({
        value: mun.id,
        label: mun.name,
      }));
      // Find municipality field and update options
      const munField = modalFields.find((f) => f.key === "municipality_id");
      if (munField) {
        munField.options = municipalityOptions;
      }
    }
  } catch (error) {
    console.error("Error loading municipalities:", error);
  }

  loadCenters();
});
</script>
