import {
    Directive,
    input,
    Output,
    EventEmitter,
    HostListener,
    ElementRef,
    Renderer2,
    OnChanges,
    inject
} from '@angular/core';

@Directive({
    selector: '[nSpamsaveButton]'
})
export class SpamsaveDirective implements OnChanges {
    readonly isWorking = input<boolean>(false, {alias: 'nSpamsaveButton'});
    readonly showSpinner = input<boolean>(true);
    @Output() clicked = new EventEmitter<void>();

    private spinner?: HTMLElement;
    private ElementRef: ElementRef = inject(ElementRef);
    private Renderer2: Renderer2 = inject(Renderer2);

    ngOnChanges(): void {
        if (this.isWorking()) {
            this.lock();
            return;
        }
        this.unlock();
    }

    @HostListener('click', ['$event'])
    onClick(event: Event) {
        if (this.isWorking() || this.ElementRef.nativeElement.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
        }

        this.clicked.emit();
    }

    private lock() {
        const button: HTMLButtonElement = this.ElementRef.nativeElement;

        // Loading class
        this.Renderer2.addClass(button, 'is-loading');

        // Button sperren
        button.disabled = true;

        if (this.showSpinner() && !this.spinner) {
            this.spinner = this.Renderer2.createElement('i');
            this.Renderer2.addClass(this.spinner, 'fas');
            this.Renderer2.addClass(this.spinner, 'fa-spinner');
            this.Renderer2.addClass(this.spinner, 'fa-spin');
            this.Renderer2.setStyle(this.spinner, 'margin-left', '0.5rem');
            this.Renderer2.appendChild(button, this.spinner);
        }
    }


    private unlock() {
        const button: HTMLButtonElement = this.ElementRef.nativeElement;

        // Loading class
        this.Renderer2.removeClass(button, 'is-loading');

        // Button freigeben
        button.disabled = false;

        // Spinner entfernen
        if (this.showSpinner() && this.spinner) {
            this.Renderer2.removeChild(button, this.spinner);
            this.spinner = undefined;
        }
    }
}