import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from '../../common/global-constants';
import { Room } from './room.model';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  baseUrl = GlobalConstants.apiURL;
  headers = new HttpHeaders().set('Authorization', 'Bearer ');
  constructor(private http: HttpClient) {}

  getAllRooms(skip: number, take: number, searchText: string) {
    let url =
      this.baseUrl +
      '/api/rooms?' +
      '&skip=' +
      skip +
      '&take=' +
      take +
      '&searchText=' +
      searchText;

    return this.http.get<Room[]>(url, { headers: this.headers });
  }

  getTotalRooms() {
    let url = this.baseUrl + '/api/rooms/all';
    return this.http.get<Room[]>(url, { headers: this.headers });
  }

  getTotalRemainingRooms() {
    let url = this.baseUrl + '/api/rooms/remaining-room';
    return this.http.get<Room[]>(url, { headers: this.headers });
  }

  // getAStudent(id: number) {
  //   let url = this.baseUrl + '/api/students/' + id;
  //   return this.http.get<Student>(url, { headers: this.headers });
  // }

  // updateStudent(id: number, student: Student) {
  //   let url = this.baseUrl + '/api/students/' + id;
  //   return this.http.post(url, student, { headers: this.headers });
  // }
}
