<template>
  <div class="physical-profiles-page">
    <!-- Header Card -->
    <div class="card mb-5">
      <div class="card-body d-flex align-items-center justify-content-between">
        <div>
          <h1 class="fs-2x fw-bold text-gray-900 mb-0">Perfiles Físicos</h1>
          <p class="text-gray-600 fs-6 fw-semibold mb-0">
            Gestión de características físicas y biométricas de PPL
          </p>
        </div>
      </div>
    </div>

    <!-- Filters Card -->
    <div class="card mb-5">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Buscar PPL</label>
            <input
              v-model="filters.search"
              type="text"
              class="form-control"
              placeholder="Nombre, DPI o código..."
              @input="handleSearch"
            />
          </div>
          <div class="col-md-3">
            <label class="form-label">Centro</label>
            <select v-model="filters.center_id" class="form-select" @change="loadInmates">
              <option value="">Todos los centros</option>
              <option v-for="center in centers" :key="center?.id || 0" :value="center?.id">
                {{ center?.name }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Estado Biométrico</label>
            <select v-model="filters.biometric_status" class="form-select" @change="loadInmates">
              <option value="">Todos</option>
              <option value="complete">Completo</option>
              <option value="partial">Parcial</option>
              <option value="missing">Sin biometría</option>
            </select>
          </div>
          <div class="col-md-2 d-flex align-items-end">
            <button type="button" class="btn btn-light w-100" @click="resetFilters">
              <i class="fas fa-redo me-2"></i>
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row g-5 mb-5">
      <div class="col-xl-3">
        <div class="card bg-primary hoverable">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="svg-icon svg-icon-white svg-icon-3x me-5">
                <i class="fas fa-users fs-2x text-white"></i>
              </span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.total_inmates }}</div>
                <div class="fs-7">Total PPL</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-success hoverable">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="svg-icon svg-icon-white svg-icon-3x me-5">
                <i class="fas fa-fingerprint fs-2x text-white"></i>
              </span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.with_biometrics }}</div>
                <div class="fs-7">Con Biometría</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-warning hoverable">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="svg-icon svg-icon-white svg-icon-3x me-5">
                <i class="fas fa-camera fs-2x text-white"></i>
              </span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.with_photos }}</div>
                <div class="fs-7">Con Fotografías</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="card bg-danger hoverable">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="svg-icon svg-icon-white svg-icon-3x me-5">
                <i class="fas fa-exclamation-triangle fs-2x text-white"></i>
              </span>
              <div class="text-white">
                <div class="fs-2 fw-bold">{{ stats.incomplete }}</div>
                <div class="fs-7">Incompletos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="card">
      <div class="card-header border-0 pt-6">
        <div class="card-title">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold fs-3 mb-1">Listado de PPL</span>
          </h3>
        </div>
      </div>
      <div class="card-body pt-0">
        <div class="table-responsive">
          <table class="table align-middle table-row-dashed fs-6 gy-3">
            <thead>
              <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                <th>Foto</th>
                <th>PPL</th>
                <th>Ubicación</th>
                <th>Datos Físicos</th>
                <th>Estado Biométrico</th>
                <th>Última Actualización</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 fw-semibold">
              <tr v-for="inmate in arrInmates" :key="inmate.id">
                <td>
                  <div class="symbol symbol-50px">
                    <img
                      v-if="inmate.primary_photo"
                      :src="inmate.primary_photo"
                      :alt="inmate.full_name"
                      class="symbol-label"
                    />
                    <div v-else class="symbol-label bg-light-danger">
                      <i class="fas fa-user fs-2x text-danger"></i>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column">
                    <span class="text-gray-800 fw-bold">{{ inmate.full_name }}</span>
                    <span class="text-muted fs-7">{{ inmate.identification_number }}</span>
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column">
                    <span class="text-gray-800">{{ inmate.center_name }}</span>
                    <span class="text-muted fs-7">{{ inmate.sector_name }}</span>
                  </div>
                </td>
                <td>
                  <div v-if="inmate.physical_profile">
                    <span class="badge badge-light-primary me-1">
                      {{ inmate.physical_profile.height || '---' }} cm
                    </span>
                    <span class="badge badge-light-info">
                      {{ inmate.physical_profile.weight || '---' }} kg
                    </span>
                  </div>
                  <div v-else>
                    <span class="text-muted">Sin datos</span>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="me-3">
                      <span
                        class="badge"
                        :class="{
                          'badge-light-success': inmate.biometric_count >= 4,
                          'badge-light-warning': inmate.biometric_count > 0 && inmate.biometric_count < 4,
                          'badge-light-danger': inmate.biometric_count === 0
                        }"
                      >
                        <i class="fas fa-fingerprint me-1"></i>
                        {{ inmate.biometric_count || 0 }}/10
                      </span>
                    </div>
                    <div>
                      <span
                        class="badge"
                        :class="{
                          'badge-light-success': inmate.photo_count > 0,
                          'badge-light-danger': inmate.photo_count === 0
                        }"
                      >
                        <i class="fas fa-camera me-1"></i>
                        {{ inmate.photo_count || 0 }}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <span v-if="inmate.physical_profile?.updated_at" class="text-muted">
                    {{ formatDate(inmate.physical_profile.updated_at) }}
                  </span>
                  <span v-else class="text-muted">
                    Nunca
                  </span>
                </td>
                <td class="text-end">
                  <div class="d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      class="btn btn-icon btn-sm btn-light-primary"
                      data-bs-toggle="tooltip"
                      title="Ver Perfil"
                      @click="viewProfile(inmate.id)"
                    >
                      <KTIcon icon-name="eye" icon-class="fs-3" />
                    </button>
                    <button
                      type="button"
                      class="btn btn-icon btn-sm btn-light-warning"
                      data-bs-toggle="tooltip"
                      title="Editar Perfil"
                      @click="editProfile(inmate.id)"
                    >
                      <KTIcon icon-name="pencil" icon-class="fs-3" />
                    </button>
                    <button
                      type="button"
                      class="btn btn-icon btn-sm btn-light-info"
                      data-bs-toggle="tooltip"
                      title="Captura Biométrica"
                      @click="goBiometric(inmate.id)"
                    >
                      <i class="fas fa-fingerprint"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-icon btn-sm btn-light-success"
                      data-bs-toggle="tooltip"
                      title="Capturar Fotografía"
                      @click="goPhoto(inmate.id)"
                    >
                      <KTIcon icon-name="camera" icon-class="fs-3" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ApiService from '@/core/services/ApiService';
import { formatDate } from '@/core/helpers/formatters';
import { debounce } from 'lodash';
import KTIcon from '@/core/helpers/kt-icon/KTIcon.vue';
import Swal from 'sweetalert2';

const router = useRouter();

// State
const arrInmates = ref<any[]>([]);
const centers = ref<any[]>([]);
const loading = ref(false);

const filters = ref({
  search: '',
  center_id: '',
  biometric_status: ''
});

const stats = ref({
  total_inmates: 0,
  with_biometrics: 0,
  with_photos: 0,
  incomplete: 0
});

// Methods
const loadInmates = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      with_physical: 'true',
      with_biometrics: 'true',
      with_photos: 'true',
      ...Object.fromEntries(
        Object.entries(filters.value).filter(([_, v]) => v !== '')
      )
    });

    const response = await ApiService.get(`/inmates?${params.toString()}`);
    
    if (response.data && response.data.data) {
      // Handle paginated response
      const inmatesData = Array.isArray(response.data.data) 
        ? response.data.data 
        : (response.data.data.data || []);
        
      arrInmates.value = inmatesData.map((inmate: any) => ({
        id: inmate.id,
        full_name: `${inmate.first_name || ''} ${inmate.last_name || ''}`.trim() || 'Sin nombre',
        identification_number: inmate.document_number || 'Sin DPI',
        center_name: inmate.current_center?.name || 'Sin asignar',
        sector_name: inmate.current_sector?.name || 'Sin asignar',
        physical_profile: inmate.physical_profile || null,
        biometric_count: inmate.biometric_count || 0,
        photo_count: inmate.photo_count || 0,
        primary_photo: inmate.photos?.[0]?.photo_url || null
      }));
      
      // Update statistics
      updateStats();
    } else {
      arrInmates.value = [];
      updateStats();
    }
  } catch (error) {
    console.error('Error loading inmates:', error);
  } finally {
    loading.value = false;
  }
};

const loadCenters = async () => {
  try {
    const response = await ApiService.get('/catalogs/centers');
    if (response.data && response.data.data) {
      centers.value = response.data.data;
    } else {
      centers.value = [];
    }
  } catch (error) {
    console.error('Error loading centers:', error);
    centers.value = [];
  }
};

const updateStats = () => {
  stats.value.total_inmates = arrInmates.value.length;
  stats.value.with_biometrics = arrInmates.value.filter(i => i.biometric_count > 0).length;
  stats.value.with_photos = arrInmates.value.filter(i => i.photo_count > 0).length;
  stats.value.incomplete = arrInmates.value.filter(
    i => !i.physical_profile || i.biometric_count < 4 || i.photo_count === 0
  ).length;
};

const handleSearch = debounce(() => {
  loadInmates();
}, 500);

const resetFilters = () => {
  filters.value = {
    search: '',
    center_id: '',
    biometric_status: ''
  };
  loadInmates();
};

const viewProfile = (inmateId: number) => {
  router.push({
    name: 'security-physical-profile-detail',
    params: { inmateId }
  });
};

const editProfile = (inmateId: number) => {
  router.push({
    name: 'security-physical-profile-edit',
    params: { inmateId }
  });
};

const goBiometric = async (inmateId: number) => {
  try {
    // Mostrar opciones al usuario
    const result = await Swal.fire({
      title: 'Captura Biométrica',
      html: `
        <p>Seleccione cómo desea proceder:</p>
        <div class="d-grid gap-2 mt-4">
          <button id="btn-launch" class="btn btn-primary">
            <i class="fas fa-rocket me-2"></i>
            Lanzar BiometricService Directamente
          </button>
          <button id="btn-download" class="btn btn-secondary">
            <i class="fas fa-download me-2"></i>
            Descargar Archivo de Configuración
          </button>
        </div>
        <hr>
        <small class="text-muted">Asegúrese de tener el lector de huellas conectado</small>
      `,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: 'Cancelar',
      didOpen: () => {
        // Configurar eventos de los botones
        const btnLaunch = document.getElementById('btn-launch');
        const btnDownload = document.getElementById('btn-download');

        if (btnLaunch) {
          btnLaunch.addEventListener('click', () => {
            Swal.close();
            launchBiometricService(inmateId);
          });
        }

        if (btnDownload) {
          btnDownload.addEventListener('click', () => {
            Swal.close();
            downloadConfigFile(inmateId);
          });
        }
      }
    });
  } catch (error) {
    console.error('Error en captura biométrica:', error);
  }
};

// Función para lanzar el BiometricService directamente
const launchBiometricService = async (inmateId: number) => {
  try {
    // Mostrar loading
    Swal.fire({
      title: 'Preparando...',
      text: 'Generando protocolo para el BiometricService',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Obtener la URL del protocolo desde el backend
    const response = await ApiService.get(`/inmates/${inmateId}/biometric/protocol-url`);

    if (response.data.success) {
      const protocolUrl = response.data.data.protocol_url;
      const token = response.data.data.token;

      // Obtener session_id de la respuesta
      const sessionId = response.data.data.session_id;

      // Log para debugging
      console.log('Biometric Protocol Response:', {
        url: protocolUrl,
        sessionId: sessionId,
        token: token ? `${token.substring(0, 20)}...` : 'NO TOKEN',
        inmateId
      });

      // Cerrar el loading
      Swal.close();

      // Verificar que el token Y el session estén presentes
      // NOTA: Por seguridad, el protocolo usa 'session=' en vez de 'token='
      // El BiometricService intercambia el session_id por el token real
      if (!token || !sessionId || !protocolUrl.includes('session=')) {
        console.error('WARNING: Missing authentication data!', {
          hasToken: !!token,
          hasSession: !!sessionId,
          urlHasSession: protocolUrl.includes('session=')
        });

        const confirmResult = await Swal.fire({
          icon: 'warning',
          title: 'Posible problema de autenticación',
          text: 'Los datos de autenticación podrían no estar configurados correctamente. ¿Desea continuar de todos modos?',
          showCancelButton: true,
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar'
        });

        if (!confirmResult.isConfirmed) {
          return;
        }
      }

      // Abrir el protocolo (esto lanzará el BiometricService)
      window.location.href = protocolUrl;

      // Mostrar mensaje informativo
      setTimeout(() => {
        Swal.fire({
          icon: 'info',
          title: 'BiometricService Lanzado',
          html: `
            <div class="text-start">
              <p><strong>El sistema de captura biométrica se está abriendo...</strong></p>
              <ol>
                <li>Complete la captura de las 10 huellas dactilares</li>
                <li>Los datos se guardarán automáticamente</li>
                <li>Esta página se actualizará cuando termine</li>
              </ol>
            </div>
          `,
          confirmButtonText: 'Entendido',
          timer: 15000,
          timerProgressBar: true
        });
      }, 1500);

      // Iniciar polling para verificar cuando se complete
      startBiometricPolling(inmateId);
    } else {
      throw new Error('No se pudo generar la URL del protocolo');
    }
  } catch (error: any) {
    console.error('Error al lanzar BiometricService:', error);

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'No se pudo lanzar el sistema biométrico',
      footer: '<small>Verifique que el BiometricService esté instalado y configurado</small>'
    });
  }
};

// Función para descargar archivo de configuración
const downloadConfigFile = async (inmateId: number) => {
  try {
    // Mostrar loading
    Swal.fire({
      title: 'Generando archivo...',
      text: 'Preparando configuración para el BiometricService',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Obtener configuración desde el backend
    const response = await ApiService.get(`/inmates/${inmateId}/biometric/config-file`);

    if (response.data) {
      // Convertir a JSON string con formato
      const jsonContent = JSON.stringify(response.data, null, 2);

      // Crear blob y descargar
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `biometric_config_${inmateId}_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Cerrar loading
      Swal.close();

      // Mostrar instrucciones detalladas
      await Swal.fire({
        icon: 'success',
        title: 'Archivo de Configuración Descargado',
        html: `
          <div class="text-start">
            <p><strong>El archivo ha sido descargado exitosamente.</strong></p>
            <hr>
            <h6>Instrucciones:</h6>
            <ol>
              <li>Localice el archivo descargado: <code>biometric_config_${inmateId}_*.json</code></li>
              <li>Abra el BiometricService manualmente</li>
              <li>Use la opción "Importar Configuración" en el menú</li>
              <li>Seleccione el archivo JSON descargado</li>
              <li>Complete la captura de las 10 huellas dactilares</li>
              <li>Los datos se sincronizarán automáticamente al finalizar</li>
            </ol>
            <hr>
            <p class="text-muted small">
              <i class="fas fa-info-circle"></i>
              El archivo contiene el token de autenticación válido por 1 hora
            </p>
          </div>
        `,
        confirmButtonText: 'Entendido',
        width: 600
      });

      // También iniciar polling por si acaso
      startBiometricPolling(inmateId);
    } else {
      throw new Error('No se pudo generar el archivo de configuración');
    }
  } catch (error: any) {
    console.error('Error descargando configuración:', error);

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'No se pudo generar el archivo de configuración',
      footer: '<small>Por favor, intente nuevamente o contacte a soporte</small>'
    });
  }
};

// Polling para verificar el estado del enrollment
let pollingInterval: any = null;

const startBiometricPolling = (inmateId: number) => {
  // Verificar cada 5 segundos si se completó el enrollment
  pollingInterval = setInterval(async () => {
    try {
      const response = await ApiService.get(`/inmates/${inmateId}/biometric/enrollment-status`);

      if (response.data.success) {
        const status = response.data.data;

        // Si se completó o hay nuevas huellas
        if (status.is_complete || status.total_enrolled > 0) {
          stopBiometricPolling();

          // Recargar la tabla
          await loadInmates();

          // Mostrar notificación
          Swal.fire({
            icon: 'success',
            title: '¡Captura Completada!',
            html: `
              <p>Se han registrado ${status.total_enrolled} huellas dactilares.</p>
              ${status.is_complete
                ? '<p class="text-success">✓ Enrollment completo</p>'
                : '<p class="text-warning">Enrollment parcial</p>'}
            `,
            confirmButtonText: 'Excelente'
          });
        }
      }
    } catch (error) {
      console.error('Error verificando estado:', error);
    }
  }, 5000); // Cada 5 segundos

  // Detener después de 10 minutos
  setTimeout(() => {
    stopBiometricPolling();
  }, 600000);
};

const stopBiometricPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
};

const goPhoto = (inmateId: number) => {
  router.push({
    name: 'security-physical-profile-photo',
    params: { inmateId }
  });
};

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadCenters(),
    loadInmates()
  ]);
});
</script>

<style scoped>
.hoverable {
  transition: transform 0.2s;
  cursor: pointer;
}

.hoverable:hover {
  transform: translateY(-5px);
}

.symbol {
  display: inline-block;
  flex-shrink: 0;
  position: relative;
  border-radius: 0.475rem;
  overflow: hidden;
}

.symbol-50px {
  width: 50px;
  height: 50px;
}

.symbol-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-weight: 500;
  color: var(--bs-gray-700);
  background-color: var(--bs-gray-100);
}

.symbol img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
