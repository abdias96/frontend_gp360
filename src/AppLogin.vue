<template>
  <RouterView />
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { RouterView } from "vue-router";
import { useBodyStore } from "@/stores/body";

export default defineComponent({
  name: "app-login",
  components: {
    RouterView,
  },
  setup() {
    const bodyStore = useBodyStore();

    onMounted(() => {
      // Remove loading class immediately for faster perceived load
      bodyStore.removeBodyClassName("page-loading");
    });
  },
});
</script>

<style lang="scss">
// Only import essentials for login page
@import "assets/sass/_login-optimized.scss";
</style>
