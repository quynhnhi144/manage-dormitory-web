import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from '../../common/global-constants';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { StudentsService } from '../students/students.service';
import { TypeRoomService } from '../../services/typeroom.service';
import { Room } from './room.model';
import { Student } from '../students/student.model';
import * as FileSaver from 'file-saver';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RoomsComponent implements OnInit {
  quantityStudentList = [
    { id: -1, name: 'All' },
    { id: 0, name: '0' },
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: 4 },
    { id: 5, name: 5 },
    { id: 6, name: 6 },
  ];
  typeOfRoomList = [
    { id: 0, name: 'All' },
    { id: 1, name: 'Package Room' },
    { id: 2, name: 'Shared Room' },
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
  typeOfRoom = '';
  isClickBtnQuantityStudent = false;
  isClickBtnTypeRoom = false;
  isClickSearch = false;
  modalOption: NgbModalOptions = {};

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
    isPayVehicleBill: true,
  });
  currentRoomId = 0;

  newRoomForm = this.modalRoom;

  //modal Upate Room
  arrStudent = [];
  selectedStudentIds = [];
  typeRoomId: number;
  maxQuantityStudent: number;
  typeRoomError = null;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private studentService: StudentsService,
    private typeRoomService: TypeRoomService
  ) {}

  ngOnInit(): void {
    this.getAllCampuses();
    this.getAllRooms(0, 'all', 1);
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

  getAllRooms(campusIndex, campusType, page = 1) {
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
    let paramQuantityStudent = this.isClickBtnQuantityStudent
      ? `&quantityStudent=${this.quantityStudent}`
      : ``;

    let paramTypeOfRoom = this.isClickBtnTypeRoom
      ? `&typeRoom=${this.typeOfRoom}`
      : ``;
    let paramSearchText = this.isClickSearch
      ? `&searchText=${this.searchText}`
      : ``;

    url +=
      '/api/rooms?' +
      choosedCampus +
      paramSearchText +
      '&skip=' +
      this.skip +
      '&take=' +
      this.pageSize +
      paramQuantityStudent +
      paramTypeOfRoom;

    this.httpClient.get(url, { headers }).subscribe(
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

  resetPageByTypeOfRoom(typeOfRoom: string) {
    this.isClickBtnTypeRoom = true;
    this.typeOfRoom = typeOfRoom;
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
    const headers = new HttpHeaders().set('Authorization', 'Bearer ');
    console.log(this.currentRoomId);
    let url = GlobalConstants.apiURL + '/api/rooms/' + this.currentRoomId;
    this.httpClient.get(url, { headers }).subscribe(
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
    const headers = new HttpHeaders().set('Authorization', 'Bearer ');
    let url = GlobalConstants.apiURL;
    url += '/api/rooms/export';
    this.httpClient.get(url, { responseType: 'blob', headers }).subscribe(
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
    const headers = new HttpHeaders().set('Authorization', 'Bearer ');
    console.log(this.currentRoomId);
    let url = GlobalConstants.apiURL + '/api/rooms/' + this.currentRoomId;
    let data = await this.httpClient
      .get<Room>(url, { headers })
      .toPromise();
    this.newRoomForm = data;
    if (!this.newRoomForm.typeRoom) {
      this.typeRoomId = 0;
    } else {
      this.typeRoomId = this.newRoomForm.typeRoom.id;
    }
  }

  removeStudent(student: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ');
    let url = GlobalConstants.apiURL;
    url += '/api/rooms/' + this.currentRoomId + '/student';
    let paramStudent = student;
    this.httpClient.put(url, paramStudent, { headers }).subscribe(
      async (response: any) => {
        const index = this.newRoomForm.students.findIndex(
          (x) => x.id === student.id
        );
        this.newRoomForm.students.splice(index, 1);
        const indexRoom = this.rooms.findIndex(
          (r) => r.id === this.currentRoomId
        );
        await this.getUpdateRoom();
        this.rooms[indexRoom] = this.newRoomForm;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSearchMultiSelect(event) {
    if (event && event.term) {
      var keyword = event.term;
      console.log('keyword: ', keyword);
      let token = '';
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
      this.studentService
        .getAllStudents(0, 50, keyword)
        .subscribe((data: any) => {
          this.arrStudent = [];
          let studentList = data.data.data;
          console.log('students:', studentList);
          for (let i = 0; i < studentList.length; i++) {
            let label = studentList[i].name;
            let name =
              studentList[i].name + ' <' + studentList[i].roomDto.name + '> ';
            let item = {
              id: studentList[i].id,
              name: name,
              label: label,
            };
            this.arrStudent = [...this.arrStudent, item];
          }
        });
    }
  }

  unselect(item) {
    this.selectedStudentIds = this.selectedStudentIds.filter(
      (sid) => sid !== item.id
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
    const headers = new HttpHeaders().set('Authorization', 'Bearer ');
    let url = GlobalConstants.apiURL;
    url += '/api/rooms/' + this.currentRoomId;
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
      isPayVehicleBill: this.newRoomForm.isPayVehicleBill,
    });

    this.httpClient.put(url, roomUpdate, { headers }).subscribe(
      (data: Room) => {
        this.newRoomForm = data;
        let indexRoom = this.rooms.findIndex(
          (room) => room.id === this.newRoomForm.id
        );
        this.rooms[indexRoom] = data;
        this.modalService.dismissAll();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  turnOffNotification() {
    setTimeout(() => {
      this.typeRoomError = '';
    }, 5000);
  }
}
