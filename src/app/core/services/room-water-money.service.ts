import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from '../../common/global-constants';
import { RoomBill } from '../../shared/model/room-bill.model';
import { WaterBill } from '../../shared/model/water-bill.model';
@Injectable({ providedIn: 'root' })
export class RoomWaterMoneyService {
  baseUrl = GlobalConstants.apiURL;
  constructor(private http: HttpClient) {}

  addRoomBill(roomBill: RoomBill) {
    let url = this.baseUrl + '/detailRooms' + '/new-detail-room';
    return this.http.post(url, roomBill);
  }

  addWaterBill(waterBill: WaterBill) {
    let url = this.baseUrl + '/waterBills' + '/new-water-bill';
    return this.http.post(url, waterBill);
  }
}
