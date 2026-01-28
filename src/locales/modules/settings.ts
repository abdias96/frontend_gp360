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
      title: "Configuración del sistema",
      systemConfiguration: "Configuración del sistema",
      warning: {
        title: "Aviso importante",
        description:
          "Estas configuraciones afectan todo el sistema. Los cambios requieren privilegios de administrador.",
      },
      general: {
        title: "Configuración general",
        notice: {
          title: "Configuración general",
          description:
            "Configure los ajustes básicos del sistema y preferencias.",
        },
        system: {
          title: "Información del sistema",
          appName: "Nombre de la aplicación",
          appNamePlaceholder: "Ingrese el nombre de la aplicación",
          appNameHelp: "Este nombre se mostrará en todo el sistema",
          appUrl: "URL de la aplicación",
          appUrlPlaceholder: "https://ejemplo.com",
          appUrlHelp: "La URL principal de la aplicación",
          contactEmail: "Correo de contacto",
          contactEmailPlaceholder: "admin" + "@" + "ejemplo.com",
          contactEmailHelp: "Correo electrónico del administrador del sistema",
        },
        regional: {
          title: "Configuración regional",
          timezone: "Zona horaria",
          timezones: {
            guatemala: "Guatemala (UTC-6)",
            mexico: "Ciudad de México (UTC-6)",
            newYork: "Nueva York (UTC-5)",
            losAngeles: "Los Ángeles (UTC-8)",
          },
          dateFormat: "Formato de fecha",
          dateFormatHelp: "Formato actual: ",
          language: "Idioma predeterminado",
        },
        notifications: {
          title: "Notificaciones",
          emailNotifications: "Notificaciones por correo",
          systemNotifications: "Notificaciones del sistema",
        },
      },
      security: {
        title: "Configuración de seguridad",
        warning: {
          title: "Advertencia de seguridad",
          description:
            "Los cambios en la configuración de seguridad afectan a todos los usuarios del sistema. Por favor proceda con precaución.",
        },
        passwordPolicy: {
          title: "Política de contraseñas",
          minLength: "Longitud mínima de contraseña",
          minLengthHelp:
            "Número mínimo de caracteres requeridos en las contraseñas",
          requirements: "Requisitos de contraseña",
          requireUppercase: "Requerir letras mayúsculas",
          requireLowercase: "Requerir letras minúsculas",
          requireNumbers: "Requerir números",
          requireSpecialChars: "Requerir caracteres especiales",
          expirationDays: "Expiración de contraseña (días)",
          expirationHelp:
            "Días antes de que la contraseña deba cambiarse (0 = nunca expira)",
        },
        sessions: {
          title: "Gestión de sesiones",
          timeout: "Tiempo de espera de sesión",
          timeoutHelp:
            "Tiempo de inactividad antes del cierre automático de sesión",
          concurrent: "Sesiones concurrentes",
          maxPerUser: "Máximo de sesiones por usuario",
          maxPerUserHelp:
            "Número máximo de sesiones simultáneas permitidas por usuario",
        },
        login: {
          title: "Seguridad de inicio de sesión",
          maxAttempts: "Máximo de intentos de inicio de sesión",
          maxAttemptsHelp: "Intentos fallidos antes del bloqueo de cuenta",
          lockoutDuration: "Duración del bloqueo",
          lockoutHelp:
            "Tiempo antes de que la cuenta bloqueada pueda intentar nuevamente",
          twoFactor: "Autenticación de dos factores",
        },
        ipRestrictions: {
          title: "Restricciones de IP",
          enable: "Habilitar restricciones de IP",
          whitelist: "Lista blanca de IP",
          whitelistPlaceholder: "Ingrese una dirección IP por línea",
          whitelistHelp: "Solo estas direcciones IP podrán acceder al sistema",
        },
      },
      form: {
        appName: "Nombre de la aplicación",
        appNamePlaceholder: "Ingrese el nombre de la aplicación",
        appNameHelp: "Este nombre se mostrará en todo el sistema",
        appUrl: "URL de la aplicación",
        appUrlPlaceholder: "https://ejemplo.com",
        appUrlHelp: "La URL principal de la aplicación",
        defaultLanguage: "Idioma predeterminado",
        defaultLanguageHelp: "Idioma predeterminado para nuevos usuarios",
        timezone: "Zona horaria del sistema",
        timezoneHelp: "Zona horaria predeterminada del sistema",
        maintenanceMode: "Modo de mantenimiento",
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
      notAllowed: "No permitido",
      minutes: "minutos",
      hour: "hora",
      hours: "horas",
      actions: {
        save: "Guardar cambios",
        saving: "Guardando...",
        reset: "Restablecer",
        ok: "Aceptar",
      },
    },
  },
};
