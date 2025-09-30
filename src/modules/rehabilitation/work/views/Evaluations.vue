<template>
  <UnderConstruction
    :title="t('rehabilitation.evaluations.title')"
    :subtitle="t('rehabilitation.evaluations.subtitle')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UnderConstruction from '@/components/UnderConstruction.vue';

const { t } = useI18n();
</script>
