import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    ColComponent,
    RowComponent
} from '@coreui/angular';
import {AccountService} from "../../../../../services/account/account.service";
import {Account, Currencies, TotalBalance} from "../../../../../services/account/account.interface";
import {BalanceComponent} from "../../../../../components/balance/balance.component";
import {RouterLink} from "@angular/router";
import {BudgetService} from "../../../../../services/budget/budget.service";
import {AbstractPageComponent} from "../../abstract/abstract-page.component";
import {Budget, BudgetTotal} from "../../../../../services/budget/budget.interface";
import {BudgetProgressbarComponent} from "../../../../../components/budget-progressbar/budget-progressbar.component";
import {Currency} from "../../../../../services/currency/currency.interface";
import {AccountEntryComponent} from "../../../components/account-entry/account-entry.component";
import {ApiIndexResponse, ApiItemResponse, ApiViewResponse} from "../../../../../services/abstract/abstract.interface";
import {SubscriptionService} from "../../../../../services/subscription/subscription.service";
import {
    SubscriptionForecast,
    SubscriptionForecastResponse,
    SubscriptionStats,
    SubscriptionStatsResponse
} from "../../../../../services/subscription/subscription.interface";
import {SearchService} from "../../../../../services/search/search.service";
import {SearchApiResponse} from "../../../../../services/search/search.interface";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {InputComponent} from "../../../../../components/form/input-component/input-component";
import {DashboardService} from "../../../../../services/dashboard/dashboard.service";
import {Networth} from "../../../../../services/dashboard/dashboard.interface";
import {TransactionEntryComponent} from "../../../components/transaction-entry/transaction-entry.component";
import {PiggybankService} from "../../../../../services/piggybank/piggybank.service";
import {Piggybank} from "../../../../../services/piggybank/piggybank.interface";
import {ProgressBar} from "@openng/optimus-ui/progressbar";
import {
    PiggybankProgressbarComponent
} from "../../../../../components/piggybank-progressbar/piggybank-progressbar.component";
import {DiscreteDirective} from "../../../../../directives/discrete.directive";
import {IndiscreteDirective} from "../../../../../directives/indiscrete.directive";
import {SubscriptionImageComponent} from "../../../components/subscription-logo/subscription-image.component";
import {
    TransactionDetailEntryComponent
} from "../../../components/transaction-detail/transaction-detail-entry.component";
import {SubscriptionEntryComponent} from "../../../components/subscription-entry/subscription-entry.component";

@Component({
    selector: 'account-list',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FormsModule,
        CardComponent,
        CardBodyComponent,
        BalanceComponent,
        RouterLink,
        RowComponent,
        ColComponent,
        CardHeaderComponent,
        CardFooterComponent,
        BudgetProgressbarComponent,
        AccountEntryComponent,
        FaIconComponent,
        InputComponent,
        TransactionEntryComponent,
        ProgressBar,
        PiggybankProgressbarComponent,
        DiscreteDirective,
        IndiscreteDirective,
        SubscriptionImageComponent,
        TransactionDetailEntryComponent,
        SubscriptionEntryComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends AbstractPageComponent {
    // Inject Services
    protected readonly AccountService: AccountService = inject(AccountService);
    protected readonly BudgetService: BudgetService = inject(BudgetService);
    protected readonly SubscriptionsService: SubscriptionService = inject(SubscriptionService);
    protected readonly SearchService: SearchService = inject(SearchService);
    protected readonly DashboardService: DashboardService = inject(DashboardService);
    protected readonly PiggybankService: PiggybankService = inject(PiggybankService);

    // Define Item Type
    protected Accounts: Account[] = [];
    protected TotalBalances: TotalBalance[] = [];

    // For Budgets
    protected Budgets: Budget[] = [];
    protected Total?: BudgetTotal;

    // For Subscriptions
    protected SubscriptionForecasts: SubscriptionForecast[] = [];
    protected SubscriptionStats?: SubscriptionStats;

    // For Search
    protected searchString: string = '';

    // For Networth
    protected Networths: Networth[] = [];

    // For Piggybanks
    protected Piggybanks: Piggybank[] = [];

    override ngOnInit() {
        this.Subscription.add(this.BudgetService.list({}).subscribe({
            next: (result: ApiIndexResponse<Budget>) => {
                this.Budgets = result.items;
                //     this.Total = result.total;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
        this.Subscription.add(this.BudgetService.total({}).subscribe({
            next: (result: ApiViewResponse<BudgetTotal>) => {
                this.Total = result.item;
                //     this.Total = result.total;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
        this.Subscription.add(this.AccountService.index().subscribe({
            next: (result: ApiIndexResponse<Account>) => {
                this.Accounts = result.items;
                //   this.TotalBalances = result.totalBalances;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
        this.Subscription.add(this.SubscriptionsService.forecast('').subscribe({
            next: (result: SubscriptionForecastResponse) => {
                this.SubscriptionForecasts = result.forecast;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
        this.Subscription.add(this.SubscriptionsService.stats().subscribe({
            next: (result: SubscriptionStatsResponse) => {
                this.SubscriptionStats = result.statistics;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
        this.Subscription.add(this.DashboardService.getNetWorth().subscribe({
            next: (result: ApiIndexResponse<Networth>) => {
                this.Networths = result.items;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }))
        this.Subscription.add(this.PiggybankService.index({}).subscribe({
            next: (result: ApiIndexResponse<Piggybank>) => {
                this.Piggybanks = result.items;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }))

        super.ngOnInit();
    }

    protected searchResults?: SearchApiResponse;

    protected search(): void {
        if (this.searchString.length < 3) {
            return;
        }
        this.Subscription.add(this.SearchService.search(this.searchString).subscribe({
            next: (searchResults: SearchApiResponse) => {
                this.searchResults = searchResults;
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
    }

    protected readonly Currencies = Currencies;
    protected readonly Currency = Currency;
}
