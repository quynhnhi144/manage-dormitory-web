import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from '../../common/global-constants';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { StudentsService } from '../students/students.service';
import { Room } from './room.model';
import { Student } from '../students/student.model';
import * as FileSaver from 'file-saver';
import { TypeRoomService } from '../../core/services/typeroom.service';
import { CampusService } from '../../core/services/campus.service';
import { Subscription } from 'rxjs';
import { RoomService } from './room.service';
import { StudentLeft } from '../students/student-left.model';
import { NotificationService } from '../../core/services/notification.service';
import { InforAboutMoneySwitchRoom } from '../../shared/model/info-about-money-switch-room.model';
import { RoomBill } from '../../shared/model/room-bill.model';
import { WaterBill } from '../../shared/model/water-bill.model';
import { VehicleBill } from '../../shared/model/vehicle-bill.model';
import { InfoSwitchRoom } from '../../shared/model/info-switch-room.model';
import { RoomPayment } from './room-payment.model';
import { StudentBill } from '../students/student-bill.model';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RoomsComponent implements OnInit {
  quantityStudentList = [
    { id: -1, name: 'Tất cả' },
    { id: 0, name: '0' },
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: 4 },
    { id: 5, name: 5 },
    { id: 6, name: 6 },
  ];
  typeOfRoomList = [
    { id: 0, name: 'Tất cả' },
    { id: 1, name: 'Phòng Nữ' },
    { id: 2, name: 'Phòng Nam' },
  ];
  rooms: Room[] = [];
  roomsTotal = 5;
  campusIndex = 0;
  campusType = 'all';
  page: number = 1;
  skip = 0;
  pageSize = 10;
  campuses;
  searchText = '';

  quantityStudent = 0;
  typeOfRoomId = null;
  isClickBtnQuantityStudent = false;
  isClickBtnTypeRoom = false;
  isClickSearch = false;
  modalOption: NgbModalOptions = {};
  studentLeft = new StudentLeft();
  currentStudentId = 0;

  remainingRooms = [];
  modalStudent = new Student();
  remaingRoomId: number = -1;
  infoAboutMoneySwitchRoom = new InforAboutMoneySwitchRoom();

  roomPayment: RoomPayment = new RoomPayment();

  //modal Detail Room
  modalRoom = new Room({
    id: 1,
    name: 'A101',
    quantityStudent: 2,
    priceRoom: 550000,
    campusName: 'Campus A',
    userManager: 'Nguyễn Văn A',
    typeRoom: { id: 2, name: 'Package Room', maxQuantity: 4 },
    students: [
      new Student({
        id: 1,
        name: 'Lê Văn Tèo',
        phone: '1234567890',
        email: 'teo_le@gmail.com',
      }),
    ],
    isPayRoom: true,
    isPayWaterBill: true,
  });
  currentRoomId = 0;

  newRoomForm = this.modalRoom;

  //modal Upate Room
  arrStudent = [];
  selectedStudentIds = [];
  typeRoomId: number;
  maxQuantityStudent: number;
  typeRoomError = null;

  subscription: Subscription;

  constructor(
    private modalService: NgbModal,
    private typeRoomService: TypeRoomService,
    private campusService: CampusService,
    private roomService: RoomService,
    private studentService: StudentsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getAllCampuses();
    this.getAllRooms(0, 'all', 1);
  }

  getAllCampuses() {
    this.subscription = this.campusService
      .getAllCampuses()
      .subscribe((data: any) => {
        this.campuses = data;
      });
  }

  getAllRooms(campusIndex, campusType, page = 1) {
    this.campusIndex = campusIndex;
    this.campusType = campusType;
    let choosedCampus = '';

    if (campusType !== 'all') {
      choosedCampus = '&campusName=' + campusType;
    }
    this.page = page;
    this.skip = (page - 1) * this.pageSize;
    let paramQuantityStudent = this.isClickBtnQuantityStudent
      ? `&quantityStudent=${this.quantityStudent}`
      : ``;

    let paramTypeOfRoomId = this.isClickBtnTypeRoom
      ? `&typeRoomId=${this.typeOfRoomId}`
      : ``;
    let paramSearchText = this.isClickSearch
      ? `&searchText=${this.searchText}`
      : ``;
    this.subscription = this.roomService
      .getAllRoomsHaveParam(
        this.skip,
        this.pageSize,
        paramSearchText,
        paramQuantityStudent,
        paramTypeOfRoomId,
        choosedCampus
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          this.rooms = data.data.data;
          console.log('rooms:', this.rooms);
          this.roomsTotal = data.total;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onSearch(event) {
    this.isClickSearch = true;
    this.getAllRooms(this.campusIndex, this.campusType);
  }

  resetPage() {
    this.page = 1;
    this.getAllRooms(this.campusIndex, this.campusType);
  }

  changePage(pageNumber: number) {
    this.page = pageNumber;
    this.getAllRooms(this.campusIndex, this.campusType, pageNumber);
  }

  resetPageByQuantityStudent(quantityStudent: number) {
    this.isClickBtnQuantityStudent = true;
    this.quantityStudent = quantityStudent;
    this.getAllRooms(this.campusIndex, this.campusType);
  }

  resetPageByTypeOfRoom(typeOfRoomId: string) {
    this.isClickBtnTypeRoom = true;
    this.typeOfRoomId = typeOfRoomId;
    this.getAllRooms(this.campusIndex, this.campusType);
  }

  // open modal
  openModal(modalName) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(modalName, this.modalOption);
  }

  // modal room detail
  openModalDetailARoom(modalDetailARoom, room: any) {
    this.currentRoomId = room.id;
    this.getDetailARoom();
    this.openModal(modalDetailARoom);
  }

  getDetailARoom() {
    this.subscription = this.roomService
      .getDetailRoom(this.currentRoomId)
      .subscribe(
        (data: any) => {
          console.log('detailRoom: ', data);
          this.modalRoom = data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  // export excel file
  exportExcel() {
    this.subscription = this.roomService.exportExcelFile().subscribe(
      (response: any) => {
        this.downloadFile(
          response,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'rooms.xlsx'
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

  // modal update room
  openModalUpdateARoom(modalUpdateARoom, room: any) {
    this.currentRoomId = room.id;
    this.getUpdateRoom();
    this.openModal(modalUpdateARoom);
  }

  async getUpdateRoom() {
    let data = await this.roomService
      .getUpdateRoom(this.currentRoomId)
      .toPromise();
    this.newRoomForm = data;
    if (!this.newRoomForm.typeRoom) {
      this.typeRoomId = 0;
    } else {
      this.typeRoomId = this.newRoomForm.typeRoom.id;
    }
  }

  // delete student
  openModalDeleteStudent(modalDeleteStudent, student: any) {
    this.currentStudentId = student.id;
    this.getRoomBill();
    this.openModal(modalDeleteStudent);
  }

  getRoomBill() {
    this.subscription = this.roomService
      .getStudentWanttoUnactive(this.currentStudentId)
      .subscribe(
        (data: any) => {
          console.log('studentLeft: ' + data);
          this.studentLeft = data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  saveDelete() {
    this.subscription = this.roomService
      .unactiveStudentInRoom(this.studentLeft)
      .subscribe(
        (data: any) => {
          console.log('data:' + data);
          let index = this.newRoomForm.students.findIndex(
            (student) => student.id === this.studentLeft.id
          );
          this.newRoomForm.students.splice(index, 1);
          this.getAllRooms(this.campusIndex, this.campusType);
          this.modalService.dismissAll();
          this.notificationService.sendNotificationMessage({
            message: 'Đã xóa sinh viên thành công !!!',
            isSuccess: true,
          });

          this.exportPDFForStudentRemove(this.studentLeft);
        },
        (error) => {
          console.log(error);
          this.notificationService.sendNotificationMessage({
            message: 'Có lỗi xảy ra !!!',
            isSuccess: false,
          });
        }
      );
  }

  exportPDFForStudentRemove(studentRemove: StudentLeft) {
    this.subscription = this.studentService
      .exportPDFForStudentRemove(studentRemove)
      .subscribe(
        (response: any) => {
          this.downloadFile(
            response,
            'application/pdf',
            `${studentRemove.idCard}_${new Date()}.pdf`
          );
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  checkQuantityStudent(typeRoomId: number) {
    if (typeRoomId == null) {
      this.typeRoomError = 'Type Room is Required';
      this.turnOffNotification();
      return;
    }

    this.typeRoomService.getTypeRoomById(typeRoomId).subscribe(
      (data: any) => {
        this.maxQuantityStudent = data.maxQuantity;
        if (this.newRoomForm.students.length > this.maxQuantityStudent) {
          this.typeRoomError =
            'Quantity of Student in Room is over the Max Quantity of Room';
          this.turnOffNotification();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  saveChange() {
    if (this.typeRoomError || this.typeRoomError === '') {
      return;
    }

    let indexTypeRoom = this.typeOfRoomList.findIndex(
      (x) => x.id === this.typeRoomId
    );
    let typeRoom = this.typeOfRoomList[indexTypeRoom];
    let roomUpdate = new Room({
      id: this.newRoomForm.id,
      name: this.newRoomForm.name,
      quantityStudent: this.newRoomForm.quantityStudent,
      campusName: this.newRoomForm.campusName,
      userManager: this.newRoomForm.userManager,
      typeRoom: typeRoom,
      students: this.newRoomForm.students,
      isPayRoom: this.newRoomForm.isPayRoom,
      isPayWaterBill: this.newRoomForm.isPayWaterBill,
    });
    this.subscription = this.roomService
      .updateRoom(this.currentRoomId, roomUpdate)
      .subscribe(
        (data: Room) => {
          this.newRoomForm = data;
          let indexRoom = this.rooms.findIndex(
            (room) => room.id === this.newRoomForm.id
          );
          this.rooms[indexRoom] = data;
          this.modalService.dismissAll();
          this.notificationService.sendNotificationMessage({
            message: 'Đã cập nhật thành công !!!',
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
  }

  // switch student
  getEnoughConditionSwitchRooms() {
    this.roomService.getEnoughConditionSwitchRooms().subscribe((data: any) => {
      this.remainingRooms = data;
    });
  }

  getDetailAStudent() {
    this.studentService.getAStudent(this.currentStudentId).subscribe(
      (data: any) => {
        console.log('detailStudent: ', data);
        this.modalStudent = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  switchRoom(modalSwitchRoom, student: any) {
    this.currentStudentId = student.id;
    this.getEnoughConditionSwitchRooms();
    this.getDetailAStudent();
    this.openModal(modalSwitchRoom);
  }

  changeRoom() {
    this.subscription = this.studentService
      .changeRoom(this.modalStudent.roomDto.id, this.remaingRoomId)
      .subscribe(
        (data: any) => {
          console.log('duration: ' + data);
          this.infoAboutMoneySwitchRoom = data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  exportPDFForStudentSwitchRoom(studentSwitchRoom: InfoSwitchRoom) {
    this.subscription = this.studentService
      .exportPDFForStudentSwitchRoom(studentSwitchRoom)
      .subscribe(
        (response: any) => {
          this.downloadFile(
            response,
            'application/pdf',
            `${studentSwitchRoom.studentIdCard}_${new Date()}.pdf`
          );
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  saveSwitchRoom() {
    let roomBill = new RoomBill({
      billId: null,
      studentName: this.modalStudent.name,
      studentId: this.modalStudent.id,
      startDate: this.infoAboutMoneySwitchRoom.roomStartDate,
      endDate: this.infoAboutMoneySwitchRoom.roomEndDate,
      price: this.infoAboutMoneySwitchRoom.durationRoomMoney,
      roomId: this.infoAboutMoneySwitchRoom.newRoomId,
      maxQuantity: null,
    });

    let waterBill = new WaterBill({
      billId: null,
      studentName: this.modalStudent.name,
      studentId: this.modalStudent.id,
      startDate: this.infoAboutMoneySwitchRoom.waterStartDate,
      endDate: this.infoAboutMoneySwitchRoom.waterEndDate,
      price: this.infoAboutMoneySwitchRoom.durationWaterMoney,
      roomId: this.infoAboutMoneySwitchRoom.newRoomId,
    });

    let vehicleBill = new VehicleBill({
      billId: null,
      studentName: this.modalStudent.name,
      studentId: this.modalStudent.id,
      vehicleId: this.modalStudent.vehicleId,
      startDate: this.infoAboutMoneySwitchRoom.waterStartDate,
      endDate: this.infoAboutMoneySwitchRoom.waterEndDate,
      price: this.infoAboutMoneySwitchRoom.durationWaterMoney,
      roomId: this.infoAboutMoneySwitchRoom.newRoomId,
    });

    let studentSwitchRoom = new InfoSwitchRoom({
      studentId: this.modalStudent.id,
      studentIdCard: this.modalStudent.idCard,
      studentName: this.modalStudent.name,
      oldRoomId: this.modalStudent.roomDto.id,
      oldRoomName: this.modalStudent.roomDto.name,
      newRoomId: this.remaingRoomId,
      newRoomName: this.remainingRooms[
        this.remainingRooms.findIndex((x) => x.id === this.remaingRoomId)
      ].name,
      roomBill: roomBill,
      waterBill: waterBill,
      vehicleBill: vehicleBill,
    });

    this.subscription = this.studentService
      .switchRoom(this.currentStudentId, studentSwitchRoom)
      .subscribe(
        (data: any) => {
          console.log(data);
          let index = this.newRoomForm.students.findIndex(
            (student) => student.id === this.studentLeft.id
          );
          this.newRoomForm.students.splice(index, 1);
          this.getAllRooms(this.campusIndex, this.campusType);
          this.modalService.dismissAll();
          this.notificationService.sendNotificationMessage({
            message: 'Đã chuyển phòng cho sinh viên thành công !!!',
            isSuccess: true,
          });
          this.exportPDFForStudentSwitchRoom(studentSwitchRoom);
        },
        (error) => {
          console.log(error);
          this.notificationService.sendNotificationMessage({
            message: 'Có lỗi xảy ra !!!',
            isSuccess: false,
          });
        }
      );
  }

  getRoomBillOfAllStudents() {
    this.subscription = this.roomService
      .getBillOfAllStudents(this.currentRoomId)
      .subscribe(
        (data: any) => {
          console.log('create payment: ', data);
          this.roomPayment = data;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  // create payment for room
  openCreatePayment(modalCreatePaymetRoom, room: any) {
    this.currentRoomId = room.id;
    this.getRoomBillOfAllStudents();
    this.openModal(modalCreatePaymetRoom);
  }

  exportPDFForStudentPayment(studentBill: StudentBill) {
    this.subscription = this.studentService
      .exportPDFForStudentPayment(studentBill)
      .subscribe(
        (response: any) => {
          this.downloadFile(
            response,
            'application/pdf',
            `${studentBill.studentIdCard}_${new Date()}.pdf`
          );
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  saveCreatePayment(student: StudentBill) {
    this.subscription = this.roomService.saveCreatePayment(student).subscribe(
      (data: any) => {
        let indexStudent = this.roomPayment.studentBills.findIndex(
          (student) => student.studentId === data
        );
        this.roomPayment.studentBills.splice(indexStudent, 1);
        this.getAllRooms(this.campusIndex, this.campusType);
        this.notificationService.sendNotificationMessage({
          message: 'Đã thanh toán thành công !!!',
          isSuccess: true,
        });
        this.exportPDFForStudentPayment(student);
      },
      (error) => {
        this.notificationService.sendNotificationMessage({
          message: 'Có lỗi xảy ra !!!',
          isSuccess: false,
        });
      }
    );
  }

  turnOffNotification() {
    setTimeout(() => {
      this.typeRoomError = '';
    }, 5000);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
