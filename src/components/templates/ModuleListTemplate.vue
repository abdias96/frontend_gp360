<template>
  <div class="module-list-page">
    <!-- Page header -->
    <div class="row g-5 g-xl-10 mb-5">
      <div class="col-12">
        <div class="card">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">{{ title }}</span>
              <span class="text-muted mt-1 fw-semibold fs-7">{{ subtitle }}</span>
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
              
              <!-- Custom filters slot -->
              <slot name="filters"></slot>
              
              <!-- Actions slot -->
              <slot name="actions">
                <button
                  v-if="showCreateButton"
                  type="button"
                  class="btn btn-primary"
                  @click="handleCreate"
                >
                  <KTIcon icon-name="plus" icon-class="fs-2" />
                  {{ createButtonText || t('common.create') }}
                </button>
              </slot>
            </div>
          </div>
          
          <div class="card-body py-3">
            <!-- Table loading -->
            <div v-if="loading" class="d-flex justify-content-center py-10">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">{{ t('common.loading') }}</span>
              </div>
            </div>

            <!-- Table -->
            <div v-else-if="items.length > 0" class="table-responsive">
              <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                <thead>
                  <tr class="fw-bold text-muted">
                    <slot name="table-headers"></slot>
                  </tr>
                </thead>
                <tbody>
                  <slot name="table-body" :items="items"></slot>
                </tbody>
              </table>
            </div>

            <!-- Empty state -->
            <div v-else class="text-center py-10">
              <slot name="empty-state">
                <img
                  :src="getAssetPath('media/illustrations/sketchy-1/5.png')"
                  class="mw-200px mb-5"
                  alt=""
                />
                <div class="fw-semibold fs-6 text-gray-500">
                  {{ emptyStateText || t('common.noData') }}
                </div>
              </slot>
            </div>

            <!-- Pagination -->
            <div
              v-if="!loading && items.length > 0 && showPagination"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { getAssetPath } from '@/core/helpers/assets';

// Props
interface Props {
  title: string;
  subtitle?: string;
  items: any[];
  loading?: boolean;
  total?: number;
  perPage?: number;
  currentPage?: number;
  showPagination?: boolean;
  showCreateButton?: boolean;
  createButtonText?: string;
  emptyStateText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  total: 0,
  perPage: 10,
  currentPage: 1,
  showPagination: true,
  showCreateButton: true,
});

// Emits
const emit = defineEmits<{
  search: [query: string];
  changePage: [page: number];
  create: [];
}>();

// Composables
const { t } = useI18n();

// State
const searchQuery = ref('');

// Computed
const totalPages = computed(() => Math.ceil(props.total / props.perPage));

const displayedPages = computed(() => {
  const pages: number[] = [];
  const maxPages = 5;
  let start = Math.max(1, props.currentPage - 2);
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
const handleSearch = () => {
  emit('search', searchQuery.value);
};

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('changePage', page);
  }
};

const handleCreate = () => {
  emit('create');
};
</script>