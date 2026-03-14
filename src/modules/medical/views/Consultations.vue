<template>
  <ModuleListTemplate
    :title="t('medical.consultations.title')"
    :subtitle="t('medical.consultations.subtitle')"
    :items="items"
    :loading="loading"
    :total="total"
    :current-page="currentPage"
    :per-page="perPage"
    :show-create-button="true"
    :empty-state-text="t('medical.consultations.noData')"
    @search="handleSearch"
    @change-page="changePage"
    @create="showCreateModal"
  >
    <!-- Filters -->
    <template #filters>
      <div class="me-3">
        <select
          v-model="filterType"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('medical.consultations.allTypes') }}</option>
          <option value="general">{{ t('medical.consultations.types.general') }}</option>
          <option value="specialist">{{ t('medical.consultations.types.specialist') }}</option>
          <option value="emergency">{{ t('medical.consultations.types.emergency') }}</option>
          <option value="follow_up">{{ t('medical.consultations.types.follow_up') }}</option>
        </select>
      </div>
      <div class="me-3">
        <select
          v-model="filterStatus"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('medical.consultations.allStatuses') }}</option>
          <option value="scheduled">{{ t('medical.consultations.statuses.scheduled') }}</option>
          <option value="in_progress">{{ t('medical.consultations.statuses.in_progress') }}</option>
          <option value="completed">{{ t('medical.consultations.statuses.completed') }}</option>
          <option value="cancelled">{{ t('medical.consultations.statuses.cancelled') }}</option>
        </select>
      </div>
      <div class="me-3">
        <input
          type="date"
          v-model="filterDateFrom"
          @change="handleFilter"
          class="form-control form-control-solid"
          :placeholder="t('medical.consultations.dateFrom')"
        />
      </div>
      <div class="me-3">
        <input
          type="date"
          v-model="filterDateTo"
          @change="handleFilter"
          class="form-control form-control-solid"
          :placeholder="t('medical.consultations.dateTo')"
        />
      </div>
    </template>

    <!-- Table headers -->
    <template #table-headers>
      <th class="min-w-150px">{{ t('medical.consultations.inmate') }}</th>
      <th class="min-w-100px">{{ t('medical.consultations.type') }}</th>
      <th class="min-w-120px">{{ t('medical.consultations.doctor') }}</th>
      <th class="min-w-100px">{{ t('medical.consultations.date') }}</th>
      <th class="min-w-150px">{{ t('medical.consultations.diagnosis') }}</th>
      <th class="min-w-100px">{{ t('medical.consultations.status') }}</th>
      <th class="min-w-100px text-end">{{ t('common.actions.title') }}</th>
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
          <span class="text-gray-900 fw-bold d-block fs-6">
            {{ getTypeLabel(item.consultation_type) }}
          </span>
        </td>
        <td>
          <span class="text-gray-900 fw-bold d-block fs-6">
            {{ item.doctor_name }}
          </span>
          <span class="text-muted fw-semibold d-block fs-7">
            {{ item.speciality }}
          </span>
        </td>
        <td>
          <span class="text-gray-900 fw-bold d-block fs-6">
            {{ formatDate(item.consultation_date) }}
          </span>
        </td>
        <td>
          <span class="text-gray-900 d-block fs-7">
            {{ item.diagnosis || '-' }}
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
              v-if="item.status === 'scheduled' || item.status === 'in_progress'"
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1"
              @click.prevent="completeItem(item)"
              :title="t('medical.consultations.complete')"
            >
              <KTIcon icon-name="check" icon-class="fs-3" />
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
const filterType = ref('');
const filterStatus = ref('');
const filterDateFrom = ref('');
const filterDateTo = ref('');
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);

// Load data
const loadItems = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get('/inmate-medical-consultations', {
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        search: searchQuery.value,
        consultation_type: filterType.value,
        status: filterStatus.value,
        date_from: filterDateFrom.value,
        date_to: filterDateTo.value,
      },
    });
    items.value = response.data.data;
    total.value = response.data.total;
  } catch (error) {
    console.error('Error loading consultations:', error);
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: t('medical.consultations.loadError'),
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

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    general: t('medical.consultations.types.general'),
    specialist: t('medical.consultations.types.specialist'),
    emergency: t('medical.consultations.types.emergency'),
    follow_up: t('medical.consultations.types.follow_up'),
  };
  return labels[type] || type;
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    scheduled: t('medical.consultations.statuses.scheduled'),
    in_progress: t('medical.consultations.statuses.in_progress'),
    completed: t('medical.consultations.statuses.completed'),
    cancelled: t('medical.consultations.statuses.cancelled'),
  };
  return labels[status] || status;
};

const getStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    scheduled: 'badge-light-info',
    in_progress: 'badge-light-warning',
    completed: 'badge-light-success',
    cancelled: 'badge-light-danger',
  };
  return badges[status] || 'badge-light-secondary';
};

// CRUD
const showCreateModal = async () => {
  const { value: formData } = await Swal.fire({
    title: t('medical.consultations.createTitle'),
    html: `
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.consultations.inmateId')}</label>
        <input id="swal-inmate-id" class="form-control" type="number" placeholder="${t('medical.consultations.inmateIdPlaceholder')}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.consultations.date')}</label>
        <input id="swal-date" class="form-control" type="datetime-local">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.consultations.type')}</label>
        <select id="swal-type" class="form-select">
          <option value="general">${t('medical.consultations.types.general')}</option>
          <option value="specialist">${t('medical.consultations.types.specialist')}</option>
          <option value="emergency">${t('medical.consultations.types.emergency')}</option>
          <option value="follow_up">${t('medical.consultations.types.follow_up')}</option>
        </select>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.consultations.doctor')}</label>
        <input id="swal-doctor" class="form-control" type="text" placeholder="${t('medical.consultations.doctorPlaceholder')}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.consultations.speciality')}</label>
        <input id="swal-speciality" class="form-control" type="text">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.consultations.medicalCenter')}</label>
        <input id="swal-center" class="form-control" type="text">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.consultations.status')}</label>
        <select id="swal-status" class="form-select">
          <option value="scheduled">${t('medical.consultations.statuses.scheduled')}</option>
          <option value="in_progress">${t('medical.consultations.statuses.in_progress')}</option>
          <option value="completed">${t('medical.consultations.statuses.completed')}</option>
        </select>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.consultations.notes')}</label>
        <textarea id="swal-notes" class="form-control" rows="3"></textarea>
      </div>
    `,
    width: '600px',
    showCancelButton: true,
    confirmButtonText: t('common.save'),
    cancelButtonText: t('common.cancel'),
    preConfirm: () => {
      const inmate_id = (document.getElementById('swal-inmate-id') as HTMLInputElement).value;
      const consultation_date = (document.getElementById('swal-date') as HTMLInputElement).value;
      const consultation_type = (document.getElementById('swal-type') as HTMLSelectElement).value;
      const doctor_name = (document.getElementById('swal-doctor') as HTMLInputElement).value;
      const speciality = (document.getElementById('swal-speciality') as HTMLInputElement).value;
      const medical_center = (document.getElementById('swal-center') as HTMLInputElement).value;
      const status = (document.getElementById('swal-status') as HTMLSelectElement).value;
      const notes = (document.getElementById('swal-notes') as HTMLTextAreaElement).value;

      if (!inmate_id || !consultation_date || !doctor_name) {
        Swal.showValidationMessage(t('medical.consultations.requiredFields'));
        return false;
      }

      return { inmate_id, consultation_date, consultation_type, doctor_name, speciality, medical_center, status, notes };
    },
  });

  if (formData) {
    try {
      await ApiService.post('/inmate-medical-consultations', formData);
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.consultations.createSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error creating consultation:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.consultations.createError'),
      });
    }
  }
};

const showEditModal = async (item: any) => {
  const { value: formData } = await Swal.fire({
    title: t('medical.consultations.editTitle'),
    html: `
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.consultations.date')}</label>
        <input id="swal-date" class="form-control" type="datetime-local" value="${item.consultation_date || ''}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.consultations.type')}</label>
        <select id="swal-type" class="form-select">
          <option value="general" ${item.consultation_type === 'general' ? 'selected' : ''}>${t('medical.consultations.types.general')}</option>
          <option value="specialist" ${item.consultation_type === 'specialist' ? 'selected' : ''}>${t('medical.consultations.types.specialist')}</option>
          <option value="emergency" ${item.consultation_type === 'emergency' ? 'selected' : ''}>${t('medical.consultations.types.emergency')}</option>
          <option value="follow_up" ${item.consultation_type === 'follow_up' ? 'selected' : ''}>${t('medical.consultations.types.follow_up')}</option>
        </select>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.consultations.doctor')}</label>
        <input id="swal-doctor" class="form-control" type="text" value="${item.doctor_name || ''}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.consultations.speciality')}</label>
        <input id="swal-speciality" class="form-control" type="text" value="${item.speciality || ''}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.consultations.medicalCenter')}</label>
        <input id="swal-center" class="form-control" type="text" value="${item.medical_center || ''}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.consultations.status')}</label>
        <select id="swal-status" class="form-select">
          <option value="scheduled" ${item.status === 'scheduled' ? 'selected' : ''}>${t('medical.consultations.statuses.scheduled')}</option>
          <option value="in_progress" ${item.status === 'in_progress' ? 'selected' : ''}>${t('medical.consultations.statuses.in_progress')}</option>
          <option value="completed" ${item.status === 'completed' ? 'selected' : ''}>${t('medical.consultations.statuses.completed')}</option>
          <option value="cancelled" ${item.status === 'cancelled' ? 'selected' : ''}>${t('medical.consultations.statuses.cancelled')}</option>
        </select>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.consultations.notes')}</label>
        <textarea id="swal-notes" class="form-control" rows="3">${item.notes || ''}</textarea>
      </div>
    `,
    width: '600px',
    showCancelButton: true,
    confirmButtonText: t('common.save'),
    cancelButtonText: t('common.cancel'),
    preConfirm: () => {
      const consultation_date = (document.getElementById('swal-date') as HTMLInputElement).value;
      const consultation_type = (document.getElementById('swal-type') as HTMLSelectElement).value;
      const doctor_name = (document.getElementById('swal-doctor') as HTMLInputElement).value;
      const speciality = (document.getElementById('swal-speciality') as HTMLInputElement).value;
      const medical_center = (document.getElementById('swal-center') as HTMLInputElement).value;
      const status = (document.getElementById('swal-status') as HTMLSelectElement).value;
      const notes = (document.getElementById('swal-notes') as HTMLTextAreaElement).value;

      if (!consultation_date || !doctor_name) {
        Swal.showValidationMessage(t('medical.consultations.requiredFields'));
        return false;
      }

      return { consultation_date, consultation_type, doctor_name, speciality, medical_center, status, notes };
    },
  });

  if (formData) {
    try {
      await ApiService.put(`/inmate-medical-consultations/${item.id}`, formData);
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.consultations.editSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error updating consultation:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.consultations.editError'),
      });
    }
  }
};

const viewItem = async (item: any) => {
  await Swal.fire({
    title: t('medical.consultations.detailTitle'),
    html: `
      <div class="text-start">
        <p><strong>${t('medical.consultations.inmate')}:</strong> ${item.inmate?.full_name || item.inmate_id}</p>
        <p><strong>${t('medical.consultations.type')}:</strong> ${getTypeLabel(item.consultation_type)}</p>
        <p><strong>${t('medical.consultations.doctor')}:</strong> ${item.doctor_name || '-'}</p>
        <p><strong>${t('medical.consultations.speciality')}:</strong> ${item.speciality || '-'}</p>
        <p><strong>${t('medical.consultations.medicalCenter')}:</strong> ${item.medical_center || '-'}</p>
        <p><strong>${t('medical.consultations.date')}:</strong> ${formatDate(item.consultation_date)}</p>
        <p><strong>${t('medical.consultations.diagnosis')}:</strong> ${item.diagnosis || '-'}</p>
        <p><strong>${t('medical.consultations.status')}:</strong> ${getStatusLabel(item.status)}</p>
        <p><strong>${t('medical.consultations.notes')}:</strong> ${item.notes || '-'}</p>
      </div>
    `,
    width: '600px',
    confirmButtonText: t('common.close'),
  });
};

const completeItem = async (item: any) => {
  const result = await Swal.fire({
    title: t('medical.consultations.completeConfirmTitle'),
    text: t('medical.consultations.completeConfirmText'),
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: t('medical.consultations.complete'),
    cancelButtonText: t('common.cancel'),
  });

  if (result.isConfirmed) {
    try {
      await ApiService.post(`/inmate-medical-consultations/${item.id}/complete`, {});
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.consultations.completeSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error completing consultation:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.consultations.completeError'),
      });
    }
  }
};

const deleteItem = async (item: any) => {
  const result = await Swal.fire({
    title: t('medical.consultations.deleteConfirmTitle'),
    text: t('medical.consultations.deleteConfirmText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: t('common.delete'),
    cancelButtonText: t('common.cancel'),
  });

  if (result.isConfirmed) {
    try {
      await ApiService.delete(`/inmate-medical-consultations/${item.id}`);
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.consultations.deleteSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error deleting consultation:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.consultations.deleteError'),
      });
    }
  }
};

// Lifecycle
onMounted(async () => {
  await loadItems();
});
</script>
