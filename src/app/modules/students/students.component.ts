import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from '../../common/global-constants';
import { StudentsService } from './students.service';
import { Student } from './student.model';
import { RoomService } from '../rooms/room.service';
import { CampusService } from 'src/app/services/campus.service';
import { getTestBed } from '@angular/core/testing';
import { StudentLeft } from './student-left.model';
import { NotificationService } from '../../services/notification.service';

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
  constructor(
    private httpClient: HttpClient,
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
    const headers = new HttpHeaders().set('Authorization', 'Bearer ');
    let url = GlobalConstants.apiURL;
    this.skip = (page - 1) * this.pageSize;
    let paramSearchText = this.isClickSearch
      ? `&searchText=${this.searchText}`
      : ``;

    url +=
      '/api/students?' +
      choosedCampus +
      '&skip=' +
      this.skip +
      '&take=' +
      this.pageSize +
      paramSearchText;

    this.httpClient.get(url, { headers }).subscribe(
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
    this.getUpdateAStudent();
    this.openModal(modalUpdateAStudent);
  }

  getUpdateAStudent() {
    this.studentService.getAStudent(this.currentStudentId).subscribe(
      (data: any) => {
        this.modalStudentUpdate = new Student({
          id: data.id,
          name: data.name,
          birthday: new Date(data.birthday),
          phone: data.phone,
          email: data.email,
          address: data.address,
          startingDateOfStay: new Date(data.startingDateOfStay),
          roomDto: data.roomDto,
          isPayRoom: data.isPayRoom,
          isPayWaterBill: data.isPayWaterBill,
          isPayVehicleBill: data.isPayVehicleBill,
          isPayPowerBill: data.isPayPowerBill,
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
    let studentUpdate = {
      id: this.modalStudentUpdate.id,
      name: this.modalStudentUpdate.name,
      birthday: this.modalStudentUpdate.birthday,
      phone: this.modalStudentUpdate.phone,
      email: this.modalStudentUpdate.email,
      address: this.modalStudentUpdate.address,
      startingDateOfStay: this.modalStudentUpdate.startingDateOfStay,
      endingDateOfStay: this.modalStudentUpdate.endingDateOfStay,
      roomId: this.selectedRoomIds[0],
    };

    this.studentService
      .updateStudent(this.currentStudentId, studentUpdate)
      .subscribe(
        (data: Student) => {
          console.log('studentUpdated: ', data);
          let index = this.students.findIndex(
            (student) => student.id === this.currentStudentId
          );
          this.students[index] = data;
          this.modalService.dismissAll();
        },
        (error) => {
          console.log(error);
        }
      );
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
      let token = '';
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
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
    const headers = new HttpHeaders().set('Authorization', 'Bearer ');
    let url = GlobalConstants.apiURL;
    url += '/api/students/' + this.currentStudentId + '/studentLeft';
    this.httpClient.get(url, { headers }).subscribe((data: any) => {
      console.log('studentLeft: ' + data);
      this.studentLeft = data;
    });
  }

  saveDelete() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ');
    let url = GlobalConstants.apiURL;
    url += '/api/students' + '/studentLeft';
    this.httpClient.post(url, this.studentLeft, { headers }).subscribe(
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
}
