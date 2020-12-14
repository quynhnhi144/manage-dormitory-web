import { Injectable } from '@angular/core';
import { GlobalConstants } from '../common/global-constants';
import { HttpClient } from '@angular/common/http';
import { FindRoomNew } from './find-room-new.model';
import { RegisterRoom } from '../modules/remaining-rooms/register-room.model';
import { StudentNew } from '../modules/students/student-new.model';

@Injectable({ providedIn: 'root' })
export class FindRoomService {
  baseUrl = GlobalConstants.apiURL;
  constructor(private httpClient: HttpClient) {}

  registerRoomStudent(findRoomNew: FindRoomNew) {
    let url = this.baseUrl + '/registerRooms';
    return this.httpClient.post(url, findRoomNew);
  }

  sendMail(registerRoom: FindRoomNew) {
    let url =
      this.baseUrl +
      '/registerRooms' +
      '/sendMail' +
      '/notification-about-register';
    return this.httpClient.post(url, registerRoom);
  }
}
