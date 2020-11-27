import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { StudentsService } from './students.service';
import { Student } from './student.model';
import { RoomService } from '../rooms/room.service';
import { CampusService } from 'src/app/core/services/campus.service';
import { StudentLeft } from './student-left.model';
import { StudentNew } from './student-new.model';
import { RoomBill } from '../../shared/model/room-bill.model';
import { WaterBill } from '../../shared/model/water-bill.model';
import { StudentDto } from './student-dto.model';
import { InforAboutMoneySwitchRoom } from 'src/app/shared/model/info-about-money-switch-room.model';
import { VehicleBill } from '../../shared/model/vehicle-bill.model';
import { InfoSwitchRoom } from '../../shared/model/info-switch-room.model';
import { NotificationService } from '../../core/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements OnInit {
  students = [];
  studentTotal = 5;
  campusIndex = 0;
  campusType = 'all';
  page: number = 1;
  skip = 0;
  pageSize = 10;
  campuses;
  searchText = '';

  isClickSearch = false;
  //modal
  modalStudent = new Student();
  message = '';
  currentStudentId = 0;

  modalStudentUpdate = new Student();
  studentUpdateError = null;
  modalOption: NgbModalOptions = {};

  arrRooms = [];
  selectedRoomIds = [];

  studentLeft = new StudentLeft();

  isNewStudent = false;

  moneyRoomAndMoneyWater = null;

  remainingRooms = [];

  remaingRoomId: number = -1;

  oldRoomId = 0;

  infoAboutMoneySwitchRoom = new InforAboutMoneySwitchRoom();

  subscription: Subscription;

  constructor(
    private modalService: NgbModal,
    private studentService: StudentsService,
    private roomService: RoomService,
    private campusService: CampusService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getAllCampuses();
    this.getAllStudents(0, 'all', 1);
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

  getAllStudents(campusIndex, campusType, page = 1) {
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

    this.subscription = this.studentService
      .getAllStudents(this.skip, this.pageSize, paramSearchText, choosedCampus)
      .subscribe(
        (data: any) => {
          console.log(data);
          this.students = data.data.data;
          console.log('students:', this.students);
          this.studentTotal = data.total;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onSearch(event) {
    this.isClickSearch = true;
    this.getAllStudents(this.campusIndex, this.campusType);
  }

  resetPage() {
    this.page = 1;
    this.getAllStudents(this.campusIndex, this.campusType);
  }

  changePage(pageNumber: number) {
    this.page = pageNumber;
    this.getAllStudents(this.campusIndex, this.campusType, pageNumber);
  }

  // open modal
  openModal(modalName) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(modalName, this.modalOption);
  }

  // modal room detail
  openModalDetailAStudent(modalDetailAStudent, student: any) {
    this.currentStudentId = student.id;
    this.getDetailAStudent();
    this.openModal(modalDetailAStudent);
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

  // modal update student
  openModalUpdateAStudent(modalUpdateAStudent, student: any) {
    this.currentStudentId = student.id;
    this.isNewStudent = false;
    this.getUpdateAStudent();
    this.openModal(modalUpdateAStudent);
  }

  getUpdateAStudent() {
    this.studentService.getAStudent(this.currentStudentId).subscribe(
      (data: any) => {
        this.modalStudentUpdate = new Student({
          id: data.id,
          idCard: data.idCard,
          name: data.name,
          birthday: new Date(data.birthday),
          phone: data.phone,
          email: data.email,
          address: data.address,
          startingDateOfStay: new Date(data.startingDateOfStay),
          roomDto: data.roomDto,
          isPayRoom: data.isPayRoom,
          isPayWaterBill: data.isPayWaterBill,
          active: data.active,
        });
        if (data.endingDateOfStay) {
          this.modalStudentUpdate.endingDateOfStay = new Date(
            data.endingDateOfStay
          );
        }

        this.arrRooms = [];
        if (data.roomDto) {
          this.selectedRoomIds = [data.roomDto.id];
          this.setUpRoomInSearchMultipleSelect(
            data.roomDto,
            data.roomDto.name,
            null
          );
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  saveChange() {
    if (!this.modalStudentUpdate.name) {
      this.studentUpdateError = 'Name is required';
      this.turnOffNotification();
      return;
    }
    if (!this.modalStudentUpdate.birthday) {
      this.studentUpdateError = 'Birthday is required';
      this.turnOffNotification();
      return;
    }
    if (!this.modalStudentUpdate.phone) {
      this.studentUpdateError = 'Phone is required';
      this.turnOffNotification();
      return;
    }
    if (!this.modalStudentUpdate.email) {
      this.studentUpdateError = 'Email is required';
      this.turnOffNotification();
      return;
    }
    if (!this.modalStudentUpdate.address) {
      this.studentUpdateError = 'Address is required';
      this.turnOffNotification();
      return;
    }
    // if (!this.studentUpdate.room) {
    //   this.studentUpdateError = 'Room is required';
    //   this.turnOffNotification();
    //   return;
    // }

    if (!this.modalStudentUpdate.startingDateOfStay) {
      this.studentUpdateError = 'Starting date of stay is required';
      this.turnOffNotification();
      return;
    }
    if (!this.isNewStudent) {
      let studentUpdate = {
        id: this.modalStudentUpdate.id,
        idCard: this.modalStudentUpdate.idCard,
        name: this.modalStudentUpdate.name,
        birthday: this.modalStudentUpdate.birthday,
        phone: this.modalStudentUpdate.phone,
        email: this.modalStudentUpdate.email,
        address: this.modalStudentUpdate.address,
        startingDateOfStay: this.modalStudentUpdate.startingDateOfStay,
        endingDateOfStay: this.modalStudentUpdate.endingDateOfStay,
        roomId: this.selectedRoomIds[0],
      };

      this.subscription = this.studentService
        .updateStudent(this.currentStudentId, studentUpdate)
        .subscribe(
          (data: Student) => {
            console.log('studentUpdated: ', data);
            let index = this.students.findIndex(
              (student) => student.id === this.currentStudentId
            );
            this.students[index] = data;
            this.modalService.dismissAll();
            this.notificationService.sendNotificationMessage({
              message: 'Đã cập nhật thông tin sinh viên thành công !!!',
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
    } else {
      let studentNew = new StudentDto({
        id: null,
        idCard: this.modalStudentUpdate.idCard,
        name: this.modalStudentUpdate.name,
        birthday: this.modalStudentUpdate.birthday,
        phone: this.modalStudentUpdate.phone,
        email: this.modalStudentUpdate.email,
        address: this.modalStudentUpdate.address,
        startingDateOfStay: this.modalStudentUpdate.startingDateOfStay,
        endingDateOfStay: this.modalStudentUpdate.endingDateOfStay,
        roomId: this.selectedRoomIds[0],
        waterPriceId: 2,
      });

      let roomBill = new RoomBill({
        billId: null,
        studentName: null,
        studentId: null,
        startDate: this.moneyRoomAndMoneyWater.roomStartDate,
        endDate: this.moneyRoomAndMoneyWater.roomEndDate,
        price: this.moneyRoomAndMoneyWater.moneyOfRoomMustPay,
        roomId: null,
        maxQuantity: null,
      });

      let waterBill = new WaterBill({
        billId: null,
        studentName: null,
        studentId: null,
        startDate: this.moneyRoomAndMoneyWater.waterStartDate,
        endDate: this.moneyRoomAndMoneyWater.waterEndDate,
        price: this.moneyRoomAndMoneyWater.moneyOfWaterMustPay,
        roomId: null,
      });

      let studentNewDto = new StudentNew({
        studentDto: studentNew,
        waterBillDto: waterBill,
        roomBillDto: roomBill,
      });
      this.studentService.addStudent(studentNewDto).subscribe(
        (data) => {
          console.log('data new: ' + data);
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
  }

  turnOffNotification() {
    setTimeout(() => {
      this.studentUpdateError = '';
    }, 5000);
  }

  onSearchMultiSelect(event) {
    if (event && event.term) {
      var keyword = event.term;
      console.log('keyword: ', keyword);
      this.roomService.getAllRooms(0, 100, keyword).subscribe((data: any) => {
        this.arrRooms = [];
        let roomList = data.data.data;
        console.log('rooms: ', roomList);
        for (let i = 0; i < roomList.length; i++) {
          let room = roomList[i];
          let label = room.name;
          let name = null;
          this.setUpRoomInSearchMultipleSelect(room, label, name);
        }
      });
    }
  }

  setUpRoomInSearchMultipleSelect(room: any, label: string, name: string) {
    if (room.typeRoom != null) {
      name =
        room.name +
        ' < Remaining Quantity Student: ' +
        (room.typeRoom.maxQuantity - room.quantityStudent) +
        ' >';
    } else {
      name = room.name + ' <>';
    }
    let item = {
      id: room.id,
      name: name,
      label: label,
    };
    this.arrRooms = [...this.arrRooms, item];
  }

  unselect(item) {
    this.selectedRoomIds = this.selectedRoomIds.filter(
      (rid) => rid !== item.id
    );
  }

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
          let index = this.students.findIndex(
            (student) => student.id === this.studentLeft.id
          );
          this.students[index].active = !this.students[index].active;
          this.modalService.dismissAll();
          this.notificationService.sendNotificationMessage({
            message: 'Đã đổi trạng thái sinh viên thành công !!!',
            isSuccess: true,
          });
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

  createNewStudent(modalUpdateAStudent) {
    this.isNewStudent = true;
    this.modalStudentUpdate = new Student({
      id: null,
      idCard: null,
      name: null,
      birthday: null,
      phone: null,
      email: null,
      address: null,
      startingDateOfStay: new Date(),
      roomDto: null,
      isPayRoom: false,
      isPayWaterBill: false,
      active: true,
    });
    this.selectedRoomIds = [];
    this.openModal(modalUpdateAStudent);
  }

  showInfoMoney() {
    this.subscription = this.studentService
      .showInfoMoney(this.selectedRoomIds[0])
      .subscribe(
        (data: any) => {
          console.log('data: ' + data);
          this.moneyRoomAndMoneyWater = data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getAllRemaingRooms() {
    this.roomService.getTotalRemainingRooms().subscribe((data: any) => {
      this.remainingRooms = data;
    });
  }

  switchRoom(modalSwitchRoom, student: any) {
    this.currentStudentId = student.id;
    this.getAllRemaingRooms();
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
          this.getAllStudents(this.campusIndex, this.campusType, this.page);
          this.modalService.dismissAll();
          this.notificationService.sendNotificationMessage({
            message: 'Đã chuyển phòng cho sinh viên thành công !!!',
            isSuccess: true,
          });
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
