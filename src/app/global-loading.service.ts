import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GlobalLoadingService {

    // Port of GlobalAjax Loader form AngularJS

    private runningRequestsCounter = 0;
    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    isLoading$ = this.isLoadingSubject.asObservable();

    constructor() {
    }

    showLoader() {
        if (this.runningRequestsCounter === 0) {
            this.isLoadingSubject.next(true);
        }
        this.runningRequestsCounter++;
    }

    hideLoader() {
        this.runningRequestsCounter--;
        if (this.runningRequestsCounter === 0) {
            this.isLoadingSubject.next(false);
        }
    }
}
