<template>
  <div class="tab-pane fade show active">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">{{ t('admissions.wizard.sections.physicalCharacteristics') }}</h3>
      </div>
      <div class="card-body">
        <div class="row g-5">
          <!-- Physical Measurements -->
          <div class="col-md-3">
            <label class="form-label">{{ t('admissions.wizard.fields.height') }}</label>
            <input
              v-model.number="physicalProfile.height"
              type="number"
              class="form-control"
              min="100"
              max="250"
            />
          </div>

          <div class="col-md-3">
            <label class="form-label">{{ t('admissions.wizard.fields.weight') }}</label>
            <input
              v-model.number="physicalProfile.weight"
              type="number"
              class="form-control"
              min="30"
              max="200"
            />
          </div>

          <div class="col-md-3">
            <label class="form-label">{{ t('admissions.wizard.fields.build') }}</label>
            <select v-model="physicalProfile.build_type" class="form-select">
              <option value="">{{ t('admissions.wizard.fields.select') }}</option>
              <option value="delgado">{{ t('admissions.wizard.fields.buildThin') }}</option>
              <option value="normal">{{ t('admissions.wizard.fields.buildNormal') }}</option>
              <option value="robusto">{{ t('admissions.wizard.fields.buildRobust') }}</option>
              <option value="atletico">{{ t('admissions.wizard.fields.buildAthletic') }}</option>
              <option value="obeso">{{ t('admissions.wizard.fields.buildObese') }}</option>
            </select>
          </div>

          <div class="col-md-3">
            <label class="form-label">{{ t('admissions.wizard.fields.bloodType') }}</label>
            <select v-model="physicalProfile.blood_type_id" class="form-select">
              <option value="">{{ t('admissions.wizard.fields.select') }}</option>
              <option v-for="type in bloodTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>

          <!-- Additional Physical Characteristics -->
          <div class="col-md-3">
            <label class="form-label">{{ t('admissions.wizard.fields.skinTone') }}</label>
            <select v-model="physicalProfile.skin_tone" class="form-select">
              <option value="">{{ t('admissions.wizard.fields.select') }}</option>
              <option value="blanca">{{ t('admissions.wizard.fields.skinWhite') }}</option>
              <option value="morena_clara">{{ t('admissions.wizard.fields.skinLightBrown') }}</option>
              <option value="morena">{{ t('admissions.wizard.fields.skinBrown') }}</option>
              <option value="morena_oscura">{{ t('admissions.wizard.fields.skinDarkBrown') }}</option>
              <option value="negra">{{ t('admissions.wizard.fields.skinBlack') }}</option>
            </select>
          </div>

          <div class="col-md-3">
            <label class="form-label">{{ t('admissions.wizard.fields.eyeColor') }}</label>
            <select v-model="physicalProfile.eye_color" class="form-select">
              <option value="">{{ t('admissions.wizard.fields.select') }}</option>
              <option value="negros">{{ t('admissions.wizard.fields.eyeBlack') }}</option>
              <option value="cafe_oscuro">{{ t('admissions.wizard.fields.eyeDarkBrown') }}</option>
              <option value="cafe">{{ t('admissions.wizard.fields.eyeBrown') }}</option>
              <option value="cafe_claro">{{ t('admissions.wizard.fields.eyeLightBrown') }}</option>
              <option value="miel">{{ t('admissions.wizard.fields.eyeHazel') }}</option>
              <option value="verdes">{{ t('admissions.wizard.fields.eyeGreen') }}</option>
              <option value="azules">{{ t('admissions.wizard.fields.eyeBlue') }}</option>
              <option value="grises">{{ t('admissions.wizard.fields.eyeGray') }}</option>
            </select>
          </div>

          <div class="col-md-3">
            <label class="form-label">{{ t('admissions.wizard.fields.hairColor') }}</label>
            <select v-model="physicalProfile.hair_color" class="form-select">
              <option value="">{{ t('admissions.wizard.fields.select') }}</option>
              <option value="negro">{{ t('admissions.wizard.fields.hairBlack') }}</option>
              <option value="cafe_oscuro">{{ t('admissions.wizard.fields.hairDarkBrown') }}</option>
              <option value="cafe">{{ t('admissions.wizard.fields.hairBrown') }}</option>
              <option value="cafe_claro">{{ t('admissions.wizard.fields.hairLightBrown') }}</option>
              <option value="rubio">{{ t('admissions.wizard.fields.hairBlonde') }}</option>
              <option value="pelirrojo">{{ t('admissions.wizard.fields.hairRed') }}</option>
              <option value="canoso">{{ t('admissions.wizard.fields.hairGray') }}</option>
              <option value="calvo">{{ t('admissions.wizard.fields.hairBald') }}</option>
            </select>
          </div>

          <div class="col-md-3">
            <label class="form-label">{{ t('admissions.wizard.fields.hairType') }}</label>
            <select v-model="physicalProfile.hair_type" class="form-select">
              <option value="">{{ t('admissions.wizard.fields.select') }}</option>
              <option value="lacio">{{ t('admissions.wizard.fields.hairStraight') }}</option>
              <option value="ondulado">{{ t('admissions.wizard.fields.hairWavy') }}</option>
              <option value="rizado">{{ t('admissions.wizard.fields.hairCurly') }}</option>
              <option value="crespo">{{ t('admissions.wizard.fields.hairKinky') }}</option>
              <option value="calvo">{{ t('admissions.wizard.fields.hairBald') }}</option>
            </select>
          </div>

          <!-- Distinguishing Marks -->
          <div class="col-12">
            <div class="separator my-5"></div>
            <h5 class="mb-4">{{ t('admissions.wizard.sections.distinguishingMarks') }}</h5>
          </div>

          <div class="col-md-6">
            <label class="form-label">{{ t('admissions.wizard.fields.tattoos') }}</label>
            <textarea
              v-model="physicalProfile.tattoos_description"
              class="form-control"
              rows="3"
              :placeholder="t('admissions.wizard.messages.tattoosPlaceholder')"
            ></textarea>
          </div>

          <div class="col-md-6">
            <label class="form-label">{{ t('admissions.wizard.fields.scars') }}</label>
            <textarea
              v-model="physicalProfile.scars_description"
              class="form-control"
              rows="3"
              :placeholder="t('admissions.wizard.messages.scarsPlaceholder')"
            ></textarea>
          </div>

          <!-- Photo Capture -->
          <div class="col-12">
            <div class="separator my-5"></div>
            <h5 class="mb-4">
              {{ t('admissions.wizard.sections.photoCapture') }}
              <span class="badge badge-light-info ms-2">{{ t('admissions.wizard.fields.biometricOptional') }}</span>
            </h5>
            <div class="alert alert-info py-3 mb-4">
              <i class="ki-duotone ki-information fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
              {{ t('admissions.wizard.fields.photoOptionalInfo') }}
            </div>
            <div class="row g-3">
              <div class="col-md-3">
                <div class="card">
                  <div class="card-body text-center">
                    <i class="ki-duotone ki-user fs-3x mb-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                    <h6>{{ t('admissions.wizard.fields.photoFrontal') }}</h6>
                    <button
                      type="button"
                      @click="capturePhoto('frontal')"
                      class="btn btn-sm btn-primary mt-2"
                    >
                      {{ t('admissions.wizard.buttons.capture') }}
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
                    <h6>{{ t('admissions.wizard.fields.photoLeftProfile') }}</h6>
                    <button
                      type="button"
                      @click="capturePhoto('profile_left')"
                      class="btn btn-sm btn-primary mt-2"
                    >
                      {{ t('admissions.wizard.buttons.capture') }}
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
                    <h6>{{ t('admissions.wizard.fields.photoRightProfile') }}</h6>
                    <button
                      type="button"
                      @click="capturePhoto('profile_right')"
                      class="btn btn-sm btn-primary mt-2"
                    >
                      {{ t('admissions.wizard.buttons.capture') }}
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
                    <h6>{{ t('admissions.wizard.fields.photoFullBody') }}</h6>
                    <button
                      type="button"
                      @click="capturePhoto('full_body')"
                      class="btn btn-sm btn-primary mt-2"
                    >
                      {{ t('admissions.wizard.buttons.capture') }}
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
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAdmissionWizard } from '@/modules/operations/composables/useAdmissionWizard';

const { t } = useI18n();

const {
  physicalProfile,
  photos,
  bloodTypes,
  capturePhoto
} = useAdmissionWizard();
</script>
