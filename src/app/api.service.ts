import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http'


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //local api url to be run with proxy config
  // private userUrl = '/api/v1/user'
  // private meetingUrl = '/api/v1/event'

  //live api url
  private userUrl:string = 'http://meetingapi.ekantchawla.me/api/v1/user'
  private meetingUrl:string = 'http://meetingapi.ekantchawla.me/api/v1/event'

  constructor(private _http: HttpClient) { }

  // user related apis
  login(email, password) {
    return this._http.post(this.userUrl + '/login', { email, password })
  }

  signup(email: String, password: String, firstName: String, phone: String, countryCode: String, userName: String, lastName?: String) {
    let body = { email, password, firstName, phone, countryCode, userName }
    if (lastName && lastName.trim() != '') body['lastName'] = lastName
    return this._http.post(this.userUrl + '/signup', body)
  }

  forgotPassword(email: String) {
    return this._http.post(this.userUrl + '/forgotPass', { email })
  }

  resetPassword(authToken: String, password: String) {
    return this._http.post(this.userUrl + '/updatePass', { authToken, password })
  }

  listUsers(page: Number) {
    let authToken = localStorage.getItem('authToken')
    let body = { authToken, page }
    return this._http.post(this.userUrl + '/listUsers', body)
  }

  // Todo related apis
  createMeeting(userId: String, title: String, description: String, location: String, start: String, end: String, importance: Number) {
    let authToken = localStorage.getItem('authToken')
    let body = { authToken, userId, title, description, location, start, end, importance }
    return this._http.post(this.meetingUrl + '/create', body)
  }

  listMeeting(userId: String, month: Number) {
    let authToken = localStorage.getItem('authToken')
    let body = { authToken, userId, month }
    return this._http.post(this.meetingUrl + '/list', body)
  }

  deleteMeeting(eventId: String) {
    let authToken = localStorage.getItem('authToken')
    let body = { authToken, eventId }
    return this._http.post(this.meetingUrl + '/delete', body)
  }

  editMeeting(eventId: String, title: String, description: String, location: String, start: String, end: String, importance: Number) {
    let authToken = localStorage.getItem('authToken')
    let body = { authToken, eventId, title, description, location, start, end, importance }
    return this._http.post(this.meetingUrl + '/edit', body)
  }



}
