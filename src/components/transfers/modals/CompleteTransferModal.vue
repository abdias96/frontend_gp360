<template>
  <div
    ref="modalRef"
    class="modal fade"
    tabindex="-1"
    aria-hidden="true"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header bg-success">
          <h3 class="modal-title text-white">Completar Traslado</h3>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="close"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body" v-if="transfer">
          <!-- Loading state -->
          <div v-if="loadingSectors" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2 text-muted">Cargando sectores del centro destino...</p>
          </div>

          <template v-else>
            <div class="alert alert-info">
              <i class="ki-duotone ki-information fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
              Confirme la llegada del interno y asigne el sector donde será ubicado
            </div>

            <!-- Transfer Info -->
            <div class="card bg-light mb-5">
              <div class="card-body py-4">
                <div class="row">
                  <div class="col-md-6">
                    <div class="fw-bold text-gray-600 mb-1">Traslado</div>
                    <div class="fs-5 fw-bold">{{ transfer.transfer_number }}</div>
                  </div>
                  <div class="col-md-6">
                    <div class="fw-bold text-gray-600 mb-1">Interno</div>
                    <div class="fs-5">{{ getInmateName(transfer.inmate) }}</div>
                  </div>
                </div>
                <div class="separator my-3"></div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="fw-bold text-gray-600 mb-1">Centro Origen</div>
                    <div>{{ transfer.origin_center?.name || 'N/A' }}</div>
                  </div>
                  <div class="col-md-6">
                    <div class="fw-bold text-gray-600 mb-1">Centro Destino</div>
                    <div class="fw-bold text-primary">{{ transfer.destination_center?.name || 'N/A' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sector Assignment -->
            <div class="row mb-5">
              <div class="col-md-6">
                <label class="required form-label fw-bold">Sector de Destino</label>
                <select
                  v-model="form.destination_sector_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.destination_sector_id }"
                >
                  <option value="">Seleccionar sector...</option>
                  <option v-for="sector in sectors" :key="sector.id" :value="sector.id">
                    {{ sector.name }}
                  </option>
                </select>
                <div v-if="errors.destination_sector_id" class="invalid-feedback">
                  {{ errors.destination_sector_id }}
                </div>
                <div class="form-text">Sector asignado tras la evaluación del interno</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">Número de Celda (opcional)</label>
                <input
                  v-model="form.destination_cell_number"
                  type="text"
                  class="form-control"
                  placeholder="Ej: A-101"
                />
                <div class="form-text">Celda asignada en el sector de destino</div>
              </div>
            </div>

            <!-- Reception Notes -->
            <div class="mb-5">
              <label class="form-label fw-bold">Notas de Recepción (opcional)</label>
              <textarea
                v-model="form.reception_notes"
                class="form-control"
                rows="3"
                placeholder="Observaciones sobre la llegada del interno, condición física, documentación, etc."
              ></textarea>
            </div>

            <!-- Checkboxes -->
            <div class="row mb-4">
              <div class="col-md-6">
                <div class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="form.documentation_complete"
                    id="documentation"
                  />
                  <label class="form-check-label" for="documentation">
                    Documentación completa y en orden
                  </label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="form.incidents_occurred"
                    id="incidents"
                  />
                  <label class="form-check-label text-danger" for="incidents">
                    Se reportan incidentes durante el traslado
                  </label>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="close" :disabled="loading">
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn-success"
            @click="complete"
            :disabled="loading || loadingSectors"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="ki-duotone ki-check fs-2 me-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Completar Traslado
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { Modal } from 'bootstrap';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';

interface Sector {
  id: number;
  name: string;
}

interface Props {
  show: boolean;
  transfer: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['completed', 'close']);

const modalRef = ref<HTMLElement | null>(null);
const modal = ref<Modal | null>(null);
const loading = ref(false);
const loadingSectors = ref(false);
const sectors = ref<Sector[]>([]);
const errors = ref<Record<string, string>>({});

const form = ref({
  destination_sector_id: '',
  destination_cell_number: '',
  reception_notes: '',
  documentation_complete: true,
  incidents_occurred: false
});

watch(() => props.show, async (show) => {
  if (show && props.transfer) {
    // Reset form
    form.value = {
      destination_sector_id: props.transfer.destination_sector_id?.toString() || '',
      destination_cell_number: props.transfer.destination_cell_number || '',
      reception_notes: '',
      documentation_complete: true,
      incidents_occurred: false
    };
    errors.value = {};

    await nextTick();
    if (modalRef.value) {
      modal.value = new Modal(modalRef.value);
      modal.value.show();
    }

    // Load sectors for destination center
    await loadSectors();
  } else {
    modal.value?.hide();
  }
});

const loadSectors = async () => {
  if (!props.transfer?.destination_center_id) return;

  try {
    loadingSectors.value = true;
    const response = await ApiService.get(`/sectors/by-center/${props.transfer.destination_center_id}`);
    sectors.value = response.data.data || [];
  } catch (error) {
    console.error('Error loading sectors:', error);
    await Swal.fire({
      title: 'Error',
      text: 'No se pudieron cargar los sectores del centro destino',
      icon: 'error'
    });
  } finally {
    loadingSectors.value = false;
  }
};

const validate = (): boolean => {
  errors.value = {};

  if (!form.value.destination_sector_id) {
    errors.value.destination_sector_id = 'Debe seleccionar el sector donde será ubicado el interno';
  }

  return Object.keys(errors.value).length === 0;
};

const complete = async () => {
  if (!validate()) {
    return;
  }

  try {
    loading.value = true;

    const payload = {
      destination_sector_id: form.value.destination_sector_id,
      destination_cell_number: form.value.destination_cell_number || null,
      reception_notes: form.value.reception_notes || null,
      documentation_complete: form.value.documentation_complete,
      incidents_occurred: form.value.incidents_occurred
    };

    const response = await ApiService.post(`/transfers/${props.transfer.id}/complete`, payload);

    if (response.data.success) {
      await Swal.fire({
        title: '¡Traslado Completado!',
        text: 'El interno ha llegado exitosamente al centro destino y ha sido asignado al sector correspondiente',
        icon: 'success',
        timer: 2500
      });

      emit('completed');
      close();
    }
  } catch (error: any) {
    console.error('Error completing transfer:', error);

    if (error.response?.status === 422 && error.response?.data?.errors) {
      // Handle validation errors
      const serverErrors = error.response.data.errors;
      for (const [key, messages] of Object.entries(serverErrors)) {
        errors.value[key] = Array.isArray(messages) ? messages[0] : messages as string;
      }
    } else {
      await Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Error al completar el traslado',
        icon: 'error'
      });
    }
  } finally {
    loading.value = false;
  }
};

const close = () => {
  modal.value?.hide();
  emit('close');
};

const getInmateName = (inmate: any) => {
  if (!inmate) return 'N/A';
  const parts = [
    inmate.first_name,
    inmate.middle_name,
    inmate.last_name,
    inmate.second_last_name,
  ].filter(Boolean);
  return parts.join(' ') || 'N/A';
};
</script>
