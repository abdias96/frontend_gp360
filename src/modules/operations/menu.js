export default {
  title: 'Operaciones PPL',
  icon: 'fas fa-cogs',
  permission: 'operations.view',
  order: 3,
  children: [
    {
      title: 'Admisiones',
      icon: 'fas fa-user-plus',
      route: '/operations/admissions',
      permission: 'admissions.view',
      description: 'Gestión del proceso de admisión de nuevas PPL (12 pasos)',
      order: 1,
      badge: {
        type: 'info',
        text: 'Nuevos',
        condition: 'newAdmissions'
      },
      children: [
        {
          title: 'Proceso de Admisión',
          icon: 'fas fa-clipboard-check',
          route: '/operations/admissions',
          permission: 'admissions.view',
          description: 'Proceso completo de admisión (12 pasos)',
          order: 1
        },
        {
          title: 'Admisiones en Proceso',
          icon: 'fas fa-hourglass-half',
          route: '/operations/admissions?status=in_progress',
          permission: 'admissions.view',
          description: 'Admisiones pendientes de completar',
          order: 2,
          badge: {
            type: 'warning',
            text: 'En Proceso',
            condition: 'admissionsInProgress'
          }
        }
      ]
    },
    {
      title: 'Conteo Diario',
      icon: 'fas fa-clipboard-list',
      route: '/operations/counts',
      permission: 'counts.view',
      description: 'Control de conteos obligatorios diarios (4 veces al día)',
      order: 2,
      badge: {
        type: 'warning',
        text: 'Obligatorio',
        condition: 'pendingCounts'
      },
      children: [
        {
          title: 'Conteo Actual',
          icon: 'fas fa-users',
          route: '/operations/counts',
          permission: 'counts.view',
          description: 'Ejecutar conteo diario',
          order: 1
        },
        {
          title: 'Historial de Conteos',
          icon: 'fas fa-history',
          route: '/operations/counts/history',
          permission: 'counts.view',
          description: 'Registro histórico de conteos',
          order: 2
        },
        {
          title: 'Discrepancias',
          icon: 'fas fa-exclamation-triangle',
          route: '/operations/counts/discrepancies',
          permission: 'counts.manage',
          description: 'Gestión de discrepancias en conteos',
          order: 3,
          badge: {
            type: 'danger',
            text: 'Alertas',
            condition: 'countDiscrepancies'
          }
        }
      ]
    },
    {
      title: 'Movimientos',
      icon: 'fas fa-route',
      route: '/operations/movements',
      permission: 'movements.view',
      description: 'Gestión de movimientos internos y externos',
      order: 3,
      badge: {
        type: 'primary',
        text: 'Activos',
        condition: 'activeMovements'
      },
      children: [
        {
          title: 'Movimientos Activos',
          icon: 'fas fa-walking',
          route: '/operations/movements',
          permission: 'movements.view',
          description: 'Movimientos en curso',
          order: 1
        },
        {
          title: 'Solicitar Movimiento',
          icon: 'fas fa-plus-circle',
          route: '/operations/movements/create',
          permission: 'movements.create',
          description: 'Crear nueva solicitud de movimiento',
          order: 2
        },
        {
          title: 'Historial',
          icon: 'fas fa-archive',
          route: '/operations/movements/history',
          permission: 'movements.view',
          description: 'Historial de movimientos',
          order: 3
        }
      ]
    },
    {
      title: 'Liberaciones',
      icon: 'fas fa-door-open',
      route: '/operations/releases',
      permission: 'releases.view',
      description: 'Proceso de liberación y seguimiento',
      order: 4,
      children: [
        {
          title: 'Planificación (90 días)',
          icon: 'fas fa-calendar-alt',
          route: '/operations/releases/plans',
          permission: 'releases.plans.view',
          description: 'Planificación anticipada de liberaciones',
          order: 1,
          badge: {
            type: 'info',
            text: 'Próximas',
            condition: 'upcomingReleases'
          }
        },
        {
          title: 'Liberaciones Hoy',
          icon: 'fas fa-calendar-day',
          route: '/operations/releases?date=today',
          permission: 'releases.view',
          description: 'Liberaciones programadas para hoy',
          order: 2,
          badge: {
            type: 'danger',
            text: 'Hoy',
            condition: 'releasesToday'
          }
        },
        {
          title: 'En Proceso',
          icon: 'fas fa-spinner',
          route: '/operations/releases?status=in_progress',
          permission: 'releases.view',
          description: 'Liberaciones en proceso de ejecución',
          order: 3
        },
        {
          title: 'Historial',
          icon: 'fas fa-history',
          route: '/operations/releases/history',
          permission: 'releases.view',
          description: 'Registro de liberaciones completadas',
          order: 4
        }
      ]
    },
    {
      title: 'Estadísticas Operativas',
      icon: 'fas fa-chart-line',
      route: '/operations/statistics',
      permission: 'operations.statistics.view',
      description: 'Análisis y métricas operativas',
      order: 5,
      children: [
        {
          title: 'Dashboard Operativo',
          icon: 'fas fa-tachometer-alt',
          route: '/operations/statistics/dashboard',
          permission: 'operations.statistics.view',
          description: 'Panel de control operativo',
          order: 1
        },
        {
          title: 'Reportes',
          icon: 'fas fa-file-alt',
          route: '/operations/statistics/reports',
          permission: 'operations.reports.view',
          description: 'Generación de reportes operativos',
          order: 2
        },
        {
          title: 'Indicadores KPI',
          icon: 'fas fa-chart-bar',
          route: '/operations/statistics/kpi',
          permission: 'operations.statistics.view',
          description: 'Indicadores clave de desempeño',
          order: 3
        }
      ]
    }
  ]
}