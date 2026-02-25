<template>
  <div class="gang-affiliations-page">
    <!-- Header Card -->
    <div class="card mb-5">
      <div class="card-body d-flex align-items-center justify-content-between">
        <div>
          <h1 class="fs-2x fw-bold text-gray-900 mb-0">Afiliaciones a Pandillas</h1>
          <p class="text-gray-600 fs-6 fw-semibold mb-0">
            Gestión y monitoreo de afiliaciones a grupos delictivos
          </p>
        </div>
        <button v-if="canCreate" type="button" class="btn btn-primary" @click="openCreateModal">
          <i class="fas fa-plus me-2"></i>Nueva Afiliación
        </button>
      </div>
    </div>

    <!-- Filters Card -->
    <div class="card mb-5">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Buscar PPL</label>
            <input v-model="filters.search" type="text" class="form-control" placeholder="Nombre, DPI o código..." @input="handleSearch" />
          </div>
          <div class="col-md-2">
            <label class="form-label">Tipo Pandilla</label>
            <select v-model="filters.gang_type" class="form-select" @change="handleFilterChange">
              <option value="">Todos</option>
              <option value="ms13">MS-13</option>
              <option value="barrio18_surenos">B18 Sureños</option>
              <option value="barrio18_revolucionarios">B18 Revolucionarios</option>
              <option value="other_gang">Otra Pandilla</option>
              <option value="organized_crime">Crimen Org.</option>
              <option value="drug_cartel">Cartel</option>
              <option value="none">Ninguna</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Inteligencia</label>
            <select v-model="filters.intelligence_level" class="form-select" @change="handleFilterChange">
              <option value="">Todos</option>
              <option value="low">Bajo</option>
              <option value="medium">Medio</option>
              <option value="high">Alto</option>
              <option value="critical">Crítico</option>
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
              <span class="me-5"><i class="fas fa-users fs-2x text-white"></i></span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.total }}</div>
                <div class="fs-7">Total Afiliados</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-danger hoverable">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="me-5"><i class="fas fa-skull-crossbones fs-2x text-white"></i></span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.ms13 }}</div>
                <div class="fs-7">MS-13</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-warning hoverable">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="me-5"><i class="fas fa-fist-raised fs-2x text-white"></i></span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.barrio18 }}</div>
                <div class="fs-7">Barrio 18</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-dark hoverable">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="me-5"><i class="fas fa-exclamation-triangle fs-2x text-white"></i></span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.high_threat }}</div>
                <div class="fs-7">Alto Riesgo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="card">
      <div class="card-header border-0 pt-6">
        <div class="card-title"><span class="card-label fw-bold fs-3 mb-1">Listado de Afiliaciones</span></div>
      </div>
      <div class="card-body pt-0">
        <div v-if="loading" class="text-center py-10">
          <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div>
        </div>
        <div v-else-if="records.length === 0" class="text-center py-10">
          <i class="fas fa-users fs-3x text-gray-300 mb-5"></i>
          <p class="text-gray-500 fs-5">No se encontraron afiliaciones</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table align-middle table-row-dashed fs-6 gy-3">
            <thead>
              <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                <th>PPL</th>
                <th>Pandilla</th>
                <th>Nivel</th>
                <th>Inteligencia</th>
                <th>Vigente</th>
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
                <td>
                  <span class="badge" :class="getGangBadge(r.gang_type)">{{ getGangLabel(r.gang_type) }}</span>
                  <div v-if="r.gang_name" class="text-muted fs-7">{{ r.gang_name }}</div>
                </td>
                <td>{{ getLevelLabel(r.affiliation_level) }}</td>
                <td>
                  <span class="badge" :class="getIntelBadge(r.intelligence_level)">
                    {{ getIntelLabel(r.intelligence_level) }}
                  </span>
                </td>
                <td>
                  <span v-if="r.is_current" class="badge badge-light-success">Sí</span>
                  <span v-else class="badge badge-light-secondary">No</span>
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
    <GangAffiliationFormModal ref="formModalRef" :affiliation="selectedRecord" :is-editing="isEditing" @saved="onSaved" />
    <GangAffiliationDetailModal ref="detailModalRef" :affiliation="selectedRecord" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ApiService from '@/core/services/ApiService';
import { debounce } from 'lodash';
import Swal from 'sweetalert2';
import GangAffiliationFormModal from '@/components/security/GangAffiliationFormModal.vue';
import GangAffiliationDetailModal from '@/components/security/GangAffiliationDetailModal.vue';

const authStore = useAuthStore();
const canCreate = computed(() => authStore.isSuperAdmin || authStore.hasPermission('security.gangs.edit'));
const canEdit = computed(() => authStore.isSuperAdmin || authStore.hasPermission('security.gangs.edit'));

const records = ref<any[]>([]);
const loading = ref(false);
const selectedRecord = ref<any>(null);
const isEditing = ref(false);
const formModalRef = ref<any>(null);
const detailModalRef = ref<any>(null);

const filters = ref({ search: '', gang_type: '', intelligence_level: '' });
const pagination = ref({ currentPage: 1, perPage: 15, total: 0, lastPage: 1, from: 0, to: 0 });
const stats = ref({ total: 0, ms13: 0, barrio18: 0, high_threat: 0 });

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
      is_current: 'true',
      ...Object.fromEntries(Object.entries(filters.value).filter(([_, v]) => v !== ''))
    });
    const res = await ApiService.get(`/inmate-gang-affiliations?${params.toString()}`);
    if (res.data?.success && res.data.data) {
      const pd = res.data.data;
      const data = Array.isArray(pd) ? pd : (pd.data || []);
      if (!Array.isArray(pd)) {
        pagination.value = { ...pagination.value, currentPage: pd.current_page || 1, total: pd.total || 0, lastPage: pd.last_page || 1, from: pd.from || 0, to: pd.to || 0 };
      }
      records.value = data;
    }
  } catch (e) { console.error('Error loading gang affiliations:', e); }
  finally { loading.value = false; }
};

const loadStats = async () => {
  try {
    const res = await ApiService.get('/inmate-gang-affiliations/statistics');
    if (res.data?.success) {
      const s = res.data.data;
      stats.value.total = s.total_affiliations || s.total || 0;
      stats.value.ms13 = s.ms13_count || s.by_gang_type?.ms13 || 0;
      stats.value.barrio18 = s.barrio18_count || (s.by_gang_type?.barrio18_surenos || 0) + (s.by_gang_type?.barrio18_revolucionarios || 0);
      stats.value.high_threat = s.high_threat_count || (s.by_intelligence_level?.high || 0) + (s.by_intelligence_level?.critical || 0);
    }
  } catch (e) { console.error('Error loading stats:', e); }
};

const getInmateName = (r: any) => { const i = r?.inmate; if (!i) return 'N/A'; return [i.first_name, i.last_name, i.second_last_name].filter(Boolean).join(' '); };
const getGangLabel = (t: string) => ({ ms13: 'MS-13', barrio18_surenos: 'B18 Sureños', barrio18_revolucionarios: 'B18 Revolucionarios', other_gang: 'Otra Pandilla', drug_cartel: 'Cartel', organized_crime: 'Crimen Org.', none: 'Ninguna', barrio18: 'Barrio 18', local_gang: 'Pandilla Local', other: 'Otra' }[t] || t);
const getGangBadge = (t: string) => ({ ms13: 'badge-danger', barrio18_surenos: 'badge-warning', barrio18_revolucionarios: 'badge-warning', drug_cartel: 'badge-dark', organized_crime: 'badge-dark', barrio18: 'badge-warning' }[t] || 'badge-light-info');
const getLevelLabel = (l: string) => ({ suspected: 'Sospechoso', confirmed_member: 'Confirmado', leader: 'Líder', high_ranking: 'Alto Rango', founder: 'Fundador', inactive: 'Inactivo', former_member: 'Ex-miembro', core: 'Núcleo', active: 'Activo', associate: 'Asociado', sympathizer: 'Simpatizante', peripheral: 'Periférico', former: 'Ex-miembro', unknown: 'Desconocido' }[l] || l || 'N/A');
const getIntelBadge = (l: string) => ({ low: 'badge-light-success', medium: 'badge-light-warning', high: 'badge-light-danger', critical: 'badge-danger' }[l] || 'badge-light');
const getIntelLabel = (l: string) => ({ low: 'Bajo', medium: 'Medio', high: 'Alto', critical: 'Crítico' }[l] || l || 'N/A');

const handleSearch = debounce(() => { pagination.value.currentPage = 1; loadRecords(); }, 500);
const handleFilterChange = () => { pagination.value.currentPage = 1; loadRecords(); };
const resetFilters = () => { filters.value = { search: '', gang_type: '', intelligence_level: '' }; pagination.value.currentPage = 1; loadRecords(); };
const changePage = (p: number) => { if (p >= 1 && p <= pagination.value.lastPage) { pagination.value.currentPage = p; loadRecords(); } };
const changePerPage = (pp: number) => { pagination.value.perPage = pp; pagination.value.currentPage = 1; loadRecords(); };
const nextPage = () => { if (pagination.value.currentPage < pagination.value.lastPage) changePage(pagination.value.currentPage + 1); };
const prevPage = () => { if (pagination.value.currentPage > 1) changePage(pagination.value.currentPage - 1); };

const openCreateModal = () => { selectedRecord.value = null; isEditing.value = false; formModalRef.value?.open(); };
const editRecord = (r: any) => { selectedRecord.value = r; isEditing.value = true; formModalRef.value?.open(); };
const viewDetail = (r: any) => { selectedRecord.value = r; detailModalRef.value?.open(); };
const onSaved = () => { loadRecords(); loadStats(); Swal.fire({ icon: 'success', title: 'Afiliación guardada', timer: 2000, showConfirmButton: false }); };

onMounted(async () => { await Promise.all([loadRecords(), loadStats()]); });
</script>

<style scoped>
.hoverable { transition: transform 0.2s; cursor: pointer; }
.hoverable:hover { transform: translateY(-5px); }
</style>
