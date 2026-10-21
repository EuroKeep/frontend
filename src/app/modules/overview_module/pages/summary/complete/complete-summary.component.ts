import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableDirective} from '@coreui/angular';
import {BalanceComponent} from "../../../../../components/balance/balance.component";
import {AbstractIndexComponent} from "../../../../account_module/pages/abstract-index/abstract-index.component";
import {SummaryService} from "../../../services/summary/summary.service";
import {Summary, SummaryResponse} from "../../../services/summary/summary.interface";
import {DateBrowserComponent} from "../../../../../components/date-browser/date-browser.component";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'complete-summary',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FormsModule,
        BalanceComponent,
        TableDirective,
        DateBrowserComponent,
        RouterLink
    ],
    templateUrl: './complete-summary.component.html',
    styleUrl: './complete-summary.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompleteSummaryComponent extends AbstractIndexComponent {
    // THE Service
    private readonly SummaryService: SummaryService = inject(SummaryService);

    // THE Item
    protected Summary?: Summary;
    protected post: any = {}
    protected year: number = 0;
    protected month: number = 0;

    override ngOnInit() {
        this.ActivatedRoute.paramMap.subscribe(params => {
            this.year = Number(params.get('year'));
            this.month = Number(params.get('month'));

            this.params.start = new Date();

            if (this.year === 0 && this.month === 0) {
                this.onChange(new Date());
                return;
            }

            this.params.start.setUTCFullYear(this.year);
            this.params.start.setUTCMonth(this.month - 1);
            this.params.start.setUTCDate(1);
            this.params.start.setUTCHours(0);
            this.params.start.setUTCMinutes(0);
            this.params.start.setUTCSeconds(0);

            this.params.end = new Date();
            this.params.end.setUTCFullYear(this.year);
            this.params.end.setUTCMonth(this.params.start.getUTCMonth() + 1);
            this.params.end.setUTCDate(1);
            this.params.end.setUTCHours(0);
            this.params.end.setUTCMinutes(0);
            this.params.end.setUTCSeconds(0);

            this.index();
        });

        super.ngOnInit();
    }

    protected onChange(date: Date): void {
        this.Router.navigate(['/', 'overview', date.getUTCFullYear(), date.getUTCMonth() + 1]);
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
        this.Subscription.add(this.SummaryService.complete(params).subscribe({
            next: (result: SummaryResponse) => {
                this.Summary = result.summary;
                this.unlockButtons();
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
    }

}
