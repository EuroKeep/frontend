import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    input
} from '@angular/core';
import  {RouterLink} from '@angular/router';
import {TranslocoDirective} from '@jsverse/transloco';
import {AbstractComponent} from "../../../components/abstract/abstract.component";
import {
    CardBodyComponent,
    CardComponent, CardHeaderComponent, CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownComponent, DropdownDividerDirective, DropdownHeaderDirective, DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    HeaderNavComponent, RowComponent
} from "@coreui/angular";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgTemplateOutlet} from "@angular/common";

@Component({
    selector: 'coreui-header',
    imports: [
        TranslocoDirective,
        ContainerComponent,
        HeaderNavComponent,
        HeaderNavComponent,
        DropdownComponent,
        DropdownToggleDirective,
        DropdownMenuDirective,
        DropdownHeaderDirective,
        DropdownItemDirective,
        FaIconComponent,
        DropdownDividerDirective,
        DropdownDividerDirective,
        NgTemplateOutlet,
        ColComponent,
        RowComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        RouterLink
    ],
    templateUrl: './coreui-header.component.html',
    styleUrl: './coreui-header.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreuiHeaderComponent extends AbstractComponent {

    readonly dropdownMode = input<'path' | 'none' | 'close'>('path');
    readonly groupItems = input<boolean, unknown>(false, {transform: booleanAttribute});
    readonly compact = input<boolean, unknown>(false, {transform: booleanAttribute});

    public visible: boolean = true; // show or hide the complete menu

}
