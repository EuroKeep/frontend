import {ChangeDetectionStrategy, Component, EventEmitter, input, Output} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {AbstractComponent} from "../abstract/abstract.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ButtonDirective} from "@coreui/angular";

@Component({
    selector: 'nox-spamsave-button',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        ButtonDirective
    ],
    templateUrl: './spamsave-button.component.html',
    styleUrl: './spamsave-button.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpamsaveButtonComponent extends AbstractComponent {
    public IsWorking = input<boolean>(false);
    @Output() clicked = new EventEmitter<any>();


    // Go to next page (if any)
    public onClick() {
        this.clicked.emit();
    }
}
