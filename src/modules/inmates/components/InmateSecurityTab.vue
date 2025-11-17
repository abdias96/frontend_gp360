<template>
  <div class="row g-6 g-xl-9">
    <!-- Security Classification Overview -->
    <div class="col-md-6 col-xl-4">
      <div class="card card-flush h-100">
        <div class="card-header pt-7">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-gray-800"
              >Clasificación de Seguridad</span
            >
            <span class="text-gray-600 mt-1 fw-semibold fs-6"
              >Evaluación de riesgo actual</span
            >
          </h3>
          <div class="card-toolbar">
            <button
              v-if="canEditSecurity"
              @click="openEditClassificationModal"
              class="btn btn-sm btn-light-primary"
            >
              <KTIcon icon-name="pencil" icon-class="fs-2" />
              Actualizar
            </button>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.classification" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          <div v-else>
            <!-- Current Classification -->
            <div class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2"
                >Clasificación Actual</span
              >
              <div class="d-flex align-items-center mb-2">
                <span
                  class="badge badge-lg me-3"
                  :class="
                    getClassificationClass(
                      securityClassification?.risk_classification_name || '',
                    )
                  "
                >
                  {{
                    securityClassification?.risk_classification_name ||
                    "Sin clasificar"
                  }}
                </span>
                <div>
                  <div class="fw-bold text-gray-800 fs-6">
                    {{
                      getRiskLevelDescription(
                        securityClassification?.risk_classification_name || "",
                      )
                    }}
                  </div>
                  <div class="text-gray-600 fs-7">
                    Fecha:
                    {{
                      formatDate(
                        securityClassification?.classification_date || "",
                      )
                    }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Classified By -->
            <div class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2"
                >Clasificado Por</span
              >
              <span class="text-gray-800">
                {{
                  securityClassification?.classifier_name || "No especificado"
                }}
              </span>
            </div>

            <!-- Next Review Date -->
            <div class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2"
                >Próxima Revisión</span
              >
              <div class="d-flex align-items-center">
                <span class="text-gray-800 me-2">
                  {{ formatDate(securityClassification?.review_date || "") }}
                </span>
                <span v-if="isReviewOverdue" class="badge badge-light-danger">
                  <KTIcon icon-name="warning-2" icon-class="fs-6 me-1" />
                  Vencida
                </span>
                <span
                  v-else-if="isReviewSoon"
                  class="badge badge-light-warning"
                >
                  <KTIcon icon-name="calendar" icon-class="fs-6 me-1" />
                  Próxima
                </span>
              </div>
            </div>

            <!-- Special Protection -->
            <div v-if="inmate.requires_special_protection" class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2"
                >Protección Especial</span
              >
              <div class="d-flex align-items-center">
                <KTIcon
                  icon-name="shield-tick"
                  icon-class="fs-3 text-warning me-2"
                />
                <div>
                  <div class="text-warning fw-bold">Requiere Protección</div>
                  <div class="text-gray-600 fs-7">
                    {{ inmate.protection_reasons || "No especificado" }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Last Update -->
            <div class="text-gray-600 fs-8">
              <KTIcon icon-name="calendar" icon-class="fs-7 me-1" />
              Última actualización:
              {{ formatDate(securityClassification?.updated_at || "") }}
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
            <span class="card-label fw-bold text-gray-800"
              >Afiliaciones Pandilleriles</span
            >
            <span class="text-gray-600 mt-1 fw-semibold fs-6"
              >Control de inteligencia</span
            >
          </h3>
          <div class="card-toolbar">
            <button
              v-if="canManageIntelligence"
              @click="openManageGangAffiliationModal"
              class="btn btn-sm btn-light-warning"
            >
              <KTIcon icon-name="security-user" icon-class="fs-2" />
              Gestionar
            </button>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.gangs" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          <div v-else>
            <!-- Gang Status Overview -->
            <div class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2"
                >Estado General</span
              >
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
              <span class="fw-bold text-gray-600 d-block mb-3"
                >Afiliaciones Activas</span
              >
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
                        {{ gang.gang_name }}
                      </div>
                      <div class="text-gray-600 fs-7 mb-2">
                        Nivel:
                        {{ getAffiliationLevelText(gang.affiliation_level) }}
                      </div>
                      <div class="d-flex gap-2 mb-2">
                        <span
                          class="badge badge-sm"
                          :class="getRiskAssessmentClass(gang.risk_assessment)"
                        >
                          Riesgo:
                          {{ getRiskAssessmentText(gang.risk_assessment) }}
                        </span>
                        <span
                          class="badge badge-sm"
                          :class="getGangStatusClass(gang.status)"
                        >
                          {{ getGangStatusText(gang.status) }}
                        </span>
                      </div>
                      <div v-if="gang.verified_date" class="text-gray-600 fs-8">
                        Verificado: {{ formatDate(gang.verified_date) }}
                        <span v-if="gang.verifier_name">
                          por {{ gang.verifier_name }}</span
                        >
                      </div>
                      <div
                        v-if="gang.conflicts_with"
                        class="text-danger fs-8 mt-1"
                      >
                        <KTIcon icon-name="warning-2" icon-class="fs-7 me-1" />
                        Conflictos:
                        {{
                          Array.isArray(gang.conflicts_with)
                            ? gang.conflicts_with.join(", ")
                            : gang.conflicts_with
                        }}
                      </div>
                    </div>
                    <div class="dropdown">
                      <button
                        class="btn btn-sm btn-light btn-active-light-primary"
                        data-bs-toggle="dropdown"
                      >
                        <KTIcon icon-name="dots-vertical" icon-class="fs-7" />
                      </button>
                      <div
                        class="dropdown-menu menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-200px py-4"
                      >
                        <div class="menu-item px-3">
                          <a
                            @click.prevent="viewGangDetails(gang)"
                            class="menu-link px-3"
                          >
                            <KTIcon icon-name="eye" icon-class="fs-6 me-2" />
                            Ver Detalles
                          </a>
                        </div>
                        <div
                          v-if="canManageIntelligence"
                          class="menu-item px-3"
                        >
                          <a
                            @click.prevent="editGangAffiliation(gang)"
                            class="menu-link px-3"
                          >
                            <KTIcon icon-name="pencil" icon-class="fs-6 me-2" />
                            Editar
                          </a>
                        </div>
                        <div
                          v-if="canManageIntelligence"
                          class="menu-separator"
                        ></div>
                        <div
                          v-if="
                            canManageIntelligence && gang.status === 'active'
                          "
                          class="menu-item px-3"
                        >
                          <a
                            @click.prevent="deactivateGangAffiliation(gang)"
                            class="menu-link px-3 text-warning"
                          >
                            <KTIcon icon-name="pause" icon-class="fs-6 me-2" />
                            Desactivar
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Intelligence Notes -->
            <div v-if="inmate.gang_intelligence_notes" class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2"
                >Notas de Inteligencia</span
              >
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
                inmate.gang_affiliation_status === 'none'
              "
              class="text-center py-5"
            >
              <KTIcon
                icon-name="shield-check"
                icon-class="fs-5x text-success mb-4"
              />
              <div class="text-success fw-bold">
                Sin Afiliaciones Pandilleriles
              </div>
              <div class="text-gray-600">
                No hay registro de actividad pandilleril
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
            <span class="card-label fw-bold text-gray-800"
              >Medidas de Seguridad</span
            >
            <span class="text-gray-600 mt-1 fw-semibold fs-6"
              >Controles y restricciones</span
            >
          </h3>
          <div class="card-toolbar">
            <button
              v-if="canManageSecurityMeasures"
              @click="openManageSecurityMeasuresModal"
              class="btn btn-sm btn-light-danger"
            >
              <KTIcon icon-name="security-check" icon-class="fs-2" />
              Gestionar
            </button>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.measures" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
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
                    Monitoreo de Comunicaciones
                  </div>
                  <div class="text-gray-600 fs-7">
                    {{
                      inmate.communication_monitoring
                        ? "Activo - Comunicaciones monitoreadas"
                        : "No activo"
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
                  {{ inmate.communication_monitoring ? "Activo" : "Inactivo" }}
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
                    Revisión Especial de Visitantes
                  </div>
                  <div class="text-gray-600 fs-7">
                    {{
                      inmate.visitor_screening_required
                        ? "Requerida - Revisión exhaustiva"
                        : "Revisión estándar"
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
                    inmate.visitor_screening_required ? "Requerida" : "Estándar"
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
                    Caso de Alto Perfil
                  </div>
                  <div class="text-gray-600 fs-7">
                    {{
                      inmate.high_profile_case
                        ? "Caso mediático - Protocolo especial"
                        : "Caso regular"
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
                  {{ inmate.high_profile_case ? "Alto Perfil" : "Regular" }}
                </span>
              </div>
            </div>

            <!-- Security Measures List -->
            <div v-if="securityMeasures.length > 0" class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-3"
                >Medidas Adicionales</span
              >
              <div
                v-for="measure in securityMeasures"
                :key="measure.id"
                class="border border-warning border-dashed rounded p-3 mb-2 bg-light-warning"
              >
                <div class="d-flex align-items-center">
                  <KTIcon
                    icon-name="security-check"
                    icon-class="fs-5 text-warning me-2"
                  />
                  <div class="flex-grow-1">
                    <div class="fw-bold text-gray-800 fs-7">
                      {{ measure.measure_type }}
                    </div>
                    <div class="text-gray-600 fs-8">
                      {{ measure.description }}
                    </div>
                    <div
                      v-if="measure.expiration_date"
                      class="text-gray-600 fs-8"
                    >
                      Vence: {{ formatDate(measure.expiration_date) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Active Alerts -->
            <div v-if="activeAlerts.length > 0" class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-3"
                >Alertas Activas</span
              >
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
                      {{ alert.alert_type }}
                    </div>
                    <div class="text-gray-600 fs-8">
                      {{ alert.description }}
                    </div>
                    <div class="text-gray-600 fs-8">
                      Creada: {{ formatDate(alert.created_date) }}
                    </div>
                  </div>
                </div>
              </div>
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
            <span class="card-label fw-bold text-gray-800"
              >Historial de Seguridad e Incidentes</span
            >
            <span class="text-gray-600 mt-1 fw-semibold fs-6"
              >Registros de eventos de seguridad</span
            >
          </h3>
          <div class="card-toolbar">
            <button
              v-if="canAddIncident"
              @click="openAddIncidentModal"
              class="btn btn-sm btn-light-danger me-3"
            >
              <KTIcon icon-name="plus" icon-class="fs-2" />
              Registrar Incidente
            </button>
            <button
              @click="refreshSecurityHistory"
              class="btn btn-sm btn-light"
            >
              <KTIcon icon-name="arrows-circle" icon-class="fs-2" />
              Actualizar
            </button>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.history" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
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
              No hay incidentes de seguridad registrados
            </div>
          </div>
          <div v-else>
            <div class="table-responsive">
              <table class="table table-rounded table-striped border gy-7 gs-7">
                <thead>
                  <tr
                    class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200"
                  >
                    <th>Fecha</th>
                    <th>Tipo de Evento</th>
                    <th>Descripción</th>
                    <th>Gravedad</th>
                    <th>Reportado Por</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="incident in securityHistory" :key="incident.id">
                    <td>{{ formatDateTime(incident.incident_date) }}</td>
                    <td>
                      <div class="fw-bold">{{ incident.incident_type }}</div>
                      <div v-if="incident.location" class="text-gray-600 fs-7">
                        {{ incident.location }}
                      </div>
                    </td>
                    <td>
                      <div>{{ incident.description }}</div>
                      <div
                        v-if="incident.people_involved"
                        class="text-gray-600 fs-7"
                      >
                        Involucrados: {{ incident.people_involved }}
                      </div>
                    </td>
                    <td>
                      <span
                        class="badge"
                        :class="getSeverityClass(incident.severity)"
                      >
                        {{ getSeverityText(incident.severity) }}
                      </span>
                    </td>
                    <td>
                      <div class="fw-bold">{{ incident.reported_by_name }}</div>
                      <div class="text-gray-600 fs-7">
                        {{ incident.reported_by_role }}
                      </div>
                    </td>
                    <td>
                      <span
                        class="badge"
                        :class="getIncidentStatusClass(incident.status)"
                      >
                        {{ getIncidentStatusText(incident.status) }}
                      </span>
                    </td>
                    <td>
                      <div class="d-flex gap-1">
                        <button
                          @click="viewIncidentDetails(incident)"
                          class="btn btn-sm btn-light btn-active-light-primary"
                          title="Ver Detalles"
                        >
                          <KTIcon icon-name="eye" icon-class="fs-7" />
                        </button>
                        <button
                          v-if="
                            canEditIncident && incident.status !== 'resolved'
                          "
                          @click="editIncident(incident)"
                          class="btn btn-sm btn-light btn-active-light-primary"
                          title="Editar"
                        >
                          <KTIcon icon-name="pencil" icon-class="fs-7" />
                        </button>
                      </div>
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
import { useAuthStore } from "@/stores/auth";
import type {
  InmateDetail,
  InmateSecurityClassification,
  InmateGangAffiliation,
} from "@/types/inmates";
import Swal from "sweetalert2";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";

interface Props {
  inmate: InmateDetail;
}

// Security specific interfaces
interface SecurityMeasure {
  id: number;
  measure_type: string;
  description: string;
  expiration_date?: string;
  created_date: string;
}

interface SecurityAlert {
  id: number;
  alert_type: string;
  description: string;
  created_date: string;
  priority: "low" | "medium" | "high" | "critical";
}

interface SecurityIncident {
  id: number;
  incident_date: string;
  incident_type: string;
  description: string;
  location?: string;
  people_involved?: string;
  severity: "low" | "medium" | "high" | "critical";
  reported_by_name: string;
  reported_by_role: string;
  status: "reported" | "investigating" | "resolved" | "dismissed";
  resolution?: string;
}

const props = defineProps<Props>();
const authStore = useAuthStore();

// Reactive data
const securityClassification = ref<InmateSecurityClassification | null>(null);
const gangAffiliations = ref<InmateGangAffiliation[]>([]);
const securityMeasures = ref<SecurityMeasure[]>([]);
const activeAlerts = ref<SecurityAlert[]>([]);
const securityHistory = ref<SecurityIncident[]>([]);

const loading = ref({
  classification: false,
  gangs: false,
  measures: false,
  history: false,
});

// Computed properties
const canEditSecurity = computed(() =>
  authStore.hasPermission("security.edit"),
);
const canManageIntelligence = computed(() =>
  authStore.hasPermission("security.intelligence"),
);
const canManageSecurityMeasures = computed(() =>
  authStore.hasPermission("security.measures"),
);
const canAddIncident = computed(() =>
  authStore.hasPermission("security.incidents"),
);
const canEditIncident = computed(() =>
  authStore.hasPermission("security.edit_incidents"),
);

const isReviewOverdue = computed(() => {
  if (!securityClassification.value?.review_date) return false;
  const reviewDate = new Date(securityClassification.value.review_date);
  const today = new Date();
  return reviewDate < today;
});

const isReviewSoon = computed(() => {
  if (!securityClassification.value?.review_date) return false;
  const reviewDate = new Date(securityClassification.value.review_date);
  const today = new Date();
  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  return reviewDate <= weekFromNow && reviewDate >= today;
});

// Methods
const loadSecurityData = async () => {
  try {
    loading.value.classification = true;

    // Load security classification
    if (props.inmate.security_classification) {
      securityClassification.value = props.inmate.security_classification;
    }
  } catch (error) {
    console.error("Error loading security data:", error);
  } finally {
    loading.value.classification = false;
  }
};

const loadGangData = async () => {
  try {
    loading.value.gangs = true;

    // Load gang affiliations
    if (props.inmate.gang_affiliations) {
      gangAffiliations.value = props.inmate.gang_affiliations.filter(
        (g) => g.status === "active",
      );
    }
  } catch (error) {
    console.error("Error loading gang data:", error);
  } finally {
    loading.value.gangs = false;
  }
};

const loadSecurityMeasures = async () => {
  try {
    loading.value.measures = true;

    // Load active security alerts from props
    const alertsData = props.inmate.activeSecurityAlerts || props.inmate.active_security_alerts || props.inmate.securityAlerts || props.inmate.security_alerts;
    if (alertsData && Array.isArray(alertsData)) {
      activeAlerts.value = alertsData.map((alert: any) => ({
        id: alert.id,
        alert_type: alert.alert_type || 'general',
        description: alert.alert_description || alert.description || '',
        created_date: alert.alert_date || alert.created_at,
        priority: alert.priority || 'medium',
      }));
    } else {
      activeAlerts.value = [];
    }

    // Security measures would come from a different relationship if available
    // For now, keep as empty array as there's no specific security_measures table
    securityMeasures.value = [];
  } catch (error) {
    console.error("Error loading security measures:", error);
  } finally {
    loading.value.measures = false;
  }
};

const loadSecurityHistory = async () => {
  try {
    loading.value.history = true;

    // Load security incidents from props
    const incidentsData = props.inmate.securityIncidents || props.inmate.security_incidents;
    if (incidentsData && Array.isArray(incidentsData)) {
      securityHistory.value = incidentsData
        .map((incident: any) => ({
          id: incident.id,
          incident_date: incident.incident_date || incident.created_at,
          incident_type: incident.incidentType?.name || incident.incident_type?.name || incident.incident_type_name || 'Otro',
          description: incident.description || incident.incident_description || '',
          location: incident.incident_location || incident.location,
          people_involved: incident.people_involved || incident.involved_parties,
          severity: incident.severity_level || incident.severity || 'medium',
          reported_by_name: incident.reportedBy?.name || incident.reported_by?.name || incident.reported_by_name || 'N/A',
          reported_by_role: incident.reportedBy?.role || incident.reported_by?.role || 'Personal',
          status: incident.incident_status || incident.status || 'reported',
          resolution: incident.resolution_notes || incident.resolution,
        }))
        .sort((a: any, b: any) => new Date(b.incident_date).getTime() - new Date(a.incident_date).getTime());
    } else {
      securityHistory.value = [];
    }
  } catch (error) {
    console.error("Error loading security history:", error);
  } finally {
    loading.value.history = false;
  }
};

// Security classification methods
const openEditClassificationModal = () => {
  Swal.fire({
    title: "Actualizar Clasificación",
    text: "Funcionalidad de actualización de clasificación de seguridad en desarrollo.",
    icon: "info",
    confirmButtonText: "OK",
  });
};

// Gang affiliation methods
const openManageGangAffiliationModal = () => {
  Swal.fire({
    title: "Gestionar Afiliaciones",
    text: "Funcionalidad de gestión de afiliaciones pandilleriles en desarrollo.",
    icon: "info",
    confirmButtonText: "OK",
  });
};

const viewGangDetails = (gang: InmateGangAffiliation) => {
  console.log("Viewing gang details:", gang.id);
};

const editGangAffiliation = (gang: InmateGangAffiliation) => {
  console.log("Editing gang affiliation:", gang.id);
};

const deactivateGangAffiliation = async (gang: InmateGangAffiliation) => {
  const { value: reason } = await Swal.fire({
    title: "Desactivar Afiliación",
    text: `¿Desactivar la afiliación con ${gang.gang_name}?`,
    input: "textarea",
    inputPlaceholder: "Motivo de la desactivación",
    showCancelButton: true,
    confirmButtonText: "Desactivar",
    cancelButtonText: "Cancelar",
  });

  if (reason) {
    console.log("Deactivating gang affiliation:", gang.id, "Reason:", reason);
    await loadGangData();
  }
};

// Security measures methods
const openManageSecurityMeasuresModal = () => {
  Swal.fire({
    title: "Gestionar Medidas",
    text: "Funcionalidad de gestión de medidas de seguridad en desarrollo.",
    icon: "info",
    confirmButtonText: "OK",
  });
};

// Incident methods
const openAddIncidentModal = () => {
  Swal.fire({
    title: "Registrar Incidente",
    text: "Funcionalidad de registro de incidentes de seguridad en desarrollo.",
    icon: "info",
    confirmButtonText: "OK",
  });
};

const refreshSecurityHistory = async () => {
  await loadSecurityHistory();
};

const viewIncidentDetails = (incident: SecurityIncident) => {
  console.log("Viewing incident details:", incident.id);
};

const editIncident = (incident: SecurityIncident) => {
  console.log("Editing incident:", incident.id);
};

// Helper methods
const getClassificationClass = (classification: string): string => {
  const classes: Record<string, string> = {
    Bajo: "badge-light-success",
    Medio: "badge-light-warning",
    Alto: "badge-light-danger",
    Máximo: "badge-danger",
    Protección: "badge-light-info",
  };
  return classes[classification] || "badge-light-secondary";
};

const getRiskLevelDescription = (classification: string): string => {
  const descriptions: Record<string, string> = {
    Bajo: "Riesgo mínimo de fuga o violencia",
    Medio: "Riesgo moderado, requiere supervisión",
    Alto: "Riesgo elevado, supervisión estricta",
    Máximo: "Riesgo crítico, máxima seguridad",
    Protección: "Requiere protección especial",
  };
  return descriptions[classification] || "Clasificación no definida";
};

const getGangStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    none: "badge-light-success",
    suspected: "badge-light-warning",
    confirmed: "badge-light-danger",
    active: "badge-danger",
    inactive: "badge-light-secondary",
    under_review: "badge-light-info",
  };
  return classes[status] || "badge-light-secondary";
};

const getGangStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    none: "Sin Afiliación",
    suspected: "Sospechoso",
    confirmed: "Confirmado",
    active: "Activo",
    inactive: "Inactivo",
    under_review: "En Revisión",
  };
  return texts[status] || status;
};

const getAffiliationLevelText = (level: string): string => {
  const texts: Record<string, string> = {
    leader: "Líder",
    active_member: "Miembro Activo",
    sympathizer: "Simpatizante",
    ex_member: "Ex-Miembro",
  };
  return texts[level] || level;
};

const getRiskAssessmentClass = (risk: string): string => {
  const classes: Record<string, string> = {
    low: "badge-light-success",
    medium: "badge-light-warning",
    high: "badge-light-danger",
  };
  return classes[risk] || "badge-light-secondary";
};

const getRiskAssessmentText = (risk: string): string => {
  const texts: Record<string, string> = {
    low: "Bajo",
    medium: "Medio",
    high: "Alto",
  };
  return texts[risk] || risk;
};

const getSeverityClass = (severity: string): string => {
  const classes: Record<string, string> = {
    low: "badge-light-success",
    medium: "badge-light-warning",
    high: "badge-light-danger",
    critical: "badge-danger",
  };
  return classes[severity] || "badge-light-secondary";
};

const getSeverityText = (severity: string): string => {
  const texts: Record<string, string> = {
    low: "Bajo",
    medium: "Medio",
    high: "Alto",
    critical: "Crítico",
  };
  return texts[severity] || severity;
};

const getIncidentStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    reported: "badge-light-info",
    investigating: "badge-light-warning",
    resolved: "badge-light-success",
    dismissed: "badge-light-secondary",
  };
  return classes[status] || "badge-light-secondary";
};

const getIncidentStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    reported: "Reportado",
    investigating: "Investigando",
    resolved: "Resuelto",
    dismissed: "Desestimado",
  };
  return texts[status] || status;
};

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
  loadSecurityMeasures();
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
