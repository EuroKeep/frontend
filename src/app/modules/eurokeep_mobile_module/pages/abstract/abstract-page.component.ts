import {ChangeDetectionStrategy, Component} from "@angular/core";
import {TranslocoDirective} from "@jsverse/transloco";
import {GenericValidationError} from "../../../../generic-responses";
import {AbstractComponent} from "../../../../components/abstract/abstract.component";
import {AbstractHttpResponse} from "../../../../services/abstract/abstract.interface";

@Component({
    selector: 'abstract-page',
    imports: [
        TranslocoDirective
    ],
    templateUrl: './abstract-page.component.html',
    styleUrl: './abstract-page.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbstractPageComponent extends AbstractComponent {
    // Required services, etc.
    protected IsWorking: boolean = false;

    protected lockButtons(): void {
        this.IsWorking = true;
        this.ChangeDetectorRef.markForCheck();
    }

    protected unlockButtons(): void {
        this.IsWorking = false;
        this.ChangeDetectorRef.markForCheck();
    }

    // Fields for the page
    protected errors?: GenericValidationError;

    public override ngOnInit() {
    }

    public override ngOnDestroy() {
        this.Subscription.unsubscribe();
    }

    protected handleErrors(result: AbstractHttpResponse): void {
        this.handleError(result.error);
    }

    protected handleError(errors: any): void {
        if (errors && errors[0]) {
            this.NotyService.genericError(errors[0]);
        } else {
            this.NotyService.genericError("An error happened. Sorry 'bout that.");
        }

        this.errors = errors;
        this.unlockButtons();
        this.ChangeDetectorRef.markForCheck();
    }

    /**
     * Uniform confirmation prompt for destructive actions (delete). Returns true if the
     * user confirmed. Centralized here so every entity asks the same question the same way.
     */
    protected confirmDelete(message?: string): boolean {
        const text = message ?? this.TranslocoService.translate('Do you really want to delete this entry? This cannot be undone.');
        return window.confirm(text);
    }
}
