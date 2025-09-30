<template>
  <div class="d-flex flex-column gap-5">
    <!--begin::Toolbar-->
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <h3 class="fw-bold text-gray-900">Delitos Registrados</h3>
        <p class="text-muted fs-7">Gestión de delitos asociados al expediente</p>
      </div>
      <button 
        v-if="canEdit"
        @click="openAddCrimeModal"
        class="btn btn-primary"
      >
        <i class="ki-duotone ki-plus fs-2"></i>
        Agregar Delito
      </button>
    </div>
    <!--end::Toolbar-->

    <!--begin::Crimes List-->
    <div v-if="loading" class="d-flex justify-content-center py-10">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="crimes.length === 0" class="card">
      <div class="card-body text-center py-10">
        <i class="ki-duotone ki-shield-cross fs-5x text-muted mb-5">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
        <h4 class="text-muted">No hay delitos registrados</h4>
        <p class="text-muted fs-7">Agregue el primer delito para comenzar el expediente legal</p>
      </div>
    </div>

    <div v-else class="row g-5">
      <div v-for="crime in crimes" :key="crime.id" class="col-md-6">
        <div class="card">
          <div class="card-header">
            <div class="card-title flex-column">
              <h4 class="fw-bold">{{ crime.crime?.name || 'Sin nombre' }}</h4>
              <span class="text-muted fs-7">{{ crime.crime?.article || 'Sin artículo' }}</span>
            </div>
            <div class="card-toolbar">
              <div class="dropdown">
                <button
                  class="btn btn-sm btn-icon btn-light-primary"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <i class="ki-duotone ki-dots-vertical fs-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                  </i>
                </button>
                <ul class="dropdown-menu">
                  <li>
                    <a class="dropdown-item" href="#" @click="editCrime(crime)">
                      <i class="ki-duotone ki-pencil fs-4 me-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      Editar
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item text-danger" href="#" @click="confirmDeleteCrime(crime)">
                      <i class="ki-duotone ki-trash fs-4 me-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                        <span class="path4"></span>
                        <span class="path5"></span>
                      </i>
                      Eliminar
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="d-flex flex-column gap-3">
              <div class="d-flex justify-content-between">
                <span class="text-muted">Clasificación:</span>
                <span class="fw-semibold">{{ crime.crime_classification?.name || 'N/A' }}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted">Rol:</span>
                <span class="fw-semibold">{{ getCrimeRoleLabel(crime.crime_role) }}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted">Fecha del delito:</span>
                <span class="fw-semibold">{{ crime.crime_date ? formatDate(crime.crime_date) : 'N/A' }}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted">Admite culpabilidad:</span>
                <span :class="crime.admits_guilt ? 'text-danger' : 'text-success'" class="fw-semibold">
                  {{ crime.admits_guilt ? 'Sí' : 'No' }}
                </span>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted">Pena máxima:</span>
                <span class="fw-semibold">
                  {{ crime.crime?.max_penalty_years ? `${crime.crime.max_penalty_years} años` : 'N/A' }}
                </span>
              </div>
            </div>

            <div v-if="crime.crime_description" class="mt-4">
              <p class="text-muted fs-7 mb-1">Descripción:</p>
              <p class="fs-7">{{ crime.crime_description }}</p>
            </div>

            <div v-if="crime.crime_location" class="mt-3">
              <p class="text-muted fs-7 mb-1">Lugar:</p>
              <p class="fs-7">{{ crime.crime_location }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--end::Crimes List-->

    <!--begin::Add/Edit Crime Modal-->
    <div class="modal fade" id="crimeModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingCrime ? 'Editar' : 'Agregar' }} Delito</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCrime">
              <div class="row g-5">
                <div class="col-md-6">
                  <label class="form-label required">Delito</label>
                  <select v-model="crimeForm.crime_id" class="form-select" required>
                    <option value="">Seleccione un delito</option>
                    <option v-for="crime in catalogCrimes" :key="crime.id" :value="crime.id">
                      {{ crime.name }} - {{ crime.article }}
                    </option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label required">Clasificación</label>
                  <select v-model="crimeForm.crime_classification_id" class="form-select" required>
                    <option value="">Seleccione clasificación</option>
                    <option v-for="classification in crimeClassifications" :key="classification.id" :value="classification.id">
                      {{ classification.name }}
                    </option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label required">Rol en el delito</label>
                  <select v-model="crimeForm.crime_role" class="form-select" required>
                    <option value="">Seleccione rol</option>
                    <option value="primary">Principal</option>
                    <option value="secondary">Secundario</option>
                    <option value="accessory">Accesorio</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Fecha del delito</label>
                  <input 
                    v-model="crimeForm.crime_date" 
                    type="date" 
                    class="form-control"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Monto del daño (Q)</label>
                  <input 
                    v-model="crimeForm.damage_amount" 
                    type="number" 
                    class="form-control" 
                    min="0" 
                    step="0.01"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Admite culpabilidad</label>
                  <div class="form-check form-switch">
                    <input 
                      v-model="crimeForm.admits_guilt" 
                      class="form-check-input" 
                      type="checkbox" 
                      id="admitsGuilt"
                    />
                    <label class="form-check-label" for="admitsGuilt">
                      {{ crimeForm.admits_guilt ? 'Sí admite' : 'No admite' }}
                    </label>
                  </div>
                </div>

                <div class="col-12">
                  <label class="form-label">Descripción del delito</label>
                  <textarea 
                    v-model="crimeForm.crime_description" 
                    class="form-control" 
                    rows="3"
                  ></textarea>
                </div>

                <div class="col-12">
                  <label class="form-label">Lugar del delito</label>
                  <input 
                    v-model="crimeForm.crime_location" 
                    type="text" 
                    class="form-control"
                  />
                </div>

                <div class="col-12">
                  <label class="form-label">Descripción de evidencia</label>
                  <textarea 
                    v-model="crimeForm.evidence_description" 
                    class="form-control" 
                    rows="2"
                  ></textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="saveCrime">
              <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
              {{ editingCrime ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--end::Add/Edit Crime Modal-->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import { formatDate } from '@/core/helpers/formatters';
import { Modal } from 'bootstrap';

// Props
interface Props {
  inmateId: number;
}
const props = defineProps<Props>();

// Stores
const authStore = useAuthStore();

// State
const crimes = ref<any[]>([]);
const catalogCrimes = ref<any[]>([]);
const crimeClassifications = ref<any[]>([]);
const loading = ref(false);
const saving = ref(false);
const editingCrime = ref<any>(null);
const crimeModal = ref<Modal | null>(null);

// Crime form
const crimeForm = ref({
  crime_id: '',
  crime_classification_id: '',
  crime_role: '',
  crime_description: '',
  crime_date: '',
  crime_location: '',
  damage_amount: null,
  evidence_description: '',
  admits_guilt: false
});

// Computed
const canEdit = computed(() => authStore.hasPermission('legal.manage'));

// Methods
const getCrimeRoleLabel = (role: string) => {
  const roles: Record<string, string> = {
    'primary': 'Principal',
    'secondary': 'Secundario',
    'accessory': 'Accesorio'
  };
  return roles[role] || role;
};

const fetchCrimes = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get(`/inmates/${props.inmateId}/legal`);
    crimes.value = response.data.data.crimes || [];
  } catch (error) {
    console.error('Error fetching crimes:', error);
    await Swal.fire({
      title: 'Error',
      text: 'No se pudieron cargar los delitos',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const fetchCatalogs = async () => {
  try {
    const [crimesResponse, classificationsResponse] = await Promise.all([
      ApiService.get('/catalogs/crimes'),
      ApiService.get('/catalogs/crime-classifications')
    ]);
    
    catalogCrimes.value = crimesResponse.data.data;
    crimeClassifications.value = classificationsResponse.data.data;
  } catch (error) {
    console.error('Error fetching catalogs:', error);
  }
};

const openAddCrimeModal = () => {
  editingCrime.value = null;
  resetForm();
  crimeModal.value?.show();
};

const editCrime = (crime: any) => {
  editingCrime.value = crime;
  crimeForm.value = {
    crime_id: crime.crime_id,
    crime_classification_id: crime.crime_classification_id,
    crime_role: crime.crime_role,
    crime_description: crime.crime_description || '',
    crime_date: crime.crime_date || '',
    crime_location: crime.crime_location || '',
    damage_amount: crime.damage_amount,
    evidence_description: crime.evidence_description || '',
    admits_guilt: crime.admits_guilt || false
  };
  crimeModal.value?.show();
};

const saveCrime = async () => {
  if (!crimeForm.value.crime_id || !crimeForm.value.crime_classification_id || !crimeForm.value.crime_role) {
    await Swal.fire({
      title: 'Error',
      text: 'Por favor complete los campos requeridos',
      icon: 'warning'
    });
    return;
  }

  saving.value = true;
  try {
    if (editingCrime.value) {
      // Update existing crime
      await ApiService.put(`/inmate-crimes/${editingCrime.value.id}`, crimeForm.value);
      await Swal.fire({
        title: 'Éxito',
        text: 'Delito actualizado correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      // Create new crime
      await ApiService.post(`/inmates/${props.inmateId}/crimes`, crimeForm.value);
      await Swal.fire({
        title: 'Éxito',
        text: 'Delito agregado correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
    
    crimeModal.value?.hide();
    await fetchCrimes();
    resetForm();
  } catch (error: any) {
    console.error('Error saving crime:', error);
    await Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'No se pudo guardar el delito',
      icon: 'error'
    });
  } finally {
    saving.value = false;
  }
};

const confirmDeleteCrime = async (crime: any) => {
  const result = await Swal.fire({
    title: '¿Está seguro?',
    text: `¿Desea eliminar el delito "${crime.crime?.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      await ApiService.delete(`/inmate-crimes/${crime.id}`);
      await Swal.fire({
        title: 'Eliminado',
        text: 'El delito ha sido eliminado',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      await fetchCrimes();
    } catch (error) {
      console.error('Error deleting crime:', error);
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el delito',
        icon: 'error'
      });
    }
  }
};

const resetForm = () => {
  crimeForm.value = {
    crime_id: '',
    crime_classification_id: '',
    crime_role: '',
    crime_description: '',
    crime_date: '',
    crime_location: '',
    damage_amount: null,
    evidence_description: '',
    admits_guilt: false
  };
};

// Lifecycle
onMounted(() => {
  const modalElement = document.getElementById('crimeModal');
  if (modalElement) {
    crimeModal.value = new Modal(modalElement);
  }
  
  fetchCrimes();
  fetchCatalogs();
});
</script>