<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px p-10">
    <!--begin::Form-->
    <VForm
      class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      @submit="onSubmitForgotPassword"
      id="kt_login_password_reset_form"
      :validation-schema="forgotPasswordSchema"
    >
      <!--begin::Heading-->
      <div class="text-center mb-10">
        <!--begin::Title-->
        <h1 class="text-gray-900 mb-3">{{ $t("auth.passwordReset.title") }}</h1>
        <!--end::Title-->

        <!--begin::Subtitle-->
        <div class="text-gray-500 fw-semibold fs-4">
          {{ $t("auth.passwordReset.subtitle") }}
        </div>
        <!--end::Subtitle-->
      </div>
      <!--begin::Heading-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <label class="form-label fw-bold text-gray-900 fs-6">{{
          $t("auth.passwordReset.email")
        }}</label>
        <Field
          class="form-control form-control-solid"
          type="email"
          :placeholder="$t('auth.passwordReset.placeholders.email')"
          name="email"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="email" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="d-flex flex-wrap justify-content-center pb-lg-0">
        <button
          type="submit"
          ref="submitButton"
          id="kt_password_reset_submit"
          class="btn btn-lg btn-primary fw-bold me-4"
        >
          <span class="indicator-label">{{
            $t("auth.passwordReset.sendButton")
          }}</span>
          <span class="indicator-progress">
            {{ $t("auth.passwordReset.sending") }}
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>

        <router-link
          to="/auth/login"
          class="btn btn-lg btn-light-primary fw-bold"
        >
          {{ $t("auth.passwordReset.cancelButton") }}
        </router-link>
      </div>
      <!--end::Actions-->
    </VForm>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "vue-i18n";
import * as Yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";

const store = useAuthStore();
const { t } = useI18n();

const submitButton = ref<HTMLButtonElement | null>(null);

// Create form validation object
const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email(t("auth.passwordReset.validation.emailInvalid"))
    .required(t("auth.passwordReset.validation.emailRequired"))
    .label(t("auth.passwordReset.email")),
});

// Form submit function
const onSubmitForgotPassword = async (values: any) => {
  values = values as string;

  if (submitButton.value) {
    submitButton.value.disabled = true;
    // Activate loading indicator
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  // Send forgot password request
  await store.forgotPassword(values);

  const error = Object.values(store.errors);

  if (error.length === 0) {
    Swal.fire({
      text: t("auth.passwordReset.successMessage"),
      icon: "success",
      buttonsStyling: false,
      confirmButtonText: t("common.actions.ok"),
      heightAuto: false,
      customClass: {
        confirmButton: "btn fw-semibold btn-light-primary",
      },
    });
  } else {
    const errorMessage =
      typeof error[0] === "string"
        ? error[0]
        : (error[0] as any)?.message || t("auth.passwordReset.errorMessage");
    Swal.fire({
      text: errorMessage,
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: t("common.actions.tryAgain"),
      heightAuto: false,
      customClass: {
        confirmButton: "btn fw-semibold btn-light-danger",
      },
    });
  }

  // Deactivate indicator
  submitButton.value?.removeAttribute("data-kt-indicator");
  if (submitButton.value) {
    submitButton.value.disabled = false;
  }
};
</script>
