<template>
  <ModuleListTemplate
    :title="t('rehabilitation.work.assignments.title')"
    :subtitle="t('rehabilitation.work.assignments.subtitle')"
    :items="items"
    :loading="loading"
    :total="total"
    :current-page="currentPage"
    :per-page="perPage"
    :show-create-button="true"
    :empty-state-text="t('rehabilitation.work.assignments.noData')"
    @search="handleSearch"
    @change-page="changePage"
    @create="showCreateModal"
  >
    <!-- Filters -->
    <template #filters>
      <div class="me-3">
        <select
          v-model="selectedStatus"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('rehabilitation.filters.byStatus') }}</option>
          <option value="active">{{ t('rehabilitation.work.assignments.status.active') }}</option>
          <option value="suspended">{{ t('rehabilitation.work.assignments.status.suspended') }}</option>
          <option value="completed">{{ t('rehabilitation.work.assignments.status.completed') }}</option>
          <option value="terminated">{{ t('rehabilitation.work.assignments.status.terminated') }}</option>
        </select>
      </div>
      <div class="me-3">
        <select
          v-model="selectedWorkType"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('rehabilitation.filters.byType') }}</option>
          <option v-for="wt in workTypes" :key="wt" :value="wt">{{ wt }}</option>
        </select>
      </div>
    </template>

    <!-- Table headers -->
    <template #table-headers>
      <th class="min-w-180px">{{ t('rehabilitation.work.assignments.columns.inmate') }}</th>
      <th class="min-w-150px">{{ t('rehabilitation.work.assignments.columns.jobTitle') }}</th>
      <th class="min-w-120px">{{ t('rehabilitation.work.assignments.fields.workArea') }}</th>
      <th class="min-w-120px">{{ t('rehabilitation.work.assignments.columns.supervisor') }}</th>
      <th class="min-w-100px">{{ t('rehabilitation.work.assignments.columns.startDate') }}</th>
      <th class="min-w-100px">{{ t('rehabilitation.work.assignments.fields.endDate') }}</th>
      <th class="min-w-80px">{{ t('rehabilitation.work.assignments.fields.hoursPerWeek') }}</th>
      <th class="min-w-100px">{{ t('rehabilitation.work.assignments.columns.status') }}</th>
      <th class="min-w-120px text-end">{{ t('common.actions.title') }}</th>
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
          <span class="text-gray-900 fw-bold d-block fs-6">{{ item.job_title }}</span>
        </td>
        <td>
          <span class="text-gray-900 fs-6">{{ item.work_type || '-' }}</span>
        </td>
        <td>
          <span class="text-gray-900 fs-6">{{ item.supervisor || '-' }}</span>
        </td>
        <td>
          <span class="text-gray-900 fs-6">{{ formatDate(item.start_date) }}</span>
        </td>
        <td>
          <span class="text-gray-900 fs-6">{{ formatDate(item.end_date) }}</span>
        </td>
        <td>
          <span class="text-gray-900 fs-6">{{ item.daily_hours || '-' }}</span>
        </td>
        <td>
          <span class="badge" :class="getStatusBadge(item.status)">
            {{ getStatusLabel(item.status) }}
          </span>
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
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click.prevent="showEditModal(item)"
              :title="t('rehabilitation.actions.edit')"
            >
              <KTIcon icon-name="pencil" icon-class="fs-3" />
            </a>
            <a
              v-if="item.status === 'active'"
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1"
              @click.prevent="showTerminateModal(item)"
              :title="t('rehabilitation.work.assignments.swal.terminateSuccess')"
            >
              <KTIcon icon-name="cross-circle" icon-class="fs-3" />
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
  <div class="modal fade" id="assignmentModal" tabindex="-1" ref="modalRef">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ editingItem ? t('rehabilitation.actions.edit') : t('rehabilitation.actions.assign') }} {{ t('rehabilitation.work.assignments.singular') }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="row g-4">
            <div class="col-md-6">
              <label class="form-label required">{{ t('rehabilitation.work.assignments.fields.inmate') }}</label>
              <input v-model="form.inmate_id" type="number" class="form-control" :placeholder="t('rehabilitation.work.assignments.placeholders.selectInmate')" />
            </div>
            <div class="col-md-6">
              <label class="form-label required">{{ t('rehabilitation.work.assignments.fields.jobTitle') }}</label>
              <input v-model="form.job_title" type="text" class="form-control" :placeholder="t('rehabilitation.work.assignments.placeholders.jobTitle')" />
            </div>
            <div class="col-md-6">
              <label class="form-label">{{ t('rehabilitation.work.assignments.fields.workArea') }}</label>
              <input v-model="form.work_type" type="text" class="form-control" :placeholder="t('rehabilitation.work.assignments.placeholders.workArea')" />
            </div>
            <div class="col-md-6">
              <label class="form-label">{{ t('rehabilitation.work.assignments.fields.supervisor') }}</label>
              <input v-model="form.supervisor" type="text" class="form-control" :placeholder="t('rehabilitation.work.assignments.placeholders.supervisor')" />
            </div>
            <div class="col-md-6">
              <label class="form-label required">{{ t('rehabilitation.work.assignments.fields.startDate') }}</label>
              <input v-model="form.start_date" type="date" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">{{ t('rehabilitation.work.assignments.fields.endDate') }}</label>
              <input v-model="form.end_date" type="date" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">{{ t('rehabilitation.work.assignments.fields.hoursPerWeek') }}</label>
              <input v-model="form.daily_hours" type="number" min="1" max="12" class="form-control" :placeholder="t('rehabilitation.work.assignments.placeholders.hoursPerWeek')" />
            </div>
            <div class="col-md-12">
              <label class="form-label">{{ t('rehabilitation.work.assignments.fields.description') }}</label>
              <textarea v-model="form.description" class="form-control" rows="3" :placeholder="t('rehabilitation.work.assignments.placeholders.description')"></textarea>
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

  <!-- Terminate Modal -->
  <div class="modal fade" id="terminateModal" tabindex="-1" ref="terminateModalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ t('rehabilitation.work.assignments.swal.terminateConfirmTitle') }}</h5>
          <button type="button" class="btn-close" @click="closeTerminateModal"></button>
        </div>
        <div class="modal-body">
          <div>
            <label class="form-label required">{{ t('rehabilitation.work.assignments.fields.terminationReason') }}</label>
            <textarea v-model="terminateForm.reason" class="form-control" rows="3" :placeholder="t('rehabilitation.work.assignments.placeholders.terminationReason')"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="closeTerminateModal">{{ t('rehabilitation.actions.cancel') }}</button>
          <button type="button" class="btn btn-warning" @click="terminateAssignment" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
            {{ t('rehabilitation.work.assignments.swal.terminateSuccess') }}
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
const searchQuery = ref('');
const selectedStatus = ref('');
const selectedWorkType = ref('');
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);
const editingItem = ref<any>(null);
const modalRef = ref<HTMLElement | null>(null);
const terminateModalRef = ref<HTMLElement | null>(null);
let modalInstance: Modal | null = null;
let terminateModalInstance: Modal | null = null;
const workTypes = ref<string[]>([]);

const form = ref({
  inmate_id: '', job_title: '', work_type: '', supervisor: '',
  start_date: '', end_date: '', daily_hours: '', description: '',
});

const terminateForm = ref({ reason: '' });

// API
const loadItems = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get('/inmate-work-assignments', {
      params: {
        page: currentPage.value, per_page: perPage.value, search: searchQuery.value,
        status: selectedStatus.value, work_type: selectedWorkType.value,
      },
    });
    items.value = response.data.data;
    total.value = response.data.total;
  } catch (error) {
    console.error('Error loading work assignments:', error);
    Swal.fire({ icon: 'error', title: t('common.error'), text: t('rehabilitation.swal.loadError') });
  } finally {
    loading.value = false;
  }
};

const handleSearch = (query: string) => { searchQuery.value = query; currentPage.value = 1; loadItems(); };
const handleFilter = () => { currentPage.value = 1; loadItems(); };
const changePage = (page: number) => { currentPage.value = page; loadItems(); };
const formatDate = (date: string) => date ? new Date(date).toLocaleDateString() : '-';

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: t('rehabilitation.work.assignments.status.active'),
    suspended: t('rehabilitation.work.assignments.status.suspended'),
    completed: t('rehabilitation.work.assignments.status.completed'),
    terminated: t('rehabilitation.work.assignments.status.terminated'),
  };
  return labels[status] || status;
};

const getStatusBadge = (status: string) => {
  const classes: Record<string, string> = {
    active: 'badge-light-success',
    suspended: 'badge-light-warning',
    completed: 'badge-light-primary',
    terminated: 'badge-light-danger',
  };
  return classes[status] || 'badge-light-secondary';
};

// Modal methods
const showCreateModal = () => {
  editingItem.value = null;
  form.value = { inmate_id: '', job_title: '', work_type: '', supervisor: '', start_date: '', end_date: '', daily_hours: '', description: '' };
  if (modalRef.value) { modalInstance = new Modal(modalRef.value); modalInstance.show(); }
};

const showEditModal = (item: any) => {
  editingItem.value = item;
  form.value = {
    inmate_id: item.inmate_id || '',
    job_title: item.job_title || '',
    work_type: item.work_type || '',
    supervisor: item.supervisor || '',
    start_date: item.start_date || '',
    end_date: item.end_date || '',
    daily_hours: item.daily_hours || '',
    description: item.description || '',
  };
  if (modalRef.value) { modalInstance = new Modal(modalRef.value); modalInstance.show(); }
};

const closeModal = () => { modalInstance?.hide(); };

const viewItem = (item: any) => {
  Swal.fire({
    title: item.job_title,
    html: `
      <div class="text-start">
        <p><strong>${t('rehabilitation.work.assignments.columns.inmate')}:</strong> ${item.inmate?.first_name || ''} ${item.inmate?.last_name || ''}</p>
        <p><strong>${t('rehabilitation.work.assignments.fields.workArea')}:</strong> ${item.work_type || '-'}</p>
        <p><strong>${t('rehabilitation.work.assignments.columns.supervisor')}:</strong> ${item.supervisor || '-'}</p>
        <p><strong>${t('rehabilitation.work.assignments.columns.startDate')}:</strong> ${formatDate(item.start_date)}</p>
        <p><strong>${t('rehabilitation.work.assignments.fields.endDate')}:</strong> ${formatDate(item.end_date)}</p>
        <p><strong>${t('rehabilitation.work.assignments.fields.hoursPerWeek')}:</strong> ${item.daily_hours || '-'}</p>
        <p><strong>${t('rehabilitation.work.assignments.columns.status')}:</strong> ${getStatusLabel(item.status)}</p>
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
      await ApiService.put(`/inmate-work-assignments/${editingItem.value.id}`, form.value);
      Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.work.assignments.swal.updateSuccess'), timer: 2000, showConfirmButton: false });
    } else {
      await ApiService.post('/inmate-work-assignments', form.value);
      Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.work.assignments.swal.assignSuccess'), timer: 2000, showConfirmButton: false });
    }
    closeModal();
    loadItems();
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: t('common.error'), text: error?.response?.data?.message || t('rehabilitation.work.assignments.swal.assignError') });
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
      await ApiService.delete(`/inmate-work-assignments/${item.id}`);
      Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.swal.deleteSuccess'), timer: 2000, showConfirmButton: false });
      loadItems();
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: t('common.error'), text: error?.response?.data?.message || t('rehabilitation.swal.deleteError') });
    }
  }
};

const showTerminateModal = (item: any) => {
  editingItem.value = item;
  terminateForm.value = { reason: '' };
  if (terminateModalRef.value) { terminateModalInstance = new Modal(terminateModalRef.value); terminateModalInstance.show(); }
};

const closeTerminateModal = () => { terminateModalInstance?.hide(); };

const terminateAssignment = async () => {
  if (!editingItem.value) return;
  saving.value = true;
  try {
    await ApiService.post(`/inmate-work-assignments/${editingItem.value.id}/terminate`, terminateForm.value);
    Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.work.assignments.swal.terminateSuccess'), timer: 2000, showConfirmButton: false });
    closeTerminateModal();
    loadItems();
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: t('common.error'), text: error?.response?.data?.message || t('rehabilitation.work.assignments.swal.terminateError') });
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  await loadItems();
});
</script>
