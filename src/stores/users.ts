import { ref, computed } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { User } from "./auth";

export interface UsersListResponse {
  data: User[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  per_page?: number;
}

export const useUsersStore = defineStore("users", () => {
  const users = ref<User[]>([]);
  const selectedUser = ref<User | null>(null);
  const loading = ref(false);
  const errors = ref<Record<string, any>>({});
  const meta = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  // Computed properties
  const hasErrors = computed(() => Object.keys(errors.value).length > 0);
  const totalUsers = computed(() => meta.value.total);
  const isLoading = computed(() => loading.value);

  function clearErrors() {
    errors.value = {};
  }

  function setError(error: any) {
    errors.value = { ...error };
  }

  async function fetchUsers(filters: UserFilters = {}): Promise<void> {
    loading.value = true;
    clearErrors();

    try {
      const { data } = await ApiService.query("users", filters);
      users.value = data.data;
      if (data.meta) {
        meta.value = data.meta;
      }
    } catch (error: any) {
      const response = error.response;
      if (response?.data?.errors) {
        setError(response.data.errors);
      } else {
        setError({ message: "Error al cargar los usuarios." });
      }
      console.error("Error fetching users:", error);
    } finally {
      loading.value = false;
    }
  }

  async function fetchUser(id: number): Promise<User | null> {
    loading.value = true;
    clearErrors();

    try {
      const { data } = await ApiService.get("users", id.toString());
      selectedUser.value = data.data;
      return data.data;
    } catch (error: any) {
      const response = error.response;
      if (response?.data?.errors) {
        setError(response.data.errors);
      } else {
        setError({ message: "Error al cargar el usuario." });
      }
      console.error("Error fetching user:", error);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function createUser(userData: Partial<User>): Promise<User | null> {
    loading.value = true;
    clearErrors();

    try {
      const { data } = await ApiService.post("users", userData);
      const newUser = data.data;
      users.value.unshift(newUser);
      meta.value.total++;
      return newUser;
    } catch (error: any) {
      const response = error.response;
      if (response?.data?.errors) {
        setError(response.data.errors);
      } else {
        setError({ message: "Error al crear el usuario." });
      }
      console.error("Error creating user:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function updateUser(
    id: number,
    userData: Partial<User>,
  ): Promise<User | null> {
    loading.value = true;
    clearErrors();

    try {
      const { data } = await ApiService.update(
        "users",
        id.toString(),
        userData,
      );
      const updatedUser = data.data;

      // Update user in the list
      const index = users.value.findIndex((user) => user.id === id);
      if (index !== -1) {
        users.value[index] = updatedUser;
      }

      // Update selected user if it's the same
      if (selectedUser.value?.id === id) {
        selectedUser.value = updatedUser;
      }

      return updatedUser;
    } catch (error: any) {
      const response = error.response;
      if (response?.data?.errors) {
        setError(response.data.errors);
      } else {
        setError({ message: "Error al actualizar el usuario." });
      }
      console.error("Error updating user:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function deleteUser(id: number): Promise<void> {
    loading.value = true;
    clearErrors();

    try {
      await ApiService.delete("users", id.toString());

      // Remove user from the list
      users.value = users.value.filter((user) => user.id !== id);
      meta.value.total--;

      // Clear selected user if it's the same
      if (selectedUser.value?.id === id) {
        selectedUser.value = null;
      }
    } catch (error: any) {
      const response = error.response;
      if (response?.data?.errors) {
        setError(response.data.errors);
      } else {
        setError({ message: "Error al eliminar el usuario." });
      }
      console.error("Error deleting user:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function toggleUserStatus(id: number): Promise<void> {
    loading.value = true;
    clearErrors();

    try {
      const { data } = await ApiService.post(`users/${id}/toggle-status`, {});
      const updatedUser = data.data;

      // Update user in the list
      const index = users.value.findIndex((user) => user.id === id);
      if (index !== -1) {
        users.value[index] = updatedUser;
      }

      // Update selected user if it's the same
      if (selectedUser.value?.id === id) {
        selectedUser.value = updatedUser;
      }
    } catch (error: any) {
      const response = error.response;
      if (response?.data?.errors) {
        setError(response.data.errors);
      } else {
        setError({ message: "Error al cambiar el estado del usuario." });
      }
      console.error("Error toggling user status:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  function clearUsers() {
    users.value = [];
    selectedUser.value = null;
    meta.value = {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
    };
  }

  function setSelectedUser(user: User | null) {
    selectedUser.value = user;
  }

  return {
    // State
    users,
    selectedUser,
    loading,
    errors,
    meta,

    // Computed
    hasErrors,
    totalUsers,
    isLoading,

    // Actions
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    clearUsers,
    setSelectedUser,
    clearErrors,
  };
});
