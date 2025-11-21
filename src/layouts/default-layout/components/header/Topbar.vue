<template>
  <!--begin::Toolbar wrapper-->
  <div class="d-flex flex-shrink-0">
    <!--begin::Theme mode-->
    <div class="d-flex ms-3">
      <!--begin::Menu toggle-->
      <a
        href="#"
        class="btn btn-icon flex-center bg-body btn-color-gray-600 btn-active-color-primary h-40px"
        data-kt-menu-trigger="{default:'click', lg: 'hover'}"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
      >
        <KTIcon icon-name="night-day" icon-class="theme-light-show fs-2" />
        <KTIcon icon-name="moon" icon-class="theme-dark-show fs-2" />
      </a>
      <!--begin::Menu toggle-->
      <KTThemeModeSwitcher></KTThemeModeSwitcher>
    </div>
    <!--end::Theme mode-->

    <!--begin::Chat General-->
    <div class="d-flex align-items-center ms-3 position-relative">
      <div
        class="btn btn-icon btn-primary w-40px h-40px"
        :class="{ 'pulse pulse-white': generalChatUnread === 0 }"
        id="kt_drawer_chat_toggle"
        title="Chat General"
      >
        <KTIcon icon-name="message-text-2" icon-class="fs-2" />
        <span v-if="generalChatUnread === 0" class="pulse-ring"></span>

        <!-- Badge de mensajes no leídos -->
        <span
          v-if="generalChatUnread > 0"
          class="position-absolute top-0 start-100 translate-middle badge badge-circle badge-danger"
          style="font-size: 10px; min-width: 18px; height: 18px; padding: 3px;"
        >
          {{ generalChatUnread > 99 ? '99+' : generalChatUnread }}
        </span>

        <!-- Indicador de conexión -->
        <span
          :class="[
            'position-absolute bottom-0 start-100 translate-middle badge badge-circle',
            isGeneralChatConnected ? 'badge-success' : 'badge-secondary'
          ]"
          style="width: 12px; height: 12px; border: 2px solid white;"
          :title="isGeneralChatConnected ? 'Conectado' : 'Desconectado'"
        ></span>
      </div>
    </div>
    <!--end::Chat General-->

    <!--begin::Chat Privado-->
    <div class="d-flex align-items-center ms-3 position-relative">
      <div
        class="btn btn-icon btn-light-primary w-40px h-40px"
        id="kt_private_chat_toggle"
        title="Mensajes Privados"
      >
        <KTIcon icon-name="messages" icon-class="fs-2" />

        <!-- Badge de mensajes no leídos -->
        <span
          v-if="privateChatUnread > 0"
          class="position-absolute top-0 start-100 translate-middle badge badge-circle badge-danger"
          style="font-size: 10px; min-width: 18px; height: 18px; padding: 3px;"
        >
          {{ privateChatUnread > 99 ? '99+' : privateChatUnread }}
        </span>

        <!-- Indicador de conexión -->
        <span
          :class="[
            'position-absolute bottom-0 start-100 translate-middle badge badge-circle',
            isPrivateChatConnected ? 'badge-success' : 'badge-secondary'
          ]"
          style="width: 12px; height: 12px; border: 2px solid white;"
          :title="isPrivateChatConnected ? 'Conectado' : 'Desconectado'"
        ></span>
      </div>
    </div>
    <!--end::Chat Privado-->
  </div>
  <!--end::Toolbar wrapper-->
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getAssetPath } from "@/core/helpers/assets";
import KTThemeModeSwitcher from "@/layouts/default-layout/components/theme-mode/ThemeModeSwitcher.vue";
import { useChatGeneralStore } from "@/stores/chatGeneral";
import { useChatPrivateStore } from "@/stores/chatPrivate";
import { useChat } from "@/composables/useChat";
import { usePrivateChat } from "@/composables/usePrivateChat";

// Stores for reactive badge counts
const generalChatStore = useChatGeneralStore();
const privateChatStore = useChatPrivateStore();

// Composables for connection state
const generalChat = useChat();
const privateChat = usePrivateChat();

// Computed properties for badges
const generalChatUnread = computed(() => generalChatStore.unreadCount);
const privateChatUnread = computed(() => privateChatStore.unreadCount);
const isGeneralChatConnected = computed(() => generalChat.isConnected.value);
const isPrivateChatConnected = computed(() => privateChat.isConnected.value);
</script>

<style scoped>
.pulse-ring {
  animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.33);
  }
  80%, 100% {
    opacity: 0;
  }
}
</style>
