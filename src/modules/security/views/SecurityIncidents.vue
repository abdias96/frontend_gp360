<template>
  <div class="security-incidents-page">
    <!-- Header Card -->
    <div class="card mb-5">
      <div class="card-body d-flex align-items-center justify-content-between">
        <div>
          <h1 class="fs-2x fw-bold text-gray-900 mb-0">Incidentes de Seguridad</h1>
          <p class="text-gray-600 fs-6 fw-semibold mb-0">
            Registro y seguimiento de incidentes dentro del centro penitenciario
          </p>
        </div>
        <button v-if="canCreate" type="button" class="btn btn-primary" @click="openCreateModal">
          <i class="fas fa-plus me-2"></i>Nuevo Incidente
        </button>
      </div>
    </div>

    <!-- Filters Card -->
    <div class="card mb-5">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-2">
            <label class="form-label">Buscar</label>
            <input v-model="filters.search" type="text" class="form-control" placeholder="Buscar..." @input="handleSearch" />
          </div>
          <div class="col-md-2">
            <label class="form-label">Tipo</label>
            <select v-model="filters.incident_type" class="form-select" @change="handleFilterChange">
              <option value="">Todos</option>
              <option v-for="(label, key) in incidentTypeLabels" :key="key" :value="key">{{ label }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Severidad</label>
            <select v-model="filters.severity_level" class="form-select" @change="handleFilterChange">
              <option value="">Todas</option>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Desde</label>
            <input v-model="filters.date_from" type="date" class="form-control" @change="handleFilterChange" />
          </div>
          <div class="col-md-2">
            <label class="form-label">Hasta</label>
            <input v-model="filters.date_to" type="date" class="form-control" @change="handleFilterChange" />
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
              <span class="me-5"><i class="fas fa-file-alt fs-2x text-white"></i></span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.total }}</div>
                <div class="fs-7">Total Incidentes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-warning hoverable">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="me-5"><i class="fas fa-search fs-2x text-white"></i></span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.investigating }}</div>
                <div class="fs-7">En Investigación</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-success hoverable">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="me-5"><i class="fas fa-check-circle fs-2x text-white"></i></span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.resolved }}</div>
                <div class="fs-7">Resueltos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-danger hoverable">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="me-5"><i class="fas fa-exclamation-circle fs-2x text-white"></i></span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.critical }}</div>
                <div class="fs-7">Críticos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="card">
      <div class="card-header border-0 pt-6">
        <div class="card-title"><span class="card-label fw-bold fs-3 mb-1">Listado de Incidentes</span></div>
      </div>
      <div class="card-body pt-0">
        <div v-if="loading" class="text-center py-10">
          <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div>
        </div>
        <div v-else-if="records.length === 0" class="text-center py-10">
          <i class="fas fa-file-alt fs-3x text-gray-300 mb-5"></i>
          <p class="text-gray-500 fs-5">No se encontraron incidentes</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table align-middle table-row-dashed fs-6 gy-3">
            <thead>
              <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                <th>PPL</th>
                <th>Tipo</th>
                <th>Severidad</th>
                <th>Fecha</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 fw-semibold">
              <tr v-for="r in records" :key="r.id">
                <td>
                  <span v-if="r.inmate" class="text-gray-800 fw-bold">{{ r.inmate.first_name }} {{ r.inmate.last_name }}</span>
                  <span v-else class="text-muted">General</span>
                </td>
                <td>{{ getTypeLabel(r.incident_type) }}</td>
                <td><span class="badge" :class="getSeverityBadge(r.severity_level)">{{ getSeverityLabel(r.severity_level) }}</span></td>
                <td>{{ formatDateTime(r.incident_date) }}</td>
                <td>{{ r.location || 'N/A' }}</td>
                <td><span class="badge" :class="getStatusBadge(r.resolution_status)">{{ getStatusLabel(r.resolution_status) }}</span></td>
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
    <IncidentFormModal ref="formModalRef" :incident="selectedRecord" :is-editing="isEditing" @saved="onSaved" />
    <IncidentDetailModal ref="detailModalRef" :incident="selectedRecord" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ApiService from '@/core/services/ApiService';
import { debounce } from 'lodash';
import Swal from 'sweetalert2';
import IncidentFormModal from '@/components/security/IncidentFormModal.vue';
import IncidentDetailModal from '@/components/security/IncidentDetailModal.vue';

const authStore = useAuthStore();
const canCreate = computed(() => authStore.isSuperAdmin || authStore.hasPermission('security.incidents.edit'));
const canEdit = computed(() => authStore.isSuperAdmin || authStore.hasPermission('security.incidents.edit'));
const canDelete = computed(() => authStore.isSuperAdmin || authStore.hasPermission('security.incidents.delete'));

const records = ref<any[]>([]);
const loading = ref(false);
const selectedRecord = ref<any>(null);
const isEditing = ref(false);
const formModalRef = ref<any>(null);
const detailModalRef = ref<any>(null);

const incidentTypeLabels: Record<string, string> = {
  violence_against_inmate: 'Violencia contra PPL', violence_against_staff: 'Violencia contra personal',
  gang_activity: 'Actividad pandillera', extortion_attempt: 'Intento de extorsión',
  contraband_possession: 'Posesión de contrabando', escape_attempt: 'Intento de fuga',
  riot_participation: 'Participación en motín', unauthorized_communication: 'Comunicación no autorizada',
  bribery_attempt: 'Intento de soborno', weapon_possession: 'Posesión de arma',
  drug_possession: 'Posesión de drogas', cell_phone_possession: 'Posesión de celular',
  threatening_behavior: 'Comportamiento amenazante', sexual_harassment: 'Acoso sexual',
  property_damage: 'Daño a propiedad', rule_violation: 'Violación de reglas',
};

const filters = ref({ search: '', incident_type: '', severity_level: '', date_from: '', date_to: '' });
const pagination = ref({ currentPage: 1, perPage: 15, total: 0, lastPage: 1, from: 0, to: 0 });
const stats = ref({ total: 0, investigating: 0, resolved: 0, critical: 0 });

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
    const params = new URLSearchParams({
      page: pagination.value.currentPage.toString(),
      per_page: pagination.value.perPage.toString(),
      ...Object.fromEntries(Object.entries(filters.value).filter(([_, v]) => v !== ''))
    });
    const res = await ApiService.get(`/security/incidents?${params.toString()}`);
    if (res.data?.success && res.data.data) {
      const pd = res.data.data;
      const data = Array.isArray(pd) ? pd : (pd.data || []);
      if (!Array.isArray(pd)) {
        pagination.value = { ...pagination.value, currentPage: pd.current_page || 1, total: pd.total || 0, lastPage: pd.last_page || 1, from: pd.from || 0, to: pd.to || 0 };
      }
      records.value = data;
    }
  } catch (e) { console.error('Error loading incidents:', e); }
  finally { loading.value = false; }
};

const loadStats = async () => {
  try {
    const res = await ApiService.get('/security/incidents/statistics');
    if (res.data?.success) {
      const s = res.data.data;
      stats.value = { total: s.total_incidents || 0, investigating: s.by_status?.investigating || 0, resolved: s.by_status?.resolved || 0, critical: s.by_severity?.critical || 0 };
    }
  } catch (e) { console.error('Error loading stats:', e); }
};

const getTypeLabel = (t: string) => incidentTypeLabels[t] || t;
const getSeverityBadge = (s: string) => ({ low: 'badge-light-info', medium: 'badge-light-warning', high: 'badge-light-danger', critical: 'badge-danger' }[s] || 'badge-light');
const getSeverityLabel = (s: string) => ({ low: 'Baja', medium: 'Media', high: 'Alta', critical: 'Crítica' }[s] || s);
const getStatusBadge = (s: string) => ({ pending: 'badge-light-secondary', investigating: 'badge-light-warning', resolved: 'badge-light-success', dismissed: 'badge-light-info', reported: 'badge-light-info', closed: 'badge-light-secondary' }[s] || 'badge-light');
const getStatusLabel = (s: string) => ({ pending: 'Pendiente', investigating: 'Investigando', resolved: 'Resuelto', dismissed: 'Desestimado', reported: 'Reportado', closed: 'Cerrado' }[s] || s);
const formatDateTime = (d: string) => d ? new Date(d).toLocaleString('es-GT') : 'N/A';

const handleSearch = debounce(() => { pagination.value.currentPage = 1; loadRecords(); }, 500);
const handleFilterChange = () => { pagination.value.currentPage = 1; loadRecords(); };
const resetFilters = () => { filters.value = { search: '', incident_type: '', severity_level: '', date_from: '', date_to: '' }; pagination.value.currentPage = 1; loadRecords(); };
const changePage = (p: number) => { if (p >= 1 && p <= pagination.value.lastPage) { pagination.value.currentPage = p; loadRecords(); } };
const changePerPage = (pp: number) => { pagination.value.perPage = pp; pagination.value.currentPage = 1; loadRecords(); };
const nextPage = () => { if (pagination.value.currentPage < pagination.value.lastPage) changePage(pagination.value.currentPage + 1); };
const prevPage = () => { if (pagination.value.currentPage > 1) changePage(pagination.value.currentPage - 1); };

const openCreateModal = () => { selectedRecord.value = null; isEditing.value = false; formModalRef.value?.open(); };
const editRecord = (r: any) => { selectedRecord.value = r; isEditing.value = true; formModalRef.value?.open(); };
const viewDetail = (r: any) => { selectedRecord.value = r; detailModalRef.value?.open(); };
const deleteRecord = async (r: any) => {
  const result = await Swal.fire({ title: 'Eliminar incidente', text: '¿Está seguro?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Eliminar', cancelButtonText: 'Cancelar' });
  if (result.isConfirmed) {
    try { await ApiService.delete(`/security/incidents/${r.id}`); Swal.fire({ icon: 'success', title: 'Eliminado', timer: 2000, showConfirmButton: false }); loadRecords(); loadStats(); }
    catch { Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el incidente' }); }
  }
};
const onSaved = () => { loadRecords(); loadStats(); Swal.fire({ icon: 'success', title: 'Incidente guardado', timer: 2000, showConfirmButton: false }); };

onMounted(async () => { await Promise.all([loadRecords(), loadStats()]); });
</script>

<style scoped>
.hoverable { transition: transform 0.2s; cursor: pointer; }
.hoverable:hover { transform: translateY(-5px); }
</style>
