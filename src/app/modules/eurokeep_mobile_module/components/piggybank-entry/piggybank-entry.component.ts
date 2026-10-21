import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {AbstractComponent} from "../../../../components/abstract/abstract.component";
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent, CardHeaderComponent, ColComponent, ProgressComponent, RowComponent
} from "@coreui/angular";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Piggybank} from "../../../../services/piggybank/piggybank.interface";
import {RouterLink} from "@angular/router";
import {BalanceComponent} from "../../../../components/balance/balance.component";

@Component({
    selector: 'piggybank-entry',
    imports: [
        TranslocoDirective,
        BadgeComponent,
        FaIconComponent,
        CardComponent,
        CardBodyComponent,
        RouterLink,
        RowComponent,
        ColComponent,
        BalanceComponent,
        ProgressComponent
    ],
    templateUrl: './piggybank-entry.component.html',
    styleUrl: './piggybank-entry.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PiggybankEntryComponent extends AbstractComponent {
    readonly Piggybank = input.required<Piggybank>();

    /**
     * I will calculate the number of full months remaining until the Piggybank's `end` date,
     * floored at 0 once that date has passed. Returns null when no `end` is set.
     */
    protected getRemainingMonths(piggybank: Piggybank): number | null {
        if (!piggybank.end) {
            return null;
        }

        const end = new Date(piggybank.end);
        const now = new Date();
        let months = (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth());
        if (end.getDate() < now.getDate()) {
            months--;
        }

        return Math.max(months, 0);
    }

    /**
     * I will calculate the monthly rate (target - value) / remainingMonths that would need to
     * be saved to reach the target by the `end` date. Returns null when no `end` is set or the
     * `end` date has already been reached.
     */
    protected getSavingsRate(piggybank: Piggybank): number | null {
        const months = this.getRemainingMonths(piggybank);
        if (!months) {
            return null;
        }

        return Math.max((piggybank.target - piggybank.balance_value) / months, 0);
    }
}
