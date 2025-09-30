<template>
  <!--begin::Footer-->
  <div class="footer py-4 d-flex flex-lg-column" id="kt_footer">
    <!--begin::Container-->
    <div
      class="d-flex flex-column flex-md-row align-items-center justify-content-between"
      :class="{
        'container-fluid': footerWidthFluid,
        'container-xxl': !footerWidthFluid,
      }"
    >
      <!--begin::Copyright-->
      <div class="text-gray-900 order-2 order-md-1">
        <span class="text-muted fw-semibold me-1">{{ currentYear }}&copy;</span>
        <span class="text-gray-800 fw-semibold">DGSP Guatemala</span>
        <span class="text-muted fw-semibold mx-2">-</span>
        <span class="text-gray-800 fw-semibold">GP360</span>
      </div>
      <!--end::Copyright-->

      <!--begin::Menu-->
      <ul class="menu menu-gray-600 menu-hover-primary fw-semibold order-1">
        <li class="menu-item">
          <router-link to="/system/sessions" class="menu-link px-2">{{
            $t("menu.sessionManager")
          }}</router-link>
        </li>

        <li class="menu-item">
          <router-link to="/system/logs" class="menu-link px-2">{{
            $t("menu.systemLogs")
          }}</router-link>
        </li>

        <li class="menu-item">
          <router-link to="/reports/user-activity" class="menu-link px-2">{{
            $t("menu.reports")
          }}</router-link>
        </li>
      </ul>
      <!--end::Menu-->
    </div>
    <!--end::Container-->
  </div>
  <!--end::Footer-->
</template>

<script setup lang="ts">
import { computed } from "vue";
import { footerWidthFluid } from "@/layouts/default-layout/config/helper";

// Computed
const currentYear = computed(() => new Date().getFullYear());
</script>
