<template>
  <div class="container-fluid">
    <!--begin::Card-->
    <div class="card">
      <!--begin::Card header-->
      <div class="card-header">
        <!--begin::Card title-->
        <div class="card-title fs-3 fw-bold">
          {{ $t("settings.general.title") }}
        </div>
        <!--end::Card title-->
      </div>
      <!--end::Card header-->

      <!--begin::Card body-->
      <div class="card-body">
        <div
          class="notice d-flex bg-light-info rounded border-info border border-dashed p-6 mb-8"
        >
          <div class="d-flex flex-stack flex-grow-1">
            <div class="fw-semibold">
              <h4 class="text-gray-900 fw-bold">
                {{ $t("settings.general.notice.title") }}
              </h4>
              <div class="fs-6 text-gray-700">
                {{ $t("settings.general.notice.description") }}
              </div>
            </div>
          </div>
        </div>

        <!--begin::Form-->
        <form @submit.prevent="saveSettings" class="form">
          <!--begin::Section 1: Sistema-->
          <div class="mb-10">
            <h4 class="text-dark fw-bold mb-5">
              {{ $t("settings.general.system.title") }}
            </h4>

            <!--begin::Input group-->
            <div class="row mb-6">
              <label class="col-lg-4 col-form-label required fw-semibold fs-6">
                {{ $t("settings.general.system.appName") }}
              </label>
              <div class="col-lg-8">
                <input
                  v-model="settings.appName"
                  type="text"
                  class="form-control form-control-solid"
                  :placeholder="
                    $t('settings.general.system.appNamePlaceholder')
                  "
                  required
                />
                <div class="form-text">
                  {{ $t("settings.general.system.appNameHelp") }}
                </div>
              </div>
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <label class="col-lg-4 col-form-label required fw-semibold fs-6">
                {{ $t("settings.general.system.appUrl") }}
              </label>
              <div class="col-lg-8">
                <input
                  v-model="settings.appUrl"
                  type="url"
                  class="form-control form-control-solid"
                  :placeholder="$t('settings.general.system.appUrlPlaceholder')"
                  required
                />
                <div class="form-text">
                  {{ $t("settings.general.system.appUrlHelp") }}
                </div>
              </div>
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <label class="col-lg-4 col-form-label required fw-semibold fs-6">
                {{ $t("settings.general.system.contactEmail") }}
              </label>
              <div class="col-lg-8">
                <input
                  v-model="settings.contactEmail"
                  type="email"
                  class="form-control form-control-solid"
                  :placeholder="
                    $t('settings.general.system.contactEmailPlaceholder')
                  "
                  required
                />
                <div class="form-text">
                  {{ $t("settings.general.system.contactEmailHelp") }}
                </div>
              </div>
            </div>
            <!--end::Input group-->
          </div>
          <!--end::Section 1-->

          <!--begin::Section 2: Regional-->
          <div class="mb-10">
            <h4 class="text-dark fw-bold mb-5">
              {{ $t("settings.general.regional.title") }}
            </h4>

            <!--begin::Input group-->
            <div class="row mb-6">
              <label class="col-lg-4 col-form-label required fw-semibold fs-6">
                {{ $t("settings.general.regional.timezone") }}
              </label>
              <div class="col-lg-8">
                <select
                  v-model="settings.timezone"
                  class="form-select form-select-solid"
                  required
                >
                  <option value="America/Guatemala">
                    {{ $t("settings.general.regional.timezones.guatemala") }}
                  </option>
                  <option value="America/Mexico_City">
                    {{ $t("settings.general.regional.timezones.mexico") }}
                  </option>
                  <option value="America/New_York">
                    {{ $t("settings.general.regional.timezones.newYork") }}
                  </option>
                  <option value="America/Los_Angeles">
                    {{ $t("settings.general.regional.timezones.losAngeles") }}
                  </option>
                </select>
              </div>
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <label class="col-lg-4 col-form-label required fw-semibold fs-6">
                {{ $t("settings.general.regional.dateFormat") }}
              </label>
              <div class="col-lg-8">
                <select
                  v-model="settings.dateFormat"
                  class="form-select form-select-solid"
                  required
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
                <div class="form-text">
                  {{ $t("settings.general.regional.dateFormatHelp") }}
                  {{ new Date().toLocaleDateString() }}
                </div>
              </div>
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <label class="col-lg-4 col-form-label required fw-semibold fs-6">
                {{ $t("settings.general.regional.language") }}
              </label>
              <div class="col-lg-8">
                <select
                  v-model="settings.defaultLanguage"
                  class="form-select form-select-solid"
                  required
                >
                  <option value="es">{{ $t("languages.spanish") }}</option>
                  <option value="en">{{ $t("languages.english") }}</option>
                </select>
              </div>
            </div>
            <!--end::Input group-->
          </div>
          <!--end::Section 2-->

          <!--begin::Section 3: Notifications-->
          <div class="mb-10">
            <h4 class="text-dark fw-bold mb-5">
              {{ $t("settings.general.notifications.title") }}
            </h4>

            <!--begin::Input group-->
            <div class="row mb-6">
              <label class="col-lg-4 col-form-label fw-semibold fs-6">
                {{ $t("settings.general.notifications.emailNotifications") }}
              </label>
              <div class="col-lg-8 d-flex align-items-center">
                <div class="form-check form-switch">
                  <input
                    v-model="settings.emailNotifications"
                    class="form-check-input"
                    type="checkbox"
                    id="emailNotifications"
                  />
                  <label class="form-check-label" for="emailNotifications">
                    {{
                      settings.emailNotifications
                        ? $t("common.enabled")
                        : $t("common.disabled")
                    }}
                  </label>
                </div>
              </div>
            </div>
            <!--end::Input group-->

            <!--begin::Input group-->
            <div class="row mb-6">
              <label class="col-lg-4 col-form-label fw-semibold fs-6">
                {{ $t("settings.general.notifications.systemNotifications") }}
              </label>
              <div class="col-lg-8 d-flex align-items-center">
                <div class="form-check form-switch">
                  <input
                    v-model="settings.systemNotifications"
                    class="form-check-input"
                    type="checkbox"
                    id="systemNotifications"
                  />
                  <label class="form-check-label" for="systemNotifications">
                    {{
                      settings.systemNotifications
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
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";

interface GeneralSettings {
  appName: string;
  appUrl: string;
  contactEmail: string;
  timezone: string;
  dateFormat: string;
  defaultLanguage: string;
  emailNotifications: boolean;
  systemNotifications: boolean;
}

// Composables
const { t } = useI18n();

// Reactive data
const loading = ref(false);
const settings = ref<GeneralSettings>({
  appName: "GP360",
  appUrl: "http://localhost:5173",
  contactEmail: "admin" + "@" + "gp360.gov.gt",
  timezone: "America/Guatemala",
  dateFormat: "DD/MM/YYYY",
  defaultLanguage: "es",
  emailNotifications: true,
  systemNotifications: true,
});

const originalSettings = ref<GeneralSettings>({ ...settings.value });

// Computed
const hasChanges = computed(() => {
  return (
    JSON.stringify(settings.value) !== JSON.stringify(originalSettings.value)
  );
});

// Methods
const loadSettings = async () => {
  try {
    loading.value = true;
    const response = await ApiService.get("settings/general");
    if (response.data.status === "success") {
      settings.value = response.data.data;
      originalSettings.value = { ...response.data.data };
    }
  } catch (error) {
    console.error("Error loading general settings:", error);
    // Use default values if API fails
  } finally {
    loading.value = false;
  }
};

const saveSettings = async () => {
  loading.value = true;

  try {
    const response = await ApiService.put("settings/general", settings.value);

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
    console.error("Error saving general settings:", error);

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
