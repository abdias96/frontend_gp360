<template>
  <div class="d-flex flex-column flex-lg-row">
    <!--begin::Sidebar-->
    <div class="flex-column flex-lg-row-auto w-lg-250px w-xl-350px mb-10">
      <!--begin::Card-->
      <div class="card mb-5 mb-xl-8">
        <!--begin::Card body-->
        <div class="card-body">
          <!--begin::Summary-->
          <!--begin::User Info-->
          <div class="d-flex flex-center flex-column py-5">
            <!--begin::Avatar-->
            <div
              class="symbol symbol-100px symbol-circle mb-7 position-relative"
            >
              <template v-if="userPhoto">
                <img
                  :src="userPhoto"
                  alt="Foto de perfil"
                  class="w-100 h-100 object-cover rounded-circle"
                />
              </template>
              <template v-else>
                <span class="symbol-label fs-3 bg-light-primary text-primary">
                  {{ userInitials }}
                </span>
              </template>

              <!-- Botón para cambiar foto -->
              <div class="position-absolute bottom-0 end-0">
                <button
                  @click="openPhotoUpload"
                  class="btn btn-sm btn-icon btn-primary rounded-circle shadow-sm"
                  :disabled="loading"
                  title="Cambiar foto de perfil"
                >
                  <i v-if="!loading" class="ki-duotone ki-camera fs-4">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  <span
                    v-else
                    class="spinner-border spinner-border-sm"
                    role="status"
                  ></span>
                </button>
              </div>
            </div>
            <!--end::Avatar-->

            <!-- Input oculto para subir foto -->
            <input
              ref="photoInput"
              type="file"
              accept="image/*"
              @change="handlePhotoUpload"
              style="display: none"
            />
            <!--begin::Name-->
            <span class="fs-3 text-gray-800 text-hover-primary fw-bold mb-3">
              {{ fullUserName }}
            </span>
            <!--end::Name-->
            <!--begin::Position-->
            <div class="mb-6">
              <!--begin::Badge-->
              <div class="badge badge-lg badge-light-primary d-inline">
                {{ user?.role?.name || "Usuario" }}
              </div>
              <!--end::Badge-->
            </div>
            <!--end::Position-->
          </div>
          <!--end::User Info-->
          <!--end::Summary-->

          <!--begin::Details toggle-->
          <div class="d-flex flex-stack fs-4 py-3">
            <div
              class="fw-bold rotate collapsible"
              data-bs-toggle="collapse"
              href="#kt_user_view_details"
              role="button"
              aria-expanded="false"
              aria-controls="kt_user_view_details"
            >
              {{ $t("users.profile.details") }}
              <span class="ms-2 rotate-180">
                <i class="ki-duotone ki-down fs-3"></i>
              </span>
            </div>
          </div>
          <!--end::Details toggle-->

          <!--begin::Details content-->
          <div id="kt_user_view_details" class="collapse show">
            <div class="pb-5 fs-6">
              <!--begin::Details item-->
              <div class="fw-bold mt-5">DPI</div>
              <div class="text-gray-600">{{ user?.dpi || "N/A" }}</div>
              <!--end::Details item-->

              <!--begin::Details item-->
              <div class="fw-bold mt-5">Email</div>
              <div class="text-gray-600">
                <a href="#" class="text-gray-600 text-hover-primary">{{
                  user?.email || "N/A"
                }}</a>
              </div>
              <!--end::Details item-->

              <!--begin::Details item-->
              <div class="fw-bold mt-5">Teléfono</div>
              <div class="text-gray-600">{{ user?.phone || "N/A" }}</div>
              <!--end::Details item-->

              <!--begin::Details item-->
              <div class="fw-bold mt-5">Estado</div>
              <div :class="userStatusClass">{{ userStatusText }}</div>
              <!--end::Details item-->

              <!--begin::Details item-->
              <div class="fw-bold mt-5">Último acceso</div>
              <div class="text-gray-600">{{ lastLogin }}</div>
              <!--end::Details item-->
            </div>
          </div>
          <!--end::Details content-->
        </div>
        <!--end::Card body-->
      </div>
      <!--end::Card-->
    </div>
    <!--end::Sidebar-->

    <!--begin::Content-->
    <div class="flex-lg-row-fluid ms-lg-15">
      <!--begin::Nav-->
      <ul
        class="nav nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-0 fs-4 fw-semibold mb-8"
      >
        <!--begin::Tab item-->
        <li class="nav-item">
          <a
            @click="activeTab = 'overview'"
            class="nav-link text-active-primary pb-4"
            :class="{ active: activeTab === 'overview' }"
            href="javascript:;"
            >Información General</a
          >
        </li>
        <!--end::Tab item-->

        <!--begin::Tab item-->
        <li class="nav-item">
          <a
            @click="activeTab = 'settings'"
            class="nav-link text-active-primary pb-4"
            :class="{ active: activeTab === 'settings' }"
            href="javascript:;"
            >Configuración</a
          >
        </li>
        <!--end::Tab item-->

        <!--begin::Tab item-->
        <li class="nav-item">
          <a
            @click="activeTab = 'security'"
            class="nav-link text-active-primary pb-4"
            :class="{ active: activeTab === 'security' }"
            href="javascript:;"
            >Seguridad</a
          >
        </li>
        <!--end::Tab item-->
      </ul>
      <!--end::Nav-->

      <!--begin::Tab content-->
      <div class="tab-content" id="myTabContent">
        <!--begin:::Tab pane-->
        <div
          v-if="activeTab === 'overview'"
          class="tab-pane fade show active"
          id="kt_user_view_overview_tab"
          role="tabpanel"
        >
          <!--begin::Card-->
          <div class="card card-flush mb-6 mb-xl-9">
            <!--begin::Card header-->
            <div class="card-header mt-6">
              <!--begin::Card title-->
              <div class="card-title flex-column">
                <h2 class="mb-1">Información Personal</h2>
                <div class="fs-6 fw-semibold text-muted">
                  Datos básicos del usuario
                </div>
              </div>
              <!--end::Card title-->
              <!--begin::Card toolbar-->
              <div class="card-toolbar">
                <button
                  type="button"
                  class="btn btn-light-primary btn-sm"
                  @click="toggleEditMode"
                >
                  <i class="ki-duotone ki-pencil fs-3">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  {{ editMode ? "Cancelar" : "Editar" }}
                </button>
              </div>
              <!--end::Card toolbar-->
            </div>
            <!--end::Card header-->

            <!--begin::Card body-->
            <div class="card-body p-9">
              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Label-->
                <label class="col-lg-4 fw-semibold text-muted">DPI</label>
                <!--end::Label-->
                <!--begin::Col-->
                <div class="col-lg-8">
                  <span class="fw-bold fs-6 text-gray-800">{{
                    user?.dpi || "N/A"
                  }}</span>
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Label-->
                <label class="col-lg-4 fw-semibold text-muted"
                  >Primer Nombre</label
                >
                <!--end::Label-->
                <!--begin::Col-->
                <div class="col-lg-8">
                  <span v-if="!editMode" class="fw-bold fs-6 text-gray-800">{{
                    user?.primer_nombre || user?.first_name || "N/A"
                  }}</span>
                  <input
                    v-else
                    v-model="editForm.primer_nombre"
                    type="text"
                    class="form-control form-control-solid"
                  />
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Label-->
                <label class="col-lg-4 fw-semibold text-muted"
                  >Segundo Nombre</label
                >
                <!--end::Label-->
                <!--begin::Col-->
                <div class="col-lg-8">
                  <span v-if="!editMode" class="fw-bold fs-6 text-gray-800">{{
                    user?.segundo_nombre || user?.middle_name || "N/A"
                  }}</span>
                  <input
                    v-else
                    v-model="editForm.segundo_nombre"
                    type="text"
                    class="form-control form-control-solid"
                  />
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Label-->
                <label class="col-lg-4 fw-semibold text-muted"
                  >Primer Apellido</label
                >
                <!--end::Label-->
                <!--begin::Col-->
                <div class="col-lg-8">
                  <span v-if="!editMode" class="fw-bold fs-6 text-gray-800">{{
                    user?.primer_apellido || user?.last_name || "N/A"
                  }}</span>
                  <input
                    v-else
                    v-model="editForm.primer_apellido"
                    type="text"
                    class="form-control form-control-solid"
                  />
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Label-->
                <label class="col-lg-4 fw-semibold text-muted"
                  >Segundo Apellido</label
                >
                <!--end::Label-->
                <!--begin::Col-->
                <div class="col-lg-8">
                  <span v-if="!editMode" class="fw-bold fs-6 text-gray-800">{{
                    user?.segundo_apellido || user?.second_last_name || "N/A"
                  }}</span>
                  <input
                    v-else
                    v-model="editForm.segundo_apellido"
                    type="text"
                    class="form-control form-control-solid"
                  />
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Label-->
                <label class="col-lg-4 fw-semibold text-muted">Email</label>
                <!--end::Label-->
                <!--begin::Col-->
                <div class="col-lg-8 fv-row">
                  <span
                    v-if="!editMode"
                    class="fw-semibold text-gray-800 fs-6"
                    >{{ user?.email || "N/A" }}</span
                  >
                  <input
                    v-else
                    v-model="editForm.email"
                    type="email"
                    class="form-control form-control-solid"
                  />
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Label-->
                <label class="col-lg-4 fw-semibold text-muted">Usuario</label>
                <!--end::Label-->
                <!--begin::Col-->
                <div class="col-lg-8 d-flex align-items-center">
                  <span
                    v-if="!editMode"
                    class="fw-bold fs-6 text-gray-800 me-2"
                    >{{ user?.username || "N/A" }}</span
                  >
                  <input
                    v-else
                    v-model="editForm.username"
                    type="text"
                    class="form-control form-control-solid"
                  />
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Label-->
                <label class="col-lg-4 fw-semibold text-muted">Teléfono</label>
                <!--end::Label-->
                <!--begin::Col-->
                <div class="col-lg-8">
                  <span v-if="!editMode" class="fw-bold fs-6 text-gray-800">{{
                    user?.phone || "N/A"
                  }}</span>
                  <input
                    v-else
                    v-model="editForm.phone"
                    type="text"
                    class="form-control form-control-solid"
                    placeholder="+502 1234-5678"
                  />
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row mb-10">
                <!--begin::Label-->
                <label class="col-lg-4 fw-semibold text-muted">Rol</label>
                <!--end::Label-->
                <!--begin::Col-->
                <div class="col-lg-8">
                  <span class="fw-semibold fs-6 text-gray-800">{{
                    user?.role?.name || "N/A"
                  }}</span>
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <!--begin::Actions-->
              <div v-if="editMode" class="d-flex justify-content-end">
                <button
                  type="button"
                  class="btn btn-light-primary me-3"
                  @click="saveChanges"
                  :disabled="loading"
                >
                  <span v-if="!loading">Guardar Cambios</span>
                  <span v-else>
                    <span
                      class="spinner-border spinner-border-sm align-middle ms-2"
                    ></span>
                    Guardando...
                  </span>
                </button>
                <button type="button" class="btn btn-light" @click="cancelEdit">
                  Cancelar
                </button>
              </div>
              <!--end::Actions-->
            </div>
            <!--end::Card body-->
          </div>
          <!--end::Card-->
        </div>
        <!--end:::Tab pane-->

        <!--begin:::Tab pane-->
        <div
          v-if="activeTab === 'settings'"
          class="tab-pane fade show active"
          id="kt_user_view_overview_settings"
          role="tabpanel"
        >
          <!--begin::Card-->
          <div class="card card-flush mb-6 mb-xl-9">
            <!--begin::Card header-->
            <div class="card-header mt-6">
              <!--begin::Card title-->
              <div class="card-title flex-column">
                <h2 class="mb-1">Configuración de la Cuenta</h2>
                <div class="fs-6 fw-semibold text-muted">
                  Personaliza tu experiencia
                </div>
              </div>
              <!--end::Card title-->
            </div>
            <!--end::Card header-->

            <!--begin::Card body-->
            <div class="card-body p-9">
              <!--begin::Row-->
              <div class="row mb-6">
                <label class="col-lg-4 col-form-label fw-semibold fs-6"
                  >Idioma Preferido</label
                >
                <div class="col-lg-8 fv-row">
                  <select
                    v-model="settingsForm.language"
                    class="form-select form-select-solid form-select-lg"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                  <div class="form-text">
                    Selecciona el idioma de la interfaz
                  </div>
                </div>
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row mb-6">
                <label class="col-lg-4 col-form-label fw-semibold fs-6"
                  >Zona Horaria</label
                >
                <div class="col-lg-8 fv-row">
                  <select
                    v-model="settingsForm.timezone"
                    class="form-select form-select-solid form-select-lg"
                  >
                    <option value="America/Guatemala">Guatemala (GMT-6)</option>
                    <option value="America/Mexico_City">México (GMT-6)</option>
                    <option value="America/New_York">Nueva York (GMT-5)</option>
                  </select>
                  <div class="form-text">
                    Zona horaria para mostrar fechas y horas
                  </div>
                </div>
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row mb-6">
                <label class="col-lg-4 col-form-label fw-semibold fs-6"
                  >Notificaciones por Email</label
                >
                <div class="col-lg-8 fv-row">
                  <div
                    class="form-check form-switch form-check-custom form-check-solid"
                  >
                    <input
                      v-model="settingsForm.emailNotifications"
                      class="form-check-input"
                      type="checkbox"
                      id="emailNotifications"
                    />
                    <label class="form-check-label" for="emailNotifications">
                      Recibir notificaciones importantes por correo
                    </label>
                  </div>
                </div>
              </div>
              <!--end::Row-->

              <!--begin::Actions-->
              <div class="d-flex justify-content-end">
                <button
                  type="button"
                  class="btn btn-light-primary"
                  @click="saveSettings"
                  :disabled="loading"
                >
                  <span v-if="!loading">Guardar Configuración</span>
                  <span v-else>
                    <span
                      class="spinner-border spinner-border-sm align-middle ms-2"
                    ></span>
                    Guardando...
                  </span>
                </button>
              </div>
              <!--end::Actions-->
            </div>
            <!--end::Card body-->
          </div>
          <!--end::Card-->
        </div>
        <!--end:::Tab pane-->

        <!--begin:::Tab pane-->
        <div
          v-if="activeTab === 'security'"
          class="tab-pane fade show active"
          id="kt_user_view_overview_security"
          role="tabpanel"
        >
          <!--begin::Card-->
          <div class="card card-flush mb-6 mb-xl-9">
            <!--begin::Card header-->
            <div class="card-header mt-6">
              <!--begin::Card title-->
              <div class="card-title flex-column">
                <h2 class="mb-1">Cambiar Contraseña</h2>
                <div class="fs-6 fw-semibold text-muted">
                  Asegura tu cuenta con una contraseña fuerte
                </div>
              </div>
              <!--end::Card title-->
            </div>
            <!--end::Card header-->

            <!--begin::Card body-->
            <div class="card-body p-9">
              <!--begin::Form-->
              <form @submit.prevent="changePassword">
                <!--begin::Row-->
                <div class="row mb-6">
                  <label
                    class="col-lg-4 col-form-label required fw-semibold fs-6"
                    >Contraseña Actual</label
                  >
                  <div class="col-lg-8 fv-row">
                    <input
                      v-model="passwordForm.current_password"
                      type="password"
                      class="form-control form-control-lg form-control-solid"
                      placeholder="Ingresa tu contraseña actual"
                      required
                    />
                  </div>
                </div>
                <!--end::Row-->

                <!--begin::Row-->
                <div class="row mb-6">
                  <label
                    class="col-lg-4 col-form-label required fw-semibold fs-6"
                    >Nueva Contraseña</label
                  >
                  <div class="col-lg-8 fv-row">
                    <input
                      v-model="passwordForm.new_password"
                      type="password"
                      class="form-control form-control-lg form-control-solid"
                      placeholder="Ingresa tu nueva contraseña"
                      required
                    />
                    <div class="form-text">Mínimo 8 caracteres</div>
                  </div>
                </div>
                <!--end::Row-->

                <!--begin::Row-->
                <div class="row mb-6">
                  <label
                    class="col-lg-4 col-form-label required fw-semibold fs-6"
                    >Confirmar Nueva Contraseña</label
                  >
                  <div class="col-lg-8 fv-row">
                    <input
                      v-model="passwordForm.new_password_confirmation"
                      type="password"
                      class="form-control form-control-lg form-control-solid"
                      placeholder="Confirma tu nueva contraseña"
                      required
                    />
                  </div>
                </div>
                <!--end::Row-->

                <!--begin::Actions-->
                <div class="d-flex justify-content-end">
                  <button
                    type="submit"
                    class="btn btn-light-primary"
                    :disabled="loading"
                  >
                    <span v-if="!loading">Actualizar Contraseña</span>
                    <span v-else>
                      <span
                        class="spinner-border spinner-border-sm align-middle ms-2"
                      ></span>
                      Actualizando...
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

          <!--begin::Card-->
          <div class="card card-flush">
            <!--begin::Card header-->
            <div class="card-header mt-6">
              <!--begin::Card title-->
              <div class="card-title flex-column">
                <h2 class="mb-1">Autenticación de Dos Factores</h2>
                <div class="fs-6 fw-semibold text-muted">
                  Añade una capa extra de seguridad
                </div>
              </div>
              <!--end::Card title-->
            </div>
            <!--end::Card header-->

            <!--begin::Card body-->
            <div class="card-body p-9">
              <div
                class="notice d-flex bg-light-warning rounded border-warning border border-dashed p-6"
              >
                <i class="ki-duotone ki-information fs-2tx text-warning me-4">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
                <div class="d-flex flex-stack flex-grow-1">
                  <div class="fw-semibold">
                    <h4 class="text-gray-900 fw-bold">Próximamente</h4>
                    <div class="fs-6 text-gray-700">
                      La autenticación de dos factores estará disponible en una
                      próxima actualización.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--end::Card body-->
          </div>
          <!--end::Card-->
        </div>
        <!--end:::Tab pane-->
      </div>
      <!--end:::Tab content-->
    </div>
    <!--end::Content-->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "vue-i18n";
import Swal from "sweetalert2/dist/sweetalert2.js";
import ApiService from "@/core/services/ApiService";
import FileStorageService from "@/core/services/FileStorageService";

const store = useAuthStore();
const { t } = useI18n();
const activeTab = ref("overview");
const editMode = ref(false);
const photoInput = ref<HTMLInputElement>();
const userPhoto = ref<string>("");
const loading = ref(false);

const user = computed(() => store.user);

const editForm = ref({
  primer_nombre: "",
  segundo_nombre: "",
  primer_apellido: "",
  segundo_apellido: "",
  email: "",
  username: "",
  phone: "",
});

const passwordForm = ref({
  current_password: "",
  new_password: "",
  new_password_confirmation: "",
});

const settingsForm = ref({
  language: "es",
  timezone: "America/Guatemala",
  emailNotifications: true,
});

// Computed para nombre completo del usuario
const fullUserName = computed(() => {
  if (user.value) {
    const firstName = user.value.primer_nombre || user.value.first_name || "";
    const middleName =
      user.value.segundo_nombre || user.value.middle_name || "";
    const lastName = user.value.primer_apellido || user.value.last_name || "";
    const secondLastName =
      user.value.segundo_apellido || user.value.second_last_name || "";

    const parts = [firstName, middleName, lastName, secondLastName].filter(
      Boolean,
    );
    return parts.length > 0
      ? parts.join(" ")
      : user.value.name || user.value.username || "Usuario";
  }
  return "Usuario";
});

const userInitials = computed(() => {
  const name = fullUserName.value;
  if (name && name !== "Usuario") {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }
  return "U";
});

// Estado del usuario con datos reales
const userStatusText = computed(() => {
  if (user.value?.active === true) return "Activo";
  if (user.value?.active === false) return "Inactivo";
  return "N/A";
});

const userStatusClass = computed(() => {
  if (user.value?.active === true) return "badge badge-light-success";
  if (user.value?.active === false) return "badge badge-light-danger";
  return "badge badge-light-secondary";
});

// Último acceso con datos reales
const lastLogin = computed(() => {
  if (user.value?.last_login) {
    return formatDate(user.value.last_login);
  } else if (user.value?.updated_at) {
    return `Actualizado ${formatDate(user.value.updated_at)}`;
  }
  return "No registrado";
});

// Formatear fechas
const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Hoy";
    } else if (diffDays === 1) {
      return "Ayer";
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  } catch (error) {
    return dateString;
  }
};

// Cargar datos completos del perfil
const loadUserProfile = async () => {
  try {
    loading.value = true;
    const { data } = await ApiService.get("user/profile");

    if (data.data && data.data.user) {
      // Actualizar el usuario en el store
      store.setAuth({
        data: {
          user: data.data.user,
          token: store.token || "", // Mantener el token actual
          permissions: data.data.permissions || store.permissions,
        },
      });

      // Cargar foto de perfil si existe
      if (data.data.user.profile_photo_url) {
        userPhoto.value = data.data.user.profile_photo_url;
      } else if (data.data.user.profile_photo) {
        userPhoto.value = FileStorageService.getFileUrl(
          data.data.user.profile_photo,
        );
      } else {
        userPhoto.value = "";
      }
    }
  } catch (error) {
    console.error("Error loading user profile:", error);
  } finally {
    loading.value = false;
  }
};

// Cargar configuraciones del usuario
const loadUserSettings = async () => {
  try {
    const { data } = await ApiService.get("user/settings");

    if (data.status === "success" && data.data) {
      settingsForm.value = {
        language: data.data.language || "es",
        timezone: data.data.timezone || "America/Guatemala",
        emailNotifications: data.data.email_notifications ?? true,
      };
    }
  } catch (error) {
    console.error("Error loading user settings:", error);
  }
};

// Manejo de subida de fotos
const openPhotoUpload = () => {
  photoInput.value?.click();
};

const handlePhotoUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  try {
    loading.value = true;

    // Usar el nuevo endpoint para subir foto de perfil
    const formData = new FormData();
    formData.append("file", file);

    const response = await ApiService.post("user/profile-photo", formData);

    if (response.data.status === "success") {
      // Actualizar foto en la interfaz inmediatamente
      userPhoto.value = response.data.data.url;

      // Actualizar el usuario en el store
      await loadUserProfile();

      Swal.fire({
        text: "Foto de perfil actualizada correctamente",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "OK",
        heightAuto: false,
        customClass: {
          confirmButton: "btn fw-semibold btn-light-primary",
        },
      });
    }
  } catch (error: any) {
    console.error("Photo upload error:", error);

    Swal.fire({
      title: "Error al subir foto",
      text: error.response?.data?.message || "Error al subir la foto",
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: "OK",
      heightAuto: false,
      customClass: {
        confirmButton: "btn fw-semibold btn-light-danger",
      },
    });
  } finally {
    loading.value = false;
    // Limpiar input
    if (target) target.value = "";
  }
};

const saveChanges = async () => {
  try {
    loading.value = true;

    await ApiService.put("user/profile", editForm.value);

    // Recargar datos del usuario
    await loadUserProfile();

    Swal.fire({
      text: "Cambios guardados correctamente",
      icon: "success",
      buttonsStyling: false,
      confirmButtonText: "OK",
      heightAuto: false,
      customClass: {
        confirmButton: "btn fw-semibold btn-light-primary",
      },
    }).then(() => {
      editMode.value = false;
    });
  } catch (error: any) {
    Swal.fire({
      text: error.response?.data?.message || "Error al guardar los cambios",
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: "OK",
      heightAuto: false,
      customClass: {
        confirmButton: "btn fw-semibold btn-light-danger",
      },
    });
  } finally {
    loading.value = false;
  }
};

// Initialize edit form when entering edit mode
const initEditForm = () => {
  if (user.value) {
    editForm.value = {
      primer_nombre: user.value.primer_nombre || user.value.first_name || "",
      segundo_nombre: user.value.segundo_nombre || user.value.middle_name || "",
      primer_apellido: user.value.primer_apellido || user.value.last_name || "",
      segundo_apellido:
        user.value.segundo_apellido || user.value.second_last_name || "",
      email: user.value.email || "",
      username: user.value.username || "",
      phone: user.value.phone || "",
    };
  }
};

// Toggle edit mode
const toggleEditMode = () => {
  editMode.value = !editMode.value;
  if (editMode.value) {
    initEditForm();
  }
};

// Cancel edit
const cancelEdit = () => {
  editMode.value = false;
  initEditForm(); // Reset form
};

// Change password
const changePassword = async () => {
  if (
    passwordForm.value.new_password !==
    passwordForm.value.new_password_confirmation
  ) {
    Swal.fire({
      text: "Las contraseñas no coinciden",
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: "OK",
      heightAuto: false,
      customClass: {
        confirmButton: "btn fw-semibold btn-light-danger",
      },
    });
    return;
  }

  try {
    loading.value = true;

    await ApiService.post("user/change-password", passwordForm.value);

    // Limpiar formulario
    passwordForm.value = {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    };

    Swal.fire({
      text: "Contraseña actualizada correctamente",
      icon: "success",
      buttonsStyling: false,
      confirmButtonText: "OK",
      heightAuto: false,
      customClass: {
        confirmButton: "btn fw-semibold btn-light-primary",
      },
    });
  } catch (error: any) {
    Swal.fire({
      text: error.response?.data?.message || "Error al cambiar la contraseña",
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: "OK",
      heightAuto: false,
      customClass: {
        confirmButton: "btn fw-semibold btn-light-danger",
      },
    });
  } finally {
    loading.value = false;
  }
};

// Save settings
const saveSettings = async () => {
  try {
    loading.value = true;

    await ApiService.put("user/settings", settingsForm.value);

    Swal.fire({
      text: "Configuración guardada correctamente",
      icon: "success",
      buttonsStyling: false,
      confirmButtonText: "OK",
      heightAuto: false,
      customClass: {
        confirmButton: "btn fw-semibold btn-light-primary",
      },
    });
  } catch (error: any) {
    Swal.fire({
      text:
        error.response?.data?.message || "Error al guardar la configuración",
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: "OK",
      heightAuto: false,
      customClass: {
        confirmButton: "btn fw-semibold btn-light-danger",
      },
    });
  } finally {
    loading.value = false;
  }
};

// Watch para actualizar foto cuando el usuario en el store cambie
watch(
  () => user.value?.profile_photo_url,
  (newPhotoUrl) => {
    if (newPhotoUrl) {
      userPhoto.value = newPhotoUrl;
    } else if (user.value?.profile_photo) {
      userPhoto.value = FileStorageService.getFileUrl(user.value.profile_photo);
    } else {
      userPhoto.value = "";
    }
  },
  { immediate: true },
);

// Cargar datos al montar el componente
onMounted(() => {
  loadUserProfile();
  loadUserSettings();
});
</script>
