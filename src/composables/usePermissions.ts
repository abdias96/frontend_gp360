import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

export interface PermissionOptions {
  module?: string;
  action?: string;
  permissions?: string | string[];
  requireAll?: boolean;
}

export function usePermissions() {
  const authStore = useAuthStore();

  const can = (permission: string | PermissionOptions): boolean => {
    if (typeof permission === "string") {
      return authStore.hasPermission(permission);
    }

    const { module, action, permissions, requireAll = false } = permission;

    // Check module + action permission
    if (module && action) {
      return authStore.hasModulePermission(module, action);
    }

    // Check specific permissions
    if (permissions) {
      const permissionList = Array.isArray(permissions)
        ? permissions
        : [permissions];
      return requireAll
        ? authStore.hasAllPermissions(permissionList)
        : authStore.hasAnyPermission(permissionList);
    }

    return false;
  };

  const cannot = (permission: string | PermissionOptions): boolean => {
    return !can(permission);
  };

  const canAccess = (module: string): boolean => {
    return authStore.canAccess(module);
  };

  const canView = (module: string): boolean => {
    return authStore.hasModulePermission(module, "view");
  };

  const canCreate = (module: string): boolean => {
    return authStore.hasModulePermission(module, "create");
  };

  const canEdit = (module: string): boolean => {
    return authStore.hasModulePermission(module, "edit");
  };

  const canDelete = (module: string): boolean => {
    return authStore.hasModulePermission(module, "delete");
  };

  const canExport = (module: string): boolean => {
    return authStore.hasModulePermission(module, "export");
  };

  // Computed properties for common checks
  const isSuperAdmin = computed(() => authStore.isSuperAdmin);
  const isAdmin = computed(() => authStore.isAdmin);
  const userRole = computed(() => authStore.userRole);
  const userRoleSlug = computed(() => authStore.userRoleSlug);
  const permissions = computed(() => authStore.permissions);

  return {
    // Permission checking functions
    can,
    cannot,
    canAccess,
    canView,
    canCreate,
    canEdit,
    canDelete,
    canExport,

    // Computed properties
    isSuperAdmin,
    isAdmin,
    userRole,
    userRoleSlug,
    permissions,

    // Direct access to auth store functions
    hasPermission: authStore.hasPermission,
    hasAnyPermission: authStore.hasAnyPermission,
    hasAllPermissions: authStore.hasAllPermissions,
    hasModulePermission: authStore.hasModulePermission,
  };
}
