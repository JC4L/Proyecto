import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.models';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);

    private readonly TOKEN_KEY = 'eco_energy_token';
    private readonly USER_KEY = 'eco_energy_user';

    /** Signal that holds the current JWT token */
    private readonly _token = signal<string | null>(this.getStoredToken());

    /** Computed signal: true if user is authenticated */
    readonly isAuthenticated = computed(() => !!this._token());

    /** Computed signal: current token value */
    readonly token = computed(() => this._token());

    login(credentials: LoginRequest): Observable<AuthResponse> {
        localStorage.setItem(this.USER_KEY, credentials.username.trim());
        return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
            tap((response) => this.handleAuthSuccess(response))
        );
    }

    register(data: RegisterRequest): Observable<AuthResponse> {
        localStorage.setItem(this.USER_KEY, data.username.trim());
        return this.http.post<AuthResponse>('/api/auth/register', data).pipe(
            tap((response) => this.handleAuthSuccess(response))
        );
    }

    logout(): void {
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.TOKEN_KEY);
        this._token.set(null);
        this.router.navigate(['/auth/login']);
    }

    getTokenValue(): string | null {
        return this._token();
    }

    private handleAuthSuccess(response: AuthResponse): void {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        this._token.set(response.token);
    }

    private getStoredToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(this.TOKEN_KEY);
        }
        return null;
    }
}
