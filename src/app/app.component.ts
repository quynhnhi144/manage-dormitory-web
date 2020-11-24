import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from './core/services/notification.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'manage-dormitory-web';
  constructor(
    private notificationService: NotificationService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.authService.autoLogin();
    this.notificationService.notificationMessage.subscribe((data: any) => {
      if (data) {
        if (data.isSuccess) {
          this.toastr.success(data.message);
        } else {
          this.toastr.error(data.message);
        }
      }
    });
  }
}
