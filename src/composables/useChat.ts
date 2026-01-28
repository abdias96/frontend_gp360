import { ref, onMounted } from "vue";
import ApiService from "@/core/services/ApiService";
import { webSocketService } from "@/services/WebSocketService";
import { useAuthStore } from "@/stores/auth";
import { useChatGeneralStore } from "@/stores/chatGeneral";
import Swal from "sweetalert2";

export interface ChatMessage {
  id: string;
  user_id: number;
  user_name: string;
  user_photo?: string;
  message: string;
  attachment?: any;
  timestamp: string;
  created_at: string;
}

export interface ChatUser {
  id: number;
  name: string;
  photo?: string;
}

// Shared state (singleton pattern)
const messages = ref<ChatMessage[]>([]);
const onlineUsers = ref<ChatUser[]>([]);
const isLoading = ref(false);
const isConnected = ref(false);
const chatChannel = ref<any>(null);
let isInitialized = false;

export function useChat() {
  const chatStore = useChatGeneralStore();

  /**
   * Load initial messages from API
   */
  const loadMessages = async () => {
    isLoading.value = true;
    try {
      const response = await ApiService.get("/chat/messages");
      if (response.data.success) {
        messages.value = response.data.messages || [];
      }
    } catch (error) {
      console.error("Error loading chat messages:", error);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Upload file attachment
   */
  const uploadAttachment = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'general');

    try {
      const response = await ApiService.post('/chat/upload-attachment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        return response.data.attachment;
      }
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw error;
    }
  };

  /**
   * Send a chat message with optional attachment
   */
  const sendMessage = async (message: string, attachment?: any) => {
    if (!message.trim() && !attachment) return;

    try {
      const payload: any = {};
      if (message.trim()) payload.message = message;
      if (attachment) payload.attachment = attachment;

      const response = await ApiService.post("/chat/messages", payload);
      if (response.data.success) {
        // Add the message locally (optimistic update)
        // The broadcast with toOthers() ensures we won't receive our own message via WebSocket
        messages.value.push(response.data.message);

        // Keep only last 100 messages
        if (messages.value.length > 100) {
          messages.value = messages.value.slice(-100);
        }

        return response.data.message;
      }
    } catch (error) {
      console.error("Error sending chat message:", error);
      throw error;
    }
  };

  /**
   * Connect to chat WebSocket channel
   */
  const connectToChat = () => {
    if (isConnected.value) return;

    const authStore = useAuthStore();
    if (!authStore.user) return;

    // Connect to WebSocket if not connected
    if (!webSocketService.isWebSocketConnected()) {
      webSocketService.connect();
    }

    // Join chat presence channel
    chatChannel.value = webSocketService.getEcho()?.join('chat.general');

    if (chatChannel.value) {
      chatChannel.value
        .here((users: ChatUser[]) => {
          onlineUsers.value = users;
        })
        .joining((user: ChatUser) => {
          // Add user to online list if not already there
          if (!onlineUsers.value.find(u => u.id === user.id)) {
            onlineUsers.value.push(user);
          }
        })
        .leaving((user: ChatUser) => {
          // Remove user from online list
          onlineUsers.value = onlineUsers.value.filter(u => u.id !== user.id);
        })
        .listen('.message.sent', (data: ChatMessage) => {

          const authStore = useAuthStore();

          // IMPORTANT: Only add messages from OTHER users
          // Even though backend uses toOthers(), double-check here
          if (authStore.user && data.user_id !== authStore.user.id) {
            messages.value.push(data);

            // Keep only last 100 messages
            if (messages.value.length > 100) {
              messages.value = messages.value.slice(-100);
            }

            // Increment unread counter if chat is not open
            chatStore.incrementUnread();

            // Show notification toast
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            });

            Toast.fire({
              icon: 'info',
              title: `Nuevo mensaje de ${data.user_name}`,
              text: data.message || '📎 Archivo adjunto'
            });
          }
        })
        .error((error: any) => {
          console.error('Chat channel error:', error);
          isConnected.value = false;
        });

      isConnected.value = true;
    }
  };

  /**
   * Disconnect from chat WebSocket channel
   */
  const disconnectFromChat = () => {
    if (chatChannel.value) {
      webSocketService.leaveChannel('chat.general');
      chatChannel.value = null;
      isConnected.value = false;
      onlineUsers.value = [];
    }
  };

  /**
   * Update user activity
   */
  const updateActivity = async () => {
    try {
      await ApiService.post("/chat/activity");
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  // Initialize only once
  const initialize = () => {
    if (!isInitialized) {
      isInitialized = true;
      loadMessages();
      connectToChat();

      // Update activity every 2 minutes
      const activityInterval = setInterval(updateActivity, 120000);

      // Store interval ID for cleanup
      (window as any).__chatActivityInterval = activityInterval;
    }
  };

  // Auto-initialize on first use
  onMounted(() => {
    initialize();
  });

  return {
    messages,
    onlineUsers,
    isLoading,
    isConnected,
    unreadCount: chatStore.unreadCount,
    isChatOpen: chatStore.isChatOpen,
    sendMessage,
    uploadAttachment,
    loadMessages,
    connectToChat,
    disconnectFromChat,
    updateActivity,
    markAsRead: chatStore.markAsRead,
    setChatOpen: chatStore.setChatOpen,
  };
}