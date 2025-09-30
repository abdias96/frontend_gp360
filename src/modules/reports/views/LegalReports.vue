<template>
  <UnderConstruction
    :title="t('reports.legalReports.title')"
    :subtitle="t('reports.legalReports.subtitle')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UnderConstruction from '@/components/UnderConstruction.vue';

const { t } = useI18n();
</script>
