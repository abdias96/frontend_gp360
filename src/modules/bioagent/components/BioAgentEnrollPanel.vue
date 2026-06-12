<template>
  <div class="bioagent-enroll-panel">
    <!-- Estado del agente -->
    <div :class="['alert', agentAlert.cls, 'd-flex', 'align-items-center', 'py-2']">
      <i :class="['bi', agentAlert.icon, 'fs-4', 'me-2']"></i>
      <div class="flex-grow-1">
        <strong>{{ agentAlert.title }}</strong>
        <div class="small">{{ agentAlert.detail }}</div>
      </div>
      <button
        v-if="!isAgentReady"
        type="button"
        class="btn btn-sm btn-outline-primary"
        :disabled="checking"
        @click="connectAgent"
      >
        <span v-if="checking" class="spinner-border spinner-border-sm me-1"></span>
        Reintentar conexión
      </button>
    </div>

    <div v-if="!flow" class="text-center py-3">
      <button
        type="button"
        class="btn btn-primary"
        :disabled="!isAgentReady || !inmateId"
        @click="beginFlow"
      >
        <i class="bi bi-fingerprint me-1"></i> Iniciar captura de huellas
      </button>
      <div v-if="!inmateId" class="text-muted small mt-2">
        Guarde primero los datos básicos del interno para habilitar la captura.
      </div>
    </div>

    <template v-else>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="badge bg-info">{{ flow.completedSteps }} / 10 dedos</span>
      </div>
      <FingerGrid :history="flow.history" :current-finger="flow.currentFinger" />

      <div class="d-flex flex-wrap gap-2 justify-content-center mt-3">
        <button
          v-if="flow.status === 'in_progress'"
          type="button"
          class="btn btn-warning"
          :disabled="capturing"
          @click="captureNext"
        >
          <span v-if="capturing" class="spinner-border spinner-border-sm me-1"></span>
          <i v-else class="bi bi-fingerprint me-1"></i>
          Capturar: <strong class="ms-1">{{ currentFingerLabel }}</strong>
        </button>

        <button
          v-if="flow.status === 'in_progress'"
          type="button"
          class="btn btn-outline-danger"
          @click="abortFlow"
        >
          <i class="bi bi-x-octagon me-1"></i> Cancelar
        </button>

        <button
          v-if="flow.status === 'completed'"
          type="button"
          class="btn btn-success"
          :disabled="persisting"
          @click="persistTemplates"
        >
          <span v-if="persisting" class="spinner-border spinner-border-sm me-1"></span>
          <i v-else class="bi bi-cloud-upload me-1"></i>
          Guardar huellas en GP360
        </button>
      </div>
    </template>

    <div v-if="enrolledCount > 0" class="alert alert-success mt-3 py-2 mb-0">
      <i class="bi bi-check-circle-fill me-2"></i>
      {{ enrolledCount }} huellas guardadas correctamente.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Swal from 'sweetalert2'
import ApiService from '@/core/services/ApiService'
import {
  useBioAgent,
  FINGER_LABELS,
  type EnrollFlowSnapshot,
} from '@/composables/useBioAgent'
import FingerGrid from './FingerGrid.vue'

const props = defineProps<{
  /** ID del PPL ya persistido en GP360 (requerido para guardar). */
  inmateId: number | null
}>()

const emit = defineEmits<{
  (e: 'enrolled', count: number): void
}>()

const bio = useBioAgent()
const checking = ref(false)
const capturing = ref(false)
const persisting = ref(false)
const enrolledCount = ref(0)

const flow = ref<EnrollFlowSnapshot | null>(null)
let streamCleanup: (() => void) | null = null

const capturedTemplates = ref<Record<string, { template: string | null; quality: number | null }>>({})

const isAgentReady = computed(() => bio.isAvailable.value && bio.isHandshaken.value)

const agentAlert = computed(() => {
  if (isAgentReady.value) {
    return { cls: 'alert-success', icon: 'bi-check-circle-fill', title: 'BioAgent conectado',
      detail: 'Lector listo en este equipo (127.0.0.1:8400)' }
  }
  if (bio.lastError.value) {
    return { cls: 'alert-danger', icon: 'bi-exclamation-octagon-fill', title: 'BioAgent no disponible',
      detail: bio.lastError.value || 'Verifique que MINGOB BioAgent esté corriendo.' }
  }
  return { cls: 'alert-warning', icon: 'bi-info-circle-fill', title: 'BioAgent sin verificar',
    detail: 'Pulse "Reintentar conexión".' }
})

const currentFingerLabel = computed(() => {
  const code = flow.value?.currentFinger
  return code ? (FINGER_LABELS as any)[code] || code : ''
})

async function connectAgent() {
  checking.value = true
  try {
    const ok = await bio.checkHealth()
    if (ok) await bio.handshake()
  } finally { checking.value = false }
}

async function beginFlow() {
  try {
    if (!isAgentReady.value) await connectAgent()
    if (!isAgentReady.value) return
    flow.value = await bio.startEnrollment()
    capturedTemplates.value = {}
    streamCleanup = bio.streamEnrollment(flow.value.flowId, () => {}, () => { streamCleanup = null })
  } catch (e: any) {
    await Swal.fire({ icon: 'error', title: 'No se pudo iniciar', text: e?.message })
  }
}

async function captureNext() {
  if (!flow.value) return
  capturing.value = true
  try {
    const r = await bio.captureNextFinger(flow.value.flowId, 60, 3)
    flow.value = r.snapshot
    if (r.step?.success && r.step.finger) {
      capturedTemplates.value[r.step.finger] = {
        template: r.template_base64,
        quality: r.step.quality,
      }
    }
  } catch (e: any) {
    await Swal.fire({ icon: 'warning', title: 'Captura falló', text: e?.message })
  } finally { capturing.value = false }
}

async function abortFlow() {
  if (!flow.value) return
  try { await bio.cancelEnrollment(flow.value.flowId) } finally { cleanupFlow() }
}

async function persistTemplates() {
  if (!flow.value || !props.inmateId) return
  persisting.value = true
  try {
    const fingerprints = Object.entries(capturedTemplates.value)
      .filter(([, v]) => !!v.template)
      .map(([finger, v]) => ({ finger, quality: v.quality, template_base64: v.template }))
    if (!fingerprints.length) {
      await Swal.fire({ icon: 'warning', title: 'Sin templates', text: 'Ninguna captura devolvió template. Reinicie el flujo.' })
      return
    }
    await ApiService.post(`/inmates/${props.inmateId}/biometric/enrollments`, {
      flow_id: flow.value.flowId,
      enrolled_at: new Date().toISOString(),
      fingerprints,
    })
    enrolledCount.value = fingerprints.length
    emit('enrolled', fingerprints.length)
    cleanupFlow()
  } catch (e: any) {
    await Swal.fire({ icon: 'error', title: 'No se pudo guardar', text: e?.response?.data?.message || e?.message })
  } finally { persisting.value = false }
}

function cleanupFlow() {
  if (streamCleanup) streamCleanup()
  streamCleanup = null
  flow.value = null
  capturedTemplates.value = {}
}

onMounted(connectAgent)
onUnmounted(() => { if (streamCleanup) streamCleanup() })
</script>
