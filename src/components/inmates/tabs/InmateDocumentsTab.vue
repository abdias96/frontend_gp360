<template>
  <div class="d-flex flex-column gap-7">
    <!--begin::Documents Overview Card-->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label fw-bold text-gray-900">Resumen de Documentos</span>
          <span class="text-muted mt-1 fw-semibold fs-7">Gestión digital y procesamiento con IA</span>
        </h3>
        <div class="card-toolbar">
          <button
            v-if="canEdit"
            type="button"
            class="btn btn-sm btn-light-primary"
            @click="openDocumentSummaryModal"
          >
            <i class="ki-duotone ki-pencil fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Actualizar
          </button>
        </div>
      </div>
      <div class="card-body">
        <div v-if="loadingProfile" class="d-flex justify-content-center py-10">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
        
        <div v-else class="row g-6">
          <!--begin::Total Documents-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Total Documentos</span>
              <span class="fs-5 fw-bold text-primary">
                {{ documentStats.total_documents || 0 }}
              </span>
            </div>
          </div>
          <!--end::Total Documents-->
          
          <!--begin::Pending Reviews-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Pendientes Revisión</span>
              <span class="fs-5 fw-bold text-warning">
                {{ documentStats.pending_review || 0 }}
              </span>
            </div>
          </div>
          <!--end::Pending Reviews-->
          
          <!--begin::AI Processed-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Procesados con IA</span>
              <span class="fs-5 fw-bold text-info">
                {{ documentStats.ai_processed || 0 }}
              </span>
            </div>
          </div>
          <!--end::AI Processed-->
          
          <!--begin::Digital Signatures-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Firmas Digitales</span>
              <span class="fs-5 fw-bold text-success">
                {{ documentStats.digital_signatures || 0 }}
              </span>
            </div>
          </div>
          <!--end::Digital Signatures-->
        </div>
        
        <!--begin::Document Alerts-->
        <div v-if="documentAlerts.length > 0" class="mt-6">
          <h6 class="text-info fw-bold mb-3">
            <i class="ki-duotone ki-document fs-2 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Alertas de Documentos
          </h6>
          <div class="row g-3">
            <div v-for="alert in documentAlerts" :key="alert.id" class="col-md-6">
              <div class="alert" :class="`alert-${alert.severity}`" role="alert">
                <div class="d-flex align-items-center">
                  <i :class="`ki-duotone ki-${alert.icon} fs-2 me-3`">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                  </i>
                  <div>
                    <div class="fw-bold">{{ alert.title }}</div>
                    <div class="fs-7">{{ alert.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--end::Document Alerts-->
      </div>
    </div>
    <!--end::Documents Overview Card-->
    
    <!--begin::Documents Modules Grid-->
    <div class="row g-5">
      <!--begin::Recent Documents-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Documentos Recientes</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/documents/all`"
                class="btn btn-sm btn-light-primary"
              >
                Ver Todos
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="recentDocuments.length > 0">
              <div v-for="doc in recentDocuments.slice(0, 3)" :key="doc.id" class="d-flex align-items-center mb-4">
                <div class="symbol symbol-40px me-3">
                  <div class="symbol-label" :class="getDocumentTypeColor(doc.type)">
                    <i :class="`ki-duotone ki-${getDocumentIcon(doc.type)} fs-2 ${getDocumentIconColor(doc.type)}`">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ doc.name }}</div>
                  <div class="text-muted fs-7">{{ doc.category }}</div>
                  <div class="text-muted fs-8">{{ formatDate(doc.uploaded_at) }}</div>
                </div>
                <div class="d-flex flex-column align-items-end">
                  <span :class="`badge badge-light-${getStatusColor(doc.status)}`">
                    {{ doc.status }}
                  </span>
                  <span v-if="doc.is_ai_processed" class="badge badge-light-info mt-1">
                    <i class="ki-duotone ki-technology-2 fs-6 me-1">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                    IA
                  </span>
                </div>
              </div>
              <div v-if="recentDocuments.length > 3" class="text-center mt-3">
                <span class="text-muted fs-7">+{{ recentDocuments.length - 3 }} más</span>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-folder-up fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="text-muted mt-3">Sin documentos recientes</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Recent Documents-->
      
      <!--begin::Legal Documents-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Documentos Legales</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/documents/legal`"
                class="btn btn-sm btn-light-warning"
              >
                Ver Expediente
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="legalDocuments.length > 0">
              <div v-for="doc in legalDocuments.slice(0, 3)" :key="doc.id" class="d-flex align-items-center mb-4">
                <div class="symbol symbol-40px me-3">
                  <div class="symbol-label bg-light-warning">
                    <i class="ki-duotone ki-judge fs-2 text-warning">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ doc.name }}</div>
                  <div class="text-muted fs-7">{{ doc.court || doc.authority }}</div>
                  <div class="text-muted fs-8">{{ formatDate(doc.document_date) }}</div>
                </div>
                <span v-if="doc.is_signed" class="badge badge-light-success">
                  <i class="ki-duotone ki-verify fs-6 me-1">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  Firmado
                </span>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-judge fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="text-muted mt-3">Sin documentos legales</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Legal Documents-->
      
      <!--begin::Medical Documents-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Documentos Médicos</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/documents/medical`"
                class="btn btn-sm btn-light-info"
              >
                Ver Historial
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="medicalDocuments.length > 0">
              <div v-for="doc in medicalDocuments.slice(0, 3)" :key="doc.id" class="d-flex align-items-center mb-4">
                <div class="symbol symbol-40px me-3">
                  <div class="symbol-label bg-light-info">
                    <i class="ki-duotone ki-medicine fs-2 text-info">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ doc.name }}</div>
                  <div class="text-muted fs-7">{{ doc.medical_specialty || 'Medicina General' }}</div>
                  <div class="text-muted fs-8">{{ formatDate(doc.created_at) }}</div>
                </div>
                <span v-if="doc.is_confidential" class="badge badge-light-danger">
                  <i class="ki-duotone ki-eye-slash fs-6 me-1">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                    <span class="path4"></span>
                  </i>
                  Confidencial
                </span>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-medicine fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="text-muted mt-3">Sin documentos médicos</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Medical Documents-->
      
      <!--begin::Administrative Documents-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Documentos Administrativos</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/documents/administrative`"
                class="btn btn-sm btn-light-secondary"
              >
                Ver Archivo
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="administrativeDocuments.length > 0">
              <div v-for="doc in administrativeDocuments.slice(0, 3)" :key="doc.id" class="d-flex align-items-center mb-4">
                <div class="symbol symbol-40px me-3">
                  <div class="symbol-label bg-light-secondary">
                    <i class="ki-duotone ki-office-bag fs-2 text-secondary">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ doc.name }}</div>
                  <div class="text-muted fs-7">{{ doc.department || 'Administración' }}</div>
                  <div class="text-muted fs-8">{{ formatDate(doc.created_at) }}</div>
                </div>
                <span :class="`badge badge-light-${getApprovalStatusColor(doc.approval_status)}`">
                  {{ doc.approval_status || 'Pendiente' }}
                </span>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-office-bag fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="text-muted mt-3">Sin documentos administrativos</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Administrative Documents-->
    </div>
    <!--end::Documents Modules Grid-->
    
    <!--begin::Quick Actions-->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Acciones Rápidas</h3>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/documents/upload`"
              class="btn btn-flex btn-light-primary w-100 py-4"
            >
              <i class="ki-duotone ki-file-up fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Subir Documento</span>
            </router-link>
          </div>
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/documents/ai-processing`"
              class="btn btn-flex btn-light-info w-100 py-4"
            >
              <i class="ki-duotone ki-technology-2 fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Procesamiento IA</span>
            </router-link>
          </div>
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/documents/digital-signatures`"
              class="btn btn-flex btn-light-success w-100 py-4"
            >
              <i class="ki-duotone ki-verify fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Firmas Digitales</span>
            </router-link>
          </div>
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/documents/search`"
              class="btn btn-flex btn-light-warning w-100 py-4"
            >
              <i class="ki-duotone ki-magnifier fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Buscar Documentos</span>
            </router-link>
          </div>
        </div>
        
        <div class="separator my-5"></div>
        
        <div class="row g-3">
          <div class="col-md-4">
            <router-link 
              :to="`/inmates/${inmate.id}/documents/archive`"
              class="btn btn-flex btn-light w-100 py-3"
            >
              <i class="ki-duotone ki-archive fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span>Archivo Digital</span>
            </router-link>
          </div>
          <div class="col-md-4">
            <router-link 
              :to="`/inmates/${inmate.id}/documents/templates`"
              class="btn btn-flex btn-light w-100 py-3"
            >
              <i class="ki-duotone ki-document fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span>Plantillas</span>
            </router-link>
          </div>
          <div class="col-md-4">
            <router-link 
              :to="`/inmates/${inmate.id}/documents/audit`"
              class="btn btn-flex btn-light w-100 py-3"
            >
              <i class="ki-duotone ki-security-check fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
              <span>Auditoría</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!--end::Quick Actions-->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import { formatDate, formatDateTime } from '@/core/helpers/formatters';

// Props
interface Props {
  inmate: any;
}

const props = defineProps<Props>();

// Stores
const authStore = useAuthStore();

// State
const documentStats = ref<any>({});
const recentDocuments = ref<any[]>([]);
const legalDocuments = ref<any[]>([]);
const medicalDocuments = ref<any[]>([]);
const administrativeDocuments = ref<any[]>([]);
const loadingProfile = ref(false);

// Computed
const canEdit = computed(() => authStore.hasPermission('documents.manage'));

const documentAlerts = computed(() => {
  const alerts = [];
  
  if (documentStats.value?.pending_review > 10) {
    alerts.push({
      id: 'many_pending',
      severity: 'warning',
      icon: 'time',
      title: 'Muchos Documentos Pendientes',
      description: `${documentStats.value.pending_review} documentos requieren revisión`
    });
  }
  
  if (documentStats.value?.ai_processing_errors > 0) {
    alerts.push({
      id: 'ai_errors',
      severity: 'danger',
      icon: 'technology-2',
      title: 'Errores en Procesamiento IA',
      description: `${documentStats.value.ai_processing_errors} documentos fallaron en procesamiento`
    });
  }
  
  if (documentStats.value?.missing_signatures > 0) {
    alerts.push({
      id: 'missing_signatures',
      severity: 'info',
      icon: 'verify',
      title: 'Firmas Pendientes',
      description: `${documentStats.value.missing_signatures} documentos requieren firma digital`
    });
  }
  
  return alerts;
});

// Methods
const getDocumentTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'legal': 'bg-light-warning',
    'medical': 'bg-light-info',
    'administrative': 'bg-light-secondary',
    'personal': 'bg-light-primary',
    'judicial': 'bg-light-danger'
  };
  return colors[type] || 'bg-light-primary';
};

const getDocumentIcon = (type: string) => {
  const icons: Record<string, string> = {
    'legal': 'judge',
    'medical': 'medicine',
    'administrative': 'office-bag',
    'personal': 'user',
    'judicial': 'security-check'
  };
  return icons[type] || 'document';
};

const getDocumentIconColor = (type: string) => {
  const colors: Record<string, string> = {
    'legal': 'text-warning',
    'medical': 'text-info',
    'administrative': 'text-secondary',
    'personal': 'text-primary',
    'judicial': 'text-danger'
  };
  return colors[type] || 'text-primary';
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'aprobado': 'success',
    'pendiente': 'warning',
    'rechazado': 'danger',
    'en_revision': 'info',
    'archivado': 'secondary'
  };
  return colors[status] || 'secondary';
};

const getApprovalStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Aprobado': 'success',
    'Pendiente': 'warning',
    'Rechazado': 'danger',
    'En Revisión': 'info'
  };
  return colors[status] || 'warning';
};

const fetchDocumentData = async () => {
  loadingProfile.value = true;
  try {
    // Load digital files from inmate props
    const digitalFilesData = props.inmate.digital_files ||
                             props.inmate.digitalFiles ||
                             props.inmate.documents || [];

    // Map digital files to a consistent format
    // DB columns: document_file_type_id (FK), original_filename, document_title,
    // confidentiality_level, ai_analysis_status, digitally_signed, document_date,
    // document_source, document_tags, human_review_required, review_status
    const allDocuments = Array.isArray(digitalFilesData)
      ? digitalFilesData.map((doc: any) => {
          const fileType = doc.document_file_type || doc.documentFileType;
          const uploader = doc.uploaded_by_user || doc.uploadedBy || doc.uploaded_by;
          return {
            id: doc.id,
            name: doc.document_title || doc.original_filename || doc.file_name || 'Documento',
            type: fileType?.category || 'other',
            category: fileType?.name || 'General',
            status: doc.review_status || (doc.confidentiality_level === 'confidential' ? 'restringido' : 'aprobado'),
            uploaded_at: doc.document_date || doc.created_at,
            created_at: doc.created_at,
            is_ai_processed: doc.ai_analysis_completed || doc.ai_analysis_status === 'completed',
            is_signed: doc.digitally_signed || false,
            is_confidential: ['confidential', 'restricted', 'classified'].includes(doc.confidentiality_level),
            file_url: doc.file_path,
            uploader_name: typeof uploader === 'object' ? uploader?.name : null,
            description: doc.document_description || doc.description,
            tags: doc.document_tags || doc.tags,
            document_date: doc.document_date || doc.created_at,
            court: doc.document_source,
            authority: doc.document_source,
            medical_specialty: fileType?.category === 'medical' ? fileType?.name : null,
            department: fileType?.category === 'administrative' ? fileType?.name : null,
            approval_status: doc.review_status === 'approved' ? 'Aprobado'
              : doc.review_status === 'rejected' ? 'Rechazado'
              : doc.review_status === 'needs_correction' ? 'En Revisión'
              : 'Pendiente'
          };
        })
      : [];

    // Sort by most recent first
    allDocuments.sort((a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Recent documents (last 5)
    recentDocuments.value = allDocuments.slice(0, 5);

    // Categorize documents by type
    legalDocuments.value = allDocuments.filter((doc: any) =>
      doc.type === 'legal' || doc.type === 'judicial' ||
      doc.category?.toLowerCase().includes('legal') ||
      doc.category?.toLowerCase().includes('judicial')
    ).slice(0, 5);

    medicalDocuments.value = allDocuments.filter((doc: any) =>
      doc.type === 'medical' ||
      doc.category?.toLowerCase().includes('médic') ||
      doc.category?.toLowerCase().includes('medic') ||
      doc.category?.toLowerCase().includes('salud')
    ).slice(0, 5);

    administrativeDocuments.value = allDocuments.filter((doc: any) =>
      doc.type === 'administrative' ||
      doc.category?.toLowerCase().includes('administrativ') ||
      doc.category?.toLowerCase().includes('admin')
    ).slice(0, 5);

    // Calculate statistics from raw data for accuracy
    const pendingReview = digitalFilesData.filter((doc: any) =>
      doc.human_review_required && doc.review_status !== 'approved'
    ).length;

    const aiProcessed = digitalFilesData.filter((doc: any) =>
      doc.ai_analysis_completed || doc.ai_analysis_status === 'completed'
    ).length;

    const aiFailed = digitalFilesData.filter((doc: any) =>
      doc.ai_analysis_status === 'failed'
    ).length;

    const digitalSignatures = digitalFilesData.filter((doc: any) =>
      doc.digitally_signed
    ).length;

    const missingSigs = digitalFilesData.filter((doc: any) =>
      doc.requires_digital_signature && !doc.digitally_signed
    ).length;

    documentStats.value = {
      total_documents: allDocuments.length,
      pending_review: pendingReview,
      ai_processed: aiProcessed,
      digital_signatures: digitalSignatures,
      ai_processing_errors: aiFailed,
      missing_signatures: missingSigs
    };

  } catch (error) {
    console.error('Error fetching document data:', error);
    // Set default values in case of error
    documentStats.value = {
      total_documents: 0,
      pending_review: 0,
      ai_processed: 0,
      digital_signatures: 0,
      ai_processing_errors: 0,
      missing_signatures: 0
    };
    recentDocuments.value = [];
    legalDocuments.value = [];
    medicalDocuments.value = [];
    administrativeDocuments.value = [];
  } finally {
    loadingProfile.value = false;
  }
};

const openDocumentSummaryModal = async () => {
  await Swal.fire({
    title: 'Actualizar Resumen de Documentos',
    text: 'Esta funcionalidad estará disponible próximamente',
    icon: 'info'
  });
};

// Lifecycle
onMounted(() => {
  fetchDocumentData();
});
</script>