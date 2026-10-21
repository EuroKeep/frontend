import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {AbstractComponent} from "../abstract/abstract.component";
import {ProgressComponent} from "@coreui/angular";
import {Budget} from "../../services/budget/budget.interface";

@Component({
    selector: 'budget-progressbar',
    imports: [
        TranslocoDirective,
        ProgressComponent,
    ],
    templateUrl: './budget-progressbar.component.html',
    styleUrl: './budget-progressbar.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetProgressbarComponent extends AbstractComponent {
    readonly Budget = input.required<Budget>();

    protected readonly color = computed((): string => {
        const usedPercentage: number = Math.abs(this.Budget().spent / this.Budget().limit * 100);
        if (usedPercentage > 80) {
            return 'danger';
        }
        if (usedPercentage > 60) {
            return 'warning';
        }
        return 'success';
    });

    protected readonly Math = Math;
}
