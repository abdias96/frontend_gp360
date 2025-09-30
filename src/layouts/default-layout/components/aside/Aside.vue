<template>
  <div
    id="kt_aside"
    class="aside aside-extended"
    data-kt-drawer="true"
    data-kt-drawer-name="aside"
    data-kt-drawer-activate="{default: true, lg: false}"
    data-kt-drawer-overlay="true"
    data-kt-drawer-width="auto"
    data-kt-drawer-direction="start"
    data-kt-drawer-toggle="#kt_aside_toggle"
  >
    <KTAsidePrimary></KTAsidePrimary>
    <KTAsideSecondary></KTAsideSecondary>
  </div>
</template>

<script setup lang="ts">
import KTAsidePrimary from "@/layouts/default-layout/components/aside/AsidePrimary.vue";
import KTAsideSecondary from "@/layouts/default-layout/components/aside/AsideSecondary.vue";

// Props
interface Props {
  lightLogo?: string;
  darkLogo?: string;
}

defineProps<Props>();
</script>
