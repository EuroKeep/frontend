import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AbstractPageComponent} from "../../abstract/abstract-page.component";
import {TransactionService} from "../../../../../services/transaction/transaction.service";
import {ApiIndexResponse} from "../../../../../services/abstract/abstract.interface";
import {Transaction, TransactionIndexResponse} from "../../../../../services/transaction/transaction.interface";
import {InputComponent} from "../../../../../components/form/input-component/input-component";
import {SelectComponent} from "../../../../../components/form/select-component/select-component.component";
import {CategoryService} from "../../../../../services/category/category.service";
import {Category} from "../../../../../services/category/category.interface";
import {Subscription} from "../../../../../services/subscription/subscription.interface";
import {SubscriptionService} from "../../../../../services/subscription/subscription.service";
import {AccountService} from "../../../../../services/account/account.service";
import {Account} from "../../../../../services/account/account.interface";
import {
    TransactionListComponent
} from "../../../../../components/transaction/transaction-stream/transaction-list.component";
import {
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ColComponent,
    RowComponent
} from "@coreui/angular";
import {BalanceComponent} from "../../../../../components/balance/balance.component";
import {Currency} from "../../../../../services/currency/currency.interface";
import {DateBrowserComponent} from "../../../../../components/date-browser/date-browser.component";

@Component({
    selector: 'analyzer-transactions',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FormsModule,
        InputComponent,
        SelectComponent,
        TransactionListComponent,
        CardBodyComponent,
        RowComponent,
        ColComponent,
        BalanceComponent,
        CardComponent,
        CardHeaderComponent,
        ButtonDirective,
        DateBrowserComponent

    ],
    templateUrl: './analyzer-transactions.component.html',
    styleUrl: './analyzer-transactions.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalzerTransactionsComponent extends AbstractPageComponent {

    protected post: any = {
        comment : '',
        start: '',
        end: ''
    };

    protected Categories: Category[] = [];
    protected Accounts: Account[] = [];
    protected Subscriptions: Subscription[] = [];
    protected Transactions: Transaction[] = [];

    private readonly SubscriptionService: SubscriptionService = inject(SubscriptionService);
    private readonly AccountService: AccountService = inject(AccountService);
    private readonly CategoryService: CategoryService = inject(CategoryService);
    private readonly TransactionService: TransactionService = inject(TransactionService);

    override ngOnInit() {


        this.post.start = new Date();
        this.post.start.setUTCDate(1);
        this.post.start.setUTCHours(0);
        this.post.start.setUTCMinutes(0);
        this.post.start.setUTCSeconds(0);
        this.post.start.setUTCMilliseconds(0);

        this.post.end = new Date();
        this.post.end.setUTCDate(1);
        this.post.end.setUTCHours(0);
        this.post.end.setUTCMinutes(0);
        this.post.end.setUTCSeconds(0);
        this.post.end.setUTCMilliseconds(0);
        this.post.end.setUTCMonth(this.post.start.getUTCMonth() + 1);

        this.Subscription.add(this.CategoryService.index().subscribe({
            next: (result: ApiIndexResponse<Category>) => {
                this.Categories = result.items;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));


        this.Subscription.add(this.SubscriptionService.index({}).subscribe({
            next: (result: ApiIndexResponse<Subscription>) => {
                this.Subscriptions = result.items;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
        this.Subscription.add(this.AccountService.index().subscribe({
            next: (result: ApiIndexResponse<Account>) => {
                this.Accounts = result.items;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
        this.search();
        super.ngOnInit();
    }

    protected total: number = 0;
    protected expenses: number = 0;
    protected revenues: number = 0;

    protected search(): void {
        let post = structuredClone(this.post);
        if (post.start instanceof Date) {
            post.start = post.start.toISOString();
        }
        if (post.end instanceof Date) {
            post.end = post.end.toISOString();
        }
        this.lockButtons();
        this.Subscription.add(this.TransactionService.index(post).subscribe({
            next: (result: TransactionIndexResponse) => {
                this.Transactions = result.items;
                this.total = result.total;
                this.expenses = result.expenses;
                this.revenues = result.revenues;
                console.warn(this.Transactions);
                this.ChangeDetectorRef.markForCheck();
                this.unlockButtons();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));

    }

    protected readonly Currency = Currency;
}