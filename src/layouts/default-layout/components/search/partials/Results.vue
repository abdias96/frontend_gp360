<template>
  <div>
    <!--begin::Items-->
    <div class="scroll-y mh-200px mh-lg-325px">
      <!--begin::No results message-->
      <div class="text-center py-10">
        <KTIcon icon-name="magnifier" icon-class="fs-1 text-muted mb-3" />
        <h4 class="text-muted">{{ $t("common.messages.noResults") }}</h4>
        <p class="text-gray-500 fs-6">
          {{ $t("search.tryDifferentKeywords") }}
        </p>
      </div>
      <!--end::No results message-->
    </div>
    <!--end::Items-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";

export default defineComponent({
  name: "search-results",
  components: {
    KTIcon,
  },
});
</script>

<style scoped>
.scroll-y {
  overflow-y: auto;
}
</style>
