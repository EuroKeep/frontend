import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Accounttype} from "./accounttype.interface";
import {AbstractService} from "../abstract/abstract.service";
import {
    AbstractHttpResponse,
    ApiAddResponse,
    ApiDeleteResponse,
    ApiIndexResponse,
    ApiPatchResponse,
    ApiPutResponse,
    ApiViewResponse
} from "../abstract/abstract.interface";

@Injectable({providedIn: 'root'})
export class AccounttypeService extends AbstractService {

    public index(): Observable<ApiIndexResponse<Accounttype>> {
        return this.http.get<ApiIndexResponse<Accounttype>>(`/accounttype/index`);
    }

    public view(id: number): Observable<ApiViewResponse<Accounttype>> {
        return this.http.get<ApiViewResponse<Accounttype>>(`/accounttype/view/${id}`);
    }

    public add(accounttype: Accounttype): Observable<ApiAddResponse<Accounttype>> {
        return this.http.post<ApiAddResponse<Accounttype>>(`/accounttype/add`, accounttype);
    }

    public patch(accounttype: Accounttype): Observable<ApiPatchResponse<Accounttype>> {
        return this.http.patch<ApiPatchResponse<Accounttype>>(`/accounttype/edit/${accounttype.id}`, accounttype);
    }

    public put(accounttype: Accounttype): Observable<ApiPutResponse<Accounttype>> {
        return this.http.put<ApiPutResponse<Accounttype>>(`/accounttype/edit/${accounttype.id}`, accounttype);
    }

    public delete(accounttype: Accounttype): Observable<ApiDeleteResponse<AbstractHttpResponse>> {
        return this.http.delete<ApiDeleteResponse<AbstractHttpResponse>>(`/accounttype/delete/${accounttype.id}`);
    }
}
