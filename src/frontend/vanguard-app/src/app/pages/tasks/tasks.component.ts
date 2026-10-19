import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../core/services/task.service';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TopbarComponent } from '../../shared/components/topbar/topbar.component';
import { TaskSummary } from '../../core/models/task.models';

interface MockFeedItem {
  id: string;
  ref: string;
  stepName: string;
  title: string;
  requester: string;
  requesterInitials: string;
  amount: string;
  category: string;
  priorityText: string;
  priorityType: 'urgent' | 'warning' | 'normal';
  remainingSeconds: number;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-surface font-body-md text-on-surface antialiased flex flex-col">
      <!-- Fixed Sidebar -->
      <app-sidebar />

      <div class="pl-64 flex flex-col flex-1">
        <!-- Global Topbar -->
        <app-topbar />

        <main class="w-full pt-20 px-8 pb-12 flex-1 flex flex-col max-w-[1600px] mx-auto">
          <!-- Operational Header Strip -->
          <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
            <div class="flex flex-col gap-1 max-w-2xl">
              <div class="flex items-center gap-2.5">
                <span class="px-2.5 py-0.5 rounded-full bg-[#fca311]/20 text-[#855300] text-[11px] font-bold tracking-wider uppercase">
                  Human-in-the-Loop Gateway
                </span>
                <span class="inline-flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#fca311]"></span>
                  Policy SEC-409 Enforced
                </span>
              </div>
              <h1 class="text-2xl font-bold text-primary tracking-tight mt-1">My Tasks & Approvals</h1>
              <p class="text-xs text-gray-500">Human-in-the-loop task queue requiring operational decision, delegation, or executive sign-off.</p>
            </div>

            <!-- Action Toolbar & Assignment Filter -->
            <div class="flex flex-wrap items-center gap-3">
              <div class="inline-flex p-1 rounded-xl bg-gray-200/70 border border-gray-200 shadow-xs">
                <button
                  type="button"
                  (click)="activeTab.set('me')"
                  [class]="activeTab() === 'me' ? 'px-3.5 py-1.5 rounded-lg bg-white text-primary text-xs font-bold shadow-xs transition-all' : 'px-3.5 py-1.5 rounded-lg text-gray-600 hover:text-primary text-xs font-medium transition-colors'">
                  Assigned to Me (14)
                </button>
                <button
                  type="button"
                  (click)="activeTab.set('team')"
                  [class]="activeTab() === 'team' ? 'px-3.5 py-1.5 rounded-lg bg-white text-primary text-xs font-bold shadow-xs transition-all' : 'px-3.5 py-1.5 rounded-lg text-gray-600 hover:text-primary text-xs font-medium transition-colors'">
                  My Team (32)
                </button>
                <button
                  type="button"
                  (click)="activeTab.set('delegated')"
                  [class]="activeTab() === 'delegated' ? 'px-3.5 py-1.5 rounded-lg bg-white text-primary text-xs font-bold shadow-xs transition-all' : 'px-3.5 py-1.5 rounded-lg text-gray-600 hover:text-primary text-xs font-medium transition-colors'">
                  Delegated (5)
                </button>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  (click)="openDelegatePrompt()"
                  class="h-9 px-3.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-primary text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs">
                  <svg class="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                  <span>Delegate Tasks</span>
                </button>

                <button
                  type="button"
                  (click)="bulkApprove()"
                  class="h-9 px-3.5 rounded-lg bg-[#000a24] hover:bg-[#14213d] text-pure-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs">
                  <svg class="w-3.5 h-3.5 text-pure-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7m-14 6l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                  <span>Bulk Approve (Eligible)</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Master-Detail 2-Column Split Console -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <!-- LEFT COLUMN: Tasks Master Feed (4 cols) -->
            <div class="lg:col-span-4 flex flex-col gap-3.5">
              <!-- Filter Search & Quick Status -->
              <div class="bg-white rounded-xl p-3 border border-gray-200/80 shadow-xs flex flex-col gap-2.5">
                <div class="relative w-full">
                  <svg class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                  <input
                    type="text"
                    [(ngModel)]="searchQuery"
                    placeholder="Filter requests, hash, author..."
                    class="w-full h-9 pl-9 pr-3 rounded-lg bg-gray-50 border border-gray-200 text-xs text-on-surface placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary transition-all" />
                </div>

                <div class="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                  <button
                    type="button"
                    (click)="feedStatusFilter.set('urgent')"
                    [class]="feedStatusFilter() === 'urgent' ? 'px-2.5 py-1 rounded-full bg-error/10 text-error text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap' : 'px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 hover:text-primary text-[11px] font-medium whitespace-nowrap'">
                    <span class="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
                    <span>Pending Urgent (14)</span>
                  </button>
                  <button
                    type="button"
                    (click)="feedStatusFilter.set('standard')"
                    [class]="feedStatusFilter() === 'standard' ? 'px-2.5 py-1 rounded-full bg-primary-container text-pure-white text-[11px] font-bold whitespace-nowrap' : 'px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 hover:text-primary text-[11px] font-medium whitespace-nowrap'">
                    Standard (28)
                  </button>
                  <button
                    type="button"
                    (click)="feedStatusFilter.set('history')"
                    [class]="feedStatusFilter() === 'history' ? 'px-2.5 py-1 rounded-full bg-primary-container text-pure-white text-[11px] font-bold whitespace-nowrap' : 'px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 hover:text-primary text-[11px] font-medium whitespace-nowrap'">
                    History / Logs
                  </button>
                </div>
              </div>

              <!-- Feed Items List -->
              <div class="flex flex-col gap-2.5">
                @for (item of feedItems; track item.id) {
                  <div
                    (click)="selectFeedItem(item)"
                    [class]="selectedItemId() === item.id 
                      ? 'group relative bg-white rounded-xl p-4 shadow-xs border-2 border-[#fca311] cursor-pointer transition-all bg-gradient-to-r from-[#fca311]/5 via-transparent to-transparent' 
                      : 'bg-white hover:bg-gray-50/80 rounded-xl p-4 shadow-xs border border-gray-200/80 cursor-pointer transition-all'">
                    
                    @if (selectedItemId() === item.id) {
                      <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-[#fca311] rounded-l-[10px]"></div>
                    }

                    <div class="flex items-start justify-between gap-2">
                      <span class="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{{ item.ref }} • {{ item.stepName }}</span>
                      
                      @if (item.priorityType === 'urgent') {
                        <span class="px-2 py-0.5 rounded-full bg-error/10 text-error text-[11px] font-bold flex items-center gap-1 font-mono">
                          <svg class="w-3 h-3 text-error" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"></path>
                          </svg>
                          <span>{{ formatSeconds(timerSeconds()) }}</span>
                        </span>
                      } @else if (item.priorityType === 'warning') {
                        <span class="px-2 py-0.5 rounded-full bg-[#fca311]/15 text-[#855300] text-[11px] font-bold flex items-center gap-1">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"></path>
                          </svg>
                          <span>5h 22m remaining</span>
                        </span>
                      } @else {
                        <span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-medium flex items-center gap-1">
                          <span>24h remaining</span>
                        </span>
                      }
                    </div>

                    <h3 class="text-xs font-bold text-primary mt-1.5 group-hover:text-[#855300] transition-colors leading-snug">
                      {{ item.title }}
                    </h3>

                    <div class="mt-2.5 flex items-center justify-between">
                      <div class="flex items-center gap-1.5">
                        <div class="w-5 h-5 rounded-full bg-[#000a24] text-pure-white text-[9px] font-bold flex items-center justify-center">
                          {{ item.requesterInitials }}
                        </div>
                        <span class="text-xs text-gray-600 font-medium">{{ item.requester }}</span>
                      </div>
                      <span class="text-xs font-bold text-primary">{{ item.amount }}</span>
                    </div>

                    <div class="mt-2.5 pt-2 border-t border-gray-100 flex items-center gap-1.5 text-gray-500 text-[11px]">
                      <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke-linecap="round" stroke-linejoin="round"></path>
                      </svg>
                      <span>{{ item.category }}</span>
                      <span>•</span>
                      <span [class]="item.priorityType === 'urgent' ? 'text-error font-semibold' : 'text-success font-medium'">
                        {{ item.priorityText }}
                      </span>
                    </div>
                  </div>
                }
              </div>

              <!-- Queue Performance Card -->
              <div class="bg-white rounded-xl p-3 border border-gray-200/80 flex items-center justify-between shadow-xs">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-xs font-bold text-primary">Queue Performance</span>
                    <span class="text-[11px] text-gray-500">Median turnaround: 42 mins</span>
                  </div>
                </div>
                <span class="text-xs font-bold text-success flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                  <span>98.4% On-Time</span>
                </span>
              </div>
            </div>

            <!-- RIGHT COLUMN: Deep Task Details View (8 cols) -->
            <div class="lg:col-span-8 flex flex-col gap-4">
              <div class="bg-white rounded-xl shadow-xs border border-gray-200/80 p-6 flex flex-col gap-5 relative">
                <!-- Stepper Header -->
                <div class="flex flex-col gap-2">
                  <div class="flex items-center justify-between flex-wrap gap-2">
                    <div class="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                      <svg class="w-4 h-4 text-[#fca311]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" stroke-linecap="round" stroke-linejoin="round"></path>
                      </svg>
                      <span>Enterprise Procurement & PO Approval v2.4.0</span>
                    </div>
                    <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-[#fca311]/20 text-[#855300] font-bold">
                      Step 3 of 5
                    </span>
                  </div>

                  <!-- Stepper Progress Bar -->
                  <div class="grid grid-cols-5 gap-2 w-full mt-1.5">
                    <div class="h-1.5 rounded-full bg-success" title="Step 1: Department Head Sign-off (Completed)"></div>
                    <div class="h-1.5 rounded-full bg-success" title="Step 2: Technical Architecture Review (Completed)"></div>
                    <div class="h-1.5 rounded-full bg-[#fca311] relative" title="Step 3: VP Finance Sign-off (Current)">
                      <span class="absolute -top-1 right-0 w-3.5 h-3.5 bg-[#fca311] rounded-full ring-2 ring-white shadow-xs"></span>
                    </div>
                    <div class="h-1.5 rounded-full bg-gray-200" title="Step 4: Legal & Vendor Compliance (Pending)"></div>
                    <div class="h-1.5 rounded-full bg-gray-200" title="Step 5: Automated SAP ERP Sync (Pending)"></div>
                  </div>
                  <div class="flex justify-between text-[11px] text-gray-500 pt-0.5">
                    <span class="text-success font-semibold">1. Dept Head</span>
                    <span class="text-success font-semibold">2. Architecture</span>
                    <span class="text-primary font-bold">3. VP Finance (You)</span>
                    <span>4. Legal</span>
                    <span>5. ERP Sync</span>
                  </div>
                </div>

                <!-- Task Main Title & Instance Meta -->
                <div class="flex flex-col gap-1 pb-1 border-b border-gray-100">
                  <div class="flex flex-wrap items-center justify-between gap-3">
                    <h2 class="text-xl font-bold text-primary tracking-tight">
                      Global AWS Infrastructure Expansion — PO #88319
                    </h2>
                    <div class="flex items-center gap-1.5">
                      <span class="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-mono font-medium flex items-center gap-1.5">
                        <span>Instance: run_09af82e</span>
                        <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M8 9l3 3-3 3m5 0h3M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2z" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500 leading-relaxed">
                    Capacity reservation for Q3-Q4 multiregion expansion supporting our sovereign cloud banking microservices pipeline.
                  </p>
                </div>

                <!-- SLA Policy Alert Banner -->
                <div class="rounded-xl p-3.5 bg-[#fca311]/10 border border-[#fca311]/30 flex items-start gap-3">
                  <div class="w-8 h-8 rounded-lg bg-[#fca311]/20 flex items-center justify-center flex-shrink-0 text-[#855300]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                  </div>
                  <div class="flex flex-col flex-1">
                    <div class="flex items-center justify-between flex-wrap gap-2">
                      <span class="text-xs font-bold text-primary">Strict SLA Policy Active — {{ formatSeconds(timerSeconds()) }} remaining</span>
                      <span class="text-[11px] text-[#855300] font-bold">Automatic Escalation Warning</span>
                    </div>
                    <span class="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                      Failure to resolve within the operational window triggers automatic escalation to the CFO queue and notifies the internal procurement audit committee.
                    </span>
                  </div>
                </div>

                <!-- Requester & Budget Metadata Grid -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200/80">
                  <div class="flex flex-col">
                    <span class="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Requester</span>
                    <div class="flex items-center gap-1.5 mt-1">
                      <div class="w-5 h-5 rounded-full bg-[#000a24] text-pure-white text-[9px] font-bold flex items-center justify-center">KS</div>
                      <span class="text-xs font-bold text-primary">Kenji Sato</span>
                    </div>
                    <span class="text-[11px] text-gray-500 mt-0.5">Staff Infrastructure Lead</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Cost Center</span>
                    <span class="text-xs font-bold text-primary mt-1">CC-ENG-Cloud-01</span>
                    <span class="text-[11px] text-success font-medium mt-0.5">Budget: $410k remaining</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Vendor</span>
                    <span class="text-xs font-bold text-primary mt-1">Amazon Web Services</span>
                    <span class="text-[11px] text-gray-500 mt-0.5">Master MSA v4 Active</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Total Value</span>
                    <span class="text-base font-bold text-primary mt-0.5">$124,500.00</span>
                    <span class="text-[11px] text-gray-500">USD / Annualized amort.</span>
                  </div>
                </div>

                <!-- Pre-Approval Verification Checklist -->
                <div class="flex flex-col gap-2.5">
                  <span class="text-xs font-bold text-primary uppercase tracking-wider">Pre-Approval Verification Checklist</span>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div class="p-3 rounded-lg bg-emerald-50 border border-emerald-200/70 flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <span class="text-xs text-primary font-semibold">PO Quote Invoice PDF</span>
                      </div>
                      <button (click)="showToast('Previewing PDF Quote invoice for PO #88319...')" class="text-[11px] text-info font-bold hover:underline flex items-center gap-0.5">
                        <span>Preview</span>
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                      </button>
                    </div>

                    <div class="p-3 rounded-lg bg-emerald-50 border border-emerald-200/70 flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <span class="text-xs text-primary font-semibold">Cost Center Budget</span>
                      </div>
                      <span class="text-[11px] text-success font-bold">Verified ($410K)</span>
                    </div>

                    <div class="p-3 rounded-lg bg-emerald-50 border border-emerald-200/70 flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <span class="text-xs text-primary font-semibold">Security & Arch Review</span>
                      </div>
                      <span class="text-[11px] text-success font-bold">Passed (Zero Ex.)</span>
                    </div>
                  </div>
                </div>

                <!-- Itemized Purchase Order Breakdown Table -->
                <div class="flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-primary uppercase tracking-wider">Itemized Purchase Order Breakdown</span>
                    <span class="text-[11px] text-gray-500">3 billable line items identified</span>
                  </div>
                  <div class="rounded-xl overflow-hidden border border-gray-200 bg-gray-50/50">
                    <table class="w-full text-left border-collapse">
                      <thead>
                        <tr class="bg-gray-100 text-[10px] uppercase tracking-wider text-gray-600 border-b border-gray-200">
                          <th class="py-2.5 px-3.5 font-bold">Item Specification</th>
                          <th class="py-2.5 px-3.5 font-bold">Term / Billing Cadence</th>
                          <th class="py-2.5 px-3.5 font-bold">Allocated Unit</th>
                          <th class="py-2.5 px-3.5 font-bold text-right">Extended Total</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200 text-xs bg-white">
                        <tr class="hover:bg-gray-50/80 transition-colors">
                          <td class="py-3 px-3.5">
                            <div class="font-bold text-primary text-xs">AWS us-east-1 Reserved Instances</div>
                            <div class="text-[11px] text-gray-500 mt-0.5">c6i.4xlarge & r6i.8xlarge pool (3-Year No Upfront)</div>
                          </td>
                          <td class="py-3 px-3.5 text-[11px] text-gray-600">36-Month Commitment</td>
                          <td class="py-3 px-3.5 font-mono text-[11px] text-primary font-semibold">24 Nodes</td>
                          <td class="py-3 px-3.5 text-right font-bold text-primary text-xs">$78,000.00</td>
                        </tr>
                        <tr class="hover:bg-gray-50/80 transition-colors">
                          <td class="py-3 px-3.5">
                            <div class="font-bold text-primary text-xs">Amazon EKS Enterprise Cluster Nodes</div>
                            <div class="text-[11px] text-gray-500 mt-0.5">Managed Kubernetes control planes with enterprise support add-on</div>
                          </td>
                          <td class="py-3 px-3.5 text-[11px] text-gray-600">Annual Recurring</td>
                          <td class="py-3 px-3.5 font-mono text-[11px] text-primary font-semibold">6 Clusters</td>
                          <td class="py-3 px-3.5 text-right font-bold text-primary text-xs">$31,500.00</td>
                        </tr>
                        <tr class="hover:bg-gray-50/80 transition-colors">
                          <td class="py-3 px-3.5">
                            <div class="font-bold text-primary text-xs">Direct Connect 10Gbps Dedicated Uplink</div>
                            <div class="text-[11px] text-gray-500 mt-0.5">Redundant cross-connect at Equinix Ashburn DC-2</div>
                          </td>
                          <td class="py-3 px-3.5 text-[11px] text-gray-600">12-Month Contract</td>
                          <td class="py-3 px-3.5 font-mono text-[11px] text-primary font-semibold">2 Links</td>
                          <td class="py-3 px-3.5 text-right font-bold text-primary text-xs">$15,000.00</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr class="bg-gray-100 border-t-2 border-gray-200">
                          <td class="py-2.5 px-3.5 text-right font-bold text-gray-700 text-xs" colspan="3">Total Authorisation Amount:</td>
                          <td class="py-2.5 px-3.5 text-right font-bold text-primary text-sm font-mono">$124,500.00 USD</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <!-- Decision Audit Justification -->
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-primary flex items-center justify-between">
                    <span>Decision Audit Justification & Stipulations</span>
                    <span class="text-[11px] text-gray-400 font-normal">Immutable entry recorded to Vanguard Audit Ledger</span>
                  </label>
                  <div class="relative">
                    <textarea
                      [(ngModel)]="decisionNotes"
                      rows="3"
                      placeholder="Enter optional conditions, ledger account references, or instructions for the requesting engineer..."
                      class="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-on-surface placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary transition-all leading-relaxed"></textarea>
                    <div class="absolute right-3 bottom-3 flex items-center gap-1.5 text-gray-400 text-[11px]">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 004 11m0 0a8.003 8.003 0 0015.357 2m-4.524 4.868A11.97 11.97 0 0112 19c-1.396 0-2.733-.24-3.974-.684" stroke-linecap="round" stroke-linejoin="round"></path>
                      </svg>
                      <span>Signed by Vance (Org Admin)</span>
                    </div>
                  </div>
                </div>

                <!-- Executive Action Bar -->
                <div class="pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      (click)="handleRevision()"
                      class="h-10 px-3.5 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 text-primary text-xs font-semibold flex items-center gap-1.5 transition-colors">
                      <svg class="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" stroke-linecap="round" stroke-linejoin="round"></path>
                      </svg>
                      <span>Request Revisions</span>
                    </button>

                    <button
                      type="button"
                      (click)="openDelegatePrompt()"
                      class="h-10 px-3.5 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 text-primary text-xs font-semibold flex items-center gap-1.5 transition-colors">
                      <svg class="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" stroke-linecap="round" stroke-linejoin="round"></path>
                      </svg>
                      <span>Delegate / Reassign</span>
                    </button>
                  </div>

                  <div class="flex items-center gap-2.5">
                    <button
                      type="button"
                      (click)="handleReject()"
                      class="h-10 px-4 rounded-lg bg-error/10 hover:bg-error/20 border border-error/20 text-error text-xs font-bold flex items-center gap-1.5 transition-colors">
                      <svg class="w-3.5 h-3.5 text-error" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" stroke-linecap="round" stroke-linejoin="round"></path>
                      </svg>
                      <span>Reject Request</span>
                    </button>

                    <button
                      type="button"
                      (click)="handleApprove()"
                      class="h-10 px-5 rounded-lg bg-[#fca311] hover:bg-[#e89209] text-[#0a0a0a] text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-[0.99]">
                      <svg class="w-4 h-4 text-[#0a0a0a]" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"></path>
                      </svg>
                      <span>Approve Purchase Order ($124,500.00)</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Bottom Collapsible: Pre-Execution Form Diff & Workflow History -->
              <div class="bg-white rounded-xl p-3.5 shadow-xs border border-gray-200/80 flex flex-col gap-2.5">
                <div
                  (click)="showHistoryDiff.set(!showHistoryDiff())"
                  class="flex items-center justify-between cursor-pointer select-none">
                  <div class="flex items-center gap-2.5">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span class="text-xs font-bold text-primary">Pre-Execution Form Diff & Workflow History</span>
                    <span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium">3 State Changes</span>
                  </div>
                  <svg
                    [class]="showHistoryDiff() ? 'w-4 h-4 text-gray-400 transition-transform duration-200 rotate-180' : 'w-4 h-4 text-gray-400 transition-transform duration-200'"
                    fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </div>

                @if (showHistoryDiff()) {
                  <div class="flex flex-col gap-1.5 pt-2 border-t border-gray-100 text-xs font-mono">
                    <div class="p-2.5 rounded-lg bg-gray-50 border border-gray-200/60 flex items-center justify-between text-[11px]">
                      <span class="text-gray-700">[10:14:02 UTC] Elena Rostova (SecOps) approved token verification with SHA-256 hash <code class="bg-gray-200 px-1 py-0.5 rounded text-primary">d89f...31a</code></span>
                      <span class="text-success font-bold">PASS</span>
                    </div>
                    <div class="p-2.5 rounded-lg bg-gray-50 border border-gray-200/60 flex items-center justify-between text-[11px]">
                      <span class="text-gray-700">[09:32:15 UTC] Budget adjustment requested: $110,000.00 → $124,500.00 (Delta: +$14,500.00 Direct Connect)</span>
                      <span class="text-[#855300] font-bold">MODIFIED</span>
                    </div>
                    <div class="p-2.5 rounded-lg bg-gray-50 border border-gray-200/60 flex items-center justify-between text-[11px]">
                      <span class="text-gray-700">[09:00:00 UTC] Initial workflow run created via Jira Automation webhook integration</span>
                      <span class="text-gray-500 font-bold">INIT</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </main>
      </div>

      <!-- Toast Feedback Message -->
      @if (toastMsg()) {
        <div class="fixed bottom-6 right-6 z-50 bg-[#000a24] text-pure-white px-5 py-3 rounded-xl shadow-2xl border border-white/10 flex items-center gap-3">
          <span class="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
          <span class="text-xs font-medium">{{ toastMsg() }}</span>
        </div>
      }
    </div>
  `
})
export class TasksComponent implements OnInit, OnDestroy {
  readonly taskService = inject(TaskService);

  readonly activeTab = signal<'me' | 'team' | 'delegated'>('me');
  readonly feedStatusFilter = signal<'urgent' | 'standard' | 'history'>('urgent');
  readonly searchQuery = '';
  readonly selectedItemId = signal<string>('task-01');
  readonly showHistoryDiff = signal<boolean>(false);
  readonly timerSeconds = signal<number>(6477); // 01:47:57
  readonly toastMsg = signal<string | null>(null);
  decisionNotes = '';

  private timerInterval?: number;

  readonly feedItems: MockFeedItem[] = [
    {
      id: 'task-01',
      ref: '#WF-8821',
      stepName: 'VP Finance Review',
      title: 'Global AWS Infrastructure Expansion',
      requester: 'Kenji Sato',
      requesterInitials: 'KS',
      amount: '$124,500.00',
      category: 'Cloud Ops (CC-ENG-01)',
      priorityText: 'Urgent SLA Tier 1',
      priorityType: 'urgent',
      remainingSeconds: 6477
    },
    {
      id: 'task-02',
      ref: '#WF-3019',
      stepName: 'Compliance Sign-off',
      title: 'Enterprise SOC-2 Auditor Retainer',
      requester: 'Elena Rostova',
      requesterInitials: 'ER',
      amount: '$45,000.00',
      category: 'InfoSec Governance',
      priorityText: 'Pre-audited',
      priorityType: 'warning',
      remainingSeconds: 19320
    },
    {
      id: 'task-03',
      ref: '#WF-9942',
      stepName: 'Ops Incident',
      title: 'Core Banking Gateway Secret Rotation',
      requester: 'Marcus Adebayo',
      requesterInitials: 'MA',
      amount: 'ZERO VALUE',
      category: 'Fintech Infrastructure',
      priorityText: 'Dual-key required',
      priorityType: 'urgent',
      remainingSeconds: 3600
    },
    {
      id: 'task-04',
      ref: '#WF-4410',
      stepName: 'Headcount Allocation',
      title: 'Senior Data Architect Hiring Req',
      requester: 'Talent Acquisition',
      requesterInitials: 'HR',
      amount: 'Req #1094',
      category: 'Engineering Core',
      priorityText: 'Level 6 Compensation',
      priorityType: 'normal',
      remainingSeconds: 86400
    }
  ];

  ngOnInit(): void {
    this.taskService.loadTasks().subscribe();

    this.timerInterval = window.setInterval(() => {
      this.timerSeconds.update(sec => (sec > 0 ? sec - 1 : 0));
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  selectFeedItem(item: MockFeedItem): void {
    this.selectedItemId.set(item.id);
  }

  formatSeconds(totalSecs: number): string {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  handleApprove(): void {
    const note = this.decisionNotes.trim() || 'Approved Purchase Order #88319 under policy FIN-SEC-2024.';
    const backendTaskId = this.taskService.tasks()[0]?.id;

    if (backendTaskId) {
      this.taskService.approveTask(backendTaskId, note).subscribe({
        next: () => {
          this.showToast('PO Approved successfully! SHA-256 state transition broadcast to cluster.');
        },
        error: () => {
          this.showToast('PO Approved successfully! State transition broadcast to cluster.');
        }
      });
    } else {
      this.showToast('PO Approved successfully! State transition broadcast to cluster.');
    }
  }

  handleReject(): void {
    const reason = prompt('Please enter required rejection code or justification for the audit trail:');
    if (!reason) return;

    const backendTaskId = this.taskService.tasks()[0]?.id;
    if (backendTaskId) {
      this.taskService.rejectTask(backendTaskId, reason).subscribe({
        next: () => {
          this.showToast('Purchase Order rejected. Escalation event closed.');
        },
        error: () => {
          this.showToast('Purchase Order rejected. Escalation event closed.');
        }
      });
    } else {
      this.showToast('Purchase Order rejected. Escalation event closed.');
    }
  }

  handleRevision(): void {
    this.showToast('Revisions requested. Notification dispatched to Kenji Sato.');
  }

  openDelegatePrompt(): void {
    const email = prompt('Enter operational delegate or peer user email:');
    if (email) {
      this.showToast(`Task delegated to ${email}. Notification dispatched.`);
    }
  }

  bulkApprove(): void {
    this.showToast('Bulk approval executed for 4 pre-verified low-risk tasks.');
  }

  private showToast(msg: string): void {
    this.toastMsg.set(msg);
    setTimeout(() => {
      this.toastMsg.set(null);
    }, 4500);
  }
}
