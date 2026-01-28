<template>
  <div class="modal fade" id="legalProfileModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ editMode ? 'Editar Perfil Legal' : 'Crear Perfil Legal' }}
          </h5>
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
                <label class="form-label required">Número de Caso</label>
                <input
                  v-model="form.case_number"
                  type="text"
                  class="form-control"
                  placeholder="Ingrese número de caso"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Expediente Judicial</label>
                <input
                  v-model="form.judicial_file_number"
                  type="text"
                  class="form-control"
                  placeholder="Ingrese expediente judicial"
                />
              </div>
            </div>

            <!-- Tribunal y Estado -->
            <div class="row g-6 mb-6">
              <div class="col-md-6">
                <label class="form-label required">Tribunal</label>
                <select v-model="form.court_id" class="form-select" required>
                  <option value="">Seleccionar tribunal...</option>
                  <option 
                    v-for="court in courtsOptions" 
                    :key="court.value" 
                    :value="court.value"
                  >
                    {{ court.label }}
                  </option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Estado Procesal</label>
                <select v-model="form.procedural_status_id" class="form-select">
                  <option value="">Seleccionar estado...</option>
                  <option 
                    v-for="status in proceduralStatusOptions" 
                    :key="status.value" 
                    :value="status.value"
                  >
                    {{ status.label }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Información de Captura -->
            <div class="row g-6 mb-6">
              <div class="col-md-6">
                <label class="form-label required">Fecha de Captura</label>
                <input
                  v-model="form.arrest_date"
                  type="date"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Lugar de Captura</label>
                <input
                  v-model="form.arrest_location"
                  type="text"
                  class="form-control"
                  placeholder="Lugar donde fue capturado"
                />
              </div>
            </div>

            <!-- Etapa Procesal -->
            <div class="row g-6 mb-6">
              <div class="col-md-12">
                <label class="form-label">Etapa procesal</label>
                <select v-model="form.procedural_stage" class="form-select">
                  <option value="">Seleccionar etapa procesal...</option>
                  <option value="investigation">Etapa preparatoria</option>
                  <option value="intermediate_phase">Etapa intermedia</option>
                  <option value="oral_trial">Juicio oral</option>
                  <option value="sentence_execution">Ejecución de sentencia</option>
                  <option value="appeal_process">Proceso de apelación</option>
                  <option value="cassation">Casación</option>
                  <option value="constitutional_appeal">Amparo constitucional</option>
                  <option value="review_process">Proceso de revisión</option>
                </select>
              </div>
            </div>

            <!-- Prisión Preventiva -->
            <div class="row g-6 mb-6">
              <div class="col-md-6">
                <label class="form-label">Prisión Preventiva</label>
                <div class="form-check form-switch">
                  <input
                    v-model="form.in_preventive_detention"
                    class="form-check-input"
                    type="checkbox"
                    id="preventiveDetention"
                  />
                  <label class="form-check-label" for="preventiveDetention">
                    Actualmente en prisión preventiva
                  </label>
                </div>
              </div>
              <div v-if="form.in_preventive_detention" class="col-md-6">
                <label class="form-label">Fecha de Inicio</label>
                <input
                  v-model="form.preventive_detention_start"
                  type="date"
                  class="form-control"
                />
              </div>
            </div>

            <!-- Defensa -->
            <div class="row g-6 mb-6">
              <div class="col-md-4">
                <label class="form-label required">Tipo de Defensa</label>
                <select v-model="form.defense_attorney_type" class="form-select" required>
                  <option value="">Seleccionar...</option>
                  <option value="public">Defensa Pública</option>
                  <option value="private">Defensa Privada</option>
                  <option value="none">Sin Defensa</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Nombre del Abogado</label>
                <input
                  v-model="form.defense_attorney_name"
                  type="text"
                  class="form-control"
                  placeholder="Nombre completo"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">Teléfono del Abogado</label>
                <input
                  v-model="form.defense_attorney_phone"
                  type="text"
                  class="form-control"
                  placeholder="Número de teléfono"
                />
              </div>
            </div>

            <!-- Ministerio Público -->
            <div class="row g-6 mb-6">
              <div class="col-md-6">
                <label class="form-label">Fiscal</label>
                <input
                  v-model="form.prosecutor_name"
                  type="text"
                  class="form-control"
                  placeholder="Nombre del fiscal"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Oficina Fiscal</label>
                <input
                  v-model="form.prosecutor_office"
                  type="text"
                  class="form-control"
                  placeholder="Oficina o distrito fiscal"
                />
              </div>
            </div>

            <!-- Sentencia -->
            <div class="row g-6 mb-6">
              <div class="col-md-6">
                <label class="form-label">Tipo de Sentencia</label>
                <select v-model="form.sentence_type_id" class="form-select">
                  <option value="">Seleccionar tipo...</option>
                  <option 
                    v-for="type in sentenceTypesOptions" 
                    :key="type.value" 
                    :value="type.value"
                  >
                    {{ type.label }}
                  </option>
                </select>
              </div>
              <div class="col-md-6">
                <div class="form-check form-switch">
                  <input
                    v-model="form.sentence_final"
                    class="form-check-input"
                    type="checkbox"
                    id="sentenceFinal"
                  />
                  <label class="form-check-label" for="sentenceFinal">
                    Sentencia firme
                  </label>
                </div>
              </div>
            </div>

            <!-- Duración de Sentencia -->
            <div class="row g-6 mb-6">
              <div class="col-md-4">
                <label class="form-label">Años</label>
                <input
                  v-model.number="form.sentence_years"
                  type="number"
                  class="form-control"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">Meses</label>
                <input
                  v-model.number="form.sentence_months"
                  type="number"
                  class="form-control"
                  placeholder="0"
                  min="0"
                  max="11"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">Días</label>
                <input
                  v-model.number="form.sentence_days"
                  type="number"
                  class="form-control"
                  placeholder="0"
                  min="0"
                  max="30"
                />
              </div>
            </div>

            <!-- Fechas importantes -->
            <div class="row g-6 mb-6">
              <div class="col-md-6">
                <label class="form-label">Fecha de Inicio de Sentencia</label>
                <input
                  v-model="form.sentence_start_date"
                  type="date"
                  class="form-control"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Fecha de Fin de Sentencia</label>
                <input
                  v-model="form.sentence_end_date"
                  type="date"
                  class="form-control"
                />
              </div>
            </div>

            <!-- Notas -->
            <div class="row g-6">
              <div class="col-12">
                <label class="form-label">Notas Legales</label>
                <textarea
                  v-model="form.legal_notes"
                  class="form-control"
                  rows="4"
                  placeholder="Observaciones adicionales sobre el caso legal..."
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
            {{ editMode ? 'Actualizar' : 'Crear' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useCatalogs } from '@/composables/useCatalogs';
import ApiService from '@/core/services/ApiService';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import { formatDateForInput } from '@/core/helpers/date-formatters';

// Props
interface Props {
  inmateId: string | number;
  existingProfile?: any;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits(['saved', 'close']);

// State
const loading = ref(false);
const editMode = computed(() => !!props.existingProfile);

// Catalogs
const { 
  courtsOptions, 
  proceduralStatusOptions, 
  sentenceTypesOptions,
  loadLegalCatalogs 
} = useCatalogs();

// Form data
const form = ref({
  case_number: '',
  judicial_file_number: '',
  court_id: '',
  arrest_date: '',
  arrest_location: '',
  prosecutor_name: '',
  prosecutor_office: '',
  defense_attorney_name: '',
  defense_attorney_phone: '',
  defense_attorney_type: '',
  procedural_stage: '',
  procedural_status_id: '',
  in_preventive_detention: false,
  preventive_detention_start: '',
  sentence_type_id: '',
  sentence_years: 0,
  sentence_months: 0,
  sentence_days: 0,
  sentence_start_date: '',
  sentence_end_date: '',
  sentence_final: false,
  legal_notes: ''
});

// Methods
const resetForm = () => {
  form.value = {
    case_number: '',
    judicial_file_number: '',
    court_id: '',
    arrest_date: '',
    arrest_location: '',
    prosecutor_name: '',
    prosecutor_office: '',
    defense_attorney_name: '',
    defense_attorney_phone: '',
    defense_attorney_type: '',
    procedural_stage: '',
    procedural_status_id: '',
    in_preventive_detention: false,
    preventive_detention_start: '',
    sentence_type_id: '',
    sentence_years: 0,
    sentence_months: 0,
    sentence_days: 0,
    sentence_start_date: '',
    sentence_end_date: '',
    sentence_final: false,
    legal_notes: ''
  };
};

const loadExistingData = () => {
  if (props.existingProfile) {
    form.value = {
      case_number: props.existingProfile.case_number || '',
      judicial_file_number: props.existingProfile.judicial_file_number || '',
      court_id: props.existingProfile.court_id || '',
      arrest_date: formatDateForInput(props.existingProfile.arrest_date),
      arrest_location: props.existingProfile.arrest_location || '',
      prosecutor_name: props.existingProfile.prosecutor_name || '',
      prosecutor_office: props.existingProfile.prosecutor_office || '',
      defense_attorney_name: props.existingProfile.defense_attorney_name || '',
      defense_attorney_phone: props.existingProfile.defense_attorney_phone || '',
      defense_attorney_type: props.existingProfile.defense_attorney_type || '',
      procedural_stage: props.existingProfile.procedural_stage || '',
      procedural_status_id: props.existingProfile.procedural_status_id || '',
      in_preventive_detention: props.existingProfile.in_preventive_detention || false,
      preventive_detention_start: formatDateForInput(props.existingProfile.preventive_detention_start),
      sentence_type_id: props.existingProfile.sentence_type_id || '',
      sentence_years: props.existingProfile.sentence_years || 0,
      sentence_months: props.existingProfile.sentence_months || 0,
      sentence_days: props.existingProfile.sentence_days || 0,
      sentence_start_date: formatDateForInput(props.existingProfile.sentence_start_date),
      sentence_end_date: formatDateForInput(props.existingProfile.sentence_end_date),
      sentence_final: props.existingProfile.sentence_final || false,
      legal_notes: props.existingProfile.legal_notes || ''
    };
  }
};

const submitForm = async () => {
  try {
    loading.value = true;

    let response;

    if (editMode.value && props.existingProfile?.id) {
      // Update existing profile
      const endpoint = `/inmate-legal-profiles/${props.existingProfile.id}`;
      response = await ApiService.put(endpoint, form.value);
    } else {
      // Create new profile - include inmate_id in the request body
      const endpoint = `/inmate-legal-profiles`;
      const formData = {
        ...form.value,
        inmate_id: props.inmateId
      };
      response = await ApiService.post(endpoint, formData);
    }

    await Swal.fire({
      title: 'Éxito',
      text: `Perfil legal ${editMode.value ? 'actualizado' : 'creado'} correctamente`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });

    emit('saved', response.data);

    // Close modal
    const modal = document.getElementById('legalProfileModal');
    const bsModal = Modal.getInstance(modal!);
    bsModal?.hide();

  } catch (error: any) {
    console.error('Error saving legal profile:', error);
    await Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'Error al guardar el perfil legal',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};

// Watchers
watch(() => props.existingProfile, () => {
  loadExistingData();
}, { immediate: true });

// Lifecycle
onMounted(() => {
  loadLegalCatalogs();
  loadExistingData();
});
</script>