import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
    selector: 'app-loading-spinner',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="flex flex-col items-center justify-center gap-3 py-12" [attr.aria-label]="message()">
      <div
        class="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"
      ></div>
      @if (message()) {
        <p class="text-sm text-slate-500 font-medium">{{ message() }}</p>
      }
    </div>
  `,
})
export class LoadingSpinnerComponent {
    readonly message = input<string>('Cargando datos...');
}
