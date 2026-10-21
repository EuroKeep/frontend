import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormDirective,
    RowComponent,
    ButtonGroupComponent
} from '@coreui/angular';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Transaction} from "../../../../../services/transaction/transaction.interface";
import {InputComponent} from "../../../../../components/form/input-component/input-component";
import {SelectComponent} from "../../../../../components/form/select-component/select-component.component";
import {SpamsaveDirective} from "../../../../../directives/spamsave.directive";
import {AccountEntryComponent} from "../../../components/account-entry/account-entry.component";
import {
    ApiEditResponse,
    ApiViewResponse
} from "../../../../../services/abstract/abstract.interface";
import {RouterLink} from "@angular/router";
import {TransactionMobileAddComponent} from "../add/transaction-mobile-add.component";
import {BalanceInputComponent} from "../../../../../components/form/balance-input-component/balance-input-component";

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
        CardFooterComponent,
        BalanceInputComponent,
        ButtonGroupComponent,
    ],
    templateUrl: './transaction-mobile-edit.component.html',
    styleUrl: './transaction-mobile-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionMobileEditComponent extends TransactionMobileAddComponent {

    protected transactionId : number = 0;

    public override ngOnInit() {
        this.transactionId = Number(this.ActivatedRoute.snapshot.paramMap.get('transactionId'));

        this.Subscription.add(this.TransactionService.view(this.transactionId).subscribe({
            next: (result: ApiViewResponse<Transaction>) => {
                this.post = result.item;

                this.post.created = this.toLocalDatetimeInputFormat(result.item.created);

                this.accountId = result.item.account_id;
                // super.ngOnInit() (TransactionMobileAddComponent) already loads Categories,
                // the Account view, Subscriptions and Accounts - no need to load Categories again here.
                super.ngOnInit();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
    }

    private toLocalDatetimeInputFormat(dateString: string): string {
        const date = new Date(dateString);
        const pad = (n: number) => String(n).padStart(2, '0');

        return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
            + `T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
    }

    public edit(): void {
        this.lockButtons();

        this.Subscription.add(
            this.TransactionService.put(this.post).subscribe({
                next: (response: ApiEditResponse<Transaction>) => {
                    const title = this.TranslocoService.translate('Transaction');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['mobile', 'transaction', 'edit', response.item.id];

                    this.errors = undefined;
                    this.post = response.item;

                    this.NotyService.scrollContentDivToTop();
                    this.NotyService.genericSuccess(msg, title, url);

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

    public delete(transaction: Transaction): void {
        if (!this.confirmDelete()) {
            return;
        }

        this.lockButtons();
        this.Subscription.add(this.TransactionService.delete(transaction)
            .subscribe({
                next: () => {
                    const title = this.TranslocoService.translate('Transaction');
                    const msg = this.TranslocoService.translate('Deleted successfully');
                    const url = ['mobile', 'transaction', 'stream', this.post.account_id];

                    this.NotyService.scrollContentDivToTop();
                    this.NotyService.genericSuccess(msg, title, url);

                    this.errors = undefined;

                    this.unlockButtons();
                    this.ChangeDetectorRef.markForCheck();
                    this.Router.navigate(url);
                },
                error: (error) => {
                    this.handleError(error?.error?.error);
                    this.unlockButtons();
                    this.ChangeDetectorRef.markForCheck();
                }
            })
        );
    }
}
