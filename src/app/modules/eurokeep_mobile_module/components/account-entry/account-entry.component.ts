import {ChangeDetectionStrategy, Component, EventEmitter, input, Output} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {AbstractComponent} from "../../../../components/abstract/abstract.component";
import {BalanceComponent} from "../../../../components/balance/balance.component";
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    ColComponent,
    RowComponent
} from "@coreui/angular";
import {Account} from "../../../../services/account/account.interface";
import {ClippyComponent} from "../../../../components/clippy/clippy.component";
import {DiscreteDirective} from "../../../../directives/discrete.directive";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'account-entry',
    imports: [
        TranslocoDirective,
        BalanceComponent,
        ColComponent,
        RowComponent,
        ClippyComponent,
        DiscreteDirective,
        BadgeComponent,
        FaIconComponent,
        CardComponent,
        CardBodyComponent,
        RouterLink,
    ],
    templateUrl: './account-entry.component.html',
    styleUrl: './account-entry.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountEntryComponent extends AbstractComponent {
    readonly Account = input.required<Account>();
    readonly ShowIban = input<boolean>(true);
    readonly EditUrl = input<string[]>([]);
    readonly showEdit = input<boolean>(false);

    @Output() toggleFavourite: EventEmitter<Account> = new EventEmitter<Account>()

    protected isFavourite() : boolean {
        return (this.Account().flags & 2) === 2;
    }
}
