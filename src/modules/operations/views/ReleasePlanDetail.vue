<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <h3>{{ $t('operations.releases.planning.detail.title') }}</h3>
        <p class="text-muted">{{ $t('operations.releases.planning.detail.subtitle') }}</p>
      </div>
      <div class="card-toolbar">
        <router-link 
          :to="{ name: 'operations-release-plans' }"
          class="btn btn-light-primary btn-sm"
        >
          <i class="fas fa-arrow-left me-2"></i>
          Volver a planificación
        </router-link>
      </div>
    </div>

    <div class="card-body">
      <div v-if="loading" class="text-center py-10">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <div v-else-if="releasePlan">
        <!-- Release Plan Header -->
        <div class="row mb-8">
          <div class="col-md-8">
            <h5 class="mb-4">Información del Plan de Liberación</h5>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="fw-semibold text-muted">PPL:</label>
                <p class="fw-bold">{{ releasePlan.inmate.full_name }}</p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="fw-semibold text-muted">DPI:</label>
                <p class="fw-bold">{{ releasePlan.inmate.document_number }}</p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="fw-semibold text-muted">Fecha Programada:</label>
                <p class="fw-bold">{{ formatDate(releasePlan.release_date) }}</p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="fw-semibold text-muted">Tipo de Liberación:</label>
                <p>
                  <span class="badge" :class="getReleaseTypeBadgeClass(releasePlan.release_type)">
                    {{ formatReleaseType(releasePlan.release_type) }}
                  </span>
                </p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="fw-semibold text-muted">Centro:</label>
                <p>{{ releasePlan.center.name }}</p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="fw-semibold text-muted">Días Restantes:</label>
                <p class="fw-bold" :class="getDaysRemainingClass(releasePlan.days_remaining)">
                  {{ releasePlan.days_remaining }} días
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <h5 class="mb-4">Estado General</h5>
            <div class="text-center">
              <div class="mb-4">
                <div class="d-inline-block position-relative">
                  <div class="progress-circle" :data-percentage="releasePlan.overall_progress">
                    <svg class="progress-svg">
                      <circle
                        class="progress-circle-back"
                        cx="60"
                        cy="60"
                        r="50"
                      ></circle>
                      <circle
                        class="progress-circle-prog"
                        cx="60"
                        cy="60"
                        r="50"
                        :style="`stroke-dashoffset: ${314 - (314 * releasePlan.overall_progress) / 100}`"
                      ></circle>
                    </svg>
                    <div class="progress-text">
                      <span class="fs-2 fw-bold">{{ releasePlan.overall_progress }}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-muted">Progreso General</p>
            </div>
          </div>
        </div>

        <!-- Requirements Checklist -->
        <div class="separator my-8"></div>
        <h5 class="mb-5">Lista de Requisitos</h5>
        
        <div class="row">
          <!-- Documents -->
          <div class="col-md-6 mb-6">
            <div class="card bg-light">
              <div class="card-header">
                <h6 class="card-title mb-0">
                  <i class="fas fa-file-alt me-2"></i>
                  Documentos Requeridos
                </h6>
              </div>
              <div class="card-body">
                <div 
                  v-for="doc in releasePlan.required_documents" 
                  :key="doc.id"
                  class="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom"
                >
                  <div class="d-flex align-items-center">
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        :checked="doc.completed"
                        @change="toggleDocument(doc)"
                      >
                    </div>
                    <div class="ms-3">
                      <p class="mb-0 fw-semibold">{{ doc.name }}</p>
                      <p class="mb-0 text-muted fs-7">{{ doc.description }}</p>
                    </div>
                  </div>
                  <div>
                    <button 
                      v-if="doc.file_url"
                      @click="viewDocument(doc)"
                      class="btn btn-light-primary btn-sm"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button 
                      v-else
                      @click="uploadDocument(doc)"
                      class="btn btn-light-warning btn-sm"
                    >
                      <i class="fas fa-upload"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Procedures -->
          <div class="col-md-6 mb-6">
            <div class="card bg-light">
              <div class="card-header">
                <h6 class="card-title mb-0">
                  <i class="fas fa-tasks me-2"></i>
                  Procedimientos Pendientes
                </h6>
              </div>
              <div class="card-body">
                <div 
                  v-for="proc in releasePlan.procedures" 
                  :key="proc.id"
                  class="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom"
                >
                  <div class="d-flex align-items-center">
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        :checked="proc.completed"
                        @change="toggleProcedure(proc)"
                      >
                    </div>
                    <div class="ms-3">
                      <p class="mb-0 fw-semibold">{{ proc.name }}</p>
                      <p class="mb-0 text-muted fs-7">
                        Responsable: {{ proc.responsible || 'Por asignar' }}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span 
                      class="badge"
                      :class="proc.completed ? 'badge-light-success' : 'badge-light-warning'"
                    >
                      {{ proc.completed ? 'Completado' : 'Pendiente' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="separator my-8"></div>
        <h5 class="mb-5">Línea de Tiempo</h5>
        
        <div class="timeline">
          <div 
            v-for="(event, index) in releasePlan.timeline" 
            :key="index"
            class="timeline-item"
          >
            <div class="timeline-line"></div>
            <div class="timeline-icon">
              <i 
                class="fas fa-circle"
                :class="{
                  'text-success': event.completed,
                  'text-primary': event.current,
                  'text-gray-300': !event.completed && !event.current
                }"
              ></i>
            </div>
            <div class="timeline-content mb-10 mt-n1">
              <div class="pe-3 mb-5">
                <div class="fs-5 fw-semibold mb-2">{{ event.title }}</div>
                <div class="text-muted fs-7">
                  {{ formatDate(event.date) }} - {{ event.responsible }}
                </div>
                <div class="mt-2 fs-6">{{ event.description }}</div>
                <div v-if="event.notes" class="mt-2">
                  <span class="badge badge-light-info">{{ event.notes }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex justify-content-end mt-10">
          <button 
            @click="saveProgress"
            class="btn btn-primary me-2"
          >
            <i class="fas fa-save me-2"></i>
            Guardar Progreso
          </button>
          <button 
            v-if="canApprove"
            @click="approvePlan"
            class="btn btn-success"
            :disabled="releasePlan.overall_progress < 100"
          >
            <i class="fas fa-check me-2"></i>
            Aprobar Plan
          </button>
        </div>
      </div>

      <div v-else class="text-center py-10">
        <p class="text-muted">No se encontró la información del plan de liberación.</p>
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
const releasePlan = ref<any>(null)

// Computed
const canApprove = computed(() => {
  return authStore.hasPermission('operations.releases_approve')
})

// Methods
const loadReleasePlan = async () => {
  loading.value = true
  try {
    // TODO: Implement API call
    // Mock data for now
    releasePlan.value = {
      id: route.params.id,
      inmate: {
        full_name: 'Juan Pérez García',
        document_number: '1234567890101'
      },
      release_date: '2024-01-20',
      release_type: 'sentence_completion',
      center: { name: 'Centro Preventivo Zona 18' },
      days_remaining: 4,
      overall_progress: 75,
      required_documents: [
        {
          id: 1,
          name: 'Orden de liberación',
          description: 'Orden judicial de liberación',
          completed: true,
          file_url: 'order.pdf'
        },
        {
          id: 2,
          name: 'Certificado de conducta',
          description: 'Certificado del departamento de rehabilitación',
          completed: true,
          file_url: 'certificate.pdf'
        },
        {
          id: 3,
          name: 'Constancia de no deudas',
          description: 'Verificación de pagos y multas',
          completed: false,
          file_url: null
        },
        {
          id: 4,
          name: 'Evaluación psicológica',
          description: 'Informe final del departamento de psicología',
          completed: false,
          file_url: null
        }
      ],
      procedures: [
        {
          id: 1,
          name: 'Notificación a familiares',
          responsible: 'Trabajo Social',
          completed: true
        },
        {
          id: 2,
          name: 'Coordinación de transporte',
          responsible: 'Seguridad',
          completed: false
        },
        {
          id: 3,
          name: 'Devolución de pertenencias',
          responsible: 'Almacén',
          completed: false
        },
        {
          id: 4,
          name: 'Cierre de expediente',
          responsible: 'Administración',
          completed: false
        }
      ],
      timeline: [
        {
          title: 'Inicio del proceso',
          date: '2024-01-10',
          responsible: 'Sistema',
          description: 'Se inició el proceso de planificación de liberación',
          completed: true
        },
        {
          title: 'Revisión legal',
          date: '2024-01-12',
          responsible: 'Departamento Legal',
          description: 'Verificación de cumplimiento de sentencia',
          completed: true
        },
        {
          title: 'Evaluación de conducta',
          date: '2024-01-15',
          responsible: 'Rehabilitación',
          description: 'Evaluación final de comportamiento',
          completed: true,
          notes: 'Conducta ejemplar'
        },
        {
          title: 'Preparación de documentos',
          date: '2024-01-18',
          responsible: 'Administración',
          description: 'Recopilación y preparación de documentación',
          current: true
        },
        {
          title: 'Liberación',
          date: '2024-01-20',
          responsible: 'Seguridad',
          description: 'Proceso de liberación',
          completed: false
        }
      ]
    }
  } catch (error) {
    console.error('Error loading release plan:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar el plan de liberación'
    })
  } finally {
    loading.value = false
  }
}

const toggleDocument = async (doc: any) => {
  doc.completed = !doc.completed
  // TODO: Update in backend
}

const toggleProcedure = async (proc: any) => {
  proc.completed = !proc.completed
  // TODO: Update in backend
}

const viewDocument = async (doc: any) => {
  // TODO: Implement document viewer
  window.open(doc.file_url, '_blank')
}

const uploadDocument = async (doc: any) => {
  // TODO: Implement file upload
  await Swal.fire({
    title: 'Cargar Documento',
    text: `Cargar ${doc.name}`,
    input: 'file',
    showCancelButton: true,
    confirmButtonText: 'Cargar',
    cancelButtonText: 'Cancelar'
  })
}

const saveProgress = async () => {
  try {
    // TODO: Implement save functionality
    await Swal.fire({
      icon: 'success',
      title: 'Guardado',
      text: 'El progreso ha sido guardado exitosamente'
    })
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo guardar el progreso'
    })
  }
}

const approvePlan = async () => {
  const result = await Swal.fire({
    title: '¿Aprobar plan de liberación?',
    text: 'Una vez aprobado, el proceso de liberación será iniciado',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, aprobar',
    cancelButtonText: 'Cancelar'
  })
  
  if (result.isConfirmed) {
    try {
      // TODO: Implement approval
      await Swal.fire({
        icon: 'success',
        title: 'Plan aprobado',
        text: 'El plan de liberación ha sido aprobado exitosamente'
      })
      router.push({ name: 'operations-release-plans' })
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo aprobar el plan'
      })
    }
  }
}

// Formatting methods
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-GT')
}

const formatReleaseType = (type: string) => {
  const types: Record<string, string> = {
    'sentence_completion': 'Cumplimiento de Condena',
    'parole': 'Libertad Condicional',
    'bail': 'Fianza',
    'court_order': 'Orden Judicial',
    'amnesty': 'Amnistía',
    'transfer': 'Traslado'
  }
  return types[type] || type
}

const getReleaseTypeBadgeClass = (type: string) => {
  const classes: Record<string, string> = {
    'sentence_completion': 'badge-light-success',
    'parole': 'badge-light-warning',
    'bail': 'badge-light-info',
    'court_order': 'badge-light-primary',
    'amnesty': 'badge-light-secondary',
    'transfer': 'badge-light-dark'
  }
  return classes[type] || 'badge-light-secondary'
}

const getDaysRemainingClass = (days: number) => {
  if (days <= 3) return 'text-danger'
  if (days <= 7) return 'text-warning'
  return 'text-success'
}

// Lifecycle
onMounted(() => {
  loadReleasePlan()
})
</script>

<style scoped>
.progress-circle {
  width: 120px;
  height: 120px;
  position: relative;
}

.progress-svg {
  width: 120px;
  height: 120px;
  transform: rotate(-90deg);
}

.progress-circle-back {
  fill: none;
  stroke: #e4e6ef;
  stroke-width: 10;
}

.progress-circle-prog {
  fill: none;
  stroke: #009ef7;
  stroke-width: 10;
  stroke-dasharray: 314;
  stroke-dashoffset: 314;
  transition: stroke-dashoffset 0.6s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
</style>