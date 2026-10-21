import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    ButtonDirective,
    ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    ColComponent,
    FormDirective,
    RowComponent
} from '@coreui/angular';
import {InputComponent} from "../../../../../components/form/input-component/input-component";
import {SpamsaveDirective} from "../../../../../directives/spamsave.directive";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Accounttype} from "../../../../../services/accounttype/accounttype.interface";
import {ApiEditResponse, ApiViewResponse} from "../../../../../services/abstract/abstract.interface";
import {AccounttypeMobileAddComponent} from "../add/accounttype-mobile-add.component";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'accounttype-mobile-edit',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FormsModule,
        CardComponent,
        CardBodyComponent,
        CardFooterComponent,
        ButtonDirective,
        FormDirective,
        InputComponent,
        SpamsaveDirective,
        FaIconComponent,
        ColComponent,
        RowComponent,
        RouterLink,
        ButtonGroupComponent,
    ],
    templateUrl: './accounttype-mobile-edit.component.html',
    styleUrl: './accounttype-mobile-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccounttypeMobileEditComponent extends AccounttypeMobileAddComponent {
    protected accounttypeId: number = 0;

    override ngOnInit() {
        this.accounttypeId = Number(this.ActivatedRoute.snapshot.paramMap.get('accounttypeId'));

        this.Subscription.add(
            this.AccounttypeService.view(this.accounttypeId).subscribe({
                next: (result: ApiViewResponse<Accounttype>) => {
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
        this.Subscription.add(this.AccounttypeService.delete(this.post)
            .subscribe({
                next: () => {
                    const title = this.TranslocoService.translate('Account type');
                    const msg = this.TranslocoService.translate('Deleted successfully');
                    const url = ['mobile', 'accounttype', 'list'];

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
            this.AccounttypeService.put(this.post).subscribe({
                next: (response: ApiEditResponse<Accounttype>) => {
                    const title = this.TranslocoService.translate('Account type');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['mobile', 'accounttype', 'list'];

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
