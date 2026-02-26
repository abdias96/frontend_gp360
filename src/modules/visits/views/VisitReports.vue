<template>
  <div class="container-fluid">
    <div class="d-flex flex-column">
      <h1 class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">
        {{ $t("visits.visitReports.title") }}
      </h1>
      <div class="text-muted fw-semibold fs-7">{{ $t("visits.visitReports.reportConfiguration") }}</div>
    </div>

    <!-- Filters -->
    <div class="card mt-5">
      <div class="card-header">
        <h3 class="card-title">{{ $t("visits.visitReports.filters") }}</h3>
        <div class="card-toolbar">
          <button @click="generateReport" class="btn btn-primary" :disabled="loading">
            <i class="bi bi-bar-chart me-1"></i> {{ $t("visits.visitReports.generateReport") }}
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">{{ $t("visits.visitReports.center") }}</label>
            <select v-model="filters.centerId" class="form-select">
              <option value="">{{ $t("visits.visitReports.allCenters") }}</option>
              <option v-for="c in centers" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">{{ $t("visits.visitReports.visitType") }}</label>
            <select v-model="filters.visitTypeId" class="form-select">
              <option value="">{{ $t("visits.visitReports.allTypes") }}</option>
              <option v-for="vt in visitTypes" :key="vt.id" :value="vt.id">{{ vt.name }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">{{ $t("visits.visitReports.status") }}</label>
            <select v-model="filters.status" class="form-select">
              <option value="">{{ $t("visits.visitReports.allStatuses") }}</option>
              <option value="pending">{{ $t("visits.visitStatus.pending") }}</option>
              <option value="approved">{{ $t("visits.visitStatus.approved") }}</option>
              <option value="in_progress">{{ $t("visits.visitStatus.in_progress") }}</option>
              <option value="completed">{{ $t("visits.visitStatus.completed") }}</option>
              <option value="cancelled">{{ $t("visits.visitStatus.cancelled") }}</option>
              <option value="rejected">{{ $t("visits.visitStatus.rejected") }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">{{ $t("visits.visitReports.startDate") }}</label>
            <input type="date" v-model="filters.dateFrom" class="form-control" />
          </div>
          <div class="col-md-2">
            <label class="form-label">{{ $t("visits.visitReports.endDate") }}</label>
            <input type="date" v-model="filters.dateTo" class="form-control" />
          </div>
        </div>
        <!-- Quick date buttons -->
        <div class="d-flex gap-2 mt-3">
          <button class="btn btn-sm btn-light-primary" @click="setDateRange('today')">{{ $t("visits.visitReports.dailyReport") }}</button>
          <button class="btn btn-sm btn-light-success" @click="setDateRange('week')">{{ $t("visits.visitReports.weeklyReport") }}</button>
          <button class="btn btn-sm btn-light-warning" @click="setDateRange('month')">{{ $t("visits.visitReports.monthlyReport") }}</button>
          <button class="btn btn-sm btn-light-info" @click="setDateRange('clear')">{{ $t("common.all") }}</button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="row g-5 mt-0" v-if="data">
      <div class="col-xl-2 col-md-4">
        <div class="card card-flush">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-50px me-5">
                <span class="symbol-label bg-light-primary">
                  <i class="bi bi-people-fill fs-2x text-primary"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-7 text-gray-400">{{ $t("visits.visitReports.totalVisits") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.summary.total) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-2 col-md-4">
        <div class="card card-flush">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-50px me-5">
                <span class="symbol-label bg-light-success">
                  <i class="bi bi-check-circle fs-2x text-success"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-7 text-gray-400">{{ $t("visits.visitReports.completedVisits") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.summary.completed) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-2 col-md-4">
        <div class="card card-flush">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-50px me-5">
                <span class="symbol-label bg-light-danger">
                  <i class="bi bi-x-circle fs-2x text-danger"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-7 text-gray-400">{{ $t("visits.visitReports.cancelledVisits") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.summary.cancelled) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-2 col-md-4">
        <div class="card card-flush">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-50px me-5">
                <span class="symbol-label bg-light-info">
                  <i class="bi bi-clock fs-2x text-info"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-7 text-gray-400">{{ $t("visits.visitReports.avgDuration") }}</div>
                <div class="fs-2 fw-bold">{{ data.summary.avg_duration }} {{ $t("visits.visitReports.minutes") }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-2 col-md-4">
        <div class="card card-flush">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-50px me-5">
                <span class="symbol-label bg-light-warning">
                  <i class="bi bi-person-badge fs-2x text-warning"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-7 text-gray-400">{{ $t("visits.visitReports.uniqueVisitors") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.summary.unique_visitors) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-2 col-md-4">
        <div class="card card-flush">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-50px me-5">
                <span class="symbol-label bg-light-dark">
                  <i class="bi bi-person-lines-fill fs-2x text-dark"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-7 text-gray-400">{{ $t("visits.visitReports.uniqueInmates") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.summary.unique_inmates) }}</div>
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
            <h3 class="card-title">{{ $t("visits.visitReports.visitsByType") }}</h3>
          </div>
          <div class="card-body">
            <apexchart v-if="typeChartSeries.length" type="donut" height="300" :options="typeChartOptions" :series="typeChartSeries" />
            <div v-else class="text-center py-10 text-muted">{{ $t("reports.noData") }}</div>
          </div>
        </div>
      </div>
      <div class="col-xl-8">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("visits.visitReports.visitsTrend") }}</h3>
          </div>
          <div class="card-body">
            <apexchart v-if="data.trend.length" type="area" height="300" :options="trendChartOptions" :series="trendChartSeries" />
            <div v-else class="text-center py-10 text-muted">{{ $t("reports.noData") }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status + Center charts -->
    <div class="row g-5 mt-0" v-if="data">
      <div class="col-xl-4">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("visits.visitReports.byStatus") }}</h3>
          </div>
          <div class="card-body">
            <apexchart v-if="statusChartSeries.length" type="pie" height="300" :options="statusChartOptions" :series="statusChartSeries" />
            <div v-else class="text-center py-10 text-muted">{{ $t("reports.noData") }}</div>
          </div>
        </div>
      </div>
      <div class="col-xl-8">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("visits.visitReports.byCenter") }}</h3>
          </div>
          <div class="card-body">
            <apexchart v-if="data.by_center.length" type="bar" height="300" :options="centerChartOptions" :series="centerChartSeries" />
            <div v-else class="text-center py-10 text-muted">{{ $t("reports.noData") }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Table -->
    <div class="card mt-5" v-if="data && data.details.length">
      <div class="card-header">
        <h3 class="card-title">{{ $t("visits.visitReports.visitDetails") }}</h3>
        <div class="card-toolbar">
          <button @click="doExportPDF" class="btn btn-sm btn-light-primary me-2">
            <i class="bi bi-file-pdf me-1"></i> {{ $t("visits.visitReports.exportPDF") }}
          </button>
          <button @click="doExportExcel" class="btn btn-sm btn-light-success">
            <i class="bi bi-file-earmark-excel me-1"></i> {{ $t("visits.visitReports.exportExcel") }}
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-row-dashed table-row-gray-300 gy-5">
            <thead>
              <tr class="fw-semibold fs-6 text-gray-800">
                <th>{{ $t("visits.visitReports.date") }}</th>
                <th>{{ $t("visits.visitReports.visitor") }}</th>
                <th>{{ $t("visits.visitReports.inmate") }}</th>
                <th>{{ $t("visits.visitReports.type") }}</th>
                <th class="text-end">{{ $t("visits.visitReports.duration") }}</th>
                <th>{{ $t("visits.visitReports.status") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="visit in data.details" :key="visit.id">
                <td>{{ formatDate(visit.date) }}</td>
                <td>{{ visit.visitor_name }}</td>
                <td>{{ visit.inmate_name }}</td>
                <td>
                  <span class="badge badge-light-info">{{ visit.visit_type || $t("visits.visitReports.noType") }}</span>
                </td>
                <td class="text-end">{{ visit.duration ? visit.duration + " " + $t("visits.visitReports.minutes") : "—" }}</td>
                <td>
                  <span :class="getStatusBadge(visit.status)">
                    {{ $t(`visits.visitStatus.${visit.status}`) }}
                  </span>
                </td>
              </tr>
            </tbody>
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
import { CHART_COLORS, formatNumber, exportToPDF, exportToExcel } from "@/modules/reports/composables/useReportExport";

const { t } = useI18n();
const loading = ref(false);
const data = ref<any>(null);
const centers = ref<{ id: number; name: string }[]>([]);
const visitTypes = ref<{ id: number; name: string }[]>([]);
const filters = ref({ centerId: "", visitTypeId: "", status: "", dateFrom: "", dateTo: "" });

const loadCenters = async () => {
  try {
    const res = await ApiService.query("catalogs/centers", { simple: true });
    if (res.data.success) centers.value = res.data.data || [];
  } catch { /* ignore */ }
};

const loadVisitTypes = async () => {
  try {
    const res = await ApiService.query("catalogs/visit-types", { simple: true });
    if (res.data.success) visitTypes.value = res.data.data || [];
  } catch { /* ignore */ }
};

const setDateRange = (range: string) => {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  if (range === "today") {
    filters.value.dateFrom = fmt(today);
    filters.value.dateTo = fmt(today);
  } else if (range === "week") {
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    filters.value.dateFrom = fmt(start);
    filters.value.dateTo = fmt(end);
  } else if (range === "month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    filters.value.dateFrom = fmt(start);
    filters.value.dateTo = fmt(end);
  } else {
    filters.value.dateFrom = "";
    filters.value.dateTo = "";
  }
  generateReport();
};

const generateReport = async () => {
  loading.value = true;
  data.value = null;
  try {
    const params: any = {};
    if (filters.value.centerId) params.center_id = filters.value.centerId;
    if (filters.value.visitTypeId) params.visit_type_id = filters.value.visitTypeId;
    if (filters.value.status) params.status = filters.value.status;
    if (filters.value.dateFrom) params.date_from = filters.value.dateFrom;
    if (filters.value.dateTo) params.date_to = filters.value.dateTo;
    const res = await ApiService.query("reports/visits", params);
    if (res.data.status === "success") data.value = res.data.data;
  } catch {
    Swal.fire({ icon: "error", title: t("common.error"), text: t("reports.errorGenerating") });
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("es-GT");
};

const getStatusBadge = (status: string) => {
  const map: Record<string, string> = {
    completed: "badge badge-light-success",
    cancelled: "badge badge-light-danger",
    rejected: "badge badge-light-danger",
    in_progress: "badge badge-light-primary",
    approved: "badge badge-light-info",
    pending: "badge badge-light-warning",
  };
  return map[status] || "badge badge-light";
};

// Charts
const typeChartSeries = computed(() => (data.value?.by_type || []).map((t: any) => t.total));
const typeChartOptions = computed(() => ({
  chart: { type: "donut" },
  labels: (data.value?.by_type || []).map((t: any) => t.name),
  colors: CHART_COLORS,
  legend: { position: "bottom" },
  dataLabels: { enabled: true },
}));

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  approved: "Aprobada",
  in_progress: "En Progreso",
  completed: "Completada",
  cancelled: "Cancelada",
  rejected: "Rechazada",
};
const statusChartSeries = computed(() => {
  const bs = data.value?.by_status || {};
  return Object.values(bs).filter((v: any) => v > 0);
});
const statusChartOptions = computed(() => {
  const bs = data.value?.by_status || {};
  const labels = Object.keys(bs).filter((k) => bs[k] > 0).map((k) => statusLabels[k] || k);
  return {
    chart: { type: "pie" },
    labels,
    colors: ["#FFC107", "#17A2B8", "#007BFF", "#28A745", "#DC3545", "#6C757D"],
    legend: { position: "bottom" },
    dataLabels: { enabled: true },
  };
});

const trendChartOptions = computed(() => ({
  chart: { type: "area", toolbar: { show: false } },
  xaxis: { categories: (data.value?.trend || []).map((t: any) => t.month) },
  colors: [CHART_COLORS[0], CHART_COLORS[1], CHART_COLORS[2]],
  stroke: { curve: "smooth", width: 2 },
  fill: { type: "gradient", gradient: { opacityFrom: 0.4, opacityTo: 0.1 } },
  dataLabels: { enabled: false },
  legend: { position: "top" },
}));
const trendChartSeries = computed(() => {
  const trend = data.value?.trend || [];
  return [
    { name: "Total", data: trend.map((t: any) => t.total) },
    { name: t("visits.visitReports.completedVisits"), data: trend.map((t: any) => t.completed) },
    { name: t("visits.visitReports.cancelledVisits"), data: trend.map((t: any) => t.cancelled) },
  ];
});

const centerChartOptions = computed(() => ({
  chart: { type: "bar", toolbar: { show: false } },
  plotOptions: { bar: { horizontal: true, barHeight: "60%" } },
  xaxis: { categories: (data.value?.by_center || []).map((c: any) => c.name) },
  colors: [CHART_COLORS[0]],
  dataLabels: { enabled: true },
}));
const centerChartSeries = computed(() => [{
  name: t("visits.visitReports.totalVisits"),
  data: (data.value?.by_center || []).map((c: any) => c.total),
}]);

// Exports
const doExportPDF = () => {
  const details = data.value?.details || [];
  exportToPDF(
    t("visits.visitReports.title"),
    [t("visits.visitReports.date"), t("visits.visitReports.visitor"), t("visits.visitReports.inmate"), t("visits.visitReports.type"), t("visits.visitReports.duration"), t("visits.visitReports.status")],
    details.map((v: any) => [formatDate(v.date), v.visitor_name, v.inmate_name, v.visit_type || "—", v.duration ? v.duration + " min" : "—", v.status]),
    true,
  );
};

const doExportExcel = () => {
  const details = data.value?.details || [];
  const byType = data.value?.by_type || [];
  const byCenter = data.value?.by_center || [];
  exportToExcel(t("visits.visitReports.title"), [
    {
      name: "Detalle Visitas",
      columns: [t("visits.visitReports.date"), t("visits.visitReports.visitor"), t("visits.visitReports.inmate"), t("visits.visitReports.type"), t("visits.visitReports.duration"), t("visits.visitReports.status")],
      rows: details.map((v: any) => [formatDate(v.date), v.visitor_name, v.inmate_name, v.visit_type || "—", v.duration || 0, v.status]),
    },
    {
      name: "Por Tipo",
      columns: [t("visits.visitReports.type"), "Total"],
      rows: byType.map((t: any) => [t.name, t.total]),
    },
    {
      name: "Por Centro",
      columns: [t("visits.visitReports.center"), "Total"],
      rows: byCenter.map((c: any) => [c.name, c.total]),
    },
    {
      name: "Resumen",
      columns: ["Indicador", "Valor"],
      rows: [
        [t("visits.visitReports.totalVisits"), data.value?.summary?.total || 0],
        [t("visits.visitReports.completedVisits"), data.value?.summary?.completed || 0],
        [t("visits.visitReports.cancelledVisits"), data.value?.summary?.cancelled || 0],
        [t("visits.visitReports.avgDuration"), (data.value?.summary?.avg_duration || 0) + " min"],
        [t("visits.visitReports.uniqueVisitors"), data.value?.summary?.unique_visitors || 0],
        [t("visits.visitReports.uniqueInmates"), data.value?.summary?.unique_inmates || 0],
      ],
    },
  ]);
};

onMounted(() => {
  loadCenters();
  loadVisitTypes();
  generateReport();
});
</script>
