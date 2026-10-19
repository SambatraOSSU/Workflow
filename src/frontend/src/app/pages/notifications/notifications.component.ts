import { Component, ChangeDetectionStrategy, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TopbarComponent } from '../../shared/components/topbar/topbar.component';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationItem } from '../../core/models/notification.models';

@Component({
  selector: 'app-notifications',
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

        <main class="w-full pt-16 sm:pt-20 bg-surface px-6 sm:px-8 lg:px-10 xl:px-12 flex-1 flex flex-col max-w-7xl 2xl:max-w-[1536px] mx-auto pb-space-4xl min-w-0">
          <!-- Ambient Glow Behind Operational Canvas -->
          <div class="relative w-full">
            <div class="absolute -top-12 right-24 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
            <div class="absolute top-48 left-10 w-80 h-80 bg-primary-container/5 rounded-full blur-2xl pointer-events-none -z-10"></div>

            <!-- Header & Action Deck -->
            <div class="flex flex-col xl:flex-row xl:items-end justify-between gap-space-lg pt-space-lg pb-space-xl">
              <div class="flex flex-col gap-space-xs max-w-3xl">
                <div class="flex items-center gap-space-sm">
                  <span class="px-space-sm py-0.5 rounded-full bg-secondary-container/20 text-secondary font-caption text-caption font-bold tracking-wide uppercase">
                    Ops Level 0 · Real-Time Telemetry
                  </span>
                  <span class="flex items-center gap-1.5 font-caption text-caption text-on-surface-variant font-medium">
                    <span class="w-1.5 h-1.5 rounded-full bg-success animate-ping"></span>
                    Sync streaming active
                  </span>
                </div>
                <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  Notification Center & Alert Routing
                </h1>
                <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Manage real-time incident alerts, SLA breaches, workflow approval requests, and multichannel dispatch rules across Slack, PagerDuty, Webhook, and Secure Enclave logs.
                </p>
              </div>

              <!-- Command Actions -->
              <div class="flex flex-wrap items-center gap-space-sm">
                <button
                  (click)="markAllAsRead()"
                  class="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors shadow-sm"
                >
                  <svg class="w-4 h-4 text-on-surface-variant" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>{{ allMarkedRead() ? 'All Alerts Marked Read' : 'Mark all as read' }}</span>
                </button>
                <button
                  (click)="toggleRoutingRules()"
                  class="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors shadow-sm"
                >
                  <svg class="w-4 h-4 text-on-surface-variant" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                    <line x1="4" x2="4" y1="21" y2="14"></line>
                    <line x1="4" x2="4" y1="10" y2="3"></line>
                    <line x1="12" x2="12" y1="21" y2="12"></line>
                    <line x1="12" x2="12" y1="8" y2="3"></line>
                    <line x1="20" x2="20" y1="21" y2="16"></line>
                    <line x1="20" x2="20" y1="12" y2="3"></line>
                  </svg>
                  <span>Routing Rules</span>
                </button>
                <button
                  (click)="exportLog()"
                  class="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:bg-primary transition-colors shadow-sm"
                >
                  <svg class="w-4 h-4 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" x2="12" y1="15" y2="3"></line>
                  </svg>
                  <span>Export Incident Log</span>
                </button>
              </div>
            </div>

            <!-- Metrics & KPI Cockpit Strip -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-xl">
              <!-- KPI Card 1: Unread Alerts -->
              <div class="flex items-center justify-between p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center gap-space-md">
                  <div class="w-11 h-11 rounded-lg bg-secondary-container/20 flex items-center justify-center shrink-0">
                    <svg class="w-6 h-6 text-secondary" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-caption text-caption text-on-surface-variant font-medium">Unread Queue</div>
                    <div class="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                      {{ summary()?.unreadCount ?? 5 }} <span class="font-caption text-caption text-secondary font-semibold">Action Req.</span>
                    </div>
                  </div>
                </div>
                <span class="px-2 py-1 rounded-full bg-secondary-container text-noir-text font-caption text-caption font-bold">Live</span>
              </div>

              <!-- KPI Card 2: Critical Breaches -->
              <div class="flex items-center justify-between p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center gap-space-md">
                  <div class="w-11 h-11 rounded-lg bg-error-container flex items-center justify-center shrink-0">
                    <svg class="w-6 h-6 text-error" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                      <line x1="12" x2="12" y1="8" y2="12"></line>
                      <line x1="12" x2="12.01" y1="16" y2="16"></line>
                    </svg>
                  </div>
                  <div>
                    <div class="font-caption text-caption text-on-surface-variant font-medium">Active Incidents</div>
                    <div class="font-headline-md text-headline-md text-error font-bold tracking-tight">
                      {{ summary()?.criticalIncidentsCount ?? 2 }} <span class="font-caption text-caption text-error font-medium">SLA Breached</span>
                    </div>
                  </div>
                </div>
                <div class="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></div>
              </div>

              <!-- KPI Card 3: Pending Approvals -->
              <div class="flex items-center justify-between p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center gap-space-md">
                  <div class="w-11 h-11 rounded-lg bg-warning/15 flex items-center justify-center shrink-0">
                    <svg class="w-6 h-6 text-warning" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div class="font-caption text-caption text-on-surface-variant font-medium">Sign-off Approvals</div>
                    <div class="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                      {{ summary()?.pendingApprovalsCount ?? 7 }} <span class="font-caption text-caption text-warning font-semibold">Time-critical</span>
                    </div>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded-md bg-surface-container font-caption text-caption text-on-surface-variant font-medium">&lt; 2h SLA</span>
              </div>

              <!-- KPI Card 4: System Digests -->
              <div class="flex items-center justify-between p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center gap-space-md">
                  <div class="w-11 h-11 rounded-lg bg-info/10 flex items-center justify-center shrink-0">
                    <svg class="w-6 h-6 text-info" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-caption text-caption text-on-surface-variant font-medium">Pipeline Telemetry</div>
                    <div class="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                      {{ summary()?.pipelineTelemetryCount ?? 24 }} <span class="font-caption text-caption text-info font-medium">Healthy Log</span>
                    </div>
                  </div>
                </div>
                <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
              </div>
            </div>

            <!-- Main Workspace Grid: Stream (Left) + Multi-Channel Health Hub (Right) -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
              <!-- Primary Stream Column (8 Cols) -->
              <div class="lg:col-span-8 flex flex-col gap-space-md">
                <!-- Filter & Search Console -->
                <div class="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
                  <!-- Categorical Filter Pills -->
                  <div class="flex items-center gap-2 overflow-x-auto pb-1">
                    <button
                      (click)="setCategory('all')"
                      [class.bg-primary-container]="selectedCategory() === 'all'"
                      [class.text-pure-white]="selectedCategory() === 'all'"
                      [class.bg-surface-container-low]="selectedCategory() !== 'all'"
                      [class.text-on-surface]="selectedCategory() !== 'all'"
                      class="px-3.5 py-1.5 rounded-full font-label-sm text-label-sm font-semibold shrink-0 shadow-sm transition-colors"
                    >
                      All (38)
                    </button>
                    <button
                      (click)="setCategory('unread')"
                      [class.bg-primary-container]="selectedCategory() === 'unread'"
                      [class.text-pure-white]="selectedCategory() === 'unread'"
                      [class.bg-surface-container-low]="selectedCategory() !== 'unread'"
                      [class.text-on-surface]="selectedCategory() !== 'unread'"
                      class="px-3.5 py-1.5 rounded-full font-label-sm text-label-sm font-medium shrink-0 transition-colors flex items-center gap-1.5"
                    >
                      <span>Unread</span>
                      <span class="w-5 h-5 rounded-full bg-secondary-container text-noir-text font-caption text-caption font-bold flex items-center justify-center">
                        {{ summary()?.unreadCount ?? 5 }}
                      </span>
                    </button>
                    <button
                      (click)="setCategory('sla')"
                      [class.bg-primary-container]="selectedCategory() === 'sla'"
                      [class.text-pure-white]="selectedCategory() === 'sla'"
                      [class.bg-surface-container-low]="selectedCategory() !== 'sla'"
                      [class.text-on-surface]="selectedCategory() !== 'sla'"
                      class="px-3.5 py-1.5 rounded-full font-label-sm text-label-sm font-medium shrink-0 transition-colors flex items-center gap-1.5"
                    >
                      <span class="w-2 h-2 rounded-full bg-error"></span>
                      <span>SLA Breaches (3)</span>
                    </button>
                    <button
                      (click)="setCategory('approval')"
                      [class.bg-primary-container]="selectedCategory() === 'approval'"
                      [class.text-pure-white]="selectedCategory() === 'approval'"
                      [class.bg-surface-container-low]="selectedCategory() !== 'approval'"
                      [class.text-on-surface]="selectedCategory() !== 'approval'"
                      class="px-3.5 py-1.5 rounded-full font-label-sm text-label-sm font-medium shrink-0 transition-colors flex items-center gap-1.5"
                    >
                      <span class="w-2 h-2 rounded-full bg-warning"></span>
                      <span>Approvals (7)</span>
                    </button>
                    <button
                      (click)="setCategory('security')"
                      [class.bg-primary-container]="selectedCategory() === 'security'"
                      [class.text-pure-white]="selectedCategory() === 'security'"
                      [class.bg-surface-container-low]="selectedCategory() !== 'security'"
                      [class.text-on-surface]="selectedCategory() !== 'security'"
                      class="px-3.5 py-1.5 rounded-full font-label-sm text-label-sm font-medium shrink-0 transition-colors"
                    >
                      Security & Compliance (4)
                    </button>
                    <button
                      (click)="setCategory('system')"
                      [class.bg-primary-container]="selectedCategory() === 'system'"
                      [class.text-pure-white]="selectedCategory() === 'system'"
                      [class.bg-surface-container-low]="selectedCategory() !== 'system'"
                      [class.text-on-surface]="selectedCategory() !== 'system'"
                      class="px-3.5 py-1.5 rounded-full font-label-sm text-label-sm font-medium shrink-0 transition-colors"
                    >
                      System (19)
                    </button>
                  </div>

                  <!-- Query Input + Quick Sorters -->
                  <div class="flex flex-col sm:flex-row items-center gap-space-sm pt-space-xs">
                    <div class="relative w-full flex-1">
                      <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                      <input
                        [ngModel]="searchQuery()"
                        (ngModelChange)="onSearchChange($event)"
                        class="w-full h-10 pl-9 pr-4 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                        placeholder="Filter alerts by pipeline ID, error code, commit SHA, or actor..."
                        type="text"
                      />
                    </div>
                    <div class="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      <select
                        [ngModel]="selectedSeverity()"
                        (ngModelChange)="onSeverityChange($event)"
                        class="h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm border-0 focus:ring-2 focus:ring-primary-container cursor-pointer"
                      >
                        <option value="all">Severity: All</option>
                        <option value="critical">Critical</option>
                        <option value="warning">Warning</option>
                        <option value="info">Info</option>
                      </select>
                      <button class="flex items-center gap-1.5 px-3 h-10 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm hover:bg-surface-container transition-colors">
                        <svg class="w-4 h-4 text-on-surface-variant" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                          <path d="m3 16 4 4 4-4"></path>
                          <path d="M7 20V4"></path>
                          <path d="m21 8-4-4-4 4"></path>
                          <path d="M17 4v16"></path>
                        </svg>
                        <span>Newest First</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Feed List Deck -->
                <div class="flex flex-col gap-space-md" id="notificationStream">
                  @for (item of notifications(); track item.id) {
                    <div
                      [class.opacity-70]="item.isRead"
                      class="relative overflow-hidden p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all"
                    >
                      <!-- Severity Border -->
                      <div
                        [ngClass]="{
                          'bg-error': item.severity === 'critical',
                          'bg-secondary-container': item.severity === 'warning' && item.category === 'approval',
                          'bg-warning': item.severity === 'warning' && item.category !== 'approval',
                          'bg-surface-tint': item.category === 'security',
                          'bg-success': item.severity === 'info'
                        }"
                        class="absolute left-0 top-0 bottom-0 w-1.5"
                      ></div>

                      <div class="flex flex-col gap-space-md pl-1">
                        <!-- Card Header Row -->
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                          <div class="flex items-center gap-space-sm flex-wrap">
                            <span
                              [ngClass]="{
                                'bg-error-container text-error': item.severity === 'critical',
                                'bg-secondary-container/20 text-secondary': item.category === 'approval',
                                'bg-surface-tint/15 text-primary-container': item.category === 'security',
                                'bg-success/15 text-success': item.severity === 'info',
                                'bg-warning/20 text-warning': item.severity === 'warning' && item.category !== 'approval'
                              }"
                              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-caption text-caption font-bold tracking-wide uppercase"
                            >
                              @if (item.severity === 'critical') {
                                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                                  <line x1="12" x2="12" y1="9" y2="13"></line>
                                  <line x1="12" x2="12.01" y1="17" y2="17"></line>
                                </svg>
                              } @else if (item.category === 'approval') {
                                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                              } @else if (item.category === 'security') {
                                <svg class="w-3.5 h-3.5 shrink-0 text-primary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                  <path d="m9 12 2 2 4-4"></path>
                                </svg>
                              } @else if (item.severity === 'info') {
                                <svg class="w-3.5 h-3.5 shrink-0 text-success" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                              } @else {
                                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                </svg>
                              }
                              {{ item.type }}
                            </span>
                            @if (item.incidentId) {
                              <span class="font-caption text-caption text-outline">{{ item.incidentId }}</span>
                            }
                          </div>
                          <span class="font-caption text-caption text-on-surface-variant">{{ item.relativeTime }}</span>
                        </div>

                        <!-- Main Payload -->
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                          <div class="flex flex-col gap-space-xs max-w-xl">
                            <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                              {{ item.title }}
                            </h2>
                            <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                              {{ item.message }}
                            </p>
                          </div>
                          @if (item.amount) {
                            <div class="flex flex-col items-start md:items-end justify-center shrink-0 p-space-md rounded-lg bg-surface-container-low min-w-[190px]">
                              <span class="font-caption text-caption text-on-surface-variant uppercase font-semibold">Authorized Amount</span>
                              <span class="font-headline-sm text-headline-sm text-primary-container font-bold">{{ item.amount }}</span>
                              <span class="font-caption text-caption text-success font-medium">Within Q4 CapEx Budget</span>
                            </div>
                          }
                        </div>

                        <!-- Diagnostics Grid (if present) -->
                        @if (hasKeys(item.diagnostics)) {
                          <div class="grid grid-cols-1 md:grid-cols-3 gap-space-sm p-space-sm rounded-lg bg-surface-container-low font-caption text-caption">
                            @for (entry of getEntries(item.diagnostics); track entry.key) {
                              <div class="flex items-center gap-2 text-on-surface">
                                <span class="text-on-surface-variant">{{ entry.key }}:</span>
                                <span class="font-semibold">{{ entry.value }}</span>
                              </div>
                            }
                          </div>
                        }

                        <!-- Action Toolbar -->
                        <div class="flex flex-wrap items-center justify-between gap-space-md pt-space-xs">
                          <div class="flex items-center gap-2 flex-wrap">
                            @for (act of item.actions; track act.action) {
                              <button
                                (click)="handleAction(item, act.action)"
                                [ngClass]="{
                                  'bg-primary-container text-pure-white hover:bg-primary font-semibold shadow-sm': act.variant === 'primary' && act.action !== 'review_sign',
                                  'bg-secondary-container text-noir-text hover:bg-secondary-fixed-dim font-bold shadow-sm': act.action === 'review_sign',
                                  'bg-surface-container-low text-on-surface hover:bg-surface-container font-medium': act.variant === 'secondary',
                                  'bg-surface-container-low text-error hover:bg-error-container font-medium': act.variant === 'danger'
                                }"
                                class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors"
                              >
                                <span>{{ act.label }}</span>
                              </button>
                            }
                            @if (!item.isRead) {
                              <button
                                (click)="markAsRead(item.id)"
                                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-colors"
                              >
                                <span>Dismiss</span>
                              </button>
                            }
                          </div>
                          <div class="flex items-center gap-3 text-outline">
                            <button (click)="markAsRead(item.id)" aria-label="Route notification" class="hover:text-on-surface transition-colors">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
                                <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>

                <!-- Pagination / Stream Bottom Control -->
                <div class="flex items-center justify-between p-space-md rounded-xl bg-surface-container-lowest shadow-sm mt-space-sm font-caption text-caption text-on-surface-variant">
                  <span>Showing {{ notifications().length }} of 38 recorded alerts in last 24h</span>
                  <div class="flex items-center gap-2">
                    <button class="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-medium transition-colors">Previous</button>
                    <span class="px-2 font-bold text-on-surface">Page 1 of 1</span>
                    <button class="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-medium transition-colors">Next</button>
                  </div>
                </div>
              </div>

              <!-- Right Sidebar: Multichannel Dispatch Hub & Routing Rules (4 Cols) -->
              <div class="lg:col-span-4 flex flex-col gap-space-md">
                <!-- Channel Dispatch Health Card -->
                <div class="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-space-xs">
                      <svg class="w-5 h-5 text-primary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M4 11a9 9 0 0 1 9 9"></path>
                        <path d="M4 4a16 16 0 0 1 16 16"></path>
                        <circle cx="5" cy="19" r="1"></circle>
                      </svg>
                      <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">
                        Channel Dispatch
                      </h3>
                    </div>
                    <span class="px-2 py-0.5 rounded-full bg-success/15 text-success font-caption text-caption font-bold">5/5 Active</span>
                  </div>
                  <p class="font-body-md text-body-md text-on-surface-variant leading-normal">
                    Real-time pipeline alerts are multiplexed based on incident classification and organizational on-call policy.
                  </p>

                  <!-- Channel List -->
                  <div class="flex flex-col gap-space-xs pt-space-xs">
                    @for (ch of channels(); track ch.id) {
                      <div class="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                        <div class="flex items-center gap-space-sm">
                          <div class="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-pure-white shrink-0">
                            @if (ch.id === 'in-app') {
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                                <rect height="14" rx="2" ry="2" width="20" x="2" y="3"></rect>
                                <line x1="8" x2="16" y1="21" y2="21"></line>
                                <line x1="12" x2="12" y1="17" y2="21"></line>
                              </svg>
                            } @else if (ch.id === 'slack') {
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                                <line x1="4" x2="20" y1="9" y2="9"></line>
                                <line x1="4" x2="20" y1="15" y2="15"></line>
                                <line x1="10" x2="8" y1="3" y2="21"></line>
                                <line x1="16" x2="14" y1="3" y2="21"></line>
                              </svg>
                            } @else if (ch.id === 'pagerduty') {
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                              </svg>
                            } @else if (ch.id === 'email') {
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                              </svg>
                            } @else {
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                                <rect height="11" rx="2" ry="2" width="18" x="3" y="11"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                              </svg>
                            }
                          </div>
                          <div class="flex flex-col">
                            <span class="font-label-sm text-label-sm text-on-surface font-bold">{{ ch.name }}</span>
                            <span class="font-caption text-caption text-on-surface-variant">{{ ch.description }}</span>
                          </div>
                        </div>
                        <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    }
                  </div>

                  <button class="w-full mt-space-xs py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors text-center">
                    Configure Endpoints & Keys
                  </button>
                </div>

                <!-- Notification Frequency & Quiet Hours Mini-Inspector -->
                <div class="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
                  <div class="flex items-center justify-between">
                    <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Dispatch Throttling
                    </h3>
                    <span class="font-caption text-caption text-on-surface-variant">Automated</span>
                  </div>

                  <!-- Throttle Progress Visual -->
                  <div class="flex flex-col gap-space-xs">
                    <div class="flex justify-between font-caption text-caption">
                      <span class="text-on-surface-variant">Rate Capacity (Slack API)</span>
                      <span class="font-semibold text-on-surface">{{ summary()?.rateCapacityCurrent ?? 342 }} / {{ summary()?.rateCapacityMax ?? 1000 }} req/min</span>
                    </div>
                    <div class="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                      <div class="h-full bg-secondary-container rounded-full" [style.width.%]="summary()?.rateCapacityPercent ?? 34.2"></div>
                    </div>
                  </div>

                  <!-- Quiet Hours Indicator -->
                  <div class="p-space-sm rounded-lg bg-surface-container-low flex items-start gap-space-sm">
                    <svg class="w-5 h-5 text-secondary shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                    <div class="flex flex-col">
                      <span class="font-label-sm text-label-sm text-on-surface font-bold">Quiet Hours Active for Non-P1</span>
                      <span class="font-caption text-caption text-on-surface-variant leading-tight">
                        22:00 – 07:00 local time. Only P0/P1 SLA breaches ring pagers.
                      </span>
                    </div>
                  </div>

                  <div class="pt-space-xs flex items-center justify-between font-caption text-caption text-on-surface-variant">
                    <span>Escalation policy: <strong class="text-on-surface">Tier-1 DevOps High-Availability</strong></span>
                    <a class="text-secondary font-semibold hover:underline" href="#">Edit</a>
                  </div>
                </div>

                <!-- Live Delivery Audit Sparkline Widget -->
                <div class="p-space-lg rounded-xl bg-primary-container text-on-primary shadow-sm flex flex-col gap-space-md">
                  <div class="flex items-center justify-between">
                    <div class="flex flex-col">
                      <span class="font-caption text-caption text-on-primary-container uppercase tracking-wider font-semibold">Real-time Volume</span>
                      <span class="font-headline-sm text-headline-sm text-pure-white font-bold">{{ (summary()?.dispatchedCount24h ?? 14291) | number }} Dispatched</span>
                    </div>
                    <div class="px-2 py-1 rounded bg-surface-tint text-pure-white font-caption text-caption font-bold">
                      {{ summary()?.slaDeliveryRate ?? 99.98 }}% SLA
                    </div>
                  </div>

                  <!-- Inline SVG Sparkline Chart -->
                  <div class="w-full h-16 pt-2">
                    <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 60">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stop-color="#ffa515" stop-opacity="0.4"></stop>
                          <stop offset="100%" stop-color="#ffa515" stop-opacity="0"></stop>
                        </linearGradient>
                      </defs>
                      <path d="M 0,45 Q 30,10 60,35 T 120,20 T 180,40 T 240,15 T 300,28 L 300,60 L 0,60 Z" fill="url(#chartGradient)"></path>
                      <path d="M 0,45 Q 30,10 60,35 T 120,20 T 180,40 T 240,15 T 300,28" fill="none" stroke="#ffa515" stroke-linecap="round" stroke-width="2.5"></path>
                      <circle cx="240" cy="15" fill="#ffffff" r="4" stroke="#ffa515" stroke-width="2"></circle>
                    </svg>
                  </div>

                  <div class="flex items-center justify-between font-caption text-caption text-on-primary-container">
                    <span>Avg Ack Latency: {{ summary()?.avgAckLatency ?? '1.4m' }}</span>
                    <span>Zero Failover Incidents</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `
})
export class NotificationsComponent implements OnInit {
  private readonly notificationService = inject(NotificationService);

  readonly notifications = this.notificationService.notifications;
  readonly summary = this.notificationService.summary;
  readonly channels = this.notificationService.channels;

  readonly selectedCategory = signal<string>('all');
  readonly selectedSeverity = signal<string>('all');
  readonly searchQuery = signal<string>('');
  readonly allMarkedRead = signal<boolean>(false);

  ngOnInit(): void {
    this.notificationService.loadSummary().subscribe();
    this.notificationService.loadChannels().subscribe();
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.notificationService.loadNotifications(
      this.selectedCategory(),
      this.selectedSeverity(),
      this.selectedCategory() === 'unread',
      this.searchQuery()
    ).subscribe();
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
    this.loadAlerts();
  }

  onSeverityChange(sev: string): void {
    this.selectedSeverity.set(sev);
    this.loadAlerts();
  }

  onSearchChange(q: string): void {
    this.searchQuery.set(q);
    this.loadAlerts();
  }

  markAsRead(id: string): void {
    this.notificationService.markAsRead(id).subscribe();
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.allMarkedRead.set(true);
    });
  }

  toggleRoutingRules(): void {
    alert('Routing rules configuration panel opened.');
  }

  exportLog(): void {
    const data = JSON.stringify(this.notifications(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-log-${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  handleAction(item: NotificationItem, action: string): void {
    this.markAsRead(item.id);
  }

  hasKeys(obj: Record<string, string> | undefined): boolean {
    return !!obj && Object.keys(obj).length > 0;
  }

  getEntries(obj: Record<string, string>): { key: string; value: string }[] {
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  }
}
