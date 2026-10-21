import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Subscription, SubscriptionForecastResponse, SubscriptionStatsResponse} from "./subscription.interface";
import {LogoService, LogoUploadPrefix} from "../logo/logo.interface";
import {
    ApiAddResponse,
    ApiDeleteResponse,
    ApiIndexResponse,
    ApiPatchResponse,
    ApiPutResponse,
    ApiViewResponse
} from "../abstract/abstract.interface";

@Injectable({providedIn: 'root'})
export class SubscriptionService implements LogoService<Subscription> {
    private readonly http: HttpClient = inject(HttpClient);

    public index(params: any): Observable<ApiIndexResponse<Subscription>> {
        return this.http.get<ApiIndexResponse<Subscription>>(`/subscription/index`, {
            params: params as {} // cast ContactsIndexParams into object
        });
    }

    public add(subscription: Subscription): Observable<ApiAddResponse<Subscription>> {
        return this.http.post<ApiAddResponse<Subscription>>(`/subscription/add`, subscription);
    }

    public view(id: number): Observable<ApiViewResponse<Subscription>> {
        return this.http.get<ApiViewResponse<Subscription>>(`/subscription/view/${id}`);
    }

    public delete(subscription: Subscription): Observable<ApiDeleteResponse<Subscription>> {
        return this.http.delete<ApiDeleteResponse<Subscription>>(`/subscription/delete/${subscription.id}`);
    }

    public patch(subscription: Subscription): Observable<ApiPatchResponse<Subscription>> {
        return this.http.patch<ApiPatchResponse<Subscription>>(`/subscription/edit/${subscription.id}`, subscription);
    }

    public put(subscription: Subscription): Observable<ApiPutResponse<Subscription>> {
        return this.http.put<ApiPutResponse<Subscription>>(`/subscription/edit/${subscription.id}`, subscription);
    }

    public forecast(id?: string): Observable<SubscriptionForecastResponse> {
        return this.http.get<SubscriptionForecastResponse>(`/subscription/forecast/${id}`);
    }

    public deleteLogo(subscription: Subscription): Observable<ApiDeleteResponse<Subscription>> {
        return this.http.delete<ApiDeleteResponse<Subscription>>(`/subscription/delete-logo/${subscription.id}`);
    }

    public uploadLogoUrl(id: number): string {
        return `/subscription/upload-logo/${id}`;
    }

    public hasLogo(subscription: Subscription): boolean {
        return !!subscription.logo;
    }

    /**
     * I will return the URL of the logo of the given subscription. Uploaded logos (prefix `upload/`)
     * are delivered by the backend, all others are static frontend assets.
     */
    public logoUrl(subscription: Subscription): string {
        const logo: string = subscription.logo ?? '';
        if (logo.startsWith(LogoUploadPrefix)) {
            // The file name changes with every upload - use it to bust the browser cache.
            return `/subscription/logo/${subscription.id}?v=${encodeURIComponent(logo.substring(LogoUploadPrefix.length))}`;
        }
        return `/a/assets/images/logos/${logo}`;
    }

    public stats(id?: string): Observable<SubscriptionStatsResponse> {
        return this.http.get<SubscriptionStatsResponse>(`/subscription/statistics/${id}`);
    }
}