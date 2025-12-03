<template>
  <div class="hearings-page">
    <!-- Page header -->
    <div class="row g-5 g-xl-10 mb-5">
      <div class="col-12">
        <div class="card">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">Audiencias Judiciales</span>
              <span class="text-muted mt-1 fw-semibold fs-7">Gestión de audiencias y comparecencias</span>
            </h3>
            <div class="card-toolbar">
              <!-- Filter by date range -->
              <div class="d-flex align-items-center me-3">
                <input
                  type="date"
                  v-model="dateFrom"
                  @change="handleFilter"
                  class="form-control form-control-solid me-2"
                />
                <span class="text-gray-500 me-2">a</span>
                <input
                  type="date"
                  v-model="dateTo"
                  @change="handleFilter"
                  class="form-control form-control-solid"
                />
              </div>

              <!-- Filter by status -->
              <div class="me-3">
                <select
                  v-model="selectedStatus"
                  @change="handleFilter"
                  class="form-select form-select-solid"
                >
                  <option value="">Todos los estados</option>
                  <option value="attended">Asistió</option>
                  <option value="not_attended">No Asistió</option>
                  <option value="virtual">Virtual</option>
                  <option value="postponed">Aplazada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
              
              <!-- Actions -->
              <button
                v-if="canCreate"
                type="button"
                class="btn btn-primary"
                @click="showCreateModal"
              >
                <KTIcon icon-name="plus" icon-class="fs-2" />
                Nueva Audiencia
              </button>
            </div>
          </div>
          
          <div class="card-body py-3">
            <!-- Calendar view toggle -->
            <div class="d-flex justify-content-end mb-3">
              <div class="btn-group" role="group">
                <button
                  type="button"
                  class="btn"
                  :class="viewMode === 'list' ? 'btn-primary' : 'btn-light'"
                  @click="viewMode = 'list'"
                >
                  <KTIcon icon-name="row-horizontal" icon-class="fs-3" />
                  Lista
                </button>
                <button
                  type="button"
                  class="btn"
                  :class="viewMode === 'calendar' ? 'btn-primary' : 'btn-light'"
                  @click="viewMode = 'calendar'"
                >
                  <KTIcon icon-name="calendar" icon-class="fs-3" />
                  Calendario
                </button>
              </div>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="d-flex justify-content-center py-10">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
            </div>

            <!-- List view -->
            <div v-else-if="viewMode === 'list' && hearings.length > 0" class="table-responsive">
              <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th class="min-w-150px">PPL</th>
                    <th class="min-w-100px">Fecha/Hora</th>
                    <th class="min-w-100px">Tipo</th>
                    <th class="min-w-150px">Juzgado</th>
                    <th class="min-w-100px">Juez</th>
                    <th class="min-w-100px">Estado</th>
                    <th class="min-w-100px">Transporte</th>
                    <th class="min-w-100px text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="hearing in hearings" :key="hearing.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="d-flex justify-content-start flex-column">
                          <a
                            href="#"
                            class="text-gray-900 fw-bold text-hover-primary fs-6"
                            @click.prevent="viewInmateDetail(hearing.inmate_id)"
                          >
                            {{ hearing.inmate?.full_name }}
                          </a>
                          <span class="text-muted fw-semibold text-muted d-block fs-7">
                            {{ hearing.legal_profile?.case_number }}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex flex-column">
                        <span class="text-gray-900 fw-bold fs-6">
                          {{ formatDate(hearing.hearing_date) }}
                        </span>
                        <span class="text-muted fs-7">
                          {{ hearing.hearing_time || 'Por definir' }}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span class="badge badge-light-info">
                        {{ getHearingTypeName(hearing.hearing_type) }}
                      </span>
                    </td>
                    <td>
                      <span class="text-gray-900 fs-6">
                        {{ hearing.court?.name }}
                      </span>
                    </td>
                    <td>
                      <span class="text-gray-900 fs-6">
                        {{ hearing.judge_name || '-' }}
                      </span>
                    </td>
                    <td>
                      <span
                        class="badge"
                        :class="getStatusBadgeClass(hearing.attendance_status)"
                      >
                        {{ getStatusName(hearing.attendance_status) }}
                      </span>
                    </td>
                    <td>
                      <span
                        v-if="hearing.transportation_required"
                        class="badge badge-light-warning"
                      >
                        Requerido
                      </span>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <div class="d-flex justify-content-end flex-shrink-0">
                        <a
                          v-if="canView"
                          href="#"
                          class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                          @click.prevent="viewHearing(hearing)"
                          title="Ver audiencia"
                        >
                          <KTIcon icon-name="eye" icon-class="fs-3" />
                        </a>
                        <a
                          v-if="canEdit"
                          href="#"
                          class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                          @click.prevent="editHearing(hearing)"
                          title="Editar audiencia"
                        >
                          <KTIcon icon-name="pencil" icon-class="fs-3" />
                        </a>
                        <a
                          v-if="canEdit && (!hearing.attendance_status || hearing.attendance_status === 'postponed')"
                          href="#"
                          class="btn btn-icon btn-bg-light btn-active-color-success btn-sm"
                          @click.prevent="markAsHeld(hearing)"
                          title="Marcar como realizada"
                        >
                          <KTIcon icon-name="check" icon-class="fs-3" />
                        </a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Calendar view -->
            <div v-else-if="viewMode === 'calendar'" class="calendar-container">
              <div ref="calendarEl" id="hearings-calendar"></div>
            </div>

            <!-- Empty state -->
            <div v-else-if="!loading && hearings.length === 0" class="text-center py-10">
              <img
                :src="getAssetPath('media/illustrations/sketchy-1/5.png')"
                class="mw-200px mb-5"
                alt=""
              />
              <div class="fw-semibold fs-6 text-gray-500">
                No hay audiencias programadas
              </div>
            </div>

            <!-- Pagination -->
            <div
              v-if="!loading && hearings.length > 0 && viewMode === 'list'"
              class="d-flex justify-content-between align-items-center flex-wrap"
            >
              <div class="d-flex align-items-center">
                <span class="text-muted">
                  Mostrando {{ (currentPage - 1) * perPage + 1 }} -
                  {{ Math.min(currentPage * perPage, total) }} de {{ total }}
                </span>
              </div>
              <ul class="pagination">
                <li class="page-item previous" :class="{ disabled: currentPage === 1 }">
                  <a href="#" class="page-link" @click.prevent="changePage(currentPage - 1)">
                    <i class="previous"></i>
                  </a>
                </li>
                <li
                  v-for="page in displayedPages"
                  :key="page"
                  class="page-item"
                  :class="{ active: page === currentPage }"
                >
                  <a href="#" class="page-link" @click.prevent="changePage(page)">
                    {{ page }}
                  </a>
                </li>
                <li class="page-item next" :class="{ disabled: currentPage === totalPages }">
                  <a href="#" class="page-link" @click.prevent="changePage(currentPage + 1)">
                    <i class="next"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div class="modal fade" ref="hearingModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingHearing ? 'Editar Audiencia' : 'Nueva Audiencia' }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveHearing">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label required">PPL</label>
                  <select
                    v-model="hearingForm.inmate_id"
                    class="form-select"
                    required
                  >
                    <option value="">Seleccionar PPL</option>
                    <option
                      v-for="inmate in inmatesOptions"
                      :key="inmate.value"
                      :value="inmate.value"
                    >
                      {{ inmate.label }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label required">Fecha</label>
                  <input
                    type="date"
                    v-model="hearingForm.hearing_date"
                    class="form-control"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Hora</label>
                  <input
                    type="time"
                    v-model="hearingForm.hearing_time"
                    class="form-control"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label required">Tipo de Audiencia</label>
                  <select
                    v-model="hearingForm.hearing_type"
                    class="form-select"
                    required
                  >
                    <option value="first_declaration">Primera Declaración</option>
                    <option value="preliminary_hearing">Audiencia Preliminar</option>
                    <option value="intermediate_hearing">Audiencia Intermedia</option>
                    <option value="oral_trial">Juicio Oral</option>
                    <option value="sentencing">Sentencia</option>
                    <option value="appeal_hearing">Audiencia de Apelación</option>
                    <option value="review_hearing">Audiencia de Revisión</option>
                    <option value="benefit_request">Solicitud de Beneficios</option>
                    <option value="transfer_request">Solicitud de Traslado</option>
                    <option value="medical_evaluation">Evaluación Médica Judicial</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label required">Juzgado</label>
                  <select
                    v-model="hearingForm.court_id"
                    class="form-select"
                    required
                  >
                    <option value="">Seleccionar Juzgado</option>
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
                  <label class="form-label">Juez</label>
                  <input
                    type="text"
                    v-model="hearingForm.judge_name"
                    class="form-control"
                    placeholder="Nombre del juez"
                  />
                </div>
                <div class="col-12">
                  <label class="form-label required">Propósito</label>
                  <textarea
                    v-model="hearingForm.hearing_purpose"
                    class="form-control"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div class="col-md-6">
                  <div class="form-check">
                    <input
                      type="checkbox"
                      v-model="hearingForm.transportation_required"
                      class="form-check-input"
                      id="transportCheck"
                    />
                    <label class="form-check-label" for="transportCheck">
                      Requiere transporte
                    </label>
                  </div>
                </div>
                <div class="col-md-6" v-if="hearingForm.transportation_required">
                  <label class="form-label">Nivel de Seguridad</label>
                  <select
                    v-model="hearingForm.security_level"
                    class="form-select"
                  >
                    <option value="minimum">Mínima</option>
                    <option value="medium">Media</option>
                    <option value="maximum">Máxima</option>
                  </select>
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
              @click="saveHearing"
              :disabled="savingHearing"
            >
              <span v-if="savingHearing" class="spinner-border spinner-border-sm me-2"></span>
              {{ editingHearing ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getAssetPath } from '@/core/helpers/assets';
import { useCatalogs } from '@/composables/useCatalogs';
import { useAuthStore } from '@/stores/auth';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import type { Hearing } from '../types/legal';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { formatDateForInput } from '@/core/helpers/date-formatters';

// Composables
const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const { courtsOptions, loadLegalCatalogs } = useCatalogs();

// Permission checks
const canCreate = computed(() => authStore.isSuperAdmin || authStore.hasPermission('legal.hearings.create'));
const canEdit = computed(() => authStore.isSuperAdmin || authStore.hasPermission('legal.hearings.edit'));
const canView = computed(() => authStore.isSuperAdmin || authStore.hasPermission('legal.hearings'));

// State
const loading = ref(false);
const hearings = ref<Hearing[]>([]);
const viewMode = ref<'list' | 'calendar'>('list');
const dateFrom = ref('');
const dateTo = ref('');
const selectedStatus = ref('');
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);
const totalPages = ref(0);

// Modal state
const hearingModal = ref<HTMLElement>();
const modalInstance = ref<Modal>();
const editingHearing = ref<Hearing | null>(null);
const savingHearing = ref(false);
const inmatesOptions = ref<any[]>([]);

// Calendar state
const calendarEl = ref<HTMLElement>();
const calendarInstance = ref<Calendar | null>(null);

// Form state
const hearingForm = ref({
  inmate_id: '',
  legal_profile_id: '',
  hearing_date: '',
  hearing_time: '',
  hearing_type: 'first_declaration',
  court_id: '',
  judge_name: '',
  prosecutor_name: '',
  defense_attorney: '',
  hearing_purpose: '',
  transportation_required: false,
  security_level: 'medium',
  notes: ''
});

// Computed
const displayedPages = computed(() => {
  const pages: number[] = [];
  const maxPages = 5;
  let start = Math.max(1, currentPage.value - 2);
  let end = Math.min(totalPages.value, start + maxPages - 1);
  
  if (end - start < maxPages - 1) {
    start = Math.max(1, end - maxPages + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Methods
const loadHearings = async () => {
  loading.value = true;
  try {
    const response = await ApiService.query('/legal/hearings', {
      page: currentPage.value,
      per_page: perPage.value,
      date_from: dateFrom.value,
      date_to: dateTo.value,
      status: selectedStatus.value,
    });
    
    // Handle paginated response structure
    if (response.data.data && response.data.data.data) {
      hearings.value = response.data.data.data;
      total.value = response.data.data.total;
      totalPages.value = response.data.data.last_page;
    } else {
      hearings.value = [];
      total.value = 0;
      totalPages.value = 0;
    }
  } catch (error) {
    console.error('Error loading hearings:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar las audiencias',
    });
  } finally {
    loading.value = false;
  }
};

const loadInmates = async () => {
  try {
    // Use the simple-list endpoint for dropdowns
    const response = await ApiService.get('/inmates/simple-list');
    inmatesOptions.value = response.data.data.map((inmate: any) => ({
      value: inmate.id,
      label: inmate.label || `${inmate.full_name} - ${inmate.inmate_number}`
    }));
  } catch (error) {
    console.error('Error loading inmates:', error);
  }
};

const handleFilter = () => {
  currentPage.value = 1;
  loadHearings();
};

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadHearings();
  }
};

const formatDate = (date: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString();
};

const getHearingTypeName = (type: string) => {
  const types: Record<string, string> = {
    first_declaration: 'Primera Declaración',
    preliminary_hearing: 'Audiencia Preliminar',
    intermediate_hearing: 'Audiencia Intermedia',
    oral_trial: 'Juicio Oral',
    sentencing: 'Sentencia',
    appeal_hearing: 'Audiencia de Apelación',
    review_hearing: 'Audiencia de Revisión',
    benefit_request: 'Solicitud de Beneficios',
    transfer_request: 'Solicitud de Traslado',
    medical_evaluation: 'Evaluación Médica Judicial'
  };
  return types[type] || type;
};

const getStatusName = (status: string) => {
  const statuses: Record<string, string> = {
    attended: 'Asistió',
    not_attended: 'No Asistió',
    virtual: 'Virtual',
    postponed: 'Aplazada',
    cancelled: 'Cancelada'
  };
  return statuses[status] || 'Pendiente';
};

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    attended: 'badge-light-success',
    not_attended: 'badge-light-danger',
    virtual: 'badge-light-primary',
    postponed: 'badge-light-info',
    cancelled: 'badge-light-danger'
  };
  return classes[status] || 'badge-light-warning';
};

const viewInmateDetail = (inmateId: number) => {
  router.push({ name: 'inmates-detail', params: { id: inmateId } });
};

const showCreateModal = () => {
  editingHearing.value = null;
  resetForm();
  modalInstance.value?.show();
};

const viewHearing = (hearing: Hearing) => {
  // Show details in a modal instead of navigating
  Swal.fire({
    title: 'Detalles de la Audiencia',
    html: `
      <div class="text-start">
        <p><strong>PPL:</strong> ${hearing.inmate?.full_name || '-'}</p>
        <p><strong>Fecha:</strong> ${formatDate(hearing.hearing_date)}</p>
        <p><strong>Hora:</strong> ${hearing.hearing_time || 'Por definir'}</p>
        <p><strong>Tipo:</strong> ${getHearingTypeName(hearing.hearing_type)}</p>
        <p><strong>Juzgado:</strong> ${hearing.court?.name || '-'}</p>
        <p><strong>Juez:</strong> ${hearing.judge_name || '-'}</p>
        <p><strong>Propósito:</strong> ${hearing.hearing_purpose || '-'}</p>
        <p><strong>Estado:</strong> ${getStatusName(hearing.attendance_status)}</p>
        ${hearing.hearing_outcome ? `<p><strong>Resultado:</strong> ${hearing.hearing_outcome}</p>` : ''}
        ${hearing.next_steps ? `<p><strong>Próximos pasos:</strong> ${hearing.next_steps}</p>` : ''}
      </div>
    `,
    width: '600px',
    confirmButtonText: 'Cerrar'
  });
};

const editHearing = (hearing: Hearing) => {
  editingHearing.value = hearing;
  // Format date and time for form inputs
  const formData = { ...hearing };
  if (hearing.hearing_date) {
    // Extract date part (YYYY-MM-DD) from datetime using helper
    formData.hearing_date = formatDateForInput(hearing.hearing_date);
  }
  if (hearing.hearing_time && hearing.hearing_time.includes(':')) {
    // Ensure time is in HH:MM format
    formData.hearing_time = hearing.hearing_time.substring(0, 5);
  }
  Object.assign(hearingForm.value, formData);
  modalInstance.value?.show();
};

const markAsHeld = async (hearing: Hearing) => {
  const result = await Swal.fire({
    title: '¿Marcar como realizada?',
    text: 'Esta audiencia se marcará como realizada',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, marcar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      await ApiService.patch(`/legal/hearings/${hearing.id}`, {
        attendance_status: 'attended'
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Actualizado',
        text: 'La audiencia ha sido marcada como realizada',
        timer: 2000,
        showConfirmButton: false
      });
      
      loadHearings();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la audiencia'
      });
    }
  }
};

const saveHearing = async () => {
  savingHearing.value = true;
  try {
    // Prepare data with proper datetime format
    const dataToSend = { ...hearingForm.value };
    
    // Combine date and time into datetime format
    if (dataToSend.hearing_date) {
      const time = dataToSend.hearing_time || '00:00';
      dataToSend.hearing_date = `${dataToSend.hearing_date} ${time}:00`;
    }
    
    // Remove hearing_time as it's now included in hearing_date
    delete dataToSend.hearing_time;
    
    if (editingHearing.value) {
      await ApiService.put(`/legal/hearings/${editingHearing.value.id}`, dataToSend);
    } else {
      await ApiService.post('/legal/hearings', dataToSend);
    }
    
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: editingHearing.value ? 'Audiencia actualizada' : 'Audiencia creada',
      timer: 2000,
      showConfirmButton: false
    });
    
    modalInstance.value?.hide();
    loadHearings();
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo guardar la audiencia'
    });
  } finally {
    savingHearing.value = false;
  }
};

const resetForm = () => {
  hearingForm.value = {
    inmate_id: '',
    legal_profile_id: '',
    hearing_date: '',
    hearing_time: '',
    hearing_type: 'first_declaration',
    court_id: '',
    judge_name: '',
    prosecutor_name: '',
    defense_attorney: '',
    hearing_purpose: '',
    transportation_required: false,
    security_level: 'medium',
    notes: ''
  };
};

const initializeCalendar = () => {
  if (!calendarEl.value || calendarInstance.value) return;

  calendarInstance.value = new Calendar(calendarEl.value, {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek'
    },
    events: hearings.value.map(hearing => ({
      id: hearing.id?.toString(),
      title: `${hearing.inmate?.full_name || 'PPL'} - ${getHearingTypeName(hearing.hearing_type)}`,
      start: hearing.hearing_date,
      backgroundColor: getEventColor(hearing.attendance_status),
      borderColor: getEventColor(hearing.attendance_status),
      extendedProps: hearing
    })),
    eventClick: (info) => {
      const hearing = info.event.extendedProps as Hearing;
      viewHearing(hearing);
    },
    dateClick: (info) => {
      // Pre-fill the date when clicking on a calendar day
      hearingForm.value.hearing_date = formatDateForInput(info.dateStr);
      showCreateModal();
    },
    height: 'auto',
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: 3,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false
    }
  });

  calendarInstance.value.render();
};

const getEventColor = (status: string) => {
  const colors: Record<string, string> = {
    attended: '#00C851',
    not_attended: '#ff4444',
    virtual: '#33b5e5',
    postponed: '#ffbb33',
    cancelled: '#CC0000',
  };
  return colors[status] || '#007BFF';
};

const updateCalendarEvents = () => {
  if (!calendarInstance.value) return;
  
  // Remove all existing events
  calendarInstance.value.removeAllEvents();
  
  // Add updated events
  const events = hearings.value.map(hearing => ({
    id: hearing.id?.toString(),
    title: `${hearing.inmate?.full_name || 'PPL'} - ${getHearingTypeName(hearing.hearing_type)}`,
    start: hearing.hearing_date,
    backgroundColor: getEventColor(hearing.attendance_status),
    borderColor: getEventColor(hearing.attendance_status),
    extendedProps: hearing
  }));
  
  calendarInstance.value.addEventSource(events);
};

// Watch for view mode changes to initialize calendar
watch(viewMode, async (newMode) => {
  if (newMode === 'calendar') {
    await nextTick();
    initializeCalendar();
  }
});

// Watch for hearings changes to update calendar
watch(hearings, () => {
  updateCalendarEvents();
});

// Lifecycle
onMounted(async () => {
  await nextTick();
  if (hearingModal.value) {
    modalInstance.value = new Modal(hearingModal.value);
  }
  // Load catalogs first
  await loadLegalCatalogs();
  // Then load data
  loadHearings();
  loadInmates();
});
</script>

<style scoped>
.calendar-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}

#hearings-calendar {
  min-height: 600px;
}

:deep(.fc-toolbar-title) {
  font-size: 1.3rem;
  font-weight: 600;
  text-transform: capitalize;
}

:deep(.fc-button) {
  background-color: #f5f8fa;
  border-color: #e4e6ef;
  color: #7e8299;
  font-weight: 500;
  padding: 0.4rem 1rem;
}

:deep(.fc-button:hover) {
  background-color: #e4e6ef;
  border-color: #d1d3e0;
  color: #5e6278;
}

:deep(.fc-button-active) {
  background-color: #009ef7 !important;
  border-color: #009ef7 !important;
  color: #fff !important;
}

:deep(.fc-event) {
  border: none;
  padding: 2px 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: transform 0.2s;
}

:deep(.fc-event:hover) {
  transform: scale(1.02);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

:deep(.fc-daygrid-event) {
  white-space: normal;
  align-items: normal;
}

:deep(.fc-day-today) {
  background-color: #f1f3ff !important;
}

:deep(.fc-col-header-cell) {
  font-weight: 600;
  color: #3f4254;
  text-transform: uppercase;
  font-size: 0.8rem;
}

:deep(.fc-list-event:hover td) {
  background-color: #f5f8fa;
}

:deep(.fc-popover) {
  z-index: 10000;
}
</style>
