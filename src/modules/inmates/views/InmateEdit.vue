<template>
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <h3 class="fw-bold m-0">
          Editar Interno
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
          Cancelar
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
          {{ loading ? "Guardando..." : "Guardar Cambios" }}
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
          <span class="visually-hidden">Cargando...</span>
        </div>
        <div class="text-gray-600 fs-6 fw-semibold mt-5">
          Cargando información del interno...
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
            <h4 class="mb-1 text-danger">Error al cargar el interno</h4>
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
              <h4 class="fw-bold text-gray-800">Información Básica</h4>
            </div>
          </div>
          <div class="card-body pt-0">
            <div class="row g-6">
              <!--begin::Document Information-->
              <div class="col-md-6">
                <label class="form-label required">Tipo de Documento</label>
                <select
                  v-model="form.document_type_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.document_type_id }"
                  required
                >
                  <option value="">Seleccionar tipo de documento</option>
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
                <label class="form-label required"
                  >Número de Identificación</label
                >
                <input
                  type="text"
                  v-model="form.document_number"
                  class="form-control"
                  :class="{ 'is-invalid': errors.document_number }"
                  placeholder="Ingrese el número de identificación"
                  required
                />
                <div v-if="errors.document_number" class="invalid-feedback">
                  {{ errors.document_number[0] }}
                </div>
              </div>

              <!--begin::Names-->
              <div class="col-md-4">
                <label class="form-label required">Primer Nombre</label>
                <input
                  type="text"
                  v-model="form.first_name"
                  class="form-control"
                  :class="{ 'is-invalid': errors.first_name }"
                  placeholder="Primer nombre"
                  required
                />
                <div v-if="errors.first_name" class="invalid-feedback">
                  {{ errors.first_name[0] }}
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label">Segundo Nombre</label>
                <input
                  type="text"
                  v-model="form.middle_name"
                  class="form-control"
                  placeholder="Segundo nombre (opcional)"
                />
              </div>

              <div class="col-md-4">
                <label class="form-label">Tercer Nombre</label>
                <input
                  type="text"
                  v-model="form.third_name"
                  class="form-control"
                  placeholder="Tercer nombre (opcional)"
                />
              </div>

              <!--begin::Surnames-->
              <div class="col-md-4">
                <label class="form-label required">Primer Apellido</label>
                <input
                  type="text"
                  v-model="form.last_name"
                  class="form-control"
                  :class="{ 'is-invalid': errors.last_name }"
                  placeholder="Primer apellido"
                  required
                />
                <div v-if="errors.last_name" class="invalid-feedback">
                  {{ errors.last_name[0] }}
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label">Segundo Apellido</label>
                <input
                  type="text"
                  v-model="form.second_last_name"
                  class="form-control"
                  placeholder="Segundo apellido (opcional)"
                />
              </div>

              <div class="col-md-4">
                <label class="form-label">Apellido de Casada</label>
                <input
                  type="text"
                  v-model="form.married_surname"
                  class="form-control"
                  placeholder="Apellido de casada (opcional)"
                />
              </div>
              <!--end::Surnames-->

              <div class="col-md-12">
                <label class="form-label">Alias/Sobrenombre</label>
                <input
                  type="text"
                  v-model="form.alias"
                  class="form-control"
                  placeholder="Alias o sobrenombre (opcional)"
                />
              </div>

              <!--begin::Personal Information-->
              <div class="col-md-4">
                <label class="form-label required">Fecha de Nacimiento</label>
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
                <label class="form-label required">Género</label>
                <select
                  v-model="form.gender"
                  class="form-select"
                  :class="{ 'is-invalid': errors.gender }"
                  required
                >
                  <option value="">Seleccionar género</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
                <div v-if="errors.gender" class="invalid-feedback">
                  {{ errors.gender[0] }}
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label">Tipo de Sangre</label>
                <select v-model="form.blood_type_id" class="form-select">
                  <option value="">Seleccionar tipo de sangre</option>
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
                  Información de Diversidad Sexual (Opcional y Confidencial)
                </h5>
                <div
                  class="alert alert-info d-flex align-items-center p-5 mb-6"
                >
                  <i class="ki-duotone ki-shield-tick fs-2hx text-info me-4">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  <div class="d-flex flex-column">
                    <h5 class="mb-1">Información Confidencial</h5>
                    <span
                      >Esta información es voluntaria, confidencial y se utiliza
                      únicamente para garantizar el respeto a los derechos
                      humanos y proporcionar las acomodaciones necesarias.</span
                    >
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Orientación Sexual</label>
                <select
                  v-model="form.sexual_orientation_id"
                  class="form-select"
                >
                  <option value="">No especificado</option>
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
                <label class="form-label">Identidad de Género</label>
                <select v-model="form.gender_identity_id" class="form-select">
                  <option value="">No especificado</option>
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
                    Requiere Acomodaciones Especiales LGBTIQ+
                  </label>
                </div>
              </div>

              <div v-if="form.requires_lgbtiq_accommodations" class="col-md-12">
                <label class="form-label"
                  >Notas sobre Acomodaciones LGBTIQ+</label
                >
                <textarea
                  v-model="form.lgbtiq_accommodation_notes"
                  class="form-control"
                  rows="3"
                  placeholder="Describir las acomodaciones especiales necesarias para garantizar la seguridad, dignidad y respeto de los derechos humanos..."
                ></textarea>
              </div>
              <!--end::LGBTIQ+ Information-->

              <!--begin::Birth Location-->
              <div class="col-md-4">
                <label class="form-label required">País de Nacimiento</label>
                <select
                  v-model="form.birth_country_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.birth_country_id }"
                  @change="onBirthCountryChange"
                  required
                >
                  <option value="">Seleccionar país</option>
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
                <label class="form-label required">Departamento de Nacimiento</label>
                <select
                  v-model="form.birth_department_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.birth_department_id }"
                  @change="onBirthDepartmentChange"
                  :disabled="!form.birth_country_id"
                  required
                >
                  <option value="">Seleccionar departamento</option>
                  <option
                    v-for="department in birthDepartments"
                    :key="department?.id || Math.random()"
                    :value="department?.id"
                  >
                    {{ department?.name || 'Sin nombre' }}
                  </option>
                </select>
                <div v-if="errors.birth_department_id" class="invalid-feedback">
                  {{ errors.birth_department_id[0] }}
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label required">Municipio de Nacimiento</label>
                <select
                  v-model="form.birth_municipality_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.birth_municipality_id }"
                  :disabled="!form.birth_department_id"
                  required
                >
                  <option value="">Seleccionar municipio</option>
                  <option
                    v-for="municipality in birthMunicipalities"
                    :key="municipality?.id || Math.random()"
                    :value="municipality?.id"
                  >
                    {{ municipality?.name || 'Sin nombre' }}
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
              <h4 class="fw-bold text-gray-800">Información de Residencia y Cultura</h4>
            </div>
          </div>
          <div class="card-body pt-0">
            <div class="row g-6">
              <div class="col-md-4">
                <label class="form-label required">País de Residencia</label>
                <select
                  v-model="form.country_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.country_id }"
                  required
                  @change="onCountryChange"
                >
                  <option value="">Seleccionar país</option>
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
                <label class="form-label required">Departamento</label>
                <select
                  v-model="form.department_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.department_id }"
                  :disabled="!form.country_id"
                  required
                  @change="onDepartmentChange"
                >
                  <option value="">Seleccionar departamento</option>
                  <option
                    v-for="department in departments"
                    :key="department?.id || Math.random()"
                    :value="department?.id"
                  >
                    {{ department?.name || 'Sin nombre' }}
                  </option>
                </select>
                <div v-if="errors.department_id" class="invalid-feedback">
                  {{ errors.department_id[0] }}
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label required">Municipio</label>
                <select
                  v-model="form.municipality_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.municipality_id }"
                  :disabled="!form.department_id"
                  required
                >
                  <option value="">Seleccionar municipio</option>
                  <option
                    v-for="municipality in municipalities"
                    :key="municipality?.id || Math.random()"
                    :value="municipality?.id"
                  >
                    {{ municipality?.name || 'Sin nombre' }}
                  </option>
                </select>
                <div v-if="errors.municipality_id" class="invalid-feedback">
                  {{ errors.municipality_id[0] }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Dirección</label>
                <input
                  type="text"
                  v-model="form.address"
                  class="form-control"
                  placeholder="Dirección de residencia"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">Teléfono</label>
                <input
                  type="tel"
                  v-model="form.phone"
                  class="form-control"
                  placeholder="Número de teléfono"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">Correo Electrónico</label>
                <input
                  type="email"
                  v-model="form.email"
                  class="form-control"
                  placeholder="Correo electrónico (opcional)"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">Prácticas Culturales</label>
                <select v-model="form.cultural_practices" class="form-select">
                  <option value="">Seleccionar práctica cultural</option>
                  <option value="maya_traditional">Maya Tradicional</option>
                  <option value="xinca_traditional">Xinca Tradicional</option>
                  <option value="garifuna_traditional">
                    Garífuna Tradicional
                  </option>
                  <option value="catholic">Católica</option>
                  <option value="evangelical">Evangélica</option>
                  <option value="other_religious">Otra Religiosa</option>
                  <option value="none">Ninguna</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label required">Idioma Materno</label>
                <select
                  v-model="form.primary_language_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.primary_language_id }"
                  required
                >
                  <option value="">Seleccionar idioma materno</option>
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
                  <label class="form-check-label"> Requiere Intérprete </label>
                </div>
              </div>

              <div v-if="form.requires_interpreter" class="col-md-12">
                <label class="form-label"
                  >Necesidades Culturales Especiales</label
                >
                <textarea
                  v-model="form.special_cultural_needs"
                  class="form-control"
                  rows="3"
                  placeholder="Describir necesidades culturales especiales, ceremonias, dietas específicas, etc."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!--begin::Step 3: Institutional Information-->
        <div class="card mb-7">
          <div class="card-header border-0 pt-6">
            <div class="card-title">
              <h4 class="fw-bold text-gray-800">Información Institucional</h4>
            </div>
          </div>
          <div class="card-body pt-0">
            <div class="row g-6">
              <div class="col-md-6">
                <label class="form-label required">Centro Actual</label>
                <select
                  v-model="form.current_center_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.current_center_id }"
                  required
                  @change="onCenterChange"
                >
                  <option value="">Seleccionar centro</option>
                  <option
                    v-for="center in centers"
                    :key="center.id"
                    :value="center.id"
                  >
                    {{ center.name }}
                  </option>
                </select>
                <div v-if="errors.current_center_id" class="invalid-feedback">
                  {{ errors.current_center_id[0] }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Sector Actual</label>
                <select
                  v-model="form.current_sector_id"
                  class="form-select"
                  :disabled="!form.current_center_id"
                >
                  <option value="">Seleccionar sector</option>
                  <option
                    v-for="sector in filteredSectors"
                    :key="sector.id"
                    :value="sector.id"
                  >
                    {{ sector.name }}
                  </option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label">Estado</label>
                <select v-model="form.status" class="form-select">
                  <option value="active">Activo</option>
                  <option value="transferred">En traslado</option>
                  <option value="court_hearing">En audiencia</option>
                  <option value="hospital_external">Hospital externo</option>
                  <option value="hospital_internal">Enfermería</option>
                  <option value="isolation">Aislamiento</option>
                  <option value="released">Liberado</option>
                  <option value="deceased">Fallecido</option>
                  <option value="escaped">Fugado</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label">Fecha de Ingreso</label>
                <input
                  type="date"
                  v-model="form.admission_date"
                  class="form-control"
                  :class="{ 'is-invalid': errors.admission_date }"
                />
                <div v-if="errors.admission_date" class="invalid-feedback">
                  {{ errors.admission_date[0] }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Hora de Ingreso</label>
                <input
                  type="time"
                  v-model="form.admission_time"
                  class="form-control"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">Tipo de Admisión</label>
                <select v-model="form.admission_type" class="form-select">
                  <option value="">Seleccionar tipo</option>
                  <option value="new_admission">Ingreso Nuevo</option>
                  <option value="recapture">Reingreso</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label">Número de Orden de Ingreso</label>
                <input
                  type="text"
                  v-model="form.admission_order_number"
                  class="form-control"
                  placeholder="Número de orden"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">Documento de Remisión</label>
                <input
                  type="text"
                  v-model="form.remission_document_number"
                  class="form-control"
                  placeholder="Número de documento"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">Juzgado Remitente</label>
                <select v-model="form.remitting_court_id" class="form-select">
                  <option value="">Seleccionar juzgado</option>
                  <option
                    v-for="court in courts"
                    :key="court.id"
                    :value="court.id"
                  >
                    {{ court.name }}
                  </option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label">¿Posee Expediente Judicial?</label>
                <div class="form-check form-switch form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="form.has_judicial_file"
                  />
                  <label class="form-check-label">
                    Sí, el expediente está disponible
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--begin::Step 4: Additional Information-->
        <div class="card mb-7">
          <div class="card-header border-0 pt-6">
            <div class="card-title">
              <h4 class="fw-bold text-gray-800">Información Adicional</h4>
            </div>
          </div>
          <div class="card-body pt-0">
            <div class="row g-6">
              <div class="col-md-4">
                <label class="form-label required">Nacionalidad</label>
                <select
                  v-model="form.nationality_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.nationality_id }"
                  required
                >
                  <option value="">Seleccionar nacionalidad</option>
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
                <label class="form-label">Grupo Étnico</label>
                <select v-model="form.ethnic_group_id" class="form-select">
                  <option value="">Seleccionar grupo étnico</option>
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
                <label class="form-label">Estado Civil</label>
                <select v-model="form.civil_status_id" class="form-select">
                  <option value="">Seleccionar estado civil</option>
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
                <label class="form-label">Grado Académico</label>
                <select v-model="form.academic_degree_id" class="form-select">
                  <option value="">Seleccionar grado académico</option>
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
                <label class="form-label">Ocupación</label>
                <select v-model="form.occupation_id" class="form-select">
                  <option value="">Seleccionar ocupación</option>
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
                <label class="form-label">Religión</label>
                <select v-model="form.religion_id" class="form-select">
                  <option value="">Seleccionar religión</option>
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
                <label class="form-label required">Clasificación de Riesgo</label>
                <select
                  v-model="form.risk_classification_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.risk_classification_id }"
                  required
                >
                  <option value="">Seleccionar clasificación</option>
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
                <label class="form-label required">Estado Procesal</label>
                <select
                  v-model="form.procedural_status_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.procedural_status_id }"
                  required
                >
                  <option value="">Seleccionar estado procesal</option>
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
                <label class="form-label">Nivel Socioeconómico</label>
                <select v-model="form.socioeconomic_level_id" class="form-select">
                  <option value="">Seleccionar nivel socioeconómico</option>
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
              <h5 class="text-muted mt-5 mb-3">Información Profesional y Social</h5>
            </div>
            
            <div class="col-md-6">
              <label class="form-label">Detalles de Ocupación</label>
              <input
                type="text"
                v-model="form.occupation_details"
                class="form-control"
                placeholder="Detalles sobre la ocupación actual o anterior"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">Ocupación Anterior</label>
              <input
                type="text"
                v-model="form.previous_occupation"
                class="form-control"
                placeholder="Ocupación anterior al ingreso"
              />
            </div>

            <div class="col-md-12">
              <label class="form-label">Experiencia Laboral</label>
              <textarea
                v-model="form.work_experience"
                class="form-control"
                rows="2"
                placeholder="Descripción de la experiencia laboral previa"
              ></textarea>
            </div>

            <div class="col-md-12">
              <label class="form-label">Habilidades y Destrezas</label>
              <textarea
                v-model="form.skills_and_abilities"
                class="form-control"
                rows="2"
                placeholder="Habilidades especiales, oficios, destrezas técnicas, etc."
              ></textarea>
            </div>

            <!-- Emergency Contact Information -->
            <div class="col-md-12">
              <h5 class="text-muted mt-5 mb-3">Contacto de Emergencia</h5>
            </div>
            
            <div class="col-md-4">
              <label class="form-label">Nombre del Contacto</label>
              <input
                type="text"
                v-model="form.emergency_contact_name"
                class="form-control"
                placeholder="Nombre completo del contacto"
              />
            </div>

            <div class="col-md-4">
              <label class="form-label">Teléfono del Contacto</label>
              <input
                type="text"
                v-model="form.emergency_contact_phone"
                class="form-control"
                placeholder="Número de teléfono"
              />
            </div>

            <div class="col-md-4">
              <label class="form-label">Relación con el Interno</label>
              <select
                v-model="form.emergency_contact_relationship_id"
                class="form-select"
              >
                <option value="">Seleccionar relación</option>
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
              <label class="form-label">Idioma del Contacto</label>
              <select
                v-model="form.emergency_contact_language_id"
                class="form-select"
              >
                <option value="">Seleccionar idioma del contacto</option>
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

        <!--begin::Step 5: Medical Information (Optional)-->
        <div class="card mb-7">
          <div class="card-header border-0 pt-6">
            <div class="card-title">
              <h4 class="fw-bold text-gray-800">
                Información Médica (Opcional)
              </h4>
            </div>
          </div>
          <div class="card-body pt-0">
            <div class="row g-6">
              <div class="col-md-12">
                <label class="form-label">Observaciones Médicas</label>
                <textarea
                  v-model="form.medical_observations"
                  class="form-control"
                  rows="3"
                  placeholder="Observaciones médicas adicionales (opcional)"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <!--end::Step 5-->

        <!--begin::Step 6: Additional Notes-->
        <div class="card mb-7">
          <div class="card-header border-0 pt-6">
            <div class="card-title">
              <h4 class="fw-bold text-gray-800">Observaciones Generales</h4>
            </div>
          </div>
          <div class="card-body pt-0">
            <div class="row g-6">
              <div class="col-md-12">
                <label class="form-label">Observaciones</label>
                <textarea
                  v-model="form.general_notes"
                  class="form-control"
                  rows="4"
                  placeholder="Observaciones generales sobre el interno (opcional)"
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
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useInmatesStore } from "@/stores/inmates";
import { useCatalogsStore } from "@/stores/catalogs";
import { useCatalogs } from "@/composables/useCatalogs";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";
import { formatDateForInput } from "@/core/helpers/date-formatters";

// Stores and composables
const inmatesStore = useInmatesStore();
const catalogsStore = useCatalogsStore();
const {
  centersOptions,
  documentTypesOptions,
  bloodTypesOptions,
  countriesOptions,
  departmentsOptions,
  municipalitiesOptions,
  sectorsOptions,
  nationalitiesOptions,
  ethnicGroupsOptions,
  civilStatusesOptions,
  academicDegreesOptions,
  occupationsOptions,
  religionsOptions,
  riskClassificationsOptions,
  proceduralStatusesOptions,
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
  current_center_id: "",
  current_sector_id: "",
  status: "active",
  admission_date: "",
  admission_time: "",
  admission_type: "",
  admission_order_number: "",
  remission_document_number: "",
  remitting_court_id: "",
  has_judicial_file: false,
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
  // Medical fields
  medical_observations: "",
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
const centers = computed(() => catalogsStore.getCatalog("centers"));
const courts = computed(() => catalogsStore.getCatalog("courts"));
const nationalities = computed(() => catalogsStore.getCatalog("nationalities"));
const ethnicGroups = computed(() => catalogsStore.getCatalog("ethnic-groups"));
const civilStatuses = computed(() => catalogsStore.getCatalog("civil-statuses"));
const academicDegrees = computed(() => catalogsStore.getCatalog("academic-degrees"));
const occupations = computed(() => catalogsStore.getCatalog("occupations"));
const religions = computed(() => catalogsStore.getCatalog("religions"));
const riskClassifications = computed(() => catalogsStore.getCatalog("risk-classifications"));
const proceduralStatuses = computed(() => catalogsStore.getCatalog("procedural-statuses"));
const languages = computed(() => catalogsStore.getCatalog("languages"));

// Filtered data based on selections
const filteredDepartments = computed(() => {
  if (!form.value.country_id) return [];
  const departments = catalogsStore.getCatalog("departments");
  return departments.filter((dept) => dept.country_id == form.value.country_id);
});

const filteredMunicipalities = computed(() => {
  if (!form.value.department_id) return [];
  const municipalities = catalogsStore.getCatalog("municipalities");
  return municipalities.filter(
    (mun) => mun.department_id == form.value.department_id,
  );
});

const filteredSectors = computed(() => {
  if (!form.value.current_center_id) return [];
  const sectors = catalogsStore.getCatalog("sectors");
  return sectors.filter(
    (sector) => sector.center_id == form.value.current_center_id,
  );
});

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
  console.log('Datos del interno para popular el form:', inmate);
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
    current_center_id: inmate.current_center_id?.toString() || "",
    current_sector_id: inmate.current_sector_id?.toString() || "",
    status: inmate.status || "active",
    admission_date: formatDateForInput(inmate.admission_date),
    admission_time: inmate.admission_datetime ? new Date(inmate.admission_datetime).toTimeString().substring(0, 5) : "",
    admission_type: inmate.admission_type || "",
    admission_order_number: inmate.admission_order_number || "",
    remission_document_number: inmate.remission_document_number || "",
    remitting_court_id: inmate.remitting_court_id?.toString() || "",
    has_judicial_file: inmate.has_judicial_file || false,
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
    // Medical fields
    medical_observations: inmate.medical_observations || "",
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
      
      // Check if selected country is Guatemala (by name or common IDs)
      const selectedCountry = countries.value.find(
        c => c.id === Number(form.value.birth_country_id)
      );
      
      const isGuatemala = selectedCountry && (
        selectedCountry.name?.toLowerCase().includes('guatemala') ||
        selectedCountry.code === 'GT' ||
        Number(form.value.birth_country_id) === 1
      );
      
      // For Guatemala, show all departments; for others, no departments
      birthDepartments.value = isGuatemala ? allDepartments : [];
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
      
      // Check if selected country is Guatemala (by name or common IDs)
      const selectedCountry = countries.value.find(
        c => c.id === Number(form.value.country_id)
      );
      
      const isGuatemala = selectedCountry && (
        selectedCountry.name?.toLowerCase().includes('guatemala') ||
        selectedCountry.code === 'GT' ||
        Number(form.value.country_id) === 1
      );
      
      // For Guatemala, show all departments; for others, no departments
      departments.value = isGuatemala ? allDepartments : [];
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

const onCenterChange = () => {
  form.value.current_sector_id = "";
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
      errors.value = { nationality_id: ["El campo nacionalidad es requerido."] };
      loading.value = false;
      Swal.fire({
        title: "Error de Validación",
        text: "Por favor seleccione la nacionalidad del interno",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    // Combine admission date and time into admission_datetime
    let admission_datetime = null;
    if (form.value.admission_date && form.value.admission_time) {
      admission_datetime = `${form.value.admission_date} ${form.value.admission_time}:00`;
    } else if (form.value.admission_date) {
      admission_datetime = `${form.value.admission_date} 00:00:00`;
    }

    // Convert string IDs to numbers where needed
    const formData = {
      ...form.value,
      admission_datetime,
      // Ensure admission_type is either a valid value or null
      admission_type: form.value.admission_type || null,
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
      current_center_id: form.value.current_center_id
        ? Number(form.value.current_center_id)
        : null,
      current_sector_id: form.value.current_sector_id
        ? Number(form.value.current_sector_id)
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
      // Additional fields
      remitting_court_id: form.value.remitting_court_id
        ? Number(form.value.remitting_court_id)
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

    // Remove admission_time as it's combined into admission_datetime
    delete formData.admission_time;

    const inmateId = route.params.id as string;
    await inmatesStore.updateInmate(inmateId, formData);

    await Swal.fire({
      title: "Éxito",
      text: "El interno ha sido actualizado correctamente",
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
      title: "Error",
      text: error.response?.data?.message || "Error al actualizar el interno",
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
    catalogsStore.fetchCourts(),
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
