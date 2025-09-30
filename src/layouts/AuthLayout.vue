<template>
  <!--begin::Authentication Layout -->
  <div class="d-flex flex-column flex-lg-row flex-column-fluid">
    <!--begin::Body-->
    <div
      class="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1"
    >
      <!--begin::Form-->
      <div class="d-flex flex-center flex-column flex-lg-row-fluid">
        <!--begin::Wrapper-->
        <div class="w-lg-500px p-10">
          <router-view></router-view>
        </div>
        <!--end::Wrapper-->
      </div>
      <!--end::Form-->
    </div>
    <!--end::Body-->

    <!--begin::Aside-->
    <div
      class="d-flex flex-lg-row-fluid w-lg-50 order-1 order-lg-2"
      style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    >
      <!--begin::Content-->
      <div
        class="d-flex flex-column flex-center py-7 py-lg-15 px-5 px-md-15 w-100"
      >
        <!--begin::Logo-->
        <div class="mb-0 mb-lg-12">
          <h2 class="text-white fw-bolder">GP360</h2>
        </div>
        <!--end::Logo-->

        <!--begin::Title-->
        <h1
          class="d-none d-lg-block text-white fs-2qx fw-bolder text-center mb-7"
        >
Gestión Penitenciaria 360
        </h1>
        <!--end::Title-->

        <!--begin::Text-->
        <div
          class="d-none d-lg-block text-white fs-base text-center opacity-75"
        >
          Accede al sistema con tus credenciales proporcionadas por el
          administrador.
        </div>
        <!--end::Text-->
      </div>
      <!--end::Content-->
    </div>
    <!--end::Aside-->
  </div>
  <!--end::Authentication Layout -->
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import LayoutService from "@/core/services/LayoutService";
import { useBodyStore } from "@/stores/body";

const store = useBodyStore();

onMounted(() => {
  LayoutService.emptyElementClassesAndAttributes(document.body);

  store.addBodyClassname("app-blank");
  store.addBodyClassname("bg-body");
});
</script>
