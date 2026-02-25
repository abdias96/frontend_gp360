<template>
  <div class="row g-6 g-xl-9">
    <!-- Security Classification Overview -->
    <div class="col-md-6 col-xl-4">
      <div class="card card-flush h-100">
        <div class="card-header pt-7">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-gray-800">{{
              $t("inmates.tabs.security.classification.title")
            }}</span>
            <span class="text-gray-600 mt-1 fw-semibold fs-6">{{
              $t("inmates.tabs.security.classification.subtitle")
            }}</span>
          </h3>
          <div class="card-toolbar">
            <button
              v-if="canEditSecurity"
              @click="openEditClassificationModal"
              class="btn btn-sm btn-light-primary"
            >
              <KTIcon icon-name="pencil" icon-class="fs-2" />
              {{ $t("inmates.tabs.security.buttons.update") }}
            </button>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.classification" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{
                $t("inmates.tabs.security.loading")
              }}</span>
            </div>
          </div>
          <div v-else-if="!securityClassification" class="text-center py-5">
            <KTIcon
              icon-name="shield-cross"
              icon-class="fs-5x text-gray-400 mb-4"
            />
            <div class="text-gray-600 fw-bold">
              {{ $t("inmates.tabs.security.classification.unclassified") }}
            </div>
            <div class="text-gray-500 fs-7 mt-2">
              No se ha registrado una clasificación de seguridad
            </div>
          </div>
          <div v-else>
            <!-- Current Classification Level -->
            <div class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2">{{
                $t("inmates.tabs.security.classification.currentClassification")
              }}</span>
              <div class="d-flex align-items-center mb-2">
                <span
                  class="badge badge-lg me-3"
                  :class="getSecurityLevelBadge(securityClassification.security_level)"
                >
                  {{ securityClassification.security_level_name || getLevelLabel(securityClassification.security_level) }}
                </span>
                <div>
                  <div class="fw-bold text-gray-800 fs-6">
                    {{ getLevelDescription(securityClassification.security_level) }}
                  </div>
                  <div class="text-gray-600 fs-7">
                    {{ $t("inmates.tabs.security.classification.date") }}:
                    {{ formatDate(securityClassification.classification_date) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Risk Scores -->
            <div class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2">Evaluación de Riesgo</span>
              <div class="d-flex align-items-center mb-2">
                <span
                  class="badge badge-lg me-2"
                  :class="getOverallRiskBadge(securityClassification.overall_risk_level)"
                >
                  Riesgo: {{ getOverallRiskLabel(securityClassification.overall_risk_level) }}
                </span>
                <span class="text-gray-600 fs-7">
                  ({{ securityClassification.overall_risk_score ?? 0 }}/50)
                </span>
              </div>
              <div class="d-flex flex-wrap gap-1 mt-2">
                <span class="badge badge-light fs-8" title="Violencia">V: {{ securityClassification.violence_risk_score ?? '-' }}/10</span>
                <span class="badge badge-light fs-8" title="Fuga">F: {{ securityClassification.escape_risk_score ?? '-' }}/10</span>
                <span class="badge badge-light fs-8" title="Pandillas">P: {{ securityClassification.gang_influence_score ?? '-' }}/10</span>
                <span class="badge badge-light fs-8" title="Víctimas">Vi: {{ securityClassification.victim_threat_score ?? '-' }}/10</span>
                <span class="badge badge-light fs-8" title="Corrupción">C: {{ securityClassification.corruption_risk_score ?? '-' }}/10</span>
              </div>
            </div>

            <!-- Restrictions -->
            <div v-if="securityClassification.restrictions_summary && securityClassification.restrictions_summary !== 'Sin restricciones'" class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2">Restricciones</span>
              <div class="d-flex flex-wrap gap-1">
                <span v-if="securityClassification.requires_single_cell" class="badge badge-light-warning fs-8">Celda Individual</span>
                <span v-if="securityClassification.limited_recreation_time" class="badge badge-light-warning fs-8">Recreación Limitada</span>
                <span v-if="securityClassification.restricted_visits" class="badge badge-light-warning fs-8">Visitas Restringidas</span>
                <span v-if="securityClassification.monitored_communications" class="badge badge-light-info fs-8">Com. Monitoreadas</span>
                <span v-if="securityClassification.escort_required" class="badge badge-light-danger fs-8">Escolta</span>
                <span v-if="securityClassification.restricted_work_assignments" class="badge badge-light-warning fs-8">Trabajo Restringido</span>
                <span v-if="securityClassification.medical_isolation" class="badge badge-light-primary fs-8">Aislamiento Médico</span>
              </div>
            </div>

            <!-- Classified By -->
            <div class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2">{{
                $t("inmates.tabs.security.classification.classifiedBy")
              }}</span>
              <span class="text-gray-800">
                {{ getClassifierName(securityClassification) }}
              </span>
            </div>

            <!-- Next Review Date -->
            <div class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2">{{
                $t("inmates.tabs.security.classification.nextReview")
              }}</span>
              <div class="d-flex align-items-center">
                <span class="text-gray-800 me-2">
                  {{ formatDate(securityClassification.next_review_date) }}
                </span>
                <span v-if="isReviewOverdue" class="badge badge-light-danger">
                  <KTIcon icon-name="warning-2" icon-class="fs-6 me-1" />
                  {{ $t("inmates.tabs.security.classification.overdue") }}
                  <span class="ms-1">({{ securityClassification.days_until_review }}d)</span>
                </span>
                <span
                  v-else-if="isReviewSoon"
                  class="badge badge-light-warning"
                >
                  <KTIcon icon-name="calendar" icon-class="fs-6 me-1" />
                  {{ $t("inmates.tabs.security.classification.upcoming") }}
                  <span class="ms-1">({{ securityClassification.days_until_review }}d)</span>
                </span>
              </div>
            </div>

            <!-- Special Protection -->
            <div v-if="inmate.requires_special_protection" class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2">{{
                $t("inmates.tabs.security.classification.specialProtection")
              }}</span>
              <div class="d-flex align-items-center">
                <KTIcon
                  icon-name="shield-tick"
                  icon-class="fs-3 text-warning me-2"
                />
                <div>
                  <div class="text-warning fw-bold">
                    {{
                      $t("inmates.tabs.security.classification.requiresProtection")
                    }}
                  </div>
                  <div class="text-gray-600 fs-7">
                    {{
                      inmate.protection_reasons ||
                      $t("inmates.tabs.security.classification.notSpecified")
                    }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Last Update -->
            <div class="text-gray-600 fs-8">
              <KTIcon icon-name="calendar" icon-class="fs-7 me-1" />
              {{ $t("inmates.tabs.security.classification.lastUpdate") }}:
              {{ formatDate(securityClassification.updated_at) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gang Affiliations -->
    <div class="col-md-6 col-xl-4">
      <div class="card card-flush h-100">
        <div class="card-header pt-7">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-gray-800">{{
              $t("inmates.tabs.security.gangAffiliations.title")
            }}</span>
            <span class="text-gray-600 mt-1 fw-semibold fs-6">{{
              $t("inmates.tabs.security.gangAffiliations.subtitle")
            }}</span>
          </h3>
          <div class="card-toolbar">
            <button
              v-if="canManageIntelligence"
              @click="openManageGangAffiliationModal"
              class="btn btn-sm btn-light-warning"
            >
              <KTIcon icon-name="security-user" icon-class="fs-2" />
              {{ $t("inmates.tabs.security.buttons.manage") }}
            </button>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.gangs" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{
                $t("inmates.tabs.security.loading")
              }}</span>
            </div>
          </div>
          <div v-else>
            <!-- Gang Status Overview -->
            <div class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2">{{
                $t("inmates.tabs.security.gangAffiliations.generalStatus")
              }}</span>
              <span
                class="badge badge-lg"
                :class="
                  getGangStatusClass(inmate.gang_affiliation_status || 'none')
                "
              >
                {{
                  getGangStatusText(inmate.gang_affiliation_status || "none")
                }}
              </span>
            </div>

            <!-- Active Gang Affiliations -->
            <div v-if="gangAffiliations.length > 0" class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-3">{{
                $t("inmates.tabs.security.gangAffiliations.activeAffiliations")
              }}</span>
              <div class="scroll-y" style="max-height: 250px">
                <div
                  v-for="gang in gangAffiliations"
                  :key="gang.id"
                  class="border border-danger border-dashed rounded p-3 mb-3 bg-light-danger"
                >
                  <div class="d-flex align-items-start">
                    <KTIcon
                      icon-name="security-user"
                      icon-class="fs-2 text-danger me-3"
                    />
                    <div class="flex-grow-1">
                      <div class="fw-bold text-danger fs-6">
                        {{ gang.gang_type_name || getGangTypeLabel(gang.gang_type) }}
                        <span v-if="gang.gang_name" class="text-gray-700 fs-7 ms-1">({{ gang.gang_name }})</span>
                      </div>
                      <div class="text-gray-600 fs-7 mb-2">
                        {{ $t("inmates.tabs.security.gangAffiliations.level") }}:
                        {{ getAffiliationLevelText(gang.affiliation_level) }}
                      </div>
                      <div class="d-flex gap-2 mb-2">
                        <span
                          class="badge badge-sm"
                          :class="getIntelligenceLevelBadge(gang.intelligence_level)"
                        >
                          Inteligencia: {{ getIntelligenceLevelLabel(gang.intelligence_level) }}
                        </span>
                        <span v-if="gang.is_current" class="badge badge-sm badge-light-success">
                          Activa
                        </span>
                        <span v-else class="badge badge-sm badge-light-secondary">
                          Inactiva
                        </span>
                      </div>
                      <div v-if="gang.confirmation_date" class="text-gray-600 fs-8">
                        Confirmado: {{ formatDate(gang.confirmation_date) }}
                      </div>
                      <div
                        v-if="gang.rival_gangs && gang.rival_gangs.length > 0"
                        class="text-danger fs-8 mt-1"
                      >
                        <KTIcon icon-name="warning-2" icon-class="fs-7 me-1" />
                        {{ $t("inmates.tabs.security.gangAffiliations.conflicts") }}:
                        {{
                          Array.isArray(gang.rival_gangs)
                            ? gang.rival_gangs.join(", ")
                            : gang.rival_gangs
                        }}
                      </div>
                      <div
                        v-if="gang.must_separate_from && gang.must_separate_from.length > 0"
                        class="text-warning fs-8 mt-1"
                      >
                        <KTIcon icon-name="shield-cross" icon-class="fs-7 me-1" />
                        Separar de:
                        {{
                          Array.isArray(gang.must_separate_from)
                            ? gang.must_separate_from.join(", ")
                            : gang.must_separate_from
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Intelligence Notes -->
            <div v-if="inmate.gang_intelligence_notes" class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2">{{
                $t("inmates.tabs.security.gangAffiliations.intelligenceNotes")
              }}</span>
              <div
                class="border border-warning border-dashed rounded p-3 bg-light-warning"
              >
                <KTIcon
                  icon-name="information"
                  icon-class="fs-5 text-warning me-2"
                />
                <span class="text-gray-800 fs-7">{{
                  inmate.gang_intelligence_notes
                }}</span>
              </div>
            </div>

            <!-- No Gang Affiliation -->
            <div
              v-if="
                gangAffiliations.length === 0 &&
                (!inmate.gang_affiliation_status || inmate.gang_affiliation_status === 'none')
              "
              class="text-center py-5"
            >
              <KTIcon
                icon-name="shield-check"
                icon-class="fs-5x text-success mb-4"
              />
              <div class="text-success fw-bold">
                {{ $t("inmates.tabs.security.gangAffiliations.noAffiliations") }}
              </div>
              <div class="text-gray-600">
                {{ $t("inmates.tabs.security.gangAffiliations.noGangActivity") }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Security Measures & Alerts -->
    <div class="col-md-6 col-xl-4">
      <div class="card card-flush h-100">
        <div class="card-header pt-7">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-gray-800">{{
              $t("inmates.tabs.security.measures.title")
            }}</span>
            <span class="text-gray-600 mt-1 fw-semibold fs-6">{{
              $t("inmates.tabs.security.measures.subtitle")
            }}</span>
          </h3>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.measures" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{
                $t("inmates.tabs.security.loading")
              }}</span>
            </div>
          </div>
          <div v-else>
            <!-- Communication Monitoring -->
            <div class="mb-4">
              <div
                class="d-flex align-items-center p-3 border border-gray-300 border-dashed rounded"
              >
                <div class="symbol symbol-40px me-3">
                  <div
                    class="symbol-label"
                    :class="
                      inmate.communication_monitoring
                        ? 'bg-light-warning'
                        : 'bg-light-success'
                    "
                  >
                    <KTIcon
                      icon-name="message-text-2"
                      :icon-class="`fs-2 ${inmate.communication_monitoring ? 'text-warning' : 'text-success'}`"
                    />
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-800 fs-6">
                    {{ $t("inmates.tabs.security.measures.communicationMonitoring") }}
                  </div>
                  <div class="text-gray-600 fs-7">
                    {{
                      inmate.communication_monitoring
                        ? $t("inmates.tabs.security.measures.activeMonitored")
                        : $t("inmates.tabs.security.measures.notActive")
                    }}
                  </div>
                </div>
                <span
                  class="badge"
                  :class="
                    inmate.communication_monitoring
                      ? 'badge-light-warning'
                      : 'badge-light-success'
                  "
                >
                  {{
                    inmate.communication_monitoring
                      ? $t("inmates.tabs.security.measures.active")
                      : $t("inmates.tabs.security.measures.inactive")
                  }}
                </span>
              </div>
            </div>

            <!-- Visitor Screening -->
            <div class="mb-4">
              <div
                class="d-flex align-items-center p-3 border border-gray-300 border-dashed rounded"
              >
                <div class="symbol symbol-40px me-3">
                  <div
                    class="symbol-label"
                    :class="
                      inmate.visitor_screening_required
                        ? 'bg-light-danger'
                        : 'bg-light-success'
                    "
                  >
                    <KTIcon
                      icon-name="security-user"
                      :icon-class="`fs-2 ${inmate.visitor_screening_required ? 'text-danger' : 'text-success'}`"
                    />
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-800 fs-6">
                    {{ $t("inmates.tabs.security.measures.visitorScreening") }}
                  </div>
                  <div class="text-gray-600 fs-7">
                    {{
                      inmate.visitor_screening_required
                        ? $t("inmates.tabs.security.measures.requiredExhaustive")
                        : $t("inmates.tabs.security.measures.standardScreening")
                    }}
                  </div>
                </div>
                <span
                  class="badge"
                  :class="
                    inmate.visitor_screening_required
                      ? 'badge-light-danger'
                      : 'badge-light-success'
                  "
                >
                  {{
                    inmate.visitor_screening_required
                      ? $t("inmates.tabs.security.measures.required")
                      : $t("inmates.tabs.security.measures.standard")
                  }}
                </span>
              </div>
            </div>

            <!-- High Profile Case -->
            <div class="mb-4">
              <div
                class="d-flex align-items-center p-3 border border-gray-300 border-dashed rounded"
              >
                <div class="symbol symbol-40px me-3">
                  <div
                    class="symbol-label"
                    :class="
                      inmate.high_profile_case
                        ? 'bg-light-danger'
                        : 'bg-light-success'
                    "
                  >
                    <KTIcon
                      icon-name="star"
                      :icon-class="`fs-2 ${inmate.high_profile_case ? 'text-danger' : 'text-success'}`"
                    />
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-800 fs-6">
                    {{ $t("inmates.tabs.security.measures.highProfileCase") }}
                  </div>
                  <div class="text-gray-600 fs-7">
                    {{
                      inmate.high_profile_case
                        ? $t("inmates.tabs.security.measures.mediaProtocol")
                        : $t("inmates.tabs.security.measures.regularCase")
                    }}
                  </div>
                </div>
                <span
                  class="badge"
                  :class="
                    inmate.high_profile_case
                      ? 'badge-light-danger'
                      : 'badge-light-success'
                  "
                >
                  {{
                    inmate.high_profile_case
                      ? $t("inmates.tabs.security.measures.highProfile")
                      : $t("inmates.tabs.security.measures.regular")
                  }}
                </span>
              </div>
            </div>

            <!-- Active Alerts -->
            <div v-if="activeAlerts.length > 0" class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-3">{{
                $t("inmates.tabs.security.measures.activeAlerts")
              }}</span>
              <div
                v-for="alert in activeAlerts"
                :key="alert.id"
                class="border border-danger border-dashed rounded p-3 mb-2 bg-light-danger"
              >
                <div class="d-flex align-items-center">
                  <KTIcon
                    icon-name="warning-2"
                    icon-class="fs-5 text-danger me-2"
                  />
                  <div class="flex-grow-1">
                    <div class="fw-bold text-danger fs-7">
                      {{ getAlertTypeLabel(alert.alert_type) }}
                    </div>
                    <div class="text-gray-600 fs-8">
                      {{ alert.alert_description }}
                    </div>
                    <div class="d-flex gap-2 mt-1">
                      <span class="badge badge-sm" :class="getPriorityBadge(alert.priority_level)">
                        {{ getPriorityLabel(alert.priority_level) }}
                      </span>
                      <span class="text-gray-500 fs-8">
                        {{ formatDate(alert.alert_date) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeAlerts.length === 0 && !loading.measures" class="text-center py-3">
              <div class="text-gray-500 fs-7">Sin alertas activas</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Security History & Incidents -->
    <div class="col-12">
      <div class="card card-flush">
        <div class="card-header pt-7">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-gray-800">{{
              $t("inmates.tabs.security.history.title")
            }}</span>
            <span class="text-gray-600 mt-1 fw-semibold fs-6">{{
              $t("inmates.tabs.security.history.subtitle")
            }}</span>
          </h3>
          <div class="card-toolbar">
            <button
              @click="refreshSecurityHistory"
              class="btn btn-sm btn-light"
            >
              <KTIcon icon-name="arrows-circle" icon-class="fs-2" />
              {{ $t("inmates.tabs.security.buttons.refresh") }}
            </button>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.history" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{
                $t("inmates.tabs.security.loading")
              }}</span>
            </div>
          </div>
          <div
            v-else-if="securityHistory.length === 0"
            class="text-center py-5"
          >
            <KTIcon
              icon-name="shield-check"
              icon-class="fs-5x text-gray-400 mb-4"
            />
            <div class="text-gray-600">
              {{ $t("inmates.tabs.security.history.noIncidents") }}
            </div>
          </div>
          <div v-else>
            <div class="table-responsive">
              <table class="table table-rounded table-striped border gy-7 gs-7">
                <thead>
                  <tr
                    class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200"
                  >
                    <th>{{ $t("inmates.tabs.security.history.tableHeaders.date") }}</th>
                    <th>{{ $t("inmates.tabs.security.history.tableHeaders.eventType") }}</th>
                    <th>{{ $t("inmates.tabs.security.history.tableHeaders.description") }}</th>
                    <th>{{ $t("inmates.tabs.security.history.tableHeaders.severity") }}</th>
                    <th>{{ $t("inmates.tabs.security.history.tableHeaders.status") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="incident in securityHistory" :key="incident.id">
                    <td>{{ formatDateTime(incident.incident_date) }}</td>
                    <td>
                      <div class="fw-bold">{{ getIncidentTypeLabel(incident.incident_type) }}</div>
                      <div v-if="incident.location" class="text-gray-600 fs-7">
                        {{ incident.location }}
                      </div>
                    </td>
                    <td>
                      <div class="text-truncate" style="max-width: 300px">
                        {{ incident.incident_description || incident.description }}
                      </div>
                    </td>
                    <td>
                      <span
                        class="badge"
                        :class="getSeverityClass(incident.severity_level || incident.severity)"
                      >
                        {{ getSeverityText(incident.severity_level || incident.severity) }}
                      </span>
                    </td>
                    <td>
                      <span
                        class="badge"
                        :class="getIncidentStatusClass(incident.resolution_status || incident.status)"
                      >
                        {{ getIncidentStatusText(incident.resolution_status || incident.status) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "vue-i18n";
import type { InmateDetail } from "@/types/inmates";
import ApiService from "@/core/services/ApiService";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";

const { t } = useI18n();
const router = useRouter();

interface Props {
  inmate: InmateDetail;
}

const props = defineProps<Props>();
const authStore = useAuthStore();

// Reactive data
const securityClassification = ref<any>(null);
const gangAffiliations = ref<any[]>([]);
const activeAlerts = ref<any[]>([]);
const securityHistory = ref<any[]>([]);

const loading = ref({
  classification: false,
  gangs: false,
  measures: false,
  history: false,
});

// Computed properties
const canEditSecurity = computed(() =>
  authStore.hasPermission("security.edit") || authStore.hasPermission("inmates.security.edit"),
);
const canManageIntelligence = computed(() =>
  authStore.hasPermission("security.intelligence") || authStore.hasPermission("inmates.security.edit"),
);

const isReviewOverdue = computed(() => {
  if (!securityClassification.value?.next_review_date) return false;
  const reviewDate = new Date(securityClassification.value.next_review_date);
  return reviewDate < new Date();
});

const isReviewSoon = computed(() => {
  if (!securityClassification.value?.next_review_date) return false;
  const reviewDate = new Date(securityClassification.value.next_review_date);
  const today = new Date();
  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  return reviewDate <= weekFromNow && reviewDate >= today;
});

// Load data via API
const loadSecurityData = async () => {
  if (!props.inmate?.id) return;
  try {
    loading.value.classification = true;
    const res = await ApiService.get(`/inmate-security-classifications/current/${props.inmate.id}`);
    if (res.data.success && res.data.data) {
      securityClassification.value = res.data.data;
    }
  } catch (error) {
    console.error("Error loading security classification:", error);
  } finally {
    loading.value.classification = false;
  }
};

const loadGangData = async () => {
  if (!props.inmate?.id) return;
  try {
    loading.value.gangs = true;
    const res = await ApiService.get(`/inmate-gang-affiliations/by-inmate/${props.inmate.id}`);
    if (res.data.success && Array.isArray(res.data.data)) {
      gangAffiliations.value = res.data.data.filter((g: any) => g.is_current);
    }
  } catch (error) {
    console.error("Error loading gang data:", error);
  } finally {
    loading.value.gangs = false;
  }
};

const loadAlerts = async () => {
  if (!props.inmate?.id) return;
  try {
    loading.value.measures = true;
    const res = await ApiService.get(`/security/alerts`, {
      params: { inmate_id: props.inmate.id, is_active: true, per_page: 10 }
    });
    if (res.data.success) {
      const data = res.data.data?.data || res.data.data || [];
      activeAlerts.value = Array.isArray(data) ? data : [];
    }
  } catch (error) {
    console.error("Error loading security alerts:", error);
  } finally {
    loading.value.measures = false;
  }
};

const loadSecurityHistory = async () => {
  if (!props.inmate?.id) return;
  try {
    loading.value.history = true;
    const res = await ApiService.get(`/security/incidents`, {
      params: { inmate_id: props.inmate.id, per_page: 10 }
    });
    if (res.data.success) {
      const data = res.data.data?.data || res.data.data || [];
      securityHistory.value = Array.isArray(data) ? data : [];
    }
  } catch (error) {
    console.error("Error loading security history:", error);
  } finally {
    loading.value.history = false;
  }
};

// Navigation
const openEditClassificationModal = () => {
  router.push({
    name: "security-classifications",
    query: { inmate_id: String(props.inmate.id) }
  });
};

const openManageGangAffiliationModal = () => {
  router.push({
    name: "security-gang-affiliations",
    query: { inmate_id: String(props.inmate.id) }
  });
};

const refreshSecurityHistory = async () => {
  await loadSecurityHistory();
};

// Helper methods - Security Level
const getSecurityLevelBadge = (level: string) => ({
  minimum: 'badge-light-success',
  medium: 'badge-light-warning',
  maximum: 'badge-danger',
  super_maximum: 'badge-dark',
}[level] || 'badge-light-secondary');

const getLevelLabel = (level: string) => ({
  minimum: 'Mínima',
  medium: 'Media',
  maximum: 'Máxima',
  super_maximum: 'Súper Máxima',
}[level] || level || 'N/A');

const getLevelDescription = (level: string) => {
  const descriptions: Record<string, string> = {
    minimum: 'Bajo riesgo - Población general',
    medium: 'Riesgo moderado - Supervisión estándar',
    maximum: 'Alto riesgo - Supervisión intensiva',
    super_maximum: 'Riesgo extremo - Máxima seguridad',
  };
  return descriptions[level] || '';
};

// Helper - Overall Risk
const getOverallRiskBadge = (risk: string) => ({
  low: 'badge-light-success',
  medium: 'badge-light-warning',
  high: 'badge-light-danger',
  extreme: 'badge-danger',
}[risk] || 'badge-light-secondary');

const getOverallRiskLabel = (risk: string) => ({
  low: 'Bajo',
  medium: 'Medio',
  high: 'Alto',
  extreme: 'Extremo',
}[risk] || risk || 'N/A');

// Helper - Classifier Name
const getClassifierName = (c: any) => {
  if (c?.classified_by) {
    return `${c.classified_by.first_name || ''} ${c.classified_by.last_name || ''}`.trim() || 'N/A';
  }
  return 'N/A';
};

// Helper - Gang
const getGangStatusClass = (status: string): string => ({
  none: "badge-light-success",
  suspected_ms13: "badge-light-warning",
  confirmed_ms13: "badge-danger",
  ex_ms13: "badge-light-secondary",
  suspected_barrio18: "badge-light-warning",
  confirmed_barrio18: "badge-danger",
  ex_barrio18: "badge-light-secondary",
  other_gang: "badge-light-danger",
  gang_leader: "badge-dark",
  protected_witness: "badge-light-info",
}[status] || "badge-light-secondary");

const getGangStatusText = (status: string): string => {
  const labels: Record<string, string> = {
    none: 'Sin afiliación',
    suspected_ms13: 'Sospechoso MS-13',
    confirmed_ms13: 'Confirmado MS-13',
    ex_ms13: 'Ex MS-13',
    suspected_barrio18: 'Sospechoso Barrio 18',
    confirmed_barrio18: 'Confirmado Barrio 18',
    ex_barrio18: 'Ex Barrio 18',
    other_gang: 'Otra pandilla',
    gang_leader: 'Líder de pandilla',
    protected_witness: 'Testigo protegido',
  };
  return labels[status] || status || 'Desconocido';
};

const getGangTypeLabel = (type: string) => ({
  ms13: 'MS-13',
  barrio18_surenos: 'Barrio 18 Sureños',
  barrio18_revolucionarios: 'Barrio 18 Revolucionarios',
  other_gang: 'Otra Pandilla',
  organized_crime: 'Crimen Organizado',
  drug_cartel: 'Narcotráfico',
  none: 'Ninguna',
}[type] || type || 'N/A');

const getAffiliationLevelText = (level: string): string => ({
  suspected: 'Sospechoso',
  confirmed_member: 'Miembro Confirmado',
  leader: 'Líder',
  high_ranking: 'Alto Rango',
  founder: 'Fundador',
  inactive: 'Inactivo',
  former_member: 'Ex-miembro',
}[level] || level || 'N/A');

const getIntelligenceLevelBadge = (level: string) => ({
  low: 'badge-light-success',
  medium: 'badge-light-warning',
  high: 'badge-light-danger',
  critical: 'badge-danger',
}[level] || 'badge-light-secondary');

const getIntelligenceLevelLabel = (level: string) => ({
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Crítica',
}[level] || level || 'N/A');

// Helper - Alert Types
const getAlertTypeLabel = (type: string) => ({
  high_escape_risk: 'Alto Riesgo Fuga',
  violence_threat: 'Amenaza Violencia',
  gang_leader: 'Líder Pandilla',
  extortion_coordinator: 'Coordinador Extorsión',
  suicide_risk: 'Riesgo Suicidio',
  medical_emergency: 'Emergencia Médica',
  court_appearance: 'Audiencia Judicial',
  transfer_pending: 'Traslado Pendiente',
  visitor_restriction: 'Restricción Visitas',
  communication_restriction: 'Restricción Comunicaciones',
  isolation_required: 'Aislamiento Requerido',
  weapon_possession_risk: 'Riesgo Posesión Armas',
  contraband_risk: 'Riesgo Contrabando',
  corruption_involvement: 'Involucramiento Corrupción',
}[type] || type || 'N/A');

const getPriorityBadge = (priority: string) => ({
  low: 'badge-light-success',
  medium: 'badge-light-warning',
  high: 'badge-light-danger',
  critical: 'badge-danger',
}[priority] || 'badge-light-secondary');

const getPriorityLabel = (priority: string) => ({
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Crítica',
}[priority] || priority || 'N/A');

// Helper - Incidents
const getIncidentTypeLabel = (type: string) => ({
  violence_against_inmate: 'Violencia contra PPL',
  violence_against_staff: 'Violencia contra Personal',
  gang_activity: 'Actividad de Pandillas',
  extortion_attempt: 'Intento de Extorsión',
  contraband_possession: 'Posesión de Contrabando',
  escape_attempt: 'Intento de Fuga',
  riot_participation: 'Participación en Motín',
  unauthorized_communication: 'Comunicación No Autorizada',
  bribery_attempt: 'Intento de Soborno',
  weapon_possession: 'Posesión de Arma',
  drug_possession: 'Posesión de Drogas',
  cell_phone_possession: 'Posesión de Celular',
  threatening_behavior: 'Comportamiento Amenazante',
  sexual_harassment: 'Acoso Sexual',
  property_damage: 'Daño a Propiedad',
  rule_violation: 'Violación de Reglas',
}[type] || type || 'N/A');

const getSeverityClass = (severity: string): string => ({
  low: "badge-light-success",
  medium: "badge-light-warning",
  high: "badge-light-danger",
  critical: "badge-danger",
}[severity] || "badge-light-secondary");

const getSeverityText = (severity: string): string => ({
  low: 'Bajo',
  medium: 'Medio',
  high: 'Alto',
  critical: 'Crítico',
}[severity] || severity || 'N/A');

const getIncidentStatusClass = (status: string): string => ({
  pending: "badge-light-secondary",
  investigating: "badge-light-warning",
  resolved: "badge-light-success",
  dismissed: "badge-light-info",
}[status] || "badge-light-secondary");

const getIncidentStatusText = (status: string): string => ({
  pending: 'Pendiente',
  investigating: 'Investigando',
  resolved: 'Resuelto',
  dismissed: 'Desestimado',
}[status] || status || 'N/A');

const formatDate = (date: string): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("es-GT");
};

const formatDateTime = (datetime: string): string => {
  if (!datetime) return "N/A";
  return new Date(datetime).toLocaleString("es-GT");
};

// Lifecycle
onMounted(() => {
  loadSecurityData();
  loadGangData();
  loadAlerts();
  loadSecurityHistory();
});
</script>

<style scoped>
.scroll-y {
  overflow-y: auto;
}

.symbol-40px {
  width: 40px;
  height: 40px;
}

.badge-lg {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}
</style>
