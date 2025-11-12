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
            placeholder="Buscar por interno o número de traslado..."
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

          <!--begin::Refresh-->
          <button
            type="button"
            class="btn btn-light-info"
            @click="fetchTransfers"
          >
            <i class="ki-duotone ki-arrows-circle fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Actualizar
          </button>
          <!--end::Refresh-->
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
            <label class="form-label fs-7 fw-bold">Estado</label>
            <select
              v-model="filters.status"
              class="form-select form-select-solid"
              @change="handleFilterChange"
            >
              <option value="">Todos los estados</option>
              <option value="scheduled">Programado</option>
              <option value="approved">Aprobado</option>
              <option value="in_transit">En Tránsito</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label fs-7 fw-bold">Centro Origen</label>
            <select
              v-model="filters.from_center_id"
              class="form-select form-select-solid"
              @change="handleFilterChange"
            >
              <option value="">Todos los centros</option>
              <option
                v-for="center in centers"
                :key="center.id"
                :value="center.id"
              >
                {{ center.name }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label fs-7 fw-bold">Centro Destino</label>
            <select
              v-model="filters.to_center_id"
              class="form-select form-select-solid"
              @change="handleFilterChange"
            >
              <option value="">Todos los centros</option>
              <option
                v-for="center in centers"
                :key="center.id"
                :value="center.id"
              >
                {{ center.name }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label fs-7 fw-bold">Fecha Desde</label>
            <input
              type="date"
              v-model="filters.transfer_date_from"
              class="form-control form-control-solid"
              @change="handleFilterChange"
            />
          </div>
        </div>
        <div class="d-flex justify-content-end mt-3">
          <button
            type="button"
            class="btn btn-light-secondary"
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
          @click="fetchTransfers"
        >
          Reintentar
        </button>
      </div>
      <!--end::Error-->

      <!--begin::Content-->
      <div v-else>
        <!--begin::Statistics-->
        <div v-if="statistics" class="row g-4 mb-6">
          <!-- Programados -->
          <div class="col-md-6 col-lg-3">
            <div class="card bg-light-warning border-0 h-100">
              <div class="card-body d-flex flex-column justify-content-between p-6">
                <div class="d-flex align-items-center mb-3">
                  <div class="symbol symbol-40px me-3">
                    <div class="symbol-label bg-warning">
                      <i class="ki-duotone ki-calendar fs-2 text-white">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <div class="text-muted fw-semibold fs-7">Programados</div>
                    <div class="fw-bold fs-3 text-gray-800">
                      {{ statistics.scheduled_transfers || 0 }}
                    </div>
                  </div>
                </div>
                <div class="text-muted fw-semibold fs-6">Pendientes Aprobación</div>
              </div>
            </div>
          </div>

          <!-- En Tránsito -->
          <div class="col-md-6 col-lg-3">
            <div class="card bg-light-info border-0 h-100">
              <div class="card-body d-flex flex-column justify-content-between p-6">
                <div class="d-flex align-items-center mb-3">
                  <div class="symbol symbol-40px me-3">
                    <div class="symbol-label bg-info">
                      <i class="ki-duotone ki-directbox-default fs-2 text-white">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                        <span class="path4"></span>
                      </i>
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <div class="text-muted fw-semibold fs-7">En Tránsito</div>
                    <div class="fw-bold fs-3 text-gray-800">
                      {{ statistics.in_transit_transfers || 0 }}
                    </div>
                  </div>
                </div>
                <div class="text-muted fw-semibold fs-6">Traslados Activos</div>
              </div>
            </div>
          </div>

          <!-- Completados -->
          <div class="col-md-6 col-lg-3">
            <div class="card bg-light-success border-0 h-100">
              <div class="card-body d-flex flex-column justify-content-between p-6">
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
                    <div class="text-muted fw-semibold fs-7">Completados</div>
                    <div class="fw-bold fs-3 text-gray-800">
                      {{ statistics.completed_transfers || 0 }}
                    </div>
                  </div>
                </div>
                <div class="text-muted fw-semibold fs-6">Total Traslados</div>
              </div>
            </div>
          </div>

          <!-- Cancelados -->
          <div class="col-md-6 col-lg-3">
            <div class="card bg-light-danger border-0 h-100">
              <div class="card-body d-flex flex-column justify-content-between p-6">
                <div class="d-flex align-items-center mb-3">
                  <div class="symbol symbol-40px me-3">
                    <div class="symbol-label bg-danger">
                      <i class="ki-duotone ki-cross fs-2 text-white">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <div class="text-muted fw-semibold fs-7">Cancelados</div>
                    <div class="fw-bold fs-3 text-gray-800">
                      {{ statistics.cancelled_transfers || 0 }}
                    </div>
                  </div>
                </div>
                <div class="text-muted fw-semibold fs-6">Traslados Cancelados</div>
              </div>
            </div>
          </div>
        </div>
        <!--end::Statistics-->

        <!--begin::Table-->
        <div v-if="transfers.length > 0" class="table-responsive">
          <table class="table align-middle table-row-dashed fs-6 gy-5">
            <!--begin::Table head-->
            <thead>
              <tr class="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                <th class="min-w-150px">Número Traslado</th>
                <th class="min-w-200px">Interno</th>
                <th class="min-w-150px">Origen</th>
                <th class="min-w-150px">Destino</th>
                <th class="min-w-125px">Fecha Programada</th>
                <th class="min-w-100px">Estado</th>
                <th class="text-end min-w-150px">Acciones</th>
              </tr>
            </thead>
            <!--end::Table head-->

            <!--begin::Table body-->
            <tbody class="text-gray-600 fw-semibold">
              <tr v-for="transfer in transfers" :key="transfer.id">
                <!--begin::Transfer Number-->
                <td>
                  <span class="text-gray-800 fw-bold">{{ transfer.transfer_number }}</span>
                </td>
                <!--end::Transfer Number-->

                <!--begin::Inmate-->
                <td>
                  <div class="d-flex flex-column">
                    <span class="text-gray-800 mb-1">{{ getInmateName(transfer.inmate) }}</span>
                    <span class="text-muted">{{ transfer.inmate?.inmate_number || 'N/A' }}</span>
                  </div>
                </td>
                <!--end::Inmate-->

                <!--begin::Origin-->
                <td>
                  <div class="d-flex flex-column">
                    <span class="text-gray-800 mb-1">{{ transfer.origin_center?.name || 'N/A' }}</span>
                    <span class="text-muted">{{ transfer.origin_sector?.name || '' }}</span>
                  </div>
                </td>
                <!--end::Origin-->

                <!--begin::Destination-->
                <td>
                  <div class="d-flex flex-column">
                    <span class="text-gray-800 mb-1">{{ transfer.destination_center?.name || 'N/A' }}</span>
                    <span class="text-muted">{{ transfer.destination_sector?.name || '' }}</span>
                  </div>
                </td>
                <!--end::Destination-->

                <!--begin::Date-->
                <td>
                  {{ formatDate(transfer.scheduled_departure_datetime) }}
                </td>
                <!--end::Date-->

                <!--begin::Status-->
                <td>
                  <span :class="getStatusBadgeClass(transfer.status)">
                    {{ getStatusLabel(transfer.status) }}
                  </span>
                </td>
                <!--end::Status-->

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
                        <a
                          href="#"
                          class="dropdown-item"
                          @click.prevent="viewTransfer(transfer)"
                        >
                          <i class="ki-duotone ki-eye fs-6 me-2"></i>
                          Ver Detalle
                        </a>
                      </li>

                      <!-- Scheduled: Can approve/reject -->
                      <template v-if="transfer.status === 'scheduled'">
                        <li v-if="canApprove">
                          <a
                            href="#"
                            class="dropdown-item text-success"
                            @click.prevent="approveTransfer(transfer)"
                          >
                            <i class="ki-duotone ki-check fs-6 me-2"></i>
                            Aprobar
                          </a>
                        </li>
                        <li v-if="canApprove">
                          <a
                            href="#"
                            class="dropdown-item text-danger"
                            @click.prevent="rejectTransfer(transfer)"
                          >
                            <i class="ki-duotone ki-cross fs-6 me-2"></i>
                            Rechazar
                          </a>
                        </li>
                      </template>

                      <!-- Approved: Can initiate -->
                      <template v-if="transfer.status === 'approved'">
                        <li v-if="canInitiate">
                          <a
                            href="#"
                            class="dropdown-item text-primary"
                            @click.prevent="initiateTransfer(transfer)"
                          >
                            <i class="ki-duotone ki-send fs-6 me-2"></i>
                            Iniciar Traslado
                          </a>
                        </li>
                      </template>

                      <!-- In Transit: Can complete -->
                      <template v-if="transfer.status === 'in_transit'">
                        <li v-if="canComplete">
                          <a
                            href="#"
                            class="dropdown-item text-success"
                            @click.prevent="completeTransfer(transfer)"
                          >
                            <i class="ki-duotone ki-check-circle fs-6 me-2"></i>
                            Completar Traslado
                          </a>
                        </li>
                      </template>

                      <!-- Can cancel if not completed -->
                      <li v-if="transfer.status !== 'completed' && transfer.status !== 'cancelled' && canCancel">
                        <a
                          href="#"
                          class="dropdown-item text-warning"
                          @click.prevent="cancelTransfer(transfer)"
                        >
                          <i class="ki-duotone ki-cross-circle fs-6 me-2"></i>
                          Cancelar
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
        <div v-else-if="transfers.length === 0" class="text-center py-10">
          <div class="mx-auto mb-4">
            <i class="ki-duotone ki-search-list fs-5x text-gray-400">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
          </div>
          <div class="fs-6 text-gray-600 mb-4">
            No se encontraron traslados con los criterios especificados.
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
  <TransferDetailModal
    :show="showDetailModal"
    :transfer="selectedTransfer"
    @close="closeDetailModal"
  />

  <ApproveTransferModal
    :show="showApproveModal"
    :transfer="selectedTransfer"
    @approved="handleTransferApproved"
    @close="closeApproveModal"
  />

  <RejectTransferModal
    :show="showRejectModal"
    :transfer="selectedTransfer"
    @rejected="handleTransferRejected"
    @close="closeRejectModal"
  />

  <InitiateTransferModal
    :show="showInitiateModal"
    :transfer="selectedTransfer"
    @initiated="handleTransferInitiated"
    @close="closeInitiateModal"
  />

  <CompleteTransferModal
    :show="showCompleteModal"
    :transfer="selectedTransfer"
    @completed="handleTransferCompleted"
    @close="closeCompleteModal"
  />

  <CancelTransferModal
    :show="showCancelModal"
    :transfer="selectedTransfer"
    @cancelled="handleTransferCancelled"
    @close="closeCancelModal"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import TransferDetailModal from '@/components/transfers/modals/TransferDetailModal.vue';
import ApproveTransferModal from '@/components/transfers/modals/ApproveTransferModal.vue';
import RejectTransferModal from '@/components/transfers/modals/RejectTransferModal.vue';
import InitiateTransferModal from '@/components/transfers/modals/InitiateTransferModal.vue';
import CompleteTransferModal from '@/components/transfers/modals/CompleteTransferModal.vue';
import CancelTransferModal from '@/components/transfers/modals/CancelTransferModal.vue';

// Auth
const authStore = useAuthStore();

// State
const transfers = ref<any[]>([]);
const centers = ref<any[]>([]);
const statistics = ref<any>(null);
const loading = ref(false);
const error = ref('');
const searchTerm = ref('');
const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const showFilters = ref(false);
const selectedTransfer = ref<any>(null);

// Modals
const showDetailModal = ref(false);
const showApproveModal = ref(false);
const showRejectModal = ref(false);
const showInitiateModal = ref(false);
const showCompleteModal = ref(false);
const showCancelModal = ref(false);

// Filters
const filters = ref({
  status: '',
  from_center_id: '',
  to_center_id: '',
  transfer_date_from: '',
});

// Pagination
const pagination = ref({
  current_page: 1,
  per_page: 15,
  total: 0,
  last_page: 1,
});

// Permissions
const canApprove = computed(() => authStore.hasPermission('transfers.approve'));
const canInitiate = computed(() => authStore.hasPermission('transfers.edit'));
const canComplete = computed(() => authStore.hasPermission('transfers.edit'));
const canCancel = computed(() => authStore.hasPermission('transfers.delete'));

// Check if any filter is active
const hasActiveFilters = computed(() => {
  return !!(
    searchTerm.value ||
    filters.value.status ||
    filters.value.from_center_id ||
    filters.value.to_center_id ||
    filters.value.transfer_date_from
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
const fetchTransfers = async () => {
  try {
    loading.value = true;
    error.value = '';

    const params: any = {
      page: pagination.value.current_page,
      per_page: pagination.value.per_page,
    };

    if (searchTerm.value) {
      params.search = searchTerm.value;
    }

    if (filters.value.status) {
      params.status = filters.value.status;
    }

    if (filters.value.from_center_id) {
      params.from_center_id = filters.value.from_center_id;
    }

    if (filters.value.to_center_id) {
      params.to_center_id = filters.value.to_center_id;
    }

    if (filters.value.transfer_date_from) {
      params.transfer_date_from = filters.value.transfer_date_from;
    }

    const response = await ApiService.get('/transfers', { params });

    if (response.data.success) {
      const data = response.data.data;
      transfers.value = data.data || [];
      pagination.value = {
        current_page: data.current_page || 1,
        per_page: data.per_page || 15,
        total: data.total || 0,
        last_page: data.last_page || 1,
      };
    }
  } catch (err: any) {
    console.error('Error fetching transfers:', err);
    error.value = err.response?.data?.message || 'Error al cargar los traslados';
  } finally {
    loading.value = false;
  }
};

const fetchStatistics = async () => {
  try {
    const response = await ApiService.get('/transfers/statistics');
    if (response.data.success) {
      statistics.value = response.data.data;
    }
  } catch (err) {
    console.error('Error fetching statistics:', err);
  }
};

const fetchCenters = async () => {
  try {
    const response = await ApiService.get('/catalogs/centers?simple=true');
    if (response.data.success) {
      centers.value = response.data.data || [];
    }
  } catch (err) {
    console.error('Error fetching centers:', err);
  }
};

const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  searchTimeout.value = setTimeout(() => {
    pagination.value.current_page = 1;
    fetchTransfers();
  }, 300);
};

const handleFilterChange = () => {
  pagination.value.current_page = 1;
  fetchTransfers();
};

const clearFilters = () => {
  searchTerm.value = '';
  filters.value = {
    status: '',
    from_center_id: '',
    to_center_id: '',
    transfer_date_from: '',
  };
  pagination.value.current_page = 1;
  fetchTransfers();
};

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    pagination.value.current_page = page;
    fetchTransfers();
  }
};

// Helper functions
const getInmateName = (inmate: any) => {
  if (!inmate) return 'N/A';
  const parts = [
    inmate.first_name,
    inmate.middle_name,
    inmate.last_name,
    inmate.second_last_name,
  ].filter(Boolean);
  return parts.join(' ') || 'N/A';
};

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('es-GT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusLabel = (status: string) => {
  const labels: { [key: string]: string } = {
    scheduled: 'Programado',
    approved: 'Aprobado',
    in_transit: 'En Tránsito',
    completed: 'Completado',
    cancelled: 'Cancelado',
  };
  return labels[status] || status;
};

const getStatusBadgeClass = (status: string) => {
  const classes: { [key: string]: string } = {
    scheduled: 'badge badge-light-warning fw-bold',
    approved: 'badge badge-light-primary fw-bold',
    in_transit: 'badge badge-light-info fw-bold',
    completed: 'badge badge-light-success fw-bold',
    cancelled: 'badge badge-light-danger fw-bold',
  };
  return classes[status] || 'badge badge-light fw-bold';
};

// Modal actions
const viewTransfer = (transfer: any) => {
  selectedTransfer.value = transfer;
  showDetailModal.value = true;
};

const approveTransfer = (transfer: any) => {
  selectedTransfer.value = transfer;
  showApproveModal.value = true;
};

const rejectTransfer = (transfer: any) => {
  selectedTransfer.value = transfer;
  showRejectModal.value = true;
};

const initiateTransfer = (transfer: any) => {
  selectedTransfer.value = transfer;
  showInitiateModal.value = true;
};

const completeTransfer = (transfer: any) => {
  selectedTransfer.value = transfer;
  showCompleteModal.value = true;
};

const cancelTransfer = (transfer: any) => {
  selectedTransfer.value = transfer;
  showCancelModal.value = true;
};

// Modal close handlers
const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedTransfer.value = null;
};

const closeApproveModal = () => {
  showApproveModal.value = false;
  selectedTransfer.value = null;
};

const closeRejectModal = () => {
  showRejectModal.value = false;
  selectedTransfer.value = null;
};

const closeInitiateModal = () => {
  showInitiateModal.value = false;
  selectedTransfer.value = null;
};

const closeCompleteModal = () => {
  showCompleteModal.value = false;
  selectedTransfer.value = null;
};

const closeCancelModal = () => {
  showCancelModal.value = false;
  selectedTransfer.value = null;
};

// Modal success handlers
const handleTransferApproved = () => {
  fetchTransfers();
  fetchStatistics();
};

const handleTransferRejected = () => {
  fetchTransfers();
  fetchStatistics();
};

const handleTransferInitiated = () => {
  fetchTransfers();
  fetchStatistics();
};

const handleTransferCompleted = () => {
  fetchTransfers();
  fetchStatistics();
};

const handleTransferCancelled = () => {
  fetchTransfers();
  fetchStatistics();
};

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchTransfers(), fetchStatistics(), fetchCenters()]);
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
