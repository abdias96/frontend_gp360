<template>
  <div
    ref="modalRef"
    class="modal fade"
    tabindex="-1"
    aria-hidden="true"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header bg-warning">
          <h3 class="modal-title text-dark">
            <i class="ki-duotone ki-arrow-right-left fs-1 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Traslado de Causa
          </h3>
          <button
            type="button"
            class="btn-close"
            @click="close"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <!-- Loading state -->
          <div v-if="loading" class="text-center py-10">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2 text-muted">Cargando datos del perfil legal...</p>
          </div>

          <template v-else-if="profile">
            <!-- Info Alert -->
            <div class="alert alert-warning d-flex align-items-center mb-5">
              <i class="ki-duotone ki-information-5 fs-2x me-3 text-warning">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
              <div>
                <strong>Traslado de Causa</strong> - Este proceso registra cambios importantes en el perfil legal
                del PPL como cambio de juzgado, delitos, estatus procesal o sentencia.
                Todos los cambios quedarán registrados en la bitácora.
              </div>
            </div>

            <!-- Current Profile Info -->
            <div class="card bg-light-primary border-primary mb-5">
              <div class="card-header bg-primary">
                <h4 class="card-title text-white mb-0">Datos Actuales del Perfil Legal</h4>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label class="text-muted fw-bold d-block">PPL</label>
                    <span class="fs-5">{{ profile.inmate?.full_name || 'N/A' }}</span>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="text-muted fw-bold d-block">Expediente</label>
                    <span class="fs-5">{{ profile.case_number || 'N/A' }}</span>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="text-muted fw-bold d-block">Juzgado Actual</label>
                    <span class="fs-5">{{ profile.court?.name || 'N/A' }}</span>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="text-muted fw-bold d-block">Estatus Procesal</label>
                    <span class="badge badge-light-primary fs-6">{{ profile.procedural_status?.name || 'N/A' }}</span>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="text-muted fw-bold d-block">Etapa Procesal</label>
                    <span class="fs-5">{{ getProceduralStageName(profile.procedural_stage) }}</span>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="text-muted fw-bold d-block">Delitos Actuales</label>
                    <div v-if="profile.crimes && profile.crimes.length > 0">
                      <span
                        v-for="crime in profile.crimes"
                        :key="crime.id"
                        class="badge badge-light-danger me-1 mb-1"
                      >
                        {{ crime.crime?.name }}
                      </span>
                    </div>
                    <span v-else class="text-muted">Sin delitos registrados</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Transfer Form -->
            <form @submit.prevent="submitTransfer">
              <!-- Reason Section -->
              <div class="card mb-5">
                <div class="card-header">
                  <h4 class="card-title mb-0">Motivo del Traslado de Causa</h4>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-12 mb-4">
                      <label class="required form-label fw-bold">Justificación del Traslado de Causa</label>
                      <textarea
                        v-model="form.transfer_reason"
                        class="form-control"
                        :class="{ 'is-invalid': errors.transfer_reason }"
                        rows="3"
                        placeholder="Describa el motivo del traslado de causa, por ejemplo: cambio de estatus por sentencia firme, cambio de juzgado por competencia territorial, etc."
                      ></textarea>
                      <div v-if="errors.transfer_reason" class="invalid-feedback">{{ errors.transfer_reason }}</div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold">Referencia de Resolución Judicial</label>
                      <input
                        v-model="form.resolution_reference"
                        type="text"
                        class="form-control"
                        placeholder="Ej: Resolución No. 123-2024"
                      />
                      <div class="form-text">Número de resolución que ampara el cambio</div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold">Fecha de Resolución</label>
                      <input
                        v-model="form.resolution_date"
                        type="date"
                        class="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Changes Section -->
              <div class="card mb-5">
                <div class="card-header">
                  <h4 class="card-title mb-0">Cambios a Realizar</h4>
                  <span class="text-muted">Modifique solo los campos que cambian</span>
                </div>
                <div class="card-body">
                  <div class="row">
                    <!-- Juzgado -->
                    <div class="col-md-6 mb-4">
                      <label class="form-label fw-bold">
                        <i class="ki-duotone ki-courthouse fs-4 me-1">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        Nuevo Juzgado
                      </label>
                      <select v-model="form.court_id" class="form-select">
                        <option value="">-- Sin cambio --</option>
                        <option v-for="court in courts" :key="court.id" :value="court.id">
                          {{ court.name }}
                        </option>
                      </select>
                      <div v-if="form.court_id && form.court_id != profile.court_id" class="text-success mt-1">
                        <small><i class="fas fa-arrow-right me-1"></i> Cambio de: {{ profile.court?.name || 'N/A' }}</small>
                      </div>
                    </div>

                    <!-- Estatus Procesal -->
                    <div class="col-md-6 mb-4">
                      <label class="form-label fw-bold">
                        <i class="ki-duotone ki-shield-tick fs-4 me-1">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        Nuevo Estatus Procesal
                      </label>
                      <select v-model="form.procedural_status_id" class="form-select">
                        <option value="">-- Sin cambio --</option>
                        <option v-for="status in proceduralStatuses" :key="status.id" :value="status.id">
                          {{ status.name }}
                        </option>
                      </select>
                      <div v-if="form.procedural_status_id && form.procedural_status_id != profile.procedural_status_id" class="text-success mt-1">
                        <small><i class="fas fa-arrow-right me-1"></i> Cambio de: {{ profile.procedural_status?.name || 'N/A' }}</small>
                      </div>
                    </div>

                    <!-- Etapa Procesal -->
                    <div class="col-md-6 mb-4">
                      <label class="form-label fw-bold">
                        <i class="ki-duotone ki-document fs-4 me-1">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        Nueva Etapa Procesal
                      </label>
                      <select v-model="form.procedural_stage" class="form-select">
                        <option value="">-- Sin cambio --</option>
                        <option v-for="stage in proceduralStages" :key="stage.value" :value="stage.value">
                          {{ stage.label }}
                        </option>
                      </select>
                      <div v-if="form.procedural_stage && form.procedural_stage != profile.procedural_stage" class="text-success mt-1">
                        <small><i class="fas fa-arrow-right me-1"></i> Cambio de: {{ getProceduralStageName(profile.procedural_stage) }}</small>
                      </div>
                    </div>

                    <!-- Tipo de Sentencia -->
                    <div class="col-md-6 mb-4">
                      <label class="form-label fw-bold">
                        <i class="ki-duotone ki-scroll fs-4 me-1">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        Nuevo Tipo de Sentencia
                      </label>
                      <select v-model="form.sentence_type_id" class="form-select">
                        <option value="">-- Sin cambio --</option>
                        <option v-for="type in sentenceTypes" :key="type.id" :value="type.id">
                          {{ type.name }}
                        </option>
                      </select>
                      <div v-if="form.sentence_type_id && form.sentence_type_id != profile.sentence_type_id" class="text-success mt-1">
                        <small><i class="fas fa-arrow-right me-1"></i> Cambio de: {{ profile.sentence_type?.name || 'N/A' }}</small>
                      </div>
                    </div>

                    <!-- Delitos -->
                    <div class="col-12 mb-4">
                      <label class="form-label fw-bold">
                        <i class="ki-duotone ki-security-user fs-4 me-1">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        Nuevos Delitos
                      </label>
                      <div class="form-check mb-2">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          v-model="changeCrimes"
                          id="changeCrimes"
                        />
                        <label class="form-check-label" for="changeCrimes">
                          Modificar delitos asociados
                        </label>
                      </div>
                      <select
                        v-if="changeCrimes"
                        v-model="form.crime_ids"
                        class="form-select"
                        multiple
                        size="5"
                      >
                        <option v-for="crime in crimes" :key="crime.id" :value="crime.id">
                          {{ crime.name }}
                        </option>
                      </select>
                      <div v-if="changeCrimes" class="form-text">
                        Mantenga presionado Ctrl para seleccionar múltiples delitos
                      </div>
                    </div>
                  </div>

                  <!-- Datos de Sentencia (colapsable) -->
                  <div class="accordion" id="sentenceAccordion">
                    <div class="accordion-item">
                      <h2 class="accordion-header">
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#sentenceDetails"
                        >
                          <i class="ki-duotone ki-calendar fs-4 me-2">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                          Modificar Datos de Sentencia (opcional)
                        </button>
                      </h2>
                      <div id="sentenceDetails" class="accordion-collapse collapse" data-bs-parent="#sentenceAccordion">
                        <div class="accordion-body">
                          <div class="row">
                            <div class="col-md-4 mb-3">
                              <label class="form-label">Años de Sentencia</label>
                              <input v-model.number="form.sentence_years" type="number" class="form-control" min="0" />
                            </div>
                            <div class="col-md-4 mb-3">
                              <label class="form-label">Meses</label>
                              <input v-model.number="form.sentence_months" type="number" class="form-control" min="0" max="11" />
                            </div>
                            <div class="col-md-4 mb-3">
                              <label class="form-label">Días</label>
                              <input v-model.number="form.sentence_days" type="number" class="form-control" min="0" max="30" />
                            </div>
                            <div class="col-md-4 mb-3">
                              <label class="form-label">Fecha Inicio Sentencia</label>
                              <input v-model="form.sentence_start_date" type="date" class="form-control" />
                            </div>
                            <div class="col-md-4 mb-3">
                              <label class="form-label">Fecha Fin Sentencia</label>
                              <input v-model="form.sentence_end_date" type="date" class="form-control" />
                            </div>
                            <div class="col-md-4 mb-3 d-flex align-items-end">
                              <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="form.sentence_final" id="sentenceFinal" />
                                <label class="form-check-label" for="sentenceFinal">Sentencia Firme</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </template>
        </div>

        <div class="modal-footer flex-column align-items-stretch">
          <!-- Validation hints -->
          <div v-if="!hasChanges && !saving" class="alert alert-light-warning py-2 px-3 mb-3 w-100 text-center">
            <small>
              <span v-if="form.transfer_reason.trim().length < 10" class="text-danger">
                <i class="ki-duotone ki-information fs-6 me-1">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
                La justificación debe tener al menos 10 caracteres
              </span>
              <span v-else class="text-warning">
                <i class="ki-duotone ki-information fs-6 me-1">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
                Debe realizar al menos un cambio en los campos del perfil
              </span>
            </small>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-light" @click="close" :disabled="saving">
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-warning"
              @click="submitTransfer"
              :disabled="saving || !hasChanges"
            >
              <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="ki-duotone ki-check fs-2 me-1">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Registrar Traslado de Causa
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue';
import { Modal } from 'bootstrap';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';

interface Props {
  show: boolean;
  profileId: number | null;
}

const props = defineProps<Props>();
const emit = defineEmits(['completed', 'close']);

const modalRef = ref<HTMLElement | null>(null);
const modal = ref<Modal | null>(null);
const loading = ref(false);
const saving = ref(false);
const changeCrimes = ref(false);

// Data
const profile = ref<any>(null);
const courts = ref<any[]>([]);
const proceduralStatuses = ref<any[]>([]);
const sentenceTypes = ref<any[]>([]);
const crimes = ref<any[]>([]);
const errors = ref<Record<string, string>>({});

const proceduralStages = [
  { value: 'investigation', label: 'Etapa preparatoria' },
  { value: 'intermediate_phase', label: 'Etapa intermedia' },
  { value: 'oral_trial', label: 'Juicio oral' },
  { value: 'sentence_execution', label: 'Ejecución de sentencia' },
  { value: 'appeal_process', label: 'Proceso de apelación' },
  { value: 'cassation', label: 'Casación' },
  { value: 'constitutional_appeal', label: 'Amparo constitucional' },
  { value: 'review_process', label: 'Proceso de revisión' },
];

const form = ref({
  transfer_reason: '',
  resolution_reference: '',
  resolution_date: '',
  court_id: '',
  procedural_status_id: '',
  procedural_stage: '',
  sentence_type_id: '',
  crime_ids: [] as number[],
  sentence_years: null as number | null,
  sentence_months: null as number | null,
  sentence_days: null as number | null,
  sentence_start_date: '',
  sentence_end_date: '',
  sentence_final: false
});

// Helper to compare values (handles string/number comparison)
const isDifferent = (formValue: any, profileValue: any): boolean => {
  if (!formValue && formValue !== 0) return false; // Empty form value means no change intended
  const formStr = String(formValue);
  const profileStr = String(profileValue ?? '');
  return formStr !== profileStr;
};

const hasChanges = computed(() => {
  if (!profile.value) return false;

  const hasValidReason = form.value.transfer_reason.trim().length >= 10;

  const hasFieldChanges =
    isDifferent(form.value.court_id, profile.value.court_id) ||
    isDifferent(form.value.procedural_status_id, profile.value.procedural_status_id) ||
    (form.value.procedural_stage && form.value.procedural_stage !== profile.value.procedural_stage) ||
    isDifferent(form.value.sentence_type_id, profile.value.sentence_type_id) ||
    changeCrimes.value ||
    (form.value.sentence_years !== null && form.value.sentence_years !== '') ||
    (form.value.sentence_months !== null && form.value.sentence_months !== '') ||
    (form.value.sentence_days !== null && form.value.sentence_days !== '') ||
    !!form.value.sentence_start_date ||
    !!form.value.sentence_end_date;

  return hasValidReason && hasFieldChanges;
});

watch(() => props.show, async (show) => {
  if (show && props.profileId) {
    resetForm();
    await nextTick();
    if (modalRef.value) {
      modal.value = new Modal(modalRef.value);
      modal.value.show();
    }
    await loadData();
  } else {
    modal.value?.hide();
  }
});

const resetForm = () => {
  form.value = {
    transfer_reason: '',
    resolution_reference: '',
    resolution_date: '',
    court_id: '',
    procedural_status_id: '',
    procedural_stage: '',
    sentence_type_id: '',
    crime_ids: [],
    sentence_years: null,
    sentence_months: null,
    sentence_days: null,
    sentence_start_date: '',
    sentence_end_date: '',
    sentence_final: false
  };
  changeCrimes.value = false;
  errors.value = {};
};

const loadData = async () => {
  if (!props.profileId) return;

  try {
    loading.value = true;

    const [profileRes, courtsRes, statusesRes, typesRes, crimesRes] = await Promise.all([
      ApiService.get(`/legal/profiles/${props.profileId}`),
      ApiService.get('/catalogs/courts?simple=true'),
      ApiService.get('/catalogs/procedural-statuses?simple=true'),
      ApiService.get('/catalogs/sentence-types?simple=true'),
      ApiService.get('/catalogs/crimes?simple=true')
    ]);

    profile.value = profileRes.data.data;
    courts.value = courtsRes.data.data || [];
    proceduralStatuses.value = statusesRes.data.data || [];
    sentenceTypes.value = typesRes.data.data || [];
    crimes.value = crimesRes.data.data || [];

    // Pre-select current crimes
    if (profile.value.crimes) {
      form.value.crime_ids = profile.value.crimes.map((c: any) => c.crime_id);
    }

  } catch (error) {
    console.error('Error loading data:', error);
    await Swal.fire({
      title: 'Error',
      text: 'No se pudieron cargar los datos del perfil legal',
      icon: 'error'
    });
    close();
  } finally {
    loading.value = false;
  }
};

const getProceduralStageName = (stage: string | null): string => {
  if (!stage) return 'N/A';
  const found = proceduralStages.find(s => s.value === stage);
  return found?.label || stage;
};

const validate = (): boolean => {
  errors.value = {};

  if (!form.value.transfer_reason || form.value.transfer_reason.length < 10) {
    errors.value.transfer_reason = 'La justificación debe tener al menos 10 caracteres';
  }

  return Object.keys(errors.value).length === 0;
};

const submitTransfer = async () => {
  if (!validate()) {
    return;
  }

  // Confirm action
  const result = await Swal.fire({
    title: '¿Confirmar Traslado de Causa?',
    html: `
      <p>Esta acción registrará los cambios en el perfil legal y quedará en la bitácora.</p>
      <p class="text-muted">Esta operación no se puede deshacer.</p>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, Registrar Traslado',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#ffc107'
  });

  if (!result.isConfirmed) return;

  try {
    saving.value = true;

    // Build payload - only include fields with changes
    const payload: Record<string, any> = {
      transfer_reason: form.value.transfer_reason
    };

    if (form.value.resolution_reference) {
      payload.resolution_reference = form.value.resolution_reference;
    }
    if (form.value.resolution_date) {
      payload.resolution_date = form.value.resolution_date;
    }
    if (form.value.court_id && form.value.court_id != profile.value.court_id) {
      payload.court_id = form.value.court_id;
    }
    if (form.value.procedural_status_id && form.value.procedural_status_id != profile.value.procedural_status_id) {
      payload.procedural_status_id = form.value.procedural_status_id;
    }
    if (form.value.procedural_stage && form.value.procedural_stage != profile.value.procedural_stage) {
      payload.procedural_stage = form.value.procedural_stage;
    }
    if (form.value.sentence_type_id && form.value.sentence_type_id != profile.value.sentence_type_id) {
      payload.sentence_type_id = form.value.sentence_type_id;
    }
    if (changeCrimes.value) {
      payload.crime_ids = form.value.crime_ids;
    }
    if (form.value.sentence_years !== null) {
      payload.sentence_years = form.value.sentence_years;
    }
    if (form.value.sentence_months !== null) {
      payload.sentence_months = form.value.sentence_months;
    }
    if (form.value.sentence_days !== null) {
      payload.sentence_days = form.value.sentence_days;
    }
    if (form.value.sentence_start_date) {
      payload.sentence_start_date = form.value.sentence_start_date;
    }
    if (form.value.sentence_end_date) {
      payload.sentence_end_date = form.value.sentence_end_date;
    }
    if (form.value.sentence_final !== profile.value.sentence_final) {
      payload.sentence_final = form.value.sentence_final;
    }

    const response = await ApiService.post(`/legal/profiles/${props.profileId}/case-transfer`, payload);

    if (response.data.success) {
      await Swal.fire({
        title: '¡Traslado de Causa Registrado!',
        text: 'Los cambios han sido registrados exitosamente en la bitácora',
        icon: 'success',
        timer: 2500
      });

      emit('completed', response.data.data);
      close();
    }
  } catch (error: any) {
    console.error('Error submitting case transfer:', error);

    if (error.response?.status === 422) {
      if (error.response.data.errors) {
        const serverErrors = error.response.data.errors;
        for (const [key, messages] of Object.entries(serverErrors)) {
          errors.value[key] = Array.isArray(messages) ? messages[0] : messages as string;
        }
      } else if (error.response.data.message) {
        await Swal.fire({
          title: 'Atención',
          text: error.response.data.message,
          icon: 'warning'
        });
      }
    } else {
      await Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Error al registrar el traslado de causa',
        icon: 'error'
      });
    }
  } finally {
    saving.value = false;
  }
};

const close = () => {
  modal.value?.hide();
  emit('close');
};
</script>
