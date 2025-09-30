<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h3 class="card-title">Debug Auth Info</h3>
      <div>
        <button @click="refreshUser" class="btn btn-success btn-sm me-2">
          Refresh User
        </button>
        <button @click="checkBackend" class="btn btn-primary btn-sm">
          Check Backend
        </button>
      </div>
    </div>
    <div class="card-body">
      <h4>Frontend Auth Store:</h4>
      <div class="row">
        <div class="col-md-6">
          <h5>User Info:</h5>
          <pre>{{ JSON.stringify(user, null, 2) }}</pre>
        </div>
        <div class="col-md-6">
          <h5>Role Info:</h5>
          <p><strong>Role:</strong> {{ userRole }}</p>
          <p><strong>Role Slug:</strong> {{ userRoleSlug }}</p>
          <p><strong>Is Super Admin:</strong> {{ isSuperAdmin }}</p>
          <p><strong>Is Admin:</strong> {{ isAdmin }}</p>
          
          <h5>Permission Tests:</h5>
          <p><strong>Can view operations:</strong> {{ can('operations.view') }}</p>
          <p><strong>Can view visits:</strong> {{ can('visits.view') }}</p>
          <p><strong>Can access operations:</strong> {{ canAccess('operations') }}</p>
          <p><strong>Can access visits:</strong> {{ canAccess('visits') }}</p>
        </div>
      </div>
      
      <h4>Permissions:</h4>
      <pre>{{ JSON.stringify(permissions, null, 2) }}</pre>
      
      <div v-if="backendData" class="mt-4">
        <h4>Backend Response:</h4>
        <pre>{{ JSON.stringify(backendData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { usePermissions } from "@/composables/usePermissions";
import ApiService from "@/core/services/ApiService";

const authStore = useAuthStore();
const { user } = authStore;
const { 
  isSuperAdmin, 
  isAdmin, 
  userRole, 
  userRoleSlug, 
  permissions,
  can,
  canAccess
} = usePermissions();

const backendData = ref(null);

const checkBackend = async () => {
  try {
    const response = await ApiService.get("/debug/check-auth");
    backendData.value = response.data;
  } catch (error) {
    console.error("Error checking backend:", error);
    backendData.value = { error: error.message };
  }
};

const refreshUser = async () => {
  try {
    await authStore.refreshUser();
    alert("User data refreshed!");
  } catch (error) {
    console.error("Error refreshing user:", error);
    alert("Error refreshing user data");
  }
};
</script>