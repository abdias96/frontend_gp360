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
          <button @click="exportFullExcel" class="btn btn-sm btn-light-success me-2" :disabled="!data">
            <i class="bi bi-file-earmark-excel me-1"></i> {{ $t("reports.exportExcel") }}
          </button>
          <button @click="exportFullPDF" class="btn btn-sm btn-light-primary me-2" :disabled="!data">
            <i class="bi bi-file-pdf me-1"></i> {{ $t("reports.exportPDF") }}
          </button>
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
          <div class="col-md-2">
            <label class="form-label">{{ $t("reports.inmateReports.center") }}</label>
            <select v-model="filters.centerId" class="form-select">
              <option value="">{{ $t("reports.inmateReports.allCenters") }}</option>
              <option v-for="c in centers" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">{{ $t("reports.gender") }}</label>
            <select v-model="filters.gender" class="form-select">
              <option value="">{{ $t("reports.allGenders") }}</option>
              <option value="M">{{ $t("reports.male") }}</option>
              <option value="F">{{ $t("reports.female") }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">{{ $t("reports.inmateReports.statusFilter") }}</label>
            <select v-model="filters.status" class="form-select">
              <option value="">{{ $t("reports.allStatuses") }}</option>
              <option value="active">{{ $t("reports.inmateReports.statusActive") }}</option>
              <option value="released">{{ $t("reports.inmateReports.statusReleased") }}</option>
              <option value="transferred">{{ $t("reports.inmateReports.statusTransferred") }}</option>
              <option value="deceased">{{ $t("reports.inmateReports.statusDeceased") }}</option>
              <option value="escaped">{{ $t("reports.inmateReports.statusEscaped") }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">{{ $t("reports.inmateReports.gangFilter") }}</label>
            <select v-model="filters.gangAffiliation" class="form-select">
              <option value="">{{ $t("reports.inmateReports.allGangs") }}</option>
              <option value="none">{{ $t("reports.inmateReports.noGang") }}</option>
              <option value="confirmed_ms13">MS-13</option>
              <option value="confirmed_barrio18">Barrio 18</option>
              <option value="other_gang">{{ $t("reports.inmateReports.otherGang") }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">{{ $t("reports.dateFrom") }}</label>
            <input type="date" v-model="filters.dateFrom" class="form-control" />
          </div>
          <div class="col-md-2">
            <label class="form-label">{{ $t("reports.dateTo") }}</label>
            <input type="date" v-model="filters.dateTo" class="form-control" />
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row g-5 mt-0" v-if="data">
      <div class="col-xl-2">
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
      <div class="col-xl-2">
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
      <div class="col-xl-2">
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
      <div class="col-xl-2">
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
      <div class="col-xl-2">
        <div class="card card-flush">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-50px me-5">
                <span class="symbol-label bg-light-info">
                  <i class="bi bi-bar-chart fs-2x text-info"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">
                  {{ $t("reports.total") }}
                </div>
                <div class="fs-2 fw-bold">
                  {{ formatNumber(data.population.total) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-2">
        <div class="card card-flush">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-50px me-5">
                <span class="symbol-label bg-light-dark">
                  <i class="bi bi-x-circle fs-2x text-dark"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">
                  {{ $t("reports.inmateReports.deceased") }}
                </div>
                <div class="fs-2 fw-bold">
                  {{ formatNumber(data.population.deceased) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row 1: Population by Center + Gender -->
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

    <!-- Charts Row 2: Security Level + Admissions Trend -->
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

    <!-- Charts Row 3: Ethnicity + Education -->
    <div class="row g-5 mt-0" v-if="data && data.demographics">
      <div class="col-xl-4">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.inmateReports.byEthnicity") }}</h3>
          </div>
          <div class="card-body">
            <apexchart
              type="pie"
              height="300"
              :options="ethnicityChartOptions"
              :series="ethnicityChartSeries"
            />
          </div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.inmateReports.byEducation") }}</h3>
          </div>
          <div class="card-body">
            <apexchart
              type="bar"
              height="300"
              :options="educationChartOptions"
              :series="educationChartSeries"
            />
          </div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.inmateReports.byNationality") }}</h3>
          </div>
          <div class="card-body">
            <apexchart
              type="bar"
              height="300"
              :options="nationalityChartOptions"
              :series="nationalityChartSeries"
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

    <!-- New Tables: Civil Status + Population by Status -->
    <div class="row g-5 mt-0" v-if="data">
      <div class="col-xl-4" v-if="data.demographics?.by_civil_status?.length">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.inmateReports.byCivilStatus") }}</h3>
          </div>
          <div class="card-body">
            <table class="table table-row-dashed table-row-gray-300 gy-5">
              <thead>
                <tr class="fw-semibold fs-6 text-gray-800">
                  <th>{{ $t("reports.name") }}</th>
                  <th class="text-end">{{ $t("reports.total") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in data.demographics.by_civil_status" :key="idx">
                  <td>{{ item.name }}</td>
                  <td class="text-end fw-bold">{{ formatNumber(item.total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-xl-4" v-if="data.population?.by_status">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.inmateReports.populationByStatus") }}</h3>
          </div>
          <div class="card-body">
            <table class="table table-row-dashed table-row-gray-300 gy-5">
              <thead>
                <tr class="fw-semibold fs-6 text-gray-800">
                  <th>{{ $t("reports.inmateReports.statusFilter") }}</th>
                  <th class="text-end">{{ $t("reports.total") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(total, status) in data.population.by_status" :key="status">
                  <td>{{ status }}</td>
                  <td class="text-end fw-bold">{{ formatNumber(total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-xl-4" v-if="data.biometrics?.finger_distribution">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.inmateReports.fingerDistribution") }}</h3>
          </div>
          <div class="card-body">
            <table class="table table-row-dashed table-row-gray-300 gy-5">
              <thead>
                <tr class="fw-semibold fs-6 text-gray-800">
                  <th>{{ $t("reports.inmateReports.fingersCount") }}</th>
                  <th class="text-end">{{ $t("reports.inmateReports.inmatesCount") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(count, fingers) in data.biometrics.finger_distribution" :key="fingers">
                  <td>{{ fingers }}</td>
                  <td class="text-end fw-bold">{{ formatNumber(count) }}</td>
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
} from "../composables/useReportExport";

const { t } = useI18n();
const loading = ref(false);
const data = ref<any>(null);
const centers = ref<{ id: number; name: string }[]>([]);
const filters = ref({
  centerId: "",
  gender: "",
  status: "",
  gangAffiliation: "",
  dateFrom: "",
  dateTo: "",
});

const loadCenters = async () => {
  try {
    const res = await ApiService.query("catalogs/centers", { simple: true });
    if (res.data.success) {
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
    if (filters.value.gender) params.gender = filters.value.gender;
    if (filters.value.status) params.status = filters.value.status;
    if (filters.value.gangAffiliation) params.gang_affiliation = filters.value.gangAffiliation;
    if (filters.value.dateFrom) params.date_from = filters.value.dateFrom;
    if (filters.value.dateTo) params.date_to = filters.value.dateTo;
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

// Ethnicity chart
const ethnicityChartOptions = computed(() => {
  const items = data.value?.demographics?.by_ethnicity || [];
  return {
    chart: { type: "pie" },
    labels: items.map((i: any) => i.name),
    colors: CHART_COLORS,
    legend: { position: "bottom" },
  };
});
const ethnicityChartSeries = computed(() =>
  (data.value?.demographics?.by_ethnicity || []).map((i: any) => i.total),
);

// Education chart
const educationChartOptions = computed(() => ({
  chart: { type: "bar", toolbar: { show: false } },
  plotOptions: { bar: { horizontal: true, barHeight: "60%" } },
  xaxis: {
    categories: (data.value?.demographics?.by_education || []).map((i: any) => i.name),
  },
  colors: [CHART_COLORS[2]],
  dataLabels: { enabled: true },
}));
const educationChartSeries = computed(() => [
  {
    name: t("reports.total"),
    data: (data.value?.demographics?.by_education || []).map((i: any) => i.total),
  },
]);

// Nationality chart
const nationalityChartOptions = computed(() => ({
  chart: { type: "bar", toolbar: { show: false } },
  plotOptions: { bar: { horizontal: true, barHeight: "60%" } },
  xaxis: {
    categories: (data.value?.demographics?.by_nationality || []).map((i: any) => i.name),
  },
  colors: [CHART_COLORS[4]],
  dataLabels: { enabled: true },
}));
const nationalityChartSeries = computed(() => [
  {
    name: t("reports.total"),
    data: (data.value?.demographics?.by_nationality || []).map((i: any) => i.total),
  },
]);

// Helpers
const getGangBadge = (type: string) => {
  if (type.includes("ms13")) return "badge-danger";
  if (type.includes("barrio18")) return "badge-warning";
  return "badge-secondary";
};

const exportFullPDF = () => {
  const crimes = data.value?.crimes?.top_10_crimes || [];
  exportToPDF(
    t("reports.inmateReports.title"),
    ["#", t("reports.inmateReports.crime"), t("reports.inmateReports.count")],
    crimes.map((c: any, i: number) => [i + 1, c.name, c.total]),
  );
};

const exportFullExcel = () => {
  const d = data.value;
  if (!d) return;
  const sheets: any[] = [];

  // Population sheet
  const popRows = (d.population?.by_center || []).map((c: any) => [c.code, c.name, c.total]);
  sheets.push({
    name: "Población",
    columns: ["Código", "Centro", "Población"],
    rows: popRows,
  });

  // Demographics sheet
  const demoRows = (d.demographics?.by_ethnicity || []).map((i: any) => [i.name, i.total]);
  sheets.push({
    name: "Demografía",
    columns: ["Etnia", "Total"],
    rows: demoRows,
  });

  // Crimes sheet
  const crimeRows = (d.crimes?.top_10_crimes || []).map((c: any, i: number) => [i + 1, c.name, c.total]);
  sheets.push({
    name: "Delitos",
    columns: ["#", "Delito", "Total"],
    rows: crimeRows,
  });

  // Gangs sheet
  const gangRows = Object.entries(d.gangs?.by_type || {}).map(([type, total]) => [type, total]);
  sheets.push({
    name: "Pandillas",
    columns: ["Tipo", "Total"],
    rows: gangRows,
  });

  exportToExcel(t("reports.inmateReports.title"), sheets);
};

onMounted(() => {
  loadCenters();
  generateReport();
});
</script>
