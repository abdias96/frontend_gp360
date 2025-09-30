<template>
  <UnderConstruction
    :title="t('medical.prescriptions.title')"
    :subtitle="t('medical.prescriptions.subtitle')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UnderConstruction from '@/components/UnderConstruction.vue';

const { t } = useI18n();
</script>
