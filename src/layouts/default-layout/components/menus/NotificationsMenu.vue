<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px"
    data-kt-menu="true"
  >
    <!--begin::Heading-->
    <div
      class="d-flex flex-column bgi-no-repeat rounded-top"
      :style="`background-image: url('${getAssetPath(
        '/media/misc/menu-header-bg.jpg',
      )}')`"
    >
      <!--begin::Title-->
      <h3 class="text-white fw-semibold px-9 mt-10 mb-6">
        Notificaciones
        <span class="fs-8 opacity-75 ps-3">{{ unreadCount }} sin leer</span>
      </h3>
      <!--end::Title-->

      <!--begin::Tabs-->
      <ul
        class="nav nav-line-tabs nav-line-tabs-2x nav-stretch fw-semibold px-9"
      >
        <li class="nav-item">
          <a
            class="nav-link text-white opacity-75 opacity-state-100 pb-4 active"
            data-bs-toggle="tab"
            href="#kt_topbar_notifications_1"
            >Recientes</a
          >
        </li>

        <li class="nav-item">
          <a
            class="nav-link text-white opacity-75 opacity-state-100 pb-4"
            data-bs-toggle="tab"
            href="#kt_topbar_notifications_2"
            >Sistema</a
          >
        </li>

        <li class="nav-item">
          <a
            class="nav-link text-white opacity-75 opacity-state-100 pb-4"
            data-bs-toggle="tab"
            href="#kt_topbar_notifications_3"
            >Todas</a
          >
        </li>
      </ul>
      <!--end::Tabs-->
    </div>
    <!--end::Heading-->

    <!--begin::Tab content-->
    <div class="tab-content">
      <!--begin::Tab panel - Recent Notifications-->
      <div
        class="tab-pane fade show active"
        id="kt_topbar_notifications_1"
        role="tabpanel"
      >
        <!--begin::Items-->
        <div class="scroll-y mh-325px my-5 px-8">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-4">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="recentNotifications.length === 0"
            class="text-center py-8"
          >
            <KTIcon
              icon-name="notification-bing"
              icon-class="fs-2x text-muted mb-3"
            />
            <p class="text-muted">No hay notificaciones recientes</p>
          </div>

          <!-- Notifications List -->
          <template v-else>
            <div
              v-for="notification in recentNotifications"
              :key="notification.id"
              @click="markAsRead(notification)"
              class="d-flex flex-stack py-4 cursor-pointer"
            >
              <!--begin::Section-->
              <div class="d-flex align-items-center">
                <!--begin::Symbol-->
                <div class="symbol symbol-35px me-4">
                  <span
                    :class="`bg-light-${notification.color || 'primary'}`"
                    class="symbol-label"
                  >
                    <KTIcon
                      :icon-name="getNotificationIcon(notification)"
                      :icon-class="`text-${notification.color || 'primary'}`"
                    />
                  </span>
                </div>
                <!--end::Symbol-->

                <!--begin::Title-->
                <div class="mb-0 me-2">
                  <div class="d-flex align-items-center">
                    <span class="fs-6 text-gray-800 text-hover-primary fw-bold">
                      {{ notification.title }}
                    </span>
                    <span
                      v-if="!notification.is_read"
                      class="badge badge-light-primary badge-circle ms-2"
                    >
                      <i class="ki-outline ki-dot fs-3"></i>
                    </span>
                  </div>
                  <div class="text-gray-500 fs-7">
                    {{ notification.message }}
                  </div>
                </div>
                <!--end::Title-->
              </div>
              <!--end::Section-->

              <!--begin::Label-->
              <span class="badge badge-light fs-8">{{
                formatTimeAgo(notification.created_at)
              }}</span>
              <!--end::Label-->
            </div>
          </template>
        </div>
        <!--end::Items-->

        <!--begin::Footer-->
        <div class="py-3 text-center border-top">
          <router-link
            to="/notifications"
            class="btn btn-color-gray-600 btn-active-color-primary"
          >
            Ver Todas
            <KTIcon icon-name="arrow-right" icon-class="fs-5" />
          </router-link>
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="btn btn-sm btn-light ms-2"
            :disabled="loading"
          >
            Marcar todas como leídas
          </button>
        </div>
        <!--end::Footer-->
      </div>
      <!--end::Tab panel-->

      <!--begin::Tab panel - System Notifications-->
      <div class="tab-pane fade" id="kt_topbar_notifications_2" role="tabpanel">
        <!--begin::Items-->
        <div class="scroll-y mh-325px my-5 px-8">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-4">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>

          <!-- System Notifications -->
          <template v-else>
            <div
              v-for="notification in systemNotifications"
              :key="notification.id"
              @click="markAsRead(notification)"
              class="d-flex flex-stack py-4 cursor-pointer"
            >
              <!--begin::Section-->
              <div class="d-flex align-items-center me-2">
                <!--begin::Icon-->
                <div class="symbol symbol-35px me-4">
                  <span class="symbol-label bg-light-warning">
                    <KTIcon icon-name="gear" icon-class="text-warning" />
                  </span>
                </div>
                <!--end::Icon-->

                <!--begin::Content-->
                <div class="mb-0 me-2">
                  <div class="d-flex align-items-center">
                    <span class="fs-6 text-gray-800 text-hover-primary fw-bold">
                      {{ notification.title }}
                    </span>
                    <span
                      v-if="!notification.is_read"
                      class="badge badge-light-primary badge-circle ms-2"
                    >
                      <i class="ki-outline ki-dot fs-3"></i>
                    </span>
                  </div>
                  <div class="text-gray-500 fs-7">
                    {{ notification.message }}
                  </div>
                </div>
                <!--end::Content-->
              </div>
              <!--end::Section-->

              <!--begin::Time-->
              <span class="badge badge-light fs-8">{{
                formatTimeAgo(notification.created_at)
              }}</span>
              <!--end::Time-->
            </div>

            <!-- Empty State for System -->
            <div
              v-if="systemNotifications.length === 0"
              class="text-center py-8"
            >
              <KTIcon icon-name="gear" icon-class="fs-2x text-muted mb-3" />
              <p class="text-muted">No hay notificaciones del sistema</p>
            </div>
          </template>
        </div>
        <!--end::Items-->

        <!--begin::Footer-->
        <div class="py-3 text-center border-top">
          <router-link
            to="/notifications?type=system"
            class="btn btn-color-gray-600 btn-active-color-primary"
          >
            Ver Todas del Sistema
            <KTIcon icon-name="arrow-right" icon-class="fs-5" />
          </router-link>
        </div>
        <!--end::Footer-->
      </div>
      <!--end::Tab panel-->

      <!--begin::Tab panel - All Notifications-->
      <div class="tab-pane fade" id="kt_topbar_notifications_3" role="tabpanel">
        <!--begin::Items-->
        <div class="scroll-y mh-325px my-5 px-8">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-4">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>

          <!-- All Notifications -->
          <template v-else>
            <div
              v-for="notification in allNotifications"
              :key="notification.id"
              @click="markAsRead(notification)"
              class="d-flex flex-stack py-4 cursor-pointer"
            >
              <!--begin::Section-->
              <div class="d-flex align-items-center me-2">
                <!--begin::Type Badge-->
                <span
                  class="w-70px badge me-4"
                  :class="`badge-light-${notification.color || 'primary'}`"
                  >{{ notification.type.toUpperCase() }}</span
                >
                <!--end::Type Badge-->

                <!--begin::Content-->
                <div class="mb-0 me-2">
                  <div class="d-flex align-items-center">
                    <span class="text-gray-800 text-hover-primary fw-semibold">
                      {{ notification.title }}
                    </span>
                    <span
                      v-if="!notification.is_read"
                      class="badge badge-light-primary badge-circle ms-2"
                    >
                      <i class="ki-outline ki-dot fs-3"></i>
                    </span>
                  </div>
                  <div class="text-gray-500 fs-7">
                    {{ notification.message }}
                  </div>
                </div>
                <!--end::Content-->
              </div>
              <!--end::Section-->

              <!--begin::Time-->
              <span class="badge badge-light fs-8">{{
                formatTimeAgo(notification.created_at)
              }}</span>
              <!--end::Time-->
            </div>

            <!-- Empty State for All -->
            <div v-if="allNotifications.length === 0" class="text-center py-8">
              <KTIcon
                icon-name="notification-bing"
                icon-class="fs-2x text-muted mb-3"
              />
              <p class="text-muted">No hay notificaciones</p>
            </div>
          </template>
        </div>
        <!--end::Items-->

        <!--begin::Footer-->
        <div class="py-3 text-center border-top">
          <router-link
            to="/notifications"
            class="btn btn-color-gray-600 btn-active-color-primary"
          >
            Ver Todas
            <KTIcon icon-name="arrow-right" icon-class="fs-5" />
          </router-link>
        </div>
        <!--end::Footer-->
      </div>
      <!--end::Tab panel-->
    </div>
    <!--end::Tab content-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  computed,
  watch,
} from "vue";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import ApiService from "@/core/services/ApiService";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import { useNotifications } from "@/composables/useNotifications";

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
  name: "notifications-menu",
  components: {
    KTIcon,
  },
  setup() {
    const notifications = ref<Notification[]>([]);
    const loading = ref(false);

    // Use the global notifications composable
    const {
      unreadCount,
      refreshUnreadCount,
      decrementUnreadCount,
      resetUnreadCount,
      subscribe,
    } = useNotifications();

    const recentNotifications = computed(() => notifications.value.slice(0, 5));

    const systemNotifications = computed(() =>
      notifications.value.filter((n) => n.type === "system").slice(0, 5),
    );

    const allNotifications = computed(() => notifications.value.slice(0, 8));

    const loadNotifications = async () => {
      if (loading.value) return;

      loading.value = true;
      try {
        const response = await ApiService.get("/notifications/recent");
        notifications.value = response.data.notifications || [];
      } catch (error) {
        console.error("Error loading notifications:", error);
        notifications.value = [];
      } finally {
        loading.value = false;
      }
    };

    // Subscribe to unread count changes to reload notifications
    const unsubscribe = subscribe(() => {
      loadNotifications();
    });

    const markAsRead = async (notification: Notification) => {
      if (notification.is_read) return;

      try {
        await ApiService.patch(`/notifications/${notification.id}/read`);
        notification.is_read = true;
        decrementUnreadCount();

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
        resetUnreadCount();
      } catch (error) {
        console.error("Error marking all notifications as read:", error);
      } finally {
        loading.value = false;
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

    const formatTimeAgo = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true, locale: es });
      } catch (error) {
        return dateString;
      }
    };

    onMounted(() => {
      loadNotifications();
    });

    // Cleanup subscription when component unmounts
    onUnmounted(() => {
      unsubscribe();
    });

    return {
      notifications,
      recentNotifications,
      systemNotifications,
      allNotifications,
      loading,
      unreadCount,
      markAsRead,
      markAllAsRead,
      getNotificationIcon,
      formatTimeAgo,
      getAssetPath,
    };
  },
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
