<template>
  <UnderConstruction
    :title="t('reports.statisticalReports.title')"
    :subtitle="t('reports.statisticalReports.subtitle')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UnderConstruction from '@/components/UnderConstruction.vue';

const { t } = useI18n();
</script>
