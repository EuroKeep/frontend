import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {GenericValidationError} from "../../../generic-responses";
import {AbstractComponent} from "../../abstract/abstract.component";
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormControlDirective, NavComponent, NavItemComponent, RowComponent
} from "@coreui/angular";
import {FormsModule} from "@angular/forms";
import {
    TransactionEntryComponent
} from "../../../modules/eurokeep_mobile_module/components/transaction-entry/transaction-entry.component";
import {Transaction} from "../../../services/transaction/transaction.interface";
import {Account} from "../../../services/account/account.interface";
import {RouterLink} from "@angular/router";
import {Currency} from "../../../services/currency/currency.interface";

@Component({
    selector: 'transaction-list',
    imports: [
        TranslocoDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        FormControlDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        RowComponent,
        TransactionEntryComponent,
        RouterLink
    ],
    templateUrl: './transaction-list.component.html',
    styleUrl: './transaction-list.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionListComponent extends AbstractComponent {

    readonly Transactions = input.required<Transaction[]>();


    public hasError: boolean = false;
    public errorMessages: string[] = [];


    protected filterString: string = '';
    protected filter(): void {
        this.previous = '';
    }

    protected filterTransaction(transaction: Transaction): boolean {
        if (this.filterString.length === 0) {
            return false;
        }
        if (transaction.comment.toLocaleLowerCase().indexOf(this.filterString.toLocaleLowerCase()) !== -1
            || transaction.category?.name.toLocaleLowerCase().indexOf(this.filterString.toLocaleLowerCase()) !== -1) {
            return false;
        }
        return true;
    }

    private previous: string = '';

    showDate(transaction: Transaction, index: number): boolean {
        let current: string = this.formatDate(transaction.created);
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

    protected readonly Currency = Currency;
}
