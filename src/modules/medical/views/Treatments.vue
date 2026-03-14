<template>
  <ModuleListTemplate
    :title="t('medical.treatments.title')"
    :subtitle="t('medical.treatments.subtitle')"
    :items="items"
    :loading="loading"
    :total="total"
    :current-page="currentPage"
    :per-page="perPage"
    :show-create-button="true"
    :empty-state-text="t('medical.treatments.noData')"
    @search="handleSearch"
    @change-page="changePage"
    @create="showCreateModal"
  >
    <!-- Filters -->
    <template #filters>
      <div class="me-3">
        <select
          v-model="filterStatus"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('medical.treatments.allStatuses') }}</option>
          <option value="active">{{ t('medical.treatments.statuses.active') }}</option>
          <option value="completed">{{ t('medical.treatments.statuses.completed') }}</option>
          <option value="suspended">{{ t('medical.treatments.statuses.suspended') }}</option>
          <option value="discontinued">{{ t('medical.treatments.statuses.discontinued') }}</option>
        </select>
      </div>
      <div class="me-3">
        <select
          v-model="filterPriority"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('medical.treatments.allPriorities') }}</option>
          <option value="low">{{ t('medical.treatments.priorities.low') }}</option>
          <option value="normal">{{ t('medical.treatments.priorities.normal') }}</option>
          <option value="high">{{ t('medical.treatments.priorities.high') }}</option>
          <option value="urgent">{{ t('medical.treatments.priorities.urgent') }}</option>
        </select>
      </div>
    </template>

    <!-- Table headers -->
    <template #table-headers>
      <th class="min-w-150px">{{ t('medical.treatments.inmate') }}</th>
      <th class="min-w-120px">{{ t('medical.treatments.medication') }}</th>
      <th class="min-w-100px">{{ t('medical.treatments.dosage') }}</th>
      <th class="min-w-100px">{{ t('medical.treatments.frequency') }}</th>
      <th class="min-w-100px">{{ t('medical.treatments.startDate') }}</th>
      <th class="min-w-100px">{{ t('medical.treatments.endDate') }}</th>
      <th class="min-w-80px">{{ t('medical.treatments.priority') }}</th>
      <th class="min-w-80px">{{ t('medical.treatments.status') }}</th>
      <th class="min-w-120px text-end">{{ t('common.actions.title') }}</th>
    </template>

    <!-- Table body -->
    <template #table-body="{ items }">
      <tr v-for="item in items" :key="item.id">
        <td>
          <div class="d-flex justify-content-start flex-column">
            <span class="text-gray-900 fw-bold d-block fs-6">
              {{ item.inmate?.full_name || item.inmate_id }}
            </span>
            <span class="text-muted fw-semibold d-block fs-7">
              {{ item.inmate?.registry_number || '' }}
            </span>
          </div>
        </td>
        <td>
          <span class="text-gray-900 fw-bold d-block fs-6">{{ item.medication }}</span>
        </td>
        <td>
          <span class="text-gray-900 d-block fs-7">{{ item.dosage }}</span>
        </td>
        <td>
          <span class="text-gray-900 d-block fs-7">{{ item.frequency }}</span>
        </td>
        <td>
          <span class="text-gray-900 fw-bold d-block fs-6">{{ formatDate(item.start_date) }}</span>
        </td>
        <td>
          <span class="text-gray-900 fw-bold d-block fs-6">{{ formatDate(item.end_date) }}</span>
        </td>
        <td>
          <span class="badge" :class="getPriorityBadge(item.priority)">
            {{ getPriorityLabel(item.priority) }}
          </span>
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
              :title="t('common.actions.view')"
            >
              <KTIcon icon-name="eye" icon-class="fs-3" />
            </a>
            <a
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click.prevent="showEditModal(item)"
              :title="t('common.actions.edit')"
            >
              <KTIcon icon-name="pencil" icon-class="fs-3" />
            </a>
            <a
              v-if="item.status === 'active'"
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1"
              @click.prevent="suspendItem(item)"
              :title="t('medical.treatments.suspend')"
            >
              <KTIcon icon-name="cross-circle" icon-class="fs-3" />
            </a>
            <a
              v-if="item.status === 'active' || item.status === 'suspended'"
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1"
              @click.prevent="discontinueItem(item)"
              :title="t('medical.treatments.discontinue')"
            >
              <KTIcon icon-name="minus-circle" icon-class="fs-3" />
            </a>
            <a
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
              @click.prevent="deleteItem(item)"
              :title="t('common.actions.delete')"
            >
              <KTIcon icon-name="trash" icon-class="fs-3" />
            </a>
          </div>
        </td>
      </tr>
    </template>
  </ModuleListTemplate>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import ModuleListTemplate from '@/components/templates/ModuleListTemplate.vue';

const { t } = useI18n();

// State
const loading = ref(false);
const items = ref<any[]>([]);
const searchQuery = ref('');
const filterStatus = ref('');
const filterPriority = ref('');
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);

// Load data
const loadItems = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get('/inmate-medical-treatments', {
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        search: searchQuery.value,
        status: filterStatus.value,
        priority: filterPriority.value,
      },
    });
    items.value = response.data.data;
    total.value = response.data.total;
  } catch (error) {
    console.error('Error loading treatments:', error);
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: t('medical.treatments.loadError'),
    });
  } finally {
    loading.value = false;
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

const getPriorityLabel = (priority: string) => {
  const labels: Record<string, string> = {
    low: t('medical.treatments.priorities.low'),
    normal: t('medical.treatments.priorities.normal'),
    high: t('medical.treatments.priorities.high'),
    urgent: t('medical.treatments.priorities.urgent'),
  };
  return labels[priority] || priority;
};

const getPriorityBadge = (priority: string) => {
  const badges: Record<string, string> = {
    low: 'badge-light-secondary',
    normal: 'badge-light-info',
    high: 'badge-light-warning',
    urgent: 'badge-light-danger',
  };
  return badges[priority] || 'badge-light-secondary';
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: t('medical.treatments.statuses.active'),
    completed: t('medical.treatments.statuses.completed'),
    suspended: t('medical.treatments.statuses.suspended'),
    discontinued: t('medical.treatments.statuses.discontinued'),
  };
  return labels[status] || status;
};

const getStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    active: 'badge-light-success',
    completed: 'badge-light-info',
    suspended: 'badge-light-warning',
    discontinued: 'badge-light-danger',
  };
  return badges[status] || 'badge-light-secondary';
};

// CRUD
const showCreateModal = async () => {
  const { value: formData } = await Swal.fire({
    title: t('medical.treatments.createTitle'),
    html: `
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.treatments.inmateId')}</label>
        <input id="swal-inmate-id" class="form-control" type="number" placeholder="${t('medical.treatments.inmateIdPlaceholder')}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.treatments.medication')}</label>
        <input id="swal-medication" class="form-control" type="text">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.treatments.dosage')}</label>
        <input id="swal-dosage" class="form-control" type="text" placeholder="${t('medical.treatments.dosagePlaceholder')}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.treatments.frequency')}</label>
        <input id="swal-frequency" class="form-control" type="text" placeholder="${t('medical.treatments.frequencyPlaceholder')}">
      </div>
      <div class="row mb-3">
        <div class="col-6 text-start">
          <label class="form-label">${t('medical.treatments.startDate')}</label>
          <input id="swal-start-date" class="form-control" type="date">
        </div>
        <div class="col-6 text-start">
          <label class="form-label">${t('medical.treatments.endDate')}</label>
          <input id="swal-end-date" class="form-control" type="date">
        </div>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.treatments.priority')}</label>
        <select id="swal-priority" class="form-select">
          <option value="low">${t('medical.treatments.priorities.low')}</option>
          <option value="normal" selected>${t('medical.treatments.priorities.normal')}</option>
          <option value="high">${t('medical.treatments.priorities.high')}</option>
          <option value="urgent">${t('medical.treatments.priorities.urgent')}</option>
        </select>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.treatments.notes')}</label>
        <textarea id="swal-notes" class="form-control" rows="3"></textarea>
      </div>
    `,
    width: '600px',
    showCancelButton: true,
    confirmButtonText: t('common.save'),
    cancelButtonText: t('common.cancel'),
    preConfirm: () => {
      const inmate_id = (document.getElementById('swal-inmate-id') as HTMLInputElement).value;
      const medication = (document.getElementById('swal-medication') as HTMLInputElement).value;
      const dosage = (document.getElementById('swal-dosage') as HTMLInputElement).value;
      const frequency = (document.getElementById('swal-frequency') as HTMLInputElement).value;
      const start_date = (document.getElementById('swal-start-date') as HTMLInputElement).value;
      const end_date = (document.getElementById('swal-end-date') as HTMLInputElement).value;
      const priority = (document.getElementById('swal-priority') as HTMLSelectElement).value;
      const notes = (document.getElementById('swal-notes') as HTMLTextAreaElement).value;

      if (!inmate_id || !medication || !start_date) {
        Swal.showValidationMessage(t('medical.treatments.requiredFields'));
        return false;
      }

      return { inmate_id, medication, dosage, frequency, start_date, end_date, priority, notes };
    },
  });

  if (formData) {
    try {
      await ApiService.post('/inmate-medical-treatments', formData);
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.treatments.createSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error creating treatment:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.treatments.createError'),
      });
    }
  }
};

const showEditModal = async (item: any) => {
  const { value: formData } = await Swal.fire({
    title: t('medical.treatments.editTitle'),
    html: `
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.treatments.medication')}</label>
        <input id="swal-medication" class="form-control" type="text" value="${item.medication || ''}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.treatments.dosage')}</label>
        <input id="swal-dosage" class="form-control" type="text" value="${item.dosage || ''}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.treatments.frequency')}</label>
        <input id="swal-frequency" class="form-control" type="text" value="${item.frequency || ''}">
      </div>
      <div class="row mb-3">
        <div class="col-6 text-start">
          <label class="form-label">${t('medical.treatments.startDate')}</label>
          <input id="swal-start-date" class="form-control" type="date" value="${item.start_date || ''}">
        </div>
        <div class="col-6 text-start">
          <label class="form-label">${t('medical.treatments.endDate')}</label>
          <input id="swal-end-date" class="form-control" type="date" value="${item.end_date || ''}">
        </div>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.treatments.priority')}</label>
        <select id="swal-priority" class="form-select">
          <option value="low" ${item.priority === 'low' ? 'selected' : ''}>${t('medical.treatments.priorities.low')}</option>
          <option value="normal" ${item.priority === 'normal' ? 'selected' : ''}>${t('medical.treatments.priorities.normal')}</option>
          <option value="high" ${item.priority === 'high' ? 'selected' : ''}>${t('medical.treatments.priorities.high')}</option>
          <option value="urgent" ${item.priority === 'urgent' ? 'selected' : ''}>${t('medical.treatments.priorities.urgent')}</option>
        </select>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.treatments.status')}</label>
        <select id="swal-status" class="form-select">
          <option value="active" ${item.status === 'active' ? 'selected' : ''}>${t('medical.treatments.statuses.active')}</option>
          <option value="completed" ${item.status === 'completed' ? 'selected' : ''}>${t('medical.treatments.statuses.completed')}</option>
          <option value="suspended" ${item.status === 'suspended' ? 'selected' : ''}>${t('medical.treatments.statuses.suspended')}</option>
          <option value="discontinued" ${item.status === 'discontinued' ? 'selected' : ''}>${t('medical.treatments.statuses.discontinued')}</option>
        </select>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.treatments.notes')}</label>
        <textarea id="swal-notes" class="form-control" rows="3">${item.notes || ''}</textarea>
      </div>
    `,
    width: '600px',
    showCancelButton: true,
    confirmButtonText: t('common.save'),
    cancelButtonText: t('common.cancel'),
    preConfirm: () => {
      const medication = (document.getElementById('swal-medication') as HTMLInputElement).value;
      const dosage = (document.getElementById('swal-dosage') as HTMLInputElement).value;
      const frequency = (document.getElementById('swal-frequency') as HTMLInputElement).value;
      const start_date = (document.getElementById('swal-start-date') as HTMLInputElement).value;
      const end_date = (document.getElementById('swal-end-date') as HTMLInputElement).value;
      const priority = (document.getElementById('swal-priority') as HTMLSelectElement).value;
      const status = (document.getElementById('swal-status') as HTMLSelectElement).value;
      const notes = (document.getElementById('swal-notes') as HTMLTextAreaElement).value;

      if (!medication || !start_date) {
        Swal.showValidationMessage(t('medical.treatments.requiredFields'));
        return false;
      }

      return { medication, dosage, frequency, start_date, end_date, priority, status, notes };
    },
  });

  if (formData) {
    try {
      await ApiService.put(`/inmate-medical-treatments/${item.id}`, formData);
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.treatments.editSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error updating treatment:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.treatments.editError'),
      });
    }
  }
};

const viewItem = async (item: any) => {
  await Swal.fire({
    title: t('medical.treatments.detailTitle'),
    html: `
      <div class="text-start">
        <p><strong>${t('medical.treatments.inmate')}:</strong> ${item.inmate?.full_name || item.inmate_id}</p>
        <p><strong>${t('medical.treatments.medication')}:</strong> ${item.medication || '-'}</p>
        <p><strong>${t('medical.treatments.dosage')}:</strong> ${item.dosage || '-'}</p>
        <p><strong>${t('medical.treatments.frequency')}:</strong> ${item.frequency || '-'}</p>
        <p><strong>${t('medical.treatments.startDate')}:</strong> ${formatDate(item.start_date)}</p>
        <p><strong>${t('medical.treatments.endDate')}:</strong> ${formatDate(item.end_date)}</p>
        <p><strong>${t('medical.treatments.priority')}:</strong> ${getPriorityLabel(item.priority)}</p>
        <p><strong>${t('medical.treatments.status')}:</strong> ${getStatusLabel(item.status)}</p>
        <p><strong>${t('medical.treatments.notes')}:</strong> ${item.notes || '-'}</p>
      </div>
    `,
    width: '600px',
    confirmButtonText: t('common.close'),
  });
};

const suspendItem = async (item: any) => {
  const { value: reason } = await Swal.fire({
    title: t('medical.treatments.suspendTitle'),
    input: 'textarea',
    inputLabel: t('medical.treatments.suspendReason'),
    inputPlaceholder: t('medical.treatments.suspendReasonPlaceholder'),
    showCancelButton: true,
    confirmButtonText: t('medical.treatments.suspend'),
    cancelButtonText: t('common.cancel'),
    inputValidator: (value) => {
      if (!value) return t('medical.treatments.reasonRequired');
    },
  });

  if (reason) {
    try {
      await ApiService.post(`/inmate-medical-treatments/${item.id}/suspend`, { reason });
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.treatments.suspendSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error suspending treatment:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.treatments.suspendError'),
      });
    }
  }
};

const discontinueItem = async (item: any) => {
  const { value: reason } = await Swal.fire({
    title: t('medical.treatments.discontinueTitle'),
    input: 'textarea',
    inputLabel: t('medical.treatments.discontinueReason'),
    inputPlaceholder: t('medical.treatments.discontinueReasonPlaceholder'),
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: t('medical.treatments.discontinue'),
    cancelButtonText: t('common.cancel'),
    inputValidator: (value) => {
      if (!value) return t('medical.treatments.reasonRequired');
    },
  });

  if (reason) {
    try {
      await ApiService.post(`/inmate-medical-treatments/${item.id}/discontinue`, { reason });
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.treatments.discontinueSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error discontinuing treatment:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.treatments.discontinueError'),
      });
    }
  }
};

const deleteItem = async (item: any) => {
  const result = await Swal.fire({
    title: t('medical.treatments.deleteConfirmTitle'),
    text: t('medical.treatments.deleteConfirmText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: t('common.delete'),
    cancelButtonText: t('common.cancel'),
  });

  if (result.isConfirmed) {
    try {
      await ApiService.delete(`/inmate-medical-treatments/${item.id}`);
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.treatments.deleteSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error deleting treatment:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.treatments.deleteError'),
      });
    }
  }
};

// Lifecycle
onMounted(async () => {
  await loadItems();
});
</script>
