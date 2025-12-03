<template>
  <div class="container-fluid">
    <!-- Page Header -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="h3 mb-0">Gestión de Apelaciones</h1>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item">
                  <RouterLink to="/dashboard">Inicio</RouterLink>
                </li>
                <li class="breadcrumb-item">Legal</li>
                <li class="breadcrumb-item active">Apelaciones</li>
              </ol>
            </nav>
          </div>
          <button
            v-if="canCreate"
            class="btn btn-primary"
            @click="openNewAppeal"
          >
            <i class="bi bi-plus-circle me-2"></i>
            Nueva Apelación
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
                <p class="text-muted mb-1">Total Apelaciones</p>
                <h3 class="mb-0">{{ stats.total }}</h3>
              </div>
              <div class="bg-primary bg-opacity-10 rounded-3 p-3">
                <i class="bi bi-file-earmark-text fs-3 text-primary"></i>
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
                <p class="text-muted mb-1">En Proceso</p>
                <h3 class="mb-0 text-warning">{{ stats.active }}</h3>
              </div>
              <div class="bg-warning bg-opacity-10 rounded-3 p-3">
                <i class="bi bi-hourglass-split fs-3 text-warning"></i>
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
                <p class="text-muted mb-1">Resueltas Favorable</p>
                <h3 class="mb-0 text-success">{{ stats.favorable }}</h3>
              </div>
              <div class="bg-success bg-opacity-10 rounded-3 p-3">
                <i class="bi bi-check-circle fs-3 text-success"></i>
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
                <p class="text-muted mb-1">Resueltas Desfavorable</p>
                <h3 class="mb-0 text-danger">{{ stats.unfavorable }}</h3>
              </div>
              <div class="bg-danger bg-opacity-10 rounded-3 p-3">
                <i class="bi bi-x-circle fs-3 text-danger"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appeals List Component -->
    <AppealsList ref="appealsListRef" @stats-updated="updateStats" />

    <!-- Appeals Modal -->
    <AppealsModal
      ref="appealsModalRef"
      :inmate-id="null"
      @saved="onAppealSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AppealsList from '@/components/legal/AppealsList.vue';
import AppealsModal from '@/components/legal/AppealsModal.vue';
import ApiService from '@/core/services/ApiService';

// Auth store for permission checks
const authStore = useAuthStore();

// Permission checks
const canCreate = computed(() => authStore.isSuperAdmin || authStore.hasPermission('legal.appeals.create'));

const appealsListRef = ref<InstanceType<typeof AppealsList>>();
const appealsModalRef = ref<InstanceType<typeof AppealsModal>>();

const stats = ref({
  total: 0,
  active: 0,
  favorable: 0,
  unfavorable: 0
});

onMounted(async () => {
  await loadStatistics();
});

const loadStatistics = async () => {
  try {
    const response = await ApiService.get('/legal/appeals', {
      params: { per_page: 1 }
    });

    if (response.data.success) {
      // Calculate statistics from the paginated response
      const data = response.data.data;
      stats.value.total = data.total || 0;

      // We would need a separate endpoint for detailed stats
      // For now, we'll show the total and leave others at 0
      // These would be populated from a dedicated statistics endpoint
    }
  } catch (error) {
    console.error('Error loading statistics:', error);
  }
};

const openNewAppeal = () => {
  appealsModalRef.value?.openModal();
};

const onAppealSaved = () => {
  appealsListRef.value?.loadAppeals();
  loadStatistics();
};

const updateStats = (newStats: any) => {
  if (newStats) {
    Object.assign(stats.value, newStats);
  }
};
</script>
