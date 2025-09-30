<template>
  <button
    v-permission="permissions"
    :class="buttonClass"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <div
      v-if="loading"
      class="spinner-border spinner-border-sm me-2"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
    <i v-if="icon && !loading" :class="icon" class="me-1"></i>
    <slot>{{ text }}</slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  permissions?: string | string[];
  requireAllPermissions?: boolean;
  text?: string;
  icon?: string;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  size?: "sm" | "lg";
  disabled?: boolean;
  loading?: boolean;
  outline?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  disabled: false,
  loading: false,
  outline: false,
  requireAllPermissions: false,
});

defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonClass = computed(() => {
  let classes = ["btn"];

  if (props.outline) {
    classes.push(`btn-outline-${props.variant}`);
  } else {
    classes.push(`btn-${props.variant}`);
  }

  if (props.size) {
    classes.push(`btn-${props.size}`);
  }

  return classes.join(" ");
});
</script>
