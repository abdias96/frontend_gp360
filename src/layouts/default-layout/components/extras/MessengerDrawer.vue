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
          <!--begin::Info-->
          <div class="d-flex align-items-center me-2">
            <span class="text-muted fs-7">
              {{ isConnected ? "Conectado" : "Desconectado" }}
            </span>
          </div>
          <!--end::Info-->

          <!--begin::Actions-->
          <div class="d-flex align-items-center">
            <button
              class="btn btn-primary"
              type="button"
              data-kt-element="send"
              @click="handleSendMessage"
              :disabled="!isConnected || isLoading || !newMessageText.trim()"
            >
              Enviar
            </button>
          </div>
          <!--end::Actions-->
        </div>
        <!--end::Toolbar-->
      </div>
      <!--end::Card footer-->
    </div>
    <!--end::Messenger-->
  </div>
  <!--end::Chat drawer-->
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, nextTick } from "vue";
import { useAuthStore } from "@/stores/auth";
import FileStorageService from "@/core/services/FileStorageService";
import { getAssetPath } from "@/core/helpers/assets";
import MessageIn from "@/components/messenger-parts/MessageIn.vue";
import MessageOut from "@/components/messenger-parts/MessageOut.vue";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import { useChat } from "@/composables/useChat";

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

    // Use the WebSocket-based chat composable
    const {
      messages,
      onlineUsers,
      isLoading,
      isConnected,
      sendMessage,
      loadMessages,
      connectToChat,
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
        time: new Date(msg.created_at).toLocaleTimeString('es-CO', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        text: msg.message,
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
      if (!text || !isConnected.value || isLoading.value) return;

      try {
        await sendMessage(text);
        newMessageText.value = "";
        scrollToBottom();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    };

    // Handle enter key press
    const handleEnterKey = (event: KeyboardEvent) => {
      if (!event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    };

    // Initialize connection when drawer opens
    const initializeChat = () => {
      if (!isConnected.value) {
        connectToChat();
      }
      scrollToBottom();
    };

    // Watch for drawer visibility
    if (typeof window !== 'undefined') {
      const drawerElement = document.getElementById('kt_drawer_chat');
      if (drawerElement) {
        // Listen for drawer shown event
        drawerElement.addEventListener('shown.bs.offcanvas', initializeChat);
      }
    }

    return {
      messagesRef,
      messagesInRef,
      messagesOutRef,
      newMessageText,
      formattedMessages,
      onlineUsersCount,
      isLoading,
      isConnected,
      loadMessages,
      handleSendMessage,
      handleEnterKey,
      getAssetPath,
    };
  },
});
</script>