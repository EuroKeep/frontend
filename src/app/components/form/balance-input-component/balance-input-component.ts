import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormControlDirective, FormLabelDirective, InputGroupComponent, InputGroupTextDirective} from "@coreui/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ValidationFeedbackComponent} from "../validation-feedback/validation-feedback.component";
import {AbstractInputComponent} from "../abstract-input/abstract-input.component";
import {Currency} from "../../../services/currency/currency.interface";

@Component({
    selector: 'nox-balance-input',
    imports: [
        TranslocoDirective,
        FormControlDirective,
        FormLabelDirective,
        ReactiveFormsModule,
        ValidationFeedbackComponent,
        FormsModule,
        InputGroupTextDirective,
        InputGroupComponent
    ],
    templateUrl: './balance-input-component.html',
    styleUrl: './balance-input-component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BalanceInputComponent extends AbstractInputComponent {
    readonly Currency = input.required<Currency>();

    /**
     * I will compute the class / colour of the balance Component based on the value.
     */
    protected readonly class = computed((): string => {
        const value: number = Number(this.value());
        const classString: string = `currency ${this.Currency().toLowerCase()}`;
        if (value < 0) {
            return `${classString} text-danger`;
        }
        if (value === 0) {
            return classString;
        }
        return `${classString} text-success`;
    });
}
