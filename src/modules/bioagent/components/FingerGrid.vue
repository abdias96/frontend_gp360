<template>
  <div class="finger-grid">
    <div class="hands">
      <div class="hand hand-left">
        <div class="hand-label">Mano izquierda</div>
        <div class="fingers">
          <FingerCell
            v-for="f in leftFingers"
            :key="f.code"
            :code="f.code"
            :label="f.label"
            :state="stateOf(f.code)"
            :quality="qualityOf(f.code)"
            :is-current="currentFinger === f.code"
          />
        </div>
      </div>

      <div class="hand hand-right">
        <div class="hand-label">Mano derecha</div>
        <div class="fingers">
          <FingerCell
            v-for="f in rightFingers"
            :key="f.code"
            :code="f.code"
            :label="f.label"
            :state="stateOf(f.code)"
            :quality="qualityOf(f.code)"
            :is-current="currentFinger === f.code"
          />
        </div>
      </div>
    </div>

    <div class="legend mt-4">
      <span class="legend-item"><i class="bi bi-circle text-muted"></i> Pendiente</span>
      <span class="legend-item"><i class="bi bi-record-circle text-warning"></i> Capturando</span>
      <span class="legend-item"><i class="bi bi-check-circle-fill text-success"></i> Capturado</span>
      <span class="legend-item"><i class="bi bi-x-circle-fill text-danger"></i> Fallido</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FINGER_LABELS, type FingerName, type EnrollFlowStep } from '@/composables/useBioAgent'
import FingerCell from './FingerCell.vue'

interface Props {
  history: EnrollFlowStep[]
  currentFinger?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  currentFinger: null,
})

const ALL_LEFT: FingerName[]  = ['left_thumb', 'left_index', 'left_middle', 'left_ring', 'left_pinky']
const ALL_RIGHT: FingerName[] = ['right_thumb', 'right_index', 'right_middle', 'right_ring', 'right_pinky']

const leftFingers = computed(() => ALL_LEFT.map((c) => ({ code: c, label: FINGER_LABELS[c] })))
const rightFingers = computed(() => ALL_RIGHT.map((c) => ({ code: c, label: FINGER_LABELS[c] })))

function stepOf(code: string): EnrollFlowStep | undefined {
  // El último intento de cada dedo gana — recorre al revés.
  for (let i = props.history.length - 1; i >= 0; i--) {
    if (props.history[i].finger === code) return props.history[i]
  }
  return undefined
}

function stateOf(code: string): 'pending' | 'current' | 'captured' | 'failed' {
  const step = stepOf(code)
  if (step?.success) return 'captured'
  if (step && !step.success) return 'failed'
  if (props.currentFinger === code) return 'current'
  return 'pending'
}

function qualityOf(code: string): number | null {
  return stepOf(code)?.quality ?? null
}
</script>

<style scoped>
.finger-grid { padding: 16px 0; }

.hands {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}
@media (max-width: 768px) { .hands { grid-template-columns: 1fr; } }

.hand-label {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.78rem;
  color: var(--bs-secondary, #6c757d);
  margin-bottom: 12px;
  text-align: center;
}
.hand-left  .fingers { justify-content: flex-end; }
.hand-right .fingers { justify-content: flex-start; }

.fingers {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  font-size: 0.85rem;
  color: var(--bs-secondary, #6c757d);
}
.legend-item i { margin-right: 4px; }
</style>
