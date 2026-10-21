import {ChangeDetectionStrategy, Component, computed, effect, input, signal, untracked} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {AbstractComponent} from "../abstract/abstract.component";
import {Currency, formatBalance} from "../../services/currency/currency.interface";

@Component({
    selector: 'balance',
    imports: [
        TranslocoDirective,
    ],
    templateUrl: './balance.component.html',
    styleUrl: './balance.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BalanceComponent extends AbstractComponent {
    readonly Value = input.required<number>();
    readonly Currency = input.required<Currency>();
    readonly AnimateFirstValue = input<boolean>(true);
    readonly Animate = input<boolean>(true);
    readonly Color = input<string>('');

    private lastNumericValue: number = NaN;
    private readonly formatBalance = formatBalance;
    private animationFrame?: number;
    protected readonly display = signal<string>('');

    /**
     * I will compute the class / colour of the balance Component based on the value.
     */
    protected readonly class = computed((): string => {
        let classString: string = `currency ${this.Currency().toLowerCase()}`;
        if (this.Color().length > 0) {
            return classString + " " + this.Color();
        }
        const value: number = Number(this.Value());
        if (value < 0) {
            classString += ' text-danger';
        } else if (value > 0) {
            classString += ' text-success';
        }

        return classString;
    });

    constructor() {
        super();
        effect(() => {
            const target = Number(this.Value());
            this.Currency();
            if (isNaN(target)) return;

            untracked(() => {
                this.animateValue(this.lastNumericValue, target);
                this.lastNumericValue = target;
            });
        });
    }

    private easeOutCubic(t: number): number {
        return 1 - Math.pow(1 - t, 3);
    }

    private updateDisplay(value: number): void {
        this.display.set(this.formatBalance(value, this.Currency()));
    }

    /**
     * I will animate the Balance on Changes. Initially, the balance will show up immediately.
     * On Changes, the balance number will be animated.
     * @param from
     * @param to
     * @private
     */
    private animateValue(from: number, to: number) {
        if (!this.Animate()) {
            this.updateDisplay(to);
            this.lastNumericValue = to;
            return;
        }
        // Do not animate on first sight.
        if (!this.AnimateFirstValue() && Number.isNaN(this.lastNumericValue)) {
            this.updateDisplay(to);
            this.lastNumericValue = to;
            return;
        }
        if (Number.isNaN(this.lastNumericValue)) {
            from = 0;
        }
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        const duration = 500; // ms
        const start = performance.now();

        const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const current = from + (to - from) * this.easeOutCubic(progress);

            this.updateDisplay(current);

            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(animate);
            } else {
                this.updateDisplay(to); // exakter Endwert
            }
        };

        this.animationFrame = requestAnimationFrame(animate);
    }
}
