<template>
  <div v-if="loading" class="d-flex justify-content-center py-10">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>

  <div v-else-if="error" class="alert alert-danger">
    <i class="ki-duotone ki-cross-circle fs-2 me-2">
      <span class="path1"></span>
      <span class="path2"></span>
    </i>
    {{ error }}
    <router-link to="/inmates" class="btn btn-sm btn-light-primary ms-3">
      Volver a la Lista
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
              Internos
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
          Editar
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
          Transferir
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
                Verificar Identidad (1:1)
              </a>
            </li>
            <li class="menu-item px-3">
              <a href="#" class="menu-link px-3" @click.prevent="printProfile">
                <i class="ki-duotone ki-printer fs-6 me-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
                Imprimir Perfil
              </a>
            </li>
            <li class="menu-item px-3">
              <a href="#" class="menu-link px-3" @click.prevent="exportData">
                <i class="ki-duotone ki-file-down fs-6 me-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                Exportar Datos
              </a>
            </li>
            <li class="menu-separator"></li>
            <li class="menu-item px-3" v-if="canChangeStatus">
              <a href="#" class="menu-link px-3" @click.prevent="changeStatus">
                <i class="ki-duotone ki-status fs-6 me-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                Cambiar Estado
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
                <div class="fw-semibold text-gray-600">Número de Interno:</div>
                <div class="text-gray-900 fs-6">{{ inmate.inmate_number }}</div>
              </div>
              <div class="col-md-6">
                <div class="fw-semibold text-gray-600">Documento:</div>
                <div class="text-gray-900 fs-6">
                  {{ inmate.document_type?.name || "N/A" }} -
                  {{ inmate.document_number }}
                </div>
              </div>
              <div class="col-md-6">
                <div class="fw-semibold text-gray-600">
                  Fecha de Nacimiento:
                </div>
                <div class="text-gray-900 fs-6">
                  {{ formatDate(inmate.birth_date) }}
                  <span class="text-muted"
                    >({{ calculateAge(inmate.birth_date) }} años)</span
                  >
                </div>
              </div>
              <div class="col-md-6">
                <div class="fw-semibold text-gray-600">Género:</div>
                <div class="text-gray-900 fs-6">
                  {{ inmate.gender === "M" ? "Masculino" : "Femenino" }}
                </div>
              </div>
              <div class="col-md-6">
                <div class="fw-semibold text-gray-600">Centro Actual:</div>
                <div class="text-gray-900 fs-6">
                  {{ inmate.current_center?.name || "N/A" }}
                </div>
              </div>
              <div class="col-md-6">
                <div class="fw-semibold text-gray-600">Sector:</div>
                <div class="text-gray-900 fs-6">
                  {{ inmate.current_sector?.name || "N/A" }}
                </div>
              </div>
              <div class="col-md-6">
                <div class="fw-semibold text-gray-600">Fecha de Ingreso:</div>
                <div class="text-gray-900 fs-6">
                  {{ formatDate(inmate.admission_date) }}
                </div>
              </div>
              <div class="col-md-6">
                <div class="fw-semibold text-gray-600">
                  Clasificación de Riesgo:
                </div>
                <div class="text-gray-900 fs-6">
                  <span
                    v-if="inmate.risk_classification"
                    class="badge"
                    :class="getRiskBadgeClass(inmate.risk_classification.level)"
                  >
                    {{ inmate.risk_classification.name }}
                  </span>
                  <span v-else class="text-muted">No asignada</span>
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
                Información General
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
                Legal
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
                Físico
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
                Salud
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
                Seguridad
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
                Rehabilitación
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
                Visitas
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
                Documentos
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
                Operaciones
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useInmatesStore } from "@/stores/inmates";
import { useAuthStore } from "@/stores/auth";
import InmateOverviewTab from "@/components/inmates/tabs/InmateOverviewTab.vue";
import InmateLegalTab from "@/components/inmates/tabs/InmateLegalTab.vue";
import InmatePhysicalTab from "@/components/inmates/tabs/InmatePhysicalTab.vue";
import InmateMedicalTab from "@/components/inmates/tabs/InmateMedicalTab.vue";
import InmateSecurityTab from "@/components/inmates/tabs/InmateSecurityTab.vue";
import InmateRehabilitationTab from "@/components/inmates/tabs/InmateRehabilitationTab.vue";
import InmateVisitsTab from "@/components/inmates/tabs/InmateVisitsTab.vue";
import InmateDocumentsTab from "@/components/inmates/tabs/InmateDocumentsTab.vue";
import InmateOperationsTab from "@/components/inmates/tabs/InmateOperationsTab.vue";
import Swal from "sweetalert2";
import { useBiometricMatching } from "@/composables/useBiometricMatching";

// Stores
const inmatesStore = useInmatesStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Reactive data
const loading = ref(false);

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
  return new Date(date).toLocaleDateString("es-GT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const calculateAge = (birthDate: string | null) => {
  if (!birthDate) return "N/A";
  const today = new Date();
  const birth = new Date(birthDate);
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
  const labels = {
    active: "Activo",
    transferred: "En traslado",
    court_hearing: "En audiencia",
    hospital_external: "Hospital externo",
    hospital_internal: "Enfermería",
    isolation: "Aislamiento",
    released: "Liberado",
    deceased: "Fallecido",
    escaped: "Fugado",
  };
  return labels[status as keyof typeof labels] || "Desconocido";
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

const initiateTransfer = async () => {
  const { value: formValues } = await Swal.fire({
    title: "Iniciar Traslado",
    html: `
      <div class="row g-3">
        <div class="col-12">
          <label for="center" class="form-label">Centro de Destino</label>
          <select id="center" class="swal2-select">
            <option value="">Seleccionar centro...</option>
            <option value="1">Centro A</option>
            <option value="2">Centro B</option>
          </select>
        </div>
        <div class="col-12">
          <label for="reason" class="form-label">Motivo del Traslado</label>
          <textarea id="reason" class="swal2-textarea" placeholder="Descripción del motivo..."></textarea>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Iniciar Traslado",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const center = (document.getElementById("center") as HTMLSelectElement)
        .value;
      const reason = (document.getElementById("reason") as HTMLTextAreaElement)
        .value;

      if (!center || !reason) {
        Swal.showValidationMessage("Todos los campos son requeridos");
        return false;
      }

      return { center, reason };
    },
  });

  if (formValues) {
    try {
      // TODO: Implement transfer logic
      await Swal.fire({
        title: "Traslado Iniciado",
        text: "El proceso de traslado ha sido iniciado correctamente",
        icon: "success",
        timer: 2000,
      });
    } catch (error) {
      await Swal.fire({
        title: "Error",
        text: "No se pudo iniciar el traslado",
        icon: "error",
      });
    }
  }
};

const changeStatus = async () => {
  const { value: newStatus } = await Swal.fire({
    title: "Cambiar Estado del Interno",
    html: `
      <div class="mb-3">
        <label for="status" class="form-label">Nuevo Estado</label>
        <select id="status" class="swal2-select">
          <option value="active">Activo</option>
          <option value="transferred">En traslado</option>
          <option value="court_hearing">En audiencia</option>
          <option value="hospital_external">Hospital externo</option>
          <option value="hospital_internal">Enfermería</option>
          <option value="isolation">Aislamiento</option>
          <option value="released">Liberado</option>
          <option value="deceased">Fallecido</option>
          <option value="escaped">Fugado</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="reason" class="form-label">Motivo del Cambio</label>
        <textarea id="reason" class="swal2-textarea" placeholder="Descripción del motivo..."></textarea>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Cambiar Estado",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const status = (document.getElementById("status") as HTMLSelectElement)
        .value;
      const reason = (document.getElementById("reason") as HTMLTextAreaElement)
        .value;

      if (!reason) {
        Swal.showValidationMessage("El motivo es requerido");
        return false;
      }

      return { status, reason };
    },
  });

  if (newStatus) {
    try {
      // TODO: Implement status change logic
      await Swal.fire({
        title: "Estado Actualizado",
        text: "El estado del interno ha sido actualizado correctamente",
        icon: "success",
        timer: 2000,
      });
      await loadInmate(); // Reload data
    } catch (error) {
      await Swal.fire({
        title: "Error",
        text: "No se pudo cambiar el estado",
        icon: "error",
      });
    }
  }
};

const verifyBiometric = async () => {
  try {
    // Usar el composable
    const { verifyFingerprint, simulateFingerCapture } = useBiometricMatching();
    
    // Mostrar diálogo de captura
    const result = await Swal.fire({
      title: 'Verificación Biométrica 1:1',
      html: `
        <div class="text-center">
          <i class="ki-duotone ki-fingerprint-scanning fs-5x text-primary mb-3">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          <p>Coloque el dedo del interno en el lector para verificar su identidad</p>
          <p class="text-muted">Se comparará con las huellas registradas de ${inmate.value.full_name}</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Capturar Huella',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false
    });
    
    if (result.isConfirmed) {
      // Mostrar loading
      Swal.fire({
        title: 'Capturando huella...',
        html: 'Por favor espere...',
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
          title: '✅ Identidad Verificada',
          html: `
            <div class="text-start">
              <p><strong>Interno:</strong> ${inmate.value.full_name}</p>
              <p><strong>Dedo:</strong> ${verificationResult.finger_type || 'N/A'}</p>
              <p><strong>Coincidencia:</strong> ${(verificationResult.score * 100).toFixed(1)}%</p>
            </div>
          `,
          confirmButtonText: 'Aceptar'
        });
      } else {
        await Swal.fire({
          icon: 'error',
          title: '❌ Verificación Fallida',
          text: 'La huella no coincide con las registradas para este interno',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  } catch (error) {
    console.error('Error en verificación biométrica:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo completar la verificación biométrica'
    });
  }
};

const printProfile = () => {
  window.print();
};

const exportData = async () => {
  try {
    // TODO: Implement export logic
    await Swal.fire({
      title: "Exportando...",
      text: "Los datos se están exportando",
      icon: "info",
      timer: 2000,
    });
  } catch (error) {
    await Swal.fire({
      title: "Error",
      text: "No se pudieron exportar los datos",
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

// Load data on mount
onMounted(() => {
  loadInmate();
});
</script>
