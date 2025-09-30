<template>
  <div class="container-fluid">
    <!-- Header -->
    <div class="d-flex flex-column">
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        {{ $t("reports.systemLogs.title") }}
      </h1>
      <div class="text-muted fw-semibold fs-7">
        {{ $t("reports.systemLogs.subtitle") }}
      </div>
    </div>

    <!-- Filters Card -->
    <div class="card mt-5">
      <div class="card-header">
        <h3 class="card-title">{{ $t("reports.filters") }}</h3>
        <div class="card-toolbar">
          <button
            @click="generateReport"
            class="btn btn-primary"
            :disabled="loading"
          >
            <i class="bi bi-arrow-clockwise me-1"></i>
            {{ $t("reports.refresh") }}
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <!-- Date Range -->
          <div class="col-md-3">
            <label class="form-label">{{ $t("reports.dateRange") }}</label>
            <select
              v-model="filters.dateRange"
              class="form-select"
              @change="updateCustomDates"
            >
              <option value="today">{{ $t("reports.today") }}</option>
              <option value="yesterday">{{ $t("reports.yesterday") }}</option>
              <option value="last7days">{{ $t("reports.last7days") }}</option>
              <option value="last30days">{{ $t("reports.last30days") }}</option>
              <option value="custom">{{ $t("reports.custom") }}</option>
            </select>
          </div>

          <!-- Log Level -->
          <div class="col-md-3">
            <label class="form-label">{{ $t("reports.logLevel") }}</label>
            <select v-model="filters.level" class="form-select">
              <option value="">{{ $t("reports.allLevels") }}</option>
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <!-- Search -->
          <div class="col-md-6">
            <label class="form-label">{{ $t("reports.search") }}</label>
            <input
              v-model="filters.search"
              type="text"
              class="form-control"
              :placeholder="$t('reports.searchPlaceholder')"
            />
          </div>

          <!-- Custom Date Range -->
          <div class="col-md-3" v-if="filters.dateRange === 'custom'">
            <label class="form-label">{{ $t("reports.startDate") }}</label>
            <input
              v-model="filters.startDate"
              type="date"
              class="form-control"
            />
          </div>
          <div class="col-md-3" v-if="filters.dateRange === 'custom'">
            <label class="form-label">{{ $t("reports.endDate") }}</label>
            <input v-model="filters.endDate" type="date" class="form-control" />
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row g-5 mt-0">
      <div class="col-xl-3">
        <div class="card card-flush">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-50px me-5">
                <span class="symbol-label bg-light-primary">
                  <i class="bi bi-file-text fs-2x text-primary"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">
                  {{ $t("reports.totalLogs") }}
                </div>
                <div class="fs-2 fw-bold">{{ stats.totalLogs }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3">
        <div class="card card-flush">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-50px me-5">
                <span class="symbol-label bg-light-danger">
                  <i class="bi bi-exclamation-circle fs-2x text-danger"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">
                  {{ $t("reports.errors") }}
                </div>
                <div class="fs-2 fw-bold">{{ stats.errorCount }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3">
        <div class="card card-flush">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-50px me-5">
                <span class="symbol-label bg-light-warning">
                  <i class="bi bi-exclamation-triangle fs-2x text-warning"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">
                  {{ $t("reports.warnings") }}
                </div>
                <div class="fs-2 fw-bold">{{ stats.warningCount }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3">
        <div class="card card-flush">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-50px me-5">
                <span class="symbol-label bg-light-info">
                  <i class="bi bi-hdd fs-2x text-info"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">
                  {{ $t("reports.diskUsage") }}
                </div>
                <div class="fs-2 fw-bold">{{ stats.diskUsage }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Logs Table -->
    <div class="card mt-5">
      <div class="card-header">
        <h3 class="card-title">{{ $t("reports.systemLogs.logs") }}</h3>
        <div class="card-toolbar">
          <button
            @click="downloadLogs"
            class="btn btn-sm btn-light-primary"
            :disabled="!logs.length"
          >
            <i class="bi bi-download me-1"></i>
            {{ $t("reports.download") }}
          </button>
        </div>
      </div>
      <div class="card-body">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">{{ $t("common.loading") }}...</span>
          </div>
        </div>

        <!-- Logs -->
        <div v-else-if="logs.length > 0">
          <div class="table-responsive">
            <table class="table table-row-dashed table-row-gray-300 gy-7">
              <thead>
                <tr class="fw-semibold fs-6 text-gray-800">
                  <th style="width: 150px">{{ $t("reports.timestamp") }}</th>
                  <th style="width: 100px">{{ $t("reports.level") }}</th>
                  <th style="width: 150px">{{ $t("reports.context") }}</th>
                  <th>{{ $t("reports.message") }}</th>
                  <th style="width: 100px">{{ $t("reports.actions") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in logs" :key="log.id">
                  <td>
                    <span class="text-nowrap">{{
                      formatDateTime(log.timestamp)
                    }}</span>
                  </td>
                  <td>
                    <span :class="getLogLevelClass(log.level)" class="badge">
                      {{ log.level.toUpperCase() }}
                    </span>
                  </td>
                  <td>
                    <span class="badge badge-light">{{
                      log.context || "System"
                    }}</span>
                  </td>
                  <td>
                    <div class="text-wrap" style="max-width: 500px">
                      {{ log.message }}
                    </div>
                  </td>
                  <td>
                    <button
                      @click="viewLogDetails(log)"
                      class="btn btn-sm btn-light-primary"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="d-flex justify-content-between align-items-center mt-5">
            <div>
              {{ $t("common.showing") }} {{ (currentPage - 1) * perPage + 1 }} -
              {{ Math.min(currentPage * perPage, totalItems) }}
              {{ $t("common.of") }} {{ totalItems }} {{ $t("common.entries") }}
            </div>
            <nav>
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link" @click="changePage(currentPage - 1)">
                    <i class="previous"></i>
                  </a>
                </li>
                <li
                  v-for="page in displayedPages"
                  :key="page"
                  class="page-item"
                  :class="{ active: currentPage === page }"
                >
                  <a class="page-link" @click="changePage(page)">{{ page }}</a>
                </li>
                <li
                  class="page-item"
                  :class="{ disabled: currentPage === totalPages }"
                >
                  <a class="page-link" @click="changePage(currentPage + 1)">
                    <i class="next"></i>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <!-- No Results -->
        <div v-else class="text-center py-5">
          <i class="bi bi-file-earmark-x display-4 text-muted"></i>
          <h4 class="mt-3">{{ $t("reports.noLogs") }}</h4>
          <p class="text-muted">{{ $t("reports.noLogsDescription") }}</p>
        </div>
      </div>
    </div>

    <!-- Log Distribution Chart -->
    <div class="card mt-5" v-if="chartData">
      <div class="card-header">
        <h3 class="card-title">{{ $t("reports.logDistribution") }}</h3>
      </div>
      <div class="card-body">
        <div id="log-distribution-chart" style="height: 350px"></div>
      </div>
    </div>

    <!-- Log Details Modal -->
    <div
      v-if="selectedLog"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t("reports.logDetails") }}</h5>
            <button
              type="button"
              class="btn-close"
              @click="selectedLog = null"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-4">
              <label class="fw-bold">{{ $t("reports.timestamp") }}:</label>
              <p>{{ formatDateTime(selectedLog.timestamp) }}</p>
            </div>
            <div class="mb-4">
              <label class="fw-bold">{{ $t("reports.level") }}:</label>
              <p>
                <span
                  :class="getLogLevelClass(selectedLog.level)"
                  class="badge"
                >
                  {{ selectedLog.level.toUpperCase() }}
                </span>
              </p>
            </div>
            <div class="mb-4">
              <label class="fw-bold">{{ $t("reports.context") }}:</label>
              <p>{{ selectedLog.context || "System" }}</p>
            </div>
            <div class="mb-4">
              <label class="fw-bold">{{ $t("reports.message") }}:</label>
              <p>{{ selectedLog.message }}</p>
            </div>
            <div class="mb-4" v-if="selectedLog.extra">
              <label class="fw-bold">{{ $t("reports.additionalData") }}:</label>
              <pre class="bg-light p-3 rounded">{{
                JSON.stringify(selectedLog.extra, null, 2)
              }}</pre>
            </div>
            <div class="mb-4" v-if="selectedLog.stack_trace">
              <label class="fw-bold">{{ $t("reports.stackTrace") }}:</label>
              <pre
                class="bg-light p-3 rounded"
                style="max-height: 300px; overflow-y: auto"
                >{{ selectedLog.stack_trace }}</pre
              >
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="selectedLog = null"
            >
              {{ $t("common.close") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";

interface LogEntry {
  id: number;
  timestamp: string;
  level: string;
  context: string;
  message: string;
  extra?: any;
  stack_trace?: string;
}

interface LogStats {
  totalLogs: number;
  errorCount: number;
  warningCount: number;
  diskUsage: string;
}

// Composables
const { t } = useI18n();

// State
const loading = ref(false);
const logs = ref<LogEntry[]>([]);
const selectedLog = ref<LogEntry | null>(null);
const currentPage = ref(1);
const perPage = ref(50);
const totalItems = ref(0);
const chartData = ref(null);

const filters = ref({
  dateRange: "today",
  startDate: "",
  endDate: "",
  level: "",
  search: "",
});

const stats = ref<LogStats>({
  totalLogs: 0,
  errorCount: 0,
  warningCount: 0,
  diskUsage: "0 MB",
});

// Computed
const totalPages = computed(() => Math.ceil(totalItems.value / perPage.value));

const displayedPages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Methods
const updateCustomDates = () => {
  const today = new Date();
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  switch (filters.value.dateRange) {
    case "today":
      filters.value.startDate = formatDate(today);
      filters.value.endDate = formatDate(today);
      break;
    case "yesterday":
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      filters.value.startDate = formatDate(yesterday);
      filters.value.endDate = formatDate(yesterday);
      break;
    case "last7days":
      const last7 = new Date(today);
      last7.setDate(last7.getDate() - 7);
      filters.value.startDate = formatDate(last7);
      filters.value.endDate = formatDate(today);
      break;
    case "last30days":
      const last30 = new Date(today);
      last30.setDate(last30.getDate() - 30);
      filters.value.startDate = formatDate(last30);
      filters.value.endDate = formatDate(today);
      break;
  }
};

const generateReport = async () => {
  loading.value = true;

  try {
    const params = {
      page: currentPage.value,
      per_page: perPage.value,
      start_date: filters.value.startDate,
      end_date: filters.value.endDate,
      level: filters.value.level || undefined,
      search: filters.value.search || undefined,
    };

    const response = await ApiService.query("reports/system-logs", params);

    if (response.data.status === "success") {
      logs.value = response.data.data.items || [];
      totalItems.value = response.data.data.total || 0;
      stats.value = response.data.data.stats || stats.value;

      // Load chart data
      if (response.data.data.chart) {
        renderChart(response.data.data.chart);
      }
    }
  } catch (error) {
    console.error("Error loading logs:", error);
    Swal.fire({
      icon: "error",
      title: t("common.error"),
      text: t("reports.errorLoading"),
    });
  } finally {
    loading.value = false;
  }
};

const changePage = async (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  await generateReport();
};

const viewLogDetails = (log: LogEntry) => {
  selectedLog.value = log;
};

const downloadLogs = async () => {
  try {
    const response = await ApiService.get("reports/system-logs/download", {
      params: filters.value,
      responseType: "blob",
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `system-logs-${new Date().toISOString().split("T")[0]}.log`,
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error downloading logs:", error);
    Swal.fire({
      icon: "error",
      title: t("common.error"),
      text: t("reports.errorDownloading"),
    });
  }
};

const renderChart = (data: any) => {
  // This would use ApexCharts or another charting library
  chartData.value = data;
  // Implementation depends on charting library
};

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString();
};

const getLogLevelClass = (level: string) => {
  const classes = {
    debug: "badge-secondary",
    info: "badge-info",
    warning: "badge-warning",
    error: "badge-danger",
    critical: "badge-dark",
  };
  return classes[level.toLowerCase()] || "badge-light";
};

// Lifecycle
onMounted(() => {
  updateCustomDates();
  generateReport();
});
</script>
