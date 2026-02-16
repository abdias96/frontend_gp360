export const emergencyTranslations = {
  en: {
    emergency: {
      incidents: {
        title: "Emergency Incidents",
        subtitle: "Manage and track emergency incidents in penitentiary centers",
        searchPlaceholder: "Search by number, description, location...",
        filters: "Filters",
        clearFilters: "Clear Filters",
        newIncident: "New Incident",
        loading: "Loading...",
        retry: "Retry",
        noIncidents: "No emergency incidents found",
        noIncidentsDescription: "No incidents match the current filters. Try adjusting your search criteria.",
        confirmDelete: "Are you sure you want to delete this incident?",
        confirmDeleteText: "This action can be undone.",
        deleted: "Incident deleted successfully",
        created: "Incident created successfully",
        updated: "Incident updated successfully",
        error: "Error",

        // Statistics
        stats: {
          total: "Total Incidents",
          active: "Active",
          withInjuries: "With Injuries",
          withFatalities: "With Fatalities",
        },

        // Table columns
        columns: {
          incidentNumber: "Incident No.",
          center: "Center",
          type: "Type",
          severity: "Severity",
          status: "Status",
          date: "Date",
          injuries: "Injuries",
          fatalities: "Fatalities",
          actions: "Actions",
        },

        // Filter labels
        filterLabels: {
          center: "Center",
          allCenters: "All Centers",
          type: "Emergency Type",
          allTypes: "All Types",
          severity: "Severity",
          allSeverities: "All Severities",
          status: "Status",
          allStatuses: "All Statuses",
          dateFrom: "Date From",
          dateTo: "Date To",
        },

        // Severity options
        severity: {
          minor: "Minor",
          moderate: "Moderate",
          major: "Major",
          critical: "Critical",
          catastrophic: "Catastrophic",
        },

        // Status options
        status: {
          active: "Active",
          contained: "Contained",
          under_control: "Under Control",
          resolved: "Resolved",
          investigation_pending: "Investigation Pending",
          closed: "Closed",
        },

        // Form - Create/Edit modal
        form: {
          createTitle: "Register Emergency Incident",
          editTitle: "Edit Emergency Incident",
          viewTitle: "Incident Details",

          // Sections
          sectionGeneral: "General Information",
          sectionLocation: "Location",
          sectionDescription: "Description",
          sectionPeople: "People Involved",
          sectionCasualties: "Casualties",
          sectionResponse: "Response",
          sectionDamage: "Property Damage",

          // Fields
          center: "Center",
          selectCenter: "Select center...",
          sector: "Sector",
          selectSector: "Select sector...",
          emergencyType: "Emergency Type",
          selectType: "Select type...",
          severity: "Severity",
          selectSeverity: "Select severity...",
          status: "Status",
          selectStatus: "Select status...",
          startTime: "Start Date/Time",
          endTime: "End Date/Time",
          specificLocation: "Specific Location",
          specificLocationPlaceholder: "e.g. Module B, Sector 3",
          facilityWideImpact: "Facility-wide impact",
          description: "Description",
          descriptionPlaceholder: "Describe the incident in detail...",
          immediateCause: "Immediate Cause",
          immediateCausePlaceholder: "What triggered the incident...",
          contributingFactors: "Contributing Factors",
          contributingFactorsPlaceholder: "Context or contributing factors...",
          observations: "Observations",
          observationsPlaceholder: "Additional observations...",

          // People
          inmatesInvolved: "PPL Involved",
          staffInvolved: "Staff Involved",
          visitorsInvolved: "Visitors Involved",

          // Casualties
          pplInjuries: "PPL Injuries",
          pplFatalities: "PPL Fatalities",
          staffInjuries: "Staff Injuries (Guards)",
          staffFatalities: "Staff Fatalities (Guards)",
          policeInjuries: "Police Injuries",
          policeFatalities: "Police Fatalities",
          injuryDetails: "Injury Details",
          injuryDetailsPlaceholder: "Details about injuries...",

          // Response
          lockdownInitiated: "Lockdown initiated",
          evacuationOrdered: "Evacuation ordered",
          externalAssistance: "External assistance requested",
          externalAgencies: "External agencies contacted",
          externalAgenciesPlaceholder: "e.g. Firefighters, PNC, Red Cross",

          // Damage
          propertyDamage: "Property damage reported",
          estimatedCost: "Estimated Damage Cost (Q)",
          damageDescription: "Damage Description",
          damageDescriptionPlaceholder: "Describe the damages...",

          // Commander
          commander: "Incident Commander",
          selectCommander: "Select commander...",

          // Buttons
          save: "Save",
          cancel: "Cancel",
          close: "Close",
        },

        // View detail
        detail: {
          reportedBy: "Reported By",
          createdBy: "Created By",
          commander: "Commander",
          createdAt: "Created At",
          updatedAt: "Updated At",
          totalInjuries: "Total Injuries",
          totalFatalities: "Total Fatalities",
        },

        // Actions
        actions: {
          view: "View Details",
          edit: "Edit",
          delete: "Delete",
        },
      },
    },
  },
  es: {
    emergency: {
      incidents: {
        title: "Incidentes de Emergencia",
        subtitle: "Gestionar y dar seguimiento a incidentes de emergencia en centros penitenciarios",
        searchPlaceholder: "Buscar por número, descripción, ubicación...",
        filters: "Filtros",
        clearFilters: "Limpiar Filtros",
        newIncident: "Nuevo Incidente",
        loading: "Cargando...",
        retry: "Reintentar",
        noIncidents: "No se encontraron incidentes de emergencia",
        noIncidentsDescription: "No hay incidentes que coincidan con los filtros actuales. Intente ajustar sus criterios de búsqueda.",
        confirmDelete: "¿Está seguro de que desea eliminar este incidente?",
        confirmDeleteText: "Esta acción se puede deshacer.",
        deleted: "Incidente eliminado exitosamente",
        created: "Incidente creado exitosamente",
        updated: "Incidente actualizado exitosamente",
        error: "Error",

        // Statistics
        stats: {
          total: "Total Incidentes",
          active: "Activos",
          withInjuries: "Con Heridos",
          withFatalities: "Con Fallecidos",
        },

        // Table columns
        columns: {
          incidentNumber: "No. Incidente",
          center: "Centro",
          type: "Tipo",
          severity: "Severidad",
          status: "Estado",
          date: "Fecha",
          injuries: "Heridos",
          fatalities: "Fallecidos",
          actions: "Acciones",
        },

        // Filter labels
        filterLabels: {
          center: "Centro",
          allCenters: "Todos los centros",
          type: "Tipo de Emergencia",
          allTypes: "Todos los tipos",
          severity: "Severidad",
          allSeverities: "Todas las severidades",
          status: "Estado",
          allStatuses: "Todos los estados",
          dateFrom: "Fecha Desde",
          dateTo: "Fecha Hasta",
        },

        // Severity options
        severity: {
          minor: "Menor",
          moderate: "Moderado",
          major: "Mayor",
          critical: "Crítico",
          catastrophic: "Catastrófico",
        },

        // Status options
        status: {
          active: "Activo",
          contained: "Contenido",
          under_control: "Bajo Control",
          resolved: "Resuelto",
          investigation_pending: "Investigación Pendiente",
          closed: "Cerrado",
        },

        // Form - Create/Edit modal
        form: {
          createTitle: "Registrar Incidente de Emergencia",
          editTitle: "Editar Incidente de Emergencia",
          viewTitle: "Detalle del Incidente",

          // Sections
          sectionGeneral: "Información General",
          sectionLocation: "Ubicación",
          sectionDescription: "Descripción",
          sectionPeople: "Personas Involucradas",
          sectionCasualties: "Bajas",
          sectionResponse: "Respuesta",
          sectionDamage: "Daños a Propiedad",

          // Fields
          center: "Centro",
          selectCenter: "Seleccione centro...",
          sector: "Sector",
          selectSector: "Seleccione sector...",
          emergencyType: "Tipo de Emergencia",
          selectType: "Seleccione tipo...",
          severity: "Severidad",
          selectSeverity: "Seleccione severidad...",
          status: "Estado",
          selectStatus: "Seleccione estado...",
          startTime: "Fecha/Hora Inicio",
          endTime: "Fecha/Hora Fin",
          specificLocation: "Ubicación Específica",
          specificLocationPlaceholder: "Ej. Módulo B, Sector 3",
          facilityWideImpact: "Impacto en todo el centro",
          description: "Descripción",
          descriptionPlaceholder: "Describa el incidente en detalle...",
          immediateCause: "Causa Inmediata",
          immediateCausePlaceholder: "Qué desencadenó el incidente...",
          contributingFactors: "Factores Contribuyentes",
          contributingFactorsPlaceholder: "Contexto o factores que contribuyeron...",
          observations: "Observaciones",
          observationsPlaceholder: "Observaciones adicionales...",

          // People
          inmatesInvolved: "PPL Involucrados",
          staffInvolved: "Personal Involucrado",
          visitorsInvolved: "Visitantes Involucrados",

          // Casualties
          pplInjuries: "PPL Heridos",
          pplFatalities: "PPL Fallecidos",
          staffInjuries: "Guardias SP Heridos",
          staffFatalities: "Guardias SP Fallecidos",
          policeInjuries: "Policías Heridos",
          policeFatalities: "Policías Fallecidos",
          injuryDetails: "Detalle de Lesiones",
          injuryDetailsPlaceholder: "Detalles sobre las lesiones...",

          // Response
          lockdownInitiated: "Bloqueo iniciado",
          evacuationOrdered: "Evacuación ordenada",
          externalAssistance: "Asistencia externa solicitada",
          externalAgencies: "Agencias externas contactadas",
          externalAgenciesPlaceholder: "Ej. Bomberos, PNC, Cruz Roja",

          // Damage
          propertyDamage: "Daños a propiedad reportados",
          estimatedCost: "Costo Estimado de Daños (Q)",
          damageDescription: "Descripción de Daños",
          damageDescriptionPlaceholder: "Describa los daños...",

          // Commander
          commander: "Comandante del Incidente",
          selectCommander: "Seleccione comandante...",

          // Buttons
          save: "Guardar",
          cancel: "Cancelar",
          close: "Cerrar",
        },

        // View detail
        detail: {
          reportedBy: "Reportado Por",
          createdBy: "Creado Por",
          commander: "Comandante",
          createdAt: "Fecha de Creación",
          updatedAt: "Última Actualización",
          totalInjuries: "Total Heridos",
          totalFatalities: "Total Fallecidos",
        },

        // Actions
        actions: {
          view: "Ver Detalle",
          edit: "Editar",
          delete: "Eliminar",
        },
      },
    },
  },
};
