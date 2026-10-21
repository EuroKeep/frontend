import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    ButtonDirective,
    ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormDirective,
    RowComponent
} from '@coreui/angular';
import {InputComponent} from "../../../../../components/form/input-component/input-component";
import {SpamsaveDirective} from "../../../../../directives/spamsave.directive";
import {SelectComponent} from "../../../../../components/form/select-component/select-component.component";
import {BalanceInputComponent} from "../../../../../components/form/balance-input-component/balance-input-component";
import {SavingMobileAddComponent} from "../add/saving-mobile-add.component";
import {Piggybank} from "../../../../../services/piggybank/piggybank.interface";
import {ApiEditResponse, ApiViewResponse} from "../../../../../services/abstract/abstract.interface";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";
import {Currencies} from "../../../../../services/account/account.interface";

@Component({
    selector: 'saving-mobile-edit',
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
        SelectComponent,
        BalanceInputComponent,
        FaIconComponent,
        RouterLink,
        RowComponent,
        ColComponent,
        ButtonGroupComponent,
    ],
    templateUrl: './saving-mobile-edit.component.html',
    styleUrl: './saving-mobile-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SavingMobileEditComponent extends SavingMobileAddComponent {
    protected savingId: number = 0;

    override ngOnInit() {
        this.savingId = Number(this.ActivatedRoute.snapshot.paramMap.get('savingId'));

        this.Subscription.add(this.PiggybankService.view(this.savingId).subscribe({
            next: (result: ApiViewResponse<Piggybank>) => {
                this.post = result.item;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error: any) => this.handleError(error?.error?.error)
        }));

        super.ngOnInit();
    }

    public delete(): void {
        if (!this.confirmDelete()) {
            return;
        }

        this.lockButtons();
        this.Subscription.add(this.PiggybankService.delete(this.post)
            .subscribe({
                next: () => {
                    const title = this.TranslocoService.translate('Piggybank');
                    const msg = this.TranslocoService.translate('Deleted successfully');
                    const url = ['mobile', 'saving', 'list'];

                    this.NotyService.scrollContentDivToTop();
                    this.NotyService.genericSuccess(msg, title, url);

                    this.errors = undefined;

                    this.unlockButtons();
                    this.ChangeDetectorRef.markForCheck();
                    this.Router.navigate(url);
                },
                error: (error: any) => {
                    this.handleError(error?.error?.error);
                    this.unlockButtons();
                    this.ChangeDetectorRef.markForCheck();
                }
            })
        );
    }

    public edit(): void {
        this.lockButtons();

        this.Subscription.add(
            this.PiggybankService.put(this.post).subscribe({
                next: (response: ApiEditResponse<Piggybank>) => {
                    const title = this.TranslocoService.translate('Piggybank');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['mobile', 'saving', 'edit', response.item.id];

                    this.errors = undefined;
                    this.post = response.item;

                    this.NotyService.scrollContentDivToTop();
                    this.NotyService.genericSuccess(msg, title, url);

                    this.unlockButtons();
                    this.ChangeDetectorRef.markForCheck();
                },
                error: (error: any) => {
                    this.handleError(error?.error?.error);
                    this.unlockButtons();
                    this.ChangeDetectorRef.markForCheck();
                }
            })
        );
    }
}
