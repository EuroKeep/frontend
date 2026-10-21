import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    ButtonDirective,
    ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    ColComponent,
    FormDirective,
    RowComponent
} from '@coreui/angular';
import {InputComponent} from "../../../../../components/form/input-component/input-component";
import {SpamsaveDirective} from "../../../../../directives/spamsave.directive";
import {AbstractPageComponent} from "../../abstract/abstract-page.component";
import {AccounttypeService} from "../../../../../services/accounttype/accounttype.service";
import {Accounttype} from "../../../../../services/accounttype/accounttype.interface";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";
import {ApiAddResponse} from "../../../../../services/abstract/abstract.interface";

@Component({
    selector: 'accounttype-add',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FormsModule,
        CardComponent,
        CardBodyComponent,
        ButtonDirective,
        FormDirective,
        InputComponent,
        SpamsaveDirective,
        ColComponent,
        FaIconComponent,
        RowComponent,
        RouterLink,
        ButtonGroupComponent,
    ],
    templateUrl: './accounttype-mobile-add.component.html',
    styleUrl: './accounttype-mobile-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccounttypeMobileAddComponent extends AbstractPageComponent {
    protected readonly AccounttypeService: AccounttypeService = inject(AccounttypeService);

    protected post: Accounttype = {} as Accounttype;

    public add(): void {
        this.lockButtons();

        this.Subscription.add(
            this.AccounttypeService.add(this.post).subscribe({
                next: (response: ApiAddResponse<Accounttype>) => {
                    const title = this.TranslocoService.translate('Account type');
                    const msg = this.TranslocoService.translate('added successfully');
                    const url = ['mobile', 'accounttype', 'edit', response.item.id];

                    this.NotyService.scrollContentDivToTop();
                    this.NotyService.genericSuccess(msg, title, url);

                    this.errors = undefined;

                    this.unlockButtons();
                    this.ChangeDetectorRef.markForCheck();
                    this.Router.navigate(['mobile', 'accounttype', 'list']);
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
