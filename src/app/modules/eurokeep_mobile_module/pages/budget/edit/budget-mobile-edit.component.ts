import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    ButtonDirective, ButtonGroupComponent,
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
import {BudgetMobileAddComponent} from "../add/budget-mobile-add.component";
import {Budget} from "../../../../../services/budget/budget.interface";
import {ApiEditResponse, ApiViewResponse} from "../../../../../services/abstract/abstract.interface";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'budget-edit',
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
        FaIconComponent,
        RouterLink,
        RowComponent,
        ColComponent,
        ButtonGroupComponent,
    ],
    templateUrl: './budget-mobile-edit.component.html',
    styleUrl: './budget-mobile-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetMobileEditComponent extends BudgetMobileAddComponent {
    protected budgetId: number = 0;

    override ngOnInit() {
        this.budgetId = Number(this.ActivatedRoute.snapshot.paramMap.get('budgetId'));

        this.Subscription.add(this.BudgetService.view(this.budgetId).subscribe({
            next: (result: ApiViewResponse<Budget>) => {
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
        this.Subscription.add(this.BudgetService.delete(this.post)
            .subscribe({
                next: () => {
                    const title = this.TranslocoService.translate('Budget');
                    const msg = this.TranslocoService.translate('Deleted successfully');
                    const url = ['mobile', 'budget', 'list'];

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
            this.BudgetService.put(this.post).subscribe({
                next: (response: ApiEditResponse<Budget>) => {
                    const title = this.TranslocoService.translate('Budget');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['mobile', 'budget', 'edit', response.item.id];

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
