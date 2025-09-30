export default [
  {
    path: '/visits',
    name: 'visits',
    redirect: '/visits/visitors',
    meta: {
      title: 'Sistema de Visitas',
      requiresAuth: true,
      permissions: ['visits.view']
    }
  },
  {
    path: '/visits/visitors',
    name: 'visits.visitors',
    component: () => import('./views/VisitorManagement.vue'),
    meta: {
      title: 'Registro de Visitantes',
      requiresAuth: true,
      permissions: ['visits.visitors.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Visitas', to: '/visits' },
        { text: 'Visitantes', active: true }
      ]
    }
  },
  {
    path: '/visits/visitors/:id',
    name: 'visits.visitors.detail',
    component: () => import('./views/VisitorDetail.vue'),
    meta: {
      title: 'Detalle de Visitante',
      requiresAuth: true,
      permissions: ['visits.visitors.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Visitas', to: '/visits' },
        { text: 'Visitantes', to: '/visits/visitors' },
        { text: 'Detalle', active: true }
      ]
    }
  },
  {
    path: '/visits/relationships',
    name: 'visits.relationships',
    component: () => import('./views/VisitorRelationships.vue'),
    meta: {
      title: 'Relaciones de Visita',
      requiresAuth: true,
      permissions: ['visits.relationships.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Visitas', to: '/visits' },
        { text: 'Relaciones', active: true }
      ]
    }
  },
  {
    path: '/visits/relationships/:id',
    name: 'visits.relationships.detail',
    component: () => import('./views/RelationshipDetail.vue'),
    meta: {
      title: 'Detalle de Relación',
      requiresAuth: true,
      permissions: ['visits.relationships.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Visitas', to: '/visits' },
        { text: 'Relaciones', to: '/visits/relationships' },
        { text: 'Detalle', active: true }
      ]
    }
  },
  {
    path: '/visits/requests',
    name: 'visits.requests',
    component: () => import('./views/VisitRequests.vue'),
    meta: {
      title: 'Solicitudes de Visita',
      requiresAuth: true,
      permissions: ['visits.requests.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Visitas', to: '/visits' },
        { text: 'Solicitudes', active: true }
      ]
    }
  },
  {
    path: '/visits/requests/:id',
    name: 'visits.requests.detail',
    component: () => import('./views/VisitRequestDetail.vue'),
    meta: {
      title: 'Detalle de Solicitud',
      requiresAuth: true,
      permissions: ['visits.requests.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Visitas', to: '/visits' },
        { text: 'Solicitudes', to: '/visits/requests' },
        { text: 'Detalle', active: true }
      ]
    }
  },
  {
    path: '/visits/scheduling',
    name: 'visits.scheduling',
    component: () => import('./views/VisitScheduling.vue'),
    meta: {
      title: 'Programación de Visitas',
      requiresAuth: true,
      permissions: ['visits.scheduling.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Visitas', to: '/visits' },
        { text: 'Programación', active: true }
      ]
    }
  },
  {
    path: '/visits/active',
    name: 'visits.active',
    component: () => import('./views/ActiveVisits.vue'),
    meta: {
      title: 'Visitas Activas',
      requiresAuth: true,
      permissions: ['visits.monitoring.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Visitas', to: '/visits' },
        { text: 'Visitas Activas', active: true }
      ]
    }
  },
  {
    path: '/visits/biometric',
    name: 'visits.biometric',
    component: () => import('./views/BiometricControl.vue'),
    meta: {
      title: 'Control Biométrico',
      requiresAuth: true,
      permissions: ['visits.biometric.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Visitas', to: '/visits' },
        { text: 'Control Biométrico', active: true }
      ]
    }
  },
  {
    path: '/visits/monitoring',
    name: 'visits.monitoring',
    component: () => import('./views/VisitMonitoring.vue'),
    meta: {
      title: 'Monitoreo de Visitas',
      requiresAuth: true,
      permissions: ['visits.monitoring.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Visitas', to: '/visits' },
        { text: 'Monitoreo', active: true }
      ]
    }
  },
  {
    path: '/visits/reports',
    name: 'visits.reports',
    component: () => import('./views/VisitReports.vue'),
    meta: {
      title: 'Reportes de Visitas',
      requiresAuth: true,
      permissions: ['visits.reports.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Visitas', to: '/visits' },
        { text: 'Reportes', active: true }
      ]
    }
  },
  {
    path: '/visits/statistics',
    name: 'visits.statistics',
    component: () => import('./views/VisitStatistics.vue'),
    meta: {
      title: 'Estadísticas de Visitas',
      requiresAuth: true,
      permissions: ['visits.statistics.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Visitas', to: '/visits' },
        { text: 'Estadísticas', active: true }
      ]
    }
  },
  {
    path: '/visits/settings',
    name: 'visits.settings',
    component: () => import('./views/VisitSettings.vue'),
    meta: {
      title: 'Configuración de Visitas',
      requiresAuth: true,
      permissions: ['visits.settings.manage'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Visitas', to: '/visits' },
        { text: 'Configuración', active: true }
      ]
    }
  }
]