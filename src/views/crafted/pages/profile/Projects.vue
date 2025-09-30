<template>
  <div class="card card-flush mb-6 mb-xl-9">
    <!--begin::Card header-->
    <div class="card-header mt-6">
      <!--begin::Card title-->
      <div class="card-title flex-column">
        <h2 class="mb-1">{{ $t("profile.projects.title") }}</h2>
        <div class="fs-6 fw-semibold text-muted">
          {{ $t("profile.projects.subtitle") }}
        </div>
      </div>
      <!--end::Card title-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body d-flex flex-column">
      <!--begin::Empty state-->
      <div class="text-center py-15">
        <KTIcon icon-name="folder-document" icon-class="fs-1 text-muted mb-5" />
        <h4 class="text-muted mb-3">{{ $t("profile.projects.noProjects") }}</h4>
        <p class="text-gray-500 fs-6 mb-5">
          {{ $t("profile.projects.noProjectsDescription") }}
        </p>
        <button class="btn btn-primary" disabled>
          <KTIcon icon-name="plus" icon-class="fs-2" />
          {{ $t("profile.projects.addProject") }}
        </button>
      </div>
      <!--end::Empty state-->
    </div>
    <!--end::Card body-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";

export default defineComponent({
  name: "profile-projects",
  components: {
    KTIcon,
  },
});
</script>

<style scoped>
.card-flush {
  box-shadow: none;
  border: 1px solid var(--bs-gray-200);
}
</style>
