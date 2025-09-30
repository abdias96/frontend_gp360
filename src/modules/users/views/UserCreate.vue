<template>
  <div class="container-fluid">
    <!-- Título -->
    <div class="d-flex flex-column">
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        Crear Usuario
      </h1>
    </div>

    <!-- Formulario -->
    <div class="card mt-5">
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

          <div class="col-md-6">
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
              <option v-for="role in roles" :key="role?.id || 'role-' + roles.indexOf(role)" :value="role?.id">
                {{ role?.name || 'Sin nombre' }}
              </option>
            </select>
          </div>

          <div class="col-md-6">
            <label for="password" class="form-label"
              >Contraseña <span class="text-danger">*</span></label
            >
            <input
              v-model="form.password"
              type="password"
              class="form-control"
              id="password"
              placeholder="Contraseña"
              required
            />
            <small class="form-text text-muted"> Mínimo 8 caracteres </small>
          </div>

          <div class="col-md-6">
            <label for="password_confirmation" class="form-label"
              >Confirmar Contraseña <span class="text-danger">*</span></label
            >
            <input
              v-model="form.password_confirmation"
              type="password"
              class="form-control"
              id="password_confirmation"
              placeholder="Confirme la contraseña"
              required
            />
          </div>

          <!-- Estado -->
          <div class="col-12 mt-5">
            <h5 class="fw-bold text-primary">Estado</h5>
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
                {{ loading ? "Creando..." : "Crear Usuario" }}
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
import { usePermissions } from "@/composables/usePermissions";
import ApiService from "@/core/services/ApiService";

// Composables
const router = useRouter();
const { canCreate } = usePermissions();

// Reactive data
const loading = ref(false);
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
    alert("No tienes permisos para crear usuarios");
    return;
  }

  if (form.value.password !== form.value.password_confirmation) {
    alert("Las contraseñas no coinciden");
    return;
  }

  loading.value = true;

  try {
    await ApiService.post("users", form.value);

    // Mostrar mensaje de éxito
    alert("Usuario creado exitosamente");

    // Redirigir a la lista de usuarios
    router.push("/users");
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert("Error al crear el usuario. Por favor intente nuevamente.");
    }
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
</style>
