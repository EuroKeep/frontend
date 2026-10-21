import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges
} from "@angular/core";
import {Subscription} from "rxjs";
import {TranslocoDirective, TranslocoService} from "@jsverse/transloco";
import {ActivatedRoute, Router} from "@angular/router";
import {NotyService} from "../../layouts/coreui/noty.service";
import {DiscreteService} from "../../services/discrete/discrete.service";
import {LocalStorageService} from "@coreui/angular";
import {LayoutService} from "../../services/layout/layout.service";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {I18nService} from "../../services/i18n/i18n.service";

@Component({
    selector: 'abstract-component',
    imports: [
        TranslocoDirective,
    ],
    templateUrl: './abstract.component.html',
    styleUrl: './abstract.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbstractComponent implements OnInit, OnDestroy, OnChanges {
    protected readonly Router: Router = inject(Router);
    protected readonly Subscription: Subscription = new Subscription();
    protected readonly ChangeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
    protected readonly ActivatedRoute: ActivatedRoute = inject(ActivatedRoute);
    protected readonly TranslocoService: TranslocoService = inject(TranslocoService);
    protected readonly NotyService: NotyService = inject(NotyService);
    protected readonly DiscreteService: DiscreteService = inject(DiscreteService);
    protected readonly LocalStorageService: LocalStorageService = inject(LocalStorageService);
    protected readonly LayoutService: LayoutService = inject(LayoutService);
    protected readonly AuthenticationService: AuthenticationService = inject(AuthenticationService);
    protected readonly I18nService: I18nService = inject(I18nService);
    protected helpUrl: string = '';
    protected enable_registration: boolean = true;


    public logout(): void {
        this.Subscription.add(this.AuthenticationService.logout().subscribe({
            next: () => this.Router.navigate(['/login']),
            error: () => this.Router.navigate(['/login'])
        }));
    }


    public ngOnInit() {
        // Change if the DiscreteService changes its status.
        this.Subscription.add(this.DiscreteService.isDiscrete$.subscribe((isDiscrete: boolean): void => {
            this.ChangeDetectorRef.markForCheck();
        }));

        // Change if the active language changes.
        this.Subscription.add(this.I18nService.language$.subscribe((): void => {
            this.ChangeDetectorRef.markForCheck();
        }));
    }

    public ngOnDestroy() {
        this.Subscription.unsubscribe();
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.ChangeDetectorRef.markForCheck();
    }

    formatDate(dateString: string): string {
        let date = new Date(dateString);
        const d = String(date.getUTCDate()).padStart(2, "0");
        const m = String(date.getUTCMonth() + 1).padStart(2, "0");
        const y = date.getUTCFullYear();

        return `${d}.${m}.${y}`;
    }

    formatMonthDate(dateString: string): string {
        let date = new Date(dateString);
        const d = String(date.getUTCDate()).padStart(2, "0");
        const m = String(date.getUTCMonth() + 1).padStart(2, "0");
        const y = date.getUTCFullYear();

        return `${m}.${y}`;
    }

    formatMonthDateWithName(dateString: string): string {
        let date = new Date(dateString);
        const d = String(date.getUTCDate()).padStart(2, "0");
        const m = date.getUTCMonth();
        const y = date.getUTCFullYear();

        let monthName: string = this.monthNames[m];

        return `${monthName} ${y}`;
    }

    protected readonly monthNames: string[] = [
        this.TranslocoService.translate('January'),
        this.TranslocoService.translate('February'),
        this.TranslocoService.translate('March'),
        this.TranslocoService.translate('April'),
        this.TranslocoService.translate('May'),
        this.TranslocoService.translate('June'),
        this.TranslocoService.translate('July'),
        this.TranslocoService.translate('August'),
        this.TranslocoService.translate('September'),
        this.TranslocoService.translate('October'),
        this.TranslocoService.translate('November'),
        this.TranslocoService.translate('December'),
    ];

    formatTime(dateString: string): string {
        let date = new Date(dateString);
        const h = String(date.getUTCHours()).padStart(2, "0");
        const m = String(date.getUTCMinutes()).padStart(2, "0");
        return `${h}:${m}`;
    }
}
