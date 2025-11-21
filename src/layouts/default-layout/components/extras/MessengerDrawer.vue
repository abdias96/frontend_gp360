<template>
  <!--begin::Chat drawer-->
  <div
    id="kt_drawer_chat"
    class="bg-body"
    data-kt-drawer="true"
    data-kt-drawer-name="chat"
    data-kt-drawer-activate="true"
    data-kt-drawer-overlay="true"
    data-kt-drawer-width="{default:'300px', 'md': '500px'}"
    data-kt-drawer-direction="end"
    data-kt-drawer-toggle="#kt_drawer_chat_toggle"
    data-kt-drawer-close="#kt_drawer_chat_close"
  >
    <!--begin::Messenger-->
    <div class="card w-100" id="kt_drawer_chat_messenger">
      <!--begin::Card header-->
      <div class="card-header pe-5" id="kt_drawer_chat_messenger_header">
        <!--begin::Title-->
        <div class="card-title">
          <!--begin::User-->
          <div class="d-flex justify-content-center flex-column me-3">
            <a
              href="#"
              class="fs-4 fw-bold text-gray-900 text-hover-primary me-1 mb-2 lh-1"
              >Chat del Sistema</a
            >

            <!--begin::Info-->
            <div class="mb-0 lh-1">
              <span
                :class="isConnected ? 'badge-success' : 'badge-warning'"
                class="badge badge-circle w-10px h-10px me-1"
              ></span>
              <span class="fs-7 fw-semibold text-gray-500">
                {{
                  isConnected
                    ? `${onlineUsersCount} usuarios en línea`
                    : "Conectando..."
                }}
              </span>
            </div>
            <!--end::Info-->
          </div>
          <!--end::User-->
        </div>
        <!--end::Title-->

        <!--begin::Card toolbar-->
        <div class="card-toolbar">
          <!--begin::Refresh-->
          <div class="me-2">
            <button
              @click="loadMessages"
              :disabled="isLoading"
              class="btn btn-sm btn-icon btn-active-icon-primary"
              title="Actualizar mensajes"
            >
              <i
                class="bi bi-arrow-clockwise fs-3"
                :class="{ 'spinner-border spinner-border-sm': isLoading }"
              ></i>
            </button>
          </div>
          <!--end::Refresh-->

          <!--begin::Close-->
          <div
            class="btn btn-sm btn-icon btn-active-icon-primary"
            id="kt_drawer_chat_close"
          >
            <KTIcon icon-name="cross" icon-class="fs-2x" />
          </div>
          <!--end::Close-->
        </div>
        <!--end::Card toolbar-->
      </div>
      <!--end::Card header-->

      <!--begin::Card body-->
      <div class="card-body" id="kt_drawer_chat_messenger_body">
        <!--begin::Messages-->
        <div
          class="scroll-y me-n5 pe-5"
          ref="messagesRef"
          data-kt-element="messages"
          data-kt-scroll="true"
          data-kt-scroll-activate="true"
          data-kt-scroll-height="auto"
          data-kt-scroll-dependencies="#kt_drawer_chat_messenger_header, #kt_drawer_chat_messenger_footer"
          data-kt-scroll-wrappers="#kt_drawer_chat_messenger_body"
          data-kt-scroll-offset="0px"
        >
          <!-- Loading state -->
          <div v-if="isLoading && formattedMessages.length === 0" class="text-center py-8">
            <div
              class="spinner-border spinner-border-sm text-primary"
              role="status"
            >
              <span class="visually-hidden">Cargando mensajes...</span>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="!isLoading && formattedMessages.length === 0" class="text-center py-8">
            <div class="text-gray-500">No hay mensajes aún</div>
            <div class="text-gray-400 fs-7">¡Sé el primero en escribir!</div>
          </div>

          <!-- Messages list -->
          <template v-for="(message, index) in formattedMessages" :key="index">
            <MessageIn
              v-if="message.type === 'in'"
              :ref="messagesInRef"
              :name="message.name"
              :image="message.image"
              :time="message.time"
              :text="message.text"
            />

            <MessageOut
              v-else
              :ref="messagesOutRef"
              :image="message.image"
              :time="message.time"
              :text="message.text"
            />
          </template>
        </div>
        <!--end::Messages-->
      </div>
      <!--end::Card body-->

      <!--begin::Card footer-->
      <div class="card-footer pt-4" id="kt_drawer_chat_messenger_footer">
        <!--begin::Input-->
        <textarea
          class="form-control form-control-flush mb-3"
          rows="1"
          data-kt-element="input"
          placeholder="Escriba un mensaje"
          v-model="newMessageText"
          @keydown.enter.prevent="handleEnterKey"
          :disabled="!isConnected || isLoading"
        ></textarea>
        <!--end::Input-->

        <!--begin::Toolbar-->
        <div class="d-flex flex-stack">
          <!--begin::Attachments-->
          <div class="d-flex align-items-center me-2">
            <label
              for="file-upload-general"
              class="btn btn-sm btn-icon btn-active-light-primary me-1"
              title="Adjuntar archivo"
            >
              <i class="ki-duotone ki-paper-clip fs-3"></i>
            </label>
            <input
              id="file-upload-general"
              type="file"
              class="d-none"
              @change="handleFileSelect"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            />
          </div>
          <!--end::Attachments-->

          <!--begin::Actions-->
          <div class="d-flex align-items-center">
            <button
              class="btn btn-primary"
              type="button"
              data-kt-element="send"
              @click="handleSendMessage"
              :disabled="!isConnected || isLoading || (!newMessageText.trim() && !selectedFile)"
            >
              Enviar
            </button>
          </div>
          <!--end::Actions-->
        </div>
        <!--end::Toolbar-->

        <!-- File preview -->
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
      <!--end::Card footer-->
    </div>
    <!--end::Messenger-->
  </div>
  <!--end::Chat drawer-->
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, nextTick, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import FileStorageService from "@/core/services/FileStorageService";
import { getAssetPath } from "@/core/helpers/assets";
import MessageIn from "@/components/messenger-parts/MessageIn.vue";
import MessageOut from "@/components/messenger-parts/MessageOut.vue";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import { useChat } from "@/composables/useChat";
import Swal from "sweetalert2";

export default defineComponent({
  name: "messenger-drawer",
  components: {
    MessageIn,
    MessageOut,
    KTIcon,
  },
  setup() {
    const messagesRef = ref<HTMLElement | null>(null);
    const messagesInRef = ref<HTMLElement | null>(null);
    const messagesOutRef = ref<HTMLElement | null>(null);
    const authStore = useAuthStore();
    const newMessageText = ref("");
    const selectedFile = ref<File | null>(null);

    // Use the WebSocket-based chat composable
    const {
      messages,
      onlineUsers,
      isLoading,
      isConnected,
      sendMessage,
      uploadAttachment,
      loadMessages,
      connectToChat,
      setChatOpen,
    } = useChat();

    const currentUser = computed(() => authStore.user);
    const onlineUsersCount = computed(() => onlineUsers.value.length);

    // Convert chat messages to format for template
    const formattedMessages = computed(() => {
      return messages.value.map((msg) => ({
        type: msg.user_id === currentUser.value?.id ? "out" : "in",
        name: msg.user_name,
        image: msg.user_photo
          ? FileStorageService.getFileUrl(msg.user_photo)
          : getAssetPath("media/avatars/300-25.jpg"),
        time: msg.timestamp
          ? new Date(msg.timestamp).toLocaleTimeString('es-CO', {
              hour: '2-digit',
              minute: '2-digit'
            })
          : msg.created_at, // Fallback to created_at if timestamp not available
        text: msg.message,
        attachment: msg.attachment,
      }));
    });

    // Scroll to bottom when messages change
    const scrollToBottom = async () => {
      await nextTick();
      if (messagesRef.value) {
        messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
      }
    };

    // Watch messages array for changes
    watch(messages, () => {
      scrollToBottom();
    }, { deep: true });

    // Handle sending a message
    const handleSendMessage = async () => {
      const text = newMessageText.value.trim();
      if ((!text && !selectedFile.value) || !isConnected.value || isLoading.value) return;

      try {
        let attachment = null;

        // Upload file if selected
        if (selectedFile.value) {
          console.log('Uploading file:', selectedFile.value.name);
          try {
            const uploadResult = await uploadAttachment(selectedFile.value);
            console.log('File uploaded successfully:', uploadResult);
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

        console.log('Sending message with attachment:', attachment);
        await sendMessage(text, attachment);
        newMessageText.value = "";
        selectedFile.value = null;
        scrollToBottom();
      } catch (error) {
        console.error("Error sending message:", error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo enviar el mensaje',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    };

    // Handle enter key press
    const handleEnterKey = (event: KeyboardEvent) => {
      if (!event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    };

    // Handle file selection
    const handleFileSelect = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        selectedFile.value = target.files[0];
      }
    };

    // Clear selected file
    const clearFile = () => {
      selectedFile.value = null;
      const fileInput = document.getElementById('file-upload-general') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    };

    // Format file size
    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    // Initialize connection when drawer opens
    const initializeChat = () => {
      if (!isConnected.value) {
        connectToChat();
      }
      setChatOpen(true); // Mark chat as open and clear unread count
      scrollToBottom();
    };

    // Handle drawer closing
    const handleDrawerClose = () => {
      setChatOpen(false);
    };

    // Watch for drawer visibility using KTDrawer events
    onMounted(() => {
      if (typeof window !== 'undefined') {
        const toggleButton = document.getElementById('kt_drawer_chat_toggle');
        const closeButton = document.getElementById('kt_drawer_chat_close');

        if (toggleButton) {
          toggleButton.addEventListener('click', () => {
            setTimeout(() => {
              initializeChat();
            }, 100);
          });
        }

        if (closeButton) {
          closeButton.addEventListener('click', () => {
            handleDrawerClose();
          });
        }
      }
    });

    return {
      messagesRef,
      messagesInRef,
      messagesOutRef,
      newMessageText,
      selectedFile,
      formattedMessages,
      onlineUsersCount,
      isLoading,
      isConnected,
      loadMessages,
      handleSendMessage,
      handleEnterKey,
      handleFileSelect,
      clearFile,
      formatFileSize,
      getAssetPath,
    };
  },
});
</script>