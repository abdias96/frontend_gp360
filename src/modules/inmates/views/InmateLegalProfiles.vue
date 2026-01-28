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
            :placeholder="$t('inmates.legalProfiles.searchPlaceholder')"
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
            {{ $t('inmates.legalProfiles.filters') }}
          </button>
          <!--end::Filter-->

          <!--begin::Add-->
          <button
            v-if="canCreate"
            type="button"
            class="btn btn-primary"
            @click="createProfile"
          >
            <i class="ki-duotone ki-plus fs-2"></i>
            {{ $t('inmates.legalProfiles.createProfile') }}
          </button>
          <!--end::Add-->
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
            <label class="form-label fs-7 fw-bold">{{ $t('inmates.legalProfiles.filterLabels.center') }}</label>
            <select
              v-model="filters.center_id"
              class="form-select form-select-solid"
              @change="handleFilterChange"
            >
              <option value="">{{ $t('inmates.legalProfiles.filterLabels.allCenters') }}</option>
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
            <label class="form-label fs-7 fw-bold">{{ $t('inmates.legalProfiles.filterLabels.proceduralStatus') }}</label>
            <select
              v-model="filters.procedural_status_id"
              class="form-select form-select-solid"
              @change="handleFilterChange"
            >
              <option value="">{{ $t('inmates.legalProfiles.filterLabels.all') }}</option>
              <option
                v-for="status in proceduralStatuses"
                :key="status.id"
                :value="status.id"
              >
                {{ status.name }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label fs-7 fw-bold">{{ $t('inmates.legalProfiles.filterLabels.type') }}</label>
            <select
              v-model="filters.profile_type"
              class="form-select form-select-solid"
              @change="handleFilterChange"
            >
              <option value="">{{ $t('inmates.legalProfiles.filterLabels.all') }}</option>
              <option value="preventive">{{ $t('inmates.legalProfiles.filterLabels.preventive') }}</option>
              <option value="sentenced">{{ $t('inmates.legalProfiles.filterLabels.sentenced') }}</option>
            </select>
          </div>
          <div class="col-md-3 d-flex align-items-end">
            <button
              type="button"
              class="btn btn-light-secondary w-100"
              @click="clearFilters"
              v-if="hasActiveFilters"
            >
              {{ $t('inmates.legalProfiles.clearFilters') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--end::Filters-->

    <!--begin::Card body-->
    <div class="card-body py-4">
      <!--begin::Loading-->
      <div v-if="loading" class="d-flex justify-content-center py-10">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">{{ $t('inmates.legalProfiles.loading') }}</span>
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
          @click="loadProfiles"
        >
          {{ $t('inmates.legalProfiles.retry') }}
        </button>
      </div>
      <!--end::Error-->

      <!--begin::Content-->
      <div v-else>
        <!--begin::Statistics-->
        <div class="row g-4 mb-6">
          <!-- Total Perfiles -->
          <div class="col-md-6 col-lg-3">
            <div class="card bg-light-primary border-0 h-100">
              <div class="card-body d-flex flex-column justify-content-between p-6">
                <div class="d-flex align-items-center mb-3">
                  <div class="symbol symbol-40px me-3">
                    <div class="symbol-label bg-primary">
                      <i class="ki-duotone ki-briefcase fs-2 text-white">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <div class="text-muted fw-semibold fs-7">{{ $t('inmates.legalProfiles.statistics.total') }}</div>
                    <div class="fw-bold fs-3 text-gray-800">
                      {{ statistics.total }}
                    </div>
                  </div>
                </div>
                <div class="text-muted fw-semibold fs-6">{{ $t('inmates.legalProfiles.statistics.legalProfiles') }}</div>
              </div>
            </div>
          </div>

          <!-- Prisión Preventiva -->
          <div class="col-md-6 col-lg-3">
            <div class="card bg-light-warning border-0 h-100">
              <div class="card-body d-flex flex-column justify-content-between p-6">
                <div class="d-flex align-items-center mb-3">
                  <div class="symbol symbol-40px me-3">
                    <div class="symbol-label bg-warning">
                      <i class="ki-duotone ki-time fs-2 text-white">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <div class="text-muted fw-semibold fs-7">{{ $t('inmates.legalProfiles.statistics.preventive') }}</div>
                    <div class="fw-bold fs-3 text-gray-800">
                      {{ statistics.preventive }}
                    </div>
                  </div>
                </div>
                <div class="text-muted fw-semibold fs-6">{{ $t('inmates.legalProfiles.statistics.preventiveDetention') }}</div>
              </div>
            </div>
          </div>

          <!-- Condenados -->
          <div class="col-md-6 col-lg-3">
            <div class="card bg-light-success border-0 h-100">
              <div class="card-body d-flex flex-column justify-content-between p-6">
                <div class="d-flex align-items-center mb-3">
                  <div class="symbol symbol-40px me-3">
                    <div class="symbol-label bg-success">
                      <i class="ki-duotone ki-document fs-2 text-white">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <div class="text-muted fw-semibold fs-7">{{ $t('inmates.legalProfiles.statistics.sentenced') }}</div>
                    <div class="fw-bold fs-3 text-gray-800">
                      {{ statistics.sentenced }}
                    </div>
                  </div>
                </div>
                <div class="text-muted fw-semibold fs-6">{{ $t('inmates.legalProfiles.statistics.withSentence') }}</div>
              </div>
            </div>
          </div>

          <!-- Audiencias Pendientes -->
          <div class="col-md-6 col-lg-3">
            <div class="card bg-light-info border-0 h-100">
              <div class="card-body d-flex flex-column justify-content-between p-6">
                <div class="d-flex align-items-center mb-3">
                  <div class="symbol symbol-40px me-3">
                    <div class="symbol-label bg-info">
                      <i class="ki-duotone ki-calendar fs-2 text-white">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <div class="text-muted fw-semibold fs-7">{{ $t('inmates.legalProfiles.statistics.hearings') }}</div>
                    <div class="fw-bold fs-3 text-gray-800">
                      {{ statistics.pendingHearings }}
                    </div>
                  </div>
                </div>
                <div class="text-muted fw-semibold fs-6">{{ $t('inmates.legalProfiles.statistics.pending') }}</div>
              </div>
            </div>
          </div>
        </div>
        <!--end::Statistics-->

        <!--begin::Table-->
        <div v-if="profiles.length > 0" class="table-responsive">
          <table class="table align-middle table-row-dashed fs-6 gy-5">
            <!--begin::Table head-->
            <thead>
              <tr class="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                <th class="min-w-200px">{{ $t('inmates.legalProfiles.table.inmate') }}</th>
                <th class="min-w-125px">{{ $t('inmates.legalProfiles.table.case') }}</th>
                <th class="min-w-125px">{{ $t('inmates.legalProfiles.table.court') }}</th>
                <th class="min-w-100px">{{ $t('inmates.legalProfiles.table.status') }}</th>
                <th class="min-w-100px">{{ $t('inmates.legalProfiles.table.hearings') }}</th>
                <th class="min-w-100px">{{ $t('inmates.legalProfiles.table.crimes') }}</th>
                <th class="min-w-100px">{{ $t('inmates.legalProfiles.table.update') }}</th>
                <th class="text-end min-w-100px">{{ $t('inmates.legalProfiles.table.actions') }}</th>
              </tr>
            </thead>
            <!--end::Table head-->

            <!--begin::Table body-->
            <tbody class="text-gray-600 fw-semibold">
              <tr v-for="profile in profiles" :key="profile.id">
                <!--begin::Interno-->
                <td class="d-flex align-items-center">
                  <!--begin::Avatar-->
                  <div class="symbol symbol-circle symbol-50px overflow-hidden me-3">
                    <div class="symbol-label">
                      <img
                        v-if="getInmatePhoto(profile.inmate)"
                        :src="getInmatePhoto(profile.inmate)"
                        :alt="profile.inmate?.full_name || $t('inmates.legalProfiles.table.inmate')"
                        class="w-100"
                      />
                      <span
                        v-else
                        class="bg-light-primary text-primary d-flex align-items-center justify-content-center w-100 h-100 fs-4 fw-bold"
                      >
                        {{ getInitials(profile.inmate?.first_name, profile.inmate?.last_name) }}
                      </span>
                    </div>
                  </div>
                  <!--end::Avatar-->
                  <!--begin::User details-->
                  <div class="d-flex flex-column">
                    <router-link
                      :to="`/inmates/${profile.inmate?.id}`"
                      class="text-gray-800 text-hover-primary mb-1"
                    >
                      {{ profile.inmate?.full_name || $t('inmates.legalProfiles.noName') }}
                    </router-link>
                    <span class="text-muted">{{ profile.inmate?.document_number || 'N/A' }}</span>
                  </div>
                  <!--end::User details-->
                </td>
                <!--end::Interno-->

                <!--begin::Caso-->
                <td>
                  <div class="d-flex flex-column">
                    <span class="text-gray-800 mb-1">{{ profile.case_number || 'N/A' }}</span>
                    <span class="text-muted fs-7">{{ profile.judicial_file_number || $t('inmates.legalProfiles.noFile') }}</span>
                  </div>
                </td>
                <!--end::Caso-->

                <!--begin::Tribunal-->
                <td>
                  <span class="text-gray-800">{{ profile.court?.name || 'N/A' }}</span>
                </td>
                <!--end::Tribunal-->

                <!--begin::Estado-->
                <td>
                  <span class="badge" :class="getStatusBadgeClass(profile)">
                    {{ getStatusLabel(profile) }}
                  </span>
                </td>
                <!--end::Estado-->

                <!--begin::Audiencias-->
                <td>
                  <span class="text-gray-800 fw-bold">{{ profile.hearings_count || 0 }}</span>
                </td>
                <!--end::Audiencias-->

                <!--begin::Delitos-->
                <td>
                  <span class="text-gray-800 fw-bold">{{ profile.crimes_count || 0 }}</span>
                </td>
                <!--end::Delitos-->

                <!--begin::Actualización-->
                <td>
                  {{ formatDate(profile.updated_at) }}
                </td>
                <!--end::Actualización-->

                <!--begin::Actions-->
                <td class="text-end">
                  <div class="btn-group" role="group">
                    <button
                      type="button"
                      class="btn btn-sm btn-light btn-active-light-primary dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      {{ $t('inmates.legalProfiles.actions.actions') }}
                    </button>
                    <ul class="dropdown-menu">
                      <li>
                        <router-link
                          :to="`/inmates/${profile.inmate?.id}`"
                          class="dropdown-item"
                        >
                          <i class="ki-duotone ki-eye fs-6 me-2"></i>
                          {{ $t('inmates.legalProfiles.actions.viewInmate') }}
                        </router-link>
                      </li>
                      <li v-if="canEdit">
                        <a
                          href="#"
                          class="dropdown-item"
                          @click.prevent="editProfile(profile)"
                        >
                          <i class="ki-duotone ki-pencil fs-6 me-2"></i>
                          {{ $t('inmates.legalProfiles.actions.editProfile') }}
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
        <div v-else class="text-center py-10">
          <div class="mx-auto mb-4">
            <i class="ki-duotone ki-briefcase fs-5x text-gray-400">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
          <div class="fs-6 text-gray-600 mb-4">
            {{ $t('inmates.legalProfiles.emptyState') }}
          </div>
          <button
            v-if="hasActiveFilters"
            type="button"
            class="btn btn-light-primary"
            @click="clearFilters"
          >
            {{ $t('inmates.legalProfiles.clearFilters') }}
          </button>
        </div>
        <!--end::Empty state-->

        <!--begin::Pagination-->
        <div
          v-if="pagination.last_page > 1"
          class="d-flex flex-stack flex-wrap pt-10"
        >
          <div class="fs-6 fw-semibold text-gray-700">
            {{ $t('inmates.legalProfiles.pagination.showing') }}
            {{ (pagination.current_page - 1) * pagination.per_page + 1 }} {{ $t('inmates.legalProfiles.pagination.to') }}
            {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}
            {{ $t('inmates.legalProfiles.pagination.of') }} {{ pagination.total }} {{ $t('inmates.legalProfiles.pagination.records') }}
          </div>

          <nav :aria-label="$t('inmates.legalProfiles.pagination.previous')">
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
                  {{ $t('inmates.legalProfiles.pagination.previous') }}
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
                :class="{ disabled: pagination.current_page === pagination.last_page }"
              >
                <button
                  class="page-link"
                  @click="changePage(pagination.current_page + 1)"
                  :disabled="pagination.current_page === pagination.last_page"
                >
                  {{ $t('inmates.legalProfiles.pagination.next') }}
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
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { useCatalogs } from '@/composables/useCatalogs';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const { centersOptions, loadCatalogs: loadCatalogData } = useCatalogs();

// State
const loading = ref(false);
const error = ref<string | null>(null);
const searchTerm = ref('');
const showFilters = ref(false);
const profiles = ref<any[]>([]);
const proceduralStatuses = ref<any[]>([]);

const filters = ref({
  center_id: '' as string | number,
  procedural_status_id: '' as string | number,
  profile_type: '' as string,
});

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
});

const statistics = ref({
  total: 0,
  preventive: 0,
  sentenced: 0,
  pendingHearings: 0,
});

// Computed
const canCreate = computed(() => authStore.hasPermission('inmates.legal_edit'));
const canEdit = computed(() => authStore.hasPermission('inmates.legal_edit'));

const hasActiveFilters = computed(() => {
  return !!(
    searchTerm.value ||
    filters.value.center_id ||
    filters.value.procedural_status_id ||
    filters.value.profile_type
  );
});

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
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    }
  }

  return pages;
});

// Methods
const loadProfiles = async () => {
  try {
    loading.value = true;
    error.value = null;

    const params = new URLSearchParams();
    params.append('page', pagination.value.current_page.toString());
    params.append('per_page', pagination.value.per_page.toString());

    if (searchTerm.value) {
      params.append('search', searchTerm.value);
    }
    if (filters.value.center_id) {
      params.append('center_id', filters.value.center_id.toString());
    }
    if (filters.value.procedural_status_id) {
      params.append('procedural_status_id', filters.value.procedural_status_id.toString());
    }

    const response = await ApiService.get(`/inmate-legal-profiles?${params.toString()}`);

    if (response.data?.data) {
      const paginatedData = response.data.data;
      profiles.value = paginatedData.data || [];

      pagination.value = {
        current_page: paginatedData.current_page || 1,
        last_page: paginatedData.last_page || 1,
        per_page: paginatedData.per_page || 15,
        total: paginatedData.total || 0,
      };

      // Calculate statistics from current page
      updateStatistics();
    }
  } catch (err: any) {
    console.error('Error loading profiles:', err);
    error.value = err.response?.data?.message || t('inmates.legalProfiles.swal.errorLoading');
  } finally {
    loading.value = false;
  }
};

const updateStatistics = () => {
  statistics.value.total = pagination.value.total;
  statistics.value.preventive = profiles.value.filter(p => p.in_preventive_detention).length;
  statistics.value.sentenced = profiles.value.filter(p => p.sentence_start_date).length;
  statistics.value.pendingHearings = profiles.value.reduce((sum, p) => sum + (p.hearings_count || 0), 0);
};

const loadProceduralStatuses = async () => {
  try {
    const response = await ApiService.get('/catalogs/procedural-statuses');
    if (response.data?.data) {
      proceduralStatuses.value = response.data.data;
    }
  } catch (err) {
    console.error('Error loading procedural statuses:', err);
  }
};

let searchTimeout: any = null;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.value.current_page = 1;
    loadProfiles();
  }, 300);
};

const handleFilterChange = () => {
  pagination.value.current_page = 1;
  loadProfiles();
};

const clearFilters = () => {
  searchTerm.value = '';
  filters.value = {
    center_id: '',
    procedural_status_id: '',
    profile_type: '',
  };
  pagination.value.current_page = 1;
  loadProfiles();
};

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    pagination.value.current_page = page;
    loadProfiles();
  }
};

const createProfile = async () => {
  // Pre-fetch translations for Swal HTML content
  const swalText = {
    title: t('inmates.legalProfiles.swal.createTitle'),
    instructions: t('inmates.legalProfiles.swal.createInstructions'),
    step1: t('inmates.legalProfiles.swal.step1'),
    step2: t('inmates.legalProfiles.swal.step2'),
    step3: t('inmates.legalProfiles.swal.step3'),
    step4: t('inmates.legalProfiles.swal.step4'),
    goToList: t('inmates.legalProfiles.swal.goToList'),
    cancel: t('inmates.legalProfiles.swal.cancel'),
  };

  const result = await Swal.fire({
    title: swalText.title,
    html: `
      <div class="text-start">
        <p class="mb-3">${swalText.instructions}</p>
        <ol class="text-muted fs-7">
          <li>${swalText.step1}</li>
          <li>${swalText.step2}</li>
          <li>${swalText.step3}</li>
          <li>${swalText.step4}</li>
        </ol>
      </div>
    `,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: swalText.goToList,
    cancelButtonText: swalText.cancel
  });

  if (result.isConfirmed) {
    router.push('/inmates');
  }
};

const editProfile = (profile: any) => {
  router.push(`/inmates/${profile.inmate?.id}?tab=legal`);
};

// Helper functions
const getInitials = (firstName?: string, lastName?: string) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

const getInmatePhoto = (inmate: any): string | null => {
  // Primero verificar photo_url (del backend transformado)
  if (inmate?.photo_url) {
    return inmate.photo_url;
  }
  // Luego verificar photo_path directo
  if (inmate?.photo_path) {
    return inmate.photo_path;
  }
  // Finalmente buscar en el array de fotos
  if (inmate?.photos && inmate.photos.length > 0) {
    const currentPhoto = inmate.photos.find((photo: any) => photo.is_current);
    const photoToUse = currentPhoto || inmate.photos[0];
    return photoToUse.photo_path || null;
  }
  return null;
};

const getStatusBadgeClass = (profile: any) => {
  if (profile.sentence_start_date) {
    return 'badge-light-success';
  }
  if (profile.in_preventive_detention) {
    return 'badge-light-warning';
  }
  return 'badge-light-info';
};

const getStatusLabel = (profile: any) => {
  if (profile.sentence_start_date) {
    return t('inmates.legalProfiles.statuses.sentenced');
  }
  if (profile.in_preventive_detention) {
    return t('inmates.legalProfiles.statuses.preventiveDetention');
  }
  return t('inmates.legalProfiles.statuses.inProcess');
};

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadProfiles(),
    loadProceduralStatuses(),
    loadCatalogData()
  ]);
});
</script>

<style scoped>
.page-link {
  cursor: pointer;
}

.page-item.disabled .page-link {
  cursor: not-allowed;
}
</style>
