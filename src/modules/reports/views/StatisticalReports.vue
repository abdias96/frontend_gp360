<template>
  <div class="container-fluid">
    <div class="d-flex flex-column">
      <h1 class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">
        {{ $t("reports.statisticalReports.title") }}
      </h1>
      <div class="text-muted fw-semibold fs-7">{{ $t("reports.statisticalReports.subtitle") }}</div>
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
                  <i class="bi bi-people-fill fs-2x text-primary"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.statisticalReports.totalPopulation") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.population_summary.total) }}</div>
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
                <span class="symbol-label" :class="data.population_summary.occupancy_rate > 100 ? 'bg-light-danger' : 'bg-light-success'">
                  <i class="bi bi-building fs-2x" :class="data.population_summary.occupancy_rate > 100 ? 'text-danger' : 'text-success'"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.statisticalReports.occupancyRate") }}</div>
                <div class="fs-2 fw-bold">{{ formatPercentage(data.population_summary.occupancy_rate) }}</div>
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
                  <i class="bi bi-shield-exclamation fs-2x text-warning"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.statisticalReports.securityIndex") }}</div>
                <div class="fs-2 fw-bold">{{ data.security_index.avg_incidents_per_100 }}</div>
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
                  <i class="bi bi-hourglass fs-2x text-info"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.statisticalReports.avgPreventiva") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.legal_index.avg_days_preventiva) }} {{ $t("reports.statisticalReports.days") }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="row g-5 mt-0" v-if="data">
      <div class="col-xl-8">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.statisticalReports.populationTrend") }}</h3>
          </div>
          <div class="card-body">
            <apexchart type="area" height="350" :options="trendChartOptions" :series="trendChartSeries" />
          </div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.statisticalReports.keyIndicators") }}</h3>
          </div>
          <div class="card-body">
            <div class="d-flex flex-column gap-5">
              <div>
                <div class="d-flex justify-content-between mb-1">
                  <span class="text-muted fs-7">{{ $t("reports.statisticalReports.gangPercentage") }}</span>
                  <span class="fw-bold">{{ formatPercentage(data.security_index.gang_percentage) }}</span>
                </div>
                <div class="progress h-6px">
                  <div class="progress-bar bg-danger" :style="{width: Math.min(data.security_index.gang_percentage, 100) + '%'}"></div>
                </div>
              </div>
              <div>
                <div class="d-flex justify-content-between mb-1">
                  <span class="text-muted fs-7">{{ $t("reports.statisticalReports.chronicDiseaseRate") }}</span>
                  <span class="fw-bold">{{ formatPercentage(data.medical_index.chronic_disease_rate) }}</span>
                </div>
                <div class="progress h-6px">
                  <div class="progress-bar bg-warning" :style="{width: Math.min(data.medical_index.chronic_disease_rate, 100) + '%'}"></div>
                </div>
              </div>
              <div>
                <div class="d-flex justify-content-between mb-1">
                  <span class="text-muted fs-7">{{ $t("reports.statisticalReports.occupancyRate") }}</span>
                  <span class="fw-bold">{{ formatPercentage(data.population_summary.occupancy_rate) }}</span>
                </div>
                <div class="progress h-6px">
                  <div class="progress-bar" :class="data.population_summary.occupancy_rate > 100 ? 'bg-danger' : 'bg-success'" :style="{width: Math.min(data.population_summary.occupancy_rate, 100) + '%'}"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-5 mt-0" v-if="data">
      <div class="col-xl-12">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.statisticalReports.occupancyByCenter") }}</h3>
          </div>
          <div class="card-body">
            <apexchart type="bar" height="350" :options="occupancyChartOptions" :series="occupancyChartSeries" />
          </div>
        </div>
      </div>
    </div>

    <!-- Center Table -->
    <div class="card mt-5" v-if="data">
      <div class="card-header">
        <h3 class="card-title">{{ $t("reports.statisticalReports.centerSummary") }}</h3>
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
        <div class="table-responsive">
          <table class="table table-row-dashed table-row-gray-300 gy-5">
            <thead>
              <tr class="fw-semibold fs-6 text-gray-800">
                <th>{{ $t("reports.statisticalReports.centerName") }}</th>
                <th class="text-end">{{ $t("reports.statisticalReports.capacity") }}</th>
                <th class="text-end">{{ $t("reports.inmateReports.population") }}</th>
                <th class="text-end">{{ $t("reports.statisticalReports.occupancyPct") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="center in data.population_summary.by_center" :key="center.id">
                <td>
                  <span class="fw-bold">{{ center.name }}</span>
                  <span class="text-muted ms-2">({{ center.code }})</span>
                </td>
                <td class="text-end">{{ formatNumber(center.capacity) }}</td>
                <td class="text-end">{{ formatNumber(center.population) }}</td>
                <td class="text-end">
                  <span class="badge" :class="center.occupancy_rate > 100 ? 'badge-danger' : center.occupancy_rate > 80 ? 'badge-warning' : 'badge-success'">
                    {{ formatPercentage(center.occupancy_rate) }}
                  </span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="fw-bolder">
                <td>Total</td>
                <td class="text-end">{{ formatNumber(data.population_summary.capacity) }}</td>
                <td class="text-end">{{ formatNumber(data.population_summary.total) }}</td>
                <td class="text-end">
                  <span class="badge" :class="data.population_summary.occupancy_rate > 100 ? 'badge-danger' : 'badge-success'">
                    {{ formatPercentage(data.population_summary.occupancy_rate) }}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
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
import { CHART_COLORS, formatNumber, formatPercentage, exportToPDF, exportToExcel } from "../composables/useReportExport";

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
    const res = await ApiService.query("reports/statistical", params);
    if (res.data.status === "success") data.value = res.data.data;
  } catch {
    Swal.fire({ icon: "error", title: t("common.error"), text: t("reports.errorGenerating") });
  } finally {
    loading.value = false;
  }
};

const trendChartOptions = computed(() => ({
  chart: { type: "area", toolbar: { show: false }, stacked: false },
  xaxis: { categories: (data.value?.population_trend || []).map((t: any) => t.month) },
  colors: [CHART_COLORS[1], CHART_COLORS[2], CHART_COLORS[0]],
  stroke: { curve: "smooth", width: 2 },
  fill: { type: "gradient", gradient: { opacityFrom: 0.4, opacityTo: 0.1 } },
  dataLabels: { enabled: false },
  legend: { position: "top" },
}));
const trendChartSeries = computed(() => {
  const trend = data.value?.population_trend || [];
  return [
    { name: t("reports.statisticalReports.admissions"), data: trend.map((t: any) => t.admissions) },
    { name: t("reports.statisticalReports.releases"), data: trend.map((t: any) => t.releases) },
    { name: t("reports.statisticalReports.netChange"), data: trend.map((t: any) => t.net_change) },
  ];
});

const occupancyChartOptions = computed(() => {
  const byCenter = data.value?.population_summary?.by_center || [];
  return {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, barHeight: "60%" } },
    xaxis: { categories: byCenter.map((c: any) => c.code || c.name), max: Math.max(...byCenter.map((c: any) => c.occupancy_rate), 100) + 20 },
    colors: [CHART_COLORS[0]],
    dataLabels: { enabled: true, formatter: (val: number) => val + "%" },
    annotations: {
      xaxis: [{ x: 100, borderColor: "#F1416C", strokeDashArray: 4, label: { text: "100%", style: { color: "#F1416C" } } }],
    },
  };
});
const occupancyChartSeries = computed(() => [{
  name: t("reports.statisticalReports.occupancyPct"),
  data: (data.value?.population_summary?.by_center || []).map((c: any) => c.occupancy_rate),
}]);

const doExportPDF = () => {
  const byCenter = data.value?.population_summary?.by_center || [];
  exportToPDF(
    t("reports.statisticalReports.centerSummary"),
    [t("reports.statisticalReports.centerName"), t("reports.statisticalReports.capacity"), t("reports.inmateReports.population"), t("reports.statisticalReports.occupancyPct")],
    byCenter.map((c: any) => [c.name, c.capacity, c.population, c.occupancy_rate + "%"]),
    true,
  );
};
const doExportExcel = () => {
  const byCenter = data.value?.population_summary?.by_center || [];
  exportToExcel(t("reports.statisticalReports.centerSummary"), [{
    name: "Centros",
    columns: [t("reports.statisticalReports.centerName"), "Codigo", t("reports.statisticalReports.capacity"), t("reports.inmateReports.population"), t("reports.statisticalReports.occupancyPct")],
    rows: byCenter.map((c: any) => [c.name, c.code, c.capacity, c.population, c.occupancy_rate]),
  }]);
};

onMounted(() => { loadCenters(); generateReport(); });
</script>
