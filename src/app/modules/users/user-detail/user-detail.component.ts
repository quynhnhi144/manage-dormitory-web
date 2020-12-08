import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { UserUpdate } from '../user-update.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  subscription: Subscription;
  user: User = new User();
  modalUpdateUser: User = new User();
  username: string;
  isEdit = false;
  oldPassword: string = null;
  newPassword: string = null;
  isChangePassword = false;
  loadingFlag = false;
  selectedCampusIds = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.isEdit = false;
    this.subscription = this.route.params.subscribe((params: Params) => {
      this.username = params['username'];
      this.getProfile();
    });
  }

  getProfile() {
    this.loadingFlag = true;
    this.userService.getProfile(this.username).subscribe(
      (user: any) => {
        this.user = user;
        this.loadingFlag = false;
      },
      (error) => {
        console.log(error);
        this.loadingFlag = false;
      }
    );
  }

  onUpdateProfile() {
    this.isEdit = true;
    this.modalUpdateUser = new User({
      id: this.user.id,
      username: this.user.username,
      fullName: this.user.fullName,
      birthday: new Date(this.user.birthday),
      email: this.user.email,
      address: this.user.address,
      phone: this.user.phone,
      campuses: this.user.campuses,
    });
  }

  showOrNot() {
    this.isChangePassword = true;
  }

  saveChange() {
    let userDto = {
      id: this.modalUpdateUser.id,
      username: this.modalUpdateUser.username,
      fullName: this.modalUpdateUser.fullName,
      birthday: this.modalUpdateUser.birthday,
      email: this.modalUpdateUser.email,
      address: this.modalUpdateUser.address,
      phone: this.modalUpdateUser.phone,
      campuses: this.modalUpdateUser.campuses,
    };
    let userUpdate = new UserUpdate({
      userDto: userDto,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
    });

    this.subscription = this.userService
      .updateUser(this.user.id, userUpdate)
      .subscribe(
        (data: any) => {
          this.newPassword = null;
          this.oldPassword = null;
          this.isEdit = false;
          this.getProfile();
          this.notificationService.sendNotificationMessage({
            message: 'Đã cập nhật thông tin nhân viên thành công !!!',
            isSuccess: true,
          });
        },
        (error) => {
          console.log(error);
          this.isEdit = false;
          this.notificationService.sendNotificationMessage({
            message: 'Đã xảy ra lỗi. Hãy thử lại !!!',
            isSuccess: false,
          });
        }
      );
  }

  cancel() {
    this.isChangePassword = false;
    this.isEdit = false;
    this.modalUpdateUser = new User();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
