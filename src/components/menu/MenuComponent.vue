<template>
  <slot name="toggle"></slot>
  <slot name="content"></slot>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from "vue";
import { MenuComponent } from "@/assets/ts/components";

// Props
interface Props {
  menuSelector: string;
}

const props = defineProps<Props>();

// Lifecycle
onMounted(() => {
  nextTick(() => {
    MenuComponent.createInsance(props.menuSelector);
  });
});
</script>
