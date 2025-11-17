import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";

// Define interface for route meta with permissions
declare module "vue-router" {
  interface RouteMeta {
    pageTitle?: string;
    breadcrumbs?: string[];
    middleware?: string;
    permissions?: string | string[];
    requireAllPermissions?: boolean;
    roles?: string | string[];
    requiresRole?: string | string[];
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("@/layouts/default-layout/DefaultLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/modules/dashboard/views/Dashboard.vue"),
        meta: {
          pageTitle: "Dashboard",
          breadcrumbs: ["Dashboards"],
          permissions: "dashboard.view",
        },
      },
      {
        path: "/user/profile",
        name: "user-profile",
        component: () => import("@/modules/users/views/UserProfile.vue"),
        meta: {
          pageTitle: "Mi Perfil",
          breadcrumbs: ["Usuario", "Perfil"],
        },
      },
      {
        path: "/debug-auth",
        name: "debug-auth",
        component: () => import("@/views/crafted/authentication/DebugAuth.vue"),
        meta: {
          pageTitle: "Debug Auth",
          breadcrumbs: ["Debug"],
        },
      },
      {
        path: "/access-denied",
        name: "access-denied",
        component: () => import("@/views/crafted/authentication/Error403.vue"),
        meta: {
          pageTitle: "Acceso Denegado",
        },
      },
      {
        path: "/users",
        name: "users-list",
        component: () => import("@/modules/users/views/UsersList.vue"),
        meta: {
          pageTitle: "Gestión de Usuarios",
          breadcrumbs: ["Usuarios"],
          permissions: "users.list",
        },
      },
      {
        path: "/users/create",
        name: "users-create",
        component: () => import("@/modules/users/views/UserCreate.vue"),
        meta: {
          pageTitle: "Crear Usuario",
          breadcrumbs: ["Usuarios", "Crear"],
          permissions: "users.create",
        },
      },
      {
        path: "/users/:id/edit",
        name: "users-edit",
        component: () => import("@/modules/users/views/UserEdit.vue"),
        meta: {
          pageTitle: "Editar Usuario",
          breadcrumbs: ["Usuarios", "Editar"],
          permissions: "users.edit",
        },
      },
      {
        path: "/roles",
        name: "roles-list",
        component: () => import("@/modules/roles/views/RolesList.vue"),
        meta: {
          pageTitle: "Gestión de Roles",
          breadcrumbs: ["Roles"],
          permissions: "roles.list",
        },
      },
      {
        path: "/roles/create",
        name: "roles-create",
        component: () => import("@/modules/roles/views/RoleCreate.vue"),
        meta: {
          pageTitle: "Crear Rol",
          breadcrumbs: ["Roles", "Crear"],
          permissions: "roles.create",
        },
      },
      {
        path: "/roles/:id/edit",
        name: "roles-edit",
        component: () => import("@/modules/roles/views/RoleEdit.vue"),
        meta: {
          pageTitle: "Editar Rol",
          breadcrumbs: ["Roles", "Editar"],
          permissions: "roles.edit",
        },
      },
      {
        path: "/permissions",
        name: "permissions-list",
        component: () =>
          import("@/modules/permissions/views/PermissionsList.vue"),
        meta: {
          pageTitle: "Gestión de Permisos",
          breadcrumbs: ["Permisos"],
          permissions: "permissions.list",
        },
      },
      {
        path: "/settings",
        name: "system-settings",
        component: () => import("@/modules/settings/views/SystemSettings.vue"),
        meta: {
          pageTitle: "Configuración del Sistema",
          breadcrumbs: ["Configuración"],
          permissions: "settings.view",
        },
      },
      {
        path: "/settings/general",
        name: "settings-general",
        component: () => import("@/modules/settings/views/GeneralSettings.vue"),
        meta: {
          pageTitle: "Configuración General",
          breadcrumbs: ["Configuración", "General"],
          permissions: "settings.general",
        },
      },
      {
        path: "/settings/security",
        name: "settings-security",
        component: () =>
          import("@/modules/settings/views/SecuritySettings.vue"),
        meta: {
          pageTitle: "Configuración de Seguridad",
          breadcrumbs: ["Configuración", "Seguridad"],
          permissions: "settings.security",
        },
      },
      {
        path: "/system/logs",
        name: "activity-logs",
        component: () => import("@/modules/system/views/ActivityLogs.vue"),
        meta: {
          pageTitle: "Logs de Actividad",
          breadcrumbs: ["Sistema", "Logs de Actividad"],
          permissions: "logs.view",
        },
      },
      {
        path: "/notifications",
        name: "notifications",
        component: () =>
          import("@/modules/notifications/views/Notifications.vue"),
        meta: {
          pageTitle: "Notificaciones",
          breadcrumbs: ["Sistema", "Notificaciones"],
          permissions: "notifications.view",
        },
      },
      // Inmate management routes
      {
        path: "/inmates",
        name: "inmates-list",
        component: () => import("@/modules/inmates/views/InmatesList.vue"),
        meta: {
          pageTitle: "Gestión de Internos",
          breadcrumbs: ["Internos"],
          permissions: "inmates.list",
        },
      },
      {
        path: "/inmates/biometric-verification",
        name: "inmates-biometric-verification",
        component: () => import("@/modules/inmates/views/BiometricVerification.vue"),
        meta: {
          pageTitle: "Identificación Biométrica 1:N",
          breadcrumbs: ["Internos", "Identificación Biométrica 1:N"],
          permissions: ["biometric.view", "biometric.identify"],
        },
      },
      {
        path: "/inmates/biometric-identification",
        name: "inmates-biometric-identification",
        component: () => import("@/components/biometric/BiometricIdentification.vue"),
        meta: {
          pageTitle: "Identificación Biométrica 1:N",
          breadcrumbs: ["Internos", "Identificación Biométrica"],
          permissions: ["biometric.view", "biometric.identify"],
        },
      },
      {
        path: "/test/direct-biometric",
        name: "test-direct-biometric",
        component: () => import("@/modules/test/DirectBiometricTest.vue"),
        meta: {
          pageTitle: "Test Directo Biométrico",
          breadcrumbs: ["Test", "Biométrico Directo"],
          permissions: ["biometric.view", "biometric.identify"],
        },
      },
      {
        path: "/inmates/create",
        name: "inmates-create",
        component: () => import("@/modules/operations/views/AdmissionWizard.vue"),
        meta: {
          pageTitle: "Proceso de Admisión de Interno",
          breadcrumbs: ["Internos", "Admisión"],
          permissions: "inmates.create",
        },
      },
      {
        path: "/inmates/:id",
        name: "inmates-detail",
        component: () => import("@/modules/inmates/views/InmateDetail.vue"),
        meta: {
          pageTitle: "Detalle del Interno",
          breadcrumbs: ["Internos", "Detalle"],
          permissions: "inmates.view",
        },
      },
      {
        path: "/inmates/:id/edit",
        name: "inmates-edit",
        component: () => import("@/modules/inmates/views/InmateEdit.vue"),
        meta: {
          pageTitle: "Editar Interno",
          breadcrumbs: ["Internos", "Editar"],
          permissions: "inmates.edit",
        },
      },
      {
        path: "/inmates/transfers",
        name: "inmates-transfers",
        component: () => import("@/modules/inmates/views/InmateTransfers.vue"),
        meta: {
          pageTitle: "Traslados de Internos",
          breadcrumbs: ["Internos", "Traslados"],
          permissions: "inmates.transfers",
        },
      },
      {
        path: "/inmates/legal-profiles",
        name: "inmates-legal-profiles",
        component: () =>
          import("@/modules/inmates/views/InmateLegalProfiles.vue"),
        meta: {
          pageTitle: "Perfiles Legales",
          breadcrumbs: ["Internos", "Perfiles Legales"],
          permissions: "inmates.legal",
        },
      },
      {
        path: "/inmates/security-classifications",
        name: "inmates-security-classifications",
        component: () =>
          import("@/modules/inmates/views/InmateSecurityClassifications.vue"),
        meta: {
          pageTitle: "Clasificaciones de Seguridad",
          breadcrumbs: ["Internos", "Clasificaciones de Seguridad"],
          permissions: "inmates.security",
        },
      },
      {
        path: "/inmates/physical-profiles",
        name: "inmates-physical-profiles",
        component: () =>
          import("@/modules/inmates/views/InmatePhysicalProfiles.vue"),
        meta: {
          pageTitle: "Perfiles Físicos",
          breadcrumbs: ["Internos", "Perfiles Físicos"],
          permissions: "inmates.physical",
        },
      },
      // Legal detail routes for specific inmate
      {
        path: "/inmates/:id/legal/:section?",
        name: "inmates-legal-detail",
        component: () =>
          import("@/modules/inmates/views/InmateLegalDetail.vue"),
        meta: {
          pageTitle: "Información Legal",
          breadcrumbs: ["Internos", "Información Legal"],
          permissions: "legal.view",
        },
      },
      // Operations routes
      {
        path: "/operations",
        name: "operations",
        redirect: "/operations/admissions",
        meta: {
          pageTitle: "Operaciones",
          breadcrumbs: ["Operaciones"],
          permissions: "operations.view",
        },
      },
      {
        path: "/operations/admissions",
        name: "operations-admissions",
        component: () => import("@/modules/operations/views/AdmissionProcess.vue"),
        meta: {
          pageTitle: "Gestión de Admisiones",
          breadcrumbs: ["Operaciones", "Admisiones"],
          permissions: "admissions.view",
        },
      },
      {
        path: "/operations/admissions/new",
        name: "operations-admissions-new",
        component: () => import("@/modules/operations/views/AdmissionNew.vue"),
        meta: {
          pageTitle: "Nueva Admisión",
          breadcrumbs: ["Operaciones", "Admisiones", "Nueva"],
          permissions: "admissions.create",
        },
      },
      {
        path: "/operations/admissions/:id",
        name: "operations-admissions-detail",
        component: () => import("@/modules/operations/views/AdmissionDetail.vue"),
        meta: {
          pageTitle: "Detalle de Admisión",
          breadcrumbs: ["Operaciones", "Admisiones", "Detalle"],
          permissions: "admissions.view",
        },
      },
      {
        path: "/operations/counts",
        name: "operations-counts",
        component: () => import("@/modules/operations/views/DailyCountManagement.vue"),
        meta: {
          pageTitle: "Conteo Diario",
          breadcrumbs: ["Operaciones", "Conteo Diario"],
          permissions: "counts.view",
        },
      },
      {
        path: "/operations/counts/history",
        name: "operations-counts-history",
        component: () => import("@/modules/operations/views/CountHistory.vue"),
        meta: {
          pageTitle: "Historial de Conteos",
          breadcrumbs: ["Operaciones", "Conteo Diario", "Historial"],
          permissions: "counts.view",
        },
      },
      {
        path: "/operations/counts/discrepancies",
        name: "operations-counts-discrepancies",
        component: () => import("@/modules/operations/views/CountDiscrepancies.vue"),
        meta: {
          pageTitle: "Discrepancias de Conteo",
          breadcrumbs: ["Operaciones", "Conteo Diario", "Discrepancias"],
          permissions: "counts.manage",
        },
      },
      {
        path: "/operations/movements",
        name: "operations-movements",
        component: () => import("@/modules/operations/views/MovementControl.vue"),
        meta: {
          pageTitle: "Control de Movimientos",
          breadcrumbs: ["Operaciones", "Movimientos"],
          permissions: "movements.view",
        },
      },
      {
        path: "/operations/movements/create",
        name: "operations-movements-create",
        component: () => import("@/modules/operations/views/MovementCreate.vue"),
        meta: {
          pageTitle: "Solicitar Movimiento",
          breadcrumbs: ["Operaciones", "Movimientos", "Solicitar"],
          permissions: "movements.create",
        },
      },
      {
        path: "/operations/movements/history",
        name: "operations-movements-history",
        component: () => import("@/modules/operations/views/MovementHistory.vue"),
        meta: {
          pageTitle: "Historial de Movimientos",
          breadcrumbs: ["Operaciones", "Movimientos", "Historial"],
          permissions: "movements.view",
        },
      },
      {
        path: "/operations/movements/:id",
        name: "operations-movements-detail",
        component: () => import("@/modules/operations/views/MovementDetail.vue"),
        meta: {
          pageTitle: "Detalle de Movimiento",
          breadcrumbs: ["Operaciones", "Movimientos", "Detalle"],
          permissions: "movements.view",
        },
      },
      {
        path: "/operations/releases",
        name: "operations-releases",
        component: () => import("@/modules/operations/views/ReleaseManagement.vue"),
        meta: {
          pageTitle: "Gestión de Liberaciones",
          breadcrumbs: ["Operaciones", "Liberaciones"],
          permissions: "releases.view",
        },
      },
      {
        path: "/operations/releases/plans",
        name: "operations-releases-plans",
        component: () => import("@/modules/operations/views/ReleasePlanning.vue"),
        meta: {
          pageTitle: "Planificación de Liberaciones",
          breadcrumbs: ["Operaciones", "Liberaciones", "Planificación"],
          permissions: "releases.plans.view",
        },
      },
      {
        path: "/operations/releases/plans/:id",
        name: "operations-releases-plans-detail",
        component: () => import("@/modules/operations/views/ReleasePlanDetail.vue"),
        meta: {
          pageTitle: "Detalle de Plan de Liberación",
          breadcrumbs: ["Operaciones", "Liberaciones", "Planificación", "Detalle"],
          permissions: "releases.plans.view",
        },
      },
      {
        path: "/operations/releases/history",
        name: "operations-releases-history",
        component: () => import("@/modules/operations/views/ReleaseHistory.vue"),
        meta: {
          pageTitle: "Historial de Liberaciones",
          breadcrumbs: ["Operaciones", "Liberaciones", "Historial"],
          permissions: "releases.view",
        },
      },
      {
        path: "/operations/releases/:id",
        name: "operations-releases-detail",
        component: () => import("@/modules/operations/views/ReleaseDetail.vue"),
        meta: {
          pageTitle: "Detalle de Liberación",
          breadcrumbs: ["Operaciones", "Liberaciones", "Detalle"],
          permissions: "releases.view",
        },
      },
      {
        path: "/operations/statistics",
        name: "operations-statistics",
        redirect: "/operations/statistics/dashboard",
        meta: {
          pageTitle: "Estadísticas Operativas",
          breadcrumbs: ["Operaciones", "Estadísticas"],
          permissions: "operations.statistics.view",
        },
      },
      {
        path: "/operations/statistics/dashboard",
        name: "operations-statistics-dashboard",
        component: () => import("@/modules/operations/views/OperationalDashboard.vue"),
        meta: {
          pageTitle: "Dashboard Operativo",
          breadcrumbs: ["Operaciones", "Estadísticas", "Dashboard"],
          permissions: "operations.statistics.view",
        },
      },
      {
        path: "/operations/statistics/reports",
        name: "operations-statistics-reports",
        component: () => import("@/modules/operations/views/OperationalReports.vue"),
        meta: {
          pageTitle: "Reportes Operativos",
          breadcrumbs: ["Operaciones", "Estadísticas", "Reportes"],
          permissions: "operations.reports.view",
        },
      },
      {
        path: "/operations/statistics/kpi",
        name: "operations-statistics-kpi",
        component: () => import("@/modules/operations/views/OperationalKPI.vue"),
        meta: {
          pageTitle: "Indicadores KPI",
          breadcrumbs: ["Operaciones", "Estadísticas", "KPI"],
          permissions: "operations.statistics.view",
        },
      },
      {
        path: "/operations/transfers",
        name: "operations-transfers",
        component: () => import("@/modules/operations/views/TransferManagement.vue"),
        meta: {
          pageTitle: "Gestión de Traslados",
          breadcrumbs: ["Operaciones", "Traslados"],
          permissions: "transfers.view",
        },
      },
      {
        path: "/operations/locations",
        name: "operations-locations",
        component: () => import("@/modules/operations/views/LocationManagement.vue"),
        meta: {
          pageTitle: "Gestión de Ubicaciones",
          breadcrumbs: ["Operaciones", "Ubicaciones"],
          permissions: "locations.view",
        },
      },
      // Visits routes
      {
        path: "/visits",
        name: "visits",
        redirect: "/visits/visitors",
        meta: {
          pageTitle: "Sistema de Visitas",
          breadcrumbs: ["Visitas"],
          permissions: "visits.view",
        },
      },
      {
        path: "/visits/visitor-management",
        name: "visits-visitor-management",
        component: () => import("@/modules/visits/views/VisitorRegistration.vue"),
        meta: {
          pageTitle: "Registro de Visitantes",
          breadcrumbs: ["Visitas", "Visitantes"],
          permissions: "visits.visitors.view",
        },
      },
      {
        path: "/visits/visitors/:id",
        name: "visits-visitors-detail",
        component: () => import("@/modules/visits/views/VisitorDetail.vue"),
        meta: {
          pageTitle: "Detalle de Visitante",
          breadcrumbs: ["Visitas", "Visitantes", "Detalle"],
          permissions: "visits.visitors.view",
        },
      },
      {
        path: "/visits/relationships",
        name: "visits-relationships",
        component: () => import("@/modules/visits/views/VisitorRelationships.vue"),
        meta: {
          pageTitle: "Relaciones de Visita",
          breadcrumbs: ["Visitas", "Relaciones"],
          permissions: "visits.relationships.view",
        },
      },
      {
        path: "/visits/relationships/:id",
        name: "visits-relationships-detail",
        component: () => import("@/modules/visits/views/RelationshipDetail.vue"),
        meta: {
          pageTitle: "Detalle de Relación",
          breadcrumbs: ["Visitas", "Relaciones", "Detalle"],
          permissions: "visits.relationships.view",
        },
      },
      {
        path: "/visits/requests",
        name: "visits-requests",
        component: () => import("@/modules/visits/views/VisitRequests.vue"),
        meta: {
          pageTitle: "Solicitudes de Visita",
          breadcrumbs: ["Visitas", "Solicitudes"],
          permissions: "visits.requests.view",
        },
      },
      {
        path: "/visits/requests/:id",
        name: "visits-requests-detail",
        component: () => import("@/modules/visits/views/VisitRequestDetail.vue"),
        meta: {
          pageTitle: "Detalle de Solicitud",
          breadcrumbs: ["Visitas", "Solicitudes", "Detalle"],
          permissions: "visits.requests.view",
        },
      },
      {
        path: "/visits/scheduling",
        name: "visits-scheduling",
        component: () => import("@/modules/visits/views/VisitScheduling.vue"),
        meta: {
          pageTitle: "Programación de Visitas",
          breadcrumbs: ["Visitas", "Programación"],
          permissions: "visits.scheduling.view",
        },
      },
      {
        path: "/visits/active",
        name: "visits-active",
        component: () => import("@/modules/visits/views/ActiveVisits.vue"),
        meta: {
          pageTitle: "Visitas Activas",
          breadcrumbs: ["Visitas", "Visitas Activas"],
          permissions: "visits.monitoring.view",
        },
      },
      {
        path: "/visits/biometric-control",
        name: "visits-biometric-control",
        component: () => import("@/modules/visits/views/BiometricControl.vue"),
        meta: {
          pageTitle: "Control Biométrico",
          breadcrumbs: ["Visitas", "Control Biométrico"],
          permissions: "visits.biometric.view",
        },
      },
      {
        path: "/visits/monitoring",
        name: "visits-monitoring",
        component: () => import("@/modules/visits/views/VisitMonitoring.vue"),
        meta: {
          pageTitle: "Monitoreo de Visitas",
          breadcrumbs: ["Visitas", "Monitoreo"],
          permissions: "visits.monitoring.view",
        },
      },
      {
        path: "/visits/reports",
        name: "visits-reports",
        component: () => import("@/modules/visits/views/VisitReports.vue"),
        meta: {
          pageTitle: "Reportes de Visitas",
          breadcrumbs: ["Visitas", "Reportes"],
          permissions: "visits.reports.view",
        },
      },
      {
        path: "/visits/statistics",
        name: "visits-statistics",
        component: () => import("@/modules/visits/views/VisitStatistics.vue"),
        meta: {
          pageTitle: "Estadísticas de Visitas",
          breadcrumbs: ["Visitas", "Estadísticas"],
          permissions: "visits.statistics.view",
        },
      },
      {
        path: "/visits/settings",
        name: "visits-settings",
        component: () => import("@/modules/visits/views/VisitSettings.vue"),
        meta: {
          pageTitle: "Configuración de Visitas",
          breadcrumbs: ["Visitas", "Configuración"],
          permissions: "visits.settings.manage",
        },
      },
      // Catalog routes
      {
        path: "/catalogs/countries",
        name: "catalogs-countries",
        component: () => import("@/modules/catalogs/views/Countries.vue"),
        meta: {
          pageTitle: "Países",
          breadcrumbs: ["Catálogos", "Países"],
          permissions: "catalogs.countries",
        },
      },
      {
        path: "/catalogs/departments",
        name: "catalogs-departments",
        component: () => import("@/modules/catalogs/views/Departments.vue"),
        meta: {
          pageTitle: "Departamentos",
          breadcrumbs: ["Catálogos", "Departamentos"],
          permissions: "catalogs.departments",
        },
      },
      {
        path: "/catalogs/municipalities",
        name: "catalogs-municipalities",
        component: () => import("@/modules/catalogs/views/Municipalities.vue"),
        meta: {
          pageTitle: "Municipios",
          breadcrumbs: ["Catálogos", "Municipios"],
          permissions: "catalogs.municipalities",
        },
      },
      {
        path: "/catalogs/academic-degrees",
        name: "catalogs-academic-degrees",
        component: () => import("@/modules/catalogs/views/AcademicDegrees.vue"),
        meta: {
          pageTitle: "Grados Académicos",
          breadcrumbs: ["Catálogos", "Grados Académicos"],
          permissions: "catalogs.academic_degrees",
        },
      },
      {
        path: "/catalogs/blood-types",
        name: "catalogs-blood-types",
        component: () => import("@/modules/catalogs/views/BloodTypes.vue"),
        meta: {
          pageTitle: "Tipos de Sangre",
          breadcrumbs: ["Catálogos", "Tipos de Sangre"],
          permissions: "catalogs.blood_types",
        },
      },
      {
        path: "/catalogs/centers",
        name: "catalogs-centers",
        component: () => import("@/modules/catalogs/views/Centers.vue"),
        meta: {
          pageTitle: "Centros",
          breadcrumbs: ["Catálogos", "Centros"],
          permissions: "catalogs.centers",
        },
      },
      {
        path: "/catalogs/locations",
        redirect: "/catalogs/centers",
      },
      {
        path: "/catalogs/sectors",
        name: "catalogs-sectors",
        component: () => import("@/modules/catalogs/views/Sectors.vue"),
        meta: {
          pageTitle: "Sectores",
          breadcrumbs: ["Catálogos", "Sectores"],
          permissions: "catalogs.sectors",
        },
      },
      {
        path: "/catalogs/ethnic-groups",
        name: "catalogs-ethnic-groups",
        component: () => import("@/modules/catalogs/views/EthnicGroups.vue"),
        meta: {
          pageTitle: "Grupos Étnicos",
          breadcrumbs: ["Catálogos", "Grupos Étnicos"],
          permissions: "catalogs.ethnic_groups",
        },
      },
      {
        path: "/catalogs/civil-statuses",
        name: "catalogs-civil-statuses",
        component: () => import("@/modules/catalogs/views/CivilStatuses.vue"),
        meta: {
          pageTitle: "Estados Civiles",
          breadcrumbs: ["Catálogos", "Estados Civiles"],
          permissions: "catalogs.civil_statuses",
        },
      },
      {
        path: "/catalogs/crimes",
        name: "catalogs-crimes",
        component: () => import("@/modules/catalogs/views/Crimes.vue"),
        meta: {
          pageTitle: "Delitos",
          breadcrumbs: ["Catálogos", "Delitos"],
          permissions: "catalogs.crimes",
        },
      },
      {
        path: "/catalogs/courts",
        name: "catalogs-courts",
        component: () => import("@/modules/catalogs/views/Courts.vue"),
        meta: {
          pageTitle: "Juzgados",
          breadcrumbs: ["Catálogos", "Juzgados"],
          permissions: "catalogs.courts",
        },
      },
      {
        path: "/catalogs/sentence-types",
        name: "catalogs-sentence-types",
        component: () => import("@/modules/catalogs/views/SentenceTypes.vue"),
        meta: {
          pageTitle: "Tipos de Sentencia",
          breadcrumbs: ["Catálogos", "Tipos de Sentencia"],
          permissions: "catalogs.sentence_types",
        },
      },
      {
        path: "/catalogs/procedural-statuses",
        name: "catalogs-procedural-statuses",
        component: () =>
          import("@/modules/catalogs/views/ProceduralStatuses.vue"),
        meta: {
          pageTitle: "Estados Procesales",
          breadcrumbs: ["Catálogos", "Estados Procesales"],
          permissions: "catalogs.procedural_statuses",
        },
      },
      {
        path: "/catalogs/religions",
        name: "catalogs-religions",
        component: () => import("@/modules/catalogs/views/Religions.vue"),
        meta: {
          pageTitle: "Religiones",
          breadcrumbs: ["Catálogos", "Religiones"],
          permissions: "catalogs.religions",
        },
      },
      {
        path: "/catalogs/document-types",
        name: "catalogs-document-types",
        component: () => import("@/modules/catalogs/views/DocumentTypes.vue"),
        meta: {
          pageTitle: "Tipos de Documento",
          breadcrumbs: ["Catálogos", "Tipos de Documento"],
          permissions: "catalogs.document_types",
        },
      },
      {
        path: "/catalogs/risk-classifications",
        name: "catalogs-risk-classifications",
        component: () =>
          import("@/modules/catalogs/views/RiskClassifications.vue"),
        meta: {
          pageTitle: "Clasificaciones de Riesgo",
          breadcrumbs: ["Catálogos", "Clasificaciones de Riesgo"],
          permissions: "catalogs.risk_classifications",
        },
      },
      {
        path: "/catalogs/progressive-phases",
        name: "catalogs-progressive-phases",
        component: () =>
          import("@/modules/catalogs/views/ProgressivePhases.vue"),
        meta: {
          pageTitle: "Fases Progresivas",
          breadcrumbs: ["Catálogos", "Fases Progresivas"],
          permissions: "catalogs.progressive_phases",
        },
      },
      {
        path: "/catalogs/exit-reasons",
        name: "catalogs-exit-reasons",
        component: () => import("@/modules/catalogs/views/ExitReasons.vue"),
        meta: {
          pageTitle: "Motivos de Egreso",
          breadcrumbs: ["Catálogos", "Motivos de Egreso"],
          permissions: "catalogs.exit_reasons",
        },
      },
      {
        path: "/catalogs/allergies",
        name: "catalogs-allergies",
        component: () => import("@/modules/catalogs/views/Allergies.vue"),
        meta: {
          pageTitle: "Alergias",
          breadcrumbs: ["Catálogos", "Alergias"],
          permissions: "catalogs.allergies",
        },
      },
      {
        path: "/catalogs/benefit-types",
        name: "catalogs-benefit-types",
        component: () => import("@/modules/catalogs/views/BenefitTypes.vue"),
        meta: {
          pageTitle: "Tipos de Beneficio",
          breadcrumbs: ["Catálogos", "Tipos de Beneficio"],
          permissions: "catalogs.benefit_types",
        },
      },
      {
        path: "/catalogs/chronic-diseases",
        name: "catalogs-chronic-diseases",
        component: () => import("@/modules/catalogs/views/ChronicDiseases.vue"),
        meta: {
          pageTitle: "Enfermedades Crónicas",
          breadcrumbs: ["Catálogos", "Enfermedades Crónicas"],
          permissions: "catalogs.chronic_diseases",
        },
      },
      {
        path: "/catalogs/crime-classifications",
        name: "catalogs-crime-classifications",
        component: () =>
          import("@/modules/catalogs/views/CrimeClassifications.vue"),
        meta: {
          pageTitle: "Clasificaciones de Delitos",
          breadcrumbs: ["Catálogos", "Clasificaciones de Delitos"],
          permissions: "catalogs.crime_classifications",
        },
      },
      {
        path: "/catalogs/disabilities",
        name: "catalogs-disabilities",
        component: () => import("@/modules/catalogs/views/Disabilities.vue"),
        meta: {
          pageTitle: "Discapacidades",
          breadcrumbs: ["Catálogos", "Discapacidades"],
          permissions: "catalogs.disabilities",
        },
      },
      {
        path: "/catalogs/disciplinary-sanctions",
        name: "catalogs-disciplinary-sanctions",
        component: () =>
          import("@/modules/catalogs/views/DisciplinarySanctions.vue"),
        meta: {
          pageTitle: "Sanciones Disciplinarias",
          breadcrumbs: ["Catálogos", "Sanciones Disciplinarias"],
          permissions: "catalogs.disciplinary_sanctions",
        },
      },
      {
        path: "/catalogs/languages",
        name: "catalogs-languages",
        component: () => import("@/modules/catalogs/views/Languages.vue"),
        meta: {
          pageTitle: "Idiomas",
          breadcrumbs: ["Catálogos", "Idiomas"],
          permissions: "catalogs.languages",
        },
      },
      {
        path: "/catalogs/measure-types",
        name: "catalogs-measure-types",
        component: () => import("@/modules/catalogs/views/MeasureTypes.vue"),
        meta: {
          pageTitle: "Tipos de Medida",
          breadcrumbs: ["Catálogos", "Tipos de Medida"],
          permissions: "catalogs.measure_types",
        },
      },
      {
        path: "/catalogs/mental-health-statuses",
        name: "catalogs-mental-health-statuses",
        component: () =>
          import("@/modules/catalogs/views/MentalHealthStatuses.vue"),
        meta: {
          pageTitle: "Estados de Salud Mental",
          breadcrumbs: ["Catálogos", "Estados de Salud Mental"],
          permissions: "catalogs.mental_health_statuses",
        },
      },
      {
        path: "/catalogs/nationalities",
        name: "catalogs-nationalities",
        component: () => import("@/modules/catalogs/views/Nationalities.vue"),
        meta: {
          pageTitle: "Nacionalidades",
          breadcrumbs: ["Catálogos", "Nacionalidades"],
          permissions: "catalogs.nationalities",
        },
      },
      {
        path: "/catalogs/occupations",
        name: "catalogs-occupations",
        component: () => import("@/modules/catalogs/views/Occupations.vue"),
        meta: {
          pageTitle: "Ocupaciones",
          breadcrumbs: ["Catálogos", "Ocupaciones"],
          permissions: "catalogs.occupations",
        },
      },
      {
        path: "/catalogs/rehabilitation-programs",
        name: "catalogs-rehabilitation-programs",
        component: () =>
          import("@/modules/catalogs/views/RehabilitationPrograms.vue"),
        meta: {
          pageTitle: "Programas de Rehabilitación",
          breadcrumbs: ["Catálogos", "Programas de Rehabilitación"],
          permissions: "catalogs.rehabilitation_programs",
        },
      },
      {
        path: "/catalogs/socioeconomic-levels",
        name: "catalogs-socioeconomic-levels",
        component: () =>
          import("@/modules/catalogs/views/SocioeconomicLevels.vue"),
        meta: {
          pageTitle: "Niveles Socioeconómicos",
          breadcrumbs: ["Catálogos", "Niveles Socioeconómicos"],
          permissions: "catalogs.socioeconomic_levels",
        },
      },
      {
        path: "/catalogs/transfer-reasons",
        name: "catalogs-transfer-reasons",
        component: () => import("@/modules/catalogs/views/TransferReasons.vue"),
        meta: {
          pageTitle: "Motivos de Traslado",
          breadcrumbs: ["Catálogos", "Motivos de Traslado"],
          permissions: "catalogs.transfer_reasons",
        },
      },
      {
        path: "/catalogs/visit-types",
        name: "catalogs-visit-types",
        component: () => import("@/modules/catalogs/views/VisitTypes.vue"),
        meta: {
          pageTitle: "Tipos de Visita",
          breadcrumbs: ["Catálogos", "Tipos de Visita"],
          permissions: "catalogs.visit_types",
        },
      },
      {
        path: "/quick-access",
        name: "quick-access",
        component: () => import("@/views/QuickAccess.vue"),
        meta: {
          pageTitle: "Accesos Rápidos",
          breadcrumbs: ["Panel", "Accesos Rápidos"],
        },
      },
      // Inmates additional routes
      {
        path: "/inmates/search",
        name: "inmates-search",
        component: () => import("@/modules/inmates/views/InmateSearch.vue"),
        meta: {
          pageTitle: "Buscar Internos",
          breadcrumbs: ["Internos", "Buscar"],
          permissions: "inmates.search",
        },
      },
      // Legal Module routes
      {
        path: "/legal",
        name: "legal",
        redirect: "/legal/profiles",
        meta: {
          pageTitle: "Gestión Legal",
          breadcrumbs: ["Legal"],
          permissions: "legal.view",
        },
      },
      {
        path: "/legal/profiles",
        name: "legal-profiles",
        component: () => import("@/modules/legal/views/LegalProfiles.vue"),
        meta: {
          pageTitle: "Perfiles Legales",
          breadcrumbs: ["Legal", "Perfiles"],
          permissions: "legal.profiles",
        },
      },
      {
        path: "/legal/profiles/:id",
        name: "legal-profile-detail",
        component: () => import("@/modules/legal/views/LegalProfileDetail.vue"),
        meta: {
          pageTitle: "Detalle del Perfil Legal",
          breadcrumbs: ["Legal", "Perfiles", "Detalle"],
          permissions: "legal.profiles",
        },
      },
      {
        path: "/legal/profiles/:id/edit",
        name: "legal-profile-edit",
        component: () => import("@/modules/legal/views/LegalProfileEdit.vue"),
        meta: {
          pageTitle: "Editar Perfil Legal",
          breadcrumbs: ["Legal", "Perfiles", "Editar"],
          permissions: "legal.profiles.edit",
        },
      },
      {
        path: "/legal/profiles/:id/timeline",
        name: "legal-profile-timeline",
        component: () => import("@/modules/legal/views/LegalProfileTimeline.vue"),
        meta: {
          pageTitle: "Línea de Tiempo",
          breadcrumbs: ["Legal", "Perfiles", "Timeline"],
          permissions: "legal.profiles",
        },
      },
      {
        path: "/legal/crimes",
        name: "legal-crimes",
        component: () => import("@/modules/legal/views/Crimes.vue"),
        meta: {
          pageTitle: "Delitos",
          breadcrumbs: ["Legal", "Delitos"],
          permissions: "legal.crimes",
        },
      },
      {
        path: "/legal/hearings",
        name: "legal-hearings",
        component: () => import("@/modules/legal/views/Hearings.vue"),
        meta: {
          pageTitle: "Audiencias",
          breadcrumbs: ["Legal", "Audiencias"],
          permissions: "legal.hearings",
        },
      },
      {
        path: "/legal/resolutions",
        name: "legal-resolutions",
        component: () => import("@/modules/legal/views/Resolutions.vue"),
        meta: {
          pageTitle: "Resoluciones",
          breadcrumbs: ["Legal", "Resoluciones"],
          permissions: "legal.resolutions",
        },
      },
      {
        path: "/legal/appeals",
        name: "legal-appeals",
        component: () => import("@/modules/legal/views/Appeals.vue"),
        meta: {
          pageTitle: "Apelaciones",
          breadcrumbs: ["Legal", "Apelaciones"],
          permissions: "legal.appeals",
        },
      },
      {
        path: "/legal/deadlines",
        name: "legal-deadlines",
        component: () => import("@/modules/legal/views/Deadlines.vue"),
        meta: {
          pageTitle: "Plazos",
          breadcrumbs: ["Legal", "Plazos"],
          permissions: "legal.deadlines",
        },
      },
      {
        path: "/legal/measures",
        name: "legal-measures",
        component: () => import("@/modules/legal/views/Measures.vue"),
        meta: {
          pageTitle: "Medidas",
          breadcrumbs: ["Legal", "Medidas"],
          permissions: "legal.measures",
        },
      },
      {
        path: "/legal/benefits",
        name: "legal-benefits",
        component: () => import("@/modules/legal/views/Benefits.vue"),
        meta: {
          pageTitle: "Beneficios",
          breadcrumbs: ["Legal", "Beneficios"],
          permissions: "legal.benefits",
        },
      },
      // Security Module routes
      {
        path: "/security",
        name: "security",
        redirect: "/security/physical-profiles",
        meta: {
          pageTitle: "Gestión de Seguridad",
          breadcrumbs: ["Seguridad"],
          permissions: "security.view",
        },
      },
      {
        path: "/security/physical-profiles",
        name: "security-physical-profiles",
        component: () => import("@/modules/security/views/PhysicalProfiles.vue"),
        meta: {
          pageTitle: "Perfiles Físicos",
          breadcrumbs: ["Seguridad", "Perfiles Físicos"],
          permissions: "security.physical_profiles",
        },
      },
      {
        path: "/security/physical-profiles/:inmateId",
        name: "security-physical-profile-detail",
        component: () => import("@/modules/security/views/PhysicalProfileDetail.vue"),
        meta: {
          pageTitle: "Detalle Perfil Físico",
          breadcrumbs: ["Seguridad", "Perfiles Físicos", "Detalle"],
          permissions: "security.physical_profiles",
        },
      },
      {
        path: "/security/physical-profiles/:inmateId/edit",
        name: "security-physical-profile-edit",
        component: () => import("@/modules/security/views/PhysicalProfileEdit.vue"),
        meta: {
          pageTitle: "Editar Perfil Físico",
          breadcrumbs: ["Seguridad", "Perfiles Físicos", "Editar"],
          permissions: "security.physical_profiles.edit",
        },
      },
      {
        path: "/security/biometric/:inmateId",
        name: "security-biometric-capture",
        component: () => import("@/modules/security/views/BiometricCapture.vue"),
        meta: {
          pageTitle: "Captura Biométrica",
          breadcrumbs: ["Seguridad", "Captura Biométrica"],
          permissions: ["biometric.view", "biometric.enroll"],
        },
      },
      {
        path: "/security/photo/:inmateId",
        name: "security-physical-profile-photo",
        component: () => import("@/modules/security/views/PhotoCapture.vue"),
        meta: {
          pageTitle: "Captura de Fotografías",
          breadcrumbs: ["Seguridad", "Fotografías"],
          permissions: "security.photos",
        },
      },
      {
        path: "/security/classifications",
        name: "security-classifications",
        component: () => import("@/modules/security/views/SecurityClassifications.vue"),
        meta: {
          pageTitle: "Clasificaciones de Seguridad",
          breadcrumbs: ["Seguridad", "Clasificaciones"],
          permissions: "security.classifications",
        },
      },
      {
        path: "/security/gang-affiliations",
        name: "security-gang-affiliations",
        component: () => import("@/modules/security/views/GangAffiliations.vue"),
        meta: {
          pageTitle: "Afiliaciones a Pandillas",
          breadcrumbs: ["Seguridad", "Pandillas"],
          permissions: "security.gangs",
        },
      },
      {
        path: "/security/incidents",
        name: "security-incidents",
        component: () => import("@/modules/security/views/SecurityIncidents.vue"),
        meta: {
          pageTitle: "Incidentes de Seguridad",
          breadcrumbs: ["Seguridad", "Incidentes"],
          permissions: "security.incidents",
        },
      },
      {
        path: "/security/alerts",
        name: "security-alerts",
        component: () => import("@/modules/security/views/SecurityAlerts.vue"),
        meta: {
          pageTitle: "Alertas de Seguridad",
          breadcrumbs: ["Seguridad", "Alertas"],
          permissions: "security.alerts",
        },
      },
      {
        path: "/security/monitoring",
        name: "security-monitoring",
        component: () => import("@/modules/security/views/CommunicationMonitoring.vue"),
        meta: {
          pageTitle: "Monitoreo de Comunicaciones",
          breadcrumbs: ["Seguridad", "Monitoreo"],
          permissions: "security.monitoring",
        },
      },
      {
        path: "/security/reports",
        name: "security-reports",
        component: () => import("@/modules/security/views/SecurityReports.vue"),
        meta: {
          pageTitle: "Reportes de Seguridad",
          breadcrumbs: ["Seguridad", "Reportes"],
          permissions: "security.reports",
        },
      },
      // Medical Module routes
      {
        path: "/medical",
        name: "medical",
        redirect: "/medical/profiles",
        meta: {
          pageTitle: "Gestión Médica",
          breadcrumbs: ["Médico"],
          permissions: "medical.view",
        },
      },
      {
        path: "/medical/profiles",
        name: "medical-profiles",
        component: () => import("@/modules/medical/views/MedicalProfiles.vue"),
        meta: {
          pageTitle: "Perfiles Médicos",
          breadcrumbs: ["Médico", "Perfiles"],
          permissions: "medical.profiles",
        },
      },
      {
        path: "/medical/consultations",
        name: "medical-consultations",
        component: () => import("@/modules/medical/views/Consultations.vue"),
        meta: {
          pageTitle: "Consultas",
          breadcrumbs: ["Médico", "Consultas"],
          permissions: "medical.consultations",
        },
      },
      {
        path: "/medical/treatments",
        name: "medical-treatments",
        component: () => import("@/modules/medical/views/Treatments.vue"),
        meta: {
          pageTitle: "Tratamientos",
          breadcrumbs: ["Médico", "Tratamientos"],
          permissions: "medical.treatments",
        },
      },
      {
        path: "/medical/prescriptions",
        name: "medical-prescriptions",
        component: () => import("@/modules/medical/views/Prescriptions.vue"),
        meta: {
          pageTitle: "Prescripciones",
          breadcrumbs: ["Médico", "Prescripciones"],
          permissions: "medical.prescriptions",
        },
      },
      {
        path: "/medical/mental-health",
        name: "medical-mental-health",
        component: () => import("@/modules/medical/views/MentalHealth.vue"),
        meta: {
          pageTitle: "Salud Mental",
          breadcrumbs: ["Médico", "Salud Mental"],
          permissions: "medical.mental_health",
        },
      },
      {
        path: "/medical/vaccinations",
        name: "medical-vaccinations",
        component: () => import("@/modules/medical/views/Vaccinations.vue"),
        meta: {
          pageTitle: "Vacunaciones",
          breadcrumbs: ["Médico", "Vacunaciones"],
          permissions: "medical.vaccinations",
        },
      },
      {
        path: "/medical/emergencies",
        name: "medical-emergencies",
        component: () => import("@/modules/medical/views/Emergencies.vue"),
        meta: {
          pageTitle: "Emergencias Médicas",
          breadcrumbs: ["Médico", "Emergencias"],
          permissions: "medical.emergency",
        },
      },
      // Security Module routes
      {
        path: "/security",
        name: "security",
        redirect: "/security/classifications",
        meta: {
          pageTitle: "Gestión de Seguridad",
          breadcrumbs: ["Seguridad"],
          permissions: "security.view",
        },
      },
      {
        path: "/security/classifications",
        name: "security-classifications",
        component: () => import("@/modules/security/views/Classifications.vue"),
        meta: {
          pageTitle: "Clasificaciones",
          breadcrumbs: ["Seguridad", "Clasificaciones"],
          permissions: "security.classifications",
        },
      },
      {
        path: "/security/incidents",
        name: "security-incidents",
        component: () => import("@/modules/security/views/Incidents.vue"),
        meta: {
          pageTitle: "Incidentes",
          breadcrumbs: ["Seguridad", "Incidentes"],
          permissions: "security.incidents",
        },
      },
      {
        path: "/security/gangs",
        name: "security-gangs",
        component: () => import("@/modules/security/views/Gangs.vue"),
        meta: {
          pageTitle: "Pandillas",
          breadcrumbs: ["Seguridad", "Pandillas"],
          permissions: "security.gangs",
        },
      },
      {
        path: "/security/monitoring",
        name: "security-monitoring",
        component: () => import("@/modules/security/views/Monitoring.vue"),
        meta: {
          pageTitle: "Monitoreo",
          breadcrumbs: ["Seguridad", "Monitoreo"],
          permissions: "security.monitoring",
        },
      },
      {
        path: "/security/alerts",
        name: "security-alerts",
        component: () => import("@/modules/security/views/Alerts.vue"),
        meta: {
          pageTitle: "Alertas",
          breadcrumbs: ["Seguridad", "Alertas"],
          permissions: "security.alerts",
        },
      },
      {
        path: "/security/physical-profiles",
        name: "security-physical-profiles",
        component: () => import("@/modules/security/views/PhysicalProfiles.vue"),
        meta: {
          pageTitle: "Perfiles Físicos",
          breadcrumbs: ["Seguridad", "Perfiles Físicos"],
          permissions: "security.physical",
        },
      },
      // Rehabilitation Module routes
      {
        path: "/rehabilitation",
        name: "rehabilitation",
        redirect: "/rehabilitation/programs",
        meta: {
          pageTitle: "Rehabilitación",
          breadcrumbs: ["Rehabilitación"],
          permissions: "programs.view",
        },
      },
      {
        path: "/rehabilitation/programs",
        name: "rehabilitation-programs",
        component: () => import("@/modules/rehabilitation/views/Programs.vue"),
        meta: {
          pageTitle: "Programas",
          breadcrumbs: ["Rehabilitación", "Programas"],
          permissions: "programs.view",
        },
      },
      {
        path: "/rehabilitation/enrollments",
        name: "rehabilitation-enrollments",
        component: () => import("@/modules/rehabilitation/views/Enrollments.vue"),
        meta: {
          pageTitle: "Inscripciones",
          breadcrumbs: ["Rehabilitación", "Inscripciones"],
          permissions: "programs.enrollment",
        },
      },
      {
        path: "/rehabilitation/progress",
        name: "rehabilitation-progress",
        component: () => import("@/modules/rehabilitation/views/Progress.vue"),
        meta: {
          pageTitle: "Progreso",
          breadcrumbs: ["Rehabilitación", "Progreso"],
          permissions: "programs.progress",
        },
      },
      {
        path: "/rehabilitation/certificates",
        name: "rehabilitation-certificates",
        component: () => import("@/modules/rehabilitation/views/Certificates.vue"),
        meta: {
          pageTitle: "Certificados",
          breadcrumbs: ["Rehabilitación", "Certificados"],
          permissions: "programs.certificates",
        },
      },
      // Work sub-module
      {
        path: "/rehabilitation/work",
        name: "rehabilitation-work",
        redirect: "/rehabilitation/work/assignments",
        meta: {
          pageTitle: "Trabajo",
          breadcrumbs: ["Rehabilitación", "Trabajo"],
          permissions: "work.view",
        },
      },
      {
        path: "/rehabilitation/work/assignments",
        name: "work-assignments",
        component: () => import("@/modules/rehabilitation/views/work/Assignments.vue"),
        meta: {
          pageTitle: "Asignaciones",
          breadcrumbs: ["Rehabilitación", "Trabajo", "Asignaciones"],
          permissions: "work.assignments",
        },
      },
      {
        path: "/rehabilitation/work/attendance",
        name: "work-attendance",
        component: () => import("@/modules/rehabilitation/views/work/Attendance.vue"),
        meta: {
          pageTitle: "Asistencia",
          breadcrumbs: ["Rehabilitación", "Trabajo", "Asistencia"],
          permissions: "work.attendance",
        },
      },
      {
        path: "/rehabilitation/work/evaluations",
        name: "work-evaluations",
        component: () => import("@/modules/rehabilitation/views/work/Evaluations.vue"),
        meta: {
          pageTitle: "Evaluaciones",
          breadcrumbs: ["Rehabilitación", "Trabajo", "Evaluaciones"],
          permissions: "work.evaluations",
        },
      },
      // Education sub-module
      {
        path: "/rehabilitation/education",
        name: "rehabilitation-education",
        redirect: "/rehabilitation/education/literacy",
        meta: {
          pageTitle: "Educación",
          breadcrumbs: ["Rehabilitación", "Educación"],
          permissions: "education.view",
        },
      },
      {
        path: "/rehabilitation/education/literacy",
        name: "education-literacy",
        component: () => import("@/modules/rehabilitation/views/education/Literacy.vue"),
        meta: {
          pageTitle: "Alfabetización",
          breadcrumbs: ["Rehabilitación", "Educación", "Alfabetización"],
          permissions: "education.literacy",
        },
      },
      {
        path: "/rehabilitation/education/basic",
        name: "education-basic",
        component: () => import("@/modules/rehabilitation/views/education/Basic.vue"),
        meta: {
          pageTitle: "Educación Básica",
          breadcrumbs: ["Rehabilitación", "Educación", "Básica"],
          permissions: "education.basic",
        },
      },
      {
        path: "/rehabilitation/education/higher",
        name: "education-higher",
        component: () => import("@/modules/rehabilitation/views/education/Higher.vue"),
        meta: {
          pageTitle: "Educación Superior",
          breadcrumbs: ["Rehabilitación", "Educación", "Superior"],
          permissions: "education.higher",
        },
      },
      // Documents Module routes
      {
        path: "/documents",
        name: "documents",
        redirect: "/documents/files",
        meta: {
          pageTitle: "Gestión Documental",
          breadcrumbs: ["Documentos"],
          permissions: "documents.view",
        },
      },
      {
        path: "/documents/files",
        name: "documents-files",
        component: () => import("@/modules/documents/views/DigitalFiles.vue"),
        meta: {
          pageTitle: "Archivos Digitales",
          breadcrumbs: ["Documentos", "Archivos"],
          permissions: "documents.files",
        },
      },
      {
        path: "/documents/legal",
        name: "documents-legal",
        component: () => import("@/modules/documents/views/LegalDocuments.vue"),
        meta: {
          pageTitle: "Documentos Legales",
          breadcrumbs: ["Documentos", "Legales"],
          permissions: "documents.legal",
        },
      },
      {
        path: "/documents/medical",
        name: "documents-medical",
        component: () => import("@/modules/documents/views/MedicalDocuments.vue"),
        meta: {
          pageTitle: "Documentos Médicos",
          breadcrumbs: ["Documentos", "Médicos"],
          permissions: "documents.medical",
        },
      },
      {
        path: "/documents/correspondence",
        name: "documents-correspondence",
        component: () => import("@/modules/documents/views/Correspondence.vue"),
        meta: {
          pageTitle: "Correspondencia",
          breadcrumbs: ["Documentos", "Correspondencia"],
          permissions: "mail.view",
        },
      },
      // Emergency Module routes
      {
        path: "/emergency",
        name: "emergency",
        redirect: "/emergency/incidents",
        meta: {
          pageTitle: "Gestión de Emergencias",
          breadcrumbs: ["Emergencias"],
          permissions: "emergency.view",
        },
      },
      {
        path: "/emergency/incidents",
        name: "emergency-incidents",
        component: () => import("@/modules/emergency/views/Incidents.vue"),
        meta: {
          pageTitle: "Incidentes",
          breadcrumbs: ["Emergencias", "Incidentes"],
          permissions: "emergency.incidents",
        },
      },
      {
        path: "/emergency/protocols",
        name: "emergency-protocols",
        component: () => import("@/modules/emergency/views/Protocols.vue"),
        meta: {
          pageTitle: "Protocolos",
          breadcrumbs: ["Emergencias", "Protocolos"],
          permissions: "emergency.protocols",
        },
      },
      {
        path: "/emergency/teams",
        name: "emergency-teams",
        component: () => import("@/modules/emergency/views/ResponseTeams.vue"),
        meta: {
          pageTitle: "Equipos de Respuesta",
          breadcrumbs: ["Emergencias", "Equipos"],
          permissions: "emergency.teams",
        },
      },
      {
        path: "/emergency/evacuations",
        name: "emergency-evacuations",
        component: () => import("@/modules/emergency/views/Evacuations.vue"),
        meta: {
          pageTitle: "Evacuaciones",
          breadcrumbs: ["Emergencias", "Evacuaciones"],
          permissions: "emergency.evacuations",
        },
      },
      // Report routes
      {
        path: "/reports",
        name: "reports",
        redirect: "/reports/inmates",
        meta: {
          pageTitle: "Reportes",
          breadcrumbs: ["Reportes"],
          permissions: "reports.view",
        },
      },
      {
        path: "/reports/inmates",
        name: "reports-inmates",
        component: () => import("@/modules/reports/views/InmateReports.vue"),
        meta: {
          pageTitle: "Reportes de Internos",
          breadcrumbs: ["Reportes", "Internos"],
          permissions: "reports.inmates",
        },
      },
      {
        path: "/reports/legal",
        name: "reports-legal",
        component: () => import("@/modules/reports/views/LegalReports.vue"),
        meta: {
          pageTitle: "Reportes Legales",
          breadcrumbs: ["Reportes", "Legal"],
          permissions: "reports.legal",
        },
      },
      {
        path: "/reports/medical",
        name: "reports-medical",
        component: () => import("@/modules/reports/views/MedicalReports.vue"),
        meta: {
          pageTitle: "Reportes Médicos",
          breadcrumbs: ["Reportes", "Médico"],
          permissions: "reports.medical",
        },
      },
      {
        path: "/reports/security",
        name: "reports-security",
        component: () => import("@/modules/reports/views/SecurityReports.vue"),
        meta: {
          pageTitle: "Reportes de Seguridad",
          breadcrumbs: ["Reportes", "Seguridad"],
          permissions: "reports.security",
        },
      },
      {
        path: "/reports/operations",
        name: "reports-operations",
        component: () => import("@/modules/reports/views/OperationsReports.vue"),
        meta: {
          pageTitle: "Reportes de Operaciones",
          breadcrumbs: ["Reportes", "Operaciones"],
          permissions: "reports.operations",
        },
      },
      {
        path: "/reports/statistical",
        name: "reports-statistical",
        component: () => import("@/modules/reports/views/StatisticalReports.vue"),
        meta: {
          pageTitle: "Reportes Estadísticos",
          breadcrumbs: ["Reportes", "Estadísticos"],
          permissions: "reports.statistical",
        },
      },
      {
        path: "/reports/user-activity",
        name: "reports-user-activity",
        component: () =>
          import("@/modules/reports/views/UserActivityReport.vue"),
        meta: {
          pageTitle: "Reporte de Actividad de Usuarios",
          breadcrumbs: ["Reportes", "Actividad de Usuarios"],
          permissions: "reports.user_activity",
        },
      },
      {
        path: "/reports/system-logs",
        name: "reports-system-logs",
        component: () => import("@/modules/reports/views/SystemLogsReport.vue"),
        meta: {
          pageTitle: "Reporte de Logs del Sistema",
          breadcrumbs: ["Reportes", "Logs del Sistema"],
          permissions: "reports.system_logs",
        },
      },
      {
        path: "/system/cache",
        name: "cache-monitor",
        component: () => import("@/views/CacheMonitor.vue"),
        meta: {
          pageTitle: "Monitor de Cache",
          breadcrumbs: ["Sistema", "Monitor de Cache"],
          permissions: "settings.system",
        },
      },
      {
        path: "/system/jobs",
        name: "jobs-monitor",
        component: () => import("@/views/JobsMonitor.vue"),
        meta: {
          pageTitle: "Monitor de Jobs",
          breadcrumbs: ["Sistema", "Monitor de Jobs"],
          permissions: "settings.system",
        },
      },
      {
        path: "/system/sessions",
        name: "session-manager",
        component: () => import("@/views/SessionManager.vue"),
        meta: {
          pageTitle: "Gestor de Sesiones",
          breadcrumbs: ["Sistema", "Gestor de Sesiones"],
          permissions: "settings.system",
        },
      },
      // Additional Administration routes
      {
        path: "/settings/backups",
        name: "settings-backups",
        component: () => import("@/modules/settings/views/Backups.vue"),
        meta: {
          pageTitle: "Respaldos",
          breadcrumbs: ["Configuración", "Respaldos"],
          permissions: "backup.manage",
        },
      },
      {
        path: "/system/audit",
        name: "system-audit",
        component: () => import("@/modules/system/views/AuditLogs.vue"),
        meta: {
          pageTitle: "Logs de Auditoría",
          breadcrumbs: ["Sistema", "Auditoría"],
          permissions: "audit.view",
        },
      },
      {
        path: "/system/notifications",
        name: "system-notifications",
        component: () => import("@/modules/system/views/SystemNotifications.vue"),
        meta: {
          pageTitle: "Notificaciones del Sistema",
          breadcrumbs: ["Sistema", "Notificaciones"],
          permissions: "notifications.send",
        },
      },
      {
        path: "/test/notifications",
        name: "test-notifications",
        component: () => import("@/views/TestNotifications.vue"),
        meta: {
          pageTitle: "Pruebas de Notificaciones",
          breadcrumbs: ["Desarrollo", "Pruebas", "Notificaciones"],
        },
      },
      {
        path: "/builder",
        name: "builder",
        component: () => import("@/views/LayoutBuilder.vue"),
        meta: {
          pageTitle: "Layout Builder",
          breadcrumbs: ["Layout"],
        },
      },
      {
        path: "/crafted/pages/profile",
        name: "profile",
        component: () => import("@/components/page-layouts/Profile.vue"),
        meta: {
          breadcrumbs: ["Pages", "Profile"],
        },
        children: [
          {
            path: "overview",
            name: "profile-overview",
            component: () =>
              import("@/views/crafted/pages/profile/Overview.vue"),
            meta: {
              pageTitle: "Overview",
            },
          },
          {
            path: "projects",
            name: "profile-projects",
            component: () =>
              import("@/views/crafted/pages/profile/Projects.vue"),
            meta: {
              pageTitle: "Projects",
            },
          },
          {
            path: "campaigns",
            name: "profile-campaigns",
            component: () =>
              import("@/views/crafted/pages/profile/Campaigns.vue"),
            meta: {
              pageTitle: "Campaigns",
            },
          },
          {
            path: "documents",
            name: "profile-documents",
            component: () =>
              import("@/views/crafted/pages/profile/Documents.vue"),
            meta: {
              pageTitle: "Documents",
            },
          },
          {
            path: "connections",
            name: "profile-connections",
            component: () =>
              import("@/views/crafted/pages/profile/Connections.vue"),
            meta: {
              pageTitle: "Connections",
            },
          },
          {
            path: "activity",
            name: "profile-activity",
            component: () =>
              import("@/views/crafted/pages/profile/Activity.vue"),
            meta: {
              pageTitle: "Activity",
            },
          },
        ],
      },
      {
        path: "/crafted/pages/wizards/horizontal",
        name: "horizontal-wizard",
        component: () =>
          import("@/views/crafted/pages/wizards/HorizontalWizardPage.vue"),
        meta: {
          pageTitle: "Horizontal",
          breadcrumbs: ["Pages", "Wizard"],
        },
      },
      {
        path: "/crafted/pages/wizards/vertical",
        name: "vertical-wizard",
        component: () =>
          import("@/views/crafted/pages/wizards/VerticalWizardPage.vue"),
        meta: {
          pageTitle: "Vertical",
          breadcrumbs: ["Pages", "Wizard"],
        },
      },
      {
        path: "/crafted/account",
        name: "account",
        component: () => import("@/views/crafted/account/Account.vue"),
        meta: {
          breadcrumbs: ["Crafted", "Account"],
        },
        children: [
          {
            path: "overview",
            name: "account-overview",
            component: () => import("@/views/crafted/account/Overview.vue"),
            meta: {
              pageTitle: "Overview",
            },
          },
          {
            path: "settings",
            name: "account-settings",
            component: () => import("@/views/crafted/account/Settings.vue"),
            meta: {
              pageTitle: "Settings",
            },
          },
        ],
      },
      {
        path: "/apps/customers/getting-started",
        name: "apps-customers-getting-started",
        component: () => import("@/views/apps/customers/GettingStarted.vue"),
        meta: {
          pageTitle: "Getting Started",
          breadcrumbs: ["Apps", "Customers"],
        },
      },
      {
        path: "/apps/customers/customers-listing",
        name: "apps-customers-listing",
        component: () => import("@/views/apps/customers/CustomersListing.vue"),
        meta: {
          pageTitle: "Customers Listing",
          breadcrumbs: ["Apps", "Customers"],
        },
      },
      {
        path: "/apps/customers/customer-details",
        name: "apps-customers-details",
        component: () => import("@/views/apps/customers/CustomerDetails.vue"),
        meta: {
          pageTitle: "Customers Details",
          breadcrumbs: ["Apps", "Customers"],
        },
      },
      {
        path: "/apps/subscriptions/getting-started",
        name: "apps-subscriptions-getting-started",
        component: () =>
          import("@/views/apps/subscriptions/GettingStarted.vue"),
        meta: {
          pageTitle: "Getting Started",
          breadcrumbs: ["Apps", "Subscriptions"],
        },
      },
      {
        path: "/apps/subscriptions/subscription-list",
        name: "apps-subscriptions-subscription-list",
        component: () =>
          import("@/views/apps/subscriptions/SubscriptionList.vue"),
        meta: {
          pageTitle: "Getting Started",
          breadcrumbs: ["Apps", "Subscriptions"],
        },
      },
      {
        path: "/apps/subscriptions/add-subscription",
        name: "apps-subscriptions-add-subscription",
        component: () =>
          import("@/views/apps/subscriptions/AddSubscription.vue"),
        meta: {
          pageTitle: "Add Subscription",
          breadcrumbs: ["Apps", "Subscriptions"],
        },
      },
      {
        path: "/apps/subscriptions/view-subscription",
        name: "apps-subscriptions-view-subscription",
        component: () =>
          import("@/views/apps/subscriptions/ViewSubscription.vue"),
        meta: {
          pageTitle: "View Subscription",
          breadcrumbs: ["Apps", "Subscriptions"],
        },
      },
      {
        path: "/apps/calendar",
        name: "apps-calendar",
        component: () => import("@/views/apps/Calendar.vue"),
        meta: {
          pageTitle: "Calendar",
          breadcrumbs: ["Apps"],
        },
      },
      {
        path: "/apps/chat/private-chat",
        name: "apps-private-chat",
        component: () => import("@/views/apps/chat/Chat.vue"),
        meta: {
          pageTitle: "Private Chat",
          breadcrumbs: ["Apps", "Chat"],
        },
      },
      {
        path: "/apps/chat/group-chat",
        name: "apps-group-chat",
        component: () => import("@/views/apps/chat/Chat.vue"),
        meta: {
          pageTitle: "Group Chat",
          breadcrumbs: ["Apps", "Chat"],
        },
      },
      {
        path: "/apps/chat/drawer-chat",
        name: "apps-drawer-chat",
        component: () => import("@/views/apps/chat/DrawerChat.vue"),
        meta: {
          pageTitle: "Drawer Chat",
          breadcrumbs: ["Apps", "Chat"],
        },
      },
      {
        path: "/crafted/modals/general/invite-friends",
        name: "modals-general-invite-friends",
        component: () =>
          import("@/views/crafted/modals/general/InviteFriends.vue"),
        meta: {
          pageTitle: "Invite Friends",
          breadcrumbs: ["Crafted", "Modals", "General"],
        },
      },
      {
        path: "/crafted/modals/general/view-user",
        name: "modals-general-view-user",
        component: () => import("@/views/crafted/modals/general/ViewUsers.vue"),
        meta: {
          pageTitle: "View User",
          breadcrumbs: ["Crafted", "Modals", "General"],
        },
      },
      {
        path: "/crafted/modals/general/upgrade-plan",
        name: "modals-general-upgrade-plan",
        component: () =>
          import("@/views/crafted/modals/general/UpgradePlan.vue"),
        meta: {
          pageTitle: "Upgrade Plan",
          breadcrumbs: ["Crafted", "Modals", "General"],
        },
      },
      {
        path: "/crafted/modals/general/share-and-earn",
        name: "modals-general-share-and-earn",
        component: () =>
          import("@/views/crafted/modals/general/ShareAndEarn.vue"),
        meta: {
          pageTitle: "Share And Earn",
          breadcrumbs: ["Crafted", "Modals", "General"],
        },
      },
      {
        path: "/crafted/modals/forms/new-target",
        name: "modals-forms-new-target",
        component: () => import("@/views/crafted/modals/forms/NewTarget.vue"),
        meta: {
          pageTitle: "New Target",
          breadcrumbs: ["Crafted", "Modals", "Forms"],
        },
      },
      {
        path: "/crafted/modals/forms/new-card",
        name: "modals-forms-new-card",
        component: () => import("@/views/crafted/modals/forms/NewCard.vue"),
        meta: {
          pageTitle: "New Card",
          breadcrumbs: ["Crafted", "Modals", "Forms"],
        },
      },
      {
        path: "/crafted/modals/forms/new-address",
        name: "modals-forms-new-address",
        component: () => import("@/views/crafted/modals/forms/NewAddress.vue"),
        meta: {
          pageTitle: "New Address",
          breadcrumbs: ["Crafted", "Modals", "Forms"],
        },
      },
      {
        path: "/crafted/modals/forms/create-api-key",
        name: "modals-forms-create-api-key",
        component: () =>
          import("@/views/crafted/modals/forms/CreateApiKey.vue"),
        meta: {
          pageTitle: "Create Api Key",
          breadcrumbs: ["Crafted", "Modals", "Forms"],
        },
      },
      {
        path: "/crafted/modals/wizards/two-factor-auth",
        name: "modals-wizards-two-factor-auth",
        component: () =>
          import("@/views/crafted/modals/wizards/TwoFactorAuth.vue"),
        meta: {
          pageTitle: "Two Factory Auth",
          breadcrumbs: ["Crafted", "Modals", "Wizards"],
        },
      },
      {
        path: "/crafted/modals/wizards/create-app",
        name: "modals-wizards-create-app",
        component: () => import("@/views/crafted/modals/wizards/CreateApp.vue"),
        meta: {
          pageTitle: "Create App",
          breadcrumbs: ["Crafted", "Modals", "Wizards"],
        },
      },
      {
        path: "/crafted/modals/wizards/create-account",
        name: "modals-wizards-create-account",
        component: () =>
          import("@/views/crafted/modals/wizards/CreateAccount.vue"),
        meta: {
          pageTitle: "Create Account",
          breadcrumbs: ["Crafted", "Modals", "Wizards"],
        },
      },
      {
        path: "/crafted/widgets/lists",
        name: "widgets-list",
        component: () => import("@/views/crafted/widgets/Lists.vue"),
        meta: {
          pageTitle: "Lists",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/statistics",
        name: "widgets-statistics",
        component: () => import("@/views/crafted/widgets/Statistics.vue"),
        meta: {
          pageTitle: "Statistics",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/charts",
        name: "widgets-charts",
        component: () => import("@/views/crafted/widgets/Charts.vue"),
        meta: {
          pageTitle: "Charts",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/mixed",
        name: "widgets-mixed",
        component: () => import("@/views/crafted/widgets/Mixed.vue"),
        meta: {
          pageTitle: "Mixed",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/tables",
        name: "widgets-tables",
        component: () => import("@/views/crafted/widgets/Tables.vue"),
        meta: {
          pageTitle: "Tables",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/feeds",
        name: "widgets-feeds",
        component: () => import("@/views/crafted/widgets/Feeds.vue"),
        meta: {
          pageTitle: "Feeds",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
    ],
  },
  {
    path: "/auth",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "/auth/login",
        name: "login",
        component: () => import("@/modules/auth/views/Login.vue"),
        meta: {
          pageTitle: "Iniciar Sesión",
        },
      },
      {
        path: "/auth/register",
        name: "register",
        component: () => import("@/modules/auth/views/Register.vue"),
        meta: {
          pageTitle: "Registrarse",
        },
      },
      {
        path: "/auth/password-reset",
        name: "password-reset",
        component: () => import("@/modules/auth/views/PasswordReset.vue"),
        meta: {
          pageTitle: "Restablecer Contraseña",
        },
      },
      // Backwards compatibility redirects
      {
        path: "/sign-in",
        redirect: "/auth/login",
      },
      {
        path: "/sign-up",
        redirect: "/auth/register",
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
        // the 404 route, when none of the above matches
        path: "/404",
        name: "404",
        component: () => import("@/views/crafted/authentication/Error404.vue"),
        meta: {
          pageTitle: "Error 404",
        },
      },
      {
        path: "/500",
        name: "500",
        component: () => import("@/views/crafted/authentication/Error500.vue"),
        meta: {
          pageTitle: "Error 500",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    // If the route has a hash, scroll to the section with the specified ID; otherwise, scroll to the top of the page.
    if (to.hash) {
      return {
        el: to.hash,
        top: 80,
        behavior: "smooth",
      };
    } else {
      return {
        top: 0,
        left: 0,
        behavior: "smooth",
      };
    }
  },
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const configStore = useConfigStore();

  // Show loading indicator for route transitions
  const loadingElement = document.getElementById("splash-screen");
  if (loadingElement && to.name !== from.name) {
    document.body.classList.add("page-loading");
  }

  try {
    // Set page title
    const pageTitle = to.meta.pageTitle || "GP360";
    document.title = `${pageTitle} - ${import.meta.env.VITE_APP_NAME}`;

    // Reset config to initial state
    configStore.resetLayoutConfig();

    // Routes that don't require authentication check
    const publicRoutes = ["login", "register", "password-reset", "404", "500"];
    const authRoutes = ["login", "register", "password-reset"];

    // If going to a public route, proceed without auth check
    if (publicRoutes.includes(to.name as string)) {
      // If user is already authenticated and trying to access auth routes, redirect to dashboard
      if (authStore.isAuthenticated && authRoutes.includes(to.name as string)) {
        return next({ name: "dashboard", replace: true });
      }
      return next();
    }

    // For protected routes, verify authentication
    if (!authStore.isAuthenticated || !authStore.user?.id) {
      // Try to verify auth with token if available
      await authStore.verifyAuth();

      if (!authStore.isAuthenticated || !authStore.user?.id) {
        console.log("Authentication failed, redirecting to login");
        return next({ name: "login", replace: true });
      }
    }

    // Check if route requires specific roles
    if (to.meta.requiresRole || to.meta.roles) {
      const userRole = authStore.userRoleSlug.toLowerCase();
      const requiredRoles = Array.isArray(to.meta.requiresRole || to.meta.roles)
        ? (to.meta.requiresRole || to.meta.roles).map((role: string) =>
            role.toLowerCase(),
          )
        : [(to.meta.requiresRole || to.meta.roles).toLowerCase()];

      if (!requiredRoles.includes(userRole) && !authStore.isSuperAdmin) {
        console.warn("Access denied: insufficient role permissions");
        return next({ name: "access-denied", replace: true });
      }
    }

    // Check if route requires specific permissions
    if (to.meta.permissions && !authStore.isSuperAdmin) {
      const requiredPermissions = Array.isArray(to.meta.permissions)
        ? to.meta.permissions
        : [to.meta.permissions];

      const hasPermission = to.meta.requireAllPermissions
        ? authStore.hasAllPermissions(requiredPermissions)
        : authStore.hasAnyPermission(requiredPermissions);

      if (!hasPermission) {
        console.warn(
          "Access denied: insufficient permissions for route",
          to.name,
        );

        // If user doesn't have dashboard access either, redirect to profile or access denied
        if (!authStore.hasPermission("dashboard.view")) {
          return next({ name: "access-denied", replace: true });
        }

        return next({ name: "dashboard", replace: true });
      }
    }

    // Proceed to route
    next();
  } catch (error) {
    console.error("Router guard error:", error);
    // On error, redirect to login
    next({ name: "login", replace: true });
  } finally {
    // Hide loading indicator
    setTimeout(() => {
      document.body.classList.remove("page-loading");
    }, 300);
  }
});

// Global after hook for additional cleanup
router.afterEach((to, from) => {
  // Hide loading indicator after navigation
  document.body.classList.remove("page-loading");

  // Scroll to top on route change
  window.scrollTo(0, 0);

  // Track route changes (analytics, logging, etc.)
  // Route change tracking disabled for cleaner console
});

export default router;
