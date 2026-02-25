<template>
  <div v-if="loading" class="d-flex justify-content-center py-10">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">{{ $t('inmates.detail.loading') }}</span>
    </div>
  </div>

  <div v-else-if="error" class="alert alert-danger">
    <i class="ki-duotone ki-cross-circle fs-2 me-2">
      <span class="path1"></span>
      <span class="path2"></span>
    </i>
    {{ error }}
    <router-link to="/inmates" class="btn btn-sm btn-light-primary ms-3">
      {{ $t('inmates.detail.backToList') }}
    </router-link>
  </div>

  <div v-else-if="inmate" class="d-flex flex-column gap-7 gap-lg-10">
    <!--begin::Header-->
    <div class="d-flex flex-wrap flex-stack gap-5 gap-lg-10">
      <!--begin::Breadcrumb-->
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb text-muted fs-6 fw-semibold">
          <li class="breadcrumb-item">
            <router-link to="/inmates" class="text-muted text-hover-primary">
              {{ $t('inmates.detail.breadcrumb.inmates') }}
            </router-link>
          </li>
          <li class="breadcrumb-item text-muted">{{ inmate.full_name }}</li>
        </ol>
      </nav>
      <!--end::Breadcrumb-->

      <!--begin::Actions-->
      <div class="d-flex gap-3">
        <router-link
          v-if="canEdit"
          :to="`/inmates/${inmate.id}/edit`"
          class="btn btn-sm btn-primary"
        >
          <i class="ki-duotone ki-pencil fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          {{ $t('inmates.detail.actions.edit') }}
        </router-link>

        <button
          v-if="canTransfer"
          type="button"
          class="btn btn-sm btn-light-primary"
          @click="initiateTransfer"
        >
          <i class="ki-duotone ki-switch fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          {{ $t('inmates.detail.actions.transfer') }}
        </button>

        <div class="dropdown">
          <button
            class="btn btn-sm btn-light"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="ki-duotone ki-dots-horizontal fs-2"></i>
          </button>
          <ul
            class="dropdown-menu menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-200px py-4"
          >
            <li class="menu-item px-3">
              <a href="#" class="menu-link px-3" @click.prevent="verifyBiometric">
                <i class="ki-duotone ki-fingerprint-scanning fs-6 me-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
                {{ $t('inmates.detail.actions.verifyIdentity') }}
              </a>
            </li>
            <li class="menu-item px-3">
              <a href="#" class="menu-link px-3" @click.prevent="printProfile">
                <i class="ki-duotone ki-printer fs-6 me-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
                {{ $t('inmates.detail.actions.printProfile') }}
              </a>
            </li>
            <li class="menu-item px-3">
              <a href="#" class="menu-link px-3" @click.prevent="exportData">
                <i class="ki-duotone ki-file-down fs-6 me-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                {{ $t('inmates.detail.actions.exportData') }}
              </a>
            </li>
            <li class="menu-separator"></li>
            <li class="menu-item px-3" v-if="canChangeStatus">
              <a href="#" class="menu-link px-3" @click.prevent="changeStatus">
                <i class="ki-duotone ki-status fs-6 me-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                {{ $t('inmates.detail.actions.changeStatus') }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <!--end::Actions-->
    </div>
    <!--end::Header-->

    <!--begin::Inmate Overview Card-->
    <div class="card">
      <div class="card-body p-9">
        <div class="row">
          <!--begin::Photo-->
          <div class="col-lg-3">
            <div class="d-flex flex-column align-items-center">
              <div class="symbol symbol-150px symbol-circle mb-4">
                <img
                  v-if="getPrimaryPhotoUrl(inmate)"
                  :src="getPrimaryPhotoUrl(inmate)"
                  :alt="inmate.full_name"
                />
                <div
                  v-else
                  class="symbol-label fs-1 bg-light-primary text-primary"
                >
                  {{ inmate.first_name?.[0] }}{{ inmate.last_name?.[0] }}
                </div>
              </div>
              <h2 class="fw-bold text-gray-900 text-center">
                {{ inmate.full_name }}
              </h2>
              <div class="badge" :class="getStatusBadgeClass(inmate.status)">
                {{ getStatusLabel(inmate.status) }}
              </div>
            </div>
          </div>
          <!--end::Photo-->

          <!--begin::Basic Info-->
          <div class="col-lg-9">
            <div class="row g-5">
              <div class="col-md-6">
                <div class="fw-semibold text-gray-600">{{ $t('inmates.detail.fields.inmateNumber') }}</div>
                <div class="text-gray-900 fs-6">{{ inmate.inmate_number }}</div>
              </div>
              <div class="col-md-6">
                <div class="fw-semibold text-gray-600">{{ $t('inmates.detail.fields.document') }}</div>
                <div class="text-gray-900 fs-6">
                  {{ inmate.document_type?.name || $t('common.na') }} -
                  {{ inmate.document_number }}
                </div>
              </div>
              <div class="col-md-6">
                <div class="fw-semibold text-gray-600">
                  {{ $t('inmates.detail.fields.birthDate') }}
                </div>
                <div class="text-gray-900 fs-6">
                  {{ formatDate(inmate.birth_date) }}
                  <span class="text-muted"
                    >({{ calculateAge(inmate.birth_date) }} {{ $t('inmates.detail.fields.years') }})</span
                  >
                </div>
              </div>
              <div class="col-md-6">
                <div class="fw-semibold text-gray-600">{{ $t('inmates.detail.fields.gender') }}</div>
                <div class="text-gray-900 fs-6">
                  {{ inmate.gender === "M" ? $t('inmates.detail.fields.male') : $t('inmates.detail.fields.female') }}
                </div>
              </div>
              <div class="col-md-6">
                <div class="fw-semibold text-gray-600">{{ $t('inmates.detail.fields.currentCenter') }}</div>
                <div class="text-gray-900 fs-6">
                  {{ inmate.current_center?.name || $t('common.na') }}
                </div>
              </div>
              <div class="col-md-6">
                <div class="fw-semibold text-gray-600">{{ $t('inmates.detail.fields.sector') }}</div>
                <div class="text-gray-900 fs-6">
                  {{ inmate.current_sector?.name || $t('common.na') }}
                </div>
              </div>
              <div class="col-md-6">
                <div class="fw-semibold text-gray-600">{{ $t('inmates.detail.fields.admissionDate') }}</div>
                <div class="text-gray-900 fs-6">
                  {{ formatDate(inmate.admission_date) }}
                </div>
              </div>
              <div class="col-md-6">
                <div class="fw-semibold text-gray-600">
                  {{ $t('inmates.detail.fields.riskClassification') }}
                </div>
                <div class="text-gray-900 fs-6">
                  <span
                    v-if="inmate.risk_classification"
                    class="badge"
                    :class="getRiskBadgeClass(inmate.risk_classification.level)"
                  >
                    {{ inmate.risk_classification.name }}
                  </span>
                  <span v-else class="text-muted">{{ $t('inmates.detail.fields.notAssigned') }}</span>
                </div>
              </div>
            </div>
          </div>
          <!--end::Basic Info-->
        </div>
      </div>
    </div>
    <!--end::Inmate Overview Card-->

    <!--begin::Tabs-->
    <div class="card">
      <div class="card-header card-header-stretch">
        <div class="card-toolbar m-0">
          <ul
            class="nav nav-tabs nav-line-tabs nav-stretch fs-6 border-0 fw-bold"
            role="tablist"
          >
            <li class="nav-item" role="presentation">
              <a
                class="nav-link justify-content-center text-active-gray-800 active"
                data-bs-toggle="tab"
                href="#overview_tab"
                aria-selected="true"
                role="tab"
              >
                {{ $t('inmates.detail.tabs.overview') }}
              </a>
            </li>
            <li class="nav-item" role="presentation">
              <a
                class="nav-link justify-content-center text-active-gray-800"
                data-bs-toggle="tab"
                href="#legal_tab"
                aria-selected="false"
                role="tab"
              >
                {{ $t('inmates.detail.tabs.legal') }}
              </a>
            </li>
            <li class="nav-item" role="presentation">
              <a
                class="nav-link justify-content-center text-active-gray-800"
                data-bs-toggle="tab"
                href="#physical_tab"
                aria-selected="false"
                role="tab"
              >
                {{ $t('inmates.detail.tabs.physical') }}
              </a>
            </li>
            <li class="nav-item" role="presentation">
              <a
                class="nav-link justify-content-center text-active-gray-800"
                data-bs-toggle="tab"
                href="#medical_tab"
                aria-selected="false"
                role="tab"
              >
                {{ $t('inmates.detail.tabs.medical') }}
              </a>
            </li>
            <li class="nav-item" role="presentation">
              <a
                class="nav-link justify-content-center text-active-gray-800"
                data-bs-toggle="tab"
                href="#security_tab"
                aria-selected="false"
                role="tab"
              >
                {{ $t('inmates.detail.tabs.security') }}
              </a>
            </li>
            <li class="nav-item" role="presentation">
              <a
                class="nav-link justify-content-center text-active-gray-800"
                data-bs-toggle="tab"
                href="#rehabilitation_tab"
                aria-selected="false"
                role="tab"
              >
                {{ $t('inmates.detail.tabs.rehabilitation') }}
              </a>
            </li>
            <li class="nav-item" role="presentation">
              <a
                class="nav-link justify-content-center text-active-gray-800"
                data-bs-toggle="tab"
                href="#visits_tab"
                aria-selected="false"
                role="tab"
              >
                {{ $t('inmates.detail.tabs.visits') }}
              </a>
            </li>
            <li class="nav-item" role="presentation">
              <a
                class="nav-link justify-content-center text-active-gray-800"
                data-bs-toggle="tab"
                href="#documents_tab"
                aria-selected="false"
                role="tab"
              >
                {{ $t('inmates.detail.tabs.documents') }}
              </a>
            </li>
            <li class="nav-item" role="presentation">
              <a
                class="nav-link justify-content-center text-active-gray-800"
                data-bs-toggle="tab"
                href="#operations_tab"
                aria-selected="false"
                role="tab"
              >
                {{ $t('inmates.detail.tabs.operations') }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="card-body">
        <div class="tab-content">
          <!--begin::Overview Tab-->
          <div
            class="tab-pane fade show active"
            id="overview_tab"
            role="tabpanel"
          >
            <InmateOverviewTab :inmate="inmate" />
          </div>
          <!--end::Overview Tab-->

          <!--begin::Legal Tab-->
          <div class="tab-pane fade" id="legal_tab" role="tabpanel">
            <InmateLegalTab :inmateId="inmate.id" :inmate="inmate" />
          </div>
          <!--end::Legal Tab-->

          <!--begin::Physical Tab-->
          <div class="tab-pane fade" id="physical_tab" role="tabpanel">
            <InmatePhysicalTab :inmate="inmate" />
          </div>
          <!--end::Physical Tab-->

          <!--begin::Medical Tab-->
          <div class="tab-pane fade" id="medical_tab" role="tabpanel">
            <InmateMedicalTab :inmate="inmate" />
          </div>
          <!--end::Medical Tab-->

          <!--begin::Security Tab-->
          <div class="tab-pane fade" id="security_tab" role="tabpanel">
            <InmateSecurityTab :inmate="inmate" />
          </div>
          <!--end::Security Tab-->

          <!--begin::Rehabilitation Tab-->
          <div class="tab-pane fade" id="rehabilitation_tab" role="tabpanel">
            <InmateRehabilitationTab :inmate="inmate" />
          </div>
          <!--end::Rehabilitation Tab-->

          <!--begin::Visits Tab-->
          <div class="tab-pane fade" id="visits_tab" role="tabpanel">
            <InmateVisitsTab :inmate="inmate" />
          </div>
          <!--end::Visits Tab-->

          <!--begin::Documents Tab-->
          <div class="tab-pane fade" id="documents_tab" role="tabpanel">
            <InmateDocumentsTab :inmate="inmate" />
          </div>
          <!--end::Documents Tab-->

          <!--begin::Operations Tab-->
          <div class="tab-pane fade" id="operations_tab" role="tabpanel">
            <InmateOperationsTab :inmate="inmate" />
          </div>
          <!--end::Operations Tab-->
        </div>
      </div>
    </div>
    <!--end::Tabs-->

    <!-- Transfer Modal -->
    <TransferFormModal
      :show="showTransferModal"
      :inmateId="selectedInmateForAction?.id"
      @saved="handleTransferSaved"
      @close="closeTransferModal"
    />

    <!-- Change Status Modal -->
    <ChangeStatusModal
      v-if="selectedInmateForAction"
      :inmate="selectedInmateForAction"
      @statusChanged="handleStatusChanged"
      @released="handleReleased"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useInmatesStore } from "@/stores/inmates";
import { useAuthStore } from "@/stores/auth";
// Tabs de detalle de interno - usar versiones más completas de /components/inmates/tabs/
import InmateOverviewTab from "@/components/inmates/tabs/InmateOverviewTab.vue";
import InmateLegalTab from "@/components/inmates/tabs/InmateLegalTab.vue";
import InmatePhysicalTab from "@/modules/inmates/components/InmatePhysicalTab.vue";
import InmateMedicalTab from "@/modules/inmates/components/InmateMedicalTab.vue";
import InmateSecurityTab from "@/modules/inmates/components/InmateSecurityTab.vue";
import InmateRehabilitationTab from "@/components/inmates/tabs/InmateRehabilitationTab.vue";
import InmateVisitsTab from "@/modules/inmates/components/InmateVisitsTab.vue";
import InmateDocumentsTab from "@/components/inmates/tabs/InmateDocumentsTab.vue";
import InmateOperationsTab from "@/components/inmates/tabs/InmateOperationsTab.vue";
import TransferFormModal from "@/components/inmates/modals/TransferFormModal.vue";
import ChangeStatusModal from "@/components/inmates/modals/ChangeStatusModal.vue";
import Swal from "sweetalert2";
import { useBiometricMatching } from "@/composables/useBiometricMatching";
import { formatDate as formatDateHelper } from "@/core/helpers/formatters";
import ApiService from "@/core/services/ApiService";
import { generateBatchPrintHTML } from "@/utils/inmatePrintProfile";

// i18n
const { t } = useI18n();

// Stores
const inmatesStore = useInmatesStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Reactive data
const loading = ref(false);
const showTransferModal = ref(false);
const selectedInmateForAction = ref<any>(null);

// Computed properties
const inmate = computed(() => inmatesStore.currentInmate);
const error = computed(() => inmatesStore.error);

// Permissions
const canEdit = computed(() => authStore.hasPermission("inmates.edit"));
const canTransfer = computed(() => authStore.hasPermission("inmates.transfer"));
const canChangeStatus = computed(() =>
  authStore.hasPermission("inmates.change_status"),
);

// Methods
const loadInmate = async () => {
  try {
    loading.value = true;
    const inmateId = route.params.id as string;
    await inmatesStore.fetchInmate(inmateId);
  } catch (error) {
    console.error("Error loading inmate:", error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (date: string | null) => {
  if (!date) return "N/A";
  return formatDateHelper(date, "d 'de' MMMM 'de' yyyy");
};

const calculateAge = (birthDate: string | null) => {
  if (!birthDate) return "N/A";
  const today = new Date();

  // Parse date correctly to avoid timezone issues
  let birth: Date;
  if (/^\d{4}-\d{2}-\d{2}$/.test(birthDate.trim())) {
    const [year, month, day] = birthDate.split('-').map(Number);
    birth = new Date(year, month - 1, day); // month is 0-indexed
  } else {
    birth = new Date(birthDate);
  }

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

const getStatusBadgeClass = (status: string) => {
  const classes = {
    active: "badge-light-success",
    transferred: "badge-light-warning",
    court_hearing: "badge-light-info",
    hospital_external: "badge-light-primary",
    hospital_internal: "badge-light-primary",
    isolation: "badge-light-dark",
    released: "badge-light-success",
    deceased: "badge-light-danger",
    escaped: "badge-light-danger",
  };
  return classes[status as keyof typeof classes] || "badge-light-secondary";
};

const getStatusLabel = (status: string) => {
  if (!status) return t('inmates.detail.statuses.unknown');
  const statusKey = `inmates.detail.statuses.${status}`;
  const translated = t(statusKey);
  return translated !== statusKey ? translated : t('inmates.detail.statuses.unknown');
};

const getRiskBadgeClass = (level: number) => {
  const classes = {
    1: "badge-light-success", // Mínimo
    2: "badge-light-info", // Bajo
    3: "badge-light-warning", // Medio
    4: "badge-light-danger", // Alto
    5: "badge-light-dark", // Máximo
  };
  return classes[level as keyof typeof classes] || "badge-light-secondary";
};

const initiateTransfer = () => {
  if (inmate.value) {
    selectedInmateForAction.value = inmate.value;
    showTransferModal.value = true;
  }
};

const changeStatus = () => {
  if (inmate.value) {
    selectedInmateForAction.value = inmate.value;

    // Abrir modal de cambio de estado usando Bootstrap
    setTimeout(() => {
      const modalElement = document.getElementById('changeStatusModal');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    }, 100);
  }
};

const verifyBiometric = async () => {
  try {
    // Usar el composable
    const { verifyFingerprint, simulateFingerCapture } = useBiometricMatching();

    // Mostrar diálogo de captura
    const result = await Swal.fire({
      title: t('inmates.detail.biometric.title'),
      html: `
        <div class="text-center">
          <i class="ki-duotone ki-fingerprint-scanning fs-5x text-primary mb-3">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          <p>${t('inmates.detail.biometric.instruction')}</p>
          <p class="text-muted">${t('inmates.detail.biometric.compareWith', { name: inmate.value.full_name })}</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: t('inmates.detail.biometric.capture'),
      cancelButtonText: t('inmates.detail.biometric.cancel'),
      allowOutsideClick: false
    });

    if (result.isConfirmed) {
      // Mostrar loading
      Swal.fire({
        title: t('inmates.detail.biometric.capturing'),
        html: t('inmates.detail.biometric.pleaseWait'),
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Simular captura (en producción sería captura real)
      const capturedFingerprint = simulateFingerCapture();

      // Verificar contra las huellas del interno
      const verificationResult = await verifyFingerprint(
        inmate.value.id,
        capturedFingerprint
      );

      if (verificationResult.verified) {
        await Swal.fire({
          icon: 'success',
          title: `✅ ${t('inmates.detail.biometric.verified')}`,
          html: `
            <div class="text-start">
              <p><strong>${t('inmates.detail.biometric.inmate')}</strong> ${inmate.value.full_name}</p>
              <p><strong>${t('inmates.detail.biometric.finger')}</strong> ${verificationResult.finger_type || t('common.na')}</p>
              <p><strong>${t('inmates.detail.biometric.match')}</strong> ${(verificationResult.score * 100).toFixed(1)}%</p>
            </div>
          `,
          confirmButtonText: t('inmates.detail.biometric.accept')
        });
      } else {
        await Swal.fire({
          icon: 'error',
          title: `❌ ${t('inmates.detail.biometric.verificationFailed')}`,
          text: t('inmates.detail.biometric.noMatch'),
          confirmButtonText: t('inmates.detail.biometric.accept')
        });
      }
    }
  } catch (error) {
    console.error('Error en verificación biométrica:', error);
    await Swal.fire({
      icon: 'error',
      title: t('inmates.detail.swal.error'),
      text: t('inmates.detail.biometric.error')
    });
  }
};


const printProfile = () => {
  if (!inmate.value) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    Swal.fire({
      icon: 'error',
      title: t('inmates.detail.swal.error'),
      text: t('inmates.detail.print.popupError')
    });
    return;
  }

  const html = generateBatchPrintHTML([inmate.value]);
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 500);
};

const exportData = async () => {
  try {
    if (!inmate.value) return;

    Swal.fire({
      title: t('inmates.detail.export.exporting'),
      text: t('inmates.detail.export.generating'),
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Llamar al endpoint de exportación
    const response = await ApiService.get(`/inmates/${inmate.value.id}/export`);

    if (response.data.success) {
      const exportData = response.data.data;

      // Convertir a JSON formateado
      const jsonString = JSON.stringify(exportData, null, 2);

      // Crear un blob y descargar el archivo JSON
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `PPL_${inmate.value.internal_number || inmate.value.id}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      Swal.fire({
        icon: 'success',
        title: t('inmates.detail.export.completed'),
        text: t('inmates.detail.export.successMessage'),
        timer: 2000
      });
    } else {
      throw new Error(t('inmates.detail.export.error'));
    }
  } catch (error: any) {
    console.error('Error exporting data:', error);
    await Swal.fire({
      title: t('inmates.detail.swal.error'),
      text: error.response?.data?.message || t('inmates.detail.export.error'),
      icon: "error",
    });
  }
};

const getPrimaryPhotoUrl = (inmate: any) => {
  if (!inmate?.photos || inmate.photos.length === 0) {
    return null;
  }
  const primaryPhoto = inmate.photos.find((photo: any) => photo.is_current);
  if (primaryPhoto) {
    return primaryPhoto.photo_data || primaryPhoto.photo_url || primaryPhoto.photo_path;
  }
  const firstPhoto = inmate.photos[0];
  return firstPhoto.photo_data || firstPhoto.photo_url || firstPhoto.photo_path;
};

// Modal callbacks
const closeTransferModal = () => {
  showTransferModal.value = false;
  selectedInmateForAction.value = null;
};

const handleTransferSaved = async () => {
  await Swal.fire({
    icon: 'success',
    title: t('inmates.detail.swal.transferSaved'),
    text: t('inmates.detail.swal.transferSavedDesc'),
    timer: 2000
  });

  closeTransferModal();
  await loadInmate(); // Reload inmate data
};

const handleStatusChanged = async () => {
  await Swal.fire({
    icon: 'success',
    title: t('inmates.detail.swal.statusUpdated'),
    text: t('inmates.detail.swal.statusUpdatedDesc'),
    timer: 2000
  });

  await loadInmate(); // Reload inmate data
};

const handleReleased = async () => {
  await Swal.fire({
    icon: 'success',
    title: t('inmates.detail.swal.released'),
    text: t('inmates.detail.swal.releasedDesc'),
    confirmButtonText: t('inmates.detail.swal.backToList')
  });

  router.push('/inmates');
};

// Load data on mount
onMounted(() => {
  loadInmate();
});
</script>
