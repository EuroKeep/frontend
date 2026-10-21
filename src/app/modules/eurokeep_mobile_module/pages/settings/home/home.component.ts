import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {CardBodyComponent, CardComponent, ColComponent, RowComponent} from '@coreui/angular';
import {RouterLink} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {IconName} from "@fortawesome/fontawesome-svg-core";
import {AbstractPageComponent} from "../../abstract/abstract-page.component";

interface SettingsEntry {
    label: string
    icon: IconName
    url: string[]
}

@Component({
    selector: 'settings-home',
    imports: [
        TranslocoDirective,
        RouterLink,
        CardComponent,
        CardBodyComponent,
        RowComponent,
        ColComponent,
        FaIconComponent,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends AbstractPageComponent {
    protected readonly Entries: SettingsEntry[] = [
        {label: 'Categories', icon: 'folder-tree', url: ['/', 'mobile', 'category', 'list']},
        {label: 'Account types', icon: 'building-columns', url: ['/', 'mobile', 'accounttype', 'list']},
        {label: 'Payment methods', icon: 'credit-card', url: ['/', 'mobile', 'paymentmethod', 'list']},
    ];
}
