import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';

@Injectable({
  providedIn: 'root',
})
export class PowerBillsService {
  baseUrl = GlobalConstants.apiURL;
  headers = new HttpHeaders().set('Authorization', 'Bearer ');
  constructor(private http: HttpClient) {}

  getAllPowerBills(skip: number, take: number, searchText: string) {
    let url =
      this.baseUrl +
      '/api/powerBills?' +
      '&skip=' +
      skip +
      '&take=' +
      take +
      searchText;
  }

  getAPowerBill(roomId: number, date: Date) {
    let url =
      this.baseUrl +
      '/api/powerBills/' +
      roomId +
      '?&date=' +
      encodeURIComponent(date.toISOString());
    return this.http.get(url, { headers: this.headers });
  }
}
