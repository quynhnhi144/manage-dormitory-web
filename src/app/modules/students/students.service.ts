import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from '../../common/global-constants';
import { Student } from './student.model';
import { StudentNew } from './student-new.model';
import { InfoSwitchRoom } from '../../shared/model/info-switch-room.model';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  baseUrl = GlobalConstants.apiURL;
  headers = new HttpHeaders().set('Authorization', 'Bearer ');
  constructor(private http: HttpClient) {}

  getAllStudents(
    skip: number,
    take: number,
    searchText: string,
    chooseCampus: string
  ) {
    let url =
      this.baseUrl +
      '/students?' +
      chooseCampus +
      '&skip=' +
      skip +
      '&take=' +
      take +
      '&searchText=' +
      searchText;
    return this.http.get<Student[]>(url);
  }

  getTotalStudents() {
    let url = this.baseUrl + '/students/all';
    return this.http.get<Student[]>(url);
  }

  getAStudent(id: number) {
    let url = this.baseUrl + '/students/' + id;
    return this.http.get<Student>(url);
  }

  updateStudent(id: number, student: any) {
    let url = this.baseUrl + '/students/' + id;
    return this.http.put(url, student);
  }

  addStudent(student: StudentNew) {
    let url = this.baseUrl + '/students/' + 'addStudent';
    return this.http.post<StudentNew>(url, student);
  }

  deleteStudent(id: number) {
    let url = this.baseUrl + '/students/' + id;
    return this.http.delete(url);
  }

  showInfoMoney(idRoom: number) {
    let url =
      this.baseUrl +
      '/students' +
      '/' +
      idRoom +
      '/' +
      'money-room-and-money-water';
    return this.http.get(url);
  }

  changeRoom(oldRoomId: number, newRoomId: number) {
    let url =
      this.baseUrl +
      '/students' +
      '/' +
      'duration_money_between_two_room?' +
      '&oldRoomId=' +
      oldRoomId +
      '&newRoomId=' +
      newRoomId;

    return this.http.get(url);
  }

  switchRoom(idStudent: number, studentSwitchRoom: InfoSwitchRoom) {
    let url = this.baseUrl + '/students' + '/' + idStudent + '/switch-room';
    return this.http.put(url, studentSwitchRoom);
  }
}
