<template>
  <div id="kt_activities_drawer" class="drawer drawer-end" data-drawer="true">
    <div class="card shadow-none rounded-0 w-400px">
      <div class="card-header" id="kt_activities_header">
        <h3 class="card-title fw-bold text-gray-900">Logs de Actividad</h3>
        <div class="card-toolbar">
          <button
            type="button"
            class="btn btn-sm btn-icon btn-active-light-primary me-n5"
            id="kt_activities_close"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </button>
        </div>
      </div>

      <div class="card-body position-relative" id="kt_activities_body">
        <div
          id="kt_activities_scroll"
          class="position-relative scroll-y me-n5 pe-5"
          data-kt-scroll="true"
          data-kt-scroll-height="auto"
          data-kt-scroll-wrappers="#kt_activities_body"
          data-kt-scroll-dependencies="#kt_activities_header, #kt_activities_footer"
          data-kt-scroll-offset="5px"
        >
          <!-- Filtros -->
          <div class="mb-5">
            <div class="d-flex align-items-center mb-3">
              <select
                v-model="filters.log_name"
                class="form-select form-select-sm me-2"
                @change="loadLogs"
              >
                <option value="">Todos los tipos</option>
                <option
                  v-for="logName in logNames"
                  :key="logName"
                  :value="logName"
                >
                  {{ formatLogName(logName) }}
                </option>
              </select>
              <button
                class="btn btn-sm btn-light-primary"
                @click="refreshLogs"
                :disabled="loading"
              >
                <KTIcon icon-name="arrows-circle" icon-class="fs-3" />
              </button>
            </div>

            <div class="row">
              <div class="col-6">
                <input
                  v-model="filters.date_from"
                  type="date"
                  class="form-control form-control-sm"
                  placeholder="Desde"
                  @change="loadLogs"
                />
              </div>
              <div class="col-6">
                <input
                  v-model="filters.date_to"
                  type="date"
                  class="form-control form-control-sm"
                  placeholder="Hasta"
                  @change="loadLogs"
                />
              </div>
            </div>
          </div>

          <!-- Estadísticas rápidas -->
          <div class="row g-2 mb-5" v-if="stats">
            <div class="col-6">
              <div class="bg-light-primary rounded p-3 text-center">
                <div class="text-primary fw-bold fs-6">
                  {{ stats.today_logs }}
                </div>
                <div class="text-muted fs-7">Hoy</div>
              </div>
            </div>
            <div class="col-6">
              <div class="bg-light-success rounded p-3 text-center">
                <div class="text-success fw-bold fs-6">
                  {{ stats.this_week_logs }}
                </div>
                <div class="text-muted fs-7">Esta semana</div>
              </div>
            </div>
          </div>

          <!-- Lista de logs -->
          <div class="timeline timeline-border-dashed">
            <div v-for="log in logs" :key="log.id" class="timeline-item">
              <div class="timeline-line w-40px"></div>
              <div class="timeline-icon symbol symbol-circle symbol-40px">
                <div :class="getLogIconClass(log.log_name)">
                  <KTIcon
                    :icon-name="getLogIcon(log.log_name)"
                    icon-class="fs-2"
                  />
                </div>
              </div>
              <div class="timeline-content mb-10 mt-n1">
                <div class="pe-3 mb-5">
                  <div class="fs-5 fw-semibold mb-2">{{ log.description }}</div>
                  <div class="d-flex align-items-center mt-1 fs-6">
                    <div class="text-muted me-2 fs-7">
                      <KTIcon
                        icon-name="profile-circle"
                        icon-class="fs-7 me-1"
                      />
                      {{ log.causer?.full_name || "Sistema" }}
                    </div>
                    <div class="text-muted fs-7">
                      <KTIcon icon-name="time" icon-class="fs-7 me-1" />
                      {{ formatDate(log.created_at) }}
                    </div>
                  </div>

                  <!-- Detalles adicionales -->
                  <div
                    v-if="
                      log.properties && Object.keys(log.properties).length > 0
                    "
                    class="mt-3"
                  >
                    <a
                      href="#"
                      class="btn btn-sm btn-light-info"
                      @click.prevent="toggleDetails(log.id)"
                    >
                      {{ expandedLogs.includes(log.id) ? "Ocultar" : "Ver" }}
                      detalles
                    </a>

                    <div
                      v-if="expandedLogs.includes(log.id)"
                      class="mt-3 p-3 bg-light rounded"
                    >
                      <div v-if="log.properties.ip_address" class="mb-2">
                        <strong>IP:</strong> {{ log.properties.ip_address }}
                      </div>
                      <div v-if="log.properties.user_agent" class="mb-2">
                        <strong>Navegador:</strong>
                        {{ log.properties.user_agent }}
                      </div>
                      <div v-if="log.properties.attributes" class="mb-2">
                        <strong>Cambios:</strong>
                        <pre class="text-muted fs-8 mt-1">{{
                          formatJson(log.properties.attributes)
                        }}</pre>
                      </div>
                      <div v-if="log.properties.old" class="mb-2">
                        <strong>Valores anteriores:</strong>
                        <pre class="text-muted fs-8 mt-1">{{
                          formatJson(log.properties.old)
                        }}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading indicator -->
            <div v-if="loading" class="text-center py-5">
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
              <span class="ms-2">Cargando logs...</span>
            </div>

            <!-- Sin datos -->
            <div v-if="!loading && logs.length === 0" class="text-center py-5">
              <KTIcon icon-name="files" icon-class="fs-1 text-muted mb-3" />
              <div class="text-muted">No hay logs de actividad</div>
            </div>
          </div>

          <!-- Cargar más -->
          <div
            v-if="pagination && pagination.current_page < pagination.last_page"
            class="text-center mt-5"
          >
            <button
              class="btn btn-sm btn-light-primary"
              @click="loadMoreLogs"
              :disabled="loading"
            >
              Cargar más
            </button>
          </div>
        </div>
      </div>

      <div class="card-footer py-5 text-center" id="kt_activities_footer">
        <button class="btn btn-bg-body text-primary" @click="openFullLogsView">
          <KTIcon icon-name="eye" icon-class="fs-3" />
          Ver todos los logs
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import ApiService from "@/core/services/ApiService";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface ActivityLog {
  id: number;
  log_name: string;
  description: string;
  subject_type?: string;
  subject_id?: number;
  causer?: {
    id: number;
    full_name: string;
  };
  properties?: any;
  created_at: string;
}

interface Stats {
  today_logs: number;
  this_week_logs: number;
  total_logs: number;
}

interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const router = useRouter();

// Estado reactivo
const logs = ref<ActivityLog[]>([]);
const stats = ref<Stats | null>(null);
const logNames = ref<string[]>([]);
const pagination = ref<Pagination | null>(null);
const loading = ref(false);
const expandedLogs = ref<number[]>([]);

// Filtros
const filters = ref({
  log_name: "",
  date_from: "",
  date_to: "",
  per_page: 10,
});

// Métodos
const loadLogs = async (page = 1, append = false) => {
  loading.value = true;
  try {
    const params = {
      page,
      ...filters.value,
    };

    const response = await ApiService.query("/activity-logs", params);

    if (append) {
      logs.value = [...logs.value, ...response.data.data];
    } else {
      logs.value = response.data.data;
    }

    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      per_page: response.data.per_page,
      total: response.data.total,
    };
  } catch (error) {
    console.error("Error cargando logs:", error);
  } finally {
    loading.value = false;
  }
};

const loadMoreLogs = () => {
  if (pagination.value) {
    loadLogs(pagination.value.current_page + 1, true);
  }
};

const loadStats = async () => {
  try {
    const response = await ApiService.get("/activity-logs/stats");
    stats.value = response.data;
  } catch (error) {
    console.error("Error cargando estadísticas:", error);
  }
};

const loadLogNames = async () => {
  try {
    const response = await ApiService.get("/activity-logs/log-names");
    logNames.value = response.data;
  } catch (error) {
    console.error("Error cargando tipos de log:", error);
  }
};

const refreshLogs = () => {
  loadLogs();
  loadStats();
};

const toggleDetails = (logId: number) => {
  const index = expandedLogs.value.indexOf(logId);
  if (index > -1) {
    expandedLogs.value.splice(index, 1);
  } else {
    expandedLogs.value.push(logId);
  }
};

const openFullLogsView = () => {
  router.push("/system/logs");
};

// Utilidades
const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), "dd MMM yyyy HH:mm", { locale: es });
  } catch {
    return dateString;
  }
};

const formatLogName = (logName: string) => {
  const names: Record<string, string> = {
    auth: "Autenticación",
    created: "Creación",
    updated: "Actualización",
    deleted: "Eliminación",
    access: "Acceso",
    default: "General",
  };
  return names[logName] || logName;
};

const getLogIcon = (logName: string) => {
  const icons: Record<string, string> = {
    auth: "profile-circle",
    created: "plus",
    updated: "pencil",
    deleted: "trash",
    access: "eye",
    default: "information-5",
  };
  return icons[logName] || "information-5";
};

const getLogIconClass = (logName: string) => {
  const classes: Record<string, string> = {
    auth: "bg-light-success",
    created: "bg-light-primary",
    updated: "bg-light-warning",
    deleted: "bg-light-danger",
    access: "bg-light-info",
    default: "bg-light-secondary",
  };
  return classes[logName] || "bg-light-secondary";
};

const formatJson = (obj: any) => {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
};

// Inicialización
onMounted(() => {
  loadLogs();
  loadStats();
  loadLogNames();
});
</script>

<style scoped>
.timeline-item .timeline-content {
  padding-left: 1rem;
}

pre {
  white-space: pre-wrap;
  word-break: break-word;
}

.w-400px {
  width: 400px !important;
}

@media (max-width: 768px) {
  .w-400px {
    width: 100vw !important;
  }
}
</style>
