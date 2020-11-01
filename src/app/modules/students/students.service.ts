import { Injectable } from '@angular/core';
import { Student } from './student.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from '../../common/global-constants';

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
}
