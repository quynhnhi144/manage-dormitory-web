import { Component, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { CampusService } from '../../core/services/campus.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { PowerBillsService } from './power-bills.service';
import { PowerBill } from './power-bill.model';
import * as FileSaver from 'file-saver';
import { NotificationService } from '../../core/services/notification.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

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
  modalRoomPowerBillUpdate: PowerBill = new PowerBill();
  modalNewPowerBill = new PowerBill();

  modalOption: NgbModalOptions = {};

  modalUpdatePowerBillError = null;
  currentDate = new Date();

  progress: number;

  selectedFile: File = null;

  isExtention = true;
  isSubmit = true;

  isNew = false;

  subscription: Subscription;

  isAuthenticated = false;

  constructor(
    private campusService: CampusService,
    private modalService: NgbModal,
    private powerBillsService: PowerBillsService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.userAuth.subscribe((user) => {
      console.log(user);
      if (
        user &&
        user.authorities.length == 1 &&
        user.authorities.includes('ROLE_USER')
      ) {
        this.isAuthenticated = !user;
      } else if (
        user &&
        user.authorities.length == 2 &&
        user.authorities.includes('ROLE_ADMIN')
      ) {
        this.isAuthenticated = !!user;
      }
    });
    this.getAllCampuses();
    this.getAllPowerBills(0, 'all', 1);
  }

  // get all power bills
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
    this.skip = (page - 1) * this.pageSize;
    let paramSearchText = this.isClickSearch
      ? `&searchText=${this.searchText}`
      : ``;
    this.subscription = this.powerBillsService
      .getAllPowerBills(
        this.skip,
        this.pageSize,
        this.formatDate(this.currentDate),
        choosedCampus,
        paramSearchText
      )
      .subscribe(
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

  formatDate(currentDate: Date) {
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let date = currentDate.getDate();
    return year + '-' + month + '-' + date;
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
      .getAPowerBill(this.currentRoomId, this.formatDate(this.currentDate))
      .subscribe((data: any) => {
        console.log('detail power bill: ', data);
        this.modalRoomPowerBill = data;
      });
  }

  //modal new power bill
  openModalNewPowerBill(modalPowerBillNew, room: any) {
    this.currentRoomId = room.detailRoomDto.id;
    this.isNew = true;
    this.getPowerBillUpdate();
    this.openModal(modalPowerBillNew);
  }

  // modal power bill update
  openModalUpdatePowerBill(modalUpdateAPowerBill, room: any) {
    this.currentRoomId = room.detailRoomDto.id;
    this.getPowerBillUpdate();
    this.openModal(modalUpdateAPowerBill);
  }

  getPowerBillUpdate() {
    this.powerBillsService
      .getAPowerBill(this.currentRoomId, this.formatDate(this.currentDate))
      .subscribe(
        (data: PowerBill) => {
          if (this.isNew) {
            this.modalNewPowerBill = new PowerBill({
              detailRoomDto: data.detailRoomDto,
              billId: null,
              startDate: new Date(data.endDate),
              endDate: null,
              numberOfPowerBegin: data.numberOfPowerEnd,
              numberOfPowerEnd: null,
              numberOfPowerUsed: null,
              priceList: data.priceList,
              numberOfMoneyMustPay: null,
              pay: null,
            });
          } else {
            this.modalRoomPowerBillUpdate = new PowerBill({
              detailRoomDto: data.detailRoomDto,
              billId: data.billId,
              startDate: new Date(data.startDate),
              endDate: new Date(data.endDate),
              numberOfPowerBegin: data.numberOfPowerBegin,
              numberOfPowerEnd: data.numberOfPowerEnd,
              numberOfPowerUsed: data.numberOfPowerUsed,
              priceList: data.priceList,
              numberOfMoneyMustPay: data.numberOfMoneyMustPay,
              pay: data.pay,
            });

            console.log('updatePowerBill: ', this.modalRoomPowerBillUpdate);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  changeStatusPayment(modalRoomPowerBillUpdate) {
    modalRoomPowerBillUpdate.pay = !modalRoomPowerBillUpdate.pay;
  }

  changeStatusPaymentNew(modalNewPowerBill) {
    modalNewPowerBill.pay = !modalNewPowerBill.pay;
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
      this.subscription = this.powerBillsService
        .calculatePowerBill(this.modalRoomPowerBillUpdate)
        .subscribe((data: any) => {
          this.modalRoomPowerBillUpdate.numberOfMoneyMustPay = data;
        });
    }
  }

  changeNumberOfPowerUsedNew() {
    if (
      this.modalNewPowerBill.numberOfPowerBegin >
      this.modalNewPowerBill.numberOfPowerEnd
    ) {
      this.modalUpdatePowerBillError =
        'Number of Power Begin cannot bigger than End';
      this.turnOffNotification();
      return;
    } else {
      this.modalNewPowerBill.numberOfPowerUsed =
        this.modalNewPowerBill.numberOfPowerEnd -
        this.modalNewPowerBill.numberOfPowerBegin;
      this.subscription = this.powerBillsService
        .calculatePowerBill(this.modalNewPowerBill)
        .subscribe((data: any) => {
          this.modalNewPowerBill.numberOfMoneyMustPay = data;
        });
    }
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

    if (!this.isNew) {
      this.subscription = this.powerBillsService
        .updatePowerBill(this.currentRoomId, this.modalRoomPowerBillUpdate)
        .subscribe(
          (data: any) => {
            let index = this.rooms.findIndex(
              (room) => room.detailRoomDto.id === this.currentRoomId
            );
            this.rooms[index] = data;
            this.modalService.dismissAll();
            this.notificationService.sendNotificationMessage({
              message: 'Đã tạo hóa đơn tiền điện thành công !!!',
              isSuccess: true,
            });
          },
          (error) => {
            console.log(error);
            this.notificationService.sendNotificationMessage({
              message: 'Đã xảy ra lỗi. Hãy thử lại !!!',
              isSuccess: false,
            });
          }
        );
    } else {
      this.subscription = this.powerBillsService
        .newPowerBill(this.currentRoomId, this.modalNewPowerBill)
        .subscribe(
          (data: any) => {
            console.log('new data: ', data);
            let index = this.rooms.findIndex(
              (room) => room.detailRoomDto.id === this.currentRoomId
            );
            this.rooms[index] = data;
            this.modalService.dismissAll();
            this.notificationService.sendNotificationMessage({
              message: 'Đã thêm hóa đơn điện thành công',
              isSuccess: true,
            });
          },
          (error) => {
            console.log(error);
            this.notificationService.sendNotificationMessage({
              message: 'Lỗi! Có lỗi đã xảy ra. Hãy kiểm tra lại!!!',
              isSuccess: false,
            });
          }
        );
    }
  }

  // send power bill mail
  sendMail(room: PowerBill) {
    let roomSendRequest = {
      detailRoomDto: room.detailRoomDto,
      billId: room.billId,
      startDate: new Date(room.startDate),
      endDate: new Date(room.endDate),
      numberOfPowerBegin: room.numberOfPowerBegin,
      numberOfPowerEnd: room.numberOfPowerEnd,
      numberOfPowerUsed: room.numberOfPowerUsed,
      priceList: room.priceList,
      numberOfMoneyMustPay: room.numberOfMoneyMustPay,
      pay: room.pay,
    };
    this.subscription = this.powerBillsService
      .sendMail(roomSendRequest)
      .subscribe(
        (data: any) => {
          this.notificationService.sendNotificationMessage({
            message: 'Mail đã gửi thành công !!!',
            isSuccess: true,
          });
          console.log('mail: ' + data.message);
        },
        (error) => {
          this.notificationService.sendNotificationMessage({
            message: 'Lỗi! Có lỗi đã xảy ra. Hãy kiểm tra lại!!!',
            isSuccess: false,
          });
          console.log(error);
        }
      );
  }

  sendMailForAllPowerBills() {
    this.subscription = this.powerBillsService
      .sendMailForAllPowerBills(this.formatDate(this.currentDate))
      .subscribe(
        (data: any) => {
          this.notificationService.sendNotificationMessage({
            message: 'Mail đã gửi thành công !!!',
            isSuccess: true,
          });
          console.log('mail: ' + data.message);
        },
        (error) => {
          this.notificationService.sendNotificationMessage({
            message: 'Lỗi! Có lỗi đã xảy ra. Hãy kiểm tra lại !!!',
            isSuccess: false,
          });
          console.log(error);
        }
      );
  }

  turnOffNotification() {
    setTimeout(() => {
      this.modalUpdatePowerBillError = '';
    }, 5000);
  }

  openModalImportFile(modalImportFile) {
    this.openModal(modalImportFile);
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];

    let extention = this.selectedFile.name.substring(
      this.selectedFile.name.lastIndexOf('.') + 1
    );
    if (extention !== 'xlsx' && extention !== 'xls') {
      this.isExtention = false;
      this.isSubmit = false;
      setTimeout(() => {
        this.isExtention = true;
      }, 3000);
    } else {
      this.isSubmit = true;
    }
  }

  submit() {
    if (!this.selectedFile && !this.progress) {
      this.isExtention = false;
      this.progress = null;
      setTimeout(() => {
        this.isExtention = true;
      }, 3000);
      return;
    }
    if (!this.isSubmit) {
      this.isExtention = false;
      this.progress = null;
      setTimeout(() => {
        this.isExtention = true;
      }, 3000);
      return;
    }
    this.progress = 1;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.subscription = this.powerBillsService
      .importExcelFile(this.formatDate(this.currentDate), formData)
      .subscribe(
        async (event: any) => {
          switch (event.type) {
            case HttpEventType.Response:
              this.progress = null;
              console.log('event: ', event.body);
              break;
            case HttpEventType.UploadProgress:
              if (
                Math.round(this.progress) !==
                Math.round((event.loaded / event.total) * 100)
              ) {
                this.progress = (event.loaded / event.total) * 100;
              }
              await this.powerBillsService
                .getAllPowerBills(
                  this.skip,
                  this.pageSize,
                  this.formatDate(this.currentDate),
                  '',
                  ''
                )
                .toPromise()
                .then((data: any) => {
                  this.rooms = data.data.data;
                  this.roomTotal = data.total;
                });
              this.modalService.dismissAll();
              this.notificationService.sendNotificationMessage({
                message: 'Đã thực hiện thành công!!!',
                isSuccess: true,
              });
              break;
          }
        },
        (error) => {
          console.log(error);
          this.notificationService.sendNotificationMessage({
            message: 'Lỗi! Một lỗi đã xảy ra. Hãy kiểm tra lại!!!',
            isSuccess: false,
          });
          this.progress = null;
        }
      );
  }

  exportPowerBillExcel() {
    this.subscription = this.powerBillsService
      .exportExcelFile(this.formatDate(this.currentDate))
      .subscribe(
        (response: any) => {
          this.downloadFile(
            response,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'powerBills.xlsx'
          );
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  downloadFile(data: any, type: string, fileName: string) {
    let blob = new Blob([data], { type: type });
    FileSaver.saveAs(blob, fileName);
  }
}
