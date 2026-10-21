import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {AbstractComponent} from "../../../../components/abstract/abstract.component";
import {BalanceComponent} from "../../../../components/balance/balance.component";
import {CardBodyComponent, CardComponent, ColComponent, RowComponent} from "@coreui/angular";
import {Transaction} from "../../../../services/transaction/transaction.interface";
import {Currency} from "../../../../services/currency/currency.interface";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'transaction-detail-entry',
    imports: [
        TranslocoDirective,
        BalanceComponent,
        ColComponent,
        RowComponent,
        CardComponent,
        CardBodyComponent,
        RouterLink,
    ],
    templateUrl: './transaction-detail-entry.component.html',
    styleUrl: './transaction-detail-entry.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionDetailEntryComponent extends AbstractComponent {
    readonly Transaction = input.required<Transaction>();
    readonly Currency = input.required<Currency>();
}
