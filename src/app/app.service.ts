import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private baseUrl = 'http://localhost:3000/api/v1';
  constructor(public http: HttpClient, public cookie: CookieService) {}

  public getUserInfoFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  }
  public setUserInfoInLocalStorage = data => {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }

  signUp(data: any): Observable<any> {
    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('userName', data.userName)
      .set('password', data.password)
      .set('email', data.email)
      .set('isAdmin', data.isAdmin);
    return this.http.post(`${this.baseUrl}/users/signup`, params);
  }
  signinFunction(data: any): Observable<any> {
    const params = new HttpParams()
      .set('userName', data.userName)
      .set('password', data.password);
    return this.http.post(`${this.baseUrl}/users/login`, params);
  }
  public logout(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', this.cookie.get('authtoken'));
    return this.http.post(`${this.baseUrl}/users/logout`, params);
  }
}
