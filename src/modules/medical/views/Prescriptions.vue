<template>
  <ModuleListTemplate
    :title="t('medical.prescriptions.title')"
    :subtitle="t('medical.prescriptions.subtitle')"
    :items="items"
    :loading="loading"
    :total="total"
    :current-page="currentPage"
    :per-page="perPage"
    :show-create-button="true"
    :empty-state-text="t('medical.prescriptions.noData')"
    @search="handleSearch"
    @change-page="changePage"
    @create="showCreateModal"
  >
    <!-- Filters -->
    <template #filters>
      <div class="me-3">
        <select
          v-model="filterActive"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('medical.prescriptions.allStatuses') }}</option>
          <option value="true">{{ t('medical.prescriptions.active') }}</option>
          <option value="false">{{ t('medical.prescriptions.inactive') }}</option>
        </select>
      </div>
      <div class="me-3">
        <select
          v-model="filterControlled"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('medical.prescriptions.allSubstances') }}</option>
          <option value="true">{{ t('medical.prescriptions.controlled') }}</option>
          <option value="false">{{ t('medical.prescriptions.notControlled') }}</option>
        </select>
      </div>
    </template>

    <!-- Table headers -->
    <template #table-headers>
      <th class="min-w-150px">{{ t('medical.prescriptions.inmate') }}</th>
      <th class="min-w-120px">{{ t('medical.prescriptions.medicationName') }}</th>
      <th class="min-w-100px">{{ t('medical.prescriptions.genericName') }}</th>
      <th class="min-w-80px">{{ t('medical.prescriptions.dosage') }}</th>
      <th class="min-w-80px">{{ t('medical.prescriptions.frequency') }}</th>
      <th class="min-w-100px">{{ t('medical.prescriptions.administrationRoute') }}</th>
      <th class="min-w-90px">{{ t('medical.prescriptions.startDate') }}</th>
      <th class="min-w-90px">{{ t('medical.prescriptions.endDate') }}</th>
      <th class="min-w-80px">{{ t('medical.prescriptions.controlledSubstance') }}</th>
      <th class="min-w-60px">{{ t('medical.prescriptions.status') }}</th>
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
          <span class="text-gray-900 fw-bold d-block fs-6">{{ item.medication_name }}</span>
        </td>
        <td>
          <span class="text-gray-900 d-block fs-7">{{ item.generic_name || '-' }}</span>
        </td>
        <td>
          <span class="text-gray-900 d-block fs-7">{{ item.dosage }}</span>
        </td>
        <td>
          <span class="text-gray-900 d-block fs-7">{{ item.frequency }}</span>
        </td>
        <td>
          <span class="text-gray-900 d-block fs-7">{{ item.administration_route || '-' }}</span>
        </td>
        <td>
          <span class="text-gray-900 fw-bold d-block fs-6">{{ formatDate(item.start_date) }}</span>
        </td>
        <td>
          <span class="text-gray-900 fw-bold d-block fs-6">{{ formatDate(item.end_date) }}</span>
        </td>
        <td>
          <span
            v-if="item.controlled_substance"
            class="badge badge-light-danger"
          >
            {{ t('medical.prescriptions.controlled') }}
          </span>
          <span v-else class="text-muted fs-7">-</span>
        </td>
        <td>
          <span
            class="badge"
            :class="item.is_active ? 'badge-light-success' : 'badge-light-secondary'"
          >
            {{ item.is_active ? t('medical.prescriptions.active') : t('medical.prescriptions.inactive') }}
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
              v-if="item.is_active"
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1"
              @click.prevent="discontinueItem(item)"
              :title="t('medical.prescriptions.discontinue')"
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
const filterActive = ref('');
const filterControlled = ref('');
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);

// Load data
const loadItems = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get('/inmate-medications', {
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        search: searchQuery.value,
        is_active: filterActive.value,
        controlled_substance: filterControlled.value,
      },
    });
    items.value = response.data.data;
    total.value = response.data.total;
  } catch (error) {
    console.error('Error loading prescriptions:', error);
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: t('medical.prescriptions.loadError'),
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
    title: t('medical.prescriptions.createTitle'),
    html: `
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.prescriptions.inmateId')}</label>
        <input id="swal-inmate-id" class="form-control" type="number" placeholder="${t('medical.prescriptions.inmateIdPlaceholder')}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.prescriptions.medicationName')}</label>
        <input id="swal-medication-name" class="form-control" type="text">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.prescriptions.genericName')}</label>
        <input id="swal-generic-name" class="form-control" type="text">
      </div>
      <div class="row mb-3">
        <div class="col-6 text-start">
          <label class="form-label">${t('medical.prescriptions.dosage')}</label>
          <input id="swal-dosage" class="form-control" type="text" placeholder="${t('medical.prescriptions.dosagePlaceholder')}">
        </div>
        <div class="col-6 text-start">
          <label class="form-label">${t('medical.prescriptions.frequency')}</label>
          <input id="swal-frequency" class="form-control" type="text" placeholder="${t('medical.prescriptions.frequencyPlaceholder')}">
        </div>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.prescriptions.administrationRoute')}</label>
        <select id="swal-route" class="form-select">
          <option value="oral">${t('medical.prescriptions.routes.oral')}</option>
          <option value="intravenous">${t('medical.prescriptions.routes.intravenous')}</option>
          <option value="intramuscular">${t('medical.prescriptions.routes.intramuscular')}</option>
          <option value="subcutaneous">${t('medical.prescriptions.routes.subcutaneous')}</option>
          <option value="topical">${t('medical.prescriptions.routes.topical')}</option>
          <option value="inhalation">${t('medical.prescriptions.routes.inhalation')}</option>
          <option value="rectal">${t('medical.prescriptions.routes.rectal')}</option>
          <option value="ophthalmic">${t('medical.prescriptions.routes.ophthalmic')}</option>
        </select>
      </div>
      <div class="row mb-3">
        <div class="col-6 text-start">
          <label class="form-label">${t('medical.prescriptions.startDate')}</label>
          <input id="swal-start-date" class="form-control" type="date">
        </div>
        <div class="col-6 text-start">
          <label class="form-label">${t('medical.prescriptions.endDate')}</label>
          <input id="swal-end-date" class="form-control" type="date">
        </div>
      </div>
      <div class="mb-3 text-start">
        <div class="form-check">
          <input id="swal-controlled" class="form-check-input" type="checkbox">
          <label class="form-check-label" for="swal-controlled">${t('medical.prescriptions.isControlled')}</label>
        </div>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.prescriptions.notes')}</label>
        <textarea id="swal-notes" class="form-control" rows="3"></textarea>
      </div>
    `,
    width: '600px',
    showCancelButton: true,
    confirmButtonText: t('common.save'),
    cancelButtonText: t('common.cancel'),
    preConfirm: () => {
      const inmate_id = (document.getElementById('swal-inmate-id') as HTMLInputElement).value;
      const medication_name = (document.getElementById('swal-medication-name') as HTMLInputElement).value;
      const generic_name = (document.getElementById('swal-generic-name') as HTMLInputElement).value;
      const dosage = (document.getElementById('swal-dosage') as HTMLInputElement).value;
      const frequency = (document.getElementById('swal-frequency') as HTMLInputElement).value;
      const administration_route = (document.getElementById('swal-route') as HTMLSelectElement).value;
      const start_date = (document.getElementById('swal-start-date') as HTMLInputElement).value;
      const end_date = (document.getElementById('swal-end-date') as HTMLInputElement).value;
      const controlled_substance = (document.getElementById('swal-controlled') as HTMLInputElement).checked;
      const notes = (document.getElementById('swal-notes') as HTMLTextAreaElement).value;

      if (!inmate_id || !medication_name || !dosage || !start_date) {
        Swal.showValidationMessage(t('medical.prescriptions.requiredFields'));
        return false;
      }

      return { inmate_id, medication_name, generic_name, dosage, frequency, administration_route, start_date, end_date, controlled_substance, notes };
    },
  });

  if (formData) {
    try {
      await ApiService.post('/inmate-medications', formData);
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.prescriptions.createSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error creating prescription:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.prescriptions.createError'),
      });
    }
  }
};

const showEditModal = async (item: any) => {
  const { value: formData } = await Swal.fire({
    title: t('medical.prescriptions.editTitle'),
    html: `
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.prescriptions.medicationName')}</label>
        <input id="swal-medication-name" class="form-control" type="text" value="${item.medication_name || ''}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.prescriptions.genericName')}</label>
        <input id="swal-generic-name" class="form-control" type="text" value="${item.generic_name || ''}">
      </div>
      <div class="row mb-3">
        <div class="col-6 text-start">
          <label class="form-label">${t('medical.prescriptions.dosage')}</label>
          <input id="swal-dosage" class="form-control" type="text" value="${item.dosage || ''}">
        </div>
        <div class="col-6 text-start">
          <label class="form-label">${t('medical.prescriptions.frequency')}</label>
          <input id="swal-frequency" class="form-control" type="text" value="${item.frequency || ''}">
        </div>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.prescriptions.administrationRoute')}</label>
        <select id="swal-route" class="form-select">
          <option value="oral" ${item.administration_route === 'oral' ? 'selected' : ''}>${t('medical.prescriptions.routes.oral')}</option>
          <option value="intravenous" ${item.administration_route === 'intravenous' ? 'selected' : ''}>${t('medical.prescriptions.routes.intravenous')}</option>
          <option value="intramuscular" ${item.administration_route === 'intramuscular' ? 'selected' : ''}>${t('medical.prescriptions.routes.intramuscular')}</option>
          <option value="subcutaneous" ${item.administration_route === 'subcutaneous' ? 'selected' : ''}>${t('medical.prescriptions.routes.subcutaneous')}</option>
          <option value="topical" ${item.administration_route === 'topical' ? 'selected' : ''}>${t('medical.prescriptions.routes.topical')}</option>
          <option value="inhalation" ${item.administration_route === 'inhalation' ? 'selected' : ''}>${t('medical.prescriptions.routes.inhalation')}</option>
          <option value="rectal" ${item.administration_route === 'rectal' ? 'selected' : ''}>${t('medical.prescriptions.routes.rectal')}</option>
          <option value="ophthalmic" ${item.administration_route === 'ophthalmic' ? 'selected' : ''}>${t('medical.prescriptions.routes.ophthalmic')}</option>
        </select>
      </div>
      <div class="row mb-3">
        <div class="col-6 text-start">
          <label class="form-label">${t('medical.prescriptions.startDate')}</label>
          <input id="swal-start-date" class="form-control" type="date" value="${item.start_date || ''}">
        </div>
        <div class="col-6 text-start">
          <label class="form-label">${t('medical.prescriptions.endDate')}</label>
          <input id="swal-end-date" class="form-control" type="date" value="${item.end_date || ''}">
        </div>
      </div>
      <div class="mb-3 text-start">
        <div class="form-check">
          <input id="swal-controlled" class="form-check-input" type="checkbox" ${item.controlled_substance ? 'checked' : ''}>
          <label class="form-check-label" for="swal-controlled">${t('medical.prescriptions.isControlled')}</label>
        </div>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.prescriptions.notes')}</label>
        <textarea id="swal-notes" class="form-control" rows="3">${item.notes || ''}</textarea>
      </div>
    `,
    width: '600px',
    showCancelButton: true,
    confirmButtonText: t('common.save'),
    cancelButtonText: t('common.cancel'),
    preConfirm: () => {
      const medication_name = (document.getElementById('swal-medication-name') as HTMLInputElement).value;
      const generic_name = (document.getElementById('swal-generic-name') as HTMLInputElement).value;
      const dosage = (document.getElementById('swal-dosage') as HTMLInputElement).value;
      const frequency = (document.getElementById('swal-frequency') as HTMLInputElement).value;
      const administration_route = (document.getElementById('swal-route') as HTMLSelectElement).value;
      const start_date = (document.getElementById('swal-start-date') as HTMLInputElement).value;
      const end_date = (document.getElementById('swal-end-date') as HTMLInputElement).value;
      const controlled_substance = (document.getElementById('swal-controlled') as HTMLInputElement).checked;
      const notes = (document.getElementById('swal-notes') as HTMLTextAreaElement).value;

      if (!medication_name || !dosage || !start_date) {
        Swal.showValidationMessage(t('medical.prescriptions.requiredFields'));
        return false;
      }

      return { medication_name, generic_name, dosage, frequency, administration_route, start_date, end_date, controlled_substance, notes };
    },
  });

  if (formData) {
    try {
      await ApiService.put(`/inmate-medications/${item.id}`, formData);
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.prescriptions.editSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error updating prescription:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.prescriptions.editError'),
      });
    }
  }
};

const viewItem = async (item: any) => {
  await Swal.fire({
    title: t('medical.prescriptions.detailTitle'),
    html: `
      <div class="text-start">
        <p><strong>${t('medical.prescriptions.inmate')}:</strong> ${item.inmate?.full_name || item.inmate_id}</p>
        <p><strong>${t('medical.prescriptions.medicationName')}:</strong> ${item.medication_name || '-'}</p>
        <p><strong>${t('medical.prescriptions.genericName')}:</strong> ${item.generic_name || '-'}</p>
        <p><strong>${t('medical.prescriptions.dosage')}:</strong> ${item.dosage || '-'}</p>
        <p><strong>${t('medical.prescriptions.frequency')}:</strong> ${item.frequency || '-'}</p>
        <p><strong>${t('medical.prescriptions.administrationRoute')}:</strong> ${item.administration_route || '-'}</p>
        <p><strong>${t('medical.prescriptions.startDate')}:</strong> ${formatDate(item.start_date)}</p>
        <p><strong>${t('medical.prescriptions.endDate')}:</strong> ${formatDate(item.end_date)}</p>
        <p><strong>${t('medical.prescriptions.controlledSubstance')}:</strong> ${item.controlled_substance ? t('common.yes') : t('common.no')}</p>
        <p><strong>${t('medical.prescriptions.status')}:</strong> ${item.is_active ? t('medical.prescriptions.active') : t('medical.prescriptions.inactive')}</p>
        <p><strong>${t('medical.prescriptions.notes')}:</strong> ${item.notes || '-'}</p>
      </div>
    `,
    width: '600px',
    confirmButtonText: t('common.close'),
  });
};

const discontinueItem = async (item: any) => {
  const result = await Swal.fire({
    title: t('medical.prescriptions.discontinueTitle'),
    text: t('medical.prescriptions.discontinueConfirmText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: t('medical.prescriptions.discontinue'),
    cancelButtonText: t('common.cancel'),
  });

  if (result.isConfirmed) {
    try {
      await ApiService.post(`/inmate-medications/${item.id}/discontinue`, {});
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.prescriptions.discontinueSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error discontinuing prescription:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.prescriptions.discontinueError'),
      });
    }
  }
};

const deleteItem = async (item: any) => {
  const result = await Swal.fire({
    title: t('medical.prescriptions.deleteConfirmTitle'),
    text: t('medical.prescriptions.deleteConfirmText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: t('common.delete'),
    cancelButtonText: t('common.cancel'),
  });

  if (result.isConfirmed) {
    try {
      await ApiService.delete(`/inmate-medications/${item.id}`);
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.prescriptions.deleteSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error deleting prescription:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.prescriptions.deleteError'),
      });
    }
  }
};

// Lifecycle
onMounted(async () => {
  await loadItems();
});
</script>
