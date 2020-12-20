import { Component, OnInit } from '@angular/core';
import { RoomService } from '../modules/rooms/room.service';
import { Subscription, forkJoin } from 'rxjs';
import { Room } from '../modules/rooms/room.model';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FindRoomModule } from './find-room.module';
import { FindRoomNew } from './find-room-new.model';
import { FindRoomService } from './find-room.service';
import { NotificationService } from '../core/services/notification.service';
import { RoomAndRegisterCount } from './room-and-registercount.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-find-room',
  templateUrl: './find-room.component.html',
  styleUrls: ['./find-room.component.scss'],
})
export class FindRoomComponent implements OnInit {
  subscription: Subscription;
  remainingRooms: Room[] = [];
  roomAndRegisterCountList: RoomAndRegisterCount[] = [];
  modalOption: NgbModalOptions = {};
  currentRemainingRoomId: number;
  modalRemainingRoom: Room = new Room();
  modalRemainingRoomNew: FindRoomNew = new FindRoomNew();
  isRegisterRoom = false;
  isClickSearch = false;
  isShowStudent = false;

  searchText: string = '';

  constructor(
    private roomService: RoomService,
    private modalService: NgbModal,
    private notificationService: NotificationService,
    private findRoomService: FindRoomService
  ) {}

  ngOnInit(): void {
    this.getAllRemainingRooms();
  }

  getAllRemainingRooms() {
    let paramSearchText = this.isClickSearch
      ? `?&searchText=${this.searchText}`
      : '';
    this.subscription = this.roomService
      .getTotalRemainingRooms(paramSearchText)
      .subscribe((data: any) => {
        console.log('data: ' + data);
        // this.remainingRooms = data;
        this.roomAndRegisterCountList = data;
      });
  }

  // open modal
  openModal(modalName) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(modalName, this.modalOption);
  }

  // get detail remaining room
  getDetailRemainingRoom() {
    this.subscription = this.roomService
      .getDetailRoom(this.currentRemainingRoomId)
      .subscribe(
        (data: any) => {
          console.log('remainingRoom: ', data);
          this.modalRemainingRoom = data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  openModalRemainingRoom(
    modalDetailARemainingRoom,
    roomAndRegisterCount: RoomAndRegisterCount
  ) {
    this.currentRemainingRoomId = roomAndRegisterCount.detailRoomDto.id;
    this.getDetailRemainingRoom();
    this.openModal(modalDetailARemainingRoom);
  }

  save() {
    let findRemainingRoomNew = new FindRoomNew({
      id: null,
      idCard: this.modalRemainingRoomNew.idCard,
      studentName: this.modalRemainingRoomNew.studentName,
      birthday: new Date(this.modalRemainingRoomNew.birthday),
      address: this.modalRemainingRoomNew.address,
      phone: this.modalRemainingRoomNew.phone,
      email: this.modalRemainingRoomNew.email,
      startingDateOfStay: new Date(),
      roomId: this.modalRemainingRoom.id,
    });

    this.subscription = this.findRoomService
      .registerRoomStudent(findRemainingRoomNew)
      .subscribe(
        (data: any) => {
          forkJoin([
            this.roomService.getTotalRemainingRooms(''),
            this.findRoomService.sendMail(findRemainingRoomNew),
          ]).subscribe((data: any) => {
            this.roomAndRegisterCountList = data[0];
            console.log(data[1]);
            this.modalRemainingRoomNew = new FindRoomNew();
            this.modalService.dismissAll();
            this.notificationService.sendNotificationMessage({
              message: 'Đã đăng ký thành công!!!',
              isSuccess: true,
            });
          });
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

  onSearch(event) {
    this.isClickSearch = true;
    this.getAllRemainingRooms();
  }

  cancel() {
    this.modalRemainingRoomNew = new FindRoomNew();
    this.isRegisterRoom = false;
    this.isShowStudent = false;
  }

  showOrNot() {
    this.isRegisterRoom = true;
  }

  showStudentOrNot() {
    this.isShowStudent = true;
  }
}
