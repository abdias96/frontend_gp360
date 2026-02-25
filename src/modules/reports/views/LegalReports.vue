<template>
  <div class="container-fluid">
    <div class="d-flex flex-column">
      <h1 class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">
        {{ $t("reports.legalReports.title") }}
      </h1>
      <div class="text-muted fw-semibold fs-7">{{ $t("reports.legalReports.subtitle") }}</div>
    </div>

    <!-- Filters -->
    <div class="card mt-5">
      <div class="card-header">
        <h3 class="card-title">{{ $t("reports.filters") }}</h3>
        <div class="card-toolbar">
          <button @click="generateReport" class="btn btn-primary" :disabled="loading">
            <i class="bi bi-bar-chart me-1"></i> {{ $t("reports.generate") }}
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">{{ $t("reports.inmateReports.center") }}</label>
            <select v-model="filters.centerId" class="form-select">
              <option value="">{{ $t("reports.inmateReports.allCenters") }}</option>
              <option v-for="c in centers" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="row g-5 mt-0" v-if="data">
      <div class="col-xl-3">
        <div class="card card-flush">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-50px me-5">
                <span class="symbol-label bg-light-primary">
                  <i class="bi bi-calendar-event fs-2x text-primary"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.legalReports.totalHearings") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.hearings.total) }}</div>
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
                  <i class="bi bi-clock-history fs-2x text-warning"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.legalReports.upcoming7") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.hearings.upcoming_7_days) }}</div>
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
                  <i class="bi bi-check-circle fs-2x text-success"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.legalReports.withSentence") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.cases.with_sentence) }}</div>
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
                  <i class="bi bi-hourglass-split fs-2x text-danger"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.legalReports.avgDaysPreventiva") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.procedural_status.average_days_preventiva) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="row g-5 mt-0" v-if="data">
      <div class="col-xl-5">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.legalReports.hearingsByType") }}</h3>
          </div>
          <div class="card-body">
            <apexchart type="bar" height="350" :options="typeChartOptions" :series="typeChartSeries" />
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.legalReports.proceduralStatus") }}</h3>
          </div>
          <div class="card-body">
            <apexchart type="donut" height="300" :options="statusChartOptions" :series="statusChartSeries" />
          </div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.legalReports.hearingsTrend") }}</h3>
          </div>
          <div class="card-body">
            <apexchart type="line" height="300" :options="trendChartOptions" :series="trendChartSeries" />
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="card mt-5" v-if="data">
      <div class="card-header">
        <h3 class="card-title">{{ $t("reports.legalReports.topCrimes") }}</h3>
        <div class="card-toolbar">
          <button @click="doExportPDF" class="btn btn-sm btn-light-primary me-2">
            <i class="bi bi-file-pdf me-1"></i> PDF
          </button>
          <button @click="doExportExcel" class="btn btn-sm btn-light-success">
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
            <tr v-for="(crime, idx) in data.crimes.most_common_top10" :key="idx">
              <td>{{ idx + 1 }}</td>
              <td>{{ crime.name }}</td>
              <td class="text-end fw-bold">{{ formatNumber(crime.total) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="loading" class="text-center py-10">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">{{ $t("common.loading") }}...</span>
      </div>
    </div>
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
import { CHART_COLORS, formatNumber, exportToPDF, exportToExcel } from "../composables/useReportExport";

const { t } = useI18n();
const loading = ref(false);
const data = ref<any>(null);
const centers = ref<{ id: number; name: string }[]>([]);
const filters = ref({ centerId: "" });

const loadCenters = async () => {
  try {
    const res = await ApiService.query("catalogs/centers", { active: true });
    if (res.data.status === "success") centers.value = res.data.data || [];
  } catch { /* ignore */ }
};

const generateReport = async () => {
  loading.value = true;
  data.value = null;
  try {
    const params: any = {};
    if (filters.value.centerId) params.center_id = filters.value.centerId;
    const res = await ApiService.query("reports/legal", params);
    if (res.data.status === "success") data.value = res.data.data;
  } catch {
    Swal.fire({ icon: "error", title: t("common.error"), text: t("reports.errorGenerating") });
  } finally {
    loading.value = false;
  }
};

const typeChartOptions = computed(() => ({
  chart: { type: "bar", toolbar: { show: false } },
  xaxis: { categories: Object.keys(data.value?.hearings?.by_type || {}) },
  colors: [CHART_COLORS[0]],
  plotOptions: { bar: { horizontal: true, barHeight: "60%" } },
  dataLabels: { enabled: true },
}));
const typeChartSeries = computed(() => [{
  name: t("reports.legalReports.hearings"),
  data: Object.values(data.value?.hearings?.by_type || {}),
}]);

const statusChartOptions = computed(() => {
  const items = data.value?.procedural_status?.by_status || [];
  return {
    chart: { type: "donut" },
    labels: items.map((i: any) => i.name || "N/A"),
    colors: CHART_COLORS.slice(0, items.length),
    legend: { position: "bottom" },
  };
});
const statusChartSeries = computed(() =>
  (data.value?.procedural_status?.by_status || []).map((i: any) => i.total),
);

const trendChartOptions = computed(() => ({
  chart: { type: "line", toolbar: { show: false } },
  xaxis: { categories: (data.value?.hearings_trend || []).map((t: any) => t.month) },
  colors: [CHART_COLORS[5]],
  stroke: { curve: "smooth", width: 3 },
  markers: { size: 4 },
}));
const trendChartSeries = computed(() => [{
  name: t("reports.legalReports.hearings"),
  data: (data.value?.hearings_trend || []).map((t: any) => t.count),
}]);

const doExportPDF = () => {
  const crimes = data.value?.crimes?.most_common_top10 || [];
  exportToPDF(
    t("reports.legalReports.topCrimes"),
    ["#", t("reports.inmateReports.crime"), t("reports.inmateReports.count")],
    crimes.map((c: any, i: number) => [i + 1, c.name, c.total]),
  );
};
const doExportExcel = () => {
  const crimes = data.value?.crimes?.most_common_top10 || [];
  exportToExcel(t("reports.legalReports.topCrimes"), [{
    name: "Delitos",
    columns: ["#", t("reports.inmateReports.crime"), t("reports.inmateReports.count")],
    rows: crimes.map((c: any, i: number) => [i + 1, c.name, c.total]),
  }]);
};

onMounted(() => { loadCenters(); generateReport(); });
</script>
