import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from '../../common/global-constants';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements OnInit {
  students;
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
  modalStudent = {
    id: 1,
    name: 'Lê Thị Quỳnh Nhi',
    birthday: '1997-09-09',
    phone: '090123456',
    email: 'manager_dormitory@gmail.com',
    address: null,
    startingDateOfStay: '2019-09-05',
    endingDateOfStay: null,
    roomName: 'A101',
    campusName: 'Campus A',
    typeRoom: 'Package Room',
    userManager: 'Nguyễn Văn A',
    isPayRoom: true,
    isPayWaterBill: true,
    isPayVehicleBill: true,
    isPayPowerBill: true,
  };
  message = '';
  currentStudentId = 0;

  constructor(private httpClient: HttpClient, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getAllCampuses();
    this.getAllStudents(0, 'all', 1);
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
      paramSearchText +
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
    this.modalService.open(modalName);
  }

  // modal room detail
  openModalDetailARoom(modalDetailAStudent, student: any) {
    this.currentStudentId = student.id;
    this.getDetailAStudent();
    this.openModal(modalDetailAStudent);
  }

  getDetailAStudent() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ');
    console.log(this.currentStudentId);
    let url = GlobalConstants.apiURL + '/api/students/' + this.currentStudentId;
    this.httpClient.get(url, { headers }).subscribe(
      (data: any) => {
        console.log('detailStudent: ', data);
        this.modalStudent = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // modal update room
  openModalUpdateARoom(modalUpdateAStudent, room: any) {
    this.currentStudentId = room.id;
    this.openModal(modalUpdateAStudent);
  }
}
