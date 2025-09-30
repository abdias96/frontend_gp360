<template>
  <div class="modal fade" id="addCrimeModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Agregar Delito</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <!-- Delito Principal -->
            <div class="row g-6 mb-6">
              <div class="col-md-8">
                <label class="form-label required">Delito</label>
                <select v-model="form.crime_id" class="form-select" required>
                  <option value="">Seleccionar delito...</option>
                  <option 
                    v-for="crime in crimesOptions" 
                    :key="crime.value" 
                    :value="crime.value"
                  >
                    {{ crime.label }}
                  </option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label required">Clasificación</label>
                <select v-model="form.crime_classification_id" class="form-select" required>
                  <option value="">Seleccionar...</option>
                  <option 
                    v-for="classification in crimeClassificationsOptions" 
                    :key="classification.value" 
                    :value="classification.value"
                  >
                    {{ classification.label }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Rol -->
            <div class="row g-6 mb-6">
              <div class="col-md-6">
                <label class="form-label required">Rol en el Delito</label>
                <select v-model="form.crime_role" class="form-select" required>
                  <option value="">Seleccionar rol...</option>
                  <option value="primary">Principal</option>
                  <option value="secondary">Secundario</option>
                  <option value="accessory">Accesorio</option>
                </select>
              </div>
              <div class="col-md-6">
                <div class="form-check form-switch">
                  <input
                    v-model="form.admits_guilt"
                    class="form-check-input"
                    type="checkbox"
                    id="admitsGuilt"
                  />
                  <label class="form-check-label" for="admitsGuilt">
                    Acepta culpabilidad
                  </label>
                </div>
              </div>
            </div>

            <!-- Fechas -->
            <div class="row g-6 mb-6">
              <div class="col-md-6">
                <label class="form-label">Fecha del Delito</label>
                <input
                  v-model="form.crime_date"
                  type="date"
                  class="form-control"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Lugar del Delito</label>
                <input
                  v-model="form.crime_location"
                  type="text"
                  class="form-control"
                  placeholder="Ubicación donde ocurrió el delito"
                />
              </div>
            </div>

            <!-- Monto del Daño y Evidencia -->
            <div class="row g-6 mb-6">
              <div class="col-md-6">
                <label class="form-label">Monto del Daño (Q)</label>
                <input
                  v-model.number="form.damage_amount"
                  type="number"
                  class="form-control"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Descripción de Evidencias</label>
                <input
                  v-model="form.evidence_description"
                  type="text"
                  class="form-control"
                  placeholder="Descripción de evidencias encontradas"
                />
              </div>
            </div>

            <!-- Descripción -->
            <div class="row g-6">
              <div class="col-12">
                <label class="form-label">Descripción del Delito</label>
                <textarea
                  v-model="form.crime_description"
                  class="form-control"
                  rows="4"
                  placeholder="Descripción detallada de los hechos..."
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
            Agregar Delito
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCatalogs } from '@/composables/useCatalogs';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';

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
  crimesOptions, 
  crimeClassificationsOptions,
  loadLegalCatalogs 
} = useCatalogs();

// Form data
const form = ref({
  crime_id: '',
  crime_classification_id: '',
  crime_role: '',
  crime_date: '',
  crime_location: '',
  damage_amount: null,
  evidence_description: '',
  admits_guilt: null,
  crime_description: ''
});

// Methods
const resetForm = () => {
  form.value = {
    crime_id: '',
    crime_classification_id: '',
    crime_role: '',
    crime_date: '',
    crime_location: '',
    damage_amount: null,
    evidence_description: '',
    admits_guilt: null,
    crime_description: ''
  };
};

const submitForm = async () => {
  try {
    // Validate required fields
    if (!form.value.crime_id) {
      await Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar un delito',
        icon: 'error'
      });
      return;
    }
    
    if (!form.value.crime_classification_id) {
      await Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar una clasificación del delito',
        icon: 'error'
      });
      return;
    }
    
    if (!form.value.crime_role) {
      await Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar el rol en el delito',
        icon: 'error'
      });
      return;
    }

    loading.value = true;

    const response = await ApiService.post(`/inmates/${props.inmateId}/crimes`, form.value);

    await Swal.fire({
      title: 'Éxito',
      text: 'Delito agregado correctamente',
      icon: 'success',
      timer: 2000
    });

    emit('saved', response.data);
    
    // Close modal
    const modal = document.getElementById('addCrimeModal');
    const bsModal = window.bootstrap.Modal.getInstance(modal!);
    bsModal?.hide();

    resetForm();

  } catch (error: any) {
    console.error('Error adding crime:', error);
    await Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'Error al agregar el delito',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  loadLegalCatalogs();
});
</script>