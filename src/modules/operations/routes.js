export default [
  {
    path: '/operations',
    name: 'operations',
    redirect: '/operations/admissions',
    meta: {
      title: 'Operaciones',
      requiresAuth: true,
      permissions: ['operations.view']
    }
  },
  {
    path: '/operations/admissions',
    name: 'operations.admissions',
    component: () => import('./views/AdmissionsManagement.vue'),
    meta: {
      title: 'Gestión de Admisiones',
      requiresAuth: true,
      permissions: ['admissions.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Operaciones', to: '/operations' },
        { text: 'Admisiones', active: true }
      ]
    }
  },
  {
    path: '/operations/admissions/:id',
    name: 'operations.admissions.detail',
    component: () => import('./views/AdmissionDetail.vue'),
    meta: {
      title: 'Detalle de Admisión',
      requiresAuth: true,
      permissions: ['admissions.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Operaciones', to: '/operations' },
        { text: 'Admisiones', to: '/operations/admissions' },
        { text: 'Detalle', active: true }
      ]
    }
  },
  {
    path: '/operations/counts',
    name: 'operations.counts',
    component: () => import('./views/DailyCountManagement.vue'),
    meta: {
      title: 'Conteo Diario',
      requiresAuth: true,
      permissions: ['counts.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Operaciones', to: '/operations' },
        { text: 'Conteo Diario', active: true }
      ]
    }
  },
  {
    path: '/operations/movements',
    name: 'operations.movements',
    component: () => import('./views/MovementControl.vue'),
    meta: {
      title: 'Control de Movimientos',
      requiresAuth: true,
      permissions: ['movements.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Operaciones', to: '/operations' },
        { text: 'Movimientos', active: true }
      ]
    }
  },
  {
    path: '/operations/movements/:id',
    name: 'operations.movements.detail',
    component: () => import('./views/MovementDetail.vue'),
    meta: {
      title: 'Detalle de Movimiento',
      requiresAuth: true,
      permissions: ['movements.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Operaciones', to: '/operations' },
        { text: 'Movimientos', to: '/operations/movements' },
        { text: 'Detalle', active: true }
      ]
    }
  },
  {
    path: '/operations/releases',
    name: 'operations.releases',
    component: () => import('./views/ReleaseManagement.vue'),
    meta: {
      title: 'Gestión de Liberaciones',
      requiresAuth: true,
      permissions: ['releases.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Operaciones', to: '/operations' },
        { text: 'Liberaciones', active: true }
      ]
    }
  },
  {
    path: '/operations/releases/plans',
    name: 'operations.releases.plans',
    component: () => import('./views/ReleasePlanning.vue'),
    meta: {
      title: 'Planificación de Liberaciones',
      requiresAuth: true,
      permissions: ['releases.plans.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Operaciones', to: '/operations' },
        { text: 'Liberaciones', to: '/operations/releases' },
        { text: 'Planificación', active: true }
      ]
    }
  },
  {
    path: '/operations/releases/plans/:id',
    name: 'operations.releases.plans.detail',
    component: () => import('./views/ReleasePlanDetail.vue'),
    meta: {
      title: 'Detalle de Plan de Liberación',
      requiresAuth: true,
      permissions: ['releases.plans.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Operaciones', to: '/operations' },
        { text: 'Liberaciones', to: '/operations/releases' },
        { text: 'Planificación', to: '/operations/releases/plans' },
        { text: 'Detalle', active: true }
      ]
    }
  },
  {
    path: '/operations/releases/:id',
    name: 'operations.releases.detail',
    component: () => import('./views/ReleaseDetail.vue'),
    meta: {
      title: 'Detalle de Liberación',
      requiresAuth: true,
      permissions: ['releases.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Operaciones', to: '/operations' },
        { text: 'Liberaciones', to: '/operations/releases' },
        { text: 'Detalle', active: true }
      ]
    }
  },
  {
    path: '/operations/counts/history',
    name: 'operations.counts.history',
    component: () => import('./views/CountHistory.vue'),
    meta: {
      title: 'Historial de Conteos',
      requiresAuth: true,
      permissions: ['counts.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Operaciones', to: '/operations' },
        { text: 'Conteo Diario', to: '/operations/counts' },
        { text: 'Historial', active: true }
      ]
    }
  },
  {
    path: '/operations/counts/discrepancies',
    name: 'operations.counts.discrepancies',
    component: () => import('./views/CountDiscrepancies.vue'),
    meta: {
      title: 'Discrepancias de Conteo',
      requiresAuth: true,
      permissions: ['counts.manage'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Operaciones', to: '/operations' },
        { text: 'Conteo Diario', to: '/operations/counts' },
        { text: 'Discrepancias', active: true }
      ]
    }
  },
  {
    path: '/operations/movements/create',
    name: 'operations.movements.create',
    component: () => import('./views/MovementCreate.vue'),
    meta: {
      title: 'Solicitar Movimiento',
      requiresAuth: true,
      permissions: ['movements.create'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Operaciones', to: '/operations' },
        { text: 'Movimientos', to: '/operations/movements' },
        { text: 'Solicitar', active: true }
      ]
    }
  },
  {
    path: '/operations/movements/history',
    name: 'operations.movements.history',
    component: () => import('./views/MovementHistory.vue'),
    meta: {
      title: 'Historial de Movimientos',
      requiresAuth: true,
      permissions: ['movements.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Operaciones', to: '/operations' },
        { text: 'Movimientos', to: '/operations/movements' },
        { text: 'Historial', active: true }
      ]
    }
  },
  {
    path: '/operations/releases/history',
    name: 'operations.releases.history',
    component: () => import('./views/ReleaseHistory.vue'),
    meta: {
      title: 'Historial de Liberaciones',
      requiresAuth: true,
      permissions: ['releases.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Operaciones', to: '/operations' },
        { text: 'Liberaciones', to: '/operations/releases' },
        { text: 'Historial', active: true }
      ]
    }
  },
  {
    path: '/operations/statistics',
    name: 'operations.statistics',
    redirect: '/operations/statistics/dashboard',
    meta: {
      title: 'Estadísticas Operativas',
      requiresAuth: true,
      permissions: ['operations.statistics.view']
    }
  },
  {
    path: '/operations/statistics/dashboard',
    name: 'operations.statistics.dashboard',
    component: () => import('./views/OperationalDashboard.vue'),
    meta: {
      title: 'Dashboard Operativo',
      requiresAuth: true,
      permissions: ['operations.statistics.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Operaciones', to: '/operations' },
        { text: 'Estadísticas', to: '/operations/statistics' },
        { text: 'Dashboard', active: true }
      ]
    }
  },
  {
    path: '/operations/statistics/reports',
    name: 'operations.statistics.reports',
    component: () => import('./views/OperationalReports.vue'),
    meta: {
      title: 'Reportes Operativos',
      requiresAuth: true,
      permissions: ['operations.reports.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Operaciones', to: '/operations' },
        { text: 'Estadísticas', to: '/operations/statistics' },
        { text: 'Reportes', active: true }
      ]
    }
  },
  {
    path: '/operations/statistics/kpi',
    name: 'operations.statistics.kpi',
    component: () => import('./views/OperationalKPI.vue'),
    meta: {
      title: 'Indicadores KPI',
      requiresAuth: true,
      permissions: ['operations.statistics.view'],
      breadcrumb: [
        { text: 'Inicio', to: '/' },
        { text: 'Operaciones', to: '/operations' },
        { text: 'Estadísticas', to: '/operations/statistics' },
        { text: 'KPI', active: true }
      ]
    }
  }
]