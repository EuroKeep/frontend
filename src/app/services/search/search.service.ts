import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SearchApiResponse} from "./search.interface";

@Injectable({providedIn: 'root'})
export class SearchService {
    private readonly http: HttpClient = inject(HttpClient);

    public search(searchString: string): Observable<SearchApiResponse> {
        return this.http.get<SearchApiResponse>(`/search/everywhere?query=${searchString}`);
    }

}