import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from '../common/global-constants';

@Injectable({ providedIn: 'root' })
export class CampusService {
  baseUrl = GlobalConstants.apiURL;
  headers = new HttpHeaders().set('Authorization', 'Bearer ');
  constructor(private http: HttpClient) {}

  getAllCampuses() {
    let url = this.baseUrl + '/api/campuses/';
    return this.http.get(url, { headers: this.headers });
  }
}
