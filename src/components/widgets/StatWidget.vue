<template>
  <div class="card" :class="`card-${color}`">
    <div class="card-body">
      <div class="d-flex align-items-center">
        <!-- Icon -->
        <div class="symbol symbol-50px me-3">
          <div :class="`symbol-label bg-light-${color}`">
            <KTIcon
              :icon-name="icon"
              :icon-class="`fs-2x text-${color}`"
            />
          </div>
        </div>

        <!-- Content -->
        <div class="d-flex flex-column flex-grow-1">
          <span class="text-gray-900 fw-bold fs-6">{{ title }}</span>
          <div class="d-flex align-items-baseline">
            <span class="text-gray-900 fw-bold fs-2x me-2">{{ value }}</span>

            <!-- Trend indicator -->
            <span v-if="trend" class="d-flex align-items-center">
              <i
                :class="[
                  'ki-duotone fs-2',
                  trend === 'up' ? 'ki-arrow-up text-success' : 'ki-arrow-down text-danger'
                ]"
              >
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <span
                :class="[
                  'fw-bold fs-7 ms-1',
                  trend === 'up' ? 'text-success' : 'text-danger'
                ]"
              >
                {{ percentage }}%
              </span>
            </span>

            <!-- Badge -->
            <span v-if="badge" :class="`badge badge-light-${badgeColor || color} ms-2`">
              {{ badge }}
            </span>
          </div>
          <span class="text-gray-600 fw-semibold fs-7">{{ description }}</span>

          <!-- Progress bar -->
          <div v-if="showProgressBar" class="mt-3">
            <div class="progress h-6px">
              <div
                class="progress-bar"
                :class="[
                  percentage > 90 ? 'bg-danger' :
                  percentage > 75 ? 'bg-warning' :
                  'bg-success'
                ]"
                role="progressbar"
                :style="`width: ${percentage}%`"
                :aria-valuenow="percentage"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>

        <!-- Pulse animation for alerts -->
        <div v-if="pulse" class="position-absolute top-0 end-0 mt-3 me-3">
          <span class="pulse-ring"></span>
          <span :class="`badge badge-circle badge-${color} pulse`">!</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  value: string | number;
  description: string;
  icon: string;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'dark';
  trend?: 'up' | 'down';
  percentage?: number;
  badge?: string;
  badgeColor?: string;
  showProgressBar?: boolean;
  pulse?: boolean;
}

withDefaults(defineProps<Props>(), {
  color: 'primary',
  showProgressBar: false,
  pulse: false
});
</script>

<style scoped>
.card {
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
  box-shadow: 0 0 20px 0 rgba(76, 87, 125, 0.02);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 35px 0 rgba(76, 87, 125, 0.08);
}

.card-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-primary .text-gray-900,
.card-primary .text-gray-600 {
  color: white !important;
}

.card-success {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.card-success .text-gray-900,
.card-success .text-gray-600 {
  color: white !important;
}

.card-warning {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.card-warning .text-gray-900,
.card-warning .text-gray-600 {
  color: white !important;
}

.card-danger {
  background: linear-gradient(135deg, #f43b47 0%, #453a94 100%);
  color: white;
}

.card-danger .text-gray-900,
.card-danger .text-gray-600 {
  color: white !important;
}

.card-info {
  background: linear-gradient(135deg, #3ab5b0 0%, #3d99be 31%, #56317a 100%);
  color: white;
}

.card-info .text-gray-900,
.card-info .text-gray-600 {
  color: white !important;
}

/* Pulse animation */
@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);
    transform: scale(1);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 82, 82, 0);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
    transform: scale(1);
  }
}

.pulse {
  animation: pulse-animation 2s infinite;
}

.pulse-ring {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  animation: pulse-animation 2s infinite;
  background-color: rgba(255, 82, 82, 0.4);
}

.badge-circle {
  width: 20px;
  height: 20px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
</style>