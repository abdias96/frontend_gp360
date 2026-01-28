<template>
  <div class="container-fluid">
    <!-- Título -->
    <div class="d-flex flex-column">
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        {{ $t('roles.list.title') }}
      </h1>
    </div>

    <!-- Tarjeta principal -->
    <div class="card mt-5">
      <div class="card-header">
        <h3 class="card-title">{{ $t('roles.list.subtitle') }}</h3>
        <div class="card-toolbar">
          <router-link
            v-permission="'roles.create'"
            to="/roles/create"
            class="btn btn-primary"
          >
            <i class="bi bi-plus me-1"></i>
            {{ $t('roles.list.createRole') }}
          </router-link>
        </div>
      </div>

      <div class="card-body">
        <!-- Loading state -->
        <div v-if="loading" class="d-flex justify-content-center my-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">{{ $t('roles.list.loading') }}</span>
          </div>
        </div>

        <!-- Tabla de roles -->
        <div v-else class="table-responsive">
          <table class="table table-row-dashed table-row-gray-300 gy-7">
            <thead>
              <tr class="fw-semibold fs-6 text-gray-800">
                <th>{{ $t('roles.list.table.name') }}</th>
                <th>{{ $t('roles.list.table.slug') }}</th>
                <th>{{ $t('roles.list.table.description') }}</th>
                <th>{{ $t('roles.list.table.status') }}</th>
                <th>{{ $t('roles.list.table.permissions') }}</th>
                <th v-permission="['roles.edit', 'roles.delete']">{{ $t('roles.list.table.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="role in filteredRoles" :key="role.id">
                <td class="fw-bold">{{ role.name }}</td>
                <td>
                  <span class="badge badge-light">{{ role.slug }}</span>
                </td>
                <td>{{ role.description || $t('roles.list.noDescription') }}</td>
                <td>
                  <span
                    :class="{
                      'badge badge-success': role.active,
                      'badge badge-danger': !role.active,
                    }"
                  >
                    {{ role.active ? $t('roles.status.active') : $t('roles.status.inactive') }}
                  </span>
                </td>
                <td>
                  <span class="badge badge-primary">
                    {{ $t('roles.list.permissionsCount', { count: role.permissions_count || 0 }) }}
                  </span>
                </td>
                <td v-permission="['roles.edit', 'roles.delete']">
                  <div class="btn-group" role="group">
                    <button
                      v-permission="'roles.manage_permissions'"
                      @click="managePermissions(role)"
                      class="btn btn-sm btn-info"
                      title="Gestionar Permisos"
                    >
                      <i class="bi bi-shield-check"></i>
                    </button>
                    <button
                      v-can-edit="'roles'"
                      @click="editRole(role)"
                      class="btn btn-sm btn-primary"
                      title="Editar"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      v-can-delete="'roles'"
                      @click="deleteRole(role)"
                      class="btn btn-sm btn-danger"
                      title="Eliminar"
                      :disabled="role.slug === 'super_admin'"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty state -->
          <div
            v-if="!loading && filteredRoles.length === 0"
            class="text-center py-5"
          >
            <i class="bi bi-shield-x display-4 text-muted"></i>
            <h4 class="mt-3">{{ $t('roles.list.noRolesAvailable') }}</h4>
            <p class="text-muted">{{ $t('roles.list.noRolesHint') }}</p>
            <router-link
              v-permission="'roles.create'"
              to="/roles/create"
              class="btn btn-primary"
            >
              <i class="bi bi-plus me-1"></i>
              {{ $t('roles.list.createFirstRole') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para gestionar permisos -->
    <div
      v-if="selectedRole"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t('roles.list.permissionsForRole', { name: selectedRole.name }) }}</h5>
            <button
              type="button"
              class="btn-close"
              @click="selectedRole = null"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="loadingPermissions" class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">{{ $t('roles.list.loadingPermissions') }}</span>
              </div>
            </div>
            <div v-else-if="permissionsByModule.length === 0" class="alert alert-warning">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ $t('roles.list.noPermissionsFound') }}
            </div>
            <div v-else>
              <div class="alert alert-info mb-3">
                <i class="bi bi-info-circle me-2"></i>
                <strong>{{ $t('roles.list.selectedPermissions') }}</strong> {{ selectedPermissions.length }} de {{ permissions.length }}
              </div>
              <div class="row">
                <div
                  class="col-md-6"
                  v-for="module in permissionsByModule"
                  :key="module.name"
                >
                  <h6 class="fw-bold text-primary">{{ module.name }}</h6>
                  <div
                    class="form-check"
                    v-for="permission in module.permissions"
                    :key="permission.id"
                  >
                    <input
                      v-model="selectedPermissions"
                      :value="permission.id"
                      class="form-check-input"
                      type="checkbox"
                      :id="`permission-${permission.id}`"
                    />
                    <label
                      class="form-check-label"
                      :for="`permission-${permission.id}`"
                    >
                      {{ permission.name }}
                      <small class="text-muted d-block">{{
                        permission.description
                      }}</small>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="selectedRole = null"
            >
              {{ $t('roles.form.buttons.cancel') }}
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="savePermissions"
              :disabled="savingPermissions"
            >
              <div
                v-if="savingPermissions"
                class="spinner-border spinner-border-sm me-2"
                role="status"
              >
                <span class="visually-hidden">{{ $t('roles.form.buttons.saving') }}</span>
              </div>
              {{ savingPermissions ? $t('roles.form.buttons.saving') : $t('roles.form.buttons.savePermissions') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { usePermissions } from "@/composables/usePermissions";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";

const { t } = useI18n();

// Composables
const router = useRouter();
const { canEdit, canDelete } = usePermissions();

// Reactive data
const loading = ref(false);
const loadingPermissions = ref(false);
const savingPermissions = ref(false);
const roles = ref<any[]>([]);
const permissions = ref<any[]>([]);
const selectedRole = ref(null);
const selectedPermissions = ref([]);

// Computed
const filteredRoles = computed(() => {
  // Ensure roles.value is an array before filtering
  if (!Array.isArray(roles.value)) {
    return [];
  }
  return roles.value.filter((role) => role && role.id);
});

const permissionsByModule = computed(() => {
  const modules = {};

  // Ensure permissions.value is an array and has valid items
  if (!Array.isArray(permissions.value)) {
    console.warn("permissions.value is not an array:", permissions.value);
    return [];
  }

  if (permissions.value.length === 0) {
    console.warn("permissions.value is empty");
    return [];
  }

  permissions.value.forEach((permission) => {
    // Ensure permission has required properties
    if (!permission || !permission.module) {
      console.warn("Permission without module:", permission);
      return;
    }

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

  const result = Object.values(modules);
  return result;
});

// Methods
const loadRoles = async () => {
  try {
    loading.value = true;
    const response = await ApiService.get("roles");

    // Try different possible data structures
    let data = null;

    // First try: response.data.data (Laravel API resource format)
    if (response.data?.data) {
      data = response.data.data;
    }
    // Second try: response.data (direct format)
    else if (response.data) {
      data = response.data;
    }

    // Ensure we always get an array
    if (Array.isArray(data)) {
      roles.value = data;
    } else if (data && typeof data === "object") {
      // If data is an object, try to extract array from common property names
      roles.value = data.roles || data.items || data.data || [];
    } else {
      roles.value = [];
    }
  } catch (error: any) {
    console.error("Error loading roles:", error);
    roles.value = [];
    Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.error'),
      text: t('roles.swal.loadError')
    });
  } finally {
    loading.value = false;
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
  } catch (error: any) {
    console.error("Error loading permissions:", error);
    permissions.value = [];
    Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.error'),
      text: error.response?.data?.message || t('roles.swal.permissionsLoadError')
    });
  } finally {
    loadingPermissions.value = false;
  }
};

const loadRolePermissions = async (roleId) => {
  try {
    // Use the correct endpoint: GET /permissions/by-role/{id}
    const response = await ApiService.get(`permissions/by-role/${roleId}`);
    const data = response.data?.data;

    if (data && data.modules) {
      // Extract permission IDs where assigned is true
      const assignedIds = [];
      data.modules.forEach((module) => {
        module.permissions.forEach((permission) => {
          if (permission.assigned) {
            assignedIds.push(permission.id);
          }
        });
      });
      selectedPermissions.value = assignedIds;
    } else if (Array.isArray(data)) {
      // Fallback: if data is array of permissions
      selectedPermissions.value = data
        .map((p) => p?.id)
        .filter((id) => id !== undefined);
    } else {
      selectedPermissions.value = [];
      console.warn("No permissions data found:", data);
    }
  } catch (error: any) {
    console.error("Error loading role permissions:", error);
    selectedPermissions.value = [];
    Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.error'),
      text: error.response?.data?.message || t('roles.swal.rolePermissionsLoadError')
    });
  }
};

const managePermissions = async (role) => {
  selectedRole.value = role;
  selectedPermissions.value = [];

  if (permissions.value.length === 0) {
    await loadPermissions();
  } else {
  }

  await loadRolePermissions(role.id);
};

const savePermissions = async () => {
  if (!selectedRole.value) return;

  try {
    savingPermissions.value = true;

    // Use the correct endpoint: PUT /permissions/by-role/{id}
    await ApiService.put(`permissions/by-role/${selectedRole.value.id}`, {
      permission_ids: selectedPermissions.value,
    });

    await Swal.fire({
      icon: 'success',
      title: t('common.swal.titles.success'),
      text: t('roles.swal.permissionsUpdateSuccess'),
      timer: 2000,
      showConfirmButton: false
    });

    selectedRole.value = null;
    await loadRoles();
  } catch (error: any) {
    console.error("Error saving permissions:", error);
    Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.error'),
      text: error.response?.data?.message || t('roles.swal.permissionsSaveError')
    });
  } finally {
    savingPermissions.value = false;
  }
};

const editRole = (role) => {
  if (!canEdit("roles")) {
    Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.accessDenied'),
      text: t('roles.swal.noPermissionEdit')
    });
    return;
  }

  router.push(`/roles/${role.id}/edit`);
};

const deleteRole = async (role) => {
  if (!canDelete("roles")) {
    Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.accessDenied'),
      text: t('roles.swal.noPermissionDelete')
    });
    return;
  }

  if (role.slug === "super_admin") {
    Swal.fire({
      icon: 'warning',
      title: t('common.swal.titles.warning'),
      text: t('roles.swal.cannotDeleteSuperAdmin')
    });
    return;
  }

  const result = await Swal.fire({
    title: t('roles.swal.deleteConfirmTitle'),
    text: t('roles.swal.deleteConfirmText', { name: role.name }),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: t('common.swal.buttons.yesDelete'),
    cancelButtonText: t('common.swal.buttons.cancel')
  });

  if (!result.isConfirmed) {
    return;
  }

  try {
    await ApiService.delete(`roles/${role.id}`);

    await Swal.fire({
      icon: 'success',
      title: t('common.swal.titles.success'),
      text: t('roles.swal.deleteSuccess'),
      timer: 2000,
      showConfirmButton: false
    });

    await loadRoles();
  } catch (error: any) {
    console.error("Error deleting role:", error);
    Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.error'),
      text: error.response?.data?.message || t('roles.swal.deleteError')
    });
  }
};

// Lifecycle
onMounted(() => {
  loadRoles();
});
</script>

<style scoped>
.badge {
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
}

.badge-light {
  background-color: #f8f9fa;
  color: #6c757d;
}

.badge-success {
  background-color: #198754;
  color: white;
}

.badge-danger {
  background-color: #dc3545;
  color: white;
}

.badge-primary {
  background-color: #0d6efd;
  color: white;
}

.btn-group .btn {
  margin-right: 0.25rem;
}

.btn-group .btn:last-child {
  margin-right: 0;
}

.modal {
  backdrop-filter: blur(3px);
}

.form-check {
  margin-bottom: 0.5rem;
}

.form-check-label small {
  font-size: 0.75rem;
}
</style>
