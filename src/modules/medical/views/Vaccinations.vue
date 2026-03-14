<template>
  <ModuleListTemplate
    :title="t('medical.vaccinations.title')"
    :subtitle="t('medical.vaccinations.subtitle')"
    :items="items"
    :loading="loading"
    :total="total"
    :current-page="currentPage"
    :per-page="perPage"
    :show-create-button="true"
    :empty-state-text="t('medical.vaccinations.noData')"
    @search="handleSearch"
    @change-page="changePage"
    @create="showCreateModal"
  >
    <!-- Filters -->
    <template #filters>
      <div class="me-3">
        <select
          v-model="filterVaccineType"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('medical.vaccinations.allTypes') }}</option>
          <option value="covid19">COVID-19</option>
          <option value="influenza">{{ t('medical.vaccinations.vaccineTypes.influenza') }}</option>
          <option value="hepatitis_a">{{ t('medical.vaccinations.vaccineTypes.hepatitis_a') }}</option>
          <option value="hepatitis_b">{{ t('medical.vaccinations.vaccineTypes.hepatitis_b') }}</option>
          <option value="tetanus">{{ t('medical.vaccinations.vaccineTypes.tetanus') }}</option>
          <option value="tuberculosis">{{ t('medical.vaccinations.vaccineTypes.tuberculosis') }}</option>
          <option value="other">{{ t('medical.vaccinations.vaccineTypes.other') }}</option>
        </select>
      </div>
      <div class="me-3">
        <select
          v-model="filterSeriesComplete"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('medical.vaccinations.allSeries') }}</option>
          <option value="true">{{ t('medical.vaccinations.seriesCompleted') }}</option>
          <option value="false">{{ t('medical.vaccinations.seriesPending') }}</option>
        </select>
      </div>
    </template>

    <!-- Table headers -->
    <template #table-headers>
      <th class="min-w-150px">{{ t('medical.vaccinations.inmate') }}</th>
      <th class="min-w-120px">{{ t('medical.vaccinations.vaccineName') }}</th>
      <th class="min-w-100px">{{ t('medical.vaccinations.vaccineType') }}</th>
      <th class="min-w-100px">{{ t('medical.vaccinations.vaccinationDate') }}</th>
      <th class="min-w-80px">{{ t('medical.vaccinations.doseNumber') }}</th>
      <th class="min-w-100px">{{ t('medical.vaccinations.nextDoseDate') }}</th>
      <th class="min-w-80px">{{ t('medical.vaccinations.seriesComplete') }}</th>
      <th class="min-w-100px">{{ t('medical.vaccinations.manufacturer') }}</th>
      <th class="min-w-100px text-end">{{ t('common.actions.title') }}</th>
    </template>

    <!-- Table body -->
    <template #table-body="{ items }">
      <tr
        v-for="item in items"
        :key="item.id"
        :class="{ 'bg-light-danger': isOverdue(item) }"
      >
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
          <span class="text-gray-900 fw-bold d-block fs-6">{{ item.vaccine_name }}</span>
        </td>
        <td>
          <span class="text-gray-900 d-block fs-7">{{ item.vaccine_type || '-' }}</span>
        </td>
        <td>
          <span class="text-gray-900 fw-bold d-block fs-6">{{ formatDate(item.vaccination_date) }}</span>
        </td>
        <td>
          <span class="badge badge-light-info">{{ item.dose_number || '-' }}</span>
        </td>
        <td>
          <div>
            <span class="text-gray-900 fw-bold d-block fs-6">{{ formatDate(item.next_dose_date) }}</span>
            <span
              v-if="isOverdue(item)"
              class="badge badge-light-danger mt-1"
            >
              {{ t('medical.vaccinations.overdue') }}
            </span>
          </div>
        </td>
        <td>
          <span
            class="badge"
            :class="item.series_complete ? 'badge-light-success' : 'badge-light-warning'"
          >
            {{ item.series_complete ? t('medical.vaccinations.complete') : t('medical.vaccinations.pending') }}
          </span>
        </td>
        <td>
          <span class="text-gray-900 d-block fs-7">{{ item.manufacturer || '-' }}</span>
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
const filterVaccineType = ref('');
const filterSeriesComplete = ref('');
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);

// Helpers
const isOverdue = (item: any) => {
  if (!item.next_dose_date || item.series_complete) return false;
  return new Date(item.next_dose_date) < new Date();
};

// Load data
const loadItems = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get('/inmate-vaccinations', {
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        search: searchQuery.value,
        vaccine_type: filterVaccineType.value,
        series_complete: filterSeriesComplete.value,
      },
    });
    items.value = response.data.data;
    total.value = response.data.total;
  } catch (error) {
    console.error('Error loading vaccinations:', error);
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: t('medical.vaccinations.loadError'),
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

// CRUD
const showCreateModal = async () => {
  const { value: formData } = await Swal.fire({
    title: t('medical.vaccinations.createTitle'),
    html: `
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.vaccinations.inmateId')}</label>
        <input id="swal-inmate-id" class="form-control" type="number" placeholder="${t('medical.vaccinations.inmateIdPlaceholder')}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.vaccinations.vaccineName')}</label>
        <input id="swal-vaccine-name" class="form-control" type="text">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.vaccinations.vaccineType')}</label>
        <select id="swal-vaccine-type" class="form-select">
          <option value="covid19">COVID-19</option>
          <option value="influenza">${t('medical.vaccinations.vaccineTypes.influenza')}</option>
          <option value="hepatitis_a">${t('medical.vaccinations.vaccineTypes.hepatitis_a')}</option>
          <option value="hepatitis_b">${t('medical.vaccinations.vaccineTypes.hepatitis_b')}</option>
          <option value="tetanus">${t('medical.vaccinations.vaccineTypes.tetanus')}</option>
          <option value="tuberculosis">${t('medical.vaccinations.vaccineTypes.tuberculosis')}</option>
          <option value="other">${t('medical.vaccinations.vaccineTypes.other')}</option>
        </select>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.vaccinations.vaccinationDate')}</label>
        <input id="swal-vaccination-date" class="form-control" type="date">
      </div>
      <div class="row mb-3">
        <div class="col-6 text-start">
          <label class="form-label">${t('medical.vaccinations.doseNumber')}</label>
          <input id="swal-dose-number" class="form-control" type="number" min="1" value="1">
        </div>
        <div class="col-6 text-start">
          <label class="form-label">${t('medical.vaccinations.nextDoseDate')}</label>
          <input id="swal-next-dose-date" class="form-control" type="date">
        </div>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.vaccinations.manufacturer')}</label>
        <input id="swal-manufacturer" class="form-control" type="text">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.vaccinations.lotNumber')}</label>
        <input id="swal-lot-number" class="form-control" type="text">
      </div>
      <div class="mb-3 text-start">
        <div class="form-check">
          <input id="swal-series-complete" class="form-check-input" type="checkbox">
          <label class="form-check-label" for="swal-series-complete">${t('medical.vaccinations.seriesIsComplete')}</label>
        </div>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.vaccinations.notes')}</label>
        <textarea id="swal-notes" class="form-control" rows="2"></textarea>
      </div>
    `,
    width: '600px',
    showCancelButton: true,
    confirmButtonText: t('common.save'),
    cancelButtonText: t('common.cancel'),
    preConfirm: () => {
      const inmate_id = (document.getElementById('swal-inmate-id') as HTMLInputElement).value;
      const vaccine_name = (document.getElementById('swal-vaccine-name') as HTMLInputElement).value;
      const vaccine_type = (document.getElementById('swal-vaccine-type') as HTMLSelectElement).value;
      const vaccination_date = (document.getElementById('swal-vaccination-date') as HTMLInputElement).value;
      const dose_number = (document.getElementById('swal-dose-number') as HTMLInputElement).value;
      const next_dose_date = (document.getElementById('swal-next-dose-date') as HTMLInputElement).value;
      const manufacturer = (document.getElementById('swal-manufacturer') as HTMLInputElement).value;
      const lot_number = (document.getElementById('swal-lot-number') as HTMLInputElement).value;
      const series_complete = (document.getElementById('swal-series-complete') as HTMLInputElement).checked;
      const notes = (document.getElementById('swal-notes') as HTMLTextAreaElement).value;

      if (!inmate_id || !vaccine_name || !vaccination_date) {
        Swal.showValidationMessage(t('medical.vaccinations.requiredFields'));
        return false;
      }

      return { inmate_id, vaccine_name, vaccine_type, vaccination_date, dose_number, next_dose_date, manufacturer, lot_number, series_complete, notes };
    },
  });

  if (formData) {
    try {
      await ApiService.post('/inmate-vaccinations', formData);
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.vaccinations.createSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error creating vaccination:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.vaccinations.createError'),
      });
    }
  }
};

const showEditModal = async (item: any) => {
  const { value: formData } = await Swal.fire({
    title: t('medical.vaccinations.editTitle'),
    html: `
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.vaccinations.vaccineName')}</label>
        <input id="swal-vaccine-name" class="form-control" type="text" value="${item.vaccine_name || ''}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.vaccinations.vaccineType')}</label>
        <select id="swal-vaccine-type" class="form-select">
          <option value="covid19" ${item.vaccine_type === 'covid19' ? 'selected' : ''}>COVID-19</option>
          <option value="influenza" ${item.vaccine_type === 'influenza' ? 'selected' : ''}>${t('medical.vaccinations.vaccineTypes.influenza')}</option>
          <option value="hepatitis_a" ${item.vaccine_type === 'hepatitis_a' ? 'selected' : ''}>${t('medical.vaccinations.vaccineTypes.hepatitis_a')}</option>
          <option value="hepatitis_b" ${item.vaccine_type === 'hepatitis_b' ? 'selected' : ''}>${t('medical.vaccinations.vaccineTypes.hepatitis_b')}</option>
          <option value="tetanus" ${item.vaccine_type === 'tetanus' ? 'selected' : ''}>${t('medical.vaccinations.vaccineTypes.tetanus')}</option>
          <option value="tuberculosis" ${item.vaccine_type === 'tuberculosis' ? 'selected' : ''}>${t('medical.vaccinations.vaccineTypes.tuberculosis')}</option>
          <option value="other" ${item.vaccine_type === 'other' ? 'selected' : ''}>${t('medical.vaccinations.vaccineTypes.other')}</option>
        </select>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.vaccinations.vaccinationDate')}</label>
        <input id="swal-vaccination-date" class="form-control" type="date" value="${item.vaccination_date || ''}">
      </div>
      <div class="row mb-3">
        <div class="col-6 text-start">
          <label class="form-label">${t('medical.vaccinations.doseNumber')}</label>
          <input id="swal-dose-number" class="form-control" type="number" min="1" value="${item.dose_number || 1}">
        </div>
        <div class="col-6 text-start">
          <label class="form-label">${t('medical.vaccinations.nextDoseDate')}</label>
          <input id="swal-next-dose-date" class="form-control" type="date" value="${item.next_dose_date || ''}">
        </div>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.vaccinations.manufacturer')}</label>
        <input id="swal-manufacturer" class="form-control" type="text" value="${item.manufacturer || ''}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.vaccinations.lotNumber')}</label>
        <input id="swal-lot-number" class="form-control" type="text" value="${item.lot_number || ''}">
      </div>
      <div class="mb-3 text-start">
        <div class="form-check">
          <input id="swal-series-complete" class="form-check-input" type="checkbox" ${item.series_complete ? 'checked' : ''}>
          <label class="form-check-label" for="swal-series-complete">${t('medical.vaccinations.seriesIsComplete')}</label>
        </div>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.vaccinations.notes')}</label>
        <textarea id="swal-notes" class="form-control" rows="2">${item.notes || ''}</textarea>
      </div>
    `,
    width: '600px',
    showCancelButton: true,
    confirmButtonText: t('common.save'),
    cancelButtonText: t('common.cancel'),
    preConfirm: () => {
      const vaccine_name = (document.getElementById('swal-vaccine-name') as HTMLInputElement).value;
      const vaccine_type = (document.getElementById('swal-vaccine-type') as HTMLSelectElement).value;
      const vaccination_date = (document.getElementById('swal-vaccination-date') as HTMLInputElement).value;
      const dose_number = (document.getElementById('swal-dose-number') as HTMLInputElement).value;
      const next_dose_date = (document.getElementById('swal-next-dose-date') as HTMLInputElement).value;
      const manufacturer = (document.getElementById('swal-manufacturer') as HTMLInputElement).value;
      const lot_number = (document.getElementById('swal-lot-number') as HTMLInputElement).value;
      const series_complete = (document.getElementById('swal-series-complete') as HTMLInputElement).checked;
      const notes = (document.getElementById('swal-notes') as HTMLTextAreaElement).value;

      if (!vaccine_name || !vaccination_date) {
        Swal.showValidationMessage(t('medical.vaccinations.requiredFields'));
        return false;
      }

      return { vaccine_name, vaccine_type, vaccination_date, dose_number, next_dose_date, manufacturer, lot_number, series_complete, notes };
    },
  });

  if (formData) {
    try {
      await ApiService.put(`/inmate-vaccinations/${item.id}`, formData);
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.vaccinations.editSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error updating vaccination:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.vaccinations.editError'),
      });
    }
  }
};

const viewItem = async (item: any) => {
  const overdueHtml = isOverdue(item)
    ? `<p><span class="badge badge-light-danger">${t('medical.vaccinations.overdue')}</span></p>`
    : '';

  await Swal.fire({
    title: t('medical.vaccinations.detailTitle'),
    html: `
      <div class="text-start">
        ${overdueHtml}
        <p><strong>${t('medical.vaccinations.inmate')}:</strong> ${item.inmate?.full_name || item.inmate_id}</p>
        <p><strong>${t('medical.vaccinations.vaccineName')}:</strong> ${item.vaccine_name || '-'}</p>
        <p><strong>${t('medical.vaccinations.vaccineType')}:</strong> ${item.vaccine_type || '-'}</p>
        <p><strong>${t('medical.vaccinations.vaccinationDate')}:</strong> ${formatDate(item.vaccination_date)}</p>
        <p><strong>${t('medical.vaccinations.doseNumber')}:</strong> ${item.dose_number || '-'}</p>
        <p><strong>${t('medical.vaccinations.nextDoseDate')}:</strong> ${formatDate(item.next_dose_date)}</p>
        <p><strong>${t('medical.vaccinations.seriesComplete')}:</strong> ${item.series_complete ? t('common.yes') : t('common.no')}</p>
        <p><strong>${t('medical.vaccinations.manufacturer')}:</strong> ${item.manufacturer || '-'}</p>
        <p><strong>${t('medical.vaccinations.lotNumber')}:</strong> ${item.lot_number || '-'}</p>
        <p><strong>${t('medical.vaccinations.notes')}:</strong> ${item.notes || '-'}</p>
      </div>
    `,
    width: '600px',
    confirmButtonText: t('common.close'),
  });
};

const deleteItem = async (item: any) => {
  const result = await Swal.fire({
    title: t('medical.vaccinations.deleteConfirmTitle'),
    text: t('medical.vaccinations.deleteConfirmText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: t('common.delete'),
    cancelButtonText: t('common.cancel'),
  });

  if (result.isConfirmed) {
    try {
      await ApiService.delete(`/inmate-vaccinations/${item.id}`);
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.vaccinations.deleteSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error deleting vaccination:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.vaccinations.deleteError'),
      });
    }
  }
};

// Lifecycle
onMounted(async () => {
  await loadItems();
});
</script>
