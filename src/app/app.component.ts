import {AfterViewInit, ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
    faArrowLeft,
    faArrowRight,
    faArrowRightFromBracket,
    faArrowsRotate,
    faBook,
    faBuildingColumns,
    faBullseye,
    faCalendar,
    faChartPie,
    faChevronLeft,
    faChevronRight,
    faCircleInfo,
    faCoins,
    faCopy,
    faCreditCard,
    faEye,
    faEyeSlash,
    faFolderTree,
    faGear,
    faGripVertical,
    faGears,
    faGlobe,
    faHandHoldingDollar,
    faHouse,
    faImage,
    faKey,
    faPenToSquare,
    faPiggyBank,
    faPlus,
    faSpinner,
    faStar,
    faTable,
    faTrash,
    faTriangleExclamation,
    faUser,
    faWallet,
    faWandSparkles,
} from '@fortawesome/free-solid-svg-icons';
import {faGithubAlt} from '@fortawesome/free-brands-svg-icons';

import {TranslocoDirective} from '@jsverse/transloco';
import {NgSelectConfig} from '@ng-select/ng-select';
import {
    ButtonDirective,
    ColComponent,
    ColorModeService,
    ContainerComponent,
    RowComponent,
} from '@coreui/angular';
import {Toast} from '@openng/optimus-ui/toast';


import {AsyncPipe, DOCUMENT} from '@angular/common';
import {Subscription} from 'rxjs';
import {toObservable} from '@angular/core/rxjs-interop';
import {AbstractPageComponent} from "./modules/eurokeep_mobile_module/pages/abstract/abstract-page.component";
import {CoreuiHeaderComponent} from "./layouts/coreui/header/coreui-header.component";
import {Layouts} from "./services/layout/layout.interface";

@Component({
    selector: 'root',
    imports: [
        RouterOutlet,
        FontAwesomeModule,
        ContainerComponent,
        RouterLink,
        TranslocoDirective,
        ColComponent,
        RowComponent,
        CoreuiHeaderComponent,
        AsyncPipe,
        ButtonDirective,
        Toast
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends AbstractPageComponent implements AfterViewInit {
    private readonly document = inject(DOCUMENT);

    private subscription: Subscription = new Subscription();

    constructor(library: FaIconLibrary,
                private selectConfig: NgSelectConfig,
                private colorService: ColorModeService,
    ) {
        super();
        // Only the icons used in the templates, so the bundle does not contain all icon packs.
        // Aliases (cog, edit, home, info-circle, pie-chart, refresh, …) are registered along with them.
        library.addIcons(
            faArrowLeft, faArrowRight, faArrowRightFromBracket, faArrowsRotate, faBook, faBuildingColumns,
            faBullseye, faCalendar, faChartPie, faChevronLeft, faChevronRight, faCircleInfo, faCoins, faCopy,
            faCreditCard, faEye, faEyeSlash, faFolderTree, faGear, faGears, faGlobe, faGripVertical,
            faHandHoldingDollar, faHouse, faImage, faKey, faPenToSquare, faPiggyBank, faPlus, faSpinner,
            faStar, faTable, faTrash, faTriangleExclamation, faUser, faWallet, faWandSparkles,
        );
        library.addIcons(faGithubAlt);

        this.selectConfig.notFoundText = this.TranslocoService.translate('No entries match the selection');
        this.selectConfig.placeholder = this.TranslocoService.translate('Please choose');


        // This is to sync the selected theme color from CoreUI with Angular Material
        // --force --brechstange
        const colorMode$ = toObservable(this.colorService.colorMode);


        // Subscribe to the color mode changes (drop down menu in header)
        this.subscription.add(colorMode$.subscribe((theme) => {

            // theme can be one of 'light', 'dark', 'auto'
            if (theme === 'dark') {
                this.document.body.classList.add('dark-theme');
                this.document.querySelector("html")!.classList.add("dark-theme"); // Optimus UI needs this
            } else if (theme === 'auto') {
                const osSystemDarkModeEnabled = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (osSystemDarkModeEnabled) {
                } else {
                }
            } else {
                this.document.body.classList.remove('dark-theme');
                this.document.querySelector("html")!.classList.remove("dark-theme"); // Optimus UI needs this
            }
        }));

    }


    public ngAfterViewInit(): void {
        const osSystemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const coreUiTheme: 'light' | 'dark' | 'auto' | null = this.colorService.getStoredTheme('coreui-free-angular-admin-template-theme-default');

        if (osSystemDarkMode && coreUiTheme !== 'light') {
            // Enable dark mode for Angular Material because the OS wants dark mode
            // quick and dirty hack
            setTimeout(() => {
                this.document.body.classList.add('dark-theme');
            }, 100);
        }

        if (coreUiTheme === 'auto' || coreUiTheme === null) {
            setTimeout(() => {
                // Force CoreUI to use the OS theme
                this.colorService.colorMode.set('auto');
            }, 100);
        }
    }

    protected readonly Layouts = Layouts;
}
