<template>
  <div class="card">
    <!--begin::Header-->
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <div class="d-flex align-items-center position-relative my-1">
          <KTIcon
            icon-name="magnifier"
            icon-class="fs-1 position-absolute ms-6"
          />
          <input
            v-model="searchQuery"
            type="text"
            class="form-control form-control-solid w-250px ps-15"
            placeholder="Buscar notificaciones..."
            @input="debouncedSearch"
          />
        </div>
      </div>

      <div class="card-toolbar">
        <div
          class="d-flex justify-content-end"
          data-kt-subscription-table-toolbar="base"
        >
          <!-- Filter by Type -->
          <select
            v-model="selectedType"
            @change="loadNotifications"
            class="form-select form-select-solid w-150px me-3"
          >
            <option value="">Todos los tipos</option>
            <option value="info">Información</option>
            <option value="success">Éxito</option>
            <option value="warning">Advertencia</option>
            <option value="error">Error</option>
            <option value="system">Sistema</option>
          </select>

          <!-- Filter by Status -->
          <select
            v-model="selectedStatus"
            @change="loadNotifications"
            class="form-select form-select-solid w-150px me-3"
          >
            <option value="">Todas</option>
            <option value="unread">Sin leer</option>
            <option value="read">Leídas</option>
          </select>

          <!-- Actions -->
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="btn btn-sm btn-primary me-2"
            :disabled="loading"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            Marcar todas como leídas
          </button>

          <button
            @click="refreshNotifications"
            class="btn btn-sm btn-icon btn-active-light-primary"
            :disabled="loading"
          >
            <KTIcon icon-name="arrows-circle" icon-class="fs-3" />
          </button>
        </div>
      </div>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body pt-0">
      <!-- Stats Cards -->
      <div class="row g-6 g-xl-9 mb-8" v-if="stats">
        <div class="col-md-6 col-xl-3">
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
        <div class="col-md-6 col-xl-3">
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
        <div class="col-md-6 col-xl-3">
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
        <div class="col-md-6 col-xl-3">
          <div class="card bg-light-info">
            <div class="card-body text-center">
              <KTIcon
                icon-name="calendar-8"
                icon-class="fs-2x text-info mb-3"
              />
              <div class="fs-2 fw-bold text-gray-800">
                {{ stats.recent_activity }}
              </div>
              <div class="fs-7 text-muted">Esta semana</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading && notifications.length === 0"
        class="text-center py-10"
      >
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!loading && notifications.length === 0"
        class="text-center py-10"
      >
        <KTIcon
          icon-name="notification-bing"
          icon-class="fs-3x text-muted mb-5"
        />
        <h3 class="text-muted">No hay notificaciones</h3>
        <p class="text-muted">
          No se encontraron notificaciones con los filtros seleccionados.
        </p>
      </div>

      <!-- Notifications List -->
      <div v-else class="timeline timeline-border-dashed">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="timeline-item"
        >
          <!--begin::Timeline line-->
          <div class="timeline-line"></div>
          <!--end::Timeline line-->

          <!--begin::Timeline icon-->
          <div class="timeline-icon">
            <KTIcon
              :icon-name="getNotificationIcon(notification)"
              :icon-class="`fs-2 text-${notification.color || 'primary'}`"
            />
          </div>
          <!--end::Timeline icon-->

          <!--begin::Timeline content-->
          <div class="timeline-content mb-10 mt-n1">
            <!--begin::Timeline heading-->
            <div class="pe-3 mb-5">
              <!--begin::Title-->
              <div class="fs-5 fw-semibold mb-2">
                <span
                  @click="markAsRead(notification)"
                  class="cursor-pointer text-hover-primary"
                  :class="{ 'text-primary fw-bold': !notification.is_read }"
                >
                  {{ notification.title }}
                </span>
                <span
                  v-if="!notification.is_read"
                  class="badge badge-light-primary ms-2"
                  >Nuevo</span
                >
              </div>
              <!--end::Title-->

              <!--begin::Description-->
              <div class="overflow-auto pb-5">
                <div class="text-muted fw-semibold text-start ps-10">
                  {{ notification.message }}
                </div>
              </div>
              <!--end::Description-->

              <!--begin::Action-->
              <div v-if="notification.action_url" class="ps-10">
                <a
                  :href="notification.action_url"
                  target="_blank"
                  class="btn btn-sm btn-light-primary"
                >
                  {{ notification.action_text || "Ver más" }}
                </a>
              </div>
              <!--end::Action-->
            </div>
            <!--end::Timeline heading-->

            <!--begin::Timeline details-->
            <div class="d-flex align-items-center mt-1 fs-6">
              <!--begin::Info-->
              <div class="text-muted me-2 fs-7">
                <span
                  class="badge badge-light-{{ notification.color || 'primary' }} me-2"
                >
                  {{ notification.type.toUpperCase() }}
                </span>
                {{ formatDate(notification.created_at) }}
              </div>
              <!--end::Info-->

              <!--begin::User-->
              <div v-if="notification.creator" class="text-muted me-2 fs-7">
                por {{ notification.creator.name }}
              </div>
              <!--end::User-->

              <!--begin::Actions-->
              <div class="ms-auto">
                <button
                  v-if="!notification.is_read"
                  @click="markAsRead(notification)"
                  class="btn btn-sm btn-icon btn-active-light-primary"
                  title="Marcar como leída"
                >
                  <KTIcon icon-name="check" icon-class="fs-3" />
                </button>
              </div>
              <!--end::Actions-->
            </div>
            <!--end::Timeline details-->
          </div>
          <!--end::Timeline content-->
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination && pagination.last_page > 1"
        class="d-flex flex-stack flex-wrap pt-10"
      >
        <div class="fs-6 fw-semibold text-gray-700">
          Mostrando {{ pagination.from }} a {{ pagination.to }} de
          {{ pagination.total }} notificaciones
        </div>

        <ul class="pagination">
          <li
            class="page-item"
            :class="{ disabled: pagination.current_page === 1 }"
          >
            <button
              @click="loadPage(pagination.current_page - 1)"
              class="page-link"
            >
              <KTIcon icon-name="black-left" icon-class="fs-3" />
            </button>
          </li>

          <li
            v-for="page in getVisiblePages()"
            :key="page"
            class="page-item"
            :class="{ active: pagination.current_page === page }"
          >
            <button @click="loadPage(page)" class="page-link">
              {{ page }}
            </button>
          </li>

          <li
            class="page-item"
            :class="{
              disabled: pagination.current_page === pagination.last_page,
            }"
          >
            <button
              @click="loadPage(pagination.current_page + 1)"
              class="page-link"
            >
              <KTIcon icon-name="black-right" icon-class="fs-3" />
            </button>
          </li>
        </ul>
      </div>
    </div>
    <!--end::Body-->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import ApiService from "@/core/services/ApiService";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import { debounce } from "lodash-es";

// Types
interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  color?: string;
  icon?: string;
  is_read: boolean;
  action_url?: string;
  action_text?: string;
  created_at: string;
  creator?: {
    name: string;
  };
}

interface Stats {
  total: number;
  unread: number;
  read: number;
  recent_activity: number;
  by_type: Record<string, number>;
}

interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// Reactive State
const notifications = ref<Notification[]>([]);
const stats = ref<Stats | null>(null);
const pagination = ref<Pagination | null>(null);
const loading = ref(false);
const searchQuery = ref("");
const selectedType = ref("");
const selectedStatus = ref("");
const unreadCount = ref(0);

// Methods
const loadNotifications = async (page = 1) => {
  loading.value = true;
  try {
    const params: any = {
      page,
      per_page: 15,
    };

    if (searchQuery.value) {
      params.search = searchQuery.value;
    }
    if (selectedType.value) {
      params.type = selectedType.value;
    }
    if (selectedStatus.value) {
      params.is_read = selectedStatus.value === "read" ? "true" : "false";
    }

    const response = await ApiService.query("/notifications", params);
    notifications.value = response.data.data;
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      per_page: response.data.per_page,
      total: response.data.total,
      from: response.data.from,
      to: response.data.to,
    };
  } catch (error) {
    console.error("Error loading notifications:", error);
  } finally {
    loading.value = false;
  }
};

const loadStats = async () => {
  try {
    const response = await ApiService.get("/notifications/stats");
    stats.value = response.data;
  } catch (error) {
    console.error("Error loading stats:", error);
  }
};

const loadUnreadCount = async () => {
  try {
    const response = await ApiService.get("/notifications/unread-count");
    unreadCount.value = response.data.count;
  } catch (error) {
    console.error("Error loading unread count:", error);
  }
};

const markAsRead = async (notification: Notification) => {
  if (notification.is_read) {
    if (notification.action_url) {
      window.open(notification.action_url, "_blank");
    }
    return;
  }

  try {
    await ApiService.patch(`/notifications/${notification.id}/read`);
    notification.is_read = true;
    unreadCount.value = Math.max(0, unreadCount.value - 1);

    if (stats.value) {
      stats.value.unread = Math.max(0, stats.value.unread - 1);
      stats.value.read += 1;
    }

    if (notification.action_url) {
      window.open(notification.action_url, "_blank");
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

const markAllAsRead = async () => {
  if (loading.value || unreadCount.value === 0) return;

  loading.value = true;
  try {
    await ApiService.patch("/notifications/mark-all-read");
    notifications.value.forEach((notification) => {
      notification.is_read = true;
    });
    unreadCount.value = 0;

    if (stats.value) {
      stats.value.read = stats.value.total;
      stats.value.unread = 0;
    }
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
  } finally {
    loading.value = false;
  }
};

const refreshNotifications = async () => {
  await Promise.all([loadNotifications(1), loadStats(), loadUnreadCount()]);
};

const loadPage = (page: number) => {
  if (pagination.value && page >= 1 && page <= pagination.value.last_page) {
    loadNotifications(page);
  }
};

const getVisiblePages = () => {
  if (!pagination.value) return [];

  const current = pagination.value.current_page;
  const last = pagination.value.last_page;
  const delta = 2;
  const range = [];

  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(last - 1, current + delta);
    i++
  ) {
    range.push(i);
  }

  if (current - delta > 2) {
    range.unshift("...");
  }
  if (current + delta < last - 1) {
    range.push("...");
  }

  range.unshift(1);
  if (last !== 1) {
    range.push(last);
  }

  return range;
};

const debouncedSearch = debounce(() => {
  loadNotifications(1);
}, 500);

const getNotificationIcon = (notification: Notification) => {
  if (notification.icon) {
    return notification.icon;
  }

  switch (notification.type) {
    case "success":
      return "check-circle";
    case "warning":
      return "warning-2";
    case "error":
      return "cross-circle";
    case "system":
      return "gear";
    default:
      return "information-5";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  } else {
    return format(date, "dd/MM/yyyy HH:mm", { locale: es });
  }
};

// Lifecycle
onMounted(() => {
  refreshNotifications();
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.timeline-item:last-child .timeline-line {
  display: none;
}
</style>
