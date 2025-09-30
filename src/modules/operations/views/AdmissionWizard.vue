<template>
  <div class="admission-wizard">
    <!-- Progress Header -->
    <div class="card mb-5">
      <div class="card-body">
        <div class="stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid">
          <!-- Steps Navigation -->
          <div class="d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px">
            <div class="stepper-nav ps-lg-10">
              <!-- Step 1 -->
              <div class="stepper-item" :class="{ current: currentStep === 1, completed: currentStep > 1 }">
                <div class="stepper-wrapper d-flex align-items-center">
                  <div class="stepper-icon w-40px h-40px">
                    <i class="stepper-check fas fa-check"></i>
                    <span class="stepper-number">1</span>
                  </div>
                  <div class="stepper-label">
                    <h3 class="stepper-title">{{ t('admissions.wizard.steps.identification') }}</h3>
                    <div class="stepper-desc">{{ t('admissions.wizard.steps.identificationDesc') }}</div>
                  </div>
                </div>
                <div class="stepper-line h-40px"></div>
              </div>

              <!-- Step 2 -->
              <div class="stepper-item" :class="{ current: currentStep === 2, completed: currentStep > 2 }">
                <div class="stepper-wrapper d-flex align-items-center">
                  <div class="stepper-icon w-40px h-40px">
                    <i class="stepper-check fas fa-check"></i>
                    <span class="stepper-number">2</span>
                  </div>
                  <div class="stepper-label">
                    <h3 class="stepper-title">{{ t('admissions.wizard.steps.legalReception') }}</h3>
                    <div class="stepper-desc">{{ t('admissions.wizard.steps.legalReceptionDesc') }}</div>
                  </div>
                </div>
                <div class="stepper-line h-40px"></div>
              </div>

              <!-- Step 3 -->
              <div class="stepper-item" :class="{ current: currentStep === 3, completed: currentStep > 3 }">
                <div class="stepper-wrapper d-flex align-items-center">
                  <div class="stepper-icon w-40px h-40px">
                    <i class="stepper-check fas fa-check"></i>
                    <span class="stepper-number">3</span>
                  </div>
                  <div class="stepper-label">
                    <h3 class="stepper-title">{{ t('admissions.wizard.steps.security') }}</h3>
                    <div class="stepper-desc">{{ t('admissions.wizard.steps.securityDesc') }}</div>
                  </div>
                </div>
                <div class="stepper-line h-40px"></div>
              </div>

              <!-- Step 4 -->
              <div class="stepper-item" :class="{ current: currentStep === 4, completed: currentStep > 4 }">
                <div class="stepper-wrapper d-flex align-items-center">
                  <div class="stepper-icon w-40px h-40px">
                    <i class="stepper-check fas fa-check"></i>
                    <span class="stepper-number">4</span>
                  </div>
                  <div class="stepper-label">
                    <h3 class="stepper-title">{{ t('admissions.wizard.steps.physical') }}</h3>
                    <div class="stepper-desc">{{ t('admissions.wizard.steps.physicalDesc') }}</div>
                  </div>
                </div>
                <div class="stepper-line h-40px"></div>
              </div>

              <!-- Step 5 -->
              <div class="stepper-item" :class="{ current: currentStep === 5, completed: currentStep > 5 }">
                <div class="stepper-wrapper d-flex align-items-center">
                  <div class="stepper-icon w-40px h-40px">
                    <i class="stepper-check fas fa-check"></i>
                    <span class="stepper-number">5</span>
                  </div>
                  <div class="stepper-label">
                    <h3 class="stepper-title">{{ t('admissions.wizard.steps.belongings') }}</h3>
                    <div class="stepper-desc">{{ t('admissions.wizard.steps.belongingsDesc') }}</div>
                  </div>
                </div>
                <div class="stepper-line h-40px"></div>
              </div>

              <!-- Step 6 -->
              <div class="stepper-item" :class="{ current: currentStep === 6, completed: currentStep > 6 }">
                <div class="stepper-wrapper d-flex align-items-center">
                  <div class="stepper-icon w-40px h-40px">
                    <i class="stepper-check fas fa-check"></i>
                    <span class="stepper-number">6</span>
                  </div>
                  <div class="stepper-label">
                    <h3 class="stepper-title">{{ t('admissions.wizard.steps.medical') }}</h3>
                    <div class="stepper-desc">{{ t('admissions.wizard.steps.medicalDesc') }}</div>
                  </div>
                </div>
                <div class="stepper-line h-40px"></div>
              </div>

              <!-- Step 7 -->
              <div class="stepper-item" :class="{ current: currentStep === 7, completed: currentStep > 7 }">
                <div class="stepper-wrapper d-flex align-items-center">
                  <div class="stepper-icon w-40px h-40px">
                    <i class="stepper-check fas fa-check"></i>
                    <span class="stepper-number">7</span>
                  </div>
                  <div class="stepper-label">
                    <h3 class="stepper-title">{{ t('admissions.wizard.steps.assignment') }}</h3>
                    <div class="stepper-desc">{{ t('admissions.wizard.steps.assignmentDesc') }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Content -->
          <div class="flex-row-fluid ms-lg-15">
            <div class="form w-100">
              <!-- Step 1: Personal Identification -->
              <div v-show="currentStep === 1" class="tab-pane fade show active">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Identificación Personal y Verificación</h3>
                  </div>
                  <div class="card-body">
                    <!-- Duplicate Check Alert -->
                    <div v-if="duplicateCheckResult" class="alert alert-warning mb-4">
                      <h4 class="alert-heading">
                        <i class="ki-duotone ki-information-circle fs-2 me-2">
                          <span class="path1"></span>
                          <span class="path2"></span>
                          <span class="path3"></span>
                        </i>
                        Posible Duplicado Detectado
                      </h4>
                      <p>Se encontró un interno con datos similares:</p>
                      <ul>
                        <li><strong>Nombre:</strong> {{ duplicateCheckResult.full_name }}</li>
                        <li><strong>Documento:</strong> {{ duplicateCheckResult.identification_number }}</li>
                        <li><strong>Estado:</strong> {{ duplicateCheckResult.status }}</li>
                      </ul>
                      <div class="mt-3">
                        <button type="button" class="btn btn-sm btn-warning me-2" @click="viewDuplicate">
                          Ver Perfil Existente
                        </button>
                        <button type="button" class="btn btn-sm btn-secondary" @click="duplicateCheckResult = null">
                          Continuar de Todos Modos
                        </button>
                      </div>
                    </div>

                    <!-- Personal Identification Info -->
                    <div class="row g-5">
                      <!-- Document Information -->
                      <div class="col-md-6">
                        <label class="form-label required">{{ t('admissions.wizard.fields.documentType') }}</label>
                        <select v-model="inmateData.document_type_id" class="form-select" :required="currentStep === 1">
                          <option value="">{{ t('admissions.wizard.fields.selectDocument') }}</option>
                          <option v-for="type in documentTypes" :key="type.id" :value="type.id">
                            {{ type.name }}
                          </option>
                        </select>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label required">{{ t('admissions.wizard.fields.documentNumber') }}</label>
                        <input 
                          v-model="inmateData.identification_number" 
                          type="text" 
                          class="form-control" 
                          :required="currentStep === 1"
                          @blur="checkForDuplicates"
                          placeholder="DPI o pasaporte"
                        />
                      </div>

                      <!-- Names -->
                      <div class="col-md-4">
                        <label class="form-label required">{{ t('admissions.wizard.fields.firstName') }}</label>
                        <input 
                          v-model="inmateData.first_name" 
                          type="text" 
                          class="form-control" 
                          :required="currentStep === 1"
                          @blur="checkForDuplicates"
                        />
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">{{ t('admissions.wizard.fields.secondName') }}</label>
                        <input v-model="inmateData.second_name" type="text" class="form-control" />
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">{{ t('admissions.wizard.fields.thirdName') }}</label>
                        <input v-model="inmateData.third_name" type="text" class="form-control" />
                      </div>

                      <div class="col-md-4">
                        <label class="form-label required">{{ t('admissions.wizard.fields.firstSurname') }}</label>
                        <input 
                          v-model="inmateData.first_surname" 
                          type="text" 
                          class="form-control" 
                          :required="currentStep === 1"
                          @blur="checkForDuplicates"
                        />
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">{{ t('admissions.wizard.fields.secondSurname') }}</label>
                        <input v-model="inmateData.second_surname" type="text" class="form-control" />
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">{{ t('admissions.wizard.fields.marriedSurname') }}</label>
                        <input v-model="inmateData.married_surname" type="text" class="form-control" />
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">{{ t('admissions.wizard.fields.alias') }}</label>
                        <input v-model="inmateData.alias" type="text" class="form-control" />
                      </div>

                      <!-- Demographics -->
                      <div class="col-md-4">
                        <label class="form-label required">{{ t('admissions.wizard.fields.birthDate') }}</label>
                        <input v-model="inmateData.birth_date" type="date" class="form-control" :required="currentStep === 1" />
                      </div>

                      <div class="col-md-4">
                        <label class="form-label required">{{ t('admissions.wizard.fields.gender') }}</label>
                        <select v-model="inmateData.gender" class="form-select" :required="currentStep === 1">
                          <option value="">{{ t('admissions.wizard.fields.selectGender') }}</option>
                          <option value="M">{{ t('admissions.wizard.fields.male') }}</option>
                          <option value="F">{{ t('admissions.wizard.fields.female') }}</option>
                        </select>
                      </div>
                      
                      <div class="col-md-4">
                        <label class="form-label required">{{ t('admissions.wizard.fields.birthCountry') }}</label>
                        <select v-model="inmateData.birth_country_id" class="form-select" :required="currentStep === 1" @change="loadBirthDepartments">
                          <option value="">Seleccionar país</option>
                          <option v-for="country in countries" :key="country.id" :value="country.id">
                            {{ country.name }}
                          </option>
                        </select>
                      </div>

                      <div class="col-md-4">
                        <label class="form-label required">{{ t('admissions.wizard.fields.birthDepartment') }}</label>
                        <select v-model="inmateData.birth_department_id" class="form-select" :required="currentStep === 1" @change="loadBirthMunicipalities" :disabled="!inmateData.birth_country_id">
                          <option value="">Seleccionar departamento</option>
                          <option v-for="department in birthDepartments" :key="department.id" :value="department.id">
                            {{ department.name }}
                          </option>
                        </select>
                      </div>

                      <div class="col-md-4">
                        <label class="form-label required">{{ t('admissions.wizard.fields.birthMunicipality') }}</label>
                        <select v-model="inmateData.birth_municipality_id" class="form-select" :required="currentStep === 1" :disabled="!inmateData.birth_department_id">
                          <option value="">Seleccionar municipio</option>
                          <option v-for="municipality in birthMunicipalities" :key="municipality.id" :value="municipality.id">
                            {{ municipality.name }}
                          </option>
                        </select>
                      </div>

                      <!-- Additional Info -->
                      <div class="col-md-4">
                        <label class="form-label">{{ t('admissions.wizard.fields.civilStatus') }}</label>
                        <select v-model="inmateData.civil_status_id" class="form-select">
                          <option value="">Seleccionar</option>
                          <option v-for="status in civilStatuses" :key="status.id" :value="status.id">
                            {{ status.name }}
                          </option>
                        </select>
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">{{ t('admissions.wizard.fields.nationality') }}</label>
                        <select v-model="inmateData.nationality_id" class="form-select">
                          <option value="">Seleccionar</option>
                          <option v-for="nationality in nationalities" :key="nationality.id" :value="nationality.id">
                            {{ nationality.name }}
                          </option>
                        </select>
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">{{ t('admissions.wizard.fields.ethnicGroup') }}</label>
                        <select v-model="inmateData.ethnic_group_id" class="form-select">
                          <option value="">Seleccionar</option>
                          <option v-for="group in ethnicGroups" :key="group.id" :value="group.id">
                            {{ group.name }}
                          </option>
                        </select>
                      </div>

                      <!-- Additional Demographic Fields -->
                      <div class="col-md-4">
                        <label class="form-label">Orientación Sexual</label>
                        <select v-model="inmateData.sexual_orientation_id" class="form-select">
                          <option value="">Seleccionar</option>
                          <option value="1">Heterosexual</option>
                          <option value="2">Homosexual</option>
                          <option value="3">Bisexual</option>
                          <option value="4">Otro</option>
                          <option value="5">Prefiere no decir</option>
                        </select>
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">Identidad de Género</label>
                        <select v-model="inmateData.gender_identity_id" class="form-select">
                          <option value="">Seleccionar</option>
                          <option value="1">Masculino</option>
                          <option value="2">Femenino</option>
                          <option value="3">Transgénero</option>
                          <option value="4">No binario</option>
                          <option value="5">Otro</option>
                        </select>
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">Religión</label>
                        <select v-model="inmateData.religion_id" class="form-select">
                          <option value="">Seleccionar</option>
                          <option value="1">Católica</option>
                          <option value="2">Evangélica</option>
                          <option value="3">Protestante</option>
                          <option value="4">Testigo de Jehová</option>
                          <option value="5">Mormón</option>
                          <option value="6">Musulmana</option>
                          <option value="7">Judía</option>
                          <option value="8">Maya/Indígena</option>
                          <option value="9">Ninguna</option>
                          <option value="10">Otra</option>
                        </select>
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">Grado Académico</label>
                        <select v-model="inmateData.academic_degree_id" class="form-select">
                          <option value="">Seleccionar</option>
                          <option value="1">Analfabeto</option>
                          <option value="2">Primaria incompleta</option>
                          <option value="3">Primaria completa</option>
                          <option value="4">Básicos incompletos</option>
                          <option value="5">Básicos completos</option>
                          <option value="6">Diversificado incompleto</option>
                          <option value="7">Diversificado completo</option>
                          <option value="8">Universitario incompleto</option>
                          <option value="9">Universitario completo</option>
                          <option value="10">Postgrado</option>
                        </select>
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">Profesión/Oficio</label>
                        <input
                          v-model="inmateData.profession"
                          type="text"
                          class="form-control"
                          placeholder="Ej: Carpintero, Agricultor, etc."
                        />
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">Idiomas (además del español)</label>
                        <input
                          v-model="inmateData.languages"
                          type="text"
                          class="form-control"
                          placeholder="Ej: K'iche', Inglés, etc."
                        />
                      </div>

                      <!-- Contact Information -->
                      <div class="col-12">
                        <div class="separator my-5"></div>
                        <h5 class="mb-4">Información de Contacto</h5>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label">Dirección de Residencia</label>
                        <input
                          v-model="inmateData.address"
                          type="text"
                          class="form-control"
                          placeholder="Dirección completa"
                        />
                      </div>

                      <div class="col-md-3">
                        <label class="form-label">Teléfono</label>
                        <input
                          v-model="inmateData.phone"
                          type="text"
                          class="form-control"
                          placeholder="Número de teléfono"
                        />
                      </div>

                      <div class="col-md-3">
                        <label class="form-label">Correo Electrónico</label>
                        <input
                          v-model="inmateData.email"
                          type="email"
                          class="form-control"
                          placeholder="correo@ejemplo.com"
                        />
                      </div>

                      <!-- Emergency Contact -->
                      <div class="col-12">
                        <div class="separator my-5"></div>
                        <h5 class="mb-4">{{ t('admissions.wizard.fields.emergencyContact') }}</h5>
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">{{ t('admissions.wizard.fields.contactName') }}</label>
                        <input v-model="inmateData.emergency_contact_name" type="text" class="form-control" />
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">{{ t('admissions.wizard.fields.contactPhone') }}</label>
                        <input v-model="inmateData.emergency_contact_phone" type="text" class="form-control" />
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">{{ t('admissions.wizard.fields.contactRelationship') }}</label>
                        <input v-model="inmateData.emergency_contact_relationship" type="text" class="form-control" />
                      </div>

                      <div class="col-md-12">
                        <label class="form-label">Dirección del Contacto de Emergencia</label>
                        <input
                          v-model="inmateData.emergency_contact_address"
                          type="text"
                          class="form-control"
                          placeholder="Dirección completa del contacto de emergencia"
                        />
                      </div>

                      <!-- Biometric Section -->
                      <div class="col-12">
                        <div class="separator my-5"></div>
                        <h5 class="mb-4">{{ t('admissions.wizard.fields.biometricTitle') }}</h5>
                      </div>

                      <div class="col-12">
                        <div class="alert alert-info">
                          <h6 class="alert-heading">Instrucciones para Registro Biométrico:</h6>
                          <ol class="mb-0">
                            <li>Haga clic en "Iniciar Captura Biométrica"</li>
                            <li>Se descargará un archivo .bat para iniciar el sistema Java</li>
                            <li>Ejecute el archivo descargado para abrir la aplicación de captura</li>
                            <li>Siga las instrucciones para capturar las huellas dactilares</li>
                            <li>Al completar, haga clic en "Verificar Estado"</li>
                          </ol>
                        </div>
                      </div>

                      <div class="col-md-6">
                        <button
                          type="button"
                          @click="startBiometricCapture"
                          class="btn btn-primary w-100"
                          :disabled="!inmateData.first_name || !inmateData.first_surname || !inmateData.identification_number"
                        >
                          <i class="ki-duotone ki-fingerprint-scanning fs-2 me-2">
                            <span class="path1"></span>
                            <span class="path2"></span>
                            <span class="path3"></span>
                          </i>
                          {{ !inmateId ? 'Guardar e Iniciar Captura Biométrica' : 'Iniciar Captura Biométrica' }}
                        </button>
                        <small class="text-muted d-block mt-1" v-if="!inmateData.first_name || !inmateData.first_surname || !inmateData.identification_number">
                          Complete nombre, apellido y documento para continuar
                        </small>
                      </div>

                      <div class="col-md-6">
                        <button
                          type="button"
                          @click="checkBiometricStatus"
                          class="btn btn-secondary w-100"
                          :disabled="!inmateId"
                        >
                          <i class="ki-duotone ki-verify fs-2 me-2">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                          Verificar Estado
                        </button>
                        <small class="text-muted d-block mt-1" v-if="!inmateId">
                          Disponible después de guardar datos
                        </small>
                      </div>

                      <div class="col-12" v-if="biometricData.enrolled">
                        <div class="alert alert-success">
                          <i class="ki-duotone ki-check-circle fs-2 me-2">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                          Registro biométrico completado exitosamente. Se han capturado {{ biometricData.fingerprints.length || 0 }} huellas.
                        </div>
                      </div>

                      <div class="col-12">
                        <div class="form-check">
                          <input
                            v-model="biometricData.skipForNow"
                            class="form-check-input"
                            type="checkbox"
                            id="skipBiometric"
                          />
                          <label class="form-check-label" for="skipBiometric">
                            Posponer registro biométrico para después
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Legal Reception -->
              <div v-show="currentStep === 2" class="tab-pane fade show active">
                <div class="w-100">
                  <div class="pb-10 pb-lg-15">
                    <h2 class="fw-bold d-flex align-items-center text-gray-900">
                      Recepción Legal
                      <span class="ms-1" data-bs-toggle="tooltip" title="Información sobre los casos legales y delitos imputados">
                        <i class="ki-duotone ki-information fs-6">
                          <span class="path1"></span>
                          <span class="path2"></span>
                          <span class="path3"></span>
                        </i>
                      </span>
                    </h2>
                    <div class="text-muted fw-semibold fs-6">
                      Registre los casos legales asociados al interno
                    </div>
                  </div>

                  <!-- Admission Information -->
                  <div class="card mb-4">
                    <div class="card-header">
                      <h5 class="card-title">Información de Admisión</h5>
                    </div>
                    <div class="card-body">
                      <div class="row g-3">
                        <div class="col-md-4">
                          <label class="form-label required">Tipo de Admisión</label>
                          <select v-model="admissionData.admission_type" class="form-select" required>
                            <option value="">Seleccionar tipo</option>
                            <option value="new_admission">Ingreso Nuevo</option>
                            <option value="transfer_in">Traslado desde otro centro</option>
                            <option value="court_return">Retorno de juzgado</option>
                            <option value="hospital_return">Retorno de hospital</option>
                            <option value="recapture">Recaptura después de fuga</option>
                            <option value="revocation_return">Reingreso por revocatoria</option>
                          </select>
                        </div>
                        <div class="col-md-4">
                          <label class="form-label required">Centro Penitenciario</label>
                          <select v-model="admissionData.current_center_id" class="form-select" required>
                            <option value="">Seleccionar centro</option>
                            <option v-for="center in centers" :key="center.id" :value="center.id">
                              {{ center.name }}
                            </option>
                          </select>
                        </div>
                        <div class="col-md-4">
                          <label class="form-label required">Fecha y Hora de Ingreso</label>
                          <input
                            v-model="admissionData.admission_datetime"
                            type="datetime-local"
                            class="form-control" 
                            required
                          />
                        </div>
                        <div class="col-md-4">
                          <label class="form-label required">Número de Orden de Ingreso</label>
                          <input 
                            v-model="admissionData.admission_order_number" 
                            type="text" 
                            class="form-control"
                            placeholder="Ej: ORD-2024-001"
                            required
                          />
                        </div>
                        <div class="col-md-4">
                          <label class="form-label">Número de Documento de Remisión</label>
                          <input 
                            v-model="admissionData.remission_document_number" 
                            type="text" 
                            class="form-control"
                            placeholder="Ej: REM-2024-001"
                          />
                        </div>
                        <div class="col-md-4">
                          <label class="form-label required">Juzgado Remitente</label>
                          <select v-model="admissionData.remitting_court_id" class="form-select" required>
                            <option value="">Seleccionar juzgado</option>
                            <option v-for="court in courts" :key="court.id" :value="court.id">
                              {{ court.name }}
                            </option>
                          </select>
                        </div>
                        <div class="col-md-4">
                          <label class="form-label">¿Tiene Expediente Judicial?</label>
                          <div class="form-check form-switch">
                            <input 
                              v-model="admissionData.has_judicial_file" 
                              class="form-check-input" 
                              type="checkbox" 
                              id="hasJudicialFile"
                            />
                            <label class="form-check-label" for="hasJudicialFile">
                              {{ admissionData.has_judicial_file ? 'Sí' : 'No' }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Add New Legal Profile Button -->
                  <div class="mb-4">
                    <button
                      type="button"
                      @click="addLegalProfile"
                      class="btn btn-primary"
                    >
                      <i class="ki-duotone ki-plus fs-3"></i>
                      Agregar Caso Legal
                    </button>
                    <small class="text-muted ms-3">
                      <i class="fas fa-info-circle"></i>
                      Los perfiles legales son opcionales. Puede agregarlos ahora o posteriormente.
                    </small>
                  </div>

                  <!-- Legal Profile Cards -->
                  <div v-for="(profile, profileIndex) in legalProfiles" :key="profile.id" class="card mb-4 border">
                    <div class="card-header bg-light">
                      <div class="d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">Caso Legal #{{ profileIndex + 1 }}</h6>
                        <button 
                          v-if="legalProfiles.length > 1"
                          type="button"
                          @click="removeLegalProfile(profileIndex)"
                          class="btn btn-sm btn-danger"
                          >
                            <i class="ki-duotone ki-trash fs-5"></i>
                          </button>
                        </div>
                      </div>
                      <div class="card-body">
                        <div class="row g-3">
                          <!-- Case Information -->
                          <div class="col-md-6">
                            <label class="form-label required">Número de Caso</label>
                            <input 
                              v-model="profile.case_number" 
                              type="text" 
                              class="form-control form-control-sm"
                              placeholder="MP-001-2024-12345"
                              required
                            />
                          </div>
                          <div class="col-md-6">
                            <label class="form-label">Expediente Judicial</label>
                            <input 
                              v-model="profile.judicial_file_number" 
                              type="text" 
                              class="form-control form-control-sm"
                              placeholder="EJ-2024-001"
                            />
                          </div>
                          <div class="col-md-6">
                            <label class="form-label required">Juzgado</label>
                            <select v-model="profile.court_id" class="form-select form-select-sm" required>
                              <option value="">Seleccionar</option>
                              <option v-for="court in courts" :key="court.id" :value="court.id">
                                {{ court.name }}
                              </option>
                            </select>
                          </div>
                          <div class="col-md-6">
                            <label class="form-label">Estado Procesal</label>
                            <select v-model="profile.procedural_status_id" class="form-select form-select-sm">
                              <option value="">Seleccionar</option>
                              <option v-for="status in proceduralStatuses" :key="status.id" :value="status.id">
                                {{ status.name }}
                              </option>
                            </select>
                          </div>

                          <!-- Prosecutor Information -->
                          <div class="col-md-6">
                            <label class="form-label">Fiscal</label>
                            <input 
                              v-model="profile.prosecutor_name" 
                              type="text" 
                              class="form-control form-control-sm"
                              placeholder="Nombre del fiscal"
                            />
                          </div>
                          <div class="col-md-6">
                            <label class="form-label">Agencia Fiscal</label>
                            <input 
                              v-model="profile.prosecutor_office" 
                              type="text" 
                              class="form-control form-control-sm"
                              placeholder="MP - Agencia 01"
                            />
                          </div>

                          <!-- Defense Information -->
                          <div class="col-md-4">
                            <label class="form-label">Abogado Defensor</label>
                            <input 
                              v-model="profile.defense_attorney_name" 
                              type="text" 
                              class="form-control form-control-sm"
                              placeholder="Nombre del abogado"
                            />
                          </div>
                          <div class="col-md-4">
                            <label class="form-label">Teléfono Defensor</label>
                            <input 
                              v-model="profile.defense_attorney_phone" 
                              type="text" 
                              class="form-control form-control-sm"
                              placeholder="0000-0000"
                            />
                          </div>
                          <div class="col-md-4">
                            <label class="form-label">Tipo de Defensa</label>
                            <select v-model="profile.defense_type" class="form-select form-select-sm">
                              <option value="public">Pública</option>
                              <option value="private">Privada</option>
                              <option value="self_represented">Auto-representado</option>
                            </select>
                          </div>

                          <!-- Preventive Detention -->
                          <div class="col-md-6">
                            <div class="form-check form-switch">
                              <input 
                                v-model="profile.in_preventive_detention" 
                                class="form-check-input" 
                                type="checkbox"
                                :id="'preventive_' + profile.id"
                              />
                              <label class="form-check-label" :for="'preventive_' + profile.id">
                                Prisión Preventiva
                              </label>
                            </div>
                          </div>
                          <div v-if="profile.in_preventive_detention" class="col-md-6">
                            <label class="form-label">Fecha Inicio Prisión Preventiva</label>
                            <input 
                              v-model="profile.preventive_detention_start" 
                              type="date" 
                              class="form-control form-control-sm"
                            />
                          </div>

                          <!-- Crimes Section -->
                          <div class="col-12">
                            <div class="d-flex justify-content-between align-items-center mt-3 mb-2">
                              <label class="form-label mb-0">Delitos Imputados</label>
                              <button 
                                type="button"
                                @click="addCrimeToProfile(profileIndex)"
                                class="btn btn-sm btn-secondary"
                              >
                                <i class="ki-duotone ki-plus fs-6"></i>
                                Agregar Delito
                              </button>
                            </div>
                            
                            <div v-if="profile.crimes.length === 0" class="alert alert-warning py-2">
                              No se han registrado delitos. Haga clic en "Agregar Delito".
                            </div>
                            
                            <div v-else class="table-responsive">
                              <table class="table table-sm table-bordered">
                                <thead>
                                  <tr>
                                    <th>Delito</th>
                                    <th>Descripción</th>
                                    <th>Fecha</th>
                                    <th>Lugar</th>
                                    <th width="50">Acción</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="(crime, crimeIndex) in profile.crimes" :key="crimeIndex">
                                    <td>
                                      <select v-model="crime.crime_id" class="form-select form-select-sm">
                                        <option value="">Seleccionar</option>
                                        <option v-for="c in crimes" :key="c.id" :value="c.id">
                                          {{ c.name }}
                                        </option>
                                      </select>
                                    </td>
                                    <td>
                                      <input 
                                        v-model="crime.crime_description" 
                                        type="text" 
                                        class="form-control form-control-sm"
                                        placeholder="Detalles del delito"
                                      />
                                    </td>
                                    <td>
                                      <input 
                                        v-model="crime.crime_date" 
                                        type="date" 
                                        class="form-control form-control-sm"
                                      />
                                    </td>
                                    <td>
                                      <input 
                                        v-model="crime.crime_location" 
                                        type="text" 
                                        class="form-control form-control-sm"
                                        placeholder="Ubicación"
                                      />
                                    </td>
                                    <td>
                                      <button 
                                        type="button"
                                        @click="removeCrimeFromProfile(profileIndex, crimeIndex)"
                                        class="btn btn-sm btn-danger"
                                      >
                                        <i class="ki-duotone ki-trash fs-6"></i>
                                      </button>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Document Verification -->
                    <div class="separator my-5"></div>
                    <h5 class="mb-4">Verificación de Documentos</h5>
                    <div class="row g-3">
                          <div class="col-md-4">
                            <div class="form-check">
                              <input 
                                v-model="verifications.legal_documents" 
                                class="form-check-input" 
                                type="checkbox" 
                                id="legalDocs"
                              />
                              <label class="form-check-label" for="legalDocs">
                                Documentos legales verificados
                              </label>
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="form-check">
                              <input 
                                v-model="verifications.identity" 
                                class="form-check-input" 
                                type="checkbox" 
                                id="identity"
                              />
                              <label class="form-check-label" for="identity">
                                Identidad verificada
                              </label>
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="form-check">
                              <input 
                                v-model="verifications.court_order" 
                                class="form-check-input" 
                                type="checkbox" 
                                id="courtOrder"
                              />
                              <label class="form-check-label" for="courtOrder">
                                Orden judicial válida
                              </label>
                            </div>
                          </div>
                        </div>
                  </div>
                </div>
              </div>


              <!-- Step 3: Security Assessment -->
              <div v-show="currentStep === 3" class="tab-pane fade show active">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Evaluación de Seguridad y Riesgos</h3>
                  </div>
                  <div class="card-body">
                    <div class="row g-5">
                      <!-- Risk Factors -->
                      <div class="col-12">
                        <h5 class="mb-4">Factores de Riesgo (0-10)</h5>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label">Riesgo de Violencia</label>
                        <input 
                          v-model.number="riskAssessment.violence_risk_score" 
                          type="range" 
                          class="form-range" 
                          min="0" 
                          max="10"
                        />
                        <div class="text-center">{{ riskAssessment.violence_risk_score }}</div>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label">Riesgo de Fuga</label>
                        <input 
                          v-model.number="riskAssessment.escape_risk_score" 
                          type="range" 
                          class="form-range" 
                          min="0" 
                          max="10"
                        />
                        <div class="text-center">{{ riskAssessment.escape_risk_score }}</div>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label">Riesgo de Pandillas</label>
                        <input 
                          v-model.number="riskAssessment.gang_risk_score" 
                          type="range" 
                          class="form-range" 
                          min="0" 
                          max="10"
                        />
                        <div class="text-center">{{ riskAssessment.gang_risk_score }}</div>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label">Riesgo de Autolesión</label>
                        <input 
                          v-model.number="riskAssessment.self_harm_risk_score" 
                          type="range" 
                          class="form-range" 
                          min="0" 
                          max="10"
                        />
                        <div class="text-center">{{ riskAssessment.self_harm_risk_score }}</div>
                      </div>
                      
                      <div class="col-md-6">
                        <label class="form-label">Nivel de Vulnerabilidad</label>
                        <input 
                          v-model.number="riskAssessment.vulnerability_score" 
                          type="range" 
                          class="form-range" 
                          min="0" 
                          max="10"
                        />
                        <div class="text-center">{{ riskAssessment.vulnerability_score }}</div>
                        <small class="text-muted">Evalúa qué tan vulnerable es el interno a ser víctima de otros</small>
                      </div>

                      <!-- Gang Affiliation -->
                      <div class="col-12">
                        <div class="separator my-5"></div>
                        <h5 class="mb-4">Afiliación a Pandillas</h5>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label required">Estado de Afiliación</label>
                        <select v-model="inmateData.gang_affiliation_status" class="form-select" :required="currentStep === 3">
                          <option value="none">Sin afiliación</option>
                          <option value="suspected_ms13">Sospechoso MS-13</option>
                          <option value="confirmed_ms13">Confirmado MS-13</option>
                          <option value="suspected_barrio18">Sospechoso Barrio 18</option>
                          <option value="confirmed_barrio18">Confirmado Barrio 18</option>
                          <option value="other_gang">Otra pandilla</option>
                          <option value="gang_leader">Líder de pandilla</option>
                          <option value="protected_witness">Testigo protegido</option>
                        </select>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label">Notas de Inteligencia</label>
                        <textarea 
                          v-model="inmateData.gang_intelligence_notes" 
                          class="form-control" 
                          rows="3"
                        ></textarea>
                      </div>

                      <!-- Special Conditions -->
                      <div class="col-12">
                        <div class="separator my-5"></div>
                        <h5 class="mb-4">Condiciones Especiales</h5>
                      </div>

                      <div class="col-md-4">
                        <div class="form-check">
                          <input 
                            v-model="riskAssessment.is_protected_witness" 
                            class="form-check-input" 
                            type="checkbox" 
                            id="protectedWitness"
                          />
                          <label class="form-check-label" for="protectedWitness">
                            Testigo Protegido
                          </label>
                        </div>
                      </div>

                      <div class="col-md-4">
                        <div class="form-check">
                          <input 
                            v-model="riskAssessment.is_ex_law_enforcement" 
                            class="form-check-input" 
                            type="checkbox" 
                            id="exLaw"
                          />
                          <label class="form-check-label" for="exLaw">
                            Ex-Policía/Funcionario
                          </label>
                        </div>
                      </div>

                      <div class="col-md-4">
                        <div class="form-check">
                          <input 
                            v-model="riskAssessment.is_high_profile" 
                            class="form-check-input" 
                            type="checkbox" 
                            id="highProfile"
                          />
                          <label class="form-check-label" for="highProfile">
                            Caso de Alto Perfil
                          </label>
                        </div>
                      </div>
                      
                      <div class="col-md-4">
                        <div class="form-check">
                          <input 
                            v-model="riskAssessment.has_media_attention" 
                            class="form-check-input" 
                            type="checkbox" 
                            id="mediaAttention"
                          />
                          <label class="form-check-label" for="mediaAttention">
                            Atención Mediática
                          </label>
                        </div>
                      </div>
                      
                      <div class="col-md-4">
                        <div class="form-check">
                          <input 
                            v-model="riskAssessment.requires_isolation" 
                            class="form-check-input" 
                            type="checkbox" 
                            id="requiresIsolation"
                          />
                          <label class="form-check-label" for="requiresIsolation">
                            Requiere Aislamiento
                          </label>
                        </div>
                      </div>
                      
                      <div class="col-md-4">
                        <div class="form-check">
                          <input 
                            v-model="riskAssessment.requires_special_monitoring" 
                            class="form-check-input" 
                            type="checkbox" 
                            id="specialMonitoring"
                          />
                          <label class="form-check-label" for="specialMonitoring">
                            Requiere Monitoreo Especial
                          </label>
                        </div>
                      </div>

                      <!-- Security Level Recommendation -->
                      <div class="col-12">
                        <div class="separator my-5"></div>
                        <h5 class="mb-4">Recomendación de Seguridad</h5>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label required">Nivel de Seguridad Recomendado</label>
                        <select v-model="riskAssessment.recommended_security_level" class="form-select" :required="currentStep === 3">
                          <option value="minimum">Mínima</option>
                          <option value="medium">Media</option>
                          <option value="maximum">Máxima</option>
                          <option value="super_maximum">Súper Máxima</option>
                        </select>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label">Recomendaciones Especiales</label>
                        <textarea 
                          v-model="riskAssessment.special_recommendations" 
                          class="form-control" 
                          rows="3"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 4: Physical Characteristics -->
              <div v-show="currentStep === 4" class="tab-pane fade show active">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Características Físicas y Fotografías</h3>
                  </div>
                  <div class="card-body">
                    <div class="row g-5">
                      <!-- Physical Measurements -->
                      <div class="col-md-3">
                        <label class="form-label">Altura (cm)</label>
                        <input 
                          v-model.number="physicalProfile.height" 
                          type="number" 
                          class="form-control" 
                          min="100" 
                          max="250"
                        />
                      </div>

                      <div class="col-md-3">
                        <label class="form-label">Peso (kg)</label>
                        <input 
                          v-model.number="physicalProfile.weight" 
                          type="number" 
                          class="form-control" 
                          min="30" 
                          max="200"
                        />
                      </div>

                      <div class="col-md-3">
                        <label class="form-label">Complexión</label>
                        <select v-model="physicalProfile.build_type" class="form-select">
                          <option value="">Seleccionar</option>
                          <option value="delgado">Delgado</option>
                          <option value="normal">Normal</option>
                          <option value="robusto">Robusto</option>
                          <option value="atletico">Atlético</option>
                          <option value="obeso">Obeso</option>
                        </select>
                      </div>

                      <div class="col-md-3">
                        <label class="form-label">Tipo de Sangre</label>
                        <select v-model="physicalProfile.blood_type_id" class="form-select">
                          <option value="">Seleccionar</option>
                          <option v-for="type in bloodTypes" :key="type.id" :value="type.id">
                            {{ type.name }}
                          </option>
                        </select>
                      </div>

                      <!-- Additional Physical Characteristics -->
                      <div class="col-md-3">
                        <label class="form-label">Color de Piel</label>
                        <select v-model="physicalProfile.skin_color" class="form-select">
                          <option value="">Seleccionar</option>
                          <option value="blanca">Blanca</option>
                          <option value="morena_clara">Morena Clara</option>
                          <option value="morena">Morena</option>
                          <option value="morena_oscura">Morena Oscura</option>
                          <option value="negra">Negra</option>
                        </select>
                      </div>

                      <div class="col-md-3">
                        <label class="form-label">Color de Ojos</label>
                        <select v-model="physicalProfile.eye_color" class="form-select">
                          <option value="">Seleccionar</option>
                          <option value="negros">Negros</option>
                          <option value="cafe_oscuro">Café Oscuro</option>
                          <option value="cafe">Café</option>
                          <option value="cafe_claro">Café Claro</option>
                          <option value="miel">Miel</option>
                          <option value="verdes">Verdes</option>
                          <option value="azules">Azules</option>
                          <option value="grises">Grises</option>
                        </select>
                      </div>

                      <div class="col-md-3">
                        <label class="form-label">Color de Cabello</label>
                        <select v-model="physicalProfile.hair_color" class="form-select">
                          <option value="">Seleccionar</option>
                          <option value="negro">Negro</option>
                          <option value="cafe_oscuro">Café Oscuro</option>
                          <option value="cafe">Café</option>
                          <option value="cafe_claro">Café Claro</option>
                          <option value="rubio">Rubio</option>
                          <option value="pelirrojo">Pelirrojo</option>
                          <option value="canoso">Canoso</option>
                          <option value="calvo">Calvo</option>
                        </select>
                      </div>

                      <div class="col-md-3">
                        <label class="form-label">Tipo de Cabello</label>
                        <select v-model="physicalProfile.hair_type" class="form-select">
                          <option value="">Seleccionar</option>
                          <option value="lacio">Lacio</option>
                          <option value="ondulado">Ondulado</option>
                          <option value="rizado">Rizado</option>
                          <option value="crespo">Crespo</option>
                          <option value="calvo">Calvo</option>
                        </select>
                      </div>

                      <!-- Distinguishing Marks -->
                      <div class="col-12">
                        <div class="separator my-5"></div>
                        <h5 class="mb-4">Marcas Distintivas</h5>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label">Tatuajes</label>
                        <textarea 
                          v-model="physicalProfile.tattoos_description" 
                          class="form-control" 
                          rows="3"
                          placeholder="Descripción y ubicación de tatuajes"
                        ></textarea>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label">Cicatrices</label>
                        <textarea 
                          v-model="physicalProfile.scars_description" 
                          class="form-control" 
                          rows="3"
                          placeholder="Descripción y ubicación de cicatrices"
                        ></textarea>
                      </div>

                      <!-- Photo Capture -->
                      <div class="col-12">
                        <div class="separator my-5"></div>
                        <h5 class="mb-4">Captura de Fotografías</h5>
                        <div class="row g-3">
                          <div class="col-md-3">
                            <div class="card">
                              <div class="card-body text-center">
                                <i class="ki-duotone ki-user fs-3x mb-3">
                                  <span class="path1"></span>
                                  <span class="path2"></span>
                                </i>
                                <h6>Frontal</h6>
                                <button 
                                  type="button" 
                                  @click="capturePhoto('frontal')"
                                  class="btn btn-sm btn-primary mt-2"
                                >
                                  Capturar
                                </button>
                                <span v-if="photos.frontal" class="badge badge-success mt-2">
                                  <i class="ki-duotone ki-check"></i>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div class="col-md-3">
                            <div class="card">
                              <div class="card-body text-center">
                                <i class="ki-duotone ki-profile-user fs-3x mb-3">
                                  <span class="path1"></span>
                                  <span class="path2"></span>
                                  <span class="path3"></span>
                                  <span class="path4"></span>
                                </i>
                                <h6>Perfil Izquierdo</h6>
                                <button 
                                  type="button" 
                                  @click="capturePhoto('profile_left')"
                                  class="btn btn-sm btn-primary mt-2"
                                >
                                  Capturar
                                </button>
                                <span v-if="photos.profile_left" class="badge badge-success mt-2">
                                  <i class="ki-duotone ki-check"></i>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div class="col-md-3">
                            <div class="card">
                              <div class="card-body text-center">
                                <i class="ki-duotone ki-profile-user fs-3x mb-3">
                                  <span class="path1"></span>
                                  <span class="path2"></span>
                                  <span class="path3"></span>
                                  <span class="path4"></span>
                                </i>
                                <h6>Perfil Derecho</h6>
                                <button 
                                  type="button" 
                                  @click="capturePhoto('profile_right')"
                                  class="btn btn-sm btn-primary mt-2"
                                >
                                  Capturar
                                </button>
                                <span v-if="photos.profile_right" class="badge badge-success mt-2">
                                  <i class="ki-duotone ki-check"></i>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div class="col-md-3">
                            <div class="card">
                              <div class="card-body text-center">
                                <i class="ki-duotone ki-user-square fs-3x mb-3">
                                  <span class="path1"></span>
                                  <span class="path2"></span>
                                </i>
                                <h6>Cuerpo Completo</h6>
                                <button 
                                  type="button" 
                                  @click="capturePhoto('full_body')"
                                  class="btn btn-sm btn-primary mt-2"
                                >
                                  Capturar
                                </button>
                                <span v-if="photos.full_body" class="badge badge-success mt-2">
                                  <i class="ki-duotone ki-check"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 5: Belongings Inventory -->
              <div v-show="currentStep === 5" class="tab-pane fade show active">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Inventario de Pertenencias</h3>
                  </div>
                  <div class="card-body">
                    <div class="row g-5">
                      <!-- Add Item Button -->
                      <div class="col-12">
                        <button 
                          type="button" 
                          @click="addBelongingItem"
                          class="btn btn-primary"
                        >
                          <i class="ki-duotone ki-plus fs-2"></i>
                          Agregar Artículo
                        </button>
                      </div>

                      <!-- Items List -->
                      <div class="col-12">
                        <div v-if="belongings.length === 0" class="alert alert-info">
                          <i class="ki-duotone ki-information fs-2 me-2">
                            <span class="path1"></span>
                            <span class="path2"></span>
                            <span class="path3"></span>
                          </i>
                          No se han registrado pertenencias. Haga clic en "Agregar Artículo" para comenzar.
                        </div>

                        <div v-else class="table-responsive">
                          <table class="table table-bordered">
                            <thead>
                              <tr>
                                <th>Tipo</th>
                                <th>Descripción</th>
                                <th>Cantidad</th>
                                <th>Valor (Q)</th>
                                <th>Ubicación</th>
                                <th>Condición</th>
                                <th>Notas</th>
                                <th>Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(item, index) in belongings" :key="item.id">
                                <td>
                                  <select v-model="item.item_type" class="form-select form-select-sm">
                                    <option value="">Seleccionar</option>
                                    <option value="clothing">Ropa</option>
                                    <option value="jewelry">Joyería</option>
                                    <option value="money">Dinero</option>
                                    <option value="documents">Documentos</option>
                                    <option value="electronics">Electrónicos</option>
                                    <option value="personal">Personal</option>
                                    <option value="other">Otro</option>
                                  </select>
                                </td>
                                <td>
                                  <input 
                                    v-model="item.description" 
                                    type="text" 
                                    class="form-control form-control-sm"
                                    placeholder="Descripción del artículo"
                                  />
                                </td>
                                <td>
                                  <input 
                                    v-model.number="item.quantity" 
                                    type="number" 
                                    class="form-control form-control-sm"
                                    min="1"
                                  />
                                </td>
                                <td>
                                  <input 
                                    v-model.number="item.value" 
                                    type="number" 
                                    class="form-control form-control-sm"
                                    min="0"
                                    step="0.01"
                                  />
                                </td>
                                <td>
                                  <select v-model="item.storage_location" class="form-select form-select-sm">
                                    <option value="">Seleccionar</option>
                                    <option value="bodega">Bodega</option>
                                    <option value="valores">Custodia de Valores</option>
                                    <option value="evidencia">Evidencia</option>
                                    <option value="devuelto">Devuelto</option>
                                  </select>
                                </td>
                                <td>
                                  <select v-model="item.condition" class="form-select form-select-sm">
                                    <option value="">Seleccionar</option>
                                    <option value="bueno">Bueno</option>
                                    <option value="regular">Regular</option>
                                    <option value="malo">Malo</option>
                                    <option value="dañado">Dañado</option>
                                  </select>
                                </td>
                                <td>
                                  <input 
                                    v-model="item.notes" 
                                    type="text" 
                                    class="form-control form-control-sm"
                                    placeholder="Observaciones"
                                  />
                                </td>
                                <td>
                                  <button 
                                    type="button"
                                    @click="removeBelongingItem(index)"
                                    class="btn btn-sm btn-danger"
                                  >
                                    <i class="ki-duotone ki-trash fs-5"></i>
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                            <tfoot>
                              <tr>
                                <th colspan="3">Total</th>
                                <th>{{ calculateTotalValue() }}</th>
                                <th colspan="4"></th>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>

                      <!-- Summary -->
                      <div class="col-12">
                        <div class="alert alert-warning">
                          <h5>Importante:</h5>
                          <ul class="mb-0">
                            <li>Todos los artículos deben ser documentados y fotografiados</li>
                            <li>El interno debe firmar el inventario</li>
                            <li>Se debe entregar copia del inventario al interno</li>
                            <li>Los valores y documentos importantes deben ir a custodia especial</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 6: Medical Evaluation -->
              <div v-show="currentStep === 6" class="tab-pane fade show active">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Evaluación Médica Inicial</h3>
                  </div>
                  <div class="card-body">
                    <div class="row g-5">
                      <!-- Vital Signs -->
                      <div class="col-12">
                        <h5 class="mb-4">Signos Vitales</h5>
                      </div>
                      
                      <div class="col-md-3">
                        <label class="form-label">Presión Arterial</label>
                        <input 
                          v-model="medicalEvaluation.vital_signs.blood_pressure" 
                          type="text" 
                          class="form-control"
                          placeholder="120/80"
                        />
                      </div>
                      
                      <div class="col-md-3">
                        <label class="form-label">Frecuencia Cardíaca</label>
                        <input 
                          v-model="medicalEvaluation.vital_signs.heart_rate" 
                          type="text" 
                          class="form-control"
                          placeholder="70 bpm"
                        />
                      </div>
                      
                      <div class="col-md-3">
                        <label class="form-label">Temperatura</label>
                        <input 
                          v-model="medicalEvaluation.vital_signs.temperature" 
                          type="text" 
                          class="form-control"
                          placeholder="36.5°C"
                        />
                      </div>
                      
                      <div class="col-md-3">
                        <label class="form-label">Frecuencia Respiratoria</label>
                        <input 
                          v-model="medicalEvaluation.vital_signs.respiratory_rate" 
                          type="text" 
                          class="form-control"
                          placeholder="16 rpm"
                        />
                      </div>

                      <!-- Medical Conditions -->
                      <div class="col-12">
                        <div class="separator my-5"></div>
                        <h5 class="mb-4">Condiciones Médicas</h5>
                      </div>

                      <div class="col-md-6">
                        <div class="form-check form-switch mb-3">
                          <input 
                            v-model="medicalEvaluation.has_chronic_diseases" 
                            class="form-check-input" 
                            type="checkbox" 
                            id="hasChronicDiseases"
                          />
                          <label class="form-check-label" for="hasChronicDiseases">
                            ¿Tiene enfermedades crónicas?
                          </label>
                        </div>
                        <textarea 
                          v-if="medicalEvaluation.has_chronic_diseases"
                          v-model="medicalEvaluation.chronic_diseases" 
                          class="form-control"
                          rows="2"
                          placeholder="Describa las enfermedades crónicas"
                        ></textarea>
                      </div>

                      <div class="col-md-6">
                        <div class="form-check form-switch mb-3">
                          <input 
                            v-model="medicalEvaluation.has_medications" 
                            class="form-check-input" 
                            type="checkbox" 
                            id="hasMedications"
                          />
                          <label class="form-check-label" for="hasMedications">
                            ¿Toma medicamentos actualmente?
                          </label>
                        </div>
                        <textarea 
                          v-if="medicalEvaluation.has_medications"
                          v-model="medicalEvaluation.current_medications" 
                          class="form-control"
                          rows="2"
                          placeholder="Liste los medicamentos actuales"
                        ></textarea>
                      </div>

                      <div class="col-md-6">
                        <div class="form-check form-switch mb-3">
                          <input 
                            v-model="medicalEvaluation.has_allergies" 
                            class="form-check-input" 
                            type="checkbox" 
                            id="hasAllergies"
                          />
                          <label class="form-check-label" for="hasAllergies">
                            ¿Tiene alergias conocidas?
                          </label>
                        </div>
                        <textarea 
                          v-if="medicalEvaluation.has_allergies"
                          v-model="medicalEvaluation.allergies" 
                          class="form-control"
                          rows="2"
                          placeholder="Describa las alergias"
                        ></textarea>
                      </div>

                      <div class="col-md-6">
                        <div class="form-check form-switch mb-3">
                          <input 
                            v-model="medicalEvaluation.has_disabilities" 
                            class="form-check-input" 
                            type="checkbox" 
                            id="hasDisabilities"
                          />
                          <label class="form-check-label" for="hasDisabilities">
                            ¿Tiene alguna discapacidad?
                          </label>
                        </div>
                        <textarea 
                          v-if="medicalEvaluation.has_disabilities"
                          v-model="medicalEvaluation.disabilities" 
                          class="form-control"
                          rows="2"
                          placeholder="Describa las discapacidades"
                        ></textarea>
                      </div>

                      <!-- Mental Health -->
                      <div class="col-12">
                        <div class="separator my-5"></div>
                        <h5 class="mb-4">Salud Mental</h5>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label">Estado de Salud Mental</label>
                        <select v-model="medicalEvaluation.mental_health_status" class="form-select">
                          <option value="stable">Estable</option>
                          <option value="anxious">Ansioso</option>
                          <option value="depressed">Deprimido</option>
                          <option value="aggressive">Agresivo</option>
                          <option value="confused">Confundido</option>
                          <option value="psychotic">Psicótico</option>
                          <option value="suicidal">Riesgo Suicida</option>
                        </select>
                      </div>

                      <div class="col-md-6">
                        <div class="form-check form-switch">
                          <input 
                            v-model="medicalEvaluation.requires_immediate_attention" 
                            class="form-check-input" 
                            type="checkbox" 
                            id="requiresAttention"
                          />
                          <label class="form-check-label text-danger fw-bold" for="requiresAttention">
                            REQUIERE ATENCIÓN MÉDICA INMEDIATA
                          </label>
                        </div>
                      </div>

                      <!-- Medical Notes -->
                      <div class="col-12">
                        <label class="form-label">Observaciones Médicas</label>
                        <textarea 
                          v-model="medicalEvaluation.medical_notes" 
                          class="form-control"
                          rows="3"
                          placeholder="Ingrese observaciones adicionales sobre el estado de salud del interno"
                        ></textarea>
                      </div>

                      <!-- Warning -->
                      <div v-if="medicalEvaluation.requires_immediate_attention" class="col-12">
                        <div class="alert alert-danger">
                          <i class="ki-duotone ki-shield-cross fs-2x me-3">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                          <strong>¡ATENCIÓN!</strong> Este interno requiere atención médica inmediata. 
                          Notifique al personal médico de inmediato.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 7: Final Assignment -->
              <div v-show="currentStep === 7" class="tab-pane fade show active">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Asignación Final</h3>
                  </div>
                  <div class="card-body">
                    <div class="row g-5">
                  <div class="col-md-6">
                    <label class="form-label required">Centro Penitenciario</label>
                    <select 
                      v-model="finalAssignment.center_id" 
                      class="form-select"
                      :required="currentStep === 7"
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
                  </div>

                  <div class="col-md-6">
                    <label class="form-label required">Sector de Asignación</label>
                    <select 
                      v-model="finalAssignment.sector_id" 
                      class="form-select"
                      :required="currentStep === 7"
                      :disabled="!finalAssignment.center_id"
                    >
                      <option value="">{{ finalAssignment.center_id ? 'Seleccionar sector' : 'Primero seleccione un centro' }}</option>
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
                    <label class="form-label required">Número de Celda</label>
                    <input 
                      type="text" 
                      v-model="finalAssignment.cell_number" 
                      class="form-control" 
                      placeholder="Ej: A-101"
                      :required="currentStep === 7"
                    />
                  </div>

                  <div class="col-12">
                    <label class="form-label">Notas Finales</label>
                    <textarea 
                      v-model="finalAssignment.notes" 
                      class="form-control" 
                      rows="3"
                      placeholder="Observaciones adicionales sobre el proceso de admisión..."
                    ></textarea>
                  </div>

                  <div class="col-12">
                    <div class="alert alert-info">
                      <h5 class="alert-heading">Resumen del Proceso</h5>
                      <p>Se completará el registro del interno con los siguientes datos:</p>
                      <ul>
                        <li><strong>Documento:</strong> {{ inmateData.identification_number || 'No ingresado' }}</li>
                        <li><strong>Nombre:</strong> {{ inmateData.first_name }} {{ inmateData.first_surname }}</li>
                        <li><strong>Nivel de Seguridad:</strong> {{ riskAssessment.recommended_security_level }}</li>
                        <li><strong>Centro:</strong> {{ centers.find(c => c.id === finalAssignment.center_id)?.name || 'No asignado' }}</li>
                        <li><strong>Sector:</strong> {{ filteredSectors.find(s => s.id === finalAssignment.sector_id)?.name || 'No asignado' }}</li>
                        <li><strong>Celda:</strong> {{ finalAssignment.cell_number || 'No asignada' }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
                  </div>
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="d-flex justify-content-between mt-5">
                <button 
                  v-if="currentStep > 1"
                  type="button" 
                  @click="previousStep"
                  class="btn btn-light-primary"
                >
                  <i class="ki-duotone ki-arrow-left fs-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  Anterior
                </button>
                <div v-else></div>

                <button 
                  v-if="currentStep < 7"
                  type="button"
                  @click="handleStepSubmit" 
                  class="btn btn-primary"
                >
                  Siguiente
                  <i class="ki-duotone ki-arrow-right fs-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </button>

                <button 
                  v-else
                  type="button"
                  @click="completeAdmission"
                  class="btn btn-success"
                >
                  <i class="ki-duotone ki-check fs-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  Completar Admisión
                </button>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

// State
const currentStep = ref(1);
const duplicateCheckResult = ref<any>(null);
const duplicateConfirmed = ref(false);

// Form Data
const admissionData = ref({
  admission_type: 'new_admission', // Default to new admission
  admission_datetime: new Date().toISOString().slice(0, 16),
  admission_order_number: '',
  remission_document_number: '',
  remitting_court_id: null,
  has_judicial_file: false,
  current_center_id: null // Selected detention center
});

// Legal profiles (multiple cases)
const legalProfiles = ref<Array<{
  id: number;
  case_number: string;
  judicial_file_number: string;
  court_id: number | null;
  prosecutor_name: string;
  prosecutor_office: string;
  defense_attorney_name: string;
  defense_attorney_phone: string;
  defense_type: 'public' | 'private' | 'self_represented';
  procedural_stage: string;
  procedural_status_id: number | null;
  in_preventive_detention: boolean;
  preventive_detention_start: string;
  crimes: Array<{
    crime_id: number | null;
    crime_description: string;
    crime_date: string;
    crime_location: string;
  }>;
}>>([]);

const inmateData = ref({
  document_type_id: null,
  identification_number: '',
  first_name: '',
  second_name: '',
  third_name: '',
  first_surname: '',
  second_surname: '',
  married_surname: '',
  alias: '',
  birth_date: '',
  gender: '',
  civil_status_id: null,
  nationality_id: null,
  ethnic_group_id: null,
  birth_country_id: null, // País de nacimiento
  birth_department_id: null, // Departamento de nacimiento
  birth_municipality_id: null, // Municipio de nacimiento
  // Nuevos campos demográficos
  sexual_orientation_id: null,
  gender_identity_id: null,
  religion_id: null,
  academic_degree_id: null,
  profession: '',
  languages: '',
  // Información de contacto
  address: '',
  phone: '',
  email: '',
  // Contacto de emergencia ampliado
  emergency_contact_name: '',
  emergency_contact_phone: '',
  emergency_contact_relationship: '',
  emergency_contact_address: '',
  gang_affiliation_status: 'none',
  gang_intelligence_notes: ''
});

const verifications = ref({
  legal_documents: false,
  identity: false,
  court_order: false
});

const biometricData = ref({
  enrolled: false,
  fingerprints: [],
  facial_template: null,
  skipForNow: false
});

const riskAssessment = ref({
  violence_risk_score: 0,
  escape_risk_score: 0,
  gang_risk_score: 0,
  self_harm_risk_score: 0,
  vulnerability_score: 0, // Added vulnerability score
  is_protected_witness: false,
  is_ex_law_enforcement: false,
  is_high_profile: false,
  has_media_attention: false,
  recommended_security_level: 'medium',
  requires_isolation: false,
  requires_special_monitoring: false,
  special_recommendations: ''
});

const physicalProfile = ref({
  height: null,
  weight: null,
  build_type: '',
  blood_type_id: null,
  skin_color: '',
  eye_color: '',
  hair_color: '',
  hair_type: '',
  tattoos_description: '',
  scars_description: ''
});

const photos = ref({
  frontal: false,
  profile_left: false,
  profile_right: false,
  full_body: false
});

const belongings = ref<Array<{
  id: number;
  item_type: string;
  description: string;
  quantity: number;
  value: number;
  storage_location: string;
  condition: string;
  notes: string;
}>>([]);

const medicalEvaluation = ref({
  has_chronic_diseases: false,
  chronic_diseases: '',
  has_medications: false,
  current_medications: '',
  has_allergies: false,
  allergies: '',
  has_disabilities: false,
  disabilities: '',
  mental_health_status: 'stable',
  requires_immediate_attention: false,
  medical_notes: '',
  vital_signs: {
    blood_pressure: '',
    heart_rate: '',
    temperature: '',
    respiratory_rate: ''
  }
});

const finalAssignment = ref({
  center_id: null,
  sector_id: null,
  cell_number: '',
  notes: ''
});

// Catalogs
const courts = ref([]);
const documentTypes = ref([]);
const civilStatuses = ref([]);
const nationalities = ref([]);
const ethnicGroups = ref([]);
const bloodTypes = ref([]);
const sectors = ref([]);
const centers = ref([]);
const municipalities = ref([]);
const countries = ref([]);
const birthDepartments = ref([]);
const birthMunicipalities = ref([]);
const crimes = ref([]);
const proceduralStatuses = ref([]);

// Computed
const filteredSectors = computed(() => {
  if (!finalAssignment.value.center_id) {
    return [];
  }
  // Filter sectors by center_id if they have that field
  // Otherwise return all sectors (for backward compatibility)
  return sectors.value.filter(sector => {
    if (sector.center_id) {
      return sector.center_id === finalAssignment.value.center_id;
    }
    // If sectors don't have center_id, show all
    return true;
  });
});

// Watchers
// Sync the center from step 1 to step 7
watch(() => admissionData.value.current_center_id, (newValue) => {
  if (newValue && !finalAssignment.value.center_id) {
    finalAssignment.value.center_id = newValue;
  }
});

// When reaching step 7, ensure the center is set from step 1
watch(currentStep, (newStep) => {
  if (newStep === 7 && admissionData.value.current_center_id) {
    finalAssignment.value.center_id = admissionData.value.current_center_id;
  }
});

// Methods
const onCenterChange = () => {
  // Reset sector and cell when center changes
  finalAssignment.value.sector_id = null;
  finalAssignment.value.cell_number = '';
};
const handleStepSubmit = async () => {
  // Validate current step
  if (!(await validateCurrentStep())) {
    return;
  }

  // Save data for current step
  let success = true;
  
  switch(currentStep.value) {
    case 1: // Identification (now first)
      // We don't save anything in step 1, just validate
      // Data will be saved when starting admission in step 2
      break;
    case 2: // Legal Reception (now second)
      if (!inmateId.value) {
        success = await startAdmission();
      }
      break;
    case 3: // Security Assessment
      success = await saveSecurityAssessment();
      break;
    case 4: // Physical Characteristics
      success = await savePhysicalCharacteristics();
      break;
    case 5: // Belongings
      success = await saveBelongings();
      break;
    case 6: // Medical Evaluation
      success = await saveMedicalEvaluation();
      // Medical evaluation can be optional during admission
      // It can be completed later by medical staff
      if (!success) {
        const result = await Swal.fire({
          title: 'Evaluación Médica Pendiente',
          text: 'La evaluación médica no se pudo guardar. ¿Desea continuar y completarla más tarde?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí, continuar',
          cancelButtonText: 'No, reintentar'
        });
        success = result.isConfirmed;
      }
      break;
  }

  if (success && currentStep.value < 7) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const validateCurrentStep = async () => {
  switch(currentStep.value) {
    case 1: // Identification (now first)
      if (!inmateData.value.identification_number || !inmateData.value.first_name || !inmateData.value.first_surname) {
        Swal.fire('Error', 'Debe completar los datos de identificación (documento, nombre y apellido)', 'error');
        return false;
      }
      if (!inmateData.value.birth_date) {
        Swal.fire('Error', 'Debe ingresar la fecha de nacimiento', 'error');
        return false;
      }
      if (!inmateData.value.gender) {
        Swal.fire('Error', 'Debe seleccionar el género', 'error');
        return false;
      }
      // Check biometric enrollment - now optional
      if (!biometricData.value.enrolled && !biometricData.value.skipForNow) {
        const result = await Swal.fire({
          title: 'Registro Biométrico Pendiente',
          html: `
            <div class="text-start">
              <p>El registro biométrico no se ha completado.</p>
              <p class="mt-3">¿Desea continuar sin el registro biométrico?</p>
              <small class="text-muted">El registro se puede completar posteriormente.</small>
            </div>
          `,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Continuar sin biometría',
          cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
          biometricData.value.skipForNow = true;
        } else {
          return false;
        }
      }
      // Check for duplicates warning (not blocking)
      if (duplicateCheckResult.value && !duplicateConfirmed.value) {
        const result = await Swal.fire({
          title: 'Posible Duplicado',
          text: '¿Desea continuar con el registro a pesar del posible duplicado?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, continuar',
          cancelButtonText: 'Revisar'
        });
        if (result.isConfirmed) {
          duplicateConfirmed.value = true;
        } else {
          return false;
        }
      }
      break;
    case 2: // Legal Reception (now second)
      if (!admissionData.value.admission_type) {
        Swal.fire('Error', 'Debe seleccionar el tipo de admisión', 'error');
        return false;
      }
      if (!admissionData.value.admission_datetime) {
        Swal.fire('Error', 'Debe ingresar la fecha y hora de ingreso', 'error');
        return false;
      }
      if (!admissionData.value.remitting_court_id) {
        Swal.fire('Error', 'Debe seleccionar el juzgado remitente', 'error');
        return false;
      }
      // Validate legal profiles - optional but if present must be complete
      if (legalProfiles.value.length > 0) {
        // Check if any profile has data (not just empty profiles)
        const profilesWithData = legalProfiles.value.filter(p =>
          p.case_number || p.court_id || p.crimes.length > 0
        );

        // Only validate if there are profiles with some data
        if (profilesWithData.length > 0) {
          for (let i = 0; i < legalProfiles.value.length; i++) {
            const profile = legalProfiles.value[i];

            // Skip empty profiles (no data at all)
            if (!profile.case_number && !profile.court_id && profile.crimes.length === 0) {
              continue;
            }

            // If profile has any data, it must be complete
            if (!profile.case_number) {
              Swal.fire('Error', `Debe ingresar el número de caso para el Caso Legal #${i + 1}`, 'error');
              return false;
            }
            if (!profile.court_id) {
              Swal.fire('Error', `Debe seleccionar el juzgado para el Caso Legal #${i + 1}`, 'error');
              return false;
            }
            if (profile.crimes.length === 0) {
              Swal.fire('Error', `Debe agregar al menos un delito para el Caso Legal #${i + 1}`, 'error');
              return false;
            }
          }
        }
      } else {
        // No legal profiles at all - show a warning but allow to continue
        const result = await Swal.fire({
          title: 'Sin Perfil Legal',
          text: '¿Desea continuar sin agregar información legal? Podrá agregarla posteriormente.',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí, continuar',
          cancelButtonText: 'No, agregar información'
        });
        if (!result.isConfirmed) {
          return false;
        }
      }
      if (!inmateData.value.birth_date) {
        Swal.fire('Error', 'Debe ingresar la fecha de nacimiento', 'error');
        return false;
      }
      if (!inmateData.value.gender) {
        Swal.fire('Error', 'Debe seleccionar el género', 'error');
        return false;
      }
      if (!biometricData.value.enrolled) {
        await Swal.fire({
          title: 'Registro Biométrico Requerido',
          html: `
            <div class="text-start">
              <p>Debe completar el registro biométrico antes de continuar.</p>
              <p class="mt-3">Por favor:</p>
              <ol>
                <li>Haga clic en "Iniciar Captura Biométrica"</li>
                <li>Complete el registro de huellas en la ventana que se abre</li>
                <li>Cierre la ventana al terminar</li>
                <li>Haga clic en "Verificar Estado" para confirmar el registro</li>
              </ol>
            </div>
          `,
          icon: 'warning',
          confirmButtonText: 'Entendido'
        });
        return false;
      }
      break;
    case 3: // Security Assessment
      if (!riskAssessment.value.recommended_security_level) {
        Swal.fire('Error', 'Debe completar la evaluación de seguridad', 'error');
        return false;
      }
      break;
    case 4: // Physical Characteristics
      // Physical characteristics are optional, just check if photos are taken
      const photosCount = Object.values(photos.value).filter(p => p === true).length;
      if (photosCount < 2) {
        Swal.fire('Error', 'Debe capturar al menos 2 fotografías (frontal y perfil)', 'error');
        return false;
      }
      break;
    case 5: // Belongings
      // Belongings are optional
      break;
    case 6: // Medical
      // Medical evaluation will be done separately
      break;
    case 7: // Final Assignment
      if (!finalAssignment.value.sector_id) {
        Swal.fire('Error', 'Debe seleccionar el sector de asignación', 'error');
        return false;
      }
      if (!finalAssignment.value.cell_number) {
        Swal.fire('Error', 'Debe ingresar el número de celda', 'error');
        return false;
      }
      break;
  }
  return true;
};

// Function to start biometric capture with external Java application
const startBiometricCapture = async () => {
  // Import JwtService to get the token
  const { default: JwtService } = await import('@/core/services/JwtService');

  // Check if we have an inmate ID, if not, create minimal inmate first
  if (!inmateId.value) {
    // Show loading message
    Swal.fire({
      title: 'Preparando captura biométrica',
      text: 'Guardando datos del interno...',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Create minimal inmate to get ID
    const created = await createMinimalInmate();

    // Close loading dialog
    Swal.close();

    if (!created || !inmateId.value) {
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo guardar los datos del interno. Por favor complete los campos requeridos.',
        icon: 'error'
      });
      return;
    }
  }

  // Get the current authentication token
  const token = JwtService.getToken();
  if (!token) {
    await Swal.fire({
      title: 'Error',
      text: 'No se encontró token de autenticación. Por favor inicie sesión nuevamente.',
      icon: 'error'
    });
    return;
  }
  
  // Launch the Java biometric service with parameters
  try {
    const params = {
      inmateId: inmateId.value,
      token: token,
      apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    };

    // Encode all parameters as Base64 to avoid URL issues
    const paramString = JSON.stringify({
      id: params.inmateId,
      type: 'inmate',
      token: params.token,
      api: params.apiUrl
    });
    const encodedParams = btoa(paramString);

    // Use a simple protocol URL with Base64 encoded data
    const protocolUrl = `gp360://enroll?data=${encodedParams}`;

    // Try to open with protocol handler
    const protocolOpened = await tryProtocolHandler(protocolUrl);

    if (protocolOpened) {
      // Protocol handler worked - show success message
      await Swal.fire({
        title: 'Captura Biométrica',
        html: `
          <div class="text-start">
            <p>La aplicación de captura biométrica se está abriendo...</p>
            <ol>
              <li>Siga las instrucciones en la aplicación de captura</li>
              <li>Una vez completado, haga clic en "Verificar Estado"</li>
            </ol>
            <div class="alert alert-info mt-3">
              <strong>Nota:</strong> Asegúrese de tener el lector de huellas conectado.
            </div>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Aceptar'
      });
    } else {
      // Show installation instructions if protocol not installed
      await showInstallationInstructions(params);
    }

    // Wait a bit and then check status
    setTimeout(() => {
      checkBiometricStatus();
    }, 5000);

  } catch (error) {
    console.error('Error launching biometric service:', error);
    await Swal.fire({
      title: 'Error',
      text: 'No se pudo iniciar el servicio de captura biométrica',
      icon: 'error'
    });
  }
};

// Helper function to try protocol handler
const tryProtocolHandler = async (protocolUrl: string): Promise<boolean> => {
  // Show user confirmation first
  const result = await Swal.fire({
    title: 'Abrir Cliente Biométrico',
    html: `
      <div class="text-start">
        <p>Se intentará abrir el Cliente Biométrico GP360.</p>
        <p class="mb-3">Si el cliente está instalado, se abrirá automáticamente.</p>
        <div class="alert alert-info">
          <strong>Nota:</strong> Si es la primera vez, el navegador puede solicitar permiso para abrir la aplicación.
        </div>
      </div>
    `,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Abrir Cliente',
    cancelButtonText: 'Cancelar',
    timer: 10000,
    timerProgressBar: true
  });

  if (!result.isConfirmed && !result.dismiss) {
    return false;
  }

  // Try to open the protocol using iframe (more reliable for complex URLs)
  try {
    // Log the URL for debugging
    console.log('Opening biometric client with URL:', protocolUrl);

    // Method 1: Use iframe (most reliable for complex URLs)
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.left = '-9999px';
    iframe.src = protocolUrl;
    document.body.appendChild(iframe);

    // Wait for protocol to trigger
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Clean up iframe
    if (iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }

    // Ask user if it worked
    const worked = await Swal.fire({
      title: '¿Se abrió el Cliente Biométrico?',
      text: 'Por favor confirme si la aplicación de captura se abrió correctamente.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, se abrió',
      cancelButtonText: 'No se abrió'
    });

    return worked.isConfirmed;

    // Protocol didn't work
    return false;

  } catch (error) {
    console.error('Error opening protocol:', error);
    return false;
  }
};

// Function to show installation instructions
const showInstallationInstructions = async (params: any) => {
  await Swal.fire({
    title: 'Cliente Biométrico No Instalado',
    html: `
      <div class="text-start">
        <h5 class="mb-3">El Cliente Biométrico GP360 no está instalado en esta máquina</h5>

        <p><strong>Para usar el sistema de captura biométrica:</strong></p>

        <ol class="mb-3">
          <li class="mb-2">
            <strong>Instale el Cliente Biométrico GP360:</strong>
            <ul>
              <li>Solicite el instalador al administrador del sistema</li>
              <li>El instalador incluye:
                <ul>
                  <li>BiometricService.jar</li>
                  <li>Librerías DigitalPersona</li>
                  <li>Configurador del protocolo gp360://</li>
                </ul>
              </li>
            </ul>
          </li>

          <li class="mb-2">
            <strong>Ejecute el instalador:</strong>
            <ul>
              <li>Ejecute <code>GP360-BiometricClient-Setup.exe</code></li>
              <li>Siga las instrucciones del instalador</li>
              <li>Requiere permisos de Administrador</li>
            </ul>
          </li>

          <li class="mb-2">
            <strong>Conecte el lector de huellas:</strong>
            <ul>
              <li>Lector DigitalPersona 4500/5000</li>
              <li>Los drivers se instalan automáticamente</li>
            </ul>
          </li>
        </ol>

        <div class="alert alert-warning">
          <strong>Nota:</strong> Este proceso solo se realiza una vez por máquina.
          Una vez instalado, el sistema abrirá automáticamente la aplicación de captura.
        </div>

        <div class="alert alert-info">
          <strong>Información del PPL actual:</strong><br>
          ID: ${params.inmateId}<br>
          La captura se realizará cuando el cliente esté instalado.
        </div>
      </div>
    `,
    icon: 'warning',
    width: '700px',
    confirmButtonText: 'Entendido'
  });
};

// Check biometric status from database
const checkBiometricStatus = async () => {
  if (!inmateId.value) {
    await Swal.fire({
      title: 'Error',
      text: 'Primero debe guardar los datos básicos del interno',
      icon: 'error'
    });
    return;
  }

  try {
    const response = await ApiService.get(`/inmates/${inmateId.value}/biometric-status`);
    console.log('Biometric status response:', response.data);
    
    const capturedFingers = response.data.captured_fingers || response.data.data?.captured_fingers || [];
    const fingerprintCount = response.data.fingerprints_captured_count || 
                             response.data.data?.fingerprints_captured_count || 
                             capturedFingers.length || 0;
    
    if (fingerprintCount >= 4 || capturedFingers.length >= 4) {
      biometricData.value.enrolled = true;
      biometricData.value.fingerprints = capturedFingers;
      
      await Swal.fire({
        title: 'Registro Encontrado',
        text: `Se encontraron ${fingerprintCount} huellas dactilares registradas.`,
        icon: 'success'
      });
    } else {
      await Swal.fire({
        title: 'Sin Registro',
        text: `No se encontraron suficientes huellas dactilares. Se encontraron ${fingerprintCount} pero se requieren al menos 4.`,
        icon: 'info'
      });
    }
  } catch (error) {
    console.error('Error checking biometric status:', error);
    await Swal.fire({
      title: 'Error',
      text: 'No se pudo verificar el estado del registro biométrico',
      icon: 'error'
    });
  }
};

// Biometric enrollment through external system - DEPRECATED
/* const openBiometricEnrollment = async () => {
  // Save current data to session storage
  sessionStorage.setItem('admission_temp_data', JSON.stringify({
    admission: admissionData.value,
    inmate: inmateData.value,
    currentStep: currentStep.value,
    inmateId: inmateId.value
  }));

  // Open biometric capture in new window/tab or navigate to it
  if (inmateId.value) {
    // If we already have an inmate ID, pass it to the biometric capture
    window.open(`/security/biometric/${inmateId.value}`, '_blank');
  } else {
    // For new inmates, we need to create the record first
    // First validate that we have the minimum required data
    const missingFields = [];
    
    if (!inmateData.value.first_name) missingFields.push('Primer Nombre');
    if (!inmateData.value.first_surname) missingFields.push('Primer Apellido');
    if (!inmateData.value.identification_number) missingFields.push('Número de Documento');
    if (!inmateData.value.document_type_id) missingFields.push('Tipo de Documento');
    if (!inmateData.value.birth_date) missingFields.push('Fecha de Nacimiento');
    if (!inmateData.value.gender) missingFields.push('Género');
    if (!inmateData.value.birth_country_id) missingFields.push('País de Nacimiento');
    if (!inmateData.value.birth_department_id) missingFields.push('Departamento de Nacimiento');
    if (!inmateData.value.birth_municipality_id) missingFields.push('Municipio de Nacimiento');
    
    if (missingFields.length > 0) {
      await Swal.fire({
        title: 'Datos Incompletos',
        html: `Debe completar los siguientes campos antes de capturar biometría:<br><br>
               <ul class="text-start">${missingFields.map(field => `<li>${field}</li>`).join('')}</ul>`,
        icon: 'warning'
      });
      return;
    }
    
    // Create a minimal admission to get the inmate ID
    const started = await createMinimalInmate();
    if (started && inmateId.value) {
      window.open(`/security/biometric/${inmateId.value}`, '_blank');
    } else {
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo crear el registro del interno. Por favor complete los datos requeridos.',
        icon: 'error'
      });
      return;
    }
  }

  // Show instruction to user
  await Swal.fire({
    title: 'Captura Biométrica',
    html: `
      <div class="text-start">
        <p>Se ha abierto la ventana de captura biométrica.</p>
        <p>Por favor complete el registro de las 10 huellas dactilares.</p>
        <p class="text-warning mt-3">
          <i class="fas fa-exclamation-triangle me-2"></i>
          Una vez completada la captura, cierre la ventana y presione "Continuar" aquí.
        </p>
      </div>
    `,
    icon: 'info',
    confirmButtonText: 'Continuar'
  });

  // Check if biometric data was captured
  try {
    const response = await ApiService.get(`/inmates/${inmateId.value}/biometric-status`);
    console.log('Biometric status response:', response.data);
    
    // Check if we have captured fingers (the backend returns captured_fingers array)
    const capturedFingers = response.data.captured_fingers || response.data.data?.captured_fingers || [];
    const fingerprintCount = response.data.fingerprints_captured_count || 
                             response.data.data?.fingerprints_captured_count || 
                             capturedFingers.length || 0;
    
    // Consider enrolled if we have at least 4 required fingers (both thumbs and index fingers)
    // or if we have 10 fingers for full enrollment
    if (fingerprintCount >= 4 || capturedFingers.length >= 4) {
      biometricData.value.enrolled = true;
      biometricData.value.fingerprints = capturedFingers;
      
      await Swal.fire({
        title: 'Registro Biométrico Completado',
        text: `Se han capturado ${fingerprintCount} huellas dactilares.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      await Swal.fire({
        title: 'Registro Incompleto',
        text: `Solo se capturaron ${fingerprintCount} huellas. Se requieren al menos 4 (ambos pulgares e índices).`,
        icon: 'warning'
      });
    }
  } catch (error) {
    console.error('Could not verify biometric status:', error);
    
    // If we can't verify, show an option to manually confirm
    const result = await Swal.fire({
      title: 'Verificación de Registro',
      text: '¿Completó el registro biométrico correctamente?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, completado',
      cancelButtonText: 'No, reintentar'
    });
    
    if (result.isConfirmed) {
      biometricData.value.enrolled = true;
    }
  }
};
*/

// Belongings management functions
let belongingIdCounter = 1;

const addBelongingItem = () => {
  belongings.value.push({
    id: belongingIdCounter++,
    item_type: '',
    description: '',
    quantity: 1,
    value: 0,
    storage_location: '',
    condition: 'bueno',
    notes: ''
  });
};

const removeBelongingItem = (index: number) => {
  belongings.value.splice(index, 1);
};

const calculateTotalValue = () => {
  return belongings.value.reduce((total, item) => total + (item.value * item.quantity), 0).toFixed(2);
};

// Legal profile management functions
let legalProfileIdCounter = 1;
let crimeIdCounter = 1;

const addLegalProfile = () => {
  legalProfiles.value.push({
    id: legalProfileIdCounter++,
    case_number: '',
    judicial_file_number: '',
    court_id: null,
    prosecutor_name: '',
    prosecutor_office: '',
    defense_attorney_name: '',
    defense_attorney_phone: '',
    defense_type: 'public',
    procedural_stage: 'investigation',
    procedural_status_id: null,
    in_preventive_detention: true,
    preventive_detention_start: new Date().toISOString().slice(0, 10),
    crimes: []
  });
};

const removeLegalProfile = (index: number) => {
  if (legalProfiles.value.length > 1) {
    legalProfiles.value.splice(index, 1);
  } else {
    Swal.fire({
      title: 'Advertencia',
      text: 'Debe mantener al menos un caso legal',
      icon: 'warning'
    });
  }
};

const addCrimeToProfile = (profileIndex: number) => {
  legalProfiles.value[profileIndex].crimes.push({
    crime_id: null,
    crime_description: '',
    crime_date: '',
    crime_location: ''
  });
};

const removeCrimeFromProfile = (profileIndex: number, crimeIndex: number) => {
  legalProfiles.value[profileIndex].crimes.splice(crimeIndex, 1);
};

// Duplicate checking functions
const checkForDuplicates = async () => {
  // Only check if we have minimum data
  if (!inmateData.value.identification_number && !inmateData.value.first_name && !inmateData.value.first_surname) {
    return;
  }

  try {
    const params: any = {};
    if (inmateData.value.identification_number) {
      params.identification_number = inmateData.value.identification_number;
    }
    if (inmateData.value.first_name && inmateData.value.first_surname) {
      params.first_name = inmateData.value.first_name;
      params.first_surname = inmateData.value.first_surname;
    }

    // Build query string manually
    const queryParams = new URLSearchParams(params).toString();
    const response = await ApiService.get(`/inmates/check-duplicates${queryParams ? '?' + queryParams : ''}`);

    if (response.data.data && response.data.data.length > 0) {
      duplicateCheckResult.value = response.data.data[0];
      duplicateConfirmed.value = false;

      // Si el documento coincide exactamente, mostrar alerta de error
      if (inmateData.value.identification_number &&
          duplicateCheckResult.value.identification_number === inmateData.value.identification_number) {
        await Swal.fire({
          title: 'Documento Duplicado',
          html: `
            <div class="text-start">
              <p>Ya existe un PPL registrado con este número de documento:</p>
              <ul>
                <li><strong>Nombre:</strong> ${duplicateCheckResult.value.full_name}</li>
                <li><strong>Documento:</strong> ${duplicateCheckResult.value.identification_number}</li>
                <li><strong>Estado:</strong> ${duplicateCheckResult.value.status === 'active' ? 'Activo' : duplicateCheckResult.value.status}</li>
              </ul>
              <p class="mt-3">No se puede registrar dos veces el mismo documento de identificación.</p>
            </div>
          `,
          icon: 'error',
          confirmButtonText: 'Entendido'
        });

        // Limpiar el campo de documento para forzar al usuario a cambiarlo
        inmateData.value.identification_number = '';
      }
    } else {
      duplicateCheckResult.value = null;
      duplicateConfirmed.value = false;
    }
  } catch (error) {
    console.error('Error checking for duplicates:', error);
    // Don't block the process if duplicate check fails
  }
};

const viewDuplicate = () => {
  if (duplicateCheckResult.value && duplicateCheckResult.value.id) {
    // Open in new tab to view the existing inmate profile
    window.open(`/inmates/${duplicateCheckResult.value.id}`, '_blank');
  }
};

const capturePhoto = async (type: string) => {
  // Save the photo type we want to capture
  sessionStorage.setItem('photo_capture_type', type);
  
  // Ensure we have an inmate ID first
  if (!inmateId.value) {
    // Need to save previous steps first
    const result = await Swal.fire({
      title: 'Guardar Datos',
      text: 'Se necesita guardar los datos del interno antes de capturar fotografías. ¿Desea continuar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar y continuar',
      cancelButtonText: 'Cancelar'
    });
    
    if (!result.isConfirmed) return;
    
    // Save all previous data
    const started = await startAdmission();
    if (!started) return;
    
    const identified = await saveIdentification();
    if (!identified) return;
    
    const secured = await saveSecurityAssessment();
    if (!secured) return;
  }
  
  // Open photo capture form
  if (inmateId.value) {
    window.open(`/security/photo/${inmateId.value}?type=${type}`, '_blank');
  } else {
    await Swal.fire({
      title: 'Error',
      text: 'No se pudo obtener el ID del interno',
      icon: 'error'
    });
    return;
  }

  // Show instruction to user
  const result = await Swal.fire({
    title: 'Captura de Fotografía',
    html: `
      <div class="text-start">
        <p>Se ha abierto la ventana de captura fotográfica.</p>
        <p>Tipo de foto: <strong>${getPhotoTypeLabel(type)}</strong></p>
        <p class="text-warning mt-3">
          <i class="fas fa-exclamation-triangle me-2"></i>
          Una vez capturada la foto, cierre la ventana y presione "Foto Capturada" aquí.
        </p>
      </div>
    `,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Foto Capturada',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    photos.value[type] = true;
  }
};

const getPhotoTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'frontal': 'Frontal',
    'profile_left': 'Perfil Izquierdo',
    'profile_right': 'Perfil Derecho',
    'full_body': 'Cuerpo Completo'
  };
  return labels[type] || type;
};

const inmateId = ref<number | null>(null);

// Function to create a minimal inmate record just to get an ID for biometric enrollment
const createMinimalInmate = async () => {
  try {
    // Check for valid legal profiles (optional but if present must be complete)
    const validProfiles = legalProfiles.value.filter(p => p.case_number && p.court_id);

    // If there are profiles but none are valid, check for partial data
    if (legalProfiles.value.length > 0 && validProfiles.length === 0) {
      const hasPartialData = legalProfiles.value.some(p =>
        (p.case_number && !p.court_id) || (!p.case_number && p.court_id)
      );

      if (hasPartialData) {
        await Swal.fire({
          title: 'Perfil Legal Incompleto',
          text: 'Si agrega un perfil legal, debe completar tanto el número de caso como el juzgado',
          icon: 'warning'
        });
        return false;
      }
    }

    // Verificar duplicados antes de crear
    if (duplicateCheckResult.value &&
        inmateData.value.identification_number &&
        duplicateCheckResult.value.identification_number === inmateData.value.identification_number) {
      await Swal.fire({
        title: 'Error',
        text: 'No se puede crear el registro porque el documento ya está registrado en el sistema.',
        icon: 'error'
      });
      return false;
    }

    // Prepare minimal data for creating an inmate record
    const payload = {
      admission_type: admissionData.value.admission_type || 'new_admission',
      admission_datetime: admissionData.value.admission_datetime || new Date().toISOString(),
      admission_order_number: admissionData.value.admission_order_number || `TEMP-${Date.now()}`,
      remitting_court_id: admissionData.value.remitting_court_id || null,
      inmate: {
        // Map frontend field names to backend expected names
        first_name: inmateData.value.first_name,
        middle_name: inmateData.value.second_name || '',
        third_name: inmateData.value.third_name || '',
        last_name: inmateData.value.first_surname,
        second_last_name: inmateData.value.second_surname || '',
        married_surname: inmateData.value.married_surname || '',
        alias: inmateData.value.alias || '',
        document_number: inmateData.value.identification_number || `TEMP-${Date.now()}`,
        document_type_id: inmateData.value.document_type_id || 1,
        birth_date: inmateData.value.birth_date || '2000-01-01',
        gender: inmateData.value.gender || 'M',
        nationality_id: inmateData.value.nationality_id || null,
        // Include all birth location fields
        birth_country_id: inmateData.value.birth_country_id || null,
        birth_department_id: inmateData.value.birth_department_id || null,
        birth_municipality_id: inmateData.value.birth_municipality_id || null,
        // Civil and ethnic information
        civil_status_id: inmateData.value.civil_status_id || null,
        ethnic_group_id: inmateData.value.ethnic_group_id || null,
        // Nuevos campos demográficos
        sexual_orientation_id: inmateData.value.sexual_orientation_id || null,
        gender_identity_id: inmateData.value.gender_identity_id || null,
        religion_id: inmateData.value.religion_id || null,
        academic_degree_id: inmateData.value.academic_degree_id || null,
        profession: inmateData.value.profession || null,
        languages: inmateData.value.languages || null,
        // Información de contacto
        address: inmateData.value.address || null,
        phone: inmateData.value.phone || null,
        email: inmateData.value.email || null,
        // Emergency contact information
        emergency_contact_name: inmateData.value.emergency_contact_name || null,
        emergency_contact_phone: inmateData.value.emergency_contact_phone || null,
        emergency_contact_relationship: inmateData.value.emergency_contact_relationship || null,
        emergency_contact_address: inmateData.value.emergency_contact_address || null,
        // Current location - use the selected center from admission data
        current_center_id: admissionData.value.current_center_id || 1,
        status: 'active'
      },
      // Include only valid legal profiles with required fields
      legal_profiles: legalProfiles.value
        .filter(profile => profile.case_number && profile.court_id) // Only include complete profiles
        .map(profile => ({
          case_number: profile.case_number,
          judicial_file_number: profile.judicial_file_number,
          court_id: profile.court_id,
          prosecutor_name: profile.prosecutor_name,
          prosecutor_office: profile.prosecutor_office,
          defense_attorney_name: profile.defense_attorney_name,
          defense_attorney_phone: profile.defense_attorney_phone,
          defense_type: profile.defense_type, // Will be mapped to defense_attorney_type in backend
          procedural_stage: profile.procedural_stage,
          procedural_status_id: profile.procedural_status_id,
          in_preventive_detention: profile.in_preventive_detention,
          preventive_detention_start: profile.preventive_detention_start,
          preventive_detention_max_end: profile.preventive_detention_max_end || profile.preventive_detention_end || null,
          // Include crimes for each legal profile
          crimes: profile.crimes?.map(crime => ({
            crime_id: crime.crime_id,
            crime_description: crime.crime_description || '',
            crime_date: crime.crime_date || null,
            crime_location: crime.crime_location || ''
          })) || []
        }))
    };

    // Ensure current_center_id is at root level (required by backend)
    payload.current_center_id = admissionData.value.current_center_id || 1; // Default to center 1 if not set

    // Ensure case_number is at root level (required by backend) - use from first valid profile
    const firstValidProfile = legalProfiles.value.find(p => p.case_number && p.court_id);
    const rootCaseNumber = firstValidProfile?.case_number || `TEMP-${Date.now()}`;
    payload.case_number = rootCaseNumber;

    // Also ensure each legal profile has a case_number
    if (payload.legal_profiles) {
      payload.legal_profiles = payload.legal_profiles.map((profile: any) => ({
        ...profile,
        case_number: profile.case_number || rootCaseNumber
      }));
    }

    const response = await ApiService.post('/admissions/start', payload);

    // Store the inmate ID for subsequent operations
    if (response.data.data?.inmate_id) {
      inmateId.value = response.data.data.inmate_id;
    } else if (response.data.data?.id) {
      inmateId.value = response.data.data.id;
    } else if (response.data.inmate_id) {
      inmateId.value = response.data.inmate_id;
    } else if (response.data.id) {
      inmateId.value = response.data.id;
    }
    
    if (inmateId.value) {
      await Swal.fire({
        title: 'Registro Creado',
        text: `Se ha creado el registro temporal del interno con ID: ${inmateId.value}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
    
    return true;
  } catch (error: any) {
    console.error('Error creating minimal inmate:', error);
    if (error.response?.data?.errors) {
      const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
      await Swal.fire({
        title: 'Error de Validación',
        text: errorMessages,
        icon: 'error'
      });
    } else {
      await Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo crear el registro del interno',
        icon: 'error'
      });
    }
    return false;
  }
};

const startAdmission = async () => {
  try {
    // Check for valid legal profiles (optional but if present must be complete)
    const validProfiles = legalProfiles.value.filter(p => p.case_number && p.court_id);

    // If there are profiles but none are valid, show error
    if (legalProfiles.value.length > 0 && validProfiles.length === 0) {
      // Check if any profile has partial data
      const hasPartialData = legalProfiles.value.some(p =>
        (p.case_number && !p.court_id) || (!p.case_number && p.court_id)
      );

      if (hasPartialData) {
        await Swal.fire({
          title: 'Perfil Legal Incompleto',
          text: 'Si agrega un perfil legal, debe completar tanto el número de caso como el juzgado',
          icon: 'warning'
        });
        return false;
      }
    }

    // Generate a case_number - use from valid profile or generate temporary
    let caseNumber = validProfiles[0]?.case_number || `TEMP-${Date.now()}`;

    // Prepare the data combining admission and inmate information
    const payload = {
      ...admissionData.value,
      // Always include a valid case_number
      case_number: caseNumber,
      inmate: {
        ...inmateData.value,
        // Ensure we have at least basic data
        first_name: inmateData.value.first_name || 'Por Registrar',
        first_surname: inmateData.value.first_surname || 'Por Registrar',
        gender: inmateData.value.gender || 'M'
      },
      // Include only valid legal profiles (with required fields)
      legal_profiles: legalProfiles.value
        .filter(profile => profile.case_number && profile.court_id) // Only include profiles with required fields
        .map(profile => ({
          ...profile,
          // Ensure each profile has a case_number
          case_number: profile.case_number || caseNumber,
          // Ensure crimes have required fields
          crimes: profile.crimes.map(crime => ({
            crime_id: crime.crime_id,
            crime_description: crime.crime_description || '',
            crime_date: crime.crime_date || null,
            crime_location: crime.crime_location || ''
          }))
        }))
    };
    
    const response = await ApiService.post('/admissions/start', payload);
    
    // Store the inmate ID for subsequent operations
    if (response.data.data?.inmate_id) {
      inmateId.value = response.data.data.inmate_id;
    } else if (response.data.data?.id) {
      inmateId.value = response.data.data.id;
    } else if (response.data.inmate_id) {
      inmateId.value = response.data.inmate_id;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error starting admission:', error);
    await Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'No se pudo iniciar la admisión',
      icon: 'error'
    });
    return false;
  }
};

const saveIdentification = async () => {
  if (!inmateId.value) return false;
  
  try {
    // Debug log
    console.log('InmateData before saving:', inmateData.value);
    console.log('Legal Profiles:', legalProfiles.value);
    
    // Map frontend fields to backend expected fields
    const identificationData = {
      document_number: inmateData.value.identification_number || '',
      document_type_id: inmateData.value.document_type_id || 1,
      case_number: legalProfiles.value[0]?.case_number || 'PENDING-' + Date.now(), // Use case number from first legal profile or generate temporary
      first_name: inmateData.value.first_name || '',
      middle_name: inmateData.value.second_name || null,
      third_name: inmateData.value.third_name || null,
      last_name: inmateData.value.first_surname || '', // Map first_surname to last_name
      second_last_name: inmateData.value.second_surname || null,
      married_surname: inmateData.value.married_surname || null,
      alias: inmateData.value.alias || null,
      birth_date: inmateData.value.birth_date || '2000-01-01',
      gender: inmateData.value.gender || 'M',
      nationality_id: inmateData.value.nationality_id || 1, // Default to Guatemala
      birth_country_id: inmateData.value.birth_country_id || 1, // País de nacimiento
      birth_department_id: inmateData.value.birth_department_id || 1, // Departamento de nacimiento
      birth_municipality_id: inmateData.value.birth_municipality_id || 1, // Default to Guatemala municipality
      civil_status_id: inmateData.value.civil_status_id || null,
      ethnic_group_id: inmateData.value.ethnic_group_id || null,
      emergency_contact_name: inmateData.value.emergency_contact_name || null,
      emergency_contact_phone: inmateData.value.emergency_contact_phone || null,
      emergency_contact_relationship: inmateData.value.emergency_contact_relationship || null
    };
    
    console.log('Data being sent to backend:', identificationData);
    
    await ApiService.put(`/admissions/${inmateId.value}/identification`, identificationData);
    return true;
  } catch (error: any) {
    console.error('Error saving identification:', error.response?.data);
    console.error('Full error object:', error);
    console.error('Request data that was sent:', identificationData);
    
    // Show detailed error message
    let errorMessage = 'No se pudo guardar la identificación';
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const errorList = Object.keys(errors).map(field => {
        return `${field}: ${errors[field].join(', ')}`;
      });
      errorMessage = 'Errores de validación:\n' + errorList.join('\n');
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    await Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error'
    });
    return false;
  }
};

const saveSecurityAssessment = async () => {
  if (!inmateId.value) return false;
  
  try {
    // Ensure all required fields have valid values
    const securityData = {
      ...riskAssessment.value,
      // Ensure numeric fields are properly formatted
      violence_risk_score: parseInt(riskAssessment.value.violence_risk_score) || 0,
      escape_risk_score: parseInt(riskAssessment.value.escape_risk_score) || 0,
      gang_risk_score: parseInt(riskAssessment.value.gang_risk_score) || 0,
      self_harm_risk_score: parseInt(riskAssessment.value.self_harm_risk_score) || 0,
      vulnerability_score: parseInt(riskAssessment.value.vulnerability_score) || 0,
      // Optional arrays that backend expects
      known_enemies: [],
      protection_from: []
    };
    
    await ApiService.post(`/admissions/${inmateId.value}/security-assessment`, securityData);
    
    // Show success message briefly
    await Swal.fire({
      title: 'Guardado',
      text: 'Evaluación de seguridad guardada exitosamente',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
    
    return true;
  } catch (error: any) {
    console.error('Error saving security assessment:', error.response?.data);
    
    // Show detailed error message
    let errorMessage = 'No se pudo guardar la evaluación de seguridad';
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const errorList = Object.keys(errors).map(field => {
        return `${field}: ${errors[field].join(', ')}`;
      });
      errorMessage = 'Errores de validación:\n' + errorList.join('\n');
    }
    
    await Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error'
    });
    return false;
  }
};

const savePhysicalCharacteristics = async () => {
  if (!inmateId.value) return false;
  
  try {
    await ApiService.put(`/admissions/${inmateId.value}/physical-characteristics`, physicalProfile.value);
    return true;
  } catch (error: any) {
    await Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'No se pudo guardar las características físicas',
      icon: 'error'
    });
    return false;
  }
};

const saveBelongings = async () => {
  if (!inmateId.value) return false;
  
  // If no belongings, we can skip or send empty array
  if (belongings.value.length === 0) {
    // User has no belongings, which is valid
    return true;
  }
  
  try {
    // Validate that items have required fields filled
    const invalidItems = belongings.value.filter(item => !item.item_type || !item.description);
    if (invalidItems.length > 0) {
      await Swal.fire({
        title: 'Datos Incompletos',
        text: 'Por favor complete el tipo y descripción de todos los artículos en el inventario',
        icon: 'warning'
      });
      return false;
    }
    
    // Map frontend fields to backend expected fields
    const mappedItems = belongings.value.map(item => ({
      category: item.item_type, // Map item_type to category
      item_description: item.description, // Map description to item_description
      quantity: item.quantity || 1,
      estimated_value: item.value || 0,
      storage_location: item.storage_location || 'bodega',
      item_condition: item.condition || 'bueno', // Correctly mapped to item_condition
      notes: item.notes || ''
    }));
    
    await ApiService.post(`/admissions/${inmateId.value}/belongings`, {
      items: mappedItems
    });
    return true;
  } catch (error: any) {
    console.error('Error saving belongings:', error.response?.data);
    
    // Show detailed error message
    let errorMessage = 'No se pudo guardar el inventario';
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const errorList = Object.keys(errors).map(field => {
        return `${field}: ${errors[field].join(', ')}`;
      });
      errorMessage = 'Errores de validación:\n' + errorList.join('\n');
    }
    
    await Swal.fire({
      title: 'Error', 
      text: errorMessage,
      icon: 'error'
    });
    return false;
  }
};

const saveMedicalEvaluation = async () => {
  if (!inmateId.value) return false;
  
  try {
    // Map medical evaluation data to the format expected by the medical profile endpoint
    const medicalProfileData = {
      inmate_id: inmateId.value,
      // Chronic diseases
      has_chronic_diseases: medicalEvaluation.value.has_chronic_diseases,
      chronic_diseases_notes: medicalEvaluation.value.chronic_diseases || null,
      
      // Medications
      has_current_medications: medicalEvaluation.value.has_medications,
      current_medications_notes: medicalEvaluation.value.current_medications || null,
      
      // Allergies
      has_allergies: medicalEvaluation.value.has_allergies,
      allergies_notes: medicalEvaluation.value.allergies || null,
      
      // Disabilities
      has_disabilities: medicalEvaluation.value.has_disabilities,
      disabilities_notes: medicalEvaluation.value.disabilities || null,
      
      // Mental health
      mental_health_status: medicalEvaluation.value.mental_health_status,
      requires_immediate_medical_attention: medicalEvaluation.value.requires_immediate_attention,
      
      // General notes
      general_health_notes: medicalEvaluation.value.medical_notes || null,
      
      // Vital signs (store as JSON string or separate fields)
      last_blood_pressure: medicalEvaluation.value.vital_signs.blood_pressure || null,
      last_heart_rate: medicalEvaluation.value.vital_signs.heart_rate || null,
      last_temperature: medicalEvaluation.value.vital_signs.temperature || null,
      last_respiratory_rate: medicalEvaluation.value.vital_signs.respiratory_rate || null,
      
      // Metadata
      created_by: authStore.user?.id,
      initial_evaluation_date: new Date().toISOString()
    };
    
    // Use the upsert endpoint to create or update the medical profile
    await ApiService.post('/inmate-medical-profiles/upsert', medicalProfileData);
    
    // If immediate attention is required, create a medical consultation
    if (medicalEvaluation.value.requires_immediate_attention) {
      await ApiService.post('/inmate-medical-consultations', {
        inmate_id: inmateId.value,
        consultation_date: new Date().toISOString(),
        consultation_type: 'emergency',
        reason: 'Requiere atención médica inmediata - Evaluación inicial de admisión',
        symptoms: medicalEvaluation.value.medical_notes,
        priority: 'high',
        status: 'pending'
      });
    }
    
    return true;
  } catch (error: any) {
    console.error('Error saving medical evaluation:', error.response?.data);
    
    // Show detailed error message
    let errorMessage = 'No se pudo guardar la evaluación médica';
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const errorList = Object.keys(errors).map(field => {
        return `${field}: ${errors[field].join(', ')}`;
      });
      errorMessage = 'Errores de validación:\n' + errorList.join('\n');
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    await Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error'
    });
    return false;
  }
};

const completeAdmission = async () => {
  const result = await Swal.fire({
    title: '¿Completar Admisión?',
    text: 'Se finalizará el proceso de admisión del interno',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, completar',
    cancelButtonText: 'Revisar datos'
  });

  if (result.isConfirmed) {
    try {
      if (!inmateId.value) {
        // Start admission first
        const started = await startAdmission();
        if (!started) return;
      }

      // Save all steps - only save if not already saved
      // Check which steps haven't been completed yet
      if (currentStep.value >= 2) {
        await saveIdentification();
      }
      if (currentStep.value >= 3) {
        // Try to save security assessment, but don't fail if duplicate
        try {
          await saveSecurityAssessment();
        } catch (error: any) {
          // If it's a duplicate error, we can continue
          if (!error.response?.data?.error?.includes('Duplicate entry')) {
            throw error;
          }
        }
      }
      if (currentStep.value >= 4) {
        await savePhysicalCharacteristics();
      }
      if (currentStep.value >= 5) {
        await saveBelongings();
      }
      if (currentStep.value >= 6) {
        await saveMedicalEvaluation();
      }

      // Complete the admission
      const response = await ApiService.post(`/admissions/${inmateId.value}/complete`, {
        current_center_id: finalAssignment.value.center_id,
        current_sector_id: finalAssignment.value.sector_id,
        current_cell_number: finalAssignment.value.cell_number,
        final_notes: finalAssignment.value.notes
      });

      await Swal.fire({
        title: 'Admisión Completada',
        text: `Interno registrado con número: ${response.data.data.inmate_number}`,
        icon: 'success'
      });

      router.push(`/inmates/${inmateId.value}`);
    } catch (error: any) {
      await Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo completar la admisión',
        icon: 'error'
      });
    }
  }
};

const loadBirthDepartments = async () => {
  if (!inmateData.value.birth_country_id) {
    birthDepartments.value = [];
    birthMunicipalities.value = [];
    inmateData.value.birth_department_id = null;
    inmateData.value.birth_municipality_id = null;
    return;
  }
  
  // Get the Guatemala country ID
  const guatemala = countries.value?.find(c => c.name?.toLowerCase().includes('guatemala'));
  
  // Only load departments if the selected country is Guatemala
  if (guatemala && inmateData.value.birth_country_id === guatemala.id) {
    try {
      const response = await ApiService.get('/catalogs/departments?simple=true');
      birthDepartments.value = response.data.data?.data || response.data.data || response.data || [];
    } catch (error) {
      console.error('Error loading birth departments:', error);
      birthDepartments.value = [];
    }
  } else {
    // For other countries, clear departments list
    birthDepartments.value = [];
  }
  
  // Clear dependent fields
  inmateData.value.birth_department_id = null;
  inmateData.value.birth_municipality_id = null;
  birthMunicipalities.value = [];
};

const loadBirthMunicipalities = async () => {
  if (!inmateData.value.birth_department_id) {
    birthMunicipalities.value = [];
    inmateData.value.birth_municipality_id = null;
    return;
  }
  
  try {
    const response = await ApiService.get('/catalogs/municipalities?simple=true');
    const allMunicipalities = response.data.data?.data || response.data.data || response.data || [];
    // Filter by department
    birthMunicipalities.value = allMunicipalities.filter(m => m.department_id === inmateData.value.birth_department_id);
  } catch (error) {
    console.error('Error loading birth municipalities:', error);
  }
  
  // Clear dependent field
  inmateData.value.birth_municipality_id = null;
};

const loadCatalogs = async () => {
  try {
    const [
      courtsRes,
      docTypesRes,
      civilRes,
      nationalitiesRes,
      ethnicRes,
      bloodRes,
      sectorsRes,
      centersRes,
      municipalitiesRes,
      countriesRes,
      crimesRes,
      proceduralStatusesRes
    ] = await Promise.all([
      ApiService.get('/catalogs/courts?simple=true'),
      ApiService.get('/catalogs/document-types?simple=true'),
      ApiService.get('/catalogs/civil-statuses?simple=true'),
      ApiService.get('/catalogs/nationalities?simple=true'),
      ApiService.get('/catalogs/ethnic-groups?simple=true'),
      ApiService.get('/catalogs/blood-types?simple=true'),
      ApiService.get('/catalogs/sectors?simple=true'),
      ApiService.get('/catalogs/centers?simple=true'),
      ApiService.get('/catalogs/municipalities?simple=true'),
      ApiService.get('/catalogs/countries?simple=true'),
      ApiService.get('/catalogs/crimes?simple=true'),
      ApiService.get('/catalogs/procedural-statuses?simple=true')
    ]);

    // Handle paginated responses (data.data.data) and simple responses (data.data)
    courts.value = courtsRes.data.data?.data || courtsRes.data.data || courtsRes.data || [];
    documentTypes.value = docTypesRes.data.data?.data || docTypesRes.data.data || docTypesRes.data || [];
    civilStatuses.value = civilRes.data.data?.data || civilRes.data.data || civilRes.data || [];
    nationalities.value = nationalitiesRes.data.data?.data || nationalitiesRes.data.data || nationalitiesRes.data || [];
    ethnicGroups.value = ethnicRes.data.data?.data || ethnicRes.data.data || ethnicRes.data || [];
    bloodTypes.value = bloodRes.data.data?.data || bloodRes.data.data || bloodRes.data || [];
    crimes.value = crimesRes.data.data?.data || crimesRes.data.data || crimesRes.data || [];
    proceduralStatuses.value = proceduralStatusesRes.data.data?.data || proceduralStatusesRes.data.data || proceduralStatusesRes.data || [];
    sectors.value = sectorsRes.data.data?.data || sectorsRes.data.data || sectorsRes.data || [];
    centers.value = centersRes.data.data?.data || centersRes.data.data || centersRes.data || [];
    municipalities.value = municipalitiesRes.data.data?.data || municipalitiesRes.data.data || municipalitiesRes.data || [];
    countries.value = countriesRes.data.data?.data || countriesRes.data.data || countriesRes.data || [];
  } catch (error) {
    console.error('Error loading catalogs:', error);
  }
};

// Lifecycle
onMounted(async () => {
  await loadCatalogs();

  // Don't set any default country - let the user choose

  // Don't add a legal profile automatically - let the user add when ready
  // The system now supports admissions without legal profiles initially
});
</script>

<style scoped>
.stepper-nav {
  min-width: 200px;
}

.form-range {
  width: 100%;
}
</style>