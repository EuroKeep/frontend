import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import {EurokeepMobileModuleRoutes} from "./modules/eurokeep_mobile_module/eurokeep_mobile_module.routes";
import {OverviewModuleRoutes} from "./modules/overview_module/overview_module.routes";
@Component({
    selector: 'legacy-redirect',
    template: `If you can read this, something has to be fixed ;)`,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterModule]
})
class LegacyUrlComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly document = inject(DOCUMENT);

    public constructor() {

        const {legacyUrl} = this.route.snapshot.data;

        if (legacyUrl) {
            this.document.location.href = legacyUrl;
        }
    }
}

/***    Routes for modules   ***/
const moduleRoutes: Routes = [
    // MOBILE FIRST
    ...EurokeepMobileModuleRoutes,
    // ALSO SOME ANALYSIS STUPH
    ...OverviewModuleRoutes
];


export const routes: Routes = [
    ...moduleRoutes
];
