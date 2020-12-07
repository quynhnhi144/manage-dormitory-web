export class VehicleBill {
  billId: number;
  studentName: string;
  studentId: number;
  studentIdCard: string;
  vehicleId: number;
  startDate: Date;
  endDate: Date;
  price: number;
  roomId: number;
  constructor(init?: Partial<VehicleBill>) {
    Object.assign(this, init);
  }
}
