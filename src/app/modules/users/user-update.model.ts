import { User } from './user.model';
export class UserUpdate {
  userDto: User;
  oldPassword: string;
  newPassword: string;
  constructor(init?: Partial<UserUpdate>) {
    Object.assign(this, init);
  }
}
