import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/auth.models';

@Component({
    selector: 'app-register',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, RouterLink],
    template: `
    <div class="relative flex min-h-screen w-full overflow-hidden">
      <!-- Left Side: Visual Inspiration -->
      <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary/10">
        <div class="absolute inset-0 z-10 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent"></div>
        <div
          class="absolute inset-0 z-0 bg-cover bg-center"
          style="background-image: url('https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80');"
        ></div>
        <div class="relative z-20 flex flex-col justify-end p-20 w-full">
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-primary rounded-lg text-bg-dark">
              <span class="material-symbols-outlined text-3xl font-bold">bolt</span>
            </div>
            <h1 class="text-white text-3xl font-bold tracking-tight">EcoEnergy</h1>
          </div>
          <h2 class="text-white text-5xl font-extrabold leading-tight mb-4">
            Únete al futuro sostenible.
          </h2>
          <p class="text-white/80 text-lg max-w-md">
            Crea tu cuenta y accede a análisis avanzados de energías renovables a nivel mundial.
          </p>
        </div>
      </div>

      <!-- Right Side: Register Form -->
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
            <h2 class="text-3xl font-black text-slate-900 tracking-tight">Crear una Cuenta</h2>
            <p class="text-slate-500">Regístrate para acceder a todas las funcionalidades.</p>
          </div>

          <!-- Tab Toggle -->
          <div class="flex p-1 bg-slate-100 rounded-xl">
            <a
              routerLink="/auth/login"
              class="flex-1 py-2 text-sm font-semibold rounded-lg text-slate-500 hover:text-slate-700 text-center cursor-pointer transition-fast"
            >
              Iniciar Sesión
            </a>
            <span
              class="flex-1 py-2 text-sm font-semibold rounded-lg bg-white shadow-sm text-slate-900 text-center"
            >
              Registrarse
            </span>
          </div>

          <!-- Form -->
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <!-- Username -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700 ml-1" for="reg-username">
                Nombre de usuario
              </label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-fast">
                  <span class="material-symbols-outlined text-[20px]">person</span>
                </div>
                <input
                  id="reg-username"
                  type="text"
                  formControlName="username"
                  placeholder="Mínimo 3 caracteres"
                  class="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-fast placeholder:text-slate-400 text-slate-900"
                />
              </div>
              @if (registerForm.get('username')?.touched && registerForm.get('username')?.hasError('required')) {
                <p class="text-xs text-red-500 font-medium ml-1">El nombre de usuario es obligatorio.</p>
              }
              @if (registerForm.get('username')?.touched && registerForm.get('username')?.hasError('minlength')) {
                <p class="text-xs text-red-500 font-medium ml-1">Debe tener al menos 3 caracteres.</p>
              }
              @if (registerForm.get('username')?.touched && registerForm.get('username')?.hasError('maxlength')) {
                <p class="text-xs text-red-500 font-medium ml-1">No puede exceder 50 caracteres.</p>
              }
            </div>

            <!-- Email -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700 ml-1" for="reg-email">
                Correo electrónico
              </label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-fast">
                  <span class="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <input
                  id="reg-email"
                  type="email"
                  formControlName="email"
                  placeholder="ejemplo@energia.es"
                  class="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-fast placeholder:text-slate-400 text-slate-900"
                />
              </div>
              @if (registerForm.get('email')?.touched && registerForm.get('email')?.hasError('required')) {
                <p class="text-xs text-red-500 font-medium ml-1">El correo electrónico es obligatorio.</p>
              }
              @if (registerForm.get('email')?.touched && registerForm.get('email')?.hasError('email')) {
                <p class="text-xs text-red-500 font-medium ml-1">Ingrese un correo electrónico válido.</p>
              }
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700 ml-1" for="reg-password">
                Contraseña
              </label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-fast">
                  <span class="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  id="reg-password"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="Mínimo 8 caracteres"
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
              @if (registerForm.get('password')?.touched && registerForm.get('password')?.hasError('required')) {
                <p class="text-xs text-red-500 font-medium ml-1">La contraseña es obligatoria.</p>
              }
              @if (registerForm.get('password')?.touched && registerForm.get('password')?.hasError('minlength')) {
                <p class="text-xs text-red-500 font-medium ml-1">Debe tener al menos 8 caracteres.</p>
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
                <span>Creando cuenta...</span>
              } @else {
                <span>Crear mi Cuenta</span>
                <span class="material-symbols-outlined text-[20px]">how_to_reg</span>
              }
            </button>
          </form>

          <!-- Footer Link -->
          <p class="text-center text-sm text-slate-500 pt-4">
            ¿Ya tienes una cuenta?
            <a routerLink="/auth/login" class="font-bold text-primary hover:underline">Inicia sesión</a>
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
export class RegisterComponent {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    readonly showPassword = signal(false);
    readonly isLoading = signal(false);
    readonly errorMessage = signal<string>('');

    readonly registerForm = this.fb.nonNullable.group({
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
    });

    togglePassword(): void {
        this.showPassword.update((v) => !v);
    }

    onSubmit(): void {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set('');

        const data: RegisterRequest = this.registerForm.getRawValue();
        this.authService.register(data).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(
                    err.error?.message || err.error || 'Error al registrar. Intente nuevamente.'
                );
            },
        });
    }
}
