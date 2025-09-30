import type { RouteRecordRaw } from 'vue-router';

const legalRoutes: RouteRecordRaw[] = [
  {
    path: '/legal',
    name: 'legal',
    redirect: '/legal/profiles',
    meta: {
      requiresAuth: true,
      breadcrumb: 'Gestión Legal'
    },
    children: [
      // Legal Profiles
      {
        path: 'profiles',
        name: 'legal-profiles',
        component: () => import('./views/LegalProfiles.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.profiles',
          pageTitle: 'Perfiles Legales',
          breadcrumb: 'Perfiles Legales'
        }
      },
      {
        path: 'profiles/create',
        name: 'legal-profile-create',
        component: () => import('./views/LegalProfileForm.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.profiles.create',
          pageTitle: 'Crear Perfil Legal',
          breadcrumb: 'Crear'
        }
      },
      {
        path: 'profiles/:id',
        name: 'legal-profile-detail',
        component: () => import('./views/LegalProfileDetail.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.profiles',
          pageTitle: 'Detalle Perfil Legal',
          breadcrumb: 'Detalle'
        }
      },
      {
        path: 'profiles/:id/edit',
        name: 'legal-profile-edit',
        component: () => import('./views/LegalProfileForm.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.profiles.edit',
          pageTitle: 'Editar Perfil Legal',
          breadcrumb: 'Editar'
        }
      },

      // Crimes
      {
        path: 'crimes',
        name: 'legal-crimes',
        component: () => import('./views/Crimes.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.crimes',
          pageTitle: 'Delitos',
          breadcrumb: 'Delitos'
        }
      },
      {
        path: 'crimes/create',
        name: 'legal-crime-create',
        component: () => import('./views/CrimeForm.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.crimes.create',
          pageTitle: 'Registrar Delito',
          breadcrumb: 'Registrar'
        }
      },
      {
        path: 'crimes/:id/edit',
        name: 'legal-crime-edit',
        component: () => import('./views/CrimeForm.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.crimes.edit',
          pageTitle: 'Editar Delito',
          breadcrumb: 'Editar'
        }
      },

      // Hearings
      {
        path: 'hearings',
        name: 'legal-hearings',
        component: () => import('./views/Hearings.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.hearings',
          pageTitle: 'Audiencias',
          breadcrumb: 'Audiencias'
        }
      },
      {
        path: 'hearings/create',
        name: 'legal-hearing-create',
        component: () => import('./views/HearingForm.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.hearings.create',
          pageTitle: 'Programar Audiencia',
          breadcrumb: 'Programar'
        }
      },
      {
        path: 'hearings/:id',
        name: 'legal-hearing-detail',
        component: () => import('./views/HearingDetail.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.hearings',
          pageTitle: 'Detalle Audiencia',
          breadcrumb: 'Detalle'
        }
      },
      {
        path: 'hearings/:id/edit',
        name: 'legal-hearing-edit',
        component: () => import('./views/HearingForm.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.hearings.edit',
          pageTitle: 'Editar Audiencia',
          breadcrumb: 'Editar'
        }
      },

      // Judicial Resolutions
      {
        path: 'resolutions',
        name: 'legal-resolutions',
        component: () => import('./views/Resolutions.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.resolutions',
          pageTitle: 'Resoluciones Judiciales',
          breadcrumb: 'Resoluciones'
        }
      },
      {
        path: 'resolutions/create',
        name: 'legal-resolution-create',
        component: () => import('./views/ResolutionForm.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.resolutions.create',
          pageTitle: 'Registrar Resolución',
          breadcrumb: 'Registrar'
        }
      },
      {
        path: 'resolutions/:id',
        name: 'legal-resolution-detail',
        component: () => import('./views/ResolutionDetail.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.resolutions',
          pageTitle: 'Detalle Resolución',
          breadcrumb: 'Detalle'
        }
      },

      // Appeals
      {
        path: 'appeals',
        name: 'legal-appeals',
        component: () => import('./views/Appeals.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.appeals',
          pageTitle: 'Apelaciones',
          breadcrumb: 'Apelaciones'
        }
      },
      {
        path: 'appeals/create',
        name: 'legal-appeal-create',
        component: () => import('./views/AppealForm.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.appeals.create',
          pageTitle: 'Registrar Apelación',
          breadcrumb: 'Registrar'
        }
      },
      {
        path: 'appeals/:id',
        name: 'legal-appeal-detail',
        component: () => import('./views/AppealDetail.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.appeals',
          pageTitle: 'Detalle Apelación',
          breadcrumb: 'Detalle'
        }
      },

      // Procedural Deadlines
      {
        path: 'deadlines',
        name: 'legal-deadlines',
        component: () => import('./views/Deadlines.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.deadlines',
          pageTitle: 'Plazos Procesales',
          breadcrumb: 'Plazos'
        }
      },
      {
        path: 'deadlines/calendar',
        name: 'legal-deadlines-calendar',
        component: () => import('./views/DeadlinesCalendar.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.deadlines',
          pageTitle: 'Calendario de Plazos',
          breadcrumb: 'Calendario'
        }
      },

      // Legal Measures
      {
        path: 'measures',
        name: 'legal-measures',
        component: () => import('./views/Measures.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.measures',
          pageTitle: 'Medidas Legales',
          breadcrumb: 'Medidas'
        }
      },
      {
        path: 'measures/create',
        name: 'legal-measure-create',
        component: () => import('./views/MeasureForm.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.measures.create',
          pageTitle: 'Aplicar Medida',
          breadcrumb: 'Aplicar'
        }
      },

      // Benefit Applications
      {
        path: 'benefits',
        name: 'legal-benefits',
        component: () => import('./views/Benefits.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.benefits',
          pageTitle: 'Solicitudes de Beneficios',
          breadcrumb: 'Beneficios'
        }
      },
      {
        path: 'benefits/create',
        name: 'legal-benefit-create',
        component: () => import('./views/BenefitForm.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.benefits.create',
          pageTitle: 'Solicitar Beneficio',
          breadcrumb: 'Solicitar'
        }
      },
      {
        path: 'benefits/:id',
        name: 'legal-benefit-detail',
        component: () => import('./views/BenefitDetail.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.benefits',
          pageTitle: 'Detalle Solicitud',
          breadcrumb: 'Detalle'
        }
      },

      // Releases
      {
        path: 'releases',
        name: 'legal-releases',
        component: () => import('./views/Releases.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.releases',
          pageTitle: 'Liberaciones',
          breadcrumb: 'Liberaciones'
        }
      },
      {
        path: 'releases/plan',
        name: 'legal-release-plan',
        component: () => import('./views/ReleasePlan.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.releases.plan',
          pageTitle: 'Planificar Liberación',
          breadcrumb: 'Planificar'
        }
      },

      // Reports & Statistics
      {
        path: 'dashboard',
        name: 'legal-dashboard',
        component: () => import('./views/Dashboard.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.dashboard',
          pageTitle: 'Dashboard Legal',
          breadcrumb: 'Dashboard'
        }
      },
      {
        path: 'reports',
        name: 'legal-reports',
        component: () => import('./views/Reports.vue'),
        meta: {
          requiresAuth: true,
          permission: 'legal.reports',
          pageTitle: 'Reportes Legales',
          breadcrumb: 'Reportes'
        }
      }
    ]
  }
];

export default legalRoutes;