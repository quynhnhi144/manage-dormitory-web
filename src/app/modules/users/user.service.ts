import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from 'src/app/common/global-constants';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  baseUrl = GlobalConstants.apiURL;
  headers = new HttpHeaders().set('Authorization', 'Bearer ');
  constructor(private htttp: HttpClient) {}

  getTotalUsers() {
    let url = this.baseUrl + '/api/users/all';
    return this.htttp.get<User[]>(url, { headers: this.headers });
  }
}
