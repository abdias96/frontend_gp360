<template>
  <div class="container-fluid">
    <!--begin::Page title-->
    <div
      class="page-title d-flex flex-column justify-content-center flex-wrap me-3 mb-8"
    >
      <h1
        class="page-heading d-flex text-gray-900 fw-bold fs-3 flex-column justify-content-center my-0"
      >
        {{ $t("settings.title") }}
      </h1>
      <ul
        class="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1"
      >
        <li class="breadcrumb-item text-muted">
          <router-link to="/dashboard" class="text-muted text-hover-primary">{{
            $t("menu.dashboard")
          }}</router-link>
        </li>
        <li class="breadcrumb-item">
          <span class="bullet bg-gray-500 w-5px h-2px"></span>
        </li>
        <li class="breadcrumb-item text-muted">{{ $t("settings.title") }}</li>
      </ul>
    </div>
    <!--end::Page title-->

    <!--begin::Content-->
    <div class="row g-5 g-xl-8">
      <!--begin::Col-->
      <div class="col-12">
        <!--begin::Card-->
        <div class="card">
          <!--begin::Card header-->
          <div class="card-header border-0 pt-6">
            <div class="card-title">
              <h3 class="card-title">
                {{ $t("settings.systemConfiguration") }}
              </h3>
            </div>
          </div>
          <!--end::Card header-->

          <!--begin::Card body-->
          <div class="card-body pt-0">
            <div
              class="notice d-flex bg-light-warning rounded border-warning border border-dashed p-6 mb-8"
            >
              <div class="d-flex flex-stack flex-grow-1">
                <div class="fw-semibold">
                  <h4 class="text-gray-900 fw-bold">
                    {{ $t("settings.warning.title") }}
                  </h4>
                  <div class="fs-6 text-gray-700">
                    {{ $t("settings.warning.description") }}
                  </div>
                </div>
              </div>
            </div>

            <!--begin::Form-->
            <form class="form">
              <!--begin::Input group-->
              <div class="row mb-6">
                <label
                  class="col-lg-4 col-form-label required fw-semibold fs-6"
                  >{{ $t("settings.form.appName") }}</label
                >
                <div class="col-lg-8">
                  <input
                    type="text"
                    v-model="settings.appName"
                    class="form-control form-control-lg form-control-solid"
                    :placeholder="$t('settings.form.appNamePlaceholder')"
                  />
                  <div class="form-text">
                    {{ $t("settings.form.appNameHelp") }}
                  </div>
                </div>
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="row mb-6">
                <label
                  class="col-lg-4 col-form-label required fw-semibold fs-6"
                  >{{ $t("settings.form.appUrl") }}</label
                >
                <div class="col-lg-8">
                  <input
                    type="url"
                    v-model="settings.appUrl"
                    class="form-control form-control-lg form-control-solid"
                    :placeholder="$t('settings.form.appUrlPlaceholder')"
                  />
                  <div class="form-text">
                    {{ $t("settings.form.appUrlHelp") }}
                  </div>
                </div>
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="row mb-6">
                <label class="col-lg-4 col-form-label fw-semibold fs-6">{{
                  $t("settings.form.defaultLanguage")
                }}</label>
                <div class="col-lg-8">
                  <select
                    v-model="settings.defaultLanguage"
                    class="form-select form-select-lg form-select-solid"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                  <div class="form-text">
                    {{ $t("settings.form.defaultLanguageHelp") }}
                  </div>
                </div>
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="row mb-6">
                <label class="col-lg-4 col-form-label fw-semibold fs-6">{{
                  $t("settings.form.timezone")
                }}</label>
                <div class="col-lg-8">
                  <select
                    v-model="settings.timezone"
                    class="form-select form-select-lg form-select-solid"
                  >
                    <option value="America/Guatemala">America/Guatemala</option>
                    <option value="America/Mexico_City">
                      America/Mexico_City
                    </option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="UTC">UTC</option>
                  </select>
                  <div class="form-text">
                    {{ $t("settings.form.timezoneHelp") }}
                  </div>
                </div>
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="row mb-6">
                <label class="col-lg-4 col-form-label fw-semibold fs-6">{{
                  $t("settings.form.maintenanceMode")
                }}</label>
                <div class="col-lg-8">
                  <div
                    class="form-check form-switch form-check-custom form-check-solid"
                  >
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="settings.maintenanceMode"
                      id="maintenanceMode"
                    />
                    <label class="form-check-label" for="maintenanceMode">
                      {{ $t("settings.form.maintenanceModeLabel") }}
                    </label>
                  </div>
                  <div class="form-text">
                    {{ $t("settings.form.maintenanceModeHelp") }}
                  </div>
                </div>
              </div>
              <!--end::Input group-->

              <!--begin::Actions-->
              <div class="card-footer d-flex justify-content-end py-6 px-9">
                <button
                  type="button"
                  class="btn btn-light btn-active-light-primary me-2"
                  @click="resetForm"
                >
                  {{ $t("common.actions.reset") }}
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="saveSettings"
                  :disabled="loading"
                >
                  <span v-if="!loading" class="indicator-label">{{
                    $t("common.actions.save")
                  }}</span>
                  <span v-else class="indicator-progress">
                    {{ $t("common.actions.loading") }}
                    <span
                      class="spinner-border spinner-border-sm align-middle ms-2"
                    ></span>
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
      <!--end::Col-->
    </div>
    <!--end::Content-->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import Swal from "sweetalert2/dist/sweetalert2.js";

interface SystemSettings {
  appName: string;
  appUrl: string;
  defaultLanguage: string;
  timezone: string;
  maintenanceMode: boolean;
}

// Composables
const { t, locale, te } = useI18n();

// Reactive data
const loading = ref(false);

const settings = ref<SystemSettings>({
  appName: "GP360",
  appUrl: "http://localhost:5173",
  defaultLanguage: "es",
  timezone: "America/Guatemala",
  maintenanceMode: false,
});

const originalSettings = ref<SystemSettings>({ ...settings.value });

// Computed
const translationsLoaded = computed(() => {
  return (
    te("settings.systemConfiguration") &&
    te("settings.title") &&
    te("settings.warning.title")
  );
});

// Methods
const loadSettings = async () => {
  // TODO: Aquí iría la llamada al API para cargar las configuraciones del backend
  // const response = await ApiService.get("settings");
  // settings.value = response.data;
};

const saveSettings = async () => {
  loading.value = true;

  try {
    // TODO: Aquí iría la llamada al API para guardar las configuraciones
    // await ApiService.put("settings", settings.value);

    // Simular delay de guardado
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
  } catch (error) {
    Swal.fire({
      text: t("settings.messages.saveError"),
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
