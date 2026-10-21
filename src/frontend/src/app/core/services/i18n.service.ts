import { Injectable, signal, computed } from '@angular/core';

export type AppLanguage = 'fr' | 'en';

export interface LanguageOption {
  code: AppLanguage;
  locale: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'fr', locale: 'fr-FR', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'en', locale: 'en-US', name: 'English (US)', nativeName: 'English (US)', flag: '🇺🇸' }
];

export interface AppTranslations {
  // Navigation principale (Sidebar)
  navDashboard: string;
  navWorkflows: string;
  navTasks: string;
  navRequests: string;
  navMonitoring: string;
  navAuditCenter: string;
  navNotifications: string;
  navSettings: string;
  navConfiguration: string;
  navClusterHealth: string;
  navActiveNodes: string;
  navClusterStatus: string;
  navCloseMenu: string;

  // En-tête globale (Topbar)
  topbarSearchPlaceholder: string;
  topbarNewWorkflow: string;
  topbarNewShort: string;
  topbarNotificationsTitle: string;
  topbarSystemSettings: string;
  topbarLogout: string;
  topbarClusterStatus: string;
  topbarThemeLight: string;
  topbarThemeDark: string;
  topbarLangFr: string;
  topbarLangEn: string;

  // Préférences & Paramètres
  settingsBreadcrumbPref: string;
  settingsBreadcrumbSystem: string;
  settingsTitle: string;
  settingsSubtitle: string;
  settingsRestoreDefaults: string;
  settingsSaveAll: string;
  settingsToastSync: string;

  // Onglets Settings
  settingsTabPreferences: string;
  settingsTabEngine: string;
  settingsTabSecurity: string;
  settingsTabIntegrations: string;
  settingsTabAudit: string;

  // Section Thème
  themeSectionTitle: string;
  themeSectionDesc: string;
  themeLightTitle: string;
  themeLightDesc: string;
  themeDarkTitle: string;
  themeDarkDesc: string;
  themeActive: string;

  // Section Langue
  langSectionTitle: string;
  langSectionDesc: string;
  langFrTitle: string;
  langFrDesc: string;
  langEnTitle: string;
  langEnDesc: string;
  langActive: string;

  // Section Espace de travail
  workspaceSectionTitle: string;
  workspaceSectionDesc: string;
  orgLabel: string;
  clusterEnvLabel: string;
  timezoneLabel: string;
  activeRoleLabel: string;

  // Communs
  statusNominal: string;
  commonSave: string;
  commonCancel: string;
}

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  /** Langue active dans toute l'application (Français par défaut) */
  readonly currentLang = signal<AppLanguage>(this.getInitialLang());

  private readonly dictionary: Record<AppLanguage, AppTranslations> = {
    fr: {
      navDashboard: 'Tableau de bord',
      navWorkflows: 'Flux de travail',
      navTasks: 'Tâches',
      navRequests: 'Demandes',
      navMonitoring: 'Surveillance',
      navAuditCenter: "Centre d'Audit",
      navNotifications: 'Notifications',
      navSettings: 'Paramètres',
      navConfiguration: 'Configuration',
      navClusterHealth: 'Santé du Cluster',
      navActiveNodes: 'Nœuds Actifs',
      navClusterStatus: 'US-East-1 Prod',
      navCloseMenu: 'Fermer le menu de navigation',

      topbarSearchPlaceholder: 'Rechercher des flux, runs, déclencheurs (Cmd+K)...',
      topbarNewWorkflow: 'Nouveau Flux',
      topbarNewShort: 'Nouveau',
      topbarNotificationsTitle: 'Notifications et alertes',
      topbarSystemSettings: 'Paramètres système',
      topbarLogout: 'Déconnexion',
      topbarClusterStatus: 'Production - US-East-1',
      topbarThemeLight: 'Passer en thème Blanc (Clair)',
      topbarThemeDark: 'Passer en thème Noir (Sombre)',
      topbarLangFr: 'Français',
      topbarLangEn: 'English (US)',

      settingsBreadcrumbPref: 'Préférences',
      settingsBreadcrumbSystem: 'Paramètres & Configuration Système',
      settingsTitle: 'Paramètres & Préférences Moteur',
      settingsSubtitle: "Personnalisez l'affichage, la langue, les paramètres globaux du cluster d'exécution, la cryptographie et les intégrations.",
      settingsRestoreDefaults: 'Rétablir par défaut',
      settingsSaveAll: 'Enregistrer tout',
      settingsToastSync: 'Configuration Synchronisée',

      settingsTabPreferences: 'Préférences & Général',
      settingsTabEngine: "Moteur d'exécution & SLA",
      settingsTabSecurity: 'Sécurité & Cryptographie',
      settingsTabIntegrations: 'Intégrations & Webhooks',
      settingsTabAudit: 'Audit & Conformité',

      themeSectionTitle: "Thème de l'interface (Blanc / Noir)",
      themeSectionDesc: "Personnalisez l'affichage de toute l'application entre le thème clair (blanc) et sombre (noir).",
      themeLightTitle: 'Thème Blanc (Clair)',
      themeLightDesc: 'Palette claire lumineuse avec fond blanc et contrastes optimisés pour la journée.',
      themeDarkTitle: 'Thème Noir (Sombre)',
      themeDarkDesc: 'Palette sombre reposante appliquée à toute l’application pour limiter la fatigue oculaire.',
      themeActive: 'Actif',

      langSectionTitle: "Langue de l'application (Global)",
      langSectionDesc: "Basculez instantanément la langue de l'ensemble de l'application entre le français et l’anglais.",
      langFrTitle: 'Français (France)',
      langFrDesc: 'Navigation, en-tête, notifications et réglages intégralement en français.',
      langEnTitle: 'English (United States)',
      langEnDesc: 'Complete workspace navigation, system terminology and labels in English.',
      langActive: 'Actif',

      workspaceSectionTitle: 'Espace de travail & Session',
      workspaceSectionDesc: 'Détails de votre session organisationnelle et région de connexion.',
      orgLabel: 'Organisation',
      clusterEnvLabel: 'Environnement de cluster',
      timezoneLabel: 'Fuseau horaire',
      activeRoleLabel: 'Rôle actif',

      statusNominal: 'Nominal',
      commonSave: 'Enregistrer',
      commonCancel: 'Annuler'
    },
    en: {
      navDashboard: 'Dashboard',
      navWorkflows: 'Workflows',
      navTasks: 'Tasks',
      navRequests: 'Requests',
      navMonitoring: 'Monitoring',
      navAuditCenter: 'Audit Center',
      navNotifications: 'Notifications',
      navSettings: 'Settings',
      navConfiguration: 'Configuration',
      navClusterHealth: 'Cluster Health',
      navActiveNodes: 'Active Nodes',
      navClusterStatus: 'US-East-1 Prod',
      navCloseMenu: 'Close navigation menu',

      topbarSearchPlaceholder: 'Search workflows, runs, triggers (Cmd+K)...',
      topbarNewWorkflow: 'New Workflow',
      topbarNewShort: 'New',
      topbarNotificationsTitle: 'Notifications and alerts',
      topbarSystemSettings: 'System Settings',
      topbarLogout: 'Sign Out',
      topbarClusterStatus: 'Production - US-East-1',
      topbarThemeLight: 'Switch to Light Theme',
      topbarThemeDark: 'Switch to Dark Theme',
      topbarLangFr: 'French',
      topbarLangEn: 'English (US)',

      settingsBreadcrumbPref: 'Preferences',
      settingsBreadcrumbSystem: 'Settings & System Configuration',
      settingsTitle: 'Settings & Engine Preferences',
      settingsSubtitle: 'Configure interface appearance, language, global cluster execution parameters, cryptographic roots, and integrations.',
      settingsRestoreDefaults: 'Restore Defaults',
      settingsSaveAll: 'Save All Changes',
      settingsToastSync: 'Configuration Synchronized',

      settingsTabPreferences: 'Preferences & General',
      settingsTabEngine: 'Execution Engine & SLA',
      settingsTabSecurity: 'Security & Cryptography',
      settingsTabIntegrations: 'Integrations & Webhooks',
      settingsTabAudit: 'Audit & Compliance Rules',

      themeSectionTitle: 'Interface Theme (Light / Dark)',
      themeSectionDesc: 'Customize visual appearance across the entire application between light (white) and dark (black) modes.',
      themeLightTitle: 'White Theme (Light)',
      themeLightDesc: 'Crisp bright canvas with clear high-contrast borders for daytime work.',
      themeDarkTitle: 'Black Theme (Dark)',
      themeDarkDesc: 'Restful deep dark palette applied across the whole application to minimize eye strain.',
      themeActive: 'Active',

      langSectionTitle: 'Application Language (Global)',
      langSectionDesc: 'Instantly toggle the entire workspace language between French and English.',
      langFrTitle: 'French (France)',
      langFrDesc: 'Navigation, topbar, alerts, and settings fully translated to French.',
      langEnTitle: 'English (United States)',
      langEnDesc: 'Standard enterprise interface and technical terminology in English.',
      langActive: 'Active',

      workspaceSectionTitle: 'Workspace & Session',
      workspaceSectionDesc: 'Organizational identity, cluster zone, and active administrative credentials.',
      orgLabel: 'Organization',
      clusterEnvLabel: 'Cluster Environment',
      timezoneLabel: 'Timezone',
      activeRoleLabel: 'Active Role',

      statusNominal: 'Nominal',
      commonSave: 'Save',
      commonCancel: 'Cancel'
    }
  };

  /** Dictionnaire réactif accessible partout */
  readonly t = computed<AppTranslations>(() => this.dictionary[this.currentLang()]);

  constructor() {
    this.applyLanguage(this.currentLang());
  }

  setLanguage(lang: AppLanguage): void {
    this.currentLang.set(lang);
    this.applyLanguage(lang);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('vanguard_lang', lang);
    }
  }

  toggleLanguage(): void {
    const nextLang: AppLanguage = this.currentLang() === 'fr' ? 'en' : 'fr';
    this.setLanguage(nextLang);
  }

  private getInitialLang(): AppLanguage {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('vanguard_lang') as AppLanguage;
      if (saved === 'fr' || saved === 'en') {
        return saved;
      }
    }
    return 'fr';
  }

  private applyLanguage(lang: AppLanguage): void {
    if (typeof document !== 'undefined') {
      const locale = lang === 'fr' ? 'fr-FR' : 'en-US';
      document.documentElement.setAttribute('lang', locale);
    }
  }
}
