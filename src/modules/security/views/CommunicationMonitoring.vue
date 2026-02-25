<template>
  <div class="communication-monitoring-page">
    <!-- Header Card -->
    <div class="card mb-5">
      <div class="card-body d-flex align-items-center justify-content-between">
        <div>
          <h1 class="fs-2x fw-bold text-gray-900 mb-0">Monitoreo de Comunicaciones</h1>
          <p class="text-gray-600 fs-6 fw-semibold mb-0">
            Control y monitoreo de comunicaciones de PPL
          </p>
        </div>
        <button v-if="canCreate" type="button" class="btn btn-primary" @click="openCreateModal">
          <i class="fas fa-plus me-2"></i>Nuevo Monitoreo
        </button>
      </div>
    </div>

    <!-- Filters Card -->
    <div class="card mb-5">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Buscar</label>
            <input v-model="filters.search" type="text" class="form-control" placeholder="Nombre, orden judicial..." @input="handleSearch" />
          </div>
          <div class="col-md-2">
            <label class="form-label">Centro</label>
            <select v-model="filters.center_id" class="form-select" @change="handleFilterChange">
              <option value="">Todos</option>
              <option v-for="c in centers" :key="c?.id" :value="c?.id">{{ c?.name }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Estado</label>
            <select v-model="filters.monitoring_active" class="form-select" @change="handleFilterChange">
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Con Evidencia</label>
            <select v-model="filters.has_evidence" class="form-select" @change="handleFilterChange">
              <option value="">Todos</option>
              <option value="extortion">Extorsión</option>
              <option value="gang">Pandillas</option>
              <option value="escape">Fuga</option>
            </select>
          </div>
          <div class="col-md-1 d-flex align-items-end">
            <button type="button" class="btn btn-light w-100" @click="resetFilters"><i class="fas fa-redo"></i></button>
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
              <span class="me-5"><i class="fas fa-headset fs-2x text-white"></i></span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.total_active }}</div>
                <div class="fs-7">Monitoreos Activos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-danger hoverable">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="me-5"><i class="fas fa-money-bill fs-2x text-white"></i></span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.extortion }}</div>
                <div class="fs-7">Evidencia Extorsión</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-warning hoverable">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="me-5"><i class="fas fa-users fs-2x text-white"></i></span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.gang_coord }}</div>
                <div class="fs-7">Coord. Pandillas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-dark hoverable">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="me-5"><i class="fas fa-running fs-2x text-white"></i></span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.escape }}</div>
                <div class="fs-7">Planificación Fuga</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="card">
      <div class="card-header border-0 pt-6">
        <div class="card-title"><span class="card-label fw-bold fs-3 mb-1">Listado de Monitoreos</span></div>
      </div>
      <div class="card-body pt-0">
        <div v-if="loading" class="text-center py-10">
          <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div>
        </div>
        <div v-else-if="records.length === 0" class="text-center py-10">
          <i class="fas fa-headset fs-3x text-gray-300 mb-5"></i>
          <p class="text-gray-500 fs-5">No se encontraron monitoreos</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table align-middle table-row-dashed fs-6 gy-3">
            <thead>
              <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                <th>PPL</th>
                <th>Orden Judicial</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Tipos</th>
                <th>Hallazgos</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 fw-semibold">
              <tr v-for="r in records" :key="r.id">
                <td>
                  <div class="d-flex flex-column">
                    <span class="text-gray-800 fw-bold">{{ getInmateName(r) }}</span>
                    <span class="text-muted fs-7">{{ r.inmate?.inmate_number || 'N/A' }}</span>
                  </div>
                </td>
                <td>{{ r.court_order_number || 'N/A' }}</td>
                <td>{{ formatDate(r.monitoring_start_date) }}</td>
                <td>{{ formatDate(r.monitoring_end_date) }}</td>
                <td>
                  <div class="d-flex gap-1 flex-wrap">
                    <span v-if="r.phone_calls_monitored" class="badge badge-light-primary" title="Llamadas"><i class="fas fa-phone"></i></span>
                    <span v-if="r.letters_monitored" class="badge badge-light-info" title="Cartas"><i class="fas fa-envelope"></i></span>
                    <span v-if="r.visits_monitored" class="badge badge-light-warning" title="Visitas"><i class="fas fa-user-friends"></i></span>
                  </div>
                </td>
                <td>
                  <div class="d-flex gap-1 flex-wrap">
                    <span v-if="r.extortion_evidence_found" class="badge badge-danger" title="Extorsión"><i class="fas fa-money-bill"></i></span>
                    <span v-if="r.gang_coordination_found" class="badge badge-warning" title="Pandillas"><i class="fas fa-users"></i></span>
                    <span v-if="r.escape_planning_found" class="badge badge-dark" title="Fuga"><i class="fas fa-running"></i></span>
                    <span v-if="!r.extortion_evidence_found && !r.gang_coordination_found && !r.escape_planning_found" class="text-muted">-</span>
                  </div>
                </td>
                <td class="text-end">
                  <div class="d-flex gap-2 justify-content-end">
                    <button type="button" class="btn btn-icon btn-sm btn-light-primary" title="Ver" @click="viewDetail(r)"><i class="fas fa-eye"></i></button>
                    <button v-if="canEdit" type="button" class="btn btn-icon btn-sm btn-light-warning" title="Editar" @click="editRecord(r)"><i class="fas fa-pencil-alt"></i></button>
                    <button v-if="canDelete" type="button" class="btn btn-icon btn-sm btn-light-danger" title="Eliminar" @click="deleteRecord(r)"><i class="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="records.length > 0" class="card-footer d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-3">
            <div class="text-muted">Mostrando {{ pagination.from }} a {{ pagination.to }} de {{ pagination.total }}</div>
            <select v-model.number="pagination.perPage" class="form-select form-select-sm" style="width: 80px;" @change="changePerPage(pagination.perPage)">
              <option :value="10">10</option><option :value="15">15</option><option :value="25">25</option><option :value="50">50</option>
            </select>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button type="button" class="btn btn-sm btn-light" :disabled="pagination.currentPage === 1" @click="prevPage"><i class="fas fa-chevron-left"></i></button>
            <button v-for="page in visiblePages" :key="page" type="button" class="btn btn-sm" :class="page === pagination.currentPage ? 'btn-primary' : 'btn-light'" @click="changePage(page)">{{ page }}</button>
            <button type="button" class="btn btn-sm btn-light" :disabled="pagination.currentPage === pagination.lastPage" @click="nextPage"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <MonitoringFormModal ref="formModalRef" :monitoring="selectedRecord" :is-editing="isEditing" @saved="onSaved" />
    <MonitoringDetailModal ref="detailModalRef" :monitoring="selectedRecord" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ApiService from '@/core/services/ApiService';
import { debounce } from 'lodash';
import Swal from 'sweetalert2';
import MonitoringFormModal from '@/components/security/MonitoringFormModal.vue';
import MonitoringDetailModal from '@/components/security/MonitoringDetailModal.vue';

const authStore = useAuthStore();
const canCreate = computed(() => authStore.isSuperAdmin || authStore.hasPermission('security.monitoring.edit'));
const canEdit = computed(() => authStore.isSuperAdmin || authStore.hasPermission('security.monitoring.edit'));
const canDelete = computed(() => authStore.isSuperAdmin || authStore.hasPermission('security.monitoring.delete'));

const records = ref<any[]>([]);
const centers = ref<any[]>([]);
const loading = ref(false);
const selectedRecord = ref<any>(null);
const isEditing = ref(false);
const formModalRef = ref<any>(null);
const detailModalRef = ref<any>(null);

const filters = ref({ search: '', center_id: '', monitoring_active: '', has_evidence: '' });
const pagination = ref({ currentPage: 1, perPage: 15, total: 0, lastPage: 1, from: 0, to: 0 });
const stats = ref({ total_active: 0, extortion: 0, gang_coord: 0, escape: 0 });

const visiblePages = computed(() => {
  const pages: number[] = [];
  const c = pagination.value.currentPage, l = pagination.value.lastPage;
  let s = Math.max(1, c - 2), e = Math.min(l, c + 2);
  if (c <= 3) e = Math.min(5, l);
  if (c >= l - 2) s = Math.max(1, l - 4);
  for (let i = s; i <= e; i++) pages.push(i);
  return pages;
});

const loadRecords = async () => {
  loading.value = true;
  try {
    const paramEntries: Record<string, string> = {
      page: pagination.value.currentPage.toString(),
      per_page: pagination.value.perPage.toString(),
    };
    if (filters.value.search) paramEntries.search = filters.value.search;
    if (filters.value.center_id) paramEntries.center_id = filters.value.center_id;
    if (filters.value.monitoring_active) paramEntries.monitoring_active = filters.value.monitoring_active;
    if (filters.value.has_evidence === 'extortion') paramEntries.extortion_evidence_found = 'true';
    if (filters.value.has_evidence === 'gang') paramEntries.gang_coordination_found = 'true';
    if (filters.value.has_evidence === 'escape') paramEntries.escape_planning_found = 'true';

    const params = new URLSearchParams(paramEntries);
    const res = await ApiService.get(`/security/communication-monitoring?${params.toString()}`);
    if (res.data?.success && res.data.data) {
      const pd = res.data.data;
      const data = Array.isArray(pd) ? pd : (pd.data || []);
      if (!Array.isArray(pd)) {
        pagination.value = { ...pagination.value, currentPage: pd.current_page || 1, total: pd.total || 0, lastPage: pd.last_page || 1, from: pd.from || 0, to: pd.to || 0 };
      }
      records.value = data;
    }
  } catch (e) { console.error('Error loading monitoring:', e); }
  finally { loading.value = false; }
};

const loadStats = async () => {
  try {
    const res = await ApiService.get('/security/communication-monitoring/statistics');
    if (res.data?.success) {
      const s = res.data.data;
      stats.value = {
        total_active: s.total_active || 0,
        extortion: s.with_extortion_evidence || 0,
        gang_coord: s.with_gang_coordination || 0,
        escape: s.with_escape_planning || 0,
      };
    }
  } catch (e) { console.error('Error loading stats:', e); }
};

const loadCenters = async () => {
  try { const res = await ApiService.get('/catalogs/centers'); centers.value = res.data?.data || []; }
  catch (e) { console.error('Error loading centers:', e); }
};

const getInmateName = (r: any) => { const i = r?.inmate; if (!i) return 'N/A'; return [i.first_name, i.last_name, i.second_last_name].filter(Boolean).join(' '); };
const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('es-GT') : 'N/A';

const handleSearch = debounce(() => { pagination.value.currentPage = 1; loadRecords(); }, 500);
const handleFilterChange = () => { pagination.value.currentPage = 1; loadRecords(); };
const resetFilters = () => { filters.value = { search: '', center_id: '', monitoring_active: '', has_evidence: '' }; pagination.value.currentPage = 1; loadRecords(); };
const changePage = (p: number) => { if (p >= 1 && p <= pagination.value.lastPage) { pagination.value.currentPage = p; loadRecords(); } };
const changePerPage = (pp: number) => { pagination.value.perPage = pp; pagination.value.currentPage = 1; loadRecords(); };
const nextPage = () => { if (pagination.value.currentPage < pagination.value.lastPage) changePage(pagination.value.currentPage + 1); };
const prevPage = () => { if (pagination.value.currentPage > 1) changePage(pagination.value.currentPage - 1); };

const openCreateModal = () => { selectedRecord.value = null; isEditing.value = false; formModalRef.value?.open(); };
const editRecord = (r: any) => { selectedRecord.value = r; isEditing.value = true; formModalRef.value?.open(); };
const viewDetail = (r: any) => { selectedRecord.value = r; detailModalRef.value?.open(); };
const deleteRecord = async (r: any) => {
  const result = await Swal.fire({ title: 'Eliminar monitoreo', text: '¿Está seguro?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Eliminar', cancelButtonText: 'Cancelar' });
  if (result.isConfirmed) {
    try { await ApiService.delete(`/security/communication-monitoring/${r.id}`); Swal.fire({ icon: 'success', title: 'Eliminado', timer: 2000, showConfirmButton: false }); loadRecords(); loadStats(); }
    catch { Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar' }); }
  }
};
const onSaved = () => { loadRecords(); loadStats(); Swal.fire({ icon: 'success', title: 'Monitoreo guardado', timer: 2000, showConfirmButton: false }); };

onMounted(async () => { await Promise.all([loadCenters(), loadRecords(), loadStats()]); });
</script>

<style scoped>
.hoverable { transition: transform 0.2s; cursor: pointer; }
.hoverable:hover { transform: translateY(-5px); }
</style>
