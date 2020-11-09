import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GlobalConstants } from '../../common/global-constants';
import { CampusService } from '../../services/campus.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { PowerBillsService } from './power-bills.service';
import { PowerBill } from './power-bill.model';

@Component({
  selector: 'app-power-bills',
  templateUrl: './power-bills.component.html',
  styleUrls: ['./power-bills.component.scss'],
})
export class PowerBillsComponent implements OnInit {
  rooms = [];
  roomTotal = 5;
  campusIndex = 0;
  campusType = 'all';
  page: number = 1;
  skip = 0;
  pageSize = 10;
  campuses;
  searchText = '';
  isClickSearch = false;
  currentRoomId = 0;

  modalRoomPowerBill = new PowerBill();
  modalOption: NgbModalOptions = {};

  constructor(
    private httpClient: HttpClient,
    private campusService: CampusService,
    private modalService: NgbModal,
    private powerBillsService: PowerBillsService
  ) {}

  ngOnInit(): void {
    this.getAllCampuses();
    this.getAllPowerBills(0, 'all', 1);
  }

  getAllCampuses() {
    this.campusService.getAllCampuses().subscribe(
      (data: any) => {
        this.campuses = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAllPowerBills(campusIndex, campusType, page = 1) {
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
    url +=
      '/api/powerBills?' +
      choosedCampus +
      '&skip=' +
      this.skip +
      '&take=' +
      this.pageSize;

    this.httpClient.get(url, { headers }).subscribe(
      (data: any) => {
        console.log(data);
        this.rooms = data.data.data;
        this.roomTotal = data.total;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  resetPage() {
    this.page = 1;
    this.getAllPowerBills(this.campusIndex, this.campusType);
  }

  changePage(pageNumber: number) {
    this.page = pageNumber;
    this.getAllPowerBills(this.campusIndex, this.campusType, pageNumber);
  }

  onSearch(event) {
    this.isClickSearch = true;
    this.getAllPowerBills(this.campusIndex, this.campusType);
  }

  // open modal
  openModal(modalName) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(modalName, this.modalOption);
  }

  // modal power bill detail
  openModalDetailAPowerBill(modalDetailAPowerBill, room: PowerBill) {
    this.currentRoomId = room.roomDto.id;
    this.getDetailAPowerBill();
    this.openModal(modalDetailAPowerBill);
  }

  getDetailAPowerBill() {
    this.powerBillsService.getAPowerBill(this.currentRoomId).subscribe(
      (data: any) => {
        console.log('detail power bill: ', data);
        this.modalRoomPowerBill = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openModalUpdateAStudent(modalUpdateAPowerBill, room: any) {}
}

// (data: any) => {
//   this.modalRoomPowerBill = new PowerBill({
//     roomDto: data.roomDto,
//     billId: data.billId,
//     startDate: data.startDate,
//     endDate: data.endDate,
//     numberOfPowerBegin: data.numberOfPowerBegin,
//     numberOfPowerEnd: data.numberOfPowerEnd,
//     numberOfPowerUsed: data.numberOfPowerUsed,
//     priceAKWH: data.priceAKWH,
//     numberOfMoneyMustPay: data.numberOfMoneyMustPay,
//     pay: data.pay,
//   });
// }
