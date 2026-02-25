<template>
  <div 
    id="weightHistoryModal" 
    class="modal fade" 
    tabindex="-1" 
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">
            Historial de Peso
            <span v-if="profile?.inmate" class="text-muted fs-6 ms-2">
              - {{ getInmateName(profile.inmate) }}
            </span>
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
              <span class="visually-hidden">Cargando historial...</span>
            </div>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="alert alert-danger">
            <div class="d-flex">
              <i class="ki-duotone ki-cross-circle fs-2tx text-danger me-4">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="d-flex flex-column">
                <h4 class="mb-1 text-danger">Error al cargar historial</h4>
                <span>{{ error }}</span>
              </div>
            </div>
          </div>

          <!-- Weight History Content -->
          <div v-else>
            <!-- Current Weight Summary -->
            <div v-if="profile" class="row g-5 mb-7">
              <div class="col-md-3">
                <div class="card card-flush bg-light-primary h-100">
                  <div class="card-body text-center">
                    <div class="fs-2hx fw-bold text-primary">{{ profile.weight }}kg</div>
                    <div class="fs-7 fw-semibold text-gray-600">Peso Actual</div>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card card-flush bg-light-info h-100">
                  <div class="card-body text-center">
                    <div class="fs-2hx fw-bold text-info">{{ profile.bmi || 'N/A' }}</div>
                    <div class="fs-7 fw-semibold text-gray-600">IMC Actual</div>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card card-flush bg-light-success h-100">
                  <div class="card-body text-center">
                    <div class="fs-2hx fw-bold text-success">{{ getWeightChange() }}</div>
                    <div class="fs-7 fw-semibold text-gray-600">Cambio (30 días)</div>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card card-flush bg-light-warning h-100">
                  <div class="card-body text-center">
                    <div class="fs-2hx fw-bold text-warning">{{ weightHistory.length }}</div>
                    <div class="fs-7 fw-semibold text-gray-600">Registros</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add New Weight Record -->
            <div class="card card-flush mb-7">
              <div class="card-header">
                <div class="card-title">
                  <h3 class="fw-bold m-0">Registrar Nuevo Peso</h3>
                </div>
              </div>
              <div class="card-body">
                <Form @submit="handleAddWeight" :validation-schema="weightValidationSchema">
                  <div class="row g-5">
                    <div class="col-md-3">
                      <label class="required fs-6 fw-semibold mb-2">Peso (kg):</label>
                      <Field name="weight" v-slot="{ field, errorMessage }">
                        <input
                          v-bind="field"
                          type="number"
                          step="0.1"
                          min="20"
                          max="300"
                          class="form-control"
                          :class="{ 'is-invalid': errorMessage }"
                          placeholder="70.5"
                        />
                        <div v-if="errorMessage" class="invalid-feedback">
                          {{ errorMessage }}
                        </div>
                      </Field>
                    </div>
                    <div class="col-md-3">
                      <label class="required fs-6 fw-semibold mb-2">Fecha:</label>
                      <Field name="weight_date" v-slot="{ field, errorMessage }">
                        <input
                          v-bind="field"
                          type="date"
                          class="form-control"
                          :class="{ 'is-invalid': errorMessage }"
                          :max="new Date().toISOString().split('T')[0]"
                        />
                        <div v-if="errorMessage" class="invalid-feedback">
                          {{ errorMessage }}
                        </div>
                      </Field>
                    </div>
                    <div class="col-md-4">
                      <label class="fs-6 fw-semibold mb-2">Notas:</label>
                      <Field name="notes" v-slot="{ field, errorMessage }">
                        <input
                          v-bind="field"
                          type="text"
                          class="form-control"
                          :class="{ 'is-invalid': errorMessage }"
                          placeholder="Motivo del cambio, condiciones especiales..."
                        />
                        <div v-if="errorMessage" class="invalid-feedback">
                          {{ errorMessage }}
                        </div>
                      </Field>
                    </div>
                    <div class="col-md-2">
                      <label class="fs-6 fw-semibold mb-2">&nbsp;</label>
                      <button 
                        type="submit" 
                        class="btn btn-primary w-100"
                        :disabled="addingWeight"
                      >
                        <span v-if="addingWeight" class="spinner-border spinner-border-sm me-2"></span>
                        Agregar
                      </button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>

            <!-- Weight Chart -->
            <div v-if="weightHistory.length > 1" class="card card-flush mb-7">
              <div class="card-header">
                <div class="card-title">
                  <h3 class="fw-bold m-0">Gráfico de Evolución</h3>
                </div>
              </div>
              <div class="card-body">
                <div class="chart-container" style="position: relative; height: 300px;">
                  <canvas ref="chartCanvas"></canvas>
                </div>
              </div>
            </div>

            <!-- Weight History Table -->
            <div class="card card-flush">
              <div class="card-header">
                <div class="card-title">
                  <h3 class="fw-bold m-0">Historial Detallado</h3>
                </div>
                <div class="card-toolbar">
                  <div class="d-flex align-items-center gap-2">
                    <select
                      v-model="filterPeriod"
                      @change="filterHistory"
                      class="form-select form-select-sm w-150px"
                    >
                      <option value="all">Todos los registros</option>
                      <option value="last_30">Últimos 30 días</option>
                      <option value="last_90">Últimos 90 días</option>
                      <option value="last_year">Último año</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <div v-if="filteredHistory.length > 0" class="table-responsive">
                  <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                    <thead>
                      <tr class="fw-bold text-muted">
                        <th class="min-w-120px">Fecha</th>
                        <th class="min-w-80px">Peso</th>
                        <th class="min-w-80px">IMC</th>
                        <th class="min-w-80px">Cambio</th>
                        <th class="min-w-200px">Notas</th>
                        <th class="min-w-120px">Registrado por</th>
                        <th class="text-end min-w-70px">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(record, index) in filteredHistory" :key="record.id">
                        <td>
                          <div class="fw-semibold">{{ formatDate(record.weight_date) }}</div>
                          <div class="text-muted fs-7">{{ getTimeAgo(record.weight_date) }}</div>
                        </td>
                        <td>
                          <span class="fw-bold">{{ record.weight }}kg</span>
                        </td>
                        <td>
                          <span class="fw-semibold">{{ record.bmi || 'N/A' }}</span>
                          <div v-if="record.bmi_category" class="text-muted fs-7">
                            {{ getBMICategoryLabel(record.bmi_category) }}
                          </div>
                        </td>
                        <td>
                          <span 
                            v-if="index < filteredHistory.length - 1"
                            :class="getWeightChangeClass(record, filteredHistory[index + 1])"
                          >
                            {{ getWeightChangeBetween(record, filteredHistory[index + 1]) }}
                          </span>
                          <span v-else class="text-muted">-</span>
                        </td>
                        <td>
                          <span class="text-gray-700">{{ record.notes || '-' }}</span>
                        </td>
                        <td>
                          <div v-if="record.recorded_by" class="d-flex align-items-center">
                            <div class="symbol symbol-30px me-3">
                              <div class="symbol-label bg-light-primary text-primary fs-7 fw-bold">
                                {{ getInitials(record.recorded_by) }}
                              </div>
                            </div>
                            <div>
                              <div class="fw-semibold fs-7">
                                {{ record.recorded_by.first_name }} {{ record.recorded_by.last_name }}
                              </div>
                            </div>
                          </div>
                          <span v-else class="text-muted">N/A</span>
                        </td>
                        <td class="text-end">
                          <button
                            v-if="canDeleteRecord(record)"
                            @click="deleteWeightRecord(record)"
                            class="btn btn-sm btn-light-danger"
                            title="Eliminar registro"
                          >
                            <i class="ki-duotone ki-trash fs-6">
                              <span class="path1"></span>
                              <span class="path2"></span>
                              <span class="path3"></span>
                              <span class="path4"></span>
                              <span class="path5"></span>
                            </i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- No Records -->
                <div v-else class="text-center py-10">
                  <div class="mx-auto mb-4">
                    <i class="ki-duotone ki-chart-line fs-5x text-gray-400">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                  <div class="fs-6 text-gray-600 mb-4">
                    {{ weightHistory.length === 0 ? 'No hay registros de peso' : 'No se encontraron registros en el período seleccionado' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="close">
            Cerrar
          </button>
          <button 
            v-if="weightHistory.length > 0"
            type="button" 
            class="btn btn-info"
            @click="exportHistory"
          >
            <i class="ki-duotone ki-file-down fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Exportar Historial
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { Modal } from 'bootstrap';
import { Form, Field } from 'vee-validate';
import * as yup from 'yup';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import Chart from 'chart.js/auto';

// Props
interface Props {
  profile?: any;
  show: boolean;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  close: [];
  updated: [];
}>();

// State
const modalRef = ref<HTMLElement>();
const modal = ref<Modal>();
const loading = ref(false);
const error = ref<string | null>(null);
const addingWeight = ref(false);
const weightHistory = ref<any[]>([]);
const filterPeriod = ref('all');
const chartCanvas = ref<HTMLCanvasElement>();
const chart = ref<Chart | null>(null);

// Validation Schema
const weightValidationSchema = yup.object({
  weight: yup.number()
    .required('El peso es requerido')
    .min(20, 'El peso debe ser mayor a 20 kg')
    .max(300, 'El peso debe ser menor a 300 kg'),
  weight_date: yup.date()
    .required('La fecha es requerida')
    .max(new Date(), 'La fecha no puede ser futura'),
  notes: yup.string().nullable()
});

// Computed
const filteredHistory = computed(() => {
  if (filterPeriod.value === 'all') {
    return weightHistory.value;
  }
  
  const now = new Date();
  let cutoffDate: Date;
  
  switch (filterPeriod.value) {
    case 'last_30':
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'last_90':
      cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'last_year':
      cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      return weightHistory.value;
  }
  
  return weightHistory.value.filter(record => 
    new Date(record.weight_date) >= cutoffDate
  );
});

// Watchers
watch(() => props.show, async (show) => {
  if (show) {
    await nextTick();
    if (modalRef.value) {
      modal.value = new Modal(modalRef.value);
      modal.value.show();
      await loadWeightHistory();
    }
  } else {
    modal.value?.hide();
    destroyChart();
  }
});

watch(() => filteredHistory.value, () => {
  if (filteredHistory.value.length > 1) {
    nextTick(() => {
      createChart();
    });
  }
});

// Methods
const loadWeightHistory = async () => {
  if (!props.profile?.inmate_id) return;
  
  try {
    loading.value = true;
    error.value = null;
    
    const response = await ApiService.get(`/inmates/${props.profile.inmate_id}/weight-history`);
    
    if (response.data.success) {
      weightHistory.value = response.data.data;
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al cargar el historial de peso';
    console.error('Error loading weight history:', err);
  } finally {
    loading.value = false;
  }
};

const handleAddWeight = async (values: any) => {
  try {
    addingWeight.value = true;
    
    const formData = {
      ...values,
      inmate_id: props.profile?.inmate_id
    };
    
    const response = await ApiService.post('/inmate-weight-history', formData);
    
    if (response.data.success) {
      await Swal.fire({
        title: 'Peso Registrado',
        text: 'El nuevo registro de peso ha sido guardado exitosamente',
        icon: 'success',
        timer: 2000
      });
      
      await loadWeightHistory();
      emit('updated');
      
      // Reset form
      const form = document.querySelector('form') as HTMLFormElement;
      form?.reset();
    }
  } catch (err: any) {
    await Swal.fire({
      title: 'Error',
      text: err.response?.data?.message || 'Error al registrar el peso',
      icon: 'error'
    });
  } finally {
    addingWeight.value = false;
  }
};

const deleteWeightRecord = async (record: any) => {
  const result = await Swal.fire({
    title: '¿Eliminar Registro?',
    text: `¿Está seguro de eliminar el registro de peso del ${formatDate(record.weight_date)}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#f1416c'
  });

  if (result.isConfirmed) {
    try {
      const response = await ApiService.delete(`/inmate-weight-history/${record.id}`);
      
      if (response.data.success) {
        await Swal.fire({
          title: 'Eliminado',
          text: 'El registro de peso ha sido eliminado',
          icon: 'success',
          timer: 2000
        });
        
        await loadWeightHistory();
        emit('updated');
      }
    } catch (err: any) {
      await Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Error al eliminar el registro',
        icon: 'error'
      });
    }
  }
};

const createChart = () => {
  if (!chartCanvas.value || filteredHistory.value.length < 2) return;
  
  destroyChart();
  
  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;
  
  const data = filteredHistory.value
    .slice()
    .reverse()
    .map(record => ({
      x: record.weight_date,
      y: parseFloat(record.weight)
    }));
  
  chart.value = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Peso (kg)',
        data: data,
        borderColor: '#3E97FF',
        backgroundColor: 'rgba(62, 151, 255, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'MMM dd'
            }
          },
          title: {
            display: true,
            text: 'Fecha'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Peso (kg)'
          },
          beginAtZero: false
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            title: function(context: any) {
              return new Date(context[0].parsed.x).toLocaleDateString('es-GT');
            },
            label: function(context: any) {
              return `Peso: ${context.parsed.y} kg`;
            }
          }
        }
      }
    }
  });
};

const destroyChart = () => {
  if (chart.value) {
    chart.value.destroy();
    chart.value = null;
  }
};

const filterHistory = () => {
  // Trigger reactive update through computed property
};

const exportHistory = () => {
  // TODO: Implement export functionality
};

const close = () => {
  modal.value?.hide();
  emit('close');
};

// Utility functions
const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getTimeAgo = (date: string) => {
  if (!date) return '';
  
  const now = new Date();
  const recordDate = new Date(date);
  const diffDays = Math.floor((now.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
  return `Hace ${Math.floor(diffDays / 365)} años`;
};

const getInmateName = (inmate: any) => {
  if (!inmate) return 'N/A';
  return [inmate.first_name, inmate.middle_name, inmate.last_name, inmate.second_last_name].filter(Boolean).join(' ');
};

const getInitials = (user: any) => {
  if (!user) return '??';
  const first = user.first_name?.[0] || '';
  const last = user.last_name?.[0] || '';
  return `${first}${last}`.toUpperCase();
};

const getBMICategoryLabel = (category: string) => {
  const labels: { [key: string]: string } = {
    underweight: 'Bajo peso',
    normal: 'Normal',
    overweight: 'Sobrepeso',
    obese: 'Obesidad'
  };
  return labels[category] || category;
};

const getWeightChange = () => {
  if (weightHistory.value.length < 2) return 'N/A';
  
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentRecords = weightHistory.value.filter(record => 
    new Date(record.weight_date) >= thirtyDaysAgo
  );
  
  if (recentRecords.length < 2) return 'N/A';
  
  const latest = recentRecords[0];
  const oldest = recentRecords[recentRecords.length - 1];
  const change = parseFloat(latest.weight) - parseFloat(oldest.weight);
  
  if (change > 0) return `+${change.toFixed(1)}kg`;
  if (change < 0) return `${change.toFixed(1)}kg`;
  return '0kg';
};

const getWeightChangeBetween = (current: any, previous: any) => {
  const change = parseFloat(current.weight) - parseFloat(previous.weight);
  
  if (change > 0) return `+${change.toFixed(1)}kg`;
  if (change < 0) return `${change.toFixed(1)}kg`;
  return '0kg';
};

const getWeightChangeClass = (current: any, previous: any) => {
  const change = parseFloat(current.weight) - parseFloat(previous.weight);
  
  if (change > 0) return 'text-success fw-bold';
  if (change < 0) return 'text-danger fw-bold';
  return 'text-muted';
};

const canDeleteRecord = (record: any) => {
  // Can only delete records from today or yesterday
  const recordDate = new Date(record.weight_date);
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  return recordDate >= yesterday;
};

// Lifecycle
onBeforeUnmount(() => {
  destroyChart();
});

// Setup modal event listeners
onMounted(() => {
  if (modalRef.value) {
    modalRef.value.addEventListener('hidden.bs.modal', () => {
      emit('close');
    });
  }
});
</script>