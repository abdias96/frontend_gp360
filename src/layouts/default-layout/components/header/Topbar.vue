<template>
  <!--begin::Toolbar wrapper-->
  <div class="d-flex flex-shrink-0">
    <!--begin::Theme mode-->
    <div class="d-flex ms-3">
      <!--begin::Menu toggle-->
      <a
        href="#"
        class="btn btn-icon flex-center bg-body btn-color-gray-600 btn-active-color-primary h-40px"
        data-kt-menu-trigger="{default:'click', lg: 'hover'}"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
      >
        <KTIcon icon-name="night-day" icon-class="theme-light-show fs-2" />
        <KTIcon icon-name="moon" icon-class="theme-dark-show fs-2" />
      </a>
      <!--begin::Menu toggle-->
      <KTThemeModeSwitcher></KTThemeModeSwitcher>
    </div>
    <!--end::Theme mode-->

    <div class="d-flex align-items-center ms-3">
      <!--begin::Menu wrapper-->
      <div
        class="btn btn-icon btn-primary w-40px h-40px pulse pulse-white"
        id="kt_drawer_chat_toggle"
      >
        <KTIcon icon-name="message-text-2" icon-class="fs-2" />
        <span class="pulse-ring"></span>
      </div>
      <!--end::Menu wrapper-->
    </div>
    <!--end::Chat-->
  </div>
  <!--end::Toolbar wrapper-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import KTThemeModeSwitcher from "@/layouts/default-layout/components/theme-mode/ThemeModeSwitcher.vue";

export default defineComponent({
  name: "layout-topbar",
  components: {
    KTThemeModeSwitcher,
  },
  setup() {
    return {
      getAssetPath,
    };
  },
});
</script>
