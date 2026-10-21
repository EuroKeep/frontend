import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
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
import {SpamsaveDirective} from "../../../../../directives/spamsave.directive";
import {SelectComponent} from "../../../../../components/form/select-component/select-component.component";
import {AbstractPageComponent} from "../../abstract/abstract-page.component";
import {AccountService} from "../../../../../services/account/account.service";
import {Account, Currencies} from "../../../../../services/account/account.interface";
import {AccounttypeService} from "../../../../../services/accounttype/accounttype.service";
import {Accounttype} from "../../../../../services/accounttype/accounttype.interface";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";
import {ApiAddResponse, ApiIndexResponse} from "../../../../../services/abstract/abstract.interface";

@Component({
    selector: 'account-add',
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
        SpamsaveDirective,
        SelectComponent,
        ColComponent,
        FaIconComponent,
        RowComponent,
        RouterLink,
        ButtonGroupComponent,
    ],
    templateUrl: './account-mobile-add.component.html',
    styleUrl: './account-mobile-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountMobileAddComponent extends AbstractPageComponent {
    protected readonly AccountService: AccountService = inject(AccountService);
    protected readonly AccounttypeService: AccounttypeService = inject(AccounttypeService);
    protected readonly Currencies: any[] = Currencies;

    protected post: Account = {} as Account;
    protected Accounttypes: Accounttype[] = [];

    override ngOnInit() {
        this.Subscription.add(this.AccounttypeService.index().subscribe({
            next: (result: ApiIndexResponse<Accounttype>) => {
                this.Accounttypes = result.items;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
        super.ngOnInit();
    }

    public add(): void {
        this.lockButtons();

        this.Subscription.add(
            this.AccountService.add(this.post).subscribe({
                next: (response: ApiAddResponse<Account>) => {
                    const title = this.TranslocoService.translate('Account');
                    const msg = this.TranslocoService.translate('added successfully');
                    const url = ['mobile', 'transaction', 'stream', response.item.id];

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
}
