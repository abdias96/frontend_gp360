<template>
  <div>
    <!-- Header -->
    <div class="card mb-5">
      <div class="card-header border-0 pt-5">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label fw-bold fs-3 mb-1">{{ $t("legal.measures.title") }}</span>
          <span class="text-muted mt-1 fw-semibold fs-7">{{ $t("legal.measures.subtitle") }}</span>
        </h3>
        <div class="card-toolbar">
          <button type="button" class="btn btn-primary" @click="openCreateModal">
            <i class="bi bi-plus-lg me-1"></i> {{ $t("legal.measures.newMeasure") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="row g-5 mb-5">
      <div class="col-xl-2 col-md-4">
        <div class="card card-flush">
          <div class="card-body py-4">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-45px me-4">
                <span class="symbol-label bg-light-primary"><i class="bi bi-shield fs-2 text-primary"></i></span>
              </div>
              <div>
                <div class="fs-7 text-gray-400 fw-bold">{{ $t("legal.measures.total") }}</div>
                <div class="fs-2 fw-bold">{{ stats.total }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-2 col-md-4">
        <div class="card card-flush">
          <div class="card-body py-4">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-45px me-4">
                <span class="symbol-label bg-light-success"><i class="bi bi-check-circle fs-2 text-success"></i></span>
              </div>
              <div>
                <div class="fs-7 text-gray-400 fw-bold">{{ $t("legal.measures.active") }}</div>
                <div class="fs-2 fw-bold">{{ stats.active }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-2 col-md-4">
        <div class="card card-flush">
          <div class="card-body py-4">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-45px me-4">
                <span class="symbol-label bg-light-info"><i class="bi bi-check2-all fs-2 text-info"></i></span>
              </div>
              <div>
                <div class="fs-7 text-gray-400 fw-bold">{{ $t("legal.measures.completed") }}</div>
                <div class="fs-2 fw-bold">{{ stats.completed }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-2 col-md-4">
        <div class="card card-flush">
          <div class="card-body py-4">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-45px me-4">
                <span class="symbol-label bg-light-danger"><i class="bi bi-x-circle fs-2 text-danger"></i></span>
              </div>
              <div>
                <div class="fs-7 text-gray-400 fw-bold">{{ $t("legal.measures.revoked") }}</div>
                <div class="fs-2 fw-bold">{{ stats.revoked }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-2 col-md-4">
        <div class="card card-flush">
          <div class="card-body py-4">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-45px me-4">
                <span class="symbol-label bg-light-warning"><i class="bi bi-pause-circle fs-2 text-warning"></i></span>
              </div>
              <div>
                <div class="fs-7 text-gray-400 fw-bold">{{ $t("legal.measures.suspended") }}</div>
                <div class="fs-2 fw-bold">{{ stats.suspended }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-2 col-md-4">
        <div class="card card-flush">
          <div class="card-body py-4">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-45px me-4">
                <span class="symbol-label bg-light-dark"><i class="bi bi-clock-history fs-2 text-dark"></i></span>
              </div>
              <div>
                <div class="fs-7 text-gray-400 fw-bold">{{ $t("legal.measures.dueForReview") }}</div>
                <div class="fs-2 fw-bold">{{ stats.due_for_review }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters + Table -->
    <div class="card">
      <div class="card-header border-0 pt-5">
        <div class="d-flex align-items-center gap-3 flex-wrap">
          <input type="text" v-model="filters.search" @input="debouncedLoad" class="form-control form-control-solid w-250px" :placeholder="$t('legal.measures.search')" />
          <select v-model="filters.status" @change="loadMeasures" class="form-select form-select-solid w-175px">
            <option value="">{{ $t("legal.measures.allStatuses") }}</option>
            <option value="active">{{ $t("legal.measures.active") }}</option>
            <option value="completed">{{ $t("legal.measures.completed") }}</option>
            <option value="revoked">{{ $t("legal.measures.revoked") }}</option>
            <option value="suspended">{{ $t("legal.measures.suspended") }}</option>
          </select>
          <select v-model="filters.measure_type_id" @change="loadMeasures" class="form-select form-select-solid w-200px">
            <option value="">{{ $t("legal.measures.measureType") }}</option>
            <option v-for="mt in measureTypes" :key="mt.id" :value="mt.id">{{ mt.name }}</option>
          </select>
        </div>
      </div>
      <div class="card-body py-3">
        <div v-if="loading" class="text-center py-10">
          <div class="spinner-border" role="status"></div>
        </div>
        <div v-else-if="measures.length === 0" class="text-center py-10">
          <i class="bi bi-shield-x display-4 text-muted"></i>
          <h4 class="mt-3 text-muted">{{ $t("legal.measures.noMeasures") }}</h4>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-row-dashed table-row-gray-300 gy-5">
            <thead>
              <tr class="fw-semibold fs-6 text-gray-800">
                <th>{{ $t("legal.measures.measureNumber") }}</th>
                <th>{{ $t("legal.measures.inmate") }}</th>
                <th>{{ $t("legal.measures.measureType") }}</th>
                <th>{{ $t("legal.measures.startDate") }}</th>
                <th>{{ $t("legal.measures.endDate") }}</th>
                <th>{{ $t("legal.measures.orderingCourt") }}</th>
                <th>{{ $t("legal.measures.status") }}</th>
                <th class="text-end">{{ $t("common.actions.title") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in measures" :key="m.id">
                <td class="fw-bold">{{ m.measure_number }}</td>
                <td>
                  <span v-if="m.inmate">{{ m.inmate.first_name }} {{ m.inmate.last_name }}</span>
                </td>
                <td>{{ m.measure_type?.name || "—" }}</td>
                <td>{{ formatDate(m.start_date) }}</td>
                <td>{{ m.end_date ? formatDate(m.end_date) : "—" }}</td>
                <td>{{ m.ordering_court?.name || "—" }}</td>
                <td><span :class="statusBadge(m.status)">{{ $t(`legal.measures.${m.status}`) }}</span></td>
                <td class="text-end">
                  <button class="btn btn-icon btn-bg-light btn-sm me-1" @click="openEditModal(m)" :title="$t('common.edit')">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button v-if="m.status === 'active'" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1" @click="handleRevoke(m)">
                    <i class="bi bi-slash-circle"></i>
                  </button>
                  <button class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm" @click="handleDelete(m)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="totalPages > 1" class="d-flex justify-content-center mt-5">
          <ul class="pagination">
            <li v-for="p in totalPages" :key="p" class="page-item" :class="{ active: p === currentPage }">
              <button class="page-link" @click="goToPage(p)">{{ p }}</button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div class="modal fade" ref="modalRef" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingId ? $t("legal.measures.editMeasure") : $t("legal.measures.newMeasure") }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="row g-4">
              <div class="col-md-6">
                <label class="form-label required">{{ $t("legal.measures.inmate") }} (ID)</label>
                <input type="number" v-model="form.inmate_id" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label required">{{ $t("legal.measures.measureType") }}</label>
                <select v-model="form.measure_type_id" class="form-select">
                  <option value="">--</option>
                  <option v-for="mt in measureTypes" :key="mt.id" :value="mt.id">{{ mt.name }}</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label required">{{ $t("legal.measures.measureNumber") }}</label>
                <input type="text" v-model="form.measure_number" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label required">{{ $t("legal.measures.applicationDate") }}</label>
                <input type="date" v-model="form.application_date" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label required">{{ $t("legal.measures.startDate") }}</label>
                <input type="date" v-model="form.start_date" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">{{ $t("legal.measures.endDate") }}</label>
                <input type="date" v-model="form.end_date" class="form-control" />
              </div>
              <div class="col-12">
                <label class="form-label required">{{ $t("legal.measures.description") }}</label>
                <textarea v-model="form.description" class="form-control" rows="3"></textarea>
              </div>
              <div class="col-12">
                <label class="form-label">{{ $t("legal.measures.conditions") }}</label>
                <textarea v-model="form.conditions" class="form-control" rows="2"></textarea>
              </div>
              <div class="col-md-6">
                <label class="form-label required">{{ $t("legal.measures.courtOrderNumber") }}</label>
                <input type="text" v-model="form.court_order_number" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label required">{{ $t("legal.measures.orderingCourt") }}</label>
                <select v-model="form.ordering_court_id" class="form-select">
                  <option value="">--</option>
                  <option v-for="c in courts" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">{{ $t("legal.measures.orderingJudge") }}</label>
                <input type="text" v-model="form.ordering_judge" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">{{ $t("legal.measures.nextReviewDate") }}</label>
                <input type="date" v-model="form.next_review_date" class="form-control" />
              </div>
              <div v-if="editingId" class="col-md-6">
                <label class="form-label">{{ $t("legal.measures.status") }}</label>
                <select v-model="form.status" class="form-select">
                  <option value="active">{{ $t("legal.measures.active") }}</option>
                  <option value="completed">{{ $t("legal.measures.completed") }}</option>
                  <option value="suspended">{{ $t("legal.measures.suspended") }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="closeModal">{{ $t("common.cancel") }}</button>
            <button type="button" class="btn btn-primary" @click="handleSave" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
              {{ $t("common.save") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { Modal } from "bootstrap";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";

const { t } = useI18n();
const loading = ref(false);
const saving = ref(false);
const measures = ref<any[]>([]);
const measureTypes = ref<any[]>([]);
const courts = ref<any[]>([]);
const stats = ref({ total: 0, active: 0, completed: 0, revoked: 0, suspended: 0, due_for_review: 0 });
const filters = ref({ search: "", status: "", measure_type_id: "" });
const currentPage = ref(1);
const totalPages = ref(1);
const editingId = ref<number | null>(null);
const modalRef = ref<HTMLElement | null>(null);
let modalInstance: Modal | null = null;

const emptyForm = () => ({
  inmate_id: "", measure_type_id: "", measure_number: "", application_date: "",
  start_date: "", end_date: "", description: "", conditions: "",
  court_order_number: "", ordering_court_id: "", ordering_judge: "",
  next_review_date: "", status: "active",
});
const form = ref<any>(emptyForm());

let debounceTimer: any = null;
const debouncedLoad = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => loadMeasures(), 400);
};

const formatDate = (d: string) => d ? new Date(d + "T00:00:00").toLocaleDateString("es-GT") : "—";

const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    active: "badge badge-light-success", completed: "badge badge-light-info",
    revoked: "badge badge-light-danger", suspended: "badge badge-light-warning",
  };
  return map[s] || "badge badge-light";
};

const loadStats = async () => {
  try {
    const res = await ApiService.get("legal/measures/statistics");
    if (res.data.success) stats.value = res.data.data;
  } catch { /* ignore */ }
};

const loadMeasures = async () => {
  loading.value = true;
  try {
    const params: any = { page: currentPage.value, per_page: 15 };
    if (filters.value.search) params.search = filters.value.search;
    if (filters.value.status) params.status = filters.value.status;
    if (filters.value.measure_type_id) params.measure_type_id = filters.value.measure_type_id;
    const res = await ApiService.query("legal/measures", params);
    if (res.data.success) {
      measures.value = res.data.data.data || [];
      totalPages.value = res.data.data.last_page || 1;
      currentPage.value = res.data.data.current_page || 1;
    }
  } catch { /* ignore */ }
  loading.value = false;
};

const loadCatalogs = async () => {
  try {
    const [mtRes, cRes] = await Promise.all([
      ApiService.query("catalogs/measure-types", { simple: true }),
      ApiService.query("catalogs/courts", { simple: true }),
    ]);
    if (mtRes.data.success) measureTypes.value = mtRes.data.data || [];
    if (cRes.data.success) courts.value = cRes.data.data || [];
  } catch { /* ignore */ }
};

const goToPage = (p: number) => { currentPage.value = p; loadMeasures(); };

const openCreateModal = () => {
  editingId.value = null;
  form.value = emptyForm();
  if (!modalInstance && modalRef.value) modalInstance = new Modal(modalRef.value);
  modalInstance?.show();
};

const openEditModal = (m: any) => {
  editingId.value = m.id;
  form.value = {
    inmate_id: m.inmate_id, measure_type_id: m.measure_type_id, measure_number: m.measure_number,
    application_date: m.application_date?.split("T")[0] || "", start_date: m.start_date?.split("T")[0] || "",
    end_date: m.end_date?.split("T")[0] || "", description: m.description || "", conditions: m.conditions || "",
    court_order_number: m.court_order_number, ordering_court_id: m.ordering_court_id,
    ordering_judge: m.ordering_judge || "", next_review_date: m.next_review_date?.split("T")[0] || "",
    status: m.status,
  };
  if (!modalInstance && modalRef.value) modalInstance = new Modal(modalRef.value);
  modalInstance?.show();
};

const closeModal = () => modalInstance?.hide();

const handleSave = async () => {
  saving.value = true;
  try {
    if (editingId.value) {
      await ApiService.put(`legal/measures/${editingId.value}`, form.value);
    } else {
      await ApiService.post("legal/measures", form.value);
    }
    Swal.fire({ icon: "success", title: t("common.success"), timer: 1500, showConfirmButton: false });
    closeModal();
    loadMeasures();
    loadStats();
  } catch (e: any) {
    const errors = e?.response?.data?.errors;
    const msg = errors ? Object.values(errors).flat().join("\n") : e?.response?.data?.message || t("common.error");
    Swal.fire({ icon: "error", title: t("common.error"), text: msg });
  }
  saving.value = false;
};

const handleRevoke = async (m: any) => {
  const { value: reason } = await Swal.fire({
    title: t("legal.measures.confirmRevoke"),
    input: "textarea", inputLabel: t("legal.measures.revocationReason"),
    showCancelButton: true, confirmButtonText: t("common.confirm"), cancelButtonText: t("common.cancel"),
    inputValidator: (v) => { if (!v) return t("legal.measures.revocationReason"); },
  });
  if (reason) {
    try {
      await ApiService.patch(`legal/measures/${m.id}/revoke`, { revocation_reason: reason });
      Swal.fire({ icon: "success", title: t("common.success"), timer: 1500, showConfirmButton: false });
      loadMeasures(); loadStats();
    } catch { Swal.fire({ icon: "error", title: t("common.error") }); }
  }
};

const handleDelete = async (m: any) => {
  const result = await Swal.fire({
    title: t("legal.measures.confirmDelete"), icon: "warning",
    showCancelButton: true, confirmButtonText: t("common.delete"),
    cancelButtonText: t("common.cancel"), confirmButtonColor: "#d33",
  });
  if (result.isConfirmed) {
    try {
      await ApiService.delete(`legal/measures/${m.id}`);
      Swal.fire({ icon: "success", title: t("common.success"), timer: 1500, showConfirmButton: false });
      loadMeasures(); loadStats();
    } catch { Swal.fire({ icon: "error", title: t("common.error") }); }
  }
};

onMounted(() => { loadCatalogs(); loadStats(); loadMeasures(); });
</script>
