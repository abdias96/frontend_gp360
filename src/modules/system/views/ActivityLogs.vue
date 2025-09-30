<template>
  <div class="d-flex flex-column flex-column-fluid">
    <!-- Toolbar -->
    <div id="kt_app_toolbar" class="app-toolbar py-3 py-lg-6">
      <div
        id="kt_app_toolbar_container"
        class="app-container container-xxl d-flex flex-stack"
      >
        <div
          class="page-title d-flex flex-column justify-content-center flex-wrap me-3"
        >
          <h1
            class="page-heading d-flex text-gray-900 fw-bold fs-3 flex-column justify-content-center my-0"
          >
            Logs de Actividad
          </h1>
          <ul
            class="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1"
          >
            <li class="breadcrumb-item text-muted">
              <router-link to="/dashboard" class="text-muted text-hover-primary"
                >Dashboard</router-link
              >
            </li>
            <li class="breadcrumb-item">
              <span class="bullet bg-gray-500 w-5px h-2px"></span>
            </li>
            <li class="breadcrumb-item text-muted">Sistema</li>
            <li class="breadcrumb-item">
              <span class="bullet bg-gray-500 w-5px h-2px"></span>
            </li>
            <li class="breadcrumb-item text-gray-900">Logs de Actividad</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div id="kt_app_content" class="app-content flex-column-fluid">
      <div id="kt_app_content_container" class="app-container container-xxl">
        <!-- Estadísticas -->
        <div class="row g-5 g-xl-10 mb-5 mb-xl-10" v-if="stats">
          <div class="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10">
            <div
              class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end"
            >
              <div class="card-body text-center py-5">
                <div class="fs-1 fw-bold text-gray-900 mb-2">
                  {{ stats.total_logs.toLocaleString() }}
                </div>
                <div class="fs-4 fw-semibold text-gray-500">
                  Total de Registros
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10">
            <div class="card card-flush">
              <div class="card-body text-center py-5">
                <div class="fs-1 fw-bold text-primary mb-2">
                  {{ stats.today_logs }}
                </div>
                <div class="fs-4 fw-semibold text-gray-500">
                  Actividad de Hoy
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10">
            <div class="card card-flush">
              <div class="card-body text-center py-5">
                <div class="fs-1 fw-bold text-success mb-2">
                  {{ stats.this_week_logs }}
                </div>
                <div class="fs-4 fw-semibold text-gray-500">Esta Semana</div>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10">
            <div class="card card-flush">
              <div class="card-body text-center py-5">
                <div class="fs-1 fw-bold text-warning mb-2">
                  {{ stats.this_month_logs }}
                </div>
                <div class="fs-4 fw-semibold text-gray-500">Este Mes</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filtros y Tabla -->
        <div class="card">
          <div class="card-header border-0 pt-6">
            <div class="card-title">
              <div class="d-flex align-items-center position-relative my-1">
                <KTIcon
                  icon-name="magnifier"
                  icon-class="fs-1 position-absolute ms-6"
                />
                <input
                  v-model="searchTerm"
                  type="text"
                  class="form-control form-control-solid w-250px ps-14"
                  placeholder="Buscar en logs..."
                  @input="debounceSearch"
                />
              </div>
            </div>

            <div class="card-toolbar">
              <div
                class="d-flex justify-content-end"
                data-kt-user-table-toolbar="base"
              >
                <!-- Filtros -->
                <div class="me-3">
                  <select
                    v-model="filters.log_name"
                    class="form-select form-select-solid"
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
                </div>

                <div class="me-3">
                  <input
                    v-model="filters.date_from"
                    type="date"
                    class="form-control form-control-solid"
                    @change="loadLogs"
                  />
                </div>

                <div class="me-3">
                  <input
                    v-model="filters.date_to"
                    type="date"
                    class="form-control form-control-solid"
                    @change="loadLogs"
                  />
                </div>

                <!-- Acciones -->
                <button
                  class="btn btn-light-primary me-3"
                  @click="refreshLogs"
                  :disabled="loading"
                >
                  <KTIcon icon-name="arrows-circle" icon-class="fs-2" />
                  Actualizar
                </button>

                <div class="dropdown">
                  <button
                    class="btn btn-light-primary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <KTIcon icon-name="gear" icon-class="fs-2" />
                    Acciones
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="exportLogs"
                        :class="{ disabled: exportingLogs }"
                      >
                        <span
                          v-if="exportingLogs"
                          class="spinner-border spinner-border-sm me-2"
                        ></span>
                        <KTIcon
                          v-else
                          icon-name="file-down"
                          icon-class="fs-3 me-2"
                        />
                        {{ exportingLogs ? "Exportando..." : "Exportar logs" }}
                      </a>
                    </li>
                    <li><hr class="dropdown-divider" /></li>
                    <li>
                      <a
                        class="dropdown-item text-danger"
                        href="#"
                        @click.prevent="showCleanLogsModal"
                      >
                        <KTIcon icon-name="trash" icon-class="fs-3 me-2" />
                        Limpiar logs antiguos
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="card-body pt-0">
            <!-- Tabla -->
            <div class="table-responsive">
              <table class="table align-middle table-row-dashed fs-6 gy-5">
                <thead>
                  <tr
                    class="text-start text-muted fw-bold fs-7 text-uppercase gs-0"
                  >
                    <th class="min-w-125px">Fecha/Hora</th>
                    <th class="min-w-125px">Tipo</th>
                    <th class="min-w-200px">Descripción</th>
                    <th class="min-w-125px">Usuario</th>
                    <th class="min-w-100px">Detalles</th>
                    <th class="text-end min-w-100px">Acciones</th>
                  </tr>
                </thead>
                <tbody class="text-gray-600 fw-semibold">
                  <tr v-for="log in logs" :key="log.id">
                    <td>
                      <div class="text-gray-800 text-hover-primary mb-1">
                        {{ formatDate(log.created_at) }}
                      </div>
                    </td>
                    <td>
                      <div
                        class="badge"
                        :class="getLogBadgeClass(log.log_name)"
                      >
                        {{ formatLogName(log.log_name) }}
                      </div>
                    </td>
                    <td>
                      <div class="text-gray-800">{{ log.description }}</div>
                      <div v-if="log.subject_type" class="text-muted fs-7">
                        {{ getSubjectName(log.subject_type) }}
                      </div>
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <div
                          class="symbol symbol-circle symbol-50px overflow-hidden me-3"
                        >
                          <div class="symbol-label">
                            <div
                              class="symbol-label fs-3 bg-light-primary text-primary"
                            >
                              {{ getUserInitials(log.causer?.full_name) }}
                            </div>
                          </div>
                        </div>
                        <div class="d-flex flex-column">
                          <div class="text-gray-800 text-hover-primary mb-1">
                            {{ log.causer?.full_name || "Sistema" }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        v-if="
                          log.properties &&
                          Object.keys(log.properties).length > 0
                        "
                        class="badge badge-light-info"
                      >
                        {{ Object.keys(log.properties).length }} propiedades
                      </span>
                      <span v-else class="text-muted">Sin detalles</span>
                    </td>
                    <td class="text-end">
                      <button
                        class="btn btn-light btn-active-light-primary btn-sm"
                        @click="viewLogDetails(log)"
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>

                  <!-- Loading state -->
                  <tr v-if="loading">
                    <td colspan="6" class="text-center py-4">
                      <span
                        class="spinner-border spinner-border-sm align-middle ms-2"
                      ></span>
                      Cargando logs...
                    </td>
                  </tr>

                  <!-- Empty state -->
                  <tr v-if="!loading && logs.length === 0">
                    <td colspan="6" class="text-center py-10">
                      <div class="text-center">
                        <KTIcon
                          icon-name="files"
                          icon-class="fs-1 text-muted mb-3"
                        />
                        <div class="text-muted">No se encontraron logs</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Paginación -->
            <div v-if="pagination && pagination.last_page > 1" class="row">
              <div
                class="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start"
              >
                <div class="dataTables_length">
                  <label>
                    <select
                      v-model="filters.per_page"
                      class="form-select form-select-sm form-select-solid"
                      @change="loadLogs"
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                    registros por página
                  </label>
                </div>
              </div>
              <div
                class="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end"
              >
                <div class="dataTables_paginate paging_simple_numbers">
                  <ul class="pagination">
                    <li
                      class="paginate_button page-item previous"
                      :class="{ disabled: pagination.current_page === 1 }"
                    >
                      <a
                        href="#"
                        class="page-link"
                        @click.prevent="
                          pagination.current_page > 1 &&
                            changePage(pagination.current_page - 1)
                        "
                      >
                        <i class="previous"></i>
                      </a>
                    </li>

                    <li
                      v-for="page in getVisiblePages()"
                      :key="page"
                      class="paginate_button page-item"
                      :class="{ active: page === pagination.current_page }"
                    >
                      <a
                        href="#"
                        class="page-link"
                        @click.prevent="changePage(page)"
                        >{{ page }}</a
                      >
                    </li>

                    <li
                      class="paginate_button page-item next"
                      :class="{
                        disabled:
                          pagination.current_page === pagination.last_page,
                      }"
                    >
                      <a
                        href="#"
                        class="page-link"
                        @click.prevent="
                          pagination.current_page < pagination.last_page &&
                            changePage(pagination.current_page + 1)
                        "
                      >
                        <i class="next"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para detalles del log -->
  <div class="modal fade" id="logDetailsModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">Detalles del Log</h2>
          <div
            class="btn btn-icon btn-sm btn-active-icon-primary"
            data-bs-dismiss="modal"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>
        <div class="modal-body" v-if="selectedLog">
          <div class="d-flex flex-column gap-4">
            <div>
              <label class="fw-semibold fs-6 mb-2">Descripción:</label>
              <div class="text-gray-800">{{ selectedLog.description }}</div>
            </div>

            <div class="row">
              <div class="col-6">
                <label class="fw-semibold fs-6 mb-2">Tipo:</label>
                <div
                  class="badge"
                  :class="getLogBadgeClass(selectedLog.log_name)"
                >
                  {{ formatLogName(selectedLog.log_name) }}
                </div>
              </div>
              <div class="col-6">
                <label class="fw-semibold fs-6 mb-2">Fecha:</label>
                <div class="text-gray-800">
                  {{ formatDate(selectedLog.created_at) }}
                </div>
              </div>
            </div>

            <div v-if="selectedLog.causer">
              <label class="fw-semibold fs-6 mb-2">Usuario:</label>
              <div class="text-gray-800">
                {{ selectedLog.causer.full_name }}
              </div>
            </div>

            <div v-if="selectedLog.subject_type">
              <label class="fw-semibold fs-6 mb-2">Entidad afectada:</label>
              <div class="text-gray-800">
                {{ getSubjectName(selectedLog.subject_type) }} (ID:
                {{ selectedLog.subject_id }})
              </div>
            </div>

            <div
              v-if="
                selectedLog.properties &&
                Object.keys(selectedLog.properties).length > 0
              "
            >
              <label class="fw-semibold fs-6 mb-2">Propiedades:</label>
              <div class="bg-light p-4 rounded">
                <pre>{{ formatJson(selectedLog.properties) }}</pre>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para limpiar logs -->
  <div class="modal fade" id="cleanLogsModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold text-danger">Limpiar Logs Antiguos</h2>
          <div
            class="btn btn-icon btn-sm btn-active-icon-primary"
            data-bs-dismiss="modal"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
        </div>
        <div class="modal-body">
          <div class="d-flex flex-column gap-4">
            <div class="alert alert-warning">
              <KTIcon
                icon-name="warning-2"
                icon-class="fs-2 text-warning me-3"
              />
              <strong>¡Atención!</strong> Esta acción eliminará permanentemente
              todos los logs de actividad de más de 30 días.
            </div>

            <div>
              <label class="fw-semibold fs-6 mb-2">Días a conservar:</label>
              <select v-model="cleanDays" class="form-select">
                <option value="7">Últimos 7 días</option>
                <option value="15">Últimos 15 días</option>
                <option value="30">Últimos 30 días</option>
                <option value="60">Últimos 60 días</option>
                <option value="90">Últimos 90 días</option>
              </select>
              <div class="form-text">
                Se eliminarán todos los logs anteriores al período seleccionado
              </div>
            </div>

            <div class="alert alert-danger">
              <KTIcon
                icon-name="information-5"
                icon-class="fs-2 text-danger me-3"
              />
              Esta acción <strong>NO se puede deshacer</strong>. Los logs
              eliminados no podrán ser recuperados.
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="confirmCleanLogs"
            :disabled="cleaningLogs"
          >
            <span
              v-if="cleaningLogs"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            {{ cleaningLogs ? "Limpiando..." : "Limpiar Logs" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ApiService from "@/core/services/ApiService";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Modal } from "bootstrap";

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
  this_month_logs: number;
  total_logs: number;
}

interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Estado reactivo
const logs = ref<ActivityLog[]>([]);
const stats = ref<Stats | null>(null);
const logNames = ref<string[]>([]);
const pagination = ref<Pagination | null>(null);
const loading = ref(false);
const searchTerm = ref("");
const selectedLog = ref<ActivityLog | null>(null);
const cleanDays = ref(30);
const cleaningLogs = ref(false);
const exportingLogs = ref(false);

// Filtros
const filters = ref({
  log_name: "",
  date_from: "",
  date_to: "",
  per_page: 25,
  search: "",
});

// Métodos
const loadLogs = async (page = 1) => {
  loading.value = true;
  try {
    const params = {
      page,
      ...filters.value,
    };

    const response = await ApiService.query("/activity-logs", params);
    logs.value = response.data.data;
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

const changePage = (page: number) => {
  loadLogs(page);
};

const getVisiblePages = () => {
  if (!pagination.value) return [];

  const current = pagination.value.current_page;
  const last = pagination.value.last_page;
  const pages: number[] = [];

  const start = Math.max(1, current - 2);
  const end = Math.min(last, current + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
};

let searchTimeout: NodeJS.Timeout;
const debounceSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filters.value.search = searchTerm.value;
    loadLogs();
  }, 500);
};

const viewLogDetails = (log: ActivityLog) => {
  selectedLog.value = log;
  const modal = new Modal(document.getElementById("logDetailsModal")!);
  modal.show();
};

const exportLogs = async () => {
  exportingLogs.value = true;
  try {
    // Get all logs without pagination for export
    const params = {
      per_page: 1000, // Large number to get most logs
      ...filters.value,
    };

    const response = await ApiService.query("/activity-logs", params);
    const logsToExport = response.data.data;

    // Create CSV content
    const csvHeaders = [
      "Fecha",
      "Tipo",
      "Descripción",
      "Usuario",
      "IP",
      "Navegador",
    ];
    const csvRows = logsToExport.map((log: ActivityLog) => [
      formatDate(log.created_at),
      formatLogName(log.log_name),
      log.description,
      log.causer?.full_name || "Sistema",
      log.properties?.ip_address || "",
      log.properties?.user_agent || "",
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    // Download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `activity_logs_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`✅ Se exportaron ${logsToExport.length} logs exitosamente`);
  } catch (error) {
    console.error("Error exportando logs:", error);
    alert("❌ Error al exportar los logs");
  } finally {
    exportingLogs.value = false;
  }
};

const showCleanLogsModal = () => {
  const modal = new Modal(document.getElementById("cleanLogsModal")!);
  modal.show();
};

const confirmCleanLogs = async () => {
  cleaningLogs.value = true;
  try {
    const response = await ApiService.delete(
      `/activity-logs/clean?days=${cleanDays.value}`,
    );

    // Hide modal
    const modal = Modal.getInstance(document.getElementById("cleanLogsModal")!);
    modal?.hide();

    // Refresh the logs and stats after cleaning
    loadLogs();
    loadStats();

    // Show success message
    const deleted = response.data.deleted_count;
    if (deleted > 0) {
      alert(`✅ Se eliminaron ${deleted} logs antiguos exitosamente`);
    } else {
      alert("ℹ️ No había logs antiguos para eliminar");
    }
  } catch (error) {
    console.error("Error limpiando logs:", error);
    alert("❌ Error al limpiar los logs antiguos");
  } finally {
    cleaningLogs.value = false;
  }
};

// Utilidades
const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), "dd/MM/yyyy HH:mm:ss", { locale: es });
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

const getLogBadgeClass = (logName: string) => {
  const classes: Record<string, string> = {
    auth: "badge-light-success",
    created: "badge-light-primary",
    updated: "badge-light-warning",
    deleted: "badge-light-danger",
    access: "badge-light-info",
    default: "badge-light-secondary",
  };
  return classes[logName] || "badge-light-secondary";
};

const getSubjectName = (subjectType: string) => {
  const types: Record<string, string> = {
    "App\\Models\\User": "Usuario",
    "App\\Models\\Role": "Rol",
    "App\\Models\\Permission": "Permiso",
  };
  return types[subjectType] || subjectType.split("\\").pop();
};

const getUserInitials = (fullName?: string) => {
  if (!fullName) return "S";
  return fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
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
pre {
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.875rem;
}

.symbol-label {
  font-weight: 600;
}
</style>
