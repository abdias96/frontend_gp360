<template>
  <ModuleListTemplate
    :title="t('rehabilitation.enrollments.title')"
    :subtitle="t('rehabilitation.enrollments.subtitle')"
    :items="items"
    :loading="loading"
    :total="total"
    :current-page="currentPage"
    :per-page="perPage"
    :show-create-button="true"
    :empty-state-text="t('rehabilitation.enrollments.noData')"
    @search="handleSearch"
    @change-page="changePage"
    @create="showCreateModal"
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
          v-model="selectedStatus"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('rehabilitation.filters.byStatus') }}</option>
          <option value="applied">{{ t('rehabilitation.participationStatus.applied') }}</option>
          <option value="accepted">{{ t('rehabilitation.participationStatus.accepted') }}</option>
          <option value="enrolled">{{ t('rehabilitation.participationStatus.enrolled') }}</option>
          <option value="active">{{ t('rehabilitation.participationStatus.active') }}</option>
          <option value="completed">{{ t('rehabilitation.participationStatus.completed') }}</option>
          <option value="dropped_out">{{ t('rehabilitation.participationStatus.droppedOut') }}</option>
          <option value="expelled">{{ t('rehabilitation.participationStatus.expelled') }}</option>
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
      <th class="min-w-180px">{{ t('rehabilitation.enrollments.columns.inmate') }}</th>
      <th class="min-w-150px">{{ t('rehabilitation.enrollments.columns.program') }}</th>
      <th class="min-w-120px">{{ t('rehabilitation.enrollments.columns.enrollmentDate') }}</th>
      <th class="min-w-100px">{{ t('rehabilitation.enrollments.columns.status') }}</th>
      <th class="min-w-120px">{{ t('rehabilitation.enrollments.columns.attendancePercent') }}</th>
      <th class="min-w-100px">{{ t('rehabilitation.enrollments.columns.progress') }}</th>
      <th class="min-w-100px">{{ t('rehabilitation.enrollments.fields.motivationLevel') }}</th>
      <th class="min-w-120px text-end">{{ t('common.actions.title') }}</th>
    </template>

    <!-- Table body -->
    <template #table-body="{ items }">
      <tr v-for="item in items" :key="item.id">
        <td>
          <div class="d-flex align-items-center">
            <div class="d-flex justify-content-start flex-column">
              <span class="text-gray-900 fw-bold fs-6">
                {{ item.inmate?.first_name }} {{ item.inmate?.last_name }}
              </span>
              <span class="text-muted fw-semibold d-block fs-7">
                {{ item.inmate?.inmate_number || '-' }}
              </span>
            </div>
          </div>
        </td>
        <td>
          <span class="text-gray-900 fs-6">{{ item.program?.name || '-' }}</span>
        </td>
        <td>
          <span class="text-gray-900 fs-6">{{ formatDate(item.enrollment_date) }}</span>
        </td>
        <td>
          <span class="badge" :class="getEnrollmentStatusBadge(item.status)">
            {{ getEnrollmentStatusLabel(item.status) }}
          </span>
        </td>
        <td>
          <div class="d-flex align-items-center">
            <div class="progress w-75 me-2" style="height: 8px;">
              <div
                class="progress-bar"
                :class="getAttendanceBarClass(item.attendance_percentage)"
                :style="{ width: (item.attendance_percentage || 0) + '%' }"
              ></div>
            </div>
            <span class="text-gray-900 fw-bold fs-7">{{ item.attendance_percentage || 0 }}%</span>
          </div>
        </td>
        <td>
          <span class="badge" :class="getProgressBadge(item.progress_level)">
            {{ getProgressLabel(item.progress_level) }}
          </span>
        </td>
        <td>
          <span class="text-gray-900 fs-6">{{ getMotivationLabel(item.motivation_level) }}</span>
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
              class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1"
              @click.prevent="showStatusModal(item)"
              :title="t('rehabilitation.enrollments.swal.updateSuccess')"
            >
              <KTIcon icon-name="arrows-circle" icon-class="fs-3" />
            </a>
            <a
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-info btn-sm me-1"
              @click.prevent="showInitialEvaluation(item)"
              :title="t('rehabilitation.actions.evaluate')"
            >
              <KTIcon icon-name="clipboard" icon-class="fs-3" />
            </a>
            <a
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-success btn-sm"
              @click.prevent="showFinalEvaluation(item)"
              :title="t('rehabilitation.actions.certify')"
            >
              <KTIcon icon-name="award" icon-class="fs-3" />
            </a>
          </div>
        </td>
      </tr>
    </template>
  </ModuleListTemplate>

  <!-- Create Modal -->
  <div class="modal fade" id="enrollmentModal" tabindex="-1" ref="modalRef">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ t('rehabilitation.enrollments.singular') }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="row g-4">
            <div class="col-md-6">
              <label class="form-label required">{{ t('rehabilitation.enrollments.fields.inmate') }}</label>
              <input v-model="form.inmate_id" type="number" class="form-control" :placeholder="t('rehabilitation.enrollments.placeholders.selectInmate')" />
            </div>
            <div class="col-md-6">
              <label class="form-label required">{{ t('rehabilitation.enrollments.fields.program') }}</label>
              <select v-model="form.center_rehabilitation_program_id" class="form-select">
                <option value="">{{ t('rehabilitation.enrollments.placeholders.selectProgram') }}</option>
                <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label required">{{ t('rehabilitation.enrollments.fields.enrollmentDate') }}</label>
              <input v-model="form.enrollment_date" type="date" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">{{ t('rehabilitation.enrollments.fields.motivationLevel') }}</label>
              <select v-model="form.motivation_level" class="form-select">
                <option value="">{{ t('rehabilitation.filters.all') }}</option>
                <option value="high">{{ t('rehabilitation.motivationLevel.high') }}</option>
                <option value="medium">{{ t('rehabilitation.motivationLevel.medium') }}</option>
                <option value="low">{{ t('rehabilitation.motivationLevel.low') }}</option>
              </select>
            </div>
            <div class="col-md-12">
              <label class="form-label">{{ t('rehabilitation.enrollments.fields.behavioralNotes') }}</label>
              <textarea v-model="form.initial_goals" class="form-control" rows="3"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="closeModal">{{ t('rehabilitation.actions.cancel') }}</button>
          <button type="button" class="btn btn-primary" @click="saveItem" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
            {{ t('rehabilitation.actions.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Status Update Modal -->
  <div class="modal fade" id="statusModal" tabindex="-1" ref="statusModalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ t('rehabilitation.filters.byStatus') }}</h5>
          <button type="button" class="btn-close" @click="closeStatusModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-4">
            <label class="form-label required">{{ t('rehabilitation.enrollments.fields.status') }}</label>
            <select v-model="statusForm.status" class="form-select">
              <option value="applied">{{ t('rehabilitation.participationStatus.applied') }}</option>
              <option value="accepted">{{ t('rehabilitation.participationStatus.accepted') }}</option>
              <option value="enrolled">{{ t('rehabilitation.participationStatus.enrolled') }}</option>
              <option value="active">{{ t('rehabilitation.participationStatus.active') }}</option>
              <option value="completed">{{ t('rehabilitation.participationStatus.completed') }}</option>
              <option value="dropped_out">{{ t('rehabilitation.participationStatus.droppedOut') }}</option>
              <option value="expelled">{{ t('rehabilitation.participationStatus.expelled') }}</option>
            </select>
          </div>
          <div>
            <label class="form-label">{{ t('rehabilitation.fields.observations') }}</label>
            <textarea v-model="statusForm.reason" class="form-control" rows="3"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="closeStatusModal">{{ t('rehabilitation.actions.cancel') }}</button>
          <button type="button" class="btn btn-primary" @click="updateStatus" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
            {{ t('rehabilitation.actions.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Evaluation Modal -->
  <div class="modal fade" id="evaluationModal" tabindex="-1" ref="evalModalRef">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ evalType === 'initial' ? t('rehabilitation.actions.evaluate') : t('rehabilitation.actions.certify') }}</h5>
          <button type="button" class="btn-close" @click="closeEvalModal"></button>
        </div>
        <div class="modal-body">
          <div class="row g-4">
            <div class="col-md-6">
              <label class="form-label">{{ t('rehabilitation.enrollments.fields.grade') }}</label>
              <input v-model="evalForm.overall_grade" type="number" min="0" max="100" step="0.1" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">{{ t('rehabilitation.enrollments.fields.progress') }}</label>
              <select v-model="evalForm.progress_level" class="form-select">
                <option value="poor">{{ t('rehabilitation.progressLevel.poor') }}</option>
                <option value="fair">{{ t('rehabilitation.progressLevel.fair') }}</option>
                <option value="good">{{ t('rehabilitation.progressLevel.good') }}</option>
                <option value="excellent">{{ t('rehabilitation.progressLevel.excellent') }}</option>
              </select>
            </div>
            <div class="col-md-12">
              <label class="form-label">{{ t('rehabilitation.enrollments.fields.behavioralNotes') }}</label>
              <textarea v-model="evalForm.behavioral_changes" class="form-control" rows="3"></textarea>
            </div>
            <div class="col-md-12">
              <label class="form-label">{{ t('rehabilitation.fields.observations') }}</label>
              <textarea v-model="evalForm.recommendations" class="form-control" rows="3"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="closeEvalModal">{{ t('rehabilitation.actions.cancel') }}</button>
          <button type="button" class="btn btn-primary" @click="saveEvaluation" :disabled="saving">
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
const selectedStatus = ref('');
const selectedProgress = ref('');
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);
const editingItem = ref<any>(null);
const modalRef = ref<HTMLElement | null>(null);
const statusModalRef = ref<HTMLElement | null>(null);
const evalModalRef = ref<HTMLElement | null>(null);
let modalInstance: Modal | null = null;
let statusModalInstance: Modal | null = null;
let evalModalInstance: Modal | null = null;
const evalType = ref<'initial' | 'final'>('initial');

const form = ref({
  inmate_id: '',
  center_rehabilitation_program_id: '',
  enrollment_date: '',
  motivation_level: '',
  initial_goals: '',
});

const statusForm = ref({ status: '', reason: '' });
const evalForm = ref({ overall_grade: '', progress_level: '', behavioral_changes: '', recommendations: '' });

// API Methods
const loadItems = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get('/rehabilitation/participations', {
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        search: searchQuery.value,
        program_id: selectedProgram.value,
        status: selectedStatus.value,
        progress_level: selectedProgress.value,
      },
    });
    items.value = response.data.data;
    total.value = response.data.total;
  } catch (error) {
    console.error('Error loading enrollments:', error);
    Swal.fire({ icon: 'error', title: t('common.error'), text: t('rehabilitation.swal.loadError') });
  } finally {
    loading.value = false;
  }
};

const loadPrograms = async () => {
  try {
    const response = await ApiService.get('/rehabilitation/programs', { params: { per_page: 100 } });
    programs.value = response.data.data || response.data;
  } catch (error) {
    console.error('Error loading programs:', error);
  }
};

const handleSearch = (query: string) => { searchQuery.value = query; currentPage.value = 1; loadItems(); };
const handleFilter = () => { currentPage.value = 1; loadItems(); };
const changePage = (page: number) => { currentPage.value = page; loadItems(); };
const formatDate = (date: string) => date ? new Date(date).toLocaleDateString() : '-';

const getEnrollmentStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    applied: t('rehabilitation.participationStatus.applied'),
    accepted: t('rehabilitation.participationStatus.accepted'),
    enrolled: t('rehabilitation.participationStatus.enrolled'),
    active: t('rehabilitation.participationStatus.active'),
    completed: t('rehabilitation.participationStatus.completed'),
    dropped_out: t('rehabilitation.participationStatus.droppedOut'),
    expelled: t('rehabilitation.participationStatus.expelled'),
  };
  return labels[status] || status;
};

const getEnrollmentStatusBadge = (status: string) => {
  const classes: Record<string, string> = {
    applied: 'badge-light-info',
    accepted: 'badge-light-primary',
    enrolled: 'badge-light-info',
    active: 'badge-light-success',
    completed: 'badge-light-primary',
    dropped_out: 'badge-light-warning',
    expelled: 'badge-light-danger',
  };
  return classes[status] || 'badge-light-secondary';
};

const getAttendanceBarClass = (pct: number) => {
  if (pct >= 80) return 'bg-success';
  if (pct >= 60) return 'bg-warning';
  return 'bg-danger';
};

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

const getMotivationLabel = (level: string) => {
  const labels: Record<string, string> = {
    high: t('rehabilitation.motivationLevel.high'),
    medium: t('rehabilitation.motivationLevel.medium'),
    low: t('rehabilitation.motivationLevel.low'),
  };
  return labels[level] || level || '-';
};

// Modal methods
const showCreateModal = () => {
  form.value = { inmate_id: '', center_rehabilitation_program_id: '', enrollment_date: '', motivation_level: '', initial_goals: '' };
  if (modalRef.value) { modalInstance = new Modal(modalRef.value); modalInstance.show(); }
};

const closeModal = () => { modalInstance?.hide(); };

const viewItem = (item: any) => {
  Swal.fire({
    title: `${item.inmate?.first_name} ${item.inmate?.last_name}`,
    html: `
      <div class="text-start">
        <p><strong>${t('rehabilitation.enrollments.columns.program')}:</strong> ${item.program?.name || '-'}</p>
        <p><strong>${t('rehabilitation.enrollments.columns.status')}:</strong> ${getEnrollmentStatusLabel(item.status)}</p>
        <p><strong>${t('rehabilitation.enrollments.columns.enrollmentDate')}:</strong> ${formatDate(item.enrollment_date)}</p>
        <p><strong>${t('rehabilitation.enrollments.columns.attendancePercent')}:</strong> ${item.attendance_percentage || 0}%</p>
        <p><strong>${t('rehabilitation.enrollments.columns.progress')}:</strong> ${getProgressLabel(item.progress_level)}</p>
      </div>
    `,
    icon: 'info',
    confirmButtonText: t('rehabilitation.actions.back'),
  });
};

const showStatusModal = (item: any) => {
  editingItem.value = item;
  statusForm.value = { status: item.status, reason: '' };
  if (statusModalRef.value) { statusModalInstance = new Modal(statusModalRef.value); statusModalInstance.show(); }
};

const closeStatusModal = () => { statusModalInstance?.hide(); };

const showInitialEvaluation = (item: any) => {
  editingItem.value = item;
  evalType.value = 'initial';
  evalForm.value = { overall_grade: '', progress_level: '', behavioral_changes: '', recommendations: '' };
  if (evalModalRef.value) { evalModalInstance = new Modal(evalModalRef.value); evalModalInstance.show(); }
};

const showFinalEvaluation = (item: any) => {
  editingItem.value = item;
  evalType.value = 'final';
  evalForm.value = { overall_grade: '', progress_level: '', behavioral_changes: '', recommendations: '' };
  if (evalModalRef.value) { evalModalInstance = new Modal(evalModalRef.value); evalModalInstance.show(); }
};

const closeEvalModal = () => { evalModalInstance?.hide(); };

const saveItem = async () => {
  saving.value = true;
  try {
    await ApiService.post('/rehabilitation/participations', form.value);
    Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.enrollments.swal.enrollSuccess'), timer: 2000, showConfirmButton: false });
    closeModal();
    loadItems();
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: t('common.error'), text: error?.response?.data?.message || t('rehabilitation.enrollments.swal.enrollError') });
  } finally {
    saving.value = false;
  }
};

const updateStatus = async () => {
  if (!editingItem.value) return;
  saving.value = true;
  try {
    await ApiService.post(`/rehabilitation/participations/${editingItem.value.id}/status`, statusForm.value);
    Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.enrollments.swal.updateSuccess'), timer: 2000, showConfirmButton: false });
    closeStatusModal();
    loadItems();
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: t('common.error'), text: error?.response?.data?.message || t('rehabilitation.enrollments.swal.updateError') });
  } finally {
    saving.value = false;
  }
};

const saveEvaluation = async () => {
  if (!editingItem.value) return;
  saving.value = true;
  try {
    const endpoint = evalType.value === 'initial'
      ? `/rehabilitation/participations/${editingItem.value.id}/initial-evaluation`
      : `/rehabilitation/participations/${editingItem.value.id}/final-evaluation`;
    await ApiService.post(endpoint, evalForm.value);
    Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.swal.updateSuccess'), timer: 2000, showConfirmButton: false });
    closeEvalModal();
    loadItems();
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: t('common.error'), text: error?.response?.data?.message || t('rehabilitation.swal.updateError') });
  } finally {
    saving.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  await Promise.all([loadItems(), loadPrograms()]);
});
</script>
