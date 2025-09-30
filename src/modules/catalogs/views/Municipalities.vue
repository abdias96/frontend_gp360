<template>
  <div>
    <div
      class="page-title d-flex flex-column justify-content-center flex-wrap me-3"
    >
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        Municipios
      </h1>
    </div>

    <CatalogList
      catalog-name="Municipio"
      :items="municipalities"
      :loading="loading"
      :modal-fields="modalFields"
      :additional-columns="additionalColumns"
      :pagination="pagination"
      :modal-success="modalSuccess"
      @create="createMunicipality"
      @edit="editMunicipality"
      @delete="deleteMunicipality"
      @page-change="changePage"
      @search="handleSearch"
      @field-change="handleFieldChange"
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
const municipalities = ref<CatalogItem[]>([]);
const countries = ref<Array<{ value: number; label: string }>>([]);
const departments = ref<Array<{ value: number; label: string }>>([]);
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
  {
    key: "department",
    label: "Departamento",
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
    key: "department_id",
    label: "Departamento",
    type: "select",
    required: true,
    options: [],
  },
  {
    key: "name",
    label: "Nombre",
    type: "text",
    required: true,
    placeholder: "Ingrese el nombre del municipio",
  },
  {
    key: "code",
    label: "Código",
    type: "text",
    required: true,
    placeholder: "Ingrese el código del municipio",
  },
  {
    key: "description",
    label: "Descripción",
    type: "textarea",
    required: false,
    placeholder: "Descripción opcional del municipio",
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
      active: "Y",
      per_page: 1000,
    });

    if (response.data.success) {
      const countryOptions = response.data.data.data.map((country: any) => ({
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

const loadDepartments = async (countryId?: number) => {
  try {
    const params: any = {
      active: "Y",
      per_page: 1000,
    };

    if (countryId) {
      params.country_id = countryId;
    }

    const response = await ApiService.query("/catalogs/departments", params);

    if (response.data.success) {
      const departmentOptions = response.data.data.data.map((dept: any) => ({
        value: dept.id,
        label: dept.name,
      }));

      departments.value = departmentOptions;
      const departmentField = modalFields.value.find(
        (field) => field.key === "department_id",
      );
      if (departmentField) {
        departmentField.options = departmentOptions;
      }
    }
  } catch (error) {
    console.error("Error loading departments:", error);
  }
};

const loadMunicipalities = async (page = 1, search = "") => {
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

    const response = await ApiService.query("/catalogs/municipalities", params);

    if (response.data.success) {
      const transformedData = response.data.data.data.map((muni: any) => ({
        ...muni,
        country: muni.country?.name || "Sin país",
        department: muni.department?.name || "Sin departamento",
      }));

      municipalities.value = transformedData;
      pagination.value = {
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        from: response.data.data.from,
        to: response.data.data.to,
        total: response.data.data.total,
      };
    }
  } catch (error) {
    console.error("Error loading municipalities:", error);
  } finally {
    loading.value = false;
  }
};

const createMunicipality = async (formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.post(
      "/catalogs/municipalities",
      formData,
    );

    if (response.data.success) {
      await loadMunicipalities(currentPage.value, searchTerm.value);
      modalSuccess.value = true;

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error creating municipality:", error);
  }
};

const editMunicipality = async (id: number, formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.put(
      `/catalogs/municipalities/${id}`,
      formData,
    );

    if (response.data.success) {
      await loadMunicipalities(currentPage.value, searchTerm.value);
      modalSuccess.value = true;

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error updating municipality:", error);
  }
};

const deleteMunicipality = async (id: number) => {
  try {
    const response = await ApiService.delete(`/catalogs/municipalities/${id}`);

    if (response.data.success) {
      await loadMunicipalities(currentPage.value, searchTerm.value);
    }
  } catch (error) {
    console.error("Error deleting municipality:", error);
  }
};

const changePage = (page: number) => {
  currentPage.value = page;
  loadMunicipalities(page, searchTerm.value);
};

const handleSearch = (search: string) => {
  searchTerm.value = search;
  currentPage.value = 1;
  loadMunicipalities(1, search);
};

const handleFieldChange = async (fieldKey: string, value: any) => {
  if (fieldKey === "country_id") {
    // Clear department selection when country changes
    const departmentField = modalFields.value.find(
      (field) => field.key === "department_id",
    );
    if (departmentField) {
      departmentField.options = [];
    }

    if (value) {
      // Load departments for the selected country
      await loadDepartments(value);
    }
  }
};

// Lifecycle
onMounted(async () => {
  await loadCountries();
  await loadDepartments();
  await loadMunicipalities();
});
</script>
