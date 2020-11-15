import { Component } from '@angular/core';
import { NotificationService } from './services/notification.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'manage-dormitory-web';
  constructor(
    private notificationService: NotificationService,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
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
