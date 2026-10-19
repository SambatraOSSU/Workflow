import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TopbarComponent } from '../../shared/components/topbar/topbar.component';
import { RequestService } from '../../core/services/request.service';
import { CatalogTemplate, ServiceRequestSummary, ServiceRequestDetail } from '../../core/models/request.models';

@Component({
  selector: 'app-requests',
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

        <main class="w-full pt-16 sm:pt-20 bg-surface px-4 sm:px-6 lg:px-space-xl flex-1 flex flex-col max-w-[1680px] mx-auto pb-space-4xl min-w-0">
          <!-- Top Hero Header Area -->
          <div class="relative py-space-xl flex flex-col gap-space-lg">
            <!-- Breadcrumb & Status Pill -->
            <div class="flex flex-wrap items-center justify-between gap-space-sm">
              <div class="flex items-center gap-space-xs font-caption text-caption text-on-surface-variant">
                <a href="#" class="hover:text-primary transition-colors">Home</a>
                <svg class="w-3.5 h-3.5 text-on-surface-variant" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
                <span class="font-label-sm text-caption text-primary font-semibold">Requests & Catalog</span>
              </div>
              <div class="flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-high text-on-surface font-caption text-caption border border-surface-container">
                <span class="w-2 h-2 rounded-full bg-success"></span>
                <span class="font-label-sm text-caption text-primary font-semibold">Catalog Engine v3.1: Synchronized with ServiceNow & Jira</span>
              </div>
            </div>

            <!-- Main Title Banner -->
            <div class="flex flex-col xl:flex-row xl:items-end justify-between gap-space-lg">
              <div class="flex flex-col max-w-3xl">
                <div class="flex items-center gap-space-sm mb-1">
                  <span class="px-space-xs py-0.5 rounded bg-primary-container text-pure-white font-caption text-[11px] font-semibold tracking-wider uppercase">Enterprise Orchestrator</span>
                  <span class="font-caption text-caption text-on-surface-variant">Global Tenant: vanguard-hq</span>
                </div>
                <h1 class="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">Requests Hub & Service Catalog</h1>
                <p class="font-body-md text-body-md text-on-surface-variant mt-1">Initiate enterprise workflows, track ongoing requests across departments, and inspect fulfillment milestones with deterministic SLAs.</p>
              </div>

              <!-- Header Actions -->
              <div class="flex items-center gap-space-md shrink-0">
                <button
                  type="button"
                  (click)="exportHistory()"
                  class="h-10 px-space-md rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold flex items-center gap-space-xs transition-colors shadow-xs border border-surface-container cursor-pointer"
                >
                  <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
                  <span>Export History</span>
                </button>
                <button
                  type="button"
                  (click)="openNewRequestModal()"
                  class="h-10 px-space-lg rounded-lg bg-secondary-container hover:bg-secondary text-noir-text hover:text-pure-white font-label-md text-label-md font-bold flex items-center gap-space-xs transition-all shadow-sm cursor-pointer"
                >
                  <svg class="w-4 h-4 text-current" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="16"></line><line x1="8" x2="16" y1="12" y2="12"></line></svg>
                  <span>+ New Request</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Section 1: Quick Operational Metrics Bar -->
          <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-lg mb-space-2xl">
            <!-- Metric 1 -->
            <div class="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-surface-container">
              <div class="flex items-center justify-between">
                <span class="font-caption text-caption font-semibold uppercase tracking-wider text-on-surface-variant">Active Submitted Requests</span>
                <span class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M5 22h14"></path><path d="M5 2h14"></path><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path></svg>
                </span>
              </div>
              <div class="mt-space-md flex items-baseline gap-space-sm">
                <span class="font-display text-display text-primary font-bold">18</span>
                <span class="font-label-sm text-caption text-success font-semibold flex items-center gap-0.5">
                  <svg class="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24"><line x1="12" x2="12" y1="5" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                  2 delivered today
                </span>
              </div>
              <div class="mt-space-sm flex items-center gap-space-sm text-on-surface-variant font-caption text-caption">
                <span class="inline-flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-secondary-container"></span> 4 awaiting review</span>
                <span class="inline-flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-info"></span> 12 processing</span>
              </div>
            </div>

            <!-- Metric 2 -->
            <div class="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-surface-container">
              <div class="flex items-center justify-between">
                <span class="font-caption text-caption font-semibold uppercase tracking-wider text-on-surface-variant">Average Turnaround</span>
                <span class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path></svg>
                </span>
              </div>
              <div class="mt-space-md flex items-baseline gap-space-sm">
                <span class="font-display text-display text-primary font-bold">6.4h</span>
                <span class="font-label-sm text-caption text-success font-semibold flex items-center gap-0.5">
                  <svg class="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                  -35% vs target
                </span>
              </div>
              <div class="mt-space-sm flex items-center justify-between text-on-surface-variant font-caption text-caption">
                <span>SLA Baseline: 9.8h</span>
                <span class="font-label-sm text-caption text-success font-semibold">Tier-1 Velocity</span>
              </div>
            </div>

            <!-- Metric 3 -->
            <div class="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-surface-container">
              <div class="flex items-center justify-between">
                <span class="font-caption text-caption font-semibold uppercase tracking-wider text-on-surface-variant">Drafts in Progress</span>
                <span class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </span>
              </div>
              <div class="mt-space-md flex items-baseline gap-space-sm">
                <span class="font-display text-display text-primary font-bold">3</span>
                <span class="font-caption text-caption text-on-surface-variant">autosaved items</span>
              </div>
              <div class="mt-space-sm flex items-center justify-between text-on-surface-variant font-caption text-caption">
                <span class="truncate max-w-[170px]">Latest: 'Q3 Datadog License'</span>
                <a href="#" class="font-label-sm text-caption text-secondary hover:underline font-semibold">Resume</a>
              </div>
            </div>

            <!-- Metric 4 -->
            <div class="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-surface-container">
              <div class="flex items-center justify-between">
                <span class="font-caption text-caption font-semibold uppercase tracking-wider text-on-surface-variant">Policy Compliance</span>
                <span class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-success">
                  <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                </span>
              </div>
              <div class="mt-space-md flex items-baseline gap-space-sm">
                <span class="font-display text-display text-primary font-bold">100%</span>
                <span class="font-label-sm text-caption text-success font-semibold">Zero Breaches</span>
              </div>
              <div class="mt-space-sm flex items-center justify-between text-on-surface-variant font-caption text-caption">
                <span>Audited by InfoSec & Legal</span>
                <span class="w-2 h-2 rounded-full bg-success"></span>
              </div>
            </div>
          </section>

          <!-- Section 2: Quick Launch Workflow Catalog -->
          <section class="mb-space-2xl">
            <div class="flex items-center justify-between mb-space-md">
              <div>
                <h2 class="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">Quick Launch Workflow Catalog</h2>
                <p class="font-caption text-caption text-on-surface-variant">Pre-approved enterprise execution templates for rapid self-service provisioning.</p>
              </div>
              <a href="#" class="font-label-sm text-label-sm text-secondary hover:text-primary font-bold flex items-center gap-1 transition-colors">
                <span>Browse All 48 Workflows</span>
                <svg class="w-4 h-4 text-secondary" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24"><line x1="5" x2="19" y1="12" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-lg">
              @for (template of templates(); track template.templateId) {
                <div class="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-surface-container">
                  <div>
                    <div class="flex items-start justify-between mb-space-md">
                      <div class="w-12 h-12 rounded-xl bg-primary-container text-pure-white flex items-center justify-center shadow-sm group-hover:bg-primary transition-colors">
                        @if (template.icon === 'cloud') {
                          <svg class="w-6 h-6 text-pure-white" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>
                        } @else if (template.icon === 'credit_card') {
                          <svg class="w-6 h-6 text-pure-white" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><rect height="16" rx="2" width="20" x="2" y="4"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>
                        } @else if (template.icon === 'lock') {
                          <svg class="w-6 h-6 text-pure-white" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><rect height="11" rx="2" ry="2" width="18" x="3" y="11"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        } @else {
                          <svg class="w-6 h-6 text-pure-white" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
                        }
                      </div>
                      <span class="px-space-xs py-0.5 rounded-full bg-surface-container font-caption text-[11px] font-semibold text-on-surface-variant">{{ template.targetSla }}</span>
                    </div>
                    <span class="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">{{ template.category }}</span>
                    <h3 class="font-headline-sm text-label-md font-bold text-primary mt-1 group-hover:text-secondary transition-colors">{{ template.title }}</h3>
                    <p class="font-body-md text-caption text-on-surface-variant mt-space-xs line-clamp-2">{{ template.description }}</p>
                  </div>

                  <div class="mt-space-lg pt-space-md flex items-center justify-between border-t border-surface-container">
                    <span class="font-caption text-caption text-on-surface-variant flex items-center gap-1 font-semibold">
                      <svg class="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                      {{ template.badge }}
                    </span>
                    <button
                      type="button"
                      (click)="initiateTemplate(template)"
                      class="h-8 px-space-md rounded-lg bg-surface-container-high hover:bg-secondary-container hover:text-noir-text text-primary font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Initiate</span>
                      <svg class="w-3.5 h-3.5 text-current" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24"><line x1="7" x2="17" y1="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                    </button>
                  </div>
                </div>
              }
            </div>
          </section>

          <!-- Section 3 & 4: Split Layout - Interactive Tracker Table & Contextual Side Drawer -->
          <section class="grid grid-cols-1 2xl:grid-cols-12 gap-space-lg items-start">
            <!-- Main Interactive Tracker Table (8 Cols on 2xl) -->
            <div class="2xl:col-span-8 flex flex-col gap-space-md">
              <!-- Tracker Navigation Tabs -->
              <div class="flex flex-wrap items-center justify-between gap-space-md bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-surface-container">
                <div class="flex flex-wrap items-center gap-space-xs">
                  <button
                    type="button"
                    (click)="selectedTab.set('All')"
                    [class]="selectedTab() === 'All' ? 'px-space-md py-space-xs rounded-lg bg-primary-container text-pure-white font-label-sm text-label-sm font-bold shadow-xs' : 'px-space-md py-space-xs rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container font-label-sm text-label-sm font-medium transition-colors'"
                  >
                    All Requests ({{ requests().length }})
                  </button>
                  <button
                    type="button"
                    (click)="selectedTab.set('InReview')"
                    [class]="selectedTab() === 'InReview' ? 'px-space-md py-space-xs rounded-lg bg-primary-container text-pure-white font-label-sm text-label-sm font-bold shadow-xs' : 'px-space-md py-space-xs rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container font-label-sm text-label-sm font-medium transition-colors'"
                  >
                    Awaiting Manager Review
                  </button>
                  <button
                    type="button"
                    (click)="selectedTab.set('InProgress')"
                    [class]="selectedTab() === 'InProgress' ? 'px-space-md py-space-xs rounded-lg bg-primary-container text-pure-white font-label-sm text-label-sm font-bold shadow-xs' : 'px-space-md py-space-xs rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container font-label-sm text-label-sm font-medium transition-colors'"
                  >
                    In Automated Execution
                  </button>
                  <button
                    type="button"
                    (click)="selectedTab.set('Approved')"
                    [class]="selectedTab() === 'Approved' ? 'px-space-md py-space-xs rounded-lg bg-primary-container text-pure-white font-label-sm text-label-sm font-bold shadow-xs' : 'px-space-md py-space-xs rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container font-label-sm text-label-sm font-medium transition-colors'"
                  >
                    Completed
                  </button>
                  <button
                    type="button"
                    (click)="selectedTab.set('Escalated')"
                    [class]="selectedTab() === 'Escalated' ? 'px-space-md py-space-xs rounded-lg bg-primary-container text-pure-white font-label-sm text-label-sm font-bold shadow-xs' : 'px-space-md py-space-xs rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container font-label-sm text-label-sm font-medium transition-colors'"
                  >
                    Escalated
                  </button>
                </div>
                <div class="flex items-center gap-space-xs text-on-surface-variant">
                  <button type="button" (click)="refresh()" class="p-space-xs rounded hover:bg-surface-container transition-colors" title="Reload view">
                    <svg class="w-4 h-4 text-on-surface-variant" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                  </button>
                </div>
              </div>

              <!-- Filter Controls Bar -->
              <div class="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-wrap items-center justify-between gap-space-md border border-surface-container">
                <div class="flex flex-1 min-w-[240px] items-center relative">
                  <svg class="w-4 h-4 text-outline absolute left-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                  <input
                    class="w-full h-10 pl-9 pr-4 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container transition-all border border-surface-container"
                    placeholder="Filter by Request ID, title, requester, or engine reference..."
                    type="text"
                    [ngModel]="searchTerm()"
                    (ngModelChange)="onSearchChange($event)"
                  />
                </div>
                <div class="flex flex-wrap items-center gap-space-sm">
                  <!-- Department Select -->
                  <div class="relative">
                    <select
                      class="h-10 pl-3 pr-8 rounded-lg bg-surface-container-low font-label-sm text-label-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-container appearance-none cursor-pointer border border-surface-container"
                      [ngModel]="selectedDepartment()"
                      (ngModelChange)="onDepartmentChange($event)"
                    >
                      <option value="All Departments">All Departments</option>
                      <option value="AI Platform">AI Platform</option>
                      <option value="Revenue Ops">Revenue Ops</option>
                      <option value="InfoSec GRC">InfoSec GRC</option>
                      <option value="Cloud Reliability">Cloud Reliability</option>
                    </select>
                    <svg class="w-4 h-4 text-outline absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>

              <!-- High-Density Data Table Card -->
              <div class="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden border border-surface-container">
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="bg-surface-container-low text-on-surface font-caption text-caption uppercase tracking-wider font-bold border-b border-surface-container">
                        <th class="py-space-md px-space-md">Request & Workflow</th>
                        <th class="py-space-md px-space-md">Requester</th>
                        <th class="py-space-md px-space-md">Current Stage / Owner</th>
                        <th class="py-space-md px-space-md">SLA & Progress</th>
                        <th class="py-space-md px-space-md">Status</th>
                        <th class="py-space-md px-space-md text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="font-body-md text-body-md text-on-surface divide-y divide-surface-container">
                      @for (req of filteredRequests(); track req.id) {
                        <tr
                          (click)="selectRequest(req.id)"
                          [class]="selectedRequestId() === req.id ? 'bg-surface-container/60 hover:bg-surface-container transition-colors cursor-pointer' : 'hover:bg-surface-container-low transition-colors cursor-pointer'"
                        >
                          <td class="py-space-md px-space-md">
                            <div class="flex items-center gap-space-sm">
                              @if (req.status === 'In Review') {
                                <span class="w-2.5 h-2.5 rounded-full bg-secondary-container ring-4 ring-secondary-container/20 shrink-0"></span>
                              } @else if (req.status === 'In Progress') {
                                <span class="w-2.5 h-2.5 rounded-full bg-info shrink-0"></span>
                              } @else if (req.status === 'Approved') {
                                <span class="w-2.5 h-2.5 rounded-full bg-success shrink-0"></span>
                              } @else {
                                <span class="w-2.5 h-2.5 rounded-full bg-error shrink-0"></span>
                              }
                              <div class="flex flex-col min-w-0">
                                <div class="flex items-center gap-space-xs">
                                  <span class="font-label-md text-label-md font-bold text-primary">{{ req.requestNumber }}</span>
                                  @if (selectedRequestId() === req.id) {
                                    <span class="px-1.5 py-0.5 rounded bg-primary-container text-pure-white font-caption text-[10px] font-semibold">Active Selection</span>
                                  }
                                </div>
                                <span class="font-label-sm text-label-sm text-primary font-semibold truncate max-w-xs">{{ req.title }}</span>
                                <span class="font-caption text-caption text-on-surface-variant font-mono text-[11px]">{{ req.workflowKey }}</span>
                              </div>
                            </div>
                          </td>
                          <td class="py-space-md px-space-md">
                            <div class="flex items-center gap-space-xs">
                              <div class="w-7 h-7 rounded-full bg-primary-container text-pure-white flex items-center justify-center font-caption text-[11px] font-bold">
                                {{ req.requesterInitials }}
                              </div>
                              <div class="flex flex-col">
                                <span class="font-label-sm text-label-sm text-primary font-semibold">{{ req.requesterName }}</span>
                                <span class="font-caption text-caption text-on-surface-variant">{{ req.requesterDepartment }}</span>
                              </div>
                            </div>
                          </td>
                          <td class="py-space-md px-space-md">
                            <div class="flex flex-col">
                              <span class="font-label-sm text-label-sm text-primary font-semibold">{{ req.currentStage }}</span>
                              <span class="font-caption text-caption text-on-surface-variant flex items-center gap-1">
                                <svg class="w-3 h-3 text-on-surface-variant" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                {{ req.currentOwner }}
                              </span>
                            </div>
                          </td>
                          <td class="py-space-md px-space-md">
                            <div class="flex flex-col gap-1 w-36">
                              <div class="flex items-center justify-between font-caption text-caption">
                                <span class="font-bold text-primary">Step {{ req.currentStepNumber }} of {{ req.totalSteps }}</span>
                                <span [class]="req.remainingTimeFormatted.includes('Breached') ? 'text-error font-semibold font-mono text-[11px]' : 'text-warning font-semibold font-mono text-[11px]'">
                                  {{ req.remainingTimeFormatted }}
                                </span>
                              </div>
                              <div class="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                                <div
                                  [class]="req.status === 'Escalated' ? 'h-full bg-error rounded-full' : (req.status === 'Approved' ? 'h-full bg-success rounded-full' : 'h-full bg-secondary-container rounded-full')"
                                  [style.width.%]="req.progressPercent"
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td class="py-space-md px-space-md">
                            @if (req.status === 'In Review') {
                              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-label-sm text-caption font-bold">
                                <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span> In Review
                              </span>
                            } @else if (req.status === 'In Progress') {
                              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-info/15 text-info font-label-sm text-caption font-bold">
                                <span class="w-1.5 h-1.5 rounded-full bg-info animate-pulse"></span> In Progress
                              </span>
                            } @else if (req.status === 'Approved') {
                              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-success/15 text-success font-label-sm text-caption font-bold">
                                <span class="w-1.5 h-1.5 rounded-full bg-success"></span> Approved
                              </span>
                            } @else {
                              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error/15 text-error font-label-sm text-caption font-bold">
                                <span class="w-1.5 h-1.5 rounded-full bg-error"></span> {{ req.status }}
                              </span>
                            }
                          </td>
                          <td class="py-space-md px-space-md text-right">
                            <div class="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                (click)="selectRequest(req.id); $event.stopPropagation()"
                                class="p-1.5 rounded-lg hover:bg-surface-container-highest text-primary transition-colors cursor-pointer"
                                title="View workflow trace"
                              >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>

                <!-- Table Pagination Footer -->
                <div class="p-space-md bg-surface-container-low flex flex-wrap items-center justify-between gap-space-md font-caption text-caption text-on-surface-variant border-t border-surface-container">
                  <div class="flex items-center gap-space-md">
                    <span>Showing <strong class="text-primary font-bold">1–{{ filteredRequests().length }}</strong> of {{ requests().length }} requests</span>
                  </div>
                  <div class="flex items-center gap-space-xs">
                    <button type="button" class="h-8 px-space-sm rounded bg-surface-container text-on-surface-variant opacity-60 cursor-not-allowed">Previous</button>
                    <button type="button" class="h-8 w-8 rounded bg-primary-container text-pure-white font-bold">1</button>
                    <button type="button" class="h-8 w-8 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-medium">2</button>
                    <button type="button" class="h-8 px-space-sm rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-medium">Next</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 4: Contextual Quick Preview Card (4 Cols on 2xl) -->
            <div class="2xl:col-span-4 flex flex-col gap-space-md">
              @if (currentDetail(); as detail) {
                <div class="p-space-xl rounded-xl bg-surface-container-lowest shadow-md flex flex-col gap-space-lg border border-surface-container">
                  <!-- Drawer Header -->
                  <div class="flex items-start justify-between">
                    <div class="flex flex-col">
                      <div class="flex items-center gap-space-xs">
                        <span class="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">Selected Inspection</span>
                        <span class="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                      </div>
                      <h3 class="font-headline-sm text-headline-sm text-primary font-bold mt-1">{{ detail.requestNumber }}</h3>
                      <span class="font-body-md text-label-sm text-on-surface-variant font-medium">{{ detail.title }}</span>
                    </div>
                  </div>

                  <!-- Cost & SLA Quick Banner -->
                  <div class="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between border border-surface-container">
                    <div class="flex flex-col">
                      <span class="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">Est. Budget Impact</span>
                      <span class="font-headline-sm text-headline-sm text-primary font-bold mt-0.5">
                        {{ detail.estimatedBudget | currency:'USD':'symbol':'1.0-0' }}<span class="font-caption text-caption font-normal text-on-surface-variant">/month</span>
                      </span>
                    </div>
                    <div class="h-8 w-px bg-surface-container-high"></div>
                    <div class="flex flex-col items-end">
                      <span class="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">SLA Deadline</span>
                      <span class="font-label-md text-label-md text-warning font-bold flex items-center gap-1 mt-0.5">
                        <svg class="w-4 h-4 text-warning" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        {{ detail.remainingTimeFormatted }}
                      </span>
                    </div>
                  </div>

                  <!-- Interactive Step Progress Timeline -->
                  <div class="flex flex-col gap-space-xs">
                    <span class="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold mb-space-xs">Workflow Orchestration Flow</span>
                    <div class="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-high">
                      @for (step of detail.timeline; track step.stepNumber) {
                        <div class="relative flex items-start gap-space-sm group" [class.opacity-50]="step.status === 'Future'">
                          @if (step.status === 'Done') {
                            <div class="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-success text-pure-white flex items-center justify-center ring-4 ring-surface-container-lowest">
                              <svg class="w-3 h-3 text-pure-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                          } @else if (step.status === 'Active') {
                            <div class="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-secondary-container text-noir-text flex items-center justify-center ring-4 ring-surface-container-lowest font-bold text-[10px] animate-pulse">
                              {{ step.stepNumber }}
                            </div>
                          } @else {
                            <div class="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center ring-4 ring-surface-container-lowest text-[10px] font-bold">
                              {{ step.stepNumber }}
                            </div>
                          }
                          <div class="flex flex-col">
                            <div class="flex items-center gap-space-xs">
                              <span class="font-label-sm text-label-sm font-bold text-primary">{{ step.title }}</span>
                              @if (step.status === 'Active') {
                                <span class="px-1.5 py-0.2 rounded bg-secondary-container/20 text-secondary font-caption text-[10px] font-bold">Action Needed</span>
                              }
                            </div>
                            <span class="font-caption text-caption text-on-surface-variant">{{ step.description }}</span>
                          </div>
                        </div>
                      }
                    </div>
                  </div>

                  <!-- Submitted Form Inputs & Specs Grid -->
                  @if (detail.parameters) {
                    <div class="flex flex-col gap-space-xs">
                      <span class="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">Parameters & Artifacts</span>
                      <div class="p-space-md rounded-xl bg-surface-container-low grid grid-cols-2 gap-space-md font-caption text-caption border border-surface-container">
                        @for (param of getParametersArray(detail.parameters); track param.key) {
                          <div>
                            <span class="text-on-surface-variant block">{{ param.key }}:</span>
                            <span class="font-label-sm text-caption text-primary font-bold">{{ param.value }}</span>
                          </div>
                        }
                      </div>
                    </div>
                  }

                  <!-- Attached Documents -->
                  @if (detail.attachedDocuments && detail.attachedDocuments.length > 0) {
                    <div class="flex flex-col gap-space-xs">
                      <div class="flex items-center justify-between">
                        <span class="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">Attached Vendor Docs</span>
                        <span class="font-caption text-caption text-on-surface-variant">{{ detail.attachedDocuments.length }} files</span>
                      </div>
                      <div class="flex flex-col gap-space-xs">
                        @for (doc of detail.attachedDocuments; track doc.fileName) {
                          <a href="#" class="p-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-between transition-colors group border border-surface-container">
                            <div class="flex items-center gap-space-xs">
                              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line></svg>
                              <span class="font-label-sm text-caption text-primary font-medium group-hover:underline">{{ doc.fileName }}</span>
                            </div>
                            <span class="font-caption text-[11px] text-on-surface-variant font-mono">{{ doc.fileSize }}</span>
                          </a>
                        }
                      </div>
                    </div>
                  }

                  <!-- Action Buttons in Preview -->
                  <div class="pt-space-sm flex flex-col gap-space-xs">
                    <button
                      type="button"
                      (click)="authorizeRequest(detail.id)"
                      class="w-full h-10 rounded-lg bg-primary text-pure-white font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors flex items-center justify-center gap-space-xs shadow-sm cursor-pointer"
                    >
                      <svg class="w-4 h-4 text-secondary-container" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                      <span>Authorize Request (As Org Admin)</span>
                    </button>
                    <div class="grid grid-cols-2 gap-space-xs">
                      <button
                        type="button"
                        (click)="expediteSla(detail.id)"
                        class="h-9 px-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1 transition-colors border border-surface-container cursor-pointer"
                      >
                        <svg class="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        <span>Expedite SLA</span>
                      </button>
                      <button
                        type="button"
                        (click)="rejectRequest(detail.id)"
                        class="h-9 px-space-sm rounded-lg bg-surface-container hover:bg-error/10 hover:text-error text-on-surface-variant font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1 transition-colors border border-surface-container cursor-pointer"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" x2="9" y1="9" y2="15"></line><line x1="9" x2="15" y1="9" y2="15"></line></svg>
                        <span>Reject Request</span>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </section>
        </main>
      </div>

      <!-- Modal: New Request Wizard -->
      @if (showNewRequestModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container max-w-xl w-full p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div class="flex items-center justify-between pb-3 border-b border-surface-container">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-secondary-container">
                  <svg class="w-4 h-4 text-secondary-container" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="16"></line><line x1="8" x2="16" y1="12" y2="12"></line></svg>
                </div>
                <h3 class="font-headline-sm text-lg font-bold text-primary">Initiate Service Catalog Request</h3>
              </div>
              <button type="button" (click)="showNewRequestModal.set(false)" class="p-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>
              </button>
            </div>

            <form (ngSubmit)="submitNewRequest()" class="space-y-4">
              <div>
                <label class="block font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Catalog Template <span class="text-error">*</span>
                </label>
                <select
                  class="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary-container"
                  [ngModel]="selectedModalTemplateId()"
                  (ngModelChange)="selectedModalTemplateId.set($event)"
                  name="templateId"
                  required
                >
                  @for (t of templates(); track t.templateId) {
                    <option [value]="t.templateId">{{ t.title }} ({{ t.category }})</option>
                  }
                </select>
              </div>

              <div>
                <label class="block font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Request Title <span class="text-error">*</span>
                </label>
                <input
                  type="text"
                  class="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary-container"
                  [ngModel]="newRequestTitle()"
                  (ngModelChange)="newRequestTitle.set($event)"
                  name="title"
                  placeholder="e.g. Dedicated GPU Sandbox for Transformer Testing"
                  required
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Department <span class="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    class="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary-container"
                    [ngModel]="newRequestDepartment()"
                    (ngModelChange)="newRequestDepartment.set($event)"
                    name="department"
                    placeholder="AI Platform"
                    required
                  />
                </div>
                <div>
                  <label class="block font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Estimated Budget ($)
                  </label>
                  <input
                    type="number"
                    class="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary-container"
                    [ngModel]="newRequestBudget()"
                    (ngModelChange)="newRequestBudget.set($event)"
                    name="budget"
                  />
                </div>
              </div>

              <div class="pt-3 flex items-center justify-end gap-3 border-t border-surface-container">
                <button
                  type="button"
                  (click)="showNewRequestModal.set(false)"
                  class="px-4 py-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-5 py-2 rounded-lg bg-secondary-container hover:bg-secondary text-noir-text hover:text-pure-white font-label-md text-sm font-bold shadow-sm transition-all cursor-pointer"
                >
                  Launch Request Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class RequestsComponent implements OnInit {
  private readonly requestService = inject(RequestService);

  protected readonly templates = this.requestService.templates;
  protected readonly requests = this.requestService.requests;
  protected readonly currentDetail = this.requestService.selectedRequest;

  protected readonly selectedTab = signal<string>('All');
  protected readonly searchTerm = signal<string>('');
  protected readonly selectedDepartment = signal<string>('All Departments');
  protected readonly selectedRequestId = signal<string>('11111111-8891-4444-8888-000000000001');

  protected readonly showNewRequestModal = signal(false);
  protected readonly selectedModalTemplateId = signal('cloud-alloc');
  protected readonly newRequestTitle = signal('');
  protected readonly newRequestDepartment = signal('AI Platform');
  protected readonly newRequestBudget = signal(12400);

  ngOnInit(): void {
    this.requestService.loadTemplates().subscribe();
    this.requestService.loadRequests().subscribe();
    this.requestService.loadRequestDetail(this.selectedRequestId()).subscribe();
  }

  protected selectRequest(id: string): void {
    this.selectedRequestId.set(id);
    this.requestService.loadRequestDetail(id).subscribe();
  }

  protected onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  protected onDepartmentChange(dept: string): void {
    this.selectedDepartment.set(dept);
  }

  protected filteredRequests(): ServiceRequestSummary[] {
    let list = this.requests();
    const tab = this.selectedTab();
    if (tab !== 'All') {
      list = list.filter(r => r.status.replace(/\s+/g, '') === tab || r.status === tab);
    }
    const dept = this.selectedDepartment();
    if (dept !== 'All Departments') {
      list = list.filter(r => r.requesterDepartment.includes(dept));
    }
    const search = this.searchTerm().trim().toLowerCase();
    if (search) {
      list = list.filter(r =>
        r.requestNumber.toLowerCase().includes(search) ||
        r.title.toLowerCase().includes(search) ||
        r.requesterName.toLowerCase().includes(search) ||
        r.workflowKey.toLowerCase().includes(search)
      );
    }
    return list;
  }

  protected refresh(): void {
    this.requestService.loadRequests().subscribe();
  }

  protected exportHistory(): void {
    // Generate simple CSV export
    const rows = this.requests().map(r => `${r.requestNumber},"${r.title}",${r.requesterName},${r.status},${r.estimatedBudget}`);
    const csvContent = 'data:text/csv;charset=utf-8,RequestNumber,Title,Requester,Status,Budget\n' + rows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vanguard_Requests_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  protected initiateTemplate(template: CatalogTemplate): void {
    this.selectedModalTemplateId.set(template.templateId);
    this.newRequestTitle.set(`Request: ${template.title}`);
    this.newRequestBudget.set(template.defaultBudget);
    this.showNewRequestModal.set(true);
  }

  protected openNewRequestModal(): void {
    this.newRequestTitle.set('New Cloud Allocation Sandbox');
    this.showNewRequestModal.set(true);
  }

  protected submitNewRequest(): void {
    if (!this.newRequestTitle() || !this.newRequestDepartment()) return;

    this.requestService.submitRequest({
      templateId: this.selectedModalTemplateId(),
      title: this.newRequestTitle(),
      department: this.newRequestDepartment(),
      estimatedBudget: this.newRequestBudget(),
      parameters: {
        'Template': this.selectedModalTemplateId(),
        'Priority': 'Standard Enterprise SLA'
      }
    }).subscribe({
      next: (res) => {
        this.showNewRequestModal.set(false);
        this.selectRequest(res.id);
      }
    });
  }

  protected authorizeRequest(id: string): void {
    this.requestService.expediteSla(id).subscribe();
  }

  protected expediteSla(id: string): void {
    this.requestService.expediteSla(id).subscribe();
  }

  protected rejectRequest(id: string): void {
    this.requestService.rejectRequest(id, 'Rejected by Administrator').subscribe();
  }

  protected getParametersArray(params: Record<string, string>): { key: string; value: string }[] {
    return Object.entries(params).map(([key, value]) => ({ key, value }));
  }
}
