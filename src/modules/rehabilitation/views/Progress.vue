<template>
  <UnderConstruction
    :title="t('rehabilitation.progress.title')"
    :subtitle="t('rehabilitation.progress.subtitle')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UnderConstruction from '@/components/UnderConstruction.vue';

const { t } = useI18n();
</script>
