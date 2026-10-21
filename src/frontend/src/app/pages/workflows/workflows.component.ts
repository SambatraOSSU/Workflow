import { Component, ChangeDetectionStrategy, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { WorkflowService } from '../../core/services/workflow.service';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TopbarComponent } from '../../shared/components/topbar/topbar.component';
import { CreateWorkflowRequest, WorkflowSummary } from '../../core/models/workflow.models';

@Component({
  selector: 'app-workflows',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent, TopbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-surface font-body-md text-on-surface antialiased flex flex-col">
      <!-- Fixed Sidebar -->
      <app-sidebar />

      <div class="pl-0 lg:pl-64 flex flex-col flex-1 min-w-0 transition-all duration-300">
        <!-- Global Topbar -->
        <app-topbar />

        <main class="flex-1 pt-20 px-4 sm:px-8 lg:px-10 xl:px-12 py-space-xl flex flex-col gap-space-lg max-w-7xl 2xl:max-w-[1536px] w-full mx-auto min-w-0">
          <!-- Page Header & Action Controls -->
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md border-b border-surface-container-high pb-space-lg">
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-primary-container text-pure-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-xs">Definitions</span>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-success/10 text-success text-[11px] font-mono font-semibold border border-success/20">
                  <svg class="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  SOX-404 Cryptosealed
                </span>
              </div>
              <h1 class="text-headline-md font-bold text-primary tracking-tight">Enterprise Workflow Catalog</h1>
              <p class="text-caption text-on-surface-variant">Design, version, audit, and orchestrate human-in-the-loop and automated business pipelines.</p>
            </div>

            <div class="flex items-center gap-space-sm flex-shrink-0">
              <button
                type="button"
                (click)="openCreateModal()"
                class="h-10 px-space-md rounded-lg bg-secondary-container hover:bg-secondary text-noir-text hover:text-pure-white font-label-md font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <line x1="12" x2="12" y1="5" y2="19"></line>
                  <line x1="5" x2="19" y1="12" y2="12"></line>
                </svg>
                <span>+ New Workflow</span>
              </button>
            </div>
          </div>

          <!-- Filters & Search Bar -->
          <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-xl border border-surface-container-high shadow-xs">
            <div class="relative flex-1 max-w-md">
              <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
              </svg>
              <input
                type="text"
                [value]="searchQuery()"
                (input)="searchQuery.set($any($event.target).value)"
                placeholder="Search workflows by key, title, department..." aria-label="Rechercher des workflows"
                class="w-full h-10 pl-9 pr-4 rounded-lg bg-surface-container-low text-caption text-on-surface placeholder:text-outline border border-transparent focus:border-outline-variant focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary-container transition-all" />
            </div>

            <!-- Category Pills -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              @for (cat of categories; track cat) {
                <button
                  type="button"
                  (click)="selectCategory(cat)"
                  [class]="selectedCategory() === cat 
                    ? 'px-3 py-1.5 rounded-lg bg-primary-container text-pure-white font-label-sm text-xs font-semibold shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-container' 
                    : 'px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-sm text-xs font-medium border border-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container'">
                  {{ cat }}
                </button>
              }
            </div>
          </div>

          <!-- Workflow Cards Grid -->
          @if (workflowService.isLoading()) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              @for (i of [1, 2, 3, 4, 5, 6]; track i) {
                <div class="h-64 rounded-xl bg-surface-container-lowest border border-surface-container-high p-space-lg flex flex-col justify-between animate-pulse">
                  <div class="space-y-3">
                    <div class="h-4 w-28 bg-surface-container-highest rounded"></div>
                    <div class="h-6 w-3/4 bg-surface-container-high rounded"></div>
                    <div class="h-12 w-full bg-surface-container-low rounded"></div>
                  </div>
                  <div class="h-10 w-full bg-surface-container-highest rounded-lg"></div>
                </div>
              }
            </div>
          } @else if (filteredWorkflows().length === 0) {
            <div class="bg-surface-container-lowest rounded-xl border border-surface-container-high p-space-4xl flex flex-col items-center justify-center text-center">
              <div class="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant mb-space-md">
                <svg class="w-8 h-8 text-outline" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 12h8"></path>
                </svg>
              </div>
              <h3 class="text-body-lg font-bold text-primary">No Workflows Found</h3>
              <p class="text-caption text-on-surface-variant max-w-sm mt-1">No workflow definitions match your active search and category filters. Create a new definition to begin.</p>
              <button
                type="button"
                (click)="openCreateModal()"
                class="mt-space-md px-space-md py-2 rounded-lg bg-secondary-container hover:bg-secondary text-noir-text hover:text-pure-white font-label-md text-xs font-bold transition-all shadow-sm">
                + Create Workflow
              </button>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              @for (wf of filteredWorkflows(); track wf.id) {
                <div class="group bg-surface-container-lowest rounded-xl border border-surface-container-high hover:border-primary-container/40 hover:shadow-md transition-all flex flex-col justify-between p-space-lg relative">
                  <!-- Card Header -->
                  <div class="flex flex-col gap-space-xs">
                    <div class="flex items-center justify-between gap-2">
                      <span class="text-[11px] font-mono text-outline font-medium tracking-tight truncate max-w-[180px]">{{ wf.department }}</span>
                      
                      <!-- Status Badge -->
                      @if (wf.status === 'Published') {
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-success/15 text-success font-label-sm text-[11px] font-bold border border-success/20">
                          <span class="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                          v{{ wf.currentVersionNumber }}.0 (Live)
                        </span>
                      } @else {
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-label-sm text-[11px] font-bold border border-secondary-container/30">
                          <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                          Draft v{{ wf.currentVersionNumber }}.0
                        </span>
                      }
                    </div>

                    <a [routerLink]="['/workflows', wf.id, 'designer']" class="text-body-md font-bold text-primary group-hover:text-secondary transition-colors mt-1 line-clamp-1">
                      {{ wf.title }}
                    </a>

                    <span class="text-[11px] font-mono text-on-surface-variant truncate">
                      {{ wf.key }}
                    </span>

                    <p class="text-caption text-on-surface-variant line-clamp-2 mt-1">
                      {{ wf.description }}
                    </p>
                  </div>

                  <!-- Card Metrics & Footer -->
                  <div class="mt-space-lg pt-space-md border-t border-surface-container flex items-center justify-between">
                    <div class="flex items-center gap-3 text-caption text-on-surface-variant">
                      <span class="flex items-center gap-1 font-mono text-[11px]">
                        <svg class="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="3"></circle>
                          <circle cx="19" cy="6" r="2"></circle>
                          <circle cx="5" cy="18" r="2"></circle>
                        </svg>
                        {{ wf.nodeCount || 5 }} nodes
                      </span>
                      <span class="w-1 h-1 rounded-full bg-outline-variant"></span>
                      <span class="font-sans text-[11px]">{{ wf.category }}</span>
                    </div>

                    <a
                      [routerLink]="['/workflows', wf.id, 'designer']"
                      class="h-8 px-3 rounded-lg bg-primary-container text-pure-white hover:bg-primary font-label-sm text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs">
                      <span>Designer</span>
                      <svg class="w-3.5 h-3.5 text-secondary-container" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </a>
                  </div>
                </div>
              }
            </div>
          }
        </main>
      </div>

      <!-- Create Workflow Modal -->
      @if (showCreateModal()) {
        <div class="fixed inset-0 z-50 bg-noir-text/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="modal-title-workflow" class="bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-2xl max-w-lg w-full max-w-[calc(100vw-2rem)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <!-- Modal Header -->
            <div class="p-space-lg bg-primary-container text-pure-white flex items-center justify-between border-b border-primary">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-secondary-container text-noir-text flex items-center justify-center font-bold">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <line x1="12" x2="12" y1="5" y2="19"></line>
                    <line x1="5" x2="19" y1="12" y2="12"></line>
                  </svg>
                </div>
                <div>
                  <h3 id="modal-title-workflow" class="font-bold text-pure-white text-body-lg">Create New Workflow</h3>
                  <p class="text-caption text-on-primary-container text-[11px]">Define core identifiers and governance boundaries.</p>
                </div>
              </div>
              <button
                type="button"
                (click)="closeCreateModal()"
                aria-label="Fermer la boîte de dialogue"
                class="text-on-primary-container hover:text-pure-white p-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-container">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <line x1="18" x2="6" y1="6" y2="18"></line>
                  <line x1="6" x2="18" y1="6" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- Modal Form -->
            <form (ngSubmit)="submitCreateWorkflow()" class="p-space-lg space-y-space-md">
              @if (modalError()) {
                <div class="p-3 rounded-lg bg-error-container text-error text-caption font-medium border border-error/20 flex items-center gap-2">
                  <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" x2="12" y1="8" y2="12"></line>
                    <line x1="12" x2="12.01" y1="16" y2="16"></line>
                  </svg>
                  <span>{{ modalError() }}</span>
                </div>
              }

              <div>
                <label for="new-wf-key" class="block text-caption font-semibold text-on-surface mb-1">Unique Slug Key *</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-outline font-medium">wf-</span>
                  <input
                    type="text"
                    [(ngModel)]="newWorkflowKey"
                    name="key"
                    required
                    id="new-wf-key" placeholder="enterprise-approval-service"
                    class="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-container-low text-caption font-mono text-on-surface border border-surface-container focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container focus:outline-none transition-all" />
                </div>
                <span class="text-[11px] text-outline mt-0.5 block">Alphanumeric lowercase and hyphens only.</span>
              </div>

              <div>
                <label for="new-wf-title" class="block text-caption font-semibold text-on-surface mb-1">Workflow Title *</label>
                <input
                  type="text"
                  [(ngModel)]="newWorkflowTitle"
                  name="title"
                  required
                  id="new-wf-title" placeholder="e.g. Global CapEx & Infrastructure Purchase Approval"
                  class="w-full h-9 px-3 rounded-lg bg-surface-container-low text-caption text-on-surface border border-surface-container focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container focus:outline-none transition-all" />
              </div>

              <div>
                <label for="new-wf-desc" class="block text-caption font-semibold text-on-surface mb-1">Description</label>
                <textarea
                  [(ngModel)]="newWorkflowDesc"
                  name="desc"
                  rows="2"
                  id="new-wf-desc" placeholder="Summary of SLA targets, trigger requirements, and stakeholders..."
                  class="w-full p-2.5 rounded-lg bg-surface-container-low text-caption text-on-surface border border-surface-container focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container focus:outline-none transition-all"></textarea>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div>
                  <label for="new-wf-dept" class="block text-caption font-semibold text-on-surface mb-1">Department *</label>
                  <input
                    type="text"
                    [(ngModel)]="newWorkflowDept"
                    name="department"
                    required
                    id="new-wf-dept" placeholder="Financial Operations"
                    class="w-full h-9 px-3 rounded-lg bg-surface-container-low text-caption text-on-surface border border-surface-container focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container focus:outline-none transition-all" />
                </div>
                <div>
                  <label for="new-wf-cat" class="block text-caption font-semibold text-on-surface mb-1">Category *</label>
                  <select
                    id="new-wf-cat" [(ngModel)]="newWorkflowCat"
                    name="category"
                    class="w-full h-9 px-2.5 rounded-lg bg-surface-container-low text-caption text-on-surface border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary-container transition-all">
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="IT Ops & Cloud">IT Ops & Cloud</option>
                    <option value="SecOps & IAM">SecOps & IAM</option>
                    <option value="People Ops & HR">People Ops & HR</option>
                  </select>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="pt-space-md border-t border-surface-container flex items-center justify-end gap-2">
                <button
                  type="button"
                  (click)="closeCreateModal()"
                  class="h-9 px-space-md rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs font-semibold transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="isSubmitting()"
                  class="h-9 px-space-lg rounded-lg bg-secondary-container hover:bg-secondary text-noir-text hover:text-pure-white font-label-md text-xs font-bold transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5">
                  @if (isSubmitting()) {
                    <svg class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                      <path d="M4 12a8 8 0 018-8"></path>
                    </svg>
                  }
                  <span>Create & Open Designer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class WorkflowsComponent implements OnInit {
  readonly workflowService = inject(WorkflowService);
  private readonly router = inject(Router);

  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<string>('All');
  readonly showCreateModal = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);
  readonly modalError = signal<string | null>(null);

  newWorkflowKey = '';
  newWorkflowTitle = '';
  newWorkflowDesc = '';
  newWorkflowDept = 'Financial Operations';
  newWorkflowCat = 'Finance & Accounting';

  readonly categories = [
    'All',
    'Finance & Accounting',
    'IT Ops & Cloud',
    'SecOps & IAM',
    'People Ops & HR'
  ];

  readonly filteredWorkflows = computed(() => {
    const list = this.workflowService.workflows();
    const cat = this.selectedCategory();
    const query = this.searchQuery().toLowerCase().trim();

    return list.filter(wf => {
      const matchCat = cat === 'All' || wf.category === cat || wf.department === cat;
      const matchQuery = !query ||
        wf.title.toLowerCase().includes(query) ||
        wf.key.toLowerCase().includes(query) ||
        wf.department.toLowerCase().includes(query);

      return matchCat && matchQuery;
    });
  });

  ngOnInit(): void {
    this.workflowService.loadWorkflows().subscribe();
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  onFilterChanged(): void {
    // computed automatically re-filters
  }

  openCreateModal(): void {
    this.newWorkflowKey = '';
    this.newWorkflowTitle = '';
    this.newWorkflowDesc = '';
    this.newWorkflowDept = 'Financial Operations';
    this.newWorkflowCat = 'Finance & Accounting';
    this.modalError.set(null);
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  submitCreateWorkflow(): void {
    if (!this.newWorkflowKey || !this.newWorkflowTitle) {
      this.modalError.set('La clé et le titre du workflow sont obligatoires.');
      return;
    }

    const formattedKey = this.newWorkflowKey.startsWith('wf-')
      ? this.newWorkflowKey
      : `wf-${this.newWorkflowKey}`;

    const request: CreateWorkflowRequest = {
      key: formattedKey,
      title: this.newWorkflowTitle,
      description: this.newWorkflowDesc,
      department: this.newWorkflowDept,
      category: this.newWorkflowCat
    };

    this.isSubmitting.set(true);
    this.modalError.set(null);

    this.workflowService.createWorkflow(request).subscribe({
      next: (created) => {
        this.isSubmitting.set(false);
        this.showCreateModal.set(false);
        this.router.navigate(['/workflows', created.id, 'designer']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.modalError.set(err.message || 'Échec de la création du workflow.');
      }
    });
  }
}
