<template>
  <UnderConstruction
    :title="t('emergency.protocols.title')"
    :subtitle="t('emergency.protocols.subtitle')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UnderConstruction from '@/components/UnderConstruction.vue';

const { t } = useI18n();
</script>
