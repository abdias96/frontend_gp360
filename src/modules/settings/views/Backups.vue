<template>
  <UnderConstruction
    :title="t('settings.backups.title')"
    :subtitle="t('settings.backups.subtitle')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UnderConstruction from '@/components/UnderConstruction.vue';

const { t } = useI18n();
</script>
