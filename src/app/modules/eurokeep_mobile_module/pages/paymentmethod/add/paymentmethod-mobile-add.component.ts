import {ChangeDetectionStrategy, Component, inject, ViewChild} from '@angular/core';
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
import {PaymentmethodService} from "../../../../../services/paymentmethod/paymentmethod.service";
import {
    Paymentmethod,
    PaymentmethodFlagActive,
    PaymentmethodStates
} from "../../../../../services/paymentmethod/paymentmethod.interface";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";
import {SelectComponent} from "../../../../../components/form/select-component/select-component.component";
import {LogoUploadComponent} from "../../../../../components/logo-upload/logo-upload.component";
import {ApiAddResponse} from "../../../../../services/abstract/abstract.interface";

@Component({
    selector: 'paymentmethod-add',
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
        SelectComponent,
        LogoUploadComponent,
    ],
    templateUrl: './paymentmethod-mobile-add.component.html',
    styleUrl: './paymentmethod-mobile-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentmethodMobileAddComponent extends AbstractPageComponent {
    protected readonly PaymentmethodService: PaymentmethodService = inject(PaymentmethodService);

    @ViewChild('LogoUpload')
    protected LogoUpload?: LogoUploadComponent;
    protected readonly States: any[] = PaymentmethodStates.map((state: any) => ({
        ...state,
        name: this.TranslocoService.translate(state.name)
    }));

    protected post: Paymentmethod = {flags: PaymentmethodFlagActive} as Paymentmethod;

    public add(): void {
        this.lockButtons();

        this.Subscription.add(
            this.PaymentmethodService.add(this.post).subscribe({
                next: (response: ApiAddResponse<Paymentmethod>) => {
                    const title = this.TranslocoService.translate('Payment method');
                    const msg = this.TranslocoService.translate('added successfully');
                    const url = ['mobile', 'paymentmethod', 'edit', response.item.id];

                    this.NotyService.scrollContentDivToTop();
                    this.NotyService.genericSuccess(msg, title, url);

                    this.errors = undefined;

                    this.unlockButtons();
                    this.ChangeDetectorRef.markForCheck();

                    // The image can only be uploaded once the payment method has an id, leave the page
                    // only after the upload (leaving it would abort the upload).
                    if (this.LogoUpload?.hasPendingFile()) {
                        this.lockButtons();
                        this.Subscription.add(this.LogoUpload.LogoUploadFinished.subscribe(() => this.backToList()));
                        this.LogoUpload.uploadTo(response.item.id);
                    } else {
                        this.backToList();
                    }
                },
                error: (error) => {
                    this.handleError(error.error.error);
                    this.unlockButtons();
                    this.ChangeDetectorRef.markForCheck();
                }
            })
        );
    }

    protected backToList(): void {
        this.Router.navigate(['mobile', 'paymentmethod', 'list']);
    }
}
