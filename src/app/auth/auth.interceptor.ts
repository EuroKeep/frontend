import {HttpContextToken, HttpInterceptorFn, HttpStatusCode} from '@angular/common/http';
import {catchError, EMPTY, throwError} from "rxjs";
import {inject} from "@angular/core";
import {Router} from "@angular/router";

/**
 * Set this to true on requests where a 404 is an expected answer (e.g. "nothing found") and must
 * not redirect to the error page. The error is still re-thrown to the caller.
 */
export const SKIP_NOT_FOUND_REDIRECT = new HttpContextToken<boolean>(() => false);

export const authInterceptor: HttpInterceptorFn = (req: any, next: any) => {
    let router: Router = inject(Router);

    return next(req).pipe(
        catchError((error) => {
            if (error.status === HttpStatusCode.Unauthorized) {
                router.navigate(['/login']);

                return EMPTY;
            }
            if (error.status === HttpStatusCode.Forbidden) {
                router.navigate(['/login']);

                return EMPTY;
            }

            if (error.status === HttpStatusCode.NotFound && !req.context.get(SKIP_NOT_FOUND_REDIRECT)) {
                router.navigate(['/error']);
            }

            // re-throw all other errors so components can handle them
            return throwError(() => error);
        })
    );
};
