import {ChangeDetectionStrategy, Component, EventEmitter, input, Output} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {AbstractComponent} from "../abstract/abstract.component";
import {ButtonDirective, CardBodyComponent, CardComponent, ColComponent, RowComponent} from "@coreui/angular";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
    selector: 'date-browser',
    imports: [
        TranslocoDirective,
        ColComponent,
        RowComponent,
        CardBodyComponent,
        CardComponent,
        FaIconComponent,
        ButtonDirective,
    ],
    templateUrl: './date-browser.component.html',
    styleUrl: './date-browser.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateBrowserComponent extends AbstractComponent {
    readonly Start = input.required<Date>();
    readonly End = input.required<Date>();
    readonly BlockIncrease = input<boolean>(false);

    @Output() changed = new EventEmitter<Date>();

    protected _IncrementBlocked: boolean = false;

    override ngOnInit() {
        this.verifyNextMovements();

        super.ngOnInit();
    }

    protected increase(): void {
        if (this.blockIncrease()) {
            return;
        }
        this.Start().setUTCMonth(this.Start().getUTCMonth() + 1);
        this.End().setUTCMonth(this.End().getUTCMonth() + 1);

        this.emitChanges();
    }

    protected decrease(): void {
        this.Start().setUTCMonth(this.Start().getUTCMonth() - 1);
        this.End().setUTCMonth(this.End().getUTCMonth() - 1);

        this.emitChanges();
    }

    private emitChanges(): void {
        // NORMALIZE END
        this.End().setUTCDate(1);
        this.End().setUTCHours(0);
        this.End().setUTCMinutes(0);
        this.End().setUTCSeconds(0);

        // NORMALIZE START
        this.Start().setUTCDate(1);
        this.Start().setUTCHours(0);
        this.Start().setUTCMinutes(0);
        this.Start().setUTCSeconds(0);

        // EMIT THE CHANGE
        this.changed.emit(this.Start());

        // CHECK IF THE DATE RANGE MAY BE EXCEEDED WITH THE NEXT INCREASE / DECREASE
        this.verifyNextMovements();

        // FINALLY THE NEEDED STUPH
        this.ChangeDetectorRef.markForCheck();
    }

    private verifyNextMovements(): void {
        if (!this.BlockIncrease()) {
            return;
        }

        let startString: string = this.Start().getUTCMonth().toString() + this.Start().getUTCFullYear().toString();
        let nowString: string = (new Date()).getUTCMonth().toString() + (new Date()).getUTCFullYear().toString();

        this._IncrementBlocked = startString === nowString;
    }

    private blockIncrease(): boolean {
        if (!this.BlockIncrease()) {
            return false;
        }
        let startString: string = this.Start().getUTCMonth().toString() + this.Start().getUTCFullYear().toString();
        let nowString: string = (new Date()).getUTCMonth().toString() + (new Date()).getUTCFullYear().toString();
        if (startString === nowString) {
            return true;
        }
        return false;
    }
}
