<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px p-10">
    <!--begin::Form-->
    <VForm
      class="form w-100"
      id="kt_login_signin_form"
      @submit="onSubmitLogin"
      :validation-schema="loginSchema"
      :initial-values="{ username: '', password: '' }"
    >
      <!--begin::Heading-->
      <div class="text-center mb-10">
        <!--begin::Title-->
        <h1 class="text-gray-900 mb-3">{{ $t("auth.login.title") }}</h1>
        <!--end::Title-->

        <!--begin::Subtitle-->
        <div class="text-gray-500 fw-semibold fs-4">
          {{ $t("auth.login.subtitle") }}
        </div>
        <!--end::Subtitle-->
      </div>
      <!--begin::Heading-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Label-->
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("auth.login.username")
        }}</label>
        <!--end::Label-->

        <!--begin::Input-->
        <Field
          tabindex="1"
          class="form-control form-control-lg form-control-solid"
          type="text"
          name="username"
          autocomplete="off"
          :placeholder="$t('auth.login.placeholders.username')"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="username" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Wrapper-->
        <div class="d-flex flex-stack mb-2">
          <!--begin::Label-->
          <label class="form-label fw-bold text-gray-900 fs-6 mb-0">{{
            $t("auth.login.password")
          }}</label>
          <!--end::Label-->

          <!--begin::Link-->
          <router-link
            to="/auth/password-reset"
            class="link-primary fs-6 fw-bold"
          >
            {{ $t("auth.login.forgotPassword") }}
          </router-link>
          <!--end::Link-->
        </div>
        <!--end::Wrapper-->

        <!--begin::Input-->
        <Field
          tabindex="2"
          class="form-control form-control-lg form-control-solid"
          type="password"
          name="password"
          autocomplete="off"
          :placeholder="$t('auth.login.placeholders.password')"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="text-center">
        <!--begin::Submit button-->
        <button
          tabindex="3"
          type="submit"
          ref="submitButton"
          id="kt_sign_in_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label">{{
            $t("auth.login.signInButton")
          }}</span>

          <span class="indicator-progress">
            {{ $t("auth.login.signingIn") }}
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
        <!--end::Submit button-->
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
import { useAuthStore, type User } from "@/stores/auth";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as Yup from "yup";

const store = useAuthStore();
const router = useRouter();
const { t } = useI18n();

const submitButton = ref<HTMLButtonElement | null>(null);

// Create form validation object
const loginSchema = Yup.object().shape({
  username: Yup.string()
    .required(t("auth.login.validation.usernameRequired"))
    .label(t("auth.login.username")),
  password: Yup.string()
    .min(4, t("auth.login.validation.passwordMinLength"))
    .required(t("auth.login.validation.passwordRequired"))
    .label(t("auth.login.password")),
});

// Form submit function
const onSubmitLogin = async (values: any) => {
  values = values as User;

  if (submitButton.value) {
    submitButton.value.disabled = true;
    // Activate indicator
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  try {
    // Send login request
    await store.login(values);

    // If we reach here, login was successful
    Swal.fire({
      text: t("auth.login.successMessage"),
      icon: "success",
      buttonsStyling: false,
      confirmButtonText: t("common.actions.ok"),
      heightAuto: false,
      customClass: {
        confirmButton: "btn fw-semibold btn-light-primary",
      },
    }).then(() => {
      // Go to page after successfully login
      router.push({ name: "dashboard" });
    });
  } catch (error: any) {
    // Handle login errors
    let errorMessage = t("auth.login.errorMessage");

    if (store.errors.message) {
      errorMessage = store.errors.message;
    } else if (store.errors.username) {
      errorMessage = Array.isArray(store.errors.username)
        ? store.errors.username[0]
        : store.errors.username;
    } else if (store.errors.password) {
      errorMessage = Array.isArray(store.errors.password)
        ? store.errors.password[0]
        : store.errors.password;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    Swal.fire({
      text: errorMessage,
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: t("common.actions.ok"),
      heightAuto: false,
      customClass: {
        confirmButton: "btn fw-semibold btn-light-danger",
      },
    });
  } finally {
    // Deactivate indicator
    submitButton.value?.removeAttribute("data-kt-indicator");
    if (submitButton.value) {
      submitButton.value.disabled = false;
    }
  }
};
</script>
