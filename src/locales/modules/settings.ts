export const settingsTranslations = {
  en: {
    settings: {
      title: "System Settings",
      systemConfiguration: "System Configuration",
      warning: {
        title: "Important Notice",
        description:
          "These settings affect the entire system. Changes will require administrator privileges.",
      },
      general: {
        title: "General Settings",
        notice: {
          title: "General Configuration",
          description: "Configure basic system settings and preferences.",
        },
        system: {
          title: "System Information",
          appName: "Application Name",
          appNamePlaceholder: "Enter application name",
          appNameHelp: "This name will be displayed throughout the system",
          appUrl: "Application URL",
          appUrlPlaceholder: "https://example.com",
          appUrlHelp: "The main URL for the application",
          contactEmail: "Contact Email",
          contactEmailPlaceholder: "admin@example.com",
          contactEmailHelp: "System administrator contact email",
        },
        regional: {
          title: "Regional Settings",
          timezone: "Timezone",
          timezones: {
            guatemala: "Guatemala (UTC-6)",
            mexico: "Mexico City (UTC-6)",
            newYork: "New York (UTC-5)",
            losAngeles: "Los Angeles (UTC-8)",
          },
          dateFormat: "Date Format",
          dateFormatHelp: "Current format: ",
          language: "Default Language",
        },
        notifications: {
          title: "Notifications",
          emailNotifications: "Email Notifications",
          systemNotifications: "System Notifications",
        },
      },
      security: {
        title: "Security Settings",
        warning: {
          title: "Security Warning",
          description:
            "Changes to security settings affect all system users. Please proceed with caution.",
        },
        passwordPolicy: {
          title: "Password Policy",
          minLength: "Minimum Password Length",
          minLengthHelp: "Minimum number of characters required in passwords",
          requirements: "Password Requirements",
          requireUppercase: "Require uppercase letters",
          requireLowercase: "Require lowercase letters",
          requireNumbers: "Require numbers",
          requireSpecialChars: "Require special characters",
          expirationDays: "Password Expiration (days)",
          expirationHelp:
            "Days before password must be changed (0 = never expires)",
        },
        sessions: {
          title: "Session Management",
          timeout: "Session Timeout",
          timeoutHelp: "Time of inactivity before automatic logout",
          concurrent: "Concurrent Sessions",
          maxPerUser: "Maximum Sessions per User",
          maxPerUserHelp:
            "Maximum number of simultaneous sessions allowed per user",
        },
        login: {
          title: "Login Security",
          maxAttempts: "Maximum Login Attempts",
          maxAttemptsHelp: "Failed attempts before account lockout",
          lockoutDuration: "Lockout Duration",
          lockoutHelp: "Time before locked account can try again",
          twoFactor: "Two-Factor Authentication",
        },
        ipRestrictions: {
          title: "IP Restrictions",
          enable: "Enable IP Restrictions",
          whitelist: "IP Whitelist",
          whitelistPlaceholder: "Enter one IP address per line",
          whitelistHelp:
            "Only these IP addresses will be allowed to access the system",
        },
      },
      form: {
        appName: "Application Name",
        appNamePlaceholder: "Enter application name",
        appNameHelp: "This name will be displayed throughout the system",
        appUrl: "Application URL",
        appUrlPlaceholder: "https://example.com",
        appUrlHelp: "The main URL for the application",
        defaultLanguage: "Default Language",
        defaultLanguageHelp: "Default language for new users",
        timezone: "System Timezone",
        timezoneHelp: "Default timezone for the system",
        maintenanceMode: "Maintenance Mode",
        maintenanceModeLabel: "Enable maintenance mode",
        maintenanceModeHelp:
          "When enabled, only administrators can access the system",
      },
      messages: {
        saveSuccess: "Settings saved successfully",
        saveError: "Error saving settings. Please try again.",
      },
    },
    languages: {
      spanish: "Spanish",
      english: "English",
    },
    common: {
      enabled: "Enabled",
      disabled: "Disabled",
      allowed: "Allowed",
      notAllowed: "Not Allowed",
      minutes: "minutes",
      hour: "hour",
      hours: "hours",
      actions: {
        save: "Save Changes",
        saving: "Saving...",
        reset: "Reset",
        ok: "OK",
      },
    },
  },
  es: {
    settings: {
      title: "Configuración del Sistema",
      systemConfiguration: "Configuración del Sistema",
      warning: {
        title: "Aviso Importante",
        description:
          "Estas configuraciones afectan todo el sistema. Los cambios requieren privilegios de administrador.",
      },
      general: {
        title: "Configuración General",
        notice: {
          title: "Configuración General",
          description:
            "Configure los ajustes básicos del sistema y preferencias.",
        },
        system: {
          title: "Información del Sistema",
          appName: "Nombre de la Aplicación",
          appNamePlaceholder: "Ingrese el nombre de la aplicación",
          appNameHelp: "Este nombre se mostrará en todo el sistema",
          appUrl: "URL de la Aplicación",
          appUrlPlaceholder: "https://ejemplo.com",
          appUrlHelp: "La URL principal de la aplicación",
          contactEmail: "Correo de Contacto",
          contactEmailPlaceholder: "admin" + "@" + "ejemplo.com",
          contactEmailHelp: "Correo electrónico del administrador del sistema",
        },
        regional: {
          title: "Configuración Regional",
          timezone: "Zona Horaria",
          timezones: {
            guatemala: "Guatemala (UTC-6)",
            mexico: "Ciudad de México (UTC-6)",
            newYork: "Nueva York (UTC-5)",
            losAngeles: "Los Ángeles (UTC-8)",
          },
          dateFormat: "Formato de Fecha",
          dateFormatHelp: "Formato actual: ",
          language: "Idioma Predeterminado",
        },
        notifications: {
          title: "Notificaciones",
          emailNotifications: "Notificaciones por Correo",
          systemNotifications: "Notificaciones del Sistema",
        },
      },
      security: {
        title: "Configuración de Seguridad",
        warning: {
          title: "Advertencia de Seguridad",
          description:
            "Los cambios en la configuración de seguridad afectan a todos los usuarios del sistema. Por favor proceda con precaución.",
        },
        passwordPolicy: {
          title: "Política de Contraseñas",
          minLength: "Longitud Mínima de Contraseña",
          minLengthHelp:
            "Número mínimo de caracteres requeridos en las contraseñas",
          requirements: "Requisitos de Contraseña",
          requireUppercase: "Requerir letras mayúsculas",
          requireLowercase: "Requerir letras minúsculas",
          requireNumbers: "Requerir números",
          requireSpecialChars: "Requerir caracteres especiales",
          expirationDays: "Expiración de Contraseña (días)",
          expirationHelp:
            "Días antes de que la contraseña deba cambiarse (0 = nunca expira)",
        },
        sessions: {
          title: "Gestión de Sesiones",
          timeout: "Tiempo de Espera de Sesión",
          timeoutHelp:
            "Tiempo de inactividad antes del cierre automático de sesión",
          concurrent: "Sesiones Concurrentes",
          maxPerUser: "Máximo de Sesiones por Usuario",
          maxPerUserHelp:
            "Número máximo de sesiones simultáneas permitidas por usuario",
        },
        login: {
          title: "Seguridad de Inicio de Sesión",
          maxAttempts: "Máximo de Intentos de Inicio de Sesión",
          maxAttemptsHelp: "Intentos fallidos antes del bloqueo de cuenta",
          lockoutDuration: "Duración del Bloqueo",
          lockoutHelp:
            "Tiempo antes de que la cuenta bloqueada pueda intentar nuevamente",
          twoFactor: "Autenticación de Dos Factores",
        },
        ipRestrictions: {
          title: "Restricciones de IP",
          enable: "Habilitar Restricciones de IP",
          whitelist: "Lista Blanca de IP",
          whitelistPlaceholder: "Ingrese una dirección IP por línea",
          whitelistHelp: "Solo estas direcciones IP podrán acceder al sistema",
        },
      },
      form: {
        appName: "Nombre de la Aplicación",
        appNamePlaceholder: "Ingrese el nombre de la aplicación",
        appNameHelp: "Este nombre se mostrará en todo el sistema",
        appUrl: "URL de la Aplicación",
        appUrlPlaceholder: "https://ejemplo.com",
        appUrlHelp: "La URL principal de la aplicación",
        defaultLanguage: "Idioma Predeterminado",
        defaultLanguageHelp: "Idioma predeterminado para nuevos usuarios",
        timezone: "Zona Horaria del Sistema",
        timezoneHelp: "Zona horaria predeterminada del sistema",
        maintenanceMode: "Modo de Mantenimiento",
        maintenanceModeLabel: "Habilitar modo de mantenimiento",
        maintenanceModeHelp:
          "Cuando está habilitado, solo los administradores pueden acceder al sistema",
      },
      messages: {
        saveSuccess: "Configuración guardada exitosamente",
        saveError:
          "Error al guardar la configuración. Por favor, inténtalo de nuevo.",
      },
    },
    languages: {
      spanish: "Español",
      english: "Inglés",
    },
    common: {
      enabled: "Habilitado",
      disabled: "Deshabilitado",
      allowed: "Permitido",
      notAllowed: "No Permitido",
      minutes: "minutos",
      hour: "hora",
      hours: "horas",
      actions: {
        save: "Guardar Cambios",
        saving: "Guardando...",
        reset: "Restablecer",
        ok: "Aceptar",
      },
    },
  },
};
