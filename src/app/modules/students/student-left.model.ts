export class StudentLeft {
  id: number;
  leavingDate: Date;
  numberOfRoomMoney: number;
  numberOfWaterMoney: number;
  numberOfVehicleMoney: number;
  roomId: number;
  constructor(init?: Partial<StudentLeft>) {
    Object.assign(this, init);
  }
}
