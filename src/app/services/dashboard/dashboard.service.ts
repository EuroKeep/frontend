import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AbstractService} from "../abstract/abstract.service";
import {ApiItemResponse} from "../abstract/abstract.interface";
import {Networth} from "./dashboard.interface";

@Injectable({providedIn: 'root'})
export class DashboardService extends AbstractService {

    public getNetWorth(): Observable<ApiItemResponse<Networth>> {
        return this.http.get<ApiItemResponse<Networth>>(`/dashboard/networth`);
    }

}