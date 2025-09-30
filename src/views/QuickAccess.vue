<template>
  <div class="d-flex flex-column flex-lg-row">
    <!--begin::Content-->
    <div class="flex-lg-row-fluid mb-10 mb-lg-0 me-lg-7 me-xl-10">
      <!--begin::Card-->
      <div class="card">
        <!--begin::Card header-->
        <div class="card-header">
          <div class="card-title">
            <h2>{{ $t("dashboard.quickActions.title") }}</h2>
          </div>
          <div class="card-toolbar">
            <button
              @click="refreshData"
              class="btn btn-sm btn-light me-2"
              :disabled="loading"
            >
              <KTIcon icon-name="arrows-loop" icon-class="fs-2" />
              {{ $t("dashboard.quickActions.refresh") }}
            </button>
            <button
              @click="showCustomizeModal = true"
              class="btn btn-sm btn-primary"
            >
              <KTIcon icon-name="gear" icon-class="fs-2" />
              {{ $t("dashboard.quickActions.customize") }}
            </button>
          </div>
        </div>
        <!--end::Card header-->

        <!--begin::Card body-->
        <div class="card-body">
          <!-- Stats Overview -->
          <div class="row mb-8">
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card bg-light-primary border-0">
                <div class="card-body text-center py-6">
                  <KTIcon
                    icon-name="people"
                    icon-class="fs-2x text-primary mb-3"
                  />
                  <h3 class="text-primary">{{ stats.pendingUsers }}</h3>
                  <p class="text-muted mb-0">
                    {{ $t("dashboard.quickActions.pendingUsers") }}
                  </p>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card bg-light-warning border-0">
                <div class="card-body text-center py-6">
                  <KTIcon
                    icon-name="notification-bing"
                    icon-class="fs-2x text-warning mb-3"
                  />
                  <h3 class="text-warning">{{ stats.unreadNotifications }}</h3>
                  <p class="text-muted mb-0">
                    {{ $t("dashboard.quickActions.unreadNotifications") }}
                  </p>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card bg-light-danger border-0">
                <div class="card-body text-center py-6">
                  <KTIcon
                    icon-name="cross"
                    icon-class="fs-2x text-danger mb-3"
                  />
                  <h3 class="text-danger">{{ stats.systemAlerts }}</h3>
                  <p class="text-muted mb-0">
                    {{ $t("dashboard.quickActions.systemAlerts") }}
                  </p>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card bg-light-info border-0">
                <div class="card-body text-center py-6">
                  <KTIcon
                    icon-name="profile-circle"
                    icon-class="fs-2x text-info mb-3"
                  />
                  <h3 class="text-info">{{ stats.todayLogins }}</h3>
                  <p class="text-muted mb-0">
                    {{ $t("dashboard.quickActions.todayLogins") }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Access Categories -->
          <div class="row">
            <!-- Frequent Actions -->
            <div class="col-lg-6 mb-8">
              <div class="card bg-light border-0 h-100">
                <div class="card-header bg-transparent">
                  <h3 class="card-title">
                    <KTIcon
                      icon-name="element-11"
                      icon-class="fs-1 text-success me-2"
                    />
                    {{ $t("dashboard.quickActions.frequentActions") }}
                  </h3>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div
                      v-for="item in frequentItems"
                      :key="item.id"
                      class="col-6"
                    >
                      <div
                        @click="navigateToItem(item)"
                        class="d-flex flex-column align-items-center p-4 quick-access-card rounded-3 cursor-pointer hover-scale"
                        style="transition: all 0.3s ease"
                      >
                        <div class="position-relative mb-2">
                          <KTIcon
                            :icon-name="item.icon"
                            :icon-class="`fs-2x text-${item.color}`"
                          />
                          <span
                            v-if="item.count && item.count > 0"
                            class="badge badge-circle badge-danger position-absolute top-0 start-100 translate-middle"
                          >
                            {{ item.count }}
                          </span>
                        </div>
                        <h6 class="text-gray-800 text-center mb-1">
                          {{ item.title }}
                        </h6>
                        <small class="text-muted text-center">{{
                          item.description
                        }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- System Administration -->
            <div class="col-lg-6 mb-8">
              <div class="card bg-light border-0 h-100">
                <div class="card-header bg-transparent">
                  <h3 class="card-title">
                    <KTIcon
                      icon-name="gear"
                      icon-class="fs-1 text-primary me-2"
                    />
                    {{ $t("dashboard.quickActions.systemAdmin") }}
                  </h3>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div
                      v-for="item in systemItems"
                      :key="item.id"
                      class="col-6"
                    >
                      <div
                        @click="navigateToItem(item)"
                        class="d-flex flex-column align-items-center p-4 quick-access-card rounded-3 cursor-pointer hover-scale"
                        style="transition: all 0.3s ease"
                      >
                        <div class="position-relative mb-2">
                          <KTIcon
                            :icon-name="item.icon"
                            :icon-class="`fs-2x text-${item.color}`"
                          />
                          <span
                            v-if="item.count && item.count > 0"
                            class="badge badge-circle badge-danger position-absolute top-0 start-100 translate-middle"
                          >
                            {{ item.count }}
                          </span>
                        </div>
                        <h6 class="text-gray-800 text-center mb-1">
                          {{ item.title }}
                        </h6>
                        <small class="text-muted text-center">{{
                          item.description
                        }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- User Actions -->
            <div class="col-lg-6 mb-8">
              <div class="card bg-light border-0 h-100">
                <div class="card-header bg-transparent">
                  <h3 class="card-title">
                    <KTIcon
                      icon-name="profile-circle"
                      icon-class="fs-1 text-info me-2"
                    />
                    {{ $t("dashboard.quickActions.userActions") }}
                  </h3>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div v-for="item in userItems" :key="item.id" class="col-6">
                      <div
                        @click="navigateToItem(item)"
                        class="d-flex flex-column align-items-center p-4 quick-access-card rounded-3 cursor-pointer hover-scale"
                        style="transition: all 0.3s ease"
                      >
                        <div class="position-relative mb-2">
                          <KTIcon
                            :icon-name="item.icon"
                            :icon-class="`fs-2x text-${item.color}`"
                          />
                          <span
                            v-if="item.count && item.count > 0"
                            class="badge badge-circle badge-danger position-absolute top-0 start-100 translate-middle"
                          >
                            {{ item.count }}
                          </span>
                        </div>
                        <h6 class="text-gray-800 text-center mb-1">
                          {{ item.title }}
                        </h6>
                        <small class="text-muted text-center">{{
                          item.description
                        }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Admin Tools -->
            <div class="col-lg-6 mb-8">
              <div class="card bg-light border-0 h-100">
                <div class="card-header bg-transparent">
                  <h3 class="card-title">
                    <KTIcon
                      icon-name="key"
                      icon-class="fs-1 text-danger me-2"
                    />
                    {{ $t("dashboard.quickActions.adminTools") }}
                  </h3>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div
                      v-for="item in adminItems"
                      :key="item.id"
                      class="col-6"
                    >
                      <div
                        @click="navigateToItem(item)"
                        class="d-flex flex-column align-items-center p-4 quick-access-card rounded-3 cursor-pointer hover-scale"
                        style="transition: all 0.3s ease"
                      >
                        <div class="position-relative mb-2">
                          <KTIcon
                            :icon-name="item.icon"
                            :icon-class="`fs-2x text-${item.color}`"
                          />
                          <span
                            v-if="item.count && item.count > 0"
                            class="badge badge-circle badge-danger position-absolute top-0 start-100 translate-middle"
                          >
                            {{ item.count }}
                          </span>
                        </div>
                        <h6 class="text-gray-800 text-center mb-1">
                          {{ item.title }}
                        </h6>
                        <small class="text-muted text-center">{{
                          item.description
                        }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--end::Card body-->
      </div>
      <!--end::Card-->
    </div>
    <!--end::Content-->
  </div>

  <!-- Customize Modal -->
  <div
    v-if="showCustomizeModal"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">
            {{ $t("dashboard.quickActions.customize") }}
          </h2>
          <button
            @click="showCustomizeModal = false"
            type="button"
            class="btn-close"
          ></button>
        </div>
        <div class="modal-body">
          <p class="text-muted mb-6">
            {{ $t("dashboard.quickActions.customizeDescription") }}
          </p>

          <div class="row g-4">
            <div
              v-for="item in quickAccessItems"
              :key="item.id"
              class="col-md-6"
            >
              <div class="card border">
                <div class="card-body p-4">
                  <div class="d-flex align-items-center">
                    <div class="me-3">
                      <KTIcon
                        :icon-name="item.icon"
                        :icon-class="`fs-2x text-${item.color}`"
                      />
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-1">{{ item.title }}</h6>
                      <small class="text-muted">{{ item.description }}</small>
                    </div>
                    <div class="form-check form-switch">
                      <input
                        :id="`item-${item.id}`"
                        :checked="item.enabled"
                        @change="handleToggleItem(item.id)"
                        class="form-check-input"
                        type="checkbox"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            @click="showCustomizeModal = false"
            type="button"
            class="btn btn-light"
          >
            {{ $t("common.actions.close") }}
          </button>
          <button
            @click="saveConfiguration"
            type="button"
            class="btn btn-primary"
          >
            {{ $t("common.actions.save") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ===========================
// Imports
// ===========================
import { ref } from "vue";
import { useQuickAccess } from "@/composables/useQuickAccess";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";

// ===========================
// State & Composables
// ===========================
const {
  quickAccessItems,
  availableItems,
  frequentItems,
  systemItems,
  adminItems,
  userItems,
  stats,
  loading,
  navigateToItem,
  loadQuickAccessData,
  loadStats,
  saveQuickAccessConfiguration,
  toggleItem,
} = useQuickAccess();

const showCustomizeModal = ref(false);

// ===========================
// Methods
// ===========================
const refreshData = async () => {
  await Promise.all([loadQuickAccessData(), loadStats()]);
};

const saveConfiguration = async () => {
  await saveQuickAccessConfiguration(quickAccessItems.value);
  showCustomizeModal.value = false;
};

const handleToggleItem = (itemId: string) => {
  toggleItem(itemId);
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.hover-scale:hover {
  transform: scale(1.05);
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
}

.quick-access-card {
  background-color: var(--bs-white);
  border: 1px solid var(--bs-gray-200);
}

/* Dark mode support */
[data-bs-theme="dark"] .quick-access-card {
  background-color: var(--bs-gray-800);
  border: 1px solid var(--bs-gray-700);
}

[data-bs-theme="dark"] .quick-access-card:hover {
  background-color: var(--bs-gray-700);
  border-color: var(--bs-gray-600);
}

[data-bs-theme="dark"] .quick-access-card h6 {
  color: var(--bs-gray-100) !important;
}

[data-bs-theme="dark"] .quick-access-card small {
  color: var(--bs-gray-300) !important;
}

.quick-access-card:hover {
  background-color: var(--bs-gray-50);
  border-color: var(--bs-gray-300);
}
</style>
