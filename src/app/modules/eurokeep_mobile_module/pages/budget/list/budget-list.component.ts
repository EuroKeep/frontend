import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    BadgeComponent,
    ButtonDirective, ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    ProgressComponent,
    RowComponent, TooltipDirective
} from '@coreui/angular';
import {BudgetService} from "../../../../../services/budget/budget.service";
import {Budget, BudgetTotal} from "../../../../../services/budget/budget.interface";
import {AbstractIndexComponent} from "../../../../account_module/pages/abstract-index/abstract-index.component";
import {Transaction} from "../../../../../services/transaction/transaction.interface";
import {DateBrowserComponent} from "../../../../../components/date-browser/date-browser.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";
import {Currency, formatCurrency} from "../../../../../services/currency/currency.interface";
import {BalanceComponent} from "../../../../../components/balance/balance.component";
import {ApiIndexResponse, ApiViewResponse} from "../../../../../services/abstract/abstract.interface";
import {
    TransactionListComponent
} from "../../../../../components/transaction/transaction-stream/transaction-list.component";

@Component({
    selector: 'budget-list',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FormsModule,
        CardComponent,
        CardBodyComponent,
        RowComponent,
        ColComponent,
        CardHeaderComponent,
        DateBrowserComponent,
        ContainerComponent,
        ButtonDirective,
        FaIconComponent,
        FaIconComponent,
        RouterLink,
        BadgeComponent,
        ProgressComponent,
        BalanceComponent,
        CardTitleDirective,
        TransactionListComponent,
        ButtonGroupComponent,
        TooltipDirective
    ],
    templateUrl: './budget-list.component.html',
    styleUrl: './budget-list.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetListComponent extends AbstractIndexComponent {

    // THE Service
    private readonly BudgetService: BudgetService = inject(BudgetService);

    // THE Items
    protected Budgets: Budget[] = [];
    protected Total?: BudgetTotal;

    protected showBudgetTransactions: { [key: number]: boolean } = {};

    override ngOnInit() {
        this.params.start = new Date();
        this.params.start.setUTCDate(1);
        this.params.start.setUTCHours(0);
        this.params.start.setUTCMinutes(0);
        this.params.start.setUTCSeconds(0);
        this.params.start.setUTCMilliseconds(0);

        this.params.end = new Date();
        this.params.end.setUTCDate(1);
        this.params.end.setUTCHours(0);
        this.params.end.setUTCMinutes(0);
        this.params.end.setUTCSeconds(0);
        this.params.end.setUTCMilliseconds(0);
        this.params.end.setUTCMonth(this.params.start.getUTCMonth() + 1);

        super.ngOnInit();
    }

    protected override index(): void {
        let params = structuredClone(this.params);
        if (params.start instanceof Date) {
            params.start = params.start.toISOString();
        }
        if (params.end instanceof Date) {
            params.end = params.end.toISOString();
        }

        this.lockButtons();
        this.Subscription.add(this.BudgetService.total(params).subscribe({
            next: (result: ApiViewResponse<BudgetTotal>) => {
                this.Total = result.item;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
        this.Subscription.add(this.BudgetService.list(params).subscribe({
            next: (result: ApiIndexResponse<Budget>) => {
                result.items.forEach((newBudget: Budget) => {
                    const oldBudget = this.Budgets.find(b => b.id === newBudget.id);
                    if (oldBudget) {
                        Object.assign(oldBudget, newBudget);
                    } else {
                        this.Budgets.push(newBudget);
                    }
                });
                this.Budgets = this.Budgets.filter(b =>
                    result.items.some(r => r.id === b.id)
                );
                this.showBudgetTransactions = {};
                this.unlockButtons();


                const id = Number(this.ActivatedRoute.snapshot.paramMap.get('budgetId') || 0);

                if (id) {
                    this.toggleBudgetTransactionsDisplay(id);
                }

                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
    }

    protected toggleBudgetTransactionsDisplay(budgetId: number): void {
        if (this.showBudgetTransactions[budgetId]) {
            this.showBudgetTransactions[budgetId] = false;
            return;
        }
        this.showBudgetTransactions[budgetId] = true;
    }

    private previous: string = '';

    showDate(transaction: Transaction, index: number): boolean {
        let current: string = this.formatDate(transaction.created);
        if (index === 0) {
            this.previous = current;
            return true;
        }

        if (this.previous === '' || this.previous !== current) {
            this.previous = current;
            return true;
        }

        return false;

    }

    protected getBudgetProgress(spent: number, limit: number): number {
        let spentPercent: number = (limit + spent) / limit * 100;

        if (spentPercent < 0) {
            return 100;
        }
        return spentPercent;
    }

    protected getBudgetColor(spent: number, limit: number): string {
        let usedPercentage = Math.abs(spent / limit * 100);
        let colour: string = 'success';
        if (usedPercentage > 90) {
            colour = 'warning';
        }
        if (usedPercentage >= 100) {
            colour = 'danger';
        }

        return colour;
    }

    protected readonly Currency = Currency;
    protected readonly Math = Math;
    protected readonly formatCurrency = formatCurrency;
}
