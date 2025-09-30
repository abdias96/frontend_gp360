<template>
  <div class="d-flex flex-column">
    <!--begin::Content-->
    <div class="flex-lg-row-fluid">
      <!--begin::Card-->
      <div class="card">
        <!--begin::Card header-->
        <div class="card-header border-0 pt-6">
          <div class="card-title">
            <div class="d-flex align-items-center position-relative my-1">
              <KTIcon
                icon-name="abstract-26"
                icon-class="fs-1 position-absolute ms-6"
              />
              <input
                v-model="searchQuery"
                @input="handleSearch"
                type="text"
                class="form-control form-control-solid w-250px ps-14"
                :placeholder="$t('common.cache.searchPlaceholder')"
              />
            </div>
          </div>
          <div class="card-toolbar">
            <div class="d-flex justify-content-end">
              <div class="me-4">
                <div class="form-check form-switch">
                  <input
                    v-model="showExpired"
                    @change="loadCacheEntries"
                    class="form-check-input"
                    type="checkbox"
                    id="showExpired"
                  />
                  <label class="form-check-label" for="showExpired">
                    {{ $t("common.cache.showExpired") }}
                  </label>
                </div>
              </div>
              <button
                @click="showCreateModal = true"
                type="button"
                class="btn btn-success me-3"
              >
                <KTIcon icon-name="plus" icon-class="fs-2" />
                {{ $t("common.cache.createEntry") }}
              </button>
              <button
                @click="clearExpiredEntries"
                type="button"
                class="btn btn-warning me-3"
                :disabled="loading"
              >
                <KTIcon icon-name="trash" icon-class="fs-2" />
                {{ $t("common.cache.clearExpired") }}
              </button>
              <button
                @click="showFlushModal = true"
                type="button"
                class="btn btn-danger"
              >
                <KTIcon icon-name="cross" icon-class="fs-2" />
                {{ $t("common.cache.flushAll") }}
              </button>
            </div>
          </div>
        </div>
        <!--end::Card header-->

        <!--begin::Stats Cards-->
        <div class="card-body pb-0">
          <div class="row mb-6">
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card bg-light-primary border-0">
                <div class="card-body text-center py-6">
                  <KTIcon
                    icon-name="abstract-26"
                    icon-class="fs-2x text-primary mb-3"
                  />
                  <h3 class="text-primary">{{ stats.total_entries || 0 }}</h3>
                  <p class="text-muted mb-0">
                    {{ $t("common.cache.totalEntries") }}
                  </p>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card bg-light-info border-0">
                <div class="card-body text-center py-6">
                  <KTIcon
                    icon-name="folder"
                    icon-class="fs-2x text-info mb-3"
                  />
                  <h3 class="text-info">
                    {{ stats.total_size_formatted || "0 B" }}
                  </h3>
                  <p class="text-muted mb-0">
                    {{ $t("common.cache.totalSize") }}
                  </p>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card bg-light-warning border-0">
                <div class="card-body text-center py-6">
                  <KTIcon
                    icon-name="time"
                    icon-class="fs-2x text-warning mb-3"
                  />
                  <h3 class="text-warning">{{ stats.expired_entries || 0 }}</h3>
                  <p class="text-muted mb-0">
                    {{ $t("common.cache.expiredEntries") }}
                  </p>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card bg-light-success border-0">
                <div class="card-body text-center py-6">
                  <KTIcon
                    icon-name="gear"
                    icon-class="fs-2x text-success mb-3"
                  />
                  <h3 class="text-success">{{ stats.driver || "-" }}</h3>
                  <p class="text-muted mb-0">{{ $t("common.cache.driver") }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--end::Stats Cards-->

        <!--begin::Card body-->
        <div class="card-body py-4">
          <!--begin::Table container-->
          <div class="table-responsive">
            <!--begin::Table-->
            <table class="table align-middle table-row-dashed fs-6 gy-5">
              <!--begin::Table head-->
              <thead>
                <tr
                  class="text-start text-muted fw-bold fs-7 text-uppercase gs-0"
                >
                  <th class="min-w-125px">{{ $t("common.cache.key") }}</th>
                  <th class="min-w-125px">
                    {{ $t("common.cache.expiresAt") }}
                  </th>
                  <th class="min-w-125px">
                    {{ $t("common.cache.expiresIn") }}
                  </th>
                  <th class="min-w-125px">{{ $t("common.cache.size") }}</th>
                  <th class="min-w-70px">{{ $t("common.cache.status") }}</th>
                  <th class="text-end min-w-100px">
                    {{ $t("common.actions.title") }}
                  </th>
                </tr>
              </thead>
              <!--end::Table head-->
              <!--begin::Table body-->
              <tbody class="text-gray-600 fw-semibold">
                <tr v-if="loading">
                  <td colspan="6" class="text-center py-8">
                    <div
                      class="spinner-border spinner-border-sm text-primary"
                      role="status"
                    >
                      <span class="visually-hidden"
                        >{{ $t("common.loading") }}...</span
                      >
                    </div>
                  </td>
                </tr>
                <tr v-else-if="entries.data?.length === 0">
                  <td colspan="6" class="text-center py-8">
                    <div class="d-flex flex-column align-items-center">
                      <KTIcon
                        icon-name="abstract-26"
                        icon-class="fs-2x text-muted mb-3"
                      />
                      <span class="text-muted">{{
                        $t("common.cache.noEntries")
                      }}</span>
                    </div>
                  </td>
                </tr>
                <tr v-else v-for="entry in entries.data" :key="entry.key">
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="d-flex justify-content-start flex-column">
                        <span class="text-dark fw-bold text-hover-primary fs-6">
                          {{ truncateKey(entry.key) }}
                        </span>
                        <span
                          v-if="entry.key.length > 50"
                          class="text-muted fs-7"
                        >
                          {{ entry.key }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="text-dark fw-semibold d-block fs-7">
                      {{ formatDateTime(entry.expires_at) }}
                    </span>
                  </td>
                  <td>
                    <span
                      :class="[
                        'badge',
                        entry.is_expired
                          ? 'badge-danger'
                          : entry.expires_in_seconds < 300
                            ? 'badge-warning'
                            : 'badge-success',
                      ]"
                    >
                      {{
                        entry.is_expired
                          ? $t("common.cache.expired")
                          : formatDuration(entry.expires_in_seconds)
                      }}
                    </span>
                  </td>
                  <td>
                    <span class="text-dark fw-semibold d-block fs-7">
                      {{ entry.size_formatted }}
                    </span>
                  </td>
                  <td>
                    <span
                      :class="[
                        'badge',
                        entry.is_expired ? 'badge-danger' : 'badge-success',
                      ]"
                    >
                      {{
                        entry.is_expired
                          ? $t("common.cache.expired")
                          : $t("common.cache.active")
                      }}
                    </span>
                  </td>
                  <td class="text-end">
                    <div class="d-flex justify-content-end flex-shrink-0">
                      <button
                        @click="viewEntry(entry.key)"
                        class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                        :title="$t('common.actions.view')"
                      >
                        <KTIcon icon-name="eye" icon-class="fs-3" />
                      </button>
                      <button
                        @click="editEntry(entry)"
                        class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                        :title="$t('common.actions.edit')"
                      >
                        <KTIcon icon-name="pencil" icon-class="fs-3" />
                      </button>
                      <button
                        @click="deleteEntry(entry.key)"
                        class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                        :title="$t('common.actions.delete')"
                      >
                        <KTIcon icon-name="trash" icon-class="fs-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
              <!--end::Table body-->
            </table>
            <!--end::Table-->
          </div>
          <!--end::Table container-->

          <!-- Pagination -->
          <div v-if="entries.last_page > 1" class="row">
            <div
              class="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start"
            >
              <div class="dataTables_length">
                <select
                  v-model="perPage"
                  @change="loadCacheEntries"
                  class="form-select form-select-sm"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
            <div
              class="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end"
            >
              <div class="dataTables_paginate">
                <ul class="pagination">
                  <li
                    :class="[
                      'page-item',
                      { disabled: entries.current_page === 1 },
                    ]"
                  >
                    <a
                      @click="changePage(entries.current_page - 1)"
                      class="page-link"
                    >
                      <i class="previous"></i>
                    </a>
                  </li>
                  <li
                    v-for="page in visiblePages"
                    :key="page"
                    :class="[
                      'page-item',
                      { active: entries.current_page === page },
                    ]"
                  >
                    <a @click="changePage(page)" class="page-link">{{
                      page
                    }}</a>
                  </li>
                  <li
                    :class="[
                      'page-item',
                      { disabled: entries.current_page === entries.last_page },
                    ]"
                  >
                    <a
                      @click="changePage(entries.current_page + 1)"
                      class="page-link"
                    >
                      <i class="next"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <!--end::Card body-->
      </div>
      <!--end::Card-->
    </div>
    <!--end::Content-->
  </div>

  <!-- Create/Edit Modal -->
  <div
    v-if="showCreateModal || showEditModal"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">
            {{
              showEditModal
                ? $t("common.cache.editEntry")
                : $t("common.cache.createEntry")
            }}
          </h2>
          <button @click="closeModal" type="button" class="btn-close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-6">
              <label class="form-label required">{{
                $t("common.cache.key")
              }}</label>
              <input
                v-model="currentEntry.key"
                :disabled="showEditModal"
                type="text"
                class="form-control"
                :placeholder="$t('common.cache.keyPlaceholder')"
              />
            </div>

            <div class="mb-6">
              <label class="form-label required">{{
                $t("common.cache.value")
              }}</label>
              <textarea
                v-model="currentEntry.value"
                class="form-control"
                rows="8"
                :placeholder="$t('common.cache.valuePlaceholder')"
              ></textarea>
            </div>

            <div class="mb-6">
              <label class="form-label"
                >{{ $t("common.cache.ttl") }} ({{
                  $t("common.cache.seconds")
                }})</label
              >
              <input
                v-model.number="currentEntry.ttl"
                type="number"
                class="form-control"
                min="1"
                max="31536000"
                :placeholder="$t('common.cache.ttlPlaceholder')"
              />
              <div class="form-text">{{ $t("common.cache.ttlHelp") }}</div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" type="button" class="btn btn-light">
            {{ $t("common.actions.cancel") }}
          </button>
          <button
            @click="saveEntry"
            type="button"
            class="btn btn-primary"
            :disabled="!currentEntry.key || !currentEntry.value"
          >
            {{ $t("common.actions.save") }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- View Modal -->
  <div
    v-if="showViewModal"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">{{ $t("common.cache.viewEntry") }}</h2>
          <button
            @click="showViewModal = false"
            type="button"
            class="btn-close"
          ></button>
        </div>
        <div class="modal-body">
          <div v-if="viewData" class="row">
            <div class="col-md-6">
              <div class="mb-4">
                <label class="form-label fw-bold"
                  >{{ $t("common.cache.key") }}:</label
                >
                <div class="form-control-plaintext">{{ viewData.key }}</div>
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold"
                  >{{ $t("common.cache.expiresAt") }}:</label
                >
                <div class="form-control-plaintext">
                  {{ formatDateTime(viewData.expires_at) }}
                </div>
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold"
                  >{{ $t("common.cache.expiresIn") }}:</label
                >
                <div class="form-control-plaintext">
                  <span
                    :class="[
                      'badge',
                      viewData.is_expired
                        ? 'badge-danger'
                        : viewData.expires_in_seconds < 300
                          ? 'badge-warning'
                          : 'badge-success',
                    ]"
                  >
                    {{
                      viewData.is_expired
                        ? $t("common.cache.expired")
                        : formatDuration(viewData.expires_in_seconds)
                    }}
                  </span>
                </div>
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold"
                  >{{ $t("common.cache.size") }}:</label
                >
                <div class="form-control-plaintext">
                  {{ viewData.size_formatted }}
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="mb-4">
                <label class="form-label fw-bold"
                  >{{ $t("common.cache.value") }}:</label
                >
                <pre
                  class="form-control"
                  style="height: 300px; overflow-y: auto"
                  >{{ viewData.value }}</pre
                >
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            @click="showViewModal = false"
            type="button"
            class="btn btn-light"
          >
            {{ $t("common.actions.close") }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Flush Confirmation Modal -->
  <div
    v-if="showFlushModal"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">{{ $t("common.cache.confirmFlush") }}</h2>
          <button
            @click="showFlushModal = false"
            type="button"
            class="btn-close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="text-center">
            <KTIcon
              icon-name="exclamation-triangle"
              icon-class="fs-2x text-warning mb-3"
            />
            <p class="fs-6">{{ $t("common.cache.flushWarning") }}</p>
            <p class="text-muted">
              {{ $t("common.cache.flushWarningDetails") }}
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button
            @click="showFlushModal = false"
            type="button"
            class="btn btn-light"
          >
            {{ $t("common.actions.cancel") }}
          </button>
          <button @click="flushCache" type="button" class="btn btn-danger">
            {{ $t("common.cache.flushAll") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ===========================
// Imports
// ===========================
import { ref, onMounted, computed } from "vue";
import ApiService from "@/core/services/ApiService";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import Swal from "sweetalert2";

// ===========================
// Types
// ===========================
interface CacheEntry {
  key: string;
  expires_at: string;
  expires_in_seconds: number;
  size_bytes: number;
  size_formatted: string;
  is_expired: boolean;
}

interface CacheStats {
  total_entries: number;
  total_size_bytes: number;
  total_size_formatted: string;
  expired_entries: number;
  cache_locks: number;
  driver: string;
  prefix: string;
}

interface PaginatedEntries {
  data: CacheEntry[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ===========================
// State
// ===========================
const loading = ref(false);
const entries = ref<PaginatedEntries>({
  data: [],
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
});
const stats = ref<CacheStats>({
  total_entries: 0,
  total_size_bytes: 0,
  total_size_formatted: "0 B",
  expired_entries: 0,
  cache_locks: 0,
  driver: "-",
  prefix: "",
});

const searchQuery = ref("");
const showExpired = ref(false);
const perPage = ref(15);
const currentPage = ref(1);

// Modals
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showViewModal = ref(false);
const showFlushModal = ref(false);

// Current entry data
const currentEntry = ref({
  key: "",
  value: "",
  ttl: 3600,
});

const viewData = ref<CacheEntry | null>(null);

// Search timeout
let searchTimeout: NodeJS.Timeout;

const visiblePages = computed(() => {
  const pages: number[] = [];
  const start = Math.max(1, entries.value.current_page - 2);
  const end = Math.min(entries.value.last_page, entries.value.current_page + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const loadStats = async () => {
  try {
    const response = await ApiService.get("cache/stats");
    if (response.data?.status === "success") {
      stats.value = response.data.data;
    }
  } catch (error) {
    console.error("Error loading cache stats:", error);
  }
};

const loadCacheEntries = async (page: number = currentPage.value) => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.value.toString(),
      show_expired: showExpired.value.toString(),
    });

    if (searchQuery.value) {
      params.append("search", searchQuery.value);
    }

    const response = await ApiService.get(`cache?${params}`);

    if (response.data?.status === "success") {
      entries.value = response.data.data;
      currentPage.value = page;
    }
  } catch (error) {
    console.error("Error loading cache entries:", error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    loadCacheEntries(1);
  }, 300);
};

const changePage = (page: number) => {
  if (page >= 1 && page <= entries.value.last_page) {
    loadCacheEntries(page);
  }
};

const viewEntry = async (key: string) => {
  try {
    const response = await ApiService.get(`cache/${encodeURIComponent(key)}`);
    if (response.data?.status === "success") {
      viewData.value = response.data.data;
      showViewModal.value = true;
    }
  } catch (error) {
    console.error("Error viewing cache entry:", error);
  }
};

const editEntry = async (entry: CacheEntry) => {
  try {
    const response = await ApiService.get(
      `cache/${encodeURIComponent(entry.key)}`,
    );
    if (response.data?.status === "success") {
      const data = response.data.data;
      currentEntry.value = {
        key: data.key,
        value: data.value,
        ttl: Math.max(60, data.expires_in_seconds),
      };
      showEditModal.value = true;
    }
  } catch (error) {
    console.error("Error loading cache entry for edit:", error);
  }
};

const saveEntry = async () => {
  try {
    const url = showEditModal.value
      ? `cache/${encodeURIComponent(currentEntry.value.key)}`
      : "cache";

    const method = showEditModal.value ? "put" : "post";

    const response = await ApiService[method](url, {
      key: currentEntry.value.key,
      value: currentEntry.value.value,
      ttl: currentEntry.value.ttl,
    });

    if (response.data?.status === "success") {
      await Swal.fire({
        icon: "success",
        title: "Éxito",
        text: response.data.message,
        timer: 2000,
        showConfirmButton: false,
      });

      closeModal();
      loadCacheEntries();
      loadStats();
    }
  } catch (error: any) {
    console.error("Error saving cache entry:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "Error al guardar la entrada",
    });
  }
};

const deleteEntry = async (key: string) => {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: `Se eliminará la entrada: ${key}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      const response = await ApiService.delete(
        `cache/${encodeURIComponent(key)}`,
      );
      if (response.data?.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: response.data.message,
          timer: 2000,
          showConfirmButton: false,
        });

        loadCacheEntries();
        loadStats();
      }
    } catch (error: any) {
      console.error("Error deleting cache entry:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error al eliminar la entrada",
      });
    }
  }
};

const clearExpiredEntries = async () => {
  const result = await Swal.fire({
    title: "¿Limpiar entradas expiradas?",
    text: "Se eliminarán todas las entradas expiradas del cache",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, limpiar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      const response = await ApiService.post("cache/clear-expired");
      if (response.data?.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Éxito",
          text: response.data.message,
          timer: 3000,
          showConfirmButton: false,
        });

        loadCacheEntries();
        loadStats();
      }
    } catch (error: any) {
      console.error("Error clearing expired entries:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Error al limpiar entradas expiradas",
      });
    }
  }
};

const flushCache = async () => {
  try {
    const response = await ApiService.post("cache/flush");
    if (response.data?.status === "success") {
      await Swal.fire({
        icon: "success",
        title: "Cache limpiado",
        text: response.data.message,
        timer: 3000,
        showConfirmButton: false,
      });

      showFlushModal.value = false;
      loadCacheEntries();
      loadStats();
    }
  } catch (error: any) {
    console.error("Error flushing cache:", error);
    showFlushModal.value = false;
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "Error al limpiar el cache",
    });
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  currentEntry.value = {
    key: "",
    value: "",
    ttl: 3600,
  };
};

const truncateKey = (key: string, maxLength: number = 50) => {
  return key.length > maxLength ? key.substring(0, maxLength) + "..." : key;
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
};

onMounted(() => {
  loadStats();
  loadCacheEntries();
});

// ===========================
// Lifecycle
// ===========================
onMounted(() => {
  loadStats();
  loadCacheEntries();
});
</script>

<style scoped>
.page-link {
  cursor: pointer;
}

.page-item.disabled .page-link {
  cursor: not-allowed;
}

pre {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
}

[data-bs-theme="dark"] pre {
  background-color: var(--bs-gray-800);
  border-color: var(--bs-gray-700);
  color: var(--bs-gray-100);
}
</style>
