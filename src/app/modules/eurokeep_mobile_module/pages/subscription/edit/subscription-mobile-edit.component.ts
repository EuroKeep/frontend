import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {forkJoin} from 'rxjs';
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
import {InputComponent} from "../../../../../components/form/input-component/input-component";
import {
    Subscription,
    SubscriptionForecast, SubscriptionForecastResponse
} from "../../../../../services/subscription/subscription.interface";
import {SelectComponent} from "../../../../../components/form/select-component/select-component.component";
import {SpamsaveDirective} from "../../../../../directives/spamsave.directive";
import {
    ApiEditResponse,
    ApiIndexResponse,
    ApiViewResponse
} from "../../../../../services/abstract/abstract.interface";
import {RouterLink} from "@angular/router";
import {SubscriptionMobileAddComponent} from "../add/subscription-mobile-add.component";
import {Account} from "../../../../../services/account/account.interface";
import {Category} from "../../../../../services/category/category.interface";
import {Paymentmethod} from "../../../../../services/paymentmethod/paymentmethod.interface";
import {IntervalInputComponent} from "../../../../../components/form/interval-input/interval-input.component";
import {LogoUploadComponent} from "../../../../../components/logo-upload/logo-upload.component";

@Component({
    selector: 'subscription-edit',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FormsModule,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        FaIconComponent,
        CardTitleDirective,
        ButtonDirective,
        CardFooterComponent,
        FormDirective,
        InputComponent,
        SelectComponent,
        SpamsaveDirective,
        SpamsaveDirective,
        ColComponent,
        RowComponent,
        RouterLink,
        IntervalInputComponent,
        LogoUploadComponent,
        ButtonGroupComponent,
    ],
    templateUrl: './subscription-mobile-edit.component.html',
    styleUrl: './subscription-mobile-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionMobileEditComponent extends SubscriptionMobileAddComponent {
    override ngOnInit() {

        const id = Number(this.ActivatedRoute.snapshot.paramMap.get('subscriptionId'));

        // Accounts, Categories, the Subscription itself and its forecast are all
        // independent of each other - load them in parallel instead of a waterfall.
        this.Subscription.add(forkJoin({
            accounts: this.AccountService.index(),
            categories: this.CategoryService.index(),
            paymentmethods: this.PaymentmethodService.index(),
            subscription: this.SubscriptionService.view(id),
        }).subscribe({
            next: ({accounts, categories, paymentmethods, subscription}: {
                accounts: ApiIndexResponse<Account>,
                categories: ApiIndexResponse<Category>,
                paymentmethods: ApiIndexResponse<Paymentmethod>
                subscription: ApiViewResponse<Subscription>,
            }) => {
                this.Accounts = accounts.items;
                this.Categories = categories.items;
                this.Paymentmethods = paymentmethods.items;
                this.post = subscription.item;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
    }

    /**
     * I take over the new logo only, so unsaved changes in the form are kept.
     */
    protected onLogoUploaded(subscription: Subscription): void {
        this.post = {...this.post, logo: subscription.logo};

        const title = this.TranslocoService.translate('Logo');
        const msg = this.TranslocoService.translate('updated successfully');
        this.NotyService.genericSuccess(msg, title);
        this.ChangeDetectorRef.markForCheck();
    }

    protected onLogoDeleted(): void {
        this.post = {...this.post, logo: ''};

        const title = this.TranslocoService.translate('Logo');
        const msg = this.TranslocoService.translate('Deleted successfully');
        this.NotyService.genericSuccess(msg, title);
        this.ChangeDetectorRef.markForCheck();
    }

    public edit(): void {
        this.lockButtons();
        this.Subscription.add(
            this.SubscriptionService.put(this.post).subscribe({
                next: (response: ApiEditResponse<Subscription>) => {
                    const title = this.TranslocoService.translate('Subscription');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['mobile', 'subscription', 'edit', response.item.id];

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
}
