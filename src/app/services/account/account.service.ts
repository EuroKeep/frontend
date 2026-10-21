import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Account} from "./account.interface";
import {AbstractService} from "../abstract/abstract.service";
import {
    AbstractHttpResponse,
    ApiAddResponse,
    ApiDeleteResponse,
    ApiEditResponse,
    ApiIndexResponse, ApiPatchResponse, ApiPutResponse,
    ApiViewResponse
} from "../abstract/abstract.interface";

@Injectable({providedIn: 'root'})
export class AccountService extends AbstractService {

    public index(): Observable<ApiIndexResponse<Account>> {
        return this.http.get<ApiIndexResponse<Account>>(`/account/index`);
    }

    public view(id: number): Observable<ApiViewResponse<Account>> {
        return this.http.get<ApiViewResponse<Account>>(`/account/view/${id}`);
    }

    public add(account: Account): Observable<ApiAddResponse<Account>> {
        return this.http.post<ApiAddResponse<Account>>(`/account/add`, account);
    }

    public patch(account: Account): Observable<ApiPatchResponse<Account>> {
        return this.http.patch<ApiPatchResponse<Account>>(`/account/edit/${account.id}`, account);
    }

    public put(account: Account): Observable<ApiPutResponse<Account>> {
        return this.http.put<ApiPutResponse<Account>>(`/account/edit/${account.id}`, account);
    }

    public delete(account: Account): Observable<ApiDeleteResponse<AbstractHttpResponse>> {
        return this.http.delete<ApiDeleteResponse<AbstractHttpResponse>>(`/account/delete/${account.id}`);
    }

    public toggleFavourite(account: Account): Observable<ApiEditResponse<Account>> {
        return this.http.post<ApiViewResponse<Account>>(`/account/toggleFavourite/${account.id}`, account);
    }

}