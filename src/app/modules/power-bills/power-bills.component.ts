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
  modalRoomPowerBillUpdate = new PowerBill();

  modalOption: NgbModalOptions = {};

  messageMail = null;
  isSent = false;

  modalUpdatePowerBillError = null;
  currentDate = new Date();

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
    let paramSearchText = this.isClickSearch
      ? `&searchText=${this.searchText}`
      : ``;
    url +=
      '/api/powerBills?' +
      choosedCampus +
      '&skip=' +
      this.skip +
      '&take=' +
      this.pageSize +
      paramSearchText +
      '&date=' +
      encodeURIComponent(this.currentDate.toISOString());

    console.log('url: ', url);

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

  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
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
    this.currentRoomId = room.detailRoomDto.id;
    this.getDetailAPowerBill();
    this.openModal(modalDetailAPowerBill);
  }

  getDetailAPowerBill() {
    this.powerBillsService
      .getAPowerBill(this.currentRoomId, this.currentDate)
      .subscribe((data: any) => {
        console.log('detail power bill: ', data);
        this.modalRoomPowerBill = data;
      });
  }

  openModalUpdateAStudent(modalUpdateAPowerBill, room: any) {
    this.currentRoomId = room.detailRoomDto.id;
    this.getPowerBillUpdate();
    this.openModal(modalUpdateAPowerBill);
  }

  getPowerBillUpdate() {
    this.powerBillsService
      .getAPowerBill(this.currentRoomId, this.currentDate)
      .subscribe(
        (data: any) => {
          console.log('detail power bill: ', data);
          this.modalRoomPowerBillUpdate = new PowerBill({
            detailRoomDto: data.detailRoomDto,
            billId: data.billId,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            numberOfPowerBegin: data.numberOfPowerBegin,
            numberOfPowerEnd: data.numberOfPowerEnd,
            numberOfPowerUsed: data.numberOfPowerUsed,
            priceAKWH: data.priceAKWH,
            numberOfMoneyMustPay: data.numberOfMoneyMustPay,
            pay: data.pay,
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }

  changeStatusPayment(modalRoomPowerBillUpdate) {
    modalRoomPowerBillUpdate.pay = !modalRoomPowerBillUpdate.pay;
  }

  saveUpdate() {
    if (!this.modalRoomPowerBillUpdate.startDate) {
      this.modalUpdatePowerBillError = 'Start Date is required';
      this.turnOffNotification();
      return;
    }

    if (!this.modalRoomPowerBillUpdate.endDate) {
      this.modalUpdatePowerBillError = 'End Date is required';
      this.turnOffNotification();
      return;
    }

    if (this.modalRoomPowerBillUpdate.numberOfPowerBegin == null) {
      this.modalUpdatePowerBillError = 'Number of Power Begin is required';
      this.turnOffNotification();
      return;
    }

    if (this.modalRoomPowerBillUpdate.numberOfPowerEnd == null) {
      this.modalUpdatePowerBillError = 'Number of Power End is required';
      this.turnOffNotification();
      return;
    }

    if (this.modalRoomPowerBillUpdate.numberOfPowerUsed == null) {
      this.modalUpdatePowerBillError = 'Number of Power Used is required';
      this.turnOffNotification();
      return;
    }

    const headers = new HttpHeaders().set('Authorization', 'Bearer ');
    let url = GlobalConstants.apiURL;
    url += '/api/powerBills/' + this.currentRoomId;
    this.httpClient
      .put(url, this.modalRoomPowerBillUpdate, { headers })
      .subscribe(
        (data: any) => {
          let index = this.rooms.findIndex(
            (room) => room.detailRoomDto.id === this.currentRoomId
          );
          this.rooms[index] = data;
          this.modalService.dismissAll();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  sendMail(room: PowerBill) {
    let roomSendRequest = {
      detailRoomDto: room.detailRoomDto,
      billId: room.billId,
      startDate: new Date(room.startDate),
      endDate: new Date(room.endDate),
      numberOfPowerBegin: room.numberOfPowerBegin,
      numberOfPowerEnd: room.numberOfPowerEnd,
      numberOfPowerUsed: room.numberOfPowerUsed,
      priceAKWH: room.priceAKWH,
      numberOfMoneyMustPay: room.numberOfMoneyMustPay,
      pay: room.pay,
    };
    const headers = new HttpHeaders().set('Authorization', 'Bearer ');
    let url = GlobalConstants.apiURL;
    url += '/api/powerBills/send-notification';

    this.httpClient.post(url, roomSendRequest, { headers }).subscribe(
      (data: any) => {
        this.isSent = true;
        this.messageMail = 'Mail sent successfully!!!';
        setTimeout(() => {
          this.messageMail = '';
        }, 5000);
        console.log('mail: ' + data.message);
      },
      (error) => {
        this.isSent = false;
        this.messageMail =
          'Error! An error occurred. Please try again later!!!';
        setTimeout(() => {
          this.messageMail = '';
        }, 5000);
        console.log(error);
      }
    );
  }

  changeNumberOfPowerUsed() {
    if (
      this.modalRoomPowerBillUpdate.numberOfPowerBegin >
      this.modalRoomPowerBillUpdate.numberOfPowerEnd
    ) {
      this.modalUpdatePowerBillError =
        'Number of Power Begin cannot bigger than End';
      this.turnOffNotification();
      return;
    } else {
      this.modalRoomPowerBillUpdate.numberOfPowerUsed =
        this.modalRoomPowerBillUpdate.numberOfPowerEnd -
        this.modalRoomPowerBillUpdate.numberOfPowerBegin;

      const headers = new HttpHeaders().set('Authorization', 'Bearer ');
      let url = GlobalConstants.apiURL;
      url += '/api/powerBills/calculate-powerBill';
      this.httpClient
        .post(url, this.modalRoomPowerBillUpdate, { headers })
        .subscribe((data: any) => {
          console.log('data: ', data);
          this.modalRoomPowerBillUpdate.numberOfMoneyMustPay = data;
        });
    }
  }

  turnOffNotification() {
    setTimeout(() => {
      this.modalUpdatePowerBillError = '';
    }, 5000);
  }
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
