import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../common/global-constants';
import { HttpClient } from '@angular/common/http';
import { PriceList } from './price-list.model';

@Injectable({ providedIn: 'root' })
export class PriceListService {
  baseUrl = GlobalConstants.apiURL;
  constructor(private httpClient: HttpClient) {}

  getAllPriceList(skip: number, take: number, searchText: string) {
    let url =
      this.baseUrl +
      '/price-list?' +
      '&skip=' +
      skip +
      '&take=' +
      take +
      searchText;
    return this.httpClient.get(url);
  }

  getDetailAPriceList(id: number) {
    let url = this.baseUrl + '/price-list' + '/' + id;
    return this.httpClient.get(url);
  }

  updatePriceList(id: number, priceList: PriceList) {
    let url = this.baseUrl + '/price-list' + '/' + id;
    return this.httpClient.put(url, priceList);
  }

  addPriceList(priceList: PriceList) {
    let url = this.baseUrl + '/price-list';
    return this.httpClient.post(url, priceList);
  }
}
