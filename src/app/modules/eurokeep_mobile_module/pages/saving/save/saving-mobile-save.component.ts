import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from "@angular/router";
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    ButtonDirective,
    ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormDirective,
    TableDirective,
    RowComponent,
    ColComponent
} from '@coreui/angular';
import {PiggybankService} from "../../../../../services/piggybank/piggybank.service";
import {Piggybank, PiggybankSavePost} from "../../../../../services/piggybank/piggybank.interface";
import {Account} from "../../../../../services/account/account.interface";
import {AccountService} from "../../../../../services/account/account.service";
import {AbstractPageComponent} from "../../abstract/abstract-page.component";
import {SpamsaveDirective} from "../../../../../directives/spamsave.directive";
import {ApiEditResponse, ApiIndexResponse, ApiViewResponse} from "../../../../../services/abstract/abstract.interface";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {TransactionService} from "../../../../../services/transaction/transaction.service";
import {Transaction} from "../../../../../services/transaction/transaction.interface";
import {BalanceComponent} from "../../../../../components/balance/balance.component";

@Component({
    selector: 'piggybank-save',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FaIconComponent,
        FormsModule,
        CardComponent,
        CardBodyComponent,
        ButtonDirective,
        ButtonGroupComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FormDirective,
        SpamsaveDirective,
        TableDirective,
        BalanceComponent,
        RowComponent,
        ColComponent,
        RouterLink,
    ],
    templateUrl: './saving-mobile-save.component.html',
    styleUrl: './saving-mobile-save.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SavingMobileSaveComponent extends AbstractPageComponent {

    private readonly PiggybankService: PiggybankService = inject(PiggybankService);
    private readonly TransactionService: TransactionService = inject(TransactionService);
    private readonly AccountService: AccountService = inject(AccountService);

    protected post: PiggybankSavePost = {
        parts: {}
    } as PiggybankSavePost;

    protected Transaction?: Transaction;
    protected Account?: Account;
    protected Piggybanks: Piggybank[] = [];

    public override ngOnInit(): void {
        super.ngOnInit();

        const transactionId: number = Number(this.ActivatedRoute.snapshot.paramMap.get('transactionId'));


        this.Subscription.add(this.TransactionService.view(transactionId).subscribe({
            next: (result: ApiViewResponse<Transaction>) => {
                this.Transaction = result.item;
                this.post.transaction_id = this.Transaction.id;

                this.Subscription.add(this.AccountService.view(this.Transaction.account_id).subscribe({
                    next: (result: ApiViewResponse<Account>) => {
                        this.Account = result.item;
                        this.Subscription.add(this.PiggybankService.index({}).subscribe({
                            next: (result: ApiIndexResponse<Piggybank>) => {
                                this.Piggybanks = result.items;
                                if (this.Transaction) {

                                    this.Subscription.add(this.PiggybankService.fetch(this.Transaction.id).subscribe({
                                        next: (result: ApiViewResponse<PiggybankSavePost>) => {
                                            this.post = result.item;

                                            if (Object.keys(this.post.parts).length === 0) {
                                                // Nothing saved against this transaction yet: suggest a split.
                                                this.prefillParts();
                                            } else {
                                                // Resume editing the existing split as-is.
                                                this.previousParts = {...this.post.parts};
                                                this.recomputeSaveSum();
                                            }

                                            this.ChangeDetectorRef.markForCheck();
                                        },
                                        error: (error) => this.handleError(error?.error?.error)
                                    }));
                                }

                                this.ChangeDetectorRef.markForCheck();
                            },
                            error: (error) => this.handleError(error?.error?.error)
                        }));
                        this.ChangeDetectorRef.markForCheck();
                    },
                    error: (error) => this.handleError(error?.error?.error)
                }));
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
    }

    public save(): void {

        this.lockButtons();

        const payload: PiggybankSavePost = {
            ...this.post,
            parts: this.withoutNullParts(this.post.parts)
        };

        this.Subscription.add(this.PiggybankService.save(payload)
            .subscribe({
                next: (result: ApiEditResponse<Piggybank>) => {
                    const title = this.TranslocoService.translate('Piggybank');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['mobile', 'saving', 'list'];

                    this.errors = undefined;

                    this.NotyService.scrollContentDivToTop();
                    this.NotyService.genericSuccess(msg, title, url);

                    this.unlockButtons();
                    this.ChangeDetectorRef.markForCheck();
                },
                error: (error) => {
                    this.handleError(error?.error?.error);
                    this.unlockButtons();
                    this.ChangeDetectorRef.markForCheck();
                }
            })
        );
    }


    /**
     * I will calculate the number of full months remaining until the Piggybank's `end` date,
     * floored at 0 once that date has passed. Returns null when no `end` is set.
     */
    protected getRemainingMonths(piggybank: Piggybank): number | null {
        if (!piggybank.end) {
            return null;
        }

        const end = new Date(piggybank.end);
        const now = new Date();
        let months = (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth());
        if (end.getDate() < now.getDate()) {
            months--;
        }

        return Math.max(months, 0);
    }

    /**
     * I will calculate the monthly rate (target - value) / remainingMonths that would need to
     * be saved to reach the target by the `end` date. Returns null when no `end` is set or the
     * `end` date has already been reached.
     */
    protected getSavingsRate(piggybank: Piggybank): number | null {
        const months = this.getRemainingMonths(piggybank);
        if (!months) {
            return null;
        }

        return Math.max((piggybank.target - piggybank.balance_value) / months, 0);
    }

    protected piggybanksSaveSum: number = 0;

    /**
     * Snapshot of `post.parts` after the last rebalance, so `onShareChange` can compute how much
     * a slider actually moved (the model already holds the new value by the time ngModel fires).
     */
    private previousParts: { [key: number]: number } = {};

    /**
     * I distribute the transaction amount across the piggybanks weighted by `getSavingsRate()` -
     * piggybanks with a tighter deadline / bigger gap to their target get proportionally more of
     * the prefilled split. Piggybanks without a savings rate (no `end` date) fall back to an equal
     * share; if none of them have a rate, everyone gets an equal share.
     */
    private prefillParts(): void {
        if (!this.Transaction || this.Piggybanks.length === 0) {
            return;
        }

        const total = this.Transaction.balance_value;
        const weights = this.Piggybanks.map((piggybank) => this.getSavingsRate(piggybank) ?? 0);
        const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
        const shares = weightSum > 0
            ? weights.map((weight) => weight / weightSum)
            : this.Piggybanks.map(() => 1 / this.Piggybanks.length);

        let allocated = 0;
        this.Piggybanks.forEach((piggybank, index) => {
            // The last piggybank absorbs the rounding remainder so the sum is exact.
            const value = index === this.Piggybanks.length - 1
                ? this.round2(total - allocated)
                : this.round2(total * shares[index]);

            this.post.parts[piggybank.id] = value;
            this.previousParts[piggybank.id] = value;
            allocated += value;
        });

        this.recomputeSaveSum();
    }

    /**
     * I keep the split summed to the transaction amount: growing one piggybank's share shrinks
     * the others proportionally to their current share (and vice versa when shrinking it), so the
     * user never has to manually chase an exact remainder across sliders.
     */
    protected onShareChange(changed: Piggybank): void {
        if (!this.Transaction) {
            return;
        }

        const total = this.Transaction.balance_value;
        const others = this.Piggybanks.filter((piggybank) => piggybank.id !== changed.id);
        const requestedValue = Math.min(Math.max(Number(this.post.parts[changed.id]), 0), total);

        if (others.length === 0) {
            const clamped = this.round2(requestedValue);
            this.post.parts[changed.id] = clamped;
            this.previousParts[changed.id] = clamped;
            this.recomputeSaveSum();
            return;
        }

        const previousValue = this.previousParts[changed.id] ?? 0;
        const delta = requestedValue - previousValue;
        const othersSum = others.reduce((sum, piggybank) => sum + Number(this.post.parts[piggybank.id]), 0);

        if (delta > 0) {
            // Growing this share: shrink the others by `delta` total, proportional to their
            // current share, clamped to whatever the others can actually give up.
            const actualDelta = Math.min(delta, othersSum);
            others.forEach((piggybank) => {
                const current = Number(this.post.parts[piggybank.id]);
                const reduction = othersSum > 0 ? actualDelta * (current / othersSum) : 0;
                this.post.parts[piggybank.id] = this.round2(current - reduction);
            });
        } else if (delta < 0) {
            // Shrinking this share: hand the freed amount back to the others, proportional to
            // their current share, or split evenly if they are all currently at zero.
            const freed = -delta;
            others.forEach((piggybank) => {
                const current = Number(this.post.parts[piggybank.id]);
                const addition = othersSum > 0 ? freed * (current / othersSum) : freed / others.length;
                this.post.parts[piggybank.id] = this.round2(current + addition);
            });
        }

        // The changed slider absorbs whatever remains after rounding the others, so the total
        // always adds up exactly to the transaction amount.
        const othersNewSum = others.reduce((sum, piggybank) => sum + Number(this.post.parts[piggybank.id]), 0);
        const finalValue = this.round2(total - othersNewSum);

        this.post.parts[changed.id] = finalValue;
        this.previousParts[changed.id] = finalValue;
        others.forEach((piggybank) => {
            this.previousParts[piggybank.id] = this.post.parts[piggybank.id];
        });

        this.recomputeSaveSum();
    }

    /**
     * `parts` is a key/value store keyed by piggybank id - a null entry (e.g. one round-tripped
     * from `/piggybank/fetch`) is an obsolete key, not a real "0 EUR share", so it has no business
     * being submitted back to the server.
     */
    private withoutNullParts(parts: PiggybankSavePost['parts']): PiggybankSavePost['parts'] {
        return Object.fromEntries(
            Object.entries(parts).filter(([, value]) => value !== null && value !== undefined)
        );
    }

    private recomputeSaveSum(): void {
        let sum = 0;
        for (const amount of Object.values(this.post.parts)) {
            sum += Number(amount);
        }
        this.piggybanksSaveSum = this.round2(sum);
    }

    /**
     * Rounds to the cent so repeated rebalancing/prefill arithmetic doesn't drift into float
     * dust that would trip the exact-sum check on the Save button.
     */
    protected round2(value: number): number {
        return Math.round(value * 100) / 100;
    }

    protected readonly Number = Number;
}
