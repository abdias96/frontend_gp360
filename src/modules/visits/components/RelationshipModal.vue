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

        <Form ref="formRef" @submit="handleSubmit" :validation-schema="validationSchema" v-slot="{ errors }">
          <div class="modal-body py-10 px-lg-17">
            <div class="row g-6">
              <!-- Visitor Selection -->
              <div class="col-12">
                <h4 class="mb-4">{{ $t('visits.relationships.visitor_information') }}</h4>
              </div>
              
              <div class="col-md-6">
                <div class="fv-row">
                  <label class="required form-label">{{ $t('visits.relationships.visitor') }}</label>
                  <div v-if="relationship" class="form-control bg-light">
                    {{ relationship.visitor?.full_name || relationship.visitor_full_name }} ({{ relationship.visitor?.document_number || relationship.visitor_document_number }})
                    <div class="form-text mt-2">
                      {{ $t('visits.relationships.visitor_cannot_be_changed') }}
                    </div>
                  </div>
                  <div v-else class="position-relative">
                    <Field v-model="form.visitor_id" name="visitor_id" v-slot="{ value }">
                      <input
                        type="text"
                        v-model="visitorSearch"
                        class="form-control"
                        :class="{ 'is-invalid': errors.visitor_id }"
                        :placeholder="$t('common.search') + ' ' + $t('visits.relationships.visitor').toLowerCase() + '...'"
                        @focus="showVisitorDropdown = true"
                        @blur="handleVisitorBlur"
                        autocomplete="off"
                      />
                      <input type="hidden" :value="value" />
                    </Field>

                    <!-- Dropdown de resultados -->
                    <div
                      v-if="showVisitorDropdown && filteredVisitors.length > 0"
                      class="position-absolute w-100 mt-1 bg-white border rounded shadow-sm"
                      style="max-height: 250px; overflow-y: auto; z-index: 1050;"
                    >
                      <div
                        v-for="visitor in filteredVisitors"
                        :key="visitor.id"
                        class="dropdown-item cursor-pointer"
                        @mousedown.prevent="selectVisitor(visitor)"
                      >
                        <div class="d-flex align-items-center">
                          <div class="symbol symbol-35px me-3">
                            <div class="symbol-label bg-light-primary">
                              <i class="ki-duotone ki-user fs-2 text-primary">
                                <span class="path1"></span>
                                <span class="path2"></span>
                              </i>
                            </div>
                          </div>
                          <div class="flex-grow-1">
                            <div class="fw-bold">{{ visitor.full_name }}</div>
                            <div class="text-muted fs-7">{{ visitor.document_number }}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Visitante seleccionado -->
                    <div v-if="selectedVisitor" class="mt-2 p-3 bg-light-success rounded border border-success">
                      <div class="d-flex align-items-center">
                        <div class="symbol symbol-40px me-3">
                          <div class="symbol-label bg-success">
                            <i class="ki-duotone ki-user fs-2 text-white">
                              <span class="path1"></span>
                              <span class="path2"></span>
                            </i>
                          </div>
                        </div>
                        <div class="flex-grow-1">
                          <div class="fw-bold text-gray-800">{{ selectedVisitor.full_name }}</div>
                          <div class="text-muted fs-7">{{ selectedVisitor.document_number }}</div>
                        </div>
                        <button
                          type="button"
                          class="btn btn-sm btn-icon btn-light-danger"
                          @click="clearVisitor"
                        >
                          <i class="ki-duotone ki-cross fs-2">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                        </button>
                      </div>
                    </div>

                    <ErrorMessage name="visitor_id" class="invalid-feedback d-block" />
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="fv-row">
                  <label class="required form-label">{{ $t('visits.relationships.inmate') }}</label>
                  <div v-if="relationship" class="form-control bg-light">
                    {{ relationship.inmate?.full_name }} ({{ relationship.inmate?.document_number }})
                    <div class="form-text mt-2">
                      {{ $t('visits.relationships.inmate_cannot_be_changed') }}
                    </div>
                  </div>
                  <div v-else class="position-relative">
                    <Field v-model="form.inmate_id" name="inmate_id" v-slot="{ value }">
                      <input
                        type="text"
                        v-model="inmateSearch"
                        class="form-control"
                        :class="{ 'is-invalid': errors.inmate_id }"
                        :placeholder="$t('common.search') + ' ' + $t('visits.relationships.inmate') + '...'"
                        @focus="showInmateDropdown = true"
                        @blur="handleInmateBlur"
                        autocomplete="off"
                      />
                      <input type="hidden" :value="value" />
                    </Field>

                    <!-- Dropdown de resultados -->
                    <div
                      v-if="showInmateDropdown && filteredInmates.length > 0"
                      class="position-absolute w-100 mt-1 bg-white border rounded shadow-sm"
                      style="max-height: 250px; overflow-y: auto; z-index: 1050;"
                    >
                      <div
                        v-for="inmate in filteredInmates"
                        :key="inmate.id"
                        class="dropdown-item cursor-pointer"
                        @mousedown.prevent="selectInmate(inmate)"
                      >
                        <div class="d-flex align-items-center">
                          <div class="symbol symbol-35px me-3">
                            <div class="symbol-label bg-light-warning">
                              <i class="ki-duotone ki-profile-user fs-2 text-warning">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                                <span class="path4"></span>
                              </i>
                            </div>
                          </div>
                          <div class="flex-grow-1">
                            <div class="fw-bold">{{ inmate.full_name }}</div>
                            <div class="text-muted fs-7">{{ inmate.inmate_number || inmate.document_number }}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- PPL seleccionado -->
                    <div v-if="selectedInmate" class="mt-2 p-3 bg-light-warning rounded border border-warning">
                      <div class="d-flex align-items-center">
                        <div class="symbol symbol-40px me-3">
                          <div class="symbol-label bg-warning">
                            <i class="ki-duotone ki-profile-user fs-2 text-white">
                              <span class="path1"></span>
                              <span class="path2"></span>
                              <span class="path3"></span>
                              <span class="path4"></span>
                            </i>
                          </div>
                        </div>
                        <div class="flex-grow-1">
                          <div class="fw-bold text-gray-800">{{ selectedInmate.full_name }}</div>
                          <div class="text-muted fs-7">{{ selectedInmate.inmate_number || selectedInmate.document_number }}</div>
                        </div>
                        <button
                          type="button"
                          class="btn btn-sm btn-icon btn-light-danger"
                          @click="clearInmate"
                        >
                          <i class="ki-duotone ki-cross fs-2">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                        </button>
                      </div>
                    </div>

                    <ErrorMessage name="inmate_id" class="invalid-feedback d-block" />
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
                    :value="true"
                    :unchecked-value="false"
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
                    :value="true"
                    :unchecked-value="false"
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
                    :value="true"
                    :unchecked-value="false"
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
import { ref, reactive, watch, onMounted, nextTick, computed } from 'vue'
import { Modal } from 'bootstrap'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'
import { visitorRelationshipsApi } from '@/services/api/visits'
import ApiService from '@/core/services/ApiService'
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

// Validation Schema - conditional based on edit mode
const validationSchema = computed(() => {
  if (props.relationship) {
    // Edit mode: visitor and inmate cannot be changed
    return yup.object({
      relationship_type_id: yup.string().required('El tipo de relación es requerido')
    })
  } else {
    // Create mode: visitor and inmate are required
    return yup.object({
      visitor_id: yup.string().required('El visitante es requerido'),
      inmate_id: yup.string().required('El PPL es requerido'),
      relationship_type_id: yup.string().required('El tipo de relación es requerido')
    })
  }
})

// State
const modalRef = ref<HTMLElement>()
const modal = ref<Modal>()
const formRef = ref()
const loading = ref(false)

const visitors = ref([])
const inmates = ref([])
const relationshipTypes = ref([])

// Search states
const visitorSearch = ref('')
const inmateSearch = ref('')
const showVisitorDropdown = ref(false)
const showInmateDropdown = ref(false)
const selectedVisitor = ref(null)
const selectedInmate = ref(null)

// Filtered lists
const filteredVisitors = computed(() => {
  if (!visitorSearch.value) return visitors.value
  const search = visitorSearch.value.toLowerCase()
  return visitors.value.filter(v =>
    v.full_name?.toLowerCase().includes(search) ||
    v.document_number?.toLowerCase().includes(search)
  )
})

const filteredInmates = computed(() => {
  if (!inmateSearch.value) return inmates.value
  const search = inmateSearch.value.toLowerCase()
  return inmates.value.filter(i =>
    i.full_name?.toLowerCase().includes(search) ||
    i.document_number?.toLowerCase().includes(search)
  )
})

// Watch for search input changes to clear selection if user is typing after selecting
watch(visitorSearch, (newValue) => {
  if (selectedVisitor.value && newValue !== selectedVisitor.value.full_name) {
    selectedVisitor.value = null
    form.visitor_id = ''
  }
})

watch(inmateSearch, (newValue) => {
  if (selectedInmate.value && newValue !== selectedInmate.value.full_name) {
    selectedInmate.value = null
    form.inmate_id = ''
  }
})

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
    // Load visitors from visitor registry
    const visitorsRes = await ApiService.get('/visitors', {
      params: {
        status: 'active',
        per_page: 1000
      }
    })
    // API returns { visitors: { data: [...], ...pagination } }
    const visitorData = visitorsRes.data.visitors
    visitors.value = visitorData.data || visitorData || []

    // Load active inmates
    const inmatesRes = await ApiService.get('/inmates', {
      params: {
        simple: true,
        status: 'active',
        per_page: 1000
      }
    })
    inmates.value = inmatesRes.data.data || inmatesRes.data || []

    // Load relationship types catalog
    const typesRes = await ApiService.get('/catalogs/relationship-types?simple=true')
    relationshipTypes.value = typesRes.data.data || typesRes.data || []
  } catch (error) {
    showToast('Error al cargar catálogos', 'error')
    console.error('Error loading catalogs:', error)
  }
}

const onRelationshipTypeChange = () => {
  const selectedType = relationshipTypes.value.find(t => t.id === form.relationship_type_id)
  if (selectedType) {
    // Auto-set consanguineous based on relationship type
    form.is_consanguineous = selectedType.is_consanguineous || false
  }
}

// Visitor selection handlers
const selectVisitor = (visitor) => {
  selectedVisitor.value = visitor
  form.visitor_id = visitor.id
  visitorSearch.value = visitor.full_name
  showVisitorDropdown.value = false
}

const clearVisitor = () => {
  selectedVisitor.value = null
  form.visitor_id = ''
  visitorSearch.value = ''
}

const handleVisitorBlur = () => {
  setTimeout(() => {
    showVisitorDropdown.value = false
  }, 200)
}

// Inmate selection handlers
const selectInmate = (inmate) => {
  selectedInmate.value = inmate
  form.inmate_id = inmate.id
  inmateSearch.value = inmate.full_name
  showInmateDropdown.value = false
}

const clearInmate = () => {
  selectedInmate.value = null
  form.inmate_id = ''
  inmateSearch.value = ''
}

const handleInmateBlur = () => {
  setTimeout(() => {
    showInmateDropdown.value = false
  }, 200)
}

const handleSubmit = async () => {
  try {
    loading.value = true

    let response
    if (props.relationship) {
      // In edit mode, only send editable fields using correct column names
      const editableData = {
        relationship_type_id: form.relationship_type_id,
        relationship_category: form.is_consanguineous ? 'consanguineous' : 'non_consanguineous',
        relationship_description: form.verification_document || '',
        requires_supervision: !!form.requires_supervision,
        allows_family_visits: true,
        allows_physical_contact: !form.requires_supervision,
        max_visits_per_month: form.visit_frequency_limit || null,
        max_visit_duration_minutes: form.visit_duration_limit || null,
        special_conditions: form.notes || null
      }
      response = await visitorRelationshipsApi.update(props.relationship.id, editableData)
      showToast(t('visits.relationships.updated_successfully'), 'success')
    } else {
      // In create mode, map form fields to API schema
      const createData = {
        inmate_id: form.inmate_id,
        visitor_id: form.visitor_id,
        relationship_type_id: form.relationship_type_id,
        relationship_category: form.is_consanguineous ? 'consanguineous' : 'non_consanguineous',
        relationship_description: form.verification_document || null,
        requires_supervision: !!form.requires_supervision,
        allows_family_visits: true,
        allows_physical_contact: !form.requires_supervision,
        max_visits_per_month: form.visit_frequency_limit || null,
        max_visit_duration_minutes: form.visit_duration_limit || null,
        authorization_date: form.authorization_date || null,
        authorization_expiry_date: form.authorization_expiry_date || null,
        special_conditions: form.notes || null
      }
      response = await visitorRelationshipsApi.create(createData)
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
    // In edit mode, visitor_id and inmate_id don't exist (data is embedded)
    // Only populate editable fields - map from DB columns to form fields
    Object.assign(form, {
      relationship_type_id: newRelationship.relationship_type_id,
      verification_document: newRelationship.relationship_description || '',
      is_consanguineous: newRelationship.relationship_category === 'consanguineous',
      requires_supervision: newRelationship.requires_supervision || false,
      is_legal_representative: false, // This field doesn't exist in DB
      visit_frequency_limit: newRelationship.max_visits_per_month,
      visit_duration_limit: newRelationship.max_visit_duration_minutes,
      notes: newRelationship.special_conditions || ''
    })
    // Don't set authorization dates in edit mode - those are set during authorization process
  } else {
    // Reset form for creation mode
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
    // Clear selections
    selectedVisitor.value = null
    selectedInmate.value = null
    visitorSearch.value = ''
    inmateSearch.value = ''
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

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  transition: background-color 0.15s ease-in-out;
}

.dropdown-item:hover {
  background-color: #f5f8fa;
}

.dropdown-item:active {
  background-color: #e4e6ef;
}
</style>