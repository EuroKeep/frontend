import {Injectable} from '@angular/core';
import {AbstractService} from "../abstract/abstract.service";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class I18nService extends AbstractService {
    public readonly language$$: BehaviorSubject<string> = new BehaviorSubject<string>(this.TranslocoService.getActiveLang());
    public readonly language$: Observable<string> = this.language$$.asObservable();

    public getLanguage(): string {
        return this.language$$.getValue();
    }

    public setLanguage(language: string): void {
        this.TranslocoService.setActiveLang(language);
        this.language$$.next(language);
    }
}