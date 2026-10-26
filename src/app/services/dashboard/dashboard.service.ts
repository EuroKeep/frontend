import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AbstractService} from "../abstract/abstract.service";
import {ApiIndexResponse, ApiItemResponse} from "../abstract/abstract.interface";
import {Networth} from "./dashboard.interface";

@Injectable({providedIn: 'root'})
export class DashboardService extends AbstractService {

    public getNetWorth(): Observable<ApiIndexResponse<Networth>> {
        return this.http.get<ApiIndexResponse<Networth>>(`/dashboard/networth`);
    }

}