<template>
  <ModuleListTemplate
    :title="t('rehabilitation.work.attendance.title')"
    :subtitle="t('rehabilitation.work.attendance.subtitle')"
    :items="items"
    :loading="loading"
    :total="total"
    :current-page="currentPage"
    :per-page="perPage"
    :show-create-button="false"
    :empty-state-text="t('rehabilitation.work.attendance.noData')"
    @search="handleSearch"
    @change-page="changePage"
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
      <th class="min-w-120px">{{ t('rehabilitation.work.attendance.columns.session') }}</th>
      <th class="min-w-100px">{{ t('rehabilitation.work.attendance.columns.date') }}</th>
      <th class="min-w-150px">{{ t('rehabilitation.work.attendance.columns.program') }}</th>
      <th class="min-w-80px">{{ t('rehabilitation.work.attendance.columns.presentCount') }}</th>
      <th class="min-w-80px">{{ t('rehabilitation.work.attendance.columns.absentCount') }}</th>
      <th class="min-w-120px">{{ t('rehabilitation.work.attendance.columns.attendanceRate') }}</th>
      <th class="min-w-100px text-end">{{ t('common.actions.title') }}</th>
    </template>

    <!-- Table body -->
    <template #table-body="{ items }">
      <tr v-for="item in items" :key="item.id">
        <td>
          <span class="text-gray-900 fw-bold d-block fs-6">#{{ item.session_number }}</span>
          <span class="text-muted fw-semibold d-block fs-7">{{ item.session_title || '' }}</span>
        </td>
        <td>
          <span class="text-gray-900 fs-6">{{ formatDate(item.session_date) }}</span>
        </td>
        <td>
          <span class="text-gray-900 fs-6">{{ item.program?.name || '-' }}</span>
        </td>
        <td>
          <span class="text-gray-900 fw-bold fs-6 text-success">{{ item.present_count || 0 }}</span>
        </td>
        <td>
          <span class="text-gray-900 fw-bold fs-6 text-danger">{{ item.absent_count || 0 }}</span>
        </td>
        <td>
          <div class="d-flex align-items-center">
            <div class="progress w-50 me-2" style="height: 6px;">
              <div
                class="progress-bar"
                :class="getAttendanceBarClass(item.attendance_rate)"
                :style="{ width: (item.attendance_rate || 0) + '%' }"
              ></div>
            </div>
            <span class="text-gray-900 fw-bold fs-7">{{ item.attendance_rate || 0 }}%</span>
          </div>
        </td>
        <td>
          <div class="d-flex justify-content-end flex-shrink-0">
            <a
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-info btn-sm"
              @click.prevent="showAttendanceModal(item)"
              :title="t('rehabilitation.work.attendance.swal.saveSuccess')"
            >
              <KTIcon icon-name="people" icon-class="fs-3" />
            </a>
          </div>
        </td>
      </tr>
    </template>
  </ModuleListTemplate>

  <!-- Attendance Modal -->
  <div class="modal fade" id="attendanceModal" tabindex="-1" ref="attendanceModalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ t('rehabilitation.work.attendance.swal.saveSuccess') }}</h5>
          <button type="button" class="btn-close" @click="closeAttendanceModal"></button>
        </div>
        <div class="modal-body">
          <div>
            <label class="form-label">{{ t('rehabilitation.work.attendance.fields.notes') }}</label>
            <textarea v-model="attendanceForm.notes" class="form-control" rows="3"></textarea>
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
const dateFrom = ref('');
const dateTo = ref('');
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);
const editingItem = ref<any>(null);
const attendanceModalRef = ref<HTMLElement | null>(null);
let attendanceModalInstance: Modal | null = null;

const attendanceForm = ref({ notes: '' });

// API
const loadItems = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get('/rehabilitation/sessions', {
      params: {
        page: currentPage.value, per_page: perPage.value, search: searchQuery.value,
        program_id: selectedProgram.value, date_from: dateFrom.value, date_to: dateTo.value,
        type: 'work',
      },
    });
    items.value = response.data.data;
    total.value = response.data.total;
  } catch (error) {
    console.error('Error loading work attendance:', error);
    Swal.fire({ icon: 'error', title: t('common.error'), text: t('rehabilitation.swal.loadError') });
  } finally {
    loading.value = false;
  }
};

const loadPrograms = async () => {
  try {
    const response = await ApiService.get('/rehabilitation/programs', { params: { per_page: 100, type: 'work' } });
    programs.value = response.data.data || response.data;
  } catch (error) { console.error('Error loading programs:', error); }
};

const handleSearch = (query: string) => { searchQuery.value = query; currentPage.value = 1; loadItems(); };
const handleFilter = () => { currentPage.value = 1; loadItems(); };
const changePage = (page: number) => { currentPage.value = page; loadItems(); };
const formatDate = (date: string) => date ? new Date(date).toLocaleDateString() : '-';

const getAttendanceBarClass = (pct: number) => {
  if (pct >= 80) return 'bg-success';
  if (pct >= 60) return 'bg-warning';
  return 'bg-danger';
};

// Modal
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
    Swal.fire({ icon: 'success', title: t('common.success'), text: t('rehabilitation.work.attendance.swal.saveSuccess'), timer: 2000, showConfirmButton: false });
    closeAttendanceModal();
    loadItems();
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: t('common.error'), text: error?.response?.data?.message || t('rehabilitation.work.attendance.swal.saveError') });
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  await Promise.all([loadItems(), loadPrograms()]);
});
</script>
