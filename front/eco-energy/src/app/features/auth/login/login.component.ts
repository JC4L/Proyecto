import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.models';

@Component({
    selector: 'app-login',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, RouterLink],
    template: `
    <div class="relative flex min-h-screen w-full overflow-hidden">
      <!-- Left Side: Visual Inspiration -->
      <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary/10">
        <div class="absolute inset-0 z-10 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent"></div>
        <div
          class="absolute inset-0 z-0 bg-cover bg-center"
          style="background-image: url('https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=1200&q=80');"
        ></div>
        <div class="relative z-20 flex flex-col justify-end p-20 w-full">
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-primary rounded-lg text-bg-dark">
              <span class="material-symbols-outlined text-3xl font-bold">bolt</span>
            </div>
            <h1 class="text-white text-3xl font-bold tracking-tight">EcoEnergy</h1>
          </div>
          <h2 class="text-white text-5xl font-extrabold leading-tight mb-4">
            La revolución de la energía limpia.
          </h2>
          <p class="text-white/80 text-lg max-w-md">
            Gestione su consumo de energía sostenible y optimice sus recursos de forma inteligente.
          </p>
        </div>
      </div>

      <!-- Right Side: Login Form -->
      <div class="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-24 bg-white">
        <div class="w-full max-w-md space-y-8">
          <!-- Mobile Logo -->
          <div class="lg:hidden flex items-center gap-3 mb-10">
            <div class="p-2 bg-primary rounded-lg text-bg-dark">
              <span class="material-symbols-outlined text-2xl font-bold">bolt</span>
            </div>
            <h1 class="text-slate-900 text-2xl font-bold tracking-tight">EcoEnergy</h1>
          </div>

          <!-- Title -->
          <div class="space-y-2">
            <h2 class="text-3xl font-black text-slate-900 tracking-tight">Acceder a la Plataforma</h2>
            <p class="text-slate-500">Bienvenido de nuevo. Por favor, introduzca sus datos.</p>
          </div>

          <!-- Tab Toggle -->
          <div class="flex p-1 bg-slate-100 rounded-xl">
            <span
              class="flex-1 py-2 text-sm font-semibold rounded-lg bg-white shadow-sm text-slate-900 text-center"
            >
              Iniciar Sesión
            </span>
            <a
              routerLink="/auth/register"
              class="flex-1 py-2 text-sm font-semibold rounded-lg text-slate-500 hover:text-slate-700 text-center cursor-pointer transition-fast"
            >
              Registrarse
            </a>
          </div>

          <!-- Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Username -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700 ml-1" for="username">
                Nombre de usuario
              </label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-fast">
                  <span class="material-symbols-outlined text-[20px]">person</span>
                </div>
                <input
                  id="username"
                  type="text"
                  formControlName="username"
                  placeholder="Tu nombre de usuario"
                  class="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-fast placeholder:text-slate-400 text-slate-900"
                />
              </div>
              @if (loginForm.get('username')?.touched && loginForm.get('username')?.errors) {
                <p class="text-xs text-red-500 font-medium ml-1">El nombre de usuario es obligatorio.</p>
              }
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700 ml-1" for="password">
                Contraseña
              </label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-fast">
                  <span class="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="••••••••"
                  class="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-fast placeholder:text-slate-400 text-slate-900"
                />
                <button
                  type="button"
                  (click)="togglePassword()"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  aria-label="Mostrar u ocultar contraseña"
                >
                  <span class="material-symbols-outlined text-[20px]">
                    {{ showPassword() ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
              </div>
              @if (loginForm.get('password')?.touched && loginForm.get('password')?.errors) {
                <p class="text-xs text-red-500 font-medium ml-1">La contraseña es obligatoria.</p>
              }
            </div>

            <!-- Backend Error -->
            @if (errorMessage()) {
              <div class="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p class="text-sm text-red-600 font-medium">{{ errorMessage() }}</p>
              </div>
            }

            <!-- Submit -->
            <button
              type="submit"
              [disabled]="isLoading()"
              class="w-full py-4 bg-primary text-bg-dark font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-smooth flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (isLoading()) {
                <div class="w-5 h-5 border-2 border-bg-dark/30 border-t-bg-dark rounded-full animate-spin"></div>
                <span>Accediendo...</span>
              } @else {
                <span>Entrar al Dashboard</span>
                <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
              }
            </button>
          </form>

          <!-- Footer Link -->
          <p class="text-center text-sm text-slate-500 pt-4">
            ¿No tienes una cuenta todavía?
            <a routerLink="/auth/register" class="font-bold text-primary hover:underline">Regístrate gratis</a>
          </p>
        </div>

        <!-- Bottom Info -->
        <div class="mt-auto pt-10 text-xs text-slate-400 text-center flex gap-4">
          <a href="#" class="hover:text-primary transition-fast">Términos de Servicio</a>
          <a href="#" class="hover:text-primary transition-fast">Política de Privacidad</a>
          <a href="#" class="hover:text-primary transition-fast">Soporte</a>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    readonly showPassword = signal(false);
    readonly isLoading = signal(false);
    readonly errorMessage = signal<string>('');

    readonly loginForm = this.fb.nonNullable.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
    });

    togglePassword(): void {
        this.showPassword.update((v) => !v);
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set('');

        const credentials: LoginRequest = this.loginForm.getRawValue();
        this.authService.login(credentials).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(
                    err.error?.message || err.error || 'Credenciales inválidas. Intente nuevamente.'
                );
            },
        });
    }
}
