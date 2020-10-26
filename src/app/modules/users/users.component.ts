import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from '../../common/global-constants';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users;
  userTotal = 5;
  page: number = 1;
  skip = 0;
  pageSize = 10;
  searchText = '';

  isClickSearch = false;
  //modal
  modalUser = {
    id: 1,
    username: 'anguyen',
    fullName: 'Nguyễn Văn A',
    birthday: '1997-09-09',
    email: 'anguyen@gmail.com',
    address: '101 Nguyễn Lương Bằng',
    phone: '090123456',
    campuses: [
      {
        name: 'Campus A',
      },
      {
        name: 'Campus B',
      },
    ],
  };
  message = '';
  currentUserId = 0;

  constructor(private httpClient: HttpClient, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getAllUser(1);
  }

  getAllUser(page = 1) {
    this.page = page;
    const headers = new HttpHeaders().set('Authorization', 'Bearer ');
    let url = GlobalConstants.apiURL;
    this.skip = (page - 1) * this.pageSize;
    let paramSearchText = this.isClickSearch
      ? `&searchText=${this.searchText}`
      : ``;
    url +=
      '/api/users?' +
      '&skip=' +
      this.skip +
      '&take=' +
      this.pageSize +
      paramSearchText;

    this.httpClient.get(url, { headers }).subscribe(
      (data: any) => {
        console.log(data);
        this.users = data.data.data;
        console.log('users:', this.users);
        this.userTotal = data.total;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSearch(event) {
    this.isClickSearch = true;
    this.getAllUser();
  }

  resetPage() {
    this.page = 1;
    this.getAllUser();
  }

  changePage(pageNumber: number) {
    this.page = pageNumber;
    this.getAllUser(pageNumber);
  }

  // open modal
  openModal(modalName) {
    this.modalService.open(modalName);
  }

  // modal room detail
  openModalDetailUser(modalDetailAUser, user: any) {
    this.currentUserId = user.id;
    this.getDetailAUser();
    this.openModal(modalDetailAUser);
  }

  getDetailAUser() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ');
    console.log(this.currentUserId);
    let url = GlobalConstants.apiURL + '/api/users/' + this.currentUserId;
    this.httpClient.get(url, { headers }).subscribe(
      (data: any) => {
        console.log('detailUser: ', data);
        this.modalUser = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // // modal update room
  openModalUpdateAUser(modalUpdateAUser, user: any) {
    this.currentUserId = user.id;
    this.openModal(modalUpdateAUser);
  }
}
