<template>
  <div class="container-fluid">
    <div class="d-flex flex-column">
      <h1 class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">
        {{ $t("reports.securityReports.title") }}
      </h1>
      <div class="text-muted fw-semibold fs-7">{{ $t("reports.securityReports.subtitle") }}</div>
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
      <div class="col-xl-2">
        <div class="card card-flush">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-50px me-5">
                <span class="symbol-label bg-light-danger">
                  <i class="bi bi-exclamation-octagon fs-2x text-danger"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.securityReports.totalIncidents") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.incidents.total) }}</div>
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
                  <i class="bi bi-bell fs-2x text-warning"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.securityReports.activeAlerts") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.alerts.total_active) }}</div>
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
                <span class="symbol-label bg-light-primary">
                  <i class="bi bi-people fs-2x text-primary"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.securityReports.gangMembers") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.gangs.total) }}</div>
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
                  <i class="bi bi-eye fs-2x text-info"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.securityReports.monitoring") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.monitoring.total_records) }}</div>
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
                  <i class="bi bi-door-closed fs-2x text-success"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.securityReports.requiresSingleCell") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.classifications?.requires_single_cell || 0) }}</div>
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
                  <i class="bi bi-speedometer2 fs-2x text-dark"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-7 text-gray-400">{{ $t("reports.securityReports.avgOverallRisk") }}</div>
                <div class="fs-2 fw-bold">{{ data.classifications?.risk_scores?.avg_overall || 0 }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="row g-5 mt-0" v-if="data">
      <div class="col-xl-4">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.securityReports.bySeverity") }}</h3>
          </div>
          <div class="card-body">
            <apexchart type="bar" height="300" :options="severityChartOptions" :series="severityChartSeries" />
          </div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.securityReports.gangDistribution") }}</h3>
          </div>
          <div class="card-body">
            <apexchart type="donut" height="300" :options="gangChartOptions" :series="gangChartSeries" />
          </div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.securityReports.incidentsTrend") }}</h3>
          </div>
          <div class="card-body">
            <apexchart type="line" height="300" :options="trendChartOptions" :series="trendChartSeries" />
          </div>
        </div>
      </div>
    </div>

    <!-- New Charts: Affiliation Level + Risk Scores -->
    <div class="row g-5 mt-0" v-if="data">
      <div class="col-xl-6" v-if="Object.keys(data.gangs?.by_affiliation_level || {}).length">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.securityReports.affiliationLevel") }}</h3>
          </div>
          <div class="card-body">
            <apexchart type="bar" height="300" :options="affiliationChartOptions" :series="affiliationChartSeries" />
          </div>
        </div>
      </div>
      <div class="col-xl-6" v-if="data.classifications?.risk_scores">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.securityReports.riskScores") }}</h3>
          </div>
          <div class="card-body">
            <apexchart type="bar" height="300" :options="riskChartOptions" :series="riskChartSeries" />
          </div>
        </div>
      </div>
    </div>

    <!-- Tables -->
    <div class="row g-5 mt-0" v-if="data">
      <div class="col-xl-4">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.securityReports.incidentsByStatus") }}</h3>
          </div>
          <div class="card-body">
            <table class="table table-row-dashed table-row-gray-300 gy-5">
              <thead>
                <tr class="fw-semibold fs-6 text-gray-800">
                  <th>{{ $t("reports.securityReports.status") }}</th>
                  <th class="text-end">{{ $t("reports.inmateReports.count") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(total, status) in data.incidents.by_status" :key="status">
                  <td>
                    <span class="badge" :class="getStatusBadge(String(status))">{{ status }}</span>
                  </td>
                  <td class="text-end fw-bold">{{ formatNumber(total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.securityReports.alertsByPriority") }}</h3>
          </div>
          <div class="card-body">
            <table class="table table-row-dashed table-row-gray-300 gy-5">
              <thead>
                <tr class="fw-semibold fs-6 text-gray-800">
                  <th>{{ $t("reports.securityReports.priority") }}</th>
                  <th class="text-end">{{ $t("reports.inmateReports.count") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(total, priority) in data.alerts.by_priority" :key="priority">
                  <td>
                    <span class="badge" :class="getPriorityBadge(String(priority))">{{ priority }}</span>
                  </td>
                  <td class="text-end fw-bold">{{ formatNumber(total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-xl-4" v-if="data.gangs?.by_clique?.length">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.securityReports.byClique") }}</h3>
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
                <tr v-for="(item, idx) in data.gangs.by_clique" :key="idx">
                  <td>{{ item.name }}</td>
                  <td class="text-end fw-bold">{{ formatNumber(item.total) }}</td>
                </tr>
              </tbody>
            </table>
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
import { CHART_COLORS, SEVERITY_COLORS, formatNumber, exportToPDF, exportToExcel, objectToRows } from "../composables/useReportExport";

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
    const res = await ApiService.query("reports/security", params);
    if (res.data.status === "success") data.value = res.data.data;
  } catch {
    Swal.fire({ icon: "error", title: t("common.error"), text: t("reports.errorGenerating") });
  } finally {
    loading.value = false;
  }
};

const severityChartOptions = computed(() => {
  const keys = Object.keys(data.value?.incidents?.by_severity || {});
  return {
    chart: { type: "bar", toolbar: { show: false } },
    xaxis: { categories: keys },
    colors: keys.map((k) => SEVERITY_COLORS[k] || CHART_COLORS[6]),
    plotOptions: { bar: { distributed: true, columnWidth: "50%" } },
    dataLabels: { enabled: true },
    legend: { show: false },
  };
});
const severityChartSeries = computed(() => [{
  name: t("reports.securityReports.incidents"),
  data: Object.values(data.value?.incidents?.by_severity || {}),
}]);

const gangChartOptions = computed(() => {
  const keys = Object.keys(data.value?.gangs?.by_type || {});
  return {
    chart: { type: "donut" },
    labels: keys,
    colors: CHART_COLORS.slice(0, keys.length),
    legend: { position: "bottom" },
  };
});
const gangChartSeries = computed(() =>
  Object.values(data.value?.gangs?.by_type || {}),
);

const trendChartOptions = computed(() => ({
  chart: { type: "line", toolbar: { show: false } },
  xaxis: { categories: (data.value?.incidents?.trend_last_12_months || []).map((t: any) => t.month) },
  colors: [CHART_COLORS[2]],
  stroke: { curve: "smooth", width: 3 },
  markers: { size: 4 },
}));
const trendChartSeries = computed(() => [{
  name: t("reports.securityReports.incidents"),
  data: (data.value?.incidents?.trend_last_12_months || []).map((t: any) => t.count),
}]);

// Affiliation level chart
const affiliationChartOptions = computed(() => {
  const keys = Object.keys(data.value?.gangs?.by_affiliation_level || {});
  return {
    chart: { type: "bar", toolbar: { show: false } },
    xaxis: { categories: keys },
    colors: [CHART_COLORS[3]],
    plotOptions: { bar: { horizontal: true, barHeight: "60%" } },
    dataLabels: { enabled: true },
  };
});
const affiliationChartSeries = computed(() => [{
  name: t("reports.total"),
  data: Object.values(data.value?.gangs?.by_affiliation_level || {}),
}]);

// Risk scores chart
const riskChartOptions = computed(() => {
  const rs = data.value?.classifications?.risk_scores || {};
  return {
    chart: { type: "bar", toolbar: { show: false } },
    xaxis: {
      categories: [
        t("reports.securityReports.avgViolenceRisk"),
        t("reports.securityReports.avgEscapeRisk"),
        t("reports.securityReports.avgOverallRisk"),
      ],
    },
    colors: ["#f1416c", "#ffc700", "#7239ea"],
    plotOptions: { bar: { distributed: true, columnWidth: "50%" } },
    dataLabels: { enabled: true },
    legend: { show: false },
    yaxis: { max: 100 },
  };
});
const riskChartSeries = computed(() => {
  const rs = data.value?.classifications?.risk_scores || {};
  return [{
    name: t("reports.securityReports.riskScores"),
    data: [rs.avg_violence || 0, rs.avg_escape || 0, rs.avg_overall || 0],
  }];
});

const getStatusBadge = (status: string) => {
  const map: Record<string, string> = { pending: "badge-warning", investigating: "badge-info", resolved: "badge-success", dismissed: "badge-secondary" };
  return map[status] || "badge-secondary";
};
const getPriorityBadge = (priority: string) => {
  const map: Record<string, string> = { low: "badge-success", medium: "badge-warning", high: "badge-danger", critical: "badge-dark" };
  return map[priority] || "badge-secondary";
};

const doExportPDF = () => {
  const rows = objectToRows(data.value?.incidents?.by_status);
  exportToPDF(
    t("reports.securityReports.title"),
    [t("reports.securityReports.status"), t("reports.inmateReports.count")],
    rows,
  );
};
const doExportExcel = () => {
  const d = data.value;
  if (!d) return;
  const sheets: any[] = [];
  sheets.push({
    name: "Incidentes",
    columns: ["Estado", "Total"],
    rows: objectToRows(d.incidents?.by_status),
  });
  sheets.push({
    name: "Pandillas",
    columns: ["Tipo", "Total"],
    rows: objectToRows(d.gangs?.by_type),
  });
  sheets.push({
    name: "Nivel Afiliación",
    columns: ["Nivel", "Total"],
    rows: objectToRows(d.gangs?.by_affiliation_level),
  });
  if (d.gangs?.by_clique?.length) {
    sheets.push({
      name: "Clicas",
      columns: ["Clica", "Total"],
      rows: d.gangs.by_clique.map((c: any) => [c.name, c.total]),
    });
  }
  exportToExcel(t("reports.securityReports.title"), sheets);
};

onMounted(() => { loadCenters(); generateReport(); });
</script>
