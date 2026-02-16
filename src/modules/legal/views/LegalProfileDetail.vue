<template>
  <div class="legal-profile-detail">
    <!-- Loading state -->
    <div v-if="loading" class="d-flex justify-content-center py-10">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ t('common.loading') }}...</span>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="profile">
      <!-- Header with back button -->
      <div class="d-flex align-items-center mb-5">
        <button @click="goBack" class="btn btn-light btn-sm me-3">
          <KTIcon icon-name="arrow-left" icon-class="fs-3" />
          {{ t('common.actions.back') }}
        </button>
        <h1 class="flex-grow-1 fs-3 fw-bold my-0">
          {{ t('legal.profiles.detail.title') }}
        </h1>
      </div>

      <!-- Profile Cards -->
      <div class="row g-5 g-xl-10">
        <!-- Inmate Information Card -->
        <div class="col-xl-4">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">{{ t('legal.profiles.detail.inmateInfo') }}</h3>
              <div class="card-toolbar">
                <span
                  class="badge badge-lg"
                  :class="getProfileStatusBadgeClass(profile.profile_status)"
                >
                  {{ getProfileStatusLabel(profile.profile_status) }}
                </span>
              </div>
            </div>
            <div class="card-body">
              <div class="d-flex flex-center flex-column py-5">
                <div class="symbol symbol-100px symbol-circle mb-7 overflow-hidden">
                  <div class="symbol-label">
                    <img
                      :src="getInmatePhoto(profile.inmate)"
                      :alt="inmateName"
                      class="w-100"
                    />
                  </div>
                </div>
                <h3 class="fs-3 text-gray-800 fw-bold mb-3">{{ inmateName }}</h3>
                <div class="fs-5 fw-semibold text-muted mb-2">
                  {{ profile.inmate?.inmate_number }}
                </div>
                <span v-if="profile.is_reentry" class="badge badge-light-warning">
                  <i class="bi bi-arrow-repeat me-1"></i> Reingreso
                </span>
              </div>

              <div class="d-flex flex-stack fs-6 py-3">
                <div class="fw-bold text-muted">{{ t('legal.profiles.detail.documentNumber') }}</div>
                <div class="text-gray-800">{{ profile.inmate?.document_number || '-' }}</div>
              </div>

              <div class="separator my-2"></div>

              <div class="d-flex flex-stack fs-6 py-3">
                <div class="fw-bold text-muted">{{ t('legal.profiles.detail.admissionNumber') }}</div>
                <div class="text-gray-800">{{ profile.admission_number || '-' }}</div>
              </div>

              <div class="d-flex flex-stack fs-6 py-3">
                <div class="fw-bold text-muted">{{ t('legal.profiles.detail.admissionDate') }}</div>
                <div class="text-gray-800">{{ formatDate(profile.admission_date) }}</div>
              </div>

              <div class="d-flex flex-stack fs-6 py-3" v-if="profile.release_date">
                <div class="fw-bold text-muted">{{ t('legal.profiles.detail.releaseDate') }}</div>
                <div class="text-gray-800">{{ formatDate(profile.release_date) }}</div>
              </div>

              <div class="separator my-2"></div>

              <div class="d-flex flex-stack fs-6 py-3">
                <div class="fw-bold text-muted">{{ t('legal.profiles.detail.caseNumber') }}</div>
                <div class="text-gray-800">{{ profile.case_number || '-' }}</div>
              </div>

              <div class="d-flex flex-stack fs-6 py-3">
                <div class="fw-bold text-muted">{{ t('legal.profiles.detail.fileNumber') }}</div>
                <div class="text-gray-800">{{ profile.judicial_file_number || '-' }}</div>
              </div>

              <div class="d-flex flex-stack fs-6 py-3" v-if="profile.previous_case_number">
                <div class="fw-bold text-muted">{{ t('legal.profiles.detail.previousCaseNumber') }}</div>
                <div class="text-gray-800">{{ profile.previous_case_number }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Legal Status Card -->
        <div class="col-xl-8">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">{{ t('legal.profiles.detail.legalStatus') }}</h3>
              <div class="card-toolbar">
                <button @click="editProfile" class="btn btn-sm btn-light-primary">
                  <KTIcon icon-name="pencil" icon-class="fs-3" />
                  {{ t('common.actions.edit') }}
                </button>
              </div>
            </div>
            <div class="card-body">
              <div class="row mb-7">
                <label class="col-lg-4 fw-semibold text-muted">
                  {{ t('legal.profiles.detail.proceduralStatus') }}
                </label>
                <div class="col-lg-8">
                  <span 
                    class="badge badge-lg"
                    :class="getStatusBadgeClass(profile.procedural_status?.code)"
                  >
                    {{ profile.procedural_status?.name || '-' }}
                  </span>
                </div>
              </div>

              <div class="row mb-7">
                <label class="col-lg-4 fw-semibold text-muted">
                  {{ t('legal.profiles.detail.proceduralStage') }}
                </label>
                <div class="col-lg-8">
                  <span 
                    class="badge badge-lg"
                    :class="getProceduralStageBadgeClass(profile.procedural_stage)"
                  >
                    {{ getProceduralStageLabel(profile.procedural_stage) }}
                  </span>
                </div>
              </div>

              <div class="row mb-7">
                <label class="col-lg-4 fw-semibold text-muted">
                  {{ t('legal.profiles.detail.court') }}
                </label>
                <div class="col-lg-8">
                  <div class="d-flex align-items-center">
                    <span class="svg-icon svg-icon-2 svg-icon-primary me-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 14H18V10H20C20.6 10 21 10.4 21 11V13C21 13.6 20.6 14 20 14ZM21 19V17C21 16.4 20.6 16 20 16H18V20H20C20.6 20 21 19.6 21 19ZM21 7V5C21 4.4 20.6 4 20 4H18V8H20C20.6 8 21 7.6 21 7Z" fill="currentColor"/>
                        <path opacity="0.3" d="M17 22H3C2.4 22 2 21.6 2 21V3C2 2.4 2.4 2 3 2H17C17.6 2 18 2.4 18 3V21C18 21.6 17.6 22 17 22ZM10 7C8.9 7 8 7.9 8 9C8 10.1 8.9 11 10 11C11.1 11 12 10.1 12 9C12 7.9 11.1 7 10 7ZM13.3 16C14 16 14.5 15.3 14.3 14.7C13.7 13.2 12 12 10.1 12C8.10001 12 6.49999 13.1 5.89999 14.7C5.59999 15.3 6.19999 16 7.39999 16H13.3Z" fill="currentColor"/>
                      </svg>
                    </span>
                    <span class="fw-bold fs-6 text-gray-800">{{ profile.court?.name || '-' }}</span>
                  </div>
                </div>
              </div>

              <div class="row mb-7">
                <label class="col-lg-4 fw-semibold text-muted">
                  {{ t('legal.profiles.detail.prosecutor') }}
                </label>
                <div class="col-lg-8">
                  <div class="d-flex align-items-start">
                    <span class="svg-icon svg-icon-2 svg-icon-danger me-2 mt-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.0173 9H15.3945C14.2833 9 13.263 9.61425 12.7431 10.5963L12.154 11.7091C12.0645 11.8781 12.1072 12.0868 12.2559 12.2071L12.6402 12.5183C13.2631 13.0225 13.7556 13.6691 14.0764 14.4035L14.2321 14.7601C14.2957 14.9058 14.4396 15 14.5987 15H18.6747C19.7297 15 20.4057 13.8774 19.912 12.945L18.6686 10.5963C18.1487 9.61425 17.1285 9 16.0173 9Z" fill="currentColor"/>
                        <rect opacity="0.3" x="14" y="4" width="4" height="4" rx="2" fill="currentColor"/>
                        <path d="M4.65486 14.8559C5.40389 13.1224 7.11161 12 9 12C10.8884 12 12.5961 13.1224 13.3451 14.8559L14.793 18.2067C15.3636 19.5271 14.3955 21 12.9571 21H5.04292C3.60453 21 2.63644 19.5271 3.20698 18.2067L4.65486 14.8559Z" fill="currentColor"/>
                        <rect opacity="0.3" x="6" y="5" width="6" height="6" rx="3" fill="currentColor"/>
                      </svg>
                    </span>
                    <div>
                      <div class="fw-bold fs-6 text-gray-800">{{ profile.prosecutor_name || '-' }}</div>
                      <div class="text-muted fs-7">{{ profile.prosecutor_office || '-' }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row mb-7">
                <label class="col-lg-4 fw-semibold text-muted">
                  {{ t('legal.profiles.detail.defenseAttorney') }}
                </label>
                <div class="col-lg-8">
                  <div class="d-flex align-items-start">
                    <span class="svg-icon svg-icon-2 svg-icon-success me-2 mt-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.0173 9H15.3945C14.2833 9 13.263 9.61425 12.7431 10.5963L12.154 11.7091C12.0645 11.8781 12.1072 12.0868 12.2559 12.2071L12.6402 12.5183C13.2631 13.0225 13.7556 13.6691 14.0764 14.4035L14.2321 14.7601C14.2957 14.9058 14.4396 15 14.5987 15H18.6747C19.7297 15 20.4057 13.8774 19.912 12.945L18.6686 10.5963C18.1487 9.61425 17.1285 9 16.0173 9Z" fill="currentColor"/>
                        <rect opacity="0.3" x="14" y="4" width="4" height="4" rx="2" fill="currentColor"/>
                        <path d="M4.65486 14.8559C5.40389 13.1224 7.11161 12 9 12C10.8884 12 12.5961 13.1224 13.3451 14.8559L14.793 18.2067C15.3636 19.5271 14.3955 21 12.9571 21H5.04292C3.60453 21 2.63644 19.5271 3.20698 18.2067L4.65486 14.8559Z" fill="currentColor"/>
                        <rect opacity="0.3" x="6" y="5" width="6" height="6" rx="3" fill="currentColor"/>
                      </svg>
                    </span>
                    <div>
                      <div class="fw-bold fs-6 text-gray-800">{{ profile.defense_attorney_name || '-' }}</div>
                      <span 
                        class="badge me-2"
                        :class="profile.defense_type === 'public' ? 'badge-light-info' : 'badge-light-primary'"
                      >
                        {{ profile.defense_type === 'public' ? 'Defensa Pública' : profile.defense_type === 'private' ? 'Defensa Privada' : 'Sin Defensa' }}
                      </span>
                      <div class="text-muted fs-7 mt-1">
                        <i class="bi bi-telephone fs-6 me-1"></i>
                        {{ profile.defense_attorney_phone || '-' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sentence Information -->
      <div class="row g-5 g-xl-10 mt-1">
        <div class="col-xl-6">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">{{ t('legal.profiles.detail.sentenceInfo') }}</h3>
            </div>
            <div class="card-body">
              <div v-if="profile.sentence_type_id || profile.sentence_start_date">
                <div class="d-flex align-items-center mb-5">
                  <div class="flex-grow-1">
                    <span class="text-gray-800 fs-5 fw-bold">
                      {{ t('legal.profiles.detail.totalSentence') }}
                    </span>
                    <div class="text-muted fs-7" v-if="profile.sentence_type?.name">
                      {{ profile.sentence_type.name }}
                    </div>
                  </div>
                  <div>
                    <span class="badge badge-lg badge-light-primary">
                      <span class="fs-3 fw-bold">{{ profile.total_sentence || '-' }}</span>
                    </span>
                  </div>
                </div>

                <div class="separator my-4"></div>

                <div class="row mb-5">
                  <div class="col-6">
                    <div class="text-gray-600 fs-7 fw-semibold mb-2">
                      <i class="bi bi-calendar-check fs-6 me-1"></i>
                      {{ t('legal.profiles.detail.startDate') }}
                    </div>
                    <div class="text-gray-800 fw-bold fs-6">
                      {{ formatDate(profile.sentence_start_date) }}
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="text-gray-600 fs-7 fw-semibold mb-2">
                      <i class="bi bi-calendar-x fs-6 me-1"></i>
                      {{ t('legal.profiles.detail.endDate') }}
                    </div>
                    <div class="text-gray-800 fw-bold fs-6">
                      {{ formatDate(profile.sentence_end_date) }}
                    </div>
                  </div>
                </div>

                <div class="row mb-5" v-if="profile.sentence_details">
                  <div class="col-12">
                    <div class="text-gray-600 fs-7 fw-semibold mb-2">
                      <i class="bi bi-file-text fs-6 me-1"></i>
                      {{ t('legal.profiles.detail.sentenceDetails') }}
                    </div>
                    <div class="text-gray-800 bg-light rounded p-3">
                      {{ profile.sentence_details }}
                    </div>
                  </div>
                </div>

                <div class="row mb-5">
                  <div class="col-6">
                    <div class="text-gray-600 fs-7 fw-semibold mb-2">
                      <i class="bi bi-gift fs-6 me-1"></i>
                      {{ t('legal.profiles.detail.eligibleForBenefits') }}
                    </div>
                    <span
                      class="badge badge-lg"
                      :class="profile.eligible_for_benefits ? 'badge-light-success' : 'badge-light-danger'"
                    >
                      <i class="bi" :class="profile.eligible_for_benefits ? 'bi-check-circle' : 'bi-x-circle'" ></i>
                      {{ profile.eligible_for_benefits ? 'Sí' : 'No' }}
                    </span>
                  </div>
                  <div class="col-6">
                    <div class="text-gray-600 fs-7 fw-semibold mb-2">
                      <i class="bi bi-shield-check fs-6 me-1"></i>
                      {{ t('legal.profiles.detail.sentenceFinal') }}
                    </div>
                    <span
                      class="badge badge-lg"
                      :class="profile.sentence_final ? 'badge-light-success' : 'badge-light-warning'"
                    >
                      <i class="bi" :class="profile.sentence_final ? 'bi-check-circle' : 'bi-clock'" ></i>
                      {{ profile.sentence_final ? 'Firme' : 'En proceso' }}
                    </span>
                  </div>
                </div>

                <!-- Fechas de elegibilidad -->
                <div class="separator my-4" v-if="profile.parole_eligibility_date || profile.conditional_release_eligibility"></div>
                <div class="row" v-if="profile.parole_eligibility_date || profile.conditional_release_eligibility">
                  <div class="col-6" v-if="profile.parole_eligibility_date">
                    <div class="text-gray-600 fs-7 fw-semibold mb-2">
                      <i class="bi bi-door-open fs-6 me-1"></i>
                      {{ t('legal.profiles.detail.paroleEligibilityDate') }}
                    </div>
                    <div class="text-gray-800 fw-bold fs-6">
                      {{ formatDate(profile.parole_eligibility_date) }}
                    </div>
                  </div>
                  <div class="col-6" v-if="profile.conditional_release_eligibility">
                    <div class="text-gray-600 fs-7 fw-semibold mb-2">
                      <i class="bi bi-unlock fs-6 me-1"></i>
                      {{ t('legal.profiles.detail.conditionalReleaseDate') }}
                    </div>
                    <div class="text-gray-800 fw-bold fs-6">
                      {{ formatDate(profile.conditional_release_eligibility) }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-10">
                <span class="text-muted">{{ t('legal.profiles.detail.noSentence') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Preventive Detention -->
        <div class="col-xl-6">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">{{ t('legal.profiles.detail.preventiveDetention') }}</h3>
            </div>
            <div class="card-body">
              <div v-if="profile.in_preventive_detention">
                <div class="d-flex align-items-center mb-5">
                  <div class="flex-grow-1">
                    <span class="text-gray-800 fs-5 fw-bold">
                      {{ t('legal.profiles.detail.status') }}
                    </span>
                  </div>
                  <span class="badge badge-lg badge-light-warning">
                    <i class="bi bi-exclamation-triangle me-1"></i>
                    {{ t('legal.profiles.detail.inPreventiveDetention') }}
                  </span>
                </div>

                <div class="separator my-4"></div>

                <div class="row mb-5">
                  <div class="col-6">
                    <div class="text-gray-600 fs-7 fw-semibold mb-2">
                      <i class="bi bi-calendar-event fs-6 me-1"></i>
                      {{ t('legal.profiles.detail.startDate') }}
                    </div>
                    <div class="text-gray-800 fw-bold fs-6">
                      {{ formatDate(profile.preventive_detention_start) }}
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="text-gray-600 fs-7 fw-semibold mb-2">
                      <i class="bi bi-calendar-range fs-6 me-1"></i>
                      {{ t('legal.profiles.detail.maxEndDate') }}
                    </div>
                    <div class="text-gray-800 fw-bold fs-6">
                      {{ formatDate(profile.preventive_detention_max_end) }}
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-6">
                    <div class="text-gray-600 fs-7 fw-semibold mb-2">
                      <i class="bi bi-hourglass-split fs-6 me-1"></i>
                      {{ t('legal.profiles.detail.daysElapsed') }}
                    </div>
                    <span class="badge badge-lg badge-light-info">
                      <span class="fs-6 fw-bold">{{ profile.preventive_detention_days_elapsed || 0 }}</span> días
                    </span>
                  </div>
                  <div class="col-6">
                    <div class="text-gray-600 fs-7 fw-semibold mb-2">
                      <i class="bi bi-clock-history fs-6 me-1"></i>
                      {{ t('legal.profiles.detail.daysRemaining') }}
                    </div>
                    <span class="badge badge-lg badge-light-primary">
                      Sin límite de tiempo
                    </span>
                  </div>
                </div>

                <div v-if="false" class="alert alert-danger d-flex align-items-center mt-5">
                  <div class="d-flex flex-column">
                    <span><!-- Preventive detention has no time limit --></span>
                  </div>
                </div>

                <!-- Razón de extensión -->
                <div v-if="profile.preventive_detention_extension_reason" class="mt-5">
                  <div class="text-gray-600 fs-7 fw-semibold mb-2">
                    <i class="bi bi-journal-text fs-6 me-1"></i>
                    {{ t('legal.profiles.detail.extensionReason') }}
                  </div>
                  <div class="text-gray-800 bg-light rounded p-3">
                    {{ profile.preventive_detention_extension_reason }}
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-10">
                <span class="text-muted">{{ t('legal.profiles.detail.notInPreventiveDetention') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Crimes List -->
      <div class="row g-5 g-xl-10 mt-1">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">{{ t('legal.profiles.detail.crimes') }}</h3>
            </div>
            <div class="card-body">
              <div v-if="profile.crimes && profile.crimes.length > 0" class="table-responsive">
                <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                  <thead>
                    <tr class="fw-bold text-muted">
                      <th class="min-w-150px">{{ t('legal.profiles.detail.crimeName') }}</th>
                      <th class="min-w-100px">{{ t('legal.profiles.detail.crimeDate') }}</th>
                      <th class="min-w-100px">{{ t('legal.profiles.detail.isMainCrime') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="crime in profile.crimes" :key="crime.id">
                      <td class="text-gray-900 fw-bold">{{ crime.name }}</td>
                      <td>{{ formatDate(crime.crime_date) }}</td>
                      <td>
                        <span 
                          class="badge"
                          :class="crime.is_main ? 'badge-light-primary' : 'badge-light-secondary'"
                        >
                          {{ crime.is_main ? 'Principal' : 'Secundario' }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="text-center py-10">
                <span class="text-muted">{{ t('legal.profiles.detail.noCrimes') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Hearings and Sentence Reduction -->
      <div class="row g-5 g-xl-10 mt-1">
        <!-- Hearings Card -->
        <div class="col-xl-6">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">{{ t('legal.profiles.detail.hearings') }}</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-6">
                  <div class="text-gray-600 fs-7 fw-semibold mb-2">
                    <i class="bi bi-calendar-event fs-6 me-1"></i>
                    {{ t('legal.profiles.detail.lastHearingDate') }}
                  </div>
                  <div class="text-gray-800 fw-bold fs-6">
                    {{ formatDate(profile.last_hearing_date) }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-gray-600 fs-7 fw-semibold mb-2">
                    <i class="bi bi-calendar-plus fs-6 me-1"></i>
                    {{ t('legal.profiles.detail.nextHearingDate') }}
                  </div>
                  <div class="fw-bold fs-6" :class="isUpcomingHearing ? 'text-warning' : 'text-gray-800'">
                    {{ formatDate(profile.next_hearing_date) }}
                    <i v-if="isUpcomingHearing" class="bi bi-exclamation-triangle ms-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sentence Reduction Card -->
        <div class="col-xl-6">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">{{ t('legal.profiles.detail.sentenceReduction') }}</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-4 text-center">
                  <div class="border border-gray-300 border-dashed rounded py-3 px-4">
                    <div class="fs-2 fw-bold text-success">{{ profile.good_conduct_days || 0 }}</div>
                    <div class="fw-semibold text-muted fs-7">{{ t('legal.profiles.detail.goodConductDays') }}</div>
                  </div>
                </div>
                <div class="col-4 text-center">
                  <div class="border border-gray-300 border-dashed rounded py-3 px-4">
                    <div class="fs-2 fw-bold text-primary">{{ profile.work_days || 0 }}</div>
                    <div class="fw-semibold text-muted fs-7">{{ t('legal.profiles.detail.workDays') }}</div>
                  </div>
                </div>
                <div class="col-4 text-center">
                  <div class="border border-gray-300 border-dashed rounded py-3 px-4">
                    <div class="fs-2 fw-bold text-info">{{ profile.study_days || 0 }}</div>
                    <div class="fw-semibold text-muted fs-7">{{ t('legal.profiles.detail.studyDays') }}</div>
                  </div>
                </div>
              </div>
              <div class="separator my-5"></div>
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-gray-600 fw-semibold">{{ t('legal.profiles.detail.totalReductionDays') }}</span>
                <span class="badge badge-lg badge-light-success">
                  <span class="fs-4 fw-bold">{{ totalReductionDays }}</span> {{ t('legal.profiles.detail.days') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Legal Notes -->
      <div class="row g-5 g-xl-10 mt-1">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">{{ t('legal.profiles.detail.legalNotes') }}</h3>
            </div>
            <div class="card-body">
              <div v-if="profile.legal_notes" class="text-gray-800 white-space-pre-wrap">
                {{ profile.legal_notes }}
              </div>
              <div v-else class="text-center py-5">
                <span class="text-muted">{{ t('legal.profiles.detail.noNotes') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else class="text-center py-10">
      <span class="text-muted">{{ t('legal.profiles.detail.notFound') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getAssetPath } from '@/core/helpers/assets';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

// State
const loading = ref(false);
const profile = ref<any>(null);

// Computed
const inmateName = computed(() => {
  if (!profile.value?.inmate) return 'Sin nombre';
  return profile.value.inmate.full_name ||
         profile.value.inmate.name ||
         `${profile.value.inmate.first_name} ${profile.value.inmate.last_name}`.trim() ||
         'Sin nombre';
});

const totalReductionDays = computed(() => {
  if (!profile.value) return 0;
  return (profile.value.good_conduct_days || 0) +
         (profile.value.work_days || 0) +
         (profile.value.study_days || 0);
});

const isUpcomingHearing = computed(() => {
  if (!profile.value?.next_hearing_date) return false;
  const nextHearing = new Date(profile.value.next_hearing_date);
  const today = new Date();
  const diffDays = Math.ceil((nextHearing.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 7;
});

// Methods
const getInmatePhoto = (inmate: any): string => {
  if (!inmate) return getAssetPath('media/avatars/blank.png');

  if (inmate.photo_url) {
    return inmate.photo_url;
  }

  if (inmate.photo_path) {
    return inmate.photo_path;
  }

  if (inmate.photos && inmate.photos.length > 0) {
    const currentPhoto = inmate.photos.find((photo: any) => photo.is_current);
    const photoToUse = currentPhoto || inmate.photos[0];
    return photoToUse.photo_data || photoToUse.photo_url || photoToUse.photo_path || getAssetPath('media/avatars/blank.png');
  }

  return getAssetPath('media/avatars/blank.png');
};

const getProfileStatusBadgeClass = (status: string) => {
  const badgeClasses: Record<string, string> = {
    'active': 'badge-light-success',
    'completed': 'badge-light-primary',
    'transferred': 'badge-light-warning',
    'deceased': 'badge-light-danger',
  };
  return badgeClasses[status] || 'badge-light-secondary';
};

const getProfileStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'active': 'Activo',
    'completed': 'Completado',
    'transferred': 'Trasladado',
    'deceased': 'Fallecido',
  };
  return labels[status] || status || '-';
};

// API Methods
const loadProfile = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get(`/inmate-legal-profiles/${route.params.id}`);
    profile.value = response.data.data || response.data;
  } catch (error) {
    console.error('Error loading legal profile:', error);
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: t('legal.profiles.detail.loadError'),
    });
  } finally {
    loading.value = false;
  }
};

const formatDate = (date: string) => {
  if (!date) return '-';
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    return dateObj.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    return '-';
  }
};

const getStatusBadgeClass = (statusCode: string) => {
  const badgeClasses: Record<string, string> = {
    'PENDING': 'badge-light-warning',
    'PREVENTIVE': 'badge-light-info',
    'SENTENCED': 'badge-light-primary',
    'RELEASED': 'badge-light-success',
    'TRANSFERRED': 'badge-light-secondary',
  };
  
  return badgeClasses[statusCode] || 'badge-light-secondary';
};

const getProceduralStageLabel = (stage: string) => {
  if (!stage) return '-';

  const stageMap: Record<string, string> = {
    'investigation': t('legal.profiles.proceduralStages.investigation'),
    'intermediate_phase': t('legal.profiles.proceduralStages.intermediate'),
    'trial': t('legal.profiles.proceduralStages.trial'),
    'oral_trial': t('legal.profiles.proceduralStages.oralTrial'),
    'sentence_execution': t('legal.profiles.proceduralStages.sentenceExecution'),
    'appeal_process': t('legal.profiles.proceduralStages.appeal'),
    'cassation': t('legal.profiles.proceduralStages.cassation'),
    'amparo_process': t('legal.profiles.proceduralStages.amparo'),
    'constitutional_appeal': t('legal.profiles.proceduralStages.constitutionalAppeal'),
    'review_process': t('legal.profiles.proceduralStages.reviewProcess'),
  };

  return stageMap[stage] || stage;
};

const getProceduralStageBadgeClass = (stage: string) => {
  const badgeClasses: Record<string, string> = {
    'investigation': 'badge-light-warning',
    'intermediate_phase': 'badge-light-info',
    'trial': 'badge-light-primary',
    'oral_trial': 'badge-light-primary',
    'sentence_execution': 'badge-light-success',
    'appeal_process': 'badge-light-danger',
    'cassation': 'badge-light-dark',
    'amparo_process': 'badge-light-secondary',
    'constitutional_appeal': 'badge-light-secondary',
    'review_process': 'badge-light-info',
  };

  return badgeClasses[stage] || 'badge-light-secondary';
};

const goBack = () => {
  router.push({ name: 'legal-profiles' });
};

const editProfile = () => {
  router.push({ name: 'legal-profile-edit', params: { id: route.params.id } });
};

// Lifecycle
onMounted(() => {
  loadProfile();
});
</script>