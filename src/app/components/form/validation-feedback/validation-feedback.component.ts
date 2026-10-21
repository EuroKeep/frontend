import {ChangeDetectionStrategy, Component, effect, input} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {GenericValidationError} from "../../../generic-responses";
import {AbstractComponent} from "../../abstract/abstract.component";

@Component({
    selector: 'validation-feedback',
    imports: [
        TranslocoDirective
    ],
    templateUrl: './validation-feedback.component.html',
    styleUrl: './validation-feedback.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidationFeedbackComponent extends AbstractComponent {
    public errors = input<GenericValidationError | undefined>(undefined);
    public errorField = input.required<string>();

    public hasError: boolean = false;
    public errorMessages: string[] = [];

    constructor() {
        super();
        effect(() => {
            this.ChangeDetectorRef.markForCheck();

            const errors = this.errors();
            const errorField = this.errorField();

            if (errors && errorField) {
                // Field names may be dotted paths into nested errors (e.g. 'account.name').
                const fieldErrorMessages = errorField.split('.')
                    .reduce((node: any, key: string) => node?.[key], errors);

                this.hasError = false;
                this.errorMessages = [];
                if (fieldErrorMessages) {
                    this.hasError = true;
                    this.errorMessages = Object.values(fieldErrorMessages);
                }
            }
        });
    }
}
