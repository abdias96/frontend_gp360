<template>
  <!--begin::Help drawer-->
  <div
    id="kt_help"
    class="bg-body"
    data-kt-drawer="true"
    data-kt-drawer-name="help"
    data-kt-drawer-activate="true"
    data-kt-drawer-overlay="true"
    data-kt-drawer-width="{default:'350px', 'md': '525px'}"
    data-kt-drawer-direction="end"
    data-kt-drawer-toggle="#kt_help_toggle"
    data-kt-drawer-close="#kt_help_close"
  >
    <!--begin::Card-->
    <div class="card shadow-none rounded-0 w-100">
      <!--begin::Header-->
      <div class="card-header" id="kt_help_header">
        <h5 class="card-title fw-semibold text-gray-600">
          {{ $t("help.title") }}
        </h5>

        <div class="card-toolbar">
          <button
            type="button"
            class="btn btn-sm btn-icon explore-btn-dismiss me-n5"
            id="kt_help_close"
          >
            <KTIcon icon-name="cross" icon-class="fs-2" />
          </button>
        </div>
      </div>
      <!--end::Header-->

      <!--begin::Body-->
      <div class="card-body" id="kt_help_body">
        <!--begin::Content-->
        <div
          id="kt_help_scroll"
          class="hover-scroll-overlay-y"
          data-kt-scroll="true"
          data-kt-scroll-height="auto"
          data-kt-scroll-wrappers="#kt_help_body"
          data-kt-scroll-dependencies="#kt_help_header"
          data-kt-scroll-offset="5px"
        >
          <!-- Current Page Help -->
          <div
            class="rounded border border-dashed border-primary p-6 mb-8"
            v-if="currentPageHelp"
          >
            <h6 class="fw-bold text-gray-800 mb-4">
              <KTIcon
                icon-name="information-5"
                icon-class="fs-2 text-primary me-2"
              />
              {{ $t("help.currentPage") }}
            </h6>
            <div class="fw-semibold text-gray-700 mb-3 fs-6">
              {{ currentPageHelp.title }}
            </div>
            <p class="text-gray-600 fs-7 mb-4">
              {{ currentPageHelp.description }}
            </p>

            <div
              v-if="
                currentPageHelp.actions && currentPageHelp.actions.length > 0
              "
            >
              <div class="fw-semibold text-gray-700 mb-2 fs-7">
                {{ $t("help.quickActions") }}:
              </div>
              <ul class="list-unstyled">
                <li
                  v-for="action in currentPageHelp.actions"
                  :key="action.name"
                  class="mb-1"
                >
                  <a
                    :href="action.path"
                    class="text-primary text-hover-primary fw-semibold fs-7"
                  >
                    <KTIcon :icon-name="action.icon" icon-class="fs-7 me-1" />
                    {{ action.name }}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <!-- User Manual -->
          <div class="rounded border border-dashed border-gray-300 p-6 mb-8">
            <h6 class="fw-bold text-gray-800 mb-4">
              <KTIcon
                icon-name="book-open"
                icon-class="fs-2 text-success me-2"
              />
              {{ $t("help.userManual.title") }}
            </h6>

            <div class="row g-3">
              <div
                class="col-12"
                v-for="section in userManualSections"
                :key="section.key"
              >
                <a
                  @click="showHelpSection(section.key)"
                  class="btn btn-outline btn-outline-dashed btn-active-light-primary d-flex align-items-center text-start p-3 w-100"
                >
                  <KTIcon
                    :icon-name="section.icon"
                    icon-class="fs-2 text-primary me-3"
                  />
                  <div class="d-flex flex-column">
                    <div class="fw-semibold text-gray-800">
                      {{ section.title }}
                    </div>
                    <div class="fs-7 text-gray-500">
                      {{ section.description }}
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <!-- System Status -->
          <div class="rounded border border-dashed border-info p-6 mb-8">
            <h6 class="fw-bold text-gray-800 mb-4">
              <KTIcon icon-name="monitor" icon-class="fs-2 text-info me-2" />
              {{ $t("help.systemStatus.title") }}
            </h6>

            <div class="d-flex flex-column gap-3">
              <div class="d-flex align-items-center">
                <span class="badge badge-light-success me-3">{{
                  $t("help.systemStatus.online")
                }}</span>
                <span class="text-gray-700 fs-7">{{
                  $t("help.systemStatus.systemOnline")
                }}</span>
              </div>
              <div class="d-flex align-items-center">
                <span class="badge badge-light-primary me-3">{{
                  onlineUsersCount
                }}</span>
                <span class="text-gray-700 fs-7">{{
                  $t("help.systemStatus.usersOnline")
                }}</span>
              </div>
              <div class="d-flex align-items-center">
                <span class="badge badge-light-info me-3"
                  >v{{ systemVersion }}</span
                >
                <span class="text-gray-700 fs-7">{{
                  $t("help.systemStatus.version")
                }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="rounded border border-dashed border-warning p-6 mb-8">
            <h6 class="fw-bold text-gray-800 mb-4">
              <KTIcon icon-name="rocket" icon-class="fs-2 text-warning me-2" />
              {{ $t("help.quickLinks.title") }}
            </h6>

            <div class="row g-2">
              <div class="col-6" v-for="link in quickLinks" :key="link.path">
                <router-link
                  :to="link.path"
                  class="btn btn-outline btn-outline-dashed btn-active-light-warning p-3 w-100 text-center"
                >
                  <KTIcon
                    :icon-name="link.icon"
                    icon-class="fs-3 text-warning mb-2"
                  />
                  <div class="fw-semibold text-gray-700 fs-8">
                    {{ link.name }}
                  </div>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Contact Support -->
          <div class="rounded border border-dashed border-danger p-6">
            <h6 class="fw-bold text-gray-800 mb-4">
              <KTIcon icon-name="support" icon-class="fs-2 text-danger me-2" />
              {{ $t("help.support.title") }}
            </h6>

            <p class="text-gray-600 fs-7 mb-4">
              {{ $t("help.support.description") }}
            </p>

            <div class="d-flex flex-column gap-2">
              <a
                href="mailto:soporte@siapen.gob.gt"
                class="btn btn-light-danger btn-sm"
              >
                <KTIcon icon-name="sms" icon-class="fs-4 me-1" />
                {{ $t("help.support.email") }}
              </a>
              <a href="tel:+50212345678" class="btn btn-light-danger btn-sm">
                <KTIcon icon-name="phone" icon-class="fs-4 me-1" />
                {{ $t("help.support.phone") }}
              </a>
            </div>
          </div>
        </div>
        <!--end::Content-->
      </div>
      <!--end::Body-->
    </div>
    <!--end::Card-->
  </div>
  <!--end::Help drawer-->
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import ApiService from "@/core/services/ApiService";

interface HelpSection {
  key: string;
  title: string;
  description: string;
  icon: string;
}

interface QuickLink {
  name: string;
  path: string;
  icon: string;
}

interface PageHelp {
  title: string;
  description: string;
  actions?: Array<{
    name: string;
    path: string;
    icon: string;
  }>;
}

export default defineComponent({
  name: "help-drawer",
  components: {
    KTIcon,
  },
  setup() {
    const route = useRoute();
    const onlineUsersCount = ref(0);
    const systemVersion = ref("2.0.0");

    const userManualSections: HelpSection[] = [
      {
        key: "getting-started",
        title: "Primeros Pasos",
        description: "Aprende lo básico del sistema",
        icon: "rocket",
      },
      {
        key: "user-management",
        title: "Gestión de Usuarios",
        description: "Crear y administrar usuarios",
        icon: "profile-user",
      },
      {
        key: "reports",
        title: "Reportes",
        description: "Generar y consultar reportes",
        icon: "graph-up",
      },
      {
        key: "system-admin",
        title: "Administración",
        description: "Configuración del sistema",
        icon: "setting-2",
      },
    ];

    const quickLinks: QuickLink[] = [
      { name: "Dashboard", path: "/dashboard", icon: "element-11" },
      { name: "Usuarios", path: "/users", icon: "profile-user" },
      { name: "Reportes", path: "/reports", icon: "graph-up" },
      { name: "Sistema", path: "/system", icon: "monitor" },
    ];

    const helpContent: Record<string, PageHelp> = {
      "/dashboard": {
        title: "Panel Principal",
        description:
          "Vista general del sistema con estadísticas y accesos rápidos.",
        actions: [
          { name: "Ver Usuarios", path: "/users", icon: "profile-user" },
          { name: "Generar Reporte", path: "/reports", icon: "graph-up" },
          { name: "Configuración", path: "/settings", icon: "setting-2" },
        ],
      },
      "/users": {
        title: "Gestión de Usuarios",
        description:
          "Administra usuarios del sistema, crea nuevos perfiles y gestiona permisos.",
        actions: [
          { name: "Crear Usuario", path: "/users/create", icon: "plus" },
          { name: "Gestionar Roles", path: "/roles", icon: "user-tick" },
          { name: "Permisos", path: "/permissions", icon: "shield-tick" },
        ],
      },
      "/system/sessions": {
        title: "Gestor de Sesiones",
        description:
          "Monitorea y administra las sesiones activas de los usuarios.",
        actions: [
          { name: "Ver Sesiones", path: "/system/sessions", icon: "monitor" },
          { name: "Configuración", path: "/settings", icon: "setting-2" },
        ],
      },
      "/system/jobs": {
        title: "Monitor de Trabajos",
        description:
          "Supervisa el estado de los trabajos en cola y procesos del sistema.",
        actions: [
          { name: "Ejecutar Prueba", path: "/system/jobs", icon: "flash" },
          { name: "Ver Logs", path: "/system/logs", icon: "note-2" },
        ],
      },
    };

    const currentPageHelp = computed(() => {
      return helpContent[route.path] || null;
    });

    const loadOnlineUsers = async () => {
      try {
        const response = await ApiService.get("/chat/online-users");
        if (response.data.success) {
          onlineUsersCount.value = response.data.online_count || 0;
        }
      } catch (error) {}
    };

    const showHelpSection = (sectionKey: string) => {
      // Here you could navigate to detailed help pages
      // or show modal with detailed information

      // For now, we'll show an alert
      alert(
        `Ayuda para: ${userManualSections.find((s) => s.key === sectionKey)?.title}`,
      );
    };

    onMounted(() => {
      loadOnlineUsers();

      // Refresh online users every minute
      setInterval(loadOnlineUsers, 60000);
    });

    return {
      currentPageHelp,
      userManualSections,
      quickLinks,
      onlineUsersCount,
      systemVersion,
      showHelpSection,
    };
  },
});
</script>
