import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthenticationService} from "../services/authentication/authentication.service";
import {tap} from "rxjs";

export const csrfInterceptor: HttpInterceptorFn = (req: any, next: any) => {
    const AuthService: AuthenticationService = inject(AuthenticationService);

    let csrfRequest = req;

    if (req.method !== 'GET' && AuthService.csrfToken) {
        csrfRequest = req.clone({
            headers: req.headers.set('X-CSRF-Token', AuthService.csrfToken)
        });
    }

    return next(csrfRequest).pipe(
        tap((event: any) => {
            if (event?.body?.csrfToken) {
                AuthService.csrfToken = event.body.csrfToken;
            }
        }),
    );
};
