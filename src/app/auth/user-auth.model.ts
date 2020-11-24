export class UserAuth {
  constructor(
    public username: string,
    public token: string,
    public authorities: string[],
    public tokenExpirationDate: Date
  ) {}
}
