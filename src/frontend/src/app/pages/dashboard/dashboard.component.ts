import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TopbarComponent } from '../../shared/components/topbar/topbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, SidebarComponent, TopbarComponent],
  template: `
    <div class="min-h-screen bg-background font-body text-body text-on-surface antialiased flex flex-col">
      <!-- Fixed Sidebar -->
      <app-sidebar />

      <!-- App Shell Header & Main Content -->
      <div class="pl-0 lg:pl-64 flex flex-col flex-1 min-w-0 transition-all duration-300">
        <app-topbar />

        <main class="w-full pt-16 sm:pt-20 bg-surface px-4 sm:px-8 lg:px-10 xl:px-12 pb-space-4xl flex-1 max-w-7xl 2xl:max-w-[1536px] mx-auto min-w-0">
          <div class="flex flex-col w-full space-y-space-xl pt-space-lg">
            
            <!-- 1. Executive Header Bar -->
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
              <div class="flex flex-col">
                <div class="flex items-center gap-space-sm mb-1">
                  <span class="px-2.5 py-0.5 rounded-full bg-primary-container text-pure-white text-[11px] uppercase tracking-wider font-semibold">
                    Mission Control
                  </span>
                  <span class="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                  <span class="text-xs text-on-surface-variant font-medium">Orchestration Cluster Alpha</span>
                </div>
                <h1 class="text-3xl font-extrabold text-on-surface tracking-tight">Executive Command Center</h1>
                <p class="text-sm text-on-surface-variant mt-0.5">Supervision et orchestration en temps réel sur l'ensemble des processus de l'organisation.</p>
              </div>

              <!-- Filter Controls & Actions -->
              <div class="flex flex-wrap items-center gap-space-sm">
                <div class="relative">
                  <select
                    aria-label="Département"
                    [value]="selectedDepartment()"
                    (change)="onDepartmentChange($event)"
                    class="h-10 pl-3.5 pr-9 rounded-lg bg-surface-container-lowest text-on-surface text-sm font-semibold shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-container border border-surface-container"
                  >
                    <option value="all">Tous les départements</option>
                    <option value="finance">Finance & CapEx</option>
                    <option value="it">IT Ops & Cloud</option>
                    <option value="secops">SecOps & IAM</option>
                    <option value="hr">People Ops & HR</option>
                  </select>
                  <svg class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </div>

                <button
                  type="button"
                  (click)="exportReport()"
                  class="h-10 px-space-md rounded-lg bg-primary-container hover:bg-primary text-pure-white text-sm font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary-container"
                >
                  <svg class="w-4 h-4 text-secondary-container" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                  <span>Exporter Métriques (PDF/CSV)</span>
                </button>
              </div>
            </div>

            <!-- Export Toast Notification -->
            @if (showToast()) {
              <div class="fixed bottom-6 right-6 z-50 bg-primary-container text-pure-white px-space-lg py-3 rounded-xl shadow-xl flex items-center gap-3 transition-all animate-bounce">
                <svg class="w-5 h-5 text-secondary-container" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <span class="text-sm font-medium">Rapport d'audit généré : vanguard-exec-metrics.pdf</span>
              </div>
            }

            <!-- 2. Top KPI Cards Grid (6 Metric Cards de la maquette) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-space-md">
              <!-- Card 1: Active Workflows -->
              <div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-surface-container flex flex-col justify-between hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Workflows Actifs</span>
                  <span class="p-1.5 rounded-lg bg-surface-container text-primary-container flex items-center justify-center">
                    <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"></path>
                    </svg>
                  </span>
                </div>
                <div class="my-3">
                  <span class="text-3xl font-extrabold text-on-surface leading-none">48</span>
                </div>
                <div class="flex items-center gap-1 text-xs text-success font-semibold">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                  <span>+3 cette semaine</span>
                </div>
              </div>

              <!-- Card 2: Running Instances -->
              <div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-surface-container flex flex-col justify-between hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Instances en Cours</span>
                  <span class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-info/10 text-info text-[11px] font-bold">
                    <span class="w-1.5 h-1.5 rounded-full bg-info animate-pulse"></span>
                    Live
                  </span>
                </div>
                <div class="my-3">
                  <span class="text-3xl font-extrabold text-on-surface leading-none">1,284</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-on-surface-variant">Intégrité SLA</span>
                  <span class="font-bold text-info">94% On-Track</span>
                </div>
              </div>

              <!-- Card 3: Pending Approvals -->
              <div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-surface-container flex flex-col justify-between hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Tâches & Approbations</span>
                  <span class="px-2 py-0.5 rounded-full bg-secondary-container/20 text-on-secondary-container text-[11px] font-bold">
                    Action Requise
                  </span>
                </div>
                <div class="my-3 flex items-baseline gap-2">
                  <span class="text-3xl font-extrabold text-on-surface leading-none">142</span>
                  <span class="text-xs text-warning font-bold">(14 urgents)</span>
                </div>
                <div class="flex items-center gap-1 text-xs text-on-surface-variant">
                  <svg class="w-4 h-4 text-warning" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9"></circle>
                    <path d="M12 8v4m0 4h.01"></path>
                  </svg>
                  <span>Double signature requise</span>
                </div>
              </div>

              <!-- Card 4: Completed Today -->
              <div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-surface-container flex flex-col justify-between hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Finalisés Aujourd'hui</span>
                  <span class="p-1.5 rounded-lg bg-surface-container text-success flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                  </span>
                </div>
                <div class="my-3">
                  <span class="text-3xl font-extrabold text-on-surface leading-none">3,891</span>
                </div>
                <div class="flex items-center gap-1 text-xs text-success font-semibold">
                  <span>+12.4% vs moyenne</span>
                </div>
              </div>

              <!-- Card 5: SLA Compliance -->
              <div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-surface-container flex flex-col justify-between hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Conformité SLA</span>
                  <span class="p-1.5 rounded-lg bg-surface-container text-success flex items-center justify-center">
                    <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </span>
                </div>
                <div class="my-3">
                  <span class="text-3xl font-extrabold text-success leading-none">99.12%</span>
                </div>
                <div class="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Seuil cible: 98.5%</span>
                  <span class="font-bold text-success">Optimal</span>
                </div>
              </div>

              <!-- Card 6: Failed / Blocked -->
              <div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-surface-container flex flex-col justify-between hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Échecs / Bloqués</span>
                  <span class="px-2 py-0.5 rounded-full bg-error/15 text-error text-[11px] font-bold">
                    Incident Level 1
                  </span>
                </div>
                <div class="my-3">
                  <span class="text-3xl font-extrabold text-error leading-none">7</span>
                </div>
                <div class="flex items-center gap-1 text-xs text-error font-semibold">
                  <span>3 repris automatiquement</span>
                </div>
              </div>
            </div>

            <!-- 3. Throughput & Execution Trend Visualization -->
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-space-lg">
              <!-- Left Chart (2 cols) -->
              <div class="xl:col-span-2 bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-container flex flex-col justify-between">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h2 class="text-base font-bold text-primary">Débit & Exécution des Workflows</h2>
                    <p class="text-xs text-on-surface-variant">Volumes horaires d'exécutions spawnées vs finalisées vs délais SLA.</p>
                  </div>
                  <div class="flex items-center gap-4 text-xs font-semibold">
                    <div class="flex items-center gap-1.5">
                      <span class="w-3 h-3 rounded bg-primary"></span>
                      <span>Exécutions Déclenchées</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <span class="w-3 h-3 rounded bg-secondary-container"></span>
                      <span>Succès Déterministe</span>
                    </div>
                  </div>
                </div>

                <!-- Vector SVG Visual Chart Graph -->
                <div class="relative h-64 w-full pt-4">
                  <svg class="w-full h-full overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="grad-primary" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" class="text-primary-container" stop-color="currentColor" stop-opacity="0.25" />
                        <stop offset="100%" class="text-primary-container" stop-color="currentColor" stop-opacity="0.0" />
                      </linearGradient>
                      <linearGradient id="grad-accent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" class="text-secondary-container" stop-color="currentColor" stop-opacity="0.35" />
                        <stop offset="100%" class="text-secondary-container" stop-color="currentColor" stop-opacity="0.0" />
                      </linearGradient>
                    </defs>

                    <!-- Horizontal Grid lines -->
                    <line x1="0" y1="40" x2="800" y2="40" class="stroke-surface-container" stroke-width="1" stroke-dasharray="4 4" />
                    <line x1="0" y1="90" x2="800" y2="90" class="stroke-surface-container" stroke-width="1" stroke-dasharray="4 4" />
                    <line x1="0" y1="140" x2="800" y2="140" class="stroke-surface-container" stroke-width="1" stroke-dasharray="4 4" />

                    <!-- Area Primary -->
                    <path d="M0,160 Q100,120 200,130 T400,70 T600,90 T800,40 L800,200 L0,200 Z" fill="url(#grad-primary)" />
                    <path d="M0,160 Q100,120 200,130 T400,70 T600,90 T800,40" class="stroke-primary fill-none" stroke-width="3" />

                    <!-- Area Accent -->
                    <path d="M0,180 Q100,140 200,150 T400,90 T600,110 T800,55 L800,200 L0,200 Z" fill="url(#grad-accent)" />
                    <path d="M0,180 Q100,140 200,150 T400,90 T600,110 T800,55" class="stroke-secondary-container fill-none" stroke-width="2.5" />
                  </svg>
                </div>

                <div class="flex items-center justify-between text-xs text-on-surface-variant font-mono pt-4 border-t border-surface-container mt-2">
                  <span>00:00</span>
                  <span>04:00</span>
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                  <span>En Direct</span>
                </div>
              </div>

              <!-- Right Mini Breakdown Card (1 col) -->
              <div class="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-container flex flex-col justify-between">
                <div>
                  <h2 class="text-base font-bold text-primary mb-1">Goulots d'Étranglement & SLAs</h2>
                  <p class="text-xs text-on-surface-variant mb-4">Répartition des temps d'attente par étape humaine.</p>

                  <div class="space-y-4">
                    <div>
                      <div class="flex justify-between text-xs font-semibold mb-1">
                        <span>Dual Sign-off (CFO & CISO)</span>
                        <span class="text-warning font-bold">2.4h moy.</span>
                      </div>
                      <div class="w-full bg-surface-container rounded-full h-2">
                        <div class="bg-secondary-container h-2 rounded-full" style="width: 78%"></div>
                      </div>
                    </div>

                    <div>
                      <div class="flex justify-between text-xs font-semibold mb-1">
                        <span>Revue Budget IT Cloud</span>
                        <span class="text-success font-bold">45m moy.</span>
                      </div>
                      <div class="w-full bg-surface-container rounded-full h-2">
                        <div class="bg-success h-2 rounded-full" style="width: 32%"></div>
                      </div>
                    </div>

                    <div>
                      <div class="flex justify-between text-xs font-semibold mb-1">
                        <span>Validation Hardware YubiKey</span>
                        <span class="text-info font-bold">12m moy.</span>
                      </div>
                      <div class="w-full bg-surface-container rounded-full h-2">
                        <div class="bg-info h-2 rounded-full" style="width: 18%"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="pt-4 border-t border-surface-container mt-4">
                  <a routerLink="/monitoring" class="w-full py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
                    <span>Inspecter la Matrice Live</span>
                    <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <!-- 4. Active Workflows & Priority Tasks Table (Direct from Mockup) -->
            <div class="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container overflow-hidden">
              <div class="px-space-lg py-space-md border-b border-surface-container flex items-center justify-between">
                <div>
                  <h2 class="text-base font-bold text-primary">Tâches Prioritaires en Attente d'Action</h2>
                  <p class="text-xs text-on-surface-variant">Actions humaines requérant une décision sous politique SOX-404 et 4-Eyes.</p>
                </div>
                <a routerLink="/tasks" class="text-xs font-bold text-secondary hover:text-primary flex items-center gap-1 transition-colors">
                  <span>Voir les 14 tâches</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </a>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs" aria-label="Tâches prioritaires en attente d'action">
                  <thead class="bg-surface-container-low text-on-surface-variant uppercase tracking-wider font-semibold border-b border-surface-container">
                    <tr>
                      <th scope="col" class="py-3 px-space-lg">ID Référence</th>
                      <th scope="col" class="py-3 px-space-md">Workflow / Processus</th>
                      <th scope="col" class="py-3 px-space-md">Étape Requise</th>
                      <th scope="col" class="py-3 px-space-md">Priorité</th>
                      <th scope="col" class="py-3 px-space-md">SLA Restant</th>
                      <th scope="col" class="py-3 px-space-md">Consensus</th>
                      <th class="py-3 px-space-lg text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-surface-container font-medium text-on-surface">
                    <tr class="hover:bg-surface transition-colors">
                      <td class="py-3.5 px-space-lg font-mono font-bold text-primary">RUN-2026-00481</td>
                      <td class="py-3.5 px-space-md">Global CapEx & Infrastructure Purchase Approval</td>
                      <td class="py-3.5 px-space-md font-semibold">Executive Dual Sign-off</td>
                      <td class="py-3.5 px-space-md">
                        <span class="px-2 py-0.5 rounded-full bg-error/15 text-error font-bold text-[11px]">Urgent</span>
                      </td>
                      <td class="py-3.5 px-space-md font-mono text-warning font-bold">1h 12m</td>
                      <td class="py-3.5 px-space-md">Four-Eyes (2/2)</td>
                      <td class="py-3.5 px-space-lg text-right">
                        <a routerLink="/tasks" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary-container hover:bg-secondary text-noir-text hover:text-pure-white font-bold transition-all shadow-sm">
                          <span>Revoir</span>
                        </a>
                      </td>
                    </tr>

                    <tr class="hover:bg-surface transition-colors">
                      <td class="py-3.5 px-space-lg font-mono font-bold text-primary">RUN-2026-00479</td>
                      <td class="py-3.5 px-space-md">Security Key Enclave Access / MFA Reset</td>
                      <td class="py-3.5 px-space-md font-semibold">Hardware Key Biometric Verification</td>
                      <td class="py-3.5 px-space-md">
                        <span class="px-2 py-0.5 rounded-full bg-warning/15 text-warning font-bold text-[11px]">High</span>
                      </td>
                      <td class="py-3.5 px-space-md font-mono text-success font-bold">3h 40m</td>
                      <td class="py-3.5 px-space-md">Single Signer</td>
                      <td class="py-3.5 px-space-lg text-right">
                        <a routerLink="/tasks" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-bold transition-all">
                          <span>Traiter</span>
                        </a>
                      </td>
                    </tr>

                    <tr class="hover:bg-surface transition-colors">
                      <td class="py-3.5 px-space-lg font-mono font-bold text-primary">RUN-2026-00474</td>
                      <td class="py-3.5 px-space-md">New Contractor & Employee Onboarding</td>
                      <td class="py-3.5 px-space-md font-semibold">Manager Device & Okta Permission Sign</td>
                      <td class="py-3.5 px-space-md">
                        <span class="px-2 py-0.5 rounded-full bg-info/15 text-info font-bold text-[11px]">Normal</span>
                      </td>
                      <td class="py-3.5 px-space-md font-mono text-on-surface-variant">14h 20m</td>
                      <td class="py-3.5 px-space-md">Manager Approval</td>
                      <td class="py-3.5 px-space-lg text-right">
                        <a routerLink="/tasks" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-bold transition-all">
                          <span>Traiter</span>
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  protected readonly selectedTimeframe = signal('24h');
  protected readonly selectedDepartment = signal('all');
  protected readonly showToast = signal(false);

  protected onTimeframeChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedTimeframe.set(val);
  }

  protected onDepartmentChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedDepartment.set(val);
  }

  protected exportReport(): void {
    this.showToast.set(true);
    setTimeout(() => {
      this.showToast.set(false);
    }, 4000);
  }
}
