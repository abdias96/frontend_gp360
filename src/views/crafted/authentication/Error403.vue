<template>
  <div class="d-flex flex-column flex-root">
    <div class="d-flex flex-column flex-center flex-column-fluid">
      <div class="d-flex flex-column text-center p-10">
        <div class="pt-lg-10 mb-10">
          <h1 class="fw-bolder fs-2qx text-gray-800 mb-7">403</h1>
          <div class="fw-semibold fs-6 text-gray-500 mb-7">Acceso Denegado</div>
          <div class="fw-semibold fs-6 text-gray-600 mb-10">
            No tienes permisos suficientes para acceder a esta página.
            <br />Contacta al administrador si crees que esto es un error.
          </div>
        </div>
        <div class="text-center">
          <router-link
            :to="{ name: canAccessDashboard ? 'dashboard' : 'user-profile' }"
            class="btn btn-lg btn-primary fw-bolder"
          >
            {{ canAccessDashboard ? "Ir al Dashboard" : "Ir a Mi Perfil" }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const canAccessDashboard = computed(() => {
  return authStore.hasPermission("dashboard.view");
});
</script>
