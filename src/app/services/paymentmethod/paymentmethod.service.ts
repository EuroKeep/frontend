import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Paymentmethod} from "./paymentmethod.interface";
import {AbstractService} from "../abstract/abstract.service";
import {LogoService, LogoUploadPrefix} from "../logo/logo.interface";
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
export class PaymentmethodService extends AbstractService implements LogoService<Paymentmethod> {

    // params.all = 1 also lists inactive payment methods
    public index(params: any = {}): Observable<ApiIndexResponse<Paymentmethod>> {
        return this.http.get<ApiIndexResponse<Paymentmethod>>(`/paymentMethod/index`, {params});
    }

    public view(id: number): Observable<ApiViewResponse<Paymentmethod>> {
        return this.http.get<ApiViewResponse<Paymentmethod>>(`/paymentMethod/view/${id}`);
    }

    public add(paymentmethod: Paymentmethod): Observable<ApiAddResponse<Paymentmethod>> {
        return this.http.post<ApiAddResponse<Paymentmethod>>(`/paymentMethod/add`, paymentmethod);
    }

    public patch(paymentmethod: Paymentmethod): Observable<ApiPatchResponse<Paymentmethod>> {
        return this.http.patch<ApiPatchResponse<Paymentmethod>>(`/paymentMethod/edit/${paymentmethod.id}`, paymentmethod);
    }

    public put(paymentmethod: Paymentmethod): Observable<ApiPutResponse<Paymentmethod>> {
        return this.http.put<ApiPutResponse<Paymentmethod>>(`/paymentMethod/edit/${paymentmethod.id}`, paymentmethod);
    }

    public delete(paymentmethod: Paymentmethod): Observable<ApiDeleteResponse<AbstractHttpResponse>> {
        return this.http.delete<ApiDeleteResponse<AbstractHttpResponse>>(`/paymentMethod/delete/${paymentmethod.id}`);
    }

    public deleteLogo(paymentmethod: Paymentmethod): Observable<ApiDeleteResponse<Paymentmethod>> {
        return this.http.delete<ApiDeleteResponse<Paymentmethod>>(`/paymentMethod/delete-logo/${paymentmethod.id}`);
    }

    public uploadLogoUrl(id: number): string {
        return `/paymentMethod/upload-logo/${id}`;
    }

    /**
     * No icons are shipped, so only uploaded images (prefix `upload/`) count as logo.
     */
    public hasLogo(paymentmethod: Paymentmethod): boolean {
        return (paymentmethod.image ?? '').startsWith(LogoUploadPrefix);
    }

    /**
     * I will return the URL of the uploaded image of the given payment method. Check hasLogo() first.
     */
    public logoUrl(paymentmethod: Paymentmethod): string {
        const image: string = paymentmethod.image ?? '';
        // The file name changes with every upload - use it to bust the browser cache.
        return `/paymentMethod/logo/${paymentmethod.id}?v=${encodeURIComponent(image.substring(LogoUploadPrefix.length))}`;
    }
}
