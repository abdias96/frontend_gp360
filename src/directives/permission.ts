import type { Directive } from "vue";
import { useAuthStore } from "@/stores/auth";

function checkPermissionAndToggleElement(
  el: HTMLElement,
  permission: string | string[],
  requireAll = false,
) {
  try {
    const authStore = useAuthStore();
    let hasPermission = false;

    if (Array.isArray(permission)) {
      hasPermission = requireAll
        ? authStore.hasAllPermissions(permission)
        : authStore.hasAnyPermission(permission);
    } else {
      hasPermission = authStore.hasPermission(permission);
    }

    if (hasPermission) {
      el.style.display = "";
      el.style.visibility = "visible";
    } else {
      el.style.display = "none";
    }
  } catch (error) {
    console.warn("Permission directive error:", error);
    el.style.display = "none";
  }
}

export const vPermission: Directive = {
  mounted(el: HTMLElement, binding: any) {
    if (binding.value) {
      checkPermissionAndToggleElement(
        el,
        binding.value,
        binding.modifiers?.all,
      );
    } else {
      el.style.display = "none";
    }
  },
  updated(el: HTMLElement, binding: any) {
    if (binding.value) {
      checkPermissionAndToggleElement(
        el,
        binding.value,
        binding.modifiers?.all,
      );
    } else {
      el.style.display = "none";
    }
  },
};

export const vCanView: Directive = {
  mounted(el: HTMLElement, binding: any) {
    const module = binding.value || binding.arg;
    if (module) {
      checkPermissionAndToggleElement(el, `${module}.view`);
    }
  },
  updated(el: HTMLElement, binding: any) {
    const module = binding.value || binding.arg;
    if (module) {
      checkPermissionAndToggleElement(el, `${module}.view`);
    }
  },
};

export const vCanCreate: Directive = {
  mounted(el: HTMLElement, binding: any) {
    const module = binding.value || binding.arg;
    if (module) {
      checkPermissionAndToggleElement(el, `${module}.create`);
    }
  },
  updated(el: HTMLElement, binding: any) {
    const module = binding.value || binding.arg;
    if (module) {
      checkPermissionAndToggleElement(el, `${module}.create`);
    }
  },
};

export const vCanEdit: Directive = {
  mounted(el: HTMLElement, binding: any) {
    const module = binding.value || binding.arg;
    if (module) {
      checkPermissionAndToggleElement(el, `${module}.edit`);
    }
  },
  updated(el: HTMLElement, binding: any) {
    const module = binding.value || binding.arg;
    if (module) {
      checkPermissionAndToggleElement(el, `${module}.edit`);
    }
  },
};

export const vCanDelete: Directive = {
  mounted(el: HTMLElement, binding: any) {
    const module = binding.value || binding.arg;
    if (module) {
      checkPermissionAndToggleElement(el, `${module}.delete`);
    }
  },
  updated(el: HTMLElement, binding: any) {
    const module = binding.value || binding.arg;
    if (module) {
      checkPermissionAndToggleElement(el, `${module}.delete`);
    }
  },
};

export const vRole: Directive = {
  mounted(el: HTMLElement, binding: any) {
    try {
      const authStore = useAuthStore();
      const requiredRole = binding.value;
      const userRole = authStore.userRoleSlug;

      if (
        requiredRole &&
        userRole.toLowerCase() === requiredRole.toLowerCase()
      ) {
        el.style.display = "";
      } else {
        el.style.display = "none";
      }
    } catch (error) {
      console.warn("Role directive error:", error);
      el.style.display = "none";
    }
  },
  updated(el: HTMLElement, binding: any) {
    try {
      const authStore = useAuthStore();
      const requiredRole = binding.value;
      const userRole = authStore.userRoleSlug;

      if (
        requiredRole &&
        userRole.toLowerCase() === requiredRole.toLowerCase()
      ) {
        el.style.display = "";
      } else {
        el.style.display = "none";
      }
    } catch (error) {
      console.warn("Role directive error:", error);
      el.style.display = "none";
    }
  },
};

export const vSuperAdmin: Directive = {
  mounted(el: HTMLElement) {
    try {
      const authStore = useAuthStore();
      if (authStore.isSuperAdmin) {
        el.style.display = "";
      } else {
        el.style.display = "none";
      }
    } catch (error) {
      console.warn("SuperAdmin directive error:", error);
      el.style.display = "none";
    }
  },
  updated(el: HTMLElement) {
    try {
      const authStore = useAuthStore();
      if (authStore.isSuperAdmin) {
        el.style.display = "";
      } else {
        el.style.display = "none";
      }
    } catch (error) {
      console.warn("SuperAdmin directive error:", error);
      el.style.display = "none";
    }
  },
};

export const vAdmin: Directive = {
  mounted(el: HTMLElement) {
    try {
      const authStore = useAuthStore();
      const userRole = authStore.userRoleSlug.toLowerCase();
      if (userRole === "admin" || userRole === "super_admin") {
        el.style.display = "";
      } else {
        el.style.display = "none";
      }
    } catch (error) {
      console.warn("Admin directive error:", error);
      el.style.display = "none";
    }
  },
  updated(el: HTMLElement) {
    try {
      const authStore = useAuthStore();
      const userRole = authStore.userRoleSlug.toLowerCase();
      if (userRole === "admin" || userRole === "super_admin") {
        el.style.display = "";
      } else {
        el.style.display = "none";
      }
    } catch (error) {
      console.warn("Admin directive error:", error);
      el.style.display = "none";
    }
  },
};
