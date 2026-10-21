import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {AbstractComponent} from "../abstract/abstract.component";
import {ProgressComponent} from "@coreui/angular";
import {Piggybank} from "../../services/piggybank/piggybank.interface";

@Component({
    selector: 'piggybank-progressbar',
    imports: [
        TranslocoDirective,
        ProgressComponent,
    ],
    templateUrl: './piggybank-progressbar.component.html',
    styleUrl: './piggybank-progressbar.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PiggybankProgressbarComponent extends AbstractComponent {
    readonly Piggybank = input.required<Piggybank>();

    protected readonly color: string = 'success';

    protected readonly Math = Math;
}
