import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    BadgeComponent,
    ButtonDirective, ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    ColComponent,
    RowComponent,
} from '@coreui/angular';
import {BalanceComponent} from "../../../../../components/balance/balance.component";
import {RouterLink} from "@angular/router";
import {AbstractIndexComponent} from "../../../../account_module/pages/abstract-index/abstract-index.component";
import {SubscriptionService} from "../../../../../services/subscription/subscription.service";
import {
    Subscription,
    SubscriptionForecast} from "../../../../../services/subscription/subscription.interface";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Currency} from "../../../../../services/currency/currency.interface";
import {DiscreteDirective} from "../../../../../directives/discrete.directive";
import {ApiIndexResponse} from "../../../../../services/abstract/abstract.interface";
import {PaymentMethodComponent} from "../../../components/paymentmethod/payment-method.component";
import {SubscriptionImageComponent} from "../../../components/subscription-logo/subscription-image.component";

@Component({
    selector: 'subscription-list',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FormsModule,
        CardComponent,
        CardBodyComponent,
        BalanceComponent,
        RouterLink,
        RowComponent,
        ColComponent,
        ButtonDirective,
        FaIconComponent,
        DiscreteDirective,
        PaymentMethodComponent,
        BadgeComponent,
        SubscriptionImageComponent,
        ButtonGroupComponent,
    ],
    templateUrl: './subscription-mobile-list.html',
    styleUrl: './subscription-mobile-list.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionMobileListComponent extends AbstractIndexComponent {

    // THE Service
    private readonly SubscriptionService: SubscriptionService = inject(SubscriptionService);

    // THE Items
    protected Subscriptions?: Subscription[];

    protected override index(): void {
        this.lockButtons();
        this.Subscription.add(this.SubscriptionService.index(this.params).subscribe({
            next: (result: ApiIndexResponse<Subscription>) => {
                this.Subscriptions = result.items;
                this.unlockButtons();
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
    }

    protected readonly Currency = Currency;
    private previous: string = '';

    /**
     * I will parse an interval like "1M" or "2W" into its value and unit (D, W, M, Y).
     */
    private parseInterval(interval: string): { value: number, unit: string } | null {
        const match = String(interval).trim().match(/^(\d+)\s*([DWMY])$/i);

        if (!match || Number(match[1]) < 1) {
            return null;
        }

        return {value: Number(match[1]), unit: match[2].toUpperCase()};
    }

    /**
     * I will return the date of the n-th execution after $start (UTC).
     * Monthly/annual executions keep the day of $start, clamped to the last day of shorter months.
     */
    private addInterval(start: Date, interval: { value: number, unit: string }, n: number): Date {
        const days = {D: 1, W: 7}[interval.unit as 'D' | 'W'];
        if (days) {
            return new Date(start.getTime() + days * interval.value * n * 86400000);
        }

        const months = interval.value * n * (interval.unit === 'Y' ? 12 : 1);
        const year = start.getUTCFullYear();
        const month = start.getUTCMonth() + months;
        const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

        return new Date(Date.UTC(year, month, Math.min(start.getUTCDate(), lastDay)));
    }

    /**
     * I will calculate the next execution of the Subscription from today on (today included).
     * @return string|null I am the date as YYYY-MM-DD, or null if there is none (no interval/start or already ended).
     */
    protected nextDueDate(subscription: Subscription): string | null {
        const interval = this.parseInterval(subscription.interval);
        const start = new Date(subscription.start);

        if (!interval || !subscription.start || isNaN(start.getTime())) {
            return null;
        }

        const now = new Date();
        const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

        // Jump close to today instead of stepping through every execution since $start.
        let n: number;
        if (interval.unit === 'D' || interval.unit === 'W') {
            const stepDays = interval.value * (interval.unit === 'W' ? 7 : 1);
            n = Math.floor((today.getTime() - start.getTime()) / (stepDays * 86400000));
        } else {
            const elapsedMonths = (today.getUTCFullYear() - start.getUTCFullYear()) * 12
                + today.getUTCMonth() - start.getUTCMonth();
            n = Math.floor(elapsedMonths / (interval.value * (interval.unit === 'Y' ? 12 : 1)));
        }
        n = Math.max(0, n);

        let due = this.addInterval(start, interval, n);
        while (due < today) {
            due = this.addInterval(start, interval, ++n);
        }

        if (subscription.end && due > new Date(subscription.end)) {
            return null;
        }

        return due.toISOString().slice(0, 10);
    }

    /**
     * I will extrapolate the amount per execution to a full year.
     * @return number|null I am the annual cost, or null if the interval cannot be parsed.
     */
    protected annualCost(subscription: Subscription): number | null {
        const interval = this.parseInterval(subscription.interval);

        if (!interval) {
            return null;
        }

        const perYear = {D: 365, W: 52, M: 12, Y: 1}[interval.unit as 'D' | 'W' | 'M' | 'Y'] / interval.value;

        return Math.round(Number(subscription.balance_value) * perYear * 100) / 100;
    }

    protected formatInterval(interval: string): string {
        const parsed = this.parseInterval(interval);

        if (!parsed) {
            return interval;
        }

        const value = parsed.value;
        const unit = parsed.unit;

        const units : any= {
            D: [
                this.TranslocoService.translate('daily'),
                this.TranslocoService.translate('day'),
                this.TranslocoService.translate('days'),
            ],
            W: [
                this.TranslocoService.translate('weekly'),
                this.TranslocoService.translate('week'),
                this.TranslocoService.translate('weeks'),
            ],
            M: [
                this.TranslocoService.translate('monthly'),
                this.TranslocoService.translate('month'),
                this.TranslocoService.translate('months'),
            ],
            Y: [
                this.TranslocoService.translate('annually'),
                this.TranslocoService.translate('year'),
                this.TranslocoService.translate('years'),
            ],
        };

        if (!units[unit]) {
            return interval;
        }

        const [short, singular, plural] = units[unit];

        if (value === 1) {
            return short;
        }

        return `${value} ${value === 1 ? singular : plural}`;
    }


    showDate(subscriptionForecast: SubscriptionForecast, index: number): boolean {
        let current: string = this.formatMonthDate(subscriptionForecast.execution);
        if (index === 0) {
            this.previous = current;
            return true;
        }

        if (this.previous === '' || this.previous !== current) {
            this.previous = current;
            return true;
        }

        return false;
    }
}
