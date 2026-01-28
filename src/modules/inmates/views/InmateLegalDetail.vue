<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <h3 class="fw-bold m-0">{{ $t('inmates.legalDetail.title') }}</h3>
      </div>
      <div class="card-toolbar">
        <router-link :to="`/inmates/${inmateId}`" class="btn btn-light-secondary me-3">
          <i class="ki-duotone ki-arrow-left fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          {{ $t('inmates.legalDetail.backToProfile') }}
        </router-link>
      </div>
    </div>

    <div class="card-body pt-0">
      <!-- Legal Tabs Navigation -->
      <ul class="nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-5 fs-6">
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'profile' }"
            @click="activeTab = 'profile'"
            href="#"
          >
            <i class="ki-duotone ki-user fs-2 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            {{ $t('inmates.legalDetail.tabs.legalProfile') }}
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'crimes' }"
            @click="activeTab = 'crimes'"
            href="#"
          >
            <i class="ki-duotone ki-shield-cross fs-2 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            {{ $t('inmates.legalDetail.tabs.crimes') }}
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'hearings' }"
            @click="activeTab = 'hearings'"
            href="#"
          >
            <i class="ki-duotone ki-calendar fs-2 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            {{ $t('inmates.legalDetail.tabs.hearings') }}
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'resolutions' }"
            @click="activeTab = 'resolutions'"
            href="#"
          >
            <i class="ki-duotone ki-document fs-2 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            {{ $t('inmates.legalDetail.tabs.resolutions') }}
          </a>
        </li>
      </ul>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Legal Profile Tab -->
        <div v-if="activeTab === 'profile'" class="tab-pane fade show active">
          <h4 class="mb-4">{{ $t('inmates.legalDetail.profile.title') }}</h4>
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{ $t('inmates.legalDetail.profile.loading') }}</span>
            </div>
          </div>
          <div v-else-if="legalProfile" class="row g-5">
            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.legalDetail.profile.caseNumber') }}</label>
              <p>{{ legalProfile.case_number || $t('inmates.legalDetail.profile.notSpecified') }}</p>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.legalDetail.profile.legalStatus') }}</label>
              <p>{{ legalProfile.legal_status || $t('inmates.legalDetail.profile.notSpecified') }}</p>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.legalDetail.profile.proceduralStatus') }}</label>
              <p>{{ legalProfile.procedural_status?.name || $t('inmates.legalDetail.profile.notSpecified') }}</p>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold">{{ $t('inmates.legalDetail.profile.court') }}</label>
              <p>{{ legalProfile.court?.name || $t('inmates.legalDetail.profile.notSpecified') }}</p>
            </div>
          </div>
          <div v-else class="alert alert-info">
            {{ $t('inmates.legalDetail.profile.noInfo') }}
          </div>
        </div>

        <!-- Crimes Tab -->
        <div v-if="activeTab === 'crimes'" class="tab-pane fade show active">
          <h4 class="mb-4">{{ $t('inmates.legalDetail.crimes.title') }}</h4>
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{ $t('inmates.legalDetail.crimes.loading') }}</span>
            </div>
          </div>
          <div v-else-if="crimes && crimes.length > 0">
            <div class="table-responsive">
              <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th>{{ $t('inmates.legalDetail.crimes.table.crime') }}</th>
                    <th>{{ $t('inmates.legalDetail.crimes.table.classification') }}</th>
                    <th>{{ $t('inmates.legalDetail.crimes.table.date') }}</th>
                    <th>{{ $t('inmates.legalDetail.crimes.table.status') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="crime in crimes" :key="crime.id">
                    <td>{{ crime.crime?.name || $t('inmates.legalDetail.crimes.notSpecified') }}</td>
                    <td>{{ crime.crime?.classification || '-' }}</td>
                    <td>{{ formatDate(crime.created_at) }}</td>
                    <td>
                      <span class="badge badge-light-primary">{{ crime.status || $t('inmates.legalDetail.crimes.active') }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="alert alert-info">
            {{ $t('inmates.legalDetail.crimes.noData') }}
          </div>
        </div>

        <!-- Hearings Tab -->
        <div v-if="activeTab === 'hearings'" class="tab-pane fade show active">
          <h4 class="mb-4">{{ $t('inmates.legalDetail.hearings.title') }}</h4>
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{ $t('inmates.legalDetail.hearings.loading') }}</span>
            </div>
          </div>
          <div v-else-if="hearings && hearings.length > 0">
            <div class="table-responsive">
              <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th>{{ $t('inmates.legalDetail.hearings.table.date') }}</th>
                    <th>{{ $t('inmates.legalDetail.hearings.table.type') }}</th>
                    <th>{{ $t('inmates.legalDetail.hearings.table.court') }}</th>
                    <th>{{ $t('inmates.legalDetail.hearings.table.status') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="hearing in hearings" :key="hearing.id">
                    <td>{{ formatDate(hearing.hearing_date) }}</td>
                    <td>{{ hearing.hearing_type || $t('inmates.legalDetail.hearings.notSpecified') }}</td>
                    <td>{{ hearing.court?.name || '-' }}</td>
                    <td>
                      <span :class="`badge badge-light-${getStatusColor(hearing.status)}`">
                        {{ hearing.status || $t('inmates.legalDetail.hearings.pending') }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="alert alert-info">
            {{ $t('inmates.legalDetail.hearings.noData') }}
          </div>
        </div>

        <!-- Resolutions Tab -->
        <div v-if="activeTab === 'resolutions'" class="tab-pane fade show active">
          <h4 class="mb-4">{{ $t('inmates.legalDetail.resolutions.title') }}</h4>
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{ $t('inmates.legalDetail.resolutions.loading') }}</span>
            </div>
          </div>
          <div v-else-if="resolutions && resolutions.length > 0">
            <div class="table-responsive">
              <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th>{{ $t('inmates.legalDetail.resolutions.table.date') }}</th>
                    <th>{{ $t('inmates.legalDetail.resolutions.table.type') }}</th>
                    <th>{{ $t('inmates.legalDetail.resolutions.table.description') }}</th>
                    <th>{{ $t('inmates.legalDetail.resolutions.table.court') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="resolution in resolutions" :key="resolution.id">
                    <td>{{ formatDate(resolution.resolution_date) }}</td>
                    <td>{{ resolution.resolution_type || $t('inmates.legalDetail.resolutions.notSpecified') }}</td>
                    <td>{{ resolution.description || '-' }}</td>
                    <td>{{ resolution.court?.name || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="alert alert-info">
            {{ $t('inmates.legalDetail.resolutions.noData') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ApiService from '@/core/services/ApiService';

const { t } = useI18n();
const route = useRoute();
const inmateId = computed(() => route.params.id);
const activeTab = ref('profile');
const loading = ref(false);

const legalProfile = ref<any>(null);
const crimes = ref<any[]>([]);
const hearings = ref<any[]>([]);
const resolutions = ref<any[]>([]);

const formatDate = (date: string) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('es-GT');
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'completado':
      return 'success';
    case 'pending':
    case 'pendiente':
      return 'warning';
    case 'cancelled':
    case 'cancelado':
      return 'danger';
    default:
      return 'info';
  }
};

const loadLegalData = async () => {
  loading.value = true;
  try {
    // Load legal profile
    const profileResponse = await ApiService.get(`/inmates/${inmateId.value}/legal-profile`);
    legalProfile.value = profileResponse.data.data;

    // Load crimes
    const crimesResponse = await ApiService.get(`/inmates/${inmateId.value}/crimes`);
    crimes.value = crimesResponse.data.data || [];

    // Load hearings
    const hearingsResponse = await ApiService.get(`/inmates/${inmateId.value}/hearings`);
    hearings.value = hearingsResponse.data.data || [];

    // Load resolutions
    const resolutionsResponse = await ApiService.get(`/inmates/${inmateId.value}/resolutions`);
    resolutions.value = resolutionsResponse.data.data || [];
  } catch (error) {
    console.error('Error loading legal data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const section = route.params.section as string;
  if (section) {
    activeTab.value = section;
  }
  loadLegalData();
});
</script>

<style scoped>
.nav-line-tabs .nav-link {
  cursor: pointer;
}

.nav-line-tabs .nav-link.active {
  color: var(--kt-primary);
  border-bottom-color: var(--kt-primary);
}
</style>