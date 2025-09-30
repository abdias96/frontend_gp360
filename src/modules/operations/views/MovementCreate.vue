<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <h3>{{ $t('operations.movements.create.title') }}</h3>
        <p class="text-muted">{{ $t('operations.movements.create.subtitle') }}</p>
      </div>
      <div class="card-toolbar">
        <router-link 
          :to="{ name: 'operations-movements' }"
          class="btn btn-light-primary btn-sm"
        >
          <i class="fas fa-arrow-left me-2"></i>
          Cancelar
        </router-link>
      </div>
    </div>

    <div class="card-body">
      <!-- Movement Type Selection -->
      <div class="mb-8">
        <h5 class="mb-4">Tipo de Movimiento</h5>
        <div class="row">
          <div 
            v-for="type in movementTypes" 
            :key="type.value"
            class="col-md-3 mb-4"
          >
            <div 
              class="card border-2 cursor-pointer"
              :class="{ 
                'border-primary': form.movement_type === type.value,
                'border-gray-300': form.movement_type !== type.value
              }"
              @click="form.movement_type = type.value"
            >
              <div class="card-body text-center">
                <i :class="type.icon" class="fa-3x mb-3" 
                   :style="{ color: form.movement_type === type.value ? '#009ef7' : '#a1a5b7' }"></i>
                <h6 class="mb-1">{{ type.label }}</h6>
                <p class="text-muted fs-7 mb-0">{{ type.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="form.movement_type">
        <!-- Search Inmate -->
        <div class="mb-8">
          <h5 class="mb-4">Seleccionar PPL</h5>
          <div class="row">
            <div class="col-md-6">
              <label class="form-label required">Buscar PPL</label>
              <div class="input-group">
                <input 
                  v-model="searchQuery"
                  type="text" 
                  class="form-control"
                  placeholder="DPI, nombre o código..."
                  @keyup.enter="searchInmate"
                >
                <button 
                  @click="searchInmate"
                  class="btn btn-primary"
                  type="button"
                >
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Selected Inmate Info -->
          <div v-if="selectedInmate" class="alert alert-light-primary mt-4">
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <h6 class="mb-1">{{ selectedInmate.full_name }}</h6>
                <div class="text-muted">
                  DPI: {{ selectedInmate.document_number }} | 
                  Ubicación Actual: {{ selectedInmate.current_location }}
                </div>
              </div>
              <button 
                @click="selectedInmate = null"
                class="btn btn-sm btn-light-danger"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Movement Details Form -->
        <div v-if="selectedInmate" class="mb-8">
          <h5 class="mb-4">Detalles del Movimiento</h5>
          
          <div class="row">
            <!-- Origin -->
            <div class="col-md-6 mb-6">
              <h6 class="mb-3">Origen</h6>
              <div class="mb-3">
                <label class="form-label">Centro</label>
                <input 
                  :value="selectedInmate.current_center"
                  class="form-control"
                  disabled
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Sector</label>
                <input 
                  :value="selectedInmate.current_sector"
                  class="form-control"
                  disabled
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Celda</label>
                <input 
                  :value="selectedInmate.current_cell"
                  class="form-control"
                  disabled
                >
              </div>
            </div>

            <!-- Destination -->
            <div class="col-md-6 mb-6">
              <h6 class="mb-3">Destino</h6>
              <div class="mb-3">
                <label class="form-label required">Centro</label>
                <select v-model="form.destination_center_id" class="form-select">
                  <option value="">Seleccionar centro</option>
                  <option v-for="center in centers" :key="center.id" :value="center.id">
                    {{ center.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Sector</label>
                <select 
                  v-model="form.destination_sector_id" 
                  class="form-select"
                  :disabled="!form.destination_center_id"
                >
                  <option value="">Seleccionar sector</option>
                  <option v-for="sector in availableSectors" :key="sector.id" :value="sector.id">
                    {{ sector.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Celda</label>
                <select 
                  v-model="form.destination_cell_id" 
                  class="form-select"
                  :disabled="!form.destination_sector_id"
                >
                  <option value="">Seleccionar celda</option>
                  <option v-for="cell in availableCells" :key="cell.id" :value="cell.id">
                    {{ cell.name }} ({{ cell.available_capacity }} disponible)
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Additional Details -->
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label required">Fecha del Movimiento</label>
              <input 
                v-model="form.movement_date"
                type="date" 
                class="form-control"
              >
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label required">Hora del Movimiento</label>
              <input 
                v-model="form.movement_time"
                type="time" 
                class="form-control"
              >
            </div>
          </div>

          <div class="row">
            <div class="col-md-12 mb-3">
              <label class="form-label required">Motivo del Movimiento</label>
              <textarea 
                v-model="form.reason"
                class="form-control"
                rows="3"
                placeholder="Describa el motivo del movimiento..."
              ></textarea>
            </div>
          </div>

          <!-- Authorization -->
          <div v-if="requiresAuthorization" class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label required">Autorizado por</label>
              <input 
                v-model="form.authorized_by"
                type="text" 
                class="form-control"
                placeholder="Nombre del funcionario"
              >
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Documento de Autorización</label>
              <input 
                type="file" 
                class="form-control"
                @change="handleFileUpload"
              >
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="selectedInmate" class="d-flex justify-content-end">
          <button 
            @click="saveMovement"
            class="btn btn-primary"
            :disabled="!isFormValid"
          >
            <i class="fas fa-save me-2"></i>
            Guardar Movimiento
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

// Data
const searchQuery = ref('')
const selectedInmate = ref<any>(null)
const centers = ref<any[]>([])
const availableSectors = ref<any[]>([])
const availableCells = ref<any[]>([])

const form = reactive({
  movement_type: '',
  inmate_id: null,
  destination_center_id: '',
  destination_sector_id: '',
  destination_cell_id: '',
  movement_date: '',
  movement_time: '',
  reason: '',
  authorized_by: '',
  authorization_document: null
})

const movementTypes = [
  {
    value: 'internal',
    label: 'Movimiento Interno',
    description: 'Dentro del mismo centro',
    icon: 'fas fa-arrows-alt'
  },
  {
    value: 'transfer',
    label: 'Traslado',
    description: 'Entre centros',
    icon: 'fas fa-exchange-alt'
  },
  {
    value: 'court',
    label: 'Audiencia',
    description: 'Salida a tribunales',
    icon: 'fas fa-gavel'
  },
  {
    value: 'medical',
    label: 'Médico',
    description: 'Salida médica',
    icon: 'fas fa-ambulance'
  }
]

// Computed
const requiresAuthorization = computed(() => {
  return ['transfer', 'court', 'medical'].includes(form.movement_type)
})

const isFormValid = computed(() => {
  if (!form.movement_type || !selectedInmate.value) return false
  if (!form.destination_center_id || !form.movement_date || !form.movement_time || !form.reason) return false
  if (requiresAuthorization.value && !form.authorized_by) return false
  return true
})

// Methods
const searchInmate = async () => {
  if (!searchQuery.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Búsqueda vacía',
      text: 'Por favor ingrese un criterio de búsqueda'
    })
    return
  }

  try {
    // TODO: Implement API call
    // Mock data for now
    selectedInmate.value = {
      id: 1,
      full_name: 'Juan Pérez García',
      document_number: '1234567890101',
      current_center: 'Centro Preventivo Zona 18',
      current_sector: 'Sector A',
      current_cell: 'Celda A-101',
      current_location: 'Centro Preventivo Zona 18 - Sector A - Celda A-101'
    }
    form.inmate_id = selectedInmate.value.id
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo buscar el PPL'
    })
  }
}

const loadCenters = async () => {
  try {
    // TODO: Implement API call
    centers.value = [
      { id: 1, name: 'Centro Preventivo Zona 18' },
      { id: 2, name: 'Granja Penal Canadá' },
      { id: 3, name: 'Centro de Detención Preventiva para Mujeres' }
    ]
  } catch (error) {
    console.error('Error loading centers:', error)
  }
}

const loadSectors = async (centerId: string) => {
  try {
    // TODO: Implement API call
    availableSectors.value = [
      { id: 1, name: 'Sector A' },
      { id: 2, name: 'Sector B' },
      { id: 3, name: 'Sector C' }
    ]
  } catch (error) {
    console.error('Error loading sectors:', error)
  }
}

const loadCells = async (sectorId: string) => {
  try {
    // TODO: Implement API call
    availableCells.value = [
      { id: 1, name: 'Celda A-101', available_capacity: 2 },
      { id: 2, name: 'Celda A-102', available_capacity: 1 },
      { id: 3, name: 'Celda A-103', available_capacity: 3 }
    ]
  } catch (error) {
    console.error('Error loading cells:', error)
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    form.authorization_document = target.files[0]
  }
}

const saveMovement = async () => {
  const result = await Swal.fire({
    title: '¿Confirmar movimiento?',
    text: 'Se registrará el movimiento del PPL',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar'
  })
  
  if (result.isConfirmed) {
    try {
      // TODO: Implement API call
      await Swal.fire({
        icon: 'success',
        title: 'Movimiento registrado',
        text: 'El movimiento ha sido registrado exitosamente'
      })
      router.push({ name: 'operations-movements' })
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo registrar el movimiento'
      })
    }
  }
}

// Watchers
watch(() => form.destination_center_id, (newValue) => {
  if (newValue) {
    loadSectors(newValue)
    form.destination_sector_id = ''
    form.destination_cell_id = ''
  }
})

watch(() => form.destination_sector_id, (newValue) => {
  if (newValue) {
    loadCells(newValue)
    form.destination_cell_id = ''
  }
})

// Lifecycle
loadCenters()
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>