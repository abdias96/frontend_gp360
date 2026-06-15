<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Detalle del conteo</h3>
          <button type="button" class="btn-close" aria-label="Cerrar" @click="$emit('close')"></button>
        </div>

        <div class="modal-body" v-if="count">
          <!-- Encabezado -->
          <div class="d-flex align-items-center justify-content-between mb-6">
            <div>
              <h4 class="mb-1">{{ formatCountType(count.count_type) }}</h4>
              <div class="text-muted">
                {{ formatDate(count.count_date) }} ·
                {{ count.sector?.name || 'Todo el centro' }} ·
                {{ count.center?.name || '' }}
              </div>
            </div>
            <span class="badge fs-6" :class="statusBadgeClass">{{ formatStatus(count.status) }}</span>
          </div>

          <!-- Cifras -->
          <div class="row g-3 mb-6">
            <div class="col-md-3 col-6">
              <div class="border rounded p-3 text-center">
                <div class="fs-2 fw-bold">{{ count.expected_count ?? '-' }}</div>
                <div class="text-muted small">Esperados</div>
              </div>
            </div>
            <div class="col-md-3 col-6">
              <div class="border rounded p-3 text-center">
                <div class="fs-2 fw-bold">{{ count.physical_count ?? '-' }}</div>
                <div class="text-muted small">Conteo físico</div>
              </div>
            </div>
            <div class="col-md-3 col-6">
              <div class="border rounded p-3 text-center">
                <div class="fs-2 fw-bold">{{ accountedFor }}</div>
                <div class="text-muted small">Justificados</div>
              </div>
            </div>
            <div class="col-md-3 col-6">
              <div class="border rounded p-3 text-center" :class="{ 'border-danger': hasDiscrepancy }">
                <div class="fs-2 fw-bold" :class="{ 'text-danger': hasDiscrepancy }">
                  {{ count.discrepancy ?? 0 }}
                </div>
                <div class="text-muted small">Discrepancia</div>
              </div>
            </div>
          </div>

          <!-- Desglose de justificados -->
          <div class="card card-flush mb-6">
            <div class="card-header"><h3 class="card-title">Internos fuera del sector (justificados)</h3></div>
            <div class="card-body py-3">
              <div class="row text-center">
                <div class="col">
                  <div class="fw-bold">{{ count.in_medical ?? 0 }}</div>
                  <div class="text-muted small">Médico</div>
                </div>
                <div class="col">
                  <div class="fw-bold">{{ count.in_court ?? 0 }}</div>
                  <div class="text-muted small">Juzgado</div>
                </div>
                <div class="col">
                  <div class="fw-bold">{{ count.in_visits ?? 0 }}</div>
                  <div class="text-muted small">Visitas</div>
                </div>
                <div class="col">
                  <div class="fw-bold">{{ count.in_programs ?? 0 }}</div>
                  <div class="text-muted small">Programas</div>
                </div>
                <div class="col">
                  <div class="fw-bold">{{ count.in_work ?? 0 }}</div>
                  <div class="text-muted small">Trabajo</div>
                </div>
                <div class="col">
                  <div class="fw-bold">{{ count.other_justified ?? 0 }}</div>
                  <div class="text-muted small">Otros</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tiempos y responsables -->
          <div class="row mb-4">
            <div class="col-md-6">
              <strong>Hora programada:</strong> {{ formatTime(count.scheduled_time) }}
            </div>
            <div class="col-md-6">
              <strong>Duración:</strong> {{ duration }}
            </div>
            <div class="col-md-6">
              <strong>Inicio real:</strong> {{ formatTime(count.actual_start_time) }}
            </div>
            <div class="col-md-6">
              <strong>Fin real:</strong> {{ formatTime(count.actual_end_time) }}
            </div>
            <div class="col-md-6">
              <strong>Oficial a cargo:</strong> {{ count.officer_in_charge?.name || count.officer_in_charge_name || '-' }}
            </div>
            <div class="col-md-6">
              <strong>Verificado por:</strong> {{ count.verified_by?.name || '-' }}
            </div>
          </div>

          <!-- Resolución de discrepancia -->
          <div v-if="count.discrepancy_explanation" class="alert alert-info mb-0">
            <strong>Resolución registrada:</strong>
            <div class="mt-1" style="white-space: pre-line">{{ count.discrepancy_explanation }}</div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="$emit('close')">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  count: { type: Object, required: true }
})
defineEmits(['close'])

const accountedFor = computed(() => {
  const c = props.count || {}
  return (c.in_medical || 0) + (c.in_court || 0) + (c.in_visits || 0) +
         (c.in_programs || 0) + (c.in_work || 0) + (c.other_justified || 0)
})

const hasDiscrepancy = computed(() => (props.count?.discrepancy || 0) !== 0)

const duration = computed(() => {
  const c = props.count
  if (!c?.actual_start_time || !c?.actual_end_time) return '-'
  const mins = Math.round((new Date(c.actual_end_time) - new Date(c.actual_start_time)) / 60000)
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
})

const statusBadgeClass = computed(() => ({
  pending: 'badge-light-secondary',
  in_progress: 'badge-light-primary',
  completed: 'badge-light-success',
  with_discrepancy: 'badge-light-danger',
  resolved: 'badge-light-warning',
  verified: 'badge-light-success'
}[props.count?.status] || 'badge-light-secondary'))

const formatCountType = (type) => ({
  morning: 'Conteo matutino (06:00)', midday: 'Conteo de medio día (12:00)',
  evening: 'Conteo vespertino (18:00)', night: 'Conteo nocturno (21:00)',
  emergency: 'Conteo de emergencia', recount: 'Reconteo'
}[type] || type)

const formatStatus = (status) => ({
  pending: 'Pendiente', in_progress: 'En proceso', completed: 'Completado',
  with_discrepancy: 'Con discrepancia', resolved: 'Resuelto', verified: 'Verificado'
}[status] || status)

const formatDate = (date) => (date ? new Date(date).toLocaleDateString('es-GT') : '-')

const formatTime = (time) => {
  if (!time) return '-'
  if (typeof time === 'string' && time.includes('T')) {
    return new Date(time).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })
  }
  const d = new Date(`2000-01-01 ${time}`)
  return isNaN(d) ? time : d.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })
}
</script>
