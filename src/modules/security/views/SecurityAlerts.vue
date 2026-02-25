<template>
  <div class="security-alerts-page">
    <!-- Header Card -->
    <div class="card mb-5">
      <div class="card-body d-flex align-items-center justify-content-between">
        <div>
          <h1 class="fs-2x fw-bold text-gray-900 mb-0">Alertas de Seguridad</h1>
          <p class="text-gray-600 fs-6 fw-semibold mb-0">
            Sistema de alertas y notificaciones de seguridad
          </p>
        </div>
        <button v-if="canCreate" type="button" class="btn btn-primary" @click="openCreateModal">
          <i class="fas fa-plus me-2"></i>Nueva Alerta
        </button>
      </div>
    </div>

    <!-- Filters Card -->
    <div class="card mb-5">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Buscar</label>
            <input v-model="filters.search" type="text" class="form-control" placeholder="Buscar..." @input="handleSearch" />
          </div>
          <div class="col-md-2">
            <label class="form-label">Tipo</label>
            <select v-model="filters.alert_type" class="form-select" @change="handleFilterChange">
              <option value="">Todos</option>
              <option v-for="t in alertTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Prioridad</label>
            <select v-model="filters.priority_level" class="form-select" @change="handleFilterChange">
              <option value="">Todas</option>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Estado</label>
            <select v-model="filters.is_active" class="form-select" @change="handleFilterChange">
              <option value="">Todos</option>
              <option value="true">Activas</option>
              <option value="false">Inactivas</option>
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
        <div class="card bg-danger hoverable">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="me-5"><i class="fas fa-bell fs-2x text-white"></i></span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.total_active }}</div>
                <div class="fs-7">Alertas Activas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-dark hoverable">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="me-5"><i class="fas fa-exclamation-circle fs-2x text-white"></i></span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.critical }}</div>
                <div class="fs-7">Críticas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-warning hoverable">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="me-5"><i class="fas fa-bolt fs-2x text-white"></i></span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.immediate }}</div>
                <div class="fs-7">Acción Inmediata</div>
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
                <div class="fs-2 fw-bold">{{ stats.resolved_today }}</div>
                <div class="fs-7">Resueltas Hoy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="card">
      <div class="card-header border-0 pt-6">
        <div class="card-title"><span class="card-label fw-bold fs-3 mb-1">Listado de Alertas</span></div>
      </div>
      <div class="card-body pt-0">
        <div v-if="loading" class="text-center py-10">
          <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div>
        </div>
        <div v-else-if="records.length === 0" class="text-center py-10">
          <i class="fas fa-bell-slash fs-3x text-gray-300 mb-5"></i>
          <p class="text-gray-500 fs-5">No se encontraron alertas</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table align-middle table-row-dashed fs-6 gy-3">
            <thead>
              <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                <th>PPL</th>
                <th>Tipo</th>
                <th>Prioridad</th>
                <th>Fecha</th>
                <th>Expiración</th>
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
                <td>{{ getTypeLabel(r.alert_type) }}</td>
                <td><span class="badge" :class="getPriorityBadge(r.priority_level)">{{ getPriorityLabel(r.priority_level) }}</span></td>
                <td>{{ formatDate(r.alert_date) }}</td>
                <td>
                  <span :class="{ 'text-danger fw-bold': isExpired(r.expiration_date) }">{{ formatDate(r.expiration_date) }}</span>
                </td>
                <td>
                  <span v-if="r.is_active" class="badge badge-light-danger">Activa</span>
                  <span v-else class="badge badge-light-secondary">Inactiva</span>
                  <span v-if="r.requires_immediate_action" class="badge badge-danger ms-1"><i class="fas fa-bolt"></i></span>
                </td>
                <td class="text-end">
                  <div class="d-flex gap-2 justify-content-end">
                    <button type="button" class="btn btn-icon btn-sm btn-light-primary" title="Ver" @click="viewDetail(r)"><i class="fas fa-eye"></i></button>
                    <button v-if="canEdit" type="button" class="btn btn-icon btn-sm btn-light-warning" title="Editar" @click="editRecord(r)"><i class="fas fa-pencil-alt"></i></button>
                    <button v-if="canEdit && r.is_active" type="button" class="btn btn-icon btn-sm btn-light-secondary" title="Descartar" @click="dismissAlert(r)"><i class="fas fa-times"></i></button>
                    <button v-if="canEdit && r.is_active && r.priority_level !== 'critical'" type="button" class="btn btn-icon btn-sm btn-light-danger" title="Escalar" @click="escalateAlert(r)"><i class="fas fa-arrow-up"></i></button>
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
    <AlertFormModal ref="formModalRef" :alert="selectedRecord" :is-editing="isEditing" @saved="onSaved" />
    <AlertDetailModal ref="detailModalRef" :alert="selectedRecord" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ApiService from '@/core/services/ApiService';
import { debounce } from 'lodash';
import Swal from 'sweetalert2';
import AlertFormModal from '@/components/security/AlertFormModal.vue';
import AlertDetailModal from '@/components/security/AlertDetailModal.vue';

const authStore = useAuthStore();
const canCreate = computed(() => authStore.isSuperAdmin || authStore.hasPermission('security.alerts.edit'));
const canEdit = computed(() => authStore.isSuperAdmin || authStore.hasPermission('security.alerts.edit'));

const records = ref<any[]>([]);
const loading = ref(false);
const selectedRecord = ref<any>(null);
const isEditing = ref(false);
const formModalRef = ref<any>(null);
const detailModalRef = ref<any>(null);

const alertTypes = [
  { value: 'escape_risk', label: 'Riesgo de Fuga' },
  { value: 'violence_risk', label: 'Riesgo de Violencia' },
  { value: 'gang_activity', label: 'Actividad Pandillera' },
  { value: 'contraband', label: 'Contrabando' },
  { value: 'suicide_risk', label: 'Riesgo Suicida' },
  { value: 'medical_emergency', label: 'Emergencia Médica' },
  { value: 'external_threat', label: 'Amenaza Externa' },
  { value: 'riot_potential', label: 'Potencial Motín' },
  { value: 'intelligence_alert', label: 'Alerta de Inteligencia' },
  { value: 'transfer_required', label: 'Traslado Requerido' },
  { value: 'other', label: 'Otra' },
];

const filters = ref({ search: '', alert_type: '', priority_level: '', is_active: '' });
const pagination = ref({ currentPage: 1, perPage: 15, total: 0, lastPage: 1, from: 0, to: 0 });
const stats = ref({ total_active: 0, critical: 0, immediate: 0, resolved_today: 0 });

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
    const res = await ApiService.get(`/security/alerts?${params.toString()}`);
    if (res.data?.success && res.data.data) {
      const pd = res.data.data;
      const data = Array.isArray(pd) ? pd : (pd.data || []);
      if (!Array.isArray(pd)) {
        pagination.value = { ...pagination.value, currentPage: pd.current_page || 1, total: pd.total || 0, lastPage: pd.last_page || 1, from: pd.from || 0, to: pd.to || 0 };
      }
      records.value = data;
    }
  } catch (e) { console.error('Error loading alerts:', e); }
  finally { loading.value = false; }
};

const loadStats = async () => {
  try {
    const res = await ApiService.get('/security/alerts/statistics');
    if (res.data?.success) {
      const s = res.data.data;
      stats.value = {
        total_active: s.total_active || 0,
        critical: s.critical || s.by_priority?.critical || 0,
        immediate: s.requires_immediate_action || 0,
        resolved_today: s.resolved_today || 0,
      };
    }
  } catch (e) { console.error('Error loading stats:', e); }
};

const getInmateName = (r: any) => { const i = r?.inmate; if (!i) return 'N/A'; return [i.first_name, i.last_name, i.second_last_name].filter(Boolean).join(' '); };
const getTypeLabel = (t: string) => alertTypes.find(a => a.value === t)?.label || t;
const getPriorityBadge = (p: string) => ({ low: 'badge-light-info', medium: 'badge-light-warning', high: 'badge-light-danger', critical: 'badge-danger' }[p] || 'badge-light');
const getPriorityLabel = (p: string) => ({ low: 'Baja', medium: 'Media', high: 'Alta', critical: 'Crítica' }[p] || p);
const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('es-GT') : 'N/A';
const isExpired = (d: string) => d ? new Date(d) < new Date() : false;

const handleSearch = debounce(() => { pagination.value.currentPage = 1; loadRecords(); }, 500);
const handleFilterChange = () => { pagination.value.currentPage = 1; loadRecords(); };
const resetFilters = () => { filters.value = { search: '', alert_type: '', priority_level: '', is_active: '' }; pagination.value.currentPage = 1; loadRecords(); };
const changePage = (p: number) => { if (p >= 1 && p <= pagination.value.lastPage) { pagination.value.currentPage = p; loadRecords(); } };
const changePerPage = (pp: number) => { pagination.value.perPage = pp; pagination.value.currentPage = 1; loadRecords(); };
const nextPage = () => { if (pagination.value.currentPage < pagination.value.lastPage) changePage(pagination.value.currentPage + 1); };
const prevPage = () => { if (pagination.value.currentPage > 1) changePage(pagination.value.currentPage - 1); };

const openCreateModal = () => { selectedRecord.value = null; isEditing.value = false; formModalRef.value?.open(); };
const editRecord = (r: any) => { selectedRecord.value = r; isEditing.value = true; formModalRef.value?.open(); };
const viewDetail = (r: any) => { selectedRecord.value = r; detailModalRef.value?.open(); };

const dismissAlert = async (r: any) => {
  const result = await Swal.fire({ title: 'Descartar alerta', text: '¿Está seguro de descartar esta alerta?', icon: 'question', showCancelButton: true, confirmButtonText: 'Descartar', cancelButtonText: 'Cancelar', input: 'textarea', inputPlaceholder: 'Notas de resolución (opcional)...' });
  if (result.isConfirmed) {
    try {
      await ApiService.post(`/security/alerts/${r.id}/dismiss`, { resolution_notes: result.value || '' });
      Swal.fire({ icon: 'success', title: 'Alerta descartada', timer: 2000, showConfirmButton: false });
      loadRecords(); loadStats();
    } catch { Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo descartar la alerta' }); }
  }
};

const escalateAlert = async (r: any) => {
  const result = await Swal.fire({ title: 'Escalar alerta', text: 'Esto elevará la prioridad a Crítica.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Escalar', cancelButtonText: 'Cancelar', input: 'textarea', inputPlaceholder: 'Notas de escalamiento...' });
  if (result.isConfirmed) {
    try {
      await ApiService.post(`/security/alerts/${r.id}/escalate`, { escalation_notes: result.value || '' });
      Swal.fire({ icon: 'success', title: 'Alerta escalada', timer: 2000, showConfirmButton: false });
      loadRecords(); loadStats();
    } catch { Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo escalar la alerta' }); }
  }
};

const onSaved = () => { loadRecords(); loadStats(); Swal.fire({ icon: 'success', title: 'Alerta guardada', timer: 2000, showConfirmButton: false }); };

onMounted(async () => { await Promise.all([loadRecords(), loadStats()]); });
</script>

<style scoped>
.hoverable { transition: transform 0.2s; cursor: pointer; }
.hoverable:hover { transform: translateY(-5px); }
</style>
