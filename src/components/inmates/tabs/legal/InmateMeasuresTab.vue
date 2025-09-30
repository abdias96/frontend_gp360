<template>
  <div class="d-flex flex-column gap-5">
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <h3 class="fw-bold text-gray-900">Medidas Cautelares</h3>
        <p class="text-muted fs-7">Medidas aplicadas durante el proceso</p>
      </div>
    </div>

    <div class="card">
      <div class="card-body text-center py-10">
        <i class="ki-duotone ki-shield-tick fs-5x text-muted mb-5">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
        <h4 class="text-muted">Módulo en desarrollo</h4>
        <p class="text-muted fs-7">Las medidas cautelares estarán disponibles próximamente</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  inmateId: number;
}
defineProps<Props>();
</script>