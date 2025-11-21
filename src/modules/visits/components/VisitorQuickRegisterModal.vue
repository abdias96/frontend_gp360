<template>
  <div
    class="modal fade"
    id="visitorQuickRegisterModal"
    tabindex="-1"
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-user-plus me-2"></i>
            Registro Rápido de Visitante
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <!-- Datos de Identificación -->
            <div class="mb-6">
              <h6 class="fw-bold mb-3">
                <i class="fas fa-id-card me-2 text-primary"></i>
                Datos de Identificación
              </h6>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold required">Número de Documento</label>
                  <input
                    v-model="form.document_number"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.document_number }"
                    placeholder="13 dígitos"
                    maxlength="13"
                    required
                  />
                  <div v-if="errors.document_number" class="invalid-feedback">
                    {{ errors.document_number }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold required">Tipo de Documento</label>
                  <select
                    v-model="form.document_type"
                    class="form-select"
                    required
                  >
                    <option value="DPI">DPI</option>
                    <option value="CUI">CUI / Fe de Edad (Menores)</option>
                    <option value="Pasaporte">Pasaporte</option>
                    <option value="Licencia">Licencia</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Datos Personales -->
            <div class="mb-6">
              <h6 class="fw-bold mb-3">
                <i class="fas fa-user me-2 text-primary"></i>
                Datos Personales
              </h6>
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label fw-bold required">Primer Nombre</label>
                  <input
                    v-model="form.first_name"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.first_name }"
                    required
                  />
                  <div v-if="errors.first_name" class="invalid-feedback">
                    {{ errors.first_name }}
                  </div>
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-bold">Segundo Nombre</label>
                  <input
                    v-model="form.second_name"
                    type="text"
                    class="form-control"
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-bold">Tercer Nombre</label>
                  <input
                    v-model="form.third_name"
                    type="text"
                    class="form-control"
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-bold required">Primer Apellido</label>
                  <input
                    v-model="form.first_surname"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.first_surname }"
                    required
                  />
                  <div v-if="errors.first_surname" class="invalid-feedback">
                    {{ errors.first_surname }}
                  </div>
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-bold">Segundo Apellido</label>
                  <input
                    v-model="form.second_surname"
                    type="text"
                    class="form-control"
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-bold">Apellido de Casada</label>
                  <input
                    v-model="form.married_surname"
                    type="text"
                    class="form-control"
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-bold required">Fecha de Nacimiento</label>
                  <input
                    v-model="form.birth_date"
                    type="date"
                    class="form-control"
                    :class="{ 'is-invalid': errors.birth_date }"
                    :max="todayDate"
                    required
                  />
                  <div v-if="errors.birth_date" class="invalid-feedback">
                    {{ errors.birth_date }}
                  </div>
                  <small v-if="isMinor" class="text-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    Visitante menor de edad. Complete información del tutor/responsable.
                  </small>
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-bold required">Género</label>
                  <select
                    v-model="form.gender"
                    class="form-select"
                    required
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-bold required">Nacionalidad</label>
                  <select
                    v-model="form.nationality_id"
                    class="form-select"
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option
                      v-for="nationality in nationalities"
                      :key="nationality?.id || nationality"
                      :value="nationality?.id || nationality"
                    >
                      {{ nationality?.name || nationality }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Datos de Contacto -->
            <div class="mb-6">
              <h6 class="fw-bold mb-3">
                <i class="fas fa-phone me-2 text-primary"></i>
                Datos de Contacto
              </h6>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold">Teléfono</label>
                  <input
                    v-model="form.phone_number"
                    type="tel"
                    class="form-control"
                    placeholder="12345678"
                    maxlength="8"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">Teléfono Alternativo</label>
                  <input
                    v-model="form.alternative_phone"
                    type="tel"
                    class="form-control"
                    placeholder="12345678"
                    maxlength="8"
                  />
                </div>
                <div class="col-md-12">
                  <label class="form-label fw-bold">Email</label>
                  <input
                    v-model="form.email"
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': errors.email }"
                    placeholder="ejemplo@correo.com"
                  />
                  <div v-if="errors.email" class="invalid-feedback">
                    {{ errors.email }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Dirección -->
            <div class="mb-6">
              <h6 class="fw-bold mb-3">
                <i class="fas fa-map-marker-alt me-2 text-primary"></i>
                Dirección
              </h6>
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label fw-bold required">Dirección Completa</label>
                  <textarea
                    v-model="form.address"
                    class="form-control"
                    :class="{ 'is-invalid': errors.address }"
                    rows="2"
                    required
                  ></textarea>
                  <div v-if="errors.address" class="invalid-feedback">
                    {{ errors.address }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold required">Municipio</label>
                  <select
                    v-model="form.municipality_id"
                    class="form-select"
                    :class="{ 'is-invalid': errors.municipality_id }"
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option
                      v-for="municipality in municipalities"
                      :key="municipality?.id || municipality"
                      :value="municipality?.id || municipality"
                    >
                      {{ municipality?.name || municipality }}
                    </option>
                  </select>
                  <div v-if="errors.municipality_id" class="invalid-feedback">
                    {{ errors.municipality_id }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">Ocupación</label>
                  <input
                    v-model="form.occupation"
                    type="text"
                    class="form-control"
                    placeholder="Ej: Comerciante"
                  />
                </div>
              </div>
            </div>

            <!-- Tutor/Responsable Legal (Solo para menores) -->
            <div v-if="isMinor" class="mb-6 border border-warning rounded p-3 bg-light-warning">
              <h6 class="fw-bold mb-3 text-warning">
                <i class="fas fa-user-shield me-2"></i>
                Tutor / Responsable Legal (Obligatorio para menores)
              </h6>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold required">Nombre Completo del Tutor</label>
                  <input
                    v-model="form.guardian_name"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.guardian_name }"
                    :required="isMinor"
                  />
                  <div v-if="errors.guardian_name" class="invalid-feedback">
                    {{ errors.guardian_name }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold required">Relación con el Menor</label>
                  <select
                    v-model="form.guardian_relationship"
                    class="form-select"
                    :class="{ 'is-invalid': errors.guardian_relationship }"
                    :required="isMinor"
                  >
                    <option value="">Seleccione...</option>
                    <option value="Padre">Padre</option>
                    <option value="Madre">Madre</option>
                    <option value="Abuelo/a">Abuelo/a</option>
                    <option value="Tío/a">Tío/a</option>
                    <option value="Hermano/a Mayor">Hermano/a Mayor</option>
                    <option value="Tutor Legal">Tutor Legal</option>
                    <option value="Otro">Otro</option>
                  </select>
                  <div v-if="errors.guardian_relationship" class="invalid-feedback">
                    {{ errors.guardian_relationship }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold required">DPI del Tutor</label>
                  <input
                    v-model="form.guardian_document"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.guardian_document }"
                    placeholder="13 dígitos"
                    maxlength="13"
                    :required="isMinor"
                  />
                  <div v-if="errors.guardian_document" class="invalid-feedback">
                    {{ errors.guardian_document }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold required">Teléfono del Tutor</label>
                  <input
                    v-model="form.guardian_phone"
                    type="tel"
                    class="form-control"
                    :class="{ 'is-invalid': errors.guardian_phone }"
                    placeholder="12345678"
                    maxlength="8"
                    :required="isMinor"
                  />
                  <div v-if="errors.guardian_phone" class="invalid-feedback">
                    {{ errors.guardian_phone }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Contacto de Emergencia -->
            <div class="mb-4">
              <h6 class="fw-bold mb-3">
                <i class="fas fa-exclamation-triangle me-2 text-primary"></i>
                Contacto de Emergencia
              </h6>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold">Nombre Completo</label>
                  <input
                    v-model="form.emergency_contact_name"
                    type="text"
                    class="form-control"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">Teléfono</label>
                  <input
                    v-model="form.emergency_contact_phone"
                    type="tel"
                    class="form-control"
                    placeholder="12345678"
                    maxlength="8"
                  />
                </div>
              </div>
            </div>

            <!-- Fotografía (Opcional) -->
            <div class="mb-4">
              <h6 class="fw-bold mb-3">
                <i class="fas fa-camera me-2 text-primary"></i>
                Fotografía (Opcional)
              </h6>
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label fw-bold">Foto de Frente</label>
                  <input
                    type="file"
                    class="form-control"
                    accept="image/*"
                    @change="handlePhotoUpload($event, 'front')"
                  />
                  <small class="text-muted">Formato: JPG, PNG. Tamaño máximo: 5MB</small>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-light"
            data-bs-dismiss="modal"
            :disabled="loading"
          >
            <i class="fas fa-times me-2"></i>
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn-success"
            @click="submitForm"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="fas fa-save me-2"></i>
            Registrar Visitante
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ApiService from '@/core/services/ApiService'
import Swal from 'sweetalert2'

// Props & Emits
const emit = defineEmits(['saved', 'close'])

// Refs
const modalRef = ref<HTMLElement | null>(null)
const loading = ref(false)
const nationalities = ref<any[]>([])
const municipalities = ref<any[]>([])
const errors = ref<Record<string, string>>({})

const form = ref({
  document_number: '',
  document_type: 'DPI',
  first_name: '',
  second_name: '',
  third_name: '',
  first_surname: '',
  second_surname: '',
  married_surname: '',
  birth_date: '',
  gender: 'M',
  nationality_id: '',
  address: '',
  municipality_id: '',
  phone_number: '',
  alternative_phone: '',
  email: '',
  occupation: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  guardian_name: '',
  guardian_relationship: '',
  guardian_document: '',
  guardian_phone: '',
  front_photo: null as File | null
})

let modal: any = null

// Computed
const todayDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const isMinor = computed(() => {
  if (!form.value.birth_date) return false

  const birthDate = new Date(form.value.birth_date)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age < 18
})

// Methods
const handlePhotoUpload = (event: Event, type: string) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    form.value.front_photo = target.files[0]
  }
}

const validateForm = () => {
  errors.value = {}
  let isValid = true

  // Validate DPI/CUI
  if (!form.value.document_number || form.value.document_number.length !== 13) {
    errors.value.document_number = 'El documento debe tener 13 dígitos'
    isValid = false
  }

  // Validate required fields
  if (!form.value.first_name) {
    errors.value.first_name = 'El primer nombre es requerido'
    isValid = false
  }

  if (!form.value.first_surname) {
    errors.value.first_surname = 'El primer apellido es requerido'
    isValid = false
  }

  if (!form.value.birth_date) {
    errors.value.birth_date = 'La fecha de nacimiento es requerida'
    isValid = false
  }

  if (!form.value.address) {
    errors.value.address = 'La dirección es requerida'
    isValid = false
  }

  if (!form.value.municipality_id) {
    errors.value.municipality_id = 'El municipio es requerido'
    isValid = false
  }

  // Validate email format if provided
  if (form.value.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.value.email)) {
      errors.value.email = 'El formato del email no es válido'
      isValid = false
    }
  }

  // Validate guardian fields if minor
  if (isMinor.value) {
    if (!form.value.guardian_name) {
      errors.value.guardian_name = 'El nombre del tutor es requerido para menores'
      isValid = false
    }

    if (!form.value.guardian_relationship) {
      errors.value.guardian_relationship = 'La relación con el tutor es requerida'
      isValid = false
    }

    if (!form.value.guardian_document || form.value.guardian_document.length !== 13) {
      errors.value.guardian_document = 'El DPI del tutor debe tener 13 dígitos'
      isValid = false
    }

    if (!form.value.guardian_phone || form.value.guardian_phone.length !== 8) {
      errors.value.guardian_phone = 'El teléfono del tutor debe tener 8 dígitos'
      isValid = false
    }
  }

  return isValid
}

const submitForm = async () => {
  if (!validateForm()) {
    Swal.fire({
      title: 'Error de Validación',
      text: 'Por favor, corrija los errores en el formulario',
      icon: 'error'
    })
    return
  }

  try {
    loading.value = true

    // Create FormData for file upload
    const formData = new FormData()

    // Add all form fields
    Object.keys(form.value).forEach(key => {
      const value = form.value[key as keyof typeof form.value]
      if (value !== null && value !== '') {
        if (key === 'front_photo' && value instanceof File) {
          formData.append(key, value)
        } else if (typeof value !== 'object') {
          formData.append(key, String(value))
        }
      }
    })

    const response = await ApiService.post('/visitors', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data) {
      Swal.fire({
        title: '¡Éxito!',
        text: 'Visitante registrado exitosamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })

      emit('saved', response.data.visitor)

      if (modal) {
        modal.hide()
      }

      resetForm()
    }
  } catch (error: any) {
    console.error('Error registering visitor:', error)

    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    }

    Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'Error al registrar el visitante',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    document_number: '',
    document_type: 'DPI',
    first_name: '',
    second_name: '',
    third_name: '',
    first_surname: '',
    second_surname: '',
    married_surname: '',
    birth_date: '',
    gender: 'M',
    nationality_id: '',
    address: '',
    municipality_id: '',
    phone_number: '',
    alternative_phone: '',
    email: '',
    occupation: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    guardian_name: '',
    guardian_relationship: '',
    guardian_document: '',
    guardian_phone: '',
    front_photo: null
  }
  errors.value = {}
}

const fetchCatalogs = async () => {
  try {
    // Fetch nationalities (using simple=true for dropdown data)
    const nationalitiesRes = await ApiService.get('/catalogs/nationalities?simple=true')
    nationalities.value = nationalitiesRes.data.data || []

    // Fetch municipalities (using simple=true for dropdown data)
    const municipalitiesRes = await ApiService.get('/catalogs/municipalities?simple=true')
    municipalities.value = municipalitiesRes.data.data || []
  } catch (error) {
    console.error('Error fetching catalogs:', error)
    Swal.fire({
      title: 'Error',
      text: 'No se pudieron cargar los catálogos. Por favor, recargue la página.',
      icon: 'error',
      confirmButtonText: 'OK'
    })
  }
}

// Lifecycle
onMounted(async () => {
  // Initialize Bootstrap modal
  const { Modal } = await import('bootstrap')
  if (modalRef.value) {
    modal = new Modal(modalRef.value)
  }

  await fetchCatalogs()
})

// Expose methods
defineExpose({
  show: () => {
    if (modal) {
      resetForm()
      modal.show()
    }
  },
  hide: () => {
    if (modal) {
      modal.hide()
    }
  }
})
</script>

<style scoped>
.form-label.required::after {
  content: '*';
  color: #dc3545;
  margin-left: 4px;
}
</style>
