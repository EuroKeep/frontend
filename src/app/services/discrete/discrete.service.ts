import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {AbstractService} from "../abstract/abstract.service";

@Injectable({providedIn: 'root'})
export class DiscreteService extends AbstractService {

    public isDiscrete$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.LocalStorageService.getItem('isDiscrete') || false);
    public isDiscrete$: Observable<boolean> = this.isDiscrete$$.asObservable();

    public toggle(isDiscrete: boolean) : void {
        this.LocalStorageService.setItem('isDiscrete', isDiscrete);
        this.isDiscrete$$.next(isDiscrete);
    }
}