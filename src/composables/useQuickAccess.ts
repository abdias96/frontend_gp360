import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import ApiService from "@/core/services/ApiService";
import { useNotifications } from "@/composables/useNotifications";

export interface QuickAccessItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: "primary" | "success" | "warning" | "danger" | "info" | "dark";
  route?: string;
  url?: string;
  permission?: string;
  category: "frequent" | "system" | "admin" | "user";
  count?: number;
  enabled: boolean;
  order: number;
}

export interface QuickAccessStats {
  pendingUsers: number;
  unreadNotifications: number;
  systemAlerts: number;
  todayLogins: number;
}

// Quick Access presets based on GP360 functionality
const defaultQuickAccessItems: QuickAccessItem[] = [
  // Frequent actions
  {
    id: "biometric-verification",
    title: "Verificación Biométrica 1:N",
    description: "Verificación de huellas dactilares",
    icon: "fingerprint-scan",
    color: "success",
    route: "/inmates/biometric-verification",
    permission: "inmates.biometric",
    category: "frequent",
    enabled: true,
    order: 1,
  },
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Panel principal",
    icon: "element-11",
    color: "primary",
    route: "/dashboard",
    permission: "dashboard.view",
    category: "frequent",
    enabled: true,
    order: 2,
  },
  {
    id: "create-user",
    title: "Crear Usuario",
    description: "Nuevo usuario",
    icon: "user-edit",
    color: "info",
    route: "/users/create",
    permission: "users.create",
    category: "frequent",
    enabled: true,
    order: 3,
  },
  {
    id: "users-list",
    title: "Lista de Usuarios",
    description: "Gestión de usuarios",
    icon: "people",
    color: "info",
    route: "/users",
    permission: "users.list",
    category: "frequent",
    enabled: true,
    order: 4,
  },
  {
    id: "notifications",
    title: "Notificaciones",
    description: "Centro de notificaciones",
    icon: "notification-bing",
    color: "warning",
    route: "/notifications",
    category: "user",
    enabled: true,
    order: 5,
  },

  // System administration
  {
    id: "system-logs",
    title: "Logs del Sistema",
    description: "Actividad del sistema",
    icon: "chart-line",
    color: "primary",
    route: "/system/logs",
    permission: "logs.view",
    category: "system",
    enabled: true,
    order: 6,
  },
  {
    id: "cache-monitor",
    title: "Monitor de Cache",
    description: "Gestión del cache",
    icon: "abstract-26",
    color: "info",
    route: "/system/cache",
    permission: "settings.system",
    category: "system",
    enabled: true,
    order: 7,
  },
  {
    id: "jobs-monitor",
    title: "Monitor de Jobs",
    description: "Gestión de colas",
    icon: "abstract-37",
    color: "warning",
    route: "/system/jobs",
    permission: "settings.system",
    category: "system",
    enabled: true,
    order: 8,
  },
  {
    id: "roles-permissions",
    title: "Roles y Permisos",
    description: "Gestión de accesos",
    icon: "key",
    color: "danger",
    route: "/roles",
    permission: "roles.view",
    category: "admin",
    enabled: true,
    order: 9,
  },
  {
    id: "settings",
    title: "Configuración",
    description: "Ajustes del sistema",
    icon: "gear",
    color: "secondary",
    route: "/settings/general",
    permission: "settings.view",
    category: "admin",
    enabled: true,
    order: 10,
  },
  {
    id: "user-profile",
    title: "Mi Perfil",
    description: "Configuración personal",
    icon: "profile-circle",
    color: "info",
    route: "/user/profile",
    category: "user",
    enabled: true,
    order: 11,
  },
];

export function useQuickAccess() {
  const authStore = useAuthStore();
  const router = useRouter();
  const { unreadCount } = useNotifications();

  const quickAccessItems = ref<QuickAccessItem[]>([]);
  const stats = ref<QuickAccessStats>({
    pendingUsers: 0,
    unreadNotifications: 0,
    systemAlerts: 0,
    todayLogins: 0,
  });
  const loading = ref(false);

  // Filter items based on user permissions
  const availableItems = computed(() => {
    return quickAccessItems.value
      .filter((item) => {
        if (!item.enabled) return false;

        // Check permissions if item has permission requirement
        if (item.permission) {
          return authStore.hasPermission(item.permission);
        }

        return true;
      })
      .sort((a, b) => a.order - b.order);
  });

  // Get items by category
  const frequentItems = computed(() =>
    availableItems.value
      .filter((item) => item.category === "frequent")
      .slice(0, 4),
  );

  const systemItems = computed(() =>
    availableItems.value
      .filter((item) => item.category === "system")
      .slice(0, 3),
  );

  const adminItems = computed(() =>
    availableItems.value
      .filter((item) => item.category === "admin")
      .slice(0, 3),
  );

  const userItems = computed(() =>
    availableItems.value.filter((item) => item.category === "user").slice(0, 2),
  );

  // Most used items (first 6 available items)
  const popularItems = computed(() => availableItems.value.slice(0, 6));

  const loadQuickAccessData = async () => {
    loading.value = true;
    try {
      // Load user's custom quick access configuration
      const response = await ApiService.get("/user/quick-access");

      const quickAccessData = response.data?.data?.quick_access;

      if (
        quickAccessData &&
        Array.isArray(quickAccessData) &&
        quickAccessData.length > 0
      ) {
        // Merge custom configuration with defaults

        quickAccessItems.value = defaultQuickAccessItems.map((defaultItem) => {
          const custom = quickAccessData.find(
            (c: any) => c.id === defaultItem.id,
          );
          if (custom) {
            // Merge custom settings with default item, prioritizing custom values
            const mergedItem = {
              ...defaultItem,
              enabled:
                typeof custom.enabled === "boolean"
                  ? custom.enabled
                  : defaultItem.enabled,
              order:
                typeof custom.order === "number"
                  ? custom.order
                  : defaultItem.order,
            };
            console.log(`Item ${defaultItem.id}:`, {
              default: defaultItem.enabled,
              custom: custom.enabled,
              final: mergedItem.enabled,
            });
            return mergedItem;
          }
          return defaultItem;
        });
      } else {
        // Use defaults
        quickAccessItems.value = [...defaultQuickAccessItems];
      }
    } catch (error) {
      // Could not load custom quick access, using defaults
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "Could not load custom quick access, using defaults:",
          error,
        );
      }
      quickAccessItems.value = [...defaultQuickAccessItems];
    } finally {
      loading.value = false;
    }
  };

  const loadStats = async () => {
    try {
      const response = await ApiService.get("/quick-access/stats");

      if (response.data?.data) {
        // Handle Laravel API response structure
        const apiStats = response.data.data;
        stats.value = {
          pendingUsers: Number(apiStats.pending_users) || 0,
          unreadNotifications: Number(unreadCount.value) || 0, // Use real notifications count
          systemAlerts: Number(apiStats.system_alerts) || 0,
          todayLogins: Number(apiStats.today_logins) || 0,
        };
      } else if (response.data) {
        // Handle direct response structure
        stats.value = {
          pendingUsers:
            Number(response.data.pending_users || response.data.pendingUsers) ||
            0,
          unreadNotifications: Number(unreadCount.value) || 0, // Use real notifications count
          systemAlerts:
            Number(response.data.system_alerts || response.data.systemAlerts) ||
            0,
          todayLogins:
            Number(response.data.today_logins || response.data.todayLogins) ||
            0,
        };
      }

      // Update items with counts
      updateItemCounts();
    } catch (error) {
      // Could not load quick access stats
      if (process.env.NODE_ENV === "development") {
        console.warn("Could not load quick access stats:", error);
      }
      // Keep default values (all 0s) when API fails
    }
  };

  const updateItemCounts = () => {
    quickAccessItems.value = quickAccessItems.value.map((item) => {
      switch (item.id) {
        case "notifications":
          return { ...item, count: stats.value.unreadNotifications };
        case "create-user":
          return { ...item, count: stats.value.pendingUsers };
        case "system-logs":
          return { ...item, count: stats.value.systemAlerts };
        default:
          return item;
      }
    });
  };

  const navigateToItem = (item: QuickAccessItem) => {
    if (item.route) {
      router.push(item.route);
    } else if (item.url) {
      window.open(item.url, "_blank");
    }
  };

  const saveQuickAccessConfiguration = async (items: QuickAccessItem[]) => {
    try {
      const configToSave = items.map((item) => ({
        id: item.id,
        enabled: item.enabled,
        order: item.order,
      }));

      console.log("Saving quick access configuration:", configToSave);

      const response = await ApiService.post("/user/quick-access", {
        quick_access: configToSave,
      });

      console.log(
        "Quick access configuration saved successfully:",
        response.data,
      );
    } catch (error) {
      console.error("Error saving quick access configuration:", error);
    }
  };

  const updateItemOrder = (draggedId: string, newOrder: number) => {
    const items = [...quickAccessItems.value];
    const draggedIndex = items.findIndex((item) => item.id === draggedId);

    if (draggedIndex === -1) return;

    const draggedItem = items[draggedIndex];
    items.splice(draggedIndex, 1);

    // Update order for all items
    const reorderedItems = items.map((item, index) => ({
      ...item,
      order: index >= newOrder ? index + 1 : index,
    }));

    draggedItem.order = newOrder;
    reorderedItems.splice(newOrder, 0, draggedItem);

    quickAccessItems.value = reorderedItems.map((item, index) => ({
      ...item,
      order: index,
    }));

    // Save configuration
    saveQuickAccessConfiguration(quickAccessItems.value);
  };

  const toggleItem = (itemId: string) => {
    console.log("toggleItem called with:", itemId);
    const item = quickAccessItems.value.find((item) => item.id === itemId);
    if (item) {
      console.log("Item found, current enabled state:", item.enabled);
      item.enabled = !item.enabled;
      console.log("Item new enabled state:", item.enabled);
      saveQuickAccessConfiguration(quickAccessItems.value);
    } else {
      console.log("Item not found");
    }
  };

  onMounted(() => {
    loadQuickAccessData();
    loadStats();

    // Refresh stats every 5 minutes
    const statsInterval = setInterval(loadStats, 5 * 60 * 1000);

    // Cleanup interval on unmount
    return () => clearInterval(statsInterval);
  });

  return {
    // State
    quickAccessItems,
    stats,
    loading,

    // Computed
    availableItems,
    frequentItems,
    systemItems,
    adminItems,
    userItems,
    popularItems,

    // Actions
    loadQuickAccessData,
    loadStats,
    navigateToItem,
    saveQuickAccessConfiguration,
    updateItemOrder,
    toggleItem,
  };
}
