<template>
  <div class="container-fluid">
    <div class="d-flex flex-column">
      <h1 class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">
        {{ $t("reports.medicalReports.title") }}
      </h1>
      <div class="text-muted fw-semibold fs-7">{{ $t("reports.medicalReports.subtitle") }}</div>
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
          <div class="col-md-3">
            <label class="form-label">{{ $t("reports.inmateReports.center") }}</label>
            <select v-model="filters.centerId" class="form-select">
              <option value="">{{ $t("reports.inmateReports.allCenters") }}</option>
              <option v-for="c in centers" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">{{ $t("reports.gender") }}</label>
            <select v-model="filters.gender" class="form-select">
              <option value="">{{ $t("reports.allGenders") }}</option>
              <option value="M">{{ $t("reports.male") }}</option>
              <option value="F">{{ $t("reports.female") }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">{{ $t("reports.dateFrom") }}</label>
            <input type="date" v-model="filters.dateFrom" class="form-control" />
          </div>
          <div class="col-md-3">
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
                <span class="symbol-label bg-light-primary">
                  <i class="bi bi-heart-pulse fs-2x text-primary"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.medicalReports.totalProfiles") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.profiles.total) }}</div>
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
                  <i class="bi bi-capsule fs-2x text-warning"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.medicalReports.withAllergies") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.profiles.with_allergies) }}</div>
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
                  <i class="bi bi-bandaid fs-2x text-danger"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.medicalReports.withChronicDiseases") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.profiles.with_chronic_diseases) }}</div>
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
                  <i class="bi bi-universal-access fs-2x text-info"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.medicalReports.withDisabilities") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.profiles.with_disabilities) }}</div>
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
                  <i class="bi bi-brush fs-2x text-success"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-6 text-gray-400">{{ $t("reports.medicalReports.withTattoos") }}</div>
                <div class="fs-2 fw-bold">{{ formatNumber(data.physical_profile?.with_tattoos || 0) }}</div>
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
                  <i class="bi bi-rulers fs-2x text-dark"></i>
                </span>
              </div>
              <div>
                <div class="fw-bold fs-7 text-gray-400">{{ $t("reports.medicalReports.avgHeight") }} / {{ $t("reports.medicalReports.avgWeight") }}</div>
                <div class="fs-3 fw-bold">{{ data.physical_profile?.avg_height || 0 }} / {{ data.physical_profile?.avg_weight || 0 }}</div>
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
            <h3 class="card-title">{{ $t("reports.medicalReports.bloodType") }}</h3>
          </div>
          <div class="card-body">
            <apexchart type="donut" height="300" :options="bloodChartOptions" :series="bloodChartSeries" />
          </div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.medicalReports.healthStatus") }}</h3>
          </div>
          <div class="card-body">
            <apexchart type="donut" height="300" :options="healthStatusChartOptions" :series="healthStatusChartSeries" v-if="Object.keys(data.health_status || {}).length" />
            <div v-else class="text-center text-muted py-10">{{ $t("reports.noData") }}</div>
          </div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.medicalReports.mentalHealth") }}</h3>
          </div>
          <div class="card-body">
            <apexchart type="donut" height="300" :options="mentalChartOptions" :series="mentalChartSeries" />
          </div>
        </div>
      </div>
    </div>

    <div class="row g-5 mt-0" v-if="data">
      <div class="col-xl-8">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.medicalReports.consultationsTrend") }}</h3>
          </div>
          <div class="card-body">
            <apexchart type="line" height="300" :options="trendChartOptions" :series="trendChartSeries" />
          </div>
        </div>
      </div>
      <div class="col-xl-4" v-if="data.physical_profile">
        <div class="card card-flush h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.medicalReports.physicalProfile") }}</h3>
          </div>
          <div class="card-body">
            <table class="table table-row-dashed table-row-gray-300 gy-5">
              <tbody>
                <tr>
                  <td class="fw-semibold">{{ $t("reports.medicalReports.totalProfilesTooltip") }}</td>
                  <td class="text-end fw-bold">{{ formatNumber(data.physical_profile.total_profiles) }}</td>
                </tr>
                <tr>
                  <td class="fw-semibold">{{ $t("reports.medicalReports.avgHeight") }}</td>
                  <td class="text-end fw-bold">{{ data.physical_profile.avg_height }} cm</td>
                </tr>
                <tr>
                  <td class="fw-semibold">{{ $t("reports.medicalReports.avgWeight") }}</td>
                  <td class="text-end fw-bold">{{ data.physical_profile.avg_weight }} kg</td>
                </tr>
                <tr>
                  <td class="fw-semibold">{{ $t("reports.medicalReports.withTattoos") }}</td>
                  <td class="text-end fw-bold">{{ formatNumber(data.physical_profile.with_tattoos) }}</td>
                </tr>
                <tr>
                  <td class="fw-semibold">{{ $t("reports.medicalReports.withScars") }}</td>
                  <td class="text-end fw-bold">{{ formatNumber(data.physical_profile.with_scars) }}</td>
                </tr>
                <tr v-if="data.profiles.pregnancy_count > 0">
                  <td class="fw-semibold">{{ $t("reports.medicalReports.pregnantCount") }}</td>
                  <td class="text-end fw-bold">{{ formatNumber(data.profiles.pregnancy_count) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Consultations Table -->
    <div class="row g-5 mt-0" v-if="data">
      <div class="col-xl-6">
        <div class="card card-flush">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.medicalReports.consultationsByType") }}</h3>
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
                <tr v-for="(item, idx) in data.consultations.by_type" :key="idx">
                  <td>{{ item.consultation_type || 'N/A' }}</td>
                  <td class="text-end fw-bold">{{ formatNumber(item.total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-xl-6">
        <div class="card card-flush">
          <div class="card-header">
            <h3 class="card-title">{{ $t("reports.medicalReports.activeMedications") }}</h3>
          </div>
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-center py-10">
              <div class="text-center">
                <div class="fs-1 fw-bolder text-primary">{{ formatNumber(data.treatments.active_medications) }}</div>
                <div class="text-muted fs-6 mt-2">{{ $t("reports.medicalReports.activeMedications") }}</div>
              </div>
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
import { CHART_COLORS, formatNumber, exportToPDF, exportToExcel } from "../composables/useReportExport";

const { t } = useI18n();
const loading = ref(false);
const data = ref<any>(null);
const centers = ref<{ id: number; name: string }[]>([]);
const filters = ref({ centerId: "", gender: "", dateFrom: "", dateTo: "" });

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
    if (filters.value.gender) params.gender = filters.value.gender;
    if (filters.value.dateFrom) params.date_from = filters.value.dateFrom;
    if (filters.value.dateTo) params.date_to = filters.value.dateTo;
    const res = await ApiService.query("reports/medical", params);
    if (res.data.status === "success") data.value = res.data.data;
  } catch {
    Swal.fire({ icon: "error", title: t("common.error"), text: t("reports.errorGenerating") });
  } finally {
    loading.value = false;
  }
};

const bloodChartOptions = computed(() => {
  const items = data.value?.profiles?.blood_type_distribution || [];
  return {
    chart: { type: "donut" },
    labels: items.map((i: any) => i.name || "N/A"),
    colors: CHART_COLORS.slice(0, items.length),
    legend: { position: "bottom" },
  };
});
const bloodChartSeries = computed(() =>
  (data.value?.profiles?.blood_type_distribution || []).map((i: any) => i.total),
);

const healthStatusChartOptions = computed(() => {
  const hs = data.value?.health_status || {};
  return {
    chart: { type: "donut" },
    labels: Object.keys(hs),
    colors: ["#50cd89", "#009ef7", "#ffc700", "#f1416c", "#7239ea"],
    legend: { position: "bottom" },
  };
});
const healthStatusChartSeries = computed(() =>
  Object.values(data.value?.health_status || {}),
);

const mentalChartOptions = computed(() => {
  const items = data.value?.profiles?.mental_health_distribution || [];
  return {
    chart: { type: "donut" },
    labels: items.map((i: any) => i.name || "N/A"),
    colors: [CHART_COLORS[1], CHART_COLORS[3], CHART_COLORS[2], CHART_COLORS[4]],
    legend: { position: "bottom" },
  };
});
const mentalChartSeries = computed(() =>
  (data.value?.profiles?.mental_health_distribution || []).map((i: any) => i.total),
);

const trendChartOptions = computed(() => ({
  chart: { type: "line", toolbar: { show: false } },
  xaxis: { categories: (data.value?.consultations?.trend_last_12_months || []).map((t: any) => t.month) },
  colors: [CHART_COLORS[0]],
  stroke: { curve: "smooth", width: 3 },
  markers: { size: 4 },
}));
const trendChartSeries = computed(() => [{
  name: t("reports.medicalReports.consultations"),
  data: (data.value?.consultations?.trend_last_12_months || []).map((t: any) => t.count),
}]);

const doExportPDF = () => {
  const items = data.value?.consultations?.by_type || [];
  exportToPDF(
    t("reports.medicalReports.title"),
    [t("reports.medicalReports.type"), t("reports.inmateReports.count")],
    items.map((i: any) => [i.consultation_type || "N/A", i.total]),
  );
};
const doExportExcel = () => {
  const d = data.value;
  if (!d) return;
  const sheets: any[] = [];
  sheets.push({
    name: "Consultas",
    columns: ["Tipo", "Total"],
    rows: (d.consultations?.by_type || []).map((i: any) => [i.consultation_type || "N/A", i.total]),
  });
  sheets.push({
    name: "Perfil Físico",
    columns: ["Indicador", "Valor"],
    rows: [
      ["Total Perfiles", d.physical_profile?.total_profiles || 0],
      ["Prom. Altura (cm)", d.physical_profile?.avg_height || 0],
      ["Prom. Peso (kg)", d.physical_profile?.avg_weight || 0],
      ["Con Tatuajes", d.physical_profile?.with_tattoos || 0],
      ["Con Cicatrices", d.physical_profile?.with_scars || 0],
    ],
  });
  sheets.push({
    name: "Estado Salud",
    columns: ["Estado", "Total"],
    rows: Object.entries(d.health_status || {}).map(([k, v]) => [k, v]),
  });
  exportToExcel(t("reports.medicalReports.title"), sheets);
};

onMounted(() => { loadCenters(); generateReport(); });
</script>
