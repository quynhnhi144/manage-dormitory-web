import { Component, OnInit } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { CampusService } from 'src/app/core/services/campus.service';
import { RegisterRoom } from './register-room.model';
import { RemainingRoomService } from './remaining-room.service';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterRoomPayment } from './register-room-payment.model';
import { StudentDto } from '../students/student-dto.model';
import { RoomBill } from '../../shared/model/room-bill.model';
import { WaterBill } from '../../shared/model/water-bill.model';
import { StudentNew } from '../students/student-new.model';
import { StudentsService } from '../students/students.service';
import { NotificationService } from '../../core/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-remaining-rooms',
  templateUrl: './remaining-rooms.component.html',
  styleUrls: ['./remaining-rooms.component.scss'],
})
export class RemainingRoomsComponent implements OnInit {
  registerRoomList: RegisterRoom[] = [];
  registerRoomTotal = 5;
  campusIndex = 0;
  campusType = 'all';
  page: number = 1;
  skip = 0;
  pageSize = 10;
  campuses;
  searchText = '';

  isClickSearch = false;

  loadingFlag = false;

  currentRegisterRoomId: number;

  subscription: Subscription;

  modalOption: NgbModalOptions = {};

  modalRegisterRoomPayment = new RegisterRoomPayment();

  constructor(
    private campusService: CampusService,
    private remainingRoomService: RemainingRoomService,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getAllCampuses();
    this.getAllRegisterRoom(0, 'all', 1);
  }

  getAllCampuses() {
    this.subscription = this.campusService
      .getAllCampuses()
      .subscribe((data: any) => {
        this.campuses = data;
      });
  }

  getAllRegisterRoom(campusIndex, campusType, page = 1) {
    this.loadingFlag = true;
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

    this.subscription = this.remainingRoomService
      .getAllRegisterRoom(
        this.skip,
        this.pageSize,
        choosedCampus,
        paramSearchText
      )
      .subscribe(
        (data: any) => {
          this.registerRoomList = data.data.data;
          this.registerRoomTotal = data.total;
          console.log('registerRoom: ' + this.registerRoomList);
          this.loadingFlag = false;
        },
        (error) => {
          console.log(error);
          this.loadingFlag = false;
        }
      );
  }

  resetPage() {
    this.page = 1;
    this.getAllRegisterRoom(this.campusIndex, this.campusType);
  }

  changePage(pageNumber: number) {
    this.page = pageNumber;
    this.getAllRegisterRoom(this.campusIndex, this.campusType, pageNumber);
  }

  onSearch() {
    this.isClickSearch = true;
    this.getAllRegisterRoom(this.campusIndex, this.campusType);
  }

  // get detail register room
  getDetailRegisterRoom() {
    this.subscription = this.remainingRoomService
      .getDetailRegisterRoom(this.currentRegisterRoomId)
      .subscribe((data: any) => {
        this.modalRegisterRoomPayment = data;
      });
  }

  openModalInfo(modalRegisterRoom, registerRoom: any) {
    this.currentRegisterRoomId = registerRoom.id;
    this.getDetailRegisterRoom();
    this.openModal(modalRegisterRoom);
  }

  // open modal
  openModal(modalName) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(modalName, this.modalOption);
  }

  saveRegister() {
    let studentNew = new StudentDto({
      id: null,
      idCard: this.modalRegisterRoomPayment.registerRoomDto.idCard,
      name: this.modalRegisterRoomPayment.registerRoomDto.studentName,
      birthday: this.modalRegisterRoomPayment.registerRoomDto.birthday,
      phone: this.modalRegisterRoomPayment.registerRoomDto.phone,
      email: this.modalRegisterRoomPayment.registerRoomDto.email,
      address: this.modalRegisterRoomPayment.registerRoomDto.address,
      startingDateOfStay: this.modalRegisterRoomPayment.registerRoomDto
        .startingDateOfStay,
      endingDateOfStay: null,
      roomId: this.modalRegisterRoomPayment.registerRoomDto.roomId,
      waterPriceId: 2,
    });

    let roomBill = new RoomBill({
      billId: null,
      studentName: null,
      studentId: null,
      startDate: this.modalRegisterRoomPayment.infoMoneyDto.roomStartDate,
      endDate: this.modalRegisterRoomPayment.infoMoneyDto.roomEndDate,
      price: Math.abs(
        this.modalRegisterRoomPayment.infoMoneyDto.moneyOfRoomMustPay
      ),
      roomId: null,
      maxQuantity: null,
    });

    let waterBill = new WaterBill({
      billId: null,
      studentName: null,
      studentId: null,
      startDate: this.modalRegisterRoomPayment.infoMoneyDto.waterStartDate,
      endDate: this.modalRegisterRoomPayment.infoMoneyDto.waterEndDate,
      price: Math.abs(
        this.modalRegisterRoomPayment.infoMoneyDto.moneyOfWaterMustPay
      ),
      roomId: null,
    });
    let studentNewDto = new StudentNew({
      studentDto: studentNew,
      waterBillDto: waterBill,
      roomBillDto: roomBill,
    });

    this.subscription = this.remainingRoomService
      .addStudentFromRegisterRoom(this.currentRegisterRoomId, studentNewDto)
      .subscribe(
        async (data: any) => {
          await this.remainingRoomService
            .sendMailSuccessFullyAddStudentFromRegistering(studentNewDto)
            .toPromise();

          this.getAllRegisterRoom(0, 'all', 1);

          this.modalService.dismissAll();
          this.notificationService.sendNotificationMessage({
            message: 'Đã thêm sinh viên thành công !!!',
            isSuccess: true,
          });
        },
        (error) => {
          console.log(error);
          this.notificationService.sendNotificationMessage({
            message:
              'Mã số sinh viên hoặc email đã bị trùng. Hãy kiểm tra lại !!!',
            isSuccess: false,
          });
        }
      );
  }

  deleteRegisterRoom(registerRoom: RegisterRoom) {
    this.currentRegisterRoomId = registerRoom.id;
    this.subscription = this.remainingRoomService
      .deleteRegisterRoom(this.currentRegisterRoomId)
      .subscribe(
        async (data: any) => {
          console.log(data);
          this.notificationService.sendNotificationMessage({
            message: 'Đã xóa thành công !!!',
            isSuccess: true,
          });
          await this.remainingRoomService
            .sendMailRejectRegisterRoom()
            .toPromise();

          this.getAllRegisterRoom(0, 'all', 1);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.notificationService.sendNotificationMessage({
            message: error.error.message,
            isSuccess: false,
          });
        }
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
