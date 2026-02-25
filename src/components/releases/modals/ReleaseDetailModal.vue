<template>
  <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5)">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header" :class="release.release_completed ? 'bg-success' : 'bg-warning'">
          <h5 class="modal-title text-white">
            <i class="bi bi-file-text me-2"></i>
            Detalles de Liberación #{{ release.release_number }}
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="$emit('close')"
          ></button>
        </div>

        <div class="modal-body">
          <!-- Status Badge -->
          <div class="d-flex justify-content-between align-items-center mb-6">
            <span
              class="badge fs-6 px-4 py-2"
              :class="release.release_completed ? 'badge-success' : 'badge-warning'"
            >
              {{ release.release_completed ? 'Liberación Completada' : 'Liberación Pendiente' }}
            </span>
            <span v-if="release.actual_release_datetime" class="text-muted">
              Liberado el: {{ formatDateTime(release.actual_release_datetime) }}
            </span>
          </div>

          <div class="row">
            <!-- Left Column - Inmate & Legal Info -->
            <div class="col-md-6">
              <!-- Inmate Information -->
              <div class="card mb-6">
                <div class="card-header">
                  <h6 class="mb-0"><i class="bi bi-person me-2"></i>Información del PPL</h6>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="text-muted fs-7">Nombre Completo</label>
                    <div class="fw-bold">{{ [release.inmate?.first_name, release.inmate?.middle_name, release.inmate?.last_name, release.inmate?.second_last_name].filter(Boolean).join(' ') }}</div>
                  </div>
                  <div class="mb-3">
                    <label class="text-muted fs-7">Documento</label>
                    <div class="fw-bold">{{ release.inmate?.document_number }}</div>
                  </div>
                  <div class="mb-3">
                    <label class="text-muted fs-7">Código Interno</label>
                    <div class="fw-bold">{{ release.inmate?.internal_code }}</div>
                  </div>
                </div>
              </div>

              <!-- Legal Profile Information -->
              <div class="card mb-6">
                <div class="card-header">
                  <h6 class="mb-0"><i class="bi bi-file-earmark-text me-2"></i>Perfil Legal</h6>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="text-muted fs-7">Número de Caso</label>
                    <div class="fw-bold">{{ release.legalProfile?.case_number || 'N/A' }}</div>
                  </div>
                  <div class="mb-3">
                    <label class="text-muted fs-7">Tribunal</label>
                    <div class="fw-bold">{{ release.legalProfile?.court?.name || 'N/A' }}</div>
                  </div>
                  <div v-if="release.legalProfile?.crimes && release.legalProfile.crimes.length > 0" class="mb-3">
                    <label class="text-muted fs-7">Delitos</label>
                    <div class="d-flex flex-wrap gap-2">
                      <span
                        v-for="crime in release.legalProfile.crimes"
                        :key="crime.id"
                        class="badge badge-light-primary"
                      >
                        {{ crime.crime?.name }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Authorization Information -->
              <div class="card mb-6">
                <div class="card-header">
                  <h6 class="mb-0"><i class="bi bi-shield-check me-2"></i>Autorización</h6>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="text-muted fs-7">Número de Documento</label>
                    <div class="fw-bold">{{ release.authorization_document_number || 'N/A' }}</div>
                  </div>
                  <div class="mb-3">
                    <label class="text-muted fs-7">Fecha de Autorización</label>
                    <div class="fw-bold">{{ release.authorization_date ? formatDate(release.authorization_date) : 'N/A' }}</div>
                  </div>
                  <div class="mb-3">
                    <label class="text-muted fs-7">Tribunal que Autoriza</label>
                    <div class="fw-bold">{{ release.authorizingCourt?.name || 'N/A' }}</div>
                  </div>
                  <div class="mb-3">
                    <label class="text-muted fs-7">Autoridad</label>
                    <div class="fw-bold">{{ release.authorizing_authority || 'N/A' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column - Release Details -->
            <div class="col-md-6">
              <!-- Release Information -->
              <div class="card mb-6">
                <div class="card-header">
                  <h6 class="mb-0"><i class="bi bi-calendar-event me-2"></i>Información de Liberación</h6>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="text-muted fs-7">Motivo de Liberación</label>
                    <div class="fw-bold">{{ release.exitReason?.name || 'N/A' }}</div>
                  </div>
                  <div class="mb-3">
                    <label class="text-muted fs-7">Fecha Programada</label>
                    <div class="fw-bold">
                      <span
                        class="badge"
                        :class="getDateBadgeClass(release.scheduled_release_date, release.release_completed)"
                      >
                        {{ formatDate(release.scheduled_release_date) }}
                      </span>
                    </div>
                  </div>
                  <div v-if="release.actual_release_datetime" class="mb-3">
                    <label class="text-muted fs-7">Fecha Real de Liberación</label>
                    <div class="fw-bold">{{ formatDateTime(release.actual_release_datetime) }}</div>
                  </div>
                </div>
              </div>

              <!-- Release Conditions -->
              <div class="card mb-6">
                <div class="card-header">
                  <h6 class="mb-0"><i class="bi bi-list-check me-2"></i>Condiciones de Libertad</h6>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="text-muted fs-7">Condiciones</label>
                    <p class="mb-0">{{ release.release_conditions || 'Sin condiciones especiales' }}</p>
                  </div>
                  <div class="mb-3">
                    <label class="text-muted fs-7">Fin de Supervisión</label>
                    <div class="fw-bold">{{ release.supervision_end_date ? formatDate(release.supervision_end_date) : 'N/A' }}</div>
                  </div>
                  <div class="mb-3">
                    <label class="text-muted fs-7">Autoridad Supervisora</label>
                    <div class="fw-bold">{{ release.supervising_authority || 'N/A' }}</div>
                  </div>
                </div>
              </div>

              <!-- Contact Information -->
              <div class="card mb-6">
                <div class="card-header">
                  <h6 class="mb-0"><i class="bi bi-telephone me-2"></i>Información de Contacto</h6>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="text-muted fs-7">Dirección</label>
                    <div class="fw-bold">{{ release.release_address || 'No especificada' }}</div>
                  </div>
                  <div class="mb-3">
                    <label class="text-muted fs-7">Teléfono del PPL</label>
                    <div class="fw-bold">{{ release.release_phone || 'No especificado' }}</div>
                  </div>
                  <div class="mb-3">
                    <label class="text-muted fs-7">Persona de Contacto</label>
                    <div class="fw-bold">{{ release.contact_person || 'No especificada' }}</div>
                  </div>
                  <div class="mb-3">
                    <label class="text-muted fs-7">Teléfono de Contacto</label>
                    <div class="fw-bold">{{ release.contact_phone || 'No especificado' }}</div>
                  </div>
                </div>
              </div>

              <!-- Belongings & Documents (only if completed) -->
              <div v-if="release.release_completed" class="card mb-6">
                <div class="card-header">
                  <h6 class="mb-0"><i class="bi bi-box me-2"></i>Pertenencias y Documentos</h6>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="text-muted fs-7">Pertenencias Devueltas</label>
                    <div>
                      <span
                        class="badge"
                        :class="release.belongings_returned ? 'badge-success' : 'badge-secondary'"
                      >
                        {{ release.belongings_returned ? 'Sí' : 'No' }}
                      </span>
                    </div>
                  </div>
                  <div v-if="release.belongings_inventory && release.belongings_inventory.length > 0" class="mb-3">
                    <label class="text-muted fs-7">Inventario</label>
                    <ul class="mb-0">
                      <li v-for="(item, index) in release.belongings_inventory" :key="index">{{ item }}</li>
                    </ul>
                  </div>
                  <div v-if="release.money_returned" class="mb-3">
                    <label class="text-muted fs-7">Dinero Devuelto</label>
                    <div class="fw-bold">Q {{ parseFloat(release.money_returned).toFixed(2) }}</div>
                  </div>
                  <div class="mb-3">
                    <label class="text-muted fs-7">Documentos Entregados</label>
                    <div>
                      <span
                        class="badge"
                        :class="release.documents_provided ? 'badge-success' : 'badge-secondary'"
                      >
                        {{ release.documents_provided ? 'Sí' : 'No' }}
                      </span>
                    </div>
                  </div>
                  <div v-if="release.documents_list && release.documents_list.length > 0" class="mb-3">
                    <label class="text-muted fs-7">Lista de Documentos</label>
                    <ul class="mb-0">
                      <li v-for="(doc, index) in release.documents_list" :key="index">{{ doc }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Observations -->
          <div class="card mb-6">
            <div class="card-header">
              <h6 class="mb-0"><i class="bi bi-chat-left-text me-2"></i>Observaciones Finales</h6>
            </div>
            <div class="card-body">
              <p class="mb-0">{{ release.final_observations || 'Sin observaciones adicionales' }}</p>
            </div>
          </div>

          <!-- System Information -->
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0"><i class="bi bi-gear me-2"></i>Información del Sistema</h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4">
                  <label class="text-muted fs-7">Creado por</label>
                  <div class="fw-bold">{{ release.createdBy?.name || 'N/A' }}</div>
                  <div class="text-muted fs-7">{{ formatDateTime(release.created_at) }}</div>
                </div>
                <div v-if="release.processedBy" class="col-md-4">
                  <label class="text-muted fs-7">Procesado por</label>
                  <div class="fw-bold">{{ release.processedBy.name }}</div>
                </div>
                <div v-if="release.authorizedBy" class="col-md-4">
                  <label class="text-muted fs-7">Autorizado por</label>
                  <div class="fw-bold">{{ release.authorizedBy.name }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-light"
            @click="$emit('close')"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';

interface Props {
  release: any;
}

const props = defineProps<Props>();
defineEmits(['close']);

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY');
};

const formatDateTime = (datetime: string) => {
  return dayjs(datetime).format('DD/MM/YYYY HH:mm');
};

const isToday = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');
};

const isOverdue = (date: string) => {
  return dayjs(date).isBefore(dayjs(), 'day');
};

const getDateBadgeClass = (date: string, completed: boolean) => {
  if (completed) return 'badge-success';
  if (isToday(date)) return 'badge-danger';
  if (isOverdue(date)) return 'badge-primary';
  return 'badge-light';
};
</script>
