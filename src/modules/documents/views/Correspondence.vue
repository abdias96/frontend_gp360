<template>
  <UnderConstruction
    :title="t('documents.correspondence.title')"
    :subtitle="t('documents.correspondence.subtitle')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UnderConstruction from '@/components/UnderConstruction.vue';

const { t } = useI18n();
</script>
