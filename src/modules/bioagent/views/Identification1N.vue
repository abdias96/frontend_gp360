<template>
  <div class="identification-1n container-fluid py-4">
    <header class="mb-4">
      <h1 class="h3 mb-1">
        <i class="bi bi-search me-2 text-warning"></i>
        Identificación 1:N por huella
      </h1>
      <p class="text-muted mb-0">
        Una huella → búsqueda en padrón biométrico GP360 → consulta RENAP si no hay coincidencia local.
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

    <div class="row g-3">
      <!-- Captura -->
      <div class="col-lg-5">
        <div class="card h-100">
          <div class="card-header bg-light"><strong>1. Captura de huella</strong></div>
          <div class="card-body">
            <div class="mb-3">
              <label for="bio-1n-finger" class="form-label">Dedo a capturar</label>
              <select id="bio-1n-finger" v-model="finger" class="form-select" :disabled="busy">
                <option v-for="f in FINGERS" :key="f.code" :value="f.code">{{ f.label }}</option>
              </select>
            </div>

            <div class="reader-pad text-center py-4 mb-3">
              <i
                :class="[
                  'bi',
                  capture ? 'bi-check-circle-fill text-success' : 'bi-fingerprint',
                  'reader-pad__icon',
                ]"
              ></i>
              <div class="text-muted small mt-2">
                <template v-if="busy">Capturando huella…</template>
                <template v-else-if="capture">Calidad {{ capture.quality }}% · listo</template>
                <template v-else>Listo para capturar</template>
              </div>
            </div>

            <div class="d-grid gap-2">
              <button
                class="btn btn-warning btn-lg"
                :disabled="!isAgentReady || busy"
                @click="captureAndIdentify"
              >
                <span v-if="busy" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="bi bi-fingerprint me-1"></i>
                Capturar e identificar
              </button>
              <button v-if="result" class="btn btn-outline-secondary" @click="reset">
                <i class="bi bi-arrow-counterclockwise me-1"></i> Nueva identificación
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Resultado -->
      <div class="col-lg-7">
        <div class="card h-100">
          <div class="card-header bg-light"><strong>2. Resultado</strong></div>
          <div class="card-body">
            <div v-if="!result && !busy" class="text-center text-muted fst-italic py-5">
              Aún no se ha realizado búsqueda
            </div>

            <div v-else-if="busy" class="text-center py-5">
              <div class="spinner-border text-warning" role="status"></div>
              <div class="mt-3 text-muted">
                <template v-if="phase === 'capture'">Capturando huella en lector…</template>
                <template v-else-if="phase === 'local'">Buscando en padrón GP360…</template>
                <template v-else-if="phase === 'renap'">Consultando RENAP (fallback)…</template>
              </div>
            </div>

            <template v-else-if="result">
              <!-- Match local -->
              <div v-if="result.match === 'local'" class="match-card match-card--ok">
                <div class="d-flex align-items-start">
                  <img
                    v-if="result.subject?.photo_url"
                    :src="result.subject.photo_url"
                    alt="Foto"
                    class="match-photo"
                  />
                  <div v-else class="match-photo match-photo--placeholder">
                    <i class="bi bi-person-circle"></i>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <div class="badge bg-success mb-2">
                      Match en padrón GP360 · score {{ result.score }}
                    </div>
                    <h4 class="mb-1">{{ result.subject?.full_name }}</h4>
                    <div class="text-muted">
                      {{ result.subject?.kind === 'inmate' ? 'PPL' : 'Visitante' }} ·
                      {{ result.subject?.code }}
                    </div>
                    <table class="table table-sm mt-3 mb-0">
                      <tbody>
                        <tr v-if="result.subject?.dpi">
                          <th class="text-muted">DPI</th><td>{{ result.subject.dpi }}</td>
                        </tr>
                        <tr v-if="result.subject?.center">
                          <th class="text-muted">Centro</th><td>{{ result.subject.center }}</td>
                        </tr>
                        <tr v-if="result.subject?.status">
                          <th class="text-muted">Estado</th><td>{{ result.subject.status }}</td>
                        </tr>
                        <tr>
                          <th class="text-muted">Dedo coincidente</th>
                          <td>{{ matchedFingerLabel }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="mt-3 d-flex gap-2">
                      <router-link
                        v-if="result.subject?.kind === 'inmate'"
                        :to="`/inmates/${result.subject.id}`"
                        class="btn btn-outline-primary btn-sm"
                      >
                        <i class="bi bi-person-lines-fill me-1"></i> Abrir expediente
                      </router-link>
                      <button class="btn btn-outline-success btn-sm" @click="logIngress">
                        <i class="bi bi-box-arrow-in-right me-1"></i> Registrar ingreso
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Match RENAP -->
              <div v-else-if="result.match === 'renap'" class="match-card match-card--info">
                <div class="badge bg-info mb-2">No está en GP360 · localizado en RENAP</div>
                <h4 class="mb-1">{{ result.renap?.full_name }}</h4>
                <div class="text-muted">DPI: {{ result.renap?.dpi }}</div>
                <table class="table table-sm mt-3 mb-0">
                  <tbody>
                    <tr><th class="text-muted">Fecha de nacimiento</th><td>{{ result.renap?.birth_date }}</td></tr>
                    <tr><th class="text-muted">Municipio</th><td>{{ result.renap?.municipality }}</td></tr>
                    <tr><th class="text-muted">Departamento</th><td>{{ result.renap?.department }}</td></tr>
                  </tbody>
                </table>
                <div class="alert alert-warning mt-3 mb-0 small">
                  La persona no posee enrolamiento previo en GP360. Considere iniciar enrolamiento.
                </div>
              </div>

              <!-- Sin coincidencia -->
              <div v-else class="match-card match-card--miss text-center py-4">
                <i class="bi bi-question-circle display-4 text-muted"></i>
                <h4 class="mt-3">Sin coincidencia</h4>
                <p class="text-muted">
                  La huella no coincide con ningún registro en GP360 ni en RENAP.
                </p>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Swal from 'sweetalert2'
import ApiService from '@/core/services/ApiService'
import {
  useBioAgent,
  FINGER_LABELS,
  type FingerName,
  type CaptureResponse,
} from '@/composables/useBioAgent'

interface IdentifyResult {
  match: 'local' | 'renap' | 'none'
  score?: number
  matched_finger?: string
  subject?: {
    id: number
    kind: 'inmate' | 'visitor'
    code: string
    full_name: string
    dpi?: string
    center?: string
    status?: string
    photo_url?: string
  }
  renap?: {
    dpi: string
    full_name: string
    birth_date?: string
    municipality?: string
    department?: string
  }
}

const FINGERS = (Object.keys(FINGER_LABELS) as FingerName[]).map((c) => ({
  code: c,
  label: FINGER_LABELS[c],
}))

const bio = useBioAgent()
const checking = ref(false)
const busy = ref(false)
const phase = ref<'idle' | 'capture' | 'local' | 'renap'>('idle')
const finger = ref<FingerName>('right_index')
const capture = ref<CaptureResponse | null>(null)
const result = ref<IdentifyResult | null>(null)

const isAgentReady = computed(() => bio.isAvailable.value && bio.isHandshaken.value)

const agentAlert = computed(() => {
  if (isAgentReady.value) {
    return { cls: 'alert-success', icon: 'bi-check-circle-fill', title: 'BioAgent conectado',
      detail: 'Sesión establecida con 127.0.0.1:8400' }
  }
  if (bio.lastError.value) {
    return { cls: 'alert-danger', icon: 'bi-exclamation-octagon-fill', title: 'BioAgent no disponible',
      detail: bio.lastError.value }
  }
  return { cls: 'alert-warning', icon: 'bi-info-circle-fill', title: 'BioAgent sin verificar',
    detail: 'Pulse "Reintentar conexión".' }
})

const matchedFingerLabel = computed(() => {
  const code = result.value?.matched_finger as FingerName | undefined
  return code ? FINGER_LABELS[code] || code : ''
})

async function connectAgent() {
  checking.value = true
  try {
    const ok = await bio.checkHealth()
    if (ok) await bio.handshake()
  } finally { checking.value = false }
}

async function captureAndIdentify() {
  busy.value = true
  result.value = null
  capture.value = null
  try {
    phase.value = 'capture'
    capture.value = await bio.capture(finger.value, 60, 15)

    phase.value = 'local'
    const { data: local } = await ApiService.post('/biometric/identify', {
      finger: finger.value,
      template_base64: capture.value.templateBase64,
      quality: capture.value.quality,
    })

    if (local?.data?.match && local.data.match !== 'none') {
      result.value = local.data
      return
    }

    phase.value = 'renap'
    const { data: renap } = await ApiService.post('/biometric/renap-fallback', {
      finger: finger.value,
      template_base64: capture.value.templateBase64,
    })
    result.value = renap?.data || { match: 'none' }
  } catch (e: any) {
    await Swal.fire({
      icon: 'error',
      title: 'Identificación falló',
      text: e?.response?.data?.message || e?.message || 'Error desconocido',
    })
  } finally {
    busy.value = false
    phase.value = 'idle'
  }
}

async function logIngress() {
  if (!result.value?.subject) return
  try {
    await ApiService.post('/access/log', {
      subject_kind: result.value.subject.kind,
      subject_id: result.value.subject.id,
      method: 'biometric_1n',
      finger: result.value.matched_finger,
      score: result.value.score,
    })
    await Swal.fire({ icon: 'success', title: 'Ingreso registrado', timer: 1800, showConfirmButton: false })
  } catch (e: any) {
    await Swal.fire({ icon: 'error', title: 'No se pudo registrar', text: e?.message })
  }
}

function reset() {
  result.value = null
  capture.value = null
}

connectAgent()
</script>

<style scoped>
.reader-pad {
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  background: #fafbfc;
}
.reader-pad__icon { font-size: 5rem; color: #adb5bd; }

.match-card {
  border-radius: 10px;
  padding: 18px;
}
.match-card--ok   { background: #f0fff5; border: 1px solid #a3e9b8; }
.match-card--info { background: #ecf5ff; border: 1px solid #9ec6ff; }
.match-card--miss { background: #f8f9fa; border: 1px solid #e9ecef; }

.match-photo {
  width: 96px; height: 96px;
  object-fit: cover; border-radius: 8px;
  background: #fff; border: 1px solid #dee2e6;
}
.match-photo--placeholder {
  display: flex; align-items: center; justify-content: center;
  font-size: 3rem; color: #adb5bd;
}
.table th { width: 35%; font-weight: 600; }
</style>
