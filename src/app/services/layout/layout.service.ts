import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {AbstractService} from "../abstract/abstract.service";
import {Layouts} from "./layout.interface";

@Injectable({providedIn: 'root'})
export class LayoutService extends AbstractService {

    public layout$$: BehaviorSubject<Layouts> = new BehaviorSubject<Layouts>(Layouts.mobile);
    public layout$: Observable<Layouts> = this.layout$$.asObservable();


    public setLayout(layout: Layouts) : void {
        this.layout$$.next(layout);
    }
}