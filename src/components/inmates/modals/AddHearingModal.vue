<template>
  <div class="modal fade" id="addHearingModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Programar Audiencia</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <!-- Información Básica -->
            <div class="row g-6 mb-6">
              <div class="col-md-6">
                <label class="form-label required">Tipo de audiencia</label>
                <select v-model="form.hearing_type" class="form-select" required>
                  <option value="">Seleccionar tipo...</option>
                  <option value="first_declaration">Primera declaración</option>
                  <option value="preliminary_hearing">Audiencia preliminar</option>
                  <option value="intermediate_hearing">Audiencia intermedia</option>
                  <option value="oral_trial">Juicio oral</option>
                  <option value="sentencing">Sentencia</option>
                  <option value="appeal_hearing">Audiencia de apelación</option>
                  <option value="review_hearing">Audiencia de revisión</option>
                  <option value="benefit_request">Solicitud de beneficios</option>
                  <option value="transfer_request">Solicitud de traslado</option>
                  <option value="medical_evaluation">Evaluación médica judicial</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label required">Tribunal</label>
                <Multiselect
                  v-model="form.court_id"
                  :options="courtsOptions"
                  :searchable="true"
                  placeholder="Buscar tribunal..."
                  noOptionsText="No hay opciones disponibles"
                  noResultsText="No se encontraron resultados"
                  label="label"
                  valueProp="value"
                  :canClear="true"
                />
              </div>
            </div>

            <!-- Fecha y Hora -->
            <div class="row g-6 mb-6">
              <div class="col-md-6">
                <label class="form-label required">Fecha de Audiencia</label>
                <input
                  v-model="form.hearing_date"
                  type="date"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label required">Hora de Audiencia</label>
                <input
                  v-model="form.hearing_time"
                  type="time"
                  class="form-control"
                  required
                />
              </div>
            </div>

            <!-- Juez y Propósito -->
            <div class="row g-6 mb-6">
              <div class="col-md-6">
                <label class="form-label">Juez Asignado</label>
                <input
                  v-model="form.judge_name"
                  type="text"
                  class="form-control"
                  placeholder="Nombre del juez"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Propósito de la Audiencia</label>
                <input
                  v-model="form.hearing_purpose"
                  type="text"
                  class="form-control"
                  placeholder="Breve descripción del propósito"
                />
              </div>
            </div>

            <!-- Transporte -->
            <div class="row g-6 mb-6">
              <div class="col-md-4">
                <div class="form-check form-switch">
                  <input
                    v-model="form.requires_transport"
                    class="form-check-input"
                    type="checkbox"
                    id="requiresTransport"
                  />
                  <label class="form-check-label" for="requiresTransport">
                    Requiere transporte
                  </label>
                </div>
              </div>
              <div v-if="form.requires_transport" class="col-md-4">
                <label class="form-label">Hora de Salida</label>
                <input
                  v-model="form.transport_departure_time"
                  type="time"
                  class="form-control"
                />
              </div>
              <div v-if="form.requires_transport" class="col-md-4">
                <label class="form-label">Hora de Retorno</label>
                <input
                  v-model="form.transport_return_time"
                  type="time"
                  class="form-control"
                />
              </div>
            </div>

            <!-- Estado de Asistencia -->
            <div class="row g-6 mb-6">
              <div class="col-md-6">
                <label class="form-label">Estado de Asistencia</label>
                <select v-model="form.attendance_status" class="form-select">
                  <option value="">Por definir</option>
                  <option value="scheduled">Programada</option>
                  <option value="attended">Asistió</option>
                  <option value="not_attended">No Asistió</option>
                  <option value="virtual">Virtual</option>
                  <option value="postponed">Aplazada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Resultado de la Audiencia</label>
                <select v-model="form.hearing_outcome" class="form-select">
                  <option value="">Por definir</option>
                  <option value="pending">Pendiente</option>
                  <option value="favorable">Favorable</option>
                  <option value="unfavorable">Desfavorable</option>
                  <option value="postponed">Aplazada</option>
                  <option value="partial">Parcial</option>
                </select>
              </div>
            </div>

            <!-- Próximos Pasos -->
            <div class="row g-6 mb-6">
              <div class="col-md-6">
                <label class="form-label">Próximos Pasos</label>
                <textarea
                  v-model="form.next_steps"
                  class="form-control"
                  rows="3"
                  placeholder="Acciones a seguir después de la audiencia..."
                ></textarea>
              </div>
              <div class="col-md-6">
                <label class="form-label">Próxima Audiencia</label>
                <input
                  v-model="form.next_hearing_date"
                  type="date"
                  class="form-control"
                />
              </div>
            </div>

            <!-- Requerimientos de Seguridad -->
            <div class="row g-6 mb-6">
              <div class="col-12">
                <label class="form-label">Requerimientos de Seguridad</label>
                <div class="row">
                  <div class="col-md-3">
                    <div class="form-check">
                      <input
                        v-model="securityRequirements.high_security"
                        class="form-check-input"
                        type="checkbox"
                        id="highSecurity"
                      />
                      <label class="form-check-label" for="highSecurity">
                        Alta seguridad
                      </label>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-check">
                      <input
                        v-model="securityRequirements.armed_escort"
                        class="form-check-input"
                        type="checkbox"
                        id="armedEscort"
                      />
                      <label class="form-check-label" for="armedEscort">
                        Escolta armada
                      </label>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-check">
                      <input
                        v-model="securityRequirements.medical_escort"
                        class="form-check-input"
                        type="checkbox"
                        id="medicalEscort"
                      />
                      <label class="form-check-label" for="medicalEscort">
                        Escolta médica
                      </label>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-check">
                      <input
                        v-model="securityRequirements.isolation_transport"
                        class="form-check-input"
                        type="checkbox"
                        id="isolationTransport"
                      />
                      <label class="form-check-label" for="isolationTransport">
                        Transporte aislado
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Observaciones -->
            <div class="row g-6">
              <div class="col-12">
                <label class="form-label">Observaciones Adicionales</label>
                <textarea
                  v-model="form.notes"
                  class="form-control"
                  rows="3"
                  placeholder="Cualquier información adicional relevante para la audiencia..."
                ></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-light"
            data-bs-dismiss="modal"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="submitForm"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Programar Audiencia
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useCatalogs } from '@/composables/useCatalogs';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import Multiselect from '@vueform/multiselect';

// Props
interface Props {
  inmateId: string | number;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits(['saved', 'close']);

// State
const loading = ref(false);

// Catalogs
const { 
  courtsOptions,
  loadLegalCatalogs 
} = useCatalogs();

// Security requirements
const securityRequirements = ref({
  high_security: false,
  armed_escort: false,
  medical_escort: false,
  isolation_transport: false
});

// Form data
const form = ref({
  hearing_type: '',
  court_id: '',
  hearing_date: '',
  hearing_time: '',
  judge_name: '',
  hearing_purpose: '',
  requires_transport: false,
  transport_departure_time: '',
  transport_return_time: '',
  attendance_status: 'scheduled',
  hearing_outcome: '',
  next_steps: '',
  next_hearing_date: '',
  notes: ''
});

// Methods
const resetForm = () => {
  form.value = {
    hearing_type: '',
    court_id: '',
    hearing_date: '',
    hearing_time: '',
    judge_name: '',
    hearing_purpose: '',
    requires_transport: false,
    transport_departure_time: '',
    transport_return_time: '',
    attendance_status: 'scheduled',
    hearing_outcome: '',
    next_steps: '',
    next_hearing_date: '',
    notes: ''
  };
  
  securityRequirements.value = {
    high_security: false,
    armed_escort: false,
    medical_escort: false,
    isolation_transport: false
  };
};

const submitForm = async () => {
  try {
    loading.value = true;

    // Combine date and time for hearing_date
    const hearingDateTime = new Date(`${form.value.hearing_date}T${form.value.hearing_time}`);
    
    const submitData = {
      ...form.value,
      hearing_date: hearingDateTime.toISOString(),
      security_requirements: securityRequirements.value
    };

    // Remove separate time field
    const { hearing_time, ...finalData } = submitData;

    const response = await ApiService.post(`/inmates/${props.inmateId}/hearings`, finalData);

    await Swal.fire({
      title: 'Éxito',
      text: 'Audiencia programada correctamente',
      icon: 'success',
      timer: 2000
    });

    emit('saved', response.data);
    
    // Close modal
    const modal = document.getElementById('addHearingModal');
    const bsModal = window.bootstrap.Modal.getInstance(modal!);
    bsModal?.hide();

    resetForm();

  } catch (error: any) {
    console.error('Error scheduling hearing:', error);
    await Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'Error al programar la audiencia',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};

// Auto-calculate transport times
watch(() => form.value.hearing_time, (newTime) => {
  if (newTime && form.value.requires_transport) {
    // Calculate departure time (2 hours before hearing)
    const hearingTime = new Date(`2000-01-01T${newTime}`);
    const departureTime = new Date(hearingTime.getTime() - 2 * 60 * 60 * 1000);
    const returnTime = new Date(hearingTime.getTime() + 4 * 60 * 60 * 1000);
    
    form.value.transport_departure_time = departureTime.toTimeString().slice(0, 5);
    form.value.transport_return_time = returnTime.toTimeString().slice(0, 5);
  }
});

// Lifecycle
onMounted(() => {
  loadLegalCatalogs();
});
</script>