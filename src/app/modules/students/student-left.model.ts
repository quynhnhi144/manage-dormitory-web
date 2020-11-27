export class StudentLeft {
  id: number;
  name: string;
  leavingDate: Date;
  numberOfRoomMoney: number;
  numberOfWaterMoney: number;
  numberOfVehicleMoney: number;
  roomId: number;
  constructor(init?: Partial<StudentLeft>) {
    Object.assign(this, init);
  }
}
