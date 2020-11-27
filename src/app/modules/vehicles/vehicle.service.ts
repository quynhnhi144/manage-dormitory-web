import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Vehicle } from './vehicle.model';
import { VehicleLeft } from './vehicle-left.model';
import { VehicleNew } from './vehicle-new.model';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  baseUrl = GlobalConstants.apiURL;
  constructor(private http: HttpClient) {}

  getTotalVehicles() {
    let url = this.baseUrl + '/vehicles/all';
    return this.http.get<Vehicle[]>(url);
  }
  getAllVehicle(
    skip: number,
    take: number,
    choosedCampus: string,
    searchText: string,
    typeRoom: string
  ) {
    let url =
      this.baseUrl +
      '/vehicles?' +
      choosedCampus +
      '&skip=' +
      skip +
      '&take=' +
      take +
      typeRoom +
      searchText;
    return this.http.get(url);
  }

  getAVehicle(id: number) {
    let url = this.baseUrl + '/vehicles' + '/' + id;
    return this.http.get(url);
  }

  updateVehicle(id: number, vehicle: Vehicle) {
    let url = this.baseUrl + '/vehicles' + '/' + id;
    return this.http.put(url, vehicle);
  }

  getVehicleWanttoUnactive(vehicleId: number) {
    let url = this.baseUrl + '/vehicles' + '/' + vehicleId + '/vehicleLeft';
    return this.http.get(url);
  }

  unActiveVehicle(vehicleLeft: VehicleLeft) {
    let url = this.baseUrl + '/vehicles' + '/vehicleLeft';
    return this.http.post(url, vehicleLeft);
  }

  getPaymentVehicle(studentId: number) {
    let url = this.baseUrl + '/vehicles' + '/' + studentId + '/paymentVehicle';
    return this.http.get(url);
  }

  addVehicle(vehicleNew: VehicleNew) {
    let url = this.baseUrl + '/vehicles' + '/vehicle';
    return this.http.post(url, vehicleNew);
  }
}
