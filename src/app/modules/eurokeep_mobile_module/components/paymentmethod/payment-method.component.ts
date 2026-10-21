import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {AbstractComponent} from "../../../../components/abstract/abstract.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Paymentmethod} from "../../../../services/paymentmethod/paymentmethod.interface";
import {PaymentmethodService} from "../../../../services/paymentmethod/paymentmethod.service";

@Component({
    selector: 'paymentmethod',
    imports: [
        TranslocoDirective,
        FaIconComponent
    ],
    templateUrl: './payment-method.component.html',
    styleUrl: './payment-method.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentMethodComponent extends AbstractComponent {
    protected readonly PaymentmethodService: PaymentmethodService = inject(PaymentmethodService);
    readonly Paymentmethod = input.required<Paymentmethod>();
}
