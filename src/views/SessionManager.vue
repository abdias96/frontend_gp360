<template>
  <div class="d-flex flex-column">
    <!--begin::Content-->
    <div class="flex-lg-row-fluid">
      <!--begin::Card-->
      <div class="card">
        <!--begin::Card header-->
        <div class="card-header border-0 pt-6">
          <div class="card-title">
            <div class="d-flex align-items-center position-relative my-1">
              <KTIcon
                icon-name="user-check"
                icon-class="fs-1 position-absolute ms-6"
              />
              <input
                v-model="searchQuery"
                type="text"
                class="form-control form-control-solid w-250px ps-14"
                :placeholder="$t('common.sessions.searchPlaceholder')"
              />
            </div>
          </div>
          <div class="card-toolbar">
            <div class="d-flex justify-content-end">
              <button
                @click="cleanExpiredSessions"
                type="button"
                class="btn btn-warning me-3"
                :disabled="loading"
                v-if="isAdmin"
              >
                <KTIcon icon-name="trash" icon-class="fs-2" />
                {{ $t("common.sessions.cleanExpired") }}
              </button>
              <button
                @click="showRevokeAllModal = true"
                type="button"
                class="btn btn-danger"
                :disabled="loading || sessions.length <= 1"
              >
                <KTIcon icon-name="cross" icon-class="fs-2" />
                {{ $t("common.sessions.revokeAllOthers") }}
              </button>
            </div>
          </div>
        </div>
        <!--end::Card header-->

        <!--begin::Stats Cards-->
        <div class="card-body pb-0" v-if="isAdmin && stats">
          <div class="row mb-6">
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card bg-light-primary border-0">
                <div class="card-body text-center py-6">
                  <KTIcon
                    icon-name="user-check"
                    icon-class="fs-2x text-primary mb-3"
                  />
                  <h3 class="text-primary">
                    {{ stats.total_active_sessions || 0 }}
                  </h3>
                  <p class="text-muted mb-0">
                    {{ $t("common.sessions.activeSessions") }}
                  </p>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card bg-light-success border-0">
                <div class="card-body text-center py-6">
                  <KTIcon
                    icon-name="user"
                    icon-class="fs-2x text-success mb-3"
                  />
                  <h3 class="text-success">{{ stats.active_users || 0 }}</h3>
                  <p class="text-muted mb-0">
                    {{ $t("common.sessions.activeUsers") }}
                  </p>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card bg-light-info border-0">
                <div class="card-body text-center py-6">
                  <KTIcon icon-name="time" icon-class="fs-2x text-info mb-3" />
                  <h3 class="text-info">{{ stats.sessions_last_24h || 0 }}</h3>
                  <p class="text-muted mb-0">
                    {{ $t("common.sessions.last24h") }}
                  </p>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card bg-light-warning border-0">
                <div class="card-body text-center py-6">
                  <KTIcon
                    icon-name="clock"
                    icon-class="fs-2x text-warning mb-3"
                  />
                  <h3 class="text-warning">
                    {{ stats.expired_sessions || 0 }}
                  </h3>
                  <p class="text-muted mb-0">
                    {{ $t("common.sessions.expiredSessions") }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--end::Stats Cards-->

        <!--begin::Card body-->
        <div class="card-body">
          <div class="table-responsive">
            <table class="table align-middle table-row-dashed fs-6 gy-5">
              <thead>
                <tr
                  class="text-start text-muted fw-bold fs-7 text-uppercase gs-0"
                >
                  <th class="min-w-125px">
                    {{ $t("common.sessions.device") }}
                  </th>
                  <th class="min-w-125px">
                    {{ $t("common.sessions.location") }}
                  </th>
                  <th class="min-w-125px">
                    {{ $t("common.sessions.lastActivity") }}
                  </th>
                  <th class="min-w-125px">
                    {{ $t("common.sessions.ipAddress") }}
                  </th>
                  <th class="min-w-70px">{{ $t("common.sessions.status") }}</th>
                  <th class="text-end min-w-100px">
                    {{ $t("common.actions.title") }}
                  </th>
                </tr>
              </thead>
              <tbody class="text-gray-600 fw-semibold">
                <tr v-if="loading">
                  <td colspan="6" class="text-center py-8">
                    <div
                      class="spinner-border spinner-border-sm text-primary"
                      role="status"
                    >
                      <span class="visually-hidden"
                        >{{ $t("common.loading") }}...</span
                      >
                    </div>
                  </td>
                </tr>
                <tr v-else-if="filteredSessions.length === 0">
                  <td colspan="6" class="text-center py-8">
                    <div class="d-flex flex-column align-items-center">
                      <KTIcon
                        icon-name="user-check"
                        icon-class="fs-2x text-muted mb-3"
                      />
                      <span class="text-muted">{{
                        $t("common.sessions.noSessions")
                      }}</span>
                    </div>
                  </td>
                </tr>
                <tr
                  v-else
                  v-for="session in filteredSessions"
                  :key="session.id"
                >
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="symbol symbol-45px me-5">
                        <div class="symbol-label bg-light-primary text-primary">
                          <KTIcon
                            :icon-name="getDeviceIcon(session.device_type)"
                            icon-class="fs-3"
                          />
                        </div>
                      </div>
                      <div class="d-flex justify-content-start flex-column">
                        <span class="text-dark fw-bold text-hover-primary fs-6">
                          {{
                            session.device_name ||
                            $t("common.sessions.unknownDevice")
                          }}
                        </span>
                        <span class="text-muted fs-7"
                          >{{ session.browser }} {{ session.platform }}</span
                        >
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex flex-column">
                      <span class="text-dark fw-semibold">{{
                        session.location ||
                        $t("common.sessions.unknownLocation")
                      }}</span>
                      <span class="text-muted fs-7">{{
                        session.ip_address
                      }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex flex-column">
                      <span class="text-dark fw-semibold">{{
                        formatDateTime(session.last_activity)
                      }}</span>
                      <span class="text-muted fs-7">{{
                        timeAgo(session.last_activity)
                      }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-light">{{
                      session.ip_address
                    }}</span>
                  </td>
                  <td>
                    <span
                      :class="[
                        'badge',
                        session.is_current
                          ? 'badge-success'
                          : 'badge-light-primary',
                      ]"
                    >
                      {{
                        session.is_current
                          ? $t("common.sessions.current")
                          : $t("common.sessions.active")
                      }}
                    </span>
                  </td>
                  <td class="text-end">
                    <button
                      v-if="!session.is_current"
                      @click="revokeSession(session.id)"
                      class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                      :title="$t('common.sessions.revoke')"
                    >
                      <KTIcon icon-name="cross" icon-class="fs-3" />
                    </button>
                    <span v-else class="text-muted fs-7">{{
                      $t("common.sessions.currentSession")
                    }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!--end::Card body-->
      </div>
      <!--end::Card-->
    </div>
    <!--end::Content-->
  </div>

  <!-- Revoke All Others Modal -->
  <div
    v-if="showRevokeAllModal"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">
            {{ $t("common.sessions.revokeAllOthers") }}
          </h2>
          <button
            @click="showRevokeAllModal = false"
            type="button"
            class="btn-close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="text-center">
            <KTIcon
              icon-name="exclamation-triangle"
              icon-class="fs-2x text-warning mb-3"
            />
            <p class="fs-6">{{ $t("common.sessions.revokeAllWarning") }}</p>
            <p class="text-muted">
              {{ $t("common.sessions.revokeAllDetails") }}
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button
            @click="showRevokeAllModal = false"
            type="button"
            class="btn btn-light"
          >
            {{ $t("common.actions.cancel") }}
          </button>
          <button
            @click="revokeAllOtherSessions"
            type="button"
            class="btn btn-danger"
          >
            {{ $t("common.sessions.revokeAll") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ===========================
// Imports
// ===========================
import { ref, onMounted, onUnmounted, computed } from "vue";
import ApiService from "@/core/services/ApiService";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import Swal from "sweetalert2";

// ===========================
// Types
// ===========================
interface SessionStats {
  total_active_sessions: number;
  active_users: number;
  sessions_last_24h: number;
  expired_sessions: number;
}

interface Session {
  id: string;
  ip_address: string;
  user_agent: string;
  last_activity: string;
  is_current: boolean;
  device_type: string;
  device_name: string;
  browser: string;
  platform: string;
  location: string;
}

// ===========================
// State
// ===========================
const loading = ref(false);
const searchQuery = ref("");
const showRevokeAllModal = ref(false);

// Data
const sessions = ref<Session[]>([]);
const stats = ref<SessionStats | null>(null);
const isAdmin = ref(false);

let refreshInterval: any = null;

const filteredSessions = computed(() => {
  if (!searchQuery.value) return sessions.value;

  const query = searchQuery.value.toLowerCase();
  return sessions.value.filter(
    (session) =>
      session.ip_address.toLowerCase().includes(query) ||
      session.device_name.toLowerCase().includes(query) ||
      session.browser.toLowerCase().includes(query) ||
      session.platform.toLowerCase().includes(query) ||
      session.location.toLowerCase().includes(query),
  );
});

const loadSessions = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get("sessions");
    if (response.data?.status === "success") {
      sessions.value = response.data.data || [];
    }
  } catch (error: any) {
    console.error("Error loading sessions:", error);
    if (error.response?.status !== 401) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al cargar sesiones",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  } finally {
    loading.value = false;
  }
};

const loadStats = async () => {
  try {
    const response = await ApiService.get("sessions/stats");
    if (response.data?.status === "success") {
      stats.value = response.data.data;
      isAdmin.value = true;
    }
  } catch (error: any) {
    if (error.response?.status === 403) {
      isAdmin.value = false;
    } else {
      console.error("Error loading session stats:", error);
    }
  }
};

const revokeSession = async (sessionId: string) => {
  const result = await Swal.fire({
    title: "¿Revocar Sesión?",
    text: "Esta acción cerrará la sesión inmediatamente",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, revocar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      const response = await ApiService.delete(`sessions/${sessionId}`);
      if (response.data?.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Sesión Revocada",
          text: response.data.message,
          timer: 2000,
          showConfirmButton: false,
        });

        await loadSessions();
        if (isAdmin.value) await loadStats();
      }
    } catch (error: any) {
      console.error("Error revoking session:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error al revocar la sesión",
      });
    }
  }
};

const revokeAllOtherSessions = async () => {
  try {
    const response = await ApiService.delete("sessions/others");
    if (response.data?.status === "success") {
      await Swal.fire({
        icon: "success",
        title: "Sesiones Revocadas",
        text: response.data.message,
        timer: 3000,
        showConfirmButton: false,
      });

      showRevokeAllModal.value = false;
      await loadSessions();
      if (isAdmin.value) await loadStats();
    }
  } catch (error: any) {
    console.error("Error revoking all sessions:", error);
    showRevokeAllModal.value = false;
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "Error al revocar las sesiones",
    });
  }
};

const cleanExpiredSessions = async () => {
  const result = await Swal.fire({
    title: "¿Limpiar Sesiones Expiradas?",
    text: "Se eliminarán todas las sesiones expiradas del sistema",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, limpiar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      const response = await ApiService.delete("sessions/expired");
      if (response.data?.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Sesiones Limpiadas",
          text: response.data.message,
          timer: 3000,
          showConfirmButton: false,
        });

        await loadSessions();
        await loadStats();
      }
    } catch (error: any) {
      console.error("Error cleaning expired sessions:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Error al limpiar sesiones expiradas",
      });
    }
  }
};

const getDeviceIcon = (deviceType: string) => {
  switch (deviceType?.toLowerCase()) {
    case "mobile":
      return "phone";
    case "tablet":
      return "tablet";
    case "desktop":
      return "screen";
    default:
      return "devices";
  }
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

const timeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Hace menos de 1 minuto";
  if (diffInSeconds < 3600)
    return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400)
    return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
  return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
};

const loadData = async () => {
  await loadSessions();
  if (isAdmin.value) await loadStats();
};

onMounted(() => {
  loadData();
  // Refresh data every 30 seconds
  refreshInterval = setInterval(() => {
    loadData();
  }, 30000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>

<style scoped>
.symbol-label {
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-responsive {
  border-radius: 0.475rem;
}

.card-body .row .card {
  transition: transform 0.15s ease-in-out;
}

.card-body .row .card:hover {
  transform: translateY(-2px);
}
</style>
