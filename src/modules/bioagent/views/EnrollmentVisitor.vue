<template>
  <div class="enrollment-visitor container-fluid py-4">
    <header class="mb-4">
      <h1 class="h3 mb-1">
        <i class="bi bi-person-badge me-2 text-success"></i>
        Enrolamiento biométrico — Visitante
      </h1>
      <p class="text-muted mb-0">
        Vincula las 10 huellas a un código de visita aprobado (VIS-XXXXXXXX) emitido por el portal UNMGP.
      </p>
    </header>

    <!-- Estado del agente -->
    <div :class="['alert', agentAlert.cls, 'd-flex', 'align-items-center']">
      <i :class="['bi', agentAlert.icon, 'fs-4', 'me-2']"></i>
      <div class="flex-grow-1">
        <strong>{{ agentAlert.title }}</strong>
        <div class="small">{{ agentAlert.detail }}</div>
      </div>
      <button
        v-if="!isAgentReady"
        class="btn btn-sm btn-outline-primary"
        :disabled="checking"
        @click="connectAgent"
      >
        <span v-if="checking" class="spinner-border spinner-border-sm me-1"></span>
        Reintentar conexión
      </button>
    </div>

    <!-- Paso 1: lookup VIS -->
    <div class="card mb-4">
      <div class="card-header bg-light">
        <strong>1. Validar código de visita</strong>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <label for="bio-vis-code" class="form-label">Código VIS</label>
            <div class="input-group">
              <input
                id="bio-vis-code"
                v-model="visCode"
                type="text"
                class="form-control text-uppercase"
                placeholder="VIS-A1B2C3D4"
                :disabled="!!flow || !!visit"
                @keyup.enter="lookupVisit"
              />
              <button
                class="btn btn-primary"
                :disabled="!visCode || lookingUp || !!visit"
                @click="lookupVisit"
              >
                <span v-if="lookingUp" class="spinner-border spinner-border-sm me-1"></span>
                Validar
              </button>
            </div>
            <div class="form-text">El código se generó al aprobar la solicitud en el portal UNMGP.</div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Visita</label>
            <div v-if="visit" class="border rounded p-3 bg-light">
              <div class="fw-bold">{{ visit.visitor_full_name }}</div>
              <div class="text-muted small">DPI: {{ visit.visitor_dpi }}</div>
              <div class="text-muted small">PPL: {{ visit.inmate_full_name }} ({{ visit.inmate_code }})</div>
              <div class="text-muted small">Fecha programada: {{ visit.scheduled_date }}</div>
              <span class="badge bg-success mt-2">{{ visit.status }}</span>
            </div>
            <div v-else class="text-muted fst-italic">Pendiente de validar</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Paso 2: captura -->
    <div class="card mb-4" v-if="visit">
      <div class="card-header bg-light d-flex justify-content-between align-items-center">
        <strong>2. Captura de las 10 huellas del visitante</strong>
        <span v-if="flow" class="badge bg-info">{{ flow.completedSteps }} / 10</span>
      </div>
      <div class="card-body">
        <div v-if="!flow" class="text-center py-4">
          <button
            class="btn btn-success btn-lg"
            :disabled="!isAgentReady"
            @click="beginFlow"
          >
            <i class="bi bi-play-circle me-1"></i> Iniciar enrolamiento
          </button>
        </div>

        <template v-else>
          <FingerGrid :history="flow.history" :current-finger="flow.currentFinger" />

          <div class="d-flex flex-wrap gap-2 justify-content-center mt-4">
            <button
              v-if="flow.status === 'in_progress'"
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
              class="btn btn-outline-danger"
              @click="abortFlow"
            >
              <i class="bi bi-x-octagon me-1"></i> Cancelar
            </button>

            <button
              v-if="flow.status === 'completed'"
              class="btn btn-success btn-lg"
              :disabled="persisting"
              @click="persistTemplates"
            >
              <span v-if="persisting" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else class="bi bi-cloud-upload me-1"></i>
              Confirmar visitante en GP360
            </button>
          </div>

          <div v-if="streamLog.length" class="mt-4">
            <div class="text-muted small mb-1">Eventos del agente</div>
            <div class="event-log">
              <div v-for="(ev, idx) in streamLog.slice(-5)" :key="idx" class="event-line">
                <span class="badge bg-secondary me-2">{{ formatTime(ev.timestamp) }}</span>
                <strong>{{ ev.stage }}</strong>
                <span v-if="ev.finger"> · {{ ev.finger }}</span>
                <span v-if="ev.quality !== null"> · calidad {{ ev.quality }}</span>
                <span v-if="ev.error" class="text-danger"> · {{ ev.error }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import Swal from 'sweetalert2'
import ApiService from '@/core/services/ApiService'
import {
  useBioAgent,
  FINGER_LABELS,
  type EnrollFlowSnapshot,
  type EnrollEvent,
} from '@/composables/useBioAgent'
import FingerGrid from '../components/FingerGrid.vue'

interface VisitInfo {
  id: number
  code: string
  visitor_full_name: string
  visitor_dpi: string
  inmate_full_name: string
  inmate_code: string
  scheduled_date: string
  status: string
}

const bio = useBioAgent()
const checking = ref(false)
const lookingUp = ref(false)
const capturing = ref(false)
const persisting = ref(false)

const visCode = ref('')
const visit = ref<VisitInfo | null>(null)

const flow = ref<EnrollFlowSnapshot | null>(null)
const streamLog = ref<EnrollEvent[]>([])
let streamCleanup: (() => void) | null = null

// Templates capturados por dedo (solo viajan en cada respuesta de capture-next)
const capturedTemplates = ref<Record<string, { template: string | null; quality: number | null }>>({})

const isAgentReady = computed(() => bio.isAvailable.value && bio.isHandshaken.value)

const agentAlert = computed(() => {
  if (isAgentReady.value) {
    return { cls: 'alert-success', icon: 'bi-check-circle-fill', title: 'BioAgent conectado',
      detail: 'Sesión establecida con 127.0.0.1:8400' }
  }
  if (bio.lastError.value) {
    return { cls: 'alert-danger', icon: 'bi-exclamation-octagon-fill', title: 'BioAgent no disponible',
      detail: bio.lastError.value || 'Verifique que MINGOB BioAgent esté corriendo.' }
  }
  return { cls: 'alert-warning', icon: 'bi-info-circle-fill', title: 'BioAgent sin verificar',
    detail: 'Pulse "Reintentar conexión" para iniciar sesión.' }
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

async function lookupVisit() {
  if (!visCode.value) return
  lookingUp.value = true
  try {
    const code = visCode.value.trim().toUpperCase()
    const { data } = await ApiService.get(`/visits/by-code/${encodeURIComponent(code)}`)
    visit.value = data?.data
    if (!visit.value) {
      await Swal.fire({ icon: 'warning', title: 'Sin resultado', text: 'No se encontró una visita aprobada con ese código.' })
    }
  } catch (e: any) {
    await Swal.fire({ icon: 'error', title: 'Código inválido', text: e?.response?.data?.message || 'Verifique el código y reintente.' })
  } finally {
    lookingUp.value = false
  }
}

async function beginFlow() {
  try {
    if (!isAgentReady.value) await connectAgent()
    if (!isAgentReady.value) return
    flow.value = await bio.startEnrollment()
    streamLog.value = []
    streamCleanup = bio.streamEnrollment(
      flow.value.flowId,
      (ev) => streamLog.value.push(ev),
      () => { streamCleanup = null },
    )
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
  const ok = await Swal.fire({
    icon: 'warning',
    title: '¿Cancelar enrolamiento?',
    showCancelButton: true,
    confirmButtonText: 'Sí, cancelar',
    cancelButtonText: 'Continuar',
  })
  if (!ok.isConfirmed || !flow.value) return
  try { await bio.cancelEnrollment(flow.value.flowId) } finally { cleanupFlow() }
}

async function persistTemplates() {
  if (!flow.value || !visit.value) return
  persisting.value = true
  try {
    const fingerprints = Object.entries(capturedTemplates.value)
      .filter(([, v]) => !!v.template)
      .map(([finger, v]) => ({
        finger,
        quality: v.quality,
        template_base64: v.template,
      }))
    if (!fingerprints.length) {
      await Swal.fire({
        icon: 'warning',
        title: 'Sin templates',
        text: 'Ninguna captura devolvió template. Reinicie el flujo de enrolamiento.',
      })
      return
    }
    const payload = {
      flow_id: flow.value.flowId,
      enrolled_at: new Date().toISOString(),
      fingerprints,
    }
    await ApiService.post(`/visits/${visit.value.id}/biometric/enroll`, payload)
    await Swal.fire({
      icon: 'success',
      title: 'Visitante enrolado',
      text: `${visit.value.visitor_full_name} quedó habilitado para ingreso biométrico.`,
    })
    cleanupFlow()
    visit.value = null
    visCode.value = ''
  } catch (e: any) {
    await Swal.fire({ icon: 'error', title: 'No se pudo guardar', text: e?.message })
  } finally { persisting.value = false }
}

function cleanupFlow() {
  if (streamCleanup) streamCleanup()
  streamCleanup = null
  flow.value = null
  streamLog.value = []
  capturedTemplates.value = {}
}

function formatTime(iso: string) {
  try { return new Date(iso).toLocaleTimeString() } catch { return iso }
}

onUnmounted(() => { if (streamCleanup) streamCleanup() })
connectAgent()
</script>

<style scoped>
.event-log {
  max-height: 140px; overflow-y: auto; background: #f8f9fa;
  border: 1px solid #e9ecef; border-radius: 6px; padding: 8px 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.78rem;
}
.event-line { padding: 2px 0; }
</style>
