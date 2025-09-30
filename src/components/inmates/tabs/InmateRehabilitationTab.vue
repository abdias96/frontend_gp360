<template>
  <div class="d-flex flex-column gap-7">
    <!--begin::Rehabilitation Overview Card-->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label fw-bold text-gray-900">Resumen de Rehabilitación</span>
          <span class="text-muted mt-1 fw-semibold fs-7">Programas activos y progreso del interno</span>
        </h3>
      </div>
      <div class="card-body">
        <div class="row g-6">
          <!--begin::Active Programs-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Programas Activos</span>
              <span class="fs-5 fw-bold text-primary">
                {{ activePrograms.length }}
              </span>
            </div>
          </div>
          <!--end::Active Programs-->
          
          <!--begin::Hours Completed-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Horas Completadas</span>
              <span class="fs-5 fw-bold text-success">
                {{ totalHours }}
              </span>
            </div>
          </div>
          <!--end::Hours Completed-->
          
          <!--begin::Certificates-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Certificados Obtenidos</span>
              <span class="fs-5 fw-bold text-info">
                {{ certificates.length }}
              </span>
            </div>
          </div>
          <!--end::Certificates-->
          
          <!--begin::Overall Progress-->
          <div class="col-md-3">
            <div class="d-flex flex-column">
              <span class="text-muted fw-semibold mb-2">Progreso General</span>
              <span class="fs-5 fw-bold text-warning">
                {{ overallProgress }}%
              </span>
            </div>
          </div>
          <!--end::Overall Progress-->
        </div>
      </div>
    </div>
    <!--end::Rehabilitation Overview Card-->
    
    <!--begin::Programs Grid-->
    <div class="row g-5">
      <!--begin::Educational Programs-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Programas Educativos</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/rehabilitation/education`"
                class="btn btn-sm btn-light-primary"
              >
                Ver Todos
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="educationalPrograms.length > 0">
              <div v-for="program in educationalPrograms.slice(0, 3)" :key="program.id" class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <div class="fw-bold text-gray-900">{{ program.name }}</div>
                  <span class="badge badge-light-primary">{{ program.progress }}%</span>
                </div>
                <div class="progress" style="height: 6px">
                  <div 
                    class="progress-bar bg-primary" 
                    :style="`width: ${program.progress}%`"
                  ></div>
                </div>
                <div class="text-muted fs-7 mt-1">{{ program.schedule }}</div>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-book fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="text-muted mt-3">Sin programas educativos activos</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Educational Programs-->
      
      <!--begin::Work Programs-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Programas Laborales</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/rehabilitation/work`"
                class="btn btn-sm btn-light-success"
              >
                Ver Todos
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="workPrograms.length > 0">
              <div v-for="program in workPrograms.slice(0, 3)" :key="program.id" class="d-flex align-items-center mb-4">
                <div class="symbol symbol-40px me-3">
                  <div class="symbol-label bg-light-success">
                    <i class="ki-duotone ki-briefcase fs-2 text-success">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ program.name }}</div>
                  <div class="text-muted fs-7">{{ program.position }}</div>
                  <div class="text-muted fs-8">{{ program.schedule }}</div>
                </div>
                <span class="badge badge-light-success">Activo</span>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-briefcase fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="text-muted mt-3">Sin programas laborales activos</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Work Programs-->
      
      <!--begin::Therapeutic Programs-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Programas Terapéuticos</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/rehabilitation/therapy`"
                class="btn btn-sm btn-light-info"
              >
                Ver Detalles
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="therapeuticPrograms.length > 0">
              <div v-for="program in therapeuticPrograms.slice(0, 3)" :key="program.id" class="d-flex align-items-center mb-4">
                <div class="symbol symbol-40px me-3">
                  <div class="symbol-label bg-light-info">
                    <i class="ki-duotone ki-heart fs-2 text-info">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-900">{{ program.name }}</div>
                  <div class="text-muted fs-7">{{ program.therapist }}</div>
                  <div class="text-muted fs-8">Sesiones: {{ program.sessions_completed }}/{{ program.sessions_total }}</div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="ki-duotone ki-heart fs-3x text-muted">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div class="text-muted mt-3">Sin programas terapéuticos activos</div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Therapeutic Programs-->
      
      <!--begin::Behavior & Progress-->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title">Comportamiento y Progreso</h3>
            <div class="card-toolbar">
              <router-link 
                :to="`/inmates/${inmate.id}/rehabilitation/evaluations`"
                class="btn btn-sm btn-light-warning"
              >
                Ver Evaluaciones
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div class="row g-4">
              <div class="col-6">
                <div class="text-center">
                  <div class="fs-2hx fw-bold text-warning">{{ behaviorScore }}</div>
                  <div class="text-muted fs-7">Puntuación Conducta</div>
                </div>
              </div>
              <div class="col-6">
                <div class="text-center">
                  <div class="fs-2hx fw-bold text-success">{{ participationRate }}%</div>
                  <div class="text-muted fs-7">Tasa Participación</div>
                </div>
              </div>
            </div>
            
            <div class="separator my-4"></div>
            
            <div class="d-flex justify-content-between align-items-center">
              <span class="text-muted">Última evaluación:</span>
              <span class="fw-bold">{{ lastEvaluation ? formatDate(lastEvaluation.date) : 'Sin evaluación' }}</span>
            </div>
          </div>
        </div>
      </div>
      <!--end::Behavior & Progress-->
    </div>
    <!--end::Programs Grid-->
    
    <!--begin::Quick Actions-->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Acciones Rápidas</h3>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/rehabilitation/enroll`"
              class="btn btn-flex btn-light-primary w-100 py-4"
            >
              <i class="ki-duotone ki-plus-circle fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Inscribir en Programa</span>
            </router-link>
          </div>
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/rehabilitation/attendance`"
              class="btn btn-flex btn-light-info w-100 py-4"
            >
              <i class="ki-duotone ki-calendar-tick fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Asistencia</span>
            </router-link>
          </div>
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/rehabilitation/certificates`"
              class="btn btn-flex btn-light-success w-100 py-4"
            >
              <i class="ki-duotone ki-award fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Certificados</span>
            </router-link>
          </div>
          <div class="col-md-3">
            <router-link 
              :to="`/inmates/${inmate.id}/rehabilitation/reports`"
              class="btn btn-flex btn-light-warning w-100 py-4"
            >
              <i class="ki-duotone ki-document fs-2x me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span class="fw-bold">Reportes</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!--end::Quick Actions-->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/core/services/ApiService';
import { formatDate } from '@/core/helpers/formatters';

// Props
interface Props {
  inmate: any;
}

const props = defineProps<Props>();

// State
const activePrograms = ref<any[]>([]);
const educationalPrograms = ref<any[]>([]);
const workPrograms = ref<any[]>([]);
const therapeuticPrograms = ref<any[]>([]);
const certificates = ref<any[]>([]);
const totalHours = ref(0);
const overallProgress = ref(0);
const behaviorScore = ref(0);
const participationRate = ref(0);
const lastEvaluation = ref<any>(null);

// Methods
const fetchRehabilitationData = async () => {
  try {
    // Simulate fetching data - replace with actual API calls
    activePrograms.value = [];
    educationalPrograms.value = [];
    workPrograms.value = [];
    therapeuticPrograms.value = [];
    certificates.value = [];
    totalHours.value = 0;
    overallProgress.value = 0;
    behaviorScore.value = 85;
    participationRate.value = 92;
    lastEvaluation.value = null;
  } catch (error) {
    console.error('Error fetching rehabilitation data:', error);
  }
};

// Lifecycle
onMounted(() => {
  fetchRehabilitationData();
});
</script>