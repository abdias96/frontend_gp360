<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <h3 class="fw-bold m-0">Documentos Digitales</h3>
      </div>
    </div>
    <div class="card-body pt-0">
      <div class="text-center py-10">
        <div class="mx-auto mb-4">
          <i class="ki-duotone ki-document fs-5x text-gray-400">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
        </div>
        <div class="fs-6 text-gray-600 mb-4">
          Gestión de documentos en desarrollo.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { InmateDetail } from "@/types/inmates";

interface Props {
  inmate: InmateDetail;
}

defineProps<Props>();
</script>
