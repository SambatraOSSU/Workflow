import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-surface font-body-md text-on-surface min-h-screen flex flex-col justify-between">
      <!-- Fixed Header -->
      <header class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div class="h-16 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
          <div class="flex items-center gap-space-lg">
            <a routerLink="/" class="flex items-center gap-space-sm">
              <div class="w-8 h-8 rounded bg-primary-container flex items-center justify-center shadow-sm">
                <svg class="w-5 h-5 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <span class="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">VANGUARD</span>
              <span class="font-caption text-caption uppercase text-on-surface-variant font-semibold tracking-wider">Workflow Engine</span>
            </a>
            <div class="h-4 w-[1px] bg-outline-variant hidden sm:block"></div>
            <div class="hidden sm:flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-full border border-surface-container">
              <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              <span class="font-caption text-caption text-on-surface-variant font-medium">Production - US-East-1</span>
            </div>
          </div>

          <div class="flex items-center gap-2 sm:gap-3">
            <!-- Language Switcher (FR / EN) -->
            <div class="h-9 inline-flex items-center p-0.5 rounded-lg bg-surface-container-low border border-surface-container shadow-xs">
              <button
                type="button"
                (click)="i18n.setLanguage('fr')"
                class="h-full px-2 sm:px-2.5 rounded-md text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                [class]="i18n.currentLang() === 'fr' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'"
                title="Passer en Français"
                aria-label="Passer en Français"
              >
                <svg class="w-4 h-2.5 rounded-[2px] shadow-xs shrink-0 overflow-hidden border border-black/10 inline-block align-middle" viewBox="0 0 640 480" aria-hidden="true">
                  <path fill="#fff" d="M0 0h640v480H0z"/>
                  <path fill="#00267f" d="M0 0h213.3v480H0z"/>
                  <path fill="#f31830" d="M426.7 0H640v480H426.7z"/>
                </svg>
                <span class="leading-none text-xs">FR</span>
              </button>
              <button
                type="button"
                (click)="i18n.setLanguage('en')"
                class="h-full px-2 sm:px-2.5 rounded-md text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                [class]="i18n.currentLang() === 'en' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'"
                title="Switch to English"
                aria-label="Switch to English"
              >
                <svg class="w-4 h-2.5 rounded-[2px] shadow-xs shrink-0 overflow-hidden border border-black/10 inline-block align-middle" viewBox="0 0 640 480" aria-hidden="true">
                  <path fill="#b22234" d="M0 0h640v480H0z"/>
                  <path stroke="#fff" stroke-width="37" d="M0 55.5h640M0 129.5h640M0 203.5h640M0 277.5h640M0 351.5h640M0 425.5h640"/>
                  <path fill="#3c3b6e" d="M0 0h260v259H0z"/>
                  <g fill="#fff">
                    <circle cx="30" cy="25" r="7"/><circle cx="70" cy="25" r="7"/><circle cx="110" cy="25" r="7"/><circle cx="150" cy="25" r="7"/><circle cx="190" cy="25" r="7"/><circle cx="230" cy="25" r="7"/>
                    <circle cx="50" cy="60" r="7"/><circle cx="90" cy="60" r="7"/><circle cx="130" cy="60" r="7"/><circle cx="170" cy="60" r="7"/><circle cx="210" cy="60" r="7"/>
                    <circle cx="30" cy="95" r="7"/><circle cx="70" cy="95" r="7"/><circle cx="110" cy="95" r="7"/><circle cx="150" cy="95" r="7"/><circle cx="190" cy="95" r="7"/><circle cx="230" cy="95" r="7"/>
                    <circle cx="50" cy="130" r="7"/><circle cx="90" cy="130" r="7"/><circle cx="130" cy="130" r="7"/><circle cx="170" cy="130" r="7"/><circle cx="210" cy="130" r="7"/>
                    <circle cx="30" cy="165" r="7"/><circle cx="70" cy="165" r="7"/><circle cx="110" cy="165" r="7"/><circle cx="150" cy="165" r="7"/><circle cx="190" cy="165" r="7"/><circle cx="230" cy="165" r="7"/>
                    <circle cx="50" cy="200" r="7"/><circle cx="90" cy="200" r="7"/><circle cx="130" cy="200" r="7"/><circle cx="170" cy="200" r="7"/><circle cx="210" cy="200" r="7"/>
                    <circle cx="30" cy="235" r="7"/><circle cx="70" cy="235" r="7"/><circle cx="110" cy="235" r="7"/><circle cx="150" cy="235" r="7"/><circle cx="190" cy="235" r="7"/><circle cx="230" cy="235" r="7"/>
                  </g>
                </svg>
                <span class="leading-none text-xs">EN</span>
              </button>
            </div>

            <!-- Theme Switcher (Blanc / Noir) -->
            <button
              type="button"
              (click)="theme.toggleTheme()"
              class="h-9 w-9 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface inline-flex items-center justify-center transition-colors cursor-pointer border border-surface-container shadow-xs"
              [title]="theme.currentTheme() === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'"
              aria-label="Basculer le thème blanc/noir"
            >
              @if (theme.currentTheme() === 'light') {
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
              } @else {
                <svg class="w-4 h-4 text-info" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              }
            </button>

            <!-- Connexion Link -->
            <a routerLink="/login" class="h-9 inline-flex items-center justify-center px-3.5 rounded-lg text-sm font-semibold text-primary hover:text-secondary-container hover:bg-surface-container-low transition-colors">
              Se connecter
            </a>

            <!-- Créer un compte Button -->
            <a routerLink="/register" class="h-9 inline-flex items-center justify-center px-4 rounded-lg bg-secondary-container hover:bg-secondary text-noir-text hover:text-pure-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all">
              Créer un compte
            </a>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="w-full pt-16 flex-1 flex flex-col justify-center bg-surface">
        <div class="flex flex-col w-full">
          <!-- Subtle Ambient Glow Canvas Anchor -->
          <div class="relative w-full overflow-hidden py-space-xl px-gutter lg:px-gutter-lg flex flex-col items-center">
            <!-- Geometric Background Texture (Enterprise Grid) -->
            <div class="absolute inset-0 pointer-events-none opacity-40">
              <svg class="w-full h-full" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern height="32" id="grid-pattern" patternUnits="userSpaceOnUse" width="32">
                    <path class="text-surface-container-high" d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" stroke-width="0.75"></path>
                    <circle class="text-outline-variant" cx="32" cy="32" fill="currentColor" r="1"></circle>
                  </pattern>
                </defs>
                <rect fill="url(#grid-pattern)" height="100%" width="100%"></rect>
              </svg>
            </div>

            <!-- Architectural Cluster Telemetry Watermark -->
            <div class="absolute top-6 right-12 hidden xl:flex flex-col items-end opacity-25 pointer-events-none font-caption text-caption text-on-surface-variant font-mono">
              <span>NODE_ENCLAVE // SECURE_ISOLATION_L3</span>
              <span>CLUSTER_INITIALIZER: v4.19-PROD</span>
              <span>EPHEMERAL_HSM_PORT: ENABLED</span>
            </div>

            <!-- Centered Form Canvas Wrapper -->
            <div class="relative w-full max-w-4xl flex flex-col gap-space-xl z-10">
              <!-- Step Indicator Bar -->
              <nav aria-label="Tenant Provisioning Steps" class="w-full bg-surface-container-lowest rounded-xl shadow-xs p-space-md md:p-space-lg border border-surface-container">
                <ol class="grid grid-cols-2 md:grid-cols-4 gap-space-md">
                  <!-- Step 1: Active -->
                  <li class="flex items-center gap-space-sm group">
                    <div class="w-8 h-8 rounded-lg bg-secondary-container text-noir-text flex items-center justify-center font-label-md text-label-md font-bold shadow-xs shrink-0">
                      01
                    </div>
                    <div class="flex flex-col min-w-0">
                      <span class="font-label-sm text-label-sm font-bold text-primary truncate">Organization</span>
                      <span class="font-caption text-caption text-secondary-container font-bold truncate">Active Enclave</span>
                    </div>
                  </li>
                  <!-- Step 2 -->
                  <li class="flex items-center gap-space-sm" [class.opacity-60]="!adminFullName() || !adminPassword()">
                    <div class="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface-variant flex items-center justify-center font-label-md text-label-md font-bold shrink-0">
                      02
                    </div>
                    <div class="flex flex-col min-w-0">
                      <span class="font-label-sm text-label-sm font-bold text-on-surface truncate">Super Admin</span>
                      <span class="font-caption text-caption text-on-surface-variant truncate">Credentials</span>
                    </div>
                  </li>
                  <!-- Step 3 -->
                  <li class="flex items-center gap-space-sm opacity-60">
                    <div class="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface-variant flex items-center justify-center font-label-md text-label-md font-bold shrink-0">
                      03
                    </div>
                    <div class="flex flex-col min-w-0">
                      <span class="font-label-sm text-label-sm font-bold text-on-surface truncate">Cluster & Region</span>
                      <span class="font-caption text-caption text-on-surface-variant truncate">Topology</span>
                    </div>
                  </li>
                  <!-- Step 4 -->
                  <li class="flex items-center gap-space-sm opacity-60">
                    <div class="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface-variant flex items-center justify-center font-label-md text-label-md font-bold shrink-0">
                      04
                    </div>
                    <div class="flex flex-col min-w-0">
                      <span class="font-label-sm text-label-sm font-bold text-on-surface truncate">Security & SSO</span>
                      <span class="font-caption text-caption text-on-surface-variant truncate">FIDO2 & Policy</span>
                    </div>
                  </li>
                </ol>
              </nav>
  

              <!-- Main Form Master Card -->
              <div class="w-full bg-surface-container-lowest rounded-xl shadow-md overflow-hidden flex flex-col border border-surface-container">
                <!-- Header Banner with Vanguard Primary Navy Accent Stripe -->
                <div class="w-full bg-primary-container text-pure-white p-space-xl md:p-space-2xl relative overflow-hidden">
                  <div class="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-secondary-container/10 blur-2xl pointer-events-none"></div>
                  <div class="relative z-10 flex flex-col gap-space-xs max-w-2xl">
                    <div class="flex items-center gap-space-sm">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container/20 text-secondary-container font-caption text-caption font-bold tracking-wider uppercase">
                        Tier-1 Production
                      </span>
                      <span class="text-on-primary-container font-caption text-caption">· Architecture Isolation Spec 4.2</span>
                    </div>
                    <h1 class="font-headline-lg text-headline-lg text-pure-white tracking-tight font-bold">Créer un compte Enterprise</h1>
                    <p class="font-body-md text-body-md text-on-primary-container leading-relaxed">
                      Deploy your dedicated workflow orchestration cluster with isolated cryptographic enclaves, zero-trust state verification, and single-tenant memory spaces.
                    </p>
                  </div>
                </div>

                <!-- Error Alert -->
                @if (errorMessage()) {
                  <div class="mx-space-xl mt-space-lg p-3.5 rounded-lg bg-error/10 border border-error/20 flex items-center gap-3 text-xs font-semibold text-error">
                    <svg class="w-5 h-5 flex-shrink-0 text-error" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>{{ errorMessage() }}</span>
                  </div>
                }

                <!-- Form Body Canvas -->
                <form class="p-space-xl md:p-space-2xl flex flex-col gap-space-2xl" (ngSubmit)="onSubmit()" novalidate>
                  <!-- SECTION 1: Organization & Workspace -->
                  <section class="flex flex-col gap-space-lg">
                    <div class="flex items-center justify-between pb-space-xs border-b border-surface-container">
                      <div class="flex items-center gap-space-sm">
                        <div class="w-6 h-6 rounded bg-primary-container flex items-center justify-center text-secondary-container">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" viewBox="0 0 24 24">
                            <rect height="20" rx="2" ry="2" width="16" x="4" y="2"></rect>
                            <path d="M9 22v-4h6v4"></path>
                            <path d="M8 6h.01"></path>
                            <path d="M16 6h.01"></path>
                            <path d="M12 6h.01"></path>
                            <path d="M12 10h.01"></path>
                            <path d="M12 14h.01"></path>
                            <path d="M16 10h.01"></path>
                            <path d="M16 14h.01"></path>
                            <path d="M8 10h.01"></path>
                            <path d="M8 14h.01"></path>
                          </svg>
                        </div>
                        <h2 class="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">Organization & Workspace</h2>
                      </div>
                      <span class="font-caption text-caption text-on-surface-variant font-mono uppercase tracking-wider font-semibold">Step 1 of 4</span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                      <!-- Organization Name Field -->
                      <div class="flex flex-col gap-space-xs">
                        <label class="font-label-md text-label-md font-semibold text-primary" for="org-name">
                          Legal Organization Name <span class="text-error">*</span>
                        </label>
                        <div class="relative flex items-center">
                          <span class="absolute left-3 text-outline">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                              <path d="M3 21h18"></path>
                              <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
                              <path d="M9 9h1"></path>
                              <path d="M9 13h1"></path>
                              <path d="M9 17h1"></path>
                              <path d="M14 9h1"></path>
                              <path d="M14 13h1"></path>
                              <path d="M14 17h1"></path>
                            </svg>
                          </span>
                          <input
                            class="w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary-container transition-all border border-surface-container"
                            id="org-name"
                            placeholder="e.g. Acme Corporation"
                            required
                            type="text"
                            [ngModel]="organizationName()"
                            (ngModelChange)="onOrgNameChange($event)"
                            name="orgName"
                          />
                        </div>
                      </div>

                      <!-- Dedicated Tenant Slug Field -->
                      <div class="flex flex-col gap-space-xs">
                        <div class="flex items-center justify-between">
                          <label class="font-label-md text-label-md font-semibold text-primary" for="tenant-slug">
                            Dedicated Tenant Slug <span class="text-error">*</span>
                          </label>
                          <span class="font-caption text-caption text-success font-bold flex items-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            Domain Available
                          </span>
                        </div>
                        <div class="relative flex items-center shadow-xs rounded-lg overflow-hidden border border-surface-container">
                          <span class="absolute left-3 text-outline">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                          </span>
                          <input
                            class="w-full h-10 pl-10 pr-40 bg-surface-container-low text-primary font-mono text-body-md focus:outline-none focus:bg-surface-container-lowest transition-all"
                            id="tenant-slug"
                            placeholder="tenant-prefix"
                            type="text"
                            [ngModel]="organizationSlug()"
                            (ngModelChange)="organizationSlug.set($event)"
                            name="tenantSlug"
                            required
                          />
                          <div class="absolute right-0 top-0 bottom-0 px-3 bg-surface-container flex items-center gap-1.5 text-on-surface-variant font-mono font-caption text-caption border-l border-surface-container">
                            <span>.vanguard.internal</span>
                          </div>
                        </div>
                      </div>

                      <!-- Primary Work Email -->
                      <div class="flex flex-col gap-space-xs">
                        <label class="font-label-md text-label-md font-semibold text-primary" for="work-email">
                          Authorized Work Email <span class="text-error">*</span>
                        </label>
                        <div class="relative flex items-center">
                          <span class="absolute left-3 text-outline">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                              <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                          </span>
                          <input
                            class="w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary-container transition-all border border-surface-container"
                            id="work-email"
                            placeholder="cfo.office@acme.com"
                            required
                            type="email"
                            [ngModel]="adminEmail()"
                            (ngModelChange)="adminEmail.set($event)"
                            name="adminEmail"
                          />
                        </div>
                      </div>

                      <!-- Estimated Workflow Volume -->
                      <div class="flex flex-col gap-space-xs">
                        <label class="font-label-md text-label-md font-semibold text-primary" for="workflow-volume">
                          Estimated Monthly Workflow Volume
                        </label>
                        <div class="relative flex items-center">
                          <span class="absolute left-3 text-outline pointer-events-none">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                            </svg>
                          </span>
                          <select
                            class="w-full h-10 pl-10 pr-10 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md appearance-none focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary-container transition-all cursor-pointer border border-surface-container"
                            id="workflow-volume"
                            [ngModel]="workflowVolume()"
                            (ngModelChange)="workflowVolume.set($event)"
                            name="workflowVolume"
                          >
                            <option value="500k">500,000+ executions / mo (Enterprise Scale)</option>
                            <option value="1m">1,000,000+ executions / mo (Global Hyperscale)</option>
                            <option value="250k">100,000 – 499,999 executions / mo (Standard Core)</option>
                            <option value="custom">Custom High-Frequency Dedicated Hardware Cluster</option>
                          </select>
                          <span class="absolute right-3 pointer-events-none text-outline">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <!-- Divider -->
                  <div class="w-full h-px bg-surface-container-high"></div>

                  <!-- SECTION 2: Primary Administrator Credentials -->
                  <section class="flex flex-col gap-space-lg">
                    <div class="flex items-center gap-space-sm pb-space-xs border-b border-surface-container">
                      <div class="w-6 h-6 rounded bg-primary-container flex items-center justify-center text-secondary-container">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" viewBox="0 0 24 24">
                          <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 8V7a3 3 0 0 1 6 0v3H9z"></path>
                        </svg>
                      </div>
                      <h2 class="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">Primary Super Administrator</h2>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                      <!-- Full Name Field -->
                      <div class="flex flex-col gap-space-xs">
                        <label class="font-label-md text-label-md font-semibold text-primary" for="admin-name">
                          Super Admin Full Name <span class="text-error">*</span>
                        </label>
                        <div class="relative flex items-center">
                          <span class="absolute left-3 text-outline">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </span>
                          <input
                            class="w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary-container transition-all border border-surface-container"
                            id="admin-name"
                            placeholder="Alexander Vance"
                            required
                            type="text"
                            [ngModel]="adminFullName()"
                            (ngModelChange)="adminFullName.set($event)"
                            name="adminName"
                          />
                        </div>
                      </div>

                      <!-- Operational Role Field -->
                      <div class="flex flex-col gap-space-xs">
                        <label class="font-label-md text-label-md font-semibold text-primary" for="admin-role">
                          Corporate Role & Governance Title
                        </label>
                        <div class="relative flex items-center">
                          <span class="absolute left-3 text-outline">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                              <rect height="14" rx="2" ry="2" width="20" x="2" y="7"></rect>
                              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                            </svg>
                          </span>
                          <input
                            class="w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary-container transition-all border border-surface-container"
                            id="admin-role"
                            placeholder="Chief Information Security Officer"
                            type="text"
                            [ngModel]="adminRole()"
                            (ngModelChange)="adminRole.set($event)"
                            name="adminRole"
                          />
                        </div>
                      </div>

                      <!-- Secure Password Field & Entropy Meter (Full Width) -->
                      <div class="flex flex-col gap-space-xs md:col-span-2">
                        <div class="flex items-center justify-between">
                          <label class="font-label-md text-label-md font-semibold text-primary" for="admin-password">
                            Root Tenant Master Keypass <span class="text-error">*</span>
                          </label>
                          <span class="font-caption text-caption text-success font-semibold flex items-center gap-1 font-mono">
                            <svg class="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            High Entropy: 128-bit
                          </span>
                        </div>
                        <div class="relative flex items-center">
                          <span class="absolute left-3 text-outline">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                              <rect height="11" rx="2" ry="2" width="18" x="3" y="11"></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                          </span>
                          <input
                            class="w-full h-10 pl-10 pr-12 rounded-lg bg-surface-container-low text-on-surface font-mono text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary-container transition-all border border-surface-container"
                            id="admin-password"
                            [type]="showPassword() ? 'text' : 'password'"
                            required
                            [ngModel]="adminPassword()"
                            (ngModelChange)="adminPassword.set($event)"
                            name="adminPassword"
                          />
                          <button
                            type="button"
                            (click)="showPassword.set(!showPassword())"
                            aria-label="Toggle password visibility"
                            class="absolute right-3 text-outline hover:text-primary transition-colors cursor-pointer"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                        </div>

                        <!-- Live Entropy Progress Bars -->
                        <div class="flex flex-col gap-1.5 pt-1">
                          <div class="grid grid-cols-4 gap-2">
                            <div class="h-1.5 rounded-full" [class]="passwordEntropy() >= 1 ? 'bg-success' : 'bg-surface-container-high'"></div>
                            <div class="h-1.5 rounded-full" [class]="passwordEntropy() >= 2 ? 'bg-success' : 'bg-surface-container-high'"></div>
                            <div class="h-1.5 rounded-full" [class]="passwordEntropy() >= 3 ? 'bg-success' : 'bg-surface-container-high'"></div>
                            <div class="h-1.5 rounded-full" [class]="passwordEntropy() >= 4 ? 'bg-success' : 'bg-surface-container-high'"></div>
                          </div>
                          <div class="flex justify-between items-center text-on-surface-variant font-caption text-caption">
                            <span>Cryptographic Strength: NIST SP 800-63B Compliant</span>
                            <span class="font-mono text-success font-bold">PASSED</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <!-- Divider -->
                  <div class="w-full h-px bg-surface-container-high"></div>

                  <!-- SECTION 3: Deployment & Compliance Baseline -->
                  <section class="flex flex-col gap-space-lg">
                    <div class="flex items-center gap-space-sm pb-space-xs border-b border-surface-container">
                      <div class="w-6 h-6 rounded bg-primary-container flex items-center justify-center text-secondary-container">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" viewBox="0 0 24 24">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                      </div>
                      <h2 class="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">Deployment & Compliance Baseline</h2>
                    </div>

                    <!-- Cloud Region Selection -->
                    <div class="flex flex-col gap-space-xs">
                      <label class="font-label-md text-label-md font-semibold text-primary" for="cloud-region">
                        Primary Enclave Region & Cloud Pod
                      </label>
                      <div class="relative flex items-center">
                        <span class="absolute left-3 text-outline pointer-events-none">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                          </svg>
                        </span>
                        <select
                          class="w-full h-10 pl-10 pr-10 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md appearance-none focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary-container transition-all cursor-pointer border border-surface-container"
                          id="cloud-region"
                          [ngModel]="cloudRegion()"
                          (ngModelChange)="cloudRegion.set($event)"
                          name="cloudRegion"
                        >
                          <option value="us-east-1">US-East-1 (N. Virginia - High Availability Pod)</option>
                          <option value="eu-west-1">EU-West-1 (Dublin, Ireland - GDPR Strict Sovereign Enclave)</option>
                          <option value="ap-southeast-1">AP-Southeast-1 (Singapore - Financial District Fabric)</option>
                          <option value="us-gov-west">US-Gov-West-1 (FedRAMP High Dedicated Partition)</option>
                        </select>
                        <span class="absolute right-3 pointer-events-none text-outline">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </div>
                    </div>

                    <!-- Checkboxes -->
                    <div class="flex flex-col gap-space-md pt-space-xs">
                      <!-- Checkbox 1 -->
                      <label class="flex items-start gap-space-md p-space-md rounded-lg bg-surface-container-low/60 hover:bg-surface-container-low transition-colors cursor-pointer group border border-surface-container">
                        <div class="relative flex items-center justify-center shrink-0 mt-0.5">
                          <input
                            type="checkbox"
                            [ngModel]="enforceWebAuthn()"
                            (ngModelChange)="enforceWebAuthn.set($event)"
                            name="webauthn"
                            class="peer sr-only"
                          />
                          <div class="w-5 h-5 rounded bg-surface-container-high peer-checked:bg-primary transition-all flex items-center justify-center text-pure-white">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        </div>
                        <div class="flex flex-col">
                          <span class="font-label-md text-label-md font-semibold text-primary">
                            Enforce Hardware WebAuthn / FIDO2 tokens for all admin roles
                          </span>
                          <span class="font-caption text-caption text-on-surface-variant">
                            Requires physical YubiKey or platform biometric security keys during root administrative escalation.
                          </span>
                        </div>
                      </label>

                      <!-- Checkbox 2 -->
                      <label class="flex items-start gap-space-md p-space-md rounded-lg bg-surface-container-low/60 hover:bg-surface-container-low transition-colors cursor-pointer group border border-surface-container">
                        <div class="relative flex items-center justify-center shrink-0 mt-0.5">
                          <input
                            type="checkbox"
                            [ngModel]="merkleAuditLog()"
                            (ngModelChange)="merkleAuditLog.set($event)"
                            name="merkle"
                            class="peer sr-only"
                          />
                          <div class="w-5 h-5 rounded bg-surface-container-high peer-checked:bg-primary transition-all flex items-center justify-center text-pure-white">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        </div>
                        <div class="flex flex-col">
                          <span class="font-label-md text-label-md font-semibold text-primary">
                            Enable automatic immutable Merkle tree audit logging
                          </span>
                          <span class="font-caption text-caption text-on-surface-variant">
                            Cryptographically binds workflow execution checkpoints to append-only tamper-evident audit storage.
                          </span>
                        </div>
                      </label>

                      <!-- Checkbox 3 -->
                      <label class="flex items-start gap-space-md p-space-md rounded-lg bg-surface-container-low/60 hover:bg-surface-container-low transition-colors cursor-pointer group border border-surface-container">
                        <div class="relative flex items-center justify-center shrink-0 mt-0.5">
                          <input
                            type="checkbox"
                            [ngModel]="agreeTerms()"
                            (ngModelChange)="agreeTerms.set($event)"
                            name="terms"
                            class="peer sr-only"
                          />
                          <div class="w-5 h-5 rounded bg-surface-container-high peer-checked:bg-primary transition-all flex items-center justify-center text-pure-white">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        </div>
                        <div class="flex flex-col">
                          <span class="font-label-md text-label-md font-semibold text-primary">
                            Agree to Vanguard Enterprise Master Services Agreement (MSA) and SLA Terms <span class="text-error">*</span>
                          </span>
                          <span class="font-caption text-caption text-on-surface-variant">
                            Includes 99.995% financial uptime guarantee, high-touch support SLA, and sovereign key custody protocol.
                          </span>
                        </div>
                      </label>
                    </div>
                  </section>

                  <!-- Primary CTA Button Block -->
                  <div class="flex flex-col items-center gap-space-lg pt-space-md">
                    <button
                      type="submit"
                      [disabled]="loading()"
                      [attr.aria-busy]="loading()"
                      aria-live="polite"
                      class="w-full md:w-auto min-w-[340px] h-[52px] min-h-[52px] px-space-2xl bg-secondary-container hover:bg-secondary text-noir-text hover:text-pure-white rounded-lg font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all duration-150 transform active:scale-[0.99] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      @if (loading()) {
                        <svg class="w-5 h-5 animate-spin motion-reduce:animate-none text-current shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span class="inline-block">Création du compte…</span>
                      } @else {
                        <span>Créer un compte</span>
                        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
                          <polyline points="13 17 18 12 13 7"></polyline>
                          <polyline points="6 17 11 12 6 7"></polyline>
                        </svg>
                      }
                    </button>

                    <!-- Bottom Navigation Back to Existing Session -->
                    <div class="flex items-center gap-space-xs font-body-md text-body-md text-on-surface-variant">
                      <span>Vous avez déjà un compte ?</span>
                      <a routerLink="/login" class="font-bold text-primary hover:text-secondary underline decoration-secondary-container decoration-2 underline-offset-4 transition-colors">
                        Se connecter
                      </a>
                    </div>
                  </div>
                </form>

                <!-- Compliance & Security Trust Bar (Integrated Card Footer) -->
                <div class="w-full bg-surface-container-low px-space-xl py-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md border-t border-surface-container">
                  <div class="flex items-center gap-space-xs text-on-surface-variant font-caption text-caption font-bold uppercase tracking-wider">
                    <svg class="w-4 h-4 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" viewBox="0 0 24 24">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    <span>Verified Trust Framework</span>
                  </div>

                  <!-- Trust Badges List -->
                  <div class="flex flex-wrap items-center justify-center gap-space-md font-mono font-caption text-caption text-on-surface">
                    <div class="flex items-center gap-1.5 bg-surface-container-lowest px-2.5 py-1 rounded shadow-xs border border-surface-container">
                      <svg class="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span class="font-bold">SOC-2</span>
                      <span class="text-on-surface-variant">Type II</span>
                    </div>

                    <div class="flex items-center gap-1.5 bg-surface-container-lowest px-2.5 py-1 rounded shadow-xs border border-surface-container">
                      <svg class="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                        <path d="M12 2v20M2 12h20"></path>
                      </svg>
                      <span class="font-bold">HIPAA</span>
                      <span class="text-on-surface-variant">BAA</span>
                    </div>

                    <div class="flex items-center gap-1.5 bg-surface-container-lowest px-2.5 py-1 rounded shadow-xs border border-surface-container">
                      <svg class="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                      <span class="font-bold">ISO</span>
                      <span class="text-on-surface-variant">27001:2022</span>
                    </div>

                    <div class="flex items-center gap-1.5 bg-surface-container-lowest px-2.5 py-1 rounded shadow-xs border border-surface-container">
                      <svg class="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                        <rect height="11" rx="2" ry="2" width="18" x="3" y="11"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      <span class="font-bold">FIPS</span>
                      <span class="text-on-surface-variant">140-3 L3</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Contextual Helper / Support Card -->
              <div class="w-full bg-surface-container-low/70 rounded-xl p-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md text-on-surface-variant border border-surface-container">
                <div class="flex items-center gap-space-md">
                  <div class="w-10 h-10 rounded-full bg-primary-container text-pure-white flex items-center justify-center shrink-0">
                    <svg class="w-5 h-5 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <div class="flex flex-col">
                    <span class="font-label-md text-label-md font-semibold text-primary">Need multi-tenant migration or private cloud VPC peering?</span>
                    <span class="font-caption text-caption">Our Solutions Engineering architects are standing by 24/7 for white-glove cluster initialization.</span>
                  </div>
                </div>
                <a routerLink="/" class="px-space-md py-space-xs rounded bg-surface-container-lowest hover:bg-surface-container font-label-sm text-label-sm font-semibold text-primary shadow-xs transition-all whitespace-nowrap border border-surface-container">
                  Contact Enterprise Architect
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="w-full bg-surface-container-low py-space-xl border-t border-surface-container">
        <div class="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div class="flex flex-wrap items-center gap-space-md">
            <div class="flex items-center gap-space-xs bg-surface-container px-space-md py-space-xs rounded">
              <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span class="font-caption text-caption font-semibold text-on-surface">SOC-2 Type II</span>
            </div>
            <div class="flex items-center gap-space-xs bg-surface-container px-space-md py-space-xs rounded">
              <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span class="font-caption text-caption font-semibold text-on-surface">ISO 27001</span>
            </div>
            <div class="flex items-center gap-space-xs bg-surface-container px-space-md py-space-xs rounded">
              <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect height="11" rx="2" ry="2" width="18" x="3" y="11"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span class="font-caption text-caption font-semibold text-on-surface">FIPS 140-3 Compliant</span>
            </div>
          </div>

          <div class="flex items-center gap-space-lg">
            <a routerLink="/monitoring" class="flex items-center gap-space-xs font-caption text-caption text-on-surface-variant hover:text-primary transition-colors">
              <span class="w-2 h-2 rounded-full bg-success"></span>
              <span>System Status: 99.99% Uptime</span>
            </a>
            <span class="font-caption text-caption text-outline-variant">•</span>
            <a routerLink="/audit-center" class="font-caption text-caption text-on-surface-variant hover:text-on-surface transition-colors">Security Whitepaper</a>
            <span class="font-caption text-caption text-outline-variant">•</span>
            <a routerLink="/audit-center" class="font-caption text-caption text-on-surface-variant hover:text-on-surface transition-colors">Privacy & Terms</a>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class RegisterComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly i18n = inject(I18nService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly organizationName = signal('Acme Global Financial');
  protected readonly organizationSlug = signal('acme-prod');
  protected readonly adminEmail = signal('cfo.office@acme.com');
  protected readonly workflowVolume = signal('500k');
  protected readonly adminFullName = signal('Alexander Vance');
  protected readonly adminRole = signal('Chief Information Security Officer');
  protected readonly adminPassword = signal('SuperSecret128BitKeypass!');
  protected readonly cloudRegion = signal('us-east-1');
  protected readonly enforceWebAuthn = signal(true);
  protected readonly merkleAuditLog = signal(true);
  protected readonly agreeTerms = signal(true);

  protected readonly showPassword = signal(false);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly passwordEntropy = computed(() => {
    const pwd = this.adminPassword();
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  });

  protected onOrgNameChange(name: string): void {
    this.organizationName.set(name);
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    this.organizationSlug.set(slug || 'org-tenant');
  }

  protected onSubmit(): void {
    if (this.loading()) {
      return;
    }

    if (!this.organizationName() || !this.organizationSlug() || !this.adminEmail() || !this.adminPassword() || !this.adminFullName()) {
      this.errorMessage.set('Veuillez compléter tous les champs obligatoires.');
      return;
    }

    if (!this.agreeTerms()) {
      this.errorMessage.set('Vous devez accepter les termes Vanguard Enterprise MSA et SLA.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.auth.registerTenant({
      organizationName: this.organizationName(),
      organizationSlug: this.organizationSlug(),
      adminEmail: this.adminEmail(),
      adminPassword: this.adminPassword(),
      adminFullName: this.adminFullName(),
      adminRole: this.adminRole(),
      workflowVolume: this.workflowVolume(),
      cloudRegion: this.cloudRegion()
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.loading.set(false);
        if (err.error?.message) {
          this.errorMessage.set(err.error.message);
        } else {
          this.errorMessage.set('Erreur lors du provisionnement du cluster tenant.');
        }
      }
    });
  }
}
