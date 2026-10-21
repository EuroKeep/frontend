import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {
    ButtonDirective,
    ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    ColComponent,
    RowComponent
} from '@coreui/angular';
import {RouterLink} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {AbstractIndexComponent} from "../../../../account_module/pages/abstract-index/abstract-index.component";
import {AccounttypeService} from "../../../../../services/accounttype/accounttype.service";
import {Accounttype} from "../../../../../services/accounttype/accounttype.interface";

@Component({
    selector: 'accounttype-list',
    imports: [
        TranslocoDirective,
        RouterLink,
        RowComponent,
        ColComponent,
        CardComponent,
        CardBodyComponent,
        ButtonDirective,
        FaIconComponent,
        ButtonGroupComponent
    ],
    templateUrl: './accounttype-list.component.html',
    styleUrl: './accounttype-list.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccounttypeListComponent extends AbstractIndexComponent {
    // Inject Service
    protected override CrudService: AccounttypeService = inject(AccounttypeService);

    // Define Item Type
    protected override Items: Accounttype[] = [];
}
