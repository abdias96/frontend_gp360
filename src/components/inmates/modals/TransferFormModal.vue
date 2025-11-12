<template>
  <div 
    id="transferFormModal" 
    class="modal fade" 
    tabindex="-1" 
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">
            {{ isEditing ? 'Editar Solicitud de Traslado' : 'Nueva Solicitud de Traslado' }}
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
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="submitForm" ref="formRef">
            <!-- Inmate Selection -->
            <div class="row mb-7">
              <div class="col-12">
                <label class="required fs-6 fw-semibold mb-2">Interno a Trasladar</label>

                <!-- Show as read-only card when inmateId is provided -->
                <div v-if="inmateId && selectedInmate" class="card border border-primary">
                  <div class="card-body p-4">
                    <div class="d-flex align-items-center">
                      <div class="symbol symbol-circle symbol-50px overflow-hidden me-3">
                        <div class="symbol-label">
                          <img
                            :src="selectedInmate.photo_path || '/media/avatars/blank.png'"
                            :alt="selectedInmate.full_name"
                            class="w-100"
                          />
                        </div>
                      </div>
                      <div class="flex-grow-1">
                        <div class="fw-bold text-gray-800 fs-5">{{ selectedInmate.full_name }}</div>
                        <div class="text-muted">
                          <span class="badge badge-light-primary me-2">{{ selectedInmate.inmate_number }}</span>
                          <span>{{ selectedInmate.document_number }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Show as selector when no inmateId is provided -->
                <select
                  v-else
                  v-model="form.inmate_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.inmate_id }"
                  :disabled="isEditing"
                  @change="onInmateChange"
                >
                  <option value="">Seleccionar interno...</option>
                  <option v-for="inmate in inmates" :key="inmate?.id" :value="inmate?.id">
                    {{ inmate?.full_name }} - {{ inmate?.inmate_number }}
                  </option>
                </select>

                <div v-if="errors.inmate_id" class="invalid-feedback">{{ errors.inmate_id }}</div>
              </div>
            </div>

            <!-- Current Location (Read-only) -->
            <div v-if="selectedInmate" class="row mb-7">
              <div class="col-12">
                <label class="fs-6 fw-semibold mb-2">Ubicación Actual</label>
                <div class="card border border-dashed border-primary">
                  <div class="card-body p-4">
                    <div class="row">
                      <div class="col-md-4">
                        <strong>Centro:</strong><br>
                        <span class="text-muted">{{ selectedInmate.current_center?.name || 'N/A' }}</span>
                      </div>
                      <div class="col-md-4">
                        <strong>Sector:</strong><br>
                        <span class="text-muted">{{ selectedInmate.current_sector?.name || 'N/A' }}</span>
                      </div>
                      <div class="col-md-4">
                        <strong>Celda:</strong><br>
                        <span class="text-muted">{{ selectedInmate.current_cell_number || 'N/A' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Destination -->
            <div class="row mb-7">
              <div class="col-md-6">
                <label class="required fs-6 fw-semibold mb-2">Centro de Destino</label>
                <select
                  v-model="form.destination_center_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.destination_center_id }"
                  @change="onDestinationCenterChange"
                >
                  <option value="">Seleccionar centro...</option>
                  <option v-for="center in centers" :key="center?.id" :value="center?.id">
                    {{ center?.name }}
                  </option>
                </select>
                <div v-if="errors.destination_center_id" class="invalid-feedback">{{ errors.destination_center_id }}</div>
              </div>
              <div class="col-md-6">
                <label class="required fs-6 fw-semibold mb-2">Sector de Destino</label>
                <select
                  v-model="form.destination_sector_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.destination_sector_id }"
                  :disabled="!form.destination_center_id"
                >
                  <option value="">Seleccionar sector...</option>
                  <option v-for="sector in destinationSectors" :key="sector?.id" :value="sector?.id">
                    {{ sector?.name }}
                  </option>
                </select>
                <div v-if="errors.destination_sector_id" class="invalid-feedback">{{ errors.destination_sector_id }}</div>
              </div>
            </div>

            <!-- Transfer Details -->
            <div class="row mb-7">
              <div class="col-md-6">
                <label class="required fs-6 fw-semibold mb-2">Motivo del Traslado</label>
                <select
                  v-model="form.transfer_reason_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.transfer_reason_id }"
                >
                  <option value="">Seleccionar motivo...</option>
                  <option v-for="reason in transferReasons" :key="reason?.id" :value="reason?.id">
                    {{ reason?.name }}
                  </option>
                </select>
                <div v-if="errors.transfer_reason_id" class="invalid-feedback">{{ errors.transfer_reason_id }}</div>
              </div>
              <div class="col-md-6">
                <label class="required fs-6 fw-semibold mb-2">Fecha y Hora Programada</label>
                <input
                  v-model="form.scheduled_departure_datetime"
                  type="datetime-local"
                  class="form-control"
                  :class="{ 'is-invalid': errors.scheduled_departure_datetime }"
                  :min="minDatetime"
                />
                <div v-if="errors.scheduled_departure_datetime" class="invalid-feedback">{{ errors.scheduled_departure_datetime }}</div>
              </div>
            </div>

            <!-- Priority and Urgency -->
            <div class="row mb-7">
              <div class="col-md-6">
                <label class="required fs-6 fw-semibold mb-2">Nivel de Prioridad</label>
                <select
                  v-model="form.priority_level"
                  class="form-select"
                  :class="{ 'is-invalid': errors.priority_level }"
                >
                  <option value="">Seleccionar prioridad...</option>
                  <option value="low">Baja</option>
                  <option value="normal">Normal</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
                <div v-if="errors.priority_level" class="invalid-feedback">{{ errors.priority_level }}</div>
              </div>
              <div class="col-md-6">
                <label class="fs-6 fw-semibold mb-2">Nivel de Urgencia</label>
                <select
                  v-model="form.urgency_level"
                  class="form-select"
                  :class="{ 'is-invalid': errors.urgency_level }"
                >
                  <option value="">Seleccionar urgencia...</option>
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
                <div v-if="errors.urgency_level" class="invalid-feedback">{{ errors.urgency_level }}</div>
              </div>
            </div>

            <!-- Justification -->
            <div class="row mb-7">
              <div class="col-12">
                <label class="required fs-6 fw-semibold mb-2">Justificación del Traslado</label>
                <textarea
                  v-model="form.justification"
                  class="form-control"
                  :class="{ 'is-invalid': errors.justification }"
                  rows="4"
                  placeholder="Describa detalladamente el motivo y justificación del traslado..."
                ></textarea>
                <div v-if="errors.justification" class="invalid-feedback">{{ errors.justification }}</div>
              </div>
            </div>

            <!-- Detailed Reason -->
            <div class="row mb-7">
              <div class="col-12">
                <label class="fs-6 fw-semibold mb-2">Razón Detallada</label>
                <textarea
                  v-model="form.detailed_reason"
                  class="form-control"
                  :class="{ 'is-invalid': errors.detailed_reason }"
                  rows="3"
                  placeholder="Información adicional sobre el traslado..."
                ></textarea>
                <div v-if="errors.detailed_reason" class="invalid-feedback">{{ errors.detailed_reason }}</div>
              </div>
            </div>

            <!-- Special Requirements -->
            <div class="row mb-7">
              <div class="col-12">
                <label class="fs-6 fw-semibold mb-4">Requisitos Especiales</label>
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-check form-check-custom form-check-solid">
                      <input
                        v-model="form.requires_medical_clearance"
                        class="form-check-input"
                        type="checkbox"
                        id="medical_clearance"
                      />
                      <label class="form-check-label" for="medical_clearance">
                        Requiere Autorización Médica
                      </label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-check form-check-custom form-check-solid">
                      <input
                        v-model="form.requires_security_clearance"
                        class="form-check-input"
                        type="checkbox"
                        id="security_clearance"
                      />
                      <label class="form-check-label" for="security_clearance">
                        Requiere Autorización de Seguridad
                      </label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-check form-check-custom form-check-solid">
                      <input
                        v-model="form.requires_court_authorization"
                        class="form-check-input"
                        type="checkbox"
                        id="court_authorization"
                      />
                      <label class="form-check-label" for="court_authorization">
                        Requiere Autorización Judicial
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Security and Medical Escorts -->
            <div class="row mb-7">
              <div class="col-md-6">
                <div class="form-check form-check-custom form-check-solid">
                  <input
                    v-model="form.requires_medical_escort"
                    class="form-check-input"
                    type="checkbox"
                    id="medical_escort"
                  />
                  <label class="form-check-label" for="medical_escort">
                    Requiere Escolta Médica
                  </label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-check form-check-custom form-check-solid">
                  <input
                    v-model="form.requires_security_escort"
                    class="form-check-input"
                    type="checkbox"
                    id="security_escort"
                  />
                  <label class="form-check-label" for="security_escort">
                    Requiere Escolta de Seguridad
                  </label>
                </div>
              </div>
            </div>

            <!-- Security Personnel -->
            <div v-if="form.requires_security_escort" class="row mb-7">
              <div class="col-md-6">
                <label class="fs-6 fw-semibold mb-2">Mínimo Personal de Seguridad</label>
                <input
                  v-model.number="form.min_security_personnel"
                  type="number"
                  class="form-control"
                  :class="{ 'is-invalid': errors.min_security_personnel }"
                  min="1"
                  max="10"
                />
                <div v-if="errors.min_security_personnel" class="invalid-feedback">{{ errors.min_security_personnel }}</div>
              </div>
            </div>

            <!-- Considerations -->
            <div class="row mb-7">
              <div class="col-md-6">
                <label class="fs-6 fw-semibold mb-2">Consideraciones de Seguridad</label>
                <textarea
                  v-model="form.security_considerations"
                  class="form-control"
                  rows="3"
                  placeholder="Observaciones especiales de seguridad..."
                ></textarea>
              </div>
              <div class="col-md-6">
                <label class="fs-6 fw-semibold mb-2">Consideraciones Médicas</label>
                <textarea
                  v-model="form.medical_considerations"
                  class="form-control"
                  rows="3"
                  placeholder="Observaciones especiales médicas..."
                ></textarea>
              </div>
            </div>

            <!-- Observations -->
            <div class="row mb-7">
              <div class="col-12">
                <label class="fs-6 fw-semibold mb-2">Observaciones Generales</label>
                <textarea
                  v-model="form.observations"
                  class="form-control"
                  rows="3"
                  placeholder="Observaciones adicionales sobre el traslado..."
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="close">
            Cancelar
          </button>
          <button 
            type="button" 
            class="btn btn-primary" 
            @click="submitForm"
            :disabled="saving"
          >
            <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ isEditing ? 'Actualizar Solicitud' : 'Crear Solicitud' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { Modal } from 'bootstrap';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import { formatDateForInput } from '@/core/helpers/date-formatters';

// Props
interface Props {
  transfer?: any;
  show: boolean;
  inmateId?: number;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  close: [];
  saved: [transfer: any];
}>();

// State
const modalRef = ref<HTMLElement>();
const formRef = ref<HTMLFormElement>();
const loading = ref(false);
const saving = ref(false);
const modal = ref<Modal>();

// Data
const inmates = ref<any[]>([]);
const centers = ref<any[]>([]);
const destinationSectors = ref<any[]>([]);
const transferReasons = ref<any[]>([]);
const selectedInmate = ref<any>(null);

// Form data
const form = ref({
  inmate_id: '',
  destination_center_id: '',
  destination_sector_id: '',
  transfer_reason_id: '',
  scheduled_departure_datetime: '',
  transfer_description: '',
  priority_level: 'normal',
  urgency_level: '',
  justification: '',
  detailed_reason: '',
  requires_medical_clearance: false,
  requires_security_clearance: false,
  requires_court_authorization: false,
  requires_medical_escort: false,
  requires_security_escort: false,
  min_security_personnel: 2,
  security_considerations: '',
  medical_considerations: '',
  observations: ''
});

// Errors
const errors = ref<{ [key: string]: string }>({});

// Computed
const isEditing = computed(() => !!props.transfer);
const inmateId = computed(() => props.inmateId);
const minDatetime = computed(() => {
  const now = new Date();
  now.setHours(now.getHours() + 1); // At least 1 hour from now
  return now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
});

// Watchers
watch(() => props.show, async (show) => {
  if (show) {
    await nextTick();
    if (modalRef.value) {
      modal.value = new Modal(modalRef.value);
      modal.value.show();

      // Reset form first
      resetForm();

      // Load initial data
      await loadInitialData();

      if (props.transfer) {
        populateForm();
      } else if (props.inmateId) {
        // Pre-select inmate if inmateId is provided
        // selectedInmate is already set in loadInitialData
        form.value.inmate_id = props.inmateId.toString();
      }
    }
  } else {
    modal.value?.hide();
  }
});

// Methods
const loadInitialData = async () => {
  try {
    loading.value = true;

    // Load all required data in parallel
    // Use ?simple=true to get unpaginated arrays for dropdowns
    const promises = [
      ApiService.get('/catalogs/centers?simple=true'),
      ApiService.get('/catalogs/transfer-reasons?simple=true')
    ];

    // Only load all inmates if no inmateId is provided
    if (!props.inmateId) {
      promises.push(ApiService.get('/inmates?per_page=1000&status=active'));
    } else {
      // Load specific inmate
      promises.push(ApiService.get(`/inmates/${props.inmateId}`));
    }

    const [centersRes, reasonsRes, inmatesRes] = await Promise.all(promises);

    // Both centers and transfer reasons use simple mode
    centers.value = centersRes.data.data || [];
    transferReasons.value = reasonsRes.data.data || [];

    if (!props.inmateId) {
      // Inmates endpoint returns paginated data
      inmates.value = inmatesRes.data.data.data || inmatesRes.data.data || [];
    } else {
      // Single inmate was loaded
      const inmate = inmatesRes.data.data;
      inmates.value = [inmate];
      selectedInmate.value = inmate;
    }

  } catch (error) {
    console.error('Error loading initial data:', error);
    await Swal.fire({
      title: 'Error',
      text: 'Error al cargar los datos iniciales',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const onInmateChange = () => {
  if (form.value.inmate_id) {
    selectedInmate.value = inmates.value.find(i => i.id.toString() === form.value.inmate_id.toString());
  } else {
    selectedInmate.value = null;
  }
};

const onDestinationCenterChange = async () => {
  form.value.destination_sector_id = '';
  destinationSectors.value = [];
  
  if (form.value.destination_center_id) {
    try {
      const response = await ApiService.get(`/sectors/by-center/${form.value.destination_center_id}`);
      destinationSectors.value = response.data.data;
    } catch (error) {
      console.error('Error loading sectors:', error);
    }
  }
};

const populateForm = () => {
  if (props.transfer) {
    Object.assign(form.value, {
      inmate_id: props.transfer.inmate_id,
      destination_center_id: props.transfer.destination_center_id,
      destination_sector_id: props.transfer.destination_sector_id,
      transfer_reason_id: props.transfer.transfer_reason_id,
      scheduled_departure_datetime: props.transfer.scheduled_departure_datetime
        ? new Date(props.transfer.scheduled_departure_datetime).toISOString().slice(0, 16)
        : '',
      transfer_description: props.transfer.transfer_description || '',
      justification: props.transfer.transfer_description || '',
      detailed_reason: '',
      priority_level: 'normal',
      urgency_level: '',
      requires_medical_clearance: false,
      requires_security_clearance: false,
      requires_court_authorization: false,
      requires_medical_escort: false,
      requires_security_escort: false,
      min_security_personnel: 2,
      security_considerations: '',
      medical_considerations: '',
      observations: ''
    });

    // Trigger dependent data loading
    onInmateChange();
    onDestinationCenterChange();
  }
};

const resetForm = () => {
  Object.assign(form.value, {
    inmate_id: '',
    destination_center_id: '',
    destination_sector_id: '',
    transfer_reason_id: '',
    scheduled_departure_datetime: '',
    transfer_description: '',
    priority_level: 'normal',
    urgency_level: '',
    justification: '',
    detailed_reason: '',
    requires_medical_clearance: false,
    requires_security_clearance: false,
    requires_court_authorization: false,
    requires_medical_escort: false,
    requires_security_escort: false,
    min_security_personnel: 2,
    security_considerations: '',
    medical_considerations: '',
    observations: ''
  });

  errors.value = {};
  selectedInmate.value = null;
  destinationSectors.value = [];
};

const validateForm = () => {
  errors.value = {};

  if (!form.value.inmate_id) {
    errors.value.inmate_id = 'El interno es requerido';
  }

  if (!form.value.destination_center_id) {
    errors.value.destination_center_id = 'El centro de destino es requerido';
  }

  if (!form.value.destination_sector_id) {
    errors.value.destination_sector_id = 'El sector de destino es requerido';
  }

  if (!form.value.transfer_reason_id) {
    errors.value.transfer_reason_id = 'El motivo del traslado es requerido';
  }

  if (!form.value.scheduled_departure_datetime) {
    errors.value.scheduled_departure_datetime = 'La fecha y hora de traslado es requerida';
  }

  return Object.keys(errors.value).length === 0;
};

const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    saving.value = true;

    // Build transfer description from justification and detailed_reason
    let transferDescription = '';
    if (form.value.justification) {
      transferDescription = form.value.justification;
    }
    if (form.value.detailed_reason) {
      transferDescription += transferDescription ? '\n\n' + form.value.detailed_reason : form.value.detailed_reason;
    }

    // Prepare data matching backend expectations
    const transferData = {
      inmate_id: form.value.inmate_id,
      destination_center_id: form.value.destination_center_id,
      destination_sector_id: form.value.destination_sector_id,
      transfer_reason_id: form.value.transfer_reason_id,
      scheduled_departure_datetime: form.value.scheduled_departure_datetime,
      transfer_description: transferDescription || undefined
    };

    const url = isEditing.value ? `/transfers/${props.transfer.id}` : '/transfers';
    const method = isEditing.value ? 'put' : 'post';

    const response = await ApiService[method](url, transferData);

    if (response.data.success) {
      await Swal.fire({
        title: '¡Éxito!',
        text: isEditing.value
          ? 'La solicitud de traslado ha sido actualizada correctamente'
          : 'La solicitud de traslado ha sido creada correctamente',
        icon: 'success',
        timer: 2000
      });

      emit('saved', response.data.data);
      close();
    }
  } catch (error: any) {
    console.error('Error saving transfer:', error);

    if (error.response?.status === 422) {
      // Validation errors
      errors.value = error.response.data.errors || {};
    }

    await Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'Error al guardar la solicitud de traslado',
      icon: 'error'
    });
  } finally {
    saving.value = false;
  }
};

const close = () => {
  modal.value?.hide();
  emit('close');
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