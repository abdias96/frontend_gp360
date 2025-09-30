<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px p-10">
    <!--begin::Form-->
    <VForm
      class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      novalidate
      @submit="onSubmitRegister"
      id="kt_login_signup_form"
      :validation-schema="registrationSchema"
    >
      <!--begin::Heading-->
      <div class="mb-10 text-center">
        <!--begin::Title-->
        <h1 class="text-gray-900 mb-3">Crear una Cuenta</h1>
        <!--end::Title-->

        <!--begin::Link-->
        <div class="text-gray-500 fw-semibold fs-4">
          ¿Ya tienes una cuenta?
          <router-link to="/auth/login" class="link-primary fw-bold">
            Inicia sesión aquí
          </router-link>
        </div>
        <!--end::Link-->
      </div>
      <!--end::Heading-->

      <!--begin::Input group-->
      <div class="row fv-row mb-7">
        <!--begin::Col-->
        <div class="col-xl-6">
          <label class="form-label fw-bold text-gray-900 fs-6">Nombres</label>
          <Field
            class="form-control form-control-lg form-control-solid"
            type="text"
            placeholder="Ingresa tus nombres"
            name="first_name"
            autocomplete="off"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="first_name" />
            </div>
          </div>
        </div>
        <!--end::Col-->

        <!--begin::Col-->
        <div class="col-xl-6">
          <label class="form-label fw-bold text-gray-900 fs-6">Apellidos</label>
          <Field
            class="form-control form-control-lg form-control-solid"
            type="text"
            placeholder="Ingresa tus apellidos"
            name="last_name"
            autocomplete="off"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="last_name" />
            </div>
          </div>
        </div>
        <!--end::Col-->
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-7">
        <label class="form-label fw-bold text-gray-900 fs-6"
          >Correo Electrónico</label
        >
        <Field
          class="form-control form-control-lg form-control-solid"
          type="email"
          placeholder="Ingresa tu correo electrónico"
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

      <!--begin::Input group-->
      <div class="fv-row mb-7">
        <label class="form-label fw-bold text-gray-900 fs-6">Usuario</label>
        <Field
          class="form-control form-control-lg form-control-solid"
          type="text"
          placeholder="Ingresa tu nombre de usuario"
          name="username"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="username" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="mb-10 fv-row" data-kt-password-meter="true">
        <!--begin::Wrapper-->
        <div class="mb-1">
          <!--begin::Label-->
          <label class="form-label fw-bold text-gray-900 fs-6"
            >Contraseña</label
          >
          <!--end::Label-->

          <!--begin::Input wrapper-->
          <div class="position-relative mb-3">
            <Field
              class="form-control form-control-lg form-control-solid"
              type="password"
              placeholder="Ingresa tu contraseña"
              name="password"
              autocomplete="off"
            />
            <div class="fv-plugins-message-container">
              <div class="fv-help-block">
                <ErrorMessage name="password" />
              </div>
            </div>
          </div>
          <!--end::Input wrapper-->
          <!--begin::Meter-->
          <div
            class="d-flex align-items-center mb-3"
            data-kt-password-meter-control="highlight"
          >
            <div
              class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"
            ></div>
            <div
              class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"
            ></div>
            <div
              class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"
            ></div>
            <div
              class="flex-grow-1 bg-secondary bg-active-success rounded h-5px"
            ></div>
          </div>
          <!--end::Meter-->
        </div>
        <!--end::Wrapper-->
        <!--begin::Hint-->
        <div class="text-muted">
          Usa 8 o más caracteres con una mezcla de letras, números y símbolos.
        </div>
        <!--end::Hint-->
      </div>
      <!--end::Input group--->

      <!--begin::Input group-->
      <div class="fv-row mb-5">
        <label class="form-label fw-bold text-gray-900 fs-6"
          >Confirmar Contraseña</label
        >
        <Field
          class="form-control form-control-lg form-control-solid"
          type="password"
          placeholder="Confirma tu contraseña"
          name="password_confirmation"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password_confirmation" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <label class="form-check form-check-custom form-check-solid">
          <Field
            class="form-check-input"
            type="checkbox"
            name="toc"
            value="1"
          />
          <span class="form-check-label fw-semibold text-gray-700 fs-6">
            Acepto los
            <a href="#" class="ms-1 link-primary">Términos y Condiciones</a>.
          </span>
        </label>
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="toc" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="text-center">
        <button
          id="kt_sign_up_submit"
          ref="submitButton"
          type="submit"
          class="btn btn-lg btn-primary w-100"
        >
          <span class="indicator-label">Crear Cuenta</span>
          <span class="indicator-progress">
            Creando cuenta...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
      </div>
      <!--end::Actions-->
    </VForm>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import * as Yup from "yup";
import { useAuthStore, type User } from "@/stores/auth";
import { useRouter } from "vue-router";
import { PasswordMeterComponent } from "@/assets/ts/components";
import Swal from "sweetalert2/dist/sweetalert2.js";

const store = useAuthStore();
const router = useRouter();

const submitButton = ref<HTMLButtonElement | null>(null);

const registrationSchema = Yup.object().shape({
  first_name: Yup.string()
    .required("Los nombres son requeridos")
    .label("Nombres"),
  last_name: Yup.string()
    .required("Los apellidos son requeridos")
    .label("Apellidos"),
  username: Yup.string()
    .required("El usuario es requerido")
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .label("Usuario"),
  email: Yup.string()
    .min(4)
    .required("El correo electrónico es requerido")
    .email("Debe ser un correo electrónico válido")
    .label("Correo Electrónico"),
  password: Yup.string()
    .required("La contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .label("Contraseña"),
  password_confirmation: Yup.string()
    .required("La confirmación de contraseña es requerida")
    .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir")
    .label("Confirmación de Contraseña"),
  toc: Yup.boolean()
    .oneOf([true], "Debes aceptar los términos y condiciones")
    .label("Términos y Condiciones"),
});

onMounted(() => {
  nextTick(() => {
    PasswordMeterComponent.bootstrap();
  });
});

const onSubmitRegister = async (values: any) => {
  values = values as User;

  // Clear existing errors
  store.logout();

  if (submitButton.value) {
    submitButton.value.disabled = true;
    // Activate indicator
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  // Send register request
  await store.register(values);

  const error = Object.values(store.errors);

  if (error.length === 0) {
    Swal.fire({
      text: "¡Tu cuenta ha sido creada exitosamente!",
      icon: "success",
      buttonsStyling: false,
      confirmButtonText: "¡Entendido!",
      heightAuto: false,
      customClass: {
        confirmButton: "btn fw-semibold btn-light-primary",
      },
    }).then(function () {
      // Go to page after successfully register
      router.push({ name: "dashboard" });
    });
  } else {
    const errorMessage =
      typeof error[0] === "string"
        ? error[0]
        : (error[0] as any)?.message ||
          "Error al crear la cuenta. Por favor, verifica los datos ingresados.";
    Swal.fire({
      text: errorMessage,
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: "¡Intentar de nuevo!",
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
