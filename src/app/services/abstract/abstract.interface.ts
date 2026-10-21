import {GenericValidationError} from "../../generic-responses";

export interface AbstractHttpResponse {
    success: boolean
    error?: GenericValidationError | string[]
}

export interface ApiIndexResponse<T> extends AbstractHttpResponse {
    items: T[]
}

export interface ApiItemResponse<T> extends AbstractHttpResponse {
    item: T
}

// The backend returns the same {item, success, error} shape for add/view/edit/delete —
// kept as separate names so call sites stay self-documenting about which action they call.
export type ApiAddResponse<T> = ApiItemResponse<T>;
export type ApiViewResponse<T> = ApiItemResponse<T>;
export type ApiDeleteResponse<T> = ApiItemResponse<T>;
export type ApiEditResponse<T> = ApiItemResponse<T>;
export type ApiPatchResponse<T> = ApiItemResponse<T>;
export type ApiPutResponse<T> = ApiItemResponse<T>;

export interface AbstractObject {
    id: number
    created: string
    modified: string
    flags: number
}

export interface CrudService {
    index(params: any): any
}
