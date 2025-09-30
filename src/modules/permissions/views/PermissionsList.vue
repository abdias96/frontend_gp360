<template>
  <div class="container-fluid">
    <!-- Título -->
    <div class="d-flex flex-column">
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        Gestión de Permisos
      </h1>
    </div>

    <!-- Filtros -->
    <div class="card mt-5">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label for="search" class="form-label">Buscar</label>
            <input
              v-model="filters.search"
              type="text"
              class="form-control"
              id="search"
              placeholder="Buscar por nombre o descripción..."
            />
          </div>
          <div class="col-md-3">
            <label for="module" class="form-label">Módulo</label>
            <select v-model="filters.module" class="form-select" id="module">
              <option value="">Todos los módulos</option>
              <option v-for="module in modules" :key="module" :value="module">
                {{
                  module
                    ? module.charAt(0).toUpperCase() + module.slice(1)
                    : module
                }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label for="action" class="form-label">Acción</label>
            <select v-model="filters.action" class="form-select" id="action">
              <option value="">Todas las acciones</option>
              <option v-for="action in actions" :key="action" :value="action">
                {{
                  action
                    ? action.charAt(0).toUpperCase() + action.slice(1)
                    : action
                }}
              </option>
            </select>
          </div>
          <div class="col-md-2 d-flex align-items-end">
            <button
              @click="clearFilters"
              class="btn btn-outline-secondary w-100"
            >
              <i class="bi bi-x-circle me-1"></i>
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tarjeta principal -->
    <div class="card mt-3">
      <div class="card-header">
        <h3 class="card-title">
          Lista de Permisos
          <span class="badge badge-primary ms-2">{{
            filteredPermissions.length
          }}</span>
        </h3>
        <div class="card-toolbar">
          <div class="btn-group">
            <button
              @click="viewMode = 'table'"
              :class="{
                'btn btn-sm': true,
                'btn-primary': viewMode === 'table',
                'btn-outline-primary': viewMode !== 'table',
              }"
            >
              <i class="bi bi-table"></i>
              Tabla
            </button>
            <button
              @click="viewMode = 'cards'"
              :class="{
                'btn btn-sm': true,
                'btn-primary': viewMode === 'cards',
                'btn-outline-primary': viewMode !== 'cards',
              }"
            >
              <i class="bi bi-grid-3x3"></i>
              Tarjetas
            </button>
          </div>
        </div>
      </div>

      <div class="card-body">
        <!-- Loading state -->
        <div v-if="loading" class="d-flex justify-content-center my-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <!-- Vista de tabla -->
        <div v-else-if="viewMode === 'table'" class="table-responsive">
          <table class="table table-row-dashed table-row-gray-300 gy-7">
            <thead>
              <tr class="fw-semibold fs-6 text-gray-800">
                <th>Nombre</th>
                <th>Slug</th>
                <th>Módulo</th>
                <th>Acción</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Uso en Roles</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="permission in filteredPermissions"
                :key="permission.id"
              >
                <td class="fw-bold">{{ permission.name }}</td>
                <td>
                  <code class="bg-light px-2 py-1 rounded">{{
                    permission.slug
                  }}</code>
                </td>
                <td>
                  <span
                    class="badge badge-module"
                    :style="{
                      backgroundColor: getModuleColor(permission.module),
                    }"
                  >
                    {{ permission.module || "N/A" }}
                  </span>
                </td>
                <td>
                  <span
                    class="badge badge-action"
                    :class="getActionClass(permission.action)"
                  >
                    {{ permission.action || "N/A" }}
                  </span>
                </td>
                <td>{{ permission.description || "Sin descripción" }}</td>
                <td>
                  <span
                    :class="{
                      'badge badge-success': permission.active,
                      'badge badge-danger': !permission.active,
                    }"
                  >
                    {{ permission.active ? "Activo" : "Inactivo" }}
                  </span>
                </td>
                <td>
                  <span class="badge badge-secondary">
                    {{ permission.roles_count || 0 }} roles
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Vista de tarjetas -->
        <div v-else-if="viewMode === 'cards'" class="row">
          <div
            class="col-md-6 col-lg-4 mb-4"
            v-for="permission in filteredPermissions"
            :key="permission.id"
          >
            <div class="card h-100">
              <div class="card-header py-2">
                <div class="d-flex justify-content-between align-items-start">
                  <h6 class="card-title fw-bold mb-0">{{ permission.name }}</h6>
                  <span
                    :class="{
                      'badge badge-success': permission.active,
                      'badge badge-danger': !permission.active,
                    }"
                  >
                    {{ permission.active ? "Activo" : "Inactivo" }}
                  </span>
                </div>
              </div>
              <div class="card-body py-2">
                <div class="mb-2">
                  <code class="bg-light px-2 py-1 rounded small">{{
                    permission.slug
                  }}</code>
                </div>
                <div class="mb-2">
                  <span
                    class="badge badge-module me-1"
                    :style="{
                      backgroundColor: getModuleColor(permission.module),
                    }"
                  >
                    {{ permission.module || "N/A" }}
                  </span>
                  <span
                    class="badge badge-action"
                    :class="getActionClass(permission.action)"
                  >
                    {{ permission.action || "N/A" }}
                  </span>
                </div>
                <p class="text-muted small mb-2">
                  {{ permission.description || "Sin descripción" }}
                </p>
                <div class="text-end">
                  <span class="badge badge-secondary small">
                    {{ permission.roles_count || 0 }} roles
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-if="!loading && filteredPermissions.length === 0"
          class="text-center py-5"
        >
          <i class="bi bi-shield-exclamation display-4 text-muted"></i>
          <h4 class="mt-3">No se encontraron permisos</h4>
          <p class="text-muted">
            {{
              hasFilters
                ? "Intente cambiar los filtros de búsqueda."
                : "No hay permisos disponibles en el sistema."
            }}
          </p>
          <button
            v-if="hasFilters"
            @click="clearFilters"
            class="btn btn-primary"
          >
            <i class="bi bi-x-circle me-1"></i>
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="row mt-5">
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <i class="bi bi-shield-check display-6 text-primary"></i>
            <h4 class="mt-2">{{ permissions.length }}</h4>
            <p class="text-muted mb-0">Total Permisos</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <i class="bi bi-collection display-6 text-info"></i>
            <h4 class="mt-2">{{ modules.length }}</h4>
            <p class="text-muted mb-0">Módulos</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <i class="bi bi-lightning display-6 text-warning"></i>
            <h4 class="mt-2">{{ actions.length }}</h4>
            <p class="text-muted mb-0">Acciones</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <i class="bi bi-check-circle display-6 text-success"></i>
            <h4 class="mt-2">{{ activePermissions }}</h4>
            <p class="text-muted mb-0">Activos</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import ApiService from "@/core/services/ApiService";

// Reactive data
const loading = ref(false);
const permissions = ref([]);
const viewMode = ref("table");

const filters = ref({
  search: "",
  module: "",
  action: "",
});

// Computed
const modules = computed(() => {
  const uniqueModules = [
    ...new Set(permissions.value.map((p) => p.module).filter(Boolean)),
  ];
  return uniqueModules.sort();
});

const actions = computed(() => {
  const uniqueActions = [
    ...new Set(permissions.value.map((p) => p.action).filter(Boolean)),
  ];
  return uniqueActions.sort();
});

const activePermissions = computed(() => {
  return permissions.value.filter((p) => p.active).length;
});

const hasFilters = computed(() => {
  return filters.value.search || filters.value.module || filters.value.action;
});

const filteredPermissions = computed(() => {
  let filtered = permissions.value;

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.slug.toLowerCase().includes(search) ||
        (p.description && p.description.toLowerCase().includes(search)),
    );
  }

  if (filters.value.module) {
    filtered = filtered.filter((p) => p.module === filters.value.module);
  }

  if (filters.value.action) {
    filtered = filtered.filter((p) => p.action === filters.value.action);
  }

  return filtered.sort((a, b) => a.sort_order - b.sort_order);
});

// Methods
const loadPermissions = async () => {
  try {
    loading.value = true;
    const response = await ApiService.get("permissions");

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

    // Handle different data formats
    let flatPermissions = [];

    if (Array.isArray(data)) {
      // Check if data is array of modules or array of permissions
      if (
        data.length > 0 &&
        data[0].hasOwnProperty("module") &&
        data[0].hasOwnProperty("permissions")
      ) {
        // Data is grouped by modules, extract permissions from each module
        data.forEach((moduleGroup) => {
          if (Array.isArray(moduleGroup.permissions)) {
            flatPermissions.push(...moduleGroup.permissions);
          }
        });
      } else {
        // Data is already a flat array of permissions
        flatPermissions = data;
      }
    } else if (data && typeof data === "object") {
      // Data is grouped as an object, convert to flat array
      for (const module in data) {
        if (Array.isArray(data[module])) {
          flatPermissions.push(...data[module]);
        }
      }
    }

    permissions.value = flatPermissions;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error loading permissions:", error);
    }
    alert("Error al cargar los permisos");
  } finally {
    loading.value = false;
  }
};

const clearFilters = () => {
  filters.value = {
    search: "",
    module: "",
    action: "",
  };
};

const getModuleColor = (module) => {
  if (!module) return "#6c757d";
  const colors = {
    dashboard: "#0d6efd",
    users: "#198754",
    roles: "#fd7e14",
    permissions: "#6f42c1",
    settings: "#6c757d",
    reports: "#dc3545",
    catalogs: "#20c997",
    system: "#6c757d",
  };
  return colors[module] || "#20c997";
};

const getActionClass = (action) => {
  if (!action) return "badge-light";
  const classes = {
    view: "badge-info",
    list: "badge-primary",
    create: "badge-success",
    edit: "badge-warning",
    delete: "badge-danger",
    export: "badge-secondary",
    import: "badge-dark",
    manage: "badge-purple",
  };
  return classes[action] || "badge-light";
};

// Lifecycle
onMounted(() => {
  loadPermissions();
});
</script>

<style scoped>
.badge {
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
}

.badge-module {
  color: white;
}

.badge-action {
  color: white;
}

.badge-info {
  background-color: #0dcaf0;
}

.badge-primary {
  background-color: #0d6efd;
}

.badge-success {
  background-color: #198754;
}

.badge-warning {
  background-color: #ffc107;
  color: #000;
}

.badge-danger {
  background-color: #dc3545;
}

.badge-secondary {
  background-color: #6c757d;
}

.badge-dark {
  background-color: #212529;
}

.badge-light {
  background-color: #f8f9fa;
  color: #6c757d;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

code {
  font-size: 0.875rem;
}

.btn-group .btn {
  margin-right: 0;
}

.text-muted {
  color: #6c757d !important;
}

.display-6 {
  font-size: 2rem;
}
</style>
