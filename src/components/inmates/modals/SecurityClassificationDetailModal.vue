<template>
  <div 
    id="securityClassificationDetailModal" 
    class="modal fade" 
    tabindex="-1" 
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">Detalles de Clasificación de Seguridad</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" @click="close">
            <i class="ki-duotone ki-cross fs-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
        </div>

        <div class="modal-body py-10 px-lg-17">
          <div v-if="classification" class="row g-7">
            <!-- Header Info -->
            <div class="col-12">
              <div class="card border border-dashed border-primary">
                <div class="card-body p-6">
                  <div class="row">
                    <div class="col-md-3">
                      <div class="d-flex align-items-center">
                        <div class="symbol symbol-60px me-4">
                          <div class="symbol-label bg-light-primary text-primary fs-4 fw-bold">
                            {{ getInitials(classification.inmate) }}
                          </div>
                        </div>
                        <div>
                          <div class="fw-bold fs-6">{{ getInmateName(classification.inmate) }}</div>
                          <div class="text-muted fs-7">{{ classification.inmate?.inmate_number }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="fw-semibold text-gray-600">Nivel de Seguridad:</div>
                      <span class="badge" :class="getSecurityLevelBadgeClass(classification.classification_level)">
                        {{ getSecurityLevelLabel(classification.classification_level) }}
                      </span>
                    </div>
                    <div class="col-md-3">
                      <div class="fw-semibold text-gray-600">Riesgo General:</div>
                      <span class="badge" :class="getRiskBadgeClass(classification.overall_risk_level)">
                        {{ getRiskLabel(classification.overall_risk_level) }}
                      </span>
                    </div>
                    <div class="col-md-3">
                      <div class="fw-semibold text-gray-600">Estado:</div>
                      <span class="badge" :class="classification.is_current ? 'badge-light-success' : 'badge-light-secondary'">
                        {{ classification.is_current ? 'Actual' : 'Histórica' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Classification Details -->
            <div class="col-md-6">
              <div class="card h-100">
                <div class="card-header">
                  <h3 class="card-title">Información de Clasificación</h3>
                </div>
                <div class="card-body">
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">Tipo de Clasificación:</div>
                    <div class="fs-6">{{ getClassificationTypeLabel(classification.classification_type) }}</div>
                  </div>
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">Fecha de Clasificación:</div>
                    <div class="fs-6">{{ formatDate(classification.classification_date) }}</div>
                  </div>
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">Fecha de Vigencia:</div>
                    <div class="fs-6">{{ formatDate(classification.effective_date) }}</div>
                  </div>
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">Próxima Revisión:</div>
                    <div class="fs-6">
                      <span>{{ formatDate(classification.next_review_date) }}</span>
                      <span 
                        class="fs-7 ms-2"
                        :class="getReviewStatusClass(classification.next_review_date)"
                      >
                        ({{ getReviewStatus(classification.next_review_date) }})
                      </span>
                    </div>
                  </div>
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">Nivel de Supervisión:</div>
                    <div class="fs-6">{{ getSupervisionLevelLabel(classification.supervision_level) }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Risk Assessment -->
            <div class="col-md-6">
              <div class="card h-100">
                <div class="card-header">
                  <h3 class="card-title">Evaluación de Riesgos</h3>
                </div>
                <div class="card-body">
                  <div class="row mb-3">
                    <div class="col-6">
                      <div class="fw-semibold text-gray-600 mb-1">Violencia:</div>
                      <span class="badge" :class="getRiskBadgeClass(classification.violence_risk_level)">
                        {{ getRiskLabel(classification.violence_risk_level) }}
                      </span>
                    </div>
                    <div class="col-6">
                      <div class="fw-semibold text-gray-600 mb-1">Fuga:</div>
                      <span class="badge" :class="getRiskBadgeClass(classification.escape_risk_level)">
                        {{ getRiskLabel(classification.escape_risk_level) }}
                      </span>
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-6">
                      <div class="fw-semibold text-gray-600 mb-1">Pandillas:</div>
                      <span class="badge" :class="getRiskBadgeClass(classification.gang_affiliation_risk)">
                        {{ getRiskLabel(classification.gang_affiliation_risk) }}
                      </span>
                    </div>
                    <div class="col-6">
                      <div class="fw-semibold text-gray-600 mb-1">Institucional:</div>
                      <span class="badge" :class="getRiskBadgeClass(classification.institutional_risk_level)">
                        {{ getRiskLabel(classification.institutional_risk_level) }}
                      </span>
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-6">
                      <div class="fw-semibold text-gray-600 mb-1">Externo:</div>
                      <span class="badge" :class="getRiskBadgeClass(classification.external_risk_level)">
                        {{ getRiskLabel(classification.external_risk_level) }}
                      </span>
                    </div>
                    <div class="col-6" v-if="classification.risk_score">
                      <div class="fw-semibold text-gray-600 mb-1">Puntuación:</div>
                      <div class="fs-6">{{ classification.risk_score }}/100</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Special Status -->
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Estados Especiales</h3>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-3" v-if="classification.protective_custody_indicator">
                      <div class="d-flex align-items-center mb-3">
                        <i class="ki-duotone ki-shield-tick fs-2 text-info me-3">
                          <span class="path1"></span>
                          <span class="path2"></span>
                          <span class="path3"></span>
                        </i>
                        <div>
                          <div class="fw-bold">Custodia Protectiva</div>
                          <div class="text-muted fs-7">Activa</div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3" v-if="classification.administrative_segregation">
                      <div class="d-flex align-items-center mb-3">
                        <i class="ki-duotone ki-security-user fs-2 text-warning me-3">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        <div>
                          <div class="fw-bold">Segregación Admin.</div>
                          <div class="text-muted fs-7">Activa</div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3" v-if="classification.disciplinary_segregation">
                      <div class="d-flex align-items-center mb-3">
                        <i class="ki-duotone ki-shield-cross fs-2 text-danger me-3">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        <div>
                          <div class="fw-bold">Segregación Disc.</div>
                          <div class="text-muted fs-7">Activa</div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3" v-if="classification.medical_isolation">
                      <div class="d-flex align-items-center mb-3">
                        <i class="ki-duotone ki-hospital fs-2 text-primary me-3">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        <div>
                          <div class="fw-bold">Aislamiento Médico</div>
                          <div class="text-muted fs-7">Activo</div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3" v-if="classification.mental_health_designation">
                      <div class="d-flex align-items-center mb-3">
                        <i class="ki-duotone ki-heart fs-2 text-success me-3">
                          <span class="path1"></span>
                          <span class="path2"></span>
                          <span class="path3"></span>
                        </i>
                        <div>
                          <div class="fw-bold">Salud Mental</div>
                          <div class="text-muted fs-7">Designación</div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3" v-if="classification.suicide_watch">
                      <div class="d-flex align-items-center mb-3">
                        <i class="ki-duotone ki-emergency fs-2 text-danger me-3">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        <div>
                          <div class="fw-bold">Vigilancia Suicidio</div>
                          <div class="text-muted fs-7">Activa</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- No special status message -->
                  <div v-if="!hasAnySpecialStatus" class="text-center text-muted py-4">
                    <i class="ki-duotone ki-information fs-2x mb-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                    </i>
                    <div>No hay estados especiales asignados</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Protective Custody Reason -->
            <div v-if="classification.protective_custody_indicator && classification.protective_custody_reason" class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Razón de Custodia Protectiva</h3>
                </div>
                <div class="card-body">
                  <div class="bg-light-info p-4 rounded">{{ classification.protective_custody_reason }}</div>
                </div>
              </div>
            </div>

            <!-- Classification Reason -->
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Razón y Notas de Clasificación</h3>
                </div>
                <div class="card-body">
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-2">Razón de Clasificación:</div>
                    <div class="bg-light p-4 rounded">{{ classification.classification_reason }}</div>
                  </div>
                  <div v-if="classification.classification_notes">
                    <div class="fw-semibold text-gray-600 mb-2">Notas Adicionales:</div>
                    <div class="bg-light p-4 rounded">{{ classification.classification_notes }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Assessment Team -->
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Información del Proceso</h3>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-4">
                      <div class="fw-semibold text-gray-600 mb-1">Evaluado por:</div>
                      <div class="fs-6">{{ classification.assessed_by?.first_name }} {{ classification.assessed_by?.last_name }}</div>
                    </div>
                    <div class="col-md-4" v-if="classification.approved_by">
                      <div class="fw-semibold text-gray-600 mb-1">Aprobado por:</div>
                      <div class="fs-6">{{ classification.approved_by?.first_name }} {{ classification.approved_by?.last_name }}</div>
                    </div>
                    <div class="col-md-4">
                      <div class="fw-semibold text-gray-600 mb-1">Fecha de Creación:</div>
                      <div class="fs-6">{{ formatDateTime(classification.created_at) }}</div>
                    </div>
                  </div>
                  <div v-if="classification.updated_at !== classification.created_at" class="row mt-3">
                    <div class="col-md-4">
                      <div class="fw-semibold text-gray-600 mb-1">Última Actualización:</div>
                      <div class="fs-6">{{ formatDateTime(classification.updated_at) }}</div>
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
            v-if="classification?.is_current"
            type="button" 
            class="btn btn-info"
            @click="printClassification"
          >
            <i class="ki-duotone ki-printer fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
            Imprimir Clasificación
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { Modal } from 'bootstrap';

// Props
interface Props {
  classification?: any;
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

// Computed
const hasAnySpecialStatus = computed(() => {
  if (!props.classification) return false;
  
  return props.classification.protective_custody_indicator ||
         props.classification.administrative_segregation ||
         props.classification.disciplinary_segregation ||
         props.classification.medical_isolation ||
         props.classification.mental_health_designation ||
         props.classification.suicide_watch;
});

// Watchers
watch(() => props.show, async (show) => {
  if (show) {
    await nextTick();
    if (modalRef.value) {
      modal.value = new Modal(modalRef.value);
      modal.value.show();
    }
  } else {
    modal.value?.hide();
  }
});

// Methods
const close = () => {
  modal.value?.hide();
  emit('close');
};

const printClassification = () => {
  // TODO: Implement print functionality
};

// Utility functions
const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatDateTime = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getInmateName = (inmate: any) => {
  if (!inmate) return 'N/A';
  return `${inmate.first_name} ${inmate.last_name}`;
};

const getInitials = (inmate: any) => {
  if (!inmate) return '??';
  const first = inmate.first_name?.[0] || '';
  const last = inmate.last_name?.[0] || '';
  return `${first}${last}`.toUpperCase();
};

const getSecurityLevelBadgeClass = (level: string) => {
  const classes: { [key: string]: string } = {
    minimum: 'badge-light-success',
    low: 'badge-light-info',
    medium: 'badge-light-primary',
    high: 'badge-light-warning',
    maximum: 'badge-light-danger',
    super_maximum: 'badge-dark'
  };
  return classes[level] || 'badge-light-secondary';
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

const getSupervisionLevelLabel = (level: string) => {
  const labels: { [key: string]: string } = {
    minimum: 'Mínimo',
    low: 'Bajo',
    medium: 'Medio',
    high: 'Alto',
    maximum: 'Máximo'
  };
  return labels[level] || level;
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

// Setup modal event listeners
onMounted(() => {
  if (modalRef.value) {
    modalRef.value.addEventListener('hidden.bs.modal', () => {
      emit('close');
    });
  }
});
</script>