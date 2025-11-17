<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <h3>{{ $t('operations.releases.detail.title') }}</h3>
        <p class="text-muted">{{ $t('operations.releases.detail.subtitle') }}</p>
      </div>
      <div class="card-toolbar">
        <router-link 
          :to="{ name: 'operations-releases' }"
          class="btn btn-light-primary btn-sm me-2"
        >
          <i class="fas fa-arrow-left me-2"></i>
          Volver al listado
        </router-link>
        <button 
          v-if="canPrint"
          @click="printRelease"
          class="btn btn-light-success btn-sm"
        >
          <i class="fas fa-print me-2"></i>
          Imprimir
        </button>
      </div>
    </div>

    <div class="card-body">
      <div v-if="loading" class="text-center py-10">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <div v-else-if="release">
        <!-- Release Status Alert -->
        <div v-if="release.status === 'in_process'" class="alert alert-warning d-flex align-items-center mb-6">
          <i class="fas fa-spinner fa-2x me-3"></i>
          <div>
            <h5 class="mb-1">Liberación en Proceso</h5>
            <p class="mb-0">El proceso de liberación está actualmente en ejecución.</p>
          </div>
        </div>
        <div v-else-if="release.status === 'completed'" class="alert alert-success d-flex align-items-center mb-6">
          <i class="fas fa-check-circle fa-2x me-3"></i>
          <div>
            <h5 class="mb-1">Liberación Completada</h5>
            <p class="mb-0">El PPL fue liberado exitosamente el {{ formatDate(release.completion_date) }}.</p>
          </div>
        </div>

        <!-- Release Information -->
        <div class="row mb-8">
          <div class="col-md-6">
            <h5 class="mb-4">Información del PPL</h5>
            <table class="table table-flush">
              <tbody>
                <tr>
                  <td class="text-muted">Nombre Completo:</td>
                  <td class="fw-bold">{{ release.inmate.full_name }}</td>
                </tr>
                <tr>
                  <td class="text-muted">DPI:</td>
                  <td class="fw-bold">{{ release.inmate.document_number }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Código PPL:</td>
                  <td class="fw-bold">{{ release.inmate.code }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Fecha de Ingreso:</td>
                  <td>{{ formatDate(release.inmate.admission_date) }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Tiempo en Prisión:</td>
                  <td class="fw-bold">{{ release.prison_time }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Centro:</td>
                  <td>{{ release.center.name }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="col-md-6">
            <h5 class="mb-4">Detalles de la Liberación</h5>
            <table class="table table-flush">
              <tbody>
                <tr>
                  <td class="text-muted">Tipo de Liberación:</td>
                  <td>
                    <span class="badge" :class="getReleaseTypeBadgeClass(release.release_type)">
                      {{ formatReleaseType(release.release_type) }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted">Estado:</td>
                  <td>
                    <span class="badge" :class="getStatusBadgeClass(release.status)">
                      {{ formatStatus(release.status) }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted">Fecha Programada:</td>
                  <td class="fw-bold">{{ formatDate(release.scheduled_date) }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Hora Programada:</td>
                  <td class="fw-bold">{{ formatTime(release.scheduled_time) }}</td>
                </tr>
                <tr v-if="release.completion_date">
                  <td class="text-muted">Fecha de Liberación:</td>
                  <td class="fw-bold text-success">{{ formatDate(release.completion_date) }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Procesado por:</td>
                  <td>{{ release.processed_by?.name || 'Por asignar' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Process Steps -->
        <div class="separator my-8"></div>
        <h5 class="mb-5">Proceso de Liberación</h5>
        
        <div class="row mb-8">
          <div class="col-md-12">
            <div class="d-flex align-items-center mb-5">
              <div class="progress flex-grow-1 h-10px">
                <div 
                  class="progress-bar bg-primary"
                  :style="`width: ${release.completion_percentage}%`"
                ></div>
              </div>
              <span class="ms-3 fw-bold">{{ release.completion_percentage }}%</span>
            </div>
            
            <div class="row">
              <div 
                v-for="(step, index) in release.process_steps" 
                :key="index"
                class="col-md-3 mb-4"
              >
                <div 
                  class="card border-2"
                  :class="{
                    'border-success bg-light-success': step.completed,
                    'border-primary bg-light-primary': step.current,
                    'border-gray-300': !step.completed && !step.current
                  }"
                >
                  <div class="card-body text-center">
                    <i 
                      :class="step.icon"
                      class="fa-2x mb-3"
                      :style="{
                        color: step.completed ? '#50CD89' : (step.current ? '#009ef7' : '#a1a5b7')
                      }"
                    ></i>
                    <h6 class="mb-1">{{ step.name }}</h6>
                    <p class="text-muted fs-7 mb-0">{{ step.description }}</p>
                    <div v-if="step.completed_at" class="mt-2">
                      <span class="badge badge-light-success">
                        {{ formatDateTime(step.completed_at) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Documents Section -->
        <div class="separator my-8"></div>
        <h5 class="mb-5">Documentación</h5>
        
        <div class="row mb-8">
          <div class="col-md-12">
            <div class="table-responsive">
              <table class="table table-rounded table-striped border gy-7 gs-7">
                <thead>
                  <tr class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200">
                    <th>Documento</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Responsable</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="doc in release.documents" :key="doc.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <i class="fas fa-file-pdf text-danger me-3"></i>
                        <div>
                          <p class="mb-0 fw-semibold">{{ doc.name }}</p>
                          <p class="mb-0 text-muted fs-7">{{ doc.description }}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span 
                        class="badge"
                        :class="doc.status === 'approved' ? 'badge-light-success' : 'badge-light-warning'"
                      >
                        {{ doc.status === 'approved' ? 'Aprobado' : 'Pendiente' }}
                      </span>
                    </td>
                    <td>{{ formatDate(doc.date) }}</td>
                    <td>{{ doc.responsible }}</td>
                    <td>
                      <button 
                        v-if="doc.file_url"
                        @click="viewDocument(doc)"
                        class="btn btn-light btn-sm"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Activity Log -->
        <div class="separator my-8"></div>
        <h5 class="mb-5">Registro de Actividades</h5>
        
        <div class="timeline">
          <div 
            v-for="(activity, index) in release.activity_log" 
            :key="index"
            class="timeline-item"
          >
            <div class="timeline-line"></div>
            <div class="timeline-icon">
              <i 
                class="fas fa-circle"
                :class="getActivityIconClass(activity.type)"
              ></i>
            </div>
            <div class="timeline-content mb-10 mt-n1">
              <div class="pe-3 mb-5">
                <div class="fs-5 fw-semibold mb-2">{{ activity.title }}</div>
                <div class="text-muted fs-7">
                  {{ formatDateTime(activity.datetime) }} - {{ activity.user }}
                </div>
                <div class="mt-2 fs-6">{{ activity.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex justify-content-end mt-10">
          <button 
            v-if="canProcess && release.status === 'scheduled'"
            @click="startProcess"
            class="btn btn-primary me-2"
          >
            <i class="fas fa-play me-2"></i>
            Iniciar Proceso
          </button>
          <button 
            v-if="canProcess && release.status === 'in_process'"
            @click="continueProcess"
            class="btn btn-warning me-2"
          >
            <i class="fas fa-forward me-2"></i>
            Continuar Proceso
          </button>
          <button 
            v-if="canComplete && release.status === 'in_process'"
            @click="completeRelease"
            class="btn btn-success"
          >
            <i class="fas fa-check me-2"></i>
            Completar Liberación
          </button>
        </div>
      </div>

      <div v-else class="text-center py-10">
        <p class="text-muted">No se encontró la información de la liberación.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Data
const loading = ref(false)
const release = ref<any>(null)

// Computed
const canPrint = computed(() => {
  return release.value && ['completed', 'in_process'].includes(release.value.status)
})

const canProcess = computed(() => {
  return authStore.hasPermission('operations.releases_process')
})

const canComplete = computed(() => {
  return authStore.hasPermission('operations.releases_complete')
})

// Methods
const loadRelease = async () => {
  loading.value = true
  try {
    // TODO: Implement API call
    // Mock data for now
    release.value = {
      id: route.params.id,
      inmate: {
        full_name: 'Juan Pérez García',
        document_number: '1234567890101',
        code: 'PPL-2024-001',
        admission_date: '2022-01-15'
      },
      center: { name: 'Centro Preventivo Zona 18' },
      release_type: 'sentence_completion',
      status: 'in_process',
      scheduled_date: '2024-01-16',
      scheduled_time: '08:00:00',
      completion_date: null,
      prison_time: '2 años, 0 meses',
      processed_by: { name: 'María López' },
      completion_percentage: 60,
      process_steps: [
        {
          name: 'Verificación Legal',
          description: 'Revisión de documentos',
          icon: 'fas fa-gavel',
          completed: true,
          completed_at: '2024-01-15 09:00:00'
        },
        {
          name: 'Evaluación Final',
          description: 'Evaluaciones finales',
          icon: 'fas fa-clipboard-check',
          completed: true,
          completed_at: '2024-01-15 11:00:00'
        },
        {
          name: 'Preparación',
          description: 'Preparar documentos',
          icon: 'fas fa-file-signature',
          completed: false,
          current: true
        },
        {
          name: 'Liberación',
          description: 'Proceso final',
          icon: 'fas fa-door-open',
          completed: false,
          current: false
        }
      ],
      documents: [
        {
          id: 1,
          name: 'Orden de Liberación',
          description: 'Orden judicial de liberación',
          status: 'approved',
          date: '2024-01-14',
          responsible: 'Juzgado 5to',
          file_url: 'order.pdf'
        },
        {
          id: 2,
          name: 'Certificado de Conducta',
          description: 'Certificado del departamento de rehabilitación',
          status: 'approved',
          date: '2024-01-15',
          responsible: 'Rehabilitación',
          file_url: 'certificate.pdf'
        },
        {
          id: 3,
          name: 'Constancia de No Deudas',
          description: 'Verificación de pagos y multas',
          status: 'pending',
          date: null,
          responsible: 'Administración',
          file_url: null
        }
      ],
      activity_log: [
        {
          type: 'created',
          title: 'Proceso de liberación iniciado',
          datetime: '2024-01-15 08:00:00',
          user: 'Sistema',
          description: 'Se inició el proceso de liberación programada'
        },
        {
          type: 'document',
          title: 'Documento recibido',
          datetime: '2024-01-15 09:30:00',
          user: 'María López',
          description: 'Se recibió y aprobó la orden de liberación'
        },
        {
          type: 'step',
          title: 'Verificación legal completada',
          datetime: '2024-01-15 11:00:00',
          user: 'Depto. Legal',
          description: 'Se completó la verificación de documentos legales'
        },
        {
          type: 'note',
          title: 'Nota agregada',
          datetime: '2024-01-15 14:00:00',
          user: 'Juan Martínez',
          description: 'PPL listo para evaluación psicológica final'
        }
      ]
    }
  } catch (error) {
    console.error('Error loading release:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar la información de la liberación'
    })
  } finally {
    loading.value = false
  }
}

const printRelease = async () => {
  try {
    // TODO: Implement print functionality
    await Swal.fire({
      icon: 'info',
      title: 'Imprimiendo',
      text: 'Generando documento de liberación...'
    })
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo imprimir el documento'
    })
  }
}

const viewDocument = (doc: any) => {
  // TODO: Implement document viewer
  window.open(doc.file_url, '_blank')
}

const startProcess = async () => {
  const result = await Swal.fire({
    title: 'Iniciar proceso de liberación',
    text: '¿Desea iniciar el proceso de liberación?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, iniciar',
    cancelButtonText: 'Cancelar'
  })
  
  if (result.isConfirmed) {
    try {
      // TODO: Implement API call
      await Swal.fire({
        icon: 'success',
        title: 'Proceso iniciado',
        text: 'El proceso de liberación ha sido iniciado'
      })
      loadRelease()
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo iniciar el proceso'
      })
    }
  }
}

const continueProcess = () => {
  // TODO: Navigate to process continuation
  router.push({ 
    name: 'operations-release-process', 
    params: { id: release.value.id } 
  })
}

const completeRelease = async () => {
  const result = await Swal.fire({
    title: 'Completar liberación',
    text: '¿Confirma que el proceso de liberación ha sido completado?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, completar',
    cancelButtonText: 'Cancelar'
  })
  
  if (result.isConfirmed) {
    try {
      // TODO: Implement API call
      await Swal.fire({
        icon: 'success',
        title: 'Liberación completada',
        text: 'El PPL ha sido liberado exitosamente'
      })
      loadRelease()
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo completar la liberación'
      })
    }
  }
}

// Formatting methods
const formatReleaseType = (type: string) => {
  const types: Record<string, string> = {
    'sentence_completion': 'Cumplimiento de Condena',
    'parole': 'Libertad Condicional',
    'bail': 'Fianza',
    'court_order': 'Orden Judicial',
    'amnesty': 'Amnistía'
  }
  return types[type] || type
}

const formatStatus = (status: string) => {
  const statuses: Record<string, string> = {
    'scheduled': 'Programado',
    'in_process': 'En Proceso',
    'completed': 'Completado',
    'cancelled': 'Cancelado'
  }
  return statuses[status] || status
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-GT')
}

const formatTime = (time: string) => {
  if (!time) return 'N/A'
  return new Date(`2000-01-01 ${time}`).toLocaleTimeString('es-GT', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatDateTime = (datetime: string) => {
  if (!datetime) return 'N/A'
  return new Date(datetime).toLocaleString('es-GT')
}

const getReleaseTypeBadgeClass = (type: string) => {
  const classes: Record<string, string> = {
    'sentence_completion': 'badge-light-success',
    'parole': 'badge-light-warning',
    'bail': 'badge-light-info',
    'court_order': 'badge-light-primary',
    'amnesty': 'badge-light-secondary'
  }
  return classes[type] || 'badge-light-secondary'
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'scheduled': 'badge-light-warning',
    'in_process': 'badge-light-primary',
    'completed': 'badge-light-success',
    'cancelled': 'badge-light-danger'
  }
  return classes[status] || 'badge-light-secondary'
}

const getActivityIconClass = (type: string) => {
  const classes: Record<string, string> = {
    'created': 'text-primary',
    'document': 'text-success',
    'step': 'text-info',
    'note': 'text-warning',
    'completed': 'text-success',
    'error': 'text-danger'
  }
  return classes[type] || 'text-secondary'
}

// Lifecycle
onMounted(() => {
  loadRelease()
})
</script>