import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from '../common/global-constants';

@Injectable({ providedIn: 'root' })
export class TypeRoomService {
  baseUrl = GlobalConstants.apiURL;
  headers = new HttpHeaders().set('Authorization', 'Bearer ');
  constructor(private http: HttpClient) {}

  getTypeRoomById(id: number) {
    let url = this.baseUrl + '/api/typeRoom/' + id;
    return this.http.get(url, { headers: this.headers });
  }
}
