import {ChangeDetectionStrategy, Component, effect, EventEmitter, input, model, Output} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {GenericValidationError} from "../../../generic-responses";
import {AbstractComponent} from "../../abstract/abstract.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
    selector: 'abstract-input',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FormsModule,
    ],
    templateUrl: './abstract-input.component.html',
    styleUrl: './abstract-input.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbstractInputComponent extends AbstractComponent {
    public errors = input<GenericValidationError | undefined>(undefined);
    public value = model<any>(null);
    public placeholder = input<string>('');
    public label = input<string>('');
    public required = input<boolean>(false);

    public type = input<string>('text');
    public name = input.required<string>();

    constructor() {
        super();
        effect(() => {
            this.ChangeDetectorRef.markForCheck();
        });
    }

    @Output() onChange = new EventEmitter<any>();
    changeSignal(): void {
        this.ChangeDetectorRef.markForCheck();
        this.onChange.emit(this.value());
    }
}
