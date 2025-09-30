<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">🧪 Pruebas de Notificaciones</h3>
      <div class="card-toolbar">
        <span class="badge badge-light-primary me-2"
          >Entorno de Desarrollo</span
        >
        <button @click="loadStats" class="btn btn-sm btn-primary">
          <KTIcon icon-name="arrows-circle" icon-class="fs-3" />
          Actualizar
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- Estadísticas -->
      <div class="row g-6 mb-8" v-if="stats">
        <div class="col-md-3">
          <div class="card bg-light-primary">
            <div class="card-body text-center">
              <KTIcon
                icon-name="notification-bing"
                icon-class="fs-2x text-primary mb-3"
              />
              <div class="fs-2 fw-bold text-gray-800">{{ stats.total }}</div>
              <div class="fs-7 text-muted">Total</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-warning">
            <div class="card-body text-center">
              <KTIcon
                icon-name="notification-status"
                icon-class="fs-2x text-warning mb-3"
              />
              <div class="fs-2 fw-bold text-gray-800">{{ stats.unread }}</div>
              <div class="fs-7 text-muted">Sin leer</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-success">
            <div class="card-body text-center">
              <KTIcon
                icon-name="check-circle"
                icon-class="fs-2x text-success mb-3"
              />
              <div class="fs-2 fw-bold text-gray-800">{{ stats.read }}</div>
              <div class="fs-7 text-muted">Leídas</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-info">
            <div class="card-body text-center">
              <KTIcon icon-name="global" icon-class="fs-2x text-info mb-3" />
              <div class="fs-2 fw-bold text-gray-800">{{ stats.global }}</div>
              <div class="fs-7 text-muted">Globales</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Controles de Prueba -->
      <div class="row g-6">
        <!-- Crear Notificaciones Individuales -->
        <div class="col-lg-6">
          <div class="card border border-dashed border-primary">
            <div class="card-header bg-light-primary">
              <h4 class="card-title">Crear Notificaciones</h4>
            </div>
            <div class="card-body">
              <div class="d-flex flex-wrap gap-2 mb-4">
                <button
                  @click="createNotification('success')"
                  class="btn btn-sm btn-success"
                  :disabled="loading"
                >
                  <KTIcon icon-name="check-circle" icon-class="fs-3 me-1" />
                  Éxito
                </button>
                <button
                  @click="createNotification('warning')"
                  class="btn btn-sm btn-warning"
                  :disabled="loading"
                >
                  <KTIcon icon-name="warning-2" icon-class="fs-3 me-1" />
                  Advertencia
                </button>
                <button
                  @click="createNotification('error')"
                  class="btn btn-sm btn-danger"
                  :disabled="loading"
                >
                  <KTIcon icon-name="cross-circle" icon-class="fs-3 me-1" />
                  Error
                </button>
                <button
                  @click="createNotification('info')"
                  class="btn btn-sm btn-info"
                  :disabled="loading"
                >
                  <KTIcon icon-name="information-5" icon-class="fs-3 me-1" />
                  Información
                </button>
                <button
                  @click="createNotification('system')"
                  class="btn btn-sm btn-primary"
                  :disabled="loading"
                >
                  <KTIcon icon-name="gear" icon-class="fs-3 me-1" />
                  Sistema
                </button>
              </div>

              <div class="separator my-4"></div>

              <div class="d-flex gap-2">
                <button
                  @click="createBulkNotifications(5)"
                  class="btn btn-outline-primary"
                  :disabled="loading"
                >
                  Crear 5 Random
                </button>
                <button
                  @click="createBulkNotifications(10)"
                  class="btn btn-outline-primary"
                  :disabled="loading"
                >
                  Crear 10 Random
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones de Limpieza -->
        <div class="col-lg-6">
          <div class="card border border-dashed border-warning">
            <div class="card-header bg-light-warning">
              <h4 class="card-title">Acciones de Limpieza</h4>
            </div>
            <div class="card-body">
              <div class="d-flex flex-column gap-3">
                <button
                  @click="markAllAsRead"
                  class="btn btn-warning"
                  :disabled="loading || (stats && stats.unread === 0)"
                >
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  <KTIcon icon-name="check" icon-class="fs-3 me-1" />
                  Marcar Todas como Leídas
                </button>

                <button
                  @click="clearAllNotifications"
                  class="btn btn-danger"
                  :disabled="loading || (stats && stats.total === 0)"
                >
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  <KTIcon icon-name="trash" icon-class="fs-3 me-1" />
                  Limpiar Todas las Notificaciones
                </button>

                <div class="alert alert-warning">
                  <KTIcon icon-name="warning-2" icon-class="fs-2 me-2" />
                  <strong>Atención:</strong> Estas acciones son irreversibles.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notificaciones Recientes -->
      <div class="mt-8" v-if="stats && stats.recent && stats.recent.length > 0">
        <h4 class="mb-4">📋 Notificaciones Recientes</h4>
        <div class="table-responsive">
          <table class="table table-row-dashed table-row-gray-300 gy-4">
            <thead>
              <tr class="fw-bold fs-6 text-gray-800">
                <th>Tipo</th>
                <th>Título</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="notification in stats.recent" :key="notification.id">
                <td>
                  <span
                    :class="`badge badge-light-${getTypeColor(notification.type)}`"
                  >
                    {{ notification.type.toUpperCase() }}
                  </span>
                </td>
                <td class="fw-semibold">{{ notification.title }}</td>
                <td>
                  <span
                    v-if="notification.is_read"
                    class="badge badge-light-success"
                  >
                    <KTIcon icon-name="check" icon-class="fs-7 me-1" />
                    Leída
                  </span>
                  <span v-else class="badge badge-light-warning">
                    <KTIcon
                      icon-name="notification-status"
                      icon-class="fs-7 me-1"
                    />
                    Sin leer
                  </span>
                </td>
                <td class="text-muted">
                  {{ formatDate(notification.created_at) }}
                </td>
                <td>
                  <router-link
                    to="/notifications"
                    class="btn btn-sm btn-icon btn-active-light-primary"
                    title="Ver en página de notificaciones"
                  >
                    <KTIcon icon-name="eye" icon-class="fs-3" />
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Instrucciones -->
      <div class="mt-8">
        <div class="alert alert-info">
          <h5 class="alert-heading">🚀 Cómo probar las notificaciones:</h5>
          <ol class="mb-0">
            <li>
              <strong>Crear notificaciones:</strong> Usa los botones de arriba
              para crear diferentes tipos
            </li>
            <li>
              <strong>Ver notificaciones:</strong> Revisa el ícono de
              notificaciones en la barra lateral (debería mostrar un badge rojo)
            </li>
            <li>
              <strong>Acceder al menú:</strong> Haz clic en el ícono de
              notificaciones para ver el dropdown
            </li>
            <li>
              <strong>Ver página completa:</strong> Ve a
              <router-link to="/notifications" class="fw-bold"
                >Notificaciones</router-link
              >
              para ver todas
            </li>
            <li>
              <strong>Marcar como leídas:</strong> Haz clic en las
              notificaciones para marcarlas como leídas
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ===========================
// Imports
// ===========================
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ApiService from "@/core/services/ApiService";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";

// ===========================
// Types
// ===========================
interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  global: number;
  by_type: Record<string, number>;
  recent: Array<{
    id: number;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
  }>;
}

// ===========================
// State
// ===========================
const stats = ref<NotificationStats | null>(null);
const loading = ref(false);

// ===========================
// Methods
// ===========================
const loadStats = async () => {
  try {
    const response = await ApiService.get("/test-notifications/stats");
    stats.value = response.data;
  } catch (error) {
    console.error("Error loading stats:", error);
  }
};

const createNotification = async (type: string) => {
  loading.value = true;
  try {
    const response = await ApiService.post(
      `/test-notifications/create/${type}`,
    );
    if (response.data.success) {
      await loadStats();
    }
  } catch (error) {
    console.error(`Error creating ${type} notification:`, error);
  } finally {
    loading.value = false;
  }
};

const createBulkNotifications = async (count: number) => {
  loading.value = true;
  try {
    const response = await ApiService.post(`/test-notifications/bulk/${count}`);
    if (response.data.success) {
      await loadStats();
    }
  } catch (error) {
    console.error(`Error creating bulk notifications:`, error);
  } finally {
    loading.value = false;
  }
};

const markAllAsRead = async () => {
  loading.value = true;
  try {
    const response = await ApiService.patch(
      "/test-notifications/mark-all-read",
    );
    if (response.data.success) {
      await loadStats();
    }
  } catch (error) {
    console.error("Error marking all as read:", error);
  } finally {
    loading.value = false;
  }
};

const clearAllNotifications = async () => {
  if (
    !confirm(
      "¿Estás seguro de que quieres eliminar TODAS las notificaciones? Esta acción no se puede deshacer.",
    )
  ) {
    return;
  }

  loading.value = true;
  try {
    const response = await ApiService.delete("/test-notifications/clear");
    if (response.data.success) {
      await loadStats();
    }
  } catch (error) {
    console.error("Error clearing notifications:", error);
  } finally {
    loading.value = false;
  }
};

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    success: "success",
    warning: "warning",
    error: "danger",
    info: "info",
    system: "primary",
  };
  return colors[type] || "secondary";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "dd/MM/yyyy HH:mm", { locale: es });
};

// ===========================
// Lifecycle
// ===========================
onMounted(() => {
  loadStats();
});
</script>
