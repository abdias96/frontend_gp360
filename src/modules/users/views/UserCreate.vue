<template>
  <div class="container-fluid">
    <!-- Título -->
    <div class="d-flex flex-column">
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        {{ $t('users.form.title.create') }}
      </h1>
    </div>

    <!-- Formulario -->
    <div class="card mt-5">
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
              required
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
              @input="generateUsername"
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
              @input="generateUsername"
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
              @input="generateUsername"
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
            <div class="input-group">
              <input
                v-model="form.username"
                type="text"
                class="form-control"
                id="username"
                :placeholder="$t('users.form.placeholders.username')"
                disabled
                :title="$t('users.form.hints.usernameNotEditable')"
              />
              <span v-if="checkingUsername" class="input-group-text">
                <span class="spinner-border spinner-border-sm"></span>
              </span>
              <span v-else-if="form.username" class="input-group-text">
                <i class="bi bi-check-circle-fill text-success"></i>
              </span>
            </div>
            <small class="form-text text-muted">
              <i class="bi bi-info-circle me-1"></i>
              {{ $t('users.form.hints.usernameGeneration') }}
            </small>
          </div>

          <div class="col-md-6">
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
              <option v-for="role in roles" :key="role?.id || 'role-' + roles.indexOf(role)" :value="role?.id">
                {{ role?.name || $t('users.time.noRole') }}
              </option>
            </select>
          </div>

          <div class="col-md-6">
            <label for="password" class="form-label"
              >{{ $t('users.form.fields.password') }} <span class="text-danger">*</span></label
            >
            <input
              v-model="form.password"
              type="password"
              class="form-control"
              id="password"
              :placeholder="$t('users.form.placeholders.password')"
              required
            />
            <small class="form-text text-muted">{{ $t('users.form.hints.minPassword') }}</small>
          </div>

          <div class="col-md-6">
            <label for="password_confirmation" class="form-label"
              >{{ $t('users.form.fields.confirmPassword') }} <span class="text-danger">*</span></label
            >
            <input
              v-model="form.password_confirmation"
              type="password"
              class="form-control"
              id="password_confirmation"
              :placeholder="$t('users.form.placeholders.confirmPassword')"
              required
            />
          </div>

          <!-- Estado -->
          <div class="col-12 mt-5">
            <h5 class="fw-bold text-primary">{{ $t('users.form.sections.status') }}</h5>
            <hr />
          </div>

          <div class="col-md-6">
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
                {{ loading ? $t('users.form.buttons.creating') : $t('users.form.buttons.create') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { usePermissions } from "@/composables/usePermissions";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";

const { t } = useI18n();

// Composables
const router = useRouter();
const { canCreate } = usePermissions();

// Reactive data
const loading = ref(false);
const checkingUsername = ref(false);
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
// Normalize string (remove accents and special characters)
const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]/g, ""); // Remove special characters
};

// Generate username based on name
const generateUsername = async () => {
  const firstName = form.value.first_name.trim();
  const lastName = form.value.last_name.trim();
  const secondLastName = form.value.second_last_name.trim();

  // Need at least first name and last name
  if (!firstName || !lastName) {
    form.value.username = "";
    return;
  }

  // Generate base username: first letter of first name + last name + first letter of second last name
  const firstInitial = normalizeString(firstName.charAt(0));
  const lastNameNormalized = normalizeString(lastName);
  const secondInitial = secondLastName ? normalizeString(secondLastName.charAt(0)) : "";

  let baseUsername = firstInitial + lastNameNormalized + secondInitial;

  // Check if username exists
  await checkUsernameAvailability(baseUsername);
};

// Check if username is available
const checkUsernameAvailability = async (baseUsername: string) => {
  checkingUsername.value = true;

  try {
    // Check if username exists in the database
    const response = await ApiService.get(`/users?search=${baseUsername}`);

    let finalUsername = baseUsername;

    if (response.data.success) {
      const usersData = response.data.data.data || response.data.data;

      // Check if exact username exists
      const exactMatch = usersData.find((u: any) =>
        u.username.toLowerCase() === baseUsername.toLowerCase()
      );

      if (exactMatch) {
        // Username exists, add random number
        let attempts = 0;
        let usernameExists = true;

        while (usernameExists && attempts < 10) {
          const randomNum = Math.floor(Math.random() * 9000) + 1000; // 4-digit random number
          finalUsername = baseUsername + randomNum;

          // Check if this combination exists
          const checkResponse = await ApiService.get(`/users?search=${finalUsername}`);
          const checkData = checkResponse.data.data.data || checkResponse.data.data;
          const existsCheck = checkData.find((u: any) =>
            u.username.toLowerCase() === finalUsername.toLowerCase()
          );

          if (!existsCheck) {
            usernameExists = false;
          }

          attempts++;
        }
      }
    }

    form.value.username = finalUsername;
  } catch (error) {
    console.error("Error checking username:", error);
    // If there's an error, just use the base username
    form.value.username = baseUsername;
  } finally {
    checkingUsername.value = false;
  }
};

const loadRoles = async () => {
  try {
    const response = await ApiService.get("roles");
    // Handle paginated response
    if (response.data.data && response.data.data.data) {
      roles.value = response.data.data.data || [];
    } else if (Array.isArray(response.data.data)) {
      roles.value = response.data.data || [];
    } else {
      roles.value = [];
    }
  } catch (error) {
    console.error("Error loading roles:", error);
    roles.value = [];
  }
};

const handleSubmit = async () => {
  if (!canCreate("users")) {
    Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.error'),
      text: t('users.swal.noPermissionCreate')
    });
    return;
  }

  // Validate username was generated
  if (!form.value.username) {
    Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.error'),
      text: t('users.swal.usernameRequired')
    });
    return;
  }

  // Wait if still checking username
  if (checkingUsername.value) {
    Swal.fire({
      icon: 'info',
      title: t('common.swal.titles.pleaseWait'),
      text: t('users.swal.checkingUsername')
    });
    return;
  }

  if (form.value.password !== form.value.password_confirmation) {
    Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.error'),
      text: t('users.swal.passwordMismatch')
    });
    return;
  }

  if (form.value.password.length < 8) {
    Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.error'),
      text: t('users.swal.passwordTooShort')
    });
    return;
  }

  loading.value = true;

  try {
    await ApiService.post("users", form.value);

    await Swal.fire({
      icon: 'success',
      title: t('common.swal.titles.success'),
      text: t('users.swal.createSuccess'),
      timer: 2000,
      showConfirmButton: false
    });

    router.push("/users");
  } catch (error: any) {
    console.error("Error creating user:", error);

    Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.error'),
      text: error.response?.data?.message || t('users.swal.createError')
    });
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  loadRoles();
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

.input-group .form-control:disabled {
  background-color: #f5f8fa;
  cursor: not-allowed;
}

.input-group-text {
  background-color: #f5f8fa;
  border-color: #e4e6ef;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.15em;
}
</style>
