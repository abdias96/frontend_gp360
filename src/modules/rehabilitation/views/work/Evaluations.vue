<template>
  <ModuleListTemplate
    :title="t('rehabilitation.work.evaluations.title')"
    :subtitle="t('rehabilitation.work.evaluations.subtitle')"
    :items="items"
    :loading="loading"
    :total="total"
    :current-page="currentPage"
    :per-page="perPage"
    :show-create-button="false"
    :empty-state-text="t('rehabilitation.work.evaluations.noData')"
    @search="handleSearch"
    @change-page="changePage"
  >
    <!-- Filters -->
    <template #filters>
      <div class="me-3">
        <select
          v-model="selectedProgram"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('rehabilitation.filters.byProgram') }}</option>
          <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
      </div>
      <div class="me-3">
        <select
          v-model="selectedProgress"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('rehabilitation.filters.all') }}</option>
          <option value="poor">{{ t('rehabilitation.progressLevel.poor') }}</option>
          <option value="fair">{{ t('rehabilitation.progressLevel.fair') }}</option>
          <option value="good">{{ t('rehabilitation.progressLevel.good') }}</option>
          <option value="excellent">{{ t('rehabilitation.progressLevel.excellent') }}</option>
        </select>
      </div>
    </template>

    <!-- Table headers -->
    <template #table-headers>
      <th class="min-w-180px">{{ t('rehabilitation.work.evaluations.columns.inmate') }}</th>
      <th class="min-w-150px">{{ t('rehabilitation.work.evaluations.columns.program') }}</th>
      <th class="min-w-100px">{{ t('rehabilitation.work.evaluations.columns.progressLevel') }}</th>
      <th class="min-w-80px">{{ t('rehabilitation.work.evaluations.columns.overallScore') }}</th>
      <th class="min-w-100px">{{ t('rehabilitation.work.evaluations.columns.attendance') }}</th>
      <th class="min-w-150px">{{ t('rehabilitation.work.evaluations.columns.behavioralChanges') }}</th>
      <th class="min-w-120px">{{ t('rehabilitation.work.evaluations.columns.lastEvaluation') }}</th>
      <th class="min-w-100px text-end">{{ t('common.actions.title') }}</th>
    </template>

    <!-- Table body -->
    <template #table-body="{ items }">
      <tr v-for="item in items" :key="item.id">
        <td>
          <div class="d-flex justify-content-start flex-column">
            <span class="text-gray-900 fw-bold fs-6">
              {{ item.inmate?.first_name }} {{ item.inmate?.last_name }}
            </span>
            <span class="text-muted fw-semibold d-block fs-7">
              {{ item.inmate?.inmate_number || '-' }}
            </span>
          </div>
        </td>
        <td>
          <span class="text-gray-900 fs-6">{{ item.program?.name || '-' }}</span>
        </td>
        <td>
          <span class="badge" :class="getProgressBadge(item.progress_level)">
            {{ getProgressLabel(item.progress_level) }}
          </span>
        </td>
        <td>
          <span class="text-gray-900 fw-bold fs-6">{{ item.overall_grade || '-' }}</span>
        </td>
        <td>
          <div class="d-flex align-items-center" v-if="item.attendance_percentage != null">
            <div class="progress w-50 me-2" style="height: 6px;">
              <div
                class="progress-bar"
                :class="item.attendance_percentage >= 80 ? 'bg-success' : item.attendance_percentage >= 60 ? 'bg-warning' : 'bg-danger'"
                :style="{ width: item.attendance_percentage + '%' }"
              ></div>
            </div>
            <span class="text-gray-900 fw-bold fs-7">{{ item.attendance_percentage }}%</span>
          </div>
          <span v-else class="text-muted fs-7">-</span>
        </td>
        <td>
          <span class="text-gray-900 fs-7 text-truncate d-block" style="max-width: 200px;">
            {{ item.behavioral_changes || '-' }}
          </span>
        </td>
        <td>
          <span class="text-gray-900 fs-6">{{ formatDate(item.last_evaluation_date) }}</span>
        </td>
        <td>
          <div class="d-flex justify-content-end flex-shrink-0">
            <a
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click.prevent="viewItem(item)"
              :title="t('rehabilitation.actions.view')"
            >
              <KTIcon icon-name="eye" icon-class="fs-3" />
            </a>
            <a
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-info btn-sm"
              @click.prevent="showUpdateProgressModal(item)"
              :title="t('rehabilitation.actions.evaluate')"
            >
              <KTIcon icon-name="chart-simple" icon-class="fs-3" />
            </a>
          </div>
        </td>
      </tr>
    </template>
  </ModuleListTemplate>

  <!-- Update Progress Modal -->
  <div class="modal fade" id="progressModal" tabindex="-1" ref="progressModalRef">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ t('rehabilitation.actions.evaluate') }}</h5>
          <button type="button" class="btn-close" @click="closeProgressModal"></button>
        </div>
        <div class="modal-body">
          <div class="row g-4">
            <div class="col-md-6">
              <label class="form-label">{{ t('rehabilitation.work.evaluations.columns.overallScore') }}</label>
              <input v-model="progressForm.overall_grade" type="number" min="0" max="100" step="0.1" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">{{ t('rehabilitation.work.evaluations.columns.progressLevel') }}</label>
              <select v-model="progressForm.progress_level" class="form-select">
                <option value="poor">{{ t('rehabilitation.progressLevel.poor') }}</option>
                <option value="fair">{{ t('rehabilitation.progressLevel.fair') }}</option>
                <option value="good">{{ t('rehabilitation.progressLevel.good') }}</option>
                <option value="excellent">{{ t('rehabilitation.progressLevel.excellent') }}</option>
              </select>
            </div>
            <div class="col-md-12">
              <label class="form-label">{{ t('rehabilitation.work.evaluations.columns.behavioralChanges') }}</label>
              <textarea v-model="progressForm.behavioral_changes" class="form-control" rows="3"></textarea>
            </div>
            <div class="col-md-12">
              <label class="form-label">{{ t('rehabilitation.work.evaluations.columns.recommendation') }}</label>
              <textarea v-model="progressForm.recommendations" class="form-control" rows="3"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="closeProgressModal">{{ t('rehabilitation.actions.cancel') }}</button>
          <button type="button" class="btn btn-primary" @click="updateProgress" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
            {{ t('rehabilitation.actions.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import ModuleListTemplate from '@/components/templates/ModuleListTemplate.vue';
import { Modal } from 'bootstrap';

const { t } = useI18n();

// State
const loading = ref(false);
const saving = ref(false);
const items = ref<any[]>([]);
const programs = ref<any[]>([]);
const searchQuery = ref('');
const selectedProgram = ref('');
const selectedProgress = ref('');
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);
const editingItem = ref<any>(null);
const progressModalRef = ref<HTMLElement | null>(null);
let progressModalInstance: Modal | null = null;

const progressForm = ref({ overall_grade: '', progress_level: '', behavioral_changes: '', recommendations: '' });

// API
const loadItems = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get('/rehabilitation/participations', {
      params: {
        page: currentPage.value, per_page: perPage.value, search: searchQuery.value,
        program_id: selectedProgram.value, progress_level: selectedProgress.value,
        type: 'work',
      },
    });
    items.value = response.data.data;
    total.value = response.data.total;
  } catch (error) {
    console.error('Error loading work evaluations:', error);
    Swal.fire({ icon: 'error', title: t('common.error'), text: t('rehabilitation.swal.loadError') });
  } finally {
    loading.value = false;
  }
};

const loadPrograms = async () => {
  try {
    const response = await ApiService.get('/rehabilitation/programs', { params: { per_page: 100, type: 'work' } });
    programs.value = response.data.data || response.data;
  } catch (error) { console.error('Error loading programs:', error); }
};

const handleSearch = (query: string) => { searchQuery.value = query; currentPage.value = 1; loadItems(); };
const handleFilter = () => { currentPage.value = 1; loadItems(); };
const changePage = (page: number) => { currentPage.value = page; loadItems(); };
const formatDate = (date: string) => date ? new Date(date).toLocaleDateString() : '-';

const getProgressLabel = (level: string) => {
  const labels: Record<string, string> = {
    poor: t('rehabilitation.progressLevel.poor'),
    fair: t('rehabilitation.progressLevel.fair'),
    good: t('rehabilitation.progressLevel.good'),
    excellent: t('rehabilitation.progressLevel.excellent'),
  };
  return labels[level] || level || '-';
};

const getProgressBadge = (level: string) => {
  const classes: Record<string, string> = {
    poor: 'badge-light-danger',
    fair: 'badge-light-warning',
    good: 'badge-light-info',
    excellent: 'badge-light-success',
  };
  return classes[level] || 'badge-light-secondary';
};

const viewItem = (item: any) => {
  Swal.fire({
    title: `${item.inmate?.first_name || ''} ${item.inmate?.last_name || ''}`,
    html: `
      <div class="text-start">
        <p><strong>${t('rehabilitation.work.evaluations.columns.program')}:</strong> ${item.program?.name || '-'}</p>
        <p><strong>${t('rehabilitation.work.evaluations.columns.progressLevel')}:</strong> ${getProgressLabel(item.progress_level)}</p>
        <p><strong>${t('rehabilitation.work.evaluations.columns.overallScore')}:</strong> ${item.overall_grade || '-'}</p>
        <p><strong>${t('rehabilitation.work.evaluations.columns.attendance')}:</strong> ${item.attendance_percentage != null ? item.attendance_percentage + '%' : '-'}</p>
        <p><strong>${t('rehabilitation.work.evaluations.columns.behavioralChanges')}:</strong> ${item.behavioral_changes || '-'}</p>
      </div>
    `,
    icon: 'info',
    confirmButtonText: t('rehabilitation.actions.back'),
  });
};

const showUpdateProgressModal = (item: any) => {
  editingItem.value = item;
  progressForm.value = {
    overall_grade: item.overall_grade || '',
    progress_level: item.progress_level || '',
    behavioral_changes: item.behavioral_changes || '',
    recommendations: item.recommendations || '',
  };
  if (progressModalRef.value) { progressModalInstance = new Modal(progressModalRef.value); progressModalInstance.show(); }
};

const closeProgressModal = () => { progressModalInstance?.hide(); };

const updateProgress = async () => {
  if (!editingItem.value) return;
  saving.value = true;
  try {
    await ApiService.post(`/rehabilitation/participations/${editingItem.value.id}/status`, {
      ...progressForm.value,
      status: editingItem.value.status,
    });
    Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.swal.updateSuccess'), timer: 2000, showConfirmButton: false });
    closeProgressModal();
    loadItems();
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: t('common.error'), text: error?.response?.data?.message || t('rehabilitation.swal.updateError') });
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  await Promise.all([loadItems(), loadPrograms()]);
});
</script>
