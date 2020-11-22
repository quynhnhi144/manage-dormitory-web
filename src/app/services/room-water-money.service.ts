import { Injectable } from '@angular/core';
import { RoomBill } from '../shared/model/room-bill.model';
import { GlobalConstants } from '../common/global-constants';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { WaterBill } from '../shared/model/water-bill.model';
@Injectable({ providedIn: 'root' })
export class RoomWaterMoneyService {
  baseUrl = GlobalConstants.apiURL;
  headers = new HttpHeaders().set('Authorization', 'Bearer ');
  constructor(private http: HttpClient) {}

  addRoomBill(roomBill: RoomBill) {
    let url = this.baseUrl + '/api/detailRooms' + '/new-detail-room';
    return this.http.post(url, roomBill, { headers: this.headers });
  }

  addWaterBill(waterBill: WaterBill) {
    let url = this.baseUrl + '/api/waterBills' + '/new-water-bill';
    return this.http.post(url, waterBill, { headers: this.headers });
  }
}
