export class StudentBill {
  studentId: number;
  studentName: string;
  roomId: number;
  roomName: string;
  studentIdCard: string;

  roomStartDate: Date;
  roomEndDate: Date;
  moneyOfRoomMustPay: number;
  maxQuantityStudent: number;

  waterStartDate: Date;
  waterEndDate: Date;
  moneyOfWaterMustPay: number;

  vehicleId: number;
  vehicleStartDate: Date;
  vehicleEndDate: Date;
  moneyOfVehicleMustPay: number;

  constructor(init?: Partial<StudentBill>) {
    Object.assign(this, init);
  }
}
