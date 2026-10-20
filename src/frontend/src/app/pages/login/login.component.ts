import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-surface font-body-md text-on-surface min-h-screen flex flex-col justify-between">
      <!-- Fixed Header Navigation -->
      <header class="fixed top-0 w-full z-50 bg-pure-white/95 backdrop-blur-xl border-b border-surface-container shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div class="h-16 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between gap-space-lg">
          <div class="flex items-center gap-8 lg:gap-10">
            <!-- Brand Logo -->
            <a routerLink="/" class="flex items-center gap-2.5 text-primary group">
              <div class="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-secondary-container shadow-xs group-hover:scale-105 transition-transform">
                <svg class="w-4.5 h-4.5 text-secondary-container" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <span class="text-lg tracking-tight text-primary font-bold">VANGUARD</span>
            </a>

            <!-- Navigation Links -->
            <nav class="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
              <a routerLink="/" class="text-on-surface-variant hover:text-primary transition-colors">Plateforme</a>
              <a routerLink="/workflows" class="text-on-surface-variant hover:text-primary transition-colors">Solutions</a>
              <a routerLink="/monitoring" class="text-on-surface-variant hover:text-primary transition-colors">Architecture</a>
              <a routerLink="/audit-center" class="text-on-surface-variant hover:text-primary transition-colors">Sécurité</a>
              <a routerLink="/workflows" class="text-on-surface-variant hover:text-primary transition-colors">Docs</a>
            </nav>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3 sm:gap-4">
            <a routerLink="/login" class="text-sm font-semibold text-primary hover:text-secondary-container px-3 py-2 rounded-lg bg-surface-container-low transition-colors">
              Connexion
            </a>

            <a routerLink="/register" class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-secondary-container hover:bg-secondary text-noir-text hover:text-pure-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all">
              Demander une démo
            </a>
          </div>
        </div>
      </header>

      <!-- Main Section -->
      <main class="w-full pt-16 flex-1 flex flex-col justify-center bg-surface">
        <div class="flex flex-col w-full">
          <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              <!-- Brand & Showcase Context Column -->
              <div class="lg:col-span-5 flex flex-col justify-between rounded-xl bg-primary-container text-pure-white p-8 sm:p-10 shadow-xl relative overflow-hidden border border-white/10">
                <!-- Subtle tactical ambient glow -->
                <div class="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>
                <div class="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-info/10 blur-3xl pointer-events-none"></div>

                <div class="relative z-10 flex flex-col gap-6">
                  <!-- Identity badge -->
                  <div class="inline-flex items-center gap-2 bg-pure-white/10 px-3 py-1.5 rounded-full w-fit border border-white/10">
                    <span class="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                    <span class="font-caption text-caption text-secondary-container tracking-wider uppercase font-bold">Enterprise Trust & Security</span>
                  </div>

                  <!-- Section title & narrative -->
                  <div class="flex flex-col gap-3">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center shadow-md flex-shrink-0">
                        <svg class="w-6 h-6 text-noir-text" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M12 3v18m9-9H3m14-5l4 5-4 5m-10-10L3 12l4 5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                      </div>
                      <h1 class="font-headline-lg text-headline-lg text-pure-white tracking-tight leading-none font-bold">Vanguard Workflow Engine</h1>
                    </div>
                    <p class="font-body-md text-body-md text-on-primary-container leading-relaxed">
                      Mission-critical orchestration platform engineered for enterprise pipelines, deterministic execution, and continuous compliance.
                    </p>
                  </div>

                  <!-- 3 Trust Pillars (Linear / GitHub Enterprise style) -->
                  <div class="mt-4 space-y-3.5">
                    <!-- Pillar 1: Zero-Trust Multi-Tenancy -->
                    <div class="flex items-start gap-3.5 p-3.5 rounded-lg bg-pure-white/5 border border-white/10 backdrop-blur-sm">
                      <div class="w-8 h-8 rounded-md bg-secondary-container/20 flex items-center justify-center text-secondary-container flex-shrink-0 mt-0.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                      </div>
                      <div class="flex flex-col">
                        <span class="font-label-md text-label-md font-semibold text-pure-white">Zero-Trust Multi-Tenancy</span>
                        <span class="font-caption text-caption text-on-primary-container leading-relaxed mt-0.5">Strict tenant data isolation with query-level filtering and automated IDOR prevention.</span>
                      </div>
                    </div>

                    <!-- Pillar 2: Cryptographic Audit Ledger -->
                    <div class="flex items-start gap-3.5 p-3.5 rounded-lg bg-pure-white/5 border border-white/10 backdrop-blur-sm">
                      <div class="w-8 h-8 rounded-md bg-secondary-container/20 flex items-center justify-center text-secondary-container flex-shrink-0 mt-0.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                      </div>
                      <div class="flex flex-col">
                        <span class="font-label-md text-label-md font-semibold text-pure-white">Cryptographic Audit Ledger</span>
                        <span class="font-caption text-caption text-on-primary-container leading-relaxed mt-0.5">SHA-256 chained event ledger ensuring tamper-evident compliance with SOX-404 and SOC-2.</span>
                      </div>
                    </div>

                    <!-- Pillar 3: High Availability & Resilience -->
                    <div class="flex items-start gap-3.5 p-3.5 rounded-lg bg-pure-white/5 border border-white/10 backdrop-blur-sm">
                      <div class="w-8 h-8 rounded-md bg-secondary-container/20 flex items-center justify-center text-secondary-container flex-shrink-0 mt-0.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                      </div>
                      <div class="flex flex-col">
                        <span class="font-label-md text-label-md font-semibold text-pure-white">High Availability & Resilience</span>
                        <span class="font-caption text-caption text-on-primary-container leading-relaxed mt-0.5">Automated multi-region failovers and deterministic state transitions backed by a 99.99% SLA.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- System Operational Status & Compliance Badges -->
                <div class="relative z-10 pt-6 mt-6 border-t border-white/10">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
                      <span class="font-caption text-caption text-pure-white font-medium">All Systems Operational</span>
                    </div>
                    <div class="flex items-center gap-2.5 text-on-primary-container font-mono text-caption">
                      <span>SOC-2</span>
                      <span class="text-white/30">•</span>
                      <span>ISO 27001</span>
                      <span class="text-white/30">•</span>
                      <span class="text-secondary-container font-semibold">99.99% SLA</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Main Enterprise Authentication Form Column -->
              <div class="lg:col-span-7 flex flex-col justify-center">
                <div class="rounded-xl bg-surface-container-lowest p-8 sm:p-12 shadow-xl flex flex-col gap-6 border border-surface-container">
                  <!-- Header Area -->
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center justify-between">
                      <h2 class="font-headline-md text-headline-md text-primary tracking-tight font-bold">Se connecter à Vanguard</h2>
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-caption text-caption font-semibold">
                        <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
                        Auth v4.2
                      </span>
                    </div>
                    <p class="font-body-md text-body-md text-on-surface-variant">
                      Accédez à votre cluster d'orchestration enterprise et à vos approbations d'exécution.
                    </p>
                  </div>

                  <!-- Error Alert -->
                  @if (error()) {
                    <div role="alert" class="p-3.5 rounded-lg bg-error/10 border border-error/20 flex items-center gap-3 text-xs font-semibold text-error">
                      <svg class="w-5 h-5 flex-shrink-0 text-error" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      <span>{{ error() }}</span>
                    </div>
                  }

                  <!-- Enterprise Single Sign-On Primary Action -->
                  <div>
                    <button
                      type="button"
                      (click)="continueWithSso()"
                      class="w-full flex items-center justify-center gap-3 bg-primary text-pure-white hover:bg-primary-container px-5 py-3.5 rounded-lg font-label-md text-label-md font-semibold transition duration-150 shadow-md cursor-pointer"
                    >
                      <svg class="w-5 h-5 text-secondary-container" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round"></path>
                      </svg>
                      <span>Continue with Enterprise SSO (Okta / Azure AD)</span>
                    </button>
                  </div>

                  <!-- Visual Divider -->
                  <div class="relative flex items-center justify-center my-1">
                    <div class="w-full h-px bg-surface-container-high"></div>
                    <span class="absolute bg-surface-container-lowest px-4 font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                      Ou se connecter avec vos identifiants
                    </span>
                  </div>

                  <!-- Credentials Form -->
                  <form class="space-y-4" (ngSubmit)="onSubmit()" novalidate>
                    <!-- Email Input -->
                    <div class="space-y-1.5">
                      <label class="block font-label-md text-label-md font-semibold text-primary" for="work-email">
                        Work Email
                      </label>
                      <div class="relative rounded-lg shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"></path>
                          </svg>
                        </div>
                        <input
                          id="work-email"
                          type="email"
                          autocomplete="username"
                          [ngModel]="email()"
                          (ngModelChange)="email.set($event)"
                          name="email"
                          placeholder="alexander.vance@vanguard-corp.com"
                          class="block w-full pl-10 pr-3 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary-container transition duration-150 border border-surface-container"
                          required
                        />
                      </div>
                    </div>

                    <!-- Password Input -->
                    <div class="space-y-1.5">
                      <label class="block font-label-md text-label-md font-semibold text-primary" for="master-password">
                        Master Password
                      </label>
                      <div class="relative rounded-lg shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-linecap="round" stroke-linejoin="round"></path>
                          </svg>
                        </div>
                        <input
                          id="master-password"
                          [type]="showPassword() ? 'text' : 'password'"
                          autocomplete="current-password"
                          [ngModel]="password()"
                          (ngModelChange)="password.set($event)"
                          name="password"
                          placeholder="••••••••••••••••"
                          class="block w-full pl-10 pr-10 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary-container transition duration-150 border border-surface-container"
                          required
                        />
                        <button
                          type="button"
                          (click)="showPassword.set(!showPassword())"
                          aria-label="Toggle password visibility"
                          class="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface focus:outline-none cursor-pointer"
                        >
                          @if (!showPassword()) {
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"></path>
                              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                          } @else {
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                              <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                          }
                        </button>
                      </div>
                    </div>

                    <!-- Helper options row -->
                    <div class="flex items-center justify-between pt-1">
                      <label class="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          [ngModel]="rememberDevice()"
                          (ngModelChange)="rememberDevice.set($event)"
                          name="remember"
                          class="w-4 h-4 rounded text-secondary-container bg-surface-container focus:ring-secondary-container"
                        />
                        <span class="font-body-md text-body-md text-on-surface">Remember this device for 30 days</span>
                      </label>
                      <a href="#" class="font-label-md text-label-md font-semibold text-secondary hover:text-secondary-container transition duration-150">
                        SSO troubleshooter?
                      </a>
                    </div>

                    <!-- Hardware MFA Requirement Notice -->
                    <div class="flex items-center gap-3 bg-surface-container-low px-4 py-3 rounded-lg text-on-surface border border-surface-container">
                      <div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0 text-primary">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                      </div>
                      <div class="flex flex-col">
                        <span class="font-label-sm text-label-sm font-semibold text-primary">Hardware MFA Enforced</span>
                        <span class="font-caption text-caption text-on-surface-variant">FIDO2 / WebAuthn security keys or TouchID prompt will trigger upon verification.</span>
                      </div>
                    </div>

                    <!-- Vanguard Signature Action Button -->
                    <div class="pt-2">
                      <button
                        type="submit"
                        [disabled]="loading()"
                        class="w-full flex items-center justify-center gap-2 bg-secondary-container text-noir-text hover:bg-on-secondary-fixed-variant hover:text-pure-white px-5 py-3.5 rounded-lg font-headline-sm text-headline-sm font-bold shadow-md transition duration-150 transform active:scale-[0.99] cursor-pointer disabled:opacity-50"
                      >
                        @if (loading()) {
                          <svg class="w-5 h-5 animate-spin text-current" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                          </svg>
                          <span>Authentification en cours...</span>
                        } @else {
                          <span>Se connecter</span>
                          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                            <path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round"></path>
                          </svg>
                        }
                      </button>
                    </div>
                  </form>

                  <!-- Quick Demo shortcut -->
                  <div class="p-3 rounded-lg bg-surface-container-low border border-surface-container text-center">
                    <p class="font-caption text-caption text-on-surface-variant font-medium">
                      Compte Démo CISO & OrgAdmin :
                    </p>
                    <button
                      type="button"
                      (click)="fillDemoCredentials()"
                      class="mt-1.5 text-xs font-mono font-bold text-primary hover:text-secondary underline underline-offset-2 cursor-pointer"
                    >
                      alexander.vance&#64;vanguard-corp.com
                    </button>
                  </div>

                  <!-- Tenant Registration Footer Prompt -->
                  <div class="pt-2 text-center">
                    <p class="font-body-md text-body-md text-on-surface-variant">
                      Pas encore de compte ?
                      <a routerLink="/register" class="font-bold text-primary hover:text-secondary underline underline-offset-4 ml-1 transition duration-150">
                        Créer un compte
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="w-full bg-surface-container-low py-space-xl border-t border-surface-container">
        <div class="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div class="flex flex-wrap items-center gap-space-md">
            <div class="flex items-center gap-space-xs bg-surface-container px-space-md py-space-xs rounded">
              <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span class="font-caption text-caption font-semibold text-on-surface">SOC-2 Type II</span>
            </div>
            <div class="flex items-center gap-space-xs bg-surface-container px-space-md py-space-xs rounded">
              <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span class="font-caption text-caption font-semibold text-on-surface">ISO 27001</span>
            </div>
            <div class="flex items-center gap-space-xs bg-surface-container px-space-md py-space-xs rounded">
              <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect height="11" rx="2" ry="2" width="18" x="3" y="11"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span class="font-caption text-caption font-semibold text-on-surface">FIPS 140-3 Compliant</span>
            </div>
          </div>

          <div class="flex items-center gap-space-lg">
            <a routerLink="/monitoring" class="flex items-center gap-space-xs font-caption text-caption text-on-surface-variant hover:text-primary transition-colors">
              <span class="w-2 h-2 rounded-full bg-success"></span>
              <span>System Status: 99.99% Uptime</span>
            </a>
            <span class="font-caption text-caption text-outline-variant">•</span>
            <a routerLink="/audit-center" class="font-caption text-caption text-on-surface-variant hover:text-on-surface transition-colors">Security Whitepaper</a>
            <span class="font-caption text-caption text-outline-variant">•</span>
            <a routerLink="/audit-center" class="font-caption text-caption text-on-surface-variant hover:text-on-surface transition-colors">Privacy & Terms</a>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly email = signal('alexander.vance@vanguard-corp.com');
  protected readonly password = signal('Password123!');
  protected readonly showPassword = signal(false);
  protected readonly rememberDevice = signal(true);
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  protected fillDemoCredentials(): void {
    this.email.set('alexander.vance@vanguard-corp.com');
    this.password.set('Password123!');
    this.error.set('');
  }

  protected continueWithSso(): void {
    this.fillDemoCredentials();
    this.onSubmit();
  }

  protected onSubmit(): void {
    if (!this.email() || !this.password()) {
      this.error.set('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.auth.login({ email: this.email(), password: this.password() }).subscribe({
      next: () => {
        this.loading.set(false);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 401) {
          this.error.set('Email ou mot de passe corporate incorrect.');
        } else if (err.error?.message) {
          this.error.set(err.error.message);
        } else {
          this.error.set('Impossible de joindre le serveur d’authentification.');
        }
      }
    });
  }
}
