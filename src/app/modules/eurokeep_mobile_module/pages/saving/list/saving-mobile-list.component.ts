import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    BadgeComponent,
    ButtonDirective, ButtonGroupComponent,
    CardBodyComponent,
    CardComponent, CardHeaderComponent,
    ColComponent, ContainerComponent, ProgressComponent, RowComponent
} from '@coreui/angular';
import {BalanceComponent} from "../../../../../components/balance/balance.component";
import {RouterLink} from "@angular/router";
import {AbstractIndexComponent} from "../../../../account_module/pages/abstract-index/abstract-index.component";
import {PiggybankService} from "../../../../../services/piggybank/piggybank.service";
import {Piggybank} from "../../../../../services/piggybank/piggybank.interface";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Currency} from "../../../../../services/currency/currency.interface";
import {ApiIndexResponse} from "../../../../../services/abstract/abstract.interface";
import {PiggybankEntryComponent} from "../../../components/piggybank-entry/piggybank-entry.component";

@Component({
    selector: 'piggybank-list',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FormsModule,
        RouterLink,
        RowComponent,
        ColComponent,
        ButtonDirective,
        FaIconComponent,
        ContainerComponent,
        PiggybankEntryComponent,
        ButtonGroupComponent,
    ],
    templateUrl: './saving-mobile-list.component.html',
    styleUrl: './saving-mobile-list.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SavingMobileListComponent extends AbstractIndexComponent {

    // THE Service
    private readonly PiggybankService: PiggybankService = inject(PiggybankService);

    // THE Items
    protected Piggybanks?: Piggybank[];

    protected override index(): void {
        this.lockButtons();
        this.Subscription.add(this.PiggybankService.index({}).subscribe({
            next: (result: ApiIndexResponse<Piggybank>) => {
                this.Piggybanks = result.items;
                this.unlockButtons();
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
    }

    protected readonly Currency = Currency;

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
