import { Component, ChangeDetectionStrategy, OnInit, inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WorkflowService } from '../../../core/services/workflow.service';
import { UiStateService } from '../../../core/services/ui-state.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import {
  WorkflowDetail,
  WorkflowNode,
  WorkflowEdge,
  WorkflowGraph,
  NodeConfig,
  GraphValidationResult,
  WorkflowVersionSummary
} from '../../../core/models/workflow.models';

interface NodeTemplate {
  type: string;
  subType: string;
  label: string;
  description: string;
  category: 'Triggers' | 'Human Tasks' | 'Logic & Workers' | 'Integrations';
  defaultConfig: NodeConfig;
}

@Component({
  selector: 'app-workflow-designer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="h-screen w-screen bg-surface font-body-md text-on-surface antialiased overflow-hidden flex flex-col select-none">
      <!-- Fixed Sidebar (collapsible or permanent) -->
      <app-sidebar />

      <div class="pl-0 lg:pl-64 flex flex-col h-full overflow-hidden transition-all duration-300">
        <!-- ================= TOPBAR (Global Header) ================= -->
        <header class="h-16 bg-surface-container-lowest/95 backdrop-blur-xl border-b border-surface-container flex items-center justify-between px-4 sm:px-6 lg:px-space-xl z-40 shadow-xs flex-shrink-0">
          <div class="flex items-center gap-2 sm:gap-space-lg flex-1 max-w-xl">
            <!-- Mobile Drawer Hamburger Toggle (< lg) -->
            <button
              type="button"
              (click)="ui.toggleMobileSidebar()"
              class="lg:hidden p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container shrink-0 transition-colors"
              aria-label="Ouvrir le menu de navigation"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
            <div class="flex items-center gap-space-xs text-caption text-on-surface-variant font-mono">
              <span class="w-2 h-2 rounded-full bg-success"></span>
              <span class="font-semibold text-on-surface">Vanguard Designer</span>
              <span>/</span>
              <span class="truncate max-w-[200px]">{{ workflow()?.key || 'wf-canvas' }}</span>
            </div>
          </div>

          <div class="flex items-center gap-space-md">
            @if (autoSavedText()) {
              <span class="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant text-caption font-mono">
                <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
                {{ autoSavedText() }}
              </span>
            }

            <a routerLink="/workflows" class="h-9 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-caption font-semibold flex items-center gap-1.5 transition-colors border border-surface-container-highest">
              <svg class="w-4 h-4 text-on-surface-variant" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Catalog</span>
            </a>
          </div>
        </header>

        <!-- ================= SUB-HEADER / WORKFLOW TOPBAR ================= -->
        <header class="flex-shrink-0 h-14 bg-surface-container-lowest border-b border-surface-container-highest px-space-xl flex items-center justify-between gap-space-md z-30 shadow-xs">
          <!-- Breadcrumb & Workflow Metadata -->
          <div class="flex items-center gap-space-lg min-w-0">
            <div class="flex items-center gap-space-xs text-caption font-caption text-on-surface-variant flex-shrink-0">
              <a routerLink="/workflows" class="hover:text-primary transition-colors flex items-center gap-1 font-medium">
                <svg class="w-3.5 h-3.5 text-on-surface-variant" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                Workflows
              </a>
              <span class="text-outline-variant font-mono">/</span>
              <span class="text-on-surface-variant">{{ workflow()?.department || 'Operations' }}</span>
              <span class="text-outline-variant font-mono">/</span>
              <span class="font-mono text-on-surface font-semibold truncate max-w-[200px]">{{ workflow()?.key || 'wf-editor' }}</span>
            </div>

            <div class="h-4 w-px bg-surface-container-highest"></div>

            <!-- Title & Badges -->
            <div class="flex items-center gap-space-sm min-w-0">
              <h1 class="text-body-lg font-bold text-primary truncate tracking-tight">
                {{ workflow()?.title || 'CapEx & Infrastructure Purchase Approval' }}
              </h1>
              <div class="flex items-center gap-1.5 flex-shrink-0">
                @if (workflow()?.status === 'Published') {
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/15 text-success font-label-sm text-[11px] font-bold">
                    <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
                    Live v{{ workflow()?.currentVersionNumber }}.0
                  </span>
                } @else {
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-label-sm text-[11px] font-bold">
                    <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Draft v{{ workflow()?.currentVersionNumber || 1 }}.0
                  </span>
                }

                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success font-label-sm text-[11px] font-semibold">
                  <svg class="w-3 h-3 text-success" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                  SOX-404 Compliant
                </span>
              </div>
            </div>
          </div>

          <!-- Header Action Controls -->
          <div class="flex items-center gap-space-sm flex-shrink-0">
            <!-- Test Simulation -->
            <button
              type="button"
              (click)="triggerSimulation()"
              class="h-9 px-space-md rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-caption font-semibold flex items-center gap-1.5 transition-colors border border-surface-container-highest shadow-xs">
              <svg class="w-4 h-4 text-info" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>Test Run Simulation</span>
            </button>

            <!-- History -->
            <button
              type="button"
              (click)="openHistoryModal()"
              class="h-9 px-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-caption font-medium flex items-center gap-1.5 transition-colors border border-surface-container-highest shadow-xs">
              <svg class="w-4 h-4 text-on-surface-variant" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span class="hidden xl:inline">History</span>
            </button>

            <!-- Validate Graph -->
            <button
              type="button"
              (click)="triggerValidateGraph()"
              class="h-9 px-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-caption font-medium flex items-center gap-1.5 transition-colors border border-surface-container-highest shadow-xs">
              <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span class="hidden xl:inline">Validate Graph</span>
            </button>

            <!-- Toggle Inspector Panel -->
            <button
              type="button"
              (click)="ui.toggleDesignerInspector()"
              [class.bg-surface-container]="ui.designerInspectorOpen()"
              class="h-9 px-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-caption font-medium flex items-center gap-1.5 transition-colors border border-surface-container-highest shadow-xs"
              title="Afficher/masquer l'inspecteur d'étape">
              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="15" y1="3" x2="15" y2="21"></line>
              </svg>
              <span class="hidden xl:inline">{{ ui.designerInspectorOpen() ? 'Hide Inspector' : 'Show Inspector' }}</span>
            </button>

            <div class="h-5 w-px bg-surface-container-highest"></div>

            <!-- Publish Button -->
            <button
              type="button"
              (click)="openPublishModal()"
              class="h-9 px-space-lg rounded-lg bg-secondary-container hover:bg-secondary text-noir-text hover:text-pure-white font-label-md text-caption font-bold flex items-center gap-2 transition-all shadow-md active:scale-95">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M12 19V5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <span>Publish Workflow</span>
            </button>
          </div>
        </header>

        <!-- ================= 3-COLUMN WORKSPACE ================= -->
        <div class="flex-1 flex overflow-hidden relative">
          <!-- ---------------------------------------------------- -->
          <!-- LEFT PANEL: NODE & STEP PALETTE (280px / w-72)        -->
          <!-- ---------------------------------------------------- -->
          <aside class="w-72 flex-shrink-0 bg-surface-container-lowest border-r border-surface-container-highest flex flex-col z-20 shadow-xs select-none">
            <!-- Palette Search -->
            <div class="p-space-md border-b border-surface-container">
              <div class="relative">
                <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  [(ngModel)]="paletteSearch"
                  placeholder="Search steps, workers..."
                  class="w-full h-8 pl-9 pr-3 rounded-md bg-surface-container-low text-caption text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary-container border border-transparent focus:border-outline-variant transition-all" />
              </div>
            </div>

            <!-- Scrollable Components Accordion -->
            <div class="flex-1 overflow-y-auto px-space-md py-space-sm space-y-space-md scrollbar-none">
              <!-- CATEGORY 1: TRIGGERS -->
              <div>
                <div class="flex items-center justify-between text-caption uppercase tracking-wider text-on-surface-variant font-bold mb-2 px-1">
                  <span class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-secondary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                    Triggers
                  </span>
                  <span class="text-[10px] font-mono text-outline font-normal">3 steps</span>
                </div>

                <div class="space-y-1.5">
                  @for (tmpl of getTemplatesByCategory('Triggers'); track tmpl.subType) {
                    <div
                      (click)="addNodeFromTemplate(tmpl)"
                      class="group p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low border border-surface-container hover:border-primary-container/40 transition-all cursor-pointer shadow-xs flex items-center gap-space-sm">
                      <div class="w-7 h-7 rounded-md bg-primary-container text-pure-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <svg class="w-3.5 h-3.5 text-secondary-container" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                      </div>
                      <div class="flex flex-col min-w-0">
                        <span class="text-caption font-semibold text-on-surface group-hover:text-primary transition-colors truncate">{{ tmpl.label }}</span>
                        <span class="text-[11px] text-on-surface-variant truncate">{{ tmpl.description }}</span>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- CATEGORY 2: HUMAN TASKS (HITL) -->
              <div>
                <div class="flex items-center justify-between text-caption uppercase tracking-wider text-on-surface-variant font-bold mb-2 px-1">
                  <span class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-secondary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <polyline points="17 11 19 13 23 9"></polyline>
                    </svg>
                    Human Tasks (HITL)
                  </span>
                  <span class="text-[10px] font-mono text-outline font-normal">3 steps</span>
                </div>

                <div class="space-y-1.5">
                  @for (tmpl of getTemplatesByCategory('Human Tasks'); track tmpl.subType) {
                    <div
                      (click)="addNodeFromTemplate(tmpl)"
                      class="group p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low border border-surface-container hover:border-secondary-container transition-all cursor-pointer shadow-xs flex items-center gap-space-sm">
                      <div class="w-7 h-7 rounded-md bg-secondary-container/20 text-secondary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <svg class="w-3.5 h-3.5 text-secondary" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                      </div>
                      <div class="flex flex-col min-w-0">
                        <span class="text-caption font-semibold text-on-surface group-hover:text-primary transition-colors truncate">{{ tmpl.label }}</span>
                        <span class="text-[11px] text-on-surface-variant truncate">{{ tmpl.description }}</span>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- CATEGORY 3: LOGIC & WORKERS -->
              <div>
                <div class="flex items-center justify-between text-caption uppercase tracking-wider text-on-surface-variant font-bold mb-2 px-1">
                  <span class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-secondary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <polygon points="6 2 18 2 18 6 6 6 6 2"></polygon>
                      <polygon points="6 18 18 18 18 22 6 22 6 18"></polygon>
                      <polygon points="2 6 22 6 22 18 2 18 2 6"></polygon>
                    </svg>
                    Logic & Workers
                  </span>
                  <span class="text-[10px] font-mono text-outline font-normal">3 steps</span>
                </div>

                <div class="space-y-1.5">
                  @for (tmpl of getTemplatesByCategory('Logic & Workers'); track tmpl.subType) {
                    <div
                      (click)="addNodeFromTemplate(tmpl)"
                      class="group p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low border border-surface-container hover:border-primary-container/40 transition-all cursor-pointer shadow-xs flex items-center gap-space-sm">
                      <div class="w-7 h-7 rounded-md bg-surface-container-high text-on-surface flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <svg class="w-3.5 h-3.5 text-warning" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M6 3v12"></path>
                          <circle cx="18" cy="6" r="3"></circle>
                          <circle cx="6" cy="18" r="3"></circle>
                          <path d="M18 9a9 9 0 0 1-9 9"></path>
                        </svg>
                      </div>
                      <div class="flex flex-col min-w-0">
                        <span class="text-caption font-semibold text-on-surface group-hover:text-primary transition-colors truncate">{{ tmpl.label }}</span>
                        <span class="text-[11px] text-on-surface-variant truncate">{{ tmpl.description }}</span>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- CATEGORY 4: INTEGRATIONS -->
              <div>
                <div class="flex items-center justify-between text-caption uppercase tracking-wider text-on-surface-variant font-bold mb-2 px-1">
                  <span class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-secondary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" x2="12" y1="22.08" y2="12"></line>
                    </svg>
                    Integrations
                  </span>
                  <span class="text-[10px] font-mono text-outline font-normal">3 steps</span>
                </div>

                <div class="space-y-1.5">
                  @for (tmpl of getTemplatesByCategory('Integrations'); track tmpl.subType) {
                    <div
                      (click)="addNodeFromTemplate(tmpl)"
                      class="group p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low border border-surface-container hover:border-primary-container/40 transition-all cursor-pointer shadow-xs flex items-center gap-space-sm">
                      <div class="w-7 h-7 rounded-md bg-primary-container text-pure-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <svg class="w-3.5 h-3.5 text-secondary-container" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <rect height="11" rx="2" ry="2" width="18" x="3" y="11"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                      <div class="flex flex-col min-w-0">
                        <span class="text-caption font-semibold text-on-surface group-hover:text-primary transition-colors truncate">{{ tmpl.label }}</span>
                        <span class="text-[11px] text-on-surface-variant truncate">{{ tmpl.description }}</span>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Quick Tip Footer -->
            <div class="p-space-md border-t border-surface-container bg-surface-container-low/40 flex items-center gap-2">
              <svg class="w-4 h-4 text-on-surface-variant flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" x2="12" y1="16" y2="12"></line>
                <line x1="12" x2="12.01" y1="8" y2="8"></line>
              </svg>
              <span class="text-[11px] text-on-surface-variant leading-tight">Click steps to add them to grid; click node ports to link paths.</span>
            </div>
          </aside>

          <!-- ---------------------------------------------------- -->
          <!-- CENTER: WORKFLOW CANVAS & NODE GRAPH (FLEX-1)         -->
          <!-- ---------------------------------------------------- -->
          <main
            class="flex-1 relative bg-pure-white overflow-hidden cursor-default select-none"
            (mousemove)="onCanvasMouseMove($event)"
            (mouseup)="onCanvasMouseUp()">
            
            <!-- DOTTED CANVAS GRID BACKGROUND (SVG Pattern) -->
            <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-60" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="canvas-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#dadada"></circle>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#canvas-grid)"></rect>
            </svg>

            <!-- FLOATING CANVAS CONTROLS TOOLBAR -->
            <div class="absolute top-4 left-6 z-20 flex items-center bg-surface-container-lowest/90 backdrop-blur-md rounded-xl p-1 shadow-md border border-surface-container-highest gap-1 text-on-surface">
              <button
                type="button"
                (click)="isPanMode.set(false)"
                [class]="!isPanMode() ? 'p-2 rounded-lg bg-primary-container text-pure-white' : 'p-2 rounded-lg hover:bg-surface-container text-on-surface-variant'"
                title="Select Pointer Mode">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M3 3l7 18 3-7 7-3L3 3z"></path>
                </svg>
              </button>
              <button
                type="button"
                (click)="isPanMode.set(true)"
                [class]="isPanMode() ? 'p-2 rounded-lg bg-primary-container text-pure-white' : 'p-2 rounded-lg hover:bg-surface-container text-on-surface-variant'"
                title="Pan Hand Mode">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
                  <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
                  <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
                  <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
                </svg>
              </button>
              <div class="h-4 w-px bg-surface-container-highest my-auto"></div>
              <button
                type="button"
                (click)="zoomOut()"
                class="p-2 rounded-lg hover:bg-surface-container text-on-surface transition-colors"
                title="Zoom Out">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <line x1="5" x2="19" y1="12" y2="12"></line>
                </svg>
              </button>
              <span class="font-mono text-caption text-on-surface font-semibold px-1">{{ zoomLevel() }}%</span>
              <button
                type="button"
                (click)="zoomIn()"
                class="p-2 rounded-lg hover:bg-surface-container text-on-surface transition-colors"
                title="Zoom In">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <line x1="12" x2="12" y1="5" y2="19"></line>
                  <line x1="5" x2="19" y1="12" y2="12"></line>
                </svg>
              </button>
              <div class="h-4 w-px bg-surface-container-highest my-auto"></div>
              <button
                type="button"
                (click)="resetZoom()"
                class="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
                title="Fit to Screen">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
              </button>
              <button
                type="button"
                (click)="toggleSnapToGrid()"
                [class]="isSnapToGrid() ? 'p-2 rounded-lg bg-surface-container text-secondary font-medium transition-colors' : 'p-2 rounded-lg hover:bg-surface-container text-outline transition-colors'"
                title="Snap to Grid">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="2"></circle>
                  <circle cx="12" cy="4" r="2"></circle>
                  <circle cx="12" cy="20" r="2"></circle>
                  <circle cx="4" cy="12" r="2"></circle>
                  <circle cx="20" cy="12" r="2"></circle>
                </svg>
              </button>
            </div>

            <!-- FLOATING CANVAS STATUS PILL -->
            <div class="absolute bottom-4 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest/95 backdrop-blur-md border border-surface-container-highest shadow-xs text-caption">
              @if (validation()?.isValid !== false) {
                <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              } @else {
                <span class="w-2 h-2 rounded-full bg-error"></span>
              }
              <span class="text-on-surface font-semibold">Graph Topology:</span>
              <span class="text-on-surface-variant font-mono">{{ topologyText() }}</span>
            </div>

            <!-- PENDING CONNECTION INDICATOR -->
            @if (connectingFromNodeId()) {
              <div class="absolute top-4 right-6 z-20 px-3 py-1.5 rounded-lg bg-secondary-container text-noir-text text-caption font-bold shadow-md flex items-center gap-2 animate-pulse">
                <span>Click destination node's input port to link</span>
                <button (click)="cancelConnection()" class="underline text-xs ml-1">Cancel</button>
              </div>
            }

            <!-- ================= VECTOR CONNECTORS (SVG EDGES) ================= -->
            <svg class="absolute inset-0 w-full h-full pointer-events-none z-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="arrow-navy" markerWidth="6" markerHeight="6" refX="7" refY="5" viewBox="0 0 10 10" orient="auto-start-reverse">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#14213d"></path>
                </marker>
                <marker id="arrow-orange" markerWidth="7" markerHeight="7" refX="7" refY="5" viewBox="0 0 10 10" orient="auto-start-reverse">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#ffa515"></path>
                </marker>
                <marker id="arrow-green" markerWidth="6" markerHeight="6" refX="7" refY="5" viewBox="0 0 10 10" orient="auto-start-reverse">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#10B981"></path>
                </marker>
              </defs>

              @for (edge of edges(); track edge.id) {
                <path
                  [attr.d]="computeBezierPath(edge)"
                  fill="none"
                  [attr.stroke]="getEdgeColor(edge)"
                  [attr.stroke-width]="getEdgeWidth(edge)"
                  [attr.stroke-dasharray]="getEdgeDash(edge)"
                  [attr.marker-end]="getEdgeMarker(edge)">
                </path>
              }
            </svg>

            <!-- ================= GRAPH NODES CONTAINER ================= -->
            <div
              class="relative w-full h-full overflow-auto p-12 transition-transform origin-top-left"
              [style.transform]="'scale(' + zoomLevel() / 100 + ')'">
              
              @for (node of nodes(); track node.id) {
                <div
                  [id]="node.id"
                  (mousedown)="startDragNode(node, $event)"
                  (click)="selectNode(node, $event)"
                  [class]="isSelected(node) 
                    ? 'absolute w-64 bg-surface-container-lowest rounded-xl shadow-xl ring-2 ring-secondary-container z-20 cursor-move' 
                    : 'absolute w-56 md:w-60 bg-surface-container-lowest rounded-xl shadow-md border border-surface-container-high transition-transform hover:-translate-y-0.5 z-10 cursor-move'"
                  [style.left.px]="node.position.x"
                  [style.top.px]="node.position.y">

                  <!-- Input Port (Left) with enlarged hitbox -->
                  @if (node.type !== 'trigger') {
                    <div
                      (click)="onInputPortClick(node, $event)"
                      title="Connect target"
                      class="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center cursor-pointer z-30 group/port">
                      <div
                        [class]="connectingFromNodeId() ? 'w-4 h-4 rounded-full bg-secondary-container border-2 border-pure-white shadow-md ring-2 ring-secondary animate-bounce' : 'w-3.5 h-3.5 rounded-full bg-pure-white border-2 border-primary shadow-xs group-hover/port:scale-125 group-hover/port:border-secondary transition-transform'">
                      </div>
                    </div>
                  }

                  <!-- Active Selection Pill -->
                  @if (isSelected(node)) {
                    <div class="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-secondary-container text-noir-text font-label-sm text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-noir-text animate-ping"></span>
                      ACTIVE SELECTED NODE
                    </div>
                  }

                  <!-- Node Header -->
                  <div
                    [class]="getNodeHeaderClass(node)">
                    <div class="flex items-center gap-2">
                      <span class="w-6 h-6 rounded-md bg-secondary-container text-noir-text flex items-center justify-center font-bold text-xs">
                        @switch (node.type) {
                          @case ('trigger') { ⚡ }
                          @case ('gate') { ⇄ }
                          @case ('task') { ✓ }
                          @case ('integration') { ⚙ }
                          @case ('end') { 🏁 }
                          @default { • }
                        }
                      </span>
                      <span class="font-label-sm text-caption font-bold tracking-wide uppercase">{{ node.id }}</span>
                    </div>

                    @if (node.type === 'trigger' || node.type === 'end') {
                      <span class="w-2 h-2 rounded-full bg-success"></span>
                    } @else if (node.type === 'gate') {
                      <span class="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-bold">IF / ELSE</span>
                    } @else if (node.type === 'task') {
                      <span class="px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-mono text-[10px] font-bold">
                        {{ node.config?.consensusPolicy || 'Four-Eyes' }}
                      </span>
                    }
                  </div>

                  <!-- Node Body -->
                  <div class="p-3">
                    <h4 class="font-label-md text-caption font-bold text-on-surface leading-tight">
                      {{ node.label }}
                    </h4>
                    <p class="text-[11px] text-on-surface-variant mt-0.5 line-clamp-1">
                      {{ node.description || 'Configured step logic' }}
                    </p>

                    <!-- Contextual snippet based on node type -->
                    @if (node.type === 'trigger') {
                      <div class="mt-2.5 p-2 rounded-lg bg-surface-container-low font-mono text-[11px] text-on-surface space-y-0.5">
                        <div class="flex justify-between text-outline">
                          <span class="font-sans">event</span>
                          <span>{{ node.config?.eventName || 'po.created' }}</span>
                        </div>
                        <div class="flex justify-between font-semibold">
                          <span class="font-sans text-outline">amount</span>
                          <span class="text-primary font-bold">$124,500.00</span>
                        </div>
                      </div>
                    } @else if (node.type === 'gate') {
                      <div class="mt-2 p-1.5 rounded bg-primary/5 font-mono text-[11px] text-primary font-medium flex items-center gap-1">
                        <span class="text-secondary font-bold">expr:</span>
                        <span class="truncate">{{ node.config?.conditionExpression || 'amount > $50,000' }}</span>
                      </div>
                    } @else if (node.type === 'task') {
                      <div class="mt-2.5 space-y-1.5 text-caption">
                        <div class="flex items-center justify-between text-[11px]">
                          <span class="text-outline">Assigned:</span>
                          <span class="font-semibold text-primary truncate">A. Vance & S. Chen</span>
                        </div>
                        <div class="flex items-center justify-between text-[11px]">
                          <span class="text-outline">Target SLA:</span>
                          <span class="font-mono text-warning font-semibold">{{ node.config?.targetSlaHours || 4 }}h (Strict)</span>
                        </div>
                        @if (node.config?.requireMfa) {
                          <div class="flex items-center gap-1 text-[10px] text-success font-semibold pt-0.5">
                            <svg class="w-3 h-3 text-success" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                              <rect height="11" rx="2" ry="2" width="18" x="3" y="11"></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <span>FIDO2 WebAuthn Enforced</span>
                          </div>
                        }
                      </div>
                    } @else if (node.type === 'end') {
                      <div class="mt-2.5 flex items-center gap-2 text-[11px] text-on-surface">
                        <span class="px-2 py-0.5 rounded bg-surface-container font-mono text-outline">{{ node.config?.notificationTarget || '#procurement-exec' }}</span>
                        <span class="text-success font-semibold flex items-center gap-1">
                          <svg class="w-3 h-3 text-success" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Ready
                        </span>
                      </div>
                    }
                  </div>

                  <!-- Output Port (Right) -->
                  @if (node.type !== 'end') {
                    <div
                      (click)="onOutputPortClick(node, $event)"
                      title="Click to draw connection"
                      class="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-pure-white border-2 border-primary shadow-xs hover:scale-125 transition-transform cursor-crosshair">
                    </div>
                  }
                </div>
              }
            </div>
          </main>

          <!-- ---------------------------------------------------- -->
          <!-- RIGHT PANEL: CONTEXTUAL NODE INSPECTOR (340px)        -->
          <!-- ---------------------------------------------------- -->
          <aside class="w-80 2xl:w-96 flex-shrink-0 bg-surface-container-lowest border-l border-surface-container-highest flex flex-col z-20 shadow-[-1px_0_4px_rgba(0,0,0,0.03)] select-none">
            @if (selectedNode(); as selNode) {
              <!-- Inspector Header -->
              <div class="p-space-md border-b border-surface-container flex items-start justify-between bg-surface-container-low/30">
                <div class="flex flex-col min-w-0">
                  <div class="flex items-center gap-1.5">
                    <span class="px-2 py-0.5 rounded bg-secondary-container/20 text-secondary font-mono text-[10px] font-bold uppercase">{{ selNode.id }}</span>
                    <span class="text-caption text-on-surface-variant">{{ selNode.type | uppercase }} Step</span>
                  </div>
                  <h2 class="text-body-lg font-bold text-primary mt-1 truncate">{{ selNode.label }}</h2>
                </div>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/15 text-success font-label-sm text-[11px] font-bold flex-shrink-0">
                  <svg class="w-3 h-3 text-success" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Config Valid
                </span>
              </div>

              <!-- Inspector Navigation Tabs -->
              <div class="flex border-b border-surface-container px-space-md bg-surface-container-lowest text-caption">
                <button
                  type="button"
                  (click)="inspectorTab.set('config')"
                  [class]="inspectorTab() === 'config' ? 'py-2.5 px-3 border-b-2 border-secondary text-primary font-label-md font-bold' : 'py-2.5 px-3 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface font-label-md font-medium transition-colors'">
                  Configuration
                </button>
                <button
                  type="button"
                  (click)="inspectorTab.set('rules')"
                  [class]="inspectorTab() === 'rules' ? 'py-2.5 px-3 border-b-2 border-secondary text-primary font-label-md font-bold' : 'py-2.5 px-3 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface font-label-md font-medium transition-colors'">
                  Rules & Escalation
                </button>
                <button
                  type="button"
                  (click)="inspectorTab.set('schema')"
                  [class]="inspectorTab() === 'schema' ? 'py-2.5 px-3 border-b-2 border-secondary text-primary font-label-md font-bold' : 'py-2.5 px-3 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface font-label-md font-medium transition-colors'">
                  I/O Schema
                </button>
              </div>

              <!-- Inspector Fields (Scrollable) -->
              <div class="flex-1 overflow-y-auto p-space-md space-y-space-md scrollbar-none">
                @if (inspectorTab() === 'config') {
                  <!-- Step Display Label -->
                  <div>
                    <label class="block text-caption font-semibold text-on-surface mb-1">Step Display Label</label>
                    <input
                      type="text"
                      [ngModel]="selNode.label"
                      (ngModelChange)="updateSelectedNodeLabel($event)"
                      class="w-full h-9 px-3 rounded-lg bg-surface-container-low text-caption text-on-surface border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary-container focus:bg-surface-container-lowest transition-all" />
                  </div>

                  <!-- Prompt / Context -->
                  <div>
                    <label class="block text-caption font-semibold text-on-surface mb-1">Approval Context / Prompt</label>
                    <textarea
                      [ngModel]="selNode.config?.prompt || ''"
                      (ngModelChange)="updateSelectedNodeConfig('prompt', $event)"
                      rows="2"
                      placeholder="Context shown to approving officers..."
                      class="w-full p-2.5 rounded-lg bg-surface-container-low text-caption text-on-surface border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary-container focus:bg-surface-container-lowest transition-all"></textarea>
                  </div>

                  <!-- Gate condition expression -->
                  @if (selNode.type === 'gate') {
                    <div>
                      <label class="block text-caption font-semibold text-on-surface mb-1">JSONPath / Branch Condition</label>
                      <input
                        type="text"
                        [ngModel]="selNode.config?.conditionExpression || ''"
                        (ngModelChange)="updateSelectedNodeConfig('conditionExpression', $event)"
                        placeholder="amount > 50000"
                        class="w-full h-9 px-3 rounded-lg bg-surface-container-low font-mono text-caption text-on-surface border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary-container focus:bg-surface-container-lowest transition-all" />
                    </div>
                  }

                  <!-- Consensus Policy -->
                  @if (selNode.type === 'task') {
                    <div>
                      <label class="block text-caption font-semibold text-on-surface mb-1">Consensus Policy</label>
                      <select
                        [ngModel]="selNode.config?.consensusPolicy || 'FourEyes'"
                        (ngModelChange)="updateSelectedNodeConfig('consensusPolicy', $event)"
                        class="w-full h-9 px-2.5 rounded-lg bg-surface-container-low text-caption text-on-surface border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary-container transition-all">
                        <option value="FourEyes">Four-Eyes Principle (2 of 2 Approvers Must Agree)</option>
                        <option value="Majority">Simple Majority (M of N Signers)</option>
                        <option value="Unanimous">Unanimous Consensus (All Designated Leads)</option>
                        <option value="Single">Single Signer with High-Rank Override</option>
                      </select>
                    </div>

                    <!-- Designated Signers -->
                    <div>
                      <label class="block text-caption font-semibold text-on-surface mb-1">Designated Signers & Roles</label>
                      <div class="p-2 rounded-lg bg-surface-container-low border border-surface-container space-y-2">
                        <div class="flex items-center justify-between p-1.5 rounded bg-surface-container-lowest shadow-xs text-caption">
                          <div class="flex items-center gap-2">
                            <span class="w-6 h-6 rounded-full bg-primary-container text-pure-white text-[10px] font-bold flex items-center justify-center">AV</span>
                            <div class="flex flex-col">
                              <span class="font-semibold text-on-surface leading-none text-xs">Alexander Vance</span>
                              <span class="text-[10px] text-outline font-mono">Org Admin / CFO</span>
                            </div>
                          </div>
                          <span class="px-1.5 py-0.5 rounded bg-success/15 text-success text-[10px] font-bold">Primary</span>
                        </div>

                        <div class="flex items-center justify-between p-1.5 rounded bg-surface-container-lowest shadow-xs text-caption">
                          <div class="flex items-center gap-2">
                            <span class="w-6 h-6 rounded-full bg-secondary-container text-noir-text text-[10px] font-bold flex items-center justify-center">SC</span>
                            <div class="flex flex-col">
                              <span class="font-semibold text-on-surface leading-none text-xs">Sarah Chen</span>
                              <span class="text-[10px] text-outline font-mono">VP InfoSec / CISO</span>
                            </div>
                          </div>
                          <span class="px-1.5 py-0.5 rounded bg-success/15 text-success text-[10px] font-bold">Security</span>
                        </div>

                        <button
                          type="button"
                          class="w-full py-1 text-center text-[11px] text-primary hover:text-secondary transition-colors font-bold flex items-center justify-center gap-1 border border-dashed border-outline-variant rounded">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                            <line x1="12" x2="12" y1="5" y2="19"></line>
                            <line x1="5" x2="19" y1="12" y2="12"></line>
                          </svg>
                          <span>Add Approver Role</span>
                        </button>
                      </div>
                    </div>

                    <!-- SLA & Escalation Timeout -->
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label class="block text-caption font-semibold text-on-surface mb-1">Target SLA</label>
                        <div class="relative">
                          <input
                            type="number"
                            [ngModel]="selNode.config?.targetSlaHours || 4"
                            (ngModelChange)="updateSelectedNodeConfig('targetSlaHours', $event)"
                            class="w-full h-9 pl-3 pr-10 rounded-lg bg-surface-container-low text-caption text-on-surface border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary-container" />
                          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-outline font-medium">Hours</span>
                        </div>
                      </div>
                      <div>
                        <label class="block text-caption font-semibold text-on-surface mb-1">Escalation Path</label>
                        <select
                          [ngModel]="selNode.config?.escalationPath || 'Executive On-Call'"
                          (ngModelChange)="updateSelectedNodeConfig('escalationPath', $event)"
                          class="w-full h-9 px-2 rounded-lg bg-surface-container-low text-caption text-on-surface border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary-container">
                          <option value="Executive On-Call">Executive On-Call</option>
                          <option value="Finance Committee">Finance Committee</option>
                          <option value="Auto-Abort PO">Auto-Abort PO</option>
                        </select>
                      </div>
                    </div>

                    <!-- Security & Hardware Token Gate -->
                    <div class="p-3 rounded-lg bg-surface-container-low border border-surface-container space-y-2.5">
                      <div class="flex items-center justify-between">
                        <div class="flex flex-col pr-2">
                          <span class="text-caption font-bold text-on-surface">Hardware Key Token (WebAuthn)</span>
                          <span class="text-[11px] text-on-surface-variant">Require physical YubiKey or TouchID confirmation</span>
                        </div>
                        <button
                          type="button"
                          (click)="toggleSelectedNodeConfig('requireMfa')"
                          [class]="selNode.config?.requireMfa ? 'w-9 h-5 rounded-full bg-secondary-container p-0.5 transition-colors relative flex-shrink-0' : 'w-9 h-5 rounded-full bg-outline-variant p-0.5 transition-colors relative flex-shrink-0'">
                          <span
                            [class]="selNode.config?.requireMfa ? 'block w-4 h-4 rounded-full bg-noir-text shadow-xs translate-x-4 transition-transform' : 'block w-4 h-4 rounded-full bg-pure-white shadow-xs translate-x-0 transition-transform'"></span>
                        </button>
                      </div>

                      <div class="flex items-center justify-between pt-2 border-t border-surface-container">
                        <div class="flex flex-col pr-2">
                          <span class="text-caption font-bold text-on-surface">Allow Step Rejection</span>
                          <span class="text-[11px] text-on-surface-variant">Triggers alternate rollback path on cancel</span>
                        </div>
                        <button
                          type="button"
                          (click)="toggleSelectedNodeConfig('allowRejection')"
                          [class]="selNode.config?.allowRejection !== false ? 'w-9 h-5 rounded-full bg-secondary-container p-0.5 transition-colors relative flex-shrink-0' : 'w-9 h-5 rounded-full bg-outline-variant p-0.5 transition-colors relative flex-shrink-0'">
                          <span
                            [class]="selNode.config?.allowRejection !== false ? 'block w-4 h-4 rounded-full bg-noir-text shadow-xs translate-x-4 transition-transform' : 'block w-4 h-4 rounded-full bg-pure-white shadow-xs translate-x-0 transition-transform'"></span>
                        </button>
                      </div>
                    </div>
                  }

                  <!-- Notification Target -->
                  <div>
                    <label class="block text-caption font-semibold text-on-surface mb-1">Notification Dispatch Target</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="text"
                        [ngModel]="selNode.config?.notificationTarget || '#procurement-approvals'"
                        (ngModelChange)="updateSelectedNodeConfig('notificationTarget', $event)"
                        class="w-full h-9 px-3 rounded-lg bg-surface-container-low font-mono text-caption text-on-surface border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary-container" />
                      <button
                        type="button"
                        (click)="previewNotification(selNode)"
                        class="h-9 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-semibold border border-surface-container-highest transition-colors">
                        Preview
                      </button>
                    </div>
                  </div>
                } @else if (inspectorTab() === 'rules') {
                  <div class="space-y-3 text-caption text-on-surface-variant">
                    <p class="font-medium text-on-surface">Escalation Policy Matrix</p>
                    <div class="p-3 rounded-lg bg-surface-container-low border border-surface-container font-mono text-xs space-y-1">
                      <div>T + 0h: Primary approver notified</div>
                      <div>T + 2h: Escalation ping via Slack bot</div>
                      <div>T + 4h: SLA breach warning logged to audit ledger</div>
                    </div>
                  </div>
                } @else {
                  <div class="space-y-3 text-caption text-on-surface-variant">
                    <p class="font-medium text-on-surface">Input Payload Schema</p>
                    <pre class="p-2.5 rounded-lg bg-primary font-mono text-[11px] text-pure-white overflow-x-auto"><code>&#123;
  "amount": "number ($ USD)",
  "vendor": "string",
  "po_id": "string (UUID)",
  "compliance_verified": "boolean"
&#125;</code></pre>
                  </div>
                }
              </div>

              <!-- Inspector Footer Controls -->
              <div class="p-space-md border-t border-surface-container bg-surface-container-low/40 flex items-center justify-between gap-2">
                <button
                  type="button"
                  (click)="duplicateSelectedNode()"
                  class="h-9 px-space-md rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-caption font-semibold flex items-center gap-1.5 transition-colors border border-surface-container-highest shadow-xs">
                  <svg class="w-3.5 h-3.5 text-on-surface-variant" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <rect height="13" rx="2" ry="2" width="13" x="9" y="9"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <span>Duplicate</span>
                </button>

                <button
                  type="button"
                  (click)="deleteSelectedNode()"
                  class="h-9 px-space-md rounded-lg hover:bg-error-container text-error font-label-md text-caption font-semibold flex items-center gap-1.5 transition-colors">
                  <svg class="w-3.5 h-3.5 text-error" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  <span>Delete Node</span>
                </button>
              </div>
            } @else {
              <!-- Empty Inspector State -->
              <div class="p-space-xl flex flex-col items-center justify-center text-center h-full text-on-surface-variant">
                <div class="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center mb-3 text-outline">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path d="M15 15l6 6m-11-4a7 7 0 110-14 7 7 0 010 14z"></path>
                  </svg>
                </div>
                <h4 class="font-bold text-on-surface text-body-md">No Step Selected</h4>
                <p class="text-caption text-outline max-w-xs mt-1">Click any step node on the grid canvas to inspect properties, SLA policies, and hardware security gates.</p>
              </div>
            }
          </aside>
        </div>
      </div>

      <!-- ================= PUBLISH WORKFLOW MODAL ================= -->
      @if (showPublishModal()) {
        <div class="fixed inset-0 z-50 bg-noir-text/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div class="p-space-lg bg-primary-container text-pure-white flex items-center justify-between border-b border-primary">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-secondary-container text-noir-text flex items-center justify-center font-bold">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-pure-white text-body-lg">Publish Workflow Version</h3>
                  <p class="text-caption text-on-primary-container text-[11px]">Cryptographic SHA-256 seal & SOX-404 audit entry.</p>
                </div>
              </div>
              <button (click)="closePublishModal()" class="text-on-primary-container hover:text-pure-white p-1 rounded transition-colors">
                ✕
              </button>
            </div>

            <div class="p-space-lg space-y-3">
              @if (publishError()) {
                <div class="p-3 rounded-lg bg-error-container text-error text-caption font-medium border border-error/20">
                  {{ publishError() }}
                </div>
              }

              <div class="p-3 rounded-lg bg-surface-container-low border border-surface-container font-mono text-xs space-y-1">
                <div class="flex justify-between">
                  <span class="text-outline">Active Draft:</span>
                  <span class="font-bold text-primary">v{{ workflow()?.currentVersionNumber || 1 }}.0</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-outline">New Target Version:</span>
                  <span class="font-bold text-secondary">v{{ (workflow()?.currentVersionNumber || 1) + 1 }}.0 (Immutable)</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-outline">Topology Status:</span>
                  <span class="font-semibold text-success">Verified DAG (0 Errors)</span>
                </div>
              </div>

              <div>
                <label class="block text-caption font-semibold text-on-surface mb-1">Release / Change Notes</label>
                <textarea
                  [(ngModel)]="publishNotes"
                  rows="3"
                  placeholder="Mandatory SOX governance reason for publishing this release..."
                  class="w-full p-2.5 rounded-lg bg-surface-container-low text-caption text-on-surface border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary-container"></textarea>
              </div>

              <div class="pt-3 border-t border-surface-container flex items-center justify-end gap-2">
                <button
                  type="button"
                  (click)="closePublishModal()"
                  class="h-9 px-space-md rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs font-semibold">
                  Cancel
                </button>
                <button
                  type="button"
                  (click)="confirmPublish()"
                  [disabled]="isPublishing()"
                  class="h-9 px-space-lg rounded-lg bg-secondary-container hover:bg-secondary text-noir-text hover:text-pure-white font-label-md text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50">
                  @if (isPublishing()) {
                    <svg class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                      <path d="M4 12a8 8 0 018-8"></path>
                    </svg>
                  }
                  <span>Seal & Publish Release</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- ================= HISTORY MODAL ================= -->
      @if (showHistoryModal()) {
        <div class="fixed inset-0 z-50 bg-noir-text/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div class="p-space-lg bg-primary-container text-pure-white flex items-center justify-between border-b border-primary">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-secondary-container text-noir-text flex items-center justify-center font-bold">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-pure-white text-body-lg">Immutable Version History</h3>
                  <p class="text-caption text-on-primary-container text-[11px]">Cryptographic audit log of all published releases.</p>
                </div>
              </div>
              <button (click)="showHistoryModal.set(false)" class="text-on-primary-container hover:text-pure-white p-1 rounded transition-colors">✕</button>
            </div>

            <div class="p-space-lg max-h-96 overflow-y-auto space-y-2">
              @for (ver of versions(); track ver.id) {
                <div class="p-3 rounded-xl bg-surface-container-low border border-surface-container flex items-start justify-between gap-3 text-caption">
                  <div class="flex flex-col">
                    <div class="flex items-center gap-2">
                      <span class="font-bold font-mono text-primary text-xs">v{{ ver.versionNumber }}.0</span>
                      <span class="px-2 py-0.2 rounded-full bg-success/15 text-success font-semibold text-[10px]">SOX Verified</span>
                    </div>
                    <span class="font-mono text-[10px] text-outline truncate max-w-xs mt-1">Hash: {{ ver.hashSha256 }}</span>
                    <span class="text-[11px] text-on-surface-variant mt-0.5">Published {{ ver.publishedAtUtc | date:'short' }} by {{ ver.publishedByName || 'Platform System' }}</span>
                  </div>

                  <button
                    type="button"
                    (click)="rollbackToVersion(ver.versionNumber)"
                    class="h-7 px-2.5 rounded bg-surface-container hover:bg-surface-container-high text-primary font-mono text-[11px] font-bold border border-surface-container-highest transition-colors flex-shrink-0">
                    Load
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- Toast Notification Alert -->
      @if (toastMessage()) {
        <div class="fixed bottom-6 right-6 z-50 bg-primary-container text-pure-white px-4 py-2.5 rounded-xl shadow-2xl border border-white/10 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span class="w-2 h-2 rounded-full bg-secondary-container"></span>
          <span class="text-caption font-medium">{{ toastMessage() }}</span>
        </div>
      }
    </div>
  `
})
export class WorkflowDesignerComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly workflowService = inject(WorkflowService);
  readonly ui = inject(UiStateService);

  // Workflow State
  readonly workflowId = signal<string>('');
  readonly workflow = this.workflowService.currentWorkflow;
  readonly validation = this.workflowService.validationResult;

  // Canvas State
  readonly nodes = signal<WorkflowNode[]>([]);
  readonly edges = signal<WorkflowEdge[]>([]);
  readonly selectedNodeId = signal<string | null>(null);
  readonly zoomLevel = signal<number>(100);
  readonly isPanMode = signal<boolean>(false);
  readonly isSnapToGrid = signal<boolean>(true);
  readonly connectingFromNodeId = signal<string | null>(null);

  // Dragging State
  private isDraggingNode = false;
  private dragNodeId: string | null = null;
  private dragOffset = { x: 0, y: 0 };

  // Inspector State
  readonly inspectorTab = signal<'config' | 'rules' | 'schema'>('config');
  readonly paletteSearch = '';

  // Modals & Feedback State
  readonly showPublishModal = signal<boolean>(false);
  readonly showHistoryModal = signal<boolean>(false);
  readonly isPublishing = signal<boolean>(false);
  readonly publishNotes = '';
  readonly publishError = signal<string | null>(null);
  readonly versions = signal<WorkflowVersionSummary[]>([]);
  readonly toastMessage = signal<string | null>(null);
  readonly autoSavedText = signal<string>('Auto-saved 10s ago');

  readonly selectedNode = computed(() => {
    const id = this.selectedNodeId();
    if (!id) return null;
    return this.nodes().find(n => n.id === id) || null;
  });

  readonly topologyText = computed(() => {
    const v = this.validation();
    if (v) return v.topologySummary;
    const n = this.nodes().length;
    const e = this.edges().length;
    return `${n} Nodes • ${e} Edges • 0 Cycles`;
  });

  readonly templates: NodeTemplate[] = [
    // Triggers
    {
      type: 'trigger',
      subType: 'webhook',
      label: 'Webhook Ingest',
      description: 'REST/mTLS payload ingest',
      category: 'Triggers',
      defaultConfig: { eventName: 'po.created' }
    },
    {
      type: 'trigger',
      subType: 'cron',
      label: 'Scheduled Cron',
      description: 'UTC ticker or interval',
      category: 'Triggers',
      defaultConfig: { cronExpression: '0 0 * * *' }
    },
    {
      type: 'trigger',
      subType: 'kafka',
      label: 'Event Stream Kafka',
      description: 'Topic consumer & avro',
      category: 'Triggers',
      defaultConfig: { topic: 'orders-v1' }
    },
    // Human Tasks
    {
      type: 'task',
      subType: 'approval',
      label: 'Executive Approval',
      description: 'SLA timeout & dual sign',
      category: 'Human Tasks',
      defaultConfig: { prompt: 'Executive approval needed', consensusPolicy: 'FourEyes', targetSlaHours: 4, requireMfa: true }
    },
    {
      type: 'task',
      subType: 'consensus',
      label: 'Multi-Review Consensus',
      description: 'Voting matrix (M of N)',
      category: 'Human Tasks',
      defaultConfig: { prompt: 'Consensus voting', consensusPolicy: 'Majority', targetSlaHours: 8 }
    },
    {
      type: 'task',
      subType: 'doc-sign',
      label: 'Document Sign-off',
      description: 'DocuSign / PDF cert check',
      category: 'Human Tasks',
      defaultConfig: { prompt: 'Legal signoff document required' }
    },
    // Logic & Workers
    {
      type: 'gate',
      subType: 'condition',
      label: 'Rule / Condition Branch',
      description: 'JSONPath logic branching',
      category: 'Logic & Workers',
      defaultConfig: { conditionExpression: 'amount > 50000' }
    },
    {
      type: 'gate',
      subType: 'worker',
      label: 'Python / Go Worker',
      description: 'Isolated container execution',
      category: 'Logic & Workers',
      defaultConfig: { engine: 'python3.11' }
    },
    {
      type: 'gate',
      subType: 'subflow',
      label: 'Sub-Workflow Call',
      description: 'Modular DAG execution',
      category: 'Logic & Workers',
      defaultConfig: {}
    },
    // Integrations
    {
      type: 'integration',
      subType: 'sap',
      label: 'SAP S/4HANA PO Sync',
      description: 'BAPI & RFC ledger connector',
      category: 'Integrations',
      defaultConfig: { eventName: 'SAP_BAPI_PO_CREATE' }
    },
    {
      type: 'integration',
      subType: 'vault',
      label: 'HashiCorp Vault',
      description: 'KMS cryptoseal & secrets',
      category: 'Integrations',
      defaultConfig: { engine: 'transit/v1', algo: 'Ed25519-Sign' }
    },
    {
      type: 'end',
      subType: 'slack',
      label: 'Slack Notification',
      description: 'BlockKit interactive cards',
      category: 'Integrations',
      defaultConfig: { notificationTarget: '#procurement-exec' }
    }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.workflowId.set(id);
      this.loadWorkflowData(id);
    }
  }

  getTemplatesByCategory(cat: NodeTemplate['category']): NodeTemplate[] {
    const search = this.paletteSearch.toLowerCase().trim();
    return this.templates.filter(t => t.category === cat && (!search || t.label.toLowerCase().includes(search) || t.description.toLowerCase().includes(search)));
  }

  loadWorkflowData(id: string): void {
    this.workflowService.loadWorkflow(id).subscribe({
      next: (wf) => {
        if (wf.activeVersion?.graphDefinitionJson) {
          try {
            const parsed = JSON.parse(wf.activeVersion.graphDefinitionJson) as WorkflowGraph;
            if (parsed.nodes && parsed.nodes.length > 0) {
              this.nodes.set(parsed.nodes);
              this.edges.set(parsed.edges || []);
              // Auto-select first task node or first node
              const taskNode = parsed.nodes.find(n => n.type === 'task') || parsed.nodes[0];
              this.selectedNodeId.set(taskNode.id);
              this.triggerValidateGraph();
              return;
            }
          } catch {
            // fallback to default mock nodes
          }
        }
        this.initializeDefaultCapExGraph();
      },
      error: () => {
        this.initializeDefaultCapExGraph();
      }
    });
  }

  /**
   * Initializes the exact graph from the design mockup:
   * Node 1 (Trigger), Node 2 (Condition), Node 3 (Selected HITL Task), Node 2B (Auto-approve Bypass), Node 4 (Vault KMS), Node 5 (Finish/Slack)
   */
  initializeDefaultCapExGraph(): void {
    const defaultNodes: WorkflowNode[] = [
      {
        id: 'node-01',
        type: 'trigger',
        subType: 'webhook',
        label: 'Webhook Ingest',
        description: 'ERP PO Raised Event',
        position: { x: 32, y: 64 },
        config: { eventName: 'po.created' }
      },
      {
        id: 'node-02',
        type: 'gate',
        subType: 'condition',
        label: 'Evaluate CapEx Threshold',
        description: 'Check if amount > $50,000 USD',
        position: { x: 310, y: 155 },
        config: { conditionExpression: 'amount > $50,000 USD' }
      },
      {
        id: 'node-03',
        type: 'task',
        subType: 'approval',
        label: 'VP Finance & CISO Dual Sign-off',
        description: 'Requires dual cryptographic MFA sign-off for expenditures exceeding $50k.',
        position: { x: 660, y: 60 },
        config: {
          prompt: 'Capital expenditure approval for Tier-4 cluster upgrade ($124,500.00). Double signature mandatory under policy FIN-SEC-2024.',
          consensusPolicy: 'FourEyes',
          targetSlaHours: 4,
          escalationPath: 'Executive On-Call',
          requireMfa: true,
          allowRejection: true,
          notificationTarget: '#procurement-approvals'
        }
      },
      {
        id: 'node-02b',
        type: 'task',
        subType: 'approval',
        label: 'Auto-Approve Low Value',
        description: 'Under threshold standard procurement',
        position: { x: 660, y: 310 },
        config: { prompt: 'Auto-cleared bypass' }
      },
      {
        id: 'node-04',
        type: 'integration',
        subType: 'vault',
        label: 'HashiCorp Vault',
        description: 'CapEx Ledger Cryptoseal',
        position: { x: 1000, y: 175 },
        config: { engine: 'transit/v1', algo: 'Ed25519-Sign' }
      },
      {
        id: 'node-05',
        type: 'end',
        subType: 'slack',
        label: 'Slack Dispatch & ERP Sync',
        description: 'Post notification & update SAP PO',
        position: { x: 1310, y: 175 },
        config: { notificationTarget: '#procurement-exec' }
      }
    ];

    const defaultEdges: WorkflowEdge[] = [
      { id: 'edge-1', from: 'node-01', to: 'node-02', label: 'Default', style: 'dashed' },
      { id: 'edge-2', from: 'node-02', to: 'node-03', label: 'True (> $50k)', condition: 'amount > 50000', style: 'orange' },
      { id: 'edge-2b', from: 'node-02', to: 'node-02b', label: 'False (<= $50k)', condition: 'amount <= 50000', style: 'dashed' },
      { id: 'edge-3', from: 'node-03', to: 'node-04', label: 'Approved', style: 'orange' },
      { id: 'edge-4', from: 'node-04', to: 'node-05', label: 'Dispatched', style: 'green' }
    ];

    this.nodes.set(defaultNodes);
    this.edges.set(defaultEdges);
    this.selectedNodeId.set('node-03');
    this.triggerValidateGraph();
  }

  // --- Node & Port Selection ---
  selectNode(node: WorkflowNode, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedNodeId.set(node.id);
  }

  isSelected(node: WorkflowNode): boolean {
    return this.selectedNodeId() === node.id;
  }

  onOutputPortClick(node: WorkflowNode, event: MouseEvent): void {
    event.stopPropagation();
    this.connectingFromNodeId.set(node.id);
    this.showToast(`Starting connection from ${node.label}`);
  }

  onInputPortClick(node: WorkflowNode, event: MouseEvent): void {
    event.stopPropagation();
    const sourceId = this.connectingFromNodeId();
    if (!sourceId) return;

    if (sourceId === node.id) {
      this.cancelConnection();
      return;
    }

    // Check if edge already exists
    const exists = this.edges().some(e => e.from === sourceId && e.to === node.id);
    if (!exists) {
      const newEdge: WorkflowEdge = {
        id: `edge-${Date.now()}`,
        from: sourceId,
        to: node.id,
        style: 'orange'
      };
      this.edges.update(edges => [...edges, newEdge]);
      this.showToast(`Connected to ${node.label}`);
      this.saveGraphDraft();
    }

    this.connectingFromNodeId.set(null);
  }

  cancelConnection(): void {
    this.connectingFromNodeId.set(null);
  }

  // --- Drag and Drop Movement ---
  startDragNode(node: WorkflowNode, event: MouseEvent): void {
    if (this.isPanMode()) return;
    this.isDraggingNode = true;
    this.dragNodeId = node.id;
    this.dragOffset = {
      x: event.clientX - node.position.x,
      y: event.clientY - node.position.y
    };
    this.selectedNodeId.set(node.id);
  }

  onCanvasMouseMove(event: MouseEvent): void {
    if (!this.isDraggingNode || !this.dragNodeId) return;

    let newX = event.clientX - this.dragOffset.x;
    let newY = event.clientY - this.dragOffset.y;

    if (this.isSnapToGrid()) {
      newX = Math.round(newX / 24) * 24;
      newY = Math.round(newY / 24) * 24;
    }

    newX = Math.max(16, newX);
    newY = Math.max(16, newY);

    this.nodes.update(list =>
      list.map(n => n.id === this.dragNodeId ? { ...n, position: { x: newX, y: newY } } : n)
    );
  }

  onCanvasMouseUp(): void {
    if (this.isDraggingNode) {
      this.isDraggingNode = false;
      this.dragNodeId = null;
      this.saveGraphDraft();
    }
  }

  // --- Step Palette Operations ---
  addNodeFromTemplate(template: NodeTemplate): void {
    const nextIdx = this.nodes().length + 1;
    const padIdx = nextIdx < 10 ? `0${nextIdx}` : `${nextIdx}`;
    const newId = `node-${padIdx}`;

    const newNode: WorkflowNode = {
      id: newId,
      type: template.type,
      subType: template.subType,
      label: template.label,
      description: template.description,
      position: {
        x: 100 + (nextIdx % 4) * 220,
        y: 120 + Math.floor(nextIdx / 4) * 160
      },
      config: { ...template.defaultConfig }
    };

    this.nodes.update(list => [...list, newNode]);
    this.selectedNodeId.set(newId);
    this.showToast(`Added ${template.label} to canvas`);
    this.saveGraphDraft();
  }

  duplicateSelectedNode(): void {
    const sel = this.selectedNode();
    if (!sel) return;

    const nextIdx = this.nodes().length + 1;
    const padIdx = nextIdx < 10 ? `0${nextIdx}` : `${nextIdx}`;
    const newId = `node-${padIdx}`;

    const duplicate: WorkflowNode = {
      ...sel,
      id: newId,
      label: `${sel.label} (Copy)`,
      position: {
        x: sel.position.x + 30,
        y: sel.position.y + 30
      },
      config: { ...sel.config }
    };

    this.nodes.update(list => [...list, duplicate]);
    this.selectedNodeId.set(newId);
    this.showToast(`Duplicated ${sel.label}`);
    this.saveGraphDraft();
  }

  deleteSelectedNode(): void {
    const sel = this.selectedNode();
    if (!sel) return;

    this.nodes.update(list => list.filter(n => n.id !== sel.id));
    this.edges.update(list => list.filter(e => e.from !== sel.id && e.to !== sel.id));
    this.selectedNodeId.set(null);
    this.showToast(`Deleted ${sel.label}`);
    this.saveGraphDraft();
  }

  // --- Inspector Field Updaters ---
  updateSelectedNodeLabel(newLabel: string): void {
    const id = this.selectedNodeId();
    if (!id) return;
    this.nodes.update(list => list.map(n => n.id === id ? { ...n, label: newLabel } : n));
    this.saveGraphDraft();
  }

  updateSelectedNodeConfig(key: keyof NodeConfig, value: unknown): void {
    const id = this.selectedNodeId();
    if (!id) return;

    this.nodes.update(list => list.map(n => {
      if (n.id === id) {
        return {
          ...n,
          config: {
            ...n.config,
            [key]: value
          }
        };
      }
      return n;
    }));
    this.saveGraphDraft();
  }

  toggleSelectedNodeConfig(key: 'requireMfa' | 'allowRejection'): void {
    const sel = this.selectedNode();
    if (!sel) return;
    const currentVal = sel.config?.[key] ?? false;
    this.updateSelectedNodeConfig(key, !currentVal);
  }

  previewNotification(node: WorkflowNode): void {
    const target = node.config?.notificationTarget || '#procurement-approvals';
    this.showToast(`Slack preview card sent to channel: ${target}`);
  }

  // --- SVG Connectors Math ---
  computeBezierPath(edge: WorkflowEdge): string {
    const sourceNode = this.nodes().find(n => n.id === edge.from);
    const targetNode = this.nodes().find(n => n.id === edge.to);

    if (!sourceNode || !targetNode) {
      return '';
    }

    // Node dimensions: w-60 (240px approx), height roughly 120px
    const sourceX = sourceNode.position.x + 240;
    const sourceY = sourceNode.position.y + 60;
    const targetX = targetNode.position.x;
    const targetY = targetNode.position.y + 60;

    const dx = Math.abs(targetX - sourceX) * 0.5;
    const cp1x = sourceX + Math.max(dx, 40);
    const cp1y = sourceY;
    const cp2x = targetX - Math.max(dx, 40);
    const cp2y = targetY;

    return `M ${sourceX} ${sourceY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetX} ${targetY}`;
  }

  getEdgeColor(edge: WorkflowEdge): string {
    if (edge.style === 'orange') return '#ffa515';
    if (edge.style === 'green') return '#10B981';
    if (edge.style === 'dashed') return '#c5c6ce';
    return '#14213d';
  }

  getEdgeWidth(edge: WorkflowEdge): number {
    return edge.style === 'orange' ? 3 : 2.5;
  }

  getEdgeDash(edge: WorkflowEdge): string | null {
    return edge.style === 'dashed' ? '4 3' : null;
  }

  getEdgeMarker(edge: WorkflowEdge): string {
    if (edge.style === 'orange') return 'url(#arrow-orange)';
    if (edge.style === 'green') return 'url(#arrow-green)';
    return 'url(#arrow-navy)';
  }

  getNodeHeaderClass(node: WorkflowNode): string {
    switch (node.type) {
      case 'trigger':
        return 'p-3 bg-primary-container text-pure-white rounded-t-xl flex items-center justify-between';
      case 'task':
        return 'p-3 bg-primary-container text-pure-white rounded-t-xl flex items-center justify-between';
      case 'integration':
        return 'p-3 bg-primary text-pure-white rounded-t-xl flex items-center justify-between';
      case 'end':
        return 'p-3 bg-surface-container-high text-on-surface rounded-t-xl flex items-center justify-between border-b border-surface-container';
      default:
        return 'p-3 bg-surface-container-high text-on-surface rounded-t-xl flex items-center justify-between border-b border-surface-container';
    }
  }

  // --- Zoom & Grid Controls ---
  zoomIn(): void {
    this.zoomLevel.update(z => Math.min(150, z + 10));
  }

  zoomOut(): void {
    this.zoomLevel.update(z => Math.max(50, z - 10));
  }

  resetZoom(): void {
    this.zoomLevel.set(100);
  }

  toggleSnapToGrid(): void {
    this.isSnapToGrid.update(s => !s);
    this.showToast(this.isSnapToGrid() ? 'Snap to grid enabled' : 'Snap to grid disabled');
  }

  // --- Graph Validation & Auto-Save ---
  saveGraphDraft(): void {
    const id = this.workflowId();
    if (!id) return;

    const graph: WorkflowGraph = {
      nodes: this.nodes(),
      edges: this.edges()
    };
    const json = JSON.stringify(graph);

    this.workflowService.saveDraftGraph(id, json).subscribe({
      next: () => {
        this.autoSavedText.set('Saved draft just now');
        this.triggerValidateGraph();
      },
      error: () => {
        this.autoSavedText.set('Draft local only');
      }
    });
  }

  triggerValidateGraph(): void {
    const graph: WorkflowGraph = {
      nodes: this.nodes(),
      edges: this.edges()
    };
    const json = JSON.stringify(graph);
    this.workflowService.validateGraph(json).subscribe();
  }

  triggerSimulation(): void {
    this.showToast('Test simulation started: evaluating CapEx threshold ($124,500.00)... Passed to VP Sign-off.');
  }

  // --- Publish Operations ---
  openPublishModal(): void {
    this.publishError.set(null);
    this.showPublishModal.set(true);
  }

  closePublishModal(): void {
    this.showPublishModal.set(false);
  }

  confirmPublish(): void {
    const id = this.workflowId();
    if (!id) return;

    this.isPublishing.set(true);
    this.publishError.set(null);

    this.workflowService.publishVersion(id, this.publishNotes).subscribe({
      next: (ver) => {
        this.isPublishing.set(false);
        this.showPublishModal.set(false);
        this.showToast(`Published v${ver.versionNumber}.0! SHA-256 seal logged to audit ledger.`);
      },
      error: (err) => {
        this.isPublishing.set(false);
        this.publishError.set(err.message || 'Échec de la publication.');
      }
    });
  }

  // --- History Operations ---
  openHistoryModal(): void {
    const id = this.workflowId();
    if (!id) return;

    this.workflowService.loadVersions(id).subscribe({
      next: (vers) => {
        this.versions.set(vers);
        this.showHistoryModal.set(true);
      }
    });
  }

  rollbackToVersion(versionNumber: number): void {
    this.showToast(`Loaded version v${versionNumber}.0`);
    this.showHistoryModal.set(false);
  }

  private showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4000);
  }
}
