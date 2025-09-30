<template>
  <UnderConstruction
    :title="t('rehabilitation.programs.title')"
    :subtitle="t('rehabilitation.programs.subtitle')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UnderConstruction from '@/components/UnderConstruction.vue';

const { t } = useI18n();
</script>
