import { ref, onMounted, onUnmounted } from "vue";
import ApiService from "@/core/services/ApiService";
import { webSocketService } from "@/services/WebSocketService";
import { useAuthStore } from "@/stores/auth";

// Estado global compartido
const unreadCount = ref(0);
const isLoading = ref(false);
const lastRefresh = ref<Date | null>(null);

// Lista de suscriptores para notificar cambios
const subscribers = new Set<() => void>();

// Función para notificar a todos los suscriptores
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

export function useNotifications() {
  const loadUnreadCount = async () => {
    if (isLoading.value) return;

    isLoading.value = true;
    try {
      const response = await ApiService.get("/notifications/unread-count");
      const newCount = response.data.count;

      if (unreadCount.value !== newCount) {
        unreadCount.value = newCount;
        lastRefresh.value = new Date();
        notifySubscribers();
      }
    } catch (error) {
      console.error("Error loading unread notifications count:", error);
      unreadCount.value = 0;
    } finally {
      isLoading.value = false;
    }
  };

  const refreshUnreadCount = () => {
    loadUnreadCount();
  };

  const decrementUnreadCount = () => {
    const newCount = Math.max(0, unreadCount.value - 1);
    if (unreadCount.value !== newCount) {
      unreadCount.value = newCount;
      notifySubscribers();
    }
  };

  const resetUnreadCount = () => {
    if (unreadCount.value !== 0) {
      unreadCount.value = 0;
      notifySubscribers();
    }
  };

  const incrementUnreadCount = () => {
    unreadCount.value += 1;
    notifySubscribers();
  };

  // WebSocket subscription for real-time notifications
  let isSubscribed = false;

  const subscribeToWebSocket = () => {
    if (isSubscribed) return;

    const authStore = useAuthStore();
    const userId = authStore.user?.id;

    if (!userId) return;

    // Connect to WebSocket if not connected
    if (!webSocketService.isWebSocketConnected()) {
      webSocketService.connect();
    }

    // Subscribe to user's private notification channel
    webSocketService.subscribeToUserNotifications(userId, (notification) => {
      console.log('New notification received:', notification);
      
      // Increment unread count
      incrementUnreadCount();
      
      // Notify subscribers
      notifySubscribers();
    });

    isSubscribed = true;
  };

  const unsubscribeFromWebSocket = () => {
    if (!isSubscribed) return;

    const authStore = useAuthStore();
    const userId = authStore.user?.id;

    if (userId) {
      webSocketService.leaveChannel(`user.${userId}`);
    }

    isSubscribed = false;
  };

  // Suscribirse a cambios
  const subscribe = (callback: () => void) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  };

  onMounted(() => {
    loadUnreadCount();
    // Subscribe to WebSocket for real-time updates
    subscribeToWebSocket();
  });

  onUnmounted(() => {
    // Unsubscribe from WebSocket
    unsubscribeFromWebSocket();
  });

  return {
    unreadCount: unreadCount,
    isLoading,
    lastRefresh,
    refreshUnreadCount,
    decrementUnreadCount,
    resetUnreadCount,
    incrementUnreadCount,
    loadUnreadCount,
    subscribe,
  };
}

// Función global para refrescar notificaciones desde cualquier parte
export const refreshNotifications = () => {
  if (isLoading.value) return;

  // Refresh unread count
  loadUnreadCountGlobal();

  // Notify all subscribers about the refresh
  notifySubscribers();
};

// Función global para cargar count sin crear nueva instancia
const loadUnreadCountGlobal = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  try {
    const { default: ApiService } = await import("@/core/services/ApiService");
    const response = await ApiService.get("/notifications/unread-count");
    const newCount = response.data.count;

    if (unreadCount.value !== newCount) {
      unreadCount.value = newCount;
      lastRefresh.value = new Date();
      notifySubscribers();
    }
  } catch (error) {
    console.error("Error loading unread notifications count (global):", error);
    unreadCount.value = 0;
  } finally {
    isLoading.value = false;
  }
};
