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
            :placeholder="$t('inmates.list.searchPlaceholder')"
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
            {{ $t('inmates.list.filters') }}
          </button>
          <!--end::Filter-->

          <!--begin::Advanced Search-->
          <button
            v-if="canAdvancedSearch"
            type="button"
            class="btn btn-light-info"
            @click="openAdvancedSearch"
          >
            <i class="ki-duotone ki-search-list fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
            {{ $t('inmates.list.advancedSearch') }}
          </button>
          <!--end::Advanced Search-->

          <!--begin::Add inmate-->
          <router-link
            to="/inmates/create"
            class="btn btn-primary"
            v-if="canCreate"
          >
            <i class="ki-duotone ki-plus fs-2"></i>
            {{ $t('inmates.list.registerInmate') }}
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
            <label class="form-label fs-7 fw-bold">{{ $t('inmates.list.filterLabels.center') }}</label>
            <select
              v-model="localFilters.center_id"
              class="form-select form-select-solid"
              @change="handleFilterChange"
            >
              <option value="">{{ $t('inmates.list.filterLabels.allCenters') }}</option>
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
            <label class="form-label fs-7 fw-bold">{{ $t('inmates.list.filterLabels.status') }}</label>
            <select
              v-model="localFilters.status"
              class="form-select form-select-solid"
              @change="handleFilterChange"
            >
              <option value="">{{ $t('inmates.list.filterLabels.allStatuses') }}</option>
              <option value="active">{{ $t('inmates.list.statuses.active') }}</option>
              <option value="transferred">{{ $t('inmates.list.statuses.transferred') }}</option>
              <option value="court_hearing">{{ $t('inmates.list.statuses.court_hearing') }}</option>
              <option value="hospital_external">{{ $t('inmates.list.statuses.hospital_external') }}</option>
              <option value="hospital_internal">{{ $t('inmates.list.statuses.hospital_internal') }}</option>
              <option value="isolation">{{ $t('inmates.list.statuses.isolation') }}</option>
              <option value="released">{{ $t('inmates.list.statuses.released') }}</option>
              <option value="deceased">{{ $t('inmates.list.statuses.deceased') }}</option>
              <option value="escaped">{{ $t('inmates.list.statuses.escaped') }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label fs-7 fw-bold">{{ $t('inmates.list.filterLabels.gender') }}</label>
            <select
              v-model="localFilters.gender"
              class="form-select form-select-solid"
              @change="handleFilterChange"
            >
              <option value="">{{ $t('inmates.list.filterLabels.allGenders') }}</option>
              <option value="M">{{ $t('inmates.list.genders.M') }}</option>
              <option value="F">{{ $t('inmates.list.genders.F') }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label fs-7 fw-bold">{{ $t('inmates.list.filterLabels.nationality') }}</label>
            <select
              v-model="localFilters.nationality_id"
              class="form-select form-select-solid"
              @change="handleFilterChange"
            >
              <option value="">{{ $t('inmates.list.filterLabels.allNationalities') }}</option>
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
            {{ $t('inmates.list.clearFilters') }}
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
          <span class="visually-hidden">{{ $t('inmates.list.loading') }}</span>
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
          {{ $t('inmates.list.retry') }}
        </button>
      </div>
      <!--end::Error-->

      <!--begin::Content-->
      <div v-else>
        <!--begin::Statistics-->
        <div class="row g-4 mb-6">
          <!-- Loading Skeleton for Statistics -->
          <template v-if="loadingStatistics && !statistics">
            <div class="col-md-6 col-lg-3" v-for="i in 4" :key="i">
              <div class="card bg-light border-0 h-100">
                <div class="card-body p-6">
                  <div class="d-flex align-items-center mb-3">
                    <div class="skeleton-box rounded-circle me-3" style="width: 40px; height: 40px;"></div>
                    <div class="flex-grow-1">
                      <div class="skeleton-box rounded mb-2" style="width: 60%; height: 14px;"></div>
                      <div class="skeleton-box rounded" style="width: 40%; height: 24px;"></div>
                    </div>
                  </div>
                  <div class="skeleton-box rounded" style="width: 80%; height: 14px;"></div>
                </div>
              </div>
            </div>
          </template>

          <!-- Statistics Content -->
          <template v-else-if="statistics">
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
                      <div class="text-muted fw-semibold fs-7">{{ $t('inmates.list.statistics.total') }}</div>
                      <div class="fw-bold fs-3 text-gray-800">
                        {{ statistics?.total_inmates || 0 }}
                      </div>
                    </div>
                  </div>
                  <div class="text-muted fw-semibold fs-6">{{ $t('inmates.list.statistics.totalInmates') }}</div>
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
                      <div class="text-muted fw-semibold fs-7">{{ $t('inmates.list.statistics.active') }}</div>
                      <div class="fw-bold fs-3 text-gray-800">
                        {{ statistics?.active_inmates || 0 }}
                      </div>
                    </div>
                  </div>
                  <div class="text-muted fw-semibold fs-6">{{ $t('inmates.list.statistics.activeInmates') }}</div>
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
                      <div class="text-muted fw-semibold fs-7">{{ $t('inmates.list.statistics.occupancy') }}</div>
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
                      <div class="text-muted fw-semibold fs-7">{{ $t('inmates.list.statistics.protection') }}</div>
                      <div class="fw-bold fs-3 text-gray-800">
                        {{ statistics?.requiring_protection || 0 }}
                      </div>
                    </div>
                  </div>
                  <div class="text-muted fw-semibold fs-6">
                    {{ $t('inmates.list.statistics.requireProtection') }}
                  </div>
                </div>
              </div>
            </div>
          </template>
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
                <th class="min-w-200px">{{ $t('inmates.list.tableHeaders.inmate') }}</th>
                <th class="min-w-125px">{{ $t('inmates.list.tableHeaders.identification') }}</th>
                <th class="min-w-125px">{{ $t('inmates.list.tableHeaders.status') }}</th>
                <th class="min-w-125px">{{ $t('inmates.list.tableHeaders.center') }}</th>
                <th class="min-w-100px">{{ $t('inmates.list.tableHeaders.security') }}</th>
                <th class="min-w-100px">{{ $t('inmates.list.tableHeaders.admission') }}</th>
                <th class="text-end min-w-100px">{{ $t('inmates.list.tableHeaders.actions') }}</th>
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
                      inmate?.current_center?.name || $t('inmates.list.noCenter')
                    }}</span>
                    <span class="text-muted">{{
                      inmate?.current_sector?.name || $t('inmates.list.noSector')
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
                      {{ $t('inmates.list.actions.actions') }}
                    </button>
                    <ul class="dropdown-menu">
                      <li>
                        <router-link
                          :to="`/inmates/${inmate?.id}`"
                          class="dropdown-item"
                        >
                          <i class="ki-duotone ki-eye fs-6 me-2"></i>
                          {{ $t('inmates.list.actions.viewDetail') }}
                        </router-link>
                      </li>
                      <li v-if="canEdit">
                        <router-link
                          :to="`/inmates/${inmate?.id}/edit`"
                          class="dropdown-item"
                        >
                          <i class="ki-duotone ki-pencil fs-6 me-2"></i>
                          {{ $t('inmates.list.actions.edit') }}
                        </router-link>
                      </li>
                      <li v-if="canTransfer">
                        <a
                          href="#"
                          class="dropdown-item"
                          @click.prevent="initiateTransfer(inmate)"
                        >
                          <i class="ki-duotone ki-switch fs-6 me-2"></i>
                          {{ $t('inmates.list.actions.transfer') }}
                        </a>
                      </li>
                      <li v-if="canChangeStatus">
                        <a
                          href="#"
                          class="dropdown-item"
                          @click.prevent="changeStatus(inmate)"
                        >
                          <i class="ki-duotone ki-status fs-6 me-2"></i>
                          {{ $t('inmates.list.actions.changeStatus') }}
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
            {{ $t('inmates.list.noResults') }}
          </div>
          <button
            v-if="hasActiveFilters"
            type="button"
            class="btn btn-light-primary"
            @click="clearFilters"
          >
            {{ $t('inmates.list.clearFilters') }}
          </button>
        </div>
        <!--end::Empty state-->

        <!--begin::Pagination-->
        <div
          v-if="pagination.last_page > 1"
          class="d-flex flex-stack flex-wrap pt-10"
        >
          <div class="fs-6 fw-semibold text-gray-700">
            {{ $t('inmates.list.pagination.showing') }}
            {{ (pagination.current_page - 1) * pagination.per_page + 1 }} {{ $t('inmates.list.pagination.to') }}
            {{
              Math.min(
                pagination.current_page * pagination.per_page,
                pagination.total,
              )
            }}
            {{ $t('inmates.list.pagination.of') }} {{ pagination.total }} {{ $t('inmates.list.pagination.records') }}
          </div>

          <nav>
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
                  {{ $t('inmates.list.pagination.previous') }}
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
                  {{ $t('inmates.list.pagination.next') }}
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
const loadingStatistics = ref(false);
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
const canAdvancedSearch = computed(() =>
  authStore.hasPermission("inmates.advanced_search"),
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
  if (!inmate) return t('inmates.list.noName');

  const parts = [
    inmate.first_name,
    inmate.middle_name,
    inmate.third_name,
    inmate.last_name,
    inmate.second_last_name,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" ") : t('inmates.list.noName');
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
  if (!status) return t('inmates.common.na');
  const statusKey = `inmates.list.statuses.${status}`;
  const translated = t(statusKey);
  return translated !== statusKey ? translated : status;
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
  loadingStatistics.value = true;
  try {
    statistics.value = await inmatesStore.fetchStatistics();
  } catch (error) {
    console.error("Error fetching statistics:", error);
    // Don't show error to user, just disable statistics display
    statistics.value = null;
  } finally {
    loadingStatistics.value = false;
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
  // Get translations for the modal
  const modal = {
    title: t('inmates.list.advancedSearchModal.title'),
    fullName: t('inmates.list.advancedSearchModal.fullName'),
    fullNamePlaceholder: t('inmates.list.advancedSearchModal.fullNamePlaceholder'),
    documentNumber: t('inmates.list.advancedSearchModal.documentNumber'),
    documentPlaceholder: t('inmates.list.advancedSearchModal.documentPlaceholder'),
    inmateNumber: t('inmates.list.advancedSearchModal.inmateNumber'),
    inmateNumberPlaceholder: t('inmates.list.advancedSearchModal.inmateNumberPlaceholder'),
    centers: t('inmates.list.advancedSearchModal.centers'),
    nationalities: t('inmates.list.advancedSearchModal.nationalities'),
    gender: t('inmates.list.advancedSearchModal.gender'),
    status: t('inmates.list.advancedSearchModal.status'),
    ageMin: t('inmates.list.advancedSearchModal.ageMin'),
    ageMax: t('inmates.list.advancedSearchModal.ageMax'),
    admissionFrom: t('inmates.list.advancedSearchModal.admissionFrom'),
    admissionTo: t('inmates.list.advancedSearchModal.admissionTo'),
    search: t('inmates.list.advancedSearchModal.search'),
    cancel: t('inmates.list.advancedSearchModal.cancel'),
    all: t('inmates.list.filterLabels.allStatuses'),
    genderM: t('inmates.list.genders.M'),
    genderF: t('inmates.list.genders.F'),
    statusActive: t('inmates.list.statuses.active'),
    statusTransferred: t('inmates.list.statuses.transferred'),
    statusCourtHearing: t('inmates.list.statuses.court_hearing'),
    statusReleased: t('inmates.list.statuses.released'),
  };

  const centersOptionsHtml = centersOptions.value
    .map((option) => `<option value="${option.value}">${option.label}</option>`)
    .join("");

  const nationalitiesOptionsHtml = nationalitiesOptions.value
    .map((option) => `<option value="${option.value}">${option.label}</option>`)
    .join("");

  const { value: formValues } = await Swal.fire({
    title: modal.title,
    html: `
      <div class="row g-3">
        <div class="col-12">
          <label for="fullName" class="form-label">${modal.fullName}</label>
          <input id="fullName" type="text" class="swal2-input" placeholder="${modal.fullNamePlaceholder}">
        </div>
        <div class="col-6">
          <label for="documentNumber" class="form-label">${modal.documentNumber}</label>
          <input id="documentNumber" type="text" class="swal2-input" placeholder="${modal.documentPlaceholder}">
        </div>
        <div class="col-6">
          <label for="inmateNumber" class="form-label">${modal.inmateNumber}</label>
          <input id="inmateNumber" type="text" class="swal2-input" placeholder="${modal.inmateNumberPlaceholder}">
        </div>
        <div class="col-6">
          <label for="searchCenters" class="form-label">${modal.centers}</label>
          <select id="searchCenters" class="swal2-select" multiple>
            ${centersOptionsHtml}
          </select>
        </div>
        <div class="col-6">
          <label for="searchNationalities" class="form-label">${modal.nationalities}</label>
          <select id="searchNationalities" class="swal2-select" multiple>
            ${nationalitiesOptionsHtml}
          </select>
        </div>
        <div class="col-6">
          <label for="searchGender" class="form-label">${modal.gender}</label>
          <select id="searchGender" class="swal2-select">
            <option value="">${modal.all}</option>
            <option value="M">${modal.genderM}</option>
            <option value="F">${modal.genderF}</option>
          </select>
        </div>
        <div class="col-6">
          <label for="searchStatus" class="form-label">${modal.status}</label>
          <select id="searchStatus" class="swal2-select">
            <option value="">${modal.all}</option>
            <option value="active">${modal.statusActive}</option>
            <option value="transferred">${modal.statusTransferred}</option>
            <option value="court_hearing">${modal.statusCourtHearing}</option>
            <option value="released">${modal.statusReleased}</option>
          </select>
        </div>
        <div class="col-6">
          <label for="ageMin" class="form-label">${modal.ageMin}</label>
          <input id="ageMin" type="number" class="swal2-input" min="18" max="100">
        </div>
        <div class="col-6">
          <label for="ageMax" class="form-label">${modal.ageMax}</label>
          <input id="ageMax" type="number" class="swal2-input" min="18" max="100">
        </div>
        <div class="col-6">
          <label for="admissionFrom" class="form-label">${modal.admissionFrom}</label>
          <input id="admissionFrom" type="date" class="swal2-input">
        </div>
        <div class="col-6">
          <label for="admissionTo" class="form-label">${modal.admissionTo}</label>
          <input id="admissionTo" type="date" class="swal2-input">
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: modal.search,
    cancelButtonText: modal.cancel,
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
          t('inmates.list.advancedSearchModal.ageValidation'),
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
          t('inmates.list.advancedSearchModal.dateValidation'),
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
          title: t('inmates.list.advancedSearchModal.noCriteria'),
          text: t('inmates.list.advancedSearchModal.noCriteriaMessage'),
          icon: "warning",
        });
        return;
      }

      await inmatesStore.advancedSearch(cleanParams);

      Swal.fire({
        title: t('inmates.list.advancedSearchModal.searchCompleted'),
        text: t('inmates.list.advancedSearchModal.resultsFound', { count: inmates.value.length }),
        icon: "success",
        timer: 2000,
      });
    } catch (error: any) {
      // Handle permission denied error
      if (error.response?.status === 403) {
        Swal.fire({
          title: t('common.status.accessDenied'),
          text: t('inmates.list.advancedSearchModal.noPermission'),
          icon: "error",
        });
      } else {
        Swal.fire({
          title: t('inmates.list.advancedSearchModal.searchError'),
          text: error.message || t('inmates.list.advancedSearchModal.searchErrorMessage'),
          icon: "error",
        });
      }
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
    title: t('inmates.list.swal.inmateReleased'),
    text: t('inmates.list.swal.inmateReleasedDesc'),
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

/* Skeleton loader animation */
.skeleton-box {
  background: linear-gradient(
    90deg,
    #e8e8e8 25%,
    #f5f5f5 50%,
    #e8e8e8 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
