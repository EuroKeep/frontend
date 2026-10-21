import {
    ChangeDetectionStrategy,
    Component,
} from '@angular/core';
import {AbstractComponent} from "../../components/abstract/abstract.component";
import {RouterOutlet} from "@angular/router";

@Component({
    selector: 'coreui-header',
    imports: [
        RouterOutlet
    ],
    templateUrl: './login.layout.html',
    styleUrl: './login.layout.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreuiHeaderComponent extends AbstractComponent {


}
