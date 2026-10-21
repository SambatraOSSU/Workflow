import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';
import { I18nService } from '../../core/services/i18n.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
      <!-- FIXED HEADER NAVIGATION -->
      <header class="fixed top-0 w-full z-50 bg-pure-white/90 dark:bg-[#090d16]/90 backdrop-blur-xl border-b border-surface-container dark:border-white/10 shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition-colors duration-200">
        <div class="h-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-space-lg">
          <div class="flex items-center gap-6 lg:gap-10">
            <!-- Brand Logo -->
            <a routerLink="/" class="flex items-center gap-2.5 text-primary group select-none">
              <div class="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-secondary-container shadow-xs group-hover:scale-105 transition-transform">
                <svg class="w-4.5 h-4.5 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <div class="flex items-baseline gap-2">
                <span class="text-lg tracking-tight text-primary font-bold">VANGUARD</span>
                <span class="hidden xl:inline-flex text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container-low dark:bg-white/10 text-on-surface-variant font-semibold">v4.2-LTS</span>
              </div>
            </a>

            <!-- Navigation Links -->
            <nav class="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
              <a routerLink="/" class="text-primary font-semibold hover:text-secondary transition-colors">Plateforme</a>
              <a routerLink="/workflows" class="text-on-surface-variant hover:text-primary transition-colors">Solutions</a>
              <a routerLink="/monitoring" class="text-on-surface-variant hover:text-primary transition-colors">Architecture</a>
              <a routerLink="/audit-center" class="text-on-surface-variant hover:text-primary transition-colors">Sécurité</a>
              <a routerLink="/workflows" class="text-on-surface-variant hover:text-primary transition-colors">Docs</a>
            </nav>
          </div>

          <!-- Actions & Controls -->
          <div class="flex items-center gap-2 sm:gap-2.5">
            <!-- Language Switcher (FR / EN) -->
            <div class="h-9 inline-flex items-center p-0.5 rounded-lg bg-surface-container-low dark:bg-white/5 border border-surface-container dark:border-white/10 shadow-xs">
              <button
                type="button"
                (click)="i18n.setLanguage('fr')"
                class="h-full px-2 sm:px-2.5 rounded-md text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
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
                class="h-full px-2 sm:px-2.5 rounded-md text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
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
              class="h-9 w-9 rounded-lg bg-surface-container-low dark:bg-white/5 hover:bg-surface-container text-on-surface inline-flex items-center justify-center transition-colors cursor-pointer border border-surface-container dark:border-white/10 shadow-xs"
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

            <!-- Desktop Connexion Link -->
            <a routerLink="/login" class="hidden sm:inline-flex h-9 items-center justify-center px-3.5 rounded-lg text-sm font-semibold text-primary hover:text-secondary hover:bg-surface-container-low dark:hover:bg-white/5 transition-colors">
              Connexion
            </a>

            <!-- Primary Register CTA Button -->
            <a routerLink="/register" class="h-9 inline-flex items-center justify-center px-3.5 sm:px-4 rounded-lg bg-secondary hover:bg-secondary-hover text-noir-text font-bold text-xs sm:text-sm shadow-xs hover:shadow-sm active:scale-[0.98] transition-all">
              Créer un compte
            </a>

            <!-- Mobile Hamburger Toggle Button -->
            <button
              type="button"
              (click)="toggleMobileMenu()"
              class="md:hidden h-9 w-9 rounded-lg bg-surface-container-low dark:bg-white/5 hover:bg-surface-container text-on-surface inline-flex items-center justify-center transition-colors border border-surface-container dark:border-white/10 cursor-pointer"
              [attr.aria-expanded]="mobileMenuOpen()"
              aria-label="Ouvrir le menu de navigation"
            >
              @if (mobileMenuOpen()) {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              } @else {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              }
            </button>
          </div>
        </div>

        <!-- MOBILE SLIDE-DOWN DRAWER -->
        @if (mobileMenuOpen()) {
          <div class="md:hidden fixed inset-x-0 top-16 bg-pure-white/98 dark:bg-[#090d16]/98 backdrop-blur-2xl border-b border-surface-container dark:border-white/10 shadow-2xl z-40 drawer-enter p-5 flex flex-col gap-4">
            <nav class="flex flex-col gap-1 text-sm font-semibold">
              <a (click)="closeMobileMenu()" routerLink="/" class="px-3 py-2.5 rounded-lg text-primary hover:bg-surface-container-low dark:hover:bg-white/5 transition-colors">Plateforme</a>
              <a (click)="closeMobileMenu()" routerLink="/workflows" class="px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low dark:hover:bg-white/5 transition-colors">Solutions Workflows</a>
              <a (click)="closeMobileMenu()" routerLink="/monitoring" class="px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low dark:hover:bg-white/5 transition-colors">Architecture &amp; Télémétrie</a>
              <a (click)="closeMobileMenu()" routerLink="/audit-center" class="px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low dark:hover:bg-white/5 transition-colors">Sécurité &amp; Conformité</a>
              <a (click)="closeMobileMenu()" routerLink="/workflows" class="px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low dark:hover:bg-white/5 transition-colors">Documentation</a>
            </nav>
            <div class="w-full h-px bg-surface-container dark:bg-white/10"></div>
            <div class="flex items-center justify-between gap-3 pt-1">
              <a (click)="closeMobileMenu()" routerLink="/login" class="flex-1 h-10 inline-flex items-center justify-center rounded-lg border border-surface-container dark:border-white/15 text-sm font-semibold text-primary hover:bg-surface-container-low dark:hover:bg-white/5 transition-colors">
                Connexion
              </a>
              <a (click)="closeMobileMenu()" routerLink="/register" class="flex-1 h-10 inline-flex items-center justify-center rounded-lg bg-secondary text-noir-text font-bold text-sm shadow-xs hover:bg-secondary-hover transition-colors">
                Créer un compte
              </a>
            </div>
          </div>
          <div (click)="closeMobileMenu()" class="md:hidden fixed inset-0 top-16 bg-black/40 backdrop-blur-xs z-30" aria-hidden="true"></div>
        }
      </header>

      <!-- MAIN CONTENT -->
      <main class="w-full pt-16 bg-surface flex-1">
        <div class="flex flex-col w-full">
          <!-- HERO SECTION -->
          <section class="relative w-full overflow-hidden bg-surface py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <!-- Ambient Canvas Glow behind Hero -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-gradient-to-b from-primary-container/10 via-secondary-container/5 to-transparent blur-3xl pointer-events-none -z-10"></div>
            
            <div class="max-w-5xl w-full flex flex-col items-center text-center">
              <!-- Architectural Pre-header Pill Badge -->
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-low dark:bg-white/[0.06] border border-surface-container dark:border-white/10 shadow-xs mb-space-md select-none">
                <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span class="text-xs font-semibold text-primary dark:text-slate-200 tracking-wide">Moteur d'Orchestration Distribué · Architecture Zero-Trust</span>
                <span class="hidden sm:inline-block text-[11px] font-mono text-secondary font-bold">v4.2-PROD</span>
              </div>

              <!-- Main Heading -->
              <h1 class="font-display text-3xl sm:text-4xl lg:text-[48px] lg:leading-[56px] text-primary tracking-tight max-w-4xl font-bold mb-space-md">
                Automatisez vos processus critiques avec une <span class="text-secondary underline decoration-secondary/30 underline-offset-8">gouvernance absolue</span>.
              </h1>

              <!-- Subheadline -->
              <p class="font-body-lg text-base sm:text-lg text-on-surface-variant dark:text-slate-300 max-w-2xl leading-relaxed mb-8 sm:mb-10 font-normal">
                Concevez, simulez et déployez des workflows complexes alliant décisions humaines (HITL), exécutions distribuées C#/.NET Core et conformité SOX-404 / SOC-2 Type II.
              </p>

              <!-- Action CTAs -->
              <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md mb-10 sm:mb-12">
                <a routerLink="/register" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl bg-secondary text-noir-text font-bold text-sm sm:text-base shadow-md hover:bg-secondary-hover active:scale-[0.98] transition-all">
                  <span>Créer un compte</span>
                  <svg class="w-4 h-4 text-noir-text" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                    <line x1="5" x2="19" y1="12" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
                <a routerLink="/login" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl bg-pure-white dark:bg-[#111827] text-primary border border-surface-container dark:border-white/15 font-semibold text-sm sm:text-base shadow-xs hover:bg-surface-container-low dark:hover:bg-white/5 active:scale-[0.98] transition-all">
                  <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  <span>Se connecter</span>
                </a>
              </div>

              <!-- Trust Badges Line -->
              <div class="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2.5 text-on-surface-variant font-caption text-xs sm:text-sm">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-info shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <rect height="8" rx="2" ry="2" width="20" x="2" y="2"></rect>
                    <rect height="8" rx="2" ry="2" width="20" x="2" y="14"></rect>
                    <line x1="6" x2="6.01" y1="6" y2="6"></line>
                    <line x1="6" x2="6.01" y1="18" y2="18"></line>
                  </svg>
                  <span class="font-medium">Déploiement Private Cloud / VPC</span>
                </div>
                <span class="w-1 h-1 rounded-full bg-outline-variant hidden sm:inline-block"></span>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-success shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  <span class="font-medium">FIPS 140-3 Cryptographie certifiée</span>
                </div>
                <span class="w-1 h-1 rounded-full bg-outline-variant hidden sm:inline-block"></span>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-secondary shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span class="font-medium">SLA 99.999% Haute Disponibilité</span>
                </div>
              </div>
            </div>

            <!-- INTERACTIVE WORKFLOW DAG HERO CANVAS -->
            <div class="w-full max-w-6xl mt-12 sm:mt-16 relative">
              <!-- Glow Underlay -->
              <div class="absolute -inset-1 bg-gradient-to-r from-primary-container via-secondary/20 to-primary-container rounded-3xl blur-xl opacity-30"></div>
              
              <!-- Main Shell Canvas Window -->
              <div class="relative w-full rounded-2xl bg-primary-container text-on-primary shadow-2xl overflow-hidden p-4 sm:p-6 lg:p-8 border border-white/10">
                <!-- Canvas Header Bar -->
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 sm:pb-5 gap-3 border-b border-white/10">
                  <div class="flex items-center gap-3">
                    <div class="flex items-center gap-1.5">
                      <span class="w-3 h-3 rounded-full bg-error/90 inline-block shadow-xs"></span>
                      <span class="w-3 h-3 rounded-full bg-warning/90 inline-block shadow-xs"></span>
                      <span class="w-3 h-3 rounded-full bg-success/90 inline-block shadow-xs"></span>
                    </div>
                    <div class="h-4 w-px bg-white/20 mx-1"></div>
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-secondary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                        <polyline points="2 17 12 22 22 17"></polyline>
                        <polyline points="2 12 12 17 22 12"></polyline>
                      </svg>
                      <span class="font-mono text-xs sm:text-sm font-semibold tracking-wide text-pure-white truncate max-w-[220px] sm:max-w-none">SOX_Treasury_Settlement_Pipeline.dag</span>
                    </div>
                    <span class="px-2 py-0.5 rounded-full bg-success/20 text-success font-mono text-[11px] font-bold border border-success/30">
                      LIVE RUNNING
                    </span>
                  </div>

                  <!-- Canvas Controls -->
                  <div class="flex items-center gap-2.5 self-end sm:self-auto">
                    <div class="flex items-center bg-primary/80 border border-white/10 rounded-lg p-0.5 text-on-primary-container">
                      <button type="button" (click)="setZoom(zoomLevel() + 0.1)" class="p-1 hover:text-pure-white rounded transition-colors cursor-pointer" title="Zoom In">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line><line x1="11" x2="11" y1="8" y2="14"></line><line x1="8" x2="14" y1="11" y2="11"></line></svg>
                      </button>
                      <button type="button" (click)="setZoom(zoomLevel() - 0.1)" class="p-1 hover:text-pure-white rounded transition-colors cursor-pointer" title="Zoom Out">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line><line x1="8" x2="14" y1="11" y2="11"></line></svg>
                      </button>
                      <button type="button" (click)="setZoom(1.0)" class="p-1 hover:text-pure-white rounded transition-colors cursor-pointer" title="Ajuster">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" x2="14" y1="3" y2="10"></line><line x1="3" x2="10" y1="21" y2="14"></line></svg>
                      </button>
                    </div>
                    <button
                      type="button"
                      (click)="triggerSimulation()"
                      [disabled]="isSimulating()"
                      class="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-secondary text-noir-text font-bold text-xs sm:text-sm shadow-sm hover:bg-secondary-hover active:scale-95 transition-all cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed"
                    >
                      @if (isSimulating()) {
                        <svg class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span>Étape {{ currentSimStep() }}/4…</span>
                      } @else {
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        <span>Exécuter Simulation</span>
                      }
                    </button>
                  </div>
                </div>

                <!-- Canvas Visual Graph Area -->
                <div class="relative w-full rounded-xl bg-[#070e1c] p-4 sm:p-6 lg:p-8 min-h-[460px] flex flex-col justify-between overflow-hidden mt-4 border border-white/5">
                  <!-- Background Grid Matrix Decoration -->
                  <svg class="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="dag-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="#FFFFFF"></circle>
                      </pattern>
                    </defs>
                    <rect fill="url(#dag-grid)" height="100%" width="100%"></rect>
                  </svg>

                  <!-- Live Simulation Status Banner -->
                  @if (isSimulating()) {
                    <div class="relative z-20 mb-4 px-4 py-2.5 rounded-xl bg-primary-container/95 border border-secondary/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-pure-white shadow-lg animate-pulse">
                      <div class="flex items-center gap-2.5">
                        <span class="w-2.5 h-2.5 rounded-full bg-secondary animate-ping"></span>
                        <span class="font-mono text-secondary font-bold text-xs uppercase tracking-wider">PIPELINE SOX ACTIF :</span>
                        <span class="font-medium text-xs sm:text-sm">
                          @switch (currentSimStep()) {
                            @case (1) { Étape 1/4 : Ingestion Kafka topic treasury.tx — Débit 14.8k/s }
                            @case (2) { Étape 2/4 : Évaluation Roslyn C# — CapEx > $100k SOX validé (<0.4ms) }
                            @case (3) { Étape 3/4 : Sign-off HITL WebAuthn — Approbation VP Fin &amp; CISO validée }
                            @case (4) { Étape 4/4 : Synchronisation SAP S/4HANA &amp; Clôture Nitro KMS }
                          }
                        </span>
                      </div>
                      <span class="font-mono text-xs text-secondary font-bold px-2 py-0.5 rounded bg-black/40">Latence: {{ simLatency() }}</span>
                    </div>
                  } @else if (simSuccess()) {
                    <div class="relative z-20 mb-4 px-4 py-2.5 rounded-xl bg-success/15 border border-success/40 flex items-center justify-between text-pure-white text-xs sm:text-sm shadow-md">
                      <div class="flex items-center gap-2 text-success">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span class="font-semibold text-pure-white">Simulation terminée avec succès — Pipeline SOX certifié (Hash #3A89 immuable).</span>
                      </div>
                      <button type="button" (click)="simSuccess.set(false)" class="text-xs text-slate-300 hover:text-pure-white transition-colors cursor-pointer">Fermer</button>
                    </div>
                  }

                  <!-- Graph Nodes Layout Container with Adaptive Zoom -->
                  <div
                    class="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8 items-center py-6 sm:py-8"
                    [style.transform]="'scale(' + zoomLevel() + ')'"
                    style="transform-origin: center center; transition: transform 0.2s ease;"
                  >
                    <!-- Node 1: Ingest Webhook / Kafka -->
                    <div
                      class="relative flex flex-col rounded-xl bg-pure-white text-on-surface p-4 shadow-md transition-all duration-300 border border-slate-100"
                      [class.ring-4]="currentSimStep() === 1"
                      [class.ring-info]="currentSimStep() === 1"
                      [class.scale-105]="currentSimStep() === 1"
                      [class.shadow-xl]="currentSimStep() === 1"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                          <div class="w-6 h-6 rounded-md bg-info/10 text-info flex items-center justify-center">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                          </div>
                          <span class="font-caption text-[11px] font-bold text-primary uppercase tracking-wide">01 // INGEST</span>
                        </div>
                        <span class="w-2 h-2 rounded-full bg-info" [class.animate-ping]="currentSimStep() === 1"></span>
                      </div>
                      <p class="font-label-sm text-sm font-bold text-primary">Webhook &amp; Kafka Event</p>
                      <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-on-surface-variant font-caption text-[11px]">
                        <span class="font-mono">topic: treasury.tx</span>
                        <span class="text-info font-mono font-bold">{{ currentSimStep() === 1 ? '14.8k/s (BURST)' : '9.2k/s' }}</span>
                      </div>

                      <!-- Horizontal Bridge Cable Right (Desktop) -->
                      <div class="hidden md:flex absolute -right-6 lg:-right-8 top-1/2 -translate-y-1/2 w-6 lg:w-8 items-center justify-center pointer-events-none z-0">
                        <svg class="w-full h-4 overflow-visible" viewBox="0 0 32 16" fill="none">
                          <path d="M 0 8 L 32 8" [class]="currentSimStep() >= 1 ? 'stroke-info' : 'stroke-white/20'" stroke-width="2" stroke-linecap="round"/>
                          @if (isSimulating() && currentSimStep() >= 1) {
                            <path d="M 0 8 L 32 8" stroke="#38bdf8" stroke-width="3" class="animate-cable-pulse" stroke-linecap="round"/>
                          }
                          <circle cx="16" cy="8" r="2.5" [class]="currentSimStep() >= 1 ? 'fill-info' : 'fill-white/30'"/>
                        </svg>
                      </div>
                    </div>

                    <!-- Vertical Bridge Cable Mobile (Node 1 -> Node 2) -->
                    <div class="flex md:hidden justify-center my-0.5">
                      <svg class="w-4 h-6" viewBox="0 0 16 24" fill="none">
                        <path d="M 8 0 L 8 24" stroke="currentColor" class="text-white/20" stroke-width="2" stroke-dasharray="2 2"/>
                        <circle cx="8" cy="12" r="2" fill="#3B82F6"/>
                      </svg>
                    </div>

                    <!-- Node 2: Business Rule Evaluator -->
                    <div
                      class="relative flex flex-col rounded-xl bg-pure-white text-on-surface p-4 shadow-md transition-all duration-300 border border-slate-100"
                      [class.ring-4]="currentSimStep() === 2"
                      [class.ring-secondary]="currentSimStep() === 2"
                      [class.scale-105]="currentSimStep() === 2"
                      [class.shadow-xl]="currentSimStep() === 2"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                          <div class="w-6 h-6 rounded-md bg-primary-container text-pure-white flex items-center justify-center">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line></svg>
                          </div>
                          <span class="font-caption text-[11px] font-bold text-primary uppercase tracking-wide">02 // RÈGLES C#</span>
                        </div>
                        <span class="px-1.5 py-0.5 rounded bg-surface-container font-mono text-[10px] text-on-surface-variant font-bold">Roslyn JIT</span>
                      </div>
                      <p class="font-label-sm text-sm font-bold text-primary">CapEx > $100,000 SOX</p>
                      <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-on-surface-variant font-caption text-[11px]">
                        <span class="font-mono">Audit: #3A89</span>
                        <span class="text-success font-mono font-bold" [class.animate-pulse]="currentSimStep() === 2">{{ currentSimStep() === 2 ? 'PASS (<0.4ms)' : 'PASS (<1ms)' }}</span>
                      </div>

                      <!-- Horizontal Bridge Cable Right (Desktop) -->
                      <div class="hidden md:flex absolute -right-6 lg:-right-8 top-1/2 -translate-y-1/2 w-6 lg:w-8 items-center justify-center pointer-events-none z-0">
                        <svg class="w-full h-4 overflow-visible" viewBox="0 0 32 16" fill="none">
                          <path d="M 0 8 L 32 8" [class]="currentSimStep() >= 2 ? 'stroke-secondary' : 'stroke-white/20'" stroke-width="2" stroke-linecap="round"/>
                          @if (isSimulating() && currentSimStep() >= 2) {
                            <path d="M 0 8 L 32 8" stroke="#FCA311" stroke-width="3" class="animate-cable-pulse" stroke-linecap="round"/>
                          }
                          <circle cx="16" cy="8" r="2.5" [class]="currentSimStep() >= 2 ? 'fill-secondary' : 'fill-white/30'"/>
                        </svg>
                      </div>
                    </div>

                    <!-- Vertical Bridge Cable Mobile (Node 2 -> Node 3) -->
                    <div class="flex md:hidden justify-center my-0.5">
                      <svg class="w-4 h-6" viewBox="0 0 16 24" fill="none">
                        <path d="M 8 0 L 8 24" stroke="currentColor" class="text-white/20" stroke-width="2" stroke-dasharray="2 2"/>
                        <circle cx="8" cy="12" r="2" fill="#FCA311"/>
                      </svg>
                    </div>

                    <!-- Node 3: Approval Gate (Orange Accent) -->
                    <div
                      class="relative flex flex-col rounded-xl bg-secondary text-noir-text p-4 shadow-lg transition-all duration-300 ring-2 ring-secondary/50"
                      [class.ring-4]="currentSimStep() === 3"
                      [class.ring-pure-white]="currentSimStep() === 3"
                      [class.scale-105]="currentSimStep() === 3"
                      [class.shadow-2xl]="currentSimStep() === 3"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                          <div class="w-6 h-6 rounded-md bg-noir-text text-secondary flex items-center justify-center">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><rect height="11" rx="2" ry="2" width="18" x="3" y="11"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                          </div>
                          <span class="font-caption text-[11px] font-bold text-noir-text uppercase tracking-wide">03 // GATE HITL</span>
                        </div>
                        <span class="w-2 h-2 rounded-full bg-noir-text" [class.animate-ping]="currentSimStep() === 3"></span>
                      </div>
                      <p class="font-label-sm text-sm font-extrabold text-noir-text">Dual Sign-Off HITL</p>
                      <div class="mt-3 pt-2 border-t border-black/10 flex items-center justify-between text-noir-text/90 font-caption text-[11px]">
                        <span>VP Fin &amp; CISO</span>
                        <span class="font-bold underline" [class.animate-pulse]="currentSimStep() === 3">{{ currentSimStep() >= 3 ? 'Validé WebAuthn ✓' : 'FIDO2 Prêt' }}</span>
                      </div>

                      <!-- Horizontal Bridge Cable Right (Desktop) -->
                      <div class="hidden md:flex absolute -right-6 lg:-right-8 top-1/2 -translate-y-1/2 w-6 lg:w-8 items-center justify-center pointer-events-none z-0">
                        <svg class="w-full h-4 overflow-visible" viewBox="0 0 32 16" fill="none">
                          <path d="M 0 8 L 32 8" [class]="currentSimStep() >= 3 ? 'stroke-success' : 'stroke-white/20'" stroke-width="2" stroke-linecap="round"/>
                          @if (isSimulating() && currentSimStep() >= 3) {
                            <path d="M 0 8 L 32 8" stroke="#10B981" stroke-width="3" class="animate-cable-pulse" stroke-linecap="round"/>
                          }
                          <circle cx="16" cy="8" r="2.5" [class]="currentSimStep() >= 3 ? 'fill-success' : 'fill-white/30'"/>
                        </svg>
                      </div>
                    </div>

                    <!-- Vertical Bridge Cable Mobile (Node 3 -> Node 4) -->
                    <div class="flex md:hidden justify-center my-0.5">
                      <svg class="w-4 h-6" viewBox="0 0 16 24" fill="none">
                        <path d="M 8 0 L 8 24" stroke="currentColor" class="text-white/20" stroke-width="2" stroke-dasharray="2 2"/>
                        <circle cx="8" cy="12" r="2" fill="#10B981"/>
                      </svg>
                    </div>

                    <!-- Node 4: Automated Settlement / Ledger Action -->
                    <div
                      class="relative flex flex-col rounded-xl bg-pure-white text-on-surface p-4 shadow-md transition-all duration-300 border border-slate-100"
                      [class.ring-4]="currentSimStep() === 4"
                      [class.ring-success]="currentSimStep() === 4"
                      [class.scale-105]="currentSimStep() === 4"
                      [class.shadow-xl]="currentSimStep() === 4"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                          <div class="w-6 h-6 rounded-md bg-success/15 text-success flex items-center justify-center">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                          <span class="font-caption text-[11px] font-bold text-success uppercase tracking-wide">04 // EXÉCUTION</span>
                        </div>
                        <span class="px-1.5 py-0.5 rounded bg-success/15 font-mono text-[10px] text-success font-bold" [class.animate-pulse]="currentSimStep() === 4">200 OK</span>
                      </div>
                      <p class="font-label-sm text-sm font-bold text-primary">SAP S/4HANA &amp; KMS</p>
                      <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-on-surface-variant font-caption text-[11px]">
                        <span>AWS Nitro Enclave</span>
                        <span class="text-success font-mono font-bold">{{ currentSimStep() === 4 ? 'SYNC ENCLAVE' : '12ms Sync' }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Bottom Telemetry HUD Bar inside Canvas -->
                  <div class="relative z-10 w-full mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                    <div class="flex items-center gap-6 flex-wrap">
                      <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-success" [class.animate-ping]="isSimulating()"></span>
                        <span class="text-slate-400">Débit :</span>
                        <span class="font-bold text-pure-white">{{ simThroughput() }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-slate-400">Latence P99 :</span>
                        <span class="font-bold text-pure-white">{{ simLatency() }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-slate-400">Clusters Actifs :</span>
                        <span class="font-bold text-success">24/24 Healthy</span>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="text-slate-400">Stack :</span>
                      <div class="flex items-center gap-1.5">
                        <span class="px-2 py-0.5 rounded bg-white/10 text-[11px] text-slate-200">C# .NET 9</span>
                        <span class="px-2 py-0.5 rounded bg-white/10 text-[11px] text-slate-200">Angular 18</span>
                        <span class="px-2 py-0.5 rounded bg-white/10 text-[11px] text-slate-200">Kafka</span>
                        <span class="px-2 py-0.5 rounded bg-white/10 text-[11px] text-slate-200">PostgreSQL</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- SOCIAL PROOF / ENTERPRISE ADOPTION TICKER (ANIMATION VERS LA GAUCHE) -->
          <section class="w-full bg-pure-white dark:bg-[#111827] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 border-y border-surface-container dark:border-white/5 overflow-hidden transition-colors duration-200">
            <div class="max-w-6xl mx-auto flex flex-col items-center">
              <p class="font-label-sm text-xs sm:text-sm uppercase tracking-wider text-on-surface-variant font-semibold text-center mb-6 sm:mb-8">
                Propulsé au cœur des infrastructures financières et industrielles les plus exigeantes
              </p>
              
              <!-- Infinite scrolling ticker to the left -->
              <div class="ticker-wrapper w-full">
                <div class="ticker-track flex items-center py-2">
                  <!-- First Logo Set -->
                  <div class="flex items-center gap-12 sm:gap-16 pr-12 sm:pr-16 shrink-0 opacity-85">
                    <!-- Logo 1: APEX·BANK -->
                    <div class="flex items-center gap-2 text-primary dark:text-[#f3f4f6] font-bold tracking-tight shrink-0 hover:scale-105 transition-transform select-none">
                      <svg class="w-6 h-6 text-primary-container dark:text-secondary" fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      <span class="text-base sm:text-lg">APEX·BANK</span>
                    </div>
                    <!-- Logo 2: AERODYN -->
                    <div class="flex items-center gap-2 text-primary dark:text-[#f3f4f6] font-bold tracking-tight shrink-0 hover:scale-105 transition-transform select-none">
                      <svg class="w-6 h-6 text-secondary" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93 4.24 4.24"></path><path d="m14.83 9.17 4.24-4.24"></path><path d="m14.83 14.83 4.24 4.24"></path><path d="m9.17 14.83-4.24 4.24"></path></svg>
                      <span class="text-base sm:text-lg">AERODYN</span>
                    </div>
                    <!-- Logo 3: HEALTHTRUST -->
                    <div class="flex items-center gap-2 text-primary dark:text-[#f3f4f6] font-bold tracking-tight shrink-0 hover:scale-105 transition-transform select-none">
                      <svg class="w-6 h-6 text-info" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                      <span class="text-base sm:text-lg">HEALTHTRUST</span>
                    </div>
                    <!-- Logo 4: NORDIC LOG -->
                    <div class="flex items-center gap-2 text-primary dark:text-[#f3f4f6] font-bold tracking-tight shrink-0 hover:scale-105 transition-transform select-none">
                      <svg class="w-6 h-6 text-primary dark:text-primary-fixed" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><rect height="13" width="15" x="1" y="3"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                      <span class="text-base sm:text-lg">NORDIC LOG</span>
                    </div>
                    <!-- Logo 5: FINVANTAGE -->
                    <div class="flex items-center gap-2 text-primary dark:text-[#f3f4f6] font-bold tracking-tight shrink-0 hover:scale-105 transition-transform select-none">
                      <svg class="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                      <span class="text-base sm:text-lg">FINVANTAGE</span>
                    </div>
                  </div>

                  <!-- Second Logo Set (Duplicate for seamless continuous looping) -->
                  <div class="flex items-center gap-12 sm:gap-16 pr-12 sm:pr-16 shrink-0 opacity-85" aria-hidden="true">
                    <!-- Logo 1: APEX·BANK -->
                    <div class="flex items-center gap-2 text-primary dark:text-[#f3f4f6] font-bold tracking-tight shrink-0 hover:scale-105 transition-transform select-none">
                      <svg class="w-6 h-6 text-primary-container dark:text-secondary" fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      <span class="text-base sm:text-lg">APEX·BANK</span>
                    </div>
                    <!-- Logo 2: AERODYN -->
                    <div class="flex items-center gap-2 text-primary dark:text-[#f3f4f6] font-bold tracking-tight shrink-0 hover:scale-105 transition-transform select-none">
                      <svg class="w-6 h-6 text-secondary" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93 4.24 4.24"></path><path d="m14.83 9.17 4.24-4.24"></path><path d="m14.83 14.83 4.24 4.24"></path><path d="m9.17 14.83-4.24 4.24"></path></svg>
                      <span class="text-base sm:text-lg">AERODYN</span>
                    </div>
                    <!-- Logo 3: HEALTHTRUST -->
                    <div class="flex items-center gap-2 text-primary dark:text-[#f3f4f6] font-bold tracking-tight shrink-0 hover:scale-105 transition-transform select-none">
                      <svg class="w-6 h-6 text-info" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                      <span class="text-base sm:text-lg">HEALTHTRUST</span>
                    </div>
                    <!-- Logo 4: NORDIC LOG -->
                    <div class="flex items-center gap-2 text-primary dark:text-[#f3f4f6] font-bold tracking-tight shrink-0 hover:scale-105 transition-transform select-none">
                      <svg class="w-6 h-6 text-primary dark:text-primary-fixed" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><rect height="13" width="15" x="1" y="3"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                      <span class="text-base sm:text-lg">NORDIC LOG</span>
                    </div>
                    <!-- Logo 5: FINVANTAGE -->
                    <div class="flex items-center gap-2 text-primary dark:text-[#f3f4f6] font-bold tracking-tight shrink-0 hover:scale-105 transition-transform select-none">
                      <svg class="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                      <span class="text-base sm:text-lg">FINVANTAGE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- CORE VALUE PILLARS (Bento Grid of Features) -->
          <section class="w-full bg-surface py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
            <div class="max-w-6xl mx-auto flex flex-col gap-10 sm:gap-12">
              <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span class="font-caption text-xs uppercase tracking-wider text-secondary font-bold">Architecture Prête pour l'Entreprise</span>
                  <h2 class="text-2xl sm:text-3xl lg:text-[32px] text-primary font-bold tracking-tight mt-1">
                    L'orchestration d'entreprise réinventée sans compromis
                  </h2>
                </div>
                <p class="font-body-lg text-base sm:text-lg text-on-surface-variant dark:text-slate-300 leading-relaxed max-w-lg font-normal">
                  Un moteur déterministe et résistant aux pannes, conçu pour éliminer les ruptures d'intégrité et les goulots d'étranglement manuels.
                </p>
              </div>

              <!-- Pillar Cards -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <!-- Pillar Card 1: Visual Modeler -->
                <div class="flex flex-col rounded-2xl bg-pure-white dark:bg-[#111827] p-6 sm:p-8 shadow-sm hover:shadow-md border border-surface-container/80 dark:border-white/10 hover:border-secondary/40 transition-all duration-200 group">
                  <div class="w-12 h-12 rounded-xl bg-primary-container text-secondary-container flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                      <polyline points="2 17 12 22 22 17"></polyline>
                      <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                  </div>
                  <span class="font-mono text-xs text-on-surface-variant font-bold tracking-wider">01 // VISUAL CANVAS</span>
                  <h3 class="text-lg sm:text-xl text-primary font-bold mt-1.5 mb-2.5">
                    Concepteur Visuel de DAG Sans Compromis
                  </h3>
                  <p class="text-sm text-on-surface-variant dark:text-slate-300 leading-relaxed mb-6 flex-1">
                    Modélisez vos pipelines via une interface réactive en drag-and-drop. Support intégré du moteur d'évaluation de règles C#, sous-graphes réutilisables et gestion des versions type Git avec retour en arrière instantané.
                  </p>
                  <div class="p-2.5 rounded-lg bg-surface-container-low dark:bg-white/5 border border-surface-container dark:border-white/10 mb-5 font-mono text-[11px] text-primary truncate">
                    <span class="text-secondary font-bold">dsl:</span> workflow.execute(treasuryPipeline)
                  </div>
                  <a routerLink="/workflows" class="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:text-secondary transition-colors group-hover:translate-x-0.5 duration-150">
                    <span>Découvrir le moteur de graphes</span>
                    <svg class="w-4 h-4 text-secondary" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="5" x2="19" y1="12" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </a>
                </div>

                <!-- Pillar Card 2: Governance & HITL -->
                <div class="flex flex-col rounded-2xl bg-pure-white dark:bg-[#111827] p-6 sm:p-8 shadow-sm hover:shadow-md border border-surface-container/80 dark:border-white/10 hover:border-secondary/40 transition-all duration-200 group">
                  <div class="w-12 h-12 rounded-xl bg-secondary text-noir-text flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <span class="font-mono text-xs text-on-surface-variant font-bold tracking-wider">02 // GOVERNANCE &amp; HITL</span>
                  <h3 class="text-lg sm:text-xl text-primary font-bold mt-1.5 mb-2.5">
                    Human-In-The-Loop &amp; Séparation des Tâches
                  </h3>
                  <p class="text-sm text-on-surface-variant dark:text-slate-300 leading-relaxed mb-6 flex-1">
                    Garantissez le principe des 4 yeux (Four-Eyes Principle). Validation sécurisée via clés FIDO2/WebAuthn, matrice RBAC fine, réassignation dynamique et escalades automatisées en cas de dépassement de SLA.
                  </p>
                  <div class="p-2.5 rounded-lg bg-surface-container-low dark:bg-white/5 border border-surface-container dark:border-white/10 mb-5 font-mono text-[11px] text-primary truncate">
                    <span class="text-secondary font-bold">policy:</span> FourEyesSignOff.Require(CISO)
                  </div>
                  <a routerLink="/tasks" class="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:text-secondary transition-colors group-hover:translate-x-0.5 duration-150">
                    <span>Explorer les règles de validation</span>
                    <svg class="w-4 h-4 text-secondary" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="5" x2="19" y1="12" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </a>
                </div>

                <!-- Pillar Card 3: Immutable Audit -->
                <div class="flex flex-col rounded-2xl bg-pure-white dark:bg-[#111827] p-6 sm:p-8 shadow-sm hover:shadow-md border border-surface-container/80 dark:border-white/10 hover:border-secondary/40 transition-all duration-200 group">
                  <div class="w-12 h-12 rounded-xl bg-primary-container text-pure-white flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      <polyline points="9 11 12 14 22 4"></polyline>
                    </svg>
                  </div>
                  <span class="font-mono text-xs text-on-surface-variant font-bold tracking-wider">03 // IMMUTABLE AUDIT</span>
                  <h3 class="text-lg sm:text-xl text-primary font-bold mt-1.5 mb-2.5">
                    Audit Immuable &amp; Conformité Réglementaire
                  </h3>
                  <p class="text-sm text-on-surface-variant dark:text-slate-300 leading-relaxed mb-6 flex-1">
                    Chaque transition d'état est ancrée dans un arbre de Merkle cryptographique. Journaux WORM infalsifiables, traçabilité forensique intégrale et génération automatisée des rapports d'audit SOX-404 et ISO 27001.
                  </p>
                  <div class="p-2.5 rounded-lg bg-surface-container-low dark:bg-white/5 border border-surface-container dark:border-white/10 mb-5 font-mono text-[11px] text-primary truncate">
                    <span class="text-success font-bold">merkle:</span> sha256:7f3a9b... [VERIFIED]
                  </div>
                  <a routerLink="/audit-center" class="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:text-secondary transition-colors group-hover:translate-x-0.5 duration-150">
                    <span>Consulter les spécifications d'audit</span>
                    <svg class="w-4 h-4 text-secondary" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="5" x2="19" y1="12" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </a>
                </div>
              </div>
            </div>
          </section>

          <!-- TECHNICAL BENCHMARKS & ARCHITECTURE MATRIX -->
          <section class="w-full bg-pure-white dark:bg-[#111827] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-y border-surface-container dark:border-white/5 transition-colors duration-200">
            <div class="max-w-6xl mx-auto flex flex-col gap-10 sm:gap-12">
              <!-- Section Intro Header -->
              <div class="text-center max-w-2xl mx-auto">
                <span class="font-caption text-xs uppercase tracking-wider text-secondary font-bold">Haute Performance &amp; Résilience</span>
                <h2 class="text-2xl sm:text-3xl lg:text-[32px] text-primary font-bold tracking-tight mt-1">
                  Métriques d'exécution vérifiées à l'échelle industrielle
                </h2>
              </div>

              <!-- Key Metrics Row -->
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div class="flex flex-col p-5 sm:p-6 rounded-2xl bg-surface-container-low dark:bg-white/5 border border-surface-container dark:border-white/10">
                  <span class="font-display text-2xl sm:text-3xl lg:text-4xl text-primary font-bold tracking-tight">99.999%</span>
                  <span class="text-xs sm:text-sm text-primary font-semibold mt-1">Disponibilité SLA</span>
                  <p class="font-caption text-xs text-on-surface-variant dark:text-slate-400 mt-2 leading-relaxed">Réplication active multi-régions avec consensus Raft et bascule automatique.</p>
                </div>
                <div class="flex flex-col p-5 sm:p-6 rounded-2xl bg-surface-container-low dark:bg-white/5 border border-surface-container dark:border-white/10">
                  <span class="font-display text-2xl sm:text-3xl lg:text-4xl text-secondary font-bold tracking-tight">&lt; 4.2ms</span>
                  <span class="text-xs sm:text-sm text-primary font-semibold mt-1">Latence P99 du Moteur</span>
                  <p class="font-caption text-xs text-on-surface-variant dark:text-slate-400 mt-2 leading-relaxed">Compilation native JIT des arbres d'expression C# et SKIP LOCKED PostgreSQL.</p>
                </div>
                <div class="flex flex-col p-5 sm:p-6 rounded-2xl bg-surface-container-low dark:bg-white/5 border border-surface-container dark:border-white/10">
                  <span class="font-display text-2xl sm:text-3xl lg:text-4xl text-primary font-bold tracking-tight">50M+</span>
                  <span class="text-xs sm:text-sm text-primary font-semibold mt-1">Transactions / Jour</span>
                  <p class="font-caption text-xs text-on-surface-variant dark:text-slate-400 mt-2 leading-relaxed">Capacité éprouvée sur des parcs transactionnels bancaires et d'assurance.</p>
                </div>
                <div class="flex flex-col p-5 sm:p-6 rounded-2xl bg-surface-container-low dark:bg-white/5 border border-surface-container dark:border-white/10">
                  <span class="font-display text-2xl sm:text-3xl lg:text-4xl text-primary font-bold tracking-tight">Zero-Trust</span>
                  <span class="text-xs sm:text-sm text-primary font-semibold mt-1">Isolation Matérielle</span>
                  <p class="font-caption text-xs text-on-surface-variant dark:text-slate-400 mt-2 leading-relaxed">Chiffrement AES-256 GCM exécuté dans des enclaves sécurisées AWS Nitro.</p>
                </div>
              </div>

              <!-- Architectural Deep Dive Banner -->
              <div class="w-full rounded-2xl bg-surface dark:bg-[#070e1c] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 border border-surface-container dark:border-white/10">
                <div class="flex flex-col gap-2 max-w-xl">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-primary-container text-pure-white font-mono text-[10px] font-bold">STANDARDS OPEN-CORE</span>
                    <span class="font-caption text-xs text-on-surface-variant dark:text-slate-400">Compatible Cloud-Native CNCF</span>
                  </div>
                  <h3 class="text-lg sm:text-xl text-primary font-bold">
                    Intégration native sans refonte d'infrastructure
                  </h3>
                  <p class="text-sm text-on-surface-variant dark:text-slate-300 leading-relaxed">
                    Déployez Vanguard directement dans votre cluster Kubernetes (EKS, AKS, OpenShift) via des charts Helm certifiés, ou optez pour notre offre SaaS dédiée avec infogérance complète.
                  </p>
                </div>

                <!-- Tech Badges Group -->
                <div class="flex flex-wrap items-center gap-2 md:justify-end">
                  <span class="px-3 py-1.5 rounded-lg bg-pure-white dark:bg-white/10 shadow-xs text-xs font-semibold text-primary border border-surface-container dark:border-white/10">C# / ASP.NET 9</span>
                  <span class="px-3 py-1.5 rounded-lg bg-pure-white dark:bg-white/10 shadow-xs text-xs font-semibold text-primary border border-surface-container dark:border-white/10">Angular 18 Enterprise</span>
                  <span class="px-3 py-1.5 rounded-lg bg-pure-white dark:bg-white/10 shadow-xs text-xs font-semibold text-primary border border-surface-container dark:border-white/10">Apache Kafka</span>
                  <span class="px-3 py-1.5 rounded-lg bg-pure-white dark:bg-white/10 shadow-xs text-xs font-semibold text-primary border border-surface-container dark:border-white/10">Kubernetes Helm</span>
                  <span class="px-3 py-1.5 rounded-lg bg-pure-white dark:bg-white/10 shadow-xs text-xs font-semibold text-primary border border-surface-container dark:border-white/10">Redis Enterprise</span>
                  <span class="px-3 py-1.5 rounded-lg bg-pure-white dark:bg-white/10 shadow-xs text-xs font-semibold text-primary border border-surface-container dark:border-white/10">PostgreSQL Partitioned</span>
                </div>
              </div>
            </div>
          </section>

          <!-- INTERACTIVE WORKFLOW OPERATIONAL LIFECYCLE (DYNAMIC TABS) -->
          <section class="w-full bg-surface py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
            <div class="max-w-6xl mx-auto flex flex-col gap-10 sm:gap-12">
              <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span class="font-caption text-xs uppercase tracking-wider text-secondary font-bold">Cycle de Vie Opérationnel</span>
                  <h2 class="text-2xl sm:text-3xl lg:text-[32px] text-primary font-bold tracking-tight mt-1">
                    De la modélisation à la production en 4 étapes contrôlées
                  </h2>
                </div>
                <!-- Interactive Tab Controller -->
                <div class="flex items-center gap-1 bg-surface-container-low dark:bg-white/10 p-1 rounded-xl border border-surface-container dark:border-white/10 shadow-xs">
                  <button
                    type="button"
                    (click)="activeLifecycleTab.set('dev')"
                    [class]="activeLifecycleTab() === 'dev' ? 'px-3.5 py-1.5 rounded-lg bg-pure-white dark:bg-[#111827] shadow-xs text-xs sm:text-sm font-bold text-primary transition-all cursor-pointer' : 'px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-on-surface-variant hover:text-primary transition-all cursor-pointer'"
                  >
                    Développement &amp; Sandbox
                  </button>
                  <button
                    type="button"
                    (click)="activeLifecycleTab.set('prod')"
                    [class]="activeLifecycleTab() === 'prod' ? 'px-3.5 py-1.5 rounded-lg bg-pure-white dark:bg-[#111827] shadow-xs text-xs sm:text-sm font-bold text-primary transition-all cursor-pointer' : 'px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-on-surface-variant hover:text-primary transition-all cursor-pointer'"
                  >
                    Production &amp; Audit SOX
                  </button>
                </div>
              </div>

              <!-- 4 Lifecycle Step Cards (Dynamic Reactivity) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                @for (step of currentLifecycleSteps(); track step.stepNumber) {
                  <div class="flex flex-col p-6 rounded-2xl bg-pure-white dark:bg-[#111827] shadow-sm border border-surface-container/80 dark:border-white/10 hover:border-secondary/40 transition-all duration-200">
                    <div class="flex items-center justify-between mb-4">
                      <span class="w-8 h-8 rounded-lg bg-primary-container text-pure-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                        {{ step.stepNumber }}
                      </span>
                      <span class="font-mono text-[11px] font-bold px-2 py-0.5 rounded" [class]="step.badgeClass">
                        {{ step.badgeText }}
                      </span>
                    </div>
                    <h4 class="text-base font-bold text-primary mb-2">{{ step.title }}</h4>
                    <p class="text-sm text-on-surface-variant dark:text-slate-300 leading-relaxed">{{ step.description }}</p>
                  </div>
                }
              </div>
            </div>
          </section>

          <!-- FINAL ENTERPRISE CONVERSION CTA SECTION -->
          <section class="w-full bg-surface py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
            <div class="max-w-6xl mx-auto relative rounded-3xl bg-gradient-to-b from-[#0e172e] via-[#091124] to-[#040814] text-white p-8 sm:p-12 lg:p-16 overflow-hidden border border-white/[0.12] shadow-[0_24px_64px_-12px_rgba(0,10,36,0.35)]">
              <!-- Ambient Radial Flare & Grid Texture -->
              <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none"></div>
              <div class="absolute -top-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-[#ffa515]/15 blur-[100px] pointer-events-none"></div>
              <div class="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none"></div>

              <div class="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
                <!-- Refined Soft Badge -->
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md mb-6 shadow-sm">
                  <span class="flex h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
                  <span class="text-xs font-semibold uppercase tracking-wider text-slate-200">Accompagnement Enterprise Dédié</span>
                </div>

                <h2 class="font-display text-2xl sm:text-3xl lg:text-[40px] lg:leading-[48px] text-white font-bold tracking-tight mb-4 max-w-2xl text-center">
                  Prêt à moderniser vos chaînes <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#ffa515]">d'orchestration d'entreprise ?</span>
                </h2>

                <p class="font-body-lg text-base sm:text-lg text-slate-300 max-w-2xl text-center mb-8 sm:mb-10 leading-relaxed font-normal">
                  Bénéficiez d'un accompagnement personnalisé avec nos architectes solutions et configurez votre premier cluster dédié en toute sérénité.
                </p>

                <div class="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full max-w-lg mb-10 sm:mb-12">
                  <a routerLink="/register" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#ffa515] to-[#fca311] text-[#000a24] font-bold text-sm shadow-[0_4px_20px_rgba(252,163,17,0.25)] hover:shadow-[0_6px_28px_rgba(252,163,17,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group">
                    <span>Créer un compte</span>
                    <svg class="w-4 h-4 text-[#000a24] group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="5" x2="19" y1="12" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </a>
                  <a routerLink="/workflows" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] text-white border border-white/15 font-semibold text-sm backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                    <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line></svg>
                    <span>Consulter la documentation</span>
                  </a>
                </div>

                <!-- Reassurance Pills -->
                <div class="pt-6 sm:pt-8 border-t border-white/[0.1] w-full flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300">
                    <div class="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span class="font-medium">PoC gratuit sur infrastructure dédiée</span>
                  </div>
                  <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300">
                    <div class="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span class="font-medium">Support technique architecte 24/7/365</span>
                  </div>
                  <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300">
                    <div class="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span class="font-medium">Accord de confidentialité (NDA) immédiat</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <!-- ENTERPRISE FOOTER -->
      <footer class="w-full bg-surface-container-lowest dark:bg-[#070e1c] border-t border-surface-container dark:border-white/10 transition-colors duration-200">
        <div class="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex flex-col gap-10 sm:gap-12 max-w-7xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
            <div class="lg:col-span-2 flex flex-col gap-4">
              <div class="flex items-center gap-2.5 text-primary">
                <div class="w-7 h-7 rounded-lg bg-primary-container flex items-center justify-center text-secondary-container">
                  <svg class="w-4 h-4 text-secondary-container" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <span class="text-lg tracking-tight text-primary font-bold">VANGUARD</span>
              </div>
              <p class="text-sm text-on-surface-variant dark:text-slate-400 max-w-sm leading-relaxed">
                Moteur d'orchestration distribué haute performance conçu pour l'automatisation critique d'entreprise, les microservices et les flux de données réglementés.
              </p>
              <div class="flex items-center gap-2 pt-1">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/15 text-success font-mono text-xs font-semibold border border-success/30">
                  <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                  99.99% Operational Uptime
                </span>
              </div>
            </div>

            <div class="flex flex-col gap-3">
              <span class="text-xs uppercase tracking-wider text-primary font-bold">Plateforme</span>
              <div class="flex flex-col gap-2 text-sm text-on-surface-variant dark:text-slate-400">
                <a routerLink="/workflows" class="hover:text-primary transition-colors">Concepteur de DAG</a>
                <a routerLink="/monitoring" class="hover:text-primary transition-colors">Bus d'Événements Distribué</a>
                <a routerLink="/workflows" class="hover:text-primary transition-colors">Rejeu Tolérant aux Pannes</a>
                <a routerLink="/tasks" class="hover:text-primary transition-colors">Files Haute Concurrence</a>
              </div>
            </div>

            <div class="flex flex-col gap-3">
              <span class="text-xs uppercase tracking-wider text-primary font-bold">Gouvernance &amp; Docs</span>
              <div class="flex flex-col gap-2 text-sm text-on-surface-variant dark:text-slate-400">
                <a routerLink="/workflows" class="hover:text-primary transition-colors">Référence API C# / REST</a>
                <a routerLink="/workflows" class="hover:text-primary transition-colors">SDKs &amp; Intégrations</a>
                <a routerLink="/audit-center" class="hover:text-primary transition-colors">Centre de Conformité</a>
                <a routerLink="/monitoring" class="hover:text-primary transition-colors">Gestion des Incidents</a>
              </div>
            </div>

            <div class="flex flex-col gap-3">
              <span class="text-xs uppercase tracking-wider text-primary font-bold">Conformité Certifiée</span>
              <div class="flex flex-col gap-2 text-sm text-on-surface-variant dark:text-slate-400">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-info shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>SOC-2 Type II Certifié</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-info shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>ISO 27001 Certifié</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-info shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>FIPS 140-3 Cryptographie</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-info shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  <span>HIPAA &amp; RGPD Conforme</span>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-6 sm:pt-8 border-t border-surface-container dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-on-surface-variant dark:text-slate-400 text-xs sm:text-sm">
            <p>© 2025 Vanguard Workflow Engine Technologies Inc. Tous droits réservés.</p>
            <div class="flex items-center gap-6">
              <a routerLink="/audit-center" class="hover:text-primary transition-colors">Politique de Confidentialité</a>
              <a routerLink="/audit-center" class="hover:text-primary transition-colors">Conditions d'Utilisation</a>
              <a routerLink="/audit-center" class="hover:text-primary transition-colors">Divulgation de Sécurité</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class LandingComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly i18n = inject(I18nService);

  /** Mobile navigation drawer disclosure state */
  protected readonly mobileMenuOpen = signal<boolean>(false);

  /** Active operational lifecycle tab: 'dev' vs 'prod' */
  protected readonly activeLifecycleTab = signal<'dev' | 'prod'>('dev');

  /** Canvas zoom level */
  protected readonly zoomLevel = signal<number>(1.0);

  /** DAG simulation state machine */
  protected readonly isSimulating = signal<boolean>(false);
  protected readonly currentSimStep = signal<number>(0);
  protected readonly simSuccess = signal<boolean>(false);
  protected readonly simThroughput = signal<string>('48,200 tx/sec');
  protected readonly simLatency = signal<string>('3.8 ms');

  private simTimer: ReturnType<typeof setTimeout> | null = null;

  /** Dynamic operational lifecycle steps based on active tab */
  protected readonly currentLifecycleSteps = computed(() => {
    if (this.activeLifecycleTab() === 'dev') {
      return [
        {
          stepNumber: 1,
          badgeText: 'DSL Modeler',
          badgeClass: 'bg-info/10 text-info',
          title: 'Conception Visuelle de Graphe',
          description: 'Assemblage drag-and-drop de composants événementiels et définition des règles métier C# sans boilerplate.'
        },
        {
          stepNumber: 2,
          badgeText: 'Dry-Run x100',
          badgeClass: 'bg-secondary/15 text-secondary',
          title: 'Simulation & Sandbox Isolée',
          description: 'Rejeu des flux historiques réels à vitesse accélérée pour valider la non-régression et la tolérance aux pannes.'
        },
        {
          stepNumber: 3,
          badgeText: 'Roslyn Lint',
          badgeClass: 'bg-primary-container/10 text-primary',
          title: 'Analyse Statique & Typage',
          description: 'Vérification syntaxique stricte des expressions C# et conformité des schémas d\'échange JSON/Protobuf.'
        },
        {
          stepNumber: 4,
          badgeText: 'Canary Deploy',
          badgeClass: 'bg-success/15 text-success',
          title: 'Déploiement Staging Éphémère',
          description: 'Validation d\'intégration sur cluster éphémère avant toute propagation vers les environnements critiques.'
        }
      ];
    }

    return [
      {
        stepNumber: 1,
        badgeText: 'WebAuthn Multi-Sig',
        badgeClass: 'bg-secondary/15 text-secondary',
        title: 'Validation Multi-Facteurs (HITL)',
        description: 'Double approbation cryptographique FIDO2 par les directeurs financiers et RSSI avant toute ouverture de flux.'
      },
      {
        stepNumber: 2,
        badgeText: 'Raft Consensus',
        badgeClass: 'bg-info/10 text-info',
        title: 'Déploiement Sans Coupure',
        description: 'Basculement actif/passif avec consensus distribué Raft garantissant un temps d\'arrêt strictement nul (Zero-Downtime).'
      },
      {
        stepNumber: 3,
        badgeText: 'SOX-404 WORM',
        badgeClass: 'bg-primary-container/10 text-primary',
        title: 'Journalisation Immuable',
        description: 'Chaque transition est ancrée dans un arbre de Merkle cryptographique infalsifiable pour audit légal continu.'
      },
      {
        stepNumber: 4,
        badgeText: 'OpenTelemetry Mesh',
        badgeClass: 'bg-success/15 text-success',
        title: 'Télémétrie & Auto-Guérison',
        description: 'Surveillance proactive des dérives de flux, autoscaling dynamique et réassignation automatique sur incident.'
      }
    ];
  });

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  protected setZoom(level: number): void {
    const clamped = Math.min(Math.max(level, 0.7), 1.4);
    this.zoomLevel.set(Math.round(clamped * 10) / 10);
  }

  protected triggerSimulation(): void {
    if (this.isSimulating()) return;

    if (this.simTimer) {
      clearTimeout(this.simTimer);
    }

    this.isSimulating.set(true);
    this.simSuccess.set(false);
    this.currentSimStep.set(1);
    this.simThroughput.set('64,800 tx/sec');
    this.simLatency.set('1.2 ms');

    // Step 1 -> Step 2 (Kafka -> Roslyn C#)
    this.simTimer = setTimeout(() => {
      this.currentSimStep.set(2);
      this.simThroughput.set('73,400 tx/sec');
      this.simLatency.set('1.8 ms');

      // Step 2 -> Step 3 (Roslyn C# -> HITL WebAuthn)
      this.simTimer = setTimeout(() => {
        this.currentSimStep.set(3);
        this.simThroughput.set('81,900 tx/sec');
        this.simLatency.set('2.6 ms');

        // Step 3 -> Step 4 (HITL -> SAP KMS)
        this.simTimer = setTimeout(() => {
          this.currentSimStep.set(4);
          this.simThroughput.set('88,500 tx/sec');
          this.simLatency.set('3.1 ms');

          // Step 4 -> Complete
          this.simTimer = setTimeout(() => {
            this.currentSimStep.set(0);
            this.isSimulating.set(false);
            this.simSuccess.set(true);
            this.simThroughput.set('48,200 tx/sec');
            this.simLatency.set('3.8 ms');
          }, 1200);
        }, 1200);
      }, 1200);
    }, 1200);
  }
}
