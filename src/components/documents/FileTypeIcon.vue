<template>
  <div class="file-type-icon" :class="[sizeClass, colorClass]">
    <i :class="iconClass">
      <span class="path1"></span>
      <span class="path2"></span>
      <span class="path3"></span>
      <span class="path4"></span>
    </i>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FileType } from '@/types/documents';

const props = withDefaults(defineProps<{
  fileType?: FileType;
  mimeType?: string;
  size?: 'sm' | 'md' | 'lg';
}>(), {
  size: 'md'
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'fs-6';
    case 'lg': return 'fs-2';
    default: return 'fs-4';
  }
});

const iconClass = computed(() => {
  // First check by MIME type for more accurate icon
  if (props.mimeType) {
    if (props.mimeType === 'application/pdf') {
      return 'ki-duotone ki-file-pdf';
    }
    if (props.mimeType.includes('word') || props.mimeType.includes('msword')) {
      return 'ki-duotone ki-file-doc';
    }
    if (props.mimeType.startsWith('image/')) {
      return 'ki-duotone ki-picture';
    }
  }

  // Fall back to file type category
  switch (props.fileType) {
    case 'legal':
    case 'judicial':
      return 'ki-duotone ki-file-sheet';
    case 'medical':
      return 'ki-duotone ki-pulse';
    case 'identification':
      return 'ki-duotone ki-profile-user';
    case 'administrative':
      return 'ki-duotone ki-folder';
    default:
      return 'ki-duotone ki-file';
  }
});

const colorClass = computed(() => {
  switch (props.fileType) {
    case 'legal':
      return 'text-primary';
    case 'judicial':
      return 'text-info';
    case 'medical':
      return 'text-success';
    case 'identification':
      return 'text-warning';
    case 'administrative':
      return 'text-secondary';
    default:
      return 'text-gray-600';
  }
});
</script>

<style scoped>
.file-type-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
