<template>
  <div class="row g-6 g-xl-9">
    <!-- Medical Profile Overview -->
    <div class="col-md-6 col-xl-4">
      <div class="card card-flush h-100">
        <div class="card-header pt-7">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-gray-800"
              >Perfil Médico General</span
            >
            <span class="text-gray-600 mt-1 fw-semibold fs-6"
              >Información básica de salud</span
            >
          </h3>
          <div class="card-toolbar">
            <button
              v-if="canEditMedical"
              @click="openEditMedicalProfileModal"
              class="btn btn-sm btn-light-primary"
            >
              <KTIcon icon-name="pencil" icon-class="fs-2" />
              Editar
            </button>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.profile" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          <div v-else>
            <!-- Blood Type -->
            <div class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2"
                >Tipo de Sangre</span
              >
              <span class="text-gray-800">
                {{ medicalProfile?.bloodType?.name || medicalProfile?.blood_type?.name || "No especificado" }}
              </span>
            </div>

            <!-- Emergency Contact -->
            <div class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2"
                >Contacto de Emergencia</span
              >
              <div v-if="medicalProfile?.emergency_contact_name">
                <div class="text-gray-800">
                  {{ medicalProfile.emergency_contact_name }}
                </div>
                <div class="text-gray-600 fs-7">
                  {{ medicalProfile.emergency_contact_phone }}
                </div>
              </div>
              <span v-else class="text-gray-500">No especificado</span>
            </div>

            <!-- Mental Health Status -->
            <div class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2"
                >Estado de Salud Mental</span
              >
              <span class="text-gray-800">
                {{ medicalProfile?.mentalHealthStatus?.name || medicalProfile?.mental_health_status?.name || "No evaluado" }}
              </span>
            </div>

            <!-- Medical Alerts -->
            <div v-if="hasMedicalAlerts" class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2"
                >Alertas Médicas</span
              >
              <div class="d-flex flex-wrap gap-2">
                <span v-if="hasAllergies" class="badge badge-light-warning">
                  <KTIcon icon-name="warning-2" icon-class="fs-6 me-1" />
                  Alergias
                </span>
                <span
                  v-if="hasChronicDiseases"
                  class="badge badge-light-danger"
                >
                  <KTIcon icon-name="heart" icon-class="fs-6 me-1" />
                  Enfermedades Crónicas
                </span>
                <span v-if="hasDisabilities" class="badge badge-light-info">
                  <KTIcon icon-name="information" icon-class="fs-6 me-1" />
                  Discapacidades
                </span>
              </div>
            </div>

            <!-- Last Medical Update -->
            <div class="text-gray-600 fs-8">
              <KTIcon icon-name="calendar" icon-class="fs-7 me-1" />
              Última actualización:
              {{ formatDate(medicalProfile?.updated_at || "") }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chronic Diseases & Conditions -->
    <div class="col-md-6 col-xl-4">
      <div class="card card-flush h-100">
        <div class="card-header pt-7">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-gray-800"
              >Condiciones Crónicas</span
            >
            <span class="text-gray-600 mt-1 fw-semibold fs-6"
              >Enfermedades y discapacidades</span
            >
          </h3>
          <div class="card-toolbar">
            <button
              v-if="canEditMedical"
              @click="openManageConditionsModal"
              class="btn btn-sm btn-light-success"
            >
              <KTIcon icon-name="medical-mask" icon-class="fs-2" />
              Gestionar
            </button>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.conditions" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          <div v-else class="scroll-y" style="max-height: 350px">
            <!-- Chronic Diseases -->
            <div v-if="chronicDiseases.length > 0" class="mb-4">
              <div class="fw-bold text-gray-700 fs-6 mb-3">
                Enfermedades Crónicas
              </div>
              <div
                v-for="disease in chronicDiseases"
                :key="disease.id"
                class="border border-gray-300 border-dashed rounded p-3 mb-2"
              >
                <div class="d-flex justify-content-between align-items-start">
                  <div class="flex-grow-1">
                    <div class="fw-bold text-gray-800 fs-7">
                      {{ disease.name }}
                    </div>
                    <div
                      v-if="disease.diagnosis_date"
                      class="text-gray-600 fs-8"
                    >
                      Diagnóstico: {{ formatDate(disease.diagnosis_date) }}
                    </div>
                    <div v-if="disease.severity" class="mt-1">
                      <span
                        class="badge badge-sm"
                        :class="getSeverityClass(disease.severity)"
                      >
                        {{ getSeverityText(disease.severity) }}
                      </span>
                    </div>
                    <div v-if="disease.notes" class="text-gray-600 fs-8 mt-1">
                      {{ disease.notes }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Disabilities -->
            <div v-if="disabilities.length > 0" class="mb-4">
              <div class="fw-bold text-gray-700 fs-6 mb-3">Discapacidades</div>
              <div
                v-for="disability in disabilities"
                :key="disability.id"
                class="border border-gray-300 border-dashed rounded p-3 mb-2"
              >
                <div class="fw-bold text-gray-800 fs-7">
                  {{ disability.name }}
                </div>
                <div v-if="disability.type" class="text-gray-600 fs-8">
                  Tipo: {{ disability.type }}
                </div>
                <div
                  v-if="disability.description"
                  class="text-gray-600 fs-8 mt-1"
                >
                  {{ disability.description }}
                </div>
              </div>
            </div>

            <!-- Allergies -->
            <div v-if="allergies.length > 0" class="mb-4">
              <div class="fw-bold text-gray-700 fs-6 mb-3">Alergias</div>
              <div
                v-for="allergy in allergies"
                :key="allergy.id"
                class="border border-danger border-dashed rounded p-3 mb-2 bg-light-danger"
              >
                <div class="d-flex align-items-center">
                  <KTIcon
                    icon-name="warning-2"
                    icon-class="fs-5 text-danger me-2"
                  />
                  <div class="flex-grow-1">
                    <div class="fw-bold text-danger fs-7">
                      {{ allergy.name }}
                    </div>
                    <div
                      v-if="allergy.reaction_type"
                      class="text-gray-600 fs-8"
                    >
                      Reacción: {{ allergy.reaction_type }}
                    </div>
                    <div v-if="allergy.severity" class="mt-1">
                      <span
                        class="badge badge-sm"
                        :class="getAllergySeverityClass(allergy.severity)"
                      >
                        {{ getAllergySeverityText(allergy.severity) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No conditions message -->
            <div v-if="!hasAnyConditions" class="text-center py-5">
              <KTIcon
                icon-name="heart-circle"
                icon-class="fs-5x text-gray-400 mb-4"
              />
              <div class="text-gray-600">
                No hay condiciones médicas registradas
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Current Treatments -->
    <div class="col-md-6 col-xl-4">
      <div class="card card-flush h-100">
        <div class="card-header pt-7">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-gray-800"
              >Tratamientos Activos</span
            >
            <span class="text-gray-600 mt-1 fw-semibold fs-6"
              >{{ activeTreatments.length }} tratamientos en curso</span
            >
          </h3>
          <div class="card-toolbar">
            <button
              v-if="canManageTreatments"
              @click="openAddTreatmentModal"
              class="btn btn-sm btn-light-primary"
            >
              <KTIcon icon-name="pill" icon-class="fs-2" />
              Agregar
            </button>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.treatments" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          <div
            v-else-if="activeTreatments.length === 0"
            class="text-center py-5"
          >
            <KTIcon icon-name="pill" icon-class="fs-5x text-gray-400 mb-4" />
            <div class="text-gray-600">No hay tratamientos activos</div>
          </div>
          <div v-else class="scroll-y" style="max-height: 350px">
            <div
              v-for="treatment in activeTreatments"
              :key="treatment.id"
              class="border border-gray-300 border-dashed rounded p-3 mb-3"
            >
              <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-800 fs-6">
                    {{ treatment.medication_name }}
                  </div>
                  <div class="text-gray-600 fs-7">{{ treatment.dosage }}</div>
                  <div class="text-gray-600 fs-7">
                    Frecuencia: {{ treatment.frequency }}
                  </div>
                  <div class="mt-2">
                    <span
                      class="badge"
                      :class="getTreatmentStatusClass(treatment.status)"
                    >
                      {{ getTreatmentStatusText(treatment.status) }}
                    </span>
                    <span
                      v-if="treatment.priority"
                      class="badge badge-light-warning ms-2"
                    >
                      {{ treatment.priority }}
                    </span>
                  </div>
                  <div class="text-gray-600 fs-8 mt-1">
                    Prescrito: {{ formatDate(treatment.start_date) }}
                  </div>
                  <div v-if="treatment.end_date" class="text-gray-600 fs-8">
                    Fin: {{ formatDate(treatment.end_date) }}
                  </div>
                </div>
                <div class="dropdown">
                  <button
                    class="btn btn-sm btn-light btn-active-light-primary"
                    data-bs-toggle="dropdown"
                  >
                    <KTIcon icon-name="dots-vertical" icon-class="fs-7" />
                  </button>
                  <div
                    class="dropdown-menu menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-200px py-4"
                  >
                    <div class="menu-item px-3">
                      <a
                        @click.prevent="viewTreatmentHistory(treatment)"
                        class="menu-link px-3"
                      >
                        <KTIcon icon-name="time" icon-class="fs-6 me-2" />
                        Historial
                      </a>
                    </div>
                    <div v-if="canManageTreatments" class="menu-item px-3">
                      <a
                        @click.prevent="editTreatment(treatment)"
                        class="menu-link px-3"
                      >
                        <KTIcon icon-name="pencil" icon-class="fs-6 me-2" />
                        Editar
                      </a>
                    </div>
                    <div
                      v-if="canManageTreatments"
                      class="menu-separator"
                    ></div>
                    <div
                      v-if="
                        canManageTreatments && treatment.status === 'active'
                      "
                      class="menu-item px-3"
                    >
                      <a
                        @click.prevent="completeTreatment(treatment)"
                        class="menu-link px-3 text-success"
                      >
                        <KTIcon icon-name="check" icon-class="fs-6 me-2" />
                        Completar
                      </a>
                    </div>
                    <div
                      v-if="
                        canManageTreatments && treatment.status === 'active'
                      "
                      class="menu-item px-3"
                    >
                      <a
                        @click.prevent="suspendTreatment(treatment)"
                        class="menu-link px-3 text-warning"
                      >
                        <KTIcon icon-name="pause" icon-class="fs-6 me-2" />
                        Suspender
                      </a>
                    </div>
                    <div v-if="canManageTreatments" class="menu-item px-3">
                      <a
                        @click.prevent="discontinueTreatment(treatment)"
                        class="menu-link px-3 text-danger"
                      >
                        <KTIcon icon-name="cross" icon-class="fs-6 me-2" />
                        Discontinuar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Medical Consultations -->
    <div class="col-md-6 col-xl-8">
      <div class="card card-flush h-100">
        <div class="card-header pt-7">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-gray-800"
              >Consultas Médicas Recientes</span
            >
            <span class="text-gray-600 mt-1 fw-semibold fs-6"
              >Últimas 10 consultas</span
            >
          </h3>
          <div class="card-toolbar">
            <button
              v-if="canScheduleConsultations"
              @click="openScheduleConsultationModal"
              class="btn btn-sm btn-light-primary me-3"
            >
              <KTIcon icon-name="calendar-add" icon-class="fs-2" />
              Agendar Consulta
            </button>
            <button
              v-if="canAddConsultations"
              @click="openAddConsultationModal"
              class="btn btn-sm btn-light-success"
            >
              <KTIcon icon-name="notepad-edit" icon-class="fs-2" />
              Registrar Consulta
            </button>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.consultations" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          <div
            v-else-if="medicalConsultations.length === 0"
            class="text-center py-5"
          >
            <KTIcon
              icon-name="stethoscope"
              icon-class="fs-5x text-gray-400 mb-4"
            />
            <div class="text-gray-600">
              No hay consultas médicas registradas
            </div>
          </div>
          <div v-else>
            <div class="table-responsive">
              <table class="table table-rounded table-striped border gy-7 gs-7">
                <thead>
                  <tr
                    class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200"
                  >
                    <th>Fecha</th>
                    <th>Tipo de Consulta</th>
                    <th>Médico</th>
                    <th>Diagnóstico</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="consultation in medicalConsultations"
                    :key="consultation.id"
                  >
                    <td>
                      {{ formatDateTime(consultation.consultation_date) }}
                    </td>
                    <td>
                      <div class="fw-bold">
                        {{ consultation.consultation_type }}
                      </div>
                      <div
                        v-if="consultation.speciality"
                        class="text-gray-600 fs-7"
                      >
                        {{ consultation.speciality }}
                      </div>
                    </td>
                    <td>
                      <div class="fw-bold">{{ consultation.doctor_name }}</div>
                      <div
                        v-if="consultation.medical_center"
                        class="text-gray-600 fs-7"
                      >
                        {{ consultation.medical_center }}
                      </div>
                    </td>
                    <td>
                      <div>
                        {{ consultation.primary_diagnosis || "Pendiente" }}
                      </div>
                      <div
                        v-if="consultation.secondary_diagnoses"
                        class="text-gray-600 fs-7"
                      >
                        {{ consultation.secondary_diagnoses }}
                      </div>
                    </td>
                    <td>
                      <span
                        class="badge"
                        :class="getConsultationStatusClass(consultation.status)"
                      >
                        {{ getConsultationStatusText(consultation.status) }}
                      </span>
                    </td>
                    <td>
                      <div class="d-flex gap-1">
                        <button
                          @click="viewConsultationDetails(consultation)"
                          class="btn btn-sm btn-light btn-active-light-primary"
                          title="Ver Detalles"
                        >
                          <KTIcon icon-name="eye" icon-class="fs-7" />
                        </button>
                        <button
                          v-if="
                            canEditConsultations &&
                            consultation.status !== 'completed'
                          "
                          @click="editConsultation(consultation)"
                          class="btn btn-sm btn-light btn-active-light-primary"
                          title="Editar"
                        >
                          <KTIcon icon-name="pencil" icon-class="fs-7" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Medical Statistics -->
    <div class="col-md-6 col-xl-4">
      <div class="card card-flush h-100">
        <div class="card-header pt-7">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-gray-800"
              >Estadísticas Médicas</span
            >
            <span class="text-gray-600 mt-1 fw-semibold fs-6"
              >Resumen de atención</span
            >
          </h3>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.statistics" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          <div v-else>
            <!-- Total Consultations -->
            <div
              class="d-flex align-items-center border-1 border-dashed border-gray-300 rounded p-3 mb-3"
            >
              <div class="symbol symbol-40px me-3">
                <div class="symbol-label bg-light-primary">
                  <KTIcon
                    icon-name="notepad-edit"
                    icon-class="fs-2 text-primary"
                  />
                </div>
              </div>
              <div class="flex-grow-1">
                <div class="fw-bold text-gray-800 fs-6">Total Consultas</div>
                <div class="text-gray-600 fs-7">
                  {{ medicalStatistics.total_consultations || 0 }}
                </div>
              </div>
            </div>

            <!-- Active Treatments -->
            <div
              class="d-flex align-items-center border-1 border-dashed border-gray-300 rounded p-3 mb-3"
            >
              <div class="symbol symbol-40px me-3">
                <div class="symbol-label bg-light-success">
                  <KTIcon icon-name="pill" icon-class="fs-2 text-success" />
                </div>
              </div>
              <div class="flex-grow-1">
                <div class="fw-bold text-gray-800 fs-6">
                  Tratamientos Activos
                </div>
                <div class="text-gray-600 fs-7">
                  {{ medicalStatistics.active_treatments || 0 }}
                </div>
              </div>
            </div>

            <!-- Last Consultation -->
            <div
              class="d-flex align-items-center border-1 border-dashed border-gray-300 rounded p-3 mb-3"
            >
              <div class="symbol symbol-40px me-3">
                <div class="symbol-label bg-light-warning">
                  <KTIcon icon-name="calendar" icon-class="fs-2 text-warning" />
                </div>
              </div>
              <div class="flex-grow-1">
                <div class="fw-bold text-gray-800 fs-6">Última Consulta</div>
                <div class="text-gray-600 fs-7">
                  {{
                    medicalStatistics.last_consultation_date
                      ? formatDate(medicalStatistics.last_consultation_date)
                      : "N/A"
                  }}
                </div>
              </div>
            </div>

            <!-- Medical Risk Level -->
            <div
              class="d-flex align-items-center border-1 border-dashed border-gray-300 rounded p-3 mb-3"
            >
              <div class="symbol symbol-40px me-3">
                <div class="symbol-label bg-light-danger">
                  <KTIcon
                    icon-name="security-check"
                    icon-class="fs-2 text-danger"
                  />
                </div>
              </div>
              <div class="flex-grow-1">
                <div class="fw-bold text-gray-800 fs-6">Nivel de Riesgo</div>
                <div>
                  <span
                    class="badge"
                    :class="
                      getRiskLevelClass(medicalStatistics.risk_level || 'low')
                    "
                  >
                    {{
                      getRiskLevelText(medicalStatistics.risk_level || "low")
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit Medical Profile Modal -->
  <div
    class="modal fade"
    id="editMedicalProfileModal"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Editar Perfil Médico</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveMedicalProfile">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Tipo de Sangre</label>
                <select v-model="medicalForm.blood_type_id" class="form-select">
                  <option value="">Seleccione tipo de sangre</option>
                  <option
                    v-for="type in bloodTypes"
                    :key="type.id"
                    :value="type.id"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Estado de Salud Mental</label>
                <select
                  v-model="medicalForm.mental_health_status_id"
                  class="form-select"
                >
                  <option value="">Seleccione estado</option>
                  <option
                    v-for="status in mentalHealthStatuses"
                    :key="status.id"
                    :value="status.id"
                  >
                    {{ status.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Contacto de Emergencia</label>
                <input
                  v-model="medicalForm.emergency_contact_name"
                  type="text"
                  class="form-control"
                  placeholder="Nombre del contacto"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Teléfono de Emergencia</label>
                <input
                  v-model="medicalForm.emergency_contact_phone"
                  type="text"
                  class="form-control"
                  placeholder="Número de teléfono"
                />
              </div>
              <div class="col-12">
                <label class="form-label">Notas Médicas</label>
                <textarea
                  v-model="medicalForm.medical_notes"
                  class="form-control"
                  rows="4"
                  placeholder="Notas adicionales sobre el perfil médico"
                ></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">
            Cancelar
          </button>
          <button
            type="button"
            @click="saveMedicalProfile"
            class="btn btn-primary"
            :disabled="loading.saving"
          >
            <span
              v-if="loading.saving"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            Guardar Perfil
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import type { InmateDetail, InmateMedicalProfile } from "@/types/inmates";
import Swal from "sweetalert2";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";

interface Props {
  inmate: InmateDetail;
}

// Medical specific interfaces
interface ChronicDisease {
  id: number;
  name: string;
  diagnosis_date?: string;
  severity?: "mild" | "moderate" | "severe";
  notes?: string;
}

interface Disability {
  id: number;
  name: string;
  type?: string;
  description?: string;
}

interface Allergy {
  id: number;
  name: string;
  reaction_type?: string;
  severity?: "mild" | "moderate" | "severe" | "life_threatening";
}

interface MedicalTreatment {
  id: number;
  medication_name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  status: "active" | "completed" | "suspended" | "discontinued";
  priority?: "low" | "normal" | "high" | "urgent";
  prescribing_doctor?: string;
  notes?: string;
}

interface MedicalConsultation {
  id: number;
  consultation_date: string;
  consultation_type: string;
  speciality?: string;
  doctor_name: string;
  medical_center?: string;
  primary_diagnosis?: string;
  secondary_diagnoses?: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  notes?: string;
}

interface MedicalStatistics {
  total_consultations: number;
  active_treatments: number;
  last_consultation_date?: string;
  risk_level: "low" | "medium" | "high" | "critical";
}

interface BloodType {
  id: number;
  name: string;
}

interface MentalHealthStatus {
  id: number;
  name: string;
}

const props = defineProps<Props>();
const authStore = useAuthStore();

// Reactive data
const medicalProfile = ref<InmateMedicalProfile | null>(null);
const chronicDiseases = ref<ChronicDisease[]>([]);
const disabilities = ref<Disability[]>([]);
const allergies = ref<Allergy[]>([]);
const activeTreatments = ref<MedicalTreatment[]>([]);
const medicalConsultations = ref<MedicalConsultation[]>([]);
const medicalStatistics = ref<MedicalStatistics>({
  total_consultations: 0,
  active_treatments: 0,
  risk_level: "low",
});
const bloodTypes = ref<BloodType[]>([]);
const mentalHealthStatuses = ref<MentalHealthStatus[]>([]);

const loading = ref({
  profile: false,
  conditions: false,
  treatments: false,
  consultations: false,
  statistics: false,
  saving: false,
});

// Medical profile form
const medicalForm = ref({
  blood_type_id: null as number | null,
  mental_health_status_id: null as number | null,
  emergency_contact_name: "",
  emergency_contact_phone: "",
  medical_notes: "",
});

// Computed properties
const canEditMedical = computed(() => authStore.hasPermission("medical.edit"));
const canManageTreatments = computed(() =>
  authStore.hasPermission("medical.treatments"),
);
const canScheduleConsultations = computed(() =>
  authStore.hasPermission("medical.schedule"),
);
const canAddConsultations = computed(() =>
  authStore.hasPermission("medical.consultations"),
);
const canEditConsultations = computed(() =>
  authStore.hasPermission("medical.edit_consultations"),
);

const hasAllergies = computed(() => allergies.value.length > 0);
const hasChronicDiseases = computed(() => chronicDiseases.value.length > 0);
const hasDisabilities = computed(() => disabilities.value.length > 0);
const hasMedicalAlerts = computed(
  () => hasAllergies.value || hasChronicDiseases.value || hasDisabilities.value,
);
const hasAnyConditions = computed(
  () => hasAllergies.value || hasChronicDiseases.value || hasDisabilities.value,
);

// Methods
const loadMedicalData = async () => {
  try {
    loading.value.profile = true;

    // Load medical profile - support both camelCase and snake_case
    if (props.inmate.medicalProfile || props.inmate.medical_profile) {
      medicalProfile.value = props.inmate.medicalProfile || props.inmate.medical_profile;
    }

    // Load reference data
    await loadReferenceData();
  } catch (error) {
    console.error("Error loading medical data:", error);
  } finally {
    loading.value.profile = false;
  }
};

const loadMedicalConditions = async () => {
  try {
    loading.value.conditions = true;

    // Load from medical profile - support both camelCase and snake_case
    const chronicDiseasesData = medicalProfile.value?.chronicDiseases || medicalProfile.value?.chronic_diseases;
    if (chronicDiseasesData) {
      chronicDiseases.value = Array.isArray(chronicDiseasesData) ? chronicDiseasesData : [];
    }

    const disabilitiesData = medicalProfile.value?.disabilities;
    if (disabilitiesData) {
      disabilities.value = Array.isArray(disabilitiesData) ? disabilitiesData : [];
    }

    const allergiesData = medicalProfile.value?.allergies;
    if (allergiesData) {
      allergies.value = Array.isArray(allergiesData) ? allergiesData : [];
    }
  } catch (error) {
    console.error("Error loading medical conditions:", error);
  } finally {
    loading.value.conditions = false;
  }
};

const loadTreatments = async () => {
  try {
    loading.value.treatments = true;

    // Load from medical profile medications
    const medicationsData = medicalProfile.value?.medications;
    if (medicationsData && Array.isArray(medicationsData)) {
      activeTreatments.value = medicationsData.filter((m: any) => m.status === 'active');
    } else {
      activeTreatments.value = [];
    }
  } catch (error) {
    console.error("Error loading treatments:", error);
  } finally {
    loading.value.treatments = false;
  }
};

const loadConsultations = async () => {
  try {
    loading.value.consultations = true;

    // Load from medical profile consultations
    const consultationsData = medicalProfile.value?.consultations;
    if (consultationsData && Array.isArray(consultationsData)) {
      // Get most recent 5 consultations
      medicalConsultations.value = consultationsData
        .sort((a: any, b: any) => new Date(b.consultation_date).getTime() - new Date(a.consultation_date).getTime())
        .slice(0, 5);
    } else {
      medicalConsultations.value = [];
    }
  } catch (error) {
    console.error("Error loading consultations:", error);
  } finally {
    loading.value.consultations = false;
  }
};

const loadStatistics = async () => {
  try {
    loading.value.statistics = true;

    // Calculate statistics from real data
    const consultationsCount = medicalProfile.value?.consultations?.length || 0;
    const lastConsultation = medicalProfile.value?.consultations && medicalProfile.value.consultations.length > 0
      ? medicalProfile.value.consultations[0].consultation_date
      : null;

    medicalStatistics.value = {
      total_consultations: consultationsCount,
      active_treatments: activeTreatments.value.length,
      last_consultation_date: lastConsultation,
      risk_level: medicalProfile.value?.medical_risk_level || "low",
    };
  } catch (error) {
    console.error("Error loading statistics:", error);
  } finally {
    loading.value.statistics = false;
  }
};

const loadReferenceData = async () => {
  try {
    // Mock data - this would come from backend
    bloodTypes.value = [
      { id: 1, name: "A+" },
      { id: 2, name: "A-" },
      { id: 3, name: "B+" },
      { id: 4, name: "B-" },
      { id: 5, name: "AB+" },
      { id: 6, name: "AB-" },
      { id: 7, name: "O+" },
      { id: 8, name: "O-" },
    ];

    mentalHealthStatuses.value = [
      { id: 1, name: "Normal" },
      { id: 2, name: "Ansiedad" },
      { id: 3, name: "Depresión" },
      { id: 4, name: "Bipolar" },
      { id: 5, name: "Esquizofrenia" },
      { id: 6, name: "Otros" },
    ];
  } catch (error) {
    console.error("Error loading reference data:", error);
  }
};

// Medical profile methods
const openEditMedicalProfileModal = () => {
  if (medicalProfile.value) {
    medicalForm.value = {
      blood_type_id: medicalProfile.value.blood_type_id || null,
      mental_health_status_id:
        medicalProfile.value.mental_health_status_id || null,
      emergency_contact_name: medicalProfile.value.emergency_contact_name || "",
      emergency_contact_phone:
        medicalProfile.value.emergency_contact_phone || "",
      medical_notes: medicalProfile.value.medical_notes || "",
    };
  }

  const modal = new (window as any).bootstrap.Modal(
    document.getElementById("editMedicalProfileModal"),
  );
  modal.show();
};

const saveMedicalProfile = async () => {
  try {
    loading.value.saving = true;

    // Here would call backend API to save medical profile
    console.log("Saving medical profile:", medicalForm.value);

    // Close modal
    const modal = (window as any).bootstrap.Modal.getInstance(
      document.getElementById("editMedicalProfileModal"),
    );
    modal.hide();

    // Reload data
    await loadMedicalData();

    Swal.fire({
      title: "Perfil Guardado",
      text: "El perfil médico ha sido actualizado correctamente.",
      icon: "success",
      confirmButtonText: "OK",
    });
  } catch (error) {
    console.error("Error saving medical profile:", error);
    Swal.fire({
      title: "Error",
      text: "No se pudo guardar el perfil médico.",
      icon: "error",
      confirmButtonText: "OK",
    });
  } finally {
    loading.value.saving = false;
  }
};

// Conditions management
const openManageConditionsModal = () => {
  Swal.fire({
    title: "Gestionar Condiciones",
    text: "Funcionalidad de gestión de condiciones médicas en desarrollo.",
    icon: "info",
    confirmButtonText: "OK",
  });
};

// Treatment management
const openAddTreatmentModal = () => {
  Swal.fire({
    title: "Agregar Tratamiento",
    text: "Funcionalidad de gestión de tratamientos en desarrollo.",
    icon: "info",
    confirmButtonText: "OK",
  });
};

const viewTreatmentHistory = (treatment: MedicalTreatment) => {
  console.log("Viewing treatment history:", treatment.id);
};

const editTreatment = (treatment: MedicalTreatment) => {
  console.log("Editing treatment:", treatment.id);
};

const completeTreatment = async (treatment: MedicalTreatment) => {
  const result = await Swal.fire({
    title: "Completar Tratamiento",
    text: `¿Marcar como completado el tratamiento ${treatment.medication_name}?`,
    showCancelButton: true,
    confirmButtonText: "Completar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    console.log("Completing treatment:", treatment.id);
    await loadTreatments();
  }
};

const suspendTreatment = async (treatment: MedicalTreatment) => {
  const { value: reason } = await Swal.fire({
    title: "Suspender Tratamiento",
    text: `¿Suspender el tratamiento ${treatment.medication_name}?`,
    input: "textarea",
    inputPlaceholder: "Motivo de la suspensión",
    showCancelButton: true,
    confirmButtonText: "Suspender",
    cancelButtonText: "Cancelar",
  });

  if (reason) {
    console.log("Suspending treatment:", treatment.id, "Reason:", reason);
    await loadTreatments();
  }
};

const discontinueTreatment = async (treatment: MedicalTreatment) => {
  const { value: reason } = await Swal.fire({
    title: "Discontinuar Tratamiento",
    text: `¿Discontinuar permanentemente el tratamiento ${treatment.medication_name}?`,
    input: "textarea",
    inputPlaceholder: "Motivo de la discontinuación",
    showCancelButton: true,
    confirmButtonText: "Discontinuar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#d33",
  });

  if (reason) {
    console.log("Discontinuing treatment:", treatment.id, "Reason:", reason);
    await loadTreatments();
  }
};

// Consultation management
const openScheduleConsultationModal = () => {
  Swal.fire({
    title: "Agendar Consulta",
    text: "Funcionalidad de agendamiento de consultas en desarrollo.",
    icon: "info",
    confirmButtonText: "OK",
  });
};

const openAddConsultationModal = () => {
  Swal.fire({
    title: "Registrar Consulta",
    text: "Funcionalidad de registro de consultas en desarrollo.",
    icon: "info",
    confirmButtonText: "OK",
  });
};

const viewConsultationDetails = (consultation: MedicalConsultation) => {
  console.log("Viewing consultation details:", consultation.id);
};

const editConsultation = (consultation: MedicalConsultation) => {
  console.log("Editing consultation:", consultation.id);
};

// Helper methods
const getSeverityClass = (severity: string): string => {
  const classes: Record<string, string> = {
    mild: "badge-light-success",
    moderate: "badge-light-warning",
    severe: "badge-light-danger",
  };
  return classes[severity] || "badge-light-secondary";
};

const getSeverityText = (severity: string): string => {
  const texts: Record<string, string> = {
    mild: "Leve",
    moderate: "Moderado",
    severe: "Severo",
  };
  return texts[severity] || severity;
};

const getAllergySeverityClass = (severity: string): string => {
  const classes: Record<string, string> = {
    mild: "badge-light-warning",
    moderate: "badge-light-warning",
    severe: "badge-light-danger",
    life_threatening: "badge-danger",
  };
  return classes[severity] || "badge-light-secondary";
};

const getAllergySeverityText = (severity: string): string => {
  const texts: Record<string, string> = {
    mild: "Leve",
    moderate: "Moderado",
    severe: "Severo",
    life_threatening: "Mortal",
  };
  return texts[severity] || severity;
};

const getTreatmentStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    active: "badge-light-success",
    completed: "badge-light-primary",
    suspended: "badge-light-warning",
    discontinued: "badge-light-danger",
  };
  return classes[status] || "badge-light-secondary";
};

const getTreatmentStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    active: "Activo",
    completed: "Completado",
    suspended: "Suspendido",
    discontinued: "Discontinuado",
  };
  return texts[status] || status;
};

const getConsultationStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    scheduled: "badge-light-info",
    in_progress: "badge-light-primary",
    completed: "badge-light-success",
    cancelled: "badge-light-danger",
  };
  return classes[status] || "badge-light-secondary";
};

const getConsultationStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    scheduled: "Programada",
    in_progress: "En Progreso",
    completed: "Completada",
    cancelled: "Cancelada",
  };
  return texts[status] || status;
};

const getRiskLevelClass = (level: string): string => {
  const classes: Record<string, string> = {
    low: "badge-light-success",
    medium: "badge-light-warning",
    high: "badge-light-danger",
    critical: "badge-danger",
  };
  return classes[level] || "badge-light-secondary";
};

const getRiskLevelText = (level: string): string => {
  const texts: Record<string, string> = {
    low: "Bajo",
    medium: "Medio",
    high: "Alto",
    critical: "Crítico",
  };
  return texts[level] || level;
};

const formatDate = (date: string): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("es-GT");
};

const formatDateTime = (datetime: string): string => {
  if (!datetime) return "N/A";
  return new Date(datetime).toLocaleString("es-GT");
};

// Lifecycle
onMounted(() => {
  loadMedicalData();
  loadMedicalConditions();
  loadTreatments();
  loadConsultations();
  loadStatistics();
});
</script>

<style scoped>
.scroll-y {
  overflow-y: auto;
}

.symbol-40px {
  width: 40px;
  height: 40px;
}
</style>
