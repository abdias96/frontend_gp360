export default {
  // General Operations
  operations: {
    title: 'Operaciones PPL',
    subtitle: 'Gestión operativa del sistema penitenciario',
    
    // Common terms
    common: {
      inmate: 'PPL',
      inmates: 'PPL',
      date: 'Fecha',
      time: 'Hora',
      status: 'Estado',
      actions: 'Acciones',
      search: 'Buscar',
      filter: 'Filtrar',
      clear_filters: 'Limpiar Filtros',
      loading: 'Cargando...',
      no_data: 'No hay datos disponibles',
      save: 'Guardar',
      cancel: 'Cancelar',
      close: 'Cerrar',
      edit: 'Editar',
      delete: 'Eliminar',
      view: 'Ver',
      continue: 'Continuar',
      complete: 'Completar',
      start: 'Iniciar',
      pending: 'Pendiente',
      in_progress: 'En Proceso',
      completed: 'Completado',
      cancelled: 'Cancelado',
      verified: 'Verificado',
      today: 'Hoy',
      yesterday: 'Ayer',
      tomorrow: 'Mañana',
      duration: 'Duración',
      responsible: 'Responsable',
      observations: 'Observaciones',
      notes: 'Notas',
      reason: 'Razón',
      required_field: 'Campo requerido',
      invalid_data: 'Datos inválidos',
      success: 'Exitoso',
      error: 'Error',
      warning: 'Advertencia',
      confirm: 'Confirmar',
      yes: 'Sí',
      no: 'No'
    },

    // Admissions Module
    admissions: {
      title: 'Gestión de Admisiones',
      subtitle: 'Proceso de admisión de nuevas personas privadas de libertad',
      new_admission: 'Nueva Admisión',
      admission_process: 'Proceso de Admisión',
      admission_type: 'Tipo de Admisión',
      admission_date: 'Fecha de Admisión',
      admission_time: 'Hora de Admisión',
      progress: 'Progreso',
      steps_completed: 'Pasos Completados',
      time_elapsed: 'Tiempo Transcurrido',
      estimated_completion: 'Finalización Estimada',
      create_admission: 'Crear Admisión',
      
      // Stats
      today: 'Hoy',
      in_progress: 'En Proceso',
      pending_documents: 'Documentos Pendientes',
      completed_this_week: 'Completadas Esta Semana',
      
      // Table Headers
      admission_number: 'No. Admisión',
      inmate_name: 'Nombre del PPL',
      document: 'Documento',
      arrival_date: 'Fecha de Ingreso',
      arrival_time: 'Hora de Ingreso',
      status: 'Estado',
      current_stage: 'Etapa Actual',
      
      // Status
      status_in_progress: 'En Proceso',
      status_pending_documents: 'Documentos Pendientes',
      status_completed: 'Completada',
      status_pending: 'Pendiente',
      
      // Form Steps
      basic_info: 'Información Básica',
      basic_info_desc: 'Datos de identificación',
      quick_registration: 'Registro Rápido',
      quick_registration_desc: 'Información urgente',
      confirmation: 'Confirmación',
      confirmation_desc: 'Revisar y confirmar',
      
      // Form Fields
      document_type: 'Tipo de Documento',
      document_number: 'Número de Documento',
      first_name: 'Primer Nombre',
      last_name: 'Primer Apellido',
      known_as: 'Conocido como',
      origin_court: 'Juzgado de Procedencia',
      legal_status: 'Situación Legal',
      
      // Quick Process
      quick_process_info: 'Proceso Simplificado',
      quick_process_description: 'Capture información básica ahora. Los detalles se completarán después del ingreso.',
      medical_emergency: 'Emergencia Médica',
      visible_injuries: 'Lesiones Visibles',
      requires_interpreter: 'Requiere Intérprete',
      initial_observations: 'Observaciones Iniciales',
      temporary_location: 'Ubicación Temporal',
      
      // Summary
      summary: 'Resumen de Información',
      full_name: 'Nombre Completo',
      arrival: 'Llegada',
      court: 'Juzgado',
      location: 'Ubicación',
      
      // Next Steps
      next_steps_title: 'Próximos Pasos',
      next_steps_description: 'Después de crear la admisión, se deberán completar los siguientes procesos:',
      step_biometric: 'Registro biométrico y fotografía',
      step_medical: 'Evaluación médica inicial',
      step_belongings: 'Registro de pertenencias',
      step_notification: 'Notificación a autoridades',
      
      // Messages
      fill_required_fields: 'Por favor complete todos los campos requeridos',
      admission_created: 'Admisión creada exitosamente',
      admission_error: 'Error al crear la admisión',
      
      // Admission Types
      types: {
        preventive_detention: 'Prisión Preventiva',
        sentence_execution: 'Ejecución de Sentencia',
        transfer: 'Traslado',
        reentry: 'Reingreso',
        judicial_order: 'Orden Judicial'
      },

      // Admission Steps
      steps: {
        personal_data: 'Datos Personales',
        legal_information: 'Información Legal',
        medical_examination: 'Examen Médico',
        biometric_registration: 'Registro Biométrico',
        photo_capture: 'Captura de Foto',
        belongings_inventory: 'Inventario de Pertenencias',
        security_classification: 'Clasificación de Seguridad',
        cell_assignment: 'Asignación de Celda',
        orientation_briefing: 'Orientación Inicial',
        documentation_completion: 'Completar Documentación',
        supervisor_review: 'Revisión de Supervisor',
        admission_completion: 'Finalización de Admisión'
      },

      // Admission Status
      status: {
        pending: 'Pendiente',
        in_progress: 'En Proceso',
        completed: 'Completado',
        cancelled: 'Cancelado',
        on_hold: 'En Espera'
      },

      // Messages
      messages: {
        create_success: 'Admisión creada exitosamente',
        update_success: 'Admisión actualizada exitosamente',
        cancel_success: 'Admisión cancelada exitosamente',
        complete_success: 'Admisión completada exitosamente',
        step_complete: 'Paso completado exitosamente',
        error_creating: 'Error al crear admisión',
        error_updating: 'Error al actualizar admisión',
        confirm_cancel: '¿Está seguro de cancelar esta admisión?',
        confirm_complete: '¿Confirma que la admisión está completa?',
        admission_in_progress: 'La admisión ya está en proceso',
        invalid_step: 'Paso de admisión inválido',
        missing_data: 'Faltan datos requeridos para este paso'
      },

      // Form Labels
      form: {
        document_type: 'Tipo de Documento',
        document_number: 'Número de Documento',
        first_name: 'Primer Nombre',
        second_name: 'Segundo Nombre',
        last_name: 'Primer Apellido',
        second_last_name: 'Segundo Apellido',
        birth_date: 'Fecha de Nacimiento',
        gender: 'Género',
        civil_status: 'Estado Civil',
        nationality: 'Nacionalidad',
        ethnic_group: 'Grupo Étnico',
        blood_type: 'Tipo de Sangre',
        court: 'Juzgado/Tribunal',
        case_number: 'Número de Expediente',
        process_number: 'Número de Proceso',
        main_crime: 'Delito Principal',
        sentence_years: 'Años de Sentencia',
        sentence_months: 'Meses de Sentencia',
        sentence_days: 'Días de Sentencia',
        health_status: 'Estado de Salud',
        immediate_attention: 'Requiere Atención Inmediata',
        chronic_diseases: 'Enfermedades Crónicas',
        current_medications: 'Medicamentos Actuales',
        known_allergies: 'Alergias Conocidas',
        medical_observations: 'Observaciones Médicas'
      }
    },

    // Daily Counts Module
    counts: {
      title: 'Conteo Diario de PPL',
      subtitle: 'Control y seguimiento de conteos obligatorios',
      new_count: 'Iniciar Conteo',
      emergency_count: 'Conteo de Emergencia',
      count_type: 'Tipo de Conteo',
      scheduled_time: 'Hora Programada',
      expected_count: 'Población Esperada',
      physical_count: 'Conteo Físico',
      discrepancy: 'Discrepancia',
      verify_count: 'Verificar Conteo',
      resolve_discrepancy: 'Resolver Discrepancia',
      total_population: 'Población Total',
      completed_today: 'Completados Hoy',
      with_discrepancies: 'Con Discrepancias',

      // Count Types
      types: {
        morning: 'Matutino (06:00)',
        midday: 'Medio Día (12:00)',
        evening: 'Vespertino (18:00)',
        night: 'Nocturno (21:00)',
        emergency: 'Emergencia',
        recount: 'Reconteo'
      },

      // Count Status
      status: {
        pending: 'Pendiente',
        in_progress: 'En Proceso',
        completed: 'Completado',
        with_discrepancy: 'Con Discrepancia',
        resolved: 'Resuelto',
        verified: 'Verificado',
        overdue: 'Atrasado'
      },

      // Location Breakdown
      locations: {
        in_medical: 'En Consulta Médica',
        in_court: 'En Tribunales',
        in_visits: 'En Visitas',
        in_programs: 'En Programas',
        in_work: 'En Trabajo',
        other_justified: 'Otros Justificados',
        other_justified_reason: 'Razón de Otros Justificados'
      },

      // Messages
      messages: {
        count_started: 'Conteo iniciado exitosamente',
        count_completed: 'Conteo completado exitosamente',
        count_verified: 'Conteo verificado exitosamente',
        discrepancy_resolved: 'Discrepancia resuelta exitosamente',
        discrepancy_found: 'Se encontró una discrepancia en el conteo',
        count_matches: 'El conteo coincide con lo esperado',
        error_starting: 'Error al iniciar conteo',
        error_completing: 'Error al completar conteo',
        confirm_verify: '¿Está seguro de verificar este conteo?',
        missing_inmates: 'PPL faltantes en el conteo',
        discrepancy_explanation: 'Explicación de la discrepancia',
        corrective_action: 'Acción correctiva tomada',
        no_active_movements: 'No hay movimientos activos en este momento'
      },

      // Form Fields
      form: {
        count_summary: 'Resumen del Conteo',
        total_counted: 'Total Contado',
        total_justified: 'Total Justificado',
        difference: 'Diferencia',
        coincides: 'Coincide',
        explanation: 'Explicación',
        corrective_action: 'Acción Correctiva',
        inmates_located: 'PPL Localizados'
      }
    },

    // Movements Module
    movements: {
      title: 'Control de Movimientos',
      subtitle: 'Gestión de movimientos internos y externos de PPL',
      new_movement: 'Programar Movimiento',
      emergency_movement: 'Movimiento de Emergencia',
      active_movements: 'Movimientos Activos',
      movement_type: 'Tipo de Movimiento',
      origin: 'Origen',
      destination: 'Destino',
      departure_time: 'Hora de Salida',
      return_time: 'Hora de Retorno',
      expected_return: 'Retorno Esperado',
      actual_return: 'Retorno Real',
      requires_escort: 'Requiere Escolta',
      escort_officer: 'Oficial de Escolta',
      overdue: 'Atrasado',
      delay_minutes: 'Minutos de Retraso',

      // Movement Types
      types: {
        medical: 'Médico',
        education: 'Educación',
        work: 'Trabajo',
        visit: 'Visita',
        court: 'Tribunal',
        administrative: 'Administrativo',
        religious: 'Religioso',
        sports: 'Deportes',
        emergency: 'Emergencia',
        transfer: 'Traslado'
      },

      // Movement Status
      status: {
        scheduled: 'Programado',
        in_transit: 'En Tránsito',
        at_destination: 'En Destino',
        returning: 'Regresando',
        completed: 'Completado',
        cancelled: 'Cancelado'
      },

      // Messages
      messages: {
        movement_scheduled: 'Movimiento programado exitosamente',
        movement_started: 'Movimiento iniciado exitosamente',
        movement_completed: 'Movimiento completado exitosamente',
        movement_cancelled: 'Movimiento cancelado exitosamente',
        status_updated: 'Estado actualizado exitosamente',
        emergency_created: 'Movimiento de emergencia creado',
        error_scheduling: 'Error al programar movimiento',
        error_starting: 'Error al iniciar movimiento',
        confirm_start: '¿Confirma el inicio de este movimiento?',
        confirm_complete: '¿Confirma la finalización de este movimiento?',
        confirm_cancel: '¿Está seguro de cancelar este movimiento?',
        cancellation_reason: 'Ingrese la razón de cancelación:',
        movement_overdue: 'Movimiento atrasado',
        escort_required: 'Se requiere escolta para este movimiento',
        no_active_movements: 'No hay movimientos activos'
      },

      // Form Fields
      form: {
        to_location: 'Ubicación de Destino',
        to_sector: 'Sector de Destino',
        reason: 'Razón del Movimiento',
        special_instructions: 'Instrucciones Especiales',
        departure_notes: 'Notas de Salida',
        return_notes: 'Notas de Retorno',
        emergency_type: 'Tipo de Emergencia',
        actual_escort: 'Escolta Real'
      }
    },

    // Releases Module
    releases: {
      title: 'Gestión de Liberaciones',
      subtitle: 'Proceso de liberación y seguimiento',
      release_planning: 'Planificación de Liberaciones',
      scheduled_releases: 'Liberaciones Programadas',
      new_plan: 'Nuevo Plan de Liberación',
      new_release: 'Nueva Orden de Liberación',
      eligible_inmates: 'PPL Elegibles',
      release_type: 'Tipo de Liberación',
      projected_date: 'Fecha Proyectada',
      release_order: 'Orden de Liberación',
      days_until_release: 'Días para Liberación',
      release_preparation: 'Preparación para Liberación',

      // Release Types
      types: {
        sentence_completion: 'Cumplimiento de Sentencia',
        conditional_release: 'Libertad Condicional',
        substitute_measures: 'Medidas Sustitutivas',
        judicial_order: 'Orden Judicial',
        deportation: 'Deportación'
      },

      // Release Status
      status: {
        pending: 'Pendiente',
        in_planning: 'En Planificación',
        ready: 'Listo',
        scheduled: 'Programado',
        in_process: 'En Proceso',
        completed: 'Completado',
        cancelled: 'Cancelado'
      },

      // Evaluation Areas
      evaluations: {
        legal: 'Evaluación Legal',
        psychological: 'Evaluación Psicológica',
        social: 'Evaluación Social',
        medical: 'Evaluación Médica',
        educational: 'Evaluación Educativa'
      },

      // Preparation Areas
      preparation: {
        program_complete: 'Programa de Preparación Completo',
        documents_ready: 'Documentos Listos',
        family_coordinated: 'Familia Coordinada',
        employment_coordinated: 'Empleo Coordinado',
        health_referrals_ready: 'Referencias de Salud Listas'
      },

      // Release Steps
      steps: {
        order_verified: 'Orden Verificada',
        identity_confirmed: 'Identidad Confirmada',
        belongings_returned: 'Pertenencias Devueltas',
        accounts_settled: 'Cuentas Liquidadas',
        documents_delivered: 'Documentos Entregados',
        medical_clearance: 'Autorización Médica',
        exit_photo_taken: 'Foto de Salida Tomada',
        release_kit_provided: 'Kit de Liberación Entregado'
      },

      // Messages
      messages: {
        plan_created: 'Plan de liberación creado exitosamente',
        plan_updated: 'Plan de liberación actualizado exitosamente',
        release_scheduled: 'Liberación programada exitosamente',
        release_completed: 'Liberación completada exitosamente',
        step_completed: 'Paso completado exitosamente',
        evaluation_updated: 'Evaluación actualizada exitosamente',
        preparation_updated: 'Preparación actualizada exitosamente',
        error_creating_plan: 'Error al crear plan de liberación',
        error_scheduling_release: 'Error al programar liberación',
        confirm_release: '¿Confirma la liberación de este PPL?',
        release_requirements_pending: 'Faltan requisitos para la liberación',
        already_has_plan: 'El PPL ya tiene un plan de liberación activo',
        eligibility_criteria: 'Criterios de elegibilidad'
      },

      // Form Fields
      form: {
        projected_release_date: 'Fecha Proyectada de Liberación',
        initial_notes: 'Notas Iniciales',
        residence_address: 'Dirección de Residencia',
        residence_municipality: 'Municipio de Residencia',
        family_contact_name: 'Nombre de Contacto Familiar',
        family_contact_phone: 'Teléfono de Contacto Familiar',
        employment_plan: 'Plan de Empleo',
        education_plan: 'Plan Educativo',
        support_network: 'Red de Apoyo',
        risk_factors: 'Factores de Riesgo',
        special_needs: 'Necesidades Especiales',
        release_order_number: 'Número de Orden de Liberación',
        issuing_authority: 'Autoridad Emisora',
        order_date: 'Fecha de la Orden',
        scheduled_release_datetime: 'Fecha y Hora Programada',
        released_to: 'Liberado a',
        transport_method: 'Método de Transporte',
        destination_address: 'Dirección de Destino',
        special_conditions: 'Condiciones Especiales',
        first_report_date: 'Fecha de Primer Reporte'
      }
    },

    // Statistics and Reports
    statistics: {
      title: 'Estadísticas Operativas',
      admissions_stats: 'Estadísticas de Admisiones',
      count_stats: 'Estadísticas de Conteos',
      movement_stats: 'Estadísticas de Movimientos',
      release_stats: 'Estadísticas de Liberaciones',
      total: 'Total',
      average: 'Promedio',
      percentage: 'Porcentaje',
      rate: 'Tasa',
      by_type: 'Por Tipo',
      by_status: 'Por Estado',
      by_date: 'Por Fecha',
      today: 'Hoy',
      this_week: 'Esta Semana',
      this_month: 'Este Mes',
      this_year: 'Este Año',
      processing_time: 'Tiempo de Procesamiento',
      success_rate: 'Tasa de Éxito',
      compliance_rate: 'Tasa de Cumplimiento',
      on_time_rate: 'Tasa de Puntualidad',
      peak_hours: 'Horas Pico'
    }
  }
}