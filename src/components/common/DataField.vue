<template>
  <div class="data-field" :class="{ 'has-discrepancy': hasDiscrepancy }">
    <label class="form-label text-muted small mb-1">{{ label }}</label>
    <div class="field-value d-flex align-items-center">
      <span class="fw-semibold" :class="{ 'text-danger': hasDiscrepancy }">
        {{ displayValue }}
      </span>
      <i
        v-if="hasDiscrepancy"
        class="fas fa-exclamation-triangle text-danger ms-2"
        :title="discrepancyTooltip"
      ></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  label: string;
  value: string | number | null | undefined;
  hasDiscrepancy?: boolean;
  discrepancyTooltip?: string;
  emptyText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  hasDiscrepancy: false,
  discrepancyTooltip: '',
  emptyText: '-'
});

const { t } = useI18n();

const displayValue = computed(() => {
  if (props.value === null || props.value === undefined || props.value === '') {
    return props.emptyText;
  }
  return String(props.value);
});
</script>

<style scoped>
.data-field {
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
}

.data-field.has-discrepancy {
  background-color: rgba(220, 53, 69, 0.1);
  border-left: 3px solid #dc3545;
}

.field-value {
  min-height: 1.5rem;
}
</style>
