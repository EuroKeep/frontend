import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {AbstractComponent} from "../../../../components/abstract/abstract.component";
import {BalanceComponent} from "../../../../components/balance/balance.component";
import {ColComponent, RowComponent} from "@coreui/angular";
import {Subscription} from "../../../../services/subscription/subscription.interface";
import {SubscriptionService} from "../../../../services/subscription/subscription.service";

@Component({
    selector: 'subscription-image',
    imports: [
        TranslocoDirective,
        BalanceComponent,
        ColComponent,
        RowComponent,
    ],
    templateUrl: './subscription-image.component.html',
    styleUrl: './subscription-image.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionImageComponent extends AbstractComponent {
    protected readonly SubscriptionService: SubscriptionService = inject(SubscriptionService);
    readonly SubscriptionItem = input.required<Subscription>();

}
