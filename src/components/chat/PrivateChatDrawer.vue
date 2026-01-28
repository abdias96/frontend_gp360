<template>
  <div
    class="bg-body"
    data-kt-drawer="true"
    data-kt-drawer-name="private-chat"
    data-kt-drawer-activate="true"
    data-kt-drawer-overlay="true"
    data-kt-drawer-width="{default:'300px', 'md': '500px'}"
    data-kt-drawer-direction="end"
    data-kt-drawer-toggle="#kt_private_chat_toggle"
    data-kt-drawer-close="#kt_private_chat_close"
    id="kt_private_chat"
  >
    <div class="card w-100 border-0 rounded-0" id="kt_private_chat_messenger">
      <!-- Header -->
      <div class="card-header pe-5" id="kt_private_chat_messenger_header">
        <div class="card-title">
          <div class="d-flex justify-content-center flex-column me-3">
            <a
              href="#"
              class="fs-4 fw-bold text-gray-900 text-hover-primary me-1 mb-2 lh-1"
            >
              {{ selectedUser ? selectedUser.name : 'Mensajes Privados' }}
            </a>
            <div class="mb-0 lh-1" v-if="!selectedUser">
              <span class="badge badge-success badge-circle w-10px h-10px me-1"></span>
              <span class="fs-7 fw-semibold text-muted">
                Selecciona un usuario
              </span>
            </div>
            <div class="mb-0 lh-1" v-else>
              <span
                :class="[
                  'badge badge-circle w-10px h-10px me-1',
                  isConnected ? 'badge-success' : 'badge-warning',
                ]"
              ></span>
              <span class="fs-7 fw-semibold text-muted">
                {{ isConnected ? 'Conectado' : 'Conectando...' }}
              </span>
            </div>
          </div>
        </div>

        <div class="card-toolbar">
          <div
            class="btn btn-sm btn-icon btn-active-color-primary"
            id="kt_private_chat_close"
          >
            <i class="ki-duotone ki-cross-square fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="card-body" id="kt_private_chat_messenger_body">
        <!-- Users List (when no user selected) -->
        <div v-if="!selectedUser" class="scroll-y me-n5 pe-5 h-300px h-lg-auto">
          <div class="d-flex flex-column gap-3">
            <div class="mb-3">
              <input
                type="text"
                class="form-control form-control-solid"
                placeholder="Buscar usuario..."
                v-model="searchQuery"
              />
            </div>

            <div
              v-for="user in filteredUsers"
              :key="user.id"
              @click="selectUser(user)"
              class="d-flex align-items-center p-3 rounded bg-hover-light-primary cursor-pointer"
            >
              <div class="symbol symbol-45px me-3">
                <img
                  v-if="getUserPhotoUrl(user.photo)"
                  :src="getUserPhotoUrl(user.photo)!"
                  :alt="user.name"
                />
                <div v-else class="symbol-label bg-light-primary text-primary fs-6 fw-bolder">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
              </div>

              <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="fs-6 fw-bold text-gray-900">{{ user.name }}</span>
                  <span
                    v-if="user.has_messages"
                    class="badge badge-sm badge-circle badge-primary"
                  ></span>
                </div>
                <span class="fs-7 text-muted">{{ user.email }}</span>
                <div v-if="user.last_message" class="fs-8 text-muted mt-1">
                  {{ truncate(user.last_message.message, 30) }}
                </div>
              </div>
            </div>

            <div v-if="isLoading" class="text-center py-10">
              <span class="spinner-border spinner-border-sm me-2"></span>
              <span class="text-muted">Cargando usuarios...</span>
            </div>

            <div
              v-else-if="filteredUsers.length === 0 && !isLoading"
              class="text-center py-10 text-muted"
            >
              <div v-if="availableUsers.length === 0">
                <i class="ki-duotone ki-user fs-3x text-muted mb-3">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                <div>No hay otros usuarios disponibles</div>
                <div class="fs-7 mt-2">Crea más usuarios para chatear</div>
              </div>
              <div v-else>
                No se encontraron usuarios con "{{ searchQuery }}"
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Messages (when user selected) -->
        <template v-else>
          <!-- Back to list button - Fixed at top -->
          <div class="mb-3 sticky-top bg-body pt-2 pb-3 border-bottom border-gray-200" style="z-index: 10; top: -8px; margin-left: -20px; margin-right: -20px; padding-left: 20px; padding-right: 20px;">
            <button
              @click="clearSelectedUser"
              class="btn btn-sm btn-light-primary"
            >
              <i class="ki-duotone ki-arrow-left fs-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Volver a lista
            </button>
          </div>

          <!-- Messages area -->
          <div
            class="scroll-y me-n5 pe-5 h-300px h-lg-auto"
            ref="messagesContainer"
            data-kt-element="messages"
            data-kt-scroll="true"
            data-kt-scroll-activate="{default: false, lg: true}"
            data-kt-scroll-max-height="auto"
            data-kt-scroll-dependencies="#kt_private_chat_messenger_header, #kt_private_chat_messenger_footer"
            data-kt-scroll-wrappers="#kt_private_chat_messenger_body"
            data-kt-scroll-offset="0px"
          >
            <div v-if="messages.length === 0" class="text-center py-10 text-muted">
              No hay mensajes. Inicia la conversación!
            </div>

            <div v-for="msg in messages" :key="msg.id">
              <MessageIn
                v-if="msg.sender_id !== currentUserId"
                :name="msg.sender_name"
                :text="msg.message"
                :time="formatMessageTime(msg.created_at)"
                :image="getUserPhotoUrl(msg.sender_photo)"
                :attachment="msg.attachment"
              />
              <MessageOut
                v-else
                :text="msg.message"
                :time="formatMessageTime(msg.created_at)"
                :image="getUserPhotoUrl(msg.sender_photo)"
                :attachment="msg.attachment"
              />
            </div>
          </div>
        </template>
      </div>

      <!-- Footer -->
      <div
        v-if="selectedUser"
        class="card-footer pt-4"
        id="kt_private_chat_messenger_footer"
      >
        <textarea
          class="form-control form-control-flush mb-3"
          rows="1"
          placeholder="Escribe tu mensaje..."
          v-model="messageText"
          @keydown.enter.exact="handleEnterKey"
          @keydown.shift.enter.exact="handleShiftEnter"
        ></textarea>

        <div class="d-flex flex-stack">
          <div class="d-flex align-items-center me-2">
            <label
              for="file-upload-private"
              class="btn btn-sm btn-icon btn-active-light-primary me-1"
              title="Adjuntar archivo"
            >
              <i class="ki-duotone ki-paper-clip fs-3"></i>
            </label>
            <input
              id="file-upload-private"
              type="file"
              class="d-none"
              @change="handleFileSelect"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            />
          </div>

          <button
            class="btn btn-primary"
            type="button"
            @click="handleSendMessage"
            :disabled="!messageText.trim() && !selectedFile"
          >
            Enviar
          </button>
        </div>

        <div v-if="selectedFile" class="mt-2">
          <div class="alert alert-dismissible bg-light-primary d-flex align-items-center p-3">
            <i class="ki-duotone ki-file fs-2x text-primary me-3">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            <div class="d-flex flex-column">
              <span class="fs-7 fw-bold">{{ selectedFile.name }}</span>
              <span class="fs-8 text-muted">{{ formatFileSize(selectedFile.size) }}</span>
            </div>
            <button
              type="button"
              class="btn-close ms-auto"
              @click="clearFile"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { usePrivateChat } from '@/composables/usePrivateChat';
import { useAuthStore } from '@/stores/auth';
import MessageIn from '@/components/messenger-parts/MessageIn.vue';
import MessageOut from '@/components/messenger-parts/MessageOut.vue';
import FileStorageService from '@/core/services/FileStorageService';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const currentUserId = computed(() => authStore.user?.id || 0);

const {
  messages,
  availableUsers,
  selectedUser,
  isConnected,
  isLoading,
  loadAvailableUsers,
  sendPrivateMessage,
  uploadAttachment,
  selectUser: selectUserAction,
  clearSelectedUser: clearSelectedUserAction,
  setChatOpen,
} = usePrivateChat();

const messageText = ref('');
const searchQuery = ref('');
const messagesContainer = ref<HTMLElement | null>(null);
const selectedFile = ref<File | null>(null);

// Filtered users based on search
const filteredUsers = computed(() => {
  if (!searchQuery.value) return availableUsers.value;

  const query = searchQuery.value.toLowerCase();
  return availableUsers.value.filter(
    (user) =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
  );
});

// Load users on mount
onMounted(async () => {
  await loadAvailableUsers();

  // Watch for drawer visibility using KTDrawer events
  if (typeof window !== 'undefined') {
    const toggleButton = document.getElementById('kt_private_chat_toggle');
    const closeButton = document.getElementById('kt_private_chat_close');

    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        setTimeout(() => {
          setChatOpen(true); // Mark chat as open and clear unread count
          // Scroll to bottom if a user is selected
          if (selectedUser.value && messages.value.length > 0) {
            setTimeout(() => {
              scrollToBottom();
            }, 200);
          }
        }, 100);
      });
    }

    if (closeButton) {
      closeButton.addEventListener('click', () => {
        setChatOpen(false);
      });
    }
  }
});

// Auto-scroll to bottom when new messages arrive
watch(
  () => messages.value.length,
  async () => {
    await nextTick();
    scrollToBottom();
  }
);

const scrollToBottom = () => {
  if (messagesContainer.value) {
    // Use setTimeout to ensure DOM is fully rendered
    setTimeout(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    }, 100);
  }
};

const selectUser = async (user: any) => {
  await selectUserAction(user);
  await nextTick();
  // Scroll to bottom after messages are loaded
  setTimeout(() => {
    scrollToBottom();
  }, 150);
};

const clearSelectedUser = () => {
  clearSelectedUserAction();
  messageText.value = '';
  selectedFile.value = null;
};

const handleSendMessage = async () => {
  if (!selectedUser.value) return;

  if (!messageText.value.trim() && !selectedFile.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Mensaje vacío',
      text: 'Escribe un mensaje o adjunta un archivo',
      timer: 2000,
      showConfirmButton: false,
    });
    return;
  }

  try {
    let attachment = null;

    // Upload file if selected
    if (selectedFile.value) {
      try {
        const uploadResult = await uploadAttachment(selectedFile.value, selectedUser.value.id);
        attachment = uploadResult;
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError);
        await Swal.fire({
          icon: 'error',
          title: 'Error al subir archivo',
          text: 'No se pudo subir el archivo. Intenta de nuevo.',
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
    }

    await sendPrivateMessage(selectedUser.value.id, messageText.value, attachment);
    messageText.value = '';
    selectedFile.value = null;
  } catch (error) {
    console.error('Error sending private message:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo enviar el mensaje',
      timer: 2000,
      showConfirmButton: false,
    });
  }
};

const handleEnterKey = (event: KeyboardEvent) => {
  if (!event.shiftKey) {
    event.preventDefault();
    handleSendMessage();
  }
};

const handleShiftEnter = () => {
  // Allow default behavior (new line)
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
  }
};

const clearFile = () => {
  selectedFile.value = null;
};

const truncate = (text: string, length: number) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Get user photo URL or null
const getUserPhotoUrl = (photoPath: string | null | undefined): string | null => {
  if (!photoPath) return null;
  return FileStorageService.getFileUrl(photoPath);
};

// Format message timestamp to show only time
const formatMessageTime = (createdAt: string | null | undefined): string => {
  if (!createdAt) return '';

  // If it's already in HH:MM format (from backend), use it directly
  if (/^\d{2}:\d{2}$/.test(createdAt)) {
    return createdAt;
  }

  // Otherwise, try to parse and format
  try {
    return new Date(createdAt).toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return createdAt || '';
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
