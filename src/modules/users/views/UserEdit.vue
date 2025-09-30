<template>
  <div class="container-fluid">
    <!-- Título -->
    <div class="d-flex flex-column">
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        Editar Usuario
      </h1>
    </div>

    <!-- Loading state -->
    <div v-if="loadingUser" class="d-flex justify-content-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Formulario -->
    <div v-else-if="user" class="card mt-5">
      <div class="card-header">
        <h3 class="card-title">Información del Usuario</h3>
        <div class="card-toolbar">
          <router-link to="/users" class="btn btn-secondary me-2">
            <i class="bi bi-arrow-left me-1"></i>
            Volver
          </router-link>
        </div>
      </div>

      <div class="card-body">
        <form @submit.prevent="handleSubmit" class="row g-3">
          <!-- Información Personal -->
          <div class="col-12">
            <h5 class="fw-bold text-primary">Información Personal</h5>
            <hr />
          </div>

          <div class="col-md-6">
            <label for="dpi" class="form-label"
              >DPI <span class="text-danger">*</span></label
            >
            <input
              v-model="form.dpi"
              type="text"
              class="form-control"
              id="dpi"
              placeholder="Ingrese el DPI"
              required
            />
          </div>

          <div class="col-md-6">
            <label for="email" class="form-label"
              >Email <span class="text-danger">*</span></label
            >
            <input
              v-model="form.email"
              type="email"
              class="form-control"
              id="email"
              placeholder="Ingrese el email"
              required
            />
          </div>

          <div class="col-md-6">
            <label for="first_name" class="form-label"
              >Primer Nombre <span class="text-danger">*</span></label
            >
            <input
              v-model="form.first_name"
              type="text"
              class="form-control"
              id="first_name"
              placeholder="Primer nombre"
              required
            />
          </div>

          <div class="col-md-6">
            <label for="middle_name" class="form-label">Segundo Nombre</label>
            <input
              v-model="form.middle_name"
              type="text"
              class="form-control"
              id="middle_name"
              placeholder="Segundo nombre (opcional)"
            />
          </div>

          <div class="col-md-6">
            <label for="last_name" class="form-label"
              >Primer Apellido <span class="text-danger">*</span></label
            >
            <input
              v-model="form.last_name"
              type="text"
              class="form-control"
              id="last_name"
              placeholder="Primer apellido"
              required
            />
          </div>

          <div class="col-md-6">
            <label for="second_last_name" class="form-label"
              >Segundo Apellido</label
            >
            <input
              v-model="form.second_last_name"
              type="text"
              class="form-control"
              id="second_last_name"
              placeholder="Segundo apellido (opcional)"
            />
          </div>

          <!-- Información de Cuenta -->
          <div class="col-12 mt-5">
            <h5 class="fw-bold text-primary">Información de Cuenta</h5>
            <hr />
          </div>

          <div class="col-md-6">
            <label for="username" class="form-label"
              >Usuario <span class="text-danger">*</span></label
            >
            <input
              v-model="form.username"
              type="text"
              class="form-control"
              id="username"
              placeholder="Nombre de usuario"
              required
            />
          </div>

          <div class="col-md-6" v-permission="'users.change_role'">
            <label for="role_id" class="form-label"
              >Rol <span class="text-danger">*</span></label
            >
            <select
              v-model="form.role_id"
              class="form-select"
              id="role_id"
              required
            >
              <option value="">Seleccione un rol</option>
              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>

          <!-- Cambio de Contraseña -->
          <div class="col-12 mt-5">
            <h5 class="fw-bold text-primary">Cambiar Contraseña</h5>
            <hr />
            <div class="form-check mb-3">
              <input
                v-model="changePassword"
                class="form-check-input"
                type="checkbox"
                id="change_password"
              />
              <label class="form-check-label" for="change_password">
                Cambiar contraseña
              </label>
            </div>
          </div>

          <div v-if="changePassword" class="col-md-6">
            <label for="password" class="form-label"
              >Nueva Contraseña <span class="text-danger">*</span></label
            >
            <input
              v-model="form.password"
              type="password"
              class="form-control"
              id="password"
              placeholder="Nueva contraseña"
              :required="changePassword"
            />
            <small class="form-text text-muted"> Mínimo 8 caracteres </small>
          </div>

          <div v-if="changePassword" class="col-md-6">
            <label for="password_confirmation" class="form-label"
              >Confirmar Contraseña <span class="text-danger">*</span></label
            >
            <input
              v-model="form.password_confirmation"
              type="password"
              class="form-control"
              id="password_confirmation"
              placeholder="Confirme la nueva contraseña"
              :required="changePassword"
            />
          </div>

          <!-- Estado -->
          <div class="col-12 mt-5" v-permission="'users.toggle_status'">
            <h5 class="fw-bold text-primary">Estado</h5>
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
                Usuario Activo
              </label>
            </div>
          </div>

          <!-- Botones -->
          <div class="col-12 mt-5">
            <div class="d-flex justify-content-end gap-2">
              <router-link to="/users" class="btn btn-secondary">
                Cancelar
              </router-link>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <div
                  v-if="loading"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
                <i v-else class="bi bi-save me-1"></i>
                {{ loading ? "Guardando..." : "Guardar Cambios" }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Error state -->
    <div v-else class="alert alert-danger mt-5">
      <h4>Error</h4>
      <p>No se pudo cargar la información del usuario.</p>
      <router-link to="/users" class="btn btn-secondary">
        Volver a la lista
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import ApiService from "@/core/services/ApiService";

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
    roles.value = response.data.data || [];
  } catch (error) {
    console.error("Error loading roles:", error);
  }
};

const handleSubmit = async () => {
  if (!canEdit("users")) {
    alert("No tienes permisos para editar usuarios");
    return;
  }

  if (
    changePassword.value &&
    form.value.password !== form.value.password_confirmation
  ) {
    alert("Las contraseñas no coinciden");
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

    // Mostrar mensaje de éxito
    alert("Usuario actualizado exitosamente");

    // Redirigir a la lista de usuarios
    router.push("/users");
  } catch (error: any) {
    console.error("Error updating user:", error);

    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert("Error al actualizar el usuario. Por favor intente nuevamente.");
    }
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
