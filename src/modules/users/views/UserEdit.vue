<template>
  <div class="container-fluid">
    <!-- Título -->
    <div class="d-flex flex-column">
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        {{ $t('users.form.title.edit') }}
      </h1>
    </div>

    <!-- Loading state -->
    <div v-if="loadingUser" class="d-flex justify-content-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">{{ $t('users.list.loading') }}</span>
      </div>
    </div>

    <!-- Formulario -->
    <div v-else-if="user" class="card mt-5">
      <div class="card-header">
        <h3 class="card-title">{{ $t('users.form.sections.personalInfo') }}</h3>
        <div class="card-toolbar">
          <router-link to="/users" class="btn btn-secondary me-2">
            <i class="bi bi-arrow-left me-1"></i>
            {{ $t('users.form.buttons.back') }}
          </router-link>
        </div>
      </div>

      <div class="card-body">
        <form @submit.prevent="handleSubmit" class="row g-3">
          <!-- Información Personal -->
          <div class="col-12">
            <h5 class="fw-bold text-primary">{{ $t('users.form.sections.personalInfo') }}</h5>
            <hr />
          </div>

          <div class="col-md-6">
            <label for="dpi" class="form-label"
              >{{ $t('users.form.fields.dpi') }} <span class="text-danger">*</span></label
            >
            <input
              v-model="form.dpi"
              type="text"
              class="form-control"
              id="dpi"
              :placeholder="$t('users.form.placeholders.dpi')"
              disabled
              :title="$t('users.form.hints.dpiNotEditable')"
            />
          </div>

          <div class="col-md-6">
            <label for="email" class="form-label"
              >{{ $t('users.form.fields.email') }} <span class="text-danger">*</span></label
            >
            <input
              v-model="form.email"
              type="email"
              class="form-control"
              id="email"
              :placeholder="$t('users.form.placeholders.email')"
              required
            />
          </div>

          <div class="col-md-6">
            <label for="first_name" class="form-label"
              >{{ $t('users.form.fields.firstName') }} <span class="text-danger">*</span></label
            >
            <input
              v-model="form.first_name"
              type="text"
              class="form-control"
              id="first_name"
              :placeholder="$t('users.form.placeholders.firstName')"
              required
            />
          </div>

          <div class="col-md-6">
            <label for="middle_name" class="form-label">{{ $t('users.form.fields.middleName') }}</label>
            <input
              v-model="form.middle_name"
              type="text"
              class="form-control"
              id="middle_name"
              :placeholder="$t('users.form.placeholders.middleName')"
            />
          </div>

          <div class="col-md-6">
            <label for="last_name" class="form-label"
              >{{ $t('users.form.fields.lastName') }} <span class="text-danger">*</span></label
            >
            <input
              v-model="form.last_name"
              type="text"
              class="form-control"
              id="last_name"
              :placeholder="$t('users.form.placeholders.lastName')"
              required
            />
          </div>

          <div class="col-md-6">
            <label for="second_last_name" class="form-label"
              >{{ $t('users.form.fields.secondLastName') }}</label
            >
            <input
              v-model="form.second_last_name"
              type="text"
              class="form-control"
              id="second_last_name"
              :placeholder="$t('users.form.placeholders.secondLastName')"
            />
          </div>

          <!-- Información de Cuenta -->
          <div class="col-12 mt-5">
            <h5 class="fw-bold text-primary">{{ $t('users.form.sections.accountInfo') }}</h5>
            <hr />
          </div>

          <div class="col-md-6">
            <label for="username" class="form-label"
              >{{ $t('users.form.fields.username') }} <span class="text-danger">*</span></label
            >
            <input
              v-model="form.username"
              type="text"
              class="form-control"
              id="username"
              :placeholder="$t('users.form.placeholders.username')"
              disabled
              :title="$t('users.form.hints.usernameNotEditable')"
            />
          </div>

          <div class="col-md-6" v-permission="'users.change_role'">
            <label for="role_id" class="form-label"
              >{{ $t('users.form.fields.role') }} <span class="text-danger">*</span></label
            >
            <select
              v-model="form.role_id"
              class="form-select"
              id="role_id"
              required
            >
              <option value="">{{ $t('users.form.placeholders.selectRole') }}</option>
              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>

          <!-- Cambio de Contraseña -->
          <div class="col-12 mt-5">
            <h5 class="fw-bold text-primary">{{ $t('users.form.sections.changePassword') }}</h5>
            <hr />
          </div>

          <div class="col-12">
            <div class="form-check form-switch mb-3">
              <input
                v-model="changePassword"
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="change_password"
                @change="onChangePasswordToggle"
              />
              <label class="form-check-label fw-semibold" for="change_password">
                {{ changePassword ? $t('users.form.togglePassword.disable') : $t('users.form.togglePassword.enable') }}
              </label>
            </div>
            <small v-if="!changePassword" class="form-text text-muted">
              {{ $t('users.form.hints.changePasswordHint') }}
            </small>
          </div>

          <div v-show="changePassword" class="col-md-6">
            <label for="password" class="form-label"
              >{{ $t('users.form.fields.newPassword') }} <span class="text-danger">*</span></label
            >
            <input
              v-model="form.password"
              type="password"
              class="form-control"
              id="password"
              :placeholder="$t('users.form.placeholders.newPassword')"
              :required="changePassword"
            />
            <small class="form-text text-muted">{{ $t('users.form.hints.minPassword') }}</small>
          </div>

          <div v-show="changePassword" class="col-md-6">
            <label for="password_confirmation" class="form-label"
              >{{ $t('users.form.fields.confirmPassword') }} <span class="text-danger">*</span></label
            >
            <input
              v-model="form.password_confirmation"
              type="password"
              class="form-control"
              id="password_confirmation"
              :placeholder="$t('users.form.placeholders.confirmPassword')"
              :required="changePassword"
            />
          </div>

          <!-- Estado -->
          <div class="col-12 mt-5" v-permission="'users.toggle_status'">
            <h5 class="fw-bold text-primary">{{ $t('users.form.sections.status') }}</h5>
            <hr />
          </div>

          <div class="col-md-6" v-permission="'users.toggle_status'">
            <div class="form-check">
              <input
                v-model="form.active"
                class="form-check-input"
                type="checkbox"
                id="active"
              />
              <label class="form-check-label" for="active">
                {{ $t('users.form.fields.active') }}
              </label>
            </div>
          </div>

          <!-- Botones -->
          <div class="col-12 mt-5">
            <div class="d-flex justify-content-end gap-2">
              <router-link to="/users" class="btn btn-secondary">
                {{ $t('users.form.buttons.cancel') }}
              </router-link>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <div
                  v-if="loading"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                >
                  <span class="visually-hidden">{{ $t('users.list.loading') }}</span>
                </div>
                <i v-else class="bi bi-save me-1"></i>
                {{ loading ? $t('users.form.buttons.saving') : $t('users.form.buttons.save') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Error state -->
    <div v-else class="alert alert-danger mt-5">
      <h4>{{ $t('common.swal.titles.error') }}</h4>
      <p>{{ $t('users.errors.loadFailed') }}</p>
      <router-link to="/users" class="btn btn-secondary">
        {{ $t('users.errors.backToList') }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { usePermissions } from "@/composables/usePermissions";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";

const { t } = useI18n();

// Composables
const router = useRouter();
const route = useRoute();
const { canEdit } = usePermissions();

// Reactive data
const loading = ref(false);
const loadingUser = ref(true);
const changePassword = ref(false);
const user = ref(null);
const roles = ref([]);

const form = ref({
  dpi: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  second_last_name: "",
  email: "",
  username: "",
  password: "",
  password_confirmation: "",
  role_id: "",
  active: true,
});

// Methods
const onChangePasswordToggle = () => {
  // Clear password fields when toggling off
  if (!changePassword.value) {
    form.value.password = "";
    form.value.password_confirmation = "";
  }
};

const loadUser = async () => {
  const userId = route.params.id;

  if (!userId) {
    router.push("/users");
    return;
  }

  try {
    loadingUser.value = true;
    const response = await ApiService.get(`users/${userId}`);
    user.value = response.data.data;

    // Populate form
    const userData = user.value;
    form.value = {
      dpi: userData.dpi || "",
      first_name: userData.first_name || "",
      middle_name: userData.middle_name || "",
      last_name: userData.last_name || "",
      second_last_name: userData.second_last_name || "",
      email: userData.email || "",
      username: userData.username || "",
      password: "",
      password_confirmation: "",
      role_id: userData.role_id || "",
      active: userData.active ?? true,
    };
  } catch (error) {
    console.error("Error loading user:", error);
    user.value = null;
  } finally {
    loadingUser.value = false;
  }
};

const loadRoles = async () => {
  try {
    const response = await ApiService.get("roles");

    // Handle different response structures
    if (response.data.success) {
      const rolesData = response.data.data;
      // Check if it's paginated
      roles.value = Array.isArray(rolesData) ? rolesData : (rolesData.data || []);
    } else {
      roles.value = response.data.data || response.data || [];
    }

  } catch (error) {
    console.error("Error loading roles:", error);
    Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.error'),
      text: t('users.swal.rolesLoadError')
    });
  }
};

const handleSubmit = async () => {
  if (!canEdit("users")) {
    Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.error'),
      text: t('users.swal.noPermissionEdit')
    });
    return;
  }

  if (
    changePassword.value &&
    form.value.password !== form.value.password_confirmation
  ) {
    Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.error'),
      text: t('users.swal.passwordMismatch')
    });
    return;
  }

  loading.value = true;

  try {
    const userId = route.params.id;
    const updateData = { ...form.value };

    // Remove password fields if not changing password
    if (!changePassword.value) {
      delete updateData.password;
      delete updateData.password_confirmation;
    }

    await ApiService.put(`users/${userId}`, updateData);

    await Swal.fire({
      icon: 'success',
      title: t('common.swal.titles.success'),
      text: t('users.swal.updateSuccess'),
      timer: 2000,
      showConfirmButton: false
    });

    router.push("/users");
  } catch (error: any) {
    console.error("Error updating user:", error);

    Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.error'),
      text: error.response?.data?.message || t('users.swal.updateError')
    });
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  await Promise.all([loadUser(), loadRoles()]);
});
</script>

<style scoped>
.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.form-label {
  font-weight: 500;
}

.text-danger {
  color: #dc3545 !important;
}

.text-primary {
  color: #0d6efd !important;
}

hr {
  margin: 0.5rem 0 1rem 0;
}
</style>
