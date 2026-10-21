import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {AuthInitResponse, LoginRequest, LoginResponse, RegisterResponse, User} from "./auth.interface";
import {AbstractService} from "../abstract/abstract.service";
import {AbstractHttpResponse} from "../abstract/abstract.interface";

@Injectable({providedIn: 'root'})
export class AuthenticationService extends AbstractService {
    public csrfToken: string = '_';

    public getUser(): User {
        let user: any = this.LocalStorageService.getItem('AUTHENTICATIONSERVICE.USER');
        if (!user) {
            this.logout();
            throw new Error("Cannot get a user. Forcing Logout.");
        }
        return user as User;
    }

    public setUser(user: User): void {
        this.LocalStorageService.setItem('AUTHENTICATIONSERVICE.USER', user);
    }

    public login(params: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`/auth/login`, params);
    }

    public register(params: LoginRequest): Observable<RegisterResponse> {
        return this.http.put<RegisterResponse>(`/auth/register`, params);
    }

    public logout(): Observable<AbstractHttpResponse> {
        this.LocalStorageService.clear();
        return this.http.post<AbstractHttpResponse>(`/auth/logout`, {});
    }

    public init(): Observable<AuthInitResponse> {
        return this.http.get<AuthInitResponse>(`/auth/init`);
    }
}