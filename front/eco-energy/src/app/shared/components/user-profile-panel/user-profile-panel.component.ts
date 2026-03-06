import {
    Component,
    ChangeDetectionStrategy,
    input,
    output,
    signal,
    computed,
    inject,
    effect,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import {
    UpdateRequest,
    DeleteAccountRequest,
} from '../../../core/models/auth.models';

type PanelView = 'menu' | 'username' | 'email' | 'password' | 'delete';

@Component({
    selector: 'app-user-profile-panel',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule],
    template: `
        @if (isOpen()) {
            <!-- Backdrop -->
            <div
                class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
                (click)="close()"
            ></div>

            <!-- Panel -->
            <aside
                class="fixed top-0 right-0 h-full w-80 sm:w-96 bg-white dark:bg-surface-dark border-l border-slate-200 dark:border-slate-700 shadow-2xl z-50 flex flex-col animate-slide-in"
            >
                <!-- Header -->
                <div
                    class="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-700"
                >
                    <div class="flex items-center gap-3">
                        <button
                            (click)="goBack()"
                            class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-fast"
                            [class.invisible]="activeView() === 'menu'"
                            aria-label="Volver"
                        >
                            <span class="material-symbols-outlined text-[20px]"
                                >arrow_back</span
                            >
                        </button>
                        <h2
                            class="text-lg font-bold text-slate-900 dark:text-white"
                        >
                            {{ panelTitle() }}
                        </h2>
                    </div>
                    <button
                        (click)="close()"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-fast"
                        aria-label="Cerrar panel"
                    >
                        <span class="material-symbols-outlined text-[20px]"
                            >close</span
                        >
                    </button>
                </div>

                <!-- Content -->
                <div class="flex-1 overflow-y-auto px-6 py-5">
                    <!-- Success Message -->
                    @if (successMessage()) {
                        <div
                            class="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2"
                        >
                            <span
                                class="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[20px]"
                                >check_circle</span
                            >
                            <p
                                class="text-sm text-emerald-700 dark:text-emerald-300 font-medium"
                            >
                                {{ successMessage() }}
                            </p>
                        </div>
                    }

                    <!-- Error Message -->
                    @if (errorMessage()) {
                        <div
                            class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2"
                        >
                            <span
                                class="material-symbols-outlined text-red-500 dark:text-red-400 text-[20px]"
                                >error</span
                            >
                            <p
                                class="text-sm text-red-600 dark:text-red-300 font-medium"
                            >
                                {{ errorMessage() }}
                            </p>
                        </div>
                    }

                    <!-- ===== MENU VIEW ===== -->
                    @if (activeView() === 'menu') {
                        <div class="mb-6 flex flex-col items-center gap-2">
                            <div
                                class="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30"
                            >
                                <span
                                    class="material-symbols-outlined text-primary text-[32px]"
                                    >person</span
                                >
                            </div>
                            <p
                                class="text-base font-bold text-slate-900 dark:text-white"
                            >
                                {{ userName() }}
                            </p>
                            <p
                                class="text-xs text-slate-400 dark:text-slate-500"
                            >
                                Gestiona tu cuenta
                            </p>
                        </div>

                        <nav class="space-y-1.5">
                            <button
                                (click)="navigateTo('username')"
                                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-fast group"
                            >
                                <span
                                    class="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-primary transition-fast"
                                    >badge</span
                                >
                                <span class="flex-1 text-left"
                                    >Cambiar nombre de usuario</span
                                >
                                <span
                                    class="material-symbols-outlined text-[18px] text-slate-300 dark:text-slate-600"
                                    >chevron_right</span
                                >
                            </button>
                            <button
                                (click)="navigateTo('email')"
                                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-fast group"
                            >
                                <span
                                    class="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-primary transition-fast"
                                    >email</span
                                >
                                <span class="flex-1 text-left"
                                    >Cambiar email</span
                                >
                                <span
                                    class="material-symbols-outlined text-[18px] text-slate-300 dark:text-slate-600"
                                    >chevron_right</span
                                >
                            </button>
                            <button
                                (click)="navigateTo('password')"
                                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-fast group"
                            >
                                <span
                                    class="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-primary transition-fast"
                                    >lock</span
                                >
                                <span class="flex-1 text-left"
                                    >Cambiar contraseña</span
                                >
                                <span
                                    class="material-symbols-outlined text-[18px] text-slate-300 dark:text-slate-600"
                                    >chevron_right</span
                                >
                            </button>

                            <div
                                class="my-3 border-t border-slate-200 dark:border-slate-700"
                            ></div>

                            <button
                                (click)="navigateTo('delete')"
                                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-fast group"
                            >
                                <span
                                    class="material-symbols-outlined text-[20px]"
                                    >delete_forever</span
                                >
                                <span class="flex-1 text-left"
                                    >Eliminar cuenta</span
                                >
                                <span
                                    class="material-symbols-outlined text-[18px] text-red-300 dark:text-red-700"
                                    >chevron_right</span
                                >
                            </button>
                        </nav>
                    }

                    <!-- ===== USERNAME FORM ===== -->
                    @if (activeView() === 'username') {
                        <form
                            [formGroup]="usernameForm"
                            (ngSubmit)="onUpdateUsername()"
                            class="space-y-5"
                        >
                            <div class="space-y-2">
                                <label
                                    class="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1"
                                    for="newUsername"
                                    >Nuevo nombre de usuario</label
                                >
                                <div class="relative group">
                                    <div
                                        class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-fast"
                                    >
                                        <span
                                            class="material-symbols-outlined text-[20px]"
                                            >badge</span
                                        >
                                    </div>
                                    <input
                                        id="newUsername"
                                        type="text"
                                        formControlName="newUsername"
                                        placeholder="Nuevo username"
                                        class="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-fast placeholder:text-slate-400 text-slate-900 dark:text-white text-sm"
                                    />
                                </div>
                                @if (
                                    usernameForm.get('newUsername')?.touched &&
                                    usernameForm
                                        .get('newUsername')
                                        ?.hasError('required')
                                ) {
                                    <p
                                        class="text-xs text-red-500 font-medium ml-1"
                                    >
                                        El nombre de usuario es obligatorio.
                                    </p>
                                }
                                @if (
                                    usernameForm.get('newUsername')?.touched &&
                                    usernameForm
                                        .get('newUsername')
                                        ?.hasError('minlength')
                                ) {
                                    <p
                                        class="text-xs text-red-500 font-medium ml-1"
                                    >
                                        Debe tener al menos 3 caracteres.
                                    </p>
                                }
                            </div>

                            <!-- Password confirm -->
                            <div class="space-y-2">
                                <label
                                    class="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1"
                                    for="usernamePassword"
                                    >Confirmar con contraseña</label
                                >
                                <div class="relative group">
                                    <div
                                        class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-fast"
                                    >
                                        <span
                                            class="material-symbols-outlined text-[20px]"
                                            >lock</span
                                        >
                                    </div>
                                    <input
                                        id="usernamePassword"
                                        [type]="
                                            showPassword()
                                                ? 'text'
                                                : 'password'
                                        "
                                        formControlName="password"
                                        placeholder="Tu contraseña actual"
                                        class="block w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-fast placeholder:text-slate-400 text-slate-900 dark:text-white text-sm"
                                    />
                                    <button
                                        type="button"
                                        (click)="togglePassword()"
                                        class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    >
                                        <span
                                            class="material-symbols-outlined text-[20px]"
                                        >
                                            {{
                                                showPassword()
                                                    ? 'visibility_off'
                                                    : 'visibility'
                                            }}
                                        </span>
                                    </button>
                                </div>
                                @if (
                                    usernameForm.get('password')?.touched &&
                                    usernameForm
                                        .get('password')
                                        ?.hasError('required')
                                ) {
                                    <p
                                        class="text-xs text-red-500 font-medium ml-1"
                                    >
                                        La contraseña es obligatoria.
                                    </p>
                                }
                            </div>

                            <button
                                type="submit"
                                [disabled]="isLoading()"
                                class="w-full py-3 bg-primary text-bg-dark font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-smooth flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
                            >
                                @if (isLoading()) {
                                    <div
                                        class="w-5 h-5 border-2 border-bg-dark/30 border-t-bg-dark rounded-full animate-spin"
                                    ></div>
                                    <span>Actualizando...</span>
                                } @else {
                                    <span
                                        class="material-symbols-outlined text-[18px]"
                                        >save</span
                                    >
                                    <span>Guardar cambios</span>
                                }
                            </button>
                        </form>
                    }

                    <!-- ===== EMAIL FORM ===== -->
                    @if (activeView() === 'email') {
                        <form
                            [formGroup]="emailForm"
                            (ngSubmit)="onUpdateEmail()"
                            class="space-y-5"
                        >
                            <div class="space-y-2">
                                <label
                                    class="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1"
                                    for="newEmail"
                                    >Nuevo email</label
                                >
                                <div class="relative group">
                                    <div
                                        class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-fast"
                                    >
                                        <span
                                            class="material-symbols-outlined text-[20px]"
                                            >email</span
                                        >
                                    </div>
                                    <input
                                        id="newEmail"
                                        type="email"
                                        formControlName="newEmail"
                                        placeholder="nuevo@email.com"
                                        class="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-fast placeholder:text-slate-400 text-slate-900 dark:text-white text-sm"
                                    />
                                </div>
                                @if (
                                    emailForm.get('newEmail')?.touched &&
                                    emailForm
                                        .get('newEmail')
                                        ?.hasError('required')
                                ) {
                                    <p
                                        class="text-xs text-red-500 font-medium ml-1"
                                    >
                                        El email es obligatorio.
                                    </p>
                                }
                                @if (
                                    emailForm.get('newEmail')?.touched &&
                                    emailForm
                                        .get('newEmail')
                                        ?.hasError('email')
                                ) {
                                    <p
                                        class="text-xs text-red-500 font-medium ml-1"
                                    >
                                        El email no es válido.
                                    </p>
                                }
                            </div>

                            <!-- Password confirm -->
                            <div class="space-y-2">
                                <label
                                    class="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1"
                                    for="emailPassword"
                                    >Confirmar con contraseña</label
                                >
                                <div class="relative group">
                                    <div
                                        class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-fast"
                                    >
                                        <span
                                            class="material-symbols-outlined text-[20px]"
                                            >lock</span
                                        >
                                    </div>
                                    <input
                                        id="emailPassword"
                                        [type]="
                                            showPassword()
                                                ? 'text'
                                                : 'password'
                                        "
                                        formControlName="password"
                                        placeholder="Tu contraseña actual"
                                        class="block w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-fast placeholder:text-slate-400 text-slate-900 dark:text-white text-sm"
                                    />
                                    <button
                                        type="button"
                                        (click)="togglePassword()"
                                        class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    >
                                        <span
                                            class="material-symbols-outlined text-[20px]"
                                        >
                                            {{
                                                showPassword()
                                                    ? 'visibility_off'
                                                    : 'visibility'
                                            }}
                                        </span>
                                    </button>
                                </div>
                                @if (
                                    emailForm.get('password')?.touched &&
                                    emailForm
                                        .get('password')
                                        ?.hasError('required')
                                ) {
                                    <p
                                        class="text-xs text-red-500 font-medium ml-1"
                                    >
                                        La contraseña es obligatoria.
                                    </p>
                                }
                            </div>

                            <button
                                type="submit"
                                [disabled]="isLoading()"
                                class="w-full py-3 bg-primary text-bg-dark font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-smooth flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
                            >
                                @if (isLoading()) {
                                    <div
                                        class="w-5 h-5 border-2 border-bg-dark/30 border-t-bg-dark rounded-full animate-spin"
                                    ></div>
                                    <span>Actualizando...</span>
                                } @else {
                                    <span
                                        class="material-symbols-outlined text-[18px]"
                                        >save</span
                                    >
                                    <span>Guardar cambios</span>
                                }
                            </button>
                        </form>
                    }

                    <!-- ===== PASSWORD FORM ===== -->
                    @if (activeView() === 'password') {
                        <form
                            [formGroup]="passwordForm"
                            (ngSubmit)="onUpdatePassword()"
                            class="space-y-5"
                        >
                            <div class="space-y-2">
                                <label
                                    class="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1"
                                    for="newPassword"
                                    >Nueva contraseña</label
                                >
                                <div class="relative group">
                                    <div
                                        class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-fast"
                                    >
                                        <span
                                            class="material-symbols-outlined text-[20px]"
                                            >lock_reset</span
                                        >
                                    </div>
                                    <input
                                        id="newPassword"
                                        [type]="
                                            showNewPassword()
                                                ? 'text'
                                                : 'password'
                                        "
                                        formControlName="newPassword"
                                        placeholder="Mínimo 8 caracteres"
                                        class="block w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-fast placeholder:text-slate-400 text-slate-900 dark:text-white text-sm"
                                    />
                                    <button
                                        type="button"
                                        (click)="toggleNewPassword()"
                                        class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    >
                                        <span
                                            class="material-symbols-outlined text-[20px]"
                                        >
                                            {{
                                                showNewPassword()
                                                    ? 'visibility_off'
                                                    : 'visibility'
                                            }}
                                        </span>
                                    </button>
                                </div>
                                @if (
                                    passwordForm.get('newPassword')?.touched &&
                                    passwordForm
                                        .get('newPassword')
                                        ?.hasError('required')
                                ) {
                                    <p
                                        class="text-xs text-red-500 font-medium ml-1"
                                    >
                                        La nueva contraseña es obligatoria.
                                    </p>
                                }
                                @if (
                                    passwordForm.get('newPassword')?.touched &&
                                    passwordForm
                                        .get('newPassword')
                                        ?.hasError('minlength')
                                ) {
                                    <p
                                        class="text-xs text-red-500 font-medium ml-1"
                                    >
                                        Debe tener al menos 8 caracteres.
                                    </p>
                                }
                            </div>

                            <!-- Current password confirm -->
                            <div class="space-y-2">
                                <label
                                    class="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1"
                                    for="passwordPassword"
                                    >Contraseña actual</label
                                >
                                <div class="relative group">
                                    <div
                                        class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-fast"
                                    >
                                        <span
                                            class="material-symbols-outlined text-[20px]"
                                            >lock</span
                                        >
                                    </div>
                                    <input
                                        id="passwordPassword"
                                        [type]="
                                            showPassword()
                                                ? 'text'
                                                : 'password'
                                        "
                                        formControlName="password"
                                        placeholder="Tu contraseña actual"
                                        class="block w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-fast placeholder:text-slate-400 text-slate-900 dark:text-white text-sm"
                                    />
                                    <button
                                        type="button"
                                        (click)="togglePassword()"
                                        class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    >
                                        <span
                                            class="material-symbols-outlined text-[20px]"
                                        >
                                            {{
                                                showPassword()
                                                    ? 'visibility_off'
                                                    : 'visibility'
                                            }}
                                        </span>
                                    </button>
                                </div>
                                @if (
                                    passwordForm.get('password')?.touched &&
                                    passwordForm
                                        .get('password')
                                        ?.hasError('required')
                                ) {
                                    <p
                                        class="text-xs text-red-500 font-medium ml-1"
                                    >
                                        La contraseña actual es obligatoria.
                                    </p>
                                }
                            </div>

                            <button
                                type="submit"
                                [disabled]="isLoading()"
                                class="w-full py-3 bg-primary text-bg-dark font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-smooth flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
                            >
                                @if (isLoading()) {
                                    <div
                                        class="w-5 h-5 border-2 border-bg-dark/30 border-t-bg-dark rounded-full animate-spin"
                                    ></div>
                                    <span>Actualizando...</span>
                                } @else {
                                    <span
                                        class="material-symbols-outlined text-[18px]"
                                        >save</span
                                    >
                                    <span>Guardar contraseña</span>
                                }
                            </button>
                        </form>
                    }

                    <!-- ===== DELETE ACCOUNT ===== -->
                    @if (activeView() === 'delete') {
                        <div
                            class="mb-5 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                        >
                            <div class="flex items-start gap-3">
                                <span
                                    class="material-symbols-outlined text-red-500 text-[24px] mt-0.5"
                                    >warning</span
                                >
                                <div>
                                    <p
                                        class="text-sm font-bold text-red-700 dark:text-red-300"
                                    >
                                        Acción irreversible
                                    </p>
                                    <p
                                        class="text-xs text-red-600 dark:text-red-400 mt-1"
                                    >
                                        Tu cuenta será eliminada
                                        permanentemente junto con todos tus
                                        datos. Esta acción no se puede deshacer.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form
                            [formGroup]="deleteForm"
                            (ngSubmit)="onDeleteAccount()"
                            class="space-y-5"
                        >
                            <div class="space-y-2">
                                <label
                                    class="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1"
                                    for="deletePassword"
                                    >Confirmar con contraseña</label
                                >
                                <div class="relative group">
                                    <div
                                        class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-red-500 transition-fast"
                                    >
                                        <span
                                            class="material-symbols-outlined text-[20px]"
                                            >lock</span
                                        >
                                    </div>
                                    <input
                                        id="deletePassword"
                                        [type]="
                                            showPassword()
                                                ? 'text'
                                                : 'password'
                                        "
                                        formControlName="password"
                                        placeholder="Tu contraseña actual"
                                        class="block w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-800 border border-red-200 dark:border-red-800 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-fast placeholder:text-slate-400 text-slate-900 dark:text-white text-sm"
                                    />
                                    <button
                                        type="button"
                                        (click)="togglePassword()"
                                        class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    >
                                        <span
                                            class="material-symbols-outlined text-[20px]"
                                        >
                                            {{
                                                showPassword()
                                                    ? 'visibility_off'
                                                    : 'visibility'
                                            }}
                                        </span>
                                    </button>
                                </div>
                                @if (
                                    deleteForm.get('password')?.touched &&
                                    deleteForm
                                        .get('password')
                                        ?.hasError('required')
                                ) {
                                    <p
                                        class="text-xs text-red-500 font-medium ml-1"
                                    >
                                        La contraseña es obligatoria.
                                    </p>
                                }
                            </div>

                            <button
                                type="submit"
                                [disabled]="isLoading()"
                                class="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl active:scale-[0.98] transition-smooth flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
                            >
                                @if (isLoading()) {
                                    <div
                                        class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                    ></div>
                                    <span>Eliminando...</span>
                                } @else {
                                    <span
                                        class="material-symbols-outlined text-[18px]"
                                        >delete_forever</span
                                    >
                                    <span>Eliminar mi cuenta</span>
                                }
                            </button>
                        </form>
                    }
                </div>
            </aside>
        }
    `,
    styles: `
        :host {
            display: contents;
        }
        .animate-slide-in {
            animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideIn {
            from {
                transform: translateX(100%);
            }
            to {
                transform: translateX(0);
            }
        }
    `,
})
export class UserProfilePanelComponent {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);

    /** Inputs / Outputs */
    readonly isOpen = input<boolean>(false);
    readonly closed = output<void>();

    /** State signals */
    readonly activeView = signal<PanelView>('menu');
    readonly isLoading = signal(false);
    readonly errorMessage = signal('');
    readonly successMessage = signal('');
    readonly showPassword = signal(false);
    readonly showNewPassword = signal(false);

    readonly userName = computed(() => this.authService.user() ?? 'Usuario');

    /** Computed panel title based on active view */
    readonly panelTitle = signal('Mi Perfil');

    /** Forms */
    readonly usernameForm = this.fb.nonNullable.group({
        newUsername: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        password: ['', [Validators.required]],
    });

    readonly emailForm = this.fb.nonNullable.group({
        newEmail: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });

    readonly passwordForm = this.fb.nonNullable.group({
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        password: ['', [Validators.required]],
    });

    readonly deleteForm = this.fb.nonNullable.group({
        password: ['', [Validators.required]],
    });

    constructor() {
        // Reset state when panel opens/closes
        effect(() => {
            if (!this.isOpen()) {
                this.resetState();
            }
        });
    }

    navigateTo(view: PanelView): void {
        this.activeView.set(view);
        this.clearMessages();
        this.showPassword.set(false);
        this.showNewPassword.set(false);

        const titles: Record<PanelView, string> = {
            menu: 'Mi Perfil',
            username: 'Cambiar usuario',
            email: 'Cambiar email',
            password: 'Cambiar contraseña',
            delete: 'Eliminar cuenta',
        };
        this.panelTitle.set(titles[view]);
    }

    goBack(): void {
        this.navigateTo('menu');
    }

    close(): void {
        this.closed.emit();
    }

    togglePassword(): void {
        this.showPassword.update((v) => !v);
    }

    toggleNewPassword(): void {
        this.showNewPassword.update((v) => !v);
    }

    onUpdateUsername(): void {
        if (this.usernameForm.invalid) {
            this.usernameForm.markAllAsTouched();
            return;
        }
        this.clearMessages();
        this.isLoading.set(true);

        const { newUsername, password } = this.usernameForm.getRawValue();
        const request: UpdateRequest = { newUsername, password };

        this.authService.updateProfile(request).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.successMessage.set('Nombre de usuario actualizado correctamente. La sesión se renovó.');
                this.usernameForm.reset();
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(
                    err.error?.message || 'Error al actualizar el nombre de usuario.'
                );
            },
        });
    }

    onUpdateEmail(): void {
        if (this.emailForm.invalid) {
            this.emailForm.markAllAsTouched();
            return;
        }
        this.clearMessages();
        this.isLoading.set(true);

        const { newEmail, password } = this.emailForm.getRawValue();
        const request: UpdateRequest = { newEmail, password };

        this.authService.updateProfile(request).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.successMessage.set('Email actualizado correctamente.');
                this.emailForm.reset();
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(
                    err.error?.message || 'Error al actualizar el email.'
                );
            },
        });
    }

    onUpdatePassword(): void {
        if (this.passwordForm.invalid) {
            this.passwordForm.markAllAsTouched();
            return;
        }
        this.clearMessages();
        this.isLoading.set(true);

        const { newPassword, password } = this.passwordForm.getRawValue();
        const request: UpdateRequest = { newPassword, password };

        this.authService.updateProfile(request).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.successMessage.set('Contraseña actualizada correctamente.');
                this.passwordForm.reset();
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(
                    err.error?.message || 'Error al actualizar la contraseña.'
                );
            },
        });
    }

    onDeleteAccount(): void {
        if (this.deleteForm.invalid) {
            this.deleteForm.markAllAsTouched();
            return;
        }
        this.clearMessages();
        this.isLoading.set(true);

        const { password } = this.deleteForm.getRawValue();
        const request: DeleteAccountRequest = { password };

        this.authService.deleteAccount(request).subscribe({
            next: () => {
                this.isLoading.set(false);
                // Logout is handled inside authService.deleteAccount()
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(
                    err.error?.message || 'Error al eliminar la cuenta.'
                );
            },
        });
    }

    private clearMessages(): void {
        this.errorMessage.set('');
        this.successMessage.set('');
    }

    private resetState(): void {
        this.activeView.set('menu');
        this.panelTitle.set('Mi Perfil');
        this.clearMessages();
        this.isLoading.set(false);
        this.showPassword.set(false);
        this.showNewPassword.set(false);
        this.usernameForm.reset();
        this.emailForm.reset();
        this.passwordForm.reset();
        this.deleteForm.reset();
    }
}
