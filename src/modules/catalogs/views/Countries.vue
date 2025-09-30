<template>
  <div>
    <div
      class="page-title d-flex flex-column justify-content-center flex-wrap me-3"
    >
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        {{ t("catalogs.countries.title") }}
      </h1>
    </div>

    <CatalogList
      :catalog-name="t('catalogs.countries.singular')"
      :items="countries"
      :loading="loading"
      :modal-fields="modalFields"
      :pagination="pagination"
      :modal-success="modalSuccess"
      @create="createCountry"
      @edit="editCountry"
      @delete="deleteCountry"
      @page-change="changePage"
      @search="handleSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import CatalogList from "../components/CatalogList.vue";
import type {
  CatalogItem,
  ModalField,
  PaginationInfo,
} from "../components/CatalogList.vue";
import ApiService from "../../../core/services/ApiService";

// Composables
const { t } = useI18n();

// Reactive state
const countries = ref<CatalogItem[]>([]);
const loading = ref(false);
const pagination = ref<PaginationInfo | null>(null);
const currentPage = ref(1);
const searchTerm = ref("");
const modalSuccess = ref(false);

// Modal configuration
const modalFields = computed((): ModalField[] => [
  {
    key: "name",
    label: t("catalogs.fields.name"),
    type: "text",
    required: true,
    placeholder: t("catalogs.countries.placeholders.name"),
  },
  {
    key: "code",
    label: t("catalogs.fields.code"),
    type: "text",
    required: true,
    placeholder: t("catalogs.countries.placeholders.code"),
  },
  {
    key: "description",
    label: t("catalogs.fields.description"),
    type: "textarea",
    required: false,
    placeholder: t("catalogs.countries.placeholders.description"),
  },
  {
    key: "active",
    label: t("catalogs.fields.active"),
    type: "checkbox",
    required: true,
  },
]);

// Methods
const loadCountries = async (page = 1, search = "") => {
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

    const response = await ApiService.query("/catalogs/countries", params);

    if (response.data.success) {
      countries.value = response.data.data.data || [];
      pagination.value = {
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        from: response.data.data.from,
        to: response.data.data.to,
        total: response.data.data.total,
      };
    }
  } catch (error) {
    console.error("Error loading countries:", error);
  } finally {
    loading.value = false;
  }
};

const createCountry = async (formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.post("/catalogs/countries", formData);

    if (response.data.success) {
      await loadCountries(currentPage.value, searchTerm.value);
      modalSuccess.value = true;
      console.log("Country created successfully:", response.data.data);

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error creating country:", error);
  }
};

const editCountry = async (id: number, formData: any) => {
  try {
    modalSuccess.value = false;
    const response = await ApiService.put(
      `/catalogs/countries/${id}`,
      formData,
    );

    if (response.data.success) {
      await loadCountries(currentPage.value, searchTerm.value);
      modalSuccess.value = true;
      console.log("Country updated successfully:", response.data.data);

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error updating country:", error);
  }
};

const deleteCountry = async (id: number) => {
  try {
    const response = await ApiService.delete(`/catalogs/countries/${id}`);

    if (response.data.success) {
      await loadCountries(currentPage.value, searchTerm.value);
    }
  } catch (error) {
    console.error("Error deleting country:", error);
  }
};

const changePage = (page: number) => {
  currentPage.value = page;
  loadCountries(page, searchTerm.value);
};

const handleSearch = (search: string) => {
  searchTerm.value = search;
  currentPage.value = 1;
  loadCountries(1, search);
};

// Lifecycle
onMounted(() => {
  loadCountries();
});
</script>
