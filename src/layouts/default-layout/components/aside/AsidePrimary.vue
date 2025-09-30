<template>
  <div
    class="aside-primary d-flex flex-column align-items-lg-center flex-row-auto"
  >
    <div
      class="aside-logo d-none d-lg-flex flex-column align-items-center flex-column-auto py-10"
      id="kt_aside_logo"
    >
      <a href="#">
        <div class="text-primary fw-bold fs-1">GP360</div>
      </a>
    </div>

    <div
      class="aside-nav d-flex flex-column align-items-center flex-column-fluid w-100 pt-5 pt-lg-0"
      id="kt_aside_nav"
    >
      <div
        class="hover-scroll-y mb-10"
        data-kt-scroll="true"
        data-kt-scroll-activate="{default: false, lg: true}"
        data-kt-scroll-height="auto"
        data-kt-scroll-wrappers="#kt_aside_nav"
        data-kt-scroll-dependencies="#kt_aside_logo, #kt_aside_footer"
        data-kt-scroll-offset="0px"
      >
        <ul class="nav flex-column">
          <li
            @click="enableSecondarySidebar"
            class="nav-item mb-2"
            data-bs-toggle="tooltip"
            data-bs-trigger="hover"
            data-bs-placement="right"
            data-bs-dismiss="click"
            data-bs-original-title="Menu"
          >
            <a
              class="nav-link btn btn-icon btn-active-color-primary btn-color-gray-500 btn-active-light active"
              data-bs-toggle="tab"
              href="#kt_aside_nav_tab_menu"
            >
              <KTIcon icon-name="burger-menu-2" icon-class="fs-2x" />
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div
      class="aside-footer d-flex flex-column align-items-center flex-column-auto"
      id="kt_aside_footer"
    >
      <div class="d-flex align-items-center mb-2">
        <div
          class="btn btn-icon btn-active-color-primary btn-color-gray-500 btn-active-light"
          data-kt-menu-trigger="click"
          data-kt-menu-overflow="true"
          data-kt-menu-placement="top-start"
          data-kt-menu-flip="top-end"
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          data-bs-dismiss="click"
          :title="$t('dashboard.quickActions.title')"
        >
          <KTIcon icon-name="element-plus" icon-class="fs-2 fs-lg-1" />
        </div>
        <KTQuickLinksMenu></KTQuickLinksMenu>
      </div>

      <div class="d-flex align-items-center mb-2">
        <div
          class="btn btn-icon btn-active-color-primary btn-color-gray-500 btn-active-light position-relative"
          data-kt-menu-trigger="click"
          data-kt-menu-overflow="true"
          data-kt-menu-placement="top-start"
          data-kt-menu-flip="top-end"
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          data-bs-dismiss="click"
          title="Notificaciones"
        >
          <KTIcon icon-name="notification-status" icon-class="fs-2 fs-lg-1" />
          <span
            v-if="unreadCount > 0"
            class="badge badge-circle badge-danger position-absolute top-0 start-100 translate-middle"
            style="
              min-width: 18px;
              height: 18px;
              font-size: 10px;
              line-height: 18px;
            "
          >
            {{ unreadCount > 99 ? "99+" : unreadCount }}
          </span>
        </div>
        <KTNotificationsMenu></KTNotificationsMenu>
      </div>

      <div class="d-flex align-items-center mb-3">
        <div
          class="btn btn-icon btn-active-color-primary btn-color-gray-500 btn-active-light"
          data-kt-menu-trigger="click"
          data-kt-menu-overflow="true"
          data-kt-menu-placement="top-start"
          data-kt-menu-flip="top-end"
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          data-bs-dismiss="click"
          title="Logs de Actividad"
          id="kt_activities_toggle"
        >
          <KTIcon icon-name="chart-simple" icon-class="fs-2 fs-lg-1" />
        </div>
      </div>

      <div
        class="d-flex align-items-center mb-10"
        id="kt_header_user_menu_toggle"
      >
        <div
          class="cursor-pointer symbol symbol-40px"
          data-kt-menu-trigger="click"
          data-kt-menu-overflow="true"
          data-kt-menu-placement="top-start"
          data-kt-menu-flip="top-end"
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          data-bs-dismiss="click"
          title="Perfil de usuario"
        >
          <template v-if="userPhoto">
            <img
              :src="userPhoto"
              :key="photoKey"
              alt="user"
              class="w-40px h-40px object-cover rounded-circle"
              @error="handleImageError"
            />
          </template>
          <template v-else>
            <span class="symbol-label fs-3 bg-light-primary text-primary">
              {{ userInitials }}
            </span>
          </template>
        </div>
        <KTUserMenu></KTUserMenu>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted, computed, watch, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import FileStorageService from "@/core/services/FileStorageService";
import KTQuickLinksMenu from "@/layouts/default-layout/components/menus/QuickLinksMenu.vue";
import KTNotificationsMenu from "@/layouts/default-layout/components/menus/NotificationsMenu.vue";
import KTUserMenu from "@/layouts/default-layout/components/menus/UserAccountMenu.vue";
import { useNotifications } from "@/composables/useNotifications";

export default defineComponent({
  name: "kt-aside-primary",
  components: {
    KTQuickLinksMenu,
    KTNotificationsMenu,
    KTUserMenu,
  },
  setup() {
    const store = useAuthStore();
    const { unreadCount } = useNotifications();

    const user = computed(() => store.user);
    const userName = computed(() => store.userName);

    // Key reactivo para forzar recarga de imagen
    const photoKey = ref(Date.now());

    // Computed para la URL de la foto de perfil
    const userPhoto = computed(() => {
      const photo = user.value?.profile_photo;

      if (photo && photo.trim() !== "") {
        const url = FileStorageService.getProfilePhotoUrl(photo);
        return url;
      }
      return "";
    });

    // Manejar error de carga de imagen
    const handleImageError = (event: Event) => {
      const img = event.target as HTMLImageElement;
      // Ocultar la imagen si falla la carga
      img.style.display = "none";
    };

    // Optimized watcher for profile photo changes only
    watch(
      () => user.value?.profile_photo,
      (newPhoto, oldPhoto) => {
        if (newPhoto !== oldPhoto && newPhoto) {
          // Generate new key to force image reload only when photo actually changes
          photoKey.value = Date.now();
        }
      },
      { flush: "post" }, // Run after DOM updates
    );

    // Computed para iniciales del usuario
    const userInitials = computed(() => {
      const name = userName.value;
      if (name && name !== "Usuario") {
        return name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2);
      }
      return "U";
    });

    const enableSecondarySidebar = () => {
      document.body.setAttribute("data-kt-aside-minimize", "off");
    };

    // Auto-enable secondary sidebar on mount
    onMounted(() => {
      enableSecondarySidebar();
    });

    return {
      user,
      userPhoto,
      photoKey,
      userInitials,
      unreadCount,
      handleImageError,
      getAssetPath,
      enableSecondarySidebar,
    };
  },
});
</script>
