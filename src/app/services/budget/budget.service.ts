import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Budget, BudgetTotal} from "./budget.interface";
import {
    ApiAddResponse,
    ApiDeleteResponse,
    ApiIndexResponse,
    ApiPatchResponse,
    ApiPutResponse,
    ApiViewResponse
} from "../abstract/abstract.interface";

@Injectable({providedIn: 'root'})
export class BudgetService {
    private readonly http: HttpClient = inject(HttpClient);

    public index(): Observable<ApiIndexResponse<Budget>> {
        return this.http.get<ApiIndexResponse<Budget>>(`/budget/index`);
    }

    public list(params: any): Observable<ApiIndexResponse<Budget>> {
        return this.http.get<ApiIndexResponse<Budget>>(`/budget/list`, {
            params: params as {} // cast ContactsIndexParams into object
        });
    }

    public total(params: any): Observable<ApiViewResponse<BudgetTotal>> {
        return this.http.get<ApiViewResponse<BudgetTotal>>(`/budget/total`, {
            params: params as {} // cast ContactsIndexParams into object
        });
    }

    public view(id: number): Observable<ApiViewResponse<Budget>> {
        return this.http.get<ApiViewResponse<Budget>>(`/budget/view/${id}`);
    }

    public delete(budget: Budget): Observable<ApiDeleteResponse<Budget>> {
        return this.http.delete<ApiDeleteResponse<Budget>>(`/budget/delete/${budget.id}`);
    }

    public add(budget: Budget): Observable<ApiAddResponse<Budget>> {
        return this.http.post<ApiAddResponse<Budget>>(`/budget/add`, budget);
    }

    public put(budget: Budget): Observable<ApiPutResponse<Budget>> {
        return this.http.put<ApiPutResponse<Budget>>(`/budget/edit/${budget.id}`, budget);
    }

    public patch(budget: Budget): Observable<ApiPatchResponse<Budget>> {
        return this.http.patch<ApiPatchResponse<Budget>>(`/budget/edit/${budget.id}`, budget);
    }

}