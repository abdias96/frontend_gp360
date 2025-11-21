import { ref } from "vue";
import ApiService from "@/core/services/ApiService";
import { webSocketService } from "@/services/WebSocketService";
import { useAuthStore } from "@/stores/auth";
import { useChatPrivateStore } from "@/stores/chatPrivate";
import Swal from "sweetalert2";

export interface PrivateMessage {
  id: string;
  sender_id: number;
  sender_name: string;
  sender_photo?: string;
  receiver_id: number;
  receiver_name: string;
  receiver_photo?: string;
  message: string;
  attachment?: any;
  timestamp: string;
  created_at: string;
}

export interface ChatUser {
  id: number;
  name: string;
  email: string;
  photo?: string;
  has_messages: boolean;
  last_message?: PrivateMessage | null;
}

// Shared state (singleton pattern)
const messages = ref<PrivateMessage[]>([]);
const availableUsers = ref<ChatUser[]>([]);
const selectedUser = ref<ChatUser | null>(null);
const isLoading = ref(false);
const isConnected = ref(false);
const privateChannel = ref<any>(null);

export function usePrivateChat() {
  const chatStore = useChatPrivateStore();

  /**
   * Load list of available users for private chat
   */
  const loadAvailableUsers = async () => {
    isLoading.value = true;
    try {
      console.log('Loading available users...');
      const response = await ApiService.get("/chat/users");
      console.log('Users response:', response.data);
      if (response.data.success) {
        availableUsers.value = response.data.users || [];
        console.log('Available users loaded:', availableUsers.value.length);
      }
    } catch (error) {
      console.error("Error loading available users:", error);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Load private messages with a specific user
   */
  const loadPrivateMessages = async (userId: number) => {
    isLoading.value = true;
    try {
      const response = await ApiService.get(`/chat/private/${userId}`);
      if (response.data.success) {
        messages.value = response.data.messages || [];

        // Set selected user info
        if (response.data.other_user) {
          selectedUser.value = {
            id: response.data.other_user.id,
            name: response.data.other_user.name,
            email: response.data.other_user.email || '',
            photo: response.data.other_user.photo,
            has_messages: true,
            last_message: null
          };
        }
      }
    } catch (error) {
      console.error("Error loading private messages:", error);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Upload file attachment for private chat
   */
  const uploadAttachment = async (file: File, receiverId: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'private');
    formData.append('receiver_id', receiverId.toString());

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
   * Send a private message to a specific user with optional attachment
   */
  const sendPrivateMessage = async (receiverId: number, message: string, attachment?: any) => {
    if (!message.trim() && !attachment) return;

    try {
      const payload: any = {
        receiver_id: receiverId,
      };
      if (message.trim()) payload.message = message;
      if (attachment) payload.attachment = attachment;

      const response = await ApiService.post("/chat/private", payload);

      if (response.data.success) {
        // Add the message locally (optimistic update)
        messages.value.push(response.data.message);

        // Keep only last 100 messages
        if (messages.value.length > 100) {
          messages.value = messages.value.slice(-100);
        }

        return response.data.message;
      }
    } catch (error) {
      console.error("Error sending private message:", error);
      throw error;
    }
  };

  /**
   * Connect to private chat channel with a specific user
   */
  const connectToPrivateChat = (otherUserId: number) => {
    const authStore = useAuthStore();
    if (!authStore.user) return;

    // Disconnect from previous channel if exists
    disconnectFromPrivateChat();

    // Connect to WebSocket if not connected
    if (!webSocketService.isWebSocketConnected()) {
      webSocketService.connect();
    }

    const currentUserId = authStore.user.id;

    // Subscribe to private channel
    privateChannel.value = webSocketService.subscribeToPrivateChat(
      currentUserId,
      otherUserId
    );

    if (privateChannel.value) {
      privateChannel.value
        .listen('.private.message.sent', (data: PrivateMessage) => {
          console.log('New private message received:', data);

          // Only add if it's not our own message
          // (our messages are added via optimistic update)
          if (data.sender_id !== currentUserId) {
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
              title: `Mensaje privado de ${data.sender_name}`,
              text: data.message || '📎 Archivo adjunto'
            });
          }
        })
        .error((error: any) => {
          console.error('Private chat channel error:', error);
          isConnected.value = false;
        });

      isConnected.value = true;
    }
  };

  /**
   * Disconnect from private chat channel
   */
  const disconnectFromPrivateChat = () => {
    if (privateChannel.value && selectedUser.value) {
      const authStore = useAuthStore();
      if (authStore.user) {
        webSocketService.leavePrivateChat(
          authStore.user.id,
          selectedUser.value.id
        );
      }
      privateChannel.value = null;
      isConnected.value = false;
    }
  };

  /**
   * Select a user to chat with
   */
  const selectUser = async (user: ChatUser) => {
    selectedUser.value = user;
    await loadPrivateMessages(user.id);
    connectToPrivateChat(user.id);
  };

  /**
   * Clear selected user and disconnect
   */
  const clearSelectedUser = () => {
    disconnectFromPrivateChat();
    selectedUser.value = null;
    messages.value = [];
  };

  return {
    messages,
    availableUsers,
    selectedUser,
    isLoading,
    isConnected,
    unreadCount: chatStore.unreadCount,
    isChatOpen: chatStore.isChatOpen,
    loadAvailableUsers,
    loadPrivateMessages,
    sendPrivateMessage,
    uploadAttachment,
    connectToPrivateChat,
    disconnectFromPrivateChat,
    selectUser,
    clearSelectedUser,
    markAsRead: chatStore.markAsRead,
    setChatOpen: chatStore.setChatOpen,
  };
}
