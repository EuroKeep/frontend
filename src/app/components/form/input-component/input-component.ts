import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormControlDirective, FormLabelDirective} from "@coreui/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ValidationFeedbackComponent} from "../validation-feedback/validation-feedback.component";
import {AbstractInputComponent} from "../abstract-input/abstract-input.component";

@Component({
    selector: 'nox-input',
    imports: [
        TranslocoDirective,
        FormControlDirective,
        FormLabelDirective,
        ReactiveFormsModule,
        ValidationFeedbackComponent,
        FormsModule,
    ],
    templateUrl: './input-component.html',
    styleUrl: './input-component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent extends AbstractInputComponent {
}
