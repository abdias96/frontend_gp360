<template>
  <div class="direct-biometric-test">
    <div class="d-flex justify-content-between align-items-center mb-5">
      <div>
        <h1 class="fs-2 fw-bold text-gray-900">Prueba de conexión — Agente biométrico .NET</h1>
        <p class="text-gray-600 fs-6 mt-1">
          Verifica el handshake y una captura contra el BioAgent (loopback 127.0.0.1:8400).
        </p>
      </div>
    </div>

    <div class="alert" :class="agentReady ? 'alert-success' : 'alert-warning'">
      <h4 class="mb-1">Agente BioAgent (.NET)</h4>
      <p class="mb-3">
        Estado:
        <strong>{{ agentReady ? 'conectado' : (bio.lastError.value || 'sin verificar') }}</strong>
      </p>
      <div class="d-flex gap-2">
        <button class="btn btn-light-primary" :disabled="busy" @click="testConnection">
          <span v-if="busy && phase === 'health'" class="spinner-border spinner-border-sm me-1"></span>
          Probar conexión
        </button>
        <button class="btn btn-primary" :disabled="busy || !agentReady" @click="testCapture">
          <span v-if="busy && phase === 'capture'" class="spinner-border spinner-border-sm me-1"></span>
          Capturar huella de prueba
        </button>
      </div>
    </div>

    <!-- Resultado -->
    <div v-if="capturedData" class="mt-5">
      <div class="alert alert-success">
        <h4>Huella capturada exitosamente</h4>
        <p class="mb-1">Dedo: {{ capturedData.finger }}</p>
        <p class="mb-1">Calidad: {{ capturedData.quality }}%</p>
        <p class="mb-0">Lector: {{ capturedData.device }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Swal from 'sweetalert2'
import { useBioAgent } from '@/composables/useBioAgent'

const bio = useBioAgent()
const busy = ref(false)
const phase = ref<'idle' | 'health' | 'capture'>('idle')
const capturedData = ref<{ finger: string; quality: number; device: string } | null>(null)

const agentReady = computed(() => bio.isAvailable.value)

const testConnection = async () => {
  busy.value = true
  phase.value = 'health'
  try {
    const ok = await bio.checkHealth()
    if (ok) await bio.handshake()
  } finally {
    busy.value = false
    phase.value = 'idle'
  }
}

const testCapture = async () => {
  busy.value = true
  phase.value = 'capture'
  capturedData.value = null
  try {
    const cap = await bio.capture('right_index', 60, 20)
    capturedData.value = {
      finger: cap.finger,
      quality: cap.quality,
      device: cap.deviceSerial,
    }
    Swal.fire({ icon: 'success', title: 'Captura exitosa', timer: 1800, showConfirmButton: false })
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error de captura',
      text: error?.message || 'No se pudo capturar la huella',
    })
  } finally {
    busy.value = false
    phase.value = 'idle'
  }
}
</script>
