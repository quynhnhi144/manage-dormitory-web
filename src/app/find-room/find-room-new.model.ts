export class FindRoomNew {
  id: number;
  idCard: number;
  studentName: string;
  birthday: Date;
  address: string;
  phone: string;
  email: string;
  startingDateOfStay: Date;
  roomId: number;
  constructor(init?: Partial<FindRoomNew>) {
    Object.assign(this, init);
  }
}
