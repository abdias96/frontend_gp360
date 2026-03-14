<template>
  <ModuleListTemplate
    :title="t('medical.mentalHealth.title')"
    :subtitle="t('medical.mentalHealth.subtitle')"
    :items="items"
    :loading="loading"
    :total="total"
    :current-page="currentPage"
    :per-page="perPage"
    :show-create-button="true"
    :empty-state-text="t('medical.mentalHealth.noData')"
    @search="handleSearch"
    @change-page="changePage"
    @create="showCreateModal"
  >
    <!-- Filters -->
    <template #filters>
      <div class="me-3">
        <select
          v-model="filterEvaluationType"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('medical.mentalHealth.allEvaluationTypes') }}</option>
          <option value="initial">{{ t('medical.mentalHealth.evaluationTypes.initial') }}</option>
          <option value="follow_up">{{ t('medical.mentalHealth.evaluationTypes.follow_up') }}</option>
          <option value="crisis">{{ t('medical.mentalHealth.evaluationTypes.crisis') }}</option>
          <option value="routine">{{ t('medical.mentalHealth.evaluationTypes.routine') }}</option>
          <option value="discharge">{{ t('medical.mentalHealth.evaluationTypes.discharge') }}</option>
        </select>
      </div>
      <div class="me-3">
        <select
          v-model="filterSuicideRisk"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('medical.mentalHealth.allRiskLevels') }}</option>
          <option value="low">{{ t('medical.mentalHealth.riskLevels.low') }}</option>
          <option value="medium">{{ t('medical.mentalHealth.riskLevels.medium') }}</option>
          <option value="high">{{ t('medical.mentalHealth.riskLevels.high') }}</option>
          <option value="critical">{{ t('medical.mentalHealth.riskLevels.critical') }}</option>
        </select>
      </div>
      <div class="me-3">
        <select
          v-model="filterStatus"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('medical.mentalHealth.allStatuses') }}</option>
          <option value="pending">{{ t('medical.mentalHealth.statuses.pending') }}</option>
          <option value="in_progress">{{ t('medical.mentalHealth.statuses.in_progress') }}</option>
          <option value="completed">{{ t('medical.mentalHealth.statuses.completed') }}</option>
          <option value="cancelled">{{ t('medical.mentalHealth.statuses.cancelled') }}</option>
        </select>
      </div>
    </template>

    <!-- Table headers -->
    <template #table-headers>
      <th class="min-w-150px">{{ t('medical.mentalHealth.inmate') }}</th>
      <th class="min-w-100px">{{ t('medical.mentalHealth.evaluationDate') }}</th>
      <th class="min-w-100px">{{ t('medical.mentalHealth.evaluationType') }}</th>
      <th class="min-w-120px">{{ t('medical.mentalHealth.evaluatorName') }}</th>
      <th class="min-w-120px">{{ t('medical.mentalHealth.currentDiagnosis') }}</th>
      <th class="min-w-100px">{{ t('medical.mentalHealth.suicideRisk') }}</th>
      <th class="min-w-100px">{{ t('medical.mentalHealth.violenceRisk') }}</th>
      <th class="min-w-80px">{{ t('medical.mentalHealth.status') }}</th>
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
          <span class="text-gray-900 fw-bold d-block fs-6">{{ formatDate(item.evaluation_date) }}</span>
        </td>
        <td>
          <span class="text-gray-900 d-block fs-7">{{ getEvaluationTypeLabel(item.evaluation_type) }}</span>
        </td>
        <td>
          <span class="text-gray-900 fw-bold d-block fs-6">{{ item.evaluator_name || '-' }}</span>
        </td>
        <td>
          <span class="text-gray-900 d-block fs-7">{{ item.current_diagnosis || '-' }}</span>
        </td>
        <td>
          <span class="badge" :class="getRiskBadge(item.suicide_risk_level)">
            {{ getRiskLabel(item.suicide_risk_level) }}
          </span>
        </td>
        <td>
          <span class="badge" :class="getRiskBadge(item.violence_risk_level)">
            {{ getRiskLabel(item.violence_risk_level) }}
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
const filterEvaluationType = ref('');
const filterSuicideRisk = ref('');
const filterStatus = ref('');
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);

// Load data
const loadItems = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get('/inmate-mental-health-evaluations', {
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        search: searchQuery.value,
        evaluation_type: filterEvaluationType.value,
        suicide_risk_level: filterSuicideRisk.value,
        status: filterStatus.value,
      },
    });
    items.value = response.data.data;
    total.value = response.data.total;
  } catch (error) {
    console.error('Error loading mental health evaluations:', error);
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: t('medical.mentalHealth.loadError'),
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

const getEvaluationTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    initial: t('medical.mentalHealth.evaluationTypes.initial'),
    follow_up: t('medical.mentalHealth.evaluationTypes.follow_up'),
    crisis: t('medical.mentalHealth.evaluationTypes.crisis'),
    routine: t('medical.mentalHealth.evaluationTypes.routine'),
    discharge: t('medical.mentalHealth.evaluationTypes.discharge'),
  };
  return labels[type] || type;
};

const getRiskLabel = (level: string) => {
  const labels: Record<string, string> = {
    low: t('medical.mentalHealth.riskLevels.low'),
    medium: t('medical.mentalHealth.riskLevels.medium'),
    high: t('medical.mentalHealth.riskLevels.high'),
    critical: t('medical.mentalHealth.riskLevels.critical'),
  };
  return labels[level] || level || '-';
};

const getRiskBadge = (level: string) => {
  const badges: Record<string, string> = {
    low: 'badge-light-success',
    medium: 'badge-light-warning',
    high: 'badge-light-danger',
    critical: 'badge-danger',
  };
  return badges[level] || 'badge-light-secondary';
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: t('medical.mentalHealth.statuses.pending'),
    in_progress: t('medical.mentalHealth.statuses.in_progress'),
    completed: t('medical.mentalHealth.statuses.completed'),
    cancelled: t('medical.mentalHealth.statuses.cancelled'),
  };
  return labels[status] || status;
};

const getStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    pending: 'badge-light-info',
    in_progress: 'badge-light-warning',
    completed: 'badge-light-success',
    cancelled: 'badge-light-danger',
  };
  return badges[status] || 'badge-light-secondary';
};

// CRUD
const showCreateModal = async () => {
  const { value: formData } = await Swal.fire({
    title: t('medical.mentalHealth.createTitle'),
    html: `
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.mentalHealth.inmateId')}</label>
        <input id="swal-inmate-id" class="form-control" type="number" placeholder="${t('medical.mentalHealth.inmateIdPlaceholder')}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.mentalHealth.evaluationDate')}</label>
        <input id="swal-evaluation-date" class="form-control" type="datetime-local">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.mentalHealth.evaluationType')}</label>
        <select id="swal-evaluation-type" class="form-select">
          <option value="initial">${t('medical.mentalHealth.evaluationTypes.initial')}</option>
          <option value="follow_up">${t('medical.mentalHealth.evaluationTypes.follow_up')}</option>
          <option value="crisis">${t('medical.mentalHealth.evaluationTypes.crisis')}</option>
          <option value="routine">${t('medical.mentalHealth.evaluationTypes.routine')}</option>
          <option value="discharge">${t('medical.mentalHealth.evaluationTypes.discharge')}</option>
        </select>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.mentalHealth.evaluatorName')}</label>
        <input id="swal-evaluator-name" class="form-control" type="text">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.mentalHealth.currentDiagnosis')}</label>
        <input id="swal-diagnosis" class="form-control" type="text">
      </div>
      <div class="row mb-3">
        <div class="col-6 text-start">
          <label class="form-label">${t('medical.mentalHealth.suicideRisk')}</label>
          <select id="swal-suicide-risk" class="form-select">
            <option value="low">${t('medical.mentalHealth.riskLevels.low')}</option>
            <option value="medium">${t('medical.mentalHealth.riskLevels.medium')}</option>
            <option value="high">${t('medical.mentalHealth.riskLevels.high')}</option>
            <option value="critical">${t('medical.mentalHealth.riskLevels.critical')}</option>
          </select>
        </div>
        <div class="col-6 text-start">
          <label class="form-label">${t('medical.mentalHealth.violenceRisk')}</label>
          <select id="swal-violence-risk" class="form-select">
            <option value="low">${t('medical.mentalHealth.riskLevels.low')}</option>
            <option value="medium">${t('medical.mentalHealth.riskLevels.medium')}</option>
            <option value="high">${t('medical.mentalHealth.riskLevels.high')}</option>
            <option value="critical">${t('medical.mentalHealth.riskLevels.critical')}</option>
          </select>
        </div>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.mentalHealth.status')}</label>
        <select id="swal-status" class="form-select">
          <option value="pending">${t('medical.mentalHealth.statuses.pending')}</option>
          <option value="in_progress">${t('medical.mentalHealth.statuses.in_progress')}</option>
          <option value="completed">${t('medical.mentalHealth.statuses.completed')}</option>
        </select>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.mentalHealth.notes')}</label>
        <textarea id="swal-notes" class="form-control" rows="3"></textarea>
      </div>
    `,
    width: '600px',
    showCancelButton: true,
    confirmButtonText: t('common.save'),
    cancelButtonText: t('common.cancel'),
    preConfirm: () => {
      const inmate_id = (document.getElementById('swal-inmate-id') as HTMLInputElement).value;
      const evaluation_date = (document.getElementById('swal-evaluation-date') as HTMLInputElement).value;
      const evaluation_type = (document.getElementById('swal-evaluation-type') as HTMLSelectElement).value;
      const evaluator_name = (document.getElementById('swal-evaluator-name') as HTMLInputElement).value;
      const current_diagnosis = (document.getElementById('swal-diagnosis') as HTMLInputElement).value;
      const suicide_risk_level = (document.getElementById('swal-suicide-risk') as HTMLSelectElement).value;
      const violence_risk_level = (document.getElementById('swal-violence-risk') as HTMLSelectElement).value;
      const status = (document.getElementById('swal-status') as HTMLSelectElement).value;
      const notes = (document.getElementById('swal-notes') as HTMLTextAreaElement).value;

      if (!inmate_id || !evaluation_date || !evaluator_name) {
        Swal.showValidationMessage(t('medical.mentalHealth.requiredFields'));
        return false;
      }

      return { inmate_id, evaluation_date, evaluation_type, evaluator_name, current_diagnosis, suicide_risk_level, violence_risk_level, status, notes };
    },
  });

  if (formData) {
    try {
      await ApiService.post('/inmate-mental-health-evaluations', formData);
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.mentalHealth.createSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error creating evaluation:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.mentalHealth.createError'),
      });
    }
  }
};

const showEditModal = async (item: any) => {
  const { value: formData } = await Swal.fire({
    title: t('medical.mentalHealth.editTitle'),
    html: `
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.mentalHealth.evaluationDate')}</label>
        <input id="swal-evaluation-date" class="form-control" type="datetime-local" value="${item.evaluation_date || ''}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.mentalHealth.evaluationType')}</label>
        <select id="swal-evaluation-type" class="form-select">
          <option value="initial" ${item.evaluation_type === 'initial' ? 'selected' : ''}>${t('medical.mentalHealth.evaluationTypes.initial')}</option>
          <option value="follow_up" ${item.evaluation_type === 'follow_up' ? 'selected' : ''}>${t('medical.mentalHealth.evaluationTypes.follow_up')}</option>
          <option value="crisis" ${item.evaluation_type === 'crisis' ? 'selected' : ''}>${t('medical.mentalHealth.evaluationTypes.crisis')}</option>
          <option value="routine" ${item.evaluation_type === 'routine' ? 'selected' : ''}>${t('medical.mentalHealth.evaluationTypes.routine')}</option>
          <option value="discharge" ${item.evaluation_type === 'discharge' ? 'selected' : ''}>${t('medical.mentalHealth.evaluationTypes.discharge')}</option>
        </select>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.mentalHealth.evaluatorName')}</label>
        <input id="swal-evaluator-name" class="form-control" type="text" value="${item.evaluator_name || ''}">
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.mentalHealth.currentDiagnosis')}</label>
        <input id="swal-diagnosis" class="form-control" type="text" value="${item.current_diagnosis || ''}">
      </div>
      <div class="row mb-3">
        <div class="col-6 text-start">
          <label class="form-label">${t('medical.mentalHealth.suicideRisk')}</label>
          <select id="swal-suicide-risk" class="form-select">
            <option value="low" ${item.suicide_risk_level === 'low' ? 'selected' : ''}>${t('medical.mentalHealth.riskLevels.low')}</option>
            <option value="medium" ${item.suicide_risk_level === 'medium' ? 'selected' : ''}>${t('medical.mentalHealth.riskLevels.medium')}</option>
            <option value="high" ${item.suicide_risk_level === 'high' ? 'selected' : ''}>${t('medical.mentalHealth.riskLevels.high')}</option>
            <option value="critical" ${item.suicide_risk_level === 'critical' ? 'selected' : ''}>${t('medical.mentalHealth.riskLevels.critical')}</option>
          </select>
        </div>
        <div class="col-6 text-start">
          <label class="form-label">${t('medical.mentalHealth.violenceRisk')}</label>
          <select id="swal-violence-risk" class="form-select">
            <option value="low" ${item.violence_risk_level === 'low' ? 'selected' : ''}>${t('medical.mentalHealth.riskLevels.low')}</option>
            <option value="medium" ${item.violence_risk_level === 'medium' ? 'selected' : ''}>${t('medical.mentalHealth.riskLevels.medium')}</option>
            <option value="high" ${item.violence_risk_level === 'high' ? 'selected' : ''}>${t('medical.mentalHealth.riskLevels.high')}</option>
            <option value="critical" ${item.violence_risk_level === 'critical' ? 'selected' : ''}>${t('medical.mentalHealth.riskLevels.critical')}</option>
          </select>
        </div>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.mentalHealth.status')}</label>
        <select id="swal-status" class="form-select">
          <option value="pending" ${item.status === 'pending' ? 'selected' : ''}>${t('medical.mentalHealth.statuses.pending')}</option>
          <option value="in_progress" ${item.status === 'in_progress' ? 'selected' : ''}>${t('medical.mentalHealth.statuses.in_progress')}</option>
          <option value="completed" ${item.status === 'completed' ? 'selected' : ''}>${t('medical.mentalHealth.statuses.completed')}</option>
          <option value="cancelled" ${item.status === 'cancelled' ? 'selected' : ''}>${t('medical.mentalHealth.statuses.cancelled')}</option>
        </select>
      </div>
      <div class="mb-3 text-start">
        <label class="form-label">${t('medical.mentalHealth.notes')}</label>
        <textarea id="swal-notes" class="form-control" rows="3">${item.notes || ''}</textarea>
      </div>
    `,
    width: '600px',
    showCancelButton: true,
    confirmButtonText: t('common.save'),
    cancelButtonText: t('common.cancel'),
    preConfirm: () => {
      const evaluation_date = (document.getElementById('swal-evaluation-date') as HTMLInputElement).value;
      const evaluation_type = (document.getElementById('swal-evaluation-type') as HTMLSelectElement).value;
      const evaluator_name = (document.getElementById('swal-evaluator-name') as HTMLInputElement).value;
      const current_diagnosis = (document.getElementById('swal-diagnosis') as HTMLInputElement).value;
      const suicide_risk_level = (document.getElementById('swal-suicide-risk') as HTMLSelectElement).value;
      const violence_risk_level = (document.getElementById('swal-violence-risk') as HTMLSelectElement).value;
      const status = (document.getElementById('swal-status') as HTMLSelectElement).value;
      const notes = (document.getElementById('swal-notes') as HTMLTextAreaElement).value;

      if (!evaluation_date || !evaluator_name) {
        Swal.showValidationMessage(t('medical.mentalHealth.requiredFields'));
        return false;
      }

      return { evaluation_date, evaluation_type, evaluator_name, current_diagnosis, suicide_risk_level, violence_risk_level, status, notes };
    },
  });

  if (formData) {
    try {
      await ApiService.put(`/inmate-mental-health-evaluations/${item.id}`, formData);
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.mentalHealth.editSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error updating evaluation:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.mentalHealth.editError'),
      });
    }
  }
};

const viewItem = async (item: any) => {
  await Swal.fire({
    title: t('medical.mentalHealth.detailTitle'),
    html: `
      <div class="text-start">
        <p><strong>${t('medical.mentalHealth.inmate')}:</strong> ${item.inmate?.full_name || item.inmate_id}</p>
        <p><strong>${t('medical.mentalHealth.evaluationDate')}:</strong> ${formatDate(item.evaluation_date)}</p>
        <p><strong>${t('medical.mentalHealth.evaluationType')}:</strong> ${getEvaluationTypeLabel(item.evaluation_type)}</p>
        <p><strong>${t('medical.mentalHealth.evaluatorName')}:</strong> ${item.evaluator_name || '-'}</p>
        <p><strong>${t('medical.mentalHealth.currentDiagnosis')}:</strong> ${item.current_diagnosis || '-'}</p>
        <p><strong>${t('medical.mentalHealth.suicideRisk')}:</strong> ${getRiskLabel(item.suicide_risk_level)}</p>
        <p><strong>${t('medical.mentalHealth.violenceRisk')}:</strong> ${getRiskLabel(item.violence_risk_level)}</p>
        <p><strong>${t('medical.mentalHealth.status')}:</strong> ${getStatusLabel(item.status)}</p>
        <p><strong>${t('medical.mentalHealth.notes')}:</strong> ${item.notes || '-'}</p>
      </div>
    `,
    width: '600px',
    confirmButtonText: t('common.close'),
  });
};

const deleteItem = async (item: any) => {
  const result = await Swal.fire({
    title: t('medical.mentalHealth.deleteConfirmTitle'),
    text: t('medical.mentalHealth.deleteConfirmText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: t('common.delete'),
    cancelButtonText: t('common.cancel'),
  });

  if (result.isConfirmed) {
    try {
      await ApiService.delete(`/inmate-mental-health-evaluations/${item.id}`);
      Swal.fire({
        icon: 'success',
        title: t('common.success'),
        text: t('medical.mentalHealth.deleteSuccess'),
        timer: 2000,
        showConfirmButton: false,
      });
      loadItems();
    } catch (error) {
      console.error('Error deleting evaluation:', error);
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('medical.mentalHealth.deleteError'),
      });
    }
  }
};

// Lifecycle
onMounted(async () => {
  await loadItems();
});
</script>
