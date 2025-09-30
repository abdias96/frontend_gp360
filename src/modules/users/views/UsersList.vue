<template>
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title">
        <!--begin::Search-->
        <div class="d-flex align-items-center position-relative my-1">
          <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <input
            type="text"
            v-model="searchTerm"
            class="form-control form-control-solid w-250px ps-13"
            placeholder="Buscar usuarios..."
          />
        </div>
        <!--end::Search-->
      </div>
      <!--begin::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div class="d-flex justify-content-end">
          <!--begin::Add user-->
          <button
            type="button"
            class="btn btn-primary"
            @click="showCreateUserModal = true"
          >
            <i class="ki-duotone ki-plus fs-2"></i>
            Agregar Usuario
          </button>
          <!--end::Add user-->
        </div>
        <!--end::Toolbar-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body py-4">
      <!--begin::Table-->
      <div class="table-responsive">
        <table class="table align-middle table-row-dashed fs-6 gy-5">
          <!--begin::Table head-->
          <thead>
            <tr class="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
              <th class="min-w-125px">Usuario</th>
              <th class="min-w-125px">Rol</th>
              <th class="min-w-125px">Estado</th>
              <th class="min-w-125px">Último acceso</th>
              <th class="text-end min-w-100px">Acciones</th>
            </tr>
          </thead>
          <!--end::Table head-->

          <!--begin::Table body-->
          <tbody class="text-gray-600 fw-semibold">
            <tr v-for="user in filteredUsers" :key="user.id">
              <!--begin::User=-->
              <td class="d-flex align-items-center">
                <!--begin::Avatar-->
                <div
                  class="symbol symbol-circle symbol-50px overflow-hidden me-3"
                >
                  <div class="symbol-label">
                    <span class="text-inverse-primary fw-bold">
                      {{ user.initials }}
                    </span>
                  </div>
                </div>
                <!--end::Avatar-->
                <!--begin::User details-->
                <div class="d-flex flex-column">
                  <span class="text-gray-800 text-hover-primary mb-1">
                    {{ user.name }}
                  </span>
                  <span>{{ user.email }}</span>
                </div>
                <!--begin::User details-->
              </td>
              <!--end::User=-->

              <!--begin::Role-->
              <td>{{ user.role }}</td>
              <!--end::Role-->

              <!--begin::Status-->
              <td>
                <div class="badge" :class="getStatusClass(user.status)">
                  {{ user.status }}
                </div>
              </td>
              <!--end::Status-->

              <!--begin::Last login-->
              <td>{{ user.last_login }}</td>
              <!--end::Last login-->

              <!--begin::Action-->
              <td class="text-end">
                <div class="d-flex justify-content-end flex-shrink-0">
                  <button
                    class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                    @click="editUser(user)"
                  >
                    <i class="ki-duotone ki-pencil fs-5">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </button>
                  <button
                    class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                    @click="deleteUser(user.id)"
                  >
                    <i class="ki-duotone ki-trash fs-5">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                      <span class="path5"></span>
                    </i>
                  </button>
                </div>
              </td>
              <!--end::Action-->
            </tr>
          </tbody>
          <!--end::Table body-->
        </table>
      </div>
      <!--end::Table-->
    </div>
    <!--end::Card body-->
  </div>

  <!-- Create User Modal -->
  <div
    v-if="showCreateUserModal"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">Agregar Usuario</h2>
          <div
            class="btn btn-icon btn-sm btn-active-icon-primary"
            @click="showCreateUserModal = false"
          >
            <i class="ki-duotone ki-cross fs-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
        </div>
        <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
          <!-- Form content would go here -->
          <p>Formulario de creación de usuario aquí...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  last_login: string;
  initials: string;
}

const searchTerm = ref("");
const showCreateUserModal = ref(false);

// Sample data - replace with actual API call
const users = ref<User[]>([
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan.perez@siapen.gov.co",
    role: "Administrador",
    status: "Activo",
    last_login: "Hace 2 horas",
    initials: "JP",
  },
  {
    id: 2,
    name: "María García",
    email: "maria.garcia@siapen.gov.co",
    role: "Operador",
    status: "Activo",
    last_login: "Hace 1 día",
    initials: "MG",
  },
  {
    id: 3,
    name: "Carlos López",
    email: "carlos.lopez@siapen.gov.co",
    role: "Supervisor",
    status: "Inactivo",
    last_login: "Hace 1 semana",
    initials: "CL",
  },
]);

const filteredUsers = computed(() => {
  if (!searchTerm.value) return users.value;
  return users.value.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.value.toLowerCase()),
  );
});

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "activo":
      return "badge-light-success";
    case "inactivo":
      return "badge-light-danger";
    default:
      return "badge-light-secondary";
  }
};

const editUser = (user: User) => {
  console.log("Editar usuario:", user);
  // Implement edit functionality
};

const deleteUser = (userId: number) => {
  console.log("Eliminar usuario:", userId);
  // Implement delete functionality with confirmation
};
</script>
