<template>
  <ModuleListTemplate
    :title="t('rehabilitation.certificates.title')"
    :subtitle="t('rehabilitation.certificates.subtitle')"
    :items="items"
    :loading="loading"
    :total="total"
    :current-page="currentPage"
    :per-page="perPage"
    :show-create-button="true"
    :empty-state-text="t('rehabilitation.certificates.noData')"
    @search="handleSearch"
    @change-page="changePage"
    @create="showCreateModal"
  >
    <!-- Filters -->
    <template #filters>
      <div class="me-3">
        <select
          v-model="selectedDelivery"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('rehabilitation.filters.all') }}</option>
          <option value="true">{{ t('rehabilitation.certificates.deliveredStatus.yes') }}</option>
          <option value="false">{{ t('rehabilitation.certificates.deliveredStatus.no') }}</option>
        </select>
      </div>
      <div class="me-3">
        <select
          v-model="selectedValidity"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('rehabilitation.filters.all') }}</option>
          <option value="true">{{ t('rehabilitation.certificates.fields.hasExternalValidity') }}</option>
        </select>
      </div>
    </template>

    <!-- Table headers -->
    <template #table-headers>
      <th class="min-w-120px">{{ t('rehabilitation.certificates.columns.certificateNumber') }}</th>
      <th class="min-w-180px">{{ t('rehabilitation.certificates.columns.inmate') }}</th>
      <th class="min-w-150px">{{ t('rehabilitation.certificates.columns.program') }}</th>
      <th class="min-w-100px">{{ t('rehabilitation.certificates.columns.issueDate') }}</th>
      <th class="min-w-80px">{{ t('rehabilitation.certificates.columns.grade') }}</th>
      <th class="min-w-100px">{{ t('rehabilitation.certificates.columns.gradeCategory') }}</th>
      <th class="min-w-100px">{{ t('rehabilitation.certificates.columns.delivered') }}</th>
      <th class="min-w-100px">{{ t('rehabilitation.certificates.columns.deliveryDate') }}</th>
      <th class="min-w-120px text-end">{{ t('common.actions.title') }}</th>
    </template>

    <!-- Table body -->
    <template #table-body="{ items }">
      <tr v-for="item in items" :key="item.id">
        <td>
          <span class="text-gray-900 fw-bold d-block fs-6">{{ item.certificate_number }}</span>
        </td>
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
          <span class="text-gray-900 fs-6">{{ formatDate(item.issue_date) }}</span>
        </td>
        <td>
          <span class="text-gray-900 fw-bold fs-6">{{ item.final_grade || '-' }}</span>
        </td>
        <td>
          <span class="badge" :class="getGradeCategoryBadge(item.grade_category)">
            {{ getGradeCategoryLabel(item.grade_category) }}
          </span>
        </td>
        <td>
          <span
            class="badge"
            :class="item.delivered_to_inmate ? 'badge-light-success' : 'badge-light-warning'"
          >
            {{ item.delivered_to_inmate ? t('rehabilitation.certificates.deliveredStatus.yes') : t('rehabilitation.certificates.deliveredStatus.no') }}
          </span>
        </td>
        <td>
          <span class="text-gray-900 fs-6">{{ formatDate(item.delivery_date) }}</span>
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
              v-if="!item.delivered_to_inmate"
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1"
              @click.prevent="showDeliverModal(item)"
              :title="t('rehabilitation.certificates.swal.markDeliveredSuccess')"
            >
              <KTIcon icon-name="check-circle" icon-class="fs-3" />
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
  <div class="modal fade" id="certificateModal" tabindex="-1" ref="modalRef">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ editingItem ? t('rehabilitation.actions.edit') : t('rehabilitation.actions.create') }} {{ t('rehabilitation.certificates.singular') }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="row g-4">
            <div class="col-md-6">
              <label class="form-label required">{{ t('rehabilitation.certificates.fields.certificateNumber') }}</label>
              <input v-model="form.certificate_number" type="text" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label required">{{ t('rehabilitation.certificates.fields.inmate') }}</label>
              <input v-model="form.inmate_id" type="number" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label required">{{ t('rehabilitation.certificates.fields.program') }}</label>
              <select v-model="form.program_id" class="form-select">
                <option value="">{{ t('rehabilitation.filters.byProgram') }}</option>
                <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label required">{{ t('rehabilitation.certificates.fields.issueDate') }}</label>
              <input v-model="form.issue_date" type="date" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">{{ t('rehabilitation.certificates.fields.grade') }}</label>
              <input v-model="form.final_grade" type="number" min="0" max="100" step="0.1" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">{{ t('rehabilitation.certificates.columns.gradeCategory') }}</label>
              <select v-model="form.grade_category" class="form-select">
                <option value="">{{ t('rehabilitation.filters.all') }}</option>
                <option value="high_distinction">{{ getGradeCategoryLabel('high_distinction') }}</option>
                <option value="distinction">{{ getGradeCategoryLabel('distinction') }}</option>
                <option value="merit">{{ getGradeCategoryLabel('merit') }}</option>
                <option value="pass">{{ getGradeCategoryLabel('pass') }}</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-check-label">
                <input v-model="form.has_external_validity" type="checkbox" class="form-check-input me-2" />
                {{ t('rehabilitation.certificates.fields.hasExternalValidity') }}
              </label>
            </div>
            <div class="col-md-12">
              <label class="form-label">{{ t('rehabilitation.certificates.fields.observations') }}</label>
              <textarea v-model="form.notes" class="form-control" rows="3"></textarea>
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

  <!-- Deliver Modal -->
  <div class="modal fade" id="deliverModal" tabindex="-1" ref="deliverModalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ t('rehabilitation.certificates.swal.markDeliveredSuccess') }}</h5>
          <button type="button" class="btn-close" @click="closeDeliverModal"></button>
        </div>
        <div class="modal-body">
          <div>
            <label class="form-label">{{ t('rehabilitation.certificates.fields.observations') }}</label>
            <textarea v-model="deliverForm.notes" class="form-control" rows="3"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="closeDeliverModal">{{ t('rehabilitation.actions.cancel') }}</button>
          <button type="button" class="btn btn-success" @click="deliverCertificate" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
            {{ t('rehabilitation.certificates.swal.markDeliveredSuccess') }}
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
const selectedDelivery = ref('');
const selectedValidity = ref('');
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);
const editingItem = ref<any>(null);
const modalRef = ref<HTMLElement | null>(null);
const deliverModalRef = ref<HTMLElement | null>(null);
let modalInstance: Modal | null = null;
let deliverModalInstance: Modal | null = null;

const form = ref({
  certificate_number: '', inmate_id: '', program_id: '', issue_date: '',
  final_grade: '', grade_category: '', has_external_validity: false, notes: '',
});

const deliverForm = ref({ notes: '' });

// API
const loadItems = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get('/program-certificates', {
      params: {
        page: currentPage.value, per_page: perPage.value, search: searchQuery.value,
        delivered_to_inmate: selectedDelivery.value, has_external_validity: selectedValidity.value,
      },
    });
    items.value = response.data.data;
    total.value = response.data.total;
  } catch (error) {
    console.error('Error loading certificates:', error);
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

const getGradeCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    high_distinction: t('rehabilitation.certificates.gradeCategory.high_distinction'),
    distinction: t('rehabilitation.certificates.gradeCategory.distinction'),
    merit: t('rehabilitation.certificates.gradeCategory.merit'),
    pass: t('rehabilitation.certificates.gradeCategory.pass'),
  };
  return labels[category] || category || '-';
};

const getGradeCategoryBadge = (category: string) => {
  const classes: Record<string, string> = {
    high_distinction: 'badge-light-success',
    distinction: 'badge-light-primary',
    merit: 'badge-light-info',
    pass: 'badge-light-secondary',
  };
  return classes[category] || 'badge-light-secondary';
};

// Modal methods
const showCreateModal = () => {
  editingItem.value = null;
  form.value = { certificate_number: '', inmate_id: '', program_id: '', issue_date: '', final_grade: '', grade_category: '', has_external_validity: false, notes: '' };
  if (modalRef.value) { modalInstance = new Modal(modalRef.value); modalInstance.show(); }
};

const showEditModal = (item: any) => {
  editingItem.value = item;
  form.value = {
    certificate_number: item.certificate_number || '',
    inmate_id: item.inmate_id || '',
    program_id: item.program_id || '',
    issue_date: item.issue_date || '',
    final_grade: item.final_grade || '',
    grade_category: item.grade_category || '',
    has_external_validity: item.has_external_validity || false,
    notes: item.notes || '',
  };
  if (modalRef.value) { modalInstance = new Modal(modalRef.value); modalInstance.show(); }
};

const closeModal = () => { modalInstance?.hide(); };

const viewItem = (item: any) => {
  Swal.fire({
    title: item.certificate_number,
    html: `
      <div class="text-start">
        <p><strong>${t('rehabilitation.certificates.columns.inmate')}:</strong> ${item.inmate?.first_name || ''} ${item.inmate?.last_name || ''}</p>
        <p><strong>${t('rehabilitation.certificates.columns.program')}:</strong> ${item.program?.name || '-'}</p>
        <p><strong>${t('rehabilitation.certificates.columns.issueDate')}:</strong> ${formatDate(item.issue_date)}</p>
        <p><strong>${t('rehabilitation.certificates.columns.grade')}:</strong> ${item.final_grade || '-'}</p>
        <p><strong>${t('rehabilitation.certificates.columns.gradeCategory')}:</strong> ${getGradeCategoryLabel(item.grade_category)}</p>
        <p><strong>${t('rehabilitation.certificates.columns.delivered')}:</strong> ${item.delivered_to_inmate ? t('rehabilitation.certificates.deliveredStatus.yes') : t('rehabilitation.certificates.deliveredStatus.no')}</p>
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
      await ApiService.put(`/program-certificates/${editingItem.value.id}`, form.value);
      Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.swal.updateSuccess'), timer: 2000, showConfirmButton: false });
    } else {
      await ApiService.post('/program-certificates', form.value);
      Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.certificates.swal.generateSuccess'), timer: 2000, showConfirmButton: false });
    }
    closeModal();
    loadItems();
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: t('common.error'), text: error?.response?.data?.message || t('rehabilitation.certificates.swal.generateError') });
  } finally {
    saving.value = false;
  }
};

const deleteItem = async (item: any) => {
  const result = await Swal.fire({
    title: t('rehabilitation.certificates.swal.deleteConfirmTitle'),
    text: t('rehabilitation.certificates.swal.deleteConfirmText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('rehabilitation.swal.deleteConfirmButton'),
    cancelButtonText: t('rehabilitation.swal.deleteCancelButton'),
  });
  if (result.isConfirmed) {
    try {
      await ApiService.delete(`/program-certificates/${item.id}`);
      Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.certificates.swal.deleteSuccess'), timer: 2000, showConfirmButton: false });
      loadItems();
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: t('common.error'), text: error?.response?.data?.message || t('rehabilitation.certificates.swal.deleteError') });
    }
  }
};

const showDeliverModal = (item: any) => {
  editingItem.value = item;
  deliverForm.value = { notes: '' };
  if (deliverModalRef.value) { deliverModalInstance = new Modal(deliverModalRef.value); deliverModalInstance.show(); }
};

const closeDeliverModal = () => { deliverModalInstance?.hide(); };

const deliverCertificate = async () => {
  if (!editingItem.value) return;
  saving.value = true;
  try {
    await ApiService.post(`/program-certificates/${editingItem.value.id}/deliver`, deliverForm.value);
    Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.certificates.swal.markDeliveredSuccess'), timer: 2000, showConfirmButton: false });
    closeDeliverModal();
    loadItems();
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: t('common.error'), text: error?.response?.data?.message || t('rehabilitation.certificates.swal.markDeliveredError') });
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  await Promise.all([loadItems(), loadPrograms()]);
});
</script>
