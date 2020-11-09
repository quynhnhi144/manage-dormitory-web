import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from '../../common/global-constants';
import { Student } from './student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  baseUrl = GlobalConstants.apiURL;
  headers = new HttpHeaders().set('Authorization', 'Bearer ');
  constructor(private http: HttpClient) {}

  getAllStudents(skip: number, take: number, searchText: string) {
    let url =
      this.baseUrl +
      '/api/students?' +
      '&skip=' +
      skip +
      '&take=' +
      take +
      '&searchText=' +
      searchText;
    return this.http.get<Student[]>(url, { headers: this.headers });
  }

  getAStudent(id: number) {
    let url = this.baseUrl + '/api/students/' + id;
    return this.http.get<Student>(url, { headers: this.headers });
  }

  updateStudent(id: number, student: any) {
    let url = this.baseUrl + '/api/students/' + id;
    return this.http.put(url, student, { headers: this.headers });
  }

  deleteStudent(id: number) {
    let url = this.baseUrl + '/api/students/' + id;
    return this.http.delete(url, { headers: this.headers });
  }
}
