import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {AbstractComponent} from "../../../../components/abstract/abstract.component";
import {BalanceComponent} from "../../../../components/balance/balance.component";
import {ColComponent, RowComponent} from "@coreui/angular";
import {Subscription} from "../../../../services/subscription/subscription.interface";
import {Currency} from "../../../../services/currency/currency.interface";

@Component({
    selector: 'subscription-entry',
    imports: [
        TranslocoDirective,
        BalanceComponent,
        ColComponent,
        RowComponent,
    ],
    templateUrl: './subscription-entry.component.html',
    styleUrl: './subscription-entry.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionEntryComponent extends AbstractComponent {
    readonly SubscriptionItem = input.required<Subscription>();
    readonly Currency = input.required<Currency>();
}
