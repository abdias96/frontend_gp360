<template>
  <div class="renap-photo-verification">
    <!-- Page Header -->
    <div class="row g-5 g-xl-10 mb-5">
      <div class="col-12">
        <div class="card">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">{{ $t('renap.photoVerification.title') }}</span>
              <span class="text-muted mt-1 fw-semibold fs-7">{{ $t('renap.photoVerification.subtitle') }}</span>
            </h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="row g-5 g-xl-10 mb-5">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t('renap.photoVerification.searchInmate') }}</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-8">
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-search"></i>
                  </span>
                  <input
                    v-model="searchQuery"
                    type="text"
                    class="form-control form-control-lg"
                    :placeholder="$t('renap.photoVerification.searchPlaceholder')"
                    @keyup.enter="searchInmate"
                  />
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="searchInmate"
                    :disabled="loading"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ $t('common.search') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Search Results -->
            <div v-if="searchResults.length > 0" class="mt-5">
              <h5>{{ $t('renap.photoVerification.searchResults') }}</h5>
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>{{ $t('inmates.identificationNumber') }}</th>
                      <th>{{ $t('inmates.fullName') }}</th>
                      <th>CUI</th>
                      <th>{{ $t('inmates.center') }}</th>
                      <th>{{ $t('common.actions') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="inmate in searchResults" :key="inmate.id">
                      <td>{{ inmate.identification_number }}</td>
                      <td>{{ inmate.full_name }}</td>
                      <td>{{ inmate.cui || '-' }}</td>
                      <td>{{ inmate.current_center?.name || '-' }}</td>
                      <td>
                        <button
                          type="button"
                          class="btn btn-sm btn-primary"
                          @click="selectInmate(inmate)"
                        >
                          <i class="fas fa-eye me-1"></i>
                          {{ $t('renap.photoVerification.verify') }}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Verification Content -->
    <div v-if="verificationData" class="row g-5 g-xl-10">
      <!-- Status Banner -->
      <div class="col-12">
        <div
          class="alert d-flex align-items-center p-5"
          :class="getStatusBannerClass(verificationData.verification_status)"
        >
          <i class="fs-2hx me-4" :class="getStatusIcon(verificationData.verification_status)"></i>
          <div class="d-flex flex-column">
            <h4 class="mb-1">{{ getStatusTitle(verificationData.verification_status) }}</h4>
            <span>{{ getStatusDescription(verificationData.verification_status) }}</span>
          </div>
          <div class="ms-auto">
            <button
              type="button"
              class="btn btn-light me-2"
              @click="refreshData"
              :disabled="refreshing"
            >
              <span v-if="refreshing" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="fas fa-sync-alt me-2"></i>
              {{ $t('renap.photoVerification.refresh') }}
            </button>
            <button
              v-if="verificationData.verification_status === 'potential_fraud'"
              type="button"
              class="btn btn-danger"
              @click="reportFraud"
            >
              <i class="fas fa-exclamation-triangle me-2"></i>
              {{ $t('renap.photoVerification.reportFraud') }}
            </button>
          </div>
        </div>
      </div>

      <!-- GP360 Data Column -->
      <div class="col-xl-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-database me-2 text-primary"></i>
              {{ $t('renap.photoVerification.gp360Data') }}
            </h3>
          </div>
          <div class="card-body">
            <!-- GP360 Photos Gallery -->
            <div class="mb-5">
              <h5>{{ $t('renap.photoVerification.photos') }}</h5>
              <div v-if="verificationData.gp360.photos?.length > 0" class="row g-3">
                <div
                  v-for="photo in verificationData.gp360.photos"
                  :key="photo.id"
                  class="col-4"
                >
                  <div class="position-relative">
                    <img
                      :src="photo.photo_data || photo.url"
                      :alt="photo.type"
                      class="img-fluid rounded cursor-pointer"
                      style="max-height: 150px; object-fit: cover; width: 100%;"
                      @click="openPhotoModal(photo.photo_data || photo.url)"
                    />
                    <span
                      v-if="photo.is_current"
                      class="badge badge-success position-absolute top-0 end-0 m-1"
                    >
                      {{ $t('renap.photoVerification.primary') }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-5 text-muted">
                <i class="fas fa-image fs-3x mb-3"></i>
                <p>{{ $t('renap.photoVerification.noPhotos') }}</p>
              </div>
            </div>

            <!-- GP360 Personal Data -->
            <div class="separator my-5"></div>
            <h5>{{ $t('renap.photoVerification.personalData') }}</h5>
            <div class="row">
              <DataField
                :label="$t('inmates.identificationNumber')"
                :value="verificationData.gp360.identification_number"
                class="col-md-6 mb-3"
              />
              <DataField
                :label="'CUI'"
                :value="verificationData.gp360.cui"
                class="col-md-6 mb-3"
              />
              <DataField
                :label="$t('inmates.firstName')"
                :value="verificationData.gp360.first_name"
                :hasDiscrepancy="hasDiscrepancy('Primer Nombre')"
                class="col-md-6 mb-3"
              />
              <DataField
                :label="$t('inmates.lastName')"
                :value="verificationData.gp360.last_name"
                :hasDiscrepancy="hasDiscrepancy('Primer Apellido')"
                class="col-md-6 mb-3"
              />
              <DataField
                :label="$t('inmates.secondLastName')"
                :value="verificationData.gp360.second_last_name"
                :hasDiscrepancy="hasDiscrepancy('Segundo Apellido')"
                class="col-md-6 mb-3"
              />
              <DataField
                :label="$t('inmates.birthDate')"
                :value="verificationData.gp360.birth_date"
                :hasDiscrepancy="hasDiscrepancy('Fecha Nacimiento')"
                class="col-md-6 mb-3"
              />
              <DataField
                :label="$t('inmates.gender')"
                :value="verificationData.gp360.gender"
                :hasDiscrepancy="hasDiscrepancy('Genero')"
                class="col-md-6 mb-3"
              />
              <DataField
                :label="$t('inmates.center')"
                :value="verificationData.gp360.current_center"
                class="col-md-6 mb-3"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- RENAP Data Column -->
      <div class="col-xl-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-id-card me-2 text-info"></i>
              {{ $t('renap.photoVerification.renapData') }}
            </h3>
            <div v-if="verificationData.renap?.cached_at" class="card-toolbar">
              <span class="badge badge-light-primary">
                {{ $t('renap.photoVerification.cachedDaysAgo', { days: verificationData.renap.cache_age_days }) }}
              </span>
            </div>
          </div>
          <div class="card-body">
            <template v-if="verificationData.renap">
              <!-- RENAP Photo -->
              <div class="mb-5">
                <h5>{{ $t('renap.photoVerification.officialPhoto') }}</h5>
                <div v-if="verificationData.renap.foto" class="text-center">
                  <img
                    :src="'data:image/jpeg;base64,' + verificationData.renap.foto"
                    alt="RENAP Photo"
                    class="img-fluid rounded cursor-pointer"
                    style="max-height: 200px;"
                    @click="openPhotoModal('data:image/jpeg;base64,' + verificationData.renap.foto)"
                  />
                </div>
                <div v-else class="text-center py-5 text-muted">
                  <i class="fas fa-user-slash fs-3x mb-3"></i>
                  <p>{{ $t('renap.photoVerification.noRenapPhoto') }}</p>
                </div>
              </div>

              <!-- RENAP Personal Data -->
              <div class="separator my-5"></div>
              <h5>{{ $t('renap.photoVerification.personalData') }}</h5>
              <div class="row">
                <DataField
                  :label="'CUI'"
                  :value="verificationData.renap.cui"
                  class="col-md-6 mb-3"
                />
                <DataField
                  :label="$t('inmates.firstName')"
                  :value="verificationData.renap.primer_nombre"
                  :hasDiscrepancy="hasDiscrepancy('Primer Nombre')"
                  class="col-md-6 mb-3"
                />
                <DataField
                  :label="$t('inmates.lastName')"
                  :value="verificationData.renap.primer_apellido"
                  :hasDiscrepancy="hasDiscrepancy('Primer Apellido')"
                  class="col-md-6 mb-3"
                />
                <DataField
                  :label="$t('inmates.secondLastName')"
                  :value="verificationData.renap.segundo_apellido"
                  :hasDiscrepancy="hasDiscrepancy('Segundo Apellido')"
                  class="col-md-6 mb-3"
                />
                <DataField
                  :label="$t('inmates.birthDate')"
                  :value="verificationData.renap.fecha_nacimiento"
                  :hasDiscrepancy="hasDiscrepancy('Fecha Nacimiento')"
                  class="col-md-6 mb-3"
                />
                <DataField
                  :label="$t('inmates.gender')"
                  :value="verificationData.renap.genero"
                  :hasDiscrepancy="hasDiscrepancy('Genero')"
                  class="col-md-6 mb-3"
                />
                <DataField
                  :label="$t('renap.photoVerification.nationality')"
                  :value="verificationData.renap.nacionalidad"
                  class="col-md-6 mb-3"
                />
                <DataField
                  :label="$t('renap.photoVerification.birthPlace')"
                  :value="`${verificationData.renap.municipio_nacimiento || ''}, ${verificationData.renap.departamento_nacimiento || ''}`"
                  class="col-md-6 mb-3"
                />
              </div>

              <!-- Deceased Warning -->
              <div v-if="verificationData.renap.fallecido" class="alert alert-dark mt-4">
                <i class="fas fa-skull me-2"></i>
                <strong>{{ $t('renap.photoVerification.deceasedAlert') }}</strong>
                <span v-if="verificationData.renap.fecha_defuncion">
                  - {{ verificationData.renap.fecha_defuncion }}
                </span>
              </div>
            </template>
            <template v-else>
              <div class="text-center py-10 text-muted">
                <i class="fas fa-exclamation-circle fs-3x mb-3"></i>
                <p>{{ $t('renap.photoVerification.noRenapData') }}</p>
                <p class="text-muted small">{{ $t('renap.photoVerification.noRenapDataHint') }}</p>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Discrepancies Table -->
      <div v-if="verificationData.discrepancies?.length > 0" class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-exclamation-triangle me-2 text-warning"></i>
              {{ $t('renap.photoVerification.discrepancies') }}
            </h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>{{ $t('renap.photoVerification.field') }}</th>
                    <th>{{ $t('renap.photoVerification.gp360Value') }}</th>
                    <th>{{ $t('renap.photoVerification.renapValue') }}</th>
                    <th>{{ $t('renap.photoVerification.severity') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(disc, index) in verificationData.discrepancies" :key="index">
                    <td>{{ disc.field }}</td>
                    <td>{{ disc.gp360_value || '-' }}</td>
                    <td>{{ disc.renap_value || '-' }}</td>
                    <td>
                      <span
                        class="badge"
                        :class="getSeverityBadgeClass(disc.severity)"
                      >
                        {{ getSeverityLabel(disc.severity) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Photo Modal -->
    <div
      ref="photoModal"
      class="modal fade"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-body p-0">
            <img
              v-if="selectedPhotoUrl"
              :src="selectedPhotoUrl"
              alt="Photo"
              class="img-fluid w-100"
            />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              {{ $t('common.close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Modal } from 'bootstrap';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import DataField from '@/components/common/DataField.vue';

const { t } = useI18n();

// State
const searchQuery = ref('');
const searchResults = ref<any[]>([]);
const loading = ref(false);
const refreshing = ref(false);
const selectedInmateId = ref<number | null>(null);
const verificationData = ref<any>(null);
const selectedPhotoUrl = ref<string | null>(null);
const photoModal = ref<HTMLElement | null>(null);
let photoModalInstance: Modal | null = null;

// Methods
const searchInmate = async () => {
  if (!searchQuery.value.trim()) {
    return;
  }

  loading.value = true;
  try {
    const response = await ApiService.get('/inmates/search', {
      params: { q: searchQuery.value }
    });
    searchResults.value = response.data.data || [];
  } catch (error) {
    console.error('Error searching inmates:', error);
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: t('renap.photoVerification.searchError')
    });
  } finally {
    loading.value = false;
  }
};

const selectInmate = async (inmate: any) => {
  selectedInmateId.value = inmate.id;
  searchResults.value = [];
  await loadVerificationData();
};

const loadVerificationData = async () => {
  if (!selectedInmateId.value) return;

  loading.value = true;
  try {
    const response = await ApiService.get(`/renap/verificacion-foto/${selectedInmateId.value}`);
    verificationData.value = response.data.data;
  } catch (error: any) {
    console.error('Error loading verification data:', error);
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: error.response?.data?.message || t('renap.photoVerification.loadError')
    });
  } finally {
    loading.value = false;
  }
};

const refreshData = async () => {
  if (!selectedInmateId.value) return;

  refreshing.value = true;
  try {
    const response = await ApiService.post(`/renap/verificacion-foto/${selectedInmateId.value}/refresh`);
    verificationData.value = response.data.data;
    Swal.fire({
      icon: 'success',
      title: t('common.success'),
      text: t('renap.photoVerification.refreshSuccess'),
      timer: 2000,
      showConfirmButton: false
    });
  } catch (error: any) {
    console.error('Error refreshing data:', error);
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: error.response?.data?.message || t('renap.photoVerification.refreshError')
    });
  } finally {
    refreshing.value = false;
  }
};

const reportFraud = async () => {
  const result = await Swal.fire({
    icon: 'warning',
    title: t('renap.photoVerification.reportFraudTitle'),
    text: t('renap.photoVerification.reportFraudConfirm'),
    showCancelButton: true,
    confirmButtonText: t('renap.photoVerification.confirmReport'),
    cancelButtonText: t('common.cancel'),
    confirmButtonColor: '#dc3545'
  });

  if (result.isConfirmed) {
    // TODO: Implement fraud report functionality
    Swal.fire({
      icon: 'info',
      title: t('renap.photoVerification.reportSubmitted'),
      text: t('renap.photoVerification.reportSubmittedDesc')
    });
  }
};

const hasDiscrepancy = (fieldName: string): boolean => {
  if (!verificationData.value?.discrepancies) return false;
  return verificationData.value.discrepancies.some(
    (d: any) => d.field.toLowerCase() === fieldName.toLowerCase()
  );
};

const openPhotoModal = (url: string) => {
  selectedPhotoUrl.value = url;
  if (photoModalInstance) {
    photoModalInstance.show();
  }
};

const getStatusBannerClass = (status: string): string => {
  const classes: Record<string, string> = {
    'verified': 'alert-success',
    'minor_discrepancies': 'alert-warning',
    'potential_fraud': 'alert-danger',
    'deceased_in_renap': 'alert-dark',
    'no_renap_data': 'alert-secondary'
  };
  return classes[status] || 'alert-secondary';
};

const getStatusIcon = (status: string): string => {
  const icons: Record<string, string> = {
    'verified': 'fas fa-check-circle text-success',
    'minor_discrepancies': 'fas fa-exclamation-circle text-warning',
    'potential_fraud': 'fas fa-times-circle text-danger',
    'deceased_in_renap': 'fas fa-skull text-dark',
    'no_renap_data': 'fas fa-question-circle text-secondary'
  };
  return icons[status] || 'fas fa-question-circle text-secondary';
};

const getStatusTitle = (status: string): string => {
  return t(`renap.photoVerification.status.${status}.title`);
};

const getStatusDescription = (status: string): string => {
  return t(`renap.photoVerification.status.${status}.description`);
};

const getSeverityBadgeClass = (severity: string): string => {
  const classes: Record<string, string> = {
    'critical': 'badge-danger',
    'high': 'badge-warning',
    'medium': 'badge-info',
    'low': 'badge-secondary'
  };
  return classes[severity] || 'badge-secondary';
};

const getSeverityLabel = (severity: string): string => {
  return t(`renap.photoVerification.severityLevels.${severity}`);
};

// Lifecycle
onMounted(() => {
  if (photoModal.value) {
    photoModalInstance = new Modal(photoModal.value);
  }
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
