import { createI18n } from "vue-i18n";
import { authTranslations } from "./modules/auth";
import { usersTranslations } from "./modules/users";
import { dashboardTranslations } from "./modules/dashboard";
import { commonTranslations } from "./modules/common";
import { menuTranslations } from "./modules/menu";
import { settingsTranslations } from "./modules/settings";
import { quickAccessTranslations } from "./modules/quickAccess";
import { catalogsTranslations } from "./modules/catalogs";
import { reportsTranslations } from "./modules/reports";
import { helpTranslations } from "./modules/help";
import { legalTranslations } from "./modules/legal";
import { admissionsTranslations } from "./modules/admissions";
import { visitsTranslations } from "./modules/visits";
import { biometricTranslations } from "./modules/biometric";
import { rolesTranslations } from "./modules/roles";
import { inmatesTranslations } from "./modules/inmates";
import { documentsTranslations } from "./modules/documents";
import { renapTranslations } from "./modules/renap";
import { emergencyTranslations } from "./modules/emergency";
import { securityTranslations } from "./modules/security";
import operationsEs from "./es/operations";
import operationsEn from "./en/operations";
import visitsEs from "./es/visits";
import visitsEn from "./en/visits";

// Helper function to deep merge translation objects
function deepMerge(target: any, source: any): any {
  const result = { ...target };

  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}

// Combine all translations for English
const enTranslations = deepMerge(
  {},
  deepMerge(authTranslations.en,
    deepMerge(usersTranslations.en,
      deepMerge(dashboardTranslations.en,
        deepMerge(commonTranslations.en,
          deepMerge(menuTranslations.en,
            deepMerge(settingsTranslations.en,
              deepMerge(quickAccessTranslations.en,
                deepMerge(catalogsTranslations.en,
                  deepMerge(reportsTranslations.en,
                    deepMerge(helpTranslations.en,
                      deepMerge(legalTranslations.en,
                        deepMerge(admissionsTranslations.en,
                          deepMerge(visitsTranslations.en,
                            deepMerge(biometricTranslations.en,
                              deepMerge(rolesTranslations.en,
                                deepMerge(inmatesTranslations.en,
                                  deepMerge(documentsTranslations.en,
                                    deepMerge(renapTranslations.en,
                                      deepMerge(emergencyTranslations.en,
                                        deepMerge(securityTranslations.en,
                                          deepMerge(operationsEn, visitsEn)
                                        )
                                      )
                                    )
                                  )
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )
);

// Combine all translations for Spanish
const esTranslations = deepMerge(
  {},
  deepMerge(authTranslations.es,
    deepMerge(usersTranslations.es,
      deepMerge(dashboardTranslations.es,
        deepMerge(commonTranslations.es,
          deepMerge(menuTranslations.es,
            deepMerge(settingsTranslations.es,
              deepMerge(quickAccessTranslations.es,
                deepMerge(catalogsTranslations.es,
                  deepMerge(reportsTranslations.es,
                    deepMerge(helpTranslations.es,
                      deepMerge(legalTranslations.es,
                        deepMerge(admissionsTranslations.es,
                          deepMerge(visitsTranslations.es,
                            deepMerge(biometricTranslations.es,
                              deepMerge(rolesTranslations.es,
                                deepMerge(inmatesTranslations.es,
                                  deepMerge(documentsTranslations.es,
                                    deepMerge(renapTranslations.es,
                                      deepMerge(emergencyTranslations.es,
                                        deepMerge(securityTranslations.es,
                                          deepMerge(operationsEs, visitsEs)
                                        )
                                      )
                                    )
                                  )
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )
);

// Legacy translations from the original file (keeping for backward compatibility)
const legacyTranslations = {
  en: {
    layoutBuilder: "Layout builder",
    craft: "Crafted",
    pages: "Pages",
    profile: "Profile",
    profileOverview: "Overview",
    projects: "Projects",
    campaigns: "Campaigns",
    documents: "Documents",
    connections: "Connections",
    wizards: "Wizards",
    horizontal: "Horizontal",
    vertical: "Vertical",
    account: "Account",
    accountOverview: "Overview",
    // settings: "Settings", // REMOVIDO: Conflicto con módulo settings
    authentication: "Authentication",
    basicFlow: "Basic Flow",
    signIn: "Sign-in",
    signUp: "Sign-up",
    passwordReset: "Password Reset",
    multiStepSignUp: "Multi-steps Sign up",
    error404: "Error 404",
    error500: "Error 500",
    apps: "Apps",
    chat: "Chat",
    privateChat: "Private Chat",
    groupChat: "Group Chat",
    drawerChat: "Drawer Chat",
    widgets: "Widgets",
    widgetsLists: "Lists",
    widgetsStatistics: "Statistics",
    widgetsCharts: "Charts",
    widgetsMixed: "Mixed",
    widgetsTables: "Tables",
    widgetsFeeds: "Feeds",
    changelog: "Changelog",
    docsAndComponents: "Docs & Components",
    megaMenu: "Mega Menu",
    exampleLink: "Example link",
    modals: "Modals",
    general: "General",
    inviteFriends: "Invite Friends",
    viewUsers: "View Users",
    upgradePlan: "Upgrade Plan",
    shareAndEarn: "Share & Earn",
    forms: "Forms",
    newTarget: "New Target",
    newCard: "New Card",
    newAddress: "New Address",
    createAPIKey: "Create API Key",
    twoFactorAuth: "Two Factor Auth",
    createApp: "Create App",
    createAccount: "Create Account",
    documentation: "Documentation",
    components: "Components",
    resources: "Resources",
    activity: "Activity",
    customers: "Customers",
    gettingStarted: "Getting Started",
    customersListing: "Customers Listing",
    customerDetails: "Customers Details",
    calendarApp: "Calendar",
    subscriptions: "Subscriptions",
    getStarted: "Getting Started",
    subscriptionList: "Subscription List",
    addSubscription: "Add Subscription",
    viewSubscription: "View Subscription",
  },
  es: {
    layoutBuilder: "Constructor de maquetación",
    craft: "Elaborado",
    pages: "Páginas",
    profile: "Perfil",
    profileOverview: "Descripción general",
    projects: "Proyectos",
    campaigns: "Campañas",
    documents: "Documentos",
    connections: "Conexiones",
    wizards: "Asistentes",
    horizontal: "Horizontal",
    vertical: "Vertical",
    account: "Cuenta",
    accountOverview: "Descripción general",
    // settings: "Configuración", // REMOVIDO: Conflicto con módulo settings
    authentication: "Autenticación",
    basicFlow: "Flujo básico",
    signIn: "Iniciar sesión",
    signUp: "Registrarse",
    passwordReset: "Restablecimiento de contraseña",
    multiStepSignUp: "Registro de múltiples pasos",
    error404: "Error 404",
    error500: "Error 500",
    apps: "Aplicaciones",
    chat: "Chat",
    privateChat: "Chat privado",
    groupChat: "Grupo de chat",
    drawerChat: "Chat del cajón",
    widgets: "Widgets",
    widgetsLists: "Listas",
    widgetsStatistics: "Estadísticas",
    widgetsCharts: "Gráficos",
    widgetsMixed: "Mixto",
    widgetsTables: "Tablas",
    widgetsFeeds: "Feeds",
    changelog: "Registro de cambios",
    docsAndComponents: "Documentos y Componentes",
    megaMenu: "Mega menú",
    exampleLink: "Enlace de ejemplo",
    modals: "Modales",
    general: "General",
    inviteFriends: "Invitar Amigos",
    viewUsers: "Ver Usuarios",
    upgradePlan: "Plan de Actualización",
    shareAndEarn: "Compartir y Ganar",
    forms: "Formularios",
    newTarget: "Nuevo Objetivo",
    newCard: "Nueva Tarjeta",
    newAddress: "Nueva Dirección",
    createAPIKey: "Crear Clave API",
    twoFactorAuth: "Autenticación de Dos Factores",
    createApp: "Crear Aplicación",
    createAccount: "Crear Cuenta",
    activity: "Actividad",
    documentation: "Documentación",
    components: "Componentes",
    resources: "Recursos",
    customers: "Clientes",
    gettingStarted: "Empezando",
    customersListing: "Listado de Clientes",
    customerDetails: "Detalles de Clientes",
    calendarApp: "Calendario",
    subscriptions: "Suscripciones",
    getStarted: "Empezando",
    subscriptionList: "Lista de Suscripción",
    addSubscription: "Añadir Suscripción",
    viewSubscription: "Ver Suscripción",
  },
};

// Final messages object combining modular and legacy translations
const messages = {
  en: { ...enTranslations, ...legacyTranslations.en },
  es: { ...esTranslations, ...legacyTranslations.es },
};

// Get saved locale from localStorage or use default
const savedLocale = localStorage.getItem("lang") || "es"; // Default to Spanish for GP360

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: "en",
  globalInjection: true,
  messages,
});

export default i18n;

// Export types for TypeScript support
export type SupportedLocales = "en" | "es";
export type TranslationKeys = keyof typeof messages.en;
