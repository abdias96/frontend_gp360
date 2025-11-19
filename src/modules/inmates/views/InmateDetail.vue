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
import { useInmatesStore } from "@/stores/inmates";
import { useAuthStore } from "@/stores/auth";
import InmateOverviewTab from "@/modules/inmates/components/InmateOverviewTab.vue";
import InmateLegalTab from "@/components/inmates/tabs/InmateLegalTab.vue";
import InmatePhysicalTab from "@/modules/inmates/components/InmatePhysicalTab.vue";
import InmateMedicalTab from "@/modules/inmates/components/InmateMedicalTab.vue";
import InmateSecurityTab from "@/modules/inmates/components/InmateSecurityTab.vue";
import InmateRehabilitationTab from "@/components/inmates/tabs/InmateRehabilitationTab.vue";
import InmateVisitsTab from "@/modules/inmates/components/InmateVisitsTab.vue";
import InmateDocumentsTab from "@/modules/inmates/components/InmateDocumentsTab.vue";
import InmateOperationsTab from "@/components/inmates/tabs/InmateOperationsTab.vue";
import TransferFormModal from "@/components/inmates/modals/TransferFormModal.vue";
import ChangeStatusModal from "@/components/inmates/modals/ChangeStatusModal.vue";
import Swal from "sweetalert2";
import { useBiometricMatching } from "@/composables/useBiometricMatching";
import { formatDate as formatDateHelper } from "@/core/helpers/formatters";
import ApiService from "@/core/services/ApiService";

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
  // Crear una ventana de impresión con el perfil del PPL
  if (!inmate.value) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo abrir la ventana de impresión. Verifique que los pop-ups estén habilitados.'
    });
    return;
  }

  // Obtener foto del interno
  const photoUrl = getPrimaryPhotoUrl(inmate.value) || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TaW4gRm90bzwvdGV4dD48L3N2Zz4=';

  // Obtener datos del perfil físico
  const physical = inmate.value.physical_profile || {};

  // Obtener perfiles legales (puede tener múltiples casos)
  const legalProfiles = inmate.value.legal_profiles || [];
  const primaryLegalProfile = legalProfiles[0] || {};

  // Obtener todos los delitos
  const allCrimes = legalProfiles.flatMap((profile: any) =>
    profile.crimes?.map((c: any) => c.crime?.name || c.name) || []
  ).filter((name: string) => name);

  // Obtener contacto de emergencia
  const emergencyContact = inmate.value.family_members?.find((f: any) => f.is_emergency_contact) ||
                          inmate.value.family_members?.[0] || {};

  // Obtener información médica crítica
  const medical = inmate.value.medical_profile || {};
  const allergies = medical.allergies?.map((a: any) => a.allergy_name || a.name).join(', ') || 'Ninguna';
  const chronicDiseases = medical.chronic_diseases?.map((d: any) => d.disease_name || d.name).join(', ') || 'Ninguna';

  // Obtener clasificación de seguridad actual
  const securityClass = inmate.value.current_security_classification?.classification?.name || 'No asignada';
  const riskLevel = inmate.value.risk_classification?.name || 'No asignada';

  // Obtener información de afiliación a pandillas
  const gangInfo = inmate.value.current_gang_affiliation || null;

  // Traslados recientes
  const recentTransfers = (inmate.value.transfers || []).slice(0, 3);

  // Organizar huellas digitales por tipo
  console.log('🔍 Full inmate object keys:', Object.keys(inmate.value));
  console.log('🔍 Debugging biometric data (snake_case):', {
    hasBiometricData: !!inmate.value.biometric_data,
    isArray: Array.isArray(inmate.value.biometric_data),
    count: inmate.value.biometric_data?.length || 0,
    sample: inmate.value.biometric_data?.[0]
  });
  console.log('🔍 Debugging biometric data (camelCase):', {
    hasBiometricData: !!(inmate.value as any).biometricData,
    isArray: Array.isArray((inmate.value as any).biometricData),
    count: (inmate.value as any).biometricData?.length || 0,
    sample: (inmate.value as any).biometricData?.[0]
  });

  // Intentar ambas versiones del nombre
  const biometricData = inmate.value.biometric_data || (inmate.value as any).biometricData;

  console.log('🔍 Selected biometric data:', {
    exists: !!biometricData,
    isArray: Array.isArray(biometricData),
    count: biometricData?.length || 0
  });

  const fingerprintMap: Record<string, string> = {};
  if (biometricData && Array.isArray(biometricData)) {
    biometricData.forEach((bio: any) => {
      console.log('📌 Processing fingerprint:', {
        finger_type: bio.finger_type,
        fingerType: bio.fingerType,
        has_image: !!bio.fingerprint_image,
        has_image_camel: !!bio.fingerprintImage,
        image_preview: (bio.fingerprint_image || bio.fingerprintImage)?.substring(0, 50),
        all_keys: Object.keys(bio)
      });

      const fingerType = bio.finger_type || bio.fingerType;
      const fingerprintImage = bio.fingerprint_image || bio.fingerprintImage;

      if (fingerType && fingerprintImage) {
        // Asegurar que la imagen tenga el prefijo data:image
        const imageData = fingerprintImage.startsWith('data:')
          ? fingerprintImage
          : `data:image/png;base64,${fingerprintImage}`;
        fingerprintMap[fingerType] = imageData;
      }
    });
  }

  console.log('🖐️ Fingerprint map:', Object.keys(fingerprintMap));

  // Crear arrays ordenados de huellas para cada mano
  const rightHandFingers = ['right_thumb', 'right_index', 'right_middle', 'right_ring', 'right_pinky'];
  const leftHandFingers = ['left_thumb', 'left_index', 'left_middle', 'left_ring', 'left_pinky'];

  const rightHandPrints = rightHandFingers.map(finger => fingerprintMap[finger] || '');
  const leftHandPrints = leftHandFingers.map(finger => fingerprintMap[finger] || '');

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>FICHA DEL INTERNO - ${inmate.value.full_name}</title>
      <style>
        @page {
          size: letter;
          margin: 1cm;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: Arial, sans-serif;
          font-size: 10pt;
          line-height: 1.3;
        }

        .page {
          page-break-after: always;
          padding: 15px;
        }

        .page:last-child {
          page-break-after: auto;
        }

        /* Header */
        .official-header {
          text-align: center;
          margin-bottom: 15px;
          border-bottom: 3px solid #000;
          padding-bottom: 10px;
        }

        .official-header h1 {
          font-size: 11pt;
          font-weight: bold;
          margin-bottom: 3px;
        }

        .official-header h2 {
          font-size: 10pt;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .official-header .title {
          font-size: 12pt;
          font-weight: bold;
          margin: 5px 0;
        }

        .header-info {
          display: flex;
          justify-content: space-between;
          font-size: 8pt;
          margin-top: 5px;
        }

        /* Main container */
        .main-container {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }

        .photo-section {
          flex-shrink: 0;
          width: 150px;
        }

        .photo-section img {
          width: 150px;
          height: 180px;
          object-fit: cover;
          border: 2px solid #333;
        }

        .info-section {
          flex: 1;
        }

        /* Data rows */
        .data-row {
          display: flex;
          margin-bottom: 4px;
          font-size: 9pt;
        }

        .data-row.full {
          flex-direction: column;
        }

        .data-label {
          font-weight: bold;
          min-width: 140px;
          flex-shrink: 0;
        }

        .data-value {
          flex: 1;
        }

        /* Section titles */
        .section-title {
          background-color: #333;
          color: white;
          padding: 5px 10px;
          font-size: 10pt;
          font-weight: bold;
          margin: 15px 0 10px 0;
          text-align: center;
          letter-spacing: 2px;
        }

        /* Physical characteristics */
        .characteristics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-top: 10px;
        }

        .char-item {
          font-size: 9pt;
        }

        .char-label {
          font-weight: bold;
          display: inline-block;
          min-width: 80px;
        }

        /* Fingerprints */
        .fingerprints-container {
          margin: 20px 0;
        }

        .fingerprints-row {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin: 20px 0;
        }

        .fingerprint-box {
          width: 80px;
          height: 100px;
          border: 2px solid #333;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .fingerprint-box img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .fingerprint-placeholder {
          color: #ccc;
          font-size: 8pt;
          text-align: center;
        }

        .fingerprints-label {
          text-align: center;
          font-weight: bold;
          margin: 10px 0;
          font-size: 9pt;
        }

        /* Signatures */
        .signatures {
          display: flex;
          justify-content: space-around;
          margin-top: 40px;
          padding-top: 20px;
        }

        .signature-box {
          text-align: center;
          flex: 1;
        }

        .signature-line {
          border-top: 1px solid #333;
          margin-top: 60px;
          padding-top: 5px;
          font-size: 8pt;
          font-weight: bold;
        }

        /* Table styles */
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
          font-size: 9pt;
        }

        .data-table td {
          padding: 4px 8px;
          border: 1px solid #ddd;
        }

        .data-table td:first-child {
          font-weight: bold;
          background: #f5f5f5;
          width: 180px;
        }

        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <!-- PÁGINA 1 -->
      <div class="page">
        <!-- Official Header -->
        <div class="official-header">
          <h1>${inmate.value.current_center?.name?.toUpperCase() || 'CENTRO PENITENCIARIO'}</h1>
          <h2>MINISTERIO DE GOBERNACIÓN</h2>
          <div class="title">FICHA DEL INTERNO(A)</div>
          <div class="header-info">
            <span>Página 1 de 2</span>
            <span>Fecha Emisión: ${new Date().toLocaleDateString('es-GT')} ${new Date().toLocaleTimeString('es-GT', {hour: '2-digit', minute: '2-digit'})}</span>
            <span>Sistema: GP360</span>
          </div>
        </div>

        <!-- Main Content -->
        <div class="main-container">
          <!-- Photo Section -->
          <div class="photo-section">
            <img src="${photoUrl}" alt="Foto del Interno">
          </div>

          <!-- Info Section -->
          <div class="info-section">
            <div class="data-row full" style="margin-bottom: 10px;">
              <span class="data-label">Nombre Completo:</span>
              <span class="data-value" style="font-size: 12pt; font-weight: bold;">${inmate.value.full_name?.toUpperCase() || 'N/A'}</span>
            </div>
            <div class="data-row">
              <span class="data-label">No. Interno:</span>
              <span class="data-value">${inmate.value.inmate_number || 'N/A'}</span>
            </div>
            <div class="data-row">
              <span class="data-label">No. Expediente:</span>
              <span class="data-value">${inmate.value.internal_number || 'N/A'}</span>
            </div>
            <div class="data-row">
              <span class="data-label">DPI:</span>
              <span class="data-value">${inmate.value.document_number || 'N/A'}</span>
            </div>
            <div class="data-row">
              <span class="data-label">Alias/Apodo:</span>
              <span class="data-value">${inmate.value.alias || 'N/A'}</span>
            </div>
            <div class="data-row">
              <span class="data-label">Estado:</span>
              <span class="data-value">${getStatusLabel(inmate.value.status)}</span>
            </div>
            <div class="data-row">
              <span class="data-label">Centro Actual:</span>
              <span class="data-value">${inmate.value.current_center?.name || 'N/A'}</span>
            </div>
            <div class="data-row">
              <span class="data-label">Sector:</span>
              <span class="data-value">${inmate.value.current_sector?.name || 'N/A'}</span>
            </div>
            <div class="data-row">
              <span class="data-label">Celda:</span>
              <span class="data-value">${inmate.value.current_cell?.name || inmate.value.current_cell_number || 'N/A'}</span>
            </div>
            <div class="data-row">
              <span class="data-label">Clasificación Riesgo:</span>
              <span class="data-value">${riskLevel}</span>
            </div>
          </div>
        </div>

        <!-- DATOS PERSONALES -->
        <div class="section-title">DATOS PERSONALES</div>
        <table class="data-table">
          <tr>
            <td>Fecha de Nacimiento:</td>
            <td>${formatDate(inmate.value.birth_date)}</td>
            <td>Edad:</td>
            <td>${calculateAge(inmate.value.birth_date)} años</td>
          </tr>
          <tr>
            <td>Género:</td>
            <td>${inmate.value.gender === 'M' ? 'MASCULINO' : 'FEMENINO'}</td>
            <td>Estado Civil:</td>
            <td>${inmate.value.civil_status?.name || 'N/A'}</td>
          </tr>
          <tr>
            <td>Nacionalidad:</td>
            <td>${inmate.value.nationality?.name || 'GUATEMALTECA'}</td>
            <td>Grupo Étnico:</td>
            <td>${inmate.value.ethnic_group?.name || 'N/A'}</td>
          </tr>
          <tr>
            <td>Lugar de Nacimiento:</td>
            <td>${inmate.value.birth_municipality?.name || 'N/A'}, ${inmate.value.birth_department?.name || 'N/A'}</td>
            <td>Idioma Principal:</td>
            <td>${inmate.value.primary_language?.name || 'Español'}</td>
          </tr>
          <tr>
            <td>Padre:</td>
            <td colspan="3">${inmate.value.father_name || 'N/A'}</td>
          </tr>
          <tr>
            <td>Madre:</td>
            <td colspan="3">${inmate.value.mother_name || 'N/A'}</td>
          </tr>
          <tr>
            <td>Dirección Residencia:</td>
            <td colspan="3">${inmate.value.address || 'N/A'}</td>
          </tr>
          <tr>
            <td>Municipio/Depto.:</td>
            <td>${inmate.value.municipality?.name || 'N/A'}, ${inmate.value.department?.name || 'N/A'}</td>
            <td>Teléfono:</td>
            <td>${inmate.value.phone || 'N/A'}</td>
          </tr>
          <tr>
            <td>Ocupación:</td>
            <td>${inmate.value.occupation?.name || inmate.value.occupation_details || 'N/A'}</td>
            <td>Nivel Académico:</td>
            <td>${inmate.value.academic_degree?.name || 'N/A'}</td>
          </tr>
          <tr>
            <td>No. de Hijos:</td>
            <td>${inmate.value.number_of_children || '0'}</td>
            <td>Religión:</td>
            <td>${inmate.value.religion?.name || 'N/A'}</td>
          </tr>
        </table>

        <!-- DATOS DE INGRESO -->
        <div class="section-title">DATOS DE INGRESO</div>
        <table class="data-table">
          <tr>
            <td>Fecha de Admisión:</td>
            <td>${formatDate(inmate.value.admission_date)}</td>
            <td>Centro de Ingreso:</td>
            <td>${inmate.value.admission_center?.name || inmate.value.current_center?.name || 'N/A'}</td>
          </tr>
          <tr>
            <td>Remitido por:</td>
            <td>${inmate.value.remitting_court?.name || primaryLegalProfile.court?.name || 'N/A'}</td>
            <td>Situación Jurídica:</td>
            <td>${primaryLegalProfile.legal_status?.toUpperCase() || 'PRISIÓN PREVENTIVA'}</td>
          </tr>
          <tr>
            <td>Delito(s) Principal(es):</td>
            <td colspan="3">${allCrimes.slice(0, 3).join(', ') || 'N/A'}</td>
          </tr>
        </table>

        <!-- CARACTERÍSTICAS FÍSICAS -->
        <div class="section-title">CARACTERÍSTICAS FÍSICAS</div>
        <table class="data-table">
          <tr>
            <td>Estatura:</td>
            <td>${physical.height ? physical.height + ' m' : 'N/A'}</td>
            <td>Peso:</td>
            <td>${physical.weight ? physical.weight + ' kg' : 'N/A'}</td>
          </tr>
          <tr>
            <td>Tono de Piel:</td>
            <td>${physical.skin_tone?.toUpperCase() || 'N/A'}</td>
            <td>Tipo de Sangre:</td>
            <td>${inmate.value.blood_type?.name || medical.blood_type?.name || 'N/A'}</td>
          </tr>
          <tr>
            <td>Color de Ojos:</td>
            <td>${physical.eye_color?.toUpperCase() || 'N/A'}</td>
            <td>Forma de Ojos:</td>
            <td>${physical.eye_shape?.toUpperCase() || 'N/A'}</td>
          </tr>
          <tr>
            <td>Tipo de Cabello:</td>
            <td>${physical.hair_type?.toUpperCase() || 'N/A'}</td>
            <td>Color de Cabello:</td>
            <td>${physical.hair_color?.toUpperCase() || 'N/A'}</td>
          </tr>
          <tr>
            <td>Tipo de Nariz:</td>
            <td>${physical.nose_type?.toUpperCase() || 'N/A'}</td>
            <td>Tipo de Boca:</td>
            <td>${physical.mouth_type?.toUpperCase() || 'N/A'}</td>
          </tr>
          <tr>
            <td>Barba:</td>
            <td>${physical.has_beard ? 'SÍ' : 'NO'}</td>
            <td>Bigote:</td>
            <td>${physical.has_mustache ? 'SÍ' : 'NO'}</td>
          </tr>
        </table>

        <!-- MARCAS DISTINTIVAS -->
        ${physical.tattoos_description || physical.scars_description || physical.birthmarks || physical.other_distinguishing_marks ? `
        <div class="section-title">MARCAS DISTINTIVAS</div>
        <table class="data-table">
          ${physical.tattoos_description ? `<tr><td>Tatuajes:</td><td colspan="3">${physical.tattoos_description.toUpperCase()}</td></tr>` : ''}
          ${physical.scars_description ? `<tr><td>Cicatrices:</td><td colspan="3">${physical.scars_description.toUpperCase()}</td></tr>` : ''}
          ${physical.birthmarks ? `<tr><td>Marcas de Nacimiento:</td><td colspan="3">${physical.birthmarks.toUpperCase()}</td></tr>` : ''}
          ${physical.other_distinguishing_marks ? `<tr><td>Otras Marcas:</td><td colspan="3">${physical.other_distinguishing_marks.toUpperCase()}</td></tr>` : ''}
        </table>
        ` : ''}

        <!-- INFORMACIÓN MÉDICA CRÍTICA -->
        ${allergies !== 'Ninguna' || chronicDiseases !== 'Ninguna' || medical.disabilities?.length > 0 ? `
        <div class="section-title">INFORMACIÓN MÉDICA CRÍTICA</div>
        <table class="data-table">
          <tr>
            <td>Alergias:</td>
            <td colspan="3">${allergies}</td>
          </tr>
          <tr>
            <td>Enfermedades Crónicas:</td>
            <td colspan="3">${chronicDiseases}</td>
          </tr>
          ${medical.disabilities?.length > 0 ? `<tr><td>Discapacidades:</td><td colspan="3">${medical.disabilities.map((d: any) => d.disability_type || d.name).join(', ')}</td></tr>` : ''}
        </table>
        ` : ''}
      </div>

      <!-- PÁGINA 2 -->
      <div class="page">
        <!-- Official Header -->
        <div class="official-header">
          <h1>${inmate.value.current_center?.name?.toUpperCase() || 'CENTRO PENITENCIARIO'}</h1>
          <h2>MINISTERIO DE GOBERNACIÓN</h2>
          <div class="title">FICHA DEL INTERNO(A)</div>
          <div class="header-info">
            <span>Página 2 de 2</span>
            <span>Fecha Emisión: ${new Date().toLocaleDateString('es-GT')} ${new Date().toLocaleTimeString('es-GT', {hour: '2-digit', minute: '2-digit'})}</span>
            <span>Sistema: GP360</span>
          </div>
        </div>

        <!-- INFORMACIÓN JURÍDICA -->
        <div class="section-title">INFORMACIÓN JURÍDICA</div>
        <table class="data-table">
          <tr>
            <td>Situación Jurídica:</td>
            <td colspan="3">${primaryLegalProfile.legal_status?.toUpperCase() || 'PRISIÓN PREVENTIVA'}</td>
          </tr>
          <tr>
            <td>No. Causa Penal:</td>
            <td>${primaryLegalProfile.case_number || 'N/A'}</td>
            <td>No. Expediente Judicial:</td>
            <td>${primaryLegalProfile.judicial_file_number || 'N/A'}</td>
          </tr>
          <tr>
            <td>Fecha de Captura:</td>
            <td>${primaryLegalProfile.arrest_date ? formatDate(primaryLegalProfile.arrest_date) : 'N/A'}</td>
            <td>Fecha de Ingreso:</td>
            <td>${formatDate(inmate.value.admission_date)}</td>
          </tr>
          <tr>
            <td>Juzgado/Tribunal:</td>
            <td colspan="3">${primaryLegalProfile.court?.name || 'N/A'}</td>
          </tr>
          <tr>
            <td>Delito(s):</td>
            <td colspan="3">${allCrimes.join(', ') || 'N/A'}</td>
          </tr>
          ${primaryLegalProfile.sentence_years ? `
          <tr>
            <td>Sentencia:</td>
            <td>${primaryLegalProfile.sentence_years} años ${primaryLegalProfile.sentence_months || 0} meses</td>
            <td>Fecha Sentencia:</td>
            <td>${primaryLegalProfile.sentence_date ? formatDate(primaryLegalProfile.sentence_date) : 'N/A'}</td>
          </tr>
          ` : ''}
          ${primaryLegalProfile.expected_release_date ? `
          <tr>
            <td>Fecha Estimada Liberación:</td>
            <td colspan="3">${formatDate(primaryLegalProfile.expected_release_date)}</td>
          </tr>
          ` : ''}
        </table>

        <!-- CLASIFICACIÓN DE SEGURIDAD -->
        <div class="section-title">CLASIFICACIÓN DE SEGURIDAD</div>
        <table class="data-table">
          <tr>
            <td>Clasificación de Riesgo:</td>
            <td>${riskLevel}</td>
            <td>Nivel de Seguridad:</td>
            <td>${inmate.value.security_level?.toUpperCase() || 'NO ASIGNADO'}</td>
          </tr>
          <tr>
            <td>Clasificación de Seguridad:</td>
            <td colspan="3">${securityClass}</td>
          </tr>
          ${gangInfo ? `
          <tr>
            <td>Afiliación a Pandilla:</td>
            <td colspan="3">AFIRMATIVO - ${gangInfo.gang?.name || 'VERIFICAR'}</td>
          </tr>
          ` : `
          <tr>
            <td>Afiliación a Pandilla:</td>
            <td colspan="3">${inmate.value.gang_affiliation_status || 'NO REGISTRADA'}</td>
          </tr>
          `}
          ${inmate.value.requires_special_protection ? `
          <tr>
            <td>Protección Especial:</td>
            <td colspan="3">SÍ - ${inmate.value.protection_reasons || 'Ver notas de seguridad'}</td>
          </tr>
          ` : ''}
          ${inmate.value.high_profile_case ? `
          <tr>
            <td>Caso de Alto Perfil:</td>
            <td colspan="3">SÍ</td>
          </tr>
          ` : ''}
        </table>

        <!-- CONTACTO DE EMERGENCIA -->
        <div class="section-title" style="margin-top: 20px;">CONTACTO DE EMERGENCIA</div>
        <table class="data-table">
          <tr>
            <td>Nombre Completo:</td>
            <td colspan="3">${emergencyContact.full_name || inmate.value.emergency_contact_name || 'N/A'}</td>
          </tr>
          <tr>
            <td>Parentesco:</td>
            <td>${emergencyContact.relationship_type?.name || inmate.value.emergency_contact_relationship?.name || 'N/A'}</td>
            <td>Teléfono:</td>
            <td>${emergencyContact.phone || inmate.value.emergency_contact_phone || 'N/A'}</td>
          </tr>
          <tr>
            <td>Dirección:</td>
            <td colspan="3">${emergencyContact.address || inmate.value.emergency_contact_address || 'N/A'}</td>
          </tr>
        </table>

        <!-- Fingerprints -->
        <div class="fingerprints-container">
          <div class="fingerprints-label">HUELLAS DIGITALES MANO DERECHA DEL INTERNO</div>
          <div class="fingerprints-row">
            ${rightHandPrints.map((print, index) => `
              <div class="fingerprint-box">
                ${print ? `<img src="${print}" alt="Huella ${index + 1}">` : '<div class="fingerprint-placeholder">No capturada</div>'}
              </div>
            `).join('')}
          </div>

          <div style="text-align: center; margin: 20px 0;">
            <div style="border-top: 1px solid #333; display: inline-block; padding-top: 5px; min-width: 300px;">
              (F) ${inmate.value.full_name?.toUpperCase() || 'NOMBRE DEL INTERNO'}
            </div>
            <div style="font-weight: bold; font-size: 9pt; margin-top: 5px;">INTERNO</div>
          </div>

          <div class="fingerprints-label">HUELLAS DIGITALES MANO IZQUIERDA DEL INTERNO</div>
          <div class="fingerprints-row">
            ${leftHandPrints.map((print, index) => `
              <div class="fingerprint-box">
                ${print ? `<img src="${print}" alt="Huella ${index + 6}">` : '<div class="fingerprint-placeholder">No capturada</div>'}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Signatures -->
        <div class="signatures">
          <div class="signature-box">
            <div class="signature-line">(F) _______________________</div>
            <div style="font-weight: bold; margin-top: 5px; font-size: 9pt;">OPERADOR RESPONSABLE</div>
          </div>
          <div class="signature-box">
            <div class="signature-line">(F) _______________________</div>
            <div style="font-weight: bold; margin-top: 5px; font-size: 9pt;">FICHADOR RESPONSABLE</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
  }, 500);
};

const exportData = async () => {
  try {
    if (!inmate.value) return;

    Swal.fire({
      title: "Exportando...",
      text: "Generando archivo de exportación",
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
        title: 'Exportación Completada',
        text: 'Los datos se han exportado en formato JSON',
        timer: 2000
      });
    } else {
      throw new Error('No se pudieron exportar los datos');
    }
  } catch (error: any) {
    console.error('Error exporting data:', error);
    await Swal.fire({
      title: "Error",
      text: error.response?.data?.message || "No se pudieron exportar los datos",
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
    title: 'Traslado Registrado',
    text: 'El traslado se ha registrado correctamente',
    timer: 2000
  });

  closeTransferModal();
  await loadInmate(); // Reload inmate data
};

const handleStatusChanged = async () => {
  await Swal.fire({
    icon: 'success',
    title: 'Estado Actualizado',
    text: 'El estado del PPL se ha actualizado correctamente',
    timer: 2000
  });

  await loadInmate(); // Reload inmate data
};

const handleReleased = async () => {
  await Swal.fire({
    icon: 'success',
    title: 'PPL Liberado',
    text: 'El proceso de liberación se ha completado correctamente',
    confirmButtonText: 'Volver al Listado'
  });

  router.push('/inmates');
};

// Load data on mount
onMounted(() => {
  loadInmate();
});
</script>
