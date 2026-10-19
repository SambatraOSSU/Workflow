import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TopbarComponent } from '../../shared/components/topbar/topbar.component';
import { SettingsService } from '../../core/services/settings.service';
import { EngineSettings } from '../../core/models/settings.models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-surface font-body-md text-body-md text-on-surface antialiased flex flex-col">
      <!-- Fixed Sidebar -->
      <app-sidebar />

      <div class="pl-0 lg:pl-64 flex flex-col flex-1 min-w-0 transition-all duration-300">
        <!-- Global Topbar -->
        <app-topbar />

        <main class="w-full pt-16 sm:pt-20 bg-surface px-4 sm:px-6 lg:px-space-xl flex-1 flex flex-col max-w-[1680px] mx-auto pb-space-5xl min-w-0">
          <!-- Interactive Toast Notification Container -->
          @if (toastMessage()) {
            <div class="fixed bottom-6 right-4 sm:right-8 z-50 flex items-center gap-space-md px-space-lg py-space-md bg-primary-container text-pure-white rounded-xl shadow-2xl border border-white/10 transition-all duration-300 transform translate-y-0 opacity-100">
              <div class="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
              </div>
              <div class="flex flex-col pr-space-md">
                <span class="font-label-md text-label-md font-bold text-pure-white">Configuration Synchronized</span>
                <span class="font-caption text-caption text-on-primary-container">{{ toastMessage() }}</span>
              </div>
            </div>
          }

          <!-- Header Section with Breadcrumbs and Actions -->
          <header class="py-space-xl flex flex-col xl:flex-row xl:items-center xl:justify-between gap-space-lg">
            <div class="flex flex-col gap-space-xs">
              <div class="flex items-center gap-space-xs text-on-surface-variant font-caption text-caption uppercase tracking-wider font-semibold">
                <span>Preferences</span>
                <svg class="w-3.5 h-3.5 text-outline" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
                <span class="text-on-surface font-bold">Settings & System Configuration</span>
              </div>
              <h1 class="font-display text-display text-on-surface tracking-tight font-extrabold">Settings & Engine Preferences</h1>
              <p class="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                Configure global cluster parameters, node execution timeouts, cryptographic root identities, zero-trust approvals, and integration telemetry.
              </p>
            </div>

            <!-- Global Actions -->
            <div class="flex items-center gap-space-sm self-start xl:self-center shrink-0">
              <button
                (click)="restoreDefaults()"
                class="flex items-center gap-space-xs px-space-lg py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md font-semibold transition-colors shadow-sm"
              >
                <svg class="w-4 h-4 text-on-surface-variant" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
                <span>Restore Defaults</span>
              </button>
              <button
                (click)="saveChanges()"
                class="flex items-center gap-space-xs px-space-xl py-2.5 rounded-lg bg-secondary-container hover:bg-secondary-fixed-dim text-noir-text font-label-md text-label-md font-bold transition-all shadow-md active:scale-95"
              >
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                <span>Save All Changes</span>
              </button>
            </div>
          </header>

          <!-- Horizontal Sub-Navigation Tabs -->
          <nav class="flex items-center gap-space-xs overflow-x-auto pb-space-sm mb-space-2xl bg-surface-container-low p-1.5 rounded-xl">
            <button
              (click)="activeTab.set('general')"
              [class.bg-primary]="activeTab() === 'general'"
              [class.text-pure-white]="activeTab() === 'general'"
              [class.text-on-surface-variant]="activeTab() !== 'general'"
              class="flex items-center gap-space-xs px-space-md py-2 rounded-lg font-label-md text-label-md font-medium transition-all shrink-0"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                <rect height="18" rx="2" width="16" x="4" y="3"></rect>
                <path d="M9 9h6"></path>
                <path d="M9 13h6"></path>
                <path d="M9 17h6"></path>
              </svg>
              <span>General & Org</span>
            </button>

            <button
              (click)="activeTab.set('engine')"
              [class.bg-primary]="activeTab() === 'engine'"
              [class.text-pure-white]="activeTab() === 'engine'"
              [class.text-on-surface-variant]="activeTab() !== 'engine'"
              class="flex items-center gap-space-xs px-space-md py-2 rounded-lg font-label-md text-label-md font-semibold shadow-sm shrink-0"
            >
              <svg class="w-4 h-4 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                <rect height="12" rx="2" width="16" x="4" y="6"></rect>
                <path d="M4 10h16"></path>
                <path d="M9 14h2"></path>
                <path d="M14 14h1"></path>
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <path d="M8 18v4"></path>
                <path d="M16 18v4"></path>
              </svg>
              <span>Execution Engine & SLA</span>
              <span class="w-2 h-2 rounded-full bg-secondary-container"></span>
            </button>

            <button
              (click)="activeTab.set('security')"
              [class.bg-primary]="activeTab() === 'security'"
              [class.text-pure-white]="activeTab() === 'security'"
              [class.text-on-surface-variant]="activeTab() !== 'security'"
              class="flex items-center gap-space-xs px-space-md py-2 rounded-lg font-label-md text-label-md font-medium transition-all shrink-0"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <circle cx="12" cy="11" r="2"></circle>
                <path d="M12 13v3"></path>
              </svg>
              <span>Security & Cryptography</span>
            </button>

            <button
              (click)="activeTab.set('integrations')"
              [class.bg-primary]="activeTab() === 'integrations'"
              [class.text-pure-white]="activeTab() === 'integrations'"
              [class.text-on-surface-variant]="activeTab() !== 'integrations'"
              class="flex items-center gap-space-xs px-space-md py-2 rounded-lg font-label-md text-label-md font-medium transition-all shrink-0"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
              <span>Integrations & Webhooks</span>
              <span class="px-1.5 py-0.5 rounded font-caption text-[10px] font-bold bg-success/20 text-success">3 Active</span>
            </button>

            <button
              (click)="activeTab.set('audit')"
              [class.bg-primary]="activeTab() === 'audit'"
              [class.text-pure-white]="activeTab() === 'audit'"
              [class.text-on-surface-variant]="activeTab() !== 'audit'"
              class="flex items-center gap-space-xs px-space-md py-2 rounded-lg font-label-md text-label-md font-medium transition-all shrink-0"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="m9 15 2 2 4-4"></path>
              </svg>
              <span>Audit & Compliance Rules</span>
            </button>
          </nav>

          <!-- Cluster Status Banner Card -->
          <section class="mb-space-2xl bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div class="flex items-center gap-space-md">
              <div class="w-12 h-12 rounded-xl bg-primary-container text-secondary-container flex items-center justify-center shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div class="flex flex-col">
                <div class="flex items-center gap-space-xs">
                  <span class="font-headline-sm text-headline-sm text-on-surface font-bold">Execution Engine Mode: {{ formSettings().clusterMode }}</span>
                  <span class="px-space-sm py-0.5 rounded-full font-caption text-caption font-bold bg-success/15 text-success">Active • {{ formSettings().clusterVersion }}</span>
                </div>
                <p class="font-body-md text-body-md text-on-surface-variant">Cluster consensus synchronized across {{ formSettings().availabilityZonesCount }} Availability Zones. Auto-failover healthy.</p>
              </div>
            </div>
            <div class="flex items-center gap-space-xl text-right">
              <div class="flex flex-col">
                <span class="font-caption text-caption text-outline uppercase font-semibold">Active Workers</span>
                <span class="font-headline-sm text-headline-sm font-bold text-on-surface">{{ formSettings().activeWorkers | number }} / {{ formSettings().maxWorkers | number }}</span>
              </div>
              <div class="flex flex-col">
                <span class="font-caption text-caption text-outline uppercase font-semibold">Avg Latency</span>
                <span class="font-headline-sm text-headline-sm font-bold text-success">{{ formSettings().avgLatencyMs }} ms</span>
              </div>
            </div>
          </section>

          <!-- 2-Column Responsive Grid Layout -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
            <!-- LEFT COLUMN: Engine Runtime & Cryptography (7 Cols) -->
            <div class="lg:col-span-7 flex flex-col gap-space-xl">
              <!-- Section 1: Engine Runtime & Concurrency Rules -->
              <section class="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm flex flex-col gap-space-lg">
                <div class="flex items-center justify-between pb-space-sm">
                  <div class="flex items-center gap-space-sm">
                    <div class="p-2 rounded-lg bg-surface-container text-primary">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                        <rect height="18" rx="2" width="18" x="3" y="3"></rect>
                        <path d="M7 8h10"></path>
                        <path d="M7 12h10"></path>
                        <path d="M7 16h10"></path>
                      </svg>
                    </div>
                    <div>
                      <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">Engine Runtime & Concurrency Rules</h2>
                      <p class="font-caption text-caption text-on-surface-variant">Limits on pipeline throughput, retry backoff algorithms, and timeout policies.</p>
                    </div>
                  </div>
                  <span class="font-caption text-caption font-semibold px-2.5 py-1 bg-surface-container text-on-surface-variant rounded-md">Realtime Config</span>
                </div>

                <!-- Setting: Timeout -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs">
                  <div class="max-w-md">
                    <label class="font-label-md text-label-md font-bold text-on-surface block" for="wf-timeout">Default Workflow Timeout</label>
                    <span class="font-caption text-caption text-on-surface-variant">Execution abort threshold for hung async branches.</span>
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
                      <label class="font-label-md text-label-md font-bold text-on-surface" for="concurrency-range">Max Concurrency per Tenant</label>
                      <p class="font-caption text-caption text-on-surface-variant">Maximum parallel worker subprocess threads permitted across distributed nodes.</p>
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
                    <span class="font-label-md text-label-md font-bold text-on-surface">Automatic Retry on Transient Node Failure</span>
                    <span class="font-caption text-caption text-on-surface-variant">Executes 3 attempts with truncated exponential jitter before marking DAG execution as degraded.</span>
                  </div>
                  <button
                    (click)="formSettings().automaticRetryEnabled = !formSettings().automaticRetryEnabled"
                    [class.bg-primary]="formSettings().automaticRetryEnabled"
                    [class.bg-surface-container-high]="!formSettings().automaticRetryEnabled"
                    class="w-12 h-6 rounded-full relative p-0.5 transition-colors focus:outline-none shrink-0"
                    role="switch"
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
                      <span class="font-label-md text-label-md font-bold text-on-surface">Strict SLA Breach Predictive Alerting</span>
                      <span class="px-1.5 py-0.5 bg-warning/20 text-noir-text rounded font-caption text-[11px] font-bold">P1 Priority</span>
                    </div>
                    <span class="font-caption text-caption text-on-surface-variant">Broadcast alerts via PagerDuty and incident channels when pipeline reaches 80% of defined SLA threshold.</span>
                  </div>
                  <button
                    (click)="formSettings().strictSlaBreachAlerting = !formSettings().strictSlaBreachAlerting"
                    [class.bg-primary]="formSettings().strictSlaBreachAlerting"
                    [class.bg-surface-container-high]="!formSettings().strictSlaBreachAlerting"
                    class="w-12 h-6 rounded-full relative p-0.5 transition-colors focus:outline-none shrink-0"
                    role="switch"
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

              <!-- Section 2: Cryptographic Enclave & Signatures -->
              <section class="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm flex flex-col gap-space-lg">
                <div class="flex items-center justify-between pb-space-sm">
                  <div class="flex items-center gap-space-sm">
                    <div class="p-2 rounded-lg bg-surface-container text-primary">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        <circle cx="12" cy="11" r="2"></circle>
                        <path d="M12 13v3"></path>
                      </svg>
                    </div>
                    <div>
                      <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">Cryptographic Enclave & Signatures</h2>
                      <p class="font-caption text-caption text-on-surface-variant">Hardware Security Module (HSM) attestation and cryptographic pipeline state validation.</p>
                    </div>
                  </div>
                  <span class="flex items-center gap-1 font-caption text-caption font-bold px-2.5 py-1 bg-success/15 text-success rounded-md">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                      <path d="m9 12 2 2 4-4"></path>
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                    FIPS 140-3 Validated
                  </span>
                </div>

                <!-- Setting: Algorithm Select -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                  <div class="max-w-md">
                    <label class="font-label-md text-label-md font-bold text-on-surface block">Default Signature Algorithm</label>
                    <span class="font-caption text-caption text-on-surface-variant">Applied to every step execution checksum in the tamper-proof ledger.</span>
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

                <!-- Setting: HSM Key Rotation Radio Group -->
                <div class="flex flex-col gap-space-xs pt-space-xs">
                  <label class="font-label-md text-label-md font-bold text-on-surface">HSM Root Master Key Rotation Cadence</label>
                  <p class="font-caption text-caption text-on-surface-variant mb-space-xs">Governs autonomous rotation of asymmetric master wrapping keys in AWS CloudHSM.</p>
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
                        <span class="font-label-md text-label-md font-bold text-on-surface">Every 30 Days</span>
                        <span class="font-caption text-caption text-on-surface-variant">Strict Defense</span>
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
                        <span class="font-label-md text-label-md font-bold text-on-surface">Every 90 Days</span>
                        <span class="font-caption text-caption text-secondary font-bold">SOC-2 Default</span>
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
                        <span class="font-label-md text-label-md font-bold text-on-surface">Manual Trigger</span>
                        <span class="font-caption text-caption text-on-surface-variant">Admin Signed</span>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Setting: Batch Interval Dropdown -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs">
                  <div class="max-w-md">
                    <label class="font-label-md text-label-md font-bold text-on-surface block">Merkle Tree Batch Interval</label>
                    <span class="font-caption text-caption text-on-surface-variant">Window frequency for writing root hashes to distributed ledger nodes.</span>
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

                <!-- Setting: Public Verification Key Endpoint -->
                <div class="flex flex-col gap-space-xs pt-space-xs">
                  <label class="font-label-md text-label-md font-bold text-on-surface">Public Verification Key Endpoint</label>
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
                      (click)="copyEndpoint(formSettings().publicKeyEndpoint)"
                      class="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-tint/60 hover:bg-surface-tint text-pure-white font-caption text-caption font-semibold transition-all shrink-0"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                        <rect height="13" rx="2" ry="2" width="13" x="9" y="9"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      <span>{{ keyCopied() ? 'Copied!' : 'Copy Key' }}</span>
                    </button>
                  </div>
                </div>
              </section>
            </div>

            <!-- RIGHT COLUMN: Human Approvals, Integrations, & Danger Zone (5 Cols) -->
            <div class="lg:col-span-5 flex flex-col gap-space-xl">
              <!-- Section 3: Human-in-the-Loop & Governance -->
              <section class="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm flex flex-col gap-space-md">
                <div class="flex items-center gap-space-sm pb-space-xs">
                  <div class="p-2 rounded-lg bg-surface-container text-primary">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">Approvals & Delegation</h2>
                    <p class="font-caption text-caption text-on-surface-variant">HITL manual checks, re-auth gates & four-eyes policy.</p>
                  </div>
                </div>

                <!-- Sub Item: MFA on High-Value -->
                <div class="flex items-start justify-between gap-space-md p-space-md rounded-lg bg-surface-container-low">
                  <div class="flex items-start gap-space-sm">
                    <div class="w-8 h-8 rounded-lg bg-primary text-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                        <rect height="11" rx="2" ry="2" width="18" x="3" y="11"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <div class="flex flex-col">
                      <span class="font-label-md text-label-md font-bold text-on-surface">Step-Up MFA for High-Value</span>
                      <span class="font-caption text-caption text-on-surface-variant">Prompt WebAuthn / FIDO2 security token for approvals exceeding $50,000 USD value.</span>
                    </div>
                  </div>
                  <input
                    [(ngModel)]="formSettings().stepUpMfaHighValueEnabled"
                    class="w-5 h-5 mt-1 rounded accent-primary cursor-pointer shrink-0"
                    type="checkbox"
                  />
                </div>

                <!-- Sub Item: Out of Office -->
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
                      <span class="font-label-md text-label-md font-bold text-on-surface">Out-of-Office Routing</span>
                      <span class="font-caption text-caption text-on-surface-variant">Automatically reroute pending workflow review tasks to secondary peer delegates.</span>
                    </div>
                  </div>
                  <input
                    [(ngModel)]="formSettings().outOfOfficeRoutingEnabled"
                    class="w-5 h-5 mt-1 rounded accent-primary cursor-pointer shrink-0"
                    type="checkbox"
                  />
                </div>

                <!-- Sub Item: Four Eyes -->
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
                        <span class="font-label-md text-label-md font-bold text-on-surface">Four-Eyes Principle</span>
                        <span class="px-1.5 py-0.2 bg-primary text-pure-white rounded font-caption text-[10px] font-bold">Mandatory</span>
                      </div>
                      <span class="font-caption text-caption text-on-surface-variant">Requires 2 distinct approvers from separate teams for production pipeline deploys.</span>
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

              <!-- Section 4: Integration Connectors Status -->
              <section class="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm flex flex-col gap-space-md">
                <div class="flex items-center justify-between pb-space-xs">
                  <div class="flex items-center gap-space-sm">
                    <div class="p-2 rounded-lg bg-surface-container text-primary">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                        <path d="m18 16 4-4-4-4"></path>
                        <path d="m6 8-4 4 4 4"></path>
                        <path d="m14.5 4-5 16"></path>
                      </svg>
                    </div>
                    <div>
                      <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">Connected Integrations</h2>
                      <p class="font-caption text-caption text-on-surface-variant">Mission-critical outbound event channels.</p>
                    </div>
                  </div>
                  <button class="font-label-sm text-label-sm text-secondary hover:underline font-bold flex items-center gap-1">
                    <span>Manage All</span>
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </button>
                </div>

                <div class="flex flex-col gap-space-xs">
                  <!-- Connector 1: Slack -->
                  <div class="flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
                    <div class="flex items-center gap-space-md">
                      <div class="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center font-bold text-on-surface">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                      <div class="flex flex-col">
                        <span class="font-label-md text-label-md font-bold text-on-surface">Slack Workflow Bot</span>
                        <span class="font-caption text-caption text-on-surface-variant">3 channels synced (#ops-alerts, #sec-eng, #exec)</span>
                      </div>
                    </div>
                    <div class="flex items-center gap-space-xs text-success">
                      <span class="w-2 h-2 rounded-full bg-success"></span>
                      <span class="font-caption text-caption font-bold">Connected</span>
                    </div>
                  </div>

                  <!-- Connector 2: HashiCorp Vault -->
                  <div class="flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
                    <div class="flex items-center gap-space-md">
                      <div class="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center font-bold text-on-surface">
                        <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M21 2l-2 2m-1-1l-3 3m5 0l-3-3m-3 3l-2 2-4-4-5 5 1.5 1.5L8 10l3 3 2-2"></path>
                          <circle cx="7" cy="17" r="3"></circle>
                        </svg>
                      </div>
                      <div class="flex flex-col">
                        <span class="font-label-md text-label-md font-bold text-on-surface">HashiCorp Vault</span>
                        <span class="font-caption text-caption text-on-surface-variant">v1.14 Enterprise KMS Engine</span>
                      </div>
                    </div>
                    <div class="flex items-center gap-space-xs text-success">
                      <span class="w-2 h-2 rounded-full bg-success"></span>
                      <span class="font-caption text-caption font-bold">Syncing</span>
                    </div>
                  </div>

                  <!-- Connector 3: AWS CloudWatch -->
                  <div class="flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
                    <div class="flex items-center gap-space-md">
                      <div class="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center font-bold text-on-surface">
                        <svg class="w-5 h-5 text-info" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                        </svg>
                      </div>
                      <div class="flex flex-col">
                        <span class="font-label-md text-label-md font-bold text-on-surface">AWS CloudWatch</span>
                        <span class="font-caption text-caption text-on-surface-variant">Direct stream to us-east-1 log group</span>
                      </div>
                    </div>
                    <div class="flex items-center gap-space-xs text-success">
                      <span class="w-2 h-2 rounded-full bg-success"></span>
                      <span class="font-caption text-caption font-bold">Streaming</span>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Section 5: Danger Zone / Emergency Actions -->
              <section class="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm flex flex-col gap-space-md">
                <div class="flex items-center gap-space-sm pb-space-xs">
                  <div class="p-2 rounded-lg bg-error-container text-error">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                      <line x1="12" x2="12" y1="9" y2="13"></line>
                      <line x1="12" x2="12.01" y1="17" y2="17"></line>
                    </svg>
                  </div>
                  <div>
                    <h2 class="font-headline-sm text-headline-sm text-error font-bold">Danger Zone & Cluster Controls</h2>
                    <p class="font-caption text-caption text-on-surface-variant">Destructive operations requiring Root authorization.</p>
                  </div>
                </div>

                <div class="flex flex-col gap-space-sm pt-space-xs">
                  <!-- Action: Flush Cache -->
                  <div class="flex items-center justify-between p-space-md rounded-lg bg-surface-container-low">
                    <div class="flex flex-col">
                      <span class="font-label-md text-label-md font-bold text-on-surface">Flush Engine Redis Cache</span>
                      <span class="font-caption text-caption text-on-surface-variant">Purges ephemeral state for 42 active queues.</span>
                    </div>
                    <button
                      (click)="confirmAction('Flush Cache')"
                      class="px-space-md py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold transition-colors"
                    >
                      Flush
                    </button>
                  </div>

                  <!-- Action: Drain Cluster -->
                  <div class="flex items-center justify-between p-space-md rounded-lg bg-surface-container-low">
                    <div class="flex flex-col">
                      <span class="font-label-md text-label-md font-bold text-on-surface">Drain US-East-1 Cluster</span>
                      <span class="font-caption text-caption text-on-surface-variant">Stop scheduling new tasks; migrate running jobs.</span>
                    </div>
                    <button
                      (click)="confirmAction('Drain Nodes')"
                      class="px-space-md py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold transition-colors"
                    >
                      Drain
                    </button>
                  </div>

                  <!-- Action: Emergency Lockout -->
                  <div class="flex items-center justify-between p-space-md rounded-lg bg-error-container text-on-error-container">
                    <div class="flex flex-col">
                      <span class="font-label-md text-label-md font-bold text-error">Emergency Read-Only Lockout</span>
                      <span class="font-caption text-caption text-on-error-container/80">Immediately freezes all DAG triggers across organization.</span>
                    </div>
                    <button
                      (click)="confirmAction('Emergency Lockout')"
                      class="px-space-md py-1.5 rounded-lg bg-error text-pure-white hover:bg-red-700 font-label-sm text-label-sm font-bold transition-colors shadow-sm"
                    >
                      Initiate
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  private readonly settingsService = inject(SettingsService);

  readonly toastMessage = this.settingsService.toastMessage;
  readonly activeTab = signal<string>('engine');
  readonly keyCopied = signal<boolean>(false);

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

  ngOnInit(): void {
    this.settingsService.loadSettings().subscribe(data => {
      if (data) {
        this.formSettings.set({ ...data });
      }
    });
  }

  saveChanges(): void {
    this.settingsService.updateSettings(this.formSettings()).subscribe();
  }

  restoreDefaults(): void {
    if (confirm('Restore default runtime and SLA configuration values?')) {
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
    if (confirm(`Execute critical administrative action: ${actionName}? This action is recorded in the immutable audit log.`)) {
      this.settingsService.executeDangerAction(actionName, 'Admin manual trigger via Settings panel').subscribe();
    }
  }
}
