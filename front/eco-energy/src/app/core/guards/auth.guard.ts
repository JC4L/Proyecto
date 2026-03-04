import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Functional route guard that protects routes requiring authentication.
 * Redirects to /auth/login if user is not authenticated.
 */
export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    router.navigate(['/auth/login']);
    return false;
};
