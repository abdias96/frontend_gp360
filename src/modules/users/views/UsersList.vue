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
            :placeholder="$t('users.list.search')"
            @input="handleSearchInput"
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
            @click="openCreateModal"
          >
            <i class="ki-duotone ki-plus fs-2"></i>
            {{ $t('users.list.addUser') }}
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
              <th class="min-w-125px">{{ $t('users.list.table.user') }}</th>
              <th class="min-w-125px">{{ $t('users.list.table.role') }}</th>
              <th class="min-w-125px">{{ $t('users.list.table.status') }}</th>
              <th class="min-w-125px">{{ $t('users.list.table.lastLogin') }}</th>
              <th class="text-end min-w-100px">{{ $t('users.list.table.actions') }}</th>
            </tr>
          </thead>
          <!--end::Table head-->

          <!--begin::Table body-->
          <tbody class="text-gray-600 fw-semibold">
            <!-- Loading indicator -->
            <tr v-if="loading">
              <td colspan="5" class="text-center py-10">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">{{ $t('users.list.loading') }}</span>
                </div>
                <p class="text-muted mt-3">{{ $t('users.list.loadingUsers') }}</p>
              </td>
            </tr>
            <!-- Empty state -->
            <tr v-else-if="users.length === 0">
              <td colspan="5" class="text-center py-10">
                <p class="text-muted">{{ $t('users.list.noUsersFound') }}</p>
              </td>
            </tr>
            <!-- Users list -->
            <tr v-else v-for="user in users" :key="user.id">
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

      <!-- Pagination Controls -->
      <div v-if="!loading && users.length > 0" class="card-footer d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-3">
          <div class="text-muted">
            {{ $t('users.list.pagination.showing', { from: pagination.from, to: pagination.to, total: pagination.total }) }}
          </div>
          <div class="d-flex align-items-center gap-2">
            <label class="form-label mb-0 me-2">{{ $t('users.list.pagination.perPage') }}</label>
            <select
              v-model.number="pagination.perPage"
              class="form-select form-select-sm"
              style="width: 80px;"
              @change="changePerPage(pagination.perPage)"
            >
              <option :value="10">10</option>
              <option :value="15">15</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
        </div>

        <div class="d-flex align-items-center gap-2">
          <!-- Previous Button -->
          <button
            type="button"
            class="btn btn-sm btn-light"
            :disabled="pagination.currentPage === 1"
            @click="prevPage"
          >
            <i class="fas fa-chevron-left"></i>
          </button>

          <!-- Page Numbers -->
          <div class="d-flex gap-1">
            <!-- First Page -->
            <button
              v-if="pagination.currentPage > 3"
              type="button"
              class="btn btn-sm btn-light"
              @click="changePage(1)"
            >
              1
            </button>
            <span v-if="pagination.currentPage > 4" class="align-self-center">...</span>

            <!-- Pages around current -->
            <button
              v-for="page in visiblePages"
              :key="page"
              type="button"
              class="btn btn-sm"
              :class="page === pagination.currentPage ? 'btn-primary' : 'btn-light'"
              @click="changePage(page)"
            >
              {{ page }}
            </button>

            <!-- Last Page -->
            <span v-if="pagination.currentPage < pagination.lastPage - 3" class="align-self-center">...</span>
            <button
              v-if="pagination.currentPage < pagination.lastPage - 2"
              type="button"
              class="btn btn-sm btn-light"
              @click="changePage(pagination.lastPage)"
            >
              {{ pagination.lastPage }}
            </button>
          </div>

          <!-- Next Button -->
          <button
            type="button"
            class="btn btn-sm btn-light"
            :disabled="pagination.currentPage === pagination.lastPage"
            @click="nextPage"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
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
    <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">{{ $t('users.list.create.title') }}</h2>
          <div
            class="btn btn-icon btn-sm btn-active-icon-primary"
            @click="closeCreateModal"
          >
            <i class="ki-duotone ki-cross fs-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
        </div>
        <form @submit.prevent="handleCreateUser">
          <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
            <!-- Información Personal -->
            <div class="mb-10">
              <h5 class="fw-bold text-primary mb-5">{{ $t('users.form.sections.personalInfo') }}</h5>

              <div class="row g-5">
                <div class="col-md-6">
                  <label class="form-label required">{{ $t('users.form.fields.dpi') }}</label>
                  <input
                    v-model="newUserForm.dpi"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': formErrors.dpi }"
                    :placeholder="$t('users.form.placeholders.dpi')"
                    required
                  />
                  <div v-if="formErrors.dpi" class="invalid-feedback">
                    {{ formErrors.dpi }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label required">{{ $t('users.form.fields.email') }}</label>
                  <input
                    v-model="newUserForm.email"
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': formErrors.email }"
                    :placeholder="$t('users.form.placeholders.email')"
                    required
                  />
                  <div v-if="formErrors.email" class="invalid-feedback">
                    {{ formErrors.email }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label required">{{ $t('users.form.fields.firstName') }}</label>
                  <input
                    v-model="newUserForm.first_name"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': formErrors.first_name }"
                    :placeholder="$t('users.form.placeholders.firstName')"
                    required
                    @input="generateUsername"
                  />
                  <div v-if="formErrors.first_name" class="invalid-feedback">
                    {{ formErrors.first_name }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label">{{ $t('users.form.fields.middleName') }}</label>
                  <input
                    v-model="newUserForm.middle_name"
                    type="text"
                    class="form-control"
                    :placeholder="$t('users.form.placeholders.middleName')"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label required">{{ $t('users.form.fields.lastName') }}</label>
                  <input
                    v-model="newUserForm.last_name"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': formErrors.last_name }"
                    :placeholder="$t('users.form.placeholders.lastName')"
                    required
                    @input="generateUsername"
                  />
                  <div v-if="formErrors.last_name" class="invalid-feedback">
                    {{ formErrors.last_name }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label">{{ $t('users.form.fields.secondLastName') }}</label>
                  <input
                    v-model="newUserForm.second_last_name"
                    type="text"
                    class="form-control"
                    :placeholder="$t('users.form.placeholders.secondLastName')"
                    @input="generateUsername"
                  />
                </div>
              </div>
            </div>

            <!-- Información de Cuenta -->
            <div class="mb-10">
              <h5 class="fw-bold text-primary mb-5">{{ $t('users.form.sections.accountInfo') }}</h5>

              <div class="row g-5">
                <div class="col-md-6">
                  <label class="form-label required">{{ $t('users.form.fields.username') }}</label>
                  <div class="input-group">
                    <input
                      v-model="newUserForm.username"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.username }"
                      :placeholder="$t('users.form.placeholders.username')"
                      disabled
                      :title="$t('users.form.hints.usernameNotEditable')"
                    />
                    <span v-if="checkingUsername" class="input-group-text">
                      <span class="spinner-border spinner-border-sm"></span>
                    </span>
                    <span v-else-if="newUserForm.username" class="input-group-text">
                      <i class="bi bi-check-circle-fill text-success"></i>
                    </span>
                  </div>
                  <div v-if="formErrors.username" class="invalid-feedback d-block">
                    {{ formErrors.username }}
                  </div>
                  <small class="form-text text-muted">
                    <i class="bi bi-info-circle me-1"></i>
                    {{ $t('users.form.hints.usernameGeneration') }}
                  </small>
                </div>

                <div class="col-md-6">
                  <label class="form-label required">{{ $t('users.form.fields.role') }}</label>
                  <select
                    v-model="newUserForm.role_id"
                    class="form-select"
                    :class="{ 'is-invalid': formErrors.role_id }"
                    required
                  >
                    <option value="">{{ $t('users.form.placeholders.selectRole') }}</option>
                    <option v-for="role in roles" :key="role.id" :value="role.id">
                      {{ role.name }}
                    </option>
                  </select>
                  <div v-if="formErrors.role_id" class="invalid-feedback">
                    {{ formErrors.role_id }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label required">{{ $t('users.form.fields.password') }}</label>
                  <input
                    v-model="newUserForm.password"
                    type="password"
                    class="form-control"
                    :class="{ 'is-invalid': formErrors.password }"
                    :placeholder="$t('users.form.placeholders.password')"
                    required
                  />
                  <div v-if="formErrors.password" class="invalid-feedback">
                    {{ formErrors.password }}
                  </div>
                  <small class="form-text text-muted">{{ $t('users.form.hints.minPassword') }}</small>
                </div>

                <div class="col-md-6">
                  <label class="form-label required">{{ $t('users.form.fields.confirmPassword') }}</label>
                  <input
                    v-model="newUserForm.password_confirmation"
                    type="password"
                    class="form-control"
                    :class="{ 'is-invalid': formErrors.password_confirmation }"
                    :placeholder="$t('users.form.placeholders.confirmPassword')"
                    required
                  />
                  <div v-if="formErrors.password_confirmation" class="invalid-feedback">
                    {{ formErrors.password_confirmation }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Estado -->
            <div>
              <h5 class="fw-bold text-primary mb-5">{{ $t('users.form.sections.status') }}</h5>
              <div class="form-check form-switch">
                <input
                  v-model="newUserForm.active"
                  class="form-check-input"
                  type="checkbox"
                  id="newUserActive"
                />
                <label class="form-check-label" for="newUserActive">
                  {{ $t('users.form.fields.active') }}
                </label>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-light"
              @click="closeCreateModal"
              :disabled="creatingUser"
            >
              {{ $t('users.form.buttons.cancel') }}
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="creatingUser"
            >
              <span v-if="creatingUser" class="spinner-border spinner-border-sm me-2"></span>
              {{ creatingUser ? $t('users.form.buttons.creating') : $t('users.form.buttons.create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";

const { t } = useI18n();

const router = useRouter();

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
const users = ref<User[]>([]);
const roles = ref<any[]>([]);
const loading = ref(false);
const creatingUser = ref(false);
const checkingUsername = ref(false);
const formErrors = ref<any>({});

// Pagination state
const pagination = ref({
  currentPage: 1,
  perPage: 15,
  total: 0,
  lastPage: 1,
  from: 0,
  to: 0
});

const newUserForm = ref({
  dpi: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  second_last_name: "",
  email: "",
  username: "",
  password: "",
  password_confirmation: "",
  role_id: "",
  active: true
});

// Load users from API
const loadUsers = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      page: pagination.value.currentPage.toString(),
      per_page: pagination.value.perPage.toString()
    });

    if (searchTerm.value) {
      params.append('search', searchTerm.value);
    }

    const response = await ApiService.get(`/users?${params.toString()}`);

    if (response.data.success) {
      const paginatedData = response.data.data;
      const usersData = Array.isArray(paginatedData)
        ? paginatedData
        : (paginatedData.data || []);

      // Update pagination metadata
      if (!Array.isArray(paginatedData)) {
        pagination.value.currentPage = paginatedData.current_page || 1;
        pagination.value.total = paginatedData.total || 0;
        pagination.value.lastPage = paginatedData.last_page || 1;
        pagination.value.from = paginatedData.from || 0;
        pagination.value.to = paginatedData.to || 0;
        pagination.value.perPage = paginatedData.per_page || 15;
      }

      users.value = usersData.map((user: any) => {
        const fullName = `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''} ${user.second_last_name || ''}`.trim();
        const initials = (user.first_name?.[0] || '') + (user.last_name?.[0] || '');

        return {
          id: user.id,
          name: fullName,
          email: user.email,
          role: user.role?.name || 'Sin rol',
          status: user.active ? 'Activo' : 'Inactivo',
          last_login: user.last_login ? formatDate(user.last_login) : 'Nunca',
          initials: initials.toUpperCase()
        };
      });
    }
  } catch (error: any) {
    console.error("Error loading users:", error);
    Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.error'),
      text: t('users.swal.loadError')
    });
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
  } else if (diffHours < 24) {
    return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
  } else if (diffDays < 7) {
    return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
  } else {
    return date.toLocaleDateString('es-GT');
  }
};

// Computed for visible pages in pagination
const visiblePages = computed(() => {
  const pages: number[] = [];
  const current = pagination.value.currentPage;
  const last = pagination.value.lastPage;

  let start = Math.max(1, current - 2);
  let end = Math.min(last, current + 2);

  if (current <= 3) {
    end = Math.min(5, last);
  }
  if (current >= last - 2) {
    start = Math.max(1, last - 4);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Debounced search handler
let searchTimeout: any = null;
const handleSearchInput = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    pagination.value.currentPage = 1;
    loadUsers();
  }, 500);
};

// Pagination functions
const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.lastPage) {
    pagination.value.currentPage = page;
    loadUsers();
  }
};

const changePerPage = (perPage: number) => {
  pagination.value.perPage = perPage;
  pagination.value.currentPage = 1;
  loadUsers();
};

const nextPage = () => {
  if (pagination.value.currentPage < pagination.value.lastPage) {
    changePage(pagination.value.currentPage + 1);
  }
};

const prevPage = () => {
  if (pagination.value.currentPage > 1) {
    changePage(pagination.value.currentPage - 1);
  }
};

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
  router.push({ name: 'users-edit', params: { id: user.id } });
};

const deleteUser = async (userId: number) => {
  const result = await Swal.fire({
    title: t('users.swal.deleteConfirmTitle'),
    text: t('users.swal.deleteConfirmText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: t('common.swal.buttons.yesDelete'),
    cancelButtonText: t('common.swal.buttons.cancel')
  });

  if (result.isConfirmed) {
    try {
      await ApiService.delete(`/users/${userId}`);
      await loadUsers();
      Swal.fire({
        icon: 'success',
        title: t('users.swal.deleteSuccess'),
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('common.swal.titles.error'),
        text: t('users.swal.deleteError')
      });
    }
  }
};

// Load roles from API
const loadRoles = async () => {
  try {
    const response = await ApiService.get("/roles");

    if (response.data.success) {
      const rolesData = response.data.data;
      roles.value = Array.isArray(rolesData) ? rolesData : (rolesData.data || []);
    } else {
      roles.value = response.data.data || response.data || [];
    }
  } catch (error) {
    console.error("Error loading roles:", error);
  }
};

// Normalize string (remove accents and special characters)
const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]/g, ""); // Remove special characters
};

// Generate username based on name
const generateUsername = async () => {
  const firstName = newUserForm.value.first_name.trim();
  const lastName = newUserForm.value.last_name.trim();
  const secondLastName = newUserForm.value.second_last_name.trim();

  // Need at least first name and last name
  if (!firstName || !lastName) {
    newUserForm.value.username = "";
    return;
  }

  // Generate base username: first letter of first name + last name + first letter of second last name
  const firstInitial = normalizeString(firstName.charAt(0));
  const lastNameNormalized = normalizeString(lastName);
  const secondInitial = secondLastName ? normalizeString(secondLastName.charAt(0)) : "";

  let baseUsername = firstInitial + lastNameNormalized + secondInitial;

  // Check if username exists
  await checkUsernameAvailability(baseUsername);
};

// Check if username is available
const checkUsernameAvailability = async (baseUsername: string) => {
  checkingUsername.value = true;
  formErrors.value.username = "";

  try {
    // Check if username exists in the database
    const response = await ApiService.get(`/users?search=${baseUsername}`);

    let finalUsername = baseUsername;

    if (response.data.success) {
      const usersData = response.data.data.data || response.data.data;

      // Check if exact username exists
      const exactMatch = usersData.find((u: any) =>
        u.username.toLowerCase() === baseUsername.toLowerCase()
      );

      if (exactMatch) {
        // Username exists, add random number
        let attempts = 0;
        let usernameExists = true;

        while (usernameExists && attempts < 10) {
          const randomNum = Math.floor(Math.random() * 9000) + 1000; // 4-digit random number
          finalUsername = baseUsername + randomNum;

          // Check if this combination exists
          const checkResponse = await ApiService.get(`/users?search=${finalUsername}`);
          const checkData = checkResponse.data.data.data || checkResponse.data.data;
          const existsCheck = checkData.find((u: any) =>
            u.username.toLowerCase() === finalUsername.toLowerCase()
          );

          if (!existsCheck) {
            usernameExists = false;
          }

          attempts++;
        }
      }
    }

    newUserForm.value.username = finalUsername;
  } catch (error) {
    console.error("Error checking username:", error);
    // If there's an error, just use the base username
    newUserForm.value.username = baseUsername;
  } finally {
    checkingUsername.value = false;
  }
};

// Reset form
const resetForm = () => {
  newUserForm.value = {
    dpi: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    second_last_name: "",
    email: "",
    username: "",
    password: "",
    password_confirmation: "",
    role_id: "",
    active: true
  };
  formErrors.value = {};
  checkingUsername.value = false;
};

// Open create modal
const openCreateModal = async () => {
  resetForm();
  showCreateUserModal.value = true;
  // Load roles if not loaded yet
  if (roles.value.length === 0) {
    await loadRoles();
  }
};

// Close create modal
const closeCreateModal = () => {
  showCreateUserModal.value = false;
  resetForm();
};

// Handle create user
const handleCreateUser = async () => {
  formErrors.value = {};

  // Validate username was generated
  if (!newUserForm.value.username) {
    Swal.fire({
      icon: 'error',
      title: t('common.swal.titles.error'),
      text: t('users.swal.usernameRequired')
    });
    return;
  }

  // Wait if still checking username
  if (checkingUsername.value) {
    Swal.fire({
      icon: 'info',
      title: t('common.swal.titles.pleaseWait'),
      text: t('users.swal.checkingUsername')
    });
    return;
  }

  // Validate passwords match
  if (newUserForm.value.password !== newUserForm.value.password_confirmation) {
    formErrors.value.password_confirmation = t('users.swal.passwordMismatch');
    return;
  }

  // Validate password length
  if (newUserForm.value.password.length < 8) {
    formErrors.value.password = t('users.swal.passwordTooShort');
    return;
  }

  creatingUser.value = true;

  try {
    await ApiService.post("/users", newUserForm.value);

    await Swal.fire({
      icon: 'success',
      title: t('common.swal.titles.success'),
      text: t('users.swal.createSuccess'),
      timer: 2000,
      showConfirmButton: false
    });

    closeCreateModal();
    await loadUsers();
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.response?.data?.errors) {
      formErrors.value = error.response.data.errors;
    } else {
      Swal.fire({
        icon: 'error',
        title: t('common.swal.titles.error'),
        text: error.response?.data?.message || t('users.swal.createError')
      });
    }
  } finally {
    creatingUser.value = false;
  }
};

// Load users and roles when component mounts
onMounted(() => {
  loadUsers();
  loadRoles();
});
</script>

<style scoped>
.form-label.required::after {
  content: " *";
  color: #dc3545;
}

.modal-dialog-scrollable .modal-body {
  max-height: calc(100vh - 250px);
  overflow-y: auto;
}

.invalid-feedback {
  display: block;
}

.input-group .form-control:disabled {
  background-color: #f5f8fa;
  cursor: not-allowed;
}

.input-group-text {
  background-color: #f5f8fa;
  border-color: #e4e6ef;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.15em;
}
</style>
