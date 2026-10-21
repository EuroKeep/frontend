import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableDirective} from '@coreui/angular';
import {BalanceComponent} from "../../../../../components/balance/balance.component";
import {AbstractIndexComponent} from "../../../../account_module/pages/abstract-index/abstract-index.component";
import {SummaryService} from "../../../services/summary/summary.service";
import {
    ClosingBalanceSummary,
    ClosingBalanceSummaryResponse
} from "../../../services/summary/summary.interface";
import {DateBrowserComponent} from "../../../../../components/date-browser/date-browser.component";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'closing-balance-summary',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FormsModule,
        BalanceComponent,
        TableDirective,
        DateBrowserComponent,
        RouterLink
    ],
    templateUrl: './closing-balance-summary.component.html',
    styleUrl: './closing-balance-summary.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClosingBalanceSummaryComponent extends AbstractIndexComponent {
    // THE Service
    private readonly SummaryService: SummaryService = inject(SummaryService);

    // THE Item
    protected ClosingBalanceSummary?: ClosingBalanceSummary;
    protected post: any = {}

    override ngOnInit() {

        this.params.start = new Date('2025-01-01');
        this.params.start.setUTCDate(1);
        this.params.start.setUTCHours(0);
        this.params.start.setUTCMinutes(0);
        this.params.start.setUTCSeconds(0);

        this.params.end = new Date('2026-09-01');

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
        this.Subscription.add(this.SummaryService.closing(params).subscribe({
            next: (result: ClosingBalanceSummaryResponse) => {
                this.ClosingBalanceSummary = result.summary;
                this.unlockButtons();
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
    }

}
