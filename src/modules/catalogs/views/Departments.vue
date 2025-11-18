<template>
  <div>
    <div
      class="page-title d-flex flex-column justify-content-center flex-wrap me-3"
    >
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        Departamentos
      </h1>
    </div>

    <CatalogList
      catalog-name="Departamento"
      :items="departments"
      :loading="loading"
      :modal-fields="modalFields"
      :additional-columns="additionalColumns"
      :pagination="pagination"
      :modal-success="modalSuccess"
      @create="createDepartment"
      @edit="editDepartment"
      @delete="deleteDepartment"
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
const departments = ref<CatalogItem[]>([]);
const countries = ref<Array<{ value: number; label: string }>>([]);
const loading = ref(false);
const pagination = ref<PaginationInfo | null>(null);
const currentPage = ref(1);
const searchTerm = ref("");
const modalSuccess = ref(false);

// Configuration
const additionalColumns: AdditionalColumn[] = [
  {
    key: "country",
    label: "País",
    class: "min-w-125px",
    type: "text",
  },
];

const modalFields = ref<ModalField[]>([
  {
    key: "country_id",
    label: "País",
    type: "select",
    required: true,
    options: [],
  },
  {
    key: "name",
    label: "Nombre",
    type: "text",
    required: true,
    placeholder: "Ingrese el nombre del departamento",
  },
  {
    key: "code",
    label: "Código",
    type: "text",
    required: true,
    placeholder: "Ingrese el código del departamento",
  },
  {
    key: "description",
    label: "Descripción",
    type: "textarea",
    required: false,
    placeholder: "Descripción opcional del departamento",
  },
  {
    key: "active",
    label: "Activo",
    type: "checkbox",
    required: true,
  },
]);

// Methods
const loadCountries = async () => {
  try {
    const response = await ApiService.query("/catalogs/countries", {
      simple: true,
      active: "Y",
    });

    if (response.data.success) {
      const countryOptions = response.data.data.map((country: any) => ({
        value: country.id,
        label: country.name,
      }));

      countries.value = countryOptions;
      const countryField = modalFields.value.find(
        (field) => field.key === "country_id",
      );
      if (countryField) {
        countryField.options = countryOptions;
      }
    }
  } catch (error) {
    console.error("Error loading countries:", error);
  }
};

const loadDepartments = async (page = 1, search = "") => {
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

    const response = await ApiService.query("/catalogs/departments", params);

    if (response.data.success) {
      const transformedData = response.data.data.data.map((dept: any) => ({
        ...dept,
        country: dept.country?.name || "Sin país",
      }));

      departments.value = transformedData;
      pagination.value = {
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        from: response.data.data.from,
        to: response.data.data.to,
        total: response.data.data.total,
      };
    }
  } catch (error) {
    console.error("Error loading departments:", error);
  } finally {
    loading.value = false;
  }
};

const createDepartment = async (formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.post("/catalogs/departments", formData);

    if (response.data.success) {
      await loadDepartments(currentPage.value, searchTerm.value);
      modalSuccess.value = true;

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error creating department:", error);
  }
};

const editDepartment = async (id: number, formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.put(
      `/catalogs/departments/${id}`,
      formData,
    );

    if (response.data.success) {
      await loadDepartments(currentPage.value, searchTerm.value);
      modalSuccess.value = true;

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error updating department:", error);
  }
};

const deleteDepartment = async (id: number) => {
  try {
    const response = await ApiService.delete(`/catalogs/departments/${id}`);

    if (response.data.success) {
      await loadDepartments(currentPage.value, searchTerm.value);
    }
  } catch (error) {
    console.error("Error deleting department:", error);
  }
};

const changePage = (page: number) => {
  currentPage.value = page;
  loadDepartments(page, searchTerm.value);
};

const handleSearch = (search: string) => {
  searchTerm.value = search;
  currentPage.value = 1;
  loadDepartments(1, search);
};

// Lifecycle
onMounted(async () => {
  await loadCountries();
  await loadDepartments();
});
</script>
