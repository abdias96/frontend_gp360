<template>
  <div class="security-classifications-page">
    <!-- Header Card -->
    <div class="card mb-5">
      <div class="card-body d-flex align-items-center justify-content-between">
        <div>
          <h1 class="fs-2x fw-bold text-gray-900 mb-0">Clasificaciones de Seguridad</h1>
          <p class="text-gray-600 fs-6 fw-semibold mb-0">
            Gestión de niveles de seguridad y evaluaciones de riesgo de PPL
          </p>
        </div>
        <button
          v-if="canCreate"
          type="button"
          class="btn btn-primary"
          @click="openCreateModal"
        >
          <i class="fas fa-plus me-2"></i>
          Nueva Clasificación
        </button>
      </div>
    </div>

    <!-- Filters Card -->
    <div class="card mb-5">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Buscar PPL</label>
            <input
              v-model="filters.search"
              type="text"
              class="form-control"
              placeholder="Nombre, DPI o código..."
              @input="handleSearch"
            />
          </div>
          <div class="col-md-2">
            <label class="form-label">Centro</label>
            <select v-model="filters.center_id" class="form-select" @change="handleFilterChange">
              <option value="">Todos</option>
              <option v-for="center in centers" :key="center?.id" :value="center?.id">
                {{ center?.name }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Nivel de Seguridad</label>
            <select v-model="filters.security_level" class="form-select" @change="handleFilterChange">
              <option value="">Todos</option>
              <option value="low">Bajo</option>
              <option value="medium">Medio</option>
              <option value="high">Alto</option>
              <option value="maximum">Máximo</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Riesgo General</label>
            <select v-model="filters.overall_risk_level" class="form-select" @change="handleFilterChange">
              <option value="">Todos</option>
              <option value="low">Bajo</option>
              <option value="medium">Medio</option>
              <option value="high">Alto</option>
              <option value="extreme">Extremo</option>
            </select>
          </div>
          <div class="col-md-1 d-flex align-items-end">
            <button type="button" class="btn btn-light w-100" @click="resetFilters">
              <i class="fas fa-redo"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row g-5 mb-5">
      <div class="col-xl-3">
        <div class="card bg-primary hoverable">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="me-5"><i class="fas fa-shield-alt fs-2x text-white"></i></span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.total }}</div>
                <div class="fs-7">Total Clasificaciones</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-danger hoverable">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="me-5"><i class="fas fa-exclamation-triangle fs-2x text-white"></i></span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.high_risk }}</div>
                <div class="fs-7">Alto Riesgo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-warning hoverable">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="me-5"><i class="fas fa-clock fs-2x text-white"></i></span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.pending_review }}</div>
                <div class="fs-7">Revisiones Pendientes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-dark hoverable">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="me-5"><i class="fas fa-lock fs-2x text-white"></i></span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.maximum }}</div>
                <div class="fs-7">Máximo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="card">
      <div class="card-header border-0 pt-6">
        <div class="card-title">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold fs-3 mb-1">Listado de Clasificaciones</span>
          </h3>
        </div>
      </div>
      <div class="card-body pt-0">
        <div v-if="loading" class="text-center py-10">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <div v-else-if="records.length === 0" class="text-center py-10">
          <i class="fas fa-shield-alt fs-3x text-gray-300 mb-5"></i>
          <p class="text-gray-500 fs-5">No se encontraron clasificaciones de seguridad</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table align-middle table-row-dashed fs-6 gy-3">
            <thead>
              <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                <th>PPL</th>
                <th>Centro</th>
                <th>Nivel</th>
                <th>Riesgo General</th>
                <th>Fecha</th>
                <th>Próxima Revisión</th>
                <th>Estado</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 fw-semibold">
              <tr v-for="record in records" :key="record.id">
                <td>
                  <div class="d-flex flex-column">
                    <span class="text-gray-800 fw-bold">{{ getInmateName(record) }}</span>
                    <span class="text-muted fs-7">{{ record.inmate?.inmate_number || 'N/A' }}</span>
                  </div>
                </td>
                <td>{{ record.inmate?.current_center?.name || record.inmate?.center?.name || 'N/A' }}</td>
                <td>
                  <span class="badge" :class="getLevelBadge(record.security_level)">
                    {{ getLevelLabel(record.security_level) }}
                  </span>
                </td>
                <td>
                  <span class="badge" :class="getRiskBadge(record.overall_risk_level)">
                    {{ getRiskLabel(record.overall_risk_level) }}
                  </span>
                </td>
                <td>{{ formatDate(record.classification_date) }}</td>
                <td>
                  <span :class="{ 'text-danger fw-bold': isOverdue(record.next_review_date) }">
                    {{ formatDate(record.next_review_date) }}
                  </span>
                </td>
                <td>
                  <span v-if="record.is_current" class="badge badge-light-success">Vigente</span>
                  <span v-else class="badge badge-light-secondary">Histórico</span>
                </td>
                <td class="text-end">
                  <div class="d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      class="btn btn-icon btn-sm btn-light-primary"
                      title="Ver Detalle"
                      @click="viewDetail(record)"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      v-if="canEdit"
                      type="button"
                      class="btn btn-icon btn-sm btn-light-warning"
                      title="Editar"
                      @click="editRecord(record)"
                    >
                      <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-icon btn-sm btn-light-info"
                      title="Historial"
                      @click="viewHistory(record)"
                    >
                      <i class="fas fa-history"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="records.length > 0" class="card-footer d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-3">
            <div class="text-muted">
              Mostrando {{ pagination.from }} a {{ pagination.to }} de {{ pagination.total }} registros
            </div>
            <div class="d-flex align-items-center gap-2">
              <label class="form-label mb-0 me-2">Por página:</label>
              <select
                v-model.number="pagination.perPage"
                class="form-select form-select-sm"
                style="width: 80px;"
                @change="changePerPage(pagination.perPage)"
              >
                <option :value="10">10</option>
                <option :value="15">15</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
              </select>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button type="button" class="btn btn-sm btn-light" :disabled="pagination.currentPage === 1" @click="prevPage">
              <i class="fas fa-chevron-left"></i>
            </button>
            <div class="d-flex gap-1">
              <button
                v-if="pagination.currentPage > 3"
                type="button"
                class="btn btn-sm btn-light"
                @click="changePage(1)"
              >1</button>
              <span v-if="pagination.currentPage > 4" class="align-self-center">...</span>
              <button
                v-for="page in visiblePages"
                :key="page"
                type="button"
                class="btn btn-sm"
                :class="page === pagination.currentPage ? 'btn-primary' : 'btn-light'"
                @click="changePage(page)"
              >{{ page }}</button>
              <span v-if="pagination.currentPage < pagination.lastPage - 3" class="align-self-center">...</span>
              <button
                v-if="pagination.currentPage < pagination.lastPage - 2"
                type="button"
                class="btn btn-sm btn-light"
                @click="changePage(pagination.lastPage)"
              >{{ pagination.lastPage }}</button>
            </div>
            <button type="button" class="btn btn-sm btn-light" :disabled="pagination.currentPage === pagination.lastPage" @click="nextPage">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <SecurityClassificationFormModal
      :show="showFormModal"
      :classification="selectedRecord"
      :inmate="selectedInmate"
      @close="showFormModal = false"
      @saved="onSaved"
    />
    <SecurityClassificationDetailModal
      :show="showDetailModal"
      :classification="selectedRecord"
      @close="showDetailModal = false"
    />
    <SecurityClassificationHistoryModal
      :show="showHistoryModal"
      :inmate="selectedHistoryInmate"
      @close="showHistoryModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ApiService from '@/core/services/ApiService';
import { debounce } from 'lodash';
import Swal from 'sweetalert2';
import SecurityClassificationFormModal from '@/components/inmates/modals/SecurityClassificationFormModal.vue';
import SecurityClassificationDetailModal from '@/components/inmates/modals/SecurityClassificationDetailModal.vue';
import SecurityClassificationHistoryModal from '@/components/inmates/modals/SecurityClassificationHistoryModal.vue';

const authStore = useAuthStore();

const canCreate = computed(() => authStore.isSuperAdmin || authStore.hasPermission('security.classifications.edit'));
const canEdit = computed(() => authStore.isSuperAdmin || authStore.hasPermission('security.classifications.edit'));

const records = ref<any[]>([]);
const centers = ref<any[]>([]);
const loading = ref(false);
const selectedRecord = ref<any>(null);
const selectedInmate = ref<any>(null);
const selectedHistoryInmate = ref<any>(null);
const isEditing = ref(false);

const showFormModal = ref(false);
const showDetailModal = ref(false);
const showHistoryModal = ref(false);

const filters = ref({
  search: '',
  center_id: '',
  security_level: '',
  overall_risk_level: '',
});

const pagination = ref({
  currentPage: 1,
  perPage: 15,
  total: 0,
  lastPage: 1,
  from: 0,
  to: 0,
});

const stats = ref({
  total: 0,
  high_risk: 0,
  pending_review: 0,
  maximum: 0,
});

const visiblePages = computed(() => {
  const pages: number[] = [];
  const current = pagination.value.currentPage;
  const last = pagination.value.lastPage;
  let start = Math.max(1, current - 2);
  let end = Math.min(last, current + 2);
  if (current <= 3) end = Math.min(5, last);
  if (current >= last - 2) start = Math.max(1, last - 4);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

const loadRecords = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      page: pagination.value.currentPage.toString(),
      per_page: pagination.value.perPage.toString(),
      current_only: 'true',
      ...Object.fromEntries(
        Object.entries(filters.value).filter(([_, v]) => v !== '')
      )
    });

    const response = await ApiService.get(`/inmate-security-classifications?${params.toString()}`);
    if (response.data?.success && response.data.data) {
      const paginatedData = response.data.data;
      const data = Array.isArray(paginatedData) ? paginatedData : (paginatedData.data || []);
      if (!Array.isArray(paginatedData)) {
        pagination.value.currentPage = paginatedData.current_page || 1;
        pagination.value.total = paginatedData.total || 0;
        pagination.value.lastPage = paginatedData.last_page || 1;
        pagination.value.from = paginatedData.from || 0;
        pagination.value.to = paginatedData.to || 0;
        pagination.value.perPage = paginatedData.per_page || 15;
      }
      records.value = data;
    }
  } catch (error) {
    console.error('Error loading classifications:', error);
  } finally {
    loading.value = false;
  }
};

const loadStats = async () => {
  try {
    const response = await ApiService.get('/inmate-security-classifications/statistics');
    if (response.data?.success) {
      const s = response.data.data;
      stats.value.total = s.total_classifications || 0;
      stats.value.high_risk = (s.by_risk_level?.high || 0) + (s.by_risk_level?.extreme || 0);
      stats.value.pending_review = s.pending_reviews || 0;
      stats.value.maximum = s.by_classification_level?.maximum || 0;
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
};

const loadCenters = async () => {
  try {
    const response = await ApiService.get('/catalogs/centers');
    if (response.data?.data) {
      centers.value = response.data.data;
    }
  } catch (error) {
    console.error('Error loading centers:', error);
  }
};

const getInmateName = (record: any) => {
  const i = record.inmate;
  if (!i) return 'N/A';
  if (i.full_name) return i.full_name;
  return [i.first_name, i.middle_name, i.last_name, i.second_last_name].filter(Boolean).join(' ');
};

const getLevelBadge = (level: string) => {
  const map: Record<string, string> = {
    low: 'badge-light-success',
    medium: 'badge-light-warning',
    high: 'badge-danger',
    maximum: 'badge-dark',
  };
  return map[level] || 'badge-light';
};

const getLevelLabel = (level: string) => {
  const map: Record<string, string> = {
    low: 'Bajo',
    medium: 'Medio',
    high: 'Alto',
    maximum: 'Máximo',
  };
  return map[level] || level;
};

const getRiskBadge = (risk: string) => {
  const map: Record<string, string> = {
    low: 'badge-light-success',
    medium: 'badge-light-warning',
    high: 'badge-light-danger',
    extreme: 'badge-danger',
  };
  return map[risk] || 'badge-light';
};

const getRiskLabel = (risk: string) => {
  const map: Record<string, string> = {
    low: 'Bajo',
    medium: 'Medio',
    high: 'Alto',
    extreme: 'Extremo',
  };
  return map[risk] || risk || 'N/A';
};

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-GT');
};

const isOverdue = (date: string) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

const handleSearch = debounce(() => {
  pagination.value.currentPage = 1;
  loadRecords();
}, 500);

const handleFilterChange = () => {
  pagination.value.currentPage = 1;
  loadRecords();
};

const resetFilters = () => {
  filters.value = { search: '', center_id: '', security_level: '', overall_risk_level: '' };
  pagination.value.currentPage = 1;
  loadRecords();
};

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.lastPage) {
    pagination.value.currentPage = page;
    loadRecords();
  }
};
const changePerPage = (perPage: number) => { pagination.value.perPage = perPage; pagination.value.currentPage = 1; loadRecords(); };
const nextPage = () => { if (pagination.value.currentPage < pagination.value.lastPage) changePage(pagination.value.currentPage + 1); };
const prevPage = () => { if (pagination.value.currentPage > 1) changePage(pagination.value.currentPage - 1); };

const openCreateModal = () => {
  selectedRecord.value = null;
  selectedInmate.value = null;
  isEditing.value = false;
  showFormModal.value = true;
};

const editRecord = (record: any) => {
  selectedRecord.value = record;
  selectedInmate.value = record.inmate;
  isEditing.value = true;
  showFormModal.value = true;
};

const viewDetail = (record: any) => {
  selectedRecord.value = record;
  showDetailModal.value = true;
};

const viewHistory = (record: any) => {
  selectedHistoryInmate.value = record.inmate;
  showHistoryModal.value = true;
};

const onSaved = () => {
  showFormModal.value = false;
  loadRecords();
  loadStats();
  Swal.fire({ icon: 'success', title: 'Clasificación guardada', timer: 2000, showConfirmButton: false });
};

onMounted(async () => {
  await Promise.all([loadCenters(), loadRecords(), loadStats()]);
});
</script>

<style scoped>
.hoverable { transition: transform 0.2s; cursor: pointer; }
.hoverable:hover { transform: translateY(-5px); }
</style>
