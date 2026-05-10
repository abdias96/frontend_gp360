/**
 * Composable que envuelve el MINGOB BioAgent (.NET 8 loopback en
 * 127.0.0.1:8400). Reemplaza al Java BiometricService anterior con
 * comunicación HTTP directa + WebSocket para feedback en vivo.
 *
 * Endpoints consumidos (ver bioagent-mingob/src/MingobBioAgent/Api/):
 *  GET  /v1/health
 *  GET  /v1/version
 *  GET  /v1/devices                              (token)
 *  POST /v1/handshake                            (público, emite token)
 *  POST /v1/capture                              (token)
 *  POST /v1/enroll/workflow                      (token)
 *  GET  /v1/enroll/{id}/status                   (token)
 *  POST /v1/enroll/{id}/cancel                   (token)
 *  POST /v1/enroll/{id}/capture-next             (token)
 *  WS   /v1/stream/{id}?token=&origin=
 */
import { ref, readonly } from 'vue'

export type FingerName =
  | 'right_thumb' | 'right_index' | 'right_middle' | 'right_ring' | 'right_pinky'
  | 'left_thumb'  | 'left_index'  | 'left_middle'  | 'left_ring'  | 'left_pinky'

export interface DeviceInfo {
  serial: string
  model: string
  firmwareVersion: string
  supportsPad: boolean
  isConnected: boolean
}

export interface CaptureResponse {
  finger: string
  templateBase64: string
  quality: number
  deviceSerial: string
  capturedAt: string
  captureTimeMs: number
}

export interface EnrollFlowStep {
  step: number
  finger: string
  quality: number | null
  deviceSerial: string | null
  attempts: number
  success: boolean
  error: string | null
}

export interface EnrollFlowSnapshot {
  flowId: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'failed'
  fingers: string[]
  completedSteps: number
  currentFinger: string | null
  createdAt: string
  updatedAt: string
  history: EnrollFlowStep[]
}

export interface EnrollEvent {
  flowId: string
  stage: 'started' | 'step_started' | 'captured' | 'retake' | 'completed' | 'cancelled' | 'failed'
  finger: string | null
  quality: number | null
  step: number | null
  attempts: number | null
  error: string | null
  timestamp: string
}

const AGENT_BASE = 'http://127.0.0.1:8400'
const SESSION_HEADER = 'X-MBA-Session'

let _token: string | null = null
let _tokenExpiresAt: Date | null = null

const isAvailable = ref(false)
const isHandshaken = ref(false)
const lastError = ref<string | null>(null)

export function useBioAgent() {
  /** Origen del frontend que el agente debe tener en su allowlist. */
  function origin(): string {
    return window.location.origin
  }

  async function fetchAgent<T = any>(
    path: string,
    init: RequestInit = {},
    requireToken = true,
  ): Promise<T> {
    if (requireToken && !_token) {
      await handshake()
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(init.headers as Record<string, string>),
    }
    if (init.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }
    if (requireToken && _token) {
      headers[SESSION_HEADER] = _token
    }

    const url = `${AGENT_BASE}${path}`
    const resp = await fetch(url, {
      ...init,
      headers,
      mode: 'cors',
      credentials: 'omit',
    })

    if (!resp.ok) {
      const text = await resp.text().catch(() => '')
      throw new Error(`BioAgent ${resp.status}: ${text || resp.statusText}`)
    }
    return resp.json() as Promise<T>
  }

  /** GET /v1/health — comprueba si el agente está corriendo. */
  async function checkHealth(): Promise<boolean> {
    try {
      const r = await fetchAgent<{ ok: boolean; version: string }>('/v1/health', {}, false)
      isAvailable.value = !!r?.ok
      return isAvailable.value
    } catch (e: any) {
      isAvailable.value = false
      lastError.value = e?.message || 'BioAgent no responde'
      return false
    }
  }

  /** POST /v1/handshake — emite token de sesión 1h ligado al origin. */
  async function handshake(): Promise<void> {
    try {
      const body = JSON.stringify({ origin: origin() })
      const r = await fetchAgent<{ token: string; expiresAt: string }>(
        '/v1/handshake',
        { method: 'POST', body },
        false,
      )
      _token = r.token
      _tokenExpiresAt = new Date(r.expiresAt)
      isHandshaken.value = true
      isAvailable.value = true
    } catch (e: any) {
      isHandshaken.value = false
      lastError.value = e?.message || 'Handshake con BioAgent falló'
      throw e
    }
  }

  /** GET /v1/devices */
  async function listDevices(): Promise<DeviceInfo[]> {
    return fetchAgent<DeviceInfo[]>('/v1/devices', { method: 'GET' })
  }

  /** POST /v1/capture — captura UNA huella con calidad mínima. */
  async function capture(
    finger: FingerName,
    minQuality = 60,
    timeoutSeconds = 15,
  ): Promise<CaptureResponse> {
    return fetchAgent<CaptureResponse>('/v1/capture', {
      method: 'POST',
      body: JSON.stringify({ finger, minQuality, timeoutSeconds }),
    })
  }

  /** POST /v1/enroll/workflow — inicia flujo 10 dedos. */
  async function startEnrollment(): Promise<EnrollFlowSnapshot> {
    return fetchAgent<EnrollFlowSnapshot>('/v1/enroll/workflow', { method: 'POST' })
  }

  /** GET /v1/enroll/{id}/status */
  async function getEnrollmentStatus(flowId: string): Promise<EnrollFlowSnapshot> {
    return fetchAgent<EnrollFlowSnapshot>(`/v1/enroll/${flowId}/status`, { method: 'GET' })
  }

  /** POST /v1/enroll/{id}/cancel */
  async function cancelEnrollment(flowId: string): Promise<EnrollFlowSnapshot> {
    return fetchAgent<EnrollFlowSnapshot>(`/v1/enroll/${flowId}/cancel`, { method: 'POST' })
  }

  /** POST /v1/enroll/{id}/capture-next — avanza al siguiente dedo. */
  async function captureNextFinger(
    flowId: string,
    minQuality = 60,
    maxAttempts = 3,
  ): Promise<{
    step: EnrollFlowStep
    snapshot: EnrollFlowSnapshot
    template_base64: string | null
  }> {
    return fetchAgent(`/v1/enroll/${flowId}/capture-next`, {
      method: 'POST',
      body: JSON.stringify({ minQuality, maxAttempts }),
    })
  }

  /**
   * WebSocket /v1/stream/{id} — feedback en vivo del flow.
   * Devuelve función de cleanup que cierra el socket.
   */
  function streamEnrollment(
    flowId: string,
    onEvent: (ev: EnrollEvent) => void,
    onClose?: () => void,
  ): () => void {
    if (!_token) {
      throw new Error('streamEnrollment requiere handshake previo')
    }
    const url =
      `ws://127.0.0.1:8400/v1/stream/${flowId}` +
      `?token=${encodeURIComponent(_token)}&origin=${encodeURIComponent(origin())}`
    const ws = new WebSocket(url)
    ws.onmessage = (e) => {
      try {
        onEvent(JSON.parse(e.data) as EnrollEvent)
      } catch {
        /* mensaje no-JSON, ignorar */
      }
    }
    ws.onclose = () => onClose?.()
    return () => {
      try { ws.close() } catch { /* noop */ }
    }
  }

  return {
    // Estado
    isAvailable: readonly(isAvailable),
    isHandshaken: readonly(isHandshaken),
    lastError: readonly(lastError),

    // Acciones
    checkHealth,
    handshake,
    listDevices,
    capture,
    startEnrollment,
    getEnrollmentStatus,
    cancelEnrollment,
    captureNextFinger,
    streamEnrollment,
  }
}

/** Etiqueta humana en español por finger code. */
export const FINGER_LABELS: Record<FingerName, string> = {
  right_thumb: 'Pulgar derecho',
  right_index: 'Índice derecho',
  right_middle: 'Medio derecho',
  right_ring: 'Anular derecho',
  right_pinky: 'Meñique derecho',
  left_thumb: 'Pulgar izquierdo',
  left_index: 'Índice izquierdo',
  left_middle: 'Medio izquierdo',
  left_ring: 'Anular izquierdo',
  left_pinky: 'Meñique izquierdo',
}
