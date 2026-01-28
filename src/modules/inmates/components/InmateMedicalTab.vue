<template>
  <div class="row g-6 g-xl-9">
    <!-- Medical Profile Overview -->
    <div class="col-md-6 col-xl-4">
      <div class="card card-flush h-100">
        <div class="card-header pt-7">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-gray-800"
              >{{ $t('inmates.tabs.medical.profile.title') }}</span
            >
            <span class="text-gray-600 mt-1 fw-semibold fs-6"
              >{{ $t('inmates.tabs.medical.profile.subtitle') }}</span
            >
          </h3>
          <div class="card-toolbar">
            <button
              v-if="canEditMedical"
              @click="openEditMedicalProfileModal"
              class="btn btn-sm btn-light-primary"
            >
              <KTIcon icon-name="pencil" icon-class="fs-2" />
              {{ $t('inmates.tabs.medical.buttons.edit') }}
            </button>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.profile" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{ $t('inmates.tabs.medical.loading') }}</span>
            </div>
          </div>
          <div v-else>
            <!-- Blood Type -->
            <div class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2"
                >{{ $t('inmates.tabs.medical.fields.bloodType') }}</span
              >
              <span class="text-gray-800">
                {{ medicalProfile?.bloodType?.name || medicalProfile?.blood_type?.name || $t('inmates.tabs.medical.notSpecified') }}
              </span>
            </div>

            <!-- Emergency Contact -->
            <div class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2"
                >{{ $t('inmates.tabs.medical.fields.emergencyContact') }}</span
              >
              <div v-if="medicalProfile?.emergency_contact_name">
                <div class="text-gray-800">
                  {{ medicalProfile.emergency_contact_name }}
                </div>
                <div class="text-gray-600 fs-7">
                  {{ medicalProfile.emergency_contact_phone }}
                </div>
              </div>
              <span v-else class="text-gray-500">{{ $t('inmates.tabs.medical.notSpecified') }}</span>
            </div>

            <!-- Mental Health Status -->
            <div class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2"
                >{{ $t('inmates.tabs.medical.fields.mentalHealthStatus') }}</span
              >
              <span class="text-gray-800">
                {{ medicalProfile?.mentalHealthStatus?.name || medicalProfile?.mental_health_status?.name || $t('inmates.tabs.medical.notEvaluated') }}
              </span>
            </div>

            <!-- Medical Alerts -->
            <div v-if="hasMedicalAlerts" class="mb-4">
              <span class="fw-bold text-gray-600 d-block mb-2"
                >{{ $t('inmates.tabs.medical.alerts.medicalAlerts') }}</span
              >
              <div class="d-flex flex-wrap gap-2">
                <span v-if="hasAllergies" class="badge badge-light-warning">
                  <KTIcon icon-name="warning-2" icon-class="fs-6 me-1" />
                  {{ $t('inmates.tabs.medical.conditions.allergies') }}
                </span>
                <span
                  v-if="hasChronicDiseases"
                  class="badge badge-light-danger"
                >
                  <KTIcon icon-name="heart" icon-class="fs-6 me-1" />
                  {{ $t('inmates.tabs.medical.conditions.chronicDiseases') }}
                </span>
                <span v-if="hasDisabilities" class="badge badge-light-info">
                  <KTIcon icon-name="information" icon-class="fs-6 me-1" />
                  {{ $t('inmates.tabs.medical.conditions.disabilities') }}
                </span>
              </div>
            </div>

            <!-- Last Medical Update -->
            <div class="text-gray-600 fs-8">
              <KTIcon icon-name="calendar" icon-class="fs-7 me-1" />
              {{ $t('inmates.tabs.medical.lastUpdate') }}:
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
              >{{ $t('inmates.tabs.medical.conditions.title') }}</span
            >
            <span class="text-gray-600 mt-1 fw-semibold fs-6"
              >{{ $t('inmates.tabs.medical.conditions.subtitle') }}</span
            >
          </h3>
          <div class="card-toolbar">
            <button
              v-if="canEditMedical"
              @click="openManageConditionsModal"
              class="btn btn-sm btn-light-success"
            >
              <KTIcon icon-name="medical-mask" icon-class="fs-2" />
              {{ $t('inmates.tabs.medical.buttons.manage') }}
            </button>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.conditions" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{ $t('inmates.tabs.medical.loading') }}</span>
            </div>
          </div>
          <div v-else class="scroll-y" style="max-height: 350px">
            <!-- Chronic Diseases -->
            <div v-if="chronicDiseases.length > 0" class="mb-4">
              <div class="fw-bold text-gray-700 fs-6 mb-3">
                {{ $t('inmates.tabs.medical.conditions.chronicDiseases') }}
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
                      {{ $t('inmates.tabs.medical.conditions.diagnosis') }}: {{ formatDate(disease.diagnosis_date) }}
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
              <div class="fw-bold text-gray-700 fs-6 mb-3">{{ $t('inmates.tabs.medical.conditions.disabilities') }}</div>
              <div
                v-for="disability in disabilities"
                :key="disability.id"
                class="border border-gray-300 border-dashed rounded p-3 mb-2"
              >
                <div class="fw-bold text-gray-800 fs-7">
                  {{ disability.name }}
                </div>
                <div v-if="disability.type" class="text-gray-600 fs-8">
                  {{ $t('inmates.tabs.medical.conditions.type') }}: {{ disability.type }}
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
              <div class="fw-bold text-gray-700 fs-6 mb-3">{{ $t('inmates.tabs.medical.conditions.allergies') }}</div>
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
                      {{ $t('inmates.tabs.medical.conditions.reaction') }}: {{ allergy.reaction_type }}
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
                {{ $t('inmates.tabs.medical.conditions.noData') }}
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
              >{{ $t('inmates.tabs.medical.treatments.title') }}</span
            >
            <span class="text-gray-600 mt-1 fw-semibold fs-6"
              >{{ $t('inmates.tabs.medical.treatments.subtitle', { count: activeTreatments.length }) }}</span
            >
          </h3>
          <div class="card-toolbar">
            <button
              v-if="canManageTreatments"
              @click="openAddTreatmentModal"
              class="btn btn-sm btn-light-primary"
            >
              <KTIcon icon-name="pill" icon-class="fs-2" />
              {{ $t('inmates.tabs.medical.buttons.add') }}
            </button>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.treatments" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{ $t('inmates.tabs.medical.loading') }}</span>
            </div>
          </div>
          <div
            v-else-if="activeTreatments.length === 0"
            class="text-center py-5"
          >
            <KTIcon icon-name="pill" icon-class="fs-5x text-gray-400 mb-4" />
            <div class="text-gray-600">{{ $t('inmates.tabs.medical.treatments.noData') }}</div>
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
                    {{ $t('inmates.tabs.medical.treatments.frequency') }}: {{ treatment.frequency }}
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
                    {{ $t('inmates.tabs.medical.treatments.prescribed') }}: {{ formatDate(treatment.start_date) }}
                  </div>
                  <div v-if="treatment.end_date" class="text-gray-600 fs-8">
                    {{ $t('inmates.tabs.medical.treatments.end') }}: {{ formatDate(treatment.end_date) }}
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
                        {{ $t('inmates.tabs.medical.treatments.history') }}
                      </a>
                    </div>
                    <div v-if="canManageTreatments" class="menu-item px-3">
                      <a
                        @click.prevent="editTreatment(treatment)"
                        class="menu-link px-3"
                      >
                        <KTIcon icon-name="pencil" icon-class="fs-6 me-2" />
                        {{ $t('inmates.tabs.medical.buttons.edit') }}
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
                        {{ $t('inmates.tabs.medical.treatments.complete') }}
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
                        {{ $t('inmates.tabs.medical.treatments.suspend') }}
                      </a>
                    </div>
                    <div v-if="canManageTreatments" class="menu-item px-3">
                      <a
                        @click.prevent="discontinueTreatment(treatment)"
                        class="menu-link px-3 text-danger"
                      >
                        <KTIcon icon-name="cross" icon-class="fs-6 me-2" />
                        {{ $t('inmates.tabs.medical.treatments.discontinue') }}
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
              >{{ $t('inmates.tabs.medical.consultations.recentTitle') }}</span
            >
            <span class="text-gray-600 mt-1 fw-semibold fs-6"
              >{{ $t('inmates.tabs.medical.consultations.subtitle') }}</span
            >
          </h3>
          <div class="card-toolbar">
            <button
              v-if="canScheduleConsultations"
              @click="openScheduleConsultationModal"
              class="btn btn-sm btn-light-primary me-3"
            >
              <KTIcon icon-name="calendar-add" icon-class="fs-2" />
              {{ $t('inmates.tabs.medical.consultations.scheduleConsultation') }}
            </button>
            <button
              v-if="canAddConsultations"
              @click="openAddConsultationModal"
              class="btn btn-sm btn-light-success"
            >
              <KTIcon icon-name="notepad-edit" icon-class="fs-2" />
              {{ $t('inmates.tabs.medical.consultations.registerConsultation') }}
            </button>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.consultations" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{ $t('inmates.tabs.medical.loading') }}</span>
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
              {{ $t('inmates.tabs.medical.consultations.noData') }}
            </div>
          </div>
          <div v-else>
            <div class="table-responsive">
              <table class="table table-rounded table-striped border gy-7 gs-7">
                <thead>
                  <tr
                    class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200"
                  >
                    <th>{{ $t('inmates.tabs.medical.consultations.tableHeaders.date') }}</th>
                    <th>{{ $t('inmates.tabs.medical.consultations.tableHeaders.consultationType') }}</th>
                    <th>{{ $t('inmates.tabs.medical.consultations.tableHeaders.doctor') }}</th>
                    <th>{{ $t('inmates.tabs.medical.consultations.tableHeaders.diagnosis') }}</th>
                    <th>{{ $t('inmates.tabs.medical.consultations.tableHeaders.status') }}</th>
                    <th>{{ $t('inmates.tabs.medical.consultations.tableHeaders.actions') }}</th>
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
                        {{ consultation.primary_diagnosis || $t('inmates.tabs.medical.consultations.pending') }}
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
                          :title="$t('inmates.tabs.medical.consultations.viewDetails')"
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
                          :title="$t('inmates.tabs.medical.buttons.edit')"
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
              >{{ $t('inmates.tabs.medical.statistics.title') }}</span
            >
            <span class="text-gray-600 mt-1 fw-semibold fs-6"
              >{{ $t('inmates.tabs.medical.statistics.subtitle') }}</span
            >
          </h3>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.statistics" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{ $t('inmates.tabs.medical.loading') }}</span>
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
                <div class="fw-bold text-gray-800 fs-6">{{ $t('inmates.tabs.medical.statistics.totalConsultations') }}</div>
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
                  {{ $t('inmates.tabs.medical.statistics.activeTreatments') }}
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
                <div class="fw-bold text-gray-800 fs-6">{{ $t('inmates.tabs.medical.statistics.lastConsultation') }}</div>
                <div class="text-gray-600 fs-7">
                  {{
                    medicalStatistics.last_consultation_date
                      ? formatDate(medicalStatistics.last_consultation_date)
                      : $t('inmates.tabs.medical.na')
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
                <div class="fw-bold text-gray-800 fs-6">{{ $t('inmates.tabs.medical.statistics.riskLevel') }}</div>
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
          <h5 class="modal-title">{{ $t('inmates.tabs.medical.modal.editProfile') }}</h5>
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
                <label class="form-label">{{ $t('inmates.tabs.medical.fields.bloodType') }}</label>
                <select v-model="medicalForm.blood_type_id" class="form-select">
                  <option value="">{{ $t('inmates.tabs.medical.modal.selectBloodType') }}</option>
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
                <label class="form-label">{{ $t('inmates.tabs.medical.fields.mentalHealthStatus') }}</label>
                <select
                  v-model="medicalForm.mental_health_status_id"
                  class="form-select"
                >
                  <option value="">{{ $t('inmates.tabs.medical.modal.selectStatus') }}</option>
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
                <label class="form-label">{{ $t('inmates.tabs.medical.fields.emergencyContact') }}</label>
                <input
                  v-model="medicalForm.emergency_contact_name"
                  type="text"
                  class="form-control"
                  :placeholder="$t('inmates.tabs.medical.modal.contactName')"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">{{ $t('inmates.tabs.medical.modal.emergencyPhone') }}</label>
                <input
                  v-model="medicalForm.emergency_contact_phone"
                  type="text"
                  class="form-control"
                  :placeholder="$t('inmates.tabs.medical.modal.phoneNumber')"
                />
              </div>
              <div class="col-12">
                <label class="form-label">{{ $t('inmates.tabs.medical.modal.medicalNotes') }}</label>
                <textarea
                  v-model="medicalForm.medical_notes"
                  class="form-control"
                  rows="4"
                  :placeholder="$t('inmates.tabs.medical.modal.notesPlaceholder')"
                ></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">
            {{ $t('inmates.tabs.medical.buttons.cancel') }}
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
            {{ $t('inmates.tabs.medical.buttons.saveProfile') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import type { InmateDetail, InmateMedicalProfile } from "@/types/inmates";
import Swal from "sweetalert2";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";

const { t } = useI18n();

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

    // Close modal
    const modal = (window as any).bootstrap.Modal.getInstance(
      document.getElementById("editMedicalProfileModal"),
    );
    modal.hide();

    // Reload data
    await loadMedicalData();

    Swal.fire({
      title: t('inmates.tabs.medical.swal.profileSaved'),
      text: t('inmates.tabs.medical.swal.profileSavedDesc'),
      icon: "success",
      confirmButtonText: "OK",
    });
  } catch (error) {
    console.error("Error saving medical profile:", error);
    Swal.fire({
      title: t('inmates.common.error'),
      text: t('inmates.tabs.medical.swal.saveError'),
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
    title: t('inmates.tabs.medical.swal.manageConditions'),
    text: t('inmates.tabs.medical.swal.manageConditionsDesc'),
    icon: "info",
    confirmButtonText: "OK",
  });
};

// Treatment management
const openAddTreatmentModal = () => {
  Swal.fire({
    title: t('inmates.tabs.medical.swal.addTreatment'),
    text: t('inmates.tabs.medical.swal.addTreatmentDesc'),
    icon: "info",
    confirmButtonText: "OK",
  });
};

const viewTreatmentHistory = (treatment: MedicalTreatment) => {
};

const editTreatment = (treatment: MedicalTreatment) => {
};

const completeTreatment = async (treatment: MedicalTreatment) => {
  const result = await Swal.fire({
    title: t('inmates.tabs.medical.swal.completeTreatment'),
    text: t('inmates.tabs.medical.swal.completeTreatmentConfirm', { name: treatment.medication_name }),
    showCancelButton: true,
    confirmButtonText: t('inmates.tabs.medical.treatments.complete'),
    cancelButtonText: t('inmates.tabs.medical.buttons.cancel'),
  });

  if (result.isConfirmed) {
    await loadTreatments();
  }
};

const suspendTreatment = async (treatment: MedicalTreatment) => {
  const { value: reason } = await Swal.fire({
    title: t('inmates.tabs.medical.swal.suspendTreatment'),
    text: t('inmates.tabs.medical.swal.suspendTreatmentConfirm', { name: treatment.medication_name }),
    input: "textarea",
    inputPlaceholder: t('inmates.tabs.medical.swal.suspensionReason'),
    showCancelButton: true,
    confirmButtonText: t('inmates.tabs.medical.treatments.suspend'),
    cancelButtonText: t('inmates.tabs.medical.buttons.cancel'),
  });

  if (reason) {
    await loadTreatments();
  }
};

const discontinueTreatment = async (treatment: MedicalTreatment) => {
  const { value: reason } = await Swal.fire({
    title: t('inmates.tabs.medical.swal.discontinueTreatment'),
    text: t('inmates.tabs.medical.swal.discontinueTreatmentConfirm', { name: treatment.medication_name }),
    input: "textarea",
    inputPlaceholder: t('inmates.tabs.medical.swal.discontinuationReason'),
    showCancelButton: true,
    confirmButtonText: t('inmates.tabs.medical.treatments.discontinue'),
    cancelButtonText: t('inmates.tabs.medical.buttons.cancel'),
    confirmButtonColor: "#d33",
  });

  if (reason) {
    await loadTreatments();
  }
};

// Consultation management
const openScheduleConsultationModal = () => {
  Swal.fire({
    title: t('inmates.tabs.medical.swal.scheduleConsultation'),
    text: t('inmates.tabs.medical.swal.scheduleConsultationDesc'),
    icon: "info",
    confirmButtonText: "OK",
  });
};

const openAddConsultationModal = () => {
  Swal.fire({
    title: t('inmates.tabs.medical.swal.registerConsultation'),
    text: t('inmates.tabs.medical.swal.registerConsultationDesc'),
    icon: "info",
    confirmButtonText: "OK",
  });
};

const viewConsultationDetails = (consultation: MedicalConsultation) => {
};

const editConsultation = (consultation: MedicalConsultation) => {
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
  if (!severity) return severity;
  const severityKey = `inmates.tabs.medical.severity.${severity}`;
  const translated = t(severityKey);
  return translated !== severityKey ? translated : severity;
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
  if (!severity) return severity;
  const severityMap: Record<string, string> = {
    life_threatening: "lifeThreatening",
  };
  const key = severityMap[severity] || severity;
  const severityKey = `inmates.tabs.medical.severity.${key}`;
  const translated = t(severityKey);
  return translated !== severityKey ? translated : severity;
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
  if (!status) return status;
  const statusKey = `inmates.tabs.medical.treatmentStatuses.${status}`;
  const translated = t(statusKey);
  return translated !== statusKey ? translated : status;
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
  if (!status) return status;
  const statusKey = `inmates.tabs.medical.consultationStatuses.${status}`;
  const translated = t(statusKey);
  return translated !== statusKey ? translated : status;
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
  if (!level) return level;
  const levelKey = `inmates.tabs.medical.riskLevels.${level}`;
  const translated = t(levelKey);
  return translated !== levelKey ? translated : level;
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
