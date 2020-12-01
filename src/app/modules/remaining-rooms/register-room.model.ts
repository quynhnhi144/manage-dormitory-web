export class RegisterRoom {
  id: number;
  idCard: string;
  studentName: string;
  birthday: Date;
  address: string;
  phone: string;
  email: string;
  startingDateOfStay: Date;
  roomId: number;
  roomName: string;
  typeRoomName: string;
  campusName: string;

  constructor(init?: Partial<RegisterRoom>) {
    Object.assign(this, init);
  }
}
