import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {
    Transaction,
    TransactionIndexResponse,
    TransactionMappingResponse,
    TransactionStreamResponse
} from "./transaction.interface";
import {
    AbstractHttpResponse,
    ApiAddResponse,
    ApiIndexResponse,
    ApiPatchResponse,
    ApiPutResponse,
    ApiViewResponse
} from "../abstract/abstract.interface";
import {AbstractService} from "../abstract/abstract.service";
import {HttpContext} from "@angular/common/http";
import {SKIP_NOT_FOUND_REDIRECT} from "../../auth/auth.interceptor";

@Injectable({providedIn: 'root'})
export class TransactionService extends AbstractService {

    /**
     * I will fetch you all Transactions, the user has access to.
     * @see https://docs.eurokeep.io/api/transaction/#index
     * @param params
     */
    public index(params: any): Observable<TransactionIndexResponse> {
        return this.http.get<TransactionIndexResponse>(`/transactions/index`, {
            params
        });
    }

    /**
     * I fetch the Transaction identified by the given transactionId.
     * @see https://docs.eurokeep.io/api/transaction/#view
     * @param transactionId
     */
    public view(transactionId: number): Observable<ApiViewResponse<Transaction>> {
        return this.http.get<ApiViewResponse<Transaction>>(`/transactions/view/${transactionId}`);
    }

    /**
     * I will have the API create the given Transaction.
     * @see https://docs.eurokeep.io/api/transaction/#add
     * @param transaction
     */
    public add(transaction: Transaction): Observable<ApiAddResponse<Transaction>> {
        return this.http.post<ApiAddResponse<Transaction>>(`/transactions/add`, transaction);
    }


    public delete(transaction: Transaction): Observable<ApiViewResponse<AbstractHttpResponse>> {
        return this.http.delete<ApiViewResponse<AbstractHttpResponse>>(`/transactions/delete/${transaction.id}`);
    }

    public patch(transaction: Transaction): Observable<ApiPatchResponse<Transaction>> {
        return this.http.patch<ApiPatchResponse<Transaction>>(`/transactions/edit/${transaction.id}`, transaction);
    }

    public put(transaction: Transaction): Observable<ApiPutResponse<Transaction>> {
        return this.http.put<ApiPutResponse<Transaction>>(`/transactions/edit/${transaction.id}`, transaction);
    }

    /**
     * I will return the TransactionStream that matches the given parameters.
     * @see https://docs.eurokeep.io/api/transaction/#stream
     * @param accountId
     * @param params
     */
    public stream(accountId: number, params: object): Observable<TransactionStreamResponse> {
        return this.http.get<TransactionStreamResponse>(`/transactions/stream/${accountId}`, {
            params: params as {} // cast ContactsIndexParams into object
        });
    }

    /**
     * I will try find a category that exists for the given comment.
     * @see https://docs.eurokeep.io/api/transaction/#mapping
     * @param comment
     */
    public mapping(comment: string): Observable<TransactionMappingResponse> {
        // 404 = no matching transaction, an expected answer here: do not redirect to the error page.
        return this.http.post<TransactionMappingResponse>(`/transactions/mapping`, {
            "comment": comment
        }, {
            context: new HttpContext().set(SKIP_NOT_FOUND_REDIRECT, true)
        });
    }

}