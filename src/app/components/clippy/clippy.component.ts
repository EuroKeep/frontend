import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {AbstractComponent} from "../abstract/abstract.component";
import {TooltipDirective} from "@coreui/angular";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
    selector: 'clippy',
    imports: [
        TranslocoDirective,
        TooltipDirective,
        FaIconComponent,
    ],
    templateUrl: './clippy.component.html',
    styleUrl: './clippy.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClippyComponent extends AbstractComponent {
    readonly data = input.required<string>();

    public async copy(): Promise<void> {
        if (this.data()) {
            await navigator.clipboard.writeText(this.data());
            this.ChangeDetectorRef.markForCheck();

            setTimeout(() => {
                this.ChangeDetectorRef.markForCheck();
            }, 1000);
        }
    }
}
