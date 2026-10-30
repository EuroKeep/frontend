import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormControlDirective, FormLabelDirective} from "@coreui/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ValidationFeedbackComponent} from "../validation-feedback/validation-feedback.component";
import {InputComponent} from "../input-component/input-component";
import {NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent} from "@ng-select/ng-select";
import {normalizeSearchText, OptionHighlightPipe, searchWords} from "./option-highlight.pipe";

export type OptionLabelFn<T> = (item: T) => string;

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
        NgLabelTemplateDirective,
        OptionHighlightPipe,
        FormControlDirective,
    ],
    templateUrl: './select-component.component.html',
    styleUrl: './select-component.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent<T = any> extends InputComponent {

    public Items = input.required<T[]>();
    public bindLabel = input<string>('name');
    public bindValue = input<string>('id');
    public optionLabel = input<OptionLabelFn<T>>();
    /** Optional: builds the text shown for the selected value; defaults to the bindLabel field. */
    public selectedLabel = input<OptionLabelFn<T>>();

    public getOptionLabel(item: T): string {
        const optionLabel = this.optionLabel();
        if (optionLabel) {
            return optionLabel(item);
        }

        const record = item as Record<string, unknown> | null | undefined;
        const label = String(record?.[this.bindLabel()] ?? '');
        return record?.['emoji'] ? `${record['emoji']} ${label}` : label;
    }

    public getSelectedLabel(item: T): string {
        const selectedLabel = this.selectedLabel();
        if (selectedLabel) {
            return selectedLabel(item);
        }

        const record = item as Record<string, unknown> | null | undefined;
        return String(record?.[this.bindLabel()] ?? '');
    }

    public searchByOptionLabel = (term: string, item: T): boolean => {
        const label = normalizeSearchText(this.getOptionLabel(item));
        return searchWords(term).every(word => label.includes(word));
    };
}
