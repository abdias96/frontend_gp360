<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <h3>{{ $t('operations.admissions.detail.title') }}</h3>
        <p class="text-muted">{{ $t('operations.admissions.detail.subtitle') }}</p>
      </div>
      <div class="card-toolbar">
        <router-link 
          :to="{ name: 'operations-admissions' }"
          class="btn btn-light-primary btn-sm"
        >
          <i class="fas fa-arrow-left me-2"></i>
          Volver al listado
        </router-link>
      </div>
    </div>

    <div class="card-body">
      <div v-if="loading" class="text-center py-10">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <div v-else-if="admission">
        <!-- Admission Info Header -->
        <div class="row mb-7">
          <div class="col-md-8">
            <h5 class="mb-4">Información de la Admisión</h5>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="fw-semibold text-muted">PPL:</label>
                <p class="fw-bold">{{ admission.inmate?.full_name }}</p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="fw-semibold text-muted">DPI:</label>
                <p class="fw-bold">{{ admission.inmate?.document_number }}</p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="fw-semibold text-muted">Tipo de Admisión:</label>
                <p>
                  <span class="badge badge-light-primary">
                    {{ formatAdmissionType(admission.admission_type) }}
                  </span>
                </p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="fw-semibold text-muted">Estado:</label>
                <p>
                  <span class="badge" :class="getStatusBadgeClass(admission.status)">
                    {{ formatStatus(admission.status) }}
                  </span>
                </p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="fw-semibold text-muted">Fecha de Admisión:</label>
                <p class="fw-bold">{{ formatDate(admission.admission_date) }}</p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="fw-semibold text-muted">Hora de Admisión:</label>
                <p class="fw-bold">{{ formatTime(admission.admission_time) }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <h5 class="mb-4">Progreso del Proceso</h5>
            <div class="d-flex flex-column">
              <div class="d-flex align-items-center mb-3">
                <div class="progress flex-grow-1 h-10px">
                  <div 
                    class="progress-bar" 
                    :class="getProgressBarClass(admission.completion_percentage)"
                    :style="`width: ${admission.completion_percentage}%`"
                  ></div>
                </div>
                <span class="ms-3 fw-bold">{{ admission.completion_percentage }}%</span>
              </div>
              <p class="text-muted">
                {{ admission.completed_steps }} de {{ admission.total_steps }} pasos completados
              </p>
            </div>
          </div>
        </div>

        <!-- Process Steps -->
        <div class="separator my-8"></div>
        <h5 class="mb-5">Pasos del Proceso</h5>
        
        <div class="timeline">
          <div 
            v-for="(step, index) in processSteps" 
            :key="index"
            class="timeline-item"
          >
            <div class="timeline-line"></div>
            <div class="timeline-icon">
              <i 
                class="fas fa-circle"
                :class="{
                  'text-success': step.completed,
                  'text-primary': step.current,
                  'text-gray-300': !step.completed && !step.current
                }"
              ></i>
            </div>
            <div class="timeline-content mb-10 mt-n1">
              <div class="pe-3 mb-5">
                <div class="fs-5 fw-semibold mb-2">{{ step.name }}</div>
                <div class="d-flex align-items-center mt-1 fs-6">
                  <div class="text-muted me-2 fs-7">
                    {{ step.description }}
                  </div>
                </div>
                <div v-if="step.completed_at" class="text-muted fs-7 mt-2">
                  Completado: {{ formatDateTime(step.completed_at) }}
                </div>
                <div v-if="step.completed_by" class="text-muted fs-7">
                  Por: {{ step.completed_by }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex justify-content-end mt-10">
          <button 
            v-if="canEdit && admission.status === 'in_progress'"
            @click="continueProcess"
            class="btn btn-primary"
          >
            <i class="fas fa-play me-2"></i>
            Continuar Proceso
          </button>
          <button 
            v-if="canEdit && ['pending', 'in_progress'].includes(admission.status)"
            @click="cancelAdmission"
            class="btn btn-danger ms-3"
          >
            <i class="fas fa-times me-2"></i>
            Cancelar Admisión
          </button>
        </div>
      </div>

      <div v-else class="text-center py-10">
        <p class="text-muted">No se encontró la información de la admisión.</p>
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
const admission = ref<any>(null)
const processSteps = ref<any[]>([])

// Computed
const canEdit = computed(() => {
  return authStore.hasPermission('operations.admissions.edit')
})

// Methods
const loadAdmission = async () => {
  loading.value = true
  try {
    // TODO: Implement API call
    // const response = await api.getAdmission(route.params.id)
    // admission.value = response.data
    
    // Mock data for now
    admission.value = {
      id: route.params.id,
      inmate: {
        full_name: 'Juan Pérez García',
        document_number: '1234567890101'
      },
      admission_type: 'preventive_detention',
      status: 'in_progress',
      admission_date: '2024-01-15',
      admission_time: '14:30:00',
      completion_percentage: 60,
      completed_steps: 3,
      total_steps: 5
    }
    
    processSteps.value = [
      {
        name: 'Registro Inicial',
        description: 'Datos básicos del PPL registrados',
        completed: true,
        completed_at: '2024-01-15 14:30:00',
        completed_by: 'Usuario 1'
      },
      {
        name: 'Verificación de Documentos',
        description: 'Documentos legales verificados',
        completed: true,
        completed_at: '2024-01-15 14:45:00',
        completed_by: 'Usuario 2'
      },
      {
        name: 'Evaluación Médica',
        description: 'Examen médico inicial completado',
        completed: true,
        completed_at: '2024-01-15 15:00:00',
        completed_by: 'Doctor'
      },
      {
        name: 'Clasificación de Seguridad',
        description: 'Nivel de seguridad asignado',
        completed: false,
        current: true
      },
      {
        name: 'Asignación de Celda',
        description: 'Ubicación en el centro asignada',
        completed: false,
        current: false
      }
    ]
  } catch (error) {
    console.error('Error loading admission:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar la información de la admisión'
    })
  } finally {
    loading.value = false
  }
}

const continueProcess = () => {
  // TODO: Implement continue process logic
  router.push({ 
    name: 'operations-admission-process', 
    params: { id: admission.value.id } 
  })
}

const cancelAdmission = async () => {
  const result = await Swal.fire({
    title: '¿Cancelar admisión?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cancelar',
    cancelButtonText: 'No'
  })
  
  if (result.isConfirmed) {
    try {
      // TODO: Implement API call
      await Swal.fire({
        icon: 'success',
        title: 'Admisión cancelada',
        text: 'La admisión ha sido cancelada exitosamente'
      })
      router.push({ name: 'operations-admissions' })
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cancelar la admisión'
      })
    }
  }
}

// Formatting methods
const formatAdmissionType = (type: string) => {
  const types: Record<string, string> = {
    'preventive_detention': 'Prisión Preventiva',
    'sentence_execution': 'Ejecución de Sentencia',
    'transfer': 'Traslado',
    'reentry': 'Reingreso',
    'judicial_order': 'Orden Judicial'
  }
  return types[type] || type
}

const formatStatus = (status: string) => {
  const statuses: Record<string, string> = {
    'pending': 'Pendiente',
    'in_progress': 'En Proceso',
    'completed': 'Completado',
    'cancelled': 'Cancelado'
  }
  return statuses[status] || status
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-GT')
}

const formatTime = (time: string) => {
  return new Date(`2000-01-01 ${time}`).toLocaleTimeString('es-GT', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatDateTime = (datetime: string) => {
  return new Date(datetime).toLocaleString('es-GT')
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'pending': 'badge-light-warning',
    'in_progress': 'badge-light-primary',
    'completed': 'badge-light-success',
    'cancelled': 'badge-light-danger'
  }
  return classes[status] || 'badge-light-secondary'
}

const getProgressBarClass = (percentage: number) => {
  if (percentage >= 75) return 'bg-success'
  if (percentage >= 50) return 'bg-warning'
  return 'bg-danger'
}

// Lifecycle
onMounted(() => {
  loadAdmission()
})
</script>