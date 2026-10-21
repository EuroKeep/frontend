import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Category, CategoryMove, CategoryTreeResponse} from "./category.interface";
import {AbstractService} from "../abstract/abstract.service";
import {
    AbstractHttpResponse,
    ApiAddResponse,
    ApiDeleteResponse,
    ApiEditResponse,
    ApiIndexResponse,
    ApiPatchResponse,
    ApiPutResponse,
    ApiViewResponse
} from "../abstract/abstract.interface";

@Injectable({providedIn: 'root'})
export class CategoryService extends AbstractService {

    public index(): Observable<ApiIndexResponse<Category>> {
        return this.http.get<ApiIndexResponse<Category>>(`/categories/index`);
    }

    public tree(): Observable<CategoryTreeResponse> {
        return this.http.get<CategoryTreeResponse>(`/categories/tree`);
    }

    public view(id: number): Observable<ApiViewResponse<Category>> {
        return this.http.get<ApiViewResponse<Category>>(`/categories/view/${id}`);
    }

    public add(category: Category): Observable<ApiAddResponse<Category>> {
        return this.http.post<ApiAddResponse<Category>>(`/categories/add`, category);
    }

    public patch(category: Category): Observable<ApiPatchResponse<Category>> {
        return this.http.patch<ApiPatchResponse<Category>>(`/categories/edit/${category.id}`, category);
    }

    public put(category: Category): Observable<ApiPutResponse<Category>> {
        return this.http.put<ApiPutResponse<Category>>(`/categories/edit/${category.id}`, category);
    }

    public delete(category: Category): Observable<ApiDeleteResponse<AbstractHttpResponse>> {
        return this.http.delete<ApiDeleteResponse<AbstractHttpResponse>>(`/categories/delete/${category.id}`);
    }

    public move(category: Category, move: CategoryMove): Observable<ApiEditResponse<Category>> {
        return this.http.patch<ApiEditResponse<Category>>(`/categories/move/${category.id}`, move);
    }
}
