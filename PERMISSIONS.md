# Sistema de Permisos y Roles - Frontend

Este documento describe cómo usar el sistema de permisos y roles implementado en el frontend de GP360.

## Arquitectura del Sistema

El sistema de permisos está basado en:

- **Roles**: Conjuntos de permisos agrupados (ej: super_admin, admin, operator, viewer)
- **Permisos**: Acciones específicas que un usuario puede realizar (ej: users.create, users.edit)
- **Estructura modular**: Los permisos siguen el formato `módulo.acción` (ej: users.view, dashboard.access)

## Componentes Principales

### 1. Auth Store (`@/stores/auth.ts`)

Maneja la autenticación y permisos del usuario:

```typescript
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// Verificar permisos
authStore.hasPermission('users.create')
authStore.hasAnyPermission(['users.edit', 'users.delete'])
authStore.hasAllPermissions(['users.create', 'users.edit'])
authStore.hasModulePermission('users', 'create')
authStore.canAccess('users')

// Información del usuario
authStore.isSuperAdmin
authStore.isAdmin
authStore.userRole
authStore.permissions
```

### 2. Composable usePermissions (`@/composables/usePermissions.ts`)

Proporciona una interfaz simplificada para verificar permisos:

```typescript
import { usePermissions } from '@/composables/usePermissions';

const { 
  can, 
  cannot, 
  canView, 
  canCreate, 
  canEdit, 
  canDelete,
  isSuperAdmin,
  isAdmin 
} = usePermissions();

// Ejemplos de uso
if (can('users.create')) {
  // Mostrar botón crear
}

if (canEdit('users')) {
  // Permitir edición
}

// Verificar múltiples permisos
if (can({ permissions: ['users.edit', 'users.delete'] })) {
  // Usuario tiene al menos uno de los permisos
}

if (can({ permissions: ['users.edit', 'users.delete'], requireAll: true })) {
  // Usuario tiene todos los permisos
}
```

## Directivas de Vue

### Directiva v-permission

Controla la visibilidad de elementos basada en permisos:

```vue
<template>
  <!-- Elemento visible solo si tiene el permiso -->
  <button v-permission="'users.create'">Crear Usuario</button>
  
  <!-- Verificar múltiples permisos (OR por defecto) -->
  <button v-permission="['users.edit', 'users.delete']">Acciones</button>
  
  <!-- Verificar múltiples permisos (AND) -->
  <button v-permission.all="['users.edit', 'users.delete']">Acciones</button>
  
  <!-- Ocultar en lugar de remover del DOM -->
  <div v-permission.hide="'users.sensitive_data'">Datos sensibles</div>
  
  <!-- Deshabilitar en lugar de remover -->
  <input v-permission.disable="'users.edit'" type="text" />
  
  <!-- Usando objeto para mayor control -->
  <button v-permission="{ permissions: ['users.edit'], requireAll: false }">
    Editar
  </button>
</template>
```

### Directivas Específicas por Módulo

```vue
<template>
  <!-- Directivas para acciones específicas -->
  <button v-can-create="'users'">Crear</button>
  <button v-can-edit="'users'">Editar</button>
  <button v-can-delete="'users'">Eliminar</button>
  <div v-can-view="'users'">Vista de usuarios</div>
  
  <!-- Directivas basadas en roles -->
  <div v-super-admin>Solo Super Admin</div>
  <div v-admin>Solo Administradores</div>
  <div v-role="'operator'">Solo Operadores</div>
  <div v-role="['admin', 'operator']">Admin u Operador</div>
</template>
```

## Protección de Rutas

### Configuración en Router

```typescript
// router/index.ts
const routes = [
  {
    path: '/users',
    name: 'users-list',
    component: () => import('@/views/UsersList.vue'),
    meta: {
      permissions: 'users.list', // Permiso requerido
      // o múltiples permisos:
      // permissions: ['users.list', 'users.view'],
      // requireAllPermissions: true, // Requiere todos los permisos (default: false)
      
      // También se puede usar roles:
      // roles: 'admin',
      // roles: ['admin', 'operator'],
    }
  }
];
```

### Guards de Navegación

Los guards automáticamente verifican:
- Autenticación del usuario
- Permisos requeridos por la ruta
- Roles requeridos por la ruta
- Super admin tiene acceso a todo

## Componentes con Permisos

### PermissionButton

Componente de botón que se oculta automáticamente si no tiene permisos:

```vue
<template>
  <PermissionButton
    permissions="users.create"
    variant="primary"
    icon="bi-plus"
    text="Crear Usuario"
    @click="createUser"
  />
  
  <PermissionButton
    :permissions="['users.edit', 'users.delete']"
    :require-all-permissions="false"
    variant="danger"
    text="Acciones"
    @click="showActions"
  />
</template>

<script setup>
import PermissionButton from '@/components/common/PermissionButton.vue';
</script>
```

## Configuración del Menú

### MainMenuConfig.ts

```typescript
const MainMenuConfig = [
  {
    heading: "management",
    pages: [
      {
        sectionTitle: "users",
        route: "/users",
        permission: "users.view", // Permiso requerido para ver la sección
        sub: [
          {
            heading: "usersList",
            route: "/users",
            permission: "users.list",
          },
          {
            heading: "createUser",
            route: "/users/create",
            permission: "users.create",
          }
        ]
      }
    ]
  }
];
```

El menú automáticamente filtra elementos basado en permisos del usuario.

## Ejemplos de Uso

### En Componentes Vue

```vue
<template>
  <div>
    <!-- Botones de acción -->
    <div class="actions">
      <button v-permission="'users.create'" @click="create">Crear</button>
      <button v-permission="'users.edit'" @click="edit">Editar</button>
      <button v-permission="'users.delete'" @click="remove">Eliminar</button>
    </div>
    
    <!-- Tabla con acciones condicionales -->
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th v-permission="['users.edit', 'users.delete']">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td v-permission="['users.edit', 'users.delete']">
            <button v-can-edit="'users'" @click="editUser(user)">Editar</button>
            <button v-can-delete="'users'" @click="deleteUser(user)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- Sección solo para admins -->
    <div v-admin class="admin-panel">
      <h3>Panel de Administración</h3>
      <p>Solo visible para administradores</p>
    </div>
  </div>
</template>

<script setup>
import { usePermissions } from '@/composables/usePermissions';

const { canCreate, canEdit, canDelete } = usePermissions();

const create = () => {
  if (canCreate('users')) {
    // Lógica para crear
  }
};

const edit = () => {
  if (canEdit('users')) {
    // Lógica para editar
  }
};

const remove = () => {
  if (canDelete('users')) {
    // Lógica para eliminar
  }
};
</script>
```

### Verificaciones Programáticas

```typescript
import { usePermissions } from '@/composables/usePermissions';

const { can, hasPermission, isSuperAdmin } = usePermissions();

// Verificaciones simples
if (can('users.create')) {
  // Permitir crear usuario
}

// Verificaciones complejas
if (can({ 
  permissions: ['users.edit', 'users.manage'], 
  requireAll: true 
})) {
  // Permitir gestión avanzada
}

// En funciones async
const checkAccess = async () => {
  if (isSuperAdmin.value) {
    // Super admin puede hacer todo
    return true;
  }
  
  return hasPermission('module.action');
};
```

## Estructura de Permisos

### Módulos Principales

- **dashboard**: Acceso al dashboard principal
- **users**: Gestión de usuarios
- **roles**: Gestión de roles
- **permissions**: Gestión de permisos
- **settings**: Configuraciones del sistema
- **reports**: Reportes y estadísticas

### Acciones Comunes

- **view**: Ver información general del módulo
- **list**: Listar elementos
- **create**: Crear nuevos elementos
- **edit**: Editar elementos existentes
- **delete**: Eliminar elementos
- **export**: Exportar datos
- **import**: Importar datos

### Ejemplos de Permisos

```
dashboard.view
users.list
users.create
users.edit
users.delete
users.export
roles.view
roles.manage
permissions.list
settings.general
settings.security
reports.view
reports.export
```

## Roles Predefinidos

- **super_admin**: Acceso completo a todo el sistema
- **admin**: Acceso administrativo con restricciones específicas
- **operator**: Operaciones limitadas según configuración
- **viewer**: Solo lectura de información autorizada

## Mejores Prácticas

1. **Verificar permisos en múltiples niveles**:
   - Rutas (router guards)
   - Menús (configuración)
   - Componentes (directivas)
   - Lógica de negocio (composables)

2. **Usar directivas para UI**:
   ```vue
   <!-- Preferir esto -->
   <button v-permission="'users.create'">Crear</button>
   
   <!-- Sobre esto -->
   <button v-if="hasPermission('users.create')">Crear</button>
   ```

3. **Agrupar permisos relacionados**:
   ```vue
   <!-- Verificar permisos de edición una vez -->
   <div v-permission="['users.edit', 'users.delete']">
     <button v-can-edit="'users'">Editar</button>
     <button v-can-delete="'users'">Eliminar</button>
   </div>
   ```

4. **Mantener consistencia en nombres**:
   - Usar formato `module.action`
   - Mantener nombres descriptivos
   - Documentar permisos especiales

5. **Manejo de errores**:
   ```typescript
   try {
     if (!can('users.create')) {
       throw new Error('Sin permisos para crear usuarios');
     }
     // Lógica de creación
   } catch (error) {
     // Manejar error de permisos
   }
   ```

## Debugging

Para desarrollo, usar el componente de ejemplo que muestra información de permisos:

```vue
<template>
  <div v-if="isDevelopment">
    <h4>Debug: Permisos del Usuario</h4>
    <p>Rol: {{ userRole }}</p>
    <p>Super Admin: {{ isSuperAdmin }}</p>
    <div>
      Permisos:
      <span v-for="permission in permissions" :key="permission.id">
        {{ permission.slug }}
      </span>
    </div>
  </div>
</template>
```

Este sistema proporciona un control granular y flexible sobre el acceso a funcionalidades en el frontend, manteniéndose sincronizado con los permisos definidos en el backend.