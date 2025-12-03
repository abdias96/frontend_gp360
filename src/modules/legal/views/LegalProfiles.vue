<template>
  <div class="legal-profiles-page">
    <!-- Page header -->
    <div class="row g-5 g-xl-10 mb-5">
      <div class="col-12">
        <div class="card">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">{{ t('legal.profiles.title') }}</span>
              <span class="text-muted mt-1 fw-semibold fs-7">{{ t('legal.profiles.subtitle') }}</span>
            </h3>
            <div class="card-toolbar">
              <!-- Search -->
              <div class="d-flex align-items-center position-relative my-1 me-3">
                <KTIcon
                  icon-name="magnifier"
                  icon-class="fs-1 position-absolute ms-6"
                />
                <input
                  type="text"
                  v-model="searchQuery"
                  @input="handleSearch"
                  class="form-control form-control-solid w-250px ps-15"
                  :placeholder="t('common.search')"
                />
              </div>
              
              <!-- Filter by center -->
              <div class="me-3">
                <select
                  v-model="selectedCenter"
                  @change="handleFilter"
                  class="form-select form-select-solid"
                >
                  <option value="">{{ t('legal.profiles.allCenters') }}</option>
                  <option
                    v-for="center in centersOptions"
                    :key="center.value"
                    :value="center.value"
                  >
                    {{ center.label }}
                  </option>
                </select>
              </div>

              <!-- Filter by status -->
              <div class="me-3">
                <select
                  v-model="selectedStatus"
                  @change="handleFilter"
                  class="form-select form-select-solid"
                >
                  <option value="">{{ t('legal.profiles.allStatuses') }}</option>
                  <option
                    v-for="status in proceduralStatusesOptions"
                    :key="status.value"
                    :value="status.value"
                  >
                    {{ status.label }}
                  </option>
                </select>
              </div>
              
              <!-- Actions -->
              <button
                v-if="canExport"
                type="button"
                class="btn btn-primary"
                @click="handleExport"
              >
                <KTIcon icon-name="exit-up" icon-class="fs-2" />
                {{ t('common.export') }}
              </button>
            </div>
          </div>
          
          <div class="card-body py-3">
            <!-- Table loading -->
            <div v-if="loading" class="d-flex justify-content-center py-10">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">{{ t('common.loading') }}</span>
              </div>
            </div>

            <!-- Table -->
            <div v-else-if="profiles.length > 0" class="table-responsive">
              <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th class="min-w-150px">{{ t('legal.profiles.inmate') }}</th>
                    <th class="min-w-150px">{{ t('legal.profiles.fileNumber') }}</th>
                    <th class="min-w-150px">{{ t('legal.profiles.status') }}</th>
                    <th class="min-w-100px">{{ t('legal.profiles.entryDate') }}</th>
                    <th class="min-w-150px">{{ t('legal.profiles.crimes') }}</th>
                    <th class="min-w-100px">{{ t('legal.profiles.totalSentence') }}</th>
                    <th class="min-w-100px">{{ t('legal.profiles.releaseDate') }}</th>
                    <th class="min-w-100px text-end">{{ t('common.actions.title') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="profile in profiles" :key="profile.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="symbol symbol-45px me-5" v-if="profile.inmate">
                          <img
                            :src="profile.inmate?.photo_url || getAssetPath('media/avatars/blank.png')"
                            :alt="profile.inmate?.name || profile.inmate?.full_name || 'PPL'"
                          />
                        </div>
                        <div class="d-flex justify-content-start flex-column">
                          <a
                            href="#"
                            class="text-gray-900 fw-bold text-hover-primary fs-6"
                            @click.prevent="profile.inmate?.id && viewInmateDetail(profile.inmate.id)"
                          >
                            {{ profile.inmate?.full_name || 'Sin nombre' }}
                          </a>
                          <span class="text-muted fw-semibold text-muted d-block fs-7">
                            {{ profile.case_number || '-' }}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="text-gray-900 fw-bold d-block fs-6">
                        {{ profile.judicial_file_number || profile.registry_number || '-' }}
                      </span>
                    </td>
                    <td>
                      <div class="d-flex flex-column">
                        <span
                          class="badge badge-lg mb-1"
                          :class="getStatusBadgeClass(profile.procedural_status?.code)"
                        >
                          {{ profile.procedural_status?.name || getStatusName(profile.procedural_status_id) }}
                        </span>
                        <span
                          v-if="profile.procedural_stage"
                          class="badge badge-sm"
                          :class="getProceduralStageBadgeClass(profile.procedural_stage)"
                        >
                          {{ getProceduralStageLabel(profile.procedural_stage) }}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span class="text-gray-900 fw-bold d-block fs-6">
                        {{ formatDate(profile.sentence_start_date || profile.preventive_detention_start || profile.created_at) }}
                      </span>
                    </td>
                    <td>
                      <div class="d-flex flex-column">
                        <template v-if="profile.crimes && profile.crimes.length > 0">
                          <span
                            v-for="(crime, index) in profile.crimes.slice(0, 2)"
                            :key="index"
                            class="badge badge-light-dark mb-1 me-1"
                          >
                            {{ crime.crime?.name || crime.name || crime.crime_name || 'Sin especificar' }}
                          </span>
                          <span
                            v-if="profile.crimes.length > 2"
                            class="badge badge-light-secondary"
                          >
                            +{{ profile.crimes.length - 2 }} más
                          </span>
                        </template>
                        <span v-else class="text-muted">Sin delitos</span>
                      </div>
                    </td>
                    <td>
                      <span 
                        v-if="profile.total_sentence || profile.sentence_years"
                        class="badge badge-light-primary"
                      >
                        {{ profile.total_sentence || profile.sentence_years }}
                      </span>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <span class="text-gray-900 fw-bold d-block fs-6">
                        {{ profile.sentence_end_date ? formatDate(profile.sentence_end_date) : '-' }}
                      </span>
                    </td>
                    <td>
                      <div class="d-flex justify-content-end flex-shrink-0">
                        <a
                          v-if="canView"
                          href="#"
                          class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                          @click.prevent="viewProfile(profile.id)"
                          title="Ver perfil"
                        >
                          <KTIcon icon-name="eye" icon-class="fs-3" />
                        </a>
                        <a
                          v-if="canEdit"
                          href="#"
                          class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                          @click.prevent="editProfile(profile.id)"
                          title="Editar perfil"
                        >
                          <KTIcon icon-name="pencil" icon-class="fs-3" />
                        </a>
                        <a
                          v-if="canView"
                          href="#"
                          class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                          @click.prevent="viewTimeline(profile.id)"
                          title="Ver línea de tiempo"
                        >
                          <KTIcon icon-name="time" icon-class="fs-3" />
                        </a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Empty state -->
            <div v-else class="text-center py-10">
              <img
                :src="getAssetPath('media/illustrations/sketchy-1/5.png')"
                class="mw-200px mb-5"
                alt=""
              />
              <div class="fw-semibold fs-6 text-gray-500">
                {{ t('legal.profiles.noProfiles') }}
              </div>
            </div>

            <!-- Pagination -->
            <div
              v-if="!loading && profiles.length > 0"
              class="d-flex justify-content-between align-items-center flex-wrap"
            >
              <div class="d-flex align-items-center">
                <span class="text-muted">
                  {{ t('common.showing') }} {{ (currentPage - 1) * perPage + 1 }} -
                  {{ Math.min(currentPage * perPage, total) }} {{ t('common.of') }} {{ total }}
                </span>
              </div>
              <ul class="pagination">
                <li class="page-item previous" :class="{ disabled: currentPage === 1 }">
                  <a href="#" class="page-link" @click.prevent="changePage(currentPage - 1)">
                    <i class="previous"></i>
                  </a>
                </li>
                <li
                  v-for="page in displayedPages"
                  :key="page"
                  class="page-item"
                  :class="{ active: page === currentPage }"
                >
                  <a href="#" class="page-link" @click.prevent="changePage(page)">
                    {{ page }}
                  </a>
                </li>
                <li class="page-item next" :class="{ disabled: currentPage === totalPages }">
                  <a href="#" class="page-link" @click.prevent="changePage(currentPage + 1)">
                    <i class="next"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Export Modal -->
    <div 
      class="modal fade" 
      :class="{ show: showExportModal }" 
      :style="{ display: showExportModal ? 'block' : 'none' }"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Exportar Perfiles Legales</h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="showExportModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-5">
              <label class="form-label">Seleccione el formato de exportación:</label>
              <div class="d-flex flex-column">
                <label class="form-check form-check-custom form-check-solid mb-3">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    value="csv" 
                    v-model="exportFormat"
                  />
                  <span class="form-check-label">
                    <i class="bi bi-file-earmark-text me-2"></i>
                    CSV (Compatible con Excel)
                  </span>
                </label>
                <label class="form-check form-check-custom form-check-solid mb-3">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    value="excel" 
                    v-model="exportFormat"
                  />
                  <span class="form-check-label">
                    <i class="bi bi-file-earmark-excel me-2"></i>
                    Excel (.xlsx)
                  </span>
                </label>
                <label class="form-check form-check-custom form-check-solid">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    value="pdf" 
                    v-model="exportFormat"
                  />
                  <span class="form-check-label">
                    <i class="bi bi-file-earmark-pdf me-2"></i>
                    PDF (Para impresión)
                  </span>
                </label>
              </div>
            </div>
            <div class="text-muted fs-7">
              Se exportarán todos los registros que coincidan con los filtros actuales.
            </div>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-light" 
              @click="showExportModal = false"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="exportData"
            >
              <KTIcon icon-name="exit-up" icon-class="fs-2" />
              Exportar
            </button>
          </div>
        </div>
      </div>
    </div>
    <div 
      v-if="showExportModal" 
      class="modal-backdrop fade show"
      @click="showExportModal = false"
    ></div>
  </div>
</template>

<script lang="ts">
import jsPDF from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}
</script>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getAssetPath } from '@/core/helpers/assets';
import { useCatalogs } from '@/composables/useCatalogs';
import { useCatalogsStore } from '@/stores/catalogs';
import { useAuthStore } from '@/stores/auth';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

// Composables
const { t } = useI18n();
const router = useRouter();
const catalogsStore = useCatalogsStore();
const authStore = useAuthStore();
const { centersOptions, proceduralStatusesOptions, getCatalogById } = useCatalogs();

// Permission checks
const canEdit = computed(() => authStore.isSuperAdmin || authStore.hasPermission('legal.profiles.edit'));
const canView = computed(() => authStore.isSuperAdmin || authStore.hasPermission('legal.profiles'));
const canExport = computed(() => authStore.isSuperAdmin || authStore.hasPermission('legal.reports'));

// State
const loading = ref(false);
const profiles = ref<any[]>([]);
const searchQuery = ref('');
const selectedCenter = ref('');
const selectedStatus = ref('');
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);
const totalPages = ref(0);
const showExportModal = ref(false);
const exportFormat = ref('csv');

// Load catalogs on mount
const loadCatalogs = async () => {
  await catalogsStore.fetchMultipleCatalogs(['centers', 'procedural-statuses', 'courts']);
};

// Computed
const displayedPages = computed(() => {
  const pages: number[] = [];
  const maxPages = 5;
  let start = Math.max(1, currentPage.value - 2);
  let end = Math.min(totalPages.value, start + maxPages - 1);
  
  if (end - start < maxPages - 1) {
    start = Math.max(1, end - maxPages + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Methods
const loadProfiles = async () => {
  loading.value = true;
  try {
    const params: any = {
      page: currentPage.value,
      per_page: perPage.value,
    };
    
    // Only add filters if they have values
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }
    if (selectedCenter.value) {
      params.center_id = selectedCenter.value;
    }
    if (selectedStatus.value) {
      params.procedural_status_id = selectedStatus.value;
    }
    
    const response = await ApiService.query('/inmate-legal-profiles', params);
    
    // Handle nested response structure
    if (response.data.success && response.data.data) {
      const responseData = response.data.data;
      profiles.value = responseData.data || [];
      total.value = responseData.total || 0;
      totalPages.value = responseData.last_page || Math.ceil((responseData.total || 0) / perPage.value) || 1;
      currentPage.value = responseData.current_page || currentPage.value;
    } else {
      // Fallback for direct data structure
      profiles.value = response.data.data || [];
      total.value = response.data.total || 0;
      totalPages.value = response.data.last_page || Math.ceil(total.value / perPage.value);
    }
  } catch (error) {
    console.error('Error loading legal profiles:', error);
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: t('legal.profiles.loadError'),
    });
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  loadProfiles();
};

const handleFilter = () => {
  console.log('Filtering with:', {
    center: selectedCenter.value,
    status: selectedStatus.value
  });
  currentPage.value = 1;
  loadProfiles();
};

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadProfiles();
  }
};

const formatDate = (date: string) => {
  if (!date) return '-';
  try {
    // Handle ISO date strings
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    return dateObj.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    return '-';
  }
};

const getStatusName = (statusId: number) => {
  const status = getCatalogById('procedural-statuses', statusId);
  return status?.name || '-';
};

const getStatusBadgeClass = (statusCode: string | number) => {
  // If it's a number (statusId), try to get the status from catalog
  if (typeof statusCode === 'number') {
    const status = getCatalogById('procedural-statuses', statusCode);
    statusCode = status?.code || '';
  }
  
  const badgeClasses: Record<string, string> = {
    'PENDING': 'badge-light-warning',
    'PREVENTIVE': 'badge-light-info',
    'SENTENCED': 'badge-light-primary',
    'RELEASED': 'badge-light-success',
    'TRANSFERRED': 'badge-light-secondary',
  };
  
  return badgeClasses[statusCode as string] || 'badge-light-secondary';
};

const getProceduralStageLabel = (stage: string) => {
  if (!stage) return '';
  
  const stageMap: Record<string, string> = {
    'investigation': t('legal.profiles.proceduralStages.investigation'),
    'intermediate_phase': t('legal.profiles.proceduralStages.intermediate'),
    'trial': t('legal.profiles.proceduralStages.trial'),
    'sentence_execution': t('legal.profiles.proceduralStages.sentenceExecution'),
    'appeal_process': t('legal.profiles.proceduralStages.appeal'),
    'cassation': t('legal.profiles.proceduralStages.cassation'),
    'amparo_process': t('legal.profiles.proceduralStages.amparo')
  };
  
  return stageMap[stage] || stage;
};

const getProceduralStageBadgeClass = (stage: string) => {
  const badgeClasses: Record<string, string> = {
    'investigation': 'badge-light-warning',
    'intermediate_phase': 'badge-light-info',
    'trial': 'badge-light-primary',
    'sentence_execution': 'badge-light-success',
    'appeal_process': 'badge-light-danger',
    'cassation': 'badge-light-dark',
    'amparo_process': 'badge-light-secondary'
  };
  
  return badgeClasses[stage] || 'badge-light-secondary';
};

const viewInmateDetail = (inmateId: number) => {
  router.push({ name: 'inmates-detail', params: { id: inmateId } });
};

const viewProfile = (profileId: number) => {
  router.push({ name: 'legal-profile-detail', params: { id: profileId } });
};

const editProfile = (profileId: number) => {
  router.push({ name: 'legal-profile-edit', params: { id: profileId } });
};

const viewTimeline = (profileId: number) => {
  router.push({ name: 'legal-profile-timeline', params: { id: profileId } });
};

const handleExport = () => {
  showExportModal.value = true;
};

const exportData = async () => {
  try {
    // Fetch all data for export
    const response = await ApiService.query('/inmate-legal-profiles', {
      per_page: 1000, // Get all records
      search: searchQuery.value,
      center_id: selectedCenter.value,
      procedural_status_id: selectedStatus.value,
    });
    
    let exportProfiles = [];
    if (response.data.success && response.data.data) {
      exportProfiles = response.data.data.data || [];
    } else {
      exportProfiles = response.data.data || [];
    }

    if (exportFormat.value === 'csv') {
      exportToCSV(exportProfiles);
    } else if (exportFormat.value === 'pdf') {
      exportToPDF(exportProfiles);
    } else if (exportFormat.value === 'excel') {
      exportToExcel(exportProfiles);
    }
    
    showExportModal.value = false;
    
    Swal.fire({
      icon: 'success',
      title: t('common.success'),
      text: t('legal.profiles.exportSuccess'),
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error('Error exporting profiles:', error);
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: t('legal.profiles.exportError'),
    });
  }
};

const exportToCSV = (data: any[]) => {
  const headers = [
    'PPL',
    'Número de Caso',
    'Número de Expediente',
    'Estado Procesal',
    'Etapa Procesal',
    'Juzgado',
    'Fecha de Ingreso',
    'Sentencia Total',
    'Fecha de Liberación'
  ];
  
  const rows = data.map(profile => [
    profile.inmate?.full_name || 'Sin nombre',
    profile.case_number || '',
    profile.judicial_file_number || '',
    profile.procedural_status?.name || '',
    profile.procedural_stage || '',
    profile.court?.name || '',
    formatDate(profile.sentence_start_date || profile.preventive_detention_start || profile.created_at),
    profile.total_sentence || '',
    profile.sentence_end_date ? formatDate(profile.sentence_end_date) : ''
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `perfiles-legales-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
};

const exportToExcel = (data: any[]) => {
  const wsData = [
    [
      'PPL',
      'Número de Caso',
      'Número de Expediente',
      'Estado Procesal',
      'Etapa Procesal',
      'Juzgado',
      'Fecha de Ingreso',
      'Sentencia Total',
      'Fecha de Liberación'
    ],
    ...data.map(profile => [
      profile.inmate?.full_name || 'Sin nombre',
      profile.case_number || '',
      profile.judicial_file_number || '',
      profile.procedural_status?.name || '',
      profile.procedural_stage || '',
      profile.court?.name || '',
      formatDate(profile.sentence_start_date || profile.preventive_detention_start || profile.created_at),
      profile.total_sentence || '',
      profile.sentence_end_date ? formatDate(profile.sentence_end_date) : ''
    ])
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Perfiles Legales');
  XLSX.writeFile(wb, `perfiles-legales-${new Date().toISOString().slice(0, 10)}.xlsx`);
};

const exportToPDF = (data: any[]) => {
  const doc = new jsPDF('l', 'mm', 'a4');
  
  doc.setFontSize(18);
  doc.text('Perfiles Legales', 14, 22);
  doc.setFontSize(11);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-GT')}`, 14, 30);
  
  const headers = [['PPL', 'Caso', 'Expediente', 'Estado', 'Etapa', 'Juzgado', 'Ingreso', 'Sentencia']];
  const rows = data.map(profile => [
    profile.inmate?.full_name || 'Sin nombre',
    profile.case_number || '',
    profile.judicial_file_number || '',
    profile.procedural_status?.name || '',
    profile.procedural_stage || '',
    profile.court?.name || '',
    formatDate(profile.sentence_start_date || profile.created_at),
    profile.total_sentence || ''
  ]);
  
  (doc as any).autoTable({
    head: headers,
    body: rows,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  });
  
  doc.save(`perfiles-legales-${new Date().toISOString().slice(0, 10)}.pdf`);
};

// Lifecycle
onMounted(async () => {
  await loadCatalogs();
  await loadProfiles();
});

// Watch for catalog changes
watch(() => catalogsStore.catalogs, () => {
  // Re-render when catalogs are loaded
}, { deep: true });
</script>