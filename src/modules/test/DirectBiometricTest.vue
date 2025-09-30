<template>
  <div class="direct-biometric-test">
    <div class="d-flex justify-content-between align-items-center mb-5">
      <div>
        <h1 class="fs-2 fw-bold text-gray-900">Test Directo de Conexión Biométrica</h1>
        <p class="text-gray-600 fs-6 mt-1">
          Prueba directa usando el mismo método que funciona en test-fingerprint-device.html
        </p>
      </div>
    </div>

    <!-- Biometric capture now handled by Java service -->
    <div class="alert alert-info">
      <h4>Servicio Biométrico Java</h4>
      <p>La captura biométrica ahora se realiza mediante el servicio Java BiometricService.</p>
      <button class="btn btn-primary" @click="launchBiometricService">
        Lanzar Servicio de Captura
      </button>
    </div>

    <!-- Results -->
    <div v-if="capturedData" class="mt-5">
      <div class="alert alert-success">
        <h4>Huella Capturada Exitosamente</h4>
        <p>Dispositivo: {{ capturedData.device }}</p>
        <p>Calidad: {{ capturedData.quality }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { useJavaBiometric } from '@/composables/useJavaBiometric';

const capturedData = ref<any>(null);
const { launchBiometricVerification } = useJavaBiometric();

const launchBiometricService = async () => {
  try {
    await launchBiometricVerification();
  } catch (error) {
    console.error('Error launching biometric service:', error);
  }
};

const onFingerprintCaptured = (data: any) => {
  console.log('Fingerprint captured:', data);
  capturedData.value = data;
  
  Swal.fire({
    icon: 'success',
    title: 'Captura Exitosa',
    text: 'La huella dactilar se capturó correctamente'
  });
};

const onCaptureError = (error: string) => {
  console.error('Capture error:', error);
  
  Swal.fire({
    icon: 'error',
    title: 'Error de Captura',
    text: error
  });
};
</script>