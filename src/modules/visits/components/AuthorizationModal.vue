<template>
  <div 
    id="authorizationModal" 
    class="modal fade" 
    tabindex="-1" 
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">
            {{ getModalTitle() }}
          </h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" @click="close">
            <i class="ki-duotone ki-cross fs-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
        </div>

        <Form ref="formRef" @submit="handleSubmit" :validation-schema="validationSchema" v-slot="{ errors }">
          <div class="modal-body py-10 px-lg-17">
            <!-- Relationship Summary -->
            <div class="alert alert-light-primary d-flex align-items-center p-5 mb-7">
              <i class="ki-duotone ki-information-5 fs-2hx text-primary me-4">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
              <div class="d-flex flex-column">
                <h4 class="mb-1 text-primary">{{ $t('visits.relationships.relationship_summary') }}</h4>
                <div class="fs-6">
                  <strong>{{ $t('visits.common.visitor') }}:</strong> {{ relationship?.visitor?.full_name }} ({{ relationship?.visitor?.document_number }})<br>
                  <strong>{{ $t('visits.common.inmate') }}:</strong> {{ relationship?.inmate?.full_name }} ({{ relationship?.inmate?.document_number }})<br>
                  <strong>{{ $t('visits.relationships.relationship_type') }}:</strong> {{ relationship?.relationship_type?.name }}
                </div>
              </div>
            </div>

            <div class="row g-6">
              <!-- Authorization Action -->
              <div class="col-12" v-if="action === 'authorize'">
                <h4 class="mb-4">{{ $t('visits.relationships.authorization_details') }}</h4>
              </div>

              <!-- Authorization Date (for approve) -->
              <div class="col-md-6" v-if="action === 'authorize'">
                <div class="fv-row">
                  <label class="required form-label">{{ $t('visits.relationships.authorization_date') }}</label>
                  <Field
                    v-model="form.authorization_date"
                    name="authorization_date"
                    type="date"
                    class="form-control"
                    :class="{ 'is-invalid': errors.authorization_date }"
                  />
                  <ErrorMessage name="authorization_date" class="invalid-feedback" />
                </div>
              </div>

              <!-- Expiry Date (for approve) -->
              <div class="col-md-6" v-if="action === 'authorize'">
                <div class="fv-row">
                  <label class="required form-label">{{ $t('visits.relationships.authorization_expiry_date') }}</label>
                  <Field
                    v-model="form.authorization_expiry_date"
                    name="authorization_expiry_date"
                    type="date"
                    class="form-control"
                    :class="{ 'is-invalid': errors.authorization_expiry_date }"
                  />
                  <ErrorMessage name="authorization_expiry_date" class="invalid-feedback" />
                </div>
              </div>

              <!-- Visit Restrictions (for approve) -->
              <div class="col-12" v-if="action === 'authorize'">
                <h4 class="mb-4 mt-6">{{ $t('visits.relationships.visit_restrictions') }}</h4>
              </div>

              <div class="col-md-6" v-if="action === 'authorize'">
                <div class="fv-row">
                  <label class="form-label">{{ $t('visits.relationships.visit_frequency_limit') }}</label>
                  <Field
                    v-model="form.visit_frequency_limit"
                    name="visit_frequency_limit"
                    type="number"
                    class="form-control"
                    :class="{ 'is-invalid': errors.visit_frequency_limit }"
                    :placeholder="$t('visits.relationships.visit_frequency_limit_placeholder')"
                    min="1"
                  />
                  <ErrorMessage name="visit_frequency_limit" class="invalid-feedback" />
                  <div class="form-text">
                    {{ $t('visits.relationships.visit_frequency_limit_help') }}
                  </div>
                </div>
              </div>

              <div class="col-md-6" v-if="action === 'authorize'">
                <div class="fv-row">
                  <label class="form-label">{{ $t('visits.relationships.visit_duration_limit') }}</label>
                  <Field
                    v-model="form.visit_duration_limit"
                    name="visit_duration_limit"
                    type="number"
                    class="form-control"
                    :class="{ 'is-invalid': errors.visit_duration_limit }"
                    :placeholder="$t('visits.relationships.visit_duration_limit_placeholder')"
                    min="15"
                    max="240"
                  />
                  <ErrorMessage name="visit_duration_limit" class="invalid-feedback" />
                  <div class="form-text">
                    {{ $t('visits.relationships.visit_duration_limit_help') }}
                  </div>
                </div>
              </div>

              <!-- Allowed Visit Days -->
              <div class="col-12" v-if="action === 'authorize'">
                <div class="fv-row">
                  <label class="form-label">{{ $t('visits.relationships.allowed_visit_days') }}</label>
                  <div class="row g-3 mt-1">
                    <div class="col-md-3" v-for="day in daysOfWeek" :key="day">
                      <div class="form-check form-check-custom form-check-solid">
                        <Field
                          type="checkbox"
                          :name="`allowed_visit_days.${day}`"
                          :value="day"
                          class="form-check-input"
                          v-model="form.allowed_visit_days"
                        />
                        <label class="form-check-label">
                          {{ $t(`visits.relationships.days_of_week.${day}`) }}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="form-text">
                    {{ $t('visits.relationships.allowed_visit_days_help') }}
                  </div>
                </div>
              </div>

              <!-- Allowed Visit Hours -->
              <div class="col-12" v-if="action === 'authorize'">
                <h5 class="mb-4 mt-4">{{ $t('visits.relationships.allowed_visit_hours') }}</h5>
              </div>

              <div class="col-md-6" v-if="action === 'authorize'">
                <div class="fv-row">
                  <label class="form-label">{{ $t('visits.relationships.visit_hours_start') }}</label>
                  <Field
                    v-model="form.allowed_visit_hours_start"
                    name="allowed_visit_hours_start"
                    type="time"
                    class="form-control"
                    :class="{ 'is-invalid': errors.allowed_visit_hours_start }"
                  />
                  <ErrorMessage name="allowed_visit_hours_start" class="invalid-feedback" />
                </div>
              </div>

              <div class="col-md-6" v-if="action === 'authorize'">
                <div class="fv-row">
                  <label class="form-label">{{ $t('visits.relationships.visit_hours_end') }}</label>
                  <Field
                    v-model="form.allowed_visit_hours_end"
                    name="allowed_visit_hours_end"
                    type="time"
                    class="form-control"
                    :class="{ 'is-invalid': errors.allowed_visit_hours_end }"
                  />
                  <ErrorMessage name="allowed_visit_hours_end" class="invalid-feedback" />
                  <div class="form-text">
                    {{ $t('visits.relationships.allowed_visit_hours_help') }}
                  </div>
                </div>
              </div>

              <!-- Rejection Reason (for reject) -->
              <div class="col-12" v-if="action === 'reject'">
                <div class="fv-row">
                  <label class="required form-label">{{ $t('visits.relationships.rejection_reason') }}</label>
                  <Field
                    v-model="form.rejection_reason"
                    name="rejection_reason"
                    as="select"
                    class="form-select"
                    :class="{ 'is-invalid': errors.rejection_reason }"
                  >
                    <option value="">{{ $t('common.select_option') }}</option>
                    <option value="security_risk">{{ $t('visits.relationships.rejection_reasons.security_risk') }}</option>
                    <option value="false_information">{{ $t('visits.relationships.rejection_reasons.false_information') }}</option>
                    <option value="criminal_record">{{ $t('visits.relationships.rejection_reasons.criminal_record') }}</option>
                    <option value="previous_violations">{{ $t('visits.relationships.rejection_reasons.previous_violations') }}</option>
                    <option value="other">{{ $t('visits.relationships.rejection_reasons.other') }}</option>
                  </Field>
                  <ErrorMessage name="rejection_reason" class="invalid-feedback" />
                </div>
              </div>

              <!-- Suspension Reason (for suspend) -->
              <div class="col-12" v-if="action === 'suspend'">
                <div class="fv-row">
                  <label class="required form-label">{{ $t('visits.relationships.suspension_reason') }}</label>
                  <Field
                    v-model="form.suspension_reason"
                    name="suspension_reason"
                    as="select"
                    class="form-select"
                    :class="{ 'is-invalid': errors.suspension_reason }"
                  >
                    <option value="">{{ $t('common.select_option') }}</option>
                    <option value="policy_violation">{{ $t('visits.relationships.suspension_reasons.policy_violation') }}</option>
                    <option value="security_concern">{{ $t('visits.relationships.suspension_reasons.security_concern') }}</option>
                    <option value="pending_investigation">{{ $t('visits.relationships.suspension_reasons.pending_investigation') }}</option>
                    <option value="inmate_request">{{ $t('visits.relationships.suspension_reasons.inmate_request') }}</option>
                    <option value="other">{{ $t('visits.relationships.suspension_reasons.other') }}</option>
                  </Field>
                  <ErrorMessage name="suspension_reason" class="invalid-feedback" />
                </div>
              </div>

              <!-- Suspension End Date (for suspend) -->
              <div class="col-md-6" v-if="action === 'suspend'">
                <div class="fv-row">
                  <label class="form-label">{{ $t('visits.relationships.suspension_end_date') }}</label>
                  <Field
                    v-model="form.suspension_end_date"
                    name="suspension_end_date"
                    type="date"
                    class="form-control"
                    :class="{ 'is-invalid': errors.suspension_end_date }"
                  />
                  <ErrorMessage name="suspension_end_date" class="invalid-feedback" />
                  <div class="form-text">
                    {{ $t('visits.relationships.suspension_end_date_help') }}
                  </div>
                </div>
              </div>

              <!-- Notes/Comments -->
              <div class="col-12">
                <div class="fv-row">
                  <label class="form-label" :class="{ required: isNotesRequired }">
                    {{ $t('visits.relationships.notes') }}
                  </label>
                  <Field
                    v-model="form.notes"
                    name="notes"
                    as="textarea"
                    class="form-control"
                    :class="{ 'is-invalid': errors.notes }"
                    rows="4"
                    :placeholder="getNotesPlaceholder()"
                  />
                  <ErrorMessage name="notes" class="invalid-feedback" />
                </div>
              </div>

              <!-- Additional Options -->
              <div class="col-12" v-if="action === 'authorize'">
                <div class="form-check form-switch">
                  <Field
                    v-model="form.notify_visitor"
                    name="notify_visitor"
                    type="checkbox"
                    class="form-check-input"
                    value="1"
                  />
                  <label class="form-check-label">
                    {{ $t('visits.relationships.notify_visitor_of_authorization') }}
                  </label>
                </div>
              </div>

              <div class="col-12" v-if="action === 'suspend'">
                <div class="form-check form-switch">
                  <Field
                    v-model="form.notify_parties"
                    name="notify_parties"
                    type="checkbox"
                    class="form-check-input"
                    value="1"
                  />
                  <label class="form-check-label">
                    {{ $t('visits.relationships.notify_parties_of_suspension') }}
                  </label>
                </div>
              </div>
            </div>

            <!-- Warning Messages -->
            <div v-if="action === 'reject'" class="alert alert-light-danger d-flex align-items-center p-5 mt-7">
              <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="d-flex flex-column">
                <h4 class="mb-1 text-danger">{{ $t('common.warning') }}</h4>
                <span>{{ $t('visits.relationships.reject_warning') }}</span>
              </div>
            </div>

            <div v-if="action === 'suspend'" class="alert alert-light-warning d-flex align-items-center p-5 mt-7">
              <i class="ki-duotone ki-information-5 fs-2hx text-warning me-4">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
              <div class="d-flex flex-column">
                <h4 class="mb-1 text-warning">{{ $t('common.attention') }}</h4>
                <span>{{ $t('visits.relationships.suspend_warning') }}</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="close">
              {{ $t('common.cancel') }}
            </button>
            <button type="submit" class="btn" :class="getSubmitButtonClass()" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ getSubmitButtonText() }}
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { Modal } from 'bootstrap'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'
import { visitorRelationshipsApi } from '@/services/api/visits'
import { useToast } from '@/composables/useToast'
import type { VisitorRelationship } from '@/types/visits'

// Props
interface Props {
  relationship?: VisitorRelationship | null
  action: 'authorize' | 'reject' | 'suspend' | 'reactivate' | 'renew'
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  processed: [relationship: VisitorRelationship]
}>()

// Composables
const { t } = useI18n()
const { showToast } = useToast()

// State
const modalRef = ref<HTMLElement>()
const modal = ref<Modal>()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  authorization_date: new Date().toISOString().split('T')[0],
  authorization_expiry_date: '',
  visit_frequency_limit: null,
  visit_duration_limit: null,
  allowed_visit_days: [] as string[],
  allowed_visit_hours_start: '09:00',
  allowed_visit_hours_end: '17:00',
  rejection_reason: '',
  suspension_reason: '',
  suspension_end_date: '',
  notes: '',
  notify_visitor: true,
  notify_parties: true
})

// Days of week
const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

// Computed
const isNotesRequired = computed(() => {
  return props.action === 'reject' ||
         (props.action === 'suspend' && form.suspension_reason === 'other') ||
         (props.action === 'reject' && form.rejection_reason === 'other')
})

// Validation Schema
const validationSchema = computed(() => {
  const baseSchema: any = {}

  if (props.action === 'authorize' || props.action === 'renew') {
    baseSchema.authorization_date = yup.string().required('La fecha de autorización es requerida')
    baseSchema.authorization_expiry_date = yup.string().required('La fecha de vencimiento es requerida')
  }

  if (props.action === 'reject') {
    baseSchema.rejection_reason = yup.string().required('El motivo de rechazo es requerido')
  }

  if (props.action === 'suspend') {
    baseSchema.suspension_reason = yup.string().required('El motivo de suspensión es requerido')
  }

  if (isNotesRequired.value) {
    baseSchema.notes = yup.string().required('Las notas son requeridas')
  }

  return yup.object(baseSchema)
})

// Methods
const initializeModal = async () => {
  await nextTick()
  if (modalRef.value) {
    modal.value = new Modal(modalRef.value)
    modal.value.show()
  }
}

const getModalTitle = () => {
  const titles = {
    authorize: t('visits.relationships.authorize_relationship'),
    reject: t('visits.relationships.reject_relationship'),
    suspend: t('visits.relationships.suspend_relationship'),
    reactivate: t('visits.relationships.reactivate_relationship'),
    renew: t('visits.relationships.renew_relationship')
  }
  return titles[props.action] || ''
}

const getSubmitButtonClass = () => {
  const classes = {
    authorize: 'btn-success',
    reject: 'btn-danger',
    suspend: 'btn-warning',
    reactivate: 'btn-success',
    renew: 'btn-primary'
  }
  return classes[props.action] || 'btn-primary'
}

const getSubmitButtonText = () => {
  const texts = {
    authorize: t('visits.relationships.authorize'),
    reject: t('visits.relationships.reject'),
    suspend: t('visits.relationships.suspend'),
    reactivate: t('visits.relationships.reactivate'),
    renew: t('visits.relationships.renew')
  }
  return texts[props.action] || t('common.submit')
}

const getNotesPlaceholder = () => {
  const placeholders = {
    authorize: t('visits.relationships.authorization_notes_placeholder'),
    reject: t('visits.relationships.rejection_notes_placeholder'),
    suspend: t('visits.relationships.suspension_notes_placeholder'),
    reactivate: t('visits.relationships.reactivation_notes_placeholder'),
    renew: t('visits.relationships.renewal_notes_placeholder')
  }
  return placeholders[props.action] || t('visits.relationships.notes_placeholder')
}

const handleSubmit = async () => {
  if (!props.relationship) return
  
  try {
    loading.value = true
    
    let response
    const payload = {
      notes: form.notes,
      ...getActionSpecificPayload()
    }
    
    switch (props.action) {
      case 'authorize':
        response = await visitorRelationshipsApi.authorize(props.relationship.id, payload)
        showToast(t('visits.relationships.authorized_successfully'), 'success')
        break
      case 'reject':
        response = await visitorRelationshipsApi.reject(props.relationship.id, payload)
        showToast(t('visits.relationships.rejected_successfully'), 'success')
        break
      case 'suspend':
        response = await visitorRelationshipsApi.suspend(props.relationship.id, payload)
        showToast(t('visits.relationships.suspended_successfully'), 'success')
        break
      case 'reactivate':
        response = await visitorRelationshipsApi.reactivate(props.relationship.id, payload)
        showToast(t('visits.relationships.reactivated_successfully'), 'success')
        break
      case 'renew':
        response = await visitorRelationshipsApi.renew(props.relationship.id, payload)
        showToast(t('visits.relationships.renewed_successfully'), 'success')
        break
    }
    
    if (response) {
      emit('processed', response.data)
      close()
    }
  } catch (error: any) {
    showToast(error.response?.data?.message || t('common.error_processing'), 'error')
  } finally {
    loading.value = false
  }
}

const getActionSpecificPayload = () => {
  switch (props.action) {
    case 'authorize':
      return {
        authorization_date: form.authorization_date,
        authorization_expiry_date: form.authorization_expiry_date,
        visit_frequency_limit: form.visit_frequency_limit,
        visit_duration_limit: form.visit_duration_limit,
        allowed_visit_days: form.allowed_visit_days.length > 0 ? form.allowed_visit_days : null,
        allowed_visit_hours_start: form.allowed_visit_hours_start,
        allowed_visit_hours_end: form.allowed_visit_hours_end,
        notify_visitor: form.notify_visitor
      }
    case 'reject':
      return {
        rejection_reason: form.rejection_reason
      }
    case 'suspend':
      return {
        suspension_reason: form.suspension_reason,
        suspension_end_date: form.suspension_end_date,
        notify_parties: form.notify_parties
      }
    case 'reactivate':
    case 'renew':
      return {}
    default:
      return {}
  }
}

const close = () => {
  modal.value?.hide()
  emit('close')
}

// Set default expiry date (1 year from authorization date)
const setDefaultExpiryDate = () => {
  if (props.action === 'authorize') {
    const authDate = new Date(form.authorization_date)
    authDate.setFullYear(authDate.getFullYear() + 1)
    form.authorization_expiry_date = authDate.toISOString().split('T')[0]
  }
}

// Load existing relationship data into form
const loadRelationshipData = () => {
  if (!props.relationship) return

  // Load visit restrictions from existing relationship
  if (props.relationship.max_visits_per_month) {
    form.visit_frequency_limit = props.relationship.max_visits_per_month
  }

  if (props.relationship.max_visit_duration_minutes) {
    form.visit_duration_limit = props.relationship.max_visit_duration_minutes
  }

  if (props.relationship.allowed_visit_days && Array.isArray(props.relationship.allowed_visit_days)) {
    form.allowed_visit_days = props.relationship.allowed_visit_days
  }

  if (props.relationship.allowed_visit_hours_start) {
    form.allowed_visit_hours_start = props.relationship.allowed_visit_hours_start
  }

  if (props.relationship.allowed_visit_hours_end) {
    form.allowed_visit_hours_end = props.relationship.allowed_visit_hours_end
  }

  // Load authorization dates if they exist (convert to YYYY-MM-DD format)
  if (props.relationship.authorization_date) {
    // Handle both date string formats
    const authDate = new Date(props.relationship.authorization_date)
    form.authorization_date = authDate.toISOString().split('T')[0]
  }

  if (props.relationship.authorization_expiry_date) {
    // Handle both date string formats
    const expiryDate = new Date(props.relationship.authorization_expiry_date)
    form.authorization_expiry_date = expiryDate.toISOString().split('T')[0]
  }

  console.log('Loaded relationship data:', {
    authorization_date: form.authorization_date,
    authorization_expiry_date: form.authorization_expiry_date,
    visit_frequency_limit: form.visit_frequency_limit,
    visit_duration_limit: form.visit_duration_limit,
    allowed_visit_days: form.allowed_visit_days,
    allowed_visit_hours_start: form.allowed_visit_hours_start,
    allowed_visit_hours_end: form.allowed_visit_hours_end
  })
}

// Lifecycle
onMounted(async () => {
  await initializeModal()
  loadRelationshipData() // Load existing data first

  // Only set default expiry if not already set
  if (!form.authorization_expiry_date) {
    setDefaultExpiryDate()
  }

  modalRef.value?.addEventListener('hidden.bs.modal', () => {
    emit('close')
  })
})
</script>