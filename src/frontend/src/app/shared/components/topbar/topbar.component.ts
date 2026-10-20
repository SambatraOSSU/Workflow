import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UiStateService } from '../../../core/services/ui-state.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  template: `
    <header class="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-surface-container shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-6 sm:px-8 lg:px-10 xl:px-12 select-none transition-all duration-300">
      <!-- Search, Mobile Drawer Toggle and Environment Bar -->
      <div class="flex items-center gap-2 sm:gap-space-md flex-1 max-w-xl">
        <!-- Mobile Drawer Hamburger Toggle (< lg) -->
        <button
          type="button"
          (click)="ui.toggleMobileSidebar()"
          class="lg:hidden p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container active:scale-95 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container shrink-0 transition-all cursor-pointer"
          aria-label="Ouvrir le menu de navigation"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>

        <!-- Command Search Bar -->
        <div class="relative w-full max-w-md">
          <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <input
            class="w-full h-10 pl-9 pr-12 rounded-lg bg-surface-container-low text-sm text-on-surface placeholder:text-outline border border-surface-container focus:outline-none focus:bg-surface-container-lowest focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
            placeholder="Search workflows, runs, triggers (Cmd+K)..."
            type="text"
            aria-label="Rechercher des workflows ou des runs"
          />
          <kbd class="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-surface-container-highest text-[11px] text-on-surface-variant font-mono font-medium border border-surface-container/60">⌘K</kbd>
        </div>

        <!-- Vanguard Environment Cluster Status -->
        <div class="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-surface-container text-on-surface-variant text-xs shrink-0 select-none">
          <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          <span class="text-on-surface font-medium text-[11px] tracking-wide">Production - US-East-1</span>
        </div>
      </div>

      <!-- Action Buttons & User Profile -->
      <div class="flex items-center gap-2 sm:gap-space-md">
        <!-- New Workflow CTA (Vanguard Primary Action: Secondary Accent Orange #FCA311 with #000000 text) -->
        <button
          type="button"
          (click)="onNewWorkflow()"
          class="h-9 sm:h-10 px-3.5 sm:px-4 rounded-lg bg-secondary hover:bg-secondary-hover active:scale-[0.98] text-noir-text font-bold text-xs sm:text-sm flex items-center gap-2 transition-all duration-150 shadow-xs hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <line x1="12" x2="12" y1="5" y2="19"></line>
            <line x1="5" x2="19" y1="12" y2="12"></line>
          </svg>
          <span class="hidden sm:inline">New Workflow</span>
          <span class="sm:hidden">New</span>
        </button>

        <!-- Notification Bell with Active Ping Indicator -->
        <button
          type="button"
          (click)="onNotificationClick()"
          class="relative p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container active:scale-95 rounded-lg cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-primary-container/30"
          title="Notifications & Alertes"
          aria-label="Notifications et alertes"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span class="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-error ring-2 ring-surface-container-lowest"></span>
          </span>
        </button>

        <div class="h-6 w-px bg-surface-container hidden sm:block"></div>

        <!-- User Profile Dropdown Toggle -->
        <div class="relative">
          <div
            role="button"
            tabindex="0"
            (click)="toggleMenu()"
            (keydown.enter)="toggleMenu()"
            (keydown.space)="toggleMenu()"
            [attr.aria-expanded]="menuOpen()"
            aria-haspopup="true"
            class="flex items-center gap-space-sm cursor-pointer group p-1.5 rounded-lg hover:bg-surface-container/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container/30"
          >
            <div class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs ring-2 ring-primary/10 shadow-sm shrink-0">
              {{ userInitials() }}
            </div>
            <div class="hidden xl:flex flex-col text-left">
              <span class="text-xs font-semibold text-on-surface leading-tight group-hover:text-primary transition-colors">
                {{ auth.currentUser()?.fullName ?? 'Alexander Vance' }}
              </span>
              <span class="text-[11px] text-on-surface-variant leading-none mt-0.5">
                {{ auth.currentUser()?.role ?? 'Org Admin' }}
              </span>
            </div>
            <svg
              class="w-3.5 h-3.5 text-outline group-hover:text-primary transition-transform duration-200"
              [class.rotate-180]="menuOpen()"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <!-- Profile Flyout Menu -->
          @if (menuOpen()) {
            <!-- Click-away backdrop -->
            <div (click)="closeMenu()" class="fixed inset-0 z-40" aria-hidden="true"></div>

            <div class="absolute right-0 top-12 w-60 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div class="p-3 border-b border-surface-container mb-1 bg-surface-container-low/40 rounded-t-lg">
                <p class="text-xs font-bold text-on-surface leading-tight">{{ auth.currentUser()?.fullName ?? 'Alexander Vance' }}</p>
                <p class="text-[11px] text-on-surface-variant truncate mt-0.5">{{ auth.currentUser()?.email ?? 'alexander.vance@vanguard.io' }}</p>
                <div class="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary-container/10 text-primary-container font-semibold text-[10px]">
                  <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
                  <span>{{ auth.currentUser()?.role ?? 'Org Admin' }}</span>
                </div>
              </div>

              <!-- Quick account settings navigation -->
              <button
                type="button"
                (click)="goToSettings()"
                class="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-on-surface hover:text-primary hover:bg-surface-container rounded-lg transition-colors text-left cursor-pointer"
              >
                <svg class="w-4 h-4 text-outline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke-linecap="round" stroke-linejoin="round"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>Paramètres système</span>
              </button>

              <div class="my-1 border-t border-surface-container"></div>

              <button
                type="button"
                (click)="logout()"
                class="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-error hover:bg-error/10 rounded-lg transition-colors text-left cursor-pointer"
              >
                <svg class="w-4 h-4 text-error" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Déconnexion</span>
              </button>
            </div>
          }
        </div>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
  protected readonly auth = inject(AuthService);
  protected readonly ui = inject(UiStateService);
  private readonly router = inject(Router);

  protected readonly menuOpen = signal(false);

  protected readonly userInitials = computed(() => {
    const name = this.auth.currentUser()?.fullName;
    if (!name) return 'AV';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });

  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected onNewWorkflow(): void {
    this.router.navigate(['/workflows']);
  }

  protected onNotificationClick(): void {
    this.router.navigate(['/notifications']);
  }

  protected goToSettings(): void {
    this.closeMenu();
    this.router.navigate(['/settings']);
  }

  protected logout(): void {
    this.closeMenu();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
