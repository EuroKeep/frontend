import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ButtonDirective, ButtonGroupComponent, ColComponent, FormControlDirective, RowComponent} from '@coreui/angular';
import {AccountService} from "../../../../../services/account/account.service";
import {Account, TotalBalance} from "../../../../../services/account/account.interface";
import {RouterLink} from "@angular/router";
import {AbstractIndexComponent} from "../../../../account_module/pages/abstract-index/abstract-index.component";
import {AccountEntryComponent} from "../../../components/account-entry/account-entry.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Currency} from "../../../../../services/currency/currency.interface";
import {ApiEditResponse} from "../../../../../services/abstract/abstract.interface";

@Component({
    selector: 'account-list',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FormsModule,
        RouterLink,
        RowComponent,
        ColComponent,
        AccountEntryComponent,
        ButtonDirective,
        FaIconComponent,
        ButtonGroupComponent
    ],
    templateUrl: './account-list.component.html',
    styleUrl: './account-list.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountListComponent extends AbstractIndexComponent {
    override helpUrl ='https://docs.eurokeep.io/manual/Account%20Management/';
    // Inject Service
    protected override CrudService: AccountService = inject(AccountService);

    // Define Item Type
    protected override Items: Account[] = [];

    protected TotalBalances: TotalBalance[] = [];
    protected searchString: string = '';

    protected isFound(Account: Account): boolean {
        return Account.name.indexOf(this.searchString) > -1;
    }

    protected toggleFavourite(Account: Account): void {
        this.lockButtons();
        this.Subscription.add(this.CrudService.toggleFavourite(Account).subscribe({
            next: (response: ApiEditResponse<Account>) => {
                if (response.item.flags === 3) {
                    this.NotyService.genericInfo(response.item.name, "Favourite Added");
                } else {
                    this.NotyService.genericInfo(response.item.name, "Favourite Removed");
                }
                this.index();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
    }

    protected override processResponse(CrudResponse: any) {
        super.processResponse(CrudResponse);

        this.TotalBalances = CrudResponse.totalBalances;
    }

    protected readonly Currency = Currency;
}
