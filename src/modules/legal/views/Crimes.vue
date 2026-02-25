<template>
  <div class="legal-crimes-page">
    <!-- Page header -->
    <div class="row g-5 g-xl-10 mb-5">
      <div class="col-12">
        <div class="card">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">{{ t('legal.crimes.title') }}</span>
              <span class="text-muted mt-1 fw-semibold fs-7">{{ t('legal.crimes.subtitle') }}</span>
            </h3>
            <div class="card-toolbar">
              <!-- Search -->
              <div class="d-flex align-items-center position-relative my-1 me-3">
                <KTIcon
                  icon-name="magnifier"
                  icon-class="fs-1 position-absolute ms-6"
                />
                <input
                  type="text"
                  v-model="searchQuery"
                  @input="handleSearch"
                  class="form-control form-control-solid w-250px ps-15"
                  :placeholder="t('common.search')"
                />
              </div>
              
              <!-- Filter by inmate -->
              <div class="me-3" style="min-width: 250px;">
                <Multiselect
                  v-model="selectedInmate"
                  :options="inmatesOptions"
                  :searchable="true"
                  :placeholder="t('legal.crimes.allInmates')"
                  noOptionsText="No hay opciones disponibles"
                  noResultsText="No se encontraron resultados"
                  label="label"
                  valueProp="value"
                  :canClear="true"
                  @select="handleFilter"
                  @clear="handleFilter"
                />
              </div>

              <!-- Filter by crime type -->
              <div class="me-3" style="min-width: 250px;">
                <Multiselect
                  v-model="selectedCrimeType"
                  :options="crimesOptions"
                  :searchable="true"
                  :placeholder="t('legal.crimes.allCrimeTypes')"
                  noOptionsText="No hay opciones disponibles"
                  noResultsText="No se encontraron resultados"
                  label="label"
                  valueProp="value"
                  :canClear="true"
                  @select="handleFilter"
                  @clear="handleFilter"
                />
              </div>

              <!-- Filter by violence level -->
              <div class="me-3">
                <select
                  v-model="selectedViolenceLevel"
                  @change="handleFilter"
                  class="form-select form-select-solid"
                >
                  <option value="">{{ t('legal.crimes.allViolenceLevels') }}</option>
                  <option value="none">{{ t('legal.crimes.violenceLevels.none') }}</option>
                  <option value="low">{{ t('legal.crimes.violenceLevels.low') }}</option>
                  <option value="medium">{{ t('legal.crimes.violenceLevels.medium') }}</option>
                  <option value="high">{{ t('legal.crimes.violenceLevels.high') }}</option>
                  <option value="extreme">{{ t('legal.crimes.violenceLevels.extreme') }}</option>
                </select>
              </div>
              
              <!-- Actions -->
              <button
                type="button"
                class="btn btn-primary"
                @click="openCreateModal"
              >
                <KTIcon icon-name="plus" icon-class="fs-2" />
                {{ t('legal.crimes.newCrime') }}
              </button>
            </div>
          </div>
          
          <div class="card-body py-3">
            <!-- Statistics Cards -->
            <div class="row g-5 mb-5">
              <div class="col-md-3">
                <div class="card card-bordered">
                  <div class="card-body">
                    <div class="d-flex align-items-center">
                      <KTIcon icon-name="shield-cross" icon-class="fs-2x text-danger me-4" />
                      <div>
                        <div class="fs-4 fw-bold text-gray-900">{{ statistics.total }}</div>
                        <div class="fs-7 text-muted">{{ t('legal.crimes.stats.totalCrimes') }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card card-bordered">
                  <div class="card-body">
                    <div class="d-flex align-items-center">
                      <KTIcon icon-name="warning" icon-class="fs-2x text-warning me-4" />
                      <div>
                        <div class="fs-4 fw-bold text-gray-900">{{ statistics.violent }}</div>
                        <div class="fs-7 text-muted">{{ t('legal.crimes.stats.violentCrimes') }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card card-bordered">
                  <div class="card-body">
                    <div class="d-flex align-items-center">
                      <KTIcon icon-name="people" icon-class="fs-2x text-info me-4" />
                      <div>
                        <div class="fs-4 fw-bold text-gray-900">{{ statistics.organized }}</div>
                        <div class="fs-7 text-muted">{{ t('legal.crimes.stats.organizedCrime') }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card card-bordered">
                  <div class="card-body">
                    <div class="d-flex align-items-center">
                      <KTIcon icon-name="arrow-circle" icon-class="fs-2x text-success me-4" />
                      <div>
                        <div class="fs-4 fw-bold text-gray-900">{{ statistics.reoffenders }}</div>
                        <div class="fs-7 text-muted">{{ t('legal.crimes.stats.reoffenders') }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Table loading -->
            <div v-if="loading" class="d-flex justify-content-center py-10">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">{{ t('common.loading') }}</span>
              </div>
            </div>

            <!-- Table -->
            <div v-else-if="crimes.length > 0" class="table-responsive">
              <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th class="min-w-150px">{{ t('legal.crimes.inmate') }}</th>
                    <th class="min-w-150px">{{ t('legal.crimes.crime') }}</th>
                    <th class="min-w-100px">{{ t('legal.crimes.classification') }}</th>
                    <th class="min-w-100px">{{ t('legal.crimes.violenceLevel') }}</th>
                    <th class="min-w-100px">{{ t('legal.crimes.crimeDate') }}</th>
                    <th class="min-w-150px">{{ t('legal.crimes.sentence') }}</th>
                    <th class="min-w-100px">{{ t('legal.crimes.status') }}</th>
                    <th class="min-w-100px text-end">{{ t('common.actions.title') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="crime in crimes" :key="crime.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="symbol symbol-45px me-5" v-if="crime.inmate">
                          <img
                            :src="crime.inmate?.photo_url || getAssetPath('media/avatars/blank.png')"
                            :alt="getInmateName(crime.inmate)"
                          />
                        </div>
                        <div class="d-flex justify-content-start flex-column">
                          <a
                            href="#"
                            class="text-gray-900 fw-bold text-hover-primary fs-6"
                            @click.prevent="crime.inmate?.id && viewInmateDetail(crime.inmate.id)"
                          >
                            {{ getInmateName(crime.inmate) }}
                          </a>
                          <span class="text-muted fw-semibold text-muted d-block fs-7">
                            {{ crime.inmate?.inmate_number || '-' }}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex flex-column">
                        <span class="text-gray-900 fw-bold fs-6">
                          {{ crime.crime?.name || '-' }}
                        </span>
                        <span class="text-muted fs-7">
                          {{ crime.crime?.code || '-' }}
                        </span>
                        <span v-if="crime.is_main || crime.is_primary_crime" class="badge badge-light-primary mt-1">
                          {{ t('legal.crimes.primaryCrime') }}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span 
                        class="badge"
                        :class="getClassificationBadgeClass(crime.crime_classification_id)"
                      >
                        {{ getClassificationName(crime.crime_classification_id) }}
                      </span>
                    </td>
                    <td>
                      <span 
                        class="badge"
                        :class="getViolenceLevelBadgeClass(crime.violence_level)"
                      >
                        {{ getViolenceLevelLabel(crime.violence_level) }}
                      </span>
                    </td>
                    <td>
                      <span class="text-gray-900 fw-bold d-block fs-6">
                        {{ formatDate(crime.crime_date) }}
                      </span>
                      <span class="text-muted fs-7">
                        {{ crime.crime_location || '-' }}
                      </span>
                    </td>
                    <td>
                      <div class="d-flex flex-column">
                        <span class="text-gray-900 fw-bold fs-6">
                          {{ getSentenceSummary(crime) }}
                        </span>
                        <span v-if="crime.fine_amount" class="text-muted fs-7">
                          {{ t('legal.crimes.fine') }}: Q{{ formatCurrency(crime.fine_amount) }}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span 
                        class="badge"
                        :class="getStatusBadgeClass(crime.status)"
                      >
                        {{ getStatusLabel(crime.status) }}
                      </span>
                      <div v-if="crime.criminal_organization_involved" class="mt-1">
                        <span class="badge badge-light-danger">
                          <KTIcon icon-name="people" icon-class="fs-7" />
                          {{ t('legal.crimes.organizedCrimeInvolved') }}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex justify-content-end flex-shrink-0">
                        <a
                          href="#"
                          class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                          @click.prevent="viewCrime(crime)"
                        >
                          <KTIcon icon-name="eye" icon-class="fs-3" />
                        </a>
                        <a
                          href="#"
                          class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                          @click.prevent="editCrime(crime)"
                        >
                          <KTIcon icon-name="pencil" icon-class="fs-3" />
                        </a>
                        <a
                          href="#"
                          class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                          @click.prevent="deleteCrime(crime)"
                        >
                          <KTIcon icon-name="trash" icon-class="fs-3" />
                        </a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Empty state -->
            <div v-else class="text-center py-10">
              <img
                :src="getAssetPath('media/illustrations/sketchy-1/16.png')"
                class="mw-200px mb-5"
                alt=""
              />
              <div class="fw-semibold fs-6 text-gray-500">
                {{ t('legal.crimes.noCrimes') }}
              </div>
            </div>

            <!-- Pagination -->
            <div
              v-if="!loading && crimes.length > 0"
              class="d-flex justify-content-between align-items-center flex-wrap"
            >
              <div class="d-flex align-items-center">
                <span class="text-muted">
                  {{ t('common.showing') }} {{ (currentPage - 1) * perPage + 1 }} -
                  {{ Math.min(currentPage * perPage, total) }} {{ t('common.of') }} {{ total }}
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

    <!-- Crime Detail Modal -->
    <CrimeDetailModal
      v-if="showDetailModal"
      :crime="selectedCrime"
      @close="showDetailModal = false"
    />

    <!-- Crime Form Modal -->
    <CrimeFormModal
      v-if="showFormModal"
      :crime="selectedCrime"
      :mode="formMode"
      @close="closeFormModal"
      @saved="handleCrimeSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getAssetPath } from '@/core/helpers/assets';
import { useCatalogs } from '@/composables/useCatalogs';
import { useCatalogsStore } from '@/stores/catalogs';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import Multiselect from '@vueform/multiselect';
import CrimeDetailModal from '../components/CrimeDetailModal.vue';
import CrimeFormModal from '../components/CrimeFormModal.vue';

// Composables
const { t } = useI18n();
const router = useRouter();
const catalogsStore = useCatalogsStore();
const { crimesOptions, crimeClassificationsOptions } = useCatalogs();

// State
const loading = ref(false);
const crimes = ref<any[]>([]);
const searchQuery = ref('');
const selectedInmate = ref('');
const selectedCrimeType = ref('');
const selectedViolenceLevel = ref('');
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);
const totalPages = ref(0);
const showDetailModal = ref(false);
const showFormModal = ref(false);
const selectedCrime = ref<any>(null);
const formMode = ref<'create' | 'edit'>('create');

// Statistics
const statistics = ref({
  total: 0,
  violent: 0,
  organized: 0,
  reoffenders: 0
});

// Inmates options (to be loaded)
const inmatesOptions = ref<any[]>([]);

// Load catalogs on mount
const loadCatalogs = async () => {
  await catalogsStore.fetchMultipleCatalogs(['crimes', 'crime-classifications']);
  await loadInmates();
};

// Load inmates for filter
const loadInmates = async () => {
  try {
    const response = await ApiService.query('/inmates', { per_page: 1000 });
    // Handle paginated response structure
    let inmates = [];
    if (response.data && response.data.data) {
      // Check if it's a paginated response
      if (Array.isArray(response.data.data)) {
        inmates = response.data.data;
      } else if (response.data.data.data && Array.isArray(response.data.data.data)) {
        inmates = response.data.data.data;
      }
    } else if (response.data && Array.isArray(response.data)) {
      inmates = response.data;
    }
    
    inmatesOptions.value = inmates.map((inmate: any) => ({
      value: inmate.id,
      label: `${[inmate.first_name, inmate.middle_name, inmate.last_name, inmate.second_last_name].filter(Boolean).join(' ')} (${inmate.inmate_number})`
    }));
  } catch (error) {
    console.error('Error loading inmates:', error);
    // Continue without inmates list
    inmatesOptions.value = [];
  }
};

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
const loadCrimes = async () => {
  loading.value = true;
  try {
    const params: any = {
      page: currentPage.value,
      per_page: perPage.value,
    };
    
    // Add filters
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }
    if (selectedInmate.value) {
      params.inmate_id = selectedInmate.value;
    }
    if (selectedCrimeType.value) {
      params.crime_id = selectedCrimeType.value;
    }
    if (selectedViolenceLevel.value) {
      params.violence_level = selectedViolenceLevel.value;
    }
    
    const response = await ApiService.query('/inmate-crimes', params);
    
    if (response.data.success && response.data.data) {
      const responseData = response.data.data;
      crimes.value = responseData.data || [];
      total.value = responseData.total || 0;
      totalPages.value = responseData.last_page || 1;
      currentPage.value = responseData.current_page || currentPage.value;
    }
    
    // Load statistics
    await loadStatistics();
  } catch (error) {
    console.error('Error loading crimes:', error);
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: t('legal.crimes.loadError'),
    });
  } finally {
    loading.value = false;
  }
};

const loadStatistics = async () => {
  try {
    const response = await ApiService.get('/inmate-crimes/statistics');
    if (response.data.success) {
      const stats = response.data.data;
      statistics.value = {
        total: stats.total_crimes || 0,
        violent: stats.violent_crimes_count || 0,
        organized: stats.organized_crimes_count || 0,
        reoffenders: stats.reoffenders_count || 0
      };
    }
  } catch (error) {
    console.error('Error loading statistics:', error);
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  loadCrimes();
};

const handleFilter = () => {
  currentPage.value = 1;
  loadCrimes();
};

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadCrimes();
  }
};

const formatDate = (date: string) => {
  if (!date) return '-';
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    return dateObj.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    return '-';
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const getInmateName = (inmate: any) => {
  if (!inmate) return 'Sin asignar';
  return [inmate.first_name, inmate.middle_name, inmate.last_name, inmate.second_last_name].filter(Boolean).join(' ') || 'Sin nombre';
};

const getClassificationName = (classificationId: number) => {
  const classification = crimeClassificationsOptions.value.find(c => c.value === classificationId);
  return classification?.label || 'Sin clasificar';
};

const getClassificationBadgeClass = (classificationId: number) => {
  // Map classification to badge class based on severity
  return 'badge-light-warning';
};

const getViolenceLevelLabel = (level: string) => {
  if (!level) return '-';
  // Only try to translate if we have a valid level
  const validLevels = ['none', 'low', 'medium', 'high', 'extreme'];
  if (validLevels.includes(level)) {
    return t(`legal.crimes.violenceLevels.${level}`);
  }
  return level;
};

const getViolenceLevelBadgeClass = (level: string) => {
  if (!level) return 'badge-light-secondary';
  const classes: Record<string, string> = {
    'none': 'badge-light-success',
    'low': 'badge-light-info',
    'medium': 'badge-light-warning',
    'high': 'badge-light-danger',
    'extreme': 'badge-light-dark'
  };
  return classes[level] || 'badge-light-secondary';
};

const getStatusLabel = (status: string) => {
  if (!status) return '-';
  // Only try to translate if we have a valid status
  const validStatuses = ['active', 'pending', 'resolved', 'dismissed'];
  if (validStatuses.includes(status)) {
    return t(`legal.crimes.statuses.${status}`);
  }
  return status;
};

const getStatusBadgeClass = (status: string) => {
  if (!status) return 'badge-light-secondary';
  const classes: Record<string, string> = {
    'active': 'badge-light-primary',
    'pending': 'badge-light-warning',
    'resolved': 'badge-light-success',
    'dismissed': 'badge-light-secondary'
  };
  return classes[status] || 'badge-light-secondary';
};

const getSentenceSummary = (crime: any) => {
  if (!crime.sentence_years && !crime.sentence_months && !crime.sentence_days) {
    return t('legal.crimes.noSentence');
  }
  
  const parts = [];
  if (crime.sentence_years) parts.push(`${crime.sentence_years} ${t('legal.crimes.years')}`);
  if (crime.sentence_months) parts.push(`${crime.sentence_months} ${t('legal.crimes.months')}`);
  if (crime.sentence_days) parts.push(`${crime.sentence_days} ${t('legal.crimes.days')}`);
  
  return parts.join(', ');
};

const viewInmateDetail = (inmateId: number) => {
  router.push({ name: 'inmates-detail', params: { id: inmateId } });
};

const viewCrime = (crime: any) => {
  selectedCrime.value = crime;
  showDetailModal.value = true;
};

const openCreateModal = () => {
  selectedCrime.value = null;
  formMode.value = 'create';
  showFormModal.value = true;
};

const editCrime = (crime: any) => {
  selectedCrime.value = crime;
  formMode.value = 'edit';
  showFormModal.value = true;
};

const closeFormModal = () => {
  showFormModal.value = false;
  selectedCrime.value = null;
};

const handleCrimeSaved = () => {
  closeFormModal();
  loadCrimes();
  Swal.fire({
    icon: 'success',
    title: t('common.success'),
    text: formMode.value === 'create' 
      ? t('legal.crimes.createSuccess') 
      : t('legal.crimes.updateSuccess'),
    timer: 2000,
    showConfirmButton: false
  });
};

const deleteCrime = async (crime: any) => {
  const result = await Swal.fire({
    title: t('common.confirmDelete'),
    text: t('legal.crimes.confirmDeleteMessage'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: t('common.actions.delete'),
    cancelButtonText: t('common.actions.cancel')
  });
  
  if (result.isConfirmed) {
    try {
      await ApiService.delete(`/inmate-crimes/${crime.id}`);
      await loadCrimes();
      Swal.fire({
        icon: 'success',
        title: t('common.deleted'),
        text: t('legal.crimes.deleteSuccess'),
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('legal.crimes.deleteError')
      });
    }
  }
};

// Lifecycle
onMounted(async () => {
  await loadCatalogs();
  await loadCrimes();
});
</script>