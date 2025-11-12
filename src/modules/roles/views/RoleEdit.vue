<template>
  <div class="container-fluid">
    <!-- Título -->
    <div class="d-flex flex-column">
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        Editar Rol
      </h1>
    </div>

    <!-- Loading state -->
    <div v-if="loadingRole" class="d-flex justify-content-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Formulario -->
    <div v-else-if="role" class="card mt-5">
      <div class="card-header">
        <h3 class="card-title">Información del Rol</h3>
        <div class="card-toolbar">
          <router-link to="/roles" class="btn btn-secondary me-2">
            <i class="bi bi-arrow-left me-1"></i>
            Volver
          </router-link>
        </div>
      </div>

      <div class="card-body">
        <form @submit.prevent="handleSubmit" class="row g-3">
          <!-- Información Básica -->
          <div class="col-12">
            <h5 class="fw-bold text-primary">Información Básica</h5>
            <hr />
          </div>

          <div class="col-md-6">
            <label for="name" class="form-label"
              >Nombre <span class="text-danger">*</span></label
            >
            <input
              v-model="form.name"
              type="text"
              class="form-control"
              id="name"
              placeholder="Nombre del rol"
              required
              @input="generateSlug"
            />
          </div>

          <div class="col-md-6">
            <label for="slug" class="form-label"
              >Slug <span class="text-danger">*</span></label
            >
            <input
              v-model="form.slug"
              type="text"
              class="form-control"
              id="slug"
              placeholder="slug-del-rol"
              required
              pattern="[a-z0-9_-]+"
              title="Solo letras minúsculas, números, guiones y guiones bajos"
              :disabled="form.slug === 'super_admin'"
            />
            <small class="form-text text-muted">
              Identificador único del rol (solo letras minúsculas, números, - y
              _)
            </small>
            <small v-if="form.slug === 'super_admin'" class="form-text text-warning d-block">
              <i class="bi bi-exclamation-triangle me-1"></i>
              El slug del Super Administrador no puede ser modificado
            </small>
          </div>

          <div class="col-12">
            <label for="description" class="form-label">Descripción</label>
            <textarea
              v-model="form.description"
              class="form-control"
              id="description"
              rows="3"
              placeholder="Descripción del rol y sus responsabilidades"
            ></textarea>
          </div>

          <!-- Estado -->
          <div class="col-12 mt-4">
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
                :disabled="form.slug === 'super_admin'"
              />
              <label class="form-check-label" for="active"> Rol Activo </label>
            </div>
            <small v-if="form.slug === 'super_admin'" class="form-text text-warning">
              <i class="bi bi-exclamation-triangle me-1"></i>
              El Super Administrador siempre debe estar activo
            </small>
          </div>

          <!-- Permisos -->
          <div class="col-12 mt-4">
            <h5 class="fw-bold text-primary">Permisos</h5>
            <hr />
            <p class="text-muted">
              Seleccione los permisos que tendrá este rol:
            </p>
          </div>

          <!-- Loading permisos -->
          <div v-if="loadingPermissions" class="col-12 text-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Cargando permisos...</span>
            </div>
          </div>

          <!-- Permisos por módulo -->
          <div v-else class="col-12">
            <div class="row">
              <div
                class="col-md-6 mb-4"
                v-for="module in permissionsByModule"
                :key="module.name"
              >
                <div class="card">
                  <div class="card-header py-2">
                    <h6 class="card-title fw-bold text-primary mb-0">
                      {{ module.name }}
                      <span class="badge badge-secondary ms-2">{{
                        module.permissions.length
                      }}</span>
                    </h6>
                    <div class="card-toolbar">
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-primary"
                        @click="toggleModulePermissions(module)"
                      >
                        {{
                          isModuleSelected(module)
                            ? "Desmarcar Todo"
                            : "Marcar Todo"
                        }}
                      </button>
                    </div>
                  </div>
                  <div class="card-body py-2">
                    <div
                      class="form-check"
                      v-for="permission in module.permissions"
                      :key="permission.id"
                    >
                      <input
                        v-model="form.permission_ids"
                        :value="permission.id"
                        class="form-check-input"
                        type="checkbox"
                        :id="`permission-${permission.id}`"
                      />
                      <label
                        class="form-check-label"
                        :for="`permission-${permission.id}`"
                      >
                        <strong>{{ permission.name }}</strong>
                        <small class="text-muted d-block">{{
                          permission.description
                        }}</small>
                        <span class="badge badge-light">{{
                          permission.slug
                        }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Botones -->
          <div class="col-12 mt-5">
            <div class="d-flex justify-content-between">
              <div>
                <span class="text-muted">
                  Permisos seleccionados: {{ form.permission_ids.length }}
                </span>
              </div>
              <div class="d-flex gap-2">
                <router-link to="/roles" class="btn btn-secondary">
                  Cancelar
                </router-link>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="loading"
                >
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
          </div>
        </form>
      </div>
    </div>

    <!-- Error state -->
    <div v-else class="alert alert-danger mt-5">
      <h4>Error</h4>
      <p>No se pudo cargar la información del rol.</p>
      <router-link to="/roles" class="btn btn-secondary">
        Volver a la lista
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";

// Composables
const router = useRouter();
const route = useRoute();
const { canEdit } = usePermissions();

// Reactive data
const loading = ref(false);
const loadingRole = ref(true);
const loadingPermissions = ref(false);
const role = ref(null);
const permissions = ref([]);

const form = ref({
  name: "",
  slug: "",
  description: "",
  active: true,
  permission_ids: [],
});

// Computed
const permissionsByModule = computed(() => {
  const modules = {};
  permissions.value.forEach((permission) => {
    if (!modules[permission.module]) {
      modules[permission.module] = {
        name:
          permission.module.charAt(0).toUpperCase() +
          permission.module.slice(1),
        permissions: [],
      };
    }
    modules[permission.module].permissions.push(permission);
  });
  return Object.values(modules);
});

// Methods
const generateSlug = () => {
  // Don't generate slug for super_admin
  if (form.value.slug === 'super_admin') {
    return;
  }

  if (form.value.name) {
    form.value.slug = form.value.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .trim();
  }
};

const loadRole = async () => {
  const roleId = route.params.id;

  if (!roleId) {
    router.push("/roles");
    return;
  }

  try {
    loadingRole.value = true;
    const response = await ApiService.get(`roles/${roleId}`);
    role.value = response.data.data;

    // Populate form
    const roleData = role.value;
    form.value = {
      name: roleData.name || "",
      slug: roleData.slug || "",
      description: roleData.description || "",
      active: roleData.active ?? true,
      permission_ids: roleData.permissions ? roleData.permissions.map(p => p.id) : [],
    };
  } catch (error) {
    console.error("Error loading role:", error);
    role.value = null;
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar la información del rol'
    });
  } finally {
    loadingRole.value = false;
  }
};

const loadPermissions = async () => {
  try {
    loadingPermissions.value = true;
    // Use grouped format and include inactive permissions for role management
    const response = await ApiService.get("permissions?grouped=true&include_inactive=true");

    const data = response.data?.data;
    const flatPermissions = [];

    if (Array.isArray(data)) {
      // Grouped format returns array of modules
      data.forEach((moduleGroup) => {
        if (moduleGroup.permissions && Array.isArray(moduleGroup.permissions)) {
          flatPermissions.push(...moduleGroup.permissions);
        }
      });
    } else if (data && typeof data === "object") {
      // Alternative grouped format as object
      for (const module in data) {
        if (Array.isArray(data[module])) {
          flatPermissions.push(...data[module]);
        }
      }
    }

    permissions.value = flatPermissions;
    console.log("Loaded permissions for edit:", permissions.value.length);
  } catch (error) {
    console.error("Error loading permissions:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los permisos'
    });
  } finally {
    loadingPermissions.value = false;
  }
};

const isModuleSelected = (module) => {
  return module.permissions.every((permission) =>
    form.value.permission_ids.includes(permission.id),
  );
};

const toggleModulePermissions = (module) => {
  const modulePermissionIds = module.permissions.map((p) => p.id);

  if (isModuleSelected(module)) {
    // Remove all module permissions
    form.value.permission_ids = form.value.permission_ids.filter(
      (id) => !modulePermissionIds.includes(id),
    );
  } else {
    // Add all module permissions
    const newPermissions = modulePermissionIds.filter(
      (id) => !form.value.permission_ids.includes(id),
    );
    form.value.permission_ids.push(...newPermissions);
  }
};

const handleSubmit = async () => {
  if (!canEdit("roles")) {
    Swal.fire({
      icon: 'error',
      title: 'Acceso Denegado',
      text: 'No tienes permisos para editar roles'
    });
    return;
  }

  if (!form.value.name.trim()) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'El nombre del rol es obligatorio'
    });
    return;
  }

  if (!form.value.slug.trim()) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'El slug del rol es obligatorio'
    });
    return;
  }

  loading.value = true;

  try {
    const roleId = route.params.id;

    // Update role basic info
    await ApiService.put(`roles/${roleId}`, {
      name: form.value.name,
      slug: form.value.slug,
      description: form.value.description,
      active: form.value.active,
    });

    // Update permissions
    await ApiService.put(`permissions/by-role/${roleId}`, {
      permission_ids: form.value.permission_ids,
    });

    await Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Rol actualizado exitosamente',
      timer: 2000,
      showConfirmButton: false
    });

    router.push("/roles");
  } catch (error: any) {
    console.error("Error updating role:", error);

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Error al actualizar el rol. Por favor intente nuevamente.'
    });
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  await Promise.all([loadRole(), loadPermissions()]);
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

.text-warning {
  color: #ffc107 !important;
}

hr {
  margin: 0.5rem 0 1rem 0;
}

.badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

.badge-secondary {
  background-color: #6c757d;
  color: white;
}

.badge-light {
  background-color: #f8f9fa;
  color: #6c757d;
}

.form-check {
  margin-bottom: 0.75rem;
}

.form-check-label {
  margin-left: 0.25rem;
}

.form-check-label small {
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-toolbar {
  margin-left: auto;
}
</style>
