<template>
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <h3 class="fw-bold m-0">
          {{ $t('inmates.edit.title') }}
          <span v-if="currentInmate" class="text-muted fs-6 fw-normal ms-2">
            #{{ currentInmate.inmate_number }}
          </span>
        </h3>
      </div>
      <div class="card-toolbar">
        <router-link to="/inmates" class="btn btn-light-secondary me-3">
          <i class="ki-duotone ki-arrow-left fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          {{ $t('inmates.edit.cancel') }}
        </router-link>
        <button
          type="submit"
          form="inmate-edit-form"
          class="btn btn-primary"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          {{ loading ? $t('inmates.edit.saving') : $t('inmates.edit.saveChanges') }}
        </button>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body pt-0">
      <!-- Loading State -->
      <div v-if="loadingInmate" class="text-center py-10">
        <div
          class="spinner-border spinner-border-lg text-primary"
          role="status"
        >
          <span class="visually-hidden">{{ $t('inmates.edit.loading') }}</span>
        </div>
        <div class="text-gray-600 fs-6 fw-semibold mt-5">
          {{ $t('inmates.edit.loadingInfo') }}
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger">
        <div class="d-flex">
          <i class="ki-duotone ki-information fs-2tx text-danger me-4">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          <div class="d-flex flex-column">
            <h4 class="mb-1 text-danger">{{ $t('inmates.edit.errorLoading') }}</h4>
            <span>{{ error }}</span>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form
        v-else-if="currentInmate"
        id="inmate-edit-form"
        @submit.prevent="handleSubmit"
        class="form"
      >
        <!--begin::Step 1: Basic Information-->
        <div class="card mb-7">
          <div class="card-header border-0 pt-6">
            <div class="card-title">
              <h4 class="fw-bold text-gray-800">{{ $t('inmates.edit.sections.basicInfo') }}</h4>
            </div>
          </div>
          <div class="card-body pt-0">
            <div class="row g-6">
              <!--begin::Document Information-->
              <div class="col-md-6">
                <label class="form-label required">{{ $t('inmates.edit.fields.documentType') }}</label>
                <select
                  v-model="form.document_type_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.document_type_id }"
                  required
                >
                  <option value="">{{ $t('inmates.edit.fields.selectDocumentType') }}</option>
                  <option
                    v-for="type in documentTypes"
                    :key="type.id"
                    :value="type.id"
                  >
                    {{ type.name }}
                  </option>
                </select>
                <div v-if="errors.document_type_id" class="invalid-feedback">
                  {{ errors.document_type_id[0] }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label required">{{ $t('inmates.edit.fields.identificationNumber') }}</label>
                <input
                  type="text"
                  v-model="form.document_number"
                  class="form-control"
                  :class="{ 'is-invalid': errors.document_number }"
                  :placeholder="$t('inmates.edit.fields.identificationPlaceholder')"
                  required
                />
                <div v-if="errors.document_number" class="invalid-feedback">
                  {{ errors.document_number[0] }}
                </div>
              </div>

              <!--begin::Names-->
              <div class="col-md-4">
                <label class="form-label required">{{ $t('inmates.edit.fields.firstName') }}</label>
                <input
                  type="text"
                  v-model="form.first_name"
                  class="form-control"
                  :class="{ 'is-invalid': errors.first_name }"
                  :placeholder="$t('inmates.edit.fields.firstNamePlaceholder')"
                  required
                />
                <div v-if="errors.first_name" class="invalid-feedback">
                  {{ errors.first_name[0] }}
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label">{{ $t('inmates.edit.fields.middleName') }}</label>
                <input
                  type="text"
                  v-model="form.middle_name"
                  class="form-control"
                  :placeholder="$t('inmates.edit.fields.middleNamePlaceholder')"
                />
              </div>

              <div class="col-md-4">
                <label class="form-label">{{ $t('inmates.edit.fields.thirdName') }}</label>
                <input
                  type="text"
                  v-model="form.third_name"
                  class="form-control"
                  :placeholder="$t('inmates.edit.fields.thirdNamePlaceholder')"
                />
              </div>

              <!--begin::Surnames-->
              <div class="col-md-4">
                <label class="form-label required">{{ $t('inmates.edit.fields.lastName') }}</label>
                <input
                  type="text"
                  v-model="form.last_name"
                  class="form-control"
                  :class="{ 'is-invalid': errors.last_name }"
                  :placeholder="$t('inmates.edit.fields.lastNamePlaceholder')"
                  required
                />
                <div v-if="errors.last_name" class="invalid-feedback">
                  {{ errors.last_name[0] }}
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label">{{ $t('inmates.edit.fields.secondLastName') }}</label>
                <input
                  type="text"
                  v-model="form.second_last_name"
                  class="form-control"
                  :placeholder="$t('inmates.edit.fields.secondLastNamePlaceholder')"
                />
              </div>

              <div class="col-md-4">
                <label class="form-label">{{ $t('inmates.edit.fields.marriedSurname') }}</label>
                <input
                  type="text"
                  v-model="form.married_surname"
                  class="form-control"
                  :placeholder="$t('inmates.edit.fields.marriedSurnamePlaceholder')"
                />
              </div>
              <!--end::Surnames-->

              <div class="col-md-12">
                <label class="form-label">{{ $t('inmates.edit.fields.alias') }}</label>
                <input
                  type="text"
                  v-model="form.alias"
                  class="form-control"
                  :placeholder="$t('inmates.edit.fields.aliasPlaceholder')"
                />
              </div>

              <!--begin::Personal Information-->
              <div class="col-md-4">
                <label class="form-label required">{{ $t('inmates.edit.fields.birthDate') }}</label>
                <input
                  type="date"
                  v-model="form.birth_date"
                  class="form-control"
                  :class="{ 'is-invalid': errors.birth_date }"
                  required
                />
                <div v-if="errors.birth_date" class="invalid-feedback">
                  {{ errors.birth_date[0] }}
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label required">{{ $t('inmates.edit.fields.gender') }}</label>
                <select
                  v-model="form.gender"
                  class="form-select"
                  :class="{ 'is-invalid': errors.gender }"
                  required
                >
                  <option value="">{{ $t('inmates.edit.fields.selectGender') }}</option>
                  <option value="M">{{ $t('inmates.edit.fields.male') }}</option>
                  <option value="F">{{ $t('inmates.edit.fields.female') }}</option>
                </select>
                <div v-if="errors.gender" class="invalid-feedback">
                  {{ errors.gender[0] }}
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label">{{ $t('inmates.edit.fields.bloodType') }}</label>
                <select v-model="form.blood_type_id" class="form-select">
                  <option value="">{{ $t('inmates.edit.fields.selectBloodType') }}</option>
                  <option
                    v-for="type in bloodTypes"
                    :key="type.id"
                    :value="type.id"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>
              <!--end::Personal Information-->

              <!--begin::LGBTIQ+ Information (Optional)-->
              <div class="col-md-12">
                <div class="separator separator-dashed my-6"></div>
                <h5 class="fw-bold text-gray-800 mb-4">
                  <i class="ki-duotone ki-heart fs-2 text-primary me-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  {{ $t('inmates.edit.sections.lgbtiq') }}
                </h5>
                <div
                  class="alert alert-info d-flex align-items-center p-5 mb-6"
                >
                  <i class="ki-duotone ki-shield-tick fs-2hx text-info me-4">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  <div class="d-flex flex-column">
                    <h5 class="mb-1">{{ $t('inmates.edit.sections.lgbtiqConfidential') }}</h5>
                    <span>{{ $t('inmates.edit.sections.lgbtiqConfidentialDesc') }}</span>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">{{ $t('inmates.edit.fields.sexualOrientation') }}</label>
                <select
                  v-model="form.sexual_orientation_id"
                  class="form-select"
                >
                  <option value="">{{ $t('inmates.edit.fields.notSpecified') }}</option>
                  <option
                    v-for="orientation in sexualOrientations"
                    :key="orientation?.id"
                    :value="orientation?.id"
                  >
                    {{ orientation?.name || orientation }}
                  </option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label">{{ $t('inmates.edit.fields.genderIdentity') }}</label>
                <select v-model="form.gender_identity_id" class="form-select">
                  <option value="">{{ $t('inmates.edit.fields.notSpecified') }}</option>
                  <option
                    v-for="identity in genderIdentities"
                    :key="identity?.id"
                    :value="identity?.id"
                  >
                    {{ identity?.name || identity }}
                  </option>
                </select>
              </div>

              <div class="col-md-12">
                <div
                  class="form-check form-switch form-check-custom form-check-solid"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="form.requires_lgbtiq_accommodations"
                  />
                  <label class="form-check-label">
                    {{ $t('inmates.edit.fields.requiresLgbtiqAccommodations') }}
                  </label>
                </div>
              </div>

              <div v-if="form.requires_lgbtiq_accommodations" class="col-md-12">
                <label class="form-label">{{ $t('inmates.edit.fields.lgbtiqAccommodationNotes') }}</label>
                <textarea
                  v-model="form.lgbtiq_accommodation_notes"
                  class="form-control"
                  rows="3"
                  :placeholder="$t('inmates.edit.fields.lgbtiqAccommodationPlaceholder')"
                ></textarea>
              </div>
              <!--end::LGBTIQ+ Information-->

              <!--begin::Birth Location-->
              <div class="col-md-4">
                <label class="form-label required">{{ $t('inmates.edit.fields.birthCountry') }}</label>
                <select
                  v-model="form.birth_country_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.birth_country_id }"
                  @change="onBirthCountryChange"
                  required
                >
                  <option value="">{{ $t('inmates.edit.fields.selectCountry') }}</option>
                  <option
                    v-for="country in countries"
                    :key="country.id"
                    :value="country.id"
                  >
                    {{ country.name }}
                  </option>
                </select>
                <div v-if="errors.birth_country_id" class="invalid-feedback">
                  {{ errors.birth_country_id[0] }}
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label required">{{ $t('inmates.edit.fields.birthDepartment') }}</label>
                <select
                  v-model="form.birth_department_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.birth_department_id }"
                  @change="onBirthDepartmentChange"
                  :disabled="!form.birth_country_id"
                  required
                >
                  <option value="">{{ $t('inmates.edit.fields.selectDepartment') }}</option>
                  <option
                    v-for="department in birthDepartments"
                    :key="department?.id || Math.random()"
                    :value="department?.id"
                  >
                    {{ department?.name || $t('inmates.edit.fields.noName') }}
                  </option>
                </select>
                <div v-if="errors.birth_department_id" class="invalid-feedback">
                  {{ errors.birth_department_id[0] }}
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label">{{ $t('inmates.edit.fields.birthMunicipality') }}</label>
                <select
                  v-model="form.birth_municipality_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.birth_municipality_id }"
                  :disabled="!form.birth_department_id"
                >
                  <option value="">{{ $t('inmates.edit.fields.selectMunicipality') }}</option>
                  <option
                    v-for="municipality in birthMunicipalities"
                    :key="municipality?.id || Math.random()"
                    :value="municipality?.id"
                  >
                    {{ municipality?.name || $t('inmates.edit.fields.noName') }}
                  </option>
                </select>
                <div v-if="errors.birth_municipality_id" class="invalid-feedback">
                  {{ errors.birth_municipality_id[0] }}
                </div>
              </div>
              <!--end::Birth Location-->

            </div>
          </div>
        </div>

        <!--begin::Step 2: Geographic and Cultural Information-->
        <div class="card mb-7">
          <div class="card-header border-0 pt-6">
            <div class="card-title">
              <h4 class="fw-bold text-gray-800">{{ $t('inmates.edit.sections.residenceCulture') }}</h4>
            </div>
          </div>
          <div class="card-body pt-0">
            <div class="row g-6">
              <div class="col-md-4">
                <label class="form-label required">{{ $t('inmates.edit.fields.residenceCountry') }}</label>
                <select
                  v-model="form.country_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.country_id }"
                  required
                  @change="onCountryChange"
                >
                  <option value="">{{ $t('inmates.edit.fields.selectCountry') }}</option>
                  <option
                    v-for="country in countries"
                    :key="country.id"
                    :value="country.id"
                  >
                    {{ country.name }}
                  </option>
                </select>
                <div v-if="errors.country_id" class="invalid-feedback">
                  {{ errors.country_id[0] }}
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label required">{{ $t('inmates.edit.fields.department') }}</label>
                <select
                  v-model="form.department_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.department_id }"
                  :disabled="!form.country_id"
                  required
                  @change="onDepartmentChange"
                >
                  <option value="">{{ $t('inmates.edit.fields.selectDepartment') }}</option>
                  <option
                    v-for="department in departments"
                    :key="department?.id || Math.random()"
                    :value="department?.id"
                  >
                    {{ department?.name || $t('inmates.edit.fields.noName') }}
                  </option>
                </select>
                <div v-if="errors.department_id" class="invalid-feedback">
                  {{ errors.department_id[0] }}
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label">{{ $t('inmates.edit.fields.municipality') }}</label>
                <select
                  v-model="form.municipality_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.municipality_id }"
                  :disabled="!form.department_id"
                >
                  <option value="">{{ $t('inmates.edit.fields.selectMunicipality') }}</option>
                  <option
                    v-for="municipality in municipalities"
                    :key="municipality?.id || Math.random()"
                    :value="municipality?.id"
                  >
                    {{ municipality?.name || $t('inmates.edit.fields.noName') }}
                  </option>
                </select>
                <div v-if="errors.municipality_id" class="invalid-feedback">
                  {{ errors.municipality_id[0] }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">{{ $t('inmates.edit.fields.address') }}</label>
                <input
                  type="text"
                  v-model="form.address"
                  class="form-control"
                  :placeholder="$t('inmates.edit.fields.addressPlaceholder')"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">{{ $t('inmates.edit.fields.phone') }}</label>
                <input
                  type="tel"
                  v-model="form.phone"
                  class="form-control"
                  :placeholder="$t('inmates.edit.fields.phonePlaceholder')"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">{{ $t('inmates.edit.fields.email') }}</label>
                <input
                  type="email"
                  v-model="form.email"
                  class="form-control"
                  :placeholder="$t('inmates.edit.fields.emailPlaceholder')"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">{{ $t('inmates.edit.fields.culturalPractices') }}</label>
                <select v-model="form.cultural_practices" class="form-select">
                  <option value="">{{ $t('inmates.edit.fields.selectCulturalPractices') }}</option>
                  <option value="maya_traditional">{{ $t('inmates.edit.culturalPractices.maya_traditional') }}</option>
                  <option value="xinca_traditional">{{ $t('inmates.edit.culturalPractices.xinca_traditional') }}</option>
                  <option value="garifuna_traditional">{{ $t('inmates.edit.culturalPractices.garifuna_traditional') }}</option>
                  <option value="catholic">{{ $t('inmates.edit.culturalPractices.catholic') }}</option>
                  <option value="evangelical">{{ $t('inmates.edit.culturalPractices.evangelical') }}</option>
                  <option value="other_religious">{{ $t('inmates.edit.culturalPractices.other_religious') }}</option>
                  <option value="none">{{ $t('inmates.edit.culturalPractices.none') }}</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label required">{{ $t('inmates.edit.fields.primaryLanguage') }}</label>
                <select
                  v-model="form.primary_language_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.primary_language_id }"
                  required
                >
                  <option value="">{{ $t('inmates.edit.fields.selectLanguage') }}</option>
                  <option
                    v-for="language in languages"
                    :key="language?.id"
                    :value="language?.id"
                  >
                    {{ language?.name || language }}
                  </option>
                </select>
                <div v-if="errors.primary_language_id" class="invalid-feedback">
                  {{ errors.primary_language_id[0] }}
                </div>
              </div>

              <div class="col-md-6">
                <div
                  class="form-check form-switch form-check-custom form-check-solid"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="form.requires_interpreter"
                  />
                  <label class="form-check-label">{{ $t('inmates.edit.fields.requiresInterpreter') }}</label>
                </div>
              </div>

              <div v-if="form.requires_interpreter" class="col-md-12">
                <label class="form-label">{{ $t('inmates.edit.fields.specialCulturalNeeds') }}</label>
                <textarea
                  v-model="form.special_cultural_needs"
                  class="form-control"
                  rows="3"
                  :placeholder="$t('inmates.edit.fields.specialCulturalNeedsPlaceholder')"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!--begin::Step 3: Additional Information-->
        <div class="card mb-7">
          <div class="card-header border-0 pt-6">
            <div class="card-title">
              <h4 class="fw-bold text-gray-800">{{ $t('inmates.edit.sections.additional') }}</h4>
            </div>
          </div>
          <div class="card-body pt-0">
            <div class="row g-6">
              <div class="col-md-4">
                <label class="form-label required">{{ $t('inmates.edit.fields.nationality') }}</label>
                <select
                  v-model="form.nationality_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.nationality_id }"
                  required
                >
                  <option value="">{{ $t('inmates.edit.fields.selectNationality') }}</option>
                  <option
                    v-for="nationality in nationalities"
                    :key="nationality.id"
                    :value="nationality.id"
                  >
                    {{ nationality.name }}
                  </option>
                </select>
                <div v-if="errors.nationality_id" class="invalid-feedback">
                  {{ errors.nationality_id[0] }}
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label">{{ $t('inmates.edit.fields.ethnicGroup') }}</label>
                <select v-model="form.ethnic_group_id" class="form-select">
                  <option value="">{{ $t('inmates.edit.fields.selectEthnicGroup') }}</option>
                  <option
                    v-for="group in ethnicGroups"
                    :key="group.id"
                    :value="group.id"
                  >
                    {{ group.name }}
                  </option>
                </select>
              </div>

              <div class="col-md-4">
                <label class="form-label">{{ $t('inmates.edit.fields.civilStatus') }}</label>
                <select v-model="form.civil_status_id" class="form-select">
                  <option value="">{{ $t('inmates.edit.fields.selectCivilStatus') }}</option>
                  <option
                    v-for="status in civilStatuses"
                    :key="status.id"
                    :value="status.id"
                  >
                    {{ status.name }}
                  </option>
                </select>
              </div>

              <div class="col-md-4">
                <label class="form-label">{{ $t('inmates.edit.fields.academicDegree') }}</label>
                <select v-model="form.academic_degree_id" class="form-select">
                  <option value="">{{ $t('inmates.edit.fields.selectAcademicDegree') }}</option>
                  <option
                    v-for="degree in academicDegrees"
                    :key="degree.id"
                    :value="degree.id"
                  >
                    {{ degree.name }}
                  </option>
                </select>
              </div>

              <div class="col-md-4">
                <label class="form-label">{{ $t('inmates.edit.fields.occupation') }}</label>
                <select v-model="form.occupation_id" class="form-select">
                  <option value="">{{ $t('inmates.edit.fields.selectOccupation') }}</option>
                  <option
                    v-for="occupation in occupations"
                    :key="occupation.id"
                    :value="occupation.id"
                  >
                    {{ occupation.name }}
                  </option>
                </select>
              </div>

              <div class="col-md-4">
                <label class="form-label">{{ $t('inmates.edit.fields.religion') }}</label>
                <select v-model="form.religion_id" class="form-select">
                  <option value="">{{ $t('inmates.edit.fields.selectReligion') }}</option>
                  <option
                    v-for="religion in religions"
                    :key="religion.id"
                    :value="religion.id"
                  >
                    {{ religion.name }}
                  </option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label required">{{ $t('inmates.edit.fields.riskClassification') }}</label>
                <select
                  v-model="form.risk_classification_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.risk_classification_id }"
                  required
                >
                  <option value="">{{ $t('inmates.edit.fields.selectClassification') }}</option>
                  <option
                    v-for="classification in riskClassifications"
                    :key="classification.id"
                    :value="classification.id"
                  >
                    {{ classification.name }}
                  </option>
                </select>
                <div v-if="errors.risk_classification_id" class="invalid-feedback">
                  {{ errors.risk_classification_id[0] }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label required">{{ $t('inmates.edit.fields.proceduralStatus') }}</label>
                <select
                  v-model="form.procedural_status_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.procedural_status_id }"
                  required
                >
                  <option value="">{{ $t('inmates.edit.fields.selectProceduralStatus') }}</option>
                  <option
                    v-for="status in proceduralStatuses"
                    :key="status.id"
                    :value="status.id"
                  >
                    {{ status.name }}
                  </option>
                </select>
                <div v-if="errors.procedural_status_id" class="invalid-feedback">
                  {{ errors.procedural_status_id[0] }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">{{ $t('inmates.edit.fields.socioeconomicLevel') }}</label>
                <select v-model="form.socioeconomic_level_id" class="form-select">
                  <option value="">{{ $t('inmates.edit.fields.selectSocioeconomicLevel') }}</option>
                  <option
                    v-for="level in socioeconomicLevels"
                    :key="level?.id"
                    :value="level?.id"
                  >
                    {{ level?.name || level }}
                  </option>
                </select>
              </div>

            <!-- Professional Information -->
            <div class="col-md-12">
              <h5 class="text-muted mt-5 mb-3">{{ $t('inmates.edit.sections.professionalSocial') }}</h5>
            </div>

            <div class="col-md-6">
              <label class="form-label">{{ $t('inmates.edit.fields.occupationDetails') }}</label>
              <input
                type="text"
                v-model="form.occupation_details"
                class="form-control"
                :placeholder="$t('inmates.edit.fields.occupationDetailsPlaceholder')"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">{{ $t('inmates.edit.fields.previousOccupation') }}</label>
              <input
                type="text"
                v-model="form.previous_occupation"
                class="form-control"
                :placeholder="$t('inmates.edit.fields.previousOccupationPlaceholder')"
              />
            </div>

            <div class="col-md-12">
              <label class="form-label">{{ $t('inmates.edit.fields.workExperience') }}</label>
              <textarea
                v-model="form.work_experience"
                class="form-control"
                rows="2"
                :placeholder="$t('inmates.edit.fields.workExperiencePlaceholder')"
              ></textarea>
            </div>

            <div class="col-md-12">
              <label class="form-label">{{ $t('inmates.edit.fields.skillsAndAbilities') }}</label>
              <textarea
                v-model="form.skills_and_abilities"
                class="form-control"
                rows="2"
                :placeholder="$t('inmates.edit.fields.skillsPlaceholder')"
              ></textarea>
            </div>

            <!-- Emergency Contact Information -->
            <div class="col-md-12">
              <h5 class="text-muted mt-5 mb-3">{{ $t('inmates.edit.sections.emergencyContact') }}</h5>
            </div>

            <div class="col-md-4">
              <label class="form-label">{{ $t('inmates.edit.fields.contactName') }}</label>
              <input
                type="text"
                v-model="form.emergency_contact_name"
                class="form-control"
                :placeholder="$t('inmates.edit.fields.contactNamePlaceholder')"
              />
            </div>

            <div class="col-md-4">
              <label class="form-label">{{ $t('inmates.edit.fields.contactPhone') }}</label>
              <input
                type="text"
                v-model="form.emergency_contact_phone"
                class="form-control"
                :placeholder="$t('inmates.edit.fields.contactPhonePlaceholder')"
              />
            </div>

            <div class="col-md-4">
              <label class="form-label">{{ $t('inmates.edit.fields.contactRelationship') }}</label>
              <select
                v-model="form.emergency_contact_relationship_id"
                class="form-select"
              >
                <option value="">{{ $t('inmates.edit.fields.selectRelationship') }}</option>
                <option
                  v-for="relationship in relationshipTypes"
                  :key="relationship.id"
                  :value="relationship.id"
                >
                  {{ relationship.name }}
                </option>
              </select>
            </div>

            <div class="col-md-4">
              <label class="form-label">{{ $t('inmates.edit.fields.contactLanguage') }}</label>
              <select
                v-model="form.emergency_contact_language_id"
                class="form-select"
              >
                <option value="">{{ $t('inmates.edit.fields.selectContactLanguage') }}</option>
                <option
                  v-for="language in languages"
                  :key="language?.id"
                  :value="language?.id"
                >
                  {{ language?.name || language }}
                </option>
              </select>
            </div>

            </div>
          </div>
        </div>

        <!--begin::Step 4: General Notes-->
        <div class="card mb-7">
          <div class="card-header border-0 pt-6">
            <div class="card-title">
              <h4 class="fw-bold text-gray-800">{{ $t('inmates.edit.sections.generalNotes') }}</h4>
            </div>
          </div>
          <div class="card-body pt-0">
            <div class="row g-6">
              <div class="col-md-12">
                <label class="form-label">{{ $t('inmates.edit.fields.generalObservations') }}</label>
                <textarea
                  v-model="form.general_notes"
                  class="form-control"
                  rows="4"
                  :placeholder="$t('inmates.edit.fields.generalObservationsPlaceholder')"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <!--end::Step 6-->

      </form>
    </div>
    <!--end::Card body-->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useInmatesStore } from "@/stores/inmates";
import { useCatalogsStore } from "@/stores/catalogs";
import { useCatalogs } from "@/composables/useCatalogs";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";
import { formatDateForInput } from "@/core/helpers/date-formatters";

// i18n
const { t } = useI18n();

// Stores and composables
const inmatesStore = useInmatesStore();
const catalogsStore = useCatalogsStore();
const {
  socioeconomicLevels,
  relationshipTypes,
  loadInmateCatalogs,
} = useCatalogs();
const route = useRoute();
const router = useRouter();

// Reactive data
const loading = ref(false);
const loadingInmate = ref(false);
const errors = ref<Record<string, string[]>>({});
const birthDepartments = ref<any[]>([]);
const birthMunicipalities = ref<any[]>([]);
const departments = ref<any[]>([]);
const municipalities = ref<any[]>([]);
const sexualOrientations = ref<any[]>([]);
const genderIdentities = ref<any[]>([]);

// Initialize fallback data for LGBTIQ+ fields
sexualOrientations.value = [
  { id: 1, name: "Heterosexual" },
  { id: 2, name: "Gay/Homosexual" },
  { id: 3, name: "Lesbiana" },
  { id: 4, name: "Bisexual" },
  { id: 8, name: "Prefiere no especificar" },
];

genderIdentities.value = [
  { id: 1, name: "Cisgénero Masculino" },
  { id: 2, name: "Cisgénero Femenino" },
  { id: 3, name: "Transgénero Masculino" },
  { id: 4, name: "Transgénero Femenino" },
  { id: 5, name: "No binario" },
  { id: 9, name: "Prefiere no especificar" },
];

// Form data
const form = ref({
  document_type_id: "",
  document_number: "",
  first_name: "",
  middle_name: "",
  third_name: "",
  last_name: "",
  second_last_name: "",
  married_surname: "",
  alias: "",
  birth_date: "",
  gender: "",
  blood_type_id: "",
  birth_country_id: "",
  birth_department_id: "",
  birth_municipality_id: "",
  country_id: "",
  department_id: "",
  municipality_id: "",
  nationality_id: "",
  ethnic_group_id: "",
  civil_status_id: "",
  academic_degree_id: "",
  occupation_id: "",
  religion_id: "",
  risk_classification_id: "",
  procedural_status_id: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
  emergency_contact_relationship_id: "",
  emergency_contact_language_id: "",
  // LGBTIQ+ fields
  sexual_orientation_id: "",
  gender_identity_id: "",
  requires_lgbtiq_accommodations: false,
  lgbtiq_accommodation_notes: "",
  // Additional demographic fields
  primary_language_id: "",
  requires_interpreter: false,
  special_cultural_needs: "",
  cultural_practices: "",
  address: "",
  phone: "",
  email: "",
  // Professional fields
  occupation_details: "",
  previous_occupation: "",
  work_experience: "",
  skills_and_abilities: "",
  socioeconomic_level_id: "",
  // General notes
  general_notes: "",
});

// Computed properties
const currentInmate = computed(() => inmatesStore.currentInmate);
const error = computed(() => inmatesStore.error);

// Catalog data - using direct catalogs for forms
const documentTypes = computed(() => catalogsStore.getCatalog("document-types"));
const bloodTypes = computed(() => catalogsStore.getCatalog("blood-types"));
const countries = computed(() => catalogsStore.getCatalog("countries"));
const nationalities = computed(() => catalogsStore.getCatalog("nationalities"));
const ethnicGroups = computed(() => catalogsStore.getCatalog("ethnic-groups"));
const civilStatuses = computed(() => catalogsStore.getCatalog("civil-statuses"));
const academicDegrees = computed(() => catalogsStore.getCatalog("academic-degrees"));
const occupations = computed(() => catalogsStore.getCatalog("occupations"));
const religions = computed(() => catalogsStore.getCatalog("religions"));
const riskClassifications = computed(() => catalogsStore.getCatalog("risk-classifications"));
const proceduralStatuses = computed(() => catalogsStore.getCatalog("procedural-statuses"));
const languages = computed(() => catalogsStore.getCatalog("languages"));

// Methods
const loadInmate = async () => {
  try {
    loadingInmate.value = true;
    const inmateId = route.params.id as string;
    await inmatesStore.fetchInmate(inmateId);

    if (currentInmate.value) {
      populateForm();
    }
  } catch (error) {
    console.error("Error loading inmate:", error);
  } finally {
    loadingInmate.value = false;
  }
};

const populateForm = async () => {
  if (!currentInmate.value) return;

  const inmate = currentInmate.value;
  form.value = {
    document_type_id: inmate.document_type_id?.toString() || "",
    document_number: inmate.document_number || "",
    first_name: inmate.first_name || "",
    middle_name: inmate.middle_name || "",
    third_name: inmate.third_name || "",
    last_name: inmate.last_name || "",
    second_last_name: inmate.second_last_name || "",
    married_surname: inmate.married_surname || "",
    alias: inmate.alias || "",
    birth_date: formatDateForInput(inmate.birth_date),
    gender: inmate.gender || "",
    blood_type_id: inmate.blood_type_id?.toString() || "",
    birth_country_id: inmate.birth_country_id?.toString() || "",
    birth_department_id: inmate.birth_department_id?.toString() || "",
    birth_municipality_id: inmate.birth_municipality_id?.toString() || "",
    country_id: inmate.country_id?.toString() || "",
    department_id: inmate.department_id?.toString() || "",
    municipality_id: inmate.municipality_id?.toString() || "",
    nationality_id: inmate.nationality_id?.toString() || "",
    ethnic_group_id: inmate.ethnic_group_id?.toString() || "",
    civil_status_id: inmate.civil_status_id?.toString() || "",
    academic_degree_id: inmate.academic_degree_id?.toString() || "",
    occupation_id: inmate.occupation_id?.toString() || "",
    religion_id: inmate.religion_id?.toString() || "",
    risk_classification_id: inmate.risk_classification_id?.toString() || "",
    procedural_status_id: inmate.procedural_status_id?.toString() || "",
    emergency_contact_name: inmate.emergency_contact_name || "",
    emergency_contact_phone: inmate.emergency_contact_phone || "",
    emergency_contact_relationship_id: inmate.emergency_contact_relationship_id?.toString() || "",
    emergency_contact_language_id: inmate.emergency_contact_language_id?.toString() || "",
    // LGBTIQ+ fields
    sexual_orientation_id: inmate.sexual_orientation_id?.toString() || "",
    gender_identity_id: inmate.gender_identity_id?.toString() || "",
    requires_lgbtiq_accommodations: inmate.requires_lgbtiq_accommodations || false,
    lgbtiq_accommodation_notes: inmate.lgbtiq_accommodation_notes || "",
    // Additional demographic fields
    primary_language_id: inmate.primary_language_id?.toString() || "",
    requires_interpreter: inmate.requires_interpreter || false,
    special_cultural_needs: inmate.special_cultural_needs || "",
    cultural_practices: inmate.cultural_practices || "",
    address: inmate.address || "",
    phone: inmate.phone || "",
    email: inmate.email || "",
    // Professional fields
    occupation_details: inmate.occupation_details || "",
    previous_occupation: inmate.previous_occupation || "",
    work_experience: inmate.work_experience || "",
    skills_and_abilities: inmate.skills_and_abilities || "",
    socioeconomic_level_id: inmate.socioeconomic_level_id?.toString() || "",
    // General notes
    general_notes: inmate.general_notes || "",
  };

  // Load birth location dependencies if they exist
  if (inmate.birth_country_id) {
    await onBirthCountryChange();
    if (inmate.birth_department_id) {
      form.value.birth_department_id = inmate.birth_department_id.toString();
      await onBirthDepartmentChange();
      if (inmate.birth_municipality_id) {
        form.value.birth_municipality_id = inmate.birth_municipality_id.toString();
      }
    }
  }

  // Load residence location dependencies if they exist
  if (inmate.country_id) {
    await onCountryChange();
    if (inmate.department_id) {
      form.value.department_id = inmate.department_id.toString();
      await onDepartmentChange();
      if (inmate.municipality_id) {
        form.value.municipality_id = inmate.municipality_id.toString();
      }
    }
  }
};

const onBirthCountryChange = async () => {
  form.value.birth_department_id = "";
  form.value.birth_municipality_id = "";
  birthDepartments.value = [];
  birthMunicipalities.value = [];

  if (form.value.birth_country_id) {
    try {
      // Load all departments
      await catalogsStore.fetchDepartments();
      const allDepartments = catalogsStore.getCatalog("departments");

      // Filter departments by selected country
      birthDepartments.value = allDepartments.filter(
        (d: any) => d.country_id === Number(form.value.birth_country_id)
      );
    } catch (error) {
      console.error("Error loading birth departments:", error);
    }
  }
};

const onBirthDepartmentChange = async () => {
  form.value.birth_municipality_id = "";
  birthMunicipalities.value = [];
  
  if (form.value.birth_department_id) {
    try {
      // Load all municipalities and filter by department
      await catalogsStore.fetchMunicipalities();
      const allMunicipalities = catalogsStore.getCatalog("municipalities");
      
      birthMunicipalities.value = allMunicipalities.filter(
        (m: any) => m.department_id === Number(form.value.birth_department_id)
      );
    } catch (error) {
      console.error("Error loading birth municipalities:", error);
    }
  }
};

const onCountryChange = async () => {
  form.value.department_id = "";
  form.value.municipality_id = "";
  departments.value = [];
  municipalities.value = [];

  if (form.value.country_id) {
    try {
      // Load all departments
      await catalogsStore.fetchDepartments();
      const allDepartments = catalogsStore.getCatalog("departments");

      // Filter departments by selected country
      departments.value = allDepartments.filter(
        (d: any) => d.country_id === Number(form.value.country_id)
      );
    } catch (error) {
      console.error("Error loading departments:", error);
    }
  }
};

const onDepartmentChange = async () => {
  form.value.municipality_id = "";
  municipalities.value = [];
  
  if (form.value.department_id) {
    try {
      // Load all municipalities and filter by department
      await catalogsStore.fetchMunicipalities();
      const allMunicipalities = catalogsStore.getCatalog("municipalities");
      
      municipalities.value = allMunicipalities.filter(
        (m: any) => m.department_id === Number(form.value.department_id)
      );
    } catch (error) {
      console.error("Error loading municipalities:", error);
    }
  }
};

const loadSexualOrientations = async () => {
  const result = await fetchCatalog("/catalogs/sexual-orientations");
  if (!result || result.length === 0) {
    // Fallback data if API fails
    sexualOrientations.value = [
      { id: 1, name: "Heterosexual" },
      { id: 2, name: "Gay/Homosexual" },
      { id: 3, name: "Lesbiana" },
      { id: 4, name: "Bisexual" },
      { id: 8, name: "Prefiere no especificar" },
    ];
  } else {
    sexualOrientations.value = result;
  }
};

const loadGenderIdentities = async () => {
  const result = await fetchCatalog("/catalogs/gender-identities");
  if (!result || result.length === 0) {
    // Fallback data if API fails
    genderIdentities.value = [
      { id: 1, name: "Cisgénero Masculino" },
      { id: 2, name: "Cisgénero Femenino" },
      { id: 3, name: "Transgénero Masculino" },
      { id: 4, name: "Transgénero Femenino" },
      { id: 5, name: "No binario" },
      { id: 9, name: "Prefiere no especificar" },
    ];
  } else {
    genderIdentities.value = result;
  }
};


const fetchCatalog = async (endpoint: string): Promise<any[]> => {
  try {
    const response = await ApiService.get(endpoint);
    return response.data.data || response.data || [];
  } catch (error) {
    console.error(`Error loading ${endpoint}:`, error);
    return [];
  }
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    errors.value = {};

    // Validate required fields
    if (!form.value.nationality_id) {
      errors.value = { nationality_id: [t('inmates.edit.swal.selectNationality')] };
      loading.value = false;
      Swal.fire({
        title: t('inmates.edit.swal.validationError'),
        text: t('inmates.edit.swal.selectNationality'),
        icon: "error",
        confirmButtonText: t('inmates.edit.swal.accept'),
      });
      return;
    }

    // Convert string IDs to numbers where needed
    const formData = {
      ...form.value,
      document_type_id: form.value.document_type_id
        ? Number(form.value.document_type_id)
        : null,
      blood_type_id: form.value.blood_type_id
        ? Number(form.value.blood_type_id)
        : null,
      birth_country_id: form.value.birth_country_id
        ? Number(form.value.birth_country_id)
        : null,
      birth_department_id: form.value.birth_department_id
        ? Number(form.value.birth_department_id)
        : null,
      birth_municipality_id: form.value.birth_municipality_id
        ? Number(form.value.birth_municipality_id)
        : null,
      country_id: form.value.country_id ? Number(form.value.country_id) : null,
      department_id: form.value.department_id
        ? Number(form.value.department_id)
        : null,
      municipality_id: form.value.municipality_id
        ? Number(form.value.municipality_id)
        : null,
      nationality_id: form.value.nationality_id
        ? Number(form.value.nationality_id)
        : null,
      ethnic_group_id: form.value.ethnic_group_id
        ? Number(form.value.ethnic_group_id)
        : null,
      civil_status_id: form.value.civil_status_id
        ? Number(form.value.civil_status_id)
        : null,
      academic_degree_id: form.value.academic_degree_id
        ? Number(form.value.academic_degree_id)
        : null,
      occupation_id: form.value.occupation_id
        ? Number(form.value.occupation_id)
        : null,
      religion_id: form.value.religion_id
        ? Number(form.value.religion_id)
        : null,
      risk_classification_id: form.value.risk_classification_id
        ? Number(form.value.risk_classification_id)
        : null,
      procedural_status_id: form.value.procedural_status_id
        ? Number(form.value.procedural_status_id)
        : null,
      emergency_contact_language_id: form.value.emergency_contact_language_id
        ? Number(form.value.emergency_contact_language_id)
        : null,
      emergency_contact_relationship_id: form.value.emergency_contact_relationship_id
        ? Number(form.value.emergency_contact_relationship_id)
        : null,
      sexual_orientation_id: form.value.sexual_orientation_id
        ? Number(form.value.sexual_orientation_id)
        : null,
      gender_identity_id: form.value.gender_identity_id
        ? Number(form.value.gender_identity_id)
        : null,
      primary_language_id: form.value.primary_language_id
        ? Number(form.value.primary_language_id)
        : null,
      socioeconomic_level_id: form.value.socioeconomic_level_id
        ? Number(form.value.socioeconomic_level_id)
        : null,
    };

    const inmateId = route.params.id as string;
    await inmatesStore.updateInmate(inmateId, formData);

    await Swal.fire({
      title: t('inmates.edit.swal.success'),
      text: t('inmates.edit.swal.successMessage'),
      icon: "success",
      timer: 2000,
    });

    // Redirect to inmate detail view instead of list
    router.push({ name: 'inmates-detail', params: { id: inmateId } });
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {};
    }

    await Swal.fire({
      title: t('inmates.edit.swal.error'),
      text: error.response?.data?.message || t('inmates.edit.swal.errorMessage'),
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Load data on mount
onMounted(async () => {
  // Load catalogs using composable
  await loadInmateCatalogs();

  // Load geographic catalogs that are essential
  await Promise.all([
    catalogsStore.fetchCountries(),
    catalogsStore.fetchDepartments(),
    catalogsStore.fetchMunicipalities(),
  ]);

  // Load additional catalogs
  await Promise.all([
    loadSexualOrientations(),
    loadGenderIdentities(),
  ]);

  // Load inmate data
  await loadInmate();
});
</script>
