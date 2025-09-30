<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column w-275px w-lg-350px"
    data-kt-menu="true"
  >
    <!--begin::Heading-->
    <div
      class="d-flex flex-column flex-center bgi-no-repeat rounded-top px-9 py-10"
      :style="{
        backgroundImage: `url(${getAssetPath(
          '/media/misc/menu-header-bg.jpg',
        )})`,
      }"
    >
      <!--begin::Title-->
      <h3 class="text-white fw-semibold mb-3">
        {{ $t("dashboard.quickActions.title") }}
      </h3>
      <!--end::Title-->

      <!--begin::Status-->
      <div class="d-flex align-items-center">
        <span class="badge bg-light-success text-success py-2 px-3 me-2">
          {{ totalStats }} {{ $t("dashboard.quickActions.totalItems") }}
        </span>
        <div
          v-if="stats.unreadNotifications > 0"
          class="badge bg-warning py-2 px-3"
        >
          {{ stats.unreadNotifications }}
          {{ $t("dashboard.quickActions.pending") }}
        </div>
      </div>
      <!--end::Status-->
    </div>
    <!--end::Heading-->

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="spinner-border spinner-border-sm text-primary" role="status">
        <span class="visually-hidden"
          >{{ $t("common.actions.loading") }}...</span
        >
      </div>
    </div>

    <!-- Popular Items Grid -->
    <div v-else class="row g-0">
      <div v-for="(item, index) in displayItems" :key="item.id" class="col-6">
        <a
          @click.prevent="navigateToItem(item)"
          :class="[
            'd-flex flex-column flex-center h-100 p-6 bg-hover-light cursor-pointer',
            { 'border-end': index % 2 === 0 },
            { 'border-bottom': index < displayItems.length - 2 },
          ]"
        >
          <!-- Icon with Badge -->
          <div class="position-relative mb-2">
            <KTIcon
              :icon-name="item.icon"
              :icon-class="`fs-3x text-${item.color} mb-0`"
            />
            <span
              v-if="item.count && item.count > 0"
              class="badge badge-circle badge-danger position-absolute top-0 start-100 translate-middle"
              style="
                min-width: 18px;
                height: 18px;
                font-size: 10px;
                line-height: 18px;
              "
            >
              {{ item.count > 99 ? "99+" : item.count }}
            </span>
          </div>

          <!-- Title -->
          <span class="fs-6 fw-semibold text-gray-800 mb-0 text-center">
            {{ item.title }}
          </span>

          <!-- Description -->
          <span class="fs-7 text-gray-500 text-center">
            {{ item.description }}
          </span>
        </a>
      </div>
    </div>

    <!--begin::View more-->
    <div class="py-3 text-center border-top">
      <router-link
        to="/quick-access"
        class="btn btn-color-gray-600 btn-active-color-primary"
      >
        {{ $t("dashboard.quickActions.viewAll") }}
        <KTIcon icon-name="arrow-right" icon-class="fs-5" />
      </router-link>

      <button
        @click="refreshData"
        class="btn btn-sm btn-light ms-2"
        :disabled="loading"
        :title="$t('dashboard.quickActions.refresh')"
      >
        <KTIcon icon-name="arrows-loop" icon-class="fs-6" />
      </button>
    </div>
    <!--end::View more-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, computed } from "vue";
import { useQuickAccess } from "@/composables/useQuickAccess";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";

export default defineComponent({
  name: "kt-quick-links-menu",
  components: {
    KTIcon,
  },
  setup() {
    const {
      popularItems,
      stats,
      loading,
      navigateToItem,
      loadQuickAccessData,
      loadStats,
    } = useQuickAccess();

    // Display only first 6 items for the dropdown
    const displayItems = computed(() => popularItems.value.slice(0, 6));

    // Calculate total stats for header
    const totalStats = computed(() => {
      const pendingUsers = Number(stats.value.pendingUsers) || 0;
      const unreadNotifications = Number(stats.value.unreadNotifications) || 0;
      const systemAlerts = Number(stats.value.systemAlerts) || 0;

      return pendingUsers + unreadNotifications + systemAlerts;
    });

    const refreshData = async () => {
      await Promise.all([loadQuickAccessData(), loadStats()]);
    };

    return {
      displayItems,
      stats,
      totalStats,
      loading,
      navigateToItem,
      refreshData,
      getAssetPath,
    };
  },
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
