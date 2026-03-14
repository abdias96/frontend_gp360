<template>
  <ModuleListTemplate
    :title="t('rehabilitation.progress.title')"
    :subtitle="t('rehabilitation.progress.subtitle')"
    :items="items"
    :loading="loading"
    :total="total"
    :current-page="currentPage"
    :per-page="perPage"
    :show-create-button="true"
    :empty-state-text="t('rehabilitation.progress.noData')"
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
          <option value="scheduled">{{ getSessionStatusLabel('scheduled') }}</option>
          <option value="in_progress">{{ getSessionStatusLabel('in_progress') }}</option>
          <option value="completed">{{ getSessionStatusLabel('completed') }}</option>
          <option value="cancelled">{{ getSessionStatusLabel('cancelled') }}</option>
        </select>
      </div>
      <div class="me-3">
        <input
          v-model="dateFrom"
          type="date"
          class="form-control form-control-solid"
          @change="handleFilter"
        />
      </div>
      <div class="me-3">
        <input
          v-model="dateTo"
          type="date"
          class="form-control form-control-solid"
          @change="handleFilter"
        />
      </div>
    </template>

    <!-- Table headers -->
    <template #table-headers>
      <th class="min-w-80px">{{ t('rehabilitation.progress.columns.sessionNumber') }}</th>
      <th class="min-w-150px">{{ t('rehabilitation.progress.columns.sessionTitle') }}</th>
      <th class="min-w-100px">{{ t('rehabilitation.progress.columns.sessionDate') }}</th>
      <th class="min-w-80px">{{ t('rehabilitation.progress.columns.startTime') }}</th>
      <th class="min-w-80px">{{ t('rehabilitation.progress.columns.endTime') }}</th>
      <th class="min-w-120px">{{ t('rehabilitation.progress.columns.facilitator') }}</th>
      <th class="min-w-100px">{{ t('rehabilitation.progress.columns.status') }}</th>
      <th class="min-w-100px">{{ t('rehabilitation.progress.columns.attendanceRate') }}</th>
      <th class="min-w-120px text-end">{{ t('common.actions.title') }}</th>
    </template>

    <!-- Table body -->
    <template #table-body="{ items }">
      <tr v-for="item in items" :key="item.id">
        <td>
          <span class="text-gray-900 fw-bold fs-6">#{{ item.session_number }}</span>
        </td>
        <td>
          <span class="text-gray-900 fw-bold d-block fs-6">{{ item.session_title || '-' }}</span>
          <span v-if="item.program" class="text-muted fw-semibold d-block fs-7">{{ item.program?.name }}</span>
        </td>
        <td>
          <span class="text-gray-900 fs-6">{{ formatDate(item.session_date) }}</span>
        </td>
        <td>
          <span class="text-gray-900 fs-6">{{ item.start_time || '-' }}</span>
        </td>
        <td>
          <span class="text-gray-900 fs-6">{{ item.end_time || '-' }}</span>
        </td>
        <td>
          <span class="text-gray-900 fs-6">{{ item.facilitator || '-' }}</span>
        </td>
        <td>
          <span class="badge" :class="getSessionStatusBadge(item.status)">
            {{ getSessionStatusLabel(item.status) }}
          </span>
        </td>
        <td>
          <div class="d-flex align-items-center" v-if="item.attendance_rate != null">
            <div class="progress w-50 me-2" style="height: 6px;">
              <div
                class="progress-bar"
                :class="item.attendance_rate >= 80 ? 'bg-success' : item.attendance_rate >= 60 ? 'bg-warning' : 'bg-danger'"
                :style="{ width: item.attendance_rate + '%' }"
              ></div>
            </div>
            <span class="text-gray-900 fw-bold fs-7">{{ item.attendance_rate }}%</span>
          </div>
          <span v-else class="text-muted fs-7">-</span>
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
              v-if="item.status === 'scheduled'"
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1"
              @click.prevent="startSession(item)"
              :title="t('rehabilitation.progress.actions.startSession')"
            >
              <KTIcon icon-name="play" icon-class="fs-3" />
            </a>
            <a
              v-if="item.status === 'in_progress'"
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click.prevent="showCompleteSessionModal(item)"
              :title="t('rehabilitation.progress.actions.completeSession')"
            >
              <KTIcon icon-name="check-circle" icon-class="fs-3" />
            </a>
            <a
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-info btn-sm me-1"
              @click.prevent="showAttendanceModal(item)"
              :title="t('rehabilitation.progress.actions.recordAttendance')"
            >
              <KTIcon icon-name="people" icon-class="fs-3" />
            </a>
            <a
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
              @click.prevent="deleteItem(item)"
              :title="t('rehabilitation.actions.delete')"
            >
              <KTIcon icon-name="trash" icon-class="fs-3" />
            </a>
          </div>
        </td>
      </tr>
    </template>
  </ModuleListTemplate>

  <!-- Create/Edit Modal -->
  <div class="modal fade" id="sessionModal" tabindex="-1" ref="modalRef">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ editingItem ? t('rehabilitation.actions.edit') : t('rehabilitation.actions.create') }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="row g-4">
            <div class="col-md-6">
              <label class="form-label required">{{ t('rehabilitation.progress.fields.programId') }}</label>
              <select v-model="form.program_id" class="form-select">
                <option value="">{{ t('rehabilitation.filters.byProgram') }}</option>
                <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label required">{{ t('rehabilitation.progress.fields.sessionNumber') }}</label>
              <input v-model="form.session_number" type="number" min="1" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label required">{{ t('rehabilitation.progress.fields.sessionTitle') }}</label>
              <input v-model="form.session_title" type="text" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label required">{{ t('rehabilitation.progress.fields.sessionDate') }}</label>
              <input v-model="form.session_date" type="date" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">{{ t('rehabilitation.progress.fields.startTime') }}</label>
              <input v-model="form.start_time" type="time" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">{{ t('rehabilitation.progress.fields.endTime') }}</label>
              <input v-model="form.end_time" type="time" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">{{ t('rehabilitation.progress.fields.facilitator') }}</label>
              <input v-model="form.facilitator" type="text" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">{{ t('rehabilitation.progress.fields.location') }}</label>
              <input v-model="form.location" type="text" class="form-control" />
            </div>
            <div class="col-md-12">
              <label class="form-label">{{ t('rehabilitation.progress.fields.description') }}</label>
              <textarea v-model="form.description" class="form-control" rows="3"></textarea>
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

  <!-- Complete Session Modal -->
  <div class="modal fade" id="completeModal" tabindex="-1" ref="completeModalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ t('rehabilitation.progress.actions.completeSession') }}</h5>
          <button type="button" class="btn-close" @click="closeCompleteModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-4">
            <label class="form-label">{{ t('rehabilitation.progress.fields.qualityRating') }}</label>
            <input v-model="completeForm.quality_rating" type="number" min="1" max="5" class="form-control" />
          </div>
          <div>
            <label class="form-label">{{ t('rehabilitation.progress.fields.notes') }}</label>
            <textarea v-model="completeForm.notes" class="form-control" rows="3"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="closeCompleteModal">{{ t('rehabilitation.actions.cancel') }}</button>
          <button type="button" class="btn btn-primary" @click="completeSession" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
            {{ t('rehabilitation.actions.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Attendance Modal -->
  <div class="modal fade" id="attendanceModal" tabindex="-1" ref="attendanceModalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ t('rehabilitation.progress.actions.recordAttendance') }}</h5>
          <button type="button" class="btn-close" @click="closeAttendanceModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-4">
            <label class="form-label">{{ t('rehabilitation.fields.notes') }}</label>
            <textarea v-model="attendanceForm.notes" class="form-control" rows="3" :placeholder="t('rehabilitation.fields.observations')"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="closeAttendanceModal">{{ t('rehabilitation.actions.cancel') }}</button>
          <button type="button" class="btn btn-primary" @click="recordAttendance" :disabled="saving">
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
const dateFrom = ref('');
const dateTo = ref('');
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);
const editingItem = ref<any>(null);
const modalRef = ref<HTMLElement | null>(null);
const completeModalRef = ref<HTMLElement | null>(null);
const attendanceModalRef = ref<HTMLElement | null>(null);
let modalInstance: Modal | null = null;
let completeModalInstance: Modal | null = null;
let attendanceModalInstance: Modal | null = null;

const form = ref({
  program_id: '', session_number: '', session_title: '', session_date: '',
  start_time: '', end_time: '', facilitator: '', location: '', description: '',
});

const completeForm = ref({ quality_rating: '', notes: '' });
const attendanceForm = ref({ notes: '' });

// API
const loadItems = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get('/rehabilitation/sessions', {
      params: {
        page: currentPage.value, per_page: perPage.value, search: searchQuery.value,
        program_id: selectedProgram.value, status: selectedStatus.value,
        date_from: dateFrom.value, date_to: dateTo.value,
      },
    });
    items.value = response.data.data;
    total.value = response.data.total;
  } catch (error) {
    console.error('Error loading sessions:', error);
    Swal.fire({ icon: 'error', title: t('common.error'), text: t('rehabilitation.swal.loadError') });
  } finally {
    loading.value = false;
  }
};

const loadPrograms = async () => {
  try {
    const response = await ApiService.get('/rehabilitation/programs', { params: { per_page: 100 } });
    programs.value = response.data.data || response.data;
  } catch (error) { console.error('Error loading programs:', error); }
};

const handleSearch = (query: string) => { searchQuery.value = query; currentPage.value = 1; loadItems(); };
const handleFilter = () => { currentPage.value = 1; loadItems(); };
const changePage = (page: number) => { currentPage.value = page; loadItems(); };
const formatDate = (date: string) => date ? new Date(date).toLocaleDateString() : '-';

const getSessionStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    scheduled: t('rehabilitation.progress.status.scheduled'),
    in_progress: t('rehabilitation.progress.status.in_progress'),
    completed: t('rehabilitation.progress.status.completed'),
    cancelled: t('rehabilitation.progress.status.cancelled'),
  };
  return labels[status] || status;
};

const getSessionStatusBadge = (status: string) => {
  const classes: Record<string, string> = {
    scheduled: 'badge-light-info',
    in_progress: 'badge-light-warning',
    completed: 'badge-light-success',
    cancelled: 'badge-light-danger',
  };
  return classes[status] || 'badge-light-secondary';
};

// Modals
const showCreateModal = () => {
  editingItem.value = null;
  form.value = { program_id: '', session_number: '', session_title: '', session_date: '', start_time: '', end_time: '', facilitator: '', location: '', description: '' };
  if (modalRef.value) { modalInstance = new Modal(modalRef.value); modalInstance.show(); }
};

const closeModal = () => { modalInstance?.hide(); };

const viewItem = (item: any) => {
  Swal.fire({
    title: `#${item.session_number} - ${item.session_title || ''}`,
    html: `
      <div class="text-start">
        <p><strong>${t('rehabilitation.filters.byProgram')}:</strong> ${item.program?.name || '-'}</p>
        <p><strong>${t('rehabilitation.progress.columns.sessionDate')}:</strong> ${formatDate(item.session_date)}</p>
        <p><strong>${t('rehabilitation.progress.columns.startTime')}:</strong> ${item.start_time || '-'}</p>
        <p><strong>${t('rehabilitation.progress.columns.endTime')}:</strong> ${item.end_time || '-'}</p>
        <p><strong>${t('rehabilitation.progress.columns.facilitator')}:</strong> ${item.facilitator || '-'}</p>
        <p><strong>${t('rehabilitation.progress.columns.status')}:</strong> ${getSessionStatusLabel(item.status)}</p>
        <p><strong>${t('rehabilitation.progress.columns.attendanceRate')}:</strong> ${item.attendance_rate != null ? item.attendance_rate + '%' : '-'}</p>
      </div>
    `,
    icon: 'info',
    confirmButtonText: t('rehabilitation.actions.back'),
  });
};

const saveItem = async () => {
  saving.value = true;
  try {
    if (editingItem.value) {
      await ApiService.put(`/rehabilitation/sessions/${editingItem.value.id}`, form.value);
      Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.swal.updateSuccess'), timer: 2000, showConfirmButton: false });
    } else {
      await ApiService.post('/rehabilitation/sessions', form.value);
      Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.swal.createSuccess'), timer: 2000, showConfirmButton: false });
    }
    closeModal();
    loadItems();
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: t('common.error'), text: error?.response?.data?.message || t('rehabilitation.swal.createError') });
  } finally {
    saving.value = false;
  }
};

const deleteItem = async (item: any) => {
  const result = await Swal.fire({
    title: t('rehabilitation.swal.deleteConfirmTitle'),
    text: t('rehabilitation.swal.deleteConfirmText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('rehabilitation.swal.deleteConfirmButton'),
    cancelButtonText: t('rehabilitation.swal.deleteCancelButton'),
  });
  if (result.isConfirmed) {
    try {
      await ApiService.delete(`/rehabilitation/sessions/${item.id}`);
      Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.swal.deleteSuccess'), timer: 2000, showConfirmButton: false });
      loadItems();
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: t('common.error'), text: error?.response?.data?.message || t('rehabilitation.swal.deleteError') });
    }
  }
};

const startSession = async (item: any) => {
  const result = await Swal.fire({
    title: t('rehabilitation.progress.actions.startSession'),
    text: t('rehabilitation.progress.actions.startConfirm'),
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: t('rehabilitation.progress.actions.startSession'),
    cancelButtonText: t('rehabilitation.swal.deleteCancelButton'),
  });
  if (result.isConfirmed) {
    try {
      await ApiService.post(`/rehabilitation/sessions/${item.id}/start`, {});
      Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.progress.started'), timer: 2000, showConfirmButton: false });
      loadItems();
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: t('common.error'), text: error?.response?.data?.message || t('rehabilitation.swal.updateError') });
    }
  }
};

const showCompleteSessionModal = (item: any) => {
  editingItem.value = item;
  completeForm.value = { quality_rating: '', notes: '' };
  if (completeModalRef.value) { completeModalInstance = new Modal(completeModalRef.value); completeModalInstance.show(); }
};

const closeCompleteModal = () => { completeModalInstance?.hide(); };

const completeSession = async () => {
  if (!editingItem.value) return;
  saving.value = true;
  try {
    await ApiService.post(`/rehabilitation/sessions/${editingItem.value.id}/complete`, completeForm.value);
    Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.progress.sessionCompleted'), timer: 2000, showConfirmButton: false });
    closeCompleteModal();
    loadItems();
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: t('common.error'), text: error?.response?.data?.message || t('rehabilitation.swal.updateError') });
  } finally {
    saving.value = false;
  }
};

const showAttendanceModal = (item: any) => {
  editingItem.value = item;
  attendanceForm.value = { notes: '' };
  if (attendanceModalRef.value) { attendanceModalInstance = new Modal(attendanceModalRef.value); attendanceModalInstance.show(); }
};

const closeAttendanceModal = () => { attendanceModalInstance?.hide(); };

const recordAttendance = async () => {
  if (!editingItem.value) return;
  saving.value = true;
  try {
    await ApiService.post(`/rehabilitation/sessions/${editingItem.value.id}/attendance`, attendanceForm.value);
    Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.progress.attendanceRecorded'), timer: 2000, showConfirmButton: false });
    closeAttendanceModal();
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
