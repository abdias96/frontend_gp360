<template>
  <div v-if="showBanner" class="environment-banner" :style="bannerStyle">
    <div class="banner-content">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <span class="banner-text">{{ bannerText }}</span>
      <i class="bi bi-exclamation-triangle-fill ms-2"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const showBanner = computed(() => {
  return import.meta.env.VITE_APP_SHOW_ENV_BANNER === 'true';
});

const bannerText = computed(() => {
  return import.meta.env.VITE_APP_ENV_BANNER_TEXT || 'AMBIENTE DE PRUEBAS';
});

const bannerColor = computed(() => {
  return import.meta.env.VITE_APP_ENV_BANNER_COLOR || '#dc3545';
});

const bannerStyle = computed(() => ({
  backgroundColor: bannerColor.value,
}));
</script>

<style scoped>
.environment-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  padding: 8px 0;
  text-align: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: pulse-banner 2s infinite;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-text {
  letter-spacing: 2px;
  text-transform: uppercase;
}

@keyframes pulse-banner {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}

/* Ajustar el body para que el contenido no quede debajo del banner */
:global(body.has-env-banner) {
  padding-top: 40px;
}
</style>
