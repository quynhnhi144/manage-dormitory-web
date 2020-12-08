import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';
import { PowerBill } from './power-bill.model';

@Injectable({
  providedIn: 'root',
})
export class PowerBillsService {
  baseUrl = GlobalConstants.apiURL;
  headers = new HttpHeaders().set('Authorization', 'Bearer ');
  constructor(private http: HttpClient) {}

  getAllPowerBills(
    skip: number,
    take: number,
    currentDate: string,
    chooseCampus: string,
    searchText: string
  ) {
    let url =
      this.baseUrl +
      '/powerBills?' +
      chooseCampus +
      '&skip=' +
      skip +
      '&take=' +
      take +
      searchText +
      '&date=' +
      currentDate;
    return this.http.get(url, { headers: this.headers });
  }

  getAPowerBill(roomId: number, dateString: string) {
    let url = this.baseUrl + '/powerBills/' + roomId + '?&date=' + dateString;
    return this.http.get<PowerBill>(url, { headers: this.headers });
  }

  calculatePowerBill(powerBill: PowerBill) {
    let url = this.baseUrl + '/powerBills' + '/calculate-powerBill';
    return this.http.post(url, powerBill);
  }

  updatePowerBill(idPowerBill: number, newPowerBill: PowerBill) {
    let url = this.baseUrl + '/powerBills' + '/' + idPowerBill;
    return this.http.put(url, newPowerBill);
  }

  newPowerBill(idPowerBill: number, newPowerBill: PowerBill) {
    let url = this.baseUrl + '/powerBills' + '/' + idPowerBill;
    return this.http.post(url, newPowerBill);
  }

  sendMail(roomSendRequest) {
    let url = this.baseUrl + '/powerBills' + '/send-notification';
    return this.http.post(url, roomSendRequest);
  }

  sendMailForAllPowerBills(dateString: string) {
    let url =
      this.baseUrl +
      '/powerBills' +
      '/send-notification-for-powerBills?' +
      '&date=' +
      dateString;
    return this.http.get(url);
  }

  importExcelFile(dateString: string, formData: FormData) {
    let url =
      this.baseUrl + '/powerBills' + '/uploadFile?' + '&date=' + dateString;
    return this.http.post(url, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  exportExcelFile(dateString: string) {
    let url = this.baseUrl + '/powerBills' + '/export?' + '&date=' + dateString;
    return this.http.get(url, { responseType: 'blob' });
  }

  exportPDF(powerBillNew: PowerBill) {
    let url = this.baseUrl + '/powerBills' + '/exportPDF';
    return this.http.post(url, powerBillNew, { responseType: 'blob' });
  }
}
