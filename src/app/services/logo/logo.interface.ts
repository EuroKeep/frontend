import {Observable} from "rxjs";
import {ApiDeleteResponse} from "../abstract/abstract.interface";

// Prefix of uploaded logos in the logo column, must match LogoBehavior::UPLOAD_PREFIX in the backend.
export const LogoUploadPrefix: string = 'upload/';

// Anything that can carry exactly one (uploaded) logo, e.g. a Subscription or a Paymentmethod.
export interface LogoItem {
    id: number
    name: string
}

/**
 * I am implemented by every service whose backend controller offers upload-logo / delete-logo / logo
 * (see LogoBehavior), so the generic <logo-upload> component can work with any of them.
 */
export interface LogoService<T extends LogoItem> {
    hasLogo(item: T): boolean
    logoUrl(item: T): string
    uploadLogoUrl(id: number): string
    deleteLogo(item: T): Observable<ApiDeleteResponse<T>>
}
