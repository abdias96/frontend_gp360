<template>
  <div class="container-fluid">
    <!-- Page Header -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="h3 mb-0">Gestión de Plazos Procesales</h1>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item">
                  <RouterLink to="/dashboard">Inicio</RouterLink>
                </li>
                <li class="breadcrumb-item">Legal</li>
                <li class="breadcrumb-item active">Plazos Procesales</li>
              </ol>
            </nav>
          </div>
          <button
            class="btn btn-primary"
            @click="openNewDeadline"
          >
            <i class="bi bi-plus-circle me-2"></i>
            Nuevo Plazo
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row mb-4">
      <div class="col-xl-3 col-md-6">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted mb-1">Total Plazos</p>
                <h3 class="mb-0">{{ stats.total }}</h3>
              </div>
              <div class="bg-primary bg-opacity-10 rounded-3 p-3">
                <i class="bi bi-calendar-check fs-3 text-primary"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted mb-1">Vencidos</p>
                <h3 class="mb-0 text-danger">{{ stats.overdue }}</h3>
              </div>
              <div class="bg-danger bg-opacity-10 rounded-3 p-3">
                <i class="bi bi-exclamation-triangle fs-3 text-danger"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted mb-1">Críticos (7 días)</p>
                <h3 class="mb-0 text-warning">{{ stats.critical }}</h3>
              </div>
              <div class="bg-warning bg-opacity-10 rounded-3 p-3">
                <i class="bi bi-clock-history fs-3 text-warning"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted mb-1">Próximos (30 días)</p>
                <h3 class="mb-0 text-info">{{ stats.upcoming }}</h3>
              </div>
              <div class="bg-info bg-opacity-10 rounded-3 p-3">
                <i class="bi bi-calendar-event fs-3 text-info"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Deadlines List Component -->
    <DeadlinesList
      ref="deadlinesListRef"
      @stats-updated="updateStats"
    />

    <!-- Deadlines Modal -->
    <DeadlinesModal
      ref="deadlinesModalRef"
      :inmate-id="null"
      @saved="onDeadlineSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import DeadlinesList from '@/components/legal/DeadlinesList.vue';
import DeadlinesModal from '@/components/legal/DeadlinesModal.vue';
import ApiService from '@/core/services/ApiService';

const deadlinesListRef = ref<InstanceType<typeof DeadlinesList>>();
const deadlinesModalRef = ref<InstanceType<typeof DeadlinesModal>>();

const stats = ref({
  total: 0,
  overdue: 0,
  critical: 0,
  upcoming: 0
});

onMounted(async () => {
  await loadStatistics();
});

const loadStatistics = async () => {
  try {
    // Get overdue deadlines
    const overdueResponse = await ApiService.get('/legal/deadlines/overdue');
    stats.value.overdue = overdueResponse.data.data.length;

    // Get upcoming deadlines (30 days)
    const upcomingResponse = await ApiService.get('/legal/deadlines/upcoming', {
      params: { days: 30 }
    });

    // Count critical (7 days or less) from upcoming
    const upcomingDeadlines = upcomingResponse.data.data;
    stats.value.upcoming = upcomingDeadlines.length;

    // Count critical deadlines
    const now = new Date();
    stats.value.critical = upcomingDeadlines.filter((deadline: any) => {
      const deadlineDate = new Date(deadline.deadline_date);
      const daysRemaining = Math.floor((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysRemaining <= 7;
    }).length;

    // Get total from paginated response
    const totalResponse = await ApiService.get('/legal/deadlines', {
      params: { per_page: 1 }
    });
    stats.value.total = totalResponse.data.data.total || 0;
  } catch (error) {
    console.error('Error loading statistics:', error);
  }
};

const openNewDeadline = () => {
  deadlinesModalRef.value?.openModal();
};

const onDeadlineSaved = () => {
  deadlinesListRef.value?.loadDeadlines();
  loadStatistics();
};

const updateStats = (newStats: any) => {
  if (newStats) {
    Object.assign(stats.value, newStats);
  }
};
</script>

<style scoped>
.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

.bg-opacity-10 {
  --bs-bg-opacity: 0.1;
}
</style>