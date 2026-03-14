<template>
  <ModuleListTemplate
    :title="t('rehabilitation.programs.title')"
    :subtitle="t('rehabilitation.programs.subtitle')"
    :items="items"
    :loading="loading"
    :total="total"
    :current-page="currentPage"
    :per-page="perPage"
    :show-create-button="true"
    :empty-state-text="t('rehabilitation.programs.noData')"
    @search="handleSearch"
    @change-page="changePage"
    @create="showCreateModal"
  >
    <!-- Filters -->
    <template #filters>
      <div class="me-3">
        <select
          v-model="selectedCenter"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('rehabilitation.programs.filters.allCenters') }}</option>
          <option
            v-for="center in centersOptions"
            :key="center.value"
            :value="center.value"
          >
            {{ center.label }}
          </option>
        </select>
      </div>
      <div class="me-3">
        <select
          v-model="selectedType"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('rehabilitation.programs.filters.allTypes') }}</option>
          <option
            v-for="pt in programTypes"
            :key="pt.id"
            :value="pt.id"
          >
            {{ pt.name }}
          </option>
        </select>
      </div>
      <div class="me-3">
        <select
          v-model="selectedStatus"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('rehabilitation.programs.filters.allStatuses') }}</option>
          <option value="planning">{{ t('rehabilitation.programStatus.planning') }}</option>
          <option value="active">{{ t('rehabilitation.programStatus.active') }}</option>
          <option value="suspended">{{ t('rehabilitation.programStatus.suspended') }}</option>
          <option value="completed">{{ t('rehabilitation.programStatus.completed') }}</option>
          <option value="cancelled">{{ t('rehabilitation.programStatus.cancelled') }}</option>
        </select>
      </div>
    </template>

    <!-- Table headers -->
    <template #table-headers>
      <th class="min-w-100px">{{ t('rehabilitation.programs.columns.code') }}</th>
      <th class="min-w-150px">{{ t('rehabilitation.programs.columns.name') }}</th>
      <th class="min-w-120px">{{ t('rehabilitation.programs.columns.center') }}</th>
      <th class="min-w-120px">{{ t('rehabilitation.programs.columns.type') }}</th>
      <th class="min-w-100px">{{ t('rehabilitation.programs.columns.status') }}</th>
      <th class="min-w-120px">{{ t('rehabilitation.programs.columns.participants') }}</th>
      <th class="min-w-100px">{{ t('rehabilitation.programs.columns.duration') }}</th>
      <th class="min-w-100px">{{ t('rehabilitation.programs.fields.startDate') }}</th>
      <th class="min-w-100px text-end">{{ t('common.actions.title') }}</th>
    </template>

    <!-- Table body -->
    <template #table-body="{ items }">
      <tr v-for="item in items" :key="item.id">
        <td>
          <span class="text-gray-900 fw-bold d-block fs-6">{{ item.program_code }}</span>
        </td>
        <td>
          <span class="text-gray-900 fw-bold d-block fs-6">{{ item.name }}</span>
          <span v-if="item.description" class="text-muted fw-semibold d-block fs-7 text-truncate" style="max-width: 200px;">
            {{ item.description }}
          </span>
        </td>
        <td>
          <span class="text-gray-900 fs-6">{{ item.center?.name || '-' }}</span>
        </td>
        <td>
          <span class="text-gray-900 fs-6">{{ item.program_type?.name || '-' }}</span>
        </td>
        <td>
          <span class="badge" :class="getStatusBadgeClass(item.status)">
            {{ getStatusLabel(item.status) }}
          </span>
        </td>
        <td>
          <span class="text-gray-900 fs-6">
            {{ item.current_participants || 0 }} / {{ item.max_participants || '-' }}
          </span>
        </td>
        <td>
          <span class="text-gray-900 fs-6">{{ item.duration_weeks }} {{ t('rehabilitation.programs.columns.duration') }}</span>
        </td>
        <td>
          <span class="text-gray-900 fs-6">{{ formatDate(item.start_date) }}</span>
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
              v-if="item.status === 'planning'"
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1"
              @click.prevent="activateProgram(item)"
              :title="t('rehabilitation.actions.reactivate')"
            >
              <KTIcon icon-name="check-circle" icon-class="fs-3" />
            </a>
            <a
              v-if="item.status === 'active'"
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1"
              @click.prevent="suspendProgram(item)"
              :title="t('rehabilitation.actions.suspend')"
            >
              <KTIcon icon-name="cross-circle" icon-class="fs-3" />
            </a>
            <a
              v-if="item.status === 'active'"
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-info btn-sm me-1"
              @click.prevent="completeProgram(item)"
              :title="t('rehabilitation.actions.complete')"
            >
              <KTIcon icon-name="flag" icon-class="fs-3" />
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
  <div class="modal fade" id="programModal" tabindex="-1" ref="modalRef">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ editingItem ? t('rehabilitation.programs.swal.updateSuccess').replace(' exitosamente', '') : t('rehabilitation.programs.swal.createSuccess').replace(' exitosamente', '') }}
          </h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="row g-4">
            <div class="col-md-6">
              <label class="form-label required">{{ t('rehabilitation.programs.fields.name') }}</label>
              <input v-model="form.name" type="text" class="form-control" :placeholder="t('rehabilitation.programs.placeholders.name')" />
            </div>
            <div class="col-md-6">
              <label class="form-label required">{{ t('rehabilitation.programs.fields.type') }}</label>
              <select v-model="form.program_type_id" class="form-select">
                <option value="">{{ t('rehabilitation.filters.byType') }}</option>
                <option v-for="pt in programTypes" :key="pt.id" :value="pt.id">{{ pt.name }}</option>
              </select>
            </div>
            <div class="col-md-12">
              <label class="form-label">{{ t('rehabilitation.programs.fields.description') }}</label>
              <textarea v-model="form.description" class="form-control" rows="3" :placeholder="t('rehabilitation.programs.placeholders.description')"></textarea>
            </div>
            <div class="col-md-12">
              <label class="form-label">{{ t('rehabilitation.programs.fields.objectives') }}</label>
              <textarea v-model="form.objectives" class="form-control" rows="2" :placeholder="t('rehabilitation.programs.placeholders.objectives')"></textarea>
            </div>
            <div class="col-md-6">
              <label class="form-label required">{{ t('rehabilitation.programs.fields.center') }}</label>
              <select v-model="form.center_id" class="form-select">
                <option value="">{{ t('rehabilitation.filters.byCenter') }}</option>
                <option v-for="center in centersOptions" :key="center.value" :value="center.value">{{ center.label }}</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label required">{{ t('rehabilitation.programs.fields.startDate') }}</label>
              <input v-model="form.start_date" type="date" class="form-control" />
            </div>
            <div class="col-md-4">
              <label class="form-label required">{{ t('rehabilitation.programs.fields.duration') }}</label>
              <input v-model="form.duration_weeks" type="number" min="1" class="form-control" :placeholder="t('rehabilitation.programs.placeholders.duration')" />
            </div>
            <div class="col-md-4">
              <label class="form-label">{{ t('rehabilitation.fields.name') }}</label>
              <input v-model="form.sessions_per_week" type="number" min="1" class="form-control" placeholder="Sessions/week" />
            </div>
            <div class="col-md-4">
              <label class="form-label">{{ t('rehabilitation.fields.name') }}</label>
              <input v-model="form.hours_per_session" type="number" min="0.5" step="0.5" class="form-control" placeholder="Hours/session" />
            </div>
            <div class="col-md-6">
              <label class="form-label required">{{ t('rehabilitation.programs.fields.maxCapacity') }}</label>
              <input v-model="form.max_participants" type="number" min="1" class="form-control" :placeholder="t('rehabilitation.programs.placeholders.maxCapacity')" />
            </div>
            <div class="col-md-6">
              <label class="form-label">{{ t('rehabilitation.programs.fields.currentEnrollment') }}</label>
              <input v-model="form.min_participants" type="number" min="0" class="form-control" placeholder="Min participants" />
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

  <!-- View Modal -->
  <div class="modal fade" id="viewModal" tabindex="-1" ref="viewModalRef">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ t('rehabilitation.programs.singular') }}</h5>
          <button type="button" class="btn-close" @click="closeViewModal"></button>
        </div>
        <div class="modal-body" v-if="viewingItem">
          <div class="row g-4">
            <div class="col-md-6">
              <label class="fw-bold text-muted fs-7">{{ t('rehabilitation.programs.columns.code') }}</label>
              <p class="fs-6">{{ viewingItem.program_code }}</p>
            </div>
            <div class="col-md-6">
              <label class="fw-bold text-muted fs-7">{{ t('rehabilitation.programs.columns.name') }}</label>
              <p class="fs-6">{{ viewingItem.name }}</p>
            </div>
            <div class="col-md-6">
              <label class="fw-bold text-muted fs-7">{{ t('rehabilitation.programs.columns.center') }}</label>
              <p class="fs-6">{{ viewingItem.center?.name || '-' }}</p>
            </div>
            <div class="col-md-6">
              <label class="fw-bold text-muted fs-7">{{ t('rehabilitation.programs.columns.type') }}</label>
              <p class="fs-6">{{ viewingItem.program_type?.name || '-' }}</p>
            </div>
            <div class="col-md-6">
              <label class="fw-bold text-muted fs-7">{{ t('rehabilitation.programs.columns.status') }}</label>
              <p><span class="badge" :class="getStatusBadgeClass(viewingItem.status)">{{ getStatusLabel(viewingItem.status) }}</span></p>
            </div>
            <div class="col-md-6">
              <label class="fw-bold text-muted fs-7">{{ t('rehabilitation.programs.columns.participants') }}</label>
              <p class="fs-6">{{ viewingItem.current_participants || 0 }} / {{ viewingItem.max_participants || '-' }}</p>
            </div>
            <div class="col-md-12" v-if="viewingItem.description">
              <label class="fw-bold text-muted fs-7">{{ t('rehabilitation.programs.fields.description') }}</label>
              <p class="fs-6">{{ viewingItem.description }}</p>
            </div>
            <div class="col-md-12" v-if="viewingItem.objectives">
              <label class="fw-bold text-muted fs-7">{{ t('rehabilitation.programs.fields.objectives') }}</label>
              <p class="fs-6">{{ viewingItem.objectives }}</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="closeViewModal">{{ t('rehabilitation.actions.back') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCatalogs } from '@/composables/useCatalogs';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import ModuleListTemplate from '@/components/templates/ModuleListTemplate.vue';
import { Modal } from 'bootstrap';

const { t } = useI18n();
const { centersOptions } = useCatalogs();

// State
const loading = ref(false);
const saving = ref(false);
const items = ref<any[]>([]);
const searchQuery = ref('');
const selectedCenter = ref('');
const selectedType = ref('');
const selectedStatus = ref('');
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);
const programTypes = ref<any[]>([]);
const editingItem = ref<any>(null);
const viewingItem = ref<any>(null);
const modalRef = ref<HTMLElement | null>(null);
const viewModalRef = ref<HTMLElement | null>(null);
let modalInstance: Modal | null = null;
let viewModalInstance: Modal | null = null;

const form = ref({
  name: '',
  description: '',
  objectives: '',
  program_type_id: '',
  center_id: '',
  duration_weeks: '',
  sessions_per_week: '',
  hours_per_session: '',
  max_participants: '',
  min_participants: '',
  start_date: '',
});

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    objectives: '',
    program_type_id: '',
    center_id: '',
    duration_weeks: '',
    sessions_per_week: '',
    hours_per_session: '',
    max_participants: '',
    min_participants: '',
    start_date: '',
  };
  editingItem.value = null;
};

// API Methods
const loadItems = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get('/rehabilitation/programs', {
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        search: searchQuery.value,
        center_id: selectedCenter.value,
        program_type_id: selectedType.value,
        status: selectedStatus.value,
      },
    });
    items.value = response.data.data;
    total.value = response.data.total;
  } catch (error) {
    console.error('Error loading programs:', error);
    Swal.fire({ icon: 'error', title: t('common.error'), text: t('rehabilitation.swal.loadError') });
  } finally {
    loading.value = false;
  }
};

const loadProgramTypes = async () => {
  try {
    const response = await ApiService.get('/catalogs/rehabilitation-program-types');
    programTypes.value = response.data.data || response.data;
  } catch (error) {
    console.error('Error loading program types:', error);
  }
};

const handleSearch = (query: string) => {
  searchQuery.value = query;
  currentPage.value = 1;
  loadItems();
};

const handleFilter = () => {
  currentPage.value = 1;
  loadItems();
};

const changePage = (page: number) => {
  currentPage.value = page;
  loadItems();
};

const formatDate = (date: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString();
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    planning: t('rehabilitation.programStatus.planning'),
    active: t('rehabilitation.programStatus.active'),
    suspended: t('rehabilitation.programStatus.suspended'),
    completed: t('rehabilitation.programStatus.completed'),
    cancelled: t('rehabilitation.programStatus.cancelled'),
  };
  return labels[status] || status;
};

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    planning: 'badge-light-info',
    active: 'badge-light-success',
    suspended: 'badge-light-warning',
    completed: 'badge-light-primary',
    cancelled: 'badge-light-danger',
  };
  return classes[status] || 'badge-light-secondary';
};

// Modal Methods
const showCreateModal = () => {
  resetForm();
  if (modalRef.value) {
    modalInstance = new Modal(modalRef.value);
    modalInstance.show();
  }
};

const showEditModal = (item: any) => {
  editingItem.value = item;
  form.value = {
    name: item.name || '',
    description: item.description || '',
    objectives: item.objectives || '',
    program_type_id: item.program_type_id || '',
    center_id: item.center_id || '',
    duration_weeks: item.duration_weeks || '',
    sessions_per_week: item.sessions_per_week || '',
    hours_per_session: item.hours_per_session || '',
    max_participants: item.max_participants || '',
    min_participants: item.min_participants || '',
    start_date: item.start_date || '',
  };
  if (modalRef.value) {
    modalInstance = new Modal(modalRef.value);
    modalInstance.show();
  }
};

const closeModal = () => {
  modalInstance?.hide();
  resetForm();
};

const viewItem = (item: any) => {
  viewingItem.value = item;
  if (viewModalRef.value) {
    viewModalInstance = new Modal(viewModalRef.value);
    viewModalInstance.show();
  }
};

const closeViewModal = () => {
  viewModalInstance?.hide();
  viewingItem.value = null;
};

const saveItem = async () => {
  saving.value = true;
  try {
    if (editingItem.value) {
      await ApiService.put(`/rehabilitation/programs/${editingItem.value.id}`, form.value);
      Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.programs.swal.updateSuccess'), timer: 2000, showConfirmButton: false });
    } else {
      await ApiService.post('/rehabilitation/programs', form.value);
      Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.programs.swal.createSuccess'), timer: 2000, showConfirmButton: false });
    }
    closeModal();
    loadItems();
  } catch (error: any) {
    const msg = editingItem.value ? t('rehabilitation.programs.swal.updateError') : t('rehabilitation.programs.swal.createError');
    Swal.fire({ icon: 'error', title: t('common.error'), text: error?.response?.data?.message || msg });
  } finally {
    saving.value = false;
  }
};

const deleteItem = async (item: any) => {
  const result = await Swal.fire({
    title: t('rehabilitation.programs.swal.deleteConfirmTitle'),
    text: t('rehabilitation.programs.swal.deleteConfirmText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('rehabilitation.swal.deleteConfirmButton'),
    cancelButtonText: t('rehabilitation.swal.deleteCancelButton'),
  });
  if (result.isConfirmed) {
    try {
      await ApiService.delete(`/rehabilitation/programs/${item.id}`);
      Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.programs.swal.deleteSuccess'), timer: 2000, showConfirmButton: false });
      loadItems();
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: t('common.error'), text: error?.response?.data?.message || t('rehabilitation.programs.swal.deleteError') });
    }
  }
};

const activateProgram = async (item: any) => {
  const result = await Swal.fire({
    title: t('rehabilitation.programStatus.active'),
    text: t('rehabilitation.programs.swal.suspendConfirmText').replace('suspender', 'activar'),
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: t('rehabilitation.actions.reactivate'),
    cancelButtonText: t('rehabilitation.swal.deleteCancelButton'),
  });
  if (result.isConfirmed) {
    try {
      await ApiService.post(`/rehabilitation/programs/${item.id}/activate`, {});
      Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.programs.swal.reactivateSuccess'), timer: 2000, showConfirmButton: false });
      loadItems();
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: t('common.error'), text: error?.response?.data?.message || t('rehabilitation.swal.updateError') });
    }
  }
};

const suspendProgram = async (item: any) => {
  const result = await Swal.fire({
    title: t('rehabilitation.programs.swal.suspendConfirmTitle'),
    text: t('rehabilitation.programs.swal.suspendConfirmText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('rehabilitation.actions.suspend'),
    cancelButtonText: t('rehabilitation.swal.deleteCancelButton'),
  });
  if (result.isConfirmed) {
    try {
      await ApiService.post(`/rehabilitation/programs/${item.id}/suspend`, {});
      Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.programs.swal.suspendSuccess'), timer: 2000, showConfirmButton: false });
      loadItems();
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: t('common.error'), text: error?.response?.data?.message || t('rehabilitation.swal.updateError') });
    }
  }
};

const completeProgram = async (item: any) => {
  const result = await Swal.fire({
    title: t('rehabilitation.actions.complete'),
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: t('rehabilitation.actions.complete'),
    cancelButtonText: t('rehabilitation.swal.deleteCancelButton'),
  });
  if (result.isConfirmed) {
    try {
      await ApiService.post(`/rehabilitation/programs/${item.id}/complete`, {});
      Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.enrollments.swal.completeSuccess'), timer: 2000, showConfirmButton: false });
      loadItems();
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: t('common.error'), text: error?.response?.data?.message || t('rehabilitation.swal.updateError') });
    }
  }
};

// Lifecycle
onMounted(async () => {
  await Promise.all([loadItems(), loadProgramTypes()]);
});
</script>
