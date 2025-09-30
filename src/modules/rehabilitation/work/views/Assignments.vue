<template>
  <UnderConstruction
    :title="t('rehabilitation.assignments.title')"
    :subtitle="t('rehabilitation.assignments.subtitle')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UnderConstruction from '@/components/UnderConstruction.vue';

const { t } = useI18n();
</script>
