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
              <span class="path1"></span><span class="path2"></span>
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
                      <span class="badge" :class="getSecurityLevelBadgeClass(classification.security_level)">
                        {{ getSecurityLevelLabel(classification.security_level) }}
                      </span>
                    </div>
                    <div class="col-md-3">
                      <div class="fw-semibold text-gray-600">Riesgo Total:</div>
                      <span class="fw-bold fs-4">{{ classification.overall_risk_score || 0 }}/50</span>
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
                    <div class="fw-semibold text-gray-600 mb-1">Fecha de Clasificación:</div>
                    <div class="fs-6">{{ formatDate(classification.classification_date) }}</div>
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
                  <div v-if="classification.risk_classification" class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">Clasificación de Riesgo:</div>
                    <div class="fs-6">{{ classification.risk_classification?.name || 'N/A' }}</div>
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
                      <div class="fs-6 fw-bold" :class="getScoreColor(classification.violence_risk_score)">
                        {{ classification.violence_risk_score ?? 'N/A' }}/10
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="fw-semibold text-gray-600 mb-1">Fuga:</div>
                      <div class="fs-6 fw-bold" :class="getScoreColor(classification.escape_risk_score)">
                        {{ classification.escape_risk_score ?? 'N/A' }}/10
                      </div>
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-6">
                      <div class="fw-semibold text-gray-600 mb-1">Influencia Pandillera:</div>
                      <div class="fs-6 fw-bold" :class="getScoreColor(classification.gang_influence_score)">
                        {{ classification.gang_influence_score ?? 'N/A' }}/10
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="fw-semibold text-gray-600 mb-1">Amenaza a Víctimas:</div>
                      <div class="fs-6 fw-bold" :class="getScoreColor(classification.victim_threat_score)">
                        {{ classification.victim_threat_score ?? 'N/A' }}/10
                      </div>
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-6">
                      <div class="fw-semibold text-gray-600 mb-1">Corrupción:</div>
                      <div class="fs-6 fw-bold" :class="getScoreColor(classification.corruption_risk_score)">
                        {{ classification.corruption_risk_score ?? 'N/A' }}/10
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="fw-semibold text-gray-600 mb-1">Riesgo Total:</div>
                      <div class="fs-5 fw-bolder">{{ classification.overall_risk_score ?? 'N/A' }}/50</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Restrictions -->
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Restricciones</h3>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-3" v-if="classification.requires_single_cell">
                      <div class="d-flex align-items-center mb-3">
                        <i class="ki-duotone ki-security-user fs-2 text-warning me-3"><span class="path1"></span><span class="path2"></span></i>
                        <div><div class="fw-bold">Celda Individual</div></div>
                      </div>
                    </div>
                    <div class="col-md-3" v-if="classification.limited_recreation_time">
                      <div class="d-flex align-items-center mb-3">
                        <i class="ki-duotone ki-time fs-2 text-info me-3"><span class="path1"></span><span class="path2"></span></i>
                        <div><div class="fw-bold">Recreación Limitada</div></div>
                      </div>
                    </div>
                    <div class="col-md-3" v-if="classification.restricted_visits">
                      <div class="d-flex align-items-center mb-3">
                        <i class="ki-duotone ki-people fs-2 text-danger me-3"><span class="path1"></span><span class="path2"></span></i>
                        <div><div class="fw-bold">Visitas Restringidas</div></div>
                      </div>
                    </div>
                    <div class="col-md-3" v-if="classification.monitored_communications">
                      <div class="d-flex align-items-center mb-3">
                        <i class="ki-duotone ki-eye fs-2 text-primary me-3"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                        <div><div class="fw-bold">Comunicaciones Monitoreadas</div></div>
                      </div>
                    </div>
                    <div class="col-md-3" v-if="classification.escort_required">
                      <div class="d-flex align-items-center mb-3">
                        <i class="ki-duotone ki-shield-tick fs-2 text-success me-3"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                        <div><div class="fw-bold">Escolta Requerida</div></div>
                      </div>
                    </div>
                    <div class="col-md-3" v-if="classification.restricted_work_assignments">
                      <div class="d-flex align-items-center mb-3">
                        <i class="ki-duotone ki-briefcase fs-2 text-warning me-3"><span class="path1"></span><span class="path2"></span></i>
                        <div><div class="fw-bold">Trabajo Restringido</div></div>
                      </div>
                    </div>
                    <div class="col-md-3" v-if="classification.medical_isolation">
                      <div class="d-flex align-items-center mb-3">
                        <i class="ki-duotone ki-hospital fs-2 text-primary me-3"><span class="path1"></span><span class="path2"></span></i>
                        <div><div class="fw-bold">Aislamiento Médico</div></div>
                      </div>
                    </div>
                  </div>
                  <div v-if="!hasAnyRestriction" class="text-center text-muted py-4">
                    <div>No hay restricciones asignadas</div>
                  </div>
                  <div v-if="classification.specific_restrictions" class="mt-3">
                    <div class="fw-semibold text-gray-600 mb-2">Restricciones Específicas:</div>
                    <div class="bg-light p-4 rounded">{{ classification.specific_restrictions }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Classification Reason -->
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Razones y Notas</h3>
                </div>
                <div class="card-body">
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-2">Razones de Clasificación:</div>
                    <div class="bg-light p-4 rounded">{{ classification.classification_reasons || 'N/A' }}</div>
                  </div>
                  <div v-if="classification.compatibility_notes">
                    <div class="fw-semibold text-gray-600 mb-2">Notas de Compatibilidad:</div>
                    <div class="bg-light p-4 rounded">{{ classification.compatibility_notes }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Process Info -->
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Información del Proceso</h3>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-4" v-if="classification.classified_by">
                      <div class="fw-semibold text-gray-600 mb-1">Clasificado por:</div>
                      <div class="fs-6">{{ classification.classified_by?.first_name }} {{ classification.classified_by?.last_name }}</div>
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="close">Cerrar</button>
          <button
            v-if="classification?.is_current"
            type="button"
            class="btn btn-info"
            @click="printClassification"
          >
            <i class="ki-duotone ki-printer fs-2"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
            Imprimir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { Modal } from 'bootstrap';

interface Props {
  classification?: any;
  show: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ close: [] }>();

const modalRef = ref<HTMLElement>();
const modal = ref<Modal>();

const hasAnyRestriction = computed(() => {
  if (!props.classification) return false;
  return props.classification.requires_single_cell ||
    props.classification.limited_recreation_time ||
    props.classification.restricted_visits ||
    props.classification.monitored_communications ||
    props.classification.escort_required ||
    props.classification.restricted_work_assignments ||
    props.classification.medical_isolation;
});

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

const close = () => { modal.value?.hide(); emit('close'); };
const printClassification = () => { /* TODO */ };

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatDateTime = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-GT', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getInmateName = (inmate: any) => {
  if (!inmate) return 'N/A';
  return [inmate.first_name, inmate.last_name, inmate.second_last_name].filter(Boolean).join(' ');
};

const getInitials = (inmate: any) => {
  if (!inmate) return '??';
  return `${inmate.first_name?.[0] || ''}${inmate.last_name?.[0] || ''}`.toUpperCase();
};

const getSecurityLevelBadgeClass = (level: string) => {
  return { low: 'badge-light-success', medium: 'badge-light-primary', high: 'badge-light-danger', maximum: 'badge-dark' }[level] || 'badge-light-secondary';
};

const getSecurityLevelLabel = (level: string) => {
  return { low: 'Bajo', medium: 'Medio', high: 'Alto', maximum: 'Máximo' }[level] || level;
};

const getScoreColor = (score: number | null) => {
  if (score === null || score === undefined) return '';
  if (score <= 3) return 'text-success';
  if (score <= 6) return 'text-warning';
  return 'text-danger';
};

const getReviewStatus = (reviewDate: string) => {
  if (!reviewDate) return 'Sin programar';
  const diffDays = Math.ceil((new Date(reviewDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return `Vencida ${Math.abs(diffDays)} días`;
  if (diffDays === 0) return 'Hoy';
  return `En ${diffDays} días`;
};

const getReviewStatusClass = (reviewDate: string) => {
  if (!reviewDate) return 'text-muted';
  const diffDays = Math.ceil((new Date(reviewDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'text-danger fw-bold';
  if (diffDays <= 7) return 'text-warning fw-bold';
  if (diffDays <= 30) return 'text-info';
  return 'text-muted';
};

onMounted(() => {
  if (modalRef.value) {
    modalRef.value.addEventListener('hidden.bs.modal', () => { emit('close'); });
  }
});
</script>
