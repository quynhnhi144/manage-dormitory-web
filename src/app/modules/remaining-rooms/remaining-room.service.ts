import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../common/global-constants';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { StudentNew } from '../students/student-new.model';
@Injectable({
  providedIn: 'root',
})
export class RemainingRoomService {
  baseUrl = GlobalConstants.apiURL;
  headers = new HttpHeaders().set('Authorization', 'Bearer ');
  constructor(private http: HttpClient) {}

  getAllRegisterRoom(
    skip: number,
    take: number,
    choosedCampus: string,
    searchText: string
  ) {
    let url =
      this.baseUrl +
      '/registerRooms?' +
      '&skip=' +
      skip +
      '&take=' +
      take +
      choosedCampus +
      searchText;
    return this.http.get(url);
  }

  getDetailRegisterRoom(id: number) {
    let url = this.baseUrl + '/registerRooms' + '/' + id;
    return this.http.get(url);
  }

  addStudentFromRegisterRoom(registerRoomId: number, studentNew: StudentNew) {
    let url =
      this.baseUrl +
      '/registerRooms' +
      '/' +
      registerRoomId +
      '/' +
      'addStudent';
    return this.http.post(url, studentNew);
  }

  deleteRegisterRoom(id: number) {
    let url = this.baseUrl + '/registerRooms' + '/' + id;
    return this.http.delete(url);
  }

  sendMailSuccessFullyAddStudentFromRegistering(studentNew: StudentNew) {
    let url =
      this.baseUrl +
      '/registerRooms' +
      '/sendMail' +
      '/notification-about-successfully-register';
    return this.http.post(url, studentNew);
  }

  sendMailRejectRegisterRoom() {
    let url =
      this.baseUrl +
      '/registerRooms' +
      '/sendMail' +
      '/notification-about-delete-register-room';
    return this.http.get(url);
  }
}
