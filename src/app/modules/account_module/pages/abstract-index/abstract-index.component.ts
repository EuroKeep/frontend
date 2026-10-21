import {ChangeDetectionStrategy, Component} from "@angular/core";
import {TranslocoDirective} from "@jsverse/transloco";
import {CrudService} from "../../../../services/abstract/abstract.interface";
import {AbstractPageComponent} from "../../../eurokeep_mobile_module/pages/abstract/abstract-page.component";

@Component({
    selector: 'abstract-list',
    templateUrl: './abstract-index.component.html',
    styleUrl: './abstract-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbstractIndexComponent extends AbstractPageComponent {
    // THE service
    protected readonly CrudService: CrudService = {} as CrudService;

    // THE Response
    protected CrudResponse: any = {};

    // THE Items
    protected Items: any[] = [];

    // Fields for the page
    protected params: any = {
    };
    protected hideFilter: boolean = true;

    // At last, every list page uses list() to load the elements to the page.
    public override ngOnInit() {
        super.ngOnInit();
        this.index();
    }

    // Show or hide the filter
    protected toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    protected index(): void {
        this.lockButtons();
        this.Subscription.add(this.CrudService.index(this.params).subscribe({
            next: (CrudResponse: any) => {
                this.CrudResponse = CrudResponse;
                // Parse Items here
                this.Items = CrudResponse.items;
                // Maybe theres additional fields?
                this.processResponse(CrudResponse);
                // Unlock everything.
                this.afterIndex(CrudResponse);
            },
            error: (error: any) => this.handleError(error?.error?.error)
        }));
    }

    protected processResponse(CrudResponse: any) : void {
    }

    protected afterIndex(CrudResponse: any) : void {
        this.ChangeDetectorRef.markForCheck();
        this.unlockButtons();
    }

    // Callback when a filter has changed
    protected onFilterChange(event: any) {
        this.params.page = 1;
        this.index();
    }

    protected resetFilter() {
        this.params = this.getDefaultIndexParams();
        this.index();
    }

    protected getDefaultIndexParams(): any {
        return {}
    }
}
