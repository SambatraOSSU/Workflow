import { Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TopbarComponent } from '../../shared/components/topbar/topbar.component';
import { SettingsService } from '../../core/services/settings.service';
import { ThemeService } from '../../core/services/theme.service';
import { I18nService } from '../../core/services/i18n.service';
import { EngineSettings } from '../../core/models/settings.models';

interface TranslationStrings {
  breadcrumbPreferences: string;
  breadcrumbSettings: string;
  pageTitle: string;
  pageSubtitle: string;
  restoreDefaults: string;
  saveChanges: string;
  toastConfigSaved: string;

  // Tabs
  tabPreferences: string;
  tabEngine: string;
  tabSecurity: string;
  tabIntegrations: string;
  tabAudit: string;

  // Theme section
  themeSectionTitle: string;
  themeSectionDesc: string;
  themeLightTitle: string;
  themeLightDesc: string;
  themeDarkTitle: string;
  themeDarkDesc: string;
  themeActive: string;
  themeSelect: string;

  // Language section
  langSectionTitle: string;
  langSectionDesc: string;
  langFrTitle: string;
  langFrDesc: string;
  langEnTitle: string;
  langEnDesc: string;
  langActive: string;
  langSelect: string;

  // Workspace & Env section
  workspaceSectionTitle: string;
  workspaceSectionDesc: string;
  orgLabel: string;
  clusterEnvLabel: string;
  timezoneLabel: string;
  activeRoleLabel: string;

  // Engine tab
  clusterModeLabel: string;
  activeClusterBanner: string;
  activeWorkersLabel: string;
  avgLatencyLabel: string;
  runtimeTitle: string;
  runtimeDesc: string;
  realtimeBadge: string;
  timeoutLabel: string;
  timeoutDesc: string;
  concurrencyLabel: string;
  concurrencyDesc: string;
  retryLabel: string;
  retryDesc: string;
  slaLabel: string;
  slaDesc: string;

  // Security tab
  cryptoTitle: string;
  cryptoDesc: string;
  fipsBadge: string;
  algorithmLabel: string;
  algorithmDesc: string;
  hsmLabel: string;
  hsmDesc: string;
  hsm30Days: string;
  hsm30Desc: string;
  hsm90Days: string;
  hsm90Desc: string;
  hsmManual: string;
  hsmManualDesc: string;
  merkleLabel: string;
  merkleDesc: string;
  pubKeyLabel: string;
  copyKeyLabel: string;
  copiedKeyLabel: string;
  approvalsTitle: string;
  approvalsDesc: string;
  mfaLabel: string;
  mfaDesc: string;
  oooLabel: string;
  oooDesc: string;
  fourEyesLabel: string;
  fourEyesDesc: string;

  // Integrations tab
  integrationsTitle: string;
  integrationsDesc: string;
  manageAllLabel: string;
  slackName: string;
  slackDesc: string;
  vaultName: string;
  vaultDesc: string;
  cloudWatchName: string;
  cloudWatchDesc: string;
  connectedBadge: string;
  syncingBadge: string;
  streamingBadge: string;

  // Danger zone & Audit tab
  dangerTitle: string;
  dangerDesc: string;
  flushCacheLabel: string;
  flushCacheDesc: string;
  flushBtn: string;
  drainLabel: string;
  drainDesc: string;
  drainBtn: string;
  lockoutLabel: string;
  lockoutDesc: string;
  lockoutBtn: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    html.dark {
      color-scheme: dark;
    }
    html.dark body {
      background-color: #090d16 !important;
      color: #f3f4f6 !important;
    }
    html.dark .bg-surface {
      background-color: #090d16 !important;
    }
    html.dark .bg-surface-container-lowest {
      background-color: #111827 !important;
      border-color: #1f2937 !important;
    }
    html.dark .bg-surface-container-low {
      background-color: #0b0f19 !important;
    }
    html.dark .bg-surface-container {
      background-color: #1a2233 !important;
    }
    html.dark .bg-surface-container-high {
      background-color: #243047 !important;
    }
    html.dark .bg-surface-container-highest {
      background-color: #2d3b57 !important;
    }
    html.dark .text-on-surface {
      color: #f3f4f6 !important;
    }
    html.dark .text-on-surface-variant {
      color: #9ca3af !important;
    }
    html.dark .text-outline {
      color: #64748b !important;
    }
    html.dark .border-surface-container {
      border-color: #1f2937 !important;
    }
    html.dark input[type="text"],
    html.dark input[type="number"],
    html.dark select {
      background-color: #0b0f19 !important;
      color: #f3f4f6 !important;
      border: 1px solid #1f2937 !important;
    }
    html.dark .bg-primary {
      background-color: #1e293b !important;
      color: #ffffff !important;
      border: 1px solid #334155 !important;
    }
  `],
  template: `
    <div class="min-h-screen bg-surface font-body-md text-body-md text-on-surface antialiased flex flex-col">
      <!-- Fixed Sidebar -->
      <app-sidebar />

      <div class="pl-0 lg:pl-64 flex flex-col flex-1 min-w-0 transition-all duration-300">
        <!-- Global Topbar -->
        <app-topbar />

        <main class="w-full pt-16 sm:pt-20 bg-surface px-4 sm:px-8 lg:px-10 xl:px-12 flex-1 flex flex-col max-w-7xl 2xl:max-w-[1536px] mx-auto pb-space-5xl min-w-0">
          <!-- Interactive Toast Notification Container -->
          @if (toastMessage()) {
            <div class="fixed bottom-6 right-4 sm:right-8 z-50 flex items-center gap-space-md px-space-lg py-space-md bg-primary-container text-pure-white rounded-xl shadow-2xl border border-primary-fixed/20 transition-all duration-300 transform translate-y-0 opacity-100">
              <div class="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
              </div>
              <div class="flex flex-col pr-space-md">
                <span class="font-label-md text-label-md font-bold text-pure-white">{{ t().toastConfigSaved }}</span>
                <span class="font-caption text-caption text-on-primary-container">{{ toastMessage() }}</span>
              </div>
            </div>
          }

          <!-- Header Section with Breadcrumbs, Quick Switchers and Actions -->
          <header class="py-space-xl flex flex-col xl:flex-row xl:items-center xl:justify-between gap-space-lg">
            <div class="flex flex-col gap-space-xs">
              <div class="flex items-center gap-space-xs text-on-surface-variant font-caption text-caption uppercase tracking-wider font-semibold">
                <span>{{ t().breadcrumbPreferences }}</span>
                <svg class="w-3.5 h-3.5 text-outline" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
                <span class="text-on-surface font-bold">{{ t().breadcrumbSettings }}</span>
              </div>
              <h1 class="font-display text-display text-on-surface tracking-tight font-extrabold">{{ t().pageTitle }}</h1>
              <p class="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                {{ t().pageSubtitle }}
              </p>
            </div>

            <!-- Global Quick Switchers & Actions -->
            <div class="flex flex-wrap items-center gap-space-sm self-start xl:self-center shrink-0">
              <!-- Quick Language Switcher Button -->
              <button
                type="button"
                (click)="toggleLanguage()"
                class="flex items-center gap-space-xs px-3.5 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md font-semibold transition-colors shadow-sm cursor-pointer border border-surface-container"
                [title]="currentLanguage() === 'fr' ? 'Changer en anglais' : 'Switch to French'"
                aria-label="Basculer la langue"
              >
                <span class="text-base">{{ currentLanguage() === 'fr' ? '🇫🇷' : '🇺🇸' }}</span>
                <span>{{ currentLanguage() === 'fr' ? 'Français' : 'English (US)' }}</span>
              </button>

              <!-- Quick Theme Switcher Button (Blanc / Noir) -->
              <button
                type="button"
                (click)="toggleTheme()"
                class="flex items-center gap-space-xs px-3.5 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md font-semibold transition-colors shadow-sm cursor-pointer border border-surface-container"
                [title]="currentTheme() === 'light' ? 'Activer le thème noir' : 'Activer le thème blanc'"
                aria-label="Basculer le thème blanc/noir"
              >
                @if (currentTheme() === 'light') {
                  <svg class="w-4 h-4 text-warning" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                  <span>Blanc</span>
                } @else {
                  <svg class="w-4 h-4 text-info" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                  <span>Noir</span>
                }
              </button>

              <!-- Restore Defaults Button -->
              <button
                type="button"
                (click)="restoreDefaults()"
                class="flex items-center gap-space-xs px-space-lg py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md font-semibold transition-colors shadow-sm cursor-pointer"
              >
                <svg class="w-4 h-4 text-on-surface-variant" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
                <span>{{ t().restoreDefaults }}</span>
              </button>

              <!-- Save Changes Button -->
              <button
                type="button"
                (click)="saveChanges()"
                class="flex items-center gap-space-xs px-space-xl py-2.5 rounded-lg bg-secondary-container hover:bg-secondary-fixed-dim text-noir-text font-label-md text-label-md font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                <span>{{ t().saveChanges }}</span>
              </button>
            </div>
          </header>

          <!-- Horizontal Sub-Navigation Tabs -->
          <nav class="flex items-center gap-space-xs overflow-x-auto pb-space-sm mb-space-2xl bg-surface-container-low p-1.5 rounded-xl border border-surface-container/60">
            <!-- Tab 1: Preferences (Thème Blanc/Noir & Langue Français/Anglais) -->
            <button
              type="button"
              (click)="activeTab.set('preferences')"
              [class.bg-primary]="activeTab() === 'preferences'"
              [class.text-pure-white]="activeTab() === 'preferences'"
              [class.text-on-surface-variant]="activeTab() !== 'preferences'"
              class="flex items-center gap-space-xs px-space-md py-2 rounded-lg font-label-md text-label-md font-semibold transition-all shrink-0 cursor-pointer shadow-xs"
            >
              <svg class="w-4 h-4 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              <span>{{ t().tabPreferences }}</span>
              <span class="w-2 h-2 rounded-full bg-secondary-container"></span>
            </button>

            <!-- Tab 2: Execution Engine & SLA -->
            <button
              type="button"
              (click)="activeTab.set('engine')"
              [class.bg-primary]="activeTab() === 'engine'"
              [class.text-pure-white]="activeTab() === 'engine'"
              [class.text-on-surface-variant]="activeTab() !== 'engine'"
              class="flex items-center gap-space-xs px-space-md py-2 rounded-lg font-label-md text-label-md font-semibold transition-all shrink-0 cursor-pointer shadow-xs"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                <rect height="12" rx="2" width="16" x="4" y="6"></rect>
                <path d="M4 10h16"></path>
                <path d="M9 14h2"></path>
                <path d="M14 14h1"></path>
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <path d="M8 18v4"></path>
                <path d="M16 18v4"></path>
              </svg>
              <span>{{ t().tabEngine }}</span>
            </button>

            <!-- Tab 3: Security & Cryptography -->
            <button
              type="button"
              (click)="activeTab.set('security')"
              [class.bg-primary]="activeTab() === 'security'"
              [class.text-pure-white]="activeTab() === 'security'"
              [class.text-on-surface-variant]="activeTab() !== 'security'"
              class="flex items-center gap-space-xs px-space-md py-2 rounded-lg font-label-md text-label-md font-medium hover:bg-surface-container transition-all shrink-0 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <circle cx="12" cy="11" r="2"></circle>
                <path d="M12 13v3"></path>
              </svg>
              <span>{{ t().tabSecurity }}</span>
            </button>

            <!-- Tab 4: Integrations & Webhooks -->
            <button
              type="button"
              (click)="activeTab.set('integrations')"
              [class.bg-primary]="activeTab() === 'integrations'"
              [class.text-pure-white]="activeTab() === 'integrations'"
              [class.text-on-surface-variant]="activeTab() !== 'integrations'"
              class="flex items-center gap-space-xs px-space-md py-2 rounded-lg font-label-md text-label-md font-medium hover:bg-surface-container transition-all shrink-0 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
              <span>{{ t().tabIntegrations }}</span>
              <span class="px-1.5 py-0.5 rounded font-caption text-[10px] font-bold bg-success/20 text-success">3 Active</span>
            </button>

            <!-- Tab 5: Audit & Compliance Rules -->
            <button
              type="button"
              (click)="activeTab.set('audit')"
              [class.bg-primary]="activeTab() === 'audit'"
              [class.text-pure-white]="activeTab() === 'audit'"
              [class.text-on-surface-variant]="activeTab() !== 'audit'"
              class="flex items-center gap-space-xs px-space-md py-2 rounded-lg font-label-md text-label-md font-medium hover:bg-surface-container transition-all shrink-0 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="m9 15 2 2 4-4"></path>
              </svg>
              <span>{{ t().tabAudit }}</span>
            </button>
          </nav>

          <!-- TAB 1: PREFERENCES (THEME BLANC/NOIR & LANGUE FRANCAIS/ANGLAIS) -->
          @if (activeTab() === 'preferences') {
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
              <!-- Left Column: Theme & Language Preferences (7 Cols) -->
              <div class="lg:col-span-7 flex flex-col gap-space-xl">
                <!-- Section: Theme Blanc & Noir -->
                <section class="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm border border-surface-container/60 flex flex-col gap-space-lg">
                  <div class="flex items-center justify-between pb-space-sm border-b border-surface-container/60">
                    <div class="flex items-center gap-space-sm">
                      <div class="p-2.5 rounded-lg bg-surface-container text-primary">
                        <svg class="w-5 h-5 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="5"></circle>
                          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
                        </svg>
                      </div>
                      <div>
                        <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">{{ t().themeSectionTitle }}</h2>
                        <p class="font-caption text-caption text-on-surface-variant">{{ t().themeSectionDesc }}</p>
                      </div>
                    </div>
                    <span class="font-caption text-caption font-bold px-2.5 py-1 bg-surface-container text-on-surface rounded-md">
                      {{ currentTheme() === 'light' ? t().themeLightTitle : t().themeDarkTitle }}
                    </span>
                  </div>

                  <!-- Theme Choice Grid: Blanc (Light) vs Noir (Dark) -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    <!-- Option 1: Thème Blanc (Clair) -->
                    <div
                      role="button"
                      tabindex="0"
                      (click)="setTheme('light')"
                      (keydown.enter)="setTheme('light')"
                      (keydown.space)="setTheme('light')"
                      [class.border-secondary]="currentTheme() === 'light'"
                      [class.ring-2]="currentTheme() === 'light'"
                      [class.ring-secondary/30]="currentTheme() === 'light'"
                      [class.bg-surface-container-lowest]="currentTheme() === 'light'"
                      [class.bg-surface-container-low]="currentTheme() !== 'light'"
                      class="flex flex-col gap-space-md p-space-lg rounded-xl border-2 transition-all cursor-pointer hover:border-secondary/60 relative group"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-space-sm">
                          <div class="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-warning shadow-xs">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="5"></circle>
                              <line x1="12" y1="1" x2="12" y2="3"></line>
                              <line x1="12" y1="21" x2="12" y2="23"></line>
                              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                              <line x1="1" y1="12" x2="3" y2="12"></line>
                              <line x1="21" y1="12" x2="23" y2="12"></line>
                              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                          </div>
                          <div>
                            <span class="font-label-md text-label-md font-bold text-on-surface block">{{ t().themeLightTitle }}</span>
                            <span class="font-caption text-[11px] text-on-surface-variant">Default Light Canvas</span>
                          </div>
                        </div>

                        <!-- Active Radio Indicator -->
                        <div
                          [class.bg-secondary]="currentTheme() === 'light'"
                          [class.border-secondary]="currentTheme() === 'light'"
                          [class.border-outline]="currentTheme() !== 'light'"
                          class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                        >
                          @if (currentTheme() === 'light') {
                            <div class="w-2 h-2 rounded-full bg-noir-text"></div>
                          }
                        </div>
                      </div>

                      <!-- Miniature Preview Card: Blanc -->
                      <div class="w-full h-24 rounded-lg bg-[#ffffff] border border-[#e5e5e5] p-2 flex gap-2 overflow-hidden shadow-xs">
                        <div class="w-1/4 h-full bg-[#f4f3f3] rounded flex flex-col gap-1 p-1">
                          <div class="w-full h-2 bg-[#d5d5d5] rounded"></div>
                          <div class="w-3/4 h-1.5 bg-[#e5e5e5] rounded"></div>
                          <div class="w-1/2 h-1.5 bg-[#e5e5e5] rounded"></div>
                        </div>
                        <div class="flex-1 h-full bg-[#f9f9f9] rounded p-1.5 flex flex-col gap-1.5">
                          <div class="flex items-center justify-between">
                            <div class="w-1/3 h-2 bg-[#14213d] rounded"></div>
                            <div class="w-3 h-3 rounded-full bg-[#ffa515]"></div>
                          </div>
                          <div class="w-full h-6 bg-[#ffffff] rounded border border-[#dedede] p-1 flex items-center gap-1">
                            <div class="w-1/2 h-2 bg-[#dedede] rounded"></div>
                          </div>
                        </div>
                      </div>

                      <p class="font-caption text-caption text-on-surface-variant">
                        {{ t().themeLightDesc }}
                      </p>

                      @if (currentTheme() === 'light') {
                        <span class="inline-flex items-center gap-1 font-caption text-caption font-bold text-success">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          {{ t().themeActive }}
                        </span>
                      }
                    </div>

                    <!-- Option 2: Thème Noir (Sombre) -->
                    <div
                      role="button"
                      tabindex="0"
                      (click)="setTheme('dark')"
                      (keydown.enter)="setTheme('dark')"
                      (keydown.space)="setTheme('dark')"
                      [class.border-secondary]="currentTheme() === 'dark'"
                      [class.ring-2]="currentTheme() === 'dark'"
                      [class.ring-secondary/30]="currentTheme() === 'dark'"
                      [class.bg-surface-container-lowest]="currentTheme() === 'dark'"
                      [class.bg-surface-container-low]="currentTheme() !== 'dark'"
                      class="flex flex-col gap-space-md p-space-lg rounded-xl border-2 transition-all cursor-pointer hover:border-secondary/60 relative group"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-space-sm">
                          <div class="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-info shadow-xs">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                          </div>
                          <div>
                            <span class="font-label-md text-label-md font-bold text-on-surface block">{{ t().themeDarkTitle }}</span>
                            <span class="font-caption text-[11px] text-on-surface-variant">Deep Dark Mode</span>
                          </div>
                        </div>

                        <!-- Active Radio Indicator -->
                        <div
                          [class.bg-secondary]="currentTheme() === 'dark'"
                          [class.border-secondary]="currentTheme() === 'dark'"
                          [class.border-outline]="currentTheme() !== 'dark'"
                          class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                        >
                          @if (currentTheme() === 'dark') {
                            <div class="w-2 h-2 rounded-full bg-noir-text"></div>
                          }
                        </div>
                      </div>

                      <!-- Miniature Preview Card: Noir -->
                      <div class="w-full h-24 rounded-lg bg-[#090d16] border border-[#1f2937] p-2 flex gap-2 overflow-hidden shadow-xs">
                        <div class="w-1/4 h-full bg-[#0e1424] rounded flex flex-col gap-1 p-1">
                          <div class="w-full h-2 bg-[#2d3b57] rounded"></div>
                          <div class="w-3/4 h-1.5 bg-[#1f2937] rounded"></div>
                          <div class="w-1/2 h-1.5 bg-[#1f2937] rounded"></div>
                        </div>
                        <div class="flex-1 h-full bg-[#111827] rounded p-1.5 flex flex-col gap-1.5">
                          <div class="flex items-center justify-between">
                            <div class="w-1/3 h-2 bg-[#3b82f6] rounded"></div>
                            <div class="w-3 h-3 rounded-full bg-[#ffa515]"></div>
                          </div>
                          <div class="w-full h-6 bg-[#1a2233] rounded border border-[#2d3b57] p-1 flex items-center gap-1">
                            <div class="w-1/2 h-2 bg-[#64748b] rounded"></div>
                          </div>
                        </div>
                      </div>

                      <p class="font-caption text-caption text-on-surface-variant">
                        {{ t().themeDarkDesc }}
                      </p>

                      @if (currentTheme() === 'dark') {
                        <span class="inline-flex items-center gap-1 font-caption text-caption font-bold text-success">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          {{ t().themeActive }}
                        </span>
                      }
                    </div>
                  </div>
                </section>

                <!-- Section: Langue Français & Anglais -->
                <section class="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm border border-surface-container/60 flex flex-col gap-space-lg">
                  <div class="flex items-center justify-between pb-space-sm border-b border-surface-container/60">
                    <div class="flex items-center gap-space-sm">
                      <div class="p-2.5 rounded-lg bg-surface-container text-primary">
                        <svg class="w-5 h-5 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="2" y1="12" x2="22" y2="12"></line>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                      </div>
                      <div>
                        <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">{{ t().langSectionTitle }}</h2>
                        <p class="font-caption text-caption text-on-surface-variant">{{ t().langSectionDesc }}</p>
                      </div>
                    </div>
                    <span class="font-caption text-caption font-bold px-2.5 py-1 bg-surface-container text-on-surface rounded-md">
                      {{ currentLanguage() === 'fr' ? 'Français (fr-FR)' : 'English (en-US)' }}
                    </span>
                  </div>

                  <!-- Language Choice Grid: FR vs EN -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    <!-- Option 1: Français (FR) -->
                    <div
                      role="button"
                      tabindex="0"
                      (click)="setLanguage('fr')"
                      (keydown.enter)="setLanguage('fr')"
                      (keydown.space)="setLanguage('fr')"
                      [class.border-secondary]="currentLanguage() === 'fr'"
                      [class.ring-2]="currentLanguage() === 'fr'"
                      [class.ring-secondary/30]="currentLanguage() === 'fr'"
                      [class.bg-surface-container-lowest]="currentLanguage() === 'fr'"
                      [class.bg-surface-container-low]="currentLanguage() !== 'fr'"
                      class="flex flex-col gap-space-sm p-space-lg rounded-xl border-2 transition-all cursor-pointer hover:border-secondary/60 relative group"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-space-sm">
                          <div class="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center font-bold text-lg shadow-xs">
                            🇫🇷
                          </div>
                          <div>
                            <span class="font-label-md text-label-md font-bold text-on-surface block">{{ t().langFrTitle }}</span>
                            <span class="font-caption text-[11px] text-on-surface-variant">Français de référence</span>
                          </div>
                        </div>

                        <!-- Active Radio Indicator -->
                        <div
                          [class.bg-secondary]="currentLanguage() === 'fr'"
                          [class.border-secondary]="currentLanguage() === 'fr'"
                          [class.border-outline]="currentLanguage() !== 'fr'"
                          class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                        >
                          @if (currentLanguage() === 'fr') {
                            <div class="w-2 h-2 rounded-full bg-noir-text"></div>
                          }
                        </div>
                      </div>

                      <p class="font-caption text-caption text-on-surface-variant">
                        {{ t().langFrDesc }}
                      </p>

                      @if (currentLanguage() === 'fr') {
                        <span class="inline-flex items-center gap-1 font-caption text-caption font-bold text-success pt-space-xs">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          {{ t().langActive }}
                        </span>
                      }
                    </div>

                    <!-- Option 2: English (US) -->
                    <div
                      role="button"
                      tabindex="0"
                      (click)="setLanguage('en')"
                      (keydown.enter)="setLanguage('en')"
                      (keydown.space)="setLanguage('en')"
                      [class.border-secondary]="currentLanguage() === 'en'"
                      [class.ring-2]="currentLanguage() === 'en'"
                      [class.ring-secondary/30]="currentLanguage() === 'en'"
                      [class.bg-surface-container-lowest]="currentLanguage() === 'en'"
                      [class.bg-surface-container-low]="currentLanguage() !== 'en'"
                      class="flex flex-col gap-space-sm p-space-lg rounded-xl border-2 transition-all cursor-pointer hover:border-secondary/60 relative group"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-space-sm">
                          <div class="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center font-bold text-lg shadow-xs">
                            🇺🇸
                          </div>
                          <div>
                            <span class="font-label-md text-label-md font-bold text-on-surface block">{{ t().langEnTitle }}</span>
                            <span class="font-caption text-[11px] text-on-surface-variant">Standard Enterprise English</span>
                          </div>
                        </div>

                        <!-- Active Radio Indicator -->
                        <div
                          [class.bg-secondary]="currentLanguage() === 'en'"
                          [class.border-secondary]="currentLanguage() === 'en'"
                          [class.border-outline]="currentLanguage() !== 'en'"
                          class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                        >
                          @if (currentLanguage() === 'en') {
                            <div class="w-2 h-2 rounded-full bg-noir-text"></div>
                          }
                        </div>
                      </div>

                      <p class="font-caption text-caption text-on-surface-variant">
                        {{ t().langEnDesc }}
                      </p>

                      @if (currentLanguage() === 'en') {
                        <span class="inline-flex items-center gap-1 font-caption text-caption font-bold text-success pt-space-xs">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          {{ t().langActive }}
                        </span>
                      }
                    </div>
                  </div>
                </section>
              </div>

              <!-- Right Column: Workspace & Regional Configuration (5 Cols) -->
              <div class="lg:col-span-5 flex flex-col gap-space-xl">
                <section class="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm border border-surface-container/60 flex flex-col gap-space-md">
                  <div class="flex items-center gap-space-sm pb-space-xs border-b border-surface-container/60">
                    <div class="p-2.5 rounded-lg bg-surface-container text-primary">
                      <svg class="w-5 h-5 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                        <rect height="18" rx="2" width="18" x="3" y="3"></rect>
                        <path d="M7 8h10M7 12h10M7 16h6"></path>
                      </svg>
                    </div>
                    <div>
                      <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">{{ t().workspaceSectionTitle }}</h2>
                      <p class="font-caption text-caption text-on-surface-variant">{{ t().workspaceSectionDesc }}</p>
                    </div>
                  </div>

                  <div class="flex flex-col gap-space-sm pt-space-xs">
                    <!-- Org Identity -->
                    <div class="flex items-center justify-between p-space-md rounded-lg bg-surface-container-low">
                      <div class="flex flex-col">
                        <span class="font-caption text-caption text-on-surface-variant font-semibold uppercase">{{ t().orgLabel }}</span>
                        <span class="font-label-md text-label-md font-bold text-on-surface">Vanguard Global Finance Ltd.</span>
                      </div>
                      <span class="px-2 py-0.5 rounded font-caption text-caption font-mono font-bold bg-primary/10 text-primary dark:text-pure-white">ORG-8842</span>
                    </div>

                    <!-- Cluster Environment -->
                    <div class="flex items-center justify-between p-space-md rounded-lg bg-surface-container-low">
                      <div class="flex flex-col">
                        <span class="font-caption text-caption text-on-surface-variant font-semibold uppercase">{{ t().clusterEnvLabel }}</span>
                        <span class="font-label-md text-label-md font-bold text-on-surface">US-East-1 Production Cluster</span>
                      </div>
                      <span class="flex items-center gap-1 font-caption text-caption font-bold text-success">
                        <span class="w-2 h-2 rounded-full bg-success"></span>
                        Nominal
                      </span>
                    </div>

                    <!-- Timezone -->
                    <div class="flex items-center justify-between p-space-md rounded-lg bg-surface-container-low">
                      <div class="flex flex-col">
                        <span class="font-caption text-caption text-on-surface-variant font-semibold uppercase">{{ t().timezoneLabel }}</span>
                        <span class="font-label-md text-label-md font-bold text-on-surface">UTC+03:00 (Europe/Paris Sync)</span>
                      </div>
                      <span class="font-caption text-caption text-outline font-mono">ISO-8601</span>
                    </div>

                    <!-- Active Role -->
                    <div class="flex items-center justify-between p-space-md rounded-lg bg-surface-container-low">
                      <div class="flex flex-col">
                        <span class="font-caption text-caption text-on-surface-variant font-semibold uppercase">{{ t().activeRoleLabel }}</span>
                        <span class="font-label-md text-label-md font-bold text-on-surface">SuperAdmin / OrgAdmin</span>
                      </div>
                      <span class="px-2 py-0.5 rounded-full font-caption text-[11px] font-bold bg-secondary-container text-noir-text">Root Access</span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          }

          <!-- TAB 2: EXECUTION ENGINE & SLA -->
          @if (activeTab() === 'engine') {
            <!-- Cluster Status Banner Card -->
            <section class="mb-space-2xl bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-surface-container/60 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
              <div class="flex items-center gap-space-md">
                <div class="w-12 h-12 rounded-xl bg-primary-container text-secondary-container flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div class="flex flex-col">
                  <div class="flex items-center gap-space-xs">
                    <span class="font-headline-sm text-headline-sm text-on-surface font-bold">{{ t().clusterModeLabel }}: {{ formSettings().clusterMode }}</span>
                    <span class="px-space-sm py-0.5 rounded-full font-caption text-caption font-bold bg-success/15 text-success">Active • {{ formSettings().clusterVersion }}</span>
                  </div>
                  <p class="font-body-md text-body-md text-on-surface-variant">{{ t().activeClusterBanner }}</p>
                </div>
              </div>
              <div class="flex items-center gap-space-xl text-right">
                <div class="flex flex-col">
                  <span class="font-caption text-caption text-outline uppercase font-semibold">{{ t().activeWorkersLabel }}</span>
                  <span class="font-headline-sm text-headline-sm font-bold text-on-surface">{{ formSettings().activeWorkers | number }} / {{ formSettings().maxWorkers | number }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="font-caption text-caption text-outline uppercase font-semibold">{{ t().avgLatencyLabel }}</span>
                  <span class="font-headline-sm text-headline-sm font-bold text-success">{{ formSettings().avgLatencyMs }} ms</span>
                </div>
              </div>
            </section>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
              <!-- Engine Runtime & Concurrency Rules (7 Cols) -->
              <div class="lg:col-span-7 flex flex-col gap-space-xl">
                <section class="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm border border-surface-container/60 flex flex-col gap-space-lg">
                  <div class="flex items-center justify-between pb-space-sm">
                    <div class="flex items-center gap-space-sm">
                      <div class="p-2 rounded-lg bg-surface-container text-primary">
                        <svg class="w-5 h-5 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                          <rect height="18" rx="2" width="18" x="3" y="3"></rect>
                          <path d="M7 8h10"></path>
                          <path d="M7 12h10"></path>
                          <path d="M7 16h10"></path>
                        </svg>
                      </div>
                      <div>
                        <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">{{ t().runtimeTitle }}</h2>
                        <p class="font-caption text-caption text-on-surface-variant">{{ t().runtimeDesc }}</p>
                      </div>
                    </div>
                    <span class="font-caption text-caption font-semibold px-2.5 py-1 bg-surface-container text-on-surface-variant rounded-md">{{ t().realtimeBadge }}</span>
                  </div>

                  <!-- Setting: Timeout -->
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs">
                    <div class="max-w-md">
                      <label class="font-label-md text-label-md font-bold text-on-surface block" for="wf-timeout">{{ t().timeoutLabel }}</label>
                      <span class="font-caption text-caption text-on-surface-variant">{{ t().timeoutDesc }}</span>
                    </div>
                    <div class="relative w-full sm:w-48">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      </div>
                      <input
                        [(ngModel)]="formSettings().defaultWorkflowTimeoutSeconds"
                        class="w-full h-10 pl-9 pr-12 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface font-semibold focus:outline-none focus:bg-surface-container-lowest focus:shadow-sm transition-all text-right"
                        id="wf-timeout"
                        type="number"
                      />
                      <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none font-caption text-caption text-outline font-medium">sec</span>
                    </div>
                  </div>

                  <!-- Setting: Slider Concurrency -->
                  <div class="flex flex-col gap-space-xs pt-space-sm">
                    <div class="flex items-center justify-between">
                      <div>
                        <label class="font-label-md text-label-md font-bold text-on-surface" for="concurrency-range">{{ t().concurrencyLabel }}</label>
                        <p class="font-caption text-caption text-on-surface-variant">{{ t().concurrencyDesc }}</p>
                      </div>
                      <span class="font-headline-sm text-headline-sm font-bold text-primary px-3 py-1 bg-surface-container rounded-lg">
                        {{ formSettings().maxConcurrencyPerTenant | number }}
                      </span>
                    </div>
                    <div class="pt-2">
                      <input
                        [(ngModel)]="formSettings().maxConcurrencyPerTenant"
                        class="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-secondary-container"
                        id="concurrency-range"
                        max="10000"
                        min="500"
                        step="250"
                        type="range"
                      />
                    </div>
                    <div class="flex justify-between font-caption text-caption text-outline font-medium">
                      <span>500 Threads</span>
                      <span>Recommended: 2,500</span>
                      <span>10,000 (Max Capacity)</span>
                    </div>
                  </div>

                  <!-- Toggle: Retry Policy -->
                  <div class="flex items-center justify-between gap-space-md pt-space-md">
                    <div class="flex flex-col max-w-lg">
                      <span class="font-label-md text-label-md font-bold text-on-surface">{{ t().retryLabel }}</span>
                      <span class="font-caption text-caption text-on-surface-variant">{{ t().retryDesc }}</span>
                    </div>
                    <button
                      (click)="formSettings().automaticRetryEnabled = !formSettings().automaticRetryEnabled"
                      [class.bg-primary]="formSettings().automaticRetryEnabled"
                      [class.bg-surface-container-high]="!formSettings().automaticRetryEnabled"
                      class="w-12 h-6 rounded-full relative p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary shrink-0 cursor-pointer"
                      role="switch"
                      aria-label="Tentative automatique sur panne transitoire"
                      [attr.aria-checked]="formSettings().automaticRetryEnabled"
                      type="button"
                    >
                      <div
                        [class.translate-x-6]="formSettings().automaticRetryEnabled"
                        [class.translate-x-0]="!formSettings().automaticRetryEnabled"
                        class="w-5 h-5 bg-pure-white rounded-full transition-transform flex items-center justify-center shadow-sm"
                      >
                        @if (formSettings().automaticRetryEnabled) {
                          <svg class="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path clip-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill-rule="evenodd"></path>
                          </svg>
                        }
                      </div>
                    </button>
                  </div>

                  <!-- Toggle: SLA Breach Alerting -->
                  <div class="flex items-center justify-between gap-space-md pt-space-xs">
                    <div class="flex flex-col max-w-lg">
                      <div class="flex items-center gap-space-xs">
                        <span class="font-label-md text-label-md font-bold text-on-surface">{{ t().slaLabel }}</span>
                        <span class="px-1.5 py-0.5 bg-warning/20 text-noir-text rounded font-caption text-[11px] font-bold">P1 Priority</span>
                      </div>
                      <span class="font-caption text-caption text-on-surface-variant">{{ t().slaDesc }}</span>
                    </div>
                    <button
                      (click)="formSettings().strictSlaBreachAlerting = !formSettings().strictSlaBreachAlerting"
                      [class.bg-primary]="formSettings().strictSlaBreachAlerting"
                      [class.bg-surface-container-high]="!formSettings().strictSlaBreachAlerting"
                      class="w-12 h-6 rounded-full relative p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary shrink-0 cursor-pointer"
                      role="switch"
                      aria-label="Alerte prédictive en cas de dépassement strict du SLA"
                      [attr.aria-checked]="formSettings().strictSlaBreachAlerting"
                      type="button"
                    >
                      <div
                        [class.translate-x-6]="formSettings().strictSlaBreachAlerting"
                        [class.translate-x-0]="!formSettings().strictSlaBreachAlerting"
                        class="w-5 h-5 bg-pure-white rounded-full transition-transform flex items-center justify-center shadow-sm"
                      >
                        @if (formSettings().strictSlaBreachAlerting) {
                          <svg class="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path clip-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill-rule="evenodd"></path>
                          </svg>
                        }
                      </div>
                    </button>
                  </div>
                </section>
              </div>

              <!-- Approvals Overview (5 Cols) -->
              <div class="lg:col-span-5 flex flex-col gap-space-xl">
                <section class="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm border border-surface-container/60 flex flex-col gap-space-md">
                  <div class="flex items-center gap-space-sm pb-space-xs">
                    <div class="p-2 rounded-lg bg-surface-container text-primary">
                      <svg class="w-5 h-5 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div>
                      <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">{{ t().approvalsTitle }}</h2>
                      <p class="font-caption text-caption text-on-surface-variant">{{ t().approvalsDesc }}</p>
                    </div>
                  </div>

                  <div class="flex items-start justify-between gap-space-md p-space-md rounded-lg bg-surface-container-low">
                    <div class="flex items-start gap-space-sm">
                      <div class="w-8 h-8 rounded-lg bg-primary text-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                          <rect height="11" rx="2" ry="2" width="18" x="3" y="11"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                      <div class="flex flex-col">
                        <span class="font-label-md text-label-md font-bold text-on-surface">{{ t().mfaLabel }}</span>
                        <span class="font-caption text-caption text-on-surface-variant">{{ t().mfaDesc }}</span>
                      </div>
                    </div>
                    <input
                      [(ngModel)]="formSettings().stepUpMfaHighValueEnabled"
                      class="w-5 h-5 mt-1 rounded accent-primary cursor-pointer shrink-0"
                      type="checkbox"
                    />
                  </div>

                  <div class="flex items-start justify-between gap-space-md p-space-md rounded-lg bg-surface-container-low">
                    <div class="flex items-start gap-space-sm">
                      <div class="w-8 h-8 rounded-lg bg-primary text-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                          <rect height="18" rx="2" width="18" x="3" y="4"></rect>
                          <line x1="16" x2="16" y1="2" y2="6"></line>
                          <line x1="8" x2="8" y1="2" y2="6"></line>
                          <line x1="3" x2="21" y1="10" y2="10"></line>
                        </svg>
                      </div>
                      <div class="flex flex-col">
                        <span class="font-label-md text-label-md font-bold text-on-surface">{{ t().oooLabel }}</span>
                        <span class="font-caption text-caption text-on-surface-variant">{{ t().oooDesc }}</span>
                      </div>
                    </div>
                    <input
                      [(ngModel)]="formSettings().outOfOfficeRoutingEnabled"
                      class="w-5 h-5 mt-1 rounded accent-primary cursor-pointer shrink-0"
                      type="checkbox"
                    />
                  </div>
                </section>
              </div>
            </div>
          }

          <!-- TAB 3: SECURITY & CRYPTOGRAPHY -->
          @if (activeTab() === 'security') {
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
              <div class="lg:col-span-7 flex flex-col gap-space-xl">
                <!-- Cryptographic Enclave -->
                <section class="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm border border-surface-container/60 flex flex-col gap-space-lg">
                  <div class="flex items-center justify-between pb-space-sm">
                    <div class="flex items-center gap-space-sm">
                      <div class="p-2 rounded-lg bg-surface-container text-primary">
                        <svg class="w-5 h-5 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                          <circle cx="12" cy="11" r="2"></circle>
                          <path d="M12 13v3"></path>
                        </svg>
                      </div>
                      <div>
                        <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">{{ t().cryptoTitle }}</h2>
                        <p class="font-caption text-caption text-on-surface-variant">{{ t().cryptoDesc }}</p>
                      </div>
                    </div>
                    <span class="flex items-center gap-1 font-caption text-caption font-bold px-2.5 py-1 bg-success/15 text-success rounded-md">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                        <path d="m9 12 2 2 4-4"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                      {{ t().fipsBadge }}
                    </span>
                  </div>

                  <!-- Algorithm Select -->
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                    <div class="max-w-md">
                      <label class="font-label-md text-label-md font-bold text-on-surface block">{{ t().algorithmLabel }}</label>
                      <span class="font-caption text-caption text-on-surface-variant">{{ t().algorithmDesc }}</span>
                    </div>
                    <div class="relative w-full sm:w-64">
                      <select
                        [(ngModel)]="formSettings().signatureAlgorithm"
                        class="w-full h-10 px-space-md appearance-none rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface font-semibold focus:outline-none focus:bg-surface-container-lowest pr-8 cursor-pointer"
                      >
                        <option value="Ed25519 (Recommended)">Ed25519 (Recommended)</option>
                        <option value="ECDSA (NIST P-384 / SHA-384)">ECDSA (NIST P-384 / SHA-384)</option>
                        <option value="RSA-4096 (Legacy Compliance)">RSA-4096 (Legacy Compliance)</option>
                      </select>
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-outline">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                          <path d="m6 9 6 6 6-6"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <!-- HSM Key Rotation Radio Group -->
                  <div class="flex flex-col gap-space-xs pt-space-xs">
                    <label class="font-label-md text-label-md font-bold text-on-surface">{{ t().hsmLabel }}</label>
                    <p class="font-caption text-caption text-on-surface-variant mb-space-xs">{{ t().hsmDesc }}</p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                      <label
                        [class.bg-surface-container]="formSettings().hsmKeyRotationCadenceDays === 30"
                        [class.bg-surface-container-low]="formSettings().hsmKeyRotationCadenceDays !== 30"
                        class="flex items-center gap-space-sm p-space-md rounded-lg hover:bg-surface-container cursor-pointer transition-colors"
                      >
                        <input
                          (change)="formSettings().hsmKeyRotationCadenceDays = 30"
                          [checked]="formSettings().hsmKeyRotationCadenceDays === 30"
                          class="w-4 h-4 text-primary accent-primary"
                          name="hsm-rotation"
                          type="radio"
                        />
                        <div class="flex flex-col">
                          <span class="font-label-md text-label-md font-bold text-on-surface">{{ t().hsm30Days }}</span>
                          <span class="font-caption text-caption text-on-surface-variant">{{ t().hsm30Desc }}</span>
                        </div>
                      </label>

                      <label
                        [class.bg-surface-container]="formSettings().hsmKeyRotationCadenceDays === 90"
                        [class.bg-surface-container-low]="formSettings().hsmKeyRotationCadenceDays !== 90"
                        class="flex items-center gap-space-sm p-space-md rounded-lg hover:bg-surface-container cursor-pointer transition-colors"
                      >
                        <input
                          (change)="formSettings().hsmKeyRotationCadenceDays = 90"
                          [checked]="formSettings().hsmKeyRotationCadenceDays === 90"
                          class="w-4 h-4 text-primary accent-primary"
                          name="hsm-rotation"
                          type="radio"
                        />
                        <div class="flex flex-col">
                          <span class="font-label-md text-label-md font-bold text-on-surface">{{ t().hsm90Days }}</span>
                          <span class="font-caption text-caption text-secondary font-bold">{{ t().hsm90Desc }}</span>
                        </div>
                      </label>

                      <label
                        [class.bg-surface-container]="formSettings().hsmKeyRotationCadenceDays === 0"
                        [class.bg-surface-container-low]="formSettings().hsmKeyRotationCadenceDays !== 0"
                        class="flex items-center gap-space-sm p-space-md rounded-lg hover:bg-surface-container cursor-pointer transition-colors"
                      >
                        <input
                          (change)="formSettings().hsmKeyRotationCadenceDays = 0"
                          [checked]="formSettings().hsmKeyRotationCadenceDays === 0"
                          class="w-4 h-4 text-primary accent-primary"
                          name="hsm-rotation"
                          type="radio"
                        />
                        <div class="flex flex-col">
                          <span class="font-label-md text-label-md font-bold text-on-surface">{{ t().hsmManual }}</span>
                          <span class="font-caption text-caption text-on-surface-variant">{{ t().hsmManualDesc }}</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <!-- Batch Interval Dropdown -->
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs">
                    <div class="max-w-md">
                      <label class="font-label-md text-label-md font-bold text-on-surface block">{{ t().merkleLabel }}</label>
                      <span class="font-caption text-caption text-on-surface-variant">{{ t().merkleDesc }}</span>
                    </div>
                    <div class="relative w-full sm:w-64">
                      <select
                        [(ngModel)]="formSettings().merkleTreeBatchInterval"
                        class="w-full h-10 px-space-md appearance-none rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface font-semibold focus:outline-none focus:bg-surface-container-lowest pr-8 cursor-pointer"
                      >
                        <option value="500ms Real-Time Consensus">500ms Real-Time Consensus</option>
                        <option value="1000ms Low-Overhead Mode">1000ms Low-Overhead Mode</option>
                        <option value="5000ms Batched Archive">5000ms Batched Archive</option>
                      </select>
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-outline">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                          <path d="m6 9 6 6 6-6"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <!-- Public Verification Key Endpoint -->
                  <div class="flex flex-col gap-space-xs pt-space-xs">
                    <label class="font-label-md text-label-md font-bold text-on-surface">{{ t().pubKeyLabel }}</label>
                    <div class="flex items-center bg-primary text-pure-white rounded-lg p-space-sm overflow-hidden">
                      <div class="flex items-center gap-space-sm px-2 text-on-primary-container shrink-0">
                        <svg class="w-4 h-4 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 8v8"></path>
                          <path d="M8 12h8"></path>
                        </svg>
                        <span class="font-caption text-caption font-mono uppercase tracking-wider text-[11px]">PUBKEY-SHA256</span>
                      </div>
                      <code class="font-caption text-caption font-mono text-pure-white truncate flex-1 px-2 select-all">
                        {{ formSettings().publicKeyEndpoint }}
                      </code>
                      <button
                        type="button"
                        (click)="copyEndpoint(formSettings().publicKeyEndpoint)"
                        class="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-tint/60 hover:bg-surface-tint text-pure-white font-caption text-caption font-semibold transition-all shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary-container"
                        aria-label="Copier le endpoint de clé publique"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                          <rect height="13" rx="2" ry="2" width="13" x="9" y="9"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span>{{ keyCopied() ? t().copiedKeyLabel : t().copyKeyLabel }}</span>
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              <!-- Approvals & Governance (5 Cols) -->
              <div class="lg:col-span-5 flex flex-col gap-space-xl">
                <section class="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm border border-surface-container/60 flex flex-col gap-space-md">
                  <div class="flex items-center gap-space-sm pb-space-xs">
                    <div class="p-2 rounded-lg bg-surface-container text-primary">
                      <svg class="w-5 h-5 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </div>
                    <div>
                      <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">{{ t().fourEyesLabel }}</h2>
                      <p class="font-caption text-caption text-on-surface-variant">{{ t().fourEyesDesc }}</p>
                    </div>
                  </div>

                  <div class="flex items-start justify-between gap-space-md p-space-md rounded-lg bg-surface-container-low">
                    <div class="flex items-start gap-space-sm">
                      <div class="w-8 h-8 rounded-lg bg-primary text-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </div>
                      <div class="flex flex-col">
                        <div class="flex items-center gap-space-xs">
                          <span class="font-label-md text-label-md font-bold text-on-surface">{{ t().fourEyesLabel }}</span>
                          <span class="px-1.5 py-0.2 bg-primary text-pure-white rounded font-caption text-[10px] font-bold">Mandatory</span>
                        </div>
                        <span class="font-caption text-caption text-on-surface-variant">{{ t().fourEyesDesc }}</span>
                      </div>
                    </div>
                    <input
                      [checked]="formSettings().fourEyesPrincipleMandatory"
                      class="w-5 h-5 mt-1 rounded accent-primary cursor-not-allowed opacity-80 shrink-0"
                      disabled
                      type="checkbox"
                    />
                  </div>
                </section>
              </div>
            </div>
          }

          <!-- TAB 4: INTEGRATIONS & WEBHOOKS -->
          @if (activeTab() === 'integrations') {
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
              <div class="lg:col-span-12">
                <section class="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm border border-surface-container/60 flex flex-col gap-space-md">
                  <div class="flex items-center justify-between pb-space-xs">
                    <div class="flex items-center gap-space-sm">
                      <div class="p-2 rounded-lg bg-surface-container text-primary">
                        <svg class="w-5 h-5 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                          <path d="m18 16 4-4-4-4"></path>
                          <path d="m6 8-4 4 4 4"></path>
                          <path d="m14.5 4-5 16"></path>
                        </svg>
                      </div>
                      <div>
                        <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">{{ t().integrationsTitle }}</h2>
                        <p class="font-caption text-caption text-on-surface-variant">{{ t().integrationsDesc }}</p>
                      </div>
                    </div>
                    <button type="button" class="font-label-sm text-label-sm text-secondary hover:underline font-bold flex items-center gap-1 cursor-pointer">
                      <span>{{ t().manageAllLabel }}</span>
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-space-xs">
                    <!-- Slack -->
                    <div class="flex items-center justify-between p-space-md rounded-lg bg-surface-container-low border border-surface-container/60">
                      <div class="flex items-center gap-space-md">
                        <div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center font-bold text-on-surface">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                        </div>
                        <div class="flex flex-col">
                          <span class="font-label-md text-label-md font-bold text-on-surface">{{ t().slackName }}</span>
                          <span class="font-caption text-caption text-on-surface-variant">{{ t().slackDesc }}</span>
                        </div>
                      </div>
                      <div class="flex items-center gap-space-xs text-success">
                        <span class="w-2 h-2 rounded-full bg-success"></span>
                        <span class="font-caption text-caption font-bold">{{ t().connectedBadge }}</span>
                      </div>
                    </div>

                    <!-- HashiCorp Vault -->
                    <div class="flex items-center justify-between p-space-md rounded-lg bg-surface-container-low border border-surface-container/60">
                      <div class="flex items-center gap-space-md">
                        <div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center font-bold text-on-surface">
                          <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M21 2l-2 2m-1-1l-3 3m5 0l-3-3m-3 3l-2 2-4-4-5 5 1.5 1.5L8 10l3 3 2-2"></path>
                            <circle cx="7" cy="17" r="3"></circle>
                          </svg>
                        </div>
                        <div class="flex flex-col">
                          <span class="font-label-md text-label-md font-bold text-on-surface">{{ t().vaultName }}</span>
                          <span class="font-caption text-caption text-on-surface-variant">{{ t().vaultDesc }}</span>
                        </div>
                      </div>
                      <div class="flex items-center gap-space-xs text-success">
                        <span class="w-2 h-2 rounded-full bg-success"></span>
                        <span class="font-caption text-caption font-bold">{{ t().syncingBadge }}</span>
                      </div>
                    </div>

                    <!-- AWS CloudWatch -->
                    <div class="flex items-center justify-between p-space-md rounded-lg bg-surface-container-low border border-surface-container/60">
                      <div class="flex items-center gap-space-md">
                        <div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center font-bold text-on-surface">
                          <svg class="w-5 h-5 text-info" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                          </svg>
                        </div>
                        <div class="flex flex-col">
                          <span class="font-label-md text-label-md font-bold text-on-surface">{{ t().cloudWatchName }}</span>
                          <span class="font-caption text-caption text-on-surface-variant">{{ t().cloudWatchDesc }}</span>
                        </div>
                      </div>
                      <div class="flex items-center gap-space-xs text-success">
                        <span class="w-2 h-2 rounded-full bg-success"></span>
                        <span class="font-caption text-caption font-bold">{{ t().streamingBadge }}</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          }

          <!-- TAB 5: AUDIT & COMPLIANCE RULES (DANGER ZONE) -->
          @if (activeTab() === 'audit') {
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
              <div class="lg:col-span-12">
                <section class="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm border border-surface-container/60 flex flex-col gap-space-md">
                  <div class="flex items-center gap-space-sm pb-space-xs">
                    <div class="p-2 rounded-lg bg-error-container text-error">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                        <line x1="12" x2="12" y1="9" y2="13"></line>
                        <line x1="12" x2="12.01" y1="17" y2="17"></line>
                      </svg>
                    </div>
                    <div>
                      <h2 class="font-headline-sm text-headline-sm text-error font-bold">{{ t().dangerTitle }}</h2>
                      <p class="font-caption text-caption text-on-surface-variant">{{ t().dangerDesc }}</p>
                    </div>
                  </div>

                  <div class="flex flex-col gap-space-sm pt-space-xs">
                    <!-- Flush Cache -->
                    <div class="flex items-center justify-between p-space-md rounded-lg bg-surface-container-low border border-surface-container/60">
                      <div class="flex flex-col">
                        <span class="font-label-md text-label-md font-bold text-on-surface">{{ t().flushCacheLabel }}</span>
                        <span class="font-caption text-caption text-on-surface-variant">{{ t().flushCacheDesc }}</span>
                      </div>
                      <button
                        type="button"
                        (click)="confirmAction('Flush Cache')"
                        class="px-space-md py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold transition-colors cursor-pointer"
                      >
                        {{ t().flushBtn }}
                      </button>
                    </div>

                    <!-- Drain Cluster -->
                    <div class="flex items-center justify-between p-space-md rounded-lg bg-surface-container-low border border-surface-container/60">
                      <div class="flex flex-col">
                        <span class="font-label-md text-label-md font-bold text-on-surface">{{ t().drainLabel }}</span>
                        <span class="font-caption text-caption text-on-surface-variant">{{ t().drainDesc }}</span>
                      </div>
                      <button
                        type="button"
                        (click)="confirmAction('Drain Nodes')"
                        class="px-space-md py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold transition-colors cursor-pointer"
                      >
                        {{ t().drainBtn }}
                      </button>
                    </div>

                    <!-- Emergency Lockout -->
                    <div class="flex items-center justify-between p-space-md rounded-lg bg-error-container text-on-error-container">
                      <div class="flex flex-col">
                        <span class="font-label-md text-label-md font-bold text-error">{{ t().lockoutLabel }}</span>
                        <span class="font-caption text-caption text-on-error-container/80">{{ t().lockoutDesc }}</span>
                      </div>
                      <button
                        type="button"
                        (click)="confirmAction('Emergency Lockout')"
                        class="px-space-md py-1.5 rounded-lg bg-error text-pure-white hover:bg-error/90 font-label-sm text-label-sm font-bold transition-all active:scale-[0.98] shadow-sm cursor-pointer"
                      >
                        {{ t().lockoutBtn }}
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          }
        </main>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  private readonly settingsService = inject(SettingsService);
  private readonly themeService = inject(ThemeService);
  private readonly i18nService = inject(I18nService);

  readonly toastMessage = this.settingsService.toastMessage;
  readonly activeTab = signal<string>('preferences');
  readonly keyCopied = signal<boolean>(false);

  // Global Theme & Language signals shared across the whole application
  readonly currentTheme = this.themeService.currentTheme;
  readonly currentLanguage = this.i18nService.currentLang;

  readonly formSettings = signal<EngineSettings>({
    defaultWorkflowTimeoutSeconds: 3600,
    maxConcurrencyPerTenant: 2500,
    automaticRetryEnabled: true,
    strictSlaBreachAlerting: true,
    signatureAlgorithm: 'Ed25519 (Recommended)',
    hsmKeyRotationCadenceDays: 90,
    merkleTreeBatchInterval: '500ms Real-Time Consensus',
    publicKeyEndpoint: 'https://keys.vanguard.internal/v4/certs/vanguard-pub-key-2024-v4.pem',
    stepUpMfaHighValueEnabled: true,
    mfaThresholdAmount: 50000,
    outOfOfficeRoutingEnabled: true,
    fourEyesPrincipleMandatory: true,
    clusterMode: 'Distributed Micro-Sharded',
    clusterVersion: 'v4.19.2',
    activeWorkers: 1842,
    maxWorkers: 2500,
    avgLatencyMs: 14.2,
    availabilityZonesCount: 4
  });

  private readonly translations: Record<'fr' | 'en', TranslationStrings> = {
    fr: {
      breadcrumbPreferences: 'Préférences',
      breadcrumbSettings: 'Paramètres & Configuration Système',
      pageTitle: 'Paramètres & Préférences Moteur',
      pageSubtitle: "Personnalisez l'affichage, la langue, les paramètres globaux du cluster d'exécution, la cryptographie et les intégrations.",
      restoreDefaults: 'Rétablir par défaut',
      saveChanges: 'Enregistrer tout',
      toastConfigSaved: 'Configuration Synchronisée',

      tabPreferences: 'Préférences & Général',
      tabEngine: "Moteur d'exécution & SLA",
      tabSecurity: 'Sécurité & Cryptographie',
      tabIntegrations: 'Intégrations & Webhooks',
      tabAudit: 'Audit & Conformité',

      themeSectionTitle: "Thème de l'interface",
      themeSectionDesc: 'Sélectionnez le mode visuel adapté à votre confort de travail (Blanc clair ou Noir sombre).',
      themeLightTitle: 'Thème Blanc (Clair)',
      themeLightDesc: 'Palette claire lumineuse avec fond blanc et contrastes optimisés pour la journée.',
      themeDarkTitle: 'Thème Noir (Sombre)',
      themeDarkDesc: 'Palette sombre reposante réduisant la fatigue visuelle en environnement tamisé.',
      themeActive: 'Actif',
      themeSelect: 'Sélectionner',

      langSectionTitle: "Langue de l'application",
      langSectionDesc: 'Basculez instantanément la langue de votre espace de travail entre le français et l’anglais.',
      langFrTitle: 'Français (France)',
      langFrDesc: 'Interface, libellés système et notifications traduits en français.',
      langEnTitle: 'English (United States)',
      langEnDesc: 'Enterprise terminology and original technical system labels in English.',
      langActive: 'Actif',
      langSelect: 'Sélectionner',

      workspaceSectionTitle: 'Espace de travail & Session',
      workspaceSectionDesc: 'Détails de votre session organisationnelle et région de connexion.',
      orgLabel: 'Organisation',
      clusterEnvLabel: 'Environnement de cluster',
      timezoneLabel: 'Fuseau horaire',
      activeRoleLabel: 'Rôle actif',

      clusterModeLabel: "Mode d'exécution du cluster",
      activeClusterBanner: 'Consensus synchronisé sur 4 zones de disponibilité. Basculement automatique opérationnel.',
      activeWorkersLabel: 'Workers Actifs',
      avgLatencyLabel: 'Latence Moyenne',
      runtimeTitle: "Règles d'exécution & Concurrence Moteur",
      runtimeDesc: 'Limites de débit des pipelines, algorithmes de retry et politiques de timeout.',
      realtimeBadge: 'Config Temps Réel',
      timeoutLabel: 'Timeout de Workflow par Défaut',
      timeoutDesc: "Seuil d'interruption pour les branches asynchrones bloquées.",
      concurrencyLabel: 'Concurrence Maximale par Tenant',
      concurrencyDesc: 'Nombre maximal de threads de calcul simultanés autorisés.',
      retryLabel: 'Tentative automatique sur panne transitoire de nœud',
      retryDesc: "3 tentatives avec espacement exponentiel tronqué avant d'alerter.",
      slaLabel: 'Alerte prédictive stricte de violation de SLA',
      slaDesc: 'Diffusion d’alertes PagerDuty dès 80% du seuil SLA atteint.',

      cryptoTitle: 'Enclave Cryptographique & Signatures',
      cryptoDesc: 'Attestation HSM matériel et validation d’état des pipelines.',
      fipsBadge: 'Validé FIPS 140-3',
      algorithmLabel: 'Algorithme de Signature par Défaut',
      algorithmDesc: 'Appliqué à chaque somme de contrôle de tâche dans le registre inviolable.',
      hsmLabel: 'Cadence de Rotation de la Clé Maître HSM',
      hsmDesc: 'Gère la rotation automatisée des clés asymétriques AWS CloudHSM.',
      hsm30Days: 'Tous les 30 jours',
      hsm30Desc: 'Défense stricte',
      hsm90Days: 'Tous les 90 jours',
      hsm90Desc: 'Standard SOC-2',
      hsmManual: 'Déclenchement Manuel',
      hsmManualDesc: 'Signature admin',
      merkleLabel: 'Intervalle de Lot Merkle Tree',
      merkleDesc: "Fréquence d'écriture des condensats racines sur les nœuds.",
      pubKeyLabel: 'Point de Terminaison de Clé Publique',
      copyKeyLabel: 'Copier la clé',
      copiedKeyLabel: 'Copié !',
      approvalsTitle: 'Approbations Humaines & Gouvernance',
      approvalsDesc: 'Contrôles manuels HITL, seuils MFA et politique des 4 yeux.',
      mfaLabel: 'MFA renforcé pour montants élevés',
      mfaDesc: 'Demande WebAuthn / FIDO2 pour les approbations excédant 50 000 $ USD.',
      oooLabel: 'Délégation d’absence (Out-of-Office)',
      oooDesc: 'Réachemine automatiquement les validations en attente vers un suppléant.',
      fourEyesLabel: 'Principe des 4 Yeux (Four-Eyes)',
      fourEyesDesc: 'Exige 2 approbateurs distincts d’équipes séparées pour la production.',

      integrationsTitle: 'Intégrations & Canaux Connectés',
      integrationsDesc: 'Canaux de notification et connecteurs d’événements critiques.',
      manageAllLabel: 'Tout gérer',
      slackName: 'Slack Workflow Bot',
      slackDesc: '3 canaux synchronisés (#ops-alerts, #sec-eng, #exec)',
      vaultName: 'HashiCorp Vault',
      vaultDesc: 'Moteur KMS Enterprise v1.14',
      cloudWatchName: 'AWS CloudWatch',
      cloudWatchDesc: 'Flux direct vers le groupe de logs us-east-1',
      connectedBadge: 'Connecté',
      syncingBadge: 'Synchronisé',
      streamingBadge: 'En direct',

      dangerTitle: 'Zone Dangereuse & Contrôles Critiques',
      dangerDesc: 'Opérations destructives nécessitant une autorisation SuperAdmin.',
      flushCacheLabel: 'Purger le cache Redis du Moteur',
      flushCacheDesc: 'Efface l’état éphémère pour les 42 files actives.',
      flushBtn: 'Purger',
      drainLabel: 'Drainer le Cluster US-East-1',
      drainDesc: 'Arrête l’ordonnancement et migre les tâches en cours.',
      drainBtn: 'Drainer',
      lockoutLabel: 'Verrouillage d’Urgence en Lecture Seule',
      lockoutDesc: 'Gèle immédiatement tous les déclencheurs de workflow de l’organisation.',
      lockoutBtn: 'Activer'
    },
    en: {
      breadcrumbPreferences: 'Preferences',
      breadcrumbSettings: 'Settings & System Configuration',
      pageTitle: 'Settings & Engine Preferences',
      pageSubtitle: 'Configure interface appearance, language, global cluster execution parameters, cryptographic roots, and integrations.',
      restoreDefaults: 'Restore Defaults',
      saveChanges: 'Save All Changes',
      toastConfigSaved: 'Configuration Synchronized',

      tabPreferences: 'Preferences & General',
      tabEngine: 'Execution Engine & SLA',
      tabSecurity: 'Security & Cryptography',
      tabIntegrations: 'Integrations & Webhooks',
      tabAudit: 'Audit & Compliance Rules',

      themeSectionTitle: 'Interface Theme',
      themeSectionDesc: 'Select visual appearance adapted to your environment (White / Light mode or Black / Dark mode).',
      themeLightTitle: 'White Theme (Light)',
      themeLightDesc: 'Crisp bright canvas with clear high-contrast borders for daytime work.',
      themeDarkTitle: 'Black Theme (Dark)',
      themeDarkDesc: 'Restful deep dark palette engineered to minimize eye strain in dim environments.',
      themeActive: 'Active',
      themeSelect: 'Select',

      langSectionTitle: 'Application Language',
      langSectionDesc: 'Switch the workspace language instantly between French and English.',
      langFrTitle: 'French (France)',
      langFrDesc: 'Complete interface, system labels and alert notifications in French.',
      langEnTitle: 'English (United States)',
      langEnDesc: 'Standard enterprise terminology and default technical system labels in English.',
      langActive: 'Active',
      langSelect: 'Select',

      workspaceSectionTitle: 'Workspace & Session',
      workspaceSectionDesc: 'Organizational identity, cluster zone, and active administrative credentials.',
      orgLabel: 'Organization',
      clusterEnvLabel: 'Cluster Environment',
      timezoneLabel: 'Timezone',
      activeRoleLabel: 'Active Role',

      clusterModeLabel: 'Execution Engine Mode',
      activeClusterBanner: 'Cluster consensus synchronized across 4 Availability Zones. Auto-failover healthy.',
      activeWorkersLabel: 'Active Workers',
      avgLatencyLabel: 'Avg Latency',
      runtimeTitle: 'Engine Runtime & Concurrency Rules',
      runtimeDesc: 'Limits on pipeline throughput, retry backoff algorithms, and timeout policies.',
      realtimeBadge: 'Realtime Config',
      timeoutLabel: 'Default Workflow Timeout',
      timeoutDesc: 'Execution abort threshold for hung async branches.',
      concurrencyLabel: 'Max Concurrency per Tenant',
      concurrencyDesc: 'Maximum parallel worker subprocess threads permitted across distributed nodes.',
      retryLabel: 'Automatic Retry on Transient Node Failure',
      retryDesc: 'Executes 3 attempts with truncated exponential jitter before marking DAG execution as degraded.',
      slaLabel: 'Strict SLA Breach Predictive Alerting',
      slaDesc: 'Broadcast alerts via PagerDuty when pipeline reaches 80% of defined SLA threshold.',

      cryptoTitle: 'Cryptographic Enclave & Signatures',
      cryptoDesc: 'Hardware Security Module (HSM) attestation and pipeline state validation.',
      fipsBadge: 'FIPS 140-3 Validated',
      algorithmLabel: 'Default Signature Algorithm',
      algorithmDesc: 'Applied to every step execution checksum in the tamper-proof ledger.',
      hsmLabel: 'HSM Root Master Key Rotation Cadence',
      hsmDesc: 'Governs autonomous rotation of asymmetric master wrapping keys in AWS CloudHSM.',
      hsm30Days: 'Every 30 Days',
      hsm30Desc: 'Strict Defense',
      hsm90Days: 'Every 90 Days',
      hsm90Desc: 'SOC-2 Default',
      hsmManual: 'Manual Trigger',
      hsmManualDesc: 'Admin Signed',
      merkleLabel: 'Merkle Tree Batch Interval',
      merkleDesc: 'Window frequency for writing root hashes to distributed ledger nodes.',
      pubKeyLabel: 'Public Verification Key Endpoint',
      copyKeyLabel: 'Copy Key',
      copiedKeyLabel: 'Copied!',
      approvalsTitle: 'Human Approvals & HITL Governance',
      approvalsDesc: 'Manual checks, step-up MFA verification, and four-eyes review policies.',
      mfaLabel: 'Step-Up MFA for High-Value',
      mfaDesc: 'Prompt WebAuthn / FIDO2 security token for approvals exceeding $50,000 USD value.',
      oooLabel: 'Out-of-Office Routing',
      oooDesc: 'Automatically reroute pending workflow review tasks to secondary peer delegates.',
      fourEyesLabel: 'Four-Eyes Principle',
      fourEyesDesc: 'Requires 2 distinct approvers from separate teams for production pipeline deploys.',

      integrationsTitle: 'Connected Integrations & Channels',
      integrationsDesc: 'Mission-critical outbound event channels and telemetry pipes.',
      manageAllLabel: 'Manage All',
      slackName: 'Slack Workflow Bot',
      slackDesc: '3 channels synced (#ops-alerts, #sec-eng, #exec)',
      vaultName: 'HashiCorp Vault',
      vaultDesc: 'v1.14 Enterprise KMS Engine',
      cloudWatchName: 'AWS CloudWatch',
      cloudWatchDesc: 'Direct stream to us-east-1 log group',
      connectedBadge: 'Connected',
      syncingBadge: 'Syncing',
      streamingBadge: 'Streaming',

      dangerTitle: 'Danger Zone & Cluster Controls',
      dangerDesc: 'Destructive operations requiring Root authorization.',
      flushCacheLabel: 'Flush Engine Redis Cache',
      flushCacheDesc: 'Purges ephemeral state for 42 active queues.',
      flushBtn: 'Flush',
      drainLabel: 'Drain US-East-1 Cluster',
      drainDesc: 'Stop scheduling new tasks; migrate running jobs.',
      drainBtn: 'Drain',
      lockoutLabel: 'Emergency Read-Only Lockout',
      lockoutDesc: 'Immediately freezes all DAG triggers across organization.',
      lockoutBtn: 'Initiate'
    }
  };

  readonly t = computed(() => this.translations[this.currentLanguage()]);

  ngOnInit(): void {
    this.settingsService.loadSettings().subscribe(data => {
      if (data) {
        this.formSettings.set({ ...data });
      }
    });
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.themeService.setTheme(theme);
    const msg = theme === 'dark'
      ? (this.currentLanguage() === 'fr' ? 'Thème Noir (Sombre) activé sur toute l\'application' : 'Dark Theme activated across the entire application')
      : (this.currentLanguage() === 'fr' ? 'Thème Blanc (Clair) activé sur toute l\'application' : 'Light Theme activated across the entire application');
    this.settingsService.showToast(msg);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  setLanguage(lang: 'fr' | 'en'): void {
    this.i18nService.setLanguage(lang);
    const msg = lang === 'fr' ? 'Langue de l\'application : Français' : 'Application language: English';
    this.settingsService.showToast(msg);
  }

  toggleLanguage(): void {
    this.i18nService.toggleLanguage();
  }

  saveChanges(): void {
    this.settingsService.updateSettings(this.formSettings()).subscribe();
  }

  restoreDefaults(): void {
    const confirmMsg = this.currentLanguage() === 'fr'
      ? 'Rétablir les valeurs par défaut du moteur et des règles de configuration ?'
      : 'Restore default runtime and SLA configuration values?';
    if (confirm(confirmMsg)) {
      this.settingsService.restoreDefaults().subscribe(defaults => {
        this.formSettings.set({ ...defaults });
      });
    }
  }

  copyEndpoint(url: string): void {
    navigator.clipboard.writeText(url).then(() => {
      this.keyCopied.set(true);
      setTimeout(() => this.keyCopied.set(false), 2000);
    });
  }

  confirmAction(actionName: string): void {
    const confirmMsg = this.currentLanguage() === 'fr'
      ? `Exécuter l'action administrative critique : ${actionName} ? Cette action est consignée dans le registre d'audit immuable.`
      : `Execute critical administrative action: ${actionName}? This action is recorded in the immutable audit log.`;
    if (confirm(confirmMsg)) {
      this.settingsService.executeDangerAction(actionName, 'Admin manual trigger via Settings panel').subscribe();
    }
  }
}
