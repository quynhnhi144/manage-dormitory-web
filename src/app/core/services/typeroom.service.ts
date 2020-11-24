import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from '../../common/global-constants';

@Injectable({ providedIn: 'root' })
export class TypeRoomService {
  baseUrl = GlobalConstants.apiURL;
  constructor(private http: HttpClient) {}

  getTypeRoomById(id: number) {
    let url = this.baseUrl + '/typeRoom/' + id;
    return this.http.get(url);
  }
}
