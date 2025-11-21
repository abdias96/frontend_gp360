<template>
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <h3 class="fw-bold m-0">
          Editar Visitante
          <span v-if="currentVisitor" class="text-muted fs-6 fw-normal ms-2">
            #{{ currentVisitor.visitor_code }}
          </span>
        </h3>
      </div>
      <div class="card-toolbar">
        <button
          type="button"
          @click="handleCancel"
          class="btn btn-light-secondary me-3"
          :disabled="loading"
        >
          <i class="fas fa-times me-2"></i>
          Cancelar
        </button>
        <button
          type="submit"
          form="visitor-edit-form"
          class="btn btn-primary"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          {{ loading ? "Guardando..." : "Guardar Cambios" }}
        </button>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body pt-0">
      <!-- Loading State -->
      <div v-if="loadingVisitor" class="text-center py-10">
        <div
          class="spinner-border spinner-border-lg text-primary"
          role="status"
        >
          <span class="visually-hidden">Cargando...</span>
        </div>
        <div class="text-gray-600 fs-6 fw-semibold mt-5">
          Cargando información del visitante...
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger">
        <div class="d-flex">
          <i class="fas fa-exclamation-circle fs-2tx text-danger me-4"></i>
          <div class="d-flex flex-column">
            <h4 class="mb-1 text-danger">Error al cargar el visitante</h4>
            <span>{{ error }}</span>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form
        v-else-if="currentVisitor"
        id="visitor-edit-form"
        @submit.prevent="handleSubmit"
        class="form"
      >
        <!-- Datos de Identificación -->
        <div class="card mb-7">
          <div class="card-header border-0 pt-6">
            <div class="card-title">
              <h4 class="fw-bold text-gray-800">
                <i class="fas fa-id-card me-2 text-primary"></i>
                Datos de Identificación
              </h4>
            </div>
          </div>
          <div class="card-body pt-0">
            <div class="row g-6">
              <div class="col-md-6">
                <label class="form-label required">Número de Documento (DPI)</label>
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
                  {{ errors.document_number[0] }}
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label required">Tipo de Documento</label>
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
        </div>

        <!-- Datos Personales -->
        <div class="card mb-7">
          <div class="card-header border-0 pt-6">
            <div class="card-title">
              <h4 class="fw-bold text-gray-800">
                <i class="fas fa-user me-2 text-primary"></i>
                Datos Personales
              </h4>
            </div>
          </div>
          <div class="card-body pt-0">
            <div class="row g-6">
              <div class="col-md-4">
                <label class="form-label required">Primer Nombre</label>
                <input
                  v-model="form.first_name"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.first_name }"
                  required
                />
                <div v-if="errors.first_name" class="invalid-feedback">
                  {{ errors.first_name[0] }}
                </div>
              </div>
              <div class="col-md-4">
                <label class="form-label">Segundo Nombre</label>
                <input
                  v-model="form.second_name"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">Tercer Nombre</label>
                <input
                  v-model="form.third_name"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label required">Primer Apellido</label>
                <input
                  v-model="form.first_surname"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.first_surname }"
                  required
                />
                <div v-if="errors.first_surname" class="invalid-feedback">
                  {{ errors.first_surname[0] }}
                </div>
              </div>
              <div class="col-md-4">
                <label class="form-label">Segundo Apellido</label>
                <input
                  v-model="form.second_surname"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">Apellido de Casada</label>
                <input
                  v-model="form.married_surname"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label required">Fecha de Nacimiento</label>
                <input
                  v-model="form.birth_date"
                  type="date"
                  class="form-control"
                  :class="{ 'is-invalid': errors.birth_date }"
                  :max="todayDate"
                  required
                />
                <div v-if="errors.birth_date" class="invalid-feedback">
                  {{ errors.birth_date[0] }}
                </div>
                <small v-if="isMinor" class="text-warning">
                  <i class="fas fa-exclamation-triangle"></i>
                  Visitante menor de edad. Complete información del tutor/responsable.
                </small>
              </div>
              <div class="col-md-4">
                <label class="form-label required">Género</label>
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
                <label class="form-label required">Nacionalidad</label>
                <select
                  v-model="form.nationality_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.nationality_id }"
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
                <div v-if="errors.nationality_id" class="invalid-feedback">
                  {{ errors.nationality_id[0] }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Datos de Contacto -->
        <div class="card mb-7">
          <div class="card-header border-0 pt-6">
            <div class="card-title">
              <h4 class="fw-bold text-gray-800">
                <i class="fas fa-phone me-2 text-primary"></i>
                Datos de Contacto
              </h4>
            </div>
          </div>
          <div class="card-body pt-0">
            <div class="row g-6">
              <div class="col-md-6">
                <label class="form-label">Teléfono</label>
                <input
                  v-model="form.phone_number"
                  type="tel"
                  class="form-control"
                  placeholder="12345678"
                  maxlength="8"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Teléfono Alternativo</label>
                <input
                  v-model="form.alternative_phone"
                  type="tel"
                  class="form-control"
                  placeholder="12345678"
                  maxlength="8"
                />
              </div>
              <div class="col-md-12">
                <label class="form-label">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                  placeholder="ejemplo@correo.com"
                />
                <div v-if="errors.email" class="invalid-feedback">
                  {{ errors.email[0] }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Dirección -->
        <div class="card mb-7">
          <div class="card-header border-0 pt-6">
            <div class="card-title">
              <h4 class="fw-bold text-gray-800">
                <i class="fas fa-map-marker-alt me-2 text-primary"></i>
                Dirección
              </h4>
            </div>
          </div>
          <div class="card-body pt-0">
            <div class="row g-6">
              <div class="col-md-12">
                <label class="form-label required">Dirección Completa</label>
                <textarea
                  v-model="form.address"
                  class="form-control"
                  :class="{ 'is-invalid': errors.address }"
                  rows="2"
                  required
                ></textarea>
                <div v-if="errors.address" class="invalid-feedback">
                  {{ errors.address[0] }}
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label required">Municipio</label>
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
                  {{ errors.municipality_id[0] }}
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Ocupación</label>
                <input
                  v-model="form.occupation"
                  type="text"
                  class="form-control"
                  placeholder="Ej: Comerciante"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Tutor/Responsable Legal (Solo para menores) -->
        <div v-if="isMinor" class="card mb-7 border-warning">
          <div class="card-header border-0 pt-6 bg-light-warning">
            <div class="card-title">
              <h4 class="fw-bold text-warning">
                <i class="fas fa-user-shield me-2"></i>
                Tutor / Responsable Legal (Obligatorio para menores)
              </h4>
            </div>
          </div>
          <div class="card-body pt-0">
            <div class="row g-6">
              <div class="col-md-6">
                <label class="form-label required">Nombre Completo del Tutor</label>
                <input
                  v-model="form.guardian_name"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.guardian_name }"
                  :required="isMinor"
                />
                <div v-if="errors.guardian_name" class="invalid-feedback">
                  {{ errors.guardian_name[0] }}
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label required">Relación con el Menor</label>
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
                  {{ errors.guardian_relationship[0] }}
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label required">DPI del Tutor</label>
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
                  {{ errors.guardian_document[0] }}
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label required">Teléfono del Tutor</label>
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
                  {{ errors.guardian_phone[0] }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contacto de Emergencia -->
        <div class="card mb-7">
          <div class="card-header border-0 pt-6">
            <div class="card-title">
              <h4 class="fw-bold text-gray-800">
                <i class="fas fa-exclamation-triangle me-2 text-primary"></i>
                Contacto de Emergencia
              </h4>
            </div>
          </div>
          <div class="card-body pt-0">
            <div class="row g-6">
              <div class="col-md-6">
                <label class="form-label">Nombre Completo</label>
                <input
                  v-model="form.emergency_contact_name"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Teléfono</label>
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
        </div>

        <!-- Fotografía -->
        <div class="card mb-7">
          <div class="card-header border-0 pt-6">
            <div class="card-title">
              <h4 class="fw-bold text-gray-800">
                <i class="fas fa-camera me-2 text-primary"></i>
                Fotografía
              </h4>
            </div>
          </div>
          <div class="card-body pt-0">
            <div class="row g-6">
              <div class="col-md-12" v-if="currentVisitor.photo_path">
                <div class="mb-4">
                  <label class="form-label d-block">Fotografía Actual</label>
                  <img
                    :src="`/storage/${currentVisitor.photo_path}`"
                    alt="Foto del visitante"
                    class="img-thumbnail"
                    style="max-width: 200px;"
                  />
                </div>
              </div>
              <div class="col-md-12">
                <label class="form-label">Actualizar Fotografía</label>
                <input
                  type="file"
                  class="form-control"
                  accept="image/*"
                  @change="handlePhotoUpload"
                />
                <small class="text-muted">Formato: JPG, PNG. Tamaño máximo: 5MB</small>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    <!--end::Card body-->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ApiService from '@/core/services/ApiService'
import Swal from 'sweetalert2'

// Router
const route = useRoute()
const router = useRouter()

// Refs
const loading = ref(false)
const loadingVisitor = ref(false)
const error = ref<string | null>(null)
const currentVisitor = ref<any>(null)
const nationalities = ref<any[]>([])
const municipalities = ref<any[]>([])
const errors = ref<Record<string, string[]>>({})

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
const loadVisitor = async () => {
  try {
    loadingVisitor.value = true
    error.value = null
    const visitorId = route.params.id as string

    const response = await ApiService.get(`/visitors/${visitorId}`)
    currentVisitor.value = response.data

    if (currentVisitor.value) {
      populateForm()
    }
  } catch (err: any) {
    console.error('Error loading visitor:', err)
    error.value = err.response?.data?.message || 'Error al cargar el visitante'
    Swal.fire({
      title: 'Error',
      text: error.value,
      icon: 'error',
      confirmButtonText: 'OK'
    }).then(() => {
      router.push('/visits/visitor-management')
    })
  } finally {
    loadingVisitor.value = false
  }
}

const populateForm = () => {
  if (!currentVisitor.value) return

  const visitor = currentVisitor.value

  // Format birth_date to YYYY-MM-DD for date input
  let birthDate = ''
  if (visitor.birth_date) {
    // Handle different date formats: ISO (2000-01-15T00:00:00.000Z) or SQL (2000-01-15 00:00:00)
    const dateStr = visitor.birth_date
    if (dateStr.includes('T')) {
      // ISO format: split by T
      birthDate = dateStr.split('T')[0]
    } else if (dateStr.includes(' ')) {
      // SQL format: split by space
      birthDate = dateStr.split(' ')[0]
    } else {
      // Already in YYYY-MM-DD format or just date
      birthDate = dateStr.substring(0, 10)
    }
  }

  form.value = {
    document_number: visitor.document_number || '',
    document_type: visitor.document_type || 'DPI',
    first_name: visitor.first_name || '',
    second_name: visitor.second_name || '',
    third_name: visitor.third_name || '',
    first_surname: visitor.first_surname || '',
    second_surname: visitor.second_surname || '',
    married_surname: visitor.married_surname || '',
    birth_date: birthDate,
    gender: visitor.gender || 'M',
    nationality_id: visitor.nationality_id?.toString() || '',
    address: visitor.address || '',
    municipality_id: visitor.municipality_id?.toString() || '',
    phone_number: visitor.phone_number || '',
    alternative_phone: visitor.alternative_phone || '',
    email: visitor.email || '',
    occupation: visitor.occupation || '',
    emergency_contact_name: visitor.emergency_contact_name || '',
    emergency_contact_phone: visitor.emergency_contact_phone || '',
    guardian_name: visitor.guardian_name || '',
    guardian_relationship: visitor.guardian_relationship || '',
    guardian_document: visitor.guardian_document || '',
    guardian_phone: visitor.guardian_phone || '',
    front_photo: null
  }
}

const handlePhotoUpload = (event: Event) => {
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
    errors.value.document_number = ['El documento debe tener 13 dígitos']
    isValid = false
  }

  // Validate required fields
  if (!form.value.first_name) {
    errors.value.first_name = ['El primer nombre es requerido']
    isValid = false
  }

  if (!form.value.first_surname) {
    errors.value.first_surname = ['El primer apellido es requerido']
    isValid = false
  }

  if (!form.value.birth_date) {
    errors.value.birth_date = ['La fecha de nacimiento es requerida']
    isValid = false
  }

  if (!form.value.address) {
    errors.value.address = ['La dirección es requerida']
    isValid = false
  }

  if (!form.value.municipality_id) {
    errors.value.municipality_id = ['El municipio es requerido']
    isValid = false
  }

  if (!form.value.nationality_id) {
    errors.value.nationality_id = ['La nacionalidad es requerida']
    isValid = false
  }

  // Validate email format if provided
  if (form.value.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.value.email)) {
      errors.value.email = ['El formato del email no es válido']
      isValid = false
    }
  }

  // Validate guardian fields if minor
  if (isMinor.value) {
    if (!form.value.guardian_name) {
      errors.value.guardian_name = ['El nombre del tutor es requerido para menores']
      isValid = false
    }

    if (!form.value.guardian_relationship) {
      errors.value.guardian_relationship = ['La relación con el tutor es requerida']
      isValid = false
    }

    if (!form.value.guardian_document || form.value.guardian_document.length !== 13) {
      errors.value.guardian_document = ['El DPI del tutor debe tener 13 dígitos']
      isValid = false
    }

    if (!form.value.guardian_phone || form.value.guardian_phone.length !== 8) {
      errors.value.guardian_phone = ['El teléfono del tutor debe tener 8 dígitos']
      isValid = false
    }
  }

  return isValid
}

const handleSubmit = async () => {
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

    // Add _method for Laravel PUT request
    formData.append('_method', 'PUT')

    const visitorId = route.params.id as string
    const response = await ApiService.post(`/visitors/${visitorId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data) {
      await Swal.fire({
        title: '¡Éxito!',
        text: 'Visitante actualizado exitosamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })

      // Navigate back to visitor detail
      router.push({ name: 'visits-visitors-detail', params: { id: visitorId } })
    }
  } catch (error: any) {
    console.error('Error updating visitor:', error)

    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    }

    Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'Error al actualizar el visitante',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  const visitorId = route.params.id as string
  router.push({ name: 'visits-visitors-detail', params: { id: visitorId } })
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
  await Promise.all([
    fetchCatalogs(),
    loadVisitor()
  ])
})
</script>

<style scoped>
.form-label.required::after {
  content: '*';
  color: #dc3545;
  margin-left: 4px;
}
</style>
