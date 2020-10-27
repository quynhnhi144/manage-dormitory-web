import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from '../../common/global-constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
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
  typeOfRoomList = ['All', 'Package Room', 'Shared Room'];
  rooms;
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
  //modal
  modalRoom = {
    roomId: 1,
    roomName: 'A101',
    quantityStudent: 2,
    priceRoom: 550000,
    campusName: 'Campus A',
    userManager: 'Nguyễn Văn A',
    typeRoom: 'Package Room',
    students: [
      {
        id: 1,
        name: 'Lê Văn Tèo',
        phone: '1234567890',
        email: 'teo_le@gmail.com',
      },
    ],
    isPayRoom: true,
    isPayWaterBill: true,
    isPayVehicleBill: true,
    isPayPowerBill: true,
  };
  message = '';
  currentRoomId = 0;

  constructor(private httpClient: HttpClient, private modalService: NgbModal) {}

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
    this.modalService.open(modalName);
  }

  // modal room detail
  openModalDetailARoom(modalDetailARoom, room: any) {
    this.currentRoomId = room.roomId;
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
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  downloadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }

  // modal update room
  openModalUpdateARoom(modalUpdateARoom, room: any) {
    this.currentRoomId = room.id;
    this.openModal(modalUpdateARoom);
  }
}
