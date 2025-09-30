<template>
  <UnderConstruction
    :title="t('medical.treatments.title')"
    :subtitle="t('medical.treatments.subtitle')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UnderConstruction from '@/components/UnderConstruction.vue';

const { t } = useI18n();
</script>
