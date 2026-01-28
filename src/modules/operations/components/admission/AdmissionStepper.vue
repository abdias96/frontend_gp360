<template>
  <div class="stepper-nav py-5">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="stepper-item"
      :class="getStepClass(index + 1)"
    >
      <div
        class="stepper-wrapper d-flex align-items-center"
        :class="{ 'cursor-pointer': canNavigateTo(index + 1), 'cursor-not-allowed opacity-50': !canNavigateTo(index + 1) }"
        @click="handleStepClick(index + 1)"
      >
        <div class="stepper-icon w-40px h-40px rounded-circle d-flex align-items-center justify-content-center"
          :class="getIconClass(index + 1)">
          <i v-if="currentStep > index + 1" class="ki-duotone ki-check fs-2 text-white"></i>
          <span v-else class="stepper-number fw-bold">{{ index + 1 }}</span>
        </div>
        <div class="stepper-label ms-3">
          <h3 class="stepper-title fs-6 fw-bold mb-0" :class="getTitleClass(index + 1)">{{ step.title }}</h3>
          <div class="stepper-desc text-muted fs-7">{{ step.description }}</div>
        </div>
      </div>
      <div v-if="index < steps.length - 1" class="stepper-line h-40px bg-gray-200 ms-5 mt-2"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdmissionWizard } from '@/modules/operations/composables/useAdmissionWizard';

const props = defineProps<{
  currentStep: number;
}>();

const emit = defineEmits<{
  (e: 'go-to-step', step: number): void;
}>();

const { highestStepReached } = useAdmissionWizard();

const steps = [
  { title: 'Identificacion', description: 'Datos personales' },
  { title: 'Recepcion Legal', description: 'Casos y delitos' },
  { title: 'Seguridad', description: 'Evaluacion de riesgos' },
  { title: 'Fisico', description: 'Caracteristicas y fotos' },
  { title: 'Pertenencias', description: 'Inventario' },
  { title: 'Medico', description: 'Evaluacion inicial' },
  { title: 'Asignacion', description: 'Ubicacion final' }
];

const canNavigateTo = (step: number): boolean => {
  return step <= highestStepReached.value;
};

const handleStepClick = (step: number) => {
  if (canNavigateTo(step)) {
    emit('go-to-step', step);
  }
};

const getStepClass = (step: number): string => {
  if (props.currentStep === step) return 'current';
  if (props.currentStep > step) return 'completed';
  if (step <= highestStepReached.value) return 'pending';
  return 'disabled';
};

const getIconClass = (step: number): string => {
  if (props.currentStep === step) return 'bg-primary';
  if (props.currentStep > step) return 'bg-success';
  if (step <= highestStepReached.value) return 'bg-light-primary border border-primary';
  return 'bg-gray-200';
};

const getTitleClass = (step: number): string => {
  if (props.currentStep === step) return 'text-primary';
  if (props.currentStep > step) return 'text-success';
  if (step <= highestStepReached.value) return 'text-gray-700';
  return 'text-gray-400';
};
</script>

<style scoped>
.stepper-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stepper-item {
  position: relative;
}

.stepper-wrapper {
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.stepper-wrapper.cursor-pointer:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.stepper-line {
  width: 2px;
  margin-left: 19px;
}

.stepper-number {
  font-size: 1rem;
}

.cursor-not-allowed {
  cursor: not-allowed;
}

.cursor-pointer {
  cursor: pointer;
}

@media (min-width: 992px) {
  .stepper-nav {
    min-width: 250px;
  }
}
</style>
