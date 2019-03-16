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
  public setUserInfoInLocalStorage = (data: any) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }

  signUp(data: any) {
    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('userName', data.userName)
      .set('password', data.password)
      .set('email', data.email)
      .set('isAlumni', data.isAlumni);
    return this.http.post(`${this.baseUrl}/users/signup`, params);
  }
  signinFunction(data: any) {
    const params = new HttpParams()
      .set('userName', data.userName)
      .set('password', data.password);
    return this.http.post(`${this.baseUrl}/users/login`, params);
  }
  public logout(data: any) {
    const params = new HttpParams()
      .set('authToken', data.authToken);
    return this.http.post(`${this.baseUrl}/users/${data.userId}/logout`, params);
  }

  getUserMeeting(data: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/meetings/view/all/meetings/${data.userId}/${data.authToken}`)
  }

  addNewMeeting(data: any) {
    const params = new HttpParams()
     .set('studentId', data.studentId)
     .set('studentName', data.studentName)
     .set('meetingDate', data.meetingDate)
     .set('meetingStartTime', data.meetingStartTime)
     .set('meetingEndTime', data.meetingEndTime)
     .set('authToken', data.authToken)
    return this.http.post(`${this.baseUrl}/meetings/addMeeting`, params);
  }
  checkPendingMeetings(authToken: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/meetings/check/pending/meetings?authToken=${authToken}`)
  }

  listAllMeetings(authToken: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/meetings/get/all/meetings?authToken=${authToken}`)
  }

  updateMeeting(data: any) {
    const params = new HttpParams()
    .set('authToken', data.authToken)
    .set('isAccepted', data.isAccepted)
    return this.http.put(`${this.baseUrl}/meetings/${data.meetingId}/updateMeeting`, params)
  }
  deleteMeeting(data: any) {
    const params = new HttpParams()
    .set('authToken', data.authToken)
      return this.http.post(`${this.baseUrl}/meetings/${data.meetingId}/delete`, params)
  }
}
