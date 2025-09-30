<template>
  <UnderConstruction
    :title="t('documents.legalDocuments.title')"
    :subtitle="t('documents.legalDocuments.subtitle')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UnderConstruction from '@/components/UnderConstruction.vue';

const { t } = useI18n();
</script>
