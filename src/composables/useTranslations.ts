import { useI18n } from "vue-i18n";
import { computed } from "vue";

/**
 * Composable for handling translations in GP360 modules
 * Provides typed translation functions and commonly used translations
 */
export function useTranslations() {
  const { t, locale } = useI18n();

  // Common action translations
  const actions = computed(() => ({
    save: t("common.actions.save"),
    cancel: t("common.actions.cancel"),
    edit: t("common.actions.edit"),
    delete: t("common.actions.delete"),
    view: t("common.actions.view"),
    add: t("common.actions.add"),
    create: t("common.actions.create"),
    update: t("common.actions.update"),
    submit: t("common.actions.submit"),
    close: t("common.actions.close"),
    ok: t("common.actions.ok"),
    yes: t("common.actions.yes"),
    no: t("common.actions.no"),
    confirm: t("common.actions.confirm"),
    loading: t("common.actions.loading"),
    search: t("common.actions.search"),
    filter: t("common.actions.filter"),
    reset: t("common.actions.reset"),
    back: t("common.actions.back"),
    next: t("common.actions.next"),
    previous: t("common.actions.previous"),
    finish: t("common.actions.finish"),
  }));

  // Common status translations
  const status = computed(() => ({
    active: t("common.status.active"),
    inactive: t("common.status.inactive"),
    pending: t("common.status.pending"),
    completed: t("common.status.completed"),
    inProgress: t("common.status.inProgress"),
    cancelled: t("common.status.cancelled"),
    approved: t("common.status.approved"),
    rejected: t("common.status.rejected"),
  }));

  // Common messages
  const messages = computed(() => ({
    success: t("common.messages.success"),
    error: t("common.messages.error"),
    warning: t("common.messages.warning"),
    info: t("common.messages.info"),
    noData: t("common.messages.noData"),
    noResults: t("common.messages.noResults"),
    confirmDelete: t("common.messages.confirmDelete"),
    unsavedChanges: t("common.messages.unsavedChanges"),
    sessionExpired: t("common.messages.sessionExpired"),
    networkError: t("common.messages.networkError"),
    permissionDenied: t("common.messages.permissionDenied"),
  }));

  // Auth module translations
  const auth = computed(() => ({
    login: {
      title: t("auth.login.title"),
      username: t("auth.login.username"),
      password: t("auth.login.password"),
      signInButton: t("auth.login.signInButton"),
      successMessage: t("auth.login.successMessage"),
      errorMessage: t("auth.login.errorMessage"),
    },
    logout: {
      signOut: t("auth.logout.signOut"),
    },
  }));

  // Users module translations
  const users = computed(() => ({
    profile: {
      title: t("users.profile.title"),
      details: t("users.profile.details"),
      personalInfo: t("users.profile.personalInfo"),
      fullName: t("users.profile.fullName"),
      email: t("users.profile.email"),
      username: t("users.profile.username"),
      role: t("users.profile.role"),
      status: t("users.profile.status"),
      edit: t("users.profile.edit"),
      cancel: t("users.profile.cancel"),
      saveChanges: t("users.profile.saveChanges"),
      changesSaved: t("users.profile.changesSaved"),
    },
    menu: {
      myProfile: t("users.menu.myProfile"),
      settings: t("users.menu.settings"),
      userManagement: t("users.menu.userManagement"),
      accountSettings: t("users.menu.accountSettings"),
    },
  }));

  // Dashboard module translations
  const dashboard = computed(() => ({
    title: t("dashboard.title"),
    stats: {
      systemEfficiency: t("dashboard.stats.systemEfficiency"),
      activeUsers: t("dashboard.stats.activeUsers"),
      runningProcesses: t("dashboard.stats.runningProcesses"),
      pendingAlerts: t("dashboard.stats.pendingAlerts"),
    },
    recentActivity: {
      title: t("dashboard.recentActivity.title"),
      subtitle: t("dashboard.recentActivity.subtitle"),
    },
  }));

  // Helper function to change language
  const changeLanguage = (lang: "en" | "es") => {
    locale.value = lang;
    localStorage.setItem("lang", lang);
  };

  // Get current language
  const currentLanguage = computed(() => locale.value);

  // Check if current language is specific language
  const isEnglish = computed(() => locale.value === "en");
  const isSpanish = computed(() => locale.value === "es");

  return {
    // Core i18n functions
    t,
    locale,

    // Grouped translations
    actions,
    status,
    messages,
    auth,
    users,
    dashboard,

    // Language utilities
    changeLanguage,
    currentLanguage,
    isEnglish,
    isSpanish,
  };
}

// Export types for better TypeScript support
export type TranslationComposable = ReturnType<typeof useTranslations>;
