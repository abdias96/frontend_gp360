<template>
  <div 
    id="securityClassificationHistoryModal" 
    class="modal fade" 
    tabindex="-1" 
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">
            Historial de Clasificaciones de Seguridad
            <span v-if="inmate" class="text-muted fs-6 ms-2">
              - {{ getInmateName(inmate) }}
            </span>
          </h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" @click="close">
            <i class="ki-duotone ki-cross fs-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
        </div>

        <div class="modal-body py-10 px-lg-17">
          <!-- Loading -->
          <div v-if="loading" class="text-center py-10">
            <div class="spinner-border spinner-border-lg text-primary" role="status">
              <span class="visually-hidden">Cargando historial...</span>
            </div>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="alert alert-danger">
            <div class="d-flex">
              <i class="ki-duotone ki-cross-circle fs-2tx text-danger me-4">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="d-flex flex-column">
                <h4 class="mb-1 text-danger">Error al cargar historial</h4>
                <span>{{ error }}</span>
              </div>
            </div>
          </div>

          <!-- Classifications History -->
          <div v-else-if="classifications.length > 0" class="timeline timeline-border-dashed">
            <div 
              v-for="(classification, index) in classifications" 
              :key="classification.id"
              class="timeline-item"
            >
              <div class="timeline-line w-40px"></div>
              
              <div class="timeline-icon symbol symbol-circle symbol-40px">
                <div 
                  class="symbol-label"
                  :class="getTimelineIconClass(classification, index)"
                >
                  <i 
                    class="ki-duotone fs-2"
                    :class="getTimelineIcon(classification)"
                  >
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                  </i>
                </div>
              </div>
              
              <div class="timeline-content mb-10 mt-n1">
                <div class="pe-3 mb-5">
                  <div class="fs-5 fw-semibold mb-2">
                    {{ getSecurityLevelLabel(classification.classification_level) }}
                    <span 
                      v-if="classification.is_current"
                      class="badge badge-light-success ms-2"
                    >
                      Actual
                    </span>
                  </div>
                  
                  <div class="d-flex align-items-center mt-1 fs-6">
                    <div class="text-muted me-2 fs-7">
                      {{ formatDate(classification.classification_date) }}
                    </div>
                    <div class="text-muted me-2 fs-7">•</div>
                    <div class="text-muted me-2 fs-7">
                      {{ getClassificationTypeLabel(classification.classification_type) }}
                    </div>
                  </div>
                </div>
                
                <div class="overflow-auto pb-5">
                  <div class="d-flex gap-7 mb-4">
                    <!-- Risk Assessment -->
                    <div>
                      <div class="fw-semibold text-gray-600 mb-2">Evaluación de Riesgos:</div>
                      <div class="d-flex flex-wrap gap-2">
                        <span 
                          class="badge fs-8"
                          :class="getRiskBadgeClass(classification.violence_risk_level)"
                          title="Riesgo de Violencia"
                        >
                          V: {{ getRiskLabel(classification.violence_risk_level) }}
                        </span>
                        <span 
                          class="badge fs-8"
                          :class="getRiskBadgeClass(classification.escape_risk_level)"
                          title="Riesgo de Fuga"
                        >
                          F: {{ getRiskLabel(classification.escape_risk_level) }}
                        </span>
                        <span 
                          class="badge fs-8"
                          :class="getRiskBadgeClass(classification.gang_affiliation_risk)"
                          title="Riesgo de Pandillas"
                        >
                          P: {{ getRiskLabel(classification.gang_affiliation_risk) }}
                        </span>
                      </div>
                    </div>
                    
                    <!-- Special Status -->
                    <div v-if="hasSpecialStatus(classification)">
                      <div class="fw-semibold text-gray-600 mb-2">Estados Especiales:</div>
                      <div class="d-flex flex-wrap gap-1">
                        <span 
                          v-if="classification.protective_custody_indicator"
                          class="badge badge-light-info fs-8"
                        >
                          Custodia Protectiva
                        </span>
                        <span 
                          v-if="classification.administrative_segregation"
                          class="badge badge-light-warning fs-8"
                        >
                          Segregación Admin.
                        </span>
                        <span 
                          v-if="classification.disciplinary_segregation"
                          class="badge badge-light-danger fs-8"
                        >
                          Segregación Disc.
                        </span>
                        <span 
                          v-if="classification.medical_isolation"
                          class="badge badge-light-primary fs-8"
                        >
                          Aislamiento Médico
                        </span>
                        <span 
                          v-if="classification.suicide_watch"
                          class="badge badge-light-danger fs-8"
                        >
                          Vigilancia Suicidio
                        </span>
                        <span 
                          v-if="classification.mental_health_designation"
                          class="badge badge-light-success fs-8"
                        >
                          Salud Mental
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Classification Reason -->
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">Razón:</div>
                    <div class="text-gray-700 fs-7">
                      {{ classification.classification_reason }}
                    </div>
                  </div>
                  
                  <!-- Assessment Team -->
                  <div class="d-flex align-items-center text-gray-600 fs-7">
                    <span class="me-2">Evaluado por:</span>
                    <span class="fw-semibold">
                      {{ classification.assessed_by?.first_name }} {{ classification.assessed_by?.last_name }}
                    </span>
                    <span v-if="classification.approved_by" class="ms-4 me-2">• Aprobado por:</span>
                    <span v-if="classification.approved_by" class="fw-semibold">
                      {{ classification.approved_by?.first_name }} {{ classification.approved_by?.last_name }}
                    </span>
                  </div>
                  
                  <!-- Review Information -->
                  <div v-if="classification.next_review_date" class="mt-2 text-gray-600 fs-7">
                    <span class="me-2">Próxima revisión:</span>
                    <span>{{ formatDate(classification.next_review_date) }}</span>
                    <span 
                      class="ms-1"
                      :class="getReviewStatusClass(classification.next_review_date)"
                    >
                      ({{ getReviewStatus(classification.next_review_date) }})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No History -->
          <div v-else class="text-center py-10">
            <div class="mx-auto mb-4">
              <i class="ki-duotone ki-time fs-5x text-gray-400">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
            </div>
            <div class="fs-6 text-gray-600 mb-4">
              No se encontró historial de clasificaciones para este interno
            </div>
          </div>

          <!-- Summary Statistics -->
          <div v-if="classifications.length > 0" class="mt-10">
            <div class="card bg-light">
              <div class="card-body p-6">
                <h4 class="fw-bold text-gray-800 mb-4">Resumen del Historial</h4>
                <div class="row">
                  <div class="col-md-3">
                    <div class="text-center">
                      <div class="fs-2hx fw-bold text-primary">{{ classifications.length }}</div>
                      <div class="fs-7 fw-semibold text-gray-600">Total Clasificaciones</div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="text-center">
                      <div class="fs-2hx fw-bold text-info">{{ getCurrentLevel() }}</div>
                      <div class="fs-7 fw-semibold text-gray-600">Nivel Actual</div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="text-center">
                      <div class="fs-2hx fw-bold text-warning">{{ getHighestRiskCount() }}</div>
                      <div class="fs-7 fw-semibold text-gray-600">Clasificaciones Alto Riesgo</div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="text-center">
                      <div class="fs-2hx fw-bold text-success">{{ getDaysWithoutIncident() }}</div>
                      <div class="fs-7 fw-semibold text-gray-600">Días desde Último Cambio</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="close">
            Cerrar
          </button>
          <button 
            v-if="classifications.length > 0"
            type="button" 
            class="btn btn-info"
            @click="exportHistory"
          >
            <i class="ki-duotone ki-file-down fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Exportar Historial
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';
import { Modal } from 'bootstrap';
import ApiService from '@/core/services/ApiService';

// Props
interface Props {
  inmate?: any;
  show: boolean;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  close: [];
}>();

// State
const modalRef = ref<HTMLElement>();
const modal = ref<Modal>();
const loading = ref(false);
const error = ref<string | null>(null);
const classifications = ref<any[]>([]);

// Watchers
watch(() => props.show, async (show) => {
  if (show) {
    await nextTick();
    if (modalRef.value) {
      modal.value = new Modal(modalRef.value);
      modal.value.show();
      await loadClassificationHistory();
    }
  } else {
    modal.value?.hide();
  }
});

// Methods
const loadClassificationHistory = async () => {
  if (!props.inmate?.id) return;
  
  try {
    loading.value = true;
    error.value = null;
    
    const response = await ApiService.get(`/inmate-security-classifications/inmate/${props.inmate.id}/history`);
    
    if (response.data.success) {
      classifications.value = response.data.data;
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al cargar el historial';
    console.error('Error loading classification history:', err);
  } finally {
    loading.value = false;
  }
};

const close = () => {
  modal.value?.hide();
  emit('close');
};

const exportHistory = () => {
  // TODO: Implement export functionality
};

// Utility functions
const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getInmateName = (inmate: any) => {
  if (!inmate) return 'N/A';
  return `${inmate.first_name} ${inmate.last_name}`;
};

const getSecurityLevelLabel = (level: string) => {
  const labels: { [key: string]: string } = {
    minimum: 'Mínimo',
    low: 'Bajo',
    medium: 'Medio',
    high: 'Alto',
    maximum: 'Máximo',
    super_maximum: 'Super Máximo'
  };
  return labels[level] || level;
};

const getClassificationTypeLabel = (type: string) => {
  const labels: { [key: string]: string } = {
    initial: 'Inicial',
    review: 'Revisión',
    incident_based: 'Basada en Incidente',
    appeal_result: 'Resultado de Apelación',
    medical_reclassification: 'Reclasificación Médica'
  };
  return labels[type] || type;
};

const getRiskBadgeClass = (risk: string) => {
  const classes: { [key: string]: string } = {
    low: 'badge-light-success',
    medium: 'badge-light-warning',
    high: 'badge-light-danger',
    extreme: 'badge-dark'
  };
  return classes[risk] || 'badge-light-secondary';
};

const getRiskLabel = (risk: string) => {
  const labels: { [key: string]: string } = {
    low: 'Bajo',
    medium: 'Medio',
    high: 'Alto',
    extreme: 'Extremo'
  };
  return labels[risk] || risk;
};

const getTimelineIconClass = (classification: any, index: number) => {
  if (classification.is_current) {
    return 'bg-success';
  } else if (index === 0) {
    return 'bg-primary';
  } else {
    return 'bg-light-secondary';
  }
};

const getTimelineIcon = (classification: any) => {
  if (classification.is_current) {
    return 'ki-check';
  } else if (classification.classification_type === 'incident_based') {
    return 'ki-warning-1';
  } else if (classification.classification_type === 'medical_reclassification') {
    return 'ki-hospital';
  } else {
    return 'ki-security-user';
  }
};

const hasSpecialStatus = (classification: any) => {
  return classification.protective_custody_indicator ||
         classification.administrative_segregation ||
         classification.disciplinary_segregation ||
         classification.medical_isolation ||
         classification.suicide_watch ||
         classification.mental_health_designation;
};

const getReviewStatus = (reviewDate: string) => {
  if (!reviewDate) return 'Sin programar';
  
  const now = new Date();
  const review = new Date(reviewDate);
  const diffDays = Math.ceil((review.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return `Vencida ${Math.abs(diffDays)} días`;
  if (diffDays === 0) return 'Hoy';
  if (diffDays <= 7) return `En ${diffDays} días`;
  return `En ${diffDays} días`;
};

const getReviewStatusClass = (reviewDate: string) => {
  if (!reviewDate) return 'text-muted';
  
  const now = new Date();
  const review = new Date(reviewDate);
  const diffDays = Math.ceil((review.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'text-danger fw-bold';
  if (diffDays <= 7) return 'text-warning fw-bold';
  if (diffDays <= 30) return 'text-info';
  return 'text-muted';
};

// Summary statistics
const getCurrentLevel = () => {
  const current = classifications.value.find(c => c.is_current);
  return current ? getSecurityLevelLabel(current.classification_level) : 'N/A';
};

const getHighestRiskCount = () => {
  return classifications.value.filter(c => 
    c.violence_risk_level === 'high' || c.violence_risk_level === 'extreme' ||
    c.escape_risk_level === 'high' || c.escape_risk_level === 'extreme' ||
    c.gang_affiliation_risk === 'high' || c.gang_affiliation_risk === 'extreme'
  ).length;
};

const getDaysWithoutIncident = () => {
  if (classifications.value.length === 0) return 0;
  
  const latest = classifications.value[0];
  const latestDate = new Date(latest.classification_date);
  const now = new Date();
  
  return Math.floor((now.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));
};

// Setup modal event listeners
onMounted(() => {
  if (modalRef.value) {
    modalRef.value.addEventListener('hidden.bs.modal', () => {
      emit('close');
    });
  }
});
</script>