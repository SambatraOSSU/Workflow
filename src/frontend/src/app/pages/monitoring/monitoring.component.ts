import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TopbarComponent } from '../../shared/components/topbar/topbar.component';
import { MonitoringService } from '../../core/services/monitoring.service';
import { LiveExecutionRow } from '../../core/models/monitoring.models';

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-surface font-body-md text-on-surface antialiased flex flex-col">
      <!-- Fixed Sidebar -->
      <app-sidebar />

      <div class="pl-0 lg:pl-64 flex flex-col flex-1 min-w-0 transition-all duration-300">
        <!-- Global Topbar -->
        <app-topbar />

        <main class="w-full pt-16 sm:pt-20 bg-surface px-4 sm:px-8 lg:px-10 xl:px-12 flex-1 flex flex-col max-w-7xl 2xl:max-w-[1536px] mx-auto pb-space-4xl min-w-0">
          <!-- Top Page Header Section -->
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg py-space-xl">
            <div class="flex flex-col gap-space-xs">
              <div class="flex items-center gap-space-sm flex-wrap">
                <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  Monitoring & Live Executions Matrix
                </h1>
                <div class="flex items-center gap-space-xs px-2.5 py-1 rounded-full bg-surface-container-high shadow-xs border border-surface-container">
                  <span class="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
                  <span class="font-caption text-caption text-on-surface font-bold tracking-wide uppercase">Cluster Alpha (us-east-1)</span>
                </div>
                <div class="px-2 py-0.5 rounded-full bg-surface-container-high font-caption text-caption text-on-surface-variant font-semibold border border-surface-container">
                  Engine v2.8.4
                </div>
              </div>
              <p class="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                Real-time orchestration throughput, worker cluster telemetry, latency percentiles, and active execution stream.
              </p>
            </div>

            <!-- Header Actions & Controls -->
            <div class="flex items-center gap-space-sm flex-wrap self-start lg:self-auto">
              <!-- Time Range Dropdown -->
              <div class="relative inline-flex items-center bg-surface-container-lowest rounded-lg shadow-xs border border-surface-container">
                <div class="flex items-center gap-2 pl-3 pr-2 py-2 text-on-surface font-label-sm text-label-sm">
                  <svg class="w-4 h-4 text-on-surface-variant shrink-0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <select
                    class="bg-transparent font-label-sm text-label-sm font-semibold text-on-surface outline-none cursor-pointer pr-4 appearance-none"
                    aria-label="Plage temporelle" [ngModel]="timeRange()"
                    (ngModelChange)="timeRange.set($event)"
                  >
                    <option value="15m">Last 15 minutes</option>
                    <option value="1h">Last 1 hour</option>
                    <option value="24h">Last 24 hours</option>
                  </select>
                  <svg class="w-3.5 h-3.5 text-on-surface-variant pointer-events-none -ml-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>

              <!-- Auto Refresh Toggle Indicator -->
              <div class="flex items-center gap-2 px-3 py-2 bg-surface-container-lowest rounded-lg shadow-xs border border-surface-container">
                <svg class="w-4 h-4 text-success animate-spin" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" style="animation-duration: 4s;" viewBox="0 0 24 24">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19"></path>
                </svg>
                <div class="flex items-center gap-1.5 font-label-sm text-label-sm">
                  <span class="font-bold text-on-surface">Auto</span>
                  <span class="px-1.5 py-0.5 rounded bg-surface-container font-caption text-caption text-on-surface-variant font-mono">5s</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <button
                type="button"
                (click)="togglePause()"
                [class]="isPaused() ? 'flex items-center gap-2 bg-warning text-noir-text px-space-md py-2 rounded-lg font-label-md text-label-md font-bold transition-all shadow-sm cursor-pointer' : 'flex items-center gap-2 bg-primary-container text-pure-white px-space-md py-2 rounded-lg font-label-md text-label-md font-semibold hover:bg-primary transition-all shadow-sm active:scale-[0.98] cursor-pointer'"
              >
                <svg class="w-4 h-4 text-secondary-container" fill="currentColor" viewBox="0 0 24 24">
                  <rect height="14" rx="1" width="4" x="6" y="5"></rect>
                  <rect height="14" rx="1" width="4" x="14" y="5"></rect>
                </svg>
                <span>{{ isPaused() ? 'Resume Ingestion' : 'Pause Ingestion' }}</span>
              </button>

              <button
                type="button"
                (click)="simulateSpike()"
                class="flex items-center gap-2 bg-surface-container-lowest text-on-surface px-space-md py-2 rounded-lg font-label-md text-label-md font-semibold hover:bg-surface-container transition-all shadow-xs border border-surface-container cursor-pointer"
              >
                <svg class="w-4 h-4 text-secondary" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                <span>Simulate Spike</span>
              </button>
            </div>
          </div>

          <!-- KPI Overview 4-Column Row -->
          @if (metrics(); as m) {
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-lg mb-space-2xl">
              <!-- Card 1: Active Executions -->
              <div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-surface-container">
                <div class="flex items-start justify-between">
                  <div class="flex flex-col">
                    <span class="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Live Active Executions</span>
                    <div class="flex items-baseline gap-space-sm mt-1">
                      <span class="font-display text-display text-on-surface font-extrabold tracking-tight">{{ m.activeExecutionsCount | number }}</span>
                      <span class="font-caption text-caption text-on-surface-variant font-medium">runs</span>
                    </div>
                  </div>
                  <div class="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container">
                    <svg class="w-5 h-5 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                  </div>
                </div>
                <div class="mt-space-md pt-space-sm flex items-center justify-between border-t border-surface-container">
                  <div class="flex items-center gap-1.5 font-caption text-caption text-success font-semibold">
                    <svg class="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                    <span>+8.4% vs 1h ago</span>
                  </div>
                  <!-- Sparkline mini visualization -->
                  <svg class="w-24 h-6 text-success" fill="none" viewBox="0 0 96 24">
                    <path d="M2 18 L16 16 L28 19 L42 12 L56 14 L70 8 L84 10 L94 4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                    <circle cx="94" cy="4" fill="currentColor" r="2.5"></circle>
                  </svg>
                </div>
              </div>

              <!-- Card 2: Latency Percentile -->
              <div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow border border-surface-container">
                <div class="flex items-start justify-between">
                  <div class="flex flex-col">
                    <span class="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">P99 Execution Latency</span>
                    <div class="flex items-baseline gap-space-sm mt-1">
                      <span class="font-display text-display text-on-surface font-extrabold tracking-tight">{{ m.p99LatencyMs | number:'1.0-0' }}<span class="font-headline-md text-headline-md font-semibold text-on-surface-variant ml-0.5">ms</span></span>
                    </div>
                  </div>
                  <div class="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container">
                    <svg class="w-5 h-5 text-on-primary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 6v6l4 2"></path>
                    </svg>
                  </div>
                </div>
                <div class="mt-space-md pt-space-sm flex items-center justify-between border-t border-surface-container">
                  <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container font-caption text-caption text-success font-bold">
                    <span class="w-2 h-2 rounded-full bg-success"></span>
                    <span>Target &lt; 350ms (Healthy)</span>
                  </div>
                  <span class="font-caption text-caption text-on-surface-variant font-mono">P50: {{ m.p50LatencyMs }}ms</span>
                </div>
              </div>

              <!-- Card 3: Throughput -->
              <div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow border border-surface-container">
                <div class="flex items-start justify-between">
                  <div class="flex flex-col">
                    <span class="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Throughput / Sec</span>
                    <div class="flex items-baseline gap-space-sm mt-1">
                      <span class="font-display text-display text-on-surface font-extrabold tracking-tight">{{ m.throughputStepsPerSec | number }}</span>
                      <span class="font-caption text-caption text-on-surface-variant font-medium">steps/s</span>
                    </div>
                  </div>
                  <div class="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary-container">
                    <svg class="w-5 h-5 text-secondary-container" fill="currentColor" viewBox="0 0 24 24">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                  </div>
                </div>
                <div class="mt-space-md pt-space-sm flex items-center justify-between border-t border-surface-container">
                  <span class="font-caption text-caption text-on-surface font-semibold">{{ m.activeWorkerNodes }} active worker nodes</span>
                  <span class="font-caption text-caption text-on-surface-variant font-mono">Peak: 2,100/s</span>
                </div>
              </div>

              <!-- Card 4: Error Rate -->
              <div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow border border-surface-container">
                <div class="flex items-start justify-between">
                  <div class="flex flex-col">
                    <span class="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Failure / Error Rate</span>
                    <div class="flex items-baseline gap-space-sm mt-1">
                      <span class="font-display text-display text-on-surface font-extrabold tracking-tight">{{ m.failureErrorRatePercent }}%</span>
                      <span class="font-caption text-caption text-on-surface-variant font-medium">run error</span>
                    </div>
                  </div>
                  <div class="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-warning">
                    <svg class="w-5 h-5 text-warning" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" x2="12" y1="9" y2="13"></line>
                      <line x1="12" x2="12.01" y1="17" y2="17"></line>
                    </svg>
                  </div>
                </div>
                <div class="mt-space-md pt-space-sm flex items-center justify-between border-t border-surface-container">
                  <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-container/20 font-caption text-caption text-secondary font-bold">
                    <svg class="w-3 h-3 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                    </svg>
                    <span>{{ m.pendingRetriesCount }} pending retries</span>
                  </div>
                  <span class="font-caption text-caption text-on-surface-variant font-mono">5 failed / 12.4k</span>
                </div>
              </div>
            </div>
          }

          <!-- Telemetry Middle Section (60% Orchestration Pipeline + 40% Worker Pools) -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-2xl">
            <!-- Left (col-span-8): Stage Latency & Pipeline Flow -->
            <div class="lg:col-span-7 xl:col-span-8 bg-surface-container-lowest rounded-xl p-space-xl shadow-sm flex flex-col justify-between border border-surface-container">
              <div class="flex items-center justify-between pb-space-md border-b border-surface-container">
                <div class="flex flex-col">
                  <span class="font-headline-sm text-headline-sm font-bold text-on-surface">Active Orchestration Pipeline & Step Latency</span>
                  <span class="font-caption text-caption text-on-surface-variant">Cumulative latency distribution along execution graph stages</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container font-caption text-caption text-on-surface font-mono font-semibold">
                    <span class="w-2 h-2 rounded-full bg-secondary-container"></span>
                    Avg: 242ms End-to-End
                  </span>
                </div>
              </div>

              <!-- Stage Graph Node Timeline Visualization -->
              <div class="relative py-space-lg my-auto">
                <!-- Flow Connectors (SVG background) -->
                <div class="hidden md:block absolute top-1/2 left-8 right-8 -translate-y-1/2 -z-0">
                  <svg class="w-full h-8" fill="none" preserveAspectRatio="none" viewBox="0 0 600 32">
                    <path d="M0 16 H600" stroke="currentColor" class="text-surface-container-highest" stroke-dasharray="6 6" stroke-width="3"></path>
                    <path d="M0 16 H360" stroke="currentColor" class="text-success" stroke-width="3"></path>
                  </svg>
                </div>

                <!-- Stages Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-space-md relative z-10">
                  @for (stage of stageLatencies(); track stage.stageNumber) {
                    <div class="bg-surface-container-low rounded-lg p-space-md flex flex-col justify-between shadow-xs hover:bg-surface-container transition-colors border border-surface-container" [class.bg-surface-container-lowest]="stage.status === 'Running'" [class.shadow-md]="stage.status === 'Running'">
                      <div class="flex items-center justify-between mb-2">
                        <span class="w-6 h-6 rounded-full font-caption text-caption flex items-center justify-center font-bold" [class]="stage.status === 'Running' ? 'bg-secondary-container text-noir-text' : 'bg-primary-container text-pure-white'">
                          {{ stage.stageNumber }}
                        </span>
                        <span class="px-1.5 py-0.5 rounded font-caption text-[11px] font-bold" [class]="stage.status === 'OK' ? 'bg-success/20 text-success' : (stage.status === 'Running' ? 'bg-secondary-container text-noir-text animate-pulse' : 'bg-surface-container-high text-on-surface-variant')">
                          {{ stage.status }}
                        </span>
                      </div>
                      <span class="font-label-sm text-label-sm font-bold text-on-surface">{{ stage.stageName }}</span>
                      <span class="font-caption text-caption text-on-surface-variant">{{ stage.stageDescription }}</span>
                      <div class="mt-3 pt-2 flex items-baseline justify-between border-t border-surface-container">
                        <span class="font-caption text-caption text-on-surface-variant">P95 Latency</span>
                        <span class="font-label-sm text-label-sm font-bold font-mono" [class]="stage.status === 'Running' ? 'text-secondary' : 'text-on-surface'">
                          {{ stage.latencyMs }}ms
                        </span>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Real-time Step Latency Percentiles Bar Visualization -->
              <div class="mt-space-md pt-space-md bg-surface-container-low p-space-md rounded-lg border border-surface-container">
                <div class="flex items-center justify-between text-caption font-caption mb-2">
                  <span class="font-semibold text-on-surface">Latency Budget Allocation (Total: 242ms / 350ms Max SLA)</span>
                  <span class="font-mono text-success font-bold">69.1% SLA Consumed</span>
                </div>
                <div class="w-full h-3 bg-surface-container rounded-full overflow-hidden flex">
                  <div class="bg-primary-container h-full" style="width: 5%;" title="Ingest: 12ms (5%)"></div>
                  <div class="bg-surface-tint h-full" style="width: 18%;" title="Policy: 45ms (18%)"></div>
                  <div class="bg-secondary-container h-full" style="width: 74%;" title="Worker: 180ms (74%)"></div>
                  <div class="bg-success h-full" style="width: 3%;" title="Sink: 5ms (3%)"></div>
                </div>
                <div class="flex items-center gap-space-lg mt-2 text-caption font-caption text-on-surface-variant flex-wrap">
                  <div class="flex items-center gap-1"><span class="w-2 h-2 rounded bg-primary-container"></span><span>Ingest (12ms)</span></div>
                  <div class="flex items-center gap-1"><span class="w-2 h-2 rounded bg-surface-tint"></span><span>Policy (45ms)</span></div>
                  <div class="flex items-center gap-1"><span class="w-2 h-2 rounded bg-secondary-container"></span><span>Worker (180ms)</span></div>
                  <div class="flex items-center gap-1"><span class="w-2 h-2 rounded bg-success"></span><span>Sink (5ms)</span></div>
                </div>
              </div>
            </div>

            <!-- Right (col-span-4): Worker Node Pool Health -->
            <div class="lg:col-span-5 xl:col-span-4 bg-surface-container-lowest rounded-xl p-space-xl shadow-sm flex flex-col justify-between border border-surface-container">
              <div class="flex items-center justify-between pb-space-md border-b border-surface-container">
                <div class="flex flex-col">
                  <span class="font-headline-sm text-headline-sm font-bold text-on-surface">Worker Node Pools</span>
                  <span class="font-caption text-caption text-on-surface-variant">Cluster capacity & resource consumption</span>
                </div>
              </div>

              <div class="flex flex-col gap-space-md my-auto">
                @for (pool of workerPools(); track pool.poolName) {
                  <div class="p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors border border-surface-container">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-primary-container" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <rect height="8" rx="2" ry="2" width="20" x="2" y="2"></rect>
                          <rect height="8" rx="2" ry="2" width="20" x="2" y="14"></rect>
                          <line x1="6" x2="6.01" y1="6" y2="6"></line>
                          <line x1="6" x2="6.01" y1="18" y2="18"></line>
                        </svg>
                        <span class="font-label-sm text-label-sm font-bold text-on-surface">{{ pool.poolName }}</span>
                      </div>
                      <span class="px-2 py-0.5 rounded-full font-caption text-[11px] font-bold" [class]="pool.isElevated ? 'bg-warning/20 text-warning' : (pool.status === 'Optimal' ? 'bg-success/15 text-success' : 'bg-surface-container-high text-on-surface-variant')">
                        {{ pool.status }}
                      </span>
                    </div>
                    <div class="font-caption text-caption text-on-surface-variant mb-2">
                      {{ pool.provisionedNodes }} nodes provisioned • Region {{ pool.region }}
                    </div>

                    <!-- CPU & RAM bars -->
                    <div class="space-y-1.5">
                      <div>
                        <div class="flex justify-between font-caption text-caption text-on-surface-variant">
                          <span>CPU Load</span>
                          <span class="font-mono font-bold" [class]="pool.cpuLoadPercent > 80 ? 'text-warning' : 'text-on-surface'">{{ pool.cpuLoadPercent }}%</span>
                        </div>
                        <div class="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                          <div class="h-full rounded-full" [class]="pool.cpuLoadPercent > 80 ? 'bg-warning' : 'bg-success'" [style.width.%]="pool.cpuLoadPercent"></div>
                        </div>
                      </div>
                      <div>
                        <div class="flex justify-between font-caption text-caption text-on-surface-variant">
                          <span>Memory Usage</span>
                          <span class="font-mono font-bold" [class]="pool.ramUsagePercent > 80 ? 'text-warning' : 'text-on-surface'">{{ pool.ramUsagePercent }}%</span>
                        </div>
                        <div class="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                          <div class="h-full rounded-full" [class]="pool.ramUsagePercent > 80 ? 'bg-warning' : 'bg-info'" [style.width.%]="pool.ramUsagePercent"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Live Execution Matrix Table Section -->
          <div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col border border-surface-container">
            <!-- Filter Bar Header -->
            <div class="p-space-lg flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md bg-surface-container-low/50 border-b border-surface-container">
              <div class="flex items-center gap-space-md flex-1 max-w-2xl">
                <!-- Search Field -->
                <div class="relative flex-1">
                  <svg class="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
                  </svg>
                  <input
                    class="w-full h-10 pl-9 pr-4 rounded-lg bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container shadow-xs border border-surface-container"
                    placeholder="Filter by Instance ID, Workflow hash, or Step..." aria-label="Filtrer les exécutions en direct"
                    type="text"
                    [ngModel]="searchTerm()"
                    (ngModelChange)="onSearchChange($event)"
                  />
                </div>
                <!-- Status Filter Dropdown -->
                <div class="relative">
                  <select
                    class="h-10 pl-3 pr-8 rounded-lg bg-surface-container-lowest font-label-sm text-label-sm text-on-surface outline-none cursor-pointer appearance-none shadow-xs border border-surface-container"
                    aria-label="Filtrer par statut d'exécution" [ngModel]="statusFilter()"
                    (ngModelChange)="onStatusFilterChange($event)"
                  >
                    <option value="all">Status: All ({{ liveRows().length }})</option>
                    <option value="running">Running</option>
                    <option value="retrying">Retrying</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                  <svg class="w-4 h-4 text-on-surface-variant absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Execution Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse" aria-label="Matrice des exécutions en direct">
                <thead>
                  <tr class="bg-surface-container-low text-on-surface font-caption text-caption uppercase tracking-wider font-bold border-b border-surface-container">
                    <th scope="col" class="py-space-md px-space-md">Instance ID & Title</th>
                    <th scope="col" class="py-space-md px-space-md">Workflow Hash</th>
                    <th scope="col" class="py-space-md px-space-md">Current Stage / Step</th>
                    <th scope="col" class="py-space-md px-space-md">Step Latency</th>
                    <th scope="col" class="py-space-md px-space-md">Total Duration</th>
                    <th scope="col" class="py-space-md px-space-md">Worker Node</th>
                    <th scope="col" class="py-space-md px-space-md">Status</th>
                    <th scope="col" class="py-space-md px-space-md text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="font-body-md text-body-md text-on-surface divide-y divide-surface-container">
                  @for (row of filteredRows(); track row.instanceId) {
                    <tr class="hover:bg-surface-container-low transition-colors">
                      <td class="py-space-md px-space-md">
                        <div class="flex items-center gap-space-sm">
                          @if (row.status === 'running') {
                            <span class="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse shrink-0"></span>
                          } @else if (row.status === 'completed') {
                            <span class="w-2.5 h-2.5 rounded-full bg-success shrink-0"></span>
                          } @else if (row.status === 'retrying') {
                            <span class="w-2.5 h-2.5 rounded-full bg-warning shrink-0"></span>
                          } @else {
                            <span class="w-2.5 h-2.5 rounded-full bg-error shrink-0"></span>
                          }
                          <div class="flex flex-col">
                            <span class="font-label-md text-label-md font-bold text-primary font-mono">{{ row.instanceId }}</span>
                            <span class="font-label-sm text-label-sm text-on-surface font-medium">{{ row.workflowTitle }}</span>
                          </div>
                        </div>
                      </td>
                      <td class="py-space-md px-space-md font-mono text-caption text-on-surface-variant">
                        {{ row.workflowHash }}
                      </td>
                      <td class="py-space-md px-space-md font-label-sm text-label-sm text-primary font-semibold">
                        {{ row.currentStep }}
                      </td>
                      <td class="py-space-md px-space-md font-mono text-label-sm font-bold text-primary">
                        {{ row.stepLatencyMs }}ms
                      </td>
                      <td class="py-space-md px-space-md font-mono text-label-sm text-on-surface-variant">
                        {{ row.totalDurationMs }}ms
                      </td>
                      <td class="py-space-md px-space-md font-mono text-caption text-on-surface-variant">
                        {{ row.workerNode }}
                      </td>
                      <td class="py-space-md px-space-md">
                        @if (row.status === 'running') {
                          <span class="px-2.5 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-caption text-caption font-bold flex items-center gap-1 w-fit">
                            <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span> Running
                          </span>
                        } @else if (row.status === 'completed') {
                          <span class="px-2.5 py-0.5 rounded-full bg-success/15 text-success font-caption text-caption font-bold flex items-center gap-1 w-fit">
                            <span class="w-1.5 h-1.5 rounded-full bg-success"></span> Completed
                          </span>
                        } @else if (row.status === 'retrying') {
                          <span class="px-2.5 py-0.5 rounded-full bg-warning/20 text-warning font-caption text-caption font-bold flex items-center gap-1 w-fit">
                            <span class="w-1.5 h-1.5 rounded-full bg-warning"></span> Retrying
                          </span>
                        } @else {
                          <span class="px-2.5 py-0.5 rounded-full bg-error/15 text-error font-caption text-caption font-bold flex items-center gap-1 w-fit">
                            <span class="w-1.5 h-1.5 rounded-full bg-error"></span> Failed
                          </span>
                        }
                      </td>
                      <td class="py-space-md px-space-md text-right">
                        <button
                          type="button"
                          class="p-1.5 rounded-lg hover:bg-surface-container-highest text-primary transition-colors cursor-pointer"
                          title="Inspect Execution Trace" aria-label="Inspecter la trace d'exécution"
                        >
                          <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Table Footer -->
            <div class="p-space-md bg-surface-container-low flex items-center justify-between font-caption text-caption text-on-surface-variant border-t border-surface-container">
              <span>Showing <strong>{{ filteredRows().length }}</strong> live streaming executions</span>
              <span>Cluster Feed: Synchronized via WebSockets & gRPC Stream</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  `
})
export class MonitoringComponent implements OnInit, OnDestroy {
  private readonly monitoringService = inject(MonitoringService);

  protected readonly metrics = this.monitoringService.metrics;
  protected readonly stageLatencies = this.monitoringService.stageLatencies;
  protected readonly workerPools = this.monitoringService.workerPools;
  protected readonly liveRows = this.monitoringService.liveRows;
  protected readonly isPaused = this.monitoringService.isIngestionPaused;

  protected readonly timeRange = signal('1h');
  protected readonly statusFilter = signal('all');
  protected readonly searchTerm = signal('');

  private refreshInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.loadAll();
    this.refreshInterval = setInterval(() => {
      if (!this.isPaused()) {
        this.monitoringService.loadClusterMetrics().subscribe();
      }
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  private loadAll(): void {
    this.monitoringService.loadClusterMetrics().subscribe();
    this.monitoringService.loadStageLatencies().subscribe();
    this.monitoringService.loadWorkerPools().subscribe();
    this.monitoringService.loadLiveExecutions().subscribe();
  }

  protected onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.monitoringService.loadLiveExecutions(this.statusFilter(), undefined, term).subscribe();
  }

  protected onStatusFilterChange(status: string): void {
    this.statusFilter.set(status);
    this.monitoringService.loadLiveExecutions(status, undefined, this.searchTerm()).subscribe();
  }

  protected filteredRows(): LiveExecutionRow[] {
    return this.liveRows();
  }

  protected togglePause(): void {
    this.monitoringService.togglePauseIngestion();
  }

  protected simulateSpike(): void {
    this.monitoringService.simulateSpike();
  }
}
