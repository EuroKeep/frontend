import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {
    ButtonDirective,
    ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    ColComponent,
    RowComponent
} from '@coreui/angular';
import {RouterLink} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {AbstractIndexComponent} from "../../../../account_module/pages/abstract-index/abstract-index.component";
import {PaymentmethodService} from "../../../../../services/paymentmethod/paymentmethod.service";
import {
    Paymentmethod,
    PaymentmethodFlagActive
} from "../../../../../services/paymentmethod/paymentmethod.interface";
import {PaymentMethodComponent} from "../../../components/paymentmethod/payment-method.component";

@Component({
    selector: 'paymentmethod-list',
    imports: [
        TranslocoDirective,
        RouterLink,
        RowComponent,
        ColComponent,
        CardComponent,
        CardBodyComponent,
        ButtonDirective,
        FaIconComponent,
        ButtonGroupComponent,
        PaymentMethodComponent,
    ],
    templateUrl: './paymentmethod-list.component.html',
    styleUrl: './paymentmethod-list.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentmethodListComponent extends AbstractIndexComponent {
    // Inject Service
    protected override CrudService: PaymentmethodService = inject(PaymentmethodService);

    // Define Item Type
    protected override Items: Paymentmethod[] = [];

    // Manage inactive payment methods as well
    protected override params: any = {all: 1};

    protected isActive(Paymentmethod: Paymentmethod): boolean {
        return (Paymentmethod.flags & PaymentmethodFlagActive) === PaymentmethodFlagActive;
    }
}
