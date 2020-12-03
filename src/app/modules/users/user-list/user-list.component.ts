import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { CampusService } from 'src/app/core/services/campus.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UserUpdate } from '../user-update.model';
import { SignUpForm } from '../sign-up-form.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users;
  userTotal = 5;
  page: number = 1;
  skip = 0;
  pageSize = 10;
  searchText = '';

  campuses = [];
  isClickSearch = false;

  subscription: Subscription;

  modalOption: NgbModalOptions = {};

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
      { id: 1, name: 'Campus A' },
      { id: 2, name: 'Campus B' },
    ],
  };
  message = '';
  currentUserId = 0;
  isNewUser = false;
  arrCampuses = [];
  selectedCampusIds = [];
  modalUserUpdate = new User();
  oldPassword = null;
  newPassword = null;

  isChangePassword = false;
  userError = null;

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private campusService: CampusService,
    private notificationService: NotificationService
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
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(modalName, this.modalOption);
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
        this.modalUser = data;
        this.modalUserUpdate = new User({
          id: data.id,
          username: data.username,
          fullName: data.fullName,
          birthday: new Date(data.birthday),
          email: data.email,
          address: data.address,
          phone: data.phone,
          campuses: data.campuses,
        });
        this.campuses = data.campuses;
        this.selectedCampusIds = this.campuses.map((campus) => campus.id);
        for (let i = 0; i < this.campuses.length; i++) {
          this.setUpRoomInSearchMultipleSelect(
            this.campuses[i],
            this.campuses[i].name,
            null
          );
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /// modal update room
  openModalUpdateAUser(modalUpdateAUser, user: any) {
    this.currentUserId = user.id;
    this.getDetailAUser();
    this.openModal(modalUpdateAUser);
  }

  onSearchMultiSelect(event) {
    if (event && event.term) {
      var keyword = event.term;
      console.log('keyword: ', keyword);
      this.subscription = this.campusService
        .getAllCampuses()
        .subscribe((data: any) => {
          this.arrCampuses = [];
          this.campuses = data;
          for (let i = 0; i < this.campuses.length; i++) {
            let label = this.campuses[i].name;
            let name = this.campuses[i].name;
            this.setUpRoomInSearchMultipleSelect(this.campuses[i], name, label);
          }
        });
    }
  }

  setUpRoomInSearchMultipleSelect(campus: any, label: string, name: string) {
    let item = { id: campus.id, name: name, label: label };
    this.arrCampuses = [...this.arrCampuses, item];
  }

  unselect(item) {
    this.selectedCampusIds = this.selectedCampusIds.filter(
      (sid) => sid !== item.id
    );
  }

  saveChange() {
    if (!this.modalUserUpdate.email) {
      this.userError = 'Email là bắt buộc';
      this.turnOffNotification();
      return;
    }
    if (!this.modalUserUpdate.address) {
      this.userError = 'Address là bắt buộc';
      this.turnOffNotification();
      return;
    }
    if (!this.modalUserUpdate.birthday) {
      this.userError = 'Birthday là bắt buộc';
      this.turnOffNotification();
      return;
    }
    if (!this.modalUserUpdate.fullName) {
      this.userError = 'FullName là bắt buộc';
      this.turnOffNotification();
      return;
    }
    if (!this.modalUserUpdate.phone) {
      this.userError = 'Số điện thoại là bắt buộc';
      this.turnOffNotification();
      return;
    }

    if (!this.modalUserUpdate.username) {
      this.userError = 'Username là bắt buộc';
      this.turnOffNotification();
      return;
    }

    if (!this.isNewUser) {
      let choosedCampues = this.campuses.filter((campus) =>
        this.selectedCampusIds.includes(campus.id)
      );
      let userDto = {
        id: this.modalUserUpdate.id,
        username: this.modalUserUpdate.username,
        fullName: this.modalUserUpdate.fullName,
        birthday: this.modalUserUpdate.birthday,
        email: this.modalUserUpdate.email,
        address: this.modalUserUpdate.address,
        phone: this.modalUserUpdate.phone,
        campuses: choosedCampues,
      };
      let userUpdate = new UserUpdate({
        userDto: userDto,
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      });

      this.subscription = this.userService
        .updateUser(this.currentUserId, userUpdate)
        .subscribe(
          (data: any) => {
            console.log('user update: ' + data);
            let index = this.users.findIndex(
              (user) => user.id === this.currentUserId
            );

            this.users[index] = data;
            this.modalService.dismissAll();
            this.newPassword = null;
            this.oldPassword = null;
            this.notificationService.sendNotificationMessage({
              message: 'Đã cập nhật thông tin nhân viên thành công !!!',
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
    } else {
      let choosedCampues = this.campuses.filter((campus) =>
        this.selectedCampusIds.includes(campus.id)
      );
      let newUser: SignUpForm = {
        username: this.modalUserUpdate.username,
        password: this.newPassword,
        fullName: this.modalUserUpdate.fullName,
        birthday: this.formatDate(new Date(this.modalUserUpdate.birthday)),
        email: this.modalUserUpdate.email,
        address: this.modalUserUpdate.address,
        phone: this.modalUserUpdate.phone,
        campuses: choosedCampues,
        role: ['ROLE_USER'],
      };

      this.subscription = this.userService.newUser(newUser).subscribe(
        (data) => {
          this.getAllUser();
          this.modalService.dismissAll();
          this.notificationService.sendNotificationMessage({
            message: 'Đã tạo nhân viên thành công !!!',
            isSuccess: true,
          });
        },
        (error) => {
          console.log(error);
          this.notificationService.sendNotificationMessage({
            message: 'Đã xảy ra lỗi. Hãy kiểm tra lại !!!',
            isSuccess: false,
          });
        }
      );
    }
  }

  openNewUser(modalUpdateAUser) {
    this.isNewUser = true;
    this.modalUserUpdate = new User();
    this.selectedCampusIds = [];
    this.openModal(modalUpdateAUser);
  }

  deleteUser(user: any) {
    this.currentUserId = user.id;
    this.subscription = this.userService
      .deleteUser(this.currentUserId)
      .subscribe(
        (data: any) => {
          console.log('deleteUser: ', data);
          this.getAllUser();
          this.notificationService.sendNotificationMessage({
            message: 'Đã xóa nhân viên thành công !!!',
            isSuccess: true,
          });
        },
        (error) => {
          console.log(error);
          this.notificationService.sendNotificationMessage({
            message: 'Đã xảy ra lỗi. Hãy kiểm tra lại !!!',
            isSuccess: false,
          });
        }
      );
  }

  cancel() {
    this.isChangePassword = false;
    this.modalUserUpdate = new User();
    this.modalService.dismissAll();
  }

  showOrNot() {
    this.isChangePassword = true;
  }

  turnOffNotification() {
    setTimeout(() => {
      this.userError = '';
    }, 5000);
  }

  formatDate(currentDate: Date) {
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let date = currentDate.getDate();
    return year + '-' + month + '-' + date;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
