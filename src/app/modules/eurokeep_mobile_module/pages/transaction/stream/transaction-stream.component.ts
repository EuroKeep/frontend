import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Category} from "../../../../../services/category/category.interface";
import {ButtonDirective, ButtonGroupComponent, ColComponent, FormDirective, RowComponent,} from '@coreui/angular';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {TransactionService} from "../../../../../services/transaction/transaction.service";
import {
    Settlement,
    Transaction,
    TransactionStreamResponse
} from "../../../../../services/transaction/transaction.interface";
import {AbstractPageComponent} from "../../abstract/abstract-page.component";
import {ApiIndexResponse} from "../../../../../services/abstract/abstract.interface";
import {Account} from "../../../../../services/account/account.interface";
import {CategoryService} from "../../../../../services/category/category.service";
import {AccountService} from "../../../../../services/account/account.service";
import {AccountEntryComponent} from "../../../components/account-entry/account-entry.component";
import {DateBrowserComponent} from "../../../../../components/date-browser/date-browser.component";
import {RouterLink} from "@angular/router";
import {
    TransactionListComponent
} from "../../../../../components/transaction/transaction-stream/transaction-list.component";

@Component({
    selector: 'transaction-stream',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FormsModule,
        FaIconComponent,
        RowComponent,
        ColComponent,
        ButtonDirective,
        AccountEntryComponent,
        DateBrowserComponent,
        RouterLink,
        ButtonGroupComponent,
        TransactionListComponent,
        FormDirective
    ],
    templateUrl: './transaction-stream.component.html',
    styleUrl: './transaction-stream.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionStreamComponent extends AbstractPageComponent {
    override helpUrl = 'https://docs.eurokeep.io/manual/Money%20Transactions/';

    private readonly TransactionService: TransactionService = inject(TransactionService);
    private readonly CategoryService: CategoryService = inject(CategoryService);
    private readonly AccountService: AccountService = inject(AccountService);

    protected params: any = {};
    protected accountId: number = 0;
    protected Transactions?: Transaction[];
    protected Account?: Account;
    protected Categories: Category[] = [];
    protected Accounts: Account[] = [];
    protected Settlement?: Settlement;

    public override ngOnInit() {
        this.accountId = Number(this.ActivatedRoute.snapshot.paramMap.get('accountId'));

        this.params.start = new Date();
        this.params.start.setUTCDate(1);
        this.params.start.setUTCHours(0);
        this.params.start.setUTCMinutes(0);
        this.params.start.setUTCSeconds(0);
        this.params.start.setUTCMilliseconds(0);

        this.params.end = new Date();
        this.params.end.setUTCDate(1);
        this.params.end.setUTCHours(0);
        this.params.end.setUTCMinutes(0);
        this.params.end.setUTCSeconds(0);
        this.params.end.setUTCMilliseconds(0);
        this.params.end.setUTCMonth(this.params.start.getUTCMonth() + 1);

        super.ngOnInit();

        this.Subscription.add(this.CategoryService.index().subscribe({
            next: (result: ApiIndexResponse<Category>) => {
                this.Categories = result.items;
                this.ChangeDetectorRef.markForCheck();

                this.Subscription.add(this.AccountService.index().subscribe({
                    next: (result: ApiIndexResponse<Account>) => {
                        this.Accounts = result.items;
                        this.ChangeDetectorRef.markForCheck();

                        this.stream();
                    },
                    error: (error) => this.handleError(error?.error?.error)
                }));
            },
            error: (error) => this.handleError(error?.error?.error)
        }));

    }

    protected stream(): void {
        this.params.accountId = this.accountId;
        let params = structuredClone(this.params);
        if (params.start instanceof Date) {
            params.start = params.start.toISOString();
        }
        if (params.end instanceof Date) {
            params.end = params.end.toISOString();
        }
        this.Subscription.add(this.TransactionService.stream(this.params.accountId, params).subscribe({
            next: (result: TransactionStreamResponse) => {
                this.Transactions = result.transactions;
                this.Account = result.account;

                // Put the Account in the Transaction.
                this.Transactions.forEach((value: Transaction) => {
                    value.account = this.Account;
                });
                this.Settlement = result.settlement;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
    }
}
