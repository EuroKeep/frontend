import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Category, categoryOptionLabel} from "../../../../../services/category/category.interface";
import {
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormDirective,
    RowComponent,
    ButtonGroupComponent
} from '@coreui/angular';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {TransactionService} from "../../../../../services/transaction/transaction.service";
import {Transaction, TransactionMappingResponse} from "../../../../../services/transaction/transaction.interface";
import {AbstractPageComponent} from "../../abstract/abstract-page.component";
import {Account} from "../../../../../services/account/account.interface";
import {InputComponent} from "../../../../../components/form/input-component/input-component";
import {CategoryService} from "../../../../../services/category/category.service";
import {OptionLabelFn, SelectComponent} from "../../../../../components/form/select-component/select-component.component";
import {SpamsaveDirective} from "../../../../../directives/spamsave.directive";
import {AccountService} from "../../../../../services/account/account.service";
import {AccountEntryComponent} from "../../../components/account-entry/account-entry.component";
import {ApiAddResponse, ApiIndexResponse, ApiViewResponse} from "../../../../../services/abstract/abstract.interface";
import {RouterLink} from "@angular/router";
import {BalanceInputComponent} from "../../../../../components/form/balance-input-component/balance-input-component";
import {SubscriptionService} from "../../../../../services/subscription/subscription.service";
import {Subscription} from "../../../../../services/subscription/subscription.interface";
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";

@Component({
    selector: 'transaction-list',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FormsModule,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        FaIconComponent,
        CardTitleDirective,
        RowComponent,
        ColComponent,
        FormDirective,
        ButtonDirective,
        InputComponent,
        SelectComponent,
        SpamsaveDirective,
        AccountEntryComponent,
        RouterLink,
        BalanceInputComponent,
        ButtonGroupComponent,
    ],
    templateUrl: './transaction-mobile-add.component.html',
    styleUrl: './transaction-mobile-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionMobileAddComponent extends AbstractPageComponent {

    protected readonly TransactionService: TransactionService = inject(TransactionService);
    protected readonly CategoryService: CategoryService = inject(CategoryService);
    protected readonly AccountService: AccountService = inject(AccountService);
    protected readonly SubscriptionsService: SubscriptionService = inject(SubscriptionService);

    protected accountId: number = 0;
    protected Account?: Account;
    protected Categories: Category[] = [];
    protected categoryOptionLabel: OptionLabelFn<Category> = categoryOptionLabel([]);
    protected Accounts: Account[] = [];
    protected Subscriptions: Subscription[] = [];
    protected post: Transaction = {} as Transaction;

    public override ngOnInit() {
        if (this.accountId === 0) {
            this.accountId = Number(this.ActivatedRoute.snapshot.paramMap.get('accountId'));
            this.post.account_id = this.accountId;
        }

        this.Subscription.add(this.CategoryService.index().subscribe({
            next: (result: ApiIndexResponse<Category>) => {
                this.Categories = result.items;
                this.categoryOptionLabel = categoryOptionLabel(this.Categories);
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));

        this.Subscription.add(this.AccountService.view(this.accountId).subscribe({
            next: (result: ApiViewResponse<Account>) => {
                this.Account = result.item;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));

        this.Subscription.add(this.SubscriptionsService.index({}).subscribe({
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

        super.ngOnInit();
    }


    protected findCategory(comment: string): void {
        if (this.post.category_id || this.post.comment.length < 3) {
            return;
        }
        this.Subscription.add(this.TransactionService.mapping(comment).subscribe({
            next: (result: TransactionMappingResponse) => {
                if (result.transaction.category_id) {
                    this.post.category_id = result.transaction.category_id;
                    this.ChangeDetectorRef.markForCheck();
                }
                if (result.transaction.subscription_id) {
                    this.post.subscription_id = result.transaction.subscription_id;
                    this.post.balance_value = result.transaction.balance_value;
                    this.ChangeDetectorRef.markForCheck();
                }

                this.ChangeDetectorRef.markForCheck();
            },
            error: (error: HttpErrorResponse) => this.handleMappingError(error)
        }));
    }

    /**
     * The mapping is only a suggestion while typing: "comment empty" (400) and "nothing found" (404)
     * are expected answers and must not bother the user with a notification.
     */
    private handleMappingError(error: HttpErrorResponse): void {
        if (error.status === HttpStatusCode.BadRequest || error.status === HttpStatusCode.NotFound) {
            return;
        }
        this.handleError(error?.error?.error);
    }

    protected foundTransaction?: Transaction;

    protected applyFoundComment(): void {
        if (!this.foundTransaction) {
            return;
        }
        this.post.category_id = this.foundTransaction.category_id;
        this.post.comment = this.foundTransaction.comment;

        this.foundTransaction = undefined;
        this.ChangeDetectorRef.markForCheck();
    }

    protected findComment(comment: string): void {
        if (comment.length < 3) {
            return;
        }
        this.Subscription.add(this.TransactionService.mapping(comment).subscribe({
            next: (result: TransactionMappingResponse) => {
                if (result.transaction.category) {
                    this.foundTransaction = result.transaction;
                }
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error: HttpErrorResponse) => this.handleMappingError(error)
        }));
    }

    public add(): void {
        this.lockButtons();

        this.Subscription.add(
            this.TransactionService.add(this.post).subscribe({
                next: (response: ApiAddResponse<Transaction>) => {
                    const title = this.TranslocoService.translate('Transaction');
                    const msg = this.TranslocoService.translate('added successfully');
                    const url = ['mobile', 'transaction', 'edit', response.item.id];

                    this.NotyService.scrollContentDivToTop();
                    this.NotyService.genericSuccess(msg, title, url);

                    this.errors = undefined;
                    this.ngOnInit();

                    if (this.post.transfer_id) {
                        let secondPost: Transaction = JSON.parse(JSON.stringify(this.post));
                        secondPost.account_id = this.post.transfer_id;
                        secondPost.balance_value = -this.post.balance_value;


                        this.Subscription.add(
                            this.TransactionService.add(secondPost).subscribe({
                                next: (response: ApiAddResponse<Transaction>) => {
                                    const title = this.TranslocoService.translate('Reverse Transaction');
                                    const msg = this.TranslocoService.translate('added successfully');
                                    const url = ['mobile', 'transaction', 'edit', response.item.id];

                                    this.NotyService.scrollContentDivToTop();
                                    this.NotyService.genericSuccess(msg, title, url);

                                    this.errors = undefined;
                                    this.ngOnInit();

                                    this.unlockButtons();
                                    this.ChangeDetectorRef.markForCheck();
                                },
                                error: (error) => {
                                    this.handleError(error.error.error);
                                    this.unlockButtons();
                                    this.ChangeDetectorRef.markForCheck();
                                }
                            })
                        );
                    }

                    this.unlockButtons();
                    this.ChangeDetectorRef.markForCheck();
                },
                error: (error) => {
                    this.handleError(error.error.error);
                    this.unlockButtons();
                    this.ChangeDetectorRef.markForCheck();
                }
            })
        );
    }
}
