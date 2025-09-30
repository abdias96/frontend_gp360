export default {
  title: 'Sistema de Visitas',
  icon: 'fas fa-users',
  permission: 'visits.view',
  order: 4,
  children: [
    {
      title: 'Registro de Visitantes',
      icon: 'fas fa-user-check',
      route: 'visits.visitors',
      permission: 'visits.visitors.view',
      description: 'Gestión del registro de visitantes y datos biométricos',
      order: 1
    },
    {
      title: 'Relaciones de Visita',
      icon: 'fas fa-heart',
      route: 'visits.relationships',
      permission: 'visits.relationships.view',
      description: 'Gestión de relaciones autorizadas entre visitantes y PPL',
      order: 2,
      badge: {
        type: 'warning',
        text: 'Pendientes',
        condition: 'pendingRelationships'
      }
    },
    {
      title: 'Solicitudes de Visita',
      icon: 'fas fa-calendar-check',
      route: 'visits.requests',
      permission: 'visits.requests.view',
      description: 'Gestión de solicitudes y aprobación de visitas',
      order: 3,
      badge: {
        type: 'info',
        text: 'Nuevas',
        condition: 'newVisitRequests'
      }
    },
    {
      title: 'Programación',
      icon: 'fas fa-calendar-alt',
      route: 'visits.scheduling',
      permission: 'visits.scheduling.view',
      description: 'Programación y calendario de visitas',
      order: 4
    },
    {
      title: 'Control de Acceso',
      icon: 'fas fa-fingerprint',
      permission: 'visits.access.view',
      description: 'Control biométrico y acceso de visitantes',
      order: 5,
      children: [
        {
          title: 'Control Biométrico',
          icon: 'fas fa-fingerprint',
          route: 'visits.biometric',
          permission: 'visits.biometric.view',
          description: 'Verificación biométrica de visitantes',
          order: 1
        },
        {
          title: 'Visitas Activas',
          icon: 'fas fa-clock',
          route: 'visits.active',
          permission: 'visits.monitoring.view',
          description: 'Monitoreo de visitas en progreso',
          order: 2,
          badge: {
            type: 'success',
            text: 'Activas',
            condition: 'activeVisits'
          }
        }
      ]
    },
    {
      title: 'Monitoreo y Supervisión',
      icon: 'fas fa-eye',
      route: 'visits.monitoring',
      permission: 'visits.monitoring.view',
      description: 'Supervisión y control durante las visitas',
      order: 6
    },
    {
      title: 'Reportes y Estadísticas',
      icon: 'fas fa-chart-bar',
      permission: 'visits.reports.view',
      description: 'Reportes y análisis del sistema de visitas',
      order: 7,
      children: [
        {
          title: 'Reportes',
          icon: 'fas fa-file-alt',
          route: 'visits.reports',
          permission: 'visits.reports.view',
          description: 'Generación de reportes de visitas',
          order: 1
        },
        {
          title: 'Estadísticas',
          icon: 'fas fa-chart-line',
          route: 'visits.statistics',
          permission: 'visits.statistics.view',
          description: 'Análisis estadístico y dashboards',
          order: 2
        }
      ]
    },
    {
      title: 'Configuración',
      icon: 'fas fa-cog',
      route: 'visits.settings',
      permission: 'visits.settings.manage',
      description: 'Configuración del sistema de visitas',
      order: 8
    }
  ]
}