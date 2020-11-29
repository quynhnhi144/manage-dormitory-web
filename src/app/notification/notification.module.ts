import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from './notification.component';
import { NotificationRoutingModule } from './notification-routing.module';

@NgModule({
  declarations: [NotificationComponent],
  imports: [CommonModule, FormsModule, NotificationRoutingModule],
})
export class NotificationModule {}
