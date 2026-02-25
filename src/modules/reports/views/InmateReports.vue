<template>
  <div class="container-fluid">
    <!-- Header -->
    <div class="d-flex flex-column">
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        {{ $t("reports.inmateReports.title") }}
      </h1>
      <div class="text-muted fw-semibold fs-7">
        {{ $t("reports.inmateReports.subtitle") }}
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
            <i class="bi bi-bar-chart me-1"></i>
            {{ $t("reports.generate") }}
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">{{ $t("reports.inmateReports.center") }}</label>
            <select v-model="filters.centerId" class="form-select">
              <option value="">{{ $t("reports.inmateReports.allCenters") }}</option>
              <option v-for="c in centers" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row g-5 mt-0" v-if="data">
      <div class="col-xl-3">
        <div class="card card-flush">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-50px me-5">
                <span class="symbol-label bg-light-primary">
                  <i class="bi bi-people-fill fs-2x text-primary"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">
                  {{ $t("reports.inmateReports.totalPPL") }}
                </div>
                <div class="fs-2 fw-bold">
                  {{ formatNumber(data.population.active) }}
                </div>
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
                  <i class="bi bi-fingerprint fs-2x text-success"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">
                  {{ $t("reports.inmateReports.biometricCoverage") }}
                </div>
                <div class="fs-2 fw-bold">
                  {{ formatPercentage(data.biometrics.percentage) }}
                </div>
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
                  {{ $t("reports.inmateReports.gangAffiliated") }}
                </div>
                <div class="fs-2 fw-bold">
                  {{ formatNumber(data.gangs.total_affiliated) }}
                </div>
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
                  <i class="bi bi-shield-lock fs-2x text-warning"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">
                  {{ $t("reports.inmateReports.totalCrimes") }}
                </div>
                <div class="fs-2 fw-bold">
                  {{ formatNumber(data.crimes.total_crimes) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="row g-5 mt-0" v-if="data">
      <div class="col-xl-8">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.inmateReports.populationByCenter") }}</h3>
          </div>
          <div class="card-body">
            <apexchart
              type="bar"
              height="350"
              :options="centerChartOptions"
              :series="centerChartSeries"
            />
          </div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.inmateReports.byGender") }}</h3>
          </div>
          <div class="card-body">
            <apexchart
              type="donut"
              height="300"
              :options="genderChartOptions"
              :series="genderChartSeries"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="row g-5 mt-0" v-if="data">
      <div class="col-xl-4">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.inmateReports.bySecurityLevel") }}</h3>
          </div>
          <div class="card-body">
            <apexchart
              type="donut"
              height="300"
              :options="securityChartOptions"
              :series="securityChartSeries"
            />
          </div>
        </div>
      </div>
      <div class="col-xl-8">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.inmateReports.admissionsTrend") }}</h3>
          </div>
          <div class="card-body">
            <apexchart
              type="line"
              height="300"
              :options="trendChartOptions"
              :series="trendChartSeries"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Tables -->
    <div class="row g-5 mt-0" v-if="data">
      <div class="col-xl-6">
        <div class="card card-flush">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.inmateReports.top10Crimes") }}</h3>
            <div class="card-toolbar">
              <button
                @click="exportCrimesPDF"
                class="btn btn-sm btn-light-primary me-2"
              >
                <i class="bi bi-file-pdf me-1"></i> PDF
              </button>
              <button @click="exportCrimesExcel" class="btn btn-sm btn-light-success">
                <i class="bi bi-file-earmark-excel me-1"></i> Excel
              </button>
            </div>
          </div>
          <div class="card-body">
            <table class="table table-row-dashed table-row-gray-300 gy-5">
              <thead>
                <tr class="fw-semibold fs-6 text-gray-800">
                  <th>#</th>
                  <th>{{ $t("reports.inmateReports.crime") }}</th>
                  <th class="text-end">{{ $t("reports.inmateReports.count") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(crime, idx) in data.crimes.top_10_crimes" :key="idx">
                  <td>{{ idx + 1 }}</td>
                  <td>{{ crime.name }}</td>
                  <td class="text-end fw-bold">{{ formatNumber(crime.total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-xl-6">
        <div class="card card-flush">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.inmateReports.gangDistribution") }}</h3>
          </div>
          <div class="card-body">
            <table class="table table-row-dashed table-row-gray-300 gy-5">
              <thead>
                <tr class="fw-semibold fs-6 text-gray-800">
                  <th>{{ $t("reports.inmateReports.gangType") }}</th>
                  <th class="text-end">{{ $t("reports.inmateReports.count") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(total, type) in data.gangs.by_type" :key="type">
                  <td>
                    <span class="badge" :class="getGangBadge(String(type))">
                      {{ type }}
                    </span>
                  </td>
                  <td class="text-end fw-bold">{{ formatNumber(total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-10">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">{{ $t("common.loading") }}...</span>
      </div>
    </div>

    <!-- No data -->
    <div v-if="!loading && !data" class="card mt-5">
      <div class="card-body text-center py-10">
        <i class="bi bi-clipboard-x display-4 text-muted"></i>
        <h4 class="mt-3">{{ $t("reports.noData") }}</h4>
        <p class="text-muted">{{ $t("reports.noDataDescription") }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";
import {
  CHART_COLORS,
  SEVERITY_COLORS,
  formatNumber,
  formatPercentage,
  exportToPDF,
  exportToExcel,
  arrayToRows,
} from "../composables/useReportExport";

const { t } = useI18n();
const loading = ref(false);
const data = ref<any>(null);
const centers = ref<{ id: number; name: string }[]>([]);
const filters = ref({ centerId: "" });

const loadCenters = async () => {
  try {
    const res = await ApiService.query("catalogs/centers", { active: true });
    if (res.data.status === "success") {
      centers.value = res.data.data || [];
    }
  } catch {
    /* ignore */
  }
};

const generateReport = async () => {
  loading.value = true;
  data.value = null;
  try {
    const params: any = {};
    if (filters.value.centerId) params.center_id = filters.value.centerId;
    const res = await ApiService.query("reports/inmates", params);
    if (res.data.status === "success") {
      data.value = res.data.data;
    }
  } catch {
    Swal.fire({ icon: "error", title: t("common.error"), text: t("reports.errorGenerating") });
  } finally {
    loading.value = false;
  }
};

// Charts
const centerChartOptions = computed(() => ({
  chart: { type: "bar", toolbar: { show: false } },
  plotOptions: { bar: { horizontal: true, barHeight: "60%" } },
  xaxis: {
    categories: (data.value?.population?.by_center || []).map(
      (c: any) => c.code || c.name,
    ),
  },
  colors: [CHART_COLORS[0]],
  dataLabels: { enabled: true },
}));
const centerChartSeries = computed(() => [
  {
    name: t("reports.inmateReports.population"),
    data: (data.value?.population?.by_center || []).map((c: any) => c.total),
  },
]);

const genderChartOptions = computed(() => {
  const labels = Object.keys(data.value?.population?.by_gender || {});
  return {
    chart: { type: "donut" },
    labels,
    colors: [CHART_COLORS[0], CHART_COLORS[3], CHART_COLORS[6]],
    legend: { position: "bottom" },
  };
});
const genderChartSeries = computed(() =>
  Object.values(data.value?.population?.by_gender || {}),
);

const securityChartOptions = computed(() => {
  const labels = Object.keys(data.value?.security?.by_level || {});
  return {
    chart: { type: "donut" },
    labels,
    colors: labels.map((l) => SEVERITY_COLORS[l] || CHART_COLORS[6]),
    legend: { position: "bottom" },
  };
});
const securityChartSeries = computed(() =>
  Object.values(data.value?.security?.by_level || {}),
);

const trendChartOptions = computed(() => ({
  chart: { type: "line", toolbar: { show: false } },
  xaxis: {
    categories: (data.value?.admissions_trend || []).map((t: any) => t.month),
  },
  colors: [CHART_COLORS[0]],
  stroke: { curve: "smooth", width: 3 },
  markers: { size: 4 },
}));
const trendChartSeries = computed(() => [
  {
    name: t("reports.inmateReports.admissions"),
    data: (data.value?.admissions_trend || []).map((t: any) => t.count),
  },
]);

// Helpers
const getGangBadge = (type: string) => {
  if (type.includes("ms13")) return "badge-danger";
  if (type.includes("barrio18")) return "badge-warning";
  return "badge-secondary";
};

const exportCrimesPDF = () => {
  const crimes = data.value?.crimes?.top_10_crimes || [];
  exportToPDF(
    t("reports.inmateReports.top10Crimes"),
    ["#", t("reports.inmateReports.crime"), t("reports.inmateReports.count")],
    crimes.map((c: any, i: number) => [i + 1, c.name, c.total]),
  );
};

const exportCrimesExcel = () => {
  const crimes = data.value?.crimes?.top_10_crimes || [];
  exportToExcel(t("reports.inmateReports.top10Crimes"), [
    {
      name: "Delitos",
      columns: ["#", t("reports.inmateReports.crime"), t("reports.inmateReports.count")],
      rows: crimes.map((c: any, i: number) => [i + 1, c.name, c.total]),
    },
  ]);
};

onMounted(() => {
  loadCenters();
  generateReport();
});
</script>
