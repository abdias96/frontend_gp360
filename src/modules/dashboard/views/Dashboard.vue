<template>
  <!--begin::Dashboard Penitenciario GP360-->
  <div class="dashboard-container">
    <!-- Título del Dashboard -->
    <div class="row mb-5">
      <div class="col-12">
        <h1 class="page-heading d-flex text-gray-900 fw-bold fs-3 flex-column justify-content-center my-0">
          {{ t('dashboard.prison.title') }}
          <span class="page-desc text-muted fs-7 fw-semibold pt-1">
            {{ t('dashboard.prison.subtitle') }}
          </span>
        </h1>
      </div>
    </div>

    <!-- Row 1: 4 Stat Cards principales -->
    <div class="row g-5 g-xl-8 mb-5">
      <!-- Población Total -->
      <div class="col-xl-3">
        <StatWidget
          :title="t('dashboard.prison.stats.totalPopulation')"
          :value="formatNumber(stats.totalInmates)"
          :description="t('dashboard.prison.stats.pplActive')"
          icon="profile-user"
          color="primary"
        />
      </div>

      <!-- Situación Jurídica: Preventiva / Sentenciados -->
      <div class="col-xl-3">
        <StatWidget
          :title="t('dashboard.prison.stats.legalStatus')"
          :value="formatNumber(stats.preventiveDetention)"
          :description="`${t('dashboard.prison.stats.preventive')} / ${formatNumber(stats.sentenced)} ${t('dashboard.prison.stats.sentenced')}`"
          icon="courthouse"
          color="warning"
        />
      </div>

      <!-- Cobertura Biométrica -->
      <div class="col-xl-3">
        <StatWidget
          :title="t('dashboard.prison.stats.biometricCoverage')"
          :value="formatNumber(stats.totalWithBiometrics)"
          :description="`${stats.biometricPercentage}% ${t('dashboard.prison.stats.enrolled')}`"
          icon="fingerprint-scanning"
          color="info"
          :percentage="stats.biometricPercentage"
          :showProgressBar="true"
        />
      </div>

      <!-- Verificación RENAP -->
      <div class="col-xl-3">
        <StatWidget
          :title="t('dashboard.prison.stats.renapVerification')"
          :value="formatNumber(stats.renapVerified)"
          :description="`${stats.renapPercentage}% ${t('dashboard.prison.stats.verified')} (${formatNumber(stats.renapProcessed)} ${t('dashboard.prison.stats.processed')})`"
          icon="shield-tick"
          color="success"
          :percentage="stats.renapPercentage"
          :showProgressBar="true"
        />
      </div>
    </div>

    <!-- Row 2: Población por Centro + Pandillas por Centro (8+4) -->
    <div class="row g-5 g-xl-8 mb-5">
      <!-- Población por Centro -->
      <div class="col-xl-8">
        <div class="card card-flush h-xl-100">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">{{ t('dashboard.prison.charts.populationByCenter') }}</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">{{ t('dashboard.prison.charts.updatedRealtime') }}</span>
            </h3>
            <div class="card-toolbar">
              <div class="btn-group btn-group-sm" role="group">
                <button
                  v-for="opt in centerFilterOptions"
                  :key="opt.value"
                  type="button"
                  class="btn"
                  :class="centerFilter === opt.value ? 'btn-primary' : 'btn-light-primary'"
                  @click="setCenterFilter(opt.value)"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>
          </div>
          <div class="card-body pt-5">
            <apexchart
              v-if="populationChartSeries.length"
              type="bar"
              :options="populationChartOptions"
              :series="populationChartSeries"
              height="380"
            />
            <div v-else class="d-flex align-items-center justify-content-center h-300px">
              <span class="spinner-border text-primary"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pandillas por Centro -->
      <div class="col-xl-4">
        <div class="card card-flush h-xl-100">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">{{ t('dashboard.prison.charts.gangDistribution') }}</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">{{ t('dashboard.prison.charts.byCenter') }}</span>
            </h3>
          </div>
          <div class="card-body pt-5">
            <apexchart
              v-if="gangChartSeries.length"
              type="bar"
              :options="gangChartOptions"
              :series="gangChartSeries"
              height="380"
            />
            <div v-else class="d-flex align-items-center justify-content-center h-300px">
              <span class="text-muted">{{ t('dashboard.prison.charts.noGangData') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 3: Top 10 Delitos + Severidad (8+4) -->
    <div class="row g-5 g-xl-8 mb-5">
      <!-- Top 10 Delitos -->
      <div class="col-xl-8">
        <div class="card card-flush h-xl-100">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">{{ t('dashboard.prison.charts.topCrimes') }}</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">{{ t('dashboard.prison.charts.mostFrequent') }}</span>
            </h3>
          </div>
          <div class="card-body pt-5">
            <apexchart
              v-if="topCrimesSeries.length"
              type="bar"
              :options="topCrimesOptions"
              :series="topCrimesSeries"
              height="380"
            />
            <div v-else class="d-flex align-items-center justify-content-center h-300px">
              <span class="text-muted">{{ t('dashboard.prison.charts.noCrimeData') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Severidad de Delitos -->
      <div class="col-xl-4">
        <div class="card card-flush h-xl-100">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">{{ t('dashboard.prison.charts.crimeSeverity') }}</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">{{ t('dashboard.prison.charts.byClassification') }}</span>
            </h3>
          </div>
          <div class="card-body d-flex flex-column align-items-center justify-content-center">
            <apexchart
              v-if="severityChartSeries.length"
              type="donut"
              :options="severityChartOptions"
              :series="severityChartSeries"
              height="250"
            />
            <div v-else class="d-flex align-items-center justify-content-center h-300px">
              <span class="text-muted">{{ t('dashboard.prison.charts.noCrimeData') }}</span>
            </div>
            <!-- Leyenda manual debajo del donut -->
            <div v-if="severityChartSeries.length" class="d-flex justify-content-around w-100 mt-4">
              <div v-for="(item, idx) in severityLegend" :key="idx" class="text-center">
                <span class="d-block fw-bold fs-4" :style="`color: ${item.color}`">{{ formatNumber(item.count) }}</span>
                <span class="text-muted fs-7">{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 4: Etapa Procesal + Demografía (6+6) -->
    <div class="row g-5 g-xl-8 mb-5">
      <!-- Etapa Procesal -->
      <div class="col-xl-6">
        <div class="card card-flush h-xl-100">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">{{ t('dashboard.prison.charts.proceduralStage') }}</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">{{ t('dashboard.prison.charts.activeCases') }}</span>
            </h3>
          </div>
          <div class="card-body pt-5">
            <apexchart
              v-if="proceduralStageSeries.length"
              type="bar"
              :options="proceduralStageOptions"
              :series="proceduralStageSeries"
              height="300"
            />
            <div v-else class="d-flex align-items-center justify-content-center h-300px">
              <span class="text-muted">{{ t('dashboard.prison.charts.noLegalData') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Demografía: Género + Edad -->
      <div class="col-xl-6">
        <div class="card card-flush h-xl-100">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">{{ t('dashboard.prison.charts.demographicDistribution') }}</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">{{ t('dashboard.prison.charts.byGenderAndAge') }}</span>
            </h3>
          </div>
          <div class="card-body">
            <div class="row">
              <!-- Género -->
              <div class="col-6">
                <div class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold fs-6 mb-3">{{ t('dashboard.prison.charts.byGender') }}</span>
                  <div class="d-flex align-items-center mb-2">
                    <span class="bullet bullet-dot bg-primary me-2"></span>
                    <span class="text-gray-600 flex-grow-1 me-4">{{ t('dashboard.prison.charts.male') }}</span>
                    <span class="text-gray-900 fw-bold">{{ formatNumber(stats.genderMale) }} ({{ stats.genderMalePercent }}%)</span>
                  </div>
                  <div class="d-flex align-items-center mb-4">
                    <span class="bullet bullet-dot bg-danger me-2"></span>
                    <span class="text-gray-600 flex-grow-1 me-4">{{ t('dashboard.prison.charts.female') }}</span>
                    <span class="text-gray-900 fw-bold">{{ formatNumber(stats.genderFemale) }} ({{ stats.genderFemalePercent }}%)</span>
                  </div>
                  <span class="text-gray-800 fw-bold fs-6 mb-3">{{ t('dashboard.prison.charts.recidivism') }}</span>
                  <div class="d-flex align-items-center">
                    <span class="bullet bullet-dot bg-warning me-2"></span>
                    <span class="text-gray-600 flex-grow-1 me-4">{{ t('dashboard.prison.charts.reentries') }}</span>
                    <span class="text-gray-900 fw-bold">{{ formatNumber(stats.reentries) }}</span>
                  </div>
                </div>
              </div>
              <!-- Edad 4 grupos -->
              <div class="col-6">
                <div class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold fs-6 mb-3">{{ t('dashboard.prison.charts.byAge') }}</span>
                  <div class="d-flex align-items-center mb-2">
                    <span class="bullet bullet-dot bg-success me-2"></span>
                    <span class="text-gray-600 flex-grow-1 me-4">18-25</span>
                    <span class="text-gray-900 fw-bold">{{ formatNumber(stats.age18to25) }} ({{ stats.age18to25Percent }}%)</span>
                  </div>
                  <div class="d-flex align-items-center mb-2">
                    <span class="bullet bullet-dot bg-warning me-2"></span>
                    <span class="text-gray-600 flex-grow-1 me-4">26-40</span>
                    <span class="text-gray-900 fw-bold">{{ formatNumber(stats.age26to40) }} ({{ stats.age26to40Percent }}%)</span>
                  </div>
                  <div class="d-flex align-items-center mb-2">
                    <span class="bullet bullet-dot bg-info me-2"></span>
                    <span class="text-gray-600 flex-grow-1 me-4">41-60</span>
                    <span class="text-gray-900 fw-bold">{{ formatNumber(stats.age41to60) }} ({{ stats.age41to60Percent }}%)</span>
                  </div>
                  <div class="d-flex align-items-center">
                    <span class="bullet bullet-dot bg-dark me-2"></span>
                    <span class="text-gray-600 flex-grow-1 me-4">60+</span>
                    <span class="text-gray-900 fw-bold">{{ formatNumber(stats.age60plus) }} ({{ stats.age60plusPercent }}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 5: Ingresos/Salidas + Verificación RENAP (6+6) -->
    <div class="row g-5 g-xl-8 mb-5">
      <!-- Ingresos y Salidas 30 días -->
      <div class="col-xl-6">
        <div class="card card-flush h-xl-100">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">{{ t('dashboard.prison.charts.admissionsAndReleases') }}</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">{{ t('dashboard.prison.charts.last30days') }}</span>
            </h3>
          </div>
          <div class="card-body pt-5">
            <apexchart
              v-if="admissionsReleasesSeries.length"
              type="area"
              :options="admissionsReleasesOptions"
              :series="admissionsReleasesSeries"
              height="300"
            />
            <div v-else class="d-flex align-items-center justify-content-center h-300px">
              <span class="text-muted">{{ t('dashboard.prison.charts.noAdmissionsData') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Verificación RENAP desglose -->
      <div class="col-xl-6">
        <div class="card card-flush h-xl-100">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">{{ t('dashboard.prison.charts.renapBreakdown') }}</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">{{ formatNumber(stats.renapTotalLoaded) }} {{ t('dashboard.prison.charts.totalRecords') }}</span>
            </h3>
          </div>
          <div class="card-body pt-5">
            <apexchart
              v-if="renapChartSeries.length"
              type="bar"
              :options="renapChartOptions"
              :series="renapChartSeries"
              height="300"
            />
            <div v-else class="d-flex align-items-center justify-content-center h-300px">
              <span class="text-muted">{{ t('dashboard.prison.charts.noRenapData') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 6: Evolución Población + Flujo Visitantes (6+6) -->
    <div class="row g-5 g-xl-8 mb-5">
      <!-- Evolución de Población 30 días -->
      <div class="col-xl-6">
        <div class="card card-flush">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">{{ t('dashboard.prison.charts.populationEvolution') }}</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">{{ t('dashboard.prison.charts.last30days') }}</span>
            </h3>
          </div>
          <div class="card-body">
            <apexchart
              v-if="trendChartSeries.length"
              type="area"
              :options="trendChartOptions"
              :series="trendChartSeries"
              height="300"
            />
            <div v-else class="d-flex align-items-center justify-content-center h-300px">
              <span class="spinner-border text-primary"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Flujo de Visitantes 30 días -->
      <div class="col-xl-6">
        <div class="card card-flush">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">{{ t('dashboard.prison.charts.visitorFlow') }}</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">{{ t('dashboard.prison.charts.visitorsPerDay') }}</span>
            </h3>
          </div>
          <div class="card-body">
            <apexchart
              v-if="visitorTrendSeries.length"
              type="area"
              :options="visitorTrendOptions"
              :series="visitorTrendSeries"
              height="300"
            />
            <div v-else class="d-flex align-items-center justify-content-center h-300px">
              <span class="text-muted">{{ t('dashboard.prison.charts.noVisitorData') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 7: Visitas por Centro + Biometría (6+6) -->
    <div class="row g-5 g-xl-8">
      <!-- Visitas por Centro 30 días -->
      <div class="col-xl-6">
        <div class="card card-flush">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">{{ t('dashboard.prison.charts.visitsByCenter') }}</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">{{ t('dashboard.prison.charts.last30days') }}</span>
            </h3>
          </div>
          <div class="card-body">
            <apexchart
              v-if="visitsByCenterSeries.length"
              type="bar"
              :options="visitsByCenterOptions"
              :series="visitsByCenterSeries"
              height="300"
            />
            <div v-else class="d-flex align-items-center justify-content-center h-300px">
              <span class="text-muted">{{ t('dashboard.prison.charts.noVisitorData') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Enrolamiento Biométrico por Día -->
      <div class="col-xl-6">
        <div class="card card-flush">
          <div class="card-header pt-7">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold text-gray-900">{{ t('dashboard.prison.charts.biometricEnrollment') }}</span>
              <span class="text-gray-500 mt-1 fw-semibold fs-6">{{ t('dashboard.prison.charts.last30days') }}</span>
            </h3>
          </div>
          <div class="card-body">
            <apexchart
              v-if="biometricChartSeries.length"
              type="bar"
              :options="biometricChartOptions"
              :series="biometricChartSeries"
              height="300"
            />
            <div v-else class="d-flex align-items-center justify-content-center h-300px">
              <span class="text-muted">{{ t('dashboard.prison.charts.noBiometricData') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end::Dashboard Penitenciario GP360-->
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCSSVariableValue } from "@/assets/ts/_utils";
import ApiService from "@/core/services/ApiService";

import StatWidget from '@/components/widgets/StatWidget.vue';

const { t } = useI18n();

// --- State ---
const stats = ref({
  totalInmates: 0,
  activeTransfers: 0,
  todayVisitors: 0,
  totalWithBiometrics: 0,
  biometricPercentage: 0,
  // Legal
  preventiveDetention: 0,
  sentenced: 0,
  reentries: 0,
  // Demographics
  genderMale: 0,
  genderMalePercent: 0,
  genderFemale: 0,
  genderFemalePercent: 0,
  age18to25: 0,
  age18to25Percent: 0,
  age26to40: 0,
  age26to40Percent: 0,
  age41to60: 0,
  age41to60Percent: 0,
  age60plus: 0,
  age60plusPercent: 0,
  // RENAP
  renapVerified: 0,
  renapProcessed: 0,
  renapPercentage: 0,
  renapTotalLoaded: 0,
});

// Center filter
const centerFilter = ref<number>(10);
const centerFilterOptions = [
  { value: 10, label: 'Top 10' },
  { value: 15, label: 'Top 15' },
  { value: 0, label: 'Todos' },
];
let allCenterData: any[] = [];

// Chart series & options
const populationChartSeries = ref<any[]>([]);
const populationChartOptions = ref<any>({});

const gangChartSeries = ref<any[]>([]);
const gangChartOptions = ref<any>({});

const topCrimesSeries = ref<any[]>([]);
const topCrimesOptions = ref<any>({});

const severityChartSeries = ref<number[]>([]);
const severityChartOptions = ref<any>({});
const severityLegend = ref<{ label: string; count: number; color: string }[]>([]);

const proceduralStageSeries = ref<any[]>([]);
const proceduralStageOptions = ref<any>({});

const admissionsReleasesSeries = ref<any[]>([]);
const admissionsReleasesOptions = ref<any>({});

const renapChartSeries = ref<any[]>([]);
const renapChartOptions = ref<any>({});

const trendChartSeries = ref<any[]>([]);
const trendChartOptions = ref<any>({});

const visitorTrendSeries = ref<any[]>([]);
const visitorTrendOptions = ref<any>({});

const visitsByCenterSeries = ref<any[]>([]);
const visitsByCenterOptions = ref<any>({});

const biometricChartSeries = ref<any[]>([]);
const biometricChartOptions = ref<any>({});

// --- Helpers ---
const formatNumber = (n: number) => {
  return n?.toLocaleString('es-GT') ?? '0';
};

const setCenterFilter = (value: number) => {
  centerFilter.value = value;
  applyCenterFilter();
};

const applyCenterFilter = () => {
  const data = centerFilter.value > 0
    ? allCenterData.slice(0, centerFilter.value)
    : allCenterData;

  const categories = data.map((c: any) => c.code || c.name);
  const populations = data.map((c: any) => c.current_population || 0);

  populationChartOptions.value = {
    ...populationChartOptions.value,
    xaxis: { ...populationChartOptions.value.xaxis, categories },
  };
  populationChartSeries.value = [{
    name: t('dashboard.prison.charts.currentPopulation'),
    data: populations,
  }];
};

const fillDays = (data: any[], days: number = 30) => {
  const map = new Map<string, number>();
  data.forEach((item: any) => { map.set(item.date, item.count); });

  const result: { date: string; count: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, count: map.get(key) || 0 });
  }
  return result;
};

const proceduralStageLabels: Record<string, string> = {
  investigation: 'Investigación',
  intermediate_phase: 'Fase Intermedia',
  oral_trial: 'Juicio Oral',
  sentence_execution: 'Ejecución',
  appeal_process: 'Apelación',
  cassation: 'Casación',
  constitutional_appeal: 'Amparo',
  review_process: 'Revisión',
};

const severityLabels: Record<string, string> = {
  grave: 'Grave',
  menos_grave: 'Menos Grave',
  leve: 'Leve',
};

const severityColors: Record<string, string> = {
  grave: '#e74c3c',
  menos_grave: '#f39c12',
  leve: '#2ecc71',
};

const renapStatusLabels: Record<string, string> = {
  hit_verified: 'HIT Verificado',
  hit_mismatch: 'HIT Discrepancia',
  no_hit: 'Sin Coincidencia',
  cui_verified: 'CUI Verificado',
  cui_mismatch: 'CUI Discrepancia',
  no_biometrics: 'Sin Biometría',
  not_found_gp360: 'No encontrado',
  pending: 'Pendiente',
  error: 'Error',
};

const renapStatusColors: Record<string, string> = {
  hit_verified: '#27ae60',
  hit_mismatch: '#e67e22',
  no_hit: '#e74c3c',
  cui_verified: '#2ecc71',
  cui_mismatch: '#f39c12',
  no_biometrics: '#95a5a6',
  not_found_gp360: '#7f8c8d',
  pending: '#3498db',
  error: '#c0392b',
};

// --- Load dashboard data ---
const loadDashboardData = async () => {
  try {
    const response = await ApiService.get('/dashboard/prison-stats');
    if (!response?.data?.success) return;

    const data = response.data.data;

    // Summary
    stats.value.totalInmates = data.summary?.total_inmates || 0;
    stats.value.activeTransfers = data.summary?.active_transfers || 0;
    stats.value.todayVisitors = data.summary?.today_visitors || 0;
    stats.value.totalWithBiometrics = data.summary?.total_with_biometrics || 0;
    stats.value.biometricPercentage = data.summary?.biometric_percentage || 0;

    // Legal
    if (data.legal) {
      stats.value.preventiveDetention = data.legal.preventive_detention || 0;
      stats.value.sentenced = data.legal.sentenced || 0;
      stats.value.reentries = data.legal.reentries || 0;
    }

    // RENAP
    if (data.renap) {
      stats.value.renapVerified = data.renap.total_verified || 0;
      stats.value.renapProcessed = data.renap.total_processed || 0;
      stats.value.renapPercentage = data.renap.verification_percentage || 0;
      stats.value.renapTotalLoaded = data.renap.total_loaded || 0;
    }

    // Demographics
    if (data.demographics) {
      const g = data.demographics.gender || {};
      stats.value.genderMale = g.M || 0;
      stats.value.genderFemale = g.F || 0;
      const gTotal = g.total || (stats.value.genderMale + stats.value.genderFemale);
      if (gTotal > 0) {
        stats.value.genderMalePercent = Math.round((stats.value.genderMale / gTotal) * 100);
        stats.value.genderFemalePercent = Math.round((stats.value.genderFemale / gTotal) * 100);
      }

      const ag = data.demographics.age_groups || {};
      stats.value.age18to25 = ag['18-25'] || 0;
      stats.value.age26to40 = ag['26-40'] || 0;
      stats.value.age41to60 = ag['41-60'] || 0;
      stats.value.age60plus = ag['60+'] || 0;
      const ageTotal = stats.value.age18to25 + stats.value.age26to40 + stats.value.age41to60 + stats.value.age60plus;
      if (ageTotal > 0) {
        stats.value.age18to25Percent = Math.round((stats.value.age18to25 / ageTotal) * 100);
        stats.value.age26to40Percent = Math.round((stats.value.age26to40 / ageTotal) * 100);
        stats.value.age41to60Percent = Math.round((stats.value.age41to60 / ageTotal) * 100);
        stats.value.age60plusPercent = Math.round((stats.value.age60plus / ageTotal) * 100);
      }
    }

    // Charts
    loadCharts(data);

  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
};

const loadCharts = (data: any) => {
  const charts = data.charts || {};
  const primaryColor = getCSSVariableValue('--bs-primary');
  const successColor = getCSSVariableValue('--bs-success');
  const dangerColor = getCSSVariableValue('--bs-danger');
  const infoColor = getCSSVariableValue('--bs-info');
  const warningColor = getCSSVariableValue('--bs-warning');

  // --- Population by center (horizontal bar) ---
  allCenterData = charts.center_population || [];
  populationChartOptions.value = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '60%' } },
    dataLabels: { enabled: true, style: { fontSize: '11px' } },
    xaxis: { categories: [], title: { text: 'PPL' } },
    colors: [primaryColor],
    tooltip: { y: { formatter: (val: number) => val + ' PPL' } },
  };
  applyCenterFilter();

  // --- Gang distribution (stacked bar, top 10) ---
  const gangData = (data.gangs?.by_center || []).slice(0, 10);
  if (gangData.length > 0) {
    gangChartOptions.value = {
      chart: { type: 'bar', stacked: true, toolbar: { show: false } },
      plotOptions: { bar: { horizontal: true, borderRadius: 3, barHeight: '65%' } },
      dataLabels: { enabled: false },
      xaxis: { categories: gangData.map((c: any) => c.code) },
      colors: ['#e74c3c', '#3498db', '#95a5a6'],
      legend: { position: 'bottom' },
      tooltip: { y: { formatter: (val: number) => val + ' PPL' } },
    };
    gangChartSeries.value = [
      { name: 'MS-13', data: gangData.map((c: any) => c.ms13) },
      { name: 'Barrio 18', data: gangData.map((c: any) => c.barrio18) },
      { name: t('dashboard.prison.charts.otherGangs'), data: gangData.map((c: any) => c.other) },
    ];
  }

  // --- Top 10 crimes (horizontal bar) ---
  const topCrimes = data.crimes?.top_crimes || [];
  if (topCrimes.length > 0) {
    topCrimesOptions.value = {
      chart: { type: 'bar', toolbar: { show: false } },
      plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '60%' } },
      dataLabels: { enabled: true, style: { fontSize: '11px' } },
      xaxis: { categories: topCrimes.map((c: any) => c.name) },
      colors: [dangerColor],
      tooltip: { y: { formatter: (val: number) => val + ' PPL' } },
    };
    topCrimesSeries.value = [{
      name: 'PPL',
      data: topCrimes.map((c: any) => c.count),
    }];
  }

  // --- Crime severity (donut) ---
  const bySeverity = data.crimes?.by_severity || {};
  const sevKeys = Object.keys(bySeverity);
  if (sevKeys.length > 0) {
    const labels = sevKeys.map(k => severityLabels[k] || k);
    const values = sevKeys.map(k => bySeverity[k]);
    const colors = sevKeys.map(k => severityColors[k] || '#6c757d');

    severityChartOptions.value = {
      chart: { type: 'donut' },
      labels,
      colors,
      plotOptions: {
        pie: { donut: { size: '65%', labels: { show: true, total: { show: true, label: 'Total', formatter: () => values.reduce((a: number, b: number) => a + b, 0).toLocaleString('es-GT') } } } },
      },
      dataLabels: { enabled: false },
      legend: { show: false },
    };
    severityChartSeries.value = values;
    severityLegend.value = sevKeys.map((k, i) => ({
      label: labels[i],
      count: values[i],
      color: colors[i],
    }));
  }

  // --- Procedural stage (horizontal bar) ---
  const byStage = data.legal?.by_procedural_stage || {};
  const stageKeys = Object.keys(byStage);
  if (stageKeys.length > 0) {
    const stageLabels = stageKeys.map(k => proceduralStageLabels[k] || k);
    const stageValues = stageKeys.map(k => byStage[k]);

    proceduralStageOptions.value = {
      chart: { type: 'bar', toolbar: { show: false } },
      plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '55%' } },
      dataLabels: { enabled: true, style: { fontSize: '11px' } },
      xaxis: { categories: stageLabels },
      colors: [infoColor],
      tooltip: { y: { formatter: (val: number) => val + ' casos' } },
    };
    proceduralStageSeries.value = [{
      name: 'Casos',
      data: stageValues,
    }];
  }

  // --- Admissions & Releases (dual area) ---
  const admFilled = fillDays(charts.admissions_trend || []);
  const relFilled = fillDays(charts.releases_trend || []);

  if (admFilled.length > 0) {
    admissionsReleasesOptions.value = {
      chart: { type: 'area', toolbar: { show: false }, height: 300 },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      xaxis: { type: 'datetime', categories: admFilled.map(i => i.date) },
      yaxis: { title: { text: 'PPL' } },
      colors: [successColor, dangerColor],
      fill: {
        type: 'gradient',
        gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 90, 100] },
      },
      legend: { position: 'top' },
      tooltip: { x: { format: 'dd/MM/yyyy' } },
    };
    admissionsReleasesSeries.value = [
      { name: t('dashboard.prison.charts.admissions'), data: admFilled.map(i => i.count) },
      { name: t('dashboard.prison.charts.releases'), data: relFilled.map(i => i.count) },
    ];
  }

  // --- RENAP breakdown (horizontal bar) ---
  const renapByStatus = data.renap?.by_status || {};
  const renapKeys = Object.keys(renapByStatus).filter(k => k !== 'pending');
  if (renapKeys.length > 0) {
    const rLabels = renapKeys.map(k => renapStatusLabels[k] || k);
    const rValues = renapKeys.map(k => renapByStatus[k]);
    const rColors = renapKeys.map(k => renapStatusColors[k] || '#6c757d');

    renapChartOptions.value = {
      chart: { type: 'bar', toolbar: { show: false } },
      plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '55%', distributed: true } },
      dataLabels: { enabled: true, style: { fontSize: '11px' } },
      xaxis: { categories: rLabels },
      colors: rColors,
      legend: { show: false },
      tooltip: { y: { formatter: (val: number) => formatNumber(val) + ' registros' } },
    };
    renapChartSeries.value = [{
      name: 'Registros',
      data: rValues,
    }];
  }

  // --- Population trend (area) ---
  const popTrend = charts.population_trend || [];
  if (popTrend.length > 0) {
    trendChartOptions.value = {
      chart: { type: 'area', toolbar: { show: false }, height: 300 },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3, colors: [infoColor] },
      fill: {
        type: 'gradient',
        gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.2, stops: [0, 90, 100] },
        colors: [infoColor],
      },
      xaxis: { type: 'datetime', categories: popTrend.map((i: any) => i.date) },
      yaxis: { title: { text: 'PPL' } },
      tooltip: { x: { format: 'dd/MM/yy' } },
    };
    trendChartSeries.value = [{
      name: t('dashboard.prison.charts.population'),
      data: popTrend.map((i: any) => i.count),
    }];
  }

  // --- Visitor trend (area) ---
  const visFilled = fillDays(charts.visitor_trend || []);
  if (visFilled.length > 0) {
    visitorTrendOptions.value = {
      chart: { type: 'area', toolbar: { show: false }, height: 300 },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2, colors: [successColor] },
      fill: {
        type: 'gradient',
        gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 90, 100] },
        colors: [successColor],
      },
      xaxis: { type: 'datetime', categories: visFilled.map(i => i.date) },
      yaxis: { title: { text: t('dashboard.prison.charts.numberOfVisitors') } },
      tooltip: {
        x: { format: 'dd/MM/yyyy' },
        y: { formatter: (val: number) => val + ` ${t('dashboard.prison.charts.visitors')}` },
      },
    };
    visitorTrendSeries.value = [{
      name: t('dashboard.prison.charts.visitors'),
      data: visFilled.map(i => i.count),
    }];
  }

  // --- Visits by center (horizontal bar) ---
  const vbcData = charts.visits_by_center || [];
  if (vbcData.length > 0) {
    visitsByCenterOptions.value = {
      chart: { type: 'bar', toolbar: { show: false } },
      plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '55%' } },
      dataLabels: { enabled: true, style: { fontSize: '11px' } },
      xaxis: { categories: vbcData.map((c: any) => c.code || c.center_name) },
      colors: [warningColor],
      tooltip: { y: { formatter: (val: number) => val + ` ${t('dashboard.prison.charts.visits')}` } },
    };
    visitsByCenterSeries.value = [{
      name: t('dashboard.prison.charts.visits'),
      data: vbcData.map((c: any) => c.visit_count),
    }];
  }

  // --- Biometric enrollment by day (vertical bar) ---
  const bioData = data.biometrics?.enrollment_by_day || [];
  const bioFilled = fillDays(bioData.map((i: any) => ({ date: i.date, count: i.inmates_enrolled })));
  if (bioFilled.length > 0) {
    biometricChartOptions.value = {
      chart: { type: 'bar', toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 3, columnWidth: '60%' } },
      dataLabels: { enabled: false },
      xaxis: { type: 'datetime', categories: bioFilled.map(i => i.date) },
      yaxis: { title: { text: 'PPL' } },
      colors: [infoColor],
      tooltip: {
        x: { format: 'dd/MM/yyyy' },
        y: { formatter: (val: number) => val + ' PPL' },
      },
    };
    biometricChartSeries.value = [{
      name: t('dashboard.prison.charts.enrolled'),
      data: bioFilled.map(i => i.count),
    }];
  }
};

// --- Lifecycle ---
let refreshInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  loadDashboardData();
  refreshInterval = setInterval(loadDashboardData, 300000);
});

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval);
});
</script>

<style scoped>
.dashboard-container {
  padding: 0;
}

.h-300px {
  height: 300px;
}
</style>
