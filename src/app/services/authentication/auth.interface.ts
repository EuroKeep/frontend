import {GenericValidationError} from "../../generic-responses";
import {AbstractHttpResponse} from "../abstract/abstract.interface";

export interface LoginRequest {
    username: string
    password: string
    remember: boolean
}

export interface AuthInitResponse extends AbstractHttpResponse {
    enable_registration: boolean
}

export interface RegisterResponse extends AbstractHttpResponse{
    success: boolean
}

export interface LoginResponse {
    success: boolean
    user: User
    errors?: {
        [key: string]: string[]
    } | GenericValidationError
}

export interface User {
    id: number
    created: string
    modified: string
    flags: number
    settings: UserSettings
    name: string
    email: string
}

export interface UserSettings {
    helpDisplay: boolean
}
