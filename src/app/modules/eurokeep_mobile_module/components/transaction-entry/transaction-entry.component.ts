import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {AbstractComponent} from "../../../../components/abstract/abstract.component";
import {BalanceComponent} from "../../../../components/balance/balance.component";
import {ColComponent, RowComponent} from "@coreui/angular";
import {Transaction} from "../../../../services/transaction/transaction.interface";
import {Currency} from "../../../../services/currency/currency.interface";

@Component({
    selector: 'transaction-entry',
    imports: [
        TranslocoDirective,
        BalanceComponent,
        ColComponent,
        RowComponent,
    ],
    templateUrl: './transaction-entry.component.html',
    styleUrl: './transaction-entry.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionEntryComponent extends AbstractComponent {
    readonly Transaction = input.required<Transaction>();
    readonly Currency = input.required<Currency>();
}
