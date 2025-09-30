<template>
  <ModuleListTemplate
    :title="t('medical.profiles.title')"
    :subtitle="t('medical.profiles.subtitle')"
    :items="profiles"
    :loading="loading"
    :total="total"
    :current-page="currentPage"
    :per-page="perPage"
    :show-create-button="false"
    :empty-state-text="t('medical.profiles.noProfiles')"
    @search="handleSearch"
    @change-page="changePage"
  >
    <!-- Custom filters -->
    <template #filters>
      <!-- Filter by center -->
      <div class="me-3">
        <select
          v-model="selectedCenter"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('medical.profiles.allCenters') }}</option>
          <option
            v-for="center in centersOptions"
            :key="center.value"
            :value="center.value"
          >
            {{ center.label }}
          </option>
        </select>
      </div>

      <!-- Filter by blood type -->
      <div class="me-3">
        <select
          v-model="selectedBloodType"
          @change="handleFilter"
          class="form-select form-select-solid"
        >
          <option value="">{{ t('medical.profiles.allBloodTypes') }}</option>
          <option
            v-for="bloodType in bloodTypesOptions"
            :key="bloodType.value"
            :value="bloodType.value"
          >
            {{ bloodType.label }}
          </option>
        </select>
      </div>
    </template>

    <!-- Custom actions -->
    <template #actions>
      <button
        type="button"
        class="btn btn-light-primary me-3"
        @click="handleEmergencyList"
      >
        <KTIcon icon-name="shield-cross" icon-class="fs-2" />
        {{ t('medical.profiles.emergencyList') }}
      </button>
      <button
        type="button"
        class="btn btn-primary"
        @click="handleExport"
      >
        <KTIcon icon-name="exit-up" icon-class="fs-2" />
        {{ t('common.export') }}
      </button>
    </template>

    <!-- Table headers -->
    <template #table-headers>
      <th class="min-w-150px">{{ t('medical.profiles.inmate') }}</th>
      <th class="min-w-100px">{{ t('medical.profiles.registryNumber') }}</th>
      <th class="min-w-100px">{{ t('medical.profiles.bloodType') }}</th>
      <th class="min-w-150px">{{ t('medical.profiles.chronicDiseases') }}</th>
      <th class="min-w-100px">{{ t('medical.profiles.allergies') }}</th>
      <th class="min-w-100px">{{ t('medical.profiles.lastCheckup') }}</th>
      <th class="min-w-100px">{{ t('medical.profiles.status') }}</th>
      <th class="min-w-100px text-end">{{ t('common.actions.title') }}</th>
    </template>

    <!-- Table body -->
    <template #table-body="{ items }">
      <tr v-for="profile in items" :key="profile.id">
        <td>
          <div class="d-flex align-items-center">
            <div class="symbol symbol-45px me-5">
              <img
                :src="profile.inmate.photo_url || getAssetPath('media/avatars/blank.png')"
                :alt="profile.inmate.full_name"
              />
            </div>
            <div class="d-flex justify-content-start flex-column">
              <a
                href="#"
                class="text-gray-900 fw-bold text-hover-primary fs-6"
                @click.prevent="viewInmateDetail(profile.inmate_id)"
              >
                {{ profile.inmate.full_name }}
              </a>
              <span class="text-muted fw-semibold text-muted d-block fs-7">
                {{ profile.inmate.document_number }}
              </span>
            </div>
          </div>
        </td>
        <td>
          <span class="text-gray-900 fw-bold d-block fs-6">
            {{ profile.inmate.registry_number }}
          </span>
        </td>
        <td>
          <span class="badge badge-light-info">
            {{ getBloodTypeName(profile.blood_type_id) }}
          </span>
        </td>
        <td>
          <div class="d-flex flex-column">
            <span
              v-for="(disease, index) in profile.chronic_diseases.slice(0, 2)"
              :key="index"
              class="text-gray-900 fs-7"
            >
              {{ disease.name }}
            </span>
            <span
              v-if="profile.chronic_diseases.length > 2"
              class="text-muted fs-7"
            >
              +{{ profile.chronic_diseases.length - 2 }} {{ t('common.more') }}
            </span>
            <span v-if="profile.chronic_diseases.length === 0" class="text-muted fs-7">
              {{ t('medical.profiles.none') }}
            </span>
          </div>
        </td>
        <td>
          <div class="d-flex flex-column">
            <span
              v-for="(allergy, index) in profile.allergies.slice(0, 2)"
              :key="index"
              class="text-gray-900 fs-7"
            >
              {{ allergy.name }}
            </span>
            <span
              v-if="profile.allergies.length > 2"
              class="text-muted fs-7"
            >
              +{{ profile.allergies.length - 2 }} {{ t('common.more') }}
            </span>
            <span v-if="profile.allergies.length === 0" class="text-muted fs-7">
              {{ t('medical.profiles.none') }}
            </span>
          </div>
        </td>
        <td>
          <span class="text-gray-900 fw-bold d-block fs-6">
            {{ formatDate(profile.last_checkup_date) }}
          </span>
        </td>
        <td>
          <span
            class="badge"
            :class="getHealthStatusBadgeClass(profile.health_status)"
          >
            {{ getHealthStatusLabel(profile.health_status) }}
          </span>
        </td>
        <td>
          <div class="d-flex justify-content-end flex-shrink-0">
            <a
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click.prevent="viewProfile(profile.id)"
            >
              <KTIcon icon-name="eye" icon-class="fs-3" />
            </a>
            <a
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click.prevent="editProfile(profile.id)"
            >
              <KTIcon icon-name="pencil" icon-class="fs-3" />
            </a>
            <a
              href="#"
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
              @click.prevent="viewMedicalHistory(profile.id)"
            >
              <KTIcon icon-name="time" icon-class="fs-3" />
            </a>
          </div>
        </td>
      </tr>
    </template>
  </ModuleListTemplate>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getAssetPath } from '@/core/helpers/assets';
import { useCatalogs } from '@/composables/useCatalogs';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import ModuleListTemplate from '@/components/templates/ModuleListTemplate.vue';

// Composables
const { t } = useI18n();
const router = useRouter();
const { centersOptions, bloodTypesOptions, getCatalogById } = useCatalogs();

// State
const loading = ref(false);
const profiles = ref<any[]>([]);
const searchQuery = ref('');
const selectedCenter = ref('');
const selectedBloodType = ref('');
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);

// Methods
const loadProfiles = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get('/medical/profiles', {
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        search: searchQuery.value,
        center_id: selectedCenter.value,
        blood_type_id: selectedBloodType.value,
      },
    });
    
    profiles.value = response.data.data;
    total.value = response.data.total;
  } catch (error) {
    console.error('Error loading medical profiles:', error);
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: t('medical.profiles.loadError'),
    });
  } finally {
    loading.value = false;
  }
};

const handleSearch = (query: string) => {
  searchQuery.value = query;
  currentPage.value = 1;
  loadProfiles();
};

const handleFilter = () => {
  currentPage.value = 1;
  loadProfiles();
};

const changePage = (page: number) => {
  currentPage.value = page;
  loadProfiles();
};

const formatDate = (date: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString();
};

const getBloodTypeName = (bloodTypeId: number) => {
  const bloodType = getCatalogById('blood-types', bloodTypeId);
  return bloodType?.name || '-';
};

const getHealthStatusLabel = (status: string) => {
  const statusLabels: Record<string, string> = {
    'stable': t('medical.profiles.status.stable'),
    'monitoring': t('medical.profiles.status.monitoring'),
    'critical': t('medical.profiles.status.critical'),
    'recovery': t('medical.profiles.status.recovery'),
  };
  
  return statusLabels[status] || status;
};

const getHealthStatusBadgeClass = (status: string) => {
  const badgeClasses: Record<string, string> = {
    'stable': 'badge-light-success',
    'monitoring': 'badge-light-warning',
    'critical': 'badge-light-danger',
    'recovery': 'badge-light-info',
  };
  
  return badgeClasses[status] || 'badge-light-secondary';
};

const viewInmateDetail = (inmateId: number) => {
  router.push({ name: 'inmates-detail', params: { id: inmateId } });
};

const viewProfile = (profileId: number) => {
  router.push({ name: 'medical-profile-detail', params: { id: profileId } });
};

const editProfile = (profileId: number) => {
  router.push({ name: 'medical-profile-edit', params: { id: profileId } });
};

const viewMedicalHistory = (profileId: number) => {
  router.push({ name: 'medical-history', params: { id: profileId } });
};

const handleEmergencyList = () => {
  router.push({ name: 'medical-emergencies' });
};

const handleExport = async () => {
  try {
    const response = await ApiService.get('/medical/profiles/export', {
      params: {
        search: searchQuery.value,
        center_id: selectedCenter.value,
        blood_type_id: selectedBloodType.value,
      },
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `medical-profiles-${new Date().toISOString()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    Swal.fire({
      icon: 'success',
      title: t('common.success'),
      text: t('medical.profiles.exportSuccess'),
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error('Error exporting profiles:', error);
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: t('medical.profiles.exportError'),
    });
  }
};

// Lifecycle
onMounted(async () => {
  await loadProfiles();
});
</script>