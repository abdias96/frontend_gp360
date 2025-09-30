<template>
  <div 
    id="relationshipModal" 
    class="modal fade" 
    tabindex="-1" 
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">
            {{ relationship ? $t('visits.relationships.edit_relationship') : $t('visits.relationships.new_relationship') }}
          </h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" @click="close">
            <i class="ki-duotone ki-cross fs-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
        </div>

        <Form ref="formRef" @submit="handleSubmit" v-slot="{ errors }">
          <div class="modal-body py-10 px-lg-17">
            <div class="row g-6">
              <!-- Visitor Selection -->
              <div class="col-12">
                <h4 class="mb-4">{{ $t('visits.relationships.visitor_information') }}</h4>
              </div>
              
              <div class="col-md-6">
                <div class="fv-row">
                  <label class="required form-label">{{ $t('visits.relationships.visitor') }}</label>
                  <Field
                    v-model="form.visitor_id"
                    name="visitor_id"
                    as="select"
                    class="form-select"
                    :class="{ 'is-invalid': errors.visitor_id }"
                    rules="required"
                    :disabled="!!relationship"
                  >
                    <option value="">{{ $t('common.select_option') }}</option>
                    <option v-for="visitor in visitors" :key="visitor.id" :value="visitor.id">
                      {{ visitor.full_name }} ({{ visitor.document_number }})
                    </option>
                  </Field>
                  <ErrorMessage name="visitor_id" class="invalid-feedback" />
                  <div v-if="relationship" class="form-text">
                    {{ $t('visits.relationships.visitor_cannot_be_changed') }}
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="fv-row">
                  <label class="required form-label">{{ $t('visits.relationships.inmate') }}</label>
                  <Field
                    v-model="form.inmate_id"
                    name="inmate_id"
                    as="select"
                    class="form-select"
                    :class="{ 'is-invalid': errors.inmate_id }"
                    rules="required"
                    :disabled="!!relationship"
                  >
                    <option value="">{{ $t('common.select_option') }}</option>
                    <option v-for="inmate in inmates" :key="inmate.id" :value="inmate.id">
                      {{ inmate.full_name }} ({{ inmate.document_number }})
                    </option>
                  </Field>
                  <ErrorMessage name="inmate_id" class="invalid-feedback" />
                  <div v-if="relationship" class="form-text">
                    {{ $t('visits.relationships.inmate_cannot_be_changed') }}
                  </div>
                </div>
              </div>

              <!-- Relationship Details -->
              <div class="col-12">
                <h4 class="mb-4 mt-6">{{ $t('visits.relationships.relationship_details') }}</h4>
              </div>

              <div class="col-md-6">
                <div class="fv-row">
                  <label class="required form-label">{{ $t('visits.relationships.relationship_type') }}</label>
                  <Field
                    v-model="form.relationship_type_id"
                    name="relationship_type_id"
                    as="select"
                    class="form-select"
                    :class="{ 'is-invalid': errors.relationship_type_id }"
                    rules="required"
                    @change="onRelationshipTypeChange"
                  >
                    <option value="">{{ $t('common.select_option') }}</option>
                    <option v-for="type in relationshipTypes" :key="type.id" :value="type.id">
                      {{ type.name }}
                    </option>
                  </Field>
                  <ErrorMessage name="relationship_type_id" class="invalid-feedback" />
                </div>
              </div>

              <div class="col-md-6">
                <div class="fv-row">
                  <label class="form-label">{{ $t('visits.relationships.verification_document') }}</label>
                  <Field
                    v-model="form.verification_document"
                    name="verification_document"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.verification_document }"
                    :placeholder="$t('visits.relationships.verification_document_placeholder')"
                  />
                  <ErrorMessage name="verification_document" class="invalid-feedback" />
                </div>
              </div>

              <!-- Relationship Characteristics -->
              <div class="col-md-4">
                <div class="form-check form-switch">
                  <Field
                    v-model="form.is_consanguineous"
                    name="is_consanguineous"
                    type="checkbox"
                    class="form-check-input"
                    value="1"
                  />
                  <label class="form-check-label">
                    {{ $t('visits.relationships.is_consanguineous') }}
                  </label>
                </div>
              </div>

              <div class="col-md-4">
                <div class="form-check form-switch">
                  <Field
                    v-model="form.requires_supervision"
                    name="requires_supervision"
                    type="checkbox"
                    class="form-check-input"
                    value="1"
                  />
                  <label class="form-check-label">
                    {{ $t('visits.relationships.requires_supervision') }}
                  </label>
                </div>
              </div>

              <div class="col-md-4">
                <div class="form-check form-switch">
                  <Field
                    v-model="form.is_legal_representative"
                    name="is_legal_representative"
                    type="checkbox"
                    class="form-check-input"
                    value="1"
                  />
                  <label class="form-check-label">
                    {{ $t('visits.relationships.is_legal_representative') }}
                  </label>
                </div>
              </div>

              <!-- Visit Restrictions -->
              <div class="col-12">
                <h4 class="mb-4 mt-6">{{ $t('visits.relationships.visit_restrictions') }}</h4>
              </div>

              <div class="col-md-6">
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

              <div class="col-md-6">
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

              <!-- Authorization -->
              <div class="col-12" v-if="!relationship">
                <h4 class="mb-4 mt-6">{{ $t('visits.relationships.authorization') }}</h4>
              </div>

              <div class="col-md-6" v-if="!relationship">
                <div class="fv-row">
                  <label class="form-label">{{ $t('visits.relationships.authorization_date') }}</label>
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

              <div class="col-md-6" v-if="!relationship">
                <div class="fv-row">
                  <label class="form-label">{{ $t('visits.relationships.authorization_expiry_date') }}</label>
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

              <!-- Notes -->
              <div class="col-12">
                <div class="fv-row">
                  <label class="form-label">{{ $t('visits.relationships.notes') }}</label>
                  <Field
                    v-model="form.notes"
                    name="notes"
                    as="textarea"
                    class="form-control"
                    :class="{ 'is-invalid': errors.notes }"
                    rows="3"
                    :placeholder="$t('visits.relationships.notes_placeholder')"
                  />
                  <ErrorMessage name="notes" class="invalid-feedback" />
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="close">
              {{ $t('common.cancel') }}
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ relationship ? $t('common.update') : $t('common.create') }}
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import { Modal } from 'bootstrap'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { visitorRelationshipsApi } from '@/services/api/visits'
import { catalogsApi } from '@/services/api/catalogs'
import { useToast } from '@/composables/useToast'
import type { VisitorRelationship } from '@/types/visits'

// Props
interface Props {
  relationship?: VisitorRelationship | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  saved: [relationship: VisitorRelationship]
}>()

// Composables
const { t } = useI18n()
const { showToast } = useToast()

// State
const modalRef = ref<HTMLElement>()
const modal = ref<Modal>()
const formRef = ref()
const loading = ref(false)

const visitors = ref([])
const inmates = ref([])
const relationshipTypes = ref([])

const form = reactive({
  visitor_id: '',
  inmate_id: '',
  relationship_type_id: '',
  verification_document: '',
  is_consanguineous: false,
  requires_supervision: false,
  is_legal_representative: false,
  visit_frequency_limit: null,
  visit_duration_limit: null,
  authorization_date: '',
  authorization_expiry_date: '',
  notes: ''
})

// Methods
const initializeModal = async () => {
  await nextTick()
  if (modalRef.value) {
    modal.value = new Modal(modalRef.value)
    modal.value.show()
  }
}

const loadCatalogs = async () => {
  try {
    const [visitorsRes, inmatesRes, typesRes] = await Promise.all([
      catalogsApi.getVisitors(),
      catalogsApi.getInmates(),
      catalogsApi.getRelationshipTypes()
    ])
    
    visitors.value = visitorsRes.data
    inmates.value = inmatesRes.data
    relationshipTypes.value = typesRes.data
  } catch (error) {
    showToast(t('common.error_loading_catalogs'), 'error')
  }
}

const onRelationshipTypeChange = () => {
  const selectedType = relationshipTypes.value.find(t => t.id === form.relationship_type_id)
  if (selectedType) {
    // Auto-set consanguineous based on relationship type
    form.is_consanguineous = selectedType.is_consanguineous || false
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true
    
    let response
    if (props.relationship) {
      response = await visitorRelationshipsApi.update(props.relationship.id, form)
      showToast(t('visits.relationships.updated_successfully'), 'success')
    } else {
      response = await visitorRelationshipsApi.create(form)
      showToast(t('visits.relationships.created_successfully'), 'success')
    }
    
    emit('saved', response.data)
    close()
  } catch (error: any) {
    showToast(error.response?.data?.message || t('common.error_saving'), 'error')
  } finally {
    loading.value = false
  }
}

const close = () => {
  modal.value?.hide()
  emit('close')
}

// Watch for relationship prop changes
watch(() => props.relationship, (newRelationship) => {
  if (newRelationship) {
    Object.assign(form, {
      visitor_id: newRelationship.visitor_id,
      inmate_id: newRelationship.inmate_id,
      relationship_type_id: newRelationship.relationship_type_id,
      verification_document: newRelationship.verification_document || '',
      is_consanguineous: newRelationship.is_consanguineous || false,
      requires_supervision: newRelationship.requires_supervision || false,
      is_legal_representative: newRelationship.is_legal_representative || false,
      visit_frequency_limit: newRelationship.visit_frequency_limit,
      visit_duration_limit: newRelationship.visit_duration_limit,
      authorization_date: newRelationship.authorization_date || '',
      authorization_expiry_date: newRelationship.authorization_expiry_date || '',
      notes: newRelationship.notes || ''
    })
  } else {
    // Reset form
    Object.assign(form, {
      visitor_id: '',
      inmate_id: '',
      relationship_type_id: '',
      verification_document: '',
      is_consanguineous: false,
      requires_supervision: false,
      is_legal_representative: false,
      visit_frequency_limit: null,
      visit_duration_limit: null,
      authorization_date: '',
      authorization_expiry_date: '',
      notes: ''
    })
  }
}, { immediate: true })

// Lifecycle
onMounted(async () => {
  await initializeModal()
  await loadCatalogs()
  
  modalRef.value?.addEventListener('hidden.bs.modal', () => {
    emit('close')
  })
})
</script>