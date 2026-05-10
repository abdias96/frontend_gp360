<template>
  <div class="enrollment-inmate container-fluid py-4">
    <header class="mb-4">
      <h1 class="h3 mb-1">
        <i class="bi bi-fingerprint me-2 text-primary"></i>
        Enrolamiento biométrico — PPL
      </h1>
      <p class="text-muted mb-0">
        Captura de las 10 huellas dactilares del PPL usando MINGOB BioAgent (loopback local).
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

    <!-- Paso 1: selección de PPL -->
    <div class="card mb-4">
      <div class="card-header bg-light">
        <strong>1. Seleccione PPL a enrolar</strong>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <label for="bio-inmate-search" class="form-label">Buscar por número de expediente / nombre</label>
            <input
              id="bio-inmate-search"
              v-model="search"
              type="text"
              class="form-control"
              placeholder="Ej: 2026-001234 o Juan Pérez"
              :disabled="!!flow"
              @input="onSearch"
            />
            <ul v-if="results.length" class="list-group mt-2">
              <li
                v-for="r in results"
                :key="r.id"
                class="list-group-item list-group-item-action d-flex justify-content-between"
                @click="selectInmate(r)"
              >
                <span><strong>{{ r.code }}</strong> — {{ r.full_name }}</span>
                <span class="badge bg-secondary">{{ r.center }}</span>
              </li>
            </ul>
          </div>

          <div class="col-md-6">
            <label class="form-label">PPL seleccionado</label>
            <div v-if="selected" class="border rounded p-3 bg-light">
              <div class="fw-bold">{{ selected.full_name }}</div>
              <div class="text-muted small">Expediente: {{ selected.code }}</div>
              <div class="text-muted small">Centro: {{ selected.center }}</div>
            </div>
            <div v-else class="text-muted fst-italic">Sin selección</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Paso 2: captura -->
    <div class="card mb-4" v-if="selected">
      <div class="card-header bg-light d-flex justify-content-between align-items-center">
        <strong>2. Captura de las 10 huellas</strong>
        <span v-if="flow" class="badge bg-info">
          {{ flow.completedSteps }} / 10 dedos completados
        </span>
      </div>
      <div class="card-body">
        <div v-if="!flow" class="text-center py-4">
          <button
            class="btn btn-primary btn-lg"
            :disabled="!isAgentReady"
            @click="beginFlow"
          >
            <i class="bi bi-play-circle me-1"></i> Iniciar enrolamiento
          </button>
          <div class="text-muted small mt-2">
            Se solicitará al lector capturar dedo por dedo.
          </div>
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
              Capturar dedo:
              <strong class="ms-1">{{ currentFingerLabel }}</strong>
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
              Confirmar y guardar en GP360
            </button>
          </div>

          <!-- Stream de eventos en vivo -->
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
import axios from 'axios'
import {
  useBioAgent,
  FINGER_LABELS,
  type EnrollFlowSnapshot,
  type EnrollEvent,
} from '@/composables/useBioAgent'
import FingerGrid from '../components/FingerGrid.vue'

interface InmateRow {
  id: number
  code: string
  full_name: string
  center: string
}

const bio = useBioAgent()
const checking = ref(false)
const capturing = ref(false)
const persisting = ref(false)

// Búsqueda PPL
const search = ref('')
const results = ref<InmateRow[]>([])
const selected = ref<InmateRow | null>(null)

let searchDebounce: number | null = null

// Estado del flow
const flow = ref<EnrollFlowSnapshot | null>(null)
const streamLog = ref<EnrollEvent[]>([])
let streamCleanup: (() => void) | null = null

const isAgentReady = computed(() => bio.isAvailable.value && bio.isHandshaken.value)

const agentAlert = computed(() => {
  if (isAgentReady.value) {
    return {
      cls: 'alert-success',
      icon: 'bi-check-circle-fill',
      title: 'BioAgent conectado',
      detail: 'Sesión establecida con 127.0.0.1:8400',
    }
  }
  if (bio.lastError.value) {
    return {
      cls: 'alert-danger',
      icon: 'bi-exclamation-octagon-fill',
      title: 'BioAgent no disponible',
      detail: bio.lastError.value || 'Verifique que MINGOB BioAgent esté corriendo en el equipo.',
    }
  }
  return {
    cls: 'alert-warning',
    icon: 'bi-info-circle-fill',
    title: 'BioAgent sin verificar',
    detail: 'Pulse "Reintentar conexión" para iniciar sesión con el agente local.',
  }
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
  } finally {
    checking.value = false
  }
}

function onSearch() {
  if (searchDebounce) window.clearTimeout(searchDebounce)
  searchDebounce = window.setTimeout(async () => {
    if (search.value.length < 2) { results.value = []; return }
    try {
      const { data } = await axios.get('/api/inmates/search', {
        params: { q: search.value, limit: 8 },
      })
      results.value = data?.data || []
    } catch {
      results.value = []
    }
  }, 250)
}

function selectInmate(r: InmateRow) {
  selected.value = r
  results.value = []
  search.value = `${r.code} — ${r.full_name}`
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
    await Swal.fire({ icon: 'error', title: 'No se pudo iniciar', text: e?.message || 'Error desconocido' })
  }
}

async function captureNext() {
  if (!flow.value) return
  capturing.value = true
  try {
    const r = await bio.captureNextFinger(flow.value.flowId, 60, 3)
    flow.value = r.snapshot
  } catch (e: any) {
    await Swal.fire({ icon: 'warning', title: 'Captura falló', text: e?.message || 'Reintente la captura' })
  } finally {
    capturing.value = false
  }
}

async function abortFlow() {
  const ok = await Swal.fire({
    icon: 'warning',
    title: '¿Cancelar enrolamiento?',
    text: 'Se descartarán las huellas capturadas en este flujo.',
    showCancelButton: true,
    confirmButtonText: 'Sí, cancelar',
    cancelButtonText: 'Continuar',
  })
  if (!ok.isConfirmed || !flow.value) return
  try {
    await bio.cancelEnrollment(flow.value.flowId)
  } finally {
    cleanupFlow()
  }
}

async function persistTemplates() {
  if (!flow.value || !selected.value) return
  persisting.value = true
  try {
    const fingerprints: Record<string, { template: string; quality: number }> = {}
    for (const step of flow.value.history) {
      if (step.success) {
        // El agente guarda el template_base64 al completar; lo recuperamos del status final.
      }
    }
    const final = await bio.getEnrollmentStatus(flow.value.flowId)
    const payload = {
      inmate_id: selected.value.id,
      flow_id: flow.value.flowId,
      enrolled_at: new Date().toISOString(),
      fingerprints: final.history
        .filter((s) => s.success)
        .map((s) => ({ finger: s.finger, quality: s.quality })),
    }
    await axios.post(`/api/inmates/${selected.value.id}/biometric/enrollments`, payload)
    await Swal.fire({
      icon: 'success',
      title: '¡Enrolamiento guardado!',
      text: `Las huellas de ${selected.value.full_name} se almacenaron correctamente.`,
    })
    cleanupFlow()
    selected.value = null
    search.value = ''
  } catch (e: any) {
    await Swal.fire({ icon: 'error', title: 'No se pudo guardar', text: e?.message || 'Error en backend' })
  } finally {
    persisting.value = false
  }
}

function cleanupFlow() {
  if (streamCleanup) streamCleanup()
  streamCleanup = null
  flow.value = null
  streamLog.value = []
}

function formatTime(iso: string): string {
  try { return new Date(iso).toLocaleTimeString() } catch { return iso }
}

onUnmounted(() => { if (streamCleanup) streamCleanup() })

// Auto-conectar al montar
connectAgent()
</script>

<style scoped>
.event-log {
  max-height: 140px;
  overflow-y: auto;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 8px 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.78rem;
}
.event-line { padding: 2px 0; }
.list-group-item-action { cursor: pointer; }
</style>
