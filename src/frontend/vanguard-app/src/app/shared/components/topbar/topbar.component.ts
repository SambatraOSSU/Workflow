import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  template: `
    <header class="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-surface-container shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-xl select-none">
      <!-- Search and Environment Bar -->
      <div class="flex items-center gap-space-lg flex-1 max-w-xl">
        <div class="relative w-full max-w-md">
          <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <input
            class="w-full h-10 pl-9 pr-12 rounded-lg bg-surface-container-low text-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container transition-all"
            placeholder="Search workflows, runs, triggers (Cmd+K)..."
            type="text"
          />
          <kbd class="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-surface-container-highest text-[11px] text-on-surface-variant font-mono font-medium">⌘K</kbd>
        </div>

        <div class="hidden lg:flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container-low border border-surface-container text-on-surface-variant text-xs">
          <span class="w-2 h-2 rounded-full bg-success"></span>
          <span class="text-on-surface font-medium">Production - US-East-1</span>
        </div>
      </div>

      <!-- Action Buttons & User Profile -->
      <div class="flex items-center gap-space-md">
        <!-- New Workflow CTA -->
        <button
          (click)="onNewWorkflow()"
          class="h-10 px-space-md rounded-lg bg-secondary-container hover:bg-secondary text-noir-text hover:text-pure-white text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <line x1="12" x2="12" y1="5" y2="19"></line>
            <line x1="5" x2="19" y1="12" y2="12"></line>
          </svg>
          <span>New Workflow</span>
        </button>

        <!-- Notification Bell -->
        <button
          (click)="onNotificationClick()"
          class="relative p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg cursor-pointer transition-colors"
          title="Notifications & Alerts"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
        </button>

        <div class="h-6 w-px bg-surface-container-high"></div>

        <!-- User Profile Dropdown Toggle -->
        <div class="relative">
          <div
            (click)="toggleMenu()"
            class="flex items-center gap-space-sm cursor-pointer group"
          >
            <div class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs ring-2 ring-primary/10 shadow-sm">
              AV
            </div>
            <div class="hidden xl:flex flex-col text-left">
              <span class="text-xs font-semibold text-on-surface leading-tight group-hover:text-primary transition-colors">
                {{ auth.currentUser()?.fullName ?? 'Alexander Vance' }}
              </span>
              <span class="text-[11px] text-on-surface-variant leading-none">
                {{ auth.currentUser()?.role ?? 'Org Admin' }}
              </span>
            </div>
            <svg class="w-3.5 h-3.5 text-outline group-hover:text-primary transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <!-- Profile Flyout Menu -->
          @if (menuOpen()) {
            <div class="absolute right-0 top-12 w-56 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xl p-1.5 z-50">
              <div class="p-2 border-b border-surface-container mb-1">
                <p class="text-xs font-bold text-on-surface">{{ auth.currentUser()?.fullName ?? 'Alexander Vance' }}</p>
                <p class="text-[11px] text-on-surface-variant truncate">{{ auth.currentUser()?.email ?? 'alexander.vance@vanguard.io' }}</p>
              </div>
              <button
                (click)="logout()"
                class="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-error hover:bg-error/10 rounded-lg transition-colors text-left"
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
  private readonly router = inject(Router);

  protected readonly menuOpen = signal(false);

  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  protected onNewWorkflow(): void {
    this.router.navigate(['/workflows']);
  }

  protected onNotificationClick(): void {
    this.router.navigate(['/notifications']);
  }

  protected logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
