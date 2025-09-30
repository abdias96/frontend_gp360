<template>
  <UnderConstruction
    :title="t('rehabilitation.basic.title')"
    :subtitle="t('rehabilitation.basic.subtitle')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UnderConstruction from '@/components/UnderConstruction.vue';

const { t } = useI18n();
</script>
