<template>
  <div>
    <div
      class="page-title d-flex flex-column justify-content-center flex-wrap me-3"
    >
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        Juzgados
      </h1>
    </div>

    <CatalogList
      catalog-name="Juzgado"
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
      primera_instancia: "badge-light-primary",
      apelacion: "badge-light-warning",
      casacion: "badge-light-info",
      suprema: "badge-light-success",
      especial: "badge-light-secondary",
    },
    displayMapping: {
      primera_instancia: "Primera Instancia",
      apelacion: "Apelación",
      casacion: "Casación",
      suprema: "Suprema",
      especial: "Especial",
    },
  },
  {
    key: "municipality.name",
    label: "Municipio",
    class: "min-w-150px",
  },
];

const modalFields: ModalField[] = [
  {
    key: "name",
    label: "Nombre",
    type: "text",
    required: true,
    placeholder: "Ingrese el nombre del juzgado",
  },
  {
    key: "code",
    label: "Código",
    type: "text",
    required: true,
    placeholder: "Código único del juzgado",
  },
  {
    key: "type",
    label: "Tipo",
    type: "select",
    required: true,
    options: [
      { value: "primera_instancia", label: "Primera Instancia" },
      { value: "apelacion", label: "Apelación" },
      { value: "casacion", label: "Casación" },
      { value: "suprema", label: "Suprema" },
      { value: "especial", label: "Especial" },
    ],
  },
  {
    key: "municipality_id",
    label: "Municipio",
    type: "select",
    required: true,
    options: [],
  },
  {
    key: "description",
    label: "Descripción",
    type: "textarea",
    required: false,
    placeholder: "Descripción adicional del juzgado",
  },
  {
    key: "active",
    label: "Activo",
    type: "checkbox",
    required: true,
  },
];

// Methods
const loadCourts = async (page = 1, search = "") => {
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

    const response = await ApiService.query("/catalogs/courts", params);

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
    console.error("Error loading courts:", error);
  } finally {
    loading.value = false;
  }
};

const createItem = async (formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.post("/catalogs/courts", formData);

    if (response.data.success) {
      await loadCourts(currentPage.value, searchTerm.value);
      modalSuccess.value = true;

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error creating court:", error);
  }
};

const editItem = async (id: number, formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.put(`/catalogs/courts/${id}`, formData);

    if (response.data.success) {
      await loadCourts(currentPage.value, searchTerm.value);
      modalSuccess.value = true;

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error updating court:", error);
  }
};

const deleteItem = async (id: number) => {
  try {
    const response = await ApiService.delete(`/catalogs/courts/${id}`);

    if (response.data.success) {
      await loadCourts(currentPage.value, searchTerm.value);
    }
  } catch (error) {
    console.error("Error deleting court:", error);
  }
};

const changePage = (page: number) => {
  currentPage.value = page;
  loadCourts(page, searchTerm.value);
};

const handleSearch = (search: string) => {
  searchTerm.value = search;
  currentPage.value = 1;
  loadCourts(1, search);
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

  loadCourts();
});
</script>
