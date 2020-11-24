import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from '../../common/global-constants';
import { Subscription } from 'rxjs';
import { UserService } from './user.service';

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

  subscription: Subscription;

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

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getAllUser(1);
  }

  getAllUser(page = 1) {
    this.page = page;
    this.skip = (page - 1) * this.pageSize;
    let paramSearchText = this.isClickSearch
      ? `&searchText=${this.searchText}`
      : ``;
    this.subscription = this.userService
      .getAllUsers(this.skip, this.pageSize, paramSearchText)
      .subscribe(
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
    this.subscription = this.userService.getAUser(this.currentUserId).subscribe(
      (data: any) => {
        console.log('detailUser: ', data);
        this.modalUser = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /// modal update room
  openModalUpdateAUser(modalUpdateAUser, user: any) {
    this.currentUserId = user.id;
    this.openModal(modalUpdateAUser);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }
}
