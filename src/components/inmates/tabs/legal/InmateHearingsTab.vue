<template>
  <div class="d-flex flex-column gap-5">
    <!--begin::Toolbar-->
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <h3 class="fw-bold text-gray-900">Audiencias Judiciales</h3>
        <p class="text-muted fs-7">Gestión de audiencias del expediente</p>
      </div>
      <button 
        v-if="canSchedule"
        @click="openAddHearingModal"
        class="btn btn-primary"
      >
        <i class="ki-duotone ki-calendar-add fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
        Programar Audiencia
      </button>
    </div>
    <!--end::Toolbar-->

    <!--begin::Hearings List-->
    <div v-if="loading" class="d-flex justify-content-center py-10">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="hearings.length === 0" class="card">
      <div class="card-body text-center py-10">
        <i class="ki-duotone ki-calendar fs-5x text-muted mb-5">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
        <h4 class="text-muted">No hay audiencias registradas</h4>
        <p class="text-muted fs-7">Programe una audiencia para comenzar</p>
      </div>
    </div>

    <div v-else>
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
              <thead>
                <tr class="fw-bold text-muted">
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Tribunal</th>
                  <th>Juez</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="hearing in hearings" :key="hearing.id">
                  <td>
                    <span class="fw-bold">{{ formatDate(hearing.hearing_date) }}</span>
                    <br>
                    <span class="text-muted fs-7">{{ formatTime(hearing.hearing_date) }}</span>
                  </td>
                  <td>{{ hearing.hearing_type }}</td>
                  <td>{{ hearing.court?.name || 'N/A' }}</td>
                  <td>{{ hearing.judge_name || 'N/A' }}</td>
                  <td>
                    <span :class="`badge badge-light-${getStatusColor(hearing.attendance_status)}`">
                      {{ getStatusLabel(hearing.attendance_status) }}
                    </span>
                  </td>
                  <td>
                    <button 
                      class="btn btn-sm btn-light-primary me-2"
                      @click="viewHearing(hearing)"
                    >
                      <i class="ki-duotone ki-eye fs-4"></i>
                    </button>
                    <button 
                      v-if="canSchedule"
                      class="btn btn-sm btn-light-warning"
                      @click="editHearing(hearing)"
                    >
                      <i class="ki-duotone ki-pencil fs-4"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!--end::Hearings List-->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import { formatDate } from '@/core/helpers/formatters';

// Props
interface Props {
  inmateId: number;
}
const props = defineProps<Props>();

// Stores
const authStore = useAuthStore();

// State
const hearings = ref<any[]>([]);
const loading = ref(false);

// Computed
const canSchedule = computed(() => authStore.hasPermission('legal.hearings'));

// Methods
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'scheduled': 'info',
    'attended': 'success',
    'postponed': 'warning',
    'cancelled': 'danger',
    'absent': 'dark'
  };
  return colors[status] || 'secondary';
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'scheduled': 'Programada',
    'attended': 'Realizada',
    'postponed': 'Pospuesta',
    'cancelled': 'Cancelada',
    'absent': 'Ausente'
  };
  return labels[status] || status;
};

const fetchHearings = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get(`/inmates/${props.inmateId}/legal`);
    hearings.value = response.data.data.hearings || [];
  } catch (error) {
    console.error('Error fetching hearings:', error);
  } finally {
    loading.value = false;
  }
};

const openAddHearingModal = () => {
  // TODO: Implement modal
  Swal.fire({
    title: 'Programar Audiencia',
    text: 'Esta funcionalidad estará disponible próximamente',
    icon: 'info'
  });
};

const viewHearing = (hearing: any) => {
  // TODO: Implement view
};

const editHearing = (hearing: any) => {
  // TODO: Implement edit
};

// Lifecycle
onMounted(() => {
  fetchHearings();
});
</script>