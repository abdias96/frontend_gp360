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
            Historial de Clasificaciones
            <span v-if="inmate" class="text-muted fs-6 ms-2">
              - {{ getInmateName(inmate) }}
            </span>
          </h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" @click="close">
            <i class="ki-duotone ki-cross fs-1"><span class="path1"></span><span class="path2"></span></i>
          </div>
        </div>

        <div class="modal-body py-10 px-lg-17">
          <div v-if="loading" class="text-center py-10">
            <div class="spinner-border spinner-border-lg text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>

          <div v-else-if="error" class="alert alert-danger">
            <i class="fas fa-exclamation-circle me-2"></i>{{ error }}
          </div>

          <div v-else-if="classifications.length > 0" class="timeline timeline-border-dashed">
            <div
              v-for="(c, index) in classifications"
              :key="c.id"
              class="timeline-item"
            >
              <div class="timeline-line w-40px"></div>

              <div class="timeline-icon symbol symbol-circle symbol-40px">
                <div
                  class="symbol-label"
                  :class="c.is_current ? 'bg-success' : (index === 0 ? 'bg-primary' : 'bg-light-secondary')"
                >
                  <i class="fas text-white" :class="c.is_current ? 'fa-check' : 'fa-shield-alt'"></i>
                </div>
              </div>

              <div class="timeline-content mb-10 mt-n1">
                <div class="pe-3 mb-5">
                  <div class="fs-5 fw-semibold mb-2">
                    <span class="badge" :class="getLevelBadge(c.security_level)">
                      {{ getLevelLabel(c.security_level) }}
                    </span>
                    <span v-if="c.is_current" class="badge badge-light-success ms-2">Actual</span>
                  </div>

                  <div class="text-muted fs-7 mt-1">
                    {{ formatDate(c.classification_date) }}
                    <span v-if="c.overall_risk_level" class="ms-3">
                      Riesgo: <span class="badge" :class="getRiskBadge(c.overall_risk_level)">{{ getRiskLabel(c.overall_risk_level) }}</span>
                    </span>
                  </div>
                </div>

                <div class="overflow-auto pb-5">
                  <!-- Risk Scores -->
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-2">Puntuaciones de Riesgo:</div>
                    <div class="d-flex flex-wrap gap-2">
                      <span class="badge badge-light fs-8" title="Violencia">V: {{ c.violence_risk_score ?? '-' }}/10</span>
                      <span class="badge badge-light fs-8" title="Fuga">F: {{ c.escape_risk_score ?? '-' }}/10</span>
                      <span class="badge badge-light fs-8" title="Pandillas">P: {{ c.gang_influence_score ?? '-' }}/10</span>
                      <span class="badge badge-light fs-8" title="Víctimas">V: {{ c.victim_threat_score ?? '-' }}/10</span>
                      <span class="badge badge-light fs-8" title="Corrupción">C: {{ c.corruption_risk_score ?? '-' }}/10</span>
                      <span class="badge badge-primary fs-8" title="Total">Total: {{ c.overall_risk_score ?? '-' }}/50</span>
                    </div>
                  </div>

                  <!-- Restrictions -->
                  <div v-if="hasRestrictions(c)" class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-2">Restricciones:</div>
                    <div class="d-flex flex-wrap gap-1">
                      <span v-if="c.requires_single_cell" class="badge badge-light-warning fs-8">Celda Individual</span>
                      <span v-if="c.limited_recreation_time" class="badge badge-light-warning fs-8">Recreación Limitada</span>
                      <span v-if="c.restricted_visits" class="badge badge-light-warning fs-8">Visitas Restringidas</span>
                      <span v-if="c.monitored_communications" class="badge badge-light-info fs-8">Com. Monitoreadas</span>
                      <span v-if="c.escort_required" class="badge badge-light-danger fs-8">Escolta</span>
                      <span v-if="c.restricted_work_assignments" class="badge badge-light-warning fs-8">Trabajo Restringido</span>
                      <span v-if="c.medical_isolation" class="badge badge-light-primary fs-8">Aislamiento Médico</span>
                    </div>
                  </div>

                  <!-- Reason -->
                  <div v-if="c.classification_reasons" class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">Razón:</div>
                    <div class="text-gray-700 fs-7">{{ c.classification_reasons }}</div>
                  </div>

                  <!-- Assessed By -->
                  <div class="d-flex align-items-center text-gray-600 fs-7">
                    <span class="me-2">Clasificado por:</span>
                    <span class="fw-semibold">
                      {{ c.classified_by?.first_name || 'N/A' }} {{ c.classified_by?.last_name || '' }}
                    </span>
                    <span v-if="c.approved_by" class="ms-4 me-2">| Aprobado por:</span>
                    <span v-if="c.approved_by" class="fw-semibold">
                      {{ c.approved_by?.first_name }} {{ c.approved_by?.last_name }}
                    </span>
                  </div>

                  <!-- Review -->
                  <div v-if="c.next_review_date" class="mt-2 text-gray-600 fs-7">
                    <span class="me-2">Próxima revisión:</span>
                    <span :class="getReviewClass(c.next_review_date)">
                      {{ formatDate(c.next_review_date) }} ({{ getReviewStatus(c.next_review_date) }})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-10">
            <i class="fas fa-history fs-5x text-gray-300 mb-4"></i>
            <div class="fs-6 text-gray-600">No se encontró historial de clasificaciones</div>
          </div>

          <!-- Summary -->
          <div v-if="classifications.length > 0" class="mt-10">
            <div class="card bg-light">
              <div class="card-body p-6">
                <h4 class="fw-bold text-gray-800 mb-4">Resumen</h4>
                <div class="row">
                  <div class="col-md-3 text-center">
                    <div class="fs-2hx fw-bold text-primary">{{ classifications.length }}</div>
                    <div class="fs-7 fw-semibold text-gray-600">Total Clasificaciones</div>
                  </div>
                  <div class="col-md-3 text-center">
                    <div class="fs-2hx fw-bold text-info">{{ getCurrentLevel() }}</div>
                    <div class="fs-7 fw-semibold text-gray-600">Nivel Actual</div>
                  </div>
                  <div class="col-md-3 text-center">
                    <div class="fs-2hx fw-bold text-warning">{{ getHighRiskCount() }}</div>
                    <div class="fs-7 fw-semibold text-gray-600">Alto Riesgo</div>
                  </div>
                  <div class="col-md-3 text-center">
                    <div class="fs-2hx fw-bold text-success">{{ getDaysSinceLastChange() }}</div>
                    <div class="fs-7 fw-semibold text-gray-600">Días Último Cambio</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="close">Cerrar</button>
          <button
            v-if="classifications.length > 0"
            type="button"
            class="btn btn-info"
            @click="printHistory"
          >
            <i class="fas fa-print me-2"></i>Imprimir
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

interface Props {
  inmate?: any;
  show: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ close: [] }>();

const modalRef = ref<HTMLElement>();
const modal = ref<Modal>();
const loading = ref(false);
const error = ref<string | null>(null);
const classifications = ref<any[]>([]);

watch(() => props.show, async (show) => {
  if (show) {
    await nextTick();
    if (modalRef.value) {
      modal.value = new Modal(modalRef.value);
      modal.value.show();
      await loadHistory();
    }
  } else {
    modal.value?.hide();
  }
});

const loadHistory = async () => {
  if (!props.inmate?.id) return;
  try {
    loading.value = true;
    error.value = null;
    const res = await ApiService.get(`/inmate-security-classifications/history/${props.inmate.id}`);
    if (res.data.success) {
      classifications.value = res.data.data;
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al cargar el historial';
  } finally {
    loading.value = false;
  }
};

const close = () => {
  modal.value?.hide();
  emit('close');
};

const getInmateName = (i: any) => {
  if (!i) return 'N/A';
  if (i.full_name) return i.full_name;
  return [i.first_name, i.middle_name, i.last_name, i.second_last_name].filter(Boolean).join(' ');
};

const getLevelBadge = (l: string) => ({
  low: 'badge-light-success', medium: 'badge-light-warning', high: 'badge-danger', maximum: 'badge-dark',
}[l] || 'badge-light');

const getLevelLabel = (l: string) => ({
  low: 'Bajo', medium: 'Medio', high: 'Alto', maximum: 'Máximo',
}[l] || l || 'N/A');

const getRiskBadge = (r: string) => ({
  low: 'badge-light-success', medium: 'badge-light-warning', high: 'badge-light-danger', extreme: 'badge-danger',
}[r] || 'badge-light');

const getRiskLabel = (r: string) => ({
  low: 'Bajo', medium: 'Medio', high: 'Alto', extreme: 'Extremo',
}[r] || r || 'N/A');

const formatDate = (d: string) => {
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString('es-GT', { year: 'numeric', month: 'short', day: 'numeric' });
};

const hasRestrictions = (c: any) =>
  c.requires_single_cell || c.limited_recreation_time || c.restricted_visits ||
  c.monitored_communications || c.escort_required || c.restricted_work_assignments || c.medical_isolation;

const getReviewStatus = (d: string) => {
  if (!d) return 'Sin programar';
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  if (diff < 0) return `Vencida ${Math.abs(diff)} días`;
  if (diff === 0) return 'Hoy';
  return `En ${diff} días`;
};

const getReviewClass = (d: string) => {
  if (!d) return 'text-muted';
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  if (diff < 0) return 'text-danger fw-bold';
  if (diff <= 7) return 'text-warning fw-bold';
  return 'text-muted';
};

const getCurrentLevel = () => {
  const current = classifications.value.find(c => c.is_current);
  return current ? getLevelLabel(current.security_level) : 'N/A';
};

const getHighRiskCount = () =>
  classifications.value.filter(c => (c.overall_risk_score || 0) >= 30).length;

const getDaysSinceLastChange = () => {
  if (classifications.value.length === 0) return 0;
  const latest = classifications.value[0];
  return Math.floor((Date.now() - new Date(latest.classification_date).getTime()) / 86400000);
};

const printHistory = () => {
  window.print();
};

onMounted(() => {
  if (modalRef.value) {
    modalRef.value.addEventListener('hidden.bs.modal', () => emit('close'));
  }
});
</script>
