import {ChangeDetectionStrategy, Component, SimpleChanges} from '@angular/core';
import {TranslocoDirective, TranslocoService} from '@jsverse/transloco';
import {ColComponent, FormLabelDirective, RowComponent} from "@coreui/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ValidationFeedbackComponent} from "../validation-feedback/validation-feedback.component";
import {AbstractInputComponent} from "../abstract-input/abstract-input.component";
import {SelectComponent} from "../select-component/select-component.component";
import {InputComponent} from "../input-component/input-component";

@Component({
    selector: 'nox-interval-input',
    imports: [
        TranslocoDirective,
        FormLabelDirective,
        ReactiveFormsModule,
        ValidationFeedbackComponent,
        FormsModule,
        ColComponent,
        SelectComponent,
        RowComponent,
        InputComponent,
        InputComponent,
    ],
    templateUrl: './interval-input.component.html',
    styleUrl: './interval-input.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntervalInputComponent extends AbstractInputComponent {
    protected intervalCharacter: string = 'Y';
    protected intervalCharacters: any[] = [
        {
            'name': this.TranslocoService.translate('Year'),
            'id': 'Y'
        },
        {
            'name': this.TranslocoService.translate('Month'),
            'id': 'M'
        },
        {
            'name': this.TranslocoService.translate('Day'),
            'id': 'D'
        }
    ];

    protected intervalNumber: number = 0;

    public override ngOnChanges(changes: SimpleChanges) {
        if (this.value() !== null) {
            this.intervalCharacter = this.getCharacter(this.value().toString());
            this.intervalNumber = this.getNumber(this.value().toString());
        }

        this.ChangeDetectorRef.markForCheck();

        super.ngOnChanges(changes);
    }


    private getNumber(value: string): number {
        return Number(value.match(/^\d+/)?.[0] ?? 0);
    }

    private getCharacter(value: string): string {
        return value.match(/[A-Za-z]+$/)?.[0] ?? '';
    }

    override changeSignal() {
        this.value.set(this.intervalNumber.toString() + this.intervalCharacter.toString());
        super.changeSignal();
    }
}
