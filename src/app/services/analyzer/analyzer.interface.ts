import {Transaction} from "../transaction/transaction.interface";
import {ApiIndexResponse} from "../abstract/abstract.interface";

export interface AnalysisApiResponse<T> extends ApiIndexResponse<T> {
    transactions: Transaction[]
}

export interface AnalysisByCategory {
    name: string,
    value: number,
    id: number
}
