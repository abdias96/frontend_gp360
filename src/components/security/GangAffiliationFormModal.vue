<template>
  <div id="gangAffiliationFormModal" class="modal fade" tabindex="-1" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">{{ isEditing ? 'Editar Afiliación' : 'Nueva Afiliación a Pandilla' }}</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" @click="close">
            <i class="ki-duotone ki-cross fs-1"><span class="path1"></span><span class="path2"></span></i>
          </div>
        </div>

        <div class="modal-body py-10 px-lg-17">
          <form @submit.prevent="submitForm">
            <!-- Section 1: Interno -->
            <div v-if="!isEditing" class="row mb-7">
              <div class="col-12">
                <InmateSearchInput
                  v-model="selectedInmate"
                  label="Interno"
                  :required="true"
                  :error="errors.inmate_id"
                />
              </div>
            </div>

            <!-- Section 2: Pandilla -->
            <div class="mb-4">
              <h4 class="fs-6 fw-bold text-gray-800">Información de Pandilla</h4>
            </div>
            <div class="row mb-7">
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Tipo de Pandilla</label>
                <select v-model="form.gang_type" class="form-select" :class="{ 'is-invalid': errors.gang_type }">
                  <option value="">Seleccionar...</option>
                  <option value="ms13">Mara Salvatrucha (MS-13)</option>
                  <option value="barrio18_surenos">Barrio 18 Sureños</option>
                  <option value="barrio18_revolucionarios">Barrio 18 Revolucionarios</option>
                  <option value="other_gang">Otra Pandilla</option>
                  <option value="organized_crime">Crimen Organizado</option>
                  <option value="drug_cartel">Cartel de Drogas</option>
                  <option value="none">Ninguna</option>
                </select>
                <div v-if="errors.gang_type" class="invalid-feedback">{{ errors.gang_type }}</div>
              </div>
              <div class="col-md-4">
                <label class="fs-6 fw-semibold mb-2">Nombre de Pandilla</label>
                <input v-model="form.gang_name" type="text" class="form-control" placeholder="Nombre específico..." />
              </div>
              <div class="col-md-4">
                <label class="fs-6 fw-semibold mb-2">Clica/Célula</label>
                <input v-model="form.clique_name" type="text" class="form-control" placeholder="Nombre de la clica..." />
              </div>
            </div>

            <div class="row mb-7">
              <div class="col-md-4">
                <label class="fs-6 fw-semibold mb-2">Territorio</label>
                <input v-model="form.territory" type="text" class="form-control" placeholder="Territorio de operación..." />
              </div>
              <div class="col-md-4">
                <label class="fs-6 fw-semibold mb-2">Rango/Posición</label>
                <input v-model="form.rank_position" type="text" class="form-control" placeholder="Ej: Líder de clica, soldado..." />
              </div>
              <div class="col-md-4">
                <label class="fs-6 fw-semibold mb-2">Nivel de Afiliación</label>
                <select v-model="form.affiliation_level" class="form-select">
                  <option value="">Seleccionar...</option>
                  <option value="suspected">Sospechoso</option>
                  <option value="confirmed_member">Miembro Confirmado</option>
                  <option value="leader">Líder</option>
                  <option value="high_ranking">Alto Rango</option>
                  <option value="founder">Fundador</option>
                  <option value="inactive">Inactivo</option>
                  <option value="former_member">Ex-miembro</option>
                </select>
              </div>
            </div>

            <!-- Section 3: Fechas -->
            <div class="mb-4">
              <h4 class="fs-6 fw-bold text-gray-800">Fechas</h4>
            </div>
            <div class="row mb-7">
              <div class="col-md-4">
                <label class="fs-6 fw-semibold mb-2">Fecha de Ingreso</label>
                <input v-model="form.join_date" type="date" class="form-control" />
              </div>
              <div class="col-md-4">
                <label class="fs-6 fw-semibold mb-2">Fecha de Confirmación</label>
                <input v-model="form.confirmation_date" type="date" class="form-control" />
              </div>
              <div class="col-md-4 d-flex align-items-end">
                <div class="form-check form-switch">
                  <input v-model="form.is_current" class="form-check-input" type="checkbox" id="isCurrentCheck" />
                  <label class="form-check-label" for="isCurrentCheck">Afiliación Vigente</label>
                </div>
              </div>
            </div>

            <!-- Section 4: Actividad Criminal -->
            <div class="mb-4">
              <h4 class="fs-6 fw-bold text-gray-800">Actividad Criminal</h4>
            </div>
            <div class="row mb-7">
              <div class="col-12">
                <label class="fs-6 fw-semibold mb-2">Actividades Criminales</label>
                <textarea v-model="form.criminal_activities" class="form-control" rows="2"
                  placeholder="Actividades criminales conocidas..."></textarea>
              </div>
            </div>
            <div class="row mb-7">
              <div class="col-md-4">
                <div class="form-check form-switch">
                  <input v-model="form.active_in_extortion" class="form-check-input" type="checkbox" id="extortionCheck" />
                  <label class="form-check-label" for="extortionCheck">Activo en Extorsión</label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-check form-switch">
                  <input v-model="form.orders_from_prison" class="form-check-input" type="checkbox" id="ordersCheck" />
                  <label class="form-check-label" for="ordersCheck">Ordena desde Prisión</label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-check form-switch">
                  <input v-model="form.receives_orders" class="form-check-input" type="checkbox" id="receivesCheck" />
                  <label class="form-check-label" for="receivesCheck">Recibe Órdenes</label>
                </div>
              </div>
            </div>
            <div class="row mb-7">
              <div class="col-12">
                <label class="fs-6 fw-semibold mb-2">Métodos de Comunicación</label>
                <textarea v-model="form.communication_methods" class="form-control" rows="2"
                  placeholder="Métodos usados para comunicarse..."></textarea>
              </div>
            </div>

            <!-- Section 5: Inteligencia -->
            <div class="mb-4">
              <h4 class="fs-6 fw-bold text-gray-800">Inteligencia</h4>
            </div>
            <div class="row mb-7">
              <div class="col-12">
                <label class="fs-6 fw-semibold mb-2">Notas de Inteligencia</label>
                <textarea v-model="form.intelligence_notes" class="form-control" rows="3"
                  placeholder="Información de inteligencia relevante..."></textarea>
              </div>
            </div>
            <div class="row mb-7">
              <div class="col-md-4">
                <label class="fs-6 fw-semibold mb-2">Nivel de Inteligencia</label>
                <select v-model="form.intelligence_level" class="form-select">
                  <option value="low">Bajo</option>
                  <option value="medium">Medio</option>
                  <option value="high">Alto</option>
                  <option value="critical">Crítico</option>
                </select>
              </div>
            </div>
            <div class="row mb-7">
              <div class="col-12">
                <label class="fs-6 fw-semibold mb-2">Evaluación de Amenaza</label>
                <textarea v-model="form.threat_assessment" class="form-control" rows="2"
                  placeholder="Evaluación general de la amenaza que representa..."></textarea>
              </div>
            </div>
            <div class="row mb-7">
              <div class="col-md-6">
                <label class="fs-6 fw-semibold mb-2">Asociados Conocidos</label>
                <textarea v-model="form.known_associates" class="form-control" rows="2"
                  placeholder="Nombres o identificadores de asociados..."></textarea>
              </div>
              <div class="col-md-6">
                <label class="fs-6 fw-semibold mb-2">Pandillas Rivales</label>
                <textarea v-model="form.rival_gangs" class="form-control" rows="2"
                  placeholder="Pandillas rivales conocidas..."></textarea>
              </div>
            </div>

            <!-- Section 6: Separación -->
            <div class="mb-4">
              <h4 class="fs-6 fw-bold text-gray-800">Separación</h4>
            </div>
            <div class="row mb-7">
              <div class="col-md-6">
                <label class="fs-6 fw-semibold mb-2">Debe Separarse De</label>
                <textarea v-model="form.must_separate_from" class="form-control" rows="2"
                  placeholder="Nombres o grupos de los que debe separarse..."></textarea>
              </div>
              <div class="col-md-6">
                <label class="fs-6 fw-semibold mb-2">Razones de Separación</label>
                <textarea v-model="form.separation_reasons" class="form-control" rows="2"
                  placeholder="Razones para la separación..."></textarea>
              </div>
            </div>

            <div class="text-center pt-5">
              <button type="button" class="btn btn-light me-3" @click="close">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                {{ isEditing ? 'Actualizar' : 'Registrar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import InmateSearchInput from '@/components/shared/InmateSearchInput.vue';

const props = defineProps<{ affiliation?: any; isEditing: boolean }>();
const emit = defineEmits(['saved']);

const modalRef = ref<HTMLElement | null>(null);
let modalInstance: Modal | null = null;
const saving = ref(false);
const selectedInmate = ref<any>(null);
const errors = ref<Record<string, string>>({});

const defaultForm = () => ({
  gang_type: '',
  gang_name: '',
  clique_name: '',
  territory: '',
  rank_position: '',
  affiliation_level: '',
  join_date: '',
  confirmation_date: '',
  criminal_activities: '',
  active_in_extortion: false,
  orders_from_prison: false,
  receives_orders: false,
  communication_methods: '',
  intelligence_notes: '',
  known_associates: '',
  rival_gangs: '',
  threat_assessment: '',
  intelligence_level: 'medium',
  must_separate_from: '',
  separation_reasons: '',
  is_current: true,
});

const form = ref(defaultForm());

watch(() => props.affiliation, (val) => {
  if (val && props.isEditing) {
    form.value = {
      gang_type: val.gang_type || '',
      gang_name: val.gang_name || '',
      clique_name: val.clique_name || '',
      territory: val.territory || '',
      rank_position: val.rank_position || '',
      affiliation_level: val.affiliation_level || '',
      join_date: val.join_date ? val.join_date.substring(0, 10) : '',
      confirmation_date: val.confirmation_date ? val.confirmation_date.substring(0, 10) : '',
      criminal_activities: val.criminal_activities || '',
      active_in_extortion: val.active_in_extortion || false,
      orders_from_prison: val.orders_from_prison || false,
      receives_orders: val.receives_orders || false,
      communication_methods: val.communication_methods || '',
      intelligence_notes: val.intelligence_notes || '',
      known_associates: val.known_associates || '',
      rival_gangs: val.rival_gangs || '',
      threat_assessment: val.threat_assessment || '',
      intelligence_level: val.intelligence_level || 'medium',
      must_separate_from: val.must_separate_from || '',
      separation_reasons: val.separation_reasons || '',
      is_current: val.is_current ?? true,
    };
    selectedInmate.value = val.inmate || null;
  } else {
    form.value = defaultForm();
    selectedInmate.value = null;
  }
}, { immediate: true });

const validate = () => {
  errors.value = {};
  if (!props.isEditing && !selectedInmate.value) errors.value.inmate_id = 'El interno es requerido';
  if (!form.value.gang_type) errors.value.gang_type = 'El tipo de pandilla es requerido';
  return Object.keys(errors.value).length === 0;
};

const submitForm = async () => {
  if (!validate()) return;
  saving.value = true;
  try {
    const payload: any = { ...form.value };
    if (!props.isEditing) {
      payload.inmate_id = selectedInmate.value.id;
    }

    // Clean empty optional fields
    const optionalFields = ['gang_name', 'clique_name', 'territory', 'rank_position', 'affiliation_level',
      'join_date', 'confirmation_date', 'criminal_activities', 'communication_methods', 'intelligence_notes',
      'known_associates', 'rival_gangs', 'threat_assessment', 'must_separate_from', 'separation_reasons'];
    for (const f of optionalFields) {
      if (!payload[f]) delete payload[f];
    }

    if (props.isEditing && props.affiliation?.id) {
      await ApiService.put(`/inmate-gang-affiliations/${props.affiliation.id}`, payload);
    } else {
      await ApiService.post('/inmate-gang-affiliations', payload);
    }
    emit('saved');
    close();
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Error al guardar' });
  } finally { saving.value = false; }
};

const open = () => {
  if (modalRef.value && !modalInstance) modalInstance = new Modal(modalRef.value);
  modalInstance?.show();
};
const close = () => { modalInstance?.hide(); errors.value = {}; };

defineExpose({ open, close });
</script>
