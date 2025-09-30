<template>
  <UnderConstruction
    :title="t('security.incidents.title')"
    :subtitle="t('security.incidents.subtitle')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UnderConstruction from '@/components/UnderConstruction.vue';

const { t } = useI18n();
</script>
