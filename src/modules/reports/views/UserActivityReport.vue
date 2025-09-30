<template>
  <div class="container-fluid">
    <!-- Header -->
    <div class="d-flex flex-column">
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        {{ $t("reports.userActivity.title") }}
      </h1>
      <div class="text-muted fw-semibold fs-7">
        {{ $t("reports.userActivity.subtitle") }}
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
            <i class="bi bi-download me-1"></i>
            {{ $t("reports.generate") }}
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
              <option value="thisMonth">{{ $t("reports.thisMonth") }}</option>
              <option value="lastMonth">{{ $t("reports.lastMonth") }}</option>
              <option value="custom">{{ $t("reports.custom") }}</option>
            </select>
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

          <!-- User Filter -->
          <div class="col-md-3">
            <label class="form-label">{{ $t("reports.user") }}</label>
            <select v-model="filters.userId" class="form-select">
              <option value="">{{ $t("reports.allUsers") }}</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.full_name }}
              </option>
            </select>
          </div>

          <!-- Activity Type -->
          <div class="col-md-3">
            <label class="form-label">{{ $t("reports.activityType") }}</label>
            <select v-model="filters.activityType" class="form-select">
              <option value="">{{ $t("reports.allActivities") }}</option>
              <option value="login">{{ $t("reports.login") }}</option>
              <option value="logout">{{ $t("reports.logout") }}</option>
              <option value="create">{{ $t("reports.create") }}</option>
              <option value="update">{{ $t("reports.update") }}</option>
              <option value="delete">{{ $t("reports.delete") }}</option>
            </select>
          </div>

          <!-- Module Filter -->
          <div class="col-md-3">
            <label class="form-label">{{ $t("reports.module") }}</label>
            <select v-model="filters.module" class="form-select">
              <option value="">{{ $t("reports.allModules") }}</option>
              <option value="users">{{ $t("menu.users") }}</option>
              <option value="roles">{{ $t("menu.roles") }}</option>
              <option value="catalogs">{{ $t("menu.catalogs") }}</option>
              <option value="settings">{{ $t("menu.settings") }}</option>
            </select>
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
                  <i class="bi bi-people fs-2x text-primary"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">
                  {{ $t("reports.activeUsers") }}
                </div>
                <div class="fs-2 fw-bold">{{ stats.activeUsers }}</div>
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
                <span class="symbol-label bg-light-success">
                  <i class="bi bi-activity fs-2x text-success"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">
                  {{ $t("reports.totalActivities") }}
                </div>
                <div class="fs-2 fw-bold">{{ stats.totalActivities }}</div>
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
                  <i class="bi bi-box-arrow-in-right fs-2x text-warning"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">
                  {{ $t("reports.logins") }}
                </div>
                <div class="fs-2 fw-bold">{{ stats.loginCount }}</div>
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
                  <i class="bi bi-exclamation-triangle fs-2x text-danger"></i>
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
    </div>

    <!-- Report Results -->
    <div class="card mt-5">
      <div class="card-header">
        <h3 class="card-title">{{ $t("reports.results") }}</h3>
        <div class="card-toolbar">
          <button
            @click="exportReport('pdf')"
            class="btn btn-sm btn-light-primary me-2"
            :disabled="!reportData.length"
          >
            <i class="bi bi-file-pdf me-1"></i>
            PDF
          </button>
          <button
            @click="exportReport('excel')"
            class="btn btn-sm btn-light-success"
            :disabled="!reportData.length"
          >
            <i class="bi bi-file-earmark-excel me-1"></i>
            Excel
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

        <!-- Results Table -->
        <div v-else-if="reportData.length > 0" class="table-responsive">
          <table class="table table-row-dashed table-row-gray-300 gy-7">
            <thead>
              <tr class="fw-semibold fs-6 text-gray-800">
                <th>{{ $t("reports.dateTime") }}</th>
                <th>{{ $t("reports.user") }}</th>
                <th>{{ $t("reports.activity") }}</th>
                <th>{{ $t("reports.module") }}</th>
                <th>{{ $t("reports.details") }}</th>
                <th>{{ $t("reports.ipAddress") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in reportData" :key="item.id">
                <td>{{ formatDateTime(item.created_at) }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-40px me-3">
                      <img
                        :src="item.user.avatar || getDefaultAvatar()"
                        alt="User"
                      />
                    </div>
                    <div>
                      <div class="fw-bold">{{ item.user.full_name }}</div>
                      <div class="text-muted fs-7">{{ item.user.email }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    :class="getActivityBadgeClass(item.activity_type)"
                    class="badge"
                  >
                    {{ item.activity_type }}
                  </span>
                </td>
                <td>{{ item.module || "-" }}</td>
                <td>{{ item.description }}</td>
                <td>
                  <span class="badge badge-light">{{ item.ip_address }}</span>
                </td>
              </tr>
            </tbody>
          </table>

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
          <i class="bi bi-clipboard-x display-4 text-muted"></i>
          <h4 class="mt-3">{{ $t("reports.noData") }}</h4>
          <p class="text-muted">{{ $t("reports.noDataDescription") }}</p>
        </div>
      </div>
    </div>

    <!-- Activity Chart -->
    <div class="card mt-5" v-if="chartData">
      <div class="card-header">
        <h3 class="card-title">{{ $t("reports.activityChart") }}</h3>
      </div>
      <div class="card-body">
        <div id="activity-chart" style="height: 350px"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";

interface User {
  id: number;
  full_name: string;
  email: string;
  avatar?: string;
}

interface ActivityItem {
  id: number;
  user: User;
  activity_type: string;
  module: string;
  description: string;
  ip_address: string;
  created_at: string;
}

interface ReportStats {
  activeUsers: number;
  totalActivities: number;
  loginCount: number;
  errorCount: number;
}

// Composables
const { t } = useI18n();

// State
const loading = ref(false);
const users = ref<User[]>([]);
const reportData = ref<ActivityItem[]>([]);
const currentPage = ref(1);
const perPage = ref(20);
const totalItems = ref(0);
const chartData = ref(null);

const filters = ref({
  dateRange: "last7days",
  startDate: "",
  endDate: "",
  userId: "",
  activityType: "",
  module: "",
});

const stats = ref<ReportStats>({
  activeUsers: 0,
  totalActivities: 0,
  loginCount: 0,
  errorCount: 0,
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
const loadUsers = async () => {
  try {
    const response = await ApiService.query("users", { simple: true });
    if (response.data.status === "success") {
      users.value = response.data.data || [];
    }
  } catch (error) {
    console.error("Error loading users:", error);
  }
};

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
    case "thisMonth":
      filters.value.startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      )
        .toISOString()
        .split("T")[0];
      filters.value.endDate = formatDate(today);
      break;
    case "lastMonth":
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      filters.value.startDate = formatDate(lastMonth);
      filters.value.endDate = formatDate(lastMonthEnd);
      break;
  }
};

const generateReport = async () => {
  loading.value = true;
  currentPage.value = 1;

  try {
    const params = {
      page: currentPage.value,
      per_page: perPage.value,
      start_date: filters.value.startDate,
      end_date: filters.value.endDate,
      user_id: filters.value.userId || undefined,
      activity_type: filters.value.activityType || undefined,
      module: filters.value.module || undefined,
    };

    const response = await ApiService.query("reports/user-activity", params);

    if (response.data.status === "success") {
      reportData.value = response.data.data.items || [];
      totalItems.value = response.data.data.total || 0;
      stats.value = response.data.data.stats || stats.value;

      // Load chart data
      if (response.data.data.chart) {
        renderChart(response.data.data.chart);
      }
    }
  } catch (error) {
    console.error("Error generating report:", error);
    Swal.fire({
      icon: "error",
      title: t("common.error"),
      text: t("reports.errorGenerating"),
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

const exportReport = async (format: "pdf" | "excel") => {
  try {
    const response = await ApiService.query(
      `reports/user-activity/export`,
      {
        format,
        ...filters.value,
      },
      {
        responseType: "blob",
      },
    );

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `user-activity-report.${format === "pdf" ? "pdf" : "xlsx"}`,
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting report:", error);
    Swal.fire({
      icon: "error",
      title: t("common.error"),
      text: t("reports.errorExporting"),
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

const getDefaultAvatar = () => {
  return "/media/avatars/blank.png";
};

const getActivityBadgeClass = (type: string) => {
  const classes = {
    login: "badge-success",
    logout: "badge-info",
    create: "badge-primary",
    update: "badge-warning",
    delete: "badge-danger",
  };
  return classes[type] || "badge-secondary";
};

// Lifecycle
onMounted(() => {
  loadUsers();
  updateCustomDates();
  generateReport();
});
</script>
