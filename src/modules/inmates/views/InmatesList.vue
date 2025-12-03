<template>
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title">
        <!--begin::Search-->
        <div class="d-flex align-items-center position-relative my-1">
          <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <input
            type="text"
            v-model="searchTerm"
            @input="handleSearch"
            class="form-control form-control-solid w-300px ps-13"
            placeholder="Buscar por nombre, DPI o número interno..."
          />
        </div>
        <!--end::Search-->
      </div>
      <!--begin::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div class="d-flex justify-content-end gap-3">
          <!--begin::Filter-->
          <button
            type="button"
            class="btn btn-light-primary"
            @click="showFilters = !showFilters"
          >
            <i class="ki-duotone ki-filter fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Filtros
          </button>
          <!--end::Filter-->

          <!--begin::Advanced Search-->
          <button
            type="button"
            class="btn btn-light-info"
            @click="openAdvancedSearch"
          >
            <i class="ki-duotone ki-search-list fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
            Búsqueda Avanzada
          </button>
          <!--end::Advanced Search-->

          <!--begin::Add inmate-->
          <router-link
            to="/inmates/create"
            class="btn btn-primary"
            v-if="canCreate"
          >
            <i class="ki-duotone ki-plus fs-2"></i>
            Registrar Interno
          </router-link>
          <!--end::Add inmate-->
        </div>
        <!--end::Toolbar-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Filters-->
    <div v-if="showFilters" class="card-header border-top pt-6">
      <div class="card-title w-100">
        <div class="row w-100 g-3">
          <div class="col-md-3">
            <label class="form-label fs-7 fw-bold">Centro</label>
            <select
              v-model="localFilters.center_id"
              class="form-select form-select-solid"
              @change="handleFilterChange"
            >
              <option value="">Todos los centros</option>
              <option
                v-for="option in centersOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label fs-7 fw-bold">Estado</label>
            <select
              v-model="localFilters.status"
              class="form-select form-select-solid"
              @change="handleFilterChange"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="transferred">En traslado</option>
              <option value="court_hearing">En audiencia</option>
              <option value="hospital_external">Hospital externo</option>
              <option value="hospital_internal">Enfermería</option>
              <option value="isolation">Aislamiento</option>
              <option value="released">Liberado</option>
              <option value="deceased">Fallecido</option>
              <option value="escaped">Fugado</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label fs-7 fw-bold">Género</label>
            <select
              v-model="localFilters.gender"
              class="form-select form-select-solid"
              @change="handleFilterChange"
            >
              <option value="">Todos</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label fs-7 fw-bold">Nacionalidad</label>
            <select
              v-model="localFilters.nationality_id"
              class="form-select form-select-solid"
              @change="handleFilterChange"
            >
              <option value="">Todas</option>
              <option
                v-for="option in nationalitiesOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="d-flex justify-content-end mt-3">
          <button
            type="button"
            class="btn btn-light-secondary me-3"
            @click="clearFilters"
            v-if="hasActiveFilters"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
    <!--end::Filters-->

    <!--begin::Card body-->
    <div class="card-body py-4">
      <!--begin::Loading-->
      <div v-if="loading" class="d-flex justify-content-center py-10">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>
      <!--end::Loading-->

      <!--begin::Error-->
      <div v-else-if="error" class="alert alert-danger">
        <i class="ki-duotone ki-cross-circle fs-2 me-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
        {{ error }}
        <button
          type="button"
          class="btn btn-sm btn-light-danger ms-3"
          @click="fetchInmates"
        >
          Reintentar
        </button>
      </div>
      <!--end::Error-->

      <!--begin::Content-->
      <div v-else>
        <!--begin::Statistics-->
        <div v-if="statistics" class="row g-4 mb-6">
          <!-- Total Internos -->
          <div class="col-md-6 col-lg-3">
            <div class="card bg-light-primary border-0 h-100">
              <div
                class="card-body d-flex flex-column justify-content-between p-6"
              >
                <div class="d-flex align-items-center mb-3">
                  <div class="symbol symbol-40px me-3">
                    <div class="symbol-label bg-primary">
                      <i class="ki-duotone ki-people fs-2 text-white">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                        <span class="path4"></span>
                        <span class="path5"></span>
                      </i>
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <div class="text-muted fw-semibold fs-7">Total</div>
                    <div class="fw-bold fs-3 text-gray-800">
                      {{ statistics?.total_inmates || 0 }}
                    </div>
                  </div>
                </div>
                <div class="text-muted fw-semibold fs-6">Internos Totales</div>
              </div>
            </div>
          </div>

          <!-- Internos Activos -->
          <div class="col-md-6 col-lg-3">
            <div class="card bg-light-success border-0 h-100">
              <div
                class="card-body d-flex flex-column justify-content-between p-6"
              >
                <div class="d-flex align-items-center mb-3">
                  <div class="symbol symbol-40px me-3">
                    <div class="symbol-label bg-success">
                      <i class="ki-duotone ki-check-circle fs-2 text-white">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <div class="text-muted fw-semibold fs-7">Activos</div>
                    <div class="fw-bold fs-3 text-gray-800">
                      {{ statistics?.active_inmates || 0 }}
                    </div>
                  </div>
                </div>
                <div class="text-muted fw-semibold fs-6">Internos Activos</div>
              </div>
            </div>
          </div>

          <!-- Tasa de Ocupación -->
          <div class="col-md-6 col-lg-3">
            <div class="card bg-light-warning border-0 h-100">
              <div
                class="card-body d-flex flex-column justify-content-between p-6"
              >
                <div class="d-flex align-items-center mb-3">
                  <div class="symbol symbol-40px me-3">
                    <div class="symbol-label bg-warning">
                      <i class="ki-duotone ki-chart-pie-4 fs-2 text-white">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                      </i>
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <div class="text-muted fw-semibold fs-7">Ocupación</div>
                    <div class="fw-bold fs-3 text-gray-800">
                      {{
                        Math.round(
                          statistics?.overcrowding_stats?.occupancy_rate || 0,
                        )
                      }}%
                    </div>
                  </div>
                </div>
                <div class="text-muted fw-semibold fs-6">
                  {{ statistics?.overcrowding_stats?.current_population || 0 }}
                  /
                  {{ statistics?.overcrowding_stats?.total_capacity || 0 }}
                </div>
              </div>
            </div>
          </div>

          <!-- Requieren Protección -->
          <div class="col-md-6 col-lg-3">
            <div class="card bg-light-danger border-0 h-100">
              <div
                class="card-body d-flex flex-column justify-content-between p-6"
              >
                <div class="d-flex align-items-center mb-3">
                  <div class="symbol symbol-40px me-3">
                    <div class="symbol-label bg-danger">
                      <i class="ki-duotone ki-shield-tick fs-2 text-white">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                      </i>
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <div class="text-muted fw-semibold fs-7">Protección</div>
                    <div class="fw-bold fs-3 text-gray-800">
                      {{ statistics?.requiring_protection || 0 }}
                    </div>
                  </div>
                </div>
                <div class="text-muted fw-semibold fs-6">
                  Requieren Protección
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--end::Statistics-->

        <!--begin::Table-->
        <div v-if="inmates.length > 0" class="table-responsive">
          <table class="table align-middle table-row-dashed fs-6 gy-5">
            <!--begin::Table head-->
            <thead>
              <tr
                class="text-start text-muted fw-bold fs-7 text-uppercase gs-0"
              >
                <th class="min-w-200px">Interno</th>
                <th class="min-w-125px">Identificación</th>
                <th class="min-w-125px">Estado</th>
                <th class="min-w-125px">Centro</th>
                <th class="min-w-100px">Seguridad</th>
                <th class="min-w-100px">Ingreso</th>
                <th class="text-end min-w-100px">Acciones</th>
              </tr>
            </thead>
            <!--end::Table head-->

            <!--begin::Table body-->
            <tbody class="text-gray-600 fw-semibold">
              <tr v-for="inmate in inmates" :key="inmate.id">
                <!--begin::Inmate-->
                <td class="d-flex align-items-center">
                  <!--begin::Avatar-->
                  <div
                    class="symbol symbol-circle symbol-50px overflow-hidden me-3"
                  >
                    <div class="symbol-label">
                      <img
                        :src="getInmatePhoto(inmate)"
                        :alt="getInmateFullName(inmate)"
                        class="w-100"
                      />
                    </div>
                  </div>
                  <!--end::Avatar-->
                  <!--begin::User details-->
                  <div class="d-flex flex-column">
                    <router-link
                      :to="`/inmates/${inmate?.id}`"
                      class="text-gray-800 text-hover-primary mb-1"
                    >
                      {{ getInmateFullName(inmate) }}
                    </router-link>
                    <span class="text-muted">{{
                      inmate?.inmate_number || "N/A"
                    }}</span>
                  </div>
                  <!--end::User details-->
                </td>
                <!--end::Inmate-->

                <!--begin::Document-->
                <td>
                  <div class="d-flex flex-column">
                    <span class="text-gray-800 mb-1">{{
                      inmate?.document_number || "N/A"
                    }}</span>
                    <span class="text-muted">{{
                      inmate?.document_type?.name || "N/A"
                    }}</span>
                  </div>
                </td>
                <!--end::Document-->

                <!--begin::Status-->
                <td>
                  <div class="badge badge-light-success fw-bold">
                    {{ getStatusLabel(inmate?.status) }}
                  </div>
                </td>
                <!--end::Status-->

                <!--begin::Center-->
                <td>
                  <div class="d-flex flex-column">
                    <span class="text-gray-800 mb-1">{{
                      inmate?.current_center?.name || "Sin centro"
                    }}</span>
                    <span class="text-muted">{{
                      inmate?.current_sector?.name || "Sin sector"
                    }}</span>
                  </div>
                </td>
                <!--end::Center-->

                <!--begin::Security-->
                <td>
                  <span class="badge badge-light-info fw-bold">
                    {{ getSecurityLevelLabel(inmate?.security_level) }}
                  </span>
                </td>
                <!--end::Security-->

                <!--begin::Admission-->
                <td>
                  {{
                    inmate?.admission_date
                      ? new Date(inmate.admission_date).toLocaleDateString()
                      : "N/A"
                  }}
                </td>
                <!--end::Admission-->

                <!--begin::Actions-->
                <td class="text-end">
                  <div class="btn-group" role="group">
                    <button
                      type="button"
                      class="btn btn-sm btn-light btn-active-light-primary dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      Acciones
                    </button>
                    <ul class="dropdown-menu">
                      <li>
                        <router-link
                          :to="`/inmates/${inmate?.id}`"
                          class="dropdown-item"
                        >
                          <i class="ki-duotone ki-eye fs-6 me-2"></i>
                          Ver Detalle
                        </router-link>
                      </li>
                      <li v-if="canEdit">
                        <router-link
                          :to="`/inmates/${inmate?.id}/edit`"
                          class="dropdown-item"
                        >
                          <i class="ki-duotone ki-pencil fs-6 me-2"></i>
                          Editar
                        </router-link>
                      </li>
                      <li v-if="canTransfer">
                        <a
                          href="#"
                          class="dropdown-item"
                          @click.prevent="initiateTransfer(inmate)"
                        >
                          <i class="ki-duotone ki-switch fs-6 me-2"></i>
                          Transferir
                        </a>
                      </li>
                      <li v-if="canChangeStatus">
                        <a
                          href="#"
                          class="dropdown-item"
                          @click.prevent="changeStatus(inmate)"
                        >
                          <i class="ki-duotone ki-status fs-6 me-2"></i>
                          Cambiar Estado
                        </a>
                      </li>
                    </ul>
                  </div>
                </td>
                <!--end::Actions-->
              </tr>
            </tbody>
            <!--end::Table body-->
          </table>
        </div>
        <!--end::Table-->

        <!--begin::Empty state-->
        <div v-else-if="inmates.length === 0" class="text-center py-10">
          <div class="mx-auto mb-4">
            <i class="ki-duotone ki-search-list fs-5x text-gray-400">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
          </div>
          <div class="fs-6 text-gray-600 mb-4">
            No se encontraron internos con los criterios especificados.
          </div>
          <button
            v-if="hasActiveFilters"
            type="button"
            class="btn btn-light-primary"
            @click="clearFilters"
          >
            Limpiar Filtros
          </button>
        </div>
        <!--end::Empty state-->

        <!--begin::Pagination-->
        <div
          v-if="pagination.last_page > 1"
          class="d-flex flex-stack flex-wrap pt-10"
        >
          <div class="fs-6 fw-semibold text-gray-700">
            Mostrando
            {{ (pagination.current_page - 1) * pagination.per_page + 1 }} a
            {{
              Math.min(
                pagination.current_page * pagination.per_page,
                pagination.total,
              )
            }}
            de {{ pagination.total }} registros
          </div>

          <nav aria-label="Paginación">
            <ul class="pagination">
              <li
                class="page-item"
                :class="{ disabled: pagination.current_page === 1 }"
              >
                <button
                  class="page-link"
                  @click="changePage(pagination.current_page - 1)"
                  :disabled="pagination.current_page === 1"
                >
                  Anterior
                </button>
              </li>

              <li
                v-for="page in paginationPages"
                :key="page"
                class="page-item"
                :class="{ active: page === pagination.current_page }"
              >
                <button
                  v-if="page !== '...'"
                  class="page-link"
                  @click="changePage(page as number)"
                >
                  {{ page }}
                </button>
                <span v-else class="page-link">...</span>
              </li>

              <li
                class="page-item"
                :class="{
                  disabled: pagination.current_page === pagination.last_page,
                }"
              >
                <button
                  class="page-link"
                  @click="changePage(pagination.current_page + 1)"
                  :disabled="pagination.current_page === pagination.last_page"
                >
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <!--end::Pagination-->
      </div>
      <!--end::Content-->
    </div>
    <!--end::Card body-->
  </div>

  <!-- Modals -->
  <TransferFormModal
    :show="showTransferModal"
    :inmateId="selectedInmate?.id"
    @saved="handleTransferSaved"
    @close="closeTransferModal"
  />

  <ChangeStatusModal
    v-if="selectedInmate"
    :inmate="selectedInmate"
    @statusChanged="handleStatusChanged"
    @released="handleReleased"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useInmatesStore } from "@/stores/inmates";
import { useAuthStore } from "@/stores/auth";
import { useCatalogs } from "@/composables/useCatalogs";
import type { InmateListItem, InmateStatistics } from "@/types/inmates";
import Swal from "sweetalert2";
import TransferFormModal from "@/components/inmates/modals/TransferFormModal.vue";
import ChangeStatusModal from "@/components/inmates/modals/ChangeStatusModal.vue";

// Stores and composables
const inmatesStore = useInmatesStore();
const authStore = useAuthStore();
const { t } = useI18n();
const {
  centers,
  centersOptions,
  nationalitiesOptions,
  loadInmateCatalogs,
} = useCatalogs();
const router = useRouter();

// Reactive data
const searchTerm = ref("");
const showFilters = ref(false);
const statistics = ref<InmateStatistics | null>(null);
const selectedInmate = ref<InmateListItem | null>(null);
const showTransferModal = ref(false);

// Local filter reactive variables
const localFilters = ref({
  center_id: null as number | null,
  status: null as string | null,
  gender: null as string | null,
  nationality_id: null as number | null,
});

// Computed properties
const inmates = computed(() => inmatesStore.inmates);
const loading = computed(() => inmatesStore.loading);
const error = computed(() => inmatesStore.error);
const pagination = computed(() => inmatesStore.pagination);
const filters = computed(() => inmatesStore.filters);

// Permissions
const canCreate = computed(() => authStore.hasPermission("inmates.create"));
const canEdit = computed(() => authStore.hasPermission("inmates.edit"));
const canTransfer = computed(() =>
  authStore.hasPermission("inmates.transfer"),
);
const canChangeStatus = computed(() =>
  authStore.hasPermission("inmates.change_status"),
);

// Check if any filter is active
const hasActiveFilters = computed(() => {
  return !!(
    searchTerm.value ||
    localFilters.value.center_id ||
    localFilters.value.status ||
    localFilters.value.gender ||
    localFilters.value.nationality_id
  );
});

// Generate pagination pages
const paginationPages = computed(() => {
  const pages: (number | string)[] = [];
  const current = pagination.value.current_page;
  const total = pagination.value.last_page;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    }
  }

  return pages;
});

// Helper functions
const getInmateFullName = (inmate: any) => {
  if (!inmate) return "Sin nombre";

  const parts = [
    inmate.first_name,
    inmate.middle_name,
    inmate.third_name,
    inmate.last_name,
    inmate.second_last_name,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" ") : "Sin nombre";
};

const getInmatePhoto = (inmate: any): string => {
  // Primero intentar photo_path directo
  if (inmate?.photo_path) {
    return inmate.photo_path;
  }

  // Luego buscar en el array de fotos
  if (inmate?.photos && inmate.photos.length > 0) {
    const currentPhoto = inmate.photos.find((photo: any) => photo.is_current);
    const photoToUse = currentPhoto || inmate.photos[0];
    return photoToUse.photo_data || photoToUse.photo_url || photoToUse.photo_path || '/media/avatars/blank.png';
  }

  return '/media/avatars/blank.png';
};

const getStatusLabel = (status: string) => {
  const statusMap: { [key: string]: string } = {
    active: "Activo",
    released: "Liberado",
    transferred: "Transferido",
    deceased: "Fallecido",
  };
  return statusMap[status] || status || "N/A";
};

// Methods
const handleSearch = () => {
  // Debounce search
  clearTimeout(handleSearch.timeout as any);
  handleSearch.timeout = setTimeout(() => {
    inmatesStore.setFilters({ search: searchTerm.value });
    fetchInmates();
  }, 300) as any;
};

const handleFilterChange = () => {
  // Update the store filters with current local filters, converting strings to numbers where needed
  inmatesStore.setFilters({
    center_id: localFilters.value.center_id
      ? Number(localFilters.value.center_id)
      : null,
    status: localFilters.value.status || null,
    gender: localFilters.value.gender || null,
    nationality_id: localFilters.value.nationality_id
      ? Number(localFilters.value.nationality_id)
      : null,
  });
  // Reset to first page when filtering
  inmatesStore.setCurrentPage(1);
  // Fetch with new filters
  fetchInmates();
};

const clearFilters = () => {
  searchTerm.value = "";
  // Clear local filters
  localFilters.value = {
    center_id: null,
    status: null,
    gender: null,
    nationality_id: null,
  };
  // Clear store filters
  inmatesStore.clearFilters();
  fetchInmates();
};

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    inmatesStore.setCurrentPage(page);
    fetchInmates();
  }
};

const fetchInmates = async () => {
  try {
    await inmatesStore.fetchInmates(pagination.value.current_page);
  } catch (error) {
    console.error("Error fetching inmates:", error);
  }
};

const fetchStatistics = async () => {
  try {
    statistics.value = await inmatesStore.fetchStatistics();
  } catch (error) {
    console.error("Error fetching statistics:", error);
    // Don't show error to user, just disable statistics display
    statistics.value = null;
  }
};

const loadCatalogs = async () => {
  try {
    // Load required catalogs for filters using the composable
    await loadInmateCatalogs();
  } catch (error) {
    console.error("Error loading catalogs:", error);
  }
};

const initiateTransfer = (inmate: InmateListItem) => {
  selectedInmate.value = inmate;
  showTransferModal.value = true;
};

const openAdvancedSearch = async () => {
  const centersOptionsHtml = centersOptions.value
    .map((option) => `<option value="${option.value}">${option.label}</option>`)
    .join("");

  const nationalitiesOptionsHtml = nationalitiesOptions.value
    .map((option) => `<option value="${option.value}">${option.label}</option>`)
    .join("");

  const { value: formValues } = await Swal.fire({
    title: "Búsqueda Avanzada de Internos",
    html: `
      <div class="row g-3">
        <div class="col-12">
          <label for="fullName" class="form-label">Nombre Completo</label>
          <input id="fullName" type="text" class="swal2-input" placeholder="Buscar por nombre completo...">
        </div>
        <div class="col-6">
          <label for="documentNumber" class="form-label">Número de Documento</label>
          <input id="documentNumber" type="text" class="swal2-input" placeholder="DPI, Pasaporte, etc.">
        </div>
        <div class="col-6">
          <label for="inmateNumber" class="form-label">Número de Interno</label>
          <input id="inmateNumber" type="text" class="swal2-input" placeholder="Número interno...">
        </div>
        <div class="col-6">
          <label for="searchCenters" class="form-label">Centros</label>
          <select id="searchCenters" class="swal2-select" multiple>
            ${centersOptionsHtml}
          </select>
        </div>
        <div class="col-6">
          <label for="searchNationalities" class="form-label">Nacionalidades</label>
          <select id="searchNationalities" class="swal2-select" multiple>
            ${nationalitiesOptionsHtml}
          </select>
        </div>
        <div class="col-6">
          <label for="searchGender" class="form-label">Género</label>
          <select id="searchGender" class="swal2-select">
            <option value="">Todos</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>
        <div class="col-6">
          <label for="searchStatus" class="form-label">Estado</label>
          <select id="searchStatus" class="swal2-select">
            <option value="">Todos</option>
            <option value="active">Activo</option>
            <option value="transferred">En traslado</option>
            <option value="court_hearing">En audiencia</option>
            <option value="released">Liberado</option>
          </select>
        </div>
        <div class="col-6">
          <label for="ageMin" class="form-label">Edad Mínima</label>
          <input id="ageMin" type="number" class="swal2-input" min="18" max="100">
        </div>
        <div class="col-6">
          <label for="ageMax" class="form-label">Edad Máxima</label>
          <input id="ageMax" type="number" class="swal2-input" min="18" max="100">
        </div>
        <div class="col-6">
          <label for="admissionFrom" class="form-label">Fecha Ingreso Desde</label>
          <input id="admissionFrom" type="date" class="swal2-input">
        </div>
        <div class="col-6">
          <label for="admissionTo" class="form-label">Fecha Ingreso Hasta</label>
          <input id="admissionTo" type="date" class="swal2-input">
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Buscar",
    cancelButtonText: "Cancelar",
    width: "800px",
    preConfirm: () => {
      const fullName = (document.getElementById("fullName") as HTMLInputElement)
        .value;
      const documentNumber = (
        document.getElementById("documentNumber") as HTMLInputElement
      ).value;
      const inmateNumber = (
        document.getElementById("inmateNumber") as HTMLInputElement
      ).value;
      const searchCenters = Array.from(
        (document.getElementById("searchCenters") as HTMLSelectElement)
          .selectedOptions,
      ).map((option) => parseInt(option.value));
      const searchNationalities = Array.from(
        (document.getElementById("searchNationalities") as HTMLSelectElement)
          .selectedOptions,
      ).map((option) => parseInt(option.value));
      const searchGender = (
        document.getElementById("searchGender") as HTMLSelectElement
      ).value;
      const searchStatus = (
        document.getElementById("searchStatus") as HTMLSelectElement
      ).value;
      const ageMin = (document.getElementById("ageMin") as HTMLInputElement)
        .value;
      const ageMax = (document.getElementById("ageMax") as HTMLInputElement)
        .value;
      const admissionFrom = (
        document.getElementById("admissionFrom") as HTMLInputElement
      ).value;
      const admissionTo = (
        document.getElementById("admissionTo") as HTMLInputElement
      ).value;

      // Validate age range
      if (ageMin && ageMax && parseInt(ageMin) > parseInt(ageMax)) {
        Swal.showValidationMessage(
          "La edad mínima no puede ser mayor que la máxima",
        );
        return false;
      }

      // Validate date range
      if (
        admissionFrom &&
        admissionTo &&
        new Date(admissionFrom) > new Date(admissionTo)
      ) {
        Swal.showValidationMessage(
          "La fecha de inicio no puede ser posterior a la fecha final",
        );
        return false;
      }

      return {
        full_name: fullName || undefined,
        document_number: documentNumber || undefined,
        inmate_number: inmateNumber || undefined,
        centers: searchCenters.length > 0 ? searchCenters : undefined,
        nationalities: searchNationalities.length > 0 ? searchNationalities : undefined,
        gender: searchGender || undefined,
        status: searchStatus || undefined,
        age_range:
          ageMin || ageMax
            ? {
                min: ageMin ? parseInt(ageMin) : undefined,
                max: ageMax ? parseInt(ageMax) : undefined,
              }
            : undefined,
        admission_period:
          admissionFrom || admissionTo
            ? {
                from: admissionFrom || undefined,
                to: admissionTo || undefined,
              }
            : undefined,
      };
    },
  });

  if (formValues) {
    try {
      // Clean undefined values
      const cleanParams = Object.fromEntries(
        Object.entries(formValues).filter(([_, v]) => v !== undefined),
      );

      if (Object.keys(cleanParams).length === 0) {
        Swal.fire({
          title: "Sin Criterios",
          text: "Debe especificar al menos un criterio de búsqueda",
          icon: "warning",
        });
        return;
      }

      await inmatesStore.advancedSearch(cleanParams);

      Swal.fire({
        title: "Búsqueda Completada",
        text: `Se encontraron ${inmates.value.length} resultados`,
        icon: "success",
        timer: 2000,
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error en Búsqueda",
        text: error.message || "No se pudo realizar la búsqueda avanzada",
        icon: "error",
      });
    }
  }
};

const changeStatus = (inmate: InmateListItem) => {
  selectedInmate.value = inmate;

  // Abrir modal de cambio de estado
  setTimeout(() => {
    const modalElement = document.getElementById('changeStatusModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }, 100);
};

// Helper function to get security level translation
const getSecurityLevelLabel = (level: string | null | undefined): string => {
  if (!level) {
    return t("common.securityLevel.notAssigned");
  }

  const levelKey = `common.securityLevel.${level}`;
  return t(levelKey);
};

// Event handlers for modals
const handleTransferSaved = () => {
  // Recargar lista de internos
  fetchInmates();
  fetchStatistics();
};

const closeTransferModal = () => {
  showTransferModal.value = false;
  selectedInmate.value = null;
};

const handleStatusChanged = () => {
  // Recargar lista de internos y estadísticas
  fetchInmates();
  fetchStatistics();
};

const handleReleased = () => {
  // Recargar lista de internos y estadísticas
  fetchInmates();
  fetchStatistics();

  Swal.fire({
    title: '¡Interno Liberado!',
    text: 'El interno ha sido liberado exitosamente',
    icon: 'success',
    timer: 3000
  });
};

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchInmates(), fetchStatistics(), loadCatalogs()]);
});

// Watch for route changes
watch(
  () => router.currentRoute.value.query,
  () => {
    if (router.currentRoute.value.name === "inmates-list") {
      fetchInmates();
    }
  },
);
</script>

<style scoped>
.page-link {
  cursor: pointer;
}

.page-item.disabled .page-link {
  cursor: not-allowed;
}
</style>
