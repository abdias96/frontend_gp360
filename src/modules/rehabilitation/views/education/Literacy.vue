<template>
  <UnderConstruction
    :title="t('rehabilitation.education.literacy.title')"
    :subtitle="t('rehabilitation.education.literacy.subtitle')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UnderConstruction from '@/components/UnderConstruction.vue';

const { t } = useI18n();
</script>