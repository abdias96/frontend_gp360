<template>
  <UnderConstruction
    :title="t('emergency.responseTeams.title')"
    :subtitle="t('emergency.responseTeams.subtitle')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UnderConstruction from '@/components/UnderConstruction.vue';

const { t } = useI18n();
</script>
