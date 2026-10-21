import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    ButtonDirective,
    ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective, ColComponent,
    FormDirective, RowComponent
} from '@coreui/angular';
import {PiggybankService} from "../../../../../services/piggybank/piggybank.service";
import {Piggybank} from "../../../../../services/piggybank/piggybank.interface";
import {Account, Currencies} from "../../../../../services/account/account.interface";
import {AccountService} from "../../../../../services/account/account.service";
import {AbstractPageComponent} from "../../abstract/abstract-page.component";
import {InputComponent} from "../../../../../components/form/input-component/input-component";
import {SelectComponent} from "../../../../../components/form/select-component/select-component.component";
import {BalanceInputComponent} from "../../../../../components/form/balance-input-component/balance-input-component";
import {SpamsaveDirective} from "../../../../../directives/spamsave.directive";
import {ApiAddResponse, ApiIndexResponse} from "../../../../../services/abstract/abstract.interface";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Currency} from "../../../../../services/currency/currency.interface";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'piggybank-save',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FormsModule,
        FaIconComponent,
        CardComponent,
        CardBodyComponent,
        ButtonDirective,
        ButtonGroupComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FormDirective,
        InputComponent,
        SelectComponent,
        BalanceInputComponent,
        SpamsaveDirective,
        RowComponent,
        ColComponent,
        RouterLink,
    ],
    templateUrl: './saving-mobile-add.component.html',
    styleUrl: './saving-mobile-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SavingMobileAddComponent extends AbstractPageComponent {

    protected readonly PiggybankService: PiggybankService = inject(PiggybankService);
    protected readonly AccountService: AccountService = inject(AccountService);

    protected Piggybank?: Piggybank;
    protected Accounts: Account[] = [];
    protected post: Piggybank = {
        balance_currency : Currency.eur
    } as Piggybank;

    public override ngOnInit(): void {
        super.ngOnInit();

        // Fetch Accounts
        this.Subscription.add(this.AccountService.index().subscribe({
            next: (result: ApiIndexResponse<Account>) => {
                this.Accounts = result.items;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
    }

    public add(): void {
        this.lockButtons();
        this.Subscription.add(this.PiggybankService.add(this.post)
            .subscribe({
                next: (response: ApiAddResponse<Piggybank>) => {
                    const title = this.TranslocoService.translate('Piggybank');
                    const msg = this.TranslocoService.translate('added successfully');
                    const url = ['mobile', 'saving', 'edit', response.item.id];

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

    protected readonly Currencies = Currencies;
}
