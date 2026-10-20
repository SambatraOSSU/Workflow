import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UiStateService } from '../../../core/services/ui-state.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <!-- Mobile Backdrop (< lg) -->
    @if (ui.mobileSidebarOpen()) {
      <div
        (click)="ui.closeMobileSidebar()"
        class="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
        aria-hidden="true"
      ></div>
    }

    <aside
      class="fixed left-0 top-0 h-full w-64 bg-primary-container z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.15)] border-r border-white/5 select-none transition-transform duration-300 ease-in-out -translate-x-full lg:translate-x-0"
      [class.!translate-x-0]="ui.mobileSidebarOpen()"
    >
      <div class="flex flex-col">
        <!-- Brand Header (Vanguard Navy Foundation + Accent Mark) -->
        <div class="h-16 px-space-lg flex items-center justify-between bg-primary border-b border-white/10">
          <div class="flex items-center gap-space-sm">
            <div class="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg class="w-5 h-5 text-noir-text" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <div class="flex flex-col">
              <span class="font-bold tracking-wider text-pure-white leading-none text-sm">VANGUARD</span>
              <span class="text-on-primary-container tracking-widest text-[10px] leading-tight font-medium mt-0.5">WORKFLOW ENGINE</span>
            </div>
          </div>
          <!-- Close button for mobile drawer -->
          <button
            type="button"
            (click)="ui.closeMobileSidebar()"
            class="lg:hidden p-1.5 text-on-primary-container hover:text-pure-white hover:bg-white/10 active:scale-95 rounded-lg transition-colors cursor-pointer"
            aria-label="Fermer le menu de navigation"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
        </div>

        <!-- Cluster Status Bar -->
        <div class="px-space-md py-space-sm">
          <div class="flex items-center justify-between px-space-sm py-2 rounded-lg bg-primary text-pure-white text-xs border border-white/10 shadow-xs select-none">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              <span class="text-pure-white font-medium text-[11px] tracking-wide">US-East-1 Prod</span>
            </div>
            <div class="flex items-center gap-1.5 text-[10px] text-on-primary-container font-mono">
              <span class="bg-white/5 px-1.5 py-0.5 rounded">ACTIVE</span>
              <svg class="w-3.5 h-3.5 text-on-primary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                <path d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="flex flex-col gap-1 px-space-md mt-space-xs" aria-label="Navigation principale">
          <!-- Dashboard -->
          <a
            routerLink="/dashboard"
            (click)="ui.closeMobileSidebar()"
            routerLinkActive="bg-secondary text-noir-text font-bold shadow-sm is-active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="flex items-center justify-between px-space-md py-2.5 rounded-lg text-on-primary-container hover:bg-primary hover:text-pure-white active:scale-[0.99] transition-all duration-150 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary/40"
          >
            <div class="flex items-center gap-space-md">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <rect height="7" rx="1.5" width="7" x="3" y="3"></rect>
                <rect height="7" rx="1.5" width="7" x="14" y="3"></rect>
                <rect height="7" rx="1.5" width="7" x="14" y="14"></rect>
                <rect height="7" rx="1.5" width="7" x="3" y="14"></rect>
              </svg>
              <span class="text-sm">Dashboard</span>
            </div>
          </a>

          <!-- Workflows -->
          <a
            routerLink="/workflows"
            (click)="ui.closeMobileSidebar()"
            routerLinkActive="bg-secondary text-noir-text font-bold shadow-sm is-active"
            class="flex items-center justify-between px-space-md py-2.5 rounded-lg text-on-primary-container hover:bg-primary hover:text-pure-white active:scale-[0.99] transition-all duration-150 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary/40"
          >
            <div class="flex items-center gap-space-md">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <span class="text-sm">Workflows</span>
            </div>
          </a>

          <!-- Tasks -->
          <a
            routerLink="/tasks"
            (click)="ui.closeMobileSidebar()"
            routerLinkActive="bg-secondary text-noir-text font-bold shadow-sm is-active"
            class="flex items-center justify-between px-space-md py-2.5 rounded-lg text-on-primary-container hover:bg-primary hover:text-pure-white active:scale-[0.99] transition-all duration-150 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary/40"
          >
            <div class="flex items-center gap-space-md">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <span class="text-sm">Tasks</span>
            </div>
            <span class="px-2 py-0.5 rounded-full font-bold text-[11px] bg-secondary-container text-noir-text group-[.is-active]:bg-primary group-[.is-active]:text-pure-white transition-colors">14</span>
          </a>

          <!-- Requests -->
          <a
            routerLink="/requests"
            (click)="ui.closeMobileSidebar()"
            routerLinkActive="bg-secondary text-noir-text font-bold shadow-sm is-active"
            class="flex items-center justify-between px-space-md py-2.5 rounded-lg text-on-primary-container hover:bg-primary hover:text-pure-white active:scale-[0.99] transition-all duration-150 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary/40"
          >
            <div class="flex items-center gap-space-md">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4.586a1 1 0 00-.707.293l-1.414 1.414a2 2 0 01-1.414.586h-3.172a2 2 0 01-1.414-.586l-1.414-1.414A1 1 0 006.586 13H2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <span class="text-sm">Requests</span>
            </div>
          </a>

          <!-- Monitoring -->
          <a
            routerLink="/monitoring"
            (click)="ui.closeMobileSidebar()"
            routerLinkActive="bg-secondary text-noir-text font-bold shadow-sm is-active"
            class="flex items-center justify-between px-space-md py-2.5 rounded-lg text-on-primary-container hover:bg-primary hover:text-pure-white active:scale-[0.99] transition-all duration-150 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary/40"
          >
            <div class="flex items-center gap-space-md">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <span class="text-sm">Monitoring</span>
            </div>
          </a>

          <!-- Audit Center -->
          <a
            routerLink="/audit-center"
            (click)="ui.closeMobileSidebar()"
            routerLinkActive="bg-secondary text-noir-text font-bold shadow-sm is-active"
            class="flex items-center justify-between px-space-md py-2.5 rounded-lg text-on-primary-container hover:bg-primary hover:text-pure-white active:scale-[0.99] transition-all duration-150 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary/40"
          >
            <div class="flex items-center gap-space-md">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <span class="text-sm">Audit Center</span>
            </div>
          </a>

          <div class="pt-space-sm pb-space-xs px-space-sm text-[11px] font-bold text-on-primary-container/70 uppercase tracking-wider">Configuration</div>

          <!-- Notifications -->
          <a
            routerLink="/notifications"
            (click)="ui.closeMobileSidebar()"
            routerLinkActive="bg-secondary text-noir-text font-bold shadow-sm is-active"
            class="flex items-center justify-between px-space-md py-2.5 rounded-lg text-on-primary-container hover:bg-primary hover:text-pure-white active:scale-[0.99] transition-all duration-150 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary/40"
          >
            <div class="flex items-center gap-space-md">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <span class="text-sm">Notifications</span>
            </div>
            <span class="px-2 py-0.5 rounded-full font-bold text-[11px] bg-secondary-container text-noir-text group-[.is-active]:bg-primary group-[.is-active]:text-pure-white transition-colors">5</span>
          </a>

          <!-- Settings -->
          <a
            routerLink="/settings"
            (click)="ui.closeMobileSidebar()"
            routerLinkActive="bg-secondary text-noir-text font-bold shadow-sm is-active"
            class="flex items-center justify-between px-space-md py-2.5 rounded-lg text-on-primary-container hover:bg-primary hover:text-pure-white active:scale-[0.99] transition-all duration-150 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary/40"
          >
            <div class="flex items-center gap-space-md">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke-linecap="round" stroke-linejoin="round"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span class="text-sm">Settings</span>
            </div>
          </a>
        </nav>
      </div>

      <!-- Footer Info (Cluster Health & Tenant Metadata) -->
      <div class="p-space-md flex flex-col gap-space-xs bg-primary border-t border-white/10 select-none">
        <div class="flex items-center justify-between px-space-sm py-space-xs">
          <div class="flex flex-col">
            <span class="text-[11px] text-on-primary-container">Cluster Health</span>
            <span class="text-xs text-success font-semibold flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-success"></span> 99.99% Uptime
            </span>
          </div>
          <span class="text-on-primary-container text-xs font-mono">24/24 Nodes</span>
        </div>
        <div class="pt-space-xs mt-space-xs border-t border-white/10 flex items-center justify-between px-space-sm text-on-primary-container text-xs font-mono">
          <span>Tenant: {{ auth.tenantSlug() }}</span>
          <span>v2.8.4</span>
        </div>
      </div>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  protected readonly auth = inject(AuthService);
  protected readonly ui = inject(UiStateService);
}
