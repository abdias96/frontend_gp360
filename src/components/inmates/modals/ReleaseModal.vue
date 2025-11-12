<template>
  <div class="modal fade" id="releaseModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title">
            <i class="bi bi-box-arrow-right me-2"></i>
            Proceso de Liberación
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <div class="alert alert-warning d-flex align-items-center" role="alert">
            <i class="bi bi-exclamation-triangle-fill fs-3 me-3"></i>
            <div>
              <strong>Atención:</strong> Este proceso marcará el perfil legal como completado y actualizará el estado del interno.
            </div>
          </div>

          <form @submit.prevent="submitRelease">
            <!-- Selector de Perfil Legal (si tiene múltiples perfiles activos) -->
            <div class="mb-6" v-if="legalProfiles.length > 0">
              <label class="form-label required">Perfil Legal a Liberar</label>
              <select v-model="form.legal_profile_id" class="form-select" required :disabled="loadingProfiles || legalProfiles.length === 1">
                <option value="">
                  {{ loadingProfiles ? 'Cargando perfiles...' : 'Seleccionar perfil legal...' }}
                </option>
                <option
                  v-for="profile in legalProfiles"
                  :key="profile.id"
                  :value="profile.id"
                >
                  Caso #{{ profile.case_number }} - {{ profile.court?.name || 'Sin tribunal' }}
                  <span v-if="profile.crimes && profile.crimes.length > 0">
                    - {{ profile.crimes.map(c => c.crime?.name).filter(Boolean).join(', ') }}
                  </span>
                </option>
              </select>
              <div v-if="legalProfiles.length === 1" class="form-text text-muted">
                Solo hay un perfil legal activo, seleccionado automáticamente.
              </div>
              <div v-if="legalProfiles.length > 1" class="form-text text-info">
                <i class="bi bi-info-circle me-1"></i>
                Este interno tiene {{ legalProfiles.length }} perfiles legales activos. Seleccione cuál desea liberar.
              </div>
              <div v-if="!loadingProfiles && legalProfiles.length === 0" class="form-text text-danger">
                <i class="bi bi-exclamation-circle me-1"></i>
                No se encontraron perfiles legales activos para este interno.
              </div>
            </div>

            <!-- Tipo de Liberación -->
            <div class="mb-6">
              <label class="form-label required">Motivo de Liberación</label>
              <select v-model="form.exit_reason_id" class="form-select" required :disabled="loadingCatalogs">
                <option value="">
                  {{ loadingCatalogs ? 'Cargando motivos...' : 'Seleccionar motivo...' }}
                </option>
                <option
                  v-for="reason in exitReasons"
                  :key="reason.id"
                  :value="reason.id"
                >
                  {{ reason.name }}
                </option>
              </select>
              <div v-if="!loadingCatalogs && exitReasons.length === 0" class="form-text text-danger">
                No se pudieron cargar los motivos de liberación
              </div>
            </div>

            <!-- Fecha de Liberación -->
            <div class="row g-6 mb-6">
              <div class="col-md-6">
                <label class="form-label required">Fecha Programada</label>
                <input
                  v-model="form.scheduled_release_date"
                  type="date"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">
                  <input
                    v-model="form.release_immediately"
                    type="checkbox"
                    class="form-check-input me-2"
                  />
                  Liberar inmediatamente
                </label>
              </div>
            </div>

            <!-- Documentación -->
            <div class="row g-6 mb-6">
              <div class="col-md-6">
                <label class="form-label">Número de Autorización</label>
                <input
                  v-model="form.authorization_document_number"
                  type="text"
                  class="form-control"
                  placeholder="Número de documento"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Fecha de Autorización</label>
                <input
                  v-model="form.authorization_date"
                  type="date"
                  class="form-control"
                />
              </div>
            </div>

            <!-- Tribunal Autorizante -->
            <div class="mb-6">
              <label class="form-label">Tribunal que Autoriza</label>
              <select v-model="form.authorizing_court_id" class="form-select" :disabled="loadingCatalogs">
                <option value="">
                  {{ loadingCatalogs ? 'Cargando tribunales...' : 'Seleccionar tribunal...' }}
                </option>
                <option
                  v-for="court in courts"
                  :key="court.id"
                  :value="court.id"
                >
                  {{ court.name }}
                </option>
              </select>
              <div v-if="!loadingCatalogs && courts.length === 0" class="form-text text-danger">
                No se pudieron cargar los tribunales
              </div>
            </div>

            <!-- Condiciones de Libertad -->
            <div class="mb-6">
              <label class="form-label">Condiciones de Libertad</label>
              <textarea
                v-model="form.release_conditions"
                class="form-control"
                rows="3"
                placeholder="Ingrese las condiciones de libertad (si aplican)"
              ></textarea>
              <div class="form-text">
                Solo aplica para liberación condicional o arresto domiciliario
              </div>
            </div>

            <!-- Fecha de Fin de Supervisión -->
            <div class="mb-6" v-if="form.release_conditions">
              <label class="form-label">Fecha de Fin de Supervisión</label>
              <input
                v-model="form.supervision_end_date"
                type="date"
                class="form-control"
              />
            </div>

            <!-- Observaciones -->
            <div class="mb-6">
              <label class="form-label">Observaciones Finales</label>
              <textarea
                v-model="form.final_observations"
                class="form-control"
                rows="3"
                placeholder="Observaciones adicionales sobre la liberación"
              ></textarea>
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
            class="btn btn-danger"
            @click="submitRelease"
            :disabled="loading"
          >
            <span v-if="loading">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Procesando...
            </span>
            <span v-else>
              <i class="bi bi-box-arrow-right me-2"></i>
              {{ form.release_immediately ? 'Liberar Ahora' : 'Programar Liberación' }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useReleases } from '@/composables/useReleases';
import { useCatalogs } from '@/composables/useCatalogs';
import ApiService from '@/core/services/ApiService';

interface Props {
  inmateId: number;
  inmateData?: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['released']);

const { createRelease, loading } = useReleases();
const { getCatalog } = useCatalogs();

const form = ref({
  inmate_id: props.inmateId,
  legal_profile_id: '',
  exit_reason_id: '',
  scheduled_release_date: new Date().toISOString().split('T')[0],
  release_immediately: false,
  authorization_document_number: '',
  authorization_date: new Date().toISOString().split('T')[0],
  authorizing_court_id: '',
  release_conditions: '',
  supervision_end_date: '',
  final_observations: ''
});

const exitReasons = ref([]);
const courts = ref([]);
const legalProfiles = ref([]);
const loadingCatalogs = ref(false);
const loadingProfiles = ref(false);

const loadCatalogs = async () => {
  loadingCatalogs.value = true;
  try {
    const { fetchCatalog } = useCatalogs();

    // Force reload to bypass cache
    const [exitReasonsData, courtsData] = await Promise.all([
      fetchCatalog('exit-reasons', true),
      fetchCatalog('courts', true)
    ]);

    exitReasons.value = exitReasonsData || [];
    courts.value = courtsData || [];
  } catch (error) {
    console.error('Error loading catalogs:', error);
  } finally {
    loadingCatalogs.value = false;
  }
};

const loadLegalProfiles = async () => {
  loadingProfiles.value = true;
  try {
    const response = await ApiService.get(`/legal/profiles/inmate/${props.inmateId}/active-profiles`);

    if (response.data.success && response.data.data) {
      legalProfiles.value = response.data.data;

      // Si solo hay un perfil legal activo, seleccionarlo automáticamente
      if (legalProfiles.value.length === 1) {
        form.value.legal_profile_id = legalProfiles.value[0].id;
      }
    }
  } catch (error) {
    console.error('Error loading legal profiles:', error);
  } finally {
    loadingProfiles.value = false;
  }
};

const submitRelease = async () => {
  const result = await createRelease(form.value);

  if (result) {
    // Cerrar modal
    const modalElement = document.getElementById('releaseModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal?.hide();

    // Emitir evento
    emit('released', result);

    // Resetear formulario
    resetForm();
  }
};

const resetForm = () => {
  form.value = {
    inmate_id: props.inmateId,
    legal_profile_id: '',
    exit_reason_id: '',
    scheduled_release_date: new Date().toISOString().split('T')[0],
    release_immediately: false,
    authorization_document_number: '',
    authorization_date: new Date().toISOString().split('T')[0],
    authorizing_court_id: '',
    release_conditions: '',
    supervision_end_date: '',
    final_observations: ''
  };
};

onMounted(() => {
  loadCatalogs();
  loadLegalProfiles();

  // Recargar catálogos y perfiles cada vez que se abre el modal
  const modalElement = document.getElementById('releaseModal');
  if (modalElement) {
    modalElement.addEventListener('shown.bs.modal', () => {
      loadCatalogs();
      loadLegalProfiles();
    });
  }
});
</script>

<style scoped>
.required::after {
  content: " *";
  color: red;
}
</style>
