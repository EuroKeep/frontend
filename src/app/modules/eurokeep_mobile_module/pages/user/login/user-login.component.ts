import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AbstractPageComponent} from "../../abstract/abstract-page.component";
import {
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    ColComponent,
    ContainerComponent,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent
} from "@coreui/angular";
import {
    AuthInitResponse,
    LoginRequest,
    LoginResponse,
    RegisterResponse
} from "../../../../../services/authentication/auth.interface";
import {Layouts} from "../../../../../services/layout/layout.interface";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {SpamsaveDirective} from "../../../../../directives/spamsave.directive";

@Component({
    selector: 'user-login',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FormsModule,
        RowComponent,
        ColComponent,
        CardComponent,
        CardBodyComponent,
        CardBodyComponent,
        CardFooterComponent,
        ButtonDirective,
        FaIconComponent,
        SpamsaveDirective,
        InputGroupTextDirective,
        InputGroupComponent,
        FormControlDirective,
        ContainerComponent,
    ],
    templateUrl: './user-login.html',
    styleUrl: './user-login.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserLoginComponent extends AbstractPageComponent {

    protected parameters: LoginRequest = {
        username: '',
        password: '',
        remember: true
    };

    override ngOnInit() {
        let isDemo: string = String(this.ActivatedRoute.snapshot.paramMap.get('demo'));

        this.LayoutService.setLayout(Layouts.login);

        // Demo login only after the init request has finished, otherwise its response
        // resets the form and the demo credentials are lost
        this.Subscription.add(this.AuthenticationService.init().subscribe({
            next: (result: AuthInitResponse) => {
                this.enable_registration = result.enable_registration;
                this.LocalStorageService.setItem('EUROKEEP.ENABLE_REGISTRATION', result.enable_registration);
                this.ChangeDetectorRef.markForCheck();
                this.startDemo(isDemo);
            },
            error: () => this.startDemo(isDemo)
        }));
        super.ngOnInit();
    }

    override ngOnDestroy() {
        this.LayoutService.setLayout(Layouts.mobile);
        super.ngOnDestroy();
    }

    private startDemo(isDemo: string): void {
        if (isDemo !== 'demo') {
            return;
        }
        this.parameters.username = 'demo@eurokeep.io';
        this.parameters.password = 'demo';
        this.ChangeDetectorRef.markForCheck();

        this.login();
    }

    protected login(): void {
        this.lockButtons();
        this.Subscription.add(this.AuthenticationService.login(this.parameters).subscribe({
            next: (response: LoginResponse) => {
                this.unlockButtons();
                if (response.success) {
                    this.LocalStorageService.setItem('AUTH.USER', response.user);
                    this.AuthenticationService.setUser(response.user);
                    this.NotyService.genericSuccess(this.TranslocoService.translate('Welcome') + " " + response.user.name)
                    this.Router.navigate(['/mobile/home']);
                    return;
                }

                this.handleError(response.errors);
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
    }

    protected register() : void {
        if (! this.enable_registration) {
            return;
        }
        this.Subscription.add(this.AuthenticationService.register(this.parameters).subscribe({
            next: (response: RegisterResponse) => {
                if (response.success) {
                    this.login();
                    return;
                }

                this.handleError(response.error);
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
    }

}
