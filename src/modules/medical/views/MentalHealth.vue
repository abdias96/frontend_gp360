<template>
  <UnderConstruction
    :title="t('medical.mentalHealth.title')"
    :subtitle="t('medical.mentalHealth.subtitle')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UnderConstruction from '@/components/UnderConstruction.vue';

const { t } = useI18n();
</script>
