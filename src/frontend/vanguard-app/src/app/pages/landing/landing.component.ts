import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
      <!-- Fixed Header Navigation -->
      <header class="fixed top-0 w-full z-50 bg-pure-white/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div class="h-16 w-full px-gutter-lg flex items-center justify-between gap-space-lg">
          <div class="flex items-center gap-space-2xl">
            <a routerLink="/" class="flex items-center gap-space-sm text-primary">
              <div class="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-secondary-container shadow-sm">
                <svg class="w-5 h-5 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <div class="flex flex-col">
                <span class="font-headline-sm text-headline-sm tracking-tight text-primary leading-none font-bold">VANGUARD</span>
                <span class="font-caption text-caption text-on-surface-variant font-medium tracking-wider uppercase leading-none mt-0.5">Workflow Engine</span>
              </div>
            </a>

            <nav class="hidden lg:flex items-center gap-space-xl">
              <a routerLink="/" class="transition-colors text-primary font-bold">Platform</a>
              <a routerLink="/workflows" class="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors">Solutions</a>
              <a routerLink="/monitoring" class="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors">Engine Architecture</a>
              <a routerLink="/audit-center" class="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors">Security & Trust</a>
              <a routerLink="/workflows" class="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors">Documentation</a>
            </nav>
          </div>

          <div class="flex items-center gap-2 sm:gap-space-md">
            <!-- Bouton Connexion / Démo interactive toujours visible sur Mobile & Desktop -->
            <a routerLink="/login" class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-primary/20 hover:border-primary text-primary hover:bg-primary/5 font-label-md text-xs sm:text-sm font-bold transition-all shadow-xs">
              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="hidden xl:inline">Connexion / Démo interactive</span>
              <span class="hidden sm:inline xl:hidden">Connexion / Démo</span>
              <span class="sm:hidden">Connexion</span>
            </a>

            <!-- Bouton Enterprise Demo -->
            <a routerLink="/register" class="inline-flex items-center justify-center px-3 py-1.5 sm:px-space-lg sm:py-space-sm rounded-lg bg-secondary-container text-noir-text font-label-md text-xs sm:text-sm font-bold hover:bg-secondary hover:text-on-secondary transition-all shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
              <span class="hidden sm:inline">Request Enterprise Demo</span>
              <span class="sm:hidden">Essai Demo</span>
            </a>

            <!-- Pastille profil / accès rapide login -->
            <a routerLink="/login" title="Accéder à l'espace de connexion" class="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:opacity-90 transition-opacity shadow-xs">
              <svg class="w-4 h-4 text-pure-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </a>
          </div>
        </div>
      </header>

      <!-- Main Landing Content -->
      <main class="w-full pt-16 bg-surface flex-1">
        <div class="flex flex-col w-full">
          <!-- HERO SECTION -->
          <section class="relative w-full overflow-hidden bg-surface py-space-4xl px-gutter-lg flex flex-col items-center">
            <!-- Ambient Canvas Glow behind Hero -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-gradient-to-b from-primary-container/10 via-secondary-container/5 to-transparent blur-3xl pointer-events-none -z-10"></div>
            
            <div class="max-w-6xl w-full flex flex-col items-center text-center">
              <!-- Live Status Pill Tag -->
              <div class="inline-flex items-center gap-space-sm px-space-md py-1.5 rounded-full bg-surface-container-low shadow-xs mb-space-xl border border-surface-container">
                <span class="flex h-2 w-2 relative">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                <span class="font-caption text-caption text-primary font-bold tracking-wide uppercase">Vanguard v4.2</span>
                <span class="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span class="font-caption text-caption text-on-surface-variant font-medium">Moteur d'Orchestration Haut Débit & Zero-Trust</span>
              </div>

              <!-- Main Heading -->
              <h1 class="font-display text-display lg:text-[46px] lg:leading-[54px] text-primary tracking-tight max-w-4xl font-bold mb-space-lg">
                Automatisez vos processus critiques avec une <span class="text-secondary-container underline decoration-secondary-container/40 underline-offset-8">gouvernance absolue</span>.
              </h1>

              <!-- Subheadline -->
              <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed mb-space-2xl">
                Concevez, simulez et déployez des workflows complexes alliant décisions humaines (HITL), exécutions distribuées C#/.NET Core et conformité SOX-404 / SOC-2 Type II.
              </p>

              <!-- Action CTAs -->
              <div class="flex flex-col sm:flex-row items-center justify-center gap-space-md w-full max-w-md mb-space-2xl">
                <a routerLink="/register" class="w-full sm:w-auto inline-flex items-center justify-center gap-space-sm px-space-xl py-space-sm rounded-lg bg-secondary-container text-noir-text font-label-md text-label-md font-bold shadow-md hover:bg-secondary-fixed-dim transition-all">
                  <span>Démarrer un essai Enterprise</span>
                  <svg class="w-4 h-4 text-noir-text" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                    <line x1="5" x2="19" y1="12" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
                <a routerLink="/login" class="w-full sm:w-auto inline-flex items-center justify-center gap-space-sm px-space-xl py-space-sm rounded-lg bg-pure-white text-primary font-label-md text-label-md font-semibold shadow-xs hover:bg-surface-container-low transition-all border border-surface-container">
                  <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>Connexion / Démo interactive</span>
                </a>
              </div>

              <!-- Trust Badges Line -->
              <div class="flex flex-wrap items-center justify-center gap-x-space-xl gap-y-space-sm text-on-surface-variant font-caption text-caption">
                <div class="flex items-center gap-space-xs">
                  <svg class="w-4 h-4 text-info" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <rect height="8" rx="2" ry="2" width="20" x="2" y="2"></rect>
                    <rect height="8" rx="2" ry="2" width="20" x="2" y="14"></rect>
                    <line x1="6" x2="6.01" y1="6" y2="6"></line>
                    <line x1="6" x2="6.01" y1="18" y2="18"></line>
                  </svg>
                  <span>Déploiement Private Cloud / VPC</span>
                </div>
                <span class="w-1 h-1 rounded-full bg-outline-variant hidden sm:inline-block"></span>
                <div class="flex items-center gap-space-xs">
                  <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  <span>FIPS 140-3 Cryptographie certifiée</span>
                </div>
                <span class="w-1 h-1 rounded-full bg-outline-variant hidden sm:inline-block"></span>
                <div class="flex items-center gap-space-xs">
                  <svg class="w-4 h-4 text-secondary-container" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>SLA 99.999% Haute Disponibilité</span>
                </div>
              </div>
            </div>

            <!-- INTERACTIVE WORKFLOW DAG HERO CANVAS -->
            <div class="w-full max-w-6xl mt-space-3xl relative">
              <!-- Glow Underlay -->
              <div class="absolute -inset-1 bg-gradient-to-r from-primary-container via-secondary-container/20 to-primary-container rounded-2xl blur-xl opacity-30"></div>
              
              <!-- Main Shell Canvas Window -->
              <div class="relative w-full rounded-2xl bg-primary-container text-on-primary shadow-xl overflow-hidden p-space-md sm:p-space-xl border border-white/10">
                <!-- Canvas Header Bar -->
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-space-lg gap-space-md bg-primary-container/80 backdrop-blur">
                  <div class="flex items-center gap-space-md">
                    <div class="flex items-center gap-1.5">
                      <span class="w-3 h-3 rounded-full bg-error/80 inline-block"></span>
                      <span class="w-3 h-3 rounded-full bg-warning/80 inline-block"></span>
                      <span class="w-3 h-3 rounded-full bg-success/80 inline-block"></span>
                    </div>
                    <div class="h-4 w-px bg-outline/30 mx-space-xs"></div>
                    <div class="flex items-center gap-space-xs">
                      <svg class="w-4 h-4 text-secondary-container" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                        <polyline points="2 17 12 22 22 17"></polyline>
                        <polyline points="2 12 12 17 22 12"></polyline>
                      </svg>
                      <span class="font-label-sm text-label-sm font-semibold tracking-wide text-pure-white">SOX_Treasury_Settlement_Pipeline.dag</span>
                    </div>
                    <span class="px-2 py-0.5 rounded-full bg-success/20 text-success font-caption text-caption font-bold">LIVE RUNNING</span>
                  </div>

                  <!-- Canvas Controls -->
                  <div class="flex items-center gap-space-sm">
                    <div class="flex items-center bg-primary rounded-lg p-1 text-on-primary-container">
                      <button type="button" (click)="zoomLevel.set(zoomLevel() + 0.1)" class="p-1 hover:text-pure-white rounded transition-colors" title="Zoom In">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line><line x1="11" x2="11" y1="8" y2="14"></line><line x1="8" x2="14" y1="11" y2="11"></line></svg>
                      </button>
                      <button type="button" (click)="zoomLevel.set(zoomLevel() - 0.1)" class="p-1 hover:text-pure-white rounded transition-colors" title="Zoom Out">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line><line x1="8" x2="14" y1="11" y2="11"></line></svg>
                      </button>
                      <button type="button" (click)="zoomLevel.set(1.0)" class="p-1 hover:text-pure-white rounded transition-colors" title="Reset Zoom">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" x2="14" y1="3" y2="10"></line><line x1="3" x2="10" y1="21" y2="14"></line></svg>
                      </button>
                    </div>
                    <button type="button" (click)="triggerSimulation()" class="flex items-center gap-space-xs px-3 py-1.5 rounded-lg bg-secondary-container text-noir-text font-label-sm text-label-sm font-bold shadow-sm hover:bg-secondary-fixed-dim transition-all active:scale-95">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                      <span>{{ isSimulating() ? 'Exécution en cours...' : 'Exécuter Simulation' }}</span>
                    </button>
                  </div>
                </div>

                <!-- Canvas Visual Graph Area -->
                <div class="relative w-full rounded-xl bg-primary/95 p-space-lg sm:p-space-2xl min-h-[460px] flex flex-col justify-between overflow-x-auto border border-white/5">
                  <!-- Background Grid Matrix Decoration -->
                  <svg class="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="dag-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="#FFFFFF"></circle>
                      </pattern>
                    </defs>
                    <rect fill="url(#dag-grid)" height="100%" width="100%"></rect>
                  </svg>

                  <!-- Graph Nodes Layout Container -->
                  <div class="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-space-lg sm:gap-space-xl items-center py-space-xl" [style.transform]="'scale(' + zoomLevel() + ')'" style="transform-origin: center center; transition: transform 0.2s ease;">
                    <!-- Node 1: Ingest Webhook / Kafka -->
                    <div class="relative flex flex-col rounded-xl bg-pure-white text-on-surface p-space-md shadow-md min-w-[210px] border border-gray-100">
                      <div class="flex items-center justify-between mb-space-sm">
                        <div class="flex items-center gap-space-xs">
                          <div class="w-6 h-6 rounded-md bg-info/10 text-info flex items-center justify-center">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                          </div>
                          <span class="font-caption text-caption font-bold text-primary uppercase">Ingest Trigger</span>
                        </div>
                        <span class="w-2 h-2 rounded-full bg-info"></span>
                      </div>
                      <p class="font-label-sm text-label-sm font-semibold text-primary">Webhook & Kafka Event</p>
                      <div class="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-caption text-caption border-t border-gray-100">
                        <span>topic: treasury.tx</span>
                        <span class="text-info font-mono font-bold">9.2k/s</span>
                      </div>
                      <span class="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-pure-white ring-2 ring-info"></span>
                    </div>

                    <!-- Node 2: Business Rule Evaluator -->
                    <div class="relative flex flex-col rounded-xl bg-pure-white text-on-surface p-space-md shadow-md min-w-[210px] border border-gray-100">
                      <span class="hidden md:block absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-pure-white ring-2 ring-info"></span>
                      <div class="flex items-center justify-between mb-space-sm">
                        <div class="flex items-center gap-space-xs">
                          <div class="w-6 h-6 rounded-md bg-primary-container text-pure-white flex items-center justify-center">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line></svg>
                          </div>
                          <span class="font-caption text-caption font-bold text-primary uppercase">Moteur Règles</span>
                        </div>
                        <span class="px-1.5 py-0.5 rounded bg-surface-container font-caption text-[10px] text-on-surface-variant font-semibold">C# Roslyn</span>
                      </div>
                      <p class="font-label-sm text-label-sm font-semibold text-primary">CapEx &gt; $100,000 SOX</p>
                      <div class="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-caption text-caption border-t border-gray-100">
                        <span>Audit hash: #3A89</span>
                        <span class="text-success font-bold">PASS (&lt;1ms)</span>
                      </div>
                      <span class="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-secondary-container ring-2 ring-secondary-container"></span>
                    </div>

                    <!-- Node 3: Approval Gate (Highlighted Orange Accent) -->
                    <div class="relative flex flex-col rounded-xl bg-secondary-container text-noir-text p-space-md shadow-lg min-w-[210px] ring-2 ring-secondary-container/50">
                      <span class="hidden md:block absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-secondary-container ring-2 ring-secondary-container"></span>
                      <div class="flex items-center justify-between mb-space-sm">
                        <div class="flex items-center gap-space-xs">
                          <div class="w-6 h-6 rounded-md bg-noir-text text-secondary-container flex items-center justify-center">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><rect height="11" rx="2" ry="2" width="18" x="3" y="11"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                          </div>
                          <span class="font-caption text-caption font-bold text-noir-text uppercase">Approval Gate</span>
                        </div>
                        <span class="w-2 h-2 rounded-full bg-noir-text"></span>
                      </div>
                      <p class="font-label-sm text-label-sm font-bold text-noir-text">Dual Sign-Off HITL</p>
                      <div class="mt-space-sm pt-space-xs flex items-center justify-between text-noir-text/80 font-caption text-caption border-t border-noir-text/20">
                        <span>VP Fin & CISO</span>
                        <span class="font-bold underline">Approuvé WebAuthn</span>
                      </div>
                      <span class="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-pure-white ring-2 ring-success"></span>
                    </div>

                    <!-- Node 4: Automated Settlement / Ledger Action -->
                    <div class="relative flex flex-col rounded-xl bg-pure-white text-on-surface p-space-md shadow-md min-w-[210px] border border-gray-100">
                      <span class="hidden md:block absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-pure-white ring-2 ring-success"></span>
                      <div class="flex items-center justify-between mb-space-sm">
                        <div class="flex items-center gap-space-xs">
                          <div class="w-6 h-6 rounded-md bg-success/15 text-success flex items-center justify-center">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                          <span class="font-caption text-caption font-bold text-success uppercase">Auto Action</span>
                        </div>
                        <span class="px-1.5 py-0.5 rounded bg-success/15 font-caption text-[10px] text-success font-bold">200 OK</span>
                      </div>
                      <p class="font-label-sm text-label-sm font-semibold text-primary">SAP S/4HANA & KMS</p>
                      <div class="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-caption text-caption border-t border-gray-100">
                        <span>Enclave Nitro KMS</span>
                        <span class="text-success font-bold">12ms Sync</span>
                      </div>
                    </div>
                  </div>

                  <!-- Bottom Telemetry HUD Bar inside Canvas -->
                  <div class="relative z-10 w-full mt-space-lg pt-space-md bg-primary-container/90 rounded-lg p-space-md flex flex-wrap items-center justify-between gap-space-md border border-white/5">
                    <div class="flex items-center gap-space-lg flex-wrap">
                      <div class="flex items-center gap-space-xs">
                        <span class="w-2 h-2 rounded-full bg-success"></span>
                        <span class="font-caption text-caption text-on-primary-container">Débit :</span>
                        <span class="font-label-sm text-label-sm font-mono font-bold text-pure-white">48,200 tx/sec</span>
                      </div>
                      <div class="flex items-center gap-space-xs">
                        <span class="font-caption text-caption text-on-primary-container">Latence P99 :</span>
                        <span class="font-label-sm text-label-sm font-mono font-bold text-pure-white">3.8 ms</span>
                      </div>
                      <div class="flex items-center gap-space-xs">
                        <span class="font-caption text-caption text-on-primary-container">Clusters Actifs :</span>
                        <span class="font-label-sm text-label-sm font-mono font-bold text-pure-white">24/24 Healthy</span>
                      </div>
                    </div>
                    <div class="flex items-center gap-space-md">
                      <span class="font-caption text-caption text-on-primary-container">Stack :</span>
                      <div class="flex items-center gap-space-xs">
                        <span class="px-2 py-0.5 rounded bg-primary text-[11px] font-mono text-pure-white font-medium">C# .NET 8</span>
                        <span class="px-2 py-0.5 rounded bg-primary text-[11px] font-mono text-pure-white font-medium">Angular 18</span>
                        <span class="px-2 py-0.5 rounded bg-primary text-[11px] font-mono text-pure-white font-medium">PostgreSQL</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- SOCIAL PROOF / ENTERPRISE ADOPTION TICKER -->
          <section class="w-full bg-pure-white py-space-3xl px-gutter-lg border-y border-surface-container">
            <div class="max-w-6xl mx-auto flex flex-col items-center">
              <p class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold text-center mb-space-xl">
                Propulsé au cœur des infrastructures financières et industrielles les plus exigeantes
              </p>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-space-xl items-center w-full justify-items-center opacity-85">
                <div class="flex items-center gap-space-xs text-primary font-bold tracking-tight">
                  <svg class="w-6 h-6 text-primary-container" fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <span class="font-headline-sm text-headline-sm">APEX·BANK</span>
                </div>
                <div class="flex items-center gap-space-xs text-primary font-bold tracking-tight">
                  <svg class="w-6 h-6 text-secondary" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93 4.24 4.24"></path><path d="m14.83 9.17 4.24-4.24"></path><path d="m14.83 14.83 4.24 4.24"></path><path d="m9.17 14.83-4.24 4.24"></path></svg>
                  <span class="font-headline-sm text-headline-sm">AERODYN</span>
                </div>
                <div class="flex items-center gap-space-xs text-primary font-bold tracking-tight">
                  <svg class="w-6 h-6 text-info" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                  <span class="font-headline-sm text-headline-sm">HEALTHTRUST</span>
                </div>
                <div class="flex items-center gap-space-xs text-primary font-bold tracking-tight">
                  <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><rect height="13" width="15" x="1" y="3"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                  <span class="font-headline-sm text-headline-sm">NORDIC LOG</span>
                </div>
                <div class="flex items-center gap-space-xs text-primary font-bold tracking-tight">
                  <svg class="w-6 h-6 text-secondary-container" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                  <span class="font-headline-sm text-headline-sm">FINVANTAGE</span>
                </div>
              </div>
            </div>
          </section>

          <!-- CORE VALUE PILLARS (Bento Grid of Features) -->
          <section class="w-full bg-surface py-space-5xl px-gutter-lg">
            <div class="max-w-6xl mx-auto flex flex-col gap-space-4xl">
              <div class="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                <div>
                  <span class="font-caption text-caption uppercase tracking-wider text-secondary font-bold">Architecture Prête pour l'Entreprise</span>
                  <h2 class="font-headline-lg text-headline-lg text-primary font-bold tracking-tight mt-space-xs">
                    L'orchestration d'entreprise réinventée sans compromis
                  </h2>
                </div>
                <p class="font-body-md text-body-md text-on-surface-variant max-w-md">
                  Un moteur déterministe et résistant aux pannes, conçu pour éliminer les ruptures d'intégrité et les goulots d'étranglement manuels.
                </p>
              </div>

              <!-- Pillar Cards -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-space-xl">
                <!-- Pillar Card 1 -->
                <div class="flex flex-col rounded-xl bg-pure-white p-space-2xl shadow-sm hover:shadow-md transition-shadow border border-surface-container">
                  <div class="w-12 h-12 rounded-xl bg-primary-container text-secondary-container flex items-center justify-center mb-space-xl">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                      <polyline points="2 17 12 22 22 17"></polyline>
                      <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                  </div>
                  <span class="font-caption text-caption text-on-surface-variant font-mono">01 // VISUAL CANVAS</span>
                  <h3 class="font-headline-sm text-headline-sm text-primary font-bold mt-space-xs mb-space-sm">
                    Concepteur Visuel de DAG Sans Compromis
                  </h3>
                  <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-lg flex-1">
                    Modélisez vos pipelines via une interface réactive en drag-and-drop. Support intégré du moteur d'évaluation de règles C#, sous-graphes réutilisables et gestion des versions type Git avec retour en arrière instantané.
                  </p>
                  <a routerLink="/workflows" class="flex items-center gap-space-xs text-primary font-label-sm text-label-sm font-semibold hover:text-secondary-container transition-colors">
                    <span>Découvrir le moteur de graphes</span>
                    <svg class="w-4 h-4 text-secondary-container" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="5" x2="19" y1="12" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </a>
                </div>

                <!-- Pillar Card 2 -->
                <div class="flex flex-col rounded-xl bg-pure-white p-space-2xl shadow-sm hover:shadow-md transition-shadow border border-surface-container">
                  <div class="w-12 h-12 rounded-xl bg-secondary-container text-noir-text flex items-center justify-center mb-space-xl">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <span class="font-caption text-caption text-on-surface-variant font-mono">02 // GOVERNANCE & HITL</span>
                  <h3 class="font-headline-sm text-headline-sm text-primary font-bold mt-space-xs mb-space-sm">
                    Human-In-The-Loop & Séparation des Tâches
                  </h3>
                  <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-lg flex-1">
                    Garantissez le principe des 4 yeux (Four-Eyes Principle). Validation sécurisée via clés FIDO2/WebAuthn, matrice RBAC fine, réassignation dynamique et escalades automatisées en cas de dépassement de SLA.
                  </p>
                  <a routerLink="/tasks" class="flex items-center gap-space-xs text-primary font-label-sm text-label-sm font-semibold hover:text-secondary-container transition-colors">
                    <span>Explorer les règles de validation</span>
                    <svg class="w-4 h-4 text-secondary-container" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="5" x2="19" y1="12" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </a>
                </div>

                <!-- Pillar Card 3 -->
                <div class="flex flex-col rounded-xl bg-pure-white p-space-2xl shadow-sm hover:shadow-md transition-shadow border border-surface-container">
                  <div class="w-12 h-12 rounded-xl bg-primary-container text-pure-white flex items-center justify-center mb-space-xl">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      <polyline points="9 11 12 14 22 4"></polyline>
                    </svg>
                  </div>
                  <span class="font-caption text-caption text-on-surface-variant font-mono">03 // IMMUTABLE AUDIT</span>
                  <h3 class="font-headline-sm text-headline-sm text-primary font-bold mt-space-xs mb-space-sm">
                    Audit Immuable & Conformité Réglementaire
                  </h3>
                  <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-lg flex-1">
                    Chaque transition d'état est ancrée dans un arbre de Merkle cryptographique. Journaux WORM infalsifiables, traçabilité forensique intégrale et génération automatisée des rapports d'audit SOX-404 et ISO 27001.
                  </p>
                  <a routerLink="/audit-center" class="flex items-center gap-space-xs text-primary font-label-sm text-label-sm font-semibold hover:text-secondary-container transition-colors">
                    <span>Consulter les spécifications d'audit</span>
                    <svg class="w-4 h-4 text-secondary-container" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="5" x2="19" y1="12" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </a>
                </div>
              </div>
            </div>
          </section>

          <!-- TECHNICAL BENCHMARKS & ARCHITECTURE MATRIX -->
          <section class="w-full bg-pure-white py-space-5xl px-gutter-lg border-y border-surface-container">
            <div class="max-w-6xl mx-auto flex flex-col gap-space-3xl">
              <!-- Section Intro Header -->
              <div class="text-center max-w-2xl mx-auto">
                <span class="font-caption text-caption uppercase tracking-wider text-secondary font-bold">Haute Performance & Résilience</span>
                <h2 class="font-headline-lg text-headline-lg text-primary font-bold tracking-tight mt-space-xs">
                  Métriques d'exécution vérifiées à l'échelle industrielle
                </h2>
              </div>

              <!-- Key Metrics Row -->
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-space-lg">
                <div class="flex flex-col p-space-xl rounded-xl bg-surface-container-low border border-surface-container">
                  <span class="font-display text-display text-primary font-bold tracking-tight">99.999%</span>
                  <span class="font-label-md text-label-md text-primary font-semibold mt-space-xs">Disponibilité SLA</span>
                  <p class="font-caption text-caption text-on-surface-variant mt-space-xs">Réplication active multi-régions avec consensus Raft et bascule automatique.</p>
                </div>
                <div class="flex flex-col p-space-xl rounded-xl bg-surface-container-low border border-surface-container">
                  <span class="font-display text-display text-secondary-container font-bold tracking-tight">&lt; 4.2ms</span>
                  <span class="font-label-md text-label-md text-primary font-semibold mt-space-xs">Latence P99 du Moteur</span>
                  <p class="font-caption text-caption text-on-surface-variant mt-space-xs">Compilation native JIT des arbres d'expression C# et SKIP LOCKED PostgreSQL.</p>
                </div>
                <div class="flex flex-col p-space-xl rounded-xl bg-surface-container-low border border-surface-container">
                  <span class="font-display text-display text-primary font-bold tracking-tight">50M+</span>
                  <span class="font-label-md text-label-md text-primary font-semibold mt-space-xs">Transactions / Jour</span>
                  <p class="font-caption text-caption text-on-surface-variant mt-space-xs">Capacité éprouvée sur des parcs transactionnels bancaires et d'assurance.</p>
                </div>
                <div class="flex flex-col p-space-xl rounded-xl bg-surface-container-low border border-surface-container">
                  <span class="font-display text-display text-primary font-bold tracking-tight">Zero-Trust</span>
                  <span class="font-label-md text-label-md text-primary font-semibold mt-space-xs">Isolation Matérielle</span>
                  <p class="font-caption text-caption text-on-surface-variant mt-space-xs">Chiffrement AES-256 GCM exécuté dans des enclaves sécurisées AWS Nitro.</p>
                </div>
              </div>

              <!-- Architectural Deep Dive Banner -->
              <div class="w-full rounded-2xl bg-surface p-space-xl flex flex-col md:flex-row items-center justify-between gap-space-xl border border-surface-container">
                <div class="flex flex-col gap-space-sm max-w-xl">
                  <div class="flex items-center gap-space-xs">
                    <span class="px-2 py-0.5 rounded bg-primary-container text-pure-white font-caption text-caption font-bold">STANDARDS OPEN-CORE</span>
                    <span class="font-caption text-caption text-on-surface-variant font-medium">Compatible Cloud-Native CNCF</span>
                  </div>
                  <h3 class="font-headline-sm text-headline-sm text-primary font-bold">
                    Intégration native sans refonte d'infrastructure
                  </h3>
                  <p class="font-body-md text-body-md text-on-surface-variant">
                    Déployez Vanguard directement dans votre cluster Kubernetes (EKS, AKS, OpenShift) via des charts Helm certifiés, ou optez pour notre offre SaaS dédiée avec infogérance complète.
                  </p>
                </div>

                <!-- Tech Badges Group -->
                <div class="flex flex-wrap items-center gap-space-sm md:justify-end">
                  <span class="px-3 py-1.5 rounded-lg bg-pure-white shadow-xs font-label-sm text-label-sm font-semibold text-primary border border-surface-container">C# / ASP.NET 8</span>
                  <span class="px-3 py-1.5 rounded-lg bg-pure-white shadow-xs font-label-sm text-label-sm font-semibold text-primary border border-surface-container">Angular 18 Enterprise</span>
                  <span class="px-3 py-1.5 rounded-lg bg-pure-white shadow-xs font-label-sm text-label-sm font-semibold text-primary border border-surface-container">PostgreSQL Partitioned</span>
                  <span class="px-3 py-1.5 rounded-lg bg-pure-white shadow-xs font-label-sm text-label-sm font-semibold text-primary border border-surface-container">Kubernetes Helm</span>
                  <span class="px-3 py-1.5 rounded-lg bg-pure-white shadow-xs font-label-sm text-label-sm font-semibold text-primary border border-surface-container">Redis Distributed</span>
                </div>
              </div>
            </div>
          </section>

          <!-- INTERACTIVE WORKFLOW COMPARISON / STEPPER -->
          <section class="w-full bg-surface py-space-5xl px-gutter-lg">
            <div class="max-w-6xl mx-auto flex flex-col gap-space-3xl">
              <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
                <div>
                  <span class="font-caption text-caption uppercase tracking-wider text-secondary font-bold">Cycle de Vie Opérationnel</span>
                  <h2 class="font-headline-lg text-headline-lg text-primary font-bold tracking-tight mt-space-xs">
                    De la rédaction à la production en 4 étapes contrôlées
                  </h2>
                </div>
                
                <!-- Tab switcher -->
                <div class="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-lg border border-surface-container">
                  <button
                    type="button"
                    (click)="activeLifecycleTab.set('dev')"
                    [class]="activeLifecycleTab() === 'dev' ? 'px-3 py-1.5 rounded-md bg-pure-white shadow-sm font-label-sm text-label-sm font-bold text-primary transition-all' : 'px-3 py-1.5 rounded-md font-label-sm text-label-sm font-medium text-on-surface-variant hover:text-primary transition-all'"
                  >
                    Développement
                  </button>
                  <button
                    type="button"
                    (click)="activeLifecycleTab.set('prod')"
                    [class]="activeLifecycleTab() === 'prod' ? 'px-3 py-1.5 rounded-md bg-pure-white shadow-sm font-label-sm text-label-sm font-bold text-primary transition-all' : 'px-3 py-1.5 rounded-md font-label-sm text-label-sm font-medium text-on-surface-variant hover:text-primary transition-all'"
                  >
                    Production & Audit
                  </button>
                </div>
              </div>

              <!-- 4 Lifecycle Step Cards -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
                <!-- Step 1 -->
                <div class="flex flex-col p-space-xl rounded-xl bg-pure-white shadow-sm border border-surface-container hover:shadow-md transition-shadow">
                  <div class="flex items-center justify-between mb-space-md">
                    <span class="w-8 h-8 rounded-lg bg-primary-container text-pure-white flex items-center justify-center font-mono font-bold text-label-sm">1</span>
                    <span class="font-caption text-caption text-info font-bold">DSL Modeler</span>
                  </div>
                  <h4 class="font-headline-sm text-headline-sm text-primary font-bold mb-space-xs">Conception Visuelle</h4>
                  <p class="font-body-md text-body-md text-on-surface-variant">Assemblage des composants événementiels et définition des règles métier complexes sans code superflu.</p>
                </div>

                <!-- Step 2 -->
                <div class="flex flex-col p-space-xl rounded-xl bg-pure-white shadow-sm border border-surface-container hover:shadow-md transition-shadow">
                  <div class="flex items-center justify-between mb-space-md">
                    <span class="w-8 h-8 rounded-lg bg-primary-container text-pure-white flex items-center justify-center font-mono font-bold text-label-sm">2</span>
                    <span class="font-caption text-caption text-secondary font-bold">Dry-Run</span>
                  </div>
                  <h4 class="font-headline-sm text-headline-sm text-primary font-bold mb-space-xs">Simulation & Sandbox</h4>
                  <p class="font-body-md text-body-md text-on-surface-variant">Rejeu des flux historiques réels à vitesse x100 pour valider la non-régression et la tolérance aux pannes.</p>
                </div>

                <!-- Step 3 -->
                <div class="flex flex-col p-space-xl rounded-xl bg-pure-white shadow-sm border border-surface-container hover:shadow-md transition-shadow ring-2 ring-secondary-container/30">
                  <div class="flex items-center justify-between mb-space-md">
                    <span class="w-8 h-8 rounded-lg bg-secondary-container text-noir-text flex items-center justify-center font-mono font-bold text-label-sm">3</span>
                    <span class="font-caption text-caption text-secondary-container font-bold">SOX-404</span>
                  </div>
                  <h4 class="font-headline-sm text-headline-sm text-primary font-bold mb-space-xs">Approbation Signée</h4>
                  <p class="font-body-md text-body-md text-on-surface-variant">Validation à double signature cryptographique des changements de code et déploiement automatique sans interruption.</p>
                </div>

                <!-- Step 4 -->
                <div class="flex flex-col p-space-xl rounded-xl bg-pure-white shadow-sm border border-surface-container hover:shadow-md transition-shadow">
                  <div class="flex items-center justify-between mb-space-md">
                    <span class="w-8 h-8 rounded-lg bg-primary-container text-pure-white flex items-center justify-center font-mono font-bold text-label-sm">4</span>
                    <span class="font-caption text-caption text-success font-bold">Active Mesh</span>
                  </div>
                  <h4 class="font-headline-sm text-headline-sm text-primary font-bold mb-space-xs">Exécution & Télémétrie</h4>
                  <p class="font-body-md text-body-md text-on-surface-variant">Surveillance OpenTelemetry en continu avec détection proactive des dérives de flux et autoscaling dynamique.</p>
                </div>
              </div>
            </div>
          </section>

          <!-- FINAL ENTERPRISE CONVERSION CTA SECTION -->
          <section class="w-full bg-surface py-space-5xl px-gutter-lg">
            <div class="max-w-6xl mx-auto relative rounded-3xl bg-primary-container text-on-primary p-space-2xl sm:p-space-4xl overflow-hidden shadow-xl border border-white/10">
              <!-- Ambient Radial Flare -->
              <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
              <div class="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-info/10 blur-3xl pointer-events-none"></div>
              
              <div class="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
                <div class="w-12 h-12 rounded-xl bg-secondary-container text-noir-text flex items-center justify-center mb-space-lg shadow-md">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <rect height="14" rx="2" ry="2" width="20" x="2" y="3"></rect>
                    <line x1="8" x2="16" y1="21" y2="21"></line>
                    <line x1="12" x2="12" y1="17" y2="21"></line>
                  </svg>
                </div>
                <h2 class="font-display text-display lg:text-[40px] lg:leading-[48px] text-pure-white font-bold tracking-tight mb-space-md">
                  Prêt à moderniser vos chaînes d'orchestration d'entreprise ?
                </h2>
                <p class="font-body-lg text-body-lg text-on-primary-container max-w-xl mb-space-2xl">
                  Bénéficiez d'un accompagnement personnalisé avec nos architectes solutions et configurez votre premier cluster dédié en moins de 15 minutes.
                </p>
                
                <div class="flex flex-col sm:flex-row items-center justify-center gap-space-md w-full max-w-md">
                  <a routerLink="/register" class="w-full sm:w-auto inline-flex items-center justify-center gap-space-sm px-space-xl py-space-sm rounded-lg bg-secondary-container text-noir-text font-label-md text-label-md font-bold shadow-md hover:bg-secondary-fixed-dim transition-all">
                    <span>Demander une démonstration privée</span>
                    <svg class="w-4 h-4 text-noir-text" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="5" x2="19" y1="12" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </a>
                  <a routerLink="/workflows" class="w-full sm:w-auto inline-flex items-center justify-center gap-space-sm px-space-xl py-space-sm rounded-lg bg-primary text-pure-white font-label-md text-label-md font-semibold hover:bg-primary/80 transition-all border border-white/10">
                    <svg class="w-4 h-4 text-pure-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line></svg>
                    <span>Consulter la documentation</span>
                  </a>
                </div>

                <div class="mt-space-2xl pt-space-xl flex flex-wrap items-center justify-center gap-space-xl text-on-primary-container font-caption text-caption border-t border-white/10">
                  <span class="flex items-center gap-1.5"><svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg> PoC gratuit sur infrastructure dédiée</span>
                  <span class="flex items-center gap-1.5"><svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg> Support technique architecte 24/7/365</span>
                  <span class="flex items-center gap-1.5"><svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg> Accord de confidentialité (NDA) immédiat</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <!-- ENTERPRISE FOOTER -->
      <footer class="w-full bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-t border-surface-container">
        <div class="w-full px-gutter-lg py-space-4xl flex flex-col gap-space-3xl max-w-7xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-2xl">
            <div class="lg:col-span-2 flex flex-col gap-space-md">
              <div class="flex items-center gap-space-sm text-primary">
                <div class="w-7 h-7 rounded-lg bg-primary-container flex items-center justify-center text-secondary-container">
                  <svg class="w-4 h-4 text-secondary-container" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <span class="font-headline-sm text-headline-sm tracking-tight text-primary leading-none font-bold">VANGUARD</span>
              </div>
              <p class="font-body-md text-body-md text-on-surface-variant max-w-sm">
                High-throughput computational orchestration engine built for mission-critical enterprise automation, microservice pipelines, and regulated data flows.
              </p>
              <div class="flex items-center gap-space-sm pt-space-xs">
                <span class="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-success/15 text-success font-caption text-caption font-semibold">
                  <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                  99.99% Operational Uptime
                </span>
              </div>
            </div>

            <div class="flex flex-col gap-space-sm">
              <span class="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">Platform Pillars</span>
              <div class="flex flex-col gap-space-xs">
                <a routerLink="/workflows" class="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">State Machine Core</a>
                <a routerLink="/monitoring" class="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Distributed Event Bus</a>
                <a routerLink="/workflows" class="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Fault-Tolerant Replay</a>
                <a routerLink="/tasks" class="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">High-Concurrency Queues</a>
              </div>
            </div>

            <div class="flex flex-col gap-space-sm">
              <span class="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">Governance & Docs</span>
              <div class="flex flex-col gap-space-xs">
                <a routerLink="/workflows" class="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">API Reference</a>
                <a routerLink="/workflows" class="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">SDKs & Integrations</a>
                <a routerLink="/audit-center" class="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Trust Center</a>
                <a routerLink="/monitoring" class="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Incident Response</a>
              </div>
            </div>

            <div class="flex flex-col gap-space-sm">
              <span class="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">Compliance Certs</span>
              <div class="flex flex-col gap-space-xs">
                <div class="flex items-center gap-space-xs text-on-surface-variant">
                  <svg class="w-4 h-4 text-info flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  <span class="font-body-md text-body-md">SOC-2 Type II Certified</span>
                </div>
                <div class="flex items-center gap-space-xs text-on-surface-variant">
                  <svg class="w-4 h-4 text-info flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  <span class="font-body-md text-body-md">ISO 27001 Certified</span>
                </div>
                <div class="flex items-center gap-space-xs text-on-surface-variant">
                  <svg class="w-4 h-4 text-info flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  <span class="font-body-md text-body-md">FIPS 140-3 Cryptography</span>
                </div>
                <div class="flex items-center gap-space-xs text-on-surface-variant">
                  <svg class="w-4 h-4 text-info flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  <span class="font-body-md text-body-md">HIPAA & GDPR Compliant</span>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-space-xl flex flex-col sm:flex-row items-center justify-between gap-space-md text-on-surface-variant border-t border-surface-container">
            <p class="font-caption text-caption">© 2025 Vanguard Workflow Engine Technologies Inc. All rights reserved.</p>
            <div class="flex items-center gap-space-lg">
              <a routerLink="/audit-center" class="font-caption text-caption hover:text-on-surface transition-colors">Privacy Policy</a>
              <a routerLink="/audit-center" class="font-caption text-caption hover:text-on-surface transition-colors">Terms of Service</a>
              <a routerLink="/audit-center" class="font-caption text-caption hover:text-on-surface transition-colors">Security Disclosures</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class LandingComponent {
  protected readonly activeLifecycleTab = signal<'dev' | 'prod'>('dev');
  protected readonly zoomLevel = signal(1.0);
  protected readonly isSimulating = signal(false);

  protected triggerSimulation(): void {
    this.isSimulating.set(true);
    setTimeout(() => {
      this.isSimulating.set(false);
    }, 2000);
  }
}
