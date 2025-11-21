<template>
  <div class="d-flex justify-content-end mb-10">
    <!--begin::Wrapper-->
    <div class="d-flex flex-column align-items-end">
      <!--begin::User-->
      <div class="d-flex align-items-center mb-2">
        <!--begin::Details-->
        <div class="me-3">
          <span class="text-muted fs-7 mb-1">{{ time }}</span>
          <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary ms-1"
            >Tú</a
          >
        </div>
        <!--end::Details-->

        <div class="symbol symbol-35px symbol-circle">
          <img v-if="image" alt="Pic" :src="image" />
          <div v-else class="symbol-label bg-light-primary text-primary fs-6 fw-bolder">
            T
          </div>
        </div>
      </div>
      <!--end::User-->

      <!--begin::Text-->
      <div
        class="p-5 rounded bg-light-primary text-gray-900 fw-semibold mw-lg-400px text-start"
        data-kt-element="message-text"
      >
        <div v-if="text">{{ text }}</div>

        <!-- Attachment Preview -->
        <div v-if="attachment" class="mt-3">
          <!-- Image Preview -->
          <div v-if="isImage(attachment.type)" class="mb-2">
            <img
              :src="attachment.url"
              :alt="attachment.name"
              class="img-fluid rounded mw-300px cursor-pointer"
              @click="openImage(attachment.url)"
            />
          </div>

          <!-- File Download -->
          <div v-else class="d-flex align-items-center p-3 bg-white rounded">
            <i class="ki-duotone ki-file fs-2x text-primary me-3">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            <div class="flex-grow-1">
              <div class="fs-7 fw-bold">{{ attachment.name }}</div>
              <div class="fs-8 text-muted">{{ attachment.size }}</div>
            </div>
            <a
              :href="attachment.url"
              :download="attachment.name"
              class="btn btn-sm btn-icon btn-light-primary"
              title="Descargar"
            >
              <i class="ki-duotone ki-cloud-download fs-3"></i>
            </a>
          </div>
        </div>
      </div>
      <!--end::Text-->
    </div>
    <!--end::Wrapper-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "message-out",
  props: {
    image: String,
    time: String,
    text: String,
    attachment: {
      type: Object as () => {
        url: string;
        name: string;
        type: string;
        size: string;
      } | null,
      default: null,
    },
  },
  methods: {
    isImage(type: string) {
      return type.startsWith('image/');
    },
    openImage(url: string) {
      window.open(url, '_blank');
    },
  },
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
