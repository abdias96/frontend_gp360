import type { RouteRecordRaw } from 'vue-router';

const securityRoutes: RouteRecordRaw[] = [
  {
    path: '/security',
    name: 'security',
    redirect: '/security/physical-profiles',
    meta: {
      requiresAuth: true,
      breadcrumb: 'Gestión de Seguridad'
    },
    children: [
      // Physical Profiles
      {
        path: 'physical-profiles',
        name: 'security-physical-profiles',
        component: () => import('./views/PhysicalProfiles.vue'),
        meta: {
          requiresAuth: true,
          permission: 'security.physical_profiles',
          pageTitle: 'Perfiles Físicos',
          breadcrumb: 'Perfiles Físicos'
        }
      },
      {
        path: 'physical-profiles/:inmateId',
        name: 'security-physical-profile-detail',
        component: () => import('./views/PhysicalProfileDetail.vue'),
        meta: {
          requiresAuth: true,
          permission: 'security.physical_profiles',
          pageTitle: 'Detalle Perfil Físico',
          breadcrumb: 'Detalle'
        }
      },
      {
        path: 'physical-profiles/:inmateId/edit',
        name: 'security-physical-profile-edit',
        component: () => import('./views/PhysicalProfileEdit.vue'),
        meta: {
          requiresAuth: true,
          permission: 'security.physical_profiles.edit',
          pageTitle: 'Editar Perfil Físico',
          breadcrumb: 'Editar'
        }
      },
      
      // Biometric Capture
      {
        path: 'biometric/:inmateId',
        name: 'security-biometric-capture',
        component: () => import('./views/BiometricCapture.vue'),
        meta: {
          requiresAuth: true,
          permission: 'security.biometric',
          pageTitle: 'Captura Biométrica',
          breadcrumb: 'Captura Biométrica'
        }
      },
      
      // Photo Capture
      {
        path: 'photo/:inmateId',
        name: 'security-physical-profile-photo',
        component: () => import('./views/PhotoCapture.vue'),
        meta: {
          requiresAuth: true,
          permission: 'security.photos',
          pageTitle: 'Captura de Fotografías',
          breadcrumb: 'Fotografías'
        }
      },
      
      // Security Classifications
      {
        path: 'classifications',
        name: 'security-classifications',
        component: () => import('./views/SecurityClassifications.vue'),
        meta: {
          requiresAuth: true,
          permission: 'security.classifications',
          pageTitle: 'Clasificaciones de Seguridad',
          breadcrumb: 'Clasificaciones'
        }
      },
      
      // Gang Affiliations
      {
        path: 'gang-affiliations',
        name: 'security-gang-affiliations',
        component: () => import('./views/GangAffiliations.vue'),
        meta: {
          requiresAuth: true,
          permission: 'security.gangs',
          pageTitle: 'Afiliaciones a Pandillas',
          breadcrumb: 'Pandillas'
        }
      },
      
      // Security Incidents
      {
        path: 'incidents',
        name: 'security-incidents',
        component: () => import('./views/SecurityIncidents.vue'),
        meta: {
          requiresAuth: true,
          permission: 'security.incidents',
          pageTitle: 'Incidentes de Seguridad',
          breadcrumb: 'Incidentes'
        }
      },
      
      // Security Alerts
      {
        path: 'alerts',
        name: 'security-alerts',
        component: () => import('./views/SecurityAlerts.vue'),
        meta: {
          requiresAuth: true,
          permission: 'security.alerts',
          pageTitle: 'Alertas de Seguridad',
          breadcrumb: 'Alertas'
        }
      },
      
      // Reports
      {
        path: 'reports',
        name: 'security-reports',
        component: () => import('./views/SecurityReports.vue'),
        meta: {
          requiresAuth: true,
          permission: 'security.reports',
          pageTitle: 'Reportes de Seguridad',
          breadcrumb: 'Reportes'
        }
      }
    ]
  }
];

export default securityRoutes;