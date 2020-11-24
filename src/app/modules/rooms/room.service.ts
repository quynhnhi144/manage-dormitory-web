import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from '../../common/global-constants';
import { Room } from './room.model';
import { StudentLeft } from '../students/student-left.model';

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
      '/rooms?' +
      '&skip=' +
      skip +
      '&take=' +
      take +
      '&searchText=' +
      searchText;
    return this.http.get<Room[]>(url);
  }

  getAllRoomsHaveParam(
    skip: number,
    take: number,
    searchText: string,
    quantityOfRoom: string,
    typeOfRoomId: string,
    campus: string
  ) {
    let url =
      this.baseUrl +
      '/rooms?' +
      '&skip=' +
      skip +
      '&take=' +
      take +
      '&searchText=' +
      searchText +
      quantityOfRoom +
      typeOfRoomId +
      campus;

    return this.http.get<Room[]>(url);
  }

  getDetailRoom(id: number) {
    let url = this.baseUrl + '/rooms' + '/' + id;
    return this.http.get(url);
  }

  getTotalRooms() {
    let url = this.baseUrl + '/rooms/all';
    return this.http.get<Room[]>(url);
  }

  getTotalRemainingRooms() {
    let url = this.baseUrl + '/rooms/remaining-room';
    return this.http.get<Room[]>(url);
  }

  exportExcelFile() {
    let url = this.baseUrl + '/rooms/export';
    return this.http.get(url, { responseType: 'blob' });
  }

  getUpdateRoom(id: number) {
    let url = this.baseUrl + '/rooms' + '/' + id;
    return this.http.get<Room>(url);
  }

  updateRoom(id: number, newRoom: Room) {
    let url = this.baseUrl + '/rooms' + '/' + id;
    return this.http.put(url, newRoom);
  }

  getStudentWanttoUnactive(idStudent: number) {
    let url = this.baseUrl + '/students' + '/' + idStudent + '/studentLeft';
    return this.http.get(url);
  }

  unactiveStudentInRoom(studentLeft: StudentLeft) {
    let url = this.baseUrl + '/students' + '/' + 'studentLeft';
    return this.http.post(url, studentLeft);
  }
}
