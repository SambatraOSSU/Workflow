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
