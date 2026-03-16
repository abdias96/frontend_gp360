<template>
  <div>
    <!-- begin::page-header -->
    <div class="row gy-5 g-xl-10 mb-5 mb-xl-10">
      <div class="col-md-12">
        <div class="d-flex flex-column flex-md-row align-items-center justify-content-between">
          <h1 class="fs-2x fw-bold text-gray-900 mb-4 mb-md-0">
            {{ $t('visits.visitorDetail.title') }}
          </h1>
          <div class="d-flex gap-2">
            <router-link to="/visits/visitor-management" class="btn btn-light-primary">
              <i class="fas fa-arrow-left"></i>
              {{ $t('common.back') }}
            </router-link>
            <button class="btn btn-primary" @click="handleEdit">
              <i class="fas fa-edit"></i>
              {{ $t('common.edit') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- end::page-header -->

    <!-- Loading State -->
    <div v-if="loading" class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- begin::content -->
    <div v-else-if="visitor" class="row gy-5 g-xl-10">
      <!-- Visitor Information Card -->
      <div class="col-xl-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitorDetail.personalInfo') }}</h3>
          </div>
          <div class="card-body">
            <div class="row mb-5">
              <div class="col-md-4 text-center">
                <div class="symbol symbol-150px">
                  <img :src="visitor.photo || '/media/avatars/blank.png'" alt="Visitor photo" />
                </div>
              </div>
              <div class="col-md-8">
                <div class="mb-3">
                  <label class="form-label text-muted">{{ $t('visits.visitorDetail.fullName') }}</label>
                  <p class="text-gray-900 fw-bold">{{ visitor.fullName }}</p>
                </div>
                <div class="mb-3">
                  <label class="form-label text-muted">{{ $t('visits.visitorDetail.documentType') }}</label>
                  <p class="text-gray-900">{{ visitor.documentType }}</p>
                </div>
                <div class="mb-3">
                  <label class="form-label text-muted">{{ $t('visits.visitorDetail.documentNumber') }}</label>
                  <p class="text-gray-900">{{ visitor.documentNumber }}</p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label text-muted">{{ $t('visits.visitorDetail.birthDate') }}</label>
                <p class="text-gray-900">{{ formatDate(visitor.birthDate) }}</p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label text-muted">{{ $t('visits.visitorDetail.age') }}</label>
                <p class="text-gray-900">{{ calculateAge(visitor.birthDate) }} {{ $t('common.years') }}</p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label text-muted">{{ $t('visits.visitorDetail.phone') }}</label>
                <p class="text-gray-900">{{ visitor.phone }}</p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label text-muted">{{ $t('visits.visitorDetail.email') }}</label>
                <p class="text-gray-900">{{ visitor.email || '-' }}</p>
              </div>
              <div class="col-12 mb-3">
                <label class="form-label text-muted">{{ $t('visits.visitorDetail.address') }}</label>
                <p class="text-gray-900">{{ visitor.address }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Information Card -->
      <div class="col-xl-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitorDetail.securityInfo') }}</h3>
          </div>
          <div class="card-body">
            <div class="mb-5">
              <label class="form-label text-muted">{{ $t('visits.visitorDetail.status') }}</label>
              <span :class="getStatusBadgeClass(visitor.status)">
                {{ $t(`visits.status.${visitor.status}`) }}
              </span>
            </div>
            <div class="mb-5">
              <label class="form-label text-muted">{{ $t('visits.visitorDetail.biometricStatus') }}</label>
              <div class="d-flex align-items-center gap-2">
                <span v-if="visitor.biometricRegistered" class="badge badge-success">
                  <i class="fas fa-fingerprint me-1"></i>
                  {{ $t('visits.visitorDetail.biometricRegistered') }}
                </span>
                <span v-else class="badge badge-warning">
                  <i class="fas fa-exclamation-triangle me-1"></i>
                  {{ $t('visits.visitorDetail.biometricPending') }}
                </span>
                <button class="btn btn-sm btn-primary" @click="launchBiometricCapture">
                  <i class="fas fa-fingerprint me-1"></i>
                  {{ visitor.biometricRegistered ? 'Recapturar' : 'Capturar Biometria' }}
                </button>
              </div>
            </div>
            <div class="mb-5">
              <label class="form-label text-muted">{{ $t('visits.visitorDetail.registrationDate') }}</label>
              <p class="text-gray-900">{{ formatDate(visitor.registrationDate) }}</p>
            </div>
            <div class="mb-5">
              <label class="form-label text-muted">{{ $t('visits.visitorDetail.lastVisit') }}</label>
              <p class="text-gray-900">{{ formatDate(visitor.lastVisit) || '-' }}</p>
            </div>
            <div class="mb-5">
              <label class="form-label text-muted">{{ $t('visits.visitorDetail.totalVisits') }}</label>
              <p class="text-gray-900 fw-bold fs-4">{{ visitor.totalVisits }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Minor / Guardian Info Card -->
      <div v-if="visitorData?.is_minor" class="col-xl-12">
        <div class="card border border-warning">
          <div class="card-header bg-light-warning">
            <h3 class="card-title">
              <i class="fas fa-child text-warning me-2"></i>
              Visitante Menor de Edad
            </h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-3 mb-3">
                <label class="form-label text-muted fw-bold">Nombre del Tutor</label>
                <p class="text-gray-900">{{ visitorData.guardian_name || '-' }}</p>
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label text-muted fw-bold">Parentesco con el Tutor</label>
                <p class="text-gray-900">{{ visitorData.guardian_relationship || '-' }}</p>
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label text-muted fw-bold">DPI del Tutor</label>
                <p class="text-gray-900">{{ visitorData.guardian_document || '-' }}</p>
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label text-muted fw-bold">Telefono del Tutor</label>
                <p class="text-gray-900">{{ visitorData.guardian_phone || '-' }}</p>
              </div>
              <div v-if="visitorData.minor_relationship_to_inmate" class="col-md-6 mb-3">
                <label class="form-label text-muted fw-bold">Relacion del Menor con el PPL</label>
                <p class="text-gray-900">{{ visitorData.minor_relationship_to_inmate }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Documentos de Acreditacion Card -->
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-folder-open me-2"></i>
              Documentos de Acreditacion
            </h3>
          </div>
          <div class="card-body">
            <div class="row">
              <!-- DPI Frente -->
              <div class="col-md-3 mb-4">
                <label class="form-label text-muted fw-bold d-block">DPI (Frente)</label>
                <template v-if="visitorData?.document_front_path">
                  <a
                    :href="getDocumentUrl(visitorData.document_front_path)"
                    target="_blank"
                    class="btn btn-sm btn-light-primary"
                  >
                    <i :class="getDocumentIcon(visitorData.document_front_path)" class="me-1"></i>
                    Ver documento
                  </a>
                </template>
                <span v-else class="badge badge-light-danger">No adjunto</span>
              </div>

              <!-- DPI Reverso -->
              <div class="col-md-3 mb-4">
                <label class="form-label text-muted fw-bold d-block">DPI (Reverso)</label>
                <template v-if="visitorData?.document_back_path">
                  <a
                    :href="getDocumentUrl(visitorData.document_back_path)"
                    target="_blank"
                    class="btn btn-sm btn-light-primary"
                  >
                    <i :class="getDocumentIcon(visitorData.document_back_path)" class="me-1"></i>
                    Ver documento
                  </a>
                </template>
                <span v-else class="badge badge-light-danger">No adjunto</span>
              </div>

              <!-- Certificado de Nacimiento (solo menores) -->
              <div v-if="visitorData?.is_minor" class="col-md-3 mb-4">
                <label class="form-label text-muted fw-bold d-block">Certificado de Nacimiento</label>
                <template v-if="visitorData?.birth_certificate_path">
                  <a
                    :href="getDocumentUrl(visitorData.birth_certificate_path)"
                    target="_blank"
                    class="btn btn-sm btn-light-primary"
                  >
                    <i :class="getDocumentIcon(visitorData.birth_certificate_path)" class="me-1"></i>
                    Ver documento
                  </a>
                </template>
                <span v-else class="badge badge-light-danger">No adjunto</span>
              </div>

              <!-- DPI del Tutor (solo menores) -->
              <div v-if="visitorData?.is_minor" class="col-md-3 mb-4">
                <label class="form-label text-muted fw-bold d-block">DPI del Tutor</label>
                <template v-if="visitorData?.guardian_document_path">
                  <a
                    :href="getDocumentUrl(visitorData.guardian_document_path)"
                    target="_blank"
                    class="btn btn-sm btn-light-primary"
                  >
                    <i :class="getDocumentIcon(visitorData.guardian_document_path)" class="me-1"></i>
                    Ver documento
                  </a>
                </template>
                <span v-else class="badge badge-light-danger">No adjunto</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gestion de Solicitud Card -->
      <div v-if="latestVisitRequest" class="col-xl-12">
        <div class="card border border-primary">
          <div class="card-header bg-light-primary">
            <h3 class="card-title">
              <i class="fas fa-tasks me-2"></i>
              Gestion de Solicitud
              <span class="badge badge-light-info ms-2">
                #{{ latestVisitRequest.request_number || latestVisitRequest.id }}
              </span>
            </h3>
          </div>
          <div class="card-body">
            <!-- Current status display -->
            <div class="mb-5">
              <label class="form-label text-muted fw-bold">Estado Actual</label>
              <div>
                <span :class="getRequestStatusBadgeClass(latestVisitRequest.status)" class="fs-6">
                  {{ getRequestStatusLabel(latestVisitRequest.status) }}
                </span>
              </div>
            </div>

            <!-- PPL Matching Section -->
            <div v-if="!latestVisitRequest.inmate_id" class="mb-5 p-4 bg-light-warning rounded">
              <h5 class="text-warning mb-3">
                <i class="fas fa-exclamation-triangle me-2"></i>
                PPL No Vinculado
              </h5>
              <p class="text-muted mb-3">
                Esta solicitud no tiene un PPL vinculado. Busque y vincule al PPL correspondiente.
              </p>
              <div v-if="latestVisitRequest.visit_purpose" class="mb-3">
                <label class="form-label text-muted">Proposito / PPL indicado por el visitante:</label>
                <p class="fw-bold text-gray-900">{{ latestVisitRequest.visit_purpose }}</p>
              </div>
              <div class="row align-items-end">
                <div class="col-md-8">
                  <label class="form-label">Buscar PPL</label>
                  <div class="position-relative">
                    <input
                      v-model="inmateSearchQuery"
                      type="text"
                      class="form-control"
                      placeholder="Nombre o codigo del PPL..."
                      @input="debounceInmateSearch"
                    />
                    <div
                      v-if="inmateSearchResults.length > 0"
                      class="position-absolute bg-white border rounded shadow-sm w-100 mt-1"
                      style="z-index: 1050; max-height: 250px; overflow-y: auto;"
                    >
                      <div
                        v-for="inmate in inmateSearchResults"
                        :key="inmate.id"
                        class="d-flex align-items-center p-3 border-bottom cursor-pointer"
                        :class="{ 'bg-light-primary': selectedInmate?.id === inmate.id }"
                        style="cursor: pointer;"
                        @click="selectInmate(inmate)"
                      >
                        <div>
                          <div class="fw-bold">{{ inmate.full_name }}</div>
                          <div class="text-muted small">
                            {{ inmate.inmate_number || '-' }} |
                            {{ inmate.center?.name || '-' }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <button
                    class="btn btn-warning w-100"
                    :disabled="!selectedInmate || linkingInmate"
                    @click="linkInmate"
                  >
                    <span v-if="linkingInmate" class="spinner-border spinner-border-sm me-1"></span>
                    <i v-else class="fas fa-link me-1"></i>
                    Vincular PPL
                  </button>
                </div>
              </div>
              <div v-if="selectedInmate" class="mt-3 p-3 bg-light rounded">
                <span class="text-muted">PPL seleccionado:</span>
                <span class="fw-bold ms-2">{{ selectedInmate.full_name }}</span>
                <span class="badge badge-light-primary ms-2">{{ selectedInmate.inmate_number }}</span>
              </div>
            </div>

            <!-- PPL linked info -->
            <div v-else class="mb-5 p-4 bg-light-success rounded">
              <h5 class="text-success mb-2">
                <i class="fas fa-check-circle me-2"></i>
                PPL Vinculado
              </h5>
              <p class="fw-bold text-gray-900 mb-0">
                {{ latestVisitRequest.inmate
                  ? [latestVisitRequest.inmate.first_name, latestVisitRequest.inmate.middle_name, latestVisitRequest.inmate.last_name, latestVisitRequest.inmate.second_last_name].filter(Boolean).join(' ')
                  : `PPL ID: ${latestVisitRequest.inmate_id}` }}
                <span v-if="latestVisitRequest.inmate?.inmate_number" class="badge badge-light-primary ms-2">
                  {{ latestVisitRequest.inmate.inmate_number }}
                </span>
              </p>
            </div>

            <hr class="my-5" />

            <!-- Status Selector -->
            <div class="row">
              <div class="col-md-6 mb-4">
                <label class="form-label fw-bold">Cambiar Estado</label>
                <select v-model="newStatus" class="form-select">
                  <option value="pending">Pendiente</option>
                  <option value="under_review">En revision</option>
                  <option value="documents_verified">Documentos verificados</option>
                  <option value="approved">Aprobado</option>
                  <option value="rejected">Rechazado</option>
                  <option value="suspended">Suspendido</option>
                </select>
              </div>
              <div class="col-md-6 mb-4">
                <label class="form-label fw-bold">Fecha de visita solicitada</label>
                <p class="form-control-plaintext">
                  {{ latestVisitRequest.requested_visit_date
                    ? formatDate(latestVisitRequest.requested_visit_date)
                    : '-' }}
                </p>
              </div>
            </div>

            <!-- Observations -->
            <div class="mb-4">
              <label class="form-label fw-bold">Observaciones</label>
              <textarea
                v-model="observations"
                class="form-control"
                rows="3"
                placeholder="Agregar observaciones para el solicitante..."
              ></textarea>
            </div>

            <!-- Notify by email -->
            <div class="mb-5">
              <label class="form-check">
                <input
                  type="checkbox"
                  v-model="notifyByEmail"
                  class="form-check-input"
                />
                <span class="form-check-label">
                  Notificar al visitante por correo electronico
                  <span v-if="visitor.email" class="text-muted">({{ visitor.email }})</span>
                  <span v-else class="text-danger">(sin correo registrado)</span>
                </span>
              </label>
            </div>

            <!-- Update Status Button -->
            <div class="d-flex justify-content-end">
              <button
                class="btn btn-primary"
                :disabled="updatingStatus"
                @click="updateVisitStatus"
              >
                <span v-if="updatingStatus" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="fas fa-save me-1"></i>
                Actualizar Estado
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No Visit Request message -->
      <div v-else class="col-xl-12">
        <div class="card border border-secondary">
          <div class="card-body text-center py-10">
            <i class="fas fa-inbox text-muted fs-2x mb-3"></i>
            <p class="text-muted">Este visitante no tiene solicitudes de visita registradas.</p>
          </div>
        </div>
      </div>

      <!-- Related Inmates Card -->
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitorDetail.relatedInmates') }}</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th>{{ $t('visits.visitorDetail.inmateName') }}</th>
                    <th>{{ $t('visits.visitorDetail.inmateCode') }}</th>
                    <th>{{ $t('visits.visitorDetail.relationship') }}</th>
                    <th>{{ $t('visits.visitorDetail.visitPermission') }}</th>
                    <th>{{ $t('visits.visitorDetail.lastInmateVisit') }}</th>
                    <th class="text-end">{{ $t('common.actions.title') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="relatedInmates.length === 0">
                    <td colspan="6" class="text-center text-muted py-10">
                      No hay relaciones con PPL registradas para este visitante
                    </td>
                  </tr>
                  <tr v-for="relation in relatedInmates" :key="relation.id">
                    <td>{{ relation.inmateName }}</td>
                    <td>
                      <span class="badge badge-light-primary">{{ relation.inmateCode }}</span>
                    </td>
                    <td>{{ relation.relationship }}</td>
                    <td>
                      <span :class="relation.hasPermission ? 'badge badge-success' : 'badge badge-danger'">
                        {{ relation.hasPermission ? $t('common.yes') : $t('common.no') }}
                      </span>
                    </td>
                    <td>{{ formatDate(relation.lastVisit) || '-' }}</td>
                    <td class="text-end">
                      <router-link
                        :to="`/visits/relationships/${relation.id}`"
                        class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                      >
                        <i class="fas fa-eye"></i>
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Visit History Card -->
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t('visits.visitorDetail.visitHistory') }}</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th>{{ $t('visits.visitorDetail.visitDate') }}</th>
                    <th>{{ $t('visits.visitorDetail.visitTime') }}</th>
                    <th>{{ $t('visits.visitorDetail.inmateName') }}</th>
                    <th>{{ $t('visits.visitorDetail.visitType') }}</th>
                    <th>{{ $t('visits.visitorDetail.duration') }}</th>
                    <th>{{ $t('visits.visitorDetail.observations') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="visitHistory.length === 0">
                    <td colspan="6" class="text-center text-muted py-10">
                      No hay visitas registradas para este visitante
                    </td>
                  </tr>
                  <tr v-for="visit in visitHistory" :key="visit.id">
                    <td>{{ formatDate(visit.date) }}</td>
                    <td>{{ visit.time }}</td>
                    <td>{{ visit.inmateName }}</td>
                    <td>
                      <span class="badge badge-light-info">{{ visit.type }}</span>
                    </td>
                    <td>{{ visit.duration }} {{ $t('common.minutes') }}</td>
                    <td>{{ visit.observations || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end::content -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ApiService from '@/core/services/ApiService'
import Swal from 'sweetalert2'

// Composables
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// API base URL for document viewing (strip /api suffix to get storage base)
const apiBaseUrl = computed(() => {
  const url = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000/api'
  // Remove trailing /api to get the Laravel base URL for /storage paths
  return url.replace(/\/api\/?$/, '')
})

// Refs
const loading = ref(true)
const visitorData = ref<any>(null)

// Status management refs
const newStatus = ref('pending')
const observations = ref('')
const notifyByEmail = ref(false)
const updatingStatus = ref(false)

// PPL matching refs
const inmateSearchQuery = ref('')
const inmateSearchResults = ref<any[]>([])
const selectedInmate = ref<any>(null)
const linkingInmate = ref(false)
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

// Computed properties para mapear los datos correctamente
const visitor = computed(() => {
  if (!visitorData.value) return null

  const v = visitorData.value
  const fullName = [
    v.first_name,
    v.second_name,
    v.third_name,
    v.first_surname,
    v.second_surname,
    v.married_surname
  ].filter(Boolean).join(' ')

  return {
    id: v.id,
    fullName: fullName,
    documentType: v.document_type || 'N/A',
    documentNumber: v.document_number || 'N/A',
    birthDate: v.birth_date,
    phone: v.phone_number || v.phone || 'N/A',
    email: v.email,
    address: v.address || 'N/A',
    photo: v.photo_path ? `/storage/${v.photo_path}` : null,
    status: v.status || 'active',
    biometricRegistered: v.has_biometric_data || false,
    registrationDate: v.created_at,
    lastVisit: v.last_visit_date,
    totalVisits: v.total_visits || 0
  }
})

const latestVisitRequest = computed(() => {
  if (!visitorData.value?.visit_requests || visitorData.value.visit_requests.length === 0) return null
  // Return the most recent visit request
  const sorted = [...visitorData.value.visit_requests].sort((a: any, b: any) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
  return sorted[0]
})

const relatedInmates = computed(() => {
  if (!visitorData.value?.relationships) return []

  return visitorData.value.relationships.map((rel: any) => ({
    id: rel.id,
    inmateName: rel.inmate ?
      [rel.inmate.first_name, rel.inmate.middle_name, rel.inmate.last_name, rel.inmate.second_last_name].filter(Boolean).join(' ') :
      'N/A',
    inmateCode: rel.inmate?.inmate_number || rel.inmate?.inmate_code || 'N/A',
    relationship: rel.relationship_type?.name || 'N/A',
    hasPermission: rel.authorization_status === 'approved',
    lastVisit: rel.last_visit_date
  }))
})

const visitHistory = computed(() => {
  if (!visitorData.value?.visit_logs) return []

  return visitorData.value.visit_logs.map((visit: any) => {
    // Determinar la fecha de la visita
    // Prioridad: actual_entry_datetime > requested_visit_date > created_at
    let dateOnly = ''
    let timeOnly = ''

    if (visit.actual_entry_datetime) {
      // Visita con entrada registrada - usar fecha y hora de entrada
      const entryDate = visit.actual_entry_datetime
      if (entryDate.includes('T')) {
        const parts = entryDate.split('T')
        dateOnly = parts[0]
        timeOnly = parts[1]?.substring(0, 5) || ''
      } else if (entryDate.includes(' ')) {
        const parts = entryDate.split(' ')
        dateOnly = parts[0]
        timeOnly = parts[1]?.substring(0, 5) || ''
      }
    } else {
      // Visita programada - usar requested_visit_date para fecha y requested_start_time para hora
      if (visit.requested_visit_date) {
        const reqDate = visit.requested_visit_date
        if (reqDate.includes('T')) {
          dateOnly = reqDate.split('T')[0]
        } else if (reqDate.includes(' ')) {
          dateOnly = reqDate.split(' ')[0]
        } else {
          dateOnly = reqDate.substring(0, 10)
        }
      } else if (visit.created_at) {
        const createdDate = visit.created_at
        if (createdDate.includes('T')) {
          dateOnly = createdDate.split('T')[0]
        } else if (createdDate.includes(' ')) {
          dateOnly = createdDate.split(' ')[0]
        }
      }

      // Obtener hora de requested_start_time
      if (visit.requested_start_time) {
        const startTime = visit.requested_start_time
        if (startTime.includes('T')) {
          timeOnly = startTime.split('T')[1]?.substring(0, 5) || ''
        } else if (startTime.includes(' ')) {
          timeOnly = startTime.split(' ')[1]?.substring(0, 5) || ''
        } else if (startTime.includes(':')) {
          // Solo hora: "09:00:00" o "09:00"
          timeOnly = startTime.substring(0, 5)
        }
      }
    }

    // Fallback si no hay hora
    if (!timeOnly && visit.created_at) {
      const created = new Date(visit.created_at)
      timeOnly = created.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })
    }

    return {
      id: visit.id,
      date: dateOnly,
      time: timeOnly || '-',
      inmateName: visit.inmate ?
        [visit.inmate.first_name, visit.inmate.middle_name, visit.inmate.last_name, visit.inmate.second_last_name].filter(Boolean).join(' ') :
        'N/A',
      type: visit.visit_type?.name || 'N/A',
      duration: visit.actual_duration_minutes || visit.requested_duration_minutes || visit.duration_minutes || 0,
      observations: visit.visit_purpose || visit.entry_notes || visit.exit_notes || visit.decision_notes || '-'
    }
  })
})

// Methods
const loadVisitorData = async () => {
  try {
    loading.value = true
    const response = await ApiService.get(`/visitors/${route.params.id}`)
    visitorData.value = response.data

    // Also load visit requests for this visitor
    try {
      const reqResponse = await ApiService.get('/visit-requests', {
        params: { visitor_id: route.params.id, per_page: 10 }
      })
      // API returns { success, data: { data: [...], current_page, ... } } (paginated)
      const responseData = reqResponse.data
      let requests: any[] = []
      if (responseData?.data?.data && Array.isArray(responseData.data.data)) {
        // Paginated response: { success, data: { data: [...] } }
        requests = responseData.data.data
      } else if (Array.isArray(responseData?.data)) {
        // Direct array: { success, data: [...] }
        requests = responseData.data
      } else if (Array.isArray(responseData)) {
        requests = responseData
      }
      visitorData.value.visit_requests = requests
    } catch {
      visitorData.value.visit_requests = []
    }

    // Initialize status from latest visit request
    if (latestVisitRequest.value) {
      newStatus.value = latestVisitRequest.value.status || 'pending'
    }
  } catch (error: any) {
    console.error('Error loading visitor data:', error)
    Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'No se pudo cargar la informacion del visitante',
      icon: 'error',
      confirmButtonText: 'OK'
    }).then(() => {
      router.push('/visits/visitor-management')
    })
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString('es-GT')
}

const calculateAge = (birthDate: string) => {
  if (!birthDate) return 0
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'badge badge-success',
    inactive: 'badge badge-danger',
    suspended: 'badge badge-warning',
    pending_documentation: 'badge badge-warning',
    documentation_review: 'badge badge-info',
    background_check: 'badge badge-info',
    biometric_enrollment: 'badge badge-primary',
    approved: 'badge badge-success',
    rejected: 'badge badge-danger',
    revoked: 'badge badge-dark',
    expired: 'badge badge-secondary'
  }
  return classes[status] || 'badge badge-secondary'
}

const getRequestStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'badge badge-warning',
    under_review: 'badge badge-info',
    documents_verified: 'badge badge-primary',
    approved: 'badge badge-success',
    rejected: 'badge badge-danger',
    suspended: 'badge badge-dark'
  }
  return classes[status] || 'badge badge-secondary'
}

const getRequestStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    under_review: 'En revision',
    documents_verified: 'Documentos verificados',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    suspended: 'Suspendido'
  }
  return labels[status] || status
}

const getDocumentUrl = (path: string): string => {
  if (!path) return '#'
  return `${apiBaseUrl.value}/storage/${path}`
}

const getDocumentIcon = (path: string): string => {
  if (!path) return 'fas fa-file'
  const lower = path.toLowerCase()
  if (lower.endsWith('.pdf')) return 'fas fa-file-pdf'
  if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.gif') || lower.endsWith('.webp')) {
    return 'fas fa-file-image'
  }
  return 'fas fa-file'
}

const handleEdit = () => {
  router.push(`/visits/visitors/${route.params.id}/edit`)
}

const launchBiometricCapture = async () => {
  try {
    const response = await ApiService.post('/biometric-service/launch-enrollment', {
      enrollable_id: route.params.id,
      type: 'visitor',
      capture_type: 'enrollment'
    })
    const data = response.data
    if (data.success && data.data?.protocol_url) {
      window.location.href = data.data.protocol_url
      Swal.fire({
        title: 'Servicio Biometrico',
        text: 'Se esta abriendo el servicio de captura biometrica. Por favor autorice la apertura en su navegador.',
        icon: 'info',
        confirmButtonText: 'OK'
      })
    } else {
      Swal.fire({ title: 'Error', text: data.message || 'No se pudo generar la URL', icon: 'error' })
    }
  } catch (err: any) {
    Swal.fire({ title: 'Error', text: 'No se pudo iniciar el servicio biometrico', icon: 'error' })
  }
}

// Visit request status management
const updateVisitStatus = async () => {
  if (!latestVisitRequest.value) return

  const requestId = latestVisitRequest.value.id
  const statusLabel = getRequestStatusLabel(newStatus.value)

  const confirm = await Swal.fire({
    title: 'Confirmar cambio de estado',
    html: `Esta seguro de cambiar el estado de la solicitud a <strong>${statusLabel}</strong>?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Si, actualizar',
    cancelButtonText: 'Cancelar'
  })

  if (!confirm.isConfirmed) return

  try {
    updatingStatus.value = true
    await ApiService.post(`/visit-requests/${requestId}/update-status`, {
      status: newStatus.value,
      observations: observations.value || null,
      notify: notifyByEmail.value
    })

    Swal.fire({
      title: 'Estado actualizado',
      text: `La solicitud ha sido actualizada a "${statusLabel}"${notifyByEmail.value ? '. Se envio notificacion al visitante.' : '.'}`,
      icon: 'success',
      confirmButtonText: 'OK'
    })

    // Reload data to reflect changes
    await loadVisitorData()
    observations.value = ''
    notifyByEmail.value = false
  } catch (error: any) {
    console.error('Error updating visit status:', error)
    Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'No se pudo actualizar el estado de la solicitud',
      icon: 'error'
    })
  } finally {
    updatingStatus.value = false
  }
}

// PPL matching - search inmates
const debounceInmateSearch = () => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    searchInmates(inmateSearchQuery.value)
  }, 400)
}

const searchInmates = async (query: string) => {
  if (!query || query.length < 2) {
    inmateSearchResults.value = []
    return
  }

  try {
    const response = await ApiService.get('/inmates', {
      params: { search: query, status: 'active', per_page: 10 }
    })
    // API returns { success, data: { data: [...], ... } } (paginated)
    const responseData = response.data
    let data: any[] = []
    if (responseData?.data?.data && Array.isArray(responseData.data.data)) {
      data = responseData.data.data
    } else if (Array.isArray(responseData?.data)) {
      data = responseData.data
    } else if (Array.isArray(responseData)) {
      data = responseData
    }
    inmateSearchResults.value = data.map((i: any) => ({
      id: i.id,
      full_name: [i.first_name, i.middle_name, i.last_name, i.second_last_name].filter(Boolean).join(' '),
      inmate_number: i.inmate_number || i.inmate_code || '-',
      center: i.current_center || i.center || null
    }))
  } catch (error) {
    console.error('Error searching inmates:', error)
    inmateSearchResults.value = []
  }
}

const selectInmate = (inmate: any) => {
  selectedInmate.value = inmate
  inmateSearchQuery.value = inmate.full_name
  inmateSearchResults.value = []
}

const linkInmate = async () => {
  if (!selectedInmate.value || !latestVisitRequest.value) return

  const confirm = await Swal.fire({
    title: 'Vincular PPL',
    html: `Vincular al PPL <strong>${selectedInmate.value.full_name}</strong> (${selectedInmate.value.inmate_number}) con esta solicitud de visita?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Si, vincular',
    cancelButtonText: 'Cancelar'
  })

  if (!confirm.isConfirmed) return

  try {
    linkingInmate.value = true
    await ApiService.post(`/visit-requests/${latestVisitRequest.value.id}/link-inmate`, {
      inmate_id: selectedInmate.value.id
    })

    Swal.fire({
      title: 'PPL Vinculado',
      text: `Se vinculo exitosamente al PPL ${selectedInmate.value.full_name} con esta solicitud.`,
      icon: 'success',
      confirmButtonText: 'OK'
    })

    // Reset and reload
    selectedInmate.value = null
    inmateSearchQuery.value = ''
    inmateSearchResults.value = []
    await loadVisitorData()
  } catch (error: any) {
    console.error('Error linking inmate:', error)
    Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'No se pudo vincular el PPL a la solicitud',
      icon: 'error'
    })
  } finally {
    linkingInmate.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadVisitorData()
})
</script>
