export const renapTranslations = {
  en: {
    renap: {
      photoVerification: {
        title: "RENAP Photo Verification",
        subtitle: "Compare GP360 photos and information with RENAP data to detect possible identity fraud",
        searchInmate: "Search Inmate",
        searchPlaceholder: "Search by name, CUI or identification number...",
        searchResults: "Search Results",
        verify: "Verify",
        searchError: "Error searching inmates",
        loadError: "Error loading verification data",
        refreshSuccess: "Data refreshed successfully",
        refreshError: "Error refreshing data",
        refresh: "Refresh Data",
        reportFraud: "Report Fraud",
        reportFraudTitle: "Report Identity Fraud",
        reportFraudConfirm: "This will create a security alert for possible identity fraud. Do you want to continue?",
        confirmReport: "Yes, Report",
        reportSubmitted: "Report Submitted",
        reportSubmittedDesc: "A security alert has been created. The security team will be notified.",
        gp360Data: "GP360 Data",
        renapData: "RENAP Data",
        photos: "Photos",
        noPhotos: "No photos available",
        primary: "Primary",
        personalData: "Personal Data",
        officialPhoto: "Official Photo",
        noRenapPhoto: "No photo available in RENAP",
        noRenapData: "No RENAP data available",
        noRenapDataHint: "The inmate may not have a CUI registered or the query to RENAP failed.",
        cachedDaysAgo: "Cached {days} days ago",
        nationality: "Nationality",
        birthPlace: "Place of Birth",
        deceasedAlert: "Person registered as DECEASED in RENAP",
        discrepancies: "Discrepancies Found",
        field: "Field",
        gp360Value: "GP360 Value",
        renapValue: "RENAP Value",
        severity: "Severity",
        severityLevels: {
          critical: "Critical",
          high: "High",
          medium: "Medium",
          low: "Low"
        },
        status: {
          verified: {
            title: "Identity Verified",
            description: "GP360 data matches RENAP records. No discrepancies found."
          },
          minor_discrepancies: {
            title: "Minor Discrepancies",
            description: "Some differences found in non-critical fields. Manual review recommended."
          },
          potential_fraud: {
            title: "Potential Identity Fraud",
            description: "Critical differences found in names or birth date. Immediate investigation required."
          },
          deceased_in_renap: {
            title: "Person Deceased in RENAP",
            description: "RENAP records indicate this person is deceased. This is a serious alert."
          },
          no_renap_data: {
            title: "No RENAP Data",
            description: "Could not retrieve RENAP data. The inmate may not have a valid CUI."
          }
        }
      }
    }
  },
  es: {
    renap: {
      photoVerification: {
        title: "Verificacion de Fotos RENAP",
        subtitle: "Comparar fotos e informacion de GP360 con datos de RENAP para detectar posible suplantacion de identidad",
        searchInmate: "Buscar Interno",
        searchPlaceholder: "Buscar por nombre, CUI o numero de identificacion...",
        searchResults: "Resultados de Busqueda",
        verify: "Verificar",
        searchError: "Error al buscar internos",
        loadError: "Error al cargar datos de verificacion",
        refreshSuccess: "Datos actualizados exitosamente",
        refreshError: "Error al actualizar datos",
        refresh: "Actualizar Datos",
        reportFraud: "Reportar Fraude",
        reportFraudTitle: "Reportar Fraude de Identidad",
        reportFraudConfirm: "Esto creara una alerta de seguridad por posible fraude de identidad. Desea continuar?",
        confirmReport: "Si, Reportar",
        reportSubmitted: "Reporte Enviado",
        reportSubmittedDesc: "Se ha creado una alerta de seguridad. El equipo de seguridad sera notificado.",
        gp360Data: "Datos GP360",
        renapData: "Datos RENAP",
        photos: "Fotografias",
        noPhotos: "No hay fotografias disponibles",
        primary: "Principal",
        personalData: "Datos Personales",
        officialPhoto: "Foto Oficial",
        noRenapPhoto: "Sin foto disponible en RENAP",
        noRenapData: "Sin datos de RENAP disponibles",
        noRenapDataHint: "El interno puede no tener CUI registrado o la consulta a RENAP fallo.",
        cachedDaysAgo: "Cache de hace {days} dias",
        nationality: "Nacionalidad",
        birthPlace: "Lugar de Nacimiento",
        deceasedAlert: "Persona registrada como FALLECIDA en RENAP",
        discrepancies: "Discrepancias Encontradas",
        field: "Campo",
        gp360Value: "Valor GP360",
        renapValue: "Valor RENAP",
        severity: "Severidad",
        severityLevels: {
          critical: "Critica",
          high: "Alta",
          medium: "Media",
          low: "Baja"
        },
        status: {
          verified: {
            title: "Identidad Verificada",
            description: "Los datos de GP360 coinciden con los registros de RENAP. No se encontraron discrepancias."
          },
          minor_discrepancies: {
            title: "Discrepancias Menores",
            description: "Se encontraron diferencias en campos no criticos. Se recomienda revision manual."
          },
          potential_fraud: {
            title: "Posible Suplantacion de Identidad",
            description: "Se encontraron diferencias criticas en nombres o fecha de nacimiento. Requiere investigacion inmediata."
          },
          deceased_in_renap: {
            title: "Persona Fallecida en RENAP",
            description: "Los registros de RENAP indican que esta persona fallecio. Esta es una alerta seria."
          },
          no_renap_data: {
            title: "Sin Datos de RENAP",
            description: "No se pudieron obtener datos de RENAP. El interno puede no tener un CUI valido."
          }
        }
      }
    }
  }
};
