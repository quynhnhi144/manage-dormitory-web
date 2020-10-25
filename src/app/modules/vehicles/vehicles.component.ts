import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from '../../common/global-constants';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss'],
})
export class VehiclesComponent implements OnInit {
  vehicles;
  vehicleTotal = 5;
  campusIndex = 0;
  campusType = 'all';
  page: number = 1;
  skip = 0;
  pageSize = 10;
  campuses;
  searchText = '';

  isClickSearch = false;
  isClickBtnTypeVehicle = false;
  typeOfVehicleList = ['All', 'MotorBike', 'Bicycle'];
  typeOfVehicle = '';
  //modal
  modalVehicle = {
    id: 1,
    licensePlates: 'BK-1',
    typeVehicle: 'Bicycle',
    studentId: 5,
    studentName: 'Nguyễn Như Yến',
    roomName: 'A103',
    campusName: 'Campus A',
    userManager: 'Nguyễn Văn A',
    isPayVehicleBill: true,
  };
  message = '';
  currentVehicleId = 0;

  constructor(private httpClient: HttpClient, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getAllCampuses();
    this.getAllVehicle(0, 'all', 1);
  }

  getAllCampuses() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ');
    let url = GlobalConstants.apiURL;
    url += '/api/campuses';
    this.httpClient.get(url, { headers }).subscribe(
      (data: any) => {
        this.campuses = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAllVehicle(campusIndex, campusType, page = 1) {
    this.campusIndex = campusIndex;
    this.campusType = campusType;
    let choosedCampus = '';

    if (campusType !== 'all') {
      choosedCampus = '&campusName=' + campusType;
    }

    this.page = page;
    const headers = new HttpHeaders().set('Authorization', 'Bearer ');
    let url = GlobalConstants.apiURL;
    this.skip = (page - 1) * this.pageSize;
    let paramSearchText = this.isClickSearch
      ? `&searchText=${this.searchText}`
      : ``;

    let paramTypeRoom = this.isClickBtnTypeVehicle
      ? `&typeVehicle=${this.typeOfVehicle}`
      : ``;

    url +=
      '/api/vehicles?' +
      choosedCampus +
      '&skip=' +
      this.skip +
      '&take=' +
      this.pageSize +
      paramTypeRoom +
      paramSearchText;

    this.httpClient.get(url, { headers }).subscribe(
      (data: any) => {
        console.log(data);
        this.vehicles = data.data.data;
        console.log('vehicles:', this.vehicles);
        this.vehicleTotal = data.total;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSearch(event) {
    this.isClickSearch = true;
    this.getAllVehicle(this.campusIndex, this.campusType);
  }

  resetPage() {
    this.page = 1;
    this.getAllVehicle(this.campusIndex, this.campusType);
  }

  changePage(pageNumber: number) {
    this.page = pageNumber;
    this.getAllVehicle(this.campusIndex, this.campusType, pageNumber);
  }

  resetPageByTypeOfVehicle(typeOfVehicle: string) {
    this.isClickBtnTypeVehicle = true;
    this.typeOfVehicle = typeOfVehicle;
    this.getAllVehicle(this.campusIndex, this.campusType);
  }

  // open modal
  openModal(modalName) {
    this.modalService.open(modalName);
  }

  // modal room detail
  openModalDetailVehicle(modalDetailAVehicle, vehicle: any) {
    this.currentVehicleId = vehicle.id;
    this.getDetailAVehicle();
    this.openModal(modalDetailAVehicle);
  }

  getDetailAVehicle() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ');
    console.log(this.currentVehicleId);
    let url = GlobalConstants.apiURL + '/api/vehicles/' + this.currentVehicleId;
    this.httpClient.get(url, { headers }).subscribe(
      (data: any) => {
        console.log('detailStudent: ', data);
        this.modalVehicle = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // modal update room
  openModalUpdateARoom(modalUpdateAStudent, vehicle: any) {
    this.currentVehicleId = vehicle.id;
    this.openModal(modalUpdateAStudent);
  }
}
