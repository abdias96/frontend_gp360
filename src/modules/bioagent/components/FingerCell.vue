<template>
  <div :class="['finger-cell', `finger-cell--${state}`, { 'is-current': isCurrent }]">
    <div class="finger-cell__icon">
      <i v-if="state === 'captured'" class="bi bi-check-circle-fill text-success"></i>
      <i v-else-if="state === 'failed'" class="bi bi-x-circle-fill text-danger"></i>
      <i v-else-if="state === 'current'" class="bi bi-record-circle text-warning"></i>
      <i v-else class="bi bi-circle text-muted"></i>
    </div>
    <div class="finger-cell__finger" :title="label">
      <i :class="['bi', fingerIcon]" aria-hidden="true"></i>
    </div>
    <div class="finger-cell__label">{{ shortLabel }}</div>
    <div v-if="quality !== null" class="finger-cell__quality">{{ quality }}%</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  code: string
  label: string
  state: 'pending' | 'current' | 'captured' | 'failed'
  quality: number | null
  isCurrent: boolean
}

const props = defineProps<Props>()

const fingerIcon = computed(() => {
  // Bootstrap-icons no tiene íconos por dedo — usamos hand-index para todos.
  return 'bi-hand-index-thumb'
})

const shortLabel = computed(() => {
  const map: Record<string, string> = {
    right_thumb: 'Pulgar',
    right_index: 'Índice',
    right_middle: 'Medio',
    right_ring: 'Anular',
    right_pinky: 'Meñique',
    left_thumb: 'Pulgar',
    left_index: 'Índice',
    left_middle: 'Medio',
    left_ring: 'Anular',
    left_pinky: 'Meñique',
  }
  return map[props.code] ?? props.label
})
</script>

<style scoped>
.finger-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 8px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  min-width: 64px;
  transition: all 200ms ease;
}
.finger-cell--pending  { background: #fafafa; }
.finger-cell--current,
.finger-cell.is-current {
  border-color: #f0ad4e;
  background: #fff8e7;
  box-shadow: 0 0 0 4px rgba(240, 173, 78, 0.18);
  animation: pulse 1.4s ease-in-out infinite;
}
.finger-cell--captured { border-color: #28a745; background: #f0fff5; }
.finger-cell--failed   { border-color: #dc3545; background: #fff5f5; }

.finger-cell__finger { font-size: 1.6rem; color: #555; line-height: 1; }
.finger-cell__label  { font-size: 0.72rem; color: #555; }
.finger-cell__quality {
  font-size: 0.7rem;
  font-weight: 700;
  color: #28a745;
}
.finger-cell--failed .finger-cell__quality { color: #dc3545; }

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(240, 173, 78, 0.18); }
  50%      { box-shadow: 0 0 0 8px rgba(240, 173, 78, 0.05); }
}
</style>
