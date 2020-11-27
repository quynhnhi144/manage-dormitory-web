import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../common/global-constants';
import { HttpClient } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class PriceList {
  baseUrl = GlobalConstants.apiURL;
  constructor(private http: HttpClient) {}

  getAllPriceList() {
    let url = this.baseUrl + '/priceList';
    return this.http.get(url);
  }
}
