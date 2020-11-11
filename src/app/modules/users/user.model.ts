export class User {
  id: number;
  username: string;
  fullName: string;
  birthday: Date;
  email: string;
  address: string;
  phone: string;
  campuses: string[];

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
