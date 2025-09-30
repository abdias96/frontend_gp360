<template>
  <div class="container-fluid">
    <!--begin::Card-->
    <div class="card">
      <!--begin::Card header-->
      <div class="card-header">
        <!--begin::Card title-->
        <div class="card-title fs-3 fw-bold">
          {{ $t("settings.security.title") }}
        </div>
        <!--end::Card title-->
      </div>
      <!--end::Card header-->

      <!--begin::Card body-->
      <div class="card-body">
        <div
          class="notice d-flex bg-light-warning rounded border-warning border border-dashed p-6 mb-8"
        >
          <div class="d-flex flex-stack flex-grow-1">
            <div class="fw-semibold">
              <h4 class="text-gray-900 fw-bold">
                {{ $t("settings.security.warning.title") }}
              </h4>
              <div class="fs-6 text-gray-700">
                {{ $t("settings.security.warning.description") }}
              </div>
            </div>
          </div>
        </div>

        <!--begin::Form-->
        <form @submit.prevent="saveSettings" class="form">
          <!--begin::Section 1: Password Policy-->
          <div class="mb-10">
            <h4 class="text-dark fw-bold mb-5">
              {{ $t("settings.security.passwordPolicy.title") }}
            </h4>

            <!--begin::Input group-->
            <div class="row mb-6">
              <label class="col-lg-4 col-form-label required fw-semibold fs-6">
                {{ $t("settings.security.passwordPolicy.minLength") }}
              </label>
              <div class="col-lg-8">
                <input
                  v-model.number="settings.passwordMinLength"
                  type="number"
                  min="6"
                  max="32"
                  class="form-control form-control-solid"
                  required
                />
                <div class="form-text">
                  {{ $t("settings.security.passwordPolicy.minLengthHelp") }}
                </div>
              </div>
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <label class="col-lg-4 col-form-label fw-semibold fs-6">
                {{ $t("settings.security.passwordPolicy.requirements") }}
              </label>
              <div class="col-lg-8">
                <div class="form-check mb-3">
                  <input
                    v-model="settings.requireUppercase"
                    class="form-check-input"
                    type="checkbox"
                    id="requireUppercase"
                  />
                  <label class="form-check-label" for="requireUppercase">
                    {{
                      $t("settings.security.passwordPolicy.requireUppercase")
                    }}
                  </label>
                </div>
                <div class="form-check mb-3">
                  <input
                    v-model="settings.requireLowercase"
                    class="form-check-input"
                    type="checkbox"
                    id="requireLowercase"
                  />
                  <label class="form-check-label" for="requireLowercase">
                    {{
                      $t("settings.security.passwordPolicy.requireLowercase")
                    }}
                  </label>
                </div>
                <div class="form-check mb-3">
                  <input
                    v-model="settings.requireNumbers"
                    class="form-check-input"
                    type="checkbox"
                    id="requireNumbers"
                  />
                  <label class="form-check-label" for="requireNumbers">
                    {{ $t("settings.security.passwordPolicy.requireNumbers") }}
                  </label>
                </div>
                <div class="form-check mb-3">
                  <input
                    v-model="settings.requireSpecialChars"
                    class="form-check-input"
                    type="checkbox"
                    id="requireSpecialChars"
                  />
                  <label class="form-check-label" for="requireSpecialChars">
                    {{
                      $t("settings.security.passwordPolicy.requireSpecialChars")
                    }}
                  </label>
                </div>
              </div>
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <label class="col-lg-4 col-form-label required fw-semibold fs-6">
                {{ $t("settings.security.passwordPolicy.expirationDays") }}
              </label>
              <div class="col-lg-8">
                <input
                  v-model.number="settings.passwordExpirationDays"
                  type="number"
                  min="0"
                  max="365"
                  class="form-control form-control-solid"
                  required
                />
                <div class="form-text">
                  {{ $t("settings.security.passwordPolicy.expirationHelp") }}
                </div>
              </div>
            </div>
            <!--end::Input group-->
          </div>
          <!--end::Section 1-->

          <!--begin::Section 2: Session Management-->
          <div class="mb-10">
            <h4 class="text-dark fw-bold mb-5">
              {{ $t("settings.security.sessions.title") }}
            </h4>

            <!--begin::Input group-->
            <div class="row mb-6">
              <label class="col-lg-4 col-form-label required fw-semibold fs-6">
                {{ $t("settings.security.sessions.timeout") }}
              </label>
              <div class="col-lg-8">
                <select
                  v-model="settings.sessionTimeout"
                  class="form-select form-select-solid"
                  required
                >
                  <option value="15">15 {{ $t("common.minutes") }}</option>
                  <option value="30">30 {{ $t("common.minutes") }}</option>
                  <option value="60">1 {{ $t("common.hour") }}</option>
                  <option value="120">2 {{ $t("common.hours") }}</option>
                  <option value="480">8 {{ $t("common.hours") }}</option>
                </select>
                <div class="form-text">
                  {{ $t("settings.security.sessions.timeoutHelp") }}
                </div>
              </div>
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <label class="col-lg-4 col-form-label fw-semibold fs-6">
                {{ $t("settings.security.sessions.concurrent") }}
              </label>
              <div class="col-lg-8 d-flex align-items-center">
                <div class="form-check form-switch">
                  <input
                    v-model="settings.allowConcurrentSessions"
                    class="form-check-input"
                    type="checkbox"
                    id="allowConcurrentSessions"
                  />
                  <label class="form-check-label" for="allowConcurrentSessions">
                    {{
                      settings.allowConcurrentSessions
                        ? $t("common.allowed")
                        : $t("common.notAllowed")
                    }}
                  </label>
                </div>
              </div>
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <label class="col-lg-4 col-form-label required fw-semibold fs-6">
                {{ $t("settings.security.sessions.maxPerUser") }}
              </label>
              <div class="col-lg-8">
                <input
                  v-model.number="settings.maxSessionsPerUser"
                  type="number"
                  min="1"
                  max="10"
                  class="form-control form-control-solid"
                  :disabled="!settings.allowConcurrentSessions"
                  required
                />
                <div class="form-text">
                  {{ $t("settings.security.sessions.maxPerUserHelp") }}
                </div>
              </div>
            </div>
            <!--end::Input group-->
          </div>
          <!--end::Section 2-->

          <!--begin::Section 3: Login Security-->
          <div class="mb-10">
            <h4 class="text-dark fw-bold mb-5">
              {{ $t("settings.security.login.title") }}
            </h4>

            <!--begin::Input group-->
            <div class="row mb-6">
              <label class="col-lg-4 col-form-label required fw-semibold fs-6">
                {{ $t("settings.security.login.maxAttempts") }}
              </label>
              <div class="col-lg-8">
                <input
                  v-model.number="settings.maxLoginAttempts"
                  type="number"
                  min="3"
                  max="10"
                  class="form-control form-control-solid"
                  required
                />
                <div class="form-text">
                  {{ $t("settings.security.login.maxAttemptsHelp") }}
                </div>
              </div>
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <label class="col-lg-4 col-form-label required fw-semibold fs-6">
                {{ $t("settings.security.login.lockoutDuration") }}
              </label>
              <div class="col-lg-8">
                <select
                  v-model="settings.lockoutDuration"
                  class="form-select form-select-solid"
                  required
                >
                  <option value="5">5 {{ $t("common.minutes") }}</option>
                  <option value="15">15 {{ $t("common.minutes") }}</option>
                  <option value="30">30 {{ $t("common.minutes") }}</option>
                  <option value="60">1 {{ $t("common.hour") }}</option>
                </select>
                <div class="form-text">
                  {{ $t("settings.security.login.lockoutHelp") }}
                </div>
              </div>
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <label class="col-lg-4 col-form-label fw-semibold fs-6">
                {{ $t("settings.security.login.twoFactor") }}
              </label>
              <div class="col-lg-8 d-flex align-items-center">
                <div class="form-check form-switch">
                  <input
                    v-model="settings.enableTwoFactor"
                    class="form-check-input"
                    type="checkbox"
                    id="enableTwoFactor"
                  />
                  <label class="form-check-label" for="enableTwoFactor">
                    {{
                      settings.enableTwoFactor
                        ? $t("common.enabled")
                        : $t("common.disabled")
                    }}
                  </label>
                </div>
              </div>
            </div>
            <!--end::Input group-->
          </div>
          <!--end::Section 3-->

          <!--begin::Section 4: IP Restrictions-->
          <div class="mb-10">
            <h4 class="text-dark fw-bold mb-5">
              {{ $t("settings.security.ipRestrictions.title") }}
            </h4>

            <!--begin::Input group-->
            <div class="row mb-6">
              <label class="col-lg-4 col-form-label fw-semibold fs-6">
                {{ $t("settings.security.ipRestrictions.enable") }}
              </label>
              <div class="col-lg-8 d-flex align-items-center">
                <div class="form-check form-switch">
                  <input
                    v-model="settings.enableIpRestrictions"
                    class="form-check-input"
                    type="checkbox"
                    id="enableIpRestrictions"
                  />
                  <label class="form-check-label" for="enableIpRestrictions">
                    {{
                      settings.enableIpRestrictions
                        ? $t("common.enabled")
                        : $t("common.disabled")
                    }}
                  </label>
                </div>
              </div>
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6" v-if="settings.enableIpRestrictions">
              <label class="col-lg-4 col-form-label fw-semibold fs-6">
                {{ $t("settings.security.ipRestrictions.whitelist") }}
              </label>
              <div class="col-lg-8">
                <textarea
                  v-model="settings.ipWhitelist"
                  class="form-control form-control-solid"
                  rows="4"
                  :placeholder="
                    $t('settings.security.ipRestrictions.whitelistPlaceholder')
                  "
                ></textarea>
                <div class="form-text">
                  {{ $t("settings.security.ipRestrictions.whitelistHelp") }}
                </div>
              </div>
            </div>
            <!--end::Input group-->
          </div>
          <!--end::Section 4-->

          <!--begin::Actions-->
          <div class="card-footer d-flex justify-content-end py-6 px-9">
            <button
              type="button"
              @click="resetForm"
              class="btn btn-light btn-active-light-primary me-2"
              :disabled="loading"
            >
              {{ $t("common.actions.reset") }}
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading || !hasChanges"
            >
              <span v-if="!loading">
                {{ $t("common.actions.save") }}
              </span>
              <span v-else>
                {{ $t("common.actions.saving") }}
                <span class="spinner-border spinner-border-sm ms-2"></span>
              </span>
            </button>
          </div>
          <!--end::Actions-->
        </form>
        <!--end::Form-->
      </div>
      <!--end::Card body-->
    </div>
    <!--end::Card-->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";

interface SecuritySettings {
  passwordMinLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  passwordExpirationDays: number;
  sessionTimeout: number;
  allowConcurrentSessions: boolean;
  maxSessionsPerUser: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  enableTwoFactor: boolean;
  enableIpRestrictions: boolean;
  ipWhitelist: string;
}

// Composables
const { t } = useI18n();

// Reactive data
const loading = ref(false);
const settings = ref<SecuritySettings>({
  passwordMinLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
  passwordExpirationDays: 90,
  sessionTimeout: 30,
  allowConcurrentSessions: true,
  maxSessionsPerUser: 3,
  maxLoginAttempts: 5,
  lockoutDuration: 15,
  enableTwoFactor: false,
  enableIpRestrictions: false,
  ipWhitelist: "",
});

const originalSettings = ref<SecuritySettings>({ ...settings.value });

// Computed
const hasChanges = computed(() => {
  return (
    JSON.stringify(settings.value) !== JSON.stringify(originalSettings.value)
  );
});

// Watch
watch(
  () => settings.value.allowConcurrentSessions,
  (newValue) => {
    if (!newValue) {
      settings.value.maxSessionsPerUser = 1;
    }
  },
);

// Methods
const loadSettings = async () => {
  try {
    loading.value = true;
    const response = await ApiService.get("settings/security");
    if (response.data.status === "success") {
      settings.value = response.data.data;
      originalSettings.value = { ...response.data.data };
    }
  } catch (error) {
    console.error("Error loading security settings:", error);
    // Use default values if API fails
  } finally {
    loading.value = false;
  }
};

const saveSettings = async () => {
  loading.value = true;

  try {
    const response = await ApiService.put("settings/security", settings.value);

    if (response.data.status === "success") {
      originalSettings.value = { ...settings.value };

      Swal.fire({
        text: t("settings.messages.saveSuccess"),
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: t("common.actions.ok"),
        heightAuto: false,
        customClass: {
          confirmButton: "btn fw-semibold btn-light-primary",
        },
      });
    }
  } catch (error: any) {
    console.error("Error saving security settings:", error);

    Swal.fire({
      text: error.response?.data?.message || t("settings.messages.saveError"),
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: t("common.actions.ok"),
      heightAuto: false,
      customClass: {
        confirmButton: "btn fw-semibold btn-light-danger",
      },
    });
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  settings.value = { ...originalSettings.value };
};

// Lifecycle
onMounted(() => {
  loadSettings();
});
</script>
