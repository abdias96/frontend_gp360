<template>
  <div 
    id="upcomingReviewsModal" 
    class="modal fade" 
    tabindex="-1" 
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">Revisiones de Clasificación Pendientes</h2>
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
              <span class="visually-hidden">Cargando revisiones...</span>
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
                <h4 class="mb-1 text-danger">Error al cargar revisiones</h4>
                <span>{{ error }}</span>
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div v-else class="row mb-7">
            <div class="col-md-4">
              <label class="fs-6 fw-semibold mb-2">Filtrar por Estado:</label>
              <select
                v-model="filters.status"
                @change="filterReviews"
                class="form-select"
              >
                <option value="">Todas las revisiones</option>
                <option value="overdue">Vencidas</option>
                <option value="today">Hoy</option>
                <option value="this_week">Esta semana</option>
                <option value="this_month">Este mes</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="fs-6 fw-semibold mb-2">Filtrar por Prioridad:</label>
              <select
                v-model="filters.priority"
                @change="filterReviews"
                class="form-select"
              >
                <option value="">Todas las prioridades</option>
                <option value="high">Alta prioridad</option>
                <option value="medium">Prioridad media</option>
                <option value="low">Baja prioridad</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="fs-6 fw-semibold mb-2">Búsqueda:</label>
              <input
                v-model="searchQuery"
                @input="filterReviews"
                type="text"
                class="form-control"
                placeholder="Buscar por nombre o número de interno..."
              />
            </div>
          </div>

          <!-- Statistics Cards -->
          <div v-if="upcomingReviews.length > 0" class="row g-5 mb-7">
            <div class="col-md-3">
              <div class="card card-flush bg-light-danger h-100">
                <div class="card-body text-center">
                  <div class="fs-2hx fw-bold text-danger">{{ getOverdueCount() }}</div>
                  <div class="fs-7 fw-semibold text-gray-600">Vencidas</div>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card card-flush bg-light-warning h-100">
                <div class="card-body text-center">
                  <div class="fs-2hx fw-bold text-warning">{{ getTodayCount() }}</div>
                  <div class="fs-7 fw-semibold text-gray-600">Hoy</div>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card card-flush bg-light-info h-100">
                <div class="card-body text-center">
                  <div class="fs-2hx fw-bold text-info">{{ getThisWeekCount() }}</div>
                  <div class="fs-7 fw-semibold text-gray-600">Esta Semana</div>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card card-flush bg-light-primary h-100">
                <div class="card-body text-center">
                  <div class="fs-2hx fw-bold text-primary">{{ filteredReviews.length }}</div>
                  <div class="fs-7 fw-semibold text-gray-600">Total</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Table -->
          <div v-if="filteredReviews.length > 0" class="table-responsive">
            <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
              <thead>
                <tr class="fw-bold text-muted">
                  <th class="min-w-200px">Interno</th>
                  <th class="min-w-120px">Clasificación Actual</th>
                  <th class="min-w-120px">Fecha de Revisión</th>
                  <th class="min-w-80px">Estado</th>
                  <th class="min-w-100px">Días</th>
                  <th class="min-w-80px">Prioridad</th>
                  <th class="text-end min-w-100px">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="review in filteredReviews" :key="review.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="symbol symbol-45px me-5">
                        <div class="symbol-label bg-light-primary text-primary fs-6 fw-bold">
                          {{ getInitials(review.inmate) }}
                        </div>
                      </div>
                      <div class="d-flex justify-content-start flex-column">
                        <span class="text-dark fw-bold text-hover-primary fs-6">
                          {{ getInmateName(review.inmate) }}
                        </span>
                        <span class="text-muted fw-semibold text-muted d-block fs-7">
                          {{ review.inmate?.inmate_number }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span 
                      class="badge"
                      :class="getSecurityLevelBadgeClass(review.classification_level)"
                    >
                      {{ getSecurityLevelLabel(review.classification_level) }}
                    </span>
                  </td>
                  <td>{{ formatDate(review.next_review_date) }}</td>
                  <td>
                    <span 
                      class="badge"
                      :class="getReviewStatusBadgeClass(review.next_review_date)"
                    >
                      {{ getReviewStatusLabel(review.next_review_date) }}
                    </span>
                  </td>
                  <td>
                    <span 
                      :class="getReviewStatusTextClass(review.next_review_date)"
                    >
                      {{ getDaysUntilReview(review.next_review_date) }}
                    </span>
                  </td>
                  <td>
                    <span 
                      class="badge"
                      :class="getReviewPriorityBadgeClass(review.next_review_date)"
                    >
                      {{ getReviewPriorityLabel(review.next_review_date) }}
                    </span>
                  </td>
                  <td class="text-end">
                    <div class="dropdown">
                      <button
                        class="btn btn-sm btn-light btn-active-light-primary"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i class="ki-duotone ki-dots-horizontal fs-5">
                          <span class="path1"></span>
                          <span class="path2"></span>
                          <span class="path3"></span>
                        </i>
                      </button>
                      <ul class="dropdown-menu menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-200px py-4">
                        <li class="menu-item px-3">
                          <a href="#" class="menu-link px-3" @click.prevent="viewClassification(review)">
                            <i class="ki-duotone ki-eye fs-6 me-2">
                              <span class="path1"></span>
                              <span class="path2"></span>
                              <span class="path3"></span>
                            </i>
                            Ver Clasificación
                          </a>
                        </li>
                        <li class="menu-item px-3">
                          <a href="#" class="menu-link px-3" @click.prevent="scheduleReview(review)">
                            <i class="ki-duotone ki-calendar-add fs-6 me-2">
                              <span class="path1"></span>
                              <span class="path2"></span>
                            </i>
                            Programar Revisión
                          </a>
                        </li>
                        <li class="menu-item px-3">
                          <a href="#" class="menu-link px-3 text-success" @click.prevent="performReview(review)">
                            <i class="ki-duotone ki-check fs-6 me-2">
                              <span class="path1"></span>
                              <span class="path2"></span>
                            </i>
                            Realizar Revisión
                          </a>
                        </li>
                        <li class="menu-separator"></li>
                        <li class="menu-item px-3">
                          <a href="#" class="menu-link px-3 text-warning" @click.prevent="postponeReview(review)">
                            <i class="ki-duotone ki-time fs-6 me-2">
                              <span class="path1"></span>
                              <span class="path2"></span>
                              <span class="path3"></span>
                            </i>
                            Posponer
                          </a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- No Reviews -->
          <div v-else-if="!loading" class="text-center py-10">
            <div class="mx-auto mb-4">
              <i class="ki-duotone ki-calendar-tick fs-5x text-gray-400">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
            </div>
            <div class="fs-6 text-gray-600 mb-4">
              {{ upcomingReviews.length === 0 ? 'No hay revisiones pendientes' : 'No se encontraron revisiones con los filtros aplicados' }}
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="close">
            Cerrar
          </button>
          <button 
            v-if="upcomingReviews.length > 0"
            type="button" 
            class="btn btn-info"
            @click="exportReviews"
          >
            <i class="ki-duotone ki-file-down fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Exportar Lista
          </button>
          <button 
            v-if="getOverdueCount() > 0"
            type="button" 
            class="btn btn-warning"
            @click="notifyOverdue"
          >
            <i class="ki-duotone ki-notification-status fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
              <span class="path4"></span>
            </i>
            Notificar Vencidas
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

// Props
interface Props {
  show: boolean;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  close: [];
  reviewClassification: [classification: any];
}>();

// State
const modalRef = ref<HTMLElement>();
const modal = ref<Modal>();
const loading = ref(false);
const error = ref<string | null>(null);
const upcomingReviews = ref<any[]>([]);
const searchQuery = ref('');

const filters = ref({
  status: '',
  priority: ''
});

// Computed
const filteredReviews = computed(() => {
  let reviews = [...upcomingReviews.value];
  
  // Filter by status
  if (filters.value.status) {
    const now = new Date();
    reviews = reviews.filter(review => {
      const reviewDate = new Date(review.next_review_date);
      const diffDays = Math.ceil((reviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (filters.value.status) {
        case 'overdue':
          return diffDays < 0;
        case 'today':
          return diffDays === 0;
        case 'this_week':
          return diffDays >= 0 && diffDays <= 7;
        case 'this_month':
          return diffDays >= 0 && diffDays <= 30;
        default:
          return true;
      }
    });
  }
  
  // Filter by priority
  if (filters.value.priority) {
    reviews = reviews.filter(review => {
      const priority = getReviewPriorityLevel(review.next_review_date);
      return priority === filters.value.priority;
    });
  }
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    reviews = reviews.filter(review => {
      const inmateName = getInmateName(review.inmate).toLowerCase();
      const inmateNumber = review.inmate?.inmate_number?.toLowerCase() || '';
      return inmateName.includes(query) || inmateNumber.includes(query);
    });
  }
  
  // Sort by urgency (overdue first, then by date)
  return reviews.sort((a, b) => {
    const now = new Date();
    const dateA = new Date(a.next_review_date);
    const dateB = new Date(b.next_review_date);
    
    const daysA = Math.ceil((dateA.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const daysB = Math.ceil((dateB.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Overdue first
    if (daysA < 0 && daysB >= 0) return -1;
    if (daysB < 0 && daysA >= 0) return 1;
    
    // Then by date
    return dateA.getTime() - dateB.getTime();
  });
});

// Watchers
watch(() => props.show, async (show) => {
  if (show) {
    await nextTick();
    if (modalRef.value) {
      modal.value = new Modal(modalRef.value);
      modal.value.show();
      await loadUpcomingReviews();
    }
  } else {
    modal.value?.hide();
  }
});

// Methods
const loadUpcomingReviews = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const response = await ApiService.get('/inmate-security-classifications/upcoming-reviews');
    
    if (response.data.success) {
      upcomingReviews.value = response.data.data;
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al cargar las revisiones';
    console.error('Error loading upcoming reviews:', err);
  } finally {
    loading.value = false;
  }
};

const filterReviews = () => {
  // Trigger reactive update
};

const close = () => {
  modal.value?.hide();
  emit('close');
};

const viewClassification = (review: any) => {
  emit('reviewClassification', review);
  close();
};

const scheduleReview = async (review: any) => {
  const { value: formValues } = await Swal.fire({
    title: 'Programar Revisión',
    html: `
      <div class="text-start">
        <p><strong>Interno:</strong> ${getInmateName(review.inmate)}</p>
        <p><strong>Clasificación Actual:</strong> ${getSecurityLevelLabel(review.classification_level)}</p>
        <div class="mt-4">
          <label for="new_review_date" class="form-label">Nueva Fecha de Revisión:</label>
          <input id="new_review_date" class="swal2-input" type="date" required>
        </div>
        <div class="mt-3">
          <label for="schedule_notes" class="form-label">Notas (opcional):</label>
          <textarea id="schedule_notes" class="swal2-textarea" placeholder="Motivo de la reprogramación..."></textarea>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Programar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const newDate = (document.getElementById('new_review_date') as HTMLInputElement).value;
      const notes = (document.getElementById('schedule_notes') as HTMLTextAreaElement).value;
      
      if (!newDate) {
        Swal.showValidationMessage('La fecha de revisión es requerida');
        return false;
      }
      
      return { new_review_date: newDate, notes };
    }
  });

  if (formValues) {
    try {
      const response = await ApiService.put(`/inmate-security-classifications/${review.id}`, {
        review_date: formValues.new_review_date,
        classification_notes: formValues.notes
      });
      
      if (response.data.success) {
        await Swal.fire({
          title: 'Revisión Programada',
          text: 'La fecha de revisión ha sido actualizada',
          icon: 'success',
          timer: 2000
        });
        
        await loadUpcomingReviews();
      }
    } catch (err: any) {
      await Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Error al programar la revisión',
        icon: 'error'
      });
    }
  }
};

const performReview = (review: any) => {
  emit('reviewClassification', review);
  close();
};

const postponeReview = async (review: any) => {
  const { value: days } = await Swal.fire({
    title: 'Posponer Revisión',
    text: `¿Por cuántos días desea posponer la revisión de ${getInmateName(review.inmate)}?`,
    input: 'number',
    inputAttributes: {
      min: '1',
      max: '90',
      step: '1'
    },
    inputValue: '30',
    showCancelButton: true,
    confirmButtonText: 'Posponer',
    cancelButtonText: 'Cancelar',
    inputValidator: (value) => {
      if (!value || parseInt(value) < 1 || parseInt(value) > 90) {
        return 'Debe ingresar un número entre 1 y 90 días';
      }
    }
  });

  if (days) {
    try {
      const currentDate = new Date(review.next_review_date);
      const newDate = new Date(currentDate.getTime() + (parseInt(days) * 24 * 60 * 60 * 1000));
      
      const response = await ApiService.put(`/inmate-security-classifications/${review.id}`, {
        review_date: newDate.toISOString().split('T')[0]
      });
      
      if (response.data.success) {
        await Swal.fire({
          title: 'Revisión Pospuesta',
          text: `La revisión ha sido pospuesta por ${days} días`,
          icon: 'success',
          timer: 2000
        });
        
        await loadUpcomingReviews();
      }
    } catch (err: any) {
      await Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Error al posponer la revisión',
        icon: 'error'
      });
    }
  }
};

const exportReviews = () => {
  // TODO: Implement export functionality
  console.log('Export reviews:', filteredReviews.value);
};

const notifyOverdue = async () => {
  const overdueReviews = upcomingReviews.value.filter(review => {
    const now = new Date();
    const reviewDate = new Date(review.next_review_date);
    return reviewDate < now;
  });

  await Swal.fire({
    title: 'Notificaciones Enviadas',
    text: `Se han enviado notificaciones para ${overdueReviews.length} revisiones vencidas`,
    icon: 'info',
    timer: 2000
  });
};

// Statistics methods
const getOverdueCount = () => {
  const now = new Date();
  return upcomingReviews.value.filter(review => {
    const reviewDate = new Date(review.next_review_date);
    return reviewDate < now;
  }).length;
};

const getTodayCount = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  
  return upcomingReviews.value.filter(review => {
    const reviewDate = new Date(review.next_review_date);
    return reviewDate >= today && reviewDate < tomorrow;
  }).length;
};

const getThisWeekCount = () => {
  const now = new Date();
  return upcomingReviews.value.filter(review => {
    const reviewDate = new Date(review.next_review_date);
    const diffDays = Math.ceil((reviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }).length;
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

const getInmateName = (inmate: any) => {
  if (!inmate) return 'N/A';
  return `${inmate.first_name} ${inmate.last_name}`;
};

const getInitials = (inmate: any) => {
  if (!inmate) return '??';
  const first = inmate.first_name?.[0] || '';
  const last = inmate.last_name?.[0] || '';
  return `${first}${last}`.toUpperCase();
};

const getSecurityLevelBadgeClass = (level: string) => {
  const classes: { [key: string]: string } = {
    minimum: 'badge-light-success',
    low: 'badge-light-info',
    medium: 'badge-light-primary',
    high: 'badge-light-warning',
    maximum: 'badge-light-danger',
    super_maximum: 'badge-dark'
  };
  return classes[level] || 'badge-light-secondary';
};

const getSecurityLevelLabel = (level: string) => {
  const labels: { [key: string]: string } = {
    minimum: 'Mínimo',
    low: 'Bajo',
    medium: 'Medio',
    high: 'Alto',
    maximum: 'Máximo',
    super_maximum: 'Super Máximo'
  };
  return labels[level] || level;
};

const getDaysUntilReview = (reviewDate: string) => {
  if (!reviewDate) return 'N/A';
  
  const now = new Date();
  const review = new Date(reviewDate);
  const diffDays = Math.ceil((review.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return `${Math.abs(diffDays)} días atrás`;
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Mañana';
  return `En ${diffDays} días`;
};

const getReviewStatusLabel = (reviewDate: string) => {
  if (!reviewDate) return 'Sin programar';
  
  const now = new Date();
  const review = new Date(reviewDate);
  const diffDays = Math.ceil((review.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Vencida';
  if (diffDays === 0) return 'Hoy';
  if (diffDays <= 7) return 'Esta semana';
  if (diffDays <= 30) return 'Este mes';
  return 'Programada';
};

const getReviewStatusBadgeClass = (reviewDate: string) => {
  if (!reviewDate) return 'badge-light-secondary';
  
  const now = new Date();
  const review = new Date(reviewDate);
  const diffDays = Math.ceil((review.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'badge-light-danger';
  if (diffDays === 0) return 'badge-light-warning';
  if (diffDays <= 7) return 'badge-light-info';
  return 'badge-light-primary';
};

const getReviewStatusTextClass = (reviewDate: string) => {
  if (!reviewDate) return 'text-muted';
  
  const now = new Date();
  const review = new Date(reviewDate);
  const diffDays = Math.ceil((review.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'text-danger fw-bold';
  if (diffDays <= 7) return 'text-warning fw-bold';
  return 'text-muted';
};

const getReviewPriorityLevel = (reviewDate: string) => {
  if (!reviewDate) return 'low';
  
  const now = new Date();
  const review = new Date(reviewDate);
  const diffDays = Math.ceil((review.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'high';
  if (diffDays <= 7) return 'medium';
  return 'low';
};

const getReviewPriorityLabel = (reviewDate: string) => {
  const priority = getReviewPriorityLevel(reviewDate);
  const labels: { [key: string]: string } = {
    high: 'Alta',
    medium: 'Media',
    low: 'Baja'
  };
  return labels[priority] || 'Baja';
};

const getReviewPriorityBadgeClass = (reviewDate: string) => {
  const priority = getReviewPriorityLevel(reviewDate);
  const classes: { [key: string]: string } = {
    high: 'badge-light-danger',
    medium: 'badge-light-warning',
    low: 'badge-light-success'
  };
  return classes[priority] || 'badge-light-secondary';
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