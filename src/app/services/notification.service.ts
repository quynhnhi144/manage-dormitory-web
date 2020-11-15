import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationMessage } from '../shared/model/NotificationMessage.model';
@Injectable({ providedIn: 'root' })
export class NotificationService {
  notificationMessage = new Subject<NotificationMessage>();
  sendNotificationMessage(notification: NotificationMessage) {
    this.notificationMessage.next(notification);
  }
}
