import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Piggybank, PiggybankSavePost,} from "./piggybank.interface";
import {
    ApiAddResponse,
    ApiDeleteResponse,
    ApiIndexResponse,
    ApiPatchResponse,
    ApiPutResponse,
    ApiViewResponse
} from "../abstract/abstract.interface";

@Injectable({providedIn: 'root'})
export class PiggybankService {
    private readonly http: HttpClient = inject(HttpClient);

    public index(params: any): Observable<ApiIndexResponse<Piggybank>> {
        return this.http.get<ApiIndexResponse<Piggybank>>(`/piggybank/index`, {
            params: params as {} // cast ContactsIndexParams into object
        });
    }

    public view(id: number): Observable<ApiViewResponse<Piggybank>> {
        return this.http.get<ApiViewResponse<Piggybank>>(`/piggybank/view/${id}`);
    }

    public delete(piggybank: Piggybank): Observable<ApiDeleteResponse<Piggybank>> {
        return this.http.delete<ApiDeleteResponse<Piggybank>>(`/piggybank/delete/${piggybank.id}`);
    }

    /**
     * I will edit the Piggybank entity itself (name/target/description/...), or, when given
     * a PiggybankSavePost, deposit money into it. Both go through the same `/piggybank/edit/{id}`
     * endpoint, keyed off whichever shape was passed in.
     */
    public patch(piggybank: Piggybank): Observable<ApiPatchResponse<Piggybank>> {
        const id = 'piggybank_id' in piggybank ? piggybank.piggybank_id : piggybank.id;
        return this.http.patch<ApiPatchResponse<Piggybank>>(`/piggybank/edit/${id}`, piggybank);
    }

    public put(piggybank: Piggybank): Observable<ApiPutResponse<Piggybank>> {
        const id = 'piggybank_id' in piggybank ? piggybank.piggybank_id : piggybank.id;
        return this.http.put<ApiPutResponse<Piggybank>>(`/piggybank/edit/${id}`, piggybank);
    }

    public add(piggybank: Piggybank): Observable<ApiAddResponse<Piggybank>> {
        return this.http.post<ApiAddResponse<Piggybank>>(`/piggybank/add`, piggybank);
    }

    public save(data: PiggybankSavePost): Observable<ApiAddResponse<Piggybank>> {
        return this.http.post<ApiAddResponse<Piggybank>>(`/piggybank/save/${data.transaction_id}`, data);
    }

    public fetch(transactionId: number): Observable<ApiViewResponse<PiggybankSavePost>> {
        return this.http.get<ApiViewResponse<PiggybankSavePost>>(`/piggybank/fetch/${transactionId}`);
    }

}