import {
    Directive,
    ElementRef,
    Renderer2,
    inject,
    OnInit
} from '@angular/core';
import {DiscreteService} from "../services/discrete/discrete.service";

@Directive({
    selector: '[nIsIndiscrete]'
})
export class IndiscreteDirective implements OnInit {
    private readonly DiscreteService : DiscreteService = inject(DiscreteService);
    private readonly ElementRef: ElementRef = inject(ElementRef);
    private readonly Renderer2: Renderer2 = inject(Renderer2);

    ngOnInit(): void {
        // I will subscribe to changes to the isDiscrete$ observable.
        this.DiscreteService.isDiscrete$.subscribe( (isDiscrete: boolean) => {
            // If mode goes into "isDiscrete", hide me.
            if(isDiscrete) {
                this.hide();
                return;
            }

            // Otherwise show me.
            this.show();
        });
    }

    private hide(): void {
        this.Renderer2.removeClass(this.ElementRef.nativeElement, 'discrete');
    }


    private show(): void {
        this.Renderer2.addClass(this.ElementRef.nativeElement, 'discrete');
    }
}