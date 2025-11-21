import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useChatGeneralStore = defineStore('chatGeneral', () => {
  const unreadCount = ref(0);
  const isChatOpen = ref(false);

  function incrementUnread() {
    if (!isChatOpen.value) {
      unreadCount.value++;
    }
  }

  function markAsRead() {
    unreadCount.value = 0;
  }

  function setChatOpen(isOpen: boolean) {
    isChatOpen.value = isOpen;
    if (isOpen) {
      markAsRead();
    }
  }

  return {
    unreadCount,
    isChatOpen,
    incrementUnread,
    markAsRead,
    setChatOpen,
  };
});
