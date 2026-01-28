<template>
  <div class="container-fluid">
    <!-- Título principal con permiso para ver -->
    <div v-permission="'users.view'" class="d-flex flex-column">
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        Gestión de Usuarios
      </h1>
    </div>

    <!-- Botones de acción con diferentes permisos -->
    <div class="card mt-5">
      <div class="card-header">
        <h3 class="card-title">Acciones Disponibles</h3>
        <div class="card-toolbar">
          <!-- Botón crear - solo visible si tiene permiso de crear -->
          <PermissionButton
            v-permission="'users.create'"
            permissions="users.create"
            variant="primary"
            icon="bi-plus"
            text="Crear Usuario"
            @click="createUser"
          />

          <!-- Botón exportar - solo visible para admins o con permiso específico -->
          <button
            v-permission="['users.export', 'reports.export']"
            class="btn btn-success ms-2"
            @click="exportUsers"
          >
            <i class="bi-download me-1"></i>
            Exportar
          </button>

          <!-- Botón de configuración - solo para super admin -->
          <button
            v-super-admin
            class="btn btn-warning ms-2"
            @click="openSettings"
          >
            <i class="bi-gear me-1"></i>
            Configuración
          </button>
        </div>
      </div>

      <div class="card-body">
        <!-- Tabla de usuarios -->
        <div class="table-responsive">
          <table class="table table-row-dashed table-row-gray-300 gy-7">
            <thead>
              <tr class="fw-semibold fs-6 text-gray-800">
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th v-permission="['users.edit', 'users.delete']">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td v-permission="['users.edit', 'users.delete']">
                  <!-- Botón editar - visible solo con permiso de editar -->
                  <button
                    v-can-edit="'users'"
                    class="btn btn-sm btn-primary me-2"
                    @click="editUser(user)"
                  >
                    <i class="bi-pencil"></i>
                  </button>

                  <!-- Botón eliminar - visible solo con permiso de eliminar -->
                  <button
                    v-can-delete="'users'"
                    class="btn btn-sm btn-danger"
                    @click="deleteUser(user)"
                  >
                    <i class="bi-trash"></i>
                  </button>

                  <!-- Botón ver detalles - siempre visible si puede ver la lista -->
                  <button
                    v-permission="'users.view'"
                    class="btn btn-sm btn-info ms-2"
                    @click="viewUser(user)"
                  >
                    <i class="bi-eye"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Sección solo para administradores -->
        <div v-admin class="mt-5 border-top pt-5">
          <h4>Panel de Administración</h4>
          <p>Esta sección solo es visible para administradores.</p>

          <!-- Botones específicos de admin -->
          <button
            v-permission="'users.manage_roles'"
            class="btn btn-outline-primary me-2"
          >
            Gestionar Roles
          </button>

          <button
            v-permission="'system.backup'"
            class="btn btn-outline-warning"
          >
            Crear Backup
          </button>
        </div>

        <!-- Campo que se oculta si no tiene permisos -->
        <div v-permission.hide="'users.view_sensitive'" class="mt-5">
          <h4>Información Sensible</h4>
          <p>
            Esta información solo es visible para usuarios con permisos
            especiales.
          </p>
        </div>

        <!-- Campo que se deshabilita si no tiene permisos -->
        <div class="mt-5">
          <label class="form-label">Campo especial</label>
          <input
            v-permission.disable="'users.edit_special'"
            type="text"
            class="form-control"
            placeholder="Solo editable con permisos especiales"
          />
        </div>
      </div>
    </div>

    <!-- Información de permisos del usuario actual (solo para desarrollo) -->
    <div v-if="isDevelopment" class="card mt-5">
      <div class="card-header">
        <h3 class="card-title">Debug: Información de Permisos</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <h5>Usuario Actual:</h5>
            <p><strong>Nombre:</strong> {{ userName }}</p>
            <p><strong>Rol:</strong> {{ userRole }}</p>
            <p>
              <strong>Es Super Admin:</strong> {{ isSuperAdmin ? "Sí" : "No" }}
            </p>
            <p><strong>Es Admin:</strong> {{ isAdmin ? "Sí" : "No" }}</p>
          </div>
          <div class="col-md-6">
            <h5>Permisos:</h5>
            <div class="max-h-300px overflow-auto">
              <div
                v-for="permission in permissions"
                :key="permission.id"
                class="badge badge-light me-1 mb-1"
              >
                {{ permission.slug }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { usePermissions } from "@/composables/usePermissions";
import { useAuthStore } from "@/stores/auth";
import PermissionButton from "@/components/common/PermissionButton.vue";

// Mock data para el ejemplo
const users = ref([
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan@example.com",
    role: "Administrador",
  },
  { id: 2, name: "María García", email: "maria@example.com", role: "Usuario" },
  {
    id: 3,
    name: "Carlos López",
    email: "carlos@example.com",
    role: "Operador",
  },
]);

// Composables
const {
  can,
  canCreate,
  canEdit,
  canDelete,
  isSuperAdmin,
  isAdmin,
  userRole,
  permissions,
} = usePermissions();

const authStore = useAuthStore();

// Computed properties
const userName = computed(() => authStore.userName);
const isDevelopment = computed(() => import.meta.env.DEV);

// Methods
const createUser = () => {
  if (canCreate("users")) {
    // Lógica para crear usuario
  }
};

const editUser = (user: any) => {
  if (canEdit("users")) {
    // Lógica para editar usuario
  }
};

const deleteUser = (user: any) => {
  if (canDelete("users")) {
    // Lógica para eliminar usuario
  }
};

const viewUser = (user: any) => {
  // Lógica para ver detalles del usuario
};

const exportUsers = () => {
  if (can("users.export") || can("reports.export")) {
    // Lógica para exportar
  }
};

const openSettings = () => {
  if (isSuperAdmin.value) {
    // Lógica para abrir configuración
  }
};

// Ejemplo de uso programático de permisos
const checkPermissions = () => {
  // Check if user has any of these permissions
  can({ permissions: ["users.edit", "users.delete"] });
  // Check if user has all of these permissions
  can({ permissions: ["users.edit", "users.delete"], requireAll: true });
};

// Ejecutar verificación al montar el componente
checkPermissions();
</script>

<style scoped>
.max-h-300px {
  max-height: 300px;
}
</style>
