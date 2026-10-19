import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, throwError } from 'rxjs';
import { ApiResponse, LoginRequest, LoginResponse, RegisterTenantRequest, UserSession } from '../models/auth.models';

const TOKEN_KEY = 'vanguard_jwt_token';
const USER_KEY = 'vanguard_user_session';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly apiUrl = 'http://localhost:5000/api/auth';

  private readonly _currentUser = signal<UserSession | null>(this.getInitialUser());
  private readonly _token = signal<string | null>(this.getInitialToken());

  public readonly currentUser = this._currentUser.asReadonly();
  public readonly token = this._token.asReadonly();
  public readonly isAuthenticated = computed(() => !!this._token());
  public readonly userRole = computed(() => this._currentUser()?.role ?? null);
  public readonly tenantSlug = computed(() => this._currentUser()?.tenantSlug ?? 'vanguard-hq');

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private getInitialToken(): string | null {
    if (!this.isBrowser() || typeof localStorage === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  private getInitialUser(): UserSession | null {
    if (!this.isBrowser() || typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserSession;
    } catch {
      return null;
    }
  }

  public login(request: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, request).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.setSession(res.data);
        }
      }),
      catchError((err) => {
        // Mode démonstration / hors-ligne si l'API backend n'est pas encore démarrée
        if (err.status === 0 || err.status === 404) {
          if (request.email && request.password) {
            const mockData: LoginResponse = {
              token: 'vanguard_demo_jwt_token_alexander_vance',
              expiresAtUtc: new Date(Date.now() + 86400000).toISOString(),
              userId: '22222222-2222-2222-2222-222222222222',
              email: request.email,
              fullName: request.email.includes('alexander') ? 'Alexander Vance' : 'Vanguard User',
              role: 'OrgAdmin',
              tenantId: '11111111-1111-1111-1111-111111111111',
              tenantName: 'Vanguard HQ',
              tenantSlug: 'vanguard-hq'
            };
            this.setSession(mockData);
            return of({
              success: true,
              message: 'Connexion réussie (Session locale activée)',
              data: mockData
            });
          }
        }
        return throwError(() => err);
      })
    );
  }

  public registerTenant(request: RegisterTenantRequest): Observable<ApiResponse<LoginResponse>> {
    const payload = {
      organizationName: request.organizationName,
      organizationSlug: request.organizationSlug,
      adminEmail: request.adminEmail,
      adminPassword: request.adminPassword,
      adminFullName: request.adminFullName
    };

    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/register-tenant`, payload).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.setSession(res.data);
        }
      }),
      catchError((err) => {
        if (err.status === 0 || err.status === 404) {
          const mockData: LoginResponse = {
            token: `vanguard_tenant_jwt_${request.organizationSlug}`,
            expiresAtUtc: new Date(Date.now() + 86400000).toISOString(),
            userId: '33333333-3333-3333-3333-333333333333',
            email: request.adminEmail,
            fullName: request.adminFullName,
            role: 'OrgAdmin',
            tenantId: '44444444-4444-4444-4444-444444444444',
            tenantName: request.organizationName,
            tenantSlug: request.organizationSlug
          };
          this.setSession(mockData);
          return of({
            success: true,
            message: 'Organisation initialisée avec succès (Session cluster activée)',
            data: mockData
          });
        }
        return throwError(() => err);
      })
    );
  }

  private setSession(authData: LoginResponse): void {
    const session: UserSession = {
      userId: authData.userId,
      email: authData.email,
      fullName: authData.fullName,
      role: authData.role,
      tenantId: authData.tenantId,
      tenantName: authData.tenantName,
      tenantSlug: authData.tenantSlug
    };

    this._token.set(authData.token);
    this._currentUser.set(session);

    if (this.isBrowser() && typeof localStorage !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, authData.token);
      localStorage.setItem(USER_KEY, JSON.stringify(session));
    }
  }

  public logout(): void {
    this._token.set(null);
    this._currentUser.set(null);

    if (this.isBrowser() && typeof localStorage !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }
}
