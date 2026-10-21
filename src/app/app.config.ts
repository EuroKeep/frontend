import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {AuthenticationService} from "./services/authentication/authentication.service";
import { provideHttpClient, withInterceptors, withXhr } from "@angular/common/http";
import { authInterceptor } from "./auth/auth.interceptor";
import { csrfInterceptor } from "./auth/csrf.interceptor";
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { DropdownService } from '@coreui/angular';
import { loaderInterceptor } from './interceptors/loader.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideOptimus } from '@openng/optimus-ui/config';
import { MessageService } from '@openng/optimus-ui/api';
import { EuroKeepPreset } from './optimus-preset';

export const appConfig: ApplicationConfig = {
    providers: [
        {provide: Window, useValue: window},
        {provide: AuthenticationService, useClass: AuthenticationService},
        provideHttpClient(withXhr(), 
            withInterceptors([authInterceptor, csrfInterceptor, loaderInterceptor]),
        ),
        provideRouter(routes),
        MessageService,
        provideTransloco({
            // All options: https://jsverse.github.io/transloco/docs/getting-started/config-options
            config: {
                availableLangs: ['en_US', 'de_DE'],
                defaultLang: 'en_US',
                failedRetries: 1,
                reRenderOnLangChange: true,
                prodMode: !isDevMode(),
            },
            loader: TranslocoHttpLoader
        }),
        provideAnimationsAsync(),
        DropdownService,
        provideOptimus({
            theme: {
                preset: EuroKeepPreset,
                options: {
                    prefix: 'p',
                    darkModeSelector: '.dark-theme',
                    cssLayer: false
                }
            }
        })
    ]
};
