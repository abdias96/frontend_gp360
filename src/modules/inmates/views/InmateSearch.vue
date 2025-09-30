<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <div class="d-flex align-items-center position-relative my-1">
          <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <input
            type="text"
            v-model="searchQuery"
            @input="performSearch"
            class="form-control form-control-solid w-250px ps-13"
            placeholder="Buscar internos..."
          />
        </div>
      </div>
      <div class="card-toolbar">
        <div class="d-flex justify-content-end" data-kt-user-table-toolbar="base">
          <button type="button" class="btn btn-light-primary me-3" @click="toggleAdvancedSearch">
            <i class="ki-duotone ki-filter fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Búsqueda Avanzada
          </button>
        </div>
      </div>
    </div>

    <!-- Advanced Search Panel -->
    <div v-if="showAdvancedSearch" class="card-body border-top pt-6">
      <div class="row g-4">
        <div class="col-md-3">
          <label class="form-label">Documento</label>
          <input
            type="text"
            v-model="advancedFilters.document"
            class="form-control"
            placeholder="DPI o pasaporte"
          />
        </div>
        <div class="col-md-3">
          <label class="form-label">Nombre</label>
          <input
            type="text"
            v-model="advancedFilters.name"
            class="form-control"
            placeholder="Nombre completo"
          />
        </div>
        <div class="col-md-3">
          <label class="form-label">Centro</label>
          <select v-model="advancedFilters.center" class="form-select">
            <option value="">Todos los centros</option>
            <option v-for="center in centers" :key="center.id" :value="center.id">
              {{ center.name }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Estado</label>
          <select v-model="advancedFilters.status" class="form-select">
            <option value="">Todos</option>
            <option value="active">Activo</option>
            <option value="released">Liberado</option>
            <option value="transferred">Trasladado</option>
          </select>
        </div>
        <div class="col-md-12 text-end">
          <button type="button" class="btn btn-secondary me-2" @click="clearFilters">
            Limpiar
          </button>
          <button type="button" class="btn btn-primary" @click="applyFilters">
            Buscar
          </button>
        </div>
      </div>
    </div>

    <div class="card-body pt-0">
      <!-- Search Results -->
      <div v-if="loading" class="text-center py-10">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Buscando...</span>
        </div>
      </div>

      <div v-else-if="searchResults.length > 0">
        <div class="table-responsive">
          <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
            <thead>
              <tr class="fw-bold text-muted">
                <th class="min-w-150px">Interno</th>
                <th class="min-w-100px">Documento</th>
                <th class="min-w-140px">Centro</th>
                <th class="min-w-120px">Estado</th>
                <th class="text-end min-w-100px">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="inmate in searchResults" :key="inmate.id">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-45px me-5">
                      <img
                        :src="inmate.photo_url || '/media/avatars/blank.png'"
                        alt=""
                      />
                    </div>
                    <div class="d-flex justify-content-start flex-column">
                      <router-link
                        :to="`/inmates/${inmate.id}`"
                        class="text-gray-900 fw-bold text-hover-primary fs-6"
                      >
                        {{ inmate.full_name }}
                      </router-link>
                      <span class="text-muted fw-semibold text-muted d-block fs-7">
                        {{ inmate.alias || '-' }}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="text-gray-900 fw-bold d-block fs-6">
                    {{ inmate.identification_number }}
                  </span>
                  <span class="text-muted fw-semibold text-muted d-block fs-7">
                    {{ inmate.document_type?.name || 'DPI' }}
                  </span>
                </td>
                <td>
                  {{ inmate.current_center?.name || 'No asignado' }}
                </td>
                <td>
                  <span
                    class="badge"
                    :class="{
                      'badge-light-success': inmate.status === 'active',
                      'badge-light-danger': inmate.status === 'released',
                      'badge-light-warning': inmate.status === 'transferred'
                    }"
                  >
                    {{ getStatusLabel(inmate.status) }}
                  </span>
                </td>
                <td class="text-end">
                  <router-link
                    :to="`/inmates/${inmate.id}`"
                    class="btn btn-sm btn-light-primary"
                  >
                    Ver Detalle
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="d-flex justify-content-between align-items-center mt-5">
          <div class="text-muted">
            Mostrando {{ searchResults.length }} de {{ totalResults }} resultados
          </div>
          <nav>
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" @click="goToPage(currentPage - 1)" href="#">
                  Anterior
                </a>
              </li>
              <li
                v-for="page in visiblePages"
                :key="page"
                class="page-item"
                :class="{ active: page === currentPage }"
              >
                <a class="page-link" @click="goToPage(page)" href="#">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" @click="goToPage(currentPage + 1)" href="#">
                  Siguiente
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div v-else-if="searchPerformed" class="text-center py-10">
        <img src="/media/illustrations/dozzy-1/5.png" alt="" class="mw-100 h-200px" />
        <h4 class="fw-bold text-gray-900 mt-5">No se encontraron resultados</h4>
        <p class="text-muted">Intenta modificar los criterios de búsqueda</p>
      </div>

      <div v-else class="text-center py-10">
        <img src="/media/illustrations/dozzy-1/4.png" alt="" class="mw-100 h-200px" />
        <h4 class="fw-bold text-gray-900 mt-5">Buscar Internos</h4>
        <p class="text-muted">Ingresa un término de búsqueda para comenzar</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ApiService from '@/core/services/ApiService';
import debounce from 'lodash/debounce';

const searchQuery = ref('');
const searchResults = ref<any[]>([]);
const loading = ref(false);
const searchPerformed = ref(false);
const showAdvancedSearch = ref(false);
const currentPage = ref(1);
const totalResults = ref(0);
const perPage = ref(10);

const advancedFilters = ref({
  document: '',
  name: '',
  center: '',
  status: ''
});

const centers = ref<any[]>([]);

const totalPages = computed(() => Math.ceil(totalResults.value / perPage.value));

const visiblePages = computed(() => {
  const pages: number[] = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, start + 4);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return 'Activo';
    case 'released':
      return 'Liberado';
    case 'transferred':
      return 'Trasladado';
    default:
      return status;
  }
};

const performSearch = debounce(async () => {
  if (!searchQuery.value && !hasAdvancedFilters()) {
    searchResults.value = [];
    searchPerformed.value = false;
    return;
  }

  loading.value = true;
  searchPerformed.value = true;

  try {
    const params = new URLSearchParams({
      q: searchQuery.value,
      page: currentPage.value.toString(),
      per_page: perPage.value.toString(),
      ...Object.fromEntries(
        Object.entries(advancedFilters.value).filter(([_, v]) => v)
      )
    });

    const response = await ApiService.get(`/inmates/search?${params}`);
    searchResults.value = response.data.data || [];
    totalResults.value = response.data.meta?.total || searchResults.value.length;
  } catch (error) {
    console.error('Error searching inmates:', error);
    searchResults.value = [];
  } finally {
    loading.value = false;
  }
}, 500);

const hasAdvancedFilters = () => {
  return Object.values(advancedFilters.value).some(v => v);
};

const toggleAdvancedSearch = () => {
  showAdvancedSearch.value = !showAdvancedSearch.value;
};

const clearFilters = () => {
  advancedFilters.value = {
    document: '',
    name: '',
    center: '',
    status: ''
  };
  searchQuery.value = '';
  searchResults.value = [];
  searchPerformed.value = false;
};

const applyFilters = () => {
  currentPage.value = 1;
  performSearch();
};

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  performSearch();
};

const loadCenters = async () => {
  try {
    const response = await ApiService.get('/catalogs/centers');
    centers.value = response.data.data || [];
  } catch (error) {
    console.error('Error loading centers:', error);
  }
};

onMounted(() => {
  loadCenters();
});
</script>

<style scoped>
.symbol img {
  object-fit: cover;
}

.page-link {
  cursor: pointer;
}

.h-200px {
  height: 200px !important;
}
</style>