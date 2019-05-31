import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from './api-variables';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

const url = API_CONFIG.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  get_public(): Observable<any> {
    return this.http.get<any>(`${url}`);
  }

  get_user(): Observable<any> {
    return this.http.get<any>(`${url}/user`);
  }

  get_admin(): Observable<any> {
    return this.http.get<any>(`${url}/admin`);
  }
}
