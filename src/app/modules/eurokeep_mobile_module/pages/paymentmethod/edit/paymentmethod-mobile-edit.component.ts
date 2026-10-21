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
import {Paymentmethod} from "../../../../../services/paymentmethod/paymentmethod.interface";
import {ApiEditResponse, ApiViewResponse} from "../../../../../services/abstract/abstract.interface";
import {PaymentmethodMobileAddComponent} from "../add/paymentmethod-mobile-add.component";
import {RouterLink} from "@angular/router";
import {SelectComponent} from "../../../../../components/form/select-component/select-component.component";
import {LogoUploadComponent} from "../../../../../components/logo-upload/logo-upload.component";

@Component({
    selector: 'paymentmethod-mobile-edit',
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
        SelectComponent,
        LogoUploadComponent,
    ],
    templateUrl: './paymentmethod-mobile-edit.component.html',
    styleUrl: './paymentmethod-mobile-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentmethodMobileEditComponent extends PaymentmethodMobileAddComponent {
    protected paymentmethodId: number = 0;

    override ngOnInit() {
        this.paymentmethodId = Number(this.ActivatedRoute.snapshot.paramMap.get('paymentmethodId'));

        this.Subscription.add(
            this.PaymentmethodService.view(this.paymentmethodId).subscribe({
                next: (result: ApiViewResponse<Paymentmethod>) => {
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
        this.Subscription.add(this.PaymentmethodService.delete(this.post)
            .subscribe({
                next: () => {
                    const title = this.TranslocoService.translate('Payment method');
                    const msg = this.TranslocoService.translate('Deleted successfully');
                    const url = ['mobile', 'paymentmethod', 'list'];

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

    /**
     * I take over the new image only, so unsaved changes in the form are kept.
     */
    protected onLogoUploaded(paymentmethod: Paymentmethod): void {
        this.post = {...this.post, image: paymentmethod.image};

        const title = this.TranslocoService.translate('Image');
        const msg = this.TranslocoService.translate('updated successfully');
        this.NotyService.genericSuccess(msg, title);
        this.ChangeDetectorRef.markForCheck();
    }

    protected onLogoDeleted(): void {
        this.post = {...this.post, image: null};

        const title = this.TranslocoService.translate('Image');
        const msg = this.TranslocoService.translate('Deleted successfully');
        this.NotyService.genericSuccess(msg, title);
        this.ChangeDetectorRef.markForCheck();
    }

    public edit(): void {
        this.lockButtons();

        this.Subscription.add(
            this.PaymentmethodService.put(this.post).subscribe({
                next: (response: ApiEditResponse<Paymentmethod>) => {
                    const title = this.TranslocoService.translate('Payment method');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['mobile', 'paymentmethod', 'list'];

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
