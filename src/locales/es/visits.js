export default {
  visits: {
    title: 'Sistema de Visitas',
    subtitle: 'Gestión integral del sistema de visitas penitenciarias',

    // Navigation and Modules
    navigation: {
      visitor_registry: 'Registro de Visitantes',
      visitor_relationships: 'Relaciones de Visita',
      visit_requests: 'Solicitudes de Visita',
      visit_scheduling: 'Programación de Visitas',
      biometric_control: 'Control Biométrico',
      visit_monitoring: 'Monitoreo de Visitas',
      visit_reports: 'Reportes de Visitas',
      visitor_statistics: 'Estadísticas de Visitantes'
    },

    // Common Terms
    common: {
      visitor: 'Visitante',
      visitors: 'Visitantes',
      visit: 'Visita',
      visits: 'Visitas',
      inmate: 'PPL',
      relationship: 'Relación',
      authorization: 'Autorización',
      biometric: 'Biométrico',
      schedule: 'Horario',
      date: 'Fecha',
      time: 'Hora',
      duration: 'Duración',
      status: 'Estado',
      actions: 'Acciones',
      search: 'Buscar',
      filter: 'Filtrar',
      save: 'Guardar',
      cancel: 'Cancelar',
      approve: 'Aprobar',
      reject: 'Rechazar',
      suspend: 'Suspender',
      activate: 'Activar',
      view: 'Ver',
      edit: 'Editar',
      delete: 'Eliminar',
      new: 'Nuevo',
      create: 'Crear',
      update: 'Actualizar',
      pending: 'Pendiente',
      approved: 'Aprobado',
      rejected: 'Rechazado',
      suspended: 'Suspendido',
      active: 'Activo',
      inactive: 'Inactivo',
      completed: 'Completado',
      cancelled: 'Cancelado',
      in_progress: 'En Progreso',
      yes: 'Sí',
      no: 'No',
      required: 'Requerido',
      optional: 'Opcional'
    },

    // Status values
    status: {
      active: 'Activo',
      inactive: 'Inactivo',
      pending: 'Pendiente',
      suspended: 'Suspendido',
      blacklisted: 'Lista Negra',
      approved: 'Aprobado',
      rejected: 'Rechazado'
    },

    // Visitor Registry
    visitor_registry: {
      title: 'Registro de Visitantes',
      subtitle: 'Gestión del registro de visitantes autorizados',
      new_visitor: 'Registrar Visitante',
      visitor_profile: 'Perfil del Visitante',
      personal_info: 'Información Personal',
      contact_info: 'Información de Contacto',
      biometric_data: 'Datos Biométricos',
      photo: 'Fotografía',
      
      // Form Fields
      form: {
        document_type: 'Tipo de Documento',
        document_number: 'Número de Documento',
        first_name: 'Primer Nombre',
        second_name: 'Segundo Nombre',
        first_surname: 'Primer Apellido',
        second_surname: 'Segundo Apellido',
        birth_date: 'Fecha de Nacimiento',
        gender: 'Género',
        phone: 'Teléfono',
        email: 'Correo Electrónico',
        address: 'Dirección',
        municipality: 'Municipio',
        department: 'Departamento',
        occupation: 'Ocupación',
        emergency_contact: 'Contacto de Emergencia',
        emergency_phone: 'Teléfono de Emergencia',
        visitor_photo: 'Foto del Visitante',
        fingerprint_template: 'Plantilla de Huella Dactilar',
        notes: 'Observaciones'
      },

      // Status
      status: {
        registered: 'Registrado',
        pending_verification: 'Pendiente de Verificación',
        verified: 'Verificado',
        suspended: 'Suspendido',
        blacklisted: 'Lista Negra'
      },

      // Messages
      messages: {
        visitor_registered: 'Visitante registrado exitosamente',
        visitor_updated: 'Información del visitante actualizada',
        visitor_suspended: 'Visitante suspendido exitosamente',
        visitor_activated: 'Visitante activado exitosamente',
        biometric_captured: 'Datos biométricos capturados',
        photo_uploaded: 'Fotografía subida exitosamente',
        error_registering: 'Error al registrar visitante',
        duplicate_document: 'Ya existe un visitante con este documento',
        invalid_age: 'Edad no válida para este tipo de visita',
        confirm_suspend: '¿Está seguro de suspender a este visitante?',
        confirm_activate: '¿Está seguro de activar a este visitante?'
      }
    },

    // Visitor Relationships
    relationships: {
      title: 'Relaciones de Visita',
      subtitle: 'Gestión de relaciones autorizadas entre visitantes y PPL',
      new_relationship: 'Nueva Relación',
      relationship_details: 'Detalles de la Relación',
      authorization_process: 'Proceso de Autorización',
      
      // Relationship Types
      types: {
        spouse: 'Cónyuge',
        child: 'Hijo/a',
        parent: 'Padre/Madre',
        sibling: 'Hermano/a',
        grandparent: 'Abuelo/a',
        grandchild: 'Nieto/a',
        uncle_aunt: 'Tío/a',
        cousin: 'Primo/a',
        friend: 'Amigo/a',
        lawyer: 'Abogado/a',
        religious: 'Líder Religioso',
        other: 'Otro'
      },

      // Authorization Status
      authorization_status: {
        pending: 'Pendiente de Autorización',
        approved: 'Autorizada',
        rejected: 'Rechazada',
        suspended: 'Suspendida',
        expired: 'Expirada'
      },

      // Form Fields
      form: {
        visitor_id: 'Visitante',
        inmate_id: 'PPL',
        relationship_type: 'Tipo de Relación',
        relationship_description: 'Descripción de la Relación',
        is_consanguineous: 'Relación Consanguínea',
        authorization_date: 'Fecha de Autorización',
        authorization_expiry: 'Fecha de Expiración',
        visit_frequency_limit: 'Límite de Frecuencia de Visitas',
        requires_supervision: 'Requiere Supervisión',
        special_conditions: 'Condiciones Especiales',
        authorization_notes: 'Notas de Autorización',
        rejection_reason: 'Razón de Rechazo'
      },

      // Messages
      messages: {
        relationship_created: 'Relación creada exitosamente',
        relationship_updated: 'Relación actualizada exitosamente',
        relationship_authorized: 'Relación autorizada exitosamente',
        relationship_rejected: 'Relación rechazada',
        relationship_suspended: 'Relación suspendida',
        relationship_deleted: 'Relación eliminada exitosamente',
        error_creating: 'Error al crear relación',
        duplicate_relationship: 'Ya existe una relación entre este visitante y PPL',
        confirm_authorize: '¿Está seguro de autorizar esta relación?',
        confirm_reject: '¿Está seguro de rechazar esta relación?',
        confirm_suspend: '¿Está seguro de suspender esta relación?',
        pending_visits_exist: 'No se puede eliminar - existen visitas pendientes'
      }
    },

    // Visit Requests
    visit_requests: {
      title: 'Solicitudes de Visita',
      subtitle: 'Gestión de solicitudes y programación de visitas',
      new_request: 'Nueva Solicitud',
      request_details: 'Detalles de la Solicitud',
      schedule_visit: 'Programar Visita',
      
      // Visit Types
      types: {
        family: 'Familiar',
        conjugal: 'Conyugal',
        legal: 'Legal',
        religious: 'Religiosa',
        medical: 'Médica',
        social: 'Social',
        official: 'Oficial'
      },

      // Request Status
      status: {
        submitted: 'Enviada',
        under_review: 'En Revisión',
        approved: 'Aprobada',
        rejected: 'Rechazada',
        scheduled: 'Programada',
        confirmed: 'Confirmada',
        cancelled: 'Cancelada'
      },

      // Form Fields
      form: {
        visitor_relationship_id: 'Relación de Visitante',
        visit_type: 'Tipo de Visita',
        requested_date: 'Fecha Solicitada',
        requested_time: 'Hora Solicitada',
        duration_requested: 'Duración Solicitada',
        purpose: 'Propósito de la Visita',
        special_requests: 'Solicitudes Especiales',
        notes: 'Notas Adicionales',
        rejection_reason: 'Razón de Rechazo',
        scheduled_date: 'Fecha Programada',
        scheduled_time: 'Hora Programada',
        scheduled_duration: 'Duración Programada',
        visit_area: 'Área de Visita',
        supervisor_assigned: 'Supervisor Asignado'
      },

      // Messages
      messages: {
        request_submitted: 'Solicitud enviada exitosamente',
        request_approved: 'Solicitud aprobada exitosamente',
        request_rejected: 'Solicitud rechazada',
        request_cancelled: 'Solicitud cancelada',
        visit_scheduled: 'Visita programada exitosamente',
        visit_confirmed: 'Visita confirmada',
        error_submitting: 'Error al enviar solicitud',
        invalid_time_slot: 'Horario no disponible',
        exceeds_frequency_limit: 'Excede el límite de frecuencia de visitas',
        confirm_approve: '¿Está seguro de aprobar esta solicitud?',
        confirm_reject: '¿Está seguro de rechazar esta solicitud?',
        confirm_cancel: '¿Está seguro de cancelar esta visita?'
      }
    },

    // Biometric Control
    biometric: {
      title: 'Control Biométrico',
      subtitle: 'Control de acceso biométrico para visitantes',
      fingerprint_verification: 'Verificación de Huella Dactilar',
      access_control: 'Control de Acceso',
      entry_log: 'Registro de Entrada',
      exit_log: 'Registro de Salida',
      
      // Device Status
      device_status: {
        online: 'En Línea',
        offline: 'Fuera de Línea',
        error: 'Error',
        maintenance: 'Mantenimiento'
      },

      // Verification Results
      verification: {
        success: 'Verificación Exitosa',
        failed: 'Verificación Fallida',
        not_found: 'Huella No Encontrada',
        poor_quality: 'Calidad Insuficiente',
        multiple_matches: 'Múltiples Coincidencias',
        device_error: 'Error del Dispositivo'
      },

      // Form Fields
      form: {
        device_id: 'Dispositivo',
        visitor_id: 'Visitante',
        verification_result: 'Resultado de Verificación',
        quality_score: 'Puntuación de Calidad',
        entry_time: 'Hora de Entrada',
        exit_time: 'Hora de Salida',
        visit_duration: 'Duración de la Visita',
        supervisor_notes: 'Notas del Supervisor',
        anomalies_detected: 'Anomalías Detectadas'
      },

      // Messages
      messages: {
        verification_successful: 'Verificación biométrica exitosa',
        verification_failed: 'Verificación biométrica fallida',
        access_granted: 'Acceso concedido',
        access_denied: 'Acceso denegado',
        device_unavailable: 'Dispositivo no disponible',
        fingerprint_enrolled: 'Huella dactilar registrada',
        poor_fingerprint_quality: 'Calidad de huella insuficiente, inténtelo nuevamente',
        multiple_attempts_failed: 'Múltiples intentos fallidos - contacte al supervisor',
        visitor_not_authorized: 'Visitante no autorizado para este horario'
      }
    },

    // Visit Monitoring
    monitoring: {
      title: 'Monitoreo de Visitas',
      subtitle: 'Supervisión y control durante las visitas',
      active_visits: 'Visitas Activas',
      visit_supervision: 'Supervisión de Visitas',
      incident_reporting: 'Reporte de Incidentes',
      
      // Visit Status
      visit_status: {
        waiting: 'En Espera',
        in_progress: 'En Progreso',
        completed: 'Completada',
        terminated: 'Terminada',
        incident: 'Con Incidente'
      },

      // Incident Types
      incident_types: {
        unauthorized_items: 'Objetos No Autorizados',
        inappropriate_behavior: 'Comportamiento Inapropiado',
        security_breach: 'Violación de Seguridad',
        medical_emergency: 'Emergencia Médica',
        verbal_altercation: 'Altercado Verbal',
        physical_altercation: 'Altercado Físico',
        rule_violation: 'Violación de Reglas',
        other: 'Otro'
      },

      // Form Fields
      form: {
        visit_id: 'ID de Visita',
        supervisor_id: 'Supervisor',
        start_time: 'Hora de Inicio',
        end_time: 'Hora de Finalización',
        visit_area: 'Área de Visita',
        incident_type: 'Tipo de Incidente',
        incident_description: 'Descripción del Incidente',
        action_taken: 'Acción Tomada',
        supervisor_notes: 'Notas del Supervisor',
        requires_follow_up: 'Requiere Seguimiento',
        visitor_conduct_score: 'Puntuación de Conducta del Visitante'
      },

      // Messages
      messages: {
        visit_started: 'Visita iniciada exitosamente',
        visit_completed: 'Visita completada exitosamente',
        visit_terminated: 'Visita terminada por el supervisor',
        incident_reported: 'Incidente reportado exitosamente',
        conduct_score_updated: 'Puntuación de conducta actualizada',
        error_starting_visit: 'Error al iniciar visita',
        confirm_terminate: '¿Está seguro de terminar esta visita?',
        incident_details_required: 'Se requieren detalles del incidente'
      }
    },

    // Visit Statistics
    statistics: {
      title: 'Estadísticas de Visitas',
      subtitle: 'Análisis y reportes del sistema de visitas',
      
      // General Stats
      general: {
        total_visitors: 'Total de Visitantes',
        active_relationships: 'Relaciones Activas',
        visits_today: 'Visitas Hoy',
        visits_this_week: 'Visitas Esta Semana',
        visits_this_month: 'Visitas Este Mes',
        average_visit_duration: 'Duración Promedio de Visita',
        visitor_satisfaction: 'Satisfacción de Visitantes',
        incident_rate: 'Tasa de Incidentes'
      },

      // Visit Stats
      visits: {
        by_type: 'Visitas por Tipo',
        by_day: 'Visitas por Día',
        by_time: 'Visitas por Hora',
        by_status: 'Visitas por Estado',
        peak_hours: 'Horas Pico',
        cancellation_rate: 'Tasa de Cancelación',
        no_show_rate: 'Tasa de Inasistencia'
      },

      // Visitor Stats
      visitors: {
        by_relationship: 'Visitantes por Relación',
        by_age_group: 'Visitantes por Grupo de Edad',
        by_gender: 'Visitantes por Género',
        by_frequency: 'Visitantes por Frecuencia',
        repeat_visitors: 'Visitantes Recurrentes',
        new_registrations: 'Nuevos Registros'
      },

      // Security Stats
      security: {
        biometric_accuracy: 'Precisión Biométrica',
        access_denials: 'Denegaciones de Acceso',
        security_incidents: 'Incidentes de Seguridad',
        unauthorized_attempts: 'Intentos No Autorizados',
        device_uptime: 'Tiempo de Actividad de Dispositivos'
      }
    },

    // Reports
    reports: {
      title: 'Reportes de Visitas',
      subtitle: 'Generación de reportes del sistema de visitas',
      
      // Report Types
      types: {
        daily_visits: 'Reporte Diario de Visitas',
        visitor_activity: 'Actividad de Visitantes',
        incident_report: 'Reporte de Incidentes',
        biometric_log: 'Registro Biométrico',
        relationship_audit: 'Auditoría de Relaciones',
        statistical_summary: 'Resumen Estadístico'
      },

      // Export Formats
      formats: {
        pdf: 'PDF',
        excel: 'Excel',
        csv: 'CSV',
        word: 'Word'
      },

      // Messages
      messages: {
        report_generated: 'Reporte generado exitosamente',
        report_exported: 'Reporte exportado exitosamente',
        error_generating: 'Error al generar reporte',
        no_data_available: 'No hay datos disponibles para el período seleccionado'
      }
    },

    // Settings
    settings: {
      title: 'Configuración de Visitas',
      subtitle: 'Configuración del sistema de visitas',
      
      // General Settings
      general: {
        visit_hours: 'Horarios de Visita',
        visit_duration: 'Duración de Visitas',
        visitor_limits: 'Límites de Visitantes',
        authorization_period: 'Período de Autorización',
        biometric_threshold: 'Umbral Biométrico'
      },

      // Visit Rules
      rules: {
        family_visit_limit: 'Límite de Visitas Familiares',
        non_family_visit_limit: 'Límite de Visitas No Familiares',
        conjugal_visit_frequency: 'Frecuencia de Visitas Conyugales',
        minor_visit_rules: 'Reglas para Menores de Edad',
        legal_visit_priority: 'Prioridad de Visitas Legales'
      },

      // Security Settings
      security: {
        fingerprint_quality_threshold: 'Umbral de Calidad de Huella',
        max_verification_attempts: 'Máximo de Intentos de Verificación',
        device_timeout: 'Tiempo de Espera del Dispositivo',
        incident_auto_notification: 'Notificación Automática de Incidentes',
        supervisor_override: 'Anulación de Supervisor'
      }
    },

    // Biometric Control Component
    biometricControl: {
      title: 'Control Biométrico',
      deviceStatus: 'Estado de Dispositivos',
      newRegistration: 'Nuevo Registro',
      connectedDevices: 'Dispositivos Conectados',
      disconnectedDevices: 'Dispositivos Desconectados',
      todayScans: 'Escaneos de Hoy',
      failedScans: 'Escaneos Fallidos',
      scanner: 'Escáner',
      scanResult: 'Resultado del Escaneo',
      approve: 'Aprobar',
      deny: 'Denegar',
      startScan: 'Iniciar Escaneo',
      accessLog: 'Registro de Accesos',
      pendingRegistrations: 'Registros Pendientes',
      time: 'Hora',
      visitor: 'Visitante',
      type: 'Tipo',
      location: 'Ubicación',
      result: 'Resultado',
      device: 'Dispositivo',
      registrationDate: 'Fecha de Registro',
      status: 'Estado',
      pendingBiometric: 'Pendiente Biométrico',
      register: 'Registrar',
      deviceManagement: 'Gestión de Dispositivos',
      deviceName: 'Nombre del Dispositivo',
      lastActivity: 'Última Actividad',
      totalScans: 'Total de Escaneos',
      restart: 'Reiniciar',
      connect: 'Conectar'
    },

    // Visitor Detail
    visitorDetail: {
      title: 'Detalle del Visitante',
      personalInfo: 'Información Personal',
      securityInfo: 'Información de Seguridad',
      relatedInmates: 'PPLs Relacionados',
      visitHistory: 'Historial de Visitas',
      fullName: 'Nombre Completo',
      documentType: 'Tipo de Documento',
      documentNumber: 'Número de Documento',
      birthDate: 'Fecha de Nacimiento',
      age: 'Edad',
      phone: 'Teléfono',
      email: 'Correo Electrónico',
      address: 'Dirección',
      status: 'Estado',
      biometricStatus: 'Estado Biométrico',
      biometricRegistered: 'Biometría Registrada',
      biometricPending: 'Biometría Pendiente',
      registrationDate: 'Fecha de Registro',
      lastVisit: 'Última Visita',
      totalVisits: 'Total de Visitas',
      inmateCode: 'Código PPL',
      inmateName: 'Nombre del PPL',
      relationship: 'Relación',
      visitPermission: 'Permiso de Visita',
      lastInmateVisit: 'Última Visita a este PPL',
      visitDate: 'Fecha de Visita',
      visitTime: 'Hora de Visita',
      visitType: 'Tipo de Visita',
      duration: 'Duración',
      observations: 'Observaciones'
    }
  }
}