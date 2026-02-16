<template>
  <div>
    <div
      class="page-title d-flex flex-column justify-content-center flex-wrap me-3"
    >
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        Tipos de Parentesco
      </h1>
    </div>

    <CatalogList
      catalog-name="Tipo de Parentesco"
      :items="items"
      :loading="loading"
      :modal-fields="modalFields"
      :pagination="pagination"
      :modal-success="modalSuccess"
      :additional-columns="additionalColumns"
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

// Additional columns for relationship types
const additionalColumns: AdditionalColumn[] = [
  {
    key: "category",
    label: "Categoría",
  },
  {
    key: "sort_order",
    label: "Orden",
  },
];

// Configuration - RelationshipTypes uses is_active (boolean) instead of active (Y/N)
const modalFields: ModalField[] = [
  {
    key: "name",
    label: "Nombre",
    type: "text",
    required: true,
    placeholder: "Ingrese el nombre del tipo de parentesco",
  },
  {
    key: "code",
    label: "Código",
    type: "text",
    required: true,
    placeholder: "Código único del tipo de parentesco",
  },
  {
    key: "category",
    label: "Categoría",
    type: "select",
    required: false,
    options: [
      { value: "family", label: "Familia" },
      { value: "friend", label: "Amigo" },
      { value: "legal", label: "Legal" },
      { value: "other", label: "Otro" },
    ],
  },
  {
    key: "sort_order",
    label: "Orden",
    type: "number",
    required: false,
    placeholder: "Orden de visualización",
  },
  {
    key: "description",
    label: "Descripción",
    type: "textarea",
    required: false,
    placeholder: "Descripción del tipo de parentesco",
  },
  {
    key: "is_active",
    label: "Activo",
    type: "checkbox",
    required: false,
  },
];

// Methods
const loadItems = async (page = 1, search = "") => {
  loading.value = true;
  try {
    const params: any = {
      page,
      per_page: 15,
      sort_by: "sort_order",
      sort_direction: "asc",
    };

    if (search) {
      params.search = search;
    }

    const response = await ApiService.query(
      "/catalogs/relationship-types",
      params,
    );

    if (response.data.success) {
      // Map is_active to active for CatalogList compatibility
      const data = (response.data.data.data || []).map((item: any) => ({
        ...item,
        active: item.is_active ? "Y" : "N",
      }));
      items.value = data;
      pagination.value = {
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        from: response.data.data.from,
        to: response.data.data.to,
        total: response.data.data.total,
      };
    }
  } catch (error) {
    console.error("Error loading relationship types:", error);
  } finally {
    loading.value = false;
  }
};

const createItem = async (formData: any) => {
  try {
    modalSuccess.value = false;
    // Convert is_active checkbox value to boolean
    const payload = {
      ...formData,
      is_active: formData.is_active === "Y" || formData.is_active === true,
    };
    delete payload.active;

    const response = await ApiService.post(
      "/catalogs/relationship-types",
      payload,
    );

    if (response.data.success) {
      await loadItems(currentPage.value, searchTerm.value);
      modalSuccess.value = true;

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error creating relationship type:", error);
  }
};

const editItem = async (id: number, formData: any) => {
  try {
    modalSuccess.value = false;
    const payload = {
      ...formData,
      is_active: formData.is_active === "Y" || formData.is_active === true,
    };
    delete payload.active;

    const response = await ApiService.put(
      `/catalogs/relationship-types/${id}`,
      payload,
    );

    if (response.data.success) {
      await loadItems(currentPage.value, searchTerm.value);
      modalSuccess.value = true;

      setTimeout(() => {
        modalSuccess.value = false;
      }, 100);
    }
  } catch (error) {
    console.error("Error updating relationship type:", error);
  }
};

const deleteItem = async (id: number) => {
  try {
    const response = await ApiService.delete(
      `/catalogs/relationship-types/${id}`,
    );

    if (response.data.success) {
      await loadItems(currentPage.value, searchTerm.value);
    }
  } catch (error) {
    console.error("Error deleting relationship type:", error);
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
