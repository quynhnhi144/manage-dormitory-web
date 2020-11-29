export class SignUpForm {
  username: string;
  password: string;
  fullName: string;
  birthday: string;
  email: string;
  address: string;
  phone: string;
  campuses: any;
  role: string[];

  constructor(init?: Partial<SignUpForm>) {
    Object.assign(this, init);
  }
}
