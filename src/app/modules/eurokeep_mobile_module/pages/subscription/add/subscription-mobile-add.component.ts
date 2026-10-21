import {ChangeDetectionStrategy, Component, inject, ViewChild} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    ButtonDirective, ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormDirective,
    RowComponent
} from '@coreui/angular';
import {InputComponent} from "../../../../../components/form/input-component/input-component";
import {SelectComponent} from "../../../../../components/form/select-component/select-component.component";
import {SpamsaveDirective} from "../../../../../directives/spamsave.directive";
import {AbstractPageComponent} from "../../abstract/abstract-page.component";
import {SubscriptionService} from "../../../../../services/subscription/subscription.service";
import {AccountService} from "../../../../../services/account/account.service";
import {Subscription,} from "../../../../../services/subscription/subscription.interface";
import {Account} from "../../../../../services/account/account.interface";
import {ApiAddResponse, ApiIndexResponse} from "../../../../../services/abstract/abstract.interface";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";
import {Category} from "../../../../../services/category/category.interface";
import {CategoryService} from "../../../../../services/category/category.service";
import {PaymentmethodService} from "../../../../../services/paymentmethod/paymentmethod.service";
import {Paymentmethod} from "../../../../../services/paymentmethod/paymentmethod.interface";
import {IntervalInputComponent} from "../../../../../components/form/interval-input/interval-input.component";
import {LogoUploadComponent} from "../../../../../components/logo-upload/logo-upload.component";

@Component({
    selector: 'subscription-add',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FormsModule,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        CardTitleDirective,
        ButtonDirective,
        FormDirective,
        InputComponent,
        SelectComponent,
        SpamsaveDirective,
        ColComponent,
        FaIconComponent,
        RowComponent,
        RouterLink,
        IntervalInputComponent,
        ButtonGroupComponent,
        LogoUploadComponent,
    ],
    templateUrl: './subscription-mobile-add.component.html',
    styleUrl: './subscription-mobile-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionMobileAddComponent extends AbstractPageComponent {
    protected readonly SubscriptionService: SubscriptionService = inject(SubscriptionService);
    protected readonly AccountService: AccountService = inject(AccountService);
    protected readonly CategoryService: CategoryService = inject(CategoryService);
    protected readonly PaymentmethodService: PaymentmethodService = inject(PaymentmethodService);

    protected post: Subscription = {
        name: '',
        balance_value: 0,
        interval: '',
        start: '',
        end: '',
        term: '',
        noticeperiod: '',
        comments: '',
        account_id: '',
        category_id: 0
    } as Subscription;

    @ViewChild('LogoUpload')
    protected LogoUpload?: LogoUploadComponent;

    protected Account: Account = {} as Account;
    protected Accounts: Account[] = [];
    protected Paymentmethods: Paymentmethod[] = [];
    protected Categories: Category[] = [];

    override ngOnInit() {
        super.ngOnInit();


        this.Subscription.add(this.AccountService.index().subscribe({
            next: (result: ApiIndexResponse<Account>) => {
                this.Accounts = result.items;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));

        this.Subscription.add(this.CategoryService.index().subscribe({
            next: (result: ApiIndexResponse<Category>) => {
                this.Categories = result.items;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));

        this.Subscription.add(this.PaymentmethodService.index().subscribe({
            next: (result: ApiIndexResponse<Paymentmethod>) => {
                this.Paymentmethods = result.items;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));

    }

    public add(): void {
        this.lockButtons();

        this.Subscription.add(
            this.SubscriptionService.add(this.post).subscribe({
                next: (response: ApiAddResponse<Subscription>) => {
                    const title = this.TranslocoService.translate('Subscription');
                    const msg = this.TranslocoService.translate('added successfully');
                    const url = ['mobile', 'subscription', 'edit', response.item.id];

                    // The logo can only be uploaded once the subscription has an id.
                    this.LogoUpload?.uploadTo(response.item.id);

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

    public delete(subscription: Subscription): void {
        if (!this.confirmDelete()) {
            return;
        }

        this.lockButtons();
        this.Subscription.add(this.SubscriptionService.delete(subscription)
            .subscribe({
                next: () => {
                    const title = this.TranslocoService.translate('Subscription');
                    const msg = this.TranslocoService.translate('Deleted successfully');
                    const url = ['mobile', 'subscription', 'list'];

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
