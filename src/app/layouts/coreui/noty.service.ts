import { inject, Injectable } from '@angular/core';
import { MessageService, ToastMessageOptions } from '@openng/optimus-ui/api';
import { TranslocoService } from '@jsverse/transloco';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root',
})
export class NotyService {

    private router = inject(Router);
    private readonly document = inject(DOCUMENT);

    constructor(private messageService: MessageService, private TranslocoService: TranslocoService) {
    }

    genericSuccess(message?: string, title?: string, url?: any[], timeout?: number) {
        if (!message) {
            message = this.TranslocoService.translate('Data saved successfully');
        }

        this.messageService.add({
            severity: 'success',
            summary: title,
            detail: message,
            life: (timeout) ? timeout : 5000,
            data: {url}
        });
    }


    genericError(message?: string, title?: string, url?: any[]) {
        if (!message) {
            message = this.TranslocoService.translate('Error while saving data');
        }

        this.messageService.add({
            severity: 'error',
            summary: title,
            detail: message,
            life: 5000,
            data: {url}
        });
    }

    genericWarning(message?: string, title?: string, url?: any[]) {
        if (!message) {
            message = this.TranslocoService.translate('Warning - something unexpected happened');
        }

        this.messageService.add({
            severity: 'warn',
            summary: title,
            detail: message,
            life: 5000,
            data: {url}
        });
    }

    genericInfo(message?: string, title?: string, url?: any[]) {
        if (!message) {
            message = this.TranslocoService.translate('Please wait while processing ...');
        }

        this.messageService.add({
            severity: 'info',
            summary: title,
            detail: message,
            life: 5000,
            data: {url}
        });
    }

    scrollContentDivToTop() {
        // The setTimeout fix the issue with the scrollIntoView not working properly ¯\_(ツ)_/¯
        setTimeout(() => {
            const element = this.document.getElementById("mainContentContainer");
            if (element) {
                element.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
        }, 15);
    }

    scrollTop() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    /**
     * Optimus UI's Toast has no built-in click output (unlike ngx-toastr's `onTap`), so the
     * custom message template in AppComponent's `<p-toast>` calls back into here.
     */
    handleToastClick(message: ToastMessageOptions): void {
        const url = message.data?.url;
        if (url && url.length > 0) {
            this.router.navigate(url);
        }
    }
}
