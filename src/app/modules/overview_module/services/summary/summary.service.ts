import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {ClosingBalanceSummaryResponse, SummaryResponse} from "./summary.interface";

@Injectable({providedIn: 'root'})
export class SummaryService {
    private readonly http: HttpClient = inject(HttpClient);

    public complete(params: any): Observable<SummaryResponse> {
        return this.http.get<SummaryResponse>(`/summary/complete`, {
            params: params as {} // cast ContactsIndexParams into object
        }).pipe(
            map((response: SummaryResponse) => {
                return response;
            })
        )
    }
    public closing(params: any): Observable<ClosingBalanceSummaryResponse> {
        return this.http.get<ClosingBalanceSummaryResponse>(`/summary/closing`, {
            params: params as {} // cast ContactsIndexParams into object
        }).pipe(
            map((response: ClosingBalanceSummaryResponse) => {
                return response;
            })
        )
    }

}