<template>
  <div class="incidents-page">
    <!-- Header Card -->
    <div class="card mb-5">
      <div class="card-body d-flex align-items-center justify-content-between">
        <div>
          <h1 class="fs-2x fw-bold text-gray-900 mb-0">Incidentes de Seguridad</h1>
          <p class="text-gray-600 fs-6 fw-semibold mb-0">
            Registro y seguimiento de incidentes de seguridad
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
          <div class="col-md-3">
            <label class="form-label">Buscar</label>
            <input v-model="filters.search" type="text" class="form-control" placeholder="Descripción, ubicación..." @input="handleSearch" />
          </div>
          <div class="col-md-2">
            <label class="form-label">Tipo</label>
            <select v-model="filters.incident_type" class="form-select" @change="handleFilterChange">
              <option value="">Todos</option>
              <option v-for="t in incidentTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
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
            <label class="form-label">Estado</label>
            <select v-model="filters.resolution_status" class="form-select" @change="handleFilterChange">
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="investigating">Investigando</option>
              <option value="resolved">Resuelto</option>
              <option value="dismissed">Desestimado</option>
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
              <span class="me-5"><i class="fas fa-exclamation-triangle fs-2x text-white"></i></span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.total }}</div>
                <div class="fs-7">Total Incidentes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-danger hoverable">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="me-5"><i class="fas fa-fire fs-2x text-white"></i></span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.critical }}</div>
                <div class="fs-7">Críticos</div>
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
          <i class="fas fa-shield-alt fs-3x text-gray-300 mb-5"></i>
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
                  <div class="d-flex flex-column">
                    <span class="text-gray-800 fw-bold">{{ getInmateName(r) }}</span>
                    <span class="text-muted fs-7">{{ r.inmate?.inmate_number || 'N/A' }}</span>
                  </div>
                </td>
                <td>{{ getTypeLabel(r.incident_type) }}</td>
                <td>
                  <span class="badge" :class="getSeverityBadge(r.severity_level)">{{ getSeverityLabel(r.severity_level) }}</span>
                </td>
                <td>{{ formatDateTime(r.incident_date) }}</td>
                <td>{{ r.location || 'N/A' }}</td>
                <td>
                  <span class="badge" :class="getStatusBadge(r.resolution_status)">{{ getStatusLabel(r.resolution_status) }}</span>
                </td>
                <td class="text-end">
                  <div class="d-flex gap-2 justify-content-end">
                    <button type="button" class="btn btn-icon btn-sm btn-light-primary" title="Ver" @click="viewDetail(r)"><i class="fas fa-eye"></i></button>
                    <button v-if="canEdit" type="button" class="btn btn-icon btn-sm btn-light-warning" title="Editar" @click="editRecord(r)"><i class="fas fa-pencil-alt"></i></button>
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

const records = ref<any[]>([]);
const loading = ref(false);
const selectedRecord = ref<any>(null);
const isEditing = ref(false);
const formModalRef = ref<any>(null);
const detailModalRef = ref<any>(null);

const incidentTypes = [
  { value: 'violence_against_inmate', label: 'Violencia contra PPL' },
  { value: 'violence_against_staff', label: 'Violencia contra personal' },
  { value: 'gang_activity', label: 'Actividad pandillera' },
  { value: 'extortion_attempt', label: 'Intento de extorsión' },
  { value: 'contraband_possession', label: 'Posesión de contrabando' },
  { value: 'escape_attempt', label: 'Intento de fuga' },
  { value: 'riot_participation', label: 'Participación en motín' },
  { value: 'unauthorized_communication', label: 'Comunicación no autorizada' },
  { value: 'weapon_possession', label: 'Posesión de arma' },
  { value: 'drug_possession', label: 'Posesión de drogas' },
  { value: 'cell_phone_possession', label: 'Posesión de celular' },
  { value: 'threatening_behavior', label: 'Comportamiento amenazante' },
  { value: 'property_damage', label: 'Daño a propiedad' },
  { value: 'rule_violation', label: 'Violación de reglas' },
];

const filters = ref({ search: '', incident_type: '', severity_level: '', resolution_status: '' });
const pagination = ref({ currentPage: 1, perPage: 15, total: 0, lastPage: 1, from: 0, to: 0 });
const stats = ref({ total: 0, critical: 0, investigating: 0, resolved: 0 });

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
      stats.value = {
        total: s.total_incidents || 0,
        critical: s.by_severity?.critical || 0,
        investigating: s.by_status?.investigating || 0,
        resolved: s.by_status?.resolved || 0,
      };
    }
  } catch (e) { console.error('Error loading stats:', e); }
};

const getInmateName = (r: any) => { const i = r?.inmate; if (!i) return 'N/A'; return [i.first_name, i.last_name].filter(Boolean).join(' '); };
const getTypeLabel = (t: string) => incidentTypes.find(a => a.value === t)?.label || t;
const getSeverityBadge = (s: string) => ({ low: 'badge-light-info', medium: 'badge-light-warning', high: 'badge-light-danger', critical: 'badge-danger' }[s] || 'badge-light');
const getSeverityLabel = (s: string) => ({ low: 'Baja', medium: 'Media', high: 'Alta', critical: 'Crítica' }[s] || s);
const getStatusBadge = (s: string) => ({ pending: 'badge-light-secondary', investigating: 'badge-light-warning', resolved: 'badge-light-success', dismissed: 'badge-light-info' }[s] || 'badge-light');
const getStatusLabel = (s: string) => ({ pending: 'Pendiente', investigating: 'Investigando', resolved: 'Resuelto', dismissed: 'Desestimado' }[s] || s);
const formatDateTime = (d: string) => d ? new Date(d).toLocaleString('es-GT', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A';

const handleSearch = debounce(() => { pagination.value.currentPage = 1; loadRecords(); }, 500);
const handleFilterChange = () => { pagination.value.currentPage = 1; loadRecords(); };
const resetFilters = () => { filters.value = { search: '', incident_type: '', severity_level: '', resolution_status: '' }; pagination.value.currentPage = 1; loadRecords(); };
const changePage = (p: number) => { if (p >= 1 && p <= pagination.value.lastPage) { pagination.value.currentPage = p; loadRecords(); } };
const changePerPage = (pp: number) => { pagination.value.perPage = pp; pagination.value.currentPage = 1; loadRecords(); };
const nextPage = () => { if (pagination.value.currentPage < pagination.value.lastPage) changePage(pagination.value.currentPage + 1); };
const prevPage = () => { if (pagination.value.currentPage > 1) changePage(pagination.value.currentPage - 1); };

const openCreateModal = () => { selectedRecord.value = null; isEditing.value = false; formModalRef.value?.open(); };
const editRecord = (r: any) => { selectedRecord.value = r; isEditing.value = true; formModalRef.value?.open(); };
const viewDetail = (r: any) => { selectedRecord.value = r; detailModalRef.value?.open(); };
const onSaved = () => { loadRecords(); loadStats(); Swal.fire({ icon: 'success', title: 'Incidente guardado', timer: 2000, showConfirmButton: false }); };

onMounted(async () => { await Promise.all([loadRecords(), loadStats()]); });
</script>

<style scoped>
.hoverable { transition: transform 0.2s; cursor: pointer; }
.hoverable:hover { transform: translateY(-5px); }
</style>
