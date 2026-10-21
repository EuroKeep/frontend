import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AbstractService} from "../abstract/abstract.service";
import {AnalysisApiResponse, AnalysisByCategory} from "./analyzer.interface";

@Injectable({providedIn: 'root'})
export class AnalyzerService extends AbstractService {

    public index(params: any): Observable<AnalysisApiResponse<AnalysisByCategory>> {
        return this.http.get<AnalysisApiResponse<AnalysisByCategory>>(`/analyzer/category`, {params});
    }
}