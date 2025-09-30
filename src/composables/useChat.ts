import { ref, onMounted, onUnmounted } from "vue";
import ApiService from "@/core/services/ApiService";
import { webSocketService } from "@/services/WebSocketService";
import { useAuthStore } from "@/stores/auth";

export interface ChatMessage {
  id: string;
  user_id: number;
  user_name: string;
  user_photo?: string;
  message: string;
  timestamp: string;
  created_at: string;
}

export interface ChatUser {
  id: number;
  name: string;
  photo?: string;
}

export function useChat() {
  const messages = ref<ChatMessage[]>([]);
  const onlineUsers = ref<ChatUser[]>([]);
  const isLoading = ref(false);
  const isConnected = ref(false);
  const chatChannel = ref<any>(null);

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
   * Send a chat message
   */
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    try {
      const response = await ApiService.post("/chat/messages", { message });
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
          console.log('Users currently in chat:', users);
          onlineUsers.value = users;
        })
        .joining((user: ChatUser) => {
          console.log('User joined chat:', user);
          // Add user to online list if not already there
          if (!onlineUsers.value.find(u => u.id === user.id)) {
            onlineUsers.value.push(user);
          }
        })
        .leaving((user: ChatUser) => {
          console.log('User left chat:', user);
          // Remove user from online list
          onlineUsers.value = onlineUsers.value.filter(u => u.id !== user.id);
        })
        .listen('.message.sent', (data: ChatMessage) => {
          console.log('New chat message received from other user:', data);
          
          // Add message to local state
          // With toOthers() in backend, we only receive messages from other users
          messages.value.push(data);
          
          // Keep only last 100 messages
          if (messages.value.length > 100) {
            messages.value = messages.value.slice(-100);
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

  // Lifecycle hooks
  onMounted(() => {
    loadMessages();
    connectToChat();
    
    // Update activity every 2 minutes
    const activityInterval = setInterval(updateActivity, 120000);
    
    // Store interval ID for cleanup
    (window as any).__chatActivityInterval = activityInterval;
  });

  onUnmounted(() => {
    disconnectFromChat();
    
    // Clear activity interval
    if ((window as any).__chatActivityInterval) {
      clearInterval((window as any).__chatActivityInterval);
      delete (window as any).__chatActivityInterval;
    }
  });

  return {
    messages,
    onlineUsers,
    isLoading,
    isConnected,
    sendMessage,
    loadMessages,
    connectToChat,
    disconnectFromChat,
    updateActivity,
  };
}