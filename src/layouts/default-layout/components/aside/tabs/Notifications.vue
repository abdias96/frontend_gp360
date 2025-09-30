<template>
  <div class="card-header border-0">
    <h3 class="card-title fw-bold text-gray-900">Notificaciones</h3>
    <div class="card-toolbar">
      <button
        @click="markAllAsRead"
        class="btn btn-sm btn-light me-2"
        :disabled="loading || unreadCount === 0"
      >
        Marcar como leídas
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

  <div class="card-body pt-0">
    <!-- Loading State -->
    <div v-if="loading && notifications.length === 0" class="text-center py-5">
      <div class="spinner-border spinner-border-sm" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!loading && notifications.length === 0"
      class="text-center py-5"
    >
      <KTIcon
        icon-name="notification-bing"
        icon-class="fs-2x text-muted mb-3"
      />
      <p class="text-muted">No hay notificaciones</p>
    </div>

    <!-- Notifications List -->
    <template v-else>
      <div
        v-for="notification in notifications"
        :key="notification.id"
        @click="markAsRead(notification)"
        :class="[
          'd-flex align-items-center rounded p-4 mb-3 cursor-pointer',
          `bg-light-${notification.color || 'primary'}`,
          { 'opacity-75': notification.is_read },
        ]"
      >
        <!--begin::Icon-->
        <KTIcon
          :icon-name="getNotificationIcon(notification)"
          :icon-class="`text-${notification.color || 'primary'} fs-1 me-4`"
        />
        <!--end::Icon-->

        <!--begin::Content-->
        <div class="flex-grow-1 me-2">
          <div class="d-flex align-items-center justify-content-between">
            <span class="fw-bold text-gray-800 fs-6">{{
              notification.title
            }}</span>
            <span
              v-if="!notification.is_read"
              class="badge badge-light-primary badge-circle ms-2"
            >
              <i class="ki-outline ki-dot fs-3"></i>
            </span>
          </div>
          <p class="text-muted fw-semibold mb-1 fs-7">
            {{ notification.message }}
          </p>
          <span class="text-muted fs-8">{{
            formatDate(notification.created_at)
          }}</span>
        </div>
        <!--end::Content-->
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore" class="text-center mt-4">
        <button
          @click="loadMore"
          class="btn btn-sm btn-light"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          Cargar más
        </button>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import ApiService from "@/core/services/ApiService";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";

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
}

export default defineComponent({
  name: "kt-notifications",
  components: {
    KTIcon,
  },
  setup() {
    const notifications = ref<Notification[]>([]);
    const loading = ref(false);
    const currentPage = ref(1);
    const hasMore = ref(true);
    const unreadCount = ref(0);

    const loadNotifications = async (page = 1, append = false) => {
      if (loading.value) return;

      loading.value = true;
      try {
        const response = await ApiService.query("/notifications", {
          page,
          per_page: 10,
        });

        if (append) {
          notifications.value.push(...response.data.data);
        } else {
          notifications.value = response.data.data;
        }

        hasMore.value = response.data.current_page < response.data.last_page;
        currentPage.value = response.data.current_page;
      } catch (error) {
        console.error("Error loading notifications:", error);
      } finally {
        loading.value = false;
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
      if (notification.is_read) return;

      try {
        await ApiService.patch(`/notifications/${notification.id}/read`);
        notification.is_read = true;
        unreadCount.value = Math.max(0, unreadCount.value - 1);

        // Navigate to action URL if provided
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
      } catch (error) {
        console.error("Error marking all notifications as read:", error);
      } finally {
        loading.value = false;
      }
    };

    const refreshNotifications = async () => {
      currentPage.value = 1;
      hasMore.value = true;
      await Promise.all([loadNotifications(1, false), loadUnreadCount()]);
    };

    const loadMore = () => {
      if (hasMore.value) {
        loadNotifications(currentPage.value + 1, true);
      }
    };

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

    onMounted(() => {
      refreshNotifications();
    });

    return {
      notifications,
      loading,
      hasMore,
      unreadCount,
      loadMore,
      markAsRead,
      markAllAsRead,
      refreshNotifications,
      getNotificationIcon,
      formatDate,
    };
  },
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
