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
import {RouterLink} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {InputComponent} from "../../../../../components/form/input-component/input-component";
import {SpamsaveDirective} from "../../../../../directives/spamsave.directive";
import {SelectComponent} from "../../../../../components/form/select-component/select-component.component";
import {Category} from "../../../../../services/category/category.interface";
import {Account, Currencies} from "../../../../../services/account/account.interface";
import {Budget} from "../../../../../services/budget/budget.interface";
import {
    ApiAddResponse,
    ApiIndexResponse
} from "../../../../../services/abstract/abstract.interface";
import {AbstractPageComponent} from "../../abstract/abstract-page.component";
import {AccountService} from "../../../../../services/account/account.service";
import {BudgetService} from "../../../../../services/budget/budget.service";
import {CategoryService} from "../../../../../services/category/category.service";

@Component({
    selector: 'budget-add',
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
    templateUrl: './budget-mobile-add.component.html',
    styleUrl: './budget-mobile-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetMobileAddComponent extends AbstractPageComponent {
    protected readonly AccountService: AccountService = inject(AccountService);
    protected readonly BudgetService: BudgetService = inject(BudgetService);
    protected readonly CategoryService: CategoryService = inject(CategoryService);

    protected Categories: Category[] = [];
    protected Accounts: Account[] = [];

    public override ngOnInit() {
        super.ngOnInit();

        this.Subscription.add(this.CategoryService.index().subscribe({
            next: (result: ApiIndexResponse<Category>) => {
                this.Categories = result.items;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
        this.Subscription.add(this.AccountService.index().subscribe({
            next: (result: ApiIndexResponse<Account>) => {
                this.Accounts = result.items;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
    }

    protected post: Budget = {} as Budget;

    public add(): void {
        this.lockButtons();

        this.Subscription.add(
            this.BudgetService.add(this.post).subscribe({
                next: (response: ApiAddResponse<Budget>) => {
                    const title = this.TranslocoService.translate('Budget');
                    const msg = this.TranslocoService.translate('added successfully');
                    const url = ['mobile', 'budget', 'edit', response.item.id];

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
