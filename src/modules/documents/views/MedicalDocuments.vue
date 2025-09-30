<template>
  <UnderConstruction
    :title="t('documents.medicalDocuments.title')"
    :subtitle="t('documents.medicalDocuments.subtitle')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UnderConstruction from '@/components/UnderConstruction.vue';

const { t } = useI18n();
</script>
