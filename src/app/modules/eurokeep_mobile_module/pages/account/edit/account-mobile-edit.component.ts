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
import {InputComponent} from "../../../../../components/form/input-component/input-component";
import {SpamsaveDirective} from "../../../../../directives/spamsave.directive";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {SelectComponent} from "../../../../../components/form/select-component/select-component.component";
import {Account, Currencies} from "../../../../../services/account/account.interface";
import {ApiEditResponse, ApiViewResponse} from "../../../../../services/abstract/abstract.interface";
import {AccountMobileAddComponent} from "../add/account-mobile-add.component";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'account-mobile-edit',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FormsModule,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        CardTitleDirective,
        ButtonDirective,
        CardFooterComponent,
        FormDirective,
        InputComponent,
        SpamsaveDirective,
        FaIconComponent,
        SelectComponent,
        ColComponent,
        RowComponent,
        RouterLink,
        ButtonGroupComponent,
    ],
    templateUrl: './account-mobile-edit.component.html',
    styleUrl: './account-mobile-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountMobileEditComponent extends AccountMobileAddComponent {
    protected accountId: number = 0;

    override ngOnInit() {

        this.accountId = Number(this.ActivatedRoute.snapshot.paramMap.get('accountId'));

        // Fetch Accounts
        this.Subscription.add(
            this.AccountService.view(this.accountId).subscribe({
                next: (result: ApiViewResponse<Account>) => {
                    this.post = result.item;
                    this.ChangeDetectorRef.markForCheck();
                },
                error: (error) => this.handleError(error?.error?.error)
            }));

        super.ngOnInit();
    }

    public delete(): void {
        if (!this.confirmDelete()) {
            return;
        }

        this.lockButtons();
        this.Subscription.add(this.AccountService.delete(this.post)
            .subscribe({
                next: () => {
                    const title = this.TranslocoService.translate('Account');
                    const msg = this.TranslocoService.translate('Deleted successfully');
                    const url = ['mobile', 'account', 'list'];

                    this.NotyService.scrollContentDivToTop();
                    this.NotyService.genericSuccess(msg, title, url);

                    this.errors = undefined;

                    this.unlockButtons();
                    this.ChangeDetectorRef.markForCheck();
                    this.Router.navigate(url);
                },
                error: (error) => {
                    this.handleError(error.error.error);
                    this.unlockButtons();
                    this.ChangeDetectorRef.markForCheck();
                }
            })
        );
    }

    public edit(): void {
        this.lockButtons();

        this.Subscription.add(
            this.AccountService.put(this.post).subscribe({
                next: (response: ApiEditResponse<Account>) => {
                    const title = this.TranslocoService.translate('Account');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['mobile', 'transaction', 'stream', response.item.id];

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
