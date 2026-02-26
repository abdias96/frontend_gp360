<template>
  <div>
    <!-- Header -->
    <div class="card mb-5">
      <div class="card-header border-0 pt-5">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label fw-bold fs-3 mb-1">{{ $t("legal.benefits.title") }}</span>
          <span class="text-muted mt-1 fw-semibold fs-7">{{ $t("legal.benefits.subtitle") }}</span>
        </h3>
        <div class="card-toolbar">
          <button type="button" class="btn btn-primary" @click="openCreateModal">
            <i class="bi bi-plus-lg me-1"></i> {{ $t("legal.benefits.newApplication") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="row g-5 mb-5">
      <div class="col-xl-2 col-md-4" v-for="stat in statCards" :key="stat.key">
        <div class="card card-flush">
          <div class="card-body py-4">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-45px me-4">
                <span :class="'symbol-label bg-light-' + stat.color">
                  <i :class="stat.icon + ' fs-2 text-' + stat.color"></i>
                </span>
              </div>
              <div>
                <div class="fs-7 text-gray-400 fw-bold">{{ stat.label }}</div>
                <div class="fs-2 fw-bold">{{ stats[stat.key] }}</div>
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
          <input type="text" v-model="filters.search" @input="debouncedLoad" class="form-control form-control-solid w-250px" :placeholder="$t('legal.benefits.search')" />
          <select v-model="filters.status" @change="loadApplications" class="form-select form-select-solid w-175px">
            <option value="">{{ $t("legal.benefits.allStatuses") }}</option>
            <option value="pending">{{ $t("legal.benefits.pending") }}</option>
            <option value="under_review">{{ $t("legal.benefits.underReview") }}</option>
            <option value="approved">{{ $t("legal.benefits.approved") }}</option>
            <option value="denied">{{ $t("legal.benefits.denied") }}</option>
            <option value="granted">{{ $t("legal.benefits.granted") }}</option>
            <option value="revoked">{{ $t("legal.benefits.revoked") }}</option>
          </select>
          <select v-model="filters.benefit_type_id" @change="loadApplications" class="form-select form-select-solid w-200px">
            <option value="">{{ $t("legal.benefits.benefitType") }}</option>
            <option v-for="bt in benefitTypes" :key="bt.id" :value="bt.id">{{ bt.name }}</option>
          </select>
        </div>
      </div>
      <div class="card-body py-3">
        <div v-if="loading" class="text-center py-10">
          <div class="spinner-border" role="status"></div>
        </div>
        <div v-else-if="applications.length === 0" class="text-center py-10">
          <i class="bi bi-file-earmark-x display-4 text-muted"></i>
          <h4 class="mt-3 text-muted">{{ $t("legal.benefits.noBenefits") }}</h4>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-row-dashed table-row-gray-300 gy-5">
            <thead>
              <tr class="fw-semibold fs-6 text-gray-800">
                <th>{{ $t("legal.benefits.applicationNumber") }}</th>
                <th>{{ $t("legal.benefits.inmate") }}</th>
                <th>{{ $t("legal.benefits.benefitType") }}</th>
                <th>{{ $t("legal.benefits.applicationDate") }}</th>
                <th>{{ $t("legal.benefits.effectiveDate") }}</th>
                <th>{{ $t("legal.benefits.expirationDate") }}</th>
                <th>{{ $t("legal.benefits.status") }}</th>
                <th class="text-end">{{ $t("common.actions.title") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="app in applications" :key="app.id">
                <td class="fw-bold">{{ app.application_number }}</td>
                <td>
                  <span v-if="app.inmate">{{ app.inmate.first_name }} {{ app.inmate.last_name }}</span>
                </td>
                <td>{{ app.benefit_type?.name || "—" }}</td>
                <td>{{ formatDate(app.application_date) }}</td>
                <td>{{ app.effective_date ? formatDate(app.effective_date) : "—" }}</td>
                <td>{{ app.expiration_date ? formatDate(app.expiration_date) : "—" }}</td>
                <td><span :class="statusBadge(app.status)">{{ statusLabel(app.status) }}</span></td>
                <td class="text-end">
                  <button class="btn btn-icon btn-bg-light btn-sm me-1" @click="openEditModal(app)" :title="$t('common.edit')">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <!-- Status workflow buttons -->
                  <button v-if="app.status === 'pending'" class="btn btn-icon btn-bg-light btn-active-color-info btn-sm me-1" @click="handleStatusChange(app, 'under_review')" title="En Revisión">
                    <i class="bi bi-search"></i>
                  </button>
                  <button v-if="app.status === 'under_review'" class="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1" @click="handleApproveOrDeny(app, 'approved')" title="Aprobar">
                    <i class="bi bi-check-lg"></i>
                  </button>
                  <button v-if="app.status === 'under_review'" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1" @click="handleApproveOrDeny(app, 'denied')" title="Denegar">
                    <i class="bi bi-x-lg"></i>
                  </button>
                  <button v-if="app.status === 'approved'" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1" @click="handleGrant(app)" title="Otorgar">
                    <i class="bi bi-award"></i>
                  </button>
                  <button v-if="app.status === 'granted'" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1" @click="handleRevoke(app)" title="Revocar">
                    <i class="bi bi-slash-circle"></i>
                  </button>
                  <button class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm" @click="handleDelete(app)">
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
            <h5 class="modal-title">{{ editingId ? $t("legal.benefits.editApplication") : $t("legal.benefits.newApplication") }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="row g-4">
              <div class="col-md-6">
                <label class="form-label required">{{ $t("legal.benefits.inmate") }} (ID)</label>
                <input type="number" v-model="form.inmate_id" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label required">{{ $t("legal.benefits.benefitType") }}</label>
                <select v-model="form.benefit_type_id" class="form-select">
                  <option value="">--</option>
                  <option v-for="bt in benefitTypes" :key="bt.id" :value="bt.id">{{ bt.name }}</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label required">{{ $t("legal.benefits.applicationNumber") }}</label>
                <input type="text" v-model="form.application_number" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label required">{{ $t("legal.benefits.applicationDate") }}</label>
                <input type="date" v-model="form.application_date" class="form-control" />
              </div>
              <div class="col-12">
                <label class="form-label required">{{ $t("legal.benefits.justification") }}</label>
                <textarea v-model="form.justification" class="form-control" rows="3"></textarea>
              </div>
              <div class="col-12">
                <label class="form-label">{{ $t("legal.benefits.conditions") }}</label>
                <textarea v-model="form.conditions" class="form-control" rows="2"></textarea>
              </div>
              <!-- Fields only in edit mode -->
              <template v-if="editingId">
                <div class="col-md-6">
                  <label class="form-label">{{ $t("legal.benefits.evaluationDate") }}</label>
                  <input type="date" v-model="form.evaluation_date" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">{{ $t("legal.benefits.effectiveDate") }}</label>
                  <input type="date" v-model="form.effective_date" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">{{ $t("legal.benefits.expirationDate") }}</label>
                  <input type="date" v-model="form.expiration_date" class="form-control" />
                </div>
                <div class="col-12">
                  <label class="form-label">{{ $t("legal.benefits.evaluationNotes") }}</label>
                  <textarea v-model="form.evaluation_notes" class="form-control" rows="2"></textarea>
                </div>
              </template>
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
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { Modal } from "bootstrap";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";

const { t } = useI18n();
const loading = ref(false);
const saving = ref(false);
const applications = ref<any[]>([]);
const benefitTypes = ref<any[]>([]);
const stats = ref<Record<string, number>>({ total: 0, pending: 0, under_review: 0, approved: 0, denied: 0, granted: 0, revoked: 0 });
const filters = ref({ search: "", status: "", benefit_type_id: "" });
const currentPage = ref(1);
const totalPages = ref(1);
const editingId = ref<number | null>(null);
const modalRef = ref<HTMLElement | null>(null);
let modalInstance: Modal | null = null;

const statCards = computed(() => [
  { key: "total", label: t("legal.benefits.total"), icon: "bi bi-file-earmark-text", color: "primary" },
  { key: "pending", label: t("legal.benefits.pending"), icon: "bi bi-hourglass-split", color: "warning" },
  { key: "under_review", label: t("legal.benefits.underReview"), icon: "bi bi-search", color: "info" },
  { key: "approved", label: t("legal.benefits.approved"), icon: "bi bi-check-circle", color: "success" },
  { key: "denied", label: t("legal.benefits.denied"), icon: "bi bi-x-circle", color: "danger" },
  { key: "granted", label: t("legal.benefits.granted"), icon: "bi bi-award", color: "primary" },
]);

const emptyForm = () => ({
  inmate_id: "", benefit_type_id: "", application_number: "", application_date: "",
  justification: "", conditions: "", evaluation_date: "", evaluation_notes: "",
  effective_date: "", expiration_date: "",
});
const form = ref<any>(emptyForm());

let debounceTimer: any = null;
const debouncedLoad = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => loadApplications(), 400);
};

const formatDate = (d: string) => d ? new Date(d + "T00:00:00").toLocaleDateString("es-GT") : "—";

const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    pending: "badge badge-light-warning",
    under_review: "badge badge-light-info",
    approved: "badge badge-light-success",
    denied: "badge badge-light-danger",
    granted: "badge badge-light-primary",
    revoked: "badge badge-light-dark",
  };
  return map[s] || "badge badge-light";
};

const statusLabel = (s: string) => {
  const key = `legal.benefits.${s === "under_review" ? "underReview" : s}`;
  return t(key);
};

const loadStats = async () => {
  try {
    const res = await ApiService.get("legal/benefits/statistics");
    if (res.data.success) stats.value = res.data.data;
  } catch { /* ignore */ }
};

const loadApplications = async () => {
  loading.value = true;
  try {
    const params: any = { page: currentPage.value, per_page: 15 };
    if (filters.value.search) params.search = filters.value.search;
    if (filters.value.status) params.status = filters.value.status;
    if (filters.value.benefit_type_id) params.benefit_type_id = filters.value.benefit_type_id;
    const res = await ApiService.query("legal/benefits", params);
    if (res.data.success) {
      applications.value = res.data.data.data || [];
      totalPages.value = res.data.data.last_page || 1;
      currentPage.value = res.data.data.current_page || 1;
    }
  } catch { /* ignore */ }
  loading.value = false;
};

const loadCatalogs = async () => {
  try {
    const res = await ApiService.query("catalogs/benefit-types", { simple: true });
    if (res.data.success) benefitTypes.value = res.data.data || [];
  } catch { /* ignore */ }
};

const goToPage = (p: number) => { currentPage.value = p; loadApplications(); };

const openCreateModal = () => {
  editingId.value = null;
  form.value = emptyForm();
  if (!modalInstance && modalRef.value) modalInstance = new Modal(modalRef.value);
  modalInstance?.show();
};

const openEditModal = (app: any) => {
  editingId.value = app.id;
  form.value = {
    inmate_id: app.inmate_id, benefit_type_id: app.benefit_type_id,
    application_number: app.application_number,
    application_date: app.application_date?.split("T")[0] || "",
    justification: app.justification || "", conditions: app.conditions || "",
    evaluation_date: app.evaluation_date?.split("T")[0] || "",
    evaluation_notes: app.evaluation_notes || "",
    effective_date: app.effective_date?.split("T")[0] || "",
    expiration_date: app.expiration_date?.split("T")[0] || "",
  };
  if (!modalInstance && modalRef.value) modalInstance = new Modal(modalRef.value);
  modalInstance?.show();
};

const closeModal = () => modalInstance?.hide();

const handleSave = async () => {
  saving.value = true;
  try {
    if (editingId.value) {
      await ApiService.put(`legal/benefits/${editingId.value}`, form.value);
    } else {
      await ApiService.post("legal/benefits", form.value);
    }
    Swal.fire({ icon: "success", title: t("common.success"), timer: 1500, showConfirmButton: false });
    closeModal();
    loadApplications();
    loadStats();
  } catch (e: any) {
    const errors = e?.response?.data?.errors;
    const msg = errors ? Object.values(errors).flat().join("\n") : e?.response?.data?.message || t("common.error");
    Swal.fire({ icon: "error", title: t("common.error"), text: msg });
  }
  saving.value = false;
};

const handleStatusChange = async (app: any, newStatus: string) => {
  try {
    await ApiService.patch(`legal/benefits/${app.id}/status`, { status: newStatus });
    Swal.fire({ icon: "success", title: t("common.success"), timer: 1500, showConfirmButton: false });
    loadApplications();
    loadStats();
  } catch {
    Swal.fire({ icon: "error", title: t("common.error") });
  }
};

const handleApproveOrDeny = async (app: any, decision: "approved" | "denied") => {
  const { value: reasoning } = await Swal.fire({
    title: decision === "approved" ? t("legal.benefits.approved") : t("legal.benefits.denied"),
    input: "textarea",
    inputLabel: t("legal.benefits.decisionReasoning"),
    showCancelButton: true,
    confirmButtonText: t("common.confirm"),
    cancelButtonText: t("common.cancel"),
  });
  if (reasoning !== undefined) {
    try {
      await ApiService.patch(`legal/benefits/${app.id}/status`, {
        status: decision,
        decision_reasoning: reasoning || null,
      });
      Swal.fire({ icon: "success", title: t("common.success"), timer: 1500, showConfirmButton: false });
      loadApplications();
      loadStats();
    } catch {
      Swal.fire({ icon: "error", title: t("common.error") });
    }
  }
};

const handleGrant = async (app: any) => {
  const { value: formValues } = await Swal.fire({
    title: t("legal.benefits.granted"),
    html:
      `<label class="form-label">${t("legal.benefits.effectiveDate")}</label>` +
      `<input id="swal-effective" type="date" class="swal2-input">` +
      `<label class="form-label mt-3">${t("legal.benefits.expirationDate")}</label>` +
      `<input id="swal-expiration" type="date" class="swal2-input">`,
    showCancelButton: true,
    confirmButtonText: t("common.confirm"),
    cancelButtonText: t("common.cancel"),
    preConfirm: () => ({
      effective_date: (document.getElementById("swal-effective") as HTMLInputElement)?.value || null,
      expiration_date: (document.getElementById("swal-expiration") as HTMLInputElement)?.value || null,
    }),
  });
  if (formValues) {
    try {
      await ApiService.patch(`legal/benefits/${app.id}/status`, {
        status: "granted",
        ...formValues,
      });
      Swal.fire({ icon: "success", title: t("common.success"), timer: 1500, showConfirmButton: false });
      loadApplications();
      loadStats();
    } catch {
      Swal.fire({ icon: "error", title: t("common.error") });
    }
  }
};

const handleRevoke = async (app: any) => {
  const { value: reason } = await Swal.fire({
    title: t("legal.benefits.revoked"),
    input: "textarea",
    inputLabel: t("legal.benefits.revocationReason"),
    showCancelButton: true,
    confirmButtonText: t("common.confirm"),
    cancelButtonText: t("common.cancel"),
    inputValidator: (v) => { if (!v) return t("legal.benefits.revocationReason"); },
  });
  if (reason) {
    try {
      await ApiService.patch(`legal/benefits/${app.id}/status`, {
        status: "revoked",
        revocation_reason: reason,
      });
      Swal.fire({ icon: "success", title: t("common.success"), timer: 1500, showConfirmButton: false });
      loadApplications();
      loadStats();
    } catch {
      Swal.fire({ icon: "error", title: t("common.error") });
    }
  }
};

const handleDelete = async (app: any) => {
  const result = await Swal.fire({
    title: t("legal.benefits.confirmDelete"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: t("common.delete"),
    cancelButtonText: t("common.cancel"),
    confirmButtonColor: "#d33",
  });
  if (result.isConfirmed) {
    try {
      await ApiService.delete(`legal/benefits/${app.id}`);
      Swal.fire({ icon: "success", title: t("common.success"), timer: 1500, showConfirmButton: false });
      loadApplications();
      loadStats();
    } catch {
      Swal.fire({ icon: "error", title: t("common.error") });
    }
  }
};

onMounted(() => { loadCatalogs(); loadStats(); loadApplications(); });
</script>
