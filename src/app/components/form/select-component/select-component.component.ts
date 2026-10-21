import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormControlDirective, FormLabelDirective} from "@coreui/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ValidationFeedbackComponent} from "../validation-feedback/validation-feedback.component";
import {InputComponent} from "../input-component/input-component";
import {NgOptionTemplateDirective, NgSelectComponent} from "@ng-select/ng-select";
import {NgOptionHighlightDirective} from "@ng-select/ng-option-highlight";

@Component({
    selector: 'nox-select',
    imports: [
        TranslocoDirective,
        FormLabelDirective,
        ReactiveFormsModule,
        ValidationFeedbackComponent,
        FormsModule,
        NgSelectComponent,
        NgOptionTemplateDirective,
        NgOptionHighlightDirective,
        FormControlDirective,
    ],
    templateUrl: './select-component.component.html',
    styleUrl: './select-component.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent extends InputComponent {

    public bindLabel = input<string>('name');
    public bindValue = input<string>('id');
    public Items = input.required<any[]>();
}
