<template>
  <div 
    id="physicalProfileFormModal" 
    class="modal fade" 
    tabindex="-1" 
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">
            {{ isEditing ? 'Editar Perfil Físico' : 'Nuevo Perfil Físico' }}
          </h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" @click="close">
            <i class="ki-duotone ki-cross fs-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
        </div>

        <Form @submit="handleSubmit" :validation-schema="validationSchema">
          <div class="modal-body py-10 px-lg-17">
            <!-- Inmate Selection (only for new profiles) -->
            <div v-if="!isEditing" class="row mb-8">
              <div class="col-md-12">
                <label class="required fs-6 fw-semibold mb-2">Interno:</label>
                <Field name="inmate_id" v-slot="{ field, errorMessage }">
                  <select
                    v-bind="field"
                    class="form-select"
                    :class="{ 'is-invalid': errorMessage }"
                  >
                    <option value="">Seleccionar interno...</option>
                    <option 
                      v-for="inmate in availableInmates" 
                      :key="inmate.id" 
                      :value="inmate.id"
                    >
                      {{ [inmate.first_name, inmate.middle_name, inmate.last_name, inmate.second_last_name].filter(Boolean).join(' ') }} - {{ inmate.inmate_number }}
                    </option>
                  </select>
                  <div v-if="errorMessage" class="invalid-feedback">
                    {{ errorMessage }}
                  </div>
                </Field>
              </div>
            </div>

            <!-- Basic Measurements -->
            <div class="separator separator-dashed my-5"></div>
            <h4 class="fw-bold text-gray-700 mb-7">Medidas Básicas</h4>
            
            <div class="row mb-8">
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Estatura (cm):</label>
                <Field name="height" v-slot="{ field, errorMessage }">
                  <input
                    v-bind="field"
                    type="number"
                    step="0.1"
                    min="50"
                    max="250"
                    class="form-control"
                    :class="{ 'is-invalid': errorMessage }"
                    placeholder="175.5"
                  />
                  <div v-if="errorMessage" class="invalid-feedback">
                    {{ errorMessage }}
                  </div>
                </Field>
              </div>
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Peso (kg):</label>
                <Field name="weight" v-slot="{ field, errorMessage }">
                  <input
                    v-bind="field"
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    class="form-control"
                    :class="{ 'is-invalid': errorMessage }"
                    placeholder="70.2"
                  />
                  <div v-if="errorMessage" class="invalid-feedback">
                    {{ errorMessage }}
                  </div>
                </Field>
              </div>
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Tipo Físico:</label>
                <Field name="build_type" v-slot="{ field, errorMessage }">
                  <select
                    v-bind="field"
                    class="form-select"
                    :class="{ 'is-invalid': errorMessage }"
                  >
                    <option value="">Seleccionar tipo...</option>
                    <option value="slim">Delgado</option>
                    <option value="athletic">Atlético</option>
                    <option value="average">Promedio</option>
                    <option value="heavy">Pesado</option>
                    <option value="muscular">Musculoso</option>
                  </select>
                  <div v-if="errorMessage" class="invalid-feedback">
                    {{ errorMessage }}
                  </div>
                </Field>
              </div>
            </div>

            <div class="row mb-8">
              <div class="col-md-4">
                <label class="fs-6 fw-semibold mb-2">Tipo de Sangre:</label>
                <Field name="blood_type_id" v-slot="{ field, errorMessage }">
                  <select
                    v-bind="field"
                    class="form-select"
                    :class="{ 'is-invalid': errorMessage }"
                  >
                    <option value="">Seleccionar tipo...</option>
                    <option 
                      v-for="bloodType in bloodTypes" 
                      :key="bloodType.id" 
                      :value="bloodType.id"
                    >
                      {{ bloodType.name }} ({{ bloodType.code }})
                    </option>
                  </select>
                  <div v-if="errorMessage" class="invalid-feedback">
                    {{ errorMessage }}
                  </div>
                </Field>
              </div>
              <div class="col-md-4">
                <label class="fs-6 fw-semibold mb-2">Estado de Movilidad:</label>
                <Field name="mobility_status" v-slot="{ field, errorMessage }">
                  <select
                    v-bind="field"
                    class="form-select"
                    :class="{ 'is-invalid': errorMessage }"
                  >
                    <option value="">Seleccionar estado...</option>
                    <option value="normal">Normal</option>
                    <option value="impaired">Limitada</option>
                    <option value="wheelchair">Silla de Ruedas</option>
                    <option value="walker">Andadera</option>
                    <option value="crutches">Muletas</option>
                  </select>
                  <div v-if="errorMessage" class="invalid-feedback">
                    {{ errorMessage }}
                  </div>
                </Field>
              </div>
              <div class="col-md-4">
                <label class="fs-6 fw-semibold mb-2">Notas de Movilidad:</label>
                <Field name="mobility_notes" v-slot="{ field, errorMessage }">
                  <textarea
                    v-bind="field"
                    class="form-control"
                    :class="{ 'is-invalid': errorMessage }"
                    rows="2"
                    placeholder="Detalles adicionales sobre la movilidad..."
                  ></textarea>
                  <div v-if="errorMessage" class="invalid-feedback">
                    {{ errorMessage }}
                  </div>
                </Field>
              </div>
            </div>

            <!-- Physical Characteristics -->
            <div class="separator separator-dashed my-5"></div>
            <h4 class="fw-bold text-gray-700 mb-7">Características Físicas</h4>
            
            <div class="row mb-8">
              <div class="col-md-3">
                <label class="fs-6 fw-semibold mb-2">Color de Ojos:</label>
                <Field name="eye_color" v-slot="{ field, errorMessage }">
                  <select
                    v-bind="field"
                    class="form-select"
                    :class="{ 'is-invalid': errorMessage }"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="brown">Café</option>
                    <option value="black">Negro</option>
                    <option value="blue">Azul</option>
                    <option value="green">Verde</option>
                    <option value="hazel">Avellana</option>
                    <option value="gray">Gris</option>
                  </select>
                  <div v-if="errorMessage" class="invalid-feedback">
                    {{ errorMessage }}
                  </div>
                </Field>
              </div>
              <div class="col-md-3">
                <label class="fs-6 fw-semibold mb-2">Forma de Ojos:</label>
                <Field name="eye_shape" v-slot="{ field, errorMessage }">
                  <select
                    v-bind="field"
                    class="form-select"
                    :class="{ 'is-invalid': errorMessage }"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="round">Redondos</option>
                    <option value="almond">Almendrados</option>
                    <option value="hooded">Encapuchados</option>
                    <option value="upturned">Levantados</option>
                    <option value="downturned">Caídos</option>
                  </select>
                  <div v-if="errorMessage" class="invalid-feedback">
                    {{ errorMessage }}
                  </div>
                </Field>
              </div>
              <div class="col-md-3">
                <label class="fs-6 fw-semibold mb-2">Color de Cabello:</label>
                <Field name="hair_color" v-slot="{ field, errorMessage }">
                  <select
                    v-bind="field"
                    class="form-select"
                    :class="{ 'is-invalid': errorMessage }"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="black">Negro</option>
                    <option value="brown">Café</option>
                    <option value="blonde">Rubio</option>
                    <option value="red">Rojo</option>
                    <option value="gray">Gris</option>
                    <option value="white">Blanco</option>
                    <option value="bald">Calvo</option>
                  </select>
                  <div v-if="errorMessage" class="invalid-feedback">
                    {{ errorMessage }}
                  </div>
                </Field>
              </div>
              <div class="col-md-3">
                <label class="fs-6 fw-semibold mb-2">Tipo de Cabello:</label>
                <Field name="hair_type" v-slot="{ field, errorMessage }">
                  <select
                    v-bind="field"
                    class="form-select"
                    :class="{ 'is-invalid': errorMessage }"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="straight">Liso</option>
                    <option value="wavy">Ondulado</option>
                    <option value="curly">Rizado</option>
                    <option value="kinky">Muy Rizado</option>
                    <option value="bald">Calvo</option>
                  </select>
                  <div v-if="errorMessage" class="invalid-feedback">
                    {{ errorMessage }}
                  </div>
                </Field>
              </div>
            </div>

            <div class="row mb-8">
              <div class="col-md-4">
                <label class="fs-6 fw-semibold mb-2">Tono de Piel:</label>
                <Field name="skin_tone" v-slot="{ field, errorMessage }">
                  <select
                    v-bind="field"
                    class="form-select"
                    :class="{ 'is-invalid': errorMessage }"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="very_light">Muy Claro</option>
                    <option value="light">Claro</option>
                    <option value="medium">Medio</option>
                    <option value="olive">Oliva</option>
                    <option value="tan">Moreno</option>
                    <option value="dark">Oscuro</option>
                    <option value="very_dark">Muy Oscuro</option>
                  </select>
                  <div v-if="errorMessage" class="invalid-feedback">
                    {{ errorMessage }}
                  </div>
                </Field>
              </div>
              <div class="col-md-4">
                <label class="fs-6 fw-semibold mb-2">Forma de Cara:</label>
                <Field name="face_shape" v-slot="{ field, errorMessage }">
                  <select
                    v-bind="field"
                    class="form-select"
                    :class="{ 'is-invalid': errorMessage }"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="oval">Ovalada</option>
                    <option value="round">Redonda</option>
                    <option value="square">Cuadrada</option>
                    <option value="heart">Corazón</option>
                    <option value="diamond">Diamante</option>
                    <option value="long">Alargada</option>
                  </select>
                  <div v-if="errorMessage" class="invalid-feedback">
                    {{ errorMessage }}
                  </div>
                </Field>
              </div>
              <div class="col-md-4">
                <label class="fs-6 fw-semibold mb-2">Tipo de Nariz:</label>
                <Field name="nose_type" v-slot="{ field, errorMessage }">
                  <select
                    v-bind="field"
                    class="form-select"
                    :class="{ 'is-invalid': errorMessage }"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="straight">Recta</option>
                    <option value="aquiline">Aguileña</option>
                    <option value="snub">Chata</option>
                    <option value="roman">Romana</option>
                    <option value="button">Respingona</option>
                    <option value="crooked">Torcida</option>
                  </select>
                  <div v-if="errorMessage" class="invalid-feedback">
                    {{ errorMessage }}
                  </div>
                </Field>
              </div>
            </div>

            <!-- Distinguishing Marks -->
            <div class="separator separator-dashed my-5"></div>
            <h4 class="fw-bold text-gray-700 mb-7">Marcas Distintivas</h4>
            
            <div class="row mb-8">
              <div class="col-md-6">
                <label class="fs-6 fw-semibold mb-2">Descripción de Tatuajes:</label>
                <Field name="tattoos_description" v-slot="{ field, errorMessage }">
                  <textarea
                    v-bind="field"
                    class="form-control"
                    :class="{ 'is-invalid': errorMessage }"
                    rows="3"
                    placeholder="Describir tatuajes, ubicación, colores, etc..."
                  ></textarea>
                  <div v-if="errorMessage" class="invalid-feedback">
                    {{ errorMessage }}
                  </div>
                </Field>
              </div>
              <div class="col-md-6">
                <label class="fs-6 fw-semibold mb-2">Ubicaciones de Tatuajes:</label>
                <div class="d-flex flex-wrap gap-3">
                  <div class="form-check form-check-custom form-check-solid">
                    <Field name="tattoos_locations" type="checkbox" value="face" v-slot="{ field }">
                      <input
                        v-bind="field"
                        class="form-check-input"
                        type="checkbox"
                        id="tattoo_face"
                      />
                      <label class="form-check-label" for="tattoo_face">Cara</label>
                    </Field>
                  </div>
                  <div class="form-check form-check-custom form-check-solid">
                    <Field name="tattoos_locations" type="checkbox" value="neck" v-slot="{ field }">
                      <input
                        v-bind="field"
                        class="form-check-input"
                        type="checkbox"
                        id="tattoo_neck"
                      />
                      <label class="form-check-label" for="tattoo_neck">Cuello</label>
                    </Field>
                  </div>
                  <div class="form-check form-check-custom form-check-solid">
                    <Field name="tattoos_locations" type="checkbox" value="arms" v-slot="{ field }">
                      <input
                        v-bind="field"
                        class="form-check-input"
                        type="checkbox"
                        id="tattoo_arms"
                      />
                      <label class="form-check-label" for="tattoo_arms">Brazos</label>
                    </Field>
                  </div>
                  <div class="form-check form-check-custom form-check-solid">
                    <Field name="tattoos_locations" type="checkbox" value="hands" v-slot="{ field }">
                      <input
                        v-bind="field"
                        class="form-check-input"
                        type="checkbox"
                        id="tattoo_hands"
                      />
                      <label class="form-check-label" for="tattoo_hands">Manos</label>
                    </Field>
                  </div>
                  <div class="form-check form-check-custom form-check-solid">
                    <Field name="tattoos_locations" type="checkbox" value="chest" v-slot="{ field }">
                      <input
                        v-bind="field"
                        class="form-check-input"
                        type="checkbox"
                        id="tattoo_chest"
                      />
                      <label class="form-check-label" for="tattoo_chest">Pecho</label>
                    </Field>
                  </div>
                  <div class="form-check form-check-custom form-check-solid">
                    <Field name="tattoos_locations" type="checkbox" value="back" v-slot="{ field }">
                      <input
                        v-bind="field"
                        class="form-check-input"
                        type="checkbox"
                        id="tattoo_back"
                      />
                      <label class="form-check-label" for="tattoo_back">Espalda</label>
                    </Field>
                  </div>
                  <div class="form-check form-check-custom form-check-solid">
                    <Field name="tattoos_locations" type="checkbox" value="legs" v-slot="{ field }">
                      <input
                        v-bind="field"
                        class="form-check-input"
                        type="checkbox"
                        id="tattoo_legs"
                      />
                      <label class="form-check-label" for="tattoo_legs">Piernas</label>
                    </Field>
                  </div>
                </div>
              </div>
            </div>

            <div class="row mb-8">
              <div class="col-md-6">
                <label class="fs-6 fw-semibold mb-2">Descripción de Cicatrices:</label>
                <Field name="scars_description" v-slot="{ field, errorMessage }">
                  <textarea
                    v-bind="field"
                    class="form-control"
                    :class="{ 'is-invalid': errorMessage }"
                    rows="3"
                    placeholder="Describir cicatrices, tamaño, forma, causa..."
                  ></textarea>
                  <div v-if="errorMessage" class="invalid-feedback">
                    {{ errorMessage }}
                  </div>
                </Field>
              </div>
              <div class="col-md-6">
                <label class="fs-6 fw-semibold mb-2">Ubicaciones de Cicatrices:</label>
                <div class="d-flex flex-wrap gap-3">
                  <div class="form-check form-check-custom form-check-solid">
                    <Field name="scars_locations" type="checkbox" value="face" v-slot="{ field }">
                      <input
                        v-bind="field"
                        class="form-check-input"
                        type="checkbox"
                        id="scar_face"
                      />
                      <label class="form-check-label" for="scar_face">Cara</label>
                    </Field>
                  </div>
                  <div class="form-check form-check-custom form-check-solid">
                    <Field name="scars_locations" type="checkbox" value="neck" v-slot="{ field }">
                      <input
                        v-bind="field"
                        class="form-check-input"
                        type="checkbox"
                        id="scar_neck"
                      />
                      <label class="form-check-label" for="scar_neck">Cuello</label>
                    </Field>
                  </div>
                  <div class="form-check form-check-custom form-check-solid">
                    <Field name="scars_locations" type="checkbox" value="arms" v-slot="{ field }">
                      <input
                        v-bind="field"
                        class="form-check-input"
                        type="checkbox"
                        id="scar_arms"
                      />
                      <label class="form-check-label" for="scar_arms">Brazos</label>
                    </Field>
                  </div>
                  <div class="form-check form-check-custom form-check-solid">
                    <Field name="scars_locations" type="checkbox" value="hands" v-slot="{ field }">
                      <input
                        v-bind="field"
                        class="form-check-input"
                        type="checkbox"
                        id="scar_hands"
                      />
                      <label class="form-check-label" for="scar_hands">Manos</label>
                    </Field>
                  </div>
                  <div class="form-check form-check-custom form-check-solid">
                    <Field name="scars_locations" type="checkbox" value="chest" v-slot="{ field }">
                      <input
                        v-bind="field"
                        class="form-check-input"
                        type="checkbox"
                        id="scar_chest"
                      />
                      <label class="form-check-label" for="scar_chest">Pecho</label>
                    </Field>
                  </div>
                  <div class="form-check form-check-custom form-check-solid">
                    <Field name="scars_locations" type="checkbox" value="back" v-slot="{ field }">
                      <input
                        v-bind="field"
                        class="form-check-input"
                        type="checkbox"
                        id="scar_back"
                      />
                      <label class="form-check-label" for="scar_back">Espalda</label>
                    </Field>
                  </div>
                  <div class="form-check form-check-custom form-check-solid">
                    <Field name="scars_locations" type="checkbox" value="legs" v-slot="{ field }">
                      <input
                        v-bind="field"
                        class="form-check-input"
                        type="checkbox"
                        id="scar_legs"
                      />
                      <label class="form-check-label" for="scar_legs">Piernas</label>
                    </Field>
                  </div>
                </div>
              </div>
            </div>

            <div class="row mb-8">
              <div class="col-md-6">
                <label class="fs-6 fw-semibold mb-2">Lunares y Marcas de Nacimiento:</label>
                <Field name="birthmarks" v-slot="{ field, errorMessage }">
                  <textarea
                    v-bind="field"
                    class="form-control"
                    :class="{ 'is-invalid': errorMessage }"
                    rows="2"
                    placeholder="Describir lunares, marcas de nacimiento, ubicación..."
                  ></textarea>
                  <div v-if="errorMessage" class="invalid-feedback">
                    {{ errorMessage }}
                  </div>
                </Field>
              </div>
              <div class="col-md-6">
                <label class="fs-6 fw-semibold mb-2">Otras Marcas Distintivas:</label>
                <Field name="other_distinguishing_marks" v-slot="{ field, errorMessage }">
                  <textarea
                    v-bind="field"
                    class="form-control"
                    :class="{ 'is-invalid': errorMessage }"
                    rows="2"
                    placeholder="Otras características distintivas..."
                  ></textarea>
                  <div v-if="errorMessage" class="invalid-feedback">
                    {{ errorMessage }}
                  </div>
                </Field>
              </div>
            </div>

            <!-- Additional Characteristics -->
            <div class="separator separator-dashed my-5"></div>
            <h4 class="fw-bold text-gray-700 mb-7">Características Adicionales</h4>
            
            <div class="row mb-8">
              <div class="col-md-6">
                <label class="fs-6 fw-semibold mb-4">Características Faciales:</label>
                <div class="d-flex flex-wrap gap-5">
                  <div class="form-check form-check-custom form-check-solid">
                    <Field name="has_beard" type="checkbox" v-slot="{ field }">
                      <input
                        v-bind="field"
                        class="form-check-input"
                        type="checkbox"
                        id="has_beard"
                      />
                      <label class="form-check-label" for="has_beard">Tiene Barba</label>
                    </Field>
                  </div>
                  <div class="form-check form-check-custom form-check-solid">
                    <Field name="has_mustache" type="checkbox" v-slot="{ field }">
                      <input
                        v-bind="field"
                        class="form-check-input"
                        type="checkbox"
                        id="has_mustache"
                      />
                      <label class="form-check-label" for="has_mustache">Tiene Bigote</label>
                    </Field>
                  </div>
                  <div class="form-check form-check-custom form-check-solid">
                    <Field name="wears_glasses" type="checkbox" v-slot="{ field }">
                      <input
                        v-bind="field"
                        class="form-check-input"
                        type="checkbox"
                        id="wears_glasses"
                      />
                      <label class="form-check-label" for="wears_glasses">Usa Anteojos</label>
                    </Field>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <label class="fs-6 fw-semibold mb-4">Habilidades:</label>
                <div class="d-flex flex-wrap gap-5">
                  <div class="form-check form-check-custom form-check-solid">
                    <Field name="can_read" type="checkbox" v-slot="{ field }">
                      <input
                        v-bind="field"
                        class="form-check-input"
                        type="checkbox"
                        id="can_read"
                      />
                      <label class="form-check-label" for="can_read">Sabe Leer</label>
                    </Field>
                  </div>
                  <div class="form-check form-check-custom form-check-solid">
                    <Field name="can_write" type="checkbox" v-slot="{ field }">
                      <input
                        v-bind="field"
                        class="form-check-input"
                        type="checkbox"
                        id="can_write"
                      />
                      <label class="form-check-label" for="can_write">Sabe Escribir</label>
                    </Field>
                  </div>
                </div>
              </div>
            </div>

            <!-- Medical/Dental Information -->
            <div class="row mb-8">
              <div class="col-md-6">
                <div class="form-check form-check-custom form-check-solid mb-3">
                  <Field name="has_dental_work" type="checkbox" v-slot="{ field }">
                    <input
                      v-bind="field"
                      class="form-check-input"
                      type="checkbox"
                      id="has_dental_work"
                    />
                    <label class="form-check-label fw-semibold" for="has_dental_work">
                      Tiene Trabajo Dental
                    </label>
                  </Field>
                </div>
                <Field name="dental_characteristics" v-slot="{ field, errorMessage }">
                  <textarea
                    v-bind="field"
                    class="form-control"
                    :class="{ 'is-invalid': errorMessage }"
                    rows="2"
                    placeholder="Describir trabajo dental, prótesis, dientes faltantes..."
                  ></textarea>
                  <div v-if="errorMessage" class="invalid-feedback">
                    {{ errorMessage }}
                  </div>
                </Field>
              </div>
              <div class="col-md-6">
                <div class="form-check form-check-custom form-check-solid mb-3">
                  <Field name="has_prosthetics" type="checkbox" v-slot="{ field }">
                    <input
                      v-bind="field"
                      class="form-check-input"
                      type="checkbox"
                      id="has_prosthetics"
                    />
                    <label class="form-check-label fw-semibold" for="has_prosthetics">
                      Tiene Prótesis
                    </label>
                  </Field>
                </div>
                <Field name="prosthetics_description" v-slot="{ field, errorMessage }">
                  <textarea
                    v-bind="field"
                    class="form-control"
                    :class="{ 'is-invalid': errorMessage }"
                    rows="2"
                    placeholder="Describir prótesis, implantes, dispositivos médicos..."
                  ></textarea>
                  <div v-if="errorMessage" class="invalid-feedback">
                    {{ errorMessage }}
                  </div>
                </Field>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="close">
              Cancelar
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isEditing ? 'Actualizar' : 'Guardar' }} Perfil
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { Modal } from 'bootstrap';
import { Form, Field } from 'vee-validate';
import * as yup from 'yup';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';

// Props
interface Props {
  profile?: any;
  show: boolean;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  close: [];
  saved: [profile: any];
}>();

// State
const modalRef = ref<HTMLElement>();
const modal = ref<Modal>();
const loading = ref(false);
const availableInmates = ref<any[]>([]);
const bloodTypes = ref<any[]>([]);

// Computed
const isEditing = computed(() => !!props.profile?.id);

// Validation Schema
const validationSchema = yup.object({
  inmate_id: yup.number().when('$isEditing', {
    is: false,
    then: (schema) => schema.required('El interno es requerido'),
    otherwise: (schema) => schema.nullable()
  }),
  height: yup.number()
    .required('La estatura es requerida')
    .min(50, 'La estatura debe ser mayor a 50 cm')
    .max(250, 'La estatura debe ser menor a 250 cm'),
  weight: yup.number()
    .required('El peso es requerido')
    .min(20, 'El peso debe ser mayor a 20 kg')
    .max(300, 'El peso debe ser menor a 300 kg'),
  build_type: yup.string().required('El tipo físico es requerido'),
  blood_type_id: yup.number().nullable(),
  mobility_status: yup.string().nullable(),
  mobility_notes: yup.string().nullable(),
  eye_color: yup.string().nullable(),
  eye_shape: yup.string().nullable(),
  hair_color: yup.string().nullable(),
  hair_type: yup.string().nullable(),
  skin_tone: yup.string().nullable(),
  face_shape: yup.string().nullable(),
  nose_type: yup.string().nullable(),
  tattoos_description: yup.string().nullable(),
  tattoos_locations: yup.array().nullable(),
  scars_description: yup.string().nullable(),
  scars_locations: yup.array().nullable(),
  birthmarks: yup.string().nullable(),
  other_distinguishing_marks: yup.string().nullable(),
  has_beard: yup.boolean().default(false),
  has_mustache: yup.boolean().default(false),
  wears_glasses: yup.boolean().default(false),
  can_read: yup.boolean().default(false),
  can_write: yup.boolean().default(false),
  has_dental_work: yup.boolean().default(false),
  dental_characteristics: yup.string().nullable(),
  has_prosthetics: yup.boolean().default(false),
  prosthetics_description: yup.string().nullable()
});

// Watchers
watch(() => props.show, async (show) => {
  if (show) {
    await nextTick();
    if (modalRef.value) {
      modal.value = new Modal(modalRef.value);
      modal.value.show();
      await loadFormData();
    }
  } else {
    modal.value?.hide();
  }
});

// Methods
const loadFormData = async () => {
  try {
    loading.value = true;
    
    // Load blood types
    const bloodTypesResponse = await ApiService.get('/catalogs/blood-types');
    if (bloodTypesResponse.data.success) {
      bloodTypes.value = bloodTypesResponse.data.data;
    }
    
    // Load available inmates (only for new profiles)
    if (!isEditing.value) {
      const inmatesResponse = await ApiService.get('/inmates/without-physical-profile');
      if (inmatesResponse.data.success) {
        availableInmates.value = inmatesResponse.data.data;
      }
    }
  } catch (err: any) {
    console.error('Error loading form data:', err);
    await Swal.fire({
      title: 'Error',
      text: 'Error al cargar los datos del formulario',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async (values: any) => {
  try {
    loading.value = true;
    
    // Prepare form data
    const formData = {
      ...values,
      // Convert boolean checkbox values
      has_beard: !!values.has_beard,
      has_mustache: !!values.has_mustache,
      wears_glasses: !!values.wears_glasses,
      can_read: !!values.can_read,
      can_write: !!values.can_write,
      has_dental_work: !!values.has_dental_work,
      has_prosthetics: !!values.has_prosthetics
    };
    
    let response;
    if (isEditing.value) {
      response = await ApiService.put(`/inmate-physical-profiles/${props.profile.id}`, formData);
    } else {
      response = await ApiService.post('/inmate-physical-profiles', formData);
    }
    
    if (response.data.success) {
      await Swal.fire({
        title: 'Perfil Físico Guardado',
        text: `El perfil físico ha sido ${isEditing.value ? 'actualizado' : 'creado'} exitosamente`,
        icon: 'success',
        timer: 2000
      });
      
      emit('saved', response.data.data);
    }
  } catch (err: any) {
    await Swal.fire({
      title: 'Error',
      text: err.response?.data?.message || `Error al ${isEditing.value ? 'actualizar' : 'crear'} el perfil físico`,
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const close = () => {
  modal.value?.hide();
  emit('close');
};

// Setup modal event listeners
onMounted(() => {
  if (modalRef.value) {
    modalRef.value.addEventListener('hidden.bs.modal', () => {
      emit('close');
    });
  }
});
</script>