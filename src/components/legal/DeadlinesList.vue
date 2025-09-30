<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Lista de Plazos Procesales</h5>
        <div class="d-flex gap-2">
          <select v-model="filters.priority_level" class="form-select form-select-sm" style="width: 150px" @change="loadDeadlines">
            <option value="">Todas las prioridades</option>
            <option v-for="priority in priorityLevels" :key="priority.value" :value="priority.value">
              {{ priority.label }}
            </option>
          </select>
          <select v-model="filters.status" class="form-select form-select-sm" style="width: 150px" @change="loadDeadlines">
            <option value="">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="overdue">Vencidos</option>
            <option value="completed">Completados</option>
          </select>
        </div>
      </div>
    </div>

    <div class="card-body">
      <div v-if="loading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <div v-else-if="deadlines.length === 0" class="text-center py-4">
        <i class="bi bi-calendar-x fs-1 text-muted"></i>
        <p class="text-muted mt-2">No se encontraron plazos procesales</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Interno</th>
              <th>Tipo de Plazo</th>
              <th>Fecha Límite</th>
              <th>Días Restantes</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="deadline in deadlines" :key="deadline.id">
              <td>
                <div class="d-flex align-items-center">
                  <div class="ms-2">
                    <div class="fw-bold">{{ deadline.inmate?.full_name || 'N/A' }}</div>
                    <small class="text-muted">{{ deadline.inmate?.registration_number || '' }}</small>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge bg-secondary">{{ getDeadlineTypeLabel(deadline.deadline_type) }}</span>
              </td>
              <td>{{ formatDate(deadline.deadline_date) }}</td>
              <td>
                <span v-if="deadline.is_overdue" class="badge bg-danger">Vencido</span>
                <span v-else :class="`badge bg-${getDaysRemainingColor(deadline.days_remaining)}`">
                  {{ deadline.days_remaining }} días
                </span>
              </td>
              <td>
                <span :class="`badge bg-${getPriorityColor(deadline.priority_level)}`">
                  {{ getPriorityLabel(deadline.priority_level) }}
                </span>
              </td>
              <td>
                <span v-if="deadline.is_active" class="badge bg-success">Activo</span>
                <span v-else-if="deadline.is_overdue" class="badge bg-danger">Vencido</span>
                <span v-else class="badge bg-secondary">Completado</span>
              </td>
              <td class="text-end">
                <button
                  v-if="deadline.is_active"
                  class="btn btn-sm btn-success me-1"
                  @click="markAsComplete(deadline.id)"
                  title="Marcar como completado"
                >
                  <i class="bi bi-check-circle"></i>
                </button>
                <button
                  class="btn btn-sm btn-info me-1"
                  @click="editDeadline(deadline)"
                  title="Editar"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  @click="deleteDeadline(deadline.id)"
                  title="Eliminar"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.last_page > 1" class="d-flex justify-content-center mt-4">
        <nav>
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: !pagination.prev_page_url }">
              <a class="page-link" @click="changePage(pagination.current_page - 1)">Anterior</a>
            </li>
            <li
              v-for="page in visiblePages"
              :key="page"
              class="page-item"
              :class="{ active: page === pagination.current_page }"
            >
              <a class="page-link" @click="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: !pagination.next_page_url }">
              <a class="page-link" @click="changePage(pagination.current_page + 1)">Siguiente</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';

const emit = defineEmits(['stats-updated']);

const loading = ref(false);
const deadlines = ref<any[]>([]);
const pagination = ref<any>(null);
const currentPage = ref(1);

const filters = ref({
  priority_level: '',
  status: '',
  deadline_type: ''
});

const priorityLevels = ref([
  { value: 'low', label: 'Baja', color: 'success' },
  { value: 'medium', label: 'Media', color: 'warning' },
  { value: 'high', label: 'Alta', color: 'danger' },
  { value: 'critical', label: 'Crítica', color: 'dark' }
]);

const deadlineTypes = [
  { value: 'preventive_detention_max', label: 'Plazo Máximo de Prisión Preventiva' },
  { value: 'investigation_closure', label: 'Cierre de Investigación' },
  { value: 'intermediate_phase', label: 'Fase Intermedia' },
  { value: 'trial_start', label: 'Inicio de Juicio' },
  { value: 'sentence_execution', label: 'Ejecución de Sentencia' },
  { value: 'appeal_filing', label: 'Interposición de Recurso' },
  { value: 'benefit_eligibility', label: 'Elegibilidad para Beneficios' },
  { value: 'parole_review', label: 'Revisión de Libertad Condicional' },
  { value: 'sentence_completion', label: 'Cumplimiento de Sentencia' }
];

const visiblePages = computed(() => {
  if (!pagination.value) return [];
  const pages = [];
  const total = pagination.value.last_page;
  const current = pagination.value.current_page;

  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
    pages.push(i);
  }
  return pages;
});

onMounted(async () => {
  await loadDeadlines();
});

const loadDeadlines = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get('/legal/deadlines', {
      params: {
        page: currentPage.value,
        per_page: 10,
        ...filters.value
      }
    });

    if (response.data.success) {
      deadlines.value = response.data.data.data;
      pagination.value = response.data.data;

      // Emit statistics
      const stats = {
        total: response.data.data.total || 0,
        overdue: deadlines.value.filter(d => d.is_overdue).length,
        critical: deadlines.value.filter(d => !d.is_overdue && d.days_remaining <= 7).length,
        upcoming: deadlines.value.filter(d => !d.is_overdue && d.days_remaining > 7 && d.days_remaining <= 30).length
      };
      emit('stats-updated', stats);
    }
  } catch (error) {
    console.error('Error loading deadlines:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los plazos procesales'
    });
  } finally {
    loading.value = false;
  }
};

const changePage = (page: number) => {
  if (page < 1 || page > pagination.value.last_page) return;
  currentPage.value = page;
  loadDeadlines();
};

const markAsComplete = async (id: number) => {
  const result = await Swal.fire({
    title: '¿Marcar como completado?',
    text: 'Este plazo se marcará como completado',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, completar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      const response = await ApiService.patch(`/legal/deadlines/${id}/complete`);
      if (response.data.success) {
        Swal.fire('¡Completado!', 'El plazo ha sido marcado como completado', 'success');
        await loadDeadlines();
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo completar el plazo', 'error');
    }
  }
};

const editDeadline = (deadline: any) => {
  // This would open the modal for editing
  console.log('Edit deadline:', deadline);
};

const deleteDeadline = async (id: number) => {
  const result = await Swal.fire({
    title: '¿Eliminar plazo?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      const response = await ApiService.delete(`/legal/deadlines/${id}`);
      if (response.data.success) {
        Swal.fire('¡Eliminado!', 'El plazo ha sido eliminado', 'success');
        await loadDeadlines();
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el plazo', 'error');
    }
  }
};

const getDeadlineTypeLabel = (type: string) => {
  const found = deadlineTypes.find(t => t.value === type);
  return found?.label || type;
};

const getPriorityLabel = (priority: string) => {
  const found = priorityLevels.value.find(p => p.value === priority);
  return found?.label || priority;
};

const getPriorityColor = (priority: string) => {
  const found = priorityLevels.value.find(p => p.value === priority);
  return found?.color || 'secondary';
};

const getDaysRemainingColor = (days: number) => {
  if (days <= 7) return 'danger';
  if (days <= 30) return 'warning';
  return 'success';
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES');
};

defineExpose({ loadDeadlines });
</script>