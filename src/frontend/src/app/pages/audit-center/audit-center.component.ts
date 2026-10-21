import { Component, ChangeDetectionStrategy, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TopbarComponent } from '../../shared/components/topbar/topbar.component';
import { AuditService } from '../../core/services/audit.service';
import { AuditLedgerEntry, ComplianceCertificate } from '../../core/models/audit.models';

@Component({
  selector: 'app-audit-center',
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

        <main class="w-full pt-16 sm:pt-20 bg-surface px-4 sm:px-8 lg:px-10 xl:px-12 flex-1 flex flex-col max-w-7xl 2xl:max-w-[1536px] mx-auto pb-space-4xl min-w-0">
          <!-- Section 1: Executive Compliance Header -->
          <header class="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-lg pt-space-lg pb-space-2xl">
            <div class="flex flex-col max-w-3xl">
              <div class="flex items-center gap-space-sm mb-space-xs flex-wrap">
                <span class="font-caption text-caption uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-primary-container text-primary-fixed">
                  Enterprise Security Ledger v4.12
                </span>
                <span class="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-success/10 text-success font-caption text-caption font-bold">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                  Cryptographically Sealed
                </span>
              </div>
              <h1 class="font-display text-display text-on-surface tracking-tight font-extrabold mb-space-xs">
                Audit Center & Compliance Engine
              </h1>
              <p class="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
                Immutable cryptographic ledger, SOX-404 and SOC-2 Type II audit trail, state transitions, and executive sign-off verification across cluster operations.
              </p>
              <div class="mt-space-md flex flex-wrap items-center gap-space-md text-on-surface-variant font-caption text-caption">
                <div class="flex items-center gap-1.5 bg-surface-container px-space-sm py-1 rounded">
                  <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                  <span class="font-medium text-on-surface">SHA-256 Merkle Root:</span>
                  <span class="font-mono text-on-surface font-bold">{{ metrics()?.merkleRoot || '0x7f4b8a...c992' }}</span>
                </div>
                <div class="flex items-center gap-1 text-outline">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>Last verification: <strong class="text-on-surface font-medium">{{ metrics()?.lastVerificationSecondsAgo || 32 }} seconds ago</strong> (Sync latency: {{ metrics()?.syncLatencyMs || 12 }}ms)</span>
                </div>
              </div>
            </div>

            <!-- Header Actions -->
            <div class="flex items-center gap-space-sm shrink-0 self-stretch sm:self-auto flex-wrap">
              <button (click)="openExportModal()" class="flex-1 sm:flex-none flex items-center justify-center gap-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold px-space-lg py-2.5 rounded-lg shadow-sm transition-all duration-150 cursor-pointer">
                <svg class="w-4 h-4 text-on-surface" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" x2="12" y1="15" y2="3"></line>
                </svg>
                <span>Export Audit Report</span>
              </button>
              <button (click)="openCertificateModal()" class="flex-1 sm:flex-none flex items-center justify-center gap-space-xs bg-secondary-container hover:bg-secondary-fixed-dim text-noir-text font-label-md text-label-md font-bold px-space-lg py-2.5 rounded-lg shadow-sm transition-all duration-150">
                <svg class="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" viewBox="0 0 24 24">
                  <path d="M12 15l-2 5l4-1l4 1l-2-5"></path>
                  <circle cx="12" cy="9" r="6"></circle>
                  <polyline points="9 9 11 11 15 7"></polyline>
                </svg>
                <span>Generate Compliance Certificate</span>
              </button>
            </div>
          </header>

          <!-- Section 2: 4 KPI Cards -->
          <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg mb-space-2xl">
            <!-- Card 1: Total Ledger Events -->
            <div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-space-md">
                <span class="font-label-sm text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">Total Ledger Events</span>
                <div class="w-9 h-9 rounded-lg bg-primary-container text-pure-white flex items-center justify-center">
                  <svg class="w-5 h-5 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <div class="font-display text-display font-extrabold text-on-surface tracking-tight mb-1">
                  {{ (metrics()?.totalLedgerEvents || 1842910) | number }}
                </div>
                <div class="flex items-center justify-between text-on-surface-variant font-caption text-caption pt-space-xs">
                  <span class="flex items-center gap-1 text-success font-semibold">
                    <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
                    {{ metrics()?.hashIntegrityPercent || 100 }}% Hash Integrity
                  </span>
                  <span class="font-mono text-outline font-medium">Merkle Depth: {{ metrics()?.merkleDepth || 24 }}</span>
                </div>
              </div>
              <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary-container to-primary-container opacity-70"></div>
            </div>

            <!-- Card 2: SOX-404 Duties -->
            <div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-space-md">
                <span class="font-label-sm text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">SOX-404 Duties (SoD)</span>
                <div class="w-9 h-9 rounded-lg bg-surface-container text-primary flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                    <rect height="11" rx="2" ry="2" width="18" x="3" y="11"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
              </div>
              <div>
                <div class="flex items-baseline gap-2 mb-1">
                  <span class="font-display text-display font-extrabold text-on-surface tracking-tight">{{ metrics()?.sox404CompliancePercent || 100 }}%</span>
                  <span class="font-label-sm text-label-sm font-bold text-success uppercase">Compliant</span>
                </div>
                <div class="flex items-center justify-between text-on-surface-variant font-caption text-caption pt-space-xs">
                  <span>Dual-signoff active</span>
                  <span class="font-medium text-on-surface">{{ metrics()?.soxBypassesIn90d || 0 }} bypasses in 90d</span>
                </div>
              </div>
              <div class="absolute bottom-0 left-0 right-0 h-1 bg-success opacity-80"></div>
            </div>

            <!-- Card 3: Privileged Actions (24h) -->
            <div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-space-md">
                <span class="font-label-sm text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">Privileged Actions (24h)</span>
                <div class="w-9 h-9 rounded-lg bg-primary text-pure-white flex items-center justify-center">
                  <svg class="w-5 h-5 text-secondary-fixed" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
              </div>
              <div>
                <div class="flex items-baseline gap-2 mb-1">
                  <span class="font-display text-display font-extrabold text-on-surface tracking-tight">{{ metrics()?.privilegedActions24h || 14 }}</span>
                  <span class="font-caption text-caption text-on-surface-variant">Logged & Audited</span>
                </div>
                <div class="flex items-center justify-between text-on-surface-variant font-caption text-caption pt-space-xs">
                  <span class="text-primary font-semibold">MFA Re-auth: {{ metrics()?.mfaReauthPercent || 100 }}%</span>
                  <span>Justification required</span>
                </div>
              </div>
              <div class="absolute bottom-0 left-0 right-0 h-1 bg-primary-container opacity-80"></div>
            </div>

            <!-- Card 4: Policy Violations -->
            <div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-space-md">
                <span class="font-label-sm text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">Policy Violations</span>
                <div class="w-9 h-9 rounded-lg bg-surface-container text-success flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="M12 8v4"></path>
                    <path d="M12 16h.01"></path>
                  </svg>
                </div>
              </div>
              <div>
                <div class="flex items-baseline gap-2 mb-1">
                  <span class="font-display text-display font-extrabold text-on-surface tracking-tight">{{ metrics()?.policyViolationsCount || 0 }}</span>
                  <span class="font-label-sm text-label-sm font-bold text-success uppercase">Breaches</span>
                </div>
                <div class="flex items-center justify-between text-on-surface-variant font-caption text-caption pt-space-xs">
                  <span class="text-on-surface-variant">Active Enclave Guard</span>
                  <span class="font-semibold text-warning">{{ metrics()?.blockedAtGateCount || 3 }} blocked at gate</span>
                </div>
              </div>
              <div class="absolute bottom-0 left-0 right-0 h-1 bg-success opacity-80"></div>
            </div>
          </section>

          <!-- Section 3: Filter & Compliance Tags Bar -->
          <section class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm mb-space-xl flex flex-col gap-space-md">
            <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
              <!-- Search Input -->
              <div class="relative flex-1 min-w-[280px]">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
                  </svg>
                </div>
                <input
                  [ngModel]="searchQuery()"
                  (ngModelChange)="onSearchChange($event)"
                  class="w-full h-10 pl-10 pr-4 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container focus:ring-2 focus:ring-primary-container transition-all"
                  placeholder="Search Actor, Workflow ID, Instance Hash, or Merkle Leaf..." aria-label="Rechercher dans le registre d'audit"
                  type="text"
                />
              </div>

              <!-- Filter Dropdowns -->
              <div class="flex flex-wrap items-center gap-space-sm">
                <!-- Time Range -->
                <div class="relative">
                  <button class="h-10 px-space-md bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg font-label-sm text-label-sm font-medium flex items-center gap-space-xs transition-colors">
                    <svg class="w-4 h-4 text-outline" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                      <rect height="18" rx="2" ry="2" width="18" x="3" y="4"></rect>
                      <line x1="16" x2="16" y1="2" y2="6"></line>
                      <line x1="8" x2="8" y1="2" y2="6"></line>
                      <line x1="3" x2="21" y1="10" y2="10"></line>
                    </svg>
                    <span>Time: <strong>Last 30 Days</strong></span>
                    <svg class="w-3.5 h-3.5 text-outline" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                </div>

                <!-- Category -->
                <div class="relative">
                  <select
                    aria-label="Filtrer par catégorie d'événement" [ngModel]="selectedCategory()"
                    (ngModelChange)="onCategoryChange($event)"
                    class="h-10 px-space-md bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg font-label-sm text-label-sm font-medium border-0 focus:ring-2 focus:ring-primary-container cursor-pointer"
                  >
                    <option value="All">Category: All</option>
                    <option value="Approval">Executive Approvals</option>
                    <option value="Gate">Workflow Gates</option>
                    <option value="Secret">Vault & Key Rotation</option>
                    <option value="Deploy">Deployments</option>
                    <option value="Blocked">Blocked Policy Alerts</option>
                  </select>
                </div>

                <!-- Reset Filters -->
                <button (click)="resetFilters()" class="h-10 px-3 bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface rounded-lg transition-colors" title="Reset Filters" aria-label="Réinitialiser les filtres">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                    <path d="M3 3v5h5"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Compliance Regulation Tags -->
            <div class="flex items-center gap-space-sm pt-space-xs flex-wrap">
              <span class="font-caption text-caption text-outline font-semibold uppercase tracking-wider mr-1">Compliance Frameworks:</span>
              <button class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-pure-white font-caption text-caption font-bold shadow-sm transition-transform hover:scale-105">
                <svg class="w-3 h-3 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>SOX-404 Active</span>
              </button>
              <button class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-pure-white font-caption text-caption font-bold shadow-sm transition-transform hover:scale-105">
                <svg class="w-3 h-3 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>SOC-2 Type II</span>
              </button>
              <button class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface font-caption text-caption font-medium hover:bg-surface-container-high transition-colors">
                <span>GDPR Article 32</span>
              </button>
              <button class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface font-caption text-caption font-medium hover:bg-surface-container-high transition-colors">
                <span>HIPAA Security Rule</span>
              </button>
              <span class="ml-auto font-caption text-caption text-outline">
                {{ entries().length }} events matched in ledger index
              </span>
            </div>
          </section>

          <!-- Cryptographic Merkle Tree Visualizer Section -->
          <section class="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm mb-space-2xl border border-surface-container">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-md border-b border-surface-container">
              <div class="flex items-center gap-space-sm">
                <div class="w-10 h-10 rounded-lg bg-primary-container text-secondary-container flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="3"></circle>
                    <line x1="12" x2="6" y1="8" y2="14"></line>
                    <line x1="12" x2="18" y1="8" y2="14"></line>
                    <circle cx="6" cy="17" r="3"></circle>
                    <circle cx="18" cy="17" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">Cryptographic Merkle Proof Tree</h2>
                    <span class="px-2 py-0.5 rounded-full bg-success/15 text-success font-caption text-caption font-bold">Tree Depth: {{ metrics()?.merkleDepth || 24 }}</span>
                  </div>
                  <p class="font-caption text-caption text-on-surface-variant">Hierarchical SHA-256 state tree verifying inclusion of all {{ (metrics()?.totalLedgerEvents || 1842910) | number }} immutable blocks without central trust.</p>
                </div>
              </div>
              <button
                type="button"
                (click)="toggleMerkleTree()"
                class="px-space-md py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <span>{{ showMerkleTree() ? 'Collapse Tree' : 'Expand Merkle Proof' }}</span>
                <svg class="w-4 h-4 text-on-surface-variant transition-transform" [class.rotate-180]="showMerkleTree()" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>

            @if (showMerkleTree()) {
              <div class="pt-space-lg flex flex-col gap-space-lg animate-in fade-in">
                <!-- Visual Tree Topology -->
                <div class="p-space-lg rounded-xl bg-surface-container-low flex flex-col items-center gap-space-md border border-surface-container overflow-x-auto">
                  <!-- Root Node -->
                  <div class="flex flex-col items-center">
                    <span class="font-caption text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Merkle Root (Consensus Level)</span>
                    <div class="flex items-center gap-2 px-space-md py-2 rounded-lg bg-primary-container text-pure-white font-mono text-label-sm font-bold shadow-sm">
                      <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                      <span>{{ metrics()?.merkleRoot || '0x7f4b8a4f912e6c88b20141a0279d01217e91ac992' }}</span>
                    </div>
                  </div>

                  <!-- Connector 1 to 2 -->
                  <div class="w-px h-6 bg-surface-container-highest"></div>

                  <!-- Intermediate Branch Nodes (2 Branches) -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-space-xl w-full max-w-2xl">
                    <div class="flex flex-col items-center">
                      <span class="font-caption text-[11px] font-semibold text-on-surface-variant mb-1">Branch Left (Approvals & Identity)</span>
                      <div class="w-full text-center px-space-md py-2 rounded-lg bg-surface-container-lowest font-mono text-caption text-primary font-semibold shadow-xs border border-surface-container">
                        SHA256: 0x3a1be9...88719ac
                      </div>
                    </div>
                    <div class="flex flex-col items-center">
                      <span class="font-caption text-[11px] font-semibold text-on-surface-variant mb-1">Branch Right (Enclave & Policies)</span>
                      <div class="w-full text-center px-space-md py-2 rounded-lg bg-surface-container-lowest font-mono text-caption text-primary font-semibold shadow-xs border border-surface-container">
                        SHA256: 0x7c4d2f...ab90182
                      </div>
                    </div>
                  </div>

                  <!-- Connector 2 to 4 -->
                  <div class="w-px h-6 bg-surface-container-highest"></div>

                  <!-- Leaf Nodes (Recent Blocks) -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md w-full">
                    @for (entry of entries().slice(0, 4); track entry.id) {
                      <div
                        (click)="selectEntry(entry)"
                        class="p-space-sm rounded-lg bg-surface-container-lowest hover:bg-surface-container transition-all cursor-pointer shadow-xs border border-surface-container flex flex-col justify-between"
                        [class.ring-2]="selectedEntry()?.id === entry.id"
                        [class.ring-primary-container]="selectedEntry()?.id === entry.id"
                      >
                        <div class="flex items-center justify-between mb-1">
                          <span class="font-mono text-caption font-bold text-primary">#{{ entry.blockNumber }}</span>
                          <span class="w-1.5 h-1.5 rounded-full" [class.bg-success]="entry.isVerified" [class.bg-error]="!entry.isVerified"></span>
                        </div>
                        <span class="font-label-sm text-caption text-on-surface font-semibold truncate">{{ entry.eventType }}</span>
                        <span class="font-mono text-[11px] text-on-surface-variant truncate mt-1">Leaf: {{ entry.shortHash }}</span>
                      </div>
                    }
                  </div>
                </div>

                <!-- Proof Verification Status Bar -->
                <div class="flex flex-wrap items-center justify-between gap-space-sm px-space-md py-2.5 rounded-lg bg-success/10 text-success font-caption text-caption">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-success shrink-0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span class="font-semibold">Cryptographic Path Consistency: 100% verified across 4,198,203 blocks. Zero tamper anomalies.</span>
                  </div>
                  <span class="font-mono text-on-surface-variant text-[11px]">Last recalculated: {{ metrics()?.lastVerificationSecondsAgo || 32 }}s ago</span>
                </div>
              </div>
            }
          </section>

          <!-- Section 4: Cryptographic Log Table -->
          <div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden mb-space-2xl">
            <div class="px-space-xl py-space-md bg-surface-container-low flex items-center justify-between">
              <div class="flex items-center gap-space-sm">
                <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">Verifiable Cryptographic Log</h2>
                <span class="px-2 py-0.5 rounded bg-surface-container text-on-surface font-caption text-caption font-bold uppercase">Merkle Chain Validated</span>
              </div>
              <div class="flex items-center gap-space-xs text-on-surface-variant font-caption text-caption">
                <svg class="w-3.5 h-3.5 text-success" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                <span>Real-time Consensus Sync</span>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse" aria-label="Registre cryptographique immuable">
                <thead>
                  <tr class="bg-surface-container font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
                    <th scope="col" class="py-3 px-space-xl">Timestamp & Block</th>
                    <th scope="col" class="py-3 px-space-lg">Actor & Credential</th>
                    <th scope="col" class="py-3 px-space-lg">Event Action</th>
                    <th scope="col" class="py-3 px-space-lg">Context / Resource</th>
                    <th scope="col" class="py-3 px-space-lg">Cryptographic Hash</th>
                    <th scope="col" class="py-3 px-space-lg">Framework</th>
                    <th scope="col" class="py-3 px-space-xl text-right">Verification</th>
                  </tr>
                </thead>
                <tbody class="font-body-md text-body-md text-on-surface divide-y-0">
                  @for (entry of pagedEntries(); track entry.id) {
                    <tr
                      (click)="selectEntry(entry)"
                      [class.bg-surface-container-high]="selectedEntry()?.id === entry.id"
                      class="hover:bg-surface-container-high/60 transition-colors cursor-pointer group"
                    >
                      <td class="py-4 px-space-xl whitespace-nowrap">
                        <div class="flex flex-col">
                          <span class="font-mono text-label-sm text-on-surface font-bold">{{ entry.timestampUtc | date:'yyyy-MM-dd HH:mm:ss' }} UTC</span>
                          <span class="font-mono text-caption text-outline font-semibold">Block #{{ entry.blockNumber | number }}</span>
                        </div>
                      </td>
                      <td class="py-4 px-space-lg whitespace-nowrap">
                        <div class="flex items-center gap-2.5">
                          <div class="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-pure-white text-caption font-bold">
                            {{ entry.actorInitials }}
                          </div>
                          <div class="flex flex-col">
                            <span class="font-label-sm text-label-sm font-bold text-on-surface">{{ entry.actorEmail }}</span>
                            <span class="font-caption text-caption text-secondary font-semibold">{{ entry.actorRole }}</span>
                          </div>
                        </div>
                      </td>
                      <td class="py-4 px-space-lg whitespace-nowrap">
                        <span
                          [ngClass]="{
                            'bg-secondary-container/20 text-on-surface font-semibold': entry.eventType.includes('Approval'),
                            'bg-surface-container text-on-surface': !entry.eventType.includes('Approval') && !entry.eventType.includes('Blocked'),
                            'bg-error/15 text-error': entry.eventType.includes('Blocked')
                          }"
                          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-label-sm font-bold text-caption"
                        >
                          @if (entry.eventType.includes('Approval')) {
                            <svg class="w-3.5 h-3.5 text-secondary" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                          } @else if (entry.eventType.includes('Blocked')) {
                            <svg class="w-3.5 h-3.5 text-error" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                              <line x1="12" x2="12" y1="8" y2="12"></line>
                              <line x1="12" x2="12.01" y1="16" y2="16"></line>
                            </svg>
                          } @else {
                            <svg class="w-3.5 h-3.5 text-warning" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                            </svg>
                          }
                          <span>{{ entry.eventType }}</span>
                        </span>
                      </td>
                      <td class="py-4 px-space-lg whitespace-nowrap">
                        <div class="flex flex-col">
                          <span class="font-label-sm text-label-sm font-semibold text-on-surface">{{ entry.resourceName }}</span>
                          <span class="font-caption text-caption text-on-surface-variant font-mono">{{ entry.resourceContext }}</span>
                        </div>
                      </td>
                      <td class="py-4 px-space-lg whitespace-nowrap">
                        <div class="inline-flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded text-on-surface group-hover:bg-surface-container-high transition-colors">
                          <svg class="w-3.5 h-3.5 text-outline" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                          <span class="font-mono text-caption font-semibold tracking-wide">{{ entry.shortHash }}</span>
                          <button (click)="copyHash(entry.currentHashSha256); $event.stopPropagation()" title="Copy hash" class="text-outline hover:text-on-surface transition-colors ml-0.5">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                              <rect width="13" height="13" x="9" y="9" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td class="py-4 px-space-lg whitespace-nowrap">
                        <div class="flex items-center gap-1">
                          @for (fw of entry.frameworks; track fw) {
                            <span class="px-2 py-0.5 rounded-full bg-primary-container text-pure-white font-caption text-[11px] font-bold">{{ fw }}</span>
                          }
                        </div>
                      </td>
                      <td class="py-4 px-space-xl whitespace-nowrap text-right">
                        @if (entry.isVerified) {
                          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/15 text-success font-caption text-caption font-bold">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>Verified</span>
                          </span>
                        } @else {
                          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error/15 text-error font-caption text-caption font-bold">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                              <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                              <line x1="12" x2="12" y1="8" y2="12"></line>
                              <line x1="12" x2="12.01" y1="16" y2="16"></line>
                            </svg>
                            <span>Blocked Alert</span>
                          </span>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Table Footer / Pagination -->
            <div class="px-space-xl py-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-md">
              <span class="font-caption text-caption text-on-surface-variant font-medium">
                Showing <strong class="text-on-surface font-bold">{{ (currentPage() - 1) * pageSize + 1 }}–{{ Math.min(currentPage() * pageSize, entries().length) }}</strong> of <strong class="text-on-surface font-bold">{{ (metrics()?.totalLedgerEvents || 1842910) | number }}</strong> immutable events
              </span>
              <div class="flex items-center gap-space-xs">
                <button
                  [disabled]="currentPage() === 1"
                  (click)="prevPage()"
                  class="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high disabled:opacity-50 text-on-surface font-label-sm text-label-sm font-semibold flex items-center gap-1 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  <span>Prev</span>
                </button>
                <span class="px-3 py-1 font-mono font-bold text-caption text-pure-white bg-primary-container rounded">Page {{ currentPage() }}</span>
                <button
                  [disabled]="currentPage() * pageSize >= entries().length"
                  (click)="nextPage()"
                  class="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high disabled:opacity-50 text-on-surface font-label-sm text-label-sm font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Next</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Section 5: Selected Event Deep Dive Panel -->
          @if (selectedEntry(); as selected) {
            <section class="bg-surface-container-lowest rounded-xl shadow-md p-space-xl relative overflow-hidden">
              <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg pb-space-lg">
                <div class="flex items-start gap-space-md">
                  <div class="w-12 h-12 rounded-xl bg-secondary-container text-tertiary flex items-center justify-center shrink-0 shadow-sm">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.3" viewBox="0 0 24 24">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="flex items-center gap-space-sm flex-wrap">
                      <span class="font-caption text-caption font-mono uppercase bg-primary-container text-pure-white px-2.5 py-0.5 rounded font-bold flex items-center gap-1.5">
                        <svg class="w-3 h-3 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                        </svg>
                        <span>Event #AUD-{{ selected.blockNumber }}</span>
                      </span>
                      <span class="font-caption text-caption text-success font-bold flex items-center gap-1.5 bg-success/10 px-2 py-0.5 rounded-full">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                          <path d="m9 12 2 2 4-4"></path>
                        </svg>
                        <span>Ed25519 Cryptographically Validated</span>
                      </span>
                    </div>
                    <h2 class="font-headline-md text-headline-md font-bold text-on-surface mt-1">
                      {{ selected.eventType }} for {{ selected.resourceName }}
                    </h2>
                    <p class="font-body-md text-body-md text-on-surface-variant">
                      Dual-control regulatory sign-off completed by {{ selected.actorEmail }} under Sarbanes-Oxley Title IV.
                    </p>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-space-sm shrink-0 flex-wrap">
                  <button (click)="copyHash(selected.currentHashSha256)" class="flex items-center gap-1.5 px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors">
                    <svg class="w-4 h-4 text-on-surface" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                      <rect height="13" rx="2" ry="2" width="13" x="9" y="9"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span>{{ isCopied() ? 'Copied!' : 'Copy Full Hash' }}</span>
                  </button>
                  <button (click)="openCertificateModal()" class="flex items-center gap-1.5 px-space-md py-2 rounded-lg bg-secondary-container hover:bg-secondary-fixed-dim text-noir-text font-label-md text-label-md font-bold transition-all shadow-sm">
                    <svg class="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" viewBox="0 0 24 24">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" x2="12" y1="15" y2="3"></line>
                    </svg>
                    <span>Download Signed Receipt</span>
                  </button>
                </div>
              </div>

              <!-- Metadata Bento Breakdown -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md bg-surface-container-low rounded-xl p-space-lg mb-space-lg">
                <div class="flex flex-col">
                  <span class="font-caption text-caption text-on-surface-variant font-medium">Merkle Root Leaf</span>
                  <span class="font-mono text-label-sm font-bold text-on-surface truncate">{{ selected.shortHash }}</span>
                  <span class="font-caption text-[11px] text-outline mt-0.5">Leaf index: #{{ selected.blockNumber % 10000 }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="font-caption text-caption text-on-surface-variant font-medium">Network Origin IP</span>
                  <span class="font-mono text-label-sm font-bold text-on-surface">192.0.2.144</span>
                  <span class="font-caption text-[11px] text-success font-semibold mt-0.5">Ashburn Authorized VPN</span>
                </div>
                <div class="flex flex-col">
                  <span class="font-caption text-caption text-on-surface-variant font-medium">Hardware Token ID</span>
                  <span class="font-mono text-label-sm font-bold text-on-surface">YubiKey-8821</span>
                  <span class="font-caption text-[11px] text-outline mt-0.5">FIDO2 Touch Verified</span>
                </div>
                <div class="flex flex-col">
                  <span class="font-caption text-caption text-on-surface-variant font-medium">Cryptographic Signature</span>
                  <span class="font-mono text-label-sm font-bold text-success truncate">Ed25519 Verified</span>
                  <span class="font-caption text-[11px] text-outline mt-0.5">Hash algorithm: SHA-512/256</span>
                </div>
              </div>

              <!-- Justification Block -->
              <div class="bg-surface-container rounded-lg p-space-md flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
                <div class="flex items-start gap-space-sm">
                  <div class="mt-0.5 text-secondary shrink-0">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <div class="flex flex-col">
                    <span class="font-label-sm text-label-sm font-bold text-on-surface">Audit Reason & Mandatory Justification Statement</span>
                    <p class="font-body-md text-body-md text-on-surface font-medium italic">
                      “Approved under FY24-Q4 Infrastructure CapEx budget CC-ENG-01 approved by Board.”
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-space-xs text-caption font-mono text-on-surface-variant shrink-0 bg-surface-container-low px-space-sm py-1 rounded">
                  <span>Ledger ID:</span>
                  <span class="font-bold text-on-surface">LG-2024-X89</span>
                </div>
              </div>
            </section>
          }
        </main>
      </div>

      <!-- Compliance Certificate Modal -->
      <!-- Export Options Modal -->
      @if (showExportModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-primary/70 backdrop-blur-sm animate-fade-in">
          <div class="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-lg w-full p-space-xl border border-surface-container relative">
            <button (click)="closeExportModal()" class="absolute top-4 right-4 text-outline hover:text-on-surface transition-colors p-1 rounded-lg cursor-pointer">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div class="flex items-center gap-space-md mb-space-lg">
              <div class="w-10 h-10 rounded-xl bg-primary-container text-pure-white flex items-center justify-center shadow-sm">
                <svg class="w-5 h-5 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" x2="12" y1="15" y2="3"></line>
                </svg>
              </div>
              <div>
                <span class="font-caption text-caption uppercase tracking-wider text-on-surface-variant font-bold">Audit Ledger Export</span>
                <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Download Compliance Data</h3>
              </div>
            </div>

            <div class="flex flex-col gap-space-md mb-space-xl">
              <button
                type="button"
                (click)="downloadFormat('json')"
                class="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-center justify-between border border-surface-container cursor-pointer text-left"
              >
                <div class="flex items-center gap-space-sm">
                  <div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center font-mono font-bold text-primary text-xs">JSON</div>
                  <div class="flex flex-col">
                    <span class="font-label-md text-label-md font-bold text-on-surface">Raw Cryptographic Ledger Stream</span>
                    <span class="font-caption text-caption text-on-surface-variant">Includes previous/current SHA-256 hashes and Ed25519 signatures</span>
                  </div>
                </div>
                <svg class="w-4 h-4 text-outline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>

              <button
                type="button"
                (click)="downloadFormat('csv')"
                class="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-center justify-between border border-surface-container cursor-pointer text-left"
              >
                <div class="flex items-center gap-space-sm">
                  <div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center font-mono font-bold text-primary text-xs">CSV</div>
                  <div class="flex flex-col">
                    <span class="font-label-md text-label-md font-bold text-on-surface">Spreadsheet Ledger Table</span>
                    <span class="font-caption text-caption text-on-surface-variant">Formatted for external corporate accounting and SOX inspectors</span>
                  </div>
                </div>
                <svg class="w-4 h-4 text-outline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>

            <div class="flex items-center justify-end">
              <button
                type="button"
                (click)="closeExportModal()"
                class="px-space-lg py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      }

      @if (showCertificateModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-primary/70 backdrop-blur-sm animate-fade-in">
          <div role="dialog" aria-modal="true" aria-labelledby="cert-modal-title" class="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-xl w-full max-w-[calc(100vw-2rem)] p-4 sm:p-space-xl border border-surface-container relative">
            <button (click)="closeCertificateModal()" aria-label="Fermer le certificat de conformité" class="absolute top-4 right-4 text-outline hover:text-on-surface transition-colors p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-container">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div class="flex items-center gap-space-md mb-space-lg">
              <div class="w-12 h-12 rounded-xl bg-secondary-container text-tertiary flex items-center justify-center shadow-sm">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" viewBox="0 0 24 24">
                  <path d="M12 15l-2 5l4-1l4 1l-2-5"></path>
                  <circle cx="12" cy="9" r="6"></circle>
                  <polyline points="9 9 11 11 15 7"></polyline>
                </svg>
              </div>
              <div>
                <span class="font-caption text-caption uppercase tracking-wider text-secondary font-bold">SOX-404 / SOC-2 Type II</span>
                <h3 id="cert-modal-title" class="font-headline-sm text-headline-sm text-on-surface font-bold">Compliance Attestation Certificate</h3>
              </div>
            </div>

            <div class="flex flex-col gap-space-sm bg-surface-container-low p-space-md rounded-xl font-mono text-caption text-on-surface mb-space-lg">
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Certificate ID:</span>
                <span class="font-bold text-on-surface">{{ certificate()?.certificateId || 'CERT-2024-X89F2A10' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Issued At:</span>
                <span>{{ certificate()?.issuedAtUtc | date:'medium' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Merkle Root:</span>
                <span class="truncate max-w-[240px] text-primary font-bold">{{ certificate()?.merkleRoot }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Algorithm:</span>
                <span>{{ certificate()?.algorithm }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Status:</span>
                <span class="text-success font-bold">{{ certificate()?.status }}</span>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-space-sm">
              <button (click)="closeCertificateModal()" class="px-space-lg py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors">
                Close
              </button>
              <button (click)="downloadReceipt()" class="px-space-lg py-2 rounded-lg bg-secondary-container text-noir-text font-label-md text-label-md font-bold hover:bg-secondary-fixed-dim transition-colors shadow-sm flex items-center gap-1.5">
                <svg class="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" x2="12" y1="15" y2="3"></line>
                </svg>
                <span>Download Cryptographic PDF</span>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AuditCenterComponent implements OnInit {
  protected readonly Math = Math;
  private readonly auditService = inject(AuditService);

  readonly entries = this.auditService.entries;
  readonly metrics = this.auditService.metrics;
  readonly selectedEntry = this.auditService.selectedEntry;
  readonly certificate = this.auditService.certificate;

  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<string>('All');
  readonly isCopied = signal<boolean>(false);
  readonly showCertificateModal = signal<boolean>(false);
  readonly showMerkleTree = signal<boolean>(true);
  readonly showExportModal = signal<boolean>(false);


  readonly currentPage = signal<number>(1);
  readonly pageSize = 5;

  readonly pagedEntries = computed(() => {
    const all = this.entries();
    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;
    return all.slice(start, start + this.pageSize);
  });

  ngOnInit(): void {
    this.auditService.loadMetrics().subscribe();
    this.auditService.loadEntries().subscribe();
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
    this.auditService.loadEntries(query, this.selectedCategory()).subscribe();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory.set(category);
    this.currentPage.set(1);
    this.auditService.loadEntries(this.searchQuery(), category).subscribe();
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('All');
    this.currentPage.set(1);
    this.auditService.loadEntries().subscribe();
  }

  selectEntry(entry: AuditLedgerEntry): void {
    this.auditService.selectEntry(entry);
  }

  copyHash(hash: string): void {
    navigator.clipboard.writeText(hash).then(() => {
      this.isCopied.set(true);
      setTimeout(() => this.isCopied.set(false), 2000);
    });
  }

  toggleMerkleTree(): void {
    this.showMerkleTree.update(v => !v);
  }

  openExportModal(): void {
    this.showExportModal.set(true);
  }

  closeExportModal(): void {
    this.showExportModal.set(false);
  }

  downloadFormat(format: 'json' | 'csv'): void {
    if (format === 'json') {
      this.exportReport();
    } else {
      const rows = this.entries().map(e => `${e.blockNumber},"${e.timestampUtc}","${e.actorEmail}","${e.eventType}","${e.resourceName}",${e.shortHash},${e.isVerified}`);
      const csv = 'Block,Timestamp,Actor,EventType,Resource,ShortHash,Verified\n' + rows.join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vanguard-audit-ledger-${new Date().toISOString().substring(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
    this.closeExportModal();
  }

  openCertificateModal(): void {
    this.auditService.generateCertificate().subscribe(() => {
      this.showCertificateModal.set(true);
    });
  }

  closeCertificateModal(): void {
    this.showCertificateModal.set(false);
  }

  exportReport(): void {
    const data = JSON.stringify(this.entries(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vanguard-audit-report-${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  downloadReceipt(): void {
    this.exportReport();
    this.closeCertificateModal();
  }

  nextPage(): void {
    if (this.currentPage() * this.pageSize < this.entries().length) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }
}
