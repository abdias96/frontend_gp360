<template>
  <ModuleListTemplate
    :title="t('medical.emergencies.title')"
    :subtitle="t('medical.emergencies.subtitle')"
    :items="items"
    :loading="loading"
    :total="total"
    :current-page="currentPage"
    :per-page="perPage"
    :show-create-button="true"
    :empty-state-text="t('medical.emergencies.noData')"
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
          <option value="">{{ t('medical.emergencies.allStatuses') }}</option>
          <option value="scheduled">{{ t('medical.emergencies.statuses.scheduled') }}</option>
          <option value="in_progress">{{ t('medical.emergencies.statuses.in_progress') }}</option>
          <option value="completed">{{ t('medical.emergencies.statuses.completed') }}</option>
          <option value="cancelled">{{ t('medical.emergencies.statuses.cancelled') }}</option>
        </select>
      </div>
      <div class="me-3">
        <input
          type="date"
          v-model="filterDateFrom"
          @change="handleFilter"
          class="form-control form-control-solid"
          :placeholder="t('medical.emergencies.dateFrom')"
        />
      </div>
      <div class="me-3">
        <input
          type="date"
          v-model="filterDateTo"
          @change="handleFilter"
          class="form-control form-control-solid"
          :placeholder="t('medical.emergencies.dateTo')"
        />
      </div>
    </template>

    <!-- Table headers -->
    <template #table-headers>
      <th class="min-w-50px">{{ t('medical.emergencies.urgency') }}</th>
      <th class="min-w-150px">{{ t('medical.emergencies.inmate') }}</th>
      <th class="min-w-120px">{{ t('medical.emergencies.doctor') }}</th>
      <th class="min-w-100px">{{ t('medical.emergencies.date') }}</th>
      <th class="min-w-150px">{{ t('medical.emergencies.diagnosis') }}</th>
      <th class="min-w-100px">{{ t('medical.emergencies.status') }}</th>
      <th class="min-w-120px text-end">{{ t('common.actions.title') }}</th>
    </template>

    <!-- Table body -->
    <template #table-body="{ items }">
      <tr v-for="item in items" :key="item.id">
        <td>
          <span class="badge badge-danger">
            {{ t('medical.emergencies.emergencyBadge') }}
          </span>
        </td>
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
              :title="t('medical.emergencies.completeEmergency')"
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
const filterStatus = ref('');
const filterDateFrom = ref('');
const filterDateTo = ref('');
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);

// Load data - always filter by consultation_type=emergency
const loadItems = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get('/inmate-medical-consultations', {
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        search: searchQuery.value,
        consultation_type: 'emergency',
        status: filterStatus.value,
        date_from: filterDateFrom.value,
        date_to: filterDateTo.value,
      },
    });
    items.value = response.data.data;
    total.value = response.data.total;
  } catch (error) {
    console.error('Error loading emergencies:', error);
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: t('medical.emergencies.loadError'),
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

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    scheduled: t('medical.emergencies.statuses.scheduled'),
    in_progress: t('medical.emergencies.statuses.in_progress'),
    completed: t('medical.emergencies.statuses.completed'),
    cancelled: t('medical.emergencies.statuses.cancelled'),
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
    title: t('medical.emergencies.createTitle'),
    html: `
      <div class="alert alert-danger d-flex align-items-center mb-4" role="alert">
        <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-3"><span class="path1"></span><span class="path2"></span></i>
        <div class="fw-bold">${t('medical.emergencies.emergencyAlert')}</div>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.emergencies.inmateId')}</label>
        <input id="swal-inmate-id" class="form-control" type="number" placeholder="${t('medical.emergencies.inmateIdPlaceholder')}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.emergencies.date')}</label>
        <input id="swal-date" class="form-control" type="datetime-local">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.emergencies.doctor')}</label>
        <input id="swal-doctor" class="form-control" type="text" placeholder="${t('medical.emergencies.doctorPlaceholder')}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.emergencies.speciality')}</label>
        <input id="swal-speciality" class="form-control" type="text">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.emergencies.medicalCenter')}</label>
        <input id="swal-center" class="form-control" type="text">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.emergencies.status')}</label>
        <select id="swal-status" class="form-select">
          <option value="in_progress">${t('medical.emergencies.statuses.in_progress')}</option>
          <option value="scheduled">${t('medical.emergencies.statuses.scheduled')}</option>
          <option value="completed">${t('medical.emergencies.statuses.completed')}</option>
        </select>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.emergencies.notes')}</label>
        <textarea id="swal-notes" class="form-control" rows="3" placeholder="${t('medical.emergencies.notesPlaceholder')}"></textarea>
      </div>
    `,
    width: '600px',
    showCancelButton: true,
    confirmButtonText: t('common.save'),
    confirmButtonColor: '#d33',
    cancelButtonText: t('common.cancel'),
    preConfirm: () => {
      const inmate_id = (document.getElementById('swal-inmate-id') as HTMLInputElement).value;
      const consultation_date = (document.getElementById('swal-date') as HTMLInputElement).value;
      const doctor_name = (document.getElementById('swal-doctor') as HTMLInputElement).value;
      const speciality = (document.getElementById('swal-speciality') as HTMLInputElement).value;
      const medical_center = (document.getElementById('swal-center') as HTMLInputElement).value;
      const status = (document.getElementById('swal-status') as HTMLSelectElement).value;
      const notes = (document.getElementById('swal-notes') as HTMLTextAreaElement).value;

      if (!inmate_id || !consultation_date || !doctor_name) {
        Swal.showValidationMessage(t('medical.emergencies.requiredFields'));
        return false;
      }

      return {
        inmate_id,
        consultation_date,
        consultation_type: 'emergency',
        doctor_name,
        speciality,
        medical_center,
        status,
        notes,
      };
    },
  });

  if (formData) {
    try {
      await ApiService.post('/inmate-medical-consultations', formData);
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.emergencies.createSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error creating emergency:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.emergencies.createError'),
      });
    }
  }
};

const showEditModal = async (item: any) => {
  const { value: formData } = await Swal.fire({
    title: t('medical.emergencies.editTitle'),
    html: `
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.emergencies.date')}</label>
        <input id="swal-date" class="form-control" type="datetime-local" value="${item.consultation_date || ''}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.emergencies.doctor')}</label>
        <input id="swal-doctor" class="form-control" type="text" value="${item.doctor_name || ''}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.emergencies.speciality')}</label>
        <input id="swal-speciality" class="form-control" type="text" value="${item.speciality || ''}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.emergencies.medicalCenter')}</label>
        <input id="swal-center" class="form-control" type="text" value="${item.medical_center || ''}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.emergencies.status')}</label>
        <select id="swal-status" class="form-select">
          <option value="scheduled" ${item.status === 'scheduled' ? 'selected' : ''}>${t('medical.emergencies.statuses.scheduled')}</option>
          <option value="in_progress" ${item.status === 'in_progress' ? 'selected' : ''}>${t('medical.emergencies.statuses.in_progress')}</option>
          <option value="completed" ${item.status === 'completed' ? 'selected' : ''}>${t('medical.emergencies.statuses.completed')}</option>
          <option value="cancelled" ${item.status === 'cancelled' ? 'selected' : ''}>${t('medical.emergencies.statuses.cancelled')}</option>
        </select>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.emergencies.notes')}</label>
        <textarea id="swal-notes" class="form-control" rows="3">${item.notes || ''}</textarea>
      </div>
    `,
    width: '600px',
    showCancelButton: true,
    confirmButtonText: t('common.save'),
    cancelButtonText: t('common.cancel'),
    preConfirm: () => {
      const consultation_date = (document.getElementById('swal-date') as HTMLInputElement).value;
      const doctor_name = (document.getElementById('swal-doctor') as HTMLInputElement).value;
      const speciality = (document.getElementById('swal-speciality') as HTMLInputElement).value;
      const medical_center = (document.getElementById('swal-center') as HTMLInputElement).value;
      const status = (document.getElementById('swal-status') as HTMLSelectElement).value;
      const notes = (document.getElementById('swal-notes') as HTMLTextAreaElement).value;

      if (!consultation_date || !doctor_name) {
        Swal.showValidationMessage(t('medical.emergencies.requiredFields'));
        return false;
      }

      return {
        consultation_date,
        consultation_type: 'emergency',
        doctor_name,
        speciality,
        medical_center,
        status,
        notes,
      };
    },
  });

  if (formData) {
    try {
      await ApiService.put(`/inmate-medical-consultations/${item.id}`, formData);
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.emergencies.editSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error updating emergency:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.emergencies.editError'),
      });
    }
  }
};

const viewItem = async (item: any) => {
  await Swal.fire({
    title: t('medical.emergencies.detailTitle'),
    html: `
      <div class="text-start">
        <div class="alert alert-danger mb-3">
          <strong>${t('medical.emergencies.emergencyBadge')}</strong>
        </div>
        <p><strong>${t('medical.emergencies.inmate')}:</strong> ${item.inmate?.full_name || item.inmate_id}</p>
        <p><strong>${t('medical.emergencies.doctor')}:</strong> ${item.doctor_name || '-'}</p>
        <p><strong>${t('medical.emergencies.speciality')}:</strong> ${item.speciality || '-'}</p>
        <p><strong>${t('medical.emergencies.medicalCenter')}:</strong> ${item.medical_center || '-'}</p>
        <p><strong>${t('medical.emergencies.date')}:</strong> ${formatDate(item.consultation_date)}</p>
        <p><strong>${t('medical.emergencies.diagnosis')}:</strong> ${item.diagnosis || '-'}</p>
        <p><strong>${t('medical.emergencies.status')}:</strong> ${getStatusLabel(item.status)}</p>
        <p><strong>${t('medical.emergencies.notes')}:</strong> ${item.notes || '-'}</p>
      </div>
    `,
    width: '600px',
    confirmButtonText: t('common.close'),
  });
};

const completeItem = async (item: any) => {
  const result = await Swal.fire({
    title: t('medical.emergencies.completeConfirmTitle'),
    text: t('medical.emergencies.completeConfirmText'),
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: t('medical.emergencies.completeEmergency'),
    confirmButtonColor: '#50cd89',
    cancelButtonText: t('common.cancel'),
  });

  if (result.isConfirmed) {
    try {
      await ApiService.post(`/inmate-medical-consultations/${item.id}/complete`, {});
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.emergencies.completeSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error completing emergency:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.emergencies.completeError'),
      });
    }
  }
};

const deleteItem = async (item: any) => {
  const result = await Swal.fire({
    title: t('medical.emergencies.deleteConfirmTitle'),
    text: t('medical.emergencies.deleteConfirmText'),
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
        text: t('medical.emergencies.deleteSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error deleting emergency:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.emergencies.deleteError'),
      });
    }
  }
};

// Lifecycle
onMounted(async () => {
  await loadItems();
});
</script>
