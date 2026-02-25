<template>
  <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5)">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header bg-success text-white">
          <h5 class="modal-title">
            <i class="bi bi-check-circle me-2"></i>
            Completar Liberación
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="$emit('close')"
          ></button>
        </div>

        <div class="modal-body">
          <!-- Release Info -->
          <div class="alert alert-info d-flex align-items-center mb-6">
            <i class="bi bi-info-circle fs-2x me-3"></i>
            <div>
              <strong>Liberación #{{ release.release_number }}</strong><br>
              <span class="text-muted">
                PPL: {{ [release.inmate?.first_name, release.inmate?.middle_name, release.inmate?.last_name, release.inmate?.second_last_name].filter(Boolean).join(' ') }}<br>
                Fecha Programada: {{ formatDate(release.scheduled_release_date) }}
              </span>
            </div>
          </div>

          <form @submit.prevent="handleSubmit">
            <!-- Belongings Section -->
            <div class="mb-6">
              <h6 class="mb-4">Pertenencias</h6>

              <div class="form-check form-switch mb-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="belongings_returned"
                  v-model="form.belongings_returned"
                >
                <label class="form-check-label" for="belongings_returned">
                  Pertenencias devueltas
                </label>
              </div>

              <div v-if="form.belongings_returned" class="mb-3">
                <label class="form-label">Inventario de Pertenencias</label>
                <textarea
                  v-model="belongingsText"
                  class="form-control"
                  rows="3"
                  placeholder="Ingrese las pertenencias devueltas (una por línea)&#10;Ejemplo:&#10;- Reloj personal&#10;- Cadena de plata&#10;- Fotografías (3)"
                ></textarea>
              </div>

              <div class="mb-3">
                <label class="form-label">Dinero Devuelto (Q)</label>
                <input
                  v-model.number="form.money_returned"
                  type="number"
                  step="0.01"
                  min="0"
                  class="form-control"
                  placeholder="0.00"
                >
              </div>
            </div>

            <div class="separator border-gray-200 my-6"></div>

            <!-- Documents Section -->
            <div class="mb-6">
              <h6 class="mb-4">Documentación</h6>

              <div class="form-check form-switch mb-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="documents_provided"
                  v-model="form.documents_provided"
                >
                <label class="form-check-label" for="documents_provided">
                  Documentos entregados
                </label>
              </div>

              <div v-if="form.documents_provided" class="mb-3">
                <label class="form-label">Lista de Documentos</label>
                <textarea
                  v-model="documentsText"
                  class="form-control"
                  rows="3"
                  placeholder="Ingrese los documentos entregados (uno por línea)&#10;Ejemplo:&#10;- Constancia de libertad&#10;- Copia de resolución judicial&#10;- Certificado de conducta"
                ></textarea>
              </div>
            </div>

            <div class="separator border-gray-200 my-6"></div>

            <!-- Contact Information -->
            <div class="mb-6">
              <h6 class="mb-4">Información de Contacto</h6>

              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Dirección de Destino</label>
                  <input
                    v-model="form.release_address"
                    type="text"
                    class="form-control"
                    placeholder="Dirección donde residirá"
                  >
                </div>

                <div class="col-md-6">
                  <label class="form-label">Teléfono de Contacto</label>
                  <input
                    v-model="form.release_phone"
                    type="text"
                    class="form-control"
                    placeholder="Teléfono del PPL"
                  >
                </div>

                <div class="col-md-6">
                  <label class="form-label">Persona de Contacto</label>
                  <input
                    v-model="form.contact_person"
                    type="text"
                    class="form-control"
                    placeholder="Nombre del contacto de emergencia"
                  >
                </div>

                <div class="col-md-6">
                  <label class="form-label">Teléfono de Contacto</label>
                  <input
                    v-model="form.contact_phone"
                    type="text"
                    class="form-control"
                    placeholder="Teléfono del contacto"
                  >
                </div>
              </div>
            </div>

            <div class="separator border-gray-200 my-6"></div>

            <!-- Final Observations -->
            <div class="mb-6">
              <label class="form-label">Observaciones Finales</label>
              <textarea
                v-model="form.final_observations"
                class="form-control"
                rows="3"
                placeholder="Observaciones adicionales sobre el proceso de liberación"
              ></textarea>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-light"
            @click="$emit('close')"
            :disabled="loading"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn-success"
            @click="handleSubmit"
            :disabled="loading"
          >
            <span v-if="loading">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Procesando...
            </span>
            <span v-else>
              <i class="bi bi-check-circle me-2"></i>
              Completar Liberación
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useReleases } from '@/composables/useReleases';
import dayjs from 'dayjs';

interface Props {
  release: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['completed', 'close']);

const { completeRelease, loading } = useReleases();

const form = ref({
  belongings_returned: false,
  belongings_inventory: [] as string[],
  money_returned: 0,
  documents_provided: false,
  documents_list: [] as string[],
  release_address: '',
  release_phone: '',
  contact_person: '',
  contact_phone: '',
  final_observations: ''
});

const belongingsText = ref('');
const documentsText = ref('');

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY');
};

const handleSubmit = async () => {
  // Convert text areas to arrays
  if (belongingsText.value) {
    form.value.belongings_inventory = belongingsText.value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  if (documentsText.value) {
    form.value.documents_list = documentsText.value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  const result = await completeRelease(props.release.id, form.value);

  if (result) {
    emit('completed');
  }
};
</script>
