import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from 'src/app/common/global-constants';
import { User } from './user.model';
import { UserUpdate } from './user-update.model';
import { SignUpForm } from './sign-up-form.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  baseUrl = GlobalConstants.apiURL;
  constructor(private htttp: HttpClient) {}

  getTotalUsers() {
    let url = this.baseUrl + '/users/all';
    return this.htttp.get<User[]>(url);
  }

  getAllUsers(skip: number, take: number, searchText: string) {
    let url =
      this.baseUrl + '/users?' + '&skip=' + skip + '&take=' + take + searchText;
    return this.htttp.get(url);
  }

  getAUser(id: number) {
    let url = this.baseUrl + '/users' + '/' + id;
    return this.htttp.get(url);
  }

  getProfile(username: string) {
    let url = this.baseUrl + '/users' + '/profile' + '/' + username;
    return this.htttp.get(url);
  }

  updateUser(id: number, userUpdate: UserUpdate) {
    let url = this.baseUrl + '/users' + '/' + id;
    return this.htttp.patch(url, userUpdate);
  }

  newUser(newUser: SignUpForm) {
    let url = this.baseUrl + '/auth' + '/signup';
    return this.htttp.post(url, newUser);
  }
}
