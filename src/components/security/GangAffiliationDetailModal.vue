<template>
  <div id="gangAffiliationDetailModal" class="modal fade" tabindex="-1" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">Detalle de Afiliación</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" @click="close">
            <i class="ki-duotone ki-cross fs-1"><span class="path1"></span><span class="path2"></span></i>
          </div>
        </div>

        <div class="modal-body py-10 px-lg-17">
          <div v-if="!affiliation" class="text-center py-10">
            <p class="text-gray-500">No hay datos disponibles</p>
          </div>

          <div v-else>
            <!-- Header -->
            <div class="card border border-dashed mb-7">
              <div class="card-body p-4">
                <div class="row">
                  <div class="col-md-4">
                    <strong>PPL:</strong><br>
                    <span class="text-muted">{{ getInmateName(affiliation) }}</span>
                  </div>
                  <div class="col-md-4">
                    <strong>Pandilla:</strong><br>
                    <span class="badge" :class="getGangBadge(affiliation.gang_type)">{{ getGangLabel(affiliation.gang_type) }}</span>
                    <span v-if="affiliation.gang_name" class="text-muted ms-2">{{ affiliation.gang_name }}</span>
                  </div>
                  <div class="col-md-4">
                    <strong>Estado:</strong><br>
                    <span v-if="affiliation.is_current" class="badge badge-light-success">Vigente</span>
                    <span v-else class="badge badge-light-secondary">Histórico</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Affiliation Details -->
            <div class="card border mb-5">
              <div class="card-header"><h5 class="card-title mb-0">Información de Afiliación</h5></div>
              <div class="card-body p-4">
                <div class="row mb-3">
                  <div class="col-md-3">
                    <strong>Nivel:</strong><br>
                    <span class="text-muted">{{ getLevelLabel(affiliation.affiliation_level) }}</span>
                  </div>
                  <div class="col-md-3">
                    <strong>Rango:</strong><br>
                    <span class="text-muted">{{ affiliation.rank_position || 'N/A' }}</span>
                  </div>
                  <div class="col-md-3">
                    <strong>Clica:</strong><br>
                    <span class="text-muted">{{ affiliation.clique_name || 'N/A' }}</span>
                  </div>
                  <div class="col-md-3">
                    <strong>Territorio:</strong><br>
                    <span class="text-muted">{{ affiliation.territory || 'N/A' }}</span>
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-md-3">
                    <strong>Fecha Ingreso:</strong><br>
                    <span class="text-muted">{{ formatDate(affiliation.join_date) }}</span>
                  </div>
                  <div class="col-md-3">
                    <strong>Fecha Confirmación:</strong><br>
                    <span class="text-muted">{{ formatDate(affiliation.confirmation_date) }}</span>
                  </div>
                  <div class="col-md-3">
                    <strong>Nivel de Inteligencia:</strong><br>
                    <span class="badge" :class="getIntelBadge(affiliation.intelligence_level)">
                      {{ getIntelLabel(affiliation.intelligence_level) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Activities -->
            <div class="card border mb-5">
              <div class="card-header"><h5 class="card-title mb-0">Actividades</h5></div>
              <div class="card-body p-4">
                <div class="d-flex gap-3 flex-wrap mb-3">
                  <span v-if="affiliation.active_in_extortion" class="badge badge-danger"><i class="fas fa-money-bill me-1"></i>Extorsión Activa</span>
                  <span v-if="affiliation.orders_from_prison" class="badge badge-danger"><i class="fas fa-bullhorn me-1"></i>Ordena desde Prisión</span>
                  <span v-if="affiliation.receives_orders" class="badge badge-warning"><i class="fas fa-inbox me-1"></i>Recibe Órdenes</span>
                  <span v-if="!affiliation.active_in_extortion && !affiliation.orders_from_prison && !affiliation.receives_orders" class="text-muted">Sin actividades reportadas</span>
                </div>
                <div v-if="affiliation.criminal_activities" class="mb-3">
                  <strong>Actividades Criminales:</strong>
                  <p class="text-muted mt-1">{{ affiliation.criminal_activities }}</p>
                </div>
                <div v-if="affiliation.communication_methods" class="mb-3">
                  <strong>Métodos de Comunicación:</strong>
                  <p class="text-muted mt-1">{{ affiliation.communication_methods }}</p>
                </div>
              </div>
            </div>

            <!-- Intelligence -->
            <div v-if="affiliation.intelligence_notes || affiliation.threat_assessment || affiliation.known_associates || affiliation.rival_gangs" class="card border mb-5">
              <div class="card-header"><h5 class="card-title mb-0">Inteligencia</h5></div>
              <div class="card-body p-4">
                <div v-if="affiliation.intelligence_notes" class="mb-3">
                  <strong>Notas de Inteligencia:</strong>
                  <p class="text-muted mt-1">{{ affiliation.intelligence_notes }}</p>
                </div>
                <div v-if="affiliation.threat_assessment" class="mb-3">
                  <strong>Evaluación de Amenaza:</strong>
                  <p class="text-muted mt-1">{{ affiliation.threat_assessment }}</p>
                </div>
                <div v-if="affiliation.known_associates" class="mb-3">
                  <strong>Asociados Conocidos:</strong>
                  <p class="text-muted mt-1">{{ affiliation.known_associates }}</p>
                </div>
                <div v-if="affiliation.rival_gangs" class="mb-3">
                  <strong>Pandillas Rivales:</strong>
                  <p class="text-muted mt-1">{{ affiliation.rival_gangs }}</p>
                </div>
              </div>
            </div>

            <!-- Separation -->
            <div v-if="affiliation.must_separate_from || affiliation.separation_reasons" class="card border mb-5">
              <div class="card-header"><h5 class="card-title mb-0">Separación</h5></div>
              <div class="card-body p-4">
                <div v-if="affiliation.must_separate_from" class="mb-3">
                  <strong>Debe Separarse De:</strong>
                  <p class="text-muted mt-1">{{ affiliation.must_separate_from }}</p>
                </div>
                <div v-if="affiliation.separation_reasons" class="mb-3">
                  <strong>Razones:</strong>
                  <p class="text-muted mt-1">{{ affiliation.separation_reasons }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Modal } from 'bootstrap';

defineProps<{ affiliation: any }>();

const modalRef = ref<HTMLElement | null>(null);
let modalInstance: Modal | null = null;

const getInmateName = (r: any) => {
  const i = r?.inmate;
  if (!i) return 'N/A';
  return [i.first_name, i.middle_name, i.last_name, i.second_last_name].filter(Boolean).join(' ');
};

const getGangLabel = (t: string) => ({
  ms13: 'MS-13', barrio18: 'Barrio 18',
  other_gang: 'Otra Pandilla', drug_cartel: 'Cartel', organized_crime: 'Crimen Organizado', none: 'Ninguna',
}[t] || t);

const getGangBadge = (t: string) => ({
  ms13: 'badge-danger', barrio18: 'badge-warning',
  drug_cartel: 'badge-dark', organized_crime: 'badge-dark',
}[t] || 'badge-light-info');

const getLevelLabel = (l: string) => ({
  suspected: 'Sospechoso', confirmed_member: 'Miembro Confirmado', leader: 'Líder',
  high_ranking: 'Alto Rango', founder: 'Fundador', inactive: 'Inactivo', former_member: 'Ex-miembro',
  // Legacy values
  core: 'Núcleo', active: 'Activo', associate: 'Asociado', sympathizer: 'Simpatizante',
  peripheral: 'Periférico', former: 'Ex-miembro', unknown: 'Desconocido',
}[l] || l || 'N/A');

const getIntelBadge = (l: string) => ({ low: 'badge-light-success', medium: 'badge-light-warning', high: 'badge-light-danger', critical: 'badge-danger' }[l] || 'badge-light');
const getIntelLabel = (l: string) => ({ low: 'Bajo', medium: 'Medio', high: 'Alto', critical: 'Crítico' }[l] || l || 'N/A');
const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('es-GT') : 'N/A';

const open = () => {
  if (modalRef.value && !modalInstance) modalInstance = new Modal(modalRef.value);
  modalInstance?.show();
};
const close = () => { modalInstance?.hide(); };

defineExpose({ open, close });
</script>
