<template>
  <UnderConstruction
    :title="t('medical.vaccinations.title')"
    :subtitle="t('medical.vaccinations.subtitle')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UnderConstruction from '@/components/UnderConstruction.vue';

const { t } = useI18n();
</script>
