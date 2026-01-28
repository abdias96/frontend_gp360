import { ref, computed } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
import { webSocketService } from "@/services/WebSocketService";

export interface Permission {
  id: number;
  name: string;
  slug: string;
  module: string;
  action: string;
  description?: string;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  description?: string;
  permissions?: Permission[];
}

export interface User {
  id?: number;
  dpi?: string;
  primer_nombre?: string;
  segundo_nombre?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  username: string;
  email: string;
  password?: string;
  name?: string;
  full_name?: string;
  tipo_usuario?: string;
  role?: Role;
  role_id?: number;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  second_last_name?: string;
  phone?: string;
  profile_photo?: string;
  active?: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
  permissions?: Permission[];
  all_permissions?: Permission[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends User {
  password_confirmation?: string;
  toc?: boolean;
}

export interface AuthResponse {
  data: {
    user: User;
    token: string;
    permissions?: Permission[];
  };
  message?: string;
}

export interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref<Record<string, any>>({});
  const user = ref<User>({} as User);
  const isAuthenticated = ref(!!JwtService.getToken());
  const loading = ref(false);
  const permissions = ref<Permission[]>([]);
  const verifyingAuth = ref(false);

  // Computed properties
  const hasErrors = computed(() => Object.keys(errors.value).length > 0);
  const userName = computed(
    () =>
      user.value?.name || user.value?.full_name || user.value?.username || "",
  );
  const userRole = computed(
    () => user.value?.role?.name || user.value?.tipo_usuario || "",
  );
  const userRoleSlug = computed(() => user.value?.role?.slug || "");
  const userRoleObject = computed(() => user.value?.role || null);
  const isSuperAdmin = computed(() => userRoleSlug.value === "super_admin");
  const isAdmin = computed(
    () => userRoleSlug.value === "admin" || isSuperAdmin.value,
  );
  const token = computed(() => JwtService.getToken());

  function setAuth(authResponse: AuthResponse) {
    isAuthenticated.value = true;
    user.value = authResponse.data.user;
    errors.value = {};
    JwtService.saveToken(authResponse.data.token);
    ApiService.setHeader(); // Set Authorization header immediately

    // Set permissions from user object or response
    if (authResponse.data.user.all_permissions) {
      permissions.value = authResponse.data.user.all_permissions;
    } else if (authResponse.data.permissions) {
      permissions.value = authResponse.data.permissions;
    } else {
      permissions.value = [];
    }

    // Connect WebSocket after successful authentication
    setTimeout(() => {
      webSocketService.connect();
    }, 500);
  }

  function setError(error: ApiError) {
    errors.value = { ...error };
  }

  function clearErrors() {
    errors.value = {};
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    user.value = {} as User;
    errors.value = {};
    loading.value = false;
    verifyingAuth.value = false;
    permissions.value = [];
    JwtService.destroyToken();
    ApiService.removeHeader();
    
    // Disconnect WebSocket on logout
    webSocketService.disconnect();
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    loading.value = true;
    clearErrors();

    try {
      const { data } = await ApiService.post("login", credentials);
      setAuth(data);
    } catch (error: any) {
      const response = error.response;

      // Handle different error scenarios
      if (response?.status === 401) {
        // Unauthorized - invalid credentials
        setError({
          message:
            response.data?.message ||
            "Credenciales inválidas. Por favor, verifique su usuario y contraseña.",
        });
      } else if (response?.status === 422) {
        // Validation errors
        if (response.data?.errors) {
          setError(response.data.errors);
        } else if (response.data?.message) {
          setError({ message: response.data.message });
        }
      } else if (response?.data?.errors) {
        setError(response.data.errors);
      } else if (response?.data?.message) {
        setError({ message: response.data.message });
      } else {
        setError({
          message: "Error al iniciar sesión. Por favor, intente nuevamente.",
        });
      }
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function logout(): Promise<void> {
    // Only set loading if we're actually going to make an API call
    const hasToken = !!JwtService.getToken();
    if (hasToken) {
      loading.value = true;
    }

    try {
      if (hasToken) {
        await ApiService.post("logout", {});
      }
    } catch (error) {
    } finally {
      purgeAuth();
    }
  }

  async function register(credentials: RegisterCredentials): Promise<void> {
    loading.value = true;
    clearErrors();

    try {
      const { data } = await ApiService.post("register", credentials);
      setAuth(data);
    } catch (error: any) {
      const response = error.response;
      if (response?.data?.errors) {
        setError(response.data.errors);
      } else if (response?.data?.message) {
        setError({ message: response.data.message });
      } else {
        setError({
          message: "Error al crear la cuenta. Por favor, intente nuevamente.",
        });
      }
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function refreshUser() {
    try {
      const { data } = await ApiService.get("user");
      if (data.data) {
        setAuth(data.data);
      }
      return data.data;
    } catch (error) {
      console.error("Error refreshing user:", error);
      throw error;
    }
  }

  async function verifyAuth(): Promise<void> {
    // Prevent multiple simultaneous verification attempts
    if (verifyingAuth.value) {
      return;
    }

    const token = JwtService.getToken();
    if (!token) {
      purgeAuth();
      return;
    }

    // Set the Authorization header before making the request
    ApiService.setHeader();

    verifyingAuth.value = true;

    try {
      const { data } = await ApiService.get("user");

      // Verify we have valid user data
      if (data && data.data && data.data.user) {
        user.value = data.data.user;
        isAuthenticated.value = true;

        // Set permissions from user object
        if (data.data.user.all_permissions) {
          permissions.value = data.data.user.all_permissions;
        } else if (data.data.permissions) {
          permissions.value = data.data.permissions;
        } else {
          permissions.value = [];
        }
      } else {
        purgeAuth();
      }
    } catch (error: any) {
      // If it's a 401 error, the token is invalid
      if (error.response?.status === 401) {
        // Token expired or invalid, clearing auth
      }

      purgeAuth();
    } finally {
      verifyingAuth.value = false;
    }
  }

  async function refreshUserData(): Promise<void> {
    const token = JwtService.getToken();
    if (!token) {
      return;
    }

    try {
      const { data } = await ApiService.get("user");

      if (data && data.data && data.data.user) {
        const oldPhoto = user.value?.profile_photo;
        user.value = data.data.user;

        // Update permissions if available
        if (data.data.user.all_permissions) {
          permissions.value = data.data.user.all_permissions;
        }
      }
    } catch (error: any) {}
  }

  async function updateProfile(userData: Partial<User>): Promise<void> {
    loading.value = true;
    clearErrors();

    try {
      const { data } = await ApiService.put("user/profile", userData);
      user.value = { ...user.value, ...data.data.user };

      // Refresh user data to ensure all data is up-to-date
      setTimeout(() => {
        refreshUserData();
      }, 100);
    } catch (error: any) {
      const response = error.response;
      if (response?.data?.errors) {
        setError(response.data.errors);
      } else {
        setError({ message: "Error al actualizar el perfil." });
      }
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function changePassword(passwordData: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<void> {
    loading.value = true;
    clearErrors();

    try {
      await ApiService.post("user/change-password", passwordData);
      clearErrors();
    } catch (error: any) {
      const response = error.response;
      if (response?.data?.errors) {
        setError(response.data.errors);
      } else {
        setError({ message: "Error al cambiar la contraseña." });
      }
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function forgotPassword(data: { email: string }): Promise<void> {
    loading.value = true;
    clearErrors();

    try {
      await ApiService.post("auth/forgot-password", data);
      clearErrors();
    } catch (error: any) {
      const response = error.response;
      if (response?.data?.errors) {
        setError(response.data.errors);
      } else if (response?.data?.message) {
        setError({ message: response.data.message });
      } else {
        setError({
          message:
            "Error al enviar el enlace de restablecimiento. Por favor, verifica tu correo electrónico.",
        });
      }
      throw error;
    } finally {
      loading.value = false;
    }
  }

  // Permission checking functions
  function hasPermission(permission: string): boolean {
    // Super admin has all permissions
    if (isSuperAdmin.value) return true;

    // Check if user has the specific permission
    return permissions.value.some((p) => p.slug === permission);
  }

  function hasAnyPermission(permissionList: string[]): boolean {
    // Super admin has all permissions
    if (isSuperAdmin.value) return true;

    // Check if user has any of the permissions
    return permissionList.some((permission) =>
      permissions.value.some((p) => p.slug === permission),
    );
  }

  function hasAllPermissions(permissionList: string[]): boolean {
    // Super admin has all permissions
    if (isSuperAdmin.value) return true;

    // Check if user has all the permissions
    return permissionList.every((permission) =>
      permissions.value.some((p) => p.slug === permission),
    );
  }

  function hasModulePermission(module: string, action: string): boolean {
    // Super admin has all permissions
    if (isSuperAdmin.value) return true;

    // Check if user has the specific module + action permission
    return permissions.value.some(
      (p) => p.module === module && p.action === action,
    );
  }

  function canAccess(module: string): boolean {
    // Super admin has all permissions
    if (isSuperAdmin.value) return true;

    // Check if user has any permission for the module
    return permissions.value.some((p) => p.module === module);
  }

  return {
    // State
    errors,
    user,
    isAuthenticated,
    loading,
    permissions,

    // Computed
    hasErrors,
    userName,
    userRole,
    userRoleSlug,
    userRoleObject,
    isSuperAdmin,
    isAdmin,
    token,

    // Actions
    login,
    logout,
    register,
    forgotPassword,
    verifyAuth,
    updateProfile,
    changePassword,
    refreshUserData,
    refreshUser,
    clearErrors,
    setAuth,
    purgeAuth,

    // Permission checking
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasModulePermission,
    canAccess,
  };
});
