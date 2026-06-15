<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Resolver discrepancia de conteo</h3>
          <button type="button" class="btn-close" aria-label="Cerrar" @click="$emit('close')"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <!-- Resumen de la discrepancia -->
            <div class="alert alert-warning d-flex align-items-center mb-6">
              <i class="fas fa-exclamation-triangle fs-2 me-3" aria-hidden="true"></i>
              <div>
                <strong>Discrepancia de {{ count?.discrepancy }} interno(s)</strong>
                <div class="small">
                  Esperados: {{ count?.expected_count }} ·
                  Físico: {{ count?.physical_count }} ·
                  Justificados: {{ accountedFor }}
                </div>
              </div>
            </div>

            <div class="row mb-4" v-if="count">
              <div class="col-md-4">
                <strong>Tipo:</strong> {{ formatCountType(count.count_type) }}
              </div>
              <div class="col-md-4">
                <strong>Fecha:</strong> {{ formatDate(count.count_date) }}
              </div>
              <div class="col-md-4">
                <strong>Sector:</strong> {{ count.sector?.name || 'Todo el centro' }}
              </div>
            </div>

            <div class="mb-6">
              <label for="disc-explanation" class="form-label required">Explicación de la discrepancia</label>
              <textarea
                id="disc-explanation"
                v-model="form.explanation"
                class="form-control"
                :class="{ 'is-invalid': errors.explanation }"
                rows="3"
                maxlength="1000"
                placeholder="Describa la causa identificada de la diferencia en el conteo"
                required
              ></textarea>
              <div v-if="errors.explanation" class="invalid-feedback" role="alert">
                {{ errors.explanation }}
              </div>
            </div>

            <div class="mb-6">
              <label for="disc-action" class="form-label required">Acción correctiva tomada</label>
              <textarea
                id="disc-action"
                v-model="form.corrective_action"
                class="form-control"
                :class="{ 'is-invalid': errors.corrective_action }"
                rows="3"
                maxlength="1000"
                placeholder="Indique qué medidas se tomaron (reconteo, localización de internos, notificación a autoridades)"
                required
              ></textarea>
              <div v-if="errors.corrective_action" class="invalid-feedback" role="alert">
                {{ errors.corrective_action }}
              </div>
            </div>

            <!-- Internos faltantes registrados en el conteo -->
            <div v-if="missingList.length" class="mb-2">
              <label class="form-label">Internos no localizados durante el conteo</label>
              <ul class="list-group">
                <li
                  v-for="(inmate, idx) in missingList"
                  :key="idx"
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>{{ inmate.name || inmate.inmate_number || `Interno #${inmate.id || inmate}` }}</span>
                  <div class="form-check form-switch">
                    <input
                      :id="`located-${idx}`"
                      v-model="locatedIds"
                      class="form-check-input"
                      type="checkbox"
                      :value="inmate.id || inmate"
                    />
                    <label class="form-check-label small" :for="`located-${idx}`">Localizado</label>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="$emit('close')">Cancelar</button>
            <button type="submit" class="btn btn-warning" :disabled="submitting">
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
              Resolver discrepancia
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useToast } from '@/composables/useToast'
import { dailyCountsApi } from '@/services/api/operations'

const props = defineProps({
  count: { type: Object, required: true }
})
const emit = defineEmits(['close', 'resolved'])

const { showToast } = useToast()

const submitting = ref(false)
const locatedIds = ref([])
const form = reactive({
  explanation: '',
  corrective_action: ''
})
const errors = reactive({})

const missingList = computed(() => {
  const raw = props.count?.missing_inmates
  if (!raw) return []
  return Array.isArray(raw) ? raw : []
})

const accountedFor = computed(() => {
  const c = props.count || {}
  return (c.in_medical || 0) + (c.in_court || 0) + (c.in_visits || 0) +
         (c.in_programs || 0) + (c.in_work || 0) + (c.other_justified || 0)
})

const formatCountType = (type) => ({
  morning: 'Matutino', midday: 'Medio día', evening: 'Vespertino',
  night: 'Nocturno', emergency: 'Emergencia', recount: 'Reconteo'
}[type] || type)

const formatDate = (date) => (date ? new Date(date).toLocaleDateString('es-GT') : '-')

const handleSubmit = async () => {
  errors.explanation = form.explanation.trim() ? '' : 'La explicación es obligatoria'
  errors.corrective_action = form.corrective_action.trim() ? '' : 'La acción correctiva es obligatoria'
  if (errors.explanation || errors.corrective_action) return

  submitting.value = true
  try {
    await dailyCountsApi.resolveDiscrepancy(props.count.id, {
      explanation: form.explanation.trim(),
      corrective_action: form.corrective_action.trim(),
      inmates_located: locatedIds.value
    })
    showToast('Discrepancia resuelta correctamente', 'success')
    emit('resolved')
  } catch (error) {
    const msg = error?.response?.data?.message || 'Error al resolver la discrepancia'
    showToast(msg, 'error')
  } finally {
    submitting.value = false
  }
}
</script>
