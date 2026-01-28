<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Ingreso de PPL - Nuevo Interno</h3>
    </div>
    <div class="card-body">
      <div class="d-flex flex-column flex-lg-row">
        <!-- Stepper Navigation - Left Side -->
        <div class="flex-column flex-lg-row-auto w-lg-250px w-xl-300px me-lg-10 mb-10 mb-lg-0">
          <div class="card card-flush bg-light-primary">
            <div class="card-body">
              <AdmissionStepper :current-step="currentStep" @go-to-step="goToStep" />
            </div>
          </div>
        </div>

        <!-- Step Content - Right Side -->
        <div class="flex-lg-row-fluid">
          <div class="tab-content">
            <Step1Identification v-show="currentStep === 1" />
            <Step2LegalReception v-show="currentStep === 2" />
            <Step3Security v-show="currentStep === 3" />
            <Step4Physical v-show="currentStep === 4" />
            <Step5Belongings v-show="currentStep === 5" />
            <Step6Medical v-show="currentStep === 6" />
            <Step7Assignment v-show="currentStep === 7" />

            <!-- Navigation Buttons -->
            <div class="d-flex justify-content-between mt-8 pt-5 border-top">
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
                Completar Admision
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAdmissionWizard } from '@/modules/operations/composables/useAdmissionWizard';

// Import components
import AdmissionStepper from '../components/admission/AdmissionStepper.vue';
import Step1Identification from '../components/admission/steps/Step1Identification.vue';
import Step2LegalReception from '../components/admission/steps/Step2LegalReception.vue';
import Step3Security from '../components/admission/steps/Step3Security.vue';
import Step4Physical from '../components/admission/steps/Step4Physical.vue';
import Step5Belongings from '../components/admission/steps/Step5Belongings.vue';
import Step6Medical from '../components/admission/steps/Step6Medical.vue';
import Step7Assignment from '../components/admission/steps/Step7Assignment.vue';

const {
  currentStep,
  previousStep,
  goToStep,
  resetWizard,
  handleStepSubmit,
  completeAdmission,
  loadCatalogs
} = useAdmissionWizard();

// Lifecycle
onMounted(async () => {
  resetWizard(); // Reset state for new admission
  await loadCatalogs();
});
</script>
