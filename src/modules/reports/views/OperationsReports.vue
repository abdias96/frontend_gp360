<template>
  <div class="container-fluid">
    <div class="d-flex flex-column">
      <h1 class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">
        {{ $t("reports.operationsReports.title") }}
      </h1>
      <div class="text-muted fw-semibold fs-7">{{ $t("reports.operationsReports.subtitle") }}</div>
    </div>

    <!-- Filters -->
    <div class="card mt-5">
      <div class="card-header">
        <h3 class="card-title">{{ $t("reports.filters") }}</h3>
        <div class="card-toolbar">
          <button @click="doExportExcel" class="btn btn-sm btn-light-success me-2" :disabled="!data">
            <i class="bi bi-file-earmark-excel me-1"></i> {{ $t("reports.exportExcel") }}
          </button>
          <button @click="doExportPDF" class="btn btn-sm btn-light-primary me-2" :disabled="!data">
            <i class="bi bi-file-pdf me-1"></i> {{ $t("reports.exportPDF") }}
          </button>
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
          <div class="col-md-4">
            <label class="form-label">{{ $t("reports.dateFrom") }}</label>
            <input type="date" v-model="filters.dateFrom" class="form-control" />
          </div>
          <div class="col-md-4">
            <label class="form-label">{{ $t("reports.dateTo") }}</label>
            <input type="date" v-model="filters.dateTo" class="form-control" />
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
                  <i class="bi bi-clipboard-check fs-2x text-primary"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.operationsReports.countsToday") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.counts.total_today) }}</div>
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
                  <i class="bi bi-exclamation-diamond fs-2x text-danger"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.operationsReports.discrepancies") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.counts.discrepancies) }}</div>
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
                  <i class="bi bi-arrow-left-right fs-2x text-success"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.operationsReports.totalTransfers") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.transfers.total) }}</div>
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
                  <i class="bi bi-door-open fs-2x text-info"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.operationsReports.totalReleases") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.releases.total) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row 1 -->
    <div class="row g-5 mt-0" v-if="data">
      <div class="col-xl-4">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.operationsReports.visitsByType") }}</h3>
          </div>
          <div class="card-body">
            <apexchart type="donut" height="300" :options="visitChartOptions" :series="visitChartSeries" />
          </div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.operationsReports.transfersByStatus") }}</h3>
          </div>
          <div class="card-body">
            <apexchart type="bar" height="300" :options="transferChartOptions" :series="transferChartSeries" />
          </div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.operationsReports.releasesTrend") }}</h3>
          </div>
          <div class="card-body">
            <apexchart type="line" height="300" :options="releaseTrendOptions" :series="releaseTrendSeries" />
          </div>
        </div>
      </div>
    </div>

    <!-- Visits Trend Chart -->
    <div class="row g-5 mt-0" v-if="data && data.visits?.trend_last_12_months?.length">
      <div class="col-xl-12">
        <div class="card card-flush">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.operationsReports.visitsTrend") }}</h3>
          </div>
          <div class="card-body">
            <apexchart type="line" height="300" :options="visitsTrendOptions" :series="visitsTrendSeries" />
          </div>
        </div>
      </div>
    </div>

    <!-- Tables -->
    <div class="row g-5 mt-0" v-if="data">
      <div class="col-xl-4">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.operationsReports.visitsSummary") }}</h3>
          </div>
          <div class="card-body">
            <table class="table table-row-dashed table-row-gray-300 gy-5">
              <thead>
                <tr class="fw-semibold fs-6 text-gray-800">
                  <th>{{ $t("reports.medicalReports.type") }}</th>
                  <th class="text-end">{{ $t("reports.inmateReports.count") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in data.visits.by_type" :key="idx">
                  <td>{{ item.name || 'N/A' }}</td>
                  <td class="text-end fw-bold">{{ formatNumber(item.total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-xl-4" v-if="data.releases?.by_reason?.length">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.operationsReports.byReason") }}</h3>
          </div>
          <div class="card-body">
            <table class="table table-row-dashed table-row-gray-300 gy-5">
              <thead>
                <tr class="fw-semibold fs-6 text-gray-800">
                  <th>{{ $t("reports.operationsReports.reason") }}</th>
                  <th class="text-end">{{ $t("reports.total") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in data.releases.by_reason" :key="idx">
                  <td>{{ item.name }}</td>
                  <td class="text-end fw-bold">{{ formatNumber(item.total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-xl-4" v-if="data.transfers?.by_center?.length">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.operationsReports.byOriginDestination") }}</h3>
          </div>
          <div class="card-body">
            <table class="table table-row-dashed table-row-gray-300 gy-5">
              <thead>
                <tr class="fw-semibold fs-6 text-gray-800">
                  <th>{{ $t("reports.operationsReports.origin") }}</th>
                  <th>{{ $t("reports.operationsReports.destination") }}</th>
                  <th class="text-end">{{ $t("reports.total") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in data.transfers.by_center" :key="idx">
                  <td>{{ item.origin }}</td>
                  <td>{{ item.destination }}</td>
                  <td class="text-end fw-bold">{{ formatNumber(item.total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Compliance -->
    <div class="card mt-5" v-if="data">
      <div class="card-header">
        <h3 class="card-title">{{ $t("reports.operationsReports.complianceRate") }}</h3>
      </div>
      <div class="card-body">
        <div class="d-flex flex-column align-items-center justify-content-center py-5">
          <div class="fs-1 fw-bolder" :class="data.counts.compliance_rate >= 90 ? 'text-success' : data.counts.compliance_rate >= 70 ? 'text-warning' : 'text-danger'">
            {{ formatPercentage(data.counts.compliance_rate) }}
          </div>
          <div class="text-muted fs-6 mt-2">{{ $t("reports.operationsReports.countCompliance") }}</div>
          <div class="mt-5 w-50">
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted fs-7">{{ $t("reports.operationsReports.totalVisits") }}</span>
              <span class="fw-bold">{{ formatNumber(data.visits.total) }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted fs-7">{{ $t("reports.operationsReports.activeVisits") }}</span>
              <span class="fw-bold">{{ formatNumber(data.visits.active) }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted fs-7">{{ $t("reports.operationsReports.movements") }}</span>
              <span class="fw-bold">{{ formatNumber(data.movements.total) }}</span>
            </div>
          </div>
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
import { CHART_COLORS, formatNumber, formatPercentage, exportToPDF, exportToExcel, arrayToRows } from "../composables/useReportExport";

const { t } = useI18n();
const loading = ref(false);
const data = ref<any>(null);
const centers = ref<{ id: number; name: string }[]>([]);
const filters = ref({ centerId: "", dateFrom: "", dateTo: "" });

const loadCenters = async () => {
  try {
    const res = await ApiService.query("catalogs/centers", { simple: true });
    if (res.data.success) centers.value = res.data.data || [];
  } catch { /* ignore */ }
};

const generateReport = async () => {
  loading.value = true;
  data.value = null;
  try {
    const params: any = {};
    if (filters.value.centerId) params.center_id = filters.value.centerId;
    if (filters.value.dateFrom) params.date_from = filters.value.dateFrom;
    if (filters.value.dateTo) params.date_to = filters.value.dateTo;
    const res = await ApiService.query("reports/operations", params);
    if (res.data.status === "success") data.value = res.data.data;
  } catch {
    Swal.fire({ icon: "error", title: t("common.error"), text: t("reports.errorGenerating") });
  } finally {
    loading.value = false;
  }
};

const visitChartOptions = computed(() => {
  const items = data.value?.visits?.by_type || [];
  return {
    chart: { type: "donut" },
    labels: items.map((i: any) => i.name || "N/A"),
    colors: CHART_COLORS.slice(0, items.length),
    legend: { position: "bottom" },
  };
});
const visitChartSeries = computed(() =>
  (data.value?.visits?.by_type || []).map((i: any) => i.total),
);

const transferChartOptions = computed(() => ({
  chart: { type: "bar", toolbar: { show: false } },
  xaxis: { categories: Object.keys(data.value?.transfers?.by_status || {}) },
  colors: [CHART_COLORS[1]],
  plotOptions: { bar: { columnWidth: "50%" } },
  dataLabels: { enabled: true },
}));
const transferChartSeries = computed(() => [{
  name: t("reports.operationsReports.transfers"),
  data: Object.values(data.value?.transfers?.by_status || {}),
}]);

const releaseTrendOptions = computed(() => ({
  chart: { type: "line", toolbar: { show: false } },
  xaxis: { categories: (data.value?.releases?.trend_last_12_months || []).map((t: any) => t.month) },
  colors: [CHART_COLORS[5]],
  stroke: { curve: "smooth", width: 3 },
  markers: { size: 4 },
}));
const releaseTrendSeries = computed(() => [{
  name: t("reports.operationsReports.releases"),
  data: (data.value?.releases?.trend_last_12_months || []).map((t: any) => t.count),
}]);

// Visits trend (new)
const visitsTrendOptions = computed(() => ({
  chart: { type: "line", toolbar: { show: false } },
  xaxis: { categories: (data.value?.visits?.trend_last_12_months || []).map((t: any) => t.month) },
  colors: [CHART_COLORS[0]],
  stroke: { curve: "smooth", width: 3 },
  markers: { size: 4 },
}));
const visitsTrendSeries = computed(() => [{
  name: t("reports.operationsReports.totalVisits"),
  data: (data.value?.visits?.trend_last_12_months || []).map((t: any) => t.count),
}]);

const doExportPDF = () => {
  const items = data.value?.visits?.by_type || [];
  exportToPDF(
    t("reports.operationsReports.title"),
    [t("reports.medicalReports.type"), t("reports.inmateReports.count")],
    arrayToRows(items),
  );
};
const doExportExcel = () => {
  const d = data.value;
  if (!d) return;
  const sheets: any[] = [];
  sheets.push({
    name: "Visitas",
    columns: ["Tipo", "Total"],
    rows: arrayToRows(d.visits?.by_type),
  });
  if (d.releases?.by_reason?.length) {
    sheets.push({
      name: "Liberaciones",
      columns: ["Motivo", "Total"],
      rows: d.releases.by_reason.map((i: any) => [i.name, i.total]),
    });
  }
  if (d.transfers?.by_center?.length) {
    sheets.push({
      name: "Traslados",
      columns: ["Origen", "Destino", "Total"],
      rows: d.transfers.by_center.map((i: any) => [i.origin, i.destination, i.total]),
    });
  }
  exportToExcel(t("reports.operationsReports.title"), sheets);
};

onMounted(() => { loadCenters(); generateReport(); });
</script>
